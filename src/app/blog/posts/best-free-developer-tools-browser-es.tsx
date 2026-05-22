import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Cada desarrollador acumula una lista mental de sitios de referencia para tareas rápidas: decodificar esa cadena Base64, validar este blob de JSON, comprobar qué contiene realmente ese JWT. El problema es que esa lista normalmente incluye una docena de sitios distintos — cada uno con sus propios banners de cookies, peticiones de registro y dudas de privacidad.
      </p>

      <p>
        <strong>BrowseryTools</strong> consolida las utilidades de desarrollo más esenciales en una sola suite rápida y centrada en la privacidad. Todo se ejecuta localmente en tu navegador. Sin subidas. Sin claves de API. Sin límites de tasa. Esta guía recorre cada herramienta y te muestra exactamente cuándo y por qué recurrirías a ella.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Por qué las herramientas de navegador superan a los paquetes npm y a las API en la nube:</strong> Instalar un paquete npm lleva tiempo, se suma a tu árbol de dependencias, requiere que Node.js esté disponible y puede tener vulnerabilidades de seguridad en su cadena de dependencias. Las API en la nube requieren autenticación, tienen límites de tasa e introducen latencia. Una herramienta de navegador es instantánea, sin dependencias, y funciona igual en cada máquina.
      </div>

      <h2>Formateador y Validador de JSON</h2>

      <p>
        JSON es la lengua franca de las API modernas. Cuando estás mirando un blob minificado de 3 KB devuelto por un endpoint, el <Link href="/tools/json-formatter">Formateador de JSON</Link> lo hace instantáneamente legible.
      </p>

      <h3>Qué hace</h3>
      <ul>
        <li><strong>Formatear y embellecer:</strong> Toma JSON compacto y añade sangrado y saltos de línea</li>
        <li><strong>Validar:</strong> Señala errores de sintaxis con la línea y posición de carácter exactas</li>
        <li><strong>Minificar:</strong> Elimina todo el espacio en blanco para producir JSON compacto para payloads</li>
        <li><strong>Vista de árbol:</strong> Explora objetos y arrays anidados en un árbol plegable</li>
      </ul>

      <h3>Escenarios comunes</h3>
      <p>Pega una respuesta de API desde tu terminal para entender su estructura:</p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Raw curl output
curl -s https://api.example.com/user/42

# Minified response that's hard to read:
{"id":42,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}

# Paste into BrowseryTools JSON Formatter → instantly readable:
{
  "id": 42,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "meta": {
    "created": "2024-01-01",
    "active": true
  }
}`}</code></pre>

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Formateador de JSON →</Link>

      <h2>Codificador / Decodificador Base64</h2>

      <p>
        La codificación Base64 aparece en todas partes: adjuntos de correo (MIME), incrustar imágenes en CSS, codificar datos binarios para API y almacenar credenciales en archivos de configuración. La <Link href="/tools/base64">herramienta Base64</Link> maneja tanto la codificación como la decodificación, con soporte para Base64 estándar y para las variantes Base64 seguras para URL.
      </p>

      <h3>Cuándo lo necesitas</h3>
      <ul>
        <li>Decodificar una cabecera <code>Authorization: Basic ...</code> para ver el usuario:contraseña</li>
        <li>Codificar una imagen para incrustarla directamente en un <code>url()</code> de CSS o en un atributo <code>src</code> de HTML</li>
        <li>Inspeccionar valores de configuración codificados en Base64 en secretos de Kubernetes</li>
        <li>Codificar payloads binarios para API REST que no aceptan bytes en bruto</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Codificador/Decodificador Base64 →</Link>

      <h2>Decodificador de JWT</h2>

      <p>
        Los JSON Web Tokens se usan para la autenticación en prácticamente todas las aplicaciones web modernas. Cuando algo va mal con la autenticación — un token caducado, una reclamación que falta, una audiencia inesperada — necesitas inspeccionar el token <em>ahora mismo</em>, no escribir un script para hacerlo.
      </p>

      <p>
        El <Link href="/tools/jwt-decoder">Decodificador de JWT</Link> acepta una cadena JWT y muestra inmediatamente la cabecera, el payload y el estado de verificación de la firma decodificados. Resalta el tiempo de expiración (reclamación <code>exp</code>), el tiempo de emisión (<code>iat</code>), y te dice si el token es actualmente válido, ha caducado o aún no es válido.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Nota de seguridad:</strong> Nunca pegues tokens JWT de producción en un decodificador de terceros desconocido — esos tokens representan sesiones de usuario activas. BrowseryTools decodifica los JWT íntegramente en tu navegador usando operaciones de cadenas Base64. El token nunca sale de tu dispositivo, lo que lo convierte en la única opción segura para inspeccionar tokens de entornos en vivo.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Decodificador de JWT →</Link>

      <h2>Generador de UUID</h2>

      <p>
        Los Identificadores Únicos Universales (UUID) son esenciales para las claves primarias de bases de datos, las claves de idempotencia, los ID de correlación y el diseño de sistemas distribuidos. El <Link href="/tools/uuid-generator">Generador de UUID</Link> produce UUID v4 criptográficamente aleatorios usando <code>crypto.randomUUID()</code> — la API nativa del navegador que produce identificadores correctamente aleatorios, no pseudoaleatorios.
      </p>

      <h3>Casos de uso</h3>
      <ul>
        <li>Generar ID de base de datos de prueba durante el desarrollo sin acceder a tu base de datos</li>
        <li>Crear claves de idempotencia para peticiones a API de pago</li>
        <li>Generar UUID en masa para datos semilla o archivos de fixtures</li>
        <li>Crear ID de correlación para trazado distribuido durante la depuración</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Generador de UUID →</Link>

      <h2>Generador de Hashes</h2>

      <p>
        El hashing criptográfico se usa para sumas de verificación, almacenamiento de contraseñas (¡nunca en bruto!), almacenamiento direccionable por contenido y verificación de integridad de datos. El <Link href="/tools/hash-generator">Generador de Hashes</Link> calcula hashes MD5, SHA-1, SHA-256 y SHA-512 usando la API nativa del navegador <code>crypto.subtle.digest()</code> — la misma implementación subyacente que usa tu sistema operativo.
      </p>

      <h3>Cuándo recurren a esto los desarrolladores</h3>
      <ul>
        <li>Verificar la suma de verificación de un archivo descargado contra el hash publicado</li>
        <li>Calcular el SHA-256 del cuerpo de una petición de API para AWS Signature Version 4</li>
        <li>Generar un valor ETag para un recurso estático</li>
        <li>Crear un hash de contenido para invalidación de caché en pipelines de compilación</li>
        <li>Comprobar si dos grandes bloques de texto son idénticos sin compararlos carácter por carácter</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Generador de Hashes →</Link>

      <h2>Probador de Expresiones Regulares</h2>

      <p>
        Las expresiones regulares son potentes y notoriamente difíciles de escribir correctamente bajo presión. El <Link href="/tools/regex-tester">Probador de Regex</Link> te ofrece un entorno en tiempo real: a medida que escribes tu patrón y tu cadena de prueba, las coincidencias se resaltan al instante. Admite todos los flags de regex de JavaScript (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>, <code>u</code>) y muestra los grupos capturados en una vista estructurada.
      </p>

      <h3>Ejemplos prácticos</h3>
      <ul>
        <li>Validar direcciones de correo, números de teléfono o códigos postales para sanear la entrada de formularios</li>
        <li>Escribir patrones de análisis de registros para extracción de logs estructurados</li>
        <li>Probar patrones de enrutamiento de URL antes de confirmarlos en la configuración de Express o Next.js</li>
        <li>Elaborar patrones compatibles con sed/awk sin una terminal</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Probador de Regex →</Link>

      <h2>Codificador / Decodificador de URL</h2>

      <p>
        Las URL solo pueden contener un conjunto limitado de caracteres ASCII. Los caracteres especiales — espacios, ampersands, signos de igual, texto no ASCII — deben codificarse en porcentaje. El <Link href="/tools/url-encoder">Codificador/Decodificador de URL</Link> maneja ambas direcciones y distingue entre <code>encodeURI</code> (codifica una URL completa, preservando los caracteres de estructura) y <code>encodeURIComponent</code> (codifica el valor de un parámetro de URL, codificando todo).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Codificador/Decodificador de URL →</Link>

      <h2>Conversor YAML ↔ JSON</h2>

      <p>
        Los archivos de configuración a menudo vienen en YAML (manifiestos de Kubernetes, flujos de trabajo de GitHub Actions, charts de Helm, Docker Compose), mientras que las API y el código trabajan con JSON. El <Link href="/tools/yaml-json">Conversor YAML ↔ JSON</Link> traduce entre ambos formatos al instante, preservando tipos, estructuras anidadas y el orden de los arrays.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# YAML input (Kubernetes deployment snippet):
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api

// JSON output:
{
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "api" } },
    "template": { "metadata": { "labels": { "app": "api" } } }
  }
}`}</code></pre>

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Conversor YAML ↔ JSON →</Link>

      <h2>Analizador de Expresiones Cron</h2>

      <p>
        Las expresiones cron son concisas pero crípticas. Un solo error en una programación cron puede significar que un trabajo se ejecute cada minuto en lugar de una vez al mes. El <Link href="/tools/cron-parser">Analizador de Cron</Link> traduce cualquier expresión cron a lenguaje sencillo, te muestra las próximas 10 ejecuciones programadas y valida la expresión contra los formatos cron estándar y extendido.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Analizador de Cron →</Link>

      <h2>Conversor de Bases Numéricas</h2>

      <p>
        Los programadores de sistemas, los desarrolladores de sistemas embebidos y cualquiera que trabaje cerca del hardware necesitan habitualmente convertir entre binario, octal, decimal y hexadecimal. El <Link href="/tools/number-base-converter">Conversor de Bases Numéricas</Link> convierte entre las cuatro bases simultáneamente y maneja entradas tanto de enteros como de números grandes.
      </p>

      <h3>Escenarios comunes</h3>
      <ul>
        <li>Convertir direcciones de memoria de hexadecimal a decimal para compararlas</li>
        <li>Entender valores de máscaras de bits viéndolos en binario</li>
        <li>Decodificar permisos de archivos Unix escritos en octal (<code>chmod 755</code> → binario <code>111 101 101</code>)</li>
        <li>Trabajar con valores de color: hex HTML <code>#FF6B35</code> → componentes decimales RGB</li>
        <li>Depurar secuencias de bytes de protocolo en redes o firmware embebido</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Conversor de Bases Numéricas →</Link>

      {/* Summary table */}
      <h2>Referencia rápida: todas las herramientas para desarrolladores de un vistazo</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Herramienta</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Caso de uso principal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Tecnología clave</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Formateador de JSON", "Formatear, validar, minificar JSON", "JSON.parse / JSON.stringify"],
              ["Codificador/Decodificador Base64", "Codificar/decodificar cadenas Base64", "btoa() / atob()"],
              ["Decodificador de JWT", "Inspeccionar cabecera, payload y expiración de JWT", "Análisis de cadenas Base64"],
              ["Generador de UUID", "Generar UUID v4", "crypto.randomUUID()"],
              ["Generador de Hashes", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Probador de Regex", "Probar y depurar patrones de regex", "Motor RegExp de JavaScript"],
              ["Codificador/Decodificador de URL", "Codificar/decodificar componentes de URL", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Convertir entre YAML y JSON", "biblioteca js-yaml (local)"],
              ["Analizador de Cron", "Explicar y validar expresiones cron", "cron-parser (local)"],
              ["Conversor de Bases Numéricas", "Binario, octal, decimal, hex", "parseInt() / toString()"],
            ].map(([tool, use, tech], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{tool}</td>
                <td style={{padding: "11px 16px"}}>{use}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", opacity: 0.75}}>{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>¿Por qué BrowseryTools en lugar de paquetes npm o API en la nube?</h2>

      <p>
        La comparación honesta: ¿cuándo deberías usar BrowseryTools frente a instalar un paquete o llamar a una API?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Paquete npm</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Requiere Node.js instalado</li>
            <li>Se suma al árbol de dependencias</li>
            <li>Riesgo potencial en la cadena de suministro</li>
            <li>Mejor para: código de producción</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>API en la nube</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Requiere configurar una clave de API</li>
            <li>Se aplican límites de tasa</li>
            <li>Los datos salen de tu dispositivo</li>
            <li>Mejor para: pipelines automatizados</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Cero configuración, funciona al instante</li>
            <li>Sin dependencias</li>
            <li>Los datos se quedan en local</li>
            <li>Mejor para: tareas manuales de desarrollo</li>
          </ul>
        </div>
      </div>

      <p>
        La respuesta es: usa BrowseryTools para las <em>tareas manuales, exploratorias y puntuales</em> que sería excesivo programar con un script. Decodificar un JWT para depurar un problema de autenticación, formatear una respuesta de API para entender su forma, generar un UUID para una prueba puntual — estos son exactamente los momentos en que una herramienta de navegador rápida y sin fricción ahorra 10 minutos de configuración para un trabajo de 10 segundos.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Consejo para desarrolladores:</strong> Guarda en marcadores <code>browserytools.com</code> junto a las herramientas de desarrollo de tu navegador. Cuando estés en mitad de una depuración y necesites decodificar, hashear, formatear o convertir algo rápidamente, tener estas herramientas a una pestaña de distancia significa que puedes mantenerte en el flujo en lugar de cambiar de contexto para escribir un script desechable.
      </div>

      <h2>Más allá de las herramientas para desarrolladores: más utilidades de BrowseryTools</h2>

      <p>
        BrowseryTools cubre mucho más que utilidades para desarrolladores. El mismo enfoque centrado en la privacidad y sin subidas se aplica a:
      </p>

      <ul>
        <li><strong>Herramientas de imagen:</strong> <Link href="/tools/image-compression">Compresión de imágenes</Link>, <Link href="/tools/bg-removal">eliminación de fondos con IA</Link>, <Link href="/tools/image-resizer">redimensionado</Link>, <Link href="/tools/image-converter">conversión de formatos</Link></li>
        <li><strong>Herramientas de texto:</strong> <Link href="/tools/markdown-editor">Editor de Markdown</Link>, <Link href="/tools/text-diff">comparador de texto</Link>, <Link href="/tools/text-case">conversor de mayúsculas y minúsculas</Link>, <Link href="/tools/lorem-ipsum">generador de Lorem ipsum</Link></li>
        <li><strong>Herramientas de seguridad:</strong> <Link href="/tools/password-generator">Generador de contraseñas</Link>, <Link href="/tools/password-strength">verificador de fortaleza de contraseñas</Link>, <Link href="/tools/text-encryption">cifrado de texto</Link></li>
        <li><strong>Productividad:</strong> <Link href="/tools/pomodoro">Temporizador Pomodoro</Link>, <Link href="/tools/todo">lista de tareas</Link>, <Link href="/tools/notepad">bloc de notas</Link>, <Link href="/tools/world-clock">reloj mundial</Link></li>
      </ul>

      {/* Inline SVG illustration */}
      <div style={{margin: "32px 0", textAlign: "center"}}>
        <svg width="320" height="80" viewBox="0 0 320 80" style={{maxWidth: "100%"}}>
          <rect x="0" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="30" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JSON</text>
          <rect x="65" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="95" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JWT</text>
          <rect x="130" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="160" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Regex</text>
          <rect x="195" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="225" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Hash</text>
          <rect x="260" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="290" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">UUID</text>
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">Todo ejecutándose localmente en tu navegador</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Empieza a usar BrowseryTools — Sin configuración requerida</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          Las 10 herramientas para desarrolladores de arriba — más decenas más — son gratuitas, instantáneas y no requieren cuenta, ni instalación, ni configuración. Abre una herramienta y empieza a trabajar en menos de 3 segundos.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Abrir Formateador de JSON →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Ver todas las herramientas
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Herramientas relacionadas: <Link href="/tools/json-formatter">Formateador de JSON</Link> · <Link href="/tools/jwt-decoder">Decodificador de JWT</Link> · <Link href="/tools/hash-generator">Generador de Hashes</Link> · <Link href="/tools/regex-tester">Probador de Regex</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">Generador de UUID</Link> · <Link href="/tools/cron-parser">Analizador de Cron</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
