import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        В документации к каждому API есть примеры кода. Почти всегда они написаны на cURL —
        HTTP-клиенте командной строки, поставляемом в каждой Unix-подобной системе и являющемся
        общим языком API-документации уже несколько десятилетий. Проблема в том, что вы пишете
        не shell-скрипты, а код на JavaScript, Python, Go или Ruby — и прежде чем использовать
        команду, вам нужно перевести её в рабочий код на нужном языке.
      </p>
      <ToolCTA slug="curl-converter" variant="inline" />
      <p>
        Этот перевод утомителен и чреват ошибками. Заголовки, схемы аутентификации, тела запросов
        и URL-кодирование — всё это нужно отобразить на правильные вызовы методов в правильном
        языке.{" "}
        <a href="/tools/curl-converter">Конвертер cURL BrowseryTools</a> делает это автоматически —
        вставьте команду cURL и получите эквивалентный код на JavaScript fetch, Python requests,
        Node.js axios и других языках. Бесплатно, без регистрации, всё остаётся в браузере.
      </p>

      <h2>Что такое cURL?</h2>
      <p>
        cURL (Client URL) — инструмент командной строки для передачи данных с использованием URL.
        Он поддерживает HTTP, HTTPS, FTP, WebSockets и десятки других протоколов. Для разработчиков
        он чаще всего используется для HTTP-запросов из терминала — тестирования API-эндпоинта,
        загрузки файла или отладки аутентификации.
      </p>
      <p>
        cURL установлен по умолчанию в macOS и большинстве дистрибутивов Linux. В Windows он
        поставляется вместе с ОС начиная с Windows 10. Именно эта повсеместность объясняет,
        почему команды, пишущие документацию к API, выбирают cURL для примеров — они могут быть
        уверены, что любой разработчик, читающий документацию, сможет немедленно запустить
        пример без каких-либо установок.
      </p>

      <h2>Анатомия команды cURL</h2>
      <p>
        Команда cURL состоит из базового URL и набора флагов. Вот полный пример, охватывающий
        наиболее важные флаги:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Разбор каждого флага:
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> — задаёт HTTP-метод. Допустимые значения: GET, POST, PUT, PATCH, DELETE и др. Если флаг опущен, но присутствует <code>-d</code>, cURL по умолчанию использует POST.</li>
        <li><strong><code>-H "Header: Value"</code></strong> — добавляет заголовок запроса. Можно указывать несколько раз для нескольких заголовков.</li>
        <li><strong><code>-d '...'</code></strong> — тело запроса. Для JSON используйте совместно с <code>-H "Content-Type: application/json"</code>. По умолчанию cURL URL-кодирует тело, если не использован <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> — отправляет тело как есть, без URL-кодирования. Необходим, когда тело содержит символы вроде <code>@</code>, которые <code>-d</code> интерпретировал бы особым образом.</li>
        <li><strong><code>-u username:password</code></strong> — сокращение для базовой аутентификации. cURL самостоятельно кодирует их как заголовок Authorization в Base64.</li>
        <li><strong><code>-s</code></strong> — тихий режим; скрывает индикатор прогресса. Почти всегда используется в скриптах.</li>
        <li><strong><code>-v</code></strong> — подробный режим; выводит заголовки запроса и ответа. Незаменим при отладке проблем аутентификации.</li>
        <li><strong><code>-o filename</code></strong> — записывает вывод в файл вместо stdout.</li>
      </ul>

      <h2>Типичные паттерны cURL для REST API</h2>

      <h3>GET-запрос с параметрами запроса</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Параметры запроса указываются прямо в URL. Заключайте весь URL в кавычки, чтобы shell
        не интерпретировал символ <code>&</code> как оператор фонового процесса.
      </p>

      <h3>POST с телом JSON</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>Загрузка файла (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        Флаг <code>-F</code> отправляет multipart/form-data. Префикс <code>@</code> означает
        «читать из файла». Этот формат используется для загрузки изображений, API обработки
        документов и любых эндпоинтов, принимающих бинарные данные.
      </p>

      <h2>Конвертация cURL в JavaScript fetch</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Original cURL:
// curl -X POST https://api.example.com/v1/users \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"name": "Alice", "email": "alice@example.com"}'

const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN",
  },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
  }),
});

const data = await response.json();`}
      </pre>

      <h2>Конвертация cURL в Python requests</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`import requests

response = requests.post(
    "https://api.example.com/v1/users",
    headers={
        "Authorization": "Bearer TOKEN",
    },
    json={
        "name": "Alice",
        "email": "alice@example.com",
    },
)

data = response.json()`}
      </pre>
      <p>
        Параметр <code>json=</code> библиотеки <code>requests</code> автоматически обрабатывает
        как сериализацию, так и установку заголовка <code>Content-Type: application/json</code> —
        задавать его вручную не нужно.
      </p>

      <h2>Конвертация cURL в Node.js с axios</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`const axios = require("axios");

const response = await axios.post(
  "https://api.example.com/v1/users",
  {
    name: "Alice",
    email: "alice@example.com",
  },
  {
    headers: {
      Authorization: "Bearer TOKEN",
    },
  }
);

const data = response.data;`}
      </pre>

      <h2>Как работает «Copy as cURL» в DevTools браузера</h2>
      <p>
        Одна из наиболее полезных функций DevTools браузера — «Copy as cURL» («Скопировать как
        cURL»). В Chrome, Firefox или Safari: откройте DevTools, перейдите на вкладку Network,
        выполните запрос (войдите в систему, нажмите кнопку, загрузите страницу), щёлкните правой
        кнопкой мыши по запросу в списке и выберите «Copy as cURL».
      </p>
      <p>
        Браузер генерирует полную команду cURL, включающую каждый заголовок, который он отправил, —
        в том числе куки, токены сессии, CSRF-токены и любые другие данные аутентификации.
        Это значит, что вы можете воспроизвести тот же запрос, который браузер сделал — включая
        весь его контекст аутентификации — из терминала или кода.
      </p>
      <p>
        Это незаменимо при отладке: если браузерный запрос работает, а запрос из вашего кода
        нет, вставьте оба в инструмент сравнения и найдите различие в заголовке или теле.
        Скопированный cURL также можно вставить напрямую в{" "}
        <a href="/tools/curl-converter">Конвертер cURL BrowseryTools</a> и получить эквивалентный
        код на нужном языке — конвертер автоматически обрабатывает экранирование, кавычки и
        перевод флагов.
      </p>

      <h2>Итоги</h2>
      <p>
        cURL — универсальный язык HTTP. Документация API использует его, потому что каждый может
        его запустить. DevTools копирует его, потому что он захватывает каждую деталь запроса.
        Умение читать cURL свободно — и точно переводить его на любой язык, с которым вы работаете,
        — это практический навык, который окупается при каждой интеграции нового API. Пропустите
        утомительный ручной перевод и используйте{" "}
        <a href="/tools/curl-converter">Конвертер cURL BrowseryTools</a> — получайте чистый,
        готовый к запуску код за секунды.
      </p>
      <ToolCTA slug="curl-converter" variant="card" />
    </div>
  );
}
