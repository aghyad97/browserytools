export default function Content() {
  return (
    <div>
      <p>
        SVG es el mejor formato en la web para logotipos, iconos e ilustraciones — es vectorial,
        por lo que escala a cualquier tamaño sin pixelarse, y los archivos son diminutos. Pero en
        el momento en que sales del navegador, el SVG empieza a fallarte. No puedes insertarlo en
        la mayoría de las presentaciones, subirlo como avatar en redes sociales, adjuntarlo a un
        documento que espera una imagen rasterizada ni usarlo en apps que simplemente no entienden
        los vectores. La solución es{" "}
        <strong>convertir SVG a PNG</strong>: un formato rasterizado universal que funciona en
        todas partes.
      </p>
      <p>
        El <a href="/tools/svg-png">conversor de SVG a PNG de BrowseryTools</a> lo hace en tu
        navegador — pega o sube un SVG, elige una resolución y descarga un PNG nítido. Sin subida,
        sin cuenta, sin marca de agua. Esta guía explica cuándo convertir, cómo elegir la resolución
        correcta y cómo conservar un fondo transparente.
      </p>

      <h2>Cómo Convertir SVG a PNG (Paso a Paso)</h2>
      <p>
        <strong>1. Abre el conversor.</strong> Ve a la página{" "}
        <a href="/tools/svg-png">SVG a PNG</a>.
        <br />
        <strong>2. Añade tu SVG.</strong> Sube el archivo o pega el código SVG sin procesar. Se lee
        localmente en tu navegador.
        <br />
        <strong>3. Elige un tamaño.</strong> Establece el ancho y la altura de salida en píxeles,
        o un multiplicador de escala. Como el SVG es un vector, puedes renderizarlo a cualquier
        resolución que quieras — esa es la ventaja clave.
        <br />
        <strong>4. Conserva la transparencia si la necesitas.</strong> PNG admite fondo transparente,
        por lo que un logotipo sin fondo se mantiene transparente en la exportación.
        <br />
        <strong>5. Descargar.</strong> Guarda el PNG. El original vectorial no se modifica.
      </p>

      <h2>Lo Único Que Debes Hacer Bien: La Resolución</h2>
      <p>
        Aquí es donde la mayoría de las conversiones de SVG a PNG salen mal. Un vector no tiene
        un tamaño en píxeles inherente — es matemática. Cuando lo rasterizas, <em>tú</em> decides
        cuántos píxeles se convierten, y una vez que es un PNG esos píxeles son fijos. Exporta
        demasiado pequeño y se verá pixelado cuando se muestre a mayor tamaño; no puedes escalar
        un PNG hacia arriba sin desenfoque.
      </p>
      <p>
        La regla: <strong>renderiza al tamaño más grande que vayas a mostrar, o mayor.</strong>{" "}
        Para un logotipo que puede aparecer en una pantalla de alta densidad de píxeles, exporta a
        2&times; o 3&times; el tamaño de visualización. Un icono de 200&times;200 mostrado en una
        pantalla de alta resolución debe exportarse a 400&times;400 o 600&times;600 para que se
        mantenga nítido. El almacenamiento es barato; un logotipo borroso no lo es.
      </p>

      <h2>Cuándo Convertir SVG a PNG (y Cuándo No)</h2>
      <p>
        <strong>Convierte a PNG cuando:</strong> necesites un avatar o banner para redes sociales,
        estés añadiendo una imagen a una presentación o documento, vayas a enviar un gráfico por
        correo, necesites un icono de app a un tamaño fijo o el destino simplemente no admita SVG.
      </p>
      <p>
        <strong>Conserva el SVG cuando:</strong> lo estés usando en un sitio web o en una app que
        renderiza vectores. En la web, el SVG permanece perfectamente nítido a cualquier nivel de
        zoom y densidad de pantalla, el archivo suele ser más pequeño y puedes darle estilo o
        animarlo con CSS. Convertir un logotipo web a PNG desaprovecha todo eso. Para un panorama
        completo de lo que puede hacer el SVG, consulta nuestra{" "}
        <a href="/blog/svg-guide">guía completa sobre archivos SVG</a>.
      </p>

      <h2>Fondo Transparente vs. Sólido</h2>
      <p>
        Los SVG frecuentemente no tienen fondo — el lienzo es transparente. PNG conserva esa
        transparencia, por lo que un logotipo flotará limpiamente sobre cualquier color. Si en cambio
        necesitas un fondo sólido (por ejemplo, un cuadrado blanco para una foto de perfil que no
        admite transparencia), aplánalo sobre un color de fondo durante la conversión. El otro
        formato rasterizado universal, JPG, <em>no</em> admite transparencia en absoluto, lo que
        es una razón más por la que PNG es el destino correcto para gráficos con áreas transparentes.
      </p>

      <h2>¿Por Qué Convertir en el Navegador?</h2>
      <p>
        El SVG es texto plano — puede contener scripts incrustados, por lo que subir un SVG a un
        servidor puede ser un problema de seguridad. Convertir localmente en tu navegador significa
        que el archivo es renderizado por tu propia máquina y nunca se sube a ningún lugar. Tu
        logotipo, tus activos de marca y cualquier dato incrustado permanecen en tu dispositivo.
        También es más rápido: sin espera de subida, sin cola de descarga, sin ida y vuelta al
        servidor. Este enfoque local es el mismo que hay detrás de cada herramienta de BrowseryTools
        — más en{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          por qué las herramientas basadas en navegador mantienen tus datos privados
        </a>
        .
      </p>

      <h2>Preguntas Frecuentes</h2>
      <p>
        <strong>¿El PNG saldrá borroso?</strong> No si lo exportas a una resolución suficientemente
        alta. Renderiza al tamaño más grande que vayas a mostrar, idealmente 2&times; para pantallas
        de alta resolución.
      </p>
      <p>
        <strong>¿El PNG conserva el fondo transparente?</strong> Sí. PNG admite transparencia, por
        lo que un logotipo sin fondo se mantiene transparente.
      </p>
      <p>
        <strong>¿Puedo convertir PNG de vuelta a SVG?</strong> No de forma fiel. Pasar de rasterizado
        a vector requiere vectorización y solo funciona bien para formas simples. Conserva tu SVG
        original.
      </p>
      <p>
        <strong>¿La conversión es gratuita?</strong> Sí — sin cuenta, sin marca de agua, sin límites
        de tamaño.
      </p>
      <p>
        <strong>¿Se sube mi archivo?</strong> No. El SVG se renderiza localmente en tu navegador.
      </p>

      <h2>Convierte Ahora</h2>
      <p>
        Abre el <a href="/tools/svg-png">conversor de SVG a PNG</a>, establece el tamaño de salida
        y descarga una copia rasterizada nítida de tu vector. Si necesitas redimensionar, recortar
        o añadir una marca de agua a la imagen resultante, consulta nuestra guía sobre{" "}
        <a href="/blog/crop-and-watermark-images-online">recortar y añadir marcas de agua a imágenes online</a>,
        y para entender el formato vectorial en sí, lee la{" "}
        <a href="/blog/svg-guide">guía completa de SVG</a>.
      </p>
    </div>
  );
}
