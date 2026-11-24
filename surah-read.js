/* Translation reader on /{lang}/{work}/page/{n}/ — one mushaf page per URL. Reuses the AZ Musayev reader. */
(function () {
  const BISM = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
  const ROOT = new URL("/", location.href);
  const TR_ROOT = /^(t|t1)\.mushafuk\.online$/.test(location.hostname) ? "https://mushafuk.online/" : new URL("/", location.href).href;
  const MUSAYEV_URL = new URL("tr/az.musayev.json", TR_ROOT).href;
  const UTHMANI_URL = new URL("quran-uthmani.txt", TR_ROOT).href;
  const AYAH_MAP_URL = new URL("yazi-ayahs.json", TR_ROOT).href;
  const NAMES_AZ = "Fatihə,Bəqərə,Ali-İmran,Nisa,Maidə,Ənam,Əraf,Ənfal,Tövbə,Yunus,Hud,Yusuf,Rəd,İbrahim,Hicr,Nəhl,İsra,Kəhf,Məryəm,Taha,Ənbiya,Həcc,Muminun,Nur,Furqan,Şuəra,Nəml,Qəsəs,Ankəbut,Rum,Loğman,Səcdə,Əhzab,Səba,Fatir,Yasin,Saffat,Sad,Zumər,Ğafir,Fussilət,Şura,Zuxruf,Duxan,Casiyə,Əhqaf,Muhəmməd,Fəth,Hucurat,Qaf,Zariyat,Tur,Nəcm,Qəmər,Rəhman,Vaqiə,Hədid,Mucadələ,Həşr,Mumtəhinə,Saff,Cumə,Munafiqun,Təğabun,Talaq,Təhrim,Mulk,Qələm,Haqqə,Məaric,Nuh,Cin,Muzzəmmil,Muddəssir,Qiyamə,İnsan,Mursəlat,Nəbə,Naziat,Əbəsə,Təkvir,İnfitar,Mutəffifin,İnşiqaq,Buruc,Tariq,Əla,Ğaşiyə,Fəcr,Bələd,Şəms,Leyl,Duha,İnşirah,Tin,Ələq,Qədr,Bəyyinə,Zəlzələ,Adiyat,Qariə,Təkasur,Əsr,Huməzə,Fil,Qureyş,Maun,Kövsər,Kafirun,Nəsr,Məsəd,İxlas,Fələq,Nas".split(",");
  const NAMES_EN = "Al-Fatihah,Al-Baqarah,Ali 'Imran,An-Nisa,Al-Ma'idah,Al-An'am,Al-A'raf,Al-Anfal,At-Tawbah,Yunus,Hud,Yusuf,Ar-Ra'd,Ibrahim,Al-Hijr,An-Nahl,Al-Isra,Al-Kahf,Maryam,Ta-Ha,Al-Anbiya,Al-Hajj,Al-Mu'minun,An-Nur,Al-Furqan,Ash-Shu'ara,An-Naml,Al-Qasas,Al-'Ankabut,Ar-Rum,Luqman,As-Sajdah,Al-Ahzab,Saba,Fatir,Ya-Sin,As-Saffat,Sad,Az-Zumar,Ghafir,Fussilat,Ash-Shura,Az-Zukhruf,Ad-Dukhan,Al-Jathiyah,Al-Ahqaf,Muhammad,Al-Fath,Al-Hujurat,Qaf,Adh-Dhariyat,At-Tur,An-Najm,Al-Qamar,Ar-Rahman,Al-Waqi'ah,Al-Hadid,Al-Mujadilah,Al-Hashr,Al-Mumtahanah,As-Saff,Al-Jumu'ah,Al-Munafiqun,At-Taghabun,At-Talaq,At-Tahrim,Al-Mulk,Al-Qalam,Al-Haqqah,Al-Ma'arij,Nuh,Al-Jinn,Al-Muzzammil,Al-Muddaththir,Al-Qiyamah,Al-Insan,Al-Mursalat,An-Naba,An-Nazi'at,'Abasa,At-Takwir,Al-Infitar,Al-Mutaffifin,Al-Inshiqaq,Al-Buruj,At-Tariq,Al-A'la,Al-Ghashiyah,Al-Fajr,Al-Balad,Ash-Shams,Al-Layl,Ad-Duha,Ash-Sharh,At-Tin,Al-'Alaq,Al-Qadr,Al-Bayyinah,Az-Zalzalah,Al-'Adiyat,Al-Qari'ah,At-Takathur,Al-'Asr,Al-Humazah,Al-Fil,Quraysh,Al-Ma'un,Al-Kawthar,Al-Kafirun,An-Nasr,Al-Masad,Al-Ikhlas,Al-Falaq,An-Nas".split(",");
  const AYAHS = "7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6".split(",").map(Number);
  const ARNAMES = "الفاتحة,البقرة,آل عمران,النساء,المائدة,الأنعام,الأعراف,الأنفال,التوبة,يونس,هود,يوسف,الرعد,إبراهيم,الحجر,النحل,الإسراء,الكهف,مريم,طه,الأنبياء,الحج,المؤمنون,النور,الفرقان,الشعراء,النمل,القصص,العنكبوت,الروم,لقمان,السجدة,الأحزاب,سبأ,فاطر,يس,الصافات,ص,الزمر,غافر,فصلت,الشورى,الزخرف,الدخان,الجاثية,الأحقاف,محمد,الفتح,الحجرات,ق,الذاريات,الطور,النجم,القمر,الرحمن,الواقعة,الحديد,المجادلة,الحشر,الممتحنة,الصف,الجمعة,المنافقون,التغابن,الطلاق,التحريم,الملك,القلم,الحاقة,المعارج,نوح,الجن,المزمل,المدثر,القيامة,الإنسان,المرسلات,النبأ,النازعات,عبس,التكوير,الانفطار,المطففين,الانشقاق,البروج,الطارق,الأعلى,الغاشية,الفجر,البلد,الشمس,الليل,الضحى,الشرح,التين,العلق,القدر,البينة,الزلزلة,العاديات,القارعة,التكاثر,العصر,الهمزة,الفيل,قريش,الماعون,الكوثر,الكافرون,النصر,المسد,الإخلاص,الفلق,الناس".split(",");
  let TRANSLATOR = { id: "az.musayev", lang: "az", name: "Əlixan Musayev", by: "Azərbaycanca", base: "az/tercume", dir: "ltr", per: false };
  const MADANI = new Set([2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110]);
  const T1 = ["urdu_junagarhi", "persian_ih"];
  const WORKS = [
    {id:"az.musayev", base:"az/tercume", name:"Əlixan Musayev", by:"Azərbaycanca", lang:"az", dir:"ltr", per:false},
    {id:"ru.kuliev", base:"ru/perevod", name:"Эльмир Кулиев", by:"Русский", lang:"ru", dir:"ltr", per:false},
    {id:"turkish_shahin", base:"tr/meal", name:"Ali Özek ve diğerleri", by:"Türkçe", lang:"tr", dir:"ltr", per:true},
    {id:"turkish_rwwad", base:"tr/rowwad", name:"Rowwad Tercüme Merkezi", by:"Türkçe", lang:"tr", dir:"ltr", per:true},
    {id:"english_saheeh", base:"en/translation", name:"Saheeh International", by:"English", lang:"en", dir:"ltr", per:true},
    {id:"english_hilali_khan", base:"en/hilali", name:"Muhammad Taqi-ud-Din al-Hilali, Muhammad Muhsin Khan", by:"English", lang:"en", dir:"ltr", per:true},
    {id:"english_rwwad", base:"en/rowwad", name:"Rowwad Translation Center", by:"English", lang:"en", dir:"ltr", per:true},
    {id:"urdu_junagarhi", base:"ur/junagarhi", name:"محمد جوناگڑھی", by:"اردو", lang:"ur", dir:"rtl", per:true},
    {id:"persian_ih", base:"fa/roovad", name:"مرکز ترجمه رواد", by:"فارسی", lang:"fa", dir:"rtl", per:true},
    {id:"uzbek_mansour", base:"uz/mansour", name:"Алоуддин Мансур", by:"Oʻzbekcha", lang:"uz", dir:"ltr", per:true},
    {id:"tajik_arifi", base:"tg/arifi", name:"Маркази тарҷумаи Равод", by:"Тоҷикӣ", lang:"tg", dir:"ltr", per:true},
    {id:"kyrgyz_hakimov", base:"ky/hakimov", name:"Шамсуддин Хакимов", by:"Кыргызча", lang:"ky", dir:"ltr", per:true},
    {id:"uyghur_saleh", base:"ug/saleh", name:"مۇھەممەد سالىھ", by:"ئۇيغۇرچە", lang:"ug", dir:"rtl", per:true},
    {id:"pashto_rwwad", base:"ps/roovad", name:"د رواد د ژباړې مرکز", by:"پښتو", lang:"ps", dir:"rtl", per:true},
    {id:"kurdish_bamoki", base:"ku/bamoki", name:"محمد صالح بامۆکی", by:"Kurdî", lang:"ku", dir:"rtl", per:true},
    {id:"hindi_omari", base:"hi/omari", name:"अज़ीज़ुल-हक़ उमरी", by:"हिन्दी", lang:"hi", dir:"ltr", per:true},
    {id:"tamil_omar", base:"ta/omar", name:"உமர் ஷரீஃப்", by:"தமிழ்", lang:"ta", dir:"ltr", per:true},
    {id:"french_rashid", base:"fr/maach", name:"Rachid Maach", by:"Français", lang:"fr", dir:"ltr", per:true},
    {id:"german_bubenheim", base:"de/bubenheim", name:"Frank Bubenheim, Nadeem Elyas", by:"Deutsch", lang:"de", dir:"ltr", per:true},
    {id:"dutch_center", base:"nl/rowwad", name:"Rowwad Vertaalcentrum", by:"Nederlands", lang:"nl", dir:"ltr", per:true},
    {id:"spanish_garcia", base:"es/garcia", name:"Isa García", by:"Español", lang:"es", dir:"ltr", per:true},
    {id:"portuguese_nasr", base:"pt/nasr", name:"Helmi Nasr", by:"Português", lang:"pt", dir:"ltr", per:true},
    {id:"hausa_gummi", base:"ha/gumi", name:"Abubakar Mahmoud Gumi", by:"Hausa", lang:"ha", dir:"ltr", per:true},
    {id:"somali_yacob", base:"so/yacob", name:"Cabdullaahi Xasan Yacquub", by:"Soomaali", lang:"so", dir:"ltr", per:true},
    {id:"japanese_saeedsato", base:"ja/sato", name:"サイード佐藤", by:"日本語", lang:"ja", dir:"ltr", per:true}
  ];
  const BY_BASE = {};
  for (const w of WORKS) BY_BASE[w.base] = w;
  const UI = {
  "az": {
    "page": "Səhifə",
    "title": [
      "suffix",
      " surəsi"
    ],
    "ayahs": "{n} ayədir",
    "makkah": "Məkkədə nazil olmuşdur",
    "madinah": "Mədinədə nazil olmuşdur",
    "back": "Geri",
    "home": "Ana səhifə",
    "play": "Dinlə",
    "pause": "Dayandır",
    "settings": "Ayarlar",
    "bookmark": "Əlfəcin",
    "copy": "Kopyala",
    "share": "Paylaş",
    "copied": "Kopyalandı",
    "failed": "Alınmadı",
    "tr": "Tərcümə",
    "prev": "Əvvəlki",
    "next": "Sonrakı",
    "loading": "Yüklənir…",
    "error": "Tərcümə yüklənmədi. İnterneti yoxlayıb yenidən açın.",
    "doc": "Quran, səhifə {n} — {title} | Mushafuk.online"
  },
  "tr": {
    "page": "Sayfa",
    "title": [
      "suffix",
      " Suresi"
    ],
    "ayahs": "{n} ayettir",
    "makkah": "Mekke'de nâzil olmuştur",
    "madinah": "Medine'de nâzil olmuştur",
    "back": "Geri",
    "home": "Ana sayfa",
    "play": "Dinle",
    "pause": "Durdur",
    "settings": "Ayarlar",
    "bookmark": "Yer imi",
    "copy": "Kopyala",
    "share": "Paylaş",
    "copied": "Kopyalandı",
    "failed": "Olmadı",
    "tr": "Meal",
    "prev": "Önceki",
    "next": "Sonraki",
    "loading": "Yükleniyor…",
    "error": "Meal yüklenemedi. İnterneti kontrol edip yeniden açın.",
    "doc": "Kur'an, sayfa {n} — {title} | Mushafuk.online"
  },
  "en": {
    "page": "Page",
    "title": [
      "prefix",
      "Surah "
    ],
    "ayahs": "{n} ayahs",
    "makkah": "Revealed in Makkah",
    "madinah": "Revealed in Madinah",
    "back": "Back",
    "home": "Home",
    "play": "Listen",
    "pause": "Stop",
    "settings": "Settings",
    "bookmark": "Bookmark",
    "copy": "Copy",
    "share": "Share",
    "copied": "Copied",
    "failed": "Failed",
    "tr": "Translation",
    "prev": "Previous",
    "next": "Next",
    "loading": "Loading…",
    "error": "The translation could not be loaded. Check your connection and open the page again.",
    "doc": "Quran, page {n} — {title} | Mushafuk.online"
  },
  "ru": {
    "page": "Страница",
    "title": [
      "prefix",
      "сура "
    ],
    "ayahs": "{n} аятов",
    "makkah": "Ниспослана в Мекке",
    "madinah": "Ниспослана в Медине",
    "back": "Назад",
    "home": "Главная",
    "play": "Слушать",
    "pause": "Стоп",
    "settings": "Настройки",
    "bookmark": "Закладка",
    "copy": "Копировать",
    "share": "Поделиться",
    "copied": "Скопировано",
    "failed": "Не удалось",
    "tr": "Перевод",
    "prev": "Назад",
    "next": "Далее",
    "loading": "Загрузка…",
    "error": "Перевод не загрузился. Проверьте интернет и откройте страницу снова.",
    "doc": "Коран, страница {n} — {title} | Mushafuk.online"
  },
  "ar": {
    "page": "صفحة",
    "title": [
      "prefix",
      "سورة "
    ],
    "ayahs": "{n} آيات",
    "makkah": "نزلت في مكة",
    "madinah": "نزلت في المدينة",
    "back": "رجوع",
    "home": "الرئيسية",
    "play": "استمع",
    "pause": "إيقاف",
    "settings": "الإعدادات",
    "bookmark": "علامة",
    "copy": "نسخ",
    "share": "مشاركة",
    "copied": "تم النسخ",
    "failed": "تعذّر",
    "tr": "ترجمة",
    "prev": "السابق",
    "next": "التالي",
    "loading": "جارٍ التحميل…",
    "error": "تعذّر تحميل الترجمة. تحقق من الاتصال وافتح الصفحة مرة أخرى.",
    "doc": "القرآن، صفحة {n} — {title} | Mushafuk.online"
  },
  "ur": {
    "page": "صفحہ",
    "title": [
      "prefix",
      "سورہ "
    ],
    "ayahs": "{n} آیات",
    "makkah": "مکہ میں نازل ہوئی",
    "madinah": "مدینہ میں نازل ہوئی",
    "back": "واپس",
    "home": "صفحہ اول",
    "play": "سنیں",
    "pause": "روکیں",
    "settings": "ترتیبات",
    "bookmark": "نشان",
    "copy": "کاپی",
    "share": "شیئر",
    "copied": "کاپی ہو گیا",
    "failed": "ناکام",
    "tr": "ترجمہ",
    "prev": "پچھلا",
    "next": "اگلا",
    "loading": "لوڈ ہو رہا ہے…",
    "error": "ترجمہ لوڈ نہیں ہوا۔ انٹرنیٹ چیک کر کے صفحہ دوبارہ کھولیں۔",
    "doc": "قرآن، صفحہ {n} — {title} | Mushafuk.online"
  },
  "fa": {
    "page": "صفحه",
    "title": [
      "prefix",
      "سوره "
    ],
    "ayahs": "{n} آیه",
    "makkah": "در مکه نازل شده است",
    "madinah": "در مدینه نازل شده است",
    "back": "بازگشت",
    "home": "خانه",
    "play": "گوش دهید",
    "pause": "توقف",
    "settings": "تنظیمات",
    "bookmark": "نشانک",
    "copy": "رونوشت",
    "share": "هم‌رسانی",
    "copied": "کپی شد",
    "failed": "ناموفق",
    "tr": "ترجمه",
    "prev": "قبلی",
    "next": "بعدی",
    "loading": "در حال بارگذاری…",
    "error": "ترجمه بارگذاری نشد. اتصال را بررسی کنید و صفحه را دوباره باز کنید.",
    "doc": "قرآن، صفحه {n} — {title} | Mushafuk.online"
  },
  "uz": {
    "page": "Sahifa",
    "title": [
      "suffix",
      " surasi"
    ],
    "ayahs": "{n} oyat",
    "makkah": "Makkada nozil bo‘lgan",
    "madinah": "Madinada nozil bo‘lgan",
    "back": "Orqaga",
    "home": "Bosh sahifa",
    "play": "Tinglash",
    "pause": "To‘xtatish",
    "settings": "Sozlamalar",
    "bookmark": "Xatcho‘p",
    "copy": "Nusxa",
    "share": "Ulashish",
    "copied": "Nusxa olindi",
    "failed": "Xato",
    "tr": "Tarjima",
    "prev": "Oldingi",
    "next": "Keyingi",
    "loading": "Yuklanmoqda…",
    "error": "Tarjima yuklanmadi. Internetni tekshirib, sahifani qayta oching.",
    "doc": "Qur'on, sahifa {n} — {title} | Mushafuk.online"
  },
  "tg": {
    "page": "Саҳифа",
    "title": [
      "suffix",
      " сура"
    ],
    "ayahs": "{n} оят",
    "makkah": "Дар Макка нозил шудааст",
    "madinah": "Дар Мадина нозил шудааст",
    "back": "Бозгашт",
    "home": "Саҳифаи асосӣ",
    "play": "Шунидан",
    "pause": "Ист",
    "settings": "Танзимот",
    "bookmark": "Хатчӯб",
    "copy": "Нусха",
    "share": "Мубодила",
    "copied": "Нусха шуд",
    "failed": "Ноком",
    "tr": "Тарҷума",
    "prev": "Қаблӣ",
    "next": "Баъдӣ",
    "loading": "Бор шуда истодааст…",
    "error": "Тарҷума бор нашуд. Интернетро санҷида, саҳифаро аз нав кушоед.",
    "doc": "Қуръон, саҳифа {n} — {title} | Mushafuk.online"
  },
  "ky": {
    "page": "Бет",
    "title": [
      "suffix",
      " сүрөөсү"
    ],
    "ayahs": "{n} аят",
    "makkah": "Меккеде түшүрүлгөн",
    "madinah": "Мадинада түшүрүлгөн",
    "back": "Артка",
    "home": "Башкы бет",
    "play": "Угуу",
    "pause": "Токтотуу",
    "settings": "Жөндөөлөр",
    "bookmark": "Бетбелги",
    "copy": "Көчүрүү",
    "share": "Бөлүшүү",
    "copied": "Көчүрүлдү",
    "failed": "Ката",
    "tr": "Котормо",
    "prev": "Мурунку",
    "next": "Кийинки",
    "loading": "Жүктөлүүдө…",
    "error": "Котормо жүктөлгөн жок. Интернетти текшерип, баракты кайра ачыңыз.",
    "doc": "Куран, бет {n} — {title} | Mushafuk.online"
  },
  "ug": {
    "page": "بەت",
    "title": [
      "suffix",
      " سۈرىسى"
    ],
    "ayahs": "{n} ئايەت",
    "makkah": "مەككىدە نازىل بولغان",
    "madinah": "مەدىنىدە نازىل بولغان",
    "back": "قايتىش",
    "home": "باش بەت",
    "play": "ئاڭلاش",
    "pause": "توختىتىش",
    "settings": "تەڭشەك",
    "bookmark": "خەتكۈش",
    "copy": "كۆچۈرۈش",
    "share": "ھەمبەھىر",
    "copied": "كۆچۈرۈلدى",
    "failed": "مەغلۇپ",
    "tr": "تەرجىمە",
    "prev": "ئالدىنقى",
    "next": "كېيىنكى",
    "loading": "يۈكلىنىۋاتىدۇ…",
    "error": "تەرجىمە يۈكلەنمىدى. تورنى تەكشۈرۈپ بەتنى قايتا ئېچىڭ.",
    "doc": "قۇرئان، بەت {n} — {title} | Mushafuk.online"
  },
  "ps": {
    "page": "پاڼه",
    "title": [
      "prefix",
      "سورة "
    ],
    "ayahs": "{n} آیتونه",
    "makkah": "په مکه کې نازل شوې",
    "madinah": "په مدینه کې نازل شوې",
    "back": "شا",
    "home": "کورپاڼه",
    "play": "اورېدل",
    "pause": "درول",
    "settings": "سمونې",
    "bookmark": "نښه",
    "copy": "کاپي",
    "share": "شریکول",
    "copied": "کاپي شوه",
    "failed": "ناکام",
    "tr": "ژباړه",
    "prev": "مخکېنی",
    "next": "بل",
    "loading": "بارېږي…",
    "error": "ژباړه و نه بارېده. انټرنېټ وګورئ او پاڼه بیا پرانیسئ.",
    "doc": "قرآن، پاڼه {n} — {title} | Mushafuk.online"
  },
  "ku": {
    "page": "Rûpel",
    "title": [
      "suffix",
      " sûre"
    ],
    "ayahs": "{n} ayet",
    "makkah": "Li Mekkeyê hatiye xwarê",
    "madinah": "Li Medîneyê hatiye xwarê",
    "back": "Paş",
    "home": "Destpêk",
    "play": "Guhearîne",
    "pause": "Bisekine",
    "settings": "Sazkarî",
    "bookmark": "Nîşan",
    "copy": "Kopî",
    "share": "Parvebike",
    "copied": "Hat kopîkirin",
    "failed": "Têk çû",
    "tr": "Werger",
    "prev": "Pêş",
    "next": "Pişt",
    "loading": "Tê barkirin…",
    "error": "Werger nehat barkirin. Înternetê kontrol bikin û rûpelê dîsa vekin.",
    "doc": "Qur'an, rûpel {n} — {title} | Mushafuk.online"
  },
  "hi": {
    "page": "पृष्ठ",
    "title": [
      "prefix",
      "सूरह "
    ],
    "ayahs": "{n} आयतें",
    "makkah": "मक्का में अवतीर्ण",
    "madinah": "मदीना में अवतीर्ण",
    "back": "वापस",
    "home": "मुखपृष्ठ",
    "play": "सुनें",
    "pause": "रोकें",
    "settings": "सेटिंग्स",
    "bookmark": "बुकमार्क",
    "copy": "कॉपी",
    "share": "साझा करें",
    "copied": "कॉपी हो गया",
    "failed": "असफल",
    "tr": "अनुवाद",
    "prev": "पिछला",
    "next": "अगला",
    "loading": "लोड हो रहा है…",
    "error": "अनुवाद लोड नहीं हुआ। इंटरनेट जाँच कर पृष्ठ फिर खोलें।",
    "doc": "क़ुरआन, पृष्ठ {n} — {title} | Mushafuk.online"
  },
  "ta": {
    "page": "பக்கம்",
    "title": [
      "prefix",
      "ஸூரா "
    ],
    "ayahs": "{n} ஆயத்துகள்",
    "makkah": "மக்காவில் இறக்கப்பட்டது",
    "madinah": "மதீனாவில் இறக்கப்பட்டது",
    "back": "பின்",
    "home": "முகப்பு",
    "play": "கேளுங்கள்",
    "pause": "நிறுத்து",
    "settings": "அமைப்புகள்",
    "bookmark": "புக்மார்க்",
    "copy": "நகலெடு",
    "share": "பகிர்",
    "copied": "நகலெடுக்கப்பட்டது",
    "failed": "தோல்வி",
    "tr": "மொழிபெயர்ப்பு",
    "prev": "முந்தைய",
    "next": "அடுத்த",
    "loading": "ஏற்றப்படுகிறது…",
    "error": "மொழிபெயர்ப்பு ஏறவில்லை. இணையத்தைச் சரிபார்த்து மீண்டும் திறக்கவும்.",
    "doc": "குர்ஆன், பக்கம் {n} — {title} | Mushafuk.online"
  },
  "fr": {
    "page": "Page",
    "title": [
      "prefix",
      "Sourate "
    ],
    "ayahs": "{n} versets",
    "makkah": "Révélée à La Mecque",
    "madinah": "Révélée à Médine",
    "back": "Retour",
    "home": "Accueil",
    "play": "Écouter",
    "pause": "Arrêter",
    "settings": "Réglages",
    "bookmark": "Signet",
    "copy": "Copier",
    "share": "Partager",
    "copied": "Copié",
    "failed": "Échec",
    "tr": "Traduction",
    "prev": "Précédent",
    "next": "Suivant",
    "loading": "Chargement…",
    "error": "La traduction n'a pas pu être chargée. Vérifiez la connexion et rouvrez la page.",
    "doc": "Coran, page {n} — {title} | Mushafuk.online"
  },
  "de": {
    "page": "Seite",
    "title": [
      "prefix",
      "Sure "
    ],
    "ayahs": "{n} Verse",
    "makkah": "Offenbart in Mekka",
    "madinah": "Offenbart in Medina",
    "back": "Zurück",
    "home": "Startseite",
    "play": "Anhören",
    "pause": "Stopp",
    "settings": "Einstellungen",
    "bookmark": "Lesezeichen",
    "copy": "Kopieren",
    "share": "Teilen",
    "copied": "Kopiert",
    "failed": "Fehlgeschlagen",
    "tr": "Übersetzung",
    "prev": "Zurück",
    "next": "Weiter",
    "loading": "Wird geladen…",
    "error": "Die Übersetzung konnte nicht geladen werden. Prüfen Sie die Verbindung und öffnen Sie die Seite erneut.",
    "doc": "Koran, Seite {n} — {title} | Mushafuk.online"
  },
  "nl": {
    "page": "Pagina",
    "title": [
      "prefix",
      "Soera "
    ],
    "ayahs": "{n} verzen",
    "makkah": "Geopenbaard in Mekka",
    "madinah": "Geopenbaard in Medina",
    "back": "Terug",
    "home": "Startpagina",
    "play": "Luisteren",
    "pause": "Stoppen",
    "settings": "Instellingen",
    "bookmark": "Bladwijzer",
    "copy": "Kopiëren",
    "share": "Delen",
    "copied": "Gekopieerd",
    "failed": "Mislukt",
    "tr": "Vertaling",
    "prev": "Vorige",
    "next": "Volgende",
    "loading": "Laden…",
    "error": "De vertaling kon niet worden geladen. Controleer de verbinding en open de pagina opnieuw.",
    "doc": "Koran, pagina {n} — {title} | Mushafuk.online"
  },
  "es": {
    "page": "Página",
    "title": [
      "prefix",
      "Sura "
    ],
    "ayahs": "{n} aleyas",
    "makkah": "Revelada en La Meca",
    "madinah": "Revelada en Medina",
    "back": "Atrás",
    "home": "Inicio",
    "play": "Escuchar",
    "pause": "Detener",
    "settings": "Ajustes",
    "bookmark": "Marcador",
    "copy": "Copiar",
    "share": "Compartir",
    "copied": "Copiado",
    "failed": "Error",
    "tr": "Traducción",
    "prev": "Anterior",
    "next": "Siguiente",
    "loading": "Cargando…",
    "error": "No se pudo cargar la traducción. Compruebe la conexión y vuelva a abrir la página.",
    "doc": "Corán, página {n} — {title} | Mushafuk.online"
  },
  "pt": {
    "page": "Página",
    "title": [
      "prefix",
      "Surata "
    ],
    "ayahs": "{n} versículos",
    "makkah": "Revelada em Meca",
    "madinah": "Revelada em Medina",
    "back": "Voltar",
    "home": "Início",
    "play": "Ouvir",
    "pause": "Parar",
    "settings": "Definições",
    "bookmark": "Marcador",
    "copy": "Copiar",
    "share": "Partilhar",
    "copied": "Copiado",
    "failed": "Falhou",
    "tr": "Tradução",
    "prev": "Anterior",
    "next": "Seguinte",
    "loading": "A carregar…",
    "error": "A tradução não pôde ser carregada. Verifique a ligação e abra a página novamente.",
    "doc": "Alcorão, página {n} — {title} | Mushafuk.online"
  },
  "ha": {
    "page": "Shafi",
    "title": [
      "prefix",
      "Sura "
    ],
    "ayahs": "Ayyoyi {n}",
    "makkah": "An saukar da ita a Makka",
    "madinah": "An saukar da ita a Madina",
    "back": "Baya",
    "home": "Gida",
    "play": "Saurara",
    "pause": "Tsaya",
    "settings": "Saituna",
    "bookmark": "Alama",
    "copy": "Kwafa",
    "share": "Raba",
    "copied": "An kwafa",
    "failed": "Ya gaza",
    "tr": "Fassarar",
    "prev": "Na baya",
    "next": "Na gaba",
    "loading": "Ana lodawa…",
    "error": "Fassarar ba ta lodu ba. Duba intanet kuma sake buɗe shafin.",
    "doc": "Alkur'ani, shafi {n} — {title} | Mushafuk.online"
  },
  "so": {
    "page": "Bogga",
    "title": [
      "prefix",
      "Suuradda "
    ],
    "ayahs": "{n} aayadood",
    "makkah": "Waxaa laga soo dejiyay Makka",
    "madinah": "Waxaa laga soo dejiyay Madiina",
    "back": "Dib",
    "home": "Bogga hore",
    "play": "Dhageyso",
    "pause": "Jooji",
    "settings": "Dejinta",
    "bookmark": "Calaamad",
    "copy": "Koobi",
    "share": "La wadaag",
    "copied": "Waa la koobiyey",
    "failed": "Waa fashilantay",
    "tr": "Tarjumaadda",
    "prev": "Hore",
    "next": "Xiga",
    "loading": "Waa la rarayaa…",
    "error": "Tarjumaadda lama rarín. Hubi internetka oo bogga dib u fur.",
    "doc": "Quraanka, bogga {n} — {title} | Mushafuk.online"
  },
  "ja": {
    "page": "ページ",
    "title": [
      "suffix",
      "章"
    ],
    "ayahs": "{n}節",
    "makkah": "マッカ啓示",
    "madinah": "マディーナ啓示",
    "back": "戻る",
    "home": "ホーム",
    "play": "聴く",
    "pause": "停止",
    "settings": "設定",
    "bookmark": "しおり",
    "copy": "コピー",
    "share": "共有",
    "copied": "コピーしました",
    "failed": "失敗",
    "tr": "翻訳",
    "prev": "前へ",
    "next": "次へ",
    "loading": "読み込み中…",
    "error": "翻訳を読み込めませんでした。通信を確認して、ページを開き直してください。",
    "doc": "クルアーン、ページ {n} — {title} | Mushafuk.online"
  }
};

  const ICO = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.2 12 4l8 7.2"/><path d="M7 10.2V20h10V10.2"/><path d="M10 20v-6h4v6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5.5h3.2v13H7zm6.8 0H17v13h-3.2z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.3 3.2h3.4l.5 2.4c.6.2 1.2.5 1.7.9l2.3-.8 1.7 2.9-1.8 1.6c.1.6.1 1.2 0 1.8l1.8 1.6-1.7 2.9-2.3-.8c-.5.4-1.1.7-1.7.9l-.5 2.4h-3.4l-.5-2.4c-.6-.2-1.2-.5-1.7-.9l-2.3.8-1.7-2.9 1.8-1.6a5.6 5.6 0 0 1 0-1.8L4.1 8.6l1.7-2.9 2.3.8c.5-.4 1.1-.7 1.7-.9z"/><circle cx="12" cy="12" r="2.6" fill="#fffaf0"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/></svg>',
    markOn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="8" y="8" width="11.5" height="11.5" rx="2"/><path d="M15.5 8V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5H8"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7.5h14V12"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-9"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
  };

  const cache = {};
  let curN = 0;
  let swiping = false;

  function route() {
    const m = location.pathname.match(/^\/((?:[a-z]{2})\/[^/]+)\/page\/(\d+)\/?$/);
    if (!m) return null;
    const n = +m[2];
    if (n < 1 || n > 604) return null;
    const meta = BY_BASE[m[1]];
    if (!meta) return null;
    return { base: m[1], n: n, meta: meta };
  }
  function pageNoFromUrl() {
    const r = route();
    return r ? r.n : 0;
  }
  function currentWork() {
    const r = route();
    return (r && r.meta) || TRANSLATOR;
  }
  function ui() {
    const lang = (currentWork().lang || "az");
    return UI[lang] || UI.en;
  }
  function names() {
    const lang = currentWork().lang || "az";
    if (lang === "az") return (window.QM_NAMES && window.QM_NAMES.length === 114) ? window.QM_NAMES : NAMES_AZ;
    return NAMES_EN;
  }
  function ayahs() {
    const a = window.QM_AYAHS;
    return (a && a.length === 114) ? a : AYAHS;
  }
  function surahTitle(s) {
    const u = ui();
    const nm = names()[s - 1] || s;
    return u.title[0] === "prefix" ? u.title[1] + nm : nm + u.title[1];
  }
  function workHref(meta, n) {
    const path = "/" + meta.base + "/page/" + n + "/";
    const here = location.hostname;
    const onT1 = /(^|\.)t1\.mushafuk\.online$/.test(here);
    const wantT1 = T1.indexOf(meta.id) >= 0;
    if (wantT1 && !onT1) return "https://t1.mushafuk.online" + path;
    if (!wantT1 && onT1) return "https://t.mushafuk.online" + path;
    return path;
  }
  function marks() {
    try { return JSON.parse(localStorage.getItem("qm.bookmarks") || "[]"); } catch (e) { return []; }
  }
  function setMarks(m) { localStorage.setItem("qm.bookmarks", JSON.stringify(m)); }
  function isMarked(k) { return marks().includes(k); }
  function toggleMark(k) {
    const m = marks();
    const i = m.indexOf(k);
    if (i >= 0) m.splice(i, 1); else m.push(k);
    setMarks(m);
    return i < 0;
  }
  async function arabicMap() {
    if (!cache.uth) {
      const t = await (await fetch(UTHMANI_URL)).text();
      const map = {};
      for (const line of t.split("\n")) {
        const p = line.split("|");
        if (p.length === 3) {
          const sn = +p[0], an = +p[1];
          (map[sn] || (map[sn] = []))[an - 1] = p[2];
        }
      }
      cache.uth = map;
    }
    return cache.uth;
  }
  async function musayevAll() {
    if (!cache.az) {
      const j = await (await fetch(MUSAYEV_URL)).json();
      cache.az = j.v;
    }
    return cache.az;
  }
  async function loadTr(meta, surahs) {
    if (!meta.per) {
      if (meta.id === "az.musayev") return { v: await musayevAll(), f: null, per: false };
      if (!cache[meta.id]) {
        const j = await (await fetch(new URL("tr/" + meta.id + ".json", TR_ROOT).href)).json();
        cache[meta.id] = j.v;
      }
      return { v: cache[meta.id], f: null, per: false };
    }
    const out = { v: {}, f: {}, per: true };
    await Promise.all(surahs.map(async (s) => {
      const k = meta.id + ":" + s;
      if (!cache[k]) {
        const j = await (await fetch(new URL("tr/" + meta.id + "/" + s + ".json", TR_ROOT).href)).json();
        cache[k] = { t: j.t || [], f: j.f || null };
      }
      out.v[s] = cache[k].t;
      out.f[s] = cache[k].f;
    }));
    return out;
  }
  function trText(data, s, a) {
    if (!data.per) return (data.v[s - 1] && data.v[s - 1][a - 1]) || "";
    return (data.v[s] && data.v[s][a - 1]) || "";
  }
  function trFoot(data, s, a) {
    if (!data.per || !data.f) return "";
    const f = data.f[s];
    if (!f) return "";
    const x = Array.isArray(f) ? f[a - 1] : (f[a] || f[String(a)]);
    return x ? String(x) : "";
  }
  async function ensurePage(n) {
    if (window.QM_PAGE) {
      const pg = window.QM_PAGE(n);
      if (pg && pg.keys && pg.keys.length) return pg;
    }
    if (!cache.ayahMap) cache.ayahMap = await (await fetch(AYAH_MAP_URL)).json();
    const keys = [];
    for (const r of cache.ayahMap[String(n)] || []) if (!keys.includes(r[0])) keys.push(r[0]);
    return keys.length ? { n: n, keys: keys } : null;
  }
  // Same mapping as lib.js forFont: uthmanic-hafs.woff2 maps U+06DF (small high rounded zero)
  // to a wide composite of U+0600, which paints as a black dotted ring after words like ءَامِنُوا۟.
  // The site displays U+06E0 (small high upright rectangular zero) instead, which this font has.
  function forFont(t) {
    return String(t || "").replace(/\u06DF/g, "\u06E0");
  }
  function stripBism(ar, s, a) {
    if (a !== 1 || s === 9) return ar;
    if (ar.indexOf(BISM) === 0) {
      const rest = ar.slice(BISM.length).trim();
      return rest || ar;
    }
    return ar;
  }
  function showBism(s) { return s !== 9 && s !== 1; }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toast(msg) {
    let t = document.getElementById("sr-toast");
    if (!t) {
      t = el("div");
      t.id = "sr-toast";
      t.style.cssText = "position:fixed;left:50%;bottom:5rem;transform:translateX(-50%);background:#12352c;color:#fff;padding:.4rem .8rem;border-radius:999px;font-size:.8rem;z-index:80;opacity:0;transition:opacity .2s";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.opacity = "0"; }, 1400);
  }
  function ayahText(s, a, ar, tr) {
    const N = names();
    return (N[s - 1] || s) + " " + s + ":" + a + "\n" + ar + "\n" + tr + "\n— " + TRANSLATOR.name;
  }
  async function copyAyah(s, a, ar, tr) {
    const tx = ayahText(s, a, ar, tr);
    try { await navigator.clipboard.writeText(tx); toast(ui().copied); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = tx; document.body.appendChild(ta); ta.select();
      toast(document.execCommand("copy") ? ui().copied : ui().failed);
      ta.remove();
    }
  }
  async function shareAyah(s, a, ar, tr) {
    const tx = ayahText(s, a, ar, tr);
    const url = location.origin + "/" + currentWork().base + "/page/" + curN + "/#" + s + "-" + a;
    if (navigator.share) {
      try { await navigator.share({ title: names()[s - 1] + " " + s + ":" + a, text: tx, url: url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    copyAyah(s, a, ar, tr);
  }
  async function playAyah(s, a) {
    if (window.QA && window.QA.play) window.QA.play(s, a);
  }
  async function playFrom(s, a, btn) {
    if (!window.QA || !window.QA.play) return;
    if (window.QA.stop && btn.classList.contains("on")) {
      window.QA.stop();
      btn.classList.remove("on");
      btn.innerHTML = ICO.play;
      btn.setAttribute("aria-label", ui().play);
      return;
    }
    await window.QA.play(s, a);
    btn.classList.add("on");
    btn.innerHTML = ICO.pause;
    btn.setAttribute("aria-label", ui().pause);
  }
  function openSettings() {
    if (window.QM && window.QM.openSettings) window.QM.openSettings();
  }
  function closePicker() {
    const a = document.getElementById("sr-scrim");
    const b = document.getElementById("sr-sheet");
    if (a) a.remove();
    if (b) b.remove();
  }
  function openPicker() {
    closePicker();
    const u = ui();
    const cur = currentWork();
    const scrim = el("div", "sr-scrim");
    scrim.id = "sr-scrim";
    scrim.onclick = closePicker;
    const sheet = el("div", "sr-sheet");
    sheet.id = "sr-sheet";
    if (cur.dir === "rtl") sheet.dir = "rtl";
    sheet.innerHTML = '<div class="handle"></div><h2>' + u.tr + "</h2>";
    const mine = WORKS.filter((w) => w.lang === cur.lang);
    const rest = WORKS.filter((w) => w.lang !== cur.lang);
    let last = "";
    for (const w of mine.concat(rest)) {
      if (w.by !== last) {
        sheet.appendChild(el("div", "grp", w.by));
        last = w.by;
      }
      const b = el("button", "tr" + (w.id === cur.id ? " on" : ""));
      b.type = "button";
      b.innerHTML = "<span>" + w.name + "</span><small style='color:#6b6253'>" + w.by + "</small>" + (w.id === cur.id ? "<span class='tick'>" + ICO.tick + "</span>" : "");
      b.onclick = () => {
        if (w.id === cur.id) { closePicker(); return; }
        location.assign(workHref(w, curN || 1));
      };
      sheet.appendChild(b);
    }
    document.body.append(scrim, sheet);
  }

  function goPage(n) {
    n = n | 0;
    if (n < 1 || n > 604 || n === curN) return;
    closePicker();
    const href = "/" + currentWork().base + "/page/" + n + "/";
    if (window.QM_TURN) window.QM_TURN(n);
    else location.assign(href);
  }
  function bindSwipe(root) {
    if (!root || root.dataset.swipe) return;
    root.dataset.swipe = "1";
    let sx = null, sy = 0, st = 0, slock = null, slx = 0, sly = 0;
    const should = (dx, dy, dt) => window.QM_shouldTurnPage
      ? window.QM_shouldTurnPage(dx, dy, dt, root.clientWidth || innerWidth)
      : ((dt < 800 && Math.abs(dx) >= Math.max(60, (root.clientWidth || innerWidth) * 0.15) && Math.abs(dx) > 1.5 * Math.abs(dy || 0)) ? (dx > 0 ? 1 : -1) : 0);
    const down = (x, y, t) => {
      if (t && t.closest && t.closest("a,button,input,textarea,select,label")) { sx = null; return; }
      sx = x; sy = y; st = performance.now(); slock = null; slx = x; sly = y;
    };
    const move = (x, y) => {
      if (sx == null) return;
      slx = x; sly = y;
      const dx = x - sx, dy = y - sy;
      if (!slock) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        slock = Math.abs(dx) > Math.abs(dy) * 1.5 ? "x" : "y";
      }
    };
    const up = () => {
      if (sx == null) return;
      const dx = slx - sx, dy = sly - sy, dt = performance.now() - st, was = slock;
      sx = null; slock = null;
      if (was === "y") return;
      const dir = should(dx, dy, dt);
      if (dir) goPage(curN + dir);
    };
    root.addEventListener("touchstart", (e) => { if (e.touches.length !== 1) { sx = null; slock = null; return; } down(e.touches[0].clientX, e.touches[0].clientY, e.target); }, { passive: true });
    root.addEventListener("touchmove", (e) => { if (e.touches.length !== 1) { sx = null; slock = null; return; } if (!e.touches.length) return; move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    root.addEventListener("touchend", (e) => { if (e.touches && e.touches.length) { sx = null; slock = null; return; } up(); }, { passive: true });
    root.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") return; down(e.clientX, e.clientY, e.target); });
    root.addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; move(e.clientX, e.clientY); });
    root.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") return; up(); });
  }

  function surahCard(s) {
    const N = names();
    const AN = ARNAMES;
    const A = ayahs();
    const card = el("section", "sr-card");
    card.dataset.k = s + "-1";
    card.innerHTML =
      '<div class="sr-arname">' + (AN[s - 1] || "") + "</div>" +
      '<div class="sr-name">' + (N[s - 1] || "") + "</div>" +
      '<div class="sr-meta"><span>' + (MADANI.has(s) ? ui().madinah : ui().makkah) + "</span>" +
      "<span>" + ui().ayahs.replace("{n}", String(A[s - 1] || "")) + "</span></div>" +
      (showBism(s) ? '<div class="sr-bism">' + forFont(BISM) + "</div>" : "");
    return card;
  }

  async function open(n) {
    n = n | 0;
    if (n < 1 || n > 604) return;
    const r = route();
    if (!r || !r.meta) return;
    curN = n;
    TRANSLATOR = r.meta;
    const u = ui();
    const pg = await ensurePage(n);
    if (!pg || !pg.keys || !pg.keys.length) return;
    document.body.classList.add("sr-on");
    document.documentElement.classList.add("sr-az");
    document.documentElement.classList.remove("qm-turning");
    try { sessionStorage.removeItem("qm.turn"); } catch (e) {}

    let root = document.getElementById("sr-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "sr-root";
      document.body.appendChild(root);
    }
    root.dir = TRANSLATOR.dir || "ltr";
    bindSwipe(root);
    const first = pg.keys[0].split(":").map(Number);
    const title = surahTitle(first[0]);
    document.title = u.doc.replace("{n}", String(n)).replace("{title}", title);

    root.innerHTML = "";
    const top = el("header", "sr-top");
    const back = document.createElement("a");
    back.className = "sr-ico";
    back.href = "/" + TRANSLATOR.base + "/";
    back.setAttribute("aria-label", u.back);
    back.innerHTML = ICO.back;
    const home = document.createElement("a");
    home.className = "sr-home qm-home";
    home.href = "https://mushafuk.online/";
    home.setAttribute("aria-label", u.home || "Home");
    home.title = u.home || "Home";
    home.innerHTML = ICO.home + '<span class="qm-home-lbl">' + (u.home || "Home") + "</span>";
    const h1 = document.createElement("h1");
    h1.innerHTML = title + '<small class="sr-pageno">' + u.page + " " + n + "</small>";
    const play = document.createElement("button");
    play.type = "button";
    play.setAttribute("aria-label", u.play);
    play.title = u.play;
    play.innerHTML = ICO.play;
    play.onclick = () => playFrom(first[0], first[1], play);
    const gear = document.createElement("button");
    gear.type = "button";
    gear.setAttribute("aria-label", u.settings);
    gear.title = u.settings;
    gear.innerHTML = ICO.gear;
    gear.onclick = openSettings;
    top.append(back, home, h1, play, gear);

    const page = el("div", "sr-page");
    const wait = el("p", "sr-wait", u.loading);
    page.appendChild(wait);
    root.append(top, page);

    try {
      const surahs = [];
      for (const key of pg.keys) {
        const s = +key.split(":")[0];
        if (surahs.indexOf(s) < 0) surahs.push(s);
      }
      const [uth, trd] = await Promise.all([arabicMap(), loadTr(TRANSLATOR, surahs)]);
      if (curN !== n) return;
      wait.remove();

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sr-chip";
      chip.setAttribute("aria-haspopup", "listbox");
      chip.innerHTML = '<span class="dot">' + (TRANSLATOR.lang || "").toUpperCase() + '</span><span class="who"><b>' + TRANSLATOR.name + "</b><small>" + TRANSLATOR.by + '</small></span><span class="chev">' + ICO.chev + "</span>";
      chip.onclick = openPicker;

      const frag = document.createDocumentFragment();
      let chipDone = false;
      for (const key of pg.keys) {
        const [s, a] = key.split(":").map(Number);
        if (a === 1) {
          if (!chipDone) { page.appendChild(chip); chipDone = true; }
          page.appendChild(surahCard(s));
        }
        if (!chipDone) { page.appendChild(chip); chipDone = true; }
        const raw = (uth[s] && uth[s][a - 1]) || "";
        const ar = stripBism(raw, s, a);
        const tr = trText(trd, s, a);
        const fn = trFoot(trd, s, a);
        const art = el("article", "sr-ayah");
        art.dataset.k = s + "-" + a;
        const bar = el("div", "sr-abar");
        bar.innerHTML = '<span class="sr-anum">' + a + "</span>";
        const mk = document.createElement("button");
        mk.type = "button"; mk.title = u.bookmark; mk.setAttribute("aria-label", u.bookmark);
        const paintMk = () => { const on = isMarked(s + ":" + a); mk.classList.toggle("on", on); mk.innerHTML = on ? ICO.markOn : ICO.mark; };
        paintMk();
        mk.onclick = () => { toggleMark(s + ":" + a); paintMk(); };
        const pb = document.createElement("button");
        pb.type = "button"; pb.title = u.play; pb.setAttribute("aria-label", u.play);
        pb.innerHTML = ICO.play;
        pb.onclick = () => playAyah(s, a);
        const cp = document.createElement("button");
        cp.type = "button"; cp.title = u.copy; cp.setAttribute("aria-label", u.copy);
        cp.innerHTML = ICO.copy;
        cp.onclick = () => copyAyah(s, a, ar, tr);
        const sh = document.createElement("button");
        sh.type = "button"; sh.title = u.share; sh.setAttribute("aria-label", u.share);
        sh.innerHTML = ICO.share;
        sh.onclick = () => shareAyah(s, a, ar, tr);
        bar.append(mk, pb, cp, sh);
        const body = el("div", "sr-abody");
        const arP = el("p", "sr-arabic"); arP.textContent = forFont(ar);
        const trP = el("p", "sr-tr"); trP.textContent = tr;
        body.append(arP, trP);
        if (fn) { const fnP = el("p", "sr-fn"); fnP.textContent = fn; body.appendChild(fnP); }
        const by = el("p", "sr-by"); by.textContent = TRANSLATOR.name;
        body.appendChild(by);
        art.append(bar, body);
        page.appendChild(art);
      }

      const nav = el("nav", "sr-nav");
      if (n > 1) {
        const a = document.createElement("a");
        a.rel = "prev"; a.href = "/" + TRANSLATOR.base + "/page/" + (n - 1) + "/"; a.textContent = u.prev;
        a.addEventListener("click", (e) => { e.preventDefault(); goPage(n - 1); });
        nav.appendChild(a);
      } else {
        nav.appendChild(el("span", "", ""));
      }
      const mid = document.createElement("span");
      mid.textContent = u.page + " " + n;
      nav.appendChild(mid);
      if (n < 604) {
        const a = document.createElement("a");
        a.rel = "next"; a.href = "/" + TRANSLATOR.base + "/page/" + (n + 1) + "/"; a.textContent = u.next;
        a.addEventListener("click", (e) => { e.preventDefault(); goPage(n + 1); });
        nav.appendChild(a);
      }
      page.appendChild(nav);

      document.body.dataset.sr = "ready";
      const hash = (location.hash || "").replace(/^#/, "");
      if (hash) {
        const t = root.querySelector('[data-k="' + hash + '"]');
        if (t) t.scrollIntoView({ block: "start" });
      } else {
        root.querySelector(".sr-page").scrollTop = 0;
        window.scrollTo(0, 0);
      }
    } catch (e) {
      wait.className = "sr-err";
      wait.textContent = u.error;
    }
  }

  window.SR = { open: open, goPage: goPage };

  (function hookTurn() {
    if (!window.QM_TURN) { setTimeout(hookTurn, 50); return; }
    if (window.QM_TURN.__sr) return;
    const orig = window.QM_TURN;
    function wrapped(n) {
      const r = orig(n);
      if (!r) {
        const now = pageNoFromUrl();
        if (now) open(now);
      }
      return r;
    }
    wrapped.__sr = true;
    window.QM_TURN = wrapped;
  })();


  window.addEventListener("popstate", function () {
    const n = pageNoFromUrl();
    if (n) open(n);
  });
  const boot = route();
  if (boot) open(boot.n);
})();
