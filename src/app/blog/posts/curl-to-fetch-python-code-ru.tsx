export default function Content() {
  return (
    <div>
      <p>
        Вы нашли нужный API-вызов — но он написан на cURL, а вы работаете с JavaScript или
        Python. Или открыли DevTools браузера, кликнули правой кнопкой на запрос и выбрали
        «Копировать как cURL», — и теперь перед вами стена флагов, которые нужно превратить
        в рабочий код. Переводить cURL вручную утомительно: каждый <code>-H</code>, <code>-d</code>,{" "}
        <code>-u</code> и <code>-X</code> должен отображаться на правильный аргумент в вашем
        языке, и один пропущенный заголовок сломает запрос.
      </p>
      <p>
        <a href="/tools/curl-converter">Конвертер cURL от BrowseryTools</a> делает это мгновенно:
        вставьте cURL-команду и получите чистый код на JavaScript <code>fetch</code>, Python{" "}
        <code>requests</code>, Node.js и других языках — прямо в браузере, без загрузки данных.
        Это руководство показывает соответствие флагов и кода, чтобы вы могли читать и доверять
        результату.
      </p>

      <h2>Рабочий процесс «Копировать как cURL»</h2>
      <p>
        Самый быстрый способ получить рабочий запрос — позволить браузеру написать его за вас.
        Откройте DevTools (F12), перейдите на вкладку <strong>Сеть</strong>, выполните нужное
        действие, затем кликните правой кнопкой на запрос и выберите{" "}
        <strong>Копировать &rarr; Копировать как cURL</strong>. Теперь у вас есть cURL-команда
        с точными заголовками, куками и телом, которые отправил реальный сайт. Вставьте её в{" "}
        <a href="/tools/curl-converter">конвертер</a> — и получите тот же запрос в виде кода,
        готового к вставке в проект.
      </p>

      <h2>Как флаги cURL соответствуют коду</h2>
      <p>
        Зная несколько ключевых флагов, вы можете читать любую cURL-команду с первого взгляда:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.8}}>
{`-X POST          ->  HTTP-метод
-H "Key: Value"  ->  заголовок запроса
-d '{...}'       ->  тело запроса (подразумевает POST)
-u user:pass     ->  HTTP Basic auth
-F field=value   ->  загрузка multipart/form-data
-b "name=value"  ->  кука
-L               ->  следовать перенаправлениям`}
      </pre>
      <p>
        Заголовок <code>-H &quot;Authorization: Bearer abc123&quot;</code> становится записью
        в объекте <code>headers</code>. Тело, переданное через <code>-d</code>, становится телом
        запроса, а если тип содержимого — JSON, оно сериализуется соответствующим образом.
        <code>-u user:pass</code> становится заголовком Basic auth. Знание этого соответствия
        позволяет проверять сгенерированный код, а не слепо ему доверять.
      </p>

      <h2>Один запрос на трёх языках</h2>
      <p>
        Возьмём простой аутентифицированный POST-запрос. На cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>На JavaScript <code>fetch</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Ada" }),
});`}
      </pre>
      <p>На Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Обратите внимание: аргумент <code>json=</code> в Python устанавливает тело запроса{" "}
        <em>и</em> заголовок Content-Type автоматически — небольшое идиоматическое отличие,
        которое конвертер обрабатывает за вас.
      </p>

      <h2>Распространённые подводные камни</h2>
      <p>
        <strong>Кавычки и экранирование.</strong> Тела cURL заключаются в одинарные кавычки в
        шелле; когда они содержат JSON с двойными кавычками, ошибки при ручном переводе
        неизбежны. Использование конвертера устраняет этот риск.
      </p>
      <p>
        <strong>Неявный POST.</strong> Использование <code>-d</code> делает запрос POST даже без{" "}
        <code>-X POST</code>. Если переводить только видимые флаги, можно ошибочно получить GET.
      </p>
      <p>
        <strong>Секреты в команде.</strong> Скопированная cURL-команда часто содержит живые токены
        и куки. Поскольку конвертер работает полностью в браузере, эти секреты никуда не
        отправляются — но их всё равно нужно убрать перед вставкой кода в общий репозиторий
        или тикет.
      </p>

      <h2>Часто задаваемые вопросы</h2>
      <p>
        <strong>В какие языки можно конвертировать?</strong> JavaScript fetch, Python requests,
        Node.js и другие распространённые цели.
      </p>
      <p>
        <strong>Конвертер отправляет команду куда-нибудь?</strong> Нет. Парсинг и конвертация
        происходят локально в браузере, поэтому токены из команды остаются на устройстве.
      </p>
      <p>
        <strong>Можно вставить &laquo;Копировать как cURL&raquo; из DevTools?</strong> Да —
        это одно из лучших применений инструмента. Такая команда захватывает точные заголовки
        и тело реального запроса.
      </p>
      <p>
        <strong>Это бесплатно?</strong> Да — без аккаунта, без ограничений.
      </p>

      <h2>Конвертируйте сейчас</h2>
      <p>
        Откройте <a href="/tools/curl-converter">конвертер cURL</a>, вставьте команду и скопируйте
        эквивалентный код. Для более глубокого изучения синтаксиса cURL и REST-паттернов читайте
        наш{" "}
        <a href="/blog/curl-converter-guide">справочник по конвертации API-запросов между языками</a>,
        а чтобы разобраться в ответах — смотрите{" "}
        <a href="/blog/http-status-codes-guide">справочник по кодам состояния HTTP</a>.
      </p>
    </div>
  );
}
