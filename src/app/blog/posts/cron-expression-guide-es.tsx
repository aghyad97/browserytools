import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Si alguna vez has desplegado una aplicación web, configurado un pipeline de CI/CD o administrado un servidor
        Linux, casi con toda seguridad te has topado con una expresión cron. Cinco asteriscos mirándote desde un archivo
        de configuración. Una cadena críptica como <code>0 2 * * 0</code> enterrada en un workflow de GitHub Actions. Una
        programación de AWS EventBridge que ya nadie del equipo entiende del todo. Las expresiones cron están por todas
        partes — y son realmente confusas si no te has tomado el tiempo de aprender el sistema que hay detrás.
      </p>
      <ToolCTA slug="cron-parser" variant="inline" />
      <p>
        Esta guía es la referencia que deberías guardar en marcadores. Cubre todo, desde la historia de cron y dónde
        aparece en la infraestructura moderna, hasta cada carácter especial, 10 ejemplos reales anotados, errores
        comunes y una tabla de referencia completa. Al final, serás capaz de leer cualquier expresión cron de un vistazo
        y escribir otras nuevas con confianza.
      </p>

      <h2>¿Qué es cron?</h2>
      <p>
        Cron es un programador de tareas basado en Unix que ejecuta comandos o scripts automáticamente en momentos e
        intervalos específicos. El nombre viene de <strong>Chronos</strong>, la personificación griega del tiempo — una
        elección acertada para una herramienta cuyo propósito entero es la automatización basada en el tiempo. El cron
        original se introdujo en{" "}
        <strong>la versión 7 de Unix en 1979</strong>, escrito por Ken Thompson en los Laboratorios Bell, y ha sido un
        elemento básico de los sistemas operativos tipo Unix desde entonces.
      </p>
      <p>
        El programador funciona leyendo archivos de configuración llamados <strong>crontabs</strong> (tablas cron) —
        archivos de texto plano donde cada línea define una tarea programada. Un proceso demonio en segundo plano
        (<code>crond</code>) se activa cada minuto, comprueba todos los crontabs activos y ejecuta cualquier tarea cuya
        programación coincida con la hora actual. Es un diseño bellamente simple que ha permanecido fundamentalmente
        inalterado durante más de cuatro décadas.
      </p>

      <h2>Dónde te encuentras cron hoy</h2>
      <p>
        Cron no es solo una reliquia del pasado de Unix. La sintaxis de las expresiones cron es el estándar de facto para
        expresar programaciones recurrentes en toda la pila de software moderna:
      </p>
      <ul>
        <li><strong>Crontab de Linux y macOS:</strong> el caso de uso original. Ejecuta <code>crontab -e</code> en
        cualquier máquina Linux o macOS para editar tu programación cron personal.</li>
        <li><strong>GitHub Actions:</strong> los archivos de workflow usan la sintaxis cron bajo el disparador
        <code>schedule:</code> para ejecutar pipelines de CI/CD de forma recurrente.</li>
        <li><strong>AWS EventBridge (antes CloudWatch Events):</strong> dispara funciones Lambda, tareas ECS y otros
        servicios de AWS según una programación usando una variante cron de 6 campos.</li>
        <li><strong>CronJobs de Kubernetes:</strong> el recurso <code>CronJob</code> ejecuta cargas de trabajo por lotes
        dentro de un clúster según una programación cron.</li>
        <li><strong>Pipelines de CI/CD:</strong> GitLab CI, CircleCI, Jenkins y Bitbucket Pipelines admiten ejecuciones
        programadas usando expresiones cron.</li>
        <li><strong>Vercel y Netlify:</strong> ambas plataformas admiten funciones serverless disparadas por cron para
        tareas como invalidación de caché, obtención de datos y compilaciones nocturnas.</li>
        <li><strong>Mantenimiento de bases de datos:</strong> la extensión <code>pg_cron</code> de PostgreSQL, el Event
        Scheduler de MySQL y los servicios de bases de datos gestionadas usan la sintaxis cron para tareas de vacuum,
        indexación y copias de seguridad.</li>
        <li><strong>Programadores a nivel de aplicación:</strong> librerías como node-cron, APScheduler (Python), Quartz
        (Java) y Sidekiq (Ruby) usan expresiones cron para definir tareas recurrentes en segundo plano.</li>
      </ul>
      <p>
        En resumen: si trabajas en cualquier área del desarrollo de software o la administración de sistemas, las
        expresiones cron son algo con lo que te encontrarás con regularidad. Aprenderlas una vez da dividendos en todas
        partes.
      </p>

      <h2>La estructura de cinco campos</h2>
      <p>
        Una expresión cron estándar consta de exactamente cinco campos separados por espacios, cada uno representando una
        unidad de tiempo. Juntos, definen cuándo debe ejecutarse una tarea. Aquí tienes la representación visual
        canónica:
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "20px 24px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7", margin: "24px 0"}}>{`┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12)
│ │ │ │ ┌───── day of week (0–7)
│ │ │ │ │
* * * * *`}</pre>
      <p>
        Leyendo de izquierda a derecha: minuto, hora, día del mes, mes, día de la semana. Un asterisco (<code>*</code>)
        en cualquier campo significa "todos los valores posibles para este campo". Así que <code>* * * * *</code>
        significa "cada minuto de cada hora de cada día" — la programación más permisiva posible.
      </p>

      <h3>Campo 1: minuto (0–59)</h3>
      <p>
        El campo de minuto controla en qué minuto(s) dentro de una hora se dispara una tarea. Un valor de <code>0</code>
        significa en punto, <code>30</code> significa a la media hora y <code>*</code> significa cada minuto. Este es el
        campo más granular del cron estándar — la unidad de programación más pequeña es un minuto.
      </p>

      <h3>Campo 2: hora (0–23)</h3>
      <p>
        El campo de hora usa el formato de 24 horas. <code>0</code> es medianoche, <code>9</code> son las 9 de la
        mañana, <code>17</code> son las 5 de la tarde y <code>23</code> son las 11 de la noche. No hay AM/PM — todo está
        en formato de 24 horas. Recuerda que cron siempre se ejecuta en la zona horaria del servidor a menos que se
        configure explícitamente de otra manera.
      </p>

      <h3>Campo 3: día del mes (1–31)</h3>
      <p>
        Controla en qué día(s) del mes se ejecuta una tarea. <code>1</code> es el primero, <code>15</code> es el día
        quince, <code>31</code> es el treinta y uno. Ten cuidado con valores como <code>31</code> — en meses con menos
        días (febrero, abril, junio, etc.), una tarea programada para el día 31 simplemente no se ejecutará ese mes.
        Algunas implementaciones admiten el carácter especial <code>L</code> para significar "último día del mes" sin
        importar cuántos días tenga el mes.
      </p>

      <h3>Campo 4: mes (1–12)</h3>
      <p>
        El campo de mes usa valores numéricos (1 para enero hasta 12 para diciembre) o abreviaturas de tres letras
        (<code>JAN</code>, <code>FEB</code>, <code>MAR</code>, <code>APR</code>, <code>MAY</code>, <code>JUN</code>,
        <code>JUL</code>, <code>AUG</code>, <code>SEP</code>, <code>OCT</code>, <code>NOV</code>, <code>DEC</code>)
        en la mayoría de las implementaciones. Un asterisco significa "cada mes".
      </p>

      <h3>Campo 5: día de la semana (0–7)</h3>
      <p>
        Este campo especifica en qué día(s) de la semana debe ejecutarse la tarea. La numeración aquí es una fuente
        común de confusión: <strong>tanto 0 como 7 representan el domingo</strong> en la mayoría de las implementaciones
        de cron (una peculiaridad heredada del diseño original de Unix). El lunes es 1, el martes es 2 y el sábado es 6.
        Las abreviaturas de tres letras
        (<code>SUN</code>, <code>MON</code>, <code>TUE</code>, <code>WED</code>, <code>THU</code>, <code>FRI</code>,
        <code>SAT</code>) son compatibles con la mayoría de las herramientas cron modernas.
      </p>
      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Importante:</strong> cuando se especifican tanto el día del mes como el día de la semana (no
        <code>*</code>), la mayoría de las implementaciones de cron los tratan como una condición OR — la tarea se
        ejecuta si cualquiera de las condiciones coincide. Este es un comportamiento sutil pero crítico que pilla
        desprevenidos a muchos desarrolladores.
      </div>

      <h2>Caracteres especiales</h2>
      <p>
        El verdadero poder de las expresiones cron viene de seis caracteres especiales que te permiten expresar
        programaciones complejas de forma concisa. Entenderlos es la clave para dominarlas.
      </p>

      <h3>* — Comodín (cada valor)</h3>
      <p>
        Un asterisco significa "coincide con todos los valores posibles de este campo". En el campo de minuto,
        <code>*</code> significa cada minuto (del 0 al 59). En el campo de mes, significa cada mes. Es el valor
        predeterminado de "no me importa este campo".
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`* * * * *    # Runs every single minute, all day, every day`}</pre>

      <h3>, — Lista (múltiples valores)</h3>
      <p>
        Una coma separa una lista de valores específicos. El campo coincide si la hora actual coincide con cualquier
        valor de la lista. Así es como programas una tarea para que se ejecute en varios momentos discretos sin usar un
        rango.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9,13,17 * * *    # Runs at 9:00 AM, 1:00 PM, and 5:00 PM every day
0 0 1,15 * *       # Runs at midnight on the 1st and 15th of every month`}</pre>

      <h3>- — Rango (de hasta)</h3>
      <p>
        Un guion define un rango inclusivo de valores. El campo coincide con cada valor entre el inicio y el final,
        inclusive. Esto es ideal para expresar cosas como "durante el horario laboral" o "entre semana".
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9-17 * * *      # Runs at the top of every hour from 9 AM through 5 PM
0 0 * * 1-5       # Runs at midnight every Monday through Friday`}</pre>

      <h3>/ — Paso (cada N unidades)</h3>
      <p>
        Una barra inclinada define un valor de paso. <code>*/5</code> significa "cada 5 unidades empezando desde el
        mínimo". También puedes combinarlo con un rango: <code>0-30/10</code> significa "cada 10 unidades entre 0 y 30"
        (es decir, 0, 10, 20, 30). Los pasos son uno de los caracteres especiales más usados.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 * * * *       # Every 5 minutes (0, 5, 10, 15, ... 55)
*/15 * * * *      # Every 15 minutes (0, 15, 30, 45)
0 */6 * * *       # Every 6 hours (0:00, 6:00, 12:00, 18:00)
0/15 * * * *      # Same as */15 — starts from 0, every 15 minutes`}</pre>

      <h3>L — Último (solo algunas implementaciones)</h3>
      <p>
        El carácter <code>L</code> es compatible con algunas implementaciones de cron (en particular Quartz Scheduler en
        Java y algunas variantes de cron de Linux) para significar "último". En el campo de día del mes, <code>L</code>
        significa el último día del mes actual — sea el 28, 29, 30 o 31. Resuelve el problema de programar tareas de
        "fin de mes" sin conocer de antemano la duración del mes.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 L * *         # Midnight on the last day of every month (Quartz/some crons)`}</pre>

      <h3>? — Sin valor específico (cron de Quartz/Java)</h3>
      <p>
        El signo de interrogación se usa en Quartz Scheduler (Java) y algunas otras herramientas cuando quieres
        especificar un día de la semana sin especificar también un día del mes, o viceversa. Como no tiene sentido
        lógico especificar ambos (digamos "el día 15 Y un miércoles"), uno de ellos debe establecerse en <code>?</code>
        para indicar "no me importa". El cron estándar de Unix no usa este carácter — en su lugar usas <code>*</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 15 * ?        # Quartz: 9 AM on the 15th, day-of-week unspecified
0 9 ? * MON       # Quartz: 9 AM every Monday, day-of-month unspecified`}</pre>

      <h2>10 ejemplos reales de cron</h2>
      <p>
        La mejor manera de afianzar tu comprensión es estudiar ejemplos reales con el contexto de por qué se eligió cada
        programación. Aquí tienes diez patrones con los que te encontrarás (y que usarás) con regularidad.
      </p>

      <h3>1. Cada día laborable a las 9:00</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 * * 1-5`}</pre>
      <p>
        El minuto es <code>0</code> (en punto), la hora es <code>9</code> (9 de la mañana), el día del mes y el mes son
        comodines, y el día de la semana es <code>1-5</code> (de lunes a viernes). Se usa para recordatorios de daily
        standup, correos de informes enviados al inicio del día laboral y tareas de sincronización de datos matutinas que
        no deberían ejecutarse en fin de semana.
      </p>

      <h3>2. Cada 15 minutos</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/15 * * * *`}</pre>
      <p>
        La sintaxis de paso <code>*/15</code> en el campo de minuto te da ejecuciones a los 0, 15, 30 y 45 minutos de
        cada hora, las 24 horas. Común para pings de comprobación de estado, precalentamiento de caché, reintentos de
        webhooks y cualquier tarea de sondeo casi en tiempo real donde necesitas frescura pero el tiempo real auténtico
        es excesivo o no está disponible.
      </p>

      <h3>3. Cada día a medianoche</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 * * *`}</pre>
      <p>
        Minuto 0, hora 0, todo lo demás comodín. Este es uno de los patrones cron más comunes que existen. Se usa para la
        generación de informes diarios, rotación de logs, archivado de bases de datos, limpieza de archivos temporales,
        envío de correos de resumen diario y cualquier tarea de "una vez al día" que deba ejecutarse fuera del horario
        laboral.
      </p>

      <h3>4. Primer día de cada mes a medianoche</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 * *`}</pre>
      <p>
        El día del mes es <code>1</code>, todo lo demás es comodín (excepto el minuto/hora fijos). Esto se ejecuta el 1
        de enero, el 1 de febrero, el 1 de marzo, etc. La programación de referencia para la generación de facturas
        mensuales, los disparadores de ciclos de facturación, las renovaciones de suscripciones SaaS y los resúmenes
        analíticos mensuales.
      </p>

      <h3>5. Cada domingo a las 2:00</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 2 * * 0`}</pre>
      <p>
        El día de la semana <code>0</code> es domingo, y la hora <code>2</code> son las 2 de la madrugada — un momento en
        que el tráfico suele estar en su nivel más bajo. Se usa para copias de seguridad completas semanales de la base
        de datos, regeneración del sitemap, reindexación de contenido para la búsqueda y trabajos pesados de
        procesamiento por lotes que afectarían al rendimiento durante la semana.
      </p>

      <h3>6. Días laborables a las 8:30, 12:30 y 17:30</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`30 8,12,17 * * 1-5`}</pre>
      <p>
        Esto combina una lista en el campo de hora con un rango en el campo de día de la semana. El minuto <code>30</code>
        significa que se dispara en la marca de la media hora. Se usa para lotes de notificaciones programadas
        (notificaciones push, resúmenes por correo), tareas de sincronización de datos tres veces al día y cualquier
        flujo de trabajo donde quieras puntos de contacto regulares a lo largo del día laboral sin machacar cada hora.
      </p>

      <h3>7. 1 de enero a medianoche</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 1 *`}</pre>
      <p>
        El día del mes <code>1</code> y el mes <code>1</code> (enero) juntos fijan esto al Día de Año Nuevo. Se usa para
        tareas anuales como renovaciones de suscripciones anuales, archivado de los datos del año anterior, generación de
        informes de cumplimiento anuales y restablecimiento de cuotas o contadores anuales en las aplicaciones.
      </p>

      <h3>8. Cada 5 minutos durante el horario laboral entre semana</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 9-17 * * 1-5`}</pre>
      <p>
        Una expresión compuesta que combina un paso (<code>*/5</code>), un rango en horas (<code>9-17</code>) y un rango
        en el día de la semana (<code>1-5</code>). Esto te da una monitorización o sondeo agresivo — cada 5 minutos de 9
        de la mañana a 5 de la tarde de lunes a viernes — mientras se mantiene en silencio por la noche y los fines de
        semana para ahorrar recursos y evitar la fatiga de alertas.
      </p>

      <h3>9. Cada 6 horas</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 */6 * * *`}</pre>
      <p>
        El paso en el campo de hora (<code>*/6</code>) da cuatro ejecuciones espaciadas uniformemente al día:
        medianoche, 6 de la mañana, mediodía y 6 de la tarde. Se usa para la sincronización de datos entre sistemas, la
        renovación de tokens de API o credenciales OAuth de larga duración antes de que expiren, y la invalidación
        periódica de caché para contenido que cambia unas pocas veces al día pero no necesita frescura a nivel de minuto.
      </p>

      <h3>10. Día 15 y último día de cada mes</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 15,L * *`}</pre>
      <p>
        Una lista con comas en el campo de día del mes que combina una fecha fija (<code>15</code>) y la abreviatura de
        último día (<code>L</code>). Esta es la clásica programación de nómina quincenal — periodos de pago que terminan
        el día 15 y el último día del mes. Ten en cuenta que <code>L</code> requiere una implementación que lo admita
        (Quartz, algunos crons de Linux); el crontab estándar no admite <code>L</code>.
      </p>

      <h2>Errores comunes y trampas</h2>
      <p>
        Las expresiones cron tienen varias trampas bien conocidas que provocan incidentes en producción. Entenderlas de
        antemano te ahorrará una dolorosa sesión de depuración a las 2 de la madrugada.
      </p>

      <h3>La numeración del día de la semana no es universal</h3>
      <p>
        La mayoría de las implementaciones de cron de Unix tratan tanto <code>0</code> como <code>7</code> como domingo.
        Pero algunas herramientas (incluidas ciertas librerías a nivel de aplicación) empiezan la semana en lunes,
        haciendo que <code>1</code> = lunes y <code>7</code> = domingo. Verifica siempre la convención de numeración de
        la herramienta específica que estás usando, y prefiere usar abreviaturas de tres letras (<code>MON</code>,
        <code>TUE</code>, etc.) cuando la implementación las admita para eliminar la ambigüedad.
      </p>

      <h3>Cron se ejecuta en la zona horaria del servidor</h3>
      <p>
        Esta es probablemente la fuente más común de errores de cron en producción. <code>0 9 * * *</code> significa las
        9 de la mañana en <em>la zona horaria de la máquina que ejecuta la tarea</em> — que puede ser UTC, US/Eastern o
        cualquier otra. Documenta siempre la suposición de zona horaria en un comentario junto a la expresión cron. Para
        los programadores en la nube, configura explícitamente la zona horaria si la plataforma lo admite.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# Good practice: always document the timezone
# Runs at 9 AM US/Eastern (UTC-5 or UTC-4 during DST)
0 14 * * 1-5   # 9 AM ET expressed in UTC`}</pre>

      <h3>El cron de GitHub Actions siempre se ejecuta en UTC</h3>
      <p>
        GitHub Actions usa la sintaxis cron estándar de 5 campos bajo la clave <code>on: schedule:</code>, pero el
        programador siempre opera en UTC — no hay opción de configuración de zona horaria. Si quieres que una tarea se
        ejecute a las 9 de la mañana hora del Este, necesitas programarla en <code>0 14 * * *</code> (UTC). Ten en cuenta
        también que los workflows programados de GitHub Actions pueden ejecutarse hasta 15 minutos tarde durante
        periodos de alta demanda.
      </p>

      <h3>La sintaxis de paso se aplica a su campo, no a los minutos</h3>
      <p>
        Una mala lectura común: <code>*/5</code> en el campo de <em>hora</em> significa cada 5 horas — no cada 5 minutos.
        El paso siempre se aplica a la unidad del campo en el que está. <code>*/5</code> en el campo de minuto es cada 5
        minutos; en el campo de hora, cada 5 horas; en el campo de mes, cada 5 meses.
      </p>

      <h3>Las tareas que duran más que su intervalo pueden superponerse</h3>
      <p>
        Cron es un programador de "dispara y olvida". Si programas una tarea cada 5 minutos y una instancia de la tarea
        tarda 7 minutos en completarse, una segunda instancia se iniciará mientras la primera todavía se está
        ejecutando. Esto puede causar condiciones de carrera, procesamiento duplicado y corrupción de datos. Usa un
        bloqueo de archivo o un bloqueo consultivo en tu base de datos para evitar la ejecución concurrente de la misma
        tarea.
      </p>

      <h3>Los campos omitidos y los comodines no siempre son equivalentes</h3>
      <p>
        En algunas implementaciones extendidas de cron (en particular Quartz), omitir un campo y usar <code>*</code>
        se tratan de forma diferente. Usa siempre todos los campos requeridos de forma explícita y nunca confíes en los
        valores predeterminados para programaciones críticas de producción.
      </p>

      <h2>Extensiones no estándar: cron de 6 campos</h2>
      <p>
        El cron estándar de Unix tiene cinco campos, con el minuto como la granularidad más fina. Varios sistemas
        extienden esto con campos adicionales:
      </p>

      <h3>Campo de segundos (al principio)</h3>
      <p>
        Muchos programadores a nivel de aplicación (node-cron, Quartz, Spring Scheduler) añaden un <strong>campo de
        segundos al principio</strong>, dándote 6 campos. Esto permite una programación por debajo del minuto hasta el
        segundo. Los campos son: <code>second minute hour day-of-month month day-of-week</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# 6-field cron with seconds prepended (Quartz / node-cron)
0 */5 * * * *    # Every 5 minutes (second=0, minute=*/5, ...)
30 0 9 * * 1-5   # Weekdays at 9:00:30 AM`}</pre>

      <h3>AWS EventBridge (6 campos con año)</h3>
      <p>
        AWS EventBridge usa un formato de 6 campos donde se <strong>añade un campo de año al final</strong>:
        <code>minute hour day-of-month month day-of-week year</code>. También requiere usar <code>?</code>
        para el día del mes o el día de la semana (nunca ambos como comodines a la vez). AWS EventBridge no admite la
        sintaxis de paso <code>*/</code> de la misma manera que el cron de Unix.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# AWS EventBridge cron format (6 fields, year at end)
cron(0 9 ? * MON-FRI *)    # Weekdays at 9 AM UTC, any year
cron(0 0 1 * ? *)           # First day of every month at midnight`}</pre>
      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Consejo rápido:</strong> al copiar una expresión cron entre plataformas, verifica siempre el número de
        campos y cualquier diferencia de sintaxis específica de la plataforma. Una expresión cron válida de Unix puede
        ser inválida (o significar algo diferente) en AWS EventBridge, Quartz o un contexto de node-cron.
      </div>

      <h2>Cómo usar el Analizador de cron de BrowseryTools</h2>
      <p>
        Escribir una expresión cron desde cero es una habilidad — validar que la escribiste correctamente es otra. El
        <a href="/tools/cron-parser">Analizador de cron de BrowseryTools</a> hace que sea trivial verificar cualquier
        expresión antes de que se acerque a producción.
      </p>
      <p>Pega cualquier expresión cron de 5 campos (o de 6 campos) en la herramienta y obtén al instante:</p>
      <ul>
        <li>Una <strong>descripción legible para humanos</strong> de la programación ("Cada día laborable a las 9:00")
        para que puedas verificar de un vistazo que tu intención coincide con tu expresión.</li>
        <li>Los <strong>próximos 5-10 momentos de ejecución programados</strong> listados explícitamente, para que veas
        exactamente cuándo se disparará la tarea y confirmes que no hay sorpresas.</li>
        <li>Retroalimentación instantánea sobre <strong>sintaxis inválida</strong> — útil si tienes una errata o estás
        trabajando con una expresión que escribió otra persona.</li>
      </ul>
      <p>
        Todo se ejecuta por completo en tu navegador — ninguna expresión se envía a ningún servidor. Es la forma más
        rápida de comprobar la cordura de una programación antes de desplegarla en GitHub Actions, Kubernetes o cualquier
        otra plataforma.
      </p>

      <h2>Tabla de referencia de expresiones cron</h2>
      <p>
        Usa esta tabla como referencia rápida. Guarda esta página en marcadores y vuelve a ella siempre que necesites
        consultar un patrón o verificar qué significa una expresión.
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap"}}>Expresión</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Significado legible</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Caso de uso típico</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>* * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Cada minuto</td>
              <td style={{padding: "12px 16px"}}>Sondeo de alta frecuencia, pruebas</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Cada 5 minutos</td>
              <td style={{padding: "12px 16px"}}>Comprobaciones de estado, precalentamiento de caché</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/15 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Cada 15 minutos</td>
              <td style={{padding: "12px 16px"}}>Sincronización de datos, reintentos de webhooks</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Cada hora en punto</td>
              <td style={{padding: "12px 16px"}}>Agregaciones por hora, llamadas a API</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 */6 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Cada 6 horas</td>
              <td style={{padding: "12px 16px"}}>Renovación de tokens, sincronización de datos</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Cada día a medianoche</td>
              <td style={{padding: "12px 16px"}}>Informes diarios, rotación de logs</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 9 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Días laborables a las 9:00</td>
              <td style={{padding: "12px 16px"}}>Tareas en horario laboral, recordatorios</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 2 * * 0</code></td>
              <td style={{padding: "12px 16px"}}>Cada domingo a las 2:00</td>
              <td style={{padding: "12px 16px"}}>Copias de seguridad semanales, mantenimiento</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 * *</code></td>
              <td style={{padding: "12px 16px"}}>El primero de cada mes a medianoche</td>
              <td style={{padding: "12px 16px"}}>Facturas mensuales, facturación</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1,15 * *</code></td>
              <td style={{padding: "12px 16px"}}>Día 1 y 15 de cada mes</td>
              <td style={{padding: "12px 16px"}}>Nómina quincenal</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 1 *</code></td>
              <td style={{padding: "12px 16px"}}>1 de enero a medianoche</td>
              <td style={{padding: "12px 16px"}}>Tareas anuales, reinicio anual</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>30 8,12,17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Días laborables a las 8:30, 12:30, 17:30</td>
              <td style={{padding: "12px 16px"}}>Lotes de notificaciones</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 9-17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Cada 5 min en horario laboral (entre semana)</td>
              <td style={{padding: "12px 16px"}}>Monitorización activa, sondeo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Valida tus expresiones cron antes de desplegar</h2>
      <p>
        Las expresiones cron son compactas y potentes, pero su concisión significa que una sola errata puede producir
        silenciosamente una programación completamente diferente. Una tarea que pretendías ejecutar mensualmente podría
        ejecutarse a diario. Una copia de seguridad que querías disparar cada domingo podría no ejecutarse nunca. El
        coste de una programación incorrecta en producción puede ir desde un informe perdido hasta una tarea de
        facturación que se dispara cientos de veces.
      </p>
      <p>
        El hábito de dos minutos de pegar tu expresión en un validador y revisar los próximos momentos de ejecución
        programados antes de desplegar es una de las prácticas de mayor valor en DevOps e ingeniería de backend. Detecta
        los errores antes de que se conviertan en incidentes.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Valida cualquier expresión cron al instante — gratis, privado, en el navegador
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Pega tu expresión, obtén una descripción legible para humanos y mira los próximos momentos de ejecución
          programados. Nada sale de tu navegador.
        </p>
        <a
          href="/tools/cron-parser"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Abrir el Analizador de cron →
        </a>
      </div>
      <ToolCTA slug="cron-parser" variant="card" />
    </div>
  );
}
