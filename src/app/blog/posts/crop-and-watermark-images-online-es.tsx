import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Dos de las cosas más comunes que la gente necesita hacer con una imagen no tienen nada que
        ver con la edición sofisticada: <strong>recortarla</strong> a la forma y el tamaño correctos,
        y añadir una{" "}
        <strong>marca de agua</strong> para que no pueda reutilizarse sin crédito. Recortar ajusta
        una foto a una miniatura, un banner, un avatar cuadrado o una proporción de aspecto específica.
        Una marca de agua protege tu trabajo y le pone tu nombre a tus capturas de pantalla. No
        deberías necesitar Photoshop ni una suscripción para ninguna de las dos — y desde luego no
        deberías subir la imagen al servidor de un desconocido.
      </p>
      <ToolCTA slug="image-resizer" variant="inline" />
      <p>
        El <a href="/tools/image-resizer">redimensionador de imágenes de BrowseryTools</a> gestiona
        el recorte, el redimensionado y la marca de agua completamente en tu navegador. Sin subidas,
        sin cuenta, sin marca de agua forzada sobre tu imagen por la propia herramienta. Esta guía
        explica cómo recortar a una proporción de aspecto precisa, redimensionar sin distorsión y
        añadir una marca de agua que realmente disuada la reutilización.
      </p>

      <h2>Cómo Recortar y Redimensionar una Imagen (Paso a Paso)</h2>
      <p>
        <strong>1. Abre la herramienta.</strong> Ve al{" "}
        <a href="/tools/image-resizer">redimensionador de imágenes</a>{" "}
        y añade tu imagen. Se lee localmente — nunca se sube.
        <br />
        <strong>2. Elige una proporción de aspecto o recorte libre.</strong> Elige un ajuste
        preestablecido como 1:1 (cuadrado), 16:9 (banner) o 4:5 (retrato), o arrastra libremente.
        Los ajustes preestablecidos mantienen las proporciones correctas para el destino.
        <br />
        <strong>3. Redimensiona a los píxeles exactos que necesitas.</strong> Establece el ancho y
        la altura. Mantén bloqueada la proporción de aspecto a menos que quieras que la imagen se
        estire.
        <br />
        <strong>4. Añade una marca de agua (opcional).</strong> Superpón tu nombre, logotipo o una
        URL, y establece su posición y opacidad.
        <br />
        <strong>5. Exportar.</strong> Descarga el resultado. El original en tu disco no se modifica.
      </p>

      <h2>Recorta a la Proporción de Aspecto Correcta</h2>
      <p>
        El error que arruina más imágenes que cualquier otro es cambiar la proporción de aspecto
        de forma descuidada, lo que estira o aplasta la imagen. Las caras se ensanchan, los círculos
        se convierten en óvalos. Para evitarlo, decide primero la <em>forma</em> y recorta hacia
        ella, en lugar de forzar la imagen existente en un nuevo ancho y altura. Destinos comunes:
      </p>
      <p>
        <strong>Cuadrado 1:1</strong> — fotos de perfil, miniaturas de productos, publicaciones en
        el grid de Instagram.
        <br />
        <strong>Panorámico 16:9</strong> — miniaturas de vídeo, diapositivas de presentación,
        banners principales.
        <br />
        <strong>Retrato 4:5</strong> — la proporción más alta que Instagram permite en el feed,
        ideal para maximizar el espacio en pantalla en móvil.
        <br />
        <strong>3:2 / 4:3</strong> — proporciones clásicas de fotos para impresiones y galerías.
      </p>
      <p>
        Recorta a la proporción, <em>luego</em> redimensiona a las dimensiones en píxeles que
        la plataforma requiere. Ese orden mantiene todo en proporción.
      </p>

      <h2>Redimensiona Sin Perder Nitidez</h2>
      <p>
        Reducir el tamaño de una imagen es seguro e incluso afila el resultado. Aumentar el tamaño
        <em> no</em> lo es — no puedes inventar detalles que nunca se capturaron, por lo que una
        imagen ampliada se ve suave o pixelada. Empieza siempre desde el original de mayor resolución
        que tengas y reduce desde ahí. Si solo necesitas un archivo más pequeño (no dimensiones más
        pequeñas), eso es compresión, no redimensionado — consulta nuestra{" "}
        <a href="/blog/free-image-tools-guide">guía de herramientas de imagen gratuitas</a> para
        conocer la diferencia.
      </p>

      <h2>Añade una Marca de Agua Que Realmente Funcione</h2>
      <p>
        Una buena marca de agua equilibra la visibilidad sin arruinar la imagen. Algunos principios:
      </p>
      <p>
        <strong>Colócala donde no pueda recortarse.</strong> Un logo pequeño en una esquina es fácil
        de recortar. Una marca semitransparente en el centro, o repetida por toda la imagen, es mucho
        más difícil de eliminar.
        <br />
        <strong>Usa una opacidad moderada.</strong> Alrededor del 30–50 % deja que la imagen se vea
        a través mientras la marca permanece legible. Totalmente opaca queda demasiado pesada;
        apenas visible no ofrece protección.
        <br />
        <strong>Mantenla simple.</strong> Tu nombre, usuario o dominio es suficiente. El objetivo
        es la atribución y la disuasión, no la decoración.
      </p>
      <p>
        Recuerda que ninguna marca de agua visible es inquebrantable — una persona determinada puede
        clonarla. El propósito es hacer que la reutilización casual sea inconveniente y asegurarse
        de que cuando tu imagen se difunda, tu nombre viaje con ella.
      </p>

      <h2>¿Por Qué Editar en el Navegador?</h2>
      <p>
        Recortar y añadir marcas de agua trata sobre el control de tus propias imágenes — sin
        embargo, la mayoría de los editores online suben el original a sus servidores primero. La
        edición basada en el navegador mantiene el archivo en tu dispositivo todo el tiempo: se lee
        en la página, se edita con tu propio navegador y se exporta localmente. Nada se sube, la
        herramienta no añade su propia marca de agua y no hay límite de tamaño detrás de un muro
        de pago. Es el mismo modelo local que hay detrás de cada herramienta de BrowseryTools, como
        se explica en{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          por qué las herramientas basadas en navegador mantienen tus datos privados
        </a>
        .
      </p>

      <h2>Preguntas Frecuentes</h2>
      <p>
        <strong>¿Por qué mi imagen se ve estirada después de redimensionar?</strong> La proporción
        de aspecto cambió. Bloquea la proporción o recorta a la forma objetivo antes de redimensionar.
      </p>
      <p>
        <strong>¿Puedo hacer una imagen pequeña más grande sin perder calidad?</strong> Realmente
        no. El escalado no puede añadir detalles que nunca estuvieron ahí. Empieza desde el original
        más grande.
      </p>
      <p>
        <strong>¿La herramienta añadirá su propia marca de agua?</strong> No. Solo aparece la marca
        de agua que tú añadas.
      </p>
      <p>
        <strong>¿Se sube mi imagen?</strong> No. Todo se procesa localmente en tu navegador.
      </p>
      <p>
        <strong>¿Es gratuito?</strong> Sí — sin cuenta, sin límites, sin marca de agua forzada.
      </p>

      <h2>Pruébalo Ahora</h2>
      <p>
        Abre el <a href="/tools/image-resizer">redimensionador de imágenes</a> para recortar,
        redimensionar y añadir una marca de agua en un solo lugar — todo sin subir nada. Si también
        necesitas ocultar detalles sensibles en la foto, consulta nuestra guía sobre{" "}
        <a href="/blog/redact-image-online">redactar imágenes online</a>, y para reducir el tamaño
        final del archivo lee nuestra{" "}
        <a href="/blog/free-image-tools-guide">guía de herramientas de imagen gratuitas</a>.
      </p>
      <ToolCTA slug="image-resizer" variant="card" />
    </div>
  );
}
