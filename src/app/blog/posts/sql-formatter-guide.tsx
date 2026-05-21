export default function Content() {
  return (
    <div>
      <p>
        Every developer has been there. You pull a slow query out of the application logs, copy it
        into your editor, and stare at a 300-character wall of lowercase text with no spaces, no
        line breaks, and no mercy. Or you find a Stack Overflow answer with the exact query you
        need, but it is written as a one-liner. Or your ORM helpfully logs the SQL it is generating
        — as a single concatenated string. In all of these cases, the raw query is technically
        correct but practically unreadable.
      </p>
      <p>
        Formatting SQL is not about aesthetics. It is about being able to understand what a query
        is doing at a glance — which tables it reads from, which conditions it filters by, and
        which columns it returns. A well-formatted query can be reviewed, debugged, and optimized
        in minutes. An unformatted one can waste hours.
      </p>
      <p>
        The <a href="/tools/sql-formatter">BrowseryTools SQL Formatter</a> lets you paste any SQL
        query and instantly format it with proper indentation, uppercase keywords, and clause
        separation — all processed locally in your browser, with no query ever sent to a server.
      </p>

      <h2>Why Unformatted SQL Is So Painful</h2>
      <p>
        SQL is one of the few languages where developers routinely work with code they did not
        write and cannot reformat at the source. Consider the three most common sources of ugly SQL:
      </p>
      <ul>
        <li>
          <strong>ORM-generated queries.</strong> Hibernate, SQLAlchemy, ActiveRecord, and their
          cousins generate SQL dynamically. When you enable query logging to debug a performance
          issue, you get the raw generated SQL — usually a single line with dynamic parameter
          values, aliases like <code>t0_</code>, and join conditions that take a few reads to parse.
        </li>
        <li>
          <strong>Query logs from production databases.</strong> MySQL's slow query log and
          PostgreSQL's <code>pg_stat_statements</code> store queries as they were submitted — no
          formatting applied. These are invaluable for performance analysis but nearly impossible
          to read without reformatting first.
        </li>
        <li>
          <strong>Stack Overflow and documentation one-liners.</strong> Code shared in answers and
          docs is often compressed into a single line to save vertical space. The logic is sound
          but the layout makes it hard to adapt to your own schema.
        </li>
      </ul>

      <h2>Before and After: The Same Query, Formatted</h2>
      <p>
        Here is a realistic query as it might appear in a slow query log or ORM output — all on
        one line with lowercase keywords:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        After formatting with consistent SQL conventions, the same query becomes immediately
        readable:
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
        The structure is now immediately visible: you can see that this is a user report pulling
        order counts and spend totals, filtered to active users from 2024, grouped by user, and
        limited to the top 20 spenders. That took five seconds to understand — instead of five
        minutes.
      </p>

      <h2>SQL Formatting Conventions</h2>
      <p>
        There is no single official SQL style guide, but a set of widely accepted conventions has
        emerged across the industry. Following these makes your SQL readable to any developer who
        knows the language.
      </p>

      <h3>Uppercase Keywords</h3>
      <p>
        SQL keywords — <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code> — should be uppercase. Table names, column names, aliases, and string
        literals stay in their natural case. This visual contrast between KEYWORDS and identifiers
        makes queries scannable at a glance.
      </p>

      <h3>Each Major Clause on Its Own Line</h3>
      <p>
        Every top-level clause starts on a new line:{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. This gives the query a
        clear visual skeleton. When you open a formatted query, your eye immediately finds each
        clause because they all start at the left margin (or at a consistent indent level).
      </p>

      <h3>Indented Column Lists and Conditions</h3>
      <p>
        Column names in the <code>SELECT</code> list and conditions in <code>WHERE</code> are
        indented by four spaces (or one tab). Each <code>AND</code> and <code>OR</code> in a{" "}
        <code>WHERE</code> clause starts on its own line at the same indent level as the first
        condition, making it trivial to add, remove, or comment out individual conditions:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Comma Placement: Two Schools of Thought</h3>
      <p>
        The comma placement debate in SQL is similar to the trailing-comma debate in JavaScript.
        There are two legitimate styles:
      </p>
      <ul>
        <li>
          <strong>Trailing commas</strong> (comma at the end of each line): the most common style,
          matches how most developers write lists in other languages. The downside is that commenting
          out the last item requires also removing its trailing comma from the item above it.
        </li>
        <li>
          <strong>Comma-first</strong> (comma at the start of each line after the first): makes it
          easy to comment out any individual line without touching adjacent lines. Favored by
          teams that frequently modify column lists during development.
        </li>
      </ul>
      <p>
        Both are valid. Pick one and use it consistently within a project. The BrowseryTools SQL
        Formatter uses trailing commas by default, which aligns with the majority of style guides
        and is the convention most readers expect.
      </p>

      <h3>Aligned Aliases with AS</h3>
      <p>
        Always use explicit <code>AS</code> for aliases — never the implicit bare-name style that
        some dialects allow (<code>COUNT(o.id) order_count</code>). When multiple aliases appear
        in a <code>SELECT</code> list, aligning the <code>AS</code> keyword to the same column
        makes the alias list scannable:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>How to Read a Complex Query with Multiple JOINs</h2>
      <p>
        When you encounter a query with three, four, or five JOINs, do not start from the top.
        Start from the <code>FROM</code> clause. That tells you the primary table — the anchor of
        the query. Each subsequent <code>JOIN</code> adds another table to the result set, and the
        <code>ON</code> condition tells you how the rows of that table relate to the rows already
        accumulated. Only after understanding the data model from <code>FROM</code> and{" "}
        <code>JOIN</code> should you go back to <code>SELECT</code> to see which columns are
        returned, then <code>WHERE</code> for filtering, then <code>GROUP BY</code> for
        aggregation.
      </p>
      <p>
        Reading order for any SELECT query: <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        This matches the order the database engine actually processes clauses, and it maps to how
        you should reason about the data flowing through each step.
      </p>

      <h2>Subquery Formatting</h2>
      <p>
        Subqueries — queries nested inside another query — deserve their own indentation level.
        Each level of nesting adds one level of indent, so the structure remains clear even with
        two or three levels deep:
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
        The inner query is clearly subordinate to the outer one. The closing parenthesis is aligned
        with the keyword (<code>WHERE</code>) that introduced the subquery. For deeply nested or
        complex subqueries, CTEs (Common Table Expressions) are almost always preferable because
        they can be named and placed at the top of the query where they are easy to read.
      </p>

      <h2>Common Query Patterns and Their Formatted Forms</h2>

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

      <h3>UPDATE with JOIN (MySQL / SQL Server syntax)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>WITH (CTE) Query</h3>
      <p>
        Common Table Expressions are the most powerful formatting tool in SQL. They let you give
        names to intermediate result sets, turning a deeply nested query into a series of clearly
        named steps:
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

      <h2>Why Formatting Matters for Performance Review</h2>
      <p>
        Formatting is not just about readability for humans — it also makes performance problems
        visible. Once a query is properly laid out, several classes of issue become easy to spot:
      </p>
      <ul>
        <li>
          <strong>Missing indexes.</strong> A formatted <code>WHERE</code> clause with all
          conditions on their own lines makes it straightforward to check that each condition
          column has an index. Unformatted, conditions buried in a one-liner are easy to overlook.
        </li>
        <li>
          <strong>Cartesian products.</strong> A <code>JOIN</code> without an <code>ON</code>{" "}
          clause (or with an always-true condition) produces a cross-join that multiplies row
          counts. When each <code>JOIN</code> is on its own line with its <code>ON</code> condition
          indented below it, a missing condition is immediately obvious.
        </li>
        <li>
          <strong>N+1 query patterns.</strong> Seeing a query select a list of IDs in a subquery
          and then join back to the same table is a signal that the query could be rewritten with
          a direct join — eliminating the N+1 at the SQL level rather than in application code.
        </li>
        <li>
          <strong>Functions on indexed columns.</strong> <code>WHERE DATE(created_at) = '2024-01-01'</code>{" "}
          prevents the database from using an index on <code>created_at</code>. In a formatted
          query this pattern stands out; in a minified one-liner it is invisible.
        </li>
      </ul>

      <h2>SQL Dialects: Syntax Differences to Know</h2>
      <p>
        SQL is a standard (ISO/IEC 9075), but every major database extends it with dialect-specific
        syntax. Here is what matters for formatting:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Database</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Identifier quoting</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Notable differences</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"double_quotes"</code></td>
              <td style={{padding: "10px 16px"}}>Case-sensitive identifiers when double-quoted; <code>ILIKE</code> for case-insensitive matching; <code>RETURNING</code> clause on INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`backticks`</code></td>
              <td style={{padding: "10px 16px"}}>Case-insensitive by default; <code>LIMIT offset, count</code> syntax; <code>GROUP BY</code> historically allowed non-aggregated columns</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"double_quotes"</code> or <code>[brackets]</code></td>
              <td style={{padding: "10px 16px"}}>Permissive type system; no <code>RIGHT JOIN</code> or <code>FULL OUTER JOIN</code> in older versions; <code>PRAGMA</code> statements for schema info</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[square_brackets]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> instead of <code>LIMIT</code>; <code>NOLOCK</code> hints; <code>GETDATE()</code> instead of <code>NOW()</code>; <code>ISNULL()</code> instead of <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL: Double-Quotes and Case Sensitivity</h3>
      <p>
        In PostgreSQL, unquoted identifiers are folded to lowercase. If you created a table as{" "}
        <code>CREATE TABLE "UserProfiles"</code> (with double-quotes), you must always reference
        it as <code>"UserProfiles"</code> with quotes. Without quotes, PostgreSQL looks for{" "}
        <code>userprofiles</code> and fails. This is a common source of confusion when migrating
        from MySQL or when ORMs generate schema with mixed-case names.
      </p>

      <h3>MySQL: Backtick Quoting</h3>
      <p>
        MySQL uses backticks to quote identifiers, not double-quotes (though MySQL in{" "}
        <code>ANSI_QUOTES</code> mode accepts double-quotes). You will see backticks in
        MySQL-generated DDL and in queries exported by tools like phpMyAdmin. The SQL Formatter
        handles backtick-quoted identifiers and preserves them so the output remains valid for
        your specific database.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Tip — always specify your dialect:</strong> When pasting a query into a formatter,
        select the correct SQL dialect. MySQL and PostgreSQL have subtly different syntax that
        affects how the formatter handles certain constructs, especially around <code>GROUP BY</code>,
        window functions, and string functions.
      </div>

      <h2>How to Use the BrowseryTools SQL Formatter</h2>
      <p>
        Using the formatter takes three steps:
      </p>
      <ul>
        <li>
          <strong>Paste your query.</strong> Copy the raw SQL from your log file, ORM output, or
          editor and paste it into the input area. The formatter accepts any amount of SQL —
          single statements, multiple statements, or full scripts.
        </li>
        <li>
          <strong>Click Format.</strong> The formatter applies uppercase keywords, clause
          separation, indentation, and consistent spacing. The result appears in the output panel
          instantly — there is no network request and no delay.
        </li>
        <li>
          <strong>Copy the result.</strong> Use the Copy button to put the formatted SQL on your
          clipboard, ready to paste into your editor, your database client, or your PR.
        </li>
      </ul>
      <p>
        Because the formatter runs entirely in your browser, you can safely paste queries
        containing sensitive data — production table names, customer IDs, internal schema details
        — without any of it leaving your machine. There is no backend to log your queries.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Your queries stay private:</strong> SQL queries frequently contain schema details,
        business logic, and data that should not leave your environment. The BrowseryTools SQL
        Formatter runs 100% in your browser — your queries are never sent to any server, never
        logged, and never stored. Paste production queries with confidence.
      </div>

      <h2>Format Your SQL Queries Now</h2>
      <p>
        Whether you are untangling an ORM-generated monster, reviewing a colleague's pull request,
        debugging a slow query, or just trying to understand what a Stack Overflow answer is
        actually doing — formatted SQL makes every one of these tasks faster and less error-prone.
        Good formatting is the cheapest performance optimization you can make before reaching for
        EXPLAIN.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free SQL Formatter — Instant, Private, No Sign-Up
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Paste any SQL query and format it with proper indentation and uppercase keywords in one click.
          Nothing leaves your browser.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open SQL Formatter →
        </a>
      </div>
    </div>
  );
}
