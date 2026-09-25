"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { pingIndexNow, profilePaths } from "@/lib/seo/indexnow";
import { SPONSOR_SLOTS } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export type AdminResult = { ok: true } | { ok: false; error: string };

const fail = (error: string): AdminResult => ({ ok: false, error });

/**
 * The admin's own session: RLS (is_admin) checks every write a second time,
 * and the audit log records who did what.
 */
async function adminSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return null;
  const adminId = data.user.id;
  const log = (entry: Omit<TablesInsert<"admin_actions">, "admin_id" | "id">) =>
    supabase.from("admin_actions").insert({ ...entry, admin_id: adminId });
  return { supabase, adminId, log };
}

const note = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((v) => v || null);

function refreshPublic() {
  updateTag("businesses");
  updateTag("reviews");
  updateTag("sponsorships");
  updateTag("prices");
}

const BUSINESS_ACTIONS = [
  "approve",
  "verify",
  "unverify",
  "reject",
  "suspend",
  "restore",
] as const;
export type BusinessAction = (typeof BUSINESS_ACTIONS)[number];

/**
 * approve: clears "Na provjeri"; verify: "Provjeren" badge (the phone
 * checked); reject/suspend hide the profile, with a note the owner sees.
 */
export async function moderateBusiness(
  businessId: string,
  action: BusinessAction,
  rawNote?: string,
): Promise<AdminResult> {
  const parsed = z
    .object({
      businessId: z.uuid(),
      action: z.enum(BUSINESS_ACTIONS),
      note,
    })
    .safeParse({ businessId, action, note: rawNote });
  if (!parsed.success) return fail("invalid");
  const admin = await adminSession();
  if (!admin) return fail("auth");
  const v = parsed.data;
  if ((v.action === "reject" || v.action === "suspend") && !v.note)
    return fail("note");

  const now = new Date().toISOString();
  const patches: Record<BusinessAction, TablesUpdate<"businesses">> = {
    approve: { status: "active", moderated_at: now, moderation_note: null },
    verify: { verified_at: now },
    unverify: { verified_at: null },
    reject: { status: "rejected", moderated_at: now, moderation_note: v.note },
    suspend: { status: "suspended", moderation_note: v.note },
    restore: { status: "active", moderation_note: null },
  };
  const patch = patches[v.action];

  // Verifying also counts as reviewing the profile.
  if (v.action === "verify") {
    const { data } = await admin.supabase
      .from("businesses")
      .select("moderated_at")
      .eq("id", v.businessId)
      .maybeSingle();
    if (!data?.moderated_at) patch.moderated_at = now;
  }

  const { data: updated, error } = await admin.supabase
    .from("businesses")
    .update(patch)
    .eq("id", v.businessId)
    .select("slug")
    .maybeSingle();
  if (error || !updated) {
    console.error("moderateBusiness failed", error?.message);
    return fail("generic");
  }
  await admin.log({
    action: `business.${v.action}`,
    business_id: v.businessId,
    note: v.note,
  });
  refreshPublic();
  // Approved, verified, hidden or restored: let Bing/Yandex recrawl it.
  pingIndexNow(profilePaths(updated.slug));
  return { ok: true };
}

export async function moderateReview(
  reviewId: string,
  status: "published" | "hidden" | "removed",
  rawNote?: string,
): Promise<AdminResult> {
  const parsed = z
    .object({
      reviewId: z.uuid(),
      status: z.enum(["published", "hidden", "removed"]),
      note,
    })
    .safeParse({ reviewId, status, note: rawNote });
  if (!parsed.success) return fail("invalid");
  const admin = await adminSession();
  if (!admin) return fail("auth");
  const v = parsed.data;

  const { data, error } = await admin.supabase
    .from("reviews")
    .update({ status: v.status })
    .eq("id", v.reviewId)
    .select("business_id")
    .maybeSingle();
  if (error || !data) {
    console.error("moderateReview failed", error?.message);
    return fail("generic");
  }
  await admin.log({
    action: `review.${v.status === "published" ? "restore" : v.status}`,
    review_id: v.reviewId,
    business_id: data.business_id,
    note: v.note,
  });
  refreshPublic();
  return { ok: true };
}

export async function resolveReport(
  reportId: string,
  status: "resolved" | "dismissed",
  rawNote?: string,
): Promise<AdminResult> {
  const parsed = z
    .object({
      reportId: z.uuid(),
      status: z.enum(["resolved", "dismissed"]),
      note,
    })
    .safeParse({ reportId, status, note: rawNote });
  if (!parsed.success) return fail("invalid");
  const admin = await adminSession();
  if (!admin) return fail("auth");
  const v = parsed.data;

  const { data, error } = await admin.supabase
    .from("reports")
    .update({
      status: v.status,
      resolved_by: admin.adminId,
      resolved_at: new Date().toISOString(),
      resolution_note: v.note,
    })
    .eq("id", v.reportId)
    .select("business_id, review_id")
    .maybeSingle();
  if (error || !data) {
    console.error("resolveReport failed", error?.message);
    return fail("generic");
  }
  await admin.log({
    action: `report.${v.status}`,
    report_id: v.reportId,
    business_id: data.business_id,
    review_id: data.review_id,
    note: v.note,
  });
  return { ok: true };
}

const placementSchema = z
  .object({
    scope: z.enum(["home", "service", "city", "service_city"]),
    serviceId: z.number().int().positive().nullable(),
    cityId: z.number().int().positive().nullable(),
  })
  .refine(
    (p) =>
      (p.scope === "service" || p.scope === "service_city") ===
      (p.serviceId != null),
    { message: "service" },
  )
  .refine(
    (p) =>
      (p.scope === "city" || p.scope === "service_city") === (p.cityId != null),
    { message: "city" },
  );

const sponsorshipSchema = z
  .object({
    businessId: z.uuid({ message: "business" }),
    placements: z.array(placementSchema).min(1, "placements").max(30),
    startsAt: z.iso.date({ message: "dates" }),
    endsAt: z.iso.date({ message: "dates" }),
    paymentRef: note,
  })
  .refine((s) => s.endsAt >= s.startsAt, { message: "dates" });

export type SponsorshipInput = z.input<typeof sponsorshipSchema>;

/** "2026-10-01" at the given time in Montenegro (UTC+1, +2 in summer) as ISO. */
function podgoricaTime(date: string, time: string) {
  const guess = new Date(`${date}T${time}Z`);
  const local = new Date(
    guess.toLocaleString("en-US", { timeZone: "Europe/Podgorica" }),
  );
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(
    guess.getTime() - (local.getTime() - utc.getTime()),
  ).toISOString();
}

/**
 * Manual sponsorship (bank transfer, cash) until online payments exist: one
 * business, one period, any number of placements (home, service, city,
 * service + city). Duplicate placements are saved once.
 */
export async function createSponsorships(
  input: SponsorshipInput,
): Promise<AdminResult & { count?: number }> {
  const parsed = sponsorshipSchema.safeParse(input);
  if (!parsed.success)
    return fail(String(parsed.error.issues[0]?.message ?? "invalid"));
  const admin = await adminSession();
  if (!admin) return fail("auth");
  const v = parsed.data;

  const unique = [
    ...new Map(
      v.placements.map((p) => [`${p.scope}:${p.serviceId}:${p.cityId}`, p]),
    ).values(),
  ];

  // Each page has SPONSOR_SLOTS spots; refuse a placement that is already
  // full for any part of the period (paused sponsorships keep their spot).
  const startsAt = podgoricaTime(v.startsAt, "00:00:00");
  const endsAt = podgoricaTime(v.endsAt, "23:59:59");
  for (const p of unique) {
    let taken = createAdminClient()
      .from("sponsorships")
      .select("id", { count: "exact", head: true })
      .eq("scope", p.scope)
      .in("status", ["active", "paused"])
      .lte("starts_at", endsAt)
      .gte("ends_at", startsAt);
    taken = p.serviceId
      ? taken.eq("service_id", p.serviceId)
      : taken.is("service_id", null);
    taken = p.cityId
      ? taken.eq("city_id", p.cityId)
      : taken.is("city_id", null);
    const { count } = await taken;
    const slots = p.scope === "home" ? SPONSOR_SLOTS.home : SPONSOR_SLOTS.page;
    if ((count ?? 0) >= slots)
      return fail(`full:${p.scope}:${p.serviceId ?? ""}:${p.cityId ?? ""}`);
  }

  const { data, error } = await admin.supabase
    .from("sponsorships")
    .insert(
      unique.map((p) => ({
        business_id: v.businessId,
        scope: p.scope,
        service_id: p.serviceId,
        city_id: p.cityId,
        // Whole days in Montenegro time.
        starts_at: startsAt,
        ends_at: endsAt,
        payment_ref: v.paymentRef ?? "manual",
      })),
    )
    .select("id");
  if (error) {
    console.error("createSponsorships failed", error.message);
    return fail("generic");
  }
  await admin.supabase.from("admin_actions").insert(
    data.map((row) => ({
      admin_id: admin.adminId,
      action: "sponsorship.create",
      sponsorship_id: row.id,
      business_id: v.businessId,
      note: v.paymentRef,
    })),
  );
  refreshPublic();
  return { ok: true, count: data.length };
}

export async function setSponsorshipStatus(
  sponsorshipId: string,
  status: "active" | "paused" | "cancelled",
): Promise<AdminResult> {
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(["active", "paused", "cancelled"]),
    })
    .safeParse({ id: sponsorshipId, status });
  if (!parsed.success) return fail("invalid");
  const admin = await adminSession();
  if (!admin) return fail("auth");

  const { data, error } = await admin.supabase
    .from("sponsorships")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("business_id")
    .maybeSingle();
  if (error || !data) return fail("generic");
  await admin.log({
    action: `sponsorship.${parsed.data.status}`,
    sponsorship_id: parsed.data.id,
    business_id: data.business_id,
  });
  refreshPublic();
  return { ok: true };
}

/** Business picker for the sponsorship form. */
export async function searchBusinessesForAdmin(q: string) {
  const admin = await adminSession();
  const term = q.trim().replace(/[%_,()]/g, " ");
  if (!admin || term.length < 2) return [];
  const { data } = await createAdminClient()
    .from("businesses")
    .select("id, name, slug, city_id")
    .or(`name.ilike.%${term}%,slug.ilike.%${term}%`)
    .order("name")
    .limit(10);
  return data ?? [];
}

/** Reject spam/abusive requests (or put a rejected one back). */
export async function moderateInquiry(
  inquiryId: string,
  status: "approved" | "rejected",
  rawNote?: string,
): Promise<AdminResult> {
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(["approved", "rejected"]),
      note,
    })
    .safeParse({ id: inquiryId, status, note: rawNote });
  if (!parsed.success) return fail("invalid");
  const admin = await adminSession();
  if (!admin) return fail("auth");

  const { data, error } = await admin.supabase
    .from("inquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("business_id")
    .maybeSingle();
  if (error || !data) return fail("generic");
  await admin.log({
    action: `inquiry.${parsed.data.status === "rejected" ? "reject" : "restore"}`,
    business_id: data.business_id,
    note: parsed.data.note,
  });
  return { ok: true };
}

const bannerSchema = z
  .object({
    scope: z.enum(["home", "service", "city"]),
    serviceId: z.number().int().positive().nullable(),
    cityId: z.number().int().positive().nullable(),
    advertiser: z.string().trim().min(2, "advertiser").max(80, "advertiser"),
    title: z.string().trim().min(2, "title").max(60, "title"),
    body: z
      .string()
      .trim()
      .max(140)
      .optional()
      .transform((v) => v || null),
    cta: z
      .string()
      .trim()
      .max(30)
      .optional()
      .transform((v) => v || null),
    linkUrl: z
      .string()
      .trim()
      .url("link")
      .refine((u) => /^https?:\/\//.test(u), "link"),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "color"),
    logoPath: z.string().max(200).nullable(),
    startsAt: z.iso.date({ message: "dates" }),
    endsAt: z.iso.date({ message: "dates" }),
    paymentRef: note,
  })
  .refine((b) => b.endsAt >= b.startsAt, { message: "dates" })
  .refine((b) => b.scope !== "service" || b.serviceId != null, {
    message: "service",
  })
  .refine((b) => b.scope !== "city" || b.cityId != null, { message: "city" });

export type BannerInput = z.input<typeof bannerSchema>;

/** Books a banner; one advertiser per placement (home, a service, a town) at a time. */
export async function createBanner(input: BannerInput): Promise<AdminResult> {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success)
    return fail(String(parsed.error.issues[0]?.message ?? "invalid"));
  const admin = await adminSession();
  if (!admin) return fail("auth");
  const v = parsed.data;
  const startsAt = podgoricaTime(v.startsAt, "00:00:00");
  const endsAt = podgoricaTime(v.endsAt, "23:59:59");

  const serviceId = v.scope === "service" ? v.serviceId : null;
  const cityId = v.scope === "city" ? v.cityId : null;
  let taken = createAdminClient()
    .from("banners")
    .select("id", { count: "exact", head: true })
    .eq("scope", v.scope)
    .in("status", ["active", "paused"])
    .lte("starts_at", endsAt)
    .gte("ends_at", startsAt);
  if (serviceId) taken = taken.eq("service_id", serviceId);
  if (cityId) taken = taken.eq("city_id", cityId);
  const { count } = await taken;
  if (count) return fail("taken");

  const { error } = await admin.supabase.from("banners").insert({
    scope: v.scope,
    service_id: serviceId,
    city_id: cityId,
    advertiser: v.advertiser,
    title: v.title,
    body: v.body,
    cta: v.cta,
    link_url: v.linkUrl,
    color: v.color,
    logo_path: v.logoPath,
    starts_at: startsAt,
    ends_at: endsAt,
    payment_ref: v.paymentRef ?? "manual",
  });
  if (error) {
    console.error("createBanner failed", error.message);
    return fail("generic");
  }
  await admin.log({
    action: "banner.create",
    note: `${v.advertiser}: ${v.title}`,
  });
  updateTag("banners");
  return { ok: true };
}

export async function setBannerStatus(
  bannerId: string,
  status: "active" | "paused" | "cancelled",
): Promise<AdminResult> {
  const parsed = z
    .object({ id: z.uuid(), status: z.enum(["active", "paused", "cancelled"]) })
    .safeParse({ id: bannerId, status });
  if (!parsed.success) return fail("invalid");
  const admin = await adminSession();
  if (!admin) return fail("auth");
  const { data, error } = await admin.supabase
    .from("banners")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("advertiser")
    .maybeSingle();
  if (error || !data) return fail("generic");
  await admin.log({
    action: `banner.${parsed.data.status}`,
    note: data.advertiser,
  });
  updateTag("banners");
  return { ok: true };
}
