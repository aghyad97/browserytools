import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        JSON повсюду. Он лежит в основе REST API, конфигурационных файлов, выходных данных баз
        данных, webhook-событий и агрегаторов логов. Вы сталкиваетесь с ним десятки раз в день —
        разрабатывая бэкенд-сервис, отлаживая фронтенд-приложение или читая документацию.
        Глубокое понимание JSON — не просто умение его парсить, но и читать, валидировать,
        диагностировать — один из наиболее прибыльных навыков разработчика.
      </p>
      <ToolCTA slug="json-formatter" variant="inline" />
      <p>
        Это руководство охватывает всё: от основ синтаксиса JSON до отладки распространённых
        ошибок парсинга, стратегий форматирования и работы с глубоко вложенными структурами.
        Вставьте любой JSON в{" "}
        <a href="/tools/json-formatter">JSON Formatter BrowseryTools</a> — он мгновенно
        валидирует и красиво форматирует его. Бесплатно, без регистрации, всё остаётся в браузере.
      </p>

      <h2>Почему JSON победил (а XML проиграл)</h2>
      <p>
        Прежде чем JSON стал стандартом обмена данными, правил XML. SOAP API, RSS-ленты и
        конфигурационные файлы — всё использовало XML. JSON появился как более простая
        альтернатива и постепенно занял место XML в большинстве сценариев. Причины очевидны:
      </p>
      <ul>
        <li><strong>Меньше многословия</strong> — в JSON не нужны закрывающие теги. Те же данные занимают на 30–50% меньше символов.</li>
        <li><strong>Нативен для JavaScript</strong> — JSON расшифровывается как JavaScript Object Notation. Он напрямую отображается на объекты и массивы JavaScript, что делает его парсинг и сериализацию тривиальными в браузере.</li>
        <li><strong>Читаемость</strong> — правильно отформатированный JSON-документ легче читать, чем эквивалентный XML с угловыми скобками и объявлениями пространств имён.</li>
        <li><strong>Широкая поддержка</strong> — в каждом крупном языке программирования есть встроенный парсер JSON. Не нужно устанавливать библиотеку только чтобы десериализовать ответ API.</li>
      </ul>
      <p>
        У XML по-прежнему есть законные применения — форматы документов (DOCX, SVG),
        конфигурации, которым нужны комментарии (JSON их не поддерживает), и протоколы вроде
        SOAP, где XML обязателен. Но для API-взаимодействия и хранения данных JSON является
        безусловным победителем.
      </p>

      <h2>Правила синтаксиса JSON</h2>
      <p>
        JSON обладает небольшим строгим синтаксисом. Вот правила, которые чаще всего застают
        разработчиков врасплох:
      </p>
      <ul>
        <li><strong>Ключи должны быть строками в двойных кавычках</strong> — <code>{"{"}"name": "Alice"{"}"}</code> допустимо; <code>{"{"}name: "Alice"{"}"}</code> — нет. В отличие от объектных литералов JavaScript, JSON не разрешает ключи без кавычек.</li>
        <li><strong>Нет завершающих запятых</strong> — <code>[1, 2, 3,]</code> недопустимый JSON. Запятая после последнего элемента принята JavaScript и многими парсерами, но не является частью спецификации JSON.</li>
        <li><strong>Нет комментариев</strong> — в JSON нет синтаксиса для комментариев. Это удивляет разработчиков, желающих аннотировать конфигурационные файлы. Если нужны комментарии, рассмотрите JSONC (JSON with Comments) или YAML.</li>
        <li><strong>Строки только в двойных кавычках</strong> — строки в одинарных кавычках, например <code>'hello'</code>, недопустимы в JSON.</li>
        <li><strong>Числа не могут начинаться с нуля</strong> — <code>007</code> недопустимо; используйте <code>7</code>.</li>
        <li><strong>Только шесть типов значений</strong> — строки, числа, булевы значения (<code>true</code> / <code>false</code>), null, объекты и массивы. Никаких дат, функций, undefined.</li>
      </ul>

      <h2>Распространённые ошибки JSON и их значение</h2>
      <p>
        Ошибки парсинга JSON могут быть загадочными. Вот наиболее частые из них и способы их
        исправления.
      </p>

      <h3>Unexpected token (неожиданный токен)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Одинарные кавычки недопустимы в JSON. Замените их двойными:{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Unexpected token } / ]"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        Завершающая запятая перед закрывающей скобкой. Удалите запятую после последнего элемента.
        Это самая распространённая ошибка JSON для разработчиков, приходящих из JavaScript, где
        завершающие запятые вполне допустимы.
      </p>

      <h3>Unexpected end of JSON input (неожиданный конец входных данных)</h3>
      <p>
        Это означает, что JSON усечён — строка заканчивается до того, как все открытые объекты
        и массивы закрыты. Пересчитайте открывающие и закрывающие фигурные и квадратные скобки.
        Они должны совпадать.
      </p>

      <h3>Property names must be strings (имена свойств должны быть строками)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Invalid — unquoted key
{ name: "Alice" }

// Valid
{ "name": "Alice" }`}
      </pre>

      <h2>Форматирование vs. минификация</h2>
      <p>
        JSON можно представить двумя способами: красиво отформатированным (с отступами и
        переносами строк) или минифицированным (весь пробельный символ удалён). Выбор зависит
        от контекста.
      </p>
      <p>
        <strong>Форматируйте</strong>, когда вы читаете, отлаживаете, просматриваете или храните
        JSON в системе контроля версий. Отформатированный JSON мгновенно читаем и чисто выглядит
        в diff Git, поскольку каждое значение находится на отдельной строке.
      </p>
      <p>
        <strong>Минифицируйте</strong>, когда передаёте JSON по сети. Пробелы — чистые накладные
        расходы в HTTP-ответах. 100 КБ красиво отформатированного JSON могут ужаться до 60 КБ
        при минификации, а затем ещё до 15 КБ с gzip. Большинство API отдают минифицированный
        JSON по сети и дают клиенту форматировать его по необходимости.
      </p>
      <p>
        В JavaScript: <code>JSON.stringify(data, null, 2)</code> форматирует с 2-пробельным
        отступом. <code>JSON.stringify(data)</code> минифицирует.{" "}
        <a href="/tools/json-formatter">JSON Formatter BrowseryTools</a> умеет и то и другое —
        вставьте JSON и мгновенно переключайтесь между красивым и минифицированным видами.
      </p>

      <h2>Навигация по глубоко вложенному JSON</h2>
      <p>
        Реальные ответы API нередко глубоко вложены. Webhook-событие Stripe, ответ GitHub API
        или конфигурация Kubernetes могут иметь объекты на пять-шесть уровней вглубь. Вот
        стратегии работы с ними:
      </p>

      <h3>Используйте опциональную цепочку в JavaScript</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Without optional chaining — crashes if any level is undefined
const city = user.address.location.city;

// With optional chaining — returns undefined instead of throwing
const city = user?.address?.location?.city;

// With nullish coalescing for a default value
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>Используйте jq для запросов к JSON в командной строке</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Pretty-print the entire response
curl https://api.example.com/users | jq .

# Extract a specific field
curl https://api.example.com/users | jq '.[0].email'

# Filter an array
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON в API и конфигурационных файлах</h2>
      <p>
        JSON служит двум очень разным целям в зависимости от контекста, и лучшие практики для
        них отличаются.
      </p>
      <p>
        В <strong>ответах API</strong> JSON генерируется кодом и потребляется кодом. Вы редко
        пишете его вручную. Приоритет — корректность и согласованность: используйте библиотеку
        сериализации и доверьте ей экранирование. Минифицируйте для продакшена, включайте заголовок
        Content-Type <code>application/json</code> и версионируйте API, чтобы изменения структуры
        JSON не были ломающими.
      </p>
      <p>
        В <strong>конфигурационных файлах</strong> (package.json, tsconfig.json, .eslintrc.json)
        JSON пишется людьми. Здесь важнее читаемость. Используйте отступ в 2 пробела, по
        возможности держите структуру неглубокой, и добавляйте комментарии через JSONC-совместимый
        парсер, если ваши инструменты его поддерживают. Никогда не минифицируйте конфигурационные
        файлы, хранящиеся в системе контроля версий.
      </p>

      <h2>Валидация с помощью JSON Schema</h2>
      <p>
        JSON Schema — спецификация для определения структуры, типов и ограничений JSON-документа.
        Она позволяет убедиться, что JSON-документ соответствует ожидаемой форме до того, как
        вы попытаетесь его использовать.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":    { "type": "integer" },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0, "maximum": 150 }
  },
  "additionalProperties": false
}`}
      </pre>
      <p>
        Библиотеки вроде <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python) и{" "}
        <code>JSON.NET Schema</code> (.NET) могут валидировать JSON-документ по схеме во время
        выполнения — перехватывая некорректные документы на границе API до того, как они вызовут
        непредвиденные ошибки глубже в приложении.
      </p>

      <h2>Итоги</h2>
      <p>
        Простота JSON — его главная сила. Шесть типов значений, строгие правила кавычек, никаких
        комментариев, никаких завершающих запятых — ограничения невелики, а формат однозначен.
        Когда что-то идёт не так, это почти всегда одна из нескольких предсказуемых синтаксических
        ошибок. Вставьте сломанный JSON в{" "}
        <a href="/tools/json-formatter">JSON Formatter BrowseryTools</a> — ошибка сразу станет
        видна с указанием точной позиции.
      </p>
      <ToolCTA slug="json-formatter" variant="card" />
    </div>
  );
}
