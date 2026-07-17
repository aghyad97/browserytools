import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div dir="rtl">
      <p>
        وجدت نداء الـ API الذي تحتاجه — لكنه مكتوب بـ cURL، وأنت تعمل بـ JavaScript أو Python. أو فتحت أدوات
        مطوّري المتصفح، ونقرت بزر الفأرة الأيمن على طلب، واخترت &laquo;Copy as cURL&raquo;، والآن لديك جدار من
        الأعلام (flags) عليك تحويله إلى كود حقيقي. ترجمة cURL يدوياً عمل دقيق ومتعب: كل <code>-H</code>{" "}
        و<code>-d</code> و<code>-u</code> و<code>-X</code> يجب أن يُربط بالوسيط الصحيح في لغتك، وترويسة واحدة
        مفقودة تكسر الطلب.
      </p>
      <ToolCTA slug="curl-converter" variant="inline" />
      <p>
        أداة <a href="/tools/curl-converter">محوّل cURL من BrowseryTools</a> تفعل ذلك فوراً — الصق أمر cURL
        واحصل على كود نظيف بـ JavaScript <code>fetch</code> وPython <code>requests</code> وNode.js والمزيد،
        كل ذلك في متصفحك دون رفع أي شيء. يوضّح هذا الدليل ربط الأعلام بالكود كي تقرأ المخرجات وتثق بها.
      </p>

      <h2>سير عمل &laquo;Copy as cURL&raquo;</h2>
      <p>
        أسرع طريقة للحصول على طلب يعمل هي أن تدع المتصفح يكتبه لك. افتح أدوات المطوّر (F12)، اذهب إلى تبويب{" "}
        <strong>Network</strong>، نفّذ الإجراء الذي تريد تكراره، ثم انقر بزر الفأرة الأيمن على الطلب واختر{" "}
        <strong>Copy &rarr; Copy as cURL</strong>. الآن لديك أمر cURL بنفس الترويسات وملفات تعريف الارتباط
        والجسم الذي أرسله الموقع الحقيقي. الصقه في{" "}
        <a href="/tools/curl-converter">المحوّل</a> فتحصل على الطلب نفسه ككود تُسقطه في مشروعك.
      </p>

      <h2>كيف تُربط أعلام cURL بالكود</h2>
      <p>
        حالما تعرف الأعلام القليلة المهمة، يمكنك قراءة أي أمر cURL بنظرة واحدة:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8, direction: "ltr", textAlign: "left"}}>
{`-X POST          ->  أسلوب HTTP
-H "Key: Value"  ->  ترويسة الطلب
-d '{...}'       ->  جسم الطلب (يعني POST)
-u user:pass     ->  مصادقة HTTP Basic
-F field=value   ->  رفع متعدد الأجزاء
-b "name=value"  ->  ملف تعريف ارتباط
-L               ->  اتبع التحويلات`}
      </pre>
      <p>
        ترويسة مثل <code>-H &quot;Authorization: Bearer abc123&quot;</code> تصبح مدخلاً في كائن{" "}
        <code>headers</code>. والجسم المُمرّر بـ <code>-d</code> يصبح جسم الطلب، وإن كان نوع المحتوى JSON
        يُسلسَل وفقاً لذلك. و<code>-u user:pass</code> يصبح ترويسة Basic. معرفة هذا الربط هي ما يتيح لك التحقّق
        من الكود المُولّد بدل الوثوق به أعمى.
      </p>

      <h2>الطلب نفسه بثلاث لغات</h2>
      <p>
        خذ طلب POST مصادَقاً بسيطاً. بـ cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>بـ JavaScript <code>fetch</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Ada" }),
});`}
      </pre>
      <p>بـ Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        لاحظ كيف يضبط وسيط <code>json=</code> في Python الجسم <em>وترويسة</em> Content-Type تلقائياً — فرق
        اصطلاحي صغير يتولّاه المحوّل عنك.
      </p>

      <h2>مزالق شائعة</h2>
      <p>
        <strong>الاقتباس والتهريب.</strong> أجسام cURL تُحاط بعلامات اقتباس مفردة في الصدفة؛ وحين تحتوي على
        JSON بعلامات اقتباس مزدوجة، تتسلّل الأخطاء أثناء الترجمة اليدوية. ترك محوّل يحللها يزيل هذا الخطر.
      </p>
      <p>
        <strong>POST الضمني.</strong> استخدام <code>-d</code> يجعل الطلب POST حتى دون <code>-X POST</code>. إن
        ترجمت الأعلام الظاهرة فقط فقد تنتج GET خطأً.
      </p>
      <p>
        <strong>الأسرار في الأمر.</strong> الطلب المنسوخ غالباً يحتوي رموزاً وملفات ارتباط حيّة. ولأن المحوّل
        يعمل كلياً في متصفحك، لا تُرسل تلك الأسرار إلى خادم — لكن عليك مع ذلك مسحها قبل لصق الكود في مستودع
        مشترك أو تذكرة.
      </p>

      <h2>أسئلة شائعة</h2>
      <p>
        <strong>إلى أي لغات يمكنني التحويل؟</strong> JavaScript fetch، وPython requests، وNode.js، وأهداف
        شائعة أخرى.
      </p>
      <p>
        <strong>هل يرسل المحوّل أمري إلى أي مكان؟</strong> لا. التحليل والتحويل يجريان محلياً في متصفحك، فأي
        رموز في الأمر تبقى على جهازك.
      </p>
      <p>
        <strong>هل يمكنني لصق &laquo;Copy as cURL&raquo; من أدوات المطوّر؟</strong> نعم — وهو من أفضل
        الاستخدامات؛ فهو يلتقط ترويسات وجسم الطلب الحقيقي بالضبط.
      </p>
      <p>
        <strong>هل هي مجانية؟</strong> نعم — بدون حساب، بدون حدود.
      </p>

      <h2>حوّل الآن</h2>
      <p>
        افتح <a href="/tools/curl-converter">محوّل cURL</a>، الصق أمرك، وانسخ الكود المكافئ. ولنظرة أعمق إلى
        أدوات المطوّرين في المتصفح، اطّلع على{" "}
        <a href="/blog/adawat-almutawwirin-arabi">دليل أدوات المطوّرين</a>.
      </p>
      <ToolCTA slug="curl-converter" variant="card" />
    </div>
  );
}
