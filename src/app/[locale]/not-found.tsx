import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("text")}</p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
