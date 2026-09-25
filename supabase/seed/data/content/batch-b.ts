import type { ServiceContent } from "./types";

export const content: Record<string, ServiceContent> = {
  ciscenje: {
    me: {
      description:
        "Redovno održavanje stanova i kuća, generalno čišćenje, čišćenje poslije renoviranja ili selidbe i održavanje kancelarija i lokala. Najviše se traži pred useljenje, poslije krečenja i radova, pred praznike i kad se stan predaje zakupcu. U primorju je vlaga stalna tema, pa dobar servis obrati pažnju i na kupatila, dihtunge prozora i uglove gdje se hvata buđ.",
      faq: [
        {
          q: "Da li donose svoja sredstva i opremu?",
          a: "Većina ekipa dolazi sa sredstvima, krpama i usisivačem, ali neki računaju sredstva posebno. Ako želiš da koriste tvoja sredstva ili nešto bez mirisa, reci to unaprijed.",
        },
        {
          q: "Koja je razlika između redovnog i generalnog čišćenja?",
          a: "Redovno čišćenje obuhvata prašinu, podove, kupatilo i kuhinju po površini. Generalno ide dublje: unutrašnjost ormarića, pećnica, frižider, prozori sa okvirima, lusteri i iza namještaja.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Kvadratura, broj kupatila, koliko je prostor zapušten i da li je u pitanju čišćenje poslije radova. Prozori, terase i pećnica često se naplaćuju kao dodatak, pa provjeri cjenovnik na profilu.",
        },
        {
          q: "Da li moram biti kod kuće dok čiste?",
          a: "Ne mora, mnogi klijenti ostave ključ ili ga predaju komšiji. Prvi put je ipak dobro da budeš tu bar na početku, da pokažeš šta ti je najvažnije.",
        },
        {
          q: "Mogu li dogovoriti čišćenje jednom sedmično ili dvaput mjesečno?",
          a: "Da, redovni termini su uobičajeni i obično se dogovara stalni dan. Pitaj da li dolazi ista osoba svaki put, to mnogima puno znači.",
        },
      ],
      tips: [
        "Napravi kratak spisak prostorija i poslova, pa ga pošalji prije dolaska da ponuda bude tačna.",
        "Skloni nakit, dokumenta i sitne vrijedne stvari prije prvog čišćenja.",
        "Za čišćenje poslije renoviranja traži ekipu koja ima iskustva sa građevinskom prašinom i ostacima maltera.",
        "Poslije prvog dolaska jasno reci šta ti se nije svidjelo, dobre ekipe se brzo prilagode.",
      ],
    },
    en: {
      description:
        "Regular home cleaning, one-off deep cleans, end-of-tenancy and move-in cleaning, post-renovation cleanup and office upkeep. Expats often book a deep clean before moving into a rented flat, since standards at handover vary a lot. On the coast, damp is a constant issue, so a good cleaner will pay attention to bathrooms, window seals and corners where mould tends to appear.",
      faq: [
        {
          q: "Do cleaners bring their own supplies?",
          a: "Most bring products, cloths and a vacuum, though some charge supplies separately. If you prefer eco or fragrance-free products, mention it when booking.",
        },
        {
          q: "Can I communicate in English?",
          a: "Many cleaners in Budva, Kotor, Tivat and Podgorica work with foreigners and manage basic English, but it varies. A short written checklist, even run through a translator, avoids misunderstandings.",
        },
        {
          q: "What affects the price?",
          a: "Size of the home, number of bathrooms, how dirty it is and whether it is a post-construction job. Windows, balconies and the oven are often extras, so check the price list on the profile.",
        },
        {
          q: "Do I need to be home during the clean?",
          a: "No, leaving a key is common for regular clients. For the first visit it helps to be there for a few minutes to walk them through your priorities.",
        },
        {
          q: "Is a deep clean worth it before moving into a rental?",
          a: "Usually yes. Kitchens and bathrooms in rentals are often cleaned only on the surface, and a deep clean covers inside cupboards, appliances, tiles and window frames.",
        },
      ],
      tips: [
        "Send a list of rooms and tasks with a few photos so the quote reflects the actual job.",
        "Put away jewellery, documents and small valuables before the first visit.",
        "Ask whether the same person will come each time if you book a regular slot.",
        "For post-renovation work, choose a team that mentions construction dust and paint residue specifically.",
      ],
    },
    ru: {
      description:
        "Поддерживающая уборка квартир и домов, генеральная уборка, уборка после ремонта или переезда, обслуживание офисов и магазинов. Многие заказывают генеральную уборку перед заселением в арендованную квартиру: состояние жилья при передаче бывает очень разным. На побережье постоянная проблема — влажность, поэтому хороший специалист уделит внимание ванной, уплотнителям окон и углам, где появляется плесень.",
      faq: [
        {
          q: "Клинеры приезжают со своими средствами?",
          a: "Обычно да: со средствами, салфетками и пылесосом. Некоторые берут за расходники отдельно, а если вам нужны гипоаллергенные средства, лучше предупредить заранее.",
        },
        {
          q: "Можно ли договориться на русском?",
          a: "Многие на побережье понимают русский, но это не правило. Надёжнее отправить письменный список задач, хотя бы через переводчик.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От площади, количества санузлов, степени загрязнения и того, нужна ли уборка после ремонта. Окна, балконы и духовка часто считаются отдельно — смотрите прайс в профиле.",
        },
        {
          q: "Нужно ли присутствовать во время уборки?",
          a: "Не обязательно, постоянные клиенты часто оставляют ключ. В первый раз лучше встретить специалиста и показать, что для вас важнее всего.",
        },
        {
          q: "Чем генеральная уборка отличается от обычной?",
          a: "Обычная — это пыль, полы, кухня и санузел по поверхностям. Генеральная включает шкафы внутри, духовку, холодильник, окна с рамами, светильники и места за мебелью.",
        },
      ],
      tips: [
        "Отправьте список комнат и задач с фото, чтобы расчёт был точным.",
        "Уберите документы, украшения и мелкие ценности перед первой уборкой.",
        "При регулярной уборке уточните, будет ли приходить один и тот же человек.",
        "После ремонта выбирайте команду, которая умеет убирать строительную пыль и следы краски.",
      ],
    },
  },

  "ciscenje-apartmana": {
    me: {
      description:
        "Čišćenje između gostiju za apartmane na Airbnb-u i Bookingu: kompletno čišćenje, promjena posteljine i peškira, dopuna potrošnog materijala i provjera da li nešto fali ili je oštećeno. Ljeti na primorju odlasci i dolasci često padaju istog dana, pa je bitno da ekipa stigne između check-outa i check-ina, i vikendom. Mnogi nude i pranje veša i fotografije stanja stana poslije svakog čišćenja.",
      faq: [
        {
          q: "Da li rade vikendom i u sezoni?",
          a: "Ekipe koje se bave apartmanima uglavnom rade svaki dan od juna do septembra, jer se tada najviše mijenjaju gosti. Termini u sezoni se brzo popune, pa se dogovori na vrijeme.",
        },
        {
          q: "Da li peru i peglaju posteljinu?",
          a: "Neki imaju svoju perionicu veša ili sarađuju sa perionicom, drugi samo mijenjaju posteljinu koju ti obezbijediš. Pitaj ko pere, gdje i kad se veš vraća.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina apartmana, broj kreveta, da li je uključeno pranje veša i dopuna sredstava, i koliko je hitan termin. Neki imaju posebnu cijenu za dolazak istog dana ili nedjeljom.",
        },
        {
          q: "Kako znam da je apartman spreman za goste?",
          a: "Dogovori da ti poslije svakog čišćenja pošalju nekoliko fotografija i javi ako nešto fali ili je pokvareno. Mnoge ekipe to rade same od sebe.",
        },
        {
          q: "Mogu li preuzeti i ključeve i predaju gostima?",
          a: "Neke ekipe rade i check-in, predaju ključeva i sef za ključeve, ali to nije pravilo. Ako ti treba i to, pogledaj uslugu upravljanja apartmanima.",
        },
      ],
      tips: [
        "Napravi check-listu za apartman sa fotografijom kako treba da izgleda spremljen krevet i kuhinja.",
        "Drži rezervnu garnituru posteljine i peškira u apartmanu, da ekipa ne zavisi od perionice.",
        "Podijeli kalendar rezervacija sa ekipom da ne bi propustili promjenu gostiju.",
        "Prije sezone probaj ekipu na jednom čišćenju, ne čekaj jul da otkriješ problem.",
      ],
    },
    en: {
      description:
        "Turnover cleaning for Airbnb and Booking.com apartments: a full clean, fresh bed linen and towels, restocking consumables and checking for damage or missing items. In summer on the coast, check-outs and check-ins often fall on the same day, so the cleaner has to fit the gap reliably, weekends included. Many also handle laundry and send photos of the apartment after every turnover, which helps owners who live abroad.",
      faq: [
        {
          q: "Do they work weekends and peak season?",
          a: "Teams that specialise in rentals usually work every day from June to September. Their calendars fill up early, so arrange cooperation before the season starts.",
        },
        {
          q: "Is laundry included?",
          a: "Some have their own laundry service or partner with one, while others only change linen you provide. Ask who washes it and how quickly it comes back.",
        },
        {
          q: "What affects the price?",
          a: "Apartment size, number of beds, whether laundry and restocking are included, and how short the notice is. Same-day or Sunday turnovers may cost more, depending on the business.",
        },
        {
          q: "I live abroad. How do I know the place is ready?",
          a: "Ask for photos after each clean and a quick note about anything broken or running low. Reliable teams report damage straight away so you can raise it with the platform.",
        },
        {
          q: "Can the cleaner also meet guests and hand over keys?",
          a: "Some do check-ins or manage a key box, but many only clean. If you need the full package, look at holiday rental management instead.",
        },
      ],
      tips: [
        "Write a turnover checklist with photos of how the beds and kitchen should look.",
        "Keep a spare set of linen and towels in the apartment for tight same-day changeovers.",
        "Share your booking calendar with the cleaner so no turnover gets missed.",
        "Test a team with one or two cleans in spring rather than discovering problems in July.",
      ],
    },
    ru: {
      description:
        "Уборка между гостями для апартаментов на Airbnb и Booking: полная уборка, смена постельного белья и полотенец, пополнение расходников и проверка, всё ли на месте и ничего ли не повреждено. Летом на побережье выезд и заезд часто совпадают по дню, поэтому важно, чтобы команда успевала в этот промежуток, в том числе по выходным. Многие также берут на себя стирку и присылают фото квартиры после каждой уборки.",
      faq: [
        {
          q: "Работают ли по выходным и в сезон?",
          a: "Команды, специализирующиеся на апартаментах, обычно работают без выходных с июня по сентябрь. Графики заполняются рано, так что договаривайтесь до начала сезона.",
        },
        {
          q: "Входит ли стирка белья?",
          a: "У одних есть своя прачечная или партнёр, другие только меняют ваше бельё. Уточните, кто стирает и через сколько бельё возвращается.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От площади, количества спальных мест, включена ли стирка и пополнение расходников, а также от срочности. Уборка в день заезда или в воскресенье может стоить дороже — это зависит от исполнителя.",
        },
        {
          q: "Я живу не в Черногории. Как понять, что квартира готова?",
          a: "Попросите присылать фото после каждой уборки и сообщать о поломках или нехватке вещей. Так вы успеете вовремя обратиться к платформе по поводу ущерба.",
        },
        {
          q: "Может ли уборщица встречать гостей и передавать ключи?",
          a: "Некоторые делают и заселение, но многие только убирают. Если нужен полный цикл, посмотрите услугу управления апартаментами.",
        },
      ],
      tips: [
        "Составьте чек-лист с фотографиями того, как должны выглядеть кровать и кухня.",
        "Держите в квартире запасной комплект белья и полотенец на случай быстрой смены гостей.",
        "Дайте команде доступ к календарю бронирований, чтобы не пропустить ни одного выезда.",
        "Проверьте команду на паре уборок весной, а не в разгар сезона.",
      ],
    },
  },

  "dubinsko-pranje-namjestaja": {
    me: {
      description:
        "Dubinsko pranje trosjeda, ugaonih garnitura, fotelja, dušeka, stolica i tapaciranih uzglavlja, najčešće ekstrakcijskim mašinama koje ubrizgaju sredstvo i odmah ga izvuku zajedno sa prljavštinom. Radi se kod tebe u stanu, a traži se zbog fleka, mirisa kućnih ljubimaca, grinja ili prije predaje stana zakupcu. U vlažnim primorskim stanovima važno je da se namještaj poslije pranja dobro prozrači.",
      faq: [
        {
          q: "Koliko se suši namještaj poslije pranja?",
          a: "Obično nekoliko sati, a u vlažnom vremenu i do jednog dana. Otvoreni prozori, ventilator ili klima na sušenju znatno ubrzavaju stvar.",
        },
        {
          q: "Da li mogu da skinu svaku fleku?",
          a: "Većinu svježih i organskih fleka da, ali stare fleke od kafe, vina, mastila ili izbjeljivača ponekad ostanu vidljive. Pošteni servis će ti to reći unaprijed kad vidi fleku.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj sjedećih mjesta, veličina garniture, vrsta materijala i koliko je namještaj zaprljan. Dušeci se obično računaju po komadu, a ponekad postoji minimalna cijena dolaska.",
        },
        {
          q: "Da li je bezbjedno za djecu i ljubimce?",
          a: "Većina servisa koristi sredstva namijenjena tekstilu koja se ispiru mašinom. Ako imaš malu djecu ili alergije, pitaj koja tačno sredstva koriste.",
        },
        {
          q: "Mogu li prati kožni namještaj ili somot?",
          a: "Koža se ne pere ekstrakcijom, već se čisti i neguje posebnim preparatima. Za somot, lan i osjetljive tkanine pitaj da li servis ima iskustva prije nego što se dogovoriš.",
        },
      ],
      tips: [
        "Pošalji fotografije garniture i fleka, pa ćeš dobiti tačniju procjenu.",
        "Provjeri etiketu na jastucima i navlakama, neke tkanine se ne smiju prati vodom.",
        "Zakaži pranje za suv i topao dan da se namještaj brže osuši.",
        "Ne sjedaj na garnituru dok potpuno ne presuši, da se ne vrati prljavština.",
      ],
    },
    en: {
      description:
        "On-site deep cleaning of sofas, corner units, armchairs, mattresses, dining chairs and upholstered headboards, usually with extraction machines that spray a cleaning solution and suck it back out with the dirt. People book it for stains, pet odours, dust mites and before handing a flat back to a landlord or preparing a rental for the season. In humid coastal flats, good ventilation afterwards matters.",
      faq: [
        {
          q: "How long does upholstery take to dry?",
          a: "Usually a few hours, up to a day in humid weather. Open windows, a fan or the AC in dry mode speed it up considerably.",
        },
        {
          q: "Will every stain come out?",
          a: "Most fresh and organic stains do, but old wine, coffee, ink or bleach marks can stay visible. An honest cleaner will tell you after looking at the stain.",
        },
        {
          q: "What affects the price?",
          a: "Number of seats, size of the sofa, fabric type and how dirty it is. Mattresses are usually priced per piece, and some businesses have a minimum call-out charge.",
        },
        {
          q: "Is it safe for kids and pets?",
          a: "Most use textile-specific products that are rinsed out by the machine. If anyone in the home has allergies, ask exactly which products they use.",
        },
        {
          q: "Can they clean leather or velvet?",
          a: "Leather is cleaned and conditioned with special products rather than extracted. For velvet, linen and delicate fabrics, ask whether they have experience before booking.",
        },
      ],
      tips: [
        "Send photos of the furniture and stains to get a realistic quote.",
        "Check cushion labels, since some fabrics must not be cleaned with water.",
        "Book on a dry, warm day so everything dries faster.",
        "Keep people and pets off the sofa until it is completely dry.",
      ],
    },
    ru: {
      description:
        "Химчистка диванов, угловых гарнитуров, кресел, матрасов, стульев и мягких изголовий на дому, чаще всего экстракторными машинами: раствор подаётся в ткань и сразу вытягивается вместе с грязью. Заказывают из-за пятен, запаха животных, пылевых клещей, а также перед сдачей квартиры хозяину или перед сезоном аренды. Во влажных квартирах на побережье мебель после чистки важно хорошо проветрить.",
      faq: [
        {
          q: "Сколько сохнет мебель после химчистки?",
          a: "Обычно несколько часов, в сырую погоду — до суток. Открытые окна, вентилятор или кондиционер в режиме осушения заметно ускоряют процесс.",
        },
        {
          q: "Выводятся ли все пятна?",
          a: "Большинство свежих и органических — да, но старые пятна от вина, кофе, чернил или отбеливателя могут остаться. Добросовестный мастер скажет это заранее, посмотрев на пятно.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества посадочных мест, размера мебели, типа ткани и степени загрязнения. Матрасы обычно считаются поштучно, у некоторых есть минимальная сумма выезда.",
        },
        {
          q: "Безопасно ли это для детей и животных?",
          a: "Обычно используются средства для текстиля, которые вымываются машиной. При аллергии уточните, какие именно препараты применяются.",
        },
        {
          q: "Чистят ли кожу и велюр?",
          a: "Кожу не чистят экстракцией, для неё используют специальные очистители и кондиционеры. Про велюр, лён и деликатные ткани спросите об опыте заранее.",
        },
      ],
      tips: [
        "Пришлите фото мебели и пятен, чтобы получить реальную оценку.",
        "Проверьте ярлыки на подушках: некоторые ткани нельзя чистить водой.",
        "Планируйте чистку на сухой тёплый день, так мебель высохнет быстрее.",
        "Не садитесь на диван, пока он полностью не высохнет.",
      ],
    },
  },

  "pranje-tepiha": {
    me: {
      description:
        "Mašinsko pranje tepiha, staza i otiraća u perionici, sa preuzimanjem i dostavom na adresu, a kod nekih i pranje itisona na licu mjesta. Tepisi se najčešće peru u proljeće, kad se sklanjaju za ljeto, i u jesen pred grijanje. Perionica tepih istrese, opere, ispere i osuši u komori ili na vazduhu, pa od preuzimanja do vraćanja obično prođe nekoliko dana.",
      faq: [
        {
          q: "Da li dolaze po tepih i vraćaju ga?",
          a: "Većina perionica ima besplatno ili naplativo preuzimanje i dostavu u svom gradu. Za udaljenija mjesta pitaj da li imaju dane kad obilaze tvoj kraj.",
        },
        {
          q: "Koliko dugo traje pranje?",
          a: "Uglavnom od nekoliko dana do sedmicu, zavisno od sezone i vremena za sušenje. U proljeće i jesen perionice su zatrpane, pa računaj na duže čekanje.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Najčešće se naplaćuje po kvadratnom metru, a na cijenu utiču i vrsta tepiha, visina vlakna i dodatni tretmani za fleke ili mirise. Ručno rađeni i svileni tepisi obično se računaju posebno.",
        },
        {
          q: "Da li peru ručno rađene i vunene tepihe?",
          a: "Mnoge perionice ih peru, ali blažim postupkom i uz provjeru boja. Za starinski ili skupocjen ćilim pitaj da li imaju iskustva sa takvim komadima.",
        },
        {
          q: "Može li se skinuti miris mokraće kućnih ljubimaca?",
          a: "Često može uz enzimski tretman, ali ako je urin prodro duboko u podlogu, miris se nekad vrati kad je vlažno. Reci to perionici unaprijed da primijene pravi tretman.",
        },
      ],
      tips: [
        "Izmjeri tepihe prije poziva, da odmah znaš okvirni trošak.",
        "Zakaži pranje prije proljećne i jesenje gužve, pa ćeš tepih dobiti brže.",
        "Fotografiši oštećenja i rese prije preuzimanja, da kasnije ne bude nesporazuma.",
        "Vraćen tepih odmah razmotaj i provjeri da li je potpuno suv.",
      ],
    },
    en: {
      description:
        "Machine washing of rugs, runners and doormats at a cleaning facility, usually with pickup and delivery, and on-site cleaning of fitted carpet at some businesses. Most people send rugs in spring, when they roll them up for the hot months, and in autumn before the heating season. The rug is beaten, washed, rinsed and dried in a drying room or outdoors, so expect it back after a few days.",
      faq: [
        {
          q: "Do they collect and deliver?",
          a: "Most offer pickup and delivery within their town, sometimes free and sometimes for a fee. For villages or other towns, ask whether they have regular route days.",
        },
        {
          q: "How long does it take?",
          a: "Usually a few days to a week, depending on the season and drying conditions. Spring and autumn are the busiest periods, so waits get longer.",
        },
        {
          q: "What affects the price?",
          a: "Most charge per square metre, with pile height, rug type and extra stain or odour treatment adding to it. Handmade and silk rugs are usually priced separately.",
        },
        {
          q: "Can they wash handmade wool or antique rugs?",
          a: "Many can, using a gentler process and a colour-fastness check first. For valuable pieces, ask about their experience before handing it over.",
        },
        {
          q: "Can pet urine smell be removed?",
          a: "Often, with an enzyme treatment, but if it has soaked deep into the backing the smell may return in humid weather. Tell them in advance so they treat it properly.",
        },
      ],
      tips: [
        "Measure your rugs before calling so you can estimate the cost straight away.",
        "Book before the spring and autumn rush to get your rug back sooner.",
        "Photograph existing damage and fringes before pickup to avoid disputes later.",
        "Unroll the rug on delivery and make sure it is fully dry.",
      ],
    },
    ru: {
      description:
        "Машинная стирка ковров, дорожек и придверных ковриков в цеху, обычно с вывозом и доставкой, а у некоторых компаний также чистка ковролина на месте. Чаще всего ковры сдают весной, когда их убирают на жаркие месяцы, и осенью перед отопительным сезоном. Ковёр выбивают, стирают, полощут и сушат в сушильной камере или на воздухе, поэтому обратно его привозят через несколько дней.",
      faq: [
        {
          q: "Забирают ли ковёр и привозят обратно?",
          a: "Большинство цехов забирают и доставляют в пределах своего города, бесплатно или за доплату. Для других населённых пунктов уточните, бывают ли у них выезды в ваш район.",
        },
        {
          q: "Сколько времени занимает стирка?",
          a: "Обычно от нескольких дней до недели, в зависимости от сезона и погоды для сушки. Весной и осенью очередь больше.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "Чаще всего считают за квадратный метр, плюс влияют тип ковра, высота ворса и дополнительная обработка пятен или запахов. Ковры ручной работы и шёлковые обычно считаются отдельно.",
        },
        {
          q: "Стирают ли шерстяные ковры ручной работы?",
          a: "Многие стирают, но щадящим способом и с проверкой красителей. Для антикварных и дорогих ковров спросите об опыте с такими изделиями.",
        },
        {
          q: "Можно ли убрать запах мочи животных?",
          a: "Часто да, с помощью ферментной обработки, но если моча впиталась в основу, запах может вернуться в сырую погоду. Предупредите об этом заранее.",
        },
      ],
      tips: [
        "Измерьте ковры до звонка, чтобы сразу понять примерную стоимость.",
        "Сдавайте ковры до весеннего и осеннего наплыва — вернут быстрее.",
        "Сфотографируйте повреждения и бахрому перед вывозом.",
        "При доставке разверните ковёр и убедитесь, что он полностью сухой.",
      ],
    },
  },

  "ddd-dezinsekcija": {
    me: {
      description:
        "Suzbijanje žohara, mrava, stjenica, buva, komaraca i osa, deratizacija miševa i pacova i dezinfekcija prostora. Radi se u stanovima, kućama, zgradama, apartmanima, restoranima i magacinima, najčešće gelom, prskanjem, zamkama ili meka-mamcima. Na primorju su žohari i komarci najveći problem od proljeća do jeseni, a apartmane sa stjenicama treba tretirati odmah, prije nego što stignu novi gosti.",
      faq: [
        {
          q: "Da li moram napustiti stan tokom tretmana?",
          a: "Zavisi od metode i sredstva. Kod gela uglavnom ne, a kod prskanja se obično izlazi na nekoliko sati i poslije se prostor provjetri, pa pitaj izvođača za tačna uputstva.",
        },
        {
          q: "Da li je jedan tretman dovoljan?",
          a: "Za žohare i stjenice često je potreban ponovljeni tretman nakon nekoliko sedmica, jer sredstva ne uništavaju uvijek jaja. Pitaj da li je kontrolni dolazak uključen.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Vrsta štetočine, kvadratura, broj prostorija i koliko je problem raširen. Stjenice i veći objekti obično traže više rada, a za firme i ugostitelje posao se često ugovara na godišnjem nivou.",
        },
        {
          q: "Da li je bezbjedno za djecu i kućne ljubimce?",
          a: "Profesionalna sredstva se koriste u propisanim dozama, ali djeca i ljubimci ne treba da budu u prostoru dok se ne osuši ili provjetri. Akvarijume i terarijume obavezno pokrij ili iznesi.",
        },
        {
          q: "Da li izdaju potvrdu o izvršenom tretmanu?",
          a: "Registrovane firme obično izdaju račun i zapisnik o tretmanu, što je korisno za ugostiteljske objekte i upravnike zgrada. Ako ti treba dokument, reci unaprijed.",
        },
      ],
      tips: [
        "Fotografiši štetočinu ili tragove, izvođač će brže odrediti metodu.",
        "Kod žohara u zgradi dogovori tretman sa komšijama, inače se brzo vraćaju.",
        "Prije dolaska isprazni kuhinjske elemente i skloni hranu i posuđe.",
        "Pitaj koje sredstvo koriste i koliko dugo ne smiješ brisati tretirane površine.",
      ],
    },
    en: {
      description:
        "Treatment for cockroaches, ants, bed bugs, fleas, mosquitoes and wasps, rodent control for mice and rats, and disinfection of premises. Pest controllers work in flats, houses, residential buildings, holiday rentals, restaurants and warehouses, using gels, spraying, traps and bait stations. On the coast, cockroaches and mosquitoes are the main problem from spring to autumn, and a rental with bed bugs needs treating before the next guests arrive.",
      faq: [
        {
          q: "Do I have to leave the flat during treatment?",
          a: "It depends on the method. Gel baits usually don't require leaving, while spraying often means staying out for a few hours and airing afterwards, so follow the technician's instructions.",
        },
        {
          q: "Is one treatment enough?",
          a: "For cockroaches and bed bugs a follow-up visit after a few weeks is common, because not every product kills the eggs. Ask whether the follow-up is included.",
        },
        {
          q: "What affects the price?",
          a: "Type of pest, floor area, number of rooms and how severe the infestation is. Bed bugs and large premises take more work, and businesses often sign yearly contracts.",
        },
        {
          q: "Is it safe for children and pets?",
          a: "Professional products are applied in controlled doses, but kids and pets should stay out until surfaces are dry or aired. Cover or remove aquariums and terrariums.",
        },
        {
          q: "Do they provide paperwork?",
          a: "Registered companies usually issue an invoice and a treatment record, which is useful for restaurants, rentals and building managers. Mention it when booking if you need one.",
        },
      ],
      tips: [
        "Take a photo of the pest or droppings so the technician can choose the right method.",
        "For cockroaches in a building, coordinate treatment with neighbours or they will come back.",
        "Empty kitchen cupboards and put food and dishes away before the visit.",
        "Ask which product is used and how long to avoid wiping treated surfaces.",
      ],
    },
    ru: {
      description:
        "Уничтожение тараканов, муравьёв, клопов, блох, комаров и ос, дератизация от мышей и крыс, а также дезинфекция помещений. Работают в квартирах, домах, жилых зданиях, апартаментах, ресторанах и складах, используя гели, распыление, ловушки и приманочные станции. На побережье с весны до осени главные проблемы — тараканы и комары, а апартаменты с клопами нужно обработать до приезда следующих гостей.",
      faq: [
        {
          q: "Нужно ли уходить из квартиры во время обработки?",
          a: "Зависит от метода. При обработке гелем обычно нет, при распылении, как правило, нужно уйти на несколько часов и потом проветрить — уточните у специалиста.",
        },
        {
          q: "Достаточно ли одной обработки?",
          a: "От тараканов и клопов часто нужна повторная обработка через несколько недель, так как не все средства уничтожают яйца. Спросите, входит ли контрольный визит.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От вида вредителей, площади, количества комнат и масштаба проблемы. Клопы и большие объекты требуют больше работы, а с бизнесом часто заключают годовые договоры.",
        },
        {
          q: "Безопасно ли это для детей и животных?",
          a: "Профессиональные средства применяются в рассчитанных дозах, но детям и животным лучше не находиться в помещении до высыхания и проветривания. Аквариумы накройте или вынесите.",
        },
        {
          q: "Выдают ли документ об обработке?",
          a: "Зарегистрированные компании обычно выдают счёт и акт обработки, что важно для ресторанов, апартаментов и управляющих зданиями. Если он нужен, скажите заранее.",
        },
      ],
      tips: [
        "Сфотографируйте вредителя или следы — так проще подобрать метод.",
        "Если тараканы в доме, договоритесь об обработке с соседями, иначе они вернутся.",
        "Перед визитом освободите кухонные шкафы и уберите продукты и посуду.",
        "Спросите, каким средством обрабатывают и сколько не мыть обработанные поверхности.",
      ],
    },
  },

  "servis-klima": {
    me: {
      description:
        "Redovni servis i čišćenje klima uređaja, dezinfekcija unutrašnje jedinice, provjera i dopuna freona, otklanjanje curenja vode i kvarova, kao i ugradnja i demontaža. Na primorju je najbolje servisirati klimu u aprilu ili maju, prije nego što majstori budu zatrpani u julu. Zbog vlage i soli iz vazduha filteri i izmjenjivači se brže prljaju, a neočišćena klima počne da širi neprijatan miris.",
      faq: [
        {
          q: "Koliko često servisirati klimu?",
          a: "Preporuka je bar jednom godišnje, a kod klima koje rade i za grijanje ili u apartmanima sa puno gostiju dvaput. Filtere možeš sam oprati svakih nekoliko sedmica tokom sezone.",
        },
        {
          q: "Zašto klima curi ili ima neprijatan miris?",
          a: "Najčešći uzrok je zapušen odvod kondenzata ili prljav izmjenjivač u kome se razvila buđ. Oba problema obično rješava temeljno čišćenje unutrašnje jedinice.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj uređaja, da li je potrebno samo čišćenje ili i dopuna freona, pristup spoljnoj jedinici i vrsta kvara. Ako spoljna jedinica visi na fasadi, nekad je potrebna posebna oprema.",
        },
        {
          q: "Da li servisiraju sve marke?",
          a: "Većina servisera radi sve uobičajene marke za čišćenje i osnovne popravke. Za rezervne djelove kod rjeđih marki ili inverter pločice pitaj unaprijed da li ih mogu nabaviti.",
        },
        {
          q: "Da li rade u sezoni i vikendom?",
          a: "Mnogi rade i subotom, ali u julu i avgustu termini se čekaju danima. Provjeri radno vrijeme na profilu i zakaži servis prije ljeta.",
        },
      ],
      tips: [
        "Zakaži servis u proljeće, kad su majstori slobodniji i nema čekanja.",
        "Zapiši marku, model i snagu uređaja prije poziva, pa će majstor ponijeti prave djelove.",
        "Obezbijedi pristup spoljnoj jedinici, na primjer ključ od terase ili tavana.",
        "Traži da ti pokažu prljave filtere i objasne šta je urađeno.",
      ],
    },
    en: {
      description:
        "Routine cleaning and servicing of split AC units, disinfection of the indoor unit, refrigerant checks and top-ups, fixing leaks and faults, plus installation and removal. On the coast the best time to book is April or May, before technicians are overwhelmed in July. Humidity and salty sea air make filters and coils get dirty faster, and a unit that hasn't been cleaned soon starts to smell musty.",
      faq: [
        {
          q: "How often should an AC be serviced?",
          a: "At least once a year, and twice for units used for heating too or in busy holiday rentals. You can rinse the filters yourself every few weeks during summer.",
        },
        {
          q: "Why is my AC dripping or smelling bad?",
          a: "Usually a blocked condensate drain or a dirty coil with mould growth. A thorough clean of the indoor unit typically fixes both.",
        },
        {
          q: "What affects the price?",
          a: "Number of units, whether it is just a clean or also a refrigerant top-up, access to the outdoor unit and the type of fault. Outdoor units high on a facade may need extra equipment.",
        },
        {
          q: "Do they service all brands?",
          a: "Most technicians clean and do basic repairs on all common brands. For less common brands or inverter circuit boards, ask whether they can source parts.",
        },
        {
          q: "Can I use the AC for heating in winter?",
          a: "Yes, heat pump ACs are a common way to heat flats on the coast. If you rely on it for heating, a service before winter as well as before summer makes sense.",
        },
      ],
      tips: [
        "Book in spring, when technicians have free slots and no waiting lists.",
        "Note the brand, model and capacity before calling so the right parts come along.",
        "Make sure the outdoor unit is accessible, including roof or terrace keys.",
        "Ask the technician to show you the dirty filters and explain what was done.",
      ],
    },
    ru: {
      description:
        "Плановая чистка и обслуживание сплит-систем, дезинфекция внутреннего блока, проверка и дозаправка фреоном, устранение протечек и неисправностей, а также установка и демонтаж. На побережье лучше всего обслуживать кондиционер в апреле или мае, пока мастера не перегружены в июле. Из-за влажности и морской соли фильтры и теплообменники загрязняются быстрее, и неочищенный кондиционер начинает неприятно пахнуть.",
      faq: [
        {
          q: "Как часто нужно обслуживать кондиционер?",
          a: "Минимум раз в год, а если он работает и на обогрев или стоит в сдаваемых апартаментах — дважды. Фильтры летом можно промывать самостоятельно раз в несколько недель.",
        },
        {
          q: "Почему кондиционер течёт или пахнет?",
          a: "Чаще всего засорён дренаж или в грязном теплообменнике завелась плесень. Обе проблемы обычно решает тщательная чистка внутреннего блока.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества блоков, нужна ли только чистка или ещё и дозаправка, от доступа к наружному блоку и типа поломки. Если блок висит высоко на фасаде, может понадобиться спецоборудование.",
        },
        {
          q: "Обслуживают ли все марки?",
          a: "Чистку и простой ремонт большинство мастеров делают для всех распространённых марок. Для редких брендов и инверторных плат уточните, смогут ли достать запчасти.",
        },
        {
          q: "Можно ли отапливаться кондиционером зимой?",
          a: "Да, на побережье многие так и греются. В этом случае имеет смысл обслуживать кондиционер и перед зимой, и перед летом.",
        },
      ],
      tips: [
        "Записывайтесь весной, когда у мастеров есть свободные окна.",
        "Перед звонком запишите марку, модель и мощность кондиционера.",
        "Обеспечьте доступ к наружному блоку, например ключ от террасы или крыши.",
        "Попросите показать грязные фильтры и объяснить, что было сделано.",
      ],
    },
  },

  "servis-bijele-tehnike": {
    me: {
      description:
        "Popravka veš-mašina, mašina za sudove, frižidera i zamrzivača, šporeta, rerni, bojlera i mašina za sušenje veša, na adresi ili u radionici. Najčešći kvarovi su mašina koja ne izbacuje vodu, frižider koji ne hladi, rerna koja ne grije i bojler koji izbacuje osigurač. Tvrda voda u mnogim mjestima brzo stvara kamenac na grijačima, pa su bojleri i veš-mašine česti pacijenti.",
      faq: [
        {
          q: "Da li se plaća izlazak majstora i dijagnostika?",
          a: "Kod većine servisa izlazak se naplaćuje, a nekad se odbije od cijene ako uradiš popravku. Pitaj to prije nego što majstor dođe.",
        },
        {
          q: "Da li se isplati popravljati stari uređaj?",
          a: "Zavisi od kvara i starosti. Zamjena pumpe, grijača ili termostata obično se isplati, a kod skupih djelova poput elektronske ploče ili kompresora na starom uređaju dobar majstor će ti reći da razmisliš o novom.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Vrsta kvara, cijena rezervnog dijela, marka uređaja i da li se popravka radi na licu mjesta ili u radionici. Ugradni uređaji zahtijevaju više rada oko demontaže.",
        },
        {
          q: "Daju li garanciju na popravku?",
          a: "Mnogi servisi daju garanciju na ugrađeni dio i rad, ali rok zavisi od servisa. Traži da ti to napišu na računu.",
        },
        {
          q: "Da li popravljaju uređaje koji su još pod garancijom?",
          a: "Ako je uređaj u fabričkoj garanciji, prvo se obrati prodavcu ili ovlašćenom servisu, jer popravka kod drugog majstora može poništiti garanciju.",
        },
      ],
      tips: [
        "Prije poziva prepiši marku, model i šifru greške sa displeja.",
        "Opiši kvar što preciznije ili snimi kratak video zvuka ili greške.",
        "Pitaj da li majstor nosi uobičajene djelove, pa se popravka može završiti u jednom dolasku.",
        "Sačuvaj račun sa opisom popravke zbog garancije.",
      ],
    },
    en: {
      description:
        "Repairs to washing machines, dishwashers, fridges and freezers, cookers, ovens, electric water heaters (boilers) and tumble dryers, either at your home or in a workshop. Typical call-outs are a washer that won't drain, a fridge that stops cooling, an oven that won't heat and a water heater that keeps tripping the fuse. Hard water in many areas builds limescale on heating elements quickly, so boilers and washers break down often.",
      faq: [
        {
          q: "Is there a call-out or diagnosis fee?",
          a: "Most technicians charge for the visit, and some deduct it if you go ahead with the repair. Ask before they come out.",
        },
        {
          q: "Is it worth repairing an old appliance?",
          a: "It depends on the fault. A new pump, heating element or thermostat is usually worth it, while a control board or compressor on an old unit may not be, and a fair technician will say so.",
        },
        {
          q: "What affects the price?",
          a: "Type of fault, cost of the part, the brand, and whether the repair is done on site or in the workshop. Built-in appliances take more time to remove and refit.",
        },
        {
          q: "I rent my flat. Who pays for appliance repairs?",
          a: "That depends on your rental agreement, but landlords usually cover repairs to appliances that came with the flat. Contact your landlord before booking a technician.",
        },
        {
          q: "Can they fix an appliance still under warranty?",
          a: "If it is under manufacturer warranty, go to the seller or authorised service first, since an independent repair may void the warranty.",
        },
      ],
      tips: [
        "Note the brand, model and any error code shown on the display.",
        "Record a short video of the noise or error to help with diagnosis.",
        "Ask whether they carry common parts so the job can be done in one visit.",
        "Keep the invoice with the repair description in case the fault returns.",
      ],
    },
    ru: {
      description:
        "Ремонт стиральных и посудомоечных машин, холодильников и морозильников, плит, духовок, электрических водонагревателей (бойлеров) и сушильных машин на дому или в мастерской. Типичные вызовы — машина не сливает воду, холодильник перестал морозить, духовка не греет, бойлер выбивает пробки. Жёсткая вода во многих районах быстро покрывает ТЭНы накипью, поэтому бойлеры и стиральные машины ломаются часто.",
      faq: [
        {
          q: "Платный ли выезд и диагностика?",
          a: "У большинства мастеров выезд платный, иногда его вычитают из стоимости ремонта. Уточните это до визита.",
        },
        {
          q: "Стоит ли ремонтировать старую технику?",
          a: "Зависит от поломки. Замена насоса, ТЭНа или термостата обычно оправдана, а плата управления или компрессор на старой технике — не всегда, и честный мастер об этом скажет.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От типа поломки, цены запчасти, марки и того, где делается ремонт — на месте или в мастерской. Встроенная техника требует больше времени на демонтаж.",
        },
        {
          q: "Я снимаю квартиру. Кто платит за ремонт?",
          a: "Это зависит от договора аренды, но обычно ремонт техники, которая шла с квартирой, оплачивает хозяин. Свяжитесь с ним до вызова мастера.",
        },
        {
          q: "Ремонтируют ли технику на гарантии?",
          a: "Если действует гарантия производителя, сначала обратитесь к продавцу или в авторизованный сервис: сторонний ремонт может её аннулировать.",
        },
      ],
      tips: [
        "Перед звонком перепишите марку, модель и код ошибки с дисплея.",
        "Снимите короткое видео шума или ошибки — это ускорит диагностику.",
        "Спросите, возит ли мастер ходовые запчасти, чтобы починить за один визит.",
        "Сохраните счёт с описанием ремонта на случай повторной поломки.",
      ],
    },
  },

  grijanje: {
    me: {
      description:
        "Ugradnja i servis kotlova na pelet, drva i gas, radijatora, podnog grijanja i toplotnih pumpi, uključujući ispiranje instalacije, odzračivanje i zamjenu pumpi i ventila. Na sjeveru, u Pljevljima, Žabljaku, Nikšiću i Kolašinu, sezona grijanja je duga, pa se kotlovi servisiraju u septembru i oktobru. Na primorju se sve više ugrađuju toplotne pumpe i podno grijanje, često kao dio renoviranja.",
      faq: [
        {
          q: "Kada je najbolje servisirati kotao?",
          a: "Prije sezone, krajem ljeta ili početkom jeseni, kad majstori nijesu zatrpani hitnim pozivima. Kod peleta i drva preporučuje se i čišćenje dimnjaka.",
        },
        {
          q: "Zašto radijator grije samo dolje ili uopšte ne grije?",
          a: "Najčešće je u njemu vazduh ili mulj. Odzračivanje možeš uraditi i sam, a ako ne pomogne, potrebno je ispiranje instalacije ili provjera pumpe.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Vrsta sistema, kvadratura objekta, da li se radi nova instalacija ili samo servis i koje opreme je izabrana. Za ugradnju je uvijek potrebna procjena na licu mjesta.",
        },
        {
          q: "Da li se na primorju isplati toplotna pumpa?",
          a: "U blagoj primorskoj klimi toplotne pumpe rade efikasno i mogu i hladiti ljeti. Da li se isplate zavisi od izolacije kuće i sistema u koji se ugrađuju, pa traži proračun.",
        },
        {
          q: "Da li dolaze hitno ako grijanje stane zimi?",
          a: "Neki majstori imaju hitne intervencije i vikendom, ali ne svi. Provjeri radno vrijeme na profilu i sačuvaj broj majstora prije zime.",
        },
      ],
      tips: [
        "Servis zakaži u septembru, prije prvih hladnih dana i gužve.",
        "Za ugradnju traži bar dvije ponude sa spiskom opreme i marki.",
        "Pitaj ko servisira opremu poslije ugradnje i gdje se nabavljaju djelovi.",
        "Prije ugradnje toplotne pumpe provjeri izolaciju, ona najviše utiče na potrošnju.",
      ],
    },
    en: {
      description:
        "Installation and servicing of pellet, wood and gas boilers, radiators, underfloor heating and heat pumps, including flushing systems, bleeding radiators and replacing pumps and valves. In the north, in Pljevlja, Žabljak, Nikšić and Kolašin, the heating season is long and boilers get serviced in September and October. On the coast, heat pumps and underfloor heating are increasingly installed during renovations, and many flats rely on AC units for heating.",
      faq: [
        {
          q: "When should a boiler be serviced?",
          a: "Before the season, in late summer or early autumn, when technicians aren't swamped with emergencies. Pellet and wood boilers also need the chimney cleaned.",
        },
        {
          q: "Why is my radiator cold at the top or not heating at all?",
          a: "Usually trapped air or sludge. You can bleed a radiator yourself, and if that doesn't help, the system may need flushing or the pump checked.",
        },
        {
          q: "What affects the price?",
          a: "Type of system, size of the property, whether it is a new installation or a service, and the equipment chosen. Installations always need an on-site assessment.",
        },
        {
          q: "Does a heat pump make sense on the coast?",
          a: "In the mild coastal climate heat pumps work efficiently and can cool in summer too. Whether they pay off depends on the insulation and the system, so ask for a calculation.",
        },
        {
          q: "Will someone come out if the heating fails in winter?",
          a: "Some technicians offer emergency call-outs, including weekends, but not all. Check the hours on the profile and save a number before winter.",
        },
      ],
      tips: [
        "Book a service in September, before the first cold days and the rush.",
        "For installations, get at least two quotes listing the equipment and brands.",
        "Ask who will service the system afterwards and where parts come from.",
        "Check insulation before investing in a heat pump, since it drives running costs.",
      ],
    },
    ru: {
      description:
        "Установка и обслуживание котлов на пеллетах, дровах и газе, радиаторов, тёплых полов и тепловых насосов, включая промывку системы, удаление воздуха и замену насосов и клапанов. На севере, в Плевле, Жабляке, Никшиче и Колашине, отопительный сезон долгий, и котлы обслуживают в сентябре–октябре. На побережье тепловые насосы и тёплые полы всё чаще ставят при ремонте, а многие квартиры отапливаются кондиционерами.",
      faq: [
        {
          q: "Когда лучше обслуживать котёл?",
          a: "До начала сезона, в конце лета или начале осени, пока мастера не заняты аварийными вызовами. Для пеллетных и дровяных котлов нужна ещё и чистка дымохода.",
        },
        {
          q: "Почему радиатор греет только снизу или не греет совсем?",
          a: "Чаще всего в нём воздух или осадок. Спустить воздух можно самостоятельно, а если не помогло, нужна промывка системы или проверка насоса.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От типа системы, площади, того, новая это установка или обслуживание, и от выбранного оборудования. Для монтажа всегда нужен осмотр на месте.",
        },
        {
          q: "Стоит ли ставить тепловой насос на побережье?",
          a: "В мягком климате побережья тепловые насосы работают эффективно и летом могут охлаждать. Окупаемость зависит от утепления дома, поэтому попросите расчёт.",
        },
        {
          q: "Приедут ли срочно, если отопление остановится зимой?",
          a: "Некоторые мастера выезжают на аварии и в выходные, но не все. Проверьте часы работы в профиле и сохраните номер заранее.",
        },
      ],
      tips: [
        "Записывайтесь на обслуживание в сентябре, до холодов и очередей.",
        "Для монтажа возьмите минимум два предложения с перечнем оборудования и марок.",
        "Уточните, кто будет обслуживать систему после установки и где брать запчасти.",
        "Перед покупкой теплового насоса проверьте утепление — от него зависят расходы.",
      ],
    },
  },

  "upravljanje-apartmanima": {
    me: {
      description:
        "Kompletno ili djelimično vođenje apartmana za kratkoročni najam: oglasi na Airbnb-u i Bookingu, cijene po sezoni, komunikacija sa gostima, check-in i predaja ključeva, čišćenje, veš i sitne popravke. Najviše koriste vlasnici koji žive u inostranstvu ili drugom gradu, a apartman im je u Budvi, Kotoru, Tivtu, Baru ili Herceg Novom. Upravitelj obično naplaćuje procenat od prihoda ili fiksni iznos po usluzi, zavisno od dogovora.",
      faq: [
        {
          q: "Šta je sve uključeno u upravljanje?",
          a: "Zavisi od paketa: neki rade samo oglase i komunikaciju, drugi sve od fotografisanja do čišćenja i održavanja. Traži pisani spisak usluga i šta se posebno naplaćuje.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Da li je u pitanju procenat od prihoda ili fiksna naknada, koliko je usluga uključeno i broj jedinica. Čišćenje, veš i popravke često se naplaćuju odvojeno od provizije.",
        },
        {
          q: "Kako ću znati koliko apartman zarađuje?",
          a: "Ozbiljni upravitelji šalju mjesečni izvještaj sa rezervacijama, prihodima i troškovima. Dogovori pristup nalogu na platformi da i sam možeš pratiti rezervacije.",
        },
        {
          q: "Ko se bavi prijavom gostiju i boravišnom taksom?",
          a: "Neki upravitelji to preuzimaju, ali odgovornost prema propisima ostaje na vlasniku. Pitaj šta tačno rade i provjeri obaveze kod turističke organizacije ili opštine.",
        },
        {
          q: "Da li rade i van sezone?",
          a: "Mnogi vode apartmane cijelu godinu i nude mjesečni najam zimi. Ako je apartman zatvoren van sezone, dogovori povremene obilaske zbog vlage i kvarova.",
        },
      ],
      tips: [
        "Traži reference i linkove ka apartmanima kojima već upravljaju.",
        "Neka ugovor jasno navede proviziju, dodatne troškove i otkazni rok.",
        "Dogovori da popravke preko određenog iznosa moraju prvo dobiti tvoje odobrenje.",
        "Zadrži vlasnički pristup nalozima na platformama, ne prepuštaj sve upravitelju.",
      ],
    },
    en: {
      description:
        "Full or partial management of short-term rentals: Airbnb and Booking.com listings, seasonal pricing, guest messaging, check-ins and key handover, cleaning, laundry and small repairs. It is used mostly by owners who live abroad or in another town while their apartment is in Budva, Kotor, Tivat, Bar or Herceg Novi. Managers usually charge a percentage of booking income or fixed fees per service, depending on the agreement.",
      faq: [
        {
          q: "What does management include?",
          a: "It depends on the package: some only handle listings and guest communication, others cover everything from photos to cleaning and maintenance. Ask for a written list of services and extras.",
        },
        {
          q: "What affects the price?",
          a: "Whether it is a commission or a fixed fee, how many services are included and how many units you have. Cleaning, laundry and repairs are often billed on top of the commission.",
        },
        {
          q: "How will I know what the apartment earns?",
          a: "A serious manager sends a monthly report with bookings, income and costs. Keep your own access to the platform accounts so you can check bookings yourself.",
        },
        {
          q: "Who handles guest registration and tourist tax?",
          a: "Some managers take this on, but legal responsibility generally stays with the owner. Ask exactly what they do and confirm your obligations with the local tourist organisation or municipality.",
        },
        {
          q: "Do they manage apartments outside the season?",
          a: "Many work year-round and can arrange monthly winter lets. If the place stays closed off-season, agree on regular checks for damp and leaks.",
        },
      ],
      tips: [
        "Ask for references and links to listings they already manage.",
        "Make sure the contract states the commission, extra costs and notice period.",
        "Agree that repairs above a set amount need your approval first.",
        "Keep owner access to your platform accounts rather than handing everything over.",
      ],
    },
    ru: {
      description:
        "Полное или частичное управление посуточной арендой: объявления на Airbnb и Booking, сезонные цены, переписка с гостями, заселение и передача ключей, уборка, стирка и мелкий ремонт. Чаще всего услугой пользуются владельцы, которые живут за границей или в другом городе, а апартаменты у них в Будве, Которе, Тивате, Баре или Херцег-Нови. Управляющие обычно берут процент от дохода или фиксированную плату за услуги — по договорённости.",
      faq: [
        {
          q: "Что входит в управление?",
          a: "Зависит от пакета: одни ведут только объявления и общение с гостями, другие берут всё — от фотосъёмки до уборки и обслуживания. Попросите письменный список услуг и доплат.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От формы оплаты (процент или фиксированная сумма), объёма услуг и количества объектов. Уборка, стирка и ремонт часто оплачиваются сверх комиссии.",
        },
        {
          q: "Как я узнаю, сколько приносят апартаменты?",
          a: "Серьёзный управляющий присылает ежемесячный отчёт по бронированиям, доходам и расходам. Сохраните собственный доступ к аккаунтам на платформах.",
        },
        {
          q: "Кто регистрирует гостей и платит туристический налог?",
          a: "Некоторые управляющие берут это на себя, но ответственность, как правило, остаётся за владельцем. Уточните, что именно они делают, и проверьте свои обязанности в местной туристической организации или муниципалитете.",
        },
        {
          q: "Работают ли вне сезона?",
          a: "Многие работают круглый год и могут найти помесячных арендаторов на зиму. Если квартира зимой закрыта, договоритесь о регулярных проверках на сырость и протечки.",
        },
      ],
      tips: [
        "Попросите рекомендации и ссылки на объекты, которыми они уже управляют.",
        "В договоре должны быть комиссия, дополнительные расходы и срок расторжения.",
        "Оговорите, что ремонт дороже определённой суммы согласуется с вами.",
        "Не передавайте полностью аккаунты на платформах — оставьте себе доступ владельца.",
      ],
    },
  },

  "transfer-sa-aerodroma": {
    me: {
      description:
        "Prevoz sa i do aerodroma Podgorica i Tivat, kao i Dubrovnik u Hrvatskoj, koji mnogi koriste za letove ka Herceg Novom i Boki. Nudi se u putničkim automobilima, kombijima za porodice i veće grupe, a po dogovoru i sa dječjim sjedištem ili mjestom za bicikl i sportsku opremu. Vozač prati let i čeka te u dolaznom holu, što je praktično kad kasniš noću ili stižeš u sezoni kad je taksija malo.",
      faq: [
        {
          q: "Šta ako mi let kasni?",
          a: "Većina prevoznika prati let po broju i prilagodi dolazak. Pitaj koliko besplatnog čekanja je uključeno i da li se naplaćuje čekanje poslije toga.",
        },
        {
          q: "Da li voze i do Dubrovnika?",
          a: "Mnogi voze, ali to znači prelazak granice, pa računaj na moguće čekanje na prelazu u sezoni. Ponesi pasoš ili ličnu kartu i provjeri da li prevoznik ima dozvolu za međunarodni prevoz.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Udaljenost, vrsta vozila, broj putnika i prtljaga, noćna vožnja i prelazak granice. Dogovori fiksnu cijenu unaprijed da ne bude iznenađenja.",
        },
        {
          q: "Da li mogu dobiti dječje sjedište?",
          a: "Mnogi prevoznici ga imaju, ali ga treba tražiti pri rezervaciji. Navedi uzrast djeteta da dobiješ odgovarajuće sjedište.",
        },
        {
          q: "Da li izdaju račun?",
          a: "Registrovani prevoznici izdaju račun, što je važno ako putuješ poslovno. Pitaj unaprijed ako ti treba račun na firmu.",
        },
      ],
      tips: [
        "Pošalji broj leta, broj putnika i komada prtljaga pri rezervaciji.",
        "U sezoni rezerviši transfer bar nekoliko dana ranije.",
        "Sačuvaj broj vozača i dogovori mjesto susreta u dolaznom holu.",
        "Za Dubrovnik ostavi dovoljno vremena za granicu, posebno u julu i avgustu.",
      ],
    },
    en: {
      description:
        "Private transfers to and from Podgorica and Tivat airports, and from Dubrovnik in Croatia, which many travellers use for Herceg Novi and the Bay of Kotor. Options range from saloon cars to minivans for families and groups, with child seats or space for bikes and sports gear on request. Drivers track your flight and meet you in arrivals, which helps with late-night landings and summer, when taxis at the airport can be scarce.",
      faq: [
        {
          q: "What if my flight is delayed?",
          a: "Most drivers track the flight number and adjust the pickup. Ask how much free waiting time is included and whether extra waiting is charged.",
        },
        {
          q: "Can I book a transfer from Dubrovnik airport?",
          a: "Yes, many operators do it, but it involves a border crossing that can mean queues in summer. Bring your passport and check the operator is licensed for international transport.",
        },
        {
          q: "What affects the price?",
          a: "Distance, vehicle type, number of passengers and bags, night-time driving and border crossings. Agree a fixed price in advance to avoid surprises.",
        },
        {
          q: "Can I request a child seat?",
          a: "Many operators have them, but you need to ask when booking. Give the child's age so they bring the right type.",
        },
        {
          q: "How do I pay, and can I get a receipt?",
          a: "Some accept cards, while others prefer cash in euros, so check when booking. Registered operators can issue a receipt or invoice.",
        },
      ],
      tips: [
        "Share your flight number, passenger count and luggage when booking.",
        "In summer, book at least a few days ahead.",
        "Save the driver's number and confirm the meeting point in arrivals.",
        "Allow extra time for the border when travelling via Dubrovnik in July and August.",
      ],
    },
    ru: {
      description:
        "Индивидуальный трансфер из аэропортов Подгорицы и Тивата, а также из Дубровника в Хорватии, через который многие летят в Херцег-Нови и Боку Которску. Можно заказать легковой автомобиль или минивэн для семьи и группы, по запросу — с детским креслом или местом для велосипеда и спортивного снаряжения. Водитель отслеживает рейс и встречает в зоне прилёта, что удобно при ночных рейсах и летом, когда такси в аэропорту не хватает.",
      faq: [
        {
          q: "Что будет, если рейс задержится?",
          a: "Большинство водителей отслеживают рейс по номеру и подстраиваются. Уточните, сколько бесплатного ожидания включено и платное ли ожидание сверх него.",
        },
        {
          q: "Можно ли заказать трансфер из аэропорта Дубровника?",
          a: "Да, многие перевозчики это делают, но нужно пересечь границу, где летом бывают очереди. Возьмите паспорт и уточните, есть ли у перевозчика лицензия на международные перевозки.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От расстояния, типа автомобиля, количества пассажиров и багажа, ночного времени и пересечения границы. Договоритесь о фиксированной цене заранее.",
        },
        {
          q: "Будет ли детское кресло?",
          a: "У многих перевозчиков оно есть, но его нужно заказать при бронировании. Укажите возраст ребёнка, чтобы привезли подходящее.",
        },
        {
          q: "Как оплатить и можно ли получить чек?",
          a: "Одни принимают карты, другие предпочитают наличные евро — уточните при бронировании. Зарегистрированные перевозчики выдают чек или счёт.",
        },
      ],
      tips: [
        "При бронировании сообщите номер рейса, число пассажиров и мест багажа.",
        "Летом бронируйте трансфер хотя бы за несколько дней.",
        "Сохраните номер водителя и уточните место встречи в зоне прилёта.",
        "Через Дубровник в июле и августе закладывайте время на границу.",
      ],
    },
  },
};
