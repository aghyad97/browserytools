import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        У каждого разработчика накапливается мысленный список излюбленных сайтов для быстрых задач: декодировать ту строку Base64, проверить этот JSON, узнать, что на самом деле содержит тот JWT. Проблема в том, что этот список обычно включает с десяток разных сайтов — у каждого свои баннеры cookie, предложения зарегистрироваться и вопросы к конфиденциальности.
      </p>

      <p>
        <strong>BrowseryTools</strong> объединяет самые необходимые утилиты для разработчиков в единый, быстрый набор с приоритетом конфиденциальности. Всё работает локально в вашем браузере. Без загрузок. Без ключей API. Без ограничений по запросам. Это руководство проходит по каждому инструменту и показывает, когда именно и зачем вы к нему обратитесь.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Почему браузерные инструменты лучше npm-пакетов и облачных API:</strong> Установка npm-пакета занимает время, добавляет узлы в дерево зависимостей, требует наличия Node.js и может содержать уязвимости безопасности в своей цепочке зависимостей. Облачные API требуют аутентификации, имеют ограничения по запросам и вносят задержку. Браузерный инструмент мгновенен, не имеет зависимостей и работает одинаково на любой машине.
      </div>

      <h2>Форматировщик и валидатор JSON</h2>

      <p>
        JSON — это лингва франка современных API. Когда вы смотрите на минифицированный 3-килобайтный фрагмент, возвращённый эндпоинтом, <Link href="/tools/json-formatter">Форматировщик JSON</Link> делает его мгновенно читаемым.
      </p>

      <h3>Что он делает</h3>
      <ul>
        <li><strong>Форматирование и красивый вывод:</strong> Берёт компактный JSON и добавляет отступы и переносы строк</li>
        <li><strong>Валидация:</strong> Указывает на синтаксические ошибки с точной строкой и позицией символа</li>
        <li><strong>Минификация:</strong> Удаляет все пробелы, чтобы получить компактный JSON для полезной нагрузки</li>
        <li><strong>Древовидный вид:</strong> Исследуйте вложенные объекты и массивы в сворачиваемом дереве</li>
      </ul>

      <h3>Типичные сценарии</h3>
      <p>Вставьте ответ API из терминала, чтобы понять его структуру:</p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Raw curl output
curl -s https://api.example.com/user/42

# Minified response that's hard to read:
{"id":42,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}

# Paste into BrowseryTools JSON Formatter → instantly readable:
{
  "id": 42,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "meta": {
    "created": "2024-01-01",
    "active": true
  }
}`}</code></pre>

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Форматировщик JSON →</Link>

      <h2>Кодировщик / декодер Base64</h2>

      <p>
        Кодирование Base64 встречается повсюду: вложения электронной почты (MIME), встраивание изображений в CSS, кодирование двоичных данных для API и хранение учётных данных в конфигурационных файлах. <Link href="/tools/base64">Инструмент Base64</Link> справляется как с кодированием, так и с декодированием с поддержкой стандартного Base64 и URL-безопасного варианта Base64.
      </p>

      <h3>Когда он нужен</h3>
      <ul>
        <li>Декодирование заголовка <code>Authorization: Basic ...</code>, чтобы увидеть username:password</li>
        <li>Кодирование изображения для встраивания прямо в CSS <code>url()</code> или атрибут <code>src</code> в HTML</li>
        <li>Просмотр значений конфигурации, закодированных в Base64, в секретах Kubernetes</li>
        <li>Кодирование двоичной полезной нагрузки для REST API, которые не принимают сырые байты</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть кодировщик/декодер Base64 →</Link>

      <h2>Декодер JWT</h2>

      <p>
        JSON Web Tokens используются для аутентификации практически в каждом современном веб-приложении. Когда с авторизацией что-то идёт не так — истёкший токен, отсутствующая claim, неожиданная аудитория — вам нужно осмотреть токен <em>прямо сейчас</em>, а не писать для этого скрипт.
      </p>

      <p>
        <Link href="/tools/jwt-decoder">Декодер JWT</Link> принимает строку JWT и сразу отображает декодированный заголовок, полезную нагрузку и статус проверки подписи. Он подсвечивает время истечения (claim <code>exp</code>), время выпуска (<code>iat</code>) и сообщает, действителен ли токен сейчас, истёк он или ещё не вступил в силу.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Заметка по безопасности:</strong> Никогда не вставляйте продакшен-токены JWT в неизвестный сторонний декодер — эти токены представляют активные сессии пользователей. BrowseryTools декодирует JWT целиком в вашем браузере с помощью строковых операций Base64. Токен никогда не покидает ваше устройство, что делает его единственным безопасным выбором для осмотра токенов из боевых сред.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Декодер JWT →</Link>

      <h2>Генератор UUID</h2>

      <p>
        Универсальные уникальные идентификаторы (UUID) необходимы для первичных ключей баз данных, ключей идемпотентности, корреляционных идентификаторов и проектирования распределённых систем. <Link href="/tools/uuid-generator">Генератор UUID</Link> создаёт криптографически случайные UUID версии v4 с помощью <code>crypto.randomUUID()</code> — встроенного в браузер API, который выдаёт по-настоящему случайные идентификаторы, а не псевдослучайные.
      </p>

      <h3>Сценарии использования</h3>
      <ul>
        <li>Генерация тестовых идентификаторов БД во время разработки без обращения к базе данных</li>
        <li>Создание ключей идемпотентности для запросов к платёжным API</li>
        <li>Массовая генерация UUID для seed-данных или файлов фикстур</li>
        <li>Создание корреляционных идентификаторов для распределённой трассировки при отладке</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Генератор UUID →</Link>

      <h2>Генератор хешей</h2>

      <p>
        Криптографическое хеширование используется для контрольных сумм, хранения паролей (никогда в открытом виде!), контентно-адресуемого хранилища и проверки целостности данных. <Link href="/tools/hash-generator">Генератор хешей</Link> вычисляет хеши MD5, SHA-1, SHA-256 и SHA-512 с помощью встроенного в браузер API <code>crypto.subtle.digest()</code> — той же базовой реализации, которую использует ваша ОС.
      </p>

      <h3>Когда разработчики к нему обращаются</h3>
      <ul>
        <li>Проверка контрольной суммы скачанного файла относительно опубликованного хеша</li>
        <li>Вычисление SHA-256 от тела запроса API для AWS Signature Version 4</li>
        <li>Генерация значения ETag для статического ресурса</li>
        <li>Создание хеша контента для сброса кеша (cache-busting) в пайплайнах сборки</li>
        <li>Проверка идентичности двух больших текстовых блоков без посимвольного сравнения</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Генератор хешей →</Link>

      <h2>Тестер регулярных выражений</h2>

      <p>
        Регулярные выражения мощны и общеизвестно трудны для правильного написания под давлением. <Link href="/tools/regex-tester">Тестер регулярных выражений</Link> даёт вам среду реального времени: по мере того как вы вводите шаблон и тестовую строку, совпадения подсвечиваются мгновенно. Он поддерживает все флаги регулярных выражений JavaScript (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>, <code>u</code>) и показывает захваченные группы в структурированном виде.
      </p>

      <h3>Практические примеры</h3>
      <ul>
        <li>Валидация адресов электронной почты, телефонных номеров или почтовых индексов для очистки ввода форм</li>
        <li>Написание шаблонов разбора логов для извлечения структурированных данных</li>
        <li>Тестирование шаблонов маршрутизации URL перед фиксацией их в конфигурации Express или Next.js</li>
        <li>Создание совместимых с sed/awk шаблонов без терминала</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Тестер регулярных выражений →</Link>

      <h2>Кодировщик / декодер URL</h2>

      <p>
        URL могут содержать только ограниченный набор ASCII-символов. Специальные символы — пробелы, амперсанды, знаки равенства, не-ASCII текст — должны кодироваться через percent-encoding. <Link href="/tools/url-encoder">Кодировщик/декодер URL</Link> работает в обоих направлениях и различает <code>encodeURI</code> (кодирует полный URL, сохраняя структурные символы) и <code>encodeURIComponent</code> (кодирует значение параметра URL, кодируя всё).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть кодировщик/декодер URL →</Link>

      <h2>Конвертер YAML ↔ JSON</h2>

      <p>
        Конфигурационные файлы часто приходят в YAML (манифесты Kubernetes, рабочие процессы GitHub Actions, чарты Helm, Docker Compose), тогда как API и код работают с JSON. <Link href="/tools/yaml-json">Конвертер YAML ↔ JSON</Link> мгновенно переводит между обоими форматами, сохраняя типы, вложенные структуры и порядок элементов массива.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# YAML input (Kubernetes deployment snippet):
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api

// JSON output:
{
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "api" } },
    "template": { "metadata": { "labels": { "app": "api" } } }
  }
}`}</code></pre>

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Конвертер YAML ↔ JSON →</Link>

      <h2>Парсер выражений Cron</h2>

      <p>
        Выражения cron лаконичны, но загадочны. Одна ошибка в расписании cron может означать, что задача запускается каждую минуту вместо раза в месяц. <Link href="/tools/cron-parser">Парсер Cron</Link> переводит любое cron-выражение на простой язык, показывает следующие 10 запланированных запусков и проверяет выражение на соответствие стандартному и расширенному форматам cron.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Парсер Cron →</Link>

      <h2>Конвертер систем счисления</h2>

      <p>
        Системным программистам, разработчикам встраиваемых систем и всем, кто работает близко к железу, регулярно нужно конвертировать между двоичной, восьмеричной, десятичной и шестнадцатеричной системами. <Link href="/tools/number-base-converter">Конвертер систем счисления</Link> конвертирует между всеми четырьмя системами одновременно и обрабатывает как целые, так и большие числа.
      </p>

      <h3>Типичные сценарии</h3>
      <ul>
        <li>Конвертация адресов памяти из hex в десятичную для сравнения</li>
        <li>Понимание значений битовых масок, глядя на них в двоичном виде</li>
        <li>Декодирование прав доступа к файлам Unix, записанных в восьмеричной системе (<code>chmod 755</code> → двоичное <code>111 101 101</code>)</li>
        <li>Работа со значениями цвета: hex в HTML <code>#FF6B35</code> → десятичные компоненты RGB</li>
        <li>Отладка последовательностей байтов протокола в сетях или прошивках встраиваемых систем</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Открыть Конвертер систем счисления →</Link>

      {/* Summary table */}
      <h2>Краткий справочник: все инструменты для разработчиков в одном месте</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Инструмент</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Основной сценарий</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Ключевая технология</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Форматировщик JSON", "Форматирование, валидация, минификация JSON", "JSON.parse / JSON.stringify"],
              ["Кодировщик/декодер Base64", "Кодирование/декодирование строк Base64", "btoa() / atob()"],
              ["Декодер JWT", "Осмотр заголовка, нагрузки и срока JWT", "Base64 string parsing"],
              ["Генератор UUID", "Генерация UUID версии v4", "crypto.randomUUID()"],
              ["Генератор хешей", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Тестер регулярных выражений", "Тестирование и отладка регулярных выражений", "JavaScript RegExp engine"],
              ["Кодировщик/декодер URL", "Кодирование/декодирование компонентов URL", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Конвертация между YAML и JSON", "js-yaml library (local)"],
              ["Парсер Cron", "Объяснение и валидация cron-выражений", "cron-parser (local)"],
              ["Конвертер систем счисления", "Двоичная, восьмеричная, десятичная, hex", "parseInt() / toString()"],
            ].map(([tool, use, tech], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{tool}</td>
                <td style={{padding: "11px 16px"}}>{use}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", opacity: 0.75}}>{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Почему BrowseryTools вместо npm-пакетов или облачных API?</h2>

      <p>
        Честное сравнение: когда стоит использовать BrowseryTools, а когда — установить пакет или вызвать API?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>npm-пакет</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Требует установленного Node.js</li>
            <li>Добавляет узлы в дерево зависимостей</li>
            <li>Потенциальный риск цепочки поставок</li>
            <li>Лучше всего для: продакшен-кода</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Облачный API</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Требует настройки ключа API</li>
            <li>Действуют ограничения по запросам</li>
            <li>Данные покидают ваше устройство</li>
            <li>Лучше всего для: автоматизированных пайплайнов</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Нулевая настройка, работает мгновенно</li>
            <li>Без зависимостей</li>
            <li>Данные остаются локально</li>
            <li>Лучше всего для: ручных задач разработки</li>
          </ul>
        </div>
      </div>

      <p>
        Ответ таков: используйте BrowseryTools для <em>ручных, исследовательских, разовых задач</em>, которые писать в виде скрипта было бы излишним. Декодировать JWT, чтобы отладить проблему с авторизацией, отформатировать ответ API, чтобы понять его форму, сгенерировать UUID для разового теста — это именно те моменты, когда быстрый браузерный инструмент без трения экономит 10 минут настройки ради 10-секундной задачи.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Совет для разработчиков:</strong> Добавьте <code>browserytools.com</code> в закладки рядом с инструментами разработчика вашего браузера. Когда вы в разгаре отладки и вам нужно быстро декодировать, захешировать, отформатировать или сконвертировать что-то, наличие этих инструментов в соседней вкладке означает, что вы можете оставаться в потоке вместо переключения контекста на написание одноразового скрипта.
      </div>

      <h2>Не только инструменты для разработчиков: больше утилит BrowseryTools</h2>

      <p>
        BrowseryTools охватывает гораздо больше, чем утилиты для разработчиков. Тот же подход с приоритетом конфиденциальности и без загрузок применим к:
      </p>

      <ul>
        <li><strong>Инструменты для изображений:</strong> <Link href="/tools/image-compression">Сжатие изображений</Link>, <Link href="/tools/bg-removal">ИИ-удаление фона</Link>, <Link href="/tools/image-resizer">изменение размера</Link>, <Link href="/tools/image-converter">конвертация форматов</Link></li>
        <li><strong>Текстовые инструменты:</strong> <Link href="/tools/markdown-editor">Редактор Markdown</Link>, <Link href="/tools/text-diff">сравнение текста</Link>, <Link href="/tools/text-case">конвертер регистра</Link>, <Link href="/tools/lorem-ipsum">генератор Lorem ipsum</Link></li>
        <li><strong>Инструменты безопасности:</strong> <Link href="/tools/password-generator">Генератор паролей</Link>, <Link href="/tools/password-strength">проверка надёжности пароля</Link>, <Link href="/tools/text-encryption">шифрование текста</Link></li>
        <li><strong>Продуктивность:</strong> <Link href="/tools/pomodoro">Таймер Помодоро</Link>, <Link href="/tools/todo">список дел</Link>, <Link href="/tools/notepad">блокнот</Link>, <Link href="/tools/world-clock">мировое время</Link></li>
      </ul>

      {/* Inline SVG illustration */}
      <div style={{margin: "32px 0", textAlign: "center"}}>
        <svg width="320" height="80" viewBox="0 0 320 80" style={{maxWidth: "100%"}}>
          <rect x="0" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="30" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JSON</text>
          <rect x="65" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="95" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JWT</text>
          <rect x="130" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="160" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Regex</text>
          <rect x="195" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="225" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Hash</text>
          <rect x="260" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="290" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">UUID</text>
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">Всё работает локально в вашем браузере</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Начните использовать BrowseryTools — без настройки</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          Все 10 инструментов для разработчиков выше — плюс десятки других — бесплатны, мгновенны и не требуют аккаунта, установки и настройки. Откройте инструмент и начните работать менее чем за 3 секунды.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Открыть Форматировщик JSON →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Просмотреть все инструменты
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Связанные инструменты: <Link href="/tools/json-formatter">Форматировщик JSON</Link> · <Link href="/tools/jwt-decoder">Декодер JWT</Link> · <Link href="/tools/hash-generator">Генератор хешей</Link> · <Link href="/tools/regex-tester">Тестер регулярных выражений</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">Генератор UUID</Link> · <Link href="/tools/cron-parser">Парсер Cron</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
