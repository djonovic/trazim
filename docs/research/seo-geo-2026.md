# SEO i vidljivost u AI pretrazi: istraživanje (septembar 2026)

Oznake izvora:
- **[Z]**: zvanična dokumentacija (Google, OpenAI, Anthropic, Perplexity)
- **[I]**: industrijske studije i blogovi, uzeti kao okvirni pravac
- **[P]**: naša preporuka

## 1. Lokalni katalog na Google-u

### Rizici
- **[Z] Doorway stranice.** Google eksplicitno navodi "stranice ciljane na gradove koje vode korisnika na istu stranicu" i skoro iste stranice. https://developers.google.com/search/docs/essentials/spam-policies
- **[Z] Scaled content abuse.** Masovno pravljene stranice za rangiranje, svejedno da li ih piše čovjek ili AI. Od 2026. politike važe i za AI Overviews i AI Mode.
- **[I] Posljedice.** Core update-ovi iz marta i maja 2026. i spam update iz avgusta 2026. oborili su programske šablone grad × usluga za 40–90%. Preživjele su stranice sa stvarnim, jedinstvenim podacima.

### Pravila za Tražim
- **[P] Indeksiranje.** Indeksiramo `/{usluga}-{grad}` samo kad postoji stvaran biznis; kasnije prag podižemo na ≥3.
- **[Z] Prazne kombinacije vraćaju 404**, nisu u sitemapu i ne linkujemo ih. To je preporuka Google-a za prazne facete. https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- **[P] Jedinstveni sadržaj po kombinaciji dolazi iz podataka:** broj profila, ocjene, raspon cijena u gradu, najnovije recenzije, susjedni gradovi, sezona na primorju. Ne pišemo tekst u kome se mijenja samo ime grada.

### Tehnička pravila
- **[Z] Paginacija.** Svaka strana ima svoj canonical i `<a href>` linkove. `rel=next/prev` se više ne koristi.
- **[Z] Filteri.** Blokirati ih u robots.txt ili ih voditi kroz fragment.
- **[Z] Core Web Vitals:** LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- **[Z] Svježina.** `lastmod` mora odražavati stvarne izmjene.

### Povjerenje i linkovi
- **[Z] E-E-A-T.** Objasniti "ko, kako, zašto": moderaciju, šta znači "Provjeren", pravila recenzija, kako računamo cijene, pravne podatke firme.
- **[Z] Google Business Profile.** Online katalog nema pravo na GBP bez kancelarije. Biznise treba podsticati da u svoj GBP stave link na svoj Tražim profil. https://support.google.com/business/answer/13762416
- **[I] Backlinkovi u maloj zemlji:**
  - data PR iz /cijene i /statistika (Vijesti, CdM, RTCG, Bankar.me)
  - značka za sajtove biznisa
  - privredna i zanatska komora, opštine
  - expat grupe i vodiči za preseljenje

## 2. Strukturirani podaci 2026

| Tip | Status | Napomena |
|---|---|---|
| LocalBusiness (podtip) | [Z] radi | `name` i `address`, preporučeno `geo`, `telephone`, `openingHoursSpecification`, `priceRange` |
| Review / AggregateRating | [Z] radi | Katalog koji prikazuje recenzije tuđih biznisa smije da ih označi. Ocjene moraju biti od korisnika i vidljive na stranici. **Ne uvoziti ocjene sa drugih sajtova.** Ne stavljati ocjenu Tražima na sopstvenu Organization. https://developers.google.com/search/docs/appearance/structured-data/review-snippet |
| FAQPage | [Z] **ugašeno** 7. 5. 2026 | Markup ne šteti. Sadržaj ostaje za korisnike i AI. |
| BreadcrumbList | [Z] radi | |
| ItemList carousel | [Z] beta samo EEA/TR/ZA | Crna Gora nije obuhvaćena. |
| Service / Offer | nema rich result | Korisno AI-ju za razumijevanje. Ne koristiti `Product` radi zvjezdica. |
| Dataset | [Z] Dataset Search | Za /cijene i /statistika: `temporalCoverage`, `spatialCoverage`, `license`, `distribution` (CSV). |
| Organization | [Z] radi | Logo ≥112 px, `sameAs`, kontakt. Samo na početnoj ili O nama. |
| speakable | [Z] samo US engleski | Preskočiti. |

## 3. Tehnika

### Sitemap [Z]
- Najviše 50.000 URL-ova ili 50 MB po fajlu. Za više se pravi indeks.
- Google ignoriše `priority` i `changefreq`.
- Ping endpoint je ugašen. Sitemap se prijavljuje u Search Console i navodi u `Sitemap:` liniji u robots.txt.
- Hreflang ide kroz `xhtml:link`.
- Za slike se koristi `image:loc`.

### hreflang [Z]
- ISO 639-1 kod, uz opcioni script i region.
- `sr-ME` i `sr-Latn-ME` su validni. `cnr` nije i Google ga ne prepoznaje.
- Linkovi moraju biti uzajamni, svaka verzija ima svoj canonical i treba `x-default`.

### IndexNow [Z]
- Koriste ga Bing, Yandex, Seznam i Naver. **Google ne.**
- Bing hrani Copilot i dijelom ChatGPT pretragu.

### AI botovi (robots.txt)
| Bot | Namjena | Izvor |
|---|---|---|
| `OAI-SearchBot` | ChatGPT pretraga | [Z] https://developers.openai.com/api/docs/bots |
| `GPTBot` | trening | [Z] |
| `ChatGPT-User` | dohvat za korisnika | [Z] |
| `PerplexityBot` | indeks, ne trening | [Z] https://docs.perplexity.ai/guides/bots |
| `Perplexity-User` | dohvat za korisnika | [Z] |
| `ClaudeBot` | trening | [Z] https://support.claude.com/en/articles/8896518 |
| `Claude-SearchBot` | pretraga | [Z] |
| `Claude-User` | dohvat za korisnika | [Z] |
| `Google-Extended` | Gemini trening i grounding; ne utiče na Search ni AI Overviews | [Z] |
| `CCBot` | Common Crawl | [Z] |

- **[Z] AI Overviews** kontrolišu Googlebot i `nosnippet`/`max-snippet`, a od 31. 8. 2026. i posebna opcija u Search Console.
- **[P]** Puštamo sve botove, i one za trening. Za mali brend je bitno da model zna za nas.

## 4. AI pretraga (GEO)
- **[Z] Google:** "nema dodatnih zahtjeva za AI Overviews i AI Mode".
  - llms.txt se ignoriše.
  - Ne treba sjeckati tekst, pisati za AI ni dodavati posebnu shemu.
  - Bitan je jedinstven sadržaj koji nije "roba sa police".
  - Model šalje više srodnih podupita (query fan-out), pa pobjeđuje ko pokriva cijelu temu: cijenu, kako izabrati, šta ulazi u posao.

  https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- **[I] GEO studija (KDD 2024):** statistike, citati i izvori podižu vidljivost u generisanim odgovorima do ~40%. https://arxiv.org/abs/2311.09735
- **[I] Pominjanja brenda:** korelacija sa AI Overviews je ~3× jača nego za backlinkove.
- **[I] Najcitiraniji izvori:** Reddit i Wikipedia. ChatGPT i Perplexity dijele samo ~11% citiranih domena.
- **[I] llms.txt:** 97% fajlova nije dobilo nijedan zahtjev (maj 2026). Vrijednost je skoro nula.
- **[P] Za Tražim:**
  - **Cijene su glavni adut.** Na vrhu rečenica-odgovor ("Prosječna cijena …, na osnovu N cjenovnika, ažurirano …"), zatim tabela, metodologija i datum, CSV i Dataset.
  - **Tekst o uslugama:** kako izabrati, šta utiče na cijenu, česta pitanja.
  - **Dosljedan entitet:** isti naziv, opis i logo, `sameAs`, kasnije Wikidata.
  - **Prisustvo van sajta:** r/montenegro, expat grupe, mediji.

## 5. Mjerenje
- **[Z] Search Console "Generative AI performance":** od 31. 8. 2026, prikazuje impresije bez klikova.
- **[Z] Bing Webmaster "AI Performance".**
- **[I] GA4:** sopstveni kanal ispred Referral, regex `chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai`.
- **[P] Server logovi:** brojati zahtjeve `*-User` botova.

## 6. Crna Gora
- **Tržište pretrage:** Google ima 96,5%, Bing 1,9%, Yandex 0,8%. Yandex se ne isplati.
- **Pismo:** latinica je dominantna. U pretrazi prihvatiti ćirilicu kroz transliteraciju. Posebna ćirilična verzija ima smisla tek ako Search Console pokaže takve upite.
- **Jezik:** jedna ME latinična verzija pokriva sr/cnr/bs/hr čitaoce. Ne označavati je kao `hr` ili `bs`.
- **Stranci:** oko 100.900 stranih rezidenata. Rusa je ~21k, Turaka ~13,5k, Ukrajinaca 9k+. Turski je kandidat za sljedeći jezik.
- **Primorje:** stranice su trajne. Prije sezone (mart–jun) osvježiti podatke i datume za renoviranje, čišćenje, klime i izmjenu gostiju u apartmanima.
