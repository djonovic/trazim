import { BadgeCheck, Eye, Siren, Wifi, Zap } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEur, viewsBucket } from "@/lib/format";
import type { BusinessCard as Card } from "@/lib/queries/businesses";
import { cn } from "@/lib/utils";
import { OpenNowBadge } from "./open-now-badge";
import { Rating } from "./rating";

export function BusinessCard({
  business,
  cityName,
  serviceNames,
  sponsored = false,
  priority = false,
}: {
  business: Card;
  cityName: string;
  serviceNames: string[];
  sponsored?: boolean;
  priority?: boolean;
}) {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const views = viewsBucket(business.views);
  const badge = sponsored ? (
    <span className="rounded-full bg-warm px-2 py-0.5 text-xs font-semibold text-warm-foreground">
      {t("sponsored")}
    </span>
  ) : business.isNew ? (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary sm:bg-white/95 sm:text-foreground">
      {t("new")}
    </span>
  ) : null;

  return (
    <Link
      href={{ pathname: "/b/[slug]", params: { slug: business.slug } }}
      className={cn(
        // Phones: photo on the left, details on the right; wider screens: a
        // card with the photo on top.
        "group flex gap-3.5 overflow-hidden rounded-2xl border bg-card p-3 transition-shadow hover:shadow-md sm:flex-col sm:gap-0 sm:p-0",
        sponsored && "border-warm/60",
      )}
    >
      <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-[16/10] sm:size-auto sm:rounded-none">
        {business.coverUrl ? (
          <Image
            src={business.coverUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 112px"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-secondary to-accent text-3xl font-extrabold text-primary/40 sm:text-4xl">
            {business.name.slice(0, 1)}
          </div>
        )}
        {badge && (
          <div className="absolute top-2 left-2 hidden gap-1 sm:flex">
            {badge}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 sm:justify-start sm:gap-1.5 sm:p-4">
        {badge && <div className="flex sm:hidden">{badge}</div>}
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[17px] leading-snug font-bold group-hover:text-primary sm:text-base">
            {business.name}
            {business.verified && (
              <BadgeCheck
                className="ml-1 inline size-4 align-[-2px] text-primary"
                aria-label={t("verified")}
              />
            )}
          </h3>
          {business.priceFrom != null && (
            <span className="shrink-0 text-sm font-semibold text-primary">
              {t("priceFrom", { price: formatEur(business.priceFrom, locale) })}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Rating value={business.rating} count={business.ratingCount} />
          {views && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Eye className="size-3.5" aria-hidden />
              {t("views", { count: views })}
            </span>
          )}
        </div>

        <p className="line-clamp-1 text-sm text-muted-foreground">
          <span className="text-foreground">{cityName}</span>
          {serviceNames.length > 0 &&
            ` · ${serviceNames.slice(0, 3).join(", ")}`}
        </p>

        {business.description && (
          <p className="hidden text-sm text-muted-foreground sm:line-clamp-2">
            {business.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-xs font-medium empty:hidden sm:mt-auto sm:pt-2">
          <OpenNowBadge hours={business.hours} emergency={business.emergency} />
          {business.responseTime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              <Zap className="size-3.5" aria-hidden />
              {t(`responseTime.${business.responseTime}`)}
            </span>
          )}
          {business.emergency && (
            <span className="inline-flex items-center gap-1 text-destructive">
              <Siren className="size-3.5" aria-hidden />
              {t("emergency")}
            </span>
          )}
          {business.online && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Wifi className="size-3.5" aria-hidden />
              {t("online")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
