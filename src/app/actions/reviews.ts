"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({
  ok: false,
  error,
});

/** Maps trigger errors (see the moderation migration) to UI messages. */
function reason(message: string | undefined | null) {
  if (message?.includes("rate_limited")) return "limit";
  if (message?.includes("Owners cannot review")) return "own";
  return "generic";
}

/** Rating changes show on cards, listings and the profile. */
function refreshReviews() {
  updateTag("reviews");
  updateTag("businesses");
}

const reviewSchema = z.object({
  businessId: z.uuid(),
  rating: z.number().int().min(1, "rating").max(5, "rating"),
  body: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || null),
  name: z.string().trim().max(80).optional(),
});

/**
 * Creates the user's review or updates it (one review per business). If the
 * profile has no name yet (email sign-in), the name from the form is saved.
 */
export async function submitReview(
  input: z.input<typeof reviewSchema>,
): Promise<Result<{ updated: boolean; reviewId: string }>> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return fail(String(parsed.error.issues[0]?.message));
  const v = parsed.data;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");
  const userId = auth.user.id;

  const [{ data: profile }, { data: existing }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("reviews")
      .select("id")
      .eq("business_id", v.businessId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (!profile?.full_name?.trim()) {
    if (!v.name || v.name.length < 2) return fail("name");
    await Promise.all([
      supabase.from("profiles").update({ full_name: v.name }).eq("id", userId),
      supabase.auth.updateUser({ data: { full_name: v.name } }),
    ]);
  }

  const { data: saved, error } = existing
    ? await supabase
        .from("reviews")
        .update({ rating: v.rating, body: v.body })
        .eq("id", existing.id)
        .select("id")
        .single()
    : await supabase
        .from("reviews")
        .insert({
          business_id: v.businessId,
          user_id: userId,
          rating: v.rating,
          body: v.body,
        })
        .select("id")
        .single();
  if (error || !saved) {
    if (reason(error?.message) === "generic")
      console.error("submitReview failed", error?.message);
    return fail(reason(error?.message));
  }

  refreshReviews();
  return { ok: true, updated: Boolean(existing), reviewId: saved.id };
}

export async function deleteReview(reviewId: string): Promise<Result> {
  if (!z.uuid().safeParse(reviewId).success) return fail("generic");
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");

  const { error, count } = await supabase
    .from("reviews")
    .delete({ count: "exact" })
    .eq("id", reviewId)
    .eq("user_id", auth.user.id);
  if (error || !count) return fail("generic");
  refreshReviews();
  return { ok: true };
}

const photoSchema = z
  .array(
    z.object({
      path: z.string().max(200),
      width: z.number().int().positive().nullable(),
      height: z.number().int().positive().nullable(),
    }),
  )
  .max(4);

/**
 * Registers photos the author uploaded to review-photos/{reviewId}/ (RLS:
 * only the review's author; at most 4 per review, enforced in the database).
 */
export async function addReviewPhotos(
  reviewId: string,
  photos: z.input<typeof photoSchema>,
): Promise<Result> {
  const parsed = photoSchema.safeParse(photos);
  if (!z.uuid().safeParse(reviewId).success || !parsed.success)
    return fail("generic");
  if (!parsed.data.length) return { ok: true };
  if (parsed.data.some((p) => !p.path.startsWith(`${reviewId}/`)))
    return fail("generic");

  const supabase = await createClient();
  const { count } = await supabase
    .from("review_photos")
    .select("id", { count: "exact", head: true })
    .eq("review_id", reviewId);
  const { error } = await supabase.from("review_photos").insert(
    parsed.data.map((p, i) => ({
      review_id: reviewId,
      storage_path: p.path,
      width: p.width,
      height: p.height,
      sort_order: (count ?? 0) + i,
    })),
  );
  if (error) {
    console.error("addReviewPhotos failed", error.message);
    return fail(
      error.message.includes("too_many_photos") ? "photos" : "generic",
    );
  }
  updateTag("reviews");
  return { ok: true };
}

export async function deleteReviewPhoto(photoId: string): Promise<Result> {
  if (!z.uuid().safeParse(photoId).success) return fail("generic");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_photos")
    .delete()
    .eq("id", photoId)
    .select("storage_path")
    .maybeSingle();
  if (error || !data) return fail("generic");
  await supabase.storage.from("review-photos").remove([data.storage_path]);
  updateTag("reviews");
  return { ok: true };
}

/** Owner's public reply; an empty text removes it. */
export async function replyToReview(
  reviewId: string,
  body: string,
): Promise<Result> {
  const parsed = z
    .object({ reviewId: z.uuid(), body: z.string().trim().max(2000) })
    .safeParse({ reviewId, body });
  if (!parsed.success) return fail("generic");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");

  const { data: review } = await supabase
    .from("reviews")
    .select("id, businesses!inner(owner_id)")
    .eq("id", parsed.data.reviewId)
    .maybeSingle();
  if (!review || review.businesses.owner_id !== auth.user.id)
    return fail("generic");

  const { error } = await supabase
    .from("reviews")
    .update({ reply_body: parsed.data.body || null })
    .eq("id", review.id);
  if (error) {
    console.error("replyToReview failed", error.message);
    return fail("generic");
  }
  updateTag("reviews");
  return { ok: true };
}

const reportSchema = z
  .object({
    target: z.enum(["business", "review"]),
    businessId: z.uuid().optional(),
    reviewId: z.uuid().optional(),
    reason: z.enum(
      ["inappropriate", "abusive", "false_info", "spam", "other"],
      {
        message: "reason",
      },
    ),
    details: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .transform((v) => v || null),
  })
  .refine((r) => (r.target === "business" ? r.businessId : r.reviewId), {
    message: "generic",
  });

/** Files a report for admins. Reporting the same thing twice is a no-op. */
export async function createReport(
  input: z.input<typeof reportSchema>,
): Promise<Result<{ already: boolean }>> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return fail(String(parsed.error.issues[0]?.message));
  const v = parsed.data;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return fail("auth");

  const { error } = await supabase.from("reports").insert({
    reporter_id: auth.user.id,
    target: v.target,
    business_id: v.target === "business" ? v.businessId : null,
    review_id: v.target === "review" ? v.reviewId : null,
    reason: v.reason,
    details: v.details,
  });
  if (error?.code === "23505") return { ok: true, already: true };
  if (error) {
    if (reason(error.message) === "generic")
      console.error("createReport failed", error.message);
    return fail(reason(error.message));
  }
  return { ok: true, already: false };
}
