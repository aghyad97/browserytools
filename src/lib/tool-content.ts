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

  // ── Wave 1: high-intent compress / convert / hardware-test landing pages ─────
  "compress-image-to-20kb": {
    related: [
      "compress-image-to-50kb",
      "compress-image-to-100kb",
      "compress-signature-20kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "Getting an image under 20 KB is one of the tightest limits you'll meet online. It's the band many government and exam application portals reserve for the small signature and passport-photo fields on a form, where the upload box is often capped somewhere around 10–20 KB. This tool compresses a JPG, PNG, or WebP down toward that ceiling entirely in your browser, so the scan of your signature or ID photo never leaves your device.\n\nYou set 20 KB as the target and the compressor works toward it automatically: it first lowers JPEG quality, and if that isn't enough it steps the pixel dimensions down as well, since a smaller image simply has fewer pixels to encode. Because 20 KB is so small, the result is best-effort — on a busy, full-colour photo the tool may land a little above or below the exact number rather than hitting 20 KB on the nose.\n\nFor form fields that trade-off is usually fine: the reviewer only needs your signature or face to be legible, not print-perfect. If you're specifically shrinking a signature, the dedicated signature tool adds width and height guidance tuned for that use.",
      faq: [
        {
          q: "Why would I need an image under 20 KB?",
          a: "Many application portals — government services, exam boards, admissions systems — cap the signature or photo upload field at a very small size, often in the 10–20 KB range. Compressing to 20 KB lets the file clear that limit.",
        },
        {
          q: "Will 20 KB ruin the quality?",
          a: "For a signature or a small ID photo shown at thumbnail size, 20 KB is usually enough to stay legible. For a large, detailed colour photo the loss is visible, because there simply aren't enough bytes to keep fine detail.",
        },
        {
          q: "What if the tool can't hit exactly 20 KB?",
          a: "The compressor lowers quality and then dimensions to get as close as it can. On very small targets it's best-effort and may land slightly over or under; reduce the dimensions further if you need more headroom.",
        },
        {
          q: "Are my files uploaded?",
          a: "No. Compression runs entirely in your browser, so your signature scan or ID photo stays on your device.",
        },
        {
          q: "Which formats can I compress?",
          a: "JPG, PNG, and WebP. JPEG-based photos compress smallest at this target; a flat PNG signature can also go very low.",
        },
      ],
      steps: [
        "Upload the image you need under 20 KB.",
        "Confirm 20 KB as the target size.",
        "Let the tool lower quality and, if needed, dimensions.",
        "Check it's legible, then download the compressed file.",
      ],
    },
    ar: {
      intro:
        "الوصول بصورة إلى أقل من 20 كيلوبايت من أضيق الحدود التي تصادفها على الإنترنت. وهو النطاق الذي تخصّصه كثير من بوابات التقديم الحكومية وبوابات الاختبارات لحقول التوقيع وصورة الهوية الصغيرة في النموذج، حيث يكون حد الرفع غالبًا في حدود 10 إلى 20 كيلوبايت. تضغط هذه الأداة ملفات JPG أو PNG أو WebP نحو هذا السقف بالكامل داخل متصفحك، فلا يغادر مسح توقيعك أو صورتك الشخصية جهازك.\n\nتحدّد 20 كيلوبايت هدفًا وتعمل الأداة نحوه تلقائيًا: تخفّض أولًا جودة JPEG، وإن لم يكفِ ذلك تقلّل أبعاد البكسل أيضًا، فالصورة الأصغر تحتوي وحدات بكسل أقل للترميز. ولأن 20 كيلوبايت حجم ضئيل جدًا، تكون النتيجة بأفضل جهد ممكن — فمع صورة ملوّنة مزدحمة قد تستقر الأداة فوق الرقم أو تحته قليلًا بدل إصابته بدقة.\n\nبالنسبة لحقول النماذج يكون هذا التنازل مقبولًا عادةً: فالمراجِع يحتاج توقيعك أو وجهك واضحًا فقط، لا بجودة طباعة. وإن كنت تصغّر توقيعًا تحديدًا، فأداة التوقيع المخصصة تضيف إرشادات للعرض والارتفاع مناسبة لذلك.",
      faq: [
        {
          q: "لماذا قد أحتاج صورة أقل من 20 كيلوبايت؟",
          a: "تحدّ كثير من بوابات التقديم — الخدمات الحكومية وهيئات الاختبارات وأنظمة القبول — حجم حقل رفع التوقيع أو الصورة عند قيمة صغيرة جدًا، غالبًا بين 10 و20 كيلوبايت. الضغط إلى 20 كيلوبايت يجعل الملف يمرّ من هذا الحد.",
        },
        {
          q: "هل ستُفسد 20 كيلوبايت الجودة؟",
          a: "بالنسبة لتوقيع أو صورة هوية صغيرة تُعرض بحجم مصغّر، تكفي 20 كيلوبايت عادةً لتبقى واضحة. أما الصورة الملوّنة الكبيرة المليئة بالتفاصيل فيظهر فيها الفقد، إذ لا تكفي البايتات للحفاظ على التفاصيل الدقيقة.",
        },
        {
          q: "ماذا لو لم تصل الأداة إلى 20 كيلوبايت بالضبط؟",
          a: "تخفّض الأداة الجودة ثم الأبعاد لتقترب قدر الإمكان. وعند الأهداف الصغيرة جدًا يكون العمل بأفضل جهد وقد تستقر فوق الرقم أو تحته قليلًا؛ قلّل الأبعاد أكثر إن احتجت هامشًا إضافيًا.",
        },
        {
          q: "هل تُرفع ملفاتي؟",
          a: "لا. يتم الضغط بالكامل في متصفحك، فيبقى مسح توقيعك أو صورة هويتك على جهازك.",
        },
        {
          q: "أي الصيغ يمكنني ضغطها؟",
          a: "JPG وPNG وWebP. الصور القائمة على JPEG تُضغط إلى أصغر حجم عند هذا الهدف، كما يمكن لتوقيع PNG المسطّح أن ينخفض كثيرًا أيضًا.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريدها أقل من 20 كيلوبايت.",
        "أكّد 20 كيلوبايت كحجم مستهدف.",
        "دع الأداة تخفّض الجودة ثم الأبعاد عند الحاجة.",
        "تحقق من وضوحها ثم نزّل الملف المضغوط.",
      ],
    },
  },

  "compress-image-to-50kb": {
    related: [
      "compress-image-to-20kb",
      "compress-image-to-100kb",
      "compress-image-to-200kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "50 KB is the sweet spot a lot of exam and admission portals ask for when they want a real photo — big enough for a recognisable head-and-shoulders shot, small enough to keep their servers light. It's also a comfortable ceiling for the small logo or signature image you paste into an email footer, where anything heavier slows every message down. This tool brings a JPG, PNG, or WebP under 50 KB right in your browser.\n\nSet 50 KB as the target and the compressor reduces JPEG quality first, then trims pixel dimensions if the size is still over budget. Fifty kilobytes leaves a bit more room than the tightest 20 KB fields, so a portrait usually keeps clean skin tones and readable text without obvious blocky artefacts.\n\nEverything happens on your device — nothing is uploaded — and there are no watermarks or account walls, so you can re-compress as many attempts as you need to match a portal's exact rule.",
      faq: [
        {
          q: "What is a 50 KB image good for?",
          a: "Exam and admissions portals often set photo limits around this size, and email signatures stay snappy when the embedded image is 50 KB or less.",
        },
        {
          q: "Is 50 KB enough for a passport-style photo?",
          a: "Usually yes. At the small dimensions those photos are displayed, 50 KB keeps a face clear and colours natural.",
        },
        {
          q: "The tool overshot 50 KB slightly — why?",
          a: "Compression is best-effort: it searches quality and then dimensions to get close. If you need to be strictly under, reduce the width and height a little more.",
        },
        {
          q: "Do you upload my photo?",
          a: "No. It's compressed locally in your browser and never sent to a server.",
        },
        {
          q: "Which format gives the smallest file?",
          a: "A JPG or WebP photo compresses far smaller than PNG at this target; keep PNG for flat graphics or signatures.",
        },
      ],
      steps: [
        "Upload the photo you want under 50 KB.",
        "Set 50 KB as the target size.",
        "Let the tool adjust quality and dimensions.",
        "Preview it, then download the result.",
      ],
    },
    ar: {
      intro:
        "يُعدّ حجم 50 كيلوبايت نقطة التوازن التي تطلبها كثير من بوابات الاختبارات والقبول حين تريد صورة حقيقية — كبيرة بما يكفي لصورة واضحة للرأس والكتفين، وصغيرة بما يبقي خوادمها خفيفة. وهو أيضًا سقف مريح لصورة الشعار أو التوقيع الصغيرة التي تضعها في تذييل بريدك، إذ يبطئ أي حجم أثقل كل رسالة. تضع هذه الأداة ملفات JPG أو PNG أو WebP تحت 50 كيلوبايت مباشرة داخل متصفحك.\n\nتحدّد 50 كيلوبايت هدفًا فتخفّض الأداة جودة JPEG أولًا، ثم تقلّص أبعاد البكسل إن بقي الحجم فوق الميزانية. وخمسون كيلوبايت تترك مساحة أوسع قليلًا من حقول 20 كيلوبايت الأضيق، فتحتفظ صورة الوجه عادةً بألوان بشرة نظيفة ونص مقروء دون تكتّلات واضحة.\n\nكل شيء يجري على جهازك — دون رفع أي ملف — ولا توجد علامات مائية أو تسجيل، فيمكنك إعادة الضغط بأي عدد من المحاولات لمطابقة قاعدة البوابة بدقة.",
      faq: [
        {
          q: "فيمَ يفيد حجم 50 كيلوبايت؟",
          a: "غالبًا ما تضع بوابات الاختبارات والقبول حدود الصور قرب هذا الحجم، كما تبقى تواقيع البريد سريعة حين تكون الصورة المضمّنة 50 كيلوبايت أو أقل.",
        },
        {
          q: "هل تكفي 50 كيلوبايت لصورة بحجم جواز السفر؟",
          a: "نعم عادةً. عند الأبعاد الصغيرة التي تُعرض بها هذه الصور، تُبقي 50 كيلوبايت الوجه واضحًا والألوان طبيعية.",
        },
        {
          q: "لماذا تجاوزت الأداة 50 كيلوبايت قليلًا؟",
          a: "الضغط بأفضل جهد: تبحث الأداة في الجودة ثم الأبعاد للاقتراب من الهدف. إن احتجت أن تبقى تحت الحد تمامًا، قلّل العرض والارتفاع أكثر قليلًا.",
        },
        {
          q: "هل تُرفع صورتي؟",
          a: "لا. تُضغط محليًا في متصفحك ولا تُرسَل إلى أي خادم.",
        },
        {
          q: "أي صيغة تعطي أصغر ملف؟",
          a: "صورة JPG أو WebP تُضغط إلى حجم أصغر بكثير من PNG عند هذا الهدف؛ أبقِ PNG للرسوم المسطّحة أو التواقيع.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريدها أقل من 50 كيلوبايت.",
        "حدّد 50 كيلوبايت كحجم مستهدف.",
        "دع الأداة تضبط الجودة والأبعاد.",
        "عاين النتيجة ثم نزّلها.",
      ],
    },
  },

  "compress-image-to-100kb": {
    related: [
      "compress-image-to-50kb",
      "compress-image-to-200kb",
      "compress-image-to-500kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "100 KB is the limit you bump into on job boards and applicant-tracking systems (ATS), which often cap the profile photo or CV-attachment thumbnail at roughly this size so recruiter dashboards load fast. It's also plenty for a forum or community avatar. This tool compresses your JPG, PNG, or WebP toward 100 KB locally in the browser.\n\nYou give it a 100 KB target; it lowers JPEG quality and, if needed, scales the dimensions down until the file fits. With a whole 100 KB to work with, a headshot generally keeps sharp features and smooth gradients, so it still looks professional on your application.\n\nNo upload, no sign-up, no watermark — useful when a portal rejects your photo for being \"too large\" and you just need a quick, private fix.",
      faq: [
        {
          q: "Why 100 KB specifically?",
          a: "Job portals and ATS platforms commonly cap profile or attachment images near this size, and it's a common avatar limit on forums and communities.",
        },
        {
          q: "Will my headshot still look sharp at 100 KB?",
          a: "Yes, in most cases. 100 KB is generous enough to preserve facial detail and smooth skin tones at typical display sizes.",
        },
        {
          q: "Can it get under 100 KB exactly?",
          a: "It compresses toward the target by adjusting quality and then dimensions; results are best-effort, so it may land just over or under. Trim the dimensions for extra margin.",
        },
        {
          q: "Are files uploaded anywhere?",
          a: "No — all compression is done in your browser, so your photo stays private.",
        },
        {
          q: "PNG or JPG for 100 KB?",
          a: "JPG or WebP for photographs; PNG only if you need a transparent background or crisp flat graphics.",
        },
      ],
      steps: [
        "Upload the photo you need under 100 KB.",
        "Set 100 KB as the target size.",
        "Let the tool lower quality and scale dimensions if needed.",
        "Download the compressed image.",
      ],
    },
    ar: {
      intro:
        "حجم 100 كيلوبايت هو الحد الذي تصطدم به على مواقع التوظيف وأنظمة تتبّع المتقدمين (ATS)، التي غالبًا ما تحدّ صورة الملف الشخصي أو الصورة المصغّرة لمرفق السيرة الذاتية عند هذا الحجم تقريبًا لتحمّل لوحات المسؤولين بسرعة. وهو أيضًا كافٍ تمامًا لصورة رمزية في منتدى أو مجتمع. تضغط هذه الأداة ملف JPG أو PNG أو WebP نحو 100 كيلوبايت محليًا في المتصفح.\n\nتعطيها هدف 100 كيلوبايت فتخفّض جودة JPEG، وتصغّر الأبعاد عند الحاجة حتى يتناسب الملف. ومع توفّر 100 كيلوبايت كاملة، تحتفظ صورة الوجه غالبًا بملامح حادة وتدرّجات ناعمة، فتظل احترافية في طلبك.\n\nدون رفع ولا تسجيل ولا علامة مائية — وهو مفيد حين ترفض البوابة صورتك لأنها «كبيرة جدًا» وتحتاج حلًا سريعًا وخاصًا.",
      faq: [
        {
          q: "لماذا 100 كيلوبايت تحديدًا؟",
          a: "تحدّ بوابات التوظيف وأنظمة ATS صور الملف الشخصي أو المرفقات قرب هذا الحجم عادةً، وهو حدّ شائع للصور الرمزية في المنتديات والمجتمعات.",
        },
        {
          q: "هل ستبقى صورة وجهي حادة عند 100 كيلوبايت؟",
          a: "نعم في معظم الحالات. فـ100 كيلوبايت سخيّة بما يكفي للحفاظ على تفاصيل الوجه ونعومة البشرة عند أحجام العرض المعتادة.",
        },
        {
          q: "هل يمكنها النزول تحت 100 كيلوبايت بالضبط؟",
          a: "تضغط نحو الهدف بضبط الجودة ثم الأبعاد؛ والنتائج بأفضل جهد، فقد تستقر فوق الرقم أو تحته قليلًا. قلّل الأبعاد لهامش إضافي.",
        },
        {
          q: "هل تُرفع الملفات إلى أي مكان؟",
          a: "لا — كل الضغط يجري في متصفحك، فتبقى صورتك خاصة.",
        },
        {
          q: "PNG أم JPG لحجم 100 كيلوبايت؟",
          a: "JPG أو WebP للصور الفوتوغرافية؛ وPNG فقط إن احتجت خلفية شفافة أو رسومًا مسطّحة حادة.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريدها أقل من 100 كيلوبايت.",
        "حدّد 100 كيلوبايت كحجم مستهدف.",
        "دع الأداة تخفّض الجودة وتصغّر الأبعاد عند الحاجة.",
        "نزّل الصورة المضغوطة.",
      ],
    },
  },

  "compress-image-to-200kb": {
    related: [
      "compress-image-to-100kb",
      "compress-image-to-500kb",
      "compress-image-to-1mb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "200 KB is a common upload limit on content-management systems and online marketplaces, where each product or listing photo is capped so pages stay quick and storage stays reasonable. It's roomy enough for a detailed product shot yet light enough to keep a gallery of them loading smoothly. This tool brings a JPG, PNG, or WebP under 200 KB in your browser.\n\nSet the 200 KB target and the compressor reduces quality first, then dimensions if the file is still too big. At this budget, product textures, packaging text, and colour accuracy hold up well, so your listing still looks trustworthy to buyers.\n\nBecause it all runs locally, you can work through a set of listing images one by one without ever uploading originals to a third-party server.",
      faq: [
        {
          q: "What uses a 200 KB limit?",
          a: "Many CMS platforms and marketplace listing tools cap uploaded images around 200 KB to keep pages fast and storage lean.",
        },
        {
          q: "Is 200 KB enough for a product photo?",
          a: "Generally yes — it preserves texture and readable packaging text at the sizes listings display.",
        },
        {
          q: "What if it lands slightly over 200 KB?",
          a: "The tool searches quality and then dimensions to approach the target; nudge the dimensions down if a hard limit rejects the file.",
        },
        {
          q: "Do you upload my listing photos?",
          a: "No. Everything is compressed on your device, so your originals stay private.",
        },
        {
          q: "Which format is smallest at 200 KB?",
          a: "JPG or WebP for photos; PNG only for graphics that need transparency.",
        },
      ],
      steps: [
        "Upload the image you need under 200 KB.",
        "Set 200 KB as the target size.",
        "Let the tool reduce quality and dimensions.",
        "Download the compressed listing image.",
      ],
    },
    ar: {
      intro:
        "حجم 200 كيلوبايت حدّ رفع شائع في أنظمة إدارة المحتوى والأسواق الإلكترونية، حيث تُحدّ كل صورة منتج أو إعلان لتبقى الصفحات سريعة والتخزين معقولًا. وهو رحب بما يكفي لصورة منتج مفصّلة، وخفيف بما يبقي معرضًا كاملًا منها يُحمَّل بسلاسة. تضع هذه الأداة ملفات JPG أو PNG أو WebP تحت 200 كيلوبايت في متصفحك.\n\nتحدّد هدف 200 كيلوبايت فتخفّض الأداة الجودة أولًا، ثم الأبعاد إن بقي الملف كبيرًا. وعند هذه الميزانية تصمد ملامس المنتج ونص العبوة ودقة الألوان جيدًا، فيبقى إعلانك جديرًا بثقة المشترين.\n\nولأن كل شيء يجري محليًا، يمكنك المرور على مجموعة من صور الإعلانات واحدة تلو الأخرى دون رفع الأصول إلى أي خادم خارجي.",
      faq: [
        {
          q: "ما الذي يستخدم حد 200 كيلوبايت؟",
          a: "تحدّ كثير من منصات إدارة المحتوى وأدوات إعلانات الأسواق الصور المرفوعة قرب 200 كيلوبايت لإبقاء الصفحات سريعة والتخزين خفيفًا.",
        },
        {
          q: "هل تكفي 200 كيلوبايت لصورة منتج؟",
          a: "نعم عمومًا — فهي تحافظ على الملمس ونص العبوة المقروء عند الأحجام التي تُعرض بها الإعلانات.",
        },
        {
          q: "ماذا لو استقرت فوق 200 كيلوبايت قليلًا؟",
          a: "تبحث الأداة في الجودة ثم الأبعاد للاقتراب من الهدف؛ قلّل الأبعاد إن رفض حدٌّ صارم الملف.",
        },
        {
          q: "هل تُرفع صور إعلاناتي؟",
          a: "لا. كل شيء يُضغط على جهازك، فتبقى أصولك خاصة.",
        },
        {
          q: "أي صيغة أصغر عند 200 كيلوبايت؟",
          a: "JPG أو WebP للصور؛ وPNG فقط للرسوم التي تحتاج شفافية.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريدها أقل من 200 كيلوبايت.",
        "حدّد 200 كيلوبايت كحجم مستهدف.",
        "دع الأداة تخفّض الجودة والأبعاد.",
        "نزّل صورة الإعلان المضغوطة.",
      ],
    },
  },

  "compress-image-to-500kb": {
    related: [
      "compress-image-to-200kb",
      "compress-image-to-1mb",
      "compress-image-to-100kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "500 KB is less about a hard portal rule and more about good manners and good performance: it's a sensible ceiling for an image you attach to an email so you don't clog someone's inbox, and a solid budget for a web hero or banner image that has to look crisp without dragging down page-load speed. This tool compresses a JPG, PNG, or WebP toward 500 KB locally.\n\nGive it the 500 KB target and it lowers quality, then dimensions only if necessary. Half a megabyte is enough to keep a large, full-width photo looking clean on high-resolution screens while cutting the multi-megabyte bloat that phone cameras produce.\n\nNothing is uploaded, so you can prep hero images or email photos privately and re-run until the size feels right.",
      faq: [
        {
          q: "Why aim for 500 KB?",
          a: "It keeps email attachments courteous and inbox-friendly, and it's a healthy weight for a web hero or banner image that still needs to look sharp.",
        },
        {
          q: "Will a 500 KB hero image look good on a big screen?",
          a: "Yes — at this budget a wide photo stays clean on high-resolution displays while loading far faster than the original.",
        },
        {
          q: "Does it hit exactly 500 KB?",
          a: "It compresses toward the target (quality then dimensions) on a best-effort basis, so expect to land near, not exactly on, 500 KB.",
        },
        {
          q: "Are my images uploaded?",
          a: "No, compression is entirely in-browser, so your photos never leave your device.",
        },
        {
          q: "Should I keep PNG at this size?",
          a: "Use JPG or WebP for photos to get the most out of the 500 KB budget; reserve PNG for graphics that need transparency.",
        },
      ],
      steps: [
        "Upload the image you want under 500 KB.",
        "Set 500 KB as the target size.",
        "Let the tool lower quality and, if needed, dimensions.",
        "Download the optimised image.",
      ],
    },
    ar: {
      intro:
        "حجم 500 كيلوبايت لا يتعلق بقاعدة بوابة صارمة بقدر ما يتعلق بحسن الذوق والأداء الجيد: فهو سقف معقول لصورة ترفقها ببريد كي لا تزحم صندوق وارد أحدهم، وميزانية متينة لصورة رئيسية أو بانر على الويب يجب أن تبدو حادة دون أن تبطئ تحميل الصفحة. تضغط هذه الأداة ملفات JPG أو PNG أو WebP نحو 500 كيلوبايت محليًا.\n\nتعطيها هدف 500 كيلوبايت فتخفّض الجودة، ثم الأبعاد عند الضرورة فقط. ونصف الميغابايت كافٍ لإبقاء صورة كبيرة بعرض كامل نظيفة على الشاشات عالية الدقة، مع قطع التضخّم بحجم عدة ميغابايت الذي تنتجه كاميرات الهواتف.\n\nلا يُرفع أي شيء، فيمكنك تجهيز الصور الرئيسية أو صور البريد بخصوصية وإعادة المحاولة حتى يصبح الحجم مناسبًا.",
      faq: [
        {
          q: "لماذا أستهدف 500 كيلوبايت؟",
          a: "يبقي مرفقات البريد مهذّبة وودودة لصندوق الوارد، وهو وزن صحي لصورة رئيسية أو بانر على الويب لا يزال يحتاج أن يبدو حادًا.",
        },
        {
          q: "هل ستبدو صورة رئيسية بحجم 500 كيلوبايت جيدة على شاشة كبيرة؟",
          a: "نعم — عند هذه الميزانية تبقى صورة عريضة نظيفة على الشاشات عالية الدقة، وتُحمَّل أسرع بكثير من الأصل.",
        },
        {
          q: "هل تصيب 500 كيلوبايت بالضبط؟",
          a: "تضغط نحو الهدف (الجودة ثم الأبعاد) بأفضل جهد، فتوقّع الاستقرار قرب 500 كيلوبايت لا عليها تمامًا.",
        },
        {
          q: "هل تُرفع صوري؟",
          a: "لا، الضغط بالكامل داخل المتصفح، فلا تغادر صورك جهازك.",
        },
        {
          q: "هل أبقي على PNG بهذا الحجم؟",
          a: "استخدم JPG أو WebP للصور للاستفادة القصوى من ميزانية 500 كيلوبايت؛ واحفظ PNG للرسوم التي تحتاج شفافية.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريدها أقل من 500 كيلوبايت.",
        "حدّد 500 كيلوبايت كحجم مستهدف.",
        "دع الأداة تخفّض الجودة والأبعاد عند الحاجة.",
        "نزّل الصورة المحسّنة.",
      ],
    },
  },

  "compress-image-to-1mb": {
    related: [
      "compress-image-to-500kb",
      "compress-image-to-200kb",
      "compress-image-to-100kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "1 MB is the practical comfort zone for everyday sharing: comfortably inside the attachment limits of common email providers, and small enough that chat and messaging apps send it instantly without their own re-compression mangling it further. This tool compresses a JPG, PNG, or WebP down to about 1 MB in the browser.\n\nWith a 1 MB target the compressor barely has to touch a typical photo — it lowers quality gently and only scales the dimensions if the original is enormous. That means you keep near-original detail while shedding the wasteful bulk that modern phone cameras bake into every shot.\n\nSince messaging apps often re-compress whatever you send, handing them a tidy 1 MB file up front gives you more control over the final quality than letting the app crush a 10 MB original.",
      faq: [
        {
          q: "Why compress to 1 MB?",
          a: "It sits comfortably within the attachment limits of common email providers and lets chat apps send the image quickly without heavy re-compression.",
        },
        {
          q: "Will I lose much quality at 1 MB?",
          a: "Very little for a normal photo — 1 MB is generous, so detail stays close to the original.",
        },
        {
          q: "Why not just send the original?",
          a: "Phone photos are often several megabytes; a 1 MB version sends faster and gives you control before a chat app re-compresses it anyway.",
        },
        {
          q: "Are files uploaded?",
          a: "No — it all happens locally in your browser.",
        },
        {
          q: "What formats work?",
          a: "JPG, PNG, and WebP. JPG and WebP produce the smallest photos at this target.",
        },
      ],
      steps: [
        "Upload the image you want around 1 MB.",
        "Set 1 MB as the target size.",
        "Let the tool gently lower quality and, if needed, dimensions.",
        "Download the compressed image.",
      ],
    },
    ar: {
      intro:
        "حجم 1 ميغابايت هو منطقة الراحة العملية للمشاركة اليومية: داخل حدود مرفقات مزوّدي البريد الشائعين بارتياح، وصغير بما يكفي لترسله تطبيقات المحادثة والمراسلة فورًا دون أن يشوّهه ضغطها الإضافي. تضغط هذه الأداة ملفات JPG أو PNG أو WebP إلى نحو 1 ميغابايت في المتصفح.\n\nمع هدف 1 ميغابايت لا تكاد الأداة تمسّ صورة عادية — تخفّض الجودة بلطف ولا تصغّر الأبعاد إلا إذا كان الأصل ضخمًا. وهذا يعني أنك تحتفظ بتفاصيل قريبة من الأصل مع التخلّص من التضخّم المهدر الذي تضعه كاميرات الهواتف الحديثة في كل لقطة.\n\nولأن تطبيقات المراسلة تعيد ضغط ما ترسله غالبًا، فإن تسليمها ملفًا مرتبًا بحجم 1 ميغابايت مسبقًا يمنحك تحكمًا أكبر في الجودة النهائية من ترك التطبيق يسحق أصلًا بحجم 10 ميغابايت.",
      faq: [
        {
          q: "لماذا الضغط إلى 1 ميغابايت؟",
          a: "يقع بارتياح داخل حدود مرفقات مزوّدي البريد الشائعين، ويتيح لتطبيقات المحادثة إرسال الصورة بسرعة دون ضغط ثقيل.",
        },
        {
          q: "هل سأفقد الكثير من الجودة عند 1 ميغابايت؟",
          a: "قليلًا جدًا لصورة عادية — فـ1 ميغابايت سخيّة، وتبقى التفاصيل قريبة من الأصل.",
        },
        {
          q: "لماذا لا أرسل الأصل فقط؟",
          a: "صور الهواتف غالبًا عدة ميغابايت؛ ونسخة 1 ميغابايت ترسَل أسرع وتمنحك تحكمًا قبل أن يعيد تطبيق المحادثة ضغطها على أي حال.",
        },
        {
          q: "هل تُرفع الملفات؟",
          a: "لا — كل شيء يجري محليًا في متصفحك.",
        },
        {
          q: "أي الصيغ تعمل؟",
          a: "JPG وPNG وWebP. وتنتج JPG وWebP أصغر الصور عند هذا الهدف.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريدها بنحو 1 ميغابايت.",
        "حدّد 1 ميغابايت كحجم مستهدف.",
        "دع الأداة تخفّض الجودة بلطف والأبعاد عند الحاجة.",
        "نزّل الصورة المضغوطة.",
      ],
    },
  },

  "compress-jpeg-to-50kb": {
    related: [
      "compress-jpeg-to-100kb",
      "compress-jpeg-to-200kb",
      "compress-image-to-50kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "This tool targets JPEG files specifically and squeezes them under 50 KB in your browser — the size exam portals and email signatures typically want. JPEG is the format most cameras and phones already produce, so you usually don't need to convert anything first.\n\nJPEG is a lossy format: it saves space by discarding detail the eye is least likely to notice, and it groups pixels into 8×8 blocks. Compress it hard and those blocks start to show as faint squares, with haloing around sharp edges — the \"artefacts\" you see on over-compressed images. And every time a JPEG is re-saved it's re-encoded and loses a little more, so the fewer round-trips the better.\n\nTo reach 50 KB the tool lowers JPEG quality first, then reduces dimensions if needed. Because it re-encodes only once, from your original, you keep as much fidelity as 50 KB allows. Nothing is uploaded.",
      faq: [
        {
          q: "Why does my JPEG look blocky after compressing?",
          a: "JPEG discards detail in 8×8 blocks; push the size low enough and those blocks, plus edge halos, become visible. It's inherent to how JPEG saves space.",
        },
        {
          q: "Does re-saving a JPEG lose quality every time?",
          a: "Yes. Each save re-encodes the image and throws away a bit more detail, so compress once from the original rather than repeatedly.",
        },
        {
          q: "What is a 50 KB JPEG good for?",
          a: "Exam-portal photos and email-signature images that need to stay small and load fast.",
        },
        {
          q: "Can it hit exactly 50 KB?",
          a: "It approaches the target best-effort by adjusting quality and then dimensions, landing close rather than exact.",
        },
        {
          q: "Is my JPEG uploaded?",
          a: "No. It's compressed locally in your browser, so it never leaves your device.",
        },
      ],
      steps: [
        "Upload your JPEG file.",
        "Set 50 KB as the target size.",
        "Let the tool re-encode once, lowering quality then dimensions.",
        "Download the smaller JPEG.",
      ],
    },
    ar: {
      intro:
        "تستهدف هذه الأداة ملفات JPEG تحديدًا وتضغطها تحت 50 كيلوبايت في متصفحك — وهو الحجم الذي تطلبه عادةً بوابات الاختبارات وتواقيع البريد. وصيغة JPEG هي ما تنتجه أصلًا معظم الكاميرات والهواتف، فلا تحتاج عادةً لتحويل أي شيء أولًا.\n\nJPEG صيغة فاقدة: توفّر المساحة بالتخلّص من التفاصيل الأقل ملاحظةً للعين، وتجمّع البكسل في كتل 8×8. اضغطها بقوة فتبدأ تلك الكتل بالظهور كمربعات باهتة، مع هالات حول الحواف الحادة — وهي «التشوهات» التي تراها في الصور المفرطة الضغط. وفي كل مرة يُعاد حفظ ملف JPEG يُعاد ترميزه ويفقد قليلًا أكثر، فكلما قلّت مرات الحفظ كان أفضل.\n\nللوصول إلى 50 كيلوبايت تخفّض الأداة جودة JPEG أولًا، ثم تقلّل الأبعاد عند الحاجة. ولأنها تعيد الترميز مرة واحدة فقط من أصلك، تحتفظ بأكبر قدر من الدقة تسمح به 50 كيلوبايت. ولا يُرفع أي شيء.",
      faq: [
        {
          q: "لماذا يبدو ملف JPEG متكتّلًا بعد الضغط؟",
          a: "تتخلّص JPEG من التفاصيل في كتل 8×8؛ وحين تدفع الحجم منخفضًا بما يكفي تظهر تلك الكتل مع هالات الحواف. وهذا متأصل في طريقة توفير JPEG للمساحة.",
        },
        {
          q: "هل يفقد إعادة حفظ JPEG الجودة في كل مرة؟",
          a: "نعم. كل حفظ يعيد ترميز الصورة ويتخلّص من مزيد من التفاصيل، فاضغط مرة واحدة من الأصل بدل التكرار.",
        },
        {
          q: "فيمَ يفيد ملف JPEG بحجم 50 كيلوبايت؟",
          a: "صور بوابات الاختبارات وصور تواقيع البريد التي يجب أن تبقى صغيرة وتُحمَّل بسرعة.",
        },
        {
          q: "هل يصيب 50 كيلوبايت بالضبط؟",
          a: "يقترب من الهدف بأفضل جهد عبر ضبط الجودة ثم الأبعاد، فيستقر قريبًا لا تمامًا.",
        },
        {
          q: "هل يُرفع ملف JPEG؟",
          a: "لا. يُضغط محليًا في متصفحك، فلا يغادر جهازك أبدًا.",
        },
      ],
      steps: [
        "ارفع ملف JPEG.",
        "حدّد 50 كيلوبايت كحجم مستهدف.",
        "دع الأداة تعيد الترميز مرة واحدة، مخفّضةً الجودة ثم الأبعاد.",
        "نزّل ملف JPEG الأصغر.",
      ],
    },
  },

  "compress-jpeg-to-100kb": {
    related: [
      "compress-jpeg-to-50kb",
      "compress-jpeg-to-200kb",
      "compress-image-to-100kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "This tool compresses JPEG files under 100 KB in your browser — a common ceiling for job-portal profile photos, ATS attachment thumbnails, and forum avatars. Since phones and cameras already save JPEG, you can usually drop your photo straight in without converting.\n\nJPEG trades a little detail for a lot of size by encoding the image in 8×8 blocks and discarding subtle information. That's why an over-compressed JPEG shows faint blocky patches and halos around edges, and why re-saving the same JPEG repeatedly degrades it a bit each time — every save is a fresh lossy re-encode. Working from your original in a single pass keeps that loss to a minimum.\n\nWith 100 KB to spend, the tool lowers quality first and only scales dimensions if needed, so a headshot stays sharp enough to look professional. Everything runs locally — nothing is uploaded.",
      faq: [
        {
          q: "Why do compressed JPEGs get blocky halos?",
          a: "JPEG encodes 8×8 pixel blocks and drops fine detail; compress hard and the block edges and halos around high-contrast lines become visible.",
        },
        {
          q: "Does opening and re-saving a JPEG lower its quality?",
          a: "Yes — each save is a new lossy encode that discards a little more detail. Compress once from the original for the best result.",
        },
        {
          q: "What needs a 100 KB JPEG?",
          a: "Job portals and ATS systems often cap profile or attachment images near 100 KB, and it's a typical avatar limit too.",
        },
        {
          q: "Can it land under 100 KB exactly?",
          a: "It's best-effort: it searches quality then dimensions to approach 100 KB, landing close. Trim dimensions if you need to be strictly under.",
        },
        {
          q: "Is my JPEG uploaded?",
          a: "No. Compression is done entirely in your browser.",
        },
      ],
      steps: [
        "Upload your JPEG file.",
        "Set 100 KB as the target size.",
        "Let the tool re-encode once, lowering quality then dimensions.",
        "Download the compressed JPEG.",
      ],
    },
    ar: {
      intro:
        "تضغط هذه الأداة ملفات JPEG تحت 100 كيلوبايت في متصفحك — وهو سقف شائع لصور الملف الشخصي في بوابات التوظيف والصور المصغّرة لمرفقات أنظمة ATS والصور الرمزية في المنتديات. وبما أن الهواتف والكاميرات تحفظ JPEG أصلًا، يمكنك عادةً إسقاط صورتك مباشرة دون تحويل.\n\nتقايض JPEG قليلًا من التفاصيل بكثير من الحجم عبر ترميز الصورة في كتل 8×8 والتخلّص من المعلومات الدقيقة. لهذا يُظهر ملف JPEG المفرط الضغط بقعًا متكتّلة باهتة وهالات حول الحواف، ولهذا يتدهور تكرار حفظ الملف نفسه قليلًا في كل مرة — فكل حفظ إعادة ترميز فاقدة جديدة. والعمل من أصلك في تمريرة واحدة يبقي هذا الفقد عند حدّه الأدنى.\n\nمع توفّر 100 كيلوبايت، تخفّض الأداة الجودة أولًا ولا تصغّر الأبعاد إلا عند الحاجة، فتبقى صورة الوجه حادة بما يكفي لتبدو احترافية. وكل شيء يجري محليًا — دون رفع أي شيء.",
      faq: [
        {
          q: "لماذا تظهر هالات متكتّلة في ملفات JPEG المضغوطة؟",
          a: "ترمّز JPEG كتل بكسل 8×8 وتُسقط التفاصيل الدقيقة؛ فمع الضغط القوي تظهر حواف الكتل والهالات حول الخطوط عالية التباين.",
        },
        {
          q: "هل يقلّل فتح ملف JPEG وإعادة حفظه من جودته؟",
          a: "نعم — كل حفظ ترميز فاقد جديد يتخلّص من مزيد من التفاصيل. اضغط مرة واحدة من الأصل لأفضل نتيجة.",
        },
        {
          q: "ما الذي يحتاج ملف JPEG بحجم 100 كيلوبايت؟",
          a: "غالبًا ما تحدّ بوابات التوظيف وأنظمة ATS صور الملف الشخصي أو المرفقات قرب 100 كيلوبايت، وهو حدّ نموذجي للصور الرمزية أيضًا.",
        },
        {
          q: "هل يمكنها النزول تحت 100 كيلوبايت بالضبط؟",
          a: "بأفضل جهد: تبحث في الجودة ثم الأبعاد للاقتراب من 100 كيلوبايت فتستقر قريبًا. قلّل الأبعاد إن احتجت البقاء تحت الحد تمامًا.",
        },
        {
          q: "هل يُرفع ملف JPEG؟",
          a: "لا. يتم الضغط بالكامل في متصفحك.",
        },
      ],
      steps: [
        "ارفع ملف JPEG.",
        "حدّد 100 كيلوبايت كحجم مستهدف.",
        "دع الأداة تعيد الترميز مرة واحدة، مخفّضةً الجودة ثم الأبعاد.",
        "نزّل ملف JPEG المضغوط.",
      ],
    },
  },

  "compress-jpeg-to-200kb": {
    related: [
      "compress-jpeg-to-100kb",
      "compress-jpeg-to-50kb",
      "compress-image-to-200kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "This tool brings JPEG files under 200 KB in your browser — the kind of limit CMS platforms and online marketplaces set on listing and product photos so their pages stay fast. JPEG is the native format of most cameras and phones, so your shots are usually ready to compress as-is.\n\nBecause JPEG is lossy, it encodes the picture in 8×8 blocks and drops detail the eye tends to miss. Compress too aggressively and you'll see faint blockiness and halos along sharp edges, and each time you re-save a JPEG it re-encodes and loses a little more quality. 200 KB is generous enough that a single, careful re-encode keeps textures and packaging text looking clean.\n\nThe tool lowers JPEG quality first and scales dimensions only if the file is still over budget. It all runs on your device with nothing uploaded, so you can prep a batch of listing photos privately, one at a time.",
      faq: [
        {
          q: "Will 200 KB show JPEG artefacts?",
          a: "Rarely in a noticeable way. 200 KB gives the encoder enough room that block artefacts and edge halos usually stay invisible on a product photo.",
        },
        {
          q: "Why does re-saving my JPEG keep lowering quality?",
          a: "JPEG is lossy, so every save re-encodes and discards a little more detail. Compress once from the original to avoid stacking that loss.",
        },
        {
          q: "What uses a 200 KB JPEG limit?",
          a: "CMS platforms and marketplace listing uploads commonly cap product images around 200 KB to keep pages quick and storage lean.",
        },
        {
          q: "Can it hit exactly 200 KB?",
          a: "It approaches the target best-effort by adjusting quality then dimensions, landing close rather than precisely on 200 KB.",
        },
        {
          q: "Are my JPEGs uploaded?",
          a: "No. Everything is compressed locally in your browser.",
        },
      ],
      steps: [
        "Upload your JPEG file.",
        "Set 200 KB as the target size.",
        "Let the tool re-encode once, lowering quality then dimensions.",
        "Download the compressed JPEG.",
      ],
    },
    ar: {
      intro:
        "تضع هذه الأداة ملفات JPEG تحت 200 كيلوبايت في متصفحك — وهو نوع الحدّ الذي تضعه منصات إدارة المحتوى والأسواق الإلكترونية على صور الإعلانات والمنتجات لتبقى صفحاتها سريعة. وJPEG هي الصيغة الأصلية لمعظم الكاميرات والهواتف، فلقطاتك عادةً جاهزة للضغط كما هي.\n\nولأن JPEG فاقدة، فهي ترمّز الصورة في كتل 8×8 وتُسقط التفاصيل التي تفوت العين عادةً. اضغط بإفراط فسترى تكتّلًا باهتًا وهالات على الحواف الحادة، وفي كل مرة تعيد فيها حفظ JPEG يُعاد ترميزها وتفقد قليلًا من الجودة. و200 كيلوبايت سخيّة بما يكفي لتُبقي إعادة ترميز واحدة متأنية الملامس ونص العبوة نظيفة.\n\nتخفّض الأداة جودة JPEG أولًا ولا تصغّر الأبعاد إلا إذا بقي الملف فوق الميزانية. وكل شيء يجري على جهازك دون رفع أي شيء، فيمكنك تجهيز دفعة من صور الإعلانات بخصوصية، واحدة تلو الأخرى.",
      faq: [
        {
          q: "هل تُظهر 200 كيلوبايت تشوهات JPEG؟",
          a: "نادرًا بشكل ملحوظ. تمنح 200 كيلوبايت المُرمِّز مساحة كافية بحيث تبقى تكتّلات الكتل وهالات الحواف غير مرئية عادةً في صورة منتج.",
        },
        {
          q: "لماذا يستمر إعادة حفظ JPEG في خفض الجودة؟",
          a: "JPEG فاقدة، فكل حفظ يعيد الترميز ويتخلّص من مزيد من التفاصيل. اضغط مرة واحدة من الأصل لتجنّب تراكم هذا الفقد.",
        },
        {
          q: "ما الذي يستخدم حد JPEG بحجم 200 كيلوبايت؟",
          a: "تحدّ منصات إدارة المحتوى ومرفوعات إعلانات الأسواق صور المنتجات قرب 200 كيلوبايت عادةً لإبقاء الصفحات سريعة والتخزين خفيفًا.",
        },
        {
          q: "هل يصيب 200 كيلوبايت بالضبط؟",
          a: "يقترب من الهدف بأفضل جهد عبر ضبط الجودة ثم الأبعاد، فيستقر قريبًا لا تمامًا على 200 كيلوبايت.",
        },
        {
          q: "هل تُرفع ملفات JPEG؟",
          a: "لا. كل شيء يُضغط محليًا في متصفحك.",
        },
      ],
      steps: [
        "ارفع ملف JPEG.",
        "حدّد 200 كيلوبايت كحجم مستهدف.",
        "دع الأداة تعيد الترميز مرة واحدة، مخفّضةً الجودة ثم الأبعاد.",
        "نزّل ملف JPEG المضغوط.",
      ],
    },
  },

  "compress-signature-20kb": {
    related: [
      "compress-image-to-20kb",
      "compress-image-to-50kb",
      "image-compression",
      "image-resizer",
    ],
    en: {
      intro:
        "A scanned or photographed signature almost always needs to be tiny. Many government and job-application portals reserve a 10–20 KB band for the signature field, separate from the photo field, and reject anything larger. This tool compresses your signature image under that ceiling in the browser and adds guidance specific to signatures.\n\nFor a clean result, crop tightly to the ink and aim for roughly 140×60 pixels — the small, wide shape these boxes expect. A signature is essentially dark ink on a white background, which compresses extremely well, so hitting 20 KB is far easier than with a full photo. If your scan looks grey, raising the contrast so the ink is near-black on near-white keeps it crisp at small sizes.\n\nCompression is best-effort at these tiny targets, but signatures rarely fight it. Nothing is uploaded — your signature stays entirely on your device.",
      faq: [
        {
          q: "How small should a signature file be?",
          a: "Many application portals cap the signature field around 10–20 KB, separate from the photo field. This tool targets that band.",
        },
        {
          q: "What dimensions work best for a signature?",
          a: "Roughly 140×60 pixels, cropped tightly to the ink, matches the narrow box these forms use.",
        },
        {
          q: "My scanned signature looks faint — any tips?",
          a: "Raise the contrast so the ink is dark on a white background before compressing; it stays legible even at 20 KB.",
        },
        {
          q: "Why is a signature easier to shrink than a photo?",
          a: "It's mostly flat white with thin dark strokes, which compresses much more efficiently than a detailed colour photo.",
        },
        {
          q: "Is my signature uploaded anywhere?",
          a: "No. It's processed entirely in your browser, so your signature never leaves your device.",
        },
      ],
      steps: [
        "Upload your scanned or photographed signature.",
        "Crop tightly to the ink, around 140×60 pixels.",
        "Boost contrast if the ink looks grey, then target 20 KB.",
        "Download the compressed signature.",
      ],
    },
    ar: {
      intro:
        "صورة التوقيع الممسوحة أو الملتقَطة تحتاج غالبًا أن تكون صغيرة جدًا. فكثير من بوابات الخدمات الحكومية وطلبات التوظيف تخصّص نطاقًا بين 10 و20 كيلوبايت لحقل التوقيع، منفصلًا عن حقل الصورة، وترفض أي حجم أكبر. تضغط هذه الأداة صورة توقيعك تحت هذا السقف في المتصفح، وتضيف إرشادات خاصة بالتواقيع.\n\nللحصول على نتيجة نظيفة، اقتصص بإحكام حول الحبر واستهدف نحو 140×60 بكسل — وهو الشكل الصغير العريض الذي تتوقعه هذه الحقول. والتوقيع في جوهره حبر داكن على خلفية بيضاء، وهو ما يُضغط بكفاءة عالية، فبلوغ 20 كيلوبايت أسهل بكثير منه مع صورة كاملة. وإن بدا مسحك رماديًا، فرفع التباين ليصبح الحبر شبه أسود على شبه أبيض يبقيه حادًا عند الأحجام الصغيرة.\n\nالضغط بأفضل جهد عند هذه الأهداف الصغيرة، لكن التواقيع نادرًا ما تقاومه. ولا يُرفع أي شيء — يبقى توقيعك بالكامل على جهازك.",
      faq: [
        {
          q: "ما مدى صِغَر ملف التوقيع المطلوب؟",
          a: "تحدّ كثير من بوابات التقديم حقل التوقيع قرب 10 إلى 20 كيلوبايت، منفصلًا عن حقل الصورة. وتستهدف هذه الأداة هذا النطاق.",
        },
        {
          q: "ما الأبعاد الأنسب للتوقيع؟",
          a: "نحو 140×60 بكسل، مقتصًّا بإحكام حول الحبر، يطابق الحقل الضيق الذي تستخدمه هذه النماذج.",
        },
        {
          q: "توقيعي الممسوح يبدو باهتًا — أي نصائح؟",
          a: "ارفع التباين ليصبح الحبر داكنًا على خلفية بيضاء قبل الضغط؛ فيبقى مقروءًا حتى عند 20 كيلوبايت.",
        },
        {
          q: "لماذا تصغير التوقيع أسهل من الصورة؟",
          a: "لأنه في معظمه أبيض مسطّح مع خطوط داكنة رفيعة، وهو ما يُضغط بكفاءة أكبر بكثير من صورة ملوّنة مفصّلة.",
        },
        {
          q: "هل يُرفع توقيعي إلى أي مكان؟",
          a: "لا. يُعالَج بالكامل في متصفحك، فلا يغادر توقيعك جهازك أبدًا.",
        },
      ],
      steps: [
        "ارفع توقيعك الممسوح أو الملتقَط.",
        "اقتصص بإحكام حول الحبر، بنحو 140×60 بكسل.",
        "ارفع التباين إن بدا الحبر رماديًا، ثم استهدف 20 كيلوبايت.",
        "نزّل التوقيع المضغوط.",
      ],
    },
  },

  "heic-to-jpg": {
    related: ["heic-to-png", "image-converter", "image-compression"],
    en: {
      intro:
        "Since iOS 11, iPhones and iPads save photos as HEIC by default — a modern, space-saving format. The trouble shows up the moment you try to use those photos somewhere else: many websites, upload forms, older Windows apps, and colleagues on non-Apple devices simply can't open a .heic file. Converting to JPG turns your photo into the format everything understands.\n\nThis tool decodes HEIC locally using a WebAssembly decoder and re-encodes to JPG right in your browser — your photos are never uploaded. JPG is universally compatible and keeps files reasonably small, which is exactly what you want for sharing, printing services, and web uploads.\n\nOne honest trade-off: JPG is lossy, so the conversion re-compresses the image and won't be a pixel-perfect copy of the HEIC original. For everyday photos the difference is invisible; if you need lossless output or transparency, convert to PNG instead.",
      faq: [
        {
          q: "Why do my iPhone photos show as HEIC?",
          a: "Since iOS 11, Apple uses HEIC by default because it stores photos in less space than JPG at similar quality.",
        },
        {
          q: "Why convert HEIC to JPG?",
          a: "JPG opens everywhere — websites, upload forms, Windows apps, and non-Apple devices — while HEIC is often rejected or unreadable.",
        },
        {
          q: "Does converting to JPG lose quality?",
          a: "JPG is lossy, so it re-compresses the photo; the change is usually invisible for normal photos. Choose PNG if you need lossless output.",
        },
        {
          q: "Are my photos uploaded?",
          a: "No. HEIC is decoded and re-encoded entirely in your browser using WebAssembly.",
        },
        {
          q: "Can I convert several photos at once?",
          a: "Yes — convert your HEIC photos to JPG and download the results.",
        },
      ],
      steps: [
        "Upload one or more HEIC photos.",
        "The tool decodes them locally with a WebAssembly decoder.",
        "It re-encodes each photo to JPG in your browser.",
        "Download the converted JPG files.",
      ],
    },
    ar: {
      intro:
        "منذ نظام iOS 11، تحفظ أجهزة آيفون وآيباد الصور بصيغة HEIC افتراضيًا — وهي صيغة حديثة موفّرة للمساحة. تظهر المشكلة لحظة محاولتك استخدام تلك الصور في مكان آخر: فكثير من المواقع ونماذج الرفع وبرامج ويندوز القديمة والزملاء على أجهزة غير آبل لا يستطيعون ببساطة فتح ملف ‎.heic. والتحويل إلى JPG يجعل صورتك بالصيغة التي يفهمها كل شيء.\n\nتفكّ هذه الأداة ترميز HEIC محليًا عبر مفكّك WebAssembly وتعيد الترميز إلى JPG داخل متصفحك مباشرة — فلا تُرفع صورك أبدًا. وJPG متوافقة عالميًا وتبقي الملفات صغيرة نسبيًا، وهو تمامًا ما تريده للمشاركة وخدمات الطباعة والرفع على الويب.\n\nمقايضة واحدة بصدق: JPG صيغة فاقدة، فالتحويل يعيد ضغط الصورة ولن يكون نسخة مطابقة تمامًا لأصل HEIC. وللصور اليومية يكون الفرق غير مرئي؛ وإن احتجت خرجًا بلا فقد أو شفافية، فحوّل إلى PNG بدلًا من ذلك.",
      faq: [
        {
          q: "لماذا تظهر صور آيفون بصيغة HEIC؟",
          a: "منذ iOS 11 تستخدم آبل HEIC افتراضيًا لأنها تخزّن الصور بمساحة أقل من JPG بجودة مماثلة.",
        },
        {
          q: "لماذا أحوّل HEIC إلى JPG؟",
          a: "JPG تفتح في كل مكان — المواقع ونماذج الرفع وبرامج ويندوز والأجهزة غير الآبل — بينما تُرفض HEIC أو تتعذّر قراءتها غالبًا.",
        },
        {
          q: "هل يفقد التحويل إلى JPG الجودة؟",
          a: "JPG فاقدة، فتعيد ضغط الصورة؛ والتغيّر غير مرئي عادةً للصور العادية. اختر PNG إن احتجت خرجًا بلا فقد.",
        },
        {
          q: "هل تُرفع صوري؟",
          a: "لا. يُفكّ ترميز HEIC ويُعاد ترميزه بالكامل في متصفحك عبر WebAssembly.",
        },
        {
          q: "هل يمكنني تحويل عدة صور دفعة واحدة؟",
          a: "نعم — حوّل صور HEIC إلى JPG ونزّل النتائج.",
        },
      ],
      steps: [
        "ارفع صورة HEIC واحدة أو أكثر.",
        "تفكّ الأداة ترميزها محليًا عبر مفكّك WebAssembly.",
        "تعيد ترميز كل صورة إلى JPG في متصفحك.",
        "نزّل ملفات JPG المحوّلة.",
      ],
    },
  },

  "heic-to-png": {
    related: ["heic-to-jpg", "image-converter", "image-resizer"],
    en: {
      intro:
        "HEIC has been Apple's default photo format since iOS 11, but when you need an exact, lossless copy — a screenshot with crisp text, an image you'll edit further, or artwork with a transparent background — JPG's lossy compression gets in the way. Converting HEIC to PNG gives you a pixel-faithful result instead.\n\nPNG is lossless: it reproduces every pixel exactly and supports transparency, which makes it the right choice for screenshots, diagrams, logos, and any image headed into a design or editing workflow where re-compression artefacts would accumulate. This tool decodes the HEIC with a WebAssembly decoder and writes a PNG entirely in your browser, so nothing is uploaded.\n\nThe trade-off is size: because PNG keeps all the detail, the file is usually larger than the HEIC original or a JPG version. When you specifically need fidelity or a transparent background, that's a worthwhile exchange; when you just want a small, shareable photo, convert to JPG instead.",
      faq: [
        {
          q: "When should I pick PNG over JPG for HEIC?",
          a: "Choose PNG for screenshots, graphics, images you'll edit, or anything needing transparency — it's lossless and won't add compression artefacts.",
        },
        {
          q: "Is PNG really lossless?",
          a: "Yes. PNG stores every pixel exactly, so the converted image matches the decoded HEIC pixel for pixel.",
        },
        {
          q: "Why is my PNG bigger than the HEIC?",
          a: "PNG keeps all detail rather than discarding any, so photographic images become larger. That's the cost of lossless quality.",
        },
        {
          q: "Does PNG keep transparency?",
          a: "Yes. PNG supports an alpha channel for transparency, unlike JPG.",
        },
        {
          q: "Are my files uploaded?",
          a: "No — decoding and PNG encoding happen locally in your browser.",
        },
      ],
      steps: [
        "Upload one or more HEIC files.",
        "The tool decodes them with a WebAssembly decoder.",
        "It writes a lossless PNG for each in your browser.",
        "Download the converted PNG files.",
      ],
    },
    ar: {
      intro:
        "ظلّت HEIC صيغة الصور الافتراضية لدى آبل منذ iOS 11، لكن حين تحتاج نسخة مطابقة بلا فقد — لقطة شاشة بنص حاد، أو صورة ستحرّرها لاحقًا، أو تصميمًا بخلفية شفافة — يقف ضغط JPG الفاقد عائقًا. والتحويل من HEIC إلى PNG يمنحك نتيجة مطابقة للبكسل بدلًا من ذلك.\n\nPNG صيغة غير فاقدة: تعيد إنتاج كل بكسل بدقة وتدعم الشفافية، ما يجعلها الخيار الصحيح للقطات الشاشة والمخططات والشعارات وأي صورة متجهة إلى مسار تصميم أو تحرير تتراكم فيه تشوهات إعادة الضغط. تفكّ هذه الأداة ترميز HEIC عبر مفكّك WebAssembly وتكتب ملف PNG بالكامل في متصفحك، فلا يُرفع أي شيء.\n\nالمقايضة هي الحجم: لأن PNG تحتفظ بكل التفاصيل، يكون الملف عادةً أكبر من أصل HEIC أو نسخة JPG. وحين تحتاج الدقة أو خلفية شفافة تحديدًا، تكون مقايضة تستحق؛ وحين تريد صورة صغيرة قابلة للمشاركة فقط، فحوّل إلى JPG بدلًا من ذلك.",
      faq: [
        {
          q: "متى أختار PNG بدل JPG لملف HEIC؟",
          a: "اختر PNG للقطات الشاشة والرسوم والصور التي ستحرّرها أو أي شيء يحتاج شفافية — فهي بلا فقد ولا تضيف تشوهات ضغط.",
        },
        {
          q: "هل PNG فعلًا بلا فقد؟",
          a: "نعم. تخزّن PNG كل بكسل بدقة، فتطابق الصورة المحوّلة أصل HEIC المفكوك بكسلًا ببكسل.",
        },
        {
          q: "لماذا ملف PNG أكبر من HEIC؟",
          a: "تحتفظ PNG بكل التفاصيل بدل التخلّص من أي منها، فتصبح الصور الفوتوغرافية أكبر. وهذا ثمن الجودة بلا فقد.",
        },
        {
          q: "هل تحافظ PNG على الشفافية؟",
          a: "نعم. تدعم PNG قناة شفافية (alpha)، بخلاف JPG.",
        },
        {
          q: "هل تُرفع ملفاتي؟",
          a: "لا — يجري فكّ الترميز وترميز PNG محليًا في متصفحك.",
        },
      ],
      steps: [
        "ارفع ملف HEIC واحدًا أو أكثر.",
        "تفكّ الأداة ترميزها عبر مفكّك WebAssembly.",
        "تكتب ملف PNG بلا فقد لكل منها في متصفحك.",
        "نزّل ملفات PNG المحوّلة.",
      ],
    },
  },

  "mic-test": {
    related: ["webcam-test", "mic-camera"],
    en: {
      intro:
        "A quick microphone check before a Zoom, Google Meet, or Microsoft Teams call saves the awkward \"can you hear me?\" opening. This tool asks your browser for microphone permission, then shows a live input meter that moves as you speak — instant confirmation that the right mic is picked up and actually sending audio.\n\nIf the meter stays flat, it's usually a permission or device issue. When the browser prompts, choose Allow; if you dismissed it, click the padlock or camera/mic icon in the address bar to re-enable access, and pick the correct input in your system sound settings if you have several microphones.\n\nCrucially, this is only a test: the tool never records, saves, or uploads anything. Your voice is used purely to animate the meter in real time and is then discarded — nothing leaves your device.",
      faq: [
        {
          q: "How do I test my mic before a meeting?",
          a: "Open this tool, allow microphone access, and speak — the live meter moving confirms your mic works for Zoom, Meet, or Teams.",
        },
        {
          q: "The meter isn't moving — what's wrong?",
          a: "Usually a blocked permission or the wrong input device. Re-allow access via the address-bar icon and select the correct microphone in your system settings.",
        },
        {
          q: "Does this record my voice?",
          a: "No. The audio only drives the live meter in real time; nothing is recorded, saved, or uploaded.",
        },
        {
          q: "How do I grant microphone permission?",
          a: "When the browser asks, click Allow. If you missed it, click the padlock or mic icon next to the URL, set the microphone to Allow, then reload.",
        },
        {
          q: "Why can't the browser access my mic?",
          a: "Another app may be using it, permission may be denied, or no input device is connected. Close other apps and check your operating system's privacy settings.",
        },
      ],
      steps: [
        "Click to start the microphone test.",
        "Choose Allow when the browser asks for permission.",
        "Speak and watch the live input meter respond.",
        "If it stays flat, fix the permission or select the right input device.",
      ],
    },
    ar: {
      intro:
        "فحص سريع للميكروفون قبل مكالمة على Zoom أو Google Meet أو Microsoft Teams يجنّبك افتتاحية «هل تسمعونني؟» المحرجة. تطلب هذه الأداة من متصفحك إذن الميكروفون، ثم تعرض مؤشر إدخال حيًّا يتحرّك أثناء حديثك — تأكيد فوري أن الميكروفون الصحيح مُلتقَط ويرسل الصوت فعلًا.\n\nإن بقي المؤشر ثابتًا، فالسبب عادةً إذن أو جهاز. حين يسألك المتصفح اختر «السماح»؛ وإن رفضته، فانقر أيقونة القفل أو الكاميرا/الميكروفون في شريط العنوان لإعادة تفعيل الوصول، واختر الإدخال الصحيح في إعدادات صوت النظام إن كان لديك أكثر من ميكروفون.\n\nوالأهم أن هذا اختبار فقط: فالأداة لا تسجّل ولا تحفظ ولا ترفع أي شيء. يُستخدم صوتك حصريًا لتحريك المؤشر لحظيًا ثم يُتلَف — فلا يغادر شيء جهازك.",
      faq: [
        {
          q: "كيف أختبر ميكروفوني قبل اجتماع؟",
          a: "افتح هذه الأداة، واسمح بالوصول إلى الميكروفون، وتحدّث — فحركة المؤشر الحيّ تؤكد أن ميكروفونك يعمل لـ Zoom أو Meet أو Teams.",
        },
        {
          q: "المؤشر لا يتحرّك — ما المشكلة؟",
          a: "عادةً إذن محظور أو جهاز إدخال خاطئ. أعد السماح بالوصول عبر أيقونة شريط العنوان واختر الميكروفون الصحيح في إعدادات نظامك.",
        },
        {
          q: "هل تسجّل هذه الأداة صوتي؟",
          a: "لا. الصوت يحرّك المؤشر الحيّ لحظيًا فقط؛ ولا يُسجَّل أو يُحفَظ أو يُرفَع شيء.",
        },
        {
          q: "كيف أمنح إذن الميكروفون؟",
          a: "حين يسألك المتصفح انقر «السماح». وإن فاتك ذلك، فانقر أيقونة القفل أو الميكروفون بجوار الرابط، واضبط الميكروفون على «السماح»، ثم أعِد التحميل.",
        },
        {
          q: "لماذا لا يستطيع المتصفح الوصول إلى ميكروفوني؟",
          a: "قد يستخدمه تطبيق آخر، أو يكون الإذن مرفوضًا، أو لا يوجد جهاز إدخال موصول. أغلق التطبيقات الأخرى وتحقق من إعدادات خصوصية نظام التشغيل.",
        },
      ],
      steps: [
        "انقر لبدء اختبار الميكروفون.",
        "اختر «السماح» حين يطلب المتصفح الإذن.",
        "تحدّث وراقب استجابة مؤشر الإدخال الحيّ.",
        "إن بقي ثابتًا، فأصلح الإذن أو اختر جهاز الإدخال الصحيح.",
      ],
    },
  },

  "webcam-test": {
    related: ["mic-test", "mic-camera"],
    en: {
      intro:
        "Before an interview or video call, a fast camera check confirms you're framed, lit, and that the right webcam is active — no more discovering a black screen when the meeting starts. This tool requests camera permission and shows a live preview of exactly what Zoom, Meet, or Teams would see.\n\nA black or frozen preview is almost always a permission or device problem. Allow access when prompted; if you blocked it, use the padlock or camera icon in the address bar to re-enable, and if you have more than one camera, switch to the correct one. Closing other apps that might be holding the camera often frees it up.\n\nThe preview is live-only: the tool never records, stores, or uploads video. Your camera feed is shown back to you and nothing else — it stays entirely on your device.",
      faq: [
        {
          q: "How do I test my webcam?",
          a: "Open the tool and allow camera access — you'll see a live preview, the same view apps like Zoom and Teams get.",
        },
        {
          q: "My preview is black — how do I fix it?",
          a: "Check that permission is allowed (the address-bar camera icon), select the right camera, and close other apps that may be using it.",
        },
        {
          q: "Is my video recorded or uploaded?",
          a: "No. The feed is only previewed live on your screen; nothing is saved or sent anywhere.",
        },
        {
          q: "Can I choose between multiple cameras?",
          a: "Yes — if your device has several, pick the correct one from your browser or system camera selection.",
        },
        {
          q: "Why won't my camera turn on?",
          a: "It may be in use by another app, blocked by permission, or disabled in your operating system's privacy settings. Resolve those and reload.",
        },
      ],
      steps: [
        "Click to start the webcam test.",
        "Choose Allow when the browser asks for camera permission.",
        "Check the live preview for framing and lighting.",
        "If it's black, fix the permission or select the correct camera.",
      ],
    },
    ar: {
      intro:
        "قبل مقابلة أو مكالمة فيديو، فحص سريع للكاميرا يؤكد أنك ضمن الإطار ومُضاء وأن كاميرا الويب الصحيحة فعّالة — فلا تكتشف شاشة سوداء عند بدء الاجتماع. تطلب هذه الأداة إذن الكاميرا وتعرض معاينة حية لِما تراه تمامًا تطبيقات Zoom أو Meet أو Teams.\n\nالمعاينة السوداء أو المتجمّدة تكون دائمًا تقريبًا مشكلة إذن أو جهاز. اسمح بالوصول عند الطلب؛ وإن حظرته، فاستخدم أيقونة القفل أو الكاميرا في شريط العنوان لإعادة التفعيل، وإن كان لديك أكثر من كاميرا فبدّل إلى الصحيحة. وإغلاق التطبيقات الأخرى التي قد تحتجز الكاميرا يحرّرها غالبًا.\n\nالمعاينة حيّة فقط: فالأداة لا تسجّل ولا تخزّن ولا ترفع فيديو. يُعرض بثّ كاميرتك لك أنت وحدك ولا شيء غير ذلك — ويبقى بالكامل على جهازك.",
      faq: [
        {
          q: "كيف أختبر كاميرا الويب؟",
          a: "افتح الأداة واسمح بالوصول إلى الكاميرا — سترى معاينة حية، وهي المشهد نفسه الذي تراه تطبيقات مثل Zoom وTeams.",
        },
        {
          q: "معاينتي سوداء — كيف أصلحها؟",
          a: "تأكد أن الإذن مسموح (أيقونة الكاميرا في شريط العنوان)، واختر الكاميرا الصحيحة، وأغلق التطبيقات الأخرى التي قد تستخدمها.",
        },
        {
          q: "هل يُسجَّل الفيديو أو يُرفَع؟",
          a: "لا. يُعاين البثّ حيًّا على شاشتك فقط؛ ولا يُحفَظ أو يُرسَل شيء.",
        },
        {
          q: "هل يمكنني الاختيار بين عدة كاميرات؟",
          a: "نعم — إن كان لجهازك عدة كاميرات، فاختر الصحيحة من خيار الكاميرا في متصفحك أو نظامك.",
        },
        {
          q: "لماذا لا تعمل كاميرتي؟",
          a: "قد يستخدمها تطبيق آخر، أو يكون الإذن محظورًا، أو تكون معطّلة في إعدادات خصوصية نظام التشغيل. عالِج ذلك وأعِد التحميل.",
        },
      ],
      steps: [
        "انقر لبدء اختبار كاميرا الويب.",
        "اختر «السماح» حين يطلب المتصفح إذن الكاميرا.",
        "تحقق من المعاينة الحية للإطار والإضاءة.",
        "إن كانت سوداء، فأصلح الإذن أو اختر الكاميرا الصحيحة.",
      ],
    },
  },

  "crop-image": {
    related: ["watermark-image", "image-resizer", "image-compression"],
    en: {
      intro:
        "Cropping trims an image to just the part you want — removing distracting background, straightening a lopsided scan, or reshaping a photo to fit where it's going. This tool does it in the browser with draggable handles and a live preview, no upload required.\n\nFixed aspect-ratio presets make it painless to hit a specific shape: a square 1:1 for profile pictures and marketplace thumbnails, portrait and landscape ratios for social feeds, or the strict proportions an ID or passport photo demands. Lock a ratio and the crop box keeps it while you position the subject.\n\nEverything runs locally, so personal photos and documents never leave your device. When you're happy with the frame, export the cropped result and, if needed, resize or compress it next.",
      faq: [
        {
          q: "Can I crop to an exact shape like a square or ID photo?",
          a: "Yes. Choose an aspect-ratio preset (such as 1:1) or set a custom ratio, and the crop box holds those proportions while you position the image.",
        },
        {
          q: "Will cropping reduce my image quality?",
          a: "No — cropping only removes pixels outside the frame; the pixels you keep are untouched.",
        },
        {
          q: "Are my images uploaded?",
          a: "No. Cropping happens entirely in your browser, so your photos stay private.",
        },
        {
          q: "What are common crops for social media?",
          a: "Squares for avatars and thumbnails, portrait ratios for stories and feeds, and wider landscape ratios for banners and previews.",
        },
        {
          q: "Can I resize after cropping?",
          a: "Yes — crop first to choose the framing, then use a resizer or compressor to hit a target size.",
        },
      ],
      steps: [
        "Upload the image you want to crop.",
        "Pick an aspect-ratio preset or crop freeform.",
        "Drag the handles to frame the subject.",
        "Download the cropped image.",
      ],
    },
    ar: {
      intro:
        "الاقتصاص يقلّم الصورة إلى الجزء الذي تريده فقط — بإزالة خلفية مشتّتة، أو تعديل مسح مائل، أو إعادة تشكيل صورة لتناسب وجهتها. تفعل هذه الأداة ذلك في المتصفح بمقابض قابلة للسحب ومعاينة حية، دون حاجة إلى رفع.\n\nتُسهّل إعدادات نسبة العرض إلى الارتفاع الجاهزة بلوغ شكل محدد: مربع 1:1 لصور الملف الشخصي والصور المصغّرة للأسواق، ونسب طولية وعرضية لخلاصات التواصل، أو النسب الصارمة التي تتطلبها صورة الهوية أو جواز السفر. اقفل نسبة فيحافظ عليها مربع الاقتصاص أثناء تحديد موضع الهدف.\n\nكل شيء يجري محليًا، فلا تغادر الصور والمستندات الشخصية جهازك. وحين ترضى عن الإطار، صدّر النتيجة المقتصّة، وغيّر حجمها أو اضغطها بعد ذلك عند الحاجة.",
      faq: [
        {
          q: "هل يمكنني الاقتصاص إلى شكل محدد كمربع أو صورة هوية؟",
          a: "نعم. اختر نسبة جاهزة (مثل 1:1) أو حدّد نسبة مخصصة، فيحافظ مربع الاقتصاص على تلك النسب أثناء تحديد موضع الصورة.",
        },
        {
          q: "هل يقلّل الاقتصاص جودة صورتي؟",
          a: "لا — الاقتصاص يزيل فقط وحدات البكسل خارج الإطار؛ أما البكسل الذي تبقيه فيبقى كما هو.",
        },
        {
          q: "هل تُرفع صوري؟",
          a: "لا. يجري الاقتصاص بالكامل في متصفحك، فتبقى صورك خاصة.",
        },
        {
          q: "ما الاقتصاصات الشائعة للتواصل الاجتماعي؟",
          a: "مربعات للصور الرمزية والصور المصغّرة، ونسب طولية للقصص والخلاصات، ونسب عرضية أوسع للبانرات والمعاينات.",
        },
        {
          q: "هل يمكنني تغيير الحجم بعد الاقتصاص؟",
          a: "نعم — اقتصص أولًا لاختيار الإطار، ثم استخدم أداة تغيير الحجم أو الضغط لبلوغ حجم مستهدف.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريد اقتصاصها.",
        "اختر نسبة جاهزة أو اقتصص بحرية.",
        "اسحب المقابض لتأطير الهدف.",
        "نزّل الصورة المقتصّة.",
      ],
    },
  },

  "watermark-image": {
    related: ["crop-image", "image-resizer", "image-converter"],
    en: {
      intro:
        "Adding a watermark stamps your name, logo, or copyright notice onto an image so it stays credited when it's shared, screenshotted, or reposted. This tool overlays a text or image watermark directly in your browser, with full control over how it sits on the picture.\n\nPosition it using nine anchor points (the corners, edge midpoints, and centre), tune the opacity so it's visible without burying the photo, and optionally tile it edge-to-edge to make removal impractical. A subtle corner mark suits portfolio shots; a tiled, semi-transparent pattern better protects images you expect people to try to lift.\n\nOne honest note: this is a single-image tool, so you watermark one picture at a time rather than a whole folder in one action. Nothing is uploaded, so your originals and your logo stay private on your device.",
      faq: [
        {
          q: "Can I use a logo image as the watermark, not just text?",
          a: "Yes. You can overlay either a text watermark or an image/logo watermark onto your picture.",
        },
        {
          q: "Where can I place the watermark?",
          a: "At any of nine anchor points — the four corners, the edge midpoints, or the centre — and you can adjust its opacity.",
        },
        {
          q: "Can I tile the watermark across the whole image?",
          a: "Yes. Tiling repeats the mark edge-to-edge, which makes it much harder to crop or clone out.",
        },
        {
          q: "Can I watermark many images at once?",
          a: "Not in a single batch — this tool handles one image at a time. Repeat the process for each picture.",
        },
        {
          q: "Are my images uploaded?",
          a: "No. Watermarking is done entirely in your browser, so your originals and logo stay private.",
        },
      ],
      steps: [
        "Upload the image you want to watermark.",
        "Choose a text or image/logo watermark.",
        "Set the anchor point, opacity, and tiling.",
        "Download the watermarked image.",
      ],
    },
    ar: {
      intro:
        "إضافة علامة مائية تختم اسمك أو شعارك أو إشعار حقوقك على الصورة لتبقى منسوبة إليك عند مشاركتها أو التقاط صورة لها أو إعادة نشرها. تضع هذه الأداة علامة مائية نصية أو صورية مباشرة في متصفحك، مع تحكّم كامل في موضعها على الصورة.\n\nحدّد موضعها عبر تسع نقاط ارتساء (الزوايا ومنتصفات الحواف والمركز)، واضبط الشفافية لتكون ظاهرة دون أن تطمس الصورة، ثم كرّرها اختياريًا من حافة إلى حافة لجعل إزالتها غير عملية. فالعلامة الخفيفة في الزاوية تناسب لقطات المعرض؛ أما النمط المكرّر شبه الشفاف فيحمي بشكل أفضل الصور التي تتوقع أن يحاول الناس أخذها.\n\nملاحظة صريحة: هذه أداة صورة واحدة، فتضع العلامة على صورة في كل مرة لا على مجلد كامل بإجراء واحد. ولا يُرفع أي شيء، فتبقى أصولك وشعارك خاصة على جهازك.",
      faq: [
        {
          q: "هل يمكنني استخدام صورة شعار كعلامة مائية لا نصًا فقط؟",
          a: "نعم. يمكنك وضع علامة مائية نصية أو علامة صورية/شعار على صورتك.",
        },
        {
          q: "أين يمكنني وضع العلامة المائية؟",
          a: "في أيٍّ من تسع نقاط ارتساء — الزوايا الأربع أو منتصفات الحواف أو المركز — ويمكنك ضبط شفافيتها.",
        },
        {
          q: "هل يمكنني تكرار العلامة على الصورة كلها؟",
          a: "نعم. يكرّر التبليط العلامة من حافة إلى حافة، ما يصعّب كثيرًا اقتصاصها أو إزالتها.",
        },
        {
          q: "هل يمكنني وضع علامة على عدة صور دفعة واحدة؟",
          a: "ليس بدفعة واحدة — تعالج هذه الأداة صورة واحدة في كل مرة. كرّر العملية لكل صورة.",
        },
        {
          q: "هل تُرفع صوري؟",
          a: "لا. يتم التعليم بالكامل في متصفحك، فتبقى أصولك وشعارك خاصة.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريد وضع علامة عليها.",
        "اختر علامة مائية نصية أو صورية/شعار.",
        "حدّد نقطة الارتساء والشفافية والتبليط.",
        "نزّل الصورة بعد إضافة العلامة.",
      ],
    },
  },

  "keyboard-tester": {
    related: ["gamepad-tester", "dead-pixel-test"],
    en: {
      intro:
        "A keyboard tester shows, key by key, exactly what your keyboard sends to the computer — invaluable when QA-testing a new mechanical board, diagnosing a key that \"sometimes doesn't work,\" or checking a used keyboard before you rely on it. Press any key and this tool lights up the matching key on an on-screen layout.\n\nIt reads each key by its physical position (the browser's event.code), so it identifies the exact key regardless of your layout or language. A rollover counter shows how many keys register at once — the quick way to test n-key rollover (NKRO) and find out whether your board drops inputs during the fast, multi-key combinations that gaming and touch-typing demand.\n\nIt also surfaces flaky switches: if a single press registers twice (chatter, a debounce failure) or a key won't light at all, you've found the fault. Everything runs locally in the browser — no install, nothing sent anywhere.",
      faq: [
        {
          q: "How do I test if every key works?",
          a: "Press each key and the matching key highlights on screen. Any key that never lights up isn't registering.",
        },
        {
          q: "What is n-key rollover and how do I check it?",
          a: "NKRO is how many simultaneous keys your board reports. Hold several keys at once and watch the rollover counter to see if any are dropped.",
        },
        {
          q: "My key registers twice on one press — what's that?",
          a: "That's switch chatter (a debounce failure), a common sign of a worn or faulty switch. The tester makes the double-registration visible.",
        },
        {
          q: "Does it work with any keyboard layout?",
          a: "Yes. It reads each key by physical position (event.code), so it identifies keys regardless of language or layout.",
        },
        {
          q: "Is anything uploaded?",
          a: "No. The test runs entirely in your browser.",
        },
      ],
      steps: [
        "Focus the tester in your browser.",
        "Press each key and watch it light up on the layout.",
        "Hold several keys at once to check n-key rollover.",
        "Look for keys that don't light or that register twice.",
      ],
    },
    ar: {
      intro:
        "يُظهر مختبِر لوحة المفاتيح، مفتاحًا مفتاحًا، ما ترسله لوحتك إلى الحاسوب بالضبط — وهو لا يُقدَّر بثمن عند اختبار جودة لوحة ميكانيكية جديدة، أو تشخيص مفتاح «لا يعمل أحيانًا»، أو فحص لوحة مستعملة قبل الاعتماد عليها. اضغط أي مفتاح فتُضيء هذه الأداة المفتاح المطابق على تخطيط معروض على الشاشة.\n\nتقرأ كل مفتاح بموضعه الفيزيائي (‏event.code في المتصفح)، فتحدّد المفتاح الدقيق بغضّ النظر عن تخطيطك أو لغتك. ويُظهر عدّاد التزامن كم مفتاحًا يُسجَّل في آنٍ واحد — وهي الطريقة السريعة لاختبار تزامن كل المفاتيح (NKRO) ومعرفة ما إن كانت لوحتك تُسقط مدخلات أثناء التركيبات السريعة متعددة المفاتيح التي تتطلبها الألعاب والطباعة باللمس.\n\nكما تكشف المفاتيح المتذبذبة: فإن سُجّلت ضغطة واحدة مرتين (ارتجاف، خلل ارتداد) أو لم يُضِئ مفتاح إطلاقًا، فقد وجدت العطل. وكل شيء يجري محليًا في المتصفح — دون تثبيت ودون إرسال أي شيء.",
      faq: [
        {
          q: "كيف أختبر أن كل مفتاح يعمل؟",
          a: "اضغط كل مفتاح فيُضيء المفتاح المطابق على الشاشة. وأي مفتاح لا يُضيء أبدًا لا يُسجَّل.",
        },
        {
          q: "ما تزامن كل المفاتيح (NKRO) وكيف أفحصه؟",
          a: "NKRO هو عدد المفاتيح المتزامنة التي تُبلّغ عنها لوحتك. اضغط عدة مفاتيح معًا وراقب عدّاد التزامن لترى إن أُسقط أيٌّ منها.",
        },
        {
          q: "مفتاحي يُسجَّل مرتين بضغطة واحدة — ما هذا؟",
          a: "هذا ارتجاف المفتاح (خلل ارتداد)، علامة شائعة على مفتاح مهترئ أو معطوب. ويجعل المختبِر التسجيل المزدوج مرئيًا.",
        },
        {
          q: "هل يعمل مع أي تخطيط لوحة مفاتيح؟",
          a: "نعم. يقرأ كل مفتاح بموضعه الفيزيائي (‏event.code)، فيحدّد المفاتيح بغضّ النظر عن اللغة أو التخطيط.",
        },
        {
          q: "هل يُرفع أي شيء؟",
          a: "لا. يجري الاختبار بالكامل في متصفحك.",
        },
      ],
      steps: [
        "ركّز على المختبِر في متصفحك.",
        "اضغط كل مفتاح وراقب إضاءته على التخطيط.",
        "اضغط عدة مفاتيح معًا لفحص تزامن كل المفاتيح.",
        "ابحث عن مفاتيح لا تُضيء أو تُسجَّل مرتين.",
      ],
    },
  },

  "gamepad-tester": {
    related: ["keyboard-tester", "dead-pixel-test"],
    en: {
      intro:
        "A gamepad tester reads your controller live so you can see exactly what it's reporting — the fastest way to diagnose the most common controller complaint: analog stick drift. This tool detects a connected gamepad through the browser and displays every button and both sticks in real time.\n\nStick drift shows up as movement the tool registers when you aren't touching the stick. Each axis is displayed to four decimal places, so even a tiny non-zero reading at rest — say 0.0100 when it should be 0.0000 — is obvious. Watch the numbers with your hands off the controller: values that won't settle to zero confirm drift; clean zeros mean the sticks are healthy.\n\nBeyond sticks, every face button, bumper, trigger, and D-pad direction lights up as you press it, so you can confirm nothing is stuck or unresponsive. It works with standard controllers over USB or Bluetooth, entirely in the browser, with nothing uploaded.",
      faq: [
        {
          q: "How do I check for stick drift?",
          a: "Connect the controller, leave the sticks untouched, and watch the axis readouts. Non-zero values at rest — visible to four decimals — indicate drift.",
        },
        {
          q: "My controller isn't detected — what do I do?",
          a: "Press a button first; browsers only expose a gamepad once it sends input. Check the USB or Bluetooth connection and try reconnecting.",
        },
        {
          q: "Can I test every button too?",
          a: "Yes. Each button, trigger, and D-pad direction highlights as you press it, so you can spot stuck or dead inputs.",
        },
        {
          q: "Why show four decimal places?",
          a: "Drift is often a very small offset; the extra precision makes a stick that barely fails to return to zero easy to see.",
        },
        {
          q: "Is my controller data uploaded?",
          a: "No. Everything is read and displayed locally in your browser.",
        },
      ],
      steps: [
        "Connect your controller via USB or Bluetooth.",
        "Press a button so the browser detects the gamepad.",
        "Release the sticks and read the axis values for drift.",
        "Press each button to confirm it registers.",
      ],
    },
    ar: {
      intro:
        "يقرأ مختبِر يد التحكّم وحدتك حيًّا لترى ما تُبلّغ عنه بالضبط — وهو أسرع طريقة لتشخيص أكثر شكاوى وحدات التحكّم شيوعًا: انحراف العصا التناظرية. تكتشف هذه الأداة يد تحكّم موصولة عبر المتصفح وتعرض كل زر وكلتا العصاتين لحظيًا.\n\nيظهر انحراف العصا كحركة تسجّلها الأداة وأنت لا تلمس العصا. ويُعرض كل محور بأربع خانات عشرية، فحتى قراءة صغيرة غير صفرية عند السكون — مثلًا 0.0100 بينما يجب أن تكون 0.0000 — تكون واضحة. راقب الأرقام ويداك بعيدتان عن الوحدة: فالقيم التي لا تستقر عند الصفر تؤكد الانحراف؛ والأصفار النظيفة تعني أن العصاتين سليمتان.\n\nإلى جانب العصاتين، يُضيء كل زر أمامي وكتفي وزناد واتجاه في لوحة الاتجاهات عند ضغطه، فتتأكد أن لا شيء عالق أو غير مستجيب. تعمل مع وحدات التحكّم القياسية عبر USB أو بلوتوث، بالكامل في المتصفح، دون رفع أي شيء.",
      faq: [
        {
          q: "كيف أفحص انحراف العصا؟",
          a: "صِل الوحدة، واترك العصاتين دون لمس، وراقب قراءات المحاور. فالقيم غير الصفرية عند السكون — الظاهرة بأربع خانات عشرية — تدل على انحراف.",
        },
        {
          q: "وحدة التحكّم لا تُكتشَف — ماذا أفعل؟",
          a: "اضغط زرًا أولًا؛ فالمتصفحات لا تُظهر يد التحكّم إلا حين ترسل مدخلًا. تحقق من وصلة USB أو بلوتوث وحاول إعادة التوصيل.",
        },
        {
          q: "هل يمكنني اختبار كل زر أيضًا؟",
          a: "نعم. يُضيء كل زر وزناد واتجاه في لوحة الاتجاهات عند ضغطه، فتكتشف المدخلات العالقة أو الميتة.",
        },
        {
          q: "لماذا عرض أربع خانات عشرية؟",
          a: "الانحراف غالبًا إزاحة صغيرة جدًا؛ والدقة الإضافية تجعل عصا بالكاد تفشل في العودة إلى الصفر سهلة الرؤية.",
        },
        {
          q: "هل تُرفع بيانات وحدتي؟",
          a: "لا. كل شيء يُقرأ ويُعرض محليًا في متصفحك.",
        },
      ],
      steps: [
        "صِل وحدة التحكّم عبر USB أو بلوتوث.",
        "اضغط زرًا لتكتشفها المتصفح.",
        "حرّر العصاتين واقرأ قيم المحاور بحثًا عن انحراف.",
        "اضغط كل زر للتأكد من تسجيله.",
      ],
    },
  },

  "dead-pixel-test": {
    related: ["keyboard-tester", "gamepad-tester"],
    en: {
      intro:
        "A dead-pixel test fills your whole screen with solid colours, one at a time, so a faulty pixel has nowhere to hide — the standard check when you unbox a new monitor, laptop, or phone, or buy a used one. This tool cycles fullscreen through solid red, green, blue, white, and black so you can inspect the panel against each background.\n\nThe colours help you tell two faults apart. A dead pixel stays black on every colour because it receives no power. A stuck pixel is frozen on one colour — a persistent red, green, or blue dot — because its sub-pixels are locked on. Against a black screen a stuck pixel glows; against white, a dead pixel shows as a dark speck.\n\nOne honest caveat: this tool finds and identifies problem pixels, it can't repair them. Stuck pixels sometimes recover on their own or with gentle massage or pixel-flashing utilities, but there's no guarantee, and a truly dead pixel generally can't be fixed in software. It runs in the browser with nothing uploaded.",
      faq: [
        {
          q: "What's the difference between a dead and a stuck pixel?",
          a: "A dead pixel stays black on all colours (no power); a stuck pixel is frozen on one colour. Cycling solid colours makes each type stand out.",
        },
        {
          q: "How do I test a new monitor for dead pixels?",
          a: "Run the fullscreen test and look carefully at each solid colour — red, green, blue, white, and black — for any dot that doesn't match.",
        },
        {
          q: "Can this tool fix a stuck pixel?",
          a: "No — it only detects and identifies them. Stuck pixels sometimes recover with massage or flashing tools, but that isn't guaranteed; dead pixels usually can't be fixed.",
        },
        {
          q: "Why cycle through several colours?",
          a: "A pixel fault may be invisible on one colour but obvious on another — a stuck sub-pixel glows on black, a dead one shows on white.",
        },
        {
          q: "Is anything uploaded?",
          a: "No. The test runs entirely in your browser.",
        },
      ],
      steps: [
        "Enter fullscreen mode.",
        "Cycle through each solid colour: red, green, blue, white, black.",
        "Scan the panel for any pixel that doesn't match.",
        "Note whether faults are dead (black) or stuck (a fixed colour).",
      ],
    },
    ar: {
      intro:
        "يملأ اختبار البكسل الميت شاشتك كلها بألوان صلبة، لونًا تلو الآخر، فلا يجد البكسل المعطوب مكانًا يختبئ فيه — وهو الفحص المعياري عند فتح شاشة أو حاسوب محمول أو هاتف جديد، أو شراء مستعمل. تنتقل هذه الأداة بملء الشاشة عبر الأحمر والأخضر والأزرق والأبيض والأسود الصلبة لتفحص اللوحة على كل خلفية.\n\nتساعدك الألوان على التمييز بين عطلين. فالبكسل الميت يبقى أسود على كل لون لأنه لا يتلقّى طاقة. أما البكسل العالق فمتجمّد على لون واحد — نقطة حمراء أو خضراء أو زرقاء ثابتة — لأن بكسلاته الفرعية عالقة في وضع التشغيل. وعلى شاشة سوداء يتوهّج البكسل العالق؛ وعلى بيضاء يظهر البكسل الميت كنقطة داكنة.\n\nتنبيه صريح: تكشف هذه الأداة البكسلات المعطوبة وتحدّدها، لكنها لا تصلحها. فالبكسلات العالقة تتعافى أحيانًا وحدها أو بتدليك لطيف أو بأدوات وميض البكسل، لكن دون ضمان، والبكسل الميت فعلًا لا يمكن إصلاحه برمجيًا عادةً. تعمل في المتصفح دون رفع أي شيء.",
      faq: [
        {
          q: "ما الفرق بين البكسل الميت والعالق؟",
          a: "البكسل الميت يبقى أسود على كل الألوان (بلا طاقة)؛ أما العالق فمتجمّد على لون واحد. والتنقّل بين الألوان الصلبة يُبرز كل نوع.",
        },
        {
          q: "كيف أفحص شاشة جديدة بحثًا عن بكسلات ميتة؟",
          a: "شغّل الاختبار بملء الشاشة وانظر بدقة إلى كل لون صلب — أحمر وأخضر وأزرق وأبيض وأسود — بحثًا عن أي نقطة لا تطابقه.",
        },
        {
          q: "هل تصلح هذه الأداة بكسلًا عالقًا؟",
          a: "لا — تكشفها وتحدّدها فقط. تتعافى البكسلات العالقة أحيانًا بالتدليك أو أدوات الوميض، لكن دون ضمان؛ والبكسلات الميتة لا يمكن إصلاحها عادةً.",
        },
        {
          q: "لماذا التنقّل بين عدة ألوان؟",
          a: "قد يكون عطل البكسل غير مرئي على لون وواضحًا على آخر — فالبكسل الفرعي العالق يتوهّج على الأسود، والميت يظهر على الأبيض.",
        },
        {
          q: "هل يُرفع أي شيء؟",
          a: "لا. يجري الاختبار بالكامل في متصفحك.",
        },
      ],
      steps: [
        "ادخل وضع ملء الشاشة.",
        "تنقّل بين كل لون صلب: أحمر وأخضر وأزرق وأبيض وأسود.",
        "افحص اللوحة بحثًا عن أي بكسل لا يطابق اللون.",
        "لاحظ إن كانت الأعطال ميتة (سوداء) أم عالقة (لون ثابت).",
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
