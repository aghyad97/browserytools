export default function Content() {
  return (
    <div>
      <p>
        Cada vez que descargas una versión de software, verificas la autenticidad de un archivo, firmas un token JWT o
        almacenas la contraseña de un usuario, una función hash criptográfica está trabajando en segundo plano. Las
        funciones hash son uno de los primitivos fundamentales de la seguridad informática moderna — y, sin embargo, las
        diferencias entre MD5, SHA-1, SHA-256 y SHA-512 se malinterpretan ampliamente, lo que provoca errores de
        seguridad reales en sistemas de producción.
      </p>
      <p>
        Esta guía explica qué son las funciones hash, cómo funciona cada algoritmo principal, cuándo es apropiado cada
        uno (y cuándo es peligrosamente inapropiado) y cómo usar el{" "}
        <a href="/tools/hash-generator">Generador de hash de BrowseryTools</a> para calcular hashes al instante en tu
        navegador con total privacidad.
      </p>

      <h2>¿Qué es una función hash criptográfica?</h2>
      <p>
        Una función hash criptográfica toma una entrada de longitud arbitraria y produce una salida de longitud fija
        llamada resumen (digest) o hash. Cuatro propiedades definen una buena función hash criptográfica:
      </p>
      <ul>
        <li>
          <strong>Determinista:</strong> la misma entrada siempre produce exactamente la misma salida. Las funciones
          hash no tienen estado interno — dados los mismos bytes, siempre obtienes el mismo resumen.
        </li>
        <li>
          <strong>Unidireccional (resistencia a la preimagen):</strong> dada una salida hash, debería ser
          computacionalmente inviable recuperar la entrada original. Las funciones hash están diseñadas para ser
          fáciles de calcular en una dirección y prácticamente imposibles de revertir.
        </li>
        <li>
          <strong>Longitud de salida fija:</strong> independientemente de si la entrada es un byte o un gigabyte, la
          salida tiene siempre la misma longitud. SHA-256 siempre produce un resumen de 256 bits (32 bytes).
        </li>
        <li>
          <strong>Efecto avalancha:</strong> un cambio de un solo bit en la entrada transforma por completo la salida.
          El hash de <code>hello</code> no se parece en nada al hash de <code>hello!</code> — no comparten ninguna
          estructura predecible. Esto hace que los hashes sean útiles como huellas digitales.
        </li>
      </ul>
      <p>
        Una quinta propiedad — la resistencia a colisiones — separa los hashes criptográficamente fuertes de los rotos:
        debería ser computacionalmente inviable encontrar dos entradas diferentes que produzcan la misma salida. Aquí es
        donde MD5 y SHA-1 han fallado.
      </p>

      <h2>MD5: rápido, omnipresente y roto para la seguridad</h2>
      <p>
        MD5 (Message Digest 5) fue diseñado por Ron Rivest y publicado en 1991. Produce un resumen de 128 bits (16
        bytes), representado normalmente como una cadena hexadecimal de 32 caracteres como{" "}
        <code>5d41402abc4b2a76b9719d911017c592</code>. Durante más de una década fue el algoritmo hash dominante para
        todo, desde sumas de verificación de archivos hasta el almacenamiento de contraseñas.
      </p>
      <p>
        En 2004, los criptógrafos demostraron ataques de colisión prácticos contra MD5. Para 2008, los investigadores
        habían usado ataques de colisión para falsificar un certificado de autoridad de certificación fraudulento en el
        que confiaban todos los navegadores principales. MD5 está ahora definitivamente roto para cualquier propósito de
        seguridad donde importe la resistencia a colisiones.
      </p>
      <p>
        Dónde MD5 sigue siendo aceptable:
      </p>
      <ul>
        <li>Comprobaciones de integridad de archivos sin fines de seguridad donde controlas tanto la generación como la verificación (confirmar que un archivo no se corrompió en tránsito, no que no fue manipulado).</li>
        <li>Sumas de verificación en sistemas internos donde un actor malicioso no está en el modelo de amenazas.</li>
        <li>Compatibilidad con sistemas heredados donde no tienes más remedio que coincidir con una implementación existente.</li>
        <li>Claves de caché y mapas hash donde la seguridad es irrelevante y la velocidad importa.</li>
      </ul>
      <p>
        Dónde MD5 nunca debe usarse: certificados TLS, firmas digitales, firma de código o cualquier cosa donde un
        atacante pudiera beneficiarse de encontrar una colisión.
      </p>

      <h2>SHA-1: 160 bits, obsoleto, todavía por todas partes</h2>
      <p>
        SHA-1 (Secure Hash Algorithm 1) fue publicado por el NIST en 1995 y produce un resumen de 160 bits. Fue el
        estándar para los certificados TLS, las firmas digitales y la firma de software a lo largo de los años 2000. El
        Project Zero de Google demostró una colisión práctica de SHA-1 en 2017 (el ataque SHAttered), produciendo dos
        archivos PDF diferentes con hashes SHA-1 idénticos. Esto terminó con el uso de SHA-1 en TLS — todos los
        principales proveedores de navegadores dejaron de aceptar certificados SHA-1 ese mismo año.
      </p>
      <p>
        SHA-1 todavía se encuentra en algunos lugares notables:
      </p>
      <ul>
        <li>
          <strong>Git:</strong> Git ha usado históricamente SHA-1 para identificar cada objeto de un repositorio —
          commits, blobs, árboles y etiquetas. Git está migrando activamente a SHA-256 (ver más abajo), pero los
          repositorios Git con SHA-1 siguen siendo muy comunes. Para este caso de uso, la resistencia a colisiones
          importa menos porque un atacante necesitaría acceso al sistema de archivos para explotar una colisión.
        </li>
        <li>Sistemas de autenticación heredados e implementaciones HMAC más antiguas.</li>
        <li>Algún software empresarial más antiguo que no se ha actualizado.</li>
      </ul>
      <p>
        Para cualquier trabajo nuevo: evita SHA-1. Usa SHA-256 o SHA-512.
      </p>

      <h2>SHA-256: el estándar actual</h2>
      <p>
        SHA-256 forma parte de la familia SHA-2, publicada por el NIST en 2001. Produce un resumen de 256 bits (32
        bytes) — el doble de la longitud de salida de MD5 y un 60% mayor que SHA-1. No se han demostrado ataques
        prácticos de colisión ni de preimagen contra SHA-256. Sigue siendo el estándar para el hashing sensible a la
        seguridad en 2026.
      </p>
      <p>
        SHA-256 se usa por todas partes:
      </p>
      <ul>
        <li><strong>Certificados TLS:</strong> el CA/Browser Forum impuso SHA-256 como mínimo para las firmas de certificados. Cada conexión HTTPS que haces está anclada por SHA-256.</li>
        <li><strong>Firma de código:</strong> macOS, Windows Authenticode y los gestores de paquetes de Linux (APT, RPM) usan SHA-256 para verificar la integridad del software.</li>
        <li><strong>Tokens JWT:</strong> el algoritmo <code>HS256</code> en los JSON Web Tokens es HMAC-SHA-256. Es con diferencia el algoritmo de firma de JWT más común en los sistemas desplegados.</li>
        <li><strong>Bitcoin:</strong> el algoritmo de prueba de trabajo de Bitcoin es doble-SHA-256 (SHA-256 aplicado dos veces).</li>
        <li><strong>Git (siguiente generación):</strong> el formato de objeto SHA-256 de Git (activado con <code>--object-format=sha256</code>) usa SHA-256 para todos los IDs de objetos.</li>
        <li>Verificación de integridad de archivos publicada junto a las descargas de software.</li>
      </ul>
      <p>
        Si necesitas elegir una función hash y no tienes restricciones específicas, SHA-256 es la elección
        predeterminada correcta en 2026.
      </p>

      <h2>SHA-512: salida mayor, a veces más rápido</h2>
      <p>
        SHA-512 también forma parte de la familia SHA-2 y produce un resumen de 512 bits (64 bytes). Proporciona un
        margen de seguridad mayor que SHA-256 — 512 bits de salida significan que el espacio teórico de ataque por
        fuerza bruta es 2<sup>256</sup> veces mayor. En la práctica, este margen adicional es irrelevante para la
        mayoría de las aplicaciones, ya que SHA-256 ya es computacionalmente inviable de romper.
      </p>
      <p>
        La característica de rendimiento contraintuitiva: SHA-512 es <em>más rápido</em> que SHA-256 en las CPU modernas
        de 64 bits al hacer hash de grandes cantidades de datos. SHA-512 procesa los datos en bloques de 1024 bits con
        operaciones de palabras de 64 bits, mientras que SHA-256 usa bloques de 512 bits con operaciones de 32 bits. En
        un procesador de 64 bits, las operaciones de 64 bits se asignan de forma más eficiente al hardware. Esto
        convierte a SHA-512 en la opción preferida para aplicaciones que hacen hash de archivos grandes en servidores de
        64 bits.
      </p>
      <p>
        Usa SHA-512 cuando:
      </p>
      <ul>
        <li>Estás haciendo hash de grandes cantidades de datos en hardware de 64 bits y quieres el máximo rendimiento.</li>
        <li>Tu sistema requiere el margen de seguridad adicional por razones normativas o de cumplimiento.</li>
        <li>Estás implementando HMAC-SHA-512 (usado en algunas implementaciones de JWT con <code>HS512</code>).</li>
      </ul>

      <h2>Tabla comparativa de algoritmos</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Algoritmo</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Longitud de salida</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Velocidad (relativa)</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Estado de seguridad</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Casos de uso comunes</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>MD5</strong></td>
              <td style={{padding: "12px 16px"}}>128 bits (32 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>El más rápido</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Roto</strong> — colisiones demostradas</td>
              <td style={{padding: "12px 16px"}}>Sumas de verificación sin seguridad, claves de caché, sistemas heredados</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-1</strong></td>
              <td style={{padding: "12px 16px"}}>160 bits (40 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>Rápido</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Obsoleto</strong> — existen colisiones prácticas</td>
              <td style={{padding: "12px 16px"}}>Git heredado, TLS antiguo (obsoleto), alguna autenticación heredada</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-256</strong></td>
              <td style={{padding: "12px 16px"}}>256 bits (64 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>Rápido</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Seguro</strong> — estándar actual</td>
              <td style={{padding: "12px 16px"}}>Certificados TLS, JWT (HS256), firma de código, Bitcoin</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-512</strong></td>
              <td style={{padding: "12px 16px"}}>512 bits (128 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>El más rápido en 64 bits para datos grandes</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Seguro</strong> — mayor margen de seguridad</td>
              <td style={{padding: "12px 16px"}}>Hashing de archivos grandes, JWT (HS512), aplicaciones de alta seguridad</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Verificación de integridad de archivos: un ejemplo práctico</h2>
      <p>
        Uno de los usos más comunes y legítimos de los hashes criptográficos es verificar que un archivo descargado es
        exactamente lo que el editor pretendía — no corrompido en tránsito ni manipulado por un tercero. La mayoría de
        los grandes proyectos de software publican sumas de verificación SHA-256 junto a sus descargas.
      </p>
      <p>
        El flujo de trabajo es así:
      </p>
      <ul>
        <li>Descarga el archivo de la fuente oficial.</li>
        <li>Descarga la suma de verificación publicada de la misma fuente oficial (idealmente firmada con PGP).</li>
        <li>Calcula el hash SHA-256 del archivo descargado.</li>
        <li>Compara tu hash calculado con el hash publicado carácter por carácter. Cualquier diferencia significa que el archivo no es lo que el editor distribuyó.</li>
      </ul>
      <p>
        El <a href="/tools/hash-generator">Generador de hash de BrowseryTools</a> admite el hashing de archivos —
        arrastra un archivo y calculará el hash localmente en tu navegador sin subir nada. Compara el resultado
        directamente con la suma de verificación publicada.
      </p>

      <h2>Almacenamiento de contraseñas: lo único que los hashes no pueden hacer de forma segura</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem", color: "#dc2626"}}>
          Advertencia crítica: nunca almacenes contraseñas usando funciones hash simples
        </p>
        <p style={{marginTop: 0, marginBottom: "12px"}}>
          Almacenar contraseñas como hashes MD5, SHA-256 o SHA-512 — incluso con sal — es inseguro y una vulnerabilidad
          grave en cualquier sistema de producción. Aquí está el porqué:
        </p>
        <ul style={{marginTop: 0, marginBottom: "12px"}}>
          <li>Las funciones hash de propósito general están diseñadas para ser <em>rápidas</em>. Una GPU moderna puede calcular miles de millones de hashes SHA-256 por segundo. Si tu base de datos sufre una brecha, un atacante puede descifrar por fuerza bruta cualquier contraseña común en minutos.</li>
          <li>Las tablas arcoíris — tablas de búsqueda precalculadas que asignan hashes a entradas — pueden descifrar hashes sin sal de contraseñas comunes en milisegundos.</li>
          <li>Incluso con una sal única por usuario, la enorme velocidad de SHA-256 hace fácil atacar a escala las contraseñas débiles o de fortaleza media.</li>
        </ul>
        <p style={{marginTop: 0, marginBottom: 0}}>
          <strong>Usa en su lugar una función de hashing de contraseñas:</strong> <code>bcrypt</code>, <code>scrypt</code>
          o <code>Argon2</code> (el ganador del Password Hashing Competition). Estas son deliberadamente lentas e
          intensivas en memoria, lo que hace que los ataques de fuerza bruta sean órdenes de magnitud más costosos. La
          mayoría de los frameworks modernos las incluyen de serie. Argon2id es la recomendación actual para los
          sistemas nuevos.
        </p>
      </div>

      <h2>Cómo Git usa SHA-1 (y está migrando a SHA-256)</h2>
      <p>
        Git usa una función hash para identificar cada objeto de un repositorio. Cada commit, archivo (blob), listado de
        directorio (árbol) y etiqueta se almacena en la base de datos de objetos bajo su hash SHA-1. Cuando ejecutas{" "}
        <code>git log</code>, las largas cadenas hexadecimales que ves — como{" "}
        <code>c206f4b3a9d72bc0e53a0e1a6e4bdf8c7f9d2e51</code> — son hashes SHA-1 de objetos commit.
      </p>
      <p>
        Git eligió SHA-1 en 2005 por velocidad y porque en aquel momento SHA-1 no estaba roto. El papel de los hashes en
        Git es ligeramente diferente del uso de seguridad tradicional: Git los usa como claves de almacenamiento
        direccionable por contenido, no como pruebas de autenticación. El contenido en sí es lo que confías — el hash es
        solo una forma eficiente de buscarlo y detectar corrupción accidental.
      </p>
      <p>
        Tras la colisión SHAttered de SHA-1 en 2017, el proyecto Git comenzó a trabajar en la transición a SHA-256. El
        nuevo formato de objeto (<code>--object-format=sha256</code>) está disponible en Git 2.29+ y se usa por defecto
        en algunos hosts de repositorios nuevos. Los repositorios existentes pueden migrarse, aunque la transición es
        compleja porque cada ID de objeto cambia.
      </p>

      <h2>HMAC: autenticación de mensajes basada en hash</h2>
      <p>
        Un hash simple verifica la integridad de los datos (los datos no han cambiado) pero no la autenticidad (los
        datos vinieron de quien crees que vinieron). Si un atacante puede interceptar un mensaje y recalcular el hash
        después de modificarlo, un hash simple no ofrece ninguna protección.
      </p>
      <p>
        HMAC (Hash-based Message Authentication Code) lo resuelve incorporando una clave secreta al cálculo del hash. El
        resultado solo puede producirlo alguien que conozca la clave. Verificar un HMAC demuestra tanto que los datos
        están intactos como que los produjo una parte con acceso al secreto compartido.
      </p>
      <p>
        HMAC-SHA256 está por todas partes:
      </p>
      <ul>
        <li><strong>Tokens JWT (HS256):</strong> el servidor firma la cabecera y la carga útil del token con HMAC-SHA256 usando una clave secreta. Los clientes no pueden falsificar tokens válidos sin la clave.</li>
        <li><strong>Firma de peticiones de API:</strong> AWS Signature Version 4 usa HMAC-SHA256 para autenticar las peticiones de API. Los detalles de la petición y una clave de firma derivada se hashean juntos para que ninguno pueda modificarse sin invalidar la firma.</li>
        <li><strong>Integridad de cookies:</strong> muchos frameworks web usan HMAC para firmar las cookies de sesión, evitando que los usuarios manipulen sus propios datos de sesión.</li>
      </ul>

      <h2>Cómo usar el Generador de hash de BrowseryTools</h2>
      <p>
        El <a href="/tools/hash-generator">Generador de hash</a> admite el hashing tanto de entrada de texto como de
        archivos subidos por completo en tu navegador. Así funciona:
      </p>
      <ul>
        <li>
          <strong>Hashing de texto:</strong> pega cualquier texto en el campo de entrada. La herramienta calcula y
          muestra inmediatamente el hash de cada algoritmo compatible simultáneamente — MD5, SHA-1, SHA-256 y SHA-512 —
          para que puedas compararlos lado a lado y elegir el que necesites.
        </li>
        <li>
          <strong>Hashing de archivos:</strong> haz clic en la entrada de archivo o arrastra y suelta cualquier
          archivo. El archivo lo lee la File API de tu navegador y se hashea localmente. Los archivos grandes se
          procesan en fragmentos para evitar la presión de memoria. Ningún byte de tu archivo sale de tu dispositivo.
        </li>
        <li>
          <strong>Elige el algoritmo:</strong> selecciona el algoritmo concreto en el que centrarte para tu caso de
          uso. El resumen hexadecimal completo se muestra y puede copiarse con un solo clic.
        </li>
        <li>
          <strong>Descarga como archivo:</strong> para fines de documentación o distribución, exporta el resumen hash
          como un archivo de texto — útil para publicar sumas de verificación junto a tus propias versiones de
          software.
        </li>
      </ul>

      <h2>Privacidad: la Web Crypto API</h2>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Todo se queda en tu dispositivo.</strong> El Generador de hash de BrowseryTools usa la API integrada del
        navegador <code>window.crypto.subtle</code> (la Web Crypto API) para calcular los hashes de la familia SHA. Esta
        es criptografía nativa implementada por el motor C++ de tu navegador — no cálculos de JavaScript. Para MD5, se
        ejecuta localmente una implementación en JavaScript puro. En ambos casos, ningún dato — ni un solo byte de tu
        texto o del contenido de tu archivo — se transmite jamás a los servidores de BrowseryTools ni a ningún servicio
        externo. El cálculo del hash ocurre por completo dentro del proceso de tu navegador.
      </div>

      <h2>Elegir el algoritmo correcto: una guía de decisión</h2>
      <ul>
        <li><strong>Integridad de archivos / sumas de verificación (sin seguridad):</strong> MD5 o SHA-256. SHA-256 es preferible para cualquier cosa de cara al público aunque el modelo de amenazas sea solo la corrupción accidental, ya que usar un algoritmo roto por elección es difícil de justificar ante los auditores.</li>
        <li><strong>TLS, firma de código, operaciones con certificados:</strong> SHA-256 (obligatorio — SHA-1 se rechaza).</li>
        <li><strong>Firma de JWT:</strong> HMAC-SHA-256 (HS256) para simétrico, o RS256/ES256 para asimétrico. Nunca MD5 ni SHA-1.</li>
        <li><strong>Almacenamiento de contraseñas:</strong> Argon2id, bcrypt o scrypt. Nada de SHA.</li>
        <li><strong>Hashing de archivos grandes en servidores de 64 bits:</strong> SHA-512 para el mejor rendimiento.</li>
        <li><strong>Máximo margen de seguridad:</strong> SHA-512 o SHA-3 (SHA3-256, SHA3-512).</li>
        <li><strong>Compatibilidad con sistemas heredados:</strong> lo que requiera el sistema heredado — pero planifica la migración fuera de MD5 y SHA-1.</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Genera hashes MD5, SHA-1, SHA-256 y SHA-512 al instante
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Pega texto o suelta un archivo. Todo el hashing ocurre en tu navegador usando la Web Crypto API. No se sube
          nada. No se registra nada.
        </p>
        <a
          href="/tools/hash-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Generador de hash →
        </a>
      </div>
    </div>
  );
}
