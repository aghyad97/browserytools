import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        JSON está en todas partes. Impulsa las APIs REST, los archivos de configuración, las salidas
        de bases de datos, los payloads de webhooks y los agregadores de registros. Te lo encuentras
        docenas de veces al día tanto si estás construyendo un servicio backend como depurando una
        aplicación frontend o leyendo documentación. Entender JSON en profundidad —no solo cómo
        analizarlo, sino cómo leerlo, validarlo y solucionar sus problemas— es una de las habilidades
        de mayor apalancamiento que puede tener un desarrollador.
      </p>
      <ToolCTA slug="json-formatter" variant="inline" />
      <p>
        Esta guía cubre desde los fundamentos de la sintaxis JSON hasta la depuración de errores de
        análisis comunes, estrategias de formato y el trabajo con estructuras profundamente anidadas.
        Pega cualquier JSON en el{" "}
        <a href="/tools/json-formatter">Formateador JSON de BrowseryTools</a> para validarlo e
        imprimirlo con formato al instante —gratis, sin registro, todo se queda en tu navegador.
      </p>

      <h2>Por Qué Ganó JSON (y Perdió XML)</h2>
      <p>
        Antes de que JSON se convirtiera en el formato de intercambio de datos por defecto, XML era el
        estándar. Las APIs SOAP, los feeds RSS y los archivos de configuración usaban XML. JSON surgió
        como una alternativa más simple y fue tomando el relevo progresivamente para la mayoría de los
        casos de uso. Las razones son sencillas:
      </p>
      <ul>
        <li><strong>Menos verboso</strong> — JSON no requiere etiquetas de cierre. Los mismos datos se representan con un 30-50% menos de caracteres.</li>
        <li><strong>Nativo de JavaScript</strong> — JSON son las siglas de JavaScript Object Notation. Se mapea directamente a los objetos y arrays de JavaScript, lo que hace que sea trivial analizarlo y serializarlo en el navegador.</li>
        <li><strong>Legible por humanos</strong> — un payload JSON correctamente formateado es más fácil de leer que el XML equivalente con sus corchetes angulares y declaraciones de espacio de nombres.</li>
        <li><strong>Ampliamente soportado</strong> — todos los lenguajes principales tienen un analizador JSON incorporado. No es necesario instalar una biblioteca solo para deserializar una respuesta de API.</li>
      </ul>
      <p>
        XML todavía tiene casos de uso legítimos —formatos de documentos (DOCX, SVG), configuraciones
        que necesitan comentarios (que JSON no soporta) y protocolos como SOAP donde es obligatorio.
        Pero para la comunicación por API y el almacenamiento de datos, JSON es el ganador indiscutible.
      </p>

      <h2>Reglas de Sintaxis JSON</h2>
      <p>
        JSON tiene una sintaxis pequeña y estricta. Estas son las reglas que pillan desprevenidos a la
        mayoría de los desarrolladores:
      </p>
      <ul>
        <li><strong>Las claves deben ser cadenas entre comillas dobles</strong> — <code>{"{"}"name": "Alice"{"}"}</code> es válido; <code>{"{"}name: "Alice"{"}"}</code> no lo es. A diferencia de los literales de objeto de JavaScript, JSON no permite claves sin comillas.</li>
        <li><strong>Sin comas finales</strong> — <code>[1, 2, 3,]</code> no es JSON válido. La coma final después del último elemento es aceptada por JavaScript y muchos analizadores pero no es parte de la especificación JSON.</li>
        <li><strong>Sin comentarios</strong> — JSON no tiene sintaxis de comentarios. Esto sorprende a los desarrolladores que quieren anotar los archivos de configuración. Si necesitas comentarios en un archivo de configuración, considera JSONC (JSON con Comentarios) o YAML en su lugar.</li>
        <li><strong>Las cadenas usan solo comillas dobles</strong> — las cadenas con comillas simples como <code>'hello'</code> no son JSON válido.</li>
        <li><strong>Los números no pueden tener ceros iniciales</strong> — <code>007</code> no es válido; usa <code>7</code> en su lugar.</li>
        <li><strong>Solo seis tipos de valores</strong> — cadenas, números, booleanos (<code>true</code> / <code>false</code>), null, objetos y arrays. Sin fechas, sin funciones, sin undefined.</li>
      </ul>

      <h2>Errores JSON Comunes y Lo Que Significan</h2>
      <p>
        Los errores de análisis JSON pueden ser crípticos. Aquí están los más comunes y cómo
        solucionarlos.
      </p>

      <h3>Token inesperado</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Las comillas simples no son JSON válido. Reemplázalas con comillas dobles:{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Token } / ] inesperado"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        Una coma final antes del corchete de cierre. Elimina la coma después del último elemento.
        Este es el error JSON más común para los desarrolladores que vienen de JavaScript, donde las
        comas finales son perfectamente válidas.
      </p>

      <h3>Fin inesperado de la entrada JSON</h3>
      <p>
        Esto significa que el JSON está truncado —la cadena termina antes de que todos los objetos y
        arrays abiertos estén cerrados. Cuenta tus llaves y corchetes de apertura y cierre. Deben
        coincidir.
      </p>

      <h3>Los nombres de propiedad deben ser cadenas</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Inválido — clave sin comillas
{ name: "Alice" }

// Válido
{ "name": "Alice" }`}
      </pre>

      <h2>Impresión Bonita vs Minificación</h2>
      <p>
        El JSON puede representarse de dos formas: con impresión bonita (con sangría y saltos de
        línea) o minificado (sin ningún espacio en blanco). La elección depende del contexto.
      </p>
      <p>
        <strong>Usa la impresión bonita</strong> cuando leas, depures, revises o almacenes JSON en
        el control de versiones. El JSON con sangría es inmediatamente legible y difunde limpiamente
        en Git porque cada valor está en su propia línea.
      </p>
      <p>
        <strong>Minifica</strong> cuando transmitas JSON por una red. El espacio en blanco es
        sobrecarga pura en las respuestas HTTP. Un payload JSON de 100 KB con impresión bonita puede
        comprimirse a 60 KB cuando se minifica y luego a 15 KB con gzip. La mayoría de las APIs sirven
        JSON minificado a través de la red y dejan que el cliente lo imprima con formato según sea
        necesario.
      </p>
      <p>
        En JavaScript: <code>JSON.stringify(data, null, 2)</code> imprime con formato con 2 espacios de
        sangría. <code>JSON.stringify(data)</code> minifica. El{" "}
        <a href="/tools/json-formatter">Formateador JSON de BrowseryTools</a> hace ambas cosas —pega
        tu JSON y alterna entre vistas con formato y minificadas al instante.
      </p>

      <h2>Navegar por JSON Profundamente Anidado</h2>
      <p>
        Las respuestas de API del mundo real a menudo están profundamente anidadas. Un payload de
        webhook de Stripe, una respuesta de la API de GitHub o una configuración de Kubernetes puede
        tener objetos a cinco o seis niveles de profundidad. Aquí hay estrategias para trabajar con
        ellos:
      </p>

      <h3>Usa el encadenamiento opcional en JavaScript</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Without optional chaining — crashes if any level is undefined
const city = user.address.location.city;

// With optional chaining — returns undefined instead of throwing
const city = user?.address?.location?.city;

// With nullish coalescing for a default value
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>Usa jq para consultas JSON en la línea de comandos</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Pretty-print the entire response
curl https://api.example.com/users | jq .

# Extract a specific field
curl https://api.example.com/users | jq '.[0].email'

# Filter an array
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON en APIs vs Archivos de Configuración</h2>
      <p>
        JSON sirve para dos roles muy diferentes según el contexto y las mejores prácticas difieren
        entre ellos.
      </p>
      <p>
        En las <strong>respuestas de API</strong>, el JSON es generado por código y consumido por
        código. Rara vez lo escribes a mano. La prioridad es la corrección y la consistencia —usa una
        biblioteca de serialización y deja que maneje el escapado. Minifica para producción, incluye
        un encabezado Content-Type de <code>application/json</code> y versiona tu API para que los
        cambios en la estructura JSON no sean incompatibles.
      </p>
      <p>
        En los <strong>archivos de configuración</strong> (package.json, tsconfig.json, .eslintrc.json),
        el JSON es escrito por humanos. Aquí la legibilidad importa más. Usa sangría de 2 espacios,
        mantén la estructura poco profunda donde sea posible y añade comentarios usando un analizador
        compatible con JSONC si tus herramientas lo soportan. Nunca minifiques los archivos de
        configuración que viven en el control de versiones.
      </p>

      <h2>Validación de JSON Schema</h2>
      <p>
        JSON Schema es una especificación para definir la estructura, los tipos y las restricciones de
        un documento JSON. Te permite validar que un payload JSON cumple con una forma esperada antes
        de intentar usarlo.
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
        Bibliotecas como <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python) y{" "}
        <code>JSON.NET Schema</code> (.NET) pueden validar un documento JSON contra un esquema en
        tiempo de ejecución —detectando payloads malformados en el límite de la API antes de que
        causen errores inesperados más profundamente en la aplicación.
      </p>

      <h2>Resumen</h2>
      <p>
        La simplicidad de JSON es su mayor fortaleza. Seis tipos de valores, reglas estrictas de
        comillas, sin comentarios, sin comas finales —las restricciones son pequeñas y el formato es
        inequívoco. Cuando algo sale mal, casi siempre es uno de un puñado de errores de sintaxis
        predecibles. Pega tu JSON roto en el{" "}
        <a href="/tools/json-formatter">Formateador JSON de BrowseryTools</a> y el error será
        inmediatamente visible con la posición exacta resaltada.
      </p>
      <ToolCTA slug="json-formatter" variant="card" />
    </div>
  );
}
