export default function Content() {
  return (
    <div>
      <p>
        Todo desarrollador ha pasado por esto. Extraes una consulta lenta del registro de la
        aplicación, la copias en tu editor y te encuentras mirando una cadena de 300 caracteres en
        minúsculas sin espacios, sin saltos de línea y sin compasión. O encuentras una respuesta en
        Stack Overflow con exactamente la consulta que necesitas, pero está escrita en una sola línea.
        O tu ORM registra el SQL que genera —como una cadena concatenada. En todos estos casos, la
        consulta sin formato es técnicamente correcta pero prácticamente ilegible.
      </p>
      <p>
        Formatear SQL no es una cuestión estética. Se trata de poder entender de un vistazo lo que
        hace una consulta: de qué tablas lee, por qué condiciones filtra y qué columnas devuelve. Una
        consulta bien formateada puede revisarse, depurarse y optimizarse en minutos. Una sin formato
        puede consumir horas.
      </p>
      <p>
        El{" "}
        <a href="/tools/sql-formatter">Formateador SQL de BrowseryTools</a> te permite pegar cualquier
        consulta SQL y darle formato al instante con sangría apropiada, palabras clave en mayúsculas
        y separación de cláusulas —todo procesado localmente en tu navegador, sin que ninguna consulta
        se envíe jamás a un servidor.
      </p>

      <h2>Por Qué el SQL sin Formato Es tan Doloroso</h2>
      <p>
        SQL es uno de los pocos lenguajes en los que los desarrolladores trabajan habitualmente con
        código que no escribieron y que no pueden reformatear en el origen. Considera las tres fuentes
        más comunes de SQL feo:
      </p>
      <ul>
        <li>
          <strong>Consultas generadas por ORM.</strong> Hibernate, SQLAlchemy, ActiveRecord y similares
          generan SQL dinámicamente. Cuando habilitas el registro de consultas para depurar un problema
          de rendimiento, obtienes el SQL en bruto generado —generalmente una sola línea con valores de
          parámetros dinámicos, alias como <code>t0_</code> y condiciones de join que requieren varias
          lecturas para interpretarse.
        </li>
        <li>
          <strong>Registros de consultas de bases de datos en producción.</strong> El registro de
          consultas lentas de MySQL y <code>pg_stat_statements</code> de PostgreSQL almacenan las
          consultas tal como se enviaron —sin formato aplicado. Son invaluables para el análisis de
          rendimiento pero casi imposibles de leer sin reformatear antes.
        </li>
        <li>
          <strong>Stack Overflow y documentación en una línea.</strong> El código compartido en
          respuestas y documentación a menudo se comprime en una sola línea para ahorrar espacio
          vertical. La lógica es correcta pero el formato dificulta adaptarla a tu propio esquema.
        </li>
      </ul>

      <h2>Antes y Después: la Misma Consulta, Formateada</h2>
      <p>
        Aquí tienes una consulta realista tal como podría aparecer en un registro de consultas lentas
        o en la salida de un ORM —todo en una línea con palabras clave en minúsculas:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        Después de formatear con convenciones SQL consistentes, la misma consulta se vuelve
        inmediatamente legible:
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
        La estructura es ahora inmediatamente visible: puedes ver que se trata de un informe de
        usuarios que extrae conteos de pedidos y totales de gasto, filtrado a usuarios activos desde
        2024, agrupado por usuario y limitado a los 20 mayores compradores. Eso tomó cinco segundos
        entenderlo —en lugar de cinco minutos.
      </p>

      <h2>Convenciones de Formato SQL</h2>
      <p>
        No existe una guía de estilo SQL oficial única, pero ha surgido un conjunto de convenciones
        ampliamente aceptadas en toda la industria. Seguirlas hace que tu SQL sea legible para
        cualquier desarrollador que conozca el lenguaje.
      </p>

      <h3>Palabras Clave en Mayúsculas</h3>
      <p>
        Las palabras clave SQL —<code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code>— deben ir en mayúsculas. Los nombres de tabla, columna, alias y
        literales de cadena se mantienen en su caso natural. Este contraste visual entre PALABRAS_CLAVE
        e identificadores hace que las consultas sean legibles de un vistazo.
      </p>

      <h3>Cada Cláusula Principal en Su Propia Línea</h3>
      <p>
        Cada cláusula de nivel superior comienza en una nueva línea:{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. Esto da a la consulta un
        esqueleto visual claro. Cuando abres una consulta formateada, tu vista encuentra inmediatamente
        cada cláusula porque todas comienzan en el margen izquierdo (o en un nivel de sangría consistente).
      </p>

      <h3>Listas de Columnas y Condiciones con Sangría</h3>
      <p>
        Los nombres de columna en la lista <code>SELECT</code> y las condiciones en <code>WHERE</code>
        tienen sangría de cuatro espacios (o una tabulación). Cada <code>AND</code> y <code>OR</code>
        en una cláusula <code>WHERE</code> comienza en su propia línea al mismo nivel de sangría que
        la primera condición, lo que hace trivial añadir, eliminar o comentar condiciones individuales:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Posición de la Coma: Dos Escuelas de Pensamiento</h3>
      <p>
        El debate sobre la posición de la coma en SQL es similar al debate sobre la coma final en
        JavaScript. Hay dos estilos legítimos:
      </p>
      <ul>
        <li>
          <strong>Comas finales</strong> (coma al final de cada línea): el estilo más común, coincide
          con la forma en que la mayoría de los desarrolladores escriben listas en otros lenguajes.
          La desventaja es que comentar el último elemento requiere también eliminar su coma final del
          elemento anterior.
        </li>
        <li>
          <strong>Coma primero</strong> (coma al inicio de cada línea después de la primera): facilita
          comentar cualquier línea individual sin tocar las adyacentes. Favorecido por equipos que
          modifican frecuentemente las listas de columnas durante el desarrollo.
        </li>
      </ul>
      <p>
        Ambos son válidos. Elige uno y úsalo de forma consistente dentro de un proyecto. El Formateador
        SQL de BrowseryTools usa comas finales por defecto, lo que se alinea con la mayoría de las guías
        de estilo y es la convención que la mayoría de los lectores espera.
      </p>

      <h3>Alias Alineados con AS</h3>
      <p>
        Usa siempre <code>AS</code> explícito para los alias —nunca el estilo implícito sin AS que
        algunos dialectos permiten (<code>COUNT(o.id) order_count</code>). Cuando aparecen varios
        alias en una lista <code>SELECT</code>, alinear la palabra clave <code>AS</code> a la misma
        columna hace que la lista de alias sea más legible:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>Cómo Leer una Consulta Compleja con Múltiples JOINs</h2>
      <p>
        Cuando te encuentras con una consulta con tres, cuatro o cinco JOINs, no empieces desde arriba.
        Empieza por la cláusula <code>FROM</code>. Eso te indica la tabla primaria, el ancla de la
        consulta. Cada <code>JOIN</code> posterior añade otra tabla al conjunto de resultados, y la
        condición <code>ON</code> te dice cómo se relacionan las filas de esa tabla con las ya
        acumuladas. Solo después de entender el modelo de datos desde <code>FROM</code> y{" "}
        <code>JOIN</code> debes volver a <code>SELECT</code> para ver qué columnas se devuelven, luego
        <code>WHERE</code> para el filtrado y <code>GROUP BY</code> para la agregación.
      </p>
      <p>
        Orden de lectura para cualquier consulta SELECT: <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        Esto corresponde al orden en que el motor de base de datos procesa realmente las cláusulas y
        a cómo debes razonar sobre los datos que fluyen por cada paso.
      </p>

      <h2>Formato de Subconsultas</h2>
      <p>
        Las subconsultas —consultas anidadas dentro de otra consulta— merecen su propio nivel de
        sangría. Cada nivel de anidamiento añade un nivel de sangría, por lo que la estructura
        permanece clara incluso con dos o tres niveles de profundidad:
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
        La consulta interna es claramente subordinada a la externa. El paréntesis de cierre está
        alineado con la palabra clave (<code>WHERE</code>) que introdujo la subconsulta. Para
        subconsultas profundamente anidadas o complejas, las CTE (Common Table Expressions) son casi
        siempre preferibles porque pueden nombrarse y colocarse al principio de la consulta donde son
        fáciles de leer.
      </p>

      <h2>Patrones de Consulta Comunes y Sus Formas Formateadas</h2>

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

      <h3>UPDATE con JOIN (sintaxis MySQL / SQL Server)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>Consulta WITH (CTE)</h3>
      <p>
        Las Common Table Expressions son la herramienta de formato más potente en SQL. Permiten
        asignar nombres a conjuntos de resultados intermedios, convirtiendo una consulta profundamente
        anidada en una serie de pasos con nombres claros:
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

      <h2>Por Qué el Formato Importa para la Revisión de Rendimiento</h2>
      <p>
        El formato no es solo cuestión de legibilidad para humanos —también hace visibles los problemas
        de rendimiento. Una vez que una consulta está bien estructurada, varias clases de problemas se
        vuelven fáciles de detectar:
      </p>
      <ul>
        <li>
          <strong>Índices faltantes.</strong> Una cláusula <code>WHERE</code> formateada con todas las
          condiciones en sus propias líneas hace que sea sencillo verificar que cada columna de condición
          tiene un índice. Sin formato, las condiciones enterradas en una sola línea son fáciles de pasar
          por alto.
        </li>
        <li>
          <strong>Productos cartesianos.</strong> Un <code>JOIN</code> sin una cláusula <code>ON</code>{" "}
          (o con una condición siempre verdadera) produce un cross-join que multiplica los recuentos de
          filas. Cuando cada <code>JOIN</code> está en su propia línea con su condición <code>ON</code>
          sangrada debajo, una condición faltante es inmediatamente obvia.
        </li>
        <li>
          <strong>Patrones de consulta N+1.</strong> Ver una consulta que selecciona una lista de IDs
          en una subconsulta y luego hace un join de vuelta a la misma tabla es una señal de que la
          consulta podría reescribirse con un join directo —eliminando el N+1 a nivel SQL en lugar de
          en el código de la aplicación.
        </li>
        <li>
          <strong>Funciones sobre columnas indexadas.</strong>{" "}
          <code>WHERE DATE(created_at) = '2024-01-01'</code> impide que la base de datos use un índice
          sobre <code>created_at</code>. En una consulta formateada este patrón resalta; en una de una
          sola línea es invisible.
        </li>
      </ul>

      <h2>Dialectos SQL: Diferencias de Sintaxis a Conocer</h2>
      <p>
        SQL es un estándar (ISO/IEC 9075), pero cada base de datos importante lo extiende con sintaxis
        específica del dialecto. Esto es lo que importa para el formato:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base de datos</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Comillas de identificadores</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Diferencias destacadas</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"comillas_dobles"</code></td>
              <td style={{padding: "10px 16px"}}>Identificadores sensibles a mayúsculas cuando van entre comillas; <code>ILIKE</code> para coincidencias sin distinción de mayúsculas; cláusula <code>RETURNING</code> en INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`acentos_graves`</code></td>
              <td style={{padding: "10px 16px"}}>Sin distinción de mayúsculas por defecto; sintaxis <code>LIMIT offset, count</code>; <code>GROUP BY</code> históricamente permitía columnas no agregadas</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"comillas_dobles"</code> o <code>[corchetes]</code></td>
              <td style={{padding: "10px 16px"}}>Sistema de tipos permisivo; sin <code>RIGHT JOIN</code> ni <code>FULL OUTER JOIN</code> en versiones antiguas; sentencias <code>PRAGMA</code> para información del esquema</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[corchetes_cuadrados]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> en lugar de <code>LIMIT</code>; sugerencias <code>NOLOCK</code>; <code>GETDATE()</code> en lugar de <code>NOW()</code>; <code>ISNULL()</code> en lugar de <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL: Comillas Dobles y Sensibilidad a Mayúsculas</h3>
      <p>
        En PostgreSQL, los identificadores sin comillas se convierten a minúsculas. Si creaste una tabla
        como <code>CREATE TABLE "UserProfiles"</code> (con comillas dobles), debes referenciarla siempre
        como <code>"UserProfiles"</code> con comillas. Sin comillas, PostgreSQL busca{" "}
        <code>userprofiles</code> y falla. Esto es una fuente común de confusión al migrar desde MySQL
        o cuando los ORMs generan esquemas con nombres mixtos.
      </p>

      <h3>MySQL: Comillas con Acento Grave</h3>
      <p>
        MySQL usa acentos graves para citar identificadores, no comillas dobles (aunque MySQL en modo{" "}
        <code>ANSI_QUOTES</code> acepta comillas dobles). Verás acentos graves en el DDL generado por
        MySQL y en consultas exportadas por herramientas como phpMyAdmin. El Formateador SQL maneja
        identificadores con acento grave y los preserva para que la salida siga siendo válida para tu
        base de datos específica.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Consejo — especifica siempre tu dialecto:</strong> Al pegar una consulta en un formateador,
        selecciona el dialecto SQL correcto. MySQL y PostgreSQL tienen sintaxis sutilmente diferentes que
        afectan la forma en que el formateador maneja ciertas construcciones, especialmente en torno a{" "}
        <code>GROUP BY</code>, funciones de ventana y funciones de cadena.
      </div>

      <h2>Cómo Usar el Formateador SQL de BrowseryTools</h2>
      <p>
        Usar el formateador toma tres pasos:
      </p>
      <ul>
        <li>
          <strong>Pega tu consulta.</strong> Copia el SQL en bruto de tu archivo de registro, salida de
          ORM o editor y pégalo en el área de entrada. El formateador acepta cualquier cantidad de SQL
          —sentencias individuales, múltiples sentencias o scripts completos.
        </li>
        <li>
          <strong>Haz clic en Formatear.</strong> El formateador aplica palabras clave en mayúsculas,
          separación de cláusulas, sangría y espaciado consistente. El resultado aparece en el panel de
          salida al instante —sin solicitud de red ni demora.
        </li>
        <li>
          <strong>Copia el resultado.</strong> Usa el botón Copiar para poner el SQL formateado en tu
          portapapeles, listo para pegar en tu editor, tu cliente de base de datos o tu PR.
        </li>
      </ul>
      <p>
        Como el formateador se ejecuta completamente en tu navegador, puedes pegar con seguridad
        consultas que contengan datos sensibles —nombres de tablas de producción, IDs de clientes,
        detalles internos del esquema— sin que nada salga de tu máquina. No hay backend que registre
        tus consultas.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tus consultas se mantienen privadas:</strong> Las consultas SQL frecuentemente contienen
        detalles del esquema, lógica de negocio y datos que no deben salir de tu entorno. El Formateador
        SQL de BrowseryTools se ejecuta 100% en tu navegador —tus consultas nunca se envían a ningún
        servidor, nunca se registran y nunca se almacenan. Pega consultas de producción con confianza.
      </div>

      <h2>Formatea Tus Consultas SQL Ahora</h2>
      <p>
        Ya sea que estés desenredando un monstruo generado por un ORM, revisando el pull request de un
        colega, depurando una consulta lenta o simplemente intentando entender lo que hace una respuesta
        de Stack Overflow —el SQL formateado hace que cada una de estas tareas sea más rápida y menos
        propensa a errores. El buen formato es la optimización de rendimiento más barata que puedes hacer
        antes de recurrir a EXPLAIN.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Formateador SQL Gratuito — Instantáneo, Privado, Sin Registro
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Pega cualquier consulta SQL y dale formato con sangría apropiada y palabras clave en mayúsculas
          con un clic. Nada sale de tu navegador.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Formateador SQL →
        </a>
      </div>
    </div>
  );
}
