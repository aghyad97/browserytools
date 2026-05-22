export default function Content() {
  return (
    <div>
      <p>
        Los números romanos están en todas partes una vez que empiezas a fijarte: el año de copyright
        al final de una película, los números de capítulo de un libro, los títulos de la Super Bowl,
        las esferas de los relojes, el &ldquo;MMXXVI&rdquo; en la piedra angular de un edificio.
        Son elegantes, pero leerlos y escribirlos no es intuitivo — rápido, ¿qué es{" "}
        <strong>MCMXCIV</strong>? Esta guía explica exactamente cómo funcionan los números romanos,
        las reglas que confunden a la gente y cómo convertir cualquier número en ambas direcciones
        al instante.
      </p>
      <p>
        Si solo necesitas la respuesta, el{" "}
        <a href="/tools/roman-numeral">Conversor de Números Romanos de BrowseryTools</a> convierte
        números a numerales romanos y viceversa en tu navegador — gratuito, sin registro, nada
        subido. Sigue leyendo para entender cómo funciona realmente el sistema y poder verificar
        cualquier resultado tú mismo.
      </p>

      <h2>Los Siete Símbolos</h2>
      <p>
        Todo el sistema se construye con solo siete letras, cada una con un valor fijo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000`}
      </pre>
      <p>
        Cada número romano es alguna combinación de estos siete símbolos. No existe el cero ni un
        símbolo para números negativos — el sistema se creó para contar y etiquetar, no para la
        aritmética.
      </p>

      <h2>Las Dos Reglas Que Gobiernan Todo</h2>
      <p>
        <strong>Regla 1 — Suma cuando los símbolos descienden.</strong> Cuando a un símbolo de igual
        o menor valor le sigue uno mayor, se suman. Así, <code>VI</code> es 5 + 1 = 6, <code>XV</code>{" "}
        es 10 + 5 = 15 y <code>MDC</code> es 1000 + 500 + 100 = 1600. Se lee de izquierda a derecha
        y se mantiene un total acumulado.
      </p>
      <p>
        <strong>Regla 2 — Resta cuando un símbolo menor precede a uno mayor.</strong> Colocar un valor
        menor <em>antes</em> de uno mayor significa restar. <code>IV</code> es 5 &minus; 1 = 4,{" "}
        <code>IX</code> es 10 &minus; 1 = 9, <code>XL</code> es 50 &minus; 10 = 40 y{" "}
        <code>CM</code> es 1000 &minus; 100 = 900. Esta notación sustractiva es la razón por la que
        los números romanos evitan cuatro repeticiones seguidas como IIII.
      </p>
      <p>
        Solo son válidos seis pares sustractivos: <code>IV</code> (4), <code>IX</code> (9),{" "}
        <code>XL</code> (40), <code>XC</code> (90), <code>CD</code> (400) y <code>CM</code> (900).
        Solo se restan potencias de diez (I, X, C), y únicamente de los uno o dos escalones
        siguientes.
      </p>

      <h2>Cómo Leer MCMXCIV (El Difícil)</h2>
      <p>
        Divídelo en los bloques sustractivos y aditivos de izquierda a derecha:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`M    = 1000
CM   =  900   (1000 - 100)
XC   =   90   (100 - 10)
IV   =    4   (5 - 1)
-----------
       1994`}
      </pre>
      <p>
        Así que <strong>MCMXCIV = 1994</strong>. Una vez que puedes identificar los cuatro bloques
        sustractivos, incluso los numerales largos se descifran rápidamente.
      </p>

      <h2>Cómo Escribir un Número Como Numeral Romano</h2>
      <p>
        Trabaja por posición numérica de una en una, de los millares hacia las unidades, y escribe
        cada posición usando sus símbolos:
      </p>
      <p>
        Toma <strong>2026</strong>. Millares: 2 &rarr; <code>MM</code>. Centenas: 0 &rarr; nada.
        Decenas: 2 &rarr; <code>XX</code>. Unidades: 6 &rarr; <code>VI</code>. Júntalos:{" "}
        <strong>MMXXVI</strong>. Toma <strong>49</strong>: decenas 4 &rarr; <code>XL</code>, unidades
        9 &rarr; <code>IX</code>, dando <strong>XLIX</strong> — un buen recordatorio de que 49{" "}
        <em>no</em> es IL, porque solo puedes restar del siguiente nivel o del dos niveles arriba.
      </p>

      <h2>Errores Comunes</h2>
      <p>
        <strong>Repetir un símbolo cuatro veces.</strong> 4 es <code>IV</code>, no <code>IIII</code>;
        40 es <code>XL</code>, no <code>XXXX</code>. (Las esferas de los relojes son una excepción
        curiosa que a menudo usa IIII para el 4 por equilibrio visual.)
      </p>
      <p>
        <strong>Sustracciones ilegales.</strong> 99 es <code>XCIX</code> (90 + 9), no <code>IC</code>.
        No se puede restar I de C. Cíñete a los seis pares válidos.
      </p>
      <p>
        <strong>Números superiores a 3999.</strong> Los números romanos estándar llegan hasta 3999
        (MMMCMXCIX). Los valores mayores usaban históricamente una barra sobre una letra para
        multiplicar por 1000, pero eso rara vez es necesario hoy.
      </p>

      <h2>Dónde Se Siguen Viendo los Números Romanos</h2>
      <p>
        Años de copyright en películas y series de TV, capítulos y páginas preliminares de libros,
        nombres de monarcas y papas (Isabel II, Benedicto XVI), la Super Bowl, los Juegos Olímpicos,
        esferas de relojes y relojes de pulsera, piedras angulares de edificios y la numeración de
        esquemas. Conocer las reglas convierte todo esto de un enigma en una lectura instantánea.
      </p>

      <h2>Preguntas Frecuentes</h2>
      <p>
        <strong>¿Cómo se escribe el 0 en números romanos?</strong> No se escribe — el sistema no
        tiene símbolo para el cero. Los eruditos medievales usaban a veces la palabra{" "}
        <em>nulla</em> en su lugar.
      </p>
      <p>
        <strong>¿Cuál es el número romano estándar más grande?</strong> 3999, escrito MMMCMXCIX.
      </p>
      <p>
        <strong>¿Por qué los relojes usan IIII en lugar de IV?</strong> Por tradición y simetría
        visual; equilibra el VIII del lado opuesto. Es una excepción estilística, no la regla
        estándar.
      </p>
      <p>
        <strong>¿Puedo convertir en ambas direcciones?</strong> Sí — el{" "}
        <a href="/tools/roman-numeral">conversor</a> va de números a numerales y de numerales de
        vuelta a números.
      </p>

      <h2>Convierte al Instante</h2>
      <p>
        Abre el <a href="/tools/roman-numeral">Conversor de Números Romanos</a> para traducir
        cualquier número en cualquier dirección — práctico para descifrar un año de copyright o
        escribir un tatuaje, un título o una piedra angular. Mientras estás aquí, BrowseryTools
        también tiene una{" "}
        <a href="/tools/calculator">calculadora científica</a> y una{" "}
        <a href="/tools/percentage-calculator">calculadora de porcentajes</a> para las matemáticas
        que los romanos nunca llegaron a resolver.
      </p>
    </div>
  );
}
