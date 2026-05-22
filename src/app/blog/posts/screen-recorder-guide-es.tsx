import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        El software de grabación de pantalla ha sido históricamente una de esas herramientas por las que pagas un
        precio elevado por algo que parece debería ser una utilidad básica. Camtasia cuesta unos 300 $ en una compra
        única, o 170 $/año por suscripción. ScreenFlow para Mac cuesta 150 $. Loom — que se posiciona como la opción
        ligera — limita a los usuarios gratuitos a grabaciones de 5 minutos y empuja a todo el mundo hacia un plan de
        pago. Y cada una de estas herramientas requiere instalación, creación de cuenta y confiar el acceso a toda tu
        pantalla a una aplicación de terceros.
      </p>
      <p>
        Esto es lo que la mayoría de la gente no se da cuenta: tu navegador ya sabe cómo grabar tu pantalla. La{" "}
        <strong>Screen Capture API</strong> (<code>getDisplayMedia</code>) es un estándar del W3C que lleva años
        presente en todos los navegadores principales. El{" "}
        <Link href="/tools/screen-recorder">Grabador de pantalla de BrowseryTools</Link> le pone encima una interfaz
        limpia y práctica — para que puedas grabar tu pantalla, una ventana concreta o una sola pestaña del navegador
        sin instalar nada, crear una cuenta ni pagar un céntimo.
      </p>

      <h2>Compatibilidad con navegadores: esto funciona para el 98%+ de tus usuarios</h2>
      <p>
        La Screen Capture API tiene un amplio soporte en todos los navegadores modernos. No necesitas preocuparte por la
        compatibilidad para ninguna audiencia realista:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Navegador</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Versión mínima</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Año de lanzamiento</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Chrome", "72+", "2019", "Soporte completo, incluida la captura de pestañas"],
              ["Edge", "79+", "2020", "Basado en Chromium; mismo soporte que Chrome"],
              ["Firefox", "66+", "2019", "Soporte completo; gran captura de audio"],
              ["Safari", "13+", "2019", "Compatible; captura de pestañas añadida en Safari 15.4"],
            ].map(([browser, version, year, notes], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{browser}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace"}}>{version}</td>
                <td style={{padding: "11px 16px"}}>{year}</td>
                <td style={{padding: "11px 16px", opacity: 0.8}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        La cuota de mercado combinada de los navegadores para estas versiones cubre bastante más del 98% de los usuarios
        de escritorio en todo el mundo. A efectos prácticos, si tu audiencia usa un navegador moderno — lo que casi con
        toda seguridad hace — la Screen Capture API simplemente funciona.
      </p>

      <h2>Qué puedes capturar</h2>
      <p>
        Cuando haces clic en "Iniciar grabación", el navegador muestra su selector de pantalla nativo. Se te ofrecen
        tres modos de captura, y la elección importa según tu caso de uso:
      </p>
      <ul>
        <li>
          <strong>Pantalla completa:</strong> captura todo lo visible en uno de tus monitores. La mejor opción para
          demos donde te mueves entre varias aplicaciones, o cuando quieres mostrar comportamiento a nivel de sistema.
          Ten en cuenta que esto muestra todo — incluidas las notificaciones, la barra de tareas y cualquier otra
          ventana — así que cierra el contenido sensible antes de grabar.
        </li>
        <li>
          <strong>Una ventana de aplicación concreta:</strong> captura solo una ventana, aunque otras ventanas se
          superpongan a ella. La grabación se mantiene centrada en esa aplicación. Buena para demos de software donde
          quieres permanecer en una sola app sin revelar tus otras ventanas abiertas.
        </li>
        <li>
          <strong>Una sola pestaña del navegador:</strong> esta es la opción más respetuosa con la privacidad. Solo se
          captura el contenido de una pestaña del navegador — las demás pestañas, tu barra de direcciones, otras
          aplicaciones y tu escritorio quedan completamente excluidos de la grabación. Ideal para grabar recorridos de
          aplicaciones web o demos en el navegador sin mostrar nada más.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Captura de pestañas para máxima privacidad:</strong> si estás grabando una demo de una aplicación web y
        no quieres mostrar otras pestañas del navegador, otras aplicaciones ni ninguna interfaz del sistema, usa la
        opción "Pestaña del navegador" en el selector de pantalla. Solo se captura el contenido de píxeles de esa única
        pestaña. Nada más de tu equipo es visible en la grabación.
      </div>

      <h2>Paso a paso: cómo usar el Grabador de pantalla de BrowseryTools</h2>
      <p>
        Todo el proceso lleva menos de un minuto para tener tu primera grabación. Así es exactamente como funciona:
      </p>
      <ol>
        <li>
          <strong>Abre la herramienta:</strong> ve a <Link href="/tools/screen-recorder">/tools/screen-recorder</Link>.
          Sin inicio de sesión, sin configuración, nada que instalar. La herramienta está lista en el momento en que la
          página carga.
        </li>
        <li>
          <strong>Haz clic en "Iniciar grabación":</strong> el navegador muestra de inmediato su diálogo de selección
          de pantalla nativo. Esta es una interfaz a nivel de navegador — el sitio web no puede ver ni influir en lo que
          se muestra en este diálogo, y no puede empezar a capturar hasta que confirmes explícitamente tu selección.
        </li>
        <li>
          <strong>Elige qué capturar:</strong> selecciona "Pantalla completa", "Ventana" o "Pestaña del navegador" en
          las pestañas del selector. Haz clic en la miniatura de la pantalla/ventana/pestaña que quieres grabar y luego
          haz clic en el botón "Compartir" para empezar.
        </li>
        <li>
          <strong>Graba:</strong> la herramienta muestra un contador de tiempo transcurrido en vivo para que siempre
          sepas cuánto tiempo llevas grabando. Cambia a la aplicación o el contenido que estés mostrando — la pestaña
          del navegador que ejecuta el grabador permanece activa en segundo plano. Puedes consultar el temporizador
          echando un vistazo a la pestaña.
        </li>
        <li>
          <strong>Haz clic en "Detener grabación":</strong> cuando hayas terminado, haz clic en Detener. La grabación
          está disponible al instante como una vista previa de vídeo dentro de la herramienta. Sin procesamiento, sin
          esperas — aparece de inmediato porque todo se capturó localmente en memoria.
        </li>
        <li>
          <strong>Previsualiza y descarga:</strong> mira la vista previa para confirmar que la grabación capturó lo que
          pretendías. Haz clic en "Descargar" para guardar el archivo como un vídeo <code>.webm</code> en tu equipo
          local. La grabación nunca se sube a ningún sitio.
        </li>
      </ol>

      <h2>El formato de salida: WebM</h2>
      <p>
        La Screen Capture API genera vídeo en el formato <strong>WebM</strong> usando el códec VP8 o VP9 (según cuál
        seleccione tu navegador). WebM es un formato abierto y libre de regalías desarrollado por Google y estandarizado
        para uso web. Para los screencasts específicamente, tiene varias ventajas sobre MP4:
      </p>
      <ul>
        <li>
          <strong>Tamaño de archivo más pequeño:</strong> la compresión VP9 es muy eficiente para el contenido de
          pantalla con grandes áreas planas de color, texto y elementos de interfaz — exactamente lo que contienen los
          screencasts. Un screencast de 5 minutos en WebM suele ser entre un 30% y un 50% más pequeño que la misma
          grabación en H.264 MP4.
        </li>
        <li>
          <strong>Estándar abierto:</strong> sin tarifas de licencia, sin pagos de regalías, sin restricciones de
          patentes. WebM es el formato de vídeo nativo de la web.
        </li>
        <li>
          <strong>Reproducción directa en el navegador:</strong> WebM se reproduce de forma nativa en Chrome, Firefox y
          Edge sin ningún plugin. Puedes compartir un archivo WebM y cualquiera en esos navegadores puede verlo
          directamente.
        </li>
      </ul>
      <p>
        <strong>Convertir WebM a MP4:</strong> si necesitas compartir la grabación con alguien que use QuickTime en
        macOS o Windows Media Player — o subirla a una plataforma que no acepte WebM — puedes convertirla gratis usando
        una herramienta local como{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer">HandBrake</a> (código abierto,
        procesamiento local) o usando la línea de comandos de FFmpeg. La conversión lleva unos segundos y el MP4
        resultante es universalmente compatible.
      </p>

      <div style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6", margin: "16px 0"}}>
        <pre style={{margin: 0}}><code>{`# FFmpeg one-liner to convert WebM to MP4 (free, local, no upload needed):
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4`}</code></pre>
      </div>

      <h2>Casos de uso: cuándo un grabador en el navegador es exactamente lo que necesitas</h2>

      <h3>Informes de errores</h3>
      <p>
        Describir un error con texto es una de las experiencias más frustrantes del desarrollo de software. "No funciona
        cuando hago clic en el botón" es casi inútil. Una grabación de pantalla de 30 segundos de los pasos exactos para
        reproducirlo — mostrando en qué hiciste clic, qué ocurrió, qué debería haber ocurrido — le da a un ingeniero
        todo lo que necesita para diagnosticar el problema de inmediato. Graba el error mientras ocurre, descarga el
        WebM y adjúntalo al ticket. Sin subida a un servicio externo, sin límites de tamaño en Jira o Linear y sin
        preocupaciones de privacidad sobre lo que era visible en tu pantalla durante la grabación.
      </p>

      <h3>Creación de tutoriales sin software pesado</h3>
      <p>
        No todos los tutoriales necesitan una producción profesional. Si estás documentando un proceso para tu equipo —
        cómo configurar una herramienta, cómo navegar por un flujo de trabajo complejo, cómo montar un entorno — una
        grabación de pantalla con narración lo captura en minutos. El grabador de BrowseryTools te permite incluir audio
        del micrófono (concede el permiso al navegador cuando se te solicite), así que puedes narrar mientras trabajas.
        El resultado es un tutorial completo y autocontenido que vive en un único archivo descargable.
      </p>

      <h3>Revisiones de código</h3>
      <p>
        Los comentarios de texto en un pull request a menudo son insuficientes para dar retroalimentación matizada. Una
        grabación de pantalla en la que recorres un diff de viva voz — "aquí en la línea 42 me preocupa esto porque..." —
        es drásticamente más eficiente que escribir un comentario de cinco párrafos. Graba un recorrido de 3 minutos del
        PR, descárgalo y publícalo como adjunto o comparte el archivo. Tu revisor obtiene todo el contexto de tu
        razonamiento sin una reunión.
      </p>

      <h3>Demos remotas y comunicación asíncrona</h3>
      <p>
        En lugar de programar una reunión para mostrar una función, grábala. Una grabación de 2 minutos mostrando la
        función en funcionamiento suele ser más persuasiva y eficiente que una demo en vivo, porque puede verse en
        cualquier momento, reproducirse cuando haga falta y compartirse con cualquiera de la organización. Graba tu demo
        por adelantado, revísala y envíala cuando esté lista. Sin programar nada, sin conflictos de zonas horarias, sin
        la fricción del "¿puedes compartir tu pantalla?".
      </p>

      <h3>Tickets de soporte</h3>
      <p>
        Para los equipos de soporte o las mesas de ayuda internas, una grabación de pantalla enviada con un ticket de
        soporte reduce drásticamente el ir y venir. En lugar de hacerle al usuario diez preguntas aclaratorias sobre qué
        estaba haciendo cuando ocurrió el problema, este graba exactamente lo que pasó. El agente de soporte ve el
        problema de primera mano, a menudo lo resuelve de inmediato y el usuario obtiene una respuesta más rápida.
      </p>

      <h2>Audio: incluir el micrófono en tu grabación</h2>
      <p>
        Cuando inicias la grabación, el navegador te preguntará si incluir audio. Si quieres narrar tu grabación,
        permite el acceso al micrófono cuando se te solicite. Tu voz se grabará junto a la captura de pantalla en el
        mismo archivo WebM — sin pista de audio separada que sincronizar, sin software adicional.
      </p>
      <p>
        Si quieres grabar el audio del sistema (los sonidos que salen de tu ordenador — música, sonidos de
        notificación, audio de aplicaciones), esto se maneja de forma diferente según el navegador. Chrome en Windows
        permite la captura de audio del sistema al grabar una pestaña del navegador. En macOS, la captura de audio del
        sistema requiere un dispositivo de audio virtual como BlackHole o Loopback, ya que el sistema operativo no
        expone una API de captura de audio del sistema. Para la mayoría de los casos de uso de screencast — donde la
        narración es el audio principal — la grabación del micrófono es suficiente y funciona de forma consistente en
        todas las plataformas.
      </p>

      <h2>Privacidad: la grabación nunca sale de tu navegador</h2>
      <p>
        Esto no es un detalle menor. La grabación se almacena en memoria como un objeto <code>Blob</code> dentro de la
        pestaña de tu navegador. Cuando haces clic en "Descargar", el navegador escribe ese blob en tu sistema de
        archivos local. Nada se sube a ningún servidor — ni a los servidores de BrowseryTools, ni a ningún servicio en
        la nube. La grabación no transita la red en ningún momento.
      </p>
      <p>
        Esto importa sobre todo cuando estás grabando contenido sensible: flujos de trabajo internos de la empresa,
        datos de clientes, funciones de producto sin lanzar o cualquier cosa que no debería salir de tu equipo. Con los
        grabadores de pantalla en la nube, tienes que confiar en que la infraestructura de subida, almacenamiento y
        control de acceso del proveedor sea segura. Con un grabador local en el navegador, no hay subida de la que
        preocuparse.
      </p>

      <h2>Limitaciones: qué no puede hacer el grabador del navegador</h2>
      <p>
        El enfoque basado en el navegador es ideal para los casos de uso descritos arriba, pero tiene limitaciones
        reales que deberías conocer antes de recurrir a él en contextos donde se quedará corto:
      </p>
      <ul>
        <li>
          <strong>Sin editor de vídeo integrado:</strong> el grabador captura y descarga el vídeo en bruto. Si
          necesitas recortar el inicio y el final, cortar secciones, añadir llamadas de atención, hacer zoom o
          superponer texto, necesitarás un editor de vídeo aparte. Para ediciones rápidas,{" "}
          <a href="https://www.veed.io" target="_blank" rel="noopener noreferrer">VEED.io</a> o la versión gratuita de
          DaVinci Resolve manejan bien el recorte básico.
        </li>
        <li>
          <strong>Sin superposición de webcam:</strong> no hay una transmisión de webcam de imagen sobre imagen. Si
          necesitas una superposición de "cabeza parlante" en la esquina de la grabación, necesitas software de
          escritorio como OBS o Camtasia.
        </li>
        <li>
          <strong>Restricciones de memoria para grabaciones muy largas:</strong> como la grabación se mantiene en la
          memoria del navegador hasta que se descarga, las grabaciones muy largas (más de 45 minutos) pueden consumir
          una cantidad significativa de RAM. Para grabaciones de formato largo, es más apropiado el software de
          escritorio que escribe directamente en el disco mientras graba.
        </li>
        <li>
          <strong>Sin compartición automática en la nube:</strong> la descarga es un archivo local. Si tu flujo de
          trabajo requiere alojamiento en la nube inmediato y un enlace compartible, tendrás que subir el archivo
          manualmente después, o usar un servicio como Loom que maneja el alojamiento automáticamente.
        </li>
      </ul>

      <h2>Cuándo deberías usar software de escritorio en su lugar</h2>
      <p>
        El grabador del navegador es la herramienta adecuada para grabaciones de corta a media duración donde importan
        la sencillez y la privacidad. Pero el software de escritorio es realmente mejor cuando:
      </p>
      <ul>
        <li>Necesitas grabar durante más de 30 minutos de forma continua</li>
        <li>Necesitas una superposición de webcam o una composición de múltiples fuentes</li>
        <li>Necesitas editar, añadir subtítulos, efectos de zoom o anotaciones</li>
        <li>Necesitas grabar metraje de videojuegos o contenido de alta tasa de fotogramas</li>
        <li>Necesitas subida automática a la nube y enlaces compartibles inmediatamente después de grabar</li>
      </ul>
      <p>
        Para esos casos, OBS Studio (gratuito, de código abierto) es la opción más capaz. Para edición, DaVinci Resolve
        tiene un generoso nivel gratuito. Ambos requieren instalación pero ofrecen capacidades que van mucho más allá de
        lo que puede igualar cualquier herramienta basada en el navegador.
      </p>

      <h2>Comparación: BrowseryTools frente a las opciones comunes de grabación de pantalla</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Característica</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Loom (gratis)</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>OBS Studio</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Camtasia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Coste", "Gratis", "Gratis / 12,50 $/mes", "Gratis", "~300 $ pago único"],
              ["Instalación requerida", "No", "Requiere extensión", "Sí", "Sí"],
              ["Cuenta requerida", "No", "Sí", "No", "Sí"],
              ["Vídeo subido a la nube", "Nunca", "Siempre", "No", "No"],
              ["Límite de duración de grabación", "Ninguno*", "5 min (gratis)", "Ninguno", "Ninguno"],
              ["Editor de vídeo integrado", "No", "Recorte básico", "No", "Sí (avanzado)"],
              ["Superposición de webcam", "No", "Sí", "Sí", "Sí"],
              ["Captura solo de pestaña", "Sí", "Sí", "No", "No"],
              ["Formato de salida", "WebM", "MP4 (nube)", "MP4/MKV", "MP4"],
            ].map(([feature, bt, loom, obs, cam], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{loom}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{obs}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{cam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize: "13px", opacity: 0.7}}>
        * Las grabaciones muy largas (&gt;45 min) pueden estar limitadas por la memoria disponible del navegador.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Nota sobre privacidad:</strong> cuando usas Loom, cada grabación se sube a los servidores de Loom y se
        almacena allí por defecto. El contenido de tu pantalla — que puede incluir herramientas internas, datos
        sensibles de clientes o funciones sin lanzar — vive en un servidor de terceros. Las grabaciones de BrowseryTools
        nunca se suben. El archivo va de tu navegador directamente a tu disco duro.
      </div>

      <h2>Empieza a grabar ahora</h2>
      <p>
        Para la gran mayoría de las tareas de grabación de pantalla — un informe de error rápido, un tutorial de equipo,
        una demo de función, un recorrido de revisión de código — el navegador es todo lo que necesitas. Sin
        instalación, sin suscripción, sin renunciar a la privacidad.
      </p>
      <p>
        Abre el <Link href="/tools/screen-recorder">Grabador de pantalla de BrowseryTools</Link>, haz clic en Iniciar,
        captura lo que necesites y descárgalo. Todo el proceso desde abrir la herramienta hasta tener un archivo WebM en
        tu escritorio lleva menos de dos minutos.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎬</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Graba tu pantalla ahora — gratis, sin instalación</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Captura tu pantalla, ventana o pestaña del navegador. Descarga como WebM. Nada se sube a ningún sitio. Sin
          cuenta, sin extensión, sin coste.
        </p>
        <Link
          href="/tools/screen-recorder"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(239,68,68)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Abrir Grabador de pantalla →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Herramientas relacionadas:{" "}
        <Link href="/tools/image-compression">Compresión de imágenes</Link> ·{" "}
        <Link href="/tools/bg-removal">Eliminación de fondos</Link> ·{" "}
        <Link href="/tools/image-converter">Conversor de imágenes</Link> ·{" "}
        <Link href="/">Todas las BrowseryTools</Link>
      </p>
    </div>
  );
}
