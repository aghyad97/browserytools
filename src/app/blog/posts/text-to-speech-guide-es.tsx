export default function Content() {
  return (
    <div>
      <p>
        Hay un superpoder silencioso escondido dentro de cada navegador moderno: puede leer texto en voz alta. Sin aplicación que
        instalar, sin suscripción, sin cuenta, sin subida de archivos. Si alguna vez has querido escuchar un artículo
        en lugar de leerlo, corregir un ensayo de oído o generar una locución rápida para un borrador, tu
        navegador ya tiene el motor para hacerlo — y la herramienta{" "}
        <a href="/tools/text-to-speech">Texto a Voz de BrowseryTools</a> convierte ese motor en una interfaz sencilla y
        gratuita que puedes usar en segundos.
      </p>

      <h2>Qué significa realmente "Texto a Voz"</h2>
      <p>
        El texto a voz (TTS) es el proceso de convertir palabras escritas en audio hablado. Escribes o pegas
        texto, eliges una voz y el ordenador sintetiza un habla de sonido natural. Es la misma familia de
        tecnología que impulsa los lectores de pantalla, los asistentes de voz y la narración de audiolibros. La diferencia aquí
        es que no necesitas ninguno de esos productos pesados — puedes leer texto en voz alta en línea gratis, directamente
        en la página que estás mirando ahora mismo.
      </p>
      <p>
        Nuestra herramienta está construida sobre la <strong>Web Speech API</strong>, un estándar del navegador expuesto a través de{" "}
        <code>window.speechSynthesis</code>. Cuando pulsas reproducir, el navegador entrega tu texto al
        motor de voz integrado del sistema operativo y reproduce el resultado por tus altavoces. Todo
        sucede localmente en tu dispositivo. Tu texto nunca se envía a un servidor, nunca se registra y nunca se almacena.
      </p>

      <h2>Cómo usar la herramienta de Texto a Voz</h2>
      <p>
        <strong>Paso 1 — Pega tu texto.</strong> Suelta cualquier texto en el cuadro: un correo, un párrafo de un
        documento, un guion, un párrafo en otro idioma. La entrada acepta pasajes largos, así que un artículo
        entero funciona bien.
      </p>
      <p>
        <strong>Paso 2 — Elige una voz.</strong> El selector de voz lista cada voz que tu navegador y
        sistema operativo ponen a disposición. En macOS verás las voces del sistema de Apple; en Windows verás
        las voces de Microsoft; en Chrome también puedes ver las voces en línea de Google. Hay disponibles muchos idiomas y
        acentos según tu configuración.
      </p>
      <p>
        <strong>Paso 3 — Ajusta velocidad, tono y volumen.</strong> Tres controles deslizantes te permiten dar forma a la entrega. La velocidad
        controla lo rápido que es el habla, desde una lectura lenta y pausada hasta un repaso ágil. El tono desplaza la voz
        más alta o más baja. El volumen establece la sonoridad independientemente del volumen de tu sistema. Hay valores predeterminados sensatos
        configurados para ti, y un botón de reinicio los restaura al instante.
      </p>
      <p>
        <strong>Paso 4 — Reproducir, pausar, reanudar, detener.</strong> Pulsa reproducir para empezar a leer texto en voz alta. Pausa para
        congelar a mitad de frase, reanuda para retomar donde lo dejaste, y detén para cancelar por completo. El estado
        actual se muestra siempre para que sepas si la herramienta está hablando, pausada o inactiva.
      </p>

      <h2>Por qué usar una herramienta de navegador en lugar de una app o un servicio de pago</h2>
      <p>
        <strong>Es genuinamente gratis.</strong> Muchos servicios de TTS en línea cobran por carácter o bloquean voces
        naturales tras un muro de pago. Como esta herramienta usa el motor de voz ya integrado en tu dispositivo,
        no hay nada que facturarte. Lee tanto como quieras, tan a menudo como quieras.
      </p>
      <p>
        <strong>Es privada.</strong> Las API de TTS de pago envían tu texto a un servidor remoto para sintetizarlo.
        Eso significa que tus palabras salen de tu máquina. Con el motor local del navegador, la síntesis sucede en
        tu propio dispositivo — ideal para documentos sensibles, borradores que no has publicado o cualquier cosa que
        preferirías no subir.
      </p>
      <p>
        <strong>Funciona en todas partes.</strong> La misma página funciona en Mac, Windows, Linux, Chromebook, iPhone,
        iPad y Android. No hay una versión separada que descargar, ni extensión que aprobar, ni inicio de sesión que
        recordar.
      </p>

      <h2>Formas prácticas en que la gente usa el Texto a Voz</h2>
      <p>
        <strong>Corregir de oído.</strong> Escuchar tu propia escritura leída de vuelta es una de las formas más rápidas
        de detectar frases torpes, palabras que faltan y oraciones interminables que tus ojos pasan por alto.
      </p>
      <p>
        <strong>Accesibilidad.</strong> Para personas con dislexia, baja visión o fatiga lectora, tener el texto
        leído en voz alta hace que el contenido largo sea mucho más accesible.
      </p>
      <p>
        <strong>Multitarea.</strong> Escucha un artículo o un correo largo mientras cocinas, te desplazas, doblas
        la ropa o descansas los ojos tras un largo día de pantalla.
      </p>
      <p>
        <strong>Aprendizaje de idiomas.</strong> Escucha cómo se pronuncian palabras y frases en un idioma objetivo
        cambiando a una voz para ese idioma y bajando la velocidad.
      </p>
      <p>
        <strong>Borradores y prototipos rápidos.</strong> Los diseñadores y desarrolladores pueden escuchar rápidamente cómo suena un guion
        o un prompt antes de comprometerse con una locución de producción completa.
      </p>

      <h2>Cosas que conviene saber sobre el habla del navegador</h2>
      <p>
        Las voces que ves dependen de tu navegador y sistema operativo, no de esta herramienta. Si quieres más
        voces o un idioma distinto, instala voces de sistema adicionales a través de los ajustes de tu sistema operativo y
        aparecerán automáticamente en el selector. Algunos navegadores exponen un puñado de voces; otros exponen
        decenas.
      </p>
      <p>
        Una limitación honesta: la Web Speech API reproduce audio pero no permite que una página web grabe o
        exporte de forma fiable. Por eso esta herramienta no ofrece opción de descarga o de guardar como audio — el navegador simplemente
        no proporciona una manera fiable de capturar el habla sintetizada. Si necesitas un archivo de audio exportable, una
        aplicación de TTS offline dedicada es la herramienta adecuada. Para escuchar, corregir y accesibilidad,
        el enfoque del navegador es más rápido y más amigable.
      </p>
      <p>
        Por último, si abres la herramienta en un navegador antiguo o inusual que carece de la Web Speech API, te lo
        dirá claramente en lugar de fallar en silencio. La gran mayoría de los navegadores actuales — Chrome, Edge,
        Safari y Firefox — la admiten.
      </p>

      <h2>Pruébalo ahora</h2>
      <p>
        Abre la <a href="/tools/text-to-speech">herramienta de Texto a Voz</a>, pega algo de texto, elige una voz y
        pulsa reproducir. Es gratis, privada e instantánea. Ya que estás aquí, explora el resto de BrowseryTools —
        desde un <a href="/tools/text-counter">contador de texto</a> y un{" "}
        <a href="/tools/text-case">conversor de mayúsculas y minúsculas</a> hasta un{" "}
        <a href="/tools/markdown-editor">editor de Markdown</a> — todos ejecutándose íntegramente en tu navegador, sin
        anuncios, sin rastreo y sin registro.
      </p>
    </div>
  );
}
