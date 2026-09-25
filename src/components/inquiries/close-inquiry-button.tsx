"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { closeInquiry } from "@/app/actions/inquiries";
import { useRouter } from "@/i18n/navigation";

export function CloseInquiryButton({ inquiryId }: { inquiryId: string }) {
  const t = useTranslations("Inquiry");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await closeInquiry(inquiryId);
          router.refresh();
        })
      }
      className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
    >
      {t("close")}
    </button>
  );
}
