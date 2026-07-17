import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        De vez en cuando necesitas un árbitro imparcial. ¿Quién paga el almuerzo? ¿Qué nombre gana
        el sorteo? ¿En qué orden debe presentar el equipo? ¿Quién empieza en el juego de mesa?
        Recurrir a un dado físico, una moneda del bolsillo o apuntar nombres en trozos de papel
        funciona — pero es lento, fácil de hacer trampas y la mitad de las veces ni siquiera tienes
        una moneda encima. Un{" "}
        <a href="/tools/random-picker">selector aleatorio</a> en tu navegador resuelve todo eso en
        una sola pestaña.
      </p>
      <ToolCTA slug="random-picker" variant="inline" />
      <p>
        El <strong>Selector Aleatorio</strong> de BrowseryTools agrupa cuatro sorteadores clásicos
        en una sola página: un <strong>generador de números aleatorios</strong>, un{" "}
        <strong>lanzador de dados</strong>, un{" "}
        <strong>lanzamiento de moneda</strong> y un <strong>selector de nombres aleatorio</strong>{" "}
        (estilo ruleta) para sorteos y regalos. Todo funciona localmente en tu navegador — no hay
        ningún servidor decidiendo el resultado, sin cuenta y sin anuncios. Esta guía repasa cada
        modo y los pequeños detalles que hacen que un selector aleatorio sea realmente justo.
      </p>

      <h2>El Generador de Números Aleatorios</h2>
      <p>
        La petición más común es también la más sencilla: dame un número entre X e Y. El generador
        de números aleatorios te permite establecer un <strong>mínimo</strong> y un{" "}
        <strong>máximo</strong>, elegir <strong>cuántos</strong> números quieres a la vez y decidir
        si se permiten duplicados. Ese último interruptor importa más de lo que la gente espera. Si
        estás eligiendo tres boletos de rifa entre cien, casi seguro que quieres números únicos — no
        quieres que el boleto 47 gane dos veces. Si estás simulando dados o generando datos de prueba,
        los duplicados están bien y son esperados.
      </p>
      <p>
        Internamente, la herramienta usa el primitivo <code>crypto.getRandomValues</code> del
        navegador con muestreo de rechazo, lo que evita el sutil sesgo de módulo que introduce el
        código ingenuo de <code>Math.random() * range</code>. En términos simples: cada número en
        tu rango tiene una probabilidad genuinamente igual de salir, no una ligeramente sesgada.
        Para una elección casual esa distinción es invisible, pero para cualquier cosa donde se
        cuestione la imparcialidad — un sorteo público, un sorteo de pago — es la diferencia entre
        defendible y dudoso.
      </p>

      <h2>El Lanzador de Dados</h2>
      <p>
        Los juegos de mesa y de rol viven y mueren por los dados, y los dados físicos tienen la
        costumbre de rodar fuera de la mesa o perderse justo cuando los necesitas. El lanzador de
        dados es compatible con el conjunto poliédrico completo — d4, d6, d8, d10, d12 y d20 — y
        te permite lanzar varios a la vez, la notación clásica de <em>2d6</em> o <em>4d6</em>. Cada
        dado se muestra individualmente para que puedas ver la distribución, y el total se suma
        automáticamente. Sin aritmética mental, sin discutir sobre si ese dado cayó en un 5 o en
        un 6.
      </p>
      <p>
        Como los lanzamientos usan la misma aleatoriedad criptográficamente decente que el generador
        de números, un d20 digital es tan justo como uno físico — probablemente más justo, ya que
        los dados reales raramente están perfectamente equilibrados. Lanza para la iniciativa, lanza
        para el daño, haz una verificación percentil rápida con un d100, todo desde la misma pestaña.
      </p>

      <h2>El Lanzamiento de Moneda</h2>
      <p>
        A veces solo necesitas un sí o un no, y nada resuelve una elección binaria más rápido que
        una moneda. El modo de lanzamiento de moneda muestra una animación de giro rápida y cae en
        cara o cruz, y lleva un <strong>recuento acumulado</strong> de ambos. El recuento es la
        función infravalorada aquí: si estás resolviendo un mejor de siete, o simplemente quieres
        ver la ley de los grandes números acercándose lentamente a un resultado 50/50, el contador
        está ahí. Reinícialo siempre que empieces un nuevo concurso.
      </p>

      <h2>El Selector de Nombres Aleatorio (Ruleta)</h2>
      <p>
        Este es el modo que más se comparte. Pega una lista de nombres — uno por línea — y el
        selector elige un ganador aleatorio con un breve giro para el suspense. Está diseñado para{" "}
        <strong>sorteos, preguntas en clase, turnos en reuniones de equipo y sorteos de premios</strong>.
        Añade tus comentaristas de Instagram, tus alumnos, tus participantes en la rifa y deja que
        la herramienta haga la elección para que nadie pueda acusarte de favoritismo.
      </p>
      <p>
        La opción clave para los sorteos es <strong>&quot;eliminar al ganador después de elegir.&quot;</strong>{" "}
        Actívala y cada nombre elegido se saca de la lista, para que puedas realizar un sorteo de
        varios premios — primer lugar, segundo lugar, tercer lugar — sin que la misma persona gane
        dos veces. Desactívala y la lista completa permanece intacta para elecciones individuales
        repetidas. Un contador muestra cuántas entradas quedan después de cada elección.
      </p>

      <h2>Por Qué una Herramienta de Navegador Supera a una App</h2>
      <p>
        Existen apps y sitios de ruleta dedicados a la aleatoriedad, pero la mayoría están enterrados
        bajo anuncios, te piden que te registres o ejecutan la aleatorización en un servidor que no
        puedes inspeccionar. El selector aleatorio de BrowseryTools es lo contrario: una sola página
        estática que hace su trabajo completamente en tu dispositivo. Nada de lo que escribes —
        ni tus participantes del sorteo, ni los nombres de tus alumnos — sale jamás de tu navegador.
        Puedes copiar cualquier resultado al portapapeles, marcar la página como favorita o compartir
        la URL con un compañero que necesita el mismo lanzamiento de moneda imparcial.
      </p>

      <h2>Pruébalo Ahora</h2>
      <p>
        Tanto si necesitas un número aleatorio rápido, un d20 justo, una moneda para resolver una
        discusión o un selector de nombres para tu próximo sorteo, el{" "}
        <a href="/tools/random-picker">Selector Aleatorio</a> lo tiene todo en un solo lugar —
        gratuito, privado e instantáneo. Sin instalaciones, sin cuentas, sin trampa.
      </p>
      <ToolCTA slug="random-picker" variant="card" />
    </div>
  );
}
