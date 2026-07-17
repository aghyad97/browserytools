import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Cuando escribes un mensaje en una aplicación de notas o en un formulario web, ¿adónde va? En la
        mayoría de los casos, el texto viaja a un servidor, se almacena en una base de datos y
        potencialmente lo puede leer cualquier persona con acceso a esa base de datos — los empleados
        de la empresa, un atacante que provoque una brecha de datos o una orden judicial. El cifrado
        en el lado del cliente es el enfoque técnico que cambia esta ecuación: tus datos se cifran
        antes de que salgan de tu dispositivo, de modo que incluso el servidor que los almacena no
        puede leerlos.
      </p>
      <ToolCTA slug="text-encryption" variant="inline" />
      <p>
        Puedes cifrar y descifrar cualquier texto directamente en tu navegador con la{" "}
        <a href="/tools/text-encryption">Herramienta de Cifrado de Texto de BrowseryTools</a> — gratuita,
        sin registro, tus datos nunca salen de tu dispositivo.
      </p>

      <h2>Qué significa realmente el cifrado en el lado del cliente</h2>
      <p>
        El cifrado en el lado del cliente significa que las operaciones criptográficas (cifrar y
        descifrar datos) ocurren en el dispositivo del usuario — en el navegador, en una aplicación
        móvil o en una aplicación de escritorio — antes de que se transmitan o almacenen datos. El
        servidor recibe solo texto cifrado: una secuencia de bytes ilegible y codificada que es
        matemáticamente inútil sin la clave de descifrado.
      </p>
      <p>
        Esto es significativamente diferente del cifrado en el lado del servidor (también llamado
        "cifrado en reposo"), donde el servidor recibe tus datos en texto plano y luego los cifra para
        almacenarlos usando claves que el propio servidor controla. En ese modelo, el proveedor del
        servicio siempre puede descifrar tus datos. Con el cifrado en el lado del cliente, solo alguien
        que posea la clave — que nunca sale de tu dispositivo — puede leer los datos.
      </p>
      <p>
        La implicación práctica: si alguien irrumpe en el servidor y roba los datos cifrados, no tiene
        nada útil. El texto cifrado requiere la clave para descifrarse, y la clave nunca estuvo en
        el servidor.
      </p>

      <h2>Cifrado simétrico vs. asimétrico</h2>
      <p>
        Existen dos enfoques fundamentales del cifrado, y sirven para propósitos diferentes.
      </p>
      <ul>
        <li>
          <strong>Cifrado simétrico (AES)</strong> — una clave cifra los datos, y la misma clave los
          descifra. Rápido, eficiente y adecuado para cifrar grandes cantidades de datos. El reto es
          la distribución de claves: ¿cómo compartes de forma segura la clave con quien necesita
          descifrar los datos? Para uso personal (cifrar tus propias notas), el cifrado simétrico es
          ideal — tú posees la única clave. AES (Advanced Encryption Standard) es el algoritmo
          simétrico dominante.
        </li>
        <li>
          <strong>Cifrado asimétrico (RSA, ECDH)</strong> — dos claves matemáticamente vinculadas:
          una clave pública que cualquiera puede usar para cifrar datos, y una clave privada que solo
          posee el titular, usada para descifrar. Resuelve el problema de la distribución de claves —
          puedes compartir tu clave pública abiertamente. Mucho más lento que el cifrado simétrico
          para datos grandes. La mayoría de los sistemas del mundo real usan el cifrado asimétrico
          solo para intercambiar una clave simétrica y luego cambian a AES para los datos en bloque.
          Así es como funciona TLS (HTTPS).
        </li>
      </ul>

      <h2>Por qué AES-256 es el estándar</h2>
      <p>
        AES-256 significa AES con una clave de 256 bits. El tamaño de clave de 256 bits significa que
        hay 2<sup>256</sup> claves posibles — un número tan grande que forzarlo por fuerza bruta no es
        computacionalmente factible con ninguna tecnología que exista o sea teóricamente posible con
        computadoras clásicas. Para poner en perspectiva: si cada átomo del universo observable fuera
        una computadora comprobando mil millones de claves por segundo, seguiría tardando más que la
        edad del universo en agotar las 2<sup>256</sup> claves.
      </p>
      <p>
        AES es también un estándar del NIST (Instituto Nacional de Estándares y Tecnología de EE. UU.),
        ha sido analizado criptográficamente de forma exhaustiva durante décadas sin encontrar
        debilidades prácticas en el propio algoritmo, y tiene aceleración por hardware (instrucciones
        AES-NI) en prácticamente todos los CPUs modernos — convirtiéndolo tanto en la opción más
        segura como en la más rápida disponible. AES-GCM (Modo Galois/Contador) es la variante
        recomendada porque proporciona tanto cifrado como autenticación (detectando si el texto
        cifrado fue manipulado).
      </p>

      <h2>Derivación de claves a partir de contraseñas</h2>
      <p>
        AES-256 requiere una clave de 256 bits (32 bytes). Las contraseñas elegidas por humanos no son
        32 bytes aleatorios — son cadenas cortas con patrones y conjuntos de caracteres limitados.
        Usar una contraseña directamente como clave AES sería catastróficamente inseguro. Las
        funciones de derivación de claves (KDF) salvan esta brecha.
      </p>
      <p>
        Una KDF toma una contraseña y produce una clave criptográficamente fuerte de cualquier longitud
        deseada. Las tres KDF más importantes son:
      </p>
      <ul>
        <li>
          <strong>PBKDF2 (Password-Based Key Derivation Function 2)</strong> — aplica una función HMAC
          miles o cientos de miles de veces (iteraciones) a la contraseña. Más iteraciones significa
          más trabajo computacional para un atacante que intente forzar la contraseña por fuerza bruta.
          PBKDF2 es la KDF más ampliamente compatible y se usa en la seguridad Wi-Fi WPA2, el cifrado
          de dispositivos iOS y muchos sistemas de autenticación web.
        </li>
        <li>
          <strong>bcrypt</strong> — diseñado específicamente para el hash de contraseñas con un cálculo
          deliberadamente lento. Tiene un "factor de coste" que controla su lentitud. Ampliamente
          usado para almacenar contraseñas de usuarios en bases de datos, pero no se usa típicamente
          para derivar claves AES.
        </li>
        <li>
          <strong>scrypt</strong> — añade resistencia de memoria sobre el coste computacional. Un
          atacante que use hardware especializado (ASICs o GPUs) puede ejecutar PBKDF2 de forma barata
          en paralelo; scrypt requiere tanta memoria por cálculo que los ataques paralelos se vuelven
          costosos. Se usa en algunos sistemas de criptomonedas y aplicaciones de seguridad más nuevas.
        </li>
      </ul>
      <p>
        Todos los buenos sistemas de cifrado también usan una <strong>sal</strong> — un valor aleatorio
        combinado con la contraseña antes de la derivación de clave, de modo que dos usuarios con la
        misma contraseña produzcan claves diferentes, y los ataques de "tabla arcoíris" precomputados
        queden invalidados.
      </p>

      <h2>Qué significa realmente "ningún servidor ve tus datos"</h2>
      <p>
        Cuando una herramienta afirma "ningún servidor ve tus datos", significa que el texto plano nunca
        sale de tu navegador. El JavaScript que se ejecuta en tu navegador realiza el cifrado localmente,
        y solo el texto cifrado (la salida cifrada) se transmitiría alguna vez — y solo si decides
        transmitirlo.
      </p>
      <p>
        La <a href="/tools/text-encryption">Herramienta de Cifrado de Texto de BrowseryTools</a> va más
        lejos: no se transmite nada en absoluto. La operación completa es local. Puedes verificarlo
        abriendo las Herramientas para Desarrolladores de tu navegador, cambiando a la pestaña Red y
        observando que no se realizan solicitudes cuando cifras o descifras. La herramienta usa la
        Web Crypto API — una biblioteca criptográfica nativa del navegador integrada en todos los
        navegadores modernos — lo que significa que la criptografía no es código JavaScript
        personalizado; es la misma implementación de confianza que tu navegador usa para las conexiones
        HTTPS.
      </p>

      <h2>Conceptos erróneos habituales sobre el cifrado en el navegador</h2>
      <ul>
        <li>
          <strong>"HTTPS ya cifra todo"</strong> — HTTPS cifra los datos en tránsito entre tu navegador
          y el servidor. Una vez que los datos llegan al servidor, se descifran y se almacenan en texto
          plano (o se vuelven a cifrar con claves controladas por el servidor). El cifrado en el lado
          del cliente protege los datos del propio servidor, no solo de la interceptación en la red.
        </li>
        <li>
          <strong>"El JavaScript podría modificarse para robar mis datos"</strong> — verdad para
          cualquier aplicación web. Por eso se prefieren las herramientas de código abierto y
          auditadas a las opacas para casos de uso sensibles. Para máxima seguridad, descarga la
          herramienta y ejecútala sin conexión.
        </li>
        <li>
          <strong>"El cifrado en el navegador es débil"</strong> — el cifrado en el navegador usando
          la Web Crypto API y AES-256-GCM es el mismo algoritmo que usa el software de seguridad
          empresarial y el cifrado de disco completo del sistema operativo. El algoritmo no es más
          débil por ejecutarse en un navegador.
        </li>
        <li>
          <strong>"Si olvido la contraseña, los datos son recuperables"</strong> — no lo son. El
          cifrado en el lado del cliente no proporciona ningún mecanismo de recuperación. Los datos son
          matemáticamente irrecuperables sin la clave. Esta es una característica, no un error — pero
          requiere una gestión cuidadosa de las claves.
        </li>
      </ul>

      <h2>Casos de uso prácticos</h2>
      <ul>
        <li><strong>Cifrar notas sensibles</strong> — información médica, detalles de cuentas financieras o entradas de diario personal que quieres almacenar en una aplicación de notas en la nube sin confiar en el proveedor</li>
        <li><strong>Proteger texto sensible en documentos</strong> — incrustar credenciales o secretos cifrados en un documento que se compartirá, donde solo el destinatario que conoce la contraseña puede leerlos</li>
        <li><strong>Enviar mensajes privados a través de canales públicos</strong> — cifra un mensaje, comparte el texto cifrado en un canal público y comparte la contraseña a través de un canal privado separado</li>
        <li><strong>Copias de seguridad seguras</strong> — cifrar datos exportados antes de almacenarlos en un servicio de copia de seguridad no confiable</li>
      </ul>

      <h2>Limitaciones del cifrado en el lado del cliente</h2>
      <p>
        El cifrado en el lado del cliente es poderoso pero no es una solución de seguridad completa:
      </p>
      <ul>
        <li><strong>Las contraseñas débiles anulan el cifrado fuerte</strong> — AES-256 con la contraseña "hola123" proporciona casi ninguna protección contra un atacante decidido que pueda ejecutar ataques de diccionario</li>
        <li><strong>Compromiso del dispositivo</strong> — si un atacante controla tu dispositivo (malware, keylogger), puede capturar los datos antes de que se cifren o interceptar la clave</li>
        <li><strong>Sin compartición sin intercambio de claves</strong> — compartir datos cifrados con otra persona requiere compartir la clave de forma segura, lo cual es un problema separado</li>
        <li><strong>Sin búsqueda ni indexación</strong> — los datos cifrados no pueden buscarse, ordenarse ni procesarse sin descifrarlos primero</li>
      </ul>
      <ToolCTA slug="text-encryption" variant="card" />
    </div>
  );
}
