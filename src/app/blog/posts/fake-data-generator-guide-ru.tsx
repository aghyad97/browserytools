import Link from 'next/link';
import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Каждый разработчик рано или поздно упирается в одну и ту же стену: вам нужны данные для тестирования, но
        использование реальных пользовательских данных — это риск, Lorem Ipsum бесполезен для чего-либо сверх
        заполнения абзацев, а создание вручную 500 тестовых записей в JSON — способ загубить полдня. Генераторы
        вымышленных данных существуют, чтобы решить именно эту проблему — и{" "}
        <Link href="/tools/fake-data">генератор вымышленных данных BrowseryTools</Link> делает это бесплатно,
        локально, без аккаунта, без лимитов строк и без подписки.
      </p>
      <ToolCTA slug="fake-data" variant="inline" />
      <p>
        Это руководство охватывает, почему важны реалистичные вымышленные данные, что производит генератор, как
        эффективно использовать его в разных рабочих процессах и как импортировать вывод в каждую распространённую
        базу данных и инструментарий.
      </p>

      <h2>Почему нельзя использовать реальные пользовательские данные для тестирования</h2>
      <p>
        Использование продакшен-данных в средах разработки или тестирования — это комплаенс- и юридический риск в
        рамках нескольких нормативных систем:
      </p>
      <ul>
        <li>
          <strong>GDPR (Европа):</strong> статья 25 требует минимизации данных по умолчанию. Копирование реальных
          пользовательских записей — имён, e-mail, адресов — в staging-базу нарушает этот принцип, если данные не
          были должным образом анонимизированы. Взлом этой staging-среды раскрывает данные реальных людей.
        </li>
        <li>
          <strong>HIPAA (здравоохранение США):</strong> защищённую медицинскую информацию (PHI) нельзя использовать
          в тестовых средах без либо Business Associate Agreement, либо надлежащей деидентификации по методам Safe
          Harbor или Expert Determination. Использование реальных записей пациентов в dev-базе — прямое нарушение
          HIPAA.
        </li>
        <li>
          <strong>CCPA (Калифорния):</strong> персональная информация жителей Калифорнии несёт особые права и
          ограничения. Использование реальных записей клиентов в любом непродакшен-контексте без соответствующих
          мер контроля создаёт ненужный риск.
        </li>
      </ul>
      <p>
        Помимо комплаенса есть практические инженерные причины избегать реальных данных в тестах: реальные данные
        грязны непредсказуемым образом (у них есть пустые поля, спецсимволы и Unicode, которые тесты могут быть не
        написаны обрабатывать), они меняются со временем (делая тесты недетерминированными) и содержат значения,
        которые могут случайно вызвать реальные побочные эффекты (отправку писем на реальные адреса, списание с
        реальных платёжных средств).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Более безопасный выбор по умолчанию:</strong> генерируйте реалистичные вымышленные данные для каждой
        непродакшен-среды. Они структурно валидны, никогда не идентифицируемы, безопасны для коммита в систему
        контроля версий и воспроизводимы. Реальные данные в dev/test-средах по умолчанию — это риск.
      </div>

      <h2>Почему Lorem Ipsum — неправильный инструмент для данных</h2>
      <p>
        Lorem ipsum хорош для заполнения текстовых блоков в макете. Он совершенно неправилен для тестирования
        управляемых данными интерфейсов и API, потому что:
      </p>
      <ul>
        <li>
          Он не нагружает реальные длины полей. У e-mail, телефонов и почтовых индексов есть конкретные форматы и
          максимальные длины. «Lorem ipsum dolor sit amet» в поле e-mail не выявит, что ваша валидация ввода
          неверна, а вот <code>very.long.name.that.pushes.limits@subdomain.example.com</code> выявит.
        </li>
        <li>
          Он не вскрывает крайние случаи в вашем интерфейсе. Имя вроде «José García-López» проверяет ваше
          кодирование символов. Название компании вроде «O'Brien & Associates, LLC» проверяет ваше экранирование
          SQL. «Lorem ipsum» не проверяет ни то ни другое.
        </li>
        <li>
          Он делает ваши макеты и прототипы фальшивыми так, что это имеет значение. Заинтересованные лица,
          просматривающие прототип с реалистичными именами, реалистичными городами и реалистичными e-mail, могут
          правильно оценить дизайн. Текст-заглушка ломает иллюзию и затрудняет обнаружение реальных проблем
          юзабилити.
        </li>
      </ul>

      <h2>Что производит генератор вымышленных данных BrowseryTools</h2>
      <p>
        Генератор поддерживает широкий диапазон типов полей в нескольких категориях. Вы выбираете, какие поля
        включить, и каждая сгенерированная запись содержит реалистичные, правильно отформатированные значения для
        каждого выбранного поля:
      </p>

      <h3>Личная информация</h3>
      <ul>
        <li><strong>Полное имя</strong> — культурно реалистичные сочетания имени и фамилии</li>
        <li><strong>Имя</strong> и <strong>фамилия</strong> по отдельности (полезно, когда ваша схема хранит их в разных столбцах)</li>
        <li><strong>E-mail</strong> — правильно отформатированный, использующий сгенерированное имя как локальную часть</li>
        <li><strong>Номер телефона</strong> — формат США с кодом региона</li>
        <li><strong>Дата рождения</strong> — генерирует взрослых от 18 до 80 лет</li>
        <li><strong>Пол</strong> — мужской / женский / небинарный</li>
      </ul>

      <h3>Адрес</h3>
      <ul>
        <li><strong>Адрес улицы</strong> — реалистичный номер дома и название улицы</li>
        <li><strong>Город</strong> — реальные названия городов США и других стран</li>
        <li><strong>Штат</strong> — штаты США и международные эквиваленты</li>
        <li><strong>Страна</strong></li>
        <li><strong>Почтовый индекс</strong> — формат соответствует выбранной стране</li>
      </ul>

      <h3>Интернет и идентичность</h3>
      <ul>
        <li><strong>Имя пользователя</strong> — сгенерировано из имени с добавлением цифр для реалистичности</li>
        <li><strong>URL</strong> — реалистичные URL личных или корпоративных сайтов</li>
        <li><strong>IP-адрес</strong> — валидные IPv4-адреса в публичных диапазонах</li>
        <li><strong>User agent</strong> — реальные строки user-agent распространённых браузеров</li>
      </ul>

      <h3>Финансы</h3>
      <ul>
        <li>
          <strong>Номер кредитной карты</strong> — проходит проверку по алгоритму Луна, поэтому не будет отвергнут
          валидаторами формата; использует реалистичные префиксы номеров карт (Visa 4xxx, Mastercard 5xxx), но не
          является реальным номером карты
        </li>
        <li><strong>IBAN</strong> — валидный формат европейских номеров банковских счетов</li>
      </ul>

      <h3>Идентификаторы и системные поля</h3>
      <ul>
        <li><strong>UUID</strong> — UUID v4 для первичных ключей БД и идентификаторов корреляции</li>
        <li><strong>SSN</strong> — формат номера социального страхования США (XXX-XX-XXXX)</li>
        <li><strong>Даты</strong> и <strong>случайные числа</strong> в настраиваемых диапазонах</li>
      </ul>

      <h2>Как пользоваться генератором</h2>
      <p>
        Откройте <Link href="/tools/fake-data">/tools/fake-data</Link>. Интерфейс даёт вам три элемента управления:
      </p>
      <ol>
        <li>
          <strong>Выберите поля:</strong> отметьте флажки для каждого типа поля, которое хотите в выводе. Вы можете
          выбрать как одно поле (только e-mail, например), так и полный набор для всеобъемлющих записей
          пользователей.
        </li>
        <li>
          <strong>Задайте количество записей:</strong> введите число от 1 до 1000. Для seed-данных нагрузочного
          тестирования используйте 1000. Для истории Storybook или дизайн-макета обычно достаточно 5–10 записей.
        </li>
        <li>
          <strong>Выберите формат вывода:</strong> выберите JSON или CSV. JSON лучше для тестирования API и
          JavaScript-инструментария. CSV лучше для импорта в БД, просмотра в таблицах или инструментов вроде Postman.
        </li>
      </ol>
      <p>
        Нажмите «Generate». Вывод появляется в текстовой области ниже. Используйте кнопку «Copy», чтобы скопировать
        его в буфер обмена, или «Download», чтобы сохранить файл локально. Генерация мгновенна для до 1000 записей —
        все вычисления происходят в вашем браузере.
      </p>

      <h2>Пример вывода в JSON</h2>
      <p>
        Вот показательный фрагмент из 3 записей вывода JSON с выбранными личными, адресными и интернет-полями:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`[
  {
    "id": "a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e",
    "firstName": "Meredith",
    "lastName": "Okafor",
    "email": "meredith.okafor47@mailbox.net",
    "phone": "(312) 554-8821",
    "dateOfBirth": "1988-03-14",
    "gender": "female",
    "street": "2841 Birchwood Drive",
    "city": "Columbus",
    "state": "OH",
    "zipCode": "43215",
    "country": "United States",
    "username": "meredith_okafor88",
    "ipAddress": "74.125.224.18"
  },
  {
    "id": "b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f",
    "firstName": "Derek",
    "lastName": "Nascimento",
    "email": "d.nascimento@webfrontier.io",
    "phone": "(415) 703-2294",
    "dateOfBirth": "1995-11-02",
    "gender": "male",
    "street": "509 Elmwood Court",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "country": "United States",
    "username": "derek_n95",
    "ipAddress": "192.0.2.147"
  },
  {
    "id": "c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a",
    "firstName": "Simone",
    "lastName": "Bertrand",
    "email": "simone.bertrand@alphamail.com",
    "phone": "(617) 889-4471",
    "dateOfBirth": "1979-07-28",
    "gender": "female",
    "street": "77 Harborview Terrace",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "United States",
    "username": "simone_b79",
    "ipAddress": "203.0.113.42"
  }
]`}</code></pre>

      <h2>Пример вывода в CSV</h2>
      <p>
        Те же данные в формате CSV, готовые к импорту в таблицу, базу данных или любой инструмент, принимающий файлы
        с разделителями:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Реальный пример 1: наполнение базы пользователей для нагрузочного тестирования</h2>
      <p>
        Нагрузочное тестирование пользовательского API требует наполненной базы данных. Вам нужно достаточно
        записей, чтобы смоделировать реалистичную производительность запросов, поведение пагинации и индексацию
        поиска — но вы не можете использовать реальные пользовательские данные, а создание тысяч SQL-вставок вручную
        непрактично.
      </p>
      <p>
        С генератором вымышленных данных сгенерируйте 1000 записей со всеми релевантными для пользователя полями,
        скачайте как CSV, затем импортируйте напрямую в вашу базу данных:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`-- PostgreSQL: import CSV directly into users table
COPY users (id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code)
FROM '/path/to/fake_users.csv'
DELIMITER ','
CSV HEADER;

-- MySQL equivalent:
LOAD DATA LOCAL INFILE '/path/to/fake_users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;

-- MongoDB (using mongoimport):
mongoimport --db myapp --collection users --type csv --headerline --file fake_users.csv`}</code></pre>

      <h2>Реальный пример 2: наполнение истории Storybook или дизайн-макета</h2>
      <p>
        При создании UI-компонента — таблицы пользователей, карточки контакта, списка результатов поиска — данные,
        на которых вы тестируете, определяют, поймаете ли вы реальные проблемы. Таблица из 10 пользователей, где у
        одного очень длинное имя, у другого международный символ в e-mail, а у третьего город переносится на две
        строки, вскроет баги вёрстки, которые таблица из одинаковых строк-заглушек никогда бы не показала.
      </p>
      <p>
        Сгенерируйте 10–20 записей как JSON, вставьте вывод прямо в вашу историю Storybook или файл фикстуры
        компонента:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// UserTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from './UserTable';

// Paste generated JSON directly from BrowseryTools:
const fakeUsers = [
  { id: "a3f7c2e1...", firstName: "Meredith", lastName: "Okafor", email: "meredith.okafor47@mailbox.net", city: "Columbus" },
  { id: "b8e2d5f1...", firstName: "Derek", lastName: "Nascimento", email: "d.nascimento@webfrontier.io", city: "Portland" },
  // ... more records
];

const meta: Meta<typeof UserTable> = { component: UserTable };
export default meta;

export const WithData: StoryObj<typeof UserTable> = {
  args: { users: fakeUsers },
};`}</code></pre>

      <h2>Реальный пример 3: фикстуры интеграционных тестов API</h2>
      <p>
        Интеграционным тестам конечной точки API, создающей или обновляющей записи пользователей, нужен надёжный,
        детерминированный набор входных данных. Вместо написания объектов-фикстур вручную сгенерируйте набор записей
        один раз, сохраните JSON-файл в каталог тестовых фикстур и импортируйте его в тестах:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// tests/fixtures/users.json — generated by BrowseryTools, committed to version control
// tests/api/users.test.ts

import users from '../fixtures/users.json';
import { createUser } from '../../src/api/users';

describe('POST /api/users', () => {
  it.each(users.slice(0, 10))('creates user with valid data (%s)', async (user) => {
    const response = await createUser(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
  });
});`}</code></pre>

      <h2>Импорт в коллекции Postman</h2>
      <p>
        Для тестирования API в Postman сгенерируйте свои тестовые записи как JSON и используйте функцию файла данных
        Postman, чтобы выполнить запрос по одному разу на запись. Сохраните вывод JSON как файл, затем в Postman:
        откройте бегунок коллекции, выберите запрос и прикрепите JSON-файл в качестве источника «Data». Postman
        будет проходить по каждой записи, подставляя значения в тело запроса с помощью синтаксиса переменных вроде{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code> и подобных.
      </p>
      <p>
        Это превращает написанный вручную POST-запрос в автоматизированный тест, который выполняется на 100 разных
        реалистичных записях пользователей за секунды — не требуя настройки какого-либо тестового фреймворка.
      </p>

      <h2>BrowseryTools против Mockaroo</h2>
      <p>
        Mockaroo — самый известный онлайн-генератор вымышленных данных. Это солидный инструмент, но у него есть
        трение, которое BrowseryTools устраняет полностью:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Параметр</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (бесплатно)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Нужен аккаунт", "Нет", "Да"],
              ["Лимит строк (бесплатно)", "1000 за генерацию", "1000/день всего"],
              ["Нужна подписка для большего", "Нет", "Да (50 $/год)"],
              ["Данные загружаются на сервер", "Никогда", "Да (схема + данные)"],
              ["Доступ к API", "Н/Д", "Только платные планы"],
              ["Работает офлайн", "Да (после загрузки страницы)", "Нет"],
              ["Форматы вывода", "JSON, CSV", "JSON, CSV, SQL, Excel и другие"],
              ["Разнообразие типов полей", "Покрыты распространённые типы", "Очень обширное"],
            ].map(([dim, bt, moc], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{dim}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{moc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Если вам нужны узкоспециализированные типы полей или вывод в SQL, Mockaroo остаётся ценным. Для
        распространённого случая — генерации реалистичного JSON или CSV для записей пользователей — BrowseryTools не
        требует настройки аккаунта, управления дневным лимитом и беспокойства о том, что схема ваших данных
        отправляется на сторонний сервер.
      </p>

      <h2>Приватность: вся генерация происходит локально</h2>
      <p>
        Каждое имя, e-mail, адрес и UUID, которые производит генератор, создаются JavaScript, работающим во вкладке
        вашего браузера. Типы полей, которые вы выбираете, число запрашиваемых записей и сами выходные данные
        никогда не передаются ни на один сервер. У BrowseryTools нет бэкенд-компонента, участвующего в генерации
        данных.
      </p>
      <p>
        Это менее важно при генерации именно вымышленных данных (поскольку всё вымышлено по определению), но это
        важно для схемы, на которой вы их тестируете. Если ваш выбор полей раскрывает структуру чувствительной
        внутренней системы, эта информация тоже остаётся локальной.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Вымышленные данные против анонимизации данных:</strong> это разные инструменты для разных целей.
        Генератор вымышленных данных создаёт вымышленные записи с нуля — ничто не основано на реальных людях.
        Инструмент анонимизации данных берёт реальные записи и преобразует их, чтобы убрать идентифицирующую
        информацию, сохраняя статистические свойства. Если у вас есть реальные пользовательские данные, которые
        нужно использовать в тестовой среде, анонимизация — подходящий инструмент (посмотрите на инструменты вроде
        ARX, Amnesia или pg_anonymizer для PostgreSQL). Если вам нужны тестовые данные с нуля и нет реальных данных,
        на которых их основать, генератор вымышленных данных вроде этого — именно то, что нужно.
      </div>

      <h2>Сгенерируйте свой первый набор данных прямо сейчас</h2>
      <p>
        Наполняете ли вы базу для нагрузочного теста, заполняете историю Storybook, пишете фикстуры для тестов API
        или просто демонстрируете функцию с чем-то, что выглядит реальным — реалистичные вымышленные данные являются
        правильной основой, и их генерация должна занимать 30 секунд.
      </p>
      <p>
        Откройте <Link href="/tools/fake-data">генератор вымышленных данных BrowseryTools</Link>, выберите поля,
        задайте число записей, выберите JSON или CSV и нажмите «Generate». Без аккаунта, без лимита строк, бесплатно,
        ничего никуда не загружается.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Генерируйте реалистичные тестовые данные за секунды</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          До 1000 записей. JSON или CSV. Имена, e-mail, адреса, UUID, кредитные карты и не только.
          Бесплатно, локально, без аккаунта.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Открыть генератор вымышленных данных →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Связанные инструменты:{" "}
        <Link href="/tools/json-formatter">Форматировщик JSON</Link> ·{" "}
        <Link href="/tools/uuid-generator">Генератор UUID</Link> ·{" "}
        <Link href="/tools/regex-tester">Тестер регулярных выражений</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV в JSON</Link> ·{" "}
        <Link href="/">Все инструменты BrowseryTools</Link>
      </p>
      <ToolCTA slug="fake-data" variant="card" />
    </div>
  );
}
