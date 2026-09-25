"use server";

import { z } from "zod";
import { normalizePhone } from "@/lib/business-input";
import { getIndexability } from "@/lib/seo/indexable";
import { createClient } from "@/lib/supabase/server";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string): { ok: false; error: string } => ({
  ok: false,
  error,
});

const inquirySchema = z.object({
  serviceId: z.number({ message: "service" }).int().positive("service"),
  cityId: z.number({ message: "city" }).int().positive("city"),
  businessId: z.uuid().nullable().optional(),
  body: z.string().trim().min(20, "body").max(4000, "body"),
  preferredTime: z.enum(["asap", "this_week", "this_month", "flexible"]),
  urgent: z.boolean(),
  phone: z.string().transform((v, ctx) => {
    const n = normalizePhone(v);
    if (!n) ctx.addIssue({ code: "custom", message: "phone" });
    return n ?? "";
  }),
});

export type InquiryInput = z.input<typeof inquirySchema>;

/**
 * Publishes a job request. It's visible right away to every active business
 * offering the service in that town (or only to businessId), for 30 days.
 */
export async function createInquiry(
  input: InquiryInput,
): Promise<Result<{ recipients: number }>> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return fail(String(parsed.error.issues[0]?.message));
  const v = parsed.data;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");

  const { error } = await supabase.from("inquiries").insert({
    user_id: auth.user.id,
    service_id: v.serviceId,
    city_id: v.cityId,
    business_id: v.businessId ?? null,
    body: v.body,
    preferred_time: v.preferredTime,
    urgent: v.urgent,
    phone: v.phone,
    status: "approved",
  });
  if (error) {
    if (error.message.includes("rate_limited")) return fail("limit");
    console.error("createInquiry failed", error.message);
    return fail("generic");
  }
  const recipients = v.businessId
    ? 1
    : (await getIndexability()).comboCount(v.serviceId, v.cityId);
  return { ok: true, recipients };
}

export async function closeInquiry(inquiryId: string): Promise<Result> {
  if (!z.uuid().safeParse(inquiryId).success) return fail("generic");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");
  const { error, count } = await supabase
    .from("inquiries")
    .update(
      { status: "closed", closed_at: new Date().toISOString() },
      { count: "exact" },
    )
    .eq("id", inquiryId)
    .eq("user_id", auth.user.id);
  if (error || !count) return fail("generic");
  return { ok: true };
}

/** Owner of a matching business opens the customer's phone (counted). */
export async function revealInquiry(
  inquiryId: string,
  businessId: string,
): Promise<Result<{ phone: string; name: string | null }>> {
  if (
    !z.uuid().safeParse(inquiryId).success ||
    !z.uuid().safeParse(businessId).success
  )
    return fail("generic");
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("reveal_inquiry_contact", {
      p_inquiry_id: inquiryId,
      p_business_id: businessId,
    })
    .maybeSingle();
  if (error?.message.includes("rate_limited")) return fail("limit");
  if (error || !data?.phone) return fail("generic");
  return { ok: true, phone: data.phone, name: data.name };
}
