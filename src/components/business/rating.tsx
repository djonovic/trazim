import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  const t = useTranslations("Common");
  if (!count) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold",
        size === "lg" && "text-lg",
        className,
      )}
      aria-label={t("rating", { rating: value.toFixed(1) })}
    >
      <Star
        className={cn(
          "fill-warm text-warm",
          size === "lg" ? "size-5" : "size-4",
        )}
        aria-hidden
      />
      {value.toFixed(1)}
      <span className="font-normal text-muted-foreground">({count})</span>
    </span>
  );
}
