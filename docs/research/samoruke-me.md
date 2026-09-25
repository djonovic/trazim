# samoruke.me: analiza konkurenta (septembar 2026)

Izvori: sirovi HTML, JS bundle (`/assets/index-*.js`) i javni API (`admin.samoruke.me/api/public/*`), preuzeti curl-om 24. 9. 2026. WebFetch vraća samo naslove jer je sajt SPA. Lični podaci iz API-ja namjerno nisu prepisani ovdje.

## Model
- Profile objavljuju samo **majstori** (`contractor`) i **pomoćni radnici** (`helper`), besplatnom prijavom na `/prijava` ("profil objavljen u roku od 24h, bez provizije po poslu").
- Kupci **ne mogu objaviti posao**. Nema oglasa za poslove ni upita.
- Kontakt ide direktno: telefon, Viber, WhatsApp, SMS, Telegram, email ("BEZ POSREDNIKA. BEZ PROVIZIJE. DIREKTNO.").
- Postoji B2B forma "trebaju nam ekipe od 5–50+ radnika" (web3forms).
- **Zarada**, plaćanje po fakturi, dogovor preko emaila ili Vibera:

| Paket | Mjesečno | 3 mj. | 6 mj. | 12 mj. |
|---|---|---|---|---|
| "Preporuka u kategoriji", TOP 3 za struku u jednom gradu | 80 € | 240 € | 432 € | 800 € |
| Početna | 120 € | 360 € | 600 € | 1.000 € |
| Baner dobavljača iznad kategorije | ~300 € | | | 3.600 € |

  - Uz preporuku u kategoriji tvrde da "svi upiti idu direktno tebi, ostali profili nemaju ovu mogućnost".
  - Na banere postoje dodaci: animirani 240 €, interaktivni 720 €.
- **Jezici:** sr-ME, en, ru, sq, tr (albanski nazivi kategorija su prazni).
- **Aplikacije:** nema.

## Struktura
- **Rute:**
  - `/majstori/{struka}`
  - `/majstori/{struka}/{grad}`
  - `/majstor/{slug}` i `/majstor/{slug}/recenzija`
  - `/sve-struke`, `/kucni-majstori`, `/gradjevinci`, `/search?q=`
  - `/ponuda-majstori`, `/ponuda-b2b`, `/ponuda-ekskluzivni-partner`
  - `/kako-rangiramo`, `/prijava-sadrzaja`
  - pravne stranice
- **Samostalne stranice gradova nema.**
- **Obim:** oko 50 struka i 16 gradova.
- **Profili:** oko 593, od toga 447 majstora i 146 pomoćnih radnika.
- **Po gradovima:** Podgorica 381, Nikšić 46, Budva 40, Bar 37, Herceg Novi 23; svi ostali gradovi imaju 15 ili manje (Kotor 3, Ulcinj 4).

## Funkcije
- **Imaju:**
  - pretraga (struka + grad)
  - filteri: struka, grad, kućni ili građevinski radovi
  - na profilu: specijalnosti, jezici, kanali kontakta, veličina tima, PIB, oznake licenciran/osiguran/hitno
  - recenzije koje traže ime, telefon i **obaveznu fotografiju**, uz moderaciju
  - značka "Verifikovan", plaćene oznake "Preporuka/Istaknuto/Oglas"
  - dinamičke OG slike (`/api/og`)
  - GA4, Meta Pixel, Mixpanel
- **Nemaju:**
  - poruke, upite za ponudu, objavu posla, obavještenja
  - panel za majstore
  - cjenovnike, galerije
  - blog, vodiče, cijene
  - aplikaciju

## SEO
- **Vite/React SPA** (Lovable, Vercel). U HTML-u je samo `<head>`; `body` je prazan `<div id="root">`, bez H1, teksta i linkova.
- **Head po stranici je dobar:** naslov, opis, canonical, hreflang za 5 jezika + x-default.
  - Primjer naslova: "Pronađi vodoinstalatera u Podgorici | Samo Ruke".
- **JSON-LD:**
  - statično samo Organization (sa praznim `sameAs`) i WebSite sa SearchAction
  - BreadcrumbList, ItemList i LocalBusiness ubacuje tek JavaScript u browseru
- **Početna** nema meta description ni canonical. U head-u stoje TODO komentari, uključujući google-site-verification.
- **Sitemap:** 488 URL-ova, bez `lastmod`, 0 profila, samo sr.
- **robots.txt** pušta sve i eksplicitno AI botove. Imaju detaljan **llms.txt**.
- **Soft 404:** nepostojeće rute vraćaju 200 sa naslovom početne.
- **Sadržaj je tanak:** jedan šablonski pasus po kategoriji, nema bloga ni cijena.

## Slabosti
- **Javni API vraća telefon i email svih majstora.** To je rizik za GDPR i za povjerenje.
- **Slab društveni dokaz:** 0/593 profila ima fotografiju, samo 11 profila ima recenzije (19 ukupno). Godine iskustva, projekti i "cijena od" su 0 kod svih.
- **Plaćanje za rang:** poruka "upiti idu samo plaćenima" ruši priču o besplatnom katalogu.
- **Greške u podacima i jeziku:**
  - padeži u naslovima: "Moler u Podgorica", ruski "в Будва", "Pronađi monter / Montažera"
  - ime ≠ slug
  - broj u naslovu ≠ stvarni broj
  - pokvaren link u llms.txt
  - 120 profila bez glavne kategorije
  - istekla "early bird" akcija još stoji
- **Slaba pokrivenost** van Podgorice, posebno na primorju.
- **Performanse i pristupačnost:** JS bundle 1,65 MB, a `user-scalable=no` blokira zumiranje.

## Snage koje moramo imati
- **Čista matrica struka × grad** sa brojem profila u naslovu.
- **5 jezika** (tr i sq su bitni za strance na primorju). Odluka: za sada ostajemo na sr/en/ru.
- **Viber i WhatsApp kontakt**, jezici na profilu.
- **Dinamičke OG slike**, robots.txt otvoren za AI botove.
- **Stranice o rangiranju** (EU 2019/1150) i o prijavi sadržaja (DSA).
- **Segment pomoćnih radnika** i B2B forma za ekipe.

## Ko se rangira (približno, pretraga nije sa Google.me)
| Upit | Top rezultati |
|---|---|
| vodoinstalater podgorica | FB stranica, vodoinstalaterpodgorica.org, kucnimajstorpodgorica.com, mojbiznis.me, biznissajt.me |
| električar budva | planplus.rs, elektricar24.me, elektricari.me, majstori.co, brzimajstor.me |
| majstor nikšić | majstori.co.me, brzimajstor.me |
| moler podgorica | Instagram/FB moleri, molerpodgorica.me, moleri.me |
| keramičar bar | FB stranice, mojbiznis.me, nphome.me, doradnika.me |

Drugi konkurenti:
- brzimajstor.me: kupac objavi zahtjev, majstori odgovaraju
- meshtar.me, mojmajstor.me, doradnika.me, majstori.co

## Gdje smo mi bolji / šta radimo
- **SSR/ISR:** sav sadržaj je u HTML-u, a prazne kombinacije vraćaju pravi 404.
- **Sitemap** sa profilima, svim jezicima i `lastmod`.
- **Profili** sa slikama, cjenovnikom, radnim vremenom, recenzijama i odgovorom vlasnika.
- **Cijene i statistika** iz stvarnih cjenovnika. To je glavni izvor za AI odgovore.
- **Kontakti otkriveni tek na klik** (zaštita od scrapera).
- **"Pošalji upit":** upit ide svima koji nude uslugu, ne samo plaćenima.
- **Recenzije sa fotografijom kao opcija**, ne obaveza.
- **Transparentni paketi za biznise** i stranica "Kako rangiramo".
- **Značka "Preporučeno na Tražim"** za sajtove biznisa.
