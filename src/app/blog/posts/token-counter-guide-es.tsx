import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Cuando los desarrolladores comienzan a trabajar con APIs de grandes modelos de lenguaje, una
        pregunta surge casi de inmediato: «¿Qué longitud es demasiada?» Piensan en palabras, párrafos
        o caracteres —pero el modelo piensa en tokens. Entender qué son los tokens, cómo se cuentan y
        por qué importa el recuento es una de las cosas más útiles en la práctica que puedes aprender
        antes de construir algo serio sobre un LLM.
      </p>
      <ToolCTA slug="token-counter" variant="inline" />
      <p>
        Puedes usar el{" "}
        <a href="/tools/token-counter">Contador de Tokens de BrowseryTools</a> —gratis, sin registro,
        todo se queda en tu navegador— para contar tokens de cualquier texto antes de enviarlo a una API.
      </p>

      <h2>¿Qué Es un Token? (No Es una Palabra, Ni un Carácter)</h2>
      <p>
        Un token es la unidad fundamental de texto que procesa un modelo de lenguaje. No es una
        palabra. No es un carácter. Es un fragmento de texto que el tokenizador del modelo ha aprendido
        a tratar como una unidad única —y ese fragmento puede ser desde un único carácter hasta un
        fragmento de palabra de varios caracteres o una palabra común completa.
      </p>
      <p>
        Aquí tienes algunos ejemplos de cómo una oración podría dividirse en tokens por un tokenizador
        de la familia GPT:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`"Hello, world!"
→ ["Hello", ",", " world", "!"]  — 4 tokens

"unbelievable"
→ ["un", "believ", "able"]  — 3 tokens

"ChatGPT"
→ ["Chat", "G", "PT"]  — 3 tokens

"2026-03-22"
→ ["2026", "-", "03", "-", "22"]  — 5 tokens`}
</pre>
      <p>
        Observa cómo las palabras cortas comunes como «Hello» se mapean a un solo token, mientras que
        las palabras más largas o inusuales se dividen en múltiples tokens. La puntuación, los números
        y los caracteres especiales son a menudo sus propios tokens. El tokenizador no se divide
        simplemente en espacios o signos de puntuación —usa un vocabulario aprendido de unidades de
        sub-palabras para lograr el mejor equilibrio entre el tamaño del vocabulario y la eficiencia de
        representación.
      </p>

      <h2>Cómo Funcionan los Tokenizadores: Byte-Pair Encoding</h2>
      <p>
        La mayoría de los LLM modernos —GPT-4, Claude, Gemini, Llama— usan una variante de{" "}
        <strong>Byte-Pair Encoding (BPE)</strong> o un algoritmo estrechamente relacionado llamado
        SentencePiece. El BPE se desarrolló originalmente para compresión de datos; se adaptó para el
        PLN porque resuelve elegantemente el problema del vocabulario abierto.
      </p>
      <p>
        El proceso de entrenamiento de BPE comienza con caracteres individuales (o bytes) como
        vocabulario base. Luego encuentra repetidamente el par de símbolos que co-ocurre con más
        frecuencia en el corpus de entrenamiento y los fusiona en un nuevo símbolo único. Después de
        miles de estas fusiones, el vocabulario resultante contiene palabras comunes como tokens únicos,
        prefijos y sufijos comunes como tokens, y palabras raras como secuencias de tokens más pequeños.
        El tamaño del vocabulario final es típicamente de 32.000 a 100.000 tokens.
      </p>
      <p>
        Esto significa que la tokenización de cualquier texto dado depende enteramente del vocabulario
        específico con el que se entrenó ese modelo. <strong>GPT-4, Claude y Gemini usan
        tokenizadores diferentes</strong> —el mismo texto puede tokenizarse con recuentos distintos en
        cada modelo. Nunca asumas que un recuento de tokens medido para un modelo se aplica a otro.
      </p>

      <h2>La Regla Aproximada de «750 Palabras por 1000 Tokens»</h2>
      <p>
        A menudo verás la aproximación «1000 tokens ≈ 750 palabras» citada para texto en inglés. Esta
        es una heurística razonable para prosa típica —entradas de blog, artículos, documentación.
        Proviene de la observación de que en un corpus equilibrado en inglés, la longitud media del
        token es de unos 4-5 caracteres, y la palabra inglesa media tiene unos 5 caracteres más un
        espacio. Así que una palabra se mapea a aproximadamente 1,3 tokens de promedio.
      </p>
      <p>
        Pero «regla aproximada» es el encuadre correcto —se rompe rápidamente en la práctica:
      </p>
      <ul>
        <li>
          <strong>El código tokeniza más densamente</strong> — Los lenguajes de programación usan
          muchas palabras clave cortas, operadores e identificadores que a menudo son tokens únicos.
          Un bloque de Python puede tokenizarse con menos tokens por carácter que la prosa en inglés.
        </li>
        <li>
          <strong>Las URLs y cadenas técnicas son costosas</strong> — Una URL larga como{" "}
          <code>https://api.example.com/v2/users/84219/preferences?include=notifications</code> puede
          tokenizarse en más de 20 tokens a pesar de parecer corta en pantalla.
        </li>
        <li>
          <strong>Los números son sorprendentemente caros</strong> — Cada dígito en un número largo es
          a menudo un token separado. El número «1738371600» puede convertirse en 5-7 tokens.
        </li>
        <li>
          <strong>Espacios en blanco repetidos y formato</strong> — JSON con sangría de impresión
          bonita, tablas en Markdown y código con anidamiento profundo añaden tokens del espacio en
          blanco.
        </li>
      </ul>

      <h2>Idiomas No Ingleses: Árabe, Chino y la Diferencia en el Costo de Tokens</h2>
      <p>
        La heurística de 750 palabras por 1000 tokens es una heurística para el <em>inglés</em>. Para
        otros idiomas, la proporción puede ser dramáticamente diferente —y esto tiene implicaciones
        reales de costo para las aplicaciones multilingües.
      </p>
      <p>
        El <strong>árabe y el hebreo</strong> usan morfología de raíz y patrón, donde una sola raíz
        genera docenas de formas derivadas a través de prefijos, sufijos y cambios vocálicos internos.
        Palabras como «وسيستخدمونها» (ellos la usarán) son palabras ortográficas únicas pero pueden
        tokenizarse en 5-8 tokens porque el vocabulario de BPE se entrenó predominantemente con datos
        en inglés y no tiene estas formas árabes como tokens únicos.
      </p>
      <p>
        El <strong>chino y el japonés</strong> tienen un desafío diferente. Los caracteres son
        logográficos —cada carácter es una unidad con significado— pero el vocabulario de tokens cubre
        caracteres únicos comunes y algunas palabras comunes de varios caracteres. El texto chino
        típicamente produce entre 1,5 y 2 veces más tokens por «equivalente de palabra» que el inglés.
        El japonés, con su mezcla de hiragana, katakana y kanji, puede ser aún más alto.
      </p>
      <p>
        Una implicación práctica: si estás construyendo una aplicación para árabe, chino u otros idiomas
        con escritura no latina, tus estimaciones de costo derivadas de las pruebas en inglés
        infraestimará significativamente los costos reales de API. Mide siempre los recuentos de tokens
        con tu contenido real usando el{" "}
        <a href="/tools/token-counter">Contador de Tokens de BrowseryTools</a> o una biblioteca de
        tokenizadores antes de hacer proyecciones de presupuesto.
      </p>

      <h2>Límites de la Ventana de Contexto: Por Qué Superarlos Rompe Todo</h2>
      <p>
        Cada LLM tiene una <strong>ventana de contexto</strong> —el número máximo de tokens que puede
        procesar en una sola solicitud, contando tanto tu entrada como la salida del modelo. A
        principios de 2026:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — 128 000 tokens</li>
        <li><strong>Claude 3.5 Sonnet</strong> — 200 000 tokens</li>
        <li><strong>Gemini 1.5 Pro</strong> — 1 000 000 tokens</li>
        <li><strong>Llama 3.1 70B</strong> — 128 000 tokens</li>
      </ul>
      <p>
        Si tu entrada supera el límite de la ventana de contexto, la API devolverá un error —la
        solicitud simplemente falla. No hay degradación gradual por defecto; debes manejar esto en la
        lógica de tu aplicación. De forma más sutil, incluso dentro de la ventana de contexto, existe
        un fenómeno llamado el problema de «perdido en el medio»: los modelos tienden a recordar mejor
        la información al principio y al final de su contexto que la información enterrada en el medio.
        Una ventana de contexto de 200 K no significa que cada token sea igualmente bien atendido.
      </p>
      <p>
        Para las aplicaciones de chat, la ventana de contexto se llena a medida que las conversaciones
        crecen. Después de suficientes turnos, debes truncar los mensajes anteriores, resumirlos o
        alcanzar el límite y fallar. Conocer tu recuento de tokens en cada paso es lo que te permite
        tomar esa decisión de forma proactiva.
      </p>

      <h2>Implicaciones del Diseño de Prompts</h2>
      <p>
        La conciencia sobre los tokens cambia la forma en que escribes los prompts. Algunas implicaciones
        concretas:
      </p>
      <ul>
        <li>
          <strong>Los prompts de sistema se acumulan en cada solicitud</strong> — Un prompt de sistema
          de 500 tokens cuesta 500 × el número de solicitudes × el precio de entrada. Con 10 000
          solicitudes diarias, reducir tu prompt de sistema de 500 a 300 tokens ahorra dinero real cada
          mes.
        </li>
        <li>
          <strong>Los ejemplos de few-shot son costosos pero efectivos</strong> — Incluir 3 ejemplos en
          tu prompt puede añadir 300-500 tokens. Mide si esa mejora de calidad vale el costo en
          comparación con ajustar el modelo una sola vez.
        </li>
        <li>
          <strong>La longitud de salida es controlable</strong> — Usa <code>max_tokens</code> para
          limitar la salida del modelo. Añade instrucciones explícitas en tu prompt: «Responde en menos
          de 100 palabras.» Los modelos generalmente siguen bien las instrucciones de longitud de salida,
          lo que reduce directamente los costos de tokens de salida.
        </li>
        <li>
          <strong>El formato JSON añade sobrecarga</strong> — Si usas salida estructurada (modo JSON),
          las comillas, corchetes y nombres de clave añaden tokens además de tus valores de datos reales.
          Una respuesta con 5 campos cortos puede tener fácilmente un 40% de tokens de formato en
          exceso.
        </li>
      </ul>

      <h2>Cuenta los Tokens Antes de Enviar</h2>
      <p>
        El mejor hábito que puedes desarrollar al trabajar con APIs de LLM es contar tus tokens antes
        de comprometerte con una arquitectura o ir a producción. Pega tu prompt de sistema, un mensaje
        de usuario representativo y cualquier contexto que planees incluir en el{" "}
        <a href="/tools/token-counter">Contador de Tokens de BrowseryTools</a>. Verás de inmediato si
        tu diseño está bien dentro de la ventana de contexto o peligrosamente cerca de ella —y tendrás
        los números necesarios para estimar los costos con precisión.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Contador de Tokens Gratuito — Funciona en Tu Navegador, Sin Registro
        </p>
        <a
          href="/tools/token-counter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Contador de Tokens →
        </a>
      </div>
      <ToolCTA slug="token-counter" variant="card" />
    </div>
  );
}
