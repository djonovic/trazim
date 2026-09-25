import { SITE } from "@/lib/site";
import { absoluteUrl } from "./metadata";

export type JsonLdNode = Record<string, unknown>;

export function breadcrumbList(
  items: { name: string; href: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqPage(items: { q: string; a: string }[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function organization(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: "Tražim",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    email: SITE.email,
    ...(SITE.companyAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: "30 N Gould St Ste N",
            addressLocality: "Sheridan",
            addressRegion: "WY",
            postalCode: "82801",
            addressCountry: "US",
          },
        }
      : {}),
    areaServed: { "@type": "Country", name: "Montenegro" },
    ...(SITE.company ? { legalName: SITE.company } : {}),
    // Same name, logo and profiles everywhere helps search and AI engines
    // recognize Tražim as one entity.
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function website(inLanguage: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: "Tražim",
    url: absoluteUrl("/"),
    inLanguage,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function businessItemList(
  items: {
    name: string;
    href: string;
    schemaType: string;
    rating?: number;
    ratingCount?: number;
  }[],
): JsonLdNode {
  return {
    "@type": "ItemList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": b.schemaType,
        name: b.name,
        url: absoluteUrl(b.href),
        ...(b.ratingCount
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: b.rating,
                ratingCount: b.ratingCount,
                bestRating: 5,
              },
            }
          : {}),
      },
    })),
  };
}
