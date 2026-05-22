export default function Content() {
  return (
    <div>
      <p>
        Откройте любое современное веб-приложение, изучите HTTP-запрос, взгляните на манифест Kubernetes или
        загляните внутрь JWT-токена — Base64 повсюду. Это одна из тех фундаментальных схем кодирования, с которыми
        разработчики сталкиваются постоянно, но редко останавливаются, чтобы полностью её понять. Это руководство
        объясняет, что такое Base64, как он работает на уровне байтов, где используется в реальных системах и когда
        вам стоит (и не стоит) к нему обращаться.
      </p>
      <p>
        Вы можете мгновенно кодировать и декодировать любую строку Base64 с помощью{" "}
        <a href="/tools/base64">кодировщика/декодировщика Base64 BrowseryTools</a> — бесплатно, без регистрации, и
        ничто никогда не покидает ваш браузер.
      </p>

      <h2>Зачем существует Base64?</h2>
      <p>
        Чтобы понять Base64, нужно понять проблему, которую он решает. На заре интернета многие протоколы связи —
        особенно электронная почта — были спроектированы вокруг 7-битного текста ASCII. ASCII определяет 128 символов
        с использованием 7 бит на символ. Двоичные данные (изображения, документы, исполняемые файлы) используют все
        8 бит на байт, порождая байтовые значения, не имевшие представления в ASCII, которые старые системы
        отбрасывали, искажали или интерпретировали как управляющие команды.
      </p>
      <p>
        Стандарту MIME (Multipurpose Internet Mail Extensions), представленному в 1991 году, чтобы позволить почте
        нести вложения, был нужен способ передавать произвольные двоичные данные через эти «7-битно-чистые» каналы.
        Решением было перекодировать двоичные данные с использованием лишь безопасного подмножества печатаемых
        символов ASCII — такого, на котором сходились все системы и который верно передавали. Base64 стал стандартным
        кодированием для этой цели, и название описывает подход: использовать набор из 64 безопасных символов для
        представления любых двоичных данных.
      </p>

      <h2>Алфавит из 64 символов</h2>
      <p>
        Base64 использует ровно 64 символа, поэтому 6 бит входных данных всегда могут быть представлены одним
        символом Base64 (2<sup>6</sup> = 64). Стандартный алфавит, определённый в RFC 4648:
      </p>
      <ul>
        <li>Прописные буквы от <code>A</code> до <code>Z</code> — значения от 0 до 25</li>
        <li>Строчные буквы от <code>a</code> до <code>z</code> — значения от 26 до 51</li>
        <li>Цифры от <code>0</code> до <code>9</code> — значения от 52 до 61</li>
        <li><code>+</code> — значение 62</li>
        <li><code>/</code> — значение 63</li>
      </ul>
      <p>
        65-й символ — знак равенства <code>=</code> — используется как заполнение, но не представляет данные.
        Заполнение гарантирует, что длина закодированного вывода всегда кратна 4 символам, что упрощает
        декодирование.
      </p>

      <h2>Как работает кодирование Base64: 3 байта → 4 символа</h2>
      <p>
        Base64 работает, беря 3 байта входных данных (24 бита) и разбивая их на четыре 6-битные группы. Каждая
        6-битная группа отображается в один символ алфавита Base64. Поскольку 3 байта становятся 4 символами,
        кодирование Base64 увеличивает размер данных ровно на треть (33%).
      </p>
      <p>
        Пройдём по конкретному примеру: кодирование ASCII-строки <code>"Man"</code>.
      </p>
      <p>
        Шаг 1 — преобразуем каждый символ в его байтовое значение ASCII, а затем в двоичный вид:
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Шаг 2 — объединяем 24 бита в один поток:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (concatenate all 24 bits)
010011 010110 000101 101110`}
      </pre>
      <p>
        Шаг 3 — отображаем каждую 6-битную группу в алфавит Base64:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>6-битная группа</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Десятичное значение</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Символ Base64</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Кодирование Base64 для <code>"Man"</code> — это <code>TWFu</code>. Вы можете проверить это с помощью{" "}
        <a href="/tools/base64">инструмента Base64 BrowseryTools</a>. Когда длина входных данных не кратна 3,
        добавляются символы заполнения (<code>=</code> или <code>==</code>), чтобы привести вывод к кратности 4
        символам. Например, <code>"Ma"</code> кодируется как <code>TWE=</code>, а <code>"M"</code>{" "}
        кодируется как <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Распространённое заблуждение:</strong> Base64 — это кодирование, а не шифрование. Процесс полностью
        обратим любым человеком без какого-либо ключа или пароля. То, что вы видите данные в кодировке Base64 в URL,
        заголовке или файле, не означает, что эти данные хоть как-то защищены — это просто другое представление тех
        же байтов. Любой, кто может скопировать строку, мгновенно её декодирует.
      </div>

      <h2>Распространённые сценарии применения</h2>

      <h3>Встраивание изображений в HTML и CSS</h3>
      <p>
        Вместо отдельного HTTP-запроса за маленьким изображением или иконкой вы можете встроить его прямо в HTML или
        CSS как data URI. Браузер декодирует строку Base64 и отрисовывает изображение без обращения к сети. Это
        полезно для маленьких ресурсов вроде favicon, индикаторов загрузки или встроенных иконок в email-шаблонах,
        где загрузка внешних URL может быть заблокирована.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* CSS example — embedding a small PNG icon */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Двоичные данные в JSON-API</h3>
      <p>
        JSON — это текстовый формат. Если API нужно передать двоичные данные — файл, криптографический ключ, подпись,
        изображение — внутри JSON-полезной нагрузки, он не может включить сырые байты. Кодирование двоичных данных в
        Base64 превращает их в обычную строку, которую JSON может нести без проблем. Многие API, возвращающие
        содержимое файлов, аудиосэмплы или изображения в JSON-ответах, используют этот подход.
      </p>

      <h3>HTTP Basic Authentication</h3>
      <p>
        Схема HTTP Basic Auth отправляет учётные данные в заголовке <code>Authorization</code> как кодирование Base64
        от <code>username:password</code>. Например, учётные данные <code>admin:secret</code>{" "}
        становятся строкой <code>YWRtaW46c2VjcmV0</code>, а полный заголовок выглядит так:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        Это не зашифровано — это просто закодировано. Basic Auth всегда нужно использовать поверх HTTPS, никогда по
        обычному HTTP, потому что учётные данные может тривиально декодировать любой, кто перехватит запрос.
      </p>

      <h3>Полезные нагрузки JWT</h3>
      <p>
        JSON Web Tokens кодируют свой заголовок и полезную нагрузку с помощью Base64URL (URL-безопасного варианта,
        описанного ниже). Утверждения токена — ID пользователя, время истечения, роли — хранятся в полезной нагрузке
        как объект JSON в кодировке Base64URL. Опять же, это не шифрование: полезная нагрузка полностью читаема любым,
        у кого есть токен.
      </p>

      <h3>Секреты Kubernetes</h3>
      <p>
        Kubernetes хранит значения Secret как строки в кодировке Base64 в YAML-манифестах. Вот реальный пример Secret
        в Kubernetes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        Чтобы узнать, чем на самом деле являются эти значения, вставьте <code>YWRtaW4=</code> в{" "}
        <a href="/tools/base64">декодировщик Base64 BrowseryTools</a>. Результат — <code>admin</code>. Вставьте{" "}
        <code>cGFzc3dvcmQxMjM=</code> и получите <code>password123</code>. Kubernetes кодирует значения секретов в
        Base64 для безопасного форматирования YAML, а не ради безопасности — реальная безопасность исходит из RBAC
        Kubernetes и шифрования при хранении, а не из самого кодирования.
      </p>

      <h2>Вариант Base64URL</h2>
      <p>
        Стандартный Base64 использует два символа, особых для URL: <code>+</code> (который означает пробел в
        кодировании форм) и <code>/</code> (который является разделителем пути). Когда данным в кодировке Base64
        нужно появиться в URL, параметре запроса или имени файла, эти символы вызывают проблемы.
      </p>
      <p>
        Base64URL решает это заменой:
      </p>
      <ul>
        <li><code>+</code> заменяется на <code>-</code> (дефис)</li>
        <li><code>/</code> заменяется на <code>_</code> (подчёркивание)</li>
        <li>Завершающее заполнение <code>=</code> часто опускается</li>
      </ul>
      <p>
        Base64URL используется в JWT, OAuth-токенах и любом контексте, где закодированная строка должна пережить
        передачу по URL без процентного кодирования. <a href="/tools/base64">Инструмент Base64 BrowseryTools</a>{" "}
        поддерживает оба варианта — стандартный и URL-безопасный.
      </p>

      <h2>Когда НЕ стоит использовать Base64</h2>
      <p>
        Base64 — правильный инструмент в определённых ситуациях, но его часто применяют неверно. Вот когда его стоит
        избегать:
      </p>
      <ul>
        <li>
          <strong>Большие файлы:</strong> Base64 увеличивает размер данных на ~33%. Изображение в 10 МБ становится
          примерно 13,3 МБ при кодировании в Base64. Встраивание больших файлов как data URI или строк Base64 в JSON
          замедляет разбор, увеличивает потребление памяти и тратит трафик. Используйте прямую передачу файлов или
          URL объектного хранилища для всего сколько-нибудь нетривиального по размеру.
        </li>
        <li>
          <strong>Безопасность:</strong> никогда не используйте Base64 как меру безопасности. Он обеспечивает нулевую
          конфиденциальность. Если данные чувствительны, используйте настоящее шифрование (AES-GCM, RSA и т. д.).
        </li>
        <li>
          <strong>Хранение:</strong> хранение двоичных данных как Base64 в столбце БД тратит на 33% больше места по
          сравнению с хранением сырых байтов в двоичном столбце. Используйте нативные двоичные типы БД (BYTEA в
          PostgreSQL, BLOB в MySQL) при хранении двоичных данных в масштабе.
        </li>
      </ul>

      <h2>Base64 против шестнадцатеричного кодирования: сравнение</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Свойство</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hex (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Набор символов</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 символа)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 символов)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Накладные расходы по размеру</strong></td>
              <td style={{padding: "12px 16px"}}>~33% больше</td>
              <td style={{padding: "12px 16px"}}>~100% больше (2 символа на байт)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Читаемость человеком</strong></td>
              <td style={{padding: "12px 16px"}}>Низкая — не распознаётся</td>
              <td style={{padding: "12px 16px"}}>Умеренная — читаема на уровне байтов</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Частые сценарии применения</strong></td>
              <td style={{padding: "12px 16px"}}>Вложения почты, JWT, data URI, полезные нагрузки API</td>
              <td style={{padding: "12px 16px"}}>Криптографические хеши, контрольные суммы, цветовые коды, MAC-адреса</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>URL-безопасно?</strong></td>
              <td style={{padding: "12px 16px"}}>Только с вариантом Base64URL</td>
              <td style={{padding: "12px 16px"}}>Да — все символы URL-безопасны</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Бит на символ</strong></td>
              <td style={{padding: "12px 16px"}}>6 бит</td>
              <td style={{padding: "12px 16px"}}>4 бита</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Используйте Base64, когда нужно компактное кодирование двоичных данных в текст и широта набора символов не
        создаёт проблем. Используйте hex, когда важен ручной осмотр отдельных байтовых значений — дайджесты хешей,
        контрольные суммы и криптографические выводы традиционно отображаются в hex именно потому, что каждый
        hex-символ напрямую соответствует 4 битам, делая границы байтов тривиально видимыми.
      </p>

      <h2>Кодирование и декодирование Base64 в коде</h2>
      <p>
        Большинство языков предоставляют встроенную поддержку Base64. Вот быстрые однострочники для распространённых
        окружений:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser or Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        Для быстрого разового кодирования или декодирования без написания кода <a href="/tools/base64">инструмент
        Base64 BrowseryTools</a> — самый быстрый вариант: вставьте строку, выберите кодирование или декодирование, и
        результат появится мгновенно. Ничто не отправляется на сервер.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Гарантия приватности:</strong> кодировщик и декодировщик Base64 BrowseryTools обрабатывает всё
        локально в вашем браузере с помощью JavaScript. Если вы кодируете чувствительные данные — ключи API, секреты,
        приватную конфигурацию — они никогда не касаются сервера. Ваши данные остаются на вашем устройстве.
      </div>

      <h2>Кодируйте и декодируйте Base64 мгновенно</h2>
      <p>
        Декодируете ли вы секрет Kubernetes, изучаете полезную нагрузку JWT, создаёте data URI для встроенного
        изображения или просто любопытствуете, что содержит строка Base64 — <a href="/tools/base64">кодировщик/декодировщик
        Base64 BrowseryTools</a> справится с этим в один клик. Вставьте ввод, получите вывод. Без рекламы, без
        регистрации, без отправки данных с вашего устройства.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Бесплатный кодировщик / декодировщик Base64 — работает на 100% в вашем браузере
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Открыть инструмент Base64 →
        </a>
      </div>
    </div>
  );
}
