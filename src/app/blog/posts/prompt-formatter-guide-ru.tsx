export default function Content() {
  return (
    <div>
      <p>
        Разница между посредственным AI-ответом и по-настоящему полезным редко связана с
        возможностями модели — почти всегда она определяется тем, как был написан промпт.
        Структура, чёткость и правильные форматирующие сигналы способны превратить расплывчатый,
        многословный вывод в точный, практичный ответ. Если вы когда-либо ощущали, что AI-инструмент
        не раскрывает свой потенциал, формат промпта — первое, что стоит пересмотреть.
      </p>
      <p>
        Воспользуйтесь{" "}
        <a href="/tools/prompt-formatter">Форматтером промптов BrowseryTools</a> — бесплатно,
        без регистрации, всё остаётся в браузере — чтобы очистить, реструктурировать и
        доработать промпты перед отправкой их в любую AI-модель.
      </p>

      <h2>Почему форматирование важнее, чем кажется</h2>
      <p>
        Языковые модели не читают промпты так, как человек просматривает сообщение. Они
        обрабатывают токены последовательно и чувствительны к тому, как сформулированы,
        упорядочены и разграничены инструкции. Промпт, написанный как длинный, неразрывный
        абзац, прячет самые важные инструкции в середину — именно туда, где они меньше всего
        влияют на вывод. Хорошо отформатированный промпт ставит ограничения и цели в начало,
        использует чёткие разделители между секциями и явно указывает ожидаемый формат вывода.
      </p>
      <p>
        Думайте о форматировании промптов как о составлении технического задания для
        подрядчика. Чем точнее вы описываете результат, ограничения и контекст, тем ближе
        к нужному будет первый черновик.
      </p>

      <h2>Техника 1: Назначение роли</h2>
      <p>
        Одна из наиболее эффективных техник форматирования — задать модели роль перед
        основной задачей. Это активирует конкретный регистр и набор соглашений, которые
        модель ассоциирует с данной ролью, — что даёт более стабильный вывод.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Без роли:
"Explain how to write a good README."

✅ С ролью:
"You are a senior open-source maintainer who reviews hundreds of repositories.
Explain how to write a README that communicates a project's value clearly
to both technical and non-technical readers."`}
      </pre>
      <p>
        Указание роли не ограничивает модель — оно её фокусирует. Вы получаете текст,
        соответствующий стандартам и словарному запасу персонажа, а не обобщённый обзор.
      </p>

      <h2>Техника 2: Чёткие блоки инструкций</h2>
      <p>
        Разделите описание задачи, контекст и ограничения на отдельные секции. Для этого
        хорошо подходят заголовки Markdown и разделители на тройных обратных кавычках. Многие
        модели обучены на документах с такой структурой и хорошо на неё реагируют.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Task
Summarize the following customer feedback into three actionable product priorities.

## Context
This is feedback from B2B SaaS users collected over Q4 2025. The audience for
this summary is a product manager preparing for a sprint planning session.

## Constraints
- Maximum 150 words total
- Use bullet points
- Do not include direct quotes

## Input
"""
[customer feedback goes here]
"""`}
      </pre>
      <p>
        Помеченные секции сразу показывают, что куда относится. Вы можете независимо изменить
        контекст или ограничения, не переписывая весь промпт.
      </p>

      <h2>Техника 3: Few-shot примеры</h2>
      <p>
        Если вам нужен вывод в определённом стиле или формате, самая надёжная техника —
        включить один-два примера желаемого. Это называется few-shot prompting и стабильно
        превосходит длинные словесные описания нужного формата.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Convert a raw feature request into a user story using the following format.

Example input: "Users want to export data to CSV"
Example output: "As a data analyst, I want to export my dashboard data to CSV
so that I can perform custom analysis in spreadsheet tools."

Now convert: "Users want to be notified when a report is ready"`}
      </pre>
      <p>
        Обратите внимание, что пример определяет и структуру («Как... я хочу... чтобы...»),
        и ожидаемый уровень конкретизации. Не нужно объяснять формат прозой — пример его
        показывает.
      </p>

      <h2>Техника 4: Цепочка мысли (Chain-of-Thought)</h2>
      <p>
        Для задач рассуждения — отладки, анализа, вычислений, принятия решений — явная просьба
        думать пошагово перед финальным ответом резко повышает точность. Это не трюк: это
        изменяет то, как модель распределяет внутренние вычисления при генерации.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Без цепочки мысли:
"What is the best database for a real-time multiplayer game?"

✅ С цепочкой мысли:
"What is the best database for a real-time multiplayer game?
Think through the requirements step by step — latency, concurrency model,
data structure, consistency guarantees — before giving your recommendation."`}
      </pre>
      <p>
        Инструкция по пошаговому анализу выводит на поверхность промежуточные рассуждения,
        которые вы можете оценить. Вы также гораздо чаще замечаете ошибки, когда видите
        цепочку рассуждений, а не только вывод.
      </p>

      <h2>Техника 5: Структурированные промпты на XML и JSON</h2>
      <p>
        Когда вам нужен структурированный вывод — JSON-объект, таблица, конкретная схема —
        явно укажите формат вывода и используйте соответствующую структуру в промпте.
        Claude и GPT-4 особенно хорошо реагируют на секции с XML-тегами.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Extract the following fields from the job description below.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[job description text here]
</input>`}
      </pre>
      <p>
        XML-теги выступают однозначными разделителями. Модель чётко понимает, где заканчиваются
        инструкции и где начинаются входные данные, что снижает риск обработки инструкций
        как части обрабатываемого контента.
      </p>

      <h2>Типичные ошибки форматирования промптов</h2>
      <ul>
        <li><strong>Основная инструкция спрятана в середине</strong> — указывайте, что нужно сделать, в начале, а не после трёх абзацев контекста. Модели придают больший вес более ранним токенам.</li>
        <li><strong>Противоречивые ограничения</strong> — «Будь лаконичным, но охвати каждую деталь» вынуждает модель делать произвольный компромисс. Укажите, что важнее.</li>
        <li><strong>Предположение об общем контексте</strong> — у модели нет памяти о предыдущих сессиях. Включайте весь релевантный контекст в сам промпт.</li>
        <li><strong>Формат вывода не указан</strong> — если нужен список, скажите «список». Если нужен JSON, скажите «JSON». Если ответ должен быть не длиннее 200 слов, скажите об этом. Неуказанный формат = непредсказуемый вывод.</li>
        <li><strong>Чрезмерно детализированные стилистические правила</strong> — длинные списки запрещений («не делай X, никогда не говори Y») расходуют контекст и нередко дают натянутый, неловкий вывод. Одно-два сильных ограничения лучше десяти слабых.</li>
      </ul>

      <h2>До и после: один и тот же запрос, переформатированный</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ До:
"Can you help me write an email to my boss about a project delay?
We were supposed to launch the new payment integration last Friday but
the third-party API had some issues and now we're looking at maybe
next Wednesday or Thursday, can you make it professional?"

✅ После:
You are an experienced business communicator.

## Task
Write a professional delay notification email from a developer to their manager.

## Context
- Project: payment gateway integration
- Original deadline: last Friday
- New estimate: Wednesday or Thursday this week
- Cause: issues with a third-party API (not our team's fault)

## Tone
Professional, direct, and solution-focused — not defensive or apologetic

## Output
Subject line + email body, under 150 words`}
      </pre>
      <p>
        Переформатированный вариант требует на 20 секунд больше времени на написание и
        даёт вывод, который можно использовать немедленно — вместо двух-трёх корректировок.
      </p>

      <h2>Использование Форматтера промптов</h2>
      <p>
        <a href="/tools/prompt-formatter">Форматтер промптов BrowseryTools</a> помогает
        применять эти техники, не запоминая каждое правило. Вставьте сырой промпт, выберите
        подходящую структуру и получите чистую, хорошо организованную версию, готовую к
        отправке в ChatGPT, Claude, Gemini или любую другую модель. Аккаунт не нужен, и
        ваши промпты никогда не покидают браузер.
      </p>

      <h2>Итоги</h2>
      <p>
        Форматирование промптов — это навык, который поддаётся обучению и имеет измеримый
        результат. Назначение роли фокусирует модель, чёткие разделители секций устраняют
        неоднозначность, few-shot примеры задают ожидаемый формат, а явные ограничения
        вывода убирают угадывание. Лучший промпт — не самый сложный, а тот, что оставляет
        меньше всего вопросов без ответа до начала генерации.
      </p>
    </div>
  );
}
