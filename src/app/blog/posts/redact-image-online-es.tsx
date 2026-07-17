import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Antes de publicar una captura de pantalla, compartir la foto de un documento o subir una
        imagen a un foro público, casi siempre hay algo en el encuadre que no debería ser público:
        una cara, una matrícula, una dirección particular, un número de cuenta, un correo electrónico,
        un nombre en una credencial. Recortar ayuda, pero lo sensible suele estar en el centro de la
        imagen. Lo que realmente necesitas es{" "}
        <strong>redactar o censurar la imagen</strong> — difuminarla, pixelarla o taparla con un
        bloque negro — sin entregar el original a un sitio web.
      </p>
      <ToolCTA slug="photo-censor" variant="inline" />
      <p>
        La herramienta <a href="/tools/photo-censor">Censura de Fotos de BrowseryTools</a> hace
        exactamente eso, completamente en tu navegador. Pintas sobre las regiones que quieres ocultar,
        eliges difuminar, pixelar o bloque sólido, y exportas una copia limpia. Nada se sube. Esta
        guía explica cómo redactar correctamente una imagen — y el error que filtra silenciosamente
        los datos que creías haber ocultado.
      </p>

      <h2>Cómo Redactar o Difuminar una Imagen (Paso a Paso)</h2>
      <p>
        <strong>1. Abre la herramienta.</strong> Ve a la página{" "}
        <a href="/tools/photo-censor">Censura de Fotos</a> y añade tu imagen arrastrándola o haciendo
        clic para explorar. El archivo se lee localmente.
        <br />
        <strong>2. Elige un estilo de censura.</strong> El difuminado suaviza un área, el pixelado
        la convierte en cuadrados gruesos y el bloque sólido la cubre completamente.
        <br />
        <strong>3. Pinta sobre las áreas sensibles.</strong> Pasa el pincel sobre cada cara, matrícula,
        nombre o número que quieras ocultar. Puedes cubrir varias regiones en un solo trazo.
        <br />
        <strong>4. Ajusta la intensidad.</strong> Para una redacción real, aplica fuerte — un
        difuminado suave puede revertirse. Un pixelado fuerte o un bloque sólido son las opciones
        más seguras.
        <br />
        <strong>5. Exportar.</strong> Descarga la imagen censurada. El original en tu disco nunca
        se modifica.
      </p>

      <h2>Difuminar vs. Pixelar vs. Bloque Sólido — Cuál Usar</h2>
      <p>
        El <strong>bloque sólido</strong> es la única opción verdaderamente irreversible. Los píxeles
        que hay debajo se reemplazan con un color plano, por lo que no queda nada que recuperar.
        Úsalo para cualquier cosa que genuinamente nunca deba ser legible: documentos de identidad
        gubernamentales, datos financieros, contraseñas, información médica.
      </p>
      <p>
        El <strong>pixelado fuerte</strong> es el equilibrio adecuado para la mayoría de las
        situaciones — oculta el contenido mientras sigue mostrando que había algo ahí (una cara,
        una pantalla, un cartel). Mantén el tamaño del bloque grande; un pixelado fino de texto
        a veces puede reconstruirse parcialmente.
      </p>
      <p>
        El <strong>difuminado</strong> tiene el aspecto más limpio y está bien para quitar
        protagonismo a una cara de fondo o un logotipo, pero un difuminado <em>suave</em> es la
        forma más débil de censura. Se ha documentado que caras y texto corto bajo un suave desenfoque
        gaussiano han podido recuperarse. Si los datos importan, no confíes en un difuminado ligero
        — aplica fuerte o usa un bloque sólido.
      </p>

      <h2>El Error Que Filtra los Datos Redactados</h2>
      <p>
        El fallo de redacción más común no tiene nada que ver con la intensidad de tu difuminado.
        Es los <strong>metadatos</strong>. Una foto puede llevar datos EXIF — coordenadas GPS,
        el dispositivo que la tomó, la marca de tiempo original — incrustados en el propio archivo.
        Puedes tapar la dirección en la imagen y aun así enviar la ubicación GPS exacta en los
        metadatos. Tras redactar, considera eliminar esos datos; nuestro{" "}
        <a href="/tools/image-converter">convertidor de imágenes</a> y la{" "}
        <a href="/blog/exif-data-guide">guía de metadatos EXIF</a> explican qué hay oculto en tus
        fotos y cómo eliminarlo.
      </p>
      <p>
        El segundo error clásico es redactar de una forma que puede deshacerse: dibujar un cuadro
        negro como capa separada en un PDF o en un editor vectorial, donde el texto subyacente sigue
        existiendo y puede seleccionarse o moverse. Como la herramienta de Censura de Fotos exporta
        una imagen rasterizada plana, los píxeles censurados han desaparecido realmente — no hay
        ninguna capa oculta que despelar.
      </p>

      <h2>Por Qué Redactar en el Navegador, No en un Sitio Web</h2>
      <p>
        Es una ironía llamativa: las personas redactan una imagen precisamente porque contiene algo
        sensible, y luego suben ese original sin redactar a los servidores de un editor online para
        hacer la redacción. El objetivo es la privacidad, y el flujo de trabajo lo echa por tierra.
      </p>
      <p>
        La redacción basada en el navegador mantiene el original en tu dispositivo todo el tiempo.
        La imagen se lee en la página, se edita con tu propio navegador y se exporta localmente.
        La versión sin redactar nunca viaja por internet, nunca aparece en un registro y nunca queda
        en el bucket de almacenamiento de alguien. Para una explicación más detallada de por qué
        este modelo importa, consulta{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          por qué las herramientas basadas en navegador mantienen tus datos privados
        </a>
        .
      </p>

      <h2>Preguntas Frecuentes</h2>
      <p>
        <strong>¿Es realmente seguro difuminar una cara?</strong> Solo si el difuminado es fuerte.
        Un difuminado suave a veces puede revertirse. Para verdadero anonimato, usa pixelado fuerte
        o un bloque sólido.
      </p>
      <p>
        <strong>¿Se puede deshacer la redacción de una imagen?</strong> No si usaste un bloque sólido
        o pixelado fuerte y exportaste una imagen plana — los píxeles subyacentes se reemplazan. El
        riesgo solo existe con difuminados débiles o con editores que mantienen el original en una
        capa oculta.
      </p>
      <p>
        <strong>¿La herramienta sube mi foto?</strong> No. Todo ocurre en tu navegador. La imagen
        nunca se envía a un servidor.
      </p>
      <p>
        <strong>¿Y los datos de ubicación en la foto?</strong> Redactar la imagen visible no elimina
        los datos GPS del EXIF. Elimina los metadatos por separado antes de compartir.
      </p>
      <p>
        <strong>¿Es gratuito?</strong> Sí — sin cuenta, sin marca de agua, sin límites.
      </p>

      <h2>Pruébalo Ahora</h2>
      <p>
        Abre la <a href="/tools/photo-censor">herramienta Censura de Fotos</a>, pinta sobre
        cualquier cosa sensible y exporta una copia limpia que nunca ha salido de tu dispositivo.
        Para terminar el trabajo, elimina los metadatos de ubicación con el{" "}
        <a href="/tools/image-converter">convertidor de imágenes</a>, y si también necesitas
        recortar o añadir una marca de agua al resultado, consulta nuestra guía sobre{" "}
        <a href="/blog/crop-and-watermark-images-online">recortar y añadir marcas de agua a imágenes online</a>.
      </p>
      <ToolCTA slug="photo-censor" variant="card" />
    </div>
  );
}
