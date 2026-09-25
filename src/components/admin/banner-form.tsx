"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { createBanner } from "@/app/actions/admin";
import { useRouter } from "@/i18n/navigation";
import {
  BANNER_PRICES,
  SPONSOR_YEAR_MONTHS,
  type BannerScope,
} from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

type Option = { id: number; name: string };

const COLORS = [
  "#ea6a1f",
  "#1f4b9e",
  "#0f766e",
  "#b91c1c",
  "#7c3aed",
  "#111827",
];

const ERRORS: Record<string, string> = {
  service: "Izaberi uslugu.",
  advertiser: "Unesi naziv oglašivača.",
  title: "Unesi naslov (2–60 znakova).",
  link: "Unesi link koji počinje sa https://",
  dates: "Kraj ne može biti prije početka.",
  taken:
    "Za ovu uslugu već postoji baner u tom periodu (jedan oglašivač po usluzi).",
  auth: "Nemaš admin pristup.",
};

const day = (offset = 0) =>
  new Date(Date.now() + offset * 86400_000).toLocaleDateString("sv-SE", {
    timeZone: "Europe/Podgorica",
  });

const field =
  "h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary";

/** Books a template banner: text, colour, optional logo and a link. */
const SCOPE_LABELS: Record<BannerScope, string> = {
  home: "Početna (i katalog usluga i gradova)",
  service: "Usluga (svi gradovi + stranica usluge)",
  city: "Grad (stranica grada + liste u gradu bez banera usluge)",
};

export function BannerForm({
  services,
  cities,
}: {
  services: Option[];
  cities: Option[];
}) {
  const router = useRouter();
  const [scope, setScope] = useState<BannerScope>("service");
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [advertiser, setAdvertiser] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [linkUrl, setLinkUrl] = useState("https://");
  const [color, setColor] = useState(COLORS[0]);
  const [logo, setLogo] = useState<File | null>(null);
  const [startsAt, setStartsAt] = useState(day());
  const [endsAt, setEndsAt] = useState(day(30));
  const [paymentRef, setPaymentRef] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      setMessage(null);
      let logoPath: string | null = null;
      if (logo) {
        const ext = logo.name.split(".").pop()?.toLowerCase() || "png";
        logoPath = `${crypto.randomUUID()}.${ext}`;
        const { error } = await createClient()
          .storage.from("banners")
          .upload(logoPath, logo, { contentType: logo.type });
        if (error) {
          setMessage({ ok: false, text: "Logo nije poslat. Pokušaj ponovo." });
          return;
        }
      }
      const res = await createBanner({
        scope,
        serviceId: scope === "service" ? serviceId : null,
        cityId: scope === "city" ? cityId : null,
        advertiser,
        title,
        body,
        cta,
        linkUrl,
        color,
        logoPath,
        startsAt,
        endsAt,
        paymentRef,
      });
      if (!res.ok) {
        setMessage({
          ok: false,
          text: ERRORS[res.error] ?? "Nije uspjelo. Pokušaj ponovo.",
        });
        return;
      }
      setMessage({ ok: true, text: `Dodat baner: ${advertiser}` });
      setAdvertiser("");
      setTitle("");
      setBody("");
      setCta("");
      setLinkUrl("https://");
      setLogo(null);
      setPaymentRef("");
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-4 rounded-2xl border bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-bold">Novi baner</h2>
        <p className="text-sm text-muted-foreground">
          {BANNER_PRICES[scope]} €/mj,{" "}
          {BANNER_PRICES[scope] * SPONSOR_YEAR_MONTHS} € godišnje · jedan
          oglašivač po poziciji
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Pozicija</span>
          <select
            className={field}
            value={scope}
            onChange={(e) => setScope(e.target.value as BannerScope)}
          >
            {(Object.keys(SCOPE_LABELS) as BannerScope[]).map((s) => (
              <option key={s} value={s}>
                {SCOPE_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        {scope === "service" && (
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Usluga</span>
            <select
              className={field}
              value={serviceId ?? ""}
              onChange={(e) => setServiceId(Number(e.target.value) || null)}
            >
              <option value="">Izaberi…</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {scope === "city" && (
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Grad</span>
            <select
              className={field}
              value={cityId ?? ""}
              onChange={(e) => setCityId(Number(e.target.value) || null)}
            >
              <option value="">Izaberi…</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Oglašivač</span>
          <input
            className={field}
            value={advertiser}
            maxLength={80}
            placeholder="Npr. Keramika Centar d.o.o."
            onChange={(e) => setAdvertiser(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Naslov</span>
          <input
            className={field}
            value={title}
            maxLength={60}
            placeholder="Npr. Pločice i ljepila na akciji"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Tekst (opciono)</span>
          <input
            className={field}
            value={body}
            maxLength={140}
            placeholder="Npr. Dostava u Podgorici i na primorju"
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Dugme (opciono)</span>
          <input
            className={field}
            value={cta}
            maxLength={30}
            placeholder="Pogledaj ponudu"
            onChange={(e) => setCta(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Link</span>
          <input
            className={field}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </label>
        <div className="space-y-1.5 text-sm">
          <span className="font-medium">Boja</span>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className="size-9 rounded-full ring-offset-2 aria-pressed:ring-2 aria-pressed:ring-foreground"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Logo (opciono, do 2 MB)</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Od</span>
          <input
            type="date"
            className={field}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Do (uključujući)</span>
          <input
            type="date"
            className={field}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium">Plaćanje (napomena)</span>
          <input
            className={field}
            value={paymentRef}
            maxLength={200}
            placeholder="Npr. faktura 12/2026"
            onChange={(e) => setPaymentRef(e.target.value)}
          />
        </label>
      </div>

      {/* Preview, same template as on the site. */}
      <div
        className="flex min-h-40 max-w-xs flex-col items-center justify-center gap-2 rounded-2xl p-5 text-center text-white"
        style={{ backgroundColor: color }}
      >
        <span className="text-[11px] font-semibold uppercase opacity-80">
          Oglas · {advertiser || "Oglašivač"}
        </span>
        <span className="text-lg font-extrabold">{title || "Naslov"}</span>
        {body && <span className="text-sm opacity-90">{body}</span>}
        <span
          className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold"
          style={{ color }}
        >
          {cta || "Pogledaj ponudu"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Dodaj baner
        </button>
        {message && (
          <span
            role={message.ok ? "status" : "alert"}
            className={
              message.ok ? "text-sm text-primary" : "text-sm text-destructive"
            }
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
