import { readFileSync, writeFileSync } from "node:fs";

/**
 * R2 Task 7 (redesign program spec §6) — inject the `Legal` namespace
 * (privacy policy + terms of use copy, plus the shared `nav`/`common` bits
 * used by both the /privacy and /terms pages and by the footer's new legal
 * links) across all nine locale files.
 *
 * Consumed by:
 *   useTranslations("Legal")       -> t("privacy.title"), t("terms.intro"), …
 *   useTranslations("Legal.nav")   -> footer + in-page cross-links (license/privacy/terms)
 *   useTranslations("Legal.common") -> shared CTA link text (contact/license)
 *
 * Content is true and short per the brief: no accounts, no file uploads
 * (processing happens on-device), Vercel Analytics aggregate usage only,
 * GitHub-hosted open source code (AGPL-3.0), no warranty, free for everyone.
 *
 * Follows the Task 2 script pattern (scripts/inject-redesign-i18n.mjs):
 * natural per-locale phrasing matching each locale's established product
 * voice (see that script's BY_LOCALE for the register precedent), not
 * literal machine translation.
 *
 * NOTE: the Arabic (ar) strings must be reviewed by a native speaker before
 * merge — flag this in the PR description (same as Task 2).
 */

const BY_LOCALE = {
  en: {
    nav: { license: "License", privacy: "Privacy", terms: "Terms" },
    common: {
      contactLinkText: "Open an issue on GitHub",
      licenseLinkText: "Read the AGPL-3.0 license",
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "BrowseryTools is built so your files never have a reason to leave your device. This page explains, in plain terms, what that means and what little data we do collect.",
      noAccountsHeading: "No accounts, no sign-in",
      noAccountsBody:
        "There's nothing to register for. We don't ask for your name, email, or payment details, and we don't create a profile for you anywhere.",
      onDeviceHeading: "Your files never leave your device",
      onDeviceBody:
        "Every tool runs entirely in your browser. Images, documents, and text you process are read, transformed, and downloaded locally — nothing is uploaded to a server, ever. You can confirm this yourself: open your browser's network tab while using any tool.",
      analyticsHeading: "Aggregate usage analytics",
      analyticsBody:
        "We use Vercel Analytics to see which pages and tools are popular. It reports anonymized, aggregate numbers — page views and rough usage counts — never the content of what you process, and never anything tied to you individually.",
      localStorageHeading: "Local preferences",
      localStorageBody:
        "Some tools remember your settings — like a theme or a recent list — using your browser's local storage. That data is saved on your device only and is never transmitted anywhere.",
      openSourceHeading: "Open source, start to finish",
      openSourceBody:
        "The entire codebase is public on GitHub. If you want to know exactly what a tool does with your data, you can read the source yourself instead of taking our word for it.",
      contactHeading: "Questions",
      contactBody:
        "If anything here is unclear, the fastest way to reach us is GitHub.",
      changesHeading: "Changes to this policy",
      changesBody:
        "If this policy ever changes, we'll update this page. Since we don't collect emails, we have no way to notify you directly — check back if you're curious.",
    },
    terms: {
      title: "Terms of Use",
      intro:
        "BrowseryTools is free software. By using it, here's what you're agreeing to — and it's shorter than most.",
      licenseHeading: "Open source license",
      licenseBody:
        "The code is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). You're free to read it, fork it, and run your own copy, under the terms of that license.",
      freeHeading: "Free for everyone",
      freeBody:
        "Every tool is free to use, for personal and commercial projects alike. No paywalls, no usage limits, no premium tier hiding the good parts.",
      warrantyHeading: "No warranty",
      warrantyBody:
        "BrowseryTools is provided as-is, with no warranty of any kind. We work to keep every tool accurate and reliable, but you're responsible for verifying results before relying on them for anything important.",
      acceptableUseHeading: "Acceptable use",
      acceptableUseBody:
        "Use the tools for lawful purposes. You're responsible for the content you process and for complying with any laws that apply to it.",
      changesHeading: "Changes to these terms",
      changesBody:
        "We may update these terms as the project evolves. Continuing to use BrowseryTools after a change means you accept the new terms.",
      contactHeading: "Questions",
      contactBody: "Questions about these terms are welcome — reach us on GitHub.",
    },
  },

  ar: {
    nav: { license: "الترخيص", privacy: "الخصوصية", terms: "الشروط" },
    common: {
      contactLinkText: "افتح تذكرة على GitHub",
      licenseLinkText: "اقرأ ترخيص AGPL-3.0",
    },
    privacy: {
      title: "سياسة الخصوصية",
      intro:
        "صُممت BrowseryTools بحيث لا تحتاج ملفاتك لمغادرة جهازك أصلًا. توضح هذه الصفحة بعبارات بسيطة ماذا يعني ذلك، وما هي البيانات القليلة التي نجمعها فعلًا.",
      noAccountsHeading: "بلا حسابات، بلا تسجيل دخول",
      noAccountsBody:
        "لا شيء تحتاج التسجيل فيه. لا نطلب اسمك أو بريدك الإلكتروني أو بيانات دفعك، ولا ننشئ لك ملفًا شخصيًا في أي مكان.",
      onDeviceHeading: "ملفاتك لا تغادر جهازك أبدًا",
      onDeviceBody:
        "كل أداة تعمل بالكامل داخل متصفحك. الصور والمستندات والنصوص التي تعالجها تُقرأ وتُحوَّل وتُنزَّل محليًا — لا شيء يُرفع إلى أي خادم، أبدًا. يمكنك التأكد بنفسك: افتح تبويب الشبكة في متصفحك أثناء استخدام أي أداة.",
      analyticsHeading: "إحصاءات استخدام مجمّعة",
      analyticsBody:
        "نستخدم Vercel Analytics لمعرفة أي الصفحات والأدوات أكثر استخدامًا. يُبلغ هذا النظام عن أرقام مجمّعة ومجهولة الهوية — عدد الزيارات وتقديرات الاستخدام — ولا يشمل أبدًا محتوى ما تعالجه، ولا أي شيء يمكن ربطه بك شخصيًا.",
      localStorageHeading: "تفضيلات محلية",
      localStorageBody:
        "بعض الأدوات تتذكر إعداداتك — مثل المظهر أو قائمة حديثة — باستخدام التخزين المحلي في متصفحك. تبقى هذه البيانات على جهازك فقط ولا تُرسَل إلى أي مكان.",
      openSourceHeading: "مفتوحة المصدر بالكامل",
      openSourceBody:
        "الشيفرة البرمجية بأكملها متاحة للعامة على GitHub. إن أردت معرفة ما تفعله أداة ما ببياناتك بالضبط، يمكنك قراءة الشيفرة المصدرية بنفسك بدلًا من تصديق كلامنا فقط.",
      contactHeading: "أسئلة",
      contactBody: "إن كان أي شيء هنا غير واضح، فأسرع طريقة للتواصل معنا هي GitHub.",
      changesHeading: "تعديلات على هذه السياسة",
      changesBody:
        "إذا تغيّرت هذه السياسة يومًا، سنحدّث هذه الصفحة. وبما أننا لا نجمع عناوين بريد إلكتروني، فليس لدينا طريقة لإخبارك مباشرة — عُد للاطلاع إن أردت.",
    },
    terms: {
      title: "شروط الاستخدام",
      intro:
        "BrowseryTools برنامج مجاني ومفتوح المصدر. باستخدامه، إليك ما توافق عليه — وهو أقصر مما تتخيل.",
      licenseHeading: "ترخيص مفتوح المصدر",
      licenseBody:
        "الشيفرة مرخّصة بموجب GNU Affero General Public License v3.0 (AGPL-3.0). يحق لك قراءتها ونسخها وتشغيل نسختك الخاصة منها، وفق شروط هذا الترخيص.",
      freeHeading: "مجانية للجميع",
      freeBody:
        "كل أداة مجانية للاستخدام، للمشاريع الشخصية والتجارية على حد سواء. بلا جدران دفع، وبلا حدود استخدام، وبلا نسخة مدفوعة تُخفي الميزات الجيدة.",
      warrantyHeading: "بلا ضمان",
      warrantyBody:
        "تُقدَّم BrowseryTools كما هي، دون أي ضمان من أي نوع. نعمل على إبقاء كل أداة دقيقة وموثوقة، لكن تبقى مسؤوليتك التحقق من النتائج قبل الاعتماد عليها في أي أمر مهم.",
      acceptableUseHeading: "الاستخدام المقبول",
      acceptableUseBody:
        "استخدم الأدوات لأغراض مشروعة. أنت المسؤول عن المحتوى الذي تعالجه وعن الامتثال لأي قوانين تنطبق عليه.",
      changesHeading: "تعديلات على هذه الشروط",
      changesBody:
        "قد نحدّث هذه الشروط مع تطور المشروع. استمرارك في استخدام BrowseryTools بعد أي تعديل يعني موافقتك على الشروط الجديدة.",
      contactHeading: "أسئلة",
      contactBody: "أسئلتك حول هذه الشروط مرحّب بها — تواصل معنا عبر GitHub.",
    },
  },

  es: {
    nav: { license: "Licencia", privacy: "Privacidad", terms: "Términos" },
    common: {
      contactLinkText: "Abre un issue en GitHub",
      licenseLinkText: "Lee la licencia AGPL-3.0",
    },
    privacy: {
      title: "Política de privacidad",
      intro:
        "BrowseryTools está diseñado para que tus archivos nunca tengan motivo para salir de tu dispositivo. Esta página explica, en términos simples, qué significa eso y qué poco recopilamos.",
      noAccountsHeading: "Sin cuentas, sin inicio de sesión",
      noAccountsBody:
        "No hay nada que registrar. No pedimos tu nombre, correo ni datos de pago, y no creamos ningún perfil tuyo en ningún sitio.",
      onDeviceHeading: "Tus archivos nunca salen de tu dispositivo",
      onDeviceBody:
        "Cada herramienta funciona por completo en tu navegador. Las imágenes, documentos y textos que procesas se leen, transforman y descargan localmente — nada se sube a un servidor, nunca. Puedes comprobarlo tú mismo: abre la pestaña de red de tu navegador mientras usas cualquier herramienta.",
      analyticsHeading: "Analítica de uso agregada",
      analyticsBody:
        "Usamos Vercel Analytics para ver qué páginas y herramientas son populares. Reporta cifras anónimas y agregadas — visitas y estimaciones de uso — nunca el contenido de lo que procesas, ni nada vinculado a ti individualmente.",
      localStorageHeading: "Preferencias locales",
      localStorageBody:
        "Algunas herramientas recuerdan tus ajustes — como un tema o una lista reciente — usando el almacenamiento local de tu navegador. Esos datos se guardan solo en tu dispositivo y nunca se transmiten a ningún lugar.",
      openSourceHeading: "Código abierto de principio a fin",
      openSourceBody:
        "Todo el código está publicado en GitHub. Si quieres saber exactamente qué hace una herramienta con tus datos, puedes leer el código fuente tú mismo en vez de fiarte de nuestra palabra.",
      contactHeading: "Preguntas",
      contactBody: "Si algo aquí no queda claro, la forma más rápida de contactarnos es GitHub.",
      changesHeading: "Cambios en esta política",
      changesBody:
        "Si esta política cambia alguna vez, actualizaremos esta página. Como no recopilamos correos, no tenemos forma de avisarte directamente — vuelve a consultarla si tienes curiosidad.",
    },
    terms: {
      title: "Términos de uso",
      intro:
        "BrowseryTools es software libre. Al usarlo, esto es lo que aceptas — y es más breve de lo que imaginas.",
      licenseHeading: "Licencia de código abierto",
      licenseBody:
        "El código está licenciado bajo la GNU Affero General Public License v3.0 (AGPL-3.0). Eres libre de leerlo, bifurcarlo y ejecutar tu propia copia, conforme a los términos de esa licencia.",
      freeHeading: "Gratis para todos",
      freeBody:
        "Todas las herramientas son gratuitas, tanto para proyectos personales como comerciales. Sin muros de pago, sin límites de uso, sin un plan premium que esconda lo bueno.",
      warrantyHeading: "Sin garantía",
      warrantyBody:
        "BrowseryTools se ofrece tal cual, sin garantía de ningún tipo. Trabajamos para que cada herramienta sea precisa y fiable, pero eres responsable de verificar los resultados antes de confiar en ellos para algo importante.",
      acceptableUseHeading: "Uso aceptable",
      acceptableUseBody:
        "Usa las herramientas con fines lícitos. Eres responsable del contenido que procesas y de cumplir las leyes que le apliquen.",
      changesHeading: "Cambios en estos términos",
      changesBody:
        "Podemos actualizar estos términos a medida que el proyecto evoluciona. Si sigues usando BrowseryTools después de un cambio, aceptas los nuevos términos.",
      contactHeading: "Preguntas",
      contactBody: "Las preguntas sobre estos términos son bienvenidas — contáctanos en GitHub.",
    },
  },

  "pt-BR": {
    nav: { license: "Licença", privacy: "Privacidade", terms: "Termos" },
    common: {
      contactLinkText: "Abra uma issue no GitHub",
      licenseLinkText: "Leia a licença AGPL-3.0",
    },
    privacy: {
      title: "Política de privacidade",
      intro:
        "O BrowseryTools foi feito para que seus arquivos nunca precisem sair do seu dispositivo. Esta página explica, em termos simples, o que isso significa e o pouco que coletamos.",
      noAccountsHeading: "Sem contas, sem login",
      noAccountsBody:
        "Não há nada para cadastrar. Não pedimos seu nome, e-mail ou dados de pagamento, e não criamos nenhum perfil seu em lugar nenhum.",
      onDeviceHeading: "Seus arquivos nunca saem do seu dispositivo",
      onDeviceBody:
        "Cada ferramenta roda inteiramente no seu navegador. Imagens, documentos e textos que você processa são lidos, transformados e baixados localmente — nada é enviado a um servidor, nunca. Você pode conferir isso: abra a aba de rede do navegador enquanto usa qualquer ferramenta.",
      analyticsHeading: "Análises de uso agregadas",
      analyticsBody:
        "Usamos o Vercel Analytics para ver quais páginas e ferramentas são populares. Ele reporta números anônimos e agregados — visualizações de página e estimativas de uso — nunca o conteúdo do que você processa, nem nada vinculado a você individualmente.",
      localStorageHeading: "Preferências locais",
      localStorageBody:
        "Algumas ferramentas lembram suas configurações — como um tema ou uma lista recente — usando o armazenamento local do navegador. Esses dados ficam salvos só no seu dispositivo e nunca são transmitidos a lugar nenhum.",
      openSourceHeading: "Código aberto do início ao fim",
      openSourceBody:
        "Todo o código está público no GitHub. Se quiser saber exatamente o que uma ferramenta faz com seus dados, você pode ler o código-fonte em vez de confiar apenas na nossa palavra.",
      contactHeading: "Dúvidas",
      contactBody: "Se algo aqui não estiver claro, a forma mais rápida de falar com a gente é pelo GitHub.",
      changesHeading: "Mudanças nesta política",
      changesBody:
        "Se esta política mudar algum dia, atualizaremos esta página. Como não coletamos e-mails, não temos como avisar você diretamente — volte aqui se tiver curiosidade.",
    },
    terms: {
      title: "Termos de uso",
      intro:
        "O BrowseryTools é software livre. Ao usá-lo, é isto que você concorda — e é mais curto do que parece.",
      licenseHeading: "Licença de código aberto",
      licenseBody:
        "O código é licenciado sob a GNU Affero General Public License v3.0 (AGPL-3.0). Você é livre para lê-lo, fazer um fork e rodar sua própria cópia, conforme os termos dessa licença.",
      freeHeading: "Gratuito para todos",
      freeBody:
        "Todas as ferramentas são gratuitas, tanto para projetos pessoais quanto comerciais. Sem paywall, sem limite de uso, sem plano premium escondendo as melhores partes.",
      warrantyHeading: "Sem garantia",
      warrantyBody:
        "O BrowseryTools é oferecido como está, sem garantia de nenhum tipo. Trabalhamos para manter cada ferramenta precisa e confiável, mas você é responsável por verificar os resultados antes de confiar neles para algo importante.",
      acceptableUseHeading: "Uso aceitável",
      acceptableUseBody:
        "Use as ferramentas para fins lícitos. Você é responsável pelo conteúdo que processa e por cumprir as leis que se aplicarem a ele.",
      changesHeading: "Mudanças nestes termos",
      changesBody:
        "Podemos atualizar estes termos conforme o projeto evolui. Continuar usando o BrowseryTools depois de uma mudança significa que você aceita os novos termos.",
      contactHeading: "Dúvidas",
      contactBody: "Dúvidas sobre estes termos são bem-vindas — fale com a gente no GitHub.",
    },
  },

  fr: {
    nav: { license: "Licence", privacy: "Confidentialité", terms: "Conditions" },
    common: {
      contactLinkText: "Ouvrir un ticket sur GitHub",
      licenseLinkText: "Lire la licence AGPL-3.0",
    },
    privacy: {
      title: "Politique de confidentialité",
      intro:
        "BrowseryTools est conçu pour que vos fichiers n'aient jamais besoin de quitter votre appareil. Cette page explique, simplement, ce que cela signifie et le peu de données que nous collectons.",
      noAccountsHeading: "Aucun compte, aucune connexion",
      noAccountsBody:
        "Il n'y a rien à créer. Nous ne demandons ni votre nom, ni votre e-mail, ni vos informations de paiement, et nous ne créons aucun profil vous concernant.",
      onDeviceHeading: "Vos fichiers ne quittent jamais votre appareil",
      onDeviceBody:
        "Chaque outil fonctionne entièrement dans votre navigateur. Les images, documents et textes que vous traitez sont lus, transformés et téléchargés localement — rien n'est envoyé vers un serveur, jamais. Vous pouvez le vérifier vous-même : ouvrez l'onglet réseau de votre navigateur en utilisant n'importe quel outil.",
      analyticsHeading: "Statistiques d'usage agrégées",
      analyticsBody:
        "Nous utilisons Vercel Analytics pour voir quelles pages et quels outils sont populaires. Il ne remonte que des chiffres anonymes et agrégés — pages vues, estimations d'usage — jamais le contenu de ce que vous traitez, ni rien qui vous soit lié individuellement.",
      localStorageHeading: "Préférences locales",
      localStorageBody:
        "Certains outils retiennent vos réglages — comme un thème ou une liste récente — via le stockage local de votre navigateur. Ces données restent uniquement sur votre appareil et ne sont jamais transmises ailleurs.",
      openSourceHeading: "Open source de bout en bout",
      openSourceBody:
        "Tout le code est public sur GitHub. Si vous voulez savoir exactement ce qu'un outil fait de vos données, vous pouvez lire le code source vous-même plutôt que de nous croire sur parole.",
      contactHeading: "Questions",
      contactBody: "Si quelque chose n'est pas clair ici, le moyen le plus rapide de nous joindre est GitHub.",
      changesHeading: "Modifications de cette politique",
      changesBody:
        "Si cette politique venait à changer, nous mettrons cette page à jour. Comme nous ne collectons pas d'e-mails, nous n'avons aucun moyen de vous prévenir directement — repassez si la curiosité vous prend.",
    },
    terms: {
      title: "Conditions d'utilisation",
      intro:
        "BrowseryTools est un logiciel libre. En l'utilisant, voici ce que vous acceptez — et c'est plus court qu'il n'y paraît.",
      licenseHeading: "Licence open source",
      licenseBody:
        "Le code est publié sous licence GNU Affero General Public License v3.0 (AGPL-3.0). Vous êtes libre de le lire, de le forker et de faire tourner votre propre copie, dans les conditions de cette licence.",
      freeHeading: "Gratuit pour tout le monde",
      freeBody:
        "Chaque outil est gratuit, pour les projets personnels comme professionnels. Pas de mur payant, pas de limite d'usage, pas d'offre premium qui cache les meilleures fonctions.",
      warrantyHeading: "Aucune garantie",
      warrantyBody:
        "BrowseryTools est fourni tel quel, sans garantie d'aucune sorte. Nous faisons en sorte que chaque outil reste précis et fiable, mais il vous appartient de vérifier les résultats avant de vous y fier pour quoi que ce soit d'important.",
      acceptableUseHeading: "Usage autorisé",
      acceptableUseBody:
        "Utilisez les outils à des fins légales. Vous êtes responsable du contenu que vous traitez et du respect des lois qui s'y appliquent.",
      changesHeading: "Modifications de ces conditions",
      changesBody:
        "Nous pouvons mettre à jour ces conditions à mesure que le projet évolue. Continuer à utiliser BrowseryTools après une modification signifie que vous acceptez les nouvelles conditions.",
      contactHeading: "Questions",
      contactBody: "Vos questions sur ces conditions sont les bienvenues — contactez-nous sur GitHub.",
    },
  },

  de: {
    nav: { license: "Lizenz", privacy: "Datenschutz", terms: "Nutzungsbedingungen" },
    common: {
      contactLinkText: "Issue auf GitHub öffnen",
      licenseLinkText: "AGPL-3.0-Lizenz lesen",
    },
    privacy: {
      title: "Datenschutzerklärung",
      intro:
        "BrowseryTools ist so gebaut, dass deine Dateien nie einen Grund haben, dein Gerät zu verlassen. Diese Seite erklärt in einfachen Worten, was das bedeutet und wie wenig wir tatsächlich erheben.",
      noAccountsHeading: "Keine Konten, kein Login",
      noAccountsBody:
        "Es gibt nichts zu registrieren. Wir fragen weder nach deinem Namen noch nach E-Mail oder Zahlungsdaten, und wir legen nirgendwo ein Profil von dir an.",
      onDeviceHeading: "Deine Dateien verlassen nie dein Gerät",
      onDeviceBody:
        "Jedes Tool läuft vollständig in deinem Browser. Bilder, Dokumente und Texte, die du bearbeitest, werden lokal gelesen, umgewandelt und heruntergeladen — nichts wird jemals auf einen Server hochgeladen. Du kannst das selbst prüfen: Öffne den Netzwerk-Tab deines Browsers, während du ein Tool benutzt.",
      analyticsHeading: "Aggregierte Nutzungsstatistik",
      analyticsBody:
        "Wir nutzen Vercel Analytics, um zu sehen, welche Seiten und Tools beliebt sind. Es liefert nur anonyme, aggregierte Zahlen — Seitenaufrufe und grobe Nutzungswerte — nie den Inhalt dessen, was du bearbeitest, und nie etwas, das dir persönlich zugeordnet werden kann.",
      localStorageHeading: "Lokale Einstellungen",
      localStorageBody:
        "Manche Tools merken sich deine Einstellungen — etwa ein Theme oder eine zuletzt-verwendet-Liste — über den lokalen Speicher deines Browsers. Diese Daten bleiben nur auf deinem Gerät und werden nie irgendwohin übertragen.",
      openSourceHeading: "Durchgehend Open Source",
      openSourceBody:
        "Der gesamte Code ist öffentlich auf GitHub einsehbar. Wenn du genau wissen willst, was ein Tool mit deinen Daten macht, kannst du den Quellcode selbst lesen, statt uns einfach zu glauben.",
      contactHeading: "Fragen",
      contactBody: "Wenn hier etwas unklar ist, erreichst du uns am schnellsten über GitHub.",
      changesHeading: "Änderungen an dieser Richtlinie",
      changesBody:
        "Sollte sich diese Richtlinie einmal ändern, aktualisieren wir diese Seite. Da wir keine E-Mail-Adressen sammeln, können wir dich nicht direkt benachrichtigen — schau bei Interesse einfach wieder vorbei.",
    },
    terms: {
      title: "Nutzungsbedingungen",
      intro: "BrowseryTools ist freie Software. Mit der Nutzung stimmst du Folgendem zu — und es ist kürzer, als du denkst.",
      licenseHeading: "Open-Source-Lizenz",
      licenseBody:
        "Der Code steht unter der GNU Affero General Public License v3.0 (AGPL-3.0). Du darfst ihn lesen, forken und eine eigene Kopie betreiben, im Rahmen der Bedingungen dieser Lizenz.",
      freeHeading: "Kostenlos für alle",
      freeBody:
        "Jedes Tool ist kostenlos nutzbar, für private wie kommerzielle Projekte gleichermaßen. Keine Paywall, keine Nutzungsgrenzen, keine Premium-Stufe, die die guten Funktionen versteckt.",
      warrantyHeading: "Keine Gewährleistung",
      warrantyBody:
        "BrowseryTools wird ohne jegliche Gewährleistung bereitgestellt. Wir achten darauf, dass jedes Tool korrekt und zuverlässig arbeitet, aber du bist selbst dafür verantwortlich, Ergebnisse zu prüfen, bevor du dich bei etwas Wichtigem darauf verlässt.",
      acceptableUseHeading: "Zulässige Nutzung",
      acceptableUseBody:
        "Nutze die Tools für legale Zwecke. Du bist verantwortlich für den Inhalt, den du bearbeitest, und für die Einhaltung aller dafür geltenden Gesetze.",
      changesHeading: "Änderungen dieser Bedingungen",
      changesBody:
        "Wir aktualisieren diese Bedingungen möglicherweise, während sich das Projekt weiterentwickelt. Nutzt du BrowseryTools nach einer Änderung weiter, akzeptierst du die neuen Bedingungen.",
      contactHeading: "Fragen",
      contactBody: "Fragen zu diesen Bedingungen sind willkommen — erreiche uns über GitHub.",
    },
  },

  ru: {
    nav: { license: "Лицензия", privacy: "Конфиденциальность", terms: "Условия" },
    common: {
      contactLinkText: "Открыть issue на GitHub",
      licenseLinkText: "Прочитать лицензию AGPL-3.0",
    },
    privacy: {
      title: "Политика конфиденциальности",
      intro:
        "BrowseryTools устроен так, что вашим файлам просто незачем покидать ваше устройство. Эта страница простыми словами объясняет, что это значит и как мало данных мы вообще собираем.",
      noAccountsHeading: "Без аккаунтов и входа",
      noAccountsBody:
        "Регистрироваться не нужно. Мы не спрашиваем имя, e-mail или платёжные данные и нигде не создаём ваш профиль.",
      onDeviceHeading: "Ваши файлы никогда не покидают устройство",
      onDeviceBody:
        "Каждый инструмент работает полностью в вашем браузере. Изображения, документы и текст, которые вы обрабатываете, читаются, преобразуются и скачиваются локально — ничего никогда не загружается на сервер. Убедиться в этом легко: откройте вкладку «Сеть» в браузере во время работы с любым инструментом.",
      analyticsHeading: "Агрегированная статистика использования",
      analyticsBody:
        "Мы используем Vercel Analytics, чтобы видеть, какие страницы и инструменты популярны. Он показывает только анонимные, агрегированные цифры — просмотры страниц и примерное количество использований — но никогда не содержимое того, что вы обрабатываете, и ничего, что можно связать лично с вами.",
      localStorageHeading: "Локальные настройки",
      localStorageBody:
        "Некоторые инструменты запоминают ваши настройки — например, тему оформления или список недавних действий — с помощью локального хранилища браузера. Эти данные остаются только на вашем устройстве и никуда не передаются.",
      openSourceHeading: "Открытый код от начала до конца",
      openSourceBody:
        "Весь код открыт и доступен на GitHub. Если хотите точно знать, что инструмент делает с вашими данными, можете сами прочитать исходный код, а не просто верить нам на слово.",
      contactHeading: "Вопросы",
      contactBody: "Если что-то здесь непонятно, быстрее всего связаться с нами через GitHub.",
      changesHeading: "Изменения в этой политике",
      changesBody:
        "Если эта политика когда-нибудь изменится, мы обновим эту страницу. Поскольку мы не собираем e-mail адреса, уведомить вас напрямую мы не сможем — заглядывайте сюда сами, если интересно.",
    },
    terms: {
      title: "Условия использования",
      intro:
        "BrowseryTools — свободное программное обеспечение. Используя его, вы соглашаетесь со следующим — и это короче, чем кажется.",
      licenseHeading: "Лицензия с открытым исходным кодом",
      licenseBody:
        "Код распространяется по лицензии GNU Affero General Public License v3.0 (AGPL-3.0). Вы вправе читать его, форкать и запускать свою собственную копию на условиях этой лицензии.",
      freeHeading: "Бесплатно для всех",
      freeBody:
        "Каждый инструмент бесплатен — как для личных, так и для коммерческих проектов. Никаких платных стен, никаких лимитов использования, никакого премиум-уровня, скрывающего лучшие функции.",
      warrantyHeading: "Без гарантий",
      warrantyBody:
        "BrowseryTools предоставляется «как есть», без каких-либо гарантий. Мы стараемся, чтобы каждый инструмент оставался точным и надёжным, но проверка результатов перед тем, как полагаться на них в чём-то важном, — ваша ответственность.",
      acceptableUseHeading: "Допустимое использование",
      acceptableUseBody:
        "Используйте инструменты в законных целях. Вы отвечаете за содержимое, которое обрабатываете, и за соблюдение применимых к нему законов.",
      changesHeading: "Изменения этих условий",
      changesBody:
        "Мы можем обновлять эти условия по мере развития проекта. Продолжая использовать BrowseryTools после изменений, вы принимаете новые условия.",
      contactHeading: "Вопросы",
      contactBody: "Будем рады вопросам об этих условиях — напишите нам на GitHub.",
    },
  },

  id: {
    nav: { license: "Lisensi", privacy: "Privasi", terms: "Ketentuan" },
    common: {
      contactLinkText: "Buka issue di GitHub",
      licenseLinkText: "Baca lisensi AGPL-3.0",
    },
    privacy: {
      title: "Kebijakan Privasi",
      intro:
        "BrowseryTools dibuat agar berkas Anda tidak pernah perlu meninggalkan perangkat Anda. Halaman ini menjelaskan, dengan bahasa sederhana, apa artinya itu dan sedikit data yang benar-benar kami kumpulkan.",
      noAccountsHeading: "Tanpa akun, tanpa masuk",
      noAccountsBody:
        "Tidak ada yang perlu didaftarkan. Kami tidak meminta nama, email, atau data pembayaran Anda, dan kami tidak membuat profil Anda di mana pun.",
      onDeviceHeading: "Berkas Anda tidak pernah meninggalkan perangkat",
      onDeviceBody:
        "Setiap alat berjalan sepenuhnya di peramban Anda. Gambar, dokumen, dan teks yang Anda proses dibaca, diubah, dan diunduh secara lokal — tidak ada yang diunggah ke server, tidak pernah. Anda bisa memeriksanya sendiri: buka tab jaringan peramban saat menggunakan alat apa pun.",
      analyticsHeading: "Analitik penggunaan agregat",
      analyticsBody:
        "Kami menggunakan Vercel Analytics untuk melihat halaman dan alat mana yang populer. Yang dilaporkan hanya angka anonim dan agregat — jumlah kunjungan halaman dan perkiraan penggunaan — tidak pernah konten yang Anda proses, dan tidak pernah sesuatu yang terkait dengan Anda secara pribadi.",
      localStorageHeading: "Preferensi lokal",
      localStorageBody:
        "Beberapa alat mengingat pengaturan Anda — seperti tema atau daftar terbaru — menggunakan penyimpanan lokal peramban Anda. Data itu hanya tersimpan di perangkat Anda dan tidak pernah dikirim ke mana pun.",
      openSourceHeading: "Sumber terbuka sepenuhnya",
      openSourceBody:
        "Seluruh kode tersedia untuk umum di GitHub. Jika ingin tahu persis apa yang dilakukan sebuah alat terhadap data Anda, Anda bisa membaca sendiri kode sumbernya, bukan hanya percaya pada kata-kata kami.",
      contactHeading: "Pertanyaan",
      contactBody: "Jika ada yang kurang jelas di sini, cara tercepat menghubungi kami adalah lewat GitHub.",
      changesHeading: "Perubahan pada kebijakan ini",
      changesBody:
        "Jika kebijakan ini berubah suatu saat, kami akan memperbarui halaman ini. Karena kami tidak mengumpulkan email, kami tidak punya cara memberi tahu Anda langsung — kunjungi lagi halaman ini kalau penasaran.",
    },
    terms: {
      title: "Ketentuan Penggunaan",
      intro:
        "BrowseryTools adalah perangkat lunak bebas. Dengan menggunakannya, inilah yang Anda setujui — dan lebih singkat dari dugaan Anda.",
      licenseHeading: "Lisensi sumber terbuka",
      licenseBody:
        "Kode ini dilisensikan di bawah GNU Affero General Public License v3.0 (AGPL-3.0). Anda bebas membacanya, melakukan fork, dan menjalankan salinan Anda sendiri, sesuai ketentuan lisensi tersebut.",
      freeHeading: "Gratis untuk semua orang",
      freeBody:
        "Setiap alat gratis digunakan, baik untuk proyek pribadi maupun komersial. Tanpa paywall, tanpa batas penggunaan, tanpa tingkatan premium yang menyembunyikan fitur terbaik.",
      warrantyHeading: "Tanpa jaminan",
      warrantyBody:
        "BrowseryTools disediakan apa adanya, tanpa jaminan dalam bentuk apa pun. Kami berupaya menjaga setiap alat tetap akurat dan andal, tetapi Anda bertanggung jawab memverifikasi hasilnya sebelum mengandalkannya untuk hal yang penting.",
      acceptableUseHeading: "Penggunaan yang wajar",
      acceptableUseBody:
        "Gunakan alat-alat ini untuk tujuan yang sah. Anda bertanggung jawab atas konten yang Anda proses dan atas kepatuhan terhadap hukum yang berlaku untuknya.",
      changesHeading: "Perubahan pada ketentuan ini",
      changesBody:
        "Kami dapat memperbarui ketentuan ini seiring perkembangan proyek. Terus menggunakan BrowseryTools setelah ada perubahan berarti Anda menerima ketentuan yang baru.",
      contactHeading: "Pertanyaan",
      contactBody: "Pertanyaan seputar ketentuan ini sangat kami sambut — hubungi kami di GitHub.",
    },
  },

  "zh-CN": {
    nav: { license: "许可协议", privacy: "隐私", terms: "条款" },
    common: {
      contactLinkText: "在 GitHub 上提交 issue",
      licenseLinkText: "阅读 AGPL-3.0 许可协议",
    },
    privacy: {
      title: "隐私政策",
      intro:
        "BrowseryTools 的设计让你的文件根本没有理由离开你的设备。这个页面用简单的话说明这意味着什么，以及我们究竟收集了哪些少量数据。",
      noAccountsHeading: "无需账号，无需登录",
      noAccountsBody:
        "没有任何东西需要注册。我们不会要求你的姓名、邮箱或支付信息，也不会在任何地方为你建立档案。",
      onDeviceHeading: "你的文件从不离开你的设备",
      onDeviceBody:
        "每个工具都完全在你的浏览器中运行。你处理的图片、文档和文本都在本地读取、转换和下载——没有任何内容会上传到服务器，一次都没有。你可以自己验证：使用任意工具时打开浏览器的网络面板看看。",
      analyticsHeading: "聚合使用统计",
      analyticsBody:
        "我们使用 Vercel Analytics 来了解哪些页面和工具更受欢迎。它只报告匿名的聚合数字——页面浏览量和大致使用量——绝不包含你处理的内容，也绝不包含任何能与你个人对应起来的信息。",
      localStorageHeading: "本地偏好设置",
      localStorageBody:
        "部分工具会通过浏览器的本地存储记住你的设置，比如主题或最近使用的列表。这些数据只保存在你的设备上，从不会被传输到任何地方。",
      openSourceHeading: "从头到尾开源",
      openSourceBody:
        "全部代码都公开在 GitHub 上。如果你想确切知道某个工具如何处理你的数据，可以自己阅读源代码，而不必只相信我们说的话。",
      contactHeading: "有疑问",
      contactBody: "如果这里有任何不清楚的地方，联系我们最快的方式是 GitHub。",
      changesHeading: "本政策的变更",
      changesBody:
        "如果这份政策以后有变化，我们会更新这个页面。由于我们不收集邮箱地址，没有办法直接通知你——有兴趣的话欢迎回来看看。",
    },
    terms: {
      title: "使用条款",
      intro: "BrowseryTools 是自由软件。使用它，即表示你同意以下内容——比你想象的要短。",
      licenseHeading: "开源许可协议",
      licenseBody:
        "代码采用 GNU Affero 通用公共许可证 v3.0（AGPL-3.0）授权。你可以自由阅读、fork 并运行自己的副本，只需遵守该许可协议的条款。",
      freeHeading: "对所有人免费",
      freeBody:
        "每个工具都免费使用，个人项目和商业项目一视同仁。没有付费墙，没有使用次数限制，也没有把好功能藏起来的高级版本。",
      warrantyHeading: "不提供任何担保",
      warrantyBody:
        "BrowseryTools 按“原样”提供，不附带任何形式的担保。我们努力让每个工具都准确可靠，但在把结果用于任何重要事情之前，验证结果是你自己的责任。",
      acceptableUseHeading: "可接受的使用方式",
      acceptableUseBody:
        "请将这些工具用于合法目的。你要对自己处理的内容负责，并遵守适用于该内容的相关法律。",
      changesHeading: "本条款的变更",
      changesBody:
        "随着项目的发展，我们可能会更新这些条款。变更后继续使用 BrowseryTools，即表示你接受新的条款。",
      contactHeading: "有疑问",
      contactBody: "欢迎就这些条款提出问题——在 GitHub 上联系我们。",
    },
  },
};

for (const [locale, Legal] of Object.entries(BY_LOCALE)) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));

  json.Legal = Legal;

  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}

console.log("injected Legal i18n into", Object.keys(BY_LOCALE).length, "locales");
