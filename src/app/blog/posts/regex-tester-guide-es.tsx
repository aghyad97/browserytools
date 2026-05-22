export default function Content() {
  return (
    <div>
      <p>
        Las expresiones regulares son una de esas herramientas que los desarrolladores o adoran o
        evitan por completo. Parecen intimidantes —una cadena densa de caracteres especiales que
        parece desafiar toda legibilidad— pero el modelo subyacente es simple. Una vez que entiendes
        cómo funcionan, una expresión regular bien elaborada se convierte en una de las herramientas
        de una sola línea más poderosas de todo tu arsenal.
      </p>
      <p>
        Esta guía elimina el ruido. En lugar de catalogar cada característica de las expresiones
        regulares, se enfoca en el 20% de la sintaxis que maneja el 80% de los casos de uso reales:
        clases de caracteres, cuantificadores, anclas, grupos y banderas. A lo largo del camino, puedes
        probar cada ejemplo en el{" "}
        <a href="/tools/regex-tester">Probador de Expresiones Regulares de BrowseryTools</a> —gratis,
        sin registro, todo se queda en tu navegador.
      </p>

      <h2>¿Qué Es una Expresión Regular?</h2>
      <p>
        Una expresión regular es un patrón que describe un conjunto de cadenas. Cuando aplicas una
        expresión regular a un fragmento de texto, estás preguntando: «¿coincide esta cadena con mi
        patrón?» —o más prácticamente: «encuentra todas las subcadenas que coincidan con mi patrón».
        El propio patrón está escrito en un mini-lenguaje compacto que la mayoría de los lenguajes de
        programación soportan de forma nativa.
      </p>
      <p>
        Las expresiones regulares son útiles siempre que necesites validar entradas (¿es esto una
        dirección de correo electrónico válida?), extraer datos (extraer todas las URLs de un bloque de
        texto), transformar texto (reemplazar todas las ocurrencias de un patrón) o dividir una cadena
        en un delimitador complejo. Se ejecutan en el navegador, en el servidor, en la terminal —en
        todas partes.
      </p>

      <h2>La Sintaxis Central: el 20% que Cubre el 80% de los Casos</h2>

      <h3>Caracteres Literales y el Punto</h3>
      <p>
        La mayoría de los caracteres en una expresión regular se corresponden consigo mismos. El patrón{" "}
        <code>hello</code> coincide literalmente con la cadena «hello». El punto <code>.</code> es el
        comodín universal —coincide con cualquier carácter único excepto un salto de línea. Así que{" "}
        <code>h.llo</code> coincide con «hello», «hallo», «hxllo», etc.
      </p>

      <h3>Clases de Caracteres</h3>
      <p>
        Los corchetes definen una clase de caracteres —un conjunto donde cualquiera de ellos puede
        coincidir en esa posición.
      </p>
      <ul>
        <li><strong><code>[aeiou]</code></strong> — coincide con cualquier vocal simple</li>
        <li><strong><code>[a-z]</code></strong> — coincide con cualquier letra minúscula (sintaxis de rango)</li>
        <li><strong><code>[A-Za-z0-9]</code></strong> — coincide con cualquier carácter alfanumérico</li>
        <li><strong><code>[^0-9]</code></strong> — el <code>^</code> dentro de los corchetes niega la clase; coincide con cualquier cosa que NO sea un dígito</li>
      </ul>
      <p>
        Las clases abreviadas cubren los casos más comunes: <code>\d</code> coincide con cualquier
        dígito (igual que <code>[0-9]</code>), <code>\w</code> coincide con cualquier carácter de
        palabra (letras, dígitos, guión bajo) y <code>\s</code> coincide con cualquier espacio en
        blanco. Sus inversas en mayúsculas —<code>\D</code>, <code>\W</code>, <code>\S</code>— coinciden
        con lo opuesto.
      </p>

      <h3>Cuantificadores</h3>
      <p>
        Los cuantificadores controlan cuántas veces debe aparecer el elemento precedente.
      </p>
      <ul>
        <li><strong><code>*</code></strong> — cero o más veces</li>
        <li><strong><code>+</code></strong> — una o más veces</li>
        <li><strong><code>?</code></strong> — cero o una vez (hace que algo sea opcional)</li>
        <li><strong><code>{"{3}"}</code></strong> — exactamente 3 veces</li>
        <li><strong><code>{"{2,5}"}</code></strong> — entre 2 y 5 veces (inclusive)</li>
        <li><strong><code>{"{3,}"}</code></strong> — 3 o más veces</li>
      </ul>
      <p>
        Por defecto, los cuantificadores son codiciosos —coinciden con todo lo posible. Añadir un{" "}
        <code>?</code> después del cuantificador lo hace perezoso: <code>.*?</code> coincide con lo
        mínimo posible. Esta distinción importa mucho al extraer contenido entre delimitadores.
      </p>

      <h3>Anclas</h3>
      <p>
        Las anclas no coinciden con caracteres; coinciden con posiciones en la cadena.
      </p>
      <ul>
        <li><strong><code>^</code></strong> — el inicio de la cadena (o el inicio de una línea en modo multilínea)</li>
        <li><strong><code>$</code></strong> — el final de la cadena (o el final de una línea en modo multilínea)</li>
        <li><strong><code>\b</code></strong> — un límite de palabra —la posición entre un carácter de palabra y uno que no lo es</li>
      </ul>
      <p>
        Las anclas son esenciales para la validación. Sin ellas, el patrón <code>\d+</code> coincidiría
        con los dígitos dentro de «abc123xyz». Con anclas —<code>^\d+$</code>— solo coincide con cadenas
        que consisten enteramente de dígitos.
      </p>

      <h3>Grupos y Alternancia</h3>
      <p>
        Los paréntesis crean grupos de captura. Sirven dos propósitos: agrupar una subexpresión para
        que un cuantificador se aplique a todo el grupo, y capturar la subcadena coincidente para su
        extracción.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Group with quantifier: match one or more "ab" repetitions
/(ab)+/   →  matches "ab", "abab", "ababab"

// Alternation with |: match "cat" or "dog"
/(cat|dog)/  →  matches "I have a cat" and "I have a dog"

// Named capture group
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`}
      </pre>
      <p>
        Los grupos no capturadores —<code>(?:...)</code>— agrupan sin capturar, lo cual es más limpio
        cuando solo necesitas el comportamiento de agrupación y no necesitas extraer el texto coincidente.
      </p>

      <h2>Ejemplos Prácticos</h2>

      <h3>Validación de Correo Electrónico</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}
      </pre>
      <p>
        Desglosándolo: <code>^</code> ancla al inicio. <code>[a-zA-Z0-9._%+-]+</code> coincide con la
        parte local (uno o más caracteres permitidos). <code>@</code> es un signo de arroba literal.{" "}
        <code>[a-zA-Z0-9.-]+</code> coincide con el nombre de dominio. <code>\.</code> es un punto
        literal (escapado, ya que el <code>.</code> sin escape significa «cualquier carácter»).{" "}
        <code>[a-zA-Z]{"{2,}"}</code> coincide con el TLD con al menos 2 letras. <code>$</code> ancla
        al final.
      </p>

      <h3>Número de Teléfono (Formato EE. UU.)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^\+?1?\s?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})$/`}
      </pre>
      <p>
        Esto coincide con formatos como <code>555-867-5309</code>, <code>(555) 867-5309</code>,{" "}
        <code>+1 555 867 5309</code> y <code>5558675309</code>. El truco clave es usar{" "}
        <code>?</code> para hacer que los separadores sean opcionales y agrupar el código de área con
        paréntesis opcionales.
      </p>

      <h3>Extracción de URLs de Texto</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/https?:\/\/[^\s"'<>]+/g`}
      </pre>
      <p>
        <code>https?</code> coincide con «http» y «https» (la <code>s</code> es opcional).{" "}
        <code>:\/\/</code> coincide con el literal «://» con las barras escapadas.{" "}
        <code>[^\s"'&lt;&gt;]+</code> coincide con todo lo que no sea espacio en blanco ni caracteres
        que terminan las URLs. La bandera <code>g</code> encuentra todas las coincidencias, no solo
        la primera.
      </p>

      <h2>Banderas de las Expresiones Regulares</h2>
      <p>
        Las banderas modifican cómo se aplica todo el patrón.
      </p>
      <ul>
        <li><strong><code>g</code> (global)</strong> — encuentra todas las coincidencias, no solo la primera</li>
        <li><strong><code>i</code> (sin distinción de mayúsculas)</strong> — trata mayúsculas y minúsculas como equivalentes; <code>/hello/i</code> coincide con «Hello», «HELLO» y «hello»</li>
        <li><strong><code>m</code> (multilínea)</strong> — hace que <code>^</code> y <code>$</code> coincidan con el inicio/fin de cada línea en lugar de toda la cadena</li>
        <li><strong><code>s</code> (dotAll)</strong> — hace que <code>.</code> también coincida con saltos de línea, útil para coincidir en varias líneas</li>
      </ul>
      <p>
        En JavaScript, las banderas van después de la barra de cierre: <code>/pattern/gi</code>. En
        Python, se pasan como segundo argumento: <code>re.findall(pattern, text, re.IGNORECASE)</code>.
      </p>

      <h2>JavaScript vs Python: Diferencias Clave</h2>
      <p>
        La sintaxis de las expresiones regulares es prácticamente la misma entre JavaScript y Python,
        pero hay algunas diferencias importantes.
      </p>
      <ul>
        <li><strong>Grupos nombrados</strong>: JavaScript usa <code>(?&lt;name&gt;...)</code>, Python usa lo mismo. Ambos devuelven grupos nombrados pero se accede a ellos de forma diferente —<code>match.groups.name</code> en JS, <code>match.group('name')</code> en Python.</li>
        <li><strong>Lookahead / lookbehind</strong>: Ambos soportan <code>(?=...)</code> (lookahead positivo) y <code>(?!...)</code> (lookahead negativo). Python también soporta lookbehinds de longitud variable; los motores JavaScript más antiguos no.</li>
        <li><strong>Unicode</strong>: JavaScript requiere la bandera <code>u</code> para manejar los escapes de propiedad Unicode como <code>\p{"{Letter}"}</code>. El módulo <code>re</code> de Python maneja Unicode por defecto.</li>
        <li><strong>Cadenas crudas</strong>: En Python, usa siempre cadenas crudas (<code>r"\d+"</code>) para evitar escapar doublemente las barras invertidas. En JavaScript, usa la sintaxis literal <code>/\d+/</code> o la cadena <code>"\\d+"</code> al construir con <code>new RegExp()</code>.</li>
      </ul>

      <h2>Errores Comunes en Expresiones Regulares</h2>
      <ul>
        <li><strong>Retroceso catastrófico</strong> — patrones como <code>(a+)+</code> en una cadena que no coincide pueden provocar un retroceso exponencial, bloqueando el motor. Evita los cuantificadores anidados en patrones superpuestos.</li>
        <li><strong>Olvidar escapar el punto</strong> — <code>3.14</code> como patrón coincide con «3X14» porque <code>.</code> es un comodín. Usa <code>3\.14</code> para coincidir con el punto literal.</li>
        <li><strong>No anclar los patrones de validación</strong> — sin <code>^</code> y <code>$</code>, un patrón destinado a validar toda la cadena coincidirá con cualquier cadena que contenga el patrón como subcadena.</li>
        <li><strong>Usar expresiones regulares para analizar HTML</strong> — las expresiones regulares no pueden manejar estructuras anidadas arbitrariamente. Usa un analizador HTML adecuado (DOMParser en el navegador, BeautifulSoup en Python) para HTML.</li>
      </ul>

      <h2>Prueba Tus Patrones de Forma Segura en el Navegador</h2>
      <p>
        Escribir expresiones regulares en un editor sin un bucle de retroalimentación es doloroso.
        Escribes un patrón, ejecutas tu código, ves que falla, ajustas el patrón, vuelves a ejecutar.
        Un probador de expresiones regulares en vivo acorta este bucle —ves las coincidencias
        resaltadas en tiempo real mientras escribes.
      </p>
      <p>
        El{" "}
        <a href="/tools/regex-tester">Probador de Expresiones Regulares de BrowseryTools</a> te
        permite escribir un patrón, pegar cadenas de prueba y ver todas las coincidencias resaltadas
        al instante. Se ejecuta completamente en tu navegador, por lo que puedes probar con datos
        reales —registros, entradas de usuario, cadenas de producción— sin enviar nada a un servidor.
      </p>

      <h2>Resumen</h2>
      <p>
        Las expresiones regulares recompensan el tiempo que inviertes en aprenderlas. El vocabulario
        central —clases de caracteres, cuantificadores, anclas, grupos y banderas— es pequeño. Los
        patrones que puedes construir con él son vastos. Empieza con los ejemplos de esta guía,
        pruébalos con tus propias cadenas y la sintaxis se volverá intuitiva más rápido de lo que
        esperas.
      </p>
    </div>
  );
}
