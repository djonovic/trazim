import { ArrowRight, Check, Megaphone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatEur } from "@/lib/format";
import { getActiveBanner, type ActiveBanner } from "@/lib/queries/businesses";
import { BANNER_PRICES, type BannerScope } from "@/lib/site";
import { MobileBannerBar } from "./mobile-banner-bar";

export type BannerTarget = {
  /** Placements to try in order, e.g. the service, then the town. */
  candidates: { scope: BannerScope; id: number | null }[];
  /** What the empty spot offers (price and text). */
  offer: { scope: BannerScope; name?: string };
};

async function resolve(target: BannerTarget) {
  for (const c of target.candidates) {
    const banner = await getActiveBanner(c.scope, c.id);
    if (banner) return banner;
  }
  return null;
}

/** "#ea6a1f" → a darker shade for the gradient. */
function shade(hex: string, amount = 0.28) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) =>
    Math.round(v * (1 - amount)),
  );
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const stripes =
  "bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.07)_0,rgba(255,255,255,0.07)_2px,transparent_2px,transparent_14px)]";

function Booked({
  banner,
  label,
  cta,
  compact = false,
}: {
  banner: ActiveBanner;
  label: string;
  cta: string;
  compact?: boolean;
}) {
  const style = {
    backgroundImage: `linear-gradient(160deg, ${banner.color}, ${shade(banner.color)})`,
  };
  const href = `/r/banner/${banner.id}`;
  if (compact)
    return (
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener"
        data-nosnippet
        style={style}
        className="flex items-center gap-3 rounded-2xl p-3 pr-4 text-white shadow-xl"
      >
        {banner.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.logoUrl}
            alt=""
            className="size-11 shrink-0 rounded-xl bg-white object-contain p-1.5"
          />
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold tracking-wide uppercase opacity-80">
            {label} · {banner.advertiser}
          </span>
          <span className="block truncate font-bold">{banner.title}</span>
        </span>
        <span
          className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold"
          style={{ color: banner.color }}
        >
          {banner.cta || cta}
        </span>
      </a>
    );
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener"
      data-nosnippet
      style={style}
      className="group relative flex min-h-[26rem] flex-col overflow-hidden rounded-3xl p-6 text-white shadow-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5"
    >
      <span className={`pointer-events-none absolute inset-0 ${stripes}`} />
      <span className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
      <span className="relative inline-flex w-fit items-center rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur">
        {label}
      </span>
      <span className="relative mt-auto flex flex-col gap-4">
        {banner.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.logoUrl}
            alt={banner.advertiser}
            className="h-16 w-fit max-w-full rounded-2xl bg-white object-contain p-2.5 shadow-sm"
          />
        )}
        <span className="text-[1.65rem] leading-tight font-extrabold text-balance">
          {banner.title}
        </span>
        {banner.body && (
          <span className="text-[15px] leading-relaxed text-white/90">
            {banner.body}
          </span>
        )}
        <span
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white font-bold shadow-sm transition-transform group-hover:scale-[1.02]"
          style={{ color: banner.color }}
        >
          {banner.cta || cta}
          <ArrowRight className="size-4" aria-hidden />
        </span>
        <span className="text-center text-xs text-white/75">
          {banner.advertiser} · {banner.host}
        </span>
      </span>
    </a>
  );
}

/**
 * Banner of a placement: the booked supplier/brand, or an invitation to book
 * the spot. `variant="rail"`: the card in the sticky side column (desktop);
 * `variant="mobile"`: a closable bottom strip when booked, a small card in
 * the content when free. Clicks go through /r/banner/{id} (counted).
 */
export async function BannerSlot({
  locale,
  target,
  variant,
}: {
  locale: Locale;
  target: BannerTarget;
  variant: "rail" | "mobile";
}) {
  const t = await getTranslations({ locale, namespace: "Banner" });
  const banner = await resolve(target);
  const offerHref = `${getPathname({ locale, href: "/za-biznise" })}#baneri`;
  const price = t("emptyPrice", {
    price: formatEur(BANNER_PRICES[target.offer.scope], locale),
  });
  const text = t(`emptyText.${target.offer.scope}`, {
    name: target.offer.name ?? "",
  });

  if (banner) {
    const card = (
      <Booked
        banner={banner}
        label={t("label")}
        cta={t("defaultCta")}
        compact={variant === "mobile"}
      />
    );
    return variant === "mobile" ? (
      <>
        <MobileBannerBar bannerId={banner.id} closeLabel={t("close")}>
          {card}
        </MobileBannerBar>
        {/* Room so the strip doesn't cover the end of the page. */}
        <div className="h-20 lg:hidden" aria-hidden />
      </>
    ) : (
      card
    );
  }

  if (variant === "mobile")
    return (
      <a
        href={offerHref}
        data-nosnippet
        className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary/80 p-4 text-primary-foreground shadow-md"
      >
        <span className={`pointer-events-none absolute inset-0 ${stripes}`} />
        <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Megaphone className="size-6" aria-hidden />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-wide uppercase opacity-80">
            {t("emptyBadge")} · {price}
          </span>
          <span className="block text-lg leading-tight font-extrabold">
            {t("emptyTitle")}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-sm opacity-90">
            {text}
          </span>
        </span>
        <ArrowRight className="relative size-5 shrink-0" aria-hidden />
      </a>
    );

  return (
    <a
      href={offerHref}
      data-nosnippet
      className="group relative flex min-h-[26rem] flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-secondary to-transparent" />
      <span className="relative inline-flex w-fit items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase shadow-sm">
        {t("emptyBadge")}
      </span>
      <span className="relative mt-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Megaphone className="size-6" aria-hidden />
      </span>
      <span className="relative mt-5 text-2xl font-extrabold tracking-tight">
        {t("emptyTitle")}
      </span>
      <span className="relative mt-2 text-[15px] leading-relaxed text-muted-foreground">
        {text}
      </span>
      <ul className="relative mt-4 space-y-1.5 text-sm">
        {(t.raw("emptyPoints") as string[]).map((point) => (
          <li key={point} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-primary" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <span className="relative mt-auto pt-6">
        <span className="block text-sm text-muted-foreground">{price}</span>
        <span className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground transition-transform group-hover:scale-[1.02]">
          {t("emptyCta")}
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </span>
    </a>
  );
}
