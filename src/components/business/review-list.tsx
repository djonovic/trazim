import { Star } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { ijekavian } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { ReportButton } from "@/components/reviews/report-button";
import { ReviewPhotos } from "@/components/reviews/review-photos";
import type { ReviewItem } from "@/lib/queries/businesses";
import { cn } from "@/lib/utils";

export function Stars({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i <= value ? "fill-warm text-warm" : "fill-border text-border",
          )}
        />
      ))}
    </span>
  );
}

export function ReviewList({
  reviews,
  showBusiness = false,
  reportable = false,
  cityNames = {},
}: {
  reviews: ReviewItem[];
  showBusiness?: boolean;
  /** Shows "Prijavi" under each review (profile page). */
  reportable?: boolean;
  cityNames?: Record<number, string>;
}) {
  const t = useTranslations("Profile");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const locale = useLocale() as Locale;

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {reviews.map((r) => (
        <li key={r.id} className="space-y-2 rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                {r.author.slice(0, 1)}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{r.author}</p>
                <p className="text-xs text-muted-foreground">
                  {ijekavian(
                    format.relativeTime(new Date(r.createdAt)),
                    locale,
                  )}
                  {r.editedAt && ` · ${t("edited")}`}
                </p>
              </div>
            </div>
            <Stars value={r.rating} />
            <span className="sr-only">
              {tc("rating", { rating: r.rating })}
            </span>
          </div>
          {showBusiness && r.business && (
            <Link
              href={{
                pathname: "/b/[slug]",
                params: { slug: r.business.slug },
              }}
              className="block text-sm font-semibold text-primary hover:underline"
            >
              {r.business.name}
              {cityNames[r.business.cityId] && (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {cityNames[r.business.cityId]}
                </span>
              )}
            </Link>
          )}
          {r.body && (
            <p className="line-clamp-4 text-[15px] leading-relaxed">{r.body}</p>
          )}
          <ReviewPhotos
            photos={r.photos}
            alt={t("customerPhoto", { name: r.author })}
          />
          {r.reply && (
            <div className="ml-4 rounded-xl bg-muted p-3 text-sm">
              <p className="mb-1 font-semibold">{t("ownerReply")}</p>
              <p className="text-muted-foreground">{r.reply}</p>
            </div>
          )}
          {reportable && (
            <div className="flex justify-end">
              <ReportButton target="review" reviewId={r.id} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
