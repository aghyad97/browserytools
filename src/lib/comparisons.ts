// ──────────────────────────────────────────────────────────────────────────────
// "Free alternative to X" comparison pages.
//
// EDITORIAL RULES — read before changing anything in this file.
//
// 1. Every claim about a competitor must trace to that competitor's OWN public
//    pages (pricing, docs, help centre, privacy policy). A source URL goes in a
//    comment next to the claim. Third-party blogs and review sites are not
//    acceptable sources. Nothing here may be written from memory.
// 2. Anything that could not be confirmed on their own site is marked
//    `TODO(verify)` in a comment right above the claim, and the on-page wording
//    is hedged so the page never asserts something unverified.
// 3. Prices and free-tier limits are the highest-risk claims on these pages —
//    they change constantly. Each entry carries `checkedOn`, which the page
//    renders, and every price is flagged TODO(verify) on principle.
// 4. `theirEdge` is not a token "cons" row. It must name specific, substantive
//    things the paid product genuinely does better. A page that says we win
//    everywhere is worthless and will be disbelieved.
// 5. `ourLimits` is drawn from the hand-verified `limitations` field in
//    src/lib/tool-content.ts. Do not soften it.
// 6. Accuracy about ourselves: the honest claim is that the user's CONTENT is
//    never uploaded. It is NOT true that nothing ever leaves the device —
//    the Transformers.js tools fetch model weights from the Hugging Face CDN on
//    first use, and Image to Text loads Tesseract language data from the
//    tessdata CDN. There is also no service worker, so no page here may claim
//    the site works offline.
// 7. Third-party names are used nominatively for comparison only. No logos, no
//    implied affiliation or endorsement, no disparagement — state facts.
// 8. No fabricated benchmarks. If a speed or size claim is not measured and
//    described, it does not go on the page.
//
// `theirEdge` and `ourLimits` are deliberately NEVER fed to JSON-LD. They are
// prose for humans, not structured claims.
// ──────────────────────────────────────────────────────────────────────────────

export interface ComparisonFaq {
  q: string;
  a: string;
}

/** Which side genuinely wins a given row. `mixed` = depends on the job. */
export type ComparisonEdge = "us" | "them" | "mixed";

export interface ComparisonRow {
  /** Stable React key. */
  key: string;
  /** The thing being compared, e.g. "Where your file is processed". */
  aspect: string;
  /** What BrowseryTools actually does. */
  us: string;
  /** What the competitor actually does, per their own published pages. */
  them: string;
  edge: ComparisonEdge;
}

export interface ComparisonLocale {
  /** Page <h1>. */
  heading: string;
  /** Lead paragraphs, split on "\n\n". */
  intro: string;
  rows: ComparisonRow[];
  /** Substantive, specific things the competitor does better. Never JSON-LD. */
  theirEdge: string[];
  /** Our honest weaknesses, from tool-content.ts `limitations`. Never JSON-LD. */
  ourLimits: string[];
  /** Plain recommendation, split on "\n\n". */
  verdict: string;
  faq: ComparisonFaq[];
}

export interface Comparison {
  /** URL segment: /alternatives/<slug>. */
  slug: string;
  /** Trademark, rendered as-is in every locale. */
  competitor: string;
  /** Unique <title>. Not the shared tool-metadata template. */
  metaTitle: string;
  /** Unique meta description. */
  metaDescription: string;
  /** Tool slugs (without /tools/) this page is actually about. */
  tools: string[];
  /** Other comparison slugs to cross-link. */
  related: string[];
  /** ISO date the competitor's own pages were last read. Rendered on-page. */
  checkedOn: string;
  /** First-party sources cited on-page. */
  sources: { label: string; url: string }[];
  en: ComparisonLocale;
  ar: ComparisonLocale;
}

// Date every competitor page below was fetched and read.
const CHECKED = "2026-07-31";

// ──────────────────────────────────────────────────────────────────────────────
// iLovePDF
// Sources read 2026-07-31:
//   https://www.ilovepdf.com/pricing
//   https://www.ilovepdf.com
//   https://www.ilovepdf.com/compress_pdf
//   https://developer.ilovepdf.com  (301 → https://www.iloveapi.com/)
//   https://www.ilovepdf.com/help/faq  (read 2026-08-02)
// Retention RESOLVED 2026-08-02: /faq and /privacy_policy 404'd on 2026-07-31,
//   but /help/faq is live and states, in their own words: "We just keep them
//   for a maximum of 2 hours so you can download them. Right after, they are
//   completely removed forever from our servers." That confirms the web tools
//   upload to their servers and gives a first-party retention window, quoted
//   verbatim below rather than paraphrased. The FAQ still says nothing about
//   free-tier file-size or task limits, so none are claimed here.
// ──────────────────────────────────────────────────────────────────────────────
const ilovepdf: Comparison = {
  slug: "ilovepdf",
  competitor: "iLovePDF",
  metaTitle:
    "A free iLovePDF alternative that doesn't upload your files",
  metaDescription:
    "An honest comparison: our PDF tools run in your browser tab and never upload the document, but iLovePDF wins on OCR, batch, an API and e-signatures. Where each one is genuinely better.",
  tools: [
    "compress-pdf",
    "merge-pdf",
    "split-pdf",
    "rotate-pdf",
    "jpg-to-pdf",
    "sign-pdf",
    "pdf-to-word",
    "extract-text-from-pdf",
  ],
  related: ["smallpdf", "tinypng"],
  checkedOn: CHECKED,
  sources: [
    { label: "iLovePDF pricing", url: "https://www.ilovepdf.com/pricing" },
    { label: "iLovePDF home", url: "https://www.ilovepdf.com" },
    { label: "iLovePDF Compress PDF", url: "https://www.ilovepdf.com/compress_pdf" },
    { label: "iLoveAPI (their REST API)", url: "https://www.iloveapi.com/" },
  ],
  en: {
    heading: "A free iLovePDF alternative that never uploads your document",
    intro:
      "If you landed here you probably asked some version of: is there a free tool like iLovePDF that doesn't send my PDF to somebody's server? Yes — our PDF tools do the work inside your browser tab, using JavaScript running on your own machine. The document is read, changed and saved locally. It is never uploaded, there is no account, and there is nothing to pay.\n\nThat is a real difference and it is the whole pitch. It is also a narrow one. On several jobs iLovePDF is simply better than us, and this page says exactly where, because a comparison that claims we win everywhere would be worth nothing to you.",
    rows: [
      {
        key: "processing",
        aspect: "Where your document is processed",
        us: "In the browser tab, on your machine. The PDF is parsed and rewritten locally and is never sent anywhere. You can confirm it yourself in your browser's network panel.",
        // Retention quoted verbatim from their own /help/faq (read 2026-08-02).
        them: "On their servers. Their FAQ states that uploaded files are kept \"for a maximum of 2 hours so you can download them\" and are then \"completely removed forever from our servers\". Their homepage separately positions the Desktop app as the way to \"work offline\" and \"manage documents locally, with no internet\" — which is what the browser tools are not.",
        edge: "us",
      },
      {
        key: "price",
        aspect: "Price and account",
        us: "Free, with no plan and no sign-in. We never ask for an email or a card, because there is no server bill to cover.",
        // Re-read from ilovepdf.com/pricing on 2026-08-02 and unchanged: $7/mo
        // monthly, $48/yr (shown as $4/mo), Premium 1-25 users, Business 25+
        // custom. Subscription pricing moves — re-check periodically.
        them: "A free tier, plus a Premium subscription listed at $7/month billed monthly or $48/year (shown as $4/month), covering 1–25 users, and a custom-priced Business plan for 25+ users (prices read from their pricing page on the date shown above).",
        edge: "us",
      },
      {
        key: "limits",
        aspect: "Limits on a free file",
        us: "No plan quota and no task counter. The real ceiling is your device: everything is held in memory on the page's main thread, so a very large scan can make the tab unresponsive or run out of memory on a phone.",
        them: "Free-tier caps published per tool — file-size limits in the region of 100 MB to 400 MB depending on the tool, and task allowances that also vary by tool.",
        edge: "mixed",
      },
      {
        key: "compression",
        aspect: "PDF compression quality",
        us: "Rasterizing only. Every page is re-encoded as a JPEG image, so the text layer is destroyed — you cannot select, copy or search the result and a screen reader can no longer read it. On a lean text PDF the output can come out larger than the input.",
        // TODO(verify): iLovePDF publishes the three level names but not the
        // method. Do NOT assert that their output keeps selectable text until
        // that is confirmed in their own documentation.
        them: "Three levels are offered — Extreme, Recommended and Less compression. Their pages name the levels but do not describe the method, so we make no claim about what their output preserves.",
        edge: "them",
      },
      {
        key: "ocr",
        aspect: "Scanned pages and OCR",
        us: "Our Image to Text tool runs Tesseract locally and accepts PDFs, so scanned pages can be read on-device. It is an open-source engine, not a hosted one, and it downloads its language data from the tessdata CDN the first time you pick a language.",
        them: "OCR is a paid feature. Their pricing page lists PDF to Word (OCR) and PDF to Excel (OCR) as Premium, and the plan includes what they call advanced OCR for scanned documents.",
        edge: "them",
      },
      {
        key: "automation",
        aspect: "Batch work and automation",
        us: "One file at a time, by hand, in a tab. No API, no queue, no watch folder, no command line.",
        them: "A REST API (iLoveAPI), a desktop app their homepage describes as batch editing documents locally with no limits, and iOS and Android apps.",
        edge: "them",
      },
      {
        key: "signing",
        aspect: "Signatures",
        us: "Our Sign PDF tool draws your signature onto the page and saves the file. That is a picture of a signature — there is no identity check, no audit trail, and no way to send a document to someone else for signing.",
        them: "A Sign PDF tool plus a separate e-signing product, and their Premium tier advertises requesting secure e-signatures from other people.",
        edge: "them",
      },
    ],
    theirEdge: [
      "OCR on scanned documents. This is the clearest gap. A photographed or scanned page has no text in it at all, and turning it into searchable, selectable text is the single most valuable thing a PDF service does. iLovePDF sells that as a Premium feature; we can only offer a local Tesseract run through a separate tool, which is a different and generally weaker engine than a tuned server pipeline.",
      "A REST API. iLovePDF runs iLoveAPI as a separate developer product, so PDF work can be automated from a backend, a cron job or a CI pipeline. We have no API of any kind and no plan for one — every one of our tools requires a human with a browser open.",
      "Batch processing without babysitting. Their desktop app is described on their own homepage as batch editing and managing documents locally with no limits. Ours processes one file at a time on the page's main thread, with no queue and no cancel button, and a long job will freeze the tab while it runs.",
      "Real e-signature workflows. Sending a document to a counterparty, tracking whether they signed, and keeping an audit trail is a product, not a feature. We draw a signature image onto a page. If the signature has to hold up to scrutiny, we are not the tool.",
      "Native mobile and desktop apps. They ship iOS and Android apps and a desktop app. We are a website, and on a phone the memory ceiling is genuinely low — a big scanned PDF can simply fail in a mobile browser tab.",
      "Formats and conversions we do not have at all. Their paid tier lists PDF/A conversion, PDF to Excel, PDF translation and an AI summarizer. We have none of those.",
    ],
    ourLimits: [
      "Compress PDF rasterizes and nothing else. Once compressed, the text cannot be selected, copied or searched, screen readers can no longer read the document, and links, form fields and annotations are gone. There is no option to keep the text layer and no OCR to put one back.",
      "On a lean text or vector PDF, our compressor's output can be larger than the input — a page of type becomes a full-page photograph. The tool still reports that as a success with a negative reduction percentage, so check the before and after numbers rather than assuming it worked.",
      "Merge PDF copies pages only. A source file's bookmarks and outline, its document-level form definition and any embedded attachments are not rebuilt, so interactive forms may stop working. Password-protected PDFs cannot be opened at all and are reported with a generic \"Invalid PDF file\" message rather than saying a password is the problem.",
      "Everything runs on the page's main thread with the whole file in memory and no progress bar. Hundreds of megabytes of scans can make the tab unresponsive or run out of memory, especially on a phone or a low-RAM laptop.",
      "Your document is never uploaded — but that is not the same as nothing leaving your device. Our OCR tool downloads Tesseract language data from the tessdata CDN the first time you use a language, and our AI tools fetch model files from a CDN on first run. There is also no service worker, so the site does not work offline.",
    ],
    verdict:
      "Use our tools when the job is small and specific and the file is sensitive: merging a few PDFs, rotating pages, pulling a page range out, turning photos into a PDF, or squeezing a scan under an upload limit. Nothing is uploaded, there is no account, and it costs nothing.\n\nDo not use our compressor on a text document you still need to search. It will flatten your PDF into pictures and may even make it bigger. That is the case where a server-side tool that recompresses the embedded images and leaves the text layer alone is doing something we genuinely cannot do.\n\nAnd if you need OCR on scanned pages, an API, unattended batch processing, or a signature workflow with an audit trail, pay for a service. Those are not near-misses for us — we simply do not have them.",
    faq: [
      {
        q: "Is there a free alternative to iLovePDF that doesn't upload my files?",
        a: "Yes. Our PDF tools run entirely inside your browser tab — the file is read and rewritten by JavaScript on your own machine and is never sent to a server. There is no account and no payment. You can verify it by opening your browser's network panel while you use a tool.",
      },
      {
        q: "Will a PDF compressed with your tool still be searchable?",
        a: "No. Our compressor rasterizes every page into a JPEG image, which destroys the text layer. The result cannot be selected, copied or searched, and screen readers cannot read it. If you need the text to survive, use a server-side compressor that recompresses embedded images instead.",
      },
      {
        q: "Can you OCR a scanned PDF?",
        a: "Partly. Our separate Image to Text tool accepts PDFs and runs the open-source Tesseract engine locally on your machine. It is a genuinely useful fallback, but it is a different engine from a tuned hosted OCR pipeline and it downloads its language data from a CDN the first time you pick a language.",
      },
      {
        q: "Is there a file size limit?",
        a: "There is no plan quota, but there is a practical one. Files are held in memory and processed on the page's main thread, so very large documents can make the tab unresponsive or fail outright, particularly on a phone.",
      },
      {
        q: "Do you have an API?",
        a: "No. Every tool needs a person with a browser. If you need to automate PDF work from a server or a build pipeline, a hosted API is the right choice.",
      },
      {
        q: "Are you affiliated with iLovePDF?",
        a: "No. This is an independent comparison written from their publicly published pages on the date shown above. We are not affiliated with, sponsored by, or endorsed by them.",
      },
    ],
  },
  ar: {
    heading: "بديل مجاني لـ iLovePDF لا يرفع ملفك إطلاقاً",
    intro:
      "على الأرجح وصلت إلى هنا وأنت تسأل: هل هناك أداة مجانية مثل iLovePDF لا ترسل ملف PDF الخاص بي إلى خادم أحدهم؟ نعم — أدوات PDF لدينا تعمل داخل تبويب المتصفح عبر JavaScript يعمل على جهازك أنت. يُقرأ الملف ويُعدَّل ويُحفَظ محلياً، ولا يُرفع أبداً، ولا يوجد حساب، ولا شيء تدفعه.\n\nهذا فرق حقيقي وهو جوهر ما نقدّمه. لكنه فرق ضيّق أيضاً. في عدة مهام تتفوّق iLovePDF علينا ببساطة، وهذه الصفحة تقول لك بالضبط أين، لأن مقارنة تدّعي أننا الأفضل في كل شيء لا تساوي شيئاً.",
    rows: [
      {
        key: "processing",
        aspect: "أين تُعالَج المستندات",
        us: "داخل تبويب المتصفح على جهازك. يُحلَّل ملف PDF ويُعاد بناؤه محلياً ولا يُرسل إلى أي مكان. يمكنك التأكد بنفسك من لوحة الشبكة في المتصفح.",
        them: "على خوادمهم. تنصّ صفحة الأسئلة الشائعة لديهم على أنّ الملفات المرفوعة تُحفَظ «لمدة ساعتين كحدّ أقصى كي تتمكّن من تنزيلها»، ثم «تُحذَف نهائياً وإلى الأبد من خوادمنا». كما تقدّم صفحتهم الرئيسية تطبيق سطح المكتب المنفصل بوصفه الطريقة «للعمل دون اتصال» و«إدارة المستندات محلياً بلا إنترنت» — وهو ما لا تفعله أدوات المتصفح لديهم.",
        edge: "us",
      },
      {
        key: "price",
        aspect: "السعر والحساب",
        us: "مجاني بالكامل، بلا خطة وبلا تسجيل دخول. لا نطلب بريداً إلكترونياً ولا بطاقة، لأنه لا توجد فاتورة خوادم نغطّيها.",
        them: "طبقة مجانية، إضافة إلى اشتراك Premium مُدرَج بسعر 7 دولارات شهرياً أو 48 دولاراً سنوياً (أي ما يعادل 4 دولارات شهرياً) ويغطي من مستخدم واحد إلى 25 مستخدماً، وخطة Business بسعر مخصّص لـ 25 مستخدماً فأكثر (أسعار مقروءة من صفحة أسعارهم بالتاريخ المذكور أعلاه).",
        edge: "us",
      },
      {
        key: "limits",
        aspect: "حدود الملف المجاني",
        us: "لا حصة خطة ولا عدّاد مهام. السقف الحقيقي هو جهازك: كل شيء يُحمَّل في الذاكرة على الخيط الرئيسي للصفحة، فقد يتوقف التبويب عن الاستجابة أو تنفد الذاكرة على الهاتف مع ملف ممسوح ضخم.",
        them: "حدود منشورة لكل أداة في الطبقة المجانية — سقوف لحجم الملف تتراوح تقريباً بين 100 و400 ميغابايت حسب الأداة، وحصص مهام تختلف بدورها حسب الأداة.",
        edge: "mixed",
      },
      {
        key: "compression",
        aspect: "جودة ضغط PDF",
        us: "تحويل إلى صور فقط. كل صفحة يُعاد ترميزها كصورة JPEG، فتُدمَّر طبقة النص — لا يمكنك تحديد النص أو نسخه أو البحث فيه، ولا يستطيع قارئ الشاشة قراءته. ومع ملف نصي خفيف قد يخرج الناتج أكبر من الأصل.",
        them: "ثلاثة مستويات: ضغط أقصى، وضغط موصى به، وضغط أقل. صفحاتهم تذكر أسماء المستويات دون وصف الطريقة، لذلك لا ندّعي شيئاً عمّا يحافظ عليه ناتجهم.",
        edge: "them",
      },
      {
        key: "ocr",
        aspect: "الصفحات الممسوحة والتعرّف الضوئي",
        us: "أداة Image to Text لدينا تشغّل محرك Tesseract محلياً وتقبل ملفات PDF، فتُقرأ الصفحات الممسوحة على الجهاز. إنه محرك مفتوح المصدر لا خدمة مستضافة، ويُنزّل بيانات اللغة من مصدر tessdata في أول مرة تختار فيها لغة.",
        them: "التعرّف الضوئي ميزة مدفوعة. صفحة أسعارهم تُدرج PDF to Word (OCR) وPDF to Excel (OCR) ضمن Premium، وتتضمّن الخطة ما يسمّونه تعرّفاً ضوئياً متقدّماً للمستندات الممسوحة.",
        edge: "them",
      },
      {
        key: "automation",
        aspect: "المعالجة الدُفعية والأتمتة",
        us: "ملف واحد في كل مرة، يدوياً، داخل تبويب. لا واجهة برمجية، ولا طابور، ولا مجلد مراقَب، ولا سطر أوامر.",
        them: "واجهة برمجية REST باسم iLoveAPI، وتطبيق سطح مكتب تصفه صفحتهم الرئيسية بأنه يحرّر المستندات دفعةً واحدة محلياً بلا حدود، وتطبيقان لـ iOS وAndroid.",
        edge: "them",
      },
      {
        key: "signing",
        aspect: "التوقيعات",
        us: "أداة Sign PDF لدينا ترسم توقيعك على الصفحة وتحفظ الملف. هذه صورة توقيع — بلا تحقّق من الهوية، وبلا سجل تدقيق، وبلا وسيلة لإرسال المستند إلى شخص آخر ليوقّعه.",
        them: "أداة Sign PDF ومنتج توقيع إلكتروني منفصل، وتُعلن طبقة Premium لديهم عن طلب توقيعات إلكترونية آمنة من أشخاص آخرين.",
        edge: "them",
      },
    ],
    theirEdge: [
      "التعرّف الضوئي على المستندات الممسوحة. هذه أوضح فجوة. الصفحة المصوّرة أو الممسوحة لا تحتوي نصاً أصلاً، وتحويلها إلى نص قابل للبحث والتحديد هو أثمن ما تقدّمه خدمة PDF. تبيع iLovePDF ذلك ضمن Premium، بينما لا نملك سوى تشغيل Tesseract محلياً عبر أداة منفصلة، وهو محرك مختلف وأضعف عموماً من منظومة خادم مضبوطة.",
      "واجهة برمجية REST. تُشغّل iLovePDF منتج iLoveAPI المنفصل للمطورين، فيمكن أتمتة أعمال PDF من خادم خلفي أو مهمة مجدولة أو خط تكامل مستمر. نحن لا نملك أي واجهة برمجية ولا نخطط لواحدة — كل أدواتنا تتطلّب إنساناً أمام متصفح مفتوح.",
      "المعالجة الدفعية دون متابعة. تطبيق سطح المكتب لديهم موصوف على صفحتهم الرئيسية بأنه يحرّر ويدير المستندات دفعةً محلياً بلا حدود. أما أدواتنا فتعالج ملفاً واحداً في كل مرة على الخيط الرئيسي للصفحة، بلا طابور وبلا زر إلغاء، وقد تُجمّد المهمة الطويلة التبويب طوال تشغيلها.",
      "مسارات توقيع إلكتروني حقيقية. إرسال مستند إلى طرف آخر، وتتبّع ما إذا وقّعه، والاحتفاظ بسجل تدقيق — هذا منتج كامل لا ميزة. نحن نرسم صورة توقيع على صفحة. إن كان التوقيع سيخضع للتدقيق، فلسنا الأداة المناسبة.",
      "تطبيقات أصلية للهاتف وسطح المكتب. لديهم تطبيقات iOS وAndroid وتطبيق سطح مكتب. نحن موقع ويب، وسقف الذاكرة على الهاتف منخفض فعلاً — قد يفشل ملف PDF ممسوح كبير ببساطة داخل تبويب متصفح جوال.",
      "صيغ وتحويلات لا نملكها إطلاقاً. تُدرج طبقتهم المدفوعة تحويل PDF/A، وPDF إلى Excel، وترجمة PDF، ومُلخِّصاً بالذكاء الاصطناعي. لا نملك أياً منها.",
    ],
    ourLimits: [
      "أداة ضغط PDF لدينا تحوّل الصفحات إلى صور ولا شيء غير ذلك. بعد الضغط لا يمكن تحديد النص أو نسخه أو البحث فيه، ولا تستطيع قارئات الشاشة قراءة المستند، وتختفي الروابط وحقول النماذج والتعليقات. لا خيار للإبقاء على طبقة النص ولا تعرّف ضوئي يعيدها.",
      "مع ملف PDF نصي أو متجهي خفيف، قد يخرج الناتج أكبر من المدخل — صفحة نص تتحوّل إلى صورة فوتوغرافية كاملة. ورغم ذلك تعلن الأداة نجاح العملية مع نسبة تقليص سالبة، فتحقّق من الأرقام قبل وبعد بدل افتراض أنها نجحت.",
      "أداة دمج PDF تنسخ الصفحات فقط. الإشارات المرجعية والفهرس، وتعريف النموذج على مستوى المستند، وأي مرفقات مضمّنة لا يُعاد بناؤها، فقد تتوقّف النماذج التفاعلية عن العمل. أما ملفات PDF المحمية بكلمة مرور فلا يمكن فتحها أصلاً، وتُبلَّغ برسالة عامة «ملف PDF غير صالح» بدل الإشارة إلى أن السبب كلمة مرور.",
      "كل شيء يعمل على الخيط الرئيسي للصفحة والملف بأكمله في الذاكرة وبلا شريط تقدّم. مئات الميغابايتات من الملفات الممسوحة قد تجعل التبويب غير مستجيب أو تستنفد الذاكرة، خصوصاً على هاتف أو حاسوب بذاكرة محدودة.",
      "مستندك لا يُرفع أبداً — لكن هذا لا يعني أن شيئاً لا يغادر جهازك. أداة التعرّف الضوئي لدينا تُنزّل بيانات لغة Tesseract من مصدر tessdata في أول استخدام للغة، وأدوات الذكاء الاصطناعي لدينا تجلب ملفات النماذج من شبكة توزيع محتوى في أول تشغيل. كما لا يوجد Service Worker، لذلك لا يعمل الموقع دون اتصال.",
    ],
    verdict:
      "استخدم أدواتنا حين تكون المهمة صغيرة ومحدّدة والملف حساساً: دمج بضعة ملفات PDF، أو تدوير صفحات، أو استخراج نطاق صفحات، أو تحويل صور إلى PDF، أو ضغط ملف ممسوح ليمرّ من حدّ رفع. لا شيء يُرفع، ولا حساب، ولا تكلفة.\n\nولا تستخدم أداة الضغط لدينا على مستند نصي ما زلت تحتاج للبحث فيه. ستحوّل ملفك إلى صور وقد تزيد حجمه. هنا تحديداً تفعل أداة الخادم — التي تعيد ضغط الصور المضمّنة وتترك طبقة النص كما هي — شيئاً لا نستطيعه فعلاً.\n\nوإن كنت تحتاج تعرّفاً ضوئياً على صفحات ممسوحة، أو واجهة برمجية، أو معالجة دفعية دون إشراف، أو مسار توقيع بسجل تدقيق، فادفع مقابل خدمة. هذه ليست فوارق طفيفة بالنسبة لنا — نحن ببساطة لا نملكها.",
    faq: [
      {
        q: "هل يوجد بديل مجاني لـ iLovePDF لا يرفع ملفاتي؟",
        a: "نعم. أدوات PDF لدينا تعمل بالكامل داخل تبويب المتصفح — يُقرأ الملف ويُعاد بناؤه عبر JavaScript على جهازك ولا يُرسل إلى خادم إطلاقاً. لا حساب ولا دفع. ويمكنك التحقّق بفتح لوحة الشبكة في متصفحك أثناء الاستخدام.",
      },
      {
        q: "هل يبقى ملف PDF المضغوط بأداتكم قابلاً للبحث؟",
        a: "لا. أداة الضغط لدينا تحوّل كل صفحة إلى صورة JPEG، وهذا يدمّر طبقة النص. لا يمكن تحديد الناتج أو نسخه أو البحث فيه، ولا تستطيع قارئات الشاشة قراءته. إن كنت تحتاج بقاء النص، فاستخدم أداة ضغط على الخادم تعيد ضغط الصور المضمّنة بدلاً من ذلك.",
      },
      {
        q: "هل يمكنكم إجراء تعرّف ضوئي على ملف PDF ممسوح؟",
        a: "جزئياً. أداة Image to Text المنفصلة لدينا تقبل ملفات PDF وتشغّل محرك Tesseract مفتوح المصدر محلياً على جهازك. إنه بديل مفيد فعلاً، لكنه محرك مختلف عن منظومة تعرّف ضوئي مستضافة ومضبوطة، وينزّل بيانات اللغة من شبكة توزيع محتوى في أول اختيار للغة.",
      },
      {
        q: "هل هناك حد لحجم الملف؟",
        a: "لا توجد حصة خطة، لكن هناك حدّاً عملياً. تُحمَّل الملفات في الذاكرة وتُعالَج على الخيط الرئيسي للصفحة، فقد تجعل المستندات الكبيرة جداً التبويب غير مستجيب أو تفشل تماماً، خصوصاً على الهاتف.",
      },
      {
        q: "هل لديكم واجهة برمجية؟",
        a: "لا. كل أداة تحتاج شخصاً أمام متصفح. إن كنت تريد أتمتة أعمال PDF من خادم أو خط بناء، فالواجهة البرمجية المستضافة هي الخيار الصحيح.",
      },
      {
        q: "هل أنتم على صلة بـ iLovePDF؟",
        a: "لا. هذه مقارنة مستقلة كُتبت من صفحاتهم المنشورة علناً بالتاريخ المذكور أعلاه. لا تربطنا بهم أي علاقة انتساب أو رعاية أو تأييد.",
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Smallpdf
// Sources read 2026-07-31:
//   https://smallpdf.com/pricing
//   https://smallpdf.com/compress-pdf
//   https://smallpdf.com/trust-center
//   https://smallpdf.com/blog/is-smallpdf-safe   (their own blog, first-party)
// TODO(verify): Smallpdf's pricing page renders its numbers client-side — the
//   static HTML contains only a "{{price}}/year" template placeholder, so NO
//   price or currency could be read. Re-attempted 2026-08-02 (both /pricing and
//   /pricing?ref=plans): still no figures in the served text. This page
//   therefore states no Smallpdf price at all, which is the correct outcome —
//   do not add one without reading it off their live page in a real browser.
// TODO(verify): the free tier's numeric caps (daily downloads, file size, page
//   count) are labelled on the pricing table but carry no disclosed values in
//   the static page. The page below says only that the free plan is described
//   as limited, which is their own wording.
// ──────────────────────────────────────────────────────────────────────────────
const smallpdf: Comparison = {
  slug: "smallpdf",
  competitor: "Smallpdf",
  metaTitle:
    "A free Smallpdf alternative with no upload and no account",
  metaDescription:
    "Our PDF tools run in your browser and never upload the file. Smallpdf uploads to audited EU servers and deletes after an hour — and beats us on OCR, compression quality and batch. The honest comparison.",
  tools: [
    "compress-pdf",
    "merge-pdf",
    "split-pdf",
    "rotate-pdf",
    "jpg-to-pdf",
    "sign-pdf",
    "image-to-text",
    "extract-text-from-pdf",
  ],
  related: ["ilovepdf", "tinypng"],
  checkedOn: CHECKED,
  sources: [
    { label: "Smallpdf pricing", url: "https://smallpdf.com/pricing" },
    { label: "Smallpdf Compress PDF", url: "https://smallpdf.com/compress-pdf" },
    { label: "Smallpdf Trust Center", url: "https://smallpdf.com/trust-center" },
    { label: "Smallpdf: is Smallpdf safe", url: "https://smallpdf.com/blog/is-smallpdf-safe" },
  ],
  en: {
    heading: "A free Smallpdf alternative that never uploads your file",
    intro:
      "Our PDF tools run inside your browser tab. The document is parsed and rewritten by JavaScript on your own machine, it is never uploaded, there is no account, and there is nothing to pay.\n\nSmallpdf is worth being fair about, because it is not a careless service. They publish an ISO/IEC 27001 certification with annual audits, they say their servers are in Ireland under EU data law, they describe 256-bit TLS on transfer, and they state that files are permanently removed from their servers after one hour of processing. The difference is not that they are reckless with your file. The difference is that we never receive it, so there is no one-hour window to trust in the first place.\n\nAnd on several jobs they are straightforwardly better than us. Those are set out below in as much detail as the part where we win.",
    rows: [
      {
        key: "processing",
        aspect: "Where your document is processed",
        us: "In the browser tab, on your machine. Nothing is uploaded and nothing is stored — there is no server holding your file for any length of time, because there is no server in the path at all.",
        them: "Uploaded to their servers over TLS and processed there. They state their servers are in Ireland under EU data law and that files are permanently removed after one hour of processing.",
        edge: "us",
      },
      {
        key: "account",
        aspect: "Account and cost",
        us: "Free, permanently, with no sign-in and no usage counter. We do not have accounts to offer.",
        them: "Their compress page says you can try it free with no sign-up. The free plan is described in their own pricing table as having limited document downloads; Pro, Team and Business are paid subscriptions.",
        edge: "us",
      },
      {
        key: "compliance",
        aspect: "Certification and audit trail",
        us: "None. We hold no ISO certification, commission no external audit, and can hand you no compliance artifact. The argument is only that you can watch your own network panel and see that nothing is sent.",
        them: "ISO/IEC 27001 certified with annual audits, and they state compliance with GDPR, CCPA and nFADP. If a procurement or compliance process needs a certificate, they have one and we do not.",
        edge: "them",
      },
      {
        key: "compression",
        aspect: "PDF compression quality",
        us: "Rasterizing only. Every page is re-encoded as a JPEG image, so the text layer is destroyed — the result cannot be selected, copied or searched, screen readers cannot read it, and links, form fields and annotations are gone. On a lean text PDF the output can be larger than the input.",
        them: "Basic, Moderate and Strong levels, with Moderate and Strong on the paid tier. Their compress page states that document fonts remain unaffected and that all text styles, sizes and embedded fonts are fully preserved.",
        edge: "them",
      },
      {
        key: "ocr",
        aspect: "OCR on scanned pages",
        us: "Our separate Image to Text tool runs the open-source Tesseract engine locally and accepts PDFs. It downloads its language data from the tessdata CDN the first time you choose a language.",
        them: "OCR is listed among the features unlocked by the paid tier, alongside text editing and the AI tools.",
        edge: "them",
      },
      {
        key: "batch",
        aspect: "Batch work and where you can run it",
        us: "One file at a time, by hand, in a browser tab. No batch queue, no API, no desktop app, no extension, no mobile app.",
        them: "Batch Compress and Batch Convert on the paid tiers, a Windows desktop app, a Chrome extension, iOS and Android apps, and Google Workspace and Dropbox integrations.",
        edge: "them",
      },
      {
        key: "storage",
        aspect: "Keeping documents around",
        us: "Nothing is stored. That is the point, and it is also the cost: there is no history, no sync between your laptop and your phone, and no way to share a document with a colleague through us.",
        them: "Account storage that keeps documents across devices. They state that a file deleted from your online storage is removed from their servers within an hour.",
        edge: "mixed",
      },
      {
        key: "teams",
        aspect: "Teams",
        us: "Nothing. There is no concept of an organisation, a seat, an admin, or a shared workspace here.",
        them: "Team and Business tiers with member access management and centralised billing.",
        edge: "them",
      },
    ],
    theirEdge: [
      "A compliance story you can actually hand to someone. Smallpdf publishes an ISO/IEC 27001 certification with annual audits and states GDPR, CCPA and nFADP compliance. If your employer's security review needs a certificate and a signed processor agreement, we cannot produce either — a promise that the code runs locally is not an auditable artifact, no matter how true it is.",
      "PDF compression that keeps the document a document. Their compress page states that embedded fonts, text styles and sizes are fully preserved. Ours flattens every page into a JPEG. For any PDF you still need to search, quote from, or hand to a screen reader, that difference is not marginal — it is the whole file.",
      "OCR on scanned pages, on their paid tier. Converting a scan into searchable text is the most valuable thing a PDF service does, and a tuned server pipeline generally beats a browser-side Tesseract run.",
      "Batch compress and batch convert. Ours is strictly one file at a time on the page's main thread, with no queue and no cancel, and a long job locks the tab.",
      "It exists where you work: a Windows desktop app, a Chrome extension, iOS and Android apps, and Google Workspace and Dropbox integrations. We are a web page you have to visit.",
      "Team management with seat administration and centralised billing, plus document storage that syncs across devices. We store nothing, which is the privacy argument and simultaneously the reason we can offer neither.",
    ],
    ourLimits: [
      "Compress PDF rasterizes and offers no alternative. The text layer is destroyed, screen readers can no longer read the document, and links, form fields and annotations are lost. There are three fixed presets and no target file size, custom quality or DPI control.",
      "On a lean text or vector PDF our compressor's output can be larger than the input. The tool reports that as a success with a negative reduction percentage, so read the before and after numbers.",
      "Merge PDF copies pages only — bookmarks and outlines, document-level form definitions and embedded attachments are not rebuilt, so interactive forms can stop working. Password-protected files are rejected with a misleading generic error.",
      "Everything runs on the page's main thread with the whole file in memory and no progress bar or cancel button. Large documents can make the tab unresponsive or run out of memory, especially on a phone.",
      "Your document is never uploaded, but that is not the same as nothing leaving your device: our OCR tool downloads Tesseract language data from a CDN on first use, and our AI tools fetch model files from a CDN on first run. There is no service worker either, so the site does not work offline.",
    ],
    verdict:
      "Use our tools when the document is one you would rather not hand to a third party at all, and the job is mechanical: merge, split, rotate, reorder, images to PDF, or shrink a scan under an upload limit. There is no upload, no account and no cost.\n\nUse Smallpdf, or another server service, when you need OCR, batch processing, compression that preserves the text layer, or a compliance certificate you can show someone. Being unable to produce that certificate is a real limitation of how we are built, not an oversight.\n\nOne thing worth being straight about: if you distrust Smallpdf specifically, this page is not the argument for that. They publish a short retention window, EU servers and an external audit. The argument for us is narrower and simpler — a file that is never sent cannot be retained, breached, or subpoenaed.",
    faq: [
      {
        q: "Is there a free Smallpdf alternative that doesn't require an account?",
        a: "Yes. Our PDF tools need no account and no payment, and the file is processed entirely in your browser rather than uploaded. Smallpdf also lets you try tools without signing up; the difference is that their free plan is described as having limited downloads and ours has no counter at all.",
      },
      {
        q: "Is Smallpdf safe?",
        a: "We are not going to answer that for them. What they publish is verifiable: ISO/IEC 27001 certification with annual audits, servers in Ireland under EU data law, 256-bit TLS, and files permanently removed after one hour of processing. Our position is not that this is careless — it is that we never receive the file, so none of it has to be trusted.",
      },
      {
        q: "Does your PDF compressor keep the text searchable?",
        a: "No. It rasterizes every page into an image, which destroys the text layer. Smallpdf's compress page states that fonts and text styles are fully preserved by theirs. If the document needs to stay searchable, use theirs, not ours.",
      },
      {
        q: "Can you handle a batch of files?",
        a: "No. One file at a time, in a tab, on the page's main thread. Batch compress and batch convert are paid features on Smallpdf and a genuine reason to pay for a service.",
      },
      {
        q: "Are you affiliated with Smallpdf?",
        a: "No. This is an independent comparison written from their own publicly published pages on the date shown above. We are not affiliated with, sponsored by, or endorsed by them.",
      },
    ],
  },
  ar: {
    heading: "بديل مجاني لـ Smallpdf لا يرفع ملفك أبداً",
    intro:
      "تعمل أدوات PDF لدينا داخل تبويب المتصفح. يُحلَّل المستند ويُعاد بناؤه عبر JavaScript على جهازك أنت، ولا يُرفع أبداً، ولا حساب، ولا شيء تدفعه.\n\nومن الإنصاف قول الحقيقة عن Smallpdf: ليست خدمة مستهترة. فهم ينشرون شهادة ISO/IEC 27001 مع تدقيق سنوي، ويقولون إن خوادمهم في أيرلندا تحت قانون بيانات الاتحاد الأوروبي، ويصفون تشفير TLS بمفتاح 256 بت أثناء النقل، ويصرّحون بأن الملفات تُزال نهائياً من خوادمهم بعد ساعة واحدة من المعالجة. الفرق ليس أنهم مهملون بملفك، بل أننا لا نستقبله أصلاً، فلا توجد ساعة يجب الوثوق بها من البداية.\n\nوفي عدة مهام يتفوّقون علينا بوضوح. وقد فصّلنا ذلك أدناه بالقدر نفسه من التفصيل الذي فصّلنا به نقاط قوّتنا.",
    rows: [
      {
        key: "processing",
        aspect: "أين يُعالَج مستندك",
        us: "داخل تبويب المتصفح على جهازك. لا شيء يُرفع ولا شيء يُخزَّن — لا يوجد خادم يحتفظ بملفك لأي مدة، لأنه لا يوجد خادم في المسار أصلاً.",
        them: "يُرفع إلى خوادمهم عبر TLS ويُعالَج هناك. ويصرّحون بأن خوادمهم في أيرلندا تحت قانون الاتحاد الأوروبي، وأن الملفات تُزال نهائياً بعد ساعة من المعالجة.",
        edge: "us",
      },
      {
        key: "account",
        aspect: "الحساب والتكلفة",
        us: "مجاني بشكل دائم، بلا تسجيل دخول وبلا عدّاد استخدام. لا نملك حسابات نعرضها عليك أصلاً.",
        them: "صفحة الضغط لديهم تقول إنه يمكنك التجربة مجاناً بلا تسجيل. وتصف جداول أسعارهم الخطة المجانية بأن التنزيلات فيها محدودة؛ أما Pro وTeam وBusiness فاشتراكات مدفوعة.",
        edge: "us",
      },
      {
        key: "compliance",
        aspect: "الشهادات وسجل التدقيق",
        us: "لا شيء. لا نحمل شهادة ISO، ولا نُكلّف تدقيقاً خارجياً، ولا نستطيع تسليمك أي مستند امتثال. حجّتنا الوحيدة أن بإمكانك مراقبة لوحة الشبكة بنفسك وترى أن شيئاً لا يُرسل.",
        them: "حاصلون على ISO/IEC 27001 مع تدقيق سنوي، ويصرّحون بالامتثال لـ GDPR وCCPA وnFADP. وإن كانت عملية شراء أو امتثال تتطلّب شهادة، فهم يملكونها ونحن لا.",
        edge: "them",
      },
      {
        key: "compression",
        aspect: "جودة ضغط PDF",
        us: "تحويل إلى صور فقط. كل صفحة يُعاد ترميزها كصورة JPEG، فتُدمَّر طبقة النص — لا يمكن تحديد الناتج أو نسخه أو البحث فيه، ولا تقرؤه قارئات الشاشة، وتختفي الروابط وحقول النماذج والتعليقات. ومع ملف نصي خفيف قد يخرج الناتج أكبر من الأصل.",
        them: "ثلاثة مستويات: Basic وModerate وStrong، والأخيران ضمن الطبقة المدفوعة. وتقول صفحة الضغط لديهم إن خطوط المستند لا تتأثر، وإن جميع أنماط النص وأحجامه والخطوط المضمّنة تُحفَظ بالكامل.",
        edge: "them",
      },
      {
        key: "ocr",
        aspect: "التعرّف الضوئي على الصفحات الممسوحة",
        us: "أداة Image to Text المنفصلة لدينا تشغّل محرك Tesseract مفتوح المصدر محلياً وتقبل ملفات PDF، وتُنزّل بيانات اللغة من مصدر tessdata في أول اختيار للغة.",
        them: "التعرّف الضوئي مُدرَج ضمن الميزات التي تفتحها الطبقة المدفوعة، إلى جانب تحرير النص وأدوات الذكاء الاصطناعي.",
        edge: "them",
      },
      {
        key: "batch",
        aspect: "المعالجة الدفعية وأين يمكنك التشغيل",
        us: "ملف واحد في كل مرة، يدوياً، داخل تبويب متصفح. بلا طابور دفعات، ولا واجهة برمجية، ولا تطبيق سطح مكتب، ولا إضافة متصفح، ولا تطبيق جوال.",
        them: "ضغط وتحويل دفعي في الطبقات المدفوعة، وتطبيق سطح مكتب لويندوز، وإضافة لكروم، وتطبيقان لـ iOS وAndroid، وتكاملات مع Google Workspace وDropbox.",
        edge: "them",
      },
      {
        key: "storage",
        aspect: "الاحتفاظ بالمستندات",
        us: "لا شيء يُخزَّن. هذا هو المقصد، وهو أيضاً الثمن: لا سجل، ولا مزامنة بين حاسوبك وهاتفك، ولا طريقة لمشاركة مستند مع زميل عبرنا.",
        them: "تخزين مرتبط بالحساب يحفظ المستندات عبر الأجهزة. ويصرّحون بأن الملف الذي تحذفه من تخزينك يُزال من خوادمهم خلال ساعة.",
        edge: "mixed",
      },
      {
        key: "teams",
        aspect: "الفِرَق",
        us: "لا شيء. لا يوجد لدينا مفهوم مؤسسة ولا مقعد ولا مسؤول ولا مساحة عمل مشتركة.",
        them: "طبقتا Team وBusiness مع إدارة وصول الأعضاء وفوترة مركزية.",
        edge: "them",
      },
    ],
    theirEdge: [
      "قصة امتثال يمكنك تسليمها فعلاً لأحدهم. تنشر Smallpdf شهادة ISO/IEC 27001 مع تدقيق سنوي وتصرّح بالامتثال لـ GDPR وCCPA وnFADP. وإن كانت المراجعة الأمنية في شركتك تحتاج شهادة واتفاقية معالجة موقّعة، فنحن لا نستطيع تقديم أيٍّ منهما — والوعد بأن الشيفرة تعمل محلياً ليس مستنداً قابلاً للتدقيق مهما كان صحيحاً.",
      "ضغط PDF يُبقي المستند مستنداً. تقول صفحة الضغط لديهم إن الخطوط المضمّنة وأنماط النص وأحجامه تُحفَظ بالكامل، بينما نحن نُسطِّح كل صفحة إلى صورة JPEG. ولأي ملف PDF ما زلت تحتاج للبحث فيه أو الاقتباس منه أو تسليمه لقارئ شاشة، فهذا فرق ليس هامشياً — إنه الملف كله.",
      "التعرّف الضوئي على الصفحات الممسوحة في طبقتهم المدفوعة. تحويل صورة ممسوحة إلى نص قابل للبحث هو أثمن ما تقدّمه خدمة PDF، ومنظومة خادم مضبوطة تتفوّق عادةً على تشغيل Tesseract داخل المتصفح.",
      "الضغط والتحويل الدفعيان. أدواتنا تعالج ملفاً واحداً فقط في كل مرة على الخيط الرئيسي للصفحة، بلا طابور وبلا إلغاء، والمهمة الطويلة تُجمّد التبويب.",
      "وجودهم حيث تعمل: تطبيق سطح مكتب لويندوز، وإضافة كروم، وتطبيقات iOS وAndroid، وتكاملات مع Google Workspace وDropbox. أما نحن فصفحة ويب عليك زيارتها.",
      "إدارة الفِرَق بالمقاعد والفوترة المركزية، إضافة إلى تخزين مستندات يتزامن عبر الأجهزة. نحن لا نخزّن شيئاً، وهي حجّة الخصوصية نفسها التي تمنعنا من تقديم أيٍّ من ذلك.",
    ],
    ourLimits: [
      "أداة ضغط PDF لدينا تحوّل إلى صور بلا بديل. تُدمَّر طبقة النص، ولا تستطيع قارئات الشاشة قراءة المستند، وتُفقد الروابط وحقول النماذج والتعليقات. وهناك ثلاثة إعدادات ثابتة فقط، بلا حجم مستهدف ولا تحكّم بالجودة أو الدقة.",
      "مع ملف PDF نصي أو متجهي خفيف قد يخرج ناتج أداة الضغط أكبر من المدخل، وتُبلّغ الأداة عن ذلك كنجاح مع نسبة تقليص سالبة، فاقرأ الأرقام قبل وبعد.",
      "أداة دمج PDF تنسخ الصفحات فقط — فالإشارات المرجعية والفهارس وتعريفات النماذج على مستوى المستند والمرفقات المضمّنة لا يُعاد بناؤها، وقد تتوقّف النماذج التفاعلية عن العمل. والملفات المحمية بكلمة مرور تُرفض برسالة خطأ عامة ومضلِّلة.",
      "كل شيء يعمل على الخيط الرئيسي للصفحة مع الملف كاملاً في الذاكرة وبلا شريط تقدّم أو زر إلغاء. المستندات الكبيرة قد تجعل التبويب غير مستجيب أو تستنفد الذاكرة، خصوصاً على الهاتف.",
      "مستندك لا يُرفع أبداً، لكن هذا لا يعني أن شيئاً لا يغادر جهازك: أداة التعرّف الضوئي لدينا تنزّل بيانات لغة Tesseract من شبكة توزيع محتوى في أول استخدام، وأدوات الذكاء الاصطناعي تجلب ملفات النماذج في أول تشغيل. ولا يوجد Service Worker، لذلك لا يعمل الموقع دون اتصال.",
    ],
    verdict:
      "استخدم أدواتنا حين يكون المستند شيئاً تفضّل ألّا تسلّمه لطرف ثالث إطلاقاً، وحين تكون المهمة آلية: دمج أو تقسيم أو تدوير أو إعادة ترتيب أو تحويل صور إلى PDF أو تصغير ملف ممسوح ليمرّ من حدّ رفع. بلا رفع، وبلا حساب، وبلا تكلفة.\n\nواستخدم Smallpdf أو أي خدمة خادم أخرى حين تحتاج تعرّفاً ضوئياً، أو معالجة دفعية، أو ضغطاً يحافظ على طبقة النص، أو شهادة امتثال تعرضها على أحدهم. وعجزنا عن تقديم تلك الشهادة قيد حقيقي في طريقة بنائنا، لا سهو.\n\nونقطة تستحق الصراحة: إن كنت لا تثق بـ Smallpdf تحديداً، فهذه الصفحة ليست حجّتك. فهم ينشرون مدة احتفاظ قصيرة وخوادم أوروبية وتدقيقاً خارجياً. حجّتنا أضيق وأبسط — الملف الذي لا يُرسَل لا يمكن الاحتفاظ به ولا اختراقه ولا استدعاؤه قضائياً.",
    faq: [
      {
        q: "هل يوجد بديل مجاني لـ Smallpdf لا يتطلّب حساباً؟",
        a: "نعم. أدوات PDF لدينا لا تحتاج حساباً ولا دفعاً، ويُعالَج الملف بالكامل داخل متصفحك بدل رفعه. وSmallpdf أيضاً تتيح تجربة أدوات بلا تسجيل؛ والفرق أن خطتهم المجانية موصوفة بأن تنزيلاتها محدودة، بينما لا يوجد لدينا عدّاد إطلاقاً.",
      },
      {
        q: "هل Smallpdf آمنة؟",
        a: "لن نجيب عن ذلك نيابةً عنهم. ما ينشرونه قابل للتحقّق: شهادة ISO/IEC 27001 مع تدقيق سنوي، وخوادم في أيرلندا تحت قانون الاتحاد الأوروبي، وتشفير TLS بمفتاح 256 بت، وإزالة الملفات نهائياً بعد ساعة من المعالجة. وموقفنا ليس أن هذا استهتار، بل أننا لا نستقبل الملف أصلاً، فلا شيء من ذلك يحتاج إلى ثقة.",
      },
      {
        q: "هل تُبقي أداة الضغط لديكم النص قابلاً للبحث؟",
        a: "لا. تحوّل كل صفحة إلى صورة، وهذا يدمّر طبقة النص. وتقول صفحة الضغط لدى Smallpdf إن أداتهم تحفظ الخطوط وأنماط النص بالكامل. فإن كان المستند يجب أن يبقى قابلاً للبحث، فاستخدم أداتهم لا أداتنا.",
      },
      {
        q: "هل تدعمون معالجة دفعة من الملفات؟",
        a: "لا. ملف واحد في كل مرة داخل تبويب على الخيط الرئيسي للصفحة. والضغط والتحويل الدفعيان ميزتان مدفوعتان لدى Smallpdf وسبب حقيقي للدفع مقابل خدمة.",
      },
      {
        q: "هل أنتم على صلة بـ Smallpdf؟",
        a: "لا. هذه مقارنة مستقلة كُتبت من صفحاتهم المنشورة علناً بالتاريخ المذكور أعلاه. لا تربطنا بهم أي علاقة انتساب أو رعاية أو تأييد.",
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// TinyPNG / Tinify
// Sources read 2026-07-31:
//   https://tinypng.com/            (retention, batch limits, technique, "up to 80%")
//   https://tinypng.com/pricing/api (per-compression pricing, free allowance)
//   https://tinify.com/developers   (formats, client libraries, plugins)
// Note: tinypng.com/developers, /pricing and /privacy 307-redirect to tinify.com;
//   tinify.com/pricing and /privacy return 404. The working API pricing URL is
//   https://tinypng.com/pricing/api.
// Per-compression API prices re-read from tinify.com/pricing on 2026-08-02 and
//   confirmed: first 500/month free, $0.009 each for 501–10,000, $0.002 beyond.
//   Highest-churn claim on this page — re-read periodically.
// TODO(verify): no Photoshop, Shopify or Magento plugin is mentioned on either
//   tinypng.com or tinify.com — this page therefore claims only the WordPress
//   and Figma plugins and the official client libraries, which are listed there.
// ──────────────────────────────────────────────────────────────────────────────
const tinypng: Comparison = {
  slug: "tinypng",
  competitor: "TinyPNG",
  metaTitle:
    "A free TinyPNG alternative that compresses images without uploading",
  metaDescription:
    "Our image compressor runs on a canvas in your browser, so the photo is never uploaded. TinyPNG's quantization engine will usually produce a smaller file than ours. Here is exactly where each one wins.",
  tools: [
    "image-compression",
    "image-converter",
    "image-resizer",
    "crop-image",
    "svg-png",
    "heic-to-jpg",
  ],
  related: ["photoshop", "ilovepdf"],
  checkedOn: CHECKED,
  sources: [
    { label: "TinyPNG home", url: "https://tinypng.com/" },
    { label: "TinyPNG API pricing", url: "https://tinypng.com/pricing/api" },
    { label: "Tinify developer docs", url: "https://tinify.com/developers" },
  ],
  en: {
    heading: "A free TinyPNG alternative that never uploads your image",
    intro:
      "Our image compressor draws your picture onto an HTML canvas and re-encodes it there, inside your browser tab. The file is never uploaded. There is no batch limit, no account, no counter, and no cost.\n\nHere is the part most comparison pages would hide: on pure output quality, TinyPNG will usually beat us. Their whole product is a tuned compression engine, and ours is the encoder that happens to be built into your browser. If the smallest possible file at a given quality is what you are optimising for, they win, and we are not going to pretend otherwise.\n\nWhat this page argues is narrower. Your photo does not leave the machine, there is no 20-image batch cap, and a file larger than 5 MB is not a problem.",
    rows: [
      {
        key: "processing",
        aspect: "Where your image is processed",
        us: "On a canvas in your browser tab. The image is decoded, redrawn and re-encoded locally and is never uploaded.",
        them: "Uploaded to their servers. They state that only you have access to the images you upload and that they are retained for a maximum of 48 hours, after which they are permanently deleted.",
        edge: "us",
      },
      {
        key: "png",
        aspect: "PNG compression",
        us: "Barely helps, and the file can come out larger. We redraw from raw pixels with no knowledge of the original's palette or filter choices, so an indexed PNG comes back as full RGBA. That is also why PNG is not offered in target-size mode.",
        them: "This is precisely their core technique: they describe using quantization to combine similar colours, turning 24-bit PNG files into much smaller 8-bit indexed colour images, and they claim reductions of up to 80%.",
        edge: "them",
      },
      {
        key: "jpeg",
        aspect: "JPEG compression",
        us: "The browser's built-in encoder, which is a blunt instrument next to a dedicated one. A tool built on MozJPEG will typically reach a smaller file at the same visual quality.",
        them: "Their own tuned lossy pipeline, applied server-side, with the metadata stripping they describe as removing unnecessary metadata.",
        edge: "them",
      },
      {
        key: "formats",
        aspect: "Formats",
        us: "No AVIF at all, in or out. And if you pick an output format your browser cannot encode, the tool quietly writes a PNG under the wrong file extension.",
        them: "Their developer API handles AVIF, WebP, JPEG and PNG, and can compress, resize and convert in the same request.",
        edge: "them",
      },
      {
        key: "metadata",
        aspect: "Metadata and colour profiles",
        us: "Every mode redraws the image on a canvas, which discards all metadata: EXIF, GPS coordinates, camera settings, ICC colour profiles and XMP. Usually that is a privacy bonus. Occasionally it is a problem — a wide-gamut photo can shift colour once its profile is gone, and you lose the capture date.",
        them: "They describe removing unnecessary metadata as part of compression, and the API exposes resize and convert options in the same call.",
        edge: "mixed",
      },
      {
        key: "batchlimits",
        aspect: "How much you can put through it",
        us: "One image at a time, with a 25 MB ceiling, no batch and no ZIP. Encoding runs on the main thread, so a large image briefly freezes the page.",
        them: "The free web tool takes up to 20 images at a maximum of 5 MB each per batch. The API gives 500 free compressions a month with no payment method required, then charges per compression.",
        edge: "mixed",
      },
      {
        key: "automation",
        aspect: "Automation and pipelines",
        us: "None. There is no API, no CLI and no plugin. Every compression needs a person with a browser open.",
        them: "A developer API with official client libraries for Ruby, PHP, Node.js, Python, Java and .NET, plus a WordPress plugin and a Figma plugin.",
        edge: "them",
      },
      {
        key: "price",
        aspect: "Price",
        us: "Free, with no account, no counter and no per-image charge.",
        them: "The web tool is free within the batch limits. The API gives 500 free compressions a month, then charges $0.009 per compression from 501 to 10,000 and $0.002 beyond that, with prepaid credit bundles as an alternative (read from their pricing page on the date shown above).",
        edge: "us",
      },
    ],
    theirEdge: [
      "PNG quantization, which is the entire reason TinyPNG exists and something we do not do at all. They collapse a 24-bit PNG to an 8-bit indexed palette. We hand raw pixels to the browser encoder, which knows nothing about the original palette, so an indexed PNG comes back as full RGBA and can end up bigger than it started. If the job is shrinking a PNG, they win outright and it is not close.",
      "JPEG encoder quality. A MozJPEG-class encoder reaches a smaller file at the same perceived quality than the canvas encoder we are stuck with. For production assets where the last few percent matter, a dedicated encoder or a build-time optimiser is the correct tool and we are not it.",
      "AVIF and WebP output through their API. We have no AVIF support in either direction, and our format conversion silently falls back to PNG under the wrong extension if the browser cannot encode what you asked for.",
      "It fits into a pipeline. Official client libraries in six languages, a WordPress plugin and a Figma plugin mean images get optimised as part of a build or a CMS, unattended, forever. We require a human, a browser and one image at a time.",
      "Compress, resize and convert in a single API request, applied consistently across an entire asset library rather than by hand.",
      "500 free API compressions a month with no payment method required — a free tier that is actually usable for automation, which is a category we do not compete in.",
    ],
    ourLimits: [
      "We use the browser's built-in encoder, which is a blunt instrument next to a dedicated one. A tool built on MozJPEG or oxipng will typically reach a smaller file at the same visual quality. For production assets where the last few percent matter, use a build-time optimiser instead.",
      "PNG barely benefits and can come out larger. The image is redrawn from raw pixels with no knowledge of the original's palette or filter choices, so an indexed PNG returns as full RGBA. To genuinely shrink a PNG, resize it or convert it to WebP or JPEG.",
      "Every mode redraws the image onto a canvas, which discards all metadata: EXIF, GPS coordinates, camera settings, ICC colour profiles and XMP. Usually that is a privacy bonus, occasionally a problem — a wide-gamut photo can shift colour once its profile is gone.",
      "One image at a time: no batch, no ZIP, a 25 MB ceiling, and no AVIF for either input or output. Encoding runs on the main thread, so a large image briefly freezes the page — and if you pick an output format your browser cannot encode, it quietly writes a PNG under the wrong file extension.",
    ],
    verdict:
      "Use ours when the picture is one you would rather not upload — a screenshot with a customer's data in it, an ID photo, a medical scan — or when it is bigger than 5 MB, or when you just need one image under a form's upload limit right now and do not want to think about batches or credits.\n\nUse TinyPNG when file size is the actual goal. PNG in particular: their quantization is the right technique and ours is not a technique at all. And if this is a website's asset pipeline rather than a one-off, use their API or a build-time optimiser like MozJPEG, oxipng or Sharp. That is not a close call.\n\nOne honest caveat about us that cuts both ways: we strip every scrap of metadata, including the ICC profile. That is excellent if you are removing GPS coordinates before posting a photo, and bad if you are handling a wide-gamut image whose colour you care about.",
    faq: [
      {
        q: "Is there a free alternative to TinyPNG that doesn't upload my images?",
        a: "Yes. Our image compressor runs on a canvas inside your browser tab, so the file is never sent anywhere. There is no account, no batch cap and no per-image charge. The trade-off is output quality: TinyPNG's engine will usually produce a smaller file at the same visual quality.",
      },
      {
        q: "Which one produces the smaller file?",
        a: "Usually TinyPNG, and for PNG specifically it is not close. They quantize a 24-bit PNG down to an 8-bit indexed palette; we redraw raw pixels through the browser's encoder, which can return an indexed PNG as full RGBA and make it bigger. On JPEG the gap is smaller but still theirs.",
      },
      {
        q: "Do you have a file-size or batch limit?",
        a: "There is a 25 MB ceiling per image and we process one image at a time. TinyPNG's free web tool takes up to 20 images at a maximum of 5 MB each per batch, so for a single large file we have more headroom and for a folder of small ones they do.",
      },
      {
        q: "Does compressing an image here remove its EXIF data?",
        a: "Yes, all of it — EXIF, GPS, camera settings, ICC colour profile and XMP — because the image is redrawn on a canvas. That is a privacy win if you are stripping location data, and a genuine loss if you needed the colour profile or the capture date.",
      },
      {
        q: "Do you have an API?",
        a: "No. If you need image optimisation inside a build, a CMS or a deployment pipeline, use TinyPNG's developer API or a build-time optimiser. We have nothing to offer there.",
      },
      {
        q: "Are you affiliated with TinyPNG?",
        a: "No. This is an independent comparison written from their own publicly published pages on the date shown above. We are not affiliated with, sponsored by, or endorsed by them.",
      },
    ],
  },
  ar: {
    heading: "بديل مجاني لـ TinyPNG لا يرفع صورتك أبداً",
    intro:
      "أداة ضغط الصور لدينا ترسم صورتك على لوحة HTML canvas وتعيد ترميزها هناك، داخل تبويب متصفحك. لا يُرفع الملف أبداً. ولا حدّ لعدد الصور، ولا حساب، ولا عدّاد، ولا تكلفة.\n\nوإليك الجزء الذي تخفيه معظم صفحات المقارنة: من حيث جودة الناتج البحتة، ستتفوّق TinyPNG علينا غالباً. منتجهم بأكمله محرّك ضغط مضبوط، ومحرّكنا هو ما يصادف وجوده داخل متصفحك. فإن كان هدفك أصغر ملف ممكن عند جودة معيّنة، فهم الفائزون، ولن ندّعي غير ذلك.\n\nما تدافع عنه هذه الصفحة أضيق: صورتك لا تغادر جهازك، ولا يوجد سقف عشرين صورة للدفعة، والملف الأكبر من 5 ميغابايت ليس مشكلة.",
    rows: [
      {
        key: "processing",
        aspect: "أين تُعالَج صورتك",
        us: "على لوحة canvas داخل تبويب متصفحك. تُفَك الصورة وتُعاد رسمتها وترميزها محلياً ولا تُرفع أبداً.",
        them: "تُرفع إلى خوادمهم. ويصرّحون بأنك وحدك من يملك الوصول إلى الصور التي ترفعها، وأنها تُحفَظ 48 ساعة كحد أقصى ثم تُحذف نهائياً.",
        edge: "us",
      },
      {
        key: "png",
        aspect: "ضغط PNG",
        us: "بالكاد يفيد، وقد يخرج الملف أكبر. نحن نعيد الرسم من بكسلات خام دون معرفة بلوحة ألوان الأصل أو خيارات مرشّحاته، فتعود صورة PNG المفهرسة بصيغة RGBA كاملة. ولهذا السبب أيضاً لا تُتاح PNG في وضع الحجم المستهدف.",
        them: "هذه تحديداً تقنيتهم الأساسية: يصفون استخدام التكميم لدمج الألوان المتقاربة، فيحوّلون ملفات PNG بعمق 24 بت إلى صور مفهرسة بعمق 8 بت أصغر بكثير، ويذكرون تقليصاً يصل إلى 80%.",
        edge: "them",
      },
      {
        key: "jpeg",
        aspect: "ضغط JPEG",
        us: "محرّك المتصفح المدمج، وهو أداة فظّة مقارنةً بمحرّك مخصّص. أداة مبنية على MozJPEG ستصل عادةً إلى ملف أصغر عند الجودة البصرية نفسها.",
        them: "منظومتهم الخاصة المضبوطة، تُطبَّق على الخادم، مع إزالة ما يصفونه بالبيانات الوصفية غير الضرورية.",
        edge: "them",
      },
      {
        key: "formats",
        aspect: "الصيغ",
        us: "لا دعم لـ AVIF إطلاقاً، لا إدخالاً ولا إخراجاً. وإن اخترت صيغة إخراج لا يستطيع متصفحك ترميزها، تكتب الأداة بهدوء ملف PNG بامتداد خاطئ.",
        them: "واجهتهم البرمجية للمطورين تتعامل مع AVIF وWebP وJPEG وPNG، ويمكنها الضغط وتغيير الحجم والتحويل في الطلب نفسه.",
        edge: "them",
      },
      {
        key: "metadata",
        aspect: "البيانات الوصفية وملفات الألوان",
        us: "كل الأوضاع تعيد رسم الصورة على canvas، وهذا يتخلّص من كل البيانات الوصفية: EXIF وإحداثيات GPS وإعدادات الكاميرا وملفات ألوان ICC وXMP. عادةً هذه مكسب للخصوصية، وأحياناً مشكلة — فقد ينزاح لون صورة واسعة النطاق اللوني بعد اختفاء ملف ألوانها، وتفقد تاريخ الالتقاط.",
        them: "يصفون إزالة البيانات الوصفية غير الضرورية ضمن الضغط، وتتيح واجهتهم البرمجية خيارات تغيير الحجم والتحويل في الطلب نفسه.",
        edge: "mixed",
      },
      {
        key: "batchlimits",
        aspect: "كم يمكنك تمريره",
        us: "صورة واحدة في كل مرة، بسقف 25 ميغابايت، بلا دفعات وبلا ملف ZIP. ويعمل الترميز على الخيط الرئيسي، فتتجمّد الصفحة لحظات مع صورة كبيرة.",
        them: "الأداة المجانية على الويب تقبل حتى 20 صورة بحد أقصى 5 ميغابايت لكل صورة في الدفعة. والواجهة البرمجية تمنح 500 عملية ضغط مجانية شهرياً بلا حاجة لوسيلة دفع، ثم تُحتسب التكلفة لكل عملية.",
        edge: "mixed",
      },
      {
        key: "automation",
        aspect: "الأتمتة وخطوط الإنتاج",
        us: "لا شيء. لا واجهة برمجية، ولا سطر أوامر، ولا إضافات. كل عملية ضغط تحتاج شخصاً أمام متصفح مفتوح.",
        them: "واجهة برمجية للمطورين مع مكتبات عميل رسمية لـ Ruby وPHP وNode.js وPython وJava و‎.NET، إضافة إلى إضافة لـ WordPress وأخرى لـ Figma.",
        edge: "them",
      },
      {
        key: "price",
        aspect: "السعر",
        us: "مجاني، بلا حساب وبلا عدّاد وبلا رسوم لكل صورة.",
        them: "الأداة على الويب مجانية ضمن حدود الدفعة. والواجهة البرمجية تمنح 500 عملية ضغط مجانية شهرياً، ثم 0.009 دولار لكل عملية من 501 إلى 10,000، و0.002 دولار لما بعدها، مع إمكانية شراء حزم أرصدة مسبقة الدفع (مقروءة من صفحة أسعارهم بالتاريخ المذكور أعلاه).",
        edge: "us",
      },
    ],
    theirEdge: [
      "تكميم PNG، وهو سبب وجود TinyPNG كله وشيء لا نفعله إطلاقاً. هم يخفضون PNG من 24 بت إلى لوحة مفهرسة بـ 8 بت. أما نحن فنسلّم بكسلات خام لمحرّك المتصفح الذي لا يعرف شيئاً عن لوحة الأصل، فتعود صورة PNG مفهرسة بصيغة RGBA كاملة وقد تنتهي أكبر مما بدأت. فإن كانت المهمة تصغير PNG، فهم الفائزون بوضوح تام.",
      "جودة محرّك JPEG. محرّك من فئة MozJPEG يصل إلى ملف أصغر عند الجودة المُدرَكة نفسها مقارنةً بمحرّك canvas الذي نحن مقيّدون به. ولأصول الإنتاج التي تهمّ فيها آخر بضع نقاط مئوية، المحرّك المخصّص أو مُحسّن وقت البناء هو الأداة الصحيحة، ولسنا نحن.",
      "إخراج AVIF وWebP عبر واجهتهم البرمجية. نحن لا ندعم AVIF في أي اتجاه، وتحويل الصيغ لدينا يتراجع بصمت إلى PNG بامتداد خاطئ إن لم يستطع المتصفح ترميز ما طلبته.",
      "يندمج في خط إنتاج. مكتبات عميل رسمية بست لغات، وإضافة WordPress، وإضافة Figma — أي أن الصور تُحسَّن ضمن عملية بناء أو نظام إدارة محتوى، دون إشراف، وإلى الأبد. أما نحن فنحتاج إنساناً ومتصفحاً وصورة واحدة في كل مرة.",
      "الضغط وتغيير الحجم والتحويل في طلب واحد، مطبَّقاً باتساق على مكتبة أصول كاملة بدل العمل اليدوي.",
      "500 عملية ضغط مجانية شهرياً عبر الواجهة البرمجية بلا وسيلة دفع — طبقة مجانية صالحة فعلاً للأتمتة، وهي فئة لا ننافس فيها أصلاً.",
    ],
    ourLimits: [
      "نستخدم محرّك المتصفح المدمج، وهو أداة فظّة مقارنةً بمحرّك مخصّص. أداة مبنية على MozJPEG أو oxipng ستصل عادةً إلى ملف أصغر عند الجودة البصرية نفسها. ولأصول الإنتاج التي تهمّ فيها آخر بضع نقاط مئوية، استخدم مُحسّن وقت بناء بدلاً منّا.",
      "صيغة PNG بالكاد تستفيد وقد تخرج أكبر. تُعاد رسم الصورة من بكسلات خام دون معرفة بلوحة ألوان الأصل أو خيارات مرشّحاته، فتعود PNG المفهرسة بصيغة RGBA كاملة. ولتصغير PNG فعلاً، غيّر أبعادها أو حوّلها إلى WebP أو JPEG.",
      "كل الأوضاع تعيد رسم الصورة على canvas، وهذا يتخلّص من كل البيانات الوصفية: EXIF وGPS وإعدادات الكاميرا وملفات ألوان ICC وXMP. عادةً مكسب للخصوصية، وأحياناً مشكلة — فقد ينزاح لون صورة واسعة النطاق اللوني بعد اختفاء ملف ألوانها.",
      "صورة واحدة في كل مرة: بلا دفعات، وبلا ZIP، وبسقف 25 ميغابايت، وبلا AVIF إدخالاً أو إخراجاً. ويعمل الترميز على الخيط الرئيسي، فتتجمّد الصفحة لحظات مع صورة كبيرة — وإن اخترت صيغة إخراج لا يستطيع متصفحك ترميزها، تُكتب PNG بهدوء تحت امتداد خاطئ.",
    ],
    verdict:
      "استخدم أداتنا حين تكون الصورة شيئاً تفضّل ألّا ترفعه — لقطة شاشة فيها بيانات عميل، أو صورة هوية، أو صورة أشعة طبية — أو حين يتجاوز حجمها 5 ميغابايت، أو حين تحتاج ببساطة صورة واحدة تمرّ من حدّ رفع في نموذج الآن دون التفكير في دفعات أو أرصدة.\n\nواستخدم TinyPNG حين يكون حجم الملف هو الهدف الفعلي. وخصوصاً مع PNG: تكميمهم هو التقنية الصحيحة، وما لدينا ليس تقنية أصلاً. وإن كان هذا خط أصول لموقع لا عملية منفردة، فاستخدم واجهتهم البرمجية أو مُحسّن وقت بناء مثل MozJPEG أو oxipng أو Sharp. هذه ليست مسألة خلافية.\n\nوملاحظة صادقة عنّا تعمل في الاتجاهين: نحن نمحو كل شذرة من البيانات الوصفية، بما فيها ملف ألوان ICC. وهذا ممتاز إن كنت تزيل إحداثيات GPS قبل نشر صورة، وسيّئ إن كنت تتعامل مع صورة واسعة النطاق اللوني يهمّك لونها.",
    faq: [
      {
        q: "هل يوجد بديل مجاني لـ TinyPNG لا يرفع صوري؟",
        a: "نعم. أداة ضغط الصور لدينا تعمل على canvas داخل تبويب متصفحك، فلا يُرسل الملف إلى أي مكان. بلا حساب، وبلا سقف دفعات، وبلا رسوم لكل صورة. والمقابل هو جودة الناتج: محرّك TinyPNG سينتج عادةً ملفاً أصغر عند الجودة البصرية نفسها.",
      },
      {
        q: "أيهما ينتج ملفاً أصغر؟",
        a: "TinyPNG عادةً، ومع PNG تحديداً الفارق كبير. هم يكمّمون PNG من 24 بت إلى لوحة مفهرسة بـ 8 بت؛ ونحن نعيد رسم بكسلات خام عبر محرّك المتصفح الذي قد يُعيد PNG مفهرسة بصيغة RGBA كاملة فيكبر حجمها. ومع JPEG الفارق أصغر لكنه يبقى لصالحهم.",
      },
      {
        q: "هل لديكم حد لحجم الملف أو عدد الصور؟",
        a: "هناك سقف 25 ميغابايت للصورة الواحدة، ونعالج صورة واحدة في كل مرة. وأداة TinyPNG المجانية على الويب تقبل حتى 20 صورة بحد أقصى 5 ميغابايت لكل صورة في الدفعة — فلملف واحد كبير لدينا هامش أوسع، ولمجلد من الصور الصغيرة الأفضلية لهم.",
      },
      {
        q: "هل يزيل ضغط الصورة هنا بيانات EXIF؟",
        a: "نعم، كلها — EXIF وGPS وإعدادات الكاميرا وملف ألوان ICC وXMP — لأن الصورة تُعاد رسمتها على canvas. وهذا مكسب للخصوصية إن كنت تزيل بيانات الموقع، وخسارة حقيقية إن كنت تحتاج ملف الألوان أو تاريخ الالتقاط.",
      },
      {
        q: "هل لديكم واجهة برمجية؟",
        a: "لا. إن كنت تحتاج تحسين صور داخل عملية بناء أو نظام إدارة محتوى أو خط نشر، فاستخدم واجهة TinyPNG للمطورين أو مُحسّن وقت بناء. لا نقدّم شيئاً في هذا المجال.",
      },
      {
        q: "هل أنتم على صلة بـ TinyPNG؟",
        a: "لا. هذه مقارنة مستقلة كُتبت من صفحاتهم المنشورة علناً بالتاريخ المذكور أعلاه. لا تربطنا بهم أي علاقة انتساب أو رعاية أو تأييد.",
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// remove.bg
// Sources read 2026-07-31:
//   https://www.remove.bg/privacy   (upload + deletion wording, 3-month log retention)
//   https://www.remove.bg/pricing   (0.25 MP free preview, 50 MP paid, credit packs)
//   https://www.remove.bg/api       (input/output resolution caps, alpha, ZIP, free calls)
//   https://www.remove.bg/          (hair claim, bulk rate, integrations)
// TODO(verify): remove.bg does not state on the pages read whether a free
//   preview requires an account, and no watermark policy was found. This page
//   therefore makes no claim either way.
// TODO(verify): credit and subscription prices below were read on 2026-07-31
//   from the pricing page's embedded first-party JSON (the page is a JS-rendered
//   SPA). Re-read before relying on them.
// TODO(verify): background replacement, solid-colour backdrops and auto-crop are
//   commonly-cited remove.bg features but were NOT confirmed on the pages read.
//   Nothing below claims them.
// ──────────────────────────────────────────────────────────────────────────────
const removebg: Comparison = {
  slug: "remove-bg",
  competitor: "remove.bg",
  metaTitle:
    "A free remove.bg alternative with full-resolution output",
  metaDescription:
    "Our background remover runs on your device and returns your image at full size for free, where remove.bg's free preview is capped at 0.25 megapixels. But their edge quality on hair beats ours. The honest comparison.",
  tools: ["bg-removal", "crop-image", "image-resizer", "image-compression"],
  related: ["photoshop", "tinypng"],
  checkedOn: CHECKED,
  sources: [
    { label: "remove.bg pricing", url: "https://www.remove.bg/pricing" },
    { label: "remove.bg API docs", url: "https://www.remove.bg/api" },
    { label: "remove.bg privacy policy", url: "https://www.remove.bg/privacy" },
    { label: "remove.bg home", url: "https://www.remove.bg/" },
  ],
  en: {
    heading: "A free remove.bg alternative that runs on your own device",
    intro:
      "Our background remover downloads a segmentation model to your browser the first time you use it, then runs it on your machine. The photo itself is never uploaded, there is no account, no credits, and the result comes back at your image's full resolution.\n\nThat last part is the sharpest difference. remove.bg's free preview is capped at up to 0.25 megapixels — roughly a 500 by 500 image. Full resolution, up to 50 megapixels, costs a credit per image. Ours is full resolution for nothing.\n\nAnd here is the part that costs us: their cutout is better at the edge. Ours segments at a fixed 1024 by 1024 internally and scales the mask back up, so hair, fur and anything semi-transparent comes back rough. If the cutout is going in front of a client, that matters more than the price.",
    rows: [
      {
        key: "processing",
        aspect: "Where the image is processed",
        us: "On your device. The model files are downloaded from a CDN on first use and cached by your browser; after that the photo itself never leaves the machine.",
        them: "Uploaded and processed on their servers. Their privacy policy states that images are uploaded securely, processed, provided for download, and then deleted shortly after, and that server logs are stored for a maximum of three months.",
        edge: "us",
      },
      {
        key: "freeres",
        aspect: "Resolution you get for free",
        us: "Your image's own resolution, at no cost. The mask is computed small and scaled up, so the output is full-size even though the edge detail is not.",
        them: "The free preview is capped at up to 0.25 megapixels. Full resolution, stated as up to 50 megapixels, costs credits — one image requires one credit, or a quarter credit for a preview via the API.",
        edge: "us",
      },
      {
        key: "edgequality",
        aspect: "Edge quality on hair and fine detail",
        us: "This is where we lose. Segmentation runs at a fixed 1024 by 1024 internally and the mask is scaled back up to your image's real dimensions, so wispy hair, fur, chain-link, netting, motion blur and semi-transparent things like glass or a veil come back rough or partly eaten. Feeding it a bigger photo does not buy a more detailed edge — the model never sees those extra pixels.",
        them: "Their own marketing foregrounds handling feathery hair without a jagged result, and their paid output ceiling is 50 megapixels rather than an upscaled 1024-pixel mask.",
        edge: "them",
      },
      {
        key: "cost",
        aspect: "Cost",
        us: "Free, with no credits, no account and no per-image charge.",
        them: "A credit system. One-time packs run from 3 credits for $3 up to 8,000 credits for $1,699, and monthly subscriptions start at 40 credits for $9 a month, with cheaper per-credit rates at volume. The API's first 50 calls each month are free. (Prices read from their pricing page on the date shown above.)",
        edge: "us",
      },
      {
        key: "output",
        aspect: "What you get back",
        us: "A transparent PNG and nothing else. There is no background replacement — no solid colour, no new backdrop, no drop shadow, no re-crop. You will need a second tool to composite the cutout onto something.",
        them: "PNG, JPG, WebP and ZIP output. Alpha is supported in PNG, WebP and ZIP but not JPG, and the ZIP option returns a colour JPG plus a separate grayscale alpha matte for compositing.",
        edge: "them",
      },
      {
        key: "volume",
        aspect: "Volume and automation",
        us: "One image at a time on the page's main thread. The per-image progress bar does not actually move — it sits at zero until an image finishes — and there is no cancel. A batch of large photos will make the tab unresponsive.",
        them: "An API, and bulk editing they describe as processing up to 500 images per minute.",
        edge: "them",
      },
      {
        key: "surfaces",
        aspect: "Where you can run it",
        us: "A web page, in a browser, by hand.",
        them: "A Photoshop extension, desktop apps for Windows, Mac and Linux, an Android app, and a Figma integration.",
        edge: "them",
      },
    ],
    theirEdge: [
      "Edge quality, which is the entire job. Our model segments at a fixed 1024 by 1024 and the mask is upscaled to fit your photo, so a strand of hair that is two pixels wide in the real image is a fraction of a pixel in the mask and simply disappears. This is architectural, not a tuning problem — sending us a 24-megapixel photo does not help, because the model never sees those pixels. remove.bg's paid pipeline works up to 50 megapixels.",
      "Alpha as a first-class output. Their ZIP option hands back a colour image plus a separate grayscale alpha matte, which is what you want if the cutout is going into a compositing step rather than straight onto a white page. We return one flattened transparent PNG and nothing else.",
      "Output formats. PNG, JPG and WebP, at up to 50 megapixels for the formats that support it. We emit PNG only.",
      "Bulk. They describe processing up to 500 images per minute. Ours does one at a time, on the main thread, with a progress bar that sits at zero and no way to cancel — a folder of photos is genuinely painful.",
      "It lives where the work happens: a Photoshop extension, desktop apps for Windows, Mac and Linux, an Android app, and a Figma integration. We are a tab you have to keep open.",
      "An API for automation, with the first 50 calls a month free. We have no API at all.",
    ],
    ourLimits: [
      "Fine detail is where this loses to a paid service. Segmentation runs at a fixed 1024 by 1024 internally and the resulting mask is scaled back up to your image's real dimensions, so wispy hair, fur, chain-link, netting, motion blur and semi-transparent things like glass or a veil come back rough or partly eaten. Feeding it a bigger photo does not buy a more detailed edge.",
      "The output is a transparent PNG and nothing else. There is no background replacement: no solid colour, no new backdrop, no drop shadow, no re-cropping. You will need a second tool to composite the cutout onto something.",
      "The first run downloads the model from a CDN, so the tool needs a connection the first time and the download is noticeable on a slow link. The files land in the ordinary browser HTTP cache rather than durable storage, so clearing site data means downloading them again.",
      "Everything runs on the page's main thread and the per-image progress bar does not actually move — it sits at zero until an image finishes. A batch of large photos will make the tab unresponsive with no useful indication of progress, and there is no cancel.",
    ],
    verdict:
      "Use ours when you want a full-resolution cutout for free and the subject has a clean silhouette: a product on a table, a car, a shoe, a person in a coat photographed against a plain wall. You will get your image back at its own size instead of a 0.25-megapixel preview, and the photo never leaves your machine.\n\nPay remove.bg when the subject has hair, fur, netting, glass, or motion blur, or when the cutout is client work. Our edge on those subjects is visibly rough and no amount of resolution on your end will fix it, because the model does not see it.\n\nAlso pay them if there is a folder of images rather than one image. Ours will process them one at a time, on the main thread, with a progress bar that does not move.",
    faq: [
      {
        q: "Is there a free alternative to remove.bg that gives full-resolution output?",
        a: "Yes. Our background remover returns your image at its own resolution at no cost, where remove.bg's free preview is capped at up to 0.25 megapixels and full resolution costs a credit per image. The trade-off is edge quality — ours segments at a fixed 1024 by 1024 and upscales the mask, so fine detail suffers.",
      },
      {
        q: "Is my photo uploaded?",
        a: "No. The segmentation model is downloaded to your browser on first use and runs on your device from then on. The photo itself is never sent anywhere. Note that the model download is a real network request the first time — your content is not uploaded, but the tool is not offline-only.",
      },
      {
        q: "Why does hair look rough in your output?",
        a: "Because segmentation runs at a fixed 1024 by 1024 internally and the mask is scaled up to your image's real size. A hair strand that is a couple of pixels wide in the original is sub-pixel in the mask, so it gets eaten. Sending a larger photo does not help. For hair, fur, netting or anything semi-transparent, a paid service will do better.",
      },
      {
        q: "Can I replace the background with a colour or another image?",
        a: "No. You get a transparent PNG and nothing else — no solid colour, no backdrop, no drop shadow, no re-crop. You will need a second tool to composite.",
      },
      {
        q: "Can I process a batch of images?",
        a: "Technically yes, practically no. Everything runs on the page's main thread, the per-image progress bar sits at zero until each image finishes, and there is no cancel button. A batch of large photos will lock the tab.",
      },
      {
        q: "Are you affiliated with remove.bg?",
        a: "No. This is an independent comparison written from their own publicly published pages on the date shown above. We are not affiliated with, sponsored by, or endorsed by them.",
      },
    ],
  },
  ar: {
    heading: "بديل مجاني لـ remove.bg يعمل على جهازك أنت",
    intro:
      "أداة إزالة الخلفية لدينا تُنزّل نموذج تجزئة إلى متصفحك في أول استخدام، ثم تشغّله على جهازك. الصورة نفسها لا تُرفع أبداً، ولا حساب، ولا أرصدة، والنتيجة تعود بدقة صورتك الكاملة.\n\nوهذه النقطة الأخيرة هي أوضح فرق. المعاينة المجانية في remove.bg محدودة بـ 0.25 ميغابكسل — أي نحو 500 في 500 بكسل. أما الدقة الكاملة، حتى 50 ميغابكسل، فتكلّف رصيداً لكل صورة. ولدينا الدقة الكاملة مجاناً.\n\nوإليك ما يكلّفنا: قصّهم أفضل عند الحواف. نحن نُجزّئ عند 1024 في 1024 داخلياً ثم نكبّر القناع، فيعود الشعر والفرو وكل ما هو نصف شفاف خشناً. وإن كان القص سيُعرض أمام عميل، فهذا يهم أكثر من السعر.",
    rows: [
      {
        key: "processing",
        aspect: "أين تُعالَج الصورة",
        us: "على جهازك. تُنزَّل ملفات النموذج من شبكة توزيع محتوى في أول استخدام ويحفظها متصفحك، وبعدها لا تغادر الصورة نفسها الجهاز إطلاقاً.",
        them: "تُرفع وتُعالَج على خوادمهم. وتنصّ سياسة الخصوصية لديهم على أن الصور تُرفع بأمان وتُعالَج وتُتاح للتنزيل ثم تُحذف بعد ذلك بوقت قصير، وأن سجلات الخادم تُحفَظ ثلاثة أشهر كحد أقصى.",
        edge: "us",
      },
      {
        key: "freeres",
        aspect: "الدقة التي تحصل عليها مجاناً",
        us: "دقة صورتك نفسها، بلا تكلفة. يُحسَب القناع بحجم صغير ثم يُكبَّر، فيخرج الناتج بالحجم الكامل وإن لم تكن تفاصيل الحواف كذلك.",
        them: "المعاينة المجانية محدودة بـ 0.25 ميغابكسل. أما الدقة الكاملة، المذكورة حتى 50 ميغابكسل، فتكلّف أرصدة — صورة واحدة تحتاج رصيداً واحداً، أو ربع رصيد لمعاينة عبر الواجهة البرمجية.",
        edge: "us",
      },
      {
        key: "edgequality",
        aspect: "جودة الحواف مع الشعر والتفاصيل الدقيقة",
        us: "هنا نخسر. تعمل التجزئة عند 1024 في 1024 داخلياً ثم يُكبَّر القناع الناتج إلى أبعاد صورتك الحقيقية، فيعود الشعر الرفيع والفرو والشِّباك والسياج المعدني وضبابية الحركة والأشياء نصف الشفافة كالزجاج أو الحجاب خشنةً أو مأكولةً جزئياً. وإعطاء الأداة صورة أكبر لا يشتري حافة أدق — فالنموذج لا يرى تلك البكسلات أصلاً.",
        them: "موادهم التسويقية نفسها تبرز التعامل مع الشعر الناعم دون نتيجة مسنّنة، وسقف ناتجهم المدفوع 50 ميغابكسل بدل قناع بدقة 1024 بكسل مُكبَّر.",
        edge: "them",
      },
      {
        key: "cost",
        aspect: "التكلفة",
        us: "مجاني، بلا أرصدة وبلا حساب وبلا رسوم لكل صورة.",
        them: "نظام أرصدة. الحزم الفردية تبدأ من 3 أرصدة بـ 3 دولارات وتصل إلى 8000 رصيد بـ 1699 دولاراً، والاشتراكات الشهرية تبدأ بـ 40 رصيداً مقابل 9 دولارات شهرياً بأسعار أقل للرصيد عند الكميات الكبيرة. وأول 50 استدعاء للواجهة البرمجية كل شهر مجانية. (أسعار مقروءة من صفحة أسعارهم بالتاريخ المذكور أعلاه.)",
        edge: "us",
      },
      {
        key: "output",
        aspect: "ما تحصل عليه",
        us: "صورة PNG شفافة ولا شيء غير ذلك. لا استبدال للخلفية — لا لون خالص، ولا خلفية جديدة، ولا ظل، ولا إعادة قص. ستحتاج أداة ثانية لتركيب القصاصة على شيء ما.",
        them: "إخراج بصيغ PNG وJPG وWebP وZIP. وقناة الشفافية مدعومة في PNG وWebP وZIP دون JPG، وخيار ZIP يُعيد صورة ملوّنة بصيغة JPG مع قناع شفافية رمادي منفصل للتركيب.",
        edge: "them",
      },
      {
        key: "volume",
        aspect: "الكميات والأتمتة",
        us: "صورة واحدة في كل مرة على الخيط الرئيسي للصفحة. وشريط التقدّم لكل صورة لا يتحرّك فعلياً — يبقى عند الصفر حتى تنتهي الصورة — ولا يوجد إلغاء. ودفعة من الصور الكبيرة ستجعل التبويب غير مستجيب.",
        them: "واجهة برمجية، وتحرير دفعي يصفونه بمعالجة تصل إلى 500 صورة في الدقيقة.",
        edge: "them",
      },
      {
        key: "surfaces",
        aspect: "أين يمكنك التشغيل",
        us: "صفحة ويب، داخل متصفح، يدوياً.",
        them: "إضافة لـ Photoshop، وتطبيقات سطح مكتب لويندوز وماك ولينكس، وتطبيق أندرويد، وتكامل مع Figma.",
        edge: "them",
      },
    ],
    theirEdge: [
      "جودة الحواف، وهي جوهر المهمة كلها. نموذجنا يُجزّئ عند 1024 في 1024 ثم يُكبَّر القناع ليناسب صورتك، فخصلة شعر عرضها بكسلان في الصورة الحقيقية تصبح جزءاً من بكسل في القناع وتختفي ببساطة. هذا قيد معماري لا مسألة ضبط — إرسال صورة بدقة 24 ميغابكسل لا يفيد، لأن النموذج لا يرى تلك البكسلات. أما منظومة remove.bg المدفوعة فتعمل حتى 50 ميغابكسل.",
      "قناة الشفافية كمُخرَج من الدرجة الأولى. خيار ZIP لديهم يعيد صورة ملوّنة مع قناع شفافية رمادي منفصل، وهو ما تريده إن كانت القصاصة ذاهبة إلى خطوة تركيب لا إلى صفحة بيضاء مباشرةً. نحن نعيد ملف PNG شفافاً واحداً مسطّحاً ولا شيء غيره.",
      "صيغ الإخراج. PNG وJPG وWebP، حتى 50 ميغابكسل للصيغ التي تدعم ذلك. نحن نُخرج PNG فقط.",
      "الكميات. يصفون معالجة تصل إلى 500 صورة في الدقيقة. أما أداتنا فصورة واحدة في كل مرة، على الخيط الرئيسي، بشريط تقدّم عالق عند الصفر وبلا وسيلة إلغاء — ومجلد من الصور تجربة مؤلمة فعلاً.",
      "وجودهم حيث يجري العمل: إضافة Photoshop، وتطبيقات سطح مكتب لويندوز وماك ولينكس، وتطبيق أندرويد، وتكامل Figma. نحن تبويب عليك إبقاؤه مفتوحاً.",
      "واجهة برمجية للأتمتة مع أول 50 استدعاء شهرياً مجاناً. نحن لا نملك واجهة برمجية إطلاقاً.",
    ],
    ourLimits: [
      "التفاصيل الدقيقة هي حيث نخسر أمام خدمة مدفوعة. تعمل التجزئة عند 1024 في 1024 داخلياً ويُكبَّر القناع الناتج إلى أبعاد صورتك الحقيقية، فيعود الشعر الرفيع والفرو والشِّباك والسياج المعدني وضبابية الحركة والأشياء نصف الشفافة كالزجاج أو الحجاب خشنةً أو مأكولةً جزئياً. وإعطاء الأداة صورة أكبر لا يشتري حافة أدق.",
      "الناتج صورة PNG شفافة ولا شيء غير ذلك. لا استبدال للخلفية: لا لون خالص، ولا خلفية جديدة، ولا ظل، ولا إعادة قص. ستحتاج أداة ثانية لتركيب القصاصة.",
      "أول تشغيل يُنزّل النموذج من شبكة توزيع محتوى، فالأداة تحتاج اتصالاً في المرة الأولى والتنزيل ملحوظ على وصلة بطيئة. وتُحفَظ الملفات في ذاكرة HTTP العادية للمتصفح لا في تخزين دائم، فمسح بيانات الموقع يعني تنزيلها من جديد.",
      "كل شيء يعمل على الخيط الرئيسي للصفحة، وشريط التقدّم لكل صورة لا يتحرّك فعلياً — يبقى عند الصفر حتى تنتهي الصورة. ودفعة من الصور الكبيرة ستجعل التبويب غير مستجيب بلا مؤشّر مفيد، ولا يوجد إلغاء.",
    ],
    verdict:
      "استخدم أداتنا حين تريد قصاصة بدقة كاملة مجاناً ويكون للموضوع حدّ خارجي واضح: منتج على طاولة، أو سيارة، أو حذاء، أو شخص بمعطف مصوَّر أمام جدار سادة. ستستعيد صورتك بحجمها الأصلي بدل معاينة بـ 0.25 ميغابكسل، ولن تغادر الصورة جهازك.\n\nوادفع لـ remove.bg حين يكون في الموضوع شعر أو فرو أو شِباك أو زجاج أو ضبابية حركة، أو حين تكون القصاصة عملاً لعميل. حوافّنا مع هذه المواضيع خشنة بوضوح، ولن تُصلحها أي دقة من طرفك، لأن النموذج لا يراها أصلاً.\n\nوادفع لهم أيضاً إن كان لديك مجلد صور لا صورة واحدة. أداتنا ستعالجها واحدة تلو الأخرى، على الخيط الرئيسي، بشريط تقدّم لا يتحرّك.",
    faq: [
      {
        q: "هل يوجد بديل مجاني لـ remove.bg يعطي دقة كاملة؟",
        a: "نعم. أداتنا تعيد صورتك بدقتها الأصلية بلا تكلفة، بينما معاينة remove.bg المجانية محدودة بـ 0.25 ميغابكسل والدقة الكاملة تكلّف رصيداً لكل صورة. والمقابل هو جودة الحواف — فنحن نُجزّئ عند 1024 في 1024 ونكبّر القناع، فتتضرّر التفاصيل الدقيقة.",
      },
      {
        q: "هل تُرفع صورتي؟",
        a: "لا. يُنزَّل نموذج التجزئة إلى متصفحك في أول استخدام ثم يعمل على جهازك بعد ذلك. والصورة نفسها لا تُرسل إلى أي مكان. لاحظ أن تنزيل النموذج طلب شبكة حقيقي في المرة الأولى — محتواك لا يُرفع، لكن الأداة ليست بلا اتصال بالكامل.",
      },
      {
        q: "لماذا يبدو الشعر خشناً في الناتج؟",
        a: "لأن التجزئة تعمل عند 1024 في 1024 داخلياً ثم يُكبَّر القناع إلى حجم صورتك الحقيقي. فخصلة شعر عرضها بضعة بكسلات في الأصل تصبح دون بكسل واحد في القناع فتُؤكَل. وإرسال صورة أكبر لا يفيد. ومع الشعر أو الفرو أو الشِّباك أو أي شيء نصف شفاف، ستكون خدمة مدفوعة أفضل.",
      },
      {
        q: "هل يمكنني استبدال الخلفية بلون أو صورة أخرى؟",
        a: "لا. تحصل على صورة PNG شفافة ولا شيء غيرها — بلا لون خالص ولا خلفية ولا ظل ولا إعادة قص. ستحتاج أداة ثانية للتركيب.",
      },
      {
        q: "هل يمكنني معالجة دفعة من الصور؟",
        a: "نظرياً نعم، عملياً لا. كل شيء يعمل على الخيط الرئيسي للصفحة، وشريط التقدّم لكل صورة يبقى عند الصفر حتى تنتهي، ولا يوجد زر إلغاء. ودفعة من الصور الكبيرة ستُجمّد التبويب.",
      },
      {
        q: "هل أنتم على صلة بـ remove.bg؟",
        a: "لا. هذه مقارنة مستقلة كُتبت من صفحاتهم المنشورة علناً بالتاريخ المذكور أعلاه. لا تربطنا بهم أي علاقة انتساب أو رعاية أو تأييد.",
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Otter.ai
// Sources read 2026-07-31:
//   https://otter.ai/pricing          (plan minutes, per-conversation caps, prices)
//   https://otter.ai/privacy-security (AES-256 SSE, 30-day trash deletion, SOC 2 Type 2)
//   https://help.otter.ai/hc/en-us/articles/360048258953-Data-security-and-privacy-policies
//   https://help.otter.ai/hc/en-us/articles/26660468516631-...  (six languages)
// Prices re-read from otter.ai/pricing on 2026-08-02 and unchanged: Basic free
//   (300 min/month), Pro $16.99/user/mo monthly or $8.33 annually (1,200 min),
//   Business $30 monthly or $19.99 annually (unlimited), Enterprise custom.
//   Per-seat SaaS pricing moves often — re-read periodically.
// TODO(verify): Otter publishes no numeric accuracy figure on any own-domain page
//   we could read, so this page makes NO accuracy percentage claim for either side.
//   The "Otter will beat us on accuracy" statement is grounded in our own model
//   size (Whisper base, see src/lib/tool-content.ts), not in a benchmark.
// ──────────────────────────────────────────────────────────────────────────────
const otter: Comparison = {
  slug: "otter-ai",
  competitor: "Otter.ai",
  metaTitle:
    "A free Otter.ai alternative that transcribes without uploading audio",
  metaDescription:
    "Our transcriber runs Whisper in your browser with no minute limit and no account, but it is the base model with no speaker labels. Otter.ai wins on accuracy, diarisation and meeting features. Honest comparison.",
  tools: ["audio-transcriber", "subtitle-studio", "video-to-audio", "text-summarizer"],
  related: ["smallpdf", "remove-bg"],
  checkedOn: CHECKED,
  sources: [
    { label: "Otter.ai pricing", url: "https://otter.ai/pricing" },
    { label: "Otter.ai privacy and security", url: "https://otter.ai/privacy-security" },
    {
      label: "Otter.ai help: data security and privacy policies",
      url: "https://help.otter.ai/hc/en-us/articles/360048258953-Data-security-and-privacy-policies",
    },
    {
      label: "Otter.ai help: supported transcription languages",
      url: "https://help.otter.ai/hc/en-us/articles/26660468516631-Transcribe-conversations-in-English-Spanish-French-German-Japanese-or-Chinese-Simplified",
    },
  ],
  en: {
    heading: "A free Otter.ai alternative that never uploads your audio",
    intro:
      "Our transcriber downloads OpenAI's Whisper model to your browser and runs it on your machine. The recording is never uploaded, there is no account, no monthly minute allowance, and no per-conversation time limit. For a confidential interview, a therapy session, a legal call or a medical recording, that is a category difference: the audio simply never exists on anyone else's server.\n\nBut Otter.ai is a much more capable product than we are, and it is not close. We run Whisper base, the small end of the family. Otter is almost certainly running something far larger, and it has speaker labels, live transcription, meeting bots and an entire collaboration layer that we do not have in any form.",
    rows: [
      {
        key: "processing",
        aspect: "Where your audio goes",
        us: "Nowhere. The Whisper model is downloaded to your browser on first use and the audio is decoded and transcribed on your own machine. Nothing is uploaded and nothing is stored anywhere.",
        them: "Uploaded and processed in their cloud. They state data is stored in AWS S3 in a US West region with server-side AES-256 encryption, that they hold SOC 2 Type 2, and that conversations are deleted from the trash after 30 days.",
        edge: "us",
      },
      {
        key: "accuracy",
        aspect: "Transcription accuracy",
        us: "Whisper base — the small end of the family. Expect more errors on strong accents, background noise, crosstalk, proper nouns and technical vocabulary. We publish no accuracy figure and have not benchmarked this.",
        them: "A hosted commercial pipeline. They publish no accuracy percentage either, so neither of us has a number to quote — but running the small checkpoint locally is a real handicap and we would not bet against them.",
        edge: "them",
      },
      {
        key: "speakers",
        aspect: "Speaker labels",
        us: "None at all. Overlapping speakers come out as one undifferentiated stream of text, which makes a multi-person meeting recording much less useful.",
        them: "Speaker identification is a core feature of the product.",
        edge: "them",
      },
      {
        key: "limits",
        aspect: "How much you can transcribe",
        us: "No monthly allowance, no per-file cap and no import counter. The real ceiling is your machine: the whole file is decoded into memory before transcription starts, so long recordings can exhaust the tab.",
        them: "The free Basic plan is 300 transcription minutes a month, a 30-minute cap per conversation, and 3 lifetime audio or video file imports. Paid plans raise those to 1,200 minutes with a 90-minute cap, or unlimited minutes with a 4-hour cap.",
        edge: "us",
      },
      {
        key: "meetings",
        aspect: "Live meetings",
        us: "Nothing. There is no live transcription, no meeting bot, no calendar integration. You record the meeting yourself and transcribe the file afterwards.",
        them: "Live real-time transcription and a meeting assistant that joins Zoom, Microsoft Teams and Google Meet calls.",
        edge: "them",
      },
      {
        key: "collab",
        aspect: "After the transcript exists",
        us: "You get SRT, VTT and plain text to copy or download, and that is the end of it. No search across past transcripts, no comments, no sharing, no summaries.",
        them: "AI chat over your meetings, team workspaces, admin controls with activity logs and usage analytics, custom team vocabulary, API and webhooks, and SSO with SCIM on the enterprise tier.",
        edge: "them",
      },
      {
        key: "cost",
        aspect: "Cost",
        us: "Free, with no account and no seat.",
        them: "A free Basic tier, then Pro at $16.99 per user per month billed monthly or $8.33 billed annually, Business at $30 per user per month billed monthly or $19.99 billed annually, and custom Enterprise pricing. (Read from their pricing page on the date shown above.)",
        edge: "us",
      },
      {
        key: "languages",
        aspect: "Languages",
        us: "The multilingual Whisper base checkpoint, which nominally covers far more languages than six. The caveats are real though: at base size the accuracy in those languages is materially worse than a large checkpoint, there is no language selector, and there is no translate mode — Whisper detects the language itself and you cannot override it if it guesses wrong.",
        them: "They publish support for English, Spanish, French, German, Japanese and Chinese (Simplified).",
        edge: "mixed",
      },
    ],
    theirEdge: [
      "Model quality. We run Whisper base because it has to download to a browser and run on whatever hardware you have. A hosted service has no such constraint. On clean single-speaker audio the gap narrows; on a noisy four-person meeting with accents and jargon it is not a close contest, and pretending otherwise would waste your time.",
      "Speaker diarisation. This is not a nice-to-have for meeting notes — a transcript that cannot tell you who said what is a different and much weaker artifact. We have no speaker labels of any kind and overlapping speech comes out as one undifferentiated stream.",
      "Live transcription and meeting bots. Otter can join a Zoom, Teams or Google Meet call and transcribe as it happens. We require you to already have a recorded file, which means you have to have thought about it in advance.",
      "Everything that happens after the transcript. Search across every meeting you have ever had, AI chat over those meetings, shared team workspaces, comments, custom vocabulary for your product and people names. We hand you an SRT file.",
      "Administration and compliance. SOC 2 Type 2, admin activity logs and usage analytics, SSO and SCIM on the enterprise tier. If your employer needs to govern where meeting recordings live and who can see them, an unmanaged browser tool is not an answer to that question.",
      "It just works while you do something else. Ours decodes the entire file into memory, gives no progress indicator during transcription, has no cancel button, and on a browser without WebGPU can run slower than real time — meaning an hour of audio can take more than an hour of your laptop being busy.",
    ],
    ourLimits: [
      "It runs Whisper base, the small end of the family. A hosted API is almost certainly running something far larger, and the difference shows: expect more errors on strong accents, background noise, crosstalk, proper nouns and technical vocabulary. There are no speaker labels — overlapping speakers come out as one undifferentiated stream of text.",
      "The first run downloads the model from a CDN. Your audio is not uploaded, but the tool is not usable until those files are cached, and on a slow connection the wait before transcription even starts is real.",
      "Speed depends entirely on your hardware. On a browser with WebGPU it is reasonably quick; falling back to WebAssembly can be slower than real time, meaning an hour of audio can take more than an hour. There is no progress indicator during transcription itself and no way to cancel — only the model download shows progress.",
      "The whole file is decoded into memory before transcription starts, so long recordings can exhaust the tab on a modest machine. There is also no language selector and no translate mode — Whisper detects the language itself and you cannot override it — and the segment timestamps are approximate, so subtitles usually need a nudge in a subtitle editor before use.",
    ],
    verdict:
      "Use ours when the recording is one you should not upload. A confidential interview, a source who was promised anonymity, a therapy or medical session, a privileged legal call, an internal investigation. In those cases the accuracy gap is the price of the audio never existing on someone else's infrastructure, and it is usually the right trade. It also helps that there is no 300-minute monthly ceiling and no 30-minute cap per file.\n\nUse Otter.ai for meetings. Speaker labels, live transcription, a bot that joins the call, and search across everything you have ever recorded are the actual job of meeting notes, and we have none of them. If your work is meetings, we are not a substitute and this page is not trying to convince you otherwise.\n\nA practical middle path: record the meeting yourself, transcribe it with our tool, and accept that you will be adding the speaker names by hand.",
    faq: [
      {
        q: "Is there a free alternative to Otter.ai that doesn't upload my recording?",
        a: "Yes. Our transcriber downloads Whisper to your browser and runs it on your own machine, so the audio is never uploaded. There is no account, no monthly minute allowance and no per-file time limit. The trade-off is that we run the small base model with no speaker labels.",
      },
      {
        q: "How accurate is it compared to Otter?",
        a: "We are not going to quote a number, because neither we nor Otter publish a benchmark and inventing one would be dishonest. What we can tell you is architectural: we run Whisper base, the small end of the family, chosen so it can download to a browser and run on ordinary hardware. Expect more errors on accents, background noise, crosstalk and technical vocabulary than a hosted service.",
      },
      {
        q: "Does it identify who is speaking?",
        a: "No. There is no diarisation at all. Overlapping speakers come out as one continuous stream of text, so a multi-person meeting recording is much less useful than it would be from Otter.",
      },
      {
        q: "Is there a monthly minute limit?",
        a: "No. There is no allowance and no counter. The practical limit is your hardware — the whole file is decoded into memory first, and on a browser without WebGPU transcription can run slower than real time.",
      },
      {
        q: "Can it transcribe a live meeting?",
        a: "No. There is no live mode and no meeting bot. You need a recorded file. If live meeting capture is what you need, that is exactly what Otter is built for.",
      },
      {
        q: "Are you affiliated with Otter.ai?",
        a: "No. This is an independent comparison written from their own publicly published pages on the date shown above. We are not affiliated with, sponsored by, or endorsed by them.",
      },
    ],
  },
  ar: {
    heading: "بديل مجاني لـ Otter.ai لا يرفع تسجيلك الصوتي أبداً",
    intro:
      "أداة التفريغ لدينا تُنزّل نموذج Whisper من OpenAI إلى متصفحك وتشغّله على جهازك. التسجيل لا يُرفع أبداً، ولا حساب، ولا حصة دقائق شهرية، ولا حدّ زمني للمحادثة الواحدة. ولمقابلة سرّية أو جلسة علاج نفسي أو مكالمة قانونية أو تسجيل طبي، هذا فرق في النوع لا في الدرجة: الصوت ببساطة لا يوجد أصلاً على خادم أحد آخر.\n\nلكن Otter.ai منتج أقدر منّا بكثير، والفارق ليس ضيّقاً. نحن نشغّل Whisper base، وهو الطرف الصغير من العائلة. وOtter على الأرجح تشغّل ما هو أكبر بكثير، ولديها تسميات للمتحدثين، وتفريغ مباشر، وروبوتات اجتماعات، وطبقة تعاون كاملة لا نملك منها شيئاً بأي شكل.",
    rows: [
      {
        key: "processing",
        aspect: "إلى أين يذهب صوتك",
        us: "إلى لا مكان. يُنزَّل نموذج Whisper إلى متصفحك في أول استخدام، ويُفَك الصوت ويُفرَّغ على جهازك أنت. لا شيء يُرفع ولا شيء يُخزَّن في أي مكان.",
        them: "يُرفع ويُعالَج في سحابتهم. ويصرّحون بأن البيانات تُخزَّن في AWS S3 في منطقة غرب الولايات المتحدة مع تشفير AES-256 من جهة الخادم، وأنهم حاصلون على SOC 2 Type 2، وأن المحادثات تُحذَف من سلة المهملات بعد 30 يوماً.",
        edge: "us",
      },
      {
        key: "accuracy",
        aspect: "دقة التفريغ",
        us: "نموذج Whisper base — الطرف الصغير من العائلة. توقّع أخطاء أكثر مع اللهجات القوية وضجيج الخلفية وتداخل الأصوات وأسماء الأعلام والمصطلحات التقنية. ولا ننشر أي رقم دقة ولم نُجرِ قياساً معيارياً.",
        them: "منظومة تجارية مستضافة. وهم أيضاً لا ينشرون نسبة دقة، فلا يملك أي منّا رقماً يُستشهد به — لكن تشغيل النسخة الصغيرة محلياً عائق حقيقي، ولن نراهن ضدهم.",
        edge: "them",
      },
      {
        key: "speakers",
        aspect: "تسميات المتحدثين",
        us: "لا شيء إطلاقاً. المتحدثون المتداخلون يخرجون كتيّار نص واحد غير مميّز، وهذا يجعل تسجيل اجتماع متعدّد الأشخاص أقل نفعاً بكثير.",
        them: "تمييز المتحدثين ميزة أساسية في المنتج.",
        edge: "them",
      },
      {
        key: "limits",
        aspect: "كم يمكنك تفريغه",
        us: "لا حصة شهرية، ولا سقف للملف الواحد، ولا عدّاد استيراد. السقف الحقيقي جهازك: يُفَك الملف كاملاً في الذاكرة قبل بدء التفريغ، فقد تستنفد التسجيلات الطويلة التبويب.",
        them: "خطة Basic المجانية 300 دقيقة تفريغ شهرياً، وسقف 30 دقيقة للمحادثة الواحدة، و3 عمليات استيراد ملفات صوت أو فيديو مدى الحياة. والخطط المدفوعة ترفع ذلك إلى 1200 دقيقة بسقف 90 دقيقة، أو دقائق غير محدودة بسقف 4 ساعات.",
        edge: "us",
      },
      {
        key: "meetings",
        aspect: "الاجتماعات المباشرة",
        us: "لا شيء. لا تفريغ مباشر، ولا روبوت اجتماعات، ولا تكامل مع التقويم. تسجّل الاجتماع بنفسك ثم تفرّغ الملف لاحقاً.",
        them: "تفريغ مباشر في الوقت الحقيقي، ومساعد اجتماعات ينضم إلى مكالمات Zoom وMicrosoft Teams وGoogle Meet.",
        edge: "them",
      },
      {
        key: "collab",
        aspect: "بعد أن يصبح النص جاهزاً",
        us: "تحصل على SRT وVTT ونص عادي للنسخ أو التنزيل، وينتهي الأمر عند ذلك. بلا بحث عبر النصوص السابقة، ولا تعليقات، ولا مشاركة، ولا ملخّصات.",
        them: "محادثة ذكية فوق اجتماعاتك، ومساحات عمل للفرق، وضوابط إدارية مع سجلات نشاط وتحليلات استخدام، ومفردات مخصّصة للفريق، وواجهة برمجية وWebhooks، وتسجيل دخول موحّد مع SCIM في طبقة المؤسسات.",
        edge: "them",
      },
      {
        key: "cost",
        aspect: "التكلفة",
        us: "مجاني، بلا حساب وبلا مقعد.",
        them: "طبقة Basic مجانية، ثم Pro بـ 16.99 دولاراً للمستخدم شهرياً بفوترة شهرية أو 8.33 دولاراً بفوترة سنوية، وBusiness بـ 30 دولاراً للمستخدم شهرياً أو 19.99 دولاراً سنوياً، وتسعير مخصّص للمؤسسات. (مقروء من صفحة أسعارهم بالتاريخ المذكور أعلاه.)",
        edge: "us",
      },
      {
        key: "languages",
        aspect: "اللغات",
        us: "نسخة Whisper base متعدّدة اللغات، وهي تغطي اسمياً لغات أكثر بكثير من ست. لكن التحفّظات حقيقية: بحجم base تكون الدقة في تلك اللغات أسوأ ماديّاً من نسخة كبيرة، ولا يوجد مُحدِّد للغة، ولا وضع ترجمة — إذ يكتشف Whisper اللغة بنفسه ولا يمكنك تجاوزه إن أخطأ التخمين.",
        them: "ينشرون دعم الإنجليزية والإسبانية والفرنسية والألمانية واليابانية والصينية المبسّطة.",
        edge: "mixed",
      },
    ],
    theirEdge: [
      "جودة النموذج. نحن نشغّل Whisper base لأنه يجب أن يُنزَّل إلى متصفح ويعمل على أي عتاد لديك. أما الخدمة المستضافة فلا يقيّدها ذلك. ومع صوت نظيف لمتحدث واحد يضيق الفارق؛ أما مع اجتماع رباعي صاخب فيه لهجات ومصطلحات، فالمنافسة ليست متقاربة، والادّعاء بغير ذلك مضيعة لوقتك.",
      "تمييز المتحدثين. هذه ليست ميزة تحسينية لمحاضر الاجتماعات — فالنص الذي لا يخبرك من قال ماذا شيء مختلف وأضعف بكثير. نحن لا نملك أي تسميات للمتحدثين، والكلام المتداخل يخرج كتيّار واحد غير مميّز.",
      "التفريغ المباشر وروبوتات الاجتماعات. تستطيع Otter الانضمام إلى مكالمة Zoom أو Teams أو Google Meet والتفريغ أثناء حدوثها. أما نحن فنطلب منك ملفاً مسجّلاً مسبقاً، أي أن عليك التفكير في الأمر مقدّماً.",
      "كل ما يحدث بعد النص. البحث عبر كل اجتماع عقدته يوماً، ومحادثة ذكية فوق تلك الاجتماعات، ومساحات عمل مشتركة، وتعليقات، ومفردات مخصّصة لأسماء منتجك وأشخاصك. نحن نسلّمك ملف SRT.",
      "الإدارة والامتثال. شهادة SOC 2 Type 2، وسجلات نشاط إدارية وتحليلات استخدام، وتسجيل دخول موحّد وSCIM في طبقة المؤسسات. وإن كانت شركتك تحتاج حوكمة مكان حفظ تسجيلات الاجتماعات ومن يراها، فأداة متصفح غير مُدارة ليست جواباً على ذلك السؤال.",
      "تعمل ببساطة بينما تفعل أنت شيئاً آخر. أداتنا تفكّ الملف كاملاً في الذاكرة، ولا تعطي مؤشّر تقدّم أثناء التفريغ، ولا زر إلغاء، وعلى متصفح بلا WebGPU قد تعمل أبطأ من الزمن الحقيقي — أي أن ساعة صوت قد تستغرق أكثر من ساعة من انشغال حاسوبك.",
    ],
    ourLimits: [
      "تشغّل الأداة Whisper base، الطرف الصغير من العائلة. وواجهة برمجية مستضافة تشغّل على الأرجح ما هو أكبر بكثير، والفرق ظاهر: توقّع أخطاء أكثر مع اللهجات القوية وضجيج الخلفية وتداخل الأصوات وأسماء الأعلام والمصطلحات التقنية. ولا توجد تسميات للمتحدثين — فالمتحدثون المتداخلون يخرجون كتيّار نص واحد غير مميّز.",
      "أول تشغيل يُنزّل النموذج من شبكة توزيع محتوى. صوتك لا يُرفع، لكن الأداة غير قابلة للاستخدام حتى تُخزَّن تلك الملفات مؤقتاً، وعلى اتصال بطيء يكون الانتظار قبل بدء التفريغ حقيقياً.",
      "السرعة تعتمد كلياً على عتادك. على متصفح يدعم WebGPU تكون سريعة نسبياً؛ أما التراجع إلى WebAssembly فقد يكون أبطأ من الزمن الحقيقي، أي أن ساعة صوت قد تستغرق أكثر من ساعة. ولا يوجد مؤشّر تقدّم أثناء التفريغ نفسه ولا وسيلة للإلغاء — تنزيل النموذج وحده يُظهر تقدّماً.",
      "يُفَك الملف كاملاً في الذاكرة قبل بدء التفريغ، فقد تستنفد التسجيلات الطويلة التبويب على جهاز متواضع. ولا يوجد مُحدِّد للغة ولا وضع ترجمة — إذ يكتشف Whisper اللغة بنفسه ولا يمكنك تجاوزه — كما أن الطوابع الزمنية للمقاطع تقريبية، فالترجمات غالباً تحتاج ضبطاً في محرّر ترجمات قبل الاستخدام.",
    ],
    verdict:
      "استخدم أداتنا حين يكون التسجيل شيئاً لا ينبغي رفعه: مقابلة سرّية، أو مصدر وُعِد بعدم الكشف عن هويته، أو جلسة علاجية أو طبية، أو مكالمة قانونية محمية، أو تحقيق داخلي. في هذه الحالات يكون فارق الدقة هو ثمن ألّا يوجد الصوت أصلاً على بنية أحد آخر، وهي مقايضة صحيحة عادةً. ويساعد أيضاً ألّا يكون هناك سقف 300 دقيقة شهرياً ولا حدّ 30 دقيقة للملف.\n\nواستخدم Otter.ai للاجتماعات. تسميات المتحدثين والتفريغ المباشر وروبوت ينضم للمكالمة والبحث عبر كل ما سجّلته هي جوهر عمل محاضر الاجتماعات، ونحن لا نملك منها شيئاً. فإن كان عملك اجتماعات، فلسنا بديلاً، وهذه الصفحة لا تحاول إقناعك بغير ذلك.\n\nوهناك طريق وسط عملي: سجّل الاجتماع بنفسك، وفرّغه بأداتنا، واقبل أنك ستضيف أسماء المتحدثين يدوياً.",
    faq: [
      {
        q: "هل يوجد بديل مجاني لـ Otter.ai لا يرفع تسجيلي؟",
        a: "نعم. أداة التفريغ لدينا تُنزّل Whisper إلى متصفحك وتشغّله على جهازك، فلا يُرفع الصوت أبداً. ولا حساب، ولا حصة دقائق شهرية، ولا حدّ زمني للملف. والمقابل أننا نشغّل نموذج base الصغير بلا تسميات للمتحدثين.",
      },
      {
        q: "ما مدى دقتها مقارنةً بـ Otter؟",
        a: "لن نذكر رقماً، لأن لا أحد منّا ولا Otter ينشر قياساً معيارياً، واختلاق رقم سيكون تضليلاً. ما يمكننا قوله معماري: نحن نشغّل Whisper base، الطرف الصغير من العائلة، اختير كي يُنزَّل إلى متصفح ويعمل على عتاد عادي. توقّع أخطاء مع اللهجات وضجيج الخلفية وتداخل الأصوات والمصطلحات التقنية أكثر من خدمة مستضافة.",
      },
      {
        q: "هل تحدّد الأداة من يتكلّم؟",
        a: "لا. لا يوجد تمييز للمتحدثين إطلاقاً. المتحدثون المتداخلون يخرجون كتيّار نص متصل، فتسجيل اجتماع متعدّد الأشخاص أقل نفعاً بكثير ممّا سيكون عليه لدى Otter.",
      },
      {
        q: "هل يوجد حد شهري للدقائق؟",
        a: "لا. لا حصة ولا عدّاد. الحدّ العملي هو عتادك — إذ يُفَك الملف كاملاً في الذاكرة أولاً، وعلى متصفح بلا WebGPU قد يعمل التفريغ أبطأ من الزمن الحقيقي.",
      },
      {
        q: "هل يمكنها تفريغ اجتماع مباشر؟",
        a: "لا. لا يوجد وضع مباشر ولا روبوت اجتماعات. تحتاج ملفاً مسجّلاً. وإن كان التقاط الاجتماعات المباشرة هو ما تحتاجه، فهذا تحديداً ما بُنيت Otter من أجله.",
      },
      {
        q: "هل أنتم على صلة بـ Otter.ai؟",
        a: "لا. هذه مقارنة مستقلة كُتبت من صفحاتهم المنشورة علناً بالتاريخ المذكور أعلاه. لا تربطنا بهم أي علاقة انتساب أو رعاية أو تأييد.",
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Adobe Photoshop
// SCOPE: deliberately narrow. This page compares four specific jobs only —
// background removal, resizing, export/compression and format conversion. It
// does NOT claim a browser tool competes with Photoshop generally, and the copy
// says so explicitly.
//
// Sources read 2026-07-31:
//   https://helpx.adobe.com/photoshop/using/quick-actions/remove-background.html
//   https://helpx.adobe.com/photoshop/using/photoshop-web-faq.html
//   https://helpx.adobe.com/creative-cloud/kb/internet-connection-creative-cloud-apps.html
//   https://helpx.adobe.com/photoshop/desktop/save-and-export/export-files-to-different-formats/export-your-work-using-the-quick-export-as-option.html
// TODO(verify): adobe.com/products/photoshop/plans.html and the Adobe pricing
//   pages could NOT be fetched directly (every attempt timed out; re-attempted
//   2026-08-02 against /creativecloud/plans.html — timed out again, and a
//   domain-scoped search surfaced the pages but not the figures). Indexed
//   figures suggested roughly $22.99/month on an annual commitment and
//   $34.49/month month-to-month for the Photoshop single-app plan, but those
//   were NOT read off Adobe's live page, so NO Photoshop price appears anywhere
//   on this page. Do not add one without reading Adobe's plans page directly.
// TODO(verify): the free-trial length (helpx FAQ suggests 7 days) was also not
//   confirmed on a directly-fetched page. Not claimed here.
// TODO(verify): the Select and Mask / Refine Hair helpx article could not be
//   fetched this session. The only mask claim below is the one quoted on the
//   Remove Background quick-action page, which WAS fetched.
// ──────────────────────────────────────────────────────────────────────────────
const photoshop: Comparison = {
  slug: "photoshop",
  competitor: "Photoshop",
  metaTitle:
    "Free browser tools for four jobs people open Photoshop for",
  metaDescription:
    "Not a Photoshop replacement. An honest look at four narrow jobs — background removal, resizing, export compression and format conversion — where a free browser tool is enough, and where Photoshop is plainly better.",
  tools: [
    "bg-removal",
    "image-resizer",
    "image-compression",
    "image-converter",
    "crop-image",
    "watermark-image",
  ],
  related: ["remove-bg", "tinypng"],
  checkedOn: CHECKED,
  sources: [
    {
      label: "Adobe: Remove Background quick action",
      url: "https://helpx.adobe.com/photoshop/using/quick-actions/remove-background.html",
    },
    {
      label: "Adobe: Photoshop on the web FAQ",
      url: "https://helpx.adobe.com/photoshop/using/photoshop-web-faq.html",
    },
    {
      label: "Adobe: Quick Export as",
      url: "https://helpx.adobe.com/photoshop/desktop/save-and-export/export-files-to-different-formats/export-your-work-using-the-quick-export-as-option.html",
    },
    {
      label: "Adobe: internet connection and Creative Cloud apps",
      url: "https://helpx.adobe.com/creative-cloud/kb/internet-connection-creative-cloud-apps.html",
    },
  ],
  en: {
    heading: "Free browser tools for four jobs people open Photoshop for",
    intro:
      "Let us be honest about the framing first. This is not a Photoshop alternative page and we are not going to pretend a browser tab competes with Photoshop. Photoshop is a thirty-year-old professional application and we are six small single-purpose tools.\n\nWhat this page is about is narrower and, we think, more useful: four specific jobs that people routinely launch Photoshop for and that do not actually need it. Knock the background out of a product photo. Resize an image to fit a form. Get a file under an upload limit. Convert a HEIC to a JPG. If that is the whole task, a free browser tool finishes it in seconds with no install, no Adobe account and no subscription.\n\nOne thing we will not claim here: privacy is not the differentiator against Photoshop. Photoshop is a desktop application and processes your files locally too. The argument for us against Photoshop is cost, installation and speed — nothing more.",
    rows: [
      {
        key: "cost",
        aspect: "Cost and access",
        us: "Free, in a browser, with no account, no install and no subscription. It works on a Chromebook, a borrowed laptop or a phone.",
        // No Adobe price is stated: see the TODO(verify) block above — Adobe's
        // pricing pages could not be fetched directly this session.
        them: "A paid Creative Cloud subscription. Adobe's own FAQ states there is no free version of Photoshop on the web for editing your own photos, and installing Creative Cloud apps requires an Adobe account and an internet connection, with the licence revalidating periodically.",
        edge: "us",
      },
      {
        key: "bgremoval",
        aspect: "Background removal",
        us: "A one-click transparent PNG. Segmentation runs at a fixed 1024 by 1024 internally and the mask is scaled up, so hair, fur, netting and semi-transparent things come back rough — and there is no way to fix it, because you never see the mask.",
        them: "The Remove Background quick action uses Subject Select to detect the subject, create a layer mask and delete the background. Adobe's own documentation notes that complex edges such as hair often require manual touch-up on that mask — which is exactly the point: you are given an editable mask to fix.",
        edge: "them",
      },
      {
        key: "resize",
        aspect: "Resizing",
        us: "Fine for the common case. Pick dimensions or a percentage, get a file back, done. No resampling method choice, no chained operations, no ICC-aware pipeline.",
        them: "Full control of resampling method, non-destructive smart objects, and resizing as one step in a repeatable action rather than a one-off.",
        edge: "mixed",
      },
      {
        key: "export",
        aspect: "Export and compression",
        us: "The browser's built-in encoder, which is a blunt instrument. A tool built on MozJPEG or oxipng will typically reach a smaller file at the same visual quality. Redrawing the image on a canvas also discards all metadata — EXIF, GPS, camera settings, ICC colour profiles and XMP.",
        them: "Documented export controls: PNG with transparency and 8-bit options, JPG quality settings, metadata options including copyright and contact info, and a choice about converting to sRGB, with colour-profile embedding on the full-fidelity formats.",
        edge: "them",
      },
      {
        key: "colour",
        aspect: "Colour management",
        us: "None. Every operation redraws the image onto a canvas, so the ICC profile is gone. A wide-gamut photo can shift colour once its profile is discarded.",
        them: "Colour profiles can be embedded and converted deliberately on export. If the output is going to print, or into a managed colour workflow, this is not optional.",
        edge: "them",
      },
      {
        key: "formats",
        aspect: "Formats",
        us: "Common web formats plus HEIC and SVG input. No AVIF in either direction, no RAW, no PSD, no CMYK, and 8-bit only.",
        them: "RAW, PSD, CMYK, 16- and 32-bit, and the full professional format set.",
        edge: "them",
      },
      {
        key: "batch",
        aspect: "Doing it a hundred times",
        us: "One image at a time, by hand, with a 25 MB ceiling on compression and encoding on the page's main thread.",
        them: "Recorded actions, batch processing and droplets, applied across a folder unattended.",
        edge: "them",
      },
      {
        key: "speed",
        aspect: "Time to finish one small job",
        us: "Open a page, drop the file, download the result. Seconds, from any machine, with nothing installed.",
        them: "Launch a professional application, wait for it, open the file, do the work, export.",
        edge: "us",
      },
    ],
    theirEdge: [
      "The mask is editable, and ours is not. Adobe's own documentation for the Remove Background quick action says complex edges such as hair often require manual touch-up on the layer mask — which is a feature, not a caveat. Photoshop gives you a mask to repair. We give you a finished PNG with the mistakes baked in and no way to correct them short of opening another program.",
      "Colour management. Photoshop can embed and convert ICC profiles deliberately on export. Every one of our image tools redraws through a canvas, which throws the profile away. For anything heading to print or into a managed colour workflow, that alone disqualifies us.",
      "Export quality and control. Adobe documents specific format, quality, metadata and sRGB-conversion options. We have presets and whatever encoder the browser ships, which loses to a dedicated encoder at equal quality.",
      "Non-destructive editing. Layers, masks, smart objects and adjustment layers mean a decision made an hour ago can be revised. Our tools produce a new flattened file each time and forget everything.",
      "Formats and bit depth that we simply do not support: RAW, PSD, CMYK, 16- and 32-bit. Our pipeline is 8-bit RGB and nothing else, which rules out most professional print work outright.",
      "Repeatability. Recorded actions, batch processing and droplets let one decision be applied to a thousand files unattended. We process one image at a time, by hand, on the page's main thread.",
      "And the obvious one worth stating plainly: everything else Photoshop does. Retouching, compositing, generative fill, typography, painting. We are comparing four narrow jobs, not the application.",
    ],
    ourLimits: [
      "Background removal segments at a fixed 1024 by 1024 internally and scales the mask up, so wispy hair, fur, chain-link, netting, motion blur and semi-transparent things like glass or a veil come back rough or partly eaten. Feeding it a bigger photo does not help, and you cannot edit the mask because you never see it.",
      "The output of background removal is a transparent PNG and nothing else — no background replacement, no solid colour, no drop shadow, no re-crop.",
      "Image compression uses the browser's built-in encoder. A tool built on MozJPEG or oxipng will typically reach a smaller file at the same visual quality, and PNG barely benefits at all because an indexed PNG comes back as full RGBA.",
      "Every image tool redraws onto a canvas, which discards all metadata: EXIF, GPS coordinates, camera settings, ICC colour profiles and XMP. Usually a privacy bonus, but a wide-gamut photo can shift colour once its profile is gone.",
      "One image at a time, with a 25 MB compression ceiling, no batch, no ZIP, and no AVIF in either direction. Encoding runs on the main thread, so a large image briefly freezes the page.",
    ],
    verdict:
      "Use ours when the job is small, one-off and finished the moment the file downloads: a background knocked out of a clean-silhouette product shot, an avatar resized to 400 pixels, a screenshot squeezed under a 2 MB form limit, a HEIC from an iPhone turned into a JPG someone else can open. Paying a monthly subscription and waiting for a professional application to launch for any of those is not a good trade.\n\nUse Photoshop when the result has to be right rather than adequate. Anything with hair or fur in the cutout. Anything going to print. Anything where the colour profile matters. Anything you will need to revise later. Anything you have to do to two hundred files.\n\nAnd to repeat the framing, because it matters: this is not a Photoshop replacement, and the privacy argument we make elsewhere on this site does not apply here — Photoshop runs on your desktop and keeps your files local too. Against Photoshop, our case is only that four specific jobs do not need it.",
    faq: [
      {
        q: "Is there a free Photoshop alternative in the browser?",
        a: "Not for Photoshop as a whole, and anyone telling you otherwise is selling something. What we offer is a handful of single-purpose tools that finish four specific jobs — background removal, resizing, compression and format conversion — without an install or a subscription. For the rest of what Photoshop does, there is no substitute here.",
      },
      {
        q: "Is your background removal as good as Photoshop's?",
        a: "No. Ours segments at a fixed 1024 by 1024 and upscales the mask, so hair, fur and semi-transparent edges come back rough, and you cannot repair it because the mask is never exposed. Adobe's own documentation notes that Photoshop's quick action also needs manual touch-up on hair — the difference is that Photoshop lets you do the touching up.",
      },
      {
        q: "Will compressing an image here match Save for Web?",
        a: "No. We use the browser's built-in encoder, which loses to a dedicated one at the same visual quality, and we discard all metadata and colour profiles in the process. If the file is going to print or into a colour-managed workflow, use Photoshop.",
      },
      {
        q: "Are my images uploaded?",
        a: "No — everything runs in your browser. But we want to be straight with you: this is not a differentiator against Photoshop, because Photoshop is a desktop application that also processes your files locally. Against a web-based service it matters; against Photoshop it does not.",
      },
      {
        q: "Can you open a PSD or a RAW file?",
        a: "No. Our tools are 8-bit RGB and handle common web formats plus HEIC and SVG input. No PSD, no RAW, no CMYK, no 16- or 32-bit.",
      },
      {
        q: "Are you affiliated with Adobe?",
        a: "No. Photoshop is a trademark of Adobe. This is an independent comparison written from Adobe's own published documentation on the date shown above. We are not affiliated with, sponsored by, or endorsed by Adobe.",
      },
    ],
  },
  ar: {
    heading: "أدوات متصفح مجانية لأربع مهام يفتح الناس Photoshop من أجلها",
    intro:
      "لنكن صريحين بشأن الإطار أولاً. هذه ليست صفحة بديل لـ Photoshop، ولن ندّعي أن تبويب متصفح ينافس Photoshop. فهو تطبيق احترافي عمره ثلاثون عاماً، ونحن ست أدوات صغيرة أحادية الغرض.\n\nما تتناوله هذه الصفحة أضيق وأنفع في رأينا: أربع مهام محدّدة يفتح الناس Photoshop لأجلها روتينياً وهي لا تحتاجه فعلاً. إزالة خلفية صورة منتج. تغيير حجم صورة لتناسب نموذجاً. تصغير ملف ليمرّ من حدّ رفع. تحويل HEIC إلى JPG. فإن كانت هذه هي المهمة كلها، تُنهيها أداة متصفح مجانية في ثوانٍ بلا تثبيت ولا حساب Adobe ولا اشتراك.\n\nوشيء لن ندّعيه هنا: الخصوصية ليست عامل التمييز في مواجهة Photoshop. فـ Photoshop تطبيق سطح مكتب ويعالج ملفاتك محلياً أيضاً. حجّتنا في مواجهته هي التكلفة والتثبيت والسرعة — لا أكثر.",
    rows: [
      {
        key: "cost",
        aspect: "التكلفة وسهولة الوصول",
        us: "مجاني، داخل متصفح، بلا حساب وبلا تثبيت وبلا اشتراك. يعمل على جهاز Chromebook أو حاسوب مُستعار أو هاتف.",
        them: "اشتراك Creative Cloud مدفوع. وتنصّ الأسئلة الشائعة لدى Adobe نفسها على عدم وجود نسخة مجانية من Photoshop على الويب لتحرير صورك الخاصة، وأن تثبيت تطبيقات Creative Cloud يتطلّب حساب Adobe واتصالاً بالإنترنت، مع إعادة التحقّق من الترخيص دورياً.",
        edge: "us",
      },
      {
        key: "bgremoval",
        aspect: "إزالة الخلفية",
        us: "صورة PNG شفافة بنقرة واحدة. تعمل التجزئة عند 1024 في 1024 داخلياً ويُكبَّر القناع، فيعود الشعر والفرو والشِّباك والأشياء نصف الشفافة خشناً — ولا سبيل لإصلاحه، لأنك لا ترى القناع أصلاً.",
        them: "إجراء Remove Background السريع يستخدم Subject Select لاكتشاف الموضوع وإنشاء قناع طبقة وحذف الخلفية. وتشير وثائق Adobe نفسها إلى أن الحواف المعقّدة كالشعر تحتاج غالباً تعديلاً يدوياً على ذلك القناع — وهذا بالضبط المقصد: يُمنح لك قناع قابل للتحرير كي تصلحه.",
        edge: "them",
      },
      {
        key: "resize",
        aspect: "تغيير الحجم",
        us: "كافٍ للحالة الشائعة. اختر أبعاداً أو نسبة مئوية، واستلم ملفاً، وانتهى الأمر. بلا اختيار لطريقة إعادة العيّنات، وبلا عمليات متسلسلة، وبلا منظومة واعية بملفات ألوان ICC.",
        them: "تحكّم كامل بطريقة إعادة العيّنات، وكائنات ذكية غير مدمِّرة، وتغيير حجم كخطوة ضمن إجراء قابل للتكرار لا كعملية منفردة.",
        edge: "mixed",
      },
      {
        key: "export",
        aspect: "التصدير والضغط",
        us: "محرّك المتصفح المدمج، وهو أداة فظّة. أداة مبنية على MozJPEG أو oxipng ستصل عادةً إلى ملف أصغر عند الجودة البصرية نفسها. كما أن إعادة رسم الصورة على canvas تتخلّص من كل البيانات الوصفية — EXIF وGPS وإعدادات الكاميرا وملفات ألوان ICC وXMP.",
        them: "ضوابط تصدير موثّقة: PNG مع خيارات الشفافية و8 بت، وإعدادات جودة JPG، وخيارات بيانات وصفية تشمل حقوق النشر ومعلومات الاتصال، وخيار التحويل إلى sRGB، مع تضمين ملفات الألوان في الصيغ عالية الأمانة.",
        edge: "them",
      },
      {
        key: "colour",
        aspect: "إدارة الألوان",
        us: "لا شيء. كل عملية تعيد رسم الصورة على canvas، فيختفي ملف ألوان ICC. وقد ينزاح لون صورة واسعة النطاق اللوني بعد التخلّص من ملف ألوانها.",
        them: "يمكن تضمين ملفات الألوان وتحويلها عمداً عند التصدير. وإن كان الناتج ذاهباً إلى الطباعة أو إلى مسار ألوان مُدار، فهذا ليس اختيارياً.",
        edge: "them",
      },
      {
        key: "formats",
        aspect: "الصيغ",
        us: "صيغ الويب الشائعة إضافةً إلى إدخال HEIC وSVG. بلا AVIF في أي اتجاه، وبلا RAW، وبلا PSD، وبلا CMYK، وبعمق 8 بت فقط.",
        them: "صيغ RAW وPSD وCMYK وعمق 16 و32 بت، ومجموعة الصيغ الاحترافية كاملة.",
        edge: "them",
      },
      {
        key: "batch",
        aspect: "تكرار العمل مئة مرة",
        us: "صورة واحدة في كل مرة، يدوياً، بسقف 25 ميغابايت للضغط وترميز يعمل على الخيط الرئيسي للصفحة.",
        them: "إجراءات مسجّلة، ومعالجة دفعية، وقُطيرات (Droplets) تُطبَّق على مجلد كامل دون إشراف.",
        edge: "them",
      },
      {
        key: "speed",
        aspect: "الزمن اللازم لإنهاء مهمة صغيرة واحدة",
        us: "افتح صفحة، أفلت الملف، نزّل النتيجة. ثوانٍ، من أي جهاز، وبلا تثبيت أي شيء.",
        them: "شغّل تطبيقاً احترافياً، وانتظره، وافتح الملف، وأنجز العمل، ثم صدّر.",
        edge: "us",
      },
    ],
    theirEdge: [
      "القناع قابل للتحرير، وقناعنا ليس كذلك. وثائق Adobe نفسها لإجراء Remove Background تقول إن الحواف المعقّدة كالشعر تحتاج غالباً تعديلاً يدوياً على قناع الطبقة — وهذه ميزة لا تحفّظ. فـ Photoshop يمنحك قناعاً لتُصلحه، ونحن نمنحك ملف PNG نهائياً بأخطائه مخبوزة فيه وبلا وسيلة لتصحيحه إلا بفتح برنامج آخر.",
      "إدارة الألوان. يستطيع Photoshop تضمين ملفات ألوان ICC وتحويلها عمداً عند التصدير. وكل أدوات الصور لدينا تعيد الرسم عبر canvas، وهذا يرمي ملف الألوان. ولأي شيء ذاهب إلى الطباعة أو إلى مسار ألوان مُدار، هذا وحده يستبعدنا.",
      "جودة التصدير والتحكّم فيه. توثّق Adobe خيارات محدّدة للصيغة والجودة والبيانات الوصفية والتحويل إلى sRGB. ولدينا إعدادات جاهزة وأي محرّك يشحنه المتصفح، وهو يخسر أمام محرّك مخصّص عند الجودة نفسها.",
      "التحرير غير المدمِّر. الطبقات والأقنعة والكائنات الذكية وطبقات الضبط تعني أن قراراً اتُّخذ قبل ساعة يمكن مراجعته. أما أدواتنا فتُنتج ملفاً مسطّحاً جديداً في كل مرة وتنسى كل شيء.",
      "صيغ وأعماق ألوان لا ندعمها ببساطة: RAW وPSD وCMYK و16 و32 بت. منظومتنا 8 بت RGB ولا شيء غير ذلك، وهذا يستبعد معظم أعمال الطباعة الاحترافية تماماً.",
      "قابلية التكرار. الإجراءات المسجّلة والمعالجة الدفعية والقُطيرات تتيح تطبيق قرار واحد على ألف ملف دون إشراف. ونحن نعالج صورة واحدة في كل مرة، يدوياً، على الخيط الرئيسي للصفحة.",
      "والأمر البديهي الذي يستحق القول صراحةً: كل ما يفعله Photoshop عدا ذلك. التنقيح والتركيب والملء التوليدي والطباعة الفنية والرسم. نحن نقارن أربع مهام ضيّقة، لا التطبيق.",
    ],
    ourLimits: [
      "إزالة الخلفية تُجزّئ عند 1024 في 1024 داخلياً وتُكبّر القناع، فيعود الشعر الرفيع والفرو والشِّباك والسياج المعدني وضبابية الحركة والأشياء نصف الشفافة كالزجاج أو الحجاب خشناً أو مأكولاً جزئياً. وإعطاء الأداة صورة أكبر لا يفيد، ولا يمكنك تحرير القناع لأنك لا تراه أبداً.",
      "ناتج إزالة الخلفية صورة PNG شفافة ولا شيء غير ذلك — بلا استبدال للخلفية، ولا لون خالص، ولا ظل، ولا إعادة قص.",
      "ضغط الصور يستخدم محرّك المتصفح المدمج. أداة مبنية على MozJPEG أو oxipng ستصل عادةً إلى ملف أصغر عند الجودة البصرية نفسها، وصيغة PNG بالكاد تستفيد أصلاً لأن PNG المفهرسة تعود بصيغة RGBA كاملة.",
      "كل أداة صور تعيد الرسم على canvas، وهذا يتخلّص من كل البيانات الوصفية: EXIF وإحداثيات GPS وإعدادات الكاميرا وملفات ألوان ICC وXMP. عادةً مكسب للخصوصية، لكن صورة واسعة النطاق اللوني قد ينزاح لونها بعد اختفاء ملف ألوانها.",
      "صورة واحدة في كل مرة، بسقف ضغط 25 ميغابايت، بلا دفعات وبلا ZIP وبلا AVIF في أي اتجاه. ويعمل الترميز على الخيط الرئيسي، فتتجمّد الصفحة لحظات مع صورة كبيرة.",
    ],
    verdict:
      "استخدم أدواتنا حين تكون المهمة صغيرة ومنفردة وتنتهي لحظة تنزيل الملف: إزالة خلفية صورة منتج ذي حدّ خارجي واضح، أو تصغير صورة شخصية إلى 400 بكسل، أو ضغط لقطة شاشة لتمرّ من حدّ 2 ميغابايت في نموذج، أو تحويل ملف HEIC من آيفون إلى JPG يستطيع غيرك فتحه. ودفع اشتراك شهري وانتظار إقلاع تطبيق احترافي لأيٍّ من ذلك ليس مقايضة جيدة.\n\nواستخدم Photoshop حين يجب أن تكون النتيجة صحيحة لا مقبولة فحسب. أي قصّ فيه شعر أو فرو. أي شيء ذاهب إلى الطباعة. أي شيء يهمّ فيه ملف الألوان. أي شيء ستحتاج لمراجعته لاحقاً. أي شيء عليك تنفيذه على مئتي ملف.\n\nونعيد تأكيد الإطار لأنه مهم: هذه ليست بديلاً عن Photoshop، وحجّة الخصوصية التي نسوقها في مواضع أخرى من هذا الموقع لا تنطبق هنا — فـ Photoshop يعمل على سطح مكتبك ويُبقي ملفاتك محلية أيضاً. وفي مواجهته، حجّتنا الوحيدة أن أربع مهام محدّدة لا تحتاجه.",
    faq: [
      {
        q: "هل يوجد بديل مجاني لـ Photoshop داخل المتصفح؟",
        a: "ليس لـ Photoshop ككل، ومن يخبرك بغير ذلك يبيع لك شيئاً. ما نقدّمه حفنة أدوات أحادية الغرض تُنهي أربع مهام محدّدة — إزالة الخلفية، وتغيير الحجم، والضغط، وتحويل الصيغ — بلا تثبيت ولا اشتراك. أما بقية ما يفعله Photoshop فلا بديل له هنا.",
      },
      {
        q: "هل إزالة الخلفية لديكم بجودة Photoshop؟",
        a: "لا. أداتنا تُجزّئ عند 1024 في 1024 وتكبّر القناع، فتعود حواف الشعر والفرو ونصف الشفاف خشنة، ولا يمكنك إصلاحها لأن القناع غير مكشوف أصلاً. ووثائق Adobe نفسها تشير إلى أن إجراءهم السريع يحتاج أيضاً تعديلاً يدوياً على الشعر — والفرق أن Photoshop يتيح لك إجراء ذلك التعديل.",
      },
      {
        q: "هل يضاهي الضغط هنا خاصية Save for Web؟",
        a: "لا. نستخدم محرّك المتصفح المدمج، وهو يخسر أمام محرّك مخصّص عند الجودة البصرية نفسها، ونتخلّص أثناء ذلك من كل البيانات الوصفية وملفات الألوان. فإن كان الملف ذاهباً إلى الطباعة أو إلى مسار ألوان مُدار، فاستخدم Photoshop.",
      },
      {
        q: "هل تُرفع صوري؟",
        a: "لا — كل شيء يعمل داخل متصفحك. لكننا نريد الصراحة معك: هذا ليس عامل تمييز في مواجهة Photoshop، لأن Photoshop تطبيق سطح مكتب يعالج ملفاتك محلياً أيضاً. الأمر يهم في مواجهة خدمة ويب، لا في مواجهة Photoshop.",
      },
      {
        q: "هل يمكنكم فتح ملف PSD أو RAW؟",
        a: "لا. أدواتنا تعمل بعمق 8 بت RGB وتتعامل مع صيغ الويب الشائعة إضافةً إلى إدخال HEIC وSVG. بلا PSD ولا RAW ولا CMYK ولا 16 أو 32 بت.",
      },
      {
        q: "هل أنتم على صلة بـ Adobe؟",
        a: "لا. Photoshop علامة تجارية لشركة Adobe. وهذه مقارنة مستقلة كُتبت من وثائق Adobe المنشورة بالتاريخ المذكور أعلاه. لا تربطنا بـ Adobe أي علاقة انتساب أو رعاية أو تأييد.",
      },
    ],
  },
};

export const comparisons: Comparison[] = [
  ilovepdf,
  smallpdf,
  tinypng,
  removebg,
  otter,
  photoshop,
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
