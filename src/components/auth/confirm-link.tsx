import { getTranslations } from "next-intl/server";
import { confirmEmailLink } from "@/app/actions/confirm-email";
import type { Locale } from "@/i18n/routing";

export async function ConfirmLink({
  locale,
  tokenHash,
  type,
  next,
}: {
  locale: Locale;
  tokenHash: string;
  type: string;
  next: string;
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <form action={confirmEmailLink} className="space-y-4 text-center">
      <input type="hidden" name="token_hash" value={tokenHash} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="locale" value={locale} />
      <p className="text-muted-foreground">{t("confirmText")}</p>
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {t("confirmButton")}
      </button>
    </form>
  );
}
