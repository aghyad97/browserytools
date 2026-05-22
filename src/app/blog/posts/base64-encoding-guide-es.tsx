export default function Content() {
  return (
    <div>
      <p>
        Abre cualquier aplicación web moderna, inspecciona una petición HTTP, echa un vistazo a un manifiesto de
        Kubernetes o asómate al interior de un token JWT — Base64 está por todas partes. Es uno de esos esquemas de
        codificación fundamentales que los desarrolladores encuentran constantemente pero que rara vez se detienen a
        entender del todo. Esta guía explica qué es Base64, cómo funciona a nivel de bytes, dónde se usa en sistemas
        reales y cuándo deberías (y cuándo no) recurrir a él.
      </p>
      <p>
        Puedes codificar y decodificar cualquier cadena Base64 al instante usando el{" "}
        <a href="/tools/base64">Codificador/Decodificador Base64 de BrowseryTools</a> — gratis, sin registro y sin que
        nada salga jamás de tu navegador.
      </p>

      <h2>¿Por qué existe Base64?</h2>
      <p>
        Para entender Base64, necesitas comprender el problema que resuelve. En los primeros días de internet, muchos
        protocolos de comunicación — en particular el correo electrónico — se diseñaron en torno al texto ASCII de 7
        bits. ASCII define 128 caracteres usando 7 bits por carácter. Los datos binarios (imágenes, documentos,
        ejecutables) usan los 8 bits por byte, produciendo valores de byte que no tenían representación ASCII y que los
        sistemas más antiguos descartaban, alteraban o interpretaban como comandos de control.
      </p>
      <p>
        El estándar MIME (Multipurpose Internet Mail Extensions), introducido en 1991 para permitir que el correo
        electrónico transportara adjuntos, necesitaba una forma de transmitir datos binarios arbitrarios a través de
        estos canales limpios de 7 bits. La solución fue recodificar los datos binarios usando solo un subconjunto
        seguro de caracteres ASCII imprimibles — uno en el que todos los sistemas estuvieran de acuerdo y que
        transmitieran fielmente. Base64 se convirtió en la codificación estándar para este propósito, y el nombre
        describe el enfoque: usar un conjunto de 64 caracteres seguros para representar cualquier dato binario.
      </p>

      <h2>El alfabeto de 64 caracteres</h2>
      <p>
        Base64 usa exactamente 64 caracteres, por lo que 6 bits de entrada siempre pueden representarse con un carácter
        Base64 (2<sup>6</sup> = 64). El alfabeto estándar definido en el RFC 4648 es:
      </p>
      <ul>
        <li>Letras mayúsculas <code>A</code> a <code>Z</code> — valores 0 a 25</li>
        <li>Letras minúsculas <code>a</code> a <code>z</code> — valores 26 a 51</li>
        <li>Dígitos <code>0</code> a <code>9</code> — valores 52 a 61</li>
        <li><code>+</code> — valor 62</li>
        <li><code>/</code> — valor 63</li>
      </ul>
      <p>
        Un sexagésimo quinto carácter — el signo igual <code>=</code> — se usa como relleno pero no representa datos. El
        relleno garantiza que la longitud de la salida codificada sea siempre un múltiplo de 4 caracteres, lo que
        simplifica la decodificación.
      </p>

      <h2>Cómo funciona la codificación Base64: 3 bytes → 4 caracteres</h2>
      <p>
        Base64 funciona tomando 3 bytes de entrada (24 bits) y dividiéndolos en cuatro grupos de 6 bits. Cada grupo de 6
        bits se asigna a un carácter del alfabeto Base64. Como 3 bytes se convierten en 4 caracteres, la codificación
        Base64 aumenta el tamaño de los datos exactamente en un tercio (33%).
      </p>
      <p>
        Veamos un ejemplo concreto: codificar la cadena ASCII <code>"Man"</code>.
      </p>
      <p>
        Paso 1 — Convierte cada carácter a su valor de byte ASCII y luego a binario:
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Paso 2 — Concatena los 24 bits en un solo flujo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (concatenate all 24 bits)
010011 010110 000101 101110`}
      </pre>
      <p>
        Paso 3 — Asigna cada grupo de 6 bits al alfabeto Base64:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Grupo de 6 bits</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Valor decimal</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Carácter Base64</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        La codificación Base64 de <code>"Man"</code> es <code>TWFu</code>. Puedes verificarlo usando la{" "}
        <a href="/tools/base64">herramienta Base64 de BrowseryTools</a>. Cuando la longitud de la entrada no es múltiplo
        de 3, se añaden caracteres de relleno (<code>=</code> o <code>==</code>) para llevar la salida a un múltiplo de
        4 caracteres. Por ejemplo, <code>"Ma"</code> se codifica como <code>TWE=</code> y <code>"M"</code>{" "}
        se codifica como <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Error común:</strong> Base64 es codificación, no cifrado. El proceso es completamente reversible por
        cualquiera sin ninguna clave ni contraseña. Ver datos codificados en Base64 en una URL, una cabecera o un
        archivo no significa que esos datos estén protegidos de ninguna manera — es simplemente una representación
        distinta de los mismos bytes. Cualquiera que pueda copiar la cadena puede decodificarla al instante.
      </div>

      <h2>Casos de uso comunes</h2>

      <h3>Incrustar imágenes en HTML y CSS</h3>
      <p>
        En lugar de hacer una petición HTTP aparte para una imagen o un icono pequeño, puedes incrustarlo directamente
        en tu HTML o CSS como un data URI. El navegador decodifica la cadena Base64 y representa la imagen sin una ida y
        vuelta de red. Esto es útil para recursos pequeños como favicons, ruedas de carga o iconos en línea en
        plantillas de correo donde la carga de URL externas puede estar bloqueada.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* CSS example — embedding a small PNG icon */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Datos binarios en APIs JSON</h3>
      <p>
        JSON es un formato de texto. Si una API necesita transmitir datos binarios — un archivo, una clave
        criptográfica, una firma, una imagen — dentro de una carga útil JSON, no puede incluir bytes en bruto.
        Codificar los datos binarios en Base64 los convierte en una cadena de texto plano que JSON puede transportar sin
        problemas. Muchas APIs que devuelven contenido de archivos, muestras de audio o imágenes en respuestas JSON usan
        este enfoque.
      </p>

      <h3>Autenticación básica HTTP</h3>
      <p>
        El esquema de autenticación básica HTTP envía las credenciales en la cabecera <code>Authorization</code> como
        una codificación Base64 de <code>username:password</code>. Por ejemplo, las credenciales <code>admin:secret</code>{" "}
        se convierten en la cadena <code>YWRtaW46c2VjcmV0</code>, y la cabecera completa se ve así:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        Esto no está cifrado — solo está codificado. La autenticación básica debe usarse siempre sobre HTTPS, nunca
        sobre HTTP plano, porque las credenciales pueden decodificarse trivialmente por cualquiera que intercepte la
        petición.
      </p>

      <h3>Cargas útiles de JWT</h3>
      <p>
        Los JSON Web Tokens codifican su cabecera y su carga útil usando Base64URL (una variante segura para URL que se
        describe más abajo). Las reclamaciones del token — ID de usuario, hora de expiración, roles — se almacenan en la
        carga útil como un objeto JSON codificado en Base64URL. De nuevo, esto no es cifrado: la carga útil es
        completamente legible por cualquiera que tenga el token.
      </p>

      <h3>Secretos de Kubernetes</h3>
      <p>
        Kubernetes almacena los valores de los Secrets como cadenas codificadas en Base64 en los manifiestos YAML. Aquí
        tienes un ejemplo real de un Secret de Kubernetes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        Para averiguar qué son realmente esos valores, pega <code>YWRtaW4=</code> en el{" "}
        <a href="/tools/base64">Decodificador Base64 de BrowseryTools</a>. El resultado es <code>admin</code>. Pega{" "}
        <code>cGFzc3dvcmQxMjM=</code> y obtienes <code>password123</code>. Kubernetes codifica en Base64 los valores
        secretos para un formato YAML seguro, no por seguridad — la seguridad real proviene del RBAC de Kubernetes y del
        cifrado en reposo, no de la codificación en sí.
      </p>

      <h2>La variante Base64URL</h2>
      <p>
        El Base64 estándar usa dos caracteres que son especiales en las URLs: <code>+</code> (que significa espacio en
        la codificación de formularios) y <code>/</code> (que es un separador de rutas). Cuando los datos codificados en
        Base64 necesitan aparecer en una URL, un parámetro de consulta o un nombre de archivo, estos caracteres causan
        problemas.
      </p>
      <p>
        Base64URL lo resuelve sustituyendo:
      </p>
      <ul>
        <li><code>+</code> se reemplaza por <code>-</code> (guion)</li>
        <li><code>/</code> se reemplaza por <code>_</code> (guion bajo)</li>
        <li>El relleno final <code>=</code> a menudo se omite</li>
      </ul>
      <p>
        Base64URL se usa en JWTs, tokens OAuth y cualquier contexto donde la cadena codificada deba sobrevivir a la
        transmisión por URL sin codificación por porcentaje. La{" "}
        <a href="/tools/base64">herramienta Base64 de BrowseryTools</a> admite tanto la variante estándar como la
        variante segura para URL.
      </p>

      <h2>Cuándo NO usar Base64</h2>
      <p>
        Base64 es la herramienta adecuada en situaciones concretas, pero se usa mal con frecuencia. Aquí tienes cuándo
        deberías evitarlo:
      </p>
      <ul>
        <li>
          <strong>Archivos grandes:</strong> Base64 aumenta el tamaño de los datos en ~33%. Una imagen de 10 MB se
          convierte en aproximadamente 13,3 MB al codificarse en Base64. Incrustar archivos grandes como data URIs o
          cadenas Base64 en JSON ralentiza el análisis, aumenta el uso de memoria y desperdicia ancho de banda. Usa
          transferencias de archivos directas o URLs de almacenamiento de objetos para cualquier cosa de tamaño no
          trivial.
        </li>
        <li>
          <strong>Seguridad:</strong> nunca uses Base64 como medida de seguridad. No proporciona ninguna
          confidencialidad. Si los datos son sensibles, usa cifrado real (AES-GCM, RSA, etc.).
        </li>
        <li>
          <strong>Almacenamiento:</strong> almacenar datos binarios como Base64 en una columna de base de datos
          desperdicia un 33% más de espacio en comparación con almacenar los bytes en bruto en una columna binaria. Usa
          tipos binarios nativos de la base de datos (BYTEA en PostgreSQL, BLOB en MySQL) al almacenar datos binarios a
          gran escala.
        </li>
      </ul>

      <h2>Base64 frente a codificación hexadecimal: una comparación</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Propiedad</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hex (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Conjunto de caracteres</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 caracteres)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 caracteres)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Sobrecarga de tamaño</strong></td>
              <td style={{padding: "12px 16px"}}>~33% más grande</td>
              <td style={{padding: "12px 16px"}}>~100% más grande (2 caracteres por byte)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Legibilidad humana</strong></td>
              <td style={{padding: "12px 16px"}}>Baja — no reconocible</td>
              <td style={{padding: "12px 16px"}}>Moderada — legible a nivel de byte</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Casos de uso comunes</strong></td>
              <td style={{padding: "12px 16px"}}>Adjuntos de correo, JWT, data URIs, cargas útiles de API</td>
              <td style={{padding: "12px 16px"}}>Hashes criptográficos, sumas de verificación, códigos de color, direcciones MAC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>¿Seguro para URL?</strong></td>
              <td style={{padding: "12px 16px"}}>Solo con la variante Base64URL</td>
              <td style={{padding: "12px 16px"}}>Sí — todos los caracteres son seguros para URL</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Bits por carácter</strong></td>
              <td style={{padding: "12px 16px"}}>6 bits</td>
              <td style={{padding: "12px 16px"}}>4 bits</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Usa Base64 cuando necesites una codificación compacta de binario a texto y la amplitud del conjunto de
        caracteres no cause problemas. Usa hexadecimal cuando importe la inspección humana de los valores de bytes
        individuales — los resúmenes de hash, las sumas de verificación y las salidas criptográficas se muestran
        tradicionalmente en hexadecimal precisamente porque cada carácter hexadecimal corresponde directamente a 4 bits,
        haciendo trivialmente visibles los límites de los bytes.
      </p>

      <h2>Codificar y decodificar Base64 en código</h2>
      <p>
        La mayoría de los lenguajes proporcionan soporte integrado para Base64. Aquí tienes algunas líneas rápidas para
        entornos comunes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser or Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        Para una codificación o decodificación rápida y puntual sin escribir nada de código, la{" "}
        <a href="/tools/base64">herramienta Base64 de BrowseryTools</a> es la opción más rápida — pega tu cadena, elige
        codificar o decodificar y el resultado aparece al instante. No se envía nada a un servidor.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Garantía de privacidad:</strong> el codificador y decodificador Base64 de BrowseryTools procesa todo
        localmente en tu navegador usando JavaScript. Si estás codificando datos sensibles — claves de API, secretos,
        configuración privada — nunca tocan un servidor. Tus datos se quedan en tu dispositivo.
      </div>

      <h2>Codifica y decodifica Base64 al instante</h2>
      <p>
        Tanto si estás decodificando un secreto de Kubernetes, inspeccionando la carga útil de un JWT, creando un data
        URI para una imagen en línea o simplemente sientes curiosidad por lo que contiene una cadena Base64 — el{" "}
        <a href="/tools/base64">Codificador/Decodificador Base64 de BrowseryTools</a> lo resuelve con un solo clic. Pega
        tu entrada, obtén tu salida. Sin anuncios, sin registro, sin que ningún dato salga de tu dispositivo.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Codificador / Decodificador Base64 gratuito — se ejecuta 100% en tu navegador
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir herramienta Base64 →
        </a>
      </div>
    </div>
  );
}
