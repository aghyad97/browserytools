export default function Content() {
  return (
    <div>
      <p>
        La mayoría de las personas pide prestadas cantidades significativas de dinero en algún
        momento de su vida — una hipoteca, un préstamo para el coche, un préstamo estudiantil, un
        préstamo personal para reformas del hogar. Sin embargo, la mayoría tiene solo una comprensión
        vaga de cómo funcionan realmente esos préstamos. Conocen la cuota mensual y el tipo de
        interés aproximado, y eso suele ser todo. Los detalles — cuánto de cada pago reduce
        realmente el capital, cuánto interés pagarán en total, qué ocurre si hacen pagos adicionales
        — siguen siendo opacos.
      </p>
      <p>
        Esta guía explica con claridad la mecánica de la amortización de préstamos, incluyendo la
        matemática real detrás de las cuotas mensuales, qué significa la amortización y por qué
        importa, la importante diferencia entre TAE y tipo de interés, y cómo comparar ofertas de
        préstamos de forma inteligente.
      </p>
      <p>
        Puedes usar la{" "}
        <a href="/tools/loan-calculator">Calculadora de Préstamos de BrowseryTools</a> — gratuita,
        sin registro, todo permanece en tu navegador.
      </p>

      <h2>La Fórmula de la Cuota del Préstamo</h2>
      <p>
        La cuota mensual de un préstamo a tipo fijo se calcula con una fórmula que tiene en cuenta
        el capital (el importe prestado), el tipo de interés y el plazo del préstamo:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>
      <p>
        Donde:
      </p>
      <ul>
        <li><strong>M</strong> es la cuota mensual</li>
        <li><strong>P</strong> es el capital (el importe del préstamo)</li>
        <li><strong>r</strong> es el tipo de interés mensual (tipo anual dividido entre 12)</li>
        <li><strong>n</strong> es el número de pagos (plazo del préstamo en meses)</li>
      </ul>
      <p>
        Como ejemplo concreto: un préstamo para coche de 20.000 € al 6 % de interés anual a 48 meses
        tiene un tipo de interés mensual del 0,5 % (6 % / 12). Aplicando la fórmula: M = 20.000 ×
        [0,005 × (1,005)^48] / [(1,005)^48 - 1] = aproximadamente 470 € al mes. En 48 meses, pagas
        22.560 € en total, lo que significa 2.560 € en intereses además del capital de 20.000 €.
      </p>
      <p>
        No necesitas calcular esto a mano. La{" "}
        <a href="/tools/loan-calculator">Calculadora de Préstamos de BrowseryTools</a> aplica la
        fórmula al instante — pero entender lo que hace la fórmula te ayuda a interpretar los
        resultados de forma inteligente.
      </p>

      <h2>Qué Significan Realmente el Capital, el Tipo de Interés y el Plazo</h2>
      <p>
        Estas tres variables son la descripción completa de cualquier préstamo a tipo fijo, e
        interactúan de maneras que no siempre son intuitivas:
      </p>
      <ul>
        <li>
          <strong>Capital</strong> es el importe que pides prestado. Es el saldo inicial sobre el
          que se acumulan los intereses. A mayor capital, más intereses pagas a cualquier tipo y
          plazo dado — de forma proporcional.
        </li>
        <li>
          <strong>Tipo de interés</strong> es el coste anual del préstamo, expresado como porcentaje
          del capital pendiente. Una diferencia del 1 % en el tipo de interés parece pequeña pero
          se acumula significativamente a lo largo de un plazo largo. En una hipoteca a 30 años de
          400.000 €, la diferencia entre el 6 % y el 7 % supone aproximadamente 85.000 € más en
          intereses totales pagados.
        </li>
        <li>
          <strong>Plazo</strong> es el tiempo que tienes para devolver el préstamo, expresado en
          meses o años. Un plazo más largo reduce la cuota mensual pero aumenta drásticamente el
          total de intereses pagados. Un plazo más corto aumenta la cuota mensual pero te libera
          antes de la deuda y ahorra una cantidad sustancial en intereses.
        </li>
      </ul>

      <h2>Amortización: Por Qué los Pagos Iniciales Son Mayoritariamente Intereses</h2>
      <p>
        La amortización es el proceso de liquidar una deuda mediante pagos periódicos programados.
        En un préstamo amortizable estándar, cada cuota mensual cubre dos cosas: los intereses
        acumulados sobre el saldo pendiente y una parte del capital.
      </p>
      <p>
        La conclusión clave — que sorprende a la mayoría de las personas — es que en los primeros
        años de un préstamo, la gran mayoría de cada pago va a intereses en lugar de a reducir el
        capital. Esto se debe a que los intereses se calculan sobre el saldo pendiente, que está
        en su punto más alto al inicio del préstamo.
      </p>
      <p>
        Considera una hipoteca a 30 años de 300.000 € al 7 %. La cuota mensual es aproximadamente
        1.996 €. En el primer mes, unos 1.750 € de ese pago son intereses y solo 246 € son capital.
        Tras un año de pagos — 23.952 € pagados — el saldo del préstamo solo habrá disminuido unos
        3.000 €. En el año 15, la distribución cambia: más de cada pago va al capital que a los
        intereses. En los últimos años, casi todo el pago es capital.
      </p>
      <p>
        Por eso los pagos adicionales realizados al inicio del préstamo son tan poderosos — cada
        euro adicional de capital pagado reduce el saldo sobre el que se calcularán los intereses
        futuros, creando un efecto compuesto que elimina meses o años de pagos.
      </p>

      <h2>TAE vs. Tipo de Interés: La Diferencia Que Te Cuesta Miles</h2>
      <p>
        El tipo de interés y la Tasa Anual Equivalente (TAE) están relacionados pero no son lo mismo,
        y confundirlos es uno de los errores más comunes que comete la gente al comparar préstamos.
      </p>
      <ul>
        <li>
          <strong>Tipo de interés</strong> es el coste de pedir prestado el capital únicamente,
          expresado como porcentaje. Determina el importe de tu cuota mensual.
        </li>
        <li>
          <strong>TAE</strong> incluye el tipo de interés más todas las comisiones asociadas al
          préstamo — comisiones de apertura, comisiones de intermediación, puntos de descuento,
          seguro hipotecario y otros costes. La TAE representa el coste total real del préstamo
          durante toda su vida.
        </li>
      </ul>
      <p>
        Un préstamo con un tipo de interés del 6,5 % y 5.000 € en comisiones puede tener una TAE
        del 6,9 %. Un préstamo competidor con un tipo de interés del 6,75 % y sin comisiones puede
        tener una TAE del 6,75 %. El primer préstamo tiene un tipo de interés más bajo pero un
        coste real más alto — especialmente si cancelas o refinancias el préstamo antes del plazo
        (lo que hace mucha gente). La TAE es lo que debes comparar al buscar préstamos, no el tipo
        de interés anunciado.
      </p>
      <p>
        En EE. UU., los prestamistas están legalmente obligados a divulgar la TAE. En el RU, la TAE
        representativa es el indicador de comparación estándar. Cuando un prestamista anuncia un
        tipo de interés llamativamente bajo, mira inmediatamente la TAE — la brecha entre ambos
        suele revelar dónde están ocultas las comisiones.
      </p>

      <h2>Cómo los Pagos Adicionales Afectan al Total de Intereses</h2>
      <p>
        Realizar pagos adicionales — aunque sean modestos — sobre el capital de un préstamo tiene
        un efecto desproporcionado en el total de intereses pagados. Dado que cada pago adicional
        reduce el capital, todos los cálculos futuros de intereses se hacen sobre un saldo menor.
        El ahorro se acumula con el tiempo.
      </p>
      <p>
        En una hipoteca a 30 años de 300.000 € al 7 %, realizar un pago adicional de 200 € al mes
        reduce el plazo del préstamo en aproximadamente 5 años y ahorra unos 80.000 € en intereses.
        Esos 200 € al mes — 2.400 € al año — generan unos 80.000 € en ahorros. Casi ninguna
        inversión devuelve de forma fiable ese tipo de ganancia garantizada y sin riesgo.
      </p>
      <p>
        El matiz importante: antes de realizar pagos adicionales, asegúrate de que tu préstamo no
        tiene penalización por amortización anticipada (la mayoría de los préstamos modernos no la
        tienen, pero algunos préstamos más antiguos sí), y confirma que el pago adicional se aplica
        al capital en lugar de a una cuota futura — algunos prestamistas acreditan por defecto los
        pagos adicionales como cuotas anticipadas, lo cual no tiene el mismo efecto de ahorro en
        intereses.
      </p>

      <h2>Comparar Ofertas de Préstamos: No Te Fijes Solo en la Cuota Mensual</h2>
      <p>
        Los prestamistas saben que la cuota mensual es el número en el que la mayoría de los
        prestatarios se fija, y estructuran sus ofertas en consecuencia. Una cuota mensual más baja
        suena atractiva pero puede ocultar un coste total mucho mayor si se logra mediante un plazo
        más largo o comisiones más altas.
      </p>
      <p>
        Al comparar ofertas de préstamos, calcula y compara siempre:
      </p>
      <ul>
        <li><strong>Total de intereses pagados</strong> durante toda la vida del préstamo</li>
        <li><strong>TAE</strong> — el coste real todo incluido con comisiones</li>
        <li><strong>Importe total reembolsado</strong> (capital + todos los intereses + todas las comisiones)</li>
        <li><strong>Penalización por amortización anticipada</strong> — si existe un coste por pagar antes de plazo</li>
        <li><strong>Tipo fijo vs. variable</strong> — los préstamos a tipo variable pueden empezar más bajos pero conllevan riesgo de tipo de interés</li>
      </ul>
      <p>
        Dos prestamistas podrían ofrecer el mismo capital al mismo tipo de interés pero con
        estructuras de comisiones muy diferentes. Un préstamo con 3.000 € en comisiones de apertura
        frente a uno sin comisiones y un tipo ligeramente superior — la elección correcta depende
        de cuánto tiempo planeas mantener el préstamo. Para periodos cortos, comisiones más bajas
        superan a tipos más bajos. Para plazos largos, ganan los tipos más bajos.
      </p>

      <h2>El Coste Oculto de Ampliar los Plazos del Préstamo</h2>
      <p>
        Cuando las cuotas mensuales se vuelven agobiantes, la respuesta habitual es refinanciar a un
        plazo más largo. Esto funciona para reducir la cuota mensual, pero el coste es sustancial.
      </p>
      <p>
        Ampliar una hipoteca con 20 años restantes a 30 años para reducir las cuotas mensuales en
        200 € puede costar decenas de miles de euros en intereses adicionales al tiempo que añade
        una década de deuda. Esto puede ser la elección correcta en una dificultad financiera
        genuina — pero debe tomarse con plena consciencia del coste total, no solo del alivio
        mensual.
      </p>
      <p>
        Calcula los números antes de refinanciar. La{" "}
        <a href="/tools/loan-calculator">Calculadora de Préstamos de BrowseryTools</a> te permite
        comparar escenarios en paralelo — ajusta el plazo y observa el impacto exacto sobre el
        total de intereses pagados antes de tomar ninguna decisión.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculadora de Préstamos Gratuita — Amortización Instantánea, Sin Cuenta Necesaria
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Calcula cuotas mensuales, intereses totales y cuadros de amortización completos para
          cualquier préstamo. Compara escenarios y entiende tu deuda.
        </p>
        <a
          href="/tools/loan-calculator"
          style={{background: "rgba(59,130,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Calculadora de Préstamos →
        </a>
      </div>
    </div>
  );
}
