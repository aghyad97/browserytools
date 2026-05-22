export default function Content() {
  return (
    <div>
      <p>
        Abre cualquier archivo de registro. Mira el campo de expiración en un token JWT. Revisa el campo{" "}
        <code>created_at</code> en una respuesta de API. Es muy probable que encuentres un número como{" "}
        <code>1711065600</code> o <code>1711065600000</code>. Eso es una marca de tiempo Unix — un
        entero sencillo que representa un instante en el tiempo. Entender cómo funciona el tiempo Unix,
        de dónde viene y cómo manejar sus errores más comunes te ahorrará toda una clase de bugs
        sutiles, difíciles de reproducir y ocasionalmente vergonzosos en producción.
      </p>
      <p>
        Puedes convertir cualquier marca de tiempo Unix a una fecha legible (y viceversa) con el{" "}
        <a href="/tools/unix-timestamp">Conversor de Marcas de Tiempo Unix de BrowseryTools</a> — gratuito,
        sin registro, todo se procesa en tu navegador.
      </p>

      <h2>¿Qué es una marca de tiempo Unix?</h2>
      <p>
        Una marca de tiempo Unix es el número de segundos transcurridos desde la Época Unix: medianoche
        del 1 de enero de 1970, en Tiempo Universal Coordinado (UTC). Este momento — 00:00:00 UTC del
        1970-01-01 — fue elegido como punto de referencia cuando se desarrollaba el sistema operativo Unix
        a principios de los años 70. Era una fecha reciente y redonda que facilitaba los cálculos con el
        hardware de la época.
      </p>
      <p>
        La elegancia del tiempo Unix radica en que cualquier instante se representa como un único entero.
        Comparar dos marcas de tiempo es una resta. Comprobar si algo ha expirado es una comparación.
        Añadir un intervalo es una suma. Sin zonas horarias, sin aritmética de calendario, sin horario de
        verano — solo un número.
      </p>
      <p>
        A partir de 2026, la marca de tiempo Unix actual es aproximadamente <code>1.774.000.000</code>.
        Cada segundo, ese número aumenta en 1.
      </p>

      <h2>El problema del año 2038 (Y2K38)</h2>
      <p>
        Si el tiempo Unix se almacena como un entero de 32 bits con signo — como ocurría en muchas
        implementaciones tempranas — el valor máximo es <code>2.147.483.647</code>. Ese número corresponde
        a las 03:14:07 UTC del 19 de enero de 2038. Después de ese momento, un entero de 32 bits con signo
        desborda y pasa a ser un número negativo grande, y los sistemas que no hayan sido actualizados
        interpretarán las marcas de tiempo incorrectamente.
      </p>
      <p>
        Este es el problema del año 2038 (Y2K38), el equivalente en la era Unix al bug Y2K. Los sistemas
        modernos utilizan enteros de 64 bits para las marcas de tiempo, lo que extiende el rango
        representable a unos 292 mil millones de años en cualquier dirección — prácticamente infinito para
        cualquier propósito real. Sin embargo, los sistemas embebidos, las bases de datos heredadas con
        columnas de marca de tiempo de 32 bits y el código C antiguo que usa <code>time_t</code> como
        tipo de 32 bits siguen en riesgo.
      </p>

      <h2>Obtener la marca de tiempo actual</h2>
      <p>
        Así se obtiene la marca de tiempo Unix actual en los lenguajes más comunes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — returns milliseconds, divide by 1000 for seconds
const nowMs = Date.now();           // e.g. 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // e.g. 1711065600

// Python
import time
now = int(time.time())  # seconds since epoch

# Using datetime module
from datetime import datetime, timezone
now = int(datetime.now(timezone.utc).timestamp())

// Go
import "time"
now := time.Now().Unix()         // seconds
nowNano := time.Now().UnixNano() // nanoseconds

-- SQL (PostgreSQL)
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- SQL (MySQL)
SELECT UNIX_TIMESTAMP();`}
      </pre>

      <h2>Convertir marcas de tiempo a fechas legibles</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — from seconds
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiply by 1000 for ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // locale-formatted date

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: timestamp from integer
SELECT to_timestamp(1711065600);
-- Result: 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Result: 2024-03-22 00:00:00`}
      </pre>

      <h2>El bug #1 con marcas de tiempo: milisegundos vs segundos</h2>
      <p>
        <code>Date.now()</code> de JavaScript devuelve milisegundos. El estándar Unix — y prácticamente
        todos los demás lenguajes, bases de datos y APIs — utiliza segundos. Esta diferencia es la fuente
        más común de errores con marcas de tiempo.
      </p>
      <p>
        Los síntomas son inconfundibles: las fechas aparecen en 1970 (la marca de tiempo dividida por 1000
        accidentalmente, o tratada como segundos cuando en realidad son milisegundos), o las fechas aparecen
        en el año 56.000+ (segundos tratados como milisegundos y luego divididos de nuevo). Un valor en
        torno a <code>1.700.000.000</code> es casi con certeza segundos. Un valor en torno a{" "}
        <code>1.700.000.000.000</code> es casi con certeza milisegundos.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug: treating seconds as milliseconds — lands in 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct: multiply seconds by 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Defensive helper — handles both seconds and milliseconds
function toDate(ts) {
  // If it's under 10^12, it's seconds; multiply
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Problemas de zona horaria con marcas de tiempo</h2>
      <p>
        Las marcas de tiempo Unix siempre están en UTC — representan un único instante absoluto en el
        tiempo, sin zona horaria asociada. La pregunta sobre la zona horaria solo surge en la capa de
        presentación, cuando conviertes una marca de tiempo a un formato legible.
      </p>
      <p>
        El error más común es usar métodos de zona horaria local sin darse cuenta.{" "}
        <code>new Date(ts).toLocaleDateString()</code> en JavaScript devuelve la fecha en la zona horaria
        local del navegador. Si tu servidor genera una marca de tiempo a las 23:00 UTC y un usuario en
        UTC+0 y otro en UTC+1 la muestran, verán fechas de calendario distintas. Si eso es correcto o no
        depende del requisito del producto — pero debe ser una elección deliberada, no accidental.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Always explicit about timezone — use toISOString() for UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← always UTC

// Or use Intl.DateTimeFormat for locale/timezone display
new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
}).format(date);  // "Friday, March 22, 2024"`}
      </pre>

      <h2>Marcas de tiempo en bases de datos</h2>
      <p>
        Las bases de datos ofrecen dos opciones principales para almacenar fechas: un tipo de columna{" "}
        <code>TIMESTAMP</code> (que almacena un instante absoluto en el tiempo) y un tipo de columna{" "}
        <code>DATE</code> o <code>DATETIME</code> (que almacena una representación de calendario sin zona
        horaria inherente).
      </p>
      <p>
        Para campos como <code>created_at</code>, <code>updated_at</code> y marcas de tiempo de eventos,
        usa siempre una columna <code>TIMESTAMP WITH TIME ZONE</code> (o el equivalente en tu base de datos)
        en lugar de un entero simple. Esto permite que la base de datos gestione correctamente la conversión
        de zona horaria y las comparaciones, y hace que consultas como "eventos en las últimas 24 horas"
        sean precisas independientemente de la configuración de zona horaria del servidor.
      </p>
      <p>
        Cuando necesites almacenar una marca de tiempo Unix como entero sin procesar (por compatibilidad con
        sistemas externos o para máxima portabilidad), documenta claramente si está en segundos o
        milisegundos, y sé consistente en todo el esquema.
      </p>

      <h2>Marcas de tiempo en JWTs y APIs</h2>
      <p>
        Los JSON Web Tokens (JWTs) utilizan marcas de tiempo Unix (en segundos) para sus claims de tiempo:
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — issued at: el momento en que se creó el token</li>
        <li><strong><code>exp</code></strong> — expiry: el momento a partir del cual el token no debe aceptarse</li>
        <li><strong><code>nbf</code></strong> — not before: el token no debe usarse antes de este momento</li>
      </ul>
      <p>
        Verificar la expiración de un JWT es una simple comparación:{" "}
        <code>exp &gt; Math.floor(Date.now() / 1000)</code>.
        Si el tiempo actual en segundos es mayor que <code>exp</code>, el token ha expirado.
        Siempre valida <code>exp</code> en el servidor — nunca confíes solo en las comprobaciones de
        expiración del lado del cliente.
      </p>

      <h2>Referencia rápida: conversiones de marcas de tiempo</h2>
      <p>
        Para conversiones rápidas y precisas entre marcas de tiempo Unix y fechas legibles, usa el{" "}
        <a href="/tools/unix-timestamp">Conversor de Marcas de Tiempo Unix de BrowseryTools</a>. Pega una
        marca de tiempo para ver la fecha UTC y local correspondiente, o introduce una fecha para obtener
        su marca de tiempo. Todo se ejecuta en el navegador — sin servidor, sin seguimiento.
      </p>

      <h2>Resumen</h2>
      <p>
        Las marcas de tiempo Unix son una forma universal e inequívoca de representar instantes en el tiempo.
        Las reglas clave: siempre están en UTC, siempre en segundos (salvo en JavaScript, donde{" "}
        <code>Date.now()</code> usa milisegundos), y siempre son un entero positivo para cualquier fecha
        posterior a 1970. Maneja explícitamente la distinción entre milisegundos y segundos, usa UTC para
        almacenamiento y transmisión, y convierte a hora local solo en la capa de presentación.
      </p>
    </div>
  );
}
