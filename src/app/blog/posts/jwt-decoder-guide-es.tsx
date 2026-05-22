export default function Content() {
  return (
    <div>
      <p>
        Si has trabajado con cualquier sistema de autenticación web moderno — OAuth 2.0, OpenID Connect o una API
        personalizada — casi seguro que te has topado con tokens JWT. Aparecen en las cabeceras Authorization, en las
        cookies, en el almacenamiento local y en las sesiones de depuración a las 2 de la madrugada cuando un flujo de
        inicio de sesión falla misteriosamente. Entender qué contiene realmente un JWT, cómo leerlo y cómo detectar
        problemas comunes hace que la depuración de la autenticación sea drásticamente más rápida.
      </p>
      <p>
        El <a href="/tools/jwt-decoder">Decodificador JWT de BrowseryTools</a> te permite pegar cualquier token JWT y
        ver al instante su cabecera, su carga útil y su estado de expiración decodificados — todo en tu navegador, sin
        que el token salga jamás de tu dispositivo.
      </p>

      <h2>¿Qué es un JWT?</h2>
      <p>
        JWT significa JSON Web Token, definido en el RFC 7519. Un JWT es un token compacto y seguro para URL que
        codifica un conjunto de reclamaciones (claims) — afirmaciones sobre un sujeto, normalmente un usuario — en un
        formato que se puede verificar y en el que se puede confiar. La propiedad clave de un JWT es que es{" "}
        <em>autocontenido</em>: el propio token lleva toda la información que un servidor necesita para autenticar una
        petición, sin una consulta a la base de datos.
      </p>
      <p>
        Un JWT tiene este aspecto:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfODQyMTkiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImVkaXRvciJdLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImlhdCI6MTczODM2ODAwMCwiZXhwIjoxNzM4MzcxNjAwLCJqdGkiOiI3ZjNhOWI0Yy0xZDJlLTQ1NmYtYWJjZC04OTAxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </pre>
      <p>
        A primera vista parece un galimatías. Pero tiene una estructura muy precisa: tres secciones codificadas en
        Base64URL separadas por puntos. Cada sección tiene un propósito específico.
      </p>

      <h2>La estructura de tres partes: Cabecera.CargaÚtil.Firma</h2>

      <h3>Parte 1: la cabecera</h3>
      <p>
        El primer segmento, antes del primer punto, es la <strong>cabecera</strong>. Es un objeto JSON codificado en
        Base64URL que describe el tipo del token y el algoritmo de firma. Decodificada, la cabecera del ejemplo de
        arriba tiene este aspecto:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </pre>
      <p>
        El campo <code>alg</code> especifica el algoritmo de firma. Los valores comunes con los que te encontrarás son:
      </p>
      <ul>
        <li>
          <strong>HS256</strong> — HMAC con SHA-256. Usa una clave secreta compartida. Tanto el emisor como el
          verificador deben tener el mismo secreto. Común en aplicaciones monolíticas.
        </li>
        <li>
          <strong>RS256</strong> — firma RSA con SHA-256. Usa un par de claves pública/privada. El emisor firma con la
          clave privada; los verificadores comprueban con la clave pública. Común en sistemas distribuidos y
          proveedores OAuth.
        </li>
        <li>
          <strong>ES256</strong> — ECDSA con P-256 y SHA-256. Como RS256 pero usando curvas elípticas — claves más
          cortas, mismo nivel de seguridad. Preferido en sistemas modernos de alto rendimiento.
        </li>
        <li>
          <strong>none</strong> — sin firma. Nunca aceptes esto en producción. Surge una notoria vulnerabilidad de
          seguridad cuando los servidores aceptan tokens sin firmar porque el cliente cambió <code>alg</code>{" "}
          a <code>"none"</code>.
        </li>
      </ul>

      <h3>Parte 2: la carga útil</h3>
      <p>
        El segundo segmento es la <strong>carga útil</strong> (payload) — los datos reales que lleva el token. También
        es un objeto JSON codificado en Base64URL. La carga útil decodificada de nuestro ejemplo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "sub": "usr_84219",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "roles": ["user", "editor"],
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "iat": 1738368000,
  "exp": 1738371600,
  "jti": "7f3a9b4c-1d2e-456f-abcd-890123456789"
}`}
      </pre>
      <p>
        La carga útil contiene dos tipos de reclamaciones: las <strong>reclamaciones registradas</strong> definidas por
        la especificación JWT, y las <strong>reclamaciones privadas/personalizadas</strong> añadidas por tu aplicación
        (como
        <code>name</code>, <code>email</code> y <code>roles</code> arriba).
      </p>

      <h3>Parte 3: la firma</h3>
      <p>
        El tercer segmento es la <strong>firma</strong>. Se calcula tomando la cabecera codificada en Base64URL, un
        punto, la carga útil codificada en Base64URL, y firmando el resultado con el algoritmo y la clave especificados
        en la cabecera. Para HS256:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}
      </pre>
      <p>
        La firma garantiza la integridad: si alguien modifica aunque sea un solo carácter en la cabecera o la carga útil
        después de que el token se emita, la firma se vuelve inválida y la verificación falla. Sin conocer el secreto de
        firma (o la clave privada del emisor para RS256/ES256), un atacante no puede falsificar un token válido.
      </p>

      <h2>Referencia de reclamaciones JWT estándar</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Reclamación</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Nombre completo</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iss</code></td>
              <td style={{padding: "10px 16px"}}>Emisor (Issuer)</td>
              <td style={{padding: "10px 16px"}}>Quién emitió el token (por ejemplo, la URL de tu servidor de autenticación)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>sub</code></td>
              <td style={{padding: "10px 16px"}}>Sujeto (Subject)</td>
              <td style={{padding: "10px 16px"}}>Sobre quién trata el token — normalmente el ID único del usuario</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>aud</code></td>
              <td style={{padding: "10px 16px"}}>Audiencia (Audience)</td>
              <td style={{padding: "10px 16px"}}>A qué servicio(s) está destinado el token</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>exp</code></td>
              <td style={{padding: "10px 16px"}}>Hora de expiración (Expiration Time)</td>
              <td style={{padding: "10px 16px"}}>Marca de tiempo Unix después de la cual el token debe rechazarse</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iat</code></td>
              <td style={{padding: "10px 16px"}}>Emitido en (Issued At)</td>
              <td style={{padding: "10px 16px"}}>Marca de tiempo Unix de cuándo se creó el token</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>nbf</code></td>
              <td style={{padding: "10px 16px"}}>No antes de (Not Before)</td>
              <td style={{padding: "10px 16px"}}>El token no es válido antes de esta marca de tiempo Unix</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>jti</code></td>
              <td style={{padding: "10px 16px"}}>ID del JWT (JWT ID)</td>
              <td style={{padding: "10px 16px"}}>Identificador único del token — usado para prevenir ataques de repetición</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Por qué la reclamación exp es crucial</h2>
      <p>
        La reclamación <code>exp</code> es una marca de tiempo Unix — el número de segundos desde el 1 de enero de 1970
        (UTC). En nuestro ejemplo, <code>"exp": 1738371600</code>. Para convertir esto a una fecha legible para humanos,
        puedes usar JavaScript:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`new Date(1738371600 * 1000).toUTCString()
// → "Sat, 01 Feb 2026 01:00:00 GMT"`}
      </pre>
      <p>
        La expiración del JWT es lo primero que hay que comprobar cuando un token está siendo rechazado. Un token que
        era válido ayer fallará hoy si su <code>exp</code> está en el pasado — esto es por diseño. Los tokens de corta
        duración (de 15 minutos a 1 hora) limitan la ventana de daño si un token es robado. Los tokens de mayor duración
        (días o semanas) son más cómodos pero más peligrosos si quedan comprometidos.
      </p>
      <p>
        El <a href="/tools/jwt-decoder">Decodificador JWT de BrowseryTools</a> lee automáticamente las reclamaciones{" "}
        <code>exp</code> e <code>iat</code> y las muestra como fechas legibles para humanos junto a las marcas de tiempo
        Unix en bruto, así que nunca tienes que hacer los cálculos mentales a mano.
      </p>

      <h2>Escenarios comunes de depuración de JWT</h2>

      <h3>Token expirado (401 Unauthorized)</h3>
      <p>
        El error de JWT más común. El servidor rechazó el token porque la hora actual ha superado el valor de
        <code>exp</code>. Solución: implementa un flujo de actualización de token usando un token de actualización de
        mayor duración, o simplemente vuelve a autenticarte. Pega el token en el decodificador para confirmar
        exactamente cuándo expiró.
      </p>

      <h3>Audiencia incorrecta</h3>
      <p>
        Si tu API valida la reclamación <code>aud</code> y el token se emitió para una audiencia diferente (por ejemplo,
        un token emitido para <code>https://api-staging.example.com</code> enviado a{" "}
        <code>https://api.example.com</code>), el servidor lo rechazará. Decodifica el token e inspecciona el campo
        <code>aud</code> para confirmar que coincide con lo que espera el servicio receptor.
      </p>

      <h3>Discrepancia de algoritmo</h3>
      <p>
        Si tu servidor espera RS256 pero recibe un token firmado con HS256 (o viceversa), la validación falla. Esto
        puede ocurrir durante la rotación de claves o al cambiar de proveedor de autenticación. Comprueba el campo{" "}
        <code>alg</code> en la cabecera decodificada frente a lo que tu servidor está configurado para aceptar.
      </p>

      <h3>Firma inválida</h3>
      <p>
        Si la carga útil ha sido manipulada — aunque solo se haya cambiado un carácter — la firma no coincidirá. Esto
        también ocurre si estás usando el secreto incorrecto o la clave pública incorrecta para verificar. Decodificar
        la cabecera y la carga útil (lo que no requiere ningún secreto) te permite al menos inspeccionar qué afirma el
        token, aunque no puedas verificar su autenticidad en el lado del cliente.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Advertencia de seguridad — la carga útil no está cifrada:</strong> la carga útil del JWT está
        codificada en Base64URL, no cifrada. Cualquiera que tenga la cadena del token puede decodificar la cabecera y la
        carga útil sin ninguna clave ni secreto. Nunca almacenes información sensible en la carga útil de un JWT — ni
        contraseñas, ni datos de tarjetas de pago, ni números de seguridad social, ni claves privadas. Trata la carga
        útil como datos de lectura pública que solo son a prueba de manipulación, no confidenciales.
      </div>

      <h2>JWT frente a tokens de sesión: cuándo usar cada uno</h2>
      <p>
        Los JWT y los tokens de sesión tradicionales resuelven el mismo problema — identificar a un usuario autenticado
        a lo largo de varias peticiones — pero lo hacen de forma diferente, y ninguno es universalmente mejor.
      </p>
      <p>
        Los <strong>tokens de sesión tradicionales</strong> son cadenas aleatorias opacas (por ejemplo, un UUID)
        almacenadas en el lado del servidor en un almacén de sesiones (Redis, base de datos). En cada petición, el
        servidor busca el token en el almacén y recupera los datos del usuario. El servidor tiene control total:
        invalidar una sesión revoca el acceso de inmediato.
      </p>
      <p>
        Los <strong>JWT</strong> no tienen estado. El servidor emite un token firmado y no guarda ningún registro de él.
        En cada petición, el servidor verifica la firma y confía en las reclamaciones sin ninguna consulta a la base de
        datos. Esto escala horizontalmente sin estado compartido — cualquier servidor con la clave de verificación
        puede autenticar la petición. La contrapartida: no puedes revocar un JWT de inmediato antes de que expire (a
        menos que implementes una lista de bloqueo de tokens, lo que reintroduce el estado).
      </p>
      <ul>
        <li>Usa los <strong>JWT</strong> para microservicios sin estado, sistemas distribuidos, APIs móviles y
        autenticación entre dominios (flujos OAuth/OIDC). Mantén cortos los tiempos de expiración.</li>
        <li>Usa los <strong>tokens de sesión</strong> cuando necesites capacidad de revocación inmediata (cierre de
        sesión, suspensión de cuenta, incidentes de seguridad), o cuando todos tus servicios compartan un almacén de
        sesiones rápido.</li>
      </ul>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Regla de seguridad crítica:</strong> verifica siempre las firmas de los JWT en el lado del servidor
        usando una clave de confianza. Nunca confíes únicamente en la verificación del lado del cliente. Un cliente
        puede decodificar la carga útil de cualquier JWT sin un secreto — pero solo el servidor, que posee la clave
        correcta, puede determinar si la firma es genuina y si se puede confiar en el token. La decodificación en el
        lado del cliente solo es útil para <em>leer</em>{" "}
        reclamaciones (como mostrar el nombre del usuario en una interfaz), nunca para tomar decisiones de autorización.
      </div>

      <h2>Cómo usar el Decodificador JWT de BrowseryTools</h2>
      <p>
        Abre el <a href="/tools/jwt-decoder">Decodificador JWT</a> y pega tu token en el campo de entrada. La
        herramienta divide inmediatamente el token por los dos puntos y muestra:
      </p>
      <ul>
        <li>
          <strong>Panel de la cabecera:</strong> el JSON decodificado que muestra <code>alg</code>, <code>typ</code> y
          cualquier otro campo de la cabecera. Útil para identificar el algoritmo de firma de un vistazo.
        </li>
        <li>
          <strong>Panel de la carga útil:</strong> el JSON decodificado completo con todas las reclamaciones. Las
          marcas de tiempo se muestran tanto en formato Unix en bruto como en fechas UTC legibles para humanos, para que
          puedas ver de inmediato la expiración sin conversión mental.
        </li>
        <li>
          <strong>Estado de expiración:</strong> un indicador claro que muestra si el token es actualmente válido, ya
          ha expirado o aún no está activo (basándose en <code>nbf</code>). Si ha expirado, ves exactamente hace cuánto
          expiró.
        </li>
        <li>
          <strong>Segmento de la firma:</strong> la firma en bruto codificada en Base64URL, mostrada como referencia.
          La herramienta no verifica la firma (eso requiere el secreto o la clave pública), pero decodifica y muestra
          toda la información que necesitas para depurar.
        </li>
      </ul>
      <p>
        No hay envío de formulario, ni petición al servidor, ni acceso al portapapeles más allá de lo que pegas
        explícitamente. El análisis del token ocurre por completo en JavaScript que se ejecuta en la pestaña de tu
        navegador.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tus tokens se mantienen privados:</strong> los tokens JWT a menudo contienen IDs de usuario,
        direcciones de correo, roles y otros datos personales. El Decodificador JWT de BrowseryTools procesa tu token
        por completo en tu navegador — nunca se envía a ningún servidor, nunca se registra y nunca se almacena. Puedes
        pegar con seguridad tokens de producción para inspeccionarlos sin preocuparte por su exposición. Una vez que
        cierras la pestaña, desaparece.
      </div>

      <h2>Decodifica tu token JWT ahora</h2>
      <p>
        Tanto si estás depurando un token expirado, inspeccionando reclamaciones de un proveedor OAuth, comprobando qué
        roles se le han concedido a un usuario o simplemente intentando entender qué está emitiendo realmente tu sistema
        de autenticación — el <a href="/tools/jwt-decoder">Decodificador JWT de BrowseryTools</a> te da las respuestas
        al instante. Sin registro, sin extensiones que instalar, sin que ningún dato se envíe a ningún sitio.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Decodificador JWT gratuito — instantáneo, privado, sin registro
        </p>
        <a
          href="/tools/jwt-decoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Decodificador JWT →
        </a>
      </div>
    </div>
  );
}
