"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import {
  hoursSchema,
  newBusinessSchema,
  priceListSchema,
  profileSchema,
  splitWebLink,
  type NewBusinessInput,
  type ProfileInput,
} from "@/lib/business-input";
import { pingIndexNow, profilePaths } from "@/lib/seo/indexnow";
import { slugify } from "@/lib/slug";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Result<T = object> =
  ({ ok: true } & T) | { ok: false; error: string; fields?: string[] };

const fail = (
  error: string,
  fields?: string[],
): { ok: false; error: string; fields?: string[] } => ({
  ok: false,
  error,
  fields,
});

function fieldErrors(error: z.ZodError) {
  return [...new Set(error.issues.map((i) => String(i.message)))];
}

/** Writes go through the user's session, so RLS enforces ownership; we also check it for a clear error. */
async function ownerClient(businessId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: row } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("id", businessId)
    .eq("owner_id", data.user.id)
    .maybeSingle();
  return row ? { supabase, business: row, userId: data.user.id } : null;
}

/** Public pages read cached data; drop it so the owner sees their change right away. */
function refreshPublicPages(slug?: string) {
  updateTag("businesses");
  updateTag("prices");
  // Bing/Yandex recrawl the profile right away (Google uses the sitemap).
  if (slug) pingIndexNow(profilePaths(slug));
}

async function uniqueSlug(base: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("businesses")
    .select("slug")
    .like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i++)
    if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  return `${base}-${Date.now().toString(36)}`;
}

export async function createBusiness(
  input: NewBusinessInput,
): Promise<Result<{ id: string; slug: string }>> {
  const parsed = newBusinessSchema.safeParse(input);
  if (!parsed.success) return fail("invalid", fieldErrors(parsed.error));
  const v = parsed.data;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");

  const { data: city } = await supabase
    .from("cities")
    .select("slug")
    .eq("id", v.cityId)
    .maybeSingle();
  if (!city) return fail("invalid", ["city"]);

  const nameSlug = slugify(v.name).slice(0, 50).replace(/-+$/, "") || "biznis";
  const base = nameSlug.endsWith(city.slug)
    ? nameSlug
    : `${nameSlug}-${city.slug}`;
  const { website, instagram } = splitWebLink(v.webLink);

  // Retry once if another signup grabbed the same slug in between.
  for (let attempt = 0; attempt < 2; attempt++) {
    const slug = await uniqueSlug(base);
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        owner_id: auth.user.id,
        slug,
        name: v.name,
        description: v.description,
        phone: v.phone,
        viber: v.viberSame ? v.phone : null,
        whatsapp: v.whatsappSame ? v.phone : null,
        email: v.email,
        website,
        instagram,
        city_id: v.cityId,
        offers_online: v.online,
        emergency_24h: v.emergency,
        status: "active",
      })
      .select("id")
      .single();

    if (error?.code === "23505") continue;
    if (error || !data) {
      console.error("createBusiness insert failed", error?.message);
      return fail("generic");
    }

    const serviceRows = v.serviceIds.map((service_id) => ({
      business_id: data.id,
      service_id,
      is_primary: true,
    }));
    const cityRows = [...new Set(v.extraCityIds)]
      .filter((id) => id !== v.cityId)
      .map((city_id) => ({ business_id: data.id, city_id }));
    const [s, c] = await Promise.all([
      supabase.from("business_services").insert(serviceRows),
      cityRows.length
        ? supabase.from("business_cities").insert(cityRows)
        : Promise.resolve({ error: null }),
    ]);
    if (s.error || c.error)
      console.error(
        "createBusiness relations failed",
        s.error?.message,
        c.error?.message,
      );

    refreshPublicPages(slug);
    return { ok: true, id: data.id, slug };
  }
  return fail("generic");
}

export async function updateProfile(
  businessId: string,
  input: ProfileInput,
): Promise<Result> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return fail("invalid", fieldErrors(parsed.error));
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const v = parsed.data;

  const { error } = await owner.supabase
    .from("businesses")
    .update({
      name: v.name,
      description: v.description,
      phone: v.phone,
      viber: v.viber ?? v.phone,
      whatsapp: v.whatsapp ?? v.phone,
      email: v.email,
      website: v.website,
      instagram: v.instagram,
      address: v.address,
      offers_online: v.online,
      emergency_24h: v.emergency,
      languages: v.languages.length ? v.languages : ["sr-Latn-ME"],
    })
    .eq("id", businessId);
  if (error) {
    console.error("updateProfile failed", error.message);
    return fail("generic");
  }
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}

const servicesSchema = z.object({
  primaryIds: z.array(z.number().int().positive()).min(1, "services").max(3),
  otherIds: z.array(z.number().int().positive()).max(20),
  cityId: z.number().int().positive(),
  cityIds: z.array(z.number().int().positive()).max(40),
});

export async function setServicesAndCities(
  businessId: string,
  input: z.input<typeof servicesSchema>,
): Promise<Result> {
  const parsed = servicesSchema.safeParse(input);
  if (!parsed.success) return fail("invalid", fieldErrors(parsed.error));
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const { primaryIds, otherIds, cityId, cityIds } = parsed.data;
  const db = owner.supabase;

  const services = [
    ...primaryIds.map((id) => ({
      business_id: businessId,
      service_id: id,
      is_primary: true,
    })),
    ...otherIds
      .filter((id) => !primaryIds.includes(id))
      .map((id) => ({
        business_id: businessId,
        service_id: id,
        is_primary: false,
      })),
  ];
  const cities = [...new Set([cityId, ...cityIds])].map((id) => ({
    business_id: businessId,
    city_id: id,
  }));

  const steps = [
    await db
      .from("businesses")
      .update({ city_id: cityId })
      .eq("id", businessId),
    await db.from("business_services").delete().eq("business_id", businessId),
    await db.from("business_services").insert(services),
    await db.from("business_cities").delete().eq("business_id", businessId),
    await db.from("business_cities").insert(cities),
  ];
  const failed = steps.find((s) => s.error);
  if (failed) {
    console.error("setServicesAndCities failed", failed.error?.message);
    return fail("generic");
  }
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}

export async function setHours(
  businessId: string,
  input: z.input<typeof hoursSchema>,
): Promise<Result> {
  const parsed = hoursSchema.safeParse(input);
  if (!parsed.success) return fail("invalid");
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const db = owner.supabase;

  const del = await db
    .from("business_hours")
    .delete()
    .eq("business_id", businessId);
  const ins = parsed.data.length
    ? await db.from("business_hours").insert(
        parsed.data.map((h) => ({
          business_id: businessId,
          weekday: h.weekday,
          opens_at: h.opensAt,
          closes_at: h.closesAt,
        })),
      )
    : { error: null };
  if (del.error || ins.error) return fail("generic");
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}

export async function setPriceList(
  businessId: string,
  input: z.input<typeof priceListSchema>,
): Promise<Result> {
  const parsed = priceListSchema.safeParse(input);
  if (!parsed.success) return fail("invalid", fieldErrors(parsed.error));
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const db = owner.supabase;

  const del = await db
    .from("price_list_items")
    .delete()
    .eq("business_id", businessId);
  const ins = parsed.data.length
    ? await db.from("price_list_items").insert(
        parsed.data.map((item, i) => ({
          business_id: businessId,
          service_id: item.serviceId,
          name: item.name,
          kind: item.kind,
          price_from: item.priceFrom,
          price_to: item.priceTo,
          unit: item.unit,
          sort_order: i,
        })),
      )
    : { error: null };
  if (del.error || ins.error) {
    console.error(
      "setPriceList failed",
      del.error?.message ?? ins.error?.message,
    );
    return fail("generic");
  }
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}

const photoSchema = z.array(
  z.object({
    path: z.string().regex(/^[0-9a-f-]{36}\/[\w.-]+$/),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
  }),
);

/** Registers photos the browser already uploaded to Storage (RLS lets owners upload into their folder). */
export async function addPhotos(
  businessId: string,
  input: z.input<typeof photoSchema>,
): Promise<Result> {
  const parsed = photoSchema.safeParse(input);
  if (
    !parsed.success ||
    parsed.data.some((p) => !p.path.startsWith(`${businessId}/`))
  )
    return fail("invalid");
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const db = owner.supabase;

  const { data: existing } = await db
    .from("business_photos")
    .select("id, is_cover, sort_order")
    .eq("business_id", businessId);
  const count = existing?.length ?? 0;
  if (count + parsed.data.length > 10) return fail("limit");
  const hasCover = existing?.some((p) => p.is_cover) ?? false;
  const maxOrder = Math.max(0, ...(existing ?? []).map((p) => p.sort_order));

  const { error } = await db.from("business_photos").insert(
    parsed.data.map((p, i) => ({
      business_id: businessId,
      storage_path: p.path,
      width: p.width,
      height: p.height,
      is_cover: !hasCover && i === 0,
      sort_order: maxOrder + i + 1,
    })),
  );
  if (error) {
    console.error("addPhotos failed", error.message);
    return fail("generic");
  }
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}

export async function deletePhoto(
  businessId: string,
  photoId: string,
): Promise<Result> {
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const db = owner.supabase;
  const { data: photo } = await db
    .from("business_photos")
    .select("id, storage_path, is_cover")
    .eq("id", photoId)
    .eq("business_id", businessId)
    .maybeSingle();
  if (!photo) return fail("invalid");

  await db.storage.from("business-photos").remove([photo.storage_path]);
  await db.from("business_photos").delete().eq("id", photoId);
  if (photo.is_cover) {
    // Promote the next photo so the card never loses its cover.
    const { data: next } = await db
      .from("business_photos")
      .select("id")
      .eq("business_id", businessId)
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    if (next)
      await db
        .from("business_photos")
        .update({ is_cover: true })
        .eq("id", next.id);
  }
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}

export async function setCoverPhoto(
  businessId: string,
  photoId: string,
): Promise<Result> {
  const owner = await ownerClient(businessId);
  if (!owner) return fail("auth");
  const db = owner.supabase;
  // Unique index allows one cover per business: clear first, then set.
  await db
    .from("business_photos")
    .update({ is_cover: false })
    .eq("business_id", businessId)
    .eq("is_cover", true);
  const { error } = await db
    .from("business_photos")
    .update({ is_cover: true })
    .eq("id", photoId)
    .eq("business_id", businessId);
  if (error) return fail("generic");
  refreshPublicPages(owner.business.slug);
  return { ok: true };
}
