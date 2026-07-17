import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        El índice de masa corporal — IMC — es uno de los números más usados de la medicina preventiva. Los médicos lo
        mencionan en las revisiones. Los formularios de seguros lo piden. Las apps de fitness lo calculan
        automáticamente. Y, sin embargo, la mayoría de las personas que conocen su número de IMC solo tienen una idea
        vaga de qué mide realmente, cómo se calcula y — lo más importante — qué no puede decirte. Esta guía lo cubre
        todo: la fórmula, las categorías, la historia, las limitaciones reales y cómo usar la{" "}
        <a href="/tools/bmi-calculator">Calculadora de IMC de BrowseryTools</a> para obtener tu resultado al instante y
        de forma privada en tu navegador.
      </p>

      <ToolCTA slug="bmi-calculator" variant="inline" />
      <h2>¿Qué es el IMC?</h2>
      <p>
        El IMC es una simple relación entre el peso y el cuadrado de la altura. Lo ideó en la década de 1830 el
        matemático y estadístico belga Adolphe Quetelet, que estudiaba las características de un "hombre medio" en
        grandes poblaciones. Quetelet no era médico y nunca pretendió que su índice se usara como diagnóstico de salud
        individual — era una herramienta para estudiar patrones a nivel poblacional. La fórmula que desarrolló fue
        adoptada más tarde por la comunidad médica en el siglo XX porque ofrecía algo poco común en los entornos
        clínicos: una forma rápida, gratuita y no invasiva de cribar a un gran número de personas en busca de un posible
        riesgo de salud relacionado con el peso.
      </p>
      <p>
        El índice se consolidó en la década de 1970, después de que el fisiólogo Ancel Keys revisara varios índices de
        peso por altura competidores y concluyera que la fórmula original de Quetelet se correlacionaba de forma más
        fiable con el porcentaje de grasa corporal en los estudios poblacionales. Keys acuñó entonces el término "índice
        de masa corporal". Desde entonces ha sido la métrica de cribado por defecto para el sobrepeso y la obesidad en
        contextos clínicos y de salud pública en todo el mundo.
      </p>

      <h2>La fórmula del IMC</h2>
      <p>
        La fórmula es sencilla. En unidades métricas:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = weight (kg) ÷ height² (m²)
      </pre>
      <p>
        En unidades imperiales se requiere un factor de conversión porque las libras y las pulgadas no comparten la
        misma relación matemática que los kilogramos y los metros:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = 703 × weight (lbs) ÷ height² (inches²)
      </pre>
      <p>
        La constante 703 deriva de la conversión de unidades entre los sistemas métrico e imperial (en concreto, 1
        kg/m² ≈ 703 × lb/in²). Ambas fórmulas producen exactamente el mismo número adimensional para la misma persona.
      </p>

      <h2>Un ejemplo concreto</h2>
      <p>
        Considera a una persona que pesa 70 kg y mide 1,75 m. Su IMC es:
      </p>
      <pre style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`BMI = 70 ÷ (1.75²)
    = 70 ÷ 3.0625
    = 22.9`}
      </pre>
      <p>
        Un resultado de 22,9 cae de lleno en el rango de peso Normal (18,5-24,9). En términos imperiales, una persona
        que mide 5 ft 9 in (69 pulgadas) y pesa 154 lbs obtendría: 703 × 154 ÷ 69² = 108 262 ÷ 4761 ≈ 22,7 —
        esencialmente el mismo número, como cabía esperar.
      </p>

      <h2>Categorías del IMC</h2>
      <p>
        La Organización Mundial de la Salud (OMS) define las siguientes clasificaciones estándar de IMC para adultos de
        18 años o más:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Categoría</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Rango de IMC</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Riesgo de salud asociado</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#2563eb"}}>Bajo peso</strong></td>
              <td style={{padding: "12px 16px"}}>Por debajo de 18,5</td>
              <td style={{padding: "12px 16px"}}>Desnutrición, osteoporosis, anemia, inmunosupresión</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Peso normal</strong></td>
              <td style={{padding: "12px 16px"}}>18,5 – 24,9</td>
              <td style={{padding: "12px 16px"}}>El riesgo más bajo dentro del marco basado en el IMC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Sobrepeso</strong></td>
              <td style={{padding: "12px 16px"}}>25 – 29,9</td>
              <td style={{padding: "12px 16px"}}>Riesgo elevado de diabetes tipo 2, hipertensión, enfermedad cardiovascular</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Obesidad clase I</strong></td>
              <td style={{padding: "12px 16px"}}>30 – 34,9</td>
              <td style={{padding: "12px 16px"}}>Riesgo moderado; síndrome metabólico, apnea del sueño</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#b91c1c"}}>Obesidad clase II</strong></td>
              <td style={{padding: "12px 16px"}}>35 – 39,9</td>
              <td style={{padding: "12px 16px"}}>Riesgo alto; mayor riesgo quirúrgico, enfermedad articular</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#7f1d1d"}}>Obesidad clase III (grave)</strong></td>
              <td style={{padding: "12px 16px"}}>40 o más</td>
              <td style={{padding: "12px 16px"}}>Riesgo muy alto; esperanza de vida significativamente reducida</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Estos umbrales se usan solo para adultos. Los niños y adolescentes se evalúan frente a gráficas de crecimiento
        específicas por edad y sexo, donde el percentil de IMC — y no un número fijo — determina la categoría.
      </p>

      <h2>Qué no mide el IMC</h2>
      <p>
        Aquí es donde el IMC se vuelve realmente complicado. La fórmula es tan simple que inevitablemente pasa por alto
        aspectos importantes de la composición corporal. Entender estas limitaciones no es solo académico — afectan
        directamente a cómo deberías interpretar tu propio número.
      </p>

      <h3>Masa muscular</h3>
      <p>
        El IMC mide el peso corporal total en relación con la altura. No puede distinguir entre el tejido muscular magro
        y el tejido adiposo (graso). Un atleta profesional o un culturista de competición que tiene una musculatura
        considerable a menudo aparecerá como Sobrepeso o incluso Obesidad según el IMC, a pesar de tener un porcentaje
        de grasa corporal muy bajo. Por el contrario, una persona sedentaria con poca masa muscular y mucha grasa
        corporal — a veces llamada "delgado con grasa" o con obesidad de peso normal — puede tener un IMC perfectamente
        Normal mientras lleva niveles de grasa metabólicamente dañinos. Este es posiblemente el defecto más
        significativo del uso rutinario del IMC.
      </p>

      <h3>Edad</h3>
      <p>
        A medida que las personas envejecen, la masa muscular suele disminuir y se reemplaza por tejido graso, incluso
        cuando el peso corporal se mantiene constante — un proceso llamado obesidad sarcopénica. Un adulto mayor con un
        IMC Normal de 23 puede en realidad llevar una mayor proporción de grasa corporal que una persona más joven con
        el mismo número. Algunos investigadores en geriatría sostienen que rangos de IMC ligeramente más altos (hasta 27
        o incluso 28) pueden ser protectores en los adultos mayores, ya que el bajo peso corporal en los ancianos se
        asocia con la fragilidad y una mayor mortalidad.
      </p>

      <h3>Sexo</h3>
      <p>
        Las mujeres tienen de forma natural un porcentaje de grasa corporal más alto que los hombres con el mismo IMC.
        De media, las mujeres tienen entre 10 y 12 puntos porcentuales más de grasa corporal que los hombres con
        idénticas puntuaciones de IMC. Esto es fisiológicamente normal — está relacionado con la función hormonal y la
        biología reproductiva — pero significa que el mismo número de IMC representa composiciones corporales
        notablemente diferentes según el sexo biológico.
      </p>

      <h3>Etnia</h3>
      <p>
        La investigación poblacional ha mostrado de forma consistente que las personas de ascendencia asiática tienen un
        mayor riesgo de afecciones cardiometabólicas (diabetes tipo 2, hipertensión, enfermedad cardiovascular) con
        valores de IMC más bajos en comparación con las poblaciones de ascendencia europea. La Consulta de Expertos de
        la OMS sobre el IMC en las poblaciones asiáticas recomendó que se rebajaran los umbrales de actuación para los
        adultos asiáticos — con el sobrepeso comenzando en un IMC de 23 y la obesidad en un IMC de 27,5 — para reflejar
        mejor el riesgo de salud real en estas poblaciones. Las categorías estándar de la OMS se desarrollaron
        principalmente a partir de datos de poblaciones europeas y no se trasladan limpiamente a todos los grupos
        étnicos.
      </p>

      <h3>Distribución de la grasa</h3>
      <p>
        Dónde se almacena la grasa en el cuerpo importa enormemente — posiblemente más que la masa grasa total. La grasa
        visceral, que se acumula alrededor de los órganos abdominales (hígado, páncreas, intestinos), es metabólicamente
        activa y está fuertemente asociada con la resistencia a la insulina, la inflamación y la enfermedad
        cardiovascular. La grasa subcutánea, almacenada bajo la piel especialmente en las caderas y los muslos, es menos
        dañina e incluso puede ser algo protectora. El IMC no capta ninguna de estas distinciones. Dos personas con
        idénticas puntuaciones de IMC pueden tener perfiles de salud radicalmente diferentes según dónde se almacene su
        grasa.
      </p>

      <h2>Por qué el IMC se convirtió igualmente en el estándar</h2>
      <p>
        Dadas estas limitaciones bien documentadas, es razonable preguntarse por qué el IMC ha seguido siendo tan
        dominante en la práctica clínica. La respuesta es práctica: solo requiere una báscula y una cinta métrica.
        Calcularlo lleva unos diez segundos. Es gratuito, reproducible y universalmente comprendido. Los métodos más
        sofisticados de análisis de la composición corporal — exploraciones DEXA, pesaje hidrostático, pletismografía
        por desplazamiento de aire (Bod Pod), cuantificación de grasa basada en resonancia magnética — son precisos pero
        caros, lentos y no están disponibles en la mayoría de los entornos clínicos rutinarios.
      </p>
      <p>
        El IMC cumple bien un propósito específico: es una herramienta de cribado barata a nivel poblacional que puede
        señalar rápidamente a las personas que pueden merecer una investigación más profunda. Nunca se diseñó para ser
        una herramienta de diagnóstico para individuos, y la mayoría de los investigadores y médicos que trabajan con él
        entienden esta distinción. El problema surge cuando se usa como si fuera más definitivo de lo que es.
      </p>

      <h2>Mediciones complementarias</h2>
      <p>
        Si quieres una imagen más completa de tu composición corporal y tu riesgo de salud, considera estas mediciones
        junto al IMC:
      </p>
      <ul>
        <li>
          <strong>Perímetro de la cintura:</strong> medido en el punto más estrecho del torso (o a la altura del
          ombligo). Los umbrales de alto riesgo son generalmente de 94 cm (37 in) para los hombres y 80 cm (31,5 in)
          para las mujeres, con un riesgo muy alto por encima de 102 cm (40 in) en hombres y 88 cm (34,5 in) en mujeres.
          Esto capta directamente la adiposidad central — la grasa abdominal — que el IMC no puede.
        </li>
        <li>
          <strong>Relación cintura-cadera (ICC):</strong> el perímetro de la cintura dividido por el perímetro de la
          cadera. Una ICC superior a 0,90 en hombres o 0,85 en mujeres indica obesidad abdominal según las directrices
          de la OMS.
        </li>
        <li>
          <strong>Relación cintura-altura (ICA):</strong> el perímetro de la cintura dividido por la altura. Una
          relación inferior a 0,5 se considera generalmente saludable en la mayoría de las poblaciones y edades, lo que
          la convierte en uno de los indicadores de un solo número más simples de la grasa central.
        </li>
        <li>
          <strong>Porcentaje de grasa corporal:</strong> medición directa de la fracción de tu peso que es grasa. Los
          rangos saludables son aproximadamente del 10 al 20% para los hombres y del 18 al 28% para las mujeres, aunque
          los rangos óptimos varían según la edad. El porcentaje de grasa corporal requiere métodos de medición más
          especializados.
        </li>
      </ul>

      <h2>Rango de peso saludable para tu altura</h2>
      <p>
        La fórmula del IMC puede reorganizarse para calcular qué pesos te darían un IMC en el rango Normal (18,5-24,9).
        Para encontrar tu rango de peso saludable, multiplica el cuadrado de tu altura en metros por 18,5 y 24,9:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`Healthy weight range = 18.5 × height² to 24.9 × height²

For 1.75 m:
Lower bound = 18.5 × 3.0625 = 56.7 kg
Upper bound = 24.9 × 3.0625 = 76.3 kg`}
      </pre>
      <p>
        Así que para una persona de 1,75 m de altura, un IMC Normal corresponde a un peso corporal de entre
        aproximadamente 56,7 kg y 76,3 kg — un rango de casi 20 kg. La <a href="/tools/bmi-calculator">Calculadora de
        IMC de BrowseryTools</a> muestra este rango saludable automáticamente debajo de tu resultado, para que veas
        exactamente dónde te sitúas respecto a la categoría Normal para tu altura concreta.
      </p>

      <h2>Riesgos de salud asociados a cada categoría</h2>
      <p>
        Aunque el IMC es imperfecto, sí se correlaciona con resultados de salud significativos a nivel poblacional.
        Tener un peso significativamente bajo se asocia con la desnutrición, una función inmunitaria debilitada, la
        pérdida de densidad ósea y complicaciones cardiovasculares. En el otro extremo de la escala, el sobrepeso y la
        obesidad sostenidos aumentan el riesgo estadístico de:
      </p>
      <ul>
        <li>Diabetes tipo 2 (el riesgo empieza a aumentar por encima de un IMC de 25 y se acelera por encima de 30)</li>
        <li>Hipertensión y enfermedad cardiovascular</li>
        <li>Ciertos tipos de cáncer, incluidos el colorrectal, el de mama, el de endometrio y el de riñón</li>
        <li>Apnea obstructiva del sueño</li>
        <li>Enfermedad del hígado graso no alcohólico (EHGNA)</li>
        <li>Artrosis de las articulaciones que soportan peso</li>
        <li>Mayor riesgo quirúrgico y anestésico</li>
      </ul>
      <p>
        Estas son asociaciones estadísticas entre poblaciones, no predicciones individuales. Un IMC de 28 no significa
        que vayas a desarrollar ninguna de estas afecciones — significa que, en grandes poblaciones de estudio, las
        personas con ese IMC han tenido tasas elevadas de estos resultados en comparación con las personas en el rango
        Normal.
      </p>

      <h2>Cómo usar la Calculadora de IMC de BrowseryTools</h2>
      <p>
        La <a href="/tools/bmi-calculator">Calculadora de IMC de BrowseryTools</a> está diseñada para darte un resultado
        instantáneo y claro con un contexto útil:
      </p>
      <ul>
        <li>
          <strong>Métrico o imperial:</strong> alterna entre kg/cm y lbs/pulgadas. La calculadora convierte
          automáticamente — nunca tienes que pensar en las conversiones de unidades.
        </li>
        <li>
          <strong>Resultados instantáneos:</strong> tu IMC se muestra en el momento en que introduces tu altura y peso.
          Sin botón que pulsar, sin esperas.
        </li>
        <li>
          <strong>Visualización de la categoría:</strong> el resultado muestra no solo el número, sino la categoría de
          la OMS en la que cae — Bajo peso, Normal, Sobrepeso u Obesidad — con un código de colores para mayor claridad.
        </li>
        <li>
          <strong>Rango de peso saludable:</strong> para la altura que introduzcas, la herramienta muestra el rango de
          pesos corporales que corresponden a un IMC Normal (18,5-24,9) en tu sistema de unidades seleccionado.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Tus datos nunca salen de tu dispositivo.</strong> La Calculadora de IMC se ejecuta por completo en tu
        navegador. Los valores de altura y peso que introduces se usan únicamente para el cálculo en pantalla y nunca se
        transmiten a los servidores de BrowseryTools, ni se almacenan en ninguna base de datos, ni se comparten con
        ningún tercero. No se registra nada. Cerrar la pestaña lo descarta todo.
      </div>

      <div style={{background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "8px", fontWeight: 700, fontSize: "1rem", color: "#92400e"}}>
          Aviso médico
        </p>
        <p style={{marginTop: 0, marginBottom: 0, fontSize: "0.95rem"}}>
          La Calculadora de IMC de BrowseryTools es solo una herramienta informativa. El IMC es una métrica de cribado,
          no una medida diagnóstica. El resultado que proporciona no es consejo médico y no debe usarse para tomar
          decisiones sobre tu salud, dieta o tratamiento sin consultar a un profesional sanitario cualificado. Si tienes
          inquietudes sobre tu peso, tu composición corporal o afecciones de salud relacionadas, habla con tu médico o
          con un dietista titulado.
        </p>
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calcula tu IMC al instante — métrico o imperial
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Mira tu categoría, tu rango de peso saludable y qué significa realmente el número. Sin necesidad de cuenta.
          Nada se sube ni se almacena.
        </p>
        <a
          href="/tools/bmi-calculator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Calculadora de IMC →
        </a>
      </div>
      <ToolCTA slug="bmi-calculator" variant="card" />
    </div>
  );
}
