// Hand-written service content (description, FAQ, tips) per locale, shown on
// /usluge/{service} and every /{service}-{city} page. Same text in every town;
// the town-specific numbers (count, ratings, prices) come from live data.
export type LocaleContent = {
  /** 2–3 sentences: what the service covers and when you need it. */
  description: string;
  /** 4–6 questions people actually ask (no average-price question: that one is generated from live prices). */
  faq: { q: string; a: string }[];
  /** 3–5 short tips: how to choose, what to prepare before calling. */
  tips: string[];
};

export type ServiceContent = Record<"me" | "en" | "ru", LocaleContent>;
