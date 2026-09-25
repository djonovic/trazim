"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 1600;

/** Downscales to 1600px and re-encodes as WebP, so phones' 5 MB photos upload fast. */
async function toWebp(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    if (!blob) return null;
    return { blob, width, height };
  } catch {
    // Formats the browser can't decode (e.g. HEIC outside Safari).
    return null;
  }
}

/**
 * Uploads into {bucket}/{folderId}/ and returns the storage paths:
 * business-photos/{businessId} (owner only, for addPhotos()) or
 * review-photos/{reviewId} (review author only, for addReviewPhotos()).
 * Files that can't be decoded (e.g. HEIC) or fail to upload are skipped, so
 * callers compare the result's length with files.length to report them.
 */
export async function uploadPhotos(
  folderId: string,
  files: File[],
  onProgress?: (done: number, total: number) => void,
  bucket: "business-photos" | "review-photos" = "business-photos",
) {
  const supabase = createClient();
  const uploaded: {
    path: string;
    width: number | null;
    height: number | null;
  }[] = [];
  let done = 0;
  for (const file of files) {
    const image = await toWebp(file);
    if (image) {
      const path = `${folderId}/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, image.blob, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });
      if (!error)
        uploaded.push({ path, width: image.width, height: image.height });
    }
    onProgress?.(++done, files.length);
  }
  return uploaded;
}

/**
 * Removes files uploaded by uploadPhotos() when saving their rows failed, so
 * they don't sit unused in storage. Best effort: a failure here is ignored.
 */
export async function discardUploads(
  uploaded: { path: string }[],
  bucket: "business-photos" | "review-photos" = "business-photos",
) {
  if (!uploaded.length) return;
  await createClient()
    .storage.from(bucket)
    .remove(uploaded.map((u) => u.path))
    .catch(() => null);
}
