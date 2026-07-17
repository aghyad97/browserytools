import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Un favicon es el diminuto icono que se sitúa en la pestaña de tu navegador, en tu barra de marcadores, en la pantalla
        de inicio de tu teléfono cuando alguien guarda tu sitio, y cada vez más en los resultados de búsqueda junto a tu dominio. Es uno
        de los activos más pequeños de un sitio web y uno de los más desproporcionadamente importantes: un sitio sin
        favicon parece inacabado, mientras que un favicon nítido y reconocible hace que una marca se sienta pulida desde el primer
        píxel. El problema es que acertar con los favicons solía ser innecesariamente complicado — y eso es
        exactamente lo que soluciona un buen <a href="/tools/favicon-generator">generador de favicons en línea</a>.
      </p>

      <ToolCTA slug="favicon-generator" variant="inline" />
      <h2>Por qué un solo favicon nunca es suficiente</h2>
      <p>
        En los primeros tiempos de la web colocabas un único <code>favicon.ico</code> en tu directorio raíz y ya estaba.
        Hoy en día, los navegadores, los sistemas operativos y los lanzadores de aplicaciones quieren todos tamaños distintos para contextos distintos.
        Un icono de 16×16 se muestra en la pestaña del navegador. Uno de 32×32 se usa para pantallas de mayor densidad y la
        barra de tareas de Windows. Los dispositivos Apple quieren un <code>apple-touch-icon.png</code> de 180×180 para la pantalla de inicio. Android y
        las aplicaciones web progresivas referencian PNG de 192×192 y 512×512 desde un manifiesto web. Si te falta uno, tu icono
        se ve borroso, pixelado o simplemente ausente en ese contexto.
      </p>
      <p>
        Producir todos estos a mano en un editor de imágenes es tedioso y propenso a errores. Tienes que redimensionar cada
        uno, exportarlo con las dimensiones de píxel correctas, nombrar los archivos exactamente bien y luego escribir el HTML que
        los enlaza a todos. Nuestra herramienta hace todo el proceso con un solo clic, íntegramente en tu navegador.
      </p>

      <h2>Crear un favicon a partir de una imagen</h2>
      <p>
        El flujo de trabajo más común es <strong>crear un favicon a partir de una imagen</strong> — normalmente un logotipo o icono de
        aplicación. Arrastra un PNG, JPG, WebP, SVG o GIF al área de carga. La herramienta dibuja tu imagen sobre un
        canvas cuadrado usando un ajuste de cobertura (de modo que las imágenes no cuadradas se centran y recortan en lugar de aplastarse) y luego
        la reduce a cada tamaño del conjunto estándar. Como los favicons se muestran tan pequeños, una imagen de origen limpia,
        de alto contraste e idealmente cuadrada da los mejores resultados. El detalle fino y el texto pequeño tienden a
        desaparecer a 16×16, así que las marcas más simples se leen mucho mejor.
      </p>

      <h2>O genera un favicon a partir de una letra o un emoji</h2>
      <p>
        No todo el mundo tiene un logotipo listo — y no lo necesitas. Cambia al modo letra/emoji, escribe un solo
        carácter (una inicial de marca como &quot;B&quot;, o un emoji como 🚀), elige un color de fondo y un color de
        texto, y la herramienta renderiza un glifo limpio y centrado en cada tamaño. Esto es perfecto para proyectos paralelos,
        herramientas internas, sitios de documentación y prototipos rápidos. Obtienes un favicon distintivo y acorde a la marca
        sin abrir ninguna aplicación de diseño.
      </p>

      <h2>Qué descargas realmente</h2>
      <p>
        Cuando haces clic en descargar, la herramienta empaqueta un paquete completo y listo para producción en un único archivo ZIP:
      </p>
      <p>
        <strong>Iconos PNG</strong> a 16×16, 32×32, 48×48, 180×180 (el icono táctil de Apple), 192×192 y 512×512.
        <br />
        <strong>favicon.ico</strong> — un archivo ICO multirresolución real que contiene imágenes tanto de 16×16 como de 32×32,
        codificado directamente en tu navegador para que los navegadores antiguos y Windows sigan teniendo un icono adecuado.
        <br />
        <strong>site.webmanifest</strong> — un manifiesto de aplicación web listo para editar que referencia los PNG de 192 y 512
        para instalaciones de Android y PWA.
        <br />
        <strong>El fragmento HTML</strong> — las etiquetas <code>&lt;link&gt;</code> exactas que pegas en tu{" "}
        <code>&lt;head&gt;</code>, también copiables directamente desde la herramienta con un solo clic.
      </p>

      <h2>Cómo añadir favicons a tu sitio</h2>
      <p>
        Añadir favicons es un proceso de dos pasos. Primero, descomprime los archivos descargados en el directorio raíz o público
        de tu sitio (el mismo lugar donde vive tu <code>index.html</code> o la carpeta pública del framework).
        Segundo, pega las etiquetas de enlace generadas en el <code>&lt;head&gt;</code> de tu HTML:
      </p>
      <pre dir="ltr">
        <code>{`<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`}</code>
      </pre>
      <p>
        Si usas Next.js, coloca los archivos en el directorio <code>public/</code> y añade las etiquetas a
        tu layout raíz o confía en la API de metadatos del framework. En WordPress, la mayoría de los temas tienen un ajuste de icono del sitio
        que acepta un único PNG cuadrado — sube ahí el de 512×512. Para sitios estáticos y frameworks como
        Astro, Vite o HTML plano, el fragmento de arriba funciona tal cual.
      </p>

      <h2>Todo se ejecuta en tu navegador</h2>
      <p>
        Muchos generadores de favicons suben tu logotipo a un servidor, lo procesan de forma remota y te envían por correo o redirigen a una
        descarga. El nuestro nunca lo hace. Todo el flujo — decodificar tu imagen, dibujarla sobre canvas, redimensionar,
        codificar el ICO y los PNG, y comprimir el resultado — sucede localmente usando el canvas HTML y la
        biblioteca <code>jszip</code> ejecutándose en tu pestaña. Tu logotipo nunca sale de tu dispositivo, no hay cuenta que
        crear, ni marca de agua, ni límite de carga. Es genuinamente gratis y genuinamente privado.
      </p>

      <h2>Consejos para favicons nítidos</h2>
      <p>
        Empieza con una fuente cuadrada para que nada se recorte de forma inesperada. Usa formas en negrita y alto contraste para que el
        icono siga siendo legible a 16 píxeles. Evita las líneas finas y el texto pequeño — desaparecen a tamaños pequeños. Si estás
        usando el modo letra, un color de fondo fuerte con texto blanco se lee con nitidez tanto en temas de navegador claros como
        oscuros. Y comprueba siempre tu favicon en una pestaña de navegador real después de desplegar, porque nada
        supera verlo a tamaño real.
      </p>

      <h2>Pruébalo ahora</h2>
      <p>
        Abre el <a href="/tools/favicon-generator">Generador de Favicons</a>, sube un logotipo o escribe una letra, y
        descarga tu conjunto completo de favicons en segundos. Ya que estás aquí, quizá también te gusten el{" "}
        <a href="/tools/image-resizer">Redimensionador de Imágenes</a>, el{" "}
        <a href="/tools/image-converter">Conversor de Formatos de Imagen</a> y el{" "}
        <a href="/tools/meta-tags">Generador de Meta Tags</a> — todos gratis, todos privados, todos ejecutándose íntegramente en tu
        navegador.
      </p>
      <ToolCTA slug="favicon-generator" variant="card" />
    </div>
  );
}
