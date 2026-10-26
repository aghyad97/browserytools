import "server-only";

// ──────────────────────────────────────────────────────────────────────────────
// Per-tool on-page SEO content registry.
//
// Each tool slug (the path segment after /tools/) maps to bilingual content:
//   - intro:          1–2 paragraph "About / how it works" copy
//   - whyClientSide:  optional single paragraph on why THIS tool running
//                     on-device matters. Must be tool-specific. If a tool has no
//                     real privacy angle, say so honestly instead of inventing
//                     one — omit the field rather than writing filler.
//   - limitations:    optional 2–6 plain-language honest limitations. Deliberately
//                     unflattering where the client-side build is genuinely weaker
//                     than a server-side competitor. NEVER fed to JSON-LD — this
//                     is prose for humans, not a structured claim. Omit the field
//                     entirely when the real limitations aren't known; do not
//                     generate filler.
//   - faq:            3–6 question/answer pairs (feeds FAQPage JSON-LD)
//   - steps:          optional "how to use" steps (feeds HowTo JSON-LD)
//   - related:        related tool slugs (internal links — strong for SEO)
//
// All content is hand-authored and factual. Tools without a bespoke entry get a
// templated fallback derived from their name/description/category (see
// buildFallbackContent) so EVERY tool page still gets indexable on-page content.
// The fallback intentionally emits NO whyClientSide and NO limitations: a
// templated "limitation" would be an invented claim about a tool nobody has
// reviewed.
//
// This is a pure static data module — no client fetching, no runtime cost.
// ──────────────────────────────────────────────────────────────────────────────

import type { Locale } from "./locales";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolContentLocale {
  /** 1–2 paragraphs. Plain text; rendered as <p> blocks split on "\n\n". */
  intro: string;
  /**
   * Optional. One short paragraph on why running THIS tool on-device matters.
   * Must be specific to the tool — a generic "your files never leave your
   * device" repeated across the catalogue is worse than omitting the field.
   * Where a tool has no genuine privacy stake, say that plainly and lead with
   * the real benefit (instant, offline, no upload wait) instead.
   */
  whyClientSide?: string;
  /**
   * Optional. 2–6 honest, plain-language limitations. Rendered as prose only —
   * deliberately excluded from FAQPage and every other JSON-LD graph.
   * Omit rather than invent: an empty list renders nothing.
   */
  limitations?: string[];
  faq: FaqItem[];
  /** Optional ordered "how to" steps. Emits HowTo JSON-LD when present. */
  steps?: string[];
}

/** Registry locales that have no mandatory bespoke prose (everything but en/ar). */
export type ExtraContentLocale = Exclude<Locale, "en" | "ar">;

export interface ToolContent {
  en: ToolContentLocale;
  ar: ToolContentLocale;
  /** Related tool slugs (without the /tools/ prefix). */
  related: string[];
  /** Optional hand-authored prose for other registry locales. */
  extra?: Partial<Record<ExtraContentLocale, ToolContentLocale>>;
}

// Slug = the segment after /tools/, e.g. "json-formatter".
export const toolContent: Record<string, ToolContent> = {
  // ── Newest tools ────────────────────────────────────────────────────────────
  "ascii-art": {
    related: [
      "depth-map",
      "meme-generator",
      "screenshot-beautifier",
      "code-screenshot",
      "image-converter",
    ],
    en: {
      intro:
        "This ASCII art generator turns a photo or PNG into text made of characters. Drop in an image, pick how many characters wide the result should be, and the tool replaces every pixel block with a character whose density matches its brightness — dense symbols for dark areas, spaces for light ones. You can copy the result as plain text, download it as a .txt file, or export it as a PNG.\n\nThe controls are deliberately few. Width runs from 20 to 300 characters; the character set can be Standard (@%#*+=-:. ), Detailed (a 70-character ramp for smoother gradients), Blocks (█▓▒░) or Binary (1 and 0); Invert flips light and dark, which is what you want for light text on a dark background; and Colored tints each character with the colour of the pixel it came from. Once you have generated a result, changing any setting regenerates it automatically.\n\nIt works on PNG, JPG, WebP, GIF and BMP files up to 15 MB. This is an image-to-ASCII converter only: there is no mode that renders typed text in ASCII fonts.",
      whyClientSide:
        "Honestly, the privacy stake here is small — a picture turned into punctuation is rarely sensitive. The real benefit is speed: the conversion is a few lines of canvas maths, so there is no upload, no queue and no account, and the result updates as you drag the width slider.",
      limitations: [
        "Image input only. There is no text-to-ASCII or banner-font mode, so you cannot type a word and get a large lettered result.",
        "Colour exists only in the on-screen preview and the PNG export. Copied text and the .txt download are plain characters with no colour information.",
        "The PNG export is a fixed small size — roughly 6 pixels per character across and 10 down — so a 100-column result gives a PNG only about 600 pixels wide. Use the .txt file if you need to print or scale it yourself.",
        "Animated GIFs are converted from a single frame only; the output is never animated. Fully transparent pixels are treated as empty space unless Invert is on.",
      ],
      faq: [
        {
          q: "Can I type text and get ASCII art?",
          a: "No. This tool converts images only. It samples the brightness of each pixel block in your picture and maps it to a character; it does not have a text mode or a library of ASCII lettering fonts.",
        },
        {
          q: "Why does my ASCII art look squashed or misaligned when I paste it?",
          a: "ASCII art only lines up in a monospaced font, where every character is the same width. Pasted into a chat app, a word processor or a page that uses a proportional font, the columns drift apart. Paste it into a code block or set the font to Courier, Consolas or Menlo. The tool also halves the row count to compensate for characters being roughly twice as tall as they are wide, so the picture keeps its shape in a monospaced font.",
        },
        {
          q: "What width should I choose?",
          a: "The default of 100 characters suits most photos. Go to 150–300 for faces and detailed scenes, but only if wherever you will paste it is wide enough to avoid wrapping lines, which breaks the picture. For a quick, chunky look or a narrow chat window, 40–80 columns works better. Simple high-contrast images such as logos stay readable at lower widths.",
        },
        {
          q: "Which character set gives the best result?",
          a: "Standard is a clean default. Detailed uses a longer ramp of characters for smoother tonal gradients on photographs. Blocks (█▓▒░) produces a solid, pixel-art look but needs a font that includes block characters. Binary draws the picture with 1s and 0s.",
        },
        {
          q: "Can I get coloured ASCII art?",
          a: "Yes — tick Colored and each character takes the colour of its source pixel in the preview and in the PNG export. A .txt file or copied text cannot carry colour, so those stay plain.",
        },
        {
          q: "Should I copy the text or download it?",
          a: "Copy is the fastest way to paste into a README, terminal banner or code comment. Download .txt saves the same plain text as a file. Download PNG renders the characters onto an image — the one to use if you want to share the art somewhere that would break the monospaced alignment, or to keep the colours.",
        },
      ],
      steps: [
        "Drop an image onto the tool or click to choose one (PNG, JPG, WebP, GIF or BMP, up to 15 MB).",
        "Set the width and choose a character set; tick Invert for light-on-dark or Colored to keep the image's colours.",
        "Press Generate — after that the result refreshes automatically whenever you change a setting.",
        "Copy the text, download it as .txt, or export a PNG.",
      ],
    },
    ar: {
      intro:
        "هذه الأداة تحوّل صورتك إلى فن ASCII، أي صورة مرسومة بالحروف والرموز. أسقط صورة، وحدّد عرض النتيجة بعدد الأحرف، فتستبدل الأداة كل كتلة من البكسلات برمز تتناسب كثافته مع سطوعها: رموز كثيفة للمناطق الداكنة ومسافات للمناطق الفاتحة. يمكنك نسخ النتيجة كنص عادي أو تنزيلها بصيغة .txt أو تصديرها صورة PNG.\n\nخياراتها قليلة عن قصد. العرض من 20 إلى 300 حرف؛ ومجموعة الرموز إما قياسية (@%#*+=-:. ) أو مفصّلة (سلسلة من نحو 70 رمزًا لتدرجات أنعم) أو كتل (█▓▒░) أو ثنائية (1 و0)؛ وخيار «عكس» يقلب الفاتح والداكن وهو المناسب للكتابة الفاتحة على خلفية داكنة؛ وخيار «ملوّن» يصبغ كل رمز بلون البكسل الذي أُخذ منه. وبعد أول توليد، يُعاد إنشاء النتيجة تلقائيًا كلما غيّرت أي إعداد.\n\nتدعم الأداة ملفات PNG وJPG وWebP وGIF وBMP حتى 15 ميغابايت. هي محوّل من صورة إلى ASCII فقط، وليس فيها وضع لكتابة نص بخطوط ASCII.",
      whyClientSide:
        "بصراحة، الخصوصية هنا ليست هاجسًا كبيرًا، فصورة تتحول إلى علامات ترقيم نادرًا ما تكون حساسة. الفائدة الحقيقية هي السرعة: التحويل مجرد عملية حسابية بسيطة على لوحة canvas، فلا رفع ولا انتظار ولا حساب، وتتغير النتيجة فورًا وأنت تحرّك شريط العرض.",
      limitations: [
        "الإدخال صورة فقط. لا يوجد وضع لتحويل النص إلى ASCII ولا خطوط عناوين، فلا يمكنك كتابة كلمة والحصول على حروف كبيرة مرسومة.",
        "اللون موجود في المعاينة على الشاشة وفي تصدير PNG فقط. أما النص المنسوخ وملف .txt فهما أحرف عادية بلا أي معلومات لونية.",
        "تصدير PNG بحجم صغير ثابت، بنحو 6 بكسلات لكل حرف عرضًا و10 ارتفاعًا؛ فنتيجة بعرض 100 عمود تعطي صورة عرضها نحو 600 بكسل فقط. استخدم ملف .txt إن أردت الطباعة أو التكبير بنفسك.",
        "صور GIF المتحركة تُحوَّل من إطار واحد فقط، ولا يكون الناتج متحركًا أبدًا. والبكسلات الشفافة تمامًا تُعامل كفراغ ما لم يكن خيار «عكس السطوع» مفعّلًا.",
      ],
      faq: [
        {
          q: "هل أستطيع كتابة نص والحصول على فن ASCII؟",
          a: "لا. هذه الأداة تحوّل الصور فقط: تقرأ سطوع كل كتلة بكسلات في صورتك وتقابله برمز، وليس فيها وضع نصي ولا مكتبة خطوط ASCII.",
        },
        {
          q: "لماذا يبدو الرسم مشوّهًا أو غير متراصّ عند لصقه؟",
          a: "لا يستقيم فن ASCII إلا في خط أحادي المسافة تتساوى فيه عروض الأحرف. وعند لصقه في تطبيق محادثة أو معالج نصوص أو صفحة بخط متناسب تتباعد الأعمدة. الصقه داخل كتلة كود أو اضبط الخط على Courier أو Consolas أو Menlo. كما تُنقص الأداة عدد الصفوف إلى النصف تقريبًا لتعويض أن ارتفاع الحرف يقارب ضعف عرضه، فتحتفظ الصورة بنسبتها في الخط أحادي المسافة.",
        },
        {
          q: "ما العرض الذي أختاره؟",
          a: "القيمة الافتراضية 100 حرف مناسبة لمعظم الصور. ارفعها إلى 150–300 للوجوه والمشاهد المفصّلة، بشرط أن يتسع المكان الذي ستلصق فيه لهذا العرض دون التفاف الأسطر الذي يفسد الرسم. وللمظهر الخشن السريع أو نافذة المحادثة الضيقة، يكفي 40–80 عمودًا. أما الشعارات والصور عالية التباين فتبقى مقروءة بعرض أقل.",
        },
        {
          q: "أي مجموعة رموز تعطي أفضل نتيجة؟",
          a: "«القياسية» خيار نظيف افتراضي. و«المفصّلة» تستخدم سلسلة أطول من الرموز لتدرجات أنعم في الصور الفوتوغرافية. و«الكتل» (█▓▒░) تعطي مظهرًا مصمتًا يشبه البكسل آرت لكنها تحتاج خطًا يتضمن رموز الكتل. و«الثنائية» ترسم الصورة بالرقمين 1 و0.",
        },
        {
          q: "هل يمكنني الحصول على فن ASCII ملوّن؟",
          a: "نعم، فعّل خيار «ملوّن» فيأخذ كل رمز لون البكسل الأصلي في المعاينة وفي تصدير PNG. أما ملف .txt والنص المنسوخ فلا يحملان لونًا، فيبقيان عاديين.",
        },
        {
          q: "هل أنسخ النص أم أنزّله؟",
          a: "النسخ أسرع طريقة للصق في ملف README أو شعار طرفية أو تعليق برمجي. وتنزيل .txt يحفظ النص نفسه في ملف. أما تنزيل PNG فيرسم الأحرف على صورة، وهو الأنسب حين تشاركه في مكان يفسد محاذاة الخط أحادي المسافة، أو حين تريد الاحتفاظ بالألوان.",
        },
      ],
      steps: [
        "أسقط صورة على الأداة أو انقر لاختيارها (PNG أو JPG أو WebP أو GIF أو BMP حتى 15 ميغابايت).",
        "حدّد العرض واختر مجموعة الرموز؛ وفعّل «عكس» للفاتح على الداكن أو «ملوّن» للإبقاء على ألوان الصورة.",
        "اضغط «إنشاء» — وبعدها تتحدث النتيجة تلقائيًا كلما غيّرت إعدادًا.",
        "انسخ النص أو نزّله بصيغة .txt أو صدّره صورة PNG.",
      ],
    },
  },
  "depth-map": {
    related: [
      "object-cutout",
      "image-upscaler",
      "bg-removal",
      "image-captioner",
      "ascii-art",
    ],
    en: {
      intro:
        "This depth map generator estimates how far away each part of a photo is and draws the result as an image. Drop in a PNG, JPG or WebP, press Generate, and you get a depth map the same shape as your picture, ready to download as a PNG. It is free, needs no account, and the AI model runs inside your browser rather than on a server.\n\nThe model is Depth Anything V2 (small), loaded through Transformers.js and ONNX Runtime. It uses WebGPU when your browser offers it and falls back to WebAssembly otherwise. The output is grayscale by default, which is the form 3D and parallax tools expect, and you can switch the display to the Inferno or Viridis colour maps to read the depth more easily. Changing the colour map recolours the existing result instantly without running the model again.\n\nThe depth is relative, not measured: it tells you which parts are nearer or farther than others, not distances in metres.",
      whyClientSide:
        "The honest trade-off is the first run. The model has to be downloaded before it can do anything — roughly 27 MB on the WebAssembly path and about 99 MB when WebGPU is used — so the first depth map takes noticeably longer than later ones, and a progress bar shows the download. The browser keeps the model afterwards, and nothing about your photo is ever uploaded. In exchange you get no queue, no daily limit and no watermark.",
      limitations: [
        "The first run downloads the model (about 27 MB on WebAssembly, about 99 MB on WebGPU) and is slow on a weak connection. Later runs reuse what the browser has stored.",
        "The result is a relative depth estimate from a single image. It is not a metric measurement and it can be wrong on mirrors, glass, fog, very dark scenes and flat or repetitive surfaces.",
        "Inputs are limited to PNG, JPG and WebP files up to 15 MB. The only export is a PNG of exactly what is shown, so a colour map you picked is baked into the file; choose Grayscale before downloading if you need a clean depth channel.",
        "Speed depends on your hardware. Without WebGPU the model runs on the CPU and a large photo can take a while.",
      ],
      faq: [
        {
          q: "What is a depth map?",
          a: "A depth map is an image in which each pixel's value stands for how far that point in the scene is from the camera. In a grayscale depth map, brightness encodes distance, so you can see the layers of a scene at a glance. Check on your own result which end is near and which is far, because tools differ in the convention they expect.",
        },
        {
          q: "Which AI model does this use?",
          a: "Depth Anything V2 in its small size, published for the browser as onnx-community/depth-anything-v2-small and run with Transformers.js. It estimates depth from a single ordinary photo; you do not need a stereo pair or a depth sensor.",
        },
        {
          q: "Why is the first run so slow?",
          a: "Because the model is downloaded to your browser the first time, around 27 MB on the WebAssembly path and about 99 MB with WebGPU. A progress bar shows it. After that the browser keeps it, so later depth maps are much quicker.",
        },
        {
          q: "Grayscale or colour — which should I use?",
          a: "Use Grayscale when the depth map is going into other software, because 3D, displacement and parallax tools expect a single-channel-style image. Inferno and Viridis are perceptual colour maps meant for humans: they make small differences in depth easier to see, but the downloaded PNG carries those colours, so they are not suitable as a displacement or parallax input.",
        },
        {
          q: "Can I use the depth map for 3D, parallax or Blender displacement?",
          a: "Yes, with caveats. Download the Grayscale version and use it as a displacement or depth texture in Blender, as the depth layer for a 2.5D parallax effect, or as a mask for depth-of-field and fog in an image editor. Because it is a relative estimate rather than true geometry, expect to tune the strength, and invert it in your tool if near and far come out the wrong way round.",
        },
        {
          q: "What file formats are supported?",
          a: "You can upload PNG, JPG or WebP images up to 15 MB. The depth map is exported as a PNG named after your original file with -depth added to the end.",
        },
      ],
      steps: [
        "Drop a PNG, JPG or WebP photo onto the original panel or click to choose one.",
        "Pick Grayscale for a depth channel you will reuse, or Inferno or Viridis for a colour view.",
        "Press Generate. On the first run, wait for the model to download; after that it runs from the browser's stored copy.",
        "Download the depth map as a PNG. You can switch the colour map before downloading without regenerating.",
      ],
    },
    ar: {
      intro:
        "هذه الأداة مولّد خرائط عمق: تقدّر مدى بُعد كل جزء في الصورة وترسم النتيجة صورةً. أسقط صورة PNG أو JPG أو WebP واضغط «إنشاء»، فتحصل على خريطة عمق بنفس أبعاد صورتك جاهزة للتنزيل بصيغة PNG. الأداة مجانية بلا حساب، ويعمل نموذج الذكاء الاصطناعي داخل متصفحك لا على خادم.\n\nالنموذج هو Depth Anything V2 (الحجم الصغير) ويُشغَّل عبر Transformers.js وONNX Runtime. يستخدم WebGPU إن وفّره المتصفح، وإلا يعود إلى WebAssembly. الخرج رمادي افتراضيًا، وهو الشكل الذي تتوقعه أدوات الثلاثي الأبعاد والبارالاكس، ويمكنك تبديل العرض إلى خريطتَي الألوان Inferno أو Viridis لقراءة العمق بسهولة أكبر. وتغيير خريطة الألوان يعيد تلوين النتيجة الحالية فورًا دون تشغيل النموذج من جديد.\n\nالعمق هنا نسبي لا مقيس: يخبرك أي الأجزاء أقرب وأيها أبعد، لا المسافات بالأمتار.",
      whyClientSide:
        "المقايضة الصريحة هي في التشغيل الأول. يجب تنزيل النموذج قبل أن يعمل — نحو 27 ميغابايت على مسار WebAssembly ونحو 99 ميغابايت عند استخدام WebGPU — لذا تستغرق أول خريطة عمق وقتًا أطول بوضوح من اللاحقة، ويعرض شريط التقدم حالة التنزيل. ويحتفظ المتصفح بالنموذج بعد ذلك، ولا يُرفع أي شيء من صورتك. وبالمقابل لا طابور انتظار ولا حد يومي ولا علامة مائية.",
      limitations: [
        "التشغيل الأول ينزّل النموذج (نحو 27 ميغابايت على WebAssembly ونحو 99 ميغابايت على WebGPU) ويبطؤ مع الاتصال الضعيف. أما المرات التالية فتعيد استخدام ما حفظه المتصفح.",
        "النتيجة تقدير نسبي للعمق من صورة واحدة، وليست قياسًا فعليًا، وقد تخطئ مع المرايا والزجاج والضباب والمشاهد المظلمة جدًا والأسطح المسطحة أو المتكررة.",
        "المدخلات محصورة في ملفات PNG وJPG وWebP حتى 15 ميغابايت. والتصدير الوحيد هو PNG لما يظهر على الشاشة تمامًا، فإن اخترت خريطة ألوان فستُدمج في الملف؛ اختر «رمادي» قبل التنزيل إن أردت قناة عمق نظيفة.",
        "السرعة تعتمد على جهازك. بدون WebGPU يعمل النموذج على المعالج المركزي وقد تستغرق الصورة الكبيرة وقتًا.",
      ],
      faq: [
        {
          q: "ما هي خريطة العمق؟",
          a: "خريطة العمق صورة تمثّل قيمة كل بكسل فيها مدى بُعد تلك النقطة من المشهد عن الكاميرا. وفي الخريطة الرمادية يعبّر السطوع عن المسافة، فترى طبقات المشهد بنظرة واحدة. تحقق في نتيجتك من الطرف الذي يمثل القريب والطرف الذي يمثل البعيد، فالأدوات تختلف في الاصطلاح الذي تتوقعه.",
        },
        {
          q: "أي نموذج ذكاء اصطناعي تستخدم الأداة؟",
          a: "Depth Anything V2 بحجمه الصغير، المنشور للمتصفح باسم onnx-community/depth-anything-v2-small والمشغَّل عبر Transformers.js. يقدّر العمق من صورة عادية واحدة، ولا تحتاج إلى زوج صور مجسَّم ولا مستشعر عمق.",
        },
        {
          q: "لماذا التشغيل الأول بطيء؟",
          a: "لأن النموذج يُنزَّل إلى متصفحك أول مرة، بنحو 27 ميغابايت على مسار WebAssembly ونحو 99 ميغابايت مع WebGPU، ويعرض شريط التقدم ذلك. وبعدها يحتفظ به المتصفح فتكون الخرائط اللاحقة أسرع بكثير.",
        },
        {
          q: "رمادي أم ملوّن — أيهما أستخدم؟",
          a: "استخدم «رمادي» إذا كانت الخريطة ستدخل برنامجًا آخر، فأدوات الثلاثي الأبعاد والإزاحة والبارالاكس تتوقع صورة أحادية القناة في جوهرها. أما Inferno وViridis فخريطتا ألوان إدراكيتان مصممتان للعين البشرية: تُظهران الفروق الصغيرة في العمق بوضوح، لكن ملف PNG المنزَّل يحمل تلك الألوان فلا يصلح مدخلًا للإزاحة أو البارالاكس.",
        },
        {
          q: "هل أستطيع استخدام الخريطة في الثلاثي الأبعاد أو البارالاكس أو إزاحة Blender؟",
          a: "نعم، مع تنبيهات. نزّل النسخة الرمادية واستخدمها نسيجَ إزاحة أو عمق في Blender، أو طبقة عمق لتأثير بارالاكس ثنائي ونصف الأبعاد، أو قناعًا لعمق الميدان والضباب في محرر الصور. ولأنها تقدير نسبي لا هندسة حقيقية، توقّع أن تضبط الشدة، وأن تعكسها في أداتك إن خرج القريب والبعيد بالترتيب المعاكس.",
        },
        {
          q: "ما صيغ الملفات المدعومة؟",
          a: "يمكنك رفع صور PNG أو JPG أو WebP حتى 15 ميغابايت. وتُصدَّر خريطة العمق بصيغة PNG باسم ملفك الأصلي مضافًا إليه -depth في النهاية.",
        },
      ],
      steps: [
        "أسقط صورة PNG أو JPG أو WebP على اللوحة الأصلية أو انقر لاختيارها.",
        "اختر «رمادي» لقناة عمق ستعيد استخدامها، أو Inferno أو Viridis لعرض ملوّن.",
        "اضغط «إنشاء». في أول مرة انتظر تنزيل النموذج، وبعدها يعمل من النسخة المحفوظة في المتصفح.",
        "نزّل خريطة العمق بصيغة PNG. ويمكنك تبديل خريطة الألوان قبل التنزيل دون إعادة التوليد.",
      ],
    },
  },
  "video-converter": {
    related: ["compress-video", "video-to-audio", "video", "gif-maker"],
    en: {
      intro:
        "Video Converter changes a video's container and codecs entirely in your browser. Drop in an MP4, MOV, MKV, AVI, WebM, FLV, WMV, M4V or TS file and get back MP4 (H.264 + AAC), WebM (VP9 + Opus), MKV, AVI, MOV or an animated GIF — nothing is uploaded, and the file never leaves your device.\n\nThe encoder is ffmpeg compiled to WebAssembly (ffmpeg.wasm), the same engine behind the Compress Video and Video to Audio tools. Before converting you can scale the output to 1080p, 720p or 480p, pick a High / Medium / Low quality preset, keep, re-encode or strip the audio track, and trim to a start and end time. While it runs you see the percentage, encoding speed and an estimated time remaining, and you can cancel at any point.",
      whyClientSide:
        "Video is the file type people are least happy to hand to a stranger's server: it is large, slow to upload, and often personal — a phone recording of your kids, a screen capture of an internal dashboard, a clip from a client shoot under NDA. Hosted converters also tend to queue you, cap the file size, or watermark the free tier. Here the conversion starts the instant you press Convert, there is no upload at all, and the only limit is your own machine's memory and patience.",
      limitations: [
        "It is slow compared with a desktop encoder. ffmpeg.wasm runs on a single thread without hardware acceleration, so H.264 typically encodes at a fraction of real time and VP9 (WebM) is slower still. Long or high-resolution clips can take many minutes; the ETA readout is there so you can decide whether to wait.",
        "Files are capped at 500 MB and the whole input plus the output must fit in the tab's memory. Very large sources can fail with an out-of-memory error instead of finishing.",
        "Every conversion re-encodes the video, even when the source codec already matches the target container, so there is a small generation loss and no true lossless remux mode.",
        "MKV, AVI and some source formats (FLV, WMV, TS) cannot be previewed by the browser's video player. The conversion still works; you just download the result instead of watching it in the page.",
      ],
      faq: [
        {
          q: "Is my video uploaded anywhere?",
          a: "No. ffmpeg runs as WebAssembly inside your browser tab. The file is read from your disk into the page's memory, converted there, and the result is offered as a download — no network request carries your video.",
        },
        {
          q: "Which output format should I pick?",
          a: "MP4 (H.264 + AAC) plays almost everywhere and is the safe default. WebM (VP9 + Opus) is smaller at the same quality and ideal for the web but is slower to encode here. MOV suits Apple workflows, MKV is a flexible archive container, AVI is for legacy players, and GIF is for short, silent loops.",
        },
        {
          q: "What do the quality presets mean?",
          a: "They map to the encoder's constant-quality setting: High keeps the most detail at a larger size, Medium is a balanced default, and Low prioritises a small file. For GIF the presets change the frame rate and palette size instead.",
        },
        {
          q: "Can I convert a video to GIF?",
          a: "Yes. Choose GIF as the output, ideally with 480p and a short trim range — GIF has no audio, is limited to 256 colours and grows very large for long clips. The tool builds a custom palette for the clip so colours look better than a default GIF export.",
        },
        {
          q: "Why can't I preview the MKV or AVI result?",
          a: "Browsers' built-in video players don't decode MKV or AVI containers, so the page can't show them inline. The file itself is fine — download it and open it in VLC or any desktop player.",
        },
        {
          q: "What happens when I press Cancel?",
          a: "The encoding worker is stopped immediately and the partial output is discarded. Your settings and the loaded file stay in place, so you can adjust the trim or quality and try again.",
        },
      ],
      steps: [
        "Drop a video file into the tool or click to choose one.",
        "Pick the output format, then optionally a resolution, quality preset, audio option and trim range.",
        "Press Convert and watch the live progress, speed and ETA — cancel any time.",
        "Preview the result where the browser can play it, then download the converted file.",
      ],
    },
    ar: {
      intro:
        "تُغيّر أداة تحويل الفيديو الحاوية والترميز للفيديو بالكامل داخل متصفحك. أسقط ملف MP4 أو MOV أو MKV أو AVI أو WebM أو FLV أو WMV أو M4V أو TS واحصل على MP4 ‏(H.264 + AAC) أو WebM ‏(VP9 + Opus) أو MKV أو AVI أو MOV أو صورة GIF متحركة — لا يُرفع أي شيء، ولا يغادر الملف جهازك أبدًا.\n\nالمحرّك هو ffmpeg مترجَمًا إلى WebAssembly ‏(ffmpeg.wasm)، وهو المحرّك نفسه خلف أداتَي ضغط الفيديو وتحويل الفيديو إلى صوت. قبل التحويل يمكنك تصغير الخرج إلى 1080p أو 720p أو 480p، واختيار جودة عالية أو متوسطة أو منخفضة، والإبقاء على مسار الصوت أو إعادة ترميزه أو إزالته، وقصّ المقطع بين وقتَي بداية ونهاية. وأثناء التنفيذ ترى النسبة المئوية وسرعة الترميز والوقت المتبقي تقديريًا، ويمكنك الإلغاء في أي لحظة.",
      whyClientSide:
        "الفيديو هو نوع الملفات الذي يتردد الناس أكثر في تسليمه إلى خادم غريب: فهو كبير الحجم وبطيء الرفع وغالبًا شخصي — تسجيل بالهاتف لأطفالك، أو تسجيل شاشة للوحة تحكم داخلية، أو لقطة من تصوير لعميل تحت اتفاقية سرية. كما أن المحوّلات المستضافة تُدخلك في طابور انتظار أو تحدّ حجم الملف أو تضع علامة مائية في الخطة المجانية. هنا يبدأ التحويل فور الضغط على «تحويل»، ولا يوجد رفع إطلاقًا، والحد الوحيد هو ذاكرة جهازك وصبرك.",
      limitations: [
        "الأداة بطيئة مقارنة بمُرمِّز سطح المكتب، لأن ffmpeg.wasm يعمل على نواة واحدة دون تسريع عتادي؛ فترميز H.264 يجري عادةً بجزء من الزمن الحقيقي، وVP9 ‏(WebM) أبطأ منه. قد تستغرق المقاطع الطويلة أو عالية الدقة دقائق كثيرة، ولهذا يظهر الوقت المتبقي لتقرر إن كنت ستنتظر.",
        "الحد الأقصى لحجم الملف 500 ميغابايت، ويجب أن يتّسع الملف الأصلي والخرج معًا في ذاكرة التبويب. قد تفشل المصادر الضخمة بخطأ نفاد الذاكرة بدل أن تكتمل.",
        "كل تحويل يعيد ترميز الفيديو حتى عندما يطابق ترميز المصدر الحاوية الهدف، لذا هناك فقد بسيط في الجودة ولا يوجد وضع إعادة تغليف بلا خسارة.",
        "لا يستطيع مشغّل الفيديو في المتصفح معاينة MKV وAVI وبعض صيغ المصدر (FLV وWMV وTS). يعمل التحويل بشكل طبيعي، لكنك تنزّل النتيجة بدل مشاهدتها في الصفحة.",
      ],
      faq: [
        {
          q: "هل يُرفع الفيديو إلى أي مكان؟",
          a: "لا. يعمل ffmpeg كـ WebAssembly داخل تبويب متصفحك. يُقرأ الملف من قرصك إلى ذاكرة الصفحة، ويُحوَّل هناك، ثم تُعرض النتيجة للتنزيل — لا يحمل أي طلب شبكة فيديوك.",
        },
        {
          q: "أي صيغة خرج أختار؟",
          a: "MP4 ‏(H.264 + AAC) يعمل في كل مكان تقريبًا وهو الخيار الآمن. WebM ‏(VP9 + Opus) أصغر حجمًا بالجودة نفسها ومثالي للويب لكنه أبطأ في الترميز هنا. MOV يناسب بيئة Apple، وMKV حاوية أرشيفية مرنة، وAVI للمشغّلات القديمة، وGIF للمقاطع القصيرة الصامتة المتكررة.",
        },
        {
          q: "ماذا تعني إعدادات الجودة؟",
          a: "تقابل إعداد الجودة الثابتة في المُرمِّز: «عالية» تحافظ على أكبر قدر من التفاصيل بحجم أكبر، و«متوسطة» خيار متوازن افتراضي، و«منخفضة» تعطي الأولوية لصغر الحجم. أما في GIF فتغيّر الإعدادات معدل الإطارات وحجم لوحة الألوان.",
        },
        {
          q: "هل يمكنني تحويل فيديو إلى GIF؟",
          a: "نعم. اختر GIF كصيغة الخرج، ويُفضَّل مع دقة 480p ونطاق قصّ قصير — فصيغة GIF بلا صوت ومحدودة بـ256 لونًا ويتضخم حجمها كثيرًا مع المقاطع الطويلة. تبني الأداة لوحة ألوان مخصصة للمقطع فتبدو الألوان أفضل من تصدير GIF الافتراضي.",
        },
        {
          q: "لماذا لا يمكنني معاينة نتيجة MKV أو AVI؟",
          a: "مشغّلات الفيديو المدمجة في المتصفحات لا تفكّ حاويات MKV أو AVI، لذا لا تستطيع الصفحة عرضها مباشرة. الملف نفسه سليم — نزّله وافتحه في VLC أو أي مشغّل سطح مكتب.",
        },
        {
          q: "ماذا يحدث عند الضغط على «إلغاء»؟",
          a: "يتوقف عامل الترميز فورًا ويُتجاهل الخرج الجزئي. تبقى إعداداتك والملف المحمّل كما هي، فيمكنك تعديل القصّ أو الجودة والمحاولة مجددًا.",
        },
      ],
      steps: [
        "أسقط ملف الفيديو في الأداة أو انقر لاختياره.",
        "اختر صيغة الخرج، ثم اختياريًا الدقة وإعداد الجودة وخيار الصوت ونطاق القصّ.",
        "اضغط «تحويل» وتابع التقدم والسرعة والوقت المتبقي مباشرة — ويمكنك الإلغاء في أي وقت.",
        "عاين النتيجة حيث يستطيع المتصفح تشغيلها، ثم نزّل الملف المحوَّل.",
      ],
    },
  },

  "pdf-to-word": {
    related: ["pdf", "image-to-text", "compress-pdf", "merge-pdf"],
    en: {
      intro:
        "PDF to Word converts a PDF into an editable .docx file entirely in your browser. Nothing is uploaded to a server — the PDF is parsed and rebuilt on your own device, and the file never leaves your computer.\n\nThe converter analyses the PDF's own text and vector geometry to recover headings, paragraphs, lists, and tables — there is no AI model and no external service involved. This works best on digitally-created PDFs (exported from Word, Google Docs, or similar), where the text and layout information is embedded directly in the file.\n\nBecause the conversion is structural rather than visual, the result is a genuinely editable Word document rather than an image pasted into a page.",
      faq: [
        {
          q: "Is my PDF uploaded anywhere?",
          a: "No. The entire conversion runs on-device in your browser. Your file is never sent to a server.",
        },
        {
          q: "Does this work on scanned PDFs?",
          a: "No. Scanned pages are images with no underlying text layer, so there is nothing for this tool to extract. Use Image to Text instead — it now accepts PDFs and can OCR scanned pages.",
        },
        {
          q: "How good is the table extraction?",
          a: "Tables with visible ruled lines convert reliably. Borderless tables are detected heuristically and can be missed or mis-split. Merged or spanning cells and multi-line cell content are not supported, and two separate ruled tables placed close together on the same page may be merged into one by mistake.",
        },
        {
          q: "Are images from the PDF carried over into the Word file?",
          a: "Not in this version. The converter currently reconstructs text, headings, lists, and tables only — embedded images are not included.",
        },
        {
          q: "Does it handle Arabic or other right-to-left text?",
          a: "Paragraph text converts correctly. Tables containing right-to-left content may render with incorrect column order or alignment.",
        },
      ],
      steps: [
        "Choose a PDF file.",
        "Review the detected structure summary.",
        "Convert the file.",
        "Download the resulting .docx.",
      ],
    },
    ar: {
      intro:
        "تحوّل أداة PDF to Word ملف PDF إلى مستند Word (.docx) قابل للتحرير، وكل ذلك داخل متصفحك. لا يُرفع أي شيء إلى خادم — يتم تحليل الملف وإعادة بنائه على جهازك، ولا يغادر الملف حاسوبك أبدًا.\n\nتعمل الأداة عبر تحليل نص PDF وهندسته المتجهية نفسها لاستخراج العناوين والفقرات والقوائم والجداول — دون أي نموذج ذكاء اصطناعي أو خدمة خارجية. تعطي أفضل النتائج مع ملفات PDF المُنشأة رقميًا (المُصدَّرة من Word أو Google Docs أو ما شابه)، حيث تكون معلومات النص والتخطيط مضمّنة مباشرة داخل الملف.\n\nولأن التحويل بنيوي وليس بصريًا، تحصل على مستند Word قابل للتحرير فعليًا، وليس صورة ملصقة داخل صفحة.",
      faq: [
        {
          q: "هل يتم رفع ملف PDF الخاص بي إلى أي مكان؟",
          a: "لا. تتم عملية التحويل بالكامل على جهازك داخل المتصفح، ولا يُرسل ملفك إلى أي خادم.",
        },
        {
          q: "هل تعمل هذه الأداة مع ملفات PDF الممسوحة ضوئيًا؟",
          a: "لا. الصفحات الممسوحة ضوئيًا هي صور بلا طبقة نص كامنة، فلا يوجد ما يمكن استخراجه. استخدم أداة Image to Text بدلًا من ذلك — فهي تقبل الآن ملفات PDF ويمكنها التعرف الضوئي (OCR) على الصفحات الممسوحة.",
        },
        {
          q: "ما مدى دقة استخراج الجداول؟",
          a: "الجداول ذات الخطوط الظاهرة تُحوَّل بموثوقية عالية. أما الجداول بلا حدود فيتم اكتشافها بطريقة تقديرية وقد تُفقد أو تُقسَّم بشكل خاطئ. الخلايا المدمجة أو الممتدة والخلايا متعددة الأسطر غير مدعومة، وقد يتم دمج جدولين منفصلين ذوي حدود إذا كانا متقاربين في نفس الصفحة عن طريق الخطأ.",
        },
        {
          q: "هل تُنقل الصور من ملف PDF إلى مستند Word؟",
          a: "ليس في هذا الإصدار. تعيد الأداة حاليًا بناء النصوص والعناوين والقوائم والجداول فقط، دون الصور المضمّنة.",
        },
        {
          q: "هل تدعم النص العربي أو النصوص من اليمين إلى اليسار؟",
          a: "نص الفقرات يُحوَّل بشكل صحيح. أما الجداول التي تحتوي محتوى من اليمين إلى اليسار فقد تظهر بترتيب أعمدة أو محاذاة غير صحيحة.",
        },
      ],
      steps: [
        "اختر ملف PDF.",
        "راجع ملخص البنية المكتشفة.",
        "حوّل الملف.",
        "نزّل ملف .docx الناتج.",
      ],
    },
  },
  "word-to-pdf": {
    related: ["pdf", "image-to-text", "compress-pdf", "merge-pdf"],
    en: {
      intro:
        "Word to PDF converts a .docx file into a PDF directly in your browser using the browser's own print pipeline. Because the PDF is generated from real text rather than a flattened image, the result stays selectable and searchable — not a rasterized picture of the page.\n\nNothing is uploaded: the document is parsed and rendered entirely on your device, and the print dialog that produces the final PDF runs locally too.",
      faq: [
        {
          q: "Is my document uploaded anywhere?",
          a: "No. Parsing and rendering happen entirely in your browser, and the file is never sent to a server.",
        },
        {
          q: "Will the PDF look identical to the original Word document?",
          a: "No. Styling is normalized during conversion. Complex layouts, floating objects, multi-column text, and headers/footers will not survive the conversion.",
        },
        {
          q: "How do I actually save the PDF?",
          a: "Through your browser's print dialog. After the preview renders, open Print and choose \"Save as PDF\" as the destination.",
        },
        {
          q: "Are images from the document kept in the PDF?",
          a: "Yes, images are embedded inline in the output. Documents with many large images can produce a heavy PDF.",
        },
        {
          q: "Does it tell me anything about what it couldn't handle?",
          a: "Partly. When the document uses styles the parser does not recognize, those are reported as conversion notes in the UI before you print. That list covers unrecognized styles only — it is not a completeness check, so review the preview yourself rather than treating an empty list as a guarantee.",
        },
      ],
      steps: [
        "Choose a .docx file.",
        "Review the preview and any conversion warnings.",
        "Click Print / Save as PDF.",
        "Choose \"Save as PDF\" as the destination in the print dialog.",
      ],
    },
    ar: {
      intro:
        "تحوّل أداة Word to PDF ملف .docx إلى PDF مباشرة داخل متصفحك باستخدام نظام الطباعة الخاص بالمتصفح نفسه. ولأن ملف PDF يُولَّد من نص حقيقي وليس من صورة مسطّحة، تبقى النتيجة قابلة للتحديد والبحث — وليست صورة مصوَّرة للصفحة.\n\nلا يُرفع أي شيء: يتم تحليل المستند وعرضه بالكامل على جهازك، كما تعمل نافذة الطباعة التي تُنتج ملف PDF النهائي محليًا أيضًا.",
      faq: [
        {
          q: "هل يتم رفع مستندي إلى أي مكان؟",
          a: "لا. يتم التحليل والعرض بالكامل داخل متصفحك، ولا يُرسل الملف إلى أي خادم.",
        },
        {
          q: "هل سيبدو ملف PDF مطابقًا تمامًا لمستند Word الأصلي؟",
          a: "لا. يتم توحيد التنسيق أثناء التحويل. التخطيطات المعقدة والعناصر العائمة والنصوص متعددة الأعمدة والرؤوس والتذييلات لن تبقى كما هي بعد التحويل.",
        },
        {
          q: "كيف أحفظ ملف PDF فعليًا؟",
          a: "عبر نافذة الطباعة في متصفحك. بعد ظهور المعاينة، افتح خيار الطباعة واختر \"حفظ كملف PDF\" كوجهة.",
        },
        {
          q: "هل تُحفظ صور المستند في ملف PDF؟",
          a: "نعم، تُضمَّن الصور داخل الناتج مباشرة. المستندات التي تحتوي صورًا كبيرة وكثيرة قد تُنتج ملف PDF كبير الحجم.",
        },
        {
          q: "هل تخبرني الأداة بما لم تستطع التعامل معه؟",
          a: "جزئيًا. عندما يستخدم المستند أنماطًا لا يتعرّف عليها المحلّل، تظهر هذه الأنماط كملاحظات تحويل في الواجهة قبل الطباعة. تغطي هذه القائمة الأنماط غير المتعرَّف عليها فقط، وليست فحصًا للاكتمال، لذا راجع المعاينة بنفسك ولا تعتبر خلوّ القائمة ضمانًا.",
        },
      ],
      steps: [
        "اختر ملف .docx.",
        "راجع المعاينة وأي تنبيهات تحويل.",
        "اضغط طباعة / حفظ كـ PDF.",
        "اختر \"حفظ كملف PDF\" كوجهة في نافذة الطباعة.",
      ],
    },
  },
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

  "subtitle-studio": {
    related: ["audio-transcriber", "compress-video", "video", "screen-recorder"],
    en: {
      intro:
        "Subtitle Studio auto-captions your videos for reels, shorts, and social clips — helping them reach more viewers and stay watchable with the sound off, and more accessible to viewers who are deaf or hard of hearing. Captions are burned directly onto the picture with no watermark.\n\nTranscription runs entirely on-device using an in-browser Whisper model, so your video is never uploaded to a server, and it works in any language Whisper supports — not just English.\n\nOnce the transcript comes back, you can edit the wording and timing of individual cues, then pick a caption style — including TikTok-style animated captions like word-highlight or karaoke — before exporting.",
      faq: [
        {
          q: "Is my video uploaded anywhere?",
          a: "No. Every step — transcription, editing, and the caption burn — runs locally in your browser. Your video file never leaves your device.",
        },
        {
          q: "What can I export?",
          a: "You can always download SRT and VTT subtitle files instantly. You can also export a burned-in MP4 with captions rendered onto the picture — that file is re-encoded to H.264, so it's not a byte-for-byte copy of your source quality.",
        },
        {
          q: "How long a video can I burn in the browser?",
          a: "The in-browser burn works best on short-form clips. It's blocked outright past a duration ceiling, and longer or higher-resolution clips can run slowly before that limit. SRT/VTT export has no such limit and is always available as a fallback.",
        },
        {
          q: "Do I need to download anything?",
          a: "The first time you transcribe or burn captions, the in-browser model and processing engine download once and are cached afterward, so later runs start faster. Nothing is installed on your system.",
        },
        {
          q: "What languages are supported?",
          a: "Any language the Whisper speech-recognition model supports — transcription is not limited to English.",
        },
      ],
      steps: [
        "Drop a video into the tool.",
        "Let it auto-transcribe on-device.",
        "Edit the cue text and timing as needed.",
        "Pick a caption style or animation, such as TikTok-style word-highlight or karaoke.",
        "Export SRT/VTT subtitles, or a burned-in MP4.",
      ],
    },
    ar: {
      intro:
        "يضيف استوديو الترجمة ترجمات نصية تلقائية إلى مقاطع الفيديو — مثالية للريلز والمقاطع القصيرة — لتصل إلى جمهور أوسع وتبقى مفهومة عند المشاهدة بلا صوت، وأكثر إتاحة لمن يعانون ضعف السمع أو الصمم. تُحرق الترجمة مباشرة على الصورة دون أي علامة مائية.\n\nيعمل التفريغ الصوتي بالكامل على جهازك عبر نموذج Whisper يعمل داخل المتصفح، فلا يُرفع الفيديو إلى أي خادم أبدًا، وتدعم الأداة أي لغة يدعمها Whisper وليست مقتصرة على الإنجليزية.\n\nبعد ظهور النص، يمكنك تعديل صياغة كل مقطع وتوقيته، ثم اختيار نمط الترجمة — بما في ذلك أنماط متحركة على طريقة TikTok مثل تمييز الكلمة أثناء نطقها أو الكاريوكي — قبل التصدير.",
      faq: [
        {
          q: "هل يُرفع الفيديو إلى أي مكان؟",
          a: "لا. كل خطوة — من التفريغ الصوتي إلى التعديل وحرق الترجمة — تتم محليًا داخل متصفحك، ولا يغادر ملف الفيديو جهازك إطلاقًا.",
        },
        {
          q: "ماذا يمكنني تصدير؟",
          a: "يمكنك دائمًا تنزيل ملفي SRT وVTT فورًا. ويمكنك أيضًا تصدير فيديو MP4 بترجمة محروقة على الصورة، وهو معاد ترميزه بصيغة H.264، أي أنه ليس نسخة مطابقة تمامًا لجودة الفيديو الأصلي.",
        },
        {
          q: "كم يمكن أن يكون طول الفيديو الذي يمكن حرق ترجمته في المتصفح؟",
          a: "يعمل الحرق داخل المتصفح بأفضل شكل مع المقاطع القصيرة، وتُمنع العملية تمامًا بعد سقف زمني معين، وقد تكون أبطأ مع المقاطع الأطول أو عالية الدقة قبل بلوغ ذلك السقف. تصدير SRT/VTT لا يخضع لهذا القيد ويبقى متاحًا دائمًا كبديل.",
        },
        {
          q: "هل أحتاج لتنزيل أي شيء؟",
          a: "عند أول تفريغ صوتي أو حرق ترجمة، يُنزَّل نموذج المعالجة ومحركها داخل المتصفح مرة واحدة ثم يُخزَّنان مؤقتًا لتسريع المرات التالية. لا يُثبَّت أي برنامج على جهازك.",
        },
        {
          q: "ما اللغات المدعومة؟",
          a: "أي لغة يدعمها نموذج Whisper للتعرف على الكلام، فالتفريغ الصوتي غير مقتصر على الإنجليزية.",
        },
      ],
      steps: [
        "أسقط مقطع فيديو داخل الأداة.",
        "دع الأداة تُفرّغه صوتيًا تلقائيًا على جهازك.",
        "عدّل نص المقاطع وتوقيتها حسب الحاجة.",
        "اختر نمط الترجمة أو الحركة، مثل تمييز الكلمة أو الكاريوكي على طريقة TikTok.",
        "صدّر ملفات SRT/VTT أو فيديو MP4 بترجمة محروقة.",
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
        "The JSON Formatter pretty-prints, validates and minifies JSON. Paste a raw or mangled payload and it re-indents the structure at two or four spaces, so nested objects and arrays become readable again.\n\nIf the JSON won't parse, the exact parser message is shown along with the line it gave up on — usually enough to spot the trailing comma or unclosed bracket in a few seconds. There's also a sort-keys switch that recursively alphabetises every object, which turns two differently-ordered API responses into a clean diff, and a minify button that strips all whitespace back out.\n\nIt uses the browser's own JSON parser, so what it accepts is exactly what your code will accept — no more forgiving, no less. Everything happens in the tab; the payload is never sent anywhere.",
      whyClientSide:
        "The JSON people need to format is usually a live API response, which means it routinely contains a bearer token, a session cookie, a Stripe object, an internal user record, or a customer's address and phone number. Pasting that into a formatter that posts to a server is a small data-leak you perform on yourself, and a surprising number of popular online formatters do exactly that. Here JSON.parse runs in your tab and the string never leaves it — which also means the tool keeps working on a locked-down corporate network, or on a plane.",
      limitations: [
        "It accepts strict JSON only, because it is the browser's own parser. Comments, trailing commas, single-quoted strings, unquoted keys and other JSON5 or JSONC conveniences are all rejected — handy if you're validating what a strict server will accept, frustrating if you're editing a tsconfig.",
        "Numbers pass through JavaScript's number type. Integer IDs beyond 9,007,199,254,740,991 — Discord and Twitter snowflakes, some database keys — and high-precision decimals will come back subtly changed after formatting. If your payload has large IDs, don't round-trip it through here.",
        "Duplicate keys in the same object are silently collapsed to the last one, and keys that look like integers get reordered ahead of the rest by JavaScript's own property ordering. Both are standard parser behaviour, and both mean the formatted output is not always a byte-faithful reordering of your input.",
        "It's a formatter, not an editor: no collapsible tree view, no JSONPath or query support, no schema validation, and no diff. The input is a plain text area, so multi-megabyte documents will make typing sluggish.",
      ],
      faq: [
        {
          q: "Is my JSON sent to a server?",
          a: "No. Parsing, formatting and validation all run locally in your browser, so payloads containing tokens or customer data stay on your machine. There's no account and no signup.",
        },
        {
          q: "What does minifying JSON do?",
          a: "Minifying removes all unnecessary whitespace and line breaks, producing the smallest valid JSON. That reduces payload size for APIs and production builds.",
        },
        {
          q: "Why does it say my JSON is invalid?",
          a: "Most often a trailing comma, single quotes instead of double quotes, an unquoted key, or a missing bracket. The tool shows the parser's own message and the line it failed on.",
        },
        {
          q: "Can it handle comments or trailing commas?",
          a: "No. It uses the browser's strict JSON parser, so anything JSON5/JSONC-style is rejected. Strip comments first, or use a JSON5-aware editor.",
        },
        {
          q: "Can it sort object keys?",
          a: "Yes. The sort-keys switch alphabetises every object recursively, which gives two JSON documents a canonical order and makes them comparable in a diff.",
        },
      ],
      steps: [
        "Paste your JSON into the input area.",
        "Set the indent to 2 or 4 spaces, and turn on sort keys if you need a canonical order.",
        "Choose Format to pretty-print, Minify to compact it, or Validate to just check it.",
        "Fix any reported parse error, then copy or download the result.",
      ],
    },
    ar: {
      intro:
        "تجمّل أداة تنسيق JSON بياناتك وتتحقق منها وتصغّرها. الصق حمولة خام أو مشوّشة، فتعيد الأداة ترتيب البنية بمسافة بادئة من مسافتين أو أربع، لتعود الكائنات والمصفوفات المتداخلة قابلة للقراءة.\n\nوإن تعذّر تحليل البيانات، تعرض الأداة رسالة المحلّل نفسها مع رقم السطر الذي توقف عنده — وهذا يكفي عادةً لاكتشاف الفاصلة الزائدة أو القوس غير المغلق خلال ثوانٍ. وهناك أيضًا مفتاح لترتيب المفاتيح يرتّب كل كائن أبجديًا وبشكل متكرر، فيحوّل استجابتَي واجهة برمجة مختلفتَي الترتيب إلى فرق نظيف، وزر تصغير يزيل كل المسافات.\n\nتستخدم الأداة محلّل JSON الخاص بالمتصفح، فما تقبله هو تمامًا ما ستقبله شفرتك — لا أكثر تسامحًا ولا أقل. كل شيء يجري داخل التبويب، ولا تغادر الحمولة متصفحك.",
      whyClientSide:
        "بيانات JSON التي يحتاج الناس إلى تنسيقها هي غالبًا استجابة واجهة برمجة حيّة، أي أنها تحتوي عادةً على رمز وصول، أو كوكي جلسة، أو كائن دفع، أو سجل مستخدم داخلي، أو عنوان عميل ورقم هاتفه. ولصق ذلك في أداة تنسيق ترسل البيانات إلى خادم هو تسريب صغير تُنفّذه بنفسك على نفسك، وعدد مفاجئ من أدوات التنسيق الشائعة يفعل ذلك بالضبط. هنا يعمل JSON.parse داخل تبويبك ولا يغادره النص — وهذا يعني أيضًا أن الأداة تبقى تعمل على شبكة شركة مقيّدة، أو على متن طائرة.",
      limitations: [
        "تقبل الأداة JSON الصارم فقط، لأنها تستخدم محلّل المتصفح نفسه. فالتعليقات والفواصل الزائدة والنصوص بعلامات اقتباس مفردة والمفاتيح غير المقتبسة وسائر تسهيلات JSON5 وJSONC مرفوضة كلها — وهذا مفيد إن كنت تتحقق مما سيقبله خادم صارم، ومزعج إن كنت تحرّر ملف tsconfig.",
        "تمر الأرقام عبر نوع الأعداد في جافاسكربت. لذا معرّفات الأعداد الصحيحة التي تتجاوز 9,007,199,254,740,991 — مثل معرّفات Discord وTwitter وبعض مفاتيح قواعد البيانات — والأعداد العشرية عالية الدقة تعود متغيّرة قليلًا بعد التنسيق. إن كانت حمولتك تحوي معرّفات كبيرة، فلا تمرّرها عبر هذه الأداة ذهابًا وإيابًا.",
        "المفاتيح المكرّرة داخل الكائن نفسه تُختزل بصمت إلى آخر واحد، والمفاتيح التي تبدو أعدادًا صحيحة تتقدّم على البقية بحكم ترتيب الخصائص في جافاسكربت. وكلاهما سلوك قياسي للمحلّل، وكلاهما يعني أن الخرج المنسّق ليس دائمًا إعادة ترتيب مطابقة تمامًا لمدخلك.",
        "هذه أداة تنسيق لا محرّر: لا عرض شجري قابل للطي، ولا دعم لـ JSONPath أو الاستعلامات، ولا تحقق من المخطط، ولا مقارنة فروقات. وحقل الإدخال نص عادي، لذا تصبح الكتابة بطيئة مع المستندات التي تبلغ عدة ميغابايتات.",
      ],
      faq: [
        {
          q: "هل تُرسَل بيانات JSON إلى خادم؟",
          a: "لا. يجري التحليل والتنسيق والتحقق محليًا في متصفحك، فتبقى الحمولات التي تحوي رموز وصول أو بيانات عملاء على جهازك. ولا حساب ولا تسجيل.",
        },
        {
          q: "ماذا يفعل تصغير JSON؟",
          a: "يزيل التصغير كل المسافات وفواصل الأسطر غير الضرورية لإنتاج أصغر JSON صالح، مما يقلل حجم البيانات لواجهات البرمجة وبناءات الإنتاج.",
        },
        {
          q: "لماذا تظهر رسالة أن JSON غير صالح؟",
          a: "غالبًا بسبب فاصلة زائدة، أو علامات اقتباس مفردة بدل المزدوجة، أو مفتاح غير مقتبس، أو قوس ناقص. تعرض الأداة رسالة المحلّل نفسه والسطر الذي فشل عنده.",
        },
        {
          q: "هل تتعامل مع التعليقات أو الفواصل الزائدة؟",
          a: "لا. تستخدم الأداة محلّل JSON الصارم في المتصفح، فيُرفض كل ما هو على نمط JSON5 أو JSONC. أزل التعليقات أولًا، أو استخدم محرّرًا يدعم JSON5.",
        },
        {
          q: "هل يمكنها ترتيب مفاتيح الكائن؟",
          a: "نعم. يرتّب مفتاح ترتيب المفاتيح كل كائن أبجديًا وبشكل متكرر، فيمنح وثيقتَي JSON ترتيبًا موحّدًا ويجعل مقارنتهما ممكنة.",
        },
      ],
      steps: [
        "الصق بيانات JSON في حقل الإدخال.",
        "اضبط المسافة البادئة على مسافتين أو أربع، وفعّل ترتيب المفاتيح إن احتجت ترتيبًا موحّدًا.",
        "اختر «تنسيق» للتجميل، أو «تصغير» للضغط، أو «تحقق» للفحص فقط.",
        "صحّح أي خطأ تحليل معروض، ثم انسخ النتيجة أو نزّلها.",
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

  "object-cutout": {
    related: ["bg-removal", "depth-map", "image-upscaler", "image-captioner"],
    en: {
      intro:
        "Object Cutout lets you pick what to cut out. Drop in a PNG, JPG or WebP, click the object you want, and the AI draws an outline around exactly that thing and returns it as a transparent PNG. Alt-click (Option-click on a Mac) any area you want left out, such as a shadow or a neighbouring item, and run it again.\n\nThe model is SlimSAM, a compact variant of Meta's Segment Anything, loaded through Transformers.js. It runs in your browser on WebGPU when the browser offers it and on WebAssembly otherwise. Because you point at the subject yourself, it suits photos with several objects in them, where an automatic background remover has to guess which one you meant.\n\nIt is free, needs no account, adds no watermark, and your photo is never uploaded.",
      whyClientSide:
        "The photo is only ever read by the page you have open. Segmentation, the transparent PNG and the download all happen in your browser tab, so a product shot under embargo or a picture of a family member never reaches a server. The trade-off is a one-time model download on first use, around 21 MB, which a progress bar shows; the browser keeps it for later runs.",
      limitations: [
        "The first run downloads the model (about 21 MB). On a slow connection that is the longest part, and later runs reuse what the browser stored.",
        "The cutout is a hard-edged mask: each pixel is either kept or made fully transparent. There is no soft edge, so hair, fur and semi-transparent things such as glass come out rough. Expect to touch up fine detail in an image editor.",
        "You must click at least one point before it will run, and each new click discards the previous result, so you press Cut out object again after adjusting points. Clicks on the wrong spot can select a part of the object, or something else entirely; add include or exclude points until the mask is right.",
        "The model is small. Without WebGPU it runs on the CPU, which is slower, and the app shows a note saying so.",
      ],
      faq: [
        {
          q: "How is this different from the Background Removal tool?",
          a: "Background Removal decides for itself what the subject is and removes everything else, and it can process a batch. Object Cutout is the one to use when you want to choose: you click the object, and you can click to exclude parts, so it works on a photo with several items or when automatic removal picks the wrong subject. It handles one image at a time.",
        },
        {
          q: "How do I cut out an object from a photo?",
          a: "Upload the image, click on the object you want, then press Cut out object. The result appears in the result panel on a checkerboard so you can see the transparency, and Download saves it as a PNG.",
        },
        {
          q: "How do I exclude part of the image?",
          a: "Alt-click (Option-click on a Mac) on the area you want left out. Those points are marked in red and the plain clicks in green. Press Cut out object again afterwards; changing the points clears the previous result.",
        },
        {
          q: "Which AI model does it use?",
          a: "SlimSAM (Xenova/slimsam-77-uniform), a compact version of Segment Anything, run with Transformers.js. It uses WebGPU when available and WebAssembly otherwise. The model is fetched once from a CDN on first use; your image is not uploaded.",
        },
        {
          q: "What file do I get?",
          a: "A PNG at the same pixel dimensions as your original, with everything outside the mask made transparent. It is named after your file with -cutout added to the end.",
        },
        {
          q: "Which image formats can I upload?",
          a: "PNG, JPG and WebP, one image at a time.",
        },
      ],
      steps: [
        "Drop a PNG, JPG or WebP image onto the page or click to choose one.",
        "Click the object you want to keep. Alt-click any area you want excluded.",
        "Press Cut out object. On the first run, wait for the model to download.",
        "Check the transparent result, adjust your points and run again if needed, then download the PNG.",
      ],
    },
    ar: {
      intro:
        "أداة اقتطاع الكائنات تتيح لك أن تختار أنت ما يُقتطع. أسقط صورة PNG أو JPG أو WebP، وانقر على الكائن الذي تريده، فيرسم الذكاء الاصطناعي حدوده بدقة ويعيده بصيغة PNG بخلفية شفافة. وإن أردت استبعاد منطقة كظلٍّ أو عنصر مجاور فانقر عليها مع Alt (أو Option في ماك) ثم أعد التشغيل.\n\nالنموذج هو SlimSAM، نسخة مضغوطة من نموذج Segment Anything من Meta، ويُشغَّل عبر Transformers.js داخل متصفحك: على WebGPU إن وفّره المتصفح، وإلا على WebAssembly. ولأنك تشير إلى الهدف بنفسك، فهي مناسبة للصور التي فيها عدة عناصر، حيث تضطر أداة إزالة الخلفية التلقائية إلى التخمين.\n\nالأداة مجانية بلا حساب ولا علامة مائية، ولا تُرفع صورتك إلى أي خادم.",
      whyClientSide:
        "صورتك لا تقرؤها إلا الصفحة المفتوحة أمامك. التقطيع وإنشاء ملف PNG الشفاف والتنزيل كلها تتم داخل علامة تبويب المتصفح، فلا تصل لقطة منتج لم تُعلن بعد أو صورة لأحد أفراد العائلة إلى أي خادم. والمقابل هو تنزيل النموذج مرة واحدة عند أول استخدام، نحو 21 ميغابايت، ويعرضه شريط التقدم، ثم يحتفظ به المتصفح للمرات التالية.",
      limitations: [
        "التشغيل الأول ينزّل النموذج (نحو 21 ميغابايت)، وهو أطول جزء مع الاتصال البطيء. وتعيد المرات التالية استخدام النسخة المحفوظة في المتصفح.",
        "القصاصة قناع بحواف حادة: كل بكسل إما يبقى وإما يصبح شفافًا تمامًا. لا توجد حافة ناعمة، فيخرج الشعر والفراء والأجسام شبه الشفافة كالزجاج خشنة. توقّع أن تنقّح التفاصيل الدقيقة في محرر صور.",
        "لا بد من نقرة واحدة على الأقل قبل التشغيل، وكل نقرة جديدة تمسح النتيجة السابقة، فتضغط «اقتطاع الكائن» من جديد بعد تعديل النقاط. وقد تحدد نقرة في موضع غير مناسب جزءًا من الكائن أو شيئًا آخر؛ أضف نقاط تضمين أو استبعاد حتى يصح القناع.",
        "النموذج صغير. وبلا WebGPU يعمل على المعالج فيكون أبطأ، وتعرض الأداة ملاحظة بذلك.",
      ],
      faq: [
        {
          q: "ما الفرق بينها وبين أداة إزالة الخلفية؟",
          a: "أداة إزالة الخلفية تحدد بنفسها ما هو الهدف وتحذف ما سواه، ويمكنها معالجة دفعة من الصور. أما اقتطاع الكائنات فهي لمن يريد أن يختار بنفسه: تنقر على الكائن، ويمكنك النقر لاستبعاد أجزاء، فتناسب الصور التي فيها عدة عناصر أو الحالات التي يخطئ فيها الحذف التلقائي في تحديد الهدف. وهي تعالج صورة واحدة في كل مرة.",
        },
        {
          q: "كيف أقتطع كائنًا من صورة؟",
          a: "ارفع الصورة، وانقر على الكائن الذي تريده، ثم اضغط «اقتطاع الكائن». تظهر النتيجة في لوحة النتيجة فوق نمط مربعات ليظهر الجزء الشفاف، ويحفظها زر التنزيل بصيغة PNG.",
        },
        {
          q: "كيف أستبعد جزءًا من الصورة؟",
          a: "انقر على المنطقة التي تريد تركها مع الضغط على Alt (أو Option في ماك). تُعلَّم نقاط الاستبعاد باللون الأحمر والنقرات العادية بالأخضر. اضغط «اقتطاع الكائن» مرة أخرى بعد ذلك، فتغيير النقاط يمسح النتيجة السابقة.",
        },
        {
          q: "أي نموذج ذكاء اصطناعي تستخدم الأداة؟",
          a: "SlimSAM (Xenova/slimsam-77-uniform)، نسخة مضغوطة من Segment Anything، ويُشغَّل عبر Transformers.js. يستخدم WebGPU إن توفر وإلا WebAssembly. ويُجلب النموذج مرة واحدة من شبكة توصيل المحتوى عند أول استخدام، ولا تُرفع صورتك.",
        },
        {
          q: "ما الملف الذي أحصل عليه؟",
          a: "ملف PNG بنفس أبعاد صورتك الأصلية بالبكسل، وكل ما هو خارج القناع شفاف. ويحمل اسم ملفك مضافًا إليه -cutout في النهاية.",
        },
        {
          q: "ما صيغ الصور التي يمكنني رفعها؟",
          a: "صور PNG وJPG وWebP، صورة واحدة في كل مرة.",
        },
      ],
      steps: [
        "أسقط صورة PNG أو JPG أو WebP على الصفحة أو انقر لاختيارها.",
        "انقر على الكائن الذي تريد الاحتفاظ به، وانقر مع Alt على أي منطقة تريد استبعادها.",
        "اضغط «اقتطاع الكائن». في أول مرة انتظر تنزيل النموذج.",
        "افحص النتيجة الشفافة، وعدّل نقاطك وأعد التشغيل عند الحاجة، ثم نزّل ملف PNG.",
      ],
    },
  },
  "image-captioner": {
    related: ["image-to-text", "depth-map", "object-cutout", "image-upscaler"],
    en: {
      intro:
        "This image captioner looks at a picture and writes a short description of it, then wraps that description in a ready-to-paste alt attribute. Drop in an image, press Generate caption, and you get two boxes to copy from: the plain caption and the alt text as an HTML snippet.\n\nThe model is vit-gpt2-image-captioning, run in your browser through Transformers.js and ONNX Runtime, on WebGPU where available and WebAssembly otherwise. It accepts PNG, JPG, WebP, GIF and BMP files up to 15 MB.\n\nThe caption is a starting point, not a finished description. Read it against the image and edit it to fit the context the picture appears in.",
      whyClientSide:
        "Images you want alt text for are often unpublished: a draft page, a client mock-up, a screenshot with something confidential in it. The picture is read only by this tab and is not uploaded. What you pay for that is the model download on first use, which is large: roughly 246 MB on the WebAssembly path and about 958 MB when WebGPU is used. A progress bar shows it, and the browser keeps the model afterwards.",
      limitations: [
        "The first run is a big download, about 246 MB on WebAssembly and about 958 MB on WebGPU. On mobile data or a slow link, think twice before starting it.",
        "Captions are short and general. The model describes what it sees in a sentence and will miss text in the image, names, brands and details that matter to your page; it can also describe something wrongly.",
        "The alt snippet is just the caption placed inside alt quotes. It does not know the purpose of the image on your page, so review it and rewrite it where context matters.",
        "Files over 15 MB are rejected, and the page captions one image at a time.",
      ],
      faq: [
        {
          q: "How do I generate alt text for an image?",
          a: "Upload the image, press Generate caption, and copy the Alt text (HTML) box into your img tag. Then read it against the picture and adjust it to the role the image plays on your page; a generated caption is a draft.",
        },
        {
          q: "Which AI model does it use?",
          a: "Xenova/vit-gpt2-image-captioning, a vision-encoder plus GPT-2 captioning model, run with Transformers.js. It uses WebGPU when your browser offers it and WebAssembly otherwise.",
        },
        {
          q: "Why is the first run so slow?",
          a: "The model is downloaded to your browser the first time: about 246 MB on the WebAssembly path and about 958 MB with WebGPU. The progress bar shows it. After that the browser keeps it, so later captions are much quicker.",
        },
        {
          q: "Is my image uploaded?",
          a: "No. The captioning happens in your browser; only the model files are fetched, from a CDN, on first use.",
        },
        {
          q: "Can I trust the caption for accessibility?",
          a: "Treat it as a first draft. It gives a generic description of the scene and cannot know why the image is on your page, so check that it is accurate and says what a person using a screen reader needs to know.",
        },
        {
          q: "What file formats and sizes are supported?",
          a: "PNG, JPG, WebP, GIF and BMP, up to 15 MB each, one at a time.",
        },
      ],
      steps: [
        "Drop a PNG, JPG, WebP, GIF or BMP image onto the page or click to choose one.",
        "Press Generate caption. On the first run, wait for the model to download.",
        "Copy the caption, or copy the alt text snippet for your img tag.",
        "Review the wording against the image and edit it to match its context.",
      ],
    },
    ar: {
      intro:
        "مولّد وصف الصور هذا ينظر إلى الصورة ويكتب لها وصفًا قصيرًا، ثم يضعه في وسم alt جاهز للصق. أسقط صورة واضغط «إنشاء الوصف»، فتحصل على مربعين للنسخ: الوصف النصي، والنص البديل على هيئة مقطع HTML.\n\nالنموذج هو vit-gpt2-image-captioning، ويعمل داخل متصفحك عبر Transformers.js وONNX Runtime، على WebGPU إن توفر وإلا على WebAssembly. وتقبل الأداة ملفات PNG وJPG وWebP وGIF وBMP حتى 15 ميغابايت.\n\nالوصف نقطة بداية لا وصف نهائي. اقرأه مقابل الصورة وعدّله بما يناسب السياق الذي تظهر فيه.",
      whyClientSide:
        "الصور التي تحتاج لها نصًا بديلًا غالبًا لم تُنشر بعد: صفحة قيد الإعداد، أو تصميم أولي لعميل، أو لقطة شاشة فيها شيء سري. لا تقرأ الصورةَ إلا علامة التبويب هذه ولا تُرفع. وثمن ذلك تنزيل النموذج عند أول استخدام، وهو كبير: نحو 246 ميغابايت على مسار WebAssembly ونحو 958 ميغابايت عند استخدام WebGPU. ويعرض شريط التقدم ذلك، ويحتفظ المتصفح بالنموذج بعدها.",
      limitations: [
        "التشغيل الأول تنزيل كبير، نحو 246 ميغابايت على WebAssembly ونحو 958 ميغابايت على WebGPU. ففكّر قبل البدء إذا كنت على بيانات الجوال أو اتصال بطيء.",
        "الأوصاف قصيرة وعامة. يصف النموذج ما يراه في جملة، ويفوته النص المكتوب داخل الصورة والأسماء والعلامات التجارية والتفاصيل التي تهم صفحتك، وقد يصف الشيء خطأً.",
        "مقطع alt هو الوصف نفسه موضوعًا بين علامتي اقتباس. ولا يعرف الغرض من الصورة في صفحتك، فراجعه وأعد صياغته حيث يهم السياق.",
        "تُرفض الملفات الأكبر من 15 ميغابايت، وتعالج الصفحة صورة واحدة في كل مرة.",
      ],
      faq: [
        {
          q: "كيف أنشئ نصًا بديلًا لصورة؟",
          a: "ارفع الصورة واضغط «إنشاء الوصف»، ثم انسخ مربع «النص البديل (HTML)» إلى وسم img. بعد ذلك اقرأه مقابل الصورة وعدّله بحسب دورها في صفحتك؛ فالوصف المولَّد مسودة.",
        },
        {
          q: "أي نموذج ذكاء اصطناعي تستخدم الأداة؟",
          a: "Xenova/vit-gpt2-image-captioning، نموذج وصف صور يجمع مرمّز رؤية مع GPT-2، ويُشغَّل عبر Transformers.js. يستخدم WebGPU إن وفّره متصفحك وإلا WebAssembly.",
        },
        {
          q: "لماذا التشغيل الأول بطيء؟",
          a: "لأن النموذج يُنزَّل إلى متصفحك أول مرة: نحو 246 ميغابايت على مسار WebAssembly ونحو 958 ميغابايت مع WebGPU، ويعرض شريط التقدم ذلك. وبعدها يحتفظ به المتصفح فتكون الأوصاف اللاحقة أسرع بكثير.",
        },
        {
          q: "هل تُرفع صورتي؟",
          a: "لا. يتم توليد الوصف داخل متصفحك، ولا يُجلب إلا ملفات النموذج من شبكة توصيل المحتوى عند أول استخدام.",
        },
        {
          q: "هل أعتمد على الوصف لأغراض الوصولية؟",
          a: "اعتبره مسودة أولى. فهو يعطي وصفًا عامًا للمشهد ولا يعرف سبب وجود الصورة في صفحتك، فتأكد من دقته ومن أنه يقول ما يحتاجه مستخدم قارئ الشاشة.",
        },
        {
          q: "ما الصيغ والأحجام المدعومة؟",
          a: "PNG وJPG وWebP وGIF وBMP، حتى 15 ميغابايت للملف، صورة واحدة في كل مرة.",
        },
      ],
      steps: [
        "أسقط صورة PNG أو JPG أو WebP أو GIF أو BMP على الصفحة أو انقر لاختيارها.",
        "اضغط «إنشاء الوصف». في أول مرة انتظر تنزيل النموذج.",
        "انسخ الوصف، أو انسخ مقطع النص البديل لوسم img.",
        "راجع الصياغة مقابل الصورة وعدّلها بما يناسب سياقها.",
      ],
    },
  },
  "image-upscaler": {
    related: ["depth-map", "bg-removal", "object-cutout", "image-resizer", "image-compression"],
    en: {
      intro:
        "The Image Upscaler doubles the width and height of a picture using an AI super-resolution model, so a 500×500 image comes back as 1000×1000. Drop in a PNG, JPG or WebP, press Upscale 2x, and download the result as a PNG. The original and upscaled sizes are shown side by side.\n\nThe model is Swin2SR (classical, x2), run in your browser with Transformers.js and ONNX Runtime, on WebGPU where available and WebAssembly otherwise. Unlike a plain resize, which only stretches the pixels you already have, the model predicts plausible extra detail. That helps with a small, soft image; it cannot recover detail that was never captured.\n\nIt is free, needs no account, and adds no watermark.",
      whyClientSide:
        "Upscaling is done in this tab, so the photo you are enlarging, an old family picture or a client asset, is never sent anywhere. The cost of that is memory and the first-run download: the model is about 21 MB on WebAssembly and about 54 MB with WebGPU, and the work is done on your own device, so large inputs are slow or can fail.",
      limitations: [
        "It is fixed at 2x. There is no 4x option and no choice of model; to go further you would have to run the output through again, and each pass is limited by the same constraints.",
        "Inputs are capped at 8 MB, and the page itself advises keeping inputs to roughly 1000×1000 px or smaller because large images use a lot of memory. A large image may fail and ask you to try a smaller one.",
        "The extra detail is the model's prediction, not recovered information. Faces, text and fine patterns can look smoothed or slightly invented, so check the result before you rely on it.",
        "The only output is a PNG, which can be much larger on disk than a JPG of the same picture.",
      ],
      faq: [
        {
          q: "How do I upscale an image without losing quality?",
          a: "Upload it and press Upscale 2x. The AI model doubles the dimensions and predicts the extra detail, which usually looks better than stretching the pixels. No tool can bring back detail that the original never contained, so judge the output at full size.",
        },
        {
          q: "How much bigger does the image get?",
          a: "Exactly 2x in each direction: a 640×480 image becomes 1280×960. The page shows the original and upscaled dimensions so you can confirm.",
        },
        {
          q: "Which AI model does it use?",
          a: "Swin2SR classical super-resolution at 2x (Xenova/swin2SR-classical-sr-x2-64), run with Transformers.js. It uses WebGPU when available and WebAssembly otherwise.",
        },
        {
          q: "What are the size limits?",
          a: "Files up to 8 MB in PNG, JPG or WebP. For the best chance of success, keep inputs to about 1000×1000 pixels or smaller, because larger images use a lot of memory.",
        },
        {
          q: "Is my image uploaded?",
          a: "No. The model runs in your browser. Only the model files are downloaded, once, when you first use the tool: about 21 MB on WebAssembly and about 54 MB on WebGPU.",
        },
        {
          q: "What file do I get?",
          a: "A PNG named after your original with _upscaled added to the end.",
        },
      ],
      steps: [
        "Drop a PNG, JPG or WebP image (up to 8 MB) onto the page or click to choose one.",
        "Press Upscale 2x. On the first run, wait for the model to download.",
        "Compare the original and upscaled sizes shown on the two panels.",
        "Download the upscaled image as a PNG.",
      ],
    },
    ar: {
      intro:
        "أداة رفع دقة الصور تضاعف عرض الصورة وارتفاعها بنموذج ذكاء اصطناعي للدقة الفائقة، فتعود صورة 500×500 بحجم 1000×1000. أسقط صورة PNG أو JPG أو WebP، واضغط «رفع الدقة 2x»، ثم نزّل النتيجة بصيغة PNG. ويُعرض مقاس الأصل ومقاس الصورة المكبَّرة جنبًا إلى جنب.\n\nالنموذج هو Swin2SR (النسخة الكلاسيكية x2) ويعمل داخل متصفحك عبر Transformers.js وONNX Runtime، على WebGPU إن توفر وإلا على WebAssembly. وبخلاف تغيير الحجم العادي الذي يمطّ البكسلات الموجودة فقط، يتنبأ النموذج بتفاصيل إضافية معقولة. وهذا يفيد الصور الصغيرة الباهتة، لكنه لا يستعيد تفاصيل لم تُلتقط أصلًا.\n\nالأداة مجانية بلا حساب ولا علامة مائية.",
      whyClientSide:
        "يتم رفع الدقة داخل هذه الصفحة، فلا تُرسَل الصورة التي تكبّرها، سواء صورة عائلية قديمة أو ملفًا لعميل، إلى أي مكان. وثمن ذلك الذاكرة وتنزيل أول تشغيل: النموذج نحو 21 ميغابايت على WebAssembly ونحو 54 ميغابايت مع WebGPU، والعمل يجري على جهازك أنت، فتكون المدخلات الكبيرة بطيئة وقد تفشل.",
      limitations: [
        "الدقة ثابتة عند 2x. لا يوجد خيار 4x ولا اختيار لنموذج آخر؛ وللذهاب أبعد عليك إعادة تمرير الناتج، وكل مرة تخضع للقيود نفسها.",
        "حجم الملف المدخل محصور في 8 ميغابايت، وتنصح الصفحة نفسها بإبقاء المدخلات عند نحو 1000×1000 بكسل أو أقل لأن الصور الكبيرة تستهلك ذاكرة كثيرة. وقد تفشل الصورة الكبيرة فتُطلب منك صورة أصغر.",
        "التفاصيل الإضافية تنبؤ من النموذج لا معلومات مُستعادة. فقد تبدو الوجوه والنصوص والأنماط الدقيقة ملساء أو مُختلَقة قليلًا، فافحص النتيجة قبل الاعتماد عليها.",
        "الناتج الوحيد ملف PNG، وقد يكون حجمه على القرص أكبر بكثير من JPG للصورة نفسها.",
      ],
      faq: [
        {
          q: "كيف أرفع دقة صورة دون خسارة الجودة؟",
          a: "ارفعها واضغط «رفع الدقة 2x». يضاعف النموذج الأبعاد ويتنبأ بالتفاصيل الإضافية، وغالبًا ما يبدو ذلك أفضل من تمطيط البكسلات. لكن لا أداة تعيد تفاصيل لم تكن في الأصل، فاحكم على الناتج بحجمه الكامل.",
        },
        {
          q: "كم يكبر حجم الصورة؟",
          a: "بالضبط ضعفان في كل اتجاه: صورة 640×480 تصبح 1280×960. وتعرض الصفحة الأبعاد قبل رفع الدقة وبعده لتتأكد.",
        },
        {
          q: "أي نموذج ذكاء اصطناعي تستخدم الأداة؟",
          a: "Swin2SR للدقة الفائقة الكلاسيكية بمعامل 2x (Xenova/swin2SR-classical-sr-x2-64)، ويُشغَّل عبر Transformers.js. يستخدم WebGPU إن توفر وإلا WebAssembly.",
        },
        {
          q: "ما حدود الحجم؟",
          a: "ملفات PNG أو JPG أو WebP حتى 8 ميغابايت. ولأفضل فرصة للنجاح أبقِ المدخلات عند نحو 1000×1000 بكسل أو أقل، لأن الصور الأكبر تستهلك ذاكرة كثيرة.",
        },
        {
          q: "هل تُرفع صورتي؟",
          a: "لا. يعمل النموذج داخل متصفحك، ولا يُنزَّل إلا ملفاته مرة واحدة عند أول استخدام: نحو 21 ميغابايت على WebAssembly ونحو 54 ميغابايت على WebGPU.",
        },
        {
          q: "ما الملف الذي أحصل عليه؟",
          a: "ملف PNG باسم ملفك الأصلي مضافًا إليه _upscaled في النهاية.",
        },
      ],
      steps: [
        "أسقط صورة PNG أو JPG أو WebP (حتى 8 ميغابايت) على الصفحة أو انقر لاختيارها.",
        "اضغط «رفع الدقة 2x». في أول مرة انتظر تنزيل النموذج.",
        "قارن بين مقاسَي الأصل والصورة المكبَّرة المعروضين على اللوحتين.",
        "نزّل الصورة المكبَّرة بصيغة PNG.",
      ],
    },
  },
  "bg-removal": {
    related: [
      "object-cutout",
      "depth-map",
      "image-upscaler",
      "image-compression",
      "image-converter",
    ],
    en: {
      intro:
        "Background Removal cuts the subject out of a photo and hands back a PNG with a transparent background. It's the step before a product goes onto a white marketplace listing, a headshot goes into a slide deck, or a shot of a logo gets dropped onto a coloured banner.\n\nThe cutout is produced by an ISNet segmentation model running inside your browser — on WebGPU where the browser supports it, and on WebAssembly where it doesn't. Drop in one image or a whole batch; each is processed in turn, and you can save them one by one or download the lot as a ZIP. A before/after toggle lets you check the edges before you commit to the result.\n\nNo account, no credits, no per-image charge, and no watermark on the output.",
      whyClientSide:
        "Two things change when the model runs on your machine instead of someone's GPU cluster. The first is money: hosted background removers meter you because every cutout costs them GPU time, which is why the free tier hands back a low-resolution preview and the full-size file sits behind credits. There's no bill to pass on here, so you get the full resolution of whatever you put in, as often as you like. The second is that these photos are frequently personal or not yet public — ID and passport photos, a child's picture for a school project, product shots under embargo before a launch. Those stay in the tab. The one thing that does cross the network is the model itself, fetched from the imgly CDN the first time you use the tool.",
      limitations: [
        "Fine detail is where this loses to a paid service. Segmentation runs at a fixed 1024×1024 internally and the resulting mask is scaled back up to your image's real dimensions, so wispy hair, fur, chain-link, netting, motion blur and semi-transparent things like glass or a veil come back rough or partly eaten. Feeding it a bigger photo doesn't buy a more detailed edge — the model never sees those extra pixels.",
        "The output is a transparent PNG and nothing else. There's no background replacement: no solid colour, no new backdrop, no drop shadow, no re-cropping. You'll need a second tool to composite the cutout onto something.",
        "The first run downloads the model from a CDN, so the tool needs a connection the first time and the download is noticeable on a slow link. The files land in the ordinary browser HTTP cache rather than durable storage, so clearing site data means downloading them again.",
        "Everything runs on the page's main thread and the per-image progress bar doesn't actually move — it sits at zero until an image finishes. A batch of large photos will make the tab unresponsive with no useful indication of how far along it is, and there's no cancel.",
      ],
      faq: [
        {
          q: "Is there a free background remover with no signup and no watermark?",
          a: "This is one. There's no account, no credits and no watermark, and you get the full resolution of the image you put in rather than a downscaled preview.",
        },
        {
          q: "Are my photos uploaded to remove the background?",
          a: "No. The image is processed inside the browser tab and never sent anywhere. The only network request is the one-time download of the AI model files from a CDN.",
        },
        {
          q: "Is it as good as a paid service like remove.bg?",
          a: "On clean subjects with defined edges — products, people against a plain wall, objects on a table — the results are comparable. On hair, fur, fine mesh, motion blur or anything semi-transparent, a paid service running a larger model at higher resolution will usually cut more accurately. Check the before/after toggle before you use the result.",
        },
        {
          q: "Can I replace the background with a colour or another image?",
          a: "Not here. The tool gives you a transparent PNG; putting something behind it is a separate step in an image editor or collage tool.",
        },
        {
          q: "Can I do several images at once?",
          a: "Yes. Drop in a batch and they're processed one after another, then download them individually or all together as a ZIP.",
        },
      ],
      steps: [
        "Drop in one or more PNG or JPG images.",
        "Wait while the subject is cut out — the first run also downloads the model.",
        "Use the before/after toggle to check the edges.",
        "Download the transparent PNGs individually, or the whole batch as a ZIP.",
      ],
    },
    ar: {
      intro:
        "تقتطع أداة «إزالة الخلفية» الموضوع من الصورة وتعيده لك بصيغة PNG بخلفية شفافة. إنها الخطوة التي تسبق نشر منتج في قائمة تسوّق بخلفية بيضاء، أو إدراج صورة شخصية في عرض تقديمي، أو وضع لقطة شعار فوق لافتة ملوّنة.\n\nيُنتَج القَص بنموذج تجزئة من عائلة ISNet يعمل داخل متصفحك — على WebGPU حيث يدعمه المتصفح، وعلى WebAssembly حيث لا يدعمه. أسقط صورة واحدة أو دفعة كاملة؛ تُعالَج كل صورة بدورها، ويمكنك حفظها واحدة تلو الأخرى أو تنزيلها كلها في ملف ZIP. وهناك مفتاح «قبل/بعد» لتفحص الحواف قبل اعتماد النتيجة.\n\nلا حساب ولا أرصدة ولا رسوم لكل صورة ولا علامة مائية على الناتج.",
      whyClientSide:
        "يتغيّر أمران حين يعمل النموذج على جهازك بدل عنقود معالجات رسومية عند طرف آخر. الأول هو المال: خدمات إزالة الخلفية المستضافة تحسب عليك مقابلًا لأن كل عملية قص تكلّفها وقت معالجة، ولهذا تعيد لك الخطة المجانية معاينة منخفضة الدقة بينما يبقى الملف بحجمه الكامل خلف الأرصدة. لا توجد هنا فاتورة تُمرَّر إليك، فتحصل على الدقة الكاملة لما أدخلته، وبقدر ما تشاء. والثاني أن هذه الصور شخصية أو غير منشورة بعد في الغالب — صور هوية وجواز سفر، أو صورة طفل لمشروع مدرسي، أو لقطات منتج قبل إطلاقه. هذه كلها تبقى داخل التبويب. الشيء الوحيد الذي يعبر الشبكة هو النموذج نفسه، ويُجلَب من شبكة توصيل محتوى تابعة لـ imgly عند أول استخدام.",
      limitations: [
        "التفاصيل الدقيقة هي موضع تفوّق الخدمات المدفوعة. تجري التجزئة داخليًا بدقة ثابتة 1024×1024 ثم يُكبَّر القناع الناتج إلى أبعاد صورتك الحقيقية، لذا تعود خصلات الشعر الرفيعة والفراء والشِّباك والحواف الضبابية والأشياء شبه الشفافة كالزجاج أو الطرحة خشنة أو منقوصة. وإدخال صورة أكبر لا يمنحك حافة أدق — فالنموذج لا يرى تلك البكسلات الزائدة أصلًا.",
        "الناتج صورة PNG شفافة ولا شيء غير ذلك. لا استبدال للخلفية: لا لون ثابت، ولا خلفية جديدة، ولا ظل، ولا إعادة قص. ستحتاج أداة ثانية لتركيب القَص فوق شيء آخر.",
        "التشغيل الأول ينزّل النموذج من شبكة توصيل محتوى، فتحتاج الأداة إلى اتصال في المرة الأولى، ويكون التنزيل ملحوظًا على وصلة بطيئة. وتُحفَظ الملفات في ذاكرة المتصفح المؤقتة العادية لا في تخزين دائم، فمسح بيانات الموقع يعني تنزيلها من جديد.",
        "كل شيء يجري على الخيط الرئيسي للصفحة، وشريط التقدّم لكل صورة لا يتحرك فعليًا — يبقى عند الصفر حتى تنتهي الصورة. لذا تجعل دفعة من الصور الكبيرة التبويب لا يستجيب دون مؤشر مفيد على مدى التقدّم، ولا يوجد زر إلغاء.",
      ],
      faq: [
        {
          q: "هل توجد أداة مجانية لإزالة الخلفية بلا تسجيل وبلا علامة مائية؟",
          a: "هذه واحدة منها. لا حساب ولا أرصدة ولا علامة مائية، وتحصل على الدقة الكاملة للصورة التي أدخلتها بدل معاينة مصغّرة.",
        },
        {
          q: "هل تُرفع صوري لإزالة الخلفية؟",
          a: "لا. تُعالَج الصورة داخل تبويب المتصفح ولا تُرسَل إلى أي مكان. الطلب الوحيد عبر الشبكة هو تنزيل ملفات نموذج الذكاء الاصطناعي مرة واحدة من شبكة توصيل محتوى.",
        },
        {
          q: "هل هي بجودة خدمة مدفوعة مثل remove.bg؟",
          a: "مع المواضيع النظيفة ذات الحواف الواضحة — منتجات، أو أشخاص أمام جدار سادة، أو أغراض على طاولة — تكون النتائج متقاربة. أما مع الشعر والفراء والشِّباك الدقيقة والحواف الضبابية وأي شيء شبه شفاف، فالخدمة المدفوعة التي تشغّل نموذجًا أكبر بدقة أعلى تقصّ عادةً بدقة أفضل. راجع مفتاح «قبل/بعد» قبل اعتماد النتيجة.",
        },
        {
          q: "هل يمكنني استبدال الخلفية بلون أو بصورة أخرى؟",
          a: "ليس هنا. تعطيك الأداة صورة PNG شفافة، ووضع شيء خلفها خطوة منفصلة في محرّر صور أو أداة تجميع.",
        },
        {
          q: "هل يمكنني معالجة عدة صور دفعة واحدة؟",
          a: "نعم. أسقط دفعة من الصور فتُعالَج واحدة بعد الأخرى، ثم نزّلها فرادى أو مجتمعة في ملف ZIP.",
        },
      ],
      steps: [
        "أسقط صورة أو أكثر بصيغة PNG أو JPG.",
        "انتظر اقتطاع الموضوع — التشغيل الأول ينزّل النموذج أيضًا.",
        "استخدم مفتاح «قبل/بعد» لتفحص الحواف.",
        "نزّل صور PNG الشفافة فرادى، أو الدفعة كاملة في ملف ZIP.",
      ],
    },
  },

  "image-compression": {
    related: [
      "image-converter",
      "image-resizer",
      "compress-image-to-100kb",
      "exif-remover",
    ],
    extra: {
      ru: {
        intro:
          "Сжать изображение онлайн можно прямо в браузере: «Сжатие изображений» уменьшает фото настолько, чтобы оно прошло туда, куда нужно, — под лимит вложения в письме, в форму, которая отклоняет всё больше 500 КБ, или на медленно загружающуюся страницу. Загрузите PNG, JPG или WebP размером до 25 МБ и выберите, чем пожертвовать: качеством или размером.\n\nРежимов четыре. «Авто» подбирает качество в зависимости от размера исходника. «Агрессивный» сжимает сильно и ни о чём не спрашивает. «Свой» отдаёт в ваши руки ползунок качества. «Целевой размер» — самый интересный: укажите число в килобайтах, и инструмент подберёт качество, чтобы уложиться, а если одного качества не хватает — начнёт уменьшать ширину. Максимальную ширину можно задать и напрямую: для фото, которое пойдёт на сайт, это обычно самая большая экономия. Кодирование выполняет встроенный кодировщик браузера, поэтому нет ни загрузки на сервер, ни очереди, ни аккаунта, ни водяного знака.",
        whyClientSide:
          "Скажем честно: чаще всего вы сжимаете отпускное фото, и никому нет дела, кто его увидит. Но самая частая настоящая задача для такого инструмента — уместить скан паспорта, подпись или фото на документы в килобайтный лимит государственного портала, а такие файлы не хочется отдавать бесплатному веб-сервису ради уменьшенной копии. Вторая причина — скорость. Загружать 20 МБ, чтобы сервер вернул 200 КБ, — самый медленный способ сделать то, что ваш ноутбук делает примерно за секунду, а при слабом соединении это вообще не работает, хотя именно в такой ситуации файл обычно и оказывается слишком большим для отправки.",
        limitations: [
          "Инструмент использует встроенный кодировщик браузера — это грубый инструмент по сравнению со специализированным. Решения на MozJPEG или oxipng обычно дают файл меньше при том же визуальном качестве. Для продакшен-ресурсов, где важны последние проценты, используйте оптимизатор на этапе сборки.",
          "PNG почти не выигрывает и может стать больше. Изображение перерисовывается из исходных пикселей без учёта палитры и фильтров оригинала, поэтому индексированный PNG возвращается как полноценный RGBA. Поэтому же PNG недоступен в режиме целевого размера. Чтобы действительно уменьшить PNG, измените его размер или переведите в WebP или JPEG.",
          "Любой режим перерисовывает изображение на canvas, и все метаданные теряются: EXIF, GPS-координаты, настройки камеры, цветовые профили ICC и XMP. Обычно это плюс для приватности, иногда проблема: цвета фото с широким охватом могут сместиться без профиля, а дата съёмки пропадёт.",
          "Один файл за раз: без пакетной обработки и ZIP, предел 25 МБ, без AVIF на входе и на выходе. Кодирование идёт в основном потоке, поэтому большое изображение ненадолго подвешивает страницу, а если выбрать формат вывода, который браузер не умеет кодировать, инструмент молча запишет PNG с неверным расширением.",
        ],
        faq: [
          {
            q: "Можно ли сжать фото до точного размера, например до 100 КБ?",
            a: "Почти. Режим целевого размера принимает значение от 5 КБ до 5 МБ, подбирает подходящее качество и уменьшает ширину, если одного качества мало. Он останавливается, как только файл становится меньше вашего числа, так что результат получается равным цели или чуть ниже. Если без потери пригодности изображения цель недостижима, инструмент сообщит об этом и отдаст самую маленькую версию, которую удалось получить.",
          },
          {
            q: "Загружаются ли мои изображения на сервер при сжатии?",
            a: "Нет. Файл читается и перекодируется внутри вкладки браузера. Ничего не передаётся, аккаунт и регистрация не нужны, а сам инструмент работает и без подключения к интернету.",
          },
          {
            q: "Почему PNG не стал меньше?",
            a: "PNG — формат без потерь, регулятора качества у него нет: браузер просто заново кодирует те же пиксели, а PNG с палитрой может даже вырасти, потому что возвращается как полноцветный. Уменьшите ширину или смените формат вывода на WebP или JPEG.",
          },
          {
            q: "Удаляются ли при сжатии данные о местоположении на фото?",
            a: "Да, как побочный эффект. Перерисовка через canvas отбрасывает весь EXIF, включая GPS-координаты и сведения о камере. Если цель — именно очистить метаданные, прямее подойдёт отдельный инструмент для удаления EXIF.",
          },
          {
            q: "Какой формат вывода выбрать?",
            a: "WebP для сайта: обычно он заметно меньше JPEG при том же качестве и сегодня поддерживается везде, где это важно. JPEG, когда нужен файл, который откроет любая старая система. Оставьте исходный формат, если тип файла должен остаться прежним.",
          },
        ],
        steps: [
          "Загрузите PNG, JPG или WebP размером до 25 МБ.",
          "Выберите режим: «Авто», «Агрессивный», «Свой» (качество) или целевой размер в КБ.",
          "При желании задайте формат вывода и максимальную ширину.",
          "Сравните оригинал со сжатой версией и скачайте результат.",
        ],
      },
      fa: {
        intro:
          "برای فشرده سازی عکس بدون نصب هیچ برنامه‌ای، «فشرده‌سازی تصویر» حجم عکس را آن‌قدر کم می‌کند که به جایی که باید برود جا شود؛ زیر سقف پیوست ایمیل، در فرمی که فایل بالای ۵۰۰ کیلوبایت را رد می‌کند، یا در صفحه‌ای که کند بالا می‌آید. یک فایل PNG، JPG یا WebP تا ۲۵ مگابایت بیندازید و انتخاب کنید کیفیت را فدای حجم کنید یا برعکس.\n\nچهار حالت وجود دارد. «خودکار» کیفیت را بر اساس اندازهٔ فایل مبدأ انتخاب می‌کند. «شدید» بدون پرسیدن به‌شدت فشرده می‌کند. «سفارشی» نوار تنظیم کیفیت را به خودتان می‌دهد. «حجم هدف» جالب‌ترین حالت است: عددی را بر حسب کیلوبایت بنویسید تا ابزار کیفیتی پیدا کند که زیر آن عدد بنشیند، و اگر کیفیت به‌تنهایی کافی نبود، عرض تصویر را کم کند. حداکثر عرض را هم می‌توانید مستقیم تعیین کنید؛ برای عکسی که قرار است در صفحهٔ وب بنشیند، معمولاً بیشترین صرفه‌جویی از همین‌جا می‌آید. کدگذاری با کدگذار خود مرورگر انجام می‌شود، پس نه آپلودی در کار است، نه صفی، نه حساب کاربری و نه واترمارک.",
        whyClientSide:
          "رک بگوییم: بیشتر وقت‌ها عکس سفر را کوچک می‌کنید و برای کسی مهم نیست چه کسی آن را ببیند. اما رایج‌ترین کار واقعی این ابزار این است که اسکن کارت شناسایی، امضا یا عکس پاسپورت را زیر سقف کیلوبایتی یک درگاه دولتی ببرد، و این‌ها مدارکی نیستند که بخواهید برای گرفتن نسخهٔ کوچک‌تر به یک سرویس وب رایگان بسپارید. دلیل دیگر سرعت است. آپلود ۲۰ مگابایت برای اینکه سرور ۲۰۰ کیلوبایت پس بدهد، کندترین راه برای کاری است که لپ‌تاپ شما در حدود یک ثانیه انجام می‌دهد، و با اینترنت ضعیف اصلاً جواب نمی‌دهد؛ در حالی که فایل معمولاً دقیقاً وقتی برای ارسال زیادی بزرگ است که اینترنت خوب نیست.",
        limitations: [
          "این ابزار از کدگذار داخلی مرورگر استفاده می‌کند که در مقایسه با کدگذار تخصصی ابزاری ساده است. ابزارهای مبتنی بر MozJPEG یا oxipng معمولاً با همان کیفیت بصری فایل کوچک‌تری می‌دهند. برای فایل‌های نهایی پروژه که درصدهای آخر مهم است، از بهینه‌ساز مرحلهٔ build استفاده کنید.",
          "PNG تقریباً سود نمی‌برد و ممکن است بزرگ‌تر هم بشود. تصویر از روی پیکسل‌های خام دوباره کشیده می‌شود، بدون اطلاع از پالت رنگ و فیلترهای فایل اصلی، بنابراین PNG پالت‌دار به‌صورت RGBA کامل برمی‌گردد. به همین دلیل PNG در حالت حجم هدف هم عرضه نمی‌شود. برای کوچک کردن واقعی PNG، ابعاد را کم کنید یا آن را به WebP یا JPEG تبدیل کنید.",
          "هر حالتی تصویر را روی بوم (canvas) دوباره می‌کشد و همهٔ فراداده‌ها از بین می‌رود: EXIF، مختصات GPS، تنظیمات دوربین و پروفایل‌های رنگی ICC و XMP. معمولاً این یک مزیت حریم خصوصی است و گاهی مشکل؛ رنگ عکسی با گسترهٔ رنگی وسیع بعد از حذف پروفایل ممکن است جابه‌جا شود و تاریخ ثبت عکس را هم از دست می‌دهید.",
          "هر بار یک تصویر: بدون پردازش دسته‌ای و ZIP، با سقف ۲۵ مگابایت و بدون AVIF در ورودی و خروجی. کدگذاری در رشتهٔ اصلی انجام می‌شود، پس تصویر بزرگ صفحه را لحظه‌ای قفل می‌کند، و اگر فرمت خروجی‌ای را انتخاب کنید که مرورگرتان نمی‌تواند کدگذاری کند، ابزار بی‌صدا یک PNG با پسوند اشتباه می‌نویسد.",
        ],
        faq: [
          {
            q: "آیا می‌توان عکس را به حجم دقیق، مثلاً ۱۰۰ کیلوبایت رساند؟",
            a: "تقریباً. حالت حجم هدف عددی بین ۵ کیلوبایت و ۵ مگابایت را می‌پذیرد، کیفیتی مناسب پیدا می‌کند و اگر کیفیت به‌تنهایی کافی نبود عرض را کم می‌کند. به‌محض اینکه زیر عدد شما برسد متوقف می‌شود، پس نتیجه برابر هدف یا کمی کمتر از آن است. اگر رسیدن به هدف بدون خراب شدن تصویر ممکن نباشد، ابزار همین را اعلام می‌کند و کوچک‌ترین نسخه‌ای را که توانسته می‌دهد.",
          },
          {
            q: "آیا برای فشرده سازی عکس‌هایم آپلود می‌شوند؟",
            a: "نه. فایل داخل همان تب مرورگر خوانده و دوباره کدگذاری می‌شود. چیزی ارسال نمی‌شود، حساب کاربری و ثبت‌نام لازم نیست و ابزار حتی بدون اتصال به اینترنت هم کار می‌کند.",
          },
          {
            q: "چرا حجم PNG من کمتر نشد؟",
            a: "PNG بدون افت کیفیت است و دکمهٔ کیفیت ندارد؛ مرورگر فقط همان پیکسل‌ها را دوباره کدگذاری می‌کند و PNG پالت‌دار حتی ممکن است بزرگ‌تر شود، چون به‌صورت تمام‌رنگ برمی‌گردد. عرض را کم کنید یا فرمت خروجی را روی WebP یا JPEG بگذارید.",
          },
          {
            q: "آیا فشرده‌سازی اطلاعات مکان عکس را حذف می‌کند؟",
            a: "بله، به‌عنوان اثر جانبی. کشیدن دوبارهٔ تصویر روی canvas همهٔ EXIF از جمله مختصات GPS و مشخصات دوربین را حذف می‌کند. اگر هدف اصلی‌تان پاک کردن فراداده است، ابزار اختصاصی حذف EXIF مستقیم‌تر است.",
          },
          {
            q: "کدام فرمت خروجی را انتخاب کنم؟",
            a: "برای وب WebP؛ معمولاً با همان کیفیت به‌طور محسوسی از JPEG کوچک‌تر است و امروز هر جا که مهم است پشتیبانی می‌شود. JPEG وقتی فایلی می‌خواهید که هر سیستم قدیمی باز کند. اگر باید نوع فایل همان بماند، فرمت اصلی را نگه دارید.",
          },
        ],
        steps: [
          "فایل PNG، JPG یا WebP تا ۲۵ مگابایت را بیندازید.",
          "یکی از حالت‌های «خودکار»، «شدید»، «سفارشی» (کیفیت) یا حجم هدف به کیلوبایت را انتخاب کنید.",
          "در صورت نیاز فرمت خروجی و حداکثر عرض را تعیین کنید.",
          "نسخهٔ اصلی و فشرده را مقایسه کنید و نتیجه را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "이미지 압축이 필요할 때 브라우저에서 바로 쓸 수 있는 도구입니다. '이미지 압축'은 사진을 보내거나 올릴 수 있는 크기로 줄여 줍니다. 이메일 첨부 용량 제한에 걸렸을 때, 500KB를 넘는 파일은 받지 않는 양식에 올려야 할 때, 로딩이 느린 페이지에 넣을 때 유용합니다. 최대 25MB의 PNG, JPG, WebP 파일을 올린 뒤 화질과 용량 중 무엇을 더 양보할지 고르면 됩니다.\n\n압축 방식은 네 가지입니다. '자동'은 원본 크기에 맞춰 품질을 정하고, '강하게'는 따로 묻지 않고 크게 줄입니다. '사용자 지정'은 품질 슬라이더를 직접 조절하게 해 줍니다. 가장 쓸모 있는 것은 '목표 크기'입니다. KB 단위로 숫자를 입력하면 그 크기 아래로 들어가는 품질을 찾아 주고, 품질만으로 부족하면 가로 너비까지 줄입니다. 출력 최대 너비를 직접 정할 수도 있는데, 웹페이지에 올릴 사진이라면 보통 이 방법이 용량을 가장 많이 줄여 줍니다.\n\n인코딩은 브라우저에 내장된 이미지 인코더가 처리합니다. 그래서 업로드도, 대기열도, 회원가입도, 워터마크도 없습니다.",
        whyClientSide:
          "솔직히 말해 대부분은 여행 사진을 줄이는 일이라 누가 보든 상관없습니다. 하지만 이 도구의 가장 흔한 실제 용도는 신분증 스캔본, 서명, 여권 사진을 정부 사이트의 KB 제한에 맞추는 일이고, 이런 문서를 작게 만들겠다고 무료 웹 서비스에 넘기고 싶지는 않을 것입니다. 또 하나는 속도입니다. 20MB를 올려서 서버가 200KB를 돌려주게 하는 것은 노트북이 1초 안팎에 끝내는 일을 가장 느리게 하는 방법이고, 연결이 약하면 아예 실패합니다. 파일이 너무 커서 보낼 수 없을 때가 대개 그런 상황입니다.",
        limitations: [
          "브라우저 내장 인코더를 사용하므로 전용 인코더보다는 성능이 투박합니다. MozJPEG나 oxipng 기반 도구는 같은 화질에서 보통 더 작은 파일을 만듭니다. 마지막 몇 퍼센트가 중요한 실제 서비스용 이미지라면 빌드 단계의 최적화 도구를 쓰세요.",
          "PNG는 효과가 거의 없고 오히려 커질 수도 있습니다. 원본의 팔레트나 필터 설정을 모른 채 원시 픽셀에서 다시 그리기 때문에 인덱스 PNG도 전체 RGBA로 돌아옵니다. 목표 크기 모드에서 PNG를 지원하지 않는 이유도 이 때문입니다. PNG를 정말 줄이려면 크기를 줄이거나 WebP 또는 JPEG로 변환하세요.",
          "모든 모드가 이미지를 캔버스에 다시 그리기 때문에 EXIF, GPS 좌표, 카메라 설정, ICC 색상 프로필, XMP 같은 메타데이터가 모두 사라집니다. 대개는 개인정보 보호 면에서 이득이지만, 프로필이 사라지면 넓은 색 영역의 사진은 색이 달라질 수 있고 촬영 날짜도 잃게 됩니다.",
          "한 번에 한 장만 처리하며 일괄 처리와 ZIP은 없습니다. 최대 25MB이고 AVIF는 입력도 출력도 지원하지 않습니다. 인코딩은 메인 스레드에서 실행되어 큰 이미지는 잠시 페이지가 멈추며, 브라우저가 인코딩하지 못하는 출력 형식을 고르면 조용히 PNG를 만들어 다른 확장자로 저장합니다.",
        ],
        faq: [
          {
            q: "이미지를 100KB처럼 정확한 크기로 압축할 수 있나요?",
            a: "거의 맞출 수 있습니다. 목표 크기 모드는 5KB에서 5MB까지 입력할 수 있고, 조건에 맞는 품질을 찾으며 품질만으로 부족하면 너비를 줄입니다. 목표보다 작아지는 순간 멈추므로 결과는 목표 크기 또는 그보다 조금 작은 값이 됩니다. 쓸 수 없을 만큼 품질을 낮추지 않고는 목표에 닿지 못하면, 도구가 그렇게 알려 주고 만들 수 있었던 가장 작은 버전을 줍니다.",
          },
          {
            q: "압축하려고 이미지를 업로드하나요?",
            a: "아니요. 파일은 브라우저 탭 안에서 읽고 다시 인코딩합니다. 전송되는 데이터가 없고, 계정이나 가입도 필요 없으며, 인터넷 연결이 없어도 계속 작동합니다.",
          },
          {
            q: "PNG는 왜 작아지지 않나요?",
            a: "PNG는 무손실 형식이라 돌릴 수 있는 품질 조절이 없습니다. 브라우저가 같은 픽셀을 다시 인코딩할 뿐이고, 팔레트 기반 PNG는 전체 색상으로 돌아와서 오히려 커질 수도 있습니다. 너비를 줄이거나 출력 형식을 WebP 또는 JPEG로 바꿔 보세요.",
          },
          {
            q: "압축하면 사진의 위치 정보도 사라지나요?",
            a: "네, 부수 효과로 사라집니다. 캔버스에 다시 그리는 과정에서 GPS 좌표와 카메라 정보를 포함한 EXIF가 모두 빠집니다. 메타데이터 제거가 진짜 목적이라면 전용 EXIF 제거 도구가 더 직접적입니다.",
          },
          {
            q: "출력 형식은 무엇을 고르는 게 좋나요?",
            a: "웹에 쓸 거라면 WebP입니다. 같은 화질에서 보통 JPEG보다 눈에 띄게 작고, 요즘은 중요한 환경 대부분에서 지원됩니다. 오래된 시스템에서도 열려야 한다면 JPEG를 고르세요. 파일 형식이 그대로여야 하면 원본과 동일을 선택하면 됩니다.",
          },
        ],
        steps: [
          "PNG, JPG, WebP 파일(최대 25MB)을 올립니다.",
          "자동, 강하게, 사용자 지정 품질 또는 KB 단위 목표 크기 중에서 고릅니다.",
          "필요하면 출력 형식을 정하고 최대 너비를 제한합니다.",
          "원본과 압축본을 비교해 본 뒤 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "Nén ảnh online ngay trong trình duyệt: công cụ \"Nén hình ảnh\" thu nhỏ ảnh vừa đủ để nó lọt vào nơi cần gửi, chẳng hạn dưới giới hạn tệp đính kèm email, qua một biểu mẫu từ chối mọi tệp trên 500 KB, hoặc vào một trang đang tải quá chậm. Hãy thả vào ảnh PNG, JPG hoặc WebP dung lượng tối đa 25 MB rồi chọn cách đánh đổi giữa chất lượng và kích thước.\n\nCó bốn chế độ. \"Tự động\" chọn chất lượng dựa trên độ lớn của ảnh gốc. \"Nén mạnh\" nén thẳng tay mà không hỏi. \"Tuỳ chỉnh\" đưa thanh trượt chất lượng vào tay bạn. \"Kích thước mục tiêu\" là chế độ đáng dùng nhất: bạn nhập một con số tính bằng KB, công cụ sẽ dò một mức chất lượng cho ra tệp nhỏ hơn con số đó, và nếu chỉ giảm chất lượng chưa đủ thì sẽ bắt đầu giảm chiều rộng. Bạn cũng có thể giới hạn trực tiếp chiều rộng đầu ra, thường là cách tiết kiệm nhiều nhất với ảnh dùng cho trang web.\n\nViệc mã hoá dùng bộ mã hoá hình ảnh có sẵn của trình duyệt, nên không phải tải lên, không phải xếp hàng, không cần tài khoản và không có hình mờ.",
        whyClientSide:
          "Nói thật, phần lớn thời gian bạn chỉ đang thu nhỏ một tấm ảnh đi chơi và chẳng ai quan tâm ai xem nó. Nhưng việc thực tế thường gặp nhất của công cụ này là đưa ảnh quét căn cước, chữ ký hay ảnh thẻ xuống dưới giới hạn KB của một cổng dịch vụ công, và đó là những giấy tờ bạn không muốn trao cho một dịch vụ web miễn phí chỉ để đổi lấy bản thu nhỏ. Lý do thứ hai đơn giản là tốc độ. Tải lên 20 MB để máy chủ trả về 200 KB là cách chậm nhất để làm một việc mà chính máy tính của bạn xong trong khoảng một giây, và nó thất bại hẳn khi mạng yếu, đúng cái tình huống bạn thường gặp khi tệp quá lớn để gửi.",
        limitations: [
          "Công cụ dùng bộ mã hoá có sẵn của trình duyệt, vốn khá thô so với bộ mã hoá chuyên dụng. Công cụ xây trên MozJPEG hoặc oxipng thường cho tệp nhỏ hơn ở cùng chất lượng hình ảnh. Với tài nguyên sản phẩm mà vài phần trăm cuối cùng cũng quan trọng, hãy dùng công cụ tối ưu hoá ở bước build.",
          "PNG gần như không được lợi gì và còn có thể lớn hơn. Ảnh được vẽ lại từ điểm ảnh thô mà không biết gì về bảng màu hay bộ lọc của bản gốc, nên PNG dạng indexed sẽ trở lại thành RGBA đầy đủ. Đó cũng là lý do PNG không có trong chế độ kích thước mục tiêu. Muốn thu nhỏ PNG thật sự, hãy đổi kích thước hoặc chuyển sang WebP hay JPEG.",
          "Mọi chế độ đều vẽ lại ảnh lên canvas nên toàn bộ metadata bị bỏ: EXIF, toạ độ GPS, thông số máy ảnh, hồ sơ màu ICC và XMP. Thường đó là lợi thế về riêng tư, nhưng đôi khi lại là vấn đề: ảnh gam màu rộng có thể lệch màu khi mất hồ sơ màu, và bạn mất ngày chụp.",
          "Mỗi lần một ảnh: không xử lý hàng loạt, không ZIP, trần 25 MB, và không hỗ trợ AVIF cho cả đầu vào lẫn đầu ra. Việc mã hoá chạy trên luồng chính nên ảnh lớn làm trang đứng hình trong chốc lát, và nếu bạn chọn định dạng đầu ra mà trình duyệt không mã hoá được, công cụ lặng lẽ ghi ra PNG với phần mở rộng sai.",
        ],
        faq: [
          {
            q: "Tôi có thể nén ảnh về đúng dung lượng, ví dụ 100 KB không?",
            a: "Gần như vậy. Chế độ kích thước mục tiêu nhận từ 5 KB đến 5 MB, dò mức chất lượng phù hợp và giảm chiều rộng nếu chỉ chất lượng thì chưa đủ. Công cụ dừng ngay khi tệp nhỏ hơn con số của bạn, nên kết quả sẽ đúng bằng hoặc thấp hơn mục tiêu một chút. Nếu ảnh không thể xuống tới mức đó mà vẫn dùng được, công cụ sẽ báo và đưa bạn phiên bản nhỏ nhất làm được.",
          },
          {
            q: "Ảnh của tôi có bị tải lên để nén không?",
            a: "Không. Tệp được đọc và mã hoá lại ngay trong thẻ trình duyệt. Không có gì được truyền đi, không cần tài khoản hay đăng ký, và công cụ vẫn chạy được khi không có kết nối mạng.",
          },
          {
            q: "Sao ảnh PNG của tôi không nhỏ đi?",
            a: "PNG là định dạng không mất dữ liệu nên không có nút chỉnh chất lượng. Trình duyệt chỉ mã hoá lại cùng các điểm ảnh, và PNG dùng bảng màu thậm chí có thể phình ra vì quay lại thành ảnh đủ màu. Hãy giảm chiều rộng hoặc đổi định dạng đầu ra sang WebP hay JPEG.",
          },
          {
            q: "Nén ảnh có xoá vị trí chụp khỏi ảnh không?",
            a: "Có, như một hệ quả. Vẽ lại qua canvas sẽ bỏ toàn bộ EXIF, kể cả toạ độ GPS và thông tin máy ảnh. Nếu mục đích chính là xoá metadata thì công cụ xoá EXIF chuyên dụng trực tiếp hơn.",
          },
          {
            q: "Nên chọn định dạng đầu ra nào?",
            a: "WebP cho web, vì thường nhỏ hơn JPEG đáng kể ở cùng chất lượng và nay đã được hỗ trợ ở mọi nơi quan trọng. JPEG khi bạn cần một định dạng mở được trên cả hệ thống cũ. Giữ nguyên định dạng gốc khi tệp phải vẫn là cùng loại.",
          },
        ],
        steps: [
          "Thả vào ảnh PNG, JPG hoặc WebP dung lượng tối đa 25 MB.",
          "Chọn Tự động, Nén mạnh, chất lượng Tuỳ chỉnh hoặc kích thước mục tiêu tính bằng KB.",
          "Nếu muốn, đặt định dạng đầu ra và giới hạn chiều rộng tối đa.",
          "So sánh ảnh gốc với bản đã nén rồi tải xuống.",
        ],
      },
      tr: {
        intro:
          "Resim sıkıştırmak için artık bir programa gerek yok: \"Görsel Sıkıştırma\" doğrudan tarayıcıda çalışır ve fotoğrafı gitmesi gereken yere sığacak kadar küçültür. E-postanın ek sınırının altına inmek, 500 KB üzerini reddeden bir forma yüklemek ya da yavaş açılan bir sayfaya koymak için işe yarar. 25 MB'a kadar PNG, JPG veya WebP bırakın, kaliteden mi boyuttan mı ödün vereceğinizi seçin.\n\nDört yöntem var. Otomatik, kaynağın boyutuna göre bir kalite seçer. Agresif, sormadan sert sıkıştırır. Özel, kalite kaydırıcısını sizin eline verir. En ilginci Hedef boyut: kilobayt cinsinden bir sayı yazarsınız, araç o sayının altına düşen bir kalite arar; kalite tek başına yetmezse genişliği küçültmeye başlar. Çıktı genişliğini doğrudan da sınırlayabilirsiniz; web sayfasına gidecek bir fotoğrafta genellikle en büyük kazanç buradan gelir.\n\nKodlama tarayıcının kendi görsel kodlayıcısıyla yapılır; bu yüzden yükleme, sıra, hesap ya da filigran yoktur.",
        whyClientSide:
          "Dürüst olalım: çoğu zaman tatil fotoğrafı küçültüyorsunuz ve kimin göreceği kimsenin umurunda değil. Ama bu aracın en yaygın gerçek işi, taranmış bir kimliği, imzayı ya da vesikalık fotoğrafı bir devlet portalının kilobayt sınırının altına indirmek; üstelik bunlar, küçük bir kopya karşılığında ücretsiz bir web servisine vermek istemeyeceğiniz belgeler. Diğer neden düz hız. 20 MB yükleyip sunucudan 200 KB geri almak, kendi dizüstünüzün yaklaşık bir saniyede bitirdiği işi yapmanın en yavaş yolu; zayıf bağlantıda ise hiç çalışmaz, oysa bir dosya gönderilemeyecek kadar büyükse genellikle tam da o durumdasınızdır.",
        limitations: [
          "Tarayıcının yerleşik kodlayıcısını kullanır; bu, özel bir kodlayıcının yanında kaba bir araçtır. MozJPEG veya oxipng tabanlı bir araç, aynı görsel kalitede genellikle daha küçük dosya üretir. Son birkaç yüzdenin önemli olduğu üretim varlıkları için derleme aşamasında çalışan bir optimizasyon aracı kullanın.",
          "PNG neredeyse hiç fayda görmez, hatta büyüyebilir. Görsel, orijinalin paletini veya filtre seçimlerini bilmeden ham piksellerden yeniden çizilir; bu yüzden indeksli bir PNG tam RGBA olarak geri döner. Hedef boyut modunda PNG sunulmamasının nedeni de budur. PNG'yi gerçekten küçültmek için yeniden boyutlandırın ya da WebP veya JPEG'e dönüştürün.",
          "Her mod görseli bir tuvale yeniden çizer; bu da EXIF, GPS koordinatları, kamera ayarları, ICC renk profilleri ve XMP gibi tüm üst veriyi siler. Çoğu zaman bu bir gizlilik avantajıdır, bazen sorundur: geniş gamlı bir fotoğraf profili gidince renk kaydırabilir ve çekim tarihini kaybedersiniz.",
          "Aynı anda tek görsel: toplu işlem yok, ZIP yok, 25 MB üst sınır var ve AVIF ne girdi ne çıktı olarak desteklenir. Kodlama ana iş parçacığında çalışır; bu yüzden büyük bir görsel sayfayı kısa süre dondurur, tarayıcınızın kodlayamadığı bir çıktı biçimi seçerseniz de araç sessizce yanlış uzantıyla bir PNG yazar.",
        ],
        faq: [
          {
            q: "Görseli 100 KB gibi tam bir boyuta sıkıştırabilir miyim?",
            a: "Neredeyse. Hedef boyut modu 5 KB ile 5 MB arasındaki değerleri kabul eder ve sığan bir kalite arar; kalite tek başına yetmezse genişliği düşürür. Sayınızın altına inince durur, bu yüzden sonuç hedefte ya da hemen altında çıkar. Görsel kullanılamaz hale gelmeden hedefe ulaşamıyorsa araç bunu söyler ve başardığı en küçük sürümü verir.",
          },
          {
            q: "Sıkıştırmak için görsellerim yükleniyor mu?",
            a: "Hayır. Dosya tarayıcı sekmesinin içinde okunur ve yeniden kodlanır. Hiçbir şey iletilmez, hesap ya da kayıt gerekmez ve araç internet bağlantısı olmadan da çalışmaya devam eder.",
          },
          {
            q: "PNG'm neden küçülmedi?",
            a: "PNG kayıpsızdır, yani çevirecek bir kalite düğmesi yoktur; tarayıcı aynı pikselleri yeniden kodlar, paletli bir PNG ise tam renkli olarak döndüğü için büyüyebilir. Genişliği küçültün ya da çıktı biçimini WebP veya JPEG yapın.",
          },
          {
            q: "Sıkıştırmak fotoğraftaki konum bilgisini siler mi?",
            a: "Evet, yan etki olarak. Tuval üzerinden yeniden çizmek GPS koordinatları ve kamera ayrıntıları dahil tüm EXIF'i atar. Asıl amacınız üst veriyi silmekse özel EXIF temizleme aracı daha doğrudan bir yoldur.",
          },
          {
            q: "Hangi çıktı biçimini seçmeliyim?",
            a: "Web için WebP: aynı kalitede genellikle JPEG'den belirgin biçimde küçüktür ve artık önemli her yerde desteklenir. Her eski sistemin açabileceği bir dosya gerekiyorsa JPEG. Dosyanın tanınabilir şekilde aynı türde kalması gerekiyorsa orijinal biçimi koruyun.",
          },
        ],
        steps: [
          "25 MB'a kadar bir PNG, JPG veya WebP bırakın.",
          "Otomatik, Agresif, Özel kalite ya da KB cinsinden hedef boyutu seçin.",
          "İsterseniz çıktı biçimini belirleyin ve en büyük genişliği sınırlayın.",
          "Orijinali sıkıştırılmış sürümle karşılaştırın, sonra indirin.",
        ],
      },
    },
    en: {
      intro:
        "Image Compression shrinks a photo until it fits wherever it has to go — under an email attachment limit, past a form that rejects anything over 500 KB, or into a page that's loading too slowly. Drop in a PNG, JPG or WebP up to 25 MB and choose how you want to trade quality for size.\n\nThere are four ways to do it. Auto picks a quality based on how big the source is. Aggressive goes hard and doesn't ask. Custom hands you the quality slider. Target size is the interesting one: name a number in kilobytes and the tool searches for a quality that lands under it, then starts reducing the width if quality alone can't get there. You can also cap the output width directly, which is usually the single biggest saving for a photo headed to a web page.\n\nEncoding uses the browser's own image encoder, so there's no upload, no queue, no account and no watermark.",
      whyClientSide:
        "Be honest about the stakes: most of the time you're shrinking a holiday photo and nobody cares who sees it. But this tool's most common real job is getting a scanned ID, a signature or a passport photo under a government portal's kilobyte limit — and those are documents you'd rather not hand to a free web service in exchange for a smaller copy of them. The other reason is plain speed. Uploading 20 MB so a server can hand back 200 KB is the slowest possible way to do something your own laptop finishes in about a second, and it fails outright on a weak connection — which is exactly the situation you're usually in when a file is too big to send.",
      limitations: [
        "This uses the browser's built-in encoder, which is a blunt instrument next to a dedicated one. A tool built on MozJPEG or oxipng will typically reach a smaller file at the same visual quality. For production assets where the last few percent matter, use a build-time optimiser instead.",
        "PNG barely benefits, and can come out larger. The image is redrawn from raw pixels with no knowledge of the original's palette or filter choices, so an indexed PNG returns as full RGBA. That's also why PNG isn't offered in target-size mode. To genuinely shrink a PNG, resize it or convert it to WebP or JPEG.",
        "Every mode redraws the image onto a canvas, which discards all metadata: EXIF, GPS coordinates, camera settings, ICC colour profiles and XMP. Usually that's a privacy bonus, occasionally it's a problem — a wide-gamut photo can shift colour once its profile is gone, and you lose the capture date.",
        "One image at a time: no batch, no ZIP, a 25 MB ceiling, and no AVIF for either input or output. Encoding runs on the main thread, so a large image briefly freezes the page — and if you pick an output format your browser can't encode, it quietly writes a PNG under the wrong file extension.",
      ],
      faq: [
        {
          q: "Can I compress an image to an exact size, like 100 KB?",
          a: "Close to it. Target size mode accepts anything from 5 KB to 5 MB and searches for a quality that fits, dropping the width if quality alone isn't enough. It stops as soon as it's under your number, so results land at or just below the target. If the image can't reach it without becoming unusable, the tool says so and gives you the smallest version it managed.",
        },
        {
          q: "Are my images uploaded to compress them?",
          a: "No. The file is read and re-encoded inside the browser tab. Nothing is transmitted, there's no account and no signup, and the tool keeps working with no connection at all.",
        },
        {
          q: "Why didn't my PNG get any smaller?",
          a: "PNG is lossless, so there's no quality dial to turn — the browser simply re-encodes the same pixels, and a palette-based PNG can even grow because it comes back as full colour. Reduce the width, or switch the output format to WebP or JPEG.",
        },
        {
          q: "Does compressing remove the location data from my photo?",
          a: "Yes, as a side effect. Redrawing through a canvas drops all EXIF, including GPS coordinates and camera details. If stripping metadata is the actual goal, the dedicated EXIF remover is the more direct tool.",
        },
        {
          q: "Which output format should I pick?",
          a: "WebP for the web — it's usually meaningfully smaller than JPEG at the same quality and is supported everywhere that matters now. JPEG when you need something that any old system will open. Keep the original format when the file has to stay recognisably the same type.",
        },
      ],
      steps: [
        "Drop in a PNG, JPG or WebP up to 25 MB.",
        "Choose Auto, Aggressive, Custom quality, or a target size in KB.",
        "Optionally set the output format and cap the maximum width.",
        "Compare the original with the compressed version, then download it.",
      ],
    },
    ar: {
      intro:
        "تصغّر أداة «ضغط الصور» الصورة حتى تناسب المكان الذي يجب أن تذهب إليه — تحت حد مرفقات البريد، أو عبر نموذج يرفض ما يزيد على 500 كيلوبايت، أو داخل صفحة تحمّلها بطيء. أسقط صورة PNG أو JPG أو WebP حتى 25 ميغابايت، واختر كيف تقايض الجودة بالحجم.\n\nهناك أربع طرق. «تلقائي» يختار جودة بحسب حجم المصدر. و«قوي» يضغط بشدة دون سؤال. و«مخصص» يسلّمك مؤشر الجودة. أما «الحجم المستهدف» فهو الطريقة اللافتة: اكتب رقمًا بالكيلوبايت، فتبحث الأداة عن جودة تنزل تحته، ثم تبدأ بتقليل العرض إن لم تكفِ الجودة وحدها. ويمكنك أيضًا تحديد حد أقصى للعرض مباشرة، وهو عادةً أكبر توفير منفرد لصورة متجهة إلى صفحة ويب.\n\nيستخدم الترميز مرمّز الصور المدمج في المتصفح، فلا رفع ولا طابور ولا حساب ولا علامة مائية.",
      whyClientSide:
        "لنكن صريحين بشأن ما هو على المحك: في أغلب الأحيان تصغّر صورة إجازة ولا يعنى أحد بمن يراها. لكن أكثر مهمة حقيقية لهذه الأداة هي إنزال هوية ممسوحة أو توقيع أو صورة جواز سفر تحت حد الكيلوبايت في بوابة حكومية — وهذه مستندات تفضّل ألّا تسلّمها لخدمة ويب مجانية مقابل نسخة أصغر منها. والسبب الآخر هو السرعة ببساطة. فرفع 20 ميغابايت ليعيد لك خادم 200 كيلوبايت هو أبطأ طريقة ممكنة لأمر ينجزه حاسوبك في نحو ثانية، وهو يفشل تمامًا على اتصال ضعيف — وهذا بالضبط وضعك المعتاد حين يكون الملف أكبر من أن يُرسَل.",
      limitations: [
        "تستخدم الأداة مرمّز المتصفح المدمج، وهو أداة فظّة مقارنةً بمرمّز متخصص. فأداة مبنية على MozJPEG أو oxipng تصل عادةً إلى ملف أصغر بالجودة البصرية نفسها. ولأصول الإنتاج التي تهمّ فيها النسب الأخيرة، استخدم أداة تحسين ضمن مرحلة البناء.",
        "صيغة PNG بالكاد تستفيد، وقد تخرج أكبر. فالصورة تُرسَم من جديد من البكسلات الخام دون معرفة بلوحة ألوان الأصل أو خياراته، لذا تعود صورة PNG المفهرسة بألوان RGBA كاملة. ولهذا السبب أيضًا لا تُتاح PNG في وضع الحجم المستهدف. ولتصغير ملف PNG فعليًا، قلّل أبعاده أو حوّله إلى WebP أو JPEG.",
        "كل الأوضاع تعيد رسم الصورة على لوحة رسم، وهذا يتخلص من كل البيانات الوصفية: EXIF، وإحداثيات الموقع، وإعدادات الكاميرا، وملفات تعريف الألوان ICC وXMP. وهذا مكسب للخصوصية عادةً، ومشكلة أحيانًا — إذ قد تنزاح ألوان صورة واسعة النطاق اللوني بعد فقد ملف تعريفها، وتفقد تاريخ الالتقاط.",
        "صورة واحدة في كل مرة: لا معالجة دفعات، ولا ملف ZIP، وسقف 25 ميغابايت، ولا دعم لصيغة AVIF دخلًا أو خرجًا. ويجري الترميز على الخيط الرئيسي، فتتجمد الصفحة للحظات مع صورة كبيرة — وإن اخترت صيغة خرج لا يستطيع متصفحك ترميزها، كتبت الأداة ملف PNG بامتداد خاطئ بصمت.",
      ],
      faq: [
        {
          q: "هل يمكنني ضغط صورة إلى حجم محدد مثل 100 كيلوبايت؟",
          a: "قريبًا من ذلك. يقبل وضع الحجم المستهدف أي رقم بين 5 كيلوبايت و5 ميغابايت، ويبحث عن جودة تناسبه، ويقلّل العرض إن لم تكفِ الجودة وحدها. ويتوقف فور نزوله تحت رقمك، فتأتي النتيجة عند الهدف أو أقل منه بقليل. وإن تعذّر بلوغه دون أن تصبح الصورة غير صالحة، أخبرتك الأداة وأعطتك أصغر نسخة تمكّنت منها.",
        },
        {
          q: "هل تُرفع صوري لضغطها؟",
          a: "لا. يُقرأ الملف ويُعاد ترميزه داخل تبويب المتصفح. لا شيء يُرسَل، ولا حساب ولا تسجيل، وتبقى الأداة تعمل بلا اتصال بالإنترنت إطلاقًا.",
        },
        {
          q: "لماذا لم يصغر ملف PNG لدي؟",
          a: "صيغة PNG غير فاقدة، فلا يوجد مؤشر جودة يمكن خفضه — يعيد المتصفح ترميز البكسلات نفسها، وقد تكبر صورة PNG المعتمدة على لوحة ألوان لأنها تعود بألوان كاملة. قلّل العرض، أو بدّل صيغة الخرج إلى WebP أو JPEG.",
        },
        {
          q: "هل يزيل الضغط بيانات الموقع من صورتي؟",
          a: "نعم، كأثر جانبي. إعادة الرسم عبر لوحة الرسم تُسقط كل بيانات EXIF، بما فيها إحداثيات الموقع وتفاصيل الكاميرا. وإن كان إزالة البيانات الوصفية هو هدفك الفعلي، فأداة إزالة EXIF المخصصة أنسب.",
        },
        {
          q: "أي صيغة خرج أختار؟",
          a: "WebP للويب — فهي أصغر بفارق ملموس عن JPEG بالجودة نفسها ومدعومة اليوم في كل ما يهم. وJPEG حين تحتاج ملفًا يفتحه أي نظام قديم. وأبقِ الصيغة الأصلية حين يجب أن يبقى الملف من النوع نفسه.",
        },
      ],
      steps: [
        "أسقط صورة PNG أو JPG أو WebP حتى 25 ميغابايت.",
        "اختر «تلقائي» أو «قوي» أو جودة مخصصة أو حجمًا مستهدفًا بالكيلوبايت.",
        "اضبط صيغة الخرج وحدًا أقصى للعرض إن أردت.",
        "قارن الأصل بالنسخة المضغوطة ثم نزّلها.",
      ],
    },
  },

  "token-counter": {
    related: [
      "context-window",
      "ai-cost-calculator",
      "model-comparison",
      "text-counter",
    ],
    en: {
      intro:
        "Token Counter tells you how many tokens a piece of text will cost before you send it to a model. Paste a prompt, a document, a system message or a chat transcript, pick a model, and the count updates as you type alongside the character and word counts and a rough price for sending it as input.\n\nTokens are the unit language models actually bill and budget in, and they don't line up with words. Whitespace, punctuation, code, emoji and non-Latin scripts all shift the ratio, which is why a 1,000-word prompt can be anywhere from 1,100 to well over 2,000 tokens depending on what's in it. Guessing four characters per token is fine until you're near a context limit or a per-request budget, at which point you want the real number.\n\nCounting happens in the page. No API key, no account, no request to anyone.",
      whyClientSide:
        "There is nothing confidential about the act of counting tokens, and it would be silly to pretend otherwise. What running locally actually buys you is different: the count updates as you type because there's no round trip, you don't need an API key or a billing relationship with anyone to find out how big your prompt is, and it works with no connection at all. The one genuine privacy note is about the text rather than the number — what people paste in tends to be a production system prompt or a real customer transcript, and that's not material you want to post to a stranger's server just to get an integer back.",
      limitations: [
        "Only one real tokenizer runs here: OpenAI's o200k_base. That makes the GPT-4o and GPT-4o mini counts exact. The Claude, Llama 3.3 and Gemini figures are that same count multiplied by a fixed adjustment factor — an approximation, not those vendors' own tokenizers. Treat non-OpenAI numbers as a ballpark, and expect the gap to widen on code, emoji, and non-Latin scripts, which is exactly where tokenizers disagree most.",
        "The model list is short and current-generation. Older OpenAI models such as GPT-4 and GPT-3.5 use a different encoding (cl100k_base) that isn't selectable here, so counting them against this list will be off.",
        "The cost figure comes from a price table stored in the app, so it's only as current as the last time that table was updated — providers change prices, and this will not notice. It's also text-only: images, audio, cached-input discounts, batch pricing and fine-tuned rates are not modelled.",
        "It counts the text you paste and nothing else. A real API call also spends tokens on the system prompt, tool and function definitions, prior conversation turns, and the model's own response — so your actual bill will be higher, often much higher for a long chat.",
      ],
      faq: [
        {
          q: "How many tokens is my prompt?",
          a: "Paste it in and the number appears immediately, along with characters and words. For English prose a token is roughly three-quarters of a word, but that ratio falls apart on code, structured data, emoji and non-Latin scripts — which is the reason to count rather than estimate.",
        },
        {
          q: "Do I need an API key or an account?",
          a: "No. The tokenizer runs in your browser, so there's no key, no signup and no request to any provider. It also works offline once the page has loaded.",
        },
        {
          q: "Is the Claude or Gemini count exact?",
          a: "No. Only the OpenAI count is exact. Anthropic and Google don't publish browser-runnable tokenizers, so those figures are the OpenAI count adjusted by a fixed factor. Close enough for planning a prompt, not close enough to reconcile an invoice.",
        },
        {
          q: "Is the text I paste sent anywhere?",
          a: "No. Counting happens entirely in the page — nothing is uploaded, logged or stored, which matters more than it sounds when the thing you're measuring is a production system prompt.",
        },
        {
          q: "Why does my API bill show more tokens than this?",
          a: "Because a request carries more than the text you measured: the system prompt, tool definitions, the conversation history you're replaying, and the tokens the model generates in reply — output tokens usually cost several times more than input ones.",
        },
      ],
      steps: [
        "Choose the model you're targeting.",
        "Paste or type your text into the box.",
        "Read the token, character and word counts.",
        "Check the estimated input and output cost for that model.",
      ],
    },
    ar: {
      intro:
        "تخبرك أداة «عدّاد الرموز» بعدد الرموز (tokens) التي سيكلّفها نص ما قبل إرساله إلى نموذج. الصق موجّهًا أو مستندًا أو رسالة نظام أو محادثة، واختر نموذجًا، فيتحدّث العدّ أثناء الكتابة إلى جانب عدد الأحرف والكلمات وتقدير تقريبي لسعر إرساله كمدخل.\n\nالرموز هي الوحدة التي تحاسب بها نماذج اللغة فعليًا، وهي لا تطابق الكلمات. فالمسافات وعلامات الترقيم والشفرة البرمجية والرموز التعبيرية والكتابات غير اللاتينية تغيّر النسبة كلها، ولهذا قد يتراوح موجّه من 1,000 كلمة بين 1,100 رمز وأكثر من 2,000 بحسب محتواه. وتقدير أربعة أحرف لكل رمز يكفي حتى تقترب من حد نافذة السياق أو من ميزانية لكل طلب، وعندها تحتاج الرقم الحقيقي.\n\nيجري العدّ داخل الصفحة. لا مفتاح واجهة برمجة، ولا حساب، ولا طلب يُرسَل إلى أحد.",
      whyClientSide:
        "لا شيء سرّي في عدّ الرموز، ومن السخف ادّعاء غير ذلك. ما يمنحك إياه التشغيل المحلي هنا شيء آخر: يتحدّث العدّ أثناء الكتابة لأنه لا توجد رحلة ذهاب وإياب، ولا تحتاج مفتاح واجهة برمجة ولا علاقة فوترة مع أحد لتعرف حجم موجّهك، والأداة تعمل بلا اتصال إطلاقًا. أما الملاحظة الوحيدة الحقيقية بشأن الخصوصية فتخص النص لا الرقم — فما يلصقه الناس عادةً هو موجّه نظام في الإنتاج أو محادثة عميل حقيقية، وهذه ليست مادة تودّ إرسالها إلى خادم طرف غريب لتستعيد عددًا صحيحًا.",
      limitations: [
        "يعمل هنا مُرمِّز حقيقي واحد فقط: o200k_base من OpenAI. وهذا يجعل عدّ GPT-4o وGPT-4o mini دقيقًا تمامًا. أما أرقام Claude وLlama 3.3 وGemini فهي العدّ نفسه مضروبًا في معامل تعديل ثابت — أي تقدير تقريبي لا مُرمِّزات تلك الجهات. تعامل مع الأرقام غير الخاصة بـ OpenAI كتقدير عام، وتوقّع اتساع الفارق مع الشفرة البرمجية والرموز التعبيرية والكتابات غير اللاتينية، وهي بالضبط مواضع أكبر اختلاف بين المُرمِّزات.",
        "قائمة النماذج قصيرة وتغطي الجيل الحالي. أما نماذج OpenAI الأقدم مثل GPT-4 وGPT-3.5 فتستخدم ترميزًا مختلفًا (cl100k_base) غير متاح للاختيار هنا، لذا سيكون عدّها مقابل هذه القائمة غير دقيق.",
        "رقم التكلفة يأتي من جدول أسعار مخزّن داخل التطبيق، فهو محدَّث بقدر آخر تحديث لذلك الجدول — والمزوّدون يغيّرون أسعارهم، ولن تلاحظ الأداة ذلك. كما أنه يغطي النص فقط: فالصور والصوت وخصومات المدخلات المخزّنة وأسعار الدفعات والنماذج المخصَّصة غير محسوبة.",
        "تعدّ الأداة النص الذي تلصقه ولا شيء غيره. أما الطلب الحقيقي فينفق رموزًا أيضًا على موجّه النظام وتعريفات الأدوات والدوال وأدوار المحادثة السابقة ورد النموذج نفسه — لذا ستكون فاتورتك الفعلية أعلى، وأعلى بكثير غالبًا في محادثة طويلة.",
      ],
      faq: [
        {
          q: "كم عدد الرموز في موجّهي؟",
          a: "الصقه فيظهر الرقم فورًا مع عدد الأحرف والكلمات. وفي النثر الإنجليزي يعادل الرمز نحو ثلاثة أرباع الكلمة، لكن هذه النسبة تنهار مع الشفرة البرمجية والبيانات المهيكلة والرموز التعبيرية والكتابات غير اللاتينية — وهذا سبب العدّ بدل التقدير.",
        },
        {
          q: "هل أحتاج مفتاح واجهة برمجة أو حسابًا؟",
          a: "لا. يعمل المُرمِّز في متصفحك، فلا مفتاح ولا تسجيل ولا طلب يُرسَل إلى أي مزوّد. وتعمل الأداة بلا اتصال بعد تحميل الصفحة.",
        },
        {
          q: "هل عدّ Claude أو Gemini دقيق؟",
          a: "لا. العدّ الدقيق هو عدّ OpenAI وحده. فشركتا Anthropic وGoogle لا تنشران مُرمِّزات قابلة للتشغيل في المتصفح، لذا تكون تلك الأرقام عدّ OpenAI معدَّلًا بمعامل ثابت. وهذا يكفي لتخطيط موجّه، لا لمطابقة فاتورة.",
        },
        {
          q: "هل يُرسَل النص الذي ألصقه إلى أي مكان؟",
          a: "لا. يجري العدّ بالكامل داخل الصفحة — لا رفع ولا تسجيل ولا تخزين، وهذا أهم مما يبدو حين يكون ما تقيسه موجّه نظام في الإنتاج.",
        },
        {
          q: "لماذا تُظهر فاتورتي رموزًا أكثر من هذا الرقم؟",
          a: "لأن الطلب يحمل أكثر من النص الذي قِسته: موجّه النظام، وتعريفات الأدوات، وسجل المحادثة الذي تعيد إرساله، والرموز التي يولّدها النموذج في رده — ورموز الخرج تكلّف عادةً أضعاف رموز الدخل.",
        },
      ],
      steps: [
        "اختر النموذج الذي تستهدفه.",
        "الصق نصك أو اكتبه في الحقل.",
        "اقرأ عدد الرموز والأحرف والكلمات.",
        "راجع التكلفة التقديرية للدخل والخرج لذلك النموذج.",
      ],
    },
  },

  "audio-transcriber": {
    related: [
      "subtitle-studio",
      "speech-to-text",
      "video-to-audio",
      "text-summarizer",
    ],
    en: {
      intro:
        "Audio/Video Transcriber turns a recording into text on your own machine. Drop in an MP3, WAV, M4A, OGG, MP4 or WebM file and it produces a full transcript plus timestamped segments you can export as SRT or VTT subtitles, or as plain text.\n\nThe speech recognition is Whisper — specifically the base checkpoint — running through Transformers.js in the browser. The first time you use it, the model files download and are cached; after that they're reused. The audio itself is decoded to 16 kHz mono in the page and fed to the model in thirty-second chunks with a five-second overlap so words that fall on a chunk boundary aren't lost.\n\nNo API key, no per-minute charge, no upload of the recording.",
      whyClientSide:
        "This is the tool in the catalogue where on-device processing genuinely changes what you're allowed to do. The recordings people want transcribed are therapy sessions, medical dictation, HR investigations, legal depositions, journalists' interviews with sources who were promised confidentiality, and internal all-hands calls. Sending any of those to a hosted transcription API means a copy on someone else's infrastructure, governed by a retention policy and terms you probably haven't read — and in several professions, that alone is a compliance problem regardless of what the vendor promises. Here the audio never leaves the tab. The model travels to your recording instead of your recording travelling to the model.",
      limitations: [
        "It runs Whisper base, the small end of the family. A hosted API is almost certainly running something far larger, and the difference shows: expect more errors on strong accents, background noise, crosstalk, proper nouns and technical vocabulary. There are no speaker labels — overlapping speakers come out as one undifferentiated stream of text.",
        "The first run downloads the model from a CDN. Your audio isn't uploaded, but the tool isn't usable offline until those files are cached, and on a slow connection the wait before transcription even starts is real.",
        "Speed depends entirely on your hardware. On a browser with WebGPU it's reasonably quick; falling back to WebAssembly can be slower than real time, meaning an hour of audio can take more than an hour. There's no progress indicator during transcription itself and no way to cancel — only the model download shows progress.",
        "The whole file is decoded into memory before transcription starts, so long recordings can exhaust the tab on a modest machine. There's also no language selector and no translate mode — Whisper detects the language itself and you can't override it — and the segment timestamps are approximate, so subtitles usually need a nudge in a subtitle editor before use.",
      ],
      faq: [
        {
          q: "Can I transcribe audio to text for free without uploading it?",
          a: "Yes. The recording is decoded and transcribed inside the browser tab — no upload, no account, no API key and no per-minute charge. The only network activity is downloading the model the first time.",
        },
        {
          q: "How accurate is it compared with a paid transcription service?",
          a: "Good on clear speech recorded close to the microphone; noticeably worse than a paid service on strong accents, noisy rooms, several people talking at once, and specialist vocabulary. It's running a small model on your laptop rather than a large one on a datacentre GPU, and that gap is real. Plan on editing the output.",
        },
        {
          q: "Can it tell speakers apart?",
          a: "No. There's no speaker diarisation, so an interview or a meeting comes out as one continuous transcript with no indication of who said what.",
        },
        {
          q: "Can I get subtitles out of it?",
          a: "Yes. Transcription produces timestamped segments, which you can download as SRT or VTT, or copy as SRT. The timings are approximate, so check them in a subtitle editor before burning them into a video.",
        },
        {
          q: "How long can the recording be?",
          a: "There's no fixed limit, but the whole file is decoded into memory first and processing is not instant, so hour-long recordings are slow and can run a modest machine out of memory. Splitting a long recording into shorter pieces is more reliable.",
        },
      ],
      steps: [
        "Drop in an audio or video file.",
        "Press Transcribe — the first run downloads the Whisper model, with a progress bar.",
        "Wait for the transcript and its timestamped segments to appear.",
        "Copy the text, or download it as TXT, SRT or VTT.",
      ],
    },
    ar: {
      intro:
        "تحوّل أداة «تفريغ الصوت والفيديو» تسجيلًا إلى نص على جهازك أنت. أسقط ملف MP3 أو WAV أو M4A أو OGG أو MP4 أو WebM، فتنتج نصًا كاملًا ومقاطع موقّتة يمكنك تصديرها ترجماتٍ بصيغة SRT أو VTT، أو نصًا عاديًا.\n\nالتعرّف على الكلام يجري بنموذج Whisper — تحديدًا النسخة base — عبر Transformers.js داخل المتصفح. في أول استخدام تُنزَّل ملفات النموذج وتُحفظ مؤقتًا، ثم يُعاد استخدامها بعد ذلك. أما الصوت نفسه فيُفكّ ترميزه إلى قناة واحدة بتردد 16 كيلوهرتز داخل الصفحة، ويُمرَّر إلى النموذج في مقاطع من ثلاثين ثانية بتداخل خمس ثوانٍ حتى لا تضيع الكلمات الواقعة عند حدود المقاطع.\n\nلا مفتاح واجهة برمجة، ولا رسوم بالدقيقة، ولا رفع للتسجيل.",
      whyClientSide:
        "هذه هي الأداة التي تغيّر فيها المعالجة على الجهاز ما يُسمح لك بفعله فعلًا. فالتسجيلات التي يريد الناس تفريغها هي جلسات علاج نفسي، وإملاء طبي، وتحقيقات موارد بشرية، وإفادات قانونية، ومقابلات صحفيين مع مصادر وُعدت بالسرية، ومكالمات داخلية للشركة. وإرسال أي منها إلى خدمة تفريغ مستضافة يعني نسخة على بنية طرف آخر، تحكمها سياسة احتفاظ وشروط لم تقرأها على الأرجح — وفي عدة مهن يمثّل ذلك وحده مخالفة امتثال مهما وعد المزوّد. هنا لا يغادر الصوت التبويب أبدًا. النموذج هو الذي ينتقل إلى تسجيلك، لا تسجيلك الذي ينتقل إلى النموذج.",
      limitations: [
        "تشغّل الأداة نموذج Whisper base، وهو الطرف الصغير من العائلة. أما الخدمة المستضافة فتشغّل شبه المؤكد نموذجًا أكبر بكثير، والفارق ظاهر: توقّع أخطاء أكثر مع اللهجات الثقيلة والضجيج الخلفي وتداخل الأصوات وأسماء الأعلام والمصطلحات التقنية. ولا توجد تسميات للمتحدثين — فالمتحدثون المتداخلون يخرجون تيارًا نصيًا واحدًا غير مميَّز.",
        "التشغيل الأول ينزّل النموذج من شبكة توصيل محتوى. صوتك لا يُرفع، لكن الأداة غير صالحة للعمل دون اتصال حتى تُحفَظ تلك الملفات، وعلى وصلة بطيئة يكون الانتظار قبل بدء التفريغ ملموسًا.",
        "السرعة تعتمد كليًا على عتادك. فمع متصفح يدعم WebGPU تكون سريعة إلى حد معقول، أما الرجوع إلى WebAssembly فقد يكون أبطأ من الزمن الحقيقي، أي أن ساعة صوت قد تستغرق أكثر من ساعة. ولا يوجد مؤشر تقدّم أثناء التفريغ نفسه ولا طريقة لإلغائه — فالتقدّم يظهر لتنزيل النموذج فقط.",
        "يُفكّ ترميز الملف كاملًا في الذاكرة قبل بدء التفريغ، لذا قد تستنفد التسجيلات الطويلة ذاكرة التبويب على جهاز متواضع. ولا يوجد أيضًا اختيار للغة ولا وضع ترجمة — يكتشف Whisper اللغة بنفسه ولا يمكنك تجاوز ذلك — كما أن توقيتات المقاطع تقريبية، فتحتاج الترجمات عادةً إلى ضبط في محرّر ترجمات قبل الاستخدام.",
      ],
      faq: [
        {
          q: "هل يمكنني تفريغ صوت إلى نص مجانًا دون رفعه؟",
          a: "نعم. يُفكّ ترميز التسجيل ويُفرَّغ داخل تبويب المتصفح — بلا رفع ولا حساب ولا مفتاح واجهة برمجة ولا رسوم بالدقيقة. والنشاط الشبكي الوحيد هو تنزيل النموذج في المرة الأولى.",
        },
        {
          q: "ما مدى دقتها مقارنةً بخدمة تفريغ مدفوعة؟",
          a: "جيدة مع كلام واضح مسجَّل قرب الميكروفون، وأضعف بوضوح من خدمة مدفوعة مع اللهجات الثقيلة والغرف الصاخبة وتحدّث عدة أشخاص معًا والمصطلحات المتخصصة. فهي تشغّل نموذجًا صغيرًا على حاسوبك بدل نموذج كبير على معالج رسومي في مركز بيانات، وهذا فارق حقيقي. خطّط لتحرير الناتج.",
        },
        {
          q: "هل تميّز بين المتحدثين؟",
          a: "لا. لا يوجد فصل للمتحدثين، فتخرج المقابلة أو الاجتماع نصًا متصلًا واحدًا دون إشارة إلى قائل كل جملة.",
        },
        {
          q: "هل أحصل منها على ترجمات؟",
          a: "نعم. ينتج التفريغ مقاطع موقّتة يمكنك تنزيلها بصيغة SRT أو VTT أو نسخها بصيغة SRT. والتوقيتات تقريبية، فراجعها في محرّر ترجمات قبل دمجها في فيديو.",
        },
        {
          q: "ما أقصى طول للتسجيل؟",
          a: "لا يوجد حد ثابت، لكن الملف كاملًا يُفكّ ترميزه في الذاكرة أولًا والمعالجة ليست فورية، لذا تكون التسجيلات بطول ساعة بطيئة وقد تستنفد ذاكرة جهاز متواضع. تقسيم التسجيل الطويل إلى أجزاء أقصر أكثر موثوقية.",
        },
      ],
      steps: [
        "أسقط ملف صوت أو فيديو.",
        "اضغط «تفريغ» — التشغيل الأول ينزّل نموذج Whisper مع شريط تقدّم.",
        "انتظر ظهور النص والمقاطع الموقّتة.",
        "انسخ النص أو نزّله بصيغة TXT أو SRT أو VTT.",
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

  "airgap-transfer": {
    related: ["qr-generator", "qr-scanner", "text-encryption", "file-converter"],
    en: {
      intro:
        "Airgap QR Transfer lets you move files securely between two offline devices using animated QR code streams. By converting file data into compressed base64 packets and streaming them optically from screen to camera, files can be transferred without internet access, Wi-Fi, Bluetooth, or physical cables.",
      whyClientSide:
        "Traditional file transfer tools require cloud relays, local network socket connections, or Bluetooth pairing. Airgap QR Transfer is 100% optical and air-gapped — your data is compressed and rendered as QR frames right on your display, leaving zero network trace.",
      steps: [
        "Select Send mode and drop the file you wish to transfer.",
        "On the receiving device, select Receive mode and grant camera access (or scan the Pair QR).",
        "Point the receiving camera at the sender screen and click 'Start Streaming'.",
        "The receiving client reconstructs the file packets in real time and automatically saves the completed file.",
      ],
      limitations: [
        "Optimal transfer speeds range between 5 KB/s to 30 KB/s depending on screen brightness, camera refresh rate, and resolution.",
        "Best suited for documents, cryptographic keys, small archives, seeds, and certificates rather than large multi-gigabyte video files.",
      ],
      faq: [
        {
          q: "How does air-gapped QR file transfer work?",
          a: "The tool splits your file into compressed chunks and encodes them sequentially into animated QR codes. The receiving device's camera scans these QR frames in real time, buffers each packet, and reassembles the original file once all parts are received.",
        },
        {
          q: "Does this require any internet or Wi-Fi connection?",
          a: "No. Once the web app page is loaded, the transfer operates 100% locally and optically via screen and camera.",
        },
      ],
    },
    ar: {
      intro:
        "تتيح لك أداة نقل البيانات المعزولة (Airgap QR Transfer) نقل الملفات بأمان بين جهازين غير متصلين بالإنترنت عبر بث متحرك لرموز QR. يتم ضغط البيانات وتمريرها ضوئياً من الشاشة إلى الكاميرا دون شبكة أو بلوتوث أو كابلات.",
      whyClientSide:
        "تعمل الأداة بالكامل داخل المتصفح وبشكل معزول تماماً عن أي شبكة أو خادم، مما يجعلها مثالية للملفات الحساسة والمفاتيح المشفرة.",
      steps: [
        "اختر وضع الإرسال واسحب الملف المراد نقله.",
        "في الجهاز المستلم، افتح وضع الاستلام وشغّل الكاميرا.",
        "وجّه الكاميرا نحو الشاشة لبدء قراءة حزم البيانات ضوئياً.",
        "يتم تجميع الملف وفك ضغطه تلقائياً فور اكتمال جميع الحزم.",
      ],
      faq: [
        {
          q: "هل تتطلب الأداة اتصالاً بالإنترنت؟",
          a: "كلا، بمجرد تحميل الصفحة تعمل الأداة بشكل معزول كلياً عبر الكاميرا والشاشة دون أي اتصال شبكي.",
        },
      ],
    },
  },

  "qr-generator": {
    related: ["barcode-generator", "qr-scanner", "url-encoder", "base64"],
    en: {
      intro:
        "The QR Code Generator turns text, a URL, a phone number, an email address, an SMS or a Wi-Fi network into a scannable code. The preview redraws as you type, so you can see the pattern get denser as the payload grows and shorten the URL before it becomes a wall of pixels.\n\nTwo settings matter. Size sets the pixel dimensions of the preview and the raster download, from 128 to 512 px. Error correction (L, M, Q or H) adds redundant data so the code still reads when part of it is scratched, creased or smudged — higher levels survive more damage but make the pattern denser for the same payload. Download as PNG, JPEG, or SVG.\n\nThe code is generated in your browser from the text you typed. Nothing is submitted, nothing is registered, and there's no account.",
      whyClientSide:
        "The real hazard with free QR generators isn't usually privacy — it's the business model. Many of them hand you a dynamic code that points at their own short domain and redirects to your link, which means your poster, menu or business card depends on a third party staying online and staying free. People have had printed codes go dark, or start demanding a subscription, months after the print run. A code generated here has your data baked directly into the pattern: nobody is in the middle, nothing expires, and nothing can be revoked. The privacy point is real but smaller — a Wi-Fi password or a personal phone number typed into the box does stay in the tab.",
      limitations: [
        "Static codes only. The data is encoded directly into the pattern, so there's no scan tracking or analytics, and you can't repoint a printed code at a new URL later — you'd have to generate and reprint. If you need to change the destination after printing, you want a dynamic-QR service, and this isn't one.",
        "The code is always black on white with a fixed quiet-zone margin. There's no colour picker, no logo in the centre, no rounded modules or branded corner styles. If your brand guidelines demand a styled code, use a design tool.",
        "Rasters are capped at 512 px, which is too small for large-format print. Use the SVG download for posters and signage — it scales cleanly to any size. Avoid the JPEG option for anything you'll print: JPEG compression puts soft halos around the modules, which is exactly the kind of noise a scanner struggles with. PNG or SVG scan more reliably.",
        "One code at a time, and the text is encoded exactly as typed with no validation. A typo inside a Wi-Fi or vCard string produces a code that scans perfectly and then does nothing useful, so always test the finished code with a phone before printing it.",
      ],
      faq: [
        {
          q: "Is there a free QR code generator with no signup and no watermark?",
          a: "This one. There's no account, no sign-in, no watermark and no limit on how many codes you make — the code is generated in your browser from the text you type.",
        },
        {
          q: "What can I encode in a QR code?",
          a: "Any text. Common uses are a URL, plain text, an email address (mailto:), a phone number (tel:), an SMS, a contact card (vCard), or a Wi-Fi network string that joins the network when scanned.",
        },
        {
          q: "What is error correction and which level should I use?",
          a: "It adds redundant data so the code still reads when part of it is damaged or dirty. L recovers about 7%, M about 15%, Q about 25%, H about 30%. M is a sensible default; go higher for a code that will be printed on something that gets handled, folded or rained on.",
        },
        {
          q: "Should I download PNG, JPEG, or SVG?",
          a: "PNG for screens and normal printing. SVG for anything large — it's vector, so it stays sharp at poster size. Skip JPEG for QR codes: its compression artefacts blur the edges of the modules and can make scanning less reliable.",
        },
        {
          q: "Will this QR code expire or stop working?",
          a: "The code itself never expires — the data is inside the pattern, not on a server. It stops being useful only if what it points to stops existing, for example a URL whose page is taken down.",
        },
      ],
      steps: [
        "Type the text or URL to encode, or start from one of the URL / email / phone / Wi-Fi samples.",
        "Set the size and the error-correction level; the preview updates as you go.",
        "Choose PNG, JPEG or SVG and name the file.",
        "Download it, then scan the result with a phone to confirm it works.",
      ],
    },
    ar: {
      intro:
        "يحوّل مولّد رمز QR نصًا أو رابطًا أو رقم هاتف أو بريدًا إلكترونيًا أو رسالة نصية أو شبكة Wi-Fi إلى رمز قابل للمسح. تُعاد المعاينة مع كل حرف تكتبه، فترى النمط يزداد كثافة كلما كبرت الحمولة، وتختصر الرابط قبل أن يتحول إلى جدار من النقاط.\n\nهناك إعدادان مهمان. الحجم يحدّد أبعاد المعاينة والملف النقطي بالبكسل، من 128 إلى 512 بكسل. وتصحيح الأخطاء (L أو M أو Q أو H) يضيف بيانات زائدة ليبقى الرمز مقروءًا حين يُخدَش جزء منه أو يُثنى أو يتلطّخ — والمستويات الأعلى تتحمّل ضررًا أكبر لكنها تجعل النمط أكثف للحمولة نفسها. نزّل النتيجة بصيغة PNG أو JPEG أو SVG.\n\nيُولَّد الرمز في متصفحك من النص الذي كتبته. لا شيء يُرسَل، ولا شيء يُسجَّل، ولا حساب مطلوب.",
      whyClientSide:
        "الخطر الحقيقي في مولّدات QR المجانية ليس الخصوصية عادةً، بل نموذج العمل. كثير منها يمنحك رمزًا ديناميكيًا يشير إلى نطاقه المختصر ثم يحوّلك إلى رابطك، ما يعني أن ملصقك أو قائمة طعامك أو بطاقتك تعتمد على بقاء طرف ثالث متصلًا ومجانيًا. وقد توقّفت رموز مطبوعة عن العمل فعلًا، أو بدأت تطلب اشتراكًا، بعد أشهر من الطباعة. أما الرمز المولَّد هنا فبياناتك مخبوزة داخل النمط مباشرةً: لا وسيط، ولا صلاحية تنتهي، ولا شيء يمكن إلغاؤه. أما نقطة الخصوصية فحقيقية لكنها أصغر — كلمة مرور Wi-Fi أو رقم هاتف شخصي تكتبه في الحقل يبقى داخل التبويب.",
      limitations: [
        "رموز ثابتة فقط. البيانات مرمّزة مباشرة داخل النمط، فلا تتبّع للمسح ولا إحصاءات، ولا يمكنك توجيه رمز مطبوع إلى رابط جديد لاحقًا — ستضطر إلى توليده وطباعته من جديد. وإن كنت تحتاج تغيير الوجهة بعد الطباعة، فأنت تحتاج خدمة رموز ديناميكية، وهذه ليست منها.",
        "الرمز أسود على أبيض دائمًا، بهامش ثابت حول النمط. لا منتقي ألوان، ولا شعار في المنتصف، ولا وحدات دائرية أو زوايا بأنماط تجارية. وإن كانت هوية علامتك تفرض رمزًا منسّقًا، فاستخدم أداة تصميم.",
        "الصور النقطية محدودة بـ 512 بكسل، وهذا أصغر من أن يكفي للطباعة كبيرة الحجم. استخدم تنزيل SVG للملصقات واللوحات — فهو متجهي ويتكبّر بنظافة إلى أي حجم. وتجنّب خيار JPEG لأي شيء ستطبعه: فضغط JPEG يترك هالات ناعمة حول الوحدات، وهو بالضبط نوع التشويش الذي يربك الماسح. صيغتا PNG وSVG أكثر موثوقية في المسح.",
        "رمز واحد في كل مرة، ويُرمَّز النص كما كتبته تمامًا دون أي تحقق. فخطأ إملائي داخل نص Wi-Fi أو vCard ينتج رمزًا يُمسَح بنجاح ثم لا يفعل شيئًا مفيدًا، لذا جرّب الرمز النهائي بهاتف قبل طباعته دائمًا.",
      ],
      faq: [
        {
          q: "هل يوجد مولّد رموز QR مجاني بلا تسجيل وبلا علامة مائية؟",
          a: "هذا هو. لا حساب ولا تسجيل دخول ولا علامة مائية ولا حد لعدد الرموز التي تنشئها — يُولَّد الرمز في متصفحك من النص الذي تكتبه.",
        },
        {
          q: "ماذا يمكنني أن أرمّز في رمز QR؟",
          a: "أي نص. والاستخدامات الشائعة هي رابط، أو نص عادي، أو بريد إلكتروني (mailto:)، أو رقم هاتف (tel:)، أو رسالة نصية، أو بطاقة تعريف (vCard)، أو نص شبكة Wi-Fi يوصل الجهاز بالشبكة عند مسحه.",
        },
        {
          q: "ما تصحيح الأخطاء وأي مستوى أستخدم؟",
          a: "يضيف بيانات زائدة ليبقى الرمز مقروءًا حين يتضرر جزء منه أو يتّسخ. المستوى L يستعيد نحو 7%، وM نحو 15%، وQ نحو 25%، وH نحو 30%. المستوى M افتراضي معقول، وارفعه لرمز سيُطبع على شيء يُتداوَل أو يُطوى أو يتعرض للمطر.",
        },
        {
          q: "هل أنزّل PNG أم JPEG أم SVG؟",
          a: "PNG للشاشات والطباعة العادية، وSVG لأي حجم كبير لأنه متجهي يبقى حادًا بحجم الملصق. وتجنّب JPEG لرموز QR: فتشوّهات ضغطه تُموّه حواف الوحدات وقد تجعل المسح أقل موثوقية.",
        },
        {
          q: "هل تنتهي صلاحية رمز QR أو يتوقف عن العمل؟",
          a: "الرمز نفسه لا تنتهي صلاحيته أبدًا — فالبيانات داخل النمط لا على خادم. ويتوقف عن النفع فقط إذا زال ما يشير إليه، كرابط أُزيلت صفحته.",
        },
      ],
      steps: [
        "اكتب النص أو الرابط المراد ترميزه، أو ابدأ من أحد الأمثلة الجاهزة: رابط أو بريد أو هاتف أو Wi-Fi.",
        "اضبط الحجم ومستوى تصحيح الأخطاء؛ تتحدّث المعاينة أثناء ذلك.",
        "اختر PNG أو JPEG أو SVG وسمِّ الملف.",
        "نزّله، ثم امسحه بهاتف للتأكد من عمله.",
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
        "The PDF workbench is a full toolkit for working with PDF files directly in your browser: merge multiple documents into one, split or reorder pages, compress file size, rotate pages, stamp a watermark, sign a document, extract selectable text, or turn a batch of JPGs and PNGs into a single PDF.\n\nAll processing happens locally on your device, so confidential contracts, invoices, and signed forms never leave your computer. There are no file size limits imposed by a server.",
      faq: [
        {
          q: "Are my PDFs uploaded to a server?",
          a: "No. Every operation — merge, split, compress, rotate, reorder, watermark, sign, and text extraction — runs locally in your browser, so your documents stay private on your device.",
        },
        {
          q: "Can I merge multiple PDFs into one?",
          a: "Yes. Add several PDF files, arrange their order, and combine them into a single document.",
        },
        {
          q: "How do I reduce a PDF's file size, and does it lose quality?",
          a: "The compress option rasterizes each page to a JPEG at one of three quality presets and re-embeds it. That shrinks file size significantly, but it's a re-encode — pages become images, so very fine text or line art can look softer at the smallest preset. Selectable text on those pages is no longer selectable after compressing.",
        },
        {
          q: "Can I split a PDF, reorder pages, or extract pages?",
          a: "Yes. Split a PDF into separate files, drag pages into a new order (or delete some) and save, or extract a specific range of pages.",
        },
        {
          q: "Can I sign a PDF or add a watermark?",
          a: "Yes. Draw or upload a signature and place it on any page, or stamp text like DRAFT or CONFIDENTIAL across every page — both stay editable until you download.",
        },
        {
          q: "Can I turn images into a PDF?",
          a: "Yes. Upload JPG or PNG images and combine them into a single PDF, with control over page size and margins.",
        },
      ],
      steps: [
        "Upload one or more PDF files (or images, for the images-to-PDF option).",
        "Choose an action: merge, split, compress, rotate, reorder, watermark, sign, or extract text.",
        "Arrange pages or set options as needed.",
        "Download the resulting PDF (or text file, for extraction).",
      ],
    },
    ar: {
      intro:
        "أدوات PDF مجموعة أدوات كاملة للتعامل مع ملفات PDF مباشرة في متصفحك: ادمج عدة مستندات في ملف واحد، أو قسّم الصفحات أو أعد ترتيبها، أو قلّص حجم الملف، أو دوّر الصفحات، أو أضف علامة مائية، أو وقّع المستند، أو استخرج النص القابل للتحديد، أو حوّل مجموعة من صور JPG وPNG إلى ملف PDF واحد.\n\nتتم كل المعالجة محليًا على جهازك، فلا تغادر العقود والفواتير والنماذج الموقّعة السرية حاسوبك. ولا توجد حدود لحجم الملف يفرضها خادم.",
      faq: [
        {
          q: "هل تُرفع ملفات PDF إلى خادم؟",
          a: "لا. كل عملية — الدمج والتقسيم والضغط والتدوير وإعادة الترتيب والعلامة المائية والتوقيع واستخراج النص — تعمل محليًا في متصفحك، فتبقى مستنداتك خاصة على جهازك.",
        },
        {
          q: "هل يمكنني دمج عدة ملفات PDF في ملف واحد؟",
          a: "نعم. أضف عدة ملفات PDF، ورتّبها، ثم ادمجها في مستند واحد.",
        },
        {
          q: "كيف أقلّل حجم ملف PDF، وهل تتأثر الجودة؟",
          a: "يحوّل خيار الضغط كل صفحة إلى صورة JPEG بأحد ثلاثة مستويات جودة ثم يعيد تضمينها. هذا يقلّص الحجم بشكل كبير، لكنه إعادة ترميز — تتحول الصفحات إلى صور، فقد يبدو النص الدقيق جدًا أو الرسوم الخطية أقل وضوحًا عند أدنى مستوى جودة. كما يفقد النص القابل للتحديد في تلك الصفحات قابليته للتحديد بعد الضغط.",
        },
        {
          q: "هل يمكنني تقسيم ملف PDF أو إعادة ترتيب صفحاته أو استخراج صفحات منه؟",
          a: "نعم. قسّم الملف إلى ملفات منفصلة، أو اسحب الصفحات لإعادة ترتيبها (أو احذف بعضها) واحفظ، أو استخرج نطاق صفحات محددًا.",
        },
        {
          q: "هل يمكنني توقيع ملف PDF أو إضافة علامة مائية؟",
          a: "نعم. ارسم توقيعك أو ارفعه وضعه على أي صفحة، أو اطبع نصًا مثل \"مسودة\" أو \"سري\" عبر كل صفحة — ويبقى كلاهما قابلًا للتعديل حتى التنزيل.",
        },
        {
          q: "هل يمكنني تحويل الصور إلى ملف PDF؟",
          a: "نعم. ارفع صور JPG أو PNG وادمجها في ملف PDF واحد، مع التحكم في حجم الصفحة والهوامش.",
        },
      ],
      steps: [
        "ارفع ملف PDF واحدًا أو أكثر (أو صورًا، لخيار تحويل الصور إلى PDF).",
        "اختر إجراءً: دمج أو تقسيم أو ضغط أو تدوير أو إعادة ترتيب أو علامة مائية أو توقيع أو استخراج نص.",
        "رتّب الصفحات أو اضبط الخيارات حسب الحاجة.",
        "نزّل ملف PDF الناتج (أو ملف النص، لخيار الاستخراج).",
      ],
    },
  },

  "merge-pdf": {
    related: ["split-pdf", "reorder-pdf-pages", "compress-pdf", "pdf"],
    en: {
      intro:
        "Merge PDF combines several PDF files into a single document, in the order you put them. It's the fix for the everyday mess of a report that arrived as three separate exports, a contract whose signature page came back as its own file, or a stack of scanned receipts you need to submit as one attachment.\n\nAdd at least two files, use the move-up and move-down buttons beside each one to set the sequence, and the tool stitches them end to end. Pages are copied across untouched — text stays selectable, images keep their original resolution, and nothing is re-encoded or re-compressed on the way through.\n\nBecause the whole job is assembled in your browser there's no upload step, no account, no daily file cap and no watermark on the result. The practical ceiling is your own device's memory rather than someone's server policy.",
      whyClientSide:
        "The documents people merge are rarely throwaway: signed contracts, bank statements, medical results, passport scans, a finished tax return. A hosted merge service has to hold a complete copy of every one of those files on its disks to do the work, however briefly, and you have to take its retention policy on faith. Doing it locally removes that step altogether — the tab reads the bytes, joins them, and hands you back a download. There is no copy on anyone else's machine to be retained, indexed, subpoenaed or leaked.",
      limitations: [
        "Merging joins whole files. You can't pick individual pages while merging — split or extract the pages you want first, then merge the pieces.",
        "Only the pages are copied. A source PDF's bookmarks and outline (its clickable table of contents), its document-level form definition, and any embedded file attachments are not rebuilt in the merged document, so interactive forms may stop working. TODO(verify): confirm exact annotation behaviour against pdf-lib's copyPages on a form-heavy sample.",
        "Password-protected PDFs can't be opened at all, and the tool reports them with a generic \"Invalid PDF file\" message rather than saying a password is the problem. Remove the protection in your PDF reader first.",
        "The merge runs on the page's main thread with every file held in memory at once, and there's no progress bar for it. A very large batch — hundreds of megabytes of scans — can make the tab unresponsive or run out of memory on a phone or a low-RAM laptop.",
      ],
      faq: [
        {
          q: "Can I merge PDFs without uploading them anywhere?",
          a: "Yes. The merge runs entirely inside the browser tab — there's no upload, no account and no signup, and confidential reports and contracts stay on your device.",
        },
        {
          q: "How do I change the order of the files?",
          a: "Add every PDF first, then use the move-up and move-down buttons next to each file in the list. The pages appear in exactly the top-to-bottom order you leave them in.",
        },
        {
          q: "Does merging reduce the quality of the pages?",
          a: "No. Each page is copied as-is into the new file, so text stays selectable and images keep their original resolution. Nothing is re-compressed. If the combined file ends up too big, compress it as a separate step.",
        },
        {
          q: "Can I merge a password-protected PDF?",
          a: "No. An encrypted PDF fails to open and is rejected as an invalid file. Open it in a PDF reader, save an unprotected copy, and merge that.",
        },
        {
          q: "Is there a limit on how many PDFs I can combine?",
          a: "You need at least two, and after that there's no server-imposed file count or file-size cap. The real limit is how much your device can hold in memory at once.",
        },
      ],
      steps: [
        "Add at least two PDF files.",
        "Use the move-up and move-down buttons to set the order.",
        "Merge them into a single document.",
        "Download the combined PDF.",
      ],
    },
    ar: {
      intro:
        "يدمج «دمج PDF» عدة ملفات PDF في مستند واحد بالترتيب الذي تضعه أنت. إنه الحل للفوضى اليومية: تقرير وصلك في ثلاث تصديرات منفصلة، أو عقد عادت صفحة توقيعه كملف مستقل، أو مجموعة إيصالات ممسوحة تحتاج تقديمها كمرفق واحد.\n\nأضف ملفين على الأقل، واستخدم زرَّي «للأعلى» و«للأسفل» بجانب كل ملف لضبط التسلسل، فتخيّط الأداة الملفات طرفًا لطرف. تُنسخ الصفحات كما هي دون مساس — يبقى النص قابلًا للتحديد، وتحتفظ الصور بدقتها الأصلية، ولا يُعاد ترميز أو ضغط أي شيء في الطريق.\n\nولأن العمل كله يجري داخل متصفحك، لا توجد خطوة رفع ولا حساب ولا حد يومي للملفات ولا علامة مائية على النتيجة. السقف العملي هو ذاكرة جهازك، لا سياسة خادم ما.",
      whyClientSide:
        "المستندات التي يدمجها الناس نادرًا ما تكون عابرة: عقود موقّعة، وكشوف حسابات بنكية، ونتائج طبية، وصور جواز سفر، وإقرار ضريبي مكتمل. أي خدمة دمج على خادم تحتاج نسخة كاملة من كل ملف من هذه على أقراصها لتنجز العمل، ولو للحظات، وعليك أن تثق بسياسة الاحتفاظ لديها. الدمج محليًا يلغي هذه الخطوة تمامًا — يقرأ المتصفح البايتات، ويضمّها، ويعيدها إليك كملف تنزيل. لا توجد نسخة على جهاز أحد آخر يمكن الاحتفاظ بها أو فهرستها أو تسريبها.",
      limitations: [
        "الدمج يضم الملفات كاملة. لا يمكنك انتقاء صفحات مفردة أثناء الدمج — قسّم الصفحات التي تريدها أو استخرجها أولًا، ثم ادمج القطع.",
        "تُنسخ الصفحات فقط. أما الإشارات المرجعية والفهرس القابل للنقر في ملف المصدر، وتعريف النماذج على مستوى المستند، والملفات المرفقة المضمّنة، فلا يُعاد بناؤها في الملف المدموج، وقد تتوقف النماذج التفاعلية عن العمل. TODO(verify): تأكيد سلوك التعليقات التوضيحية بدقة مع copyPages في pdf-lib على ملف غني بالنماذج.",
        "ملفات PDF المحمية بكلمة مرور لا تُفتح أصلًا، وتعرض الأداة رسالة عامة «ملف PDF غير صالح» بدل الإشارة إلى أن السبب كلمة المرور. أزل الحماية من قارئ PDF لديك أولًا.",
        "يجري الدمج على الخيط الرئيسي للصفحة مع الاحتفاظ بكل الملفات في الذاكرة دفعة واحدة، ولا يوجد شريط تقدّم له. الدفعة الكبيرة جدًا — مئات الميغابايتات من المستندات الممسوحة — قد تجعل التبويب لا يستجيب أو تستنفد الذاكرة على هاتف أو حاسوب بذاكرة محدودة.",
      ],
      faq: [
        {
          q: "هل يمكنني دمج ملفات PDF دون رفعها إلى أي مكان؟",
          a: "نعم. يجري الدمج بالكامل داخل تبويب المتصفح — لا رفع ولا حساب ولا تسجيل، وتبقى التقارير والعقود السرية على جهازك.",
        },
        {
          q: "كيف أغيّر ترتيب الملفات؟",
          a: "أضف كل ملفات PDF أولًا، ثم استخدم زرَّي «للأعلى» و«للأسفل» بجانب كل ملف في القائمة. تظهر الصفحات بترتيب القائمة من الأعلى إلى الأسفل تمامًا.",
        },
        {
          q: "هل يقلّل الدمج جودة الصفحات؟",
          a: "لا. تُنسخ كل صفحة كما هي إلى الملف الجديد، فيبقى النص قابلًا للتحديد وتحتفظ الصور بدقتها الأصلية، ولا يُعاد ضغط أي شيء. وإن جاء الملف المدموج كبيرًا، اضغطه في خطوة منفصلة.",
        },
        {
          q: "هل يمكنني دمج ملف PDF محمي بكلمة مرور؟",
          a: "لا. الملف المشفّر يفشل في الفتح وتُرفضه الأداة كملف غير صالح. افتحه في قارئ PDF، واحفظ نسخة بلا حماية، ثم ادمج تلك النسخة.",
        },
        {
          q: "هل هناك حد لعدد ملفات PDF التي أدمجها؟",
          a: "تحتاج ملفين على الأقل، وبعد ذلك لا يوجد حد لعدد الملفات أو لحجمها يفرضه خادم. الحد الحقيقي هو ما يستطيع جهازك حمله في الذاكرة دفعة واحدة.",
        },
      ],
      steps: [
        "أضف ملفَّي PDF على الأقل.",
        "استخدم زرَّي «للأعلى» و«للأسفل» لضبط الترتيب.",
        "ادمجها في مستند واحد.",
        "نزّل ملف PDF المدموج.",
      ],
    },
  },

  "split-pdf": {
    related: ["merge-pdf", "reorder-pdf-pages", "compress-pdf", "pdf"],
    en: {
      intro:
        "Split PDF breaks one document into smaller files — a single page, a range, or each page on its own. It's what you reach for when a 90-page handbook only needs its onboarding chapter shared, when a court bundle has to be broken into individual exhibits, or when one signed page has to go to someone who shouldn't see the rest.\n\nYou open the PDF, mark the pages or ranges you want, and the tool writes out separate PDFs — the extracted pages keep their original text, images, and quality untouched. All of it runs in your browser, so a confidential bundle is never uploaded to a server to be cut apart.\n\nSplitting locally also means no page or size cap from an upload form: a large scanned file can be divided into manageable pieces you can send one at a time.",
      faq: [
        {
          q: "Can I extract just one page or a specific range?",
          a: "Yes. Choose a single page, a continuous range, or split every page into its own file.",
        },
        {
          q: "Do the split pages lose quality?",
          a: "No. Each page is copied out exactly as it was, so text stays selectable and images keep their resolution.",
        },
        {
          q: "Can I share one chapter without exposing the rest?",
          a: "Yes — that's a common use. Extract only the pages you want to share; the pages you leave out are not part of the new file.",
        },
        {
          q: "Are my files uploaded to split them?",
          a: "No. Splitting runs entirely in your browser, so sensitive bundles and exhibits stay on your device.",
        },
        {
          q: "What's the difference between split and extract?",
          a: "Split writes out one or more separate PDF files; if you instead need the words as text, use the extract-text tool.",
        },
      ],
      steps: [
        "Open the PDF you want to split.",
        "Mark the page, range, or every-page option.",
        "Split it into separate files.",
        "Download the resulting PDFs.",
      ],
    },
    ar: {
      intro:
        "يقسّم «تقسيم PDF» مستندًا واحدًا إلى ملفات أصغر — صفحة مفردة أو نطاقًا أو كل صفحة على حدة. إنه ما تلجأ إليه حين يحتاج دليل من 90 صفحة إلى مشاركة فصل التعريف منه فقط، أو حين يجب تفكيك حزمة مستندات قضائية إلى مرفقات منفصلة، أو حين يجب إرسال صفحة موقّعة واحدة إلى شخص لا ينبغي أن يرى الباقي.\n\nتفتح ملف PDF، وتحدّد الصفحات أو النطاقات التي تريدها، فتُخرِج الأداة ملفات PDF منفصلة — تبقى الصفحات المستخرجة بنصها وصورها وجودتها كما هي. ويجري كل ذلك في متصفحك، فلا تُرفع حزمة سرية إلى خادم لتقطيعها.\n\nالتقسيم محليًا يعني أيضًا غياب أي حد للصفحات أو الحجم من نموذج رفع: يمكن تقسيم ملف ممسوح كبير إلى أجزاء يسهل إرسالها واحدًا تلو الآخر.",
      faq: [
        {
          q: "هل يمكنني استخراج صفحة واحدة أو نطاق محدد؟",
          a: "نعم. اختر صفحة مفردة أو نطاقًا متصلًا أو قسّم كل صفحة إلى ملف مستقل.",
        },
        {
          q: "هل تفقد الصفحات المقسّمة جودتها؟",
          a: "لا. تُنسخ كل صفحة كما كانت تمامًا، فيبقى النص قابلًا للتحديد وتحتفظ الصور بدقتها.",
        },
        {
          q: "هل يمكنني مشاركة فصل واحد دون كشف الباقي؟",
          a: "نعم، وهو استخدام شائع. استخرج الصفحات التي تريد مشاركتها فقط؛ أما الصفحات التي تتركها فليست جزءًا من الملف الجديد.",
        },
        {
          q: "هل تُرفع ملفاتي لتقسيمها؟",
          a: "لا. يجري التقسيم بالكامل في متصفحك، فتبقى الحزم والمرفقات الحساسة على جهازك.",
        },
        {
          q: "ما الفرق بين التقسيم والاستخراج؟",
          a: "التقسيم يُخرِج ملف PDF منفصلًا أو أكثر؛ أما إن احتجت الكلمات نصًا، فاستخدم أداة استخراج النص.",
        },
      ],
      steps: [
        "افتح ملف PDF الذي تريد تقسيمه.",
        "حدّد الصفحة أو النطاق أو خيار كل صفحة.",
        "قسّمه إلى ملفات منفصلة.",
        "نزّل ملفات PDF الناتجة.",
      ],
    },
  },

  "compress-pdf": {
    related: ["split-pdf", "merge-pdf", "reorder-pdf-pages", "pdf"],
    extra: {
      ru: {
        intro:
          "Чтобы сжать PDF онлайн, достаточно этого инструмента: он уменьшает размер документа, чтобы тот проходил там, где его постоянно возвращают, — под лимит вложения в письме, под ограничение формы загрузки на портале вакансий или госуслуг, под размер, который примет мессенджер. Вместо повторного экспорта из исходной программы вы уменьшаете уже готовый PDF.\n\nСпособ сжатия один, и его стоит понимать до использования: каждая страница отрисовывается как изображение, кодируется в JPEG и помещается обратно на страницу исходных размеров. Три пресета — «Высокое качество», «Сбалансированный» и «Маленький файл» — выбирают компромисс между разрешением отрисовки и качеством JPEG, с одной стороны, и размером, с другой. Для скана, который и так является картинкой, это почти ничего не стоит. Для чёткого текстового PDF вы платите текстовым слоем.\n\nВесь процесс идёт в вашем браузере, поэтому конфиденциальный счёт или договор не отправляется на сервер сжатия. Инструмент показывает размер до и после: попробуйте пресет, посмотрите на цифры и выберите более сильный, если файл всё ещё не проходит.",
        whyClientSide:
          "PDF редко сжимают для себя — его сжимают, потому что у чужой формы загрузки есть лимит. А значит, речь обычно идёт о скане паспорта, расчётном листе, медицинском заключении, подписанном договоре аренды или налоговой декларации, и альтернатива — пропустить такой документ через очередь обработки у незнакомца только ради того, чтобы срезать несколько мегабайт. Локальная работа к тому же избавляет от двух передач: не нужно загружать 40 МБ сканов по медленному каналу, чтобы потом скачать файл поменьше.",
        limitations: [
          "Растеризация — единственный режим. После сжатия текст нельзя выделить, скопировать или найти поиском, программы экранного доступа больше не читают документ, а ссылки, поля форм и аннотации на странице пропадают. Варианта сохранить текстовый слой нет, как нет и OCR, чтобы вернуть его.",
          "На лёгком текстовом или векторном PDF результат может получиться больше исходного: страница с набранным текстом превращается в полноразмерную фотографию. Инструмент всё равно считает это успехом и просто показывает отрицательный процент уменьшения, так что смотрите на цифры до и после, а не предполагайте, что сжатие удалось.",
          "Только три фиксированных пресета. Нет целевого размера файла, нет настраиваемого качества или DPI, нет пересжатия одних лишь изображений: серверные инструменты в стиле Ghostscript уменьшают встроенные фото, оставляя текстовый слой нетронутым, а здесь так сделать нельзя.",
          "Один файл за раз, в основном потоке страницы, без индикатора прогресса и без кнопки отмены; на длинном документе вкладка зависает на время работы. Прозрачность также выравнивается, потому что каждая страница кодируется в JPEG, а PDF, защищённые паролем, отклоняются сразу.",
        ],
        faq: [
          {
            q: "Можно ли бесплатно сжать PDF без загрузки на сервер?",
            a: "Да. Сжатие выполняется локально во вкладке браузера — без загрузки, аккаунта, регистрации и водяного знака, поэтому конфиденциальные документы не покидают ваше устройство.",
          },
          {
            q: "Как именно работает сжатие?",
            a: "Каждая страница отрисовывается как изображение и сохраняется обратно в PDF в виде JPEG с пониженными разрешением и качеством. Именно это уменьшает размер, и другого метода здесь нет.",
          },
          {
            q: "Можно ли будет выделять текст после сжатия?",
            a: "Нет. Поскольку страницы превращаются в изображения, текстовый слой теряется: слова остаются видны, но их нельзя выделить, скопировать или найти поиском. Если это нужно, сохраните оригинал.",
          },
          {
            q: "Почему мой PDF стал больше, а не меньше?",
            a: "Потому что он уже был компактным. Текстовый PDF хранит буквы как инструкции, а это гораздо экономнее, чем фотография этих букв. Превращение каждой страницы в изображение легко обходится дороже, чем экономит. Сверьтесь с цифрами до и после; если файл вырос, оставьте оригинал.",
          },
          {
            q: "Какой пресет выбрать?",
            a: "«Сбалансированный» выбран по умолчанию и обычно является правильной отправной точкой. Переходите на «Маленький файл», если всё ещё превышаете лимит загрузки, или на «Высокое качество», если сжатые страницы выглядят слишком мягкими для чтения.",
          },
        ],
        steps: [
          "Откройте PDF, который нужно уменьшить.",
          "Выберите «Высокое качество», «Сбалансированный» или «Маленький файл».",
          "Запустите сжатие и дождитесь перекодирования страниц.",
          "Проверьте размеры до и после и читаемость, затем скачайте файл.",
        ],
      },
      fa: {
        intro:
          "برای کاهش حجم PDF، این ابزار اندازهٔ سند را کم می‌کند تا از سقف‌هایی که بارها آن را برمی‌گردانند عبور کند: سقف پیوست ایمیل، محدودیت آپلود در درگاه کاریابی یا سامانه‌های دولتی، و اندازه‌ای که یک پیام‌رسان می‌پذیرد. به‌جای اینکه دوباره از برنامهٔ اصلی خروجی بگیرید، همان PDF نهایی را مستقیم کوچک می‌کنید.\n\nروش فشرده‌سازی یکی است و بهتر است پیش از استفاده بدانید چیست: هر صفحه به تصویر تبدیل می‌شود، با فرمت JPEG دوباره کدگذاری می‌شود و روی صفحه‌ای با ابعاد اصلی قرار می‌گیرد. سه پیش‌تنظیم — کیفیت بالا، متعادل و فایل کوچک — مصالحه میان وضوح رندر و کیفیت JPEG از یک سو و حجم از سوی دیگر را تعیین می‌کنند. برای سند اسکن‌شده که از اول تصویر است، این تقریباً هزینه‌ای ندارد. برای PDF متنی واضح، هزینه‌اش لایهٔ متن است.\n\nکل فرایند در مرورگر شما انجام می‌شود، پس فاکتور یا قرارداد محرمانه به سرور فشرده‌سازی فرستاده نمی‌شود. ابزار حجم قبل و بعد را نشان می‌دهد؛ یک پیش‌تنظیم را امتحان کنید، به اعداد نگاه کنید و اگر هنوز جا نشد، قوی‌ترش را انتخاب کنید.",
        whyClientSide:
          "کم پیش می‌آید PDF را به نفع خودتان فشرده کنید — فشرده‌اش می‌کنید چون فرم آپلود یک جای دیگر سقف دارد. یعنی فایل مورد نظر معمولاً اسکن پاسپورت، فیش حقوقی، گزارش پزشکی، اجاره‌نامهٔ امضاشده یا اظهارنامهٔ مالیاتی است و جایگزینش این است که فقط برای کم کردن چند مگابایت، سندی را از صف پردازش یک غریبه رد کنید. کار محلی دو انتقال را هم حذف می‌کند: لازم نیست ۴۰ مگابایت اسکن را با اینترنت کند آپلود کنید تا بعد فایل کوچک‌تر را دانلود کنید.",
        limitations: [
          "تبدیل صفحه‌ها به تصویر تنها حالت موجود است. بعد از فشرده‌سازی متن را نمی‌توان انتخاب، کپی یا جست‌وجو کرد، صفحه‌خوان‌ها دیگر سند را نمی‌خوانند و لینک‌ها، فیلدهای فرم و حاشیه‌نویسی‌های صفحه از بین می‌روند. گزینه‌ای برای نگه داشتن لایهٔ متن نیست و OCR هم برای بازگرداندن آن وجود ندارد.",
          "روی PDF متنی یا برداری سبک ممکن است خروجی از ورودی بزرگ‌تر شود — صفحه‌ای از حروف تبدیل به یک عکس تمام‌صفحه می‌شود. ابزار باز هم آن را موفق می‌داند و فقط درصد کاهش منفی نشان می‌دهد؛ پس به اعداد قبل و بعد نگاه کنید و فرض نکنید فشرده‌سازی جواب داده است.",
          "فقط سه پیش‌تنظیم ثابت. نه حجم هدف هست، نه کنترل دلخواه کیفیت یا DPI، نه فشرده‌سازی صرفاً تصاویر: ابزارهای سروری به سبک Ghostscript عکس‌های داخل فایل را کوچک می‌کنند و لایهٔ متن را دست‌نخورده می‌گذارند، کاری که این ابزار نمی‌تواند بکند.",
          "هر بار یک فایل، روی رشتهٔ اصلی صفحه، بدون نوار پیشرفت و بدون دکمهٔ لغو؛ با سند طولانی تب تا پایان کار قفل می‌شود. شفافیت هم یکدست می‌شود چون هر صفحه با JPEG دوباره کدگذاری می‌شود، و PDFهای دارای رمز عبور کاملاً رد می‌شوند.",
        ],
        faq: [
          {
            q: "آیا می‌توان PDF را رایگان و بدون آپلود فشرده کرد؟",
            a: "بله. فشرده‌سازی به‌صورت محلی در تب مرورگر انجام می‌شود — بدون آپلود، حساب کاربری، ثبت‌نام و واترمارک — پس اسناد حساس از دستگاه شما بیرون نمی‌روند.",
          },
          {
            q: "فشرده‌سازی دقیقاً چگونه کار می‌کند؟",
            a: "هر صفحه به تصویر تبدیل می‌شود و با وضوح و کیفیت کمتر به‌صورت JPEG داخل PDF ذخیره می‌شود. حجم از همین راه کم می‌شود و روش دیگری در دسترس نیست.",
          },
          {
            q: "آیا بعد از فشرده‌سازی متن قابل انتخاب می‌ماند؟",
            a: "نه. چون صفحه‌ها به تصویر تبدیل می‌شوند، لایهٔ متن از دست می‌رود؛ کلمات دیده می‌شوند ولی قابل انتخاب، کپی یا جست‌وجو نیستند. اگر به این نیاز دارید، فایل اصلی را نگه دارید.",
          },
          {
            q: "چرا حجم PDF من کمتر نشد و بیشتر شد؟",
            a: "چون از قبل فشرده و کم‌حجم بود. PDF متنی حروف را مثل دستورالعمل ذخیره می‌کند که بسیار جمع‌وجورتر از عکس همان حروف است. تبدیل هر صفحه به تصویر به‌راحتی بیشتر از آنچه صرفه‌جویی می‌کند هزینه دارد. اعداد قبل و بعد را ببینید؛ اگر فایل بزرگ‌تر شد، اصل را نگه دارید.",
          },
          {
            q: "کدام پیش‌تنظیم را انتخاب کنم؟",
            a: "«متعادل» پیش‌فرض است و معمولاً نقطهٔ شروع درستی است. اگر هنوز از سقف آپلود بالاترید به «فایل کوچک» بروید، و اگر صفحه‌های فشرده برای خواندن بیش از حد محو شدند، «کیفیت بالا» را بزنید.",
          },
        ],
        steps: [
          "PDF مورد نظر برای کاهش حجم را باز کنید.",
          "«کیفیت بالا»، «متعادل» یا «فایل کوچک» را انتخاب کنید.",
          "فشرده‌سازی را اجرا کنید و منتظر کدگذاری دوبارهٔ صفحه‌ها بمانید.",
          "حجم قبل و بعد و خوانا بودن را بررسی کنید و بعد فایل را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "PDF 용량 줄이기가 필요할 때 쓰는 도구입니다. 계속 반려되는 제한, 즉 이메일 첨부 상한, 채용이나 관공서 사이트의 업로드 제한, 메신저가 받아 주는 크기를 통과하도록 문서 용량을 줄입니다. 원본 프로그램에서 다시 내보내는 대신 이미 완성된 PDF를 바로 줄이는 방식입니다.\n\n압축 방법은 한 가지이고, 쓰기 전에 알아 둘 필요가 있습니다. 모든 페이지를 이미지로 렌더링해 JPEG로 인코딩한 뒤 원래 크기의 페이지에 다시 넣는 방식입니다. '높은 품질', '균형', '작은 파일' 세 가지 프리셋이 렌더링 해상도·JPEG 품질과 용량 사이의 균형을 정합니다. 이미 그림인 스캔 문서라면 잃는 것이 거의 없습니다. 하지만 선명한 텍스트 PDF라면 텍스트 레이어를 잃습니다.\n\n모든 과정이 브라우저에서 이루어지므로 기밀 청구서나 계약서가 압축 서버에 업로드되지 않습니다. 압축 전후 크기가 표시되니 프리셋을 써 보고 숫자를 확인한 뒤, 그래도 안 맞으면 더 강한 프리셋을 고르면 됩니다.",
        whyClientSide:
          "PDF는 자신을 위해 줄이는 경우가 드뭅니다. 다른 곳의 업로드 양식에 제한이 있어서 줄이는 것이죠. 그래서 대개 여권 스캔, 급여명세서, 진단서, 서명한 임대 계약서, 세금 신고서 같은 파일이고, 겨우 몇 MB를 줄이자고 모르는 곳의 처리 대기열에 그런 문서를 넣는 것이 대안입니다. 로컬에서 처리하면 전송도 두 번 줄어듭니다. 느린 연결로 스캔본 40MB를 올렸다가 작은 파일을 다시 받을 필요가 없습니다.",
        limitations: [
          "페이지를 이미지로 바꾸는 방식이 유일한 모드입니다. 압축하면 텍스트를 선택, 복사, 검색할 수 없고 화면 낭독기도 문서를 읽지 못하며, 페이지의 링크·입력란·주석도 사라집니다. 텍스트 레이어를 유지하는 옵션도, 되살리는 OCR도 없습니다.",
          "가벼운 텍스트나 벡터 PDF는 결과가 원본보다 커질 수 있습니다. 글자가 가득한 페이지가 전체 페이지 사진이 되기 때문입니다. 이때도 도구는 성공으로 처리하고 감소율을 음수로 보여 줄 뿐이므로, 잘 됐다고 단정하지 말고 전후 수치를 확인하세요.",
          "프리셋은 세 가지로 고정입니다. 목표 파일 크기, 사용자 지정 품질이나 DPI 조절, 이미지만 다시 압축하는 기능이 없습니다. 텍스트 레이어는 두고 내장 사진만 줄이는 Ghostscript 방식의 서버 도구가 하는 일은 이 도구가 할 수 없습니다.",
          "한 번에 파일 하나, 페이지의 메인 스레드에서 실행되며 진행 표시줄도 취소 버튼도 없습니다. 긴 문서는 처리하는 동안 탭이 멈춥니다. 모든 페이지를 JPEG로 다시 인코딩하므로 투명도가 평탄화되고, 암호로 보호된 PDF는 거부됩니다.",
        ],
        faq: [
          {
            q: "PDF를 업로드하지 않고 무료로 압축할 수 있나요?",
            a: "네. 압축은 브라우저 탭 안에서 로컬로 실행됩니다. 업로드, 계정, 가입, 워터마크가 없으므로 민감한 문서가 기기 밖으로 나가지 않습니다.",
          },
          {
            q: "압축은 구체적으로 어떻게 이루어지나요?",
            a: "각 페이지를 이미지로 렌더링하고, 해상도와 품질을 낮춘 JPEG로 PDF에 다시 저장합니다. 용량이 줄어드는 원리는 이것이며, 여기서 쓸 수 있는 방법은 이것뿐입니다.",
          },
          {
            q: "압축한 뒤에도 텍스트를 선택할 수 있나요?",
            a: "아니요. 페이지가 이미지로 변환되므로 텍스트 레이어가 사라집니다. 글자는 보이지만 선택, 복사, 검색은 할 수 없습니다. 그런 기능이 필요하면 원본을 보관하세요.",
          },
          {
            q: "PDF가 줄지 않고 오히려 커졌어요.",
            a: "이미 효율적인 파일이었기 때문입니다. 텍스트만 있는 PDF는 글자를 명령으로 저장해서, 그 글자를 찍은 사진보다 훨씬 작습니다. 모든 페이지를 이미지로 바꾸면 얻는 것보다 잃는 것이 클 수 있습니다. 전후 수치를 확인하고, 커졌다면 원본을 쓰세요.",
          },
          {
            q: "어떤 프리셋을 골라야 하나요?",
            a: "'균형'이 기본값이고 대개 가장 무난한 시작점입니다. 그래도 업로드 제한을 넘으면 '작은 파일'로, 압축된 페이지가 흐려서 읽기 어려우면 '높은 품질'로 바꾸세요.",
          },
        ],
        steps: [
          "줄이려는 PDF를 엽니다.",
          "높은 품질, 균형, 작은 파일 중에서 고릅니다.",
          "압축을 실행하고 페이지가 다시 인코딩될 때까지 기다립니다.",
          "압축 전후 크기와 내용이 읽을 만한지 확인한 뒤 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "Nén PDF giúp giảm dung lượng tài liệu để vượt qua những giới hạn cứ làm nó bị trả về: trần tệp đính kèm email, hạn mức tải lên ở cổng nộp hồ sơ xin việc hoặc dịch vụ công, dung lượng mà ứng dụng nhắn tin chấp nhận. Thay vì xuất lại từ ứng dụng gốc, bạn thu nhỏ trực tiếp tệp PDF đã hoàn chỉnh.\n\nChỉ có một phương pháp nén và bạn nên hiểu nó trước khi dùng: mỗi trang được kết xuất thành ảnh, mã hoá lại thành JPEG và đặt trở lại trang có kích thước gốc. Ba mức cài sẵn là Chất lượng cao, Cân bằng hoặc Tệp nhỏ sẽ chọn sự đánh đổi giữa độ phân giải kết xuất và chất lượng JPEG với dung lượng. Với tài liệu quét vốn đã là một bức ảnh thì gần như không mất gì. Còn với PDF văn bản sắc nét, bạn mất lớp văn bản.\n\nToàn bộ quá trình chạy trong trình duyệt của bạn, nên hoá đơn hay hợp đồng bí mật không bao giờ bị tải lên máy chủ nén. Công cụ hiển thị dung lượng trước và sau, nên bạn có thể thử một mức cài sẵn, xem con số, rồi chọn mức mạnh hơn nếu vẫn chưa vừa.",
        whyClientSide:
          "Hiếm khi bạn nén PDF vì lợi ích của chính mình, mà vì biểu mẫu tải lên của người khác có giới hạn. Nghĩa là tệp đó thường là bản quét hộ chiếu, phiếu lương, báo cáo y tế, hợp đồng thuê nhà đã ký hay tờ khai thuế, và lựa chọn thay thế là đưa tài liệu ấy qua hàng đợi xử lý của một người lạ chỉ để bớt đi vài megabyte. Làm cục bộ còn bỏ được hai lượt truyền: bạn không phải đẩy 40 MB bản quét lên đường truyền chậm chỉ để rồi kéo một tệp nhỏ hơn về.",
        limitations: [
          "Chuyển trang thành ảnh là chế độ duy nhất. Sau khi nén, văn bản không thể chọn, sao chép hay tìm kiếm, trình đọc màn hình không còn đọc được tài liệu, và liên kết, trường biểu mẫu, chú thích trên trang đều mất. Không có tuỳ chọn giữ lớp văn bản và cũng không có OCR để phục hồi.",
          "Với PDF văn bản hay vector nhẹ, kết quả có thể lớn hơn đầu vào, vì một trang chữ biến thành ảnh chụp cả trang. Công cụ vẫn báo đó là thành công và chỉ hiện phần trăm giảm âm, nên hãy xem số liệu trước và sau thay vì cho rằng nó đã hiệu quả.",
          "Chỉ có ba mức cài sẵn cố định, không gì khác. Không có kích thước tệp mục tiêu, không tuỳ chỉnh chất lượng hay DPI, cũng không nén riêng phần ảnh. Những công cụ máy chủ kiểu Ghostscript thu nhỏ ảnh nhúng mà giữ nguyên lớp văn bản làm được việc mà công cụ này không thể.",
          "Mỗi lần một tệp, chạy trên luồng chính của trang, không có thanh tiến trình và không có nút huỷ. Tài liệu dài sẽ làm treo thẻ trong lúc xử lý. Độ trong suốt cũng bị làm phẳng vì mọi trang được mã hoá lại thành JPEG, và PDF có mật khẩu bị từ chối hoàn toàn.",
        ],
        faq: [
          {
            q: "Tôi có thể nén PDF miễn phí mà không cần tải lên không?",
            a: "Có. Việc nén chạy cục bộ trong thẻ trình duyệt, không tải lên, không tài khoản, không đăng ký, không hình mờ, nên tài liệu nhạy cảm không rời khỏi thiết bị của bạn.",
          },
          {
            q: "Việc nén thực sự hoạt động thế nào?",
            a: "Mỗi trang được kết xuất thành ảnh và lưu lại vào PDF dưới dạng JPEG với độ phân giải và chất lượng thấp hơn. Đó là cách dung lượng giảm, và đây là phương pháp duy nhất có ở đây.",
          },
          {
            q: "Sau khi nén tôi còn chọn được văn bản không?",
            a: "Không. Vì các trang bị chuyển thành ảnh nên lớp văn bản mất đi: chữ vẫn hiển thị nhưng không thể chọn, sao chép hay tìm kiếm. Hãy giữ lại bản gốc nếu bạn cần những việc đó.",
          },
          {
            q: "Sao PDF của tôi lại nặng hơn thay vì nhẹ đi?",
            a: "Vì nó vốn đã gọn. PDF chỉ có văn bản lưu chữ cái dưới dạng lệnh, nhỏ gọn hơn rất nhiều so với một tấm ảnh chụp những chữ đó. Biến mỗi trang thành ảnh có thể tốn nhiều hơn lợi. Hãy xem số liệu trước và sau; nếu kết quả lớn hơn, hãy giữ bản gốc.",
          },
          {
            q: "Tôi nên chọn mức cài sẵn nào?",
            a: "Cân bằng là mặc định và thường là điểm xuất phát đúng. Chuyển sang Tệp nhỏ nếu bạn vẫn vượt giới hạn tải lên, hoặc Chất lượng cao nếu các trang đã nén trông quá mờ để đọc.",
          },
        ],
        steps: [
          "Mở tệp PDF bạn cần thu nhỏ.",
          "Chọn Chất lượng cao, Cân bằng hoặc Tệp nhỏ.",
          "Nén và chờ các trang được mã hoá lại.",
          "Kiểm tra dung lượng trước và sau cũng như độ dễ đọc, rồi tải xuống.",
        ],
      },
      tr: {
        intro:
          "PDF küçültmek, belgenizi sürekli geri çeviren sınırların altına indirmek içindir: e-postanın ek üst sınırı, iş başvurusu veya devlet portalındaki yükleme limiti, bir mesajlaşma uygulamasının kabul ettiği boyut. Kaynak uygulamadan yeniden dışa aktarmak yerine bitmiş PDF'yi doğrudan küçültürsünüz.\n\nTek bir sıkıştırma yöntemi var ve kullanmadan önce bilmekte fayda var: her sayfa bir görsele dönüştürülür, JPEG olarak yeniden kodlanır ve orijinal boyutlardaki bir sayfaya geri yerleştirilir. Üç hazır ayar (Yüksek kalite, Dengeli veya Küçük dosya), işleme çözünürlüğü ve JPEG kalitesi ile boyut arasındaki dengeyi belirler. Zaten bir resim olan taranmış belgede bu neredeyse hiçbir şeye mal olmaz. Net bir metin PDF'inde ise metin katmanından olursunuz.\n\nTüm işlem tarayıcınızda çalışır; bu yüzden gizli bir fatura ya da sözleşme asla bir sıkıştırma sunucusuna yüklenmez. Araç önceki ve sonraki boyutları gösterir; bir ayarı deneyip rakamlara bakabilir, hâlâ sığmıyorsa daha güçlüsünü seçebilirsiniz.",
        whyClientSide:
          "PDF'yi nadiren kendi yararınıza sıkıştırırsınız; sıkıştırırsınız çünkü başkasının yükleme formunun bir sınırı vardır. Yani söz konusu dosya genellikle bir pasaport taraması, maaş bordrosu, tıbbi rapor, imzalı kira sözleşmesi ya da vergi beyannamesidir ve alternatif, yalnızca birkaç megabayt kırpmak için o belgeyi bir yabancının işlem kuyruğundan geçirmektir. Yerelde çalışmak iki aktarımı da atlatır: yavaş bir bağlantıdan 40 MB'lık taramaları yükleyip daha küçük bir dosyayı geri indirmezsiniz.",
        limitations: [
          "Sayfaları görsele çevirmek tek moddur. Sıkıştırıldıktan sonra metin seçilemez, kopyalanamaz ya da aranamaz, ekran okuyucular belgeyi artık okuyamaz; sayfadaki bağlantılar, form alanları ve ek açıklamalar gider. Metin katmanını koruma seçeneği ve onu geri getirecek OCR yoktur.",
          "Sade bir metin ya da vektör PDF'inde çıktı girdiden büyük olabilir; çünkü bir sayfa dolusu yazı, tam sayfa bir fotoğrafa dönüşür. Araç bunu yine de başarı sayar ve yalnızca negatif bir azalma yüzdesi gösterir; bu yüzden işe yaradığını varsaymak yerine önce/sonra rakamlarına bakın.",
          "Üç sabit hazır ayar var, başka bir şey yok. Hedef dosya boyutu, özel kalite veya DPI denetimi, yalnızca görsel yeniden sıkıştırma yok; metin katmanına dokunmadan gömülü fotoğrafları küçülten Ghostscript tarzı sunucu araçlarının yaptığı iş bu araçla yapılamaz.",
          "Aynı anda tek dosya, sayfanın ana iş parçacığında, ilerleme çubuğu ve iptal düğmesi olmadan çalışır. Uzun bir belge işlem sürerken sekmeyi kilitler. Her sayfa JPEG olarak yeniden kodlandığı için saydamlık da düzleşir; parola korumalı PDF'ler ise doğrudan reddedilir.",
        ],
        faq: [
          {
            q: "PDF'yi yüklemeden ücretsiz sıkıştırabilir miyim?",
            a: "Evet. Sıkıştırma tarayıcı sekmesinde yerelde çalışır; yükleme, hesap, kayıt ve filigran yoktur, bu yüzden hassas belgeler cihazınızdan çıkmaz.",
          },
          {
            q: "Sıkıştırma tam olarak nasıl çalışıyor?",
            a: "Her sayfa bir görsele dönüştürülür ve düşürülmüş çözünürlük ve kaliteyle JPEG olarak PDF'e geri kaydedilir. Boyut bu şekilde küçülür ve burada kullanılabilen tek yöntem budur.",
          },
          {
            q: "Sıkıştırdıktan sonra metin hâlâ seçilebilir mi?",
            a: "Hayır. Sayfalar görsele çevrildiği için metin katmanı kaybolur: sözcükler görünür kalır ama seçilemez, kopyalanamaz ya da aranamaz. Buna ihtiyacınız varsa orijinali saklayın.",
          },
          {
            q: "PDF'm neden küçülmek yerine büyüdü?",
            a: "Çünkü zaten verimliydi. Yalnızca metin içeren bir PDF harfleri komut olarak saklar; bu, o harflerin fotoğrafından çok daha derli toplu. Her sayfayı görsele çevirmek kazandırdığından fazlasına mal olabilir. Önce/sonra rakamlarına bakın; sonuç büyüdüyse orijinali saklayın.",
          },
          {
            q: "Hangi hazır ayarı seçmeliyim?",
            a: "Dengeli varsayılandır ve genellikle doğru başlangıç noktasıdır. Hâlâ yükleme sınırının üzerindeyseniz Küçük dosyaya, sıkıştırılan sayfalar okunamayacak kadar yumuşak görünüyorsa Yüksek kaliteye geçin.",
          },
        ],
        steps: [
          "Küçültmeniz gereken PDF'yi açın.",
          "Yüksek kalite, Dengeli veya Küçük dosyadan birini seçin.",
          "Sıkıştırın ve sayfaların yeniden kodlanmasını bekleyin.",
          "Önceki ve sonraki boyutları ve okunabilirliği kontrol edin, sonra indirin.",
        ],
      },
    },
    en: {
      intro:
        "Compress PDF reduces a document's file size so it clears the limits that keep bouncing it back — the attachment ceiling on an email, the upload cap on a job-application or government portal, the size a messaging app will accept. Instead of re-exporting from the original app, you shrink the finished PDF directly.\n\nThere is one compression method and it's worth understanding before you use it: every page is rendered to an image, re-encoded as a JPEG, and placed back on a page of the original dimensions. Three presets pick the trade-off — High quality, Balanced, or Small file — trading render resolution and JPEG quality against size. For a scanned document, which is already a picture, that costs you almost nothing. For a crisp text PDF it costs you the text layer.\n\nThe whole process runs in your browser, so a confidential invoice or contract is never uploaded to a compression server. The tool shows the before and after sizes, so you can try a preset, look at the numbers, and pick a stronger one if it still doesn't fit.",
      whyClientSide:
        "You rarely compress a PDF for your own benefit — you compress it because someone else's upload form has a limit. Which means the file in question is usually a passport scan, a payslip, a medical report, a signed lease or a tax return, and the alternative is putting that document through a stranger's processing queue purely to shave a few megabytes off it. Doing it locally also skips two transfers: you don't push 40 MB of scans up a slow connection just to pull a smaller file back down.",
      limitations: [
        "Rasterizing is the only mode. Once compressed, the text can't be selected, copied or searched, screen readers can no longer read the document, and links, form fields and annotations on the page are gone. There is no option to keep the text layer, and no OCR to put one back.",
        "On a lean text or vector PDF the output can be larger than the input — a page of type becomes a full-page photograph. The tool still reports that as a success and simply shows a negative reduction percentage, so check the before/after numbers rather than assuming it worked.",
        "Three fixed presets, nothing else. There's no target file size, no custom quality or DPI control, and no image-only recompression — the Ghostscript-style server tools that shrink embedded photos while leaving the text layer intact are doing something this tool cannot do.",
        "One file at a time, on the page's main thread, with no progress bar and no cancel button. A long document will lock the tab up while it works. Transparency is flattened too, since every page is re-encoded as JPEG, and password-protected PDFs are rejected outright.",
      ],
      faq: [
        {
          q: "Can I compress a PDF for free without uploading it?",
          a: "Yes. Compression runs locally in the browser tab — no upload, no account, no signup, no watermark — so sensitive documents never leave your device.",
        },
        {
          q: "How does the compression actually work?",
          a: "Each page is rendered to an image and saved back into the PDF as a JPEG at reduced resolution and quality. That is what brings the size down, and it is the only method available here.",
        },
        {
          q: "Will the text still be selectable after compressing?",
          a: "No. Because the pages are rasterized into images, the text layer is lost — the words stay visible but can't be selected, copied or searched. Keep the original if you need that.",
        },
        {
          q: "Why did my PDF get bigger instead of smaller?",
          a: "Because it was already efficient. A text-only PDF stores letters as instructions, which is far more compact than a photograph of those letters. Turning each page into an image can easily cost more than it saves. Check the before/after figures; if the result grew, keep the original.",
        },
        {
          q: "Which preset should I choose?",
          a: "Balanced is the default and is usually the right starting point. Move to Small file if you're still over an upload limit, or High quality if the compressed pages look too soft to read.",
        },
      ],
      steps: [
        "Open the PDF you need to shrink.",
        "Pick High quality, Balanced, or Small file.",
        "Compress and wait for the pages to be re-encoded.",
        "Check the before/after sizes and that it's still legible, then download.",
      ],
    },
    ar: {
      intro:
        "يقلّل «ضغط PDF» حجم المستند ليتجاوز الحدود التي تعيده مرارًا — سقف المرفقات في البريد، وحد الرفع في بوابة توظيف أو بوابة حكومية، والحجم الذي يقبله تطبيق مراسلة. فبدل إعادة التصدير من التطبيق الأصلي، تصغّر ملف PDF النهائي مباشرة.\n\nهناك طريقة ضغط واحدة، ويستحق فهمها قبل الاستخدام: تُرسم كل صفحة كصورة، ويُعاد ترميزها بصيغة JPEG، ثم تُوضع على صفحة بالأبعاد الأصلية. وتحدّد ثلاثة إعدادات جاهزة — جودة عالية، أو متوازن، أو ملف صغير — المقايضة بين دقة الرسم وجودة JPEG من جهة والحجم من جهة أخرى. بالنسبة لمستند ممسوح ضوئيًا، وهو صورة أصلًا، لا يكلّفك ذلك شيئًا يُذكر. أما ملف نصي واضح فيكلّفك طبقة النص.\n\nتجري العملية كلها في متصفحك، فلا تُرفع فاتورة أو عقد سري إلى خادم ضغط. وتعرض الأداة الحجم قبل الضغط وبعده، فجرّب إعدادًا، وانظر إلى الأرقام، واختر إعدادًا أقوى إن لم يناسب بعد.",
      whyClientSide:
        "نادرًا ما تضغط ملف PDF لمصلحتك أنت — بل لأن نموذج رفع عند جهة أخرى يضع حدًا. وهذا يعني أن الملف المقصود غالبًا صورة جواز سفر، أو كشف راتب، أو تقرير طبي، أو عقد إيجار موقّع، أو إقرار ضريبي، وأن البديل هو تمرير هذا المستند عبر طابور معالجة عند طرف غريب لمجرد اقتطاع بضعة ميغابايتات. والعمل محليًا يوفّر أيضًا عمليتَي نقل: لا ترفع 40 ميغابايت من المستندات الممسوحة عبر اتصال بطيء لتنزّل بعدها ملفًا أصغر.",
      limitations: [
        "التحويل إلى صور هو الأسلوب الوحيد. بعد الضغط لا يمكن تحديد النص أو نسخه أو البحث فيه، ولا تستطيع قارئات الشاشة قراءة المستند، وتختفي الروابط وحقول النماذج والتعليقات التوضيحية من الصفحة. ولا يوجد خيار للإبقاء على طبقة النص، ولا تعرّف ضوئي (OCR) يعيدها.",
        "مع ملف نصي أو متجهي خفيف قد يخرج الملف أكبر من الأصل — إذ تتحول صفحة النص إلى صورة فوتوغرافية كاملة. ومع ذلك تعتبر الأداة العملية ناجحة وتعرض نسبة تقليص سالبة، لذا راجع الحجم قبل وبعد بدل افتراض أن الضغط نجح.",
        "ثلاثة إعدادات ثابتة فقط. لا يوجد حجم مستهدف، ولا تحكّم مخصص بالجودة أو بدقة النقاط، ولا ضغط للصور وحدها — أدوات الخوادم المبنية على Ghostscript تصغّر الصور المضمّنة مع الإبقاء على طبقة النص، وهذا ما لا تستطيع هذه الأداة فعله.",
        "ملف واحد في كل مرة، على الخيط الرئيسي للصفحة، بلا شريط تقدّم وبلا زر إلغاء، فيتوقف التبويب عن الاستجابة أثناء معالجة مستند طويل. كما تُسطَّح الشفافية لأن كل صفحة يُعاد ترميزها بصيغة JPEG، وتُرفض ملفات PDF المحمية بكلمة مرور تمامًا.",
      ],
      faq: [
        {
          q: "هل يمكنني ضغط ملف PDF مجانًا دون رفعه؟",
          a: "نعم. يجري الضغط محليًا داخل تبويب المتصفح — بلا رفع ولا حساب ولا تسجيل ولا علامة مائية — فلا تغادر المستندات الحساسة جهازك.",
        },
        {
          q: "كيف يعمل الضغط فعليًا؟",
          a: "تُرسم كل صفحة كصورة وتُحفظ داخل الملف بصيغة JPEG بدقة وجودة أقل. هذا ما يخفض الحجم، وهو الأسلوب الوحيد المتاح هنا.",
        },
        {
          q: "هل يبقى النص قابلًا للتحديد بعد الضغط؟",
          a: "لا. لأن الصفحات تتحول إلى صور، تُفقد طبقة النص — تبقى الكلمات مرئية لكن لا يمكن تحديدها أو نسخها أو البحث فيها. احتفظ بالنسخة الأصلية إن احتجت ذلك.",
        },
        {
          q: "لماذا كبر حجم ملفي بدل أن يصغر؟",
          a: "لأنه كان موفّرًا أصلًا. الملف النصي يخزّن الحروف كتعليمات، وهذا أصغر بكثير من صورة لتلك الحروف، فتحويل كل صفحة إلى صورة قد يكلّف أكثر مما يوفّر. راجع الحجم قبل وبعد، وإن زاد فاحتفظ بالأصل.",
        },
        {
          q: "أي إعداد أختار؟",
          a: "«متوازن» هو الافتراضي وعادةً نقطة البداية الصحيحة. انتقل إلى «ملف صغير» إن بقيت فوق حد الرفع، أو إلى «جودة عالية» إن بدت الصفحات المضغوطة غير واضحة للقراءة.",
        },
      ],
      steps: [
        "افتح ملف PDF الذي تريد تصغيره.",
        "اختر «جودة عالية» أو «متوازن» أو «ملف صغير».",
        "اضغط الملف وانتظر إعادة ترميز الصفحات.",
        "راجع الحجم قبل وبعد وتأكد من وضوح القراءة ثم نزّل الملف.",
      ],
    },
  },

  "rotate-pdf": {
    related: ["reorder-pdf-pages", "split-pdf", "merge-pdf", "pdf"],
    en: {
      intro:
        "Rotate PDF turns pages to the right orientation and saves the change into the file. It fixes the classic scanner problem: a batch that came out sideways because the page went through the feeder the wrong way, or a document that opens upside down because it was photographed rotated.\n\nYou can spin a single page, a selection, or the whole document by 90, 180, or 270 degrees, then save. The rotation is written into the PDF, so the page stays the right way up wherever it's opened — not just tilted in your own viewer. Nothing about the page content changes; only its orientation.\n\nBecause the rotation is applied in your browser, the document is never uploaded. Correct a stack of scans and download a file that reads properly on any device.",
      faq: [
        {
          q: "Does the rotation stick when someone else opens the file?",
          a: "Yes. The new orientation is saved into the PDF itself, so it displays correctly in any viewer, not just yours.",
        },
        {
          q: "Can I rotate only some pages?",
          a: "Yes. Rotate a single page, a selection, or every page — useful when just a few scans came out sideways.",
        },
        {
          q: "What rotation angles are available?",
          a: "90, 180, and 270 degrees, which covers sideways and upside-down pages in either direction.",
        },
        {
          q: "Does rotating change the page content or quality?",
          a: "No. Only the orientation changes; the text and images stay exactly as they were.",
        },
        {
          q: "Are my files uploaded to rotate them?",
          a: "No. Rotation runs entirely in your browser, so your scans stay on your device.",
        },
      ],
      steps: [
        "Upload the PDF with pages to rotate.",
        "Select the pages and the rotation angle.",
        "Apply the rotation.",
        "Download the corrected PDF.",
      ],
    },
    ar: {
      intro:
        "يدير «تدوير PDF» الصفحات إلى الاتجاه الصحيح ويحفظ التغيير في الملف. إنه يصلح مشكلة الماسح الكلاسيكية: دفعة خرجت جانبية لأن الورقة مرّت في المُلقِّم بالاتجاه الخطأ، أو مستند يُفتح مقلوبًا لأنه صُوِّر مُدارًا.\n\nيمكنك تدوير صفحة واحدة أو تحديد أو المستند كله بمقدار 90 أو 180 أو 270 درجة ثم الحفظ. يُكتَب التدوير داخل ملف PDF، فتبقى الصفحة قائمة الاتجاه أينما فُتحت — لا مائلة في عارضك أنت فقط. ولا يتغيّر شيء في محتوى الصفحة؛ اتجاهها فقط.\n\nولأن التدوير يُطبَّق في متصفحك، لا يُرفع المستند أبدًا. صحّح كومة مسوحات ونزّل ملفًا يُقرأ بشكل سليم على أي جهاز.",
      faq: [
        {
          q: "هل يبقى التدوير حين يفتح غيري الملف؟",
          a: "نعم. يُحفظ الاتجاه الجديد داخل ملف PDF نفسه، فيظهر بشكل صحيح في أي عارض، لا عارضك وحده.",
        },
        {
          q: "هل يمكنني تدوير بعض الصفحات فقط؟",
          a: "نعم. دوّر صفحة واحدة أو تحديدًا أو كل الصفحات — مفيد حين تخرج بضعة مسوحات جانبية فقط.",
        },
        {
          q: "ما زوايا التدوير المتاحة؟",
          a: "90 و180 و270 درجة، وهي تغطي الصفحات الجانبية والمقلوبة في أي اتجاه.",
        },
        {
          q: "هل يغيّر التدوير محتوى الصفحة أو جودتها؟",
          a: "لا. يتغيّر الاتجاه فقط؛ ويبقى النص والصور كما كانت تمامًا.",
        },
        {
          q: "هل تُرفع ملفاتي لتدويرها؟",
          a: "لا. يجري التدوير بالكامل في متصفحك، فتبقى مسوحاتك على جهازك.",
        },
      ],
      steps: [
        "ارفع ملف PDF ذا الصفحات المطلوب تدويرها.",
        "اختر الصفحات وزاوية التدوير.",
        "طبّق التدوير.",
        "نزّل ملف PDF المصحَّح.",
      ],
    },
  },

  "watermark-pdf": {
    related: ["sign-pdf", "merge-pdf", "split-pdf", "pdf"],
    en: {
      intro:
        "Watermark PDF stamps text across your pages — DRAFT, CONFIDENTIAL, a company name, or a review-copy label — so the document's status travels with it. It's how you make sure a draft circulating for comment can't be mistaken for the final version, or that a sensitive file is clearly marked before it's shared.\n\nYou type the watermark text and place it over the pages, typically at an angle and semi-transparent so it's unmistakable without hiding the content underneath. The stamp is applied to every page (or the ones you choose) and saved into the file, so it shows up for everyone who opens it.\n\nThe watermark is added in your browser, so the document you're marking is never uploaded. Note that a text watermark is a visual overlay, not a security lock — it labels a document, it doesn't encrypt it or stop it being edited.",
      faq: [
        {
          q: "What can I use as the watermark text?",
          a: "Any short label — DRAFT, CONFIDENTIAL, a name, a date, or a review-copy note. It's placed across the pages so the status is obvious at a glance.",
        },
        {
          q: "Does the watermark cover every page?",
          a: "It's applied across the document, and you can target specific pages if you only need to mark part of it.",
        },
        {
          q: "Will the watermark hide the text underneath?",
          a: "No. It's usually drawn semi-transparent and angled, so the content stays readable while the label stays visible.",
        },
        {
          q: "Is a watermark a form of security?",
          a: "No — be clear on this. A watermark is a visual label, not encryption or edit protection. It signals status; it doesn't lock the file.",
        },
        {
          q: "Are my files uploaded to watermark them?",
          a: "No. The watermark is added locally in your browser, so the document stays on your device.",
        },
      ],
      steps: [
        "Upload the PDF to mark.",
        "Type your watermark text and set its placement.",
        "Apply it to the pages you want.",
        "Download the watermarked PDF.",
      ],
    },
    ar: {
      intro:
        "يختم «العلامة المائية على PDF» نصًا عبر صفحاتك — DRAFT أو CONFIDENTIAL أو اسم شركة أو وسم «نسخة للمراجعة» — فتنتقل حالة المستند معه. هكذا تضمن ألا تُخلَط مسوّدة متداولة للتعليق بالنسخة النهائية، وأن يُوسَم ملف حساس بوضوح قبل مشاركته.\n\nتكتب نص العلامة وتضعه فوق الصفحات، غالبًا بزاوية وشبه شفاف ليكون واضحًا دون أن يحجب المحتوى تحته. تُطبَّق العلامة على كل صفحة (أو التي تختارها) وتُحفظ في الملف، فتظهر لكل من يفتحه.\n\nتُضاف العلامة في متصفحك، فلا يُرفع المستند الذي توسمه أبدًا. لاحظ أن العلامة المائية النصية طبقة بصرية لا قفل أمان — فهي توسم المستند، ولا تشفّره ولا تمنع تعديله.",
      faq: [
        {
          q: "ما النص الذي أستخدمه للعلامة المائية؟",
          a: "أي وسم قصير — DRAFT أو CONFIDENTIAL أو اسم أو تاريخ أو ملاحظة «نسخة للمراجعة». يُوضَع عبر الصفحات لتكون الحالة بيّنة من النظرة الأولى.",
        },
        {
          q: "هل تغطي العلامة كل صفحة؟",
          a: "تُطبَّق على المستند كله، ويمكنك استهداف صفحات محددة إن أردت وسم جزء منه فقط.",
        },
        {
          q: "هل تحجب العلامة النص تحتها؟",
          a: "لا. تُرسَم عادةً شبه شفافة ومائلة فيبقى المحتوى مقروءًا والوسم ظاهرًا.",
        },
        {
          q: "هل العلامة المائية شكل من الأمان؟",
          a: "لا — كن واضحًا في هذا. العلامة المائية وسم بصري لا تشفير ولا حماية من التعديل. تشير إلى الحالة، ولا تقفل الملف.",
        },
        {
          q: "هل تُرفع ملفاتي لوضع العلامة؟",
          a: "لا. تُضاف العلامة محليًا في متصفحك، فيبقى المستند على جهازك.",
        },
      ],
      steps: [
        "ارفع ملف PDF المراد وسمه.",
        "اكتب نص العلامة واضبط موضعها.",
        "طبّقها على الصفحات التي تريدها.",
        "نزّل ملف PDF الموسوم.",
      ],
    },
  },

  "sign-pdf": {
    related: ["signature-maker", "watermark-pdf", "merge-pdf", "pdf"],
    en: {
      intro:
        "Sign PDF lets you place your signature onto a document and save it back as a PDF — a lease you need to return, a contract, a school or medical consent form that has to come back signed today. Instead of printing, signing, and scanning, you drop your signature straight onto the page.\n\nYou add your signature — drawn, or uploaded as an image — position it on the signature line, size it, and place it wherever the form needs it, including a date or initials. The result is a flattened PDF you can email or upload.\n\nEverything happens in your browser, so a document with personal terms is never uploaded to a signing service. One honesty note, covered in the FAQ below: this places a picture of your signature on the page, which is what most everyday forms ask for — it is not a cryptographic e-signature.",
      faq: [
        {
          q: "Is this a legally binding electronic signature?",
          a: "Be clear on what it is: it places an image of your signature onto the page, the same as signing a printout. It is not a cryptographic e-signature that embeds a verified, tamper-evident identity certificate. For everyday leases, consent forms, and contracts that ask for a signature it's usually what's needed; where a certified digital signature is specifically required, use a dedicated e-signature service.",
        },
        {
          q: "How do I create the signature?",
          a: "Draw it with your mouse or finger, or upload an image of your handwritten signature. Want a typed signature font? Create it in the signature maker and upload it here.",
        },
        {
          q: "Can I place the signature exactly on the line?",
          a: "Yes. Move and resize it to sit on the signature line, and add a date or initials where the form needs them.",
        },
        {
          q: "Are my documents uploaded to sign them?",
          a: "No. Signing happens entirely in your browser, so the contract or form never leaves your device.",
        },
        {
          q: "Can I reuse my signature or make a clean one first?",
          a: "Yes. Create and download a transparent signature image with the signature maker, then upload it here to place on any document.",
        },
      ],
      steps: [
        "Upload the PDF you need to sign.",
        "Add your signature by drawing or uploading it.",
        "Position and size it on the signature line.",
        "Download the signed PDF.",
      ],
    },
    ar: {
      intro:
        "يتيح «توقيع PDF» وضع توقيعك على مستند وحفظه ملف PDF — عقد إيجار عليك إعادته، أو عقد، أو نموذج موافقة مدرسي أو طبي يجب أن يعود موقّعًا اليوم. فبدل الطباعة والتوقيع والمسح، تسقط توقيعك مباشرة على الصفحة.\n\nتضيف توقيعك — مرسومًا أو مرفوعًا كصورة — وتضعه على سطر التوقيع، وتضبط حجمه، وتضعه حيث يحتاج النموذج، بما في ذلك تاريخ أو أحرف أولى. والنتيجة ملف PDF مسطّح ترسله أو ترفعه.\n\nيجري كل شيء في متصفحك، فلا يُرفع مستند ببنود شخصية إلى خدمة توقيع. وملاحظة صدق واحدة موضّحة في الأسئلة أدناه: هذا يضع صورة لتوقيعك على الصفحة، وهو ما تطلبه أغلب النماذج اليومية — وليس توقيعًا إلكترونيًا تشفيريًا.",
      faq: [
        {
          q: "هل هذا توقيع إلكتروني مُلزِم قانونيًا؟",
          a: "كن واضحًا بما هو: يضع صورة لتوقيعك على الصفحة، تمامًا كالتوقيع على نسخة مطبوعة. وليس توقيعًا تشفيريًا يضمّن شهادة هوية موثّقة ومقاومة للعبث. بالنسبة لعقود الإيجار ونماذج الموافقة والعقود اليومية التي تطلب توقيعًا، هو عادةً ما يلزم؛ وحيث يُطلب توقيع رقمي معتمد تحديدًا، استخدم خدمة توقيع إلكتروني مخصصة.",
        },
        {
          q: "كيف أنشئ التوقيع؟",
          a: "ارسمه بالفأرة أو إصبعك، أو ارفع صورة لتوقيعك اليدوي. تريد خط توقيع مكتوبًا؟ أنشئه في صانع التوقيع ثم ارفعه هنا.",
        },
        {
          q: "هل يمكنني وضع التوقيع على السطر بدقة؟",
          a: "نعم. حرّكه وغيّر حجمه ليستقر على سطر التوقيع، وأضف تاريخًا أو أحرفًا أولى حيث يحتاج النموذج.",
        },
        {
          q: "هل تُرفع مستنداتي لتوقيعها؟",
          a: "لا. يجري التوقيع بالكامل في متصفحك، فلا يغادر العقد أو النموذج جهازك.",
        },
        {
          q: "هل يمكنني إعادة استخدام توقيعي أو إنشاء واحد نظيف أولًا؟",
          a: "نعم. أنشئ ونزّل صورة توقيع شفافة بأداة صانع التوقيع، ثم ارفعها هنا لوضعها على أي مستند.",
        },
      ],
      steps: [
        "ارفع ملف PDF الذي تريد توقيعه.",
        "أضف توقيعك رسمًا أو رفعًا.",
        "ضعه واضبط حجمه على سطر التوقيع.",
        "نزّل ملف PDF الموقّع.",
      ],
    },
  },

  "extract-text-from-pdf": {
    related: ["image-to-text", "split-pdf", "merge-pdf", "pdf"],
    en: {
      intro:
        "Extract Text from PDF pulls the words out of a document as plain text you can copy, edit, or paste elsewhere — quoting a clause from a contract, repurposing a report's paragraphs into a new document, or feeding the content into another tool without retyping it.\n\nIt reads the PDF's text layer — the actual characters stored in the file — and hands them back as text, so a digitally created PDF (exported from a word processor, browser, or design app) extracts cleanly. Everything runs in your browser; the document isn't uploaded to pull its text.\n\nOne limitation to know up front: a scanned or photographed PDF is really an image of a page, with no text layer to read. Extraction returns little or nothing for those. To get words out of a scan, run it through OCR first with the image-to-text tool, which recognizes characters in a picture.",
      faq: [
        {
          q: "Why did extraction return nothing from my PDF?",
          a: "Your PDF is almost certainly a scan or photo — an image of the page with no underlying text layer, so there are no characters to read. Use an OCR tool to recognize the text in the image first.",
        },
        {
          q: "What's the difference between this and OCR?",
          a: "This reads text that's already stored in the file. OCR looks at a picture of text and recognizes the letters. For scanned pages you need OCR, such as the image-to-text tool.",
        },
        {
          q: "Does it keep the original formatting?",
          a: "It focuses on the words as plain text. Layout, fonts, and columns aren't preserved — you get clean, editable text to reuse.",
        },
        {
          q: "Are my documents uploaded to extract the text?",
          a: "No. Extraction runs entirely in your browser, so the document stays on your device.",
        },
        {
          q: "Can I extract from just some pages?",
          a: "You can extract the document's text and take the portion you need; for a specific chapter, split those pages out first.",
        },
      ],
      steps: [
        "Upload the PDF you want text from.",
        "Let the tool read its text layer.",
        "Review the extracted text.",
        "Copy or download it.",
      ],
    },
    ar: {
      intro:
        "يستخرج «استخراج النص من PDF» كلمات المستند نصًا عاديًا تنسخه أو تحرّره أو تلصقه في مكان آخر — اقتباس بند من عقد، أو إعادة توظيف فقرات تقرير في مستند جديد، أو تمرير المحتوى إلى أداة أخرى دون إعادة كتابته.\n\nتقرأ الأداة طبقة النص في ملف PDF — الأحرف الفعلية المخزّنة في الملف — وتعيدها نصًا، فيُستخرَج ملف PDF المُنشأ رقميًا (المُصدَّر من معالج نصوص أو متصفح أو برنامج تصميم) بنظافة. ويجري كل شيء في متصفحك؛ فلا يُرفع المستند لاستخراج نصه.\n\nقيد واحد ينبغي معرفته سلفًا: ملف PDF الممسوح أو المصوَّر هو في الحقيقة صورة لصفحة، بلا طبقة نص تُقرأ. ويعيد الاستخراج القليل أو لا شيء لتلك الملفات. لإخراج كلمات من مسح، مرّره أولًا عبر التعرّف الضوئي على الحروف بأداة «الصورة إلى نص» التي تتعرّف على الأحرف في الصورة.",
      faq: [
        {
          q: "لماذا أعاد الاستخراج لا شيء من ملفي؟",
          a: "ملفك على الأرجح مسح أو صورة — صورة للصفحة بلا طبقة نص تحتها، فلا توجد أحرف تُقرأ. استخدم أداة تعرّف ضوئي للتعرّف على النص في الصورة أولًا.",
        },
        {
          q: "ما الفرق بين هذا والتعرّف الضوئي؟",
          a: "هذا يقرأ نصًا مخزّنًا أصلًا في الملف. أما التعرّف الضوئي فينظر إلى صورة نص ويتعرّف على الحروف. للصفحات الممسوحة تحتاج التعرّف الضوئي، كأداة «الصورة إلى نص».",
        },
        {
          q: "هل يحفظ التنسيق الأصلي؟",
          a: "يركّز على الكلمات نصًا عاديًا. لا يُحفظ التخطيط ولا الخطوط ولا الأعمدة — تحصل على نص نظيف قابل للتحرير لإعادة استخدامه.",
        },
        {
          q: "هل تُرفع مستنداتي لاستخراج النص؟",
          a: "لا. يجري الاستخراج بالكامل في متصفحك، فيبقى المستند على جهازك.",
        },
        {
          q: "هل يمكنني الاستخراج من بعض الصفحات فقط؟",
          a: "يمكنك استخراج نص المستند وأخذ الجزء الذي تحتاجه؛ ولفصل محدد، قسّم تلك الصفحات أولًا.",
        },
      ],
      steps: [
        "ارفع ملف PDF الذي تريد نصه.",
        "دع الأداة تقرأ طبقة نصه.",
        "راجع النص المستخرَج.",
        "انسخه أو نزّله.",
      ],
    },
  },

  "reorder-pdf-pages": {
    related: ["rotate-pdf", "split-pdf", "merge-pdf", "pdf"],
    en: {
      intro:
        "Reorder PDF Pages lets you rearrange, and remove, the pages inside a document. It's the cleanup step after scanning: pages that fed in out of sequence get dragged back into order, the blank back-sides the scanner captured get deleted, and a duplicated page gets dropped.\n\nYou see the pages as thumbnails, drag them into the right sequence, and remove the ones you don't want, then save a tidy PDF. The pages themselves are untouched — same text, same quality — only their order and which ones are included change.\n\nIt all runs in your browser, so a scanned document full of personal information is never uploaded just to be tidied. Fix the order once and download a clean file.",
      faq: [
        {
          q: "Can I delete pages as well as reorder them?",
          a: "Yes. Remove blank sides, duplicates, or any page you don't need, and drag the rest into the order you want.",
        },
        {
          q: "Do I see the pages while arranging them?",
          a: "Yes. Pages appear as thumbnails, so you can drag them into sequence and see exactly what you're removing.",
        },
        {
          q: "Does reordering change the page content?",
          a: "No. Only the sequence and inclusion change; each page keeps its original text and quality.",
        },
        {
          q: "Is this different from merging or splitting?",
          a: "Yes. Reorder works within one file — rearranging and removing its pages. Merge joins files; split writes pages out to separate files.",
        },
        {
          q: "Are my files uploaded to reorder them?",
          a: "No. Everything happens in your browser, so the document stays on your device.",
        },
      ],
      steps: [
        "Upload the PDF to tidy.",
        "Drag the page thumbnails into the order you want.",
        "Remove any blank or unwanted pages.",
        "Download the reordered PDF.",
      ],
    },
    ar: {
      intro:
        "يتيح «إعادة ترتيب صفحات PDF» إعادة ترتيب الصفحات داخل المستند وحذفها. إنه خطوة التنظيف بعد المسح: الصفحات التي دخلت خارج التسلسل تُسحَب إلى مكانها، والأوجه الخلفية الفارغة التي التقطها الماسح تُحذَف، والصفحة المكررة تُسقَط.\n\nترى الصفحات مصغّرات، فتسحبها إلى التسلسل الصحيح، وتزيل ما لا تريده، ثم تحفظ ملف PDF مرتّبًا. الصفحات نفسها لا تُمَس — النص نفسه والجودة نفسها — يتغيّر فقط ترتيبها وأيّها مُضمَّن.\n\nيجري كل ذلك في متصفحك، فلا يُرفع مستند ممسوح مليء بمعلومات شخصية لمجرد ترتيبه. صحّح الترتيب مرة ونزّل ملفًا نظيفًا.",
      faq: [
        {
          q: "هل يمكنني حذف الصفحات كما أعيد ترتيبها؟",
          a: "نعم. أزِل الأوجه الفارغة أو المكررة أو أي صفحة لا تحتاجها، واسحب البقية إلى الترتيب الذي تريده.",
        },
        {
          q: "هل أرى الصفحات أثناء ترتيبها؟",
          a: "نعم. تظهر الصفحات مصغّرات فتسحبها إلى التسلسل وترى بالضبط ما تزيله.",
        },
        {
          q: "هل تغيّر إعادة الترتيب محتوى الصفحة؟",
          a: "لا. يتغيّر التسلسل والتضمين فقط؛ وتحتفظ كل صفحة بنصها وجودتها الأصلية.",
        },
        {
          q: "هل يختلف هذا عن الدمج أو التقسيم؟",
          a: "نعم. إعادة الترتيب تعمل داخل ملف واحد — ترتّب صفحاته وتزيلها. الدمج يضم الملفات؛ والتقسيم يُخرِج الصفحات إلى ملفات منفصلة.",
        },
        {
          q: "هل تُرفع ملفاتي لإعادة ترتيبها؟",
          a: "لا. يجري كل شيء في متصفحك، فيبقى المستند على جهازك.",
        },
      ],
      steps: [
        "ارفع ملف PDF المراد ترتيبه.",
        "اسحب مصغّرات الصفحات إلى الترتيب الذي تريده.",
        "أزِل أي صفحة فارغة أو غير مرغوبة.",
        "نزّل ملف PDF المُعاد ترتيبه.",
      ],
    },
  },

  "jpg-to-pdf": {
    related: ["merge-pdf", "compress-pdf", "image-converter", "pdf"],
    en: {
      intro:
        "JPG to PDF turns your images into a PDF — one photo per page, combined into a single document in the order you set. It's built for the everyday task of submitting photographed paperwork: you snap each page of a form, an ID, or a set of receipts with your phone, and need them delivered as one tidy PDF instead of a pile of loose image files.\n\nYou add the JPGs (PNG works too), arrange them, and the tool lays each one onto its own page and bundles them into a single PDF ready to email or upload. A portal that only accepts PDF, or a person who doesn't want ten separate attachments, gets exactly one file.\n\nThe conversion happens in your browser, so photos of personal documents are never uploaded to a server. There's no watermark and no account, so the finished PDF is clean and yours.",
      faq: [
        {
          q: "Can I put several photos into one PDF?",
          a: "Yes. Add all the images, arrange their order, and each becomes a page in a single combined PDF.",
        },
        {
          q: "Can I control the page order?",
          a: "Yes. Arrange the images before converting; they become pages in exactly that sequence.",
        },
        {
          q: "Which image formats can I convert?",
          a: "JPG is the common case, and PNG works too. To change a format first, the image converter handles that.",
        },
        {
          q: "Are my photos uploaded to convert them?",
          a: "No. The conversion runs entirely in your browser, so pictures of your documents stay on your device.",
        },
        {
          q: "Will there be a watermark on the PDF?",
          a: "No. The output is a clean PDF with no watermark and no account required.",
        },
      ],
      steps: [
        "Add the JPG or image files.",
        "Arrange them into the page order you want.",
        "Convert them into a single PDF.",
        "Download the PDF.",
      ],
    },
    ar: {
      intro:
        "يحوّل «JPG إلى PDF» صورك إلى ملف PDF — صورة واحدة لكل صفحة، مجمّعة في مستند واحد بالترتيب الذي تحدّده. صُمِّم للمهمة اليومية: تقديم أوراق مصوَّرة، فتلتقط كل صفحة من نموذج أو هوية أو مجموعة إيصالات بهاتفك، وتحتاج تسليمها ملف PDF واحدًا مرتّبًا بدل كومة ملفات صور متفرقة.\n\nتضيف صور JPG (وتعمل PNG أيضًا)، وترتّبها، فتضع الأداة كلًّا منها على صفحتها وتجمعها في ملف PDF واحد جاهز للإرسال أو الرفع. فبوابة لا تقبل إلا PDF، أو شخص لا يريد عشرة مرفقات منفصلة، يحصل على ملف واحد بالضبط.\n\nيجري التحويل في متصفحك، فلا تُرفع صور المستندات الشخصية إلى خادم. ولا علامة مائية ولا حساب، فيكون ملف PDF النهائي نظيفًا وملكك.",
      faq: [
        {
          q: "هل يمكنني وضع عدة صور في ملف PDF واحد؟",
          a: "نعم. أضف كل الصور، ورتّبها، فتصبح كل واحدة صفحة في ملف PDF واحد مجمّع.",
        },
        {
          q: "هل يمكنني التحكم في ترتيب الصفحات؟",
          a: "نعم. رتّب الصور قبل التحويل؛ فتصبح صفحات بهذا التسلسل تمامًا.",
        },
        {
          q: "أي صيغ الصور يمكنني تحويلها؟",
          a: "JPG هي الحالة الشائعة، وتعمل PNG أيضًا. ولتغيير الصيغة أولًا، يتولى محوّل الصور ذلك.",
        },
        {
          q: "هل تُرفع صوري لتحويلها؟",
          a: "لا. يجري التحويل بالكامل في متصفحك، فتبقى صور مستنداتك على جهازك.",
        },
        {
          q: "هل ستكون هناك علامة مائية على ملف PDF؟",
          a: "لا. الناتج ملف PDF نظيف بلا علامة مائية ودون حساب.",
        },
      ],
      steps: [
        "أضف ملفات JPG أو الصور.",
        "رتّبها إلى ترتيب الصفحات الذي تريده.",
        "حوّلها إلى ملف PDF واحد.",
        "نزّل ملف PDF.",
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
    extra: {
      ru: {
        intro:
          "Чтобы сжать фото до 100 КБ, чаще всего приходится сталкиваться с сайтами вакансий и системами отбора кандидатов (ATS): они нередко ограничивают фото профиля или миниатюру вложенного резюме примерно этим размером, чтобы панели рекрутёров загружались быстро. Для аватара на форуме или в сообществе 100 КБ тоже более чем достаточно. Этот инструмент сжимает ваш JPG, PNG или WebP до 100 КБ прямо в браузере.\n\nВы задаёте цель в 100 КБ — инструмент снижает качество JPEG и, если нужно, уменьшает размеры изображения, пока файл не уместится. Когда в запасе целых 100 КБ, портрет обычно сохраняет чёткие черты и плавные градиенты, так что в анкете он по-прежнему выглядит достойно.\n\nБез загрузки на сервер, регистрации и водяных знаков — удобно, когда портал отклоняет фото как «слишком большое», а вам нужно быстрое и приватное решение.",
        faq: [
          {
            q: "Почему именно 100 КБ?",
            a: "Порталы вакансий и ATS-системы обычно ограничивают фото профиля и вложения примерно этим размером, а для аватаров на форумах и в сообществах это тоже распространённый лимит.",
          },
          {
            q: "Останется ли моё фото чётким при 100 КБ?",
            a: "В большинстве случаев да. 100 КБ достаточно, чтобы сохранить детали лица и плавные тона кожи при обычных размерах отображения.",
          },
          {
            q: "Может ли инструмент уложиться ровно в 100 КБ?",
            a: "Он приближается к цели, подбирая качество, а затем размеры; результат получается по принципу «лучшее из возможного», поэтому файл может оказаться чуть больше или чуть меньше. Для запаса уменьшите размеры изображения.",
          },
          {
            q: "Загружаются ли файлы куда-либо?",
            a: "Нет — всё сжатие выполняется в вашем браузере, поэтому фото остаётся приватным.",
          },
        ],
        steps: [
          "Загрузите фото, которое нужно уменьшить до 100 КБ.",
          "Укажите 100 КБ как целевой размер.",
          "Пусть инструмент снизит качество и при необходимости уменьшит размеры.",
          "Скачайте сжатое изображение.",
        ],
      },
      fa: {
        intro:
          "برای کاهش حجم عکس به ۱۰۰ کیلوبایت، معمولاً با سایت‌های کاریابی و سامانه‌های ردیابی متقاضی (ATS) روبه‌رو می‌شوید؛ این سامانه‌ها اغلب عکس پروفایل یا تصویر بندانگشتی پیوست رزومه را حدوداً در همین اندازه محدود می‌کنند تا داشبورد کارفرما سریع باز شود. برای آواتار در انجمن‌ها و جامعه‌های آنلاین هم ۱۰۰ کیلوبایت کاملاً کافی است. این ابزار فایل JPG، PNG یا WebP شما را مستقیم در مرورگر به حدود ۱۰۰ کیلوبایت می‌رساند.\n\nشما هدف ۱۰۰ کیلوبایت را می‌دهید؛ ابزار کیفیت JPEG را پایین می‌آورد و در صورت نیاز ابعاد را کوچک می‌کند تا فایل جا شود. وقتی ۱۰۰ کیلوبایت کامل در اختیار دارید، عکس پرسنلی معمولاً جزئیات واضح و تدریج‌های نرم خود را حفظ می‌کند و در درخواست شما همچنان حرفه‌ای دیده می‌شود.\n\nبدون آپلود، بدون ثبت‌نام و بدون واترمارک؛ وقتی درگاهی عکس را «بیش از حد بزرگ» رد می‌کند و یک راه‌حل سریع و خصوصی می‌خواهید، به کار می‌آید.",
        faq: [
          {
            q: "چرا دقیقاً ۱۰۰ کیلوبایت؟",
            a: "درگاه‌های کاریابی و سامانه‌های ATS معمولاً عکس پروفایل یا پیوست را نزدیک همین اندازه محدود می‌کنند و برای آواتار در انجمن‌ها و جامعه‌های آنلاین هم سقف رایجی است.",
          },
          {
            q: "آیا عکس من با ۱۰۰ کیلوبایت واضح می‌ماند؟",
            a: "در بیشتر موارد بله. ۱۰۰ کیلوبایت آن‌قدر گنجایش دارد که جزئیات چهره و نرمی رنگ پوست را در اندازه‌های معمول نمایش حفظ کند.",
          },
          {
            q: "آیا ابزار می‌تواند دقیقاً زیر ۱۰۰ کیلوبایت برساند؟",
            a: "با تنظیم کیفیت و سپس ابعاد به هدف نزدیک می‌شود؛ نتیجه بر اساس بهترین تلاش است، پس ممکن است کمی بالاتر یا پایین‌تر بنشیند. برای حاشیهٔ اطمینان، ابعاد را کوچک‌تر کنید.",
          },
          {
            q: "آیا فایل‌ها جایی آپلود می‌شوند؟",
            a: "نه — تمام فشرده‌سازی در مرورگر شما انجام می‌شود و عکس‌تان خصوصی می‌ماند.",
          },
        ],
        steps: [
          "عکسی را که باید زیر ۱۰۰ کیلوبایت برود بارگذاری کنید.",
          "۱۰۰ کیلوبایت را به‌عنوان حجم هدف تعیین کنید.",
          "بگذارید ابزار کیفیت را پایین بیاورد و در صورت نیاز ابعاد را کوچک کند.",
          "تصویر فشرده‌شده را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "100KB는 채용 사이트와 지원자 추적 시스템(ATS)에서 자주 마주치는 제한입니다. 채용 담당자용 화면이 빠르게 뜨도록 프로필 사진이나 이력서 첨부 썸네일을 대략 이 크기로 제한하는 곳이 많습니다. 포럼이나 커뮤니티의 프로필 이미지로도 충분한 크기입니다. 이 도구는 JPG, PNG, WebP를 브라우저에서 100KB 가까이로 압축합니다.\n\n목표를 100KB로 입력하면 JPEG 품질을 낮추고, 필요하면 해상도도 줄여서 파일이 들어갈 때까지 맞춥니다. 100KB면 증명사진은 대체로 얼굴 윤곽이 선명하고 그라데이션도 부드럽게 유지되므로, 지원서에 넣어도 단정해 보입니다.\n\n업로드도, 가입도, 워터마크도 없습니다. 사이트에서 사진이 '용량이 너무 크다'며 거절될 때 빠르고 비공개로 해결하기에 좋습니다.",
        faq: [
          {
            q: "왜 하필 100KB인가요?",
            a: "채용 사이트와 ATS는 프로필이나 첨부 이미지를 이 정도 크기로 제한하는 경우가 많고, 포럼과 커뮤니티의 프로필 이미지 제한으로도 흔합니다.",
          },
          {
            q: "100KB로 줄여도 증명사진이 선명한가요?",
            a: "대부분의 경우 그렇습니다. 100KB는 일반적인 표시 크기에서 얼굴 디테일과 부드러운 피부 톤을 지킬 만큼 넉넉합니다.",
          },
          {
            q: "정확히 100KB 아래로 맞출 수 있나요?",
            a: "품질을 조정한 뒤 해상도를 줄이는 방식으로 목표에 맞추는 최선형 방식이어서, 조금 넘거나 모자랄 수 있습니다. 여유를 더 두려면 해상도를 줄여 보세요.",
          },
          {
            q: "파일이 어딘가에 업로드되나요?",
            a: "아니요. 모든 압축이 브라우저 안에서 이루어지므로 사진은 비공개로 유지됩니다.",
          },
          {
            q: "100KB에는 PNG와 JPG 중 무엇이 좋나요?",
            a: "사진은 JPG나 WebP가 좋습니다. 투명 배경이나 선명한 단색 그래픽이 필요할 때만 PNG를 쓰세요.",
          },
        ],
        steps: [
          "100KB 이하로 만들어야 하는 사진을 올립니다.",
          "목표 크기를 100KB로 설정합니다.",
          "도구가 품질을 낮추고, 필요하면 해상도도 줄이도록 둡니다.",
          "압축된 이미지를 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "100 KB là giới hạn bạn hay đụng phải trên các trang tuyển dụng và hệ thống theo dõi ứng viên (ATS), nơi ảnh hồ sơ hoặc ảnh thu nhỏ của CV đính kèm thường bị khống chế ở khoảng mức này để trang dành cho nhà tuyển dụng tải nhanh. Mức này cũng quá đủ cho ảnh đại diện trên diễn đàn hay cộng đồng. Công cụ này nén ảnh JPG, PNG hoặc WebP về gần 100 KB ngay trong trình duyệt.\n\nBạn đặt mục tiêu 100 KB; công cụ hạ chất lượng JPEG và, nếu cần, thu nhỏ kích thước cho tới khi tệp vừa. Với trọn 100 KB để làm việc, một bức ảnh chân dung thường vẫn giữ nét mặt sắc nét và dải chuyển màu mượt, nên hồ sơ ứng tuyển của bạn vẫn trông chuyên nghiệp.\n\nKhông tải lên, không đăng ký, không hình mờ: rất tiện khi cổng nào đó từ chối ảnh vì \"quá lớn\" và bạn chỉ cần một cách sửa nhanh, kín đáo.",
        faq: [
          {
            q: "Vì sao lại là 100 KB?",
            a: "Các cổng tuyển dụng và nền tảng ATS thường giới hạn ảnh hồ sơ hoặc tệp đính kèm quanh mức này, và đây cũng là giới hạn phổ biến cho ảnh đại diện trên diễn đàn, cộng đồng.",
          },
          {
            q: "Ảnh chân dung của tôi còn sắc nét ở 100 KB không?",
            a: "Trong phần lớn trường hợp là có. 100 KB đủ rộng rãi để giữ chi tiết khuôn mặt và tông da mịn ở các kích thước hiển thị thông thường.",
          },
          {
            q: "Có xuống dưới đúng 100 KB được không?",
            a: "Công cụ nén dần tới mục tiêu bằng cách chỉnh chất lượng rồi tới kích thước; kết quả theo kiểu cố gắng hết sức nên có thể nhỉnh hơn hoặc thấp hơn một chút. Hãy cắt bớt kích thước để có thêm biên an toàn.",
          },
          {
            q: "Tệp có bị tải lên đâu không?",
            a: "Không, toàn bộ việc nén diễn ra trong trình duyệt nên ảnh của bạn vẫn riêng tư.",
          },
          {
            q: "100 KB thì nên dùng PNG hay JPG?",
            a: "JPG hoặc WebP cho ảnh chụp; chỉ dùng PNG nếu bạn cần nền trong suốt hoặc đồ hoạ phẳng sắc nét.",
          },
        ],
        steps: [
          "Tải lên ảnh bạn cần đưa xuống dưới 100 KB.",
          "Đặt 100 KB làm kích thước mục tiêu.",
          "Để công cụ hạ chất lượng và thu nhỏ kích thước nếu cần.",
          "Tải ảnh đã nén xuống.",
        ],
      },
      tr: {
        intro:
          "100 KB, iş ilanı siteleri ve başvuru takip sistemlerinde (ATS) sık karşınıza çıkan sınırdır; bu sistemler, işe alım panelleri hızlı açılsın diye profil fotoğrafını veya CV eki küçük resmini genellikle bu boyutla sınırlar. Bir forum ya da topluluk profil resmi için de fazlasıyla yeterlidir. Bu araç JPG, PNG veya WebP dosyanızı tarayıcıda yerel olarak 100 KB'a doğru sıkıştırır.\n\nHedef olarak 100 KB verirsiniz; araç JPEG kalitesini düşürür ve gerekirse dosya sığana kadar boyutları küçültür. Çalışmak için tam 100 KB varken bir vesikalık genellikle keskin yüz hatlarını ve yumuşak geçişleri korur; başvurunuzda hâlâ profesyonel görünür.\n\nYükleme yok, kayıt yok, filigran yok: bir portal fotoğrafınızı \"çok büyük\" diye reddettiğinde yalnızca hızlı ve gizli bir çözüme ihtiyaç duyduğunuz durumlar için kullanışlı.",
        faq: [
          {
            q: "Neden özellikle 100 KB?",
            a: "İş portalları ve ATS platformları profil veya ek görsellerini yaygın olarak bu boyut civarında sınırlar; forum ve topluluklarda da sık görülen bir avatar sınırıdır.",
          },
          {
            q: "Vesikalığım 100 KB'ta hâlâ keskin görünür mü?",
            a: "Çoğu durumda evet. 100 KB, tipik görüntüleme boyutlarında yüz ayrıntısını ve yumuşak ten tonlarını korumaya yetecek kadar cömerttir.",
          },
          {
            q: "Tam 100 KB'ın altına inebilir mi?",
            a: "Önce kaliteyi, sonra boyutları ayarlayarak hedefe yaklaşır; sonuçlar en iyi çaba esasına dayanır, bu yüzden biraz üstünde ya da altında çıkabilir. Fazladan pay için boyutları kırpın.",
          },
          {
            q: "Dosyalar bir yere yükleniyor mu?",
            a: "Hayır, tüm sıkıştırma tarayıcınızda yapılır; fotoğrafınız gizli kalır.",
          },
          {
            q: "100 KB için PNG mi JPG mi?",
            a: "Fotoğraflar için JPG veya WebP; PNG yalnızca saydam arka plan ya da keskin düz grafikler gerekiyorsa.",
          },
        ],
        steps: [
          "100 KB altına indirmeniz gereken fotoğrafı yükleyin.",
          "Hedef boyut olarak 100 KB'ı belirleyin.",
          "Aracın kaliteyi düşürmesine ve gerekirse boyutları küçültmesine izin verin.",
          "Sıkıştırılmış görseli indirin.",
        ],
      },
    },
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
    extra: {
      ru: {
        intro:
          "Сжать изображение до 500 КБ — это скорее вопрос хороших манер и производительности, чем жёсткого правила портала: разумный потолок для картинки во вложении письма, чтобы не забивать чужой ящик, и добротный бюджет для главного баннера на сайте, который должен выглядеть чётко и не тормозить загрузку страницы. Инструмент сжимает JPG, PNG или WebP до 500 КБ локально.\n\nЗадайте цель в 500 КБ — инструмент снизит качество и лишь при необходимости уменьшит размеры. Полмегабайта хватает, чтобы большое широкое фото выглядело чисто на экранах высокого разрешения, а многомегабайтная раздутость, которую дают камеры телефонов, уходит.\n\nНичего не загружается на сервер, поэтому можно приватно подготовить баннеры или фото для письма и запускать заново, пока размер не устроит.",
        faq: [
          {
            q: "Зачем стремиться именно к 500 КБ?",
            a: "Так вложения в письмах остаются необременительными для получателя, а для баннера на сайте это здоровый вес, при котором картинка всё ещё выглядит чётко.",
          },
          {
            q: "Будет ли баннер в 500 КБ хорошо выглядеть на большом экране?",
            a: "Да — при таком бюджете широкое фото остаётся чистым на дисплеях высокого разрешения и при этом загружается заметно быстрее оригинала.",
          },
          {
            q: "Получится ли ровно 500 КБ?",
            a: "Инструмент приближается к цели по принципу «лучшее из возможного» (сначала качество, затем размеры), поэтому результат будет около 500 КБ, но не обязательно точно столько.",
          },
          {
            q: "Загружаются ли мои изображения?",
            a: "Нет, сжатие целиком выполняется в браузере, поэтому ваши фото не покидают устройство.",
          },
          {
            q: "Стоит ли оставлять PNG при таком размере?",
            a: "Для фотографий выбирайте JPG или WebP, чтобы получить максимум от бюджета в 500 КБ; PNG оставьте для графики, которой нужна прозрачность.",
          },
        ],
        steps: [
          "Загрузите изображение, которое нужно уложить в 500 КБ.",
          "Укажите 500 КБ как целевой размер.",
          "Пусть инструмент снизит качество и, если нужно, размеры.",
          "Скачайте оптимизированное изображение.",
        ],
      },
      fa: {
        intro:
          "رساندن عکس به ۵۰۰ کیلوبایت بیشتر مسئلهٔ ادب و کارایی است تا قانون سخت یک درگاه: سقفی معقول برای عکسی که به ایمیل پیوست می‌کنید تا صندوق کسی را سنگین نکنید، و بودجه‌ای مناسب برای تصویر اصلی یا بنر سایت که باید واضح دیده شود و سرعت بارگذاری صفحه را پایین نیاورد. این ابزار فایل JPG، PNG یا WebP را به‌صورت محلی به حدود ۵۰۰ کیلوبایت می‌رساند.\n\nهدف ۵۰۰ کیلوبایت را بدهید؛ ابزار کیفیت را پایین می‌آورد و فقط در صورت لزوم ابعاد را کم می‌کند. نیم مگابایت برای این کافی است که یک عکس بزرگ و تمام‌عرض روی صفحه‌نمایش‌های با وضوح بالا تمیز دیده شود و در عین حال حجم چندمگابایتی اضافه‌ای که دوربین گوشی‌ها تولید می‌کنند حذف شود.\n\nچیزی آپلود نمی‌شود، پس می‌توانید تصویر سایت یا عکس ایمیل را خصوصی آماده کنید و تا وقتی حجم مناسب شد دوباره اجرا کنید.",
        faq: [
          {
            q: "چرا هدف ۵۰۰ کیلوبایت؟",
            a: "پیوست‌های ایمیل را برای گیرنده سبک و مؤدبانه نگه می‌دارد و برای تصویر اصلی یا بنر سایت وزن سالمی است که هنوز واضح دیده می‌شود.",
          },
          {
            q: "آیا تصویر ۵۰۰ کیلوبایتی روی صفحهٔ بزرگ خوب دیده می‌شود؟",
            a: "بله — با این بودجه یک عکس عریض روی نمایشگرهای با وضوح بالا تمیز می‌ماند و بسیار سریع‌تر از نسخهٔ اصلی بارگذاری می‌شود.",
          },
          {
            q: "آیا دقیقاً به ۵۰۰ کیلوبایت می‌رسد؟",
            a: "ابزار با بهترین تلاش (اول کیفیت، بعد ابعاد) به هدف نزدیک می‌شود؛ پس نتیجه نزدیک به ۵۰۰ کیلوبایت است، نه لزوماً دقیقاً همان.",
          },
          {
            q: "آیا عکس‌های من آپلود می‌شوند؟",
            a: "نه، فشرده‌سازی کاملاً در مرورگر انجام می‌شود و عکس‌ها از دستگاه شما بیرون نمی‌روند.",
          },
          {
            q: "آیا در این حجم PNG را نگه دارم؟",
            a: "برای عکس‌ها JPG یا WebP را انتخاب کنید تا از بودجهٔ ۵۰۰ کیلوبایتی بیشترین بهره را ببرید؛ PNG را برای گرافیکی نگه دارید که شفافیت لازم دارد.",
          },
        ],
        steps: [
          "تصویری را که باید زیر ۵۰۰ کیلوبایت برود بارگذاری کنید.",
          "۵۰۰ کیلوبایت را به‌عنوان حجم هدف تعیین کنید.",
          "بگذارید ابزار کیفیت و در صورت نیاز ابعاد را کم کند.",
          "تصویر بهینه‌شده را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "이미지를 500KB 이하로 줄이는 일은 엄격한 사이트 규정이라기보다 예의와 성능의 문제에 가깝습니다. 이메일에 첨부하는 이미지라면 받는 사람의 편지함을 막지 않도록 지킬 만한 상한이고, 선명해 보이면서도 페이지 로딩을 늦추지 않아야 하는 웹 히어로나 배너 이미지에도 알맞은 용량입니다. 이 도구는 JPG, PNG, WebP를 로컬에서 500KB 가까이로 압축합니다.\n\n목표를 500KB로 두면 먼저 품질을 낮추고, 꼭 필요할 때만 해상도를 줄입니다. 반 메가바이트면 가로 폭이 넓은 사진도 고해상도 화면에서 깔끔하게 보이고, 휴대폰 카메라가 만드는 수 MB의 군더더기는 덜어낼 수 있습니다.\n\n업로드가 없으므로 히어로 이미지나 이메일용 사진을 비공개로 준비하고, 용량이 마음에 들 때까지 몇 번이고 다시 돌려 볼 수 있습니다.",
        faq: [
          {
            q: "왜 500KB를 목표로 하나요?",
            a: "이메일 첨부가 예의 바르고 편지함에 부담이 없으며, 선명해야 하는 웹 히어로나 배너 이미지로도 적당한 무게입니다.",
          },
          {
            q: "500KB 히어로 이미지가 큰 화면에서도 괜찮아 보이나요?",
            a: "네. 이 정도 용량이면 가로로 넓은 사진도 고해상도 디스플레이에서 깔끔하게 보이고, 원본보다 훨씬 빠르게 로딩됩니다.",
          },
          {
            q: "정확히 500KB가 되나요?",
            a: "품질을 낮추고 그다음 해상도를 줄이는 방식으로 목표에 가깝게 맞추는 최선형 방식이므로, 정확히 500KB가 아니라 근처 값이 나옵니다.",
          },
          {
            q: "내 이미지가 업로드되나요?",
            a: "아니요. 압축은 전부 브라우저 안에서 이루어지므로 사진이 기기 밖으로 나가지 않습니다.",
          },
          {
            q: "이 크기에서도 PNG를 유지해야 하나요?",
            a: "사진은 JPG나 WebP로 하면 500KB 용량을 가장 잘 활용할 수 있습니다. PNG는 투명도가 필요한 그래픽에만 쓰세요.",
          },
        ],
        steps: [
          "500KB 이하로 만들 이미지를 올립니다.",
          "목표 크기를 500KB로 설정합니다.",
          "도구가 품질을 낮추고, 필요하면 해상도도 줄이도록 둡니다.",
          "최적화된 이미지를 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "500 KB không hẳn là quy định cứng của một cổng nào, mà thiên về phép lịch sự và hiệu năng: đó là mức trần hợp lý cho ảnh đính kèm email để không làm đầy hộp thư của người nhận, và là ngân sách vững cho ảnh hero hoặc banner trên web, vốn phải sắc nét mà không kéo chậm tốc độ tải trang. Công cụ này nén ảnh JPG, PNG hoặc WebP về gần 500 KB ngay trên máy bạn.\n\nHãy đặt mục tiêu 500 KB; công cụ sẽ hạ chất lượng trước, rồi chỉ giảm kích thước khi thật cần. Nửa megabyte đủ để một tấm ảnh rộng, tràn khung vẫn trông sạch trên màn hình độ phân giải cao, đồng thời cắt bớt phần dung lượng phình ra vài megabyte mà camera điện thoại tạo ra.\n\nKhông có gì được tải lên, nên bạn có thể chuẩn bị ảnh hero hay ảnh gửi email một cách riêng tư và chạy lại cho đến khi dung lượng vừa ý.",
        faq: [
          {
            q: "Vì sao nên nhắm tới 500 KB?",
            a: "Mức này giữ cho tệp đính kèm email lịch sự, không nặng hộp thư, và là trọng lượng lành mạnh cho ảnh hero hoặc banner web vẫn cần sắc nét.",
          },
          {
            q: "Ảnh hero 500 KB có đẹp trên màn hình lớn không?",
            a: "Có. Ở mức này, ảnh rộng vẫn sạch trên màn hình độ phân giải cao mà tải nhanh hơn bản gốc nhiều.",
          },
          {
            q: "Công cụ có đạt đúng 500 KB không?",
            a: "Công cụ nén dần tới mục tiêu (chất lượng rồi tới kích thước) theo kiểu cố gắng hết sức, nên hãy kỳ vọng kết quả gần chứ không chính xác bằng 500 KB.",
          },
          {
            q: "Ảnh của tôi có bị tải lên không?",
            a: "Không, việc nén diễn ra hoàn toàn trong trình duyệt nên ảnh không rời khỏi thiết bị của bạn.",
          },
          {
            q: "Với dung lượng này có nên giữ PNG không?",
            a: "Hãy dùng JPG hoặc WebP cho ảnh chụp để tận dụng tốt nhất ngân sách 500 KB; chỉ để PNG cho đồ hoạ cần nền trong suốt.",
          },
        ],
        steps: [
          "Tải lên ảnh bạn muốn đưa xuống dưới 500 KB.",
          "Đặt 500 KB làm kích thước mục tiêu.",
          "Để công cụ hạ chất lượng và, nếu cần, giảm kích thước.",
          "Tải ảnh đã tối ưu xuống.",
        ],
      },
      tr: {
        intro:
          "500 KB, sert bir portal kuralından çok nezaket ve performansla ilgilidir: e-postaya eklediğiniz bir görsel için, karşı tarafın gelen kutusunu tıkamamak adına mantıklı bir üst sınırdır; sayfa yüklenme hızını düşürmeden net görünmesi gereken bir web kahraman (hero) veya afiş görseli için de sağlam bir bütçedir. Bu araç JPG, PNG veya WebP dosyasını yerelde 500 KB'a doğru sıkıştırır.\n\n500 KB hedefini verin; araç önce kaliteyi, gerekirse sonra boyutları düşürür. Yarım megabayt, geniş ve tam genişlikte bir fotoğrafın yüksek çözünürlüklü ekranlarda temiz görünmesi için yeterlidir; telefon kameralarının ürettiği çok megabaytlık şişkinliği de keser.\n\nHiçbir şey yüklenmediği için hero görsellerini ya da e-posta fotoğraflarını gizlice hazırlayabilir, boyut size uygun gelene kadar yeniden çalıştırabilirsiniz.",
        faq: [
          {
            q: "Neden 500 KB hedeflemeliyim?",
            a: "E-posta eklerini kibar ve gelen kutusu dostu tutar; ayrıca hâlâ keskin görünmesi gereken bir web hero veya afiş görseli için sağlıklı bir ağırlıktır.",
          },
          {
            q: "500 KB'lık bir hero görseli büyük ekranda iyi görünür mü?",
            a: "Evet. Bu bütçede geniş bir fotoğraf, yüksek çözünürlüklü ekranlarda temiz kalırken orijinalden çok daha hızlı yüklenir.",
          },
          {
            q: "Tam 500 KB'a ulaşıyor mu?",
            a: "Hedefe (önce kalite, sonra boyut) elinden gelenin en iyisiyle yaklaşır; yani tam 500 KB değil, civarında bir sonuç bekleyin.",
          },
          {
            q: "Görsellerim yükleniyor mu?",
            a: "Hayır, sıkıştırma tamamen tarayıcıda yapılır; fotoğraflarınız cihazınızdan çıkmaz.",
          },
          {
            q: "Bu boyutta PNG'yi korumalı mıyım?",
            a: "500 KB bütçesinden en iyi şekilde yararlanmak için fotoğraflarda JPG veya WebP kullanın; PNG'yi saydamlık gereken grafiklere saklayın.",
          },
        ],
        steps: [
          "500 KB altına indirmek istediğiniz görseli yükleyin.",
          "Hedef boyut olarak 500 KB'ı belirleyin.",
          "Aracın kaliteyi ve gerekirse boyutları düşürmesine izin verin.",
          "Optimize edilmiş görseli indirin.",
        ],
      },
    },
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
    extra: {
      ru: {
        intro:
          "Сжать фото до 1 МБ — практичный вариант для повседневной отправки: с запасом укладывается в лимиты вложений распространённых почтовых сервисов и достаточно мало, чтобы мессенджеры отправляли файл мгновенно, не портя его собственным дополнительным сжатием. Инструмент сжимает JPG, PNG или WebP примерно до 1 МБ прямо в браузере.\n\nПри цели в 1 МБ обычный снимок почти не приходится трогать: качество снижается мягко, а размеры уменьшаются, только если оригинал огромный. Так вы сохраняете детали, близкие к исходным, и избавляетесь от лишнего веса, который современные камеры телефонов закладывают в каждый кадр.\n\nМессенджеры часто пережимают всё, что вы отправляете, поэтому если отдать им аккуратный файл в 1 МБ заранее, итоговое качество вы контролируете лучше, чем если позволить приложению «раздавить» оригинал в 10 МБ.",
        faq: [
          {
            q: "Зачем сжимать до 1 МБ?",
            a: "Такой размер с запасом укладывается в лимиты вложений распространённых почтовых сервисов и позволяет мессенджерам быстро отправить изображение без сильного повторного сжатия.",
          },
          {
            q: "Сильно ли упадёт качество при 1 МБ?",
            a: "Для обычного фото очень незначительно — 1 МБ это щедрый размер, поэтому детали остаются близкими к оригиналу.",
          },
          {
            q: "Почему просто не отправить оригинал?",
            a: "Фото с телефона часто весят несколько мегабайт; версия в 1 МБ отправляется быстрее и даёт вам контроль до того, как мессенджер всё равно пережмёт файл.",
          },
          {
            q: "Загружаются ли файлы на сервер?",
            a: "Нет — всё происходит локально в вашем браузере.",
          },
          {
            q: "Какие форматы поддерживаются?",
            a: "JPG, PNG и WebP. JPG и WebP дают самые маленькие фотографии при такой цели.",
          },
        ],
        steps: [
          "Загрузите изображение, которое нужно сжать примерно до 1 МБ.",
          "Укажите 1 МБ как целевой размер.",
          "Пусть инструмент мягко снизит качество и, если нужно, размеры.",
          "Скачайте сжатое изображение.",
        ],
      },
      fa: {
        intro:
          "اگر می‌خواهید عکس را به ۱ مگابایت برسانید، این حجم محدودهٔ آسودهٔ عملی برای ارسال روزمره است: با فاصله زیر سقف پیوست ایمیل‌های رایج می‌ماند و آن‌قدر کوچک است که پیام‌رسان‌ها بدون خراب کردن آن با فشرده‌سازی اضافهٔ خودشان فوری بفرستندش. این ابزار فایل JPG، PNG یا WebP را در مرورگر به حدود ۱ مگابایت می‌رساند.\n\nبا هدف ۱ مگابایت، ابزار به یک عکس معمولی تقریباً دست نمی‌زند؛ کیفیت را ملایم پایین می‌آورد و ابعاد را فقط وقتی کم می‌کند که فایل اصلی بسیار بزرگ باشد. یعنی جزئیات نزدیک به اصل را نگه می‌دارید و حجم بی‌مصرفی را که دوربین گوشی‌های امروزی در هر عکس می‌گذارند کنار می‌گذارید.\n\nچون پیام‌رسان‌ها معمولاً هر چه بفرستید دوباره فشرده می‌کنند، دادن فایل مرتب ۱ مگابایتی از پیش، کنترل بیشتری روی کیفیت نهایی به شما می‌دهد تا اینکه بگذارید برنامه یک فایل اصلی ۱۰ مگابایتی را خرد کند.",
        faq: [
          {
            q: "چرا فشرده‌سازی تا ۱ مگابایت؟",
            a: "با راحتی زیر سقف پیوست ایمیل‌های رایج جا می‌شود و به برنامه‌های چت اجازه می‌دهد تصویر را سریع و بدون فشرده‌سازی مجدد سنگین بفرستند.",
          },
          {
            q: "آیا در ۱ مگابایت کیفیت زیادی از دست می‌رود؟",
            a: "برای یک عکس معمولی بسیار کم — ۱ مگابایت حجم سخاوتمندانه‌ای است و جزئیات نزدیک به اصل می‌ماند.",
          },
          {
            q: "چرا همان فایل اصلی را نفرستم؟",
            a: "عکس‌های گوشی اغلب چند مگابایت‌اند؛ نسخهٔ ۱ مگابایتی سریع‌تر ارسال می‌شود و پیش از آنکه پیام‌رسان به هر حال دوباره فشرده‌اش کند، کنترل را به شما می‌دهد.",
          },
          {
            q: "آیا فایل‌ها آپلود می‌شوند؟",
            a: "نه — همه‌چیز به‌صورت محلی در مرورگر شما انجام می‌شود.",
          },
          {
            q: "چه فرمت‌هایی پشتیبانی می‌شود؟",
            a: "JPG، PNG و WebP. در این هدف، JPG و WebP کوچک‌ترین عکس‌ها را می‌دهند.",
          },
        ],
        steps: [
          "تصویری را که باید حدود ۱ مگابایت شود بارگذاری کنید.",
          "۱ مگابایت را به‌عنوان حجم هدف تعیین کنید.",
          "بگذارید ابزار کیفیت را ملایم پایین بیاورد و در صورت نیاز ابعاد را کم کند.",
          "تصویر فشرده‌شده را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "이미지 압축 1MB는 일상적인 공유에 가장 무난한 크기입니다. 흔히 쓰는 이메일 서비스의 첨부 용량 제한에 넉넉히 들어가고, 메신저가 자체 재압축으로 화질을 더 망치지 않고 바로 보낼 수 있을 만큼 작습니다. 이 도구는 JPG, PNG, WebP를 브라우저에서 약 1MB로 줄여 줍니다.\n\n목표가 1MB라면 일반적인 사진은 거의 건드릴 필요가 없습니다. 품질을 조금만 낮추고, 원본이 아주 클 때만 해상도를 줄입니다. 그래서 원본에 가까운 디테일을 유지하면서, 요즘 휴대폰 카메라가 사진마다 얹어 놓는 불필요한 용량만 덜어낼 수 있습니다.\n\n메신저는 보낸 사진을 다시 압축하는 경우가 많습니다. 미리 1MB로 깔끔하게 줄여서 보내면, 10MB 원본을 앱이 알아서 뭉개 버리게 두는 것보다 최종 화질을 더 잘 관리할 수 있습니다.",
        faq: [
          {
            q: "왜 1MB로 압축하나요?",
            a: "흔히 쓰는 이메일 서비스의 첨부 용량 제한에 여유 있게 들어가고, 채팅 앱이 심한 재압축 없이 이미지를 빠르게 보낼 수 있습니다.",
          },
          {
            q: "1MB로 줄이면 화질이 많이 떨어지나요?",
            a: "일반적인 사진이라면 거의 차이가 없습니다. 1MB는 넉넉한 크기여서 디테일이 원본에 가깝게 유지됩니다.",
          },
          {
            q: "그냥 원본을 보내면 안 되나요?",
            a: "휴대폰 사진은 수 MB인 경우가 많습니다. 1MB 버전은 더 빨리 전송되고, 어차피 채팅 앱이 다시 압축하기 전에 화질을 직접 관리할 수 있습니다.",
          },
          {
            q: "파일이 업로드되나요?",
            a: "아니요. 모든 작업이 브라우저 안에서 로컬로 이루어집니다.",
          },
          {
            q: "어떤 형식을 지원하나요?",
            a: "JPG, PNG, WebP를 지원합니다. 이 목표 크기에서는 JPG와 WebP가 사진을 가장 작게 만듭니다.",
          },
        ],
        steps: [
          "약 1MB로 줄이고 싶은 이미지를 올립니다.",
          "목표 크기를 1MB로 설정합니다.",
          "도구가 품질을 살짝 낮추고, 필요하면 해상도도 줄이도록 둡니다.",
          "압축된 이미지를 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "Muốn nén ảnh xuống 1MB thì đây là mức dễ chịu nhất cho việc chia sẻ hằng ngày: nằm gọn trong giới hạn tệp đính kèm của các dịch vụ email phổ biến, và đủ nhỏ để ứng dụng chat gửi ngay mà không phải nén lại thêm làm hỏng ảnh. Công cụ này nén ảnh JPG, PNG hoặc WebP xuống khoảng 1 MB ngay trong trình duyệt.\n\nVới mục tiêu 1 MB, bộ nén gần như không phải động tới một tấm ảnh thông thường: chỉ hạ chất lượng nhẹ nhàng và chỉ thu nhỏ kích thước nếu ảnh gốc quá lớn. Nhờ vậy bạn giữ được chi tiết gần như nguyên bản, chỉ bỏ đi phần dung lượng thừa mà camera điện thoại đời mới gắn vào mỗi tấm ảnh.\n\nVì các ứng dụng nhắn tin thường nén lại mọi thứ bạn gửi, đưa sẵn cho chúng một tệp 1 MB gọn gàng giúp bạn kiểm soát chất lượng cuối cùng tốt hơn là để ứng dụng nghiền nát một bản gốc 10 MB.",
        faq: [
          {
            q: "Vì sao nên nén xuống 1 MB?",
            a: "Mức này nằm thoải mái trong giới hạn tệp đính kèm của các dịch vụ email phổ biến và cho phép ứng dụng chat gửi ảnh nhanh mà không phải nén lại nhiều.",
          },
          {
            q: "Ở 1 MB tôi có mất nhiều chất lượng không?",
            a: "Rất ít với một tấm ảnh bình thường. 1 MB là khá rộng rãi nên chi tiết vẫn gần với bản gốc.",
          },
          {
            q: "Sao không gửi luôn bản gốc?",
            a: "Ảnh chụp từ điện thoại thường nặng vài megabyte; bản 1 MB gửi nhanh hơn và cho bạn quyền kiểm soát trước khi ứng dụng chat dù sao cũng nén lại.",
          },
          {
            q: "Tệp có bị tải lên không?",
            a: "Không, mọi thứ diễn ra cục bộ ngay trong trình duyệt của bạn.",
          },
          {
            q: "Hỗ trợ những định dạng nào?",
            a: "JPG, PNG và WebP. JPG và WebP cho ảnh nhỏ nhất ở mức mục tiêu này.",
          },
        ],
        steps: [
          "Tải lên ảnh bạn muốn đưa về khoảng 1 MB.",
          "Đặt 1 MB làm kích thước mục tiêu.",
          "Để công cụ hạ chất lượng nhẹ nhàng và, nếu cần, giảm kích thước.",
          "Tải ảnh đã nén xuống.",
        ],
      },
      tr: {
        intro:
          "Fotoğrafı 1 MB'a küçült dediğinizde hedeflediğiniz boyut, günlük paylaşım için en rahat bölgedir: yaygın e-posta sağlayıcılarının ek sınırlarının rahatça altında kalır ve sohbet uygulamalarının kendi yeniden sıkıştırması fotoğrafı daha da bozmadan anında gönderebileceği kadar küçüktür. Bu araç JPG, PNG veya WebP dosyasını tarayıcıda yaklaşık 1 MB'a indirir.\n\n1 MB hedefinde sıkıştırıcının tipik bir fotoğrafa neredeyse hiç dokunması gerekmez: kaliteyi hafifçe düşürür ve boyutları yalnızca orijinal çok büyükse küçültür. Böylece orijinale yakın ayrıntıyı korurken modern telefon kameralarının her kareye eklediği gereksiz yükten kurtulursunuz.\n\nMesajlaşma uygulamaları gönderdiğiniz her şeyi sıklıkla yeniden sıkıştırdığı için onlara baştan derli toplu bir 1 MB dosya vermek, uygulamanın 10 MB'lık bir orijinali ezmesine izin vermekten daha fazla kontrol sağlar.",
        faq: [
          {
            q: "Neden 1 MB'a sıkıştırmalıyım?",
            a: "Yaygın e-posta sağlayıcılarının ek sınırlarının rahatça altında kalır ve sohbet uygulamalarının görseli ağır bir yeniden sıkıştırma olmadan hızla göndermesine izin verir.",
          },
          {
            q: "1 MB'ta çok kalite kaybeder miyim?",
            a: "Normal bir fotoğrafta çok az. 1 MB cömert bir boyut olduğu için ayrıntı orijinale yakın kalır.",
          },
          {
            q: "Neden orijinali göndermeyeyim?",
            a: "Telefon fotoğrafları çoğu zaman birkaç megabayttır; 1 MB'lık sürüm daha hızlı gider ve sohbet uygulaması onu zaten yeniden sıkıştırmadan önce size kontrol verir.",
          },
          {
            q: "Dosyalar yükleniyor mu?",
            a: "Hayır, her şey tarayıcınızda yerel olarak gerçekleşir.",
          },
          {
            q: "Hangi biçimler çalışır?",
            a: "JPG, PNG ve WebP. Bu hedefte en küçük fotoğrafları JPG ve WebP verir.",
          },
        ],
        steps: [
          "1 MB civarına indirmek istediğiniz görseli yükleyin.",
          "Hedef boyut olarak 1 MB'ı belirleyin.",
          "Aracın kaliteyi hafifçe düşürmesine ve gerekirse boyutları küçültmesine izin verin.",
          "Sıkıştırılmış görseli indirin.",
        ],
      },
    },
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
    extra: {
      ru: {
        intro:
          "Начиная с iOS 11 iPhone и iPad по умолчанию сохраняют фото в HEIC — современном формате, который экономит место. Проблема появляется, когда эти снимки нужно использовать где-то ещё: многие сайты, формы загрузки, старые приложения для Windows и коллеги с устройствами не от Apple просто не могут открыть файл .heic. Конвертация HEIC в JPG превращает фото в формат, понятный всем.\n\nЭтот инструмент декодирует HEIC локально с помощью декодера, работающего в браузере и кодирует в JPG прямо в браузере — ваши фото никуда не загружаются. JPG совместим со всем и сохраняет умеренный размер файлов, а это именно то, что нужно для отправки, сервисов печати и загрузки на сайты.\n\nОдин честный компромисс: JPG — формат с потерями, поэтому при конвертации изображение пересжимается и не будет побитовой копией оригинала HEIC. Для обычных фото разница незаметна; если нужен результат без потерь или с прозрачностью, конвертируйте в PNG.",
        faq: [
          {
            q: "Почему фото с iPhone сохраняются в HEIC?",
            a: "Начиная с iOS 11 Apple по умолчанию использует HEIC, потому что при сопоставимом качестве он занимает на диске меньше места, чем JPG.",
          },
          {
            q: "Зачем конвертировать HEIC в JPG?",
            a: "JPG открывается везде — на сайтах, в формах загрузки, в приложениях Windows и на устройствах не от Apple, а HEIC часто отклоняется или не читается.",
          },
          {
            q: "Теряется ли качество при конвертации в JPG?",
            a: "JPG — формат с потерями, поэтому фото пересжимается; для обычных снимков изменение, как правило, незаметно. Если нужен результат без потерь, выберите PNG.",
          },
          {
            q: "Загружаются ли мои фото на сервер?",
            a: "Нет. HEIC декодируется и кодируется обратно целиком в вашем браузере.",
          },
          {
            q: "Можно ли конвертировать сразу несколько фото?",
            a: "Нет — инструмент конвертирует по одному фото за раз. Когда одно готово, скачайте его и загрузите следующее.",
          },
        ],
        steps: [
          "Загрузите фото в формате HEIC.",
          "Инструмент локально декодирует его с помощью декодера, работающего в браузере.",
          "Фото кодируется в JPG прямо в браузере.",
          "Скачайте готовый файл JPG.",
        ],
      },
      fa: {
        intro:
          "از iOS 11 به بعد، آیفون و آیپد عکس‌ها را به‌طور پیش‌فرض با فرمت HEIC ذخیره می‌کنند؛ فرمتی مدرن که فضا را صرفه‌جویی می‌کند. مشکل وقتی پیش می‌آید که بخواهید همین عکس‌ها را جای دیگری استفاده کنید: بسیاری از سایت‌ها، فرم‌های آپلود، برنامه‌های قدیمی ویندوز و همکارانی که دستگاه غیر اپل دارند نمی‌توانند فایل ‎.heic را باز کنند. تبدیل HEIC به JPG عکس شما را به فرمتی در می‌آورد که همه‌چیز آن را می‌شناسد.\n\nاین ابزار HEIC را محلی با یک رمزگشای HEIC که در مرورگر اجرا می‌شود باز می‌کند و مستقیم در مرورگر به JPG برمی‌گرداند — عکس‌های شما هرگز آپلود نمی‌شوند. JPG با همه‌چیز سازگار است و حجم فایل را نسبتاً کم نگه می‌دارد؛ دقیقاً چیزی که برای اشتراک‌گذاری، خدمات چاپ و آپلود در وب لازم دارید.\n\nیک مصالحهٔ صادقانه: JPG فرمت با افت کیفیت است، پس تبدیل عکس را دوباره فشرده می‌کند و کپی پیکسل‌به‌پیکسل HEIC اصلی نخواهد بود. برای عکس‌های روزمره تفاوت دیده نمی‌شود؛ اگر خروجی بدون افت یا شفافیت می‌خواهید، به PNG تبدیل کنید.",
        faq: [
          {
            q: "چرا عکس‌های آیفونم با فرمت HEIC ذخیره می‌شوند؟",
            a: "از iOS 11 اپل HEIC را پیش‌فرض کرده است، چون عکس را با کیفیتی نزدیک به JPG در فضای کمتری ذخیره می‌کند.",
          },
          {
            q: "چرا HEIC را به JPG تبدیل کنم؟",
            a: "JPG همه‌جا باز می‌شود — سایت‌ها، فرم‌های آپلود، برنامه‌های ویندوز و دستگاه‌های غیر اپل — در حالی که HEIC اغلب رد می‌شود یا خوانده نمی‌شود.",
          },
          {
            q: "آیا تبدیل به JPG کیفیت را کم می‌کند؟",
            a: "JPG فرمت با افت کیفیت است و عکس را دوباره فشرده می‌کند؛ برای عکس‌های معمولی معمولاً تغییر دیده نمی‌شود. اگر خروجی بدون افت می‌خواهید PNG را انتخاب کنید.",
          },
          {
            q: "آیا عکس‌های من آپلود می‌شوند؟",
            a: "نه. رمزگشایی HEIC و کدگذاری دوباره کاملاً در مرورگر شما انجام می‌شود.",
          },
          {
            q: "آیا می‌توانم چند عکس را یک‌جا تبدیل کنم؟",
            a: "نه — این ابزار هر بار یک عکس را تبدیل می‌کند. وقتی یکی تمام شد، دانلودش کنید و عکس بعدی را بارگذاری کنید.",
          },
        ],
        steps: [
          "یک عکس HEIC را بارگذاری کنید.",
          "ابزار آن را محلی با رمزگشایی که در مرورگر اجرا می‌شود باز می‌کند.",
          "عکس را در مرورگر شما به JPG برمی‌گرداند.",
          "فایل JPG تبدیل‌شده را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "iOS 11부터 iPhone과 iPad는 사진을 기본으로 HEIC로 저장합니다. 공간을 아끼는 최신 형식이죠. 문제는 그 사진을 다른 곳에 써야 할 때 생깁니다. 많은 웹사이트, 업로드 양식, 오래된 Windows 프로그램, Apple 기기가 아닌 동료의 컴퓨터에서는 .heic 파일을 열지 못합니다. HEIC JPG 변환을 하면 사진이 어디서나 통하는 형식으로 바뀝니다.\n\n이 도구는 브라우저에서 실행되는 HEIC 디코더로 HEIC를 로컬에서 해독하고 브라우저 안에서 JPG로 다시 인코딩합니다. 사진은 업로드되지 않습니다. JPG는 어디서나 호환되고 파일 크기도 적당해서 공유, 인화 서비스, 웹 업로드에 딱 맞습니다.\n\n한 가지 솔직한 단점이 있습니다. JPG는 손실 압축이라 변환 과정에서 이미지가 다시 압축되며, HEIC 원본과 픽셀 단위로 같은 사본은 아닙니다. 일상적인 사진에서는 차이가 보이지 않지만, 무손실 결과나 투명도가 필요하다면 PNG로 변환하세요.",
        faq: [
          {
            q: "아이폰 사진이 왜 HEIC로 저장되나요?",
            a: "iOS 11부터 Apple이 HEIC를 기본값으로 쓰기 때문입니다. 비슷한 화질에서 JPG보다 적은 공간에 사진을 저장할 수 있습니다.",
          },
          {
            q: "HEIC를 JPG로 바꿔야 하는 이유는 무엇인가요?",
            a: "JPG는 웹사이트, 업로드 양식, Windows 프로그램, Apple 이외의 기기 어디서나 열리지만, HEIC는 거부되거나 열리지 않는 경우가 많습니다.",
          },
          {
            q: "JPG로 변환하면 화질이 떨어지나요?",
            a: "JPG는 손실 압축이라 사진이 다시 압축됩니다. 일반적인 사진에서는 대개 차이가 보이지 않습니다. 무손실 결과가 필요하면 PNG를 고르세요.",
          },
          {
            q: "내 사진이 업로드되나요?",
            a: "아니요. HEIC 해독과 재인코딩이 전부 브라우저 안에서 이루어집니다.",
          },
          {
            q: "여러 장을 한 번에 변환할 수 있나요?",
            a: "아니요, 한 번에 사진 한 장씩 변환합니다. 한 장이 끝나면 다운로드한 뒤 다음 사진을 올리세요.",
          },
        ],
        steps: [
          "HEIC 사진을 올립니다.",
          "도구가 브라우저에서 실행되는 HEIC 디코더로 사진을 로컬에서 해독합니다.",
          "사진을 브라우저에서 JPG로 다시 인코딩합니다.",
          "변환된 JPG 파일을 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "Từ iOS 11, iPhone và iPad lưu ảnh mặc định ở dạng HEIC, một định dạng hiện đại giúp tiết kiệm dung lượng. Rắc rối xuất hiện ngay khi bạn dùng những ảnh đó ở nơi khác: nhiều trang web, biểu mẫu tải lên, ứng dụng Windows cũ và đồng nghiệp dùng thiết bị không phải của Apple đơn giản là không mở được tệp .heic. Chuyển HEIC sang JPG biến ảnh của bạn thành định dạng mà mọi thứ đều hiểu.\n\nCông cụ này giải mã HEIC ngay trên máy bằng bộ giải mã HEIC chạy ngay trong trình duyệt rồi mã hoá lại thành JPG ngay trong trình duyệt, nên ảnh không bao giờ bị tải lên. JPG tương thích với mọi thứ và giữ tệp ở mức nhỏ vừa phải, đúng thứ bạn cần để chia sẻ, đi in ảnh và tải lên web.\n\nMột đánh đổi cần nói thẳng: JPG là định dạng nén có mất dữ liệu, nên việc chuyển đổi nén lại ảnh và không phải bản sao giống từng điểm ảnh với bản HEIC gốc. Với ảnh hằng ngày, sự khác biệt không thể thấy; nếu bạn cần kết quả không mất dữ liệu hoặc có độ trong suốt, hãy chuyển sang PNG.",
        faq: [
          {
            q: "Vì sao ảnh iPhone của tôi lại là HEIC?",
            a: "Từ iOS 11, Apple dùng HEIC làm mặc định vì nó lưu ảnh trong ít dung lượng hơn JPG ở chất lượng tương đương.",
          },
          {
            q: "Vì sao nên chuyển HEIC sang JPG?",
            a: "JPG mở được ở mọi nơi, từ trang web, biểu mẫu tải lên, ứng dụng Windows đến thiết bị không phải của Apple, trong khi HEIC thường bị từ chối hoặc không đọc được.",
          },
          {
            q: "Chuyển sang JPG có làm giảm chất lượng không?",
            a: "JPG là định dạng mất dữ liệu nên ảnh bị nén lại; với ảnh thông thường, thay đổi này thường không nhìn thấy được. Hãy chọn PNG nếu bạn cần kết quả không mất dữ liệu.",
          },
          {
            q: "Ảnh của tôi có bị tải lên không?",
            a: "Không. HEIC được giải mã và mã hoá lại hoàn toàn trong trình duyệt của bạn.",
          },
          {
            q: "Tôi có thể chuyển nhiều ảnh cùng lúc không?",
            a: "Không, công cụ chuyển từng ảnh một. Khi xong một ảnh, hãy tải xuống rồi tải ảnh tiếp theo lên.",
          },
        ],
        steps: [
          "Tải lên một ảnh HEIC.",
          "Công cụ giải mã ảnh ngay trên máy bằng bộ giải mã HEIC chạy ngay trong trình duyệt.",
          "Ảnh được mã hoá lại thành JPG ngay trong trình duyệt.",
          "Tải tệp JPG đã chuyển đổi xuống.",
        ],
      },
      tr: {
        intro:
          "iOS 11'den beri iPhone ve iPad'ler fotoğrafları varsayılan olarak HEIC biçiminde kaydeder; yer kazandıran modern bir biçimdir. Sorun, bu fotoğrafları başka bir yerde kullanmaya kalktığınız anda çıkar: pek çok web sitesi, yükleme formu, eski Windows uygulaması ve Apple dışı cihaz kullanan iş arkadaşlarınız .heic dosyasını açamaz. HEIC'i JPG'ye dönüştürmek fotoğrafınızı her şeyin anladığı biçime çevirir.\n\nBu araç HEIC'i yerelde tarayıcıda çalışan bir kod çözücüyle çözer ve doğrudan tarayıcınızda JPG olarak yeniden kodlar; fotoğraflarınız asla yüklenmez. JPG her yerle uyumludur ve dosyaları makul ölçüde küçük tutar; paylaşım, baskı hizmetleri ve web yüklemeleri için tam istediğiniz şey budur.\n\nDürüst bir ödünleşim: JPG kayıplıdır, bu yüzden dönüştürme görseli yeniden sıkıştırır ve HEIC orijinalinin piksel piksel aynı kopyası olmaz. Günlük fotoğraflarda fark görünmez; kayıpsız çıktı ya da saydamlık gerekiyorsa bunun yerine PNG'ye dönüştürün.",
        faq: [
          {
            q: "iPhone fotoğraflarım neden HEIC olarak görünüyor?",
            a: "iOS 11'den beri Apple, fotoğrafı benzer kalitede JPG'den daha az yerde sakladığı için HEIC'i varsayılan olarak kullanıyor.",
          },
          {
            q: "HEIC'i neden JPG'ye dönüştürmeliyim?",
            a: "JPG web siteleri, yükleme formları, Windows uygulamaları ve Apple dışı cihazlar dahil her yerde açılır; HEIC ise çoğu zaman reddedilir ya da okunamaz.",
          },
          {
            q: "JPG'ye dönüştürmek kaliteyi düşürür mü?",
            a: "JPG kayıplıdır, bu yüzden fotoğraf yeniden sıkıştırılır; normal fotoğraflarda değişiklik genellikle görünmez. Kayıpsız çıktı gerekiyorsa PNG'yi seçin.",
          },
          {
            q: "Fotoğraflarım yükleniyor mu?",
            a: "Hayır. HEIC'in çözülmesi ve yeniden kodlanması tamamen tarayıcınızda yapılır.",
          },
          {
            q: "Aynı anda birkaç fotoğrafı dönüştürebilir miyim?",
            a: "Hayır, bir seferde tek fotoğraf dönüştürür. Biri bitince indirin ve sıradakini bırakın.",
          },
        ],
        steps: [
          "Bir HEIC fotoğrafı yükleyin.",
          "Araç fotoğrafı yerelde tarayıcıda çalışan bir kod çözücüyle çözer.",
          "Fotoğrafı tarayıcınızda JPG olarak yeniden kodlar.",
          "Dönüştürülen JPG dosyasını indirin.",
        ],
      },
    },
    en: {
      intro:
        "Since iOS 11, iPhones and iPads save photos as HEIC by default — a modern, space-saving format. The trouble shows up the moment you try to use those photos somewhere else: many websites, upload forms, older Windows apps, and colleagues on non-Apple devices simply can't open a .heic file. Converting to JPG turns your photo into the format everything understands.\n\nThis tool decodes HEIC locally using a HEIC decoder that runs in your browser and re-encodes to JPG right in your browser — your photos are never uploaded. JPG is universally compatible and keeps files reasonably small, which is exactly what you want for sharing, printing services, and web uploads.\n\nOne honest trade-off: JPG is lossy, so the conversion re-compresses the image and won't be a pixel-perfect copy of the HEIC original. For everyday photos the difference is invisible; if you need lossless output or transparency, convert to PNG instead.",
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
          a: "No. HEIC is decoded and re-encoded entirely in your browser using a HEIC decoder that runs in your browser.",
        },
        {
          q: "Can I convert several photos at once?",
          a: "No — it converts one photo at a time. When one is done, download it and drop in the next.",
        },
      ],
      steps: [
        "Upload a HEIC photo.",
        "The tool decodes it locally with a HEIC decoder that runs in your browser.",
        "It re-encodes the photo to JPG in your browser.",
        "Download the converted JPG file.",
      ],
    },
    ar: {
      intro:
        "منذ نظام iOS 11، تحفظ أجهزة آيفون وآيباد الصور بصيغة HEIC افتراضيًا — وهي صيغة حديثة موفّرة للمساحة. تظهر المشكلة لحظة محاولتك استخدام تلك الصور في مكان آخر: فكثير من المواقع ونماذج الرفع وبرامج ويندوز القديمة والزملاء على أجهزة غير آبل لا يستطيعون ببساطة فتح ملف ‎.heic. والتحويل إلى JPG يجعل صورتك بالصيغة التي يفهمها كل شيء.\n\nتفكّ هذه الأداة ترميز HEIC محليًا عبر مفكّك ترميز يعمل داخل متصفحك وتعيد الترميز إلى JPG داخل متصفحك مباشرة — فلا تُرفع صورك أبدًا. وJPG متوافقة عالميًا وتبقي الملفات صغيرة نسبيًا، وهو تمامًا ما تريده للمشاركة وخدمات الطباعة والرفع على الويب.\n\nمقايضة واحدة بصدق: JPG صيغة فاقدة، فالتحويل يعيد ضغط الصورة ولن يكون نسخة مطابقة تمامًا لأصل HEIC. وللصور اليومية يكون الفرق غير مرئي؛ وإن احتجت خرجًا بلا فقد أو شفافية، فحوّل إلى PNG بدلًا من ذلك.",
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
          a: "لا. يُفكّ ترميز HEIC ويُعاد ترميزه بالكامل في متصفحك داخل متصفحك.",
        },
        {
          q: "هل يمكنني تحويل عدة صور دفعة واحدة؟",
          a: "لا — تحوّل الأداة صورة واحدة في كل مرة. بعد انتهاء الصورة نزّلها ثم أسقط التالية.",
        },
      ],
      steps: [
        "ارفع صورة HEIC.",
        "تفكّ الأداة ترميزها محليًا عبر مفكّك ترميز يعمل داخل متصفحك.",
        "تعيد ترميز الصورة إلى JPG في متصفحك.",
        "نزّل ملف JPG المحوّل.",
      ],
    },
  },

  "heic-to-png": {
    related: ["heic-to-jpg", "image-converter", "image-resizer"],
    extra: {
      ru: {
        intro:
          "HEIC — формат фото по умолчанию у Apple начиная с iOS 11, но когда нужна точная копия без потерь — скриншот с чётким текстом, изображение для дальнейшего редактирования или графика с прозрачным фоном, — сжатие JPG с потерями мешает. Если конвертировать HEIC в PNG, результат получится точным до пикселя.\n\nPNG — формат без потерь: он воспроизводит каждый пиксель в точности и поддерживает прозрачность, поэтому подходит для скриншотов, схем, логотипов и любых изображений, которые пойдут в дизайн или редактирование, где артефакты повторного сжатия накапливались бы. Инструмент декодирует HEIC с помощью декодера, работающего в браузере и записывает PNG целиком в вашем браузере, так что ничего не загружается на сервер.\n\nЦена — размер: PNG сохраняет все детали, поэтому файл обычно больше, чем оригинал HEIC или версия в JPG. Когда нужны именно точность или прозрачный фон, такой обмен оправдан; если нужно просто небольшое фото для отправки, конвертируйте HEIC в JPG.",
        faq: [
          {
            q: "Когда выбирать PNG вместо JPG для HEIC?",
            a: "Выбирайте PNG для скриншотов, графики, изображений, которые вы будете редактировать, и всего, что требует прозрачности: он без потерь и не добавляет артефактов сжатия.",
          },
          {
            q: "Действительно ли PNG без потерь?",
            a: "Да. PNG хранит каждый пиксель точно, поэтому преобразованное изображение совпадает с декодированным HEIC пиксель в пиксель.",
          },
          {
            q: "Почему PNG получился больше, чем HEIC?",
            a: "PNG сохраняет все детали, ничего не отбрасывая, поэтому фотографии становятся крупнее. Это цена качества без потерь.",
          },
          {
            q: "Сохраняет ли PNG прозрачность?",
            a: "Да. В отличие от JPG, PNG поддерживает альфа-канал для прозрачности.",
          },
          {
            q: "Загружаются ли мои файлы на сервер?",
            a: "Нет — декодирование и кодирование в PNG выполняются локально в вашем браузере.",
          },
        ],
        steps: [
          "Загрузите файл HEIC.",
          "Инструмент декодирует его с помощью декодера, работающего в браузере.",
          "В браузере создаётся PNG без потерь.",
          "Скачайте готовый файл PNG.",
        ],
      },
      fa: {
        intro:
          "HEIC از iOS 11 به بعد فرمت پیش‌فرض عکس در اپل بوده است، اما وقتی یک نسخهٔ دقیق و بدون افت می‌خواهید — اسکرین‌شات با متن واضح، تصویری که بعداً ویرایش می‌کنید یا طرحی با پس‌زمینهٔ شفاف — فشرده‌سازی با افت JPG مانع می‌شود. تبدیل HEIC به PNG به‌جای آن نتیجه‌ای وفادار به پیکسل می‌دهد.\n\nPNG بدون افت است: هر پیکسل را دقیقاً بازتولید می‌کند و از شفافیت پشتیبانی می‌کند؛ برای همین انتخاب درستی برای اسکرین‌شات، نمودار، لوگو و هر تصویری است که وارد کار طراحی یا ویرایش می‌شود و در آن آسیب‌های فشرده‌سازی مجدد روی هم جمع می‌شود. این ابزار HEIC را با رمزگشایی که در مرورگر اجرا می‌شود باز می‌کند و PNG را کاملاً در مرورگر شما می‌نویسد، پس چیزی آپلود نمی‌شود.\n\nبهای آن حجم است: چون PNG همهٔ جزئیات را نگه می‌دارد، فایل معمولاً از HEIC اصلی یا نسخهٔ JPG بزرگ‌تر است. وقتی دقیقاً به وفاداری یا پس‌زمینهٔ شفاف نیاز دارید این مبادله ارزشش را دارد؛ اگر فقط یک عکس کوچک برای ارسال می‌خواهید، HEIC را به JPG تبدیل کنید.",
        faq: [
          {
            q: "کی برای HEIC به‌جای JPG، PNG را انتخاب کنم؟",
            a: "PNG را برای اسکرین‌شات، گرافیک، تصویری که ویرایش می‌کنید یا هر چیزی که شفافیت می‌خواهد انتخاب کنید — بدون افت است و آثار فشرده‌سازی اضافه نمی‌کند.",
          },
          {
            q: "آیا PNG واقعاً بدون افت است؟",
            a: "بله. PNG هر پیکسل را دقیقاً ذخیره می‌کند، پس تصویر تبدیل‌شده پیکسل‌به‌پیکسل با HEIC رمزگشایی‌شده برابر است.",
          },
          {
            q: "چرا PNG من از HEIC بزرگ‌تر است؟",
            a: "PNG همهٔ جزئیات را نگه می‌دارد و چیزی دور نمی‌ریزد، پس عکس‌ها بزرگ‌تر می‌شوند. این بهای کیفیت بدون افت است.",
          },
          {
            q: "آیا PNG شفافیت را حفظ می‌کند؟",
            a: "بله. برخلاف JPG، فرمت PNG از کانال آلفا برای شفافیت پشتیبانی می‌کند.",
          },
          {
            q: "آیا فایل‌های من آپلود می‌شوند؟",
            a: "نه — رمزگشایی و کدگذاری PNG به‌صورت محلی در مرورگر شما انجام می‌شود.",
          },
        ],
        steps: [
          "یک فایل HEIC را بارگذاری کنید.",
          "ابزار آن را با رمزگشایی که در مرورگر اجرا می‌شود باز می‌کند.",
          "در مرورگر شما یک PNG بدون افت می‌نویسد.",
          "فایل PNG تبدیل‌شده را دانلود کنید.",
        ],
      },
      ko: {
        intro:
          "HEIC는 iOS 11부터 Apple의 기본 사진 형식이지만, 글자가 선명한 스크린샷이나 계속 편집할 이미지, 투명 배경이 있는 작업물처럼 정확한 무손실 사본이 필요할 때는 JPG의 손실 압축이 걸림돌이 됩니다. HEIC를 PNG로 변환하면 픽셀 그대로의 결과를 얻습니다.\n\nPNG는 무손실 형식이라 모든 픽셀을 그대로 재현하고 투명도도 지원합니다. 스크린샷, 다이어그램, 로고, 그리고 재압축으로 인한 열화가 쌓이면 곤란한 디자인과 편집 작업용 이미지에 알맞습니다. 이 도구는 브라우저에서 실행되는 HEIC 디코더로 HEIC를 해독해 브라우저 안에서 PNG를 만들기 때문에 아무것도 업로드되지 않습니다.\n\n대신 용량이 커집니다. PNG는 디테일을 모두 유지하므로 파일이 HEIC 원본이나 JPG 버전보다 커지는 경우가 많습니다. 충실도나 투명 배경이 꼭 필요할 때는 그만한 가치가 있지만, 그저 작고 공유하기 쉬운 사진이 필요하다면 JPG로 변환하세요.",
        faq: [
          {
            q: "HEIC를 변환할 때 JPG 대신 PNG를 고르는 경우는 언제인가요?",
            a: "스크린샷, 그래픽, 편집할 이미지, 투명도가 필요한 이미지라면 PNG를 고르세요. 무손실이라 압축 열화가 더해지지 않습니다.",
          },
          {
            q: "PNG는 정말 무손실인가요?",
            a: "네. PNG는 모든 픽셀을 그대로 저장하므로 변환된 이미지는 해독한 HEIC와 픽셀 단위로 일치합니다.",
          },
          {
            q: "PNG가 왜 HEIC보다 크죠?",
            a: "PNG는 디테일을 버리지 않고 모두 유지하기 때문에 사진 이미지는 파일이 커집니다. 무손실 품질의 대가입니다.",
          },
          {
            q: "PNG는 투명도를 유지하나요?",
            a: "네. PNG는 JPG와 달리 투명도를 위한 알파 채널을 지원합니다.",
          },
          {
            q: "파일이 업로드되나요?",
            a: "아니요. 해독과 PNG 인코딩이 브라우저 안에서 로컬로 이루어집니다.",
          },
        ],
        steps: [
          "HEIC 파일을 올립니다.",
          "도구가 브라우저에서 실행되는 HEIC 디코더로 해독합니다.",
          "브라우저 안에서 무손실 PNG로 만듭니다.",
          "변환된 PNG 파일을 다운로드합니다.",
        ],
      },
      vi: {
        intro:
          "HEIC là định dạng ảnh mặc định của Apple từ iOS 11, nhưng khi bạn cần một bản sao chính xác, không mất dữ liệu, chẳng hạn ảnh chụp màn hình có chữ sắc nét, ảnh sẽ tiếp tục chỉnh sửa hoặc ảnh có nền trong suốt, thì kiểu nén có mất dữ liệu của JPG sẽ gây cản trở. Chuyển HEIC sang PNG cho bạn kết quả trung thành đến từng điểm ảnh.\n\nPNG không làm mất dữ liệu: nó tái tạo chính xác từng điểm ảnh và hỗ trợ độ trong suốt, nên là lựa chọn đúng cho ảnh chụp màn hình, sơ đồ, logo và mọi ảnh đi vào quy trình thiết kế hay chỉnh sửa, nơi lỗi do nén lại sẽ tích tụ dần. Công cụ này giải mã HEIC bằng bộ giải mã HEIC chạy ngay trong trình duyệt và ghi ra PNG hoàn toàn trong trình duyệt, nên không có gì được tải lên.\n\nCái giá là dung lượng: vì PNG giữ toàn bộ chi tiết nên tệp thường lớn hơn bản HEIC gốc hoặc bản JPG. Khi bạn thật sự cần độ trung thực hoặc nền trong suốt, đó là một cuộc đổi đáng giá; còn nếu chỉ muốn một tấm ảnh nhỏ gọn, dễ chia sẻ, hãy chuyển sang JPG.",
        faq: [
          {
            q: "Khi nào nên chọn PNG thay vì JPG cho ảnh HEIC?",
            a: "Chọn PNG cho ảnh chụp màn hình, đồ hoạ, ảnh sẽ chỉnh sửa, hoặc bất cứ thứ gì cần độ trong suốt. PNG không làm mất dữ liệu và không thêm lỗi do nén.",
          },
          {
            q: "PNG có thật sự không mất dữ liệu không?",
            a: "Có. PNG lưu chính xác mọi điểm ảnh, nên ảnh sau khi chuyển khớp với ảnh HEIC đã giải mã từng điểm một.",
          },
          {
            q: "Vì sao PNG của tôi lại lớn hơn HEIC?",
            a: "PNG giữ toàn bộ chi tiết thay vì loại bỏ bất cứ thứ gì, nên ảnh chụp trở nên lớn hơn. Đó là cái giá của chất lượng không mất dữ liệu.",
          },
          {
            q: "PNG có giữ được độ trong suốt không?",
            a: "Có. PNG hỗ trợ kênh alpha cho độ trong suốt, khác với JPG.",
          },
          {
            q: "Tệp của tôi có bị tải lên không?",
            a: "Không, việc giải mã và mã hoá PNG diễn ra cục bộ trong trình duyệt của bạn.",
          },
        ],
        steps: [
          "Tải lên một tệp HEIC.",
          "Công cụ giải mã tệp bằng bộ giải mã HEIC chạy ngay trong trình duyệt.",
          "Công cụ ghi một tệp PNG không mất dữ liệu ngay trong trình duyệt.",
          "Tải tệp PNG đã chuyển đổi xuống.",
        ],
      },
      tr: {
        intro:
          "HEIC, iOS 11'den beri Apple'ın varsayılan fotoğraf biçimidir; ancak net metinli bir ekran görüntüsü, düzenlemeye devam edeceğiniz bir görsel ya da saydam arka planlı bir çalışma gibi birebir, kayıpsız bir kopya gerektiğinde JPG'nin kayıplı sıkıştırması işinizi bozar. HEIC'i PNG'ye dönüştürmek size piksele sadık bir sonuç verir.\n\nPNG kayıpsızdır: her pikseli birebir yeniden üretir ve saydamlığı destekler; bu da onu ekran görüntüleri, diyagramlar, logolar ve yeniden sıkıştırma bozulmalarının birikeceği tasarım veya düzenleme iş akışlarına giden her görsel için doğru seçim yapar. Bu araç HEIC'i tarayıcıda çalışan bir kod çözücüyle çözer ve PNG'yi tamamen tarayıcınızda yazar; hiçbir şey yüklenmez.\n\nÖdünleşim boyuttur: PNG tüm ayrıntıyı koruduğu için dosya genellikle HEIC orijinalinden veya JPG sürümünden büyük olur. Sadakate ya da saydam arka plana özellikle ihtiyacınız olduğunda bu değer; yalnızca küçük, paylaşılabilir bir fotoğraf istiyorsanız bunun yerine JPG'ye dönüştürün.",
        faq: [
          {
            q: "HEIC için ne zaman JPG yerine PNG seçmeliyim?",
            a: "Ekran görüntüleri, grafikler, düzenleyeceğiniz görseller ya da saydamlık gereken her şey için PNG'yi seçin; kayıpsızdır ve sıkıştırma bozulması eklemez.",
          },
          {
            q: "PNG gerçekten kayıpsız mı?",
            a: "Evet. PNG her pikseli birebir saklar; dönüştürülen görüntü çözülmüş HEIC ile piksel piksel eşleşir.",
          },
          {
            q: "PNG'm neden HEIC'ten büyük?",
            a: "PNG hiçbir ayrıntıyı atmayıp hepsini koruduğu için fotoğraflık görseller büyür. Kayıpsız kalitenin bedeli budur.",
          },
          {
            q: "PNG saydamlığı korur mu?",
            a: "Evet. JPG'nin aksine PNG, saydamlık için bir alfa kanalını destekler.",
          },
          {
            q: "Dosyalarım yükleniyor mu?",
            a: "Hayır, çözme ve PNG kodlama işlemi tarayıcınızda yerel olarak yapılır.",
          },
        ],
        steps: [
          "Bir HEIC dosyası yükleyin.",
          "Araç dosyayı tarayıcıda çalışan bir kod çözücüyle çözer.",
          "Tarayıcınızda kayıpsız bir PNG yazar.",
          "Dönüştürülen PNG dosyasını indirin.",
        ],
      },
    },
    en: {
      intro:
        "HEIC has been Apple's default photo format since iOS 11, but when you need an exact, lossless copy — a screenshot with crisp text, an image you'll edit further, or artwork with a transparent background — JPG's lossy compression gets in the way. Converting HEIC to PNG gives you a pixel-faithful result instead.\n\nPNG is lossless: it reproduces every pixel exactly and supports transparency, which makes it the right choice for screenshots, diagrams, logos, and any image headed into a design or editing workflow where re-compression artefacts would accumulate. This tool decodes the HEIC with a HEIC decoder that runs in your browser and writes a PNG entirely in your browser, so nothing is uploaded.\n\nThe trade-off is size: because PNG keeps all the detail, the file is usually larger than the HEIC original or a JPG version. When you specifically need fidelity or a transparent background, that's a worthwhile exchange; when you just want a small, shareable photo, convert to JPG instead.",
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
        "Upload a HEIC file.",
        "The tool decodes it with a HEIC decoder that runs in your browser.",
        "It writes a lossless PNG in your browser.",
        "Download the converted PNG file.",
      ],
    },
    ar: {
      intro:
        "ظلّت HEIC صيغة الصور الافتراضية لدى آبل منذ iOS 11، لكن حين تحتاج نسخة مطابقة بلا فقد — لقطة شاشة بنص حاد، أو صورة ستحرّرها لاحقًا، أو تصميمًا بخلفية شفافة — يقف ضغط JPG الفاقد عائقًا. والتحويل من HEIC إلى PNG يمنحك نتيجة مطابقة للبكسل بدلًا من ذلك.\n\nPNG صيغة غير فاقدة: تعيد إنتاج كل بكسل بدقة وتدعم الشفافية، ما يجعلها الخيار الصحيح للقطات الشاشة والمخططات والشعارات وأي صورة متجهة إلى مسار تصميم أو تحرير تتراكم فيه تشوهات إعادة الضغط. تفكّ هذه الأداة ترميز HEIC عبر مفكّك ترميز يعمل داخل متصفحك وتكتب ملف PNG بالكامل في متصفحك، فلا يُرفع أي شيء.\n\nالمقايضة هي الحجم: لأن PNG تحتفظ بكل التفاصيل، يكون الملف عادةً أكبر من أصل HEIC أو نسخة JPG. وحين تحتاج الدقة أو خلفية شفافة تحديدًا، تكون مقايضة تستحق؛ وحين تريد صورة صغيرة قابلة للمشاركة فقط، فحوّل إلى JPG بدلًا من ذلك.",
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
        "ارفع ملف HEIC.",
        "تفكّ الأداة ترميزه عبر مفكّك ترميز يعمل داخل متصفحك.",
        "تكتب ملف PNG بلا فقد في متصفحك.",
        "نزّل ملف PNG المحوّل.",
      ],
    },
  },

  "mic-test": {
    related: ["webcam-test", "mic-camera"],
    extra: {
      fa: {
        intro:
          "یک بررسی سریع میکروفون پیش از تماس Zoom، Google Meet یا Microsoft Teams جلوی شروع شرم‌آور «صدام میاد؟» را می‌گیرد. این ابزار از مرورگر اجازهٔ میکروفون را می‌خواهد و سپس نوار سطح ورودی زنده‌ای نشان می‌دهد که با صحبت شما حرکت می‌کند؛ تأییدی فوری که میکروفون درست شناسایی شده و واقعاً صدا می‌فرستد.\n\nاگر نوار ثابت ماند، معمولاً مشکل از اجازه یا دستگاه است. وقتی مرورگر پرسید «اجازه دادن» را بزنید؛ اگر ردش کرده‌اید، روی نماد قفل یا دوربین/میکروفون در نوار آدرس کلیک کنید تا دسترسی دوباره فعال شود و اگر چند میکروفون دارید ورودی درست را در تنظیمات صدای سیستم انتخاب کنید.\n\nنکتهٔ مهم اینکه این فقط یک تست است: ابزار هرگز چیزی را ضبط، ذخیره یا آپلود نمی‌کند. صدای شما صرفاً برای حرکت دادن نوار به‌صورت زنده استفاده و بعد دور ریخته می‌شود و چیزی از دستگاهتان خارج نمی‌شود.",
        faq: [
          {
            q: "قبل از جلسه میکروفونم را چطور تست کنم؟",
            a: "ابزار را باز کنید، اجازهٔ میکروفون را بدهید و صحبت کنید؛ حرکت نوار زنده تأیید می‌کند میکروفونتان برای Zoom، Meet یا Teams کار می‌کند.",
          },
          {
            q: "نوار حرکت نمی‌کند، مشکل چیست؟",
            a: "معمولاً اجازه مسدود شده یا دستگاه ورودی اشتباه است. از نماد نوار آدرس دوباره اجازه بدهید و میکروفون درست را در تنظیمات سیستم انتخاب کنید.",
          },
          {
            q: "آیا صدای من ضبط می‌شود؟",
            a: "نه. صدا فقط نوار زنده را به‌صورت لحظه‌ای حرکت می‌دهد؛ چیزی ضبط، ذخیره یا آپلود نمی‌شود.",
          },
          {
            q: "اجازهٔ میکروفون را چطور بدهم؟",
            a: "وقتی مرورگر پرسید «اجازه دادن» را بزنید. اگر از دستتان رفت، روی نماد قفل یا میکروفون کنار نشانی کلیک کنید، میکروفون را روی «اجازه دادن» بگذارید و صفحه را دوباره بارگذاری کنید.",
          },
          {
            q: "چرا مرورگر به میکروفونم دسترسی ندارد؟",
            a: "ممکن است برنامهٔ دیگری از آن استفاده کند، اجازه رد شده باشد یا دستگاه ورودی وصل نباشد. برنامه‌های دیگر را ببندید و تنظیمات حریم خصوصی سیستم‌عاملتان را بررسی کنید.",
          },
        ],
        steps: [
          "برای شروع تست میکروفون کلیک کنید.",
          "وقتی مرورگر اجازه خواست «اجازه دادن» را بزنید.",
          "صحبت کنید و واکنش نوار سطح ورودی زنده را ببینید.",
          "اگر ثابت ماند، اجازه را درست کنید یا ورودی درست را انتخاب کنید.",
        ],
      },
    },
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
    extra: {
      fa: {
        intro:
          "تست وبکم پیش از مصاحبه یا تماس تصویری کمک می‌کند مطمئن شوید قاب و نور درست است و وبکم درست فعال است؛ دیگر لازم نیست وقتی جلسه شروع می‌شود با صفحهٔ سیاه روبه‌رو شوید. این ابزار اجازهٔ دوربین را می‌خواهد و پیش‌نمایش زنده‌ای از همان تصویری نشان می‌دهد که Zoom، Meet یا Teams می‌بینند.\n\nپیش‌نمایش سیاه یا ثابت تقریباً همیشه مشکل دسترسی یا دستگاه است. وقتی مرورگر پرسید اجازه بدهید؛ اگر مسدودش کرده‌اید از نماد قفل یا دوربین در نوار آدرس دوباره فعالش کنید، و اگر بیش از یک دوربین دارید دوربین درست را انتخاب کنید. بستن برنامه‌های دیگری که شاید دوربین را در اختیار گرفته‌اند هم اغلب مشکل را حل می‌کند.\n\nپیش‌نمایش فقط زنده است: ابزار هرگز ویدیو را ضبط، ذخیره یا آپلود نمی‌کند. تصویر دوربین فقط به خود شما نشان داده می‌شود و کاملاً روی دستگاهتان می‌ماند.",
        faq: [
          {
            q: "چطور وبکمم را تست کنم؟",
            a: "ابزار را باز کنید و اجازهٔ دسترسی به دوربین را بدهید؛ پیش‌نمایش زنده‌ای می‌بینید، همان تصویری که برنامه‌هایی مثل Zoom و Teams دریافت می‌کنند.",
          },
          {
            q: "پیش‌نمایشم سیاه است، چطور درستش کنم؟",
            a: "بررسی کنید اجازه فعال باشد (نماد دوربین در نوار آدرس)، دوربین درست را انتخاب کنید و برنامه‌های دیگری را که ممکن است از دوربین استفاده کنند ببندید.",
          },
          {
            q: "آیا ویدیوی من ضبط یا آپلود می‌شود؟",
            a: "نه. تصویر فقط به‌صورت زنده روی صفحهٔ شما پیش‌نمایش داده می‌شود و هیچ‌جا ذخیره یا فرستاده نمی‌شود.",
          },
          {
            q: "می‌توانم بین چند دوربین انتخاب کنم؟",
            a: "بله؛ اگر دستگاهتان چند دوربین دارد، دوربین درست را از انتخاب مرورگر یا سیستم برگزینید.",
          },
          {
            q: "چرا دوربینم روشن نمی‌شود؟",
            a: "ممکن است برنامهٔ دیگری از آن استفاده کند، اجازه مسدود باشد یا در تنظیمات حریم خصوصی سیستم‌عامل غیرفعال شده باشد. این‌ها را رفع کنید و صفحه را دوباره بارگذاری کنید.",
          },
        ],
        steps: [
          "برای شروع تست وبکم کلیک کنید.",
          "وقتی مرورگر اجازهٔ دوربین را پرسید «اجازه دادن» را بزنید.",
          "پیش‌نمایش زنده را از نظر قاب و نور بررسی کنید.",
          "اگر سیاه بود، اجازه را درست کنید یا دوربین درست را انتخاب کنید.",
        ],
      },
    },
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
    related: ["gamepad-tester"],
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
    related: ["keyboard-tester"],
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

  "wheel-of-names": {
    related: ["group-maker", "random-picker", "bingo-card-generator"],
    en: {
      intro:
        "Wheel of Names turns a plain list into a spinning wheel that lands on one name at random. Paste one name per line — a class roster for cold-calling, a raffle or giveaway entry list, a standup speaking-order draw, or a chore-assignment list — and spin. Whoever the wheel lands on is the winner.\n\nA Shuffle button randomizes the order of the list before you spin, and a \"Remove winner after spin\" toggle drops each winner from the list automatically once the wheel stops, so you can keep spinning for a second, third, or fourth pick without retyping anything or risking the same name coming up twice.\n\nThe wheel is drawn on an HTML canvas and spun entirely in your browser — there's no server involved, so the names you paste in, whether real students, coworkers, or contest entrants, are never uploaded anywhere. The spin itself is genuinely random each time; it isn't weighted toward any name regardless of list order or length.",
      faq: [
        {
          q: "How is the winner chosen?",
          a: "The wheel spins to a random stopping angle, and whichever name's slice the pointer lands on wins. Every name gets an equal-size slice, so the result is uniformly random.",
        },
        {
          q: "Can I remove the winner automatically after each spin?",
          a: "Yes. Turn on \"Remove winner after spin\" and the winning name is deleted from the list the moment the wheel stops, so the next spin can't repeat it.",
        },
        {
          q: "Does the order I paste names in affect the odds?",
          a: "No. Order only changes how the slices are laid out visually — every name has the same chance of being picked.",
        },
        {
          q: "Can I shuffle the list without spinning?",
          a: "Yes, the Shuffle button randomizes the list order any time, which is handy if you just want to rearrange names before displaying them.",
        },
        {
          q: "Is the list of names uploaded anywhere?",
          a: "No. The wheel is drawn and spun entirely in your browser; your list never leaves your device.",
        },
      ],
      steps: [
        "Paste one name per line into the list box.",
        "Optionally click Shuffle to randomize the order first.",
        "Turn on \"Remove winner after spin\" if you'll be drawing multiple winners.",
        "Click Spin and watch the wheel land on a name.",
        "Repeat to draw more winners — removed names won't come up again.",
      ],
    },
    ar: {
      intro:
        "عجلة الأسماء تحوّل قائمة بسيطة إلى عجلة دوّارة تتوقف على اسم واحد عشوائيًا. الصق اسمًا في كل سطر — قائمة طلاب الصف للسؤال العشوائي، أسماء المشاركين في سحب أو مسابقة، ترتيب الحديث في اجتماع الفريق اليومي، أو توزيع المهام المنزلية — ثم أدر العجلة. الاسم الذي تتوقف عنده العجلة هو الفائز.\n\nزر \"خلط\" يعيد ترتيب القائمة عشوائيًا قبل الدوران، وخيار \"إزالة الفائز بعد كل دورة\" يحذف اسم الفائز تلقائيًا من القائمة بمجرد توقف العجلة، فتستطيع سحب فائز ثانٍ وثالث ورابع دون إعادة الكتابة أو خطر اختيار الاسم نفسه مرتين.\n\nتُرسم العجلة وتدور بالكامل داخل متصفحك عبر canvas، دون أي خادم في الوسط — فالأسماء التي تلصقها، سواء كانت لطلاب حقيقيين أو زملاء عمل أو مشاركين في مسابقة، لا تُرفع إلى أي مكان. والدوران عشوائي فعلًا في كل مرة؛ لا تفضّل العجلة اسمًا على آخر بحسب ترتيبه أو طوله.",
      faq: [
        {
          q: "كيف يُختار الفائز؟",
          a: "تدور العجلة إلى زاوية توقف عشوائية، ويفوز صاحب القطاع الذي يستقر عنده المؤشر. كل اسم يحصل على قطاع بالحجم نفسه، فالنتيجة عشوائية بالتساوي.",
        },
        {
          q: "هل يمكن إزالة الفائز تلقائيًا بعد كل دورة؟",
          a: "نعم. فعّل خيار \"إزالة الفائز بعد كل دورة\" ليُحذف اسم الفائز من القائمة فور توقف العجلة، فلا يتكرر في الدورة التالية.",
        },
        {
          q: "هل يؤثر ترتيب لصق الأسماء على فرص الفوز؟",
          a: "لا. الترتيب يغيّر فقط شكل توزيع القطاعات على العجلة؛ كل اسم له فرصة فوز مساوية للبقية.",
        },
        {
          q: "هل يمكنني خلط القائمة دون تدوير العجلة؟",
          a: "نعم، زر \"خلط\" يعيد ترتيب القائمة عشوائيًا في أي وقت، وهو مفيد إن أردت فقط إعادة ترتيب الأسماء قبل عرضها.",
        },
        {
          q: "هل تُرفع قائمة الأسماء إلى أي مكان؟",
          a: "لا. تُرسم العجلة وتدور بالكامل في متصفحك، ولا تغادر قائمتك جهازك أبدًا.",
        },
      ],
      steps: [
        "الصق اسمًا واحدًا في كل سطر داخل مربع القائمة.",
        "اضغط \"خلط\" اختياريًا لإعادة ترتيب الأسماء عشوائيًا أولًا.",
        "فعّل \"إزالة الفائز بعد كل دورة\" إن كنت ستسحب أكثر من فائز.",
        "اضغط \"دوران\" وشاهد العجلة تتوقف عند اسم.",
        "كرّر السحب لاختيار فائزين إضافيين — الأسماء المُزالة لن تظهر مجددًا.",
      ],
    },
  },

  "group-maker": {
    related: ["wheel-of-names", "random-picker", "bingo-card-generator"],
    extra: {
      vi: {
        intro:
          "Công cụ chia nhóm ngẫu nhiên này tách một danh sách tên bạn dán vào thành các nhóm ngẫu nhiên, dùng cho thảo luận nhóm trên lớp, ghép cặp thực hành hoặc làm dự án, chia một đội thành các nhóm làm việc nhỏ hơn, hay lập đội cho buổi chơi game. Dán mỗi tên một dòng rồi chọn cách chia.\n\nBạn có thể đặt số nhóm muốn có (chẳng hạn 4 nhóm cho lớp 28 người) hoặc đặt mỗi nhóm có bao nhiêu người (chẳng hạn nhóm 3 người), công cụ sẽ tự tính phần còn lại. Danh sách được xáo trộn trước, phần dư được rải vòng tròn qua các nhóm nên không nhóm nào lệch quá một người so với nhóm khác.\n\nKết quả là một lưới gọn gàng, dễ in, bạn có thể phát cho mọi người hoặc chiếu lên màn hình. Mọi thứ chạy cục bộ trong trình duyệt, danh sách tên bạn dán vào không bao giờ bị tải lên, và nút In sẽ định dạng các nhóm cho bản giấy.",
        faq: [
          {
            q: "Chia theo số nhóm và chia theo quy mô nhóm khác nhau thế nào?",
            a: "Theo số nhóm, bạn chọn muốn có bao nhiêu nhóm (ví dụ 4 nhóm) và công cụ chia mọi người đều nhất có thể. Theo quy mô nhóm, bạn chọn mỗi nhóm bao nhiêu người (ví dụ mỗi nhóm 3) và công cụ tính ra cần bao nhiêu nhóm.",
          },
          {
            q: "Các nhóm có đều nhau không?",
            a: "Có. Danh sách được xáo trộn rồi phân phối vòng tròn nên quy mô các nhóm không bao giờ chênh nhau quá một người.",
          },
          {
            q: "Việc chia nhóm có thật sự ngẫu nhiên không?",
            a: "Có, danh sách được xáo trộn bằng một thuật toán ngẫu nhiên trước khi chia, nên không thể đoán trước ai vào nhóm nào.",
          },
          {
            q: "Tôi có in các nhóm ra được không?",
            a: "Được, bấm In và công cụ sẽ định dạng các nhóm thành bố cục gọn, hợp với giấy, ẩn biểu mẫu nhập liệu.",
          },
          {
            q: "Danh sách tên của tôi có bị tải lên đâu không?",
            a: "Không. Việc chia nhóm diễn ra hoàn toàn trong trình duyệt; không có gì được gửi tới máy chủ.",
          },
        ],
        steps: [
          "Dán mỗi tên một dòng vào ô danh sách.",
          "Chọn chia theo số nhóm hay theo quy mô nhóm, rồi nhập số nhóm hoặc quy mô nhóm bạn muốn.",
          "Bấm Tạo nhóm để có các nhóm ngẫu nhiên, cân bằng; bấm lại để xáo trộn lần nữa.",
          "Bấm In để có bản phát tay trên giấy.",
        ],
      },
    },
    en: {
      intro:
        "Group Maker splits a pasted list of names into randomized groups — for classroom breakout sessions, assigning lab or project partners, dividing a team into smaller working groups, or setting up teams for a game night. Paste one name per line and choose how you want the split to work.\n\nYou can either set the number of groups you want (say, 4 groups from a class of 28) or set how many people should be in each group (say, teams of 3), and the tool works out the rest. Names are shuffled first, and the remainder is spread round-robin across the groups so no group ends up more than one person larger or smaller than the others.\n\nThe result is a clean, print-friendly grid you can hand out or project on a screen. Everything runs locally in your browser — the list of names you paste in is never uploaded — and a Print button formats the groups for a paper handout.",
      faq: [
        {
          q: "What's the difference between choosing a group count and a group size?",
          a: "By group count, you pick how many groups you want (e.g. 4 groups) and the tool divides everyone as evenly as possible. By group size, you pick how many people per group (e.g. 3 each) and the tool works out how many groups that requires.",
        },
        {
          q: "Will the groups be evenly sized?",
          a: "Yes. Names are shuffled and then distributed round-robin, so group sizes never differ by more than one person.",
        },
        {
          q: "Is the grouping actually random?",
          a: "Yes, the list is shuffled with a randomized algorithm before it's split, so who ends up in which group isn't predictable.",
        },
        {
          q: "Can I print the groups?",
          a: "Yes, click Print and the tool formats the groups into a clean, paper-friendly layout with the input form hidden.",
        },
        {
          q: "Is my list of names uploaded anywhere?",
          a: "No. Grouping happens entirely in your browser; nothing is sent to a server.",
        },
      ],
      steps: [
        "Paste one name per line into the list box.",
        "Choose whether to split by number of groups or by group size.",
        "Enter the number of groups or the group size you want.",
        "Click Generate to create randomized, balanced groups.",
        "Click Print for a paper-friendly handout, or reshuffle by generating again.",
      ],
    },
    ar: {
      intro:
        "صانع المجموعات يقسّم قائمة أسماء ملصوقة إلى مجموعات عشوائية — لتقسيم الصف إلى مجموعات نقاش، أو توزيع شركاء المختبر أو المشروع، أو تقسيم فريق العمل إلى مجموعات أصغر، أو تكوين فرق لليلة ألعاب. الصق اسمًا في كل سطر واختر طريقة التقسيم التي تناسبك.\n\nيمكنك تحديد عدد المجموعات التي تريدها (مثلًا 4 مجموعات من صف يضم 28 طالبًا)، أو تحديد عدد الأفراد في كل مجموعة (مثلًا 3 أفراد لكل مجموعة)، وتتولى الأداة الباقي. تُخلط الأسماء أولًا، ثم يُوزَّع الفائض بالتناوب على المجموعات، فلا تزيد أي مجموعة أو تنقص عن الأخرى بأكثر من شخص واحد.\n\nالنتيجة شبكة نظيفة قابلة للطباعة يمكنك توزيعها أو عرضها على الشاشة. كل شيء يعمل محليًا في متصفحك — قائمة الأسماء التي تلصقها لا تُرفع أبدًا — وزر الطباعة ينسّق المجموعات لتوزيعها ورقيًا.",
      faq: [
        {
          q: "ما الفرق بين اختيار عدد المجموعات وحجم المجموعة؟",
          a: "عند اختيار عدد المجموعات، تحدّد كم مجموعة تريد (مثلًا 4 مجموعات) فتقسّم الأداة الجميع بالتساوي قدر الإمكان. وعند اختيار حجم المجموعة، تحدّد عدد الأفراد في كل مجموعة (مثلًا 3 لكل مجموعة) وتحسب الأداة عدد المجموعات اللازمة.",
        },
        {
          q: "هل تكون المجموعات متساوية الحجم؟",
          a: "نعم. تُخلط الأسماء ثم تُوزَّع بالتناوب، فلا يختلف حجم أي مجموعة عن الأخرى بأكثر من فرد واحد.",
        },
        {
          q: "هل التوزيع عشوائي فعلًا؟",
          a: "نعم، تُخلط القائمة بخوارزمية عشوائية قبل تقسيمها، فلا يمكن التنبؤ بمن سينتهي به المطاف في أي مجموعة.",
        },
        {
          q: "هل يمكنني طباعة المجموعات؟",
          a: "نعم، اضغط \"طباعة\" فتنسّق الأداة المجموعات في تخطيط نظيف مناسب للورق مع إخفاء نموذج الإدخال.",
        },
        {
          q: "هل تُرفع قائمة الأسماء إلى أي مكان؟",
          a: "لا. يتم التقسيم بالكامل داخل متصفحك، ولا يُرسَل شيء إلى أي خادم.",
        },
      ],
      steps: [
        "الصق اسمًا واحدًا في كل سطر داخل مربع القائمة.",
        "اختر التقسيم حسب عدد المجموعات أو حسب حجم المجموعة.",
        "أدخل عدد المجموعات أو حجم المجموعة الذي تريده.",
        "اضغط \"إنشاء\" لتوليد مجموعات عشوائية ومتوازنة.",
        "اضغط \"طباعة\" لتوزيع ورقي، أو أعد الإنشاء للحصول على تقسيم جديد.",
      ],
    },
  },

  "aspect-ratio": {
    related: ["image-resizer", "crop-image", "image-compression"],
    extra: {
      ko: {
        intro:
          "화면 비율 계산기는 픽셀 단위의 가로·세로 값을 비율로 바꿔 주고, 비율과 한쪽 길이만 알면 나머지 한쪽을 계산해 줍니다. 디자인, 영상, 썸네일의 비율을 유지해야 할 때 쓰는 도구입니다. 1920 × 1080이 어떤 비율인지, 가로가 1280픽셀이어야 하는 16:9 배너의 세로는 얼마인지 같은 계산에 알맞습니다.\n\n첫 번째 탭에서는 가로와 세로를 입력하면 가장 간단한 비율로 약분해 소수 값과 함께 보여 줍니다(1920 × 1080은 16:9). 아래에는 16:9, 4:3, 1:1, 21:9, 3:2, 9:16, 4:5, 2.39:1의 여덟 가지 프리셋이 있어 한 번 눌러서 값을 채울 수 있습니다. 두 번째 탭은 반대로, 비율을 입력하고 아는 쪽이 가로인지 세로인지 고른 뒤 픽셀 값을 넣으면 나머지 한쪽을 알려 줍니다.\n\n입력한 숫자로 하는 단순한 계산이라 업로드할 파일이 없고 아무것도 브라우저 밖으로 나가지 않습니다. 이 도구는 크기만 계산하며 이미지를 자르거나 크기를 바꾸지는 않습니다.",
        faq: [
          {
            q: "이미지나 화면의 종횡비는 어떻게 알 수 있나요?",
            a: "'크기를 비율로' 탭에 가로와 세로를 입력하세요. 두 값을 최대공약수로 나눠 가장 간단한 형태로 보여 주므로 1920 × 1080은 16:9로 표시되고, 소수 값(1.7778)도 함께 나옵니다.",
          },
          {
            q: "가로 길이를 알 때 세로 길이는 어떻게 구하나요?",
            a: "'비율로 크기 계산' 탭을 쓰세요. 비율(예: 16:9)을 정하고 가로를 아는 쪽으로 선택한 뒤 픽셀 값을 입력합니다. 16:9 이미지의 가로가 1280px이면 세로는 720px입니다.",
          },
          {
            q: "결과가 정수 픽셀로 나오나요?",
            a: "계산 결과는 소수점 둘째 자리까지 표시됩니다. 예를 들어 16:9에서 가로 1000px이면 세로는 562.50px로 나오므로, 정수 픽셀이 필요하면 직접 반올림하세요.",
          },
          {
            q: "기본으로 들어 있는 비율에는 무엇이 있나요?",
            a: "16:9, 4:3, 1:1, 21:9, 3:2, 9:16, 4:5, 2.39:1의 여덟 가지 프리셋입니다. 누르면 가로·세로 입력란이 채워져 비율과 소수 값을 바로 볼 수 있습니다.",
          },
          {
            q: "이 도구가 이미지 크기를 바꿔 주나요?",
            a: "아니요, 계산만 합니다. 목표 크기를 알았다면 이미지 크기 조절 도구나 자르기 도구에서 적용하세요.",
          },
        ],
        steps: [
          "가로와 세로를 입력해 약분된 비율과 소수 값을 확인하거나 프리셋을 누릅니다.",
          "알고 있는 비율에서 계산하려면 '비율로 크기 계산' 탭으로 이동합니다.",
          "가로와 세로 중 아는 쪽을 고르고 픽셀 값을 입력합니다.",
          "나온 나머지 값을 디자인이나 편집 도구에 적용합니다.",
        ],
      },
    },
    en: {
      intro:
        "Aspect Ratio Calculator turns a pair of pixel dimensions into a ratio, and turns a ratio plus one known side into the missing one. It's for the everyday jobs where a design, a video or a thumbnail has to keep its proportions: working out what 1920 × 1080 reduces to, or how tall a 16:9 banner is if it must be 1280 pixels wide.\n\nThe first tab takes a width and a height, reduces them to the simplest ratio (1920 × 1080 becomes 16:9) and shows the decimal value alongside. Below it sit eight one-click presets — 16:9, 4:3, 1:1, 21:9, 3:2, 9:16, 4:5 and 2.39:1 — that fill in the dimensions for you. The second tab goes the other way: enter a ratio, say whether you know the width or the height, give that value in pixels, and it returns the other side.\n\nIt's plain arithmetic on the numbers you type, so there is no file to upload and nothing leaves your browser. It calculates dimensions only; it does not resize or crop an image.",
      faq: [
        {
          q: "How do I find the aspect ratio of an image or screen?",
          a: "Enter its width and height on the Dimensions to Ratio tab. The tool divides both by their greatest common divisor and shows the simplest form, so 1920 × 1080 reads as 16:9, along with the decimal value (1.7778).",
        },
        {
          q: "How do I work out the height for a given width?",
          a: "Use the Ratio to Scale tab. Set the ratio (for example 16:9), choose that you know the width, and enter it in pixels. A 16:9 image 1280 px wide comes out 720 px tall.",
        },
        {
          q: "Does it give whole pixels?",
          a: "The scaled result is shown to two decimal places — a 16:9 image 1000 px wide comes out 562.50 px tall — so round it to a whole pixel yourself where the target needs it.",
        },
        {
          q: "Which common ratios are built in?",
          a: "Eight presets: 16:9, 4:3, 1:1, 21:9, 3:2, 9:16, 4:5 and 2.39:1. Clicking one fills the width and height fields so you can see the ratio and decimal.",
        },
        {
          q: "Does this resize my image?",
          a: "No. It only does the arithmetic. Once you know the target dimensions, use the Image Resizer or the crop tool to apply them.",
        },
      ],
      steps: [
        "Enter a width and height to see the simplified ratio and its decimal value, or tap a preset.",
        "Switch to the Ratio to Scale tab to work from a known ratio.",
        "Choose whether you know the width or the height and enter it in pixels.",
        "Read off the missing dimension and apply it in your design, editor or video tool.",
      ],
    },
    ar: {
      intro:
        "حاسبة نسبة العرض إلى الارتفاع تحوّل أي بُعدين بالبكسل إلى نسبة مبسّطة، وتحوّل نسبة معروفة مع ضلع واحد إلى الضلع المفقود. صُمّمت للمهام اليومية التي يجب أن تحتفظ فيها التصاميم والفيديوهات والصور المصغّرة بنسبها: كأن تعرف إلى ماذا تختزل الأبعاد 1920 × 1080، أو كم يبلغ ارتفاع بانر بنسبة 16:9 إذا كان عرضه 1280 بكسل.\n\nالتبويب الأول يأخذ العرض والارتفاع ويختزلهما إلى أبسط نسبة (فتصبح 1920 × 1080 هي 16:9) ويعرض القيمة العشرية بجانبها. وتحته ثمانية إعدادات جاهزة بنقرة واحدة هي 16:9 و4:3 و1:1 و21:9 و3:2 و9:16 و4:5 و2.39:1، تملأ الأبعاد عنك. أما التبويب الثاني فيعمل بالعكس: تُدخل النسبة وتحدّد هل تعرف العرض أم الارتفاع وتكتب قيمته بالبكسل، فيعطيك الضلع الآخر.\n\nهي عمليات حسابية بسيطة على الأرقام التي تكتبها، فلا يوجد ملف يُرفع ولا شيء يغادر متصفحك. الأداة تحسب الأبعاد فقط ولا تغيّر حجم الصورة ولا تقصّها.",
      faq: [
        {
          q: "كيف أعرف نسبة العرض إلى الارتفاع لصورة أو شاشة؟",
          a: "أدخل العرض والارتفاع في تبويب الأبعاد إلى نسبة. تقسم الأداة كليهما على القاسم المشترك الأكبر وتعرض أبسط صيغة، فتظهر 1920 × 1080 على أنها 16:9 مع القيمة العشرية (1.7778).",
        },
        {
          q: "كيف أحسب الارتفاع لعرض معيّن؟",
          a: "استخدم تبويب النسبة إلى القياس. حدّد النسبة (مثل 16:9) واختر أنك تعرف العرض وأدخله بالبكسل. صورة بنسبة 16:9 وعرض 1280 بكسل يكون ارتفاعها 720 بكسل.",
        },
        {
          q: "هل تعطيني بكسلات صحيحة؟",
          a: "تُعرض النتيجة بخانتين عشريتين، فصورة 16:9 بعرض 1000 بكسل يظهر ارتفاعها 562.50 بكسل، لذلك قرّب الناتج إلى بكسل صحيح بنفسك عند الحاجة.",
        },
        {
          q: "ما النسب الشائعة المضمّنة؟",
          a: "ثمانية إعدادات جاهزة: 16:9 و4:3 و1:1 و21:9 و3:2 و9:16 و4:5 و2.39:1. النقر على أي منها يملأ حقلي العرض والارتفاع لترى النسبة والقيمة العشرية.",
        },
        {
          q: "هل تغيّر هذه الأداة حجم صورتي؟",
          a: "لا، هي تجري الحساب فقط. بعد أن تعرف الأبعاد المطلوبة استخدم أداة تغيير حجم الصور أو أداة القص لتطبيقها.",
        },
      ],
      steps: [
        "أدخل العرض والارتفاع لترى النسبة المبسّطة وقيمتها العشرية، أو اضغط على أحد الإعدادات الجاهزة.",
        "انتقل إلى تبويب النسبة إلى القياس لتحسب انطلاقًا من نسبة معروفة.",
        "اختر هل تعرف العرض أم الارتفاع وأدخله بالبكسل.",
        "اقرأ البُعد المفقود وطبّقه في تصميمك أو محرّرك أو أداة الفيديو.",
      ],
    },
  },
  "exif-viewer": {
    related: ["exif-remover", "image-compression", "image-converter"],
    extra: {
      ko: {
        intro:
          "EXIF 뷰어는 사진을 열어 카메라나 휴대폰이 사진에 넣어 둔 메타데이터를 읽어 줍니다. 카메라 제조사와 모델, 노출 시간·조리개·ISO·초점 거리 같은 촬영 설정, 촬영 날짜, 그리고 사진에 담겨 있다면 GPS 좌표까지 볼 수 있습니다. 사진 메타데이터를 확인하고 싶을 때, 예를 들어 어떻게 찍은 사진인지 보거나 언제 촬영했는지 확인할 때, 공유하려는 사진에 위치 정보가 남아 있는지 알아볼 때 유용합니다.\n\nJPEG 파일을 올리면 미리보기와 픽셀 크기 옆에 결과가 파일, 카메라, 설정, 날짜/시간, GPS 구역으로 나뉘어 표시됩니다. GPS 데이터가 있으면 링크로 Google 지도에서 해당 위치를 열 수 있습니다. EXIF는 JPEG 파일에서만 읽습니다. 다른 형식의 이미지는 파일 이름, 크기, 형식, 크기(픽셀)만 보여 주고 EXIF 데이터를 읽지 못했다고 알려 줍니다.\n\n파일은 브라우저 탭 안에서 읽으며 업로드되지 않습니다. 페이지 밖으로 나가는 것은 Google 지도 링크뿐이고, 그것도 직접 클릭했을 때만입니다.",
        faq: [
          {
            q: "EXIF 데이터란 무엇인가요?",
            a: "사진을 찍을 때 사진에 함께 기록되는 메타데이터입니다. 기기, 노출 설정, 날짜와 시간, 그리고 많은 휴대폰에서는 GPS 위치가 들어 있습니다. 대부분의 사진 앱은 이를 숨기기 때문에 EXIF를 확인하는 도구가 필요합니다.",
          },
          {
            q: "어떤 파일을 읽을 수 있나요?",
            a: "EXIF 데이터가 들어 있는 JPEG 파일입니다. 다른 형식의 이미지도 불러올 수는 있지만 파일 이름, 크기, 형식, 해상도만 표시하고 전체 EXIF 데이터를 찾지 못했다고 알려 줍니다.",
          },
          {
            q: "사진을 어디서 찍었는지 알 수 있나요?",
            a: "사진에 GPS 정보가 있다면 가능합니다. GPS 구역에 위도, 경도, 고도가 표시되고 Google 지도에서 위치를 볼 수 있는 링크가 나옵니다.",
          },
          {
            q: "내 사진이 업로드되나요?",
            a: "아니요. 이미지는 브라우저에서 로컬로 읽으며 어디로도 전송되지 않습니다. Google 지도 링크를 클릭할 때만 다른 사이트로 이동합니다.",
          },
          {
            q: "공유하기 전에 EXIF 데이터를 지우려면 어떻게 하나요?",
            a: "이미지에서 메타데이터를 제거하는 EXIF 제거 도구를 사용하세요.",
          },
        ],
        steps: [
          "사진을 올립니다. JPEG를 권장합니다.",
          "메타데이터를 읽는 동안 잠시 기다립니다.",
          "파일, 카메라, 설정, 날짜/시간, GPS 구역을 살펴봅니다.",
          "위치 정보가 있으면 Google 지도에서 열거나, 다른 사진을 불러와 비교합니다.",
        ],
      },
    },
    en: {
      intro:
        "EXIF Viewer opens a photo and reads out the metadata the camera or phone embedded in it: camera make and model, shooting settings such as exposure time, aperture, ISO and focal length, the date it was taken, and GPS coordinates if the photo carries them. It's useful for checking how a shot was taken, confirming when a photo was captured, or finding out whether an image you're about to share still contains a location.\n\nDrop in a JPEG and the results are grouped into File, Camera, Settings, Date / Time and GPS sections beside a preview and the image's pixel dimensions. When GPS data is present, a link opens the spot on Google Maps. EXIF is only read from JPEG files; for any other image type the tool still shows the file name, size, type and dimensions, and tells you that no EXIF data could be read.\n\nThe file is read inside your browser tab and nothing is uploaded. The only thing that ever leaves the page is the Google Maps link, and only if you click it.",
      faq: [
        {
          q: "What is EXIF data?",
          a: "EXIF is metadata written into a photo when it's taken: the device, the exposure settings, the date and time and, on many phones, the GPS position. Most photo apps hide it, which is why a viewer is useful.",
        },
        {
          q: "Which files can it read?",
          a: "JPEG files that contain EXIF data. Other image types still load, but the tool only shows the file name, size, type and dimensions and says that full EXIF data wasn't found.",
        },
        {
          q: "Can it show where a photo was taken?",
          a: "If the photo has GPS information, yes — the latitude, longitude and altitude appear in the GPS section, with a link to view the location on Google Maps.",
        },
        {
          q: "Is my photo uploaded?",
          a: "No. The image is read locally in your browser and nothing is sent anywhere. Only clicking the Google Maps link takes you to another site.",
        },
        {
          q: "How do I remove EXIF data before sharing a photo?",
          a: "Use the EXIF Remover, which strips the metadata from the image.",
        },
      ],
      steps: [
        "Drop in a photo, preferably a JPEG.",
        "Wait a moment while the metadata is read.",
        "Browse the File, Camera, Settings, Date / Time and GPS sections.",
        "If a location is present, open it on Google Maps, or load another photo to compare.",
      ],
    },
    ar: {
      intro:
        "عارض EXIF يفتح الصورة ويقرأ البيانات الوصفية التي أدرجتها الكاميرا أو الهاتف فيها: ماركة الكاميرا وطرازها، وإعدادات التصوير مثل زمن التعريض وفتحة العدسة وISO والبعد البؤري، وتاريخ الالتقاط، وإحداثيات GPS إن كانت الصورة تحملها. مفيد لمعرفة كيف التُقطت اللقطة، أو للتأكد من وقت التقاطها، أو لمعرفة ما إذا كانت الصورة التي توشك على مشاركتها ما زالت تحمل موقعًا.\n\nأسقط ملف JPEG فتُعرض النتائج مجمّعة في أقسام الملف والكاميرا والإعدادات والتاريخ/الوقت وGPS بجانب معاينة للصورة وأبعادها بالبكسل. وإذا وُجدت بيانات GPS يفتح رابط الموقع على خرائط Google. تُقرأ بيانات EXIF من ملفات JPEG فقط؛ وأي نوع صور آخر تعرض الأداة له اسم الملف وحجمه ونوعه وأبعاده، وتخبرك بأنه تعذّرت قراءة بيانات EXIF.\n\nيُقرأ الملف داخل تبويب المتصفح ولا يُرفع شيء. الشيء الوحيد الذي قد يغادر الصفحة هو رابط خرائط Google، وفقط إن نقرت عليه.",
      faq: [
        {
          q: "ما هي بيانات EXIF؟",
          a: "هي بيانات وصفية تُكتب في الصورة لحظة التقاطها: الجهاز، وإعدادات التعريض، والتاريخ والوقت، وفي كثير من الهواتف موقع GPS. تُخفيها أغلب تطبيقات الصور، ولذلك يفيد وجود عارض لها.",
        },
        {
          q: "ما الملفات التي يمكن قراءتها؟",
          a: "ملفات JPEG التي تحتوي بيانات EXIF. الأنواع الأخرى تُحمَّل أيضًا لكن الأداة تعرض اسم الملف وحجمه ونوعه وأبعاده فقط وتنبّه إلى أنه لم يُعثر على بيانات EXIF كاملة.",
        },
        {
          q: "هل يمكنه إظهار مكان التقاط الصورة؟",
          a: "نعم إن كانت في الصورة معلومات GPS؛ يظهر خط العرض وخط الطول والارتفاع في قسم GPS مع رابط لعرض الموقع على خرائط Google.",
        },
        {
          q: "هل تُرفع صورتي؟",
          a: "لا. تُقرأ الصورة محليًا في متصفحك ولا يُرسل شيء إلى أي مكان. وحده النقر على رابط خرائط Google ينقلك إلى موقع آخر.",
        },
        {
          q: "كيف أزيل بيانات EXIF قبل مشاركة الصورة؟",
          a: "استخدم أداة إزالة EXIF التي تحذف البيانات الوصفية من الصورة.",
        },
      ],
      steps: [
        "أسقط صورة، ويفضّل أن تكون JPEG.",
        "انتظر لحظة بينما تُقرأ البيانات الوصفية.",
        "تصفّح أقسام الملف والكاميرا والإعدادات والتاريخ/الوقت وGPS.",
        "إن وُجد موقع فافتحه على خرائط Google، أو حمّل صورة أخرى للمقارنة.",
      ],
    },
  },
  "random-picker": {
    related: ["wheel-of-names", "group-maker", "bingo-card-generator"],
    extra: {
      tr: {
        intro:
          "Rastgele Seçici, insanların sürekli ihtiyaç duyduğu küçük rastgelelik işlerini tek sayfada toplar: rastgele sayı üretici, zar atma, yazı tura ve bir listeden seçim için isim çarkına yönlendirme. Kimin önce başlayacağına karar vermek, hızlı bir çekiliş yapmak, bir kutu oyununda zar atmak ya da bir örnek için sayı üretmek istediğinizde kullanın.\n\nSayı sekmesinde en küçük ve en büyük değeri ile kaç sayı istediğinizi belirler, tekrara izin verip vermeyeceğinizi seçersiniz. Zar sekmesi 4, 6, 8, 10, 12 veya 20 yüzlü 1 ila 100 zar atar ve her atışı toplamla birlikte gösterir. Yazı tura sekmesi bir para atar ve yazı ile turanın toplam sayısını tutar. Bir listeden isim seçmek için Liste sekmesi sizi İsim Çarkı'na yönlendirir.\n\nSayılar tarayıcının kriptografik rastgele sayı üretecinden gelir; aralıktaki hiçbir değerin kayırılmaması için eğri sonuç verecek değerler atılır. Her şey yerelde çalışır; hiçbir şey saklanmaz ya da gönderilmez.",
        faq: [
          {
            q: "Rastgelelik adil mi?",
            a: "Araç tarayıcının kriptografik rastgele sayı üretecinden çeker ve sonucu çarpıtacak değerleri eler; böylece aralığınızdaki her sayının çıkma olasılığı eşittir. Yalnızca bu üreteç bulunmadığında standart Math.random'a döner.",
          },
          {
            q: "Tekrarsız sayı üretebilir miyim?",
            a: "Evet. \"Tekrarlayan sayılara izin ver\" seçeneğinin işaretini kaldırın; her sayı en fazla bir kez çıkar. Bu modda aralıktaki sayıdan fazlasını isteyemezsiniz; araç tekrara izin vermenizi ya da aralığı genişletmenizi söyler.",
          },
          {
            q: "Kaç zar atabilirim?",
            a: "Her seferde 1 ile 100 arasında, her biri 4, 6, 8, 10, 12 veya 20 yüzlü. Araç her atışı ve toplamı listeler.",
          },
          {
            q: "Bir listeden rastgele isim seçebilir miyim?",
            a: "Liste sekmesi kendisi seçim yapmaz; bunun için tasarlanmış İsim Çarkı'na yönlendirir. Bir listeyi takımlara bölmek için Grup Oluşturucu'yu kullanın.",
          },
          {
            q: "Bir şey yükleniyor ya da kaydediliyor mu?",
            a: "Hayır. Sonuçlar tarayıcınızda üretilir ve onlarla yapabileceğiniz tek şey kopyalamaktır.",
          },
        ],
        steps: [
          "Sayı, Zar veya Yazı Tura sekmesini seçin.",
          "Aralığı ve adedi, zarların sayısını ve yüz sayısını ayarlayın ya da doğrudan atın.",
          "Oluştur, Zar At veya Para At düğmesine basın.",
          "Sonucu kopyalayın ya da yeni bir çekiliş için tekrar deneyin.",
        ],
      },
    },
    en: {
      intro:
        "Random Picker bundles the small randomness jobs people keep reaching for into one page: a random number generator, a dice roller, a coin flip and a pointer to a name wheel for picking from a list. Use it to settle who goes first, run a quick draw, roll for a board game or generate numbers for a sample.\n\nOn the Number tab you set a minimum, a maximum and how many numbers you want, and choose whether duplicates are allowed. The Dice tab rolls 1 to 100 dice with 4, 6, 8, 10, 12 or 20 sides and shows every roll with the total. The Coin tab flips a coin and keeps a running tally of heads and tails. For choosing a name from a list, the List tab sends you to Wheel of Names.\n\nNumbers come from the browser's cryptographic random generator, using rejection sampling so no value in the range is favoured. Everything runs locally; nothing is stored or sent anywhere.",
      faq: [
        {
          q: "Is the randomness fair?",
          a: "The tool draws from the browser's cryptographic random number generator and discards values that would skew the result, so every number in your range is equally likely. Only where that generator is unavailable does it fall back to the standard Math.random.",
        },
        {
          q: "Can I generate numbers without repeats?",
          a: "Yes. Untick \"Allow duplicate numbers\" and each number appears at most once. In that mode you can't ask for more numbers than the range contains, and the tool tells you to allow duplicates or widen the range.",
        },
        {
          q: "How many dice can I roll?",
          a: "Between 1 and 100 at a time, each with 4, 6, 8, 10, 12 or 20 sides. The tool lists each roll and the total.",
        },
        {
          q: "Can I pick a random name from a list?",
          a: "The List tab doesn't pick one itself — it links to Wheel of Names, which is built for that. To split a list into teams, use Group Maker.",
        },
        {
          q: "Is anything uploaded or saved?",
          a: "No. Results are generated in your browser and the only thing you can do with them is copy them.",
        },
      ],
      steps: [
        "Choose the Number, Dice or Coin tab.",
        "Set the range and count, the number and size of the dice, or just press Flip.",
        "Press Generate, Roll Dice or Flip Coin.",
        "Copy the result, or go again for a new draw.",
      ],
    },
    ar: {
      intro:
        "أداة الاختيار العشوائي تجمع في صفحة واحدة أعمال العشوائية الصغيرة التي يحتاجها الناس كثيرًا: مولّد أرقام عشوائية، ورمي نرد، وقذف عملة، وتوجيه إلى عجلة الأسماء للاختيار من قائمة. استخدمها لتحسم من يبدأ أولًا، أو لإجراء سحب سريع، أو للعب لعبة لوحية، أو لتوليد أرقام لعيّنة.\n\nفي تبويب الرقم تحدّد الحد الأدنى والأقصى وعدد الأرقام المطلوبة، وتختار هل يُسمح بالتكرار. تبويب النرد يرمي من 1 إلى 100 نردة بـ4 أو 6 أو 8 أو 10 أو 12 أو 20 وجهًا ويعرض كل رمية مع المجموع. تبويب العملة يقذف عملة ويحتفظ بعدّاد متراكم للصورة والكتابة. وللاختيار من قائمة أسماء يحيلك تبويب القائمة إلى عجلة الأسماء.\n\nتأتي الأرقام من مولّد الأعداد العشوائية التشفيري في المتصفح، مع رفض القيم المنحازة بحيث لا يُفضَّل أي رقم ضمن النطاق. كل شيء يعمل محليًا ولا يُخزَّن أو يُرسل شيء.",
      faq: [
        {
          q: "هل العشوائية عادلة؟",
          a: "تسحب الأداة من مولّد الأعداد العشوائية التشفيري في المتصفح وتتجاهل القيم التي كانت ستُحدث انحيازًا، فيتساوى احتمال كل رقم في النطاق. ولا تعود إلى Math.random القياسية إلا حيث يتعذّر وجود ذلك المولّد.",
        },
        {
          q: "هل يمكن توليد أرقام بدون تكرار؟",
          a: "نعم. ألغِ تحديد \"السماح بالأرقام المكررة\" فيظهر كل رقم مرة واحدة على الأكثر. وفي هذا الوضع لا يمكنك طلب أرقام أكثر مما يحتويه النطاق، وتطلب منك الأداة السماح بالتكرار أو توسيع النطاق.",
        },
        {
          q: "كم نردة يمكنني رميها؟",
          a: "من 1 إلى 100 في المرة الواحدة، لكل منها 4 أو 6 أو 8 أو 10 أو 12 أو 20 وجهًا. تعرض الأداة كل رمية والمجموع.",
        },
        {
          q: "هل يمكنني اختيار اسم عشوائي من قائمة؟",
          a: "تبويب القائمة لا يختار بنفسه، بل يحيلك إلى عجلة الأسماء المصمَّمة لذلك. ولتقسيم قائمة إلى فرق استخدم أداة تكوين المجموعات.",
        },
        {
          q: "هل يُرفع أو يُحفظ شيء؟",
          a: "لا. تُولَّد النتائج في متصفحك، وكل ما يمكنك فعله بها هو نسخها.",
        },
      ],
      steps: [
        "اختر تبويب الرقم أو النرد أو العملة.",
        "حدّد النطاق والعدد، أو عدد النرد وأوجهه، أو اضغط على القذف فقط.",
        "اضغط توليد أو رمي النرد أو قذف العملة.",
        "انسخ النتيجة، أو أعد المحاولة لسحب جديد.",
      ],
    },
  },
  "text-repeater": {
    related: ["text-counter", "lorem-ipsum", "text-case", "text-sorter"],
    extra: {
      tr: {
        intro:
          "Metin Tekrarlayıcı, bir metni istediğiniz kadar tekrarlar ve kopyalar arasına seçtiğiniz ayırıcıyı koyar. Test verisi üretmek, bir düzeni yer tutucu içerikle doldurmak, desen oluşturmak ya da bir giriş alanını zorlamak için uzun bir metin bloğu hazırlamak istediğinizde işinize yarar.\n\nMetni yazın veya yapıştırın, 1 ile 10.000 arasında bir tekrar sayısı belirleyin ve tekrarlar arasına ne gireceğini seçin: yeni satır, boşluk, virgül, dikey çizgi, hiçbir şey ya da --- gibi özel bir ayırıcı. Çıktı siz yazdıkça güncellenir ve karakter sayacı girdinizin uzunluğunu gösterir. Sonucu kopyalayabilir ya da repeated-text.txt olarak indirebilirsiniz.\n\nTarayıcınızı korumak için bir üst sınır vardır: sonuç 1.000.000 karakterden uzun olacaksa araç onu üretmek yerine \"Çıktı çok büyük\" uyarısı gösterir; siz de sayıyı azaltır ya da metni kısaltırsınız. Her şey yerelde çalışır ve hiçbir şey yüklenmez.",
        faq: [
          {
            q: "Metni kaç kez tekrarlayabilirim?",
            a: "1 ile 10.000 kez arasında; tüm çıktının 1.000.000 karakter içinde kalması koşuluyla.",
          },
          {
            q: "Hangi ayırıcılar mevcut?",
            a: "Yeni satır, boşluk, virgül, dikey çizgi, hiçbiri ya da --- gibi kendi yazdığınız özel bir ayırıcı.",
          },
          {
            q: "Çıktı neden çok büyük diyor?",
            a: "Sonuç 1.000.000 karakteri aşacaktır. Tekrar sayısını düşürün ya da girdi metnini kısaltın, yeniden üretilir.",
          },
          {
            q: "Sonucu nasıl kaydederim?",
            a: "Çıktı panelindeki kopyala düğmesini ya da düz metin dosyası olarak repeated-text.txt adıyla kaydeden İndir düğmesini kullanın.",
          },
          {
            q: "Metnim bir yere yükleniyor mu?",
            a: "Hayır. Metin tarayıcınızda tekrarlanır ve hiçbir sunucuya gönderilmez.",
          },
        ],
        steps: [
          "Tekrarlanacak metni yazın veya yapıştırın.",
          "Tekrar sayısını belirleyin ve bir ayırıcı seçin.",
          "Çıktıyı ve tekrar sayısını kontrol edin.",
          "Sonucu kopyalayın ya da .txt dosyası olarak indirin.",
        ],
      },
      fa: {
        intro:
          "ابزار تکرار متن، یک متن را به تعدادی که بخواهید تکرار می‌کند و بین نسخه‌ها جداکننده‌ای را که انتخاب کرده‌اید می‌گذارد. برای ساختن دادهٔ آزمایشی، پر کردن یک طرح با محتوای نمونه، ساخت الگو یا ساختن یک بلوک متن طولانی برای آزمایش فشار روی یک فیلد ورودی به کار می‌آید.\n\nمتن را تایپ یا جای‌گذاری کنید، تعداد تکرار را از ۱ تا ۱۰٬۰۰۰ تعیین کنید و انتخاب کنید بین تکرارها چه بیاید: خط جدید، فاصله، ویرگول، خط عمودی، هیچ‌چیز یا جداکنندهٔ سفارشی مثل ---. خروجی همزمان با تایپ به‌روز می‌شود و شمارندهٔ کاراکتر طول ورودی را نشان می‌دهد. نتیجه را کپی کنید یا با نام repeated-text.txt دانلود کنید.\n\nبرای محافظت از مرورگر سقفی وجود دارد: اگر نتیجه از ۱٬۰۰۰٬۰۰۰ کاراکتر بیشتر شود، ابزار به‌جای ساختنش پیام «خروجی خیلی بزرگ است» نشان می‌دهد و باید تعداد را کم یا متن را کوتاه کنید. همه‌چیز محلی اجرا می‌شود و چیزی آپلود نمی‌شود.",
        faq: [
          {
            q: "متن را حداکثر چند بار می‌توانم تکرار کنم؟",
            a: "از ۱ تا ۱۰٬۰۰۰ بار، به شرطی که کل خروجی در ۱٬۰۰۰٬۰۰۰ کاراکتر بماند.",
          },
          {
            q: "چه جداکننده‌هایی هست؟",
            a: "خط جدید، فاصله، ویرگول، خط عمودی، بدون جداکننده، یا جداکنندهٔ سفارشی که خودتان تایپ می‌کنید، مثل ---.",
          },
          {
            q: "چرا می‌گوید خروجی خیلی بزرگ است؟",
            a: "چون نتیجه از ۱٬۰۰۰٬۰۰۰ کاراکتر بیشتر می‌شد. تعداد تکرار را کم یا متن ورودی را کوتاه کنید تا دوباره ساخته شود.",
          },
          {
            q: "نتیجه را چطور ذخیره کنم؟",
            a: "از دکمهٔ کپی در پنل خروجی یا دکمهٔ دانلود استفاده کنید که فایل متنی ساده‌ای با نام repeated-text.txt ذخیره می‌کند.",
          },
          {
            q: "آیا متنم جایی آپلود می‌شود؟",
            a: "نه. متن در مرورگر شما تکرار می‌شود و به هیچ سروری فرستاده نمی‌شود.",
          },
        ],
        steps: [
          "متنی را که باید تکرار شود تایپ یا جای‌گذاری کنید.",
          "تعداد تکرار را تعیین کنید و یک جداکننده انتخاب کنید.",
          "خروجی و تعداد تکرار را بررسی کنید.",
          "نتیجه را کپی کنید یا به‌صورت فایل ‎.txt دانلود کنید.",
        ],
      },
    },
    en: {
      intro:
        "Text Repeater repeats a piece of text as many times as you tell it to, with the separator of your choice between the copies. It's handy for generating test data, filling a layout with placeholder content, building patterns, or making a long block of text to stress-test an input field.\n\nType or paste the text, set a repeat count from 1 to 10,000 and pick what goes between repetitions: a newline, a space, a comma, a pipe, nothing at all, or a custom separator such as ---. The output updates as you type, and a character counter shows the length of your input. Copy the result or download it as repeated-text.txt.\n\nThere's a ceiling to protect your browser: if the result would be longer than 1,000,000 characters the tool shows an \"Output too large\" notice instead of generating it, and you reduce the count or shorten the text. Everything runs locally and nothing is uploaded.",
      faq: [
        {
          q: "How many times can I repeat the text?",
          a: "From 1 to 10,000 times, as long as the whole output stays within 1,000,000 characters.",
        },
        {
          q: "What separators are available?",
          a: "Newline, space, comma, pipe, none, or a custom separator you type, such as ---.",
        },
        {
          q: "Why does it say the output is too large?",
          a: "The result would exceed 1,000,000 characters. Lower the repeat count or shorten the input text and it will generate again.",
        },
        {
          q: "How do I save the result?",
          a: "Use the copy button on the output panel, or the Download button, which saves a plain-text file named repeated-text.txt.",
        },
        {
          q: "Is my text uploaded anywhere?",
          a: "No. The text is repeated in your browser and never sent to a server.",
        },
      ],
      steps: [
        "Type or paste the text to repeat.",
        "Set the repeat count and choose a separator.",
        "Check the output and the repeated count.",
        "Copy the result or download it as a .txt file.",
      ],
    },
    ar: {
      intro:
        "أداة تكرار النص تكرر مقطعًا نصيًا بعدد المرات الذي تحدده، مع الفاصل الذي تختاره بين النسخ. تفيد في توليد بيانات اختبار، أو ملء تصميم بمحتوى مؤقت، أو بناء أنماط، أو إنشاء كتلة نص طويلة لاختبار حقل إدخال تحت الضغط.\n\nاكتب النص أو الصقه، وحدّد عدد التكرار من 1 إلى 10,000، واختر ما يفصل بين التكرارات: سطر جديد، أو مسافة، أو فاصلة، أو خط رأسي، أو لا شيء، أو فاصل مخصّص مثل ---. يتحدّث الناتج أثناء الكتابة، ويعرض عدّاد الأحرف طول ما أدخلته. انسخ النتيجة أو نزّلها بصيغة repeated-text.txt.\n\nهناك سقف لحماية متصفحك: إذا كانت النتيجة ستتجاوز 1,000,000 حرف تعرض الأداة إشعار \"الناتج كبير جدًا\" بدل توليدها، وعليك تقليل العدد أو تقصير النص. كل شيء يعمل محليًا ولا يُرفع شيء.",
      faq: [
        {
          q: "كم مرة يمكنني تكرار النص؟",
          a: "من 1 إلى 10,000 مرة، ما دام الناتج كله ضمن 1,000,000 حرف.",
        },
        {
          q: "ما الفواصل المتاحة؟",
          a: "سطر جديد، ومسافة، وفاصلة، وخط رأسي، وبدون فاصل، أو فاصل مخصّص تكتبه مثل ---.",
        },
        {
          q: "لماذا تقول الأداة إن الناتج كبير جدًا؟",
          a: "لأن النتيجة ستتجاوز 1,000,000 حرف. قلّل عدد التكرار أو قصّر النص المُدخل فيُولَّد الناتج من جديد.",
        },
        {
          q: "كيف أحفظ النتيجة؟",
          a: "استخدم زر النسخ في لوحة الناتج، أو زر التنزيل الذي يحفظ ملفًا نصيًا باسم repeated-text.txt.",
        },
        {
          q: "هل يُرفع نصي إلى أي مكان؟",
          a: "لا. يُكرَّر النص في متصفحك ولا يُرسل إلى أي خادم.",
        },
      ],
      steps: [
        "اكتب النص المراد تكراره أو الصقه.",
        "حدّد عدد التكرار واختر فاصلًا.",
        "راجع الناتج وعدد مرات التكرار.",
        "انسخ النتيجة أو نزّلها بصيغة ‎.txt.",
      ],
    },
  },
  "bingo-card-generator": {
    related: ["wheel-of-names", "group-maker", "classroom-timer"],
    en: {
      intro:
        "Bingo Card Generator makes printable bingo cards two ways: classic number bingo with the standard 1–75 B-I-N-G-O layout, or custom word bingo where you supply your own word or phrase pool — handy for a vocabulary review game, a conference icebreaker, a holiday party, or a classroom unit review where the squares are terms instead of numbers.\n\nIn number mode, each card draws 5 numbers per column from that column's standard range (B: 1–15, I: 16–30, N: 31–45, G: 46–60, O: 61–75), with the center square marked FREE, just like a traditional bingo hall card. In word mode, paste your list of words or phrases — one per line — set a card size (5×5 is the default, but you can go smaller or larger), and each generated card draws a different random subset, so no two players get an identical sheet.\n\nGenerate as many cards as your group needs in one batch, then click Print for a clean, paper-friendly layout. Everything is generated locally in your browser — your word list never leaves your device.",
      faq: [
        {
          q: "What's the difference between number mode and word mode?",
          a: "Number mode makes classic 1–75 bingo cards with the standard B-I-N-G-O column ranges and a FREE center square. Word mode uses a word or phrase pool you provide instead of numbers, so you can play a vocabulary or trivia version.",
        },
        {
          q: "How many words do I need for word mode?",
          a: "At least as many as the card size squared — for a 5×5 card that's 25 unique words. The tool will warn you if your pool is too small to fill a card.",
        },
        {
          q: "Will every card be different?",
          a: "Yes. Each card draws its own random subset of numbers or words, so generating multiple cards for a group produces different sheets, not copies.",
        },
        {
          q: "Can I change the bingo card size?",
          a: "In word mode, yes — set any card size (e.g. 3×3 for a quicker game or 5×5 for the classic layout). Number mode uses the standard 5×5 B-I-N-G-O size.",
        },
        {
          q: "Can I print a batch of cards?",
          a: "Yes, generate as many cards as you need and click Print for a paper-friendly layout with the input form hidden.",
        },
      ],
      steps: [
        "Choose Number mode for classic 1–75 bingo, or Word mode for a custom word pool.",
        "Enter how many cards you want to generate.",
        "For word mode, paste your word or phrase pool (one per line) and set the card size.",
        "Click Generate to create the batch of cards.",
        "Click Print for a paper-friendly handout.",
      ],
    },
    ar: {
      intro:
        "مولّد بطاقات البنغو يصنع بطاقات بنغو قابلة للطباعة بطريقتين: بنغو الأرقام الكلاسيكي بتخطيط B-I-N-G-O المعتاد من 1 إلى 75، أو بنغو الكلمات المخصص حيث تزوّد الأداة بمجموعة كلمات أو عبارات من اختيارك — مفيدة للعبة مراجعة مفردات، أو لكسر الجليد في مؤتمر، أو حفلة في مناسبة، أو مراجعة وحدة دراسية تكون فيها الخانات مصطلحات بدل الأرقام.\n\nفي وضع الأرقام، تسحب كل بطاقة 5 أرقام لكل عمود من نطاقه المعتاد (B: 1–15، I: 16–30، N: 31–45، G: 46–60، O: 61–75)، مع خانة وسطى تحمل علامة FREE تمامًا كبطاقة قاعة البنغو التقليدية. وفي وضع الكلمات، الصق قائمة كلماتك أو عباراتك — واحدة في كل سطر — وحدّد حجم البطاقة (الافتراضي 5×5، ويمكن تصغيره أو تكبيره)، وتسحب كل بطاقة مُولَّدة مجموعة فرعية عشوائية مختلفة، فلا يحصل لاعبان على الورقة نفسها.\n\nولّد بقدر ما يحتاج فريقك من البطاقات دفعة واحدة، ثم اضغط \"طباعة\" للحصول على تخطيط نظيف مناسب للورق. كل شيء يُولَّد محليًا في متصفحك — قائمة كلماتك لا تغادر جهازك أبدًا.",
      faq: [
        {
          q: "ما الفرق بين وضع الأرقام ووضع الكلمات؟",
          a: "وضع الأرقام يصنع بطاقات بنغو كلاسيكية من 1 إلى 75 بنطاقات أعمدة B-I-N-G-O المعتادة وخانة وسطى FREE. أما وضع الكلمات فيستخدم مجموعة كلمات أو عبارات تزوّدها أنت بدل الأرقام، فتلعب نسخة مفردات أو معلومات عامة.",
        },
        {
          q: "كم كلمة أحتاج لوضع الكلمات؟",
          a: "على الأقل بقدر مربع حجم البطاقة — لبطاقة 5×5 هذا يعني 25 كلمة فريدة. ستنبّهك الأداة إن كانت مجموعتك صغيرة جدًا لملء البطاقة.",
        },
        {
          q: "هل تختلف كل بطاقة عن الأخرى؟",
          a: "نعم. تسحب كل بطاقة مجموعتها الفرعية العشوائية الخاصة من الأرقام أو الكلمات، فتوليد عدة بطاقات لمجموعة ينتج أوراقًا مختلفة وليست نسخًا متطابقة.",
        },
        {
          q: "هل يمكنني تغيير حجم بطاقة البنغو؟",
          a: "في وضع الكلمات نعم — حدّد أي حجم بطاقة (مثلًا 3×3 للعب أسرع أو 5×5 للتخطيط الكلاسيكي). أما وضع الأرقام فيستخدم الحجم المعتاد 5×5.",
        },
        {
          q: "هل يمكنني طباعة دفعة من البطاقات؟",
          a: "نعم، ولّد بقدر ما تحتاج من البطاقات ثم اضغط \"طباعة\" للحصول على تخطيط مناسب للورق مع إخفاء نموذج الإدخال.",
        },
      ],
      steps: [
        "اختر وضع الأرقام لبنغو كلاسيكي من 1 إلى 75، أو وضع الكلمات لمجموعة كلمات مخصصة.",
        "أدخل عدد البطاقات التي تريد توليدها.",
        "في وضع الكلمات، الصق مجموعة كلماتك أو عباراتك (واحدة في كل سطر) وحدّد حجم البطاقة.",
        "اضغط \"إنشاء\" لتوليد دفعة البطاقات.",
        "اضغط \"طباعة\" للحصول على نسخة ورقية جاهزة للتوزيع.",
      ],
    },
  },

  "classroom-timer": {
    related: ["timer", "pomodoro", "wheel-of-names"],
    extra: {
      fa: {
        intro:
          "تایمر کلاس یک شمارندهٔ معکوس مناسب تمام‌صفحه است که برای جلوی کلاس ساخته شده؛ برای زمان‌گیری آزمون، زمان مطالعهٔ ساکت، فعالیت گروهی یا فاصلهٔ بین دو درس، جایی که همه باید زمان باقی‌مانده را از آن سوی کلاس یک‌نگاه ببینند.\n\nدقیقه را تنظیم کنید، شروع را بزنید و تمام‌صفحه شوید تا اعداد روی پروژکتور یا صفحه را پر کنند. موتور شمارش همان ابزار تایمر عمومی است، فقط مستقیم در حالت شمارش معکوس باز می‌شود و پیشنهاد تمام‌صفحه می‌دهد تا پیش از شروع کلاس لازم نباشد تنظیمات را زیر و رو کنید. وقتی زمان تمام شود صدایی پخش می‌شود و لازم نیست مدام به صفحه نگاه کنید.\n\nکاملاً در مرورگر شما اجرا می‌شود، بدون حساب کاربری و بدون تبلیغ؛ صفحه را باز کنید، زمان را تنظیم کنید و نمایش دهید.",
        faq: [
          {
            q: "این با ابزار تایمر معمولی چه فرقی دارد؟",
            a: "همان تایمر شمارش معکوس است، فقط مستقیم در حالت شمارش معکوس و با پیشنهاد تمام‌صفحه باز می‌شود؛ میان‌بری برای کلاس تا هر بار لازم نباشد تنظیمش کنید.",
          },
          {
            q: "می‌توانم آن را تمام‌صفحه نمایش دهم تا کل کلاس ببیند؟",
            a: "بله، ابزار حالت تمام‌صفحه‌ای دارد که دقیقاً برای همین ساخته شده و اعداد درشتش از آن سوی کلاس دیده می‌شود.",
          },
          {
            q: "وقتی زمان تمام شود صدا پخش می‌شود؟",
            a: "بله، وقتی شمارش معکوس به صفر برسد صدایی پخش می‌شود.",
          },
          {
            q: "باید چیزی نصب کنم یا وارد حساب شوم؟",
            a: "نه. کاملاً در مرورگر شما اجرا می‌شود؛ صفحه را باز کنید، زمان را تنظیم کنید و شروع کنید.",
          },
          {
            q: "آیا برای غیر از کلاس هم می‌شود استفاده‌اش کرد؟",
            a: "بله؛ یک تایمر شمارش معکوس عمومی با پیش‌تنظیم تمام‌صفحهٔ مناسب کلاس است، پس برای جلسه، ارائه یا هر فعالیت زمان‌دار هم به همان اندازه خوب کار می‌کند.",
          },
        ],
        steps: [
          "تعداد دقیقه‌های شمارش معکوس را تنظیم کنید.",
          "برای شروع تایمر روی شروع کلیک کنید.",
          "تمام‌صفحه شوید تا زمان از آن سوی کلاس دیده شود.",
          "منتظر صدا باشید تا زمان تمام شود.",
        ],
      },
    },
    en: {
      intro:
        "Classroom Timer is a fullscreen-friendly countdown built for the front of a room — timing a test, a silent reading period, a group activity, or a transition between subjects, where everyone needs to see the remaining time at a glance from across the room.\n\nSet the minutes, hit start, and go fullscreen so the numbers fill the projector or screen. It's the same countdown engine as the general Timer tool, just opened straight into a countdown preset with a nudge toward fullscreen mode, so you don't have to dig through settings before class starts. A sound plays when time runs out, so you don't have to keep glancing at the screen.\n\nIt runs entirely in your browser with no account and no ads — open the page, set the time, and project it.",
      faq: [
        {
          q: "How is this different from the regular Timer tool?",
          a: "It's the same countdown timer, just opened straight into countdown mode with a prompt to go fullscreen — a shortcut for classroom use so you don't have to configure it each time.",
        },
        {
          q: "Can I display it fullscreen for the whole class to see?",
          a: "Yes, the tool includes a fullscreen mode designed for exactly this — large numbers visible from across the room.",
        },
        {
          q: "Does it make a sound when time is up?",
          a: "Yes, a sound plays when the countdown reaches zero.",
        },
        {
          q: "Do I need to install anything or sign in?",
          a: "No. It runs entirely in your browser — open the page, set your time, and start.",
        },
        {
          q: "Can I use it for something other than a classroom?",
          a: "Yes — it's a general countdown timer with a classroom-friendly fullscreen preset, so it works just as well for meetings, presentations, or any timed activity.",
        },
      ],
      steps: [
        "Set the number of minutes for the countdown.",
        "Click Start to begin the timer.",
        "Enter fullscreen so the time is visible across the room.",
        "Listen for the sound when time runs out.",
      ],
    },
    ar: {
      intro:
        "مؤقّت الصف الدراسي عدّاد تنازلي مصمّم لملء الشاشة أمام الصف — لتوقيت اختبار، أو فترة قراءة صامتة، أو نشاط جماعي، أو الانتقال بين الحصص، حيث يحتاج الجميع لرؤية الوقت المتبقي بنظرة واحدة من أي مكان في الغرفة.\n\nحدّد الدقائق، اضغط \"ابدأ\"، وفعّل وضع ملء الشاشة لتملأ الأرقام جهاز العرض أو الشاشة. هي نفس محرّك العدّ التنازلي في أداة المؤقّت العامة، لكنها تفتح مباشرة على إعداد العد التنازلي مع تلميح لتفعيل ملء الشاشة، فلا تحتاج للبحث في الإعدادات قبل بدء الحصة. يُصدر المؤقّت صوتًا عند انتهاء الوقت، فلا تحتاج لمراقبة الشاشة باستمرار.\n\nيعمل بالكامل داخل متصفحك دون حساب أو إعلانات — افتح الصفحة، حدّد الوقت، واعرضه.",
      faq: [
        {
          q: "ما الفرق بينه وبين أداة المؤقّت العادية؟",
          a: "هو نفس المؤقّت التنازلي، لكنه يفتح مباشرة في وضع العد التنازلي مع اقتراح لتفعيل ملء الشاشة — اختصار لاستخدام الصف الدراسي دون إعداده في كل مرة.",
        },
        {
          q: "هل يمكن عرضه بملء الشاشة ليراه كل الصف؟",
          a: "نعم، تتضمن الأداة وضع ملء شاشة مصمَّمًا لهذا بالضبط — أرقام كبيرة مرئية من أي مكان في الغرفة.",
        },
        {
          q: "هل يصدر صوتًا عند انتهاء الوقت؟",
          a: "نعم، يُصدر صوتًا عندما يصل العد التنازلي إلى الصفر.",
        },
        {
          q: "هل أحتاج لتثبيت شيء أو تسجيل الدخول؟",
          a: "لا. يعمل بالكامل داخل متصفحك — افتح الصفحة، حدّد الوقت، وابدأ.",
        },
        {
          q: "هل يمكن استخدامه لغير الصف الدراسي؟",
          a: "نعم — هو مؤقّت تنازلي عام بإعداد ملء شاشة مناسب للصف، فيعمل بالقدر نفسه من الكفاءة للاجتماعات والعروض التقديمية أو أي نشاط محدد بوقت.",
        },
      ],
      steps: [
        "حدّد عدد دقائق العد التنازلي.",
        "اضغط \"ابدأ\" لتشغيل المؤقّت.",
        "فعّل ملء الشاشة ليكون الوقت مرئيًا من كل الغرفة.",
        "انتظر الصوت عند انتهاء الوقت.",
      ],
    },
  },

  "word-unscrambler": {
    related: ["anagram-solver", "wordle-solver", "word-frequency"],
    en: {
      intro:
        "Word Unscrambler takes a jumble of letters and finds every valid word you can make from them — the tool most people reach for when they're stuck on a Scrabble rack, a Words With Friends turn, a crossword clue, or a word-scramble puzzle in a newspaper or app.\n\nType your letters, optionally set a minimum word length (to skip short two- and three-letter words) or require the results to contain a specific letter, and the results come back grouped by word length — longest first — so it's easy to scan for a game-winning play.\n\nMatching is checked against a large English word list loaded once in your browser; nothing you type is sent to a server. Because it's a single dictionary, some valid words in other languages, proper nouns, or very obscure or regional terms may not appear.",
      faq: [
        {
          q: "What counts as a valid word?",
          a: "Any entry in the tool's built-in English word list. It's a single general-purpose dictionary, so proper nouns and some obscure or regional words may not be included.",
        },
        {
          q: "Can I filter out short words?",
          a: "Yes, set a minimum length and only words at or above that length will show up — useful for skipping trivial two-letter results.",
        },
        {
          q: "Can I require a specific letter in the results?",
          a: "Yes, the \"contains\" filter narrows results to words that include a letter you specify.",
        },
        {
          q: "How are results organized?",
          a: "Results are grouped by word length, with the longest matches shown first, since longer words are usually worth more in tile games.",
        },
        {
          q: "Is this useful for anything besides Scrabble?",
          a: "Yes — crosswords, Words With Friends, word-scramble puzzles, and just settling arguments about whether a word is valid.",
        },
      ],
      steps: [
        "Type or paste your jumbled letters.",
        "Optionally set a minimum word length or a required letter.",
        "Click Solve to find every matching word.",
        "Browse results grouped by word length, longest first.",
      ],
    },
    ar: {
      intro:
        "أداة فك تشتيت الحروف تأخذ حروفًا مبعثرة وتجد كل كلمة صحيحة يمكن تكوينها منها — الأداة التي يلجأ إليها معظم الناس حين يعلقون في لعبة سكرابل، أو دور في Words With Friends، أو دليل كلمات متقاطعة، أو أحجية حروف مبعثرة في صحيفة أو تطبيق.\n\nاكتب حروفك، وحدّد اختياريًا حدًّا أدنى لطول الكلمة (لتخطي الكلمات القصيرة من حرفين أو ثلاثة)، أو اشترط أن تحتوي النتائج على حرف معيّن، وتعود النتائج مُجمّعة حسب طول الكلمة — الأطول أولًا — فيسهل عليك مسحها بحثًا عن كلمة تفوز بها في اللعبة.\n\nتُطابَق الحروف مع قائمة كلمات إنجليزية كبيرة تُحمَّل مرة واحدة في متصفحك؛ ولا يُرسَل ما تكتبه إلى أي خادم. ولأنها قاموس واحد فقط، قد لا تظهر بعض الكلمات الصحيحة بلغات أخرى، أو الأسماء العلَم، أو المصطلحات النادرة أو الإقليمية جدًا.",
      faq: [
        {
          q: "ما الذي يُعتبر كلمة صحيحة؟",
          a: "أي إدخال في قائمة الكلمات الإنجليزية المدمجة في الأداة. هي قاموس عام واحد، فقد لا تتضمن بعض الأسماء العلَم أو الكلمات النادرة أو الإقليمية.",
        },
        {
          q: "هل يمكنني استبعاد الكلمات القصيرة؟",
          a: "نعم، حدّد حدًّا أدنى للطول ولن تظهر إلا الكلمات التي تساويه أو تتجاوزه — مفيد لتخطي نتائج الحرفين التافهة.",
        },
        {
          q: "هل يمكنني اشتراط حرف معيّن في النتائج؟",
          a: "نعم، مرشّح \"يحتوي على\" يضيّق النتائج إلى الكلمات التي تتضمن حرفًا تحدّده.",
        },
        {
          q: "كيف تُنظَّم النتائج؟",
          a: "تُجمَّع النتائج حسب طول الكلمة، مع عرض أطول التطابقات أولًا، لأن الكلمات الأطول عادة ما تكون أعلى قيمة في ألعاب الأحرف.",
        },
        {
          q: "هل هي مفيدة لغير سكرابل؟",
          a: "نعم — للكلمات المتقاطعة، وWords With Friends، وأحاجي الحروف المبعثرة، ولحسم الجدل حول صحة كلمة ما.",
        },
      ],
      steps: [
        "اكتب أو الصق حروفك المبعثرة.",
        "حدّد اختياريًا حدًّا أدنى لطول الكلمة أو حرفًا مطلوبًا.",
        "اضغط \"حل\" لإيجاد كل كلمة مطابقة.",
        "تصفّح النتائج مُجمّعة حسب الطول، الأطول أولًا.",
      ],
    },
  },

  "wordle-solver": {
    related: ["word-unscrambler", "anagram-solver", "word-frequency"],
    en: {
      intro:
        "Wordle Solver helps you narrow down candidates for the daily 5-letter word puzzle. Enter the letters you've already guessed, then mark each tile the same way the game does: gray for a letter that's not in the word, yellow for a letter that's in the word but the wrong position, and green for a letter that's correct and in the right spot.\n\nClick through each tile to cycle its color, and the tool filters its word list down to every 5-letter word consistent with those constraints — including the trickier cases, like a letter that's yellow in one spot and gray elsewhere, meaning the word contains it exactly once, just not there.\n\nIt's meant to help you think through your next guess or settle a debate about whether a word was possible, not to spoil the puzzle before you've tried. Matching runs against a general English word list loaded in your browser — nothing you enter is sent anywhere.",
      faq: [
        {
          q: "How do I mark a tile's color?",
          a: "Type the letter, then click the tile below it to cycle through gray, yellow, and green — the same three states Wordle uses.",
        },
        {
          q: "What if a letter appears more than once?",
          a: "Mark each occurrence the way Wordle showed it. If a letter is yellow in one position and gray in another, the tool understands that as \"the word contains this letter exactly once, just not in that gray spot.\"",
        },
        {
          q: "Do I need to fill in all 5 tiles?",
          a: "No, enter as many letters and colors as you know so far; the tool filters based on whatever constraints you've provided.",
        },
        {
          q: "Does it guarantee the actual answer?",
          a: "No — it returns every word in its dictionary consistent with your clues. If the real answer isn't in that word list it won't appear, and if several words fit your clues equally, they'll all show up.",
        },
        {
          q: "Is this cheating?",
          a: "That's up to you. Some people use it to double-check a guess or learn from a stuck puzzle rather than see the answer outright.",
        },
      ],
      steps: [
        "Type each guessed letter into its tile.",
        "Click a tile to cycle its color: gray, yellow, then green.",
        "Repeat for every letter you've guessed so far.",
        "Click Solve to see every word consistent with your clues.",
      ],
    },
    ar: {
      intro:
        "حلّال ووردل يساعدك على تضييق قائمة المرشّحين لأحجية الكلمة اليومية المكوّنة من 5 أحرف. أدخل الحروف التي خمّنتها بالفعل، ثم علّم كل خانة كما تفعل اللعبة تمامًا: رمادي للحرف غير الموجود في الكلمة، أصفر للحرف الموجود لكن في موضع خاطئ، وأخضر للحرف الصحيح في موضعه الصحيح.\n\nاضغط على كل خانة للتنقّل بين ألوانها، وتُصفّي الأداة قائمة كلماتها إلى كل كلمة من 5 أحرف تتوافق مع هذه القيود — بما في ذلك الحالات الأدق، مثل حرف أصفر في موضع ورمادي في موضع آخر، أي أن الكلمة تحتوي عليه مرة واحدة بالضبط، لكن ليس في ذلك الموضع الرمادي.\n\nالهدف مساعدتك على التفكير في تخمينك التالي أو حسم جدل حول إمكانية كلمة ما، لا إفساد الأحجية قبل أن تجرّب. تُطابَق الحروف مع قائمة كلمات إنجليزية عامة مُحمَّلة في متصفحك — ولا يُرسَل ما تُدخله إلى أي مكان.",
      faq: [
        {
          q: "كيف أعلّم لون خانة؟",
          a: "اكتب الحرف، ثم اضغط الخانة أسفله للتنقّل بين الرمادي والأصفر والأخضر — الحالات الثلاث نفسها التي تستخدمها ووردل.",
        },
        {
          q: "ماذا لو تكرّر حرف أكثر من مرة؟",
          a: "علّم كل ظهور كما أظهرته ووردل بالضبط. إن كان الحرف أصفر في موضع ورماديًا في آخر، تفهم الأداة ذلك على أن \"الكلمة تحتوي هذا الحرف مرة واحدة فقط، وليس في ذلك الموضع الرمادي\".",
        },
        {
          q: "هل يجب ملء الخانات الخمس كلها؟",
          a: "لا، أدخل بقدر ما تعرفه من حروف وألوان حتى الآن؛ تُصفّي الأداة النتائج بحسب القيود المتوفرة فقط.",
        },
        {
          q: "هل تضمن الحل الصحيح فعليًا؟",
          a: "لا — تعرض كل كلمة في قاموسها تتوافق مع أدلتك. فإن لم تكن الإجابة الحقيقية ضمن تلك القائمة فلن تظهر، وإن توافقت عدة كلمات مع أدلتك بالتساوي فستظهر كلها.",
        },
        {
          q: "هل هذا يُعد غشًّا؟",
          a: "الأمر يعود إليك. بعض المستخدمين يستعملونها للتحقق من تخمين أو التعلّم من أحجية عالقة، لا لرؤية الإجابة مباشرة.",
        },
      ],
      steps: [
        "اكتب كل حرف خمّنته في خانته.",
        "اضغط الخانة للتنقّل بين ألوانها: رمادي ثم أصفر ثم أخضر.",
        "كرّر لكل الحروف التي خمّنتها حتى الآن.",
        "اضغط \"حل\" لرؤية كل كلمة تتوافق مع أدلتك.",
      ],
    },
  },

  "anagram-solver": {
    related: ["word-unscrambler", "wordle-solver", "word-frequency"],
    en: {
      intro:
        "Anagram Solver finds every word that can be spelled using exactly the letters you provide, no more and no less — the classic anagram puzzle, useful for word games, crosswords that ask for an anagram of a given word, or just settling whether \"listen\" really does rearrange into \"silent\" (it does).\n\nBy default it looks for exact anagrams — words that use every one of your letters exactly once. Turn on the \"allow shorter\" option and it also finds sub-anagrams: valid words made from a subset of your letters, grouped by length so you can browse from longest to shortest.\n\nMatching runs against a general English word list loaded once in your browser, and nothing you type is sent anywhere. Because it's a single dictionary, some proper nouns or very obscure words may not appear in results.",
      faq: [
        {
          q: "What's the difference between an exact anagram and a sub-anagram?",
          a: "An exact anagram uses every letter you entered exactly once. A sub-anagram (found with \"allow shorter\" turned on) uses only some of your letters — still a valid word, just shorter.",
        },
        {
          q: "Why did I get zero results?",
          a: "Not every jumble of letters rearranges into a dictionary word. Try turning on \"allow shorter\" to find valid words from a subset of your letters instead.",
        },
        {
          q: "Does letter case or repeated letters matter?",
          a: "Case doesn't matter, but repeated letters do — the word you're looking for must use the same letters, including duplicates, that you entered.",
        },
        {
          q: "How are sub-anagram results organized?",
          a: "They're grouped by word length, longest first, so you can scan for the best-scoring option in a game.",
        },
        {
          q: "Are my letters sent to a server?",
          a: "No. Matching happens entirely in your browser against a local word list.",
        },
      ],
      steps: [
        "Type the letters you want to find anagrams of.",
        "Optionally turn on \"allow shorter\" to include sub-anagrams.",
        "Click Solve.",
        "Browse the results — grouped by length if sub-anagrams are included.",
      ],
    },
    ar: {
      intro:
        "حلّال الجُناس يجد كل كلمة يمكن تهجئتها باستخدام حروفك بالضبط، لا أكثر ولا أقل — أحجية الجُناس الكلاسيكية، مفيدة لألعاب الكلمات، أو الكلمات المتقاطعة التي تطلب جناسًا لكلمة معيّنة، أو لحسم ما إذا كانت \"listen\" تُعاد ترتيبها فعلًا إلى \"silent\" (نعم، هذا صحيح).\n\nتبحث الأداة افتراضيًا عن الجُناس الدقيق — كلمات تستخدم كل حرف من حروفك مرة واحدة بالضبط. فعّل خيار \"السماح بكلمات أقصر\" لتجد أيضًا جُناسًا فرعيًا: كلمات صحيحة مكوّنة من جزء فقط من حروفك، مُجمّعة حسب الطول لتتصفّحها من الأطول إلى الأقصر.\n\nتُطابَق الحروف مع قائمة كلمات إنجليزية عامة تُحمَّل مرة واحدة في متصفحك، ولا يُرسَل ما تكتبه إلى أي مكان. ولأنها قاموس واحد فقط، قد لا تظهر بعض الأسماء العلَم أو الكلمات النادرة جدًا في النتائج.",
      faq: [
        {
          q: "ما الفرق بين الجُناس الدقيق والجُناس الفرعي؟",
          a: "الجُناس الدقيق يستخدم كل حرف أدخلته مرة واحدة بالضبط. أما الجُناس الفرعي (يظهر عند تفعيل \"السماح بكلمات أقصر\") فيستخدم بعض حروفك فقط — كلمة صحيحة، لكنها أقصر.",
        },
        {
          q: "لماذا حصلت على صفر نتائج؟",
          a: "ليس كل خليط من الحروف يُعاد ترتيبه إلى كلمة موجودة في القاموس. جرّب تفعيل \"السماح بكلمات أقصر\" لإيجاد كلمات صحيحة من جزء من حروفك بدلًا من ذلك.",
        },
        {
          q: "هل حالة الأحرف أو تكرارها مهم؟",
          a: "حالة الأحرف (كبيرة أو صغيرة) لا تهم، لكن تكرار الحرف مهم — يجب أن تستخدم الكلمة المطلوبة الحروف نفسها، بما فيها المكرّرة، التي أدخلتها.",
        },
        {
          q: "كيف تُنظَّم نتائج الجُناس الفرعي؟",
          a: "تُجمَّع حسب طول الكلمة، الأطول أولًا، لتتمكن من مسح أفضل خيار تسجيل نقاط في اللعبة.",
        },
        {
          q: "هل تُرسَل حروفي إلى خادم؟",
          a: "لا. تتم المطابقة بالكامل داخل متصفحك مقابل قائمة كلمات محلية.",
        },
      ],
      steps: [
        "اكتب الحروف التي تريد إيجاد جُناس لها.",
        "فعّل اختياريًا \"السماح بكلمات أقصر\" لتضمين الجُناس الفرعي.",
        "اضغط \"حل\".",
        "تصفّح النتائج — مُجمّعة حسب الطول إن تضمّنت جُناسًا فرعيًا.",
      ],
    },
  },

  // ── Calculators and AI pricing (batch A) ────────────────────────────────────
  "unit-converter": {
    related: [
      "calculator",
      "percentage-calculator",
      "aspect-ratio",
      "number-base-converter",
      "currency-converter",
    ],
    en: {
      intro:
        "This unit converter handles six groups of everyday measurements: length (millimetres, centimetres, metres, kilometres, inches, feet, yards, miles), weight (milligrams, grams, kilograms, ounces, pounds, stone, metric and US tons), temperature (Celsius, Fahrenheit, Kelvin), area (square millimetres up to square kilometres, square inches, feet and yards, acres, hectares), volume (millilitres, litres, cubic metres, US fluid ounces, cups, pints, quarts, gallons, cubic inches and feet) and speed (m/s, km/h, mph, ft/s, knots).\n\nPick a group, choose the From and To units, and type a number into the value box. The result appears as you type, with the working underneath: the value multiplied into a base unit, then divided into the target unit, plus a one-line rate such as 1 km = 0.621371 mi. The swap button flips the two units and their values, and a short list of common conversions sits below for a quick sanity check. Temperature uses the proper offset formulas through Celsius rather than a simple multiplier.",
      whyClientSide:
        "There is no privacy angle worth inventing here — a number and two unit names are not sensitive. What running in the page does give you is speed: the answer updates on every keystroke with no round trip, and there is nothing to sign up for.",
      limitations: [
        "Only the six groups above. There is no currency, time, data size, pressure, energy or fuel economy conversion.",
        "Liquid volumes are US units only (US cup, pint, quart, gallon and fluid ounce). Imperial pints and gallons are not offered, so a UK recipe or fuel figure needs converting separately.",
        "Results are rounded to six decimal places, so a very small amount can show as 0. Some factors, including ounce, pound, stone, acre and km/h, are stored to roughly six significant figures, which is plenty for everyday use but not for scientific work.",
        "You type into the From box only; the converted value is read-only. To go the other way, use the swap button.",
      ],
      faq: [
        {
          q: "Which units can I convert?",
          a: "Length, weight, temperature, area, volume and speed. Each group has its own list of units, and you can only convert within a group, so metres to feet works but kilograms to litres does not.",
        },
        {
          q: "How do I convert Celsius to Fahrenheit?",
          a: "Choose the Temperature group, set From to Celsius and To to Fahrenheit, then type the temperature. The tool converts through Celsius using the standard formulas: Fahrenheit is Celsius times 9/5 plus 32, and Kelvin is Celsius plus 273.15. For example, 0 C shows 32 F and 100 C shows 212 F.",
        },
        {
          q: "Can I convert currency or time here?",
          a: "No. This converter covers physical measurements only. Currency rates change constantly and need live data, which this page does not fetch; there is a separate currency converter on this site.",
        },
        {
          q: "Are the gallons US or imperial?",
          a: "US. The volume group lists US fluid ounces, cups, pints, quarts and gallons. A US gallon is 3.785 litres; an imperial gallon is larger and is not included.",
        },
        {
          q: "Why can I not type into the second box?",
          a: "The lower field shows the result and is read-only. Enter your number in the upper value box, or press the swap button to reverse the direction of the conversion.",
        },
        {
          q: "Does it show how the answer was worked out?",
          a: "Yes. For most groups it shows your value multiplied into a base unit and then divided into the target unit, and a one-line rate for 1 of the source unit. For temperature it lists the two steps through Celsius.",
        },
      ],
      steps: [
        "Choose a group: Length, Weight, Temperature, Area, Volume or Speed.",
        "Select the From and To units from the two menus.",
        "Type a number into the value box; the converted result appears straight away.",
        "Press the swap button to reverse the conversion, or read the working underneath to check the arithmetic.",
      ],
    },
    ar: {
      intro:
        "يغطي محوّل الوحدات هذا ست مجموعات من القياسات اليومية: الطول (ملليمتر وسنتيمتر ومتر وكيلومتر وإنش وقدم وياردة وميل)، والوزن (ملليغرام وغرام وكيلوغرام وأوقية ورطل وستون وطن متري وطن أمريكي)، ودرجة الحرارة (مئوية وفهرنهايت وكلفن)، والمساحة (من الملليمتر المربع حتى الكيلومتر المربع، إضافة إلى الإنش والقدم والياردة المربعة والفدان والهكتار)، والحجم (ملليلتر ولتر ومتر مكعب وأونصة سائلة أمريكية وكوب وباينت وكوارت وجالون وإنش مكعب وقدم مكعبة)، والسرعة (م/ث وكم/س وميل/س وقدم/ث وعقدة).\n\nاختر المجموعة، ثم الوحدة المصدر والوحدة الهدف، واكتب الرقم في خانة القيمة. تظهر النتيجة وأنت تكتب، وتحتها خطوات الحساب: القيمة تُضرب في وحدة أساس ثم تُقسم على معامل الوحدة الهدف، مع سطر يبيّن المعدّل مثل 1 كم = 0.621371 ميل. يبدّل زر التبديل بين الوحدتين وقيمتيهما، وتجد أسفل الصفحة قائمة قصيرة بتحويلات شائعة للتأكد سريعًا. أما درجة الحرارة فتُحسب بمعادلاتها الصحيحة عبر الدرجة المئوية، وليس بمعامل ضرب بسيط.",
      whyClientSide:
        "لا يوجد هنا بعد خصوصية يستحق الحديث عنه، فرقم واسما وحدتين ليسا معلومات حساسة. الفائدة الفعلية هي السرعة: تتحدث النتيجة مع كل حرف تكتبه دون أي اتصال بخادم، ولا حاجة إلى تسجيل.",
      limitations: [
        "المجموعات الست أعلاه فقط. لا يوجد تحويل للعملات أو الوقت أو حجم البيانات أو الضغط أو الطاقة أو استهلاك الوقود.",
        "وحدات السوائل أمريكية فقط (الكوب والباينت والكوارت والجالون والأونصة السائلة الأمريكية). لا يتوفر الباينت ولا الجالون البريطاني، فإن كانت وصفتك أو كمية الوقود بوحدات بريطانية فعليك تحويلها بطريقة أخرى.",
        "تُقرَّب النتائج إلى ست منازل عشرية، فقد تظهر كمية صغيرة جدًا على أنها 0. وبعض المعاملات، ومنها الأونصة والرطل والستون والفدان وكم/س، محفوظة بدقة نحو ست خانات معنوية، وهذا كافٍ للاستخدام اليومي لكنه لا يصلح للعمل العلمي.",
        "تكتب في خانة «من» فقط، أما القيمة المحوّلة فللقراءة فقط. وللتحويل في الاتجاه المعاكس استخدم زر التبديل.",
      ],
      faq: [
        {
          q: "ما الوحدات التي يمكنني تحويلها؟",
          a: "الطول والوزن ودرجة الحرارة والمساحة والحجم والسرعة. لكل مجموعة قائمة وحدات خاصة بها، ولا يمكن التحويل إلا داخل المجموعة الواحدة، فتحويل المتر إلى القدم ممكن، أما الكيلوغرام إلى اللتر فلا.",
        },
        {
          q: "كيف أحوّل من مئوية إلى فهرنهايت؟",
          a: "اختر مجموعة درجة الحرارة، واجعل «من» مئوية و«إلى» فهرنهايت، ثم اكتب الدرجة. تحوّل الأداة عبر الدرجة المئوية بالمعادلات المعتادة: فهرنهايت = المئوية × 9/5 + 32، وكلفن = المئوية + 273.15. فمثلًا 0 مئوية تعطي 32 فهرنهايت، و100 مئوية تعطي 212.",
        },
        {
          q: "هل يمكنني تحويل العملات أو الوقت هنا؟",
          a: "لا. هذا المحوّل مخصص للقياسات الفيزيائية فقط. أسعار العملات تتغير باستمرار وتحتاج إلى بيانات مباشرة لا تجلبها هذه الصفحة، وفي الموقع أداة منفصلة لتحويل العملات.",
        },
        {
          q: "هل الجالون أمريكي أم بريطاني؟",
          a: "أمريكي. تعرض مجموعة الحجم الأونصة السائلة والكوب والباينت والكوارت والجالون بنظامها الأمريكي. الجالون الأمريكي يساوي 3.785 لترات، أما الجالون البريطاني فهو أكبر منه وغير مدرج.",
        },
        {
          q: "لماذا لا أستطيع الكتابة في الخانة الثانية؟",
          a: "الخانة السفلية تعرض النتيجة فقط. اكتب رقمك في خانة القيمة العليا، أو اضغط زر التبديل لعكس اتجاه التحويل.",
        },
        {
          q: "هل تُظهر الأداة كيف حُسبت النتيجة؟",
          a: "نعم. في أغلب المجموعات تعرض قيمتك مضروبة في وحدة أساس ثم مقسومة على معامل الوحدة الهدف، مع سطر يبيّن معدّل وحدة واحدة من المصدر. وفي درجة الحرارة تعرض الخطوتين عبر الدرجة المئوية.",
        },
      ],
      steps: [
        "اختر المجموعة: الطول أو الوزن أو درجة الحرارة أو المساحة أو الحجم أو السرعة.",
        "حدّد وحدة «من» ووحدة «إلى» من القائمتين.",
        "اكتب رقمًا في خانة القيمة لتظهر النتيجة المحوّلة فورًا.",
        "اضغط زر التبديل لعكس التحويل، أو راجع خطوات الحساب أسفل النتيجة للتحقق.",
      ],
    },
  },
  "percentage-calculator": {
    related: ["calculator", "loan-calculator", "tip-calculator", "unit-converter"],
    en: {
      intro:
        "This percentage calculator puts the five calculations people actually look up on one page, each in its own card and all live at once. Work out what X% of a number is, what percentage one number is of another, the percentage change between an old and a new value, a number after adding and after subtracting a percentage, and the original value behind a total that already includes a percentage.\n\nThere is no calculate button. Fill in the two boxes in a card and its answer updates immediately; each card is independent, so you can use several without clearing anything. Percentage change reports both the size of the change and whether it is an increase or a decrease, along with the plain difference between the two numbers. The add-or-subtract card shows both outcomes side by side, which is handy for a price with and without a markup or discount.",
      whyClientSide:
        "Honestly, a handful of numbers and a percentage are not sensitive, so privacy is not the point here. The benefit is that every card recalculates as you type, with no page reload and no account.",
      limitations: [
        "It does the arithmetic and nothing more: no rounding to currency, no tax or VAT presets, and no saved history. Results show up to four decimal places with trailing zeros removed.",
        "Empty boxes count as zero, so a card can show a result such as 0 before you have finished typing. Dividing by zero, for example a percentage change from an original value of 0, shows a dash instead of a number.",
        "The reverse card removes a percentage that was added. To undo a discount instead, enter the discount as a negative percentage, such as -20.",
        "Percentage change divides by the absolute value of the original number, so a move from -50 to -25 is reported as a 50% increase because the value went up.",
      ],
      faq: [
        {
          q: "How do I calculate X percent of a number?",
          a: "Use the first card. Enter the percentage and the number, and it multiplies the number by the percentage divided by 100. For example, 25% of 200 is 50.",
        },
        {
          q: "How do I work out what percentage one number is of another?",
          a: "Use the second card. Enter the part and the whole, and it divides the first by the second and multiplies by 100. 50 out of 200 comes to 25%.",
        },
        {
          q: "How is percentage increase or decrease calculated?",
          a: "The third card takes the original and the new value, subtracts one from the other, divides by the original and multiplies by 100. Going from 100 to 125 is a 25% increase with a difference of 25; going the other way is labelled a decrease.",
        },
        {
          q: "How do I add or subtract a percentage, such as a markup or a discount?",
          a: "Use the fourth card. Enter the base number and the percentage and it shows the result after adding that percentage and after subtracting it. 100 with 20% gives 120 and 80.",
        },
        {
          q: "How do I find the original price before a percentage was added?",
          a: "Use the last card. Enter the final value and the percentage that was added, and it divides the final value by one plus the percentage. A total of 120 that includes 20% points back to 100. If the percentage was taken off, enter it as a negative number.",
        },
      ],
      steps: [
        "Find the card that matches your question, such as percentage of a number or percentage change.",
        "Type the two numbers into its boxes.",
        "Read the answer shown under the boxes; it updates as you type.",
      ],
    },
    ar: {
      intro:
        "تجمع حاسبة النسبة المئوية هذه في صفحة واحدة خمس عمليات يبحث عنها الناس فعلًا، لكل منها بطاقة مستقلة وكلها تعمل في الوقت نفسه: كم تساوي نسبة معينة من رقم، وكم نسبة رقم من رقم آخر، ونسبة التغيّر بين قيمة قديمة وقيمة جديدة، والرقم بعد إضافة نسبة وبعد طرحها، والقيمة الأصلية التي يقف خلفها مجموع يشمل نسبة مضافة.\n\nلا يوجد زر للحساب. املأ الخانتين في البطاقة فتتحدّث إجابتها فورًا، وكل بطاقة مستقلة عن الأخرى فيمكنك استخدام عدة بطاقات دون مسح شيء. تعرض نسبة التغيّر حجم التغيّر وهل هو زيادة أم نقصان، إلى جانب الفرق المجرّد بين الرقمين. وتعرض بطاقة الإضافة والطرح النتيجتين جنبًا إلى جنب، وهذا مفيد لمعرفة السعر مع هامش ربح أو مع خصم ودونه.",
      whyClientSide:
        "بصراحة، بضعة أرقام ونسبة مئوية ليست معلومات حساسة، فالخصوصية ليست الفكرة هنا. الفائدة أن كل بطاقة تُعيد الحساب أثناء الكتابة دون إعادة تحميل للصفحة ودون حساب.",
      limitations: [
        "تقوم الأداة بالعملية الحسابية فقط: لا تقريب للعملات ولا إعدادات جاهزة للضريبة أو القيمة المضافة ولا سجل محفوظ. وتُعرض النتائج بحد أقصى أربع منازل عشرية مع حذف الأصفار الزائدة.",
        "الخانات الفارغة تُحتسب صفرًا، فقد تظهر نتيجة مثل 0 قبل أن تنتهي من الكتابة. أما القسمة على صفر، كأن تكون القيمة الأصلية في نسبة التغيّر 0، فتظهر شرطة بدل الرقم.",
        "بطاقة الحساب العكسي تزيل نسبة كانت مضافة. ولإلغاء خصم بدلًا من ذلك، أدخل الخصم كنسبة سالبة مثل -20.",
        "تقسم نسبة التغيّر على القيمة المطلقة للرقم الأصلي، لذلك يُعرض الانتقال من -50 إلى -25 على أنه زيادة بنسبة 50% لأن القيمة ارتفعت.",
      ],
      faq: [
        {
          q: "كيف أحسب نسبة مئوية من رقم؟",
          a: "استخدم البطاقة الأولى. أدخل النسبة والرقم فتضرب الأداة الرقم في النسبة مقسومة على 100. فمثلًا 25% من 200 تساوي 50.",
        },
        {
          q: "كيف أعرف كم تبلغ نسبة رقم من رقم آخر؟",
          a: "استخدم البطاقة الثانية. أدخل الجزء والكل فتقسم الأول على الثاني وتضرب الناتج في 100. فالعدد 50 من 200 يساوي 25%.",
        },
        {
          q: "كيف تُحسب نسبة الزيادة أو النقصان؟",
          a: "تأخذ البطاقة الثالثة القيمة الأصلية والقيمة الجديدة، وتطرح إحداهما من الأخرى، ثم تقسم على الأصلية وتضرب في 100. الانتقال من 100 إلى 125 زيادة بنسبة 25% وفرق قدره 25، وفي الاتجاه المعاكس تُسمّى النتيجة نقصانًا.",
        },
        {
          q: "كيف أضيف نسبة أو أطرحها، مثل هامش الربح أو الخصم؟",
          a: "استخدم البطاقة الرابعة. أدخل الرقم الأساسي والنسبة فتعرض الناتج بعد إضافة النسبة وبعد طرحها. الرقم 100 مع 20% يعطي 120 و80.",
        },
        {
          q: "كيف أعرف السعر الأصلي قبل إضافة النسبة؟",
          a: "استخدم البطاقة الأخيرة. أدخل القيمة النهائية والنسبة التي أُضيفت فتقسم الأداة القيمة النهائية على واحد زائد النسبة. فمجموع 120 يشمل 20% يرجع إلى 100. وإن كانت النسبة قد خُصمت فأدخلها بإشارة سالبة.",
        },
      ],
      steps: [
        "اختر البطاقة المناسبة لسؤالك، مثل نسبة من رقم أو نسبة التغيّر.",
        "اكتب الرقمين في خانتيها.",
        "اقرأ الإجابة تحت الخانتين، فهي تتحدّث أثناء الكتابة.",
      ],
    },
  },
  "loan-calculator": {
    related: [
      "percentage-calculator",
      "calculator",
      "currency-converter",
      "expense-tracker",
    ],
    en: {
      intro:
        "This loan calculator works out the monthly payment on a fixed-rate loan from three numbers: the amount borrowed, the annual interest rate and the term in years. It then shows the total you will repay, the total interest, and how that total splits between principal and interest, both as percentages and as a proportional bar. The starting values are 10,000 at 5% over 3 years, so you see a worked example immediately.\n\nTurn on the payment schedule to see every month in a table: the payment, how much of it went to principal, how much to interest, and the balance still owed. The calculation uses the standard amortization formula with interest compounded monthly and payments made at the end of each month. A rate of 0% is handled as a simple division of the amount by the number of months. The term can be a decimal, so 2.5 years is 30 payments.",
      whyClientSide:
        "A loan amount and rate can be personal, and here they stay in the page rather than being sent to a server or a lender's lead form. The practical gain is that you can change any number and watch the payment, interest and schedule update straight away.",
      limitations: [
        "Fixed-rate, monthly payments only. There are no extra or one-off payments, no variable or promotional rates, and no choice of weekly or fortnightly payment.",
        "Fees, insurance, property tax and a down payment are not modelled, so the figures are the loan's own payments rather than an APR or a full mortgage cost. Subtract any down payment from the price yourself before entering the amount.",
        "Amounts are always formatted in US dollars with a $ sign. The arithmetic is the same for any currency, but the symbol will not change.",
        "A lender's quote can differ by a few cents or more because of rounding conventions, day-count methods and the date the first payment falls due.",
      ],
      faq: [
        {
          q: "How is the monthly payment calculated?",
          a: "It uses the standard fixed-payment formula: the annual rate is divided by 12 to get a monthly rate r, and the payment is amount x r x (1 + r)^n divided by ((1 + r)^n - 1), where n is the number of months. At 0% interest the payment is simply the amount divided by n.",
        },
        {
          q: "Can I use it for a mortgage, car loan or personal loan?",
          a: "Yes for the loan's own payment, as long as the rate is fixed and you pay monthly. Mortgage extras such as property tax, insurance and fees are not included, and the amount should be the sum you borrow after any down payment.",
        },
        {
          q: "What is the amortization schedule?",
          a: "It is the month-by-month breakdown of the loan. Early payments are mostly interest, and the share going to principal grows each month as the balance falls. Use the show schedule link under the results to open the table.",
        },
        {
          q: "How much interest will I pay in total?",
          a: "The total interest card shows it: total repaid minus the amount borrowed. The principal and interest percentages next to it show how much of everything you pay goes to each.",
        },
        {
          q: "Can I enter a loan term in months?",
          a: "The term box is in years, but it accepts decimals. Divide the months by 12, so 18 months is 1.5 years and 30 months is 2.5 years.",
        },
        {
          q: "Can I model extra payments?",
          a: "No. This calculator assumes every payment is the same fixed amount until the loan is repaid.",
        },
      ],
      steps: [
        "Enter the loan amount, the annual interest rate and the term in years.",
        "Read the monthly payment, total repaid and total interest, and the principal and interest split.",
        "Open the payment schedule to see each month's principal, interest and remaining balance.",
      ],
    },
    ar: {
      intro:
        "تحسب هذه الأداة القسط الشهري لقرض بفائدة ثابتة اعتمادًا على ثلاثة أرقام: المبلغ المقترض، ومعدل الفائدة السنوي، والمدة بالسنوات. ثم تعرض إجمالي ما ستسدده، وإجمالي الفوائد، وكيف يتوزع هذا الإجمالي بين أصل القرض والفائدة، بنسب مئوية وبشريط يوضح التناسب. القيم الابتدائية هي 10,000 بفائدة 5% لمدة 3 سنوات، فترى مثالًا محسوبًا فور فتح الصفحة.\n\nفعّل جدول السداد لترى كل شهر في جدول: القسط، والجزء الذي ذهب إلى أصل القرض، والجزء الذي ذهب إلى الفائدة، والرصيد المتبقي. تعتمد الأداة معادلة الإهلاك المعتادة بفائدة تُحتسب شهريًا ودفعات في نهاية كل شهر. وإذا كانت الفائدة 0% فيُقسم المبلغ ببساطة على عدد الأشهر. ويمكن أن تكون المدة كسرًا عشريًا، فسنتان ونصف تساوي 30 قسطًا.",
      whyClientSide:
        "مبلغ القرض ومعدل الفائدة قد يكونان شخصيين، وهما هنا يبقيان داخل الصفحة بدل إرسالهما إلى خادم أو إلى نموذج طلب لدى مصرف. والفائدة العملية أنك تغيّر أي رقم فتتحدّث الأقساط والفوائد والجدول فورًا.",
      limitations: [
        "قرض بفائدة ثابتة وأقساط شهرية فقط. لا توجد دفعات إضافية أو دفعة واحدة، ولا فوائد متغيرة أو ترويجية، ولا خيار للسداد الأسبوعي أو كل أسبوعين.",
        "الرسوم والتأمين وضريبة العقار والدفعة الأولى غير محتسبة، فالأرقام هي أقساط القرض نفسه وليست معدل النسبة السنوية (APR) ولا التكلفة الكاملة للرهن العقاري. اطرح الدفعة الأولى من السعر بنفسك قبل إدخال المبلغ.",
        "تُعرض المبالغ دائمًا بالدولار الأمريكي مع علامة $. الحساب نفسه صحيح لأي عملة، لكن الرمز لن يتغيّر.",
        "قد يختلف عرض المصرف بقروش أو أكثر بسبب طرق التقريب واحتساب الأيام وتاريخ استحقاق القسط الأول.",
      ],
      faq: [
        {
          q: "كيف يُحسب القسط الشهري؟",
          a: "بمعادلة القسط الثابت المعتادة: يُقسم معدل الفائدة السنوي على 12 للحصول على المعدل الشهري r، ويكون القسط = المبلغ × r × (1 + r)^n ÷ ((1 + r)^n - 1)، حيث n عدد الأشهر. وعند فائدة 0% يساوي القسط المبلغ مقسومًا على n.",
        },
        {
          q: "هل يصلح لقرض عقاري أو قرض سيارة أو قرض شخصي؟",
          a: "نعم لحساب قسط القرض نفسه، بشرط أن تكون الفائدة ثابتة والسداد شهريًا. أما إضافات الرهن العقاري كضريبة العقار والتأمين والرسوم فغير مشمولة، ويجب أن يكون المبلغ هو ما تقترضه فعلًا بعد الدفعة الأولى.",
        },
        {
          q: "ما هو جدول السداد؟",
          a: "هو التفصيل الشهري للقرض. الأقساط الأولى يذهب معظمها إلى الفائدة، ثم تكبر حصة أصل القرض كل شهر مع انخفاض الرصيد. اضغط رابط إظهار الجدول تحت النتائج لفتحه.",
        },
        {
          q: "كم سأدفع فوائد في المجموع؟",
          a: "تعرضها بطاقة إجمالي الفائدة، وهي إجمالي المسدد ناقص المبلغ المقترض. وتبيّن نسبتا الأصل والفائدة بجانبها حصة كل منهما من مجموع ما تدفعه.",
        },
        {
          q: "هل يمكنني إدخال المدة بالأشهر؟",
          a: "خانة المدة بالسنوات لكنها تقبل الكسور العشرية. قسّم الأشهر على 12، فـ 18 شهرًا تساوي 1.5 سنة و30 شهرًا تساوي 2.5 سنة.",
        },
        {
          q: "هل يمكنني حساب دفعات إضافية؟",
          a: "لا. تفترض الحاسبة أن كل قسط بالمبلغ الثابت نفسه حتى يُسدَّد القرض.",
        },
      ],
      steps: [
        "أدخل مبلغ القرض ومعدل الفائدة السنوي والمدة بالسنوات.",
        "اقرأ القسط الشهري وإجمالي المسدد وإجمالي الفوائد وتوزيع الأصل والفائدة.",
        "افتح جدول السداد لترى أصل القرض والفائدة والرصيد المتبقي لكل شهر.",
      ],
    },
  },
  "model-comparison": {
    related: [
      "ai-cost-calculator",
      "token-counter",
      "context-window",
      "system-prompt-builder",
    ],
    en: {
      intro:
        "This page lines up the large language models people actually choose between in one sortable table: OpenAI's GPT-4o, GPT-4o mini, o1 and o3-mini; Anthropic's Claude Opus, Sonnet and Haiku; Google's Gemini Flash and Pro; Llama 3.3 70B and Llama 3.1 405B as served by third-party hosts; Mistral Large; and DeepSeek V3. For each one you get the context window in tokens, the price per million input tokens, the price per million output tokens, a tier, and whether the model is multimodal.\n\nType in the search box to find a model or provider by name, narrow the table with the provider and tier filters, and click the Model, Context, Input price or Output price headings to sort, clicking again to reverse the order. Tiers are this site's own grouping: flagship, balanced, fast, and open for the open-weight Llama models. On a phone the table turns into one card per model.",
      whyClientSide:
        "There is nothing to protect here: the table is public pricing data and you are not entering any text. The tool simply runs in the page, so filtering and sorting are instant and need no account or API key.",
      limitations: [
        "It compares price, context size, tier and a multimodal flag, not quality. There are no benchmark scores, speed or latency figures, and nothing tells you which model is best at your task.",
        "The figures come from a fixed table kept in the site's code. They are list prices per million tokens at the time the table was last updated and will not follow a provider's price changes on their own; check the provider's own pricing page before you commit to a budget.",
        "Only text-token list prices are shown. Cached-input discounts, batch pricing, long-context surcharges and the cost of images or audio are not included.",
        "The context window is the maximum a model accepts, not what it can generate in one reply, and the multimodal column is a simple yes or no rather than a list of supported input types.",
        "Llama prices are those of a specific host (Groq for 70B, Together for 405B, as named in the provider column), so they will differ from other hosts or from running the model yourself.",
      ],
      faq: [
        {
          q: "Which model is the cheapest?",
          a: "Click the Input price or Output price heading to sort from lowest to highest, or filter by the fast tier. Prices differ by orders of magnitude between the small fast models and the flagships, and many models charge several times more for output than for input.",
        },
        {
          q: "What does price per 1M tokens mean?",
          a: "It is what the provider charges for one million tokens. Input tokens are what you send in the prompt; output tokens are what the model writes back, and they are priced separately. A token is roughly three-quarters of an English word, so a million tokens is on the order of 750,000 words.",
        },
        {
          q: "What does the context window column show?",
          a: "The maximum number of tokens the model can take in a single request. It differs a lot between models, from tens of thousands of tokens to a million or more. Use the Context Window calculator to see how much of it your own text would fill.",
        },
        {
          q: "What do flagship, balanced, fast and open mean?",
          a: "They are labels this page uses to group models, not official vendor categories. Flagship is a provider's top model, balanced sits in the middle, fast is the cheaper, quicker option, and open covers the open-weight Llama models.",
        },
        {
          q: "Are these prices live?",
          a: "No. They are stored in the page, so they are only as current as the last update to the table. Treat them as a way to compare models against each other, and confirm the exact rate with the provider.",
        },
        {
          q: "How do I estimate what a real workload would cost?",
          a: "Use the AI Cost Calculator: pick one of the same models, enter input tokens, output tokens and the number of requests, and it multiplies them by the prices in this table. The Token Counter helps you find the token counts first.",
        },
      ],
    },
    ar: {
      intro:
        "تضع هذه الصفحة نماذج اللغة الكبيرة التي يفاضل الناس بينها فعلًا في جدول واحد قابل للفرز: نماذج OpenAI وهي GPT-4o وGPT-4o mini وo1 وo3-mini؛ ونماذج Anthropic وهي Claude Opus وSonnet وHaiku؛ ونماذج Google وهي Gemini Flash وPro؛ ونموذجا Llama 3.3 70B وLlama 3.1 405B عبر مزوّدي استضافة خارجيين؛ ونموذج Mistral Large؛ ونموذج DeepSeek V3. تحصل لكل نموذج على نافذة السياق بالرموز، وسعر المليون رمز مُدخل، وسعر المليون رمز مُخرج، ومستوى النموذج، وهل هو متعدد الوسائط.\n\nاكتب في خانة البحث لتجد نموذجًا أو مزوّدًا بالاسم، وضيّق الجدول بمرشّحي المزوّد والمستوى، وانقر على عناوين النموذج أو السياق أو سعر الإدخال أو سعر الإخراج للفرز، وانقر مرة ثانية لعكس الترتيب. المستويات تصنيف خاص بالموقع: رائد، ومتوازن، وسريع، ومفتوح لنماذج Llama مفتوحة الأوزان. وعلى الهاتف يتحول الجدول إلى بطاقة لكل نموذج.",
      whyClientSide:
        "لا يوجد ما يستدعي الحماية هنا، فالجدول بيانات أسعار معلنة وأنت لا تُدخل نصًا. الأداة تعمل داخل الصفحة فقط، فيكون الترشيح والفرز فوريين دون حساب أو مفتاح API.",
      limitations: [
        "تقارن الأداة السعر وحجم السياق والمستوى وعلامة تعدد الوسائط، ولا تقارن الجودة. لا توجد نتائج اختبارات أداء ولا أرقام سرعة أو زمن استجابة، ولا شيء يخبرك بأي نموذج أفضل لمهمتك.",
        "الأرقام مأخوذة من جدول ثابت محفوظ في شيفرة الموقع. هي أسعار القائمة لكل مليون رمز وقت آخر تحديث للجدول، ولن تتبع تغيّر أسعار المزوّدين من تلقاء نفسها؛ فراجع صفحة التسعير عند المزوّد قبل أن تعتمد ميزانية.",
        "تُعرض أسعار الرموز النصية فقط. خصومات الإدخال المخزّن مؤقتًا وتسعير الدفعات ورسوم السياق الطويل وتكلفة الصور والصوت غير مشمولة.",
        "نافذة السياق هي أقصى ما يقبله النموذج، وليست ما يستطيع توليده في رد واحد، وعمود تعدد الوسائط مجرد نعم أو لا وليس قائمة بأنواع المدخلات المدعومة.",
        "أسعار Llama هي أسعار مزوّد استضافة بعينه (Groq للنموذج 70B وTogether للنموذج 405B كما يظهر في عمود المزوّد)، فستختلف عن غيره من المزوّدين أو عن تشغيل النموذج بنفسك.",
      ],
      faq: [
        {
          q: "أي نموذج هو الأرخص؟",
          a: "انقر على عنوان سعر الإدخال أو سعر الإخراج للفرز من الأقل إلى الأعلى، أو رشّح حسب المستوى السريع. تتفاوت الأسعار بأضعاف كثيرة بين النماذج الصغيرة السريعة والنماذج الرائدة، وكثير من النماذج تتقاضى على الإخراج أضعاف ما تتقاضاه على الإدخال.",
        },
        {
          q: "ماذا يعني السعر لكل مليون رمز؟",
          a: "هو ما يتقاضاه المزوّد مقابل مليون رمز. رموز الإدخال هي ما ترسله في الطلب، ورموز الإخراج هي ما يكتبه النموذج ردًا، ولكل منهما سعر منفصل. الرمز يعادل تقريبًا ثلاثة أرباع الكلمة الإنجليزية، فمليون رمز يقارب 750,000 كلمة.",
        },
        {
          q: "ماذا يبيّن عمود نافذة السياق؟",
          a: "أقصى عدد من الرموز يقبله النموذج في طلب واحد. وهو يتفاوت كثيرًا بين النماذج، من عشرات الآلاف من الرموز إلى مليون أو أكثر. استخدم حاسبة نافذة السياق لترى كم سيملأ نصك منها.",
        },
        {
          q: "ماذا تعني رائد ومتوازن وسريع ومفتوح؟",
          a: "هي تسميات تستخدمها الصفحة لتجميع النماذج، وليست فئات رسمية من الشركات. الرائد هو أقوى نموذج لدى المزوّد، والمتوازن في المنتصف، والسريع هو الخيار الأرخص والأسرع، والمفتوح يشمل نماذج Llama مفتوحة الأوزان.",
        },
        {
          q: "هل الأسعار مباشرة؟",
          a: "لا. هي محفوظة في الصفحة، فتكون حديثة بقدر آخر تحديث للجدول. اعتبرها وسيلة لمقارنة النماذج ببعضها، وتأكد من السعر الدقيق لدى المزوّد.",
        },
        {
          q: "كيف أقدّر تكلفة عمل حقيقي؟",
          a: "استخدم حاسبة تكلفة الذكاء الاصطناعي: اختر أحد هذه النماذج نفسها وأدخل رموز الإدخال والإخراج وعدد الطلبات، فتضربها في أسعار هذا الجدول. ويساعدك عدّاد الرموز في معرفة أعداد الرموز أولًا.",
        },
      ],
    },
  },
  "color-palette": {
    related: [
      "color-converter",
      "contrast-checker",
      "image-color-picker",
      "css-gradient",
      "color-blindness",
    ],
    en: {
      intro:
        "This color palette generator builds a set of matching colors from a single base color. Choose the base with the color picker, or press Random Palette for a new starting point, then pick a color scheme: complementary (the base plus its opposite on the color wheel), triadic (three colors 120 degrees apart), analogous (five neighbouring hues), split-complementary, tetradic (four colors 90 degrees apart), shades (ten steps from dark to light) or monochromatic (ten steps of saturation at the same hue).\n\nEvery swatch shows its HEX, RGB and HSL values, and clicking a value copies it. You can also copy the whole palette as CSS custom properties (--color-1, --color-2 and so on) or as JSON with HEX, RGB and HSL for each color, or export it as a PNG image. The padlock on a swatch locks that color so it stays put while you change the base color or scheme.",
      whyClientSide:
        "A color palette is not private, so there is no honest privacy argument. What running in the page gives you is immediacy: the swatches redraw the moment you move the picker or change the scheme, and nothing needs installing or signing up for.",
      limitations: [
        "The harmonies are calculated by rotating the hue in the HSL color model while keeping saturation and lightness the same. That is simple and predictable, but not perceptual: a yellow and a blue at the same lightness will not look equally bright, so check your palette by eye.",
        "There is no contrast or accessibility check. Whether two swatches are readable together as text and background is something to test separately.",
        "Colors cannot be pulled from a photo; the palette always starts from the single base color you choose.",
        "Locks follow a swatch's position, not its color. If you switch to a scheme with fewer colors, locked swatches beyond that count disappear.",
        "Palettes are not saved. The palette name field is only a label on the page and is not included in the CSS, JSON or PNG you copy or export. The PNG uses a fixed 200-pixel square per color.",
      ],
      faq: [
        {
          q: "How do I generate a color palette from one color?",
          a: "Set the base color with the color picker, then choose a color scheme. The palette is generated instantly from the base. Press Random Palette to jump to a new random base color with the same scheme.",
        },
        {
          q: "What is the difference between the color schemes?",
          a: "Complementary uses the base and the color opposite it. Triadic uses three evenly spaced hues and tetradic four. Analogous gives five neighbouring hues at 20 and 40 degrees either side of the base. Split-complementary uses the two colors next to the opposite hue. Shades varies lightness from dark to light, and monochromatic varies saturation, both at one hue.",
        },
        {
          q: "How do I keep a color while I try others?",
          a: "Click the padlock on that swatch. Locked colors keep their value when you change the base color or the scheme, as long as the new scheme still has a swatch in that position. Click the padlock again to release it.",
        },
        {
          q: "How can I use the palette in code?",
          a: "Use CSS Variables to get a list such as --color-1: #667eea; ready to paste into a stylesheet, or Copy JSON for an array with the HEX, RGB and HSL of each color. Clicking an individual value also copies that one format.",
        },
        {
          q: "Can I download the palette as an image?",
          a: "Yes. Export PNG saves palette.png: the swatches side by side, each labelled underneath with its HEX and RGB value.",
        },
        {
          q: "Does it check whether colors have enough contrast?",
          a: "No. For text and background contrast, use the Contrast Checker on this site with the HEX values you copy from here.",
        },
      ],
      steps: [
        "Pick a base color with the color picker, or press Random Palette.",
        "Choose a color scheme such as complementary, triadic or analogous.",
        "Lock any swatch you want to keep, then adjust the base or scheme again.",
        "Click a value to copy HEX, RGB or HSL, or use the CSS, JSON or PNG buttons for the whole palette.",
      ],
    },
    ar: {
      intro:
        "يبني مولّد لوحات الألوان هذا مجموعة ألوان متناسقة انطلاقًا من لون أساسي واحد. اختر اللون الأساسي بمنتقي الألوان، أو اضغط «عشوائي» لنقطة بداية جديدة، ثم اختر نظام الألوان: متتام (اللون ومقابله على عجلة الألوان)، أو ثلاثي (ثلاثة ألوان بينها 120 درجة)، أو متجاور (خمس درجات لونية متجاورة)، أو متتام منقسم، أو رباعي (أربعة ألوان بينها 90 درجة)، أو درجات (عشر خطوات من الداكن إلى الفاتح)، أو أحادي اللون (عشر خطوات من التشبّع بالدرجة اللونية نفسها).\n\nيعرض كل مربع لون قيم HEX وRGB وHSL الخاصة به، وتنسخ القيمة بمجرد النقر عليها. ويمكنك أيضًا نسخ اللوحة كاملة كمتغيرات CSS (‎--color-1 و‎--color-2 وهكذا) أو كملف JSON يضم HEX وRGB وHSL لكل لون، أو تصديرها صورة PNG. وقفل المربع يثبّت لونه فلا يتغير حين تعدّل اللون الأساسي أو النظام.",
      whyClientSide:
        "لوحة الألوان ليست معلومات خاصة، فلا حجة صادقة للخصوصية هنا. الفائدة أن العمل داخل الصفحة يعطيك استجابة فورية: تُعاد رسم المربعات لحظة تحريك المنتقي أو تغيير النظام، دون تثبيت أو تسجيل.",
      limitations: [
        "تُحسب التناسقات بتدوير الدرجة اللونية في نموذج HSL مع إبقاء التشبّع والإضاءة كما هما. هذا بسيط ويمكن التنبؤ به، لكنه ليس إدراكيًا: أصفر وأزرق بالإضاءة نفسها لن يبدوا بالسطوع نفسه، فراجع اللوحة بعينك.",
        "لا يوجد فحص للتباين أو إمكانية الوصول. هل يقرأ المستخدم نصًا بلون على خلفية بلون آخر؟ هذا يُفحص بأداة منفصلة.",
        "لا يمكن استخراج الألوان من صورة؛ تبدأ اللوحة دائمًا من اللون الأساسي الواحد الذي تختاره.",
        "القفل مرتبط بموضع المربع وليس بلونه. إذا انتقلت إلى نظام ألوانه أقل، تختفي المربعات المقفلة التي تتجاوز هذا العدد.",
        "اللوحات غير محفوظة. وحقل اسم اللوحة مجرد تسمية في الصفحة ولا يدخل في ملف CSS أو JSON أو PNG الذي تنسخه أو تصدّره. وصورة PNG تستخدم مربعًا ثابتًا بطول 200 بكسل لكل لون.",
      ],
      faq: [
        {
          q: "كيف أولّد لوحة ألوان من لون واحد؟",
          a: "حدّد اللون الأساسي بمنتقي الألوان، ثم اختر نظام الألوان، فتُولَّد اللوحة فورًا من اللون الأساسي. واضغط «لوحة عشوائية» للانتقال إلى لون أساسي عشوائي جديد بالنظام نفسه.",
        },
        {
          q: "ما الفرق بين أنظمة الألوان؟",
          a: "المتتام يستخدم اللون ومقابله. الثلاثي يستخدم ثلاث درجات متساوية التباعد والرباعي أربعًا. المتجاور يعطي خمس درجات متجاورة على بعد 20 و40 درجة على جانبي الأساس. المتتام المنقسم يستخدم اللونين المجاورين للدرجة المقابلة. والدرجات تغيّر الإضاءة من الداكن إلى الفاتح، والأحادي يغيّر التشبّع، وكلاهما بدرجة لونية واحدة.",
        },
        {
          q: "كيف أحتفظ بلون وأجرّب غيره؟",
          a: "انقر على القفل في ذلك المربع. تحتفظ الألوان المقفلة بقيمتها حين تغيّر اللون الأساسي أو النظام، ما دام النظام الجديد فيه مربع في الموضع نفسه. وانقر على القفل مرة ثانية لتحريره.",
        },
        {
          q: "كيف أستخدم اللوحة في الشيفرة؟",
          a: "استخدم «نسخ متغيرات CSS» لتحصل على قائمة مثل ‎--color-1: #667eea; جاهزة للصق في ملف التنسيق، أو «نسخ JSON» لمصفوفة تضم HEX وRGB وHSL لكل لون. والنقر على قيمة مفردة ينسخ تلك الصيغة وحدها.",
        },
        {
          q: "هل يمكنني تنزيل اللوحة كصورة؟",
          a: "نعم. يحفظ زر تصدير PNG ملف palette.png: المربعات جنبًا إلى جنب وتحت كل منها قيمتا HEX وRGB.",
        },
        {
          q: "هل تفحص الأداة كفاية التباين بين الألوان؟",
          a: "لا. لتباين النص والخلفية استخدم أداة فحص التباين في هذا الموقع بقيم HEX التي تنسخها من هنا.",
        },
      ],
      steps: [
        "اختر لونًا أساسيًا بمنتقي الألوان، أو اضغط «لوحة عشوائية».",
        "اختر نظام الألوان، مثل المتتام أو الثلاثي أو المتجاور.",
        "اقفل أي مربع تريد الاحتفاظ به، ثم عدّل اللون الأساسي أو النظام من جديد.",
        "انقر على قيمة لنسخ HEX أو RGB أو HSL، أو استخدم أزرار CSS وJSON وPNG للوحة كاملة.",
      ],
    },
  },
  "ai-cost-calculator": {
    related: [
      "token-counter",
      "model-comparison",
      "context-window",
      "system-prompt-builder",
    ],
    en: {
      intro:
        "The AI Cost Calculator turns token counts into dollars. Choose a model from the list, enter how many input tokens and output tokens one request uses, and say how many requests you will make. It shows the input cost, the output cost and the total for a single request, and when you enter more than one request it adds a total for the whole batch.\n\nThe model's input and output prices per million tokens are shown right under the selector, so you can see exactly what the arithmetic uses. Each cost is the token count divided by one million and multiplied by that price, calculated separately for input and output. The list covers OpenAI, Anthropic, Google, Meta (Llama, via third-party hosts), Mistral and DeepSeek models, and the starting values are 1,000 input tokens, 500 output tokens and one request on GPT-4o. Use Reset to go back to them.",
      whyClientSide:
        "You are typing numbers, not text, so there is no privacy stake to claim. The benefit of running in the page is that the cost updates as you type, you need no API key, and you can try different models and volumes in seconds.",
      limitations: [
        "It estimates from list prices only. Cached-input discounts, batch pricing, long-context surcharges, fine-tuned model rates and charges for images or audio are not modelled.",
        "The prices live in a table stored in the site, so they are only as current as its last update. Providers change prices without notice, and this page will not detect that; confirm the rate on the provider's pricing page.",
        "You supply the token counts. The calculator does not read your prompt, and it only counts what you enter: system prompts, tool definitions, conversation history sent back each turn and a model's hidden reasoning, if it bills for it, are all things you must add yourself.",
        "Token counts are whole numbers: decimals are cut off. A blank or zero request count is treated as one request, and results are shown in US dollars.",
      ],
      faq: [
        {
          q: "How is the cost of an AI API call calculated?",
          a: "Input tokens divided by 1,000,000 and multiplied by the model's input price per million tokens, plus output tokens divided by 1,000,000 and multiplied by its output price. The tool shows each part and the total.",
        },
        {
          q: "How do I find out how many tokens my prompt uses?",
          a: "Paste it into the Token Counter on this site and copy the number across. For the output side, estimate the length of the reply you expect, or use the response length from a test call.",
        },
        {
          q: "Can I estimate a monthly bill?",
          a: "Yes. Enter the tokens for a typical request and set the requests field to your expected monthly volume. The batch total then shows the cost for that many requests.",
        },
        {
          q: "Which model is cheapest?",
          a: "Smaller, faster models generally cost far less per token than flagship ones. Switch the model in the list to compare, or open the Model Comparison page to sort every model by input or output price.",
        },
        {
          q: "Is the result what I will actually be billed?",
          a: "It is an estimate. Real invoices include everything sent in the request, such as system prompts and conversation history, and any discounts or surcharges that apply to your account, none of which this calculator knows about.",
        },
      ],
      steps: [
        "Choose a model from the list and check its input and output prices.",
        "Enter the input tokens, output tokens and number of requests.",
        "Read the input, output and total cost per request, plus the total for all requests.",
      ],
    },
    ar: {
      intro:
        "تحوّل حاسبة تكلفة الذكاء الاصطناعي أعداد الرموز إلى دولارات. اختر نموذجًا من القائمة، وأدخل عدد رموز الإدخال ورموز الإخراج في الطلب الواحد، وحدّد عدد الطلبات التي ستنفّذها. تعرض الأداة تكلفة الإدخال وتكلفة الإخراج والإجمالي للطلب الواحد، وإذا أدخلت أكثر من طلب أضافت إجماليًا للدفعة كلها.\n\nيظهر سعر المليون رمز للإدخال وللإخراج تحت قائمة النموذج مباشرة، فترى بالضبط ما يستخدمه الحساب. وتكلفة كل جزء هي عدد الرموز مقسومًا على مليون ومضروبًا في سعره، ويُحسب الإدخال والإخراج كلٌّ على حدة. تضم القائمة نماذج OpenAI وAnthropic وGoogle وMeta (Llama عبر مزوّدي استضافة خارجيين) وMistral وDeepSeek، والقيم الابتدائية 1,000 رمز إدخال و500 رمز إخراج وطلب واحد على GPT-4o. ويعيدك زر إعادة الضبط إليها.",
      whyClientSide:
        "أنت تكتب أرقامًا لا نصوصًا، فلا يوجد جانب خصوصية يمكن الادعاء به. الفائدة من العمل داخل الصفحة أن التكلفة تتحدّث أثناء الكتابة، ولا تحتاج إلى مفتاح API، ويمكنك تجربة نماذج وأحجام مختلفة في ثوانٍ.",
      limitations: [
        "التقدير قائم على أسعار القائمة فقط. خصومات الإدخال المخزّن مؤقتًا وتسعير الدفعات ورسوم السياق الطويل وأسعار النماذج المضبوطة وتكلفة الصور والصوت غير مشمولة.",
        "الأسعار محفوظة في جدول داخل الموقع، فتكون حديثة بقدر آخر تحديث له. يغيّر المزوّدون أسعارهم دون إشعار ولن تكتشف الصفحة ذلك؛ فتحقق من السعر في صفحة التسعير عند المزوّد.",
        "أنت من يدخل أعداد الرموز. فالحاسبة لا تقرأ طلبك، وتحسب ما تكتبه فقط: تعليمات النظام وتعريفات الأدوات وسجل المحادثة المُرسَل في كل دور وتفكير النموذج الخفي إن كان يُحاسَب عليه، كلها أمور عليك إضافتها بنفسك.",
        "أعداد الرموز أعداد صحيحة: تُقتطع الكسور العشرية. والعدد الفارغ أو الصفر في خانة الطلبات يُعامل كطلب واحد، وتظهر النتائج بالدولار الأمريكي.",
      ],
      faq: [
        {
          q: "كيف تُحسب تكلفة استدعاء واجهة الذكاء الاصطناعي؟",
          a: "رموز الإدخال مقسومة على 1,000,000 ومضروبة في سعر الإدخال للمليون رمز عند النموذج، مضافًا إليها رموز الإخراج مقسومة على 1,000,000 ومضروبة في سعر الإخراج. وتعرض الأداة كل جزء والإجمالي.",
        },
        {
          q: "كيف أعرف عدد الرموز في طلبي؟",
          a: "الصق النص في عدّاد الرموز في هذا الموقع وانقل الرقم إلى هنا. أما رموز الإخراج فقدّر طول الرد المتوقع، أو استخدم طول الرد من استدعاء تجريبي.",
        },
        {
          q: "هل يمكنني تقدير فاتورة شهرية؟",
          a: "نعم. أدخل رموز طلب نموذجي واضبط خانة الطلبات على الحجم الشهري المتوقع، فيعرض إجمالي الدفعة تكلفة هذا العدد من الطلبات.",
        },
        {
          q: "أي نموذج هو الأرخص؟",
          a: "النماذج الأصغر والأسرع أرخص بكثير عادةً لكل رمز من النماذج الرائدة. بدّل النموذج في القائمة للمقارنة، أو افتح صفحة مقارنة النماذج لفرز كل النماذج حسب سعر الإدخال أو الإخراج.",
        },
        {
          q: "هل النتيجة هي ما سأُحاسَب عليه فعلًا؟",
          a: "هي تقدير. الفواتير الحقيقية تشمل كل ما يُرسل في الطلب، مثل تعليمات النظام وسجل المحادثة، وأي خصومات أو رسوم إضافية تنطبق على حسابك، ولا تعرف الحاسبة شيئًا منها.",
        },
      ],
      steps: [
        "اختر نموذجًا من القائمة وراجع سعر الإدخال والإخراج الخاصين به.",
        "أدخل رموز الإدخال ورموز الإخراج وعدد الطلبات.",
        "اقرأ تكلفة الإدخال والإخراج والإجمالي للطلب الواحد، وإجمالي كل الطلبات.",
      ],
    },
  },

  "screen-recorder": {
    related: ["gif-maker", "compress-video", "video", "webcam-test", "mic-test"],
    en: {
      intro:
        "This screen recorder captures your whole screen, a single window or one browser tab, using the browser's own screen-sharing prompt. You choose what to share, press Start, and a 3-2-1 countdown (which you can turn off) gives you a moment to get ready. Press Stop and the recording appears in a list with its length and file size, ready to preview, download as a WebM video or delete.\n\nBefore recording you can pick 720p (the default), 1080p or Maximum, which uses the size of the shared surface. You can add microphone audio, and you can overlay your webcam in one of the four corners at a size you set, which is handy for tutorials and walkthroughs. A saved recording can also be exported as an animated GIF for places that will not take video.",
      whyClientSide:
        "A screen recording can show anything open on your machine: email, dashboards, private chats. Here the picture and sound go from the browser's capture API into a file held in the page's memory, and the tool contains no upload step. Nothing is kept once you close or reload the tab, so download what you want to keep first.",
      limitations: [
        "There is no pause button and no trimming. Recording runs from Start to Stop, so plan the take or cut it afterwards in a video editor.",
        "Recordings live only in memory for the current visit. Reloading or closing the tab discards them, and long high-resolution recordings use a lot of RAM.",
        "The download is always named .webm. Browsers that can only record MP4 will still produce a playable file, but its container may not match the extension, so rename it if your player complains.",
        "GIF export replays the recording and samples it at 8 frames per second, scaled to at most 480 px wide, with no sound. It is meant for short clips and gets slow and large on long ones.",
        "What can be captured, including tab or system audio, depends on your browser and operating system. Desktop browsers support screen capture; most phone browsers do not.",
      ],
      faq: [
        {
          q: "Is the recording uploaded anywhere?",
          a: "No. The page records through the browser's capture API and keeps the result in memory. There is no upload step, and the file only leaves the page when you press Download.",
        },
        {
          q: "Can I record my voice or add my webcam?",
          a: "Yes. Switch on the microphone option to add your voice, and switch on the webcam overlay to place a small camera view in a corner. If the webcam cannot be opened, the tool tells you and records the screen alone.",
        },
        {
          q: "What format is the video?",
          a: "WebM, using VP9 or VP8 when your browser supports them. If you need MP4 or a smaller file, run the result through the video converter or video compressor.",
        },
        {
          q: "Can I record a single window or tab instead of the whole screen?",
          a: "Yes. The choice is made in the browser's share dialog when you press Start, and you can pick the entire screen, an application window or a browser tab.",
        },
        {
          q: "How do I make a GIF?",
          a: "Record first, then press Export as GIF on the recording. It is rendered at up to 480 px wide and 8 frames per second, so short clips work best.",
        },
        {
          q: "Why did my recording stop by itself?",
          a: "If you end sharing from the browser's own Stop sharing bar, the recording stops and is saved to the list like a normal take.",
        },
      ],
      steps: [
        "Choose the quality, and switch on microphone audio or the webcam overlay if you want them.",
        "Press Start recording, then pick a screen, window or tab in the browser's share dialog.",
        "Press Stop when you are done and preview the recording in the list.",
        "Download the WebM file, or export a GIF, before closing the page.",
      ],
    },
    ar: {
      intro:
        "يسجّل هذا المسجّل شاشتك كاملة، أو نافذة واحدة، أو تبويبًا واحدًا من المتصفح، عبر نافذة مشاركة الشاشة الخاصة بالمتصفح نفسه. تختار ما تريد مشاركته وتضغط «ابدأ»، ويمنحك عدّ تنازلي من 3 إلى 1 (يمكن إيقافه) لحظة للاستعداد. وعند الضغط على «إيقاف» يظهر التسجيل في قائمة مع مدته وحجمه، فتعاينه أو تنزّله بصيغة WebM أو تحذفه.\n\nقبل البدء تختار الجودة: 720p وهي الافتراضية، أو 1080p، أو «الحد الأقصى» الذي يتبع حجم السطح المشارَك. ويمكنك إضافة صوت الميكروفون، ووضع كاميرا الويب فوق الفيديو في إحدى الزوايا الأربع بالحجم الذي تحدده، وهذا مفيد لشروحات الاستخدام والعروض التوضيحية. كما يمكن تصدير أي تسجيل محفوظ إلى صورة GIF متحركة للأماكن التي لا تقبل الفيديو.",
      whyClientSide:
        "قد تُظهر الشاشة أي شيء مفتوح على جهازك: بريدًا أو لوحات بيانات أو محادثات خاصة. هنا تنتقل الصورة والصوت من واجهة التقاط المتصفح إلى ملف محفوظ في ذاكرة الصفحة، ولا توجد في الأداة خطوة رفع أصلًا. ولا يُحفظ شيء بعد إغلاق التبويب أو إعادة تحميله، فنزّل ما تريد الاحتفاظ به أولًا.",
      limitations: [
        "لا يوجد زر إيقاف مؤقت ولا قص للتسجيل. يستمر التسجيل من «ابدأ» حتى «إيقاف»، فخطّط للمقطع أو قصّه لاحقًا في برنامج مونتاج.",
        "التسجيلات تبقى في الذاكرة طوال الزيارة الحالية فقط. إعادة التحميل أو إغلاق التبويب تحذفها، والتسجيلات الطويلة بدقة عالية تستهلك ذاكرة كبيرة.",
        "اسم الملف المنزَّل ينتهي دائمًا بـ .webm. وإذا كان متصفحك لا يسجّل إلا بصيغة MP4 فسيعمل الملف، لكن حاويته قد لا تطابق الامتداد، فغيّر الامتداد إن اشتكى المشغّل.",
        "تصدير GIF يعيد تشغيل التسجيل ويأخذ منه 8 إطارات في الثانية بعرض لا يتجاوز 480 بكسل ومن دون صوت. هو مناسب للمقاطع القصيرة، ويصبح بطيئًا وثقيلًا مع الطويلة.",
        "ما يمكن التقاطه، ومنه صوت التبويب أو النظام، يعتمد على متصفحك ونظام التشغيل. متصفحات الحاسوب تدعم التقاط الشاشة، أما معظم متصفحات الهاتف فلا تدعمه.",
      ],
      faq: [
        {
          q: "هل يُرفع التسجيل إلى أي مكان؟",
          a: "لا. تسجّل الصفحة عبر واجهة الالتقاط في المتصفح وتحتفظ بالنتيجة في الذاكرة. لا توجد خطوة رفع، ولا يغادر الملف الصفحة إلا حين تضغط «تنزيل».",
        },
        {
          q: "هل يمكنني تسجيل صوتي أو إضافة كاميرا الويب؟",
          a: "نعم. فعّل خيار الميكروفون لإضافة صوتك، وفعّل تراكب الكاميرا لوضع عرض صغير للكاميرا في إحدى الزوايا. وإذا تعذّر فتح الكاميرا تُنبّهك الأداة وتسجّل الشاشة وحدها.",
        },
        {
          q: "ما صيغة الفيديو؟",
          a: "WebM بترميز VP9 أو VP8 متى دعمهما متصفحك. وإن احتجت MP4 أو ملفًا أصغر فمرّر الناتج على أداة تحويل الفيديو أو ضغط الفيديو.",
        },
        {
          q: "هل أستطيع تسجيل نافذة أو تبويب بدل الشاشة كلها؟",
          a: "نعم. يتم الاختيار في نافذة المشاركة التي يعرضها المتصفح عند الضغط على «ابدأ»، فتختار الشاشة كاملة أو نافذة تطبيق أو تبويبًا.",
        },
        {
          q: "كيف أصنع صورة GIF؟",
          a: "سجّل أولًا، ثم اضغط «تصدير كـ GIF» على التسجيل. تُنشأ الصورة بعرض يصل إلى 480 بكسل وبمعدل 8 إطارات في الثانية، لذا تناسبها المقاطع القصيرة.",
        },
        {
          q: "لماذا توقف التسجيل من تلقاء نفسه؟",
          a: "إذا أنهيت المشاركة من شريط «إيقاف المشاركة» الخاص بالمتصفح يتوقف التسجيل ويُحفظ في القائمة كأنه تسجيل عادي.",
        },
      ],
      steps: [
        "اختر الجودة، وفعّل صوت الميكروفون أو تراكب الكاميرا إن أردت.",
        "اضغط «ابدأ التسجيل» ثم اختر شاشة أو نافذة أو تبويبًا من نافذة المشاركة.",
        "اضغط «إيقاف» عند الانتهاء وعاين التسجيل في القائمة.",
        "نزّل ملف WebM أو صدّر GIF قبل إغلاق الصفحة.",
      ],
    },
  },

  "meme-generator": {
    related: ["image-resizer", "crop-image", "watermark-image", "gif-maker"],
    en: {
      intro:
        "This meme generator puts classic Impact-style text on an image you provide. Drop in a PNG, JPG, WebP or GIF and it starts with a top and a bottom caption. Edit each caption in its own box, drag the text anywhere on the picture, and add more text boxes for extra lines or labels.\n\nFor the selected caption you can set the font size, the text color, the outline thickness and left, center or right alignment. The preview is drawn at the image's own size, so what you see is what you download: a PNG with no watermark added. The tool has no built-in template library; you bring the image.",
      whyClientSide:
        "The privacy stake here is small: a meme is usually meant to be shared anyway. The image is read and drawn by your browser and the PNG is built on the page, so a private photo is not sent to a meme site's server along the way, but that is a convenience more than a safeguard.",
      limitations: [
        "Each caption is a single line. Text is not wrapped, so a long caption runs off the edge of the picture. Split it across two text boxes instead.",
        "The outline is always black. You can change its thickness, including to zero, but not its color.",
        "The font is Impact where your device has it. Devices without Impact fall back to another bold font, so the look can differ between machines.",
        "Font size is in pixels of the original image, so a large photo needs a larger size than a small one. Images over 15 MB are refused.",
        "A GIF is exported as a single still PNG, not an animated meme, and there is no undo.",
      ],
      faq: [
        {
          q: "Does the meme have a watermark?",
          a: "No. The download is your image with your text, saved as a PNG, with nothing added.",
        },
        {
          q: "Can I use my own picture?",
          a: "Yes, that is the only way it works. Upload any PNG, JPG, WebP or GIF up to 15 MB. There are no ready-made meme templates in the tool.",
        },
        {
          q: "How do I move the text?",
          a: "Drag directly on the image. Dragging moves the text box nearest to where you press, so when there are several boxes, start the drag close to the one you want.",
        },
        {
          q: "Can I add more than two lines of text?",
          a: "Yes. Press Add text for another box, then type, size and place it independently of the others.",
        },
        {
          q: "What resolution is the downloaded meme?",
          a: "The same pixel size as the image you uploaded, saved as a PNG.",
        },
      ],
      steps: [
        "Upload the image you want to caption.",
        "Type your text into the top and bottom boxes, or press Add text for more.",
        "Drag each caption into place and adjust size, color, outline and alignment.",
        "Download the finished PNG.",
      ],
    },
    ar: {
      intro:
        "يضع هذا المولّد نصًّا بخط Impact الكلاسيكي لميمات الصور على أي صورة تختارها. أسقط صورة PNG أو JPG أو WebP أو GIF فيبدأ بتعليق علوي وآخر سفلي. عدّل كل تعليق في خانته، واسحب النص إلى أي موضع على الصورة، وأضف خانات نصية أخرى لسطور أو تسميات إضافية.\n\nللتعليق المحدد تضبط حجم الخط ولون النص وسماكة الإطار المحيط به ومحاذاته إلى اليسار أو الوسط أو اليمين. تُرسم المعاينة بحجم الصورة الأصلي، فما تراه هو ما تنزّله: ملف PNG بلا علامة مائية. ولا تحتوي الأداة على مكتبة قوالب جاهزة، فالصورة عليك.",
      whyClientSide:
        "الأثر على الخصوصية هنا صغير، فالميم يُراد له غالبًا أن يُنشر أصلًا. تقرأ الصفحة الصورة وترسمها داخل المتصفح وتبني ملف PNG عندك، فلا تُرسل صورة شخصية إلى خادم موقع ميمات في الطريق، لكن هذه ميزة راحة أكثر منها ضمانة.",
      limitations: [
        "كل تعليق سطر واحد. لا يلتف النص تلقائيًا، فالتعليق الطويل يخرج من حافة الصورة. قسّمه على خانتين نصيتين بدلًا من ذلك.",
        "إطار النص أسود دائمًا. يمكنك تغيير سماكته حتى الصفر، لكن ليس لونه.",
        "الخط هو Impact إذا كان موجودًا على جهازك. الأجهزة التي لا تملكه تستعمل خطًا عريضًا بديلًا، فقد يختلف الشكل من جهاز إلى آخر.",
        "حجم الخط بوحدة بكسل الصورة الأصلية، فالصورة الكبيرة تحتاج حجمًا أكبر من الصغيرة. والصور التي تتجاوز 15 ميغابايت تُرفض.",
        "صورة GIF تُصدَّر لقطة ثابتة واحدة بصيغة PNG وليست ميمًا متحركًا، ولا يوجد تراجع عن الخطوات.",
      ],
      faq: [
        {
          q: "هل في الميم علامة مائية؟",
          a: "لا. الملف المنزَّل هو صورتك مع نصك، محفوظًا بصيغة PNG ولا يُضاف إليه شيء.",
        },
        {
          q: "هل أستخدم صورتي أنا؟",
          a: "نعم، وهذه هي الطريقة الوحيدة. ارفع أي صورة PNG أو JPG أو WebP أو GIF حتى 15 ميغابايت. لا توجد قوالب ميمات جاهزة في الأداة.",
        },
        {
          q: "كيف أحرّك النص؟",
          a: "اسحب مباشرة على الصورة. يتحرك الصندوق النصي الأقرب إلى موضع الضغط، فإذا وُجدت عدة صناديق فابدأ السحب قرب الصندوق الذي تريده.",
        },
        {
          q: "هل أستطيع إضافة أكثر من سطرين؟",
          a: "نعم. اضغط «إضافة نص» لصندوق جديد، ثم اكتب فيه واضبط حجمه ومكانه بشكل مستقل عن البقية.",
        },
        {
          q: "ما دقة الميم المنزَّل؟",
          a: "بنفس أبعاد الصورة التي رفعتها بالبكسل، محفوظة بصيغة PNG.",
        },
      ],
      steps: [
        "ارفع الصورة التي تريد التعليق عليها.",
        "اكتب نصك في الخانتين العلوية والسفلية، أو اضغط «إضافة نص» للمزيد.",
        "اسحب كل تعليق إلى مكانه واضبط الحجم واللون والإطار والمحاذاة.",
        "نزّل ملف PNG النهائي.",
      ],
    },
  },

  "clip-path-generator": {
    related: ["css-gradient", "color-palette", "color-converter", "svg-png"],
    en: {
      intro:
        "This tool builds CSS clip-path values visually. Pick a shape (polygon, circle, ellipse or inset) and the preview square updates as you change it. For a polygon you drag the numbered points straight on the preview or fine-tune each point's X and Y with sliders, add points, or remove them down to a minimum of three. Eight polygon presets are one click away: triangle, rhombus, pentagon, hexagon, star, message bubble, arrow and chevron.\n\nCircle and ellipse take a radius and a center position, and inset takes top, right, bottom and left offsets plus an optional corner radius. Every value is a percentage of the element's box, so the shape scales with the element. The output panel shows the finished declaration, with a -webkit-clip-path line for older Safari, and a copy button.",
      limitations: [
        "The preview is a fixed gradient square, not your own image or element. Copy the CSS and check it on the real element, especially if it is not square.",
        "Values are percentages only. The tool does not produce pixel values, the path() function or SVG references.",
        "Polygon points snap to whole percentages when dragged, and a polygon needs at least three points.",
        "Inset offsets and corner radius stop at 50%. Circle and ellipse sizes go up to 100%.",
      ],
      faq: [
        {
          q: "How do I use the generated CSS?",
          a: "Copy the output and paste it into the rule for the element you want to clip, for example an image or a div. The element keeps its layout box; only the visible area is cut.",
        },
        {
          q: "Why is there a -webkit-clip-path line?",
          a: "It repeats the same value for older WebKit-based browsers that needed the prefix. Current browsers read the plain clip-path line, so you can drop the prefixed line if you do not support old Safari.",
        },
        {
          q: "How do I add or remove polygon points?",
          a: "Press Add Vertex to insert a point halfway between the last and first points, then drag it. Use the bin icon on a point's row to remove it. A polygon cannot go below three points.",
        },
        {
          q: "Can I draw a freeform curve?",
          a: "No. The tool covers polygon, circle, ellipse and inset. Curves beyond those need the path() function or an SVG clipPath, which this tool does not generate.",
        },
        {
          q: "Which shape presets are included?",
          a: "Triangle, rhombus, pentagon, hexagon, star, message, arrow and chevron. Choosing one loads its points into the polygon editor so you can keep adjusting them.",
        },
      ],
      steps: [
        "Choose polygon, circle, ellipse or inset.",
        "Drag points on the preview or use the sliders and presets to shape it.",
        "Check the live preview, then copy the CSS from the output panel.",
        "Paste it into the rule for your element.",
      ],
    },
    ar: {
      intro:
        "تبني هذه الأداة قيم CSS الخاصة بالخاصية clip-path بصريًا. اختر شكلًا (مضلّع أو دائرة أو قطع ناقص أو إزاحة داخلية) فيتغير المربع المعروض فور تعديلك. وفي المضلّع تسحب النقاط المرقّمة مباشرة على المعاينة، أو تضبط إحداثيَّي X وY لكل نقطة بالمنزلقات، أو تضيف نقاطًا أو تحذفها حتى حد أدنى قدره ثلاث نقاط. وتتوفر ثمانية أشكال جاهزة بنقرة واحدة: مثلث ومعيّن ومخمّس ومسدّس ونجمة وفقاعة رسالة وسهم وشيفرون.\n\nتأخذ الدائرة والقطع الناقص نصف قطر ومركزًا، وتأخذ الإزاحة الداخلية قيم الأعلى واليمين والأسفل واليسار مع نصف قطر اختياري للزوايا. كل القيم نسب مئوية من صندوق العنصر، فيتناسب الشكل مع حجمه. وتعرض لوحة الإخراج التصريح الكامل مع سطر -webkit-clip-path لمتصفح سفاري القديم، وزر نسخ.",
      limitations: [
        "المعاينة مربع بتدرّج لوني ثابت وليست صورتك أو عنصرك. انسخ الشيفرة وجرّبها على العنصر الحقيقي، خصوصًا إن لم يكن مربعًا.",
        "القيم نسب مئوية فقط. لا تولّد الأداة قيمًا بالبكسل ولا الدالة path() ولا مراجع SVG.",
        "تتقيّد نقاط المضلّع بأعداد صحيحة من النسب عند السحب، ويحتاج المضلّع إلى ثلاث نقاط على الأقل.",
        "إزاحات الشكل الداخلي ونصف قطر الزوايا تتوقف عند 50%، أما أحجام الدائرة والقطع الناقص فتصل إلى 100%.",
      ],
      faq: [
        {
          q: "كيف أستخدم شيفرة CSS الناتجة؟",
          a: "انسخ الناتج والصقه في قاعدة العنصر الذي تريد قصه، كصورة أو div. يحتفظ العنصر بصندوقه في التخطيط، ويُقصّ الجزء المرئي فقط.",
        },
        {
          q: "لماذا يوجد سطر -webkit-clip-path؟",
          a: "هو يكرر القيمة نفسها للمتصفحات القديمة المبنية على WebKit التي كانت تحتاج البادئة. تقرأ المتصفحات الحالية سطر clip-path العادي، فيمكنك حذف السطر ذي البادئة إن كنت لا تدعم سفاري القديم.",
        },
        {
          q: "كيف أضيف نقاط المضلّع أو أحذفها؟",
          a: "اضغط «إضافة نقطة» لإدراج نقطة في منتصف المسافة بين آخر نقطة وأولها، ثم اسحبها. واستخدم أيقونة سلة المهملات في صف النقطة لحذفها. ولا يمكن أن ينزل المضلّع عن ثلاث نقاط.",
        },
        {
          q: "هل أستطيع رسم منحنى حر؟",
          a: "لا. تغطي الأداة المضلّع والدائرة والقطع الناقص والإزاحة الداخلية. أما المنحنيات الأخرى فتحتاج إلى الدالة path() أو clipPath في SVG، وهذا لا تولّده الأداة.",
        },
        {
          q: "ما الأشكال الجاهزة المتوفرة؟",
          a: "مثلث ومعيّن ومخمّس ومسدّس ونجمة ورسالة وسهم وشيفرون. اختيار أي منها يحمّل نقاطه في محرر المضلّع فتواصل تعديلها.",
        },
      ],
      steps: [
        "اختر مضلّعًا أو دائرة أو قطعًا ناقصًا أو إزاحة داخلية.",
        "اسحب النقاط على المعاينة أو استخدم المنزلقات والأشكال الجاهزة لتشكيله.",
        "راجع المعاينة الحية ثم انسخ شيفرة CSS من لوحة الإخراج.",
        "الصقها في قاعدة عنصرك.",
      ],
    },
  },

  "text-encryption": {
    related: ["password-generator", "password-strength", "hash-generator", "base64", "airgap-transfer"],
    en: {
      intro:
        "This tool encrypts a piece of text with a passphrase and turns it back again. Type or paste your text, enter a passphrase (or press the button to generate a random 24-character key), and press Encrypt. The result is a single line of Base64 text you can paste into an email, a note or a chat. To read it later, paste that line into the same box, enter the same passphrase and press Decrypt.\n\nUnder the hood it uses AES-256 in GCM mode through the browser's Web Crypto API. The key is derived from your passphrase with PBKDF2 (SHA-256, 100,000 iterations) and a fresh random 16-byte salt, and every encryption also uses a fresh random 12-byte IV. Salt and IV are stored at the front of the output, which is why the same text and passphrase give a different result each time. GCM also authenticates the data, so a wrong passphrase or an edited ciphertext fails to decrypt instead of producing garbage.",
      whyClientSide:
        "Your text and passphrase are processed by crypto.subtle in your own browser, and this tool has no code that sends either to a server, so we never hold anything we could read or lose. That has limits you should know about. Like any web app, it runs code the site delivers each time you load it, so it cannot protect you from a compromised device, a malicious browser extension or someone watching your screen. It also does not hide that a message exists or roughly how long it is, and the passphrase is not stored anywhere, so a forgotten passphrase cannot be recovered.",
      limitations: [
        "Security rests on your passphrase. The 100,000-iteration PBKDF2 step slows guessing, but anyone holding the ciphertext can try passphrases offline, so a short or common one can still be cracked. Use a long passphrase or the generated random key.",
        "The output is this tool's own layout: Base64 of the 16-byte salt, the 12-byte IV and the encrypted data. Other programs such as OpenSSL or GPG will not open it, so you need this tool, or code that follows the same layout, to decrypt.",
        "It is for text, not files, and meant for notes and messages of ordinary length. Encryption does not hide the approximate length of the message.",
        "A wrong passphrase and a damaged or edited ciphertext give the same generic failure message, so the tool cannot tell you which it was.",
        "The passphrase and any generated key live only on the page. Copy a generated key somewhere safe before you leave, because reloading the page loses it.",
        "This is a convenience tool, not an audited secrets product. For high-stakes data use an established tool such as GPG or age.",
      ],
      faq: [
        {
          q: "Is my text or passphrase sent to a server?",
          a: "No. Encryption and decryption run in your browser through the Web Crypto API, and neither the text nor the passphrase is transmitted by this tool. Nothing is saved after you close the page.",
        },
        {
          q: "Which encryption does it use?",
          a: "AES-256-GCM. The 256-bit key is derived from your passphrase with PBKDF2 using SHA-256, 100,000 iterations and a random 16-byte salt. Each encryption adds a random 12-byte IV.",
        },
        {
          q: "Why is the output different every time I encrypt the same text?",
          a: "Each run generates a new random salt and IV. That is intended: it stops anyone telling whether two messages are the same. Any of the outputs still decrypts with your passphrase.",
        },
        {
          q: "What happens if I forget the passphrase?",
          a: "The text cannot be recovered. The passphrase is not stored and there is no reset, so keep it in a password manager.",
        },
        {
          q: "Can I decrypt the result with another program?",
          a: "Not directly. The output is Base64 of salt, IV and ciphertext in this tool's own order. A developer could decrypt it with the same parameters, but standard tools will not recognise the format.",
        },
        {
          q: "Is it safe for passwords or private messages?",
          a: "It is reasonable for sharing a note over an insecure channel as long as the passphrase is strong and you send it by a different route. It does not replace dedicated tools for high-stakes secrets.",
        },
      ],
      steps: [
        "Enter a passphrase, or press Generate random key and save it somewhere safe.",
        "Paste or type your text and press Encrypt.",
        "Copy the Base64 result and send or store it.",
        "To read it, paste the Base64 text back, enter the same passphrase and press Decrypt.",
      ],
    },
    ar: {
      intro:
        "تشفّر هذه الأداة نصًّا بعبارة مرور وتعيده إلى أصله عند الطلب. اكتب نصك أو الصقه، وأدخل عبارة المرور (أو اضغط الزر لتوليد مفتاح عشوائي من 24 حرفًا)، ثم اضغط «تشفير». الناتج سطر واحد من نص Base64 يمكنك لصقه في رسالة بريد أو ملاحظة أو محادثة. ولقراءته لاحقًا الصق السطر في الخانة نفسها، وأدخل عبارة المرور ذاتها، ثم اضغط «فك التشفير».\n\nتستخدم الأداة خوارزمية AES-256 بوضع GCM عبر واجهة Web Crypto API في المتصفح. يُشتق المفتاح من عبارة المرور بدالة PBKDF2 (مع SHA-256 و100,000 تكرار) وملح عشوائي جديد من 16 بايت، ويستعمل كل تشفير متجه تهيئة (IV) عشوائيًا جديدًا من 12 بايت. يُحفظ الملح والمتجه في مقدمة الناتج، ولهذا يختلف الناتج في كل مرة لنفس النص والعبارة. كما يتحقق GCM من سلامة البيانات، فإذا كانت العبارة خاطئة أو عُدّل النص المشفّر يفشل فك التشفير بدل أن يُنتج حروفًا مشوّشة.",
      whyClientSide:
        "يعالج المتصفح عندك نصك وعبارة المرور بواسطة crypto.subtle، ولا توجد في الأداة شيفرة ترسل أيًّا منهما إلى خادم، فلا يوجد لدينا ما نقرؤه أو نفقده. لكن لهذا حدودًا ينبغي أن تعرفها. فالأداة كأي تطبيق ويب تشغّل الشيفرة التي يقدمها الموقع في كل مرة تفتحه، فلا تحميك من جهاز مخترَق أو إضافة متصفح خبيثة أو من يراقب شاشتك. وهي لا تُخفي وجود الرسالة ولا طولها التقريبي، ولا تحفظ عبارة المرور في أي مكان، فلا يمكن استرجاعها إن نسيتها.",
      limitations: [
        "الأمان يقوم على عبارة المرور. خطوة PBKDF2 بـ100,000 تكرار تبطّئ التخمين، لكن من يملك النص المشفّر يستطيع تجربة العبارات دون اتصال، فقد تنكسر عبارة قصيرة أو شائعة. استعمل عبارة طويلة أو المفتاح العشوائي المولَّد.",
        "الناتج بتنسيق خاص بهذه الأداة: Base64 للملح (16 بايت) ثم المتجه (12 بايت) ثم البيانات المشفرة. برامج أخرى مثل OpenSSL أو GPG لن تفتحه، فتحتاج إلى هذه الأداة أو إلى شيفرة تتبع التنسيق نفسه لفك التشفير.",
        "هي للنصوص لا للملفات، ومصمَّمة للملاحظات والرسائل بطول معتاد. والتشفير لا يخفي الطول التقريبي للرسالة.",
        "عبارة المرور الخاطئة والنص المشفّر التالف أو المعدَّل يعطيان رسالة الفشل العامة نفسها، فلا تستطيع الأداة إخبارك بأيهما السبب.",
        "عبارة المرور وأي مفتاح مولَّد يبقيان في الصفحة فقط. انسخ المفتاح المولَّد إلى مكان آمن قبل أن تغادر، لأن إعادة تحميل الصفحة تفقده.",
        "هذه أداة للراحة وليست منتجًا مدقَّقًا لإدارة الأسرار. وللبيانات شديدة الحساسية استعمل أدوات راسخة مثل GPG أو age.",
      ],
      faq: [
        {
          q: "هل يُرسل نصي أو عبارة المرور إلى خادم؟",
          a: "لا. يجري التشفير وفكه في متصفحك عبر Web Crypto API، ولا ترسل الأداة النص ولا العبارة. ولا يُحفظ شيء بعد إغلاق الصفحة.",
        },
        {
          q: "أي تشفير تستخدمه الأداة؟",
          a: "AES-256-GCM. يُشتق مفتاح 256 بت من عبارة المرور بدالة PBKDF2 مع SHA-256 و100,000 تكرار وملح عشوائي من 16 بايت. ويضيف كل تشفير متجه تهيئة عشوائيًا من 12 بايت.",
        },
        {
          q: "لماذا يختلف الناتج في كل مرة أشفّر فيها النص نفسه؟",
          a: "لأن كل تشغيل يولّد ملحًا ومتجه تهيئة عشوائيين جديدين. وهذا مقصود، فهو يمنع معرفة ما إذا كانت رسالتان متطابقتين. وأي ناتج منها يُفك بعبارة المرور نفسها.",
        },
        {
          q: "ماذا لو نسيت عبارة المرور؟",
          a: "لا يمكن استرجاع النص. العبارة غير محفوظة ولا توجد إعادة تعيين، فاحتفظ بها في مدير كلمات المرور.",
        },
        {
          q: "هل أفك التشفير ببرنامج آخر؟",
          a: "ليس مباشرة. الناتج هو Base64 للملح ثم المتجه ثم النص المشفّر بترتيب هذه الأداة. يستطيع مطوّر فكه بالمعاملات نفسها، لكن الأدوات القياسية لن تتعرف على التنسيق.",
        },
        {
          q: "هل هي آمنة لكلمات المرور أو الرسائل الخاصة؟",
          a: "هي مقبولة لمشاركة ملاحظة عبر قناة غير آمنة بشرط أن تكون العبارة قوية وترسلها بطريقة مختلفة. لكنها لا تغني عن الأدوات المتخصصة للأسرار شديدة الحساسية.",
        },
      ],
      steps: [
        "أدخل عبارة مرور، أو اضغط «توليد مفتاح عشوائي» واحفظه في مكان آمن.",
        "الصق نصك أو اكتبه واضغط «تشفير».",
        "انسخ ناتج Base64 وأرسله أو احفظه.",
        "لقراءته، الصق نص Base64 ثانية وأدخل العبارة نفسها واضغط «فك التشفير».",
      ],
    },
  },

  "morse-code": {
    related: ["ascii-art", "base64", "text-repeater", "text-diff"],
    en: {
      intro:
        "This translator converts text to Morse code and Morse back to text. In Text to Morse mode, type or paste a message and the dots and dashes appear instantly on the other side. In Morse to Text mode, paste Morse and read the decoded message. A Swap button moves the current result into the input and flips the mode, and a copy button grabs the output.\n\nIt covers the letters A to Z, the digits 0 to 9 and these punctuation marks: . , ? ! / ( ) & : ; = + - _ \" $ @. Letters are separated by a single space and words by a space, a slash and a space. Output is uppercase. A collapsible reference chart lists every letter and digit with its code.",
      whyClientSide:
        "The privacy stake is small. Morse is a simple lookup table, a message is rarely sensitive, and it is not a form of secrecy anyway. The conversion happens as you type in the page, with no request and no wait, which is the practical benefit.",
      limitations: [
        "There is no audio, light or tap playback; the tool shows and decodes dots and dashes as text only.",
        "Only the characters listed above are supported. Anything else, including accented letters, Arabic or other non-Latin scripts, and emoji, is silently left out when encoding.",
        "When decoding, letters must be separated by single spaces and words by a space, slash and space (\" / \"). Other separators, such as a bare slash or a vertical bar, are not recognised, and unknown codes come out as a question mark.",
        "Line breaks are not treated as word breaks when encoding, so words on separate lines can run together. Keep a message on one line separated by spaces.",
        "The reference chart shows letters and digits only, not punctuation.",
      ],
      faq: [
        {
          q: "How do I write the Morse code input for decoding?",
          a: "Use dots and dashes with one space between letters and a slash with spaces around it between words, for example \".... .. / - .... . .-. .\" decodes to HI THERE.",
        },
        {
          q: "Does it support numbers and punctuation?",
          a: "Numbers 0 to 9 and the common punctuation marks . , ? ! / ( ) & : ; = + - _ \" $ @ are supported. Other symbols are skipped.",
        },
        {
          q: "Can it play the Morse code as sound?",
          a: "No. It only converts between text and written Morse. It does not play audio or flash a light.",
        },
        {
          q: "Does it work with Arabic or other languages?",
          a: "Not currently. The table is the Latin alphabet and digits, so letters from other scripts are dropped when encoding and cannot be decoded.",
        },
        {
          q: "Why do I see question marks in the decoded text?",
          a: "A question mark appears for any group of dots and dashes that is not in the table. Check for a missing space between letters, a stray character, or a separator other than a space and slash.",
        },
      ],
      steps: [
        "Choose Text to Morse or Morse to Text.",
        "Type or paste your message into the input box.",
        "Read the result on the right and copy it.",
        "Press Swap to translate the result back the other way.",
      ],
    },
    ar: {
      intro:
        "يحوّل هذا المترجم النص إلى شيفرة مورس ويعيدها إلى نص. في وضع «نص إلى مورس» تكتب رسالة أو تلصقها فتظهر النقاط والشرطات فورًا في الجانب الآخر. وفي وضع «مورس إلى نص» تلصق شيفرة مورس فتقرأ الرسالة بعد فك ترميزها. يحمل زر «تبديل» النتيجة الحالية إلى خانة الإدخال ويقلب الوضع، ويلتقط زر النسخ الناتج.\n\nيغطي الأداة الحروف اللاتينية من A إلى Z والأرقام من 0 إلى 9 وعلامات الترقيم هذه: . , ? ! / ( ) & : ; = + - _ \" $ @. تُفصل الحروف بمسافة واحدة، والكلمات بمسافة ثم شرطة مائلة ثم مسافة. ويكون الناتج بأحرف كبيرة. ويعرض جدول مرجعي قابل للطي كل حرف ورقم مع رمزه.",
      whyClientSide:
        "الأثر على الخصوصية صغير. مورس جدول بسيط، والرسالة نادرًا ما تكون حساسة، كما أنه ليس وسيلة لإخفاء المعنى أصلًا. تتم الترجمة أثناء الكتابة داخل الصفحة بلا طلب ولا انتظار، وهذه هي الفائدة العملية.",
      limitations: [
        "لا يوجد تشغيل للصوت أو الضوء أو النقر، فالأداة تعرض النقاط والشرطات وتفكها كنص فقط.",
        "لا تُدعم إلا الرموز المذكورة أعلاه. وكل ما عداها، ومنه الحروف المشكّلة والعربية وغيرها من الأبجديات غير اللاتينية والرموز التعبيرية، يُحذف بصمت عند التحويل إلى مورس.",
        "عند فك الترميز يجب أن تفصل مسافة واحدة بين الحروف، وأن تفصل بين الكلمات مسافة ثم شرطة مائلة ثم مسافة (\" / \"). لا تُعرف فواصل أخرى مثل الشرطة المائلة وحدها أو الخط العمودي، وتظهر الرموز غير المعروفة علامة استفهام.",
        "لا تُعامل فواصل الأسطر كفواصل بين الكلمات عند التحويل إلى مورس، فقد تلتصق الكلمات الموجودة في أسطر مختلفة. اترك الرسالة في سطر واحد تفصل بين كلماتها مسافات.",
        "يعرض الجدول المرجعي الحروف والأرقام فقط دون علامات الترقيم.",
      ],
      faq: [
        {
          q: "كيف أكتب شيفرة مورس لفك ترميزها؟",
          a: "استخدم النقاط والشرطات مع مسافة واحدة بين الحروف، وشرطة مائلة تحيط بها مسافتان بين الكلمات. مثال: \".... .. / - .... . .-. .\" تُفك إلى HI THERE.",
        },
        {
          q: "هل تدعم الأرقام وعلامات الترقيم؟",
          a: "تُدعم الأرقام من 0 إلى 9 وعلامات الترقيم الشائعة . , ? ! / ( ) & : ; = + - _ \" $ @. أما الرموز الأخرى فتُتجاهل.",
        },
        {
          q: "هل تشغّل شيفرة مورس كصوت؟",
          a: "لا. هي تحوّل بين النص ومورس المكتوب فقط، ولا تشغّل صوتًا ولا تومض ضوءًا.",
        },
        {
          q: "هل تعمل مع العربية أو لغات أخرى؟",
          a: "ليس حاليًا. الجدول مبني على الأبجدية اللاتينية والأرقام، فتُحذف حروف الأبجديات الأخرى عند التحويل ولا يمكن فك ترميزها.",
        },
        {
          q: "لماذا تظهر علامات استفهام في النص الناتج؟",
          a: "تظهر علامة الاستفهام مقابل أي مجموعة من النقاط والشرطات غير موجودة في الجدول. تحقق من نقص مسافة بين الحروف، أو حرف زائد، أو فاصل غير المسافة والشرطة المائلة.",
        },
      ],
      steps: [
        "اختر «نص إلى مورس» أو «مورس إلى نص».",
        "اكتب رسالتك أو الصقها في خانة الإدخال.",
        "اقرأ النتيجة في الجانب الآخر وانسخها.",
        "اضغط «تبديل» لترجمة النتيجة في الاتجاه المعاكس.",
      ],
    },
  },

  timer: {
    related: ["stopwatch", "pomodoro", "world-clock", "wheel-of-names"],
    en: {
      intro:
        "This is a simple online timer with two modes. In Countdown mode you enter hours, minutes and seconds, press Apply to set the time, then Start. The display counts down to zero and plays a short beep when it finishes. It begins at 5 minutes, and you can enter any length, so 90 minutes shows as 01:30:00. In Stopwatch mode the same big display counts up from zero until you pause or reset it.\n\nA fullscreen button turns the page into a large clock that is readable from across a room, and its controls fade out after a few seconds of inactivity. Pausing and starting each play a short beep, and a bell button lets you test the sound before you rely on it.",
      whyClientSide:
        "The privacy stake is small: a timer handles no personal data. Running in the page means it starts instantly, needs no account and sends nothing, and that is all there is to say.",
      limitations: [
        "The display is driven by the browser's animation frames, which browsers pause in background tabs. When you return, the time catches up correctly, but the finishing beep sounds then, not at the exact moment time ran out. Keep the tab visible if the alarm matters.",
        "The alarm is one short beep. There is no choice of sound, no repeat, no notification and no vibration.",
        "State is not saved. Reloading or closing the page resets the time, and there is only one timer at a time.",
        "The display shows hours, minutes and seconds. There are no lap or split times; the separate stopwatch tool has those.",
        "Browsers can block sound until you have interacted with the page. Pressing Start counts as interaction, and the bell button lets you check your volume first.",
      ],
      faq: [
        {
          q: "How do I set a countdown?",
          a: "Open the Countdown tab, type the hours, minutes and seconds, press Apply, then press Start. The default is 5 minutes.",
        },
        {
          q: "Does it make a sound when time is up?",
          a: "Yes, a short beep plays when the countdown reaches zero. Use the bell button to test your volume first.",
        },
        {
          q: "Can I use it fullscreen?",
          a: "Yes. The fullscreen button shows the time at a large size, with Start or Pause, Reset and Exit buttons that hide after a few seconds and come back when you move the mouse or touch the screen.",
        },
        {
          q: "Will it keep running if I switch tabs?",
          a: "The time keeps counting and is correct when you come back, but browsers pause the page's animation while it is hidden, so the end-of-countdown beep may be late. Leave the tab visible if you need it on time.",
        },
        {
          q: "Is there a stopwatch?",
          a: "Yes, the Stopwatch tab counts up from zero. For lap and split times use the separate stopwatch tool.",
        },
      ],
      steps: [
        "Choose Countdown or Stopwatch.",
        "For a countdown, enter hours, minutes and seconds and press Apply.",
        "Press Start. Use Pause or Reset as you need.",
        "Use the fullscreen button for a large display.",
      ],
    },
    ar: {
      intro:
        "هذا مؤقّت بسيط على الإنترنت بوضعين. في وضع العدّ التنازلي تُدخل الساعات والدقائق والثواني، وتضغط «تطبيق» لتثبيت المدة، ثم «ابدأ». تنقص الشاشة حتى الصفر وتُصدر نغمة قصيرة عند الانتهاء. تبدأ المدة من 5 دقائق ويمكنك إدخال أي مدة، فتظهر 90 دقيقة على هيئة 01:30:00. وفي وضع ساعة الإيقاف تعدّ الشاشة الكبيرة نفسها تصاعديًا من الصفر حتى توقفها أو تعيد ضبطها.\n\nيحوّل زر ملء الشاشة الصفحة إلى ساعة كبيرة تُقرأ من آخر الغرفة، وتختفي أزرارها بعد ثوانٍ من عدم النشاط. ويُصدر الإيقاف المؤقت والبدء نغمة قصيرة لكل منهما، ويتيح زر الجرس تجربة الصوت قبل الاعتماد عليه.",
      whyClientSide:
        "الأثر على الخصوصية صغير: المؤقّت لا يتعامل مع بيانات شخصية. وعمله داخل الصفحة يعني أنه يبدأ فورًا ولا يحتاج حسابًا ولا يرسل شيئًا، وهذا كل ما في الأمر.",
      limitations: [
        "تعتمد الشاشة على إطارات الرسوم المتحركة في المتصفح، وتوقفها المتصفحات في التبويبات الخلفية. عند عودتك يُستدرك الوقت بدقة، لكن نغمة الانتهاء تُسمع حينها لا في اللحظة نفسها التي انتهى فيها الوقت. أبقِ التبويب ظاهرًا إن كان المنبّه مهمًا.",
        "المنبّه نغمة قصيرة واحدة. لا يوجد اختيار للصوت ولا تكرار ولا إشعار ولا اهتزاز.",
        "الحالة غير محفوظة. إعادة تحميل الصفحة أو إغلاقها تعيد الوقت إلى البداية، ولا يوجد إلا مؤقّت واحد في كل مرة.",
        "تعرض الشاشة الساعات والدقائق والثواني. لا توجد أزمنة لفّات أو أزمنة جزئية، وهي متوفرة في أداة ساعة الإيقاف المنفصلة.",
        "قد تمنع المتصفحات الصوت إلى أن تتفاعل مع الصفحة. والضغط على «ابدأ» يُعدّ تفاعلًا، ويتيح لك زر الجرس فحص مستوى الصوت أولًا.",
      ],
      faq: [
        {
          q: "كيف أضبط عدًّا تنازليًا؟",
          a: "افتح تبويب العدّ التنازلي واكتب الساعات والدقائق والثواني، واضغط «تطبيق» ثم «ابدأ». المدة الافتراضية 5 دقائق.",
        },
        {
          q: "هل يُصدر صوتًا عند انتهاء الوقت؟",
          a: "نعم، تُسمع نغمة قصيرة عندما يصل العد التنازلي إلى الصفر. استخدم زر الجرس لتجربة مستوى الصوت قبل ذلك.",
        },
        {
          q: "هل أستطيع استخدامه بملء الشاشة؟",
          a: "نعم. يعرض زر ملء الشاشة الوقت بحجم كبير، مع أزرار البدء أو الإيقاف المؤقت وإعادة الضبط والخروج، وهي تختفي بعد ثوانٍ وتعود عند تحريك الفأرة أو لمس الشاشة.",
        },
        {
          q: "هل يستمر بالعمل إذا انتقلت إلى تبويب آخر؟",
          a: "يستمر احتساب الوقت ويكون صحيحًا عند عودتك، لكن المتصفحات توقف رسوم الصفحة وهي مخفية، فقد تتأخر نغمة نهاية العد. أبقِ التبويب ظاهرًا إن أردتها في موعدها.",
        },
        {
          q: "هل توجد ساعة إيقاف؟",
          a: "نعم، يعدّ تبويب ساعة الإيقاف تصاعديًا من الصفر. ولأزمنة اللفّات والأزمنة الجزئية استخدم أداة ساعة الإيقاف المنفصلة.",
        },
      ],
      steps: [
        "اختر العد التنازلي أو ساعة الإيقاف.",
        "للعد التنازلي أدخل الساعات والدقائق والثواني واضغط «تطبيق».",
        "اضغط «ابدأ»، واستخدم الإيقاف المؤقت أو إعادة الضبط عند الحاجة.",
        "استخدم زر ملء الشاشة لعرض كبير.",
      ],
    },
  },

  "context-window": {
    related: ["token-counter", "ai-cost-calculator", "model-comparison"],
    en: {
      intro:
        "This calculator shows how much of an AI model's context window your text would fill. Paste a prompt, a document or a whole conversation, choose one of 13 models from OpenAI, Anthropic, Google, Meta, Mistral and DeepSeek, and it shows the token count against the model's window, a progress bar, the percentage used and the tokens remaining. The bar turns from green to yellow, orange and red as it fills, and a warning appears above 80% and a critical note above 95%.\n\nWindow sizes range from 64,000 tokens for DeepSeek V3 to 1,000,000 for Gemini 2.0 Flash and 2,000,000 for Gemini 2.0 Pro; the Claude models and o1 and o3-mini are listed at 200,000. A Load sample button fills in a short example. The tool reports token usage only and does not calculate cost; use the AI cost calculator for that.",
      whyClientSide:
        "Prompts are where people paste source code, customer messages and internal documents. The tokenizer here is a JavaScript library bundled into the page, so your text is counted on your device and is not sent to a server, an API or a model provider just to measure it.",
      limitations: [
        "Counts are estimates. The tool uses one OpenAI-style tokenizer for every model. Claude and Llama 3.3 counts are scaled by a small fixed factor, and the other models are not adjusted, so the real count from each provider's own tokenizer can differ, especially for code and non-English text.",
        "The window shown is the model's total limit, and tokens remaining is simply that minus your text. Output you want the model to write also has to fit, so leave room for it.",
        "Window sizes are fixed values stored in the tool for the 13 listed models. Providers change limits and release new models, so check the provider's documentation for the current figure.",
        "It counts text only. Images, files, tool definitions and system prompts you add elsewhere are not included unless you paste them in.",
      ],
      faq: [
        {
          q: "What does the context window mean?",
          a: "It is the maximum number of tokens a model can take in a single request, covering your prompt and the reply together. When the input alone is close to the limit, there is little room left for an answer.",
        },
        {
          q: "How accurate is the token count?",
          a: "It is an estimate. The page counts tokens with an OpenAI-style tokenizer and applies a small fixed adjustment for Claude and Llama 3.3. Treat it as a close guide, not the figure on your bill or the provider's counter.",
        },
        {
          q: "Which models can I check?",
          a: "Thirteen: GPT-4o, GPT-4o mini, o1, o3-mini, Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku 4.5, Gemini 2.0 Flash, Gemini 2.0 Pro, Llama 3.3 70B, Llama 3.1 405B, Mistral Large and DeepSeek V3.",
        },
        {
          q: "Does it show the cost?",
          a: "No. It shows tokens used, the share of the window and tokens remaining. For price estimates use the AI cost calculator or the model comparison tool.",
        },
        {
          q: "Is my text sent to the model provider?",
          a: "No. The tokenizer runs in your browser and nothing is sent anywhere. The tool never calls any model.",
        },
      ],
      steps: [
        "Select a model from the list.",
        "Paste your prompt or conversation into the text box, or load the sample.",
        "Read the token count, the percentage of the context window used and the tokens remaining.",
        "Trim your text if the bar is orange or red.",
      ],
    },
    ar: {
      intro:
        "تُظهر هذه الحاسبة كم تملأ نصوصك من نافذة سياق نموذج الذكاء الاصطناعي. الصق موجّهًا أو مستندًا أو محادثة كاملة، واختر واحدًا من 13 نموذجًا من OpenAI وAnthropic وGoogle وMeta وMistral وDeepSeek، فتعرض عدد الرموز مقابل نافذة النموذج، مع شريط تقدم ونسبة الاستخدام والرموز المتبقية. يتحول لون الشريط من الأخضر إلى الأصفر فالبرتقالي فالأحمر كلما امتلأ، ويظهر تحذير بعد 80% وتنبيه حرج بعد 95%.\n\nتتراوح أحجام النوافذ من 64,000 رمز في DeepSeek V3 إلى مليون في Gemini 2.0 Flash ومليونين في Gemini 2.0 Pro، وتُدرج نماذج Claude وo1 وo3-mini عند 200,000. ويملأ زر «تحميل مثال» نصًّا قصيرًا للتجربة. تعرض الأداة استهلاك الرموز فقط ولا تحسب التكلفة، وللتكلفة استخدم حاسبة تكلفة الذكاء الاصطناعي.",
      whyClientSide:
        "الموجّهات هي المكان الذي يلصق فيه الناس شيفرة برمجية ورسائل عملاء ومستندات داخلية. المُرمِّز (tokenizer) هنا مكتبة جافاسكربت مضمَّنة في الصفحة، فيُعدّ نصك على جهازك ولا يُرسل إلى خادم أو واجهة برمجية أو مزوّد نماذج لمجرد قياسه.",
      limitations: [
        "الأعداد تقديرية. تستخدم الأداة مُرمِّزًا واحدًا بنمط OpenAI لكل النماذج. وتُضرب أعداد Claude وLlama 3.3 بمعامل ثابت صغير، أما النماذج الأخرى فلا تُعدَّل، فقد يختلف العدد الحقيقي لدى مُرمِّز كل مزوّد، خصوصًا مع الشيفرة والنصوص غير الإنجليزية.",
        "النافذة المعروضة هي الحد الكلي للنموذج، والرموز المتبقية هي ببساطة الحد ناقص نصك. والناتج الذي تريد من النموذج كتابته يجب أن يتسع أيضًا، فاترك له مساحة.",
        "أحجام النوافذ قيم ثابتة مخزَّنة في الأداة للنماذج الثلاثة عشر المدرجة. تغيّر الشركات حدودها وتطلق نماذج جديدة، فراجع وثائق المزوّد للرقم الحالي.",
        "تعدّ الأداة النص فقط. الصور والملفات وتعريفات الأدوات وتعليمات النظام التي تضيفها في مكان آخر لا تُحتسب ما لم تلصقها هنا.",
      ],
      faq: [
        {
          q: "ما المقصود بنافذة السياق؟",
          a: "هي أقصى عدد من الرموز يستقبله النموذج في طلب واحد، ويشمل موجّهك والرد معًا. وإذا اقترب الإدخال وحده من الحد فلا تبقى مساحة تُذكر للإجابة.",
        },
        {
          q: "ما مدى دقة عدد الرموز؟",
          a: "هو تقدير. تعدّ الصفحة الرموز بمُرمِّز بنمط OpenAI وتطبّق تعديلًا ثابتًا صغيرًا لـ Claude وLlama 3.3. اعتبره دليلًا قريبًا لا الرقم الذي في فاتورتك أو عدّاد المزوّد.",
        },
        {
          q: "أي النماذج يمكنني فحصها؟",
          a: "ثلاثة عشر: GPT-4o وGPT-4o mini وo1 وo3-mini وClaude Opus 4.6 وClaude Sonnet 4.6 وClaude Haiku 4.5 وGemini 2.0 Flash وGemini 2.0 Pro وLlama 3.3 70B وLlama 3.1 405B وMistral Large وDeepSeek V3.",
        },
        {
          q: "هل تعرض التكلفة؟",
          a: "لا. تعرض الرموز المستخدمة ونسبة النافذة والرموز المتبقية. ولتقدير السعر استخدم حاسبة تكلفة الذكاء الاصطناعي أو أداة مقارنة النماذج.",
        },
        {
          q: "هل يُرسل نصي إلى مزوّد النموذج؟",
          a: "لا. يعمل المُرمِّز في متصفحك ولا يُرسل شيء إلى أي مكان. والأداة لا تستدعي أي نموذج.",
        },
      ],
      steps: [
        "اختر نموذجًا من القائمة.",
        "الصق موجّهك أو محادثتك في خانة النص، أو حمّل المثال.",
        "اقرأ عدد الرموز ونسبة استخدام نافذة السياق والرموز المتبقية.",
        "اختصر نصك إذا صار الشريط برتقاليًا أو أحمر.",
      ],
    },
  },

  "favicon-generator": {
    related: ["image-resizer", "crop-image", "image-converter", "svg-png"],
    en: {
      intro:
        "This tool makes a complete favicon set from an image, a letter or an emoji. Upload a logo (PNG, JPG, WebP, SVG or GIF up to 15 MB), or switch to the letter mode and type up to four characters, then pick a background and text color. Press Generate and you get previews of six PNG sizes: 16, 32, 48, 180, 192 and 512 pixels.\n\nThe download is one ZIP containing those PNGs (the 180 px one is named apple-touch-icon.png), a favicon.ico, a site.webmanifest and a ready-to-paste HTML snippet with the link tags. The .ico file holds the 16 and 32 px sizes. You can also copy the snippet from the page. Upload files at your site's root, paste the snippet into your page head, and browsers, phones and tab bars will pick the icon up.",
      whyClientSide:
        "The privacy stake is small, since a favicon is public the moment you publish it. Still, a logo you have not launched yet is rendered to icon sizes and zipped on your device rather than sent to a converter, which also means the result appears immediately.",
      limitations: [
        "The favicon.ico contains only the 16 and 32 px sizes. That covers browser tabs and bookmarks, but Windows shortcuts or older uses that expect 48 or 256 px inside the .ico will not find them there.",
        "Images are scaled to fill a square and the overflow is cropped from the center, so a wide or tall logo loses its edges. Prepare a square image, or crop it first.",
        "The generated site.webmanifest has empty name and short_name fields and white theme and background colors. Fill them in before you publish.",
        "The HTML snippet links the .ico, the 16 and 32 px PNGs, the apple-touch-icon and the manifest. The 48 px PNG is in the ZIP but not in the snippet, and the 192 and 512 px icons are referenced through the manifest.",
        "Letter and emoji icons are drawn with your device's own fonts, so an emoji may look different from one generated on another system. The letter mode does not support custom fonts.",
      ],
      faq: [
        {
          q: "What files are in the ZIP?",
          a: "Six PNGs (16, 32, 48, 180 as apple-touch-icon, 192 and 512 pixels), favicon.ico, site.webmanifest and favicon-snippet.html.",
        },
        {
          q: "Which sizes are inside favicon.ico?",
          a: "16 by 16 and 32 by 32 pixels, stored as PNG images in the ICO container. That is enough for browser tabs and bookmarks in current browsers.",
        },
        {
          q: "Can I make a favicon from a letter or an emoji?",
          a: "Yes. Switch to the letter mode, type up to four characters, and choose the background and text colors. The glyph is centered in a square.",
        },
        {
          q: "Where do I put the files?",
          a: "Upload them to the root of your site, then paste the contents of favicon-snippet.html into the head of your pages. The paths in the snippet start with a slash, so they expect the files at the root.",
        },
        {
          q: "Will a transparent logo stay transparent?",
          a: "Yes for an uploaded image with transparency: the PNGs are drawn without a background. A letter or emoji icon always has the background color you choose.",
        },
      ],
      steps: [
        "Upload a logo, or switch to the letter mode and type a letter or emoji.",
        "Choose colors if you are using a letter, then press Generate.",
        "Check the previews of each size.",
        "Download the ZIP, upload the files to your site's root, and paste the snippet into your page head.",
      ],
    },
    ar: {
      intro:
        "تصنع هذه الأداة مجموعة أيقونات موقع (favicon) كاملة من صورة أو حرف أو رمز تعبيري. ارفع شعارًا (PNG أو JPG أو WebP أو SVG أو GIF حتى 15 ميغابايت)، أو انتقل إلى وضع الحرف واكتب حتى أربعة رموز، ثم اختر لون الخلفية ولون النص. اضغط «توليد» فتظهر معاينات لستة أحجام بصيغة PNG: 16 و32 و48 و180 و192 و512 بكسل.\n\nالتنزيل ملف ZIP واحد يضم هذه الصور (يُسمّى الحجم 180 باسم apple-touch-icon.png)، وملف favicon.ico، وملف site.webmanifest، وقصاصة HTML جاهزة للصق فيها وسوم الروابط. يحتوي ملف .ico على الحجمين 16 و32 بكسل. ويمكنك أيضًا نسخ القصاصة من الصفحة. ارفع الملفات إلى جذر موقعك والصق القصاصة في رأس صفحتك، فتلتقط المتصفحات والهواتف وشريط التبويبات الأيقونة.",
      whyClientSide:
        "الأثر على الخصوصية صغير، فأيقونة الموقع علنية بمجرد النشر. ومع ذلك فالشعار الذي لم تطلقه بعد يُحوَّل إلى أحجام الأيقونات ويُضغط في ZIP على جهازك بدل إرساله إلى محوّل، وهذا يعني أيضًا ظهور النتيجة فورًا.",
      limitations: [
        "ملف favicon.ico يحتوي الحجمين 16 و32 بكسل فقط. يكفي هذا لتبويبات المتصفح والمفضلة، لكن اختصارات ويندوز أو الاستخدامات القديمة التي تتوقع 48 أو 256 بكسل داخل ملف .ico لن تجدها فيه.",
        "تُكبَّر الصورة لتملأ المربع ويُقصّ الزائد من الوسط، فيفقد الشعار العريض أو الطويل أطرافه. جهّز صورة مربعة أو اقصّها أولًا.",
        "الملف site.webmanifest المولَّد حقلا name وshort_name فيه فارغان، ولونا السمة والخلفية أبيضان. عبّئهما قبل النشر.",
        "تربط قصاصة HTML ملف .ico وصورتي PNG بحجمي 16 و32 وأيقونة apple-touch-icon وملف manifest. صورة 48 بكسل موجودة في ZIP لكنها ليست في القصاصة، وأيقونتا 192 و512 يُشار إليهما عبر ملف manifest.",
        "أيقونات الحرف والرمز التعبيري تُرسم بخطوط جهازك، فقد يختلف شكل الرمز التعبيري عمّا يولَّد على نظام آخر. ولا يدعم وضع الحرف خطوطًا مخصصة.",
      ],
      faq: [
        {
          q: "ما الملفات الموجودة في ملف ZIP؟",
          a: "ست صور PNG (16 و32 و48 و180 باسم apple-touch-icon و192 و512 بكسل) وملف favicon.ico وملف site.webmanifest وملف favicon-snippet.html.",
        },
        {
          q: "أي الأحجام داخل favicon.ico؟",
          a: "16×16 و32×32 بكسل، مخزَّنان كصورتي PNG داخل حاوية ICO. وهذا يكفي لتبويبات المتصفح والمفضلة في المتصفحات الحالية.",
        },
        {
          q: "هل أصنع أيقونة من حرف أو رمز تعبيري؟",
          a: "نعم. انتقل إلى وضع الحرف واكتب حتى أربعة رموز واختر لوني الخلفية والنص. يُوضع الرمز في وسط المربع.",
        },
        {
          q: "أين أضع الملفات؟",
          a: "ارفعها إلى جذر موقعك، ثم الصق محتوى favicon-snippet.html في رأس صفحاتك. المسارات في القصاصة تبدأ بشرطة مائلة، فهي تتوقع الملفات في الجذر.",
        },
        {
          q: "هل يبقى الشعار الشفاف شفافًا؟",
          a: "نعم للصورة المرفوعة التي فيها شفافية، إذ تُرسم صور PNG بلا خلفية. أما أيقونة الحرف أو الرمز التعبيري فلها دائمًا لون الخلفية الذي تختاره.",
        },
      ],
      steps: [
        "ارفع شعارًا، أو انتقل إلى وضع الحرف واكتب حرفًا أو رمزًا تعبيريًا.",
        "اختر الألوان إن كنت تستخدم حرفًا، ثم اضغط «توليد».",
        "راجع معاينات كل حجم.",
        "نزّل ملف ZIP وارفع الملفات إلى جذر موقعك والصق القصاصة في رأس صفحتك.",
      ],
    },
  },

  "word-frequency": {
    related: ["text-counter", "text-similarity", "text-sorter", "text-case", "token-counter"],
    en: {
      intro:
        "Paste any English text and this tool counts how often each word appears, then ranks the words from most to least frequent. The results table shows the rank, the word, the count and its share of all words, with a small bar next to each word so the leaders stand out. A summary card gives the total word count, the number of unique words and the most common word.\n\nThree options shape the count. Case-insensitive merges \"The\" and \"the\" into one entry, Remove stop words skips a built-in list of 77 very common English words (the, and, is, you and so on), and Minimum word length ignores words shorter than the number you set (the default is 2). The table shows the top 10 words; press the button below it to see all of them, and export the full list as a CSV file with the columns Rank, Word, Count and Percent.",
      whyClientSide:
        "Counting is plain JavaScript running on the text in the box, and nothing is sent anywhere, so it is safe for a draft, an essay or a transcript you would rather not paste into a web service. There is no account and no size limit beyond what your browser can handle.",
      limitations: [
        "Only words made of the letters A to Z (plus apostrophes) are counted. Accented letters, Arabic, Cyrillic, Chinese and other scripts are not recognised: a word like \"café\" is split at the é, and a text written in another alphabet shows no results at all.",
        "Numbers are ignored, and a hyphenated word such as \"well-known\" is counted as two words, \"well\" and \"known\".",
        "The stop-word list is fixed and English only. You can switch it on or off but not edit it. Different forms of a word (\"run\", \"runs\", \"running\") are counted separately because the tool does no stemming.",
        "The percentage is each word's count divided by the total number of words in the text, including the ones you filtered out. With stop words removed, the percentages in the table therefore add up to less than 100%.",
      ],
      faq: [
        {
          q: "How do I find the most common words in a text?",
          a: "Paste the text into the box. The table lists words from most to least frequent, and the summary card shows the most common word and how many times it appears. Turn Remove stop words on to hide filler words like \"the\" and \"and\".",
        },
        {
          q: "Does it work with Arabic or other languages?",
          a: "No. It only recognises words written with the letters A to Z and apostrophes, so Arabic, Chinese, Russian and accented words are not counted correctly. Use it for English text.",
        },
        {
          q: "What counts as a stop word?",
          a: "A built-in list of 77 common English words such as the, a, is, of, and, to, you, this and would. The list cannot be edited, but you can turn it off to count every word.",
        },
        {
          q: "Can I export the results?",
          a: "Yes. The export button downloads word-frequency.csv with every word in the analysis, not only the top 10, with the columns Rank, Word, Count and Percent.",
        },
        {
          q: "Why do the percentages not add up to 100%?",
          a: "Each percentage is the word's count divided by all words in your text, before stop words and short words are removed. If those filters are on, the words they hide still count toward the total.",
        },
      ],
      steps: [
        "Paste or type your text into the input box.",
        "Choose whether to ignore case, remove stop words and set a minimum word length.",
        "Read the ranked table and the summary card, and press the button to show every word.",
        "Export the list as a CSV file if you want to use it in a spreadsheet.",
      ],
    },
    ar: {
      intro:
        "الصق أي نص إنجليزي وستحسب هذه الأداة كم مرة تكرّرت كل كلمة، ثم ترتّب الكلمات من الأكثر تكرارًا إلى الأقل. يعرض الجدول الترتيب والكلمة وعدد مرات ظهورها ونسبتها من مجموع الكلمات، ويظهر بجانب كل كلمة شريط صغير يُبرز الكلمات الأعلى تكرارًا. وتعرض بطاقة الملخص إجمالي الكلمات وعدد الكلمات الفريدة والكلمة الأكثر شيوعًا.\n\nهناك ثلاثة خيارات تضبط الحساب. خيار تجاهل حالة الأحرف يدمج «The» و«the» في عنصر واحد، وخيار إزالة كلمات الوصل يتخطى قائمة جاهزة من 77 كلمة إنجليزية شائعة جدًا (the وand وis وyou وغيرها)، وخيار الحد الأدنى لطول الكلمة يتجاهل الكلمات الأقصر من الرقم الذي تحدده (الافتراضي 2). يعرض الجدول أعلى 10 كلمات، وبزر تحته تعرض الباقي، ويمكنك تصدير القائمة كاملة بصيغة CSV بأعمدة الترتيب والكلمة والعدد والنسبة.",
      whyClientSide:
        "الحساب يتم بكود JavaScript على النص الموجود في الصندوق، ولا يُرسل شيء إلى أي جهة، فيناسب مسودة أو مقالًا أو نصًا مفرغًا لا تريد لصقه في خدمة على الإنترنت. لا حساب ولا حدّ على حجم النص سوى ما يتحمله متصفحك.",
      limitations: [
        "لا تُحتسب إلا الكلمات المكتوبة بالأحرف اللاتينية من A إلى Z (مع علامة الفاصلة العليا). الحروف المشكّلة والعربية والسيريلية والصينية وغيرها غير معروفة للأداة: كلمة مثل «café» تنقسم عند حرف é، والنص المكتوب بأبجدية أخرى لا يعطي أي نتيجة.",
        "تُتجاهل الأرقام، وتُحسب الكلمة المركّبة بشرطة مثل «well-known» كلمتين: «well» و«known».",
        "قائمة كلمات الوصل ثابتة وإنجليزية فقط، يمكنك تشغيلها أو إيقافها لكن لا تعديلها. وتُعدّ صيغ الكلمة الواحدة (run وruns وrunning) كلمات منفصلة لأن الأداة لا تردّ الكلمات إلى جذورها.",
        "النسبة هي عدد مرات الكلمة مقسومًا على إجمالي كلمات النص بما فيها الكلمات التي استبعدتها بالفلاتر. لذلك عند تفعيل إزالة كلمات الوصل يكون مجموع النسب في الجدول أقل من 100%.",
      ],
      faq: [
        {
          q: "كيف أعرف أكثر الكلمات تكرارًا في نص؟",
          a: "الصق النص في الصندوق، فيعرض الجدول الكلمات من الأكثر تكرارًا إلى الأقل، وتُظهر بطاقة الملخص الكلمة الأكثر شيوعًا وعدد مرات ظهورها. فعّل خيار إزالة كلمات الوصل لإخفاء كلمات مثل «the» و«and».",
        },
        {
          q: "هل تعمل الأداة مع العربية أو لغات أخرى؟",
          a: "لا. هي تتعرف فقط على الكلمات المكتوبة بالأحرف من A إلى Z والفاصلة العليا، فلا تُحسب العربية ولا الصينية ولا الروسية ولا الكلمات ذات الحروف المشكّلة بشكل صحيح. استخدمها للنصوص الإنجليزية.",
        },
        {
          q: "ما هي كلمات الوصل التي تستبعدها الأداة؟",
          a: "قائمة جاهزة من 77 كلمة إنجليزية شائعة مثل the وa وis وof وand وto وyou وthis وwould. لا يمكن تعديل القائمة، لكن يمكنك إيقافها لتُحسب كل الكلمات.",
        },
        {
          q: "هل يمكنني تصدير النتائج؟",
          a: "نعم. يُنزّل زر التصدير ملف word-frequency.csv يضم كل الكلمات المحلَّلة وليس أعلى 10 فقط، بأعمدة الترتيب والكلمة والعدد والنسبة.",
        },
        {
          q: "لماذا لا يساوي مجموع النسب 100%؟",
          a: "كل نسبة هي عدد مرات الكلمة مقسومًا على كل كلمات نصك قبل حذف كلمات الوصل والكلمات القصيرة. فإذا كانت الفلاتر مفعّلة تبقى الكلمات المخفية داخلة في المجموع.",
        },
      ],
      steps: [
        "الصق نصك أو اكتبه في صندوق الإدخال.",
        "اختر تجاهل حالة الأحرف وإزالة كلمات الوصل وحدد الحد الأدنى لطول الكلمة.",
        "اقرأ الجدول المرتب وبطاقة الملخص، واضغط الزر لعرض كل الكلمات.",
        "صدّر القائمة بصيغة CSV إن أردت استخدامها في جدول بيانات.",
      ],
    },
  },

  "text-diff": {
    related: ["text-similarity", "ai-instruction-diff", "text-sorter", "text-counter"],
    en: {
      intro:
        "Paste an original text on the left and a changed version on the right, and this tool marks what differs. Below the two boxes the changed version is listed line by line: lines that were removed are shown in red with a minus sign, lines that were added are shown in green with a plus sign, and lines that match are left plain. The original text is shown beside it for reference.\n\nA Copy Patch button copies the same result as plain text, with each line starting with +, - or a space. It is a quick way to see which lines of a note, config file, list or paragraph were edited.",
      whyClientSide:
        "Both texts are compared by code running in your browser tab, and nothing is sent to a server. That matters when you are comparing a config file with credentials in it, a draft contract or two versions of private notes.",
      limitations: [
        "This is a simple line-by-line comparison, not a true diff. Line 1 is compared with line 1, line 2 with line 2, and so on by position. If you insert or delete a line near the top, every line after it is shown as changed even though only one line moved. For code or documents where lines get inserted, expect noisy results.",
        "A changed line is shown as a whole: the old line in red and the new line in green. It does not highlight which words or characters changed inside the line.",
        "The copied patch is only the list of prefixed lines. It has no file headers or line-number hunks, so tools such as git apply or patch cannot use it.",
        "Whitespace and capitalisation count as differences, and there are no options to ignore them. Blank lines that match are not marked, and an empty line that replaces text shows as a removal only.",
      ],
      faq: [
        {
          q: "How do I compare two texts online?",
          a: "Paste the original into the left box and the changed version into the right box. The comparison appears straight away below: red lines with a minus were removed and green lines with a plus were added.",
        },
        {
          q: "Why does the whole text show as changed after I add one line?",
          a: "The tool compares lines by their position, not by content. A line added near the top shifts every line below it, so each position no longer matches. Add new lines at the end, or compare smaller blocks, for cleaner results.",
        },
        {
          q: "Does it show which words changed inside a line?",
          a: "No. It marks whole lines as removed or added. If one word differs, the entire old line appears in red and the entire new line in green.",
        },
        {
          q: "What does Copy Patch give me?",
          a: "A plain-text list of every line prefixed with +, - or a space. It is meant for reading or pasting into a message, and it is not a standard unified diff, so it cannot be applied with git or patch.",
        },
        {
          q: "Is my text uploaded?",
          a: "No. The comparison runs in your browser and the two texts are never sent to a server.",
        },
      ],
      steps: [
        "Paste the original text into the left box.",
        "Paste the modified text into the right box.",
        "Read the comparison below: red with a minus is removed, green with a plus is added.",
        "Press Copy Patch to copy the result as plain text.",
      ],
    },
    ar: {
      intro:
        "الصق النص الأصلي في الصندوق الأيسر والنص المعدَّل في الأيمن، وستُظهر الأداة ما اختلف بينهما. تحت الصندوقين تُعرض النسخة المعدَّلة سطرًا بسطر: السطور المحذوفة بالأحمر مع علامة ناقص، والسطور المضافة بالأخضر مع علامة زائد، والسطور المتطابقة تبقى دون تلوين. ويظهر النص الأصلي بجانبها للمقارنة.\n\nيمكنك نسخ النتيجة نفسها كنص عادي بزر «نسخ الفروقات»، إذ يبدأ كل سطر بالرمز + أو - أو مسافة. هي طريقة سريعة لمعرفة السطور التي تغيّرت في ملاحظة أو ملف إعدادات أو قائمة أو فقرة.",
      whyClientSide:
        "تتم المقارنة بكود يعمل داخل تبويب المتصفح ولا يُرسل أي من النصين إلى خادم. وهذا مهم حين تقارن ملف إعدادات فيه بيانات دخول، أو مسودة عقد، أو نسختين من ملاحظات خاصة.",
      limitations: [
        "هذه مقارنة بسيطة سطرًا بسطر وليست أداة diff حقيقية: يُقارن السطر الأول بالأول والثاني بالثاني وهكذا حسب الموضع. فإذا أضفت سطرًا أو حذفت آخر قرب البداية ظهرت كل السطور التي بعده مختلفة مع أن سطرًا واحدًا فقط تحرّك. توقّع نتائج مزدحمة مع الأكواد والمستندات التي تُدرج فيها سطور جديدة.",
        "السطر المتغيّر يظهر كاملًا: القديم بالأحمر والجديد بالأخضر، ولا تُميَّز الكلمات أو الأحرف التي تغيّرت داخل السطر.",
        "الفروقات المنسوخة مجرد قائمة سطور مسبوقة بعلاماتها، دون ترويسات ملفات أو أرقام أسطر، فلا تستطيع أدوات مثل git apply أو patch استخدامها.",
        "الفراغات وحالة الأحرف تُحسب اختلافًا، ولا توجد خيارات لتجاهلها. السطور الفارغة المتطابقة لا تُعلَّم، والسطر الفارغ الذي يحل محل نص يظهر كحذف فقط.",
      ],
      faq: [
        {
          q: "كيف أقارن بين نصين أونلاين؟",
          a: "الصق الأصل في الصندوق الأيسر والنسخة المعدَّلة في الأيمن، فتظهر المقارنة فورًا في الأسفل: السطور الحمراء مع ناقص حُذفت، والخضراء مع زائد أُضيفت.",
        },
        {
          q: "لماذا يظهر النص كله متغيّرًا بعد أن أضفت سطرًا واحدًا؟",
          a: "لأن الأداة تقارن السطور بحسب موضعها لا بحسب محتواها. السطر المضاف قرب البداية يزيح كل ما تحته فلا تتطابق المواضع. أضف السطور الجديدة في النهاية، أو قارن كتلًا أصغر، لنتيجة أنظف.",
        },
        {
          q: "هل تُظهر الكلمات التي تغيّرت داخل السطر؟",
          a: "لا. هي تعلّم السطور كاملة كمحذوفة أو مضافة. فإذا اختلفت كلمة واحدة ظهر السطر القديم كله بالأحمر والجديد كله بالأخضر.",
        },
        {
          q: "ماذا يعطيني زر نسخ الفروقات؟",
          a: "قائمة نصية بكل سطر مسبوقًا بـ + أو - أو مسافة. هي للقراءة أو للصقها في رسالة، وليست بصيغة unified diff القياسية، فلا يمكن تطبيقها بـ git أو patch.",
        },
        {
          q: "هل يُرفع نصي إلى الإنترنت؟",
          a: "لا. تعمل المقارنة داخل متصفحك ولا يُرسل أي من النصين إلى خادم.",
        },
      ],
      steps: [
        "الصق النص الأصلي في الصندوق الأيسر.",
        "الصق النص المعدَّل في الصندوق الأيمن.",
        "اقرأ المقارنة في الأسفل: الأحمر مع ناقص محذوف، والأخضر مع زائد مضاف.",
        "اضغط «نسخ الفروقات» لنسخ النتيجة كنص عادي.",
      ],
    },
  },

  "text-summarizer": {
    related: ["sentiment-analyzer", "translator", "audio-transcriber", "token-counter", "text-counter"],
    en: {
      intro:
        "Paste a long piece of English text and this tool writes a shorter summary of it. Pick Short, Medium or Long, press Summarize, and the summary appears below with a word count for both your text and the result. You can copy the summary with one click.\n\nIt uses a small AI model, distilbart-cnn-6-6 (the Xenova/distilbart-cnn-6-6 build of DistilBART), which writes new sentences rather than only picking lines from your text. Short asks for a summary of roughly 15 to 60 tokens, Medium 40 to 130 and Long 90 to 230. A token is a word piece, a little shorter than a word on average, so these are not exact word counts.",
      whyClientSide:
        "Your text is summarized on your own device: the model runs in your browser using WebAssembly, and the text you paste is never sent to a server. That makes it usable for meeting notes, drafts and other writing you would not hand to an online summarizer. The one network request is the model itself. About 284 MB of model files download from a CDN the first time you press Summarize, and your browser keeps them so later summaries start without downloading again. Until that first download finishes there is no way to use the tool offline.",
      limitations: [
        "The first summary needs a download of about 284 MB, and the tool shows a progress bar while it loads. On a slow connection or a metered plan that is a real cost. The model also runs on your CPU through WebAssembly, so summarizing a long text takes noticeably longer than a hosted service would.",
        "The model was built for English news-style text. Other languages give poor or unusable results, and the tool does not translate.",
        "The tool does not split long input into chunks. The model reads only up to its input limit, about a thousand tokens or a little under 800 English words, so a very long document is summarized from its beginning only and the rest is silently ignored.",
        "A generated summary can leave out important points or state something slightly wrong, because the model writes new text instead of quoting. Treat it as a first pass and check it against the original before you rely on it.",
      ],
      faq: [
        {
          q: "Is my text uploaded to summarize it?",
          a: "No. The summarization model runs inside your browser, so the text stays on your device. The only download is the model files themselves, which come from a CDN the first time you use the tool.",
        },
        {
          q: "How big is the download and do I need it every time?",
          a: "About 284 MB the first time. Your browser caches the files, so later summaries on the same browser do not download them again unless you clear site data. The tool shows the size on the page.",
        },
        {
          q: "Which model does it use?",
          a: "Xenova/distilbart-cnn-6-6, a distilled BART model fine-tuned for news summarization, run in your browser with Transformers.js on the WebAssembly backend.",
        },
        {
          q: "What do Short, Medium and Long change?",
          a: "They set the minimum and maximum length of the generated summary in tokens: 15 to 60 for Short, 40 to 130 for Medium and 90 to 230 for Long. Tokens are slightly shorter than words, so the word count shown under the result will differ.",
        },
        {
          q: "Can it summarize Arabic or other languages?",
          a: "It is not meant to. The model is trained on English, so expect poor results for other languages.",
        },
        {
          q: "Why does the summary ignore the end of my long text?",
          a: "The model has an input limit of around a thousand tokens and the tool does not break longer text into parts. Anything past that limit is cut off before summarizing, so summarize long documents section by section.",
        },
      ],
      steps: [
        "Paste or type your English text into the box.",
        "Choose Short, Medium or Long for the summary length.",
        "Press Summarize. The first time, wait for the model to download.",
        "Read the summary, check it against your text, and copy it.",
      ],
    },
    ar: {
      intro:
        "الصق نصًّا إنجليزيًا طويلًا وستكتب هذه الأداة ملخصًا أقصر له. اختر قصيرًا أو متوسطًا أو طويلًا، ثم اضغط «تلخيص»، فيظهر الملخص في الأسفل مع عدد كلمات نصك وعدد كلمات الملخص. ويمكنك نسخ الملخص بنقرة واحدة.\n\nتستخدم الأداة نموذج ذكاء اصطناعي صغيرًا هو distilbart-cnn-6-6 (نسخة Xenova/distilbart-cnn-6-6 من DistilBART)، وهو يكتب جملًا جديدة ولا يكتفي باختيار سطور من نصك. يطلب الخيار القصير ملخصًا بنحو 15 إلى 60 رمزًا (token)، والمتوسط من 40 إلى 130، والطويل من 90 إلى 230. والرمز قطعة من كلمة وهو أقصر من الكلمة في المتوسط، فهذه الأرقام ليست عدد كلمات بالضبط.",
      whyClientSide:
        "يُلخَّص نصك على جهازك: يعمل النموذج داخل المتصفح عبر WebAssembly، ولا يُرسل النص الذي تلصقه إلى أي خادم. لذا تصلح الأداة لملاحظات اجتماع أو مسودة أو كتابة لا تريد تسليمها لمُلخِّص على الإنترنت. الطلب الوحيد على الشبكة هو النموذج نفسه: نحو 284 ميغابايت من ملفاته تُنزَّل من شبكة CDN عند أول ضغطة على «تلخيص»، ويحتفظ بها المتصفح فتبدأ الملخصات اللاحقة دون تنزيل جديد. ولا يمكن استخدام الأداة دون اتصال قبل اكتمال هذا التنزيل الأول.",
      limitations: [
        "أول ملخص يحتاج تنزيل نحو 284 ميغابايت، ويعرض شريط تقدّم أثناء التحميل. على اتصال بطيء أو باقة محدودة هذه تكلفة حقيقية. كما يعمل النموذج على المعالج عبر WebAssembly، فيستغرق تلخيص النص الطويل وقتًا أطول بوضوح من خدمة مستضافة.",
        "بُني النموذج لنصوص إنجليزية بأسلوب الأخبار. اللغات الأخرى تعطي نتائج ضعيفة أو غير صالحة، والأداة لا تترجم.",
        "لا تقسّم الأداة النص الطويل إلى أجزاء. يقرأ النموذج حتى حدّ إدخاله فقط، وهو نحو ألف رمز أو أقل قليلًا من 800 كلمة إنجليزية، فيُلخَّص المستند الطويل جدًا من بدايته فقط ويُهمَل الباقي دون تنبيه.",
        "قد يُسقط الملخص المولَّد نقاطًا مهمة أو يذكر شيئًا غير دقيق تمامًا، لأن النموذج يكتب نصًّا جديدًا ولا ينقل حرفيًا. اعتبره مسودة أولى وراجعه مع الأصل قبل الاعتماد عليه.",
      ],
      faq: [
        {
          q: "هل يُرفع نصي للتلخيص؟",
          a: "لا. يعمل نموذج التلخيص داخل متصفحك فيبقى النص على جهازك. والتنزيل الوحيد هو ملفات النموذج نفسها، وتأتي من شبكة CDN عند أول استخدام.",
        },
        {
          q: "ما حجم التنزيل، وهل أحتاجه في كل مرة؟",
          a: "نحو 284 ميغابايت في المرة الأولى. يخزّن المتصفح الملفات فلا تُنزَّل ثانية في الملخصات اللاحقة على المتصفح نفسه ما لم تمسح بيانات الموقع. وتعرض الصفحة الحجم.",
        },
        {
          q: "أي نموذج تستخدم الأداة؟",
          a: "Xenova/distilbart-cnn-6-6، وهو نموذج BART مُقطَّر ومدرَّب على تلخيص الأخبار، يعمل في متصفحك بمكتبة Transformers.js على واجهة WebAssembly.",
        },
        {
          q: "ماذا تغيّر خيارات قصير ومتوسط وطويل؟",
          a: "تحدد الحد الأدنى والأقصى لطول الملخص بالرموز: من 15 إلى 60 للقصير، ومن 40 إلى 130 للمتوسط، ومن 90 إلى 230 للطويل. الرمز أقصر قليلًا من الكلمة، لذا سيختلف عدد الكلمات الظاهر تحت النتيجة.",
        },
        {
          q: "هل تلخّص العربية أو لغات أخرى؟",
          a: "ليست مصمَّمة لذلك. النموذج مدرَّب على الإنجليزية، فتوقّع نتائج ضعيفة مع اللغات الأخرى.",
        },
        {
          q: "لماذا يتجاهل الملخص نهاية نصي الطويل؟",
          a: "لأن حدّ إدخال النموذج نحو ألف رمز، والأداة لا تقسّم النص الأطول إلى أجزاء. ما زاد عن الحد يُقطع قبل التلخيص، فلخّص المستندات الطويلة قسمًا بعد قسم.",
        },
      ],
      steps: [
        "الصق نصك الإنجليزي أو اكتبه في الصندوق.",
        "اختر طول الملخص: قصير أو متوسط أو طويل.",
        "اضغط «تلخيص». في أول مرة انتظر اكتمال تنزيل النموذج.",
        "اقرأ الملخص وقارنه بنصك ثم انسخه.",
      ],
    },
  },

  "video-to-audio": {
    related: ["video-converter", "compress-video", "audio-transcriber", "video", "gif-maker"],
    en: {
      intro:
        "This tool pulls the audio track out of a video and saves it as an audio file. Drop in one or more videos (MP4, MOV, WebM, MKV, AVI or M4V), choose MP3, M4A, OGG or WAV, pick a bitrate, and press Convert all. Each file gets its own row with a progress bar and a Download button, and the output keeps the original file name with the new extension.\n\nFor MP3, M4A and OGG you can choose 128, 192, 256 or 320 kbps; WAV is uncompressed 16-bit audio, so it has no bitrate option. A Trim control on each row takes a start and end time in mm:ss so you can keep just part of the audio. The conversion is done by ffmpeg compiled to WebAssembly (ffmpeg.wasm), the same engine used by the Video Converter and Compress Video tools.",
      whyClientSide:
        "A video is often the most personal file on your device: a lecture, a call recording, a family clip. Here the file is read into your browser's memory, ffmpeg.wasm extracts the audio there, and the result is offered as a download, so the video is never uploaded. There is also no queue, daily limit or watermark of the kind hosted converters apply, and the only limit is your own machine.",
      limitations: [
        "Each file can be at most 500 MB; larger files are skipped with a message. The video and the result both have to fit in the browser tab's memory, so a file near the limit can still fail on a low-memory device.",
        "ffmpeg.wasm runs on a single thread without hardware acceleration, so it is slower than a desktop converter. Long videos take noticeably longer, and files are converted one after another rather than in parallel.",
        "The output is always re-encoded to the format you pick, even if the video already contains MP3 or AAC audio, so there is a small quality loss for MP3, M4A and OGG. Choose WAV for the least loss, at a much larger file size.",
        "The tool does not set a sample rate or channel layout, so it keeps what ffmpeg picks for the source. There is also no volume control, fade or tag editing.",
        "A video with no audio track, or in a format ffmpeg cannot read, ends with a \"No audio track found or unsupported format\" message instead of a file. The Cancel button stops after the file currently being converted rather than interrupting it.",
      ],
      faq: [
        {
          q: "Is my video uploaded?",
          a: "No. ffmpeg runs as WebAssembly inside your browser tab. The video is read from your disk into the page's memory, converted there, and the audio file is offered as a download. No network request carries your video.",
        },
        {
          q: "What is the maximum file size?",
          a: "500 MB per video. Files above that are skipped with a \"File too large\" message. Since everything happens in browser memory, very large files near the limit may still fail on a device with little RAM.",
        },
        {
          q: "Which audio formats can I get?",
          a: "MP3 (libmp3lame), M4A (AAC), OGG (Vorbis) and WAV (16-bit PCM). MP3, M4A and OGG offer 128, 192, 256 and 320 kbps; WAV has no bitrate setting.",
        },
        {
          q: "Can I extract just part of the audio?",
          a: "Yes. Open Trim on a file's row and enter a start and end time in mm:ss. Leave a field empty to start at the beginning or run to the end. The start time must be before the end time.",
        },
        {
          q: "Why is it slower than a desktop app?",
          a: "ffmpeg.wasm runs on one thread with no hardware acceleration inside the browser, so conversions take longer than native ffmpeg, especially for long videos. Videos are processed one at a time.",
        },
        {
          q: "Can I convert several videos at once?",
          a: "You can add many videos and convert them all with one press of Convert all, but they are processed one after another, and each gets its own Download button.",
        },
      ],
      steps: [
        "Drop one or more videos onto the page, or click to choose them.",
        "Choose the audio format and, for MP3, M4A or OGG, the bitrate.",
        "Optionally open Trim on a file and enter a start and end time.",
        "Press Convert all, then download each finished audio file.",
      ],
    },
    ar: {
      intro:
        "تستخرج هذه الأداة المسار الصوتي من الفيديو وتحفظه كملف صوتي. أسقط فيديو واحدًا أو أكثر (MP4 أو MOV أو WebM أو MKV أو AVI أو M4V)، واختر MP3 أو M4A أو OGG أو WAV، وحدد معدل البت، ثم اضغط «تحويل الكل». يحصل كل ملف على صفّ خاص به فيه شريط تقدم وزر تنزيل، ويحتفظ الناتج باسم الملف الأصلي مع الامتداد الجديد.\n\nمع MP3 وM4A وOGG يمكنك اختيار 128 أو 192 أو 256 أو 320 كيلوبت/ث، أما WAV فصوت غير مضغوط بدقة 16 بت فلا خيار معدل بت له. ويتيح خيار «قصّ» في كل صف إدخال وقت بداية ونهاية بصيغة mm:ss لتحتفظ بجزء من الصوت فقط. يتم التحويل بمحرك ffmpeg المترجَم إلى WebAssembly (ffmpeg.wasm)، وهو المحرك نفسه في أداتي محوّل الفيديو وضغط الفيديو.",
      whyClientSide:
        "الفيديو غالبًا من أكثر الملفات خصوصية على جهازك: محاضرة أو تسجيل مكالمة أو مقطع عائلي. هنا يُقرأ الملف في ذاكرة المتصفح، ويستخرج ffmpeg.wasm الصوت هناك، وتُقدَّم النتيجة للتنزيل، فلا يُرفع الفيديو أبدًا. كما لا طابور ولا حدّ يومي ولا علامة مائية مما تفرضه المحوّلات المستضافة، والحدّ الوحيد هو إمكانات جهازك.",
      limitations: [
        "أقصى حجم للملف 500 ميغابايت، والأكبر منه يُتخطّى برسالة. يجب أن يتسع الفيديو والناتج معًا في ذاكرة تبويب المتصفح، فقد يفشل ملف قريب من الحد على جهاز قليل الذاكرة.",
        "يعمل ffmpeg.wasm على خيط واحد دون تسريع عتادي، فهو أبطأ من برنامج التحويل على سطح المكتب. الفيديوهات الطويلة تستغرق وقتًا أطول بوضوح، وتُحوَّل الملفات واحدًا بعد الآخر لا بالتوازي.",
        "يُعاد ترميز الصوت دائمًا إلى الصيغة التي تختارها حتى لو كان الفيديو يحتوي أصلًا على صوت MP3 أو AAC، فيحدث فقد بسيط في الجودة مع MP3 وM4A وOGG. اختر WAV لأقل فقد، بحجم ملف أكبر بكثير.",
        "لا تحدد الأداة معدل العيّنة ولا عدد القنوات، فتبقى على ما يختاره ffmpeg من المصدر. ولا يوجد تحكم في مستوى الصوت ولا تلاشٍ تدريجي ولا تعديل لوسوم الملف.",
        "الفيديو الذي لا يحتوي مسارًا صوتيًا، أو بصيغة لا يقرؤها ffmpeg، ينتهي برسالة «لا يوجد مسار صوتي أو الصيغة غير مدعومة» بدل ملف. وزر الإلغاء يتوقف بعد الملف الجاري تحويله ولا يقاطعه.",
      ],
      faq: [
        {
          q: "هل يُرفع الفيديو الخاص بي؟",
          a: "لا. يعمل ffmpeg بتقنية WebAssembly داخل تبويب المتصفح. يُقرأ الفيديو من قرصك إلى ذاكرة الصفحة ويُحوَّل هناك، ويُقدَّم الملف الصوتي للتنزيل. لا يحمل أي طلب على الشبكة الفيديو الخاص بك.",
        },
        {
          q: "ما أقصى حجم للملف؟",
          a: "500 ميغابايت لكل فيديو. ما زاد عن ذلك يُتخطّى برسالة «الملف كبير جدًا». وبما أن كل شيء يتم في ذاكرة المتصفح، قد يفشل ملف قريب من الحد على جهاز ذاكرته قليلة.",
        },
        {
          q: "ما الصيغ الصوتية المتاحة؟",
          a: "MP3 (libmp3lame) وM4A (AAC) وOGG (Vorbis) وWAV (PCM بدقة 16 بت). تتيح MP3 وM4A وOGG معدلات 128 و192 و256 و320 كيلوبت/ث، ولا يوجد إعداد معدل بت لـ WAV.",
        },
        {
          q: "هل أستطيع استخراج جزء من الصوت فقط؟",
          a: "نعم. افتح «قصّ» في صف الملف وأدخل وقت البداية والنهاية بصيغة mm:ss. اترك الحقل فارغًا للبدء من الأول أو الاستمرار حتى النهاية. ويجب أن يسبق وقت البداية وقت النهاية.",
        },
        {
          q: "لماذا هي أبطأ من برنامج على الحاسوب؟",
          a: "يعمل ffmpeg.wasm على خيط واحد دون تسريع عتادي داخل المتصفح، فيستغرق التحويل وقتًا أطول من ffmpeg الأصلي، خاصة مع الفيديوهات الطويلة. وتُعالَج الفيديوهات واحدًا تلو الآخر.",
        },
        {
          q: "هل أحوّل عدة فيديوهات دفعة واحدة؟",
          a: "يمكنك إضافة فيديوهات كثيرة وتحويلها كلها بضغطة واحدة على «تحويل الكل»، لكنها تُعالَج بالتتابع، ولكل ملف زر تنزيل خاص به.",
        },
      ],
      steps: [
        "أسقط فيديو أو أكثر على الصفحة، أو انقر لاختيارها.",
        "اختر الصيغة الصوتية، ومعدل البت إن اخترت MP3 أو M4A أو OGG.",
        "إن شئت افتح «قصّ» في أحد الملفات وأدخل وقت البداية والنهاية.",
        "اضغط «تحويل الكل» ثم نزّل كل ملف صوتي ينتهي تحويله.",
      ],
    },
  },

  "screenshot-beautifier": {
    related: ["phone-mockups", "code-screenshot", "crop-image", "image-resizer", "meme-generator"],
    en: {
      intro:
        "This tool puts a plain screenshot on a styled background so it is ready for a blog post, a tweet or a product page. Upload an image (PNG, JPG, WebP or GIF up to 15 MB) and it is placed on a background with padding, rounded corners and a drop shadow. The preview updates as you change the settings, and the Download button saves the result as a PNG named after your file with _beautified added.\n\nBackground options are seven built-in styles (six two-color gradients and one four-color mesh), a solid color of your choice, or your own background image. You can add a window frame with three macOS-style dots, or a browser bar with a URL pill, and set the padding (0 to 200 px), corner radius (0 to 48 px), shadow blur, spread and opacity, and a tilt from -15 to 15 degrees. An aspect ratio menu offers Auto, 16:9, 1:1, 4:3, 9:16, Twitter/X card (1200×675) and Open Graph (1200×630) shapes.",
      whyClientSide:
        "Screenshots often show things you did not mean to publish: a dashboard, an inbox, customer names. The image is drawn onto a canvas in your browser and exported from there, so the original is never uploaded to a server. You can check it before it goes anywhere.",
      limitations: [
        "The screenshot is drawn at its original pixel size, not scaled to a fixed output, and the padding is added around it. A large screenshot gives a large PNG, and there is no setting to choose the export width. Use a resizer afterwards if you need a specific size.",
        "The output is always a PNG. There is no JPG or WebP export, so files for photos or very large screenshots can be heavy.",
        "The window frame and browser bar are fixed designs in a light gray with macOS-style dots. The URL pill is empty, because you cannot type an address into it, and there is no dark variant or Windows style.",
        "Screenshots larger than 15 MB are rejected. When you pick an aspect ratio, the canvas is extended to match it rather than cropping your screenshot, so extra background appears on the shorter side.",
        "Tilt is a flat rotation of the screenshot, not a 3D perspective effect.",
      ],
      faq: [
        {
          q: "Is my screenshot uploaded anywhere?",
          a: "No. The image is loaded into your browser and drawn onto a canvas there. The PNG you download is generated on your device, and nothing is sent to a server.",
        },
        {
          q: "What image types can I upload?",
          a: "PNG, JPG, JPEG, WebP and GIF, up to 15 MB. The result is exported as a PNG.",
        },
        {
          q: "Can I use my own background?",
          a: "Yes. Switch the background to image and upload your own picture, which is scaled to cover the canvas. You can also choose a solid color or one of seven built-in gradient and mesh presets.",
        },
        {
          q: "Which sizes can I make for social media?",
          a: "Choose the Twitter/X card (1200×675) or Open Graph (1200×630) aspect ratio, or 16:9, 1:1, 4:3 or 9:16. These set the shape of the canvas. The exact pixel size still depends on the size of your screenshot plus its padding.",
        },
        {
          q: "Can I add a browser window around my screenshot?",
          a: "Yes. Turn on the window frame for a title bar with three dots, or the browser bar for a title bar with a URL pill. You cannot edit the text of the URL pill.",
        },
      ],
      steps: [
        "Upload a screenshot by dropping it on the page or clicking to choose it.",
        "Pick a background: a preset, a solid color or your own image.",
        "Adjust the padding, corner radius, shadow, frame and aspect ratio while watching the preview.",
        "Press Download to save the finished PNG.",
      ],
    },
    ar: {
      intro:
        "تضع هذه الأداة لقطة الشاشة العادية على خلفية منسّقة لتصبح جاهزة لمقال أو تغريدة أو صفحة منتج. ارفع صورة (PNG أو JPG أو WebP أو GIF حتى 15 ميغابايت) فتوضع على خلفية مع هوامش وزوايا مستديرة وظل. تتحدث المعاينة مع كل تغيير في الإعدادات، ويحفظ زر التنزيل النتيجة بصيغة PNG باسم ملفك مضافًا إليه _beautified.\n\nخيارات الخلفية سبعة أنماط جاهزة (ستة تدرجات من لونين وتدرج شبكي من أربعة ألوان)، أو لون موحّد تختاره، أو صورتك الخاصة. يمكنك إضافة إطار نافذة بثلاث نقاط بأسلوب macOS، أو شريط متصفح فيه مربع عنوان، وضبط الهامش (من 0 إلى 200 بكسل) ونصف قطر الزوايا (من 0 إلى 48 بكسل) وضبابية الظل وانتشاره وشفافيته، وميل من -15 إلى 15 درجة. وتقدم قائمة نسبة العرض إلى الارتفاع الخيارات تلقائي و16:9 و1:1 و4:3 و9:16 وبطاقة تويتر/X (‎1200×675‎) وOpen Graph (‎1200×630‎).",
      whyClientSide:
        "كثيرًا ما تُظهر لقطات الشاشة أشياء لم تقصد نشرها: لوحة تحكم أو صندوق بريد أو أسماء عملاء. تُرسم الصورة على canvas داخل متصفحك وتُصدَّر من هناك، فلا تُرفع الأصلية إلى خادم. وتستطيع مراجعتها قبل أن تذهب إلى أي مكان.",
      limitations: [
        "تُرسم اللقطة بحجمها الأصلي بالبكسل دون تحجيم إلى مقاس ثابت، ويُضاف الهامش حولها. اللقطة الكبيرة تعطي PNG كبيرًا، ولا يوجد إعداد لاختيار عرض الملف المصدَّر. استخدم أداة تغيير حجم بعدها إن أردت مقاسًا محددًا.",
        "الناتج دائمًا PNG، فلا يوجد تصدير بصيغة JPG أو WebP، وقد تكون ملفات الصور الفوتوغرافية أو اللقطات الكبيرة جدًا ثقيلة.",
        "إطار النافذة وشريط المتصفح تصميمان ثابتان بلون رمادي فاتح ونقاط بأسلوب macOS. مربع العنوان فارغ إذ لا يمكنك كتابة عنوان فيه، ولا توجد نسخة داكنة ولا أسلوب ويندوز.",
        "اللقطات الأكبر من 15 ميغابايت تُرفض. وعند اختيار نسبة عرض إلى ارتفاع يُوسَّع الـ canvas ليطابقها بدل اقتصاص لقطتك، فتظهر خلفية زائدة على الجانب الأقصر.",
        "الميل دوران مسطّح للقطة وليس تأثير منظور ثلاثي الأبعاد.",
      ],
      faq: [
        {
          q: "هل تُرفع لقطتي إلى الإنترنت؟",
          a: "لا. تُحمَّل الصورة في متصفحك وتُرسم على canvas هناك. ملف PNG الذي تنزّله يُنشأ على جهازك، ولا يُرسل شيء إلى خادم.",
        },
        {
          q: "ما أنواع الصور التي يمكن رفعها؟",
          a: "PNG وJPG وJPEG وWebP وGIF حتى 15 ميغابايت. وتُصدَّر النتيجة بصيغة PNG.",
        },
        {
          q: "هل أستخدم خلفية من اختياري؟",
          a: "نعم. حوّل الخلفية إلى صورة وارفع صورتك، فتُكبَّر لتغطي الـ canvas. ويمكنك أيضًا اختيار لون موحّد أو أحد الأنماط السبعة الجاهزة من التدرجات والتدرج الشبكي.",
        },
        {
          q: "ما المقاسات التي أستطيع إنشاءها لمواقع التواصل؟",
          a: "اختر نسبة بطاقة تويتر/X (‎1200×675‎) أو Open Graph (‎1200×630‎) أو 16:9 أو 1:1 أو 4:3 أو 9:16. هذه تحدد شكل الـ canvas، أما المقاس الدقيق بالبكسل فيبقى معتمدًا على حجم لقطتك مضافًا إليه الهامش.",
        },
        {
          q: "هل أضع نافذة متصفح حول اللقطة؟",
          a: "نعم. فعّل إطار النافذة لشريط عنوان بثلاث نقاط، أو شريط المتصفح لشريط عنوان فيه مربع URL. ولا يمكن تعديل نص مربع العنوان.",
        },
      ],
      steps: [
        "ارفع لقطة شاشة بإسقاطها على الصفحة أو بالنقر لاختيارها.",
        "اختر الخلفية: نمطًا جاهزًا أو لونًا موحّدًا أو صورتك.",
        "اضبط الهامش ونصف قطر الزوايا والظل والإطار ونسبة العرض وأنت تراقب المعاينة.",
        "اضغط «تنزيل» لحفظ ملف PNG النهائي.",
      ],
    },
  },

  "css-gradient": {
    related: ["clip-path-generator", "css-shadow", "color-palette", "color-converter", "screenshot-beautifier"],
    en: {
      intro:
        "Build a CSS gradient visually and copy the code. Choose Linear, Radial or Conic, set the colors and where each one sits, and a live preview shows the result. The output box gives you a ready-to-paste declaration such as background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); with a copy button.\n\nLinear gradients take an angle from 0 to 360 degrees, with eight arrow buttons for the common directions. Radial gradients let you pick a circle or ellipse and a position (center, the sides or the corners), and conic gradients take a start angle and a position. Each color stop has its own color picker, a position slider from 0 to 100% and an opacity slider; when opacity is below 100% the code switches that color to rgba(). You can add more stops or delete them, down to a minimum of two. Twelve named presets, such as Ocean Breeze, Aurora, Lava and Rainbow, load a starting point.",
      whyClientSide:
        "There is nothing sensitive in a gradient, and the privacy stake here is small. The preview, the CSS and the PNG export are all produced in your browser, so it responds instantly and works without an account or a request to a server.",
      limitations: [
        "The CSS output is a single background declaration in the standard syntax. It does not add vendor prefixes, a fallback solid color or the repeating-gradient functions.",
        "The PNG export is always a 1200×600 image, and it is a simplified drawing. A radial export is always a centered circle and ignores the shape and position you chose, and a conic export is always centered, so those exports can differ from the preview. Copy the CSS if you need the exact result.",
        "Loading a preset replaces the type, the angle and the stops, but a radial or conic preset keeps the shape, position and start angle you had set before.",
        "Color stops are set with a color picker in hex. You cannot type a color name, an hsl() value or a CSS variable into a stop.",
      ],
      faq: [
        {
          q: "How do I make a CSS gradient?",
          a: "Pick Linear, Radial or Conic, adjust the colors and positions of the stops, and watch the preview. Then copy the generated background declaration from the output box and paste it into your stylesheet.",
        },
        {
          q: "How do I make a gradient with transparency?",
          a: "Lower the opacity slider on a color stop. Any stop below 100% is written in the code as rgba() with that opacity, so the gradient fades into whatever is behind it.",
        },
        {
          q: "How many colors can a gradient have?",
          a: "As many as you add, with a minimum of two. Use Add stop for more, and the trash button on a stop to remove it.",
        },
        {
          q: "What is a conic gradient?",
          a: "A gradient whose colors sweep around a center point like a color wheel or pie chart, instead of running along a line. Here you can set the start angle and the center position.",
        },
        {
          q: "Why does the PNG look different from the preview?",
          a: "The export is a simplified 1200×600 drawing. For radial and conic gradients it always uses the center, so a different shape or position does not carry over. The CSS code is the accurate result.",
        },
      ],
      steps: [
        "Choose Linear, Radial or Conic, or load one of the presets.",
        "Set the angle or position, then edit each color stop's color, position and opacity.",
        "Add or remove stops until the preview looks right.",
        "Copy the CSS, or export a 1200×600 PNG.",
      ],
    },
    ar: {
      intro:
        "ابنِ تدرّج CSS بصريًا وانسخ الكود. اختر خطيًا أو دائريًا أو مخروطيًا، وحدد الألوان ومكان كل لون، وتعرض المعاينة الحيّة النتيجة. يعطيك صندوق الإخراج تعريفًا جاهزًا للصق مثل background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); مع زر نسخ.\n\nيأخذ التدرج الخطي زاوية من 0 إلى 360 درجة مع ثمانية أزرار بأسهم للاتجاهات الشائعة. ويتيح الدائري اختيار دائرة أو قطع ناقص وموضع المركز (الوسط أو أحد الجوانب أو الزوايا)، ويأخذ المخروطي زاوية بداية وموضعًا. لكل نقطة لونية أداة اختيار لون خاصة بها ومنزلق للموضع من 0 إلى 100% ومنزلق للشفافية، وعندما تقل الشفافية عن 100% يكتب الكود ذلك اللون بصيغة rgba(). يمكنك إضافة نقاط أو حذفها بحد أدنى نقطتان. وتحمّل اثنتا عشرة تهيئة جاهزة بأسماء مثل Ocean Breeze وAurora وLava وRainbow نقطة انطلاق.",
      whyClientSide:
        "لا شيء حساسًا في التدرج اللوني، فالأثر على الخصوصية هنا صغير. المعاينة وكود CSS وتصدير PNG كلها تُنتَج في متصفحك، فتستجيب فورًا ودون حساب أو طلب إلى خادم.",
      limitations: [
        "ناتج CSS تعريف background واحد بالصيغة القياسية. لا تُضاف بادئات المتصفحات ولا لون موحّد احتياطي ولا دوال التدرج المتكرر.",
        "تصدير PNG دائمًا صورة 1200×600 وهو رسم مبسّط. التصدير الدائري دائمًا دائرة في الوسط ويتجاهل الشكل والموضع اللذين اخترتهما، والمخروطي دائمًا في الوسط، لذلك قد يختلفان عن المعاينة. انسخ كود CSS إن أردت النتيجة الدقيقة.",
        "تحميل تهيئة جاهزة يستبدل النوع والزاوية والنقاط، لكن التهيئة الدائرية أو المخروطية تُبقي الشكل والموضع وزاوية البداية التي ضبطتها من قبل.",
        "تُضبط ألوان النقاط بأداة اختيار اللون بصيغة hex. ولا يمكنك كتابة اسم لون أو قيمة hsl() أو متغيّر CSS في نقطة.",
      ],
      faq: [
        {
          q: "كيف أصنع تدرجًا لونيًا بـ CSS؟",
          a: "اختر خطيًا أو دائريًا أو مخروطيًا، وعدّل ألوان النقاط ومواضعها وراقب المعاينة. ثم انسخ تعريف background من صندوق الإخراج والصقه في ملف الأنماط.",
        },
        {
          q: "كيف أصنع تدرجًا شفافًا؟",
          a: "قلّل منزلق الشفافية في نقطة لونية. كل نقطة دون 100% تُكتب في الكود بصيغة rgba() بتلك الشفافية، فيتلاشى التدرج في ما خلفه.",
        },
        {
          q: "كم لونًا يمكن أن يضم التدرج؟",
          a: "بعدد ما تضيفه، وبحد أدنى لونان. استخدم «إضافة نقطة» للمزيد، وزر سلة المحذوفات في النقطة لإزالتها.",
        },
        {
          q: "ما التدرج المخروطي؟",
          a: "تدرج تدور ألوانه حول نقطة مركزية مثل عجلة الألوان أو المخطط الدائري، بدل أن تمتد على خط. يمكنك هنا ضبط زاوية البداية وموضع المركز.",
        },
        {
          q: "لماذا تبدو صورة PNG مختلفة عن المعاينة؟",
          a: "التصدير رسم مبسّط بحجم 1200×600. في التدرجين الدائري والمخروطي يُستخدم الوسط دائمًا، فلا ينتقل شكل أو موضع مختلف إلى الصورة. كود CSS هو النتيجة الدقيقة.",
        },
      ],
      steps: [
        "اختر خطيًا أو دائريًا أو مخروطيًا، أو حمّل إحدى التهيئات الجاهزة.",
        "اضبط الزاوية أو الموضع، ثم عدّل لون كل نقطة وموضعها وشفافيتها.",
        "أضف نقاطًا أو احذفها حتى تظهر المعاينة كما تريد.",
        "انسخ كود CSS، أو صدّر صورة PNG بحجم 1200×600.",
      ],
    },
  },

  "speech-to-text": {
    related: ["audio-transcriber", "text-to-speech", "mic-test", "subtitle-studio", "image-to-text"],
    en: {
      intro:
        "This tool turns your voice into text as you speak. Choose a language, press Start dictation and talk; the words appear in the transcript box, with interim guesses shown live while the browser is still working out a phrase. When you stop, you can edit the transcript by hand, copy it, or download it as transcript.txt.\n\nIt is a front end for the Web Speech API built into your browser, and it does not do the recognition itself. There are 14 language options: English (US and UK), Arabic, Spanish, French, German, Italian, Portuguese (Brazil), Russian, Hindi, Japanese, Korean, Chinese (Simplified) and Turkish. Continuous mode keeps listening and restarts the recognizer when the browser stops it, and you can switch off the live interim results. It listens to your microphone only; it does not transcribe an audio or video file.",
      whyClientSide:
        "This tool is not on-device, and your voice goes off your device while you dictate, so know that before you say anything private. The recognition is done by your browser's Web Speech API, and in Chrome and Edge that means your microphone audio is sent to the browser vendor's servers (Google for Chrome, Microsoft for Edge) to be turned into text. The page itself does not record or store your audio, and the transcript is only held in the page until you close it, but the audio does leave your device while you speak, under your browser vendor's privacy terms. If your audio is confidential, use the Audio Transcriber tool instead: it runs a Whisper model on your own device, and the file you give it is not uploaded.",
      limitations: [
        "It needs a browser that supports speech recognition, in practice Chrome or Edge. Firefox support is limited, and where it is missing the page shows a notice and the Start button is disabled.",
        "Recognition needs an internet connection in Chrome and Edge because the work is done on the vendor's servers. It does not work offline there.",
        "Accuracy, supported accents, and any punctuation depend entirely on the browser's service. The tool does not add punctuation or capital letters itself, and it cannot be trained on names or jargon.",
        "It only listens to a live microphone. You cannot give it a recording, and the transcript has no timestamps or speaker labels. For files, use the Audio Transcriber.",
        "Keep the tab open and in focus with microphone permission allowed. If you deny the permission or the browser reports no speech, the tool shows an error and you have to start again.",
      ],
      faq: [
        {
          q: "Is my voice sent to a server?",
          a: "In Chrome and Edge, yes. The browser's Web Speech API streams your microphone audio to the browser vendor's speech service to get the text back. This site does not record or store the audio, but it does leave your device. For private audio, use Audio Transcriber, which runs on-device.",
        },
        {
          q: "Does it work offline?",
          a: "Not in Chrome or Edge. Their speech recognition needs an internet connection because it runs on the vendor's servers.",
        },
        {
          q: "Which languages can I dictate in?",
          a: "14 options: English (US and UK), Arabic, Spanish, French, German, Italian, Portuguese (Brazil), Russian, Hindi, Japanese, Korean, Chinese (Simplified) and Turkish. Pick the language before you start, since it cannot be changed while listening.",
        },
        {
          q: "Can I transcribe a recording or a video file?",
          a: "Not with this tool, which only listens to your microphone. Use Audio Transcriber to turn an audio or video file into text with timestamps, on your device.",
        },
        {
          q: "What do Continuous and interim results do?",
          a: "Continuous keeps listening through pauses and restarts the recognizer when the browser ends a session. Show interim results displays the browser's live guess for the phrase you are saying before it is finalized. Both can be changed only when you are not listening.",
        },
        {
          q: "How do I save the text?",
          a: "Use Copy to put it on the clipboard or Download .txt to save transcript.txt. You can also click into the box and edit or type the text yourself before saving.",
        },
      ],
      steps: [
        "Open the page in Chrome or Edge and choose your language.",
        "Press Start dictation and allow microphone access when asked.",
        "Speak clearly. Watch the transcript fill in, then press Stop.",
        "Edit the text if needed, then copy it or download it as a .txt file.",
      ],
    },
    ar: {
      intro:
        "تحوّل هذه الأداة صوتك إلى نص وأنت تتكلم. اختر اللغة، واضغط «بدء الإملاء» وتحدّث، فتظهر الكلمات في صندوق النص، مع تخمينات مؤقتة حيّة بينما ما زال المتصفح يحدد العبارة. وعندما تتوقف يمكنك تعديل النص يدويًا أو نسخه أو تنزيله بصيغة transcript.txt.\n\nهي واجهة لخاصية Web Speech API المدمجة في متصفحك، ولا تقوم هي نفسها بالتعرّف على الكلام. تتوفر 14 لغة: الإنجليزية (الأمريكية والبريطانية) والعربية والإسبانية والفرنسية والألمانية والإيطالية والبرتغالية (البرازيل) والروسية والهندية واليابانية والكورية والصينية (المبسطة) والتركية. يواصل وضع الاستمرار الإصغاء ويعيد تشغيل المُتعرِّف عندما يوقفه المتصفح، ويمكنك إيقاف النتائج المؤقتة الحيّة. تصغي الأداة إلى الميكروفون فقط ولا تفرّغ ملف صوت أو فيديو.",
      whyClientSide:
        "هذه الأداة لا تعمل على جهازك، ومن الواجب أن تعرف ذلك قبل أن تملي أي شيء خاص. التعرّف على الكلام يقوم به Web Speech API في متصفحك، وفي Chrome وEdge يعني ذلك أن صوت الميكروفون يُرسل إلى خوادم الجهة المطوّرة للمتصفح (غوغل في Chrome ومايكروسوفت في Edge) ليتحول إلى نص. الصفحة نفسها لا تسجّل صوتك ولا تخزّنه، والنص يبقى في الصفحة إلى أن تغلقها، لكن الصوت يغادر جهازك أثناء كلامك وفق شروط الخصوصية لمطوّر متصفحك. إذا كان صوتك سريًّا فاستخدم أداة تفريغ الصوت (Audio Transcriber) بدلًا منها: تشغّل نموذج Whisper على جهازك ولا يُرفع الملف الذي تعطيه إياها.",
      limitations: [
        "تحتاج متصفحًا يدعم التعرّف على الكلام، وعمليًا Chrome أو Edge. الدعم في Firefox محدود، وحيث لا يتوفر تعرض الصفحة تنبيهًا ويُعطَّل زر البدء.",
        "يحتاج التعرّف في Chrome وEdge إلى اتصال بالإنترنت لأن العمل يتم على خوادم الجهة المطوّرة. ولا يعمل دون اتصال هناك.",
        "الدقة واللهجات المدعومة وأي علامات ترقيم تعتمد كليًا على خدمة المتصفح. لا تضيف الأداة ترقيمًا ولا أحرفًا كبيرة بنفسها، ولا يمكن تدريبها على الأسماء أو المصطلحات.",
        "تصغي إلى ميكروفون مباشر فقط، فلا يمكنك إعطاؤها تسجيلًا، وليس في النص طوابع زمنية ولا تمييز للمتحدثين. للملفات استخدم Audio Transcriber.",
        "أبقِ التبويب مفتوحًا وفي المقدمة مع السماح بإذن الميكروفون. إن رفضت الإذن أو أبلغ المتصفح عن عدم سماع كلام تعرض الأداة خطأ وعليك البدء من جديد.",
      ],
      faq: [
        {
          q: "هل يُرسل صوتي إلى خادم؟",
          a: "في Chrome وEdge نعم. يبثّ Web Speech API في المتصفح صوت الميكروفون إلى خدمة الكلام لدى مطوّر المتصفح ليعيد النص. هذا الموقع لا يسجّل الصوت ولا يخزّنه، لكنه يغادر جهازك. للصوت الخاص استخدم Audio Transcriber الذي يعمل على جهازك.",
        },
        {
          q: "هل تعمل دون اتصال بالإنترنت؟",
          a: "ليس في Chrome أو Edge. يحتاج التعرّف على الكلام فيهما إلى اتصال لأنه يعمل على خوادم الجهة المطوّرة.",
        },
        {
          q: "بأي لغات أستطيع الإملاء؟",
          a: "14 خيارًا: الإنجليزية (الأمريكية والبريطانية) والعربية والإسبانية والفرنسية والألمانية والإيطالية والبرتغالية (البرازيل) والروسية والهندية واليابانية والكورية والصينية (المبسطة) والتركية. اختر اللغة قبل البدء لأنها لا تتغير أثناء الإصغاء.",
        },
        {
          q: "هل أحوّل تسجيلًا أو ملف فيديو إلى نص؟",
          a: "ليس بهذه الأداة، فهي تصغي إلى الميكروفون فقط. استخدم Audio Transcriber لتحويل ملف صوت أو فيديو إلى نص بطوابع زمنية على جهازك.",
        },
        {
          q: "ماذا يفعل «الاستمرار» و«النتائج المؤقتة»؟",
          a: "الاستمرار يواصل الإصغاء عبر فترات الصمت ويعيد تشغيل المُتعرِّف عندما ينهي المتصفح الجلسة. وعرض النتائج المؤقتة يُظهر تخمين المتصفح الحيّ للعبارة التي تقولها قبل اعتمادها. ولا يمكن تغيير الخيارين إلا حين لا تكون الأداة تصغي.",
        },
        {
          q: "كيف أحفظ النص؟",
          a: "استخدم «نسخ» لوضعه في الحافظة أو «تنزيل ‎.txt‎» لحفظ transcript.txt. ويمكنك أيضًا النقر في الصندوق وتعديل النص أو كتابته بنفسك قبل الحفظ.",
        },
      ],
      steps: [
        "افتح الصفحة في Chrome أو Edge واختر لغتك.",
        "اضغط «بدء الإملاء» واسمح بالوصول إلى الميكروفون عند الطلب.",
        "تحدّث بوضوح وراقب النص وهو يمتلئ، ثم اضغط «إيقاف».",
        "عدّل النص إن لزم، ثم انسخه أو نزّله كملف txt.",
      ],
    },
  },

  "barcode-generator": {
    related: ["qr-generator", "qr-scanner", "image-converter", "image-resizer"],
    en: {
      intro:
        "This tool turns a number or short text into a barcode image. Choose a barcode type, type the data to encode, and the barcode is drawn straight away on a white background. Download it as a PNG with a file name you set, or copy the image to the clipboard.\n\nIt supports ten formats through the JsBarcode library: CODE128, CODE39, EAN-13, EAN-8, UPC-A, ITF-14, MSI, Pharmacode, Codabar and CODE93. You can adjust bar width (1 to 5), bar height (50 to 200 px), margin (0 to 30 px) and the size of the text printed under the bars (10 to 30 px), or hide that text. The bars are always black on white. Sample buttons fill in example data for CODE128, EAN-13, UPC-A and CODE39.",
      whyClientSide:
        "The barcode is drawn on a canvas in your browser by a library bundled with the site, so the number you encode is never sent to a server. That is useful for internal inventory codes or serial numbers you do not want to type into a third-party generator.",
      limitations: [
        "Each format only accepts certain characters, and the tool does not validate as you type. If the data does not fit the format (letters in EAN-13, the wrong length, a bad check digit) you get an error message and the barcode on screen is not updated.",
        "For EAN-13, EAN-8 and ITF-14 you should enter one digit fewer than the full length (12, 7 or 13 digits) and the check digit is added for you. If you enter the full length, the last digit must already be the correct check digit. The EAN-13 and EAN-8 sample buttons fill in numbers whose check digit is wrong, so they produce an error instead of a barcode; edit the last digit or delete it.",
        "A barcode that looks right on screen is not a registered product code. Retail EAN and UPC numbers come from GS1 prefixes issued to your company, and this tool cannot create or check those.",
        "The output is a PNG only, with no SVG or PDF export, and the colors cannot be changed. For print, make the barcode large and test it with a scanner before you rely on it.",
        "Characters outside the format's set, such as accented letters in CODE128, are not accepted.",
      ],
      faq: [
        {
          q: "How do I make a barcode online?",
          a: "Pick a barcode type, type the number or text to encode, and the barcode appears immediately. Use Download PNG to save it, or Copy to put the image on your clipboard.",
        },
        {
          q: "Which barcode type should I use?",
          a: "CODE128 is the most common general-purpose choice and handles letters and digits. EAN-13, EAN-8 and UPC-A are for retail products, ITF-14 is for shipping cartons, CODE39 is a simple alphanumeric format, and the others suit niche uses such as Pharmacode for pharmaceutical packaging and Codabar for libraries.",
        },
        {
          q: "Why do I get an error for my EAN-13 number?",
          a: "EAN-13 takes only digits. Enter 12 digits and the check digit is calculated for you, or enter 13 digits where the last one is the correct check digit. A 13-digit number with a wrong check digit is rejected, including the sample number the EAN-13 button fills in.",
        },
        {
          q: "Can I use it to create real product barcodes?",
          a: "It draws the barcode image only. For products sold in shops you need EAN or UPC numbers issued through GS1 for your company, and the tool cannot provide or verify them.",
        },
        {
          q: "Can I change the colors or export an SVG?",
          a: "No. The bars are black on a white background and the download is a PNG. You can change bar width, height, margin and the size of the text under the bars, or hide that text.",
        },
        {
          q: "Does the barcode scan?",
          a: "A correctly encoded barcode with enough contrast and size scans with ordinary scanners and phone apps. Check each barcode with the scanner you will use, especially after making it small.",
        },
      ],
      steps: [
        "Choose the barcode type.",
        "Type the number or text to encode, or press a sample button.",
        "Adjust bar width, height, margin and the printed text if needed.",
        "Download the PNG or copy the image to the clipboard.",
      ],
    },
    ar: {
      intro:
        "تحوّل هذه الأداة رقمًا أو نصًّا قصيرًا إلى صورة باركود. اختر نوع الباركود واكتب البيانات المراد ترميزها، فيُرسم الباركود فورًا على خلفية بيضاء. نزّله بصيغة PNG باسم ملف تحدده، أو انسخ الصورة إلى الحافظة.\n\nتدعم الأداة عشر صيغ عبر مكتبة JsBarcode هي: CODE128 وCODE39 وEAN-13 وEAN-8 وUPC-A وITF-14 وMSI وPharmacode وCodabar وCODE93. يمكنك ضبط عرض الخطوط (من 1 إلى 5) وارتفاعها (من 50 إلى 200 بكسل) والهامش (من 0 إلى 30 بكسل) وحجم النص المطبوع تحت الخطوط (من 10 إلى 30 بكسل) أو إخفاء هذا النص. الخطوط سوداء على أبيض دائمًا. وتملأ أزرار الأمثلة بيانات تجريبية لـ CODE128 وEAN-13 وUPC-A وCODE39.",
      whyClientSide:
        "يُرسم الباركود على canvas في متصفحك بمكتبة مرفقة مع الموقع، فلا يُرسل الرقم الذي ترمّزه إلى أي خادم. هذا مفيد لرموز المخزون الداخلية أو الأرقام التسلسلية التي لا تريد كتابتها في مولّد من طرف ثالث.",
      limitations: [
        "كل صيغة تقبل محارف معينة فقط، والأداة لا تتحقق من البيانات أثناء الكتابة. إذا لم تناسب البيانات الصيغة (حروف في EAN-13 أو طول خاطئ أو رقم تحقق غير صحيح) تظهر رسالة خطأ ولا يتحدث الباركود المعروض.",
        "في EAN-13 وEAN-8 وITF-14 أدخل رقمًا أقل من الطول الكامل (12 أو 7 أو 13 رقمًا) فيُضاف رقم التحقق تلقائيًا. وإن أدخلت الطول الكامل فيجب أن يكون الرقم الأخير هو رقم التحقق الصحيح. زرا المثال لـ EAN-13 وEAN-8 يملآن أرقامًا رقم التحقق فيها خاطئ، فيعطيان خطأ بدل باركود؛ عدّل الرقم الأخير أو احذفه.",
        "الباركود الذي يبدو سليمًا على الشاشة ليس رمز منتج مسجّلًا. أرقام EAN وUPC للتجزئة تأتي من بادئات GS1 تصدر لشركتك، ولا تستطيع هذه الأداة إنشاءها أو التحقق منها.",
        "الناتج PNG فقط دون تصدير SVG أو PDF، ولا يمكن تغيير الألوان. للطباعة اجعل الباركود كبيرًا واختبره بقارئ قبل الاعتماد عليه.",
        "المحارف الخارجة عن مجموعة الصيغة، مثل الحروف المشكّلة في CODE128، غير مقبولة.",
      ],
      faq: [
        {
          q: "كيف أصنع باركود أونلاين؟",
          a: "اختر نوع الباركود واكتب الرقم أو النص المراد ترميزه، فيظهر الباركود فورًا. استخدم «تنزيل PNG» لحفظه أو «نسخ» لوضع الصورة في الحافظة.",
        },
        {
          q: "أي نوع باركود أستخدم؟",
          a: "CODE128 هو الخيار العام الأكثر شيوعًا ويدعم الحروف والأرقام. وEAN-13 وEAN-8 وUPC-A لمنتجات التجزئة، وITF-14 لكراتين الشحن، وCODE39 صيغة أبجدية رقمية بسيطة، والبقية لاستخدامات متخصصة مثل Pharmacode لتغليف الأدوية وCodabar للمكتبات.",
        },
        {
          q: "لماذا يظهر خطأ مع رقم EAN-13 الذي أدخلته؟",
          a: "يقبل EAN-13 أرقامًا فقط. أدخل 12 رقمًا فيُحسب رقم التحقق لك، أو 13 رقمًا يكون الأخير فيها رقم التحقق الصحيح. الرقم المكوّن من 13 خانة برقم تحقق خاطئ يُرفض، ومنه الرقم المثال الذي يملؤه زر EAN-13.",
        },
        {
          q: "هل أصنع به باركودات منتجات حقيقية؟",
          a: "ترسم الأداة صورة الباركود فقط. للمنتجات المباعة في المتاجر تحتاج أرقام EAN أو UPC صادرة عبر GS1 لشركتك، ولا تستطيع الأداة توفيرها أو التحقق منها.",
        },
        {
          q: "هل أغيّر الألوان أو أصدّر SVG؟",
          a: "لا. الخطوط سوداء على خلفية بيضاء والتنزيل PNG. يمكنك تغيير عرض الخطوط وارتفاعها والهامش وحجم النص تحتها، أو إخفاء هذا النص.",
        },
        {
          q: "هل يُمسح الباركود بالقارئ؟",
          a: "الباركود المرمَّز بشكل صحيح مع تباين وحجم كافيين يُقرأ بالقارئات العادية وتطبيقات الهاتف. جرّب كل باركود بالقارئ الذي ستستخدمه، خاصة بعد تصغيره.",
        },
      ],
      steps: [
        "اختر نوع الباركود.",
        "اكتب الرقم أو النص المراد ترميزه، أو اضغط أحد أزرار الأمثلة.",
        "اضبط عرض الخطوط وارتفاعها والهامش والنص المطبوع عند الحاجة.",
        "نزّل ملف PNG أو انسخ الصورة إلى الحافظة.",
      ],
    },
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Tool data profiles.
//
// The fallback used to assert "runs entirely in your browser, your data is never
// uploaded" on EVERY tool page. That is false for the tools that fetch model or
// language files from a third-party CDN, and flatly wrong for the ones where a
// browser API ships the user's own content off the device. A privacy claim that
// isn't true is worse than no claim at all, so the fallback now branches on what
// the tool actually does.
//
// This map is enforced by src/__tests__/lib/tool-data-profile.test.ts, which
// walks each tool page's local import graph and cross-checks the classification
// against the code. Adding an AI tool that uses an existing loader, or any
// absolute-URL fetch, fails that test until this map is updated — so this is not
// a hand-maintained list that silently rots.
// ──────────────────────────────────────────────────────────────────────────────

export type ToolDataProfile =
  /** Default. User content is processed locally; no runtime network requests. */
  | "on-device"
  /**
   * User content is still processed locally, but model / language / voice files
   * are fetched from a third-party CDN on first use and cached by the browser.
   * "Works fully offline" is false for these until those files are cached.
   */
  | "model-download"
  /**
   * Calls a third-party API for reference data (rates, lookups). What the user
   * types stays on the device, but the tool needs a connection to function.
   */
  | "remote-data"
  /**
   * Part of the user's own content leaves the device to be processed — e.g. the
   * Web Speech API, which in Chrome and Edge streams recorded audio to the
   * browser vendor's servers. The on-device claim must NOT be made here.
   */
  | "remote-processing"
  /**
   * Takes no user content at all (timers, hardware testers, reference tables).
   * The privacy paragraph is irrelevant rather than wrong, so it is omitted.
   */
  | "no-user-data";

/**
 * Slugs whose profile is anything other than the "on-device" default.
 *
 * Everything except `no-user-data` is mechanically verifiable from the import
 * graph and is asserted by the test. `no-user-data` is a judgement call the test
 * cannot make — but misclassifying there only omits an accurate paragraph, it
 * never produces a false claim, so it is the one category left to review.
 */
export const TOOL_DATA_PROFILES: Record<string, ToolDataProfile> = {
  // ── Model / language files fetched from a third-party CDN on first use ──────
  // Transformers.js via @/lib/hf-pipeline (Hugging Face Hub CDN).
  "audio-transcriber": "model-download",
  "depth-map": "model-download",
  "image-captioner": "model-download",
  "image-upscaler": "model-download",
  "object-cutout": "model-download",
  "pii-redactor": "model-download",
  "sentiment-analyzer": "model-download",
  "subtitle-studio": "model-download",
  "text-summarizer": "model-download",
  translator: "model-download",
  "zero-shot-classifier": "model-download",
  // @imgly/background-removal (staticimgly.com).
  "bg-removal": "model-download",
  // @diffusionstudio/vits-web — Piper voice models (~20-60MB) from a CDN.
  "text-to-speech": "model-download",
  // tesseract.js: worker + wasm core are self-hosted from /public/tesseract,
  // but the language traineddata still loads once from the tessdata CDN.
  "image-to-text": "model-download",

  // ── Third-party API for reference data ─────────────────────────────────────
  // api.frankfurter.app, falling back to api.exchangerate-api.com.
  "currency-converter": "remote-data",

  // ── User content leaves the device ─────────────────────────────────────────
  // Web Speech API (SpeechRecognition / webkitSpeechRecognition). Chrome and
  // Edge implement this server-side: the recorded audio is sent to the browser
  // vendor for transcription. Nothing we can do about that except say so.
  "speech-to-text": "remote-processing",

  // ── No user content at all ─────────────────────────────────────────────────
  // Verified as holding nothing and persisting nothing. Note that pomodoro and
  // emoji-picker DO persist to localStorage, and mic-test / webcam-test handle a
  // live camera or microphone stream, so none of those belong here.
  stopwatch: "no-user-data",
  timer: "no-user-data",
  "world-clock": "no-user-data",
  "keyboard-tester": "no-user-data",
  "gamepad-tester": "no-user-data",
  "periodic-table": "no-user-data",
  "http-status": "no-user-data",
  "typing-test": "no-user-data",
};

export function getToolDataProfile(slug: string): ToolDataProfile {
  return TOOL_DATA_PROFILES[slug] ?? "on-device";
}

// ──────────────────────────────────────────────────────────────────────────────
// Templated fallback. For tools without a bespoke entry we derive accurate,
// non-fabricated copy from the tool's name, description, and category. No fake
// specifics, no invented stats — just a clear, indexable About whose privacy
// claim matches what the tool actually does.
//
// The FAQ is deliberately sparse. For "on-device" and "no-user-data" tools the
// only questions a template can ask are ones nobody asked, so none are emitted.
// The three network-touching profiles get a single question that carries a real,
// non-obvious fact ("does this work offline?"), which is worth a reader's time.
//
// Fallback content never feeds FAQPage JSON-LD — see ToolSeoContent. A templated
// Q&A is not evidence that anyone frequently asks it about that specific tool.
//
// Unlike the bespoke registry above (still en/ar), the fallback speaks every
// locale in the registry, so a `/{locale}/tools/…` page never renders an empty
// SEO section or — worse — English prose under a non-English URL.
// ──────────────────────────────────────────────────────────────────────────────

export interface FallbackInput {
  name: string;
  description: string;
  category: string;
  /** Drives which privacy claim (if any) the fallback is allowed to make. */
  dataProfile?: ToolDataProfile;
}

/**
 * One locale's worth of templated copy.
 *
 * Every string is hand-written in the target language rather than translated
 * word-for-word from the English: the privacy claims below are factual claims,
 * and a calque that blurs "your content stays here" into "nothing touches the
 * network" would make them false.
 */
interface FallbackCopy {
  intro: Record<ToolDataProfile, (name: string, category: string) => string>;
  /**
   * Only the three network-touching profiles get a question. For "on-device"
   * and "no-user-data" the only questions a template can ask are ones nobody
   * asked, so none are emitted.
   */
  faq: Partial<Record<ToolDataProfile, (name: string) => FaqItem[]>>;
}

/**
 * Simplified-Chinese typography leaves a gap between Latin and Han characters
 * but none between two Han characters. Tool names are mixed ("Cron 解析器",
 * "TOTP"), so the gap has to be decided per name rather than baked into the
 * template: a hard-coded space renders "Cron 解析器 是…", which reads wrong.
 */
const zhLead = (name: string): string =>
  /[\u3400-\u9fff\uf900-\ufaff]$/.test(name) ? name : `${name} `;

/**
 * Templated copy per locale, keyed by the codes in ./locales.
 *
 * `satisfies Partial<Record<Locale, FallbackCopy>>` is what ties this table to
 * the locale registry: an unregistered or misspelled code is a compile error,
 * and `FallbackProseLocale` below is *derived* from these keys instead of being
 * a hand-maintained union that has to be edited every time a language ships.
 * Adding a language is therefore: add it to LOCALES, add a block here. If you
 * add it to LOCALES only, src/__tests__/lib/tool-data-profile.test.ts fails
 * rather than the page silently rendering an empty SEO section.
 */
const FALLBACK_COPY = {
  en: {
    intro: {
      "on-device": (name, category) =>
        `${name} is a free tool in the ${category} category on BrowseryTools. It runs entirely in your browser: what you give it is processed on your own device and is never uploaded to a server, there's no registration, no ads and no watermarks, and it keeps working with no connection once the page has loaded.`,
      "model-download": (name, category) =>
        `${name} is a free tool in the ${category} category on BrowseryTools, and it runs its model on your own device — what you feed it is processed locally and is never uploaded to a server. It isn't fully self-contained, though: the model files it needs are downloaded from a third-party CDN the first time you use it, then cached by your browser. So the first run needs an internet connection and takes noticeably longer than later ones, and the tool only works offline once those files are cached. There's no registration, no ads and no watermarks.`,
      "remote-data": (name, category) =>
        `${name} is a free tool in the ${category} category on BrowseryTools. Unlike most tools here it isn't fully self-contained: it requests data from a third-party service in order to work, so it needs an internet connection and that service sees the request. Everything else — the calculation and the result — happens in your browser on your own device. There's no registration, no ads and no watermarks.`,
      "remote-processing": (name, category) =>
        `${name} is a free tool in the ${category} category on BrowseryTools, and it's the exception to how the rest of this site works: part of its processing happens off your device. What you give it is sent to a third-party service to be handled, so it needs an internet connection and you shouldn't use it for anything confidential. BrowseryTools itself stores nothing, and there's no registration, no ads and no watermarks.`,
      "no-user-data": (name, category) =>
        `${name} is a free tool in the ${category} category on BrowseryTools. It runs in your browser with no installation and no registration, and no ads or watermarks. It doesn't ask you for any content, so there's nothing here to upload or store in the first place.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `Does ${name} work offline?`,
          a: "Only after the first use. The model files are downloaded from a third-party CDN the first time you run it and cached by your browser; after that everything happens on your device. Your own content is never uploaded at any point.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `Does ${name} work offline?`,
          a: "No. This tool has to fetch up-to-date data from an external service each time, so it needs a connection. What you type stays in your browser.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Is my data processed on my device?",
          a: "No. Unlike the rest of the tools on this site, this one sends what you give it to an external service to be processed. It needs an internet connection, and you shouldn't use it for confidential material.",
        },
      ],
    },
  },

  ar: {
    intro: {
      "on-device": (name, category) =>
        `${name} أداة مجانية ضمن فئة «${category}» على BrowseryTools. تعمل بالكامل داخل متصفحك: ما تعطيه لها يُعالَج على جهازك ولا يُرفع إلى أي خادم، ولا تسجيل ولا إعلانات ولا علامات مائية، وتبقى تعمل بلا اتصال بعد تحميل الصفحة.`,
      "model-download": (name, category) =>
        `${name} أداة مجانية ضمن فئة «${category}» على BrowseryTools، وتشغّل نموذجها على جهازك أنت — فما تعطيه لها يُعالَج محليًا ولا يُرفع إلى أي خادم. لكنها ليست مكتفية بذاتها تمامًا: تُنزَّل ملفات النموذج التي تحتاجها من شبكة توصيل محتوى تابعة لطرف ثالث عند أول استخدام، ثم يحفظها متصفحك. لذا يحتاج التشغيل الأول إلى اتصال بالإنترنت ويستغرق وقتًا أطول بوضوح من المرات التالية، ولا تعمل الأداة دون اتصال إلا بعد حفظ تلك الملفات. ولا تسجيل ولا إعلانات ولا علامات مائية.`,
      "remote-data": (name, category) =>
        `${name} أداة مجانية ضمن فئة «${category}» على BrowseryTools. وخلافًا لمعظم الأدوات هنا فهي ليست مكتفية بذاتها: تطلب بيانات من خدمة تابعة لطرف ثالث لتعمل، فتحتاج اتصالًا بالإنترنت وترى تلك الخدمة الطلب. أما كل ما عدا ذلك — الحساب والنتيجة — فيجري في متصفحك على جهازك. ولا تسجيل ولا إعلانات ولا علامات مائية.`,
      "remote-processing": (name, category) =>
        `${name} أداة مجانية ضمن فئة «${category}» على BrowseryTools، وهي الاستثناء من طريقة عمل بقية الموقع: جزء من المعالجة يجري خارج جهازك. فما تعطيه لها يُرسَل إلى خدمة تابعة لطرف ثالث لتتولّاه، أي أنها تحتاج اتصالًا بالإنترنت، ولا ينبغي أن تستخدمها لأي شيء سرّي. ولا يخزّن BrowseryTools شيئًا بنفسه، ولا تسجيل ولا إعلانات ولا علامات مائية.`,
      "no-user-data": (name, category) =>
        `${name} أداة مجانية ضمن فئة «${category}» على BrowseryTools. تعمل في متصفحك دون تثبيت ودون تسجيل، وبلا إعلانات أو علامات مائية. وهي لا تطلب منك أي محتوى، فلا يوجد هنا ما يمكن رفعه أو تخزينه أصلًا.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `هل تعمل ${name} دون اتصال بالإنترنت؟`,
          a: "بعد أول استخدام فقط. تُنزَّل ملفات النموذج من شبكة توصيل محتوى تابعة لطرف ثالث في المرة الأولى ثم يحفظها متصفحك؛ وبعد ذلك تجري المعالجة كلها على جهازك. أما محتواك أنت فلا يُرفع في أي مرحلة.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `هل تعمل ${name} دون اتصال بالإنترنت؟`,
          a: "لا. تحتاج هذه الأداة إلى جلب بيانات محدّثة من خدمة خارجية في كل مرة، فلا تعمل دون اتصال. أما ما تدخله أنت فيبقى في متصفحك.",
        },
      ],
      "remote-processing": () => [
        {
          q: "هل تُعالَج بياناتي على جهازي؟",
          a: "لا. هذه الأداة ترسل ما تعطيها إلى خدمة خارجية لتعالجه، بخلاف بقية أدوات الموقع. تحتاج اتصالًا بالإنترنت، ولا ينبغي استخدامها لمحتوى سرّي.",
        },
      ],
    },
  },

  es: {
    intro: {
      "on-device": (name, category) =>
        `${name} es una herramienta gratuita de la categoría ${category} en BrowseryTools. Funciona por completo en tu navegador: lo que le das se procesa en tu propio dispositivo y nunca se sube a un servidor, no hay registro, ni anuncios, ni marcas de agua, y sigue funcionando sin conexión una vez cargada la página.`,
      "model-download": (name, category) =>
        `${name} es una herramienta gratuita de la categoría ${category} en BrowseryTools, y ejecuta su modelo en tu propio dispositivo: lo que le das se procesa localmente y nunca se sube a un servidor. Aun así, no es del todo autónoma: los archivos del modelo que necesita se descargan de una CDN de terceros la primera vez que la usas y tu navegador los guarda en caché. Por eso la primera ejecución necesita conexión a internet y tarda bastante más que las siguientes, y la herramienta solo funciona sin conexión cuando esos archivos ya están en caché. No hay registro, ni anuncios, ni marcas de agua.`,
      "remote-data": (name, category) =>
        `${name} es una herramienta gratuita de la categoría ${category} en BrowseryTools. A diferencia de la mayoría de las herramientas de aquí, no es autónoma: para funcionar pide datos a un servicio de terceros, así que necesita conexión a internet y ese servicio ve la petición. Todo lo demás — el cálculo y el resultado — ocurre en tu navegador, en tu propio dispositivo. No hay registro, ni anuncios, ni marcas de agua.`,
      "remote-processing": (name, category) =>
        `${name} es una herramienta gratuita de la categoría ${category} en BrowseryTools, y es la excepción a cómo funciona el resto del sitio: parte del procesamiento ocurre fuera de tu dispositivo. Lo que le das se envía a un servicio de terceros para que lo procese, así que necesita conexión a internet y no deberías usarla para nada confidencial. BrowseryTools no almacena nada por su parte, y no hay registro, ni anuncios, ni marcas de agua.`,
      "no-user-data": (name, category) =>
        `${name} es una herramienta gratuita de la categoría ${category} en BrowseryTools. Funciona en tu navegador sin instalación y sin registro, y sin anuncios ni marcas de agua. No te pide ningún contenido, así que aquí no hay nada que subir ni que guardar.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `¿${name} funciona sin conexión?`,
          a: "Solo después del primer uso. Los archivos del modelo se descargan de una CDN de terceros la primera vez que la ejecutas y tu navegador los guarda en caché; a partir de ahí, todo ocurre en tu dispositivo. Tu contenido no se sube en ningún momento.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `¿${name} funciona sin conexión?`,
          a: "No. Esta herramienta tiene que consultar datos actualizados en un servicio externo cada vez, así que necesita conexión. Lo que escribes se queda en tu navegador.",
        },
      ],
      "remote-processing": () => [
        {
          q: "¿Mis datos se procesan en mi dispositivo?",
          a: "No. A diferencia del resto de herramientas de este sitio, esta envía lo que le das a un servicio externo para procesarlo. Necesita conexión a internet y no deberías usarla con material confidencial.",
        },
      ],
    },
  },

  "pt-BR": {
    intro: {
      "on-device": (name, category) =>
        `${name} é uma ferramenta gratuita da categoria ${category} no BrowseryTools. Ela funciona inteiramente no seu navegador: o que você fornece é processado no seu próprio dispositivo e nunca é enviado para um servidor, não há cadastro, anúncios nem marcas d'água, e ela continua funcionando sem conexão depois que a página carrega.`,
      "model-download": (name, category) =>
        `${name} é uma ferramenta gratuita da categoria ${category} no BrowseryTools e executa o modelo no seu próprio dispositivo: o que você entrega a ela é processado localmente e nunca é enviado para um servidor. Ainda assim, ela não é totalmente autossuficiente: os arquivos de modelo de que precisa são baixados de uma CDN de terceiros no primeiro uso e ficam em cache no seu navegador. Por isso a primeira execução exige conexão com a internet e demora bem mais que as seguintes, e a ferramenta só funciona offline depois que esses arquivos estão em cache. Não há cadastro, anúncios nem marcas d'água.`,
      "remote-data": (name, category) =>
        `${name} é uma ferramenta gratuita da categoria ${category} no BrowseryTools. Diferentemente da maioria das ferramentas daqui, ela não é autossuficiente: para funcionar, pede dados a um serviço de terceiros, ou seja, precisa de conexão com a internet e esse serviço vê a requisição. Todo o resto — o cálculo e o resultado — acontece no seu navegador, no seu próprio dispositivo. Não há cadastro, anúncios nem marcas d'água.`,
      "remote-processing": (name, category) =>
        `${name} é uma ferramenta gratuita da categoria ${category} no BrowseryTools e é a exceção ao funcionamento do restante do site: parte do processamento acontece fora do seu dispositivo. O que você fornece é enviado a um serviço de terceiros para ser processado, então ela precisa de conexão com a internet e você não deve usá-la para nada confidencial. O próprio BrowseryTools não armazena nada, e não há cadastro, anúncios nem marcas d'água.`,
      "no-user-data": (name, category) =>
        `${name} é uma ferramenta gratuita da categoria ${category} no BrowseryTools. Funciona no seu navegador sem instalação e sem cadastro, e sem anúncios ou marcas d'água. Ela não pede nenhum conteúdo a você, então aqui não há nada para enviar nem para guardar.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name} funciona offline?`,
          a: "Só depois do primeiro uso. Os arquivos de modelo são baixados de uma CDN de terceiros na primeira execução e ficam em cache no seu navegador; daí em diante, tudo acontece no seu dispositivo. O seu conteúdo não é enviado em momento algum.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name} funciona offline?`,
          a: "Não. Esta ferramenta precisa buscar dados atualizados em um serviço externo a cada uso, então a conexão é indispensável. O que você digita permanece no seu navegador.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Meus dados são processados no meu dispositivo?",
          a: "Não. Diferentemente das outras ferramentas do site, esta envia o que você fornece a um serviço externo para processamento. Ela precisa de conexão com a internet, e você não deve usá-la com material confidencial.",
        },
      ],
    },
  },

  fr: {
    intro: {
      "on-device": (name, category) =>
        `${name} est un outil gratuit de la catégorie ${category} sur BrowseryTools. Il fonctionne entièrement dans votre navigateur : ce que vous lui donnez est traité sur votre propre appareil et n'est jamais envoyé à un serveur, il n'y a ni inscription, ni publicité, ni filigrane, et il continue de fonctionner sans connexion une fois la page chargée.`,
      "model-download": (name, category) =>
        `${name} est un outil gratuit de la catégorie ${category} sur BrowseryTools, et il exécute son modèle sur votre propre appareil : ce que vous lui confiez est traité en local et n'est jamais envoyé à un serveur. Il n'est pas pour autant totalement autonome : les fichiers du modèle dont il a besoin sont téléchargés depuis un CDN tiers à la première utilisation, puis mis en cache par votre navigateur. La première exécution demande donc une connexion internet et prend nettement plus de temps que les suivantes, et l'outil ne fonctionne hors ligne qu'une fois ces fichiers en cache. Il n'y a ni inscription, ni publicité, ni filigrane.`,
      "remote-data": (name, category) =>
        `${name} est un outil gratuit de la catégorie ${category} sur BrowseryTools. Contrairement à la plupart des outils du site, il n'est pas autonome : il interroge un service tiers pour fonctionner, il lui faut donc une connexion internet et ce service voit la requête. Tout le reste — le calcul et le résultat — se passe dans votre navigateur, sur votre propre appareil. Il n'y a ni inscription, ni publicité, ni filigrane.`,
      "remote-processing": (name, category) =>
        `${name} est un outil gratuit de la catégorie ${category} sur BrowseryTools, et c'est l'exception au fonctionnement du reste du site : une partie du traitement a lieu en dehors de votre appareil. Ce que vous lui donnez est transmis à un service tiers qui s'en charge ; il faut donc une connexion internet, et vous ne devriez pas l'utiliser pour quoi que ce soit de confidentiel. BrowseryTools, de son côté, ne conserve rien, et il n'y a ni inscription, ni publicité, ni filigrane.`,
      "no-user-data": (name, category) =>
        `${name} est un outil gratuit de la catégorie ${category} sur BrowseryTools. Il fonctionne dans votre navigateur sans installation ni inscription, sans publicité ni filigrane. Il ne vous demande aucun contenu : il n'y a donc rien ici à envoyer ni à conserver.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name} fonctionne-t-il hors ligne ?`,
          a: "Seulement après la première utilisation. Les fichiers du modèle sont téléchargés depuis un CDN tiers au premier lancement, puis mis en cache par votre navigateur ; ensuite, tout se passe sur votre appareil. Votre contenu, lui, n'est envoyé à aucun moment.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name} fonctionne-t-il hors ligne ?`,
          a: "Non. Cet outil doit récupérer des données à jour auprès d'un service externe à chaque fois : une connexion est indispensable. Ce que vous saisissez reste dans votre navigateur.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Mes données sont-elles traitées sur mon appareil ?",
          a: "Non. Contrairement aux autres outils du site, celui-ci envoie ce que vous lui donnez à un service externe qui le traite. Il nécessite une connexion internet, et vous ne devriez pas l'utiliser pour des contenus confidentiels.",
        },
      ],
    },
  },

  de: {
    intro: {
      "on-device": (name, category) =>
        `${name} ist ein kostenloses Tool aus der Kategorie ${category} auf BrowseryTools. Es läuft vollständig in deinem Browser: Was du ihm gibst, wird auf deinem eigenen Gerät verarbeitet und nie auf einen Server hochgeladen. Es gibt keine Anmeldung, keine Werbung und keine Wasserzeichen, und sobald die Seite geladen ist, funktioniert es auch ohne Verbindung weiter.`,
      "model-download": (name, category) =>
        `${name} ist ein kostenloses Tool aus der Kategorie ${category} auf BrowseryTools und führt sein Modell auf deinem eigenen Gerät aus — was du ihm übergibst, wird lokal verarbeitet und nie auf einen Server hochgeladen. Ganz eigenständig ist es aber nicht: Die benötigten Modelldateien werden bei der ersten Nutzung von einem Drittanbieter-CDN heruntergeladen und danach von deinem Browser zwischengespeichert. Der erste Durchlauf braucht deshalb eine Internetverbindung und dauert spürbar länger als alle weiteren; offline funktioniert das Tool erst, wenn diese Dateien im Cache liegen. Es gibt keine Anmeldung, keine Werbung und keine Wasserzeichen.`,
      "remote-data": (name, category) =>
        `${name} ist ein kostenloses Tool aus der Kategorie ${category} auf BrowseryTools. Anders als die meisten Tools hier ist es nicht eigenständig: Es fragt zum Arbeiten Daten bei einem Drittanbieter-Dienst ab, braucht also eine Internetverbindung, und dieser Dienst sieht die Anfrage. Alles Übrige — die Berechnung und das Ergebnis — passiert in deinem Browser auf deinem eigenen Gerät. Es gibt keine Anmeldung, keine Werbung und keine Wasserzeichen.`,
      "remote-processing": (name, category) =>
        `${name} ist ein kostenloses Tool aus der Kategorie ${category} auf BrowseryTools und die Ausnahme von der Arbeitsweise des restlichen Angebots: Ein Teil der Verarbeitung findet außerhalb deines Geräts statt. Was du ihm gibst, wird zur Verarbeitung an einen Drittanbieter-Dienst geschickt. Es braucht also eine Internetverbindung, und du solltest es für nichts Vertrauliches verwenden. BrowseryTools selbst speichert nichts, und es gibt keine Anmeldung, keine Werbung und keine Wasserzeichen.`,
      "no-user-data": (name, category) =>
        `${name} ist ein kostenloses Tool aus der Kategorie ${category} auf BrowseryTools. Es läuft in deinem Browser, ohne Installation und ohne Anmeldung, ohne Werbung und ohne Wasserzeichen. Es fragt keinerlei Inhalte von dir ab — hier gibt es also von vornherein nichts, was hochgeladen oder gespeichert werden könnte.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `Funktioniert ${name} offline?`,
          a: "Erst nach der ersten Nutzung. Die Modelldateien werden beim ersten Start von einem Drittanbieter-CDN heruntergeladen und vom Browser zwischengespeichert; danach passiert alles auf deinem Gerät. Deine eigenen Inhalte werden zu keinem Zeitpunkt hochgeladen.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `Funktioniert ${name} offline?`,
          a: "Nein. Dieses Tool muss jedes Mal aktuelle Daten von einem externen Dienst abrufen und braucht dafür eine Verbindung. Was du eingibst, bleibt in deinem Browser.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Werden meine Daten auf meinem Gerät verarbeitet?",
          a: "Nein. Anders als die übrigen Tools dieser Seite schickt dieses das, was du ihm gibst, zur Verarbeitung an einen externen Dienst. Es benötigt eine Internetverbindung, und du solltest es nicht für vertrauliche Inhalte verwenden.",
        },
      ],
    },
  },

  ru: {
    intro: {
      "on-device": (name, category) =>
        `${name} — бесплатный инструмент в категории «${category}» на BrowseryTools. Он полностью работает в браузере: то, что вы ему передаёте, обрабатывается на вашем устройстве и никогда не загружается на сервер. Регистрации нет, рекламы и водяных знаков тоже, а после загрузки страницы инструмент продолжает работать без подключения к сети.`,
      "model-download": (name, category) =>
        `${name} — бесплатный инструмент в категории «${category}» на BrowseryTools; свою модель он запускает прямо на вашем устройстве, так что переданное вами обрабатывается локально и никогда не загружается на сервер. Полностью автономным его, однако, не назовёшь: нужные файлы модели скачиваются со стороннего CDN при первом запуске, а затем сохраняются в кеше браузера. Поэтому первый запуск требует подключения к интернету и занимает заметно больше времени, чем последующие, а без сети инструмент работает только после того, как эти файлы окажутся в кеше. Регистрации нет, рекламы и водяных знаков тоже.`,
      "remote-data": (name, category) =>
        `${name} — бесплатный инструмент в категории «${category}» на BrowseryTools. В отличие от большинства инструментов здесь он не автономен: чтобы работать, он запрашивает данные у стороннего сервиса, поэтому ему нужно подключение к интернету, а сервис видит этот запрос. Всё остальное — расчёт и результат — происходит в браузере на вашем устройстве. Регистрации нет, рекламы и водяных знаков тоже.`,
      "remote-processing": (name, category) =>
        `${name} — бесплатный инструмент в категории «${category}» на BrowseryTools, и он исключение из того, как устроен остальной сайт: часть обработки происходит за пределами вашего устройства. То, что вы ему передаёте, отправляется на обработку стороннему сервису, поэтому нужен интернет, и использовать его для чего-либо конфиденциального не стоит. Сам BrowseryTools ничего не хранит; регистрации нет, рекламы и водяных знаков тоже.`,
      "no-user-data": (name, category) =>
        `${name} — бесплатный инструмент в категории «${category}» на BrowseryTools. Он работает в браузере без установки и без регистрации, без рекламы и водяных знаков. Никакого содержимого он у вас не запрашивает, так что загружать или хранить здесь попросту нечего.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `Работает ли ${name} без интернета?`,
          a: "Только после первого запуска. Файлы модели скачиваются со стороннего CDN при первом использовании и сохраняются в кеше браузера; дальше всё происходит на вашем устройстве. Ваше собственное содержимое не загружается никуда ни на одном из этапов.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `Работает ли ${name} без интернета?`,
          a: "Нет. Этот инструмент каждый раз запрашивает актуальные данные у внешнего сервиса, поэтому подключение необходимо. То, что вы вводите, остаётся в браузере.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Обрабатываются ли мои данные на моём устройстве?",
          a: "Нет. В отличие от остальных инструментов сайта, этот отправляет переданное вами на обработку внешнему сервису. Ему нужно подключение к интернету, и для конфиденциальных материалов использовать его не стоит.",
        },
      ],
    },
  },

  id: {
    intro: {
      "on-device": (name, category) =>
        `${name} adalah alat gratis di kategori ${category} pada BrowseryTools. Alat ini berjalan sepenuhnya di browser Anda: apa yang Anda berikan diproses di perangkat Anda sendiri dan tidak pernah diunggah ke server, tanpa pendaftaran, tanpa iklan, dan tanpa tanda air, serta tetap berfungsi tanpa koneksi setelah halaman selesai dimuat.`,
      "model-download": (name, category) =>
        `${name} adalah alat gratis di kategori ${category} pada BrowseryTools, dan modelnya berjalan di perangkat Anda sendiri — apa yang Anda berikan diproses secara lokal dan tidak pernah diunggah ke server. Meski begitu, alat ini tidak sepenuhnya mandiri: berkas model yang dibutuhkan diunduh dari CDN pihak ketiga saat pertama kali dipakai, lalu disimpan di cache browser Anda. Karena itu, penggunaan pertama memerlukan koneksi internet dan terasa jauh lebih lama dibanding penggunaan berikutnya, dan alat ini baru bisa dipakai luring setelah berkas tersebut tersimpan di cache. Tidak ada pendaftaran, iklan, atau tanda air.`,
      "remote-data": (name, category) =>
        `${name} adalah alat gratis di kategori ${category} pada BrowseryTools. Berbeda dari kebanyakan alat di sini, alat ini tidak mandiri: untuk bekerja ia meminta data ke layanan pihak ketiga, sehingga membutuhkan koneksi internet dan layanan tersebut melihat permintaan itu. Selebihnya — perhitungan dan hasilnya — berlangsung di browser pada perangkat Anda sendiri. Tidak ada pendaftaran, iklan, atau tanda air.`,
      "remote-processing": (name, category) =>
        `${name} adalah alat gratis di kategori ${category} pada BrowseryTools, dan alat ini adalah pengecualian dari cara kerja bagian lain situs ini: sebagian pemrosesannya terjadi di luar perangkat Anda. Apa yang Anda berikan dikirim ke layanan pihak ketiga untuk diproses, jadi alat ini memerlukan koneksi internet dan sebaiknya tidak Anda pakai untuk apa pun yang bersifat rahasia. BrowseryTools sendiri tidak menyimpan apa pun, dan tidak ada pendaftaran, iklan, atau tanda air.`,
      "no-user-data": (name, category) =>
        `${name} adalah alat gratis di kategori ${category} pada BrowseryTools. Alat ini berjalan di browser tanpa pemasangan dan tanpa pendaftaran, serta tanpa iklan atau tanda air. Alat ini tidak meminta konten apa pun dari Anda, jadi memang tidak ada yang perlu diunggah atau disimpan di sini.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `Apakah ${name} bisa dipakai tanpa koneksi internet?`,
          a: "Hanya setelah penggunaan pertama. Berkas model diunduh dari CDN pihak ketiga saat pertama kali dijalankan lalu disimpan di cache browser; setelah itu semuanya berlangsung di perangkat Anda. Konten Anda sendiri tidak pernah diunggah pada tahap mana pun.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `Apakah ${name} bisa dipakai tanpa koneksi internet?`,
          a: "Tidak. Alat ini harus mengambil data terbaru dari layanan eksternal setiap kali dipakai, jadi koneksi tetap dibutuhkan. Apa yang Anda ketik tetap berada di browser Anda.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Apakah data saya diproses di perangkat saya?",
          a: "Tidak. Berbeda dari alat lain di situs ini, alat ini mengirim apa yang Anda berikan ke layanan eksternal untuk diproses. Alat ini memerlukan koneksi internet, dan sebaiknya tidak dipakai untuk materi rahasia.",
        },
      ],
    },
  },

  "zh-CN": {
    intro: {
      "on-device": (name, category) =>
        `${zhLead(name)}是 BrowseryTools 上“${category}”分类中的一款免费工具。它完全在您的浏览器中运行：您交给它的内容都在本机处理，不会上传到任何服务器；无需注册，没有广告，也没有水印。页面加载完成后，断网也能继续使用。`,
      "model-download": (name, category) =>
        `${zhLead(name)}是 BrowseryTools 上“${category}”分类中的一款免费工具，模型直接在您自己的设备上运行——您交给它的内容都在本地处理，不会上传到任何服务器。不过它并非完全自给自足：首次使用时，所需的模型文件会从第三方 CDN 下载，随后由浏览器缓存。因此首次运行需要联网，耗时也明显长于之后几次；只有等这些文件缓存完毕，工具才能离线使用。无需注册，没有广告，也没有水印。`,
      "remote-data": (name, category) =>
        `${zhLead(name)}是 BrowseryTools 上“${category}”分类中的一款免费工具。与这里的大多数工具不同，它并非完全自给自足：运行时需要向第三方服务请求数据，因此必须联网，该服务也会看到这次请求。其余部分——计算和结果——都在您设备上的浏览器里完成。无需注册，没有广告，也没有水印。`,
      "remote-processing": (name, category) =>
        `${zhLead(name)}是 BrowseryTools 上“${category}”分类中的一款免费工具，也是本站其余工具工作方式的例外：它有一部分处理是在您的设备之外完成的。您交给它的内容会发送给第三方服务处理，因此需要联网，也不要用它处理任何机密内容。BrowseryTools 本身不存储任何内容；无需注册，没有广告，也没有水印。`,
      "no-user-data": (name, category) =>
        `${zhLead(name)}是 BrowseryTools 上“${category}”分类中的一款免费工具。它在浏览器中运行，无需安装、无需注册，没有广告和水印。它不会向您索取任何内容，因此这里本来就没有什么可上传或存储的。`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${zhLead(name)}可以离线使用吗？`,
          a: "首次使用之后才可以。模型文件会在第一次运行时从第三方 CDN 下载，并由浏览器缓存；此后所有处理都在您的设备上进行。您自己的内容在任何阶段都不会被上传。",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${zhLead(name)}可以离线使用吗？`,
          a: "不能。这个工具每次都要从外部服务获取最新数据，所以必须联网。您输入的内容仍然留在浏览器里。",
        },
      ],
      "remote-processing": () => [
        {
          q: "我的数据是在本机处理的吗？",
          a: "不是。与本站其他工具不同，这个工具会把您提供的内容发送到外部服务进行处理。它需要联网，请不要用它处理机密内容。",
        },
      ],
    },
  },

  // Turkish is agglutinative: a case suffix on a tool name is unpredictable
  // ("Cron Parser'ı" vs "Cron Parser'i"), so every sentence below is built so
  // the interpolated name stays in the bare nominative.
  tr: {
    intro: {
      "on-device": (name, category) =>
        `${name}, BrowseryTools üzerinde ${category} kategorisinde yer alan ücretsiz bir araçtır. Tamamen tarayıcınızda çalışır: verdiğiniz içerik kendi cihazınızda işlenir ve hiçbir sunucuya yüklenmez. Kayıt yok, reklam yok, filigran yok; sayfa bir kez yüklendikten sonra bağlantı olmadan da çalışmayı sürdürür.`,
      "model-download": (name, category) =>
        `${name}, BrowseryTools üzerinde ${category} kategorisinde yer alan ücretsiz bir araçtır ve modelini kendi cihazınızda çalıştırır — verdiğiniz içerik yerel olarak işlenir ve hiçbir sunucuya yüklenmez. Yine de tümüyle kendi kendine yeten bir araç değildir: ihtiyaç duyduğu model dosyaları ilk kullanımda üçüncü taraf bir CDN üzerinden indirilir, ardından tarayıcınız tarafından önbelleğe alınır. Bu yüzden ilk çalıştırma internet bağlantısı gerektirir ve sonrakilere göre gözle görülür biçimde uzun sürer; araç ancak bu dosyalar önbelleğe alındıktan sonra çevrimdışı çalışır. Kayıt yok, reklam yok, filigran yok.`,
      "remote-data": (name, category) =>
        `${name}, BrowseryTools üzerinde ${category} kategorisinde yer alan ücretsiz bir araçtır. Buradaki araçların çoğundan farklı olarak kendi kendine yetmez: çalışabilmek için üçüncü taraf bir hizmetten veri ister, dolayısıyla internet bağlantısına ihtiyaç duyar ve o hizmet bu isteği görür. Geri kalan her şey — hesaplama ve sonuç — kendi cihazınızdaki tarayıcıda gerçekleşir. Kayıt yok, reklam yok, filigran yok.`,
      "remote-processing": (name, category) =>
        `${name}, BrowseryTools üzerinde ${category} kategorisinde yer alan ücretsiz bir araçtır ve sitenin geri kalanının çalışma biçiminin istisnasıdır: işlemenin bir bölümü cihazınızın dışında gerçekleşir. Verdiğiniz içerik, işlenmek üzere üçüncü taraf bir hizmete gönderilir; bu nedenle internet bağlantısı gerekir ve aracı gizli hiçbir şey için kullanmamalısınız. BrowseryTools'un kendisi hiçbir şey saklamaz; kayıt yok, reklam yok, filigran yok.`,
      "no-user-data": (name, category) =>
        `${name}, BrowseryTools üzerinde ${category} kategorisinde yer alan ücretsiz bir araçtır. Tarayıcınızda, kurulum ve kayıt gerektirmeden, reklamsız ve filigransız çalışır. Sizden herhangi bir içerik istemez; dolayısıyla burada yüklenecek ya da saklanacak bir şey zaten yoktur.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name} çevrimdışı çalışır mı?`,
          a: "Yalnızca ilk kullanımdan sonra. Model dosyaları ilk çalıştırmada üçüncü taraf bir CDN üzerinden indirilir ve tarayıcınız tarafından önbelleğe alınır; sonrasında her şey kendi cihazınızda olup biter. Kendi içeriğiniz ise hiçbir aşamada yüklenmez.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name} çevrimdışı çalışır mı?`,
          a: "Hayır. Bu aracın her seferinde harici bir hizmetten güncel veri alması gerekir, dolayısıyla bağlantı şarttır. Yazdıklarınız tarayıcınızda kalır.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Verilerim kendi cihazımda mı işleniyor?",
          a: "Hayır. Bu araç, sitedeki diğer araçların aksine, verdiğiniz içeriği işlenmek üzere harici bir hizmete gönderir. İnternet bağlantısı gerektirir ve gizli materyaller için kullanılmamalıdır.",
        },
      ],
    },
  },

  // Hindi: the copula agrees with "टूल", never with the interpolated name, so a
  // tool name of either grammatical gender reads correctly.
  hi: {
    intro: {
      "on-device": (name, category) =>
        `${name}, BrowseryTools पर ${category} श्रेणी का एक मुफ़्त टूल है। यह पूरी तरह आपके ब्राउज़र में चलता है: आप जो कुछ इसे देते हैं, वह आपके अपने डिवाइस पर ही प्रोसेस होता है और कभी किसी सर्वर पर अपलोड नहीं होता। न रजिस्ट्रेशन, न विज्ञापन, न वॉटरमार्क — और पेज एक बार लोड हो जाने के बाद यह बिना इंटरनेट कनेक्शन के भी काम करता रहता है।`,
      "model-download": (name, category) =>
        `${name}, BrowseryTools पर ${category} श्रेणी का एक मुफ़्त टूल है और अपना मॉडल आपके अपने डिवाइस पर चलाता है — आप जो कुछ इसे देते हैं, वह लोकल स्तर पर प्रोसेस होता है और कभी किसी सर्वर पर अपलोड नहीं होता। फिर भी यह पूरी तरह आत्मनिर्भर नहीं है: इसे जिन मॉडल फ़ाइलों की ज़रूरत होती है, वे पहली बार इस्तेमाल करने पर एक थर्ड-पार्टी CDN से डाउनलोड होती हैं और उसके बाद आपका ब्राउज़र उन्हें कैश में रख लेता है। इसीलिए पहली बार चलाने पर इंटरनेट कनेक्शन ज़रूरी है और इसमें बाद की बार से काफ़ी ज़्यादा समय लगता है; ये फ़ाइलें कैश हो जाने के बाद ही यह टूल ऑफ़लाइन काम करता है। न रजिस्ट्रेशन, न विज्ञापन, न वॉटरमार्क।`,
      "remote-data": (name, category) =>
        `${name}, BrowseryTools पर ${category} श्रेणी का एक मुफ़्त टूल है। यहाँ के ज़्यादातर टूल्स से अलग, यह आत्मनिर्भर नहीं है: काम करने के लिए यह एक थर्ड-पार्टी सेवा से डेटा माँगता है, इसलिए इसे इंटरनेट कनेक्शन चाहिए और वह सेवा इस अनुरोध को देखती है। बाकी सब कुछ — गणना और नतीजा — आपके अपने डिवाइस पर, आपके ब्राउज़र में ही होता है। न रजिस्ट्रेशन, न विज्ञापन, न वॉटरमार्क।`,
      "remote-processing": (name, category) =>
        `${name}, BrowseryTools पर ${category} श्रेणी का एक मुफ़्त टूल है और यह बाकी साइट के तरीके का अपवाद है: इसकी कुछ प्रोसेसिंग आपके डिवाइस के बाहर होती है। आप जो कुछ इसे देते हैं, वह प्रोसेस होने के लिए एक थर्ड-पार्टी सेवा को भेजा जाता है, इसलिए इंटरनेट कनेक्शन ज़रूरी है और आपको इसे किसी भी गोपनीय चीज़ के लिए इस्तेमाल नहीं करना चाहिए। BrowseryTools खुद कुछ भी स्टोर नहीं करता; न रजिस्ट्रेशन, न विज्ञापन, न वॉटरमार्क।`,
      "no-user-data": (name, category) =>
        `${name}, BrowseryTools पर ${category} श्रेणी का एक मुफ़्त टूल है। यह आपके ब्राउज़र में चलता है — न कुछ इंस्टॉल करना पड़ता है, न रजिस्ट्रेशन, और न ही कोई विज्ञापन या वॉटरमार्क। यह आपसे किसी तरह का कोई कंटेंट माँगता ही नहीं, इसलिए यहाँ अपलोड या स्टोर करने के लिए कुछ है ही नहीं।`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `क्या ${name} टूल ऑफ़लाइन काम करता है?`,
          a: "पहली बार इस्तेमाल करने के बाद ही। मॉडल फ़ाइलें पहली बार चलाने पर एक थर्ड-पार्टी CDN से डाउनलोड होती हैं और आपका ब्राउज़र उन्हें कैश कर लेता है; उसके बाद सब कुछ आपके डिवाइस पर ही होता है। आपका अपना कंटेंट किसी भी चरण में अपलोड नहीं होता।",
        },
      ],
      "remote-data": (name) => [
        {
          q: `क्या ${name} टूल ऑफ़लाइन काम करता है?`,
          a: "नहीं। इस टूल को हर बार किसी बाहरी सेवा से ताज़ा डेटा लाना पड़ता है, इसलिए कनेक्शन ज़रूरी है। आप जो टाइप करते हैं, वह आपके ब्राउज़र में ही रहता है।",
        },
      ],
      "remote-processing": () => [
        {
          q: "क्या मेरा डेटा मेरे डिवाइस पर प्रोसेस होता है?",
          a: "नहीं। इस साइट के बाकी टूल्स से अलग, यह टूल आपके दिए हुए कंटेंट को प्रोसेस करने के लिए एक बाहरी सेवा को भेजता है। इसे इंटरनेट कनेक्शन चाहिए, और गोपनीय सामग्री के लिए इसका इस्तेमाल नहीं करना चाहिए।",
        },
      ],
    },
  },

  vi: {
    intro: {
      "on-device": (name, category) =>
        `${name} là công cụ miễn phí thuộc danh mục ${category} trên BrowseryTools. Công cụ này chạy hoàn toàn trong trình duyệt của bạn: những gì bạn đưa vào đều được xử lý ngay trên thiết bị của bạn và không bao giờ được tải lên máy chủ. Không cần đăng ký, không quảng cáo, không hình mờ, và sau khi trang đã tải xong thì công cụ vẫn chạy được dù không có kết nối.`,
      "model-download": (name, category) =>
        `${name} là công cụ miễn phí thuộc danh mục ${category} trên BrowseryTools, và nó chạy mô hình ngay trên thiết bị của bạn — những gì bạn đưa vào được xử lý cục bộ và không bao giờ được tải lên máy chủ. Tuy vậy, công cụ này không hoàn toàn khép kín: các tệp mô hình mà nó cần sẽ được tải xuống từ một CDN của bên thứ ba trong lần dùng đầu tiên, rồi được trình duyệt lưu vào bộ nhớ đệm. Vì thế lần chạy đầu tiên cần có kết nối internet và mất nhiều thời gian hơn hẳn những lần sau; công cụ chỉ hoạt động ngoại tuyến sau khi các tệp đó đã nằm trong bộ nhớ đệm. Không cần đăng ký, không quảng cáo, không hình mờ.`,
      "remote-data": (name, category) =>
        `${name} là công cụ miễn phí thuộc danh mục ${category} trên BrowseryTools. Khác với hầu hết công cụ ở đây, nó không khép kín: để hoạt động, nó phải yêu cầu dữ liệu từ một dịch vụ của bên thứ ba, nên cần kết nối internet và dịch vụ đó nhìn thấy yêu cầu. Mọi phần còn lại — việc tính toán và kết quả — đều diễn ra trong trình duyệt trên thiết bị của bạn. Không cần đăng ký, không quảng cáo, không hình mờ.`,
      "remote-processing": (name, category) =>
        `${name} là công cụ miễn phí thuộc danh mục ${category} trên BrowseryTools, và đây là ngoại lệ so với cách hoạt động của phần còn lại trên trang: một phần việc xử lý diễn ra bên ngoài thiết bị của bạn. Những gì bạn đưa vào sẽ được gửi tới một dịch vụ của bên thứ ba để xử lý, nên công cụ cần kết nối internet và bạn không nên dùng nó cho bất cứ nội dung nào cần giữ kín. Bản thân BrowseryTools không lưu trữ gì cả, và không cần đăng ký, không quảng cáo, không hình mờ.`,
      "no-user-data": (name, category) =>
        `${name} là công cụ miễn phí thuộc danh mục ${category} trên BrowseryTools. Công cụ chạy trong trình duyệt, không cần cài đặt, không cần đăng ký, không quảng cáo và không hình mờ. Nó không hỏi bạn bất kỳ nội dung nào, nên ở đây vốn dĩ chẳng có gì để tải lên hay lưu lại.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name} có dùng được khi không có mạng không?`,
          a: "Chỉ sau lần dùng đầu tiên. Các tệp mô hình được tải xuống từ một CDN của bên thứ ba trong lần chạy đầu và được trình duyệt lưu vào bộ nhớ đệm; sau đó mọi thứ đều diễn ra trên thiết bị của bạn. Nội dung của riêng bạn không bao giờ được tải lên, ở bất kỳ giai đoạn nào.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name} có dùng được khi không có mạng không?`,
          a: "Không. Công cụ này phải lấy dữ liệu mới nhất từ một dịch vụ bên ngoài mỗi lần dùng, nên bắt buộc phải có kết nối. Những gì bạn nhập vẫn nằm trong trình duyệt của bạn.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Dữ liệu của tôi có được xử lý trên thiết bị của tôi không?",
          a: "Không. Khác với các công cụ còn lại trên trang này, công cụ này gửi những gì bạn đưa vào tới một dịch vụ bên ngoài để xử lý. Nó cần kết nối internet, và bạn không nên dùng nó cho tài liệu cần giữ kín.",
        },
      ],
    },
  },

  // Japanese: は is invariant, so it can follow the interpolated name safely.
  // No space is inserted before it because a tool name may already be Japanese.
  ja: {
    intro: {
      "on-device": (name, category) =>
        `${name}は BrowseryTools の「${category}」カテゴリにある無料ツールです。処理はすべてブラウザ内で完結し、渡した内容はお使いの端末で処理されます。サーバーにアップロードされることはありません。登録も広告もウォーターマークもなく、ページの読み込みが終われば接続がなくても使い続けられます。`,
      "model-download": (name, category) =>
        `${name}は BrowseryTools の「${category}」カテゴリにある無料ツールで、モデルをお使いの端末上で実行します。渡した内容はローカルで処理され、サーバーにアップロードされることはありません。ただし、完全に自己完結しているわけではありません。必要なモデルファイルは初回利用時にサードパーティの CDN からダウンロードされ、その後はブラウザにキャッシュされます。そのため初回の実行にはインターネット接続が必要で、二回目以降よりもはっきりと時間がかかります。オフラインで使えるようになるのは、これらのファイルがキャッシュされたあとです。登録も広告もウォーターマークもありません。`,
      "remote-data": (name, category) =>
        `${name}は BrowseryTools の「${category}」カテゴリにある無料ツールです。ここにあるほとんどのツールとは違い、これは自己完結していません。動作するためにサードパーティのサービスへデータを要求するので、インターネット接続が必要で、そのサービスにはこのリクエストが見えます。それ以外、つまり計算と結果の表示は、お使いの端末のブラウザ内で行われます。登録も広告もウォーターマークもありません。`,
      "remote-processing": (name, category) =>
        `${name}は BrowseryTools の「${category}」カテゴリにある無料ツールですが、このサイトのほかのツールの仕組みとは異なり、処理の一部が端末の外で行われます。渡した内容は処理のためサードパーティのサービスへ送信されるので、インターネット接続が必要です。機密性のある内容には使わないでください。BrowseryTools 自体は何も保存しません。登録も広告もウォーターマークもありません。`,
      "no-user-data": (name, category) =>
        `${name}は BrowseryTools の「${category}」カテゴリにある無料ツールです。インストールも登録も不要で、広告もウォーターマークもなく、ブラウザ内で動作します。このツールは内容の入力を求めないため、そもそもアップロードしたり保存したりするものがありません。`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name}はオフラインでも使えますか。`,
          a: "初回の利用のあとであれば使えます。モデルファイルは最初の実行時にサードパーティの CDN からダウンロードされ、ブラウザにキャッシュされます。それ以降の処理はすべてお使いの端末で行われます。ご自身の内容がアップロードされることは、どの段階でもありません。",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name}はオフラインでも使えますか。`,
          a: "いいえ。このツールは毎回、外部サービスから最新のデータを取得する必要があるため、接続が欠かせません。入力した内容はブラウザ内に留まります。",
        },
      ],
      "remote-processing": () => [
        {
          q: "データは自分の端末で処理されますか。",
          a: "いいえ。このサイトのほかのツールとは異なり、このツールは渡された内容を処理のため外部サービスへ送信します。インターネット接続が必要で、機密性のある資料には使わないでください。",
        },
      ],
    },
  },

  // Persian uses ک (U+06A9) and ی (U+06CC), never their Arabic lookalikes, and
  // ZWNJ inside compounds (می‌شود, فایل‌ها, ثبت‌نام).
  fa: {
    intro: {
      "on-device": (name, category) =>
        `${name} ابزاری رایگان در دستهٔ «${category}» در BrowseryTools است. این ابزار کاملاً در مرورگر شما اجرا می‌شود: هرچه به آن بدهید روی دستگاه خودتان پردازش می‌شود و هرگز روی سروری آپلود نمی‌شود. نه ثبت‌نامی لازم است، نه تبلیغی هست و نه واترمارکی؛ و پس از بارگذاری صفحه، بدون اتصال هم به کار خود ادامه می‌دهد.`,
      "model-download": (name, category) =>
        `${name} ابزاری رایگان در دستهٔ «${category}» در BrowseryTools است و مدل خود را روی دستگاه شما اجرا می‌کند — هرچه به آن بدهید به‌صورت محلی پردازش می‌شود و هرگز روی سروری آپلود نمی‌شود. با این حال کاملاً خودبسنده نیست: فایل‌های مدلی که به آن‌ها نیاز دارد، در نخستین استفاده از یک CDN شخص ثالث دانلود می‌شوند و سپس مرورگر شما آن‌ها را در حافظهٔ نهان نگه می‌دارد. به همین دلیل اجرای نخست به اتصال اینترنت نیاز دارد و به‌طور محسوسی بیشتر از دفعات بعد طول می‌کشد؛ این ابزار تنها پس از ذخیره شدن آن فایل‌ها در حافظهٔ نهان به‌صورت آفلاین کار می‌کند. نه ثبت‌نامی لازم است، نه تبلیغی هست و نه واترمارکی.`,
      "remote-data": (name, category) =>
        `${name} ابزاری رایگان در دستهٔ «${category}» در BrowseryTools است. برخلاف بیشتر ابزارهای اینجا خودبسنده نیست: برای کار کردن از یک سرویس شخص ثالث داده می‌خواهد، پس به اتصال اینترنت نیاز دارد و آن سرویس این درخواست را می‌بیند. باقی کار — محاسبه و نتیجه — در مرورگر و روی دستگاه خودتان انجام می‌شود. نه ثبت‌نامی لازم است، نه تبلیغی هست و نه واترمارکی.`,
      "remote-processing": (name, category) =>
        `${name} ابزاری رایگان در دستهٔ «${category}» در BrowseryTools است و استثنای شیوهٔ کار بقیهٔ این سایت به شمار می‌رود: بخشی از پردازش بیرون از دستگاه شما انجام می‌شود. هرچه به آن بدهید برای پردازش به یک سرویس شخص ثالث فرستاده می‌شود، بنابراین به اتصال اینترنت نیاز دارد و نباید آن را برای هیچ چیز محرمانه‌ای به کار ببرید. خودِ BrowseryTools چیزی ذخیره نمی‌کند؛ نه ثبت‌نامی لازم است، نه تبلیغی هست و نه واترمارکی.`,
      "no-user-data": (name, category) =>
        `${name} ابزاری رایگان در دستهٔ «${category}» در BrowseryTools است. بدون نصب، بدون ثبت‌نام و بدون تبلیغات و واترمارک در مرورگر شما اجرا می‌شود. این ابزار هیچ محتوایی از شما نمی‌خواهد، پس اصلاً چیزی برای آپلود یا ذخیره کردن وجود ندارد.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `آیا ${name} بدون اینترنت کار می‌کند؟`,
          a: "فقط پس از نخستین استفاده. فایل‌های مدل در اولین اجرا از یک CDN شخص ثالث دانلود می‌شوند و مرورگر آن‌ها را در حافظهٔ نهان نگه می‌دارد؛ پس از آن همه چیز روی دستگاه شما انجام می‌شود. محتوای خودتان در هیچ مرحله‌ای آپلود نمی‌شود.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `آیا ${name} بدون اینترنت کار می‌کند؟`,
          a: "خیر. این ابزار هر بار باید داده‌های به‌روز را از یک سرویس بیرونی بگیرد، پس اتصال ضروری است. آنچه می‌نویسید در مرورگر شما می‌ماند.",
        },
      ],
      "remote-processing": () => [
        {
          q: "آیا داده‌های من روی دستگاه خودم پردازش می‌شود؟",
          a: "خیر. برخلاف بقیهٔ ابزارهای این سایت، این ابزار آنچه را به آن می‌دهید برای پردازش به یک سرویس بیرونی می‌فرستد. به اتصال اینترنت نیاز دارد و نباید برای مطالب محرمانه از آن استفاده کرد.",
        },
      ],
    },
  },

  // Korean: 은/는, 이/가 and 을/를 alternate on the final consonant of the word
  // before them, which an interpolated tool name does not fix. Every sentence
  // below therefore sets the name off with a comma instead of a particle.
  ko: {
    intro: {
      "on-device": (name, category) =>
        `${name}, BrowseryTools의 ${category} 카테고리에 있는 무료 도구입니다. 이 도구는 전적으로 브라우저 안에서 실행됩니다. 입력한 내용은 사용자의 기기에서 처리되며 서버로 업로드되지 않습니다. 가입도, 광고도, 워터마크도 없고 페이지가 한 번 로드된 뒤에는 연결이 없어도 계속 사용할 수 있습니다.`,
      "model-download": (name, category) =>
        `${name}, BrowseryTools의 ${category} 카테고리에 있는 무료 도구입니다. 모델은 사용자의 기기에서 직접 실행되므로 입력한 내용은 로컬에서 처리되며 서버로 업로드되지 않습니다. 다만 완전히 독립적이지는 않습니다. 필요한 모델 파일은 처음 사용할 때 제3자 CDN에서 내려받은 뒤 브라우저에 캐시됩니다. 그래서 첫 실행에는 인터넷 연결이 필요하고 이후 실행보다 눈에 띄게 오래 걸리며, 이 파일들이 캐시된 뒤에야 오프라인으로 쓸 수 있습니다. 가입도, 광고도, 워터마크도 없습니다.`,
      "remote-data": (name, category) =>
        `${name}, BrowseryTools의 ${category} 카테고리에 있는 무료 도구입니다. 여기 있는 대부분의 도구와 달리 이 도구는 독립적이지 않습니다. 작동하려면 제3자 서비스에 데이터를 요청해야 하므로 인터넷 연결이 필요하고, 그 서비스는 이 요청을 보게 됩니다. 나머지, 즉 계산과 결과는 모두 사용자의 기기 브라우저 안에서 이루어집니다. 가입도, 광고도, 워터마크도 없습니다.`,
      "remote-processing": (name, category) =>
        `${name}, BrowseryTools의 ${category} 카테고리에 있는 무료 도구이며 이 사이트의 다른 도구들과는 다르게 동작합니다. 처리의 일부가 기기 바깥에서 이루어지기 때문입니다. 입력한 내용은 처리를 위해 제3자 서비스로 전송되므로 인터넷 연결이 필요하고, 기밀에 해당하는 자료에는 사용하지 마세요. BrowseryTools 자체는 아무것도 저장하지 않으며 가입도, 광고도, 워터마크도 없습니다.`,
      "no-user-data": (name, category) =>
        `${name}, BrowseryTools의 ${category} 카테고리에 있는 무료 도구입니다. 설치도 가입도 필요 없고 광고나 워터마크도 없이 브라우저에서 실행됩니다. 이 도구는 어떤 내용도 입력받지 않으므로 애초에 업로드하거나 저장할 것이 없습니다.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name}, 오프라인에서도 쓸 수 있나요?`,
          a: "처음 한 번 사용한 뒤에는 쓸 수 있습니다. 모델 파일은 첫 실행 때 제3자 CDN에서 내려받아 브라우저에 캐시되며, 그 뒤로는 모든 처리가 기기에서 이루어집니다. 사용자의 콘텐츠는 어느 단계에서도 업로드되지 않습니다.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name}, 오프라인에서도 쓸 수 있나요?`,
          a: "아니요. 이 도구는 매번 외부 서비스에서 최신 데이터를 받아와야 하므로 연결이 반드시 필요합니다. 입력한 내용은 브라우저 안에 그대로 남습니다.",
        },
      ],
      "remote-processing": () => [
        {
          q: "제 데이터가 제 기기에서 처리되나요?",
          a: "아니요. 이 사이트의 다른 도구들과 달리 이 도구는 입력한 내용을 처리하기 위해 외부 서비스로 전송합니다. 인터넷 연결이 필요하며, 기밀 자료에는 사용하지 않는 것이 좋습니다.",
        },
      ],
    },
  },

  // Polish has seven cases, so neither interpolated value is ever asked to
  // inflect: the name opens the sentence in the nominative ("X to …") and the
  // category sits in quotation marks as a cited form.
  pl: {
    intro: {
      "on-device": (name, category) =>
        `${name} to bezpłatne narzędzie z kategorii „${category}” w serwisie BrowseryTools. Działa w całości w Twojej przeglądarce: to, co mu przekażesz, jest przetwarzane na Twoim własnym urządzeniu i nigdy nie trafia na serwer. Nie ma rejestracji, reklam ani znaków wodnych, a po wczytaniu strony narzędzie działa dalej nawet bez połączenia.`,
      "model-download": (name, category) =>
        `${name} to bezpłatne narzędzie z kategorii „${category}” w serwisie BrowseryTools, które uruchamia swój model na Twoim własnym urządzeniu — to, co mu przekażesz, jest przetwarzane lokalnie i nigdy nie trafia na serwer. Nie jest jednak w pełni samowystarczalne: potrzebne pliki modelu są przy pierwszym użyciu pobierane z zewnętrznej sieci CDN, a następnie zapisywane w pamięci podręcznej przeglądarki. Dlatego pierwsze uruchomienie wymaga połączenia z internetem i trwa wyraźnie dłużej niż kolejne, a bez sieci narzędzie działa dopiero wtedy, gdy te pliki są już w pamięci podręcznej. Nie ma rejestracji, reklam ani znaków wodnych.`,
      "remote-data": (name, category) =>
        `${name} to bezpłatne narzędzie z kategorii „${category}” w serwisie BrowseryTools. W odróżnieniu od większości narzędzi w tym serwisie nie jest samowystarczalne: do działania pobiera dane z usługi zewnętrznej, potrzebuje więc połączenia z internetem, a ta usługa widzi zapytanie. Cała reszta — obliczenia i wynik — dzieje się w przeglądarce, na Twoim własnym urządzeniu. Nie ma rejestracji, reklam ani znaków wodnych.`,
      "remote-processing": (name, category) =>
        `${name} to bezpłatne narzędzie z kategorii „${category}” w serwisie BrowseryTools i wyjątek od zasady, na jakiej działa reszta serwisu: część przetwarzania odbywa się poza Twoim urządzeniem. To, co mu przekażesz, jest wysyłane do przetworzenia do usługi zewnętrznej, narzędzie wymaga więc połączenia z internetem i nie należy używać go do niczego poufnego. Sam BrowseryTools niczego nie przechowuje, nie ma też rejestracji, reklam ani znaków wodnych.`,
      "no-user-data": (name, category) =>
        `${name} to bezpłatne narzędzie z kategorii „${category}” w serwisie BrowseryTools. Działa w przeglądarce, bez instalacji i bez rejestracji, bez reklam i bez znaków wodnych. Nie prosi Cię o żadną treść, więc nie ma tu czego wysyłać ani przechowywać.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `Czy ${name} działa bez internetu?`,
          a: "Dopiero po pierwszym użyciu. Pliki modelu są przy pierwszym uruchomieniu pobierane z zewnętrznej sieci CDN i zapisywane w pamięci podręcznej przeglądarki; potem wszystko dzieje się na Twoim urządzeniu. Twoje własne treści nie są wysyłane na żadnym etapie.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `Czy ${name} działa bez internetu?`,
          a: "Nie. To narzędzie za każdym razem musi pobrać aktualne dane z usługi zewnętrznej, więc połączenie jest niezbędne. To, co wpiszesz, zostaje w Twojej przeglądarce.",
        },
      ],
      "remote-processing": () => [
        {
          q: "Czy moje dane są przetwarzane na moim urządzeniu?",
          a: "Nie. W odróżnieniu od pozostałych narzędzi w serwisie to narzędzie wysyła przekazane treści do przetworzenia w usłudze zewnętrznej. Wymaga połączenia z internetem i nie należy używać go do materiałów poufnych.",
        },
      ],
    },
  },

  // Italian: every adjective and participle agrees with the head noun
  // "strumento", never with the interpolated name, and no article is ever
  // hard-coded in front of an interpolated value. "file" and "server" are
  // invariable loanwords and take no plural -s.
  it: {
    intro: {
      "on-device": (name, category) =>
        `${name} è uno strumento gratuito della categoria ${category} su BrowseryTools. Funziona interamente nel browser: quello che gli dai viene elaborato sul tuo dispositivo e non viene mai caricato su un server, non ci sono registrazione, pubblicità né filigrane, e una volta caricata la pagina continua a funzionare anche senza connessione.`,
      "model-download": (name, category) =>
        `${name} è uno strumento gratuito della categoria ${category} su BrowseryTools ed esegue il suo modello direttamente sul tuo dispositivo: quello che gli dai viene elaborato in locale e non viene mai caricato su un server. Non è però del tutto autosufficiente: i file del modello di cui ha bisogno vengono scaricati da una CDN di terze parti al primo utilizzo e poi conservati nella cache del browser. Per questo la prima esecuzione richiede una connessione a internet e dura molto più a lungo delle successive, e lo strumento funziona offline soltanto dopo che quei file sono in cache. Non ci sono registrazione, pubblicità né filigrane.`,
      "remote-data": (name, category) =>
        `${name} è uno strumento gratuito della categoria ${category} su BrowseryTools. A differenza della maggior parte degli strumenti presenti qui non è autosufficiente: per funzionare richiede dati a un servizio di terze parti, quindi ha bisogno di una connessione a internet e quel servizio vede la richiesta. Tutto il resto — il calcolo e il risultato — avviene nel browser, sul tuo dispositivo. Non ci sono registrazione, pubblicità né filigrane.`,
      "remote-processing": (name, category) =>
        `${name} è uno strumento gratuito della categoria ${category} su BrowseryTools ed è l'eccezione al modo in cui funziona il resto del sito: una parte dell'elaborazione avviene fuori dal tuo dispositivo. Quello che gli dai viene inviato a un servizio di terze parti che se ne occupa, quindi serve una connessione a internet e non dovresti usarlo per niente di riservato. BrowseryTools di suo non conserva nulla, e non ci sono registrazione, pubblicità né filigrane.`,
      "no-user-data": (name, category) =>
        `${name} è uno strumento gratuito della categoria ${category} su BrowseryTools. Funziona nel browser senza installazione e senza registrazione, senza pubblicità né filigrane. Non ti chiede alcun contenuto, quindi qui non c'è nulla da caricare o da conservare.`,
    },
    faq: {
      "model-download": (name) => [
        {
          q: `${name} funziona offline?`,
          a: "Solo dopo il primo utilizzo. I file del modello vengono scaricati da una CDN di terze parti alla prima esecuzione e conservati nella cache del browser; da lì in poi tutto avviene sul tuo dispositivo. I tuoi contenuti non vengono caricati in nessun momento.",
        },
      ],
      "remote-data": (name) => [
        {
          q: `${name} funziona offline?`,
          a: "No. Questo strumento deve richiedere ogni volta dati aggiornati a un servizio esterno, quindi la connessione è indispensabile. Quello che scrivi resta nel browser.",
        },
      ],
      "remote-processing": () => [
        {
          q: "I miei dati vengono elaborati sul mio dispositivo?",
          a: "No. A differenza degli altri strumenti del sito, questo invia quello che gli dai a un servizio esterno che lo elabora. Richiede una connessione a internet e non dovresti usarlo per materiale riservato.",
        },
      ],
    },
  },
} satisfies Partial<Record<Locale, FallbackCopy>>;

/** Locales the templated fallback can actually speak. Derived, not declared. */
export type FallbackProseLocale = keyof typeof FALLBACK_COPY;

/** The same set as an array, for tests and for callers that need to iterate. */
export const FALLBACK_PROSE_LOCALES = Object.keys(
  FALLBACK_COPY
) as FallbackProseLocale[];

/**
 * Whether `buildFallbackContent` has real prose for a locale. ToolSeoContent
 * uses this to decide whether to render at all: a page that would otherwise get
 * English copy under a `/{locale}/` prefix renders nothing instead.
 */
export function hasFallbackProse(locale: Locale): locale is FallbackProseLocale {
  return Object.prototype.hasOwnProperty.call(FALLBACK_COPY, locale);
}

export function buildFallbackContent(
  input: FallbackInput,
  locale: Locale
): ToolContentLocale {
  const { name, description, category } = input;
  const profile = input.dataProfile ?? "on-device";
  // English is the last resort for a locale that has no block above. Callers
  // that must not show the wrong language guard with hasFallbackProse first.
  const copy: FallbackCopy = hasFallbackProse(locale)
    ? FALLBACK_COPY[locale]
    : FALLBACK_COPY.en;

  const intro = copy.intro[profile](name, category);
  return {
    intro: description ? `${description}\n\n${intro}` : intro,
    faq: copy.faq[profile]?.(name) ?? [],
  };
}
