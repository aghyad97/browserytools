import { readFileSync, writeFileSync } from "node:fs";

/**
 * R2 Task 2 (redesign program spec §6) — inject the three redesign namespaces
 * (`Rail`, `Landing`, `Template`) plus `ToolsConfig.categoriesShort` across all
 * nine locale files.
 *
 * These keys are consumed by Tasks 4/5/7/8/9 via
 *   useTranslations("Landing" | "Rail" | "Template")
 *   useTranslations("ToolsConfig")  ->  t(`categoriesShort.${id}`)
 *
 * `categoriesShort` provides SHORT category labels for the narrow left rail —
 * translated per locale (not string-derived), which kills the old
 * `.replace(" Tools", "")` hack.
 *
 * ICU placeholders ({count}, {pct}) are preserved verbatim in every locale.
 *
 * NOTE: the Arabic (ar) strings must be reviewed by a native speaker before
 * merge — flag this in the PR description.
 *
 * R2 Task 12 (audit spec §4.3) extends this script with `categoriesNew` —
 * the full-name + short-label pair for the three new categories (Tests &
 * Games / School & Learning / Business) added by the category reorg. Unlike
 * `categoriesShort` (full-replace, must carry all keys), `categoriesNew` is
 * merged into the existing `ToolsConfig.categories` object so the 11
 * pre-existing full names never need to be re-typed here.
 */

const BY_LOCALE = {
  en: {
    Rail: {
      toolsOnDevice: "{count} tools · on-device",
      everything: "Everything",
      blog: "Blog",
      github: "GitHub",
      search: "Search",
      sponsorLabel: "Sponsor",
      new: "new",
      language: "Language",
      theme: "Theme",
    },
    Landing: {
      statementLead: "Every tool you need.",
      statementTail: "Nothing leaves your device.",
      searchPlaceholder: "Search {count}+ tools…",
      demoTitle: "Try it. Drop an image here.",
      demoTitleBusy: "Compressing…",
      demoSub:
        "It compresses right here, on your device. No upload — watch the network tab.",
      demoSmaller: "{pct}% smaller",
      apps: "Apps",
      popular: "Popular",
      all: "All",
      allTools: "All {count} tools",
      viewAll: "View all tools",
      onDevice: "on-device",
      sponsorTile: "Your dev tool, native here",
      coffee: "Buy me a coffee",
      favorites: "Your favorites",
      recent: "Recently used",
    },
    Template: {
      onDevicePromise:
        "Runs on your device — nothing is uploaded, nothing is stored.",
      networkNote:
        "Runs in your browser — live data comes from a public API.",
      related: "Related",
      startOver: "Start over",
      download: "Download",
      dropTitle: "Drop a file, or click to choose",
      staysOnDevice: "stays on your device",
    },
    categoriesShort: {
      imageTools: "Image",
      fileTools: "File",
      mediaTools: "Media",
      textLanguage: "Text",
      dataTools: "Data",
      mathFinance: "Math",
      productivity: "Productivity",
      devTools: "Dev",
      designTools: "Design",
      securityTools: "Security",
      aiTools: "AI",
      testsGames: "Games",
      schoolLearning: "School",
      business: "Business",
    },
    categoriesNew: {
      testsGames: "Tests & Games",
      schoolLearning: "School & Learning",
      business: "Business",
    },
  },

  ar: {
    Rail: {
      toolsOnDevice: "{count} أداة · على جهازك",
      everything: "الكل",
      blog: "المدونة",
      github: "GitHub",
      search: "بحث",
      sponsorLabel: "راعٍ",
      new: "جديد",
      language: "اللغة",
      theme: "المظهر",
    },
    Landing: {
      statementLead: "كل أداة تحتاجها.",
      statementTail: "لا شيء يغادر جهازك.",
      searchPlaceholder: "ابحث في أكثر من {count} أداة…",
      demoTitle: "جرّبها. أفلِت صورة هنا.",
      demoTitleBusy: "جارٍ الضغط…",
      demoSub: "تُضغط هنا مباشرةً على جهازك. دون أي رفع — راقب تبويب الشبكة.",
      demoSmaller: "أصغر بنسبة {pct}%",
      apps: "التطبيقات",
      popular: "شائعة",
      all: "الكل",
      allTools: "جميع الأدوات ({count})",
      viewAll: "عرض جميع الأدوات",
      onDevice: "على جهازك",
      sponsorTile: "أداتك البرمجية، بمكانها الطبيعي هنا",
      coffee: "اشتر لي قهوة",
      favorites: "مفضّلتك",
      recent: "المستخدمة مؤخرًا",
    },
    Template: {
      onDevicePromise: "يعمل على جهازك — لا يُرفع شيء ولا يُخزَّن شيء.",
      networkNote: "يعمل في متصفحك — تأتي البيانات الحية من واجهة برمجة عامة.",
      related: "ذات صلة",
      startOver: "ابدأ من جديد",
      download: "تنزيل",
      dropTitle: "أفلِت ملفًا، أو انقر للاختيار",
      staysOnDevice: "يبقى على جهازك",
    },
    categoriesShort: {
      imageTools: "الصور",
      fileTools: "الملفات",
      mediaTools: "الوسائط",
      textLanguage: "النصوص",
      dataTools: "البيانات",
      mathFinance: "الرياضيات",
      productivity: "الإنتاجية",
      devTools: "البرمجة",
      designTools: "التصميم",
      securityTools: "الأمان",
      aiTools: "الذكاء الاصطناعي",
      testsGames: "ألعاب",
      schoolLearning: "مدرسة",
      business: "أعمال",
    },
    categoriesNew: {
      testsGames: "الاختبارات والألعاب",
      schoolLearning: "المدرسة والتعلّم",
      business: "الأعمال",
    },
  },

  es: {
    Rail: {
      toolsOnDevice: "{count} herramientas · en tu dispositivo",
      everything: "Todo",
      blog: "Blog",
      github: "GitHub",
      search: "Buscar",
      sponsorLabel: "Patrocinador",
      new: "nuevo",
      language: "Idioma",
      theme: "Tema",
    },
    Landing: {
      statementLead: "Todas las herramientas que necesitas.",
      statementTail: "Nada sale de tu dispositivo.",
      searchPlaceholder: "Buscar más de {count} herramientas…",
      demoTitle: "Pruébalo. Suelta una imagen aquí.",
      demoTitleBusy: "Comprimiendo…",
      demoSub:
        "Se comprime aquí mismo, en tu dispositivo. Sin subir nada: mira la pestaña de red.",
      demoSmaller: "{pct}% más pequeño",
      apps: "Apps",
      popular: "Populares",
      all: "Todas",
      allTools: "Las {count} herramientas",
      viewAll: "Ver todas las herramientas",
      onDevice: "en tu dispositivo",
      sponsorTile: "Tu herramienta dev, como en casa aquí",
      coffee: "Invítame a un café",
      favorites: "Tus favoritos",
      recent: "Usadas recientemente",
    },
    Template: {
      onDevicePromise:
        "Funciona en tu dispositivo: no se sube ni se almacena nada.",
      networkNote:
        "Funciona en tu navegador: los datos en vivo provienen de una API pública.",
      related: "Relacionadas",
      startOver: "Empezar de nuevo",
      download: "Descargar",
      dropTitle: "Suelta un archivo o haz clic para elegir",
      staysOnDevice: "permanece en tu dispositivo",
    },
    categoriesShort: {
      imageTools: "Imagen",
      fileTools: "Archivos",
      mediaTools: "Multimedia",
      textLanguage: "Texto",
      dataTools: "Datos",
      mathFinance: "Matemáticas",
      productivity: "Productividad",
      devTools: "Desarrollo",
      designTools: "Diseño",
      securityTools: "Seguridad",
      aiTools: "IA",
      testsGames: "Juegos",
      schoolLearning: "Escuela",
      business: "Negocios",
    },
    categoriesNew: {
      testsGames: "Pruebas y juegos",
      schoolLearning: "Escuela y aprendizaje",
      business: "Negocios",
    },
  },

  "pt-BR": {
    Rail: {
      toolsOnDevice: "{count} ferramentas · no seu dispositivo",
      everything: "Tudo",
      blog: "Blog",
      github: "GitHub",
      search: "Pesquisar",
      sponsorLabel: "Patrocinador",
      new: "novo",
      language: "Idioma",
      theme: "Tema",
    },
    Landing: {
      statementLead: "Todas as ferramentas que você precisa.",
      statementTail: "Nada sai do seu dispositivo.",
      searchPlaceholder: "Pesquisar mais de {count} ferramentas…",
      demoTitle: "Experimente. Solte uma imagem aqui.",
      demoTitleBusy: "Comprimindo…",
      demoSub:
        "Ela é comprimida aqui mesmo, no seu dispositivo. Sem upload — veja a aba de rede.",
      demoSmaller: "{pct}% menor",
      apps: "Apps",
      popular: "Populares",
      all: "Todas",
      allTools: "Todas as {count} ferramentas",
      viewAll: "Ver todas as ferramentas",
      onDevice: "no seu dispositivo",
      sponsorTile: "Sua ferramenta dev, nativa aqui",
      coffee: "Pague-me um café",
      favorites: "Seus favoritos",
      recent: "Usadas recentemente",
    },
    Template: {
      onDevicePromise:
        "Funciona no seu dispositivo — nada é enviado, nada é armazenado.",
      networkNote:
        "Funciona no seu navegador — os dados em tempo real vêm de uma API pública.",
      related: "Relacionadas",
      startOver: "Recomeçar",
      download: "Baixar",
      dropTitle: "Solte um arquivo ou clique para escolher",
      staysOnDevice: "permanece no seu dispositivo",
    },
    categoriesShort: {
      imageTools: "Imagem",
      fileTools: "Arquivos",
      mediaTools: "Mídia",
      textLanguage: "Texto",
      dataTools: "Dados",
      mathFinance: "Matemática",
      productivity: "Produtividade",
      devTools: "Dev",
      designTools: "Design",
      securityTools: "Segurança",
      aiTools: "IA",
      testsGames: "Jogos",
      schoolLearning: "Escola",
      business: "Negócios",
    },
    categoriesNew: {
      testsGames: "Testes e Jogos",
      schoolLearning: "Escola e Aprendizado",
      business: "Negócios",
    },
  },

  fr: {
    Rail: {
      toolsOnDevice: "{count} outils · sur votre appareil",
      everything: "Tout",
      blog: "Blog",
      github: "GitHub",
      search: "Rechercher",
      sponsorLabel: "Sponsor",
      new: "nouveau",
      language: "Langue",
      theme: "Thème",
    },
    Landing: {
      statementLead: "Tous les outils dont vous avez besoin.",
      statementTail: "Rien ne quitte votre appareil.",
      searchPlaceholder: "Rechercher parmi plus de {count} outils…",
      demoTitle: "Essayez. Déposez une image ici.",
      demoTitleBusy: "Compression…",
      demoSub:
        "La compression se fait ici même, sur votre appareil. Aucun envoi — regardez l'onglet réseau.",
      demoSmaller: "{pct}% plus léger",
      apps: "Applis",
      popular: "Populaires",
      all: "Tous",
      allTools: "Les {count} outils",
      viewAll: "Voir tous les outils",
      onDevice: "sur votre appareil",
      sponsorTile: "Votre outil dev, à sa place ici",
      coffee: "Offrez-moi un café",
      favorites: "Vos favoris",
      recent: "Utilisées récemment",
    },
    Template: {
      onDevicePromise:
        "Fonctionne sur votre appareil — rien n'est envoyé, rien n'est stocké.",
      networkNote:
        "Fonctionne dans votre navigateur — les données en direct proviennent d'une API publique.",
      related: "Associés",
      startOver: "Recommencer",
      download: "Télécharger",
      dropTitle: "Déposez un fichier ou cliquez pour choisir",
      staysOnDevice: "reste sur votre appareil",
    },
    categoriesShort: {
      imageTools: "Image",
      fileTools: "Fichiers",
      mediaTools: "Média",
      textLanguage: "Texte",
      dataTools: "Données",
      mathFinance: "Maths",
      productivity: "Productivité",
      devTools: "Dev",
      designTools: "Design",
      securityTools: "Sécurité",
      aiTools: "IA",
      testsGames: "Jeux",
      schoolLearning: "École",
      business: "Entreprise",
    },
    categoriesNew: {
      testsGames: "Tests et jeux",
      schoolLearning: "École et apprentissage",
      business: "Entreprise",
    },
  },

  de: {
    Rail: {
      toolsOnDevice: "{count} Tools · auf deinem Gerät",
      everything: "Alles",
      blog: "Blog",
      github: "GitHub",
      search: "Suchen",
      sponsorLabel: "Sponsor",
      new: "neu",
      language: "Sprache",
      theme: "Design",
    },
    Landing: {
      statementLead: "Alle Tools, die du brauchst.",
      statementTail: "Nichts verlässt dein Gerät.",
      searchPlaceholder: "Über {count} Tools durchsuchen …",
      demoTitle: "Probier's aus. Zieh ein Bild hierher.",
      demoTitleBusy: "Wird komprimiert …",
      demoSub:
        "Die Komprimierung passiert direkt hier, auf deinem Gerät. Kein Upload – schau in den Netzwerk-Tab.",
      demoSmaller: "{pct}% kleiner",
      apps: "Apps",
      popular: "Beliebt",
      all: "Alle",
      allTools: "Alle {count} Tools",
      viewAll: "Alle Tools anzeigen",
      onDevice: "auf deinem Gerät",
      sponsorTile: "Dein Dev-Tool, hier zu Hause",
      coffee: "Spendiere mir einen Kaffee",
      favorites: "Deine Favoriten",
      recent: "Zuletzt verwendet",
    },
    Template: {
      onDevicePromise:
        "Läuft auf deinem Gerät – nichts wird hochgeladen, nichts gespeichert.",
      networkNote:
        "Läuft in deinem Browser – Live-Daten stammen von einer öffentlichen API.",
      related: "Ähnliche",
      startOver: "Von vorn beginnen",
      download: "Herunterladen",
      dropTitle: "Datei ablegen oder zum Auswählen klicken",
      staysOnDevice: "bleibt auf deinem Gerät",
    },
    categoriesShort: {
      imageTools: "Bild",
      fileTools: "Dateien",
      mediaTools: "Medien",
      textLanguage: "Text",
      dataTools: "Daten",
      mathFinance: "Mathe",
      productivity: "Produktivität",
      devTools: "Dev",
      designTools: "Design",
      securityTools: "Sicherheit",
      aiTools: "KI",
      testsGames: "Spiele",
      schoolLearning: "Schule",
      business: "Business",
    },
    categoriesNew: {
      testsGames: "Tests & Spiele",
      schoolLearning: "Schule & Lernen",
      business: "Business",
    },
  },

  ru: {
    Rail: {
      toolsOnDevice: "{count} инструментов · на устройстве",
      everything: "Всё",
      blog: "Блог",
      github: "GitHub",
      search: "Поиск",
      sponsorLabel: "Спонсор",
      new: "новое",
      language: "Язык",
      theme: "Тема",
    },
    Landing: {
      statementLead: "Все инструменты, которые вам нужны.",
      statementTail: "Ничего не покидает ваше устройство.",
      searchPlaceholder: "Поиск среди {count}+ инструментов…",
      demoTitle: "Попробуйте. Перетащите изображение сюда.",
      demoTitleBusy: "Сжатие…",
      demoSub:
        "Сжатие происходит прямо здесь, на вашем устройстве. Без загрузки — загляните во вкладку «Сеть».",
      demoSmaller: "на {pct}% меньше",
      apps: "Приложения",
      popular: "Популярные",
      all: "Все",
      allTools: "Все {count} инструментов",
      viewAll: "Показать все инструменты",
      onDevice: "на устройстве",
      sponsorTile: "Ваш инструмент для разработчиков — здесь как дома",
      coffee: "Купить мне кофе",
      favorites: "Избранное",
      recent: "Недавно использованные",
    },
    Template: {
      onDevicePromise:
        "Работает на вашем устройстве — ничего не загружается и не сохраняется.",
      networkNote:
        "Работает в вашем браузере — актуальные данные поступают из публичного API.",
      related: "Похожие",
      startOver: "Начать заново",
      download: "Скачать",
      dropTitle: "Перетащите файл или нажмите, чтобы выбрать",
      staysOnDevice: "остаётся на вашем устройстве",
    },
    categoriesShort: {
      imageTools: "Изображения",
      fileTools: "Файлы",
      mediaTools: "Медиа",
      textLanguage: "Текст",
      dataTools: "Данные",
      mathFinance: "Математика",
      productivity: "Продуктивность",
      devTools: "Разработка",
      designTools: "Дизайн",
      securityTools: "Безопасность",
      aiTools: "ИИ",
      testsGames: "Игры",
      schoolLearning: "Школа",
      business: "Бизнес",
    },
    categoriesNew: {
      testsGames: "Тесты и игры",
      schoolLearning: "Школа и обучение",
      business: "Бизнес",
    },
  },

  id: {
    Rail: {
      toolsOnDevice: "{count} alat · di perangkat",
      everything: "Semua",
      blog: "Blog",
      github: "GitHub",
      search: "Cari",
      sponsorLabel: "Sponsor",
      new: "baru",
      language: "Bahasa",
      theme: "Tema",
    },
    Landing: {
      statementLead: "Semua alat yang Anda butuhkan.",
      statementTail: "Tidak ada yang meninggalkan perangkat Anda.",
      searchPlaceholder: "Cari {count}+ alat…",
      demoTitle: "Coba. Jatuhkan gambar di sini.",
      demoTitleBusy: "Mengompres…",
      demoSub:
        "Kompresi terjadi di sini, di perangkat Anda. Tanpa unggahan — lihat tab jaringan.",
      demoSmaller: "{pct}% lebih kecil",
      apps: "Aplikasi",
      popular: "Populer",
      all: "Semua",
      allTools: "Semua {count} alat",
      viewAll: "Lihat semua alat",
      onDevice: "di perangkat",
      sponsorTile: "Alat dev Anda, seperti di rumah di sini",
      coffee: "Belikan saya kopi",
      favorites: "Favorit Anda",
      recent: "Baru digunakan",
    },
    Template: {
      onDevicePromise:
        "Berjalan di perangkat Anda — tidak ada yang diunggah, tidak ada yang disimpan.",
      networkNote:
        "Berjalan di browser Anda — data langsung berasal dari API publik.",
      related: "Terkait",
      startOver: "Mulai lagi",
      download: "Unduh",
      dropTitle: "Jatuhkan berkas, atau klik untuk memilih",
      staysOnDevice: "tetap di perangkat Anda",
    },
    categoriesShort: {
      imageTools: "Gambar",
      fileTools: "Berkas",
      mediaTools: "Media",
      textLanguage: "Teks",
      dataTools: "Data",
      mathFinance: "Matematika",
      productivity: "Produktivitas",
      devTools: "Dev",
      designTools: "Desain",
      securityTools: "Keamanan",
      aiTools: "AI",
      testsGames: "Permainan",
      schoolLearning: "Sekolah",
      business: "Bisnis",
    },
    categoriesNew: {
      testsGames: "Tes & Permainan",
      schoolLearning: "Sekolah & Belajar",
      business: "Bisnis",
    },
  },

  "zh-CN": {
    Rail: {
      toolsOnDevice: "{count} 个工具 · 在设备本地",
      everything: "全部",
      blog: "博客",
      github: "GitHub",
      search: "搜索",
      sponsorLabel: "赞助",
      new: "新",
      language: "语言",
      theme: "主题",
    },
    Landing: {
      statementLead: "你需要的每一个工具。",
      statementTail: "一切都不会离开你的设备。",
      searchPlaceholder: "搜索 {count}+ 个工具…",
      demoTitle: "试试看。把图片拖到这里。",
      demoTitleBusy: "正在压缩…",
      demoSub: "压缩就在本地、在你的设备上完成。无需上传——看看网络面板。",
      demoSmaller: "缩小 {pct}%",
      apps: "应用",
      popular: "热门",
      all: "全部",
      allTools: "全部 {count} 个工具",
      viewAll: "查看所有工具",
      onDevice: "在设备本地",
      sponsorTile: "你的开发工具，在这里如鱼得水",
      coffee: "请我喝杯咖啡",
      favorites: "你的收藏",
      recent: "最近使用",
    },
    Template: {
      onDevicePromise: "在你的设备上运行——不上传、不存储任何内容。",
      networkNote: "在你的浏览器中运行——实时数据来自公开 API。",
      related: "相关工具",
      startOver: "重新开始",
      download: "下载",
      dropTitle: "拖入文件，或点击选择",
      staysOnDevice: "留在你的设备上",
    },
    categoriesShort: {
      imageTools: "图像",
      fileTools: "文件",
      mediaTools: "媒体",
      textLanguage: "文本",
      dataTools: "数据",
      mathFinance: "数学",
      productivity: "效率",
      devTools: "开发",
      designTools: "设计",
      securityTools: "安全",
      aiTools: "AI",
      testsGames: "游戏",
      schoolLearning: "学校",
      business: "商业",
    },
    categoriesNew: {
      testsGames: "测试与游戏",
      schoolLearning: "学校与学习",
      business: "商业",
    },
  },
};

for (const [
  locale,
  { Rail, Landing, Template, categoriesShort, categoriesNew },
] of Object.entries(BY_LOCALE)) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));

  json.Rail = Rail;
  json.Landing = Landing;
  json.Template = Template;
  json.ToolsConfig.categoriesShort = categoriesShort;
  // Merge (not replace) — preserves the 11 pre-existing full category names
  // that this script has never owned.
  Object.assign(json.ToolsConfig.categories, categoriesNew);

  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}

console.log("injected redesign i18n into", Object.keys(BY_LOCALE).length, "locales");
