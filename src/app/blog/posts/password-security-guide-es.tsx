import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Si usas una contraseña como <code>password123</code>, <code>qwerty</code> o el nombre de tu mascota seguido de
        un año de nacimiento, no estás solo, pero corres un riesgo serio. Un estudio de NordPass de 2023 descubrió que
        la contraseña más común del mundo sigue siendo <strong>"123456"</strong>, usada por más de 4,5 millones de
        personas. Según Google, el 65% de las personas reutiliza la misma contraseña en varios sitios. Este es el mayor
        error de seguridad que puedes cometer en internet.
      </p>
      <ToolCTA slug="password-strength" variant="inline" />
      <p>
        Esta guía desglosa exactamente qué hace que una contraseña sea débil o fuerte, cómo la descifran los atacantes y
        cómo puedes protegerte, usando herramientas gratuitas que se ejecutan por completo en tu navegador sin enviar
        nunca datos a un servidor.
      </p>

      <h2>Las contraseñas más comunes — ¿está la tuya en esta lista?</h2>
      <p>
        Cada año, los investigadores de seguridad analizan miles de millones de credenciales filtradas en brechas de
        datos. Los resultados son sistemáticamente alarmantes. Estos son los peores ejemplos que aparecen prácticamente
        en cualquier base de datos de filtraciones:
      </p>
      <ul>
        <li>123456 / 12345678 / 123456789</li>
        <li>password / password1 / Password123</li>
        <li>qwerty / qwerty123 / qwertyuiop</li>
        <li>iloveyou / letmein / welcome</li>
        <li>admin / root / user / login</li>
        <li>abc123 / 111111 / 000000</li>
        <li>monkey / dragon / master / sunshine</li>
      </ul>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Advertencia:</strong> si alguna de tus contraseñas aparece en esta lista o se le parece mucho, cámbiala
        de inmediato. Estas contraseñas son las primeras que probará cualquier atacante, y las herramientas
        automatizadas pueden probarlas todas en menos de un segundo.
      </div>
      <p>
        Lo especialmente peligroso es que mucha gente cree que es lista al sustituir letras por números — escribir{" "}
        <code>p@ssw0rd</code> en lugar de <code>password</code>. Los atacantes también conocen este truco. Las
        herramientas modernas de descifrado incluyen "reglas de mutación" que aplican automáticamente estas
        sustituciones a cada palabra de su diccionario.
      </p>

      <h2>¿Qué hace débil a una contraseña?</h2>
      <p>La debilidad de una contraseña viene de la previsibilidad. Una contraseña es débil cuando un atacante puede
        adivinarla más rápido de lo que tardaría en probar todas las combinaciones posibles. Los principales culpables
        son:</p>

      <h3>1. Longitud corta</h3>
      <p>
        La longitud es el factor más importante de la fortaleza de una contraseña. Una contraseña de 6 caracteres que
        solo usa letras minúsculas tiene apenas 308 millones de combinaciones posibles — una GPU moderna puede agotarlas
        en menos de un segundo. Una contraseña de 8 caracteres con mayúsculas, minúsculas y números tiene 218 billones
        de combinaciones, lo que suena impresionante, pero los equipos de descifrado modernos que funcionan a miles de
        millones de intentos por segundo todavía pueden descifrarla en minutos.
      </p>

      <h3>2. Palabras del diccionario</h3>
      <p>
        Cualquier palabra real en cualquier idioma es inmediatamente vulnerable a un ataque de diccionario. Esto
        incluye palabras con sustituciones obvias (<code>3</code> por <code>e</code>, <code>0</code> por <code>o</code>,{" "}
        <code>@</code> por <code>a</code>) y palabras con números añadidos al final (<code>monkey1</code>,{" "}
        <code>dragon99</code>). Los atacantes tienen diccionarios con cientos de millones de estas variaciones ya
        calculadas.
      </p>

      <h3>3. Información personal</h3>
      <p>
        Los nombres, las fechas de nacimiento, los aniversarios, los nombres de mascotas y los equipos deportivos
        favoritos son ingredientes muy comunes de las contraseñas. Si un atacante sabe algo sobre ti — solo con tus
        perfiles de redes sociales — puede crear una lista de palabras dirigida y reducir drásticamente el tiempo
        necesario para descifrar tu contraseña.
      </p>

      <h3>4. Patrones y recorridos de teclado</h3>
      <p>
        Secuencias como <code>qwerty</code>, <code>asdfgh</code>, <code>1qaz2wsx</code> o <code>zxcvbn</code> son
        patrones de teclado que los descifradores prueban en los primeros segundos. No requieren inteligencia
        adicional para adivinarse — solo conocer la distribución de un teclado.
      </p>

      <h2>Cómo funciona realmente el descifrado de contraseñas</h2>
      <p>
        Entender cómo los atacantes descifran las contraseñas te ayuda a comprender por qué ciertas prácticas realmente
        te protegen y por qué otras solo parecen seguras.
      </p>

      <h3>Ataques de fuerza bruta</h3>
      <p>
        Un ataque de fuerza bruta prueba todas y cada una de las combinaciones posibles de caracteres hasta encontrar
        la correcta. Para contraseñas cortas, esto es trivialmente rápido. Para las más largas, el tiempo crece
        exponencialmente. Una contraseña de 12 caracteres con mayúsculas, minúsculas, números y símbolos tiene
        aproximadamente 19 cuatrillones de combinaciones posibles — a mil millones de intentos por segundo, agotarlas
        por completo llevaría más de 600 años. Ese es el poder de la longitud.
      </p>

      <h3>Ataques de diccionario</h3>
      <p>
        En lugar de probar todas las combinaciones, los ataques de diccionario usan listas predefinidas de contraseñas
        conocidas, palabras comunes y credenciales filtradas en brechas anteriores. Solo la lista de palabras RockYou —
        filtrada en 2009 — contiene 14 millones de contraseñas y todavía hoy es el punto de partida de la mayoría de
        las sesiones de descifrado. Si tu contraseña la ha usado alguna vez otra persona y apareció en una filtración,
        está en algún diccionario.
      </p>

      <h3>Tablas arcoíris</h3>
      <p>
        Cuando los sitios web almacenan contraseñas, deberían guardarlas como hashes criptográficos, no como la
        contraseña real. Las tablas arcoíris (rainbow tables) son tablas de búsqueda precalculadas que asignan valores
        hash de vuelta a las contraseñas originales. Si un sitio almacena contraseñas sin "salar" los hashes (añadir un
        valor aleatorio antes del hash), un ataque de tabla arcoíris puede recuperar millones de contraseñas en
        segundos. Por eso las brechas de datos son tan devastadoras.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Idea clave:</strong> el descifrado de contraseñas se ha convertido en un producto de consumo. Existen
        servicios en línea donde puedes pagar para que descifren hashes. Un hardware que cuesta unos pocos cientos de
        dólares puede probar miles de millones de contraseñas por segundo. La única defensa real es una contraseña que
        sea a la vez larga y verdaderamente aleatoria.
      </div>

      <h2>Entropía de contraseñas: por qué la longitud siempre gana</h2>
      <p>
        La entropía es una medida de la imprevisibilidad, expresada en bits. Cuanto mayor es la entropía, más tiempo se
        tarda en descifrar una contraseña por fuerza bruta. Así funciona en la práctica:
      </p>
      <ul>
        <li>Una contraseña que solo usa letras minúsculas (26 caracteres) añade unos 4,7 bits de entropía por carácter.</li>
        <li>Añadir mayúsculas duplica el conjunto a 52 caracteres — 5,7 bits por carácter.</li>
        <li>Añadir dígitos (62 caracteres) — 5,95 bits por carácter.</li>
        <li>Añadir símbolos (95 caracteres ASCII imprimibles) — 6,57 bits por carácter.</li>
      </ul>
      <p>
        Pero el efecto multiplicador de la longitud es mucho más potente que añadir cualquier tipo de carácter. Una
        contraseña totalmente aleatoria de 12 caracteres del conjunto ASCII imprimible completo tiene unos 79 bits de
        entropía. Con 16 caracteres, eso pasa a 105 bits — prácticamente indescifrable con cualquier tecnología
        previsible.
      </p>

      <h2>Los tres tipos de contraseñas que usa la gente</h2>
      <p>Las estrategias de contraseñas de la mayoría de la gente caen en una de tres categorías, cada una con sus
        propias compensaciones:</p>

      <h3>Tipo 1: fácil de recordar, fácil de descifrar</h3>
      <p>
        Esta es la categoría <code>fluffy2009!</code> — el nombre de una mascota, un año y un signo de puntuación.
        Puedes recordarla sin esfuerzo. Un atacante puede descifrarla en menos de una hora con una lista de palabras
        decente y reglas de mutación. Estas contraseñas ofrecen casi ninguna protección real.
      </p>

      <h3>Tipo 2: complejas pero imposibles de recordar</h3>
      <p>
        Algunas personas intentan crear contraseñas verdaderamente complejas aporreando el teclado —{" "}
        <code>xK3#mQ9!pL</code> — pero luego descubren que no pueden recordarlas. Esto lleva a anotarlas en una nota
        adhesiva, guardarlas en un archivo de texto sin cifrar o simplemente restablecerlas constantemente. La mejora
        de seguridad se pierde por un mal almacenamiento.
      </p>

      <h3>Tipo 3: fuertes y bien almacenadas</h3>
      <p>
        Este es el único enfoque que realmente funciona a escala. Genera una contraseña larga y totalmente aleatoria y
        guárdala en un gestor de contraseñas. Solo necesitas recordar una contraseña maestra fuerte. El resto se
        generan, se almacenan y se rellenan por ti automáticamente. Así gestionan cientos de cuentas los profesionales
        de la seguridad.
      </p>

      <h2>Comparación visual de fortaleza</h2>
      <p>Aquí tienes una comparación lado a lado de lo drásticamente que varía la fortaleza de una contraseña:</p>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Contraseña</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Longitud</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Conjunto de caracteres</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Entropía</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Tiempo de descifrado</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(239,68,68,0.1)", color: "#dc2626", padding: "2px 6px", borderRadius: "4px"}}>password123</code></td>
              <td style={{padding: "12px 16px"}}>11</td>
              <td style={{padding: "12px 16px"}}>Minúsculas + dígitos</td>
              <td style={{padding: "12px 16px"}}>~18 bits (diccionario)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Al instante</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(245,158,11,0.1)", color: "#d97706", padding: "2px 6px", borderRadius: "4px"}}>P@$$w0rd</code></td>
              <td style={{padding: "12px 16px"}}>8</td>
              <td style={{padding: "12px 16px"}}>Mixto + símbolos</td>
              <td style={{padding: "12px 16px"}}>~24 bits (patrón)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>De minutos a horas</strong></td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "2px 6px", borderRadius: "4px"}}>v8K#mX2qLn&amp;4jR7</code></td>
              <td style={{padding: "12px 16px"}}>16</td>
              <td style={{padding: "12px 16px"}}>ASCII completo aleatorio</td>
              <td style={{padding: "12px 16px"}}>~105 bits</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Miles de millones de años</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        La diferencia entre la primera y la tercera contraseña no es solo incremental — es la diferencia entre ninguna
        protección y una seguridad prácticamente irrompible. Y no necesitas recordar <code>v8K#mX2qLn&amp;4jR7</code>
        — tu gestor de contraseñas lo hace por ti.
      </p>

      <h2>Comprueba la fortaleza de tu contraseña actual al instante</h2>
      <p>
        Antes de cambiar nada, conviene entender exactamente lo fuertes que son tus contraseñas actuales. BrowseryTools
        ofrece un verificador de fortaleza de contraseñas gratuito y privado que analiza tu contraseña localmente — los
        caracteres que escribes nunca salen de tu navegador.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Pruébalo ahora:</strong> ve al{" "}
        <a href="/tools/password-strength">Verificador de fortaleza de contraseñas de BrowseryTools</a> para ver
        exactamente qué puntuación obtienen tus contraseñas. La herramienta comprueba la longitud, la diversidad de
        caracteres, los patrones comunes y las coincidencias con el diccionario — y te dice cuánto tardaría realmente
        en descifrarse.
      </div>
      <p>
        El verificador te da una puntuación clara con una explicación de qué es débil y qué mejorar. Es la forma más
        rápida de obtener una auditoría honesta de las contraseñas que ya usas.
      </p>

      <h2>Genera contraseñas fuertes con un clic</h2>
      <p>
        Saber cómo es una contraseña fuerte y crear una realmente son dos problemas diferentes. El cerebro humano es
        notoriamente malo generando aleatoriedad — siempre recurrimos a patrones, palabras familiares y estructuras
        predecibles. La solución es dejar que una máquina genere la aleatoriedad por ti.
      </p>
      <p>
        El <a href="/tools/password-generator">Generador de contraseñas de BrowseryTools</a> crea contraseñas
        criptográficamente aleatorias usando el generador seguro de números aleatorios integrado en tu navegador.
        Puedes personalizar:
      </p>
      <ul>
        <li>La longitud de la contraseña (hasta 128 caracteres)</li>
        <li>Los conjuntos de caracteres a incluir: mayúsculas, minúsculas, dígitos, símbolos</li>
        <li>La exclusión de caracteres ambiguos (como <code>0</code>, <code>O</code>, <code>l</code>, <code>1</code>) para facilitar la transcripción manual</li>
        <li>El número de contraseñas a generar a la vez</li>
      </ul>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Garantía de privacidad:</strong> el generador de contraseñas de BrowseryTools se ejecuta por completo
        en tu navegador usando la Web Crypto API. Ninguna contraseña se transmite jamás a ningún servidor. La generación
        ocurre en tu dispositivo, solo para tus ojos.
      </div>

      <h2>Por qué necesitas un gestor de contraseñas</h2>
      <p>
        La principal objeción a usar contraseñas fuertes es la memorización. "No puedo recordar 30 cadenas aleatorias
        distintas de 20 caracteres". Tienes razón — y no deberías tener que hacerlo. Para eso existen exactamente los
        gestores de contraseñas.
      </p>
      <p>
        Un gestor de contraseñas es una caja fuerte cifrada que almacena todas tus contraseñas. La desbloqueas con una
        contraseña maestra fuerte (la única que necesitas memorizar) y se encarga de todo lo demás:
      </p>
      <ul>
        <li>Almacena contraseñas ilimitadas de forma segura con cifrado de extremo a extremo</li>
        <li>Rellena automáticamente los formularios de inicio de sesión en tu navegador</li>
        <li>Genera nuevas contraseñas fuertes cuando creas cuentas</li>
        <li>Te avisa cuando una contraseña ha quedado expuesta en una filtración conocida</li>
        <li>Se sincroniza de forma segura en todos tus dispositivos</li>
      </ul>
      <p>
        Las opciones populares incluyen Bitwarden (de código abierto y gratuito), 1Password y KeePass (totalmente
        local). Lo importante es usar cualquiera de ellos — la mejora de seguridad frente a no usar ninguno es enorme.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Idea clave:</strong> con un gestor de contraseñas, puedes usar una contraseña diferente, totalmente
        aleatoria y de 20 caracteres en cada sitio. Si un sitio sufre una brecha, solo esa cuenta queda comprometida —
        no todas las cuentas que tienes.
      </div>

      <h2>Autenticación de dos factores: por qué las contraseñas por sí solas no bastan</h2>
      <p>
        Incluso la contraseña más fuerte tiene una vulnerabilidad fundamental: puede ser robada sin ser descifrada. Los
        ataques de phishing, los keyloggers, los ataques de intermediario y las brechas de datos pueden exponer tu
        contraseña sin ninguna fuerza bruta. Una vez que un atacante tiene tu contraseña, la longitud y la complejidad
        son irrelevantes.
      </p>
      <p>
        La autenticación de dos factores (2FA) añade una segunda capa que te protege incluso si tu contraseña queda
        comprometida. Las formas comunes incluyen:
      </p>
      <ul>
        <li><strong>Apps TOTP</strong> (Google Authenticator, Authy): generan un código de 6 dígitos que cambia cada 30 segundos. Incluso con tu contraseña, un atacante no puede iniciar sesión sin el código actual.</li>
        <li><strong>Llaves de hardware</strong> (YubiKey): un dispositivo físico que conectas o tocas. Resistente al phishing porque la llave verifica el dominio del sitio antes de autenticar.</li>
        <li><strong>Códigos por SMS</strong>: mejor que nada, pero vulnerables a los ataques de intercambio de SIM. Usa una app de autenticación en su lugar siempre que sea posible.</li>
      </ul>
      <p>
        Activa la 2FA en cada cuenta que la admita — especialmente correo electrónico, banca, almacenamiento en la nube
        y redes sociales. Una contraseña fuerte más 2FA hace que el acceso no autorizado sea extremadamente difícil
        incluso para atacantes con muchos recursos.
      </p>

      <h2>Una lista de verificación completa de seguridad de contraseñas</h2>
      <ul>
        <li>Usa un mínimo de 16 caracteres en cada contraseña</li>
        <li>Usa una contraseña diferente en cada sitio y servicio</li>
        <li>Nunca uses palabras del diccionario, nombres ni información personal</li>
        <li>Usa un gestor de contraseñas para generar y almacenar todas las contraseñas</li>
        <li>Activa la autenticación de dos factores en todos los lugares donde esté disponible</li>
        <li>Comprueba hoy mismo tus contraseñas existentes con un verificador de fortaleza</li>
        <li>Comprueba si tu correo ha aparecido en filtraciones conocidas (haveibeenpwned.com)</li>
        <li>Nunca compartas contraseñas por correo electrónico, mensajes de texto o apps de mensajería</li>
      </ul>

      <h2>Empieza ahora mismo — solo lleva 2 minutos</h2>
      <p>
        No necesitas revisarlo todo de golpe. Empieza por tus cuentas más críticas: correo electrónico, banca y tus
        redes sociales principales. Reemplaza esas contraseñas primero con el Generador de contraseñas de BrowseryTools,
        y luego comprueba la fortaleza de las que ya tienes con el Verificador de fortaleza de contraseñas.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Herramientas de contraseñas gratuitas — sin registro, sin compartir datos
        </p>
        <div style={{display: "flex", gap: "12px", flexWrap: "wrap" as const, justifyContent: "center"}}>
          <a
            href="/tools/password-strength"
            style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Comprobar fortaleza de contraseña →
          </a>
          <a
            href="/tools/password-generator"
            style={{background: "rgba(34,197,94,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Generar contraseña fuerte →
          </a>
        </div>
      </div>
      <p>
        Ambas herramientas se ejecutan por completo en tu navegador. Tus contraseñas nunca se transmiten, registran ni
        almacenan en ningún lugar fuera de tu propio dispositivo. Esa es la promesa de BrowseryTools — herramientas
        potentes que respetan de verdad tu privacidad.
      </p>
      <ToolCTA slug="password-strength" variant="card" />
    </div>
  );
}
