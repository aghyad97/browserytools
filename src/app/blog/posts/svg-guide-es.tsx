import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        SVG es una de esas tecnologías que parece simple desde fuera — es solo un formato de dibujo,
        ¿verdad? — pero que recompensa el estudio profundo más que casi cualquier otro formato en el
        arsenal de un desarrollador o diseñador. Los archivos SVG escalan infinitamente sin pérdida de
        calidad, pesan casi nada para gráficos simples, se pueden estilizar con CSS, animar con
        JavaScript o transiciones CSS, e incrustar directamente en HTML. Entender SVG correctamente
        cambia cómo piensas sobre los gráficos en la web.
      </p>
      <ToolCTA slug="svg" variant="inline" />
      <p>
        Puedes ver, inspeccionar y optimizar cualquier archivo SVG con la{" "}
        <a href="/tools/svg">Herramienta SVG de BrowseryTools</a> — gratuita, sin registro, todo se
        ejecuta en tu navegador.
      </p>

      <h2>¿Qué es SVG?</h2>
      <p>
        SVG son las siglas de Scalable Vector Graphics (Gráficos Vectoriales Escalables). A diferencia
        de JPEG, PNG o WebP — que almacenan imágenes como cuadrículas de píxeles de color (imágenes
        rasterizadas) — SVG almacena imágenes como descripciones matemáticas de formas. Un círculo se
        describe como un punto central y un radio. Un trazado se describe como una secuencia de comandos
        de dibujo: mover a este punto, trazar una línea hasta ese punto, trazar una curva a través de
        estos puntos de control, cerrar el trazado.
      </p>
      <p>
        SVG es un formato basado en XML, lo que significa que cada archivo SVG es texto plano, legible
        por humanos y estructurado como un árbol de elementos anidados. Abre cualquier SVG en un editor
        de texto y verás marcado legible, no datos binarios. Esto tiene consecuencias prácticas
        significativas: los archivos SVG pueden generarse mediante programación, modificarse con
        herramientas de procesamiento de texto, compararse en control de versiones e incrustarse
        directamente en HTML sin ningún procesamiento adicional.
      </p>
      <p>
        El formato es un estándar del W3C, mantenido junto con HTML y CSS. Todos los navegadores
        modernos tienen un motor de renderizado SVG completo integrado.
      </p>

      <h2>Por qué SVG supera al rasterizado para iconos e ilustraciones</h2>
      <p>
        La ventaja decisiva de SVG frente a los formatos rasterizados para iconos, logotipos e
        ilustraciones es la independencia de resolución. Un icono rasterizado creado a 32×32 píxeles
        se verá borroso en una pantalla Retina, que renderiza a 2× o 3× píxeles físicos por píxel CSS.
        Para solucionarlo, necesitas exportar múltiples variantes de resolución (@1x, @2x, @3x),
        aumentar la resolución de origen (archivos más grandes, más memoria) o usar image-set en CSS
        para servir la resolución correcta. Con SVG, creas el gráfico una vez y se ve perfecto a
        cualquier tamaño, en cualquier pantalla, para siempre.
      </p>
      <p>
        El tamaño del archivo es la otra gran ventaja para gráficos simples. Un icono sencillo —
        una marca de verificación, una flecha, un menú hamburguesa — puede describirse en un archivo
        SVG usando 200–500 bytes. El PNG equivalente a 2× Retina podría ser 2–5 KB. A 3×, aún mayor.
        Cuando una interfaz tiene 50 iconos, la diferencia entre 50 SVG optimizados (totalizando ~20 KB)
        y 50 conjuntos PNG (totalizando ~300+ KB) es significativa.
      </p>
      <p>
        Las imágenes rasterizadas ganan para contenido fotográfico e ilustraciones complejas y muy
        detalladas con gradientes y texturas suaves. Un SVG vectorial de una fotografía sería enorme y
        parecería estilizado en lugar de fotográfico. El formato correcto depende enteramente de la
        naturaleza del contenido.
      </p>

      <h2>Anatomía de SVG: los elementos principales</h2>
      <p>
        Un archivo SVG mínimo tiene esta estructura:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
  <path d="M8 12 L12 16 L16 8" stroke="white" stroke-width="2" fill="none" />
</svg>`}
      </pre>
      <p>
        Los elementos y atributos clave que hay que entender:
      </p>
      <ul>
        <li>
          <strong>viewBox</strong> — define el sistema de coordenadas interno. <code>viewBox="0 0 24 24"</code>{" "}
          significa que el espacio de dibujo va de (0,0) a (24,24). El SVG puede renderizarse a
          cualquier tamaño real — 16×16, 32×32, 200×200 — y el navegador escala el sistema de
          coordenadas para ajustarse. Este es el mecanismo detrás de la independencia de resolución.
        </li>
        <li>
          <strong>path</strong> — el elemento SVG más potente. Un atributo <code>d</code> contiene
          comandos de dibujo: <code>M</code> (mover a), <code>L</code> (línea a), <code>C</code> (curva
          de Bézier cúbica), <code>A</code> (arco), <code>Z</code> (cerrar trazado). Casi cualquier
          forma puede expresarse como un trazado.
        </li>
        <li>
          <strong>circle, rect, ellipse, line, polygon</strong> — elementos de conveniencia para formas
          comunes. Un <code>&lt;circle&gt;</code> toma <code>cx</code>, <code>cy</code> y <code>r</code>.
          Un <code>&lt;rect&gt;</code> toma <code>x</code>, <code>y</code>, <code>width</code> y{" "}
          <code>height</code>, más un <code>rx</code> opcional para esquinas redondeadas.
        </li>
        <li>
          <strong>text</strong> — SVG puede renderizar texto tipográfico que escala con la imagen y
          sigue siendo seleccionable y accesible, a diferencia del texto renderizado en una imagen
          rasterizada.
        </li>
        <li>
          <strong>g (grupo)</strong> — agrupa elementos hijos para que se puedan aplicar
          transformaciones, estilos y opacidad a todo el grupo a la vez.
        </li>
        <li>
          <strong>defs y use</strong> — define elementos reutilizables una vez y referenciarlos múltiples
          veces con <code>&lt;use&gt;</code>. Esencial para sistemas de iconos que usan un único sprite SVG.
        </li>
      </ul>

      <h2>Estilizar SVG con CSS y animarlo</h2>
      <p>
        Los elementos SVG forman parte del DOM cuando el SVG está incrustado en HTML. Esto significa
        que CSS puede apuntarlos directamente usando los mismos selectores que se usan para los
        elementos HTML. Puedes cambiar colores de relleno, anchos de trazo y opacidad al pasar el
        ratón, en modo oscuro o en respuesta a cualquier cambio de estado:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`/* Apuntar a elementos SVG con CSS */
.icon-check circle {
  fill: #22c55e;
  transition: fill 0.2s ease;
}

.icon-check:hover circle {
  fill: #16a34a;
}

/* Soporte para modo oscuro */
@media (prefers-color-scheme: dark) {
  .icon-check circle { fill: #4ade80; }
}`}
      </pre>
      <p>
        Las animaciones y transiciones CSS funcionan sobre las propiedades SVG. El truco de{" "}
        <code>stroke-dasharray</code> y <code>stroke-dashoffset</code> — animar un trazado de invisible
        a visible manipulando cuánto del trazo discontinuo se muestra — crea el efecto de "dibujado"
        que se ve en muchos indicadores de carga e ilustraciones de incorporación. SVG también tiene
        sus propios elementos <code>&lt;animate&gt;</code> y <code>&lt;animateTransform&gt;</code>
        (animación SMIL), aunque las animaciones CSS y JavaScript son generalmente preferidas por
        su mantenibilidad.
      </p>
      <p>
        Usar <code>currentColor</code> como valor de relleno hace que un icono SVG herede automáticamente
        el color del texto de su elemento padre, permitiendo que un único icono se adapte a cualquier
        contexto de color sin modificación.
      </p>

      <h2>Optimización de SVG con SVGO</h2>
      <p>
        Los archivos SVG exportados desde herramientas de diseño como Figma o Illustrator contienen mucha
        información innecesaria: metadatos del editor, atributos redundantes, envolturas de grupos sin
        efecto, coordenadas de punto flotante con ocho decimales, atributos <code>id</code> generados
        por el sistema de nodos interno de la herramienta de diseño. Para un icono simple, este peso
        adicional puede triplicar o cuadruplicar el tamaño del archivo en comparación con una versión
        optimizada a mano.
      </p>
      <p>
        SVGO (SVG Optimizer) es la herramienta estándar para eliminar este sobrepeso. Aplica un conjunto
        configurable de transformaciones: colapsar grupos anidados, eliminar elementos invisibles,
        redondear coordenadas a una precisión razonable, fusionar trazados redundantes, eliminar
        metadatos y comentarios, y más. Una pasada típica de SVGO reduce el tamaño de archivos SVG
        de iconos entre un 30 y un 60 % sin cambio visual alguno.
      </p>
      <p>
        La{" "}
        <a href="/tools/svg">Herramienta SVG de BrowseryTools</a> aplica optimización SVG en tu
        navegador, dándote el resultado optimizado sin instalar ninguna herramienta de línea de comandos.
      </p>

      <h2>SVG en línea vs. archivo externo vs. fondo CSS</h2>
      <p>
        Hay tres formas principales de incluir un SVG en una página web, cada una con diferentes
        compromisos:
      </p>
      <ul>
        <li>
          <strong>SVG en línea</strong> — el marcado SVG se incrusta directamente en el HTML. Da acceso
          completo de CSS y JavaScript a cada elemento dentro del SVG. Mejor para iconos que necesitan
          efectos hover, cambios de color o animación. No puede almacenarse en caché por separado
          por el navegador.
        </li>
        <li>
          <strong>Archivo SVG externo mediante <code>&lt;img&gt;</code></strong> — el SVG es un archivo
          separado referenciado con <code>&lt;img src="icon.svg"&gt;</code>. El navegador puede
          almacenar el archivo en caché. Fácil de usar. Pero el CSS de la página padre no puede llegar
          dentro del SVG, y JavaScript no puede manipular su contenido.
        </li>
        <li>
          <strong>background-image en CSS</strong> — el SVG se referencia como fondo CSS. Funciona para
          gráficos puramente decorativos. El SVG también puede incrustarse como URI de datos en CSS,
          útil para iconos pequeños en hojas de estilos de componentes. CSS no puede reestilizar
          elementos dentro del SVG.
        </li>
      </ul>
      <p>
        Los sprites SVG — un único archivo SVG que contiene todos los iconos definidos en bloques{" "}
        <code>&lt;defs&gt;</code>, referenciados con{" "}
        <code>&lt;use href="sprite.svg#nombre-icono"&gt;</code> — ofrecen un buen equilibrio: una
        solicitud de red almacenable en caché para todos los iconos, con manipulación DOM por icono
        posible en la mayoría de los navegadores modernos.
      </p>

      <h2>Trampas habituales de SVG: XSS mediante SVG</h2>
      <p>
        SVG admite scripts incrustados, manejadores de eventos y referencias a recursos externos, lo
        que lo convierte en un vector de ataque viable para inyección de código (XSS) si los archivos
        SVG subidos por usuarios se muestran en un contexto de navegador. Un archivo SVG que contiene{" "}
        <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> ejecutará ese script si el
        navegador renderiza el SVG como parte de una página.
      </p>
      <p>
        Las reglas para gestionar de forma segura los SVG subidos por usuarios:
      </p>
      <ul>
        <li>
          Nunca incrustes en línea SVG subido por usuarios en tu HTML. Solo incrusta SVG que tú controles.
        </li>
        <li>
          Si debes mostrar SVG subido por usuarios, sírvelo desde un origen separado y en caja de arena,
          y muéstralo en una etiqueta <code>&lt;img&gt;</code> o en un <code>&lt;iframe&gt;</code> con
          sandbox. La etiqueta <code>&lt;img&gt;</code> no ejecuta los scripts del SVG.
        </li>
        <li>
          Sanea los SVG subidos por usuarios ejecutándolos a través de un sanitizador (DOMPurify con
          la configuración SVG) antes de almacenarlos o mostrarlos.
        </li>
        <li>
          Establece la cabecera Content Security Policy para restringir las fuentes de scripts en las
          páginas que muestren SVG.
        </li>
      </ul>

      <h2>Convertir SVG a PNG</h2>
      <p>
        Algunos contextos no admiten SVG: clientes de correo electrónico más antiguos, ciertas
        plataformas CMS, algunos pipelines de procesamiento de imágenes, requisitos de iconos de
        aplicación para iOS y Android e imágenes de vista previa de Open Graph. En estos casos,
        necesitas exportar el SVG como PNG rasterizado.
      </p>
      <p>
        Como SVG escala sin pérdida, puedes exportar a PNG en cualquier tamaño. Para iconos de
        aplicación, esto significa exportar una única fuente SVG a 1024×1024 y derivar todos los
        tamaños menores a partir de ella. Para uso web Retina, exporta a 2× o 3× el tamaño de
        visualización CSS.
      </p>
      <p>
        La{" "}
        <a href="/tools/svg">Herramienta SVG de BrowseryTools</a> puede renderizar SVG a PNG en la
        resolución que elijas, gestionando la conversión en el navegador sin subir nada al servidor.
        Útil cuando tienes un SVG de una herramienta de diseño y necesitas un PNG para un contexto
        que no acepta SVG.
      </p>

      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Referencia rápida:</strong> usa SVG para iconos, logotipos, ilustraciones, elementos
        de UI y todo lo que necesite escalar. Usa PNG (convertido desde SVG) para contextos que
        requieren imágenes rasterizadas. Siempre pasa los archivos SVG por SVGO antes de publicarlos.
        Nunca incrustes directamente en tu HTML los SVG subidos por usuarios. Usa <code>currentColor</code>{" "}
        para iconos que necesiten adaptarse al color del texto de su contexto.
      </div>
      <ToolCTA slug="svg" variant="card" />
    </div>
  );
}
