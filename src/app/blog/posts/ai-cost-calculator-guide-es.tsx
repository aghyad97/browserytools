export default function Content() {
  return (
    <div>
      <p>
        Las APIs de IA han facilitado enormemente la integración de grandes modelos de lenguaje en
        aplicaciones —pero también han facilitado enormemente agotar un presupuesto sin darse cuenta.
        El precio basado en tokens no es intuitivo al principio, y la diferencia entre los costos de
        entrada y salida, los niveles de modelos y el volumen de solicitudes puede generar facturas
        órdenes de magnitud mayores de lo esperado. Unos minutos de estimación anticipada pueden
        ahorrar muchas sorpresas en la factura más adelante.
      </p>
      <p>
        Puedes usar la{" "}
        <a href="/tools/ai-cost-calculator">Calculadora de Costos de IA de BrowseryTools</a> —gratis,
        sin registro, todo se queda en tu navegador— para modelar tus costos en GPT-4, Claude, Gemini
        y otros modelos principales antes de escribir una sola línea de código.
      </p>

      <h2>Cómo Funciona el Precio Basado en Tokens</h2>
      <p>
        Cada API de IA principal —OpenAI, Anthropic, Google— cobra por token, no por solicitud ni por
        segundo. Un token equivale aproximadamente a 3-4 caracteres de texto en inglés, o unas 0,75
        palabras. Cuando envías un prompt a una API, el proveedor cuenta los tokens de tu entrada,
        genera una respuesta, cuenta esos tokens de salida y cobra por ambos —a diferentes tarifas.
      </p>
      <p>
        Los precios se cotizan por 1000 tokens (a veces por 1 millón de tokens para niveles de precios
        más nuevos de mayor volumen). A principios de 2026, los precios de referencia aproximados son:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — ~$2,50 por 1 M tokens de entrada, ~$10,00 por 1 M tokens de salida</li>
        <li><strong>Claude 3.5 Sonnet</strong> — ~$3,00 por 1 M tokens de entrada, ~$15,00 por 1 M tokens de salida</li>
        <li><strong>Gemini 1.5 Pro</strong> — ~$1,25 por 1 M tokens de entrada, ~$5,00 por 1 M tokens de salida</li>
        <li><strong>GPT-4o mini</strong> — ~$0,15 por 1 M tokens de entrada, ~$0,60 por 1 M tokens de salida</li>
        <li><strong>Claude 3 Haiku</strong> — ~$0,25 por 1 M tokens de entrada, ~$1,25 por 1 M tokens de salida</li>
      </ul>
      <p>
        Estos números cambian a medida que los modelos se actualizan, así que verifica siempre con la
        página de precios actual del proveedor. La conclusión clave es la brecha entre precios de entrada
        y salida: los tokens de salida típicamente cuestan entre 3 y 5 veces más que los tokens de
        entrada para el mismo modelo.
      </p>

      <h2>Por Qué los Tokens de Salida Cuestan Más</h2>
      <p>
        La asimetría entre los precios de entrada y salida refleja diferencias computacionales reales.
        Procesar un token de entrada (durante la fase de «prefill») implica un único paso hacia adelante
        por las capas de atención del modelo. Generar cada token de salida (durante el «decoding»)
        requiere un paso hacia adelante independiente —en serie, un token a la vez— lo que es mucho
        más intensivo en cómputo a escala.
      </p>
      <p>
        Esto tiene una implicación directa para la estimación de costos: el recuento de tokens de salida
        importa más que el de entrada. Un prompt de sistema de 500 tokens que produce una respuesta de
        1500 tokens cuesta más en salida que toda la entrada. Si estás diseñando una función que genera
        documentos largos, informes o archivos de código, modela cuidadosamente la longitud de salida
        —es la que domina la factura.
      </p>

      <h2>Estimación de Costos Mensuales: Un Marco</h2>
      <p>
        Para estimar tu gasto mensual en API de IA, necesitas cuatro números:
      </p>
      <ul>
        <li><strong>Tokens de entrada promedio por solicitud</strong> — tu prompt de sistema + mensaje del usuario + cualquier contexto</li>
        <li><strong>Tokens de salida promedio por solicitud</strong> — la longitud típica de la respuesta del modelo</li>
        <li><strong>Solicitudes por día</strong> — el volumen de llamadas diarias esperado a escala</li>
        <li><strong>Precio del modelo</strong> — costo de entrada y salida por 1 M tokens para el modelo que planeas usar</li>
      </ul>
      <p>
        La fórmula: <code>(tokens_entrada_promedio × precio_entrada + tokens_salida_promedio × precio_salida) × solicitudes_por_día × 30</code>.
        Suena simple, pero estimar los recuentos de tokens antes de tener datos reales es donde la
        mayoría de las personas se equivoca. Un prompt de sistema «corto» que suena como 50 palabras
        puede ser fácilmente 80-100 tokens. Una pregunta del usuario más el historial de conversación en
        una aplicación de chat puede crecer hasta miles de tokens por solicitud sin una gestión cuidadosa.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Ejemplo: bot de soporte al cliente
avg_input_tokens  = 800   // system prompt + user message + history
avg_output_tokens = 300   // typical support reply
requests_per_day  = 5000  // moderate production volume
model             = Claude 3.5 Sonnet

daily_cost = (800 × $0.003 + 300 × $0.015) per 1K tokens × 5000
           = ($2.40 + $4.50) × 5
           = ~$34.50/day → ~$1,035/month`}
      </pre>
      <p>
        La misma carga de trabajo en GPT-4o mini a $0,15/$0,60 por 1 M tokens costaría alrededor de
        $15/mes. La elección del modelo por sí sola supone una diferencia de coste de 70x para esta
        carga de trabajo.
      </p>

      <h2>Estrategias Prácticas para Reducir los Costos de API de IA</h2>
      <p>
        Una vez que tienes una estimación de costos, el siguiente paso es identificar dónde recortar.
        Estas son las técnicas de mayor apalancamiento:
      </p>
      <ul>
        <li>
          <strong>Elige el nivel de modelo correcto</strong> — Usa modelos potentes (GPT-4, Claude
          Sonnet, Gemini Pro) solo para tareas que requieran razonamiento profundo. Para clasificación,
          extracción simple o preguntas y respuestas cortas, los modelos más pequeños como GPT-4o mini
          o Claude Haiku ofrecen resultados comparables a entre 10 y 50 veces menos costo.
        </li>
        <li>
          <strong>Almacena en caché las entradas repetidas</strong> — Si tu prompt de sistema es el
          mismo en miles de solicitudes, el almacenamiento en caché de prompts (compatible con Anthropic
          y OpenAI) te permite evitar re-tokenizarlo cada vez. En aplicaciones de alto volumen esto solo
          puede reducir los costos entre un 30 y un 50%.
        </li>
        <li>
          <strong>Recorta el contexto agresivamente</strong> — Cada token en la ventana de contexto
          cuesta dinero. En las aplicaciones de chat, no incluyas todo el historial de la conversación
          —mantén una ventana deslizante de los últimos 5-10 turnos, o resume los turnos más antiguos.
          En los pipelines de RAG, recupera solo los fragmentos más relevantes en lugar de insertar
          documentos en masa.
        </li>
        <li>
          <strong>Limita los tokens de salida máximos</strong> — Establece <code>max_tokens</code>{" "}
          apropiado para la tarea. Si estás generando un título de producto, limítalo a 30 tokens. Si
          el modelo no puede responder dentro de tu límite, detectarás ese caso extremo en lugar de
          pagar silenciosamente por una respuesta de 2000 tokens.
        </li>
        <li>
          <strong>Procesa por lotes donde sea posible</strong> — Tanto OpenAI como Anthropic ofrecen
          APIs de procesamiento por lotes con un 50% de descuento para cargas de trabajo que no
          requieren respuestas en tiempo real. Los trabajos de procesamiento nocturno, la clasificación
          de documentos y los pipelines de generación de contenido son buenos candidatos.
        </li>
        <li>
          <strong>Monitorea y configura alertas</strong> — Establece límites de gasto y alertas de uso
          en el panel de tu proveedor antes de ir a producción. Los errores en la lógica de reintentos
          o los bucles infinitos pueden convertir una estimación de $50/mes en una sorpresa de $5000
          antes de que te des cuenta.
        </li>
      </ul>

      <h2>Planificación de Presupuesto para Diferentes Casos de Uso</h2>
      <p>
        Los diferentes tipos de aplicaciones tienen perfiles de costo muy distintos. Un modelo mental
        rápido:
      </p>
      <ul>
        <li>
          <strong>Prototipos y proyectos personales</strong> — $5-20/mes. Usa modelos mini/haiku, mantén
          el contexto corto, construye sobre el nivel gratuito donde sea posible.
        </li>
        <li>
          <strong>Herramientas internas de negocio (bajo volumen)</strong> — $50-300/mes. Algunos
          cientos de empleados que usan una herramienta de búsqueda o documentos asistida por IA unas
          pocas veces al día.
        </li>
        <li>
          <strong>Aplicaciones para consumidores con funciones de IA (escala moderada)</strong> — $500-5000/mes.
          Decenas de miles de usuarios activos que interactúan con funciones de IA diariamente. La
          elección del modelo es crítica aquí.
        </li>
        <li>
          <strong>Producto de IA principal (alto volumen)</strong> — $10.000+/mes. La IA es la propuesta
          de valor principal, usada constantemente. A esta escala, negocia precios empresariales e invierte
          en infraestructura de caché y gestión de contexto.
        </li>
      </ul>

      <h2>Empieza con una Estimación de Costos</h2>
      <p>
        Antes de comprometerte con un modelo, una arquitectura o un nivel de precio, modela tus costos
        con números reales. La{" "}
        <a href="/tools/ai-cost-calculator">Calculadora de Costos de IA de BrowseryTools</a> te permite
        introducir recuentos de tokens, volúmenes de solicitudes y opciones de modelos para ver el gasto
        mensual proyectado lado a lado entre proveedores. Toma dos minutos y puede ahorrarte meses de
        sorpresas en facturas.
      </p>

      <div style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculadora de Costos de IA Gratuita — Compara GPT-4, Claude, Gemini
        </p>
        <a
          href="/tools/ai-cost-calculator"
          style={{background: "rgba(16,185,129,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Calculadora de Costos de IA →
        </a>
      </div>
    </div>
  );
}
