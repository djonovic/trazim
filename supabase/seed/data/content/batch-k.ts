import type { ServiceContent } from "./types";

export const content: Record<string, ServiceContent> = {
  "advokat": {
    me: {
      description:
        "Advokat te zastupa pred sudom i organima, sastavlja i provjerava ugovore, tužbe, žalbe i punomoćja i savjetuje te prije nego što potpišeš nešto važno. Najčešće se traži za kupoprodaju nekretnina, razvode i starateljstvo, radne sporove, naplatu dugova, nasljeđivanje i krivične postupke. Ako kupuješ stan na primorju ili imaš spor sa stranim partnerom, vrijedi angažovati advokata prije potpisa, a ne tek kad problem nastane.",
      faq: [
        {
          q: "Kako izgleda prvi sastanak sa advokatom?",
          a: "Obično ukratko izložiš problem, a advokat procijeni šta se može uraditi i koji su sljedeći koraci. Da li se prva konsultacija naplaćuje zavisi od kancelarije, pa to pitaj kad zakazuješ.",
        },
        {
          q: "Šta da ponesem na konsultacije?",
          a: "Sve dokumente vezane za slučaj: ugovore, rješenja, dopise, prepisku i ličnu kartu. Korisno je i da napišeš kratku hronologiju događaja sa datumima.",
        },
        {
          q: "Šta utiče na cijenu advokatskih usluga?",
          a: "Vrsta i složenost predmeta, broj ročišta, obim pisanih podnesaka i da li je dogovorena paušalna naknada ili plaćanje po radnji. Traži da ti unaprijed objasni način obračuna i zatraži pisani dogovor.",
        },
        {
          q: "Da li advokat može da me zastupa ako nijesam u Crnoj Gori?",
          a: "Često može, na osnovu punomoćja, ali način ovjere punomoćja i dokumenata iz inostranstva treba provjeriti sa samim advokatom. On će ti reći šta tačno treba da pošalješ.",
        },
        {
          q: "Koliko traje sudski postupak?",
          a: "To se ne može unaprijed tačno reći, jer zavisi od vrste spora, suda i ponašanja druge strane. Advokat ti može dati okvirnu procjenu tek kad pogleda dokumentaciju.",
        },
      ],
      tips: [
        "Biraj advokata koji se bavi baš tvojom oblašću, na primjer nekretninama, porodičnim ili radnim pravom.",
        "Dogovori način plaćanja i troškove unaprijed, po mogućnosti pisano.",
        "Ne potpisuj ništa što ne razumiješ, pa ni punomoćje, dok ti ne objasni obim ovlašćenja.",
        "Čuvaj kopije svih dokumenata koje predaješ i traži potvrdu o prijemu.",
      ],
    },
    en: {
      description:
        "A lawyer (advokat) represents you in court and before authorities, drafts and reviews contracts, claims and powers of attorney, and advises you before you sign anything important. Foreigners in Montenegro most often need one for buying property, residence and business matters, employment disputes, inheritance or a dispute with a landlord or builder. Official proceedings are in the local language, so a lawyer who explains everything clearly in a language you understand is worth a lot.",
      faq: [
        {
          q: "Do I need a lawyer to buy property in Montenegro?",
          a: "It is not something to skip lightly: a lawyer can check ownership, encumbrances and the contract before you pay. Whether it is formally required in your case is something to confirm with the lawyer or notary.",
        },
        {
          q: "Can a lawyer act for me while I'm abroad?",
          a: "Often yes, based on a power of attorney. How a foreign power of attorney must be certified or apostilled varies, so ask the lawyer exactly what they need.",
        },
        {
          q: "What affects the cost?",
          a: "The type and complexity of the case, the number of hearings and documents, and whether you agree a flat fee or pay per action. Ask for the fee arrangement in writing before work starts.",
        },
        {
          q: "Does the lawyer speak English?",
          a: "Some do, and languages are listed on profiles. Even with an English-speaking lawyer, court documents are in Montenegrin, so you may still need a certified translation.",
        },
        {
          q: "What should I bring to the first meeting?",
          a: "Your passport or residence card, every document related to the matter, and a short timeline with dates. The more organised you are, the faster the lawyer can assess the case.",
        },
      ],
      tips: [
        "Choose a lawyer who regularly handles your type of case, such as property or employment.",
        "Ask how fees are charged and get it in writing before you start.",
        "Make sure you understand the scope of any power of attorney before signing it.",
        "Keep copies of everything you hand over and all correspondence.",
      ],
    },
    ru: {
      description:
        "Адвокат представляет ваши интересы в суде и госорганах, составляет и проверяет договоры, иски, жалобы и доверенности, консультирует перед подписанием важных документов. Иностранцам в Черногории он чаще всего нужен при покупке недвижимости, открытии бизнеса, трудовых спорах, наследстве или конфликте с застройщиком. Процессы ведутся на местном языке, поэтому ценно, когда адвокат может объяснить всё на понятном вам языке.",
      faq: [
        {
          q: "Нужен ли адвокат при покупке квартиры?",
          a: "Лучше не экономить на этом: адвокат проверит право собственности, обременения и договор до оплаты. Обязателен ли он в вашем случае формально, уточните у адвоката или нотариуса.",
        },
        {
          q: "Может ли адвокат вести дело, пока я за границей?",
          a: "Часто да, по доверенности. Как заверить доверенность, оформленную за рубежом, и нужен ли апостиль, уточните у самого адвоката.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От типа и сложности дела, количества заседаний и документов, а также от того, договорились ли вы о фиксированной оплате или об оплате за каждое действие. Попросите зафиксировать условия письменно.",
        },
        {
          q: "Есть ли адвокаты, говорящие по-русски?",
          a: "Языки указаны в профилях, проверьте их перед обращением. Судебные документы всё равно составляются на черногорском, поэтому может понадобиться присяжный перевод.",
        },
        {
          q: "Что взять на первую встречу?",
          a: "Паспорт или вид на жительство, все документы по делу и краткую хронологию событий с датами. Так адвокат быстрее оценит ситуацию.",
        },
      ],
      tips: [
        "Ищите адвоката, который постоянно работает именно с вашим типом дел.",
        "Заранее обсудите порядок оплаты и зафиксируйте его письменно.",
        "Не подписывайте доверенность, пока не поймёте, какие полномочия она даёт.",
        "Храните копии всех переданных документов и переписки.",
      ],
    },
  },
  "pravne-usluge": {
    me: {
      description:
        "Pravne usluge obuhvataju savjetovanje i pripremu dokumenata bez obaveznog odlaska na sud: ugovore o zakupu i radu, opšte uslove poslovanja, zahtjeve prema organima, prigovore, pravilnike za firme i provjeru papira prije kupovine. Korisne su za male firme, iznajmljivače apartmana i svakoga ko se suočava sa birokratijom. Imaj na umu da zastupanje pred sudom u pravilu radi advokat, pa pitaj pružaoca šta tačno smije i može da preuzme.",
      faq: [
        {
          q: "Koja je razlika između pravnih usluga i advokata?",
          a: "Pravni savjetnik ili agencija obično pomaže oko savjeta i dokumenata, dok zastupanje u sudskim postupcima po pravilu obavlja advokat. Kad nijesi siguran, pitaj pružaoca da li tvoj slučaj može da vodi do kraja.",
        },
        {
          q: "Može li se savjet dobiti online?",
          a: "Mnogi rade konsultacije telefonom, mejlom ili video pozivom i dokumente pregledaju skenirane. Za potpisivanje i ovjeru ipak ćeš možda morati lično.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Obim posla, da li je dokument standardan ili se piše od nule, hitnost i broj izmjena. Neki rade po satu, a neki po dokumentu, pa traži ponudu unaprijed.",
        },
        {
          q: "Treba li mi ugovor o zakupu za apartman ili stan?",
          a: "Pisani ugovor štiti i zakupca i vlasnika i olakšava svaki kasniji spor. Koje odredbe i prijave su obavezne za tvoj slučaj provjeri sa pravnikom ili nadležnim organom.",
        },
        {
          q: "Koliko brzo mogu dobiti dokument?",
          a: "Jednostavan ugovor ili dopis često se može pripremiti za kratko vrijeme, a složeniji akti traju duže. Rok zavisi od pružaoca i od toga koliko brzo dostaviš podatke.",
        },
      ],
      tips: [
        "Unaprijed pošalji sve podatke i postojeće dokumente, pa ćeš dobiti precizniju ponudu.",
        "Pitaj da li cijena uključuje izmjene nakon prvog nacrta.",
        "Za sporove pred sudom provjeri da li pružalac sarađuje sa advokatom.",
        "Ne koristi tuđe šablone ugovora bez provjere da li odgovaraju tvojoj situaciji.",
      ],
    },
    en: {
      description:
        "Legal services cover advice and paperwork that doesn't necessarily involve court: rental and employment contracts, terms and conditions, requests and complaints to public bodies, internal company rules, and checking documents before you buy or sign. They are handy for small businesses, holiday-let owners and anyone navigating Montenegrin bureaucracy in a second language. Court representation is generally done by a licensed lawyer, so ask the provider what they can take on.",
      faq: [
        {
          q: "How is this different from hiring a lawyer?",
          a: "Legal consultants and agencies usually help with advice and documents, while court representation is generally handled by an advokat. If unsure, ask whether the provider can see your matter through to the end.",
        },
        {
          q: "Can I get advice online?",
          a: "Many offer consultations by phone, email or video and review scanned documents. Signing and certification may still require you to be there in person.",
        },
        {
          q: "What affects the price?",
          a: "How much work is involved, whether a standard template fits or the document is drafted from scratch, urgency and the number of revisions. Ask for a quote first.",
        },
        {
          q: "Can they prepare documents in English as well?",
          a: "Some prepare bilingual contracts, which is useful with foreign partners or tenants. Check languages on the profile and ask which version prevails if there is a conflict.",
        },
        {
          q: "Should I have a written lease for my flat?",
          a: "A written lease protects both sides and makes any later dispute easier. Which clauses and registrations apply to you is something to confirm with a legal professional or the relevant office.",
        },
      ],
      tips: [
        "Send all details and existing documents up front to get an accurate quote.",
        "Ask whether revisions after the first draft are included.",
        "For court disputes, check whether the provider works with a lawyer.",
        "Don't rely on internet templates without checking they fit Montenegrin practice.",
      ],
    },
    ru: {
      description:
        "Юридические услуги — это консультации и документы без обязательного похода в суд: договоры аренды и трудовые договоры, условия продажи, обращения и жалобы в госорганы, внутренние правила компании, проверка бумаг перед покупкой. Они полезны малому бизнесу, владельцам апартаментов и всем, кто разбирается с черногорской бюрократией на чужом языке. Представительство в суде обычно ведёт адвокат, поэтому уточняйте, что именно готов взять на себя исполнитель.",
      faq: [
        {
          q: "Чем юрист отличается от адвоката?",
          a: "Юрист-консультант или агентство обычно помогают с советами и документами, а в суде, как правило, представляет адвокат. Если сомневаетесь, спросите, сможет ли исполнитель довести ваше дело до конца.",
        },
        {
          q: "Можно ли получить консультацию онлайн?",
          a: "Многие консультируют по телефону, почте или видео и смотрят сканы документов. Для подписания и заверения может понадобиться личное присутствие.",
        },
        {
          q: "От чего зависит цена?",
          a: "От объёма работы, подходит ли типовой документ или нужно писать с нуля, срочности и количества правок. Попросите предварительное предложение.",
        },
        {
          q: "Могут ли подготовить документ на двух языках?",
          a: "Некоторые готовят двуязычные договоры, это удобно с иностранными партнёрами. Проверьте языки в профиле и спросите, какая версия имеет приоритет.",
        },
        {
          q: "Нужен ли письменный договор аренды?",
          a: "Письменный договор защищает обе стороны и упрощает решение споров. Какие пункты и регистрации обязательны именно для вас, уточните у юриста или в компетентном органе.",
        },
      ],
      tips: [
        "Отправьте все данные и документы заранее, чтобы получить точную оценку.",
        "Спросите, входят ли правки после первого варианта в стоимость.",
        "Для судебных споров уточните, работает ли исполнитель с адвокатом.",
        "Не используйте шаблоны из интернета без проверки под местную практику.",
      ],
    },
  },
  "notar": {
    me: {
      description:
        "Notar sačinjava i ovjerava isprave kojima se daje posebna pravna sigurnost: ugovore o kupoprodaji nekretnina, punomoćja, izjave, ovjere potpisa i prepisa, a vodi i određene ostavinske i druge postupke. Kod notara ideš kad kupuješ ili prodaješ stan, zemljište ili vozilo, daješ nekome ovlašćenje ili ti treba ovjerena kopija za inostranstvo. Koje isprave moraju ići kod notara i šta sve treba ponijeti, provjeri direktno u notarskoj kancelariji.",
      faq: [
        {
          q: "Da li se kod notara mora zakazati termin?",
          a: "Za jednostavne ovjere potpisa ili kopija često možeš doći u radno vrijeme, ali za ugovore i složenije isprave termin se obavezno dogovara. Provjeri na profilu radno vrijeme i način zakazivanja.",
        },
        {
          q: "Šta da ponesem kod notara?",
          a: "Važeću ličnu kartu ili pasoš i sve dokumente o kojima je riječ, na primjer list nepokretnosti ili nacrt ugovora. Tačan spisak za tvoj slučaj pitaj kancelariju unaprijed.",
        },
        {
          q: "Šta utiče na cijenu notarske usluge?",
          a: "Vrsta isprave, vrijednost posla i broj primjeraka ili ovjera. Notarske naknade se obračunavaju po propisanoj tarifi, pa iznos za svoj slučaj pitaj kancelariju prije dolaska.",
        },
        {
          q: "Može li strani državljanin potpisati ugovor kod notara ako ne zna jezik?",
          a: "Obično je potreban tumač ili prevodilac tokom potpisivanja, kako bi razumio sadržaj. Kako se to organizuje, dogovori sa notarom unaprijed.",
        },
        {
          q: "Koliko traje ovjera ugovora o kupoprodaji?",
          a: "Samo potpisivanje obično nije dugo, ali priprema ugovora i provjera dokumentacije mogu trajati nekoliko dana. Rok zavisi od kancelarije i od toga da li su svi papiri u redu.",
        },
      ],
      tips: [
        "Pozovi kancelariju prije dolaska i pitaj tačan spisak dokumenata.",
        "Nacrt ugovora pošalji notaru unaprijed da ga pregleda.",
        "Ako ne govoriš crnogorski, dogovori prisustvo tumača na vrijeme.",
        "Provjeri da li su imena i podaci iz dokumenata tačno napisani prije potpisa.",
      ],
    },
    en: {
      description:
        "A notary (notar) drafts and certifies documents that carry extra legal weight: property purchase contracts, powers of attorney, statements, and certified signatures and copies, and handles certain inheritance and other procedures. Foreigners in Montenegro usually meet a notary when buying property or a car, giving someone authority to act for them, or needing a certified copy for use abroad. Which documents must go through a notary, and what to bring, is best confirmed directly with the notary's office.",
      faq: [
        {
          q: "Do I need an appointment?",
          a: "Simple signature or copy certifications may be possible during opening hours, but contracts and more complex documents need a booked slot. Check the office hours and booking method on the profile.",
        },
        {
          q: "I don't speak Montenegrin. Can I still sign?",
          a: "Usually a court interpreter must be present so you understand what you are signing. Arrange this with the notary in advance.",
        },
        {
          q: "What should I bring?",
          a: "A valid passport or residence card and every document relevant to the deal, such as the title deed or draft contract. Ask the office for the exact list for your case.",
        },
        {
          q: "What affects the notary fee?",
          a: "The type of document, the value of the transaction and the number of copies or certifications. Notary fees follow an official tariff, so ask the office for the amount before you go.",
        },
        {
          q: "Can a document certified here be used in my home country?",
          a: "Often an apostille or further legalisation is needed as well. Check with the institution that will receive the document what exactly they require.",
        },
      ],
      tips: [
        "Call ahead and ask for the exact list of documents you need.",
        "Send the draft contract to the notary in advance for review.",
        "Book a court interpreter early if you don't speak the language.",
        "Double-check the spelling of names and passport numbers before signing.",
      ],
    },
    ru: {
      description:
        "Нотариус составляет и заверяет документы с повышенной юридической силой: договоры купли-продажи недвижимости, доверенности, заявления, заверяет подписи и копии, ведёт некоторые наследственные и другие процедуры. Иностранцы в Черногории обычно идут к нотариусу при покупке квартиры или машины, оформлении доверенности или когда нужна заверенная копия для другой страны. Какие документы обязательно оформляются у нотариуса и что взять с собой, уточняйте прямо в нотариальной конторе.",
      faq: [
        {
          q: "Нужно ли записываться заранее?",
          a: "Простые заверения подписи или копий иногда делают в часы работы, но для договоров и сложных документов нужна запись. Часы работы и способ записи смотрите в профиле.",
        },
        {
          q: "Я не говорю по-черногорски. Можно ли подписать договор?",
          a: "Обычно требуется присутствие судебного переводчика, чтобы вы понимали содержание документа. Договоритесь об этом с нотариусом заранее.",
        },
        {
          q: "Что взять с собой?",
          a: "Действующий паспорт или вид на жительство и все документы по сделке, например выписку из кадастра или проект договора. Точный список уточните в конторе.",
        },
        {
          q: "От чего зависит стоимость услуг нотариуса?",
          a: "От вида документа, суммы сделки и количества экземпляров или заверений. Нотариальные сборы рассчитываются по официальному тарифу, поэтому уточните сумму заранее.",
        },
        {
          q: "Будет ли документ действителен в моей стране?",
          a: "Часто дополнительно нужен апостиль или легализация. Уточните требования у учреждения, куда вы будете подавать документ.",
        },
      ],
      tips: [
        "Позвоните заранее и уточните полный список документов.",
        "Отправьте проект договора нотариусу для предварительной проверки.",
        "Заранее договоритесь с судебным переводчиком, если не владеете языком.",
        "Перед подписанием проверьте написание имён и номеров паспортов.",
      ],
    },
  },
  "sudski-tumac": {
    me: {
      description:
        "Sudski tumač prevodi dokumente i ovjerava prevod svojim pečatom, tako da ga prihvataju sudovi, notari i državni organi, a po potrebi i usmeno prevodi na sudu, kod notara ili na vjenčanju. Najčešće se prevode izvodi iz matičnih knjiga, diplome, presude, punomoćja, uvjerenja o nekažnjavanju i dokumentacija za boravak ili firmu. Prije nego što naručiš prevod, pitaj instituciju kojoj ga predaješ da li traži apostil i ovjeren prevod originala ili kopije.",
      faq: [
        {
          q: "Da li tumaču moram donijeti original dokumenta?",
          a: "Mnogi tumači traže original ili ovjerenu kopiju na uvid, jer se prevod veže uz dokument. Pitaj tumača unaprijed šta mu treba i da li prvo treba staviti apostil.",
        },
        {
          q: "Mogu li poslati dokument mejlom?",
          a: "Neki prihvataju sken za procjenu i početak rada, a ovjereni prevod preuzimaš lično ili ti ga šalju poštom. To zavisi od tumača i od toga šta traži institucija.",
        },
        {
          q: "Koliko traje prevod?",
          a: "Kratki dokumenti poput izvoda često budu gotovi brzo, dok duže presude ili ugovori traju duže. Za hitan prevod pitaj da li je moguć i da li se dodatno naplaćuje.",
        },
        {
          q: "Šta utiče na cijenu prevoda?",
          a: "Jezički par, broj stranica, složenost teksta, hitnost i broj ovjerenih primjeraka. Za rijetke jezike obično je skuplje i duže se čeka.",
        },
        {
          q: "Da li tumač može prisustvovati kod notara ili na sudu?",
          a: "Da, usmeno prevođenje je čest dio posla, ali se termin mora dogovoriti ranije. Provjeri na profilu za koje je jezike tumač ovlašćen.",
        },
      ],
      tips: [
        "Prvo pitaj instituciju da li traži apostil, pa tek onda naruči prevod.",
        "Provjeri da je tumač ovlašćen baš za jezik koji ti treba.",
        "Pošalji sken dokumenta da dobiješ tačnu ponudu i rok.",
        "Pripremi ispravno napisana imena i prezimena kako se vode u pasošu.",
      ],
    },
    en: {
      description:
        "A court-certified translator (sudski tumač) translates documents and stamps them so courts, notaries and government offices accept them, and can interpret on the spot at court, at a notary or at a wedding. Expats typically need certified translations of birth and marriage certificates, diplomas, criminal record certificates, court rulings and company documents for residence or business. Before ordering, ask the office you are submitting to whether it wants an apostille first and a translation of the original or of a copy.",
      faq: [
        {
          q: "Do I need to bring the original document?",
          a: "Many translators want to see the original or a certified copy, as the translation is bound to it. Ask in advance and check whether the apostille should be added first.",
        },
        {
          q: "Can I send the document by email?",
          a: "Some accept a scan for a quote and to start work, and you collect the stamped translation in person or get it by post. It depends on the translator and the receiving office.",
        },
        {
          q: "How long does it take?",
          a: "Short documents like certificates are often done quickly; long contracts or rulings take longer. Ask whether urgent service is possible and whether it costs extra.",
        },
        {
          q: "What affects the price?",
          a: "The language pair, number of pages, complexity, urgency and how many certified copies you need. Less common languages usually cost more and take longer.",
        },
        {
          q: "Can the translator come with me to the notary or court?",
          a: "Yes, interpreting is a regular part of the job, but book the date early. Check on the profile which languages the translator is certified for.",
        },
      ],
      tips: [
        "Ask the receiving office about the apostille before ordering the translation.",
        "Make sure the translator is certified for your exact language pair.",
        "Send a scan to get an accurate quote and deadline.",
        "Provide names spelled exactly as in your passport.",
      ],
    },
    ru: {
      description:
        "Присяжный (судебный) переводчик переводит документы и заверяет перевод своей печатью, чтобы его принимали суды, нотариусы и госорганы, а также устно переводит в суде, у нотариуса или на свадьбе. Чаще всего переводят свидетельства о рождении и браке, дипломы, справки о несудимости, решения суда и документы компании для ВНЖ или бизнеса. Перед заказом уточните в учреждении, куда подаёте документы, нужен ли сначала апостиль и переводить ли оригинал или копию.",
      faq: [
        {
          q: "Нужно ли приносить оригинал?",
          a: "Многие переводчики просят показать оригинал или заверенную копию, так как перевод подшивается к документу. Уточните заранее, а также нужен ли сначала апостиль.",
        },
        {
          q: "Можно ли отправить документ по почте?",
          a: "Некоторые принимают скан для оценки и начала работы, а заверенный перевод вы забираете лично или получаете почтой. Это зависит от переводчика и требований учреждения.",
        },
        {
          q: "Сколько времени занимает перевод?",
          a: "Короткие справки часто делают быстро, длинные договоры и решения — дольше. Спросите, возможен ли срочный перевод и сколько он стоит.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От языковой пары, количества страниц, сложности текста, срочности и числа заверенных экземпляров. Редкие языки обычно дороже и дольше.",
        },
        {
          q: "Может ли переводчик присутствовать у нотариуса?",
          a: "Да, устный перевод — обычная часть работы, но дату нужно согласовать заранее. В профиле проверьте, для каких языков у переводчика есть допуск.",
        },
      ],
      tips: [
        "Сначала узнайте в учреждении про апостиль, затем заказывайте перевод.",
        "Убедитесь, что переводчик имеет допуск именно для вашей языковой пары.",
        "Отправьте скан, чтобы узнать точную цену и срок.",
        "Укажите имена в точности как в загранпаспорте.",
      ],
    },
  },
  "registracija-firme": {
    me: {
      description:
        "Usluga registracije firme podrazumijeva pomoć pri osnivanju DOO-a, preduzetnika ili ogranka strane firme: izbor oblika, pripremu osnivačkog akta, predaju dokumentacije u Centralni registar privrednih subjekata, dobijanje PIB-a, otvaranje računa i prijave koje slijede. Traže je lokalni preduzetnici, ali i mnogo stranaca koji ovdje otvaraju firmu. Tačne korake, dokumente i obaveze za tvoj slučaj potvrdi sa agencijom, računovođom ili nadležnim organom, jer se procedure mijenjaju.",
      faq: [
        {
          q: "Koliko traje registracija firme?",
          a: "Sama registracija može biti relativno brza kad su papiri kompletni, ali otvaranje računa, pečat i ostale prijave produže cijeli proces. Agencija ti može dati realan rok za tvoju situaciju.",
        },
        {
          q: "Mogu li registrovati firmu bez dolaska u Crnu Goru?",
          a: "Dio posla se često može obaviti preko punomoćnika, ali neki koraci, poput otvaranja računa u banci, mogu tražiti lični dolazak. Provjeri to sa agencijom i bankom.",
        },
        {
          q: "Šta da pripremim prije sastanka?",
          a: "Pasoš ili ličnu kartu, predloženi naziv firme, djelatnost, adresu sjedišta i podatke o osnivačima i direktoru. Strani osnivači trebaju pitati koje dokumente iz matične države treba prevesti i ovjeriti.",
        },
        {
          q: "Šta utiče na cijenu usluge?",
          a: "Oblik firme, broj osnivača, da li su osnivači stranci, potreba za prevodima i da li paket uključuje sjedište, pečat ili računovodstvo. Traži spisak šta je uključeno, a šta su posebne takse.",
        },
        {
          q: "Da li mi poslije registracije treba računovođa?",
          a: "Firma obično ima redovne poreske i računovodstvene obaveze od samog početka. Kakve su tačno za tvoju djelatnost, pitaj računovođu prije registracije.",
        },
      ],
      tips: [
        "Razgovaraj sa računovođom prije nego što izabereš oblik firme.",
        "Pitaj da li paket uključuje takse ili se one plaćaju posebno.",
        "Provjeri dostupnost naziva firme prije nego napraviš logo i sajt.",
        "Traži da ti se objasne obaveze u prvim mjesecima nakon registracije.",
      ],
    },
    en: {
      description:
        "Company registration help covers setting up an LLC (DOO), sole trader or foreign branch: choosing the structure, drafting the founding documents, filing with the Central Register of Business Entities, getting a tax ID (PIB), opening a bank account and the registrations that follow. Many foreigners use it when starting a business or freelancing in Montenegro. Requirements change and depend on your situation, so confirm the exact steps and obligations with the agency, an accountant or the competent authority.",
      faq: [
        {
          q: "Can I register a company without being in Montenegro?",
          a: "Part of the process can often be done through a representative with a power of attorney, but some steps, such as opening a bank account, may require you in person. Check with the agency and the bank.",
        },
        {
          q: "How long does the whole process take?",
          a: "The registration itself can be fairly quick once documents are complete, but the bank account, stamp and other registrations add time. Ask the agency for a realistic timeline for your case.",
        },
        {
          q: "What documents do I need from my home country?",
          a: "It depends on your nationality and structure; some documents may need an apostille and certified translation. The agency should give you an exact list before you start.",
        },
        {
          q: "What affects the price?",
          a: "The company type, number of founders, translations needed, and whether the package includes a registered address, stamp or accounting. Ask what is included and which official fees are extra.",
        },
        {
          q: "Does a company help with residence permits?",
          a: "Some foreigners apply for residence on business grounds, but the conditions are set by the authorities and change over time. Confirm them with the agency or the police directorate before relying on it.",
        },
      ],
      tips: [
        "Talk to an accountant before choosing the company structure.",
        "Ask for a written list of what the package includes and what fees are extra.",
        "Check the company name is available before designing a logo or website.",
        "Ask what your obligations are in the first months after registration.",
      ],
    },
    ru: {
      description:
        "Регистрация компании — это помощь при открытии ООО (DOO), ИП (preduzetnik) или филиала иностранной фирмы: выбор формы, подготовка учредительных документов, подача в Центральный реестр субъектов хозяйствования, получение PIB, открытие счёта и последующие регистрации. Этой услугой часто пользуются иностранцы, открывающие бизнес в Черногории. Требования меняются и зависят от вашей ситуации, поэтому точные шаги и обязательства уточняйте у агентства, бухгалтера или в компетентном органе.",
      faq: [
        {
          q: "Можно ли открыть компанию, не приезжая в Черногорию?",
          a: "Часть действий часто можно выполнить через представителя по доверенности, но некоторые шаги, например открытие счёта, могут требовать личного присутствия. Уточните у агентства и банка.",
        },
        {
          q: "Сколько времени занимает процесс?",
          a: "Сама регистрация бывает довольно быстрой при полном пакете документов, но счёт, печать и другие регистрации добавляют время. Попросите агентство назвать реальный срок.",
        },
        {
          q: "Какие документы нужны из моей страны?",
          a: "Это зависит от гражданства и формы компании; некоторым документам нужен апостиль и присяжный перевод. Агентство должно дать точный список до начала работы.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От формы компании, числа учредителей, нужных переводов и того, входит ли в пакет юридический адрес, печать или бухгалтерия. Спросите, какие госпошлины оплачиваются отдельно.",
        },
        {
          q: "Помогает ли компания получить ВНЖ?",
          a: "Некоторые иностранцы оформляют ВНЖ на основании бизнеса, но условия устанавливают власти, и они меняются. Уточните их у агентства или в полиции, прежде чем на это рассчитывать.",
        },
      ],
      tips: [
        "Поговорите с бухгалтером до выбора формы компании.",
        "Попросите письменный список того, что входит в пакет.",
        "Проверьте, свободно ли название, прежде чем заказывать логотип и сайт.",
        "Уточните обязательства компании в первые месяцы после регистрации.",
      ],
    },
  },
  "poslovno-savjetovanje": {
    me: {
      description:
        "Poslovni savjetnik pomaže da napraviš biznis plan, provjeriš isplativost ideje, središ cijene i troškove, pripremiš projekat za kredit ili grant i organizuješ procese kad firma poraste. Korisno je malim firmama, porodičnim biznisima i iznajmljivačima koji žele da turističku sezonu planiraju ozbiljnije, ali i onima koji tek kreću. Savjetnik ne donosi odluke umjesto tebe, pa ti najviše vrijedi onaj koji razumije tvoju branšu i lokalno tržište.",
      faq: [
        {
          q: "Kako izgleda prva konsultacija?",
          a: "Obično se razgovara o tome gdje je firma sada, šta je problem i šta želiš postići. Nakon toga savjetnik predlaže obim posla i način saradnje.",
        },
        {
          q: "Može li savjetovanje online?",
          a: "Da, većina savjetnika radi i video pozivima, a dokumente razmjenjujete mejlom. Za radionice sa timom ili obilazak objekta bolje je uživo.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Obim i trajanje angažmana, da li je jednokratna konsultacija ili dugoročna saradnja, i koliko analize i dokumenata treba pripremiti. Traži jasnu ponudu sa rezultatima koje ćeš dobiti.",
        },
        {
          q: "Da li savjetnik može pomoći oko prijave na grantove i kredite?",
          a: "Mnogi pripremaju biznis planove i projektne prijave, ali uslove i rokove uvijek provjeri kod institucije koja raspisuje poziv. Niko ti ne može garantovati da će prijava proći.",
        },
        {
          q: "Šta da pripremim?",
          a: "Osnovne brojke o prihodima i troškovima, opis proizvoda ili usluge i konkretno pitanje na koje tražiš odgovor. Što preciznije postaviš cilj, korisniji je savjet.",
        },
      ],
      tips: [
        "Traži reference ili primjere sličnih projekata u tvojoj branši.",
        "Dogovori unaprijed šta je konkretan rezultat: plan, analiza, tabela ili radionica.",
        "Čuvaj se obećanja o sigurnom uspjehu ili garantovanom finansiranju.",
        "Počni manjim angažmanom da vidiš da li vam saradnja odgovara.",
      ],
    },
    en: {
      description:
        "A business consultant helps you build a business plan, test whether an idea pays off, fix pricing and costs, prepare a loan or grant application and organise processes as the company grows. It is useful for small firms, family businesses, holiday-rental owners planning the tourist season more seriously, and foreigners trying to understand the local market. A consultant won't make decisions for you, so look for someone who knows your industry and Montenegro.",
      faq: [
        {
          q: "What happens in the first session?",
          a: "Usually you discuss where the business is now, the main problem and your goal. The consultant then proposes a scope and way of working.",
        },
        {
          q: "Can we work remotely?",
          a: "Yes, most consultants work over video calls and email. Team workshops or reviewing a physical premises are better done in person.",
        },
        {
          q: "What affects the price?",
          a: "The scope and length of the engagement, one-off advice versus ongoing support, and how much analysis is needed. Ask for a proposal that spells out the deliverables.",
        },
        {
          q: "Can a consultant help me understand the Montenegrin market as a foreigner?",
          a: "A local consultant can explain customer habits, seasonality and practical hurdles. For legal and tax questions, they should point you to a lawyer or accountant.",
        },
        {
          q: "Can they guarantee funding?",
          a: "No one can honestly guarantee a loan or grant. They can prepare a stronger application, but always check the conditions with the institution offering the money.",
        },
      ],
      tips: [
        "Ask for examples of similar projects in your industry.",
        "Agree on concrete deliverables: a plan, a model, a report or a workshop.",
        "Be wary of promises of guaranteed success or funding.",
        "Start with a small, paid piece of work to test the fit.",
      ],
    },
    ru: {
      description:
        "Бизнес-консультант помогает составить бизнес-план, оценить окупаемость идеи, пересмотреть цены и расходы, подготовить заявку на кредит или грант и выстроить процессы по мере роста компании. Это полезно малому и семейному бизнесу, владельцам апартаментов, которые хотят серьёзнее планировать сезон, и иностранцам, которые осваивают местный рынок. Консультант не принимает решения за вас, поэтому ищите того, кто знает вашу отрасль и Черногорию.",
      faq: [
        {
          q: "Как проходит первая встреча?",
          a: "Обычно обсуждают текущее состояние бизнеса, главную проблему и цель. Затем консультант предлагает объём работы и формат сотрудничества.",
        },
        {
          q: "Можно ли работать онлайн?",
          a: "Да, большинство консультантов работают по видеосвязи и почте. Командные семинары или осмотр объекта лучше проводить очно.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От объёма и длительности работы, разовой консультации или долгосрочного сопровождения, количества анализа. Попросите предложение с перечнем результатов.",
        },
        {
          q: "Поможет ли консультант разобраться в местном рынке?",
          a: "Местный специалист объяснит привычки клиентов, сезонность и практические сложности. По юридическим и налоговым вопросам он должен направить к юристу или бухгалтеру.",
        },
        {
          q: "Может ли консультант гарантировать финансирование?",
          a: "Честно — нет. Он поможет подготовить сильную заявку, но условия всегда проверяйте в организации, которая выдаёт средства.",
        },
      ],
      tips: [
        "Попросите примеры похожих проектов в вашей отрасли.",
        "Договоритесь о конкретном результате: план, модель, отчёт или семинар.",
        "Настораживайтесь, если обещают гарантированный успех или деньги.",
        "Начните с небольшого платного задания, чтобы проверить совместимость.",
      ],
    },
  },
  "finansijske-usluge": {
    me: {
      description:
        "Finansijske usluge obuhvataju pomoć oko ličnih i poslovnih finansija: planiranje budžeta, poređenje kredita i lizinga, pripremu dokumentacije za banku, finansijske izvještaje za firmu, praćenje tokova novca i savjete o štednji ili osiguranju. Ljudi ih traže kad kupuju stan na kredit, kad firma raste ili kad se sezonski prihodi sa primorja moraju rasporediti na cijelu godinu. Za poreska pitanja i investicije traži stručnjaka sa odgovarajućim ovlašćenjima i odluke donosi tek kad razumiješ rizike.",
      faq: [
        {
          q: "Da li finansijski savjetnik može da mi kaže u šta da uložim?",
          a: "Neki pružaoci daju opšte savjete o budžetu i štednji, a investicione savjete mogu davati samo ovlašćena lica. Pitaj pružaoca šta tačno smije da radi i ko snosi odgovornost.",
        },
        {
          q: "Može li pomoć oko kredita za stan?",
          a: "Da, savjetnik može pomoći da uporediš ponude banaka i pripremiš dokumentaciju, ali konačne uslove određuje banka. Uporedi ukupan trošak kredita, ne samo ratu.",
        },
        {
          q: "Šta utiče na cijenu usluge?",
          a: "Obim posla, da li je jednokratna konsultacija ili stalna saradnja i složenost tvoje situacije. Pitaj da li savjetnik dobija proviziju od banke ili osiguranja, jer to utiče na preporuke.",
        },
        {
          q: "Šta da pripremim?",
          a: "Pregled prihoda i troškova, postojeće kredite i obaveze i jasan cilj, na primjer kupovinu stana ili sređivanje duga. Za firmu ponesi i poslednje izvještaje.",
        },
        {
          q: "Da li se može raditi online?",
          a: "Mnogi rade video pozivima i mejlom, uz dijeljenje tabela i izvoda. Osjetljive podatke šalji samo na siguran način koji dogovorite.",
        },
      ],
      tips: [
        "Pitaj da li savjetnik zarađuje provizije od proizvoda koje preporučuje.",
        "Ne prepuštaj nikome pristup računima bez pisanog dogovora.",
        "Traži da ti se rizici objasne jednostavnim riječima prije odluke.",
        "Ne vjeruj obećanjima o sigurnoj i visokoj zaradi.",
      ],
    },
    en: {
      description:
        "Financial services here cover help with personal and business money: budgeting, comparing loans and leasing, preparing paperwork for the bank, financial reports for a company, cash-flow tracking and general advice on savings or insurance. People look for them when taking a mortgage, when a business grows, or when seasonal income from the coast has to last all year. For tax and investment matters, use a professional with the right authorisation and make sure you understand the risks before deciding.",
      faq: [
        {
          q: "Can a local bank give a mortgage to a foreigner?",
          a: "Some banks lend to foreign residents, but conditions vary and change. An adviser can help compare offers, while the final terms always come from the bank.",
        },
        {
          q: "Can the adviser tell me what to invest in?",
          a: "General budgeting advice is one thing; investment advice is usually reserved for authorised professionals. Ask what the provider is allowed to do and who is responsible for the advice.",
        },
        {
          q: "What affects the cost?",
          a: "The scope, whether it's a one-off session or ongoing support, and how complex your finances are. Ask whether the adviser earns commission from banks or insurers.",
        },
        {
          q: "What should I prepare?",
          a: "An overview of income and expenses, existing loans and a clear goal. For a business, bring the latest financial statements.",
        },
        {
          q: "Can we do it remotely?",
          a: "Many work via video calls and email with shared spreadsheets. Send sensitive data only through a secure channel you both agree on.",
        },
      ],
      tips: [
        "Ask whether the adviser earns commission on the products they recommend.",
        "Never share account access without a written agreement.",
        "Compare the total cost of a loan, not just the monthly payment.",
        "Walk away from promises of safe, high returns.",
      ],
    },
    ru: {
      description:
        "Финансовые услуги — это помощь с личными и бизнес-финансами: бюджет, сравнение кредитов и лизинга, подготовка документов для банка, финансовая отчётность компании, контроль денежных потоков и общие советы по накоплениям и страхованию. К ним обращаются при покупке жилья в кредит, росте бизнеса или когда сезонный доход на побережье нужно растянуть на весь год. По налогам и инвестициям обращайтесь к специалисту с нужными полномочиями и принимайте решения, только понимая риски.",
      faq: [
        {
          q: "Дают ли местные банки ипотеку иностранцам?",
          a: "Некоторые банки кредитуют иностранцев с ВНЖ, но условия разные и меняются. Консультант поможет сравнить предложения, а окончательные условия определяет банк.",
        },
        {
          q: "Может ли консультант советовать, куда инвестировать?",
          a: "Общие советы по бюджету — одно, а инвестиционные рекомендации обычно дают только лицензированные специалисты. Уточните, что именно вправе делать исполнитель.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От объёма работы, разовой консультации или постоянного сопровождения и сложности ваших финансов. Спросите, получает ли консультант комиссию от банков или страховщиков.",
        },
        {
          q: "Что подготовить?",
          a: "Обзор доходов и расходов, текущие кредиты и конкретную цель. Для компании — последнюю финансовую отчётность.",
        },
        {
          q: "Можно ли работать онлайн?",
          a: "Многие работают по видеосвязи и почте. Конфиденциальные данные отправляйте только по согласованному защищённому каналу.",
        },
      ],
      tips: [
        "Спросите, получает ли консультант комиссию с рекомендуемых продуктов.",
        "Не давайте доступ к счетам без письменного соглашения.",
        "Сравнивайте полную стоимость кредита, а не только ежемесячный платёж.",
        "Не верьте обещаниям надёжной и высокой доходности.",
      ],
    },
  },
  "virtuelni-asistent": {
    me: {
      description:
        "Virtuelni asistent na daljinu preuzima administraciju koja ti oduzima vrijeme: odgovaranje na mejlove i poruke, zakazivanje termina, vođenje kalendara, unos podataka, pripremu ponuda i faktura, komunikaciju sa gostima apartmana ili objave na društvenim mrežama. Najviše ga koriste preduzetnici, mali timovi i iznajmljivači kojima u sezoni poruke stižu u svako doba. Radi se po satu ili mjesečnom paketu, a ključno je da jasno odrediš zadatke i pristupe.",
      faq: [
        {
          q: "Koje poslove virtuelni asistent obično radi?",
          a: "Najčešće mejlove, kalendar, unos podataka, tabele, pretragu informacija, rezervacije i jednostavne objave. Za računovodstvo ili pravne poslove treba ti stručnjak, a ne asistent.",
        },
        {
          q: "Da li asistent radi vikendom i u sezoni?",
          a: "Neki nude i vikende i večernje sate, posebno za komunikaciju sa gostima, ali to se dogovara posebno. Provjeri na profilu dostupnost i jezike.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj sati, vrsta zadataka, jezici, hitnost odgovora i da li je potreban rad van radnog vremena. Mjesečni paket je često povoljniji od povremenog angažmana, ali pitaj šta ulazi u njega.",
        },
        {
          q: "Kako da bezbjedno dam pristup nalozima?",
          a: "Koristi odvojene korisničke naloge ili menadžer lozinki umjesto dijeljenja svoje glavne lozinke. Dogovori i povjerljivost podataka pisanim putem.",
        },
        {
          q: "Kako da počnem saradnju?",
          a: "Napravi spisak zadataka koje ponavljaš svake sedmice i kratka uputstva za njih. Probni period od nekoliko sedmica pokaže da li vam saradnja odgovara.",
        },
      ],
      tips: [
        "Napiši kratka uputstva za zadatke koji se ponavljaju prije početka.",
        "Dogovori kanal komunikacije i rok za odgovor na hitne poruke.",
        "Daj pristup samo onome što asistentu stvarno treba.",
        "Počni probnim periodom i jasno mjerljivim zadacima.",
      ],
    },
    en: {
      description:
        "A virtual assistant takes over remote admin that eats your time: email and message handling, booking appointments, managing your calendar, data entry, quotes and invoices, guest communication for holiday lets, or scheduling social media posts. It suits freelancers, small teams and rental owners who get messages at all hours in summer. Work is billed hourly or as a monthly package, and the key is defining tasks and access clearly from day one.",
      faq: [
        {
          q: "What tasks can a virtual assistant handle?",
          a: "Typically inbox and calendar management, data entry, spreadsheets, research, bookings and simple social posts. Accounting or legal work needs a qualified professional.",
        },
        {
          q: "Can they reply to guests in several languages?",
          a: "Some can; languages are listed on profiles. Ask for a short test reply in each language you need.",
        },
        {
          q: "What affects the price?",
          a: "Hours, type of tasks, languages, response-time expectations and evening or weekend cover. Monthly packages often work out better, but check exactly what is included.",
        },
        {
          q: "How do I share logins safely?",
          a: "Use separate user accounts or a password manager instead of sharing your main password. Put confidentiality in writing.",
        },
        {
          q: "How do we get started?",
          a: "List the tasks you repeat every week and write short instructions for each. A trial period of a few weeks shows whether it works.",
        },
      ],
      tips: [
        "Write simple instructions for recurring tasks before the first day.",
        "Agree on a communication channel and response time for urgent issues.",
        "Grant access only to the tools the assistant actually needs.",
        "Start with a trial and clearly measurable tasks.",
      ],
    },
    ru: {
      description:
        "Виртуальный ассистент удалённо берёт на себя рутину: почту и сообщения, запись клиентов, календарь, ввод данных, подготовку предложений и счетов, общение с гостями апартаментов или публикации в соцсетях. Он особенно полезен фрилансерам, небольшим командам и владельцам жилья под аренду, которым в сезон пишут круглосуточно. Работа оплачивается почасово или пакетом на месяц, главное — чётко определить задачи и доступы.",
      faq: [
        {
          q: "Какие задачи выполняет ассистент?",
          a: "Обычно почта и календарь, ввод данных, таблицы, поиск информации, бронирования и простые посты. Бухгалтерия и юридические вопросы требуют профильного специалиста.",
        },
        {
          q: "Может ли ассистент отвечать гостям на разных языках?",
          a: "Некоторые могут, языки указаны в профилях. Попросите пробный ответ на каждом нужном языке.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества часов, типа задач, языков, скорости ответа и работы вечером или в выходные. Месячный пакет часто выгоднее, но уточните, что в него входит.",
        },
        {
          q: "Как безопасно дать доступ к аккаунтам?",
          a: "Используйте отдельные учётные записи или менеджер паролей вместо передачи основного пароля. Конфиденциальность закрепите письменно.",
        },
        {
          q: "С чего начать сотрудничество?",
          a: "Составьте список повторяющихся задач и краткие инструкции к ним. Пробный период в несколько недель покажет, подходите ли вы друг другу.",
        },
      ],
      tips: [
        "Подготовьте простые инструкции для повторяющихся задач заранее.",
        "Согласуйте канал связи и время ответа на срочные сообщения.",
        "Давайте доступ только к тем сервисам, которые действительно нужны.",
        "Начните с пробного периода и измеримых задач.",
      ],
    },
  },
  "medijator": {
    me: {
      description:
        "Medijator je neutralna osoba koja pomaže stranama u sporu da same dođu do dogovora, bez suđenja: između komšija, suvlasnika nekretnine, poslovnih partnera, poslodavca i radnika ili članova porodice oko podjele imovine i brige o djeci. Medijator ne presuđuje i ne zastupa nijednu stranu, već vodi razgovor i pomaže da se dogovor zapiše. Kako se postignuti sporazum kasnije pravno potvrđuje, provjeri sa medijatorom ili advokatom.",
      faq: [
        {
          q: "Da li obje strane moraju pristati na medijaciju?",
          a: "Medijacija se zasniva na dobrovoljnosti, pa je potrebno da obje strane žele da učestvuju. Medijator može pomoći da se druga strana pozove na prvi razgovor.",
        },
        {
          q: "Koliko traje medijacija?",
          a: "Neki sporovi se riješe u jednom ili dva susreta, a složeniji traže više sesija. Zavisi od broja spornih pitanja i spremnosti strana na dogovor.",
        },
        {
          q: "Da li je ono što kažem povjerljivo?",
          a: "Povjerljivost je osnovno načelo medijacije, ali pitaj medijatora na početku kako je tačno uređena u tvom slučaju. Obično se to potpisuje prije prve sesije.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj i trajanje sesija, složenost spora i da li se troškovi dijele među stranama. Pitaj unaprijed kako se naplaćuje i ko plaća.",
        },
        {
          q: "Mogu li doći sa advokatom?",
          a: "Često možeš, a advokat ti može pomoći da razumiješ posljedice dogovora prije potpisa. Dogovori to sa medijatorom i drugom stranom unaprijed.",
        },
      ],
      tips: [
        "Prije prve sesije zapiši šta ti je najvažnije, a oko čega možeš popustiti.",
        "Biraj medijatora koji ima iskustva sa tvojom vrstom spora.",
        "Ponesi dokumente koji su bitni za spor, ali bez namjere da dokazuješ ko je kriv.",
        "Prije potpisa sporazuma daj ga na uvid svom advokatu.",
      ],
    },
    en: {
      description:
        "A mediator is a neutral person who helps both sides of a dispute reach their own agreement without going to court: neighbours, co-owners of a property, business partners, employer and employee, or family members dealing with assets and childcare. The mediator doesn't judge or represent either side; they guide the conversation and help put the agreement in writing. For expats, mediation can be a calmer, faster route than court proceedings in a foreign language. Check with the mediator or a lawyer how the agreement becomes binding.",
      faq: [
        {
          q: "Does the other side have to agree?",
          a: "Mediation is voluntary, so both parties need to take part. The mediator can help invite the other side to a first meeting.",
        },
        {
          q: "How long does it take?",
          a: "Some disputes are settled in one or two sessions, others need more. It depends on how many issues there are and how willing both sides are.",
        },
        {
          q: "Is it confidential?",
          a: "Confidentiality is a core principle, but ask the mediator how it is handled in your case. It is usually agreed in writing before the first session.",
        },
        {
          q: "What affects the price?",
          a: "The number and length of sessions, how complex the dispute is and whether costs are shared. Ask how billing works before you start.",
        },
        {
          q: "Can mediation happen in English?",
          a: "It depends on the mediator and the other party; languages are listed on profiles. If one side needs interpreting, sort it out in advance.",
        },
      ],
      tips: [
        "Write down what matters most to you and where you can compromise.",
        "Pick a mediator experienced in your type of dispute.",
        "Bring relevant documents, but focus on solutions rather than blame.",
        "Have your lawyer review the agreement before you sign.",
      ],
    },
    ru: {
      description:
        "Медиатор — нейтральный посредник, который помогает сторонам спора самим договориться без суда: соседям, совладельцам недвижимости, деловым партнёрам, работодателю и работнику, членам семьи при разделе имущества или решении вопросов о детях. Медиатор не выносит решения и не представляет ни одну из сторон, а ведёт разговор и помогает оформить договорённость. Для иностранцев это может быть более спокойный путь, чем суд на чужом языке. Как соглашение получает юридическую силу, уточните у медиатора или адвоката.",
      faq: [
        {
          q: "Должна ли другая сторона согласиться?",
          a: "Медиация добровольна, поэтому участвовать должны обе стороны. Медиатор может помочь пригласить другую сторону на первую встречу.",
        },
        {
          q: "Сколько длится медиация?",
          a: "Некоторые споры решаются за одну-две встречи, сложные требуют больше. Всё зависит от количества вопросов и готовности сторон договариваться.",
        },
        {
          q: "Это конфиденциально?",
          a: "Конфиденциальность — базовый принцип медиации, но уточните у медиатора, как она оформляется в вашем случае. Обычно это подписывают до первой сессии.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества и длительности сессий, сложности спора и того, делятся ли расходы между сторонами. Уточните порядок оплаты заранее.",
        },
        {
          q: "Можно ли провести медиацию на русском?",
          a: "Это зависит от медиатора и другой стороны, языки указаны в профилях. Если кому-то нужен переводчик, договоритесь заранее.",
        },
      ],
      tips: [
        "Запишите, что для вас главное и в чём вы готовы уступить.",
        "Выбирайте медиатора с опытом именно в вашем типе споров.",
        "Возьмите нужные документы, но настраивайтесь на решение, а не на поиск виноватых.",
        "Перед подписанием покажите соглашение своему адвокату.",
      ],
    },
  },
  "procjenitelj": {
    me: {
      description:
        "Procjenitelj utvrđuje tržišnu vrijednost stana, kuće, zemljišta, poslovnog prostora, vozila, opreme ili cijele firme i o tome sačinjava pisani izvještaj. Procjena se najčešće traži za kredit u banci, kupoprodaju, podjelu imovine, nasljeđivanje, sudske sporove ili osiguranje. Banke i sudovi često imaju svoje zahtjeve ili liste procjenitelja, pa prije angažovanja pitaj instituciju kojoj izvještaj predaješ koga i kakvu procjenu prihvata.",
      faq: [
        {
          q: "Da li banka prihvata bilo kojeg procjenitelja?",
          a: "Ne uvijek: mnoge banke rade sa svojom listom procjenitelja ili imaju posebne zahtjeve za izvještaj. Provjeri to u banci prije nego što nekoga angažuješ.",
        },
        {
          q: "Šta procjenitelj gleda kod nekretnine?",
          a: "Obično lokaciju, površinu, stanje objekta, spratnost, pogled, pristup, dokumentaciju i cijene uporedivih nekretnina. Na primorju udaljenost od mora i pogled znaju mnogo da znače.",
        },
        {
          q: "Koje dokumente da pripremim?",
          a: "List nepokretnosti, građevinsku i upotrebnu dokumentaciju ako postoji, skicu ili plan i podatke o renoviranju. Procjenitelj će ti reći šta još treba.",
        },
        {
          q: "Šta utiče na cijenu procjene?",
          a: "Vrsta i veličina imovine, lokacija, svrha procjene i rok. Procjena firme ili složenog objekta obično je zahtjevnija od procjene stana.",
        },
        {
          q: "Koliko traje izrada izvještaja?",
          a: "Nakon izlaska na teren izvještaj se obično pravi u roku od nekoliko dana, ali zavisi od procjenitelja i dokumentacije. Ako ti je hitno, pitaj unaprijed.",
        },
      ],
      tips: [
        "Pitaj banku ili sud koje procjenitelje i format izvještaja prihvataju.",
        "Pripremi dokumentaciju o nekretnini prije izlaska procjenitelja.",
        "Omogući pristup svim prostorijama, podrumu, tavanu i garaži.",
        "Navedi tačnu svrhu procjene, jer od nje zavisi pristup i izvještaj.",
      ],
    },
    en: {
      description:
        "A valuer assesses the market value of a flat, house, land, commercial property, vehicle, equipment or an entire business, and writes it up in a formal report. Valuations are typically needed for a bank mortgage, buying or selling, dividing assets, inheritance, court disputes or insurance. Banks and courts often have their own requirements or approved lists, so before hiring anyone, ask the institution receiving the report which valuers and formats it accepts.",
      faq: [
        {
          q: "Will my bank accept any valuer?",
          a: "Not always: many banks work with an approved list or specific report requirements. Check with the bank before you book.",
        },
        {
          q: "What does a valuer look at?",
          a: "Usually location, size, condition, floor, view, access, paperwork and prices of comparable properties. On the coast, distance to the sea and the view can matter a lot.",
        },
        {
          q: "What documents should I prepare?",
          a: "The title deed (list nepokretnosti), building and occupancy documents if available, floor plans and details of renovations. The valuer will tell you what else is needed.",
        },
        {
          q: "What affects the price?",
          a: "The type and size of the asset, location, purpose of the valuation and deadline. A business or complex building takes more work than a flat.",
        },
        {
          q: "Can I get the report in English?",
          a: "Some valuers provide reports in English or bilingual; languages are listed on profiles. Check which language the bank or court needs.",
        },
      ],
      tips: [
        "Ask the bank or court which valuers and report formats they accept.",
        "Have property paperwork ready before the site visit.",
        "Provide access to every room, storage, attic and garage.",
        "State the exact purpose, as it shapes the method and report.",
      ],
    },
    ru: {
      description:
        "Оценщик определяет рыночную стоимость квартиры, дома, земли, коммерческой недвижимости, автомобиля, оборудования или бизнеса и оформляет письменный отчёт. Оценка обычно нужна для ипотеки, купли-продажи, раздела имущества, наследства, судебных споров или страхования. У банков и судов часто есть свои требования или списки оценщиков, поэтому сначала уточните в учреждении, куда подаётся отчёт, чью оценку и в каком формате там принимают.",
      faq: [
        {
          q: "Примет ли банк отчёт любого оценщика?",
          a: "Не всегда: многие банки работают со своим списком оценщиков или требованиями к отчёту. Уточните в банке до заказа.",
        },
        {
          q: "На что смотрит оценщик?",
          a: "Обычно на расположение, площадь, состояние, этаж, вид, подъезд, документы и цены похожих объектов. На побережье большое значение имеют близость к морю и вид.",
        },
        {
          q: "Какие документы подготовить?",
          a: "Выписку из кадастра (list nepokretnosti), строительную документацию и разрешение на эксплуатацию, если есть, планы и сведения о ремонте. Оценщик скажет, что ещё нужно.",
        },
        {
          q: "От чего зависит стоимость оценки?",
          a: "От типа и размера объекта, местоположения, цели оценки и срока. Оценка бизнеса или сложного здания требует больше работы, чем квартиры.",
        },
        {
          q: "Можно ли получить отчёт на другом языке?",
          a: "Некоторые оценщики делают отчёты на английском или на двух языках, языки указаны в профилях. Уточните, какой язык требует банк или суд.",
        },
      ],
      tips: [
        "Уточните в банке или суде, чьи отчёты и в каком формате принимают.",
        "Подготовьте документы на объект до выезда оценщика.",
        "Обеспечьте доступ ко всем помещениям, подвалу и гаражу.",
        "Чётко назовите цель оценки: от неё зависит метод и отчёт.",
      ],
    },
  },
  "arhitekta": {
    me: {
      description:
        "Arhitekta osmišljava i projektuje kuće, stambene zgrade, apartmane, poslovne prostore i rekonstrukcije, od idejnog rješenja do projektne dokumentacije i praćenja izgradnje. Treba ti kad gradiš ili dograđuješ, mijenjaš namjenu prostora ili želiš da iz parcele na padini ili male primorske placeve izvučeš najviše. Arhitekta može pomoći i da razumiješ urbanističke uslove, ali koji su projekti i dozvole potrebni za tvoj objekat provjeri sa njim i nadležnim organom opštine.",
      faq: [
        {
          q: "Kada da uključim arhitektu?",
          a: "Najbolje prije kupovine placa ili stana za renoviranje, da provjeri šta se tu realno može izgraditi. Kasnije izmjene projekta ili gradnje su skuplje.",
        },
        {
          q: "Šta da pripremim za prvi sastanak?",
          a: "List nepokretnosti, urbanističke uslove ako ih imaš, fotografije lokacije, okvirni budžet i spisak želja, na primjer broj soba ili apartmana. Primjeri objekata koji ti se sviđaju mnogo pomažu.",
        },
        {
          q: "Šta utiče na cijenu projekta?",
          a: "Veličina i složenost objekta, faza projekta koju naručuješ, broj izmjena i da li uključuje nadzor ili koordinaciju sa drugim inženjerima. Traži ponudu po fazama.",
        },
        {
          q: "Da li arhitekta može da radi i enterijer?",
          a: "Mnogi rade i unutrašnje uređenje, ali ne svi. Pogledaj portfolio na profilu da vidiš kakve je projekte već radio.",
        },
        {
          q: "Da li arhitekta vodi i posao oko dozvola?",
          a: "Neki pomažu i oko prijava i dokumentacije za organe, a neki samo projektuju. Pitaj šta je tačno uključeno, a zakonske zahtjeve za svoj slučaj potvrdi kod opštine.",
        },
      ],
      tips: [
        "Pogledaj portfolio i realizovane objekte, ne samo vizualizacije.",
        "Dogovori ponudu po fazama i broj uključenih izmjena.",
        "Budi realan oko budžeta od početka, da projekat ne bude neizvodljiv.",
        "Uključi arhitektu prije kupovine placa ili nekretnine za rekonstrukciju.",
      ],
    },
    en: {
      description:
        "An architect designs houses, apartment buildings, holiday rentals, commercial spaces and renovations, from the first concept to full project documentation and site supervision. You need one when building, extending, converting a space, or trying to make the most of a sloping plot or a tight coastal site. Architects can also help you understand planning conditions, but which projects and permits your building needs is something to confirm with them and the municipality.",
      faq: [
        {
          q: "When should I involve an architect?",
          a: "Ideally before you buy a plot or a place to renovate, so they can check what can realistically be built. Changing plans later is more expensive.",
        },
        {
          q: "What should I bring to the first meeting?",
          a: "The title deed, any planning conditions you have, photos of the site, a rough budget and a wish list. Examples of buildings you like help a lot.",
        },
        {
          q: "What affects the cost?",
          a: "Size and complexity, which project phases you order, the number of revisions and whether supervision or coordination with engineers is included. Ask for a quote by phase.",
        },
        {
          q: "Can I work with an architect remotely from abroad?",
          a: "Much of the design can be done online, but site visits and meetings with authorities usually need someone local. Ask how they handle that.",
        },
        {
          q: "Do they handle the permits?",
          a: "Some help with applications and paperwork, others only design. Ask exactly what is included and confirm the legal requirements with the municipality.",
        },
      ],
      tips: [
        "Look at completed buildings, not just renderings.",
        "Agree a phased quote and how many revisions are included.",
        "Be honest about budget from the start.",
        "Bring the architect in before you buy a plot or a renovation project.",
      ],
    },
    ru: {
      description:
        "Архитектор проектирует дома, жилые здания, апартаменты, коммерческие помещения и реконструкции — от эскиза до проектной документации и авторского надзора. Он нужен, если вы строите, делаете пристройку, меняете назначение помещения или хотите максимально использовать участок на склоне или небольшой участок у моря. Архитектор поможет разобраться в градостроительных условиях, но какие проекты и разрешения нужны для вашего объекта, уточняйте у него и в муниципалитете.",
      faq: [
        {
          q: "Когда подключать архитектора?",
          a: "Лучше до покупки участка или квартиры под ремонт, чтобы он проверил, что там реально можно построить. Поздние изменения обходятся дороже.",
        },
        {
          q: "Что взять на первую встречу?",
          a: "Выписку из кадастра, градостроительные условия, если есть, фото участка, ориентировочный бюджет и список пожеланий. Примеры понравившихся зданий очень помогают.",
        },
        {
          q: "От чего зависит стоимость проекта?",
          a: "От размера и сложности объекта, заказанных стадий проекта, количества правок и того, входит ли надзор и координация с инженерами. Попросите предложение по стадиям.",
        },
        {
          q: "Можно ли работать с архитектором из-за границы?",
          a: "Большую часть проектирования можно вести онлайн, но выезды на объект и встречи с органами обычно требуют местного присутствия. Уточните, как это организовано.",
        },
        {
          q: "Занимается ли архитектор разрешениями?",
          a: "Некоторые помогают с подачей документов, другие только проектируют. Уточните, что входит в услугу, а требования закона проверьте в муниципалитете.",
        },
      ],
      tips: [
        "Смотрите построенные объекты, а не только визуализации.",
        "Договоритесь о цене по стадиям и количестве правок.",
        "С самого начала честно назовите бюджет.",
        "Подключите архитектора до покупки участка или объекта под реконструкцию.",
      ],
    },
  },
  "gradjevinarstvo": {
    me: {
      description:
        "Građevinska firma ili izvođač radi izgradnju kuća i objekata, grube radove, temelje, zidanje, betoniranje, krovove, dogradnje i rekonstrukcije, često uz organizovanje ostalih majstora. Na primorju se mnogo gradi i renovira van turističke sezone, pa se dobri izvođači rano bukiraju, a na sjeveru vrijeme ograničava radove zimi. Prije početka provjeri sa arhitektom i opštinom koja je dokumentacija potrebna, i sve dogovore sa izvođačem stavi na papir.",
      faq: [
        {
          q: "Šta treba da imam prije nego pozovem izvođača?",
          a: "Idealno projekat ili bar jasne skice i opis radova, da bi ponude mogle da se uporede. Koje dozvole ili prijave trebaju za tvoj objekat provjeri kod projektanta i opštine.",
        },
        {
          q: "Kako da uporedim ponude?",
          a: "Traži ponude sa predmjerom, po stavkama, sa istim obimom i materijalima. Najniža ukupna cijena ne znači mnogo ako nešto nije uključeno.",
        },
        {
          q: "Šta utiče na cijenu gradnje?",
          a: "Obim i vrsta radova, pristup gradilištu, teren, izbor materijala, rokovi i sezona. Na strmim ili teško dostupnim lokacijama transport i mehanizacija dodatno podižu troškove.",
        },
        {
          q: "Kako se obično plaća?",
          a: "Često u fazama, prema završenim radovima, uz eventualni avans. Izbjegavaj da platiš veliki dio unaprijed i sve uslove zapiši u ugovor.",
        },
        {
          q: "Da li izvođač daje garanciju?",
          a: "To treba jasno dogovoriti ugovorom, zajedno sa rokovima i odgovornošću za nedostatke. Pitaj i ko vodi nadzor nad radovima.",
        },
      ],
      tips: [
        "Obiđi objekte koje je izvođač ranije završio i porazgovaraj sa investitorima.",
        "Potpiši ugovor sa rokovima, cijenama po stavkama i dinamikom plaćanja.",
        "Planiraj rezervu u budžetu za nepredviđene radove.",
        "Vodi fotografski dnevnik gradnje, posebno instalacija prije zatvaranja zidova.",
      ],
    },
    en: {
      description:
        "A construction company or contractor builds houses and other buildings, handling foundations, structural work, masonry, concrete, roofs, extensions and renovations, often coordinating other trades as well. Much building and renovation on the coast happens outside the tourist season, so good contractors get booked early, while winter weather limits work in the north. Check with your architect and the municipality which documents your project needs, and get every agreement with the builder in writing.",
      faq: [
        {
          q: "What do I need before contacting a builder?",
          a: "Ideally a project design, or at least clear drawings and a description of works, so quotes can be compared. Confirm the required permits with your designer and the municipality.",
        },
        {
          q: "How do I compare quotes?",
          a: "Ask for itemised quotes (predmjer) with the same scope and materials. A low total means little if key items are missing.",
        },
        {
          q: "What affects the cost?",
          a: "The scope, site access, terrain, materials, deadlines and season. Steep or hard-to-reach plots add transport and machinery costs.",
        },
        {
          q: "How can I oversee the build from abroad?",
          a: "Many foreign owners hire an independent site supervisor and ask for regular photo and video updates. Pay in stages tied to completed work.",
        },
        {
          q: "Is there a guarantee on the work?",
          a: "Put guarantees, deadlines and responsibility for defects into the contract. Ask who supervises the works on site.",
        },
      ],
      tips: [
        "Visit buildings the contractor has finished and talk to their clients.",
        "Sign a contract with itemised prices, deadlines and a payment schedule.",
        "Keep a contingency in your budget for surprises.",
        "Photograph wiring and pipes before walls are closed.",
      ],
    },
    ru: {
      description:
        "Строительная компания или подрядчик строит дома и другие объекты: фундаменты, каркас, кладку, бетонные работы, кровлю, пристройки и реконструкции, часто координируя и других мастеров. На побережье много строят и ремонтируют вне туристического сезона, поэтому хороших подрядчиков бронируют заранее, а на севере зимой работы ограничивает погода. Какая документация нужна для вашего проекта, уточните у архитектора и в муниципалитете, а все договорённости с подрядчиком фиксируйте письменно.",
      faq: [
        {
          q: "Что нужно подготовить до обращения к подрядчику?",
          a: "Желательно проект или хотя бы понятные чертежи и описание работ, чтобы предложения можно было сравнить. Нужные разрешения уточните у проектировщика и в муниципалитете.",
        },
        {
          q: "Как сравнивать предложения?",
          a: "Просите смету по позициям (predmjer) с одинаковым объёмом и материалами. Низкая итоговая сумма мало что значит, если что-то не включено.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От объёма работ, подъезда к участку, рельефа, материалов, сроков и сезона. Крутые или труднодоступные участки удорожают доставку и технику.",
        },
        {
          q: "Как контролировать стройку из-за границы?",
          a: "Многие владельцы нанимают независимого технадзора и просят регулярные фото- и видеоотчёты. Платите поэтапно, по факту выполненных работ.",
        },
        {
          q: "Есть ли гарантия на работы?",
          a: "Гарантию, сроки и ответственность за недостатки пропишите в договоре. Уточните, кто ведёт надзор на объекте.",
        },
      ],
      tips: [
        "Посмотрите завершённые объекты подрядчика и поговорите с заказчиками.",
        "Заключите договор с ценами по позициям, сроками и графиком платежей.",
        "Заложите в бюджет резерв на непредвиденные работы.",
        "Фотографируйте проводку и трубы до закрытия стен.",
      ],
    },
  },
  "geodeta": {
    me: {
      description:
        "Geodeta mjeri teren i objekte i izrađuje geodetske podloge i elaborate: snimanje parcele za projektovanje, obilježavanje granica, iskolčavanje objekta prije gradnje, snimak izvedenog stanja, parcelacije i podatke za upis u katastar. Treba ti kad kupuješ plac, planiraš gradnju, imaš spor sa komšijom oko međe ili želiš da uskladiš stanje na terenu sa katastrom. Koji elaborat ti je potreban i kako ide dalji postupak u katastru, provjeri sa geodetom i nadležnom službom.",
      faq: [
        {
          q: "Kada mi treba geodeta prije kupovine placa?",
          a: "Korisno je prije kupovine provjeriti da li se granice na terenu slažu sa katastarskim planom. Tako izbjegavaš iznenađenja oko površine ili pristupa.",
        },
        {
          q: "Šta da pripremim?",
          a: "List nepokretnosti, broj katastarske parcele, kopiju plana ako je imaš i kontakt za pristup terenu. Ako je u pitanju objekat, i projekat ili ranije snimke.",
        },
        {
          q: "Koliko traje posao?",
          a: "Snimanje na terenu često je završeno brzo, ali izrada elaborata i postupak u katastru mogu trajati duže. Pitaj geodetu za realan rok za tvoj slučaj.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Vrsta posla, veličina i konfiguracija terena, gustina rastinja, broj tačaka i da li je potrebno predavanje elaborata katastru. Strm ili zarastao teren traži više vremena.",
        },
        {
          q: "Da li geodeta može riješiti spor oko međe?",
          a: "Geodeta može precizno pokazati gdje su granice po katastru, što često pomogne dogovoru. Ako spor ostane, pravni dio rješava se uz advokata ili pred nadležnim organom.",
        },
      ],
      tips: [
        "Angažuj geodetu prije kupovine zemljišta, a ne poslije.",
        "Pošalji broj parcele i opštinu da geodeta unaprijed provjeri podatke.",
        "Pozovi komšije na obilježavanje međe ako je granica sporna.",
        "Pitaj da li cijena uključuje predaju elaborata katastru.",
      ],
    },
    en: {
      description:
        "A land surveyor measures land and buildings and prepares survey plans and reports: site surveys for design, marking boundaries, setting out a building before construction, as-built surveys, plot subdivisions and data for the land registry (katastar). You need one when buying land, planning to build, disagreeing with a neighbour over a boundary, or trying to make the registry match what's actually on the ground. Which survey you need and how the registry procedure works is best confirmed with the surveyor and the cadastre office.",
      faq: [
        {
          q: "Should I get a survey before buying land?",
          a: "It's wise to check that the boundaries on the ground match the cadastral plan before you pay. It avoids surprises about area or access.",
        },
        {
          q: "What do I need to provide?",
          a: "The title deed, cadastral parcel number, any plans you have and someone to give access to the site. For buildings, the design or earlier surveys too.",
        },
        {
          q: "How long does it take?",
          a: "Fieldwork is often quick, but the report and any registry procedure can take longer. Ask the surveyor for a realistic timeline.",
        },
        {
          q: "What affects the price?",
          a: "The type of job, size and shape of the land, vegetation, number of points and whether the report is filed with the cadastre. Steep or overgrown terrain takes longer.",
        },
        {
          q: "Can a surveyor settle a boundary dispute?",
          a: "They can show precisely where the registered boundary is, which often helps neighbours agree. If the dispute continues, the legal side needs a lawyer or the competent authority.",
        },
      ],
      tips: [
        "Hire a surveyor before buying land, not after.",
        "Send the parcel number and municipality so they can check records first.",
        "Invite neighbours when boundaries are marked if the line is disputed.",
        "Ask whether filing with the cadastre is included.",
      ],
    },
    ru: {
      description:
        "Геодезист проводит съёмку участков и зданий и готовит геодезические планы и отчёты: топосъёмку для проектирования, вынос границ, разбивку здания перед строительством, исполнительную съёмку, раздел участков и данные для кадастра. Он нужен при покупке земли, подготовке к стройке, споре с соседом о границе или когда фактическое состояние не совпадает с кадастром. Какой документ вам нужен и как проходит процедура в кадастре, уточните у геодезиста и в кадастровой службе.",
      faq: [
        {
          q: "Нужна ли съёмка до покупки участка?",
          a: "Разумно проверить, совпадают ли границы на местности с кадастровым планом, до оплаты. Это избавит от сюрпризов с площадью и подъездом.",
        },
        {
          q: "Что нужно предоставить?",
          a: "Выписку из кадастра, номер кадастровой парцеллы, имеющиеся планы и возможность доступа на участок. Для зданий — проект или прежние съёмки.",
        },
        {
          q: "Сколько времени занимает работа?",
          a: "Полевые работы часто проходят быстро, но подготовка документов и процедура в кадастре могут занять дольше. Спросите у геодезиста реальный срок.",
        },
        {
          q: "От чего зависит цена?",
          a: "От вида работ, размера и формы участка, растительности, количества точек и подачи документов в кадастр. Крутой или заросший участок требует больше времени.",
        },
        {
          q: "Может ли геодезист решить спор о границе?",
          a: "Он точно покажет, где проходит граница по кадастру, и это часто помогает договориться. Если спор остаётся, юридическую часть решают с адвокатом или в компетентном органе.",
        },
      ],
      tips: [
        "Приглашайте геодезиста до покупки земли, а не после.",
        "Отправьте номер парцеллы и муниципалитет для предварительной проверки.",
        "Если граница спорная, пригласите соседей на вынос границ.",
        "Уточните, входит ли в цену подача документов в кадастр.",
      ],
    },
  },
  "upravnik-zgrade": {
    me: {
      description:
        "Upravnik zgrade ili profesionalna firma za upravljanje brine o zajedničkim djelovima zgrade: čišćenju ulaza, liftu, krovu, fasadi, rasvjeti, osiguranju, prikupljanju sredstava za održavanje i organizovanju majstora kad nešto zakaže. Posebno je koristan u novim zgradama na primorju gdje mnogi vlasnici žive u inostranstvu ili stanove izdaju turistima. Kako se upravnik bira i koja su prava i obaveze etažnih vlasnika, provjeri u važećim propisima i sa opštinom.",
      faq: [
        {
          q: "Šta tačno radi upravnik zgrade?",
          a: "Obično organizuje redovno održavanje i popravke zajedničkih djelova, vodi evidenciju troškova i komunicira sa vlasnicima. Tačan obim posla treba da piše u ugovoru.",
        },
        {
          q: "Kako se upravnik bira?",
          a: "Najčešće ga biraju etažni vlasnici na zajedničkom sastanku, prema pravilima koja važe za stambene zgrade. Postupak i potrebnu većinu provjeri u propisima ili kod opštine.",
        },
        {
          q: "Šta utiče na cijenu upravljanja?",
          a: "Veličina zgrade, broj stanova, lift, garaža, bazen ili zelene površine i koliko često se radi čišćenje i obilazak. Traži ponudu sa jasnim spiskom usluga.",
        },
        {
          q: "Da li upravnik reaguje na hitne kvarove?",
          a: "Dobar upravnik ima dogovorene majstore i kontakt za hitne slučajeve, poput curenja ili zaglavljenog lifta. Pitaj kako je organizovano dežurstvo.",
        },
        {
          q: "Kako vlasnici prate troškove?",
          a: "Traži redovne izvještaje o prihodima i rashodima i uvid u račune. Mnogi upravnici šalju izvještaje mejlom ili ih objavljuju u zajedničkoj grupi.",
        },
      ],
      tips: [
        "Traži ugovor sa preciznim spiskom usluga i rokovima reagovanja.",
        "Dogovori redovne pisane izvještaje o potrošnji sredstava.",
        "Pitaj za reference iz zgrada slične veličine.",
        "Provjeri kako upravnik komunicira sa vlasnicima koji žive u inostranstvu.",
      ],
    },
    en: {
      description:
        "A building manager or property management firm looks after a building's shared parts: cleaning the entrance, the lift, roof, facade, lighting, insurance, collecting maintenance contributions and calling in repairers when something breaks. It is especially useful in newer coastal buildings where many owners live abroad or rent their flats to tourists. How a manager is appointed and what owners' rights and duties are is set by regulations, so confirm the details with the municipality or a legal adviser.",
      faq: [
        {
          q: "What does a building manager actually do?",
          a: "Usually organises routine maintenance and repairs of common areas, keeps track of costs and communicates with owners. The exact scope should be written into the contract.",
        },
        {
          q: "I live abroad. How do I stay informed?",
          a: "Ask for regular reports by email and a group chat or portal for owners. A good manager can also coordinate access for repairs while you are away.",
        },
        {
          q: "What affects the cost?",
          a: "The building size, number of units, lift, garage, pool or gardens and how often cleaning and inspections happen. Ask for a quote with a clear list of services.",
        },
        {
          q: "Who handles emergencies like leaks or a stuck lift?",
          a: "A good manager has repairers on call and an emergency contact. Ask how out-of-hours issues are handled.",
        },
        {
          q: "How is the manager chosen?",
          a: "Usually by the owners at a joint meeting, following the rules for residential buildings. Check the procedure and required majority with the municipality.",
        },
      ],
      tips: [
        "Get a contract listing every service and response times.",
        "Agree on regular written reports on how money is spent.",
        "Ask for references from buildings of a similar size.",
        "Check the manager can communicate in the owners' languages.",
      ],
    },
    ru: {
      description:
        "Управляющий домом или управляющая компания отвечает за общие части здания: уборку подъезда, лифт, крышу, фасад, освещение, страховку, сбор взносов на обслуживание и вызов мастеров при поломках. Это особенно полезно в новых домах на побережье, где многие владельцы живут за границей или сдают квартиры туристам. Порядок выбора управляющего и права и обязанности собственников определяются правилами, поэтому детали уточняйте в муниципалитете или у юриста.",
      faq: [
        {
          q: "Чем занимается управляющий домом?",
          a: "Обычно организует обслуживание и ремонт общих частей, ведёт учёт расходов и общается с собственниками. Точный объём работ должен быть прописан в договоре.",
        },
        {
          q: "Я живу за границей. Как быть в курсе?",
          a: "Попросите регулярные отчёты по почте и общий чат или портал для собственников. Хороший управляющий также организует доступ мастеров в ваше отсутствие.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От размера дома, количества квартир, наличия лифта, гаража, бассейна или сада и частоты уборки и обходов. Попросите предложение с перечнем услуг.",
        },
        {
          q: "Кто решает аварийные ситуации?",
          a: "У хорошего управляющего есть мастера на связи и аварийный контакт. Уточните, как решаются проблемы в нерабочее время.",
        },
        {
          q: "Как выбирают управляющего?",
          a: "Обычно на общем собрании собственников по правилам для жилых домов. Порядок и нужное большинство уточните в муниципалитете.",
        },
      ],
      tips: [
        "Требуйте договор со списком услуг и сроками реагирования.",
        "Договоритесь о регулярных письменных отчётах о расходах.",
        "Попросите рекомендации из домов похожего размера.",
        "Проверьте, может ли управляющий общаться на языках собственников.",
      ],
    },
  },
  "fizicko-obezbjedjenje": {
    me: {
      description:
        "Fizičko obezbjeđenje podrazumijeva čuvare za objekte, gradilišta, prodavnice, hotele i skladišta, kao i obezbjeđenje događaja, koncerata, svadbi i klubova. Na primorju je potražnja najveća ljeti, kada rade restorani, beach barovi i festivali, pa se angažman za sezonu dogovara unaprijed. Agencije za obezbjeđenje moraju ispunjavati propisane uslove, pa od agencije traži potvrdu da posluje u skladu sa propisima i da su čuvari osposobljeni.",
      faq: [
        {
          q: "Za koje događaje se najčešće angažuje obezbjeđenje?",
          a: "Svadbe, koncerte, otvaranja, sportske događaje i večeri u klubovima, ali i privatne proslave sa većim brojem gostiju. Da li je za tvoj događaj obezbjeđenje obavezno, provjeri kod organa koji izdaje odobrenje.",
        },
        {
          q: "Mogu li angažovati čuvara samo na nekoliko sati?",
          a: "Mnoge agencije rade i kratke angažmane, ali neke imaju minimalno trajanje smjene. Pitaj unaprijed.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj čuvara, trajanje i doba angažmana, vrsta objekta ili događaja, nivo rizika i da li je potrebna dodatna oprema ili video nadzor. Noćni rad i praznici obično se naplaćuju drugačije.",
        },
        {
          q: "Šta da provjerim kod agencije?",
          a: "Da li posluje u skladu sa propisima, da li ima osiguranje od odgovornosti i kako se biraju i obučavaju čuvari. Traži i reference sa sličnih objekata ili događaja.",
        },
        {
          q: "Kako se dogovaraju zadaci čuvara?",
          a: "Najbolje pisanim uputstvom: gdje stoji, šta kontroliše, kome se javlja i kako postupa u incidentu. Jasna pravila smanjuju nesporazume sa gostima.",
        },
      ],
      tips: [
        "Za ljetnju sezonu i velike događaje dogovori obezbjeđenje nekoliko sedmica ranije.",
        "Traži pisani ugovor sa brojem ljudi, satnicom i odgovornošću.",
        "Unaprijed objasni čuvarima pravila ulaza, liste gostiju i kontakt osobu.",
        "Pitaj da li agencija ima rezervne ljude ako neko otkaže.",
      ],
    },
    en: {
      description:
        "Security services supply guards for buildings, construction sites, shops, hotels and warehouses, as well as security for events, concerts, weddings and clubs. On the coast demand peaks in summer, when restaurants, beach bars and festivals are busy, so seasonal cover is best agreed in advance. Security companies must meet regulatory requirements, so ask the agency to confirm it operates in line with the rules and that its guards are properly trained.",
      faq: [
        {
          q: "Do I need security for a private event?",
          a: "For larger gatherings it is often sensible, and for some public events it may be required. Check with the authority that approves your event.",
        },
        {
          q: "Can I hire a guard for just a few hours?",
          a: "Many agencies do short bookings, but some have a minimum shift length. Ask when you enquire.",
        },
        {
          q: "What affects the price?",
          a: "Number of guards, hours and time of day, the type of site or event, risk level and any equipment or CCTV. Nights and holidays are often priced differently.",
        },
        {
          q: "What should I check with the agency?",
          a: "That it operates within the regulations, holds liability insurance and trains its staff. Ask for references from similar sites or events.",
        },
        {
          q: "Do the guards speak English?",
          a: "Some do, which matters for venues with foreign guests. Ask the agency to assign English-speaking staff if you need it.",
        },
      ],
      tips: [
        "Book security for summer or big events several weeks ahead.",
        "Get a written contract covering headcount, hours and liability.",
        "Brief guards on entry rules, guest lists and your contact person.",
        "Ask whether the agency has backup staff if someone cancels.",
      ],
    },
    ru: {
      description:
        "Физическая охрана — это охранники для зданий, стройплощадок, магазинов, отелей и складов, а также охрана мероприятий, концертов, свадеб и клубов. На побережье спрос максимален летом, когда работают рестораны, пляжные бары и фестивали, поэтому охрану на сезон лучше согласовать заранее. Охранные агентства должны соответствовать установленным требованиям, поэтому попросите подтверждение, что агентство работает по правилам, а сотрудники обучены.",
      faq: [
        {
          q: "Нужна ли охрана на частное мероприятие?",
          a: "Для больших праздников это часто разумно, а для некоторых публичных мероприятий может быть обязательно. Уточните в органе, который согласовывает мероприятие.",
        },
        {
          q: "Можно ли нанять охранника на несколько часов?",
          a: "Многие агентства берут короткие заказы, но у некоторых есть минимальная длительность смены. Уточните заранее.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества охранников, продолжительности и времени суток, типа объекта или события, уровня риска и оборудования. Ночи и праздники обычно оплачиваются иначе.",
        },
        {
          q: "Что проверить у агентства?",
          a: "Работает ли оно в соответствии с правилами, есть ли страхование ответственности и как обучают сотрудников. Попросите рекомендации с похожих объектов.",
        },
        {
          q: "Говорят ли охранники на иностранных языках?",
          a: "Некоторые говорят, что важно для заведений с иностранными гостями. Попросите агентство направить сотрудников с нужным языком.",
        },
      ],
      tips: [
        "Бронируйте охрану на лето и крупные события за несколько недель.",
        "Заключите договор с числом охранников, графиком и ответственностью.",
        "Заранее объясните правила входа, списки гостей и контактное лицо.",
        "Уточните, есть ли у агентства замена на случай отмены.",
      ],
    },
  },
  "zastita-na-radu": {
    me: {
      description:
        "Stručnjaci za zaštitu na radu pomažu firmama da procijene rizike na radnim mjestima, pripreme potrebne akte, obuče zaposlene za bezbjedan rad, organizuju preglede opreme i instalacija i vode evidencije. Usluga je važna za gradilišta, radionice, ugostiteljstvo, hotele i skladišta, a često se ugovara spolja umjesto zapošljavanja stručnog lica. Koje obaveze tvoja firma ima zavisi od djelatnosti i broja zaposlenih, pa to potvrdi sa ovlašćenim pružaocem ili inspekcijom rada.",
      faq: [
        {
          q: "Da li mala firma treba nekoga za zaštitu na radu?",
          a: "Obaveze postoje i za male poslodavce, ali njihov obim zavisi od djelatnosti i rizika. Ovlašćeni pružalac ili inspekcija rada će ti reći šta tačno važi za tebe.",
        },
        {
          q: "Šta obično obuhvata usluga?",
          a: "Najčešće procjenu rizika, izradu internih akata, obuku zaposlenih, organizovanje periodičnih pregleda opreme i vođenje evidencija. Pitaj šta je uključeno u paket, a šta se plaća posebno.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj zaposlenih i radnih mjesta, vrsta djelatnosti, broj lokacija i da li je u pitanju jednokratni posao ili stalna saradnja. Gradilišta i proizvodnja obično traže više posla od kancelarije.",
        },
        {
          q: "Da li obuka može za sezonske radnike?",
          a: "Da, mnogi pružaoci organizuju obuke prije sezone za nove radnike u ugostiteljstvu i hotelima. Dogovori termin na vrijeme, jer je pred ljeto gužva.",
        },
        {
          q: "Šta da pripremim?",
          a: "Spisak radnih mjesta i zaposlenih, opis poslova, spisak opreme i mašina i postojeću dokumentaciju ako je imaš. Pružalac će obići objekat.",
        },
      ],
      tips: [
        "Provjeri da pružalac ima ovlašćenja potrebna za poslove koje nudi.",
        "Dogovori obuke novih radnika prije početka sezone.",
        "Čuvaj sve zapisnike i evidencije na jednom mjestu, spremne za kontrolu.",
        "Traži da ti se objasne obaveze jednostavnim jezikom, ne samo papiri.",
      ],
    },
    en: {
      description:
        "Health and safety specialists help businesses assess workplace risks, prepare the required internal documents, train staff to work safely, organise inspections of equipment and installations and keep records. The service matters for construction sites, workshops, restaurants, hotels and warehouses, and is often outsourced instead of hiring an in-house officer. What your business must do depends on its activity and number of employees, so confirm it with an authorised provider or the labour inspectorate.",
      faq: [
        {
          q: "Does a small business need health and safety services?",
          a: "Small employers have obligations too, but how many depends on the activity and risks. An authorised provider or the labour inspectorate can tell you what applies.",
        },
        {
          q: "What does the service usually include?",
          a: "Typically a risk assessment, internal rules, staff training, periodic equipment inspections and record-keeping. Ask what's in the package and what's extra.",
        },
        {
          q: "What affects the cost?",
          a: "Number of staff and job roles, the type of work, number of sites and whether it's one-off or ongoing. Construction and production usually need more work than an office.",
        },
        {
          q: "Can training be done in English for foreign staff?",
          a: "Some providers offer it; languages are listed on profiles. Staff need to genuinely understand the training, so ask before booking.",
        },
        {
          q: "What should I prepare?",
          a: "A list of roles and employees, job descriptions, equipment and machinery, and any existing documents. The provider will usually visit the premises.",
        },
      ],
      tips: [
        "Check the provider holds the authorisations required for the work.",
        "Schedule training for new staff before the season starts.",
        "Keep all records together, ready for an inspection.",
        "Ask for obligations explained in plain language, not just paperwork.",
      ],
    },
    ru: {
      description:
        "Специалисты по охране труда помогают компаниям оценить риски на рабочих местах, подготовить нужные внутренние документы, обучить сотрудников безопасной работе, организовать проверки оборудования и установок и вести учёт. Услуга важна для стройплощадок, мастерских, ресторанов, отелей и складов и часто передаётся на аутсорсинг вместо найма штатного специалиста. Обязанности вашей компании зависят от вида деятельности и числа работников, поэтому уточняйте их у уполномоченного исполнителя или в трудовой инспекции.",
      faq: [
        {
          q: "Нужна ли охрана труда небольшой фирме?",
          a: "Обязанности есть и у малых работодателей, но их объём зависит от деятельности и рисков. Уполномоченный исполнитель или трудовая инспекция подскажут, что относится к вам.",
        },
        {
          q: "Что обычно входит в услугу?",
          a: "Как правило, оценка рисков, внутренние правила, обучение персонала, периодические проверки оборудования и ведение документации. Уточните, что входит в пакет.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От числа сотрудников и должностей, вида работ, количества объектов и разовой или постоянной работы. Стройка и производство требуют больше работы, чем офис.",
        },
        {
          q: "Можно ли провести обучение на другом языке?",
          a: "Некоторые исполнители это делают, языки указаны в профилях. Сотрудники должны действительно понимать инструктаж, так что уточните заранее.",
        },
        {
          q: "Что подготовить?",
          a: "Список должностей и сотрудников, описание работ, перечень оборудования и имеющиеся документы. Обычно специалист осматривает объект.",
        },
      ],
      tips: [
        "Проверьте, есть ли у исполнителя нужные полномочия.",
        "Планируйте обучение новых сотрудников до начала сезона.",
        "Храните все журналы и протоколы в одном месте на случай проверки.",
        "Просите объяснять обязанности простым языком, а не только выдавать бумаги.",
      ],
    },
  },
  "stamparija": {
    me: {
      description:
        "Štamparija štampa vizit karte, flajere, plakate, brošure, menije za restorane, kataloge, kalendare, etikete, pozivnice i ambalažu, a mnoge rade i velike formate, bannere i naljepnice za vozila i izloge. Pred turističku sezonu restorani, apartmani i agencije masovno naručuju menije i promo materijal, pa rokovi tada znaju da se produže. Najbolje rezultate dobijaš kad pošalješ pripremljen fajl u traženom formatu i prije velikog tiraža odobriš probni otisak.",
      faq: [
        {
          q: "U kom formatu da pošaljem fajl?",
          a: "Većina štamparija traži PDF u visokoj rezoluciji, sa bojama u CMYK-u i dodatkom za sječenje. Pitaj njihove tačne tehničke zahtjeve prije slanja.",
        },
        {
          q: "Da li štamparija može da uradi i dizajn?",
          a: "Mnoge imaju dizajnera koji može pripremiti ili doraditi fajl, obično uz doplatu. Provjeri na profilu da li nude pripremu za štampu.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Tiraž, format, vrsta i gramatura papira, broj boja, dorada poput plastifikacije, lakiranja ili savijanja i rok izrade. Veći tiraž obično znači nižu cijenu po komadu.",
        },
        {
          q: "Koliko traje izrada?",
          a: "Jednostavne stvari poput vizit karata često su brzo gotove, a brošure i posebne dorade traju duže. Pred sezonu i praznike računaj na gužvu.",
        },
        {
          q: "Zašto boje na papiru izgledaju drugačije nego na ekranu?",
          a: "Ekran prikazuje boje drugačije od štampe, a razlika zavisi i od papira. Ako su ti boje bitne, traži probni otisak.",
        },
      ],
      tips: [
        "Traži probni otisak prije velikog tiraža.",
        "Provjeri pravopis, brojeve telefona i cijene još jednom prije slanja.",
        "Naruči menije i promo materijal prije početka sezone.",
        "Pitaj da li cijena uključuje pripremu fajla i dostavu.",
      ],
    },
    en: {
      description:
        "A print shop produces business cards, flyers, posters, brochures, restaurant menus, catalogues, calendars, labels, invitations and packaging, and many also do large-format banners and vinyl stickers for cars and shop windows. Before the tourist season, restaurants, rentals and agencies all order menus and promo materials, so turnaround times can stretch. You'll get the best result by sending a print-ready file in the requested format and approving a proof before a large run.",
      faq: [
        {
          q: "What file format do they need?",
          a: "Most want a high-resolution PDF with CMYK colours and bleed for trimming. Ask for their exact specs before you send.",
        },
        {
          q: "Can they design it for me?",
          a: "Many have an in-house designer who can prepare or fix your file, usually for an extra fee. Check the profile for prepress or design services.",
        },
        {
          q: "What affects the price?",
          a: "Quantity, size, paper type and weight, number of colours, finishing such as lamination or folding, and the deadline. Larger runs usually lower the price per piece.",
        },
        {
          q: "Can they print menus in several languages?",
          a: "Yes, but you need to supply checked translations. Multilingual menus are common on the coast, so plan the layout with enough space.",
        },
        {
          q: "Why do colours look different from my screen?",
          a: "Screens and print display colour differently, and paper affects it too. If colour matters, ask for a proof.",
        },
      ],
      tips: [
        "Ask for a proof before a large print run.",
        "Double-check spelling, phone numbers and prices before sending.",
        "Order menus and promo materials before the season rush.",
        "Ask whether file preparation and delivery are included.",
      ],
    },
    ru: {
      description:
        "Типография печатает визитки, флаеры, плакаты, брошюры, меню для ресторанов, каталоги, календари, этикетки, приглашения и упаковку, а многие также делают широкоформатную печать, баннеры и плёнку для машин и витрин. Перед туристическим сезоном рестораны, апартаменты и агентства массово заказывают меню и рекламу, поэтому сроки могут увеличиваться. Лучший результат будет, если отправить готовый к печати файл в нужном формате и утвердить пробный оттиск перед большим тиражом.",
      faq: [
        {
          q: "В каком формате отправлять файл?",
          a: "Обычно нужен PDF высокого разрешения в CMYK с вылетами под обрез. Уточните технические требования типографии заранее.",
        },
        {
          q: "Могут ли сделать дизайн?",
          a: "Во многих типографиях есть дизайнер, который подготовит или доработает макет, обычно за доплату. Проверьте в профиле, есть ли допечатная подготовка.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От тиража, формата, типа и плотности бумаги, количества цветов, постобработки вроде ламинации или фальцовки и срока. Чем больше тираж, тем обычно дешевле экземпляр.",
        },
        {
          q: "Можно ли напечатать меню на нескольких языках?",
          a: "Да, но переводы нужно предоставить проверенными. На побережье многоязычные меню обычны, заранее продумайте место на макете.",
        },
        {
          q: "Почему цвета отличаются от экрана?",
          a: "Экран и печать передают цвет по-разному, влияет и бумага. Если цвет важен, попросите пробный оттиск.",
        },
      ],
      tips: [
        "Попросите пробный оттиск перед большим тиражом.",
        "Ещё раз проверьте орфографию, телефоны и цены перед отправкой.",
        "Заказывайте меню и рекламу до сезонного ажиотажа.",
        "Уточните, входит ли в цену подготовка макета и доставка.",
      ],
    },
  },
  "3d-stampa": {
    me: {
      description:
        "3D štampa pravi fizičke predmete iz digitalnog modela: prototipove, rezervne djelove koji se više ne mogu kupiti, kućišta za elektroniku, makete za arhitekte, figure, poklone i predmete po mjeri. Korisna je inženjerima, dizajnerima, studentima, ali i svakome kome je pukao plastični dio na aparatu ili u autu. Ako nemaš 3D model, mnogi pružaoci ga mogu nacrtati prema uzorku ili skici, a od materijala zavisi koliko će predmet biti čvrst i otporan na toplotu.",
      faq: [
        {
          q: "Šta mi treba da bih naručio 3D štampu?",
          a: "Idealno 3D model u formatu poput STL ili STEP. Ako ga nemaš, pošalji fotografije, mjere ili sam predmet, pa pitaj da li pružalac radi modelovanje.",
        },
        {
          q: "Koji materijal da izaberem?",
          a: "Zavisi od namjene: za dekor i makete često je dovoljna obična plastika, a za djelove koji trpe opterećenje, toplotu ili sunce treba otporniji materijal. Opiši pružaocu gdje će se predmet koristiti.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina i količina materijala, vrsta materijala, preciznost, vrijeme štampe, potreba za modelovanjem i dorada poput brušenja ili farbanja. Broj komada takođe utiče.",
        },
        {
          q: "Koliko traje izrada?",
          a: "Mali predmeti mogu biti gotovi brzo, a veći ili precizniji traju duže, uz vrijeme za modelovanje i doradu. Pružalac će ti dati rok kad vidi model.",
        },
        {
          q: "Može li se odštampati rezervni dio za aparat?",
          a: "Često može, ako se dio precizno izmjeri ili ima original. Za djelove izložene visokoj temperaturi ili sigurnosno važne djelove pitaj stručnjaka da li je štampa odgovarajuće rješenje.",
        },
      ],
      tips: [
        "Pošalji tačne mjere i fotografije sa lenjirom pored predmeta.",
        "Reci gdje će se predmet koristiti, da pružalac predloži materijal.",
        "Za seriju prvo naruči jedan probni komad.",
        "Pitaj da li model ostaje tvoj ako ga pružalac crta.",
      ],
    },
    en: {
      description:
        "3D printing turns a digital model into a physical object: prototypes, replacement parts you can no longer buy, electronics enclosures, architectural models, figurines, gifts and custom items. It's handy for engineers, designers and students, but also for anyone with a broken plastic part on an appliance or car. If you don't have a 3D model, many providers can create one from a sample or sketch, and the material you choose decides how strong and heat-resistant the part will be.",
      faq: [
        {
          q: "What do I need to order a print?",
          a: "Ideally a 3D file such as STL or STEP. If you don't have one, send photos, measurements or the object itself and ask whether they do modelling.",
        },
        {
          q: "Which material should I choose?",
          a: "It depends on use: basic plastic is often fine for decor and models, while parts under load, heat or strong sun need tougher materials. Tell the provider where the part will be used.",
        },
        {
          q: "What affects the cost?",
          a: "Size and amount of material, the material type, precision, print time, modelling work and finishing like sanding or painting. Quantity matters too.",
        },
        {
          q: "How long does it take?",
          a: "Small items can be quick; larger or high-detail parts take longer, plus time for modelling and finishing. The provider can give a deadline once they see the model.",
        },
        {
          q: "Will a printed part survive a hot car in summer?",
          a: "Some common plastics soften in heat, so parts for cars or outdoor use need a more heat-resistant material. Mention this up front.",
        },
      ],
      tips: [
        "Send exact measurements and photos with a ruler next to the part.",
        "Explain where the part will be used so the right material is chosen.",
        "Order one test piece before a batch.",
        "Ask who owns the 3D model if the provider designs it.",
      ],
    },
    ru: {
      description:
        "3D-печать превращает цифровую модель в реальный предмет: прототипы, запчасти, которые уже не продаются, корпуса для электроники, архитектурные макеты, фигурки, подарки и вещи на заказ. Это полезно инженерам, дизайнерам и студентам, а также всем, у кого сломалась пластиковая деталь в технике или машине. Если 3D-модели нет, многие исполнители создадут её по образцу или эскизу, а от материала зависит прочность и термостойкость детали.",
      faq: [
        {
          q: "Что нужно для заказа?",
          a: "В идеале 3D-файл, например STL или STEP. Если его нет, отправьте фото, размеры или сам предмет и спросите, занимается ли исполнитель моделированием.",
        },
        {
          q: "Какой материал выбрать?",
          a: "Зависит от назначения: для декора и макетов часто хватает обычного пластика, а для деталей под нагрузкой, в тепле или на солнце нужен более стойкий материал. Расскажите, где будет использоваться деталь.",
        },
        {
          q: "От чего зависит цена?",
          a: "От размера и расхода материала, его типа, точности, времени печати, моделирования и постобработки. Количество экземпляров тоже влияет.",
        },
        {
          q: "Сколько времени занимает изготовление?",
          a: "Мелкие предметы могут быть готовы быстро, крупные и точные — дольше, плюс время на моделирование и обработку. Срок назовут, увидев модель.",
        },
        {
          q: "Выдержит ли деталь жару в машине летом?",
          a: "Некоторые распространённые пластики размягчаются от тепла, поэтому для автомобиля или улицы нужен термостойкий материал. Скажите об этом сразу.",
        },
      ],
      tips: [
        "Отправьте точные размеры и фото детали рядом с линейкой.",
        "Опишите условия использования, чтобы подобрать материал.",
        "Перед партией закажите один пробный экземпляр.",
        "Уточните, кому принадлежит модель, если её создаёт исполнитель.",
      ],
    },
  },
  "cnc-usluge": {
    me: {
      description:
        "CNC usluge obuhvataju računarski upravljano glodanje, struganje, rezanje i graviranje metala, drveta, plastike, pleksiglasa i kompozita. Radi se izrada mašinskih djelova, rezervnih djelova, kalupa, natpisa, reklamnih slova, ukrasnih panela, namještaja i dijelova za brodove i plovila. Za precizan posao pružaocu treba tehnički crtež ili vektorski fajl sa mjerama i tolerancijama, a ako ga nemaš, pitaj da li može da ga napravi prema uzorku.",
      faq: [
        {
          q: "Koji fajl treba da pošaljem?",
          a: "Za 2D rezanje i graviranje obično vektorski fajl poput DXF ili SVG, a za 3D obradu model u STEP ili sličnom formatu. Uz fajl navedi materijal, debljinu i količinu.",
        },
        {
          q: "Da li mogu da donesem svoj materijal?",
          a: "Neki pružaoci prihvataju materijal klijenta, a neki rade samo sa svojim zbog kvaliteta i odgovornosti. Pitaj unaprijed.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Materijal, složenost oblika, tražena preciznost, vrijeme mašine, broj komada, priprema programa i dorada. Serije su po komadu obično povoljnije od jednog primjerka.",
        },
        {
          q: "Da li se može napraviti dio samo po uzorku?",
          a: "Često može, ako pružalac radi mjerenje i crtanje, ali je to dodatni posao. Donesi original ili što više dijelova ako se nešto slomilo.",
        },
        {
          q: "Koliko traje izrada?",
          a: "Zavisi od zauzetosti mašina, pripreme programa i količine. Za hitne poslove pitaj da li je moguć prioritet.",
        },
      ],
      tips: [
        "Navedi tolerancije i koje mjere su kritične, a koje nijesu.",
        "Za seriju prvo odobri jedan probni komad.",
        "Pitaj koji materijal preporučuje za primjenu na vlazi ili moru.",
        "Traži ponudu po komadu i za veće količine.",
      ],
    },
    en: {
      description:
        "CNC services cover computer-controlled milling, turning, cutting and engraving of metal, wood, plastics, acrylic and composites. Typical jobs include machine and replacement parts, moulds, signs, 3D letters, decorative panels, furniture components and parts for boats. For precise work the provider needs a technical drawing or vector file with dimensions and tolerances; if you don't have one, ask whether they can produce it from a sample.",
      faq: [
        {
          q: "What file should I send?",
          a: "For 2D cutting and engraving usually a vector file such as DXF or SVG; for 3D machining a STEP or similar model. Include the material, thickness and quantity.",
        },
        {
          q: "Can I supply my own material?",
          a: "Some shops accept customer material, others only use their own for quality and liability reasons. Ask first.",
        },
        {
          q: "What affects the price?",
          a: "Material, shape complexity, required precision, machine time, quantity, programming and finishing. Batches are usually cheaper per piece than a one-off.",
        },
        {
          q: "Can they copy a part from a sample?",
          a: "Often yes, if they offer measuring and drawing, but that's extra work. Bring the original or all the broken pieces.",
        },
        {
          q: "Which materials suit marine use?",
          a: "Salt water and sun are hard on many materials, so ask the provider to recommend corrosion- and UV-resistant options for boat parts.",
        },
      ],
      tips: [
        "State tolerances and which dimensions are critical.",
        "Approve one sample piece before a batch.",
        "Ask about materials suited to damp or seaside conditions.",
        "Request per-piece pricing for larger quantities too.",
      ],
    },
    ru: {
      description:
        "ЧПУ-обработка — это фрезеровка, токарные работы, резка и гравировка металла, дерева, пластика, оргстекла и композитов на станках с компьютерным управлением. Типичные заказы: детали машин и запчасти, формы, вывески, объёмные буквы, декоративные панели, элементы мебели и детали для лодок. Для точной работы нужен технический чертёж или векторный файл с размерами и допусками, а если его нет, спросите, может ли исполнитель сделать его по образцу.",
      faq: [
        {
          q: "Какой файл отправлять?",
          a: "Для 2D-резки и гравировки обычно векторный файл DXF или SVG, для 3D-обработки — модель STEP или аналог. Укажите материал, толщину и количество.",
        },
        {
          q: "Можно ли принести свой материал?",
          a: "Некоторые мастерские принимают материал клиента, другие работают только со своим из-за качества и ответственности. Уточните заранее.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От материала, сложности формы, точности, машинного времени, количества, программирования и доработки. Серия обычно дешевле за штуку, чем единичная деталь.",
        },
        {
          q: "Можно ли сделать деталь по образцу?",
          a: "Часто да, если исполнитель делает обмер и чертёж, но это дополнительная работа. Принесите оригинал или все обломки.",
        },
        {
          q: "Какие материалы подходят для моря?",
          a: "Солёная вода и солнце разрушают многие материалы, поэтому попросите порекомендовать коррозионно- и УФ-стойкие варианты для деталей лодки.",
        },
      ],
      tips: [
        "Укажите допуски и какие размеры критичны.",
        "Перед серией утвердите один пробный образец.",
        "Спросите о материалах для влажных и приморских условий.",
        "Запросите цену за штуку и для больших партий.",
      ],
    },
  },
  "hemijsko-ciscenje": {
    me: {
      description:
        "Hemijsko čišćenje čisti odjeću i tekstil koji se ne smiju prati u mašini: odijela, kapute, svečane i vjenčanice, kožu i krzno, zavjese, jorgane, prekrivače i posteljinu. Mnoge radionice nude i peglanje, sitne popravke i čišćenje tepiha. Iznajmljivači apartmana na primorju prije i poslije sezone često nose zavjese, jorgane i prekrivače, a u toj gužvi rokovi znaju biti duži. Pokaži mrlje na predaji i reci šta ih je izazvalo.",
      faq: [
        {
          q: "Koliko traje hemijsko čišćenje?",
          a: "Obična odjeća često je gotova za kratko vrijeme, a koža, krzno, vjenčanice i veliki komadi traju duže. Pitaj za rok pri predaji, posebno pred sezonu.",
        },
        {
          q: "Mogu li se ukloniti sve mrlje?",
          a: "Ne uvijek: stare, fiksirane mrlje i neki materijali ne mogu se potpuno očistiti. Što ranije doneseš odjeću i kažeš šta je mrlja, veće su šanse.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Vrsta i veličina komada, materijal, zaprljanost, posebne mrlje i hitnost. Koža, krzno i vjenčanice obično se naplaćuju posebno.",
        },
        {
          q: "Da li čistite zavjese i posteljinu za apartmane?",
          a: "Mnoge radionice rade veće količine tekstila i za iznajmljivače, a neke nude i preuzimanje i dostavu. Provjeri na profilu ili pitaj za redovnu saradnju.",
        },
        {
          q: "Ko odgovara ako se odjeća ošteti?",
          a: "Pitaj kako radionica postupa u slučaju oštećenja prije nego što predaš skupe komade. Sačuvaj priznanicu i etiketu sa uputstvom za održavanje.",
        },
      ],
      tips: [
        "Pokaži mrlje pri predaji i reci od čega su.",
        "Ne pokušavaj sam da skidaš mrlje hemikalijama prije čišćenja.",
        "Za vjenčanice i odijela za događaj ostavi dovoljno vremena.",
        "Iznajmljivači neka dogovore termine prije i poslije sezone na vrijeme.",
      ],
    },
    en: {
      description:
        "Dry cleaners handle clothes and textiles that can't go in the washing machine: suits, coats, evening and wedding dresses, leather and fur, curtains, duvets, throws and bedding. Many also offer pressing, small repairs and rug cleaning. Holiday-let owners on the coast bring in curtains, duvets and bedspreads before and after the season, so turnaround can be slower then. Point out stains when you drop things off and say what caused them.",
      faq: [
        {
          q: "How long does dry cleaning take?",
          a: "Everyday garments are often ready fairly quickly; leather, fur, wedding dresses and large items take longer. Ask about timing at drop-off, especially before the season.",
        },
        {
          q: "Can every stain be removed?",
          a: "Not always: old or set-in stains and certain fabrics may not come fully clean. Bringing items in early and naming the stain helps.",
        },
        {
          q: "What affects the price?",
          a: "Type and size of the item, fabric, how dirty it is, special stains and urgency. Leather, fur and wedding dresses are usually priced separately.",
        },
        {
          q: "Do they offer pickup and delivery?",
          a: "Some do, especially for larger orders like apartment linens. Check the profile or ask about regular arrangements.",
        },
        {
          q: "What if my garment gets damaged?",
          a: "Ask how the cleaner handles damage before handing over expensive pieces. Keep your receipt and the garment's care label.",
        },
      ],
      tips: [
        "Point out stains at drop-off and say what they are.",
        "Don't try chemical stain removers at home first.",
        "Leave plenty of time for wedding dresses and event outfits.",
        "Rental owners should book pre- and post-season cleaning early.",
      ],
    },
    ru: {
      description:
        "Химчистка чистит одежду и текстиль, которые нельзя стирать в машинке: костюмы, пальто, вечерние и свадебные платья, кожу и мех, шторы, одеяла, покрывала и постельное бельё. Многие также гладят, делают мелкий ремонт и чистят ковры. Владельцы апартаментов на побережье сдают шторы, одеяла и покрывала до и после сезона, поэтому в это время сроки могут увеличиваться. При сдаче покажите пятна и скажите, чем они оставлены.",
      faq: [
        {
          q: "Сколько длится химчистка?",
          a: "Обычная одежда часто готова довольно быстро, а кожа, мех, свадебные платья и крупные вещи — дольше. Уточните срок при сдаче, особенно перед сезоном.",
        },
        {
          q: "Можно ли вывести любое пятно?",
          a: "Не всегда: старые въевшиеся пятна и некоторые ткани полностью не очищаются. Чем раньше вы принесёте вещь и назовёте причину пятна, тем выше шансы.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От типа и размера вещи, ткани, степени загрязнения, особых пятен и срочности. Кожа, мех и свадебные платья обычно оцениваются отдельно.",
        },
        {
          q: "Есть ли забор и доставка?",
          a: "Некоторые химчистки это предлагают, особенно для больших заказов вроде текстиля из апартаментов. Смотрите профиль или спросите о постоянном сотрудничестве.",
        },
        {
          q: "Что если вещь повредят?",
          a: "Перед сдачей дорогих вещей спросите, как химчистка поступает в таких случаях. Сохраняйте квитанцию и ярлык с уходом.",
        },
      ],
      tips: [
        "При сдаче покажите пятна и объясните их происхождение.",
        "Не пытайтесь заранее выводить пятна химией дома.",
        "Для свадебного платья и нарядов к событию оставьте запас времени.",
        "Владельцам апартаментов стоит заранее бронировать чистку до и после сезона.",
      ],
    },
  },
  "aromatizacija-prostora": {
    me: {
      description:
        "Aromatizacija prostora znači postavljanje uređaja za difuziju mirisa i redovno dopunjavanje u hotelskim lobijima, apartmanima, prodavnicama, kancelarijama, teretanama, salonima i ordinacijama. Pružalac pomaže da izabereš miris koji odgovara prostoru i brendu, odredi snagu uređaja prema kvadraturi i brine o servisu. Obrati pažnju na goste i zaposlene osjetljive na mirise: blag intenzitet i dobra ventilacija su bolji od prejakog mirisa.",
      faq: [
        {
          q: "Kako da izaberem miris?",
          a: "Većina pružalaca donese uzorke ili ostavi probni uređaj na kratko vrijeme. Biraj prema vrsti prostora i gostima, a ne samo prema ličnom ukusu.",
        },
        {
          q: "Da li se uređaj kupuje ili iznajmljuje?",
          a: "Obično postoje obje opcije, a često i mjesečni paket sa punjenjem i servisom. Uporedi šta ti se više isplati za tvoj prostor.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina prostora, broj i vrsta uređaja, izbor mirisa, učestalost dopunjavanja i da li je uključen servis. Veći prostori ili ventilacioni sistemi traže jače uređaje.",
        },
        {
          q: "Može li se uređaj povezati na ventilaciju?",
          a: "Neki uređaji se ugrađuju u sistem klimatizacije za veće prostore. Pitaj pružaoca da li je tvoj sistem pogodan i ko radi montažu.",
        },
        {
          q: "Da li mirisi smetaju osjetljivim osobama?",
          a: "Neki ljudi su osjetljivi na jake mirise, pa je bolje početi sa blagim intenzitetom i pratiti reakcije. Pitaj pružaoca za sastav i sigurnosne listove proizvoda.",
        },
      ],
      tips: [
        "Testiraj miris u svom prostoru nekoliko dana prije ugovora.",
        "Počni sa slabijim intenzitetom i pojačaj po potrebi.",
        "Traži sastav i sigurnosne listove za mirise koje koristiš.",
        "Dogovori raspored dopunjavanja da uređaj nikad ne ostane prazan.",
      ],
    },
    en: {
      description:
        "Scent marketing means installing fragrance diffusers and keeping them refilled in hotel lobbies, holiday rentals, shops, offices, gyms, salons and clinics. The provider helps you choose a scent that suits the space and brand, sizes the device to the room and handles servicing. Keep guests and staff who are sensitive to fragrance in mind: a subtle level and good ventilation work better than an overpowering scent.",
      faq: [
        {
          q: "How do I choose a scent?",
          a: "Most providers bring samples or leave a trial unit for a short time. Pick according to the space and your guests, not only your own taste.",
        },
        {
          q: "Do I buy or rent the device?",
          a: "Usually both are possible, often with a monthly package that includes refills and servicing. Compare which works out better for you.",
        },
        {
          q: "What affects the cost?",
          a: "Room size, number and type of devices, the fragrance, how often it's refilled and whether servicing is included. Large spaces or HVAC setups need stronger units.",
        },
        {
          q: "Can it connect to the air conditioning?",
          a: "Some units integrate with HVAC systems in larger spaces. Ask whether your system is suitable and who installs it.",
        },
        {
          q: "Can fragrance bother people?",
          a: "Some people react to strong scents, so start at a low intensity and watch feedback. Ask for ingredient information and safety data sheets.",
        },
      ],
      tips: [
        "Trial the scent in your own space for a few days first.",
        "Start at a low intensity and adjust.",
        "Ask for ingredients and safety data sheets.",
        "Agree a refill schedule so devices never run empty.",
      ],
    },
    ru: {
      description:
        "Ароматизация помещений — это установка диффузоров и их регулярная заправка в лобби отелей, апартаментах, магазинах, офисах, спортзалах, салонах и клиниках. Исполнитель помогает подобрать аромат под пространство и бренд, рассчитать мощность устройства по площади и обслуживает оборудование. Помните о гостях и сотрудниках, чувствительных к запахам: мягкая интенсивность и хорошая вентиляция лучше, чем слишком сильный аромат.",
      faq: [
        {
          q: "Как выбрать аромат?",
          a: "Большинство исполнителей привозят пробники или оставляют устройство на тест. Выбирайте с учётом помещения и гостей, а не только своего вкуса.",
        },
        {
          q: "Устройство покупать или арендовать?",
          a: "Обычно доступны оба варианта, часто с месячным пакетом с заправкой и обслуживанием. Сравните, что выгоднее для вашего помещения.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От площади, количества и типа устройств, аромата, частоты заправки и обслуживания. Для больших помещений и систем вентиляции нужны более мощные устройства.",
        },
        {
          q: "Можно ли подключить к вентиляции?",
          a: "Некоторые устройства встраиваются в систему кондиционирования больших помещений. Уточните, подходит ли ваша система и кто выполняет монтаж.",
        },
        {
          q: "Могут ли ароматы мешать людям?",
          a: "Некоторые люди чувствительны к сильным запахам, поэтому начните с низкой интенсивности и следите за реакцией. Попросите состав и паспорта безопасности продукции.",
        },
      ],
      tips: [
        "Протестируйте аромат в своём помещении несколько дней.",
        "Начните с низкой интенсивности и корректируйте.",
        "Запросите состав и паспорта безопасности ароматов.",
        "Согласуйте график заправки, чтобы устройства не пустовали.",
      ],
    },
  },
};
