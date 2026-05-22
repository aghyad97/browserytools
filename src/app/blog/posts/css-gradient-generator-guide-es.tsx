export default function Content() {
  return (
    <div>
      <p>
        Los degradados CSS son una de las herramientas más potentes e infrautilizadas del kit del desarrollador
        frontend. Te permiten crear transiciones de color suaves, fondos llamativos, sutiles toques de pulido en la
        interfaz e incluso patrones visuales complejos — todo sin un solo archivo de imagen. Antes de que los degradados
        CSS tuvieran soporte universal, los diseñadores tenían que exportar los fondos degradados como PNG desde
        Photoshop, lo que resultaba en peticiones HTTP adicionales, recursos estáticos poco flexibles y diseños que se
        rompían en cuanto alguien cambiaba los colores de la marca. Hoy, una sola línea de CSS reemplaza todo eso.
      </p>
      <p>
        Esta guía cubre todo lo que necesitas saber sobre los degradados CSS — los tres tipos, el sistema de ángulos,
        casos de uso reales con código listo para copiar, errores comunes y cómo usar el{" "}
        <a href="/tools/css-gradient">Generador de degradados CSS de BrowseryTools</a> para crear exactamente lo que
        necesitas sin escribir una sola línea desde cero.
      </p>

      <h2>Por qué los degradados CSS reemplazaron a los fondos basados en imágenes</h2>
      <p>
        El enfoque antiguo — exportar un PNG degradado de 1×1000 px y repetirlo horizontalmente — tenía costes reales.
        Cada degradado era una ida y vuelta al servidor, un coste de bytes transmitidos y una carga de mantenimiento
        cuando los colores cambiaban. Más importante aún, los degradados PNG no podían responder dinámicamente a los
        tamaños de pantalla, los cambios de tema o los estados de hover.
      </p>
      <p>
        Los degradados CSS resuelven todo esto. La GPU los representa en tiempo real, responden al instante a los
        cambios de estado de JavaScript, escalan perfectamente a cualquier resolución, funcionan con las transiciones y
        animaciones CSS y añaden cero bytes a tu paquete de recursos. El soporte de los navegadores es ahora del 100% en
        todos los navegadores modernos y lo es desde 2014. No hay razón para usar degradados basados en imágenes para
        transiciones de color sólidas en proyectos nuevos.
      </p>

      <h2>Los tres tipos de degradados CSS</h2>

      <h3>1. Degradado lineal</h3>
      <p>
        Un degradado lineal transiciona los colores a lo largo de una línea recta. La dirección puede ser cualquier
        ángulo, o expresarse como una palabra clave como <code>to right</code> o <code>to bottom right</code>. Este es
        el tipo de degradado más usado y cubre la gran mayoría de las necesidades de diseño.
      </p>
      <pre><code>{`/* Classic diagonal purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Top to bottom (default direction) */
background: linear-gradient(#f8fafc, #e2e8f0);

/* Left to right with three color stops */
background: linear-gradient(to right, #f97316, #ec4899, #8b5cf6);`}</code></pre>

      <h3>2. Degradado radial</h3>
      <p>
        Un degradado radial irradia hacia fuera desde un punto central. Por defecto forma una elipse que se ajusta a la
        caja delimitadora del elemento, pero puedes controlar la forma, el tamaño y la posición. Los degradados
        radiales son ideales para efectos de foco, botones brillantes y simulaciones de luz ambiental.
      </p>
      <pre><code>{`/* Circular glow from center */
background: radial-gradient(circle, #6366f1 0%, #1e1b4b 100%);

/* Ellipse glow at top-left corner */
background: radial-gradient(ellipse at top left, #fbbf24 0%, transparent 60%);

/* Positioned spotlight */
background: radial-gradient(circle at 30% 40%, #e0f2fe, #0284c7);`}</code></pre>

      <h3>3. Degradado cónico</h3>
      <p>
        Un degradado cónico barre los colores alrededor de un punto central, como las manecillas de un reloj. Esto lo
        hace especialmente adecuado para gráficos circulares, ruedas de color y animaciones de ruedas de carga. Fue el
        último de los tres tipos de degradado en obtener soporte universal, llegando a todos los navegadores principales
        en 2021.
      </p>
      <pre><code>{`/* Pie chart with three segments */
background: conic-gradient(
  #6366f1 0deg 120deg,
  #ec4899 120deg 240deg,
  #f97316 240deg 360deg
);

/* Color wheel */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);`}</code></pre>

      <h2>Entender el sistema de ángulos para los degradados lineales</h2>
      <p>
        El parámetro de ángulo en <code>linear-gradient</code> sigue una convención que sorprende a muchos
        desarrolladores porque difiere de los ángulos matemáticos estándar. Aquí tienes la correspondencia:
      </p>
      <ul>
        <li><strong>0deg</strong> — de abajo hacia arriba (el degradado fluye hacia arriba)</li>
        <li><strong>90deg</strong> — de izquierda a derecha (el degradado horizontal más común)</li>
        <li><strong>135deg</strong> — diagonal, de arriba a la izquierda hacia abajo a la derecha</li>
        <li><strong>180deg</strong> — de arriba hacia abajo (igual que el valor predeterminado sin ángulo especificado)</li>
        <li><strong>225deg</strong> — diagonal, de abajo a la derecha hacia arriba a la izquierda</li>
        <li><strong>270deg</strong> — de derecha a izquierda</li>
      </ul>
      <p>
        Los equivalentes de palabra clave — <code>to top</code>, <code>to right</code>, <code>to bottom left</code> —
        suelen ser más legibles que los ángulos numéricos para las direcciones comunes. Para efectos diagonales
        precisos, los grados numéricos te dan un control exacto. El popular degradado diagonal de morado a índigo usa{" "}
        <code>135deg</code>:
      </p>
      <pre><code>{`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`}</code></pre>

      <h2>Formas del degradado radial: círculo frente a elipse</h2>
      <p>
        Por defecto, <code>radial-gradient</code> produce una elipse dimensionada para ajustarse al elemento. Puedes
        anular esto con dos palabras clave de forma:
      </p>
      <ul>
        <li>
          <strong>circle</strong> — fuerza un círculo perfecto sin importar la relación de aspecto del elemento. Úsalo
          para efectos de brillo y fondos de foco donde quieras una caída radial uniforme en todas las direcciones.
        </li>
        <li>
          <strong>ellipse</strong> — el valor predeterminado, se estira para ajustarse al contenedor. Úsalo para
          rellenos de fondo sutiles que necesiten adaptarse de forma natural a cualquier forma de elemento.
        </li>
      </ul>
      <p>
        La palabra clave <code>at</code> te permite reposicionar el centro del degradado en cualquier punto del elemento
        usando cualquier longitud o porcentaje CSS. <code>at center</code>, <code>at top left</code>, <code>at 20% 80%</code> — todos
        son válidos. El posicionamiento es especialmente potente para crear efectos de luz ambiental descentrados:
      </p>
      <pre><code>{`/* Glow coming from upper-right corner */
background: radial-gradient(ellipse at top right, rgba(251,191,36,0.4), transparent 60%);

/* Multiple radial gradients layered */
background:
  radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%),
  #0f172a;`}</code></pre>

      <h2>Degradados cónicos para gráficos circulares y ruedas de carga</h2>
      <p>
        La capacidad del degradado cónico de barrer en círculo lo convierte en la solución nativa de CSS para dos
        componentes de interfaz clásicos que antes requerían SVG o JavaScript:
      </p>
      <p>
        Para un <strong>anillo de progreso</strong>, combina un degradado cónico con una máscara circular. Para un
        gráfico circular, los segmentos del degradado cónico corresponden directamente a los porcentajes de los datos.
        Un segmento que abarca de
        <code>0deg</code> a <code>72deg</code> representa exactamente el 20% de un círculo completo. Esto hace que
        traducir los datos a CSS sea sencillo — multiplica el porcentaje por 3,6 para obtener el valor en grados.
      </p>

      <h2>Degradados con múltiples paradas y paradas duras para patrones de rayas</h2>
      <p>
        Las paradas de color no tienen que mezclarse de forma suave. Cuando dos paradas adyacentes comparten la misma
        posición, la transición entre ellas se vuelve instantánea — una parada dura. Esta técnica es como creas patrones
        de rayas, tableros de ajedrez y fondos de líneas reglón enteramente en CSS:
      </p>
      <pre><code>{`/* Candy stripe pattern using hard stops */
background: linear-gradient(
  45deg,
  #6366f1 25%,
  transparent 25%,
  transparent 50%,
  #6366f1 50%,
  #6366f1 75%,
  transparent 75%
);
background-size: 40px 40px;

/* Warning stripe — alternating color hard stops */
background: repeating-linear-gradient(
  -45deg,
  #fbbf24,
  #fbbf24 10px,
  #1e293b 10px,
  #1e293b 20px
);`}</code></pre>

      <h2>Casos de uso reales con código de ejemplo</h2>

      <h3>Fondos de secciones hero</h3>
      <p>
        Un degradado lineal con múltiples paradas combinado con una malla de dos reflejos radiales le da a las secciones
        hero la profundidad de una ilustración personalizada sin ningún archivo de imagen:
      </p>
      <pre><code>{`.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15), transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
}`}</code></pre>

      <h3>Efectos de hover en botones</h3>
      <p>
        Los degradados pueden animarse al pasar el cursor usando el truco de <code>background-position</code> —
        dimensiona el degradado al 200% y desplaza su posición al hacer hover:
      </p>
      <pre><code>{`.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.4s ease;
}
.btn:hover {
  background-position: 100% 50%;
}`}</code></pre>

      <h3>Bordes de tarjetas con border-image</h3>
      <p>
        La propiedad <code>border-image</code> acepta un degradado, lo que permite bordes degradados sin elementos
        contenedores ni trucos de pseudoelementos (para fondos sólidos):
      </p>
      <pre><code>{`.card-gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #6366f1, #ec4899) border-box;
}`}</code></pre>

      <h3>Barras de progreso</h3>
      <p>
        Una barra de progreso con degradado comunica a la vez el valor y la energía visual. Combínala con una
        transición de <code>width</code> para una animación suave:
      </p>
      <pre><code>{`.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  width: 73%; /* Controlled by JS or CSS custom property */
  transition: width 0.6s ease;
}`}</code></pre>

      <h2>Comparación de tipos de degradado</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Tipo de degradado</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Función CSS</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Mejor caso de uso</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Ejemplo</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Lineal</strong></td>
              <td style={{padding: "12px 16px"}}><code>linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Fondos hero, botones, banners</td>
              <td style={{padding: "12px 16px"}}><code>135deg, #667eea, #764ba2</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Radial</strong></td>
              <td style={{padding: "12px 16px"}}><code>radial-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Brillos, focos, luz ambiental</td>
              <td style={{padding: "12px 16px"}}><code>circle at center, #6366f1, #1e1b4b</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Cónico</strong></td>
              <td style={{padding: "12px 16px"}}><code>conic-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Gráficos circulares, ruedas de color, ruedas de carga</td>
              <td style={{padding: "12px 16px"}}><code>#6366f1 0deg 120deg, #ec4899 120deg 240deg</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Lineal repetido</strong></td>
              <td style={{padding: "12px 16px"}}><code>repeating-linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Patrones de rayas, líneas reglón</td>
              <td style={{padding: "12px 16px"}}><code>-45deg, #fbbf24 0 10px, #1e293b 10px 20px</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Consejos para elegir buenos colores de degradado</h2>
      <p>
        El error más común al elegir los colores de un degradado es saltar directamente al otro lado de la rueda de
        color — por ejemplo, mezclar directamente de rojo a verde. Como el punto medio de esa transición pasa por un
        gris parduzco y turbio, el resultado parece poco atractivo aunque los colores de los extremos sean atractivos
        individualmente.
      </p>
      <p>
        La solución es pasar por un tono intermedio más saturado. En lugar de rojo a verde directamente, prueba rojo →
        naranja → amarillo verdoso para una transición vibrante. Como alternativa, mantente dentro de un rango de tonos
        adyacentes — la familia de morado a rosa, la familia de índigo a cian — que siempre producen resultados limpios
        porque el punto medio se mantiene saturado.
      </p>
      <p>
        Algunas pautas prácticas:
      </p>
      <ul>
        <li>Mantén la saturación alta en ambos extremos si quieres un degradado vivo. Mezclar un color saturado con uno sin saturar crea una incómoda zona muerta en el medio.</li>
        <li>Mezclar distintos valores de luminosidad (de claro a oscuro) dentro de la misma familia de tonos casi siempre tiene un aspecto profesional y funciona bien en fondos de interfaz.</li>
        <li>Añade una parada de color intermedia al 50% para dirigir el tono del punto medio — esta es la corrección más potente para los degradados turbios.</li>
        <li>Limita los degradados a dos o tres paradas para la mayoría del trabajo de interfaz. Más de tres paradas suele verse caótico a menos que estés creando intencionadamente un arcoíris o una visualización de datos.</li>
      </ul>

      <h2>Accesibilidad: texto sobre degradados</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Advertencia de accesibilidad:</strong> nunca coloques texto sobre un fondo degradado sin comprobar el
        contraste en cada punto a lo largo del degradado. Un degradado que proporciona un contraste de 7:1 en el extremo
        oscuro puede caer a 1,5:1 en el extremo claro, haciendo el texto ilegible para usuarios con baja visión. El WCAG
        AA exige una relación de contraste mínima de 4,5:1 para el texto normal. O bien usa una superposición oscura,
        restringe el texto a la parte de alto contraste del degradado, o elige un rango de degradado que mantenga un
        contraste suficiente a lo largo de toda su extensión.
      </div>

      <h2>Usar el Generador de degradados CSS de BrowseryTools</h2>
      <p>
        El <a href="/tools/css-gradient">Generador de degradados CSS</a> te da una vista previa visual en vivo a medida
        que configuras cada parámetro. Así es como usarlo de forma eficaz:
      </p>
      <ul>
        <li><strong>Elige el tipo de degradado:</strong> alterna entre Lineal, Radial y Cónico en la parte superior de la herramienta.</li>
        <li><strong>Añade paradas de color:</strong> haz clic en la barra de degradado para añadir nuevas paradas. Arrastra las paradas a izquierda y derecha para ajustar sus posiciones. Haz clic en una parada para abrir el selector de color y cambiar su color y opacidad.</li>
        <li><strong>Ajusta la dirección o el ángulo:</strong> para los degradados lineales, arrastra la rueda de ángulo o escribe un valor preciso en grados. Para los degradados radiales, establece la forma y la posición.</li>
        <li><strong>Previsualiza en contexto:</strong> la vista previa en vivo se actualiza al instante. Puedes ver exactamente cómo se verá tu degradado antes de copiar una sola línea.</li>
        <li><strong>Copia el CSS:</strong> pulsa el botón Copiar CSS para obtener CSS listo para producción para la propiedad <code>background</code>, listo para pegar en cualquier hoja de estilos o framework.</li>
      </ul>
      <p>
        Todo se ejecuta en tu navegador. No se envía ninguna definición de degradado a ningún sitio — es una herramienta
        puramente del lado del cliente. Puedes usarla sin conexión una vez que la página se haya cargado.
      </p>

      <h2>Soporte de los navegadores</h2>
      <p>
        Los degradados CSS tienen soporte en todos los navegadores principales desde 2014, lo que hace seguro usarlos
        sin ningún polyfill ni alternativa en prácticamente cualquier entorno de producción. Los degradados cónicos
        llegaron más tarde pero ahora tienen soporte completo en Chrome 69+, Firefox 83+, Safari 12.1+ y Edge 79+ —
        cubriendo bastante más del 97% del uso global de navegadores a fecha de 2026. El único escenario donde podrías
        necesitar una alternativa es dando soporte a versiones muy antiguas de Android WebView en aplicaciones móviles
        empresariales.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Crea cualquier degradado de forma visual — sin necesidad de código
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Vista previa en vivo, CSS listo para copiar y control total sobre paradas, ángulos y posiciones. Se ejecuta
          por completo en tu navegador sin que ningún dato se envíe a ningún servidor.
        </p>
        <a
          href="/tools/css-gradient"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Generador de degradados CSS →
        </a>
      </div>
    </div>
  );
}
