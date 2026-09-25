"use client";

import { ArrowDown, ArrowUp, Check, GripVertical, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { reorderSponsorships } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export type OrderItem = { id: string; name: string; detail: string };

/**
 * Order of the sponsored businesses in one placement. Drag with the mouse,
 * or use the arrows (touch screens and keyboard). Saves on every change.
 */
export function SponsorshipOrder({
  title,
  items: initial,
}: {
  title: string;
  items: OrderItem[];
}) {
  const [items, setItems] = useState(initial);
  const [dragged, setDragged] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();

  function save(next: OrderItem[]) {
    const previous = items;
    setItems(next);
    setState("idle");
    startTransition(async () => {
      const res = await reorderSponsorships(next.map((i) => i.id));
      if (res.ok) setState("saved");
      else {
        setItems(previous);
        setState("error");
      }
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    save(next);
  }

  return (
    <section className="rounded-2xl border bg-white">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h3 className="font-semibold">{title}</h3>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {pending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Čuvam…
            </>
          ) : state === "saved" ? (
            <>
              <Check className="size-3.5 text-emerald-600" /> Sačuvano
            </>
          ) : state === "error" ? (
            <span role="alert" className="text-destructive">
              Nije sačuvano, pokušaj ponovo
            </span>
          ) : (
            "Prevuci ili koristi strelice"
          )}
        </span>
      </header>
      <ol className="divide-y">
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable={!pending}
            onDragStart={(e) => {
              setDragged(item.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              if (!dragged) return;
              e.preventDefault();
              setOver(item.id);
            }}
            onDragLeave={() => setOver((o) => (o === item.id ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              const from = items.findIndex((i) => i.id === dragged);
              setDragged(null);
              setOver(null);
              if (from !== -1) move(from, index);
            }}
            onDragEnd={() => {
              setDragged(null);
              setOver(null);
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
              dragged === item.id && "opacity-40",
              over === item.id && dragged !== item.id && "bg-primary/5",
            )}
          >
            <GripVertical
              className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
              aria-hidden
            />
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{item.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {item.detail}
              </span>
            </span>
            <button
              type="button"
              onClick={() => move(index, index - 1)}
              disabled={pending || index === 0}
              aria-label={`Pomjeri gore: ${item.name}`}
              className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => move(index, index + 1)}
              disabled={pending || index === items.length - 1}
              aria-label={`Pomjeri dolje: ${item.name}`}
              className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"
            >
              <ArrowDown className="size-4" />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
