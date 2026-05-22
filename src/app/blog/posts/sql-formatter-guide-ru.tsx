export default function Content() {
  return (
    <div>
      <p>
        Каждый разработчик бывал в такой ситуации. Вы извлекаете медленный запрос из логов
        приложения, копируете его в редактор — и видите перед собой стену из 300 символов
        строчных букв без пробелов, без переносов строк и без малейшей пощады. Или находите
        ответ на Stack Overflow с нужным запросом, но он написан в одну строку. Или ORM любезно
        логирует генерируемый SQL — единой конкатенированной строкой. Во всех этих случаях
        запрос технически корректен, но практически нечитаем.
      </p>
      <p>
        Форматирование SQL — это не эстетика. Это способность понять, что делает запрос с
        первого взгляда: из каких таблиц он читает данные, по каким условиям фильтрует и
        какие столбцы возвращает. Хорошо отформатированный запрос можно проверить, отладить
        и оптимизировать за минуты. Неотформатированный способен украсть часы.
      </p>
      <p>
        <a href="/tools/sql-formatter">SQL-форматтер BrowseryTools</a> позволяет вставить любой
        запрос и мгновенно отформатировать его с правильными отступами, ключевыми словами
        в верхнем регистре и разбивкой по предложениям — всё обрабатывается локально в браузере,
        ни один запрос не отправляется на сервер.
      </p>

      <h2>Почему неотформатированный SQL так мучителен</h2>
      <p>
        SQL — один из немногих языков, в котором разработчики регулярно работают с кодом, который
        не писали сами и не могут переформатировать в источнике. Три самых распространённых
        источника «уродливого» SQL:
      </p>
      <ul>
        <li>
          <strong>Запросы, сгенерированные ORM.</strong> Hibernate, SQLAlchemy, ActiveRecord и их
          аналоги генерируют SQL динамически. Когда вы включаете логирование запросов для отладки
          производительности, вы получаете сырой SQL — как правило, в одну строку с динамическими
          значениями параметров, алиасами типа <code>t0_</code> и условиями JOIN, которые нужно
          перечитать несколько раз, чтобы разобраться.
        </li>
        <li>
          <strong>Логи запросов из production-баз данных.</strong> Лог медленных запросов MySQL и
          <code>pg_stat_statements</code> в PostgreSQL хранят запросы в том виде, в каком они были
          отправлены — без какого-либо форматирования. Они бесценны для анализа производительности,
          но практически нечитаемы без предварительного переформатирования.
        </li>
        <li>
          <strong>Однострочные примеры из Stack Overflow и документации.</strong> Код в ответах
          и документации часто сжимают в одну строку для экономии вертикального пространства.
          Логика верна, но компоновка затрудняет адаптацию к собственной схеме.
        </li>
      </ul>

      <h2>До и после: один и тот же запрос, отформатированный</h2>
      <p>
        Вот реалистичный запрос в том виде, в каком он может появиться в логе медленных запросов
        или в выводе ORM — всё в одну строку, ключевые слова в нижнем регистре:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        После форматирования с соблюдением принятых соглашений SQL тот же запрос становится
        немедленно читаемым:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id)  AS order_count,
    SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
    ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY
    u.id,
    u.name,
    u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 20;`}
      </pre>
      <p>
        Структура теперь очевидна мгновенно: вы видите, что это пользовательский отчёт,
        выбирающий количество заказов и сумму трат, отфильтрованный по активным пользователям
        с 2024 года, сгруппированный по пользователям и ограниченный топ-20 по расходам.
        На понимание ушло пять секунд — вместо пяти минут.
      </p>

      <h2>Соглашения форматирования SQL</h2>
      <p>
        Официального руководства по стилю SQL не существует, однако в отрасли сложился набор
        широко принятых соглашений. Их соблюдение делает SQL читаемым для любого разработчика,
        знакомого с языком.
      </p>

      <h3>Ключевые слова в верхнем регистре</h3>
      <p>
        Ключевые слова SQL — <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code> — должны быть в верхнем регистре. Имена таблиц, столбцов, алиасы
        и строковые литералы остаются в своём естественном регистре. Этот визуальный контраст
        между КЛЮЧЕВЫМИ СЛОВАМИ и идентификаторами делает запросы читаемыми с первого взгляда.
      </p>

      <h3>Каждое основное предложение — на отдельной строке</h3>
      <p>
        Каждое предложение верхнего уровня начинается с новой строки:{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. Это создаёт чёткий
        визуальный скелет запроса. Открывая отформатированный запрос, взгляд сразу находит
        каждое предложение, так как все они начинаются от левого края (или на постоянном уровне
        отступа).
      </p>

      <h3>Отступы для списков столбцов и условий</h3>
      <p>
        Имена столбцов в списке <code>SELECT</code> и условия в <code>WHERE</code> отображаются
        с отступом в четыре пробела (или один символ табуляции). Каждый оператор <code>AND</code>
        и <code>OR</code> в предложении <code>WHERE</code> начинается на новой строке на том же
        уровне отступа, что и первое условие — это делает тривиальным добавление, удаление и
        комментирование отдельных условий:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Расстановка запятых: два подхода</h3>
      <p>
        Дискуссия о размещении запятых в SQL похожа на споры о trailing-запятых в JavaScript.
        Существуют два допустимых стиля:
      </p>
      <ul>
        <li>
          <strong>Завершающие запятые</strong> (запятая в конце каждой строки): наиболее
          распространённый стиль, совпадающий с тем, как большинство разработчиков пишут
          списки на других языках. Недостаток: при комментировании последнего элемента нужно
          также убирать запятую у предыдущего.
        </li>
        <li>
          <strong>Запятая в начале строки</strong> (запятая перед элементом, начиная со второго):
          упрощает комментирование любой строки без изменения соседних. Предпочитается командами,
          которые часто модифицируют списки столбцов в процессе разработки.
        </li>
      </ul>
      <p>
        Оба варианта допустимы. Выберите один и придерживайтесь его в рамках проекта. SQL-форматтер
        BrowseryTools использует завершающие запятые по умолчанию — это согласуется с большинством
        руководств по стилю и является ожидаемым соглашением для большинства читателей.
      </p>

      <h3>Выровненные алиасы с AS</h3>
      <p>
        Всегда используйте явный <code>AS</code> для алиасов — никогда неявный стиль без слова,
        который допускают некоторые диалекты (<code>COUNT(o.id) order_count</code>). Когда в
        списке <code>SELECT</code> несколько алиасов, выравнивание ключевого слова <code>AS</code>
        по одному столбцу делает список читаемым с первого взгляда:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>Как читать сложный запрос с несколькими JOIN</h2>
      <p>
        Столкнувшись с запросом, содержащим три, четыре или пять JOIN, не начинайте с начала.
        Начинайте с предложения <code>FROM</code>. Оно говорит о главной таблице — точке
        опоры запроса. Каждый последующий <code>JOIN</code> добавляет ещё одну таблицу к
        результирующему набору, а условие <code>ON</code> показывает, как строки этой таблицы
        связаны со строками, уже накопленными до этого. Только разобравшись с моделью данных
        через <code>FROM</code> и <code>JOIN</code>, стоит возвращаться к <code>SELECT</code>,
        чтобы посмотреть, какие столбцы возвращаются, затем к <code>WHERE</code> для
        фильтрации и к <code>GROUP BY</code> для агрегации.
      </p>
      <p>
        Порядок чтения любого SELECT-запроса: <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        Он совпадает с тем, как движок базы данных фактически обрабатывает предложения, и
        соответствует логике рассуждений о данных, проходящих через каждый шаг.
      </p>

      <h2>Форматирование подзапросов</h2>
      <p>
        Подзапросы — запросы, вложенные внутрь другого запроса — заслуживают собственного
        уровня отступа. Каждый уровень вложенности добавляет один уровень отступа, и структура
        остаётся чёткой даже при двух-трёх уровнях вложенности:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email
FROM users AS u
WHERE u.id IN (
    SELECT DISTINCT o.user_id
    FROM orders AS o
    WHERE o.total > 500
      AND o.created_at >= '2024-01-01'
)
ORDER BY u.name;`}
      </pre>
      <p>
        Внутренний запрос явно подчинён внешнему. Закрывающая скобка выровнена с ключевым
        словом (<code>WHERE</code>), которое ввело подзапрос. Для глубоко вложенных или сложных
        подзапросов CTE (Common Table Expressions) почти всегда предпочтительнее, поскольку
        им можно дать имена и разместить в начале запроса, где их легко читать.
      </p>

      <h2>Типичные паттерны запросов и их отформатированный вид</h2>

      <h3>INSERT INTO ... SELECT</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`INSERT INTO order_archive (
    id,
    user_id,
    total,
    created_at
)
SELECT
    id,
    user_id,
    total,
    created_at
FROM orders
WHERE created_at < '2023-01-01';`}
      </pre>

      <h3>UPDATE с JOIN (синтаксис MySQL / SQL Server)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>Запрос WITH (CTE)</h3>
      <p>
        Common Table Expressions — наиболее мощный инструмент форматирования в SQL. Они позволяют
        давать имена промежуточным наборам результатов, превращая глубоко вложенный запрос в серию
        чётко именованных шагов:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
      AND created_at >= '2024-01-01'
),
user_orders AS (
    SELECT
        user_id,
        COUNT(id)  AS order_count,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
)
SELECT
    au.id,
    au.name,
    au.email,
    uo.order_count,
    uo.total_spent
FROM active_users AS au
LEFT JOIN user_orders AS uo
    ON au.id = uo.user_id
ORDER BY uo.total_spent DESC
LIMIT 20;`}
      </pre>

      <h2>Почему форматирование важно для анализа производительности</h2>
      <p>
        Форматирование — это не только читаемость для людей: оно делает проблемы
        производительности видимыми. После того как запрос правильно оформлен, ряд
        классов проблем становится легко заметным:
      </p>
      <ul>
        <li>
          <strong>Отсутствующие индексы.</strong> Отформатированное предложение <code>WHERE</code>
          со всеми условиями на отдельных строках позволяет легко проверить, что для каждого
          столбца-условия есть индекс. В неотформатированной однострочной записи условия легко
          пропустить.
        </li>
        <li>
          <strong>Декартовы произведения.</strong> <code>JOIN</code> без условия <code>ON</code>{" "}
          (или с всегда-истинным условием) создаёт перекрёстное соединение, умножающее количество
          строк. Когда каждый <code>JOIN</code> расположен на отдельной строке с условием
          <code>ON</code> с отступом под ним, отсутствующее условие сразу бросается в глаза.
        </li>
        <li>
          <strong>Паттерны N+1 запросов.</strong> Когда видно, что запрос выбирает список
          идентификаторов в подзапросе, а затем снова соединяется с той же таблицей, — это
          сигнал, что запрос можно переписать с прямым JOIN, устраняя проблему N+1 на уровне
          SQL, а не в коде приложения.
        </li>
        <li>
          <strong>Функции на индексируемых столбцах.</strong> <code>WHERE DATE(created_at) = '2024-01-01'</code>{" "}
          мешает базе данных использовать индекс по <code>created_at</code>. В отформатированном
          запросе этот паттерн заметен сразу; в однострочной записи — незаметен.
        </li>
      </ul>

      <h2>Диалекты SQL: важные синтаксические различия</h2>
      <p>
        SQL — это стандарт (ISO/IEC 9075), но каждая крупная база данных расширяет его
        диалектно-специфичным синтаксисом. Вот что важно для форматирования:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>База данных</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Экранирование идентификаторов</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Заметные отличия</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"double_quotes"</code></td>
              <td style={{padding: "10px 16px"}}>Идентификаторы в двойных кавычках чувствительны к регистру; <code>ILIKE</code> для поиска без учёта регистра; предложение <code>RETURNING</code> для INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`backticks`</code></td>
              <td style={{padding: "10px 16px"}}>Нечувствителен к регистру по умолчанию; синтаксис <code>LIMIT offset, count</code>; исторически GROUP BY допускал неагрегируемые столбцы</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"double_quotes"</code> или <code>[brackets]</code></td>
              <td style={{padding: "10px 16px"}}>Гибкая система типов; в старых версиях нет <code>RIGHT JOIN</code> и <code>FULL OUTER JOIN</code>; операторы <code>PRAGMA</code> для информации о схеме</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[square_brackets]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> вместо <code>LIMIT</code>; подсказки <code>NOLOCK</code>; <code>GETDATE()</code> вместо <code>NOW()</code>; <code>ISNULL()</code> вместо <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL: двойные кавычки и чувствительность к регистру</h3>
      <p>
        В PostgreSQL идентификаторы без кавычек приводятся к нижнему регистру. Если таблица была
        создана как <code>CREATE TABLE "UserProfiles"</code> (в двойных кавычках), ссылаться на
        неё всегда нужно как <code>"UserProfiles"</code> с кавычками. Без кавычек PostgreSQL ищет{" "}
        <code>userprofiles</code> и возвращает ошибку. Это частый источник путаницы при миграции
        с MySQL или при работе с ORM, генерирующими имена в смешанном регистре.
      </p>

      <h3>MySQL: экранирование обратными кавычками</h3>
      <p>
        MySQL использует обратные кавычки для экранирования идентификаторов, а не двойные
        (хотя MySQL в режиме <code>ANSI_QUOTES</code> принимает и двойные кавычки). Обратные
        кавычки встречаются в DDL, сгенерированном MySQL, и в запросах, экспортированных
        инструментами вроде phpMyAdmin. SQL-форматтер обрабатывает идентификаторы в обратных
        кавычках и сохраняет их, чтобы результат оставался корректным для вашей конкретной базы.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Совет — всегда указывайте диалект:</strong> при вставке запроса в форматтер
        выбирайте правильный диалект SQL. MySQL и PostgreSQL имеют тонкие синтаксические различия,
        влияющие на обработку некоторых конструкций — особенно GROUP BY, оконных функций и
        строковых функций.
      </div>

      <h2>Как использовать SQL-форматтер BrowseryTools</h2>
      <p>
        Использование форматтера занимает три шага:
      </p>
      <ul>
        <li>
          <strong>Вставьте запрос.</strong> Скопируйте сырой SQL из лог-файла, вывода ORM или
          редактора и вставьте в поле ввода. Форматтер принимает любой объём SQL — одиночные
          операторы, несколько операторов или целые скрипты.
        </li>
        <li>
          <strong>Нажмите «Форматировать».</strong> Форматтер применяет ключевые слова в верхнем
          регистре, разбивку по предложениям, отступы и единообразные пробелы. Результат появляется
          в панели вывода мгновенно — без сетевых запросов и задержек.
        </li>
        <li>
          <strong>Скопируйте результат.</strong> Нажмите кнопку «Копировать», чтобы поместить
          отформатированный SQL в буфер обмена — готов для вставки в редактор, клиент базы данных
          или pull request.
        </li>
      </ul>
      <p>
        Поскольку форматтер работает полностью в браузере, вы можете безопасно вставлять запросы
        с конфиденциальными данными — production-именами таблиц, идентификаторами клиентов,
        внутренними деталями схемы — без риска их утечки. Никакого бэкенда для логирования запросов
        не существует.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Ваши запросы остаются приватными:</strong> SQL-запросы часто содержат детали схемы,
        бизнес-логику и данные, которые не должны покидать вашу среду. SQL-форматтер BrowseryTools
        работает на 100% в браузере — ваши запросы никогда не отправляются ни на какой сервер,
        не логируются и не хранятся. Вставляйте production-запросы уверенно.
      </div>

      <h2>Форматируйте SQL-запросы прямо сейчас</h2>
      <p>
        Распутываете ли вы монстра, созданного ORM, проверяете pull request коллеги, отлаживаете
        медленный запрос или просто пытаетесь понять, что на самом деле делает ответ с Stack
        Overflow, — отформатированный SQL делает каждую из этих задач быстрее и менее
        подверженной ошибкам. Хорошее форматирование — дешевейшая оптимизация производительности,
        доступная до того, как вы возьмётесь за EXPLAIN.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Бесплатный SQL-форматтер — мгновенно, приватно, без регистрации
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Вставьте любой SQL-запрос и отформатируйте его с правильными отступами и ключевыми словами в верхнем регистре в один клик.
          Ничего не покидает ваш браузер.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Открыть SQL-форматтер →
        </a>
      </div>
    </div>
  );
}
