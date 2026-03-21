export default function Content() {
  return (
    <div dir="rtl">
      <p>
        التعابير النمطية (Regular Expressions) هي واحدة من أقوى الأدوات في ترسانة أي مطور، وفي نفس
        الوقت واحدة من أكثر الأشياء التي يتجنبها المبتدئون بسبب مظهرها المخيف. سطر مثل{" "}
        <code>^[\w.-]+@[\w.-]+\.\w{"{2,}"}$</code> يبدو كطلاسم لمن لم يدرسها، لكن بمجرد أن تفهم
        المنطق وراءها، ستجد نفسك تستخدمها بشكل طبيعي في العمل اليومي.
      </p>
      <p>
        هذا الدليل مصمم للمبتدئين. سنبدأ من الصفر ونبني المفاهيم تدريجياً، مع أمثلة عملية يمكنك
        اختبارها فوراً في{" "}
        <a href="/tools/regex-tester">أداة Regex Tester</a> — مجانية تماماً، بدون تسجيل، وتعمل
        بالكامل في متصفحك.
      </p>

      <h2>ما هي Regular Expressions ولماذا تحتاجها؟</h2>
      <p>
        التعبير النمطي هو نمط (pattern) يصف مجموعة من النصوص. عند تطبيقه على نص معين، يمكنه:
      </p>
      <ul>
        <li><strong>التحقق (Validation)</strong> — هل هذا النص يطابق النمط؟ (مثال: هل هذا بريد إلكتروني صالح؟)</li>
        <li><strong>البحث (Search)</strong> — أوجد كل الأجزاء التي تطابق النمط في هذا النص.</li>
        <li><strong>الاستخراج (Extract)</strong> — احصل على الأجزاء المطابقة كنتيجة.</li>
        <li><strong>الاستبدال (Replace)</strong> — استبدل كل تطابق بنص آخر.</li>
      </ul>
      <p>
        Regex متاح في كل لغة برمجة رئيسية: JavaScript، Python، PHP، Java، Ruby، Go، وحتى في
        محررات النصوص مثل VS Code. تعلمه مرة واحدة يخدمك في كل بيئة.
      </p>

      <h2>الرموز الأساسية: البناء اللبنة</h2>

      <h3>الأحرف الحرفية (Literal Characters)</h3>
      <p>
        أبسط regex هو كلمة عادية. النمط <code>hello</code> يطابق أي نص يحتوي على "hello".
        لا تعقيد هنا.
      </p>

      <h3>النقطة . (أي حرف)</h3>
      <p>
        النقطة تطابق أي حرف واحد ما عدا السطر الجديد:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`Pattern: c.t
Matches: "cat", "cot", "cut", "c3t", "c_t"
No match: "ct" (nothing between c and t)`}
      </pre>

      <h3>المحددات الكمية (Quantifiers): * + ? {"{}"}</h3>
      <ul>
        <li><code>*</code> — صفر مرات أو أكثر</li>
        <li><code>+</code> — مرة واحدة أو أكثر</li>
        <li><code>?</code> — صفر أو مرة واحدة (يجعل العنصر اختيارياً)</li>
        <li><code>{"{3}"}</code> — عدد محدد بالضبط (3 مرات)</li>
        <li><code>{"{2,5}"}</code> — بين عددين (من 2 إلى 5 مرات)</li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`Pattern: colou?r
Matches: "color" and "colour"
(the 'u' is optional with ?)`}
      </pre>

      <h3>المرساة (Anchors): ^ و $</h3>
      <p>
        المراسي تحدد موقع التطابق في النص:
      </p>
      <ul>
        <li><code>^</code> — بداية النص أو السطر</li>
        <li><code>$</code> — نهاية النص أو السطر</li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`Pattern: ^hello$
Matches: "hello" (exactly, nothing before or after)
No match: "say hello" or "hello world"`}
      </pre>

      <h3>مجموعات الأحرف (Character Classes): []</h3>
      <p>
        الأقواس المربعة تحدد مجموعة من الأحرف المقبولة في موقع واحد:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`[aeiou]    → أي حرف علة
[0-9]      → أي رقم من 0 إلى 9
[a-z]      → أي حرف إنجليزي صغير
[A-Za-z]   → أي حرف إنجليزي
[^0-9]     → أي شيء ليس رقماً (^ داخل [] يعني النفي)`}
      </pre>

      <h3>الاختصارات الشائعة</h3>
      <ul>
        <li><code>\d</code> — أي رقم (مكافئ لـ [0-9])</li>
        <li><code>\w</code> — أي حرف كلمة: حروف، أرقام، أو underscore</li>
        <li><code>\s</code> — أي مسافة بيضاء: space، tab، أو newline</li>
        <li><code>\D، \W، \S</code> — عكس ما سبق (حرف كبير = نفي)</li>
      </ul>

      <h2>أمثلة عملية من الحياة الواقعية</h2>

      <h3>التحقق من البريد الإلكتروني</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`Pattern: ^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$

Test: "user@example.com"  → ✓ match
Test: "user@.com"         → ✗ no match
Test: "user.name@co.uk"   → ✓ match`}
      </pre>

      <h3>التحقق من رقم الهاتف (دولي)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`Pattern: ^\\+?[1-9]\\d{7,14}$

Matches: "+971501234567", "00971501234567"
No match: "abc", "123" (too short)`}
      </pre>

      <h3>استخراج الروابط من نص</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`Pattern: https?://[\\w./%-]+

Extracts all URLs from any text block`}
      </pre>

      <h2>Regex في JavaScript وPython</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7, direction: "ltr", textAlign: "left"}}>
{`// JavaScript
const emailRegex = /^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$/;
emailRegex.test("user@example.com"); // true

const text = "Contact us at info@site.com or help@app.io";
const emails = text.match(/[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}/g);
// ["info@site.com", "help@app.io"]

# Python
import re
pattern = r"^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$"
bool(re.match(pattern, "user@example.com"))  # True

emails = re.findall(r"[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}", text)`}
      </pre>

      <h2>أخطاء شائعة للمبتدئين</h2>
      <ul>
        <li>
          <strong>نسيان الـ escape</strong> — أحرف مثل <code>.</code> و<code>*</code> و<code>+</code>{" "}
          لها معنى خاص. إذا أردت تطابق النقطة الحرفية، استخدم <code>\.</code>
        </li>
        <li>
          <strong>Greedy بدلاً من Lazy</strong> — افتراضياً <code>.*</code> يأكل أكبر قدر ممكن.
          استخدم <code>.*?</code> للحصول على أقل تطابق ممكن.
        </li>
        <li>
          <strong>نسيان الـ flags</strong> — بدون flag <code>g</code> في JavaScript، تحصل فقط على
          أول تطابق. بدون <code>i</code>، الحروف الكبيرة والصغيرة مختلفة.
        </li>
        <li>
          <strong>Catastrophic Backtracking</strong> — بعض أنماط Regex يمكن أن تتسبب في بطء شديد
          جداً مع نصوص معينة. اختبر دائماً مع نصوص حافة قبل النشر.
        </li>
      </ul>

      <h2>كيف تختبر Regex بأمان في المتصفح</h2>
      <p>
        الطريقة الأسرع لتعلم Regex وتصحيح أخطائها هي رؤية النتائج الفورية. افتح{" "}
        <a href="/tools/regex-tester">أداة Regex Tester</a>، اكتب النمط في الحقل الأول،
        والنص التجريبي في الحقل الثاني، وسترى التطابقات مُظللة بشكل فوري مع كل تعديل. هذا
        النهج يسرع التعلم بشكل كبير — بدلاً من تشغيل سكريبت في Terminal مرات عديدة، تحصل على
        تغذية راجعة لحظية تساعدك على فهم سلوك النمط بدقة.
      </p>
    </div>
  );
}
