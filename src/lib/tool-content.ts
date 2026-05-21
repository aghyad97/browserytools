// ──────────────────────────────────────────────────────────────────────────────
// Per-tool on-page SEO content registry.
//
// Each tool slug (the path segment after /tools/) maps to bilingual content:
//   - intro:    1–2 paragraph "About / how it works" copy
//   - faq:      3–6 question/answer pairs (feeds FAQPage JSON-LD)
//   - steps:    optional "how to use" steps (feeds HowTo JSON-LD)
//   - related:  related tool slugs (internal links — strong for SEO)
//
// All content is hand-authored and factual. Tools without a bespoke entry get a
// templated fallback derived from their name/description/category (see
// buildFallbackContent) so EVERY tool page still gets indexable on-page content.
//
// This is a pure static data module — no client fetching, no runtime cost.
// ──────────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolContentLocale {
  /** 1–2 paragraphs. Plain text; rendered as <p> blocks split on "\n\n". */
  intro: string;
  faq: FaqItem[];
  /** Optional ordered "how to" steps. Emits HowTo JSON-LD when present. */
  steps?: string[];
}

export interface ToolContent {
  en: ToolContentLocale;
  ar: ToolContentLocale;
  /** Related tool slugs (without the /tools/ prefix). */
  related: string[];
}

// Slug = the segment after /tools/, e.g. "json-formatter".
export const toolContent: Record<string, ToolContent> = {
  // ── Newest tools ────────────────────────────────────────────────────────────
  "compress-video": {
    related: ["image-compression", "image-converter", "video", "svg-png"],
    en: {
      intro:
        "Compress Video shrinks the file size of your videos directly in the browser. It runs ffmpeg.wasm on your own device, so your footage is never uploaded to a server — the entire process happens locally and stays private.\n\nYou control the trade-off between size and quality using a CRF (Constant Rate Factor) value, an encoding preset, and an optional target resolution. Lower CRF means higher quality and a larger file; higher CRF means a smaller file with more compression. This makes it easy to fit a video under an email or upload size limit without re-exporting from your editor.",
      faq: [
        {
          q: "Are my videos uploaded anywhere?",
          a: "No. Compression runs entirely in your browser using WebAssembly. Your video file never leaves your device.",
        },
        {
          q: "What is CRF and what value should I use?",
          a: "CRF (Constant Rate Factor) controls quality. Lower values keep more detail but produce larger files; higher values compress harder. A value around 23–28 is a good starting point for most footage.",
        },
        {
          q: "Why is compression slower than a desktop app?",
          a: "Browser compression uses ffmpeg compiled to WebAssembly, which runs on a single thread and is slower than native encoders. Larger or longer videos take more time.",
        },
        {
          q: "Which video formats are supported?",
          a: "Common formats such as MP4 (H.264) work well. Output is typically MP4 so the result plays almost everywhere.",
        },
      ],
      steps: [
        "Select or drag a video file into the tool.",
        "Choose a CRF value, encoding preset, and optional target resolution.",
        "Start compression and wait for ffmpeg.wasm to process the file locally.",
        "Download the smaller video once it finishes.",
      ],
    },
    ar: {
      intro:
        "تقوم أداة ضغط الفيديو بتصغير حجم ملفات الفيديو مباشرة داخل المتصفح. تعمل الأداة باستخدام ffmpeg.wasm على جهازك، لذا لا يتم رفع مقاطعك إلى أي خادم — تتم كل العملية محليًا وتبقى خاصة تمامًا.\n\nيمكنك التحكم في الموازنة بين الحجم والجودة عبر قيمة CRF ووضع الترميز ودقة العرض الاختيارية. القيمة الأقل لـ CRF تعني جودة أعلى وحجمًا أكبر، والقيمة الأعلى تعني حجمًا أصغر وضغطًا أكثر. هذا يسهّل تقليص الفيديو ليتناسب مع حدود حجم البريد أو الرفع دون إعادة التصدير من برنامج المونتاج.",
      faq: [
        {
          q: "هل يتم رفع مقاطع الفيديو إلى أي مكان؟",
          a: "لا. يتم الضغط بالكامل داخل متصفحك باستخدام WebAssembly، ولا يغادر ملف الفيديو جهازك إطلاقًا.",
        },
        {
          q: "ما هي قيمة CRF وأي قيمة يجب أن أستخدم؟",
          a: "تتحكم قيمة CRF في الجودة؛ القيم الأقل تحافظ على التفاصيل بحجم أكبر، والأعلى تضغط بشكل أقوى. القيمة بين 23 و28 نقطة بداية جيدة لمعظم المقاطع.",
        },
        {
          q: "لماذا يكون الضغط أبطأ من تطبيقات سطح المكتب؟",
          a: "لأن الأداة تستخدم ffmpeg مترجمًا إلى WebAssembly، والذي يعمل على نواة واحدة وأبطأ من المُرمِّزات الأصلية. تستغرق المقاطع الأطول والأكبر وقتًا أطول.",
        },
        {
          q: "ما صيغ الفيديو المدعومة؟",
          a: "الصيغ الشائعة مثل MP4 (بترميز H.264) تعمل جيدًا، وعادةً ما يكون الخرج بصيغة MP4 لتشغيله في كل مكان تقريبًا.",
        },
      ],
      steps: [
        "اختر ملف فيديو أو اسحبه إلى الأداة.",
        "حدد قيمة CRF ووضع الترميز والدقة الاختيارية.",
        "ابدأ الضغط وانتظر معالجة الملف محليًا عبر ffmpeg.wasm.",
        "نزّل الفيديو المضغوط بعد انتهاء العملية.",
      ],
    },
  },

  "roman-numeral": {
    related: ["number-base-converter", "calculator", "text-binary", "unit-converter"],
    en: {
      intro:
        "The Roman Numeral Converter translates between modern Arabic numbers (1, 2, 3…) and Roman numerals (I, II, III…) in both directions. Type a number to see its Roman form, or type a Roman numeral to read its decimal value.\n\nIt follows standard Roman numeral rules, including subtractive notation (IV = 4, IX = 9, XL = 40) and the conventional range up to 3999, where each numeral uses the symbols I, V, X, L, C, D, and M.",
      faq: [
        {
          q: "What is the largest number I can convert?",
          a: "Standard Roman numerals go up to 3999 (MMMCMXCIX). Numbers beyond that require overline notation, which is uncommon in everyday use.",
        },
        {
          q: "How does subtractive notation work?",
          a: "When a smaller symbol appears before a larger one, it is subtracted. For example IV is 4 (5 − 1) and IX is 9 (10 − 1).",
        },
        {
          q: "Is there a Roman numeral for zero?",
          a: "No. Roman numerals have no symbol for zero; the system only represents positive whole numbers.",
        },
        {
          q: "Can I convert in both directions?",
          a: "Yes. Enter an Arabic number to get the Roman numeral, or enter a Roman numeral to get the decimal value.",
        },
      ],
    },
    ar: {
      intro:
        "يحوّل محوّل الأرقام الرومانية بين الأرقام العربية الحديثة (1، 2، 3…) والأرقام الرومانية (I، II، III…) في الاتجاهين. اكتب رقمًا لترى صيغته الرومانية، أو اكتب رقمًا رومانيًا لتعرف قيمته العشرية.\n\nتتبع الأداة قواعد الترقيم الروماني المعيارية، بما في ذلك الكتابة الطرحية (IV = 4، IX = 9، XL = 40) والمدى التقليدي حتى 3999، حيث تُستخدم الرموز I وV وX وL وC وD وM.",
      faq: [
        {
          q: "ما أكبر رقم يمكن تحويله؟",
          a: "تصل الأرقام الرومانية المعيارية إلى 3999 (MMMCMXCIX). الأرقام الأكبر تتطلب رمز الخط العلوي، وهو غير شائع في الاستخدام اليومي.",
        },
        {
          q: "كيف تعمل الكتابة الطرحية؟",
          a: "عندما يظهر رمز أصغر قبل رمز أكبر يتم طرحه؛ فمثلًا IV تساوي 4 (5 − 1) وIX تساوي 9 (10 − 1).",
        },
        {
          q: "هل يوجد رمز روماني للصفر؟",
          a: "لا. لا يوجد في الأرقام الرومانية رمز للصفر، فالنظام يمثل الأعداد الصحيحة الموجبة فقط.",
        },
        {
          q: "هل يمكن التحويل في الاتجاهين؟",
          a: "نعم. أدخل رقمًا عربيًا لتحصل على الرقم الروماني، أو أدخل رقمًا رومانيًا لتحصل على القيمة العشرية.",
        },
      ],
    },
  },

  "svg-png": {
    related: ["svg", "image-converter", "image-resizer", "image-compression"],
    en: {
      intro:
        "SVG to PNG converts scalable vector graphics into raster PNG images right in your browser. Because SVGs are resolution-independent, you choose the exact pixel dimensions (or a scale factor) and the tool rasterizes the vector at that size with a transparent or solid background.\n\nThis is useful when you need a fixed-size image for platforms that don't accept SVG — app icons, social media uploads, email signatures, or favicons. Everything is rendered locally on a canvas, so your artwork is never uploaded.",
      faq: [
        {
          q: "Why convert SVG to PNG at all?",
          a: "Many platforms (social networks, some email clients, certain CMSes) don't render SVG. PNG is a universally supported raster format, so converting guarantees the image displays everywhere.",
        },
        {
          q: "Will the PNG keep transparency?",
          a: "Yes. If your SVG has a transparent background, the exported PNG preserves the alpha channel.",
        },
        {
          q: "How do I get a sharp, high-resolution PNG?",
          a: "Set larger output dimensions or a higher scale factor before exporting. Since SVG is vector-based, you can render it at any size without quality loss.",
        },
        {
          q: "Is my file uploaded to a server?",
          a: "No. The SVG is rendered to a canvas and exported entirely in your browser.",
        },
      ],
      steps: [
        "Upload or paste your SVG file.",
        "Choose the output width and height (or a scale factor).",
        "Preview the rasterized result.",
        "Download the PNG.",
      ],
    },
    ar: {
      intro:
        "تحوّل أداة SVG إلى PNG الرسوميات المتجهية القابلة للتحجيم إلى صور نقطية بصيغة PNG داخل متصفحك. وبما أن ملفات SVG مستقلة عن الدقة، يمكنك اختيار أبعاد البكسل بدقة (أو معامل تكبير)، ثم تحوّل الأداة المتجه إلى صورة بذلك الحجم مع خلفية شفافة أو صلبة.\n\nهذا مفيد عندما تحتاج صورة بحجم ثابت لمنصات لا تقبل SVG — مثل أيقونات التطبيقات أو منشورات التواصل الاجتماعي أو التواقيع أو أيقونات المواقع. تتم المعالجة محليًا على عنصر canvas، فلا يتم رفع تصميمك أبدًا.",
      faq: [
        {
          q: "لماذا نحوّل SVG إلى PNG أصلًا؟",
          a: "كثير من المنصات (شبكات التواصل وبعض برامج البريد وأنظمة إدارة المحتوى) لا تعرض SVG. أما PNG فصيغة نقطية مدعومة عالميًا، لذا يضمن التحويل ظهور الصورة في كل مكان.",
        },
        {
          q: "هل تحتفظ صورة PNG بالشفافية؟",
          a: "نعم. إذا كانت خلفية ملف SVG شفافة، فإن ملف PNG الناتج يحافظ على قناة الشفافية (alpha).",
        },
        {
          q: "كيف أحصل على صورة PNG حادة وعالية الدقة؟",
          a: "اختر أبعادًا أكبر أو معامل تكبير أعلى قبل التصدير. وبما أن SVG متجهي، يمكنك عرضه بأي حجم دون فقدان الجودة.",
        },
        {
          q: "هل يُرفع ملفي إلى خادم؟",
          a: "لا. يُعرض ملف SVG على عنصر canvas ويُصدَّر بالكامل داخل متصفحك.",
        },
      ],
      steps: [
        "ارفع ملف SVG أو الصقه.",
        "اختر العرض والارتفاع للخرج (أو معامل تكبير).",
        "عاين النتيجة النقطية.",
        "نزّل ملف PNG.",
      ],
    },
  },

  // ── Highest-traffic tools ─────────────────────────────────────────────────────
  "json-formatter": {
    related: ["yaml-json", "json-csv", "json-to-ts", "base64"],
    en: {
      intro:
        "The JSON Formatter pretty-prints, validates, and minifies JSON. Paste raw or messy JSON and it re-indents the structure with consistent spacing and syntax highlighting, making nested objects and arrays easy to read.\n\nIf the JSON is invalid, it points out the error so you can fix it quickly. You can also sort object keys for consistent diffs, or minify the output to remove all whitespace before shipping to production. Everything runs in your browser — your data is never sent to a server.",
      faq: [
        {
          q: "Is my JSON sent to a server?",
          a: "No. Parsing, formatting, and validation all happen locally in your browser, so sensitive payloads stay on your machine.",
        },
        {
          q: "What does minifying JSON do?",
          a: "Minifying removes all unnecessary whitespace and line breaks, producing the smallest valid JSON. This reduces payload size for APIs and production builds.",
        },
        {
          q: "Why does it say my JSON is invalid?",
          a: "Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, or missing brackets. The validator highlights where parsing fails.",
        },
        {
          q: "Can it sort object keys?",
          a: "Yes. Sorting keys alphabetically produces a canonical order, which is handy for comparing two JSON documents in a diff.",
        },
      ],
      steps: [
        "Paste your JSON into the input area.",
        "Choose Format to pretty-print, or Minify to compact it.",
        "Review any validation errors and fix them.",
        "Copy or download the result.",
      ],
    },
    ar: {
      intro:
        "تقوم أداة تنسيق JSON بتجميل وتحقق وتصغير بيانات JSON. الصق بيانات JSON الخام أو غير المرتبة، فتعيد الأداة ترتيب البنية بمسافات بادئة متناسقة وتظليل لبناء الجملة، ما يسهّل قراءة الكائنات والمصفوفات المتداخلة.\n\nوإذا كانت البيانات غير صالحة، تشير الأداة إلى موضع الخطأ لتصلحه بسرعة. يمكنك أيضًا ترتيب مفاتيح الكائن للحصول على فروقات متناسقة، أو تصغير الخرج بإزالة كل المسافات قبل النشر للإنتاج. تعمل كل العمليات في متصفحك ولا تُرسَل بياناتك إلى أي خادم.",
      faq: [
        {
          q: "هل تُرسَل بيانات JSON إلى خادم؟",
          a: "لا. يتم التحليل والتنسيق والتحقق محليًا في متصفحك، لذا تبقى البيانات الحساسة على جهازك.",
        },
        {
          q: "ماذا يفعل تصغير JSON؟",
          a: "يزيل التصغير كل المسافات وفواصل الأسطر غير الضرورية لإنتاج أصغر JSON صالح، مما يقلل حجم البيانات لواجهات البرمجة وبناءات الإنتاج.",
        },
        {
          q: "لماذا تظهر رسالة أن JSON غير صالح؟",
          a: "الأسباب الشائعة هي الفواصل الزائدة، أو علامات اقتباس مفردة بدل المزدوجة، أو مفاتيح غير محاطة باقتباس، أو أقواس ناقصة. يبيّن المدقق موضع فشل التحليل.",
        },
        {
          q: "هل يمكنها ترتيب مفاتيح الكائن؟",
          a: "نعم. ترتيب المفاتيح أبجديًا ينتج ترتيبًا موحّدًا، وهو مفيد عند مقارنة وثيقتي JSON.",
        },
      ],
      steps: [
        "الصق بيانات JSON في حقل الإدخال.",
        "اختر التنسيق للتجميل أو التصغير لضغطها.",
        "راجع أي أخطاء تحقق وصححها.",
        "انسخ النتيجة أو نزّلها.",
      ],
    },
  },

  "image-converter": {
    related: ["image-compression", "image-resizer", "svg-png", "color-converter"],
    en: {
      intro:
        "The Format Converter changes images between formats such as JPG, PNG, WebP, GIF, BMP, and TIFF. Upload one or several images, pick the target format, and download the converted files — useful for meeting platform requirements or switching to a more efficient format like WebP.\n\nConversion happens entirely in your browser using the Canvas API, so your images are never uploaded. There are no watermarks and no file count limits.",
      faq: [
        {
          q: "Which formats can I convert between?",
          a: "Common web and image formats including JPG, PNG, WebP, GIF, BMP, and TIFF are supported, in both directions.",
        },
        {
          q: "Should I use WebP?",
          a: "WebP usually produces smaller files than JPG or PNG at similar quality, making it a good choice for the web. Use PNG or JPG when you need maximum compatibility.",
        },
        {
          q: "Are my images uploaded to a server?",
          a: "No. Conversion is done locally in your browser, so your images stay private.",
        },
        {
          q: "Does converting reduce quality?",
          a: "Converting to a lossy format like JPG or WebP can introduce some compression. PNG is lossless. The tool keeps quality as high as the target format allows.",
        },
      ],
      steps: [
        "Upload one or more images.",
        "Select the output format.",
        "Convert and preview the result.",
        "Download the converted images.",
      ],
    },
    ar: {
      intro:
        "يحوّل محوّل الصيغ الصور بين صيغ مثل JPG وPNG وWebP وGIF وBMP وTIFF. ارفع صورة أو عدة صور، واختر الصيغة المستهدفة، ثم نزّل الملفات المحوّلة — وهو مفيد لتلبية متطلبات المنصات أو التحويل إلى صيغة أكفأ مثل WebP.\n\nتتم عملية التحويل بالكامل في متصفحك باستخدام Canvas API، فلا تُرفع صورك أبدًا. ولا توجد علامات مائية ولا حد لعدد الملفات.",
      faq: [
        {
          q: "بين أي صيغ يمكنني التحويل؟",
          a: "تُدعم الصيغ الشائعة للويب والصور مثل JPG وPNG وWebP وGIF وBMP وTIFF في الاتجاهين.",
        },
        {
          q: "هل أستخدم صيغة WebP؟",
          a: "عادةً ما تنتج WebP ملفات أصغر من JPG أو PNG بجودة مماثلة، ما يجعلها خيارًا جيدًا للويب. استخدم PNG أو JPG عند الحاجة لأقصى توافق.",
        },
        {
          q: "هل تُرفع صوري إلى خادم؟",
          a: "لا. يتم التحويل محليًا في متصفحك، فتبقى صورك خاصة.",
        },
        {
          q: "هل يقلل التحويل من الجودة؟",
          a: "قد يُدخل التحويل إلى صيغة فاقدة مثل JPG أو WebP بعض الضغط، بينما PNG غير فاقدة. تحافظ الأداة على أعلى جودة تتيحها الصيغة المستهدفة.",
        },
      ],
      steps: [
        "ارفع صورة أو أكثر.",
        "اختر صيغة الخرج.",
        "حوّل وعاين النتيجة.",
        "نزّل الصور المحوّلة.",
      ],
    },
  },

  "image-resizer": {
    related: ["image-compression", "image-converter", "aspect-ratio", "svg-png"],
    en: {
      intro:
        "The Image Resizer changes the dimensions of an image to an exact pixel size or by a percentage. Lock the aspect ratio to avoid distortion, choose an output format, and adjust quality before downloading.\n\nResizing runs fully in your browser with no file size limits and nothing uploaded. It's ideal for preparing images for the web, fitting upload requirements, or generating thumbnails.",
      faq: [
        {
          q: "Will resizing distort my image?",
          a: "Only if you change the width and height independently. Lock the aspect ratio and the tool keeps the proportions intact.",
        },
        {
          q: "Can I make an image larger?",
          a: "Yes, but enlarging a raster image beyond its original size can look soft, because there's no extra detail to add. Downscaling preserves quality best.",
        },
        {
          q: "Are my images uploaded?",
          a: "No. All resizing happens locally in your browser.",
        },
        {
          q: "What output formats are available?",
          a: "You can export to common formats such as PNG, JPG, and WebP, and adjust the quality for lossy formats.",
        },
      ],
      steps: [
        "Upload an image.",
        "Enter new dimensions or a percentage, and lock the aspect ratio if needed.",
        "Pick the output format and quality.",
        "Download the resized image.",
      ],
    },
    ar: {
      intro:
        "تغيّر أداة تغيير حجم الصور أبعاد الصورة إلى حجم محدد بالبكسل أو بنسبة مئوية. اقفل نسبة العرض إلى الارتفاع لتجنب التشوه، واختر صيغة الخرج، واضبط الجودة قبل التنزيل.\n\nيتم التغيير بالكامل في متصفحك دون حد لحجم الملف ودون رفع أي شيء. وهي مثالية لتجهيز الصور للويب أو ملاءمة متطلبات الرفع أو إنشاء صور مصغّرة.",
      faq: [
        {
          q: "هل سيشوّه تغيير الحجم صورتي؟",
          a: "فقط إذا غيّرت العرض والارتفاع بشكل مستقل. اقفل نسبة العرض إلى الارتفاع لتحافظ الأداة على التناسب.",
        },
        {
          q: "هل يمكنني تكبير الصورة؟",
          a: "نعم، لكن تكبير صورة نقطية فوق حجمها الأصلي قد يجعلها تبدو غير حادة لعدم وجود تفاصيل إضافية. التصغير يحافظ على الجودة بشكل أفضل.",
        },
        {
          q: "هل تُرفع صوري؟",
          a: "لا. يتم كل التغيير محليًا في متصفحك.",
        },
        {
          q: "ما صيغ الخرج المتاحة؟",
          a: "يمكنك التصدير إلى صيغ شائعة مثل PNG وJPG وWebP، وضبط الجودة للصيغ الفاقدة.",
        },
      ],
      steps: [
        "ارفع صورة.",
        "أدخل أبعادًا جديدة أو نسبة مئوية، واقفل النسبة عند الحاجة.",
        "اختر صيغة الخرج والجودة.",
        "نزّل الصورة بعد تغيير حجمها.",
      ],
    },
  },

  "password-generator": {
    related: ["password-strength", "hash-generator", "uuid-generator", "text-encryption"],
    en: {
      intro:
        "The Password Generator creates strong, random passwords using your browser's cryptographically secure random number generator. Choose the length and which character types to include — uppercase, lowercase, numbers, and symbols — to match any site's requirements.\n\nLonger passwords with a wider mix of characters are harder to guess or brute-force. Because generation happens locally, the password is never transmitted or stored anywhere.",
      faq: [
        {
          q: "Are generated passwords sent anywhere?",
          a: "No. Passwords are generated locally in your browser using the Web Crypto API and are never transmitted or logged.",
        },
        {
          q: "How long should my password be?",
          a: "At least 12–16 characters is recommended. Longer passwords with mixed character types are exponentially harder to crack.",
        },
        {
          q: "Should I include symbols and numbers?",
          a: "Yes when allowed. Including symbols, numbers, and both letter cases increases entropy and makes the password much stronger.",
        },
        {
          q: "Is it safe to use a generated password?",
          a: "Yes. The generator uses a cryptographically secure source of randomness. Store the result in a password manager so you don't have to memorize it.",
        },
      ],
      steps: [
        "Choose the password length.",
        "Select which character types to include.",
        "Generate the password.",
        "Copy it into your password manager.",
      ],
    },
    ar: {
      intro:
        "ينشئ مولّد كلمات المرور كلمات قوية وعشوائية باستخدام مولّد الأرقام العشوائية الآمن تشفيريًا في متصفحك. اختر الطول وأنواع الأحرف المراد تضمينها — أحرف كبيرة وصغيرة وأرقام ورموز — لتلبية متطلبات أي موقع.\n\nكلمات المرور الأطول ذات المزيج الأوسع من الأحرف يصعب تخمينها أو كسرها بالقوة. وبما أن التوليد يتم محليًا، فإن كلمة المرور لا تُرسَل ولا تُخزَّن في أي مكان.",
      faq: [
        {
          q: "هل تُرسَل كلمات المرور المولّدة إلى أي مكان؟",
          a: "لا. تُولَّد كلمات المرور محليًا في متصفحك باستخدام Web Crypto API ولا تُرسَل أو تُسجَّل أبدًا.",
        },
        {
          q: "ما الطول المناسب لكلمة المرور؟",
          a: "يُنصح بـ 12 إلى 16 حرفًا على الأقل. كلما زاد الطول وتنوّعت الأحرف، صار كسرها أصعب بشكل أُسّي.",
        },
        {
          q: "هل أُضمّن الرموز والأرقام؟",
          a: "نعم عند السماح بذلك. تضمين الرموز والأرقام وحالتي الأحرف يزيد العشوائية ويجعل كلمة المرور أقوى بكثير.",
        },
        {
          q: "هل من الآمن استخدام كلمة مرور مولّدة؟",
          a: "نعم. يستخدم المولّد مصدر عشوائية آمنًا تشفيريًا. احفظ الناتج في مدير كلمات مرور حتى لا تضطر لحفظه.",
        },
      ],
      steps: [
        "اختر طول كلمة المرور.",
        "حدد أنواع الأحرف المراد تضمينها.",
        "ولّد كلمة المرور.",
        "انسخها إلى مدير كلمات المرور لديك.",
      ],
    },
  },

  "qr-generator": {
    related: ["barcode-generator", "qr-scanner", "url-encoder", "base64"],
    en: {
      intro:
        "The QR Code Generator turns text, URLs, contact details, Wi-Fi credentials, and more into a scannable QR code. Customize the size, colors, and error-correction level, then download the result as PNG or SVG.\n\nHigher error-correction levels let the code still scan even if part of it is damaged or covered by a logo, at the cost of a denser pattern. Generation is fully client-side, so the data you encode never leaves your browser.",
      faq: [
        {
          q: "What can I encode in a QR code?",
          a: "Any text, including URLs, plain text, contact cards (vCard), Wi-Fi network details, email addresses, and phone numbers.",
        },
        {
          q: "What is error correction and which level should I use?",
          a: "Error correction adds redundancy so the code still scans when partly obscured. Higher levels (Q or H) survive more damage but produce a denser code. Use H if you overlay a logo.",
        },
        {
          q: "Should I download PNG or SVG?",
          a: "PNG is a ready-to-use image; SVG is vector and scales to any size without blur — ideal for print and large displays.",
        },
        {
          q: "Do QR codes expire?",
          a: "No. A static QR code encodes the data directly and works forever, as long as the destination (e.g., a URL) still exists.",
        },
      ],
      steps: [
        "Enter the text or URL to encode.",
        "Customize size, colors, and error-correction level.",
        "Preview the QR code.",
        "Download it as PNG or SVG.",
      ],
    },
    ar: {
      intro:
        "يحوّل مولّد رمز QR النصوص والروابط وبيانات جهات الاتصال وبيانات Wi-Fi وغيرها إلى رمز QR قابل للمسح. خصّص الحجم والألوان ومستوى تصحيح الأخطاء، ثم نزّل النتيجة بصيغة PNG أو SVG.\n\nتتيح مستويات تصحيح الأخطاء الأعلى مسح الرمز حتى لو تضرر جزء منه أو غطّاه شعار، مقابل نمط أكثر كثافة. ويتم التوليد بالكامل من جهة العميل، فلا تغادر البيانات التي ترمّزها متصفحك.",
      faq: [
        {
          q: "ماذا يمكنني أن أرمّز في رمز QR؟",
          a: "أي نص، بما في ذلك الروابط والنص العادي وبطاقات التعريف (vCard) وبيانات شبكة Wi-Fi والبريد الإلكتروني وأرقام الهاتف.",
        },
        {
          q: "ما تصحيح الأخطاء وأي مستوى أستخدم؟",
          a: "يضيف تصحيح الأخطاء تكرارًا ليبقى الرمز قابلًا للمسح عند حجب جزء منه. المستويات الأعلى (Q أو H) تتحمل ضررًا أكبر لكنها تنتج رمزًا أكثف. استخدم H إذا وضعت شعارًا فوق الرمز.",
        },
        {
          q: "هل أنزّل PNG أم SVG؟",
          a: "PNG صورة جاهزة للاستخدام، أما SVG فمتجهي يتكبّر إلى أي حجم دون تشوّش — مثالي للطباعة والشاشات الكبيرة.",
        },
        {
          q: "هل تنتهي صلاحية رموز QR؟",
          a: "لا. يرمّز رمز QR الثابت البيانات مباشرة ويعمل دائمًا طالما بقي المقصد (مثل رابط) موجودًا.",
        },
      ],
      steps: [
        "أدخل النص أو الرابط المراد ترميزه.",
        "خصّص الحجم والألوان ومستوى تصحيح الأخطاء.",
        "عاين رمز QR.",
        "نزّله بصيغة PNG أو SVG.",
      ],
    },
  },

  "base64": {
    related: ["url-encoder", "text-binary", "hash-generator", "json-formatter"],
    en: {
      intro:
        "Base64 Tools encode and decode data using Base64, a text representation of binary data. Convert plain text or files into a Base64 string, or decode a Base64 string back to its original form. This is essential for embedding images in CSS or HTML (data URIs), transmitting binary data over text-based protocols, and debugging API payloads.\n\nEncoding and decoding run entirely in your browser, so files and secrets you process are never uploaded.",
      faq: [
        {
          q: "What is Base64 used for?",
          a: "It encodes binary data as ASCII text so it can travel safely through text-only channels — embedding images as data URIs, attaching files in JSON, or storing binary in places that expect text.",
        },
        {
          q: "Does Base64 encrypt my data?",
          a: "No. Base64 is an encoding, not encryption. Anyone can decode it. Use a real encryption tool if you need confidentiality.",
        },
        {
          q: "Why is Base64 output larger than the input?",
          a: "Base64 represents every 3 bytes as 4 characters, so encoded data is roughly 33% larger than the original.",
        },
        {
          q: "Can I encode files, not just text?",
          a: "Yes. You can convert images, documents, and other binary files into a Base64 string and back.",
        },
      ],
      steps: [
        "Paste text or upload a file.",
        "Choose Encode or Decode.",
        "Read the converted output.",
        "Copy or download the result.",
      ],
    },
    ar: {
      intro:
        "تقوم أدوات Base64 بترميز البيانات وفك ترميزها باستخدام Base64، وهو تمثيل نصي للبيانات الثنائية. حوّل النص العادي أو الملفات إلى سلسلة Base64، أو فك ترميز سلسلة Base64 لإعادتها إلى شكلها الأصلي. هذا ضروري لتضمين الصور في CSS أو HTML (روابط البيانات) ونقل البيانات الثنائية عبر بروتوكولات نصية وتصحيح بيانات واجهات البرمجة.\n\nيتم الترميز وفك الترميز بالكامل في متصفحك، فلا تُرفع الملفات والأسرار التي تعالجها أبدًا.",
      faq: [
        {
          q: "ما استخدامات Base64؟",
          a: "يرمّز البيانات الثنائية كنص ASCII لتنتقل بأمان عبر القنوات النصية فقط — مثل تضمين الصور كروابط بيانات أو إرفاق ملفات في JSON أو تخزين بيانات ثنائية في أماكن تتوقع نصًا.",
        },
        {
          q: "هل يشفّر Base64 بياناتي؟",
          a: "لا. Base64 ترميز وليس تشفيرًا، ويمكن لأي شخص فك ترميزه. استخدم أداة تشفير حقيقية إذا أردت السرية.",
        },
        {
          q: "لماذا يكون خرج Base64 أكبر من المدخل؟",
          a: "يمثّل Base64 كل 3 بايتات بأربعة أحرف، لذا تكون البيانات المرمّزة أكبر بنحو 33% من الأصل.",
        },
        {
          q: "هل يمكنني ترميز الملفات لا النصوص فقط؟",
          a: "نعم. يمكنك تحويل الصور والمستندات والملفات الثنائية الأخرى إلى سلسلة Base64 والعكس.",
        },
      ],
      steps: [
        "الصق نصًا أو ارفع ملفًا.",
        "اختر الترميز أو فك الترميز.",
        "اقرأ الخرج المحوّل.",
        "انسخ النتيجة أو نزّلها.",
      ],
    },
  },

  "calculator": {
    related: ["unit-converter", "percentage-calculator", "number-base-converter", "loan-calculator"],
    en: {
      intro:
        "The Calculator offers both a basic and a scientific mode. Basic mode handles everyday arithmetic — addition, subtraction, multiplication, and division — while scientific mode adds trigonometric functions, logarithms, exponents, roots, and memory operations.\n\nIt supports full keyboard input, so you can type calculations directly. Everything runs in the browser with no setup, and your calculations are not stored or sent anywhere.",
      faq: [
        {
          q: "What's the difference between basic and scientific mode?",
          a: "Basic mode covers everyday arithmetic. Scientific mode adds functions like sine, cosine, logarithms, exponents, square roots, and memory storage.",
        },
        {
          q: "Can I use my keyboard?",
          a: "Yes. The calculator supports full keyboard input, including numbers, operators, and Enter to evaluate.",
        },
        {
          q: "Are calculations in degrees or radians?",
          a: "Scientific mode lets you choose the angle unit so trigonometric functions return the values you expect.",
        },
        {
          q: "Does it work offline?",
          a: "Once the page is loaded, the calculator runs entirely in your browser and needs no server connection.",
        },
      ],
    },
    ar: {
      intro:
        "توفّر الآلة الحاسبة وضعًا أساسيًا وآخر علميًا. يتعامل الوضع الأساسي مع الحساب اليومي — الجمع والطرح والضرب والقسمة — بينما يضيف الوضع العلمي الدوال المثلثية واللوغاريتمات والأسس والجذور وعمليات الذاكرة.\n\nتدعم الآلة الإدخال الكامل من لوحة المفاتيح، فيمكنك كتابة العمليات مباشرة. وتعمل كليًا في المتصفح دون أي إعداد، ولا تُخزَّن عملياتك أو تُرسَل إلى أي مكان.",
      faq: [
        {
          q: "ما الفرق بين الوضع الأساسي والعلمي؟",
          a: "يغطي الوضع الأساسي الحساب اليومي، بينما يضيف الوضع العلمي دوالًا مثل الجيب وجيب التمام واللوغاريتمات والأسس والجذور التربيعية وتخزين الذاكرة.",
        },
        {
          q: "هل يمكنني استخدام لوحة المفاتيح؟",
          a: "نعم. تدعم الآلة الإدخال الكامل من لوحة المفاتيح، بما في ذلك الأرقام والعوامل ومفتاح Enter للحساب.",
        },
        {
          q: "هل العمليات بالدرجات أم بالراديان؟",
          a: "يتيح الوضع العلمي اختيار وحدة الزاوية لتُرجع الدوال المثلثية القيم التي تتوقعها.",
        },
        {
          q: "هل تعمل دون اتصال؟",
          a: "بمجرد تحميل الصفحة، تعمل الآلة بالكامل في متصفحك دون الحاجة إلى اتصال بخادم.",
        },
      ],
    },
  },

  "pdf": {
    related: ["file-converter", "zip", "image-converter", "image-compression"],
    en: {
      intro:
        "PDF Tools let you merge, split, compress, and rearrange PDF files directly in your browser. Combine several PDFs into one document, extract specific pages, rotate pages, or reduce file size — without installing software or uploading sensitive documents.\n\nAll processing happens locally on your device, so confidential contracts, invoices, and forms never leave your computer. There are no file size limits imposed by a server.",
      faq: [
        {
          q: "Are my PDFs uploaded to a server?",
          a: "No. All operations run locally in your browser, so your documents stay private on your device.",
        },
        {
          q: "Can I merge multiple PDFs into one?",
          a: "Yes. Add several PDF files, arrange their order, and combine them into a single document.",
        },
        {
          q: "How do I reduce a PDF's file size?",
          a: "Use the compress option, which optimizes the document to lower its size while keeping it readable.",
        },
        {
          q: "Can I split a PDF or extract pages?",
          a: "Yes. You can split a PDF into separate files or extract a specific range of pages.",
        },
      ],
      steps: [
        "Upload one or more PDF files.",
        "Choose an action: merge, split, compress, or rotate.",
        "Arrange pages or set options as needed.",
        "Download the resulting PDF.",
      ],
    },
    ar: {
      intro:
        "تتيح أدوات PDF دمج ملفات PDF وتقسيمها وضغطها وإعادة ترتيبها مباشرة في متصفحك. ادمج عدة ملفات في مستند واحد، أو استخرج صفحات محددة، أو دوّر الصفحات، أو قلّص حجم الملف — دون تثبيت برامج أو رفع مستندات حساسة.\n\nتتم كل المعالجة محليًا على جهازك، فلا تغادر العقود والفواتير والنماذج السرية حاسوبك. ولا توجد حدود لحجم الملف يفرضها خادم.",
      faq: [
        {
          q: "هل تُرفع ملفات PDF إلى خادم؟",
          a: "لا. تعمل كل العمليات محليًا في متصفحك، فتبقى مستنداتك خاصة على جهازك.",
        },
        {
          q: "هل يمكنني دمج عدة ملفات PDF في ملف واحد؟",
          a: "نعم. أضف عدة ملفات PDF، ورتّبها، ثم ادمجها في مستند واحد.",
        },
        {
          q: "كيف أقلّل حجم ملف PDF؟",
          a: "استخدم خيار الضغط الذي يحسّن المستند لتقليل حجمه مع إبقائه قابلًا للقراءة.",
        },
        {
          q: "هل يمكنني تقسيم ملف PDF أو استخراج صفحات؟",
          a: "نعم. يمكنك تقسيم الملف إلى ملفات منفصلة أو استخراج نطاق صفحات محدد.",
        },
      ],
      steps: [
        "ارفع ملف PDF واحدًا أو أكثر.",
        "اختر إجراءً: دمج أو تقسيم أو ضغط أو تدوير.",
        "رتّب الصفحات أو اضبط الخيارات حسب الحاجة.",
        "نزّل ملف PDF الناتج.",
      ],
    },
  },

  "color-converter": {
    related: ["color-palette", "css-gradient", "contrast-checker", "color-blindness"],
    en: {
      intro:
        "The Color Converter translates a color between HEX, RGB, and HSL formats with a live preview. Enter a value in any format and instantly see the equivalents, so you can move between the notation a design tool uses and the one your CSS expects.\n\nHEX is compact and common in CSS, RGB maps directly to screen channels, and HSL (hue, saturation, lightness) makes it intuitive to tweak a color's shade. Everything updates in real time as you type.",
      faq: [
        {
          q: "What's the difference between HEX, RGB, and HSL?",
          a: "HEX is a compact six-digit notation. RGB describes a color by its red, green, and blue channels. HSL describes it by hue, saturation, and lightness, which is easier for adjusting tone.",
        },
        {
          q: "Can I convert in any direction?",
          a: "Yes. Enter a value in HEX, RGB, or HSL and the other formats update automatically.",
        },
        {
          q: "Does it support alpha/transparency?",
          a: "Color formats like RGBA and HSLA add an alpha channel for opacity; the converter focuses on the core color value with a live preview.",
        },
        {
          q: "Which format should I use in CSS?",
          a: "All three are valid in CSS. HEX is most common for solid colors, while HSL is handy when you want to programmatically lighten or darken a color.",
        },
      ],
    },
    ar: {
      intro:
        "يحوّل محوّل الألوان لونًا بين صيغ HEX وRGB وHSL مع معاينة حية. أدخل قيمة بأي صيغة لترى المكافئات فورًا، فتنتقل بسهولة بين الصيغة التي يستخدمها برنامج التصميم والصيغة التي يتوقعها كود CSS.\n\nصيغة HEX مختصرة وشائعة في CSS، وRGB تقابل قنوات الشاشة مباشرة، أما HSL (التدرّج والتشبّع والإضاءة) فتجعل ضبط درجة اللون بديهيًا. ويتحدّث كل شيء فوريًا أثناء الكتابة.",
      faq: [
        {
          q: "ما الفرق بين HEX وRGB وHSL؟",
          a: "HEX صيغة مختصرة من ست خانات. وRGB تصف اللون بقنوات الأحمر والأخضر والأزرق. أما HSL فتصفه بالتدرّج والتشبّع والإضاءة، وهو أسهل لضبط الدرجة.",
        },
        {
          q: "هل يمكنني التحويل في أي اتجاه؟",
          a: "نعم. أدخل قيمة بصيغة HEX أو RGB أو HSL وتتحدّث الصيغ الأخرى تلقائيًا.",
        },
        {
          q: "هل يدعم الشفافية (alpha)؟",
          a: "تضيف صيغ مثل RGBA وHSLA قناة شفافية للعتامة؛ ويركّز المحوّل على قيمة اللون الأساسية مع معاينة حية.",
        },
        {
          q: "أي صيغة أستخدم في CSS؟",
          a: "الصيغ الثلاث صالحة في CSS. HEX الأكثر شيوعًا للألوان الصلبة، بينما HSL مفيدة عند الرغبة في تفتيح اللون أو تغميقه برمجيًا.",
        },
      ],
    },
  },

  "hash-generator": {
    related: ["password-generator", "text-encryption", "base64", "uuid-generator"],
    en: {
      intro:
        "The Hash Generator computes cryptographic hashes from text using algorithms including MD5, SHA-1, SHA-256, SHA-384, and SHA-512. A hash is a fixed-length fingerprint of the input: the same input always produces the same hash, but you can't reverse the hash back to the original.\n\nHashes are used to verify file integrity, store password digests, and create checksums. Hashing runs locally in your browser, so the text you hash is never sent anywhere.",
      faq: [
        {
          q: "What is a hash used for?",
          a: "Hashes verify data integrity (checksums), index data, and store password fingerprints. The same input always yields the same hash, which makes it easy to detect changes.",
        },
        {
          q: "Which algorithm should I choose?",
          a: "Use SHA-256 or stronger for security-sensitive work. MD5 and SHA-1 are fast but considered weak against collisions, so avoid them for security purposes.",
        },
        {
          q: "Can a hash be reversed?",
          a: "No. Hashing is one-way by design. You can't recover the original input from the hash, only verify a guess by hashing it and comparing.",
        },
        {
          q: "Is my input sent to a server?",
          a: "No. Hashes are computed locally in your browser, so your text stays private.",
        },
      ],
    },
    ar: {
      intro:
        "يحسب مولّد التجزئة بصمات تشفيرية للنص باستخدام خوارزميات منها MD5 وSHA-1 وSHA-256 وSHA-384 وSHA-512. التجزئة بصمة بطول ثابت للمدخل: المدخل نفسه ينتج دائمًا التجزئة نفسها، لكن لا يمكن عكس التجزئة لاستعادة الأصل.\n\nتُستخدم التجزئات للتحقق من سلامة الملفات وتخزين بصمات كلمات المرور وإنشاء المجاميع الاختبارية. ويتم الحساب محليًا في متصفحك، فلا يُرسَل النص الذي تجزّئه إلى أي مكان.",
      faq: [
        {
          q: "ما استخدام التجزئة؟",
          a: "تتحقق التجزئات من سلامة البيانات (المجاميع الاختبارية) وتفهرس البيانات وتخزّن بصمات كلمات المرور. المدخل نفسه ينتج التجزئة نفسها دائمًا، ما يسهّل اكتشاف التغييرات.",
        },
        {
          q: "أي خوارزمية أختار؟",
          a: "استخدم SHA-256 أو أقوى منها للأعمال الحساسة أمنيًا. أما MD5 وSHA-1 فسريعتان لكنهما ضعيفتان أمام التصادمات، لذا تجنّبهما لأغراض الأمان.",
        },
        {
          q: "هل يمكن عكس التجزئة؟",
          a: "لا. التجزئة أحادية الاتجاه بطبيعتها، فلا يمكن استعادة المدخل الأصلي منها، بل التحقق من تخمين بتجزئته ومقارنته فقط.",
        },
        {
          q: "هل يُرسَل مدخلي إلى خادم؟",
          a: "لا. تُحسب التجزئات محليًا في متصفحك، فيبقى نصك خاصًا.",
        },
      ],
    },
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Templated fallback. For tools without a bespoke entry we derive accurate,
// non-fabricated copy from the tool's name, description, and category. No fake
// specifics, no invented stats — just a clear, indexable About + a couple of
// generic, true FAQ entries that hold for every client-side tool on the site.
// ──────────────────────────────────────────────────────────────────────────────

export interface FallbackInput {
  name: string;
  description: string;
  category: string;
}

export function buildFallbackContent(
  input: FallbackInput,
  locale: "en" | "ar"
): ToolContentLocale {
  const { name, description, category } = input;

  if (locale === "ar") {
    return {
      intro: `${description}\n\n${name} أداة مجانية ضمن فئة «${category}» على BrowseryTools. تعمل بالكامل داخل متصفحك — دون رفع بياناتك إلى خادم ودون تسجيل أو إعلانات أو علامات مائية، مع الحفاظ على خصوصيتك التامة.`,
      faq: [
        {
          q: `هل أداة ${name} مجانية فعلًا؟`,
          a: "نعم. جميع أدوات BrowseryTools مجانية بالكامل دون رسوم خفية أو تسجيل أو اشتراك.",
        },
        {
          q: "هل تُرفع بياناتي إلى خادم؟",
          a: "لا. تعمل الأداة بالكامل في متصفحك على جهازك، فتبقى بياناتك خاصة ولا تُرسَل إلى أي خادم.",
        },
        {
          q: "هل أحتاج إلى تثبيت أي برنامج؟",
          a: "لا. كل ما تحتاجه هو متصفح حديث؛ افتح الصفحة وابدأ الاستخدام فورًا.",
        },
      ],
    };
  }

  return {
    intro: `${description}\n\n${name} is a free tool in the ${category} category on BrowseryTools. It runs entirely in your browser — your data is never uploaded to a server, and there's no registration, no ads, and no watermarks, so your privacy is fully preserved.`,
    faq: [
      {
        q: `Is ${name} really free?`,
        a: "Yes. Every BrowseryTools tool is completely free with no hidden fees, no registration, and no subscription.",
      },
      {
        q: "Is my data uploaded to a server?",
        a: "No. The tool runs entirely in your browser on your device, so your data stays private and is never sent to a server.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. All you need is a modern browser — open the page and start using it right away.",
      },
    ],
  };
}
