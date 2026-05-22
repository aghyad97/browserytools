export default function Content() {
  return (
    <div>
      <p>
        Quitar el fondo de una imagen solía ser una tarea reservada para diseñadores profesionales. Hoy lleva unos 5
        segundos — y puedes hacerlo por completo en tu navegador, sin subidas, sin cuenta, sin marcas de agua y sin
        coste. Esta guía explica cómo funciona la tecnología, por qué las alternativas populares tienen inconvenientes
        importantes y cómo obtener resultados perfectos siempre con BrowseryTools.
      </p>

      <h2>La forma antigua: Photoshop y GIMP</h2>
      <p>
        Durante décadas, quitar el fondo de las imágenes significaba una de dos cosas: pagar por Adobe Photoshop
        (actualmente 21,99 $/mes como parte de Creative Cloud) y dedicar tiempo a aprender sus herramientas de
        selección, o usar el gratuito pero notoriamente complejo GIMP con su pronunciada curva de aprendizaje.
      </p>
      <p>
        Incluso los usuarios experimentados de Photoshop saben que una eliminación de fondo limpia en un sujeto con
        detalle — pelo, pelaje, objetos transparentes — puede llevar de 10 a 30 minutos de enmascarado cuidadoso. La
        herramienta "Seleccionar sujeto" mejoró las cosas, pero el trabajo de limpieza manual seguía existiendo. Para
        quien no fuera ya diseñador, esto simplemente no era una opción viable para tareas rápidas.
      </p>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>El coste real de Photoshop:</strong> 21,99 $/mes significa que pagas 264 $/año solo para quitar de vez
        en cuando el fondo de una foto de producto o de un avatar. Para la mayoría de la gente, no es una compensación
        razonable.
      </div>

      <h2>Las herramientas online "fáciles" — y sus costes ocultos</h2>
      <p>
        Surgió una oleada de herramientas online de eliminación de fondos para cubrir el vacío. Remove.bg se lanzó en
        2018 y se hizo enormemente popular. Canva añadió la eliminación de fondos como función. Decenas de servicios
        similares siguieron. Resuelven el problema de la complejidad, pero introducen un conjunto distinto de problemas.
      </p>

      <h3>Remove.bg</h3>
      <p>
        Remove.bg es realmente impresionante en lo que hace. Pero el nivel gratuito solo te da vistas previas de baja
        resolución — las descargas a resolución completa requieren créditos que cuestan entre 0,20 $ y 1,99 $ por
        imagen según el volumen. Más importante aún, cada imagen que procesas se sube a sus servidores. Su política de
        privacidad les permite conservar y procesar tus imágenes. Para fotos personales, imágenes de producto con
        información confidencial o cualquier cosa sensible, esto es una preocupación importante.
      </p>

      <h3>Canva</h3>
      <p>
        La eliminación de fondos de Canva está bloqueada tras Canva Pro, que cuesta 12,99 $/mes o 119,99 $/año. El
        nivel gratuito no la incluye. Igual que Remove.bg, Canva procesa tus imágenes en sus servidores, lo que
        significa que tus archivos se suben, se procesan de forma remota y se almacenan en su infraestructura en la
        nube.
      </p>

      <h3>El patrón</h3>
      <p>
        Casi todas las herramientas online populares de eliminación de fondos comparten el mismo modelo: sube tu imagen,
        procésala de forma remota, paga por resultados de calidad. Incluso las versiones "gratuitas" vienen con límites
        de resolución, marcas de agua, límites de procesamiento o las tres cosas. Y tus imágenes viajan a los servidores
        de otra persona cada vez.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Idea clave:</strong> cada vez que subes una imagen a un servicio online para procesarla, estás
        confiando tus datos a ese servicio. Para fotos personales, trabajo de clientes o imágenes de producto
        confidenciales, eso es un riesgo significativo y a menudo innecesario.
      </div>

      <h2>El enfoque de BrowseryTools: IA que se ejecuta en tu dispositivo</h2>
      <p>
        La eliminación de fondos de BrowseryTools funciona de forma fundamentalmente diferente a todos los servicios
        descritos arriba. El modelo de IA se ejecuta por completo dentro de tu navegador usando la potencia de
        procesamiento de tu propio ordenador. Tus imágenes nunca salen de tu dispositivo.
      </p>
      <p>
        Esto es posible gracias a dos tecnologías que trabajan juntas:
      </p>
      <ul>
        <li>
          <strong>@imgly/background-removal:</strong> una librería JavaScript de código abierto que implementa un
          modelo de red neuronal entrenado específicamente para la segmentación de fondos. El modelo se basa en la
          arquitectura RMBG, que produce una detección de bordes de alta calidad, especialmente en el pelo, el pelaje
          y las formas complejas.
        </li>
        <li>
          <strong>ONNX Runtime Web:</strong> el entorno de ejecución Open Neural Network Exchange permite que los
          modelos de aprendizaje automático se ejecuten de forma eficiente en el navegador usando WebAssembly y,
          opcionalmente, WebGPU para aceleración por hardware. Esto es lo que hace práctica la inferencia de IA real
          en el navegador — es la misma tecnología que usan herramientas como Whisper Web y las implementaciones web de
          Stable Diffusion.
        </li>
      </ul>
      <p>
        Los pesos del modelo se descargan una vez a la caché de tu navegador en el primer uso y luego se usan
        localmente para cada imagen posterior. Tras esa descarga inicial, la herramienta funciona incluso sin conexión.
      </p>

      <h2>Antes y después: cómo se ve la eliminación de fondo</h2>

      <div style={{display: "flex", gap: "16px", margin: "28px 0", flexWrap: "wrap" as const}}>
        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "8px", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"}}>
              🧑
            </div>
            <div style={{width: "100%", height: "60px", background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)", borderRadius: "0 0 12px 12px", position: "relative" as const, marginBottom: "-1px"}} />
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500}}>
            ANTES — Foto original con un fondo cargado
          </p>
        </div>

        <div style={{display: "flex", alignItems: "center", fontSize: "2rem", fontWeight: 700, color: "#6366f1", padding: "0 8px"}}>
          →
        </div>

        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0 / 20px 20px", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"}}>
              🧑
            </div>
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#16a34a", fontWeight: 500}}>
            DESPUÉS — Fondo transparente y limpio
          </p>
        </div>
      </div>

      <h2>Cómo quitar un fondo con BrowseryTools</h2>
      <p>
        La <a href="/tools/bg-removal">herramienta de eliminación de fondos de BrowseryTools</a> está diseñada para ser
        lo más sencilla posible. Este es el proceso completo paso a paso:
      </p>
      <ol>
        <li>
          <strong>Abre la herramienta.</strong> Ve a <a href="/tools/bg-removal">/tools/bg-removal</a>. En tu primera
          visita, los pesos del modelo de IA se descargarán a la caché de tu navegador. Esto lleva de 10 a 20 segundos
          según tu conexión y solo ocurre una vez.
        </li>
        <li>
          <strong>Sube tu imagen.</strong> Haz clic en la zona de subida o arrastra y suelta tu archivo de imagen. Los
          formatos admitidos incluyen JPEG, PNG, WebP y la mayoría de los tipos de imagen comunes. El archivo se queda
          en tu dispositivo.
        </li>
        <li>
          <strong>Espera el procesamiento.</strong> La IA analiza tu imagen localmente. El procesamiento suele llevar
          de 2 a 8 segundos según la resolución de la imagen y la potencia de tu dispositivo. Un indicador de progreso
          te muestra en qué punto está.
        </li>
        <li>
          <strong>Revisa y descarga.</strong> El resultado aparece junto a tu original. Si estás satisfecho, descarga
          el PNG con fondo transparente. Si quieres probar otra imagen, simplemente vuelve a subirla.
        </li>
      </ol>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Cero subidas, cero cuentas:</strong> BrowseryTools procesa tus imágenes por completo en tu propio
        dispositivo. No se envía ningún dato de imagen a ningún servidor en ningún momento. No necesitas crear una
        cuenta, verificar un correo electrónico ni proporcionar ninguna información personal. Solo abre la herramienta y
        úsala.
      </div>

      <h2>Qué tipos de imágenes funcionan mejor</h2>
      <p>
        El modelo de IA está entrenado con un conjunto de datos amplio, pero como cualquier modelo, rinde mejor con
        ciertos tipos de imágenes. Entender esto te ayuda a obtener resultados excelentes de forma consistente.
      </p>

      <h3>Resultados excelentes</h3>
      <ul>
        <li><strong>Personas y retratos:</strong> el modelo está especialmente bien entrenado en sujetos humanos. Los retratos, las fotos de cara y las fotos de cuerpo entero con una clara separación del sujeto producen resultados casi perfectos.</li>
        <li><strong>Fotografía de producto:</strong> los objetos sobre fondos sencillos — blanco, gris o iluminados en estudio — se procesan de forma muy limpia. Las imágenes de producto de comercio electrónico son un caso de uso ideal.</li>
        <li><strong>Animales:</strong> las mascotas y los animales suelen funcionar bien, aunque el pelaje muy texturizado con un fondo de tono similar a veces puede causar problemas en los bordes.</li>
        <li><strong>Vehículos y objetos:</strong> coches, muebles y otros objetos sólidos con siluetas claras se procesan de forma fiable.</li>
      </ul>

      <h3>Escenarios difíciles</h3>
      <ul>
        <li><strong>Cristal y objetos transparentes:</strong> las copas de vino, las botellas de agua y otros objetos transparentes son difíciles para cualquier modelo de eliminación de fondos porque el fondo se ve a través del propio sujeto.</li>
        <li><strong>Detalle muy fino:</strong> los tejidos de malla extremadamente finos, el encaje o el pelo disperso sobre un fondo complejo pueden tener algo de fleco. Para trabajos críticos, una limpieza manual rápida en cualquier editor de imágenes se encargará de los bordes.</li>
        <li><strong>Sujetos de bajo contraste:</strong> una camisa blanca sobre una pared blanca es realmente difícil de segmentar, incluso para los humanos. Procura algo de contraste entre el sujeto y el fondo cuando sea posible.</li>
        <li><strong>Imágenes de muy baja resolución:</strong> las imágenes más pequeñas de 200x200 píxeles pueden no proporcionar suficiente detalle para una segmentación precisa.</li>
      </ul>

      <h2>Consejos para obtener los mejores resultados</h2>
      <ul>
        <li><strong>Empieza con la versión de mayor resolución que tengas.</strong> Más píxeles dan a la IA más información con la que trabajar, especialmente en los bordes. Siempre puedes reducir la escala del resultado después.</li>
        <li><strong>Asegura una buena iluminación del sujeto.</strong> Una iluminación uniforme con sombras mínimas le facilita el trabajo al modelo. Las sombras duras a veces pueden interpretarse como parte del fondo.</li>
        <li><strong>Usa un fondo limpio al hacer la foto.</strong> Si controlas el entorno de la foto, un fondo de un solo color siempre producirá resultados más limpios que una escena compleja, incluso con procesamiento de IA.</li>
        <li><strong>Usa la salida PNG para la transparencia.</strong> El resultado descargado es siempre un PNG con fondo transparente, que se puede colocar sobre cualquier nuevo fondo en cualquier herramienta de diseño.</li>
      </ul>

      <h2>Casos de uso: dónde importan de verdad las imágenes sin fondo</h2>

      <h3>Fotos de producto para comercio electrónico</h3>
      <p>
        Amazon, Shopify y la mayoría de los marketplaces exigen o recomiendan encarecidamente imágenes de producto con
        fondo blanco. En lugar de contratar a un fotógrafo con un montaje de estudio o pagar un servicio de retoque,
        puedes fotografiar productos sobre cualquier superficie neutra y quitar el fondo en segundos con BrowseryTools.
        Procesa un catálogo de productos entero sin subir ni una sola imagen a un servicio externo.
      </p>

      <h3>Fotos de perfil y avatares</h3>
      <p>
        Las fotos de perfil de LinkedIn, los avatares de GitHub, los perfiles de Slack y las biografías profesionales se
        benefician de un fondo limpio. En lugar de reservar una sesión de estudio solo para una foto de perfil, haz una
        buena foto con luz decente y quita el fondo en tu navegador. Añade después un fondo de color sólido o degradado
        en cualquier editor.
      </p>

      <h3>Presentaciones y materiales de marketing</h3>
      <p>
        Las imágenes recortadas se integran limpiamente con los fondos de diapositivas, los diseños de infografías y los
        diseños de banners. En lugar de buscar archivos PNG que ya tengan fondos transparentes, crea los tuyos a partir
        de cualquier foto que tengas. Esto es especialmente útil para las fotos de los miembros del equipo en las
        presentaciones corporativas.
      </p>

      <h3>Contenido para redes sociales</h3>
      <p>
        Las publicaciones de Instagram, las miniaturas de YouTube, las cabeceras de Twitter y contenido similar a menudo
        se benefician de sujetos aislados colocados sobre fondos de marca o temáticos. Una versión sin fondo de un
        sujeto te da total flexibilidad para composiciones creativas.
      </p>

      <h3>Trabajo de clientes y confidencialidad</h3>
      <p>
        Si trabajas con imágenes de clientes — fotos de producto, retratos, materiales confidenciales — lo último que
        quieres es subir esos archivos a un servidor externo. Con BrowseryTools, las imágenes de los clientes se quedan
        en tu equipo. Y punto.
      </p>

      <h2>Comparación directa: BrowseryTools frente a las alternativas</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Característica</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Remove.bg</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Canva Pro</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Photoshop</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Coste</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Gratis</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>Desde 0,20 $/imagen</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>12,99 $/mes</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>21,99 $/mes</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Subidas de imágenes</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Ninguna — solo local</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sí, a sus servidores</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sí, a sus servidores</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Local (app de escritorio)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Cuenta requerida</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>No</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Para créditos, sí</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sí</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sí (Adobe ID)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Salida a resolución completa</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Sí</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Solo de pago</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Sí</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Sí</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Marcas de agua</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Ninguna</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Solo nivel gratuito</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ninguna</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ninguna</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Funciona sin conexión</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Sí (tras la primera carga)</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>No</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>No</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Sí</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Eliminación de fondos por lotes</h2>
      <p>
        Si tienes un lote de imágenes de producto que procesar, BrowseryTools también admite la eliminación de fondos
        por lotes. Puedes subir varias imágenes a la vez y procesarlas de forma secuencial sin salir de la herramienta
        ni configurar ningún script de procesamiento por lotes. Para vendedores de comercio electrónico o creadores de
        contenido con bibliotecas grandes, esto hace que la herramienta sea realmente práctica para flujos de trabajo
        reales, no solo para tareas puntuales.
      </p>

      <h2>¿Qué ocurre con tus imágenes?</h2>
      <p>
        Nada sale de tu dispositivo. Cuando subes una imagen a la herramienta de eliminación de fondos de BrowseryTools,
        el JavaScript de la página lee el archivo usando la File API del navegador y lo pasa directamente al entorno de
        ejecución ONNX que corre en un Web Worker. El modelo de segmentación se ejecuta localmente, el PNG de salida se
        genera en memoria y tú lo descargas. En ningún momento ningún dato de imagen viaja por una conexión de red.
      </p>
      <p>
        Puedes comprobarlo tú mismo abriendo la pestaña Red de las Herramientas para desarrolladores de tu navegador
        mientras usas la herramienta. Tras la descarga inicial del modelo, verás cero peticiones de red al procesar una
        imagen.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Transparencia por diseño:</strong> BrowseryTools está construido sobre el principio de que tus datos te
        pertenecen. El procesamiento de IA en el navegador no es un apaño — es la decisión arquitectónica correcta para
        herramientas que manejan contenido personal o sensible.
      </div>

      <h2>Pruébalo ahora mismo</h2>
      <p>
        Sin cuenta. Sin tarjeta de crédito. Sin marcas de agua. Sin límites de tamaño en el nivel gratuito — porque no
        hay nivel de pago. Solo abre la herramienta, suelta una imagen y descarga un PNG transparente y limpio en
        segundos.
      </p>
      <div style={{background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Quita el fondo de las imágenes — gratis, privado, al instante
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.9rem", color: "#64748b"}}>
          Con IA. Se ejecuta localmente. Sin subidas. Sin marcas de agua.
        </p>
        <a
          href="/tools/bg-removal"
          style={{background: "linear-gradient(135deg, #ec4899, #be185d)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Abrir herramienta de eliminación de fondos →
        </a>
      </div>
    </div>
  );
}
