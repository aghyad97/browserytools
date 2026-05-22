export default function Content() {
  return (
    <div>
      <p>
        Cada semana, millones de personas pagan suscripciones de software de edición de imágenes o suben fotos sensibles
        a herramientas en la nube — no porque necesiten funciones avanzadas, sino porque no encontraron una alternativa
        rápida y gratuita. BrowseryTools existe para cambiar eso. Cada herramienta de imagen del conjunto se ejecuta por
        completo dentro de tu navegador usando la potencia de procesamiento de tu propio dispositivo. Tus fotos nunca
        salen de tu equipo. Sin subidas, sin marcas de agua, sin suscripciones y sin límites de tamaño impuestos por un
        servidor que necesita proteger su factura de ancho de banda.
      </p>
      <p>
        Esta guía cubre todas las herramientas de imagen disponibles en BrowseryTools, explica cómo funciona cada una y
        repasa los casos de uso reales en los que destacan.
      </p>

      <h2>Por qué deberías dejar de subir imágenes a herramientas en la nube</h2>
      <p>
        Antes de entrar en las herramientas en sí, conviene abordar por qué el aspecto de "sin subidas" importa por algo
        más que la velocidad.
      </p>
      <ul>
        <li>
          <strong>Privacidad:</strong> cuando subes una imagen a un servicio en la nube, estás confiando su contenido a
          ese servicio. Las fotos de perfil, los documentos de identidad, las maquetas de producto con una marca sin
          lanzar, las imágenes de clientes y las fotografías médicas son cosas que la gente sube habitualmente a
          herramientas online gratuitas sin pensar en qué ocurre con esos archivos en el servidor.
        </li>
        <li>
          <strong>Marcas de agua:</strong> muchas herramientas gratuitas en la nube aplican marcas de agua a menos que
          mejores de plan. El procesamiento en el navegador no tiene esa limitación — la salida es tu imagen, limpia y
          sin modificar salvo por los cambios que solicitaste.
        </li>
        <li>
          <strong>Límites de tamaño de archivo:</strong> las herramientas en la nube suelen limitar las subidas a 5 MB,
          10 MB o 25 MB. Las fotos de cámaras modernas y la fotografía de producto a menudo superan estos límites. El
          procesamiento en el navegador trabaja con tu archivo tal cual, limitado únicamente por la memoria de tu
          dispositivo.
        </li>
        <li>
          <strong>Velocidad:</strong> subir una imagen grande, esperar el procesamiento del servidor y descargar el
          resultado lleva tiempo. El procesamiento local se salta todo eso — los resultados aparecen en segundos.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>¿Cómo funciona el procesamiento de imágenes en el navegador?</strong> Los navegadores modernos exponen
        un potente conjunto de APIs — incluida la Canvas API — que permiten a JavaScript leer los datos de píxeles de
        una imagen, realizar transformaciones matemáticas sobre esos píxeles (ajustar el brillo, la compresión, los
        canales de color, las dimensiones) y generar un nuevo archivo de imagen. Todo este cálculo ocurre en tu CPU o
        GPU, dentro de la pestaña del navegador, sin necesidad de ninguna petición de red.
      </div>

      <h2>Compresión de imágenes — reduce los archivos sin sacrificar calidad</h2>
      <p>
        Los archivos de imagen grandes ralentizan los sitios web, saturan los adjuntos de correo y consumen
        almacenamiento. La herramienta de{" "}
        <a href="/tools/image-compression">Compresión de imágenes de BrowseryTools</a> reduce el tamaño de archivo de
        las imágenes JPEG, PNG y WebP aplicando algoritmos de compresión inteligentes directamente en el navegador.
      </p>
      <p>
        Tú controlas el deslizador de calidad, así que puedes encontrar el equilibrio exacto entre el tamaño de archivo
        y la fidelidad visual para tu caso de uso concreto. Una miniatura de blog tolera más compresión que una foto de
        producto para un listado de comercio electrónico. La herramienta te muestra el tamaño original, el tamaño
        comprimido y el porcentaje de reducción para que tomes una decisión informada antes de descargar.
      </p>
      <h3>Casos de uso comunes de la compresión de imágenes</h3>
      <ul>
        <li>Optimizar imágenes antes de subirlas a un sitio web o CMS (imágenes más pequeñas significan cargas de página más rápidas y mejores puntuaciones de Core Web Vitals)</li>
        <li>Reducir el tamaño de las fotos antes de adjuntarlas a correos electrónicos</li>
        <li>Comprimir imágenes para almacenarlas en dispositivos o unidades con capacidad limitada</li>
        <li>Preparar imágenes para plataformas de redes sociales que imponen su propia (a menudo agresiva) recompresión</li>
      </ul>

      <h2>Conversor de imágenes — cambia entre PNG, JPEG, WebP y BMP</h2>
      <p>
        Distintas plataformas y aplicaciones requieren distintos formatos de imagen. Los desarrolladores que trabajan
        con recursos web a menudo necesitan WebP por rendimiento. Los flujos de trabajo de impresión pueden requerir un
        manejo específico del espacio de color. Algunos sistemas heredados solo aceptan BMP. El{" "}
        <a href="/tools/image-converter">Conversor de imágenes de BrowseryTools</a> te permite convertir entre PNG,
        JPEG, WebP y BMP en segundos.
      </p>
      <p>
        La conversión ocurre por completo en el navegador usando la Canvas API para decodificar el formato de origen y
        recodificar en el formato de destino. Suelta tu archivo, selecciona el formato de salida y descarga. No hay
        degradación de calidad más allá de la inherente al propio formato de destino (por ejemplo, JPEG no admite
        transparencia, así que un PNG transparente convertido a JPEG obtendrá un fondo blanco).
      </p>
      <h3>Cuándo usar cada formato</h3>
      <ul>
        <li><strong>WebP:</strong> el mejor para uso web — excelente compresión con soporte de transparencia; compatible con todos los navegadores modernos</li>
        <li><strong>JPEG:</strong> el mejor para fotografías e imágenes complejas donde el tamaño de archivo importa; sin soporte de transparencia</li>
        <li><strong>PNG:</strong> el mejor para gráficos, logotipos e imágenes con transparencia o texto; sin pérdida pero con archivos más grandes</li>
        <li><strong>BMP:</strong> formato sin comprimir; úsalo solo cuando lo requiera una aplicación concreta o un sistema heredado</li>
      </ul>

      <h2>Redimensionador de imágenes — establece dimensiones exactas en píxeles</h2>
      <p>
        Tanto si estás preparando imágenes para un formato concreto de redes sociales, redimensionando una foto de
        producto para que encaje en una plantilla o reduciendo una imagen grande a dimensiones de visualización web, el{" "}
        <a href="/tools/image-resizer">Redimensionador de imágenes de BrowseryTools</a> te da control preciso sobre las
        dimensiones de salida.
      </p>
      <p>
        Introduce el ancho y el alto objetivo en píxeles. La herramienta mantiene opcionalmente la relación de aspecto
        original para evitar la distorsión. La imagen redimensionada se genera usando la Canvas API del navegador y
        queda disponible para su descarga inmediata. Sin ida y vuelta al servidor, sin esperas, sin restricción de
        tamaño de archivo.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Dimensiones objetivo comunes:</strong> publicaciones cuadradas de Instagram (1080×1080), cabecera de
        Twitter/X (1500×500), foto de portada de LinkedIn (1584×396), miniatura de YouTube (1280×720), banner de correo
        estándar (600 px de ancho). Ten una referencia como esta guardada en marcadores y tu Redimensionador de
        imágenes abierto en una pestaña fijada para resolver cualquier petición de redimensionado en menos de un minuto.
      </div>

      <h2>Corrección de color — ajusta brillo, contraste y saturación</h2>
      <p>
        Una foto tomada en condiciones de iluminación imperfectas a menudo necesita una corrección de color básica antes
        de estar lista para usarse. La herramienta de <a href="/tools/color-correction">Corrección de color de
        BrowseryTools</a> proporciona deslizadores para el brillo, el contraste, la saturación y el tono — los cuatro
        ajustes fundamentales que cubren la mayoría de las necesidades cotidianas de corrección de fotos.
      </p>
      <p>
        Las fotos subexpuestas pueden aclararse sin un editor de escritorio. Las imágenes planas y desvaídas pueden
        ganar contraste y saturación para que resalten. Los ajustes se aplican en tiempo real, así que puedes ver el
        efecto mientras arrastras los deslizadores, y el resultado se descarga como un archivo de imagen estándar en
        cuanto estés satisfecho.
      </p>
      <h3>Casos de uso de la corrección de color</h3>
      <ul>
        <li>Arreglar fotos de producto tomadas con iluminación inconsistente antes de añadirlas a una tienda de comercio electrónico</li>
        <li>Preparar fotos de perfil o de equipo para un sitio web cuando no hay un retocador disponible</li>
        <li>Corregir fotografía de eventos donde la iluminación interior creó dominantes de color</li>
        <li>Mejorar las imágenes de las entradas de blog para hacerlas visualmente más atractivas</li>
      </ul>

      <h2>Eliminación de fondo con IA — sin necesidad de Photoshop</h2>
      <p>
        La eliminación de fondos solía requerir o bien habilidades profesionales de Photoshop o bien subir tu imagen a
        un servicio que la procesaría en sus servidores (y conservaría una copia). La herramienta de{" "}
        <a href="/tools/bg-removal">Eliminación de fondos de BrowseryTools</a> usa un modelo de aprendizaje automático
        que se ejecuta directamente en el navegador para identificar el sujeto de una foto y eliminar el fondo.
      </p>
      <p>
        El resultado es un PNG con fondo transparente, listo para usarse sobre cualquier color o imagen de fondo. Esto
        es especialmente útil para la fotografía de producto de comercio electrónico, donde los fondos blancos o
        transparentes limpios son el estándar; para crear fotos de perfil con fondos personalizados; y para contenido de
        redes sociales donde quieres aislar a un sujeto y colocarlo en un diseño elaborado.
      </p>
      <p>
        Como el modelo de IA se ejecuta localmente en el navegador, tus fotos nunca salen de tu dispositivo — una
        ventaja de privacidad importante frente a los servicios de eliminación de fondos en la nube, que necesariamente
        conservan copias de las imágenes subidas en su infraestructura.
      </p>

      <h2>Un ejemplo de flujo de trabajo completo: preparar imágenes de producto para comercio electrónico</h2>
      <p>
        Así es como un fotógrafo de producto o un vendedor de comercio electrónico podría usar BrowseryTools para llevar
        una foto de producto en bruto de la cámara a estar lista para la tienda en minutos:
      </p>
      <ol>
        <li>
          <strong>Corrección de color:</strong> abre la foto en <a href="/tools/color-correction">Corrección de color</a> y ajusta el brillo y el contraste para compensar las inconsistencias de la iluminación de estudio.
        </li>
        <li>
          <strong>Eliminación de fondo:</strong> pasa la imagen corregida por <a href="/tools/bg-removal">Eliminación de fondos</a> para aislar el producto sobre un fondo transparente.
        </li>
        <li>
          <strong>Redimensionar:</strong> usa el <a href="/tools/image-resizer">Redimensionador de imágenes</a> para llevar la imagen a las dimensiones que requiere la plataforma de tu tienda (por ejemplo, 2000×2000 para Shopify).
        </li>
        <li>
          <strong>Comprimir:</strong> pasa la imagen redimensionada por <a href="/tools/image-compression">Compresión de imágenes</a> para reducir el tamaño de archivo y conseguir cargas de página más rápidas sin pérdida visible de calidad.
        </li>
        <li>
          <strong>Convertir:</strong> usa el <a href="/tools/image-converter">Conversor de imágenes</a> para generar la salida como WebP para navegadores modernos o JPEG para máxima compatibilidad.
        </li>
      </ol>
      <p>
        Todo ese flujo de trabajo — que antes requeriría Photoshop, un plan de pago de Canva o varias subidas web
        distintas — ahora puede completarse en BrowseryTools gratis, con cada paso ocurriendo localmente en tu
        dispositivo.
      </p>

      <h2>Sin instalaciones, sin cuentas, sin esperas</h2>
      <p>
        Todas las herramientas de imagen de BrowseryTools están disponibles de inmediato en tu navegador. No hay nada
        que descargar, ninguna cuenta que crear, ningún periodo de prueba y ninguna marca de agua en la salida. Guarda
        en marcadores las herramientas que más uses y estarán listas siempre que las necesites.
      </p>
      <p>
        Para los equipos que manejan imágenes con regularidad — diseñadores, creadores de contenido, operadores de
        comercio electrónico, blogueros, equipos de marketing — tener estas herramientas en marcadores y listas elimina
        la fricción constante de recurrir a una pesada aplicación de escritorio para tareas que llevan menos de un
        minuto.
      </p>
      <p>
        Empieza con la herramienta que aborde tu necesidad más inmediata y explora el resto del conjunto de imagen en
        BrowseryTools a medida que tu flujo de trabajo lo demande.
      </p>
    </div>
  );
}
