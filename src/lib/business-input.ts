import { z } from "zod";

/**
 * "067 123 456" → "+38267123456", "+381 64…" stays international.
 * Returns null when it doesn't look like a phone number.
 */
export function normalizePhone(input: string) {
  let digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = `+382${digits.slice(1)}`;
  else if (digits.startsWith("382")) digits = `+${digits}`;
  else if (!digits.startsWith("+")) digits = `+382${digits}`;
  const count = digits.replace(/\D/g, "").length;
  return count >= 9 && count <= 15 && !digits.slice(1).includes("+")
    ? digits
    : null;
}

/** Splits the single "website or Instagram" field of the wizard. */
export function splitWebLink(input: string | undefined) {
  const value = input?.trim();
  if (!value) return { website: null, instagram: null };
  if (value.startsWith("@") || /instagram\.com/i.test(value)) {
    const handle = value
      .replace(/^@/, "")
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
      .replace(/\/.*$/, "");
    return { website: null, instagram: handle ? `@${handle}` : null };
  }
  return { website: normalizeUrl(value), instagram: null };
}

export function normalizeUrl(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  const url = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}

const phone = z.string().transform((v, ctx) => {
  const n = normalizePhone(v);
  if (!n) ctx.addIssue({ code: "custom", message: "phone" });
  return n ?? "";
});

const optionalPhone = z
  .string()
  .optional()
  .transform((v, ctx) => {
    if (!v?.trim()) return null;
    const n = normalizePhone(v);
    if (!n) ctx.addIssue({ code: "custom", message: "phone" });
    return n;
  });

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || null)
  .pipe(z.email({ message: "email" }).nullable());

export const newBusinessSchema = z.object({
  serviceIds: z.array(z.number().int().positive()).min(1, "services").max(3),
  cityId: z.number().int().positive({ message: "city" }),
  extraCityIds: z.array(z.number().int().positive()).max(40),
  online: z.boolean(),
  emergency: z.boolean(),
  name: z.string().trim().min(2, "name").max(80, "name"),
  description: z
    .string()
    .trim()
    .max(1500)
    .optional()
    .transform((v) => v || null),
  phone,
  viberSame: z.boolean(),
  whatsappSame: z.boolean(),
  email: optionalEmail,
  webLink: z.string().trim().max(200).optional(),
});

export type NewBusinessInput = z.input<typeof newBusinessSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  description: z
    .string()
    .trim()
    .max(1500)
    .optional()
    .transform((v) => v || null),
  phone,
  viber: optionalPhone,
  whatsapp: optionalPhone,
  email: optionalEmail,
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => normalizeUrl(v)),
  instagram: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((v) =>
      v
        ? splitWebLink(
            v.startsWith("@") || v.includes("instagram") ? v : `@${v}`,
          ).instagram
        : null,
    ),
  address: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => v || null),
  online: z.boolean(),
  emergency: z.boolean(),
  languages: z.array(z.string().max(16)).max(10),
});

export type ProfileInput = z.input<typeof profileSchema>;

export const hoursSchema = z
  .array(
    z.object({
      weekday: z.number().int().min(1).max(7),
      opensAt: z.string().regex(/^\d{2}:\d{2}$/),
      closesAt: z.string().regex(/^\d{2}:\d{2}$/),
    }),
  )
  .max(14);

export const priceListSchema = z
  .array(
    z
      .object({
        name: z.string().trim().min(1).max(120),
        kind: z.enum(["fixed", "from", "range", "on_request", "free"]),
        priceFrom: z.number().nonnegative().max(1_000_000).nullable(),
        priceTo: z.number().nonnegative().max(1_000_000).nullable(),
        unit: z.enum(["hour", "m2", "piece", "job", "session", "day", "month"]),
        serviceId: z.number().int().positive().nullable(),
      })
      .transform((item) => ({
        ...item,
        priceFrom:
          item.kind === "on_request" || item.kind === "free"
            ? null
            : item.priceFrom,
        priceTo: item.kind === "range" ? item.priceTo : null,
      }))
      .refine(
        (item) =>
          item.kind === "on_request" ||
          item.kind === "free" ||
          (item.priceFrom != null &&
            (item.kind !== "range" ||
              (item.priceTo != null && item.priceTo >= item.priceFrom))),
        { message: "price" },
      ),
  )
  .max(50);
