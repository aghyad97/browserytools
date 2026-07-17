import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Una de las fuentes más comunes de frustración para los desarrolladores que construyen con LLMs
        es chocar con un muro invisible —una solicitud que falla sin explicación, una conversación que
        pierde el contexto de repente, o un documento que se procesa de forma incompleta. En casi todos
        los casos, el culpable es la ventana de contexto. Entender qué es una ventana de contexto, qué
        significan sus límites en la práctica y cómo trabajar dentro de ellos con destreza es
        fundamental para construir aplicaciones de IA fiables.
      </p>
      <ToolCTA slug="context-window" variant="inline" />
      <p>
        Puedes usar la{" "}
        <a href="/tools/context-window">herramienta de Ventana de Contexto de BrowseryTools</a> —gratis,
        sin registro, todo se queda en tu navegador— para visualizar cuánto de la ventana de contexto
        de un modelo ocupa tu contenido antes de enviarlo a una API.
      </p>

      <h2>¿Qué Es una Ventana de Contexto?</h2>
      <p>
        Una ventana de contexto es la cantidad máxima de texto —medida en tokens— que un modelo de
        lenguaje puede «ver» y razonar en una sola solicitud. Es la memoria de trabajo del modelo. Todo
        lo que es relevante para generar el siguiente token debe caber dentro de esta ventana: tu prompt
        de sistema, el historial completo de la conversación, cualquier documento que hayas incluido y
        los tokens que el modelo está generando ahora mismo.
      </p>
      <p>
        A diferencia de la memoria de trabajo humana, que se deteriora gradualmente a medida que se
        sobrecarga, las ventanas de contexto tienen un límite estricto. Cuando lo superas, la API
        devuelve un error. No hay éxito parcial —la solicitud simplemente falla y tu aplicación debe
        manejar eso de forma elegante.
      </p>
      <p>
        La ventana de contexto es un grupo compartido entre entrada y salida. Si un modelo tiene una
        ventana de contexto de 128 K tokens y tu entrada es de 120 K tokens, solo te quedan 8 K tokens
        para la respuesta del modelo. Esta es una restricción importante al diseñar tareas que requieren
        salidas largas.
      </p>

      <h2>Límites Actuales de la Ventana de Contexto por Modelo</h2>
      <p>
        Las ventanas de contexto han crecido dramáticamente en los últimos años y los números siguen
        expandiéndose a medida que los modelos mejoran:
      </p>
      <ul>
        <li>
          <strong>GPT-4o</strong> — 128 000 tokens (~96 000 palabras). Suficiente para una novela
          completa o un código base grande.
        </li>
        <li>
          <strong>Claude 3.5 Sonnet / Claude 3 Opus</strong> — 200 000 tokens (~150 000 palabras).
          Anthropic ha ampliado consistentemente este límite más que OpenAI.
        </li>
        <li>
          <strong>Gemini 1.5 Pro</strong> — 1 000 000 tokens (~750 000 palabras). Una ventana de
          contexto genuinamente sin precedentes que puede contener bases de código completas u horas de
          transcripciones de reuniones.
        </li>
        <li>
          <strong>Gemini 1.5 Flash</strong> — 1 000 000 tokens, optimizado para velocidad y menor costo.
        </li>
        <li>
          <strong>Llama 3.1 (70B / 405B)</strong> — 128 000 tokens, disponible a través de varios
          proveedores incluyendo together.ai y Groq.
        </li>
        <li>
          <strong>Mistral Large</strong> — 128 000 tokens.
        </li>
      </ul>
      <p>
        Como referencia, esta entrada de blog completa tiene alrededor de 1200 tokens. Incluso la
        ventana «pequeña» de 128 K de GPT-4o es lo suficientemente grande para procesar la totalidad
        de la mayoría de los documentos prácticos. La pregunta no es solo si tu contenido cabe —sino
        cómo el modelo maneja el contenido en diferentes posiciones dentro de esa ventana.
      </p>

      <h2>Qué Ocurre Cuando Superas la Ventana de Contexto</h2>
      <p>
        Cuando tu entrada supera la longitud de contexto máxima del modelo, la API devuelve un error.
        Los mensajes de error comunes incluyen:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// OpenAI
{
  "error": {
    "type": "invalid_request_error",
    "code": "context_length_exceeded",
    "message": "This model's maximum context length is 128000 tokens. However, your messages resulted in 134291 tokens."
  }
}

// Anthropic
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "prompt is too long: 201483 tokens > 200000 maximum"
  }
}`}
      </pre>
      <p>
        En una aplicación de chat, esto ocurre comúnmente después de suficientes turnos en una
        conversación larga. A medida que cada mensaje del usuario y respuesta del asistente se añaden
        al historial, el recuento total de tokens crece hasta alcanzar el límite. Sin una gestión
        proactiva, la aplicación falla en el siguiente turno. Los usuarios experimentan esto como si
        la IA de repente se negara a responder o lanzara un error en medio de la conversación —una
        experiencia muy frustrante.
      </p>

      <h2>El Problema de «Perdido en el Medio»</h2>
      <p>
        Tener una ventana de contexto grande no significa que el modelo atienda igualmente a todo.
        La investigación ha mostrado sistemáticamente que los modelos basados en transformadores
        rinden mejor con la información colocada al principio o al final del contexto —un fenómeno
        conocido como el problema de <strong>perdido en el medio</strong>.
      </p>
      <p>
        En la práctica, esto significa que si estás haciendo generación aumentada por recuperación (RAG)
        e inyectas 20 fragmentos de documentos recuperados en el medio de un contexto largo, el modelo
        puede no hacer referencia a los fragmentos en las posiciones 8-14 aunque sean los más relevantes.
        La información más importante para tu tarea debe colocarse al principio (cerca del prompt de
        sistema) o al final (justo antes de la pregunta del usuario) del contexto.
      </p>
      <p>
        Esto también significa que simplemente darle al modelo una ventana de contexto de 1 M tokens y
        volcar todo lo que tienes no siempre es la estrategia correcta. Un contexto enfocado de 10 K
        tokens con precisamente la información correcta a menudo superará a un contexto de 500 K lleno
        de material vagamente relevante.
      </p>

      <h2>Estrategias para Trabajar Dentro de los Límites de Contexto</h2>

      <h3>Fragmentación (Chunking)</h3>
      <p>
        Para documentos que superan la ventana de contexto, divídelos en fragmentos superpuestos y
        procesa cada uno de forma independiente. Usa una pequeña superposición (por ejemplo, el 20%
        del tamaño del fragmento) para preservar la continuidad entre los límites de fragmentos. Esto
        funciona bien para tareas como resumen, extracción y clasificación donde cada fragmento es
        relativamente autónomo.
      </p>

      <h3>Resumen / Compresión</h3>
      <p>
        Para conversaciones largas o historiales de documentos, resume periódicamente el contenido más
        antiguo y reemplázalo con el resumen. Una conversación de 50 turnos puede comprimirse a menudo
        en un resumen de 300 tokens que preserva el contexto clave sin consumir todo el historial. Esto
        es especialmente efectivo en las aplicaciones de chat donde los primeros turnos de la
        conversación se vuelven menos relevantes a medida que avanza.
      </p>

      <h3>Generación Aumentada por Recuperación (RAG)</h3>
      <p>
        En lugar de poner documentos enteros en el contexto, incrústalos en una base de datos vectorial
        y recupera solo los pasajes más relevantes en el momento de la consulta. Un sistema RAG bien
        diseñado puede hacer que un modelo con una ventana de contexto de 128 K «conozca» efectivamente
        millones de tokens de documentación —simplemente recupera lo necesario por consulta. Esto
        también reduce significativamente el costo en comparación con usar un modelo de contexto largo
        completo en cada solicitud.
      </p>

      <h3>Inclusión Selectiva de Contexto</h3>
      <p>
        Sé deliberado sobre lo que incluyes. En un asistente de código, no necesitas incluir todos los
        archivos del proyecto —solo los archivos relevantes para la tarea actual. En un sistema de
        preguntas y respuestas sobre documentos, no incluyas el documento completo a menos que la
        pregunta sea sobre algo que abarca todo el documento. Construye lógica que seleccione el
        contexto de forma inteligente en lugar de incluir todo por defecto.
      </p>

      <h2>Cómo Monitorear el Uso del Contexto</h2>
      <p>
        La mayoría de las APIs de proveedores de IA devuelven el uso de tokens en sus respuestas. El
        objeto de respuesta de OpenAI incluye un campo <code>usage</code> con <code>prompt_tokens</code>,{" "}
        <code>completion_tokens</code> y <code>total_tokens</code>. Anthropic devuelve{" "}
        <code>input_tokens</code> y <code>output_tokens</code>. Registrar estos recuentos para cada
        solicitud te da visibilidad sobre las tendencias de crecimiento antes de alcanzar el límite.
      </p>
      <p>
        Para verificaciones previas al envío de una solicitud, usa la{" "}
        <a href="/tools/context-window">herramienta de Ventana de Contexto de BrowseryTools</a> para
        pegar tu prompt y ver exactamente cuántos tokens ocupa y qué porcentaje de la ventana de
        contexto de cada modelo representa. Esto es especialmente útil al construir prompts de sistema
        o diseñar estrategias de recuperación RAG —puedes ver el impacto de tus elecciones antes de
        hacer una sola llamada a la API.
      </p>

      <h2>Más Grande No Siempre Es Mejor</h2>
      <p>
        La expansión de las ventanas de contexto es un logro de ingeniería genuino, y los contextos de
        un millón de tokens abren casos de uso genuinamente nuevos. Pero para la mayoría de las
        aplicaciones, la estrategia ganadora no es llenar la ventana de contexto lo más posible —es
        poner la información correcta en la posición correcta dentro de un contexto bien delimitado.
        Combina eso con una comprensión de cuánto contexto estás usando en cada momento, y construirás
        aplicaciones más rápidas, más económicas y más fiables que las que tratan la ventana de contexto
        como un vertedero.
      </p>

      <div style={{background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Herramienta de Ventana de Contexto Gratuita — Visualiza el Tamaño de Tu Prompt al Instante
        </p>
        <a
          href="/tools/context-window"
          style={{background: "rgba(168,85,247,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Herramienta de Ventana de Contexto →
        </a>
      </div>
      <ToolCTA slug="context-window" variant="card" />
    </div>
  );
}
