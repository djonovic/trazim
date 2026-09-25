"use client";

import { ImagePlus, Loader2, PenLine, Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  addReviewPhotos,
  deleteReview,
  deleteReviewPhoto,
  submitReview,
} from "@/app/actions/reviews";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadPhotos } from "@/lib/upload-photos";
import { cn } from "@/lib/utils";

type Draft = { rating: number; body: string; savedAt: number };
type Own = {
  id: string;
  rating: number;
  body: string | null;
  photos: { id: string; url: string }[];
};

const MAX_PHOTOS = 4;
const reviewPhotoUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/review-photos/${path}`;

// localStorage, not sessionStorage: the email sign-in link opens a new tab.
const draftKey = (businessId: string) => `trazim.review.${businessId}`;
const DRAFT_TTL = 24 * 3600_000;

function readDraft(businessId: string): Draft | null {
  try {
    const draft = JSON.parse(
      localStorage.getItem(draftKey(businessId)) ?? "null",
    ) as Draft | null;
    return draft && Date.now() - draft.savedAt < DRAFT_TTL ? draft : null;
  } catch {
    return null;
  }
}

function clearDraft(businessId: string) {
  try {
    localStorage.removeItem(draftKey(businessId));
  } catch {}
}

export function StarInput({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (value: number) => void;
  labels: string[];
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} · ${labels[i - 1]}`}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            className="p-1"
          >
            <Star
              className={cn(
                "size-8 transition-colors",
                i <= shown ? "fill-warm text-warm" : "fill-border text-border",
              )}
            />
          </button>
        ))}
      </div>
      {shown > 0 && (
        <span className="text-sm font-semibold">{labels[shown - 1]}</span>
      )}
    </div>
  );
}

/**
 * "Ostavi recenziju": anyone can fill the form; signing in is asked only on
 * submit. The draft survives the sign-in redirect and reopens afterwards.
 */
export function ReviewComposer({
  businessId,
  businessName,
  ownerId,
}: {
  businessId: string;
  businessName: string;
  ownerId: string | null;
}) {
  const t = useTranslations("Review");
  const { user, ready, openLogin } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [needsName, setNeedsName] = useState(false);
  const [own, setOwn] = useState<Own | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  // Photos are picked after signing in (files can't survive the redirect).
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );
  const [pending, startTransition] = useTransition();
  const labels = [1, 2, 3, 4, 5].map((i) =>
    t(`ratingNames.${i}` as "ratingNames.1"),
  );

  // The user's existing review and whether we still need their name.
  const fetchOwn = useCallback(async () => {
    if (!user) return { review: null, needsName: false };
    const [{ data: review }, { data: profile }] = await Promise.all([
      supabase
        .from("reviews")
        .select("id, rating, body, review_photos(id, storage_path, sort_order)")
        .eq("business_id", businessId)
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle(),
    ]);
    return {
      review: review
        ? {
            id: review.id,
            rating: review.rating,
            body: review.body,
            photos: [...review.review_photos]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((p) => ({ id: p.id, url: reviewPhotoUrl(p.storage_path) })),
          }
        : null,
      needsName: !profile?.full_name?.trim(),
    };
  }, [supabase, user, businessId]);

  // After signing in: load the user's review and reopen a saved draft.
  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    fetchOwn().then((result) => {
      if (cancelled) return;
      setOwn(result.review);
      setNeedsName(result.needsName);
      const draft = readDraft(businessId);
      if (draft) {
        setRating(draft.rating);
        setBody(draft.body);
        setNotice(t("draftRestored"));
        setOpen(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ready, user, businessId, fetchOwn, t]);

  if (ready && user && ownerId === user.id) {
    return (
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {t("ownBusiness")}
        <Link href="/panel" className="font-semibold text-primary">
          {t("openPanel")} →
        </Link>
      </p>
    );
  }

  function start() {
    setError(null);
    setNotice(null);
    setRating(own?.rating ?? 0);
    setBody(own?.body ?? "");
    setOpen(true);
  }

  function submit() {
    setError(null);
    if (!rating) return setError(t("errors.rating"));
    if (!user) {
      try {
        localStorage.setItem(
          draftKey(businessId),
          JSON.stringify({ rating, body, savedAt: Date.now() } satisfies Draft),
        );
      } catch {}
      setOpen(false);
      openLogin({
        title: t("readyTitle"),
        description: t("readyText"),
        next: `${window.location.pathname}#recenzije`,
      });
      return;
    }
    if (needsName && name.trim().length < 2) return setError(t("errors.name"));
    startTransition(async () => {
      const res = await submitReview({
        businessId,
        rating,
        body,
        name: needsName ? name : undefined,
      });
      if (!res.ok) {
        setError(
          ["own", "limit", "name", "rating"].includes(res.error)
            ? t(`errors.${res.error}` as "errors.own")
            : t("errors.generic"),
        );
        return;
      }
      // The review is saved from here on: whatever happens with the photos,
      // reload it so a retry edits it instead of submitting it again.
      clearDraft(businessId);
      let photoError: string | null = null;
      if (files.length) {
        setProgress(t("uploading", { done: 0, total: files.length }));
        const uploaded = await uploadPhotos(
          res.reviewId,
          files,
          (d, total) => setProgress(t("uploading", { done: d, total })),
          "review-photos",
        );
        setProgress(null);
        const added = uploaded.length
          ? await addReviewPhotos(res.reviewId, uploaded)
          : ({ ok: true } as const);
        const failed = files.length - uploaded.length;
        if (!added.ok) {
          photoError =
            added.error === "photos" ? t("errors.photos") : t("errors.generic");
        } else {
          setFiles([]);
          if (failed)
            photoError = t("errors.photosFailed", {
              failed,
              total: files.length,
            });
        }
      }
      const result = await fetchOwn();
      setOwn(result.review);
      setNeedsName(result.needsName);
      router.refresh();
      if (photoError) {
        setNotice(null);
        setError(photoError);
        return;
      }
      setOpen(false);
      setDone(t("thanks"));
    });
  }

  function remove() {
    if (!own || !window.confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const res = await deleteReview(own.id);
      if (!res.ok) return setError(t("errors.generic"));
      clearDraft(businessId);
      setOwn(null);
      setOpen(false);
      setDone(t("deleted"));
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={start}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"
      >
        <PenLine className="size-4" aria-hidden />
        {own ? t("editOwn") : t("write")}
      </button>
      {done && (
        <p role="status" className="text-sm font-medium text-primary">
          {done}
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-5 rounded-2xl p-6">
          <div className="space-y-1.5 pr-6">
            <DialogTitle className="text-xl font-bold">
              {t("dialogTitle", { name: businessName })}
            </DialogTitle>
            <DialogDescription>{t("guidelines")}</DialogDescription>
          </div>
          {notice && (
            <p className="rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
              {notice}
            </p>
          )}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <fieldset className="space-y-1.5">
              <legend className="text-sm font-medium">
                {t("ratingLabel")}
              </legend>
              <StarInput value={rating} onChange={setRating} labels={labels} />
            </fieldset>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{t("bodyLabel")}</span>
              <textarea
                className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
                rows={5}
                maxLength={2000}
                value={body}
                placeholder={t("bodyPlaceholder")}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>
            {user && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("photosLabel")}</p>
                <ul className="flex flex-wrap gap-2">
                  {own?.photos.map((photo) => (
                    <li key={photo.id} className="relative size-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt=""
                        className="size-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        aria-label={t("removePhoto")}
                        onClick={() =>
                          startTransition(async () => {
                            const res = await deleteReviewPhoto(photo.id);
                            if (!res.ok) return setError(t("errors.generic"));
                            setOwn((o) =>
                              o
                                ? {
                                    ...o,
                                    photos: o.photos.filter(
                                      (p) => p.id !== photo.id,
                                    ),
                                  }
                                : o,
                            );
                            router.refresh();
                          })
                        }
                        className="absolute -top-2 -right-2 rounded-full bg-foreground p-1 text-background"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                  {previews.map((url, i) => (
                    <li key={url} className="relative size-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="size-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        aria-label={t("removePhoto")}
                        onClick={() =>
                          setFiles((list) => list.filter((_, j) => j !== i))
                        }
                        className="absolute -top-2 -right-2 rounded-full bg-foreground p-1 text-background"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                  {(own?.photos.length ?? 0) + files.length < MAX_PHOTOS && (
                    <li>
                      <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-muted"
                      >
                        <ImagePlus className="size-5" aria-hidden />
                        {t("addPhotos")}
                      </button>
                    </li>
                  )}
                </ul>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    const room =
                      MAX_PHOTOS - (own?.photos.length ?? 0) - files.length;
                    const picked = [...(e.target.files ?? [])].slice(0, room);
                    setFiles((list) => [...list, ...picked]);
                    e.target.value = "";
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {t("photosHint")}
                </p>
              </div>
            )}
            {user && needsName && (
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">{t("nameLabel")}</span>
                <input
                  className="h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] outline-none focus:border-primary"
                  value={name}
                  maxLength={80}
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="block text-xs text-muted-foreground">
                  {t("nameHint")}
                </span>
              </label>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                {progress ??
                  (pending ? t("submitting") : own ? t("update") : t("submit"))}
              </button>
              {own && (
                <button
                  type="button"
                  onClick={remove}
                  disabled={pending}
                  className="text-sm font-medium text-destructive hover:underline"
                >
                  {t("delete")}
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
