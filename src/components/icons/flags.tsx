import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import gb from "@/assets/flags/gb.png";
import me from "@/assets/flags/me.png";
import ru from "@/assets/flags/ru.png";

// Square flags from flag-icons (MIT, see assets/flags/LICENSE-flag-icons),
// rendered to 96px PNGs: Montenegro's SVG is 57 KB because of the coat of arms.
const FLAGS = { "sr-Latn-ME": me, en: gb, ru } satisfies Record<
  Locale,
  unknown
>;

/** Round flag for a locale, with a hairline ring so white stripes stay visible. */
export function LocaleFlag({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <Image
      src={FLAGS[locale]}
      alt=""
      unoptimized
      className={cn(
        "size-5 shrink-0 rounded-full object-cover ring-1 ring-black/10",
        className,
      )}
    />
  );
}
