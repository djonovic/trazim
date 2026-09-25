import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-extrabold tracking-tight",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-primary" />
        <circle
          cx="14.5"
          cy="14"
          r="6.5"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="M19.5 19l5 5"
          stroke="var(--warm)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xl">Tražim</span>
    </span>
  );
}
