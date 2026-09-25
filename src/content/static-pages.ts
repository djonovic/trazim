import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

export type Block = {
  h?: string;
  p?: string[];
  list?: string[];
  faq?: { q: string; a: string }[];
};

export type PageContent = {
  title: string;
  description: string;
  lead?: string;
  blocks: Block[];
};

export type StaticSlug =
  | "kako-funkcionise"
  | "pomoc"
  | "bezbjednost"
  | "o-nama"
  | "kontakt"
  | "za-biznise"
  | "kako-rangiramo"
  | "uslovi"
  | "privatnost"
  | "kolacici";

export const LEGAL_SLUGS: StaticSlug[] = ["uslovi", "privatnost", "kolacici"];

const email = SITE.email;
const operator = SITE.company ?? "Tražim";
const address = SITE.companyAddress;

export const staticPages: Record<StaticSlug, Record<Locale, PageContent>> = {
  "kako-funkcionise": {
    "sr-Latn-ME": {
      title: "Kako funkcioniše Tražim",
      description:
        "Pronađi uslugu, uporedi profile i kontaktiraj biznis direktno. Za biznise: besplatan profil za 2 minuta.",
      lead: "Tražim je katalog lokalnih usluga u Crnoj Gori. Povezujemo ljude kojima nešto treba sa majstorima, nastavnicima, salonima i drugim biznisima u njihovom gradu.",
      blocks: [
        {
          h: "Za korisnike",
          list: [
            "Pretraži: izaberi uslugu i grad, npr. vodoinstalater u Podgorici.",
            "Pregledaj profile: ocjene, recenzije, cjenovnike, slike i radno vrijeme.",
            "Kontaktiraj: pozovi ili piši na Viber i WhatsApp direktno, bez registracije.",
            "Dogovori se: cijenu, termin i način plaćanja dogovaraš direktno sa biznisom.",
            "Ostavi recenziju: pomozi drugima da izaberu.",
          ],
        },
        {
          h: "Za biznise",
          list: [
            "Registruj se besplatno na webu, bez aplikacije.",
            "Izaberi usluge i gradove u kojima radiš, dodaj kontakt, slike i cjenovnik.",
            "Profil je vidljiv odmah, a naš tim ga pregleda u roku od 24 sata.",
            "Mušterije te zovu ili pišu direktno. Mi ne uzimamo proviziju.",
            "Gradi reputaciju kroz recenzije i odgovaraj na njih javno.",
          ],
        },
        {
          h: "Važno da znaš",
          p: [
            "Tražim je oglasnik: ne izvodimo radove i nismo strana u dogovoru između tebe i biznisa.",
            "Plaćanje je direktno biznisu. Tražim ne naplaćuje ništa korisnicima.",
            "Oznaka „Provjeren“ znači da smo provjerili da broj telefona pripada biznisu. Ne garantujemo kvalitet rada, zato čitaj recenzije i traži ponudu unaprijed.",
          ],
        },
      ],
    },
    en: {
      title: "How Tražim works",
      description:
        "Find a service, compare profiles and contact the business directly. For businesses: a free profile in 2 minutes.",
      lead: "Tražim is a directory of local services in Montenegro. We connect people who need something done with tradespeople, tutors, salons and other businesses in their town.",
      blocks: [
        {
          h: "For customers",
          list: [
            "Search: pick a service and a town, e.g. a plumber in Podgorica.",
            "Browse profiles: ratings, reviews, price lists, photos and opening hours.",
            "Get in touch: call or message on Viber and WhatsApp directly, no sign-up.",
            "Agree the details: price, time and payment are agreed directly with the business.",
            "Leave a review: help others choose.",
          ],
        },
        {
          h: "For businesses",
          list: [
            "Sign up for free on the web, no app needed.",
            "Choose your services and the towns you work in, and add contact details, photos and prices.",
            "Your profile goes live right away and our team reviews it within 24 hours.",
            "Customers call or message you directly. We take no commission.",
            "Build your reputation with reviews and reply to them publicly.",
          ],
        },
        {
          h: "Good to know",
          p: [
            "Tražim is a directory: we don't carry out the work and we're not a party to your agreement with the business.",
            "You pay the business directly. Tražim is free for customers.",
            "“Verified” means we checked that the phone number belongs to the business. We can't guarantee the quality of the work, so read reviews and ask for a quote up front.",
          ],
        },
      ],
    },
    ru: {
      title: "Как работает Tražim",
      description:
        "Найдите услугу, сравните профили и свяжитесь с исполнителем напрямую. Для бизнеса: бесплатный профиль за 2 минуты.",
      lead: "Tražim — каталог местных услуг в Черногории. Мы помогаем найти мастеров, репетиторов, салоны и другие бизнесы в вашем городе.",
      blocks: [
        {
          h: "Клиентам",
          list: [
            "Найдите: выберите услугу и город, например сантехник в Подгорице.",
            "Сравните профили: оценки, отзывы, прайс-листы, фото и часы работы.",
            "Свяжитесь: позвоните или напишите в Viber и WhatsApp напрямую, без регистрации.",
            "Договоритесь: цену, время и оплату вы согласуете с исполнителем напрямую.",
            "Оставьте отзыв: помогите другим с выбором.",
          ],
        },
        {
          h: "Бизнесу",
          list: [
            "Зарегистрируйтесь бесплатно на сайте, без приложения.",
            "Выберите услуги и города, добавьте контакты, фото и прайс-лист.",
            "Профиль появляется сразу, наша команда проверяет его в течение 24 часов.",
            "Клиенты звонят и пишут вам напрямую. Мы не берём комиссию.",
            "Собирайте отзывы и публично отвечайте на них.",
          ],
        },
        {
          h: "Важно знать",
          p: [
            "Tražim — площадка объявлений: мы не выполняем работы и не являемся стороной договора между вами и исполнителем.",
            "Оплата производится напрямую исполнителю. Для клиентов Tražim бесплатен.",
            "Отметка «Проверен» означает, что мы проверили, что номер телефона принадлежит бизнесу. Качество работ мы не гарантируем, поэтому читайте отзывы и уточняйте цену заранее.",
          ],
        },
      ],
    },
  },

  pomoc: {
    "sr-Latn-ME": {
      title: "Centar za pomoć",
      description:
        "Odgovori na najčešća pitanja korisnika i biznisa na Tražim.",
      blocks: [
        {
          h: "Za korisnike",
          faq: [
            {
              q: "Da li moram da se registrujem?",
              a: "Ne. Pretraga i kontakt ne traže nalog. Nalog ti treba samo da ostaviš recenziju.",
            },
            {
              q: "Kako da vidim broj telefona?",
              a: "Na profilu klikni „Pozovi“. Broj prikazujemo na klik da ga zaštitimo od automatskog prikupljanja.",
            },
            {
              q: "Šta znači „Provjeren“?",
              a: "Provjerili smo da broj telefona pripada biznisu. To nije garancija kvaliteta rada.",
            },
            {
              q: "Šta znači „Na provjeri“?",
              a: "Profil je nov i naš tim ga još nije pregledao. To obično traje do 24 sata.",
            },
            {
              q: "Kako da prijavim problem sa biznisom ili recenzijom?",
              a: `Klikni „Prijavi problem“ na profilu ili nam piši na ${email}.`,
            },
          ],
        },
        {
          h: "Za biznise",
          faq: [
            {
              q: "Koliko košta profil?",
              a: "Osnovni profil je besplatan: kontakt, slike, cjenovnik, radno vrijeme i recenzije.",
            },
            {
              q: "Kako da se pojavim na vrhu liste?",
              a: "Redosljed zavisi od ocjena, broja recenzija, provjere i aktivnosti. Sponzorisane pozicije su uvijek jasno označene i odvojene od ostalih rezultata.",
            },
            {
              q: "Mogu li da obrišem lošu recenziju?",
              a: "Ne, ali možeš javno da odgovoriš. Recenzije koje krše pravila (uvrede, lažne informacije, spam) uklanjamo nakon prijave.",
            },
            {
              q: "Kako da dobijem oznaku „Provjeren“?",
              a: `Piši nam na ${email} sa nazivom biznisa. Pozvaćemo broj sa profila da potvrdimo da je tvoj. Provjera je besplatna.`,
            },
          ],
        },
      ],
    },
    en: {
      title: "Help centre",
      description:
        "Answers to the most common questions from customers and businesses on Tražim.",
      blocks: [
        {
          h: "For customers",
          faq: [
            {
              q: "Do I need an account?",
              a: "No. Searching and contacting businesses doesn't need an account. You only need one to leave a review.",
            },
            {
              q: "How do I see the phone number?",
              a: "Tap “Call” on the profile. We show numbers on click to protect them from scrapers.",
            },
            {
              q: "What does “Verified” mean?",
              a: "We checked that the phone number belongs to the business. It isn't a guarantee of the quality of the work.",
            },
            {
              q: "What does “Under review” mean?",
              a: "The profile is new and our team hasn't reviewed it yet. This usually takes up to 24 hours.",
            },
            {
              q: "How do I report a business or a review?",
              a: `Tap “Report a problem” on the profile or email us at ${email}.`,
            },
          ],
        },
        {
          h: "For businesses",
          faq: [
            {
              q: "How much does a profile cost?",
              a: "The basic profile is free: contact details, photos, price list, opening hours and reviews.",
            },
            {
              q: "How do I get to the top of the list?",
              a: "The order depends on ratings, number of reviews, verification and activity. Sponsored placements are always clearly labelled and kept apart from the other results.",
            },
            {
              q: "Can I delete a bad review?",
              a: "No, but you can reply publicly. We remove reviews that break the rules (abuse, false information, spam) after a report.",
            },
            {
              q: "How do I get “Verified”?",
              a: `Email ${email} with your business name. We'll call the number on your profile to confirm it's yours. Verification is free.`,
            },
          ],
        },
      ],
    },
    ru: {
      title: "Центр помощи",
      description: "Ответы на частые вопросы клиентов и бизнесов на Tražim.",
      blocks: [
        {
          h: "Клиентам",
          faq: [
            {
              q: "Нужна ли регистрация?",
              a: "Нет. Поиск и контакт не требуют аккаунта. Он нужен только для отзыва.",
            },
            {
              q: "Как увидеть номер телефона?",
              a: "Нажмите «Позвонить» в профиле. Мы показываем номер по клику, чтобы защитить его от сбора ботами.",
            },
            {
              q: "Что значит «Проверен»?",
              a: "Мы проверили, что номер телефона принадлежит бизнесу. Это не гарантия качества работ.",
            },
            {
              q: "Что значит «На проверке»?",
              a: "Профиль новый, и наша команда ещё не проверила его. Обычно это занимает до 24 часов.",
            },
            {
              q: "Как пожаловаться на бизнес или отзыв?",
              a: `Нажмите «Сообщить о проблеме» в профиле или напишите нам на ${email}.`,
            },
          ],
        },
        {
          h: "Бизнесу",
          faq: [
            {
              q: "Сколько стоит профиль?",
              a: "Базовый профиль бесплатный: контакты, фото, прайс-лист, часы работы и отзывы.",
            },
            {
              q: "Как попасть в начало списка?",
              a: "Порядок зависит от оценок, количества отзывов, проверки и активности. Рекламные места всегда чётко помечены и отделены от остальных результатов.",
            },
            {
              q: "Можно ли удалить плохой отзыв?",
              a: "Нет, но вы можете ответить публично. Отзывы, нарушающие правила (оскорбления, ложная информация, спам), удаляем после жалобы.",
            },
            {
              q: "Как получить отметку «Проверен»?",
              a: `Напишите на ${email} и укажите название бизнеса. Мы позвоним по номеру из профиля, чтобы подтвердить, что он ваш. Проверка бесплатная.`,
            },
          ],
        },
      ],
    },
  },

  bezbjednost: {
    "sr-Latn-ME": {
      title: "Bezbjednost",
      description:
        "Savjeti kako da bezbjedno izabereš majstora ili uslugu i kako da prijaviš problem.",
      blocks: [
        {
          h: "Prije nego što se dogovoriš",
          list: [
            "Pročitaj recenzije i pogledaj da li je biznis „Provjeren“.",
            "Traži ponudu ili procjenu unaprijed, po mogućnosti pisano (poruka na Viberu je dovoljna).",
            "Dogovori cijenu materijala i rada odvojeno.",
            "Ne plaćaj cijeli iznos unaprijed. Za veće poslove dogovori plaćanje u fazama.",
            "Za registrovane firme traži fiskalni račun.",
          ],
        },
        {
          h: "Znakovi upozorenja",
          list: [
            "Traži se cijeli iznos unaprijed ili uplata na tuđi račun.",
            "Cijena je mnogo niža od prosjeka na stranici „Cijene“.",
            "Pritisak da odlučiš odmah.",
            "Odbijanje da se dogovor potvrdi porukom.",
          ],
        },
        {
          h: "Prijavi problem",
          p: [
            `Ako primijetiš lažan profil, prevaru ili neprikladnu recenziju, klikni „Prijavi problem“ ili piši na ${email}. U hitnim slučajevima pozovi policiju na 122.`,
          ],
        },
      ],
    },
    en: {
      title: "Safety",
      description:
        "Tips for choosing a tradesperson or service safely, and how to report a problem.",
      blocks: [
        {
          h: "Before you agree",
          list: [
            "Read reviews and check whether the business is “Verified”.",
            "Ask for a quote up front, ideally in writing (a Viber message is fine).",
            "Agree the cost of materials and labour separately.",
            "Don't pay everything in advance. For bigger jobs, pay in stages.",
            "Ask registered companies for a fiscal receipt.",
          ],
        },
        {
          h: "Warning signs",
          list: [
            "Full payment up front, or payment to someone else's account.",
            "A price far below the average on the “Prices” page.",
            "Pressure to decide right away.",
            "Refusing to confirm the agreement in a message.",
          ],
        },
        {
          h: "Report a problem",
          p: [
            `If you notice a fake profile, a scam or an inappropriate review, tap “Report a problem” or email ${email}. In an emergency, call the police on 122.`,
          ],
        },
      ],
    },
    ru: {
      title: "Безопасность",
      description:
        "Советы, как безопасно выбрать мастера или услугу и как сообщить о проблеме.",
      blocks: [
        {
          h: "Перед тем как договориться",
          list: [
            "Читайте отзывы и проверьте, есть ли у бизнеса отметка «Проверен».",
            "Попросите смету заранее, лучше письменно (сообщения в Viber достаточно).",
            "Отдельно согласуйте стоимость материалов и работы.",
            "Не платите всю сумму вперёд. Для крупных работ платите поэтапно.",
            "У зарегистрированных компаний просите фискальный чек.",
          ],
        },
        {
          h: "Тревожные признаки",
          list: [
            "Требуют всю сумму вперёд или перевод на чужой счёт.",
            "Цена намного ниже средней на странице «Цены».",
            "Давление с просьбой решить немедленно.",
            "Отказ подтвердить договорённость сообщением.",
          ],
        },
        {
          h: "Сообщить о проблеме",
          p: [
            `Если вы заметили фальшивый профиль, мошенничество или неуместный отзыв, нажмите «Сообщить о проблеме» или напишите на ${email}. В экстренных случаях звоните в полицию: 122.`,
          ],
        },
      ],
    },
  },

  "o-nama": {
    "sr-Latn-ME": {
      title: "O nama",
      description:
        "Tražim pravimo da se u Crnoj Gori lakše pronađe dobar majstor, nastavnik ili salon.",
      lead: "Dobar majstor se u Crnoj Gori i dalje najčešće traži preko preporuka i Facebook grupa. Tražim pravimo da to bude jednostavnije: sve usluge, u svim gradovima, na jednom mjestu.",
      blocks: [
        {
          h: "Misija",
          p: [
            "Da svako za par minuta pronađe provjerenu uslugu u svom gradu, i da svaki dobar majstor i mali biznis dođe do novih mušterija bez posrednika i provizije.",
          ],
        },
        {
          h: "Vrijednosti",
          list: [
            "Transparentnost: javne cijene i jasno označeni sponzorisani oglasi.",
            "Povjerenje: provjera biznisa i recenzije koje vlasnik ne može obrisati.",
            "Jednostavnost: kontakt bez registracije, profil za biznis za 2 minuta.",
            "Lokalno: napravljeno za Crnu Goru, na crnogorskom, engleskom i ruskom.",
          ],
        },
      ],
    },
    en: {
      title: "About us",
      description:
        "We're building Tražim to make it easier to find a good tradesperson, tutor or salon in Montenegro.",
      lead: "In Montenegro, people still mostly find a good tradesperson through word of mouth and Facebook groups. We're building Tražim to make that simpler: every service, in every town, in one place.",
      blocks: [
        {
          h: "Mission",
          p: [
            "Help anyone find a trusted service in their town in minutes, and help every good tradesperson and small business reach new customers without middlemen or commission.",
          ],
        },
        {
          h: "Values",
          list: [
            "Transparency: public prices and clearly labelled sponsored listings.",
            "Trust: business verification and reviews the owner can't delete.",
            "Simplicity: contact without an account, a business profile in 2 minutes.",
            "Local: made for Montenegro, in Montenegrin, English and Russian.",
          ],
        },
      ],
    },
    ru: {
      title: "О нас",
      description:
        "Мы создаём Tražim, чтобы в Черногории было проще найти хорошего мастера, репетитора или салон.",
      lead: "В Черногории хорошего мастера до сих пор ищут в основном по рекомендациям и в группах Facebook. Мы делаем Tražim, чтобы это стало проще: все услуги во всех городах в одном месте.",
      blocks: [
        {
          h: "Миссия",
          p: [
            "Чтобы каждый за пару минут находил проверенную услугу в своём городе, а каждый хороший мастер и малый бизнес находил новых клиентов без посредников и комиссий.",
          ],
        },
        {
          h: "Ценности",
          list: [
            "Прозрачность: открытые цены и чётко помеченная реклама.",
            "Доверие: проверка бизнеса и отзывы, которые владелец не может удалить.",
            "Простота: контакт без регистрации, профиль бизнеса за 2 минуты.",
            "Местный сервис: сделан для Черногории, на черногорском, английском и русском.",
          ],
        },
      ],
    },
  },

  kontakt: {
    "sr-Latn-ME": {
      title: "Kontakt",
      description:
        "Piši nam za pitanja, prijave i saradnju. Odgovaramo u roku od 24 sata radnim danima.",
      blocks: [
        {
          p: [
            `Email: ${email}`,
            ...(address ? [address] : []),
            "Odgovaramo u roku od 24 sata radnim danima.",
          ],
        },
        {
          h: "Za biznise",
          p: [
            "Pitanja o profilu, provjeri ili sponzorisanim pozicijama pošalji na isti email, uz naziv svog biznisa.",
          ],
        },
      ],
    },
    en: {
      title: "Contact",
      description:
        "Email us with questions, reports or partnership ideas. We reply within 24 hours on working days.",
      blocks: [
        {
          p: [
            `Email: ${email}`,
            ...(address ? [address] : []),
            "We reply within 24 hours on working days.",
          ],
        },
        {
          h: "For businesses",
          p: [
            "Questions about your profile, verification or sponsored placements go to the same address; please include your business name.",
          ],
        },
      ],
    },
    ru: {
      title: "Контакты",
      description:
        "Пишите нам с вопросами, жалобами и предложениями о сотрудничестве. Отвечаем в течение 24 часов в рабочие дни.",
      blocks: [
        {
          p: [
            `Email: ${email}`,
            ...(address ? [address] : []),
            "Отвечаем в течение 24 часов в рабочие дни.",
          ],
        },
        {
          h: "Бизнесу",
          p: [
            "Вопросы о профиле, проверке или рекламе отправляйте на тот же адрес, указав название вашего бизнеса.",
          ],
        },
      ],
    },
  },

  "za-biznise": {
    "sr-Latn-ME": {
      title: "Privuci nove mušterije",
      description:
        "Napravi besplatan poslovni profil na Tražim za 2 minuta. Mušterije te zovu i pišu direktno, bez provizije.",
      lead: "Napravi besplatan poslovni profil za 2 minuta, na webu, bez aplikacije. Mušterije iz tvog grada te pronalaze i kontaktiraju direktno.",
      blocks: [
        {
          h: "Šta dobijaš",
          list: [
            "Besplatan profil: kontakt, Viber i WhatsApp, slike, cjenovnik, radno vrijeme i zona rada.",
            "Mušterije te kontaktiraju direktno. Bez provizije i bez plaćanja po upitu.",
            "Recenzije koje grade povjerenje, uz mogućnost javnog odgovora.",
            "Statistika: koliko ljudi je pogledalo profil i kliknulo na kontakt.",
            "Oznaka „Provjeren“ nakon besplatne provjere broja telefona.",
          ],
        },
        {
          h: "Kako da počneš",
          list: [
            "Izaberi usluge koje nudiš (do 3 glavne).",
            "Izaberi gradove u kojima radiš.",
            "Dodaj kontakt i nekoliko slika svog rada.",
          ],
        },
        {
          h: "Upiti idu svima, ne samo plaćenima",
          p: [
            "Kad korisnik pošalje upit za posao, dobijaju ga svi biznisi koji nude tu uslugu u tom gradu. Besplatan profil nije profil drugog reda.",
          ],
        },
      ],
    },
    en: {
      title: "Reach new customers",
      description:
        "Create a free business profile on Tražim in 2 minutes. Customers call and message you directly, no commission.",
      lead: "Create a free business profile in 2 minutes, on the web, no app needed. Customers in your town find you and contact you directly.",
      blocks: [
        {
          h: "What you get",
          list: [
            "A free profile: contact details, Viber and WhatsApp, photos, price list, opening hours and service area.",
            "Customers contact you directly. No commission and no pay-per-lead.",
            "Reviews that build trust, with public replies.",
            "Statistics: how many people viewed your profile and tapped to contact you.",
            "A “Verified” badge after a free phone number check.",
          ],
        },
        {
          h: "How to start",
          list: [
            "Choose the services you offer (up to 3 main ones).",
            "Choose the towns you work in.",
            "Add your contact details and a few photos of your work.",
          ],
        },
        {
          h: "Requests go to everyone, not just paying businesses",
          p: [
            "When someone sends a job request, every business offering that service in that town gets it. A free profile isn't a second-class profile.",
          ],
        },
      ],
    },
    ru: {
      title: "Находите новых клиентов",
      description:
        "Создайте бесплатный профиль бизнеса на Tražim за 2 минуты. Клиенты звонят и пишут напрямую, без комиссий.",
      lead: "Создайте бесплатный профиль за 2 минуты на сайте, без приложения. Клиенты из вашего города находят вас и связываются напрямую.",
      blocks: [
        {
          h: "Что вы получаете",
          list: [
            "Бесплатный профиль: контакты, Viber и WhatsApp, фото, прайс-лист, часы работы и зона работы.",
            "Клиенты связываются с вами напрямую. Без комиссий и оплаты за заявки.",
            "Отзывы, которые вызывают доверие, с возможностью публичного ответа.",
            "Статистика: сколько людей посмотрели профиль и нажали на контакт.",
            "Отметка «Проверен» после бесплатной проверки номера телефона.",
          ],
        },
        {
          h: "Как начать",
          list: [
            "Выберите услуги (до 3 основных).",
            "Выберите города, в которых работаете.",
            "Добавьте контакты и несколько фото работ.",
          ],
        },
        {
          h: "Заявки получают все, а не только платные",
          p: [
            "Когда клиент отправляет заявку на работу, её получают все компании, которые оказывают эту услугу в этом городе. Бесплатный профиль — не профиль второго сорта.",
          ],
        },
      ],
    },
  },

  "kako-rangiramo": {
    "sr-Latn-ME": {
      title: "Kako rangiramo i provjeravamo profile",
      description:
        "Kako Tražim određuje redoslijed rezultata, šta znače oznake Sponzorisano i Provjeren, pravila recenzija i kako računamo cijene.",
      lead: "Želimo da najbolji biznis za tvoj posao bude lako pronaći. Zato javno objašnjavamo po čemu slažemo rezultate i šta se može, a šta ne može platiti.",
      blocks: [
        {
          h: "Redoslijed rezultata („Preporučeno“)",
          list: [
            "Profili sa oznakom „Provjeren“ imaju prednost.",
            "Ocjena korisnika, ponderisana brojem recenzija: profil sa jednom peticom ne pretiče profil sa 30 recenzija i prosjekom 4,8.",
            "Aktivnost profila, odnosno koliko ga ljudi pregleda.",
            "Redoslijed možeš promijeniti na „Najbolje ocijenjeni“ ili „Najviše recenzija“, i filtrirati po ocjeni, radnom vremenu, online radu i hitnim intervencijama.",
            "Za ove kriterijume se ne plaća: sponzorstvo ne mijenja ocjenu ni mjesto u listi rezultata.",
          ],
        },
        {
          h: "Sponzorisana mjesta",
          p: [
            "Biznisi mogu zakupiti poziciju u bloku „Sponzorisano“ iznad rezultata, na početnoj ili na stranici usluge i grada. Takvo mjesto je uvijek jasno označeno i odvojeno od ostalih rezultata. Cijene su javne na stranici Za biznise.",
          ],
        },
        {
          h: "Šta znači „Provjeren“",
          p: [
            "Provjerili smo da broj telefona pripada biznisu. Oznaka ne garantuje kvalitet rada; za to služe recenzije.",
          ],
        },
        {
          h: "Novi profili („Na provjeri“)",
          p: [
            "Novi profil je vidljiv odmah, a naš tim ga pregleda u roku od 24 sata. Dok ga ne pregledamo, profil nije u Google pretrazi.",
          ],
        },
        {
          h: "Pravila recenzija",
          list: [
            "Recenziju ostavlja prijavljen korisnik, jednu po biznisu, i može je kasnije izmijeniti.",
            "Vlasnik ne može ocijeniti svoj biznis niti obrisati tuđu recenziju, ali može javno odgovoriti.",
            "Ne prodajemo, ne kupujemo i ne uvozimo recenzije sa drugih sajtova.",
            "Uklanjamo uvrede, reklame, lične podatke i recenzije koje nisu zasnovane na stvarnom iskustvu.",
            "Svako može prijaviti recenziju ili profil dugmetom „Prijavi“; odgovaramo u roku od 48 sati.",
          ],
        },
        {
          h: "Kako računamo cijene",
          p: [
            "Cijene na stranicama Cijene i Statistika računamo iz cjenovnika koje biznisi sami unose: fiksne cijene, cijene „od“ i raspone (za raspon uzimamo sredinu). Stavke „po dogovoru“ ne ulaze u prosjek. Uz svaku cijenu piše na osnovu koliko biznisa je izračunata i kada je ažurirana.",
          ],
        },
        {
          h: "Pravni osnov",
          p: [
            `U skladu sa Uredbom (EU) 2019/1150 o pravičnosti za poslovne korisnike i Aktom o digitalnim uslugama objavljujemo glavne parametre rangiranja i način prijave nezakonitog sadržaja. Pitanja i prigovori: ${email}.`,
          ],
        },
      ],
    },
    en: {
      title: "How we rank and verify profiles",
      description:
        "How Tražim orders results, what the Sponsored and Verified labels mean, review rules and how we calculate prices.",
      lead: "We want the best business for your job to be easy to find. That's why we publicly explain how results are ordered and what can and can't be paid for.",
      blocks: [
        {
          h: "Result order (“Recommended”)",
          list: [
            "Profiles with the “Verified” label come first.",
            "User rating, weighted by the number of reviews: a profile with a single 5-star review doesn't outrank one with 30 reviews averaging 4.8.",
            "Profile activity, i.e. how many people view it.",
            "You can switch to “Top rated” or “Most reviews” and filter by rating, opening hours, online work and emergency call-outs.",
            "None of this can be bought: sponsorship doesn't change a rating or a position in the results list.",
          ],
        },
        {
          h: "Sponsored placements",
          p: [
            "Businesses can rent a spot in the “Sponsored” block above the results, on the home page or on a service and town page. Such spots are always clearly labeled and kept separate from the other results. Prices are public on the For business page.",
          ],
        },
        {
          h: "What “Verified” means",
          p: [
            "We checked that the phone number belongs to the business. The label doesn't guarantee the quality of the work; that's what reviews are for.",
          ],
        },
        {
          h: "New profiles (“Under review”)",
          p: [
            "A new profile is visible right away and our team reviews it within 24 hours. Until then it isn't shown in Google search.",
          ],
        },
        {
          h: "Review rules",
          list: [
            "Reviews are written by signed-in users, one per business, and can be edited later.",
            "Owners can't rate their own business or delete someone else's review, but they can reply publicly.",
            "We don't sell, buy or import reviews from other websites.",
            "We remove insults, ads, personal data and reviews not based on a real experience.",
            "Anyone can report a review or profile with the “Report” button; we respond within 48 hours.",
          ],
        },
        {
          h: "How we calculate prices",
          p: [
            "Prices on the Prices and Statistics pages come from the price lists businesses enter themselves: fixed prices, “from” prices and ranges (for a range we take the midpoint). “On request” items are left out. Each price shows how many businesses it's based on and when it was updated.",
          ],
        },
        {
          h: "Legal basis",
          p: [
            `In line with Regulation (EU) 2019/1150 on fairness for business users and the Digital Services Act, we publish the main ranking parameters and how to report illegal content. Questions and complaints: ${email}.`,
          ],
        },
      ],
    },
    ru: {
      title: "Как мы ранжируем и проверяем профили",
      description:
        "Как Tražim определяет порядок результатов, что значат отметки «Реклама» и «Проверен», правила отзывов и как мы считаем цены.",
      lead: "Мы хотим, чтобы лучшую компанию для вашей задачи было легко найти. Поэтому открыто объясняем, как упорядочены результаты и за что можно и нельзя заплатить.",
      blocks: [
        {
          h: "Порядок результатов («Рекомендуемые»)",
          list: [
            "Профили с отметкой «Проверен» идут первыми.",
            "Оценка пользователей с учётом количества отзывов: профиль с одной пятёркой не обгоняет профиль с 30 отзывами и средней оценкой 4,8.",
            "Активность профиля, то есть сколько людей его просматривают.",
            "Можно выбрать сортировку «Лучшие оценки» или «Больше всего отзывов» и фильтровать по оценке, часам работы, онлайн-работе и срочным вызовам.",
            "За это нельзя заплатить: реклама не меняет оценку и место в списке результатов.",
          ],
        },
        {
          h: "Рекламные места",
          p: [
            "Компании могут арендовать место в блоке «Реклама» над результатами, на главной или на странице услуги и города. Такое место всегда чётко отмечено и отделено от остальных результатов. Цены опубликованы на странице «Для бизнеса».",
          ],
        },
        {
          h: "Что значит «Проверен»",
          p: [
            "Мы проверили, что номер телефона принадлежит бизнесу. Отметка не гарантирует качество работы; для этого есть отзывы.",
          ],
        },
        {
          h: "Новые профили («На проверке»)",
          p: [
            "Новый профиль виден сразу, а наша команда проверяет его в течение 24 часов. До проверки профиль не показывается в поиске Google.",
          ],
        },
        {
          h: "Правила отзывов",
          list: [
            "Отзыв оставляет вошедший пользователь, один на компанию, и может позже его изменить.",
            "Владелец не может оценить свою компанию или удалить чужой отзыв, но может публично ответить.",
            "Мы не продаём, не покупаем и не импортируем отзывы с других сайтов.",
            "Мы удаляем оскорбления, рекламу, личные данные и отзывы, не основанные на реальном опыте.",
            "Любой может пожаловаться на отзыв или профиль кнопкой «Пожаловаться»; мы отвечаем в течение 48 часов.",
          ],
        },
        {
          h: "Как мы считаем цены",
          p: [
            "Цены на страницах «Цены» и «Статистика» рассчитываются по прайс-листам, которые компании заполняют сами: фиксированные цены, цены «от» и диапазоны (для диапазона берём середину). Позиции «по договорённости» не учитываются. У каждой цены указано, по скольким компаниям она рассчитана и когда обновлена.",
          ],
        },
        {
          h: "Правовая основа",
          p: [
            `В соответствии с Регламентом (ЕС) 2019/1150 о справедливости для бизнес-пользователей и Законом о цифровых услугах мы публикуем основные параметры ранжирования и порядок подачи жалоб на незаконный контент. Вопросы и жалобы: ${email}.`,
          ],
        },
      ],
    },
  },

  uslovi: {
    "sr-Latn-ME": {
      title: "Uslovi korišćenja",
      description: "Uslovi korišćenja platforme Tražim.",
      blocks: [
        {
          h: "1. O platformi",
          p: [
            `Tražim (trazim.me) je internet katalog lokalnih usluga kojim upravlja ${operator}. Tražim nije izvođač usluga i nije strana u dogovorima između korisnika i biznisa.`,
          ],
        },
        {
          h: "2. Korisnici",
          p: [
            "Pretraga i pregled profila su besplatni. Za ostavljanje recenzija potreban je nalog. Korisnik je odgovoran za tačnost podataka koje unosi.",
          ],
        },
        {
          h: "3. Biznisi",
          p: [
            "Biznis garantuje da su podaci na profilu tačni i da ima pravo da obavlja navedene usluge. Zabranjeni su lažni profili, obmanjujuće cijene, prodaja gotovih proizvoda (MLM) i sadržaj koji krši zakon.",
          ],
        },
        {
          h: "4. Recenzije",
          p: [
            "Recenzija mora opisivati stvarno iskustvo. Uklanjamo uvredljive, lažne i spam recenzije. Neslaganje sa ocjenom nije razlog za uklanjanje. Vlasnik ne može ocijeniti svoj biznis.",
          ],
        },
        {
          h: "5. Sponzorisani sadržaj",
          p: [
            "Plaćene pozicije su jasno označene kao „Sponzorisano“ i ne utiču na ocjene i recenzije.",
          ],
        },
        {
          h: "6. Odgovornost",
          p: [
            "Tražim ne garantuje kvalitet, cijenu ni dostupnost usluga. Odgovornost za izvršenje usluge snosi biznis.",
          ],
        },
        {
          h: "7. Izmjene",
          p: [
            "Uslove možemo mijenjati; važeća verzija je uvijek objavljena na ovoj stranici.",
          ],
        },
        { h: "Kontakt", p: address ? [email, address] : [email] },
      ],
    },
    en: {
      title: "Terms of use",
      description: "Terms of use for the Tražim platform.",
      blocks: [
        {
          h: "1. The platform",
          p: [
            `Tražim (trazim.me) is an online directory of local services operated by ${operator}. Tražim does not provide the services and is not a party to agreements between customers and businesses.`,
          ],
        },
        {
          h: "2. Customers",
          p: [
            "Searching and viewing profiles is free. An account is needed to leave reviews. You're responsible for the accuracy of the information you enter.",
          ],
        },
        {
          h: "3. Businesses",
          p: [
            "Businesses confirm that their profile information is accurate and that they're entitled to provide the listed services. Fake profiles, misleading prices, resale of finished products (MLM) and unlawful content are not allowed.",
          ],
        },
        {
          h: "4. Reviews",
          p: [
            "Reviews must describe a real experience. We remove abusive, false and spam reviews. Disagreeing with a rating is not a reason for removal. Owners can't review their own business.",
          ],
        },
        {
          h: "5. Sponsored content",
          p: [
            "Paid placements are clearly labelled “Sponsored” and don't affect ratings or reviews.",
          ],
        },
        {
          h: "6. Liability",
          p: [
            "Tražim doesn't guarantee the quality, price or availability of services. The business is responsible for carrying out the service.",
          ],
        },
        {
          h: "7. Changes",
          p: [
            "We may update these terms; the current version is always published on this page.",
          ],
        },
        { h: "Contact", p: address ? [email, address] : [email] },
      ],
    },
    ru: {
      title: "Условия использования",
      description: "Условия использования платформы Tražim.",
      blocks: [
        {
          h: "1. О платформе",
          p: [
            `Tražim (trazim.me) — онлайн-каталог местных услуг, оператор: ${operator}. Tražim не оказывает услуги и не является стороной договорённостей между клиентами и бизнесами.`,
          ],
        },
        {
          h: "2. Клиенты",
          p: [
            "Поиск и просмотр профилей бесплатны. Для отзывов нужен аккаунт. Пользователь отвечает за точность введённых данных.",
          ],
        },
        {
          h: "3. Бизнесы",
          p: [
            "Бизнес подтверждает точность данных профиля и право оказывать указанные услуги. Запрещены фальшивые профили, вводящие в заблуждение цены, перепродажа готовых товаров (MLM) и незаконный контент.",
          ],
        },
        {
          h: "4. Отзывы",
          p: [
            "Отзыв должен описывать реальный опыт. Мы удаляем оскорбительные, ложные и спам-отзывы. Несогласие с оценкой не является причиной удаления. Владелец не может оценить свой бизнес.",
          ],
        },
        {
          h: "5. Реклама",
          p: [
            "Платные места чётко помечены как «Реклама» и не влияют на оценки и отзывы.",
          ],
        },
        {
          h: "6. Ответственность",
          p: [
            "Tražim не гарантирует качество, цену и доступность услуг. За выполнение услуги отвечает бизнес.",
          ],
        },
        {
          h: "7. Изменения",
          p: [
            "Мы можем изменять условия; актуальная версия всегда опубликована на этой странице.",
          ],
        },
        { h: "Контакты", p: address ? [email, address] : [email] },
      ],
    },
  },

  privatnost: {
    "sr-Latn-ME": {
      title: "Politika privatnosti",
      description: "Kako Tražim prikuplja i koristi lične podatke.",
      blocks: [
        {
          h: "Rukovalac podacima",
          p: [
            address
              ? `${operator}, ${address}. Kontakt: ${email}.`
              : `${operator}, kontakt: ${email}.`,
          ],
        },
        {
          h: "Koje podatke prikupljamo",
          list: [
            "Nalog: ime, email i, ako se prijaviš preko Google-a, osnovne podatke Google profila.",
            "Biznisi: podatke koje unesu na profil (naziv, kontakt, adresa, slike, cjenovnik).",
            "Recenzije: ocjenu, tekst i datum. Javno prikazujemo ime i inicijal prezimena.",
            "Statistika: zbirni broj pregleda profila i klikova na kontakt, bez praćenja pojedinaca.",
          ],
        },
        {
          h: "Zašto ih koristimo",
          p: [
            "Da bi platforma radila (nalozi, profili, recenzije), da bismo spriječili zloupotrebe i da bismo biznisima prikazali statistiku.",
          ],
        },
        {
          h: "Obrađivači",
          p: [
            "Podatke čuvamo kod Supabase (baza i prijava, EU) i Vercel (hosting i zbirna analitika posjeta, bez kolačića). Ne prodajemo lične podatke.",
          ],
        },
        {
          h: "Tvoja prava",
          p: [
            `Imaš pravo na pristup, ispravku i brisanje svojih podataka, kao i na prigovor Agenciji za zaštitu ličnih podataka i slobodan pristup informacijama. Zahtjeve šalji na ${email}.`,
          ],
        },
      ],
    },
    en: {
      title: "Privacy policy",
      description: "How Tražim collects and uses personal data.",
      blocks: [
        {
          h: "Controller",
          p: [
            address
              ? `${operator}, ${address}. Contact: ${email}.`
              : `${operator}, contact: ${email}.`,
          ],
        },
        {
          h: "What we collect",
          list: [
            "Account: name, email and, if you sign in with Google, basic Google profile data.",
            "Businesses: what they enter on their profile (name, contact details, address, photos, prices).",
            "Reviews: rating, text and date. We publicly show your first name and last initial.",
            "Statistics: aggregate profile views and contact taps, without tracking individuals.",
          ],
        },
        {
          h: "Why we use it",
          p: [
            "To run the platform (accounts, profiles, reviews), to prevent abuse and to show businesses their statistics.",
          ],
        },
        {
          h: "Processors",
          p: [
            "Data is stored with Supabase (database and sign-in, EU) and Vercel (hosting and aggregate, cookie-free visit analytics). We don't sell personal data.",
          ],
        },
        {
          h: "Your rights",
          p: [
            `You can access, correct and delete your data, and complain to Montenegro's Personal Data Protection Agency. Send requests to ${email}.`,
          ],
        },
      ],
    },
    ru: {
      title: "Политика конфиденциальности",
      description: "Как Tražim собирает и использует персональные данные.",
      blocks: [
        {
          h: "Оператор данных",
          p: [
            address
              ? `${operator}, ${address}. Контакт: ${email}.`
              : `${operator}, контакт: ${email}.`,
          ],
        },
        {
          h: "Какие данные мы собираем",
          list: [
            "Аккаунт: имя, email и, при входе через Google, базовые данные профиля Google.",
            "Бизнесы: данные, которые они вносят в профиль (название, контакты, адрес, фото, цены).",
            "Отзывы: оценка, текст и дата. Публично показываем имя и первую букву фамилии.",
            "Статистика: суммарное число просмотров и нажатий на контакт, без слежки за отдельными людьми.",
          ],
        },
        {
          h: "Зачем мы их используем",
          p: [
            "Для работы платформы (аккаунты, профили, отзывы), предотвращения злоупотреблений и показа статистики бизнесам.",
          ],
        },
        {
          h: "Обработчики",
          p: [
            "Данные хранятся у Supabase (база данных и вход, ЕС) и Vercel (хостинг и суммарная аналитика посещений без cookie). Мы не продаём персональные данные.",
          ],
        },
        {
          h: "Ваши права",
          p: [
            `Вы можете получить доступ к своим данным, исправить или удалить их, а также подать жалобу в Агентство по защите персональных данных Черногории. Запросы отправляйте на ${email}.`,
          ],
        },
      ],
    },
  },

  kolacici: {
    "sr-Latn-ME": {
      title: "Politika kolačića",
      description: "Koje kolačiće Tražim koristi i zašto.",
      blocks: [
        {
          h: "Neophodni kolačići",
          p: [
            "Koristimo ih za prijavu (sesija naloga) i sigurnost. Bez njih prijava ne radi.",
          ],
        },
        {
          h: "Lokalno skladište",
          p: [
            "U pregledaču pamtimo posljednji izabrani grad u pretrazi. To ostaje samo na tvom uređaju.",
          ],
        },
        {
          h: "Analitika",
          p: [
            "Vercel Web Analytics broji posjete zbirno, bez kolačića i bez praćenja pojedinaca. Ako kasnije uvedemo kolačiće za analitiku ili oglase, tražićemo tvoju saglasnost.",
          ],
        },
      ],
    },
    en: {
      title: "Cookie policy",
      description: "Which cookies Tražim uses and why.",
      blocks: [
        {
          h: "Essential cookies",
          p: [
            "Used for sign-in (account session) and security. Sign-in doesn't work without them.",
          ],
        },
        {
          h: "Local storage",
          p: [
            "Your browser remembers the last town you picked in search. This stays on your device.",
          ],
        },
        {
          h: "Analytics",
          p: [
            "Vercel Web Analytics counts visits in aggregate, without cookies and without tracking individuals. If we ever add analytics or advertising cookies, we'll ask for your consent first.",
          ],
        },
      ],
    },
    ru: {
      title: "Политика cookie",
      description: "Какие cookie использует Tražim и зачем.",
      blocks: [
        {
          h: "Необходимые cookie",
          p: [
            "Нужны для входа в аккаунт (сессия) и безопасности. Без них вход не работает.",
          ],
        },
        {
          h: "Локальное хранилище",
          p: [
            "Браузер запоминает последний выбранный в поиске город. Эти данные остаются только на вашем устройстве.",
          ],
        },
        {
          h: "Аналитика",
          p: [
            "Vercel Web Analytics считает посещения суммарно, без cookie и без отслеживания отдельных людей. Если в будущем появятся cookie для аналитики или рекламы, мы сначала спросим ваше согласие.",
          ],
        },
      ],
    },
  },
};
