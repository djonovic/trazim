import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  BannerSlot,
  type BannerTarget,
} from "@/components/business/banner-slot";

/**
 * Page body with a banner column on the right that stays in view while
 * scrolling (desktop). On phones the banner is a card in the content, right
 * after the page heading.
 */
export function BannerLayout({
  locale,
  banner,
  as: Tag = "main",
  className,
  children,
}: {
  locale: Locale;
  banner: BannerTarget;
  as?: "main" | "div";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className="mx-auto w-full max-w-7xl px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
      {/* Phones: the banner card comes right after the page heading (<header>),
          or first when there is none, not at the very end. */}
      <div
        className={cn(
          "flex min-w-0 flex-col lg:block max-lg:[&>*]:order-2 max-lg:[&>header]:order-0",
          className,
        )}
      >
        {children}
        <div className="max-lg:order-1! lg:hidden">
          <BannerSlot locale={locale} target={banner} variant="mobile" />
        </div>
      </div>
      <aside className="hidden py-8 lg:block">
        <div className="sticky top-24">
          <BannerSlot locale={locale} target={banner} variant="rail" />
        </div>
      </aside>
    </Tag>
  );
}
