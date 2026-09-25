import type { ServiceContent } from "./types";

export const content: Record<string, ServiceContent> = {
  "autoelektricar": {
    me: {
      description:
        "Autoelektričar pronalazi i popravlja kvarove na elektroinstalaciji vozila: akumulator, alternator, anlaser, svjetla, podizače stakala, centralnu bravu, kontrolne lampice na tabli i klimu kad je problem u elektronici. Većina danas radi i kompjutersku dijagnostiku, pa očitava greške iz računara auta. Zimi, posebno na sjeveru, najčešće se javljaju problemi sa paljenjem i slabim akumulatorom, a ljeti na primorju sa klimom i ventilatorima.",
      faq: [
        {
          q: "Šta znači kad mi na tabli upali lampica „check engine“?",
          a: "To je samo znak da je računar auta zabilježio grešku, a uzrok može biti sitan ili ozbiljan. Autoelektričar dijagnostikom očita kod greške i tek onda kaže šta treba popraviti.",
        },
        {
          q: "Može li autoelektričar doći na teren ako mi auto neće da upali?",
          a: "Neki izlaze na teren za paljenje, zamjenu akumulatora ili provjeru punjenja, a drugi rade samo u radionici. Provjeri na profilu ili pitaj pri pozivu, pa po potrebi organizuj šlep.",
        },
        {
          q: "Kako da znam da li je problem u akumulatoru ili alternatoru?",
          a: "Ako auto slabo pali poslije stajanja, često je akumulator; ako se lampica akumulatora pali u vožnji ili se akumulator stalno prazni, može biti alternator ili potrošač koji vuče struju. Mjerenje u radionici to brzo razjasni.",
        },
        {
          q: "Šta utiče na cijenu popravke?",
          a: "Najviše koliko traje traženje kvara, marka i starost vozila, cijena dijela (original ili zamjenski) i da li treba skidati obloge ili djelove motora. Pitaj da ti prvo kažu cijenu dijagnostike, pa tek onda popravke.",
        },
        {
          q: "Da li je bolje popraviti ili zamijeniti alternator i anlaser?",
          a: "Često se mogu reparirati, što je obično povoljnije od novog dijela, ali zavisi od kvara i dostupnosti djelova. Zamoli majstora da ti objasni obje opcije i garanciju za svaku.",
        },
      ],
      tips: [
        "Zapiši kad se kvar javlja: na hladno, u vožnji, pri kiši ili pri paljenju svjetala.",
        "Uslikaj lampice na tabli dok svijetle, jer se neke ugase prije nego što stigneš u radionicu.",
        "Pitaj da li majstor ima dijagnostiku za tvoju marku, naročito za novija i hibridna vozila.",
        "Traži da ti vrati stari dio i izda račun sa navedenom garancijom.",
      ],
    },
    en: {
      description:
        "An auto electrician diagnoses and repairs a car's electrical system: battery, alternator, starter motor, lights, electric windows, central locking, dashboard warning lights and the electrical side of air conditioning. Most use computer diagnostics to read fault codes. In Montenegro, cold mornings in the north are hard on batteries and starters, while summer heat on the coast tests A/C fans and wiring, so these are the typical seasonal call-outs.",
      faq: [
        {
          q: "My car won't start. Can an auto electrician come to me?",
          a: "Some do mobile call-outs for jump starts, battery swaps or charging checks, others only work in the workshop. Check the profile or ask when you call, and arrange a tow truck if needed.",
        },
        {
          q: "What does the engine warning light mean?",
          a: "It means the car's computer has logged a fault, which can be minor or serious. A diagnostic scan reads the code so the electrician can tell you what actually needs fixing.",
        },
        {
          q: "Can they work on a car registered abroad or a less common brand?",
          a: "Usually yes for general electrical work, but diagnostic software varies by brand. Ask in advance whether they have the right tools for your make, especially for newer or hybrid cars.",
        },
        {
          q: "What affects the price?",
          a: "Mainly how long it takes to trace the fault, the make and age of the car, and whether the part is original, aftermarket or rebuilt. Ask for the diagnostic fee first, then a quote for the repair.",
        },
        {
          q: "Is a rebuilt alternator or starter a good option?",
          a: "Reconditioned units are common here and often cheaper than new, but quality and warranty vary. Ask the electrician to explain both options and what guarantee comes with each.",
        },
      ],
      tips: [
        "Note when the fault happens: cold starts, in rain, while driving or with the lights on.",
        "Take a photo of the dashboard warning lights before they switch off.",
        "Ask whether the workshop has diagnostic equipment for your brand.",
        "Ask for the old part back and a receipt stating the warranty.",
      ],
    },
    ru: {
      description:
        "Автоэлектрик ищет и устраняет неисправности электрики автомобиля: аккумулятор, генератор, стартер, фары, стеклоподъёмники, центральный замок, ошибки на приборной панели, электрическую часть кондиционера. Большинство мастеров делают компьютерную диагностику и считывают коды ошибок. В Черногории зимой, особенно на севере, чаще отказывают аккумуляторы и стартеры, а летом на побережье — вентиляторы, электрика кондиционера и проводка.",
      faq: [
        {
          q: "Машина не заводится. Может ли автоэлектрик приехать на место?",
          a: "Некоторые выезжают, чтобы завести машину, заменить аккумулятор или проверить зарядку, другие работают только в мастерской. Уточните в профиле или по телефону и при необходимости вызовите эвакуатор.",
        },
        {
          q: "Что значит горящий «check engine»?",
          a: "Это сигнал, что блок управления записал ошибку, причина может быть мелкой или серьёзной. Диагностика покажет код, и мастер скажет, что именно нужно чинить.",
        },
        {
          q: "Возьмутся ли за машину на иностранных номерах или редкой марки?",
          a: "Обычную электрику, как правило, да, но диагностическое оборудование зависит от марки. Заранее спросите, есть ли у мастера софт для вашего автомобиля, особенно если он новый или гибридный.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От времени на поиск неисправности, марки и возраста машины и от того, какая запчасть: оригинал, аналог или восстановленная. Сначала уточните цену диагностики, потом — ремонта.",
        },
        {
          q: "Стоит ли ставить восстановленный генератор или стартер?",
          a: "Это распространённый и обычно более дешёвый вариант, но качество и гарантия бывают разными. Попросите мастера объяснить оба варианта и условия гарантии.",
        },
      ],
      tips: [
        "Запишите, когда проявляется проблема: на холодную, в дождь, в движении или при включённых фарах.",
        "Сфотографируйте горящие лампочки на панели, пока они не погасли.",
        "Спросите, есть ли у мастерской диагностика именно для вашей марки.",
        "Попросите вернуть старую деталь и выдать чек с указанием гарантии.",
      ],
    },
  },
  "autolimar": {
    me: {
      description:
        "Autolimar popravlja karoseriju: ispravlja udubljenja, mijenja ili vari oštećene djelove, sanira rđu i priprema auto za farbanje, a mnoge radionice rade i lakiranje. Posao je čest poslije manjih sudara na parkingu, grada ili ogrebotina u uskim ulicama starih gradova. Ako ide preko osiguranja, radionica često sarađuje sa procjeniteljem, pa se prije popravke obično čeka procjena štete.",
      faq: [
        {
          q: "Može li se udubljenje popraviti bez farbanja?",
          a: "Manja udubljenja bez oštećenog laka, na primjer od grada, često se mogu izvući posebnom tehnikom bez farbanja. Da li je to moguće zavisi od mjesta i veličine udubljenja, pa pošalji sliku majstoru.",
        },
        {
          q: "Kako ide popravka preko osiguranja?",
          a: "Obično prvo prijaviš štetu osiguravajućem društvu, ono izvrši procjenu, pa radionica radi po odobrenju. Postupak i ko plaća zavisi od polise i okolnosti, pa to provjeri sa svojim osiguranjem.",
        },
        {
          q: "Koliko dugo auto ostaje u radionici?",
          a: "Sitne popravke mogu biti gotove brzo, a veće štete sa farbanjem traju duže jer lak mora da se suši i treba čekati djelove. Pitaj majstora za okvirni rok prije nego što ostaviš auto.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina i mjesto oštećenja, da li se dio popravlja ili mijenja, cijena djelova, količina farbanja i usklađivanje nijanse. Traži da ti napišu ponudu po stavkama.",
        },
        {
          q: "Hoće li se razlikovati boja popravljenog dijela?",
          a: "Dobar limar-lakirer boju miješa po kodu i često je prelazno nanosi na susjedne djelove da se razlika ne vidi. Na starijim i izblijedjelim autima potpuno poklapanje je teže, pa to pitaj unaprijed.",
        },
      ],
      tips: [
        "Uslikaj oštećenje sa više strana i pošalji slike u nekoliko radionica radi poređenja.",
        "Pitaj da li se ugrađuju originalni, zamjenski ili polovni djelovi.",
        "Pregledaj auto na dnevnom svjetlu kad ga preuzimaš, jer se razlike u boji tada najbolje vide.",
        "Dogovori garanciju na lak i antikorozivnu zaštitu.",
      ],
    },
    en: {
      description:
        "A car body repairer fixes dents, replaces or welds damaged panels, treats rust and prepares the car for paint; many workshops do the paintwork too. Typical jobs are parking scrapes, minor collisions, hail damage and scratches from tight old-town streets. If the repair goes through insurance, the insurer usually assesses the damage first, so ask the workshop how it works with your insurer before booking.",
      faq: [
        {
          q: "Can a dent be fixed without repainting?",
          a: "Small dents where the paint isn't broken, such as hail marks, can often be pushed out with paintless dent repair. Whether it works depends on the size and location, so send a photo first.",
        },
        {
          q: "How does an insurance repair work?",
          a: "Usually you report the claim, the insurer sends an assessor, and the workshop repairs once it's approved. Details depend on your policy and who was at fault, so confirm with your insurer.",
        },
        {
          q: "How long will the car be in the shop?",
          a: "Small repairs can be quick, while larger jobs with paint take longer because of drying time and waiting for parts. Ask for an estimated date before leaving the car.",
        },
        {
          q: "What affects the price?",
          a: "The size and location of the damage, whether panels are repaired or replaced, parts prices, how much paint is needed and colour matching. Ask for an itemised quote.",
        },
        {
          q: "Will the new paint match?",
          a: "Good painters mix by the colour code and blend into neighbouring panels. On older, sun-faded cars a perfect match is harder, so discuss expectations up front.",
        },
      ],
      tips: [
        "Photograph the damage from several angles and get quotes from more than one workshop.",
        "Ask whether they'll use original, aftermarket or used parts.",
        "Inspect the car in daylight when collecting it, since colour differences show best there.",
        "Get a written warranty on the paintwork and rust protection.",
      ],
    },
    ru: {
      description:
        "Жестянщик-кузовщик выправляет вмятины, меняет или варит повреждённые элементы, устраняет ржавчину и готовит машину к покраске; многие мастерские красят сами. Типичные случаи — царапины и вмятины на парковке, мелкие ДТП, град, узкие улочки старых городов. Если ремонт идёт по страховке, сначала обычно нужна оценка ущерба от страховой, поэтому заранее уточните в мастерской, как они работают со страховыми компаниями.",
      faq: [
        {
          q: "Можно ли убрать вмятину без покраски?",
          a: "Небольшие вмятины без повреждения лака, например от града, часто удаляют беспокрасочным методом. Всё зависит от размера и места, поэтому сначала отправьте мастеру фото.",
        },
        {
          q: "Как проходит ремонт по страховке?",
          a: "Обычно вы заявляете о случае, страховая оценивает ущерб, и после согласования мастерская начинает работу. Детали зависят от полиса и обстоятельств, уточняйте их в своей страховой.",
        },
        {
          q: "Сколько машина пробудет в мастерской?",
          a: "Мелкий ремонт делают быстро, а крупный с покраской дольше — нужно время на сушку и ожидание запчастей. Спросите ориентировочный срок до того, как оставить машину.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От размера и места повреждения, ремонта или замены детали, цены запчастей, объёма покраски и подбора цвета. Попросите смету по пунктам.",
        },
        {
          q: "Будет ли отличаться цвет?",
          a: "Хороший маляр подбирает краску по коду и делает плавный переход на соседние элементы. На старых, выгоревших машинах идеального совпадения добиться сложнее, это лучше обсудить заранее.",
        },
      ],
      tips: [
        "Сфотографируйте повреждения с разных сторон и сравните оценки нескольких мастерских.",
        "Уточните, какие запчасти поставят: оригинал, аналог или б/у.",
        "Принимайте машину при дневном свете — так лучше видна разница в цвете.",
        "Попросите письменную гарантию на покраску и антикоррозийную обработку.",
      ],
    },
  },
  "servis-hidraulike": {
    me: {
      description:
        "Servis hidraulike popravlja hidraulične sisteme na građevinskim mašinama, kiperima, traktorima, viljuškarima, dizalicama i utovarivačima: cilindre, pumpe, ventile i razvodnike. Najčešće se mijenjaju zaptivke i hidraulična crijeva, koja se često mogu napraviti po mjeri na licu mjesta. Kad mašina stoji, gubi se novac, pa je važno naći servis koji brzo izlazi na teren ili ima crijeva i zaptivke na stanju.",
      faq: [
        {
          q: "Može li se hidraulično crijevo napraviti po mjeri?",
          a: "Da, većina servisa presuje nova crijeva sa odgovarajućim priključcima prema starom crijevu. Donesi staro crijevo ili zapiši oznake sa njega, dužinu i vrstu priključaka.",
        },
        {
          q: "Da li servis izlazi na gradilište?",
          a: "Neki imaju mobilnu radionicu i dolaze na teren, drugi rade samo u radionici. Provjeri na profilu ili pitaj unaprijed, jer je teške mašine skupo prevoziti.",
        },
        {
          q: "Zašto cilindar curi ili gubi snagu?",
          a: "Često su u pitanju istrošene zaptivke, ali uzrok može biti i oštećena klipnjača, pumpa ili ventil. Tek pregled pokaže da li je dovoljna zamjena zaptivki ili treba veća popravka.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Vrsta i veličina mašine, dostupnost djelova, da li se dio reparira ili mijenja, izlazak na teren i hitnost. Pitaj za procjenu prije rastavljanja.",
        },
        {
          q: "Koliko često treba mijenjati hidraulično ulje i filtere?",
          a: "To zavisi od proizvođača mašine i broja radnih sati, pa pogledaj uputstvo za održavanje. Servis ti može reći u kakvom je stanju ulje i da li je vrijeme za zamjenu.",
        },
      ],
      tips: [
        "Zapiši marku, model i serijski broj mašine prije nego što pozoveš servis.",
        "Uslikaj mjesto curenja i pločicu na cilindru ili pumpi.",
        "Pitaj da li imaju zaptivke i crijeva na stanju ili se djelovi naručuju.",
        "Traži garanciju na reparirane cilindre i pumpe.",
      ],
    },
    en: {
      description:
        "A hydraulics service repairs hydraulic systems on construction machinery, tipper trucks, tractors, forklifts, cranes and loaders: cylinders, pumps, valves and control blocks. The most common jobs are replacing seals and making hydraulic hoses to measure, often on the spot. Downtime costs money, so look for a service that can come to the site or keeps common hoses and seal kits in stock.",
      faq: [
        {
          q: "Can a hydraulic hose be made to order?",
          a: "Yes, most services crimp new hoses with the right fittings based on the old one. Bring the old hose or note its markings, length and fitting types.",
        },
        {
          q: "Will they come to the construction site?",
          a: "Some have a mobile workshop, others only work at their premises. Check the profile or ask, as moving heavy machinery is expensive.",
        },
        {
          q: "Why is my cylinder leaking or losing power?",
          a: "Worn seals are a common cause, but it can also be a scored rod, a pump or a valve. Only an inspection shows whether new seals are enough.",
        },
        {
          q: "What affects the price?",
          a: "The type and size of machine, parts availability, whether components are rebuilt or replaced, call-out and urgency. Ask for an estimate before anything is dismantled.",
        },
        {
          q: "How often should hydraulic oil and filters be changed?",
          a: "It depends on the manufacturer and operating hours, so check the service manual. The technician can check the oil condition and advise.",
        },
      ],
      tips: [
        "Have the machine's make, model and serial number ready when you call.",
        "Photograph the leak and the plate on the cylinder or pump.",
        "Ask whether seals and hoses are in stock or need to be ordered.",
        "Ask for a warranty on rebuilt cylinders and pumps.",
      ],
    },
    ru: {
      description:
        "Сервис гидравлики ремонтирует гидросистемы строительной техники, самосвалов, тракторов, погрузчиков и кранов: гидроцилиндры, насосы, клапаны и распределители. Чаще всего меняют уплотнения и изготавливают рукава высокого давления по размеру, нередко прямо на месте. Простой техники стоит денег, поэтому ищите сервис с выездом на объект или с ходовыми рукавами и ремкомплектами в наличии.",
      faq: [
        {
          q: "Можно ли изготовить гидравлический шланг по размеру?",
          a: "Да, большинство сервисов опрессовывают новый рукав с нужными фитингами по образцу. Привезите старый шланг или запишите его маркировку, длину и тип соединений.",
        },
        {
          q: "Выезжает ли сервис на объект?",
          a: "У одних есть мобильная мастерская, другие работают только у себя. Уточните в профиле или по телефону — перевозить тяжёлую технику дорого.",
        },
        {
          q: "Почему цилиндр течёт или теряет усилие?",
          a: "Часто виноваты изношенные уплотнения, но причина может быть и в повреждённом штоке, насосе или клапане. Только осмотр покажет, хватит ли замены уплотнений.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От типа и размера техники, наличия запчастей, ремонта или замены узла, выезда и срочности. Попросите оценку до разборки.",
        },
        {
          q: "Как часто менять гидравлическое масло и фильтры?",
          a: "Это зависит от производителя и моточасов, смотрите регламент обслуживания. Мастер может проверить состояние масла и подсказать.",
        },
      ],
      tips: [
        "Подготовьте марку, модель и серийный номер техники.",
        "Сфотографируйте место течи и табличку на цилиндре или насосе.",
        "Спросите, есть ли уплотнения и рукава в наличии или их нужно заказывать.",
        "Уточните гарантию на восстановленные цилиндры и насосы.",
      ],
    },
  },
  "obrada-diskova-i-dobosa": {
    me: {
      description:
        "Obrada diskova i doboša znači struganje kočionih diskova i doboša na strugu da bi površina opet bila ravna, bez vibracija i neravnomjernog kočenja. Rješenje je za volan koji podrhtava pri kočenju ili pedalu koja „pulsira“, a disk još ima dovoljno debljine. Na crnogorskim serpentinama i dugim spustovima kočnice se jače griju, pa se diskovi lakše iskrive i ovaj problem je čest.",
      faq: [
        {
          q: "Kako da znam da mi treba obrada diskova?",
          a: "Tipični znaci su podrhtavanje volana ili pedale pri kočenju, naročito sa veće brzine. Majstor će izmjeriti bacanje i debljinu diska i reći da li je obrada dovoljna.",
        },
        {
          q: "Da li je bolje obraditi ili zamijeniti diskove?",
          a: "Obrada ima smisla samo ako disk poslije struganja ostaje iznad minimalne debljine koju propisuje proizvođač. Ako je disk previše tanak ili napukao, mora se zamijeniti.",
        },
        {
          q: "Da li se diskovi obrađuju na autu ili se skidaju?",
          a: "Neke radionice imaju strug koji obrađuje disk direktno na glavčini, a druge skidaju disk i strugaju ga na mašini. Pitaj kako rade i da li ti treba i zamjena pločica.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj diskova ili doboša, da li se obrađuju na vozilu ili skinuti, stanje djelova i da li uz to ide zamjena pločica ili servis čeljusti. Pitaj za cijenu po komadu.",
        },
        {
          q: "Treba li mijenjati pločice poslije obrade?",
          a: "Često se preporučuje, jer stare pločice mogu biti neravno istrošene i vratiti vibraciju. Majstor će procijeniti njihovo stanje.",
        },
      ],
      tips: [
        "Na dugim spustovima koristi motornu kočnicu, pa ćeš manje pregrijavati diskove.",
        "Traži da ti kažu izmjerenu debljinu diska prije i poslije obrade.",
        "Uvijek obrađuj ili mijenjaj diskove u paru na istoj osovini.",
        "Poslije obrade prvih kilometara koči blaže, da se pločice dobro naliježu.",
      ],
    },
    en: {
      description:
        "Brake disc and drum machining means skimming the braking surface on a lathe so it is flat again, removing vibration and uneven braking. It helps when the steering wheel shakes or the pedal pulses under braking and the disc is still thick enough. Montenegro's mountain roads and long descents heat brakes hard, so warped discs are a common complaint here.",
      faq: [
        {
          q: "How do I know my discs need machining?",
          a: "Typical signs are a shaking steering wheel or pulsing pedal when braking, especially from higher speeds. The mechanic will measure runout and thickness to confirm.",
        },
        {
          q: "Should I machine or replace the discs?",
          a: "Machining only makes sense if the disc stays above the manufacturer's minimum thickness afterwards. Discs that are too thin or cracked must be replaced.",
        },
        {
          q: "Is it done on the car or off it?",
          a: "Some workshops have on-car lathes that skim the disc on the hub, others remove it and use a bench lathe. Ask how they work and whether pads should be changed too.",
        },
        {
          q: "What affects the price?",
          a: "How many discs or drums, on-car or off-car machining, their condition and whether pads or calipers are serviced at the same time. Ask for a per-piece price.",
        },
        {
          q: "Do I need new pads after machining?",
          a: "It's often recommended, since old pads can be unevenly worn and bring the vibration back. The mechanic will check them.",
        },
      ],
      tips: [
        "Use engine braking on long descents to avoid overheating your discs.",
        "Ask for the measured disc thickness before and after machining.",
        "Always machine or replace discs in pairs on the same axle.",
        "Brake gently for the first few kilometres so the pads bed in.",
      ],
    },
    ru: {
      description:
        "Проточка тормозных дисков и барабанов — это обработка рабочей поверхности на станке, чтобы она снова стала ровной, без биения и неравномерного торможения. Она помогает, когда при торможении дрожит руль или «пульсирует» педаль, а толщина диска ещё позволяет. На горных серпантинах и длинных спусках Черногории тормоза сильно греются, поэтому деформация дисков здесь встречается часто.",
      faq: [
        {
          q: "Как понять, что нужна проточка?",
          a: "Типичные признаки — биение руля или педали при торможении, особенно на скорости. Мастер измерит биение и толщину диска и подтвердит.",
        },
        {
          q: "Проточить или заменить диски?",
          a: "Проточка имеет смысл, только если после неё диск остаётся толще минимума, указанного производителем. Слишком тонкие или треснувшие диски нужно менять.",
        },
        {
          q: "Протачивают на машине или со снятием?",
          a: "У некоторых мастерских есть станок для проточки прямо на ступице, другие снимают диск. Уточните способ и нужно ли менять колодки.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От количества дисков или барабанов, способа проточки, их состояния и того, меняются ли одновременно колодки или обслуживаются суппорты. Спросите цену за штуку.",
        },
        {
          q: "Нужно ли менять колодки после проточки?",
          a: "Часто это рекомендуют: старые колодки могут быть изношены неровно и вернуть вибрацию. Мастер оценит их состояние.",
        },
      ],
      tips: [
        "На длинных спусках тормозите двигателем, чтобы не перегревать диски.",
        "Попросите назвать толщину диска до и после проточки.",
        "Обрабатывайте или меняйте диски парой на одной оси.",
        "Первые километры тормозите мягко, чтобы колодки притёрлись.",
      ],
    },
  },
  "pranje-automobila": {
    me: {
      description:
        "Pranje automobila obuhvata spoljno pranje, sušenje, pranje felgi i najčešće usisavanje i brisanje unutrašnjosti, a mnoge perionice nude i voskiranje ili pranje motora. Na primorju so, pijesak i smola sa borova brzo prljaju auto, a na sjeveru zimi so sa puteva nagriza podvozje. Neke perionice rade ručno, neke imaju samouslužne boksove, a ponegdje dolaze i na tvoju adresu.",
      faq: [
        {
          q: "Da li perionica radi vikendom?",
          a: "Većina radi i subotom, a mnoge i nedjeljom, posebno ljeti. Radno vrijeme provjeri na profilu jer se razlikuje po sezoni.",
        },
        {
          q: "Da li mogu da naručim pranje na adresi?",
          a: "Neki pružaoci dolaze sa opremom kod kuće ili na posao, ponekad i bez priključka na vodu. Provjeri na profilu da li nude mobilno pranje i šta ti treba obezbijediti.",
        },
        {
          q: "Koliko često treba prati podvozje?",
          a: "Poslije zime ako voziš po posoljenim putevima ili poslije boravka blizu mora vrijedi oprati podvozje da se ukloni so. Pitaj perionicu da li to rade.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina vozila, da li je samo spoljno ili i unutrašnje pranje, dodatne usluge poput voska ili pranja motora i koliko je auto prljav. Cjenovnik po paketima je obično na profilu.",
        },
        {
          q: "Kako skinuti smolu i ptičji izmet?",
          a: "Najbolje što prije, jer na suncu mogu oštetiti lak. Perionica ima sredstva koja to skidaju bez grebanja, pa to pomeni kad dođeš.",
        },
      ],
      tips: [
        "Izbjegavaj pranje na jakom podnevnom suncu, da se sredstva ne osuše na laku.",
        "Pitaj da li se koriste čiste krpe i odvojene za felge i karoseriju.",
        "Izvadi vrijedne stvari iz auta prije usisavanja.",
        "Ako ti je bitno, pitaj da li ima čekaonice ili kafića u blizini.",
      ],
    },
    en: {
      description:
        "A car wash covers exterior washing and drying, wheel cleaning and usually vacuuming and wiping the interior, with extras like wax or engine cleaning. On the coast, salt air, sand and pine resin dirty cars quickly, while winter road salt in the north attacks the underbody. You'll find hand-wash places, self-service bays and some mobile washers who come to your address.",
      faq: [
        {
          q: "Are car washes open on weekends?",
          a: "Most are open on Saturdays and many on Sundays too, especially in summer. Hours change with the season, so check the profile.",
        },
        {
          q: "Can someone wash my car at home?",
          a: "Some providers come with their own equipment, sometimes without needing a water connection. Check the profile for mobile washing and what they need from you.",
        },
        {
          q: "Should I wash the underbody?",
          a: "It's worth doing after a winter of driving on salted roads or time spent by the sea. Ask whether the wash offers it.",
        },
        {
          q: "What affects the price?",
          a: "Vehicle size, exterior only or inside too, extras like wax or engine cleaning, and how dirty the car is. Package prices are usually listed on the profile.",
        },
        {
          q: "How do I get tree sap and bird droppings off?",
          a: "As soon as possible, since the sun can etch them into the paint. Car washes have products that remove them without scratching, so mention it when you arrive.",
        },
      ],
      tips: [
        "Avoid washing in strong midday sun so products don't dry on the paint.",
        "Ask whether they use clean, separate cloths for wheels and bodywork.",
        "Take valuables out of the car before it's vacuumed.",
        "For rentals, check the rental company's rules on cleaning before returning the car.",
      ],
    },
    ru: {
      description:
        "Автомойка — это мойка кузова и дисков, сушка и обычно уборка салона пылесосом, плюс дополнительные услуги вроде воска или мойки двигателя. На побережье машину быстро пачкают морская соль, песок и сосновая смола, а на севере зимой соль с дорог разъедает днище. Есть ручные мойки, мойки самообслуживания и мастера, которые приезжают к вам.",
      faq: [
        {
          q: "Работают ли мойки в выходные?",
          a: "Большинство работает по субботам, многие и по воскресеньям, особенно летом. Часы меняются по сезону, смотрите профиль.",
        },
        {
          q: "Можно ли заказать мойку на дом?",
          a: "Некоторые приезжают со своим оборудованием, иногда даже без подключения к воде. Проверьте в профиле, есть ли выездная мойка и что от вас потребуется.",
        },
        {
          q: "Нужно ли мыть днище?",
          a: "Это стоит сделать после зимы на солёных дорогах или жизни у моря. Уточните, предлагает ли мойка такую услугу.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От размера машины, только кузов или ещё салон, дополнительных услуг и степени загрязнения. Цены по пакетам обычно указаны в профиле.",
        },
        {
          q: "Как убрать смолу и птичий помёт?",
          a: "Как можно скорее — на солнце они повреждают лак. На мойке есть средства, которые удаляют их без царапин, просто скажите об этом.",
        },
      ],
      tips: [
        "Не мойте машину на палящем солнце, чтобы средства не засыхали на лаке.",
        "Спросите, используют ли чистые и отдельные тряпки для дисков и кузова.",
        "Заберите ценные вещи из салона перед уборкой.",
        "Если машина арендованная, уточните правила чистоты при возврате.",
      ],
    },
  },
  "dubinsko-pranje-automobila": {
    me: {
      description:
        "Dubinsko pranje automobila je temeljno čišćenje unutrašnjosti: sjedišta i tepisi se peru mašinom za ekstrakciju, čiste se plafon, plastika, pojasevi i prtljažnik, a kožna sjedišta se čiste i njeguju. Radi se prije prodaje auta, poslije ljeta sa djecom, pijeskom i kupaćim, kad se proliju piće ili hrana ili kad se u autu osjeti vlaga. Mnogi nude i poliranje karoserije kao dodatnu uslugu.",
      faq: [
        {
          q: "Koliko se suše sjedišta poslije dubinskog pranja?",
          a: "Zavisi od materijala, mašine i vremena napolju; ljeti je brže, a zimi i po vlazi sporije. Pitaj pružaoca kad auto može da se koristi i ostavi prozore malo otvorene ako je moguće.",
        },
        {
          q: "Da li mogu da skinu neprijatne mirise, na primjer od duvana ili vlage?",
          a: "Dubinsko pranje mnogo pomaže, a neki koriste i tretman ozonom za mirise. Kod vlage je bitno i naći odakle ulazi voda, inače se miris vraća.",
        },
        {
          q: "Da li dolaze na adresu?",
          a: "Neki imaju mobilnu opremu i rade kod tebe, drugi samo u radionici. Provjeri na profilu i pitaj da li im trebaju struja i voda.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Veličina auta, stanje unutrašnjosti, vrsta sjedišta (štof ili koža), dlake kućnih ljubimaca i dodaci poput ozona ili poliranja. Pošalji slike unutrašnjosti za tačniju ponudu.",
        },
        {
          q: "Mogu li se skinuti sve mrlje?",
          a: "Većina se može mnogo ublažiti, ali stare mrlje od kafe, mastila ili boje ne moraju potpuno nestati. Pošten pružalac će ti to reći unaprijed.",
        },
      ],
      tips: [
        "Isprazni auto, uključujući prtljažnik i pretince, prije nego što ga predaš.",
        "Pomeni dječija sjedišta, dlake ljubimaca ili posebne mrlje prilikom dogovora.",
        "Zakaži pranje za suh i topao dan, da se unutrašnjost brže osuši.",
        "Pogledaj slike prije i poslije na profilu pružaoca.",
      ],
    },
    en: {
      description:
        "Car valeting is a deep clean of the interior: seats and carpets are shampooed and extracted, the headliner, plastics, seatbelts and boot are cleaned, and leather is cleaned and conditioned. People book it before selling a car, after a summer of sand, wet swimwear and kids, after spills, or when the car smells damp. Many valeters also offer paint polishing as an extra.",
      faq: [
        {
          q: "How long do the seats take to dry?",
          a: "It depends on the fabric, equipment and weather; summer is quicker, humid winter days slower. Ask when you can use the car and leave windows slightly open if possible.",
        },
        {
          q: "Can they get rid of smoke or damp smells?",
          a: "A deep clean helps a lot, and some use ozone treatment for odours. With damp, you also need to find where water is getting in or the smell comes back.",
        },
        {
          q: "Will they come to me?",
          a: "Some have mobile equipment and work at your address, others only at their premises. Check the profile and ask if they need power and water.",
        },
        {
          q: "What affects the price?",
          a: "Car size, how dirty the interior is, fabric or leather seats, pet hair and extras like ozone or polishing. Send photos of the interior for a more accurate quote.",
        },
        {
          q: "Will every stain come out?",
          a: "Most can be greatly improved, but old coffee, ink or paint stains may not disappear completely. A good valeter will tell you up front.",
        },
      ],
      tips: [
        "Empty the car completely, including the boot and door pockets.",
        "Mention child seats, pet hair or particular stains when booking.",
        "Book on a dry, warm day so the interior dries faster.",
        "Look at before-and-after photos on the provider's profile.",
      ],
    },
    ru: {
      description:
        "Химчистка салона — это глубокая чистка интерьера: сиденья и ковры моют экстрактором, чистят потолок, пластик, ремни и багажник, кожаные сиденья очищают и обрабатывают кондиционером. Её заказывают перед продажей машины, после лета с песком, мокрыми купальниками и детьми, после пролитых напитков или при запахе сырости. Многие мастера также предлагают полировку кузова.",
      faq: [
        {
          q: "Сколько сохнут сиденья после химчистки?",
          a: "Зависит от ткани, оборудования и погоды: летом быстрее, во влажную зиму дольше. Уточните, когда можно пользоваться машиной, и по возможности оставьте окна приоткрытыми.",
        },
        {
          q: "Можно ли убрать запах табака или сырости?",
          a: "Химчистка сильно помогает, некоторые используют и озонирование. При сырости важно найти, откуда попадает вода, иначе запах вернётся.",
        },
        {
          q: "Приезжают ли мастера к вам?",
          a: "У некоторых есть выездное оборудование, другие работают только у себя. Смотрите профиль и уточните, нужны ли электричество и вода.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От размера машины, степени загрязнения, ткани или кожи, шерсти животных и дополнительных услуг. Пришлите фото салона для более точной оценки.",
        },
        {
          q: "Все ли пятна отойдут?",
          a: "Большинство можно заметно уменьшить, но старые пятна от кофе, чернил или краски могут не исчезнуть полностью. Честный мастер скажет это заранее.",
        },
      ],
      tips: [
        "Полностью освободите салон, багажник и карманы дверей.",
        "При записи упомяните детские кресла, шерсть животных или сложные пятна.",
        "Выбирайте сухой тёплый день, чтобы салон быстрее высох.",
        "Посмотрите фото «до и после» в профиле мастера.",
      ],
    },
  },
  "rent-a-car": {
    me: {
      description:
        "Rent a car agencije iznajmljuju automobile na dan, sedmicu ili duže, od malih gradskih auta do kombija i vozila sa pogonom na sva četiri točka. Ljeti na primorju i oko aerodroma u Podgorici i Tivtu potražnja je velika, pa je pametno rezervisati ranije, a zimi za putovanja na sjever pitaj za zimske gume i lance. Mnoge agencije dostavljaju auto na aerodrom, hotel ili adresu.",
      faq: [
        {
          q: "Šta mi treba da iznajmim auto?",
          a: "Obično važeća vozačka dozvola, lični dokument i često kartica ili depozit, a agencije imaju i svoja pravila o minimalnoj starosti i stažu vozača. Uslove provjeri kod agencije prije rezervacije.",
        },
        {
          q: "Da li mogu autom da pređem granicu?",
          a: "Neke agencije to dozvoljavaju uz dodatnu dokumentaciju i osiguranje, a neke ne. Obavezno najavi unaprijed u koje zemlje ideš.",
        },
        {
          q: "Da li dostavljaju auto na aerodrom ili adresu?",
          a: "Mnoge dostavljaju, ponekad uz doplatu van radnog vremena. Na profilu provjeri mjesta preuzimanja i vraćanja i radno vrijeme.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Sezona, dužina najma, klasa vozila, vrsta osiguranja i franšiza, dodatni vozač, dječije sjedište i vraćanje auta na drugoj lokaciji. Uporedi šta tačno ulazi u ponudu.",
        },
        {
          q: "Na šta da pazim pri preuzimanju auta?",
          a: "Obiđi auto sa predstavnikom agencije, uslikaj sva oštećenja i nivo goriva i provjeri da li su u ugovoru zabilježeni. Pitaj šta osiguranje pokriva, a šta ne.",
        },
      ],
      tips: [
        "Za jul i avgust rezerviši što ranije, posebno ako ti treba automatik ili veći auto.",
        "Pročitaj uslove osiguranja i visinu franšize, ne samo cijenu po danu.",
        "Snimi kratak video auta pri preuzimanju i vraćanju.",
        "Za planinske puteve zimi traži zimske gume i pitaj za lance.",
      ],
    },
    en: {
      description:
        "Car rental agencies hire out vehicles by the day, week or longer, from small city cars to vans and 4x4s. Demand peaks in summer on the coast and around Podgorica and Tivat airports, so book early; in winter, ask about winter tyres and chains if you're heading north. Many local agencies deliver the car to the airport, your hotel or apartment.",
      faq: [
        {
          q: "What do I need to rent a car?",
          a: "Usually a valid driving licence, ID or passport and often a card or deposit, and agencies set their own age and driving-experience rules. Some may ask for an International Driving Permit depending on your licence, so confirm with the agency.",
        },
        {
          q: "Can I drive into neighbouring countries?",
          a: "Some agencies allow it with extra paperwork and insurance (such as a Green Card), others don't. Tell them in advance which countries you plan to visit.",
        },
        {
          q: "Can the car be delivered to the airport or my address?",
          a: "Many agencies deliver, sometimes with an out-of-hours fee. Check pick-up and return locations and hours on the profile.",
        },
        {
          q: "What affects the price?",
          a: "Season, rental length, car class, insurance cover and excess, extra driver, child seats and one-way returns. Compare exactly what is included.",
        },
        {
          q: "What should I check when I collect the car?",
          a: "Walk around the car with the agent, photograph every scratch and the fuel level, and make sure the damage is noted in the contract. Ask what the insurance does and doesn't cover.",
        },
      ],
      tips: [
        "Book early for July and August, especially for automatics or larger cars.",
        "Read the insurance terms and excess, not just the daily rate.",
        "Take a video of the car at pick-up and return.",
        "Ask for winter tyres and chains if driving mountain roads in winter.",
      ],
    },
    ru: {
      description:
        "Прокатные агентства сдают автомобили на день, неделю или дольше — от небольших городских машин до минивэнов и внедорожников. Летом на побережье и у аэропортов Подгорицы и Тивата спрос очень высокий, поэтому бронируйте заранее, а зимой для поездок на север спрашивайте о зимней резине и цепях. Многие агентства подают машину в аэропорт, отель или к дому.",
      faq: [
        {
          q: "Что нужно для аренды?",
          a: "Обычно действующие права, паспорт и часто карта или депозит, а требования к возрасту и стажу у агентств свои. В зависимости от ваших прав могут попросить международное удостоверение — уточните условия заранее.",
        },
        {
          q: "Можно ли выезжать в соседние страны?",
          a: "Некоторые агентства разрешают это с дополнительными документами и страховкой («зелёная карта»), другие нет. Сообщите заранее, куда собираетесь.",
        },
        {
          q: "Подают ли машину в аэропорт или по адресу?",
          a: "Многие подают, иногда с доплатой в нерабочее время. Места получения, возврата и часы работы смотрите в профиле.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От сезона, срока аренды, класса машины, страховки и франшизы, дополнительного водителя, детского кресла и возврата в другом городе. Сравнивайте, что именно входит в цену.",
        },
        {
          q: "На что обратить внимание при получении машины?",
          a: "Осмотрите машину вместе с сотрудником, сфотографируйте все повреждения и уровень топлива и проверьте, что они указаны в договоре. Спросите, что покрывает страховка.",
        },
      ],
      tips: [
        "На июль и август бронируйте как можно раньше, особенно автомат или большую машину.",
        "Читайте условия страховки и размер франшизы, а не только цену за день.",
        "Снимите видео машины при получении и возврате.",
        "Зимой для горных дорог просите зимнюю резину и цепи.",
      ],
    },
  },
  "prevoz": {
    me: {
      description:
        "Prevoz obuhvata selidbe, dostavu namještaja i bijele tehnike, prevoz građevinskog materijala, odvoz stvari i manje ture kombijem ili kamionom, po gradu, između gradova ili van Crne Gore. Često ti trebaju i radnici za nošenje, jer mnoge zgrade nemaju lift ili je lift premali. U starim gradovima i uskim ulicama na primorju pristup kamionom je ograničen, pa to pomeni unaprijed.",
      faq: [
        {
          q: "Da li prevoznik nosi stvari ili samo vozi?",
          a: "Neki nude samo vozilo sa vozačem, a drugi i radnike za utovar, istovar i nošenje uz stepenice. Jasno dogovori šta je uključeno i ko rastavlja namještaj.",
        },
        {
          q: "Da li rade vikendom i van grada?",
          a: "Mnogi rade subotom, a neki i nedjeljom, i voze međugradske ture. Provjeri na profilu radno vrijeme i područje koje pokrivaju.",
        },
        {
          q: "Da li je teret osiguran tokom prevoza?",
          a: "To zavisi od prevoznika, pa pitaj da li imaju osiguranje robe i šta ono pokriva. Vrijedne i lomljive stvari dobro zapakuj i uslikaj prije utovara.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Količina i težina stvari, veličina vozila, udaljenost, sprat i lift, broj radnika, čekanje i pristup vozilom. Pošalji listu stvari ili slike za tačniju ponudu.",
        },
        {
          q: "Koliko ranije da zakažem selidbu?",
          a: "Što ranije, posebno krajem mjeseca i ljeti kad je gužva. Za manji prevoz nekad se nađe termin i za isti ili sljedeći dan.",
        },
      ],
      tips: [
        "Napravi spisak većih komada sa približnim dimenzijama prije nego što tražiš ponudu.",
        "Provjeri da li kamion može prići zgradi i gdje može stati.",
        "Pitaj da li je u cijeni i ambalaža, folija i rastavljanje namještaja.",
        "Dogovori cijenu unaprijed: fiksno za cijelu turu ili po satu.",
      ],
    },
    en: {
      description:
        "Transport covers house and office moves, delivering furniture and appliances, hauling building materials, clearing out items and smaller van or truck jobs, locally, between towns or abroad. You'll often need helpers too, since many buildings have no lift or a tiny one. In old towns and narrow coastal streets truck access can be limited, so mention it when booking.",
      faq: [
        {
          q: "Do they carry things or just drive?",
          a: "Some offer only a vehicle and driver, others provide helpers for loading, unloading and stairs. Agree clearly what's included and who dismantles furniture.",
        },
        {
          q: "Do they work weekends and outside town?",
          a: "Many work Saturdays, some Sundays, and do intercity runs. Check hours and service area on the profile.",
        },
        {
          q: "Are my things insured in transit?",
          a: "It depends on the provider, so ask whether they have goods insurance and what it covers. Pack fragile and valuable items well and photograph them before loading.",
        },
        {
          q: "What affects the price?",
          a: "Volume and weight, vehicle size, distance, floor and lift, number of helpers, waiting time and access. Send a list or photos for a more accurate quote.",
        },
        {
          q: "Can they move my things to or from another country?",
          a: "Some carriers do international moves and handle the paperwork, others only work domestically. Ask what documents you'll need for customs.",
        },
      ],
      tips: [
        "List your large items with rough sizes before asking for quotes.",
        "Check whether a truck can reach your building and where it can park.",
        "Ask whether packing materials and furniture dismantling are included.",
        "Agree in advance on a fixed price or an hourly rate.",
      ],
    },
    ru: {
      description:
        "Грузоперевозки — это переезды квартир и офисов, доставка мебели и техники, перевозка стройматериалов, вывоз вещей и небольшие рейсы фургоном или грузовиком по городу, между городами или за границу. Часто нужны и грузчики: во многих домах нет лифта или он маленький. В старых городах и узких улицах побережья подъезд грузовика ограничен, скажите об этом заранее.",
      faq: [
        {
          q: "Грузчики входят или только водитель?",
          a: "Одни предлагают только машину с водителем, другие — грузчиков для погрузки, разгрузки и подъёма по лестнице. Чётко договоритесь, что входит в услугу и кто разбирает мебель.",
        },
        {
          q: "Работают ли в выходные и за городом?",
          a: "Многие работают по субботам, некоторые и по воскресеньям, и делают междугородние рейсы. Часы и зону обслуживания смотрите в профиле.",
        },
        {
          q: "Застрахован ли груз?",
          a: "Зависит от перевозчика, спросите, есть ли страховка груза и что она покрывает. Хрупкие и ценные вещи хорошо упакуйте и сфотографируйте до погрузки.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От объёма и веса, размера машины, расстояния, этажа и лифта, числа грузчиков, ожидания и подъезда. Пришлите список или фото вещей для точной оценки.",
        },
        {
          q: "Можно ли перевезти вещи из другой страны или в неё?",
          a: "Некоторые перевозчики делают международные переезды и помогают с документами, другие работают только внутри страны. Уточните, какие документы понадобятся для таможни.",
        },
      ],
      tips: [
        "Составьте список крупных вещей с примерными размерами.",
        "Проверьте, сможет ли грузовик подъехать к дому и где встать.",
        "Спросите, входят ли упаковка и разборка мебели.",
        "Заранее договоритесь о фиксированной цене или почасовой оплате.",
      ],
    },
  },
  "vozac": {
    me: {
      description:
        "Vozač je osoba koja vozi tebe ili tvoje vozilo: transfer do aerodroma, prevoz na svadbu ili poslovni sastanak, vožnja na izlet, vraćanje tvog auta kući kad ne smiješ da voziš ili stalni angažman za firmu ili porodicu. Ljeti na primorju potražnja za transferima i turističkim vožnjama je velika. Neki vozači imaju svoje vozilo, a neki voze isključivo tvoje.",
      faq: [
        {
          q: "Da li vozač dolazi sa svojim autom?",
          a: "Zavisi od pružaoca: neki imaju svoje vozilo ili kombi, a neki voze samo tvoj auto. To piše na profilu ili pitaj pri dogovoru.",
        },
        {
          q: "Može li vozač da me sačeka na aerodromu ako kasni let?",
          a: "Mnogi prate let i čekaju, ali pitaj kako naplaćuju čekanje. Pošalji broj leta i broj telefona na koji si dostupan.",
        },
        {
          q: "Da li mogu angažovati vozača za cijeli dan?",
          a: "Da, mnogi rade na sat ili dnevnu tarifu za izlete i obaveze u više gradova. Unaprijed dogovori rutu, pauze i ko plaća gorivo i putarine.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Udaljenost, trajanje, vrsta vozila, broj putnika i prtljaga, noćna vožnja, čekanje i putarine poput tunela Sozina. Traži fiksnu cijenu za poznatu rutu.",
        },
        {
          q: "Na šta da pazim kad biram vozača?",
          a: "Pitaj koje kategorije vozačke ima, koliko iskustva i da li je vozilo registrovano i osigurano za prevoz putnika ako prevozi tvoje goste. Pogledaj ocjene drugih korisnika na profilu.",
        },
      ],
      tips: [
        "Pošalji tačnu adresu, vrijeme i broj putnika i kofera u jednoj poruci.",
        "Za dječije sjedište pitaj unaprijed, jer ga nemaju svi.",
        "Dogovori cijenu prije vožnje, uključujući čekanje i putarine.",
        "Na profilu provjeri koje jezike vozač govori ako vodiš strane goste.",
      ],
    },
    en: {
      description:
        "A driver takes you, or drives your car, where you need to go: airport transfers, weddings and business meetings, day trips, getting your car home when you shouldn't drive, or a regular arrangement for a company or family. On the coast, summer demand for transfers and sightseeing drives is high. Some drivers bring their own vehicle, others only drive yours.",
      faq: [
        {
          q: "Does the driver bring a car?",
          a: "It depends: some have their own car or minivan, others only drive your vehicle. It's usually on the profile, or ask when booking.",
        },
        {
          q: "Will the driver wait if my flight is late?",
          a: "Many track the flight and wait, but ask how waiting time is charged. Send your flight number and a phone number you can be reached on.",
        },
        {
          q: "Can I hire a driver for a whole day?",
          a: "Yes, many work hourly or by the day for trips and errands across several towns. Agree the route, breaks and who pays fuel and tolls up front.",
        },
        {
          q: "What affects the price?",
          a: "Distance, duration, vehicle type, number of passengers and bags, night driving, waiting and tolls such as the Sozina tunnel. Ask for a fixed price on a known route.",
        },
        {
          q: "What should I check before hiring someone?",
          a: "Ask about licence categories and experience, and if they're carrying your guests, whether the vehicle is registered and insured for passenger transport. Read reviews on the profile.",
        },
      ],
      tips: [
        "Send the exact address, time and number of passengers and suitcases in one message.",
        "Ask in advance for a child seat, as not every driver has one.",
        "Agree the price before the ride, including waiting and tolls.",
        "Check the profile for languages the driver speaks.",
      ],
    },
    ru: {
      description:
        "Водитель отвезёт вас или поведёт вашу машину: трансфер в аэропорт, свадьба или деловая встреча, экскурсия на день, перегон вашего автомобиля домой, когда вам нельзя садиться за руль, или постоянная работа на компанию или семью. Летом на побережье спрос на трансферы и туристические поездки высокий. У одних водителей своя машина, другие ездят только на вашей.",
      faq: [
        {
          q: "Водитель приезжает на своей машине?",
          a: "По-разному: у одних есть свой автомобиль или минивэн, другие водят только ваш. Обычно это указано в профиле, или уточните при заказе.",
        },
        {
          q: "Подождёт ли водитель, если рейс задержится?",
          a: "Многие отслеживают рейс и ждут, но спросите, как оплачивается ожидание. Пришлите номер рейса и телефон для связи.",
        },
        {
          q: "Можно ли нанять водителя на весь день?",
          a: "Да, многие работают почасово или по дневному тарифу. Заранее обсудите маршрут, остановки и кто платит за топливо и дорожные сборы.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От расстояния, времени, типа машины, количества пассажиров и багажа, ночной поездки, ожидания и платных участков вроде тоннеля Созина. Для известного маршрута просите фиксированную цену.",
        },
        {
          q: "На что обратить внимание при выборе?",
          a: "Спросите о категориях прав и опыте, а если водитель везёт ваших гостей — зарегистрирована и застрахована ли машина для перевозки пассажиров. Почитайте отзывы в профиле.",
        },
      ],
      tips: [
        "Пришлите точный адрес, время, число пассажиров и чемоданов одним сообщением.",
        "Детское кресло заказывайте заранее — оно есть не у всех.",
        "Договоритесь о цене до поездки, включая ожидание и сборы.",
        "Языки, на которых говорит водитель, смотрите в профиле.",
      ],
    },
  },
  "kurir": {
    me: {
      description:
        "Kurir preuzima i dostavlja pošiljke, dokumenta, pakete, hranu ili kupovinu, najčešće isti dan u okviru grada, a neki voze i između gradova. Koristi se za hitna dokumenta do suda, banke ili notara, dostavu robe kupcima iz male radnje ili onlajn prodavnice i kad nešto zaboraviš kod kuće. Lokalni kuriri na motoru ili autu obično su brži od standardne poštanske dostave za kratke relacije.",
      faq: [
        {
          q: "Može li kurir dostaviti pošiljku isti dan?",
          a: "U okviru grada često može, zavisno od gužve i dostupnosti kurira. Provjeri na profilu da li nude hitnu dostavu i do kada primaju porudžbine.",
        },
        {
          q: "Da li kurir naplaćuje otkupninu za robu?",
          a: "Neki nude dostavu sa naplatom pouzećem i predaju novac prodavcu, a neki ne. Dogovori način i rok predaje novca unaprijed.",
        },
        {
          q: "Da li kurir može da mi kupi i donese nešto?",
          a: "Mnogi rade i kupovinu po listi, iz apoteke, marketa ili radnje, pa naplate uslugu i iznos računa. Pošalji jasnu listu i dogovori šta ako nečega nema.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Udaljenost, veličina i težina pošiljke, hitnost, čekanje i da li je dostava van grada ili van radnog vremena. Za redovnu saradnju pitaj za mjesečni dogovor.",
        },
        {
          q: "Šta ne smijem slati kurirom?",
          a: "Svaki kurir ima svoja pravila, a opasne, zabranjene i jako vrijedne stvari obično se ne primaju ili traže poseban dogovor. Pitaj prije slanja.",
        },
      ],
      tips: [
        "Zapakuj pošiljku i napiši ime i telefon primaoca na njoj.",
        "Primaocu javi da kurir dolazi, da ne bi bila uzaludna tura.",
        "Za dokumenta traži potvrdu o predaji ili sliku uručenja.",
        "Ako šalješ redovno, dogovori fiksne termine preuzimanja.",
      ],
    },
    en: {
      description:
        "A courier picks up and delivers documents, parcels, food or shopping, usually the same day within town, and some also cover routes between towns. People use couriers for urgent papers to a bank, court or notary, deliveries for small shops and online sellers, or when something was left at home. For short distances, a local courier on a scooter or in a car is usually faster than standard postal delivery.",
      faq: [
        {
          q: "Can I get a same-day delivery?",
          a: "Within town it's often possible, depending on traffic and availability. Check the profile for urgent delivery options and cut-off times.",
        },
        {
          q: "Can the courier collect cash on delivery?",
          a: "Some offer cash on delivery and hand the money over to the seller, others don't. Agree how and when the money is passed on.",
        },
        {
          q: "Can a courier buy and bring me something?",
          a: "Many do shopping runs from a pharmacy, supermarket or shop and charge for the service plus the receipt. Send a clear list and say what to do if something is missing.",
        },
        {
          q: "What affects the price?",
          a: "Distance, size and weight, urgency, waiting time and whether it's out of town or out of hours. For regular deliveries, ask about a monthly arrangement.",
        },
        {
          q: "Is there anything I can't send?",
          a: "Each courier has its own rules; dangerous, prohibited or very valuable items are usually refused or need a special arrangement. Ask before sending.",
        },
      ],
      tips: [
        "Pack the item and write the recipient's name and phone number on it.",
        "Let the recipient know the courier is coming to avoid a wasted trip.",
        "For documents, ask for proof of delivery or a photo of the handover.",
        "If you send often, arrange fixed pick-up times.",
      ],
    },
    ru: {
      description:
        "Курьер забирает и доставляет документы, посылки, еду или покупки — чаще всего в тот же день по городу, а некоторые и между городами. Курьеров зовут для срочных бумаг в банк, суд или к нотариусу, доставки для небольших магазинов и онлайн-продавцов или когда что-то забыли дома. На короткие расстояния местный курьер на скутере или машине обычно быстрее обычной почты.",
      faq: [
        {
          q: "Возможна ли доставка в тот же день?",
          a: "По городу часто да, в зависимости от загруженности и наличия курьера. Смотрите в профиле, есть ли срочная доставка и до какого времени принимают заказы.",
        },
        {
          q: "Может ли курьер принять оплату при получении?",
          a: "Некоторые работают с наложенным платежом и передают деньги продавцу, другие нет. Договоритесь заранее, как и когда передаются деньги.",
        },
        {
          q: "Может ли курьер купить и привезти что-то?",
          a: "Многие делают покупки в аптеке, супермаркете или магазине и берут плату за услугу плюс сумму чека. Пришлите понятный список и скажите, что делать, если чего-то нет.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От расстояния, размера и веса, срочности, ожидания и доставки за город или в нерабочее время. Для регулярных отправок спросите о месячном договоре.",
        },
        {
          q: "Что нельзя отправлять?",
          a: "У каждого курьера свои правила; опасные, запрещённые или очень ценные вещи обычно не берут или требуют отдельной договорённости. Спросите до отправки.",
        },
      ],
      tips: [
        "Упакуйте отправление и напишите на нём имя и телефон получателя.",
        "Предупредите получателя, чтобы курьер не ездил впустую.",
        "Для документов просите подтверждение или фото вручения.",
        "При регулярных отправках договоритесь о постоянном времени забора.",
      ],
    },
  },
  "psihoterapeut": {
    me: {
      description:
        "Psihoterapeut kroz razgovor pomaže kod anksioznosti, stresa, tuge, problema u vezi i porodici, gubitka, niskog samopouzdanja ili kad ti je jednostavno teško da se nosiš sa životom. Terapeuti rade u različitim pravcima, na primjer kognitivno-bihejvioralnom, geštalt, sistemskom ili psihodinamskom, individualno, sa parovima ili porodicama, uživo ili onlajn. Psihoterapija ne zamjenjuje psihijatra kad su potrebni ljekovi ili hitna pomoć.",
      faq: [
        {
          q: "Kako izgleda prvi susret sa psihoterapeutom?",
          a: "Na prvom susretu obično pričaš šta te muči i šta bi želio da promijeniš, a terapeut objasni kako radi. To je i prilika da vidiš da li ti odgovara, jer je odnos sa terapeutom važan.",
        },
        {
          q: "Da li je terapija onlajn jednako dobra?",
          a: "Mnogim ljudima onlajn terapija odgovara i praktična je, posebno u manjim mjestima ili ako govoriš drugi jezik. Neki ipak više vole susret uživo, pa probaj šta tebi prija.",
        },
        {
          q: "Koliko dugo traje terapija?",
          a: "To mnogo zavisi od problema, pravca i tvojih ciljeva; nekad je dovoljno nekoliko mjeseci, a nekad traje duže. Pitaj terapeuta da zajedno postavite ciljeve i povremeno provjerite napredak.",
        },
        {
          q: "Da li je razgovor povjerljiv?",
          a: "Psihoterapeuti su profesionalno obavezni na povjerljivost, uz zakonske izuzetke kad postoji ozbiljna opasnost po nečiji život. Slobodno pitaj terapeuta na početku kako to kod njega izgleda.",
        },
        {
          q: "Šta ako sam u krizi i treba mi pomoć odmah?",
          a: "Ako misliš da si u opasnosti ili razmišljaš da se povrijediš, odmah zovi hitnu pomoć na 124 ili idi u najbližu hitnu službu. Psihoterapija je za kontinuirani rad, a ne za akutne krize.",
        },
      ],
      tips: [
        "Pitaj terapeuta za edukaciju, pravac u kome radi i da li je pod supervizijom.",
        "Na profilu provjeri jezike i da li nudi onlajn sesije.",
        "Dozvoli sebi da promijeniš terapeuta ako poslije nekoliko susreta ne osjećaš povjerenje.",
        "Dogovori unaprijed pravila otkazivanja termina i način plaćanja.",
      ],
    },
    en: {
      description:
        "A psychotherapist uses talk therapy to help with anxiety, stress, low mood, relationship and family issues, grief, low self-esteem or simply feeling overwhelmed. Therapists work in different approaches, such as CBT, gestalt, systemic or psychodynamic, with individuals, couples or families, in person or online. For expats, therapy in your own language can matter a lot. Psychotherapy doesn't replace a psychiatrist when medication or emergency care is needed.",
      faq: [
        {
          q: "What happens in the first session?",
          a: "You usually talk about what's bothering you and what you'd like to change, and the therapist explains how they work. It's also a chance to see whether you feel comfortable with them.",
        },
        {
          q: "Is online therapy as good as in person?",
          a: "Many people find online therapy works well and is practical, especially if you want a therapist in your own language. Others prefer face-to-face, so try what suits you.",
        },
        {
          q: "How long does therapy last?",
          a: "It depends a lot on the issue, approach and your goals, from a few months to longer. Ask the therapist to set goals together and review progress from time to time.",
        },
        {
          q: "Is it confidential?",
          a: "Therapists are professionally bound to confidentiality, with legal exceptions when someone's life is in serious danger. Feel free to ask how they handle it at the start.",
        },
        {
          q: "What if I need help right now?",
          a: "If you're in danger or thinking of harming yourself, call emergency services on 124 or go to the nearest emergency department. Therapy is for ongoing work, not acute crises.",
        },
      ],
      tips: [
        "Ask about the therapist's training, approach and whether they have supervision.",
        "Check the profile for languages and online sessions.",
        "It's fine to switch therapists if you don't feel trust after a few sessions.",
        "Agree on cancellation rules and payment method up front.",
      ],
    },
    ru: {
      description:
        "Психотерапевт с помощью разговорной терапии помогает при тревоге, стрессе, подавленности, проблемах в отношениях и семье, утрате, низкой самооценке или когда просто тяжело справляться. Специалисты работают в разных подходах — КПТ, гештальт, системная или психодинамическая терапия — индивидуально, с парами или семьями, очно или онлайн. Для экспатов важна возможность говорить на родном языке. Психотерапия не заменяет психиатра, если нужны лекарства или экстренная помощь.",
      faq: [
        {
          q: "Как проходит первая встреча?",
          a: "Обычно вы рассказываете, что беспокоит и что хотите изменить, а специалист объясняет, как работает. Это и возможность понять, комфортно ли вам с ним.",
        },
        {
          q: "Работает ли онлайн-терапия так же?",
          a: "Многим онлайн-формат подходит и удобен, особенно если нужен терапевт, говорящий по-русски. Другие предпочитают очные встречи — попробуйте, что подходит вам.",
        },
        {
          q: "Сколько длится терапия?",
          a: "Сильно зависит от запроса, подхода и целей — от нескольких месяцев и дольше. Попросите терапевта вместе сформулировать цели и периодически оценивать прогресс.",
        },
        {
          q: "Конфиденциально ли это?",
          a: "Психотерапевты обязаны соблюдать конфиденциальность, с исключениями, предусмотренными законом, при серьёзной угрозе жизни. Можно спросить об этом на первой встрече.",
        },
        {
          q: "Что делать, если помощь нужна прямо сейчас?",
          a: "Если вы в опасности или думаете причинить себе вред, звоните в скорую по номеру 124 или обратитесь в ближайшее отделение неотложной помощи. Терапия — для длительной работы, а не для острого кризиса.",
        },
      ],
      tips: [
        "Спросите об образовании специалиста, его подходе и супервизии.",
        "Проверьте в профиле языки и возможность онлайн-сессий.",
        "Нормально сменить терапевта, если через несколько встреч нет доверия.",
        "Заранее обсудите правила отмены сессий и способ оплаты.",
      ],
    },
  },
  "hipnoterapija": {
    me: {
      description:
        "Hipnoterapija je metoda u kojoj terapeut vođenim opuštanjem i sugestijama dovodi klijenta u stanje fokusirane pažnje, a ljudi joj se najčešće obraćaju zbog stresa, navika poput pušenja ili treme pred nastup. Pristupi i edukacija praktičara se dosta razlikuju, a rezultati zavise od osobe. Hipnoterapija ne zamjenjuje ljekarsku ni psihološku ili psihijatrijsku pomoć, pa za zdravstvene probleme prvo razgovaraj sa ljekarom.",
      faq: [
        {
          q: "Da li ću pod hipnozom izgubiti kontrolu?",
          a: "Većina praktičara objašnjava da si tokom seanse svjestan i da ne možeš biti natjeran na nešto što ne želiš. Pitaj terapeuta da ti na početku objasni kako seansa izgleda.",
        },
        {
          q: "Kako izgleda jedna seansa?",
          a: "Obično počinje razgovorom o tome šta želiš, pa slijedi vođeno opuštanje i rad na temi, a na kraju kratak razgovor. Trajanje i broj seansi zavise od praktičara.",
        },
        {
          q: "Da li hipnoterapija može zamijeniti liječenje?",
          a: "Ne. Ako imaš zdravstvene ili ozbiljne psihičke tegobe, obrati se ljekaru ili psihijatru, a hipnoterapiju razmotri samo kao dodatak uz njihovo znanje.",
        },
        {
          q: "Da li se seanse mogu raditi onlajn?",
          a: "Neki praktičari nude onlajn seanse, a drugi rade samo uživo. Provjeri na profilu.",
        },
        {
          q: "Kome se hipnoterapija ne preporučuje?",
          a: "Mnogi praktičari ne rade sa osobama sa određenim psihijatrijskim stanjima ili epilepsijom bez saglasnosti ljekara. Otvoreno reci terapeutu o svom zdravlju i terapiji koju piješ.",
        },
      ],
      tips: [
        "Pitaj gdje se praktičar educirao i koliko dugo radi.",
        "Budi oprezan prema svakome ko garantuje rezultat poslije jedne seanse.",
        "Ne prekidaj propisanu terapiju bez dogovora sa svojim ljekarom.",
        "Dogovori cijenu i broj seansi unaprijed, bez obaveznih skupih paketa.",
      ],
    },
    en: {
      description:
        "Hypnotherapy is a practice in which the practitioner uses guided relaxation and suggestion to bring you into a state of focused attention. People most often try it for stress, habits such as smoking, or performance nerves. Practitioners' training and methods vary widely, and experiences differ from person to person. Hypnotherapy is not a substitute for medical, psychological or psychiatric care, so talk to a doctor first about any health concern.",
      faq: [
        {
          q: "Will I lose control under hypnosis?",
          a: "Most practitioners explain that you stay aware during a session and can't be made to do something you don't want to. Ask them to walk you through what happens at the start.",
        },
        {
          q: "What does a session look like?",
          a: "Usually a conversation about your goals, then guided relaxation and work on the topic, followed by a short debrief. Length and number of sessions depend on the practitioner.",
        },
        {
          q: "Can hypnotherapy replace medical treatment?",
          a: "No. For physical or serious mental health problems see a doctor or psychiatrist, and consider hypnotherapy only as an add-on with their knowledge.",
        },
        {
          q: "Are sessions available online or in English?",
          a: "Some practitioners work online and in several languages, others only in person. Languages and formats are listed on profiles.",
        },
        {
          q: "Who shouldn't try it?",
          a: "Many practitioners won't work with people with certain psychiatric conditions or epilepsy without a doctor's approval. Be open about your health and any medication.",
        },
      ],
      tips: [
        "Ask where the practitioner trained and how long they've practised.",
        "Be wary of anyone guaranteeing results after one session.",
        "Don't stop prescribed treatment without talking to your doctor.",
        "Agree on price and number of sessions up front, without pressure to buy packages.",
      ],
    },
    ru: {
      description:
        "Гипнотерапия — практика, в которой специалист с помощью направленного расслабления и внушения вводит клиента в состояние сфокусированного внимания. Чаще всего к ней обращаются из-за стресса, привычек вроде курения или волнения перед выступлениями. Подготовка и методы практиков сильно различаются, а опыт у всех разный. Гипнотерапия не заменяет медицинскую, психологическую или психиатрическую помощь, поэтому по вопросам здоровья сначала обратитесь к врачу.",
      faq: [
        {
          q: "Потеряю ли я контроль под гипнозом?",
          a: "Большинство практиков объясняют, что вы остаётесь в сознании и вас нельзя заставить сделать то, чего вы не хотите. Попросите в начале объяснить, как проходит сеанс.",
        },
        {
          q: "Как выглядит сеанс?",
          a: "Обычно сначала разговор о цели, затем направленное расслабление и работа с темой, в конце короткое обсуждение. Длительность и число сеансов зависят от практика.",
        },
        {
          q: "Может ли гипнотерапия заменить лечение?",
          a: "Нет. При проблемах со здоровьем или серьёзных психических трудностях обращайтесь к врачу или психиатру, а гипнотерапию рассматривайте только как дополнение с их ведома.",
        },
        {
          q: "Есть ли онлайн-сеансы или на русском?",
          a: "Некоторые практики работают онлайн и на нескольких языках, другие только очно. Языки и формат указаны в профилях.",
        },
        {
          q: "Кому не стоит пробовать?",
          a: "Многие практики не работают с людьми с некоторыми психиатрическими диагнозами или эпилепсией без согласия врача. Честно расскажите о здоровье и принимаемых лекарствах.",
        },
      ],
      tips: [
        "Спросите, где практик обучался и сколько лет работает.",
        "Осторожно относитесь к обещаниям гарантированного результата за один сеанс.",
        "Не прекращайте назначенное лечение без согласования с врачом.",
        "Заранее договоритесь о цене и числе сеансов, без навязанных дорогих пакетов.",
      ],
    },
  },
  "lajf-kouc": {
    me: {
      description:
        "Lajf kouč ti kroz strukturisane razgovore pomaže da razjasniš ciljeve i napraviš konkretan plan, bilo da je riječ o promjeni posla, pokretanju biznisa, preseljenju, organizaciji vremena ili balansu između posla i privatnog života. Koučing gleda unaprijed i fokusiran je na akciju, a nije terapija i ne bavi se liječenjem psihičkih tegoba. Većina kouča radi onlajn, pa jezik i satnica često znače više od grada.",
      faq: [
        {
          q: "Koja je razlika između kouča i psihoterapeuta?",
          a: "Kouč radi na ciljevima i konkretnim koracima, dok se psihoterapeut bavi emocionalnim teškoćama, obrascima i psihičkim zdravljem. Ako se boriš sa anksioznošću, depresijom ili traumom, obrati se psihoterapeutu ili ljekaru.",
        },
        {
          q: "Kako izgleda prvi razgovor?",
          a: "Mnogi kouči nude kratak uvodni razgovor da vidite da li vam saradnja odgovara. Pripremi jednu ili dvije stvari koje bi želio da promijeniš.",
        },
        {
          q: "Da li se radi onlajn ili uživo?",
          a: "Najčešće onlajn putem video poziva, a neki nude i susrete uživo ili šetnje. Format i jezici su navedeni na profilu.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Iskustvo i edukacija kouča, trajanje sesije, da li se plaća pojedinačno ili paket i da li je između sesija dostupan za poruke. Pitaj šta tačno dobijaš u paketu.",
        },
        {
          q: "Kako da znam da li koučing daje rezultat?",
          a: "Na početku zajedno postavite mjerljive ciljeve i povremeno provjerite napredak. Budi oprezan prema obećanjima o garantovanom uspjehu ili zaradi.",
        },
      ],
      tips: [
        "Pitaj za edukaciju i sertifikat kouča, jer zvanje nije zaštićeno.",
        "Iskoristi uvodni razgovor da provjeriš da li ti odgovara način rada.",
        "Radije počni sa nekoliko sesija nego sa dugim skupim paketom.",
        "Zapisuj dogovorene korake poslije svake sesije.",
      ],
    },
    en: {
      description:
        "A life coach uses structured conversations to help you clarify goals and build a concrete plan, whether it's a career change, starting a business, relocating, managing your time or finding a better work-life balance. Many expats look for coaching while settling into a new life in Montenegro. Coaching is forward-looking and action-focused; it isn't therapy and doesn't treat mental health conditions. Most coaches work online, so language and time zone often matter more than town.",
      faq: [
        {
          q: "How is a coach different from a therapist?",
          a: "A coach works on goals and practical steps, while a therapist deals with emotional difficulties, patterns and mental health. If you're struggling with anxiety, depression or trauma, see a therapist or doctor.",
        },
        {
          q: "What happens in the first call?",
          a: "Many coaches offer a short intro call to see if you're a good fit. Come with one or two things you'd like to change.",
        },
        {
          q: "Online or in person?",
          a: "Mostly online by video, though some offer in-person meetings or walking sessions. Format and languages are listed on the profile.",
        },
        {
          q: "What affects the price?",
          a: "The coach's experience and training, session length, single sessions versus packages and whether they're available by message between sessions. Ask exactly what a package includes.",
        },
        {
          q: "How do I know it's working?",
          a: "Set measurable goals together at the start and review them regularly. Be wary of promises of guaranteed success or income.",
        },
      ],
      tips: [
        "Ask about the coach's training and certification, since the title itself isn't protected.",
        "Use the intro call to check whether their style suits you.",
        "Start with a few sessions rather than a long, expensive package.",
        "Write down the agreed actions after each session.",
      ],
    },
    ru: {
      description:
        "Лайф-коуч в структурированных разговорах помогает прояснить цели и составить конкретный план — смена работы, запуск бизнеса, переезд, управление временем или баланс работы и личной жизни. Многие переехавшие в Черногорию ищут коуча, чтобы выстроить новую жизнь. Коучинг ориентирован на будущее и действия, это не терапия и не лечение психических расстройств. Большинство коучей работают онлайн, поэтому язык и часовой пояс важнее города.",
      faq: [
        {
          q: "Чем коуч отличается от психотерапевта?",
          a: "Коуч работает с целями и практическими шагами, психотерапевт — с эмоциональными трудностями, паттернами и психическим здоровьем. При тревоге, депрессии или травме обращайтесь к психотерапевту или врачу.",
        },
        {
          q: "Как проходит первый разговор?",
          a: "Многие коучи предлагают короткую вводную встречу, чтобы понять, подходите ли вы друг другу. Подготовьте одну-две вещи, которые хотите изменить.",
        },
        {
          q: "Онлайн или очно?",
          a: "Чаще онлайн по видеосвязи, но некоторые предлагают очные встречи или сессии на прогулке. Формат и языки указаны в профиле.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От опыта и обучения коуча, длительности сессии, разовой оплаты или пакета и доступности в переписке между сессиями. Уточните, что входит в пакет.",
        },
        {
          q: "Как понять, что коучинг работает?",
          a: "В начале сформулируйте измеримые цели и регулярно их пересматривайте. Настороженно относитесь к обещаниям гарантированного успеха или дохода.",
        },
      ],
      tips: [
        "Спросите об обучении и сертификации — само звание не защищено.",
        "Используйте вводную встречу, чтобы понять, подходит ли стиль работы.",
        "Начните с нескольких сессий, а не с длинного дорогого пакета.",
        "Записывайте договорённые шаги после каждой сессии.",
      ],
    },
  },
  "defektolog": {
    me: {
      description:
        "Defektolog radi sa djecom, a nekad i odraslima, koji imaju razvojne teškoće: kašnjenje u govoru i razvoju, poremećaje iz autističnog spektra, ADHD, intelektualne teškoće, teškoće u učenju ili posljedice oštećenja sluha i vida. Kroz individualne vježbe radi na pažnji, komunikaciji, motorici, samostalnosti i pripremi za školu, i savjetuje roditelje kako da nastave rad kod kuće. Često sarađuje sa logopedom, pedijatrom, psihologom i vrtićem ili školom.",
      faq: [
        {
          q: "Kada da se obratim defektologu?",
          a: "Kad primijetiš da dijete značajno kasni u govoru, igri, motorici ili kontaktu u odnosu na vršnjake, ili ako to predloži pedijatar, vaspitač ili učitelj. Bolje je provjeriti ranije nego čekati.",
        },
        {
          q: "Kako izgleda prva procjena?",
          a: "Defektolog obično razgovara sa roditeljima, posmatra dijete u igri i kroz zadatke procjenjuje razvoj. Ponesi nalaze ljekara i drugih stručnjaka ako ih imaš.",
        },
        {
          q: "Da li defektolog postavlja dijagnozu?",
          a: "Dijagnoze postavljaju ljekari i nadležne komisije, a defektolog daje stručnu procjenu i plan rada. Za zvaničnu dijagnozu i prava obrati se pedijatru ili nadležnoj ustanovi.",
        },
        {
          q: "Koliko često dijete treba da dolazi?",
          a: "To zavisi od djeteta i cilja, pa će defektolog predložiti plan poslije procjene. Redovnost i rad kod kuće obično su jednako važni kao i sami tretmani.",
        },
        {
          q: "Da li defektolog radi u vrtiću, kod kuće ili onlajn?",
          a: "Neki rade u kabinetu, neki dolaze kući ili u vrtić, a savjetovanje roditelja nekad ide i onlajn. Na profilu provjeri način rada i jezike.",
        },
      ],
      tips: [
        "Pitaj za smjer studija i iskustvo sa djecom sličnih teškoća.",
        "Zamoli defektologa da ti pokaže vježbe koje možeš raditi kod kuće.",
        "Traži da povremeno zajedno pregledate napredak i ciljeve.",
        "Budi oprezan prema obećanjima da će dijete „izliječiti“ za kratko vrijeme.",
      ],
    },
    en: {
      description:
        "A special education teacher (defektolog) works with children, and sometimes adults, who have developmental difficulties: speech and developmental delays, autism, ADHD, intellectual disability, learning difficulties or the effects of hearing and vision impairment. Through individual sessions they work on attention, communication, motor skills, independence and school readiness, and show parents how to continue at home. They often collaborate with speech therapists, paediatricians, psychologists and the child's kindergarten or school.",
      faq: [
        {
          q: "When should I see a defektolog?",
          a: "When your child is noticeably behind peers in speech, play, motor skills or social contact, or when a paediatrician or teacher suggests it. Checking early is better than waiting.",
        },
        {
          q: "What happens at the first assessment?",
          a: "They usually talk with the parents, watch the child play and use tasks to assess development. Bring any medical or specialist reports you have.",
        },
        {
          q: "Do they give a diagnosis?",
          a: "Diagnoses come from doctors and official assessment bodies; a defektolog gives a professional assessment and a work plan. For an official diagnosis and entitlements, ask your paediatrician or the relevant institution.",
        },
        {
          q: "How often will my child need sessions?",
          a: "It depends on the child and the goals, so they'll suggest a plan after the assessment. Consistency and practice at home usually matter as much as the sessions.",
        },
        {
          q: "Can they work in English or another language?",
          a: "Some can, and for young bilingual children it's worth discussing which language to use. Languages and whether they visit homes or kindergartens are listed on profiles.",
        },
      ],
      tips: [
        "Ask about their specialisation and experience with similar difficulties.",
        "Ask to be shown exercises you can do at home.",
        "Review progress and goals together regularly.",
        "Be wary of anyone promising to “cure” a condition quickly.",
      ],
    },
    ru: {
      description:
        "Дефектолог работает с детьми, а иногда и со взрослыми, у которых есть трудности развития: задержка речевого и общего развития, расстройства аутистического спектра, СДВГ, интеллектуальные нарушения, трудности обучения, последствия нарушений слуха и зрения. На индивидуальных занятиях он развивает внимание, коммуникацию, моторику, самостоятельность, готовит к школе и учит родителей продолжать занятия дома. Часто работает вместе с логопедом, педиатром, психологом, садиком или школой.",
      faq: [
        {
          q: "Когда обращаться к дефектологу?",
          a: "Когда ребёнок заметно отстаёт от сверстников в речи, игре, моторике или контакте, или если это советуют педиатр либо воспитатель. Лучше проверить раньше, чем ждать.",
        },
        {
          q: "Как проходит первая диагностика?",
          a: "Обычно дефектолог беседует с родителями, наблюдает за ребёнком в игре и оценивает развитие через задания. Возьмите заключения врачей и других специалистов, если они есть.",
        },
        {
          q: "Ставит ли дефектолог диагноз?",
          a: "Диагнозы ставят врачи и официальные комиссии, дефектолог даёт профессиональную оценку и план занятий. За официальным диагнозом и правами обращайтесь к педиатру или в соответствующее учреждение.",
        },
        {
          q: "Как часто нужны занятия?",
          a: "Зависит от ребёнка и целей, план специалист предложит после диагностики. Регулярность и занятия дома обычно так же важны, как сами встречи.",
        },
        {
          q: "Можно ли заниматься на русском?",
          a: "Некоторые специалисты работают на русском; для двуязычных детей стоит обсудить, на каком языке заниматься. Языки и формат (кабинет, дом, садик) указаны в профилях.",
        },
      ],
      tips: [
        "Спросите о специализации и опыте работы с похожими трудностями.",
        "Попросите показать упражнения для занятий дома.",
        "Регулярно вместе пересматривайте цели и прогресс.",
        "Настороженно относитесь к обещаниям быстро «вылечить» ребёнка.",
      ],
    },
  },
  "pedagog": {
    me: {
      description:
        "Pedagog savjetuje roditelje i djecu oko učenja, vaspitanja i ponašanja: kako organizovati učenje kod kuće, šta kad dijete neće u školu, ima slabe ocjene, sukobe sa vršnjacima ili ne sluša, i kako se pripremiti za polazak u vrtić ili školu. Porodicama koje su se doselile iz drugih zemalja pomaže i oko prilagođavanja djeteta na novu sredinu, jezik i školski sistem. Radi individualno, sa roditeljima ili cijelom porodicom.",
      faq: [
        {
          q: "Kada da se obratim pedagogu?",
          a: "Kad primijetiš dužu promjenu u ponašanju, motivaciji ili uspjehu djeteta, ili kad ne znaš kako da riješiš neki vaspitni problem. Nekad je dovoljno nekoliko razgovora da se dobije jasniji plan.",
        },
        {
          q: "Da li na prvi susret dolazim sam ili sa djetetom?",
          a: "Često pedagog prvo razgovara sa roditeljima, a zatim upozna dijete. Pitaj unaprijed kako radi i ponesi bilješke o tome šta primjećuješ.",
        },
        {
          q: "Da li pedagog pomaže oko upisa i prelaska u novu školu?",
          a: "Može da te posavjetuje kako da pripremiš dijete i šta da pitaš školu, ali o proceduri upisa i priznavanju svjedočanstava odlučuju škola i nadležno ministarstvo. Te informacije potvrdi kod njih.",
        },
        {
          q: "Da li se radi onlajn?",
          a: "Savjetovanje roditelja često može i onlajn, a rad sa djetetom obično je bolji uživo. Format i jezici su na profilu.",
        },
        {
          q: "Koja je razlika između pedagoga, psihologa i defektologa?",
          a: "Pedagog se bavi učenjem, vaspitanjem i ponašanjem, psiholog emocijama i psihičkim razvojem, a defektolog razvojnim teškoćama. Pedagog će ti reći ako je bolje da se obratiš nekom drugom stručnjaku.",
        },
      ],
      tips: [
        "Prije susreta zapiši konkretne situacije koje te brinu i koliko dugo traju.",
        "Uključi drugog roditelja ili staratelja u razgovore kad god možeš.",
        "Pitaj za iskustvo sa djecom uzrasta tvog djeteta.",
        "Dogovori mali broj konkretnih koraka i provjeri ih na sljedećem susretu.",
      ],
    },
    en: {
      description:
        "An educational counsellor (pedagog) advises parents and children on learning, upbringing and behaviour: organising homework, a child refusing school, falling grades, conflicts with peers or not listening, and getting ready to start kindergarten or school. For families who have moved to Montenegro, they can also help a child adjust to a new environment, language and school system. They work one-to-one, with parents or with the whole family.",
      faq: [
        {
          q: "When is it worth seeing a pedagog?",
          a: "When you notice a lasting change in your child's behaviour, motivation or school results, or you're stuck on a parenting issue. Sometimes a few conversations are enough to get a clear plan.",
        },
        {
          q: "Do I come alone or with my child the first time?",
          a: "Often the pedagog meets the parents first and then the child. Ask how they work and bring notes on what you've noticed.",
        },
        {
          q: "Can they help with enrolling in a local or international school?",
          a: "They can help you prepare your child and know what to ask, but enrolment and recognition of foreign school records are decided by the school and the Ministry of Education. Confirm those details with them.",
        },
        {
          q: "Is it possible online?",
          a: "Parent counselling often works online, while work with the child is usually better in person. Formats and languages are listed on the profile.",
        },
        {
          q: "How is a pedagog different from a psychologist?",
          a: "A pedagog focuses on learning, upbringing and behaviour, a psychologist on emotions and psychological development, and a defektolog on developmental difficulties. A good pedagog will refer you on when needed.",
        },
      ],
      tips: [
        "Before the first meeting, write down specific situations that worry you and how long they've lasted.",
        "Involve the other parent or carer whenever possible.",
        "Ask about experience with children of your child's age.",
        "Agree on a few concrete steps and review them at the next meeting.",
      ],
    },
    ru: {
      description:
        "Педагог консультирует родителей и детей по вопросам учёбы, воспитания и поведения: как организовать домашние задания, что делать, если ребёнок не хочет в школу, съехали оценки, конфликты со сверстниками или непослушание, как подготовиться к садику или школе. Семьям, переехавшим в Черногорию, он помогает с адаптацией ребёнка к новой среде, языку и школьной системе. Работает индивидуально, с родителями или всей семьёй.",
      faq: [
        {
          q: "Когда стоит обратиться к педагогу?",
          a: "Когда заметили устойчивые изменения в поведении, мотивации или успеваемости ребёнка или не знаете, как решить воспитательную проблему. Иногда нескольких встреч достаточно, чтобы появился понятный план.",
        },
        {
          q: "Приходить на первую встречу одному или с ребёнком?",
          a: "Часто педагог сначала говорит с родителями, а потом знакомится с ребёнком. Уточните заранее и возьмите записи о том, что вас беспокоит.",
        },
        {
          q: "Поможет ли педагог с поступлением в местную или международную школу?",
          a: "Он поможет подготовить ребёнка и понять, что спрашивать, но зачисление и признание иностранных документов об образовании решают школа и министерство образования. Уточняйте это у них.",
        },
        {
          q: "Можно ли онлайн?",
          a: "Консультации для родителей часто проходят онлайн, а с ребёнком обычно лучше работать очно. Формат и языки указаны в профиле.",
        },
        {
          q: "Чем педагог отличается от психолога?",
          a: "Педагог занимается учёбой, воспитанием и поведением, психолог — эмоциями и психическим развитием, дефектолог — трудностями развития. Хороший педагог подскажет, если нужен другой специалист.",
        },
      ],
      tips: [
        "Перед встречей запишите конкретные ситуации и как долго они длятся.",
        "По возможности приходите вместе со вторым родителем.",
        "Спросите об опыте работы с детьми того же возраста.",
        "Договоритесь о нескольких конкретных шагах и проверьте их на следующей встрече.",
      ],
    },
  },
  "rani-razvoj-djece": {
    me: {
      description:
        "Programi ranog razvoja djece su igraonice, radionice i individualni časovi za bebe i djecu predškolskog uzrasta koji kroz igru podstiču govor, motoriku, čula, muziku, socijalne vještine i samostalnost. To može biti senzorna igra za bebe, montesori pristup, muzičke i jezičke radionice ili grupe za mame i bebe. Ovo nije zamjena za pregled kod pedijatra, a ako te nešto u razvoju djeteta brine, obrati se ljekaru ili stručnjaku.",
      faq: [
        {
          q: "Od kog uzrasta dijete može da krene?",
          a: "Neki programi primaju bebe od nekoliko mjeseci uz roditelja, a drugi su za djecu od dvije ili tri godine. Uzrast grupe provjeri na profilu.",
        },
        {
          q: "Da li roditelj ostaje sa djetetom?",
          a: "Kod najmlađih je roditelj obično prisutan, a starija djeca često ostaju sama sa vaspitačem. Pitaj kako izgleda privikavanje ako dijete prvi put ostaje bez tebe.",
        },
        {
          q: "Kako izgleda jedan čas?",
          a: "Obično kombinuje slobodnu i vođenu igru, pjesmu, pokret i kratke aktivnosti prilagođene uzrastu. Mnogi nude probni čas da vidiš da li djetetu odgovara.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Da li je grupni ili individualni rad, veličina grupe, trajanje i broj časova mjesečno, materijal i kvalifikacije voditelja. Pitaj da li se propušteni časovi nadoknađuju.",
        },
        {
          q: "Da li ima programa na stranim jezicima?",
          a: "Neke igraonice rade na engleskom, ruskom ili dvojezično. Jezici su navedeni na profilu.",
        },
      ],
      tips: [
        "Obiđi prostor i pogledaj da li je čist, bezbjedan i prilagođen uzrastu.",
        "Pitaj koliko djece dolazi na jednog odraslog.",
        "Iskoristi probni čas prije nego što platiš mjesec unaprijed.",
        "Pitaj za kvalifikacije voditelja i iskustvo sa malom djecom.",
      ],
    },
    en: {
      description:
        "Early childhood development programmes are playgroups, workshops and one-to-one sessions for babies and preschoolers that use play to support language, motor skills, the senses, music, social skills and independence. Options include sensory play for babies, Montessori-style groups, music and language classes and parent-and-baby meetups, which are also a good way for newly arrived families to meet others. These programmes don't replace paediatric check-ups; if something about your child's development worries you, see a doctor or specialist.",
      faq: [
        {
          q: "From what age can my child join?",
          a: "Some programmes take babies from a few months old with a parent, others start at two or three years. Check the age groups on the profile.",
        },
        {
          q: "Do parents stay during the session?",
          a: "With the youngest children a parent usually stays, while older ones often stay with the teacher. Ask how settling-in works if it's their first time without you.",
        },
        {
          q: "What does a session look like?",
          a: "Typically a mix of free and guided play, songs, movement and short age-appropriate activities. Many offer a trial class.",
        },
        {
          q: "What affects the price?",
          a: "Group or individual sessions, group size, length and number of classes per month, materials and the leader's qualifications. Ask whether missed classes can be made up.",
        },
        {
          q: "Are there groups in English or other languages?",
          a: "Some run in English, Russian or bilingually. Languages are listed on the profile.",
        },
      ],
      tips: [
        "Visit the space and check it's clean, safe and suitable for the age group.",
        "Ask how many children there are per adult.",
        "Try a trial class before paying for a month in advance.",
        "Ask about the leader's qualifications and experience with young children.",
      ],
    },
    ru: {
      description:
        "Программы раннего развития — это игровые группы, мастер-классы и индивидуальные занятия для малышей и дошкольников, которые через игру развивают речь, моторику, органы чувств, музыкальность, социальные навыки и самостоятельность. Это может быть сенсорная игра для младенцев, группы по Монтессори, музыкальные и языковые занятия или встречи «мама и малыш» — хороший способ для недавно переехавших семей познакомиться с другими. Такие занятия не заменяют осмотр у педиатра; если что-то в развитии ребёнка вас беспокоит, обратитесь к врачу или специалисту.",
      faq: [
        {
          q: "С какого возраста можно начинать?",
          a: "Некоторые программы принимают младенцев с нескольких месяцев вместе с родителем, другие — с двух-трёх лет. Возраст групп смотрите в профиле.",
        },
        {
          q: "Остаётся ли родитель на занятии?",
          a: "С самыми маленькими родитель обычно рядом, дети постарше часто остаются с педагогом. Спросите, как проходит адаптация, если ребёнок впервые остаётся без вас.",
        },
        {
          q: "Как проходит занятие?",
          a: "Обычно это сочетание свободной и направленной игры, песен, движения и коротких заданий по возрасту. Многие предлагают пробное занятие.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От формата (группа или индивидуально), размера группы, длительности и числа занятий в месяц, материалов и квалификации педагога. Уточните, можно ли отработать пропуски.",
        },
        {
          q: "Есть ли группы на русском?",
          a: "Некоторые студии работают на русском, английском или двуязычно. Языки указаны в профиле.",
        },
      ],
      tips: [
        "Посмотрите помещение: чисто ли, безопасно ли и подходит ли по возрасту.",
        "Спросите, сколько детей приходится на одного взрослого.",
        "Сходите на пробное занятие, прежде чем платить за месяц.",
        "Уточните квалификацию педагога и опыт работы с малышами.",
      ],
    },
  },
  "njegovatelj": {
    me: {
      description:
        "Njegovatelj pomaže starijim, bolesnim ili nepokretnim osobama u svakodnevnom životu: lična higijena, oblačenje, hranjenje, pomoć pri kretanju, podsjećanje na terapiju, kupovina, društvo i pratnja kod ljekara. Može dolaziti na nekoliko sati, preko dana, noću ili živjeti sa porodicom. Često ga traže djeca koja žive u drugom gradu ili inostranstvu, a roditelji ostaju u Crnoj Gori. Medicinske postupke poput injekcija i previjanja rade medicinske sestre, pa to razjasni unaprijed.",
      faq: [
        {
          q: "Da li njegovatelj može davati injekcije i terapiju?",
          a: "Njegovatelj obično pomaže oko svakodnevne njege i podsjeća na ljekove, a medicinske postupke radi medicinska sestra ili tehničar. Provjeri kvalifikacije i šta osoba smije da radi.",
        },
        {
          q: "Da li je moguća njega preko noći ili 24 sata?",
          a: "Neki njegovatelji rade noćne smjene ili žive sa korisnikom, a drugi samo po nekoliko sati dnevno. Dogovori tačan raspored, slobodne dane i zamjenu kad je njegovatelj spriječen.",
        },
        {
          q: "Kako da provjerim njegovatelja kad ne živim u istom gradu?",
          a: "Obavi razgovor uživo ili video pozivom, traži preporuke prethodnih porodica i dogovori probni period. Zamoli komšiju ili rođaka da povremeno svrati.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj sati i smjena, noćni rad, vikendi i praznici, stepen pokretnosti i potreba osobe, iskustvo njegovatelja i da li živi sa korisnikom. Dogovori jasno i ko plaća prevoz i hranu.",
        },
        {
          q: "Šta da pripremim za prvi dan?",
          a: "Spisak ljekova i rasporeda, kontakte ljekara i porodice, navike i ishranu osobe i gdje su potrebne stvari. Pokaži njegovatelju i šta da radi u hitnom slučaju.",
        },
      ],
      tips: [
        "Upoznaj njegovatelja zajedno sa osobom o kojoj će brinuti, da vidiš da li se slažu.",
        "Napravite pisani dogovor o obavezama, satima, plaćanju i otkaznom roku.",
        "Pitaj za iskustvo sa demencijom ili nepokretnim osobama ako je to potrebno.",
        "Dogovorite način redovnog javljanja porodici, na primjer kratku poruku svaki dan.",
      ],
    },
    en: {
      description:
        "A carer helps elderly, ill or bedridden people with daily life: personal hygiene, dressing, meals, mobility, medication reminders, shopping, company and accompanying them to the doctor. Care can be a few hours a day, day or night shifts, or live-in. Families often look for a carer when they live abroad or in another town and a parent stays in Montenegro. Medical procedures such as injections or wound care are done by nurses, so clarify this up front.",
      faq: [
        {
          q: "Can a carer give injections or manage medication?",
          a: "Carers usually help with daily care and remind about medication, while medical procedures are done by a nurse. Check the person's qualifications and what they're allowed to do.",
        },
        {
          q: "Is overnight or 24-hour care possible?",
          a: "Some carers do night shifts or live in, others work a few hours a day. Agree the exact schedule, days off and cover when the carer is unavailable.",
        },
        {
          q: "How can I check a carer if I live abroad?",
          a: "Interview them by video or in person, ask for references from previous families and agree a trial period. Ask a neighbour or relative to drop in now and then.",
        },
        {
          q: "What affects the price?",
          a: "Hours and shifts, night work, weekends and holidays, the person's mobility and needs, the carer's experience and whether it's live-in. Agree who covers transport and meals.",
        },
        {
          q: "What should I prepare for the first day?",
          a: "A list of medications and times, doctors' and family contacts, the person's habits and diet, and where things are. Explain what to do in an emergency.",
        },
      ],
      tips: [
        "Introduce the carer to the person they'll look after before agreeing, to see if they get on.",
        "Put duties, hours, pay and notice period in a written agreement.",
        "Ask about experience with dementia or bedridden patients if needed.",
        "Agree on regular updates to the family, such as a short daily message.",
      ],
    },
    ru: {
      description:
        "Сиделка помогает пожилым, больным или лежачим людям в повседневной жизни: гигиена, одевание, кормление, помощь при передвижении, напоминание о лекарствах, покупки, общение и сопровождение к врачу. Можно договориться на несколько часов, дневные или ночные смены или проживание с подопечным. Часто сиделку ищут дети, живущие за границей или в другом городе, когда родители остаются в Черногории. Медицинские процедуры вроде уколов и перевязок выполняет медсестра — это стоит уточнить заранее.",
      faq: [
        {
          q: "Может ли сиделка делать уколы и давать лекарства?",
          a: "Сиделка обычно помогает с уходом и напоминает о лекарствах, а медицинские процедуры выполняет медсестра. Уточните квалификацию и что человек вправе делать.",
        },
        {
          q: "Возможен ли ночной или круглосуточный уход?",
          a: "Одни работают ночью или живут с подопечным, другие — по несколько часов в день. Обсудите точный график, выходные и замену на случай болезни сиделки.",
        },
        {
          q: "Как проверить сиделку, если я живу за границей?",
          a: "Проведите собеседование по видео или лично, попросите рекомендации от прежних семей и договоритесь об испытательном сроке. Попросите соседа или родственника иногда заходить.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От часов и смен, ночной работы, выходных и праздников, состояния подопечного, опыта сиделки и проживания. Договоритесь, кто оплачивает проезд и питание.",
        },
        {
          q: "Что подготовить к первому дню?",
          a: "Список лекарств и график приёма, контакты врачей и родных, привычки и питание подопечного и где что лежит. Объясните, что делать в экстренной ситуации.",
        },
      ],
      tips: [
        "Познакомьте сиделку с подопечным до договорённости, чтобы понять, сладятся ли они.",
        "Оформите письменную договорённость об обязанностях, часах, оплате и сроке предупреждения.",
        "Спросите об опыте ухода при деменции или за лежачими, если это нужно.",
        "Договоритесь о регулярной связи с семьёй, например коротком сообщении каждый день.",
      ],
    },
  },
  "licni-trener": {
    me: {
      description:
        "Lični trener pravi program vježbanja prema tvom cilju i formi, bilo da želiš da smršaš, ojačaš, vratiš se aktivnostima poslije pauze ili se pripremiš za planinarenje ili sezonu. Trenira te u teretani, na otvorenom, kod kuće ili onlajn, pazi na pravilnu tehniku i prati napredak. Ljeti na primorju mnogi treniraju rano ujutro ili uveče na plaži i šetalištima zbog vrućine. Ako imaš zdravstvenih problema ili povrede, prije početka se posavjetuj sa ljekarom.",
      faq: [
        {
          q: "Kako izgleda prvi trening?",
          a: "Obično počinje razgovorom o ciljevima, zdravlju i navikama, pa slijedi procjena kondicije i pokretljivosti. Trener onda predloži plan i učestalost treninga.",
        },
        {
          q: "Da li trener dolazi kući ili trenira napolju?",
          a: "Neki treniraju samo u svojoj teretani, a neki dolaze kući ili rade u parku, na plaži ili onlajn. Na profilu provjeri gdje trener radi.",
        },
        {
          q: "Da li lični trener pravi i plan ishrane?",
          a: "Mnogi daju opšte savjete o ishrani, a detaljan plan ishrane, posebno kod zdravstvenih stanja, treba da radi nutricionista ili ljekar. Pitaj šta trener nudi.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Trajanje i broj treninga, individualni ili rad u paru ili grupi, lokacija, članarina teretane i iskustvo trenera. Paketi treninga su često povoljniji od pojedinačnih.",
        },
        {
          q: "Šta da ponesem na trening?",
          a: "Udobnu opremu, patike, peškir i vodu, a ljeti i zaštitu od sunca za treninge napolju. Treneru reci za svaku povredu ili terapiju koju koristiš.",
        },
      ],
      tips: [
        "Pitaj trenera za edukaciju i iskustvo sa ciljem sličnim tvom.",
        "Odradi probni trening prije kupovine većeg paketa.",
        "Traži da ti zapisuje ili šalje program, da pratiš napredak.",
        "Dogovori pravila otkazivanja i šta se dešava sa neiskorišćenim treninzima.",
      ],
    },
    en: {
      description:
        "A personal trainer builds an exercise programme around your goal and fitness level, whether that's losing weight, getting stronger, returning to activity after a break or preparing for hiking or a sports season. They train you in a gym, outdoors, at home or online, correct your technique and track progress. On the coast in summer, many people train early morning or evening on beaches and promenades to avoid the heat. If you have health issues or injuries, check with a doctor before starting.",
      faq: [
        {
          q: "What happens in the first session?",
          a: "Usually a chat about goals, health and routine, then a check of fitness and mobility. The trainer then suggests a plan and how often to train.",
        },
        {
          q: "Will a trainer come to my home or train outdoors?",
          a: "Some only work in their gym, others come to your home or train in parks, on the beach or online. Check the profile.",
        },
        {
          q: "Do trainers make meal plans?",
          a: "Many give general nutrition advice, but a detailed meal plan, especially for medical conditions, should come from a nutritionist or doctor. Ask what's included.",
        },
        {
          q: "What affects the price?",
          a: "Session length and number, one-to-one or with a partner or group, location, gym fees and the trainer's experience. Packages are often cheaper per session.",
        },
        {
          q: "Do trainers work in English?",
          a: "Some do; languages are listed on profiles. It helps if you both understand technique cues clearly, so ask at the first contact.",
        },
      ],
      tips: [
        "Ask about the trainer's qualifications and experience with goals like yours.",
        "Try a trial session before buying a large package.",
        "Ask for your programme in writing so you can track progress.",
        "Agree on cancellation rules and what happens to unused sessions.",
      ],
    },
    ru: {
      description:
        "Персональный тренер составляет программу под вашу цель и уровень подготовки: похудеть, стать сильнее, вернуться к нагрузкам после перерыва или подготовиться к походам и сезону. Он тренирует вас в зале, на улице, дома или онлайн, следит за техникой и отслеживает прогресс. Летом на побережье многие тренируются рано утром или вечером на пляже и набережных, чтобы избежать жары. При проблемах со здоровьем или травмах перед началом проконсультируйтесь с врачом.",
      faq: [
        {
          q: "Как проходит первая тренировка?",
          a: "Обычно это разговор о целях, здоровье и образе жизни, затем оценка физической формы и подвижности. После этого тренер предлагает план и частоту занятий.",
        },
        {
          q: "Приезжает ли тренер домой или занимается на улице?",
          a: "Одни работают только в своём зале, другие приезжают домой или тренируют в парке, на пляже или онлайн. Смотрите профиль.",
        },
        {
          q: "Составляет ли тренер план питания?",
          a: "Многие дают общие советы по питанию, но детальный рацион, особенно при заболеваниях, должен составлять диетолог или врач. Уточните, что входит.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От длительности и количества тренировок, формата (индивидуально, в паре или группе), места, абонемента в зал и опыта тренера. Пакеты обычно выгоднее разовых занятий.",
        },
        {
          q: "Есть ли тренеры, говорящие по-русски?",
          a: "Языки указаны в профилях. Важно, чтобы вы хорошо понимали подсказки по технике, поэтому уточните это при первом контакте.",
        },
      ],
      tips: [
        "Спросите об образовании тренера и опыте работы с похожими целями.",
        "Сходите на пробную тренировку до покупки большого пакета.",
        "Попросите программу в письменном виде, чтобы отслеживать прогресс.",
        "Договоритесь о правилах отмены и неиспользованных тренировках.",
      ],
    },
  },
  "kuvar": {
    me: {
      description:
        "Privatni kuvar sprema hranu kod tebe kući, u vili ili na brodu: večere za posebne prilike, proslave, meni za goste tokom odmora ili pripremu obroka za cijelu sedmicu. Može kuvati lokalne specijalitete, primorsku kuhinju sa ribom i plodovima mora, jela sa sjevera ili po tvojim željama i ograničenjima u ishrani. Ljeti na primorju, u sezoni vila i jahti, dobri kuvari su brzo zauzeti, pa ih rezerviši ranije.",
      faq: [
        {
          q: "Ko kupuje namirnice?",
          a: "Obično kuvar kupuje namirnice i naplati ih po računu ili ih uračuna u cijenu po osobi, a nekad ti kupuješ po njegovoj listi. Dogovori to unaprijed.",
        },
        {
          q: "Da li kuvar dolazi sa posuđem i opremom?",
          a: "Neki donose svoje noževe i posebnu opremu, a računaju na tvoju kuhinju i posuđe. Pitaj šta mu treba i da li može da donese servis ako ga nemaš dovoljno.",
        },
        {
          q: "Da li kuvar servira i čisti poslije?",
          a: "Neki serviraju i ostave kuhinju čistu, drugi samo kuvaju, a za veći broj gostiju donose i konobara. Jasno dogovori šta ulazi u uslugu.",
        },
        {
          q: "Šta utiče na cijenu?",
          a: "Broj gostiju i sljedova, vrsta namirnica (na primjer svježa riba i plodovi mora), lokacija i putovanje, serviranje i čišćenje i sezona. Traži ponudu sa predloženim menijem.",
        },
        {
          q: "Da li može da prilagodi meni alergijama i ishrani?",
          a: "Većina kuvara prilagođava meni vegetarijancima, veganima i alergijama. Unaprijed napiši sve alergije i ograničenja, a za ozbiljne alergije posebno naglasi opasnost od unakrsne kontaminacije.",
        },
      ],
      tips: [
        "Pošalji broj gostiju, datum, lokaciju i opis kuhinje kad tražiš ponudu.",
        "Traži predlog menija i pitaj za slike prethodnih događaja.",
        "Za ljeto na primorju rezerviši kuvara nekoliko sedmica unaprijed.",
        "Dogovori da li se plaća avans i šta ako se događaj otkaže.",
      ],
    },
    en: {
      description:
        "A private chef cooks at your home, villa or on a boat: dinners for special occasions, parties, menus for guests during a holiday, or meal prep for the week. They can cook local specialities, coastal seafood, hearty dishes from the north or anything to your taste and dietary needs. In summer, villa and yacht season on the coast keeps good chefs busy, so book early.",
      faq: [
        {
          q: "Who buys the groceries?",
          a: "Usually the chef shops and either charges the receipts or includes food in a per-person price; sometimes you buy from their list. Agree this up front.",
        },
        {
          q: "Does the chef bring equipment?",
          a: "Many bring their own knives and special tools but rely on your kitchen and tableware. Ask what they need and whether they can bring plates if you're short.",
        },
        {
          q: "Will they serve and clean up?",
          a: "Some serve and leave the kitchen clean, others only cook, and for larger groups they may bring a waiter. Be clear about what's included.",
        },
        {
          q: "What affects the price?",
          a: "Number of guests and courses, ingredients (fresh fish and seafood, for example), location and travel, serving and cleaning, and season. Ask for a quote with a proposed menu.",
        },
        {
          q: "Can they cater for allergies and diets?",
          a: "Most chefs adapt menus for vegetarians, vegans and allergies. List every allergy in advance, and for serious ones stress the risk of cross-contamination.",
        },
      ],
      tips: [
        "Share guest numbers, date, location and what the kitchen is like when asking for a quote.",
        "Ask for a sample menu and photos from previous events.",
        "For summer on the coast, book a few weeks ahead.",
        "Agree on any deposit and what happens if the event is cancelled.",
      ],
    },
    ru: {
      description:
        "Частный повар готовит у вас дома, на вилле или на яхте: ужины по особым случаям, праздники, меню для гостей в отпуске или еду на всю неделю. Он может приготовить местные блюда, морскую кухню побережья, сытную кухню севера или что угодно по вашему вкусу и с учётом ограничений в питании. Летом, в сезон вилл и яхт на побережье, хорошие повара быстро заняты, поэтому бронируйте заранее.",
      faq: [
        {
          q: "Кто покупает продукты?",
          a: "Обычно повар закупает продукты и выставляет их по чекам или включает в цену за персону; иногда вы покупаете по его списку. Договоритесь заранее.",
        },
        {
          q: "Приезжает ли повар со своим оборудованием?",
          a: "Многие привозят свои ножи и специальный инвентарь, но пользуются вашей кухней и посудой. Спросите, что нужно, и может ли он привезти посуду, если её не хватает.",
        },
        {
          q: "Подаёт ли повар блюда и убирает ли после?",
          a: "Одни подают и оставляют кухню чистой, другие только готовят, а для больших компаний могут привезти официанта. Чётко обсудите, что входит в услугу.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "От числа гостей и блюд, продуктов (например, свежей рыбы и морепродуктов), места и дороги, подачи и уборки, сезона. Попросите предложение с примерным меню.",
        },
        {
          q: "Учтёт ли повар аллергии и диеты?",
          a: "Большинство поваров адаптируют меню для вегетарианцев, веганов и аллергиков. Заранее перечислите все аллергии, а при серьёзных отдельно подчеркните риск перекрёстного загрязнения.",
        },
      ],
      tips: [
        "При запросе укажите число гостей, дату, место и какая у вас кухня.",
        "Попросите пример меню и фото с прошлых мероприятий.",
        "Летом на побережье бронируйте повара за несколько недель.",
        "Обсудите предоплату и условия отмены мероприятия.",
      ],
    },
  },
};
