import { BadgeCheck, Clock, Eye, Wifi, Zap } from "lucide-react";
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

  return (
    <Link
      href={{ pathname: "/b/[slug]", params: { slug: business.slug } }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md",
        sponsored && "border-warm/60",
      )}
    >
      <div className="relative aspect-[16/10] bg-muted">
        {business.coverUrl ? (
          <Image
            src={business.coverUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-secondary to-accent text-4xl font-extrabold text-primary/40">
            {business.name.slice(0, 1)}
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {sponsored && (
            <span className="rounded-full bg-warm px-2 py-0.5 text-xs font-semibold text-warm-foreground">
              {t("sponsored")}
            </span>
          )}
          {business.isNew && !sponsored && (
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold">
              {t("new")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 leading-snug font-bold group-hover:text-primary">
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
          {[cityName, ...serviceNames.slice(0, 3)].join(" · ")}
        </p>

        {business.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {business.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs font-medium">
          <OpenNowBadge hours={business.hours} emergency={business.emergency} />
          {business.responseTime && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {t(`responseTime.${business.responseTime}`)}
            </span>
          )}
          {business.emergency && (
            <span className="inline-flex items-center gap-1 text-destructive">
              <Zap className="size-3.5" aria-hidden />
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
