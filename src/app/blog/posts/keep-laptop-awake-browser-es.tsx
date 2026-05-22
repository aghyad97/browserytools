export default function Content() {
  return (
    <div>
      <p>
        Cada portátil y cada teléfono vienen con ajustes de suspensión que, en general, son algo positivo. Ahorran
        batería, reducen el calor y prolongan la vida útil de la pantalla. Pero hay momentos en que esos mismos
        ajustes se convierten en una pequeña tortura. Estás en mitad de una descarga de dos horas, viendo un
        vídeo formativo largo, dando una presentación, vigilando un panel de control o leyendo un artículo que
        exige tu atención, y de repente la pantalla se atenúa y el portátil empieza a deslizarse hacia la suspensión.
      </p>
      <p>
        La solución tradicional es engorrosa. En macOS la gente instala Amphetamine o Caffeine. En Windows ajustan
        la configuración de energía o usan una utilidad llamada PowerToys. En Linux rebuscan entre los flags de
        systemd. Cada una de estas soluciones requiere instalar algo, confiar en ello y, a menudo, pagar por ello o
        bucear por menús de ajustes escritos por y para administradores de sistemas.
      </p>
      <p>
        Existe una opción mucho más sencilla que casi nadie conoce: tu navegador ya puede hacer esto, en
        cualquier sistema operativo, sin instalar nada. Esa es exactamente la idea detrás de la herramienta{" "}
        <a href="/tools/keep-awake">Mantener Activo de BrowseryTools</a> — una sola pestaña que abres y un único
        botón que pulsas para evitar que tu pantalla se suspenda, sin aplicación, sin cuenta y sin configuración.
      </p>

      <h2>Cómo funciona Mantener Activo — la API Screen Wake Lock</h2>
      <p>
        Los navegadores modernos exponen un estándar web llamado{" "}
        <strong>Screen Wake Lock API</strong>. Cuando una página llama a{" "}
        <code>navigator.wakeLock.request("screen")</code>, el navegador le pide amablemente al sistema operativo que
        mantenga la pantalla encendida mientras la pestaña esté visible. El sistema operativo accede. Tu pantalla
        sigue iluminada, sin atenuación por tiempo de espera, sin suspensión automática, hasta que liberes el bloqueo
        o la pestaña quede oculta.
      </p>
      <p>
        Este es el mecanismo exacto que usan YouTube, Netflix y Google Maps cuando estás viendo un vídeo
        o navegando con indicaciones paso a paso. Es una primitiva a nivel de sistema operativo, bien soportada y
        consciente de la batería. No es un truco que mueve el ratón o reproduce audio en silencio: es una solicitud
        formal al sistema para mantener la pantalla viva.
        Chrome, Edge, Safari (en iOS 16.4+ y macOS) y Firefox la admiten todos hoy en día.
      </p>

      <h2>Por qué una herramienta de navegador supera a una aplicación nativa</h2>
      <p>
        Una vez que ves con qué facilidad puede hacer esto el navegador, el argumento para instalar una aplicación
        dedicada se viene abajo. Aquí tienes por qué el enfoque del navegador gana para una tarea como esta:
      </p>
      <p>
        <strong>Multiplataforma por defecto.</strong> Mac, Windows, Linux, Chromebook, iPad, iPhone, Android —
        la misma herramienta, el mismo comportamiento, la misma URL. No necesitas una versión para Mac, otra para
        Windows y otra para Android. Una sola página web lo hace todo.
      </p>
      <p>
        <strong>No requiere confianza alguna.</strong> Las apps nativas de "mantener activo" necesitan permiso para
        cambiar la configuración de energía, y muchas piden más acceso del que estrictamente necesitan. La herramienta
        del navegador necesita exactamente un permiso —el que te está pidiendo— y puedes revocarlo cerrando la pestaña.
      </p>
      <p>
        <strong>Sin fricción de instalación.</strong> Abre la URL, pulsa el botón, listo. Puedes guardarla en
        marcadores o anclarla a tu barra de pestañas. Puedes compartir el enlace con un compañero que tenga el mismo
        problema y podrá usarla en diez segundos.
      </p>
      <p>
        <strong>Respetuosa con la privacidad.</strong> La herramienta{" "}
        <a href="/tools/keep-awake">Mantener Activo de BrowseryTools</a> se ejecuta al 100% en tu navegador. No hay
        analíticas que rastreen lo que haces, ni cuenta a la que registrarse, ni servidor que sepa cuándo la activaste.
        Es una página estática que se comunica directamente con la API Wake Lock de tu navegador.
      </p>

      <h2>Opciones de duración — de 15 minutos al infinito</h2>
      <p>
        No todos los escenarios necesitan el mismo tiempo de espera. La herramienta Mantener Activo te ofrece una gama
        de ajustes predefinidos para que adaptes la duración a lo que realmente estás haciendo:
      </p>
      <p>
        <strong>15 minutos</strong> — ideal para lecturas cortas, una descarga rápida o una sola llamada de soporte.
        <br />
        <strong>30 minutos</strong> — suficiente para una ráfaga concentrada de trabajo profundo o un tutorial de duración media.
        <br />
        <strong>1 hora</strong> — perfecto para la mayoría de videollamadas, seminarios web o una sesión de trabajo de larga duración.
        <br />
        <strong>2 horas</strong> — presentaciones largas, sesiones de programación en pareja prolongadas o películas completas.
        <br />
        <strong>4 horas y 8 horas</strong> — para descargas nocturnas, ejecuciones de entrenamiento largas, eventos
        tipo conferencia o paneles que quieras vigilar todo el día.
        <br />
        <strong>Duración personalizada</strong> — escribe el número exacto de minutos u horas que quieras. 45 minutos, 90
        minutos, 3 horas, lo que se ajuste a la tarea.
        <br />
        <strong>Infinito</strong> — la opción nuclear. La pantalla permanece encendida hasta que pulses detener. Úsala
        cuando realmente no sepas cuánto tiempo necesitas, o cuando quieras supervisar un proceso largo y
        decidir más tarde.
      </p>
      <p>
        La cuenta atrás se muestra en directo en el título de la página, así que puedes cambiar a otra pestaña y echar
        un vistazo a tu barra de pestañas para ver cuánto tiempo queda. Cuando el temporizador expira, la herramienta
        libera el bloqueo de pantalla automáticamente y tu portátil vuelve a su comportamiento normal de suspensión —
        sin efectos secundarios persistentes.
      </p>

      <h2>Escenarios prácticos en los que realmente necesitas esto</h2>
      <p>
        <strong>Descargar un archivo grande o instalar un sistema operativo.</strong> Algunas operaciones se interrumpen
        si la máquina entra en suspensión. Activar Mantener Activo mientras se ejecuta una descarga de 40 GB garantiza
        que termine sin interrupciones.
      </p>
      <p>
        <strong>Presentar o compartir pantalla.</strong> Nada es más vergonzoso que tu portátil atenuándose
        a mitad de diapositiva durante una presentación importante a un cliente. Ajusta Mantener Activo a dos horas antes
        de empezar y el monitor del presentador se mantendrá brillante de principio a fin.
      </p>
      <p>
        <strong>Ver un vídeo largo o una emisión en directo.</strong> Si estás viendo la retransmisión de una conferencia,
        un oficio religioso, un seminario de formación o un evento familiar, el bloqueo de pantalla mantiene la pantalla
        encendida para que no tengas que mover el ratón cada pocos minutos.
      </p>
      <p>
        <strong>Vigilar un panel de control o un proceso de compilación.</strong> Los desarrolladores que vigilan pipelines
        de CI, paneles de incidencias, registros de servidor o pantallas de trading necesitan que la pantalla siga visible
        durante horas. El modo infinito está hecho a medida para esto.
      </p>
      <p>
        <strong>Leer un documento largo.</strong> Los contratos legales, los artículos de investigación y la documentación
        técnica merecen atención sin que la pantalla se desvanezca cada diez minutos. Cuarenta y cinco minutos de
        Mantener Activo te dan el tiempo de concentración que necesitas.
      </p>
      <p>
        <strong>Ejecutar una máquina virtual o una compilación larga.</strong> Si estás compilando código, ejecutando una
        batería de pruebas o entrenando un modelo pequeño, no querrás que el sistema operativo pause el trabajo porque el
        portátil creyó que te habías ido.
      </p>

      <h2>Cosas que conviene saber (y una cosa que no puede hacer)</h2>
      <p>
        La Screen Wake Lock API es un bloqueo de <em>pantalla</em>. Evita que la pantalla se atenúe y que el sistema
        operativo active la suspensión por inactividad. En la mayoría de portátiles, mantener la pantalla encendida también
        evita que la propia máquina se suspenda, porque el sistema solo se suspende cuando está inactivo, y una pantalla
        activa cuenta como actividad.
      </p>
      <p>
        Sin embargo, si físicamente <strong>cierras la tapa</strong>, la mayoría de sistemas operativos están configurados
        para suspenderse independientemente de lo que cualquier aplicación haya solicitado. Este es un comportamiento a nivel
        de hardware y ninguna herramienta de navegador puede anularlo. Si necesitas que el portátil siga activo con la tapa
        cerrada (por ejemplo, ejecutando un proceso largo mientras está enchufado), tendrás que cambiar la configuración de
        energía de tu sistema operativo por separado. Mantener Activo se encarga de todo lo demás.
      </p>
      <p>
        La otra sutileza es que el bloqueo de pantalla se libera automáticamente cuando la pestaña queda oculta. Esto
        es una salvaguarda de privacidad y batería incorporada en la API. La herramienta Mantener Activo de BrowseryTools
        está atenta a que la pestaña vuelva a ser visible y vuelve a adquirir el bloqueo automáticamente — así que si cambias
        de pestaña o de aplicación y vuelves, el modo mantener activo se reanuda sin interrupciones. La única forma de romperlo
        es cerrar o minimizar por completo todo el navegador.
      </p>

      <h2>Por qué sin descargas, sin anuncios, sin rastreo</h2>
      <p>
        Cada herramienta de BrowseryTools sigue la misma filosofía: ejecutarse íntegramente en el navegador, nunca subir
        datos, nunca requerir una cuenta, nunca mostrar anuncios. Mantener Activo es un ejemplo especialmente limpio. Literalmente
        no hay nada que enviar a ninguna parte. La herramienta le pide a tu navegador un permiso, el navegador se lo pide
        a tu sistema operativo, y esa es toda la transacción. No hay datos que te identifiquen, ni evento de analítica,
        ni telemetría. Abres la página, pulsas un botón y ocurre algo útil.
      </p>
      <p>
        Compara esto con el ecosistema típico de apps de "prevención de suspensión": buscas en la App Store o en la Play
        Store, encuentras decenas de aplicaciones con anuncios intrusivos, solicitudes de permisos que piden mucho más de lo
        que necesitan, y muros de pago por suscripción para funciones que una página web de 20 líneas puede ofrecer gratis.
      </p>

      <h2>Pruébalo ahora</h2>
      <p>
        Abre la <a href="/tools/keep-awake">herramienta Mantener Activo</a>, elige una duración —o selecciona Infinito si
        lo prefieres— y pulsa el gran botón verde. Tu portátil seguirá activo hasta que el temporizador termine o
        hasta que pulses detener. Sin instalación, sin cuenta, sin letra pequeña. Si te resulta útil, guárdala en marcadores o
        comparte el enlace con un amigo que tenga la misma frustración.
      </p>
      <p>
        Y ya que estás aquí, echa un vistazo. BrowseryTools tiene decenas de otras utilidades gratuitas y
        respetuosas con la privacidad que se ejecutan íntegramente en tu navegador — desde un{" "}
        <a href="/tools/pomodoro">temporizador Pomodoro</a> hasta un <a href="/tools/json-formatter">formateador de JSON</a>,
        un <a href="/tools/password-generator">generador de contraseñas</a>, un{" "}
        <a href="/tools/world-clock">reloj mundial</a> y mucho más. Todo es gratis, todo es local
        y nada te pide que te registres.
      </p>
    </div>
  );
}
