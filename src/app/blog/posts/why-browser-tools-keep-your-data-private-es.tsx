import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Cada día, millones de personas suben archivos sensibles — documentos fiscales, fotos personales, informes confidenciales — a herramientas en línea cualquiera que encontraron a través de una búsqueda en Google. La mayoría nunca se detiene a pensar qué pasa con esos datos después de hacer clic en "Procesar". La respuesta, la mayoría de las veces, es inquietante.
      </p>

      <p>
        Las herramientas basadas en el navegador como las de <strong>BrowseryTools</strong> operan según un principio fundamentalmente distinto: <em>tus datos nunca salen de tu dispositivo</em>. Entender por qué importa esa distinción podría proteger tu carrera, tu negocio y tu vida personal.
      </p>

      <h2>El coste oculto de las herramientas en la nube "gratuitas"</h2>

      <p>
        Cuando visitas una herramienta en línea típica — un compresor de imágenes, un conversor de PDF, un generador de contraseñas — y subes un archivo, ese archivo viaja desde tu dispositivo hasta un servidor en algún lugar del mundo. Se procesa en ese servidor y el resultado se te devuelve. En la superficie esto suena inofensivo. Bajo la superficie, no tienes absolutamente ningún control sobre lo que pasa después.
      </p>

      <h3>Filtraciones de datos: tus archivos solo están tan seguros como su servidor</h3>

      <p>
        Los servicios en la nube son objetivos prioritarios para los hackers. Cuando ocurre una filtración, cada archivo subido alguna vez a ese servicio queda potencialmente expuesto — incluido el tuyo. Incidentes de alto perfil han afectado a plataformas de compartición de archivos, conversores de documentos e incluso almacenamiento corporativo en la nube. El daño se agrava por el hecho de que a menudo no tenías ni idea de que tus datos estaban almacenados.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Riesgo del mundo real:</strong> Un estudio de 2023 descubrió que más del 80% de los servicios gratuitos de conversión de archivos en línea conservan los archivos subidos durante periodos que van de 24 horas a indefinidamente. Algunos almacenan archivos de forma permanente y los indexan para sus analíticas internas.
      </div>

      <h3>Políticas de retención de datos escritas en letra pequeña</h3>

      <p>
        La mayoría de las herramientas en la nube tienen Términos de Servicio que les otorgan una <em>licencia para usar tu contenido</em> con el fin de mejorar sus servicios. Esto es jerga legal estándar que la mayoría de los usuarios se salta — pero significa que el PDF que convertiste o la imagen que editaste pueden usarse para entrenar modelos de aprendizaje automático, mejorar sus algoritmos de compresión o compartirse con socios publicitarios.
      </p>

      <ul>
        <li>Los archivos a menudo se conservan durante 30 a 90 días "con fines de soporte al cliente"</li>
        <li>El contenido subido puede usarse para entrenar modelos sin consentimiento explícito</li>
        <li>Las herramientas de analítica de terceros integradas en el sitio también pueden recibir metadatos sobre tus subidas</li>
        <li>La eliminación de la cuenta rara vez garantiza la eliminación de los datos en la práctica</li>
      </ul>

      <h3>Solicitudes gubernamentales y citaciones legales</h3>

      <p>
        Los datos almacenados en un servidor en una jurisdicción extranjera pueden estar sujetos a las leyes de ese país. Los servicios en la nube estadounidenses pueden recibir Cartas de Seguridad Nacional que les exigen entregar datos de usuarios sin notificar al usuario. Los servicios con sede en la UE enfrentan sus propias presiones gubernamentales. La conclusión: si tus datos existen en el servidor de otra persona, otra persona tiene las llaves.
      </p>

      <h3>Monetización de tus datos</h3>

      <p>
        Las herramientas "gratuitas" tienen que ganar dinero de algún modo. Cuando el producto es gratis, a menudo el producto eres tú. Los datos de usuario — incluidos los metadatos sobre los archivos que subes, la frecuencia de tus visitas e incluso el contenido de tus documentos — pueden venderse a corredores de datos, usarse para publicidad dirigida o licenciarse a empresas de investigación.
      </p>

      <h2>Cómo BrowseryTools es diferente: todo se ejecuta en tu navegador</h2>

      <p>
        BrowseryTools está construido en torno a un único principio arquitectónico: <strong>cero procesamiento en servidor</strong>. Cada cómputo sucede dentro de tu navegador usando JavaScript, las Web APIs y WebAssembly. Cuando usas una herramienta de BrowseryTools, el único servidor implicado es el que inicialmente entrega el código de la página web — después de eso, tu navegador hace todo el trabajo.
      </p>

      {/* Visual comparison */}
      <div style={{margin: "32px 0"}}>
        <h3>Herramienta en la nube vs. BrowseryTools: qué pasa realmente</h3>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
          {/* Cloud Tool column */}
          <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "20px"}}>
            <div style={{fontWeight: "700", color: "#ef4444", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              Herramienta en la nube típica
            </div>
            <ol style={{margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: "1.8"}}>
              <li>Subes tu archivo</li>
              <li>El archivo viaja por internet hasta un servidor remoto</li>
              <li>El servidor procesa el archivo</li>
              <li>El resultado se te devuelve</li>
              <li>El archivo puede almacenarse durante días, meses o indefinidamente</li>
              <li>El archivo queda sujeto a políticas de retención, filtraciones y solicitudes legales</li>
              <li>Los datos potencialmente se monetizan o comparten</li>
            </ol>
          </div>

          {/* BrowseryTools column */}
          <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px"}}>
            <div style={{fontWeight: "700", color: "#16a34a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              BrowseryTools
            </div>
            <ol style={{margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: "1.8"}}>
              <li>Abres una herramienta en tu navegador</li>
              <li>El código JavaScript se carga en tu dispositivo</li>
              <li>Proporcionas tu archivo o datos localmente</li>
              <li>Tu navegador procesa todo en tu CPU/GPU</li>
              <li>El resultado aparece al instante en tu navegador</li>
              <li>Nada se sube ni almacena nunca de forma remota</li>
              <li>Cierra la pestaña — no queda ningún rastro en ninguna parte</li>
            </ol>
          </div>
        </div>
      </div>

      <h2>La tecnología detrás del procesamiento local</h2>

      <p>
        Las herramientas de navegador centradas en la privacidad solo son posibles gracias a avances significativos en las capacidades de los navegadores web durante la última década. Así es como BrowseryTools aprovecha estas tecnologías:
      </p>

      <h3>Eliminación de fondos: modelo de aprendizaje automático ONNX ejecutándose localmente</h3>

      <p>
        Eliminar el fondo de una foto ha requerido tradicionalmente enviar tu imagen a un servicio de IA en la nube como Remove.bg. La <Link href="/tools/bg-removal">herramienta de eliminación de fondos</Link> de BrowseryTools ejecuta un modelo ONNX (Open Neural Network Exchange) comprimido directamente dentro de tu navegador usando el ONNX Runtime para Web. Tu foto es procesada por una red neuronal que se ejecuta en tu propia máquina — ningún píxel se transmite nunca a ninguna parte.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Cómo funciona:</strong> El archivo del modelo ONNX se descarga una vez y se ejecuta a través de WebAssembly en un hilo de trabajo en segundo plano. Los datos de tu imagen se pasan al modelo como un tensor, el modelo predice una máscara de segmentación píxel a píxel, y el resultado se compone de nuevo en tu navegador — todo sin una sola petición de red que contenga tu imagen.
      </div>

      <h3>Generación de contraseñas: Web Crypto API</h3>

      <p>
        Cuando usas el <Link href="/tools/password-generator">generador de contraseñas</Link>, BrowseryTools llama a <code>crypto.getRandomValues()</code> — una API nativa del navegador respaldada por el generador de números pseudoaleatorios criptográficamente seguro (CSPRNG) del sistema operativo. Esta es la misma fuente de entropía que usan los sistemas operativos para las claves criptográficas. La contraseña generada se calcula íntegramente en memoria y se te muestra. Nunca se envía a ninguna parte.
      </p>

      <h3>Hashing: SubtleCrypto de la Web Crypto API</h3>

      <p>
        El <Link href="/tools/hash-generator">generador de hashes</Link> usa la función <code>crypto.subtle.digest()</code> integrada en el navegador para calcular hashes MD5, SHA-1, SHA-256 y SHA-512. Esta API está implementada de forma nativa por el motor del navegador (V8, SpiderMonkey, etc.) y opera sobre tus datos locales sin ninguna participación del servidor.
      </p>

      <h3>Decodificación de JWT y procesamiento de texto</h3>

      <p>
        El <Link href="/tools/jwt-decoder">decodificador de JWT</Link> usa la decodificación estándar de Base64 — una pura operación de cadenas — para analizar las cabeceras y los payloads de los tokens. Ningún JWT que pegues se envía nunca a un servidor. Esto importa enormemente en contextos profesionales donde los tokens JWT a menudo contienen reclamaciones de identidad de usuario e información de sesión.
      </p>

      {/* Comparison table */}
      <h2>Comparación de características: herramientas en la nube vs. herramientas locales del navegador</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700"}}>Característica</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700", color: "#ef4444"}}>Herramienta en la nube</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700", color: "#16a34a"}}>BrowseryTools</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Los datos permanecen en tu dispositivo", "✗ No", "✓ Sí"],
              ["Funciona sin conexión tras cargar", "✗ No", "✓ Sí"],
              ["No requiere cuenta", "A veces", "✓ Siempre"],
              ["Sin riesgo de retención de archivos", "✗ No", "✓ Sí"],
              ["Inmune a filtraciones del servidor", "✗ No", "✓ Sí"],
              ["Sin monetización de datos", "Rara vez", "✓ Sí"],
              ["Conforme al RGPD por diseño", "Complejo", "✓ Sí"],
              ["Sin límites de tasa de API", "A menudo limitado", "✓ Ilimitado"],
              ["Procesa documentos sensibles de forma segura", "Arriesgado", "✓ Sí"],
            ].map(([feature, cloud, browser], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "500"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: cloud.startsWith("✗") ? "#ef4444" : cloud === "✓ Sí" ? "#16a34a" : "#d97706"}}>{cloud}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "#16a34a", fontWeight: "600"}}>{browser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Por qué esto importa para el RGPD, la HIPAA y la ley de privacidad</h2>

      <p>
        Si trabajas en un sector regulado — sanidad, derecho, finanzas, educación — las herramientas que usas para manejar datos deben cumplir las leyes aplicables. Bajo el <strong>RGPD</strong> (Reglamento General de Protección de Datos), transmitir datos personales a un procesador externo requiere un Acuerdo de Procesamiento de Datos y puede requerir informar a los interesados. Bajo la <strong>HIPAA</strong>, cualquier herramienta que procese Información de Salud Protegida debe estar cubierta por un Acuerdo de Asociado Comercial.
      </p>

      <p>
        Cuando el procesamiento sucede íntegramente en el navegador, ninguna de estas obligaciones se activa por la herramienta en sí — porque ningún dato personal llega nunca a un tercero. La exposición legal simplemente no existe. Esto es una ventaja significativa para:
      </p>

      <ul>
        <li>Autónomos y contratistas que manejan datos de clientes</li>
        <li>Profesionales del derecho que trabajan con documentos confidenciales</li>
        <li>Trabajadores sanitarios que necesitan utilidades rápidas de texto o archivos</li>
        <li>Periodistas que protegen fuentes sensibles</li>
        <li>Desarrolladores que depuran tokens y payloads de API en entornos de producción</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Idea clave:</strong> El procesamiento local en el navegador no es solo una preferencia de privacidad — a menudo es la única opción legalmente conforme para profesionales que trabajan con datos regulados y que necesitan herramientas de utilidad rápidas sin establecer acuerdos formales de procesamiento de datos con proveedores.
      </div>

      <h2>Objeciones comunes resueltas</h2>

      <h3>"¿No será mi navegador más lento que un servidor?"</h3>

      <p>
        Los navegadores modernos ejecutan JavaScript sobre motores V8 o SpiderMonkey altamente optimizados con compilación JIT, y WebAssembly se ejecuta a una velocidad casi nativa. Para la gran mayoría de las tareas de utilidad — hashing, codificación, conversión de formatos, procesamiento de imágenes — tu dispositivo es más que capaz. En muchos casos, el procesamiento local es <em>más rápido</em> porque elimina por completo la latencia de ida y vuelta de la red.
      </p>

      <h3>"¿Está este enfoque realmente probado para tareas de IA como la eliminación de fondos?"</h3>

      <p>
        Sí. El ONNX Runtime para Web y TensorFlow.js han hecho posible ejecutar redes neuronales sofisticadas localmente. La aceleración por WebGPU (disponible en versiones recientes de Chrome y Firefox) puede acelerar drásticamente la inferencia del modelo. La calidad de la eliminación local de fondos de BrowseryTools iguala a la de muchos servicios en la nube precisamente porque el modelo subyacente es el mismo — solo difiere el entorno de ejecución.
      </p>

      <h3>"¿Cómo sé que no se están enviando datos en secreto?"</h3>

      <p>
        Puedes verificarlo tú mismo. Abre las Herramientas para Desarrolladores de tu navegador (F12), ve a la pestaña Red y observa las peticiones mientras usas cualquier herramienta de BrowseryTools. No verás ninguna petición saliente que contenga tus datos. Esta transparencia es algo que ningún servicio en la nube de código cerrado puede ofrecer.
      </p>

      <h2>Una nota sobre las propias prácticas de datos de BrowseryTools</h2>

      <p>
        BrowseryTools no usa cuentas de usuario, ni cookies de rastreo, ni analíticas de terceros que reciban los datos de tus archivos. El sitio usa registros de acceso de servidor web estándar (como cualquier sitio web) y puede usar analíticas respetuosas con la privacidad para entender el tráfico agregado — pero el contenido de tu trabajo, archivos, contraseñas y documentos nunca toca un servidor de BrowseryTools. Jamás.
      </p>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🔒</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Prueba BrowseryTools — Tus datos se quedan contigo</h2>
        <p style={{margin: "0 0 20px", color: "inherit", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Más de 70 herramientas gratuitas — editores de imágenes, utilidades para desarrolladores, herramientas de texto, conversores y más — todas ejecutándose al 100% en tu navegador. Sin registro. Sin subidas. Sin anuncios.
        </p>
        <Link
          href="/"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(99,102,241)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
        >
          Explorar todas las herramientas gratuitas →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Herramientas relacionadas: <Link href="/tools/password-generator">Generador de Contraseñas</Link> · <Link href="/tools/hash-generator">Generador de Hashes</Link> · <Link href="/tools/bg-removal">Eliminación de Fondos</Link> · <Link href="/tools/jwt-decoder">Decodificador de JWT</Link> · <Link href="/tools/text-encryption">Cifrado de Texto</Link>
      </p>

    </div>
  );
}
