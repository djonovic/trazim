import type { ServiceContent } from "./types";

export const content: Record<string, ServiceContent> = {
  vodoinstalater: {
    me: {
      description:
        "Vodoinstalater rješava curenja, začepljene odvode, zamjenu slavina, kotlića i bojlera, kao i razvod vode u novim ili renoviranim stanovima. Na primorju voda ima dosta kamenca, pa se bojleri, grijači i perlatori češće čiste i mijenjaju, a na sjeveru zimi zna da se desi da cijevi zamrznu i puknu. Vrijedi pozvati majstora čim primijetiš mrlju na plafonu ili pad pritiska, jer mala curenja brzo postanu skupa šteta.",
      faq: [
        {
          q: "Da li vodoinstalater dolazi vikendom i za hitne slučajeve?",
          a: "Neki rade i vikendom i noću, posebno za pukle cijevi i poplave, ali to se obično naplaćuje više. Provjeri na profilu radno vrijeme i oznaku „Hitno 0–24“, a u međuvremenu zatvori glavni ventil.",
        },
        {
          q: "Koliko traje zamjena bojlera?",
          a: "Ako se novi bojler kači na iste priključke, posao obično traje nekoliko sati. Duže traje ako treba mijenjati ventile, cijevi ili nosače u zidu.",
        },
        {
          q: "Koliko često treba čistiti bojler od kamenca?",
          a: "Na primorju, gdje je voda tvrda, mnogi majstori preporučuju čišćenje i provjeru anode otprilike jednom godišnje ili na dvije godine. Ako bojler šumi, sporo grije ili često izbacuje osigurač, vrijeme je za servis.",
        },
        {
          q: "Šta utiče na cijenu intervencije?",
          a: "Najviše vrsta kvara, pristup cijevima (da li treba razbijati pločice), materijal i da li je hitna intervencija van radnog vremena. Neki naplaćuju i izlazak na teren, pa to pitaj unaprijed.",
        },
        {
          q: "Šta da uradim dok čekam majstora zbog curenja?",
          a: "Zatvori ventil ispod elementa ili glavni ventil kod vodomjera i isključi bojler iz struje ako curi blizu njega. Uslikaj mjesto curenja da majstor zna šta da ponese.",
        },
      ],
      tips: [
        "Pošalji majstoru kratak video kvara, pa će lakše procijeniti posao i ponijeti pravi dio.",
        "Dogovori unaprijed ko kupuje slavinu, bojler ili sanitariju i ko snosi rizik ako dio ne odgovara.",
        "Pitaj da li daje garanciju na izvedeni rad i da li izdaje fiskalni račun.",
        "Znaj gdje ti je glavni ventil prije nego što ti zatreba.",
      ],
    },
    en: {
      description:
        "A plumber fixes leaks, blocked drains, dripping taps, running toilets and electric water heaters (boilers), and installs pipework in new or renovated flats. Coastal Montenegro has hard, limescale-heavy water, so boilers, heating elements and tap aerators clog faster, while in the north pipes can freeze and burst in winter. If you rent, check with your landlord first, but don't wait long on a leak: it can quickly damage the flat below.",
      faq: [
        {
          q: "Can I get a plumber at night or on the weekend?",
          a: "Some plumbers take emergency calls for burst pipes and flooding, usually at a higher rate. Look for the “Hitno 0–24” (urgent 24/7) label and working hours on the profile, and shut off the main valve while you wait.",
        },
        {
          q: "How long does it take to replace a water heater?",
          a: "A straight swap onto the existing connections usually takes a few hours. It takes longer if valves, pipes or wall brackets also need replacing.",
        },
        {
          q: "Why does my boiler keep making noise or tripping the power?",
          a: "On the coast this is very often limescale on the heating element or a worn-out anode. A plumber can descale it and check the anode, which many recommend doing every year or two.",
        },
        {
          q: "What affects the price?",
          a: "The type of problem, how easy the pipes are to reach (tiles may have to come off), parts, and whether it is an out-of-hours emergency. Some plumbers charge a call-out fee, so ask before they come.",
        },
        {
          q: "Do plumbers speak English?",
          a: "Many in coastal towns manage basic English, but not all. Photos or a short video of the problem, sent by message, help a lot either way.",
        },
      ],
      tips: [
        "Find the main water valve (usually by the meter) as soon as you move in.",
        "Send a video of the leak or blockage so the plumber brings the right parts.",
        "Agree who buys the tap, toilet or heater, and whether the plumber guarantees the work.",
        "Ask for a fiscal receipt (fiskalni račun) if your landlord will reimburse you.",
      ],
    },
    ru: {
      description:
        "Сантехник устраняет протечки и засоры, меняет смесители, бачки и электрические бойлеры, прокладывает трубы при ремонте квартиры. На побережье Черногории вода жёсткая, с большим количеством известкового налёта, поэтому бойлеры и аэраторы забиваются быстрее, а на севере зимой трубы могут замёрзнуть и лопнуть. Если вы снимаете жильё, сначала сообщите хозяину, но с протечкой лучше не тянуть: вода быстро доходит до соседей снизу.",
      faq: [
        {
          q: "Можно ли вызвать сантехника ночью или в выходные?",
          a: "Некоторые мастера выезжают на аварии круглосуточно, но это обычно дороже. Смотрите часы работы и отметку «Hitno 0–24» в профиле, а пока ждёте, перекройте главный кран.",
        },
        {
          q: "Сколько времени занимает замена бойлера?",
          a: "Если новый бойлер ставится на старые подключения, обычно хватает нескольких часов. Дольше, если нужно менять краны, трубы или крепления в стене.",
        },
        {
          q: "Как часто чистить бойлер от накипи?",
          a: "На побережье многие мастера советуют чистку и проверку магниевого анода раз в год-два. Шум, медленный нагрев и выбивающий автомат — частые признаки накипи.",
        },
        {
          q: "От чего зависит стоимость работы?",
          a: "От вида неисправности, доступа к трубам (иногда приходится снимать плитку), материалов и срочности. Некоторые мастера берут плату за выезд — уточните это заранее.",
        },
        {
          q: "Что сделать до приезда мастера?",
          a: "Перекройте воду краном под прибором или главным краном у счётчика и отключите бойлер от сети, если течёт рядом с ним. Сфотографируйте место протечки.",
        },
      ],
      tips: [
        "Сразу после заселения найдите главный кран — обычно он возле счётчика воды.",
        "Отправьте мастеру видео проблемы, чтобы он взял нужные детали.",
        "Договоритесь, кто покупает сантехнику и даёт ли мастер гарантию на работу.",
        "Попросите фискальный чек (fiskalni račun), если расходы компенсирует хозяин квартиры.",
      ],
    },
  },

  elektricar: {
    me: {
      description:
        "Električar radi nove instalacije i zamjenu starih, postavlja utičnice, prekidače, rasvjetu i razvodne table, povezuje šporete, bojlere i klima uređaje i traži uzrok kad osigurač stalno izbacuje. U mnogim starijim zgradama instalacije su stare decenijama i nijesu predviđene za klimu, indukcionu ploču i bojler koji rade istovremeno. Priključak i brojilo su u nadležnosti distributera (CEDIS), a sve iza brojila je posao za tvog električara.",
      faq: [
        {
          q: "Zašto mi stalno izbacuje osigurač ili FID sklopka?",
          a: "Najčešće je u pitanju preopterećen strujni krug, vlaga u utičnici ili neispravan uređaj. Električar mjerenjem nađe uzrok, pa nemoj samo mijenjati osigurač jačim.",
        },
        {
          q: "Da li se isplati mijenjati kompletnu instalaciju u starom stanu?",
          a: "Ako su provodnici stari, bez uzemljenja ili se utičnice griju, zamjena je pitanje sigurnosti. Najbolje je to uraditi zajedno sa renoviranjem, dok se zidovi ionako otvaraju.",
        },
        {
          q: "Da li električar dolazi i za hitne kvarove?",
          a: "Neki imaju dežurstvo i vikendom, ali ne svi. Provjeri radno vrijeme i oznaku za hitne intervencije na profilu, a ako nestane struje u cijeloj zgradi, prvo se javi distributeru.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Obim posla, da li se kablovi vode kroz zid ili u kanalicama, broj tačaka (utičnice, svjetla), materijal i hitnost. Pitaj da li su materijal i izlazak na teren uračunati u ponudu.",
        },
        {
          q: "Šta da pripremim prije dolaska električara?",
          a: "Opiši ili uslikaj problem i razvodnu tablu, i oslobodi pristup tabli i mjestu rada. Ako kupuješ lustere ili uređaje sam, neka budu na licu mjesta.",
        },
      ],
      tips: [
        "Za veće radove traži pisanu ponudu sa spiskom materijala i brojem tačaka.",
        "Pitaj da li će nakon posla označiti osigurače na tabli po prostorijama.",
        "Provjeri recenzije i fotografije prethodnih radova, posebno uredno složenih tabli.",
        "Dogovori garanciju na rad i fiskalni račun prije početka posla.",
      ],
    },
    en: {
      description:
        "An electrician installs and replaces wiring, sockets, switches, lighting and fuse boards, connects cookers, water heaters and air conditioners, and tracks down why a breaker keeps tripping. Many older Montenegrin buildings have decades-old wiring that was never meant for an AC unit, induction hob and boiler running at the same time. The grid connection and meter belong to the distributor (CEDIS); everything after the meter is a job for your electrician.",
      faq: [
        {
          q: "Why does my breaker or RCD keep tripping?",
          a: "Usually an overloaded circuit, damp in a socket (common on the coast) or a faulty appliance. An electrician can test and find the cause; don't just fit a stronger fuse.",
        },
        {
          q: "Can the electrician install my air conditioner?",
          a: "Many electricians will run a dedicated circuit and socket for it, while the unit itself is often mounted by an AC installer. Ask whether one person handles both.",
        },
        {
          q: "The power is out in the whole building. Who do I call?",
          a: "Check with neighbours first; if everyone is out, it is a grid issue for CEDIS, not an electrician. If only your flat is out, check your fuse board and then call an electrician.",
        },
        {
          q: "What affects the price?",
          a: "The scope of work, whether cables go inside walls or in surface trunking, the number of points, materials and urgency. Ask if materials and the call-out are included in the quote.",
        },
        {
          q: "Is it safe to use UK/US appliances here?",
          a: "Montenegro uses 230 V and European (Schuko-type) sockets. A plug adapter is fine for 230 V devices, but 110–120 V-only appliances need a converter, which an electrician can advise on.",
        },
      ],
      tips: [
        "Take a photo of your fuse board and send it with a description of the problem.",
        "For bigger jobs, get a written quote listing materials and the number of sockets and lights.",
        "Ask the electrician to label each breaker by room when the job is done.",
        "Look for photos of previous fuse board work in the profile; tidy boards say a lot.",
      ],
    },
    ru: {
      description:
        "Электрик прокладывает и меняет проводку, ставит розетки, выключатели, светильники и электрощиты, подключает плиты, бойлеры и кондиционеры, ищет причину, почему выбивает автомат. Во многих старых домах Черногории проводка рассчитана на гораздо меньшую нагрузку, чем кондиционер, индукционная плита и бойлер одновременно. Подключение к сети и счётчик — зона ответственности распределительной компании (CEDIS), всё после счётчика делает ваш электрик.",
      faq: [
        {
          q: "Почему постоянно выбивает автомат или УЗО?",
          a: "Чаще всего это перегруженная линия, влага в розетке (частая история на побережье) или неисправный прибор. Электрик найдёт причину замерами — не ставьте просто более мощный автомат.",
        },
        {
          q: "Стоит ли менять всю проводку в старой квартире?",
          a: "Если провода старые, без заземления или розетки греются, это вопрос безопасности. Удобнее всего делать это во время ремонта, пока стены всё равно вскрыты.",
        },
        {
          q: "Во всём доме нет света — кому звонить?",
          a: "Если света нет у соседей тоже, это авария в сети, обращайтесь в CEDIS. Если только у вас — проверьте щиток и вызывайте электрика.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От объёма работ, скрытой или открытой проводки, количества точек, материалов и срочности. Уточните, входят ли в смету материалы и выезд.",
        },
        {
          q: "Что подготовить до приезда электрика?",
          a: "Сфотографируйте щиток и проблемное место, освободите к ним доступ. Если люстры или приборы покупаете сами, пусть они будут на месте.",
        },
      ],
      tips: [
        "Для крупных работ просите письменную смету с перечнем материалов и точек.",
        "Попросите подписать автоматы в щитке по комнатам после работы.",
        "Посмотрите в профиле фото прошлых работ — аккуратный щиток многое говорит о мастере.",
        "Заранее обсудите гарантию и фискальный чек.",
      ],
    },
  },

  "kucni-majstor": {
    me: {
      description:
        "Kućni majstor preuzima sitne poslove koji se skupljaju po kući: kačenje polica, ogledala i TV nosača, sklapanje namještaja, zamjenu kvaka, sijalica i silikona u kupatilu, podešavanje vrata i sitne popravke. Posebno je koristan vlasnicima apartmana prije sezone i između gostiju, kad treba brzo srediti više sitnica odjednom. Za veće radove na struji, vodi ili gasu bolje je zvati specijalizovanog majstora.",
      faq: [
        {
          q: "Koje poslove kućni majstor obično ne radi?",
          a: "Najčešće ne radi veće radove na elektro i vodovodnim instalacijama, krovove i poslove za koje treba posebna oprema. Pitaj unaprijed, jer neki imaju širi spektar od drugih.",
        },
        {
          q: "Da li mogu da skupim više sitnih poslova za jedan dolazak?",
          a: "Da, i to se najviše isplati. Napravi spisak sa fotografijama, pa će majstor znati koliko mu vremena i alata treba.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj i vrsta poslova, potrebno vrijeme, da li majstor donosi materijal i koliko daleko dolazi. Neki naplaćuju po satu, neki po poslu, pa to razjasni prije dolaska.",
        },
        {
          q: "Da li kućni majstor dolazi i kad nijesam kod kuće?",
          a: "Mnogi rade za vlasnike apartmana koji su van grada, uz ključ ostavljen kod komšije ili upravnika. Dogovori jasno šta treba uraditi i traži fotografije poslije.",
        },
        {
          q: "Mogu li da zidove bušim bilo gdje?",
          a: "Ne, u zidovima mogu biti kablovi i cijevi. Dobar majstor provjeri detektorom ili pita gdje idu instalacije prije bušenja.",
        },
      ],
      tips: [
        "Napiši spisak svih sitnica prije poziva, pa završi sve u jednom dolasku.",
        "Kupi unaprijed tiple i šarafe odgovarajuće za zid ili pitaj majstora da ih donese.",
        "Pitaj da li naplaćuje po satu ili po poslu i koliki je minimum.",
        "Provjeri recenzije drugih vlasnika apartmana ako ti treba pouzdan majstor za sezonu.",
      ],
    },
    en: {
      description:
        "A handyman takes care of the small jobs that pile up: hanging shelves, mirrors and TV brackets, assembling flat-pack furniture, replacing handles, bulbs and bathroom silicone, adjusting doors and minor repairs. Holiday-let owners in Montenegro often book one before the season or between guests to clear a whole list in one visit. For serious electrical, plumbing or gas work, call a specialist instead.",
      faq: [
        {
          q: "What does a handyman usually not do?",
          a: "Typically major electrical or plumbing work, roofing and anything needing special equipment or certification. Scope varies a lot, so ask first.",
        },
        {
          q: "Can I book several small jobs in one visit?",
          a: "Yes, and it is usually the best value. Send a list with photos so they know what time and tools to bring.",
        },
        {
          q: "What affects the price?",
          a: "The number and type of jobs, the time needed, whether they bring materials and travel distance. Some charge by the hour, some per job, and many have a minimum charge.",
        },
        {
          q: "Can they work while I am away?",
          a: "Many handymen work for absentee apartment owners, with keys left with a neighbour or property manager. Be specific about the tasks and ask for photos when done.",
        },
        {
          q: "Can they assemble furniture I ordered online?",
          a: "Yes, flat-pack assembly is one of the most common requests. Mention the item and number of boxes so they can estimate the time.",
        },
      ],
      tips: [
        "Write a full to-do list before calling so everything gets done in one trip.",
        "Ask whether they charge per hour or per job, and what the minimum is.",
        "Check reviews from other landlords if you need someone reliable during the season.",
        "If you rent, get the landlord's OK before drilling walls or changing fittings.",
      ],
    },
    ru: {
      description:
        "Мастер на час берёт на себя мелкие домашние работы: повесить полки, зеркало или кронштейн для телевизора, собрать мебель, поменять ручки, лампочки и силикон в ванной, отрегулировать двери. В Черногории их часто зовут владельцы апартаментов перед туристическим сезоном и между гостями, чтобы закрыть весь список за один визит. Для серьёзной электрики, сантехники или газа лучше вызвать профильного специалиста.",
      faq: [
        {
          q: "Какие работы мастер на час обычно не делает?",
          a: "Как правило, крупные работы по электрике и сантехнике, кровлю и то, что требует специального оборудования. Набор услуг у всех разный, поэтому уточняйте заранее.",
        },
        {
          q: "Можно ли собрать несколько мелких задач на один визит?",
          a: "Да, так обычно выгоднее всего. Пришлите список с фотографиями, чтобы мастер понимал, сколько времени и инструментов нужно.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества и типа задач, времени, того, привозит ли мастер материалы, и расстояния. Одни берут почасовую оплату, другие — за задачу, у многих есть минимальная сумма.",
        },
        {
          q: "Может ли мастер работать, пока меня нет?",
          a: "Многие работают с владельцами, которые живут в другом городе или стране: ключи оставляют соседу или управляющему. Чётко опишите задачи и попросите фото результата.",
        },
        {
          q: "Можно ли сверлить стены где угодно?",
          a: "Нет, в стенах могут проходить провода и трубы. Хороший мастер проверит детектором или спросит, где идёт проводка.",
        },
      ],
      tips: [
        "Составьте полный список задач до звонка, чтобы всё сделать за один приезд.",
        "Уточните, оплата почасовая или за задачу и есть ли минимальный заказ.",
        "Посмотрите отзывы других владельцев апартаментов, если нужен надёжный мастер на сезон.",
        "Если вы арендуете жильё, согласуйте сверление и замену фурнитуры с хозяином.",
      ],
    },
  },

  moler: {
    me: {
      description:
        "Moler kreči i farba zidove i plafone, gletuje, sanira pukotine i mrlje, farba stolariju i radijatore i radi dekorativne tehnike. Na primorju je čest problem buđ u uglovima i iza namještaja, pa dobar moler prvo tretira podlogu i savjetuje o provjetravanju, umjesto da samo pređe preko bojom. Vlasnici apartmana najčešće osvježavaju zidove u proljeće, prije sezone, pa se termini tada brzo popune.",
      faq: [
        {
          q: "Koliko traje krečenje stana?",
          a: "Za prosječan stan u kojem treba samo osvježiti zidove obično je dovoljno nekoliko dana. Ako treba gletovanje i saniranje pukotina, posao traje duže jer svaki sloj mora da se osuši.",
        },
        {
          q: "Da li je gletovanje neophodno?",
          a: "Ne uvijek. Ako su zidovi ravni i bez oštećenja, dovoljna je priprema i boja, a gletovanje se radi kad su zidovi neravni ili puni rupa i pukotina.",
        },
        {
          q: "Šta da radim sa buđi prije krečenja?",
          a: "Buđ treba očistiti i tretirati sredstvom protiv buđi, a zatim koristiti boju namijenjenu vlažnim prostorijama. Ako se buđ stalno vraća, uzrok je vlaga ili loše provjetravanje i to treba riješiti prvo.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Kvadratura zidova i plafona, stanje podloge, broj slojeva, vrsta boje i da li se radi gletovanje. Utiče i to da li je stan prazan ili treba pomjerati i zaštititi namještaj.",
        },
        {
          q: "Ko kupuje boju?",
          a: "Zavisi od dogovora: neki moleri uračunaju materijal u cijenu, a neki traže da ga kupiš sam po njihovom spisku. Dogovori marku i nijansu unaprijed i traži da ti se pokaže proba na zidu.",
        },
      ],
      tips: [
        "Traži ponudu po kvadratu sa jasno navedenim da li su uključeni gletovanje i materijal.",
        "Isprazni ili skupi namještaj na sredinu prostorije prije dolaska molera.",
        "Zatraži probnu nijansu na zidu, jer boja na uzorku često izgleda drugačije.",
        "Za apartmane rezerviši termin rano u proljeće, prije gužve pred sezonu.",
      ],
    },
    en: {
      description:
        "A painter and decorator paints walls and ceilings, skims and fills cracks, removes stains, paints doors, window frames and radiators and does decorative finishes. On the Montenegrin coast, mould in corners and behind furniture is common, so a good painter treats the surface and suggests ventilation fixes instead of just painting over it. Apartment owners usually repaint in spring before the season, when painters get booked up quickly.",
      faq: [
        {
          q: "How long does it take to paint a flat?",
          a: "A simple refresh of an average flat usually takes a few days. Skimming and crack repair add time, because each layer needs to dry.",
        },
        {
          q: "The mould keeps coming back. Will painting fix it?",
          a: "Not on its own. The mould needs cleaning and treating, then an anti-mould paint, but if the cause is damp or poor ventilation it will return until that is fixed.",
        },
        {
          q: "What affects the price?",
          a: "Wall and ceiling area, the condition of the surface, number of coats, paint type and whether skimming is needed. An empty flat is quicker than one full of furniture to move and cover.",
        },
        {
          q: "Who buys the paint?",
          a: "Some painters include materials, others give you a shopping list. Agree the brand and colour in advance and ask for a test patch on the wall.",
        },
        {
          q: "Can I repaint a rented flat?",
          a: "Only with the landlord's agreement, ideally in writing, including the colour. Many landlords expect walls returned in white or the original shade.",
        },
      ],
      tips: [
        "Ask for a quote per square metre that says whether skimming and paint are included.",
        "Clear or group the furniture in the middle of each room before the painter arrives.",
        "Always test the colour on the wall first; swatches look different in Adriatic light.",
        "For holiday lets, book in early spring before the pre-season rush.",
      ],
    },
    ru: {
      description:
        "Маляр красит стены и потолки, шпаклюет, заделывает трещины и пятна, красит двери, оконные рамы и радиаторы, делает декоративные покрытия. На побережье Черногории частая проблема — плесень в углах и за мебелью, поэтому хороший мастер сначала обрабатывает основание и подсказывает, как наладить проветривание, а не просто закрашивает. Владельцы апартаментов обычно обновляют стены весной, перед сезоном, и в это время мастера заняты.",
      faq: [
        {
          q: "Сколько времени занимает покраска квартиры?",
          a: "Простое освежение стен в обычной квартире обычно занимает несколько дней. Шпаклёвка и ремонт трещин добавляют время, потому что каждый слой должен высохнуть.",
        },
        {
          q: "Обязательно ли шпаклевать стены?",
          a: "Не всегда. Если стены ровные и без повреждений, достаточно подготовки и краски; шпаклёвка нужна при неровностях, дырах и трещинах.",
        },
        {
          q: "Плесень возвращается — поможет ли покраска?",
          a: "Сама по себе нет. Плесень нужно очистить и обработать, затем использовать краску для влажных помещений, но если причина во влажности или вентиляции, её нужно устранить в первую очередь.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От площади, состояния стен, количества слоёв, типа краски и необходимости шпаклёвки. Пустая квартира красится быстрее, чем заставленная мебелью.",
        },
        {
          q: "Можно ли перекрасить стены в съёмной квартире?",
          a: "Только с согласия хозяина, лучше письменного и с указанием цвета. Часто хозяева ожидают, что при выезде стены будут белыми или исходного цвета.",
        },
      ],
      tips: [
        "Просите смету за квадратный метр с указанием, входят ли шпаклёвка и краска.",
        "Освободите стены или сдвиньте мебель в центр комнаты до приезда мастера.",
        "Сделайте пробный выкрас на стене — образец в каталоге выглядит иначе.",
        "Для апартаментов бронируйте маляра ранней весной, до предсезонного ажиотажа.",
      ],
    },
  },

  keramicar: {
    me: {
      description:
        "Keramičar postavlja pločice u kupatilima, kuhinjama, na podovima i terasama, mijenja popucale pločice, obnavlja fuge i silikon i radi hidroizolaciju ispod keramike. Na terasama i balkonima na primorju važni su nagib za odvod vode, mrazootporne i neklizajuće pločice i kvalitetna hidroizolacija, jer inače voda završi kod komšije ispod. Posao se često radi uz renoviranje kupatila ili kuhinje, pa ga treba uskladiti sa vodoinstalaterom i električarom.",
      faq: [
        {
          q: "Da li keramičar radi i hidroizolaciju?",
          a: "Većina keramičara radi hidroizolaciju u kupatilima i na terasama prije postavljanja pločica. Pitaj koji materijal koristi i da li je uključen u ponudu.",
        },
        {
          q: "Da li se nove pločice mogu postaviti preko starih?",
          a: "Ponekad mogu, ako su stare čvrsto zalijepljene i ravne, ali se podiže nivo poda i mogu nastati problemi sa vratima i odvodom. Keramičar to treba procijeniti na licu mjesta.",
        },
        {
          q: "Šta utiče na cijenu postavljanja?",
          a: "Kvadratura, format pločica (veliki formati i mozaik traže više rada), stanje podloge, skidanje starih pločica, hidroizolacija i broj uglova i rezova. Za terase utiče i izrada nagiba.",
        },
        {
          q: "Koliko pločica da kupim?",
          a: "Obično se kupuje nekoliko do desetak posto više od kvadrature zbog rezova i loma, a više ako se pločice slažu dijagonalno. Sačuvaj par komada za kasnije popravke.",
        },
        {
          q: "Kad mogu da koristim kupatilo poslije postavljanja?",
          a: "Zavisi od ljepila i fugomase, obično se čeka bar dan ili dva prije punog korišćenja tuša. Pitaj majstora koje vrijeme sušenja preporučuje proizvođač materijala.",
        },
      ],
      tips: [
        "Pogledaj fotografije prethodnih radova i obrati pažnju na ravne fuge i uredne uglove.",
        "Dogovori raspored pločica i početnu tačku prije nego što majstor krene da lijepi.",
        "Kupi sve pločice iz iste serije, jer se nijanse razlikuju između serija.",
        "Traži da ponuda razdvoji rad, ljepilo, fugomasu i hidroizolaciju.",
      ],
    },
    en: {
      description:
        "A tiler lays tiles in bathrooms, kitchens, floors and terraces, replaces cracked tiles, regrouts, redoes silicone and applies waterproofing under the tiles. On coastal terraces and balconies the fall towards the drain, frost-proof non-slip tiles and proper waterproofing matter, or rainwater ends up in the flat below. Tiling is usually part of a bathroom or kitchen renovation, so it needs coordinating with the plumber and electrician.",
      faq: [
        {
          q: "Does the tiler also do waterproofing?",
          a: "Most tilers waterproof bathrooms and terraces before tiling. Ask which product they use and whether it is in the quote.",
        },
        {
          q: "Can new tiles go over old ones?",
          a: "Sometimes, if the old tiles are firmly bonded and level, but it raises the floor and can cause issues with doors and drains. The tiler should assess it on site.",
        },
        {
          q: "What affects the price?",
          a: "Area, tile format (large slabs and mosaics take more work), the state of the surface, removing old tiles, waterproofing and the number of cuts. On terraces, building the right slope adds work.",
        },
        {
          q: "How many extra tiles should I buy?",
          a: "Usually a few to around ten percent extra for cuts and breakage, more for diagonal layouts. Keep a few spares for future repairs.",
        },
        {
          q: "My grout is black and mouldy. Do I need new tiles?",
          a: "Often not. A tiler can rake out and regrout, and replace the silicone, which makes an old bathroom look much fresher.",
        },
      ],
      tips: [
        "Look at photos of previous work and check for straight grout lines and neat corners.",
        "Agree the tile layout and starting point before any tile is fixed.",
        "Buy all tiles from the same batch, since shades vary between batches.",
        "Ask for a quote that separates labour, adhesive, grout and waterproofing.",
      ],
    },
    ru: {
      description:
        "Плиточник укладывает плитку в ванных, на кухнях, полах и террасах, меняет треснувшую плитку, обновляет затирку и силикон, делает гидроизоляцию под плиткой. На террасах и балконах на побережье важны уклон к сливу, морозостойкая нескользкая плитка и надёжная гидроизоляция, иначе вода уходит к соседям снизу. Обычно укладка идёт вместе с ремонтом ванной или кухни, поэтому её стоит согласовать с сантехником и электриком.",
      faq: [
        {
          q: "Делает ли плиточник гидроизоляцию?",
          a: "Большинство плиточников делают гидроизоляцию в ванных и на террасах перед укладкой. Уточните, какой материал используется и входит ли он в смету.",
        },
        {
          q: "Можно ли класть новую плитку поверх старой?",
          a: "Иногда можно, если старая держится крепко и ровно, но пол поднимается, и могут возникнуть проблемы с дверями и сливом. Это мастер должен оценить на месте.",
        },
        {
          q: "От чего зависит стоимость укладки?",
          a: "От площади, формата плитки (крупный формат и мозаика сложнее), состояния основания, демонтажа старой плитки, гидроизоляции и количества подрезок. На террасе — ещё и от формирования уклона.",
        },
        {
          q: "Сколько плитки брать с запасом?",
          a: "Обычно от нескольких до примерно десяти процентов на подрезку и бой, при диагональной укладке больше. Оставьте пару плиток на будущий ремонт.",
        },
        {
          q: "Когда можно пользоваться душем после укладки?",
          a: "Зависит от клея и затирки, обычно ждут хотя бы день-два. Спросите мастера, какое время высыхания указывает производитель.",
        },
      ],
      tips: [
        "Смотрите фото прошлых работ: ровные швы и аккуратные углы — главный признак качества.",
        "Согласуйте раскладку и точку начала укладки до того, как мастер начнёт клеить.",
        "Покупайте всю плитку из одной партии — оттенки между партиями отличаются.",
        "Просите смету с раздельными суммами за работу, клей, затирку и гидроизоляцию.",
      ],
    },
  },

  "gipsani-radovi": {
    me: {
      description:
        "Gipsani radovi obuhvataju spuštene plafone, pregradne zidove, obloge zidova, maske za cijevi i klima vodove, niše i police od gipsanih ploča, kao i pripremu za ugradnju LED rasvjete. Brz su način da podijeliš prostoriju ili sakriješ instalacije bez zidanja i mnogo šuta. Za kupatila i vlažne prostorije na primorju koriste se vodootporne ploče, a u pregradne zidove se može ugraditi i zvučna izolacija.",
      faq: [
        {
          q: "Da li je pregradni zid od gipsa dovoljno čvrst?",
          a: "Za svakodnevnu upotrebu jeste, ali za kačenje teških elemenata poput kuhinjskih ormarića ili TV-a treba unaprijed ugraditi ojačanja. Reci majstoru šta planiraš da kačiš.",
        },
        {
          q: "Može li gips u kupatilo?",
          a: "Može, ali samo vodootporne ploče uz hidroizolaciju na mjestima gdje ide voda. Obična gipsana ploča nije za vlažne prostorije.",
        },
        {
          q: "Koliko traje izrada spuštenog plafona?",
          a: "Za jednu prostoriju konstrukcija i ploče se obično postave za dan-dva, a zatim slijede bandažiranje spojeva, gletovanje i farbanje. Ukupno trajanje zavisi od sušenja i obima.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Kvadratura, vrsta ploča (standardne, vodootporne, vatrootporne), izolacija, broj nivoa i uglova na plafonu i da li je završno gletovanje i farbanje uključeno. Pitaj i za ugradnju rasvjete.",
        },
        {
          q: "Da li gipsar radi i električne instalacije za rasvjetu?",
          a: "Obično priprema otvore i prostor, a kablove vodi električar. Dogovori redoslijed radova da se instalacije postave prije zatvaranja plafona.",
        },
      ],
      tips: [
        "Dogovori raspored rasvjete i utičnica prije zatvaranja zida ili plafona.",
        "Traži da ponuda navede vrstu ploča, profila i izolacije.",
        "Pitaj da li završno gletovanje i farbanje radi isti majstor ili drugi.",
        "Pogledaj fotografije ranijih plafona, posebno spojeve i uglove pod bočnim svjetlom.",
      ],
    },
    en: {
      description:
        "Drywall and plasterboard work covers suspended ceilings, partition walls, wall linings, boxing in pipes and AC lines, niches and shelving, and preparing ceilings for recessed LED lighting. It is a quick way to split a room or hide services without brickwork and heavy debris. In bathrooms and humid coastal flats, moisture-resistant boards are used, and partitions can include sound insulation between rooms.",
      faq: [
        {
          q: "Is a plasterboard partition strong enough?",
          a: "For everyday use, yes, but heavy items like kitchen cabinets or a TV need reinforcement built in. Tell the installer what you plan to hang.",
        },
        {
          q: "Can plasterboard be used in a bathroom?",
          a: "Yes, but only moisture-resistant boards, with waterproofing in wet areas. Standard board is not meant for damp rooms.",
        },
        {
          q: "How long does a suspended ceiling take?",
          a: "For one room, the frame and boards usually go up in a day or two, followed by taping, skimming and painting. Total time depends on drying and scope.",
        },
        {
          q: "What affects the price?",
          a: "Area, board type (standard, moisture- or fire-resistant), insulation, number of levels and corners, and whether finishing and painting are included. Ask about light fittings too.",
        },
        {
          q: "Will it help with noise from neighbours?",
          a: "A lined wall or partition with mineral wool can reduce airborne noise noticeably, though it won't eliminate impact noise from above. Ask the installer what build-up they recommend.",
        },
      ],
      tips: [
        "Plan lights and sockets with the electrician before the wall or ceiling is closed.",
        "Ask for a quote listing board, profile and insulation types.",
        "Check whether the same crew does the final skim and paint.",
        "Look at photos of previous ceilings, especially joints and corners in side light.",
      ],
    },
    ru: {
      description:
        "Гипсокартонные работы — это подвесные потолки, перегородки, обшивка стен, короба для труб и трасс кондиционера, ниши и полки, подготовка потолка под встроенные светильники. Это быстрый способ разделить комнату или спрятать коммуникации без кладки и большого количества мусора. Для ванных и влажных квартир на побережье используют влагостойкий гипсокартон, а в перегородки можно заложить звукоизоляцию.",
      faq: [
        {
          q: "Достаточно ли прочна перегородка из гипсокартона?",
          a: "Для обычной жизни — да, но для тяжёлых кухонных шкафов или телевизора нужно заранее заложить усиление. Скажите мастеру, что планируете вешать.",
        },
        {
          q: "Можно ли использовать гипсокартон в ванной?",
          a: "Можно, но только влагостойкий и с гидроизоляцией в мокрых зонах. Обычный лист для влажных помещений не подходит.",
        },
        {
          q: "Сколько времени делается подвесной потолок?",
          a: "В одной комнате каркас и листы обычно монтируют за день-два, затем идут армирование швов, шпаклёвка и покраска. Общий срок зависит от высыхания и объёма.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От площади, типа листов (обычные, влагостойкие, огнестойкие), утеплителя, количества уровней и углов, а также от того, входят ли финишная шпаклёвка и покраска. Уточните и монтаж светильников.",
        },
        {
          q: "Поможет ли это от шума соседей?",
          a: "Обшивка или перегородка с минеральной ватой заметно снижает воздушный шум, но ударный шум сверху полностью не убирает. Спросите мастера, какую конструкцию он советует.",
        },
      ],
      tips: [
        "Согласуйте расположение светильников и розеток с электриком до закрытия стены.",
        "Просите смету с указанием типа листов, профилей и утеплителя.",
        "Уточните, делает ли та же бригада финишную шпаклёвку и покраску.",
        "Смотрите фото прошлых потолков, особенно швы и углы при боковом свете.",
      ],
    },
  },

  stolar: {
    me: {
      description:
        "Stolar izrađuje namještaj po mjeri, kuhinje, plakare, police i unutrašnja vrata, popravlja i podešava postojeći namještaj i drvenu stolariju. Na primorju su česte drvene škure i grilje koje zbog sunca, soli i vlage treba redovno brusiti, lakirati ili popravljati. Namještaj po mjeri se isplati kad imaš neobične dimenzije, kose zidove ili niše u koje gotov namještaj ne staje.",
      faq: [
        {
          q: "Koliko se čeka na kuhinju ili plakar po mjeri?",
          a: "Zavisi od stolara i materijala, ali od mjerenja do montaže obično prođe nekoliko sedmica. Pred sezonu i pred praznike rokovi se produže, pa pitaj unaprijed.",
        },
        {
          q: "Šta je bolje, iverica, medijapan ili puno drvo?",
          a: "Iverica je najpovoljnija, medijapan je dobar za farbane fronte, a puno drvo je najtrajnije ali i najskuplje. Za kupatila i vlažne prostore pitaj za materijale otporne na vlagu.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Materijal, okov (šarke, klizači, mehanizmi), vrsta fronti, dimenzije, broj elemenata i montaža. Mnogo utiče i da li su uključeni radna ploča, ugradni aparati i sudopera.",
        },
        {
          q: "Da li stolar popravlja stare škure i vrata?",
          a: "Mnogi rade popravke, brušenje i lakiranje drvene stolarije, ali neki se bave samo novim namještajem. Pošalji fotografije i pitaj da li se popravka isplati.",
        },
        {
          q: "Da li dobijam nacrt prije izrade?",
          a: "Većina stolara napravi skicu ili 3D prikaz sa mjerama. Traži ga i provjeri otvaranje vrata, fioka i pristup instalacijama prije nego što se krene u izradu.",
        },
      ],
      tips: [
        "Neka stolar sam izmjeri prostor, pa je on odgovoran ako mjere ne odgovaraju.",
        "Traži da ponuda navede materijal, debljinu ploča i proizvođača okova.",
        "Dogovori rok izrade i montaže pisano, uz avans i ostatak po završetku.",
        "Pogledaj fotografije završenih kuhinja i plakara, posebno ravnomjerne razmake između fronti.",
      ],
    },
    en: {
      description:
        "A carpenter makes fitted furniture, kitchens, wardrobes, shelving and interior doors, and repairs or adjusts existing furniture and woodwork. On the coast, traditional wooden shutters (škure) suffer from sun, salt and damp and need regular sanding, varnishing or repair. Made-to-measure pieces make sense in older Montenegrin flats with odd dimensions, sloping ceilings or alcoves where ready-made furniture doesn't fit.",
      faq: [
        {
          q: "How long does a made-to-measure kitchen take?",
          a: "It depends on the workshop and materials, but from measuring to fitting usually takes several weeks. Lead times get longer before the summer season, so ask early.",
        },
        {
          q: "Chipboard, MDF or solid wood?",
          a: "Melamine chipboard is the cheapest, MDF is good for painted fronts, and solid wood lasts longest but costs most. For humid rooms, ask about moisture-resistant boards.",
        },
        {
          q: "What affects the price?",
          a: "Materials, hardware (hinges, runners, lift mechanisms), front finish, size, number of units and installation. Whether the worktop, sink and built-in appliances are included makes a big difference.",
        },
        {
          q: "Can a carpenter fix old wooden shutters?",
          a: "Many do repairs, sanding and varnishing of shutters and doors, though some only build new furniture. Send photos and ask whether repair is worth it.",
        },
        {
          q: "Will I see a design before they build it?",
          a: "Most carpenters provide a sketch or 3D drawing with measurements. Check door and drawer clearances and access to pipes and sockets before production starts.",
        },
      ],
      tips: [
        "Let the carpenter take the measurements so they are responsible if something doesn't fit.",
        "Ask for a quote that lists board type, thickness and hardware brand.",
        "Agree the build and fitting date in writing, with a deposit and balance on completion.",
        "Check photos of finished kitchens for even gaps between doors and drawers.",
      ],
    },
    ru: {
      description:
        "Столяр делает мебель на заказ: кухни, шкафы-купе, полки, межкомнатные двери, а также ремонтирует и регулирует существующую мебель и деревянные изделия. На побережье традиционные деревянные ставни (škure) страдают от солнца, соли и влажности, и их нужно регулярно шлифовать, лакировать или чинить. Мебель на заказ оправдана в старых квартирах с нестандартными размерами, скошенными потолками и нишами.",
      faq: [
        {
          q: "Сколько ждать кухню или шкаф на заказ?",
          a: "Зависит от мастерской и материалов, но от замера до монтажа обычно проходит несколько недель. Перед сезоном сроки растут, так что договаривайтесь заранее.",
        },
        {
          q: "Что выбрать: ЛДСП, МДФ или массив?",
          a: "ЛДСП самая доступная, МДФ хорош для крашеных фасадов, массив долговечнее всего, но и дороже. Для влажных помещений спросите о влагостойких плитах.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От материалов, фурнитуры (петли, направляющие, подъёмники), фасадов, размеров, количества модулей и монтажа. Сильно влияет, входят ли столешница, мойка и встроенная техника.",
        },
        {
          q: "Ремонтирует ли столяр старые ставни и двери?",
          a: "Многие берутся за ремонт, шлифовку и лакировку, но некоторые делают только новую мебель. Пришлите фото и спросите, имеет ли смысл ремонт.",
        },
        {
          q: "Будет ли проект до начала изготовления?",
          a: "Большинство мастеров делают эскиз или 3D-визуализацию с размерами. Проверьте открывание дверей и ящиков и доступ к трубам и розеткам до запуска в работу.",
        },
      ],
      tips: [
        "Пусть замер делает сам столяр — тогда он отвечает за точность размеров.",
        "Просите смету с указанием материала, толщины плит и производителя фурнитуры.",
        "Фиксируйте сроки изготовления и монтажа письменно, с предоплатой и расчётом после сдачи.",
        "На фото готовых кухонь обращайте внимание на ровные зазоры между фасадами.",
      ],
    },
  },

  bravar: {
    me: {
      description:
        "Bravar radi sa metalom i bravama: otvara zaključana vrata, mijenja cilindre i brave, ugrađuje sigurnosna vrata, izrađuje i popravlja kapije, ograde, gelendere, rešetke na prozorima i nadstrešnice i radi varenje po mjeri. Poslije kupovine ili useljenja u stan korisno je zamijeniti cilindar, jer ne znaš koliko ključeva kruži. Na primorju metalne ograde i kapije brže korodiraju zbog soli, pa je važna dobra zaštita i farbanje.",
      faq: [
        {
          q: "Zaključao sam se napolju. Da li bravar može da otvori vrata bez oštećenja?",
          a: "Često može, zavisno od vrste brave i cilindra, ali kod sigurnosnih brava ponekad mora da se žrtvuje cilindar. Bravar može tražiti dokaz da živiš na toj adresi.",
        },
        {
          q: "Da li je dovoljno zamijeniti samo cilindar?",
          a: "U većini slučajeva jeste, i to je brz i jeftiniji način da stari ključevi prestanu da rade. Ako je brava oštećena ili stara, bravar će predložiti i njenu zamjenu.",
        },
        {
          q: "Da li bravar dolazi noću?",
          a: "Neki imaju dežurstvo 0–24 za otključavanje, uz višu cijenu van radnog vremena. Provjeri oznaku za hitne intervencije i radno vrijeme na profilu.",
        },
        {
          q: "Šta utiče na cijenu kapije ili ograde?",
          a: "Dužina i visina, vrsta i debljina profila, dizajn, zaštita od korozije (cinčanje, plastifikacija, farbanje), automatika za kapiju i montaža. Traži ponudu sa skicom.",
        },
        {
          q: "Da li se ograde i kapije rade po mjeri?",
          a: "Da, bravar obično dođe da izmjeri, napravi skicu i izradi sve u radionici, pa montira na licu mjesta. Rok zavisi od obima posla i trenutne gužve.",
        },
      ],
      tips: [
        "Nakon useljenja zamijeni cilindar na ulaznim vratima i traži sve ključeve na ruke.",
        "Za kapije i ograde na primorju pitaj za cinčanje ili plastifikaciju zbog soli.",
        "Traži skicu i pisanu ponudu sa dimenzijama i vrstom profila.",
        "Sačuvaj karticu za kopiranje sigurnosnih ključeva na sigurnom mjestu.",
      ],
    },
    en: {
      description:
        "In Montenegro a bravar is both a locksmith and a metalworker: they open locked doors, change cylinders and locks, fit security doors, and make or repair gates, fences, railings, window grilles and canopies, including custom welding. Changing the lock cylinder after buying or moving into a flat is a good idea, since you never know how many keys are out there. Metal gates and fences on the coast corrode faster from salt air, so proper protection matters.",
      faq: [
        {
          q: "I'm locked out. Can they open the door without damage?",
          a: "Often, depending on the lock type, but high-security locks sometimes mean sacrificing the cylinder. Expect to be asked for proof that you live there.",
        },
        {
          q: "Is changing just the cylinder enough?",
          a: "Usually yes, and it is a quick way to make old keys useless. If the lock itself is worn or damaged, they will suggest replacing it too.",
        },
        {
          q: "Do locksmiths come out at night?",
          a: "Some offer 24/7 lockout service at a higher out-of-hours rate. Check the profile for an emergency label and working hours.",
        },
        {
          q: "What affects the price of a gate or fence?",
          a: "Length and height, profile type and thickness, design, corrosion protection (galvanising, powder coating, paint), gate automation and installation. Ask for a quote with a sketch.",
        },
        {
          q: "Can they fit window bars or a security door in a rented flat?",
          a: "Technically yes, but you need the landlord's permission since it involves drilling into walls and frames. Get it agreed in writing first.",
        },
      ],
      tips: [
        "Change the front door cylinder when you move in and collect all keys yourself.",
        "For coastal gates and fences, ask about galvanising or powder coating against salt.",
        "Get a sketch and written quote with dimensions and profile types.",
        "Keep the key code card for security keys somewhere safe, not on the key ring.",
      ],
    },
    ru: {
      description:
        "В Черногории bravar — это и слесарь по замкам, и мастер по металлу: вскрывает захлопнувшиеся двери, меняет цилиндры и замки, ставит входные металлические двери, делает и ремонтирует ворота, заборы, перила, решётки на окна и навесы, выполняет сварочные работы. После покупки квартиры или переезда полезно сменить личинку замка — неизвестно, сколько ключей на руках. На побережье металл быстрее ржавеет от морского воздуха, поэтому важна хорошая антикоррозийная защита.",
      faq: [
        {
          q: "Дверь захлопнулась. Можно открыть её без повреждений?",
          a: "Часто да, в зависимости от типа замка, но у сложных замков иногда приходится высверливать цилиндр. Мастер может попросить подтвердить, что вы здесь живёте.",
        },
        {
          q: "Достаточно ли заменить только личинку?",
          a: "Обычно да — это быстрый и недорогой способ сделать старые ключи бесполезными. Если сам замок изношен, мастер предложит заменить и его.",
        },
        {
          q: "Приезжает ли слесарь ночью?",
          a: "Некоторые работают круглосуточно на вскрытие дверей, но в нерабочее время дороже. Смотрите отметку о срочных вызовах и часы работы в профиле.",
        },
        {
          q: "От чего зависит стоимость ворот или забора?",
          a: "От длины и высоты, типа и толщины профиля, дизайна, антикоррозийной защиты (цинкование, порошковая покраска), автоматики и монтажа. Просите смету с эскизом.",
        },
        {
          q: "Можно ли поставить решётки или металлическую дверь в съёмной квартире?",
          a: "Технически да, но нужно разрешение хозяина, так как придётся сверлить стены и коробки. Лучше согласовать это письменно.",
        },
      ],
      tips: [
        "После переезда смените цилиндр входного замка и заберите все ключи лично.",
        "Для ворот и заборов у моря спрашивайте про цинкование или порошковую покраску.",
        "Просите эскиз и письменную смету с размерами и типом профиля.",
        "Храните карточку для дубликатов ключей отдельно от связки.",
      ],
    },
  },

  "renoviranje-kupatila": {
    me: {
      description:
        "Renoviranje kupatila obično znači skidanje starih pločica, zamjenu cijevi i odvoda, hidroizolaciju, novu keramiku, sanitariju, tuš kabinu ili kadu, rasvjetu i ventilaciju. U starijim stanovima često se tek po skidanju pločica vidi stanje cijevi, pa je pametno ostaviti rezervu u budžetu i vremenu. Na primorju je zbog vlage bitan dobar ventilator, a zbog kamenca kvalitetne slavine i tuš sistemi koji se lako čiste.",
      faq: [
        {
          q: "Koliko traje kompletno renoviranje kupatila?",
          a: "Najčešće od jedne do nekoliko sedmica, zavisno od veličine, zamjene instalacija i sušenja hidroizolacije i ljepila. Kašnjenje u isporuci materijala zna da produži rok.",
        },
        {
          q: "Da li jedan izvođač radi sve ili treba više majstora?",
          a: "Neki izvođači koordiniraju vodoinstalatera, električara i keramičara, a nekad ih angažuješ posebno. Jedan odgovoran izvođač olakšava stvar kad nešto ne valja.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina kupatila, da li se mijenjaju cijevi i odvodi, vrsta pločica i sanitarije, tuš kada ili tuš u ravni poda, ugradni vodokotlić i odvoz šuta. Materijal često čini veliki dio ukupnog iznosa.",
        },
        {
          q: "Da li se mogu mijenjati pozicije WC šolje i tuša?",
          a: "Često mogu, ali zavisi od pada i položaja odvoda i vertikale u zgradi. Izvođač to treba da provjeri prije nego što se dogovori raspored.",
        },
        {
          q: "Šta sa komšijama tokom radova?",
          a: "Obavijesti ih unaprijed o bučnim danima i pitaj upravnika zgrade za eventualno zatvaranje vode na vertikali. Dogovori sa izvođačem i odvoz šuta.",
        },
      ],
      tips: [
        "Traži detaljnu ponudu po stavkama: rušenje, instalacije, hidroizolacija, keramika, sanitarija, šut.",
        "Izaberi i kupi pločice i sanitariju na vrijeme, da radovi ne stoje zbog isporuke.",
        "Uslikaj cijevi i hidroizolaciju prije zatvaranja zidova, trebaće ti kasnije.",
        "Dogovori plaćanje u fazama i garanciju na izvedene radove.",
      ],
    },
    en: {
      description:
        "A full bathroom renovation usually means stripping old tiles, replacing pipes and drains, waterproofing, new tiling, sanitaryware, a shower or bath, lighting and an extractor fan. In older Montenegrin flats the state of the pipes often only shows once the tiles are off, so leave some slack in budget and schedule. On the coast, good ventilation fights damp, and fittings that are easy to descale make life easier with the hard water.",
      faq: [
        {
          q: "How long does a full bathroom renovation take?",
          a: "Typically one to several weeks, depending on size, whether pipes are replaced and drying times for waterproofing and adhesive. Late material deliveries are a common cause of delay.",
        },
        {
          q: "Does one contractor do everything?",
          a: "Some contractors coordinate the plumber, electrician and tiler; otherwise you hire each separately. One accountable contractor makes things simpler if something goes wrong.",
        },
        {
          q: "What affects the price?",
          a: "Bathroom size, whether pipes and drains are replaced, tile and fixture choice, shower tray versus a level walk-in shower, concealed cistern and debris removal. Materials often make up a large share of the total.",
        },
        {
          q: "Can the toilet or shower be moved?",
          a: "Often yes, but it depends on drain falls and where the building's soil stack is. The contractor should check before you finalise the layout.",
        },
        {
          q: "Can I renovate while I'm abroad?",
          a: "Many owners do, with photo or video updates at each stage. Agree milestones, payments per stage and who receives deliveries.",
        },
      ],
      tips: [
        "Ask for an itemised quote: demolition, plumbing, waterproofing, tiling, fixtures, debris removal.",
        "Choose and order tiles and fixtures early so work doesn't stall waiting for delivery.",
        "Photograph pipes and waterproofing before walls are closed; you will want them later.",
        "Pay in stages tied to finished work and agree a guarantee in writing.",
      ],
    },
    ru: {
      description:
        "Полный ремонт ванной обычно включает демонтаж старой плитки, замену труб и канализации, гидроизоляцию, новую плитку, сантехнику, душевую или ванну, освещение и вытяжку. В старых квартирах Черногории состояние труб часто видно только после снятия плитки, поэтому стоит заложить запас по бюджету и срокам. На побережье важна хорошая вентиляция от влаги, а из-за жёсткой воды — смесители и лейки, которые легко чистить от налёта.",
      faq: [
        {
          q: "Сколько длится полный ремонт ванной?",
          a: "Обычно от одной до нескольких недель — в зависимости от площади, замены коммуникаций и времени высыхания гидроизоляции и клея. Частая причина задержек — поздняя поставка материалов.",
        },
        {
          q: "Один подрядчик делает всё или нужно несколько мастеров?",
          a: "Некоторые подрядчики сами координируют сантехника, электрика и плиточника, иначе нанимать придётся каждого. Один ответственный подрядчик упрощает решение проблем.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От площади, замены труб и слива, выбора плитки и сантехники, душевого поддона или трапа в уровень пола, инсталляции и вывоза мусора. Материалы часто составляют большую часть суммы.",
        },
        {
          q: "Можно ли перенести унитаз или душ?",
          a: "Часто можно, но это зависит от уклона и расположения канализационного стояка. Подрядчик должен проверить это до утверждения планировки.",
        },
        {
          q: "Можно ли делать ремонт, находясь за границей?",
          a: "Многие владельцы так и делают, получая фото- и видеоотчёты по этапам. Договоритесь об этапах, оплате за каждый и о том, кто принимает доставки.",
        },
      ],
      tips: [
        "Просите подробную смету по позициям: демонтаж, сантехника, гидроизоляция, плитка, мусор.",
        "Выберите и закажите плитку и сантехнику заранее, чтобы работы не простаивали.",
        "Сфотографируйте трубы и гидроизоляцию до закрытия стен — пригодится в будущем.",
        "Платите поэтапно за выполненную работу и зафиксируйте гарантию письменно.",
      ],
    },
  },

  "pvc-i-alu-stolarija": {
    me: {
      description:
        "Firme za PVC i ALU stolariju izrađuju i ugrađuju prozore, balkonska i ulazna vrata, klizne stijene, roletne i komarnike, a rade i servis: podešavanje okova, zamjenu dihtunga, stakla i ručki. Zamjena starih drvenih prozora primjetno smanjuje propuh, buku i račune za grijanje i klimu, posebno na sjeveru zimi i na primorju ljeti. Na obali, gdje su vjetar i so jaki, pitaj za kvalitet okova i zaštitu aluminijuma.",
      faq: [
        {
          q: "Šta je bolje, PVC ili aluminijum?",
          a: "PVC je obično povoljniji i dobro izoluje, dok je aluminijum čvršći, pogodan za velike staklene površine i klizne stijene. Za ALU je važno da profil ima termo prekid.",
        },
        {
          q: "Koliko se čeka od mjerenja do ugradnje?",
          a: "Stolarija se pravi po mjeri, pa obično prođe nekoliko sedmica. Proljeće i period pred sezonu su najgušći, pa je bolje naručiti ranije.",
        },
        {
          q: "Zašto mi se prozori znoje sa unutrašnje strane?",
          a: "Kondenzacija je najčešće znak visoke vlage u stanu i slabog provjetravanja, a ne neispravnog prozora. Ipak, ako se znoji između stakala, staklo je izgubilo hermetičnost i treba ga zamijeniti.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Dimenzije i broj elemenata, vrsta profila i broj komora, vrsta stakla (dvoslojno, troslojno, niskoemisiono), okov, roletne i komarnici, demontaža starih prozora i obrada špaletni poslije ugradnje.",
        },
        {
          q: "Da li je u cijenu uključena obrada oko prozora?",
          a: "Ne uvijek. Neke firme rade i završnu obradu špaletni i unutrašnje i spoljašnje klupice, a neke samo ugradnju, pa to jasno dogovori u ponudi.",
        },
      ],
      tips: [
        "Traži da ponuda navede proizvođača profila, broj komora i tip stakla za svaki element.",
        "Neka firma sama uzme mjere, da bi snosila odgovornost ako element ne odgovara.",
        "Pitaj da li su demontaža, odvoz starih prozora i obrada špaletni uključeni.",
        "Dogovori garanciju na profile, okov i ugradnju, i servis poslije prve godine.",
      ],
    },
    en: {
      description:
        "PVC and aluminium joinery companies make and install windows, balcony and entrance doors, sliding patio doors, roller shutters and fly screens, and service them: adjusting hinges and handles, replacing seals, glass and handles. Replacing old single-glazed or wooden windows noticeably cuts draughts, noise and heating or AC bills, both in the cold north in winter and on the hot coast in summer. By the sea, where wind and salt are strong, ask about hardware quality and aluminium finish.",
      faq: [
        {
          q: "PVC or aluminium: which is better?",
          a: "PVC is usually cheaper and insulates well; aluminium is stronger and suits large glazed areas and sliding doors. For aluminium, make sure the profile has a thermal break.",
        },
        {
          q: "How long from measuring to installation?",
          a: "Windows are made to measure, so it usually takes several weeks. Spring and the run-up to the season are the busiest times, so order early.",
        },
        {
          q: "My windows are wet on the inside. Are they faulty?",
          a: "Condensation on the inner pane usually means high indoor humidity and poor ventilation, not a bad window. Moisture between the panes, though, means the sealed unit has failed and needs replacing.",
        },
        {
          q: "What affects the price?",
          a: "Size and number of units, profile type and chamber count, glass (double, triple, low-E), hardware, shutters and screens, removing old windows and finishing the reveals afterwards.",
        },
        {
          q: "My sliding door is hard to close. Do I need a new one?",
          a: "Often not. A service visit to adjust the hardware, clean the tracks or replace rollers and seals usually fixes it.",
        },
      ],
      tips: [
        "Ask for a quote naming the profile brand, number of chambers and glass type per unit.",
        "Let the company take the measurements so they are responsible for the fit.",
        "Check whether removing old windows and finishing the reveals are included.",
        "Get the guarantee on profiles, hardware and installation in writing.",
      ],
    },
    ru: {
      description:
        "Компании по ПВХ и алюминиевым конструкциям изготавливают и устанавливают окна, балконные и входные двери, раздвижные системы, рольставни и москитные сетки, а также обслуживают их: регулируют фурнитуру, меняют уплотнители, стеклопакеты и ручки. Замена старых деревянных окон заметно уменьшает сквозняки, шум и счета за отопление и кондиционер — и на холодном севере зимой, и на жарком побережье летом. У моря, где сильный ветер и соль, спрашивайте о качестве фурнитуры и покрытии алюминия.",
      faq: [
        {
          q: "Что лучше — ПВХ или алюминий?",
          a: "ПВХ обычно дешевле и хорошо держит тепло, алюминий прочнее и подходит для больших остеклений и раздвижных дверей. У алюминиевого профиля обязательно должен быть терморазрыв.",
        },
        {
          q: "Сколько ждать от замера до установки?",
          a: "Окна делают по размерам, поэтому обычно проходит несколько недель. Весной и перед сезоном загрузка максимальная, лучше заказывать заранее.",
        },
        {
          q: "Почему окна потеют изнутри?",
          a: "Конденсат на внутреннем стекле обычно говорит о высокой влажности и слабом проветривании, а не о браке. А вот влага между стёклами означает разгерметизацию стеклопакета — его нужно менять.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От размеров и количества конструкций, профиля и числа камер, типа стеклопакета (двух-, трёхкамерный, энергосберегающий), фурнитуры, рольставен и сеток, демонтажа старых окон и отделки откосов.",
        },
        {
          q: "Раздвижная дверь плохо закрывается — нужна новая?",
          a: "Чаще всего нет. Сервисный выезд с регулировкой фурнитуры, чисткой направляющих или заменой роликов и уплотнителей обычно решает проблему.",
        },
      ],
      tips: [
        "Просите смету с указанием марки профиля, количества камер и стеклопакета для каждого окна.",
        "Пусть замер делает сама компания — тогда она отвечает за точность.",
        "Уточните, входят ли демонтаж, вывоз старых окон и отделка откосов.",
        "Зафиксируйте гарантию на профиль, фурнитуру и монтаж письменно.",
      ],
    },
  },
};
