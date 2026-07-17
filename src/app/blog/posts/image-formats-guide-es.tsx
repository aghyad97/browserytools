import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Elegir el formato de imagen incorrecto es uno de los errores más comunes y costosos en el
        rendimiento web. Un JPEG donde un WebP bastaría, un PNG donde un JPEG es suficiente, o un
        formato que tu navegador no admite — cada uno de estos añade peso innecesario a cada carga de
        página, perjudicando directamente tus puntuaciones de Core Web Vitals y la experiencia del
        usuario. Esta guía explica cómo JPEG, PNG, WebP y AVIF comprimen las imágenes bajo el capó,
        cuándo usar cada uno y cómo tomar una decisión informada para tu contexto específico.
      </p>
      <ToolCTA slug="image-converter" variant="inline" />
      <p>
        Puedes convertir entre cualquiera de estos formatos con el{" "}
        <a href="/tools/image-converter">Conversor de Imágenes de BrowseryTools</a> — gratuito, sin
        registro, y todo se ejecuta localmente en tu navegador.
      </p>

      <h2>JPEG: el estándar para fotografía</h2>
      <p>
        JPEG (Joint Photographic Experts Group) se introdujo en 1992 y sigue siendo el formato dominante
        para fotografías. Su algoritmo de compresión se basa en la Transformada Discreta del Coseno
        (DCT): cada imagen se divide en bloques de 8×8 píxeles, y cada bloque se transforma del dominio
        espacial (colores de píxeles) al dominio de frecuencia (con qué rapidez cambian los colores en
        el bloque). El codificador luego cuantiza estos datos de frecuencia — conservando los componentes
        de baja frecuencia que describen las regiones de color amplias, y descartando o engrosando los
        componentes de alta frecuencia que describen detalles finos y bordes nítidos.
      </p>
      <p>
        Por eso la compresión JPEG produce artefactos característicos con configuraciones agresivas:
        parches cuadrados de 8×8 (llamados macrobloques), borrosidad alrededor de los bordes nítidos y
        bandas de color en los gradientes. Estos artefactos aparecen en regiones de detalles finos y
        alto contraste — exactamente las áreas donde los componentes de alta frecuencia que el codificador
        descartó habrían importado más.
      </p>
      <p>
        JPEG es con pérdida — cada guardado descarta información permanentemente. A calidad 85–90
        (en una escala de 0 a 100), las fotografías suelen ser indistinguibles del original a tamaños
        de visualización web, siendo 5–20 veces más pequeñas que un PNG de la misma imagen. JPEG no
        admite transparencia (canal alfa) ni animación.
      </p>

      <h2>PNG: precisión sin pérdida</h2>
      <p>
        PNG (Portable Network Graphics) usa compresión sin pérdida basada en el algoritmo DEFLATE, que
        combina compresión de diccionario LZ77 (encontrar y reemplazar secuencias repetidas de bytes)
        con codificación Huffman (asignar códigos de bits más cortos a los valores más frecuentes). No
        se descarta ningún dato de imagen. Cada píxel se almacena exactamente.
      </p>
      <p>
        Esto hace que PNG sea excelente para imágenes que deben reproducirse con precisión píxel a
        píxel: capturas de pantalla, logotipos, iconos, ilustraciones con bordes nítidos, texto
        superpuesto en imágenes y todo lo que tenga transparencia. PNG admite canales alfa completos
        de 8 bits, permitiendo gradientes semitransparentes suaves.
      </p>
      <p>
        El inconveniente es el tamaño del archivo. Para contenido fotográfico con gradientes de color
        continuos, los archivos PNG son enormes comparados con JPEG a una calidad percibida similar.
        Una fotografía guardada como PNG puede ser 10–20 veces más grande que la misma imagen como
        JPEG bien comprimido. PNG destaca cuando el contenido tiene grandes regiones uniformes, bordes
        duros o relativamente pocos colores distintos — los patrones que LZ77 comprime eficientemente.
        La fotografía, con sus millones de valores de color sutilmente diferentes, es el peor caso para PNG.
      </p>

      <h2>WebP: el formato web moderno</h2>
      <p>
        WebP fue introducido por Google en 2010, derivado del códec de video VP8. Admite modos de
        compresión tanto con pérdida como sin pérdida, además de animación y transparencia en ambos
        modos. El modo con pérdida usa un enfoque de bloques basado en DCT similar al de JPEG, pero
        con técnicas de predicción más sofisticadas y codificación de entropía, logrando típicamente
        archivos un 25–35 % más pequeños que JPEG con la misma calidad visual. El modo sin pérdida es
        un 15–25 % más eficiente que PNG para la mayoría del contenido.
      </p>
      <p>
        El soporte en navegadores es ahora prácticamente universal — todos los navegadores principales
        han admitido WebP desde 2020. El principal hueco restante es el software heredado: algunas
        aplicaciones de edición de imágenes y visores de imágenes de sistema operativo más antiguos no
        manejan WebP de forma nativa. Para la entrega web, WebP es el moderno valor por defecto directo
        que reemplaza tanto a JPEG como a PNG en la mayoría de los casos.
      </p>

      <h2>AVIF: la próxima generación</h2>
      <p>
        AVIF (AV1 Image File Format) se basa en los keyframes del códec de video AV1, desarrollado por
        la Alliance for Open Media y lanzado en 2018. Las técnicas de compresión de AV1 son
        significativamente más sofisticadas que las que subyacen a JPEG o WebP: bloques de predicción
        más grandes y de tamaño variable, predicción intraframe más sofisticada, mejor manejo del
        grano de película y el ruido, y una codificación de entropía superior. El resultado son
        típicamente archivos un 40–50 % más pequeños que JPEG con la misma calidad — superando a
        menudo a WebP en un 20–30 % también.
      </p>
      <p>
        AVIF admite HDR completo, espacios de color amplios, transparencia, animación y profundidad de
        color de 8 y 10 bits. El soporte en navegadores se ha puesto al día rápidamente: Chrome (85+),
        Firefox (93+) y Safari (16+) admiten AVIF. El principal inconveniente es la velocidad de
        codificación — AVIF es significativamente más lento de codificar que JPEG o WebP, lo que importa
        para los pipelines de procesamiento de imágenes en tiempo real pero es irrelevante para los
        activos estáticos precomprimidos.
      </p>

      <h2>Comparación de tamaños de archivo para la misma imagen</h2>
      <p>
        Para que las diferencias sean concretas, aquí hay una comparación representativa para una
        fotografía de 1920×1080 con calidad visual percibida comparable:
      </p>
      <ul>
        <li>
          <strong>PNG (sin pérdida)</strong> — 4,2 MB. Reproducción perfecta, sin artefactos. Apropiado
          para un master de origen o cuando se requiere precisión de píxeles.
        </li>
        <li>
          <strong>JPEG (calidad 85)</strong> — 380 KB. Artefactos apenas visibles a tamaño de pantalla.
          El estándar para la entrega web fotográfica durante tres décadas.
        </li>
        <li>
          <strong>WebP (con pérdida, calidad equivalente)</strong> — 270 KB. Aproximadamente un 30 %
          más pequeño que JPEG, visualmente comparable. Una mejora directa para la mayoría de los
          proyectos web.
        </li>
        <li>
          <strong>AVIF (calidad equivalente)</strong> — 180 KB. Aproximadamente un 50 % más pequeño
          que JPEG, visualmente comparable o mejor. El mejor tamaño de archivo disponible hoy para
          contenido fotográfico.
        </li>
      </ul>
      <p>
        Estos son valores representativos; los ratios reales varían según el contenido de la imagen. La
        fotografía con muchos detalles y ruido se beneficia menos de los nuevos códecs que las imágenes
        suaves y con poco ruido.
      </p>

      <h2>Cuándo usar cada formato</h2>
      <ul>
        <li>
          <strong>Fotografías en la web</strong> — usa WebP con un respaldo JPEG mediante el elemento
          HTML <code>&lt;picture&gt;</code>. Si tu pipeline de construcción admite la codificación AVIF,
          sirve AVIF con respaldos WebP y JPEG.
        </li>
        <li>
          <strong>Logotipos, iconos y elementos de UI con transparencia</strong> — WebP (sin pérdida)
          o PNG. JPEG no puede representar la transparencia en absoluto.
        </li>
        <li>
          <strong>Capturas de pantalla y grabaciones de pantalla</strong> — PNG para todo lo que
          requiera reproducción exacta de píxeles. WebP sin pérdida como alternativa más pequeña cuando
          la fidelidad exacta no es crítica.
        </li>
        <li>
          <strong>Ilustraciones con colores planos y bordes nítidos</strong> — PNG o WebP sin pérdida.
          JPEG introducirá artefactos de halo visibles alrededor de los bordes duros incluso con
          configuraciones de alta calidad.
        </li>
        <li>
          <strong>Impresión y archivo</strong> — PNG (sin pérdida) o TIFF. Los formatos con pérdida son
          inapropiados para activos de origen que se van a reeditar.
        </li>
        <li>
          <strong>Correo electrónico</strong> — JPEG o PNG. Los clientes de correo tienen soporte
          inconsistente para WebP y prácticamente ninguno para AVIF. Aquí prima la compatibilidad
          sobre la optimización.
        </li>
      </ul>

      <h2>Impacto en Core Web Vitals y el rendimiento de la página</h2>
      <p>
        Largest Contentful Paint (LCP) — una de las Core Web Vitals de Google — mide cuánto tiempo
        tarda en cargar el elemento de contenido visible más grande (a menudo una imagen hero). La
        elección del formato de imagen afecta directamente al LCP: una imagen hero en AVIF carga más
        rápido que el JPEG equivalente, y un LCP más rápido mejora tanto la experiencia del usuario
        como el posicionamiento en buscadores.
      </p>
      <p>
        El efecto acumulativo también importa. Una página con 20 imágenes de producto guardadas
        innecesariamente como PNG en lugar de WebP puede ser 5–10 MB más pesada de lo necesario. En
        conexiones móviles, esa es la diferencia entre una página que carga en 2 segundos y una que
        carga en 8 segundos.
      </p>

      <h2>Servir distintos formatos a distintos navegadores</h2>
      <p>
        El elemento HTML <code>&lt;picture&gt;</code> y sus hijos <code>&lt;source&gt;</code> te permiten
        servir el mejor formato que admite cada navegador sin JavaScript:
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
{`<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Imagen principal" />
</picture>`}
      </pre>
      <p>
        El navegador elige el primer <code>&lt;source&gt;</code> que admite. Los navegadores con soporte
        AVIF descargan el archivo más pequeño; los que no lo tienen recurren a WebP o JPEG. La etiqueta{" "}
        <code>&lt;img&gt;</code> al final sirve como respaldo universal y es el único elemento que
        requiere el atributo <code>alt</code>.
      </p>
      <p>
        Para convertir tus imágenes existentes a WebP o AVIF para este tipo de configuración
        multiformato, el{" "}
        <a href="/tools/image-converter">Conversor de Imágenes de BrowseryTools</a> gestiona
        conversiones por lotes sin subir nada a un servidor — tus archivos fuente permanecen en
        tu dispositivo.
      </p>

      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Guía de decisión rápida:</strong> si necesitas máxima compatibilidad, usa JPEG para
        fotos y PNG para gráficos. Si estás optimizando para el rendimiento web, usa WebP como base y
        añade AVIF como mejora. Si estás construyendo un proyecto nuevo desde cero con una pila moderna,
        sirve AVIF con respaldo WebP y deja de preocuparte por JPEG.
      </div>
      <ToolCTA slug="image-converter" variant="card" />
    </div>
  );
}
