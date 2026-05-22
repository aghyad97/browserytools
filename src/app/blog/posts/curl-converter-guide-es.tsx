export default function Content() {
  return (
    <div>
      <p>
        Toda API tiene documentación. Casi universalmente, esa documentación incluye ejemplos de código
        en cURL —la herramienta HTTP de línea de comandos que viene con todos los sistemas tipo Unix y
        ha sido la lengua franca de la documentación de APIs durante décadas. El problema es que tú no
        estás escribiendo scripts de shell. Estás escribiendo JavaScript, Python, Go o Ruby, y necesitas
        traducir ese comando cURL a código funcional antes de poder usarlo.
      </p>
      <p>
        Esa traducción es tediosa y propensa a errores. Los encabezados, los esquemas de autenticación,
        los cuerpos de solicitud y la codificación de URLs tienen que mapearse a las llamadas de método
        correctas en el lenguaje correcto. El{" "}
        <a href="/tools/curl-converter">Conversor cURL de BrowseryTools</a> hace esto automáticamente
        —pega un comando cURL y obtén el código equivalente en JavaScript fetch, Python requests,
        Node.js axios y más. Gratis, sin registro, todo se queda en tu navegador.
      </p>

      <h2>¿Qué Es cURL?</h2>
      <p>
        cURL (Client URL) es una herramienta de línea de comandos para transferir datos usando URLs.
        Soporta HTTP, HTTPS, FTP, WebSockets y docenas de otros protocolos. Para los desarrolladores,
        se usa más comúnmente para hacer solicitudes HTTP desde la terminal —probar un endpoint de API,
        descargar un archivo o depurar la autenticación.
      </p>
      <p>
        cURL viene instalado por defecto en macOS y la mayoría de las distribuciones de Linux. En
        Windows, ha estado incluido con el sistema operativo desde Windows 10. Esta ubicuidad es
        exactamente por qué los equipos de documentación de APIs recurren por defecto a cURL para los
        ejemplos —pueden estar seguros de que cualquier desarrollador que lea la documentación puede
        ejecutar el ejemplo de inmediato, sin instalar nada.
      </p>

      <h2>Anatomía de un Comando cURL</h2>
      <p>
        Un comando cURL está formado por una URL base y un conjunto de banderas. Aquí tienes un ejemplo
        completo que cubre las banderas más importantes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Desglosando cada bandera:
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> — establece el método HTTP. Los valores válidos son GET, POST, PUT, PATCH, DELETE, etc. Si se omite y está presente <code>-d</code>, cURL usa POST por defecto.</li>
        <li><strong><code>-H "Encabezado: Valor"</code></strong> — añade un encabezado de solicitud. Puede repetirse varias veces para múltiples encabezados.</li>
        <li><strong><code>-d '...'</code></strong> — el cuerpo de la solicitud. Para JSON, combínalo con <code>-H "Content-Type: application/json"</code>. cURL codifica el cuerpo por URL por defecto a menos que uses <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> — envía el cuerpo exactamente como está sin ninguna codificación de URL. Necesario cuando el cuerpo contiene caracteres como <code>@</code> que <code>-d</code> interpretaría de forma especial.</li>
        <li><strong><code>-u usuario:contraseña</code></strong> — atajo de autenticación básica. cURL lo codifica como un encabezado de Autorización en Base64 por ti.</li>
        <li><strong><code>-s</code></strong> — modo silencioso; suprime la barra de progreso. Casi siempre se usa en scripts.</li>
        <li><strong><code>-v</code></strong> — modo detallado; imprime los encabezados de solicitud y respuesta. Invaluable para depurar fallos de autenticación.</li>
        <li><strong><code>-o nombre_archivo</code></strong> — escribe la salida en un archivo en lugar de a stdout.</li>
      </ul>

      <h2>Patrones cURL Comunes para APIs REST</h2>

      <h3>Solicitud GET con Parámetros de Consulta</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Los parámetros de consulta van directamente en la URL. Pon entre comillas la URL completa para
        evitar que el shell interprete el <code>&</code> como un operador de proceso en segundo plano.
      </p>

      <h3>POST con Cuerpo JSON</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>Carga de Archivos (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        La bandera <code>-F</code> envía multipart/form-data. El prefijo <code>@</code> significa
        «leer desde archivo». Este es el formato usado para cargas de imágenes, APIs de procesamiento
        de documentos y cualquier endpoint que acepte datos binarios.
      </p>

      <h2>Convertir cURL a JavaScript fetch</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Original cURL:
// curl -X POST https://api.example.com/v1/users \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"name": "Alice", "email": "alice@example.com"}'

const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN",
  },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
  }),
});

const data = await response.json();`}
      </pre>

      <h2>Convertir cURL a Python requests</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`import requests

response = requests.post(
    "https://api.example.com/v1/users",
    headers={
        "Authorization": "Bearer TOKEN",
    },
    json={
        "name": "Alice",
        "email": "alice@example.com",
    },
)

data = response.json()`}
      </pre>
      <p>
        El parámetro <code>json=</code> de la biblioteca <code>requests</code> gestiona tanto la
        serialización como la configuración automática del encabezado{" "}
        <code>Content-Type: application/json</code> —no es necesario establecerlo manualmente.
      </p>

      <h2>Convertir cURL a Node.js con axios</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`const axios = require("axios");

const response = await axios.post(
  "https://api.example.com/v1/users",
  {
    name: "Alice",
    email: "alice@example.com",
  },
  {
    headers: {
      Authorization: "Bearer TOKEN",
    },
  }
);

const data = response.data;`}
      </pre>

      <h2>Cómo Funciona «Copiar como cURL» en las DevTools del Navegador</h2>
      <p>
        Una de las funciones más útiles en las DevTools del navegador es «Copiar como cURL». En Chrome,
        Firefox o Safari: abre las DevTools, ve a la pestaña Red, haz una solicitud (inicia sesión,
        haz clic en un botón, carga una página), haz clic derecho en la solicitud en la lista de red
        y selecciona «Copiar como cURL».
      </p>
      <p>
        El navegador genera un comando cURL completo que incluye cada encabezado que el navegador envió
        —incluyendo cookies, tokens de sesión, tokens CSRF y cualquier otro material de autenticación.
        Esto significa que puedes reproducir exactamente la solicitud que hizo el navegador, incluido
        todo su contexto de autenticación, desde la terminal o desde el código.
      </p>
      <p>
        Esto es invaluable para la depuración: si la solicitud del navegador funciona pero la solicitud
        de tu código falla, pega ambas en una herramienta de diferencias y encuentra la diferencia de
        encabezado o cuerpo. También puedes pegar el cURL copiado directamente en el{" "}
        <a href="/tools/curl-converter">Conversor cURL de BrowseryTools</a> para obtener el código
        equivalente en tu lenguaje preferido —el conversor maneja automáticamente todo el escapado,
        las comillas y la traducción de banderas.
      </p>

      <h2>Resumen</h2>
      <p>
        cURL es el lenguaje universal de HTTP. La documentación de las APIs lo usa porque todos pueden
        ejecutarlo. Las DevTools lo copian porque captura cada detalle de una solicitud. Aprender a
        leer cURL con fluidez —y a traducirlo con precisión al lenguaje en el que estás trabajando—
        es una habilidad práctica que rinde dividendos cada vez que integras una nueva API. Salta la
        tediosa traducción manual y usa el{" "}
        <a href="/tools/curl-converter">Conversor cURL de BrowseryTools</a> para obtener código
        limpio y ejecutable en segundos.
      </p>
    </div>
  );
}
