# Arabic-language outreach — DRAFTS / مسودات باللغة العربية

> **Status: nothing has been posted or sent.** No account was created on any Arabic platform and
> no email was sent. These are drafts for the owner to review and send manually.
>
> **Before sending:**
>
> 1. **Fix the tool count first** — README "130+", GitHub description "160+", `bun run validate`
>    says **152**. The Arabic copy below uses ١٥٢ / 152.
> 2. **A native Arabic speaker should read the copy aloud before it goes out.** It is written to
>    match the register already used in the `ar` entries of `src/lib/tool-content.ts` — formal MSA,
>    technical terms kept in Latin script where that is the norm (PDF, Word, AGPL, Whisper),
>    Arabic guillemets «» for quotes, and no marketing inflation. It is not a machine translation
>    of the English drafts; the argument structure is different because the audience is different.
> 3. **The honesty rules are identical to the English drafts and must survive translation.** User
>    content stays on-device; ~12 tools download a model from a CDN on first use; the currency
>    converter calls an external API; Live Dictation uses the Web Speech API (audio goes to the
>    browser vendor in Chrome/Edge); **there is no service worker, so nothing works offline**; the
>    hosted site runs Vercel Analytics. Every draft below states these. Do not trim them.

---

## Why these three, and why not the others

Of the four English documents, only **two** have a real Arabic counterpart, and I've added a third
piece that has no English equivalent because it's the highest-value Arabic asset.

**Translated:**

1. **`reddit.md` → a حسوب I/O community post.** This is the strongest one. حسوب I/O
   (<https://io.hsoub.com>) is a live Arabic community with a برمجة (programming) and a تطوير الويب
   (web development) community, verified publishing on **2026-07-31**. It is the closest thing the
   Arabic web has to r/opensource + r/SideProject in one place, and unlike Reddit there is no
   self-promotion ratio to trip over. This is the single post most worth writing.
2. **`show-hn.md` → an Arabic tech-media pitch.** The Show HN substance — what it is, why it
   exists, and what it can't do — is exactly the material an Arabic tech editor needs. There is no
   Arabic Hacker News, so the equivalent distribution is the Arabic tech press, which covers
   "free online tools" heavily and has almost no competition on the RTL angle.

**Not translated, deliberately:**

- **`awesome-lists.md`** — every one of those lists is an English-language GitHub repo.
  awesome-selfhosted's guidelines even say *"If the project has no documentation in English, please
  add (documentation in $LANGUAGE)"*, which tells you the default assumption. An Arabic entry would
  be rejected as malformed.
- **`directories.md`** — AlternativeTo's FAQ states the listing must be **English only** and the
  app must support English. SaaSHub rejects non-English submissions outright. Product Hunt is
  English. Translating these would produce copy nobody can submit.

**Added (no English equivalent):**

3. **Short Arabic listing + social copy.** Reusable for X/LinkedIn, for the Arabic blog posts the
   project already publishes, and for any Arabic-language directory that turns up.

**Why this lane is worth the effort at all:** the site has full RTL and nine locales including
Arabic, and 21 of the 50 hand-authored entries in `tool-content.ts` already carry real Arabic prose
(not machine output). The Arabic-language "free online tools" space is dominated by ad-heavy upload
sites; a genuinely client-side, no-signup, no-watermark alternative with a native RTL interface has
almost no Arabic competition. That is a real gap, not a marketing line.

---

## 1. حسوب I/O — منشور المجتمع

**المنصة:** <https://io.hsoub.com>
**المجتمع المستهدف:** [برمجة](https://io.hsoub.com/programming) أو
[تطوير الويب](https://io.hsoub.com/dev) — **TODO(verify)** أيّهما أنسب؛ راجع آخر ٢٠ منشورًا في كل
مجتمع قبل الاختيار.
**قواعد المشاركة:** <https://support.io.hsoub.com/category/guidelines>

> ⚠️ **TODO(verify) قبل النشر:** لم أتمكّن من قراءة نص القاعدة المتعلقة بالترويج الذاتي أو
> الإعلانات في مركز المساعدة — الصفحة التي وصلت إليها تعرض عناوين الأقسام فقط. اقرأ قسم «قواعد
> المشاركة» و«شروط الاستخدام» بنفسك قبل النشر، وتأكّد تحديدًا من موقف المنصة من الروابط الخارجية
> ومن الحديث عن مشروع تملكه. المعروف والمؤكَّد: إنشاء **مجتمع** جديد يتطلّب ١٠٠٠ نقطة سمعة — أما
> النشر داخل مجتمع قائم فلا يشترط ذلك.
>
> نصيحة عملية: شارك في المنصة أسبوعين قبل نشر هذا — علّق، أجب على أسئلة في «اسأل I/O»، اجمع سمعة.
> منشور ترويجي من حساب عمره يوم واحد يُقرأ كإعلان مهما كانت صياغته.

### العنوان

```
بنيت ١٥٢ أداة تعمل كلها داخل المتصفح — بلا رفع ملفات ولا حساب
```

### المتن

```
أنا مطوّر المشروع، وهذا حديث عن أداة من صنعي.

المشكلة التي دفعتني لبدء المشروع مألوفة لأي شخص يتعامل مع الملفات يوميًا:
تحتاج إلى ضغط ملف PDF أو تحويل صورة أو إزالة بيانات الموقع من صورة قبل
مشاركتها، فتجد أن كل النتائج الأولى في البحث تطلب منك رفع الملف إلى خادم
لا تعرف عنه شيئًا، والانتظار، ثم الوثوق بأنهم حذفوه فعلًا.

لكن معظم هذه العمليات لا تحتاج خادمًا أصلًا. المتصفح اليوم يملك ما يكفي —
Canvas وWebAssembly وواجهة File API — لتنفيذها محليًا.

فبنيت BrowseryTools على قاعدة واحدة: ملفك ملكك، ولا يغادر جهازك.

https://browserytools.com
الشيفرة المصدرية: https://github.com/aghyad97/browserytools (رخصة AGPL-3.0)

ما الذي يحتويه؟ ١٥٢ أداة موزّعة على:

- ملفات PDF — دمج، تقسيم، ضغط، تدوير، إعادة ترتيب، علامة مائية، توقيع،
  استخراج نص، تحويل إلى Word والعكس
- الصور — ضغط (بما في ذلك استهداف حجم محدد بالكيلوبايت)، تحويل الصيغ،
  تغيير الأبعاد، القص، إزالة الخلفية، عرض بيانات EXIF وإزالتها، تمويه
  الأجزاء الحساسة
- الوسائط — ضغط الفيديو، استخراج الصوت، صناعة GIF، تسجيل الشاشة، توليد
  الترجمات وحرقها على الفيديو
- النصوص والبيانات — تحويل حالة الأحرف، مقارنة النصوص، Markdown، عرض ملفات
  CSV وExcel، تحويل بين JSON وYAML وXML، استخراج النص من الصور (OCR)
- أدوات المطوّرين — تنسيق JSON وSQL وHTML، اختبار التعابير النمطية، فك
  ترميز JWT، شرح تعابير cron، تحويل أوامر curl إلى شيفرة جاهزة
- ذكاء اصطناعي على الجهاز — تفريغ صوتي بنموذج Whisper، ترجمة، تلخيص، وصف
  الصور، رفع دقة الصور، إخفاء البيانات الشخصية

كل ذلك دون تسجيل ولا حد أقصى لحجم الملف ولا علامة مائية.

الواجهة متاحة بتسع لغات، والعربية منها بدعم كامل لاتجاه الكتابة من اليمين
إلى اليسار — ليست ترجمة مركّبة على تصميم إنجليزي.

الآن الجزء الذي يهمّني أن أقوله بوضوح، لأن عبارة «يعمل داخل متصفحك» تُستخدم
بتساهل كبير:

محتواك لا يُرفع. ملفاتك وصورك ونصوصك وتسجيلاتك تبقى على جهازك. لكن نحو
اثنتي عشرة أداة تُجري طلبًا شبكيًا واحدًا عند أول استخدام لتنزيل النموذج
الذي يقوم بالمعالجة: أدوات الذكاء الاصطناعي تُنزّل أوزان النماذج من شبكة
Hugging Face، وأداة استخراج النص تُنزّل بيانات اللغة من خادم tessdata،
وأداة تحويل النص إلى كلام تُنزّل نموذجًا صوتيًا، وأداة إزالة الخلفية
تُنزّل نموذجها من staticimgly.com. تُخزَّن هذه الملفات في المتصفح بعد ذلك،
لكن التشغيل الأول يتطلّب اتصالًا.

وأداتان لا تعملان محليًا فعلًا، وأفضّل ذكرهما هنا على أن يكتشفهما أحدكم:
محوّل العملات يجلب أسعار الصرف من api.frankfurter.app، وأداة الإملاء
المباشر تستخدم واجهة Web Speech في المتصفح، ما يعني أن الصوت يمرّ عبر
خوادم مطوّر المتصفح — أي Google في حالة Chrome. هذه الأداة شاذّة عن منطق
المشروع كله وأفكّر في استبدالها بمسار Whisper المحلي.

ولا يوجد service worker، أي أن الموقع لا يعمل دون إنترنت.

والموقع المستضاف يستخدم Vercel Analytics لإحصاءات مجمّعة، وهذا موضّح في
صفحة /privacy. من يزعجه ذلك: المشروع مفتوح المصدر ويمكن استضافته ذاتيًا —
استنساخ المستودع، ثم bun install وbun run build وbun start، بلا قاعدة
بيانات ولا خدمة خلفية.

وأمّا حدود الأدوات نفسها، فأصدقها معكم:

- التفريغ الصوتي على الجهاز أضعف من نظيره على الخوادم. نموذج whisper-base
  صغير ومكمَّم ليعمل في المتصفح؛ يؤدّي جيدًا مع كلام إنجليزي واضح، لكنه
  يتراجع بسرعة مع اللهجات والضجيج والمصطلحات التقنية، وهو بطيء — تسجيل
  طويل يستغرق دقائق حقيقية.
- تحويل PDF إلى Word بنيوي لا بصري: تحصل على مستند قابل للتحرير بعناوين
  وفقرات وقوائم صحيحة، لا على نسخة مطابقة بالبكسل. الجداول ذات الحدود
  الظاهرة تُحوَّل بموثوقية، أما بلا حدود فبتقدير تقريبي قد يخطئ، والخلايا
  المدمجة غير مدعومة، والصور المضمّنة لا تُنقَل بعد.
- لا تعمل أدوات PDF على الملفات الممسوحة ضوئيًا، لأنها صور بلا طبقة نص.
  لا بد من المرور بأداة استخراج النص (OCR) أولًا.
- ضغط الفيديو يمرّ عبر ffmpeg.wasm، وهو أحادي الخيط وأبطأ كثيرًا من أي
  مُرمِّز أصلي. المقاطع القصيرة هي الاستخدام الواقعي؛ ملف ٤K بطول أربعين
  دقيقة ليس كذلك.
- وأخيرًا: رقم ١٥٢ ليس مصدر فخر بقدر ما هو مشكلة أعرفها. بعض هذه الأدوات
  ممتازة وبعضها نموذج إدخال حول تعبير نمطي. أفضّل أربعين أداة ممتازة على
  ١٥٢ متفاوتة، ودمج المكرر منها هو ما أنوي فعله تاليًا.

سعيد بالإجابة عن أي سؤال حول التنفيذ داخل المتصفح، أو عن سبب اختيار رخصة
AGPL تحديدًا، أو عن الحد الذي تتوقف عنده جدوى المعالجة المحلية.
```

---

## 2. عرض على المواقع التقنية العربية — رسالة بريدية

**من يُراسَل، وحالة كلٍّ منهم (تم التحقق ٢٠٢٦-٠٧-٣١):**

| الموقع | الحالة | ملاحظة |
| --- | --- | --- |
| [البوابة العربية للأخبار التقنية](https://aitnews.com) | ✅ **حيّ** — أحدث مقال بتاريخ ٢٠٢٦-٠٧-٣١ | يغطي الأخبار التقنية بالدرجة الأولى، والأدوات ثانويًا. **TODO(verify)** بريد التحرير — لم أعثر على صفحة «اتصل بنا» في الصفحة الرئيسية؛ ابحث في التذييل أو صفحة «من نحن». |
| [عالم التقنية](https://www.tech-wd.com/wd/) | ✅ **حيّ** — أحدث مقال بتاريخ ٢٠٢٦-٠٧-٣٠ | تركيزه على أخبار الشركات والمنتجات أكثر من مراجعات الأدوات. **TODO(verify)** بريد التحرير. |
| [أراجيك](https://www.arageek.com) | ⚠️ **UNVERIFIED** | موقع قائم منذ ٢٠١١ ومعروف، لكنني لم أتحقّق من نشاط النشر في ٢٠٢٦ ولا من وجود قناة تواصل تحريرية. تحقّق بنفسك. |

> ⚠️ **UNVERIFIED — عناوين البريد.** لم أتمكّن من تأكيد أي عنوان بريد تحريري لأيٍّ من المواقع
> الثلاثة. **لا ترسل إلى عنوان مخمَّن.** ادخل الموقع، اعثر على صفحة «اتصل بنا» أو «راسلنا» أو
> حساب المحرّر على X، واستخدم القناة المعلنة. الرسالة إلى عنوان خاطئ ليست خسارة كبيرة، لكن
> الرسالة إلى عنوان عام لطلبات الإعلان تُقرأ كطلب إعلان مدفوع وتُدفن.

**سطر الموضوع:**

```
أداة عربية مفتوحة المصدر: ١٥٢ أداة تعمل داخل المتصفح دون رفع الملفات
```

**نص الرسالة:**

```
تحية طيبة،

أنا أغياد، مطوّر مشروع BrowseryTools، وأكتب إليكم بصفتي صاحب المشروع لا
بصفة قارئ يرشّحه.

المشروع مجموعة من ١٥٢ أداة تعمل بالكامل داخل متصفح المستخدم: أدوات PDF
وصور ووسائط ونصوص وبيانات وأدوات للمطوّرين، إضافة إلى أدوات ذكاء اصطناعي
تعمل على جهاز المستخدم نفسه (تفريغ صوتي، ترجمة، تلخيص، استخراج نص من
الصور).

الرابط: https://browserytools.com
الشيفرة المصدرية: https://github.com/aghyad97/browserytools — رخصة AGPL-3.0

ما الذي يميّزه عن عشرات مواقع الأدوات المجانية؟

أولًا، الملفات لا تُرفع إلى أي خادم. المعالجة تجري على جهاز المستخدم عبر
Canvas وWebAssembly، ولهذا لا يوجد حد أقصى لحجم الملف، ولا علامة مائية على
المخرجات، ولا تسجيل حساب. هذا فرق جوهري لمن يتعامل مع مستندات فيها بيانات
شخصية أو عقود أو صور عائلية.

ثانيًا، وهو ما أظنّه الأكثر صلة بقرّائكم: الواجهة عربية بالكامل مع دعم
حقيقي لاتجاه الكتابة من اليمين إلى اليسار — ليست ترجمة سطحية فوق تصميم
إنجليزي. المحتوى التعليمي المرافق لكل أداة (شرح كيفية العمل والأسئلة
الشائعة) مكتوب بالعربية أيضًا، لا مترجم آليًا. الموقع متاح بتسع لغات.

ثالثًا، المشروع مفتوح المصدر برخصة AGPL، ما يعني أن أي نسخة مستضافة معدَّلة
منه ملزَمة بنشر شيفرتها. اخترت ذلك عمدًا لأن أسوأ ما قد يحدث لمشروع كهذا
هو أن يُعاد نشره بإعلانات وبنقطة رفع فعلية للملفات.

وحتى تكون الصورة كاملة قبل أن يجرّبه أحد من فريقكم:

- محتوى المستخدم يبقى محليًا، لكن نحو اثنتي عشرة أداة تُنزّل نموذج
  المعالجة من شبكة توصيل محتوى عند أول استخدام (نماذج الذكاء الاصطناعي من
  Hugging Face، وبيانات لغات OCR من tessdata). تُخزَّن بعدها في المتصفح.
- أداتان لا تعملان محليًا: محوّل العملات يجلب أسعار الصرف من واجهة خارجية،
  وأداة الإملاء المباشر تستخدم واجهة Web Speech في المتصفح.
- الموقع لا يعمل دون اتصال بالإنترنت.
- الموقع المستضاف يستخدم Vercel Analytics لإحصاءات زيارات مجمّعة، وهو
  موضّح في صفحة الخصوصية.
- التفريغ الصوتي على الجهاز أقل دقة وأبطأ من الخدمات السحابية، وضغط
  الفيديو داخل المتصفح مناسب للمقاطع القصيرة لا للملفات الطويلة عالية
  الدقة.

ذكرت هذه النقاط لأنني أفضّل أن تصلكم منّي على أن تظهر في تعليق تحت المقال.

إن كان الموضوع مناسبًا لتغطيتكم، يسعدني تزويدكم بلقطات شاشة عالية الدقة،
أو تفاصيل تقنية عن كيفية تنفيذ التفريغ الصوتي والتعرّف الضوئي داخل
المتصفح، أو الإجابة عن أي سؤال.

وشكرًا لوقتكم في كل الأحوال.

أغياد
https://github.com/aghyad97
```

---

## 3. نسخ قصيرة — للأدلّة ولمنصات التواصل

قابلة لإعادة الاستخدام في X وLinkedIn وفي أي دليل عربي، وفي وصف الموقع نفسه.

**وصف من سطر واحد (٩٤ حرفًا):**
```
١٥٢ أداة تعمل داخل متصفحك: ملفاتك تُعالَج على جهازك ولا تُرفع إلى أي خادم. مجانية ومفتوحة المصدر.
```

**وصف متوسط (٢٣٧ حرفًا) — لحقول الأدلّة:**
```
BrowseryTools مجموعة من ١٥٢ أداة لملفات PDF والصور والفيديو والنصوص والشيفرة، تُعالَج ملفاتك فيها على جهازك داخل المتصفح بدل رفعها إلى خادم. بلا تسجيل ولا حد لحجم الملف ولا علامة مائية. مفتوحة المصدر برخصة AGPL-3.0، وبتسع لغات منها العربية بدعم RTL كامل.
```

**منشور X / LinkedIn:**
```
بنيت BrowseryTools: ١٥٢ أداة تعمل كلها داخل المتصفح.

اضغط PDF، حوّل صورة، أزل بيانات الموقع من صورك، فرّغ تسجيلًا صوتيًا نصًّا —
كل ذلك على جهازك. لا رفع، لا حساب، لا حد لحجم الملف، لا علامة مائية.

مفتوح المصدر (AGPL-3.0)، وبواجهة عربية كاملة بدعم RTL.

الأدوات التي تعتمد الذكاء الاصطناعي تُنزّل نموذجها مرة واحدة عند أول
استخدام ثم تعمل محليًا. والموقع لا يعمل دون إنترنت — لا يوجد service
worker بعد.

https://browserytools.com
```

> **ملاحظة على الأرقام:** استخدمت الأرقام الهندية (١٥٢) في المتن العربي والأرقام اللاتينية في
> الحقول التقنية والروابط، وهو ما يطابق العرف السائد. إن كان دليل الأسلوب المعتمد في المشروع
> يفضّل اللاتينية في كل موضع، وحّدها قبل النشر — لكن لا تخلط بينهما في نفس الفقرة.

---

## 4. منصات عربية أخرى — لم يكتمل التحقق منها

> ⚠️ **UNVERIFIED — تعامل مع هذا القسم كقائمة بحث لا كقائمة أهداف.** انقطع التحقّق من هذه
> المنصات قبل اكتماله. **لا تنشر في أي منها قبل أن تقرأ قواعدها بنفسك وتؤكّد أنها حيّة.**

| المنصة | ما تحتاج التحقق منه |
| --- | --- |
| مجتمع أكاديمية حسوب (`academy.hsoub.com`) | هل هناك قسم مناسب لعرض مشروع؟ ما موقفه من الترويج الذاتي؟ |
| r/arabs، r/AskMiddleEast | نشِطان؟ وهل يسمحان بمنشورات المشاريع أصلًا؟ الأرجح لا — كلاهما مجتمع نقاش عام لا مجتمع تقني. |
| r/Egypt، r/saudiarabia، r/jordan، r/UAE، r/Morocco، r/algeria، r/Kuwait، r/lebanon | مجتمعات قُطرية عامة؛ منشورات المشاريع فيها غالبًا مخالفة. تحقّق من قواعد كلٍّ منها قبل التفكير في أيٍّ منها. |
| مجتمع عربي للمطوّرين على Reddit | ابحث أولًا عمّا إذا كان موجودًا ونشِطًا — لم أؤكّد وجود واحد. |
| مجموعات Telegram/Discord عربية للمطوّرين | موجودة بكثرة لكن معظمها مغلق أو بدعوة؛ النشر فيها بلا مشاركة سابقة يُقرأ كسبام. |
| أدلّة/منصات إطلاق منتجات عربية | **UNVERIFIED** — لم أعثر على مكافئ عربي حيّ لـ Product Hunt. لا تفترض وجوده. |

**نصيحة عامة تنطبق على كل ما سبق:** أفضل قناة عربية لهذا المشروع ليست منشورًا واحدًا في أي مكان،
بل المحتوى العربي المنشور على الموقع نفسه. المشروع ينشر بالفعل تدوينات بالعربية (مثل
`adawat-almutasaffih-privacy` و`ibqa-aljihaz-mustayqizan-ar` و`tahwil-curl-ila-code-ar`)، والبحث
العربي عن عبارات مثل «ضغط PDF أونلاين» أو «إزالة بيانات EXIF» أو «تحويل PDF إلى Word» تسيطر عليه
مواقع رفع مليئة بالإعلانات. المنافسة هناك أضعف بكثير من المنافسة على الإنجليزية، والعائد أطول
أجلًا من أي منشور في منتدى.
