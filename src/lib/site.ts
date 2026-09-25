// Operator details shown on contact and legal pages.
export const SITE = {
  email: "kontakt@trazim.me",
  /** Shown in the top bar. Local format for display, E.164 for the tel: link. */
  phoneDisplay: "069 956 675",
  phoneTel: "+38269956675",
  /** Legal entity that operates the site (e.g. the US LLC). */
  company: "Global Bridge MNE LLC" as string | null,
  companyAddress: "30 N Gould St Ste N, Sheridan, WY 82801, United States" as
    string | null,
  /** Set to true once a lawyer has reviewed /uslovi, /privatnost, /kolacici. */
  legalReviewed: true,
  /** Official social profiles (Facebook, Instagram, LinkedIn, Wikidata…) for Organization.sameAs. */
  sameAs: [] as string[],
};

/**
 * Sponsored placements on /za-biznise, paid by bank transfer and entered in
 * /admin/sponzorstva: the home page, or any other placement (service + town,
 * town page, service across Montenegro) at one price. EUR per month; a year
 * costs SPONSOR_YEAR_MONTHS months. TODO(before launch): ask the accountant
 * whether prices include VAT.
 */
export const SPONSOR_PRICES = {
  home: 99,
  other: 49,
} as const;

/** Paying for a year up front: 12 months for the price of this many. */
export const SPONSOR_YEAR_MONTHS = 10;

/** Sponsored spots per page (fewer spots = each one is worth more). */
export const SPONSOR_SLOTS = { page: 10, home: 10 } as const;

/**
 * Banners for suppliers and brands, EUR per month (a year costs
 * SPONSOR_YEAR_MONTHS months), one advertiser per placement:
 * home = home page + /usluge + /gradovi; service = that service's listings
 * in every town + its service page; city = the town page (+ its listings
 * when the service has no banner of its own).
 */
export const BANNER_PRICES = {
  home: 199,
  service: 149,
  city: 99,
} as const;

export type BannerScope = keyof typeof BANNER_PRICES;
