import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Los códigos de estado HTTP son el lenguaje que usan los servidores para decirle a los clientes qué
        ocurrió con una solicitud. Todo desarrollador los encuentra constantemente — en DevTools, en
        respuestas de API, en registros de errores, en alertas de Slack a las 3 de la madrugada. Saber
        lo que significa cada código, cuándo usar cuál en tus propias APIs y qué señalan los más comunes
        sobre un error te hace significativamente más rápido depurando y construyendo mejores servicios.
      </p>
      <ToolCTA slug="http-status" variant="inline" />
      <p>
        Puedes consultar cualquier código de estado HTTP con la{" "}
        <a href="/tools/http-status">Referencia de Códigos de Estado HTTP de BrowseryTools</a> — gratuita,
        sin registro, todo se ejecuta en tu navegador.
      </p>

      <h2>Las cinco categorías</h2>
      <p>
        Los códigos de estado son números de tres dígitos. El primer dígito define la categoría:
      </p>
      <ul>
        <li><strong>1xx — Informacional</strong>: La solicitud fue recibida; el procesamiento continúa. Son raros en la mayoría de las aplicaciones.</li>
        <li><strong>2xx — Éxito</strong>: La solicitud fue recibida, comprendida y aceptada.</li>
        <li><strong>3xx — Redirección</strong>: Se necesita una acción adicional para completar la solicitud. El cliente debe seguir una redirección.</li>
        <li><strong>4xx — Error del cliente</strong>: La solicitud estaba mal formada o no autorizada. El cliente cometió un error.</li>
        <li><strong>5xx — Error del servidor</strong>: El servidor no pudo satisfacer una solicitud válida. El servidor cometió un error.</li>
      </ul>
      <p>
        Esta regla del primer dígito es importante: si ves un código que no reconoces (como <code>429</code>{" "}
        o <code>451</code>), al menos sabes si el problema está en el cliente o en el servidor, y si la
        solicitud tuvo éxito finalmente.
      </p>

      <h2>2xx: códigos de éxito</h2>
      <p>
        Indican al cliente que la solicitud funcionó. El código específico comunica cómo funcionó:
      </p>
      <ul>
        <li>
          <strong>200 OK</strong> — el éxito universal. El cuerpo de la respuesta contiene los datos solicitados. Se usa para solicitudes GET y la mayoría de las respuestas que devuelven contenido.
        </li>
        <li>
          <strong>201 Created</strong> — se creó un nuevo recurso. Debe incluir una cabecera <code>Location</code> que apunte a la URL del nuevo recurso. Usa este para solicitudes POST que crean registros, no el 200.
        </li>
        <li>
          <strong>204 No Content</strong> — la solicitud tuvo éxito pero no hay cuerpo que devolver. Habitual en solicitudes DELETE y operaciones PATCH/PUT donde el cliente no necesita los datos actualizados. La respuesta no debe incluir cuerpo.
        </li>
        <li>
          <strong>206 Partial Content</strong> — se usa con solicitudes de rango (la cabecera <code>Range</code>). Los reproductores de video lo usan para solicitar rangos de bytes específicos de un archivo multimedia sin descargarlo completo.
        </li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Patrón de diseño de API REST
POST   /api/users        → 201 Created  (cuerpo: nuevo objeto usuario, Location: /api/users/123)
GET    /api/users/123    → 200 OK       (cuerpo: objeto usuario)
PATCH  /api/users/123    → 200 OK       (cuerpo: usuario actualizado) o 204 No Content
DELETE /api/users/123    → 204 No Content`}
      </pre>

      <h2>3xx: códigos de redirección</h2>
      <p>
        Las redirecciones le dicen al cliente que busque en otro lugar. La cabecera <code>Location</code>
        contiene la nueva URL. La distinción clave es entre redirecciones permanentes y temporales, y
        entre las que preservan el método HTTP y las que lo cambian.
      </p>
      <ul>
        <li>
          <strong>301 Moved Permanently</strong> — el recurso tiene una nueva URL permanente. Los navegadores y motores de búsqueda lo almacenan en caché. El navegador usará GET para la redirección independientemente del método original (una peculiaridad histórica). Úsalo cuando cambias permanentemente el nombre de una URL o redirigí HTTP a HTTPS en una configuración antigua.
        </li>
        <li>
          <strong>302 Found</strong> — redirección temporal. Como el 301, los navegadores cambian POST a GET en la redirección (según la especificación, aunque la especificación era "incorrecta" — ver 307). Usa 302 solo cuando la redirección sea genuinamente temporal.
        </li>
        <li>
          <strong>304 Not Modified</strong> — la versión en caché sigue siendo fresca; no hay cuerpo. El servidor lo envía en respuesta a un GET condicional (con <code>If-None-Match</code> o <code>If-Modified-Since</code>). El navegador usa su copia en caché. Importante para la eficiencia de CDN y reducir el ancho de banda.
        </li>
        <li>
          <strong>307 Temporary Redirect</strong> — como el 302, pero la especificación garantiza que se conserva el método HTTP original. Si un POST resulta en un 307, el navegador hará un POST a la nueva URL. Usa 307 en lugar de 302 para redirecciones temporales que no sean GET.
        </li>
        <li>
          <strong>308 Permanent Redirect</strong> — como el 301, pero también garantiza la conservación del método. El estándar moderno para redirecciones permanentes.
        </li>
      </ul>

      <h2>Concepto erróneo habitual: 301 vs 302 para SEO</h2>
      <p>
        Los motores de búsqueda tratan el 301 como una señal para transferir la "equidad de enlace"
        (PageRank) de la URL antigua a la nueva y actualizar su índice. Un 302 le dice al rastreador
        que la redirección es temporal, por lo que sigue indexando la URL original. Usar 302 cuando
        quieres decir 301 puede suprimir el beneficio SEO de las redirecciones. Por el contrario, usar
        301 cuando la redirección es temporal hace que los motores de búsqueda almacenen en caché la
        redirección, dificultando deshacerla.
      </p>

      <h2>4xx: códigos de error del cliente</h2>
      <p>
        Estos códigos indican que el cliente envió una solicitud incorrecta. No devuelvas 5xx por errores
        del cliente — eso confunde la monitorización y dificulta identificar si el problema es un error
        en tu servidor o una entrada incorrecta del cliente.
      </p>
      <ul>
        <li>
          <strong>400 Bad Request</strong> — la solicitud está mal formada. Campos requeridos faltantes, JSON inválido, tipos de datos incorrectos. El 4xx más genérico; usa códigos más específicos cuando estén disponibles.
        </li>
        <li>
          <strong>401 Unauthorized</strong> — a pesar del nombre, significa "no autenticado". El cliente no proporcionó credenciales o las credenciales eran inválidas. La respuesta debe incluir una cabecera <code>WWW-Authenticate</code> que indique cómo autenticarse. El nombre es un error histórico — "no autenticado" sería más preciso.
        </li>
        <li>
          <strong>403 Forbidden</strong> — autenticado pero no autorizado. El servidor sabe quién eres (o no importa quién eres) y no tienes permiso. A diferencia del 401, volver a autenticarse no ayudará. Usa 403 cuando un usuario intenta acceder a un recurso para el que no tiene permiso.
        </li>
        <li>
          <strong>404 Not Found</strong> — el recurso no existe en esta URL. También se devuelve cuando un servidor quiere ocultar la existencia de un recurso a usuarios no autorizados (devolver 403 confirmaría que el recurso existe; devolver 404 oculta ese hecho).
        </li>
        <li>
          <strong>409 Conflict</strong> — la solicitud entra en conflicto con el estado actual del recurso. Ejemplo clásico: intentar crear un usuario con un correo que ya existe, o intentar actualizar un recurso usando una versión desactualizada (conflicto de bloqueo optimista).
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> — la solicitud es sintácticamente correcta (JSON válido, Content-Type correcto) pero semánticamente inválida (un campo requerido está presente pero contiene un valor inválido, violación de regla de negocio). Rails popularizó usar 422 para errores de validación. Más específico que el 400.
        </li>
        <li>
          <strong>429 Too Many Requests</strong> — límite de tasa excedido. Debe incluir una cabecera <code>Retry-After</code> que le diga al cliente cuánto tiempo esperar. Imprescindible para cualquier API pública.
        </li>
      </ul>

      <h2>401 vs 403: la distinción que importa</h2>
      <p>
        Este es uno de los pares más confundidos:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`GET /api/admin/users
Authorization: (ninguna)
→ 401 Unauthorized
   "No me has dicho quién eres. Inicia sesión primero."

GET /api/admin/users
Authorization: Bearer <token-de-usuario-regular-válido>
→ 403 Forbidden
   "Sé quién eres. No eres administrador. Acceso denegado."`}
      </pre>

      <h2>5xx: códigos de error del servidor</h2>
      <ul>
        <li>
          <strong>500 Internal Server Error</strong> — un comodín genérico para fallos inesperados en el servidor. Una excepción no controlada, una referencia nula, una consulta de base de datos que arrojó un error. No expongas trazas de pila a los clientes; regístralas en el servidor.
        </li>
        <li>
          <strong>502 Bad Gateway</strong> — el servidor que actúa como proxy o pasarela recibió una respuesta inválida de un servidor upstream. Habitual cuando el balanceador de carga o proxy inverso no puede llegar a los servidores de aplicación detrás de él — la aplicación se cayó o no está escuchando en el puerto correcto.
        </li>
        <li>
          <strong>503 Service Unavailable</strong> — el servidor está temporalmente incapaz de manejar solicitudes. Podría estar sobrecargado, en medio de un despliegue o en mantenimiento. Debe incluir una cabecera <code>Retry-After</code> cuando se conoce la duración de la interrupción.
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> — el proxy o pasarela no recibió una respuesta oportuna del servidor upstream. El upstream está activo y respondiendo, pero muy lentamente. Síntoma habitual de consultas de base de datos que tardan demasiado o llamadas a APIs externas que se quedan bloqueadas.
        </li>
      </ul>

      <h2>Códigos de estado en el diseño de APIs REST</h2>
      <p>
        Usar los códigos de estado correctos hace que tu API se documente sola y sea más fácil de
        integrar. Algunas directrices:
      </p>
      <ul>
        <li>Nunca devuelvas 200 con un objeto de error en el cuerpo. Si una solicitud falló, el código de estado debe reflejarlo. Los clientes deben poder comprobar el código de estado por sí solo para saber si necesitan gestionar un error.</li>
        <li>Usa 201 y una cabecera <code>Location</code> al crear recursos mediante POST. Esto permite a los clientes descubrir la URL del nuevo recurso sin analizar el cuerpo.</li>
        <li>Devuelve 422 (no 400) para errores de validación, e incluye un cuerpo de error estructurado que identifique qué campos fallaron y por qué.</li>
        <li>Usa 409 para conflictos que requieren resolución a nivel de aplicación, no solo para entradas incorrectas.</li>
        <li>Implementa 429 con limitación de tasa desde el principio en cualquier endpoint público — es mucho más difícil añadirlo después.</li>
      </ul>

      <h2>Depurar códigos de estado en DevTools</h2>
      <p>
        Abre la pestaña Network en DevTools del navegador y busca solicitudes en rojo — esas son
        respuestas 4xx o 5xx. Haz clic en una solicitud para ver el código de estado exacto, las
        cabeceras de respuesta (útiles para <code>WWW-Authenticate</code>, <code>Location</code>,{" "}
        <code>Retry-After</code>) y el cuerpo de la respuesta (que a menudo contiene un mensaje de
        error del servidor). Para las redirecciones, activa "Preserve log" para que el panel de
        DevTools no se limpie al navegar la página — de lo contrario perderás la cadena de redirecciones.
      </p>
      <p>
        Cuando encuentres un código de estado desconocido, la{" "}
        <a href="/tools/http-status">Referencia de Códigos de Estado HTTP de BrowseryTools</a> te
        da la descripción oficial, el RFC del que proviene y notas sobre el uso habitual — sin necesidad
        de abandonar tu pestaña del navegador.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Referencia de Códigos de Estado HTTP gratuita — Todos los códigos, fuentes RFC, notas de uso
        </p>
        <a
          href="/tools/http-status"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir la Referencia HTTP →
        </a>
      </div>
      <ToolCTA slug="http-status" variant="card" />
    </div>
  );
}
