export default function Content() {
  return (
    <div>
      <p>
        Las URLs parecen simples desde fuera — una cadena de texto que apunta a un recurso. Pero bajo la
        dentro siguen una gramática estricta que solo permite un conjunto específico de caracteres. En
        el momento en que intentas pasar un espacio, un ampersand o un carácter no ASCII en una URL sin
        codificarlo, las cosas se rompen de formas difíciles de depurar. La codificación porcentual
        (comúnmente llamada codificación de URL) es el mecanismo que permite incrustar datos arbitrarios
        de forma segura en una URL.
      </p>
      <p>
        Puedes codificar y decodificar URLs al instante con el{" "}
        <a href="/tools/url-encoder">Codificador/Decodificador de URL de BrowseryTools</a> — gratuito,
        sin registro, todo se procesa en tu navegador.
      </p>

      <h2>Por qué los caracteres especiales rompen las URLs</h2>
      <p>
        La especificación de URL (RFC 3986) reserva ciertos caracteres para propósitos estructurales. El{" "}
        <code>?</code> separa la ruta de la cadena de consulta. El <code>&amp;</code> separa los parámetros
        de consulta entre sí. El <code>#</code> marca un identificador de fragmento. El <code>/</code>{" "}
        separa los segmentos de ruta. Si tus datos contienen alguno de estos caracteres, un analizador de
        URL no puede distinguir entre tus datos y la estructura de la URL.
      </p>
      <p>
        Considera una búsqueda de <code>rock &amp; roll</code>. Si construyes la URL ingenuamente obtienes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/search?q=rock & roll
          ^     ^
          |     └── looks like a new parameter begins here
          └── this & splits q from a phantom second parameter`}
      </pre>
      <p>
        El analizador lee <code>q=rock </code> (con un espacio al final) como primer parámetro, y luego
        encuentra lo que parece ser el inicio de un segundo parámetro llamado <code> roll</code>. Ambos
        valores son incorrectos. La URL correcta es <code>/search?q=rock%20%26%20roll</code> — el espacio
        se convierte en <code>%20</code> y el ampersand en <code>%26</code>.
      </p>

      <h2>Qué hace realmente la codificación porcentual</h2>
      <p>
        La codificación porcentual convierte un byte en una secuencia de tres caracteres: un signo de
        porcentaje literal seguido de dos dígitos hexadecimales en mayúsculas que representan el valor del
        byte. El carácter espacio (byte ASCII 32, hex <code>0x20</code>) se convierte en <code>%20</code>.
        El símbolo arroba (<code>@</code>, ASCII 64, hex <code>0x40</code>) se convierte en <code>%40</code>.
        La regla es:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`percent-encode(byte) = "%" + byte.toString(16).toUpperCase().padStart(2, "0")

Examples:
  space  (0x20) → %20
  @      (0x40) → %40
  [      (0x5B) → %5B
  €      (UTF-8: 0xE2 0x82 0xAC) → %E2%82%AC`}
      </pre>
      <p>
        Para caracteres Unicode multibyte (cualquier cosa fuera de ASCII), el carácter se codifica
        primero como bytes UTF-8, y luego cada byte se codifica porcentualmente. El signo del euro{" "}
        <code>€</code> ocupa tres bytes UTF-8, por lo que se convierte en tres secuencias codificadas
        porcentualmente: <code>%E2%82%AC</code>.
      </p>

      <h2>Caracteres seguros vs caracteres reservados</h2>
      <p>
        No todos los caracteres necesitan codificación. El RFC 3986 define dos conjuntos que son seguros
        tal como están:
      </p>
      <ul>
        <li><strong>Caracteres no reservados</strong> — A–Z, a–z, 0–9, guion, guion bajo, punto, tilde. No tienen ningún significado especial y nunca necesitan codificación.</li>
        <li><strong>Caracteres reservados</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>. Son seguros en sus posiciones estructurales, pero deben codificarse cuando aparecen como valores de datos.</li>
      </ul>
      <p>
        Todo lo demás — espacios, Unicode, caracteres de control, la mayoría de la puntuación — siempre
        debe codificarse.
      </p>

      <h2>encodeURI vs encodeURIComponent: la diferencia crítica</h2>
      <p>
        JavaScript incluye dos funciones de codificación integradas, y confundirlas es uno de los errores
        de codificación de URL más comunes en las aplicaciones web.
      </p>
      <p>
        <code>encodeURI()</code> está diseñada para codificar una URL completa. Deja intactos todos los
        caracteres reservados porque son estructuralmente significativos en una URL completa. La usarías
        si tienes una URL completa que podría contener espacios o Unicode pero tiene una estructura válida:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURI("https://example.com/search?q=hello world&lang=en")
// → "https://example.com/search?q=hello%20world&lang=en"
//   ✓ space encoded, but & and ? left intact`}
      </pre>
      <p>
        <code>encodeURIComponent()</code> está diseñada para codificar un valor individual — el valor de
        un parámetro de consulta, un segmento de ruta, cualquier cosa que deba tratarse como datos puros.
        Codifica también los caracteres reservados, incluidos <code>&amp;</code>, <code>=</code>,{" "}
        <code>?</code> y <code>/</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURIComponent("rock & roll")
// → "rock%20%26%20roll"
//   ✓ & encoded — safe to use as a query parameter value

encodeURIComponent("https://example.com/page")
// → "https%3A%2F%2Fexample.com%2Fpage"
//   ✓ colons and slashes encoded — safe as a redirect_uri value`}
      </pre>
      <p>
        La regla práctica: al construir una URL, usa <code>encodeURIComponent()</code> en cada valor de
        parámetro individual, nunca en la URL completa. Usa <code>encodeURI()</code> solo en una URL
        completa que quieras normalizar. En código moderno, prefiere las APIs <code>URL</code> y{" "}
        <code>URLSearchParams</code> frente a la codificación manual — gestionan la codificación de forma
        automática y correcta.
      </p>

      <h2>Problemas frecuentes en la codificación de cadenas de consulta</h2>
      <p>
        Varios errores sutiles aparecen repetidamente al codificar cadenas de consulta. El signo{" "}
        <code>+</code> merece mención especial: en el formato{" "}
        <code>application/x-www-form-urlencoded</code> (el formato que usan los formularios HTML al
        enviar datos), un espacio se codifica como <code>+</code> en lugar de <code>%20</code>. Es una
        convención heredada anterior al RFC 3986. Si tu backend decodifica URL con reglas de codificación
        de formulario y el frontend envía <code>%20</code>, funciona bien. Pero si el frontend envía{" "}
        <code>+</code> y tu backend decodifica con reglas RFC 3986, el <code>+</code> queda como un signo
        más literal — no como un espacio.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// URLSearchParams uses application/x-www-form-urlencoded (+ for spaces)
new URLSearchParams({ q: "rock & roll" }).toString()
// → "q=rock+%26+roll"

// encodeURIComponent uses RFC 3986 (%20 for spaces)
"q=" + encodeURIComponent("rock & roll")
// → "q=rock%20%26%20roll"

// Both are valid — just be consistent on both ends`}
      </pre>

      <h2>Cómo se codifican los datos de formulario en la URL</h2>
      <p>
        Cuando un formulario HTML se envía con <code>method="GET"</code>, el navegador serializa los campos
        del formulario en una cadena de consulta usando <code>application/x-www-form-urlencoded</code>. Cada
        nombre y valor de campo se codifica (espacios como <code>+</code>, caracteres especiales como{" "}
        <code>%XX</code>), y los campos se unen con <code>&amp;</code>. Para formularios con{" "}
        <code>method="POST"</code> sin atributo <code>enctype</code>, se usa la misma codificación pero
        los datos van en el cuerpo de la petición en lugar de en la URL.
      </p>
      <p>
        Este es también el formato que usa <code>fetch()</code> cuando pasas un objeto{" "}
        <code>URLSearchParams</code> como cuerpo, y es lo que la mayoría de los frameworks del lado del
        servidor decodifican automáticamente al leer envíos de formularios.
      </p>

      <h2>Base64 en URLs</h2>
      <p>
        El Base64 estándar usa <code>+</code> y <code>/</code> — ambos con significados especiales en las
        URLs. Cuando los datos codificados en Base64 necesitan aparecer en una URL (patrón común para
        tokens, datos de imagen o firmas criptográficas), usa la variante Base64URL en su lugar. Reemplaza{" "}
        <code>+</code> por <code>-</code> y <code>/</code> por <code>_</code>, produciendo una cadena
        segura en cualquier posición de la URL sin codificación adicional. Los JWTs utilizan este formato
        para sus segmentos de encabezado y carga útil.
      </p>

      <h2>Errores reales de codificación</h2>
      <p>
        Algunos patrones de error que aparecen en aplicaciones en producción:
      </p>
      <ul>
        <li><strong>Doble codificación</strong> — codificar una URL ya codificada. <code>%20</code> se convierte en <code>%2520</code> porque el propio <code>%</code> se codifica como <code>%25</code>. Comprueba siempre si un valor ya está codificado antes de volver a codificarlo.</li>
        <li><strong>Falta encodeURIComponent en redirect_uri</strong> — los flujos OAuth pasan un <code>redirect_uri</code> como parámetro de consulta. Si contiene un <code>?</code> o un <code>&amp;</code> y no está codificado, el servidor de autenticación analiza esos caracteres como parte de la estructura de la URL exterior, rompiendo la redirección.</li>
        <li><strong>Codificación distinta de UTF-8</strong> — sistemas antiguos o servidores mal configurados a veces codifican porcentualmente cadenas usando ISO-8859-1 en lugar de UTF-8. La secuencia de bytes para <code>é</code> difiere entre ambos. Aplica UTF-8 de forma consistente en ambos lados.</li>
        <li><strong>Registro de URLs sin procesar</strong> — registrar una URL que contiene datos de usuario codificados puede producir registros engañosos si tu visor de logs decodifica automáticamente las secuencias porcentuales, ocultando lo que se envió realmente por la red.</li>
      </ul>

      <h2>Codifica y decodifica URLs al instante</h2>
      <p>
        Ya sea que estés depurando una redirección OAuth, construyendo una cadena de consulta a mano,
        inspeccionando una petición de API malformada o simplemente intentando entender qué contiene una
        URL codificada porcentualmente —
        el{" "}
        <a href="/tools/url-encoder">Codificador/Decodificador de URL de BrowseryTools</a> lo gestiona al
        instante. Pega tu cadena, elige codificar o decodificar, y ve el resultado de inmediato. Sin
        llamadas al servidor, sin registro.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Codificador / Decodificador de URL gratuito — funciona 100% en tu navegador
        </p>
        <a
          href="/tools/url-encoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Codificador de URL →
        </a>
      </div>
    </div>
  );
}
