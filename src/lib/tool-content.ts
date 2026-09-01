// ──────────────────────────────────────────────────────────────────────────────
// Per-tool on-page SEO content registry.
//
// Each tool slug (the path segment after /tools/) maps to bilingual content:
//   - intro:          1–2 paragraph "About / how it works" copy
//   - whyClientSide:  optional single paragraph on why THIS tool running
//                     on-device matters. Must be tool-specific. If a tool has no
//                     real privacy angle, say so honestly instead of inventing
//                     one — omit the field rather than writing filler.
//   - limitations:    optional 2–4 plain-language honest limitations. Deliberately
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
   * Optional. 2–4 honest, plain-language limitations. Rendered as prose only —
   * deliberately excluded from FAQPage and every other JSON-LD graph.
   * Omit rather than invent: an empty list renders nothing.
   */
  limitations?: string[];
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

  "bg-removal": {
    related: [
      "object-cutout",
      "image-compression",
      "image-converter",
      "photo-collage",
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
