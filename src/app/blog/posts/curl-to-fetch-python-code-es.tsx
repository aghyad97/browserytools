export default function Content() {
  return (
    <div>
      <p>
        Encontraste la llamada a la API que necesitas — pero está escrita en cURL y tú trabajas en
        JavaScript o Python. O abriste las DevTools de tu navegador, hiciste clic derecho en una
        petición y elegiste &ldquo;Copiar como cURL,&rdquo; y ahora tienes un muro de opciones que
        necesitas convertir en código real. Traducir cURL a mano es tedioso: cada <code>-H</code>,{" "}
        <code>-d</code>, <code>-u</code> y <code>-X</code> tiene que mapearse al argumento correcto
        en tu lenguaje, y una cabecera que falta rompe la petición.
      </p>
      <p>
        El <a href="/tools/curl-converter">Conversor de cURL de BrowseryTools</a> lo hace
        instantáneamente — pega un comando cURL y obtén código limpio en JavaScript <code>fetch</code>,
        Python <code>requests</code>, Node.js y más, todo en tu navegador sin nada subido. Esta guía
        muestra el mapeo de opciones a código para que puedas leer y confiar en la salida.
      </p>

      <h2>El Flujo de Trabajo de &ldquo;Copiar como cURL&rdquo;</h2>
      <p>
        La forma más rápida de obtener una petición funcional es dejar que el navegador la escriba
        por ti. Abre las DevTools (F12), ve a la pestaña <strong>Red</strong>, realiza la acción que
        quieres replicar, luego haz clic derecho en la petición y elige{" "}
        <strong>Copiar &rarr; Copiar como cURL</strong>. Ahora tienes un comando cURL con las
        cabeceras, cookies y cuerpo exactos que el sitio real envió. Pégalo en el{" "}
        <a href="/tools/curl-converter">conversor</a> y obtendrás la misma petición como código que
        puedes usar directamente en tu proyecto.
      </p>

      <h2>Cómo Se Mapean las Opciones de cURL al Código</h2>
      <p>
        Una vez que conoces el puñado de opciones que importan, puedes leer cualquier comando cURL
        de un vistazo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.8}}>
{`-X POST          ->  el método HTTP
-H "Key: Value"  ->  una cabecera de petición
-d '{...}'       ->  el cuerpo de la petición (implica POST)
-u user:pass     ->  autenticación básica HTTP
-F field=value   ->  subida multipart/form-data
-b "name=value"  ->  una cookie
-L               ->  seguir redirecciones`}
      </pre>
      <p>
        Una cabecera como <code>-H &quot;Authorization: Bearer abc123&quot;</code> se convierte en
        una entrada en el objeto <code>headers</code>. Un cuerpo pasado con <code>-d</code> se
        convierte en el cuerpo de la petición, y si el tipo de contenido es JSON se serializa
        adecuadamente. <code>-u user:pass</code> se convierte en una cabecera de autenticación
        básica. Conocer este mapeo es lo que te permite verificar el código generado en lugar de
        confiar ciegamente en él.
      </p>

      <h2>La Misma Petición en Tres Lenguajes</h2>
      <p>
        Toma un POST autenticado simple. En cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>Como JavaScript <code>fetch</code>:</p>
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
      <p>Como Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Observa cómo el argumento <code>json=</code> de Python establece el cuerpo <em>y</em> la
        cabecera Content-Type automáticamente — una pequeña diferencia idiomática que el conversor
        maneja por ti.
      </p>

      <h2>Errores Comunes</h2>
      <p>
        <strong>Comillas y escapes.</strong> Los cuerpos de cURL se envuelven en comillas simples en
        el shell; cuando contienen JSON con comillas dobles, la traducción manual es donde se cuelan
        los errores. Dejar que un conversor lo analice elimina ese riesgo.
      </p>
      <p>
        <strong>POST implícito.</strong> Usar <code>-d</code> convierte la petición en POST incluso
        sin <code>-X POST</code>. Si solo traduces las opciones visibles, podrías producir
        incorrectamente un GET.
      </p>
      <p>
        <strong>Secretos en el comando.</strong> Un comando cURL copiado a menudo contiene tokens
        activos y cookies. Como el conversor funciona completamente en tu navegador, esos secretos
        nunca se envían a un servidor — pero deberías eliminarlos antes de pegar el código en un
        repositorio compartido o en un ticket.
      </p>

      <h2>Preguntas Frecuentes</h2>
      <p>
        <strong>¿A qué lenguajes puedo convertir?</strong> JavaScript fetch, Python requests,
        Node.js y otros destinos comunes.
      </p>
      <p>
        <strong>¿El conversor envía mi comando a algún lugar?</strong> No. El análisis y la
        conversión ocurren localmente en tu navegador, por lo que cualquier token del comando
        permanece en tu dispositivo.
      </p>
      <p>
        <strong>¿Puedo pegar un &ldquo;Copiar como cURL&rdquo; de las DevTools?</strong> Sí — ese
        es uno de los mejores usos. Captura las cabeceras y el cuerpo exactos de una petición real.
      </p>
      <p>
        <strong>¿Es gratuito?</strong> Sí — sin cuenta, sin límites.
      </p>

      <h2>Convierte Ahora</h2>
      <p>
        Abre el <a href="/tools/curl-converter">Conversor de cURL</a>, pega tu comando y copia el
        código equivalente. Para un análisis más profundo de la sintaxis de cURL y los patrones
        REST, lee nuestra{" "}
        <a href="/blog/curl-converter-guide">guía para convertir peticiones API entre lenguajes</a>,
        y para dar sentido a las respuestas que recibes consulta la{" "}
        <a href="/blog/http-status-codes-guide">guía de códigos de estado HTTP</a>.
      </p>
    </div>
  );
}
