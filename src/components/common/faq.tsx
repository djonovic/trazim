import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: string };

/**
 * Native <details>: answers are always in the server HTML (crawlers and AI
 * engines read them, and they match the FAQPage JSON-LD), and it works
 * without JavaScript. A Radix accordion leaves closed answers out of the DOM.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y rounded-2xl border bg-white px-4">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-base font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="pb-4 text-[15px] leading-relaxed text-muted-foreground">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
