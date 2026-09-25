"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Photo = { id: string; url: string };

/** Customer photos on a review: small thumbnails, full size in a dialog. */
export function ReviewPhotos({
  photos,
  alt,
}: {
  photos: Photo[];
  alt: string;
}) {
  const [open, setOpen] = useState<Photo | null>(null);
  if (!photos.length) return null;
  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setOpen(p)}
              className="relative block size-20 overflow-hidden rounded-lg bg-muted"
              aria-label={`${alt} ${i + 1}`}
            >
              <Image
                src={p.url}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={open != null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl border-0 bg-black/95 p-0">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {open && (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={open.url}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
