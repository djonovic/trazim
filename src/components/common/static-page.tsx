import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/common/faq";
import { SponsorPricing } from "@/components/common/sponsor-pricing";
import { SetAlternates } from "@/components/layout/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import {
  LEGAL_SLUGS,
  staticPages,
  type StaticSlug,
} from "@/content/static-pages";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";
import { breadcrumbList, faqPage } from "@/lib/seo/jsonld";
import { localePaths, pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

/** Builds metadata + page for a content-only route like /kako-funkcionise. */
export function staticPage(slug: StaticSlug) {
  const href = `/${slug}` as const;
  const isLegal = LEGAL_SLUGS.includes(slug);

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = (await params).locale as Locale;
    const content = staticPages[slug][locale];
    return pageMetadata({
      locale,
      paths: localePaths(href),
      title: content.title,
      description: content.description,
      // Legal drafts stay out of the index until reviewed.
      noindex: isLegal && !SITE.legalReviewed,
    });
  }

  async function Page({ params }: Props) {
    const locale = (await params).locale as Locale;
    setRequestLocale(locale);
    const content = staticPages[slug][locale];
    const tc = await getTranslations({ locale, namespace: "Common" });
    const faq = content.blocks.flatMap((b) => b.faq ?? []);

    return (
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        <SetAlternates paths={localePaths(href)} />
        <JsonLd
          graph={[
            breadcrumbList([
              {
                name: tc("siteName"),
                href: getPathname({ locale, href: "/" }),
              },
              { name: content.title, href: getPathname({ locale, href }) },
            ]),
            ...(faq.length ? [faqPage(faq)] : []),
          ]}
        />
        {isLegal && !SITE.legalReviewed && (
          <p className="rounded-xl border border-warm bg-warm/15 px-4 py-3 text-sm">
            Draft · Nacrt · Черновик
          </p>
        )}
        <header className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {content.title}
          </h1>
          {content.lead && (
            <p className="text-lg text-pretty text-muted-foreground">
              {content.lead}
            </p>
          )}
        </header>
        {content.blocks.map((block, i) => (
          <section key={i} className="space-y-3">
            {block.h && (
              <h2 className="text-xl font-bold tracking-tight">{block.h}</h2>
            )}
            {block.p?.map((text) => (
              <p key={text} className="leading-relaxed text-pretty">
                {text}
              </p>
            ))}
            {block.list && (
              <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {block.faq && <Faq items={block.faq} />}
          </section>
        ))}
        {slug === "za-biznise" && <SponsorPricing locale={locale} />}
        {slug === "za-biznise" && (
          <Link
            href="/panel/novi"
            className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {tc("addBusiness")}
          </Link>
        )}
      </main>
    );
  }

  return { generateMetadata, Page };
}
