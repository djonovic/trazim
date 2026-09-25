"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Photo = { id: string; url: string };

export function Gallery({ photos, name }: { photos: Photo[]; name: string }) {
  const t = useTranslations("Profile");
  const tc = useTranslations("Common");
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) =>
      setIndex((i) =>
        i == null ? i : (i + delta + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  // 1 photo: wide hero; 2: side by side; 3–4: hero + 2 stacked; 5+: hero + 2×2.
  const count = photos.length >= 5 ? 5 : photos.length >= 3 ? 3 : photos.length;
  const shown = photos.slice(0, count);

  return (
    <section aria-label={t("gallery")} className="space-y-2">
      <ul
        className={cn(
          "grid grid-cols-2 gap-2",
          count === 3 && "sm:grid-cols-3",
          count === 5 && "sm:grid-cols-4",
        )}
      >
        {shown.map((photo, i) => (
          <li
            key={photo.id}
            className={cn(
              "relative overflow-hidden bg-muted",
              count === 1 &&
                "col-span-2 aspect-[4/3] rounded-2xl sm:aspect-[16/9]",
              count === 2 && "aspect-[4/3] rounded-xl",
              count >= 3 &&
                (i === 0
                  ? "col-span-2 aspect-[4/3] rounded-2xl sm:row-span-2"
                  : "aspect-[4/3] rounded-xl"),
            )}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="absolute inset-0"
              aria-label={`${name} ${i + 1}`}
            >
              <Image
                src={photo.url}
                alt={`${name} ${i + 1}`}
                fill
                sizes={
                  i === 0 && count !== 2
                    ? "(min-width: 1024px) 640px, 100vw"
                    : "(min-width: 1024px) 320px, 50vw"
                }
                className="object-cover transition-transform hover:scale-[1.02]"
                priority={i === 0}
              />
            </button>
            {i === shown.length - 1 && photos.length > shown.length && (
              <span className="pointer-events-none absolute right-2 bottom-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                {t("seeAllPhotos", { count: photos.length })}
              </span>
            )}
          </li>
        ))}
      </ul>

      <Dialog
        open={index != null}
        onOpenChange={(open) => !open && setIndex(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-none gap-0 border-0 bg-black/95 p-0 sm:max-w-5xl sm:rounded-2xl"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <DialogTitle className="sr-only">
            {name} · {index != null ? index + 1 : 0}/{photos.length}
          </DialogTitle>
          {index != null && (
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src={photos[index].url}
                alt={`${name} ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-sm text-white">
            <span className="rounded-full bg-black/50 px-3 py-1 tabular-nums">
              {index != null ? index + 1 : 0} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="rounded-full bg-black/50 p-2"
              aria-label={tc("close")}
            >
              <X className="size-5" />
            </button>
          </div>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/90 p-2"
                aria-label={tc("previous")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/90 p-2"
                aria-label={tc("next")}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
