"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { closeInquiry } from "@/app/actions/inquiries";
import { useRouter } from "@/i18n/navigation";

export function CloseInquiryButton({ inquiryId }: { inquiryId: string }) {
  const t = useTranslations("Inquiry");
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {error && (
        <span role="alert" className="text-sm text-destructive">
          {t("closeError")}
        </span>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await closeInquiry(inquiryId);
            setError(!res.ok);
            if (res.ok) router.refresh();
          })
        }
        className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
      >
        {t("close")}
      </button>
    </span>
  );
}
