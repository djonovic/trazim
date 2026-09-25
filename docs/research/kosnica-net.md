# Košnica (kosnica.net) site inventory, for a Montenegro clone

I checked the site on 2026-09-24. I fetched each page type: I read the raw HTML with curl and summarised pages with WebFetch. Every page is server-rendered, and the whole Serbian text dictionary of the site (all labels and messages) is embedded in each page. That is how I could quote the login, inquiry, chat and review flows word for word without logging in. Two things could not be seen: the logged-in pages themselves, and Pro prices, which are only shown inside the app stores.

---

## 1. Page types and URL patterns

The sitemap (`https://kosnica.net/sitemap.xml`) is a single file with about 10,900 URLs:

| Page type                    | URL pattern                                                                                                 | Count in sitemap                                | Example                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Homepage                     | `/`                                                                                                         | 1                                               | `https://kosnica.net`                                                                                                    |
| All services                 | `/usluge`                                                                                                   | 1                                               |                                                                                                                          |
| Service page (whole country) | `/usluge/{service}`                                                                                         | 127 (171 in the full taxonomy)                  | `/usluge/elektricar`                                                                                                     |
| **Service + city page**      | **`/{service}-{city}`** at root level, **not** `/usluge/x/grad` (that returns 404)                          | about 8,800                                     | `/elektricar-beograd`, `/zavarivac-vrsac`, `/joga-ada`                                                                   |
| Service + city, next pages   | `/{service}-{city}/{n}`                                                                                     | not in sitemap                                  | `/elektricar-beograd/2` (own canonical, index,follow; title "Električar Beograd - Strana 2"). `?page=2` also returns 200 |
| All cities                   | `/gradovi`                                                                                                  | 1                                               | 152 cities in A–Ž groups                                                                                                 |
| City page                    | `/gradovi/{city}`                                                                                           | 67                                              | `/gradovi/beograd`, `/gradovi/novi-beograd`, `/gradovi/zemun`                                                            |
| Price index                  | `/cena`                                                                                                     | 1                                               |                                                                                                                          |
| Price page (country)         | `/cena/{service}`                                                                                           | about 22                                        | `/cena/elektricar`                                                                                                       |
| Price page (city)            | `/cena/{service}-{city}`                                                                                    | about 13                                        | `/cena/elektricar-beograd`                                                                                               |
| Market statistics            | `/statistika`                                                                                               | 1                                               |                                                                                                                          |
| Jobs / public inquiries      | `/poslovi`, `/poslovi/{service}`, `/poslovi/{service}/{city}`                                               | 13                                              | `/poslovi/elektricar/beograd`                                                                                            |
| Business profile             | `/b/{slug}-{20-char Firestore ID}`                                                                          | 1,851                                           | `/b/ciststan-olga-vasic-quwqG7Bjt8ACyEt2Ijy8`                                                                            |
| Static pages                 | `/kako-funkcionise`, `/pomoc`, `/bezbednost`, `/o-nama`, `/kontakt`, `/za-biznise`, `/preuzmi`              |                                                 |                                                                                                                          |
| Legal pages                  | `/uslovi`, `/uslovi-naplate`, `/privatnost`, `/kolacici`, plus a "Podešavanja kolačića" button (not a page) |                                                 |                                                                                                                          |
| Logged-in pages              | `/poruke` (chat), `/upiti` (my inquiries), `/podesavanja` (settings)                                        | all return 200 and show "Prijavi se da vidiš …" |                                                                                                                          |
| English version              | `/en/...`                                                                                                   | not in sitemap, no hreflang                     | `/en` title: "Handymen, Cleaners, Psychologists & 170+ Services"                                                         |

**Routes that do not exist (404):** `/prijava`, `/login`, `/pretraga`, `/search`, `/blog`, `/premium`, `/pro`, `/cene`, `/sr-Cyrl`. There is no blog. Login happens in a modal. Search is a modal with two fields that sends you to the service + city URL. `/sr-Latn` redirects (308) to `/`.

**Link tracking:** links to profiles carry a hash fragment with the source and slot: `#source=home|category|city|price` and `&slot=pinned` for sponsored cards.

### Homepage `/`

Sections in order:

1. **Header:** logo, "Traži..." search button, "Dodaj svoj biznis" (goes to `/za-biznise`), 🇷🇸 language switcher.
2. **Hero:** "Šta ti danas treba?" over an illustration (a painter, a cleaner, a photographer and a handyman). Category chips: Kućne usluge, Časovi i obrazovanje, Životni stil, Lepota i zdravlje, Vozila i transport, "Vidi sve".
3. **"Sponzorisano":** 6 paid cards.
4. **"Popularno":** about 10 cards.
5. **Stats block:** "Od Subotice do Vranja / Od psihologa do vodoinstalatera" with 152 Grada / 171 Usluga / 3.199 Biznisa.
6. **"Popularne usluge":** 10 service links, plus "Vidi sve".
7. **"Koliko košta?":** 6 tiles such as "Električar od 500 din", plus "Vidi sve cene" and "Vidi statistiku tržišta".
8. **"Dostupno u celoj Srbiji":** 10 cities, plus "I još 100+ gradova".
9. **"Kako funkcioniše":** three steps, Pretraži / Pregledaj profile / Kontaktiraj.
10. **"Česta pitanja":** 4 questions and answers, linking to `/pomoc`.
11. **"Poslednja aktivnost":** latest reviews (author, "pre 1 sat", business, city, text).
12. **"Popularne pretrage po gradovima":** tabs for 8 cities, each with 12 service + city links.
13. **App block:** "Košnica mobilna aplikacija / 150 usluga na dohvat ruke", with App Store and Google Play badges.
14. **Footer:**
    - Top: O nama, Preuzmi aplikaciju, Instagram and Facebook (@kosnicanet).
    - "Za korisnike": Usluge, Gradovi, Cene usluga u Srbiji, Statistika tržišta.
    - "Za biznise": Dodaj svoj biznis, Poslovi.
    - "Pomoć": Kako funkcioniše, Centar za pomoć, Kontakt, Bezbednost.
    - Legal row: Uslovi korišćenja · Uslovi naplate · Politika privatnosti · Politika kolačića · Podešavanja kolačića.
    - "© 2026 Gradoid DOO", plus Apple and Google trademark notices.

### Service + city page, e.g. `/elektricar-beograd` (the main SEO page)

1. Breadcrumb: Košnica > Beograd > Električar.
2. H1 "Električar Beograd", subtitle "97 električara u Beogradu …", and the overall rating "5.0(37)".
3. **"Pošalji upit"** call to action: "Poslaćemo svima, pa ti biraš ponudu koja ti odgovara." It appears in the page body and again in a sticky sidebar / mobile bottom bar.
4. **"Sponzorisano"** section (up to about 8 cards; the section has `data-nosnippet`), then **"Još rezultata"** (organic results, about 20 per page).
5. Pagination: "Prethodna / 1 2 … 5 / Sledeća".
6. When there are too few results, a fallback appears: "Nema rezultata za {city}" with "Pogledaj ove profile iz okoline / širom Srbije. Mnogi nude i online."
7. "Električar Beograd — recenzije": 6 recent reviews with "Pročitaj još".
8. "O usluzi {category}": descriptive text.
9. "Najčešća pitanja" (3–4 per service). Price answers are computed automatically ("Prosečna cena je 2.882 din, a kreće se od 500 do 5.500 din"). The rest are hand-written per service ("Da li električar može da izda atest…", "Kada treba zvati…").
10. "Kako izabrati — električar": 4 tips.
11. Internal links:
    - "Električar u drugim gradovima": 10 cities plus the country page.
    - "Slične usluge u Beogradu": 10 links.
    - "Cene": links to `/cena/elektricar-beograd` and `/cena/elektricar`.
    - "Poslovi": "Radiš ovaj posao? 33 upita u poslednjih 30 dana", linking to `/poslovi/elektricar/beograd`.
12. "Nudiš usluge? Preuzmi Košnica Biz…" block with badges for the business app (UTM campaign `combo`, content = page slug).

### Service page (country), e.g. `/usluge/elektricar`

- Title "Električar u Srbiji — 276 profila sa cenama".
- Breadcrumb Košnica > Usluge > Električar, H1.
- Sponzorisano, then Još rezultata (cards show the city).
- "Električar — recenzije", "O usluzi električar", "Najčešća pitanja" (country-wide average price), "Kako izabrati".
- City links for this service.

### City page, e.g. `/gradovi/beograd`

- Title "Usluge Beograd | 657 profila u 128 kategorija".
- H1 "Beograd".
- "Popularne usluge u Beogradu": 16 service + city links.
- Sponzorisano (`source=city`), Još rezultata across all categories, and "Recenzije u {city}".

### Price pages ("Koliko košta")

- **Index `/cena`:** H1 "Cene usluga u Srbiji", "Ažurirano avgust 2026", a "Popularno" tile grid ("Dubinsko pranje nameštaja od 250 din" …), and "Pogledaj sve" (22 services).
- **`/cena/elektricar-beograd`:**
  - H1 "Koliko košta Električar u Beogradu?" and "Uporedi prosečne cene po usluzi. Cenovnik za Beograd."
  - Summary card: "2.882 din · raspon 500 do 5.500 din · 154 biznisa · 5,0 (56)".
  - Table with columns Usluga / Jedinica / Prosečna cena / Raspon, e.g. "Montaža rasvete 2.500 din, 700 – 5.500"; "Zamena utičnica i prekidača 1.000 din po komadu"; "Izlazak na teren 3.263 din".
  - Auto-generated sentence: "Najtraženija usluga je Montaža rasvete…".
  - Sponzorisano and Još rezultata (`source=price`), "Vidi sve biznise u Beogradu", the business-app call to action, Najčešća pitanja, "Cene u drugim gradovima" / "Cene po gradovima", "Ostali vodiči kroz cene".
  - Title template "Koliko košta {category}? Cenovnik {year}". The year is in the title as a freshness signal.

### Market statistics `/statistika`

- H1 "Statistika tržišta usluga u Srbiji", "Prikazujemo samo usluge sa dovoljno podataka. Ažurirano avgust 2026."
- Three top-10 rankings, each linking to `/cena/...`:
  - "Najskuplji sat rada" ("Medijana cene po satu, u dinarima"), e.g. Čišćenje posle renoviranja 1.600.
  - "Najveći poslovi" (median price per whole job), e.g. Izrada sajta 31.431, Montaža klime 16.000.
  - "Najtraženije usluge" ("Prosečan broj pregleda oglasa po biznisu"), e.g. Psihoterapeut 83.
- A fourth ranking, "Najskuplje po m²", exists in the dictionary but is not shown yet.
- Has its own dynamic OG image (`/statistika/opengraph-image`).

### Jobs `/poslovi` (public inquiry feed, aimed at businesses)

- H1 "Poslovi za majstore i čistačice", "582 upita mušterija u poslednjih 30 dana".
- Filter chips for 5 services: ciscenje, moler, majstor, elektricar, stolar.
- Anonymised inquiry cards:
  - Time ("pre 1 sata"), status ("Ima odgovora" / "Popunjeno" / "Završeno" / "Još nema odgovora"), "Hitno ·" prefix, service and city.
  - The structured answers, e.g. cleaning: Prostor, Površina "31–50 m²", Vrsta, Učestalost, Sredstva, Ljubimci, Dodatno, Termin "U narednih 7 dana / Hitno (danas ili sutra) / Ne znam još uvek / Kasnije".
- "Prikazano je poslednjih 20 upita." and "Napravi poslovni profil" (links to the Biz app).

### Business profile `/b/{slug}-{id}`

Covered in section 3.

### "Za biznise" `/za-biznise`

- H1 "Privuci nove mušterije", "Napravi besplatan poslovni profil za par minuta. Preko 3.000 biznisa je već u Košnici."
- Four benefit cards: "Besplatan profil", "Mušterije te kontaktiraju", "Upiti", "Budi na vrhu" ("Košnica Pro te stavlja na vrh liste…").
- "Imaš pitanja? Piši nam — Odgovaramo u roku od 24 sata."
- Badges for the Biz app. **Registering a business is app-only (Košnica Biz); there is no web signup.**

### Other static pages

- **`/kako-funkcionise`:**
  - "Za korisnike" (Pretraži / Pregledaj profile / Kontaktiraj / Dogovori se / Ostavi recenziju).
  - "Za biznise" (Registruj se besplatno / Kreiraj profil / Mušterije te kontaktiraju / Primaj upite / Gradi reputaciju).
  - "Važno da znaš": "Košnica je OGLASNIK", "Plaćanje je direktno", "Ne garantujemo kvalitet".
- **`/pomoc`:** accordion FAQ in four groups:
  - Za korisnike: 7 questions.
  - Za biznise: 11 questions, e.g. "Šta je upit, a šta poruka?", "Šta dobijam sa Košnica Pro?", "Kako da upravljam recenzijama?".
  - Plaćanje: 7 questions (cards, no payment slips, auto-renewal, restoring purchases).
  - Opšta pitanja: 4 questions.
- **`/bezbednost`:** "Košnica ne proverava biznise"; five-step advice for customers, advice for businesses, "Znakovi upozorenja", and reporting ("Prijavi" button, kosnica@gradoid.com, police 192).
- **`/o-nama`:** the story (a founding couple: Miloš and Biljana Jokić, Gradoid DOO), Misija, Vrednosti.
- **`/kontakt`:** milos@gradoid.com, answers within 24 hours.
- **`/preuzmi`:** two apps.
  - Košnica (consumer): iOS `id6503902420`, Android `com.gradoid.kosnica.android`.
  - Košnica Biz: iOS `id6503895840`, Android `com.gradoid.kosnica.business.android`.

---

## 2. Category taxonomy (171 services, 15 groups, from `/usluge`)

- **Kućne usluge:** Vodoinstalater, Električar, Majstor, Čišćenje, Moler, Bravar, Stolar, Održavanje travnjaka, Agent za nekretnine, Keramičar, Postavljanje podova, Grejanje, Izolacija, Pranje tepiha, Dubinsko pranje nameštaja, DDD - Dezinsekcija, Izrada ograda, Betoniranje i popločavanje, Staklorezac, Krovopokrivač, Roletne, Zavarivač, Uređenje dvorišta, Odvoz šuta i otpada, Peglanje, Montaža nameštaja, Renoviranje stanova, Renoviranje kupatila, Cepanje drva
- **Lepota i zdravlje:** Kozmetičar, Frizer, Šminker, Masaža, Joga, Fizioterapeut, Nutricionista, Manikir i pedikir, Tetoviranje, Depilacija, Epilacija, Berberin, Homeopatija, Reiki, Kiropraktičar
- **Popravke i servis:** Popravka računara, Popravka telefona, Servis bele tehnike, Servis klima, Popravka elektronike, Servis bicikala, Popravka nameštaja, Računarske mreže
- **Kućni ljubimci:** Šetanje pasa, Čuvanje kućnih ljubimaca, Veterinar, Šišanje ljubimaca
- **Zanati:** Krojač, Tapetar, Obućar, Odžačar, Video nadzor, Sajdžija, Izrada po narudžbini, Bravarija, Metalostrugar, Farbanje nameštaja
- **Događaji i zabava:** DJ, Bend, Iznajmljivanje audio opreme, Muzički kompozitor, Konobar, Pisanje pesama, Snimanje videa, Muzički producent, Organizacija događaja, Ketering, Cvećar, Poslastičar (torte), Dekoracija proslava
- **Vozila i transport:** Pranje automobila, Popravka automobila, Servis hidraulike, Obrada diskova i doboša, Iznajmljivanje automobila, Prevoz, Vozač, Selidbe, Šlep služba, Vulkanizer, Autolimar, Kurir, Dubinsko pranje auta
- **Časovi i obrazovanje:**
  - Language lessons: Časovi engleskog / nemačkog / španskog / turskog / italijanskog / norveškog / arapskog / francuskog / srpskog / ruskog / latinskog / mađarskog jezika.
  - Subject lessons: Časovi matematike / programiranja / fizike / hemije / biologije / istorije / geografije / muzike.
  - Other: Pisanje radova, Auto-škola, Časovi plesa, Časovi likovnog, Sportski trening.
- **Životni stil:** Psiholog, Psihoterapeut, Hipnoterapija, Lični trener, Fotograf, Čuvanje dece, Dečiji animator, Negovatelj, Kuvar, Logoped, Lajf kouč, Defektolog, Pedagog, Rani razvoj dece
- **Dizajn:** Grafički dizajn, Veb dizajn, Dizajn aplikacija, Ilustracije, Dizajn enterijera, 2D i 3D modeliranje, Uređivanje videa, Umetnost
- **Marketing:** Marketing na društvenim mrežama, Kopirajter (komercijalno pisanje), Marketing, Optimizacija za pretraživače (SEO)
- **Razvoj softvera:** Razvoj mobilnih aplikacija, Razvoj veb aplikacija, Razvoj veb sajtova, WordPress
- **Poslovanje:** Virtuelni asistent, Poslovno savetovanje, Računovodstvo, 3D štampa, CNC usluge, Pravne usluge, Finansijske usluge, Procenitelj, Pravnik, Medijator, Prevodilac, Građevinarstvo, Arhitekta, Hemijsko čišćenje, Štamparija, Notar, Geodeta, Fizičko obezbeđenje, Bezbednost i zdravlje na radu, Aromatizacija prostora, Upravnik zgrade
- **Ostalo:** Čekanje u redu, Astrolog, Ostalo

**Slugs** are ASCII transliterations: č/ć→c, š→s, ž→z, đ→dj. Examples: `casovi-engleskog-jezika`, `ddd-dezinsekcija`, `poslasticar-torte`, `optimizacija-za-pretrazivace-seo`. The embedded dictionary also contains a sub-service list per category (price-list item presets such as "Probni čas joge", "Zamena baterije telefona"). There is also a rule that "Prodaja gotovih fizičkih proizvoda (MLM) nije dozvoljena", while custom-made craft work is allowed.

---

## 3. Business profile fields

Example: `/b/ciststan-olga-vasic-quwqG7Bjt8ACyEt2Ijy8`

**Header**

- Breadcrumb: Košnica > {City} > {Primary service}. The service crumb links to the service + city page (`/ciscenje-beograd`).
- H1 name and "Podeli" (share: "Link kopiran").
- City, **view count** ("200+ pregleda", shown in buckets 10+/20+/50+/100+/200+/500+/1.000+).
- Rating "5.0" and "11 recenzija".
- **"Odgovara za 1h"** (other values seen: 6min, 15min, 2h, "Odgovara u toku dana").
- "Novo u Košnici" badge for new profiles.
- **There is no verified badge.** The site says openly: "Ne proveravamo identitet, kvalifikacije niti licence".

**Contact**

- Buttons "Poruka / Pošalji poruku" (in-app chat) and "Kontakt / Kontaktiraj". Kontaktiraj reveals "Pozovi" (phone) and "Pošalji email".
- **Seeing the contact requires login** ("Prijavi se da vidiš kontakt").
- **No WhatsApp, Viber or website buttons.** Businesses often put phone numbers in their descriptions instead.
- The contact bar is repeated as a sticky sidebar / bottom bar.

**Body**

- "Usluge": category chips (up to 3 categories per business, as far as I saw).
- Free-text description (emoji and line breaks allowed).
- "Cenovnik": item name + price. Price formats are a number ("Psihoterapija 50 min 3.500"), "Od {price}", "Po dogovoru", or "Besplatno". Units (per hour, per m², per piece, per job) feed the `/cena` statistics.
- "Galerija": grid with "Vidi sve (17)" and a lightbox (Prethodna / Sledeća slika). Images are hosted on Firebase Storage (`businesses/{id}/images/profile`, `/gallery/{ts}`).
- Area: only the city is shown. JSON-LD sometimes includes `streetAddress` (municipality or street). **No map** is shown.
- Working hours are mentioned in the help text ("Dodaj opis, fotografije i radno vreme") but I did not see them rendered on any web profile I checked.

**Reviews ("Šta drugi kažu")**

- Average and count.
- Each review: author name, relative date ("pre 16 sati", "prošle nedelje"), "(izmenjeno)" marker if edited, optional text, and the business's public reply shown indented under the review.
- "Prikaži još recenzija", "Ostavi recenziju / Oceni".
- Also: "Prijavi problem", with reasons Neprikladan sadržaj / Uvredljiv ili zlonameran / Lažne informacije / Spam.

**Below the profile**

- "Sponzorisano" (4 cards), "Pogledaj još" (people also viewed, about 10).
- Link blocks: "Usluge u {city}", "{Service} u drugim gradovima", "Slične usluge".

**Card fields** (the same everywhere): cover photo, name (H3), rating (count), views bucket, city · up to 3 categories, response time, description truncated to a few lines, "Novo u Košnici".

**Meta**

- Title "{name}, {city}".
- Description "Prosečna ocena 5.0 (od 11 recenzija). {description}".
- Dynamic OG image per profile.

---

## 4. Search, filters, sorting

- **Search** is the "Traži..." modal. Step 1 "Koja usluga?" ("Pretraži usluge..."), step 2 "Koji grad?" ("Pretraži gradove..."), with "Sledeće" / "Obriši". The result is the `/{service}-{city}` page. There is no free-text search results page.
- **No filters and no sort controls** on listing pages. The order is fixed:
  1. Sponsored (Pro) block.
  2. "Još rezultata", apparently ranked by rating, reviews and activity.
  3. A fallback to nearby or country-wide profiles, plus online providers, when a city has too few.
- Pagination is path-based (`/2`, `/3` …).

---

## 5. Sponsored listings and monetisation

- **"Sponzorisano"** is a separate block above the organic "Još rezultata" on the homepage, service, service + city, city, price and profile pages.
  - Cards carry `slot=pinned`, the block has `data-nosnippet`, and they are excluded from the JSON-LD ItemList.
  - An info tooltip reads "Vlasnici biznisa su platili za ove oglase. Saznaj više na Košnica za biznise." with the buttons "Idi na Košnica za biznise" and "Razumem".
- **Košnica Pro** is a subscription: "te stavlja na vrh liste kad neko traži tvoju uslugu. Profili na vrhu dobijaju 8x više pregleda i kontakata u proseku." It auto-renews.
- **Dukati** are virtual credits used to **reply to inquiries (lead fee)**.
  - Dukati bought in packages never expire.
  - Dukati included with Pro expire at the end of the period.
  - They cannot be refunded or transferred.
- **Payment:** only through in-app purchase (Google Play / App Store). No payment slips or bank transfers, and no manual refunds. Details are in `/uslovi-naplate`.
- **Prices are not published on the web.** No RSD amounts appear on `/za-biznise`, `/uslovi-naplate` or `/pomoc`. You would need to install Košnica Biz to see them.
- **Free:** the profile, direct messages and calls from customers.

---

## 6. SEO

**robots.txt**

- `Allow: /` for all bots. Googlebot and Bingbot get `Disallow: /*.woff2$`.
- Points to `Sitemap: https://kosnica.net/sitemap.xml`.

**sitemap.xml**

- One urlset, about 10.9k URLs.
- Home has priority 1 / daily.
- `/usluge` and `/gradovi` are 0.9; `/cena` and the service pages are 0.8 / daily with `lastmod` set to the latest profile update.
- Static pages are 0.5 / monthly. Profiles, service + city, jobs and price pages are all included.
- Only service + city combinations that have content are listed. City pages are listed for only 67 of the 152 cities.

**Canonical and meta**

- Self-canonical on every page, including paginated ones.
- OG and Twitter tags, `og:locale sr_RS`.
- Dynamic `opengraph-image` routes per profile, service + city, statistics and price page.
- Several static pages (/usluge, /statistika, /za-biznise) fall back to the homepage OG title.
- `/pomoc` uses the homepage `<title>` (a bug).

**Title templates**

- Service + city: "{Category} {City}: cene i recenzije"; page 2+: "{Category} {City} - Strana {n}".
- Service + city description: "{N} električara u Beogradu: {keywords}. Prosečna ocena 5.0 od 37 recenzija. Izaberi i kontaktiraj besplatno." The city name is declined into the locative case ("u Beogradu"), which has to be handled per city.
- Service: "{Category} u Srbiji — {N} profila sa cenama".
- City: "Usluge {City} | {N} profila u {M} kategorija".
- Price: "Koliko košta {Category}[ u {City}]? Cenovnik {year}".
- Jobs: "Poslovi za električare u Beogradu - 33 upita za 30 dana".
- Profile: "{Name}, {City}".

**JSON-LD** (everything in one `@graph`)

| Page           | Types                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home           | WebSite (with alternateName in Cyrillic, "Кошница"), Organization (+ContactPoint), ItemList of LocalBusiness items, FAQPage                                                      |
| Service + city | **Service** (`serviceType`, `areaServed` City→Country, **AggregateOffer** RSD low/high/offerCount, `provider` Organization), **ItemList** of businesses, FAQPage, BreadcrumbList |
| Service page   | ItemList, FAQPage, BreadcrumbList                                                                                                                                                |
| City page      | ItemList of businesses, City, Country, BreadcrumbList                                                                                                                            |
| Price page     | WebPage, Service, AggregateOffer, FAQPage, ItemList, BreadcrumbList                                                                                                              |
| Statistics     | CollectionPage, BreadcrumbList                                                                                                                                                   |
| /usluge        | CollectionPage + ItemList of 173 entries                                                                                                                                         |
| Profile        | LocalBusiness, BreadcrumbList                                                                                                                                                    |

- In the business ItemList, each item uses a specific schema subtype where one exists (Electrician, Plumber, HousePainter, DaySpa, otherwise LocalBusiness), with PostalAddress, `priceRange` ($/$$/$$$) and AggregateRating.
- Profile LocalBusiness nodes carry `image`, `photo[]`, `address`, **AggregateRating (ratingCount and reviewCount)** and **Review[]** (author Person, Rating, datePublished, reviewBody).

**Internal linking**

- Homepage "Popularne pretrage po gradovima": 8 cities × 12 links.
- Every service + city page links to 10 other cities for the same service, 10 similar services in the same city, 2 price pages and the jobs page.
- Profiles link to their service + city page through the breadcrumb, plus "Usluge u {city}", "{service} u drugim gradovima" and "Slične usluge".
- Price and statistics pages link to each other and to listings.

**Other**

- `html lang="sr"`. The `/en` locale exists but is not advertised with hreflang.
- The Service node has `inLanguage: sr-Latn`, and the middleware rewrites to `/sr-Latn`.

---

## 7. Tech stack

- **Next.js App Router** with React Server Components: `x-powered-by: Next.js`, `vary: rsc, next-router-state-tree…`, `/_next/static/chunks/*`, next-intl style ICU messages, middleware rewrite `x-middleware-rewrite: /sr-Latn`.
- **Firebase App Hosting** on Google Cloud: `x-fah-adapter: nextjs-14.0.21`, `server: envoy`, `via: 1.1 google`, `x-cloud-trace-context`.
- Caching: `cache-control: public, s-maxage=3600, stale-while-revalidate=60`, with a CDN cache-tag.
- **Firebase** backend: Firestore-style 20-character IDs in profile URLs, images from `firebasestorage.googleapis.com/v0/b/kosnica-7aba8.appspot.com`, Firebase Auth (email/password with a 6-character minimum, plus Google).
- Tailwind CSS. Fonts: Comfortaa and Manrope, plus Material Symbols.
- Google Ads gtag `AW-830475198`, with Consent Mode defaulting to denied. Cookie banner: "Koristimo kolačiće za analitiku i oglašavanje", buttons Prihvati / Odbij.
- Security headers: X-Frame-Options DENY, COOP, and a Permissions-Policy that blocks camera, microphone and geolocation.
- Company: Gradoid DOO (gradoid.com). Support address kosnica@gradoid.com.

---

## 8. Apps, reviews, messages and the inquiry flow

**Apps**

- Consumer "Košnica" and business-only "Košnica Biz" (profile editing, replying, Pro and Dukati all happen there).
- The web prompts people to install the app: "Ne propusti odgovore — Preuzmi Košnica aplikaciju…", with a QR code on desktop ("Skeniraj telefonom").

**Login (a modal, not a page)**

- "Prijavi se sa Google" / "Nastavi sa Google", or Email + Lozinka (Registruj se / Prijavi se / "Ne znaš lozinku?").
- Then "Kako se zoveš?" asking for Ime and Prezime.
- Login is triggered lazily, with a title that fits the action: "Tvoja recenzija je spremna", "Tvoja poruka je spremna", "Tvoj upit je spreman — Gde da ti pošaljemo odgovore?", "Prijavi se da vidiš kontakt".

**Reviews**

- **Any logged-in user can review. There is no check that the job actually happened** ("Prijavi se da je objaviš. Tako znamo da su recenzije od pravih ljudi.").
- Form "Oceni {businessName}": 1–5 stars ("Ocena") plus "Tvoja recenzija (opciono)" with a character counter, then "Objavi recenziju".
- One review per user per business; it can be edited later ("Izmeni recenziju", shown as "(izmenjeno)").
- Owners cannot review their own business ("Ne možeš da oceniš sopstveni biznis.").
- The chat nudges the customer with "Posao završen? Oceni".
- Businesses cannot delete reviews. They can reply publicly from the Biz app or report a review. A report only removes the review if it breaks the rules; "Neslaganje sa ocenom nije razlog za uklanjanje."

**Messages (`/poruke`)**

- Threaded chat with images, a daily limit, "Pozovi biznis", "Prijavi biznis", and block/unblock.
- Settings (`/podesavanja`): Profil (name) and Blokirani biznisi.

**"Pošalji upit" (request a quote, a lead marketplace)**

- Shown on service + city pages.
- Flow:
  1. "Izaberi uslugu".
  2. Either a guided questionnaire ("Odgovori na par pitanja…", with Idemo / Dalje / Preskoči / Nazad and a progress bar) or free text ("Opiši šta ti treba", at least 20 characters).
  3. Login, then name and email.
  4. Moderation ("Na proveri — Proveravamo tvoj upit"), after which the inquiry is approved or denied ("Nije odobren").
  5. It is broadcast to all matching businesses ("Poslaćemo svima").
  6. Businesses pay Dukati to reply.
  7. The customer sees replies in `/upiti` and can close the inquiry ("Zatvori upit").
- Inquiry statuses: Zatvoreno / Isteklo / Na proveri / Nije odobren. Extra messages cover the case where no business offers the service ("Nijedan biznis još ne nudi ovu uslugu.") and the case where the customer already has an open inquiry for that service.
- The questions depend on the service (see the `/poslovi` examples: m², type, frequency, cleaning supplies, pets, extras, timing, "Hitno").
- Anonymised inquiries are published in `/poslovi` as SEO content and as a hook to get businesses to sign up.

---

## Notes for the Montenegro clone

- Main page count: 171 services × the number of cities, generated only where there is content. Montenegro has 25 municipalities (Podgorica, Nikšić, Budva, Bar, Herceg Novi, Kotor, Tivat, Ulcinj, Cetinje, Bijelo Polje, Pljevlja, Berane …). Currency is EUR instead of RSD, the country code is ME, and the language is Montenegrin (Latin script, `cnr` / `sr-Latn-ME`).
- Things Košnica leaves open that you could do better:
  - Publish Pro prices on the web.
  - Offer web signup for businesses.
  - Add a verified badge.
  - Show a map, working hours, and WhatsApp/Viber buttons (these messengers are widely used in the region).
  - Add hreflang tags.
  - Fix the fallback titles and OG tags on static pages.
