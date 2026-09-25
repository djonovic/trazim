<!-- Kopija plana iz Claude Code sesije; ažurira se kad se završi faza. -->

# Tražim (trazim.me): marketplace lokalnih usluga za Crnu Goru

## Kontekst
Pravimo crnogorsku verziju sajta kosnica.net: katalog biznisa (majstori, psiholozi, časovi, ljepota…) po usluzi i gradu, sa kontaktom direktno. Svaka stranica sa Košnice ima svoj ekvivalent, uz bolji UX i SEO.

Stanje u Crnoj Gori:
- Konkurencija je slaba: brzimajstor.me, meshtar.me, mojmajstor.me, oglasi.me i stari direktorijumi tipa biznissajt.me.
- Niko ne pokriva sve kategorije.
- Niko nema vodiče kroz cijene.
- Niko nema EN/RU verziju za primorje.

Odluke korisnika:
- Brend: **Tražim**, domen **trazim.me**. Whois kaže da je slobodan; treba ga kupiti kod domen.me.
- Model: **katalog + kontakt**. Tok "Pošalji upit" dolazi kasnije; šema je spremna za njega.
- Jezici: **crnogorski (latinica, ijekavica), engleski i ruski**.
- Infrastruktura: **nov Supabase projekat + Vercel**.
- Plaćanje sponzorisanih oglasa radimo kasnije, preko **Stripe-a** (korisnik ima US LLC). Plan: Stripe Checkout + Billing za pretplate (Pro, sponzorisano po usluzi i gradu) u EUR, Customer Portal za upravljanje pretplatom, webhook koji upisuje u `sponsorships`. Model podataka za sponzorstva pravimo odmah.

Lokacija projekta: `~/Documents/trazim`. Okruženje: Node 22, pnpm 10.

## Stack
- **Next.js 16 (App Router, RSC, TypeScript, Turbopack)**. Razlike u odnosu na 15: `src/proxy.ts` umjesto `middleware.ts`, `revalidateTag(tag, 'max')` ili `updateTag` u Server Actions, `params` su uvijek async.
- Tailwind CSS v4, shadcn/ui (Radix), lucide ikone, font Manrope (ima latin-ext i ćirilicu za RU).
- **next-intl**:
  - `me` (interni ID `sr-Latn-ME`, zbog ispravnog Intl formatiranja i hreflang-a) je podrazumijevani jezik i nema prefiks (`/vodoinstalater-podgorica`).
  - `/en/plumber-podgorica` i `/ru/santehnik-podgorica` imaju lokalizovane slugove.
  - Na svakoj stranici su hreflang oznake i `x-default`.
- **Supabase**:
  - Postgres sa RLS, ekstenzijama `pg_trgm` i `unaccent` za pretragu bez dijakritika ("elektricar" nađe "Električar").
  - Auth: Google + email magic link. Kasnije i SMS OTP.
  - Storage za slike.
  - `@supabase/ssr` za server klijent.
- Rendering:
  - ISR za javne stranice (`revalidate` 1h).
  - Kad biznis izmijeni profil, `revalidateTag` odmah osvježava njegove stranice.
  - `generateStaticParams` generiše unaprijed najtraženije kombinacije.
- Zod za validaciju, react-hook-form za forme.
- Mapa: Leaflet + OpenStreetMap (besplatno), učitava se lijeno samo na profilu.
- Analitika: Vercel Analytics i Google Search Console. Consent banner sa Google Consent Mode.

## Informaciona arhitektura (1:1 sa Košnicom + poboljšanja)
| Stranica | URL (me) | Napomena |
|---|---|---|
| Početna | `/` | Hero "Šta ti danas treba?", pretraga usluga + grad, chipovi grupa, Sponzorisano, Popularno, Posljednja aktivnost (recenzije), brojke (gradovi/usluge/biznisi), Popularne usluge, Koliko košta?, Dostupno u cijeloj Crnoj Gori, Kako funkcioniše, Česta pitanja, Popularne pretrage po gradovima (tabovi), footer |
| Sve usluge | `/usluge` | 15 grupa |
| Usluga (cijela CG) | `/usluge/{usluga}` | |
| **Usluga + grad** | `/{usluga}-{grad}` (+ `/2`, `/3` za paginaciju) | Glavna SEO stranica: H1, broj profila, ocjena, Sponzorisano, rezultati, zamjena iz okoline po regionu (Primorje/Centar/Sjever), recenzije, O usluzi, FAQ sa automatskim cijenama, Kako izabrati, interni linkovi |
| Gradovi | `/gradovi`, `/gradovi/{grad}` | 25 opština + naselja (Bečići, Petrovac, Igalo, Sutomore, Golubovci…) |
| Profil biznisa | `/b/{slug}` | Kratak čitljiv slug, bez Firestore ID-ja |
| Cijene | `/cijene`, `/cijene/{usluga}`, `/cijene/{usluga}-{grad}` | "Koliko košta … ? Cjenovnik 2026" |
| Statistika tržišta | `/statistika` | Najskuplji sat, najveći poslovi, najtraženije usluge |
| Za biznise | `/za-biznise` | Web registracija. Košnica traži aplikaciju, mi ne |
| Statične | `/kako-funkcionise`, `/pomoc`, `/bezbjednost`, `/o-nama`, `/kontakt` | |
| Pravne | `/uslovi`, `/uslovi-placanja`, `/privatnost`, `/kolacici` | |
| Korisnik | `/prijava` (modal + stranica), `/moj-nalog` | |
| Biznis panel | `/panel` | Profil, galerija, cjenovnik, radno vrijeme, recenzije (odgovori), statistika pregleda i klikova |
| Admin | `/admin` | Moderacija biznisa, recenzija i prijava, verifikacija, sponzorstva |
| Kasnije | `/poslovi`, "Pošalji upit", plaćanje Pro | |

### Gdje smo bolji od Košnice
- **Kontakt bez prijave.** Dugmad Pozovi, **Viber**, **WhatsApp**, Email i Sajt. Broj se prikaže tek na klik; klik se broji i štiti broj od scrapinga.
- **Filteri** na listama: ocjena 4+, Provjeren, Radi sada, Online, Hitno/24h. **Sortiranje**: preporučeno, ocjena, najviše recenzija.
- **Bedž "Provjeren"**: admin provjeri PIB/CRPS i telefon. Plus bedževi za vrijeme odgovora i "Novo".
- **Radno vrijeme, mapa i zona rada** (više opština).
- **Registracija biznisa na webu za manje od 2 minuta**, u 3 koraka: usluge → grad(ovi) → kontakt i slike. Profil odmah vidljiv sa oznakom "na provjeri".
- **Pro cijene javno objavljene** (kad krene plaćanje).
- **hreflang, ispravni OG naslovi na svim stranicama, dinamičke OG slike.**

## Model podataka (Supabase migracije u `supabase/migrations`)
- `regions` (Primorje, Centar, Sjever).
- `cities`:
  - `slug`, `name_me/en/ru`, `name_locative_me` ("u Podgorici", "u Herceg Novom"), `region_id`, `parent_city_id` za naselja, `lat/lng`, `population`.
- `service_groups`.
- `services`:
  - `slug_me/en/ru`, `name_*`, `plural_gen_me` ("električara"), `description_*`, `faq_*` (jsonb), `tips_*`, `schema_type` (Electrician, Plumber…), `price_unit_default`.
- `service_price_items`: predlošci stavki cjenovnika.
- `businesses`:
  - `owner_id`, `slug`, `name`, `description`, `phone`, `viber`, `whatsapp`, `email`, `website`, `instagram`, `address`, `lat/lng`.
  - `status` (pending/active/rejected/suspended), `verified_at`, `offers_online`, `emergency_24h`, `languages[]`.
  - `response_time_bucket`, `views_count`, `rating_avg`, `rating_count` (trigger ih održava).
- `business_services` (m:n, najviše 3 primarne) i `business_cities` (zona rada).
- `business_hours`, `business_photos` (storage path, redosljed, cover).
- `price_list_items`: `name`, `price_from`, `price_to`, `unit` (sat/m²/komad/posao), tip cijene "po dogovoru" ili "besplatno".
- `reviews`:
  - `user_id`, `business_id`, `rating`, `body`, `edited_at`, `reply_body`, `status`.
  - Unique (user, business). Vlasnik ne može ocijeniti svoj biznis (provjera kroz RLS/constraint).
- `reports` (recenzija ili biznis, razlog).
- `profiles` (ime, uloga: user/business/admin).
- `contact_events` (tip klika) i `page_views`, agregirano dnevno.
- `sponsorships`:
  - `business_id`, `scope` (home/service/city/service_city), `service_id?`, `city_id?`, `starts_at`, `ends_at`, `status`, `payment_ref`.
  - Plaćanje kasnije samo dodaje redove ovdje.
- `inquiries`: tabela spremna za kasnije, bez UI-ja za sada.
- Materijalizovani view `price_stats` (usluga × grad: prosjek, medijana, min, max, broj). Pg_cron ga osvježava svaku noć i on hrani stranice `/cijene` i `/statistika`.
- RLS:
  - Javno čitanje samo za `active` biznise.
  - Vlasnik mijenja samo svoj biznis.
  - Admin preko `role`.
- **Seed**:
  - 25 opština + ~15 naselja sa lokativima.
  - ~170 usluga prevedenih na ijekavicu (cijena, cjenovnik, namještaj, čuvanje djece…), sa EN/RU nazivima i slugovima.
  - FAQ i savjeti za top ~40 usluga.
  - Demo biznisi samo u development okruženju.

## SEO (najjači mogući)
- **Indeksiramo samo stranice sa sadržajem.** Kombinacija usluga + grad ide u sitemap i dobija `index` tek kad ima ≥1 aktivan biznis; prazne dobijaju `noindex, follow`. Tako izbjegavamo kaznu za tanak sadržaj.
- **Sitemap indeks** (`app/sitemap.ts` sa `generateSitemaps`), podijeljen po tipu stranice i jeziku, sa `lastmod` iz podataka. `robots.ts`.
- **Šabloni naslova** (ijekavica):
  - "Vodoinstalater Podgorica: cijene i recenzije | Tražim"
  - "Koliko košta električar u Budvi? Cjenovnik 2026"
  - Opis: "{N} vodoinstalatera u Podgorici. Prosječna ocjena 4.9 od 37 recenzija. Uporedi cijene i kontaktiraj besplatno."
- **JSON-LD** (u jednom `@graph`):
  - WebSite + SearchAction i Organization.
  - Usluga+grad: Service + AggregateOffer (EUR), ItemList, FAQPage, BreadcrumbList.
  - Profil: LocalBusiness (podtip po usluzi), sa AggregateRating, Review[], OpeningHoursSpecification i GeoCoordinates.
  - Cijene: WebPage + AggregateOffer.
- Canonical na svakoj stranici, uključujući paginaciju. hreflang me/en/ru + x-default. `og:locale` `sr_ME`/`en_US`/`ru_RU`. `html lang="sr-Latn-ME"` (me), `en`, `ru`.
- **Dinamičke OG slike** (`opengraph-image.tsx`) za profil, usluga+grad, cijene i statistiku.
- **Interni linkovi** kao kod Košnice, plus region blokovi:
  - Svaka usluga+grad stranica linkuje 10 gradova i 10 sličnih usluga.
  - Linkovi ka cijenama.
  - Breadcrumb na profilu.
  - "Popularne pretrage po gradovima" na početnoj.
- **Performanse:**
  - RSC, cilj je minimalan JS na javnim stranicama.
  - next/image (AVIF/WebP) sa Supabase transformacijom slika.
  - Font preko `next/font`.
  - Lijeno učitavanje mape i galerije.
  - Cilj: Core Web Vitals zeleni, Lighthouse ≥95.
- Sponzorisani blok dobija `data-nosnippet` i ne ulazi u ItemList.
- `/cijene` i `/statistika` su sadržaj za linkove od portala (Vijesti, CdM).

## Dizajn i UX
- Čist i svijetao izgled kao na Košnici, ali sa jačim brendom: primarna boja plava ili teget (povjerenje) i topao akcenat. Tokeni u Tailwind temi. Tamni mod nije potreban u v1.
- **Prvo mobilni**:
  - Sticky kontakt traka na dnu profila.
  - Pretraga u 2 koraka ("Koja usluga?" → "Koji grad?") sa trigram autocomplete-om.
  - Grad se pamti.
  - Veliki tap targeti.
- Kartica biznisa: cover slika, ime, ocjena (broj), pregledi, grad · usluge, "Odgovara za 1h", "Provjeren", "od 20 €".
- Pristupačnost: semantički HTML, fokus stilovi, kontrast AA.

## Struktura projekta (ključni fajlovi)
- `src/app/[locale]/(public)/…`: `page.tsx` (početna), `[slug]/page.tsx` (razrješava usluga-grad po slugu), `[slug]/[page]/page.tsx`, `usluge/…`, `gradovi/…`, `b/[slug]/…`, `cijene/…`, `statistika`, statične stranice.
- `src/app/[locale]/(app)/panel/…`, `admin/…`, `moj-nalog`.
- `src/app/sitemap.ts`, `robots.ts`, `src/proxy.ts` (next-intl + osvježavanje Supabase sesije).
- `src/i18n/` (routing sa lokalizovanim pathnames), `messages/{sr-Latn-ME,en,ru}.json`.
- `src/lib/supabase/{server,client,admin}.ts`, `src/lib/queries/*` (keširani upiti sa tagovima), `src/lib/seo/{metadata,jsonld}.ts`, `src/lib/slug.ts` (transliteracija č/ć→c, š→s, ž→z, đ→dj; ruski u latinicu).
- `src/components/{ui,search,business,layout,seo}`.
- `supabase/migrations/*.sql`, `supabase/seed/*.sql`, `supabase/config.toml`.

## Faze izvršenja
1. ✅ **Setup (urađeno 2026-09-24):** `create-next-app` (TS, Tailwind, App Router, src), shadcn, next-intl, Supabase CLI, ESLint/Prettier, env šablon.
2. ✅ **Baza (2026-09-24, migracija 4 dodala public_reviews, sync glavnog grada i zaštitu kontakata: migracije, RLS, seed 40 gradova + 187 usluga i `pnpm test:db` gotovi; primijenjeno na cloud projekat `bedebhielbevperpxddp` (eu-west-1, pooler aws-1-eu-west-1); ostaje: `db:types` (treba SUPABASE_ACCESS_TOKEN, nema Dockera), FAQ/savjeti i predlošci cjenovnika za top usluge):** migracije, RLS, triggeri, `price_stats`, seed gradova i usluga (me/en/ru).
3. ✅ **Javne stranice (2026-09-24: sve stranice iz IA tabele osim auth/panel/admin; pravne stranice su nacrt (noindex dok `SITE.legalReviewed` nije true); demo podaci `pnpm db:demo --remove` prije lansiranja):** layout (header, footer, pretraga), početna, usluga+grad sa filterima i paginacijom, usluga, gradovi, profil, cijene, statistika, statične i pravne.
4. 🟡 **Auth i panel (2026-09-24: Google + Apple + magic link, /prijava, /moj-nalog, čarobnjak /panel/novi, panel sa tabovima profil/usluge/radno vrijeme/cjenovnik/slike/recenzije, `pnpm test:e2e` prolazi; Google prijava i redirect URL-ovi podešeni; ostaje: Apple (treba Apple Developer nalog), custom SMTP):** prijava (Google/Apple/magic link), registracija biznisa u 3 koraka, uređivanje profila, galerija (upload i resize), cjenovnik, radno vrijeme, odgovori na recenzije, statistika.
5. ✅ **Recenzije i prijave (2026-09-24: migracija `moderation` (limiti 10 recenzija / 20 prijava dnevno, jedna otvorena prijava po meti, poruka moderatora vlasniku, admin log); forma na profilu sa nacrtom u localStorage koji preživi prijavu i traži ime ako ga nema; izmjena i brisanje; "Prijavi" za profil i svaku recenziju; odgovor vlasnika u panelu (tab Recenzije); "Moje recenzije" na /moj-nalog):** forma sa odloženom prijavom ("Tvoja recenzija je spremna"), izmjena, prijava sadržaja.
6. ✅ **Admin (2026-09-24: /admin sa pregledom, profili (odobri, provjeren, odbij/suspenduj sa razlogom, vrati), prijave (sakrij recenziju, suspenduj, riješeno/odbaci), recenzije (sakrij, ukloni, vrati), sponzorstva (ručni unos sa više pozicija odjednom: početna, usluga, grad, usluga + grad; pauza, otkazivanje; "Usluga + grad" se prikazuje i na stranici grada i usluge); sve akcije u admin logu; 404 za ne-admine; uloga preko `pnpm admin:set <email>`; E2E `tests/e2e/reviews-admin.test.mjs` 22/22):** moderacija, verifikacija, ručno dodavanje sponzorstava (radi i prije online plaćanja).
7. ✅ **SEO, AI vidljivost i prednosti nad samoruke.me (2026-09-25, plan `~/.claude/plans/serene-painting-snowglobe.md`, istraživanje u `docs/research/samoruke-me.md` i `docs/research/seo-geo-2026.md`):**
   - Tehnički SEO:
     - sitemap indeks + 6 sitemap-ova (samo indeksabilne stranice, hreflang, lastmod, slike profila)
     - robots.txt otvoren za sve search i AI botove
     - ikone, `/logo.png`, dinamičke OG slike (Manrope, ćirilica)
     - FAQ odgovori u HTML-u (`<details>`)
     - interni linkovi samo ka kombinacijama sa biznisima (`src/lib/seo/indexable.ts`)
     - IndexNow (`INDEXNOW_KEY`), verifikacija preko env varijabli
     - `pnpm test:seo`
   - Cijene kao izvor za AI:
     - odgovor u jednoj rečenici, p25/p75, „ažurirano“
     - tabela po gradovima, metodologija
     - CSV `/data/cijene/{usluga}.csv`, Dataset JSON-LD (i `/statistika`)
   - Tekst o uslugama (opis, 5 FAQ, 4 savjeta × 3 jezika) za top 40 usluga: `supabase/seed/data/content/`, upis `pnpm db:content`.
   - Rezime iz podataka na listama, sezonska napomena za primorje.
   - `/kako-rangiramo` (EU 2019/1150, DSA), paketi i cijene na `/za-biznise` (2026-09-25: Vrh liste 39 € Podgorica i primorje / 19 € ostali gradovi, grad 59 €, cijela CG 49 €, početna 99 €, godišnje = 10 mjeseci; najviše 3 sponzora po stranici i 4 na početnoj, admin odbija punu poziciju; `SPONSOR_*` u `src/lib/site.ts`; PDV provjeriti sa računovođom).
   - Recenzije sa do 4 fotografije.
   - „Pošalji upit“:
     - svi odgovarajući biznisi vide upit u panelu, tab Upiti
     - broj telefona se otkriva na klik i broji se
     - „Moji upiti“ na /moj-nalog, `/admin/upiti`
     - email obavještenja čekaju SMTP
   - Značka „Preporučeno na Tražim“ + QR u panelu (tab Podijeli).
   - Dopuna od 2026-09-25:
     - tekst za svih 187 usluga
     - 28 novih naselja (primorje i djelovi Podgorice), ukupno 68; upis sa `pnpm db:cities`
     - naselje se indeksira tek kad ga neki biznis sam navede u zoni rada (zaštita od doorway stranica)
   - Ostaje:
     - Search Console i Bing Webmaster nakon deploy-a
     - jezici tr/sq kad bude potražnje
8. **Kasnije:** plaćanje (Stripe Checkout/Billing + webhook) za Pro/sponzorisano, "Pošalji upit" + `/poslovi`, SMS OTP, Viber obavještenja.

## Šta trebam od tebe tokom rada
- Supabase projekat (URL, anon key, service role key), Google OAuth klijent i Vercel nalog/domen. Do tada radim lokalno (Supabase lokalno ako imaš Docker, inače odmah na cloud projekat).
- Kupovinu domena trazim.me.

## Verifikacija
- `pnpm lint`, `pnpm typecheck` i `pnpm build` bez grešaka.
- `supabase db reset` primijeni migracije i seed. RLS testovi: anon ne vidi pending biznise, korisnik ne mijenja tuđi biznis.
- Playwright smoke testovi:
  - pretraga → usluga+grad → profil → klik "Pozovi" ili "Viber"
  - registracija biznisa → profil vidljiv
  - ostavljanje recenzije
  - promjena jezika me/en/ru čuva ekvivalentnu stranicu
- SEO:
  - Google Rich Results Test na profilu, usluga+grad i cijenama.
  - Validacija `sitemap.xml`.
  - Provjera canonical i hreflang oznaka.
  - Lighthouse (mobilni) ≥95 za Performance, SEO i Accessibility.
- Ručno: `pnpm dev`, pregled početne na mobilnoj i desktop širini u odnosu na Košnicu.
