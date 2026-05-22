export default function Content() {
  return (
    <div>
      <p>
        Programar una reunión a través de zonas horarias parece sencillo hasta que lo has hecho
        unas cuantas veces. La persona que dijo "quedemos a las 9 de la mañana, hora mía" no mencionó
        su zona horaria. Alguien movió una reunión "una hora antes" la semana antes de un cambio
        de horario de verano, y llegó a la hora incorrecta para la mitad del equipo. Un desarrollador
        almacenó las marcas de tiempo en hora local y ahora la base de datos es un desastre de
        entradas ambiguas.
      </p>
      <p>
        Las zonas horarias son uno de esos sistemas que parecen intuitivos hasta que dejan de serlo,
        y los casos extremos causan problemas reales. Esta guía explica cómo funciona el sistema,
        dónde falla, cómo los equipos remotos pueden evitar los errores de programación más comunes,
        y los estándares que hacen manejable el trabajo entre zonas horarias.
      </p>
      <p>
        Puedes usar el{" "}
        <a href="/tools/timezone-converter">Conversor de Zonas Horarias de BrowseryTools</a> —
        gratuito, sin registro, todo permanece en tu navegador.
      </p>

      <h2>Cómo Funcionan las Zonas Horarias: Los Desplazamientos UTC Explicados</h2>
      <p>
        Las zonas horarias se definen como desplazamientos respecto al Tiempo Universal Coordinado
        (UTC) — el sucesor moderno del Tiempo Medio de Greenwich (GMT). El propio UTC no tiene
        desplazamiento: UTC+0. Todas las demás zonas horarias se definen como UTC más o menos
        un número de horas (y a veces minutos).
      </p>
      <p>
        Nueva York es UTC-5 en invierno (Hora Estándar del Este) y UTC-4 en verano (Hora de Verano
        del Este). Londres es UTC+0 en invierno y UTC+1 en verano (Hora de Verano Británica). Tokio
        es UTC+9 durante todo el año. Sídney alterna entre UTC+10 y UTC+11 dependiendo de si está
        observando el horario de verano — que va de octubre a abril en el hemisferio sur, opuesto
        al hemisferio norte.
      </p>
      <p>
        Para complicar aún más las cosas: no todos los desplazamientos de zona horaria son en horas
        enteras. India es UTC+5:30. Nepal es UTC+5:45. Irán es UTC+3:30. La Hora Estándar Central
        de Australia es UTC+9:30. Estos desplazamientos fraccionarios existen por razones históricas,
        políticas o geográficas y sorprenden a quienes dan por sentado que todas las zonas son de
        horas enteras.
      </p>

      <h2>El Horario de Verano: Por Qué Lo Complica Todo</h2>
      <p>
        El Horario de Verano (DST) es la práctica de adelantar los relojes una hora en primavera y
        atrasarlos una hora en otoño para trasladar las horas de luz solar a la tarde. Lo observan
        aproximadamente 70 países, lo ignoran el resto, y las transiciones no se producen en la
        misma fecha en todo el mundo.
      </p>
      <p>
        EE. UU. y Canadá cambian el segundo domingo de marzo y el primer domingo de noviembre. La
        mayor parte de Europa cambia el último domingo de marzo y el último domingo de octubre. Esto
        crea una ventana de tres semanas en marzo y una de una semana en noviembre en la que el
        desplazamiento entre, digamos, Nueva York y Londres es diferente al del resto del año. Una
        llamada semanal fija "a las 2 pm, hora de Nueva York" puede caer a las 6 pm en Londres durante
        48 semanas y a las 7 pm durante 4 semanas — sorprendiendo a la gente cada vez.
      </p>
      <p>
        Algunos lugares no observan el DST: Arizona (excepto la Nación Navajo), Hawái, la mayor parte
        de África, Japón, China, India y gran parte del Sudeste Asiático. La UE votó para abolir el
        DST en 2019 pero la implementación se ha aplazado indefinidamente. Hasta que haya una
        resolución permanente, la complejidad no desaparecerá.
      </p>

      <h2>Por Qué Programar Entre Zonas Horarias Es Propenso a Errores</h2>
      <p>
        Los modos de fallo están bien documentados:
      </p>
      <ul>
        <li>
          <strong>Asumir que el desplazamiento UTC es estable durante todo el año</strong> — Las
          transiciones de DST significan que el desplazamiento cambia dos veces al año en la mayoría
          de los países. Una invitación de calendario creada en enero con un desplazamiento UTC
          codificado será incorrecta después de la transición de DST de marzo.
        </li>
        <li>
          <strong>"Las 9 am en tu horario"</strong> — Esta frase es ambigua a menos que el hablante
          especifique explícitamente la zona horaria. ¿Su zona horaria o la tuya? No siempre está
          claro quién habla.
        </li>
        <li>
          <strong>Inconsistencia del software de calendario</strong> — Google Calendar, Outlook y
          Apple Calendar muestran las zonas horarias de forma diferente. Un evento creado en una
          aplicación de calendario y compartido por correo electrónico no siempre se convierte
          correctamente en la aplicación del destinatario, especialmente entre distintos formatos
          de invitaciones a reuniones.
        </li>
        <li>
          <strong>Países con desplazamientos no estándar</strong> — Invitar a alguien en Katmandú
          (UTC+5:45) o Teherán (UTC+3:30) a una reunión especificada en UTC de horas enteras producirá
          un desplazamiento fraccionario que muchas herramientas simples no manejan correctamente.
        </li>
        <li>
          <strong>Cruce de la línea de cambio de fecha</strong> — Una reunión a las 9 pm UTC un
          martes es miércoles en Tokio (UTC+9). Equivocarse en la fecha al especificar reuniones
          cerca de la medianoche UTC es un error frecuente.
        </li>
      </ul>

      <h2>Mejores Prácticas para la Programación de Equipos Remotos</h2>
      <p>
        Los equipos que trabajan entre zonas horarias han convergido en varias prácticas que reducen
        drásticamente los errores de programación:
      </p>
      <ul>
        <li>
          <strong>Especifica siempre la zona horaria explícitamente.</strong> Nunca digas "las 3 pm"
          sin una zona horaria. "Las 3 pm UTC" es inequívoco. "Las 3 pm ET" es parcialmente ambiguo
          (¿EST o EDT?). "Las 3 pm hora del Este" es mejor pero aún ambiguo durante las semanas de
          transición. "15:00 UTC" es completamente inequívoco para cualquiera que conozca su
          desplazamiento UTC.
        </li>
        <li>
          <strong>Usa UTC como hora de referencia del equipo en comunicaciones internas.</strong>
          Al hablar de horarios internamente, ancla todo a UTC. "El despliegue es a las 14:00 UTC"
          es algo que cada miembro del equipo puede convertir a su hora local de forma independiente
          y correcta.
        </li>
        <li>
          <strong>Usa herramientas que muestren múltiples zonas horarias simultáneamente.</strong>
          Un reloj mundial que muestre UTC, la hora local actual de cada miembro del equipo y el
          desplazamiento facilita la comprobación a simple vista sin aritmética mental. El{" "}
          <a href="/tools/timezone-converter">Conversor de Zonas Horarias de BrowseryTools</a> te
          permite comparar múltiples ciudades al instante.
        </li>
        <li>
          <strong>Programa reuniones "inconvenientes" de forma rotativa.</strong> Para equipos
          distribuidos globalmente donde no hay un horario cómodo para todos, rota el turno
          inconveniente en lugar de requerir que siempre sean los mismos miembros del equipo
          quienes se conecten a las 7 am o a las 10 pm. Documenta la rotación para que sea
          transparente.
        </li>
        <li>
          <strong>Evita programar cerca de las fechas de transición de DST.</strong> En las dos
          semanas alrededor de finales de octubre y finales de marzo, comprueba dos veces las
          suposiciones sobre desplazamientos antes de enviar invitaciones a participantes
          internacionales.
        </li>
      </ul>

      <h2>ISO 8601: El Formato de Fecha y Hora Que Elimina la Ambigüedad</h2>
      <p>
        ISO 8601 es un estándar internacional para representar fechas y horas de una forma que es
        inequívoca y se ordena correctamente como texto. El formato es:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        YYYY-MM-DDTHH:MM:SSZ (o +HH:MM para desplazamiento)
      </p>
      <ul>
        <li><code>2026-03-15T14:30:00Z</code> — 15 de marzo de 2026, 14:30 UTC</li>
        <li><code>2026-03-15T14:30:00+05:30</code> — 15 de marzo de 2026, 14:30 Hora Estándar de India</li>
        <li><code>2026-03-15T14:30:00-07:00</code> — 15 de marzo de 2026, 14:30 Hora de Verano de Montaña</li>
      </ul>
      <p>
        La "T" separa la fecha de la hora. La "Z" final significa UTC (hora Zulú). Un desplazamiento
        +/- especifica la hora local y cuánto se aleja de UTC.
      </p>
      <p>
        ISO 8601 se usa en todas las API modernas, estándares web (atributos datetime de HTML,
        cabeceras HTTP) y en la mayoría de las bibliotecas de fechas de los lenguajes de programación.
        Para la comunicación humana, el formato de fecha "YYYY-MM-DD" — incluso sin el componente de
        hora — es útil porque se ordena correctamente y es inequívoco internacionalmente. "03/04/2026"
        es el 3 de abril en EE. UU. y el 4 de marzo en el RU. "2026-03-04" es inequívoco.
      </p>

      <h2>Gestión de Zonas Horarias en Código: Almacena Siempre en UTC</h2>
      <p>
        La regla más importante para los desarrolladores que trabajan con marcas de tiempo:
        <strong> almacena todas las marcas de tiempo en UTC en tu base de datos.</strong> Siempre.
        Sin excepción.
      </p>
      <p>
        Almacenar marcas de tiempo en hora local crea una clase de errores difíciles de reproducir,
        difíciles de diagnosticar y costosos de corregir a escala:
      </p>
      <ul>
        <li>Cuando tu servidor cambia de zona horaria (como ocurre con las migraciones de proveedores en la nube), todas las marcas de tiempo históricas son repentinamente incorrectas</li>
        <li>Las transiciones de DST crean marcas de tiempo ambiguas — la 1:30 am ocurre dos veces el día en que los relojes se atrasan</li>
        <li>Ordenar eventos cronológicamente se vuelve poco fiable cuando las marcas de tiempo mezclan diferentes desplazamientos</li>
        <li>Las consultas entre zonas horarias (encontrar todos los eventos entre medianoche y medianoche) se convierten en combinaciones complejas en lugar de simples consultas de rango</li>
      </ul>
      <p>
        El patrón correcto: almacena UTC, muestra hora local. Acepta la entrada del usuario en su
        hora local, conviértela a UTC inmediatamente, almacena UTC, convierte de vuelta a la hora
        local del usuario para mostrarlo. La capa de base de datos nunca debería necesitar saber
        nada sobre zonas horarias.
      </p>
      <p>
        Usa la base de datos de zonas horarias de IANA (la "base de datos tz" o "base de datos de
        Olson") para los datos de zonas horarias en el código en lugar de mantener manualmente los
        desplazamientos UTC. La base de datos de IANA se actualiza cuando los países cambian sus
        reglas de DST o sus desplazamientos — lo cual ocurre con más frecuencia de lo que esperarías.
        Referencia las zonas horarias por identificador de IANA (p. ej., "America/New_York",
        "Asia/Kolkata") no por desplazamiento (p. ej., "UTC-5"), porque los identificadores manejan
        correctamente las transiciones de DST mientras que los desplazamientos fijos no lo hacen.
      </p>

      <div style={{background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Conversor de Zonas Horarias Gratuito — Compara Ciudades, Encuentra Solapamientos
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Convierte horas entre múltiples ciudades al instante, con gestión automática del DST,
          y encuentra el horario de reunión ideal para tu equipo remoto.
        </p>
        <a
          href="/tools/timezone-converter"
          style={{background: "rgba(139,92,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Conversor de Zonas Horarias →
        </a>
      </div>
    </div>
  );
}
