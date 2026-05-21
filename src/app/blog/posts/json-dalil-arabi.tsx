export default function Content() {
  return (
    <div dir="rtl">
      <p>
        إذا كنت تكتب أي كود يتعامل مع بيانات — سواء كان تطبيق ويب، أو موبايل، أو سكريبت بسيط — فأنت
        تتعامل مع JSON بشكل شبه يومي. هذا التنسيق أصبح اللغة المشتركة لتبادل البيانات في الإنترنت
        الحديث. فهمه جيداً يوفر عليك ساعات من تصحيح الأخطاء.
      </p>
      <p>
        يمكنك تطبيق كل ما ستتعلمه هنا مباشرةً باستخدام{" "}
        <a href="/tools/json-formatter">أداة JSON Formatter</a> — مجانية تماماً، بدون تسجيل،
        وتعمل بالكامل في متصفحك دون رفع بياناتك لأي سيرفر.
      </p>

      <h2>ما هو JSON؟</h2>
      <p>
        JSON اختصار لـ JavaScript Object Notation. اخترعه Douglas Crockford في مطلع الألفية الثانية
        كطريقة خفيفة لتمثيل البيانات المنظمة. رغم أن الاسم يحتوي على "JavaScript"، إلا أن JSON
        متاح في كل لغة برمجة تقريباً: Python، Java، PHP، Ruby، Go، Rust وغيرها. التنسيق مستقل
        تماماً عن أي لغة.
      </p>
      <p>
        قبل JSON، كان XML هو المعيار السائد لتبادل البيانات. لكن XML ثقيل: يحتاج tags افتتاحية
        وختامية، وحجمه كبير مقارنة بالبيانات الفعلية. جاء JSON بتنسيق أبسط وأخف، وانتشر بسرعة
        هائلة خاصةً مع صعود REST APIs والتطبيقات أحادية الصفحة (SPA).
      </p>

      <h2>قواعد بناء JSON: الأساسيات</h2>
      <p>
        JSON له قواعد صارمة. مخالفة أي منها تجعل الملف غير صالح (invalid). هذه هي القواعد الجوهرية:
      </p>

      <h3>الأنواع المدعومة</h3>
      <ul>
        <li><strong>String</strong> — نص بين علامتي اقتباس مزدوجة: <code>"مرحبا"</code> أو <code>"hello"</code></li>
        <li><strong>Number</strong> — أرقام صحيحة أو عشرية: <code>42</code> أو <code>3.14</code></li>
        <li><strong>Boolean</strong> — قيمتان فقط: <code>true</code> أو <code>false</code></li>
        <li><strong>null</strong> — قيمة فارغة: <code>null</code></li>
        <li><strong>Array</strong> — مصفوفة من القيم: <code>[1, 2, 3]</code></li>
        <li><strong>Object</strong> — مجموعة من أزواج المفتاح-القيمة: <code>{"{"}"name": "Ali"{"}"}</code></li>
      </ul>

      <h3>مثال على JSON صالح</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`{
  "user": {
    "id": 1042,
    "name": "أحمد العمري",
    "email": "ahmed@example.com",
    "isActive": true,
    "score": 98.5,
    "tags": ["developer", "designer"],
    "address": null
  }
}`}
      </pre>

      <h2>أخطاء JSON الشائعة وكيف تصلحها</h2>
      <p>
        معظم أخطاء JSON تنتمي لفئات محدودة. إليك الأكثر شيوعاً:
      </p>

      <h3>1. فاصلة زائدة (Trailing Comma)</h3>
      <p>
        هذا الخطأ شائع جداً للمطورين القادمين من JavaScript أو Python حيث تُقبل الفاصلة الأخيرة:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`// خطأ — فاصلة بعد آخر عنصر
{
  "name": "Ali",
  "age": 30,
}

// صحيح
{
  "name": "Ali",
  "age": 30
}`}
      </pre>

      <h3>2. استخدام علامات اقتباس مفردة</h3>
      <p>
        JSON يقبل فقط علامات الاقتباس المزدوجة للمفاتيح والقيم النصية. علامات الاقتباس المفردة
        صالحة في JavaScript لكن ليس في JSON:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`// خطأ
{ 'name': 'Ali' }

// صحيح
{ "name": "Ali" }`}
      </pre>

      <h3>3. مفاتيح بدون علامات اقتباس</h3>
      <p>
        في JavaScript يمكن كتابة مفاتيح الـ objects بدون اقتباس، لكن في JSON كل مفتاح يجب أن
        يكون string:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`// خطأ
{ name: "Ali" }

// صحيح
{ "name": "Ali" }`}
      </pre>

      <h3>4. قيم undefined</h3>
      <p>
        <code>undefined</code> غير موجود في JSON. إذا كانت القيمة غائبة، استخدم <code>null</code>
        أو احذف المفتاح كلياً.
      </p>

      <h2>JSON مقابل XML: لماذا انتصر JSON؟</h2>
      <p>
        الفرق واضح عند مقارنة نفس البيانات في التنسيقين:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`<!-- XML - 180 characters -->
<user>
  <id>1042</id>
  <name>Ahmed</name>
  <active>true</active>
</user>

// JSON - 52 characters
{"id":1042,"name":"Ahmed","active":true}`}
      </pre>
      <p>
        JSON أخف، أسهل في القراءة، وأسرع في التحليل (parsing). أيضاً يتكامل بشكل طبيعي مع
        JavaScript لأنه يُحول مباشرةً إلى objects باستخدام <code>JSON.parse()</code>.
      </p>

      <h2>استخدام JSON في APIs</h2>
      <p>
        أغلب REST APIs الحديثة تُرسل وتستقبل البيانات بتنسيق JSON. عندما تُرسل طلب HTTP، تضع
        Content-Type header كـ <code>application/json</code>، وعندما تستقبل الرد، تحوله لـ object
        باستخدام:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`// JavaScript
const response = await fetch('/api/users/1042');
const user = await response.json(); // تحويل JSON تلقائياً
console.log(user.name); // "Ahmed"

// Python
import requests, json
res = requests.get('/api/users/1042')
user = res.json()
print(user['name'])  # "Ahmed"`}
      </pre>

      <h2>تنسيق وضغط JSON</h2>
      <p>
        JSON يأتي في شكلين: <strong>مُنسَّق (pretty-printed)</strong> مع مسافات بادئة لسهولة
        القراءة، أو <strong>مضغوط (minified)</strong> بدون مسافات زائدة لتقليل حجم البيانات.
        في الإنتاج يُفضل الضغط لتوفير bandwidth، أما عند التطوير والتصحيح فالتنسيق أوضح.
      </p>
      <p>
        استخدم <a href="/tools/json-formatter">أداة JSON Formatter</a> للتنقل بين الصيغتين
        فورياً، والتحقق من صحة JSON قبل استخدامه، مع عرض أي أخطاء بدقة في السطر المحدد.
        البيانات لا تغادر متصفحك — آمن تماماً حتى لملفات JSON التي تحتوي على بيانات إنتاج حساسة.
      </p>
    </div>
  );
}
