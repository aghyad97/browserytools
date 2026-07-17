import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Todo desarrollador ha vivido esta situación: dos versiones de un archivo que deberían ser
        idénticas, pero algo cambió. Tal vez es un archivo de configuración que fue editado manualmente
        en un servidor. Tal vez es un contrato que volvió de un abogado con cambios no declarados. Tal
        vez es un archivo de traducción que devolvió un proveedor y necesitas verificar que no se
        eliminó nada por accidente. En todos estos casos, la respuesta es la misma: ejecuta un diff.
      </p>
      <ToolCTA slug="text-diff" variant="inline" />
      <p>
        Puedes comparar dos bloques de texto al instante con la{" "}
        <a href="/tools/text-diff">Herramienta de Diferencias de Texto de BrowseryTools</a> — gratuita,
        sin registro, todo se ejecuta en tu navegador.
      </p>

      <h2>Por qué importa la comparación de textos</h2>
      <p>
        La comparación de textos no es solo una herramienta para desarrolladores. Cualquier situación
        en la que existen dos versiones de un documento y se necesita detectar las diferencias es un
        problema de diff:
      </p>
      <ul>
        <li><strong>Revisión de código</strong> — entender qué cambió entre dos versiones del código fuente antes de aprobar una fusión</li>
        <li><strong>Comparación de contratos y documentos legales</strong> — identificar exactamente qué cláusulas se añadieron, eliminaron o modificaron entre borradores</li>
        <li><strong>Gestión de configuración</strong> — confirmar que un archivo de configuración desplegado coincide con la versión en el control de fuente</li>
        <li><strong>Verificación de contenido traducido</strong> — comprobar que un documento traducido cubre todas las mismas secciones que el original</li>
        <li><strong>Validación de datos</strong> — comparar exportaciones CSV de dos sistemas para encontrar discrepancias</li>
        <li><strong>Corrección de pruebas</strong> — detectar cambios no intencionados entre el borrador de un documento y su versión publicada</li>
      </ul>

      <h2>Cómo funcionan los algoritmos de diff</h2>
      <p>
        El problema principal que resuelve un algoritmo de diff es: dado dos secuencias A y B, encontrar
        el conjunto mínimo de ediciones (inserciones y eliminaciones) necesarias para transformar A en
        B. Esto es formalmente el problema de la Subsecuencia Común Más Larga (LCS). El diff luego
        reporta lo que no estaba en la LCS — las líneas exclusivas de A (eliminaciones) y las líneas
        exclusivas de B (inserciones).
      </p>
      <p>
        Dos algoritmos dominan las implementaciones prácticas:
      </p>
      <ul>
        <li>
          <strong>Myers diff (1986)</strong> — el algoritmo detrás del comando <code>diff</code> original
          de Unix y Git. Eugene Myers lo diseñó para encontrar el script de edición más corto (el diff
          con el menor número total de inserciones y eliminaciones) en tiempo O(ND), donde N es el
          tamaño total de ambas entradas y D es el número de diferencias. Es rápido y produce diffs
          mínimos, pero puede generar una salida contraintuitiva cuando se mueven grandes bloques de código.
        </li>
        <li>
          <strong>Patience diff</strong> — desarrollado por Bram Cohen (creador de BitTorrent) y usado
          por Bazaar, popularizado luego por Kaleidoscope. En lugar de trabajar línea por línea, el
          patience diff primero empareja las líneas únicas que aparecen exactamente una vez en ambos
          archivos. Esto produce una salida que preserva mucho mejor los límites de funciones y bloques
          que el Myers diff para código fuente. Git lo admite mediante{" "}
          <code>git diff --patience</code>.
        </li>
      </ul>

      <h2>Leer la salida de diff unificado</h2>
      <p>
        El formato de diff unificado es la salida estándar de <code>git diff</code> y la mayoría de
        las herramientas de diff. Una vez que entiendes la notación, se vuelve inmediatamente legible.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`--- a/config.yml       (archivo original)
+++ b/config.yml       (archivo modificado)
@@ -10,7 +10,8 @@     (cabecera de fragmento)
 server:
   host: localhost
-  port: 3000
+  port: 8080
+  timeout: 30
   debug: false`}
      </pre>
      <p>
        Los elementos clave que hay que leer:
      </p>
      <ul>
        <li><strong>Líneas que empiezan con <code>-</code></strong> — presentes en el original, eliminadas en la nueva versión (mostradas en rojo)</li>
        <li><strong>Líneas que empiezan con <code>+</code></strong> — no estaban en el original, añadidas en la nueva versión (mostradas en verde)</li>
        <li><strong>Líneas sin prefijo (espacio)</strong> — líneas de contexto sin cambios, mostradas para orientación</li>
        <li>
          <strong>La cabecera de fragmento <code>@@</code></strong> — se lee como "empezando en la línea 10,
          mostrando 7 líneas del original; empezando en la línea 10, mostrando 8 líneas de la nueva
          versión." El formato es <code>@@ -inicio,cantidad +inicio,cantidad @@</code>.
        </li>
      </ul>

      <h2>Diff a nivel de palabra vs. línea vs. carácter</h2>
      <p>
        La granularidad de un diff determina su utilidad para una tarea determinada.
      </p>
      <ul>
        <li>
          <strong>Diff a nivel de línea</strong> — el predeterminado para código fuente. Cada línea se
          trata como una unidad atómica. Rápido y apropiado para código donde las líneas son cortas y
          significativas. Si cambia una sola palabra en un párrafo largo, toda la línea aparece como
          modificada.
        </li>
        <li>
          <strong>Diff a nivel de palabra</strong> — apropiado para prosa y documentación. Las palabras
          cambiadas dentro de una línea se resaltan individualmente, dando una señal mucho más clara en
          documentos con mucho texto. La mayoría de las herramientas de comparación de documentos
          (Control de cambios de Microsoft Word, historial de versiones de Google Docs) operan a nivel
          de palabra.
        </li>
        <li>
          <strong>Diff a nivel de carácter</strong> — resalta los cambios de caracteres individuales
          dentro de las palabras. Más útil para detectar erratas sutiles, cambios de espacios en blanco,
          caracteres invisibles (espacios de ancho cero, espacios de no ruptura) o diferencias de
          codificación. Esencial para comparar datos que parecen idénticos visualmente pero difieren
          a nivel de bytes.
        </li>
      </ul>
      <p>
        La <a href="/tools/text-diff">Herramienta de Diferencias de Texto de BrowseryTools</a> resalta
        las diferencias en línea, facilitando detectar los cambios de un vistazo sin leer manualmente
        el formato de diff unificado.
      </p>

      <h2>Git diff bajo el capó</h2>
      <p>
        Cuando ejecutas <code>git diff</code>, Git calcula el Myers diff entre las versiones de objeto
        almacenadas en su base de datos de objetos. Algunos indicadores útiles cambian el comportamiento:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`git diff                      # cambios no preparados vs. último commit
git diff --staged             # cambios preparados vs. último commit
git diff HEAD~3               # estado actual vs. 3 commits atrás
git diff main...feature       # lo que la rama feature añade a main
git diff --word-diff          # resaltado a nivel de palabra
git diff --patience           # usa el algoritmo patience (mejor para código)
git diff --stat               # resumen: archivos cambiados, inserciones, eliminaciones`}
      </pre>
      <p>
        Sobre <code>git diff main...feature</code> específicamente: la notación de triple punto muestra
        lo que la rama feature ha añadido desde que divergió de main, excluyendo los cambios que hayan
        ocurrido en main desde el punto de bifurcación. Esto es casi siempre lo que quieres para la
        revisión de pull requests, en lugar del doble punto <code>main..feature</code> que compara
        directamente los extremos actuales de ambas ramas.
      </p>

      <h2>Casos de uso prácticos</h2>

      <h3>Comparar archivos de configuración</h3>
      <p>
        Los archivos de configuración (YAML, TOML, JSON, .env) son fuentes frecuentes de errores en
        producción cuando las versiones desplegadas divergen de las versiones controladas por versión.
        Antes de depurar un misterioso problema en producción, comparar la configuración en vivo con
        la configuración esperada a menudo revela la causa de inmediato.
      </p>

      <h3>Comparación de contratos y documentos</h3>
      <p>
        Cuando un borrador de contrato regresa de la otra parte, nunca confíes en un resumen de los
        cambios. Exporta ambas versiones a texto plano y ejecuta un diff. Los abogados suelen cambiar
        términos definidos, añadir límites de responsabilidad o alterar plazos de notificación de
        maneras que una lectura rápida no detecta. Un diff a nivel de palabra hace visible cada cambio.
      </p>

      <h3>Verificación de documentos traducidos</h3>
      <p>
        Cuando trabajas con contenido traducido, compara la estructura del documento traducido con la
        fuente. Un diff estructural de los encabezados de secciones y los recuentos de párrafos revela
        si alguna sección fue omitida o fusionada accidentalmente durante la traducción.
      </p>

      <h2>Comparativa de herramientas de diff</h2>
      <ul>
        <li><strong>git diff</strong> — integrado, a nivel de línea, formato de diff unificado, sin GUI. La base de referencia para todo trabajo con código.</li>
        <li><strong>vimdiff</strong> — diff en paralelo basado en terminal dentro de Vim. Potente para comparaciones rápidas sin salir del terminal; curva de aprendizaje pronunciada.</li>
        <li><strong>Beyond Compare</strong> — herramienta de escritorio comercial con sincronización de carpetas, diff binario y fusión a tres vías. El estándar de oro para la comparación de documentos no técnicos.</li>
        <li><strong>Meld</strong> — herramienta GUI de diff gratuita y multiplataforma con soporte de fusión a tres vías. La mejor alternativa gratuita a Beyond Compare.</li>
        <li><strong>BrowseryTools Text Diff</strong> — instantáneo, basado en navegador, sin instalación. Ideal para comparaciones puntuales rápidas, especialmente para texto que no querrías pegar en un servicio en línea.</li>
      </ul>
      <ToolCTA slug="text-diff" variant="card" />
    </div>
  );
}
