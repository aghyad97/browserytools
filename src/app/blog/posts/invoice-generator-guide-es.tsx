import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Los autónomos y los propietarios de pequeñas empresas pierden dinero de dos maneras: haciendo
        trabajo que nunca se cobra, y facturando mal de formas que retrasan o impiden el pago. Una
        factura profesional no es solo una solicitud de pago — es un documento legal que establece
        lo que se acordó, cuándo vence el pago y cuáles son las consecuencias del pago tardío.
        Hacerlo bien importa más de lo que la mayoría de las personas se da cuenta hasta que
        están persiguiendo una factura vencida de un cliente que ha desaparecido.
      </p>
      <ToolCTA slug="invoice" variant="inline" />
      <p>
        Esta guía cubre todo lo que debe incluir una factura profesional, las convenciones de
        numeración y condiciones de pago, cómo varían los requisitos de facturación según el país,
        y por qué la herramienta adecuada para la mayoría de los autónomos es algo sencillo, gratuito
        y privado en lugar de otra suscripción.
      </p>
      <p>
        Puedes usar el{" "}
        <a href="/tools/invoice">Generador de Facturas de BrowseryTools</a> — gratuito, sin
        registro, todo permanece en tu navegador.
      </p>

      <h2>Qué Debe Incluir una Factura Profesional</h2>
      <p>
        Una factura que omite información obligatoria puede retrasar el pago, causar problemas
        contables a tu cliente o incumplir los requisitos legales de ciertas jurisdicciones. Como
        mínimo, toda factura profesional necesita:
      </p>
      <ul>
        <li>
          <strong>Número de factura</strong> — Un identificador secuencial único. Es esencial para
          el seguimiento, para el sistema de cuentas por pagar de tu cliente y para tus propios
          registros. Una vez que usas un número, nunca lo reutilices.
        </li>
        <li>
          <strong>Fecha de la factura</strong> — La fecha en que se emitió la factura. Es el punto
          de referencia desde el que se calculan las condiciones de pago.
        </li>
        <li>
          <strong>Fecha de vencimiento</strong> — La fecha en que debe recibirse el pago. Indicarlo
          explícitamente elimina la ambigüedad y te da base para hacer seguimiento una vez que
          pasa la fecha.
        </li>
        <li>
          <strong>Tus datos empresariales</strong> — Tu nombre legal o nombre comercial, dirección,
          correo electrónico y cualquier número de registro fiscal aplicable (número de IVA en la
          UE/RU, ABN en Australia, número de GST en Canadá).
        </li>
        <li>
          <strong>Datos del cliente</strong> — El nombre legal de la empresa o persona a la que
          estás facturando y su dirección de facturación. Usar el nombre de entidad incorrecto es
          un error frecuente que puede hacer que los departamentos de finanzas del cliente rechacen
          las facturas.
        </li>
        <li>
          <strong>Servicios o productos detallados</strong> — Un desglose línea por línea de lo
          entregado, la cantidad u horas, el precio unitario y el total de cada línea. Nunca envíes
          una factura de una sola línea con un número redondo — parece informal e invita a disputas.
        </li>
        <li>
          <strong>Subtotal, impuestos y total</strong> — Si cobras impuestos, muéstralos como una
          línea separada para que los clientes puedan conciliarlos con sus obligaciones fiscales.
        </li>
        <li>
          <strong>Instrucciones de pago</strong> — Datos bancarios, dirección de PayPal o método de
          pago preferido. Los clientes no pueden pagarte si no saben cómo.
        </li>
      </ul>

      <h2>Convenciones de Numeración de Facturas</h2>
      <p>
        Los números de factura deben ser secuenciales, únicos y nunca omitidos ni reutilizados. No
        existe un formato único obligatorio, pero se usan comúnmente algunos patrones:
      </p>
      <ul>
        <li><strong>Secuencial simple:</strong> 001, 002, 003 — funciona bien cuando tienes un cliente o un volumen bajo de facturas</li>
        <li><strong>Con prefijo de fecha:</strong> 2026-001, 2026-002 — el prefijo del año facilita la localización cronológica de facturas y permite reiniciar la numeración cada año sin confusión</li>
        <li><strong>Con prefijo de cliente:</strong> ACME-001, ACME-002 — útil cuando tienes un número reducido de clientes a largo plazo y quieres las facturas organizadas por relación</li>
      </ul>
      <p>
        Cualquiera que sea el formato que elijas, sé coherente. Los saltos en las secuencias de
        facturas — pasar de FAC-047 a FAC-049 — pueden levantar preguntas durante una auditoría.
        Si una factura se cancela o anula, regístralo en tus archivos pero mantén el número retirado
        en lugar de reutilizarlo.
      </p>

      <h2>Condiciones de Pago: Neto 30, Neto 15, Pago al Recibo</h2>
      <p>
        Las condiciones de pago definen cuánto tiempo tiene un cliente para pagar tras recibir la
        factura. Las condiciones más comunes son:
      </p>
      <ul>
        <li>
          <strong>Pago al recibo</strong> — Se espera el pago inmediatamente al recibir la factura.
          En la práctica rara vez se aplica estrictamente, pero señala urgencia y es adecuado para
          trabajos pequeños o puntuales con nuevos clientes.
        </li>
        <li>
          <strong>Neto 7</strong> — Pago con vencimiento a 7 días. Estándar para proyectos pequeños
          de entrega rápida o cuando hay presión de flujo de caja.
        </li>
        <li>
          <strong>Neto 15</strong> — Pago con vencimiento a 15 días. Un plazo predeterminado
          razonable para la mayoría del trabajo autónomo y la facturación de pequeñas empresas.
        </li>
        <li>
          <strong>Neto 30</strong> — Pago con vencimiento a 30 días. La condición más habitual
          en la facturación entre empresas. Las grandes empresas suelen tener ciclos de pago
          predeterminados de Neto 30, por lo que usar este plazo con clientes corporativos
          reduce fricciones.
        </li>
        <li>
          <strong>Neto 60 o Neto 90</strong> — Estándar en algunos sectores (fabricación,
          construcción, ciertos contratos gubernamentales). Evítalos a menos que sean estándar
          en tu sector — destruyen el flujo de caja para operaciones pequeñas.
        </li>
      </ul>
      <p>
        Como autónomo, Neto 15 es un buen valor predeterminado. Da a los clientes tiempo suficiente
        para procesar la factura en sus sistemas mientras mantiene tu ciclo de cobro ajustado.
        Indica siempre la fecha de vencimiento exacta (p. ej., "Vencimiento: 15 de abril de 2026")
        en lugar de confiar solo en el plazo ("Neto 15") — las fechas explícitas no dejan margen
        para interpretaciones erróneas.
      </p>

      <h2>Recargos por Retraso: Cuándo Cobrarlos y Cómo Indicarlos</h2>
      <p>
        Las comisiones por pago tardío son un mecanismo legítimo y legal para incentivar el pago
        puntual. Sin embargo, solo funcionan si se indican con antelación — idealmente en tu contrato
        y en tu factura. Sorprender a un cliente con un recargo por retraso que nunca se discutió
        daña la relación y puede no ser ejecutable.
      </p>
      <p>
        Una estructura estándar de recargo por retraso es del 1,5 % mensual (18 % anual) sobre el
        saldo pendiente. Algunos autónomos usan un enfoque de tarifa fija: 25–50 € para facturas
        inferiores a 1.000 €, escalando para importes mayores. Cualquiera es razonable. Indícalo
        en la factura como: "Se aplicará un recargo por pago tardío del 1,5 % mensual a los saldos
        pendientes después de la fecha de vencimiento."
      </p>
      <p>
        En la práctica, aplicar recargos por retraso a clientes a largo plazo requiere criterio.
        Cobrar un recargo a un buen cliente que lleva dos años pagando con fiabilidad y se retrasó
        tres días probablemente te costará más en buena voluntad de lo que recupera el recargo.
        Usa los recargos como palanca con los pagadores habitualmente tardíos, y como un derecho
        documentado que tener en reserva.
      </p>

      <h2>Cómo Difiere la Facturación Según el País</h2>
      <p>
        Las obligaciones fiscales en las facturas varían significativamente según la jurisdicción, y
        los errores pueden crear problemas de cumplimiento:
      </p>
      <ul>
        <li>
          <strong>RU y UE (IVA)</strong> — Si estás dado de alta en el IVA, debes incluir tu número
          de IVA y mostrar el IVA como una línea separada. El tipo en el RU es del 20 % estándar,
          con tipos reducidos para algunos bienes/servicios. Los tipos de la UE varían por país
          (Alemania 19 %, Francia 20 %, Irlanda 23 %). Las facturas B2B dentro de la UE requieren
          el número de IVA del cliente para la inversión del sujeto pasivo.
        </li>
        <li>
          <strong>Australia (GST)</strong> — El GST es del 10 % y debe mostrarse por separado en
          las facturas emitidas por empresas registradas en el GST. Debes incluir tu ABN (Número de
          Empresa Australiano). Las facturas superiores a 1.000 AUD también deben incluir las
          palabras "Tax Invoice" (Factura Fiscal).
        </li>
        <li>
          <strong>Canadá (GST/HST)</strong> — Las empresas registradas para GST/HST deben mostrar
          su número de registro y el GST/HST cobrado. El tipo combinado varía según la provincia.
        </li>
        <li>
          <strong>EE. UU.</strong> — La facturación federal tiene menos elementos obligatorios que
          los sistemas basados en el IVA, pero puede aplicarse el impuesto estatal sobre las ventas
          para determinados bienes y servicios. Consulta los requisitos de tu estado si vendes
          bienes tangibles.
        </li>
      </ul>

      <h2>Por Qué Importan las Facturas en PDF</h2>
      <p>
        Enviar una factura como PDF en lugar de un documento Word o un enlace web importa por varias
        razones. Los PDF tienen formato fijo — un cliente que recibe la factura ve exactamente lo que
        pretendías, independientemente de su sistema operativo o software. No se pueden editar
        accidentalmente. Se pueden imprimir, archivar y adjuntar al software contable sin que el
        formato se rompa.
      </p>
      <p>
        Muchos departamentos de contabilidad de empresas rechazan directamente las facturas que no
        son PDF, exigiendo la reentrega. Generar un PDF limpio desde el principio elimina esa fricción.
      </p>

      <h2>Herramientas de Facturación Gratuitas vs. de Pago</h2>
      <p>
        FreshBooks cobra desde 17 €/mes, QuickBooks desde 30 €/mes, y Wave (que era gratuita) ahora
        cobra por el procesamiento de pagos. Para autónomos que envían 5–20 facturas al mes, ninguna
        de estas funciones justifica el coste. Lo que realmente necesitas es: introducir líneas de
        detalle, añadir tus datos empresariales, elegir las condiciones de pago, generar un PDF.
        Eso es todo.
      </p>
      <p>
        El{" "}
        <a href="/tools/invoice">Generador de Facturas de BrowseryTools</a> hace exactamente eso —
        sin cuenta, sin suscripción y sin que nada se almacene en ningún servidor. Rellena tus datos,
        añade líneas de detalle, establece tus condiciones de pago y descarga un PDF limpio. Los datos
        de tu factura permanecen en tu navegador.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Generador de Facturas Gratuito — Salida en PDF, Sin Cuenta Necesaria
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Crea facturas profesionales con líneas de detalle, impuestos y condiciones de pago.
          Descarga en PDF al instante. Nada se almacena en nuestros servidores.
        </p>
        <a
          href="/tools/invoice"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Crear Factura →
        </a>
      </div>
      <ToolCTA slug="invoice" variant="card" />
    </div>
  );
}
