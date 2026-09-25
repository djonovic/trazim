"use client";

import { Globe, Loader2, Mail, Phone } from "lucide-react";
import { InstagramIcon, ViberIcon, WhatsAppIcon } from "@/components/icons/apps";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { revealContact } from "@/app/actions/contact";
import { cn } from "@/lib/utils";

type Kind = "phone" | "viber" | "whatsapp" | "email";

const digits = (value: string) => value.replace(/[^\d+]/g, "");

function linkFor(kind: Kind, value: string) {
  switch (kind) {
    case "phone":
      return `tel:${digits(value)}`;
    case "viber":
      return `viber://chat?number=${encodeURIComponent(digits(value))}`;
    case "whatsapp":
      return `https://wa.me/${digits(value).replace(/^\+/, "")}`;
    case "email":
      return `mailto:${value}`;
  }
}

export function ContactButtons({
  businessId,
  channels,
  website,
  instagram,
  layout = "stack",
}: {
  businessId: string;
  channels: Record<Kind, boolean>;
  website: string | null;
  instagram: string | null;
  layout?: "stack" | "bar";
}) {
  const t = useTranslations("Profile");
  const [revealed, setRevealed] = useState<Partial<Record<Kind, string>>>({});
  const [pending, setPending] = useState<Kind | null>(null);
  const [, startTransition] = useTransition();

  function open(kind: Kind) {
    const known = revealed[kind];
    if (known) {
      window.location.href = linkFor(kind, known);
      return;
    }
    setPending(kind);
    startTransition(async () => {
      const value = await revealContact(businessId, kind);
      setPending(null);
      if (!value) return;
      setRevealed((prev) => ({ ...prev, [kind]: value }));
      // Phone: show the number first (desktop users often copy it); apps open right away.
      if (kind !== "phone") window.location.href = linkFor(kind, value);
    });
  }

  const button = (
    kind: Kind,
    label: string,
    Icon: typeof Phone | typeof ViberIcon,
    primary = false,
  ) => {
    if (!channels[kind]) return null;
    const className = cn(
      "flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-colors",
      primary
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "hover:border-primary/40 border bg-white",
      layout === "bar" && "h-11 flex-1 px-2 text-sm",
    );
    // Once revealed, the phone button becomes a real tel: link showing the number.
    if (kind === "phone" && revealed.phone) {
      return (
        <a
          key={kind}
          href={linkFor("phone", revealed.phone)}
          className={cn(className, "tabular-nums")}
        >
          <Icon className="size-4" aria-hidden />
          {revealed.phone}
        </a>
      );
    }
    return (
      <button
        key={kind}
        type="button"
        onClick={() => open(kind)}
        className={className}
      >
        {pending === kind ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Icon className="size-4" aria-hidden />
        )}
        {label}
      </button>
    );
  };

  if (layout === "bar") {
    return (
      <div className="flex gap-2">
        {button("phone", t("call"), Phone, true)}
        {button("viber", t("viber"), ViberIcon)}
        {button("whatsapp", t("whatsapp"), WhatsAppIcon)}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {button("phone", t("call"), Phone, true)}
      <div className="grid grid-cols-2 gap-2">
        {button("viber", t("viber"), ViberIcon)}
        {button("whatsapp", t("whatsapp"), WhatsAppIcon)}
      </div>
      {button("email", t("email"), Mail)}
      {(website || instagram) && (
        <div className="grid grid-cols-2 gap-2">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener nofollow ugc"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border bg-white text-[15px] font-semibold hover:border-primary/40"
            >
              <Globe className="size-4" aria-hidden />
              {t("website")}
            </a>
          )}
          {instagram && (
            <a
              href={
                instagram.startsWith("http")
                  ? instagram
                  : `https://instagram.com/${instagram.replace(/^@/, "")}`
              }
              target="_blank"
              rel="noopener nofollow ugc"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border bg-white text-[15px] font-semibold hover:border-primary/40"
            >
              <InstagramIcon className="size-4" />
              {t("instagram")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
