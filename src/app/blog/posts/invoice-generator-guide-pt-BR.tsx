import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Freelancers e pequenos empresários perdem dinheiro de duas formas: fazendo trabalhos que
        nunca são pagos, e emitindo faturas de forma inadequada, o que atrasa ou impede o
        pagamento. Uma fatura profissional não é apenas uma solicitação de pagamento — é um
        documento legal que estabelece o que foi acordado, quando o pagamento vence e quais são
        as consequências do atraso. Acertar isso importa mais do que a maioria percebe, até
        o momento em que estão tentando cobrar uma fatura vencida de um cliente que sumiu.
      </p>
      <ToolCTA slug="invoice" variant="inline" />
      <p>
        Este guia cobre tudo que uma fatura profissional deve incluir, as convenções de numeração
        e prazos de pagamento, como os requisitos de faturamento diferem por país e por que a
        ferramenta certa para a maioria dos freelancers é algo simples, gratuito e privado —
        e não mais uma assinatura.
      </p>
      <p>
        Você pode usar o{" "}
        <a href="/tools/invoice">BrowseryTools Invoice Generator</a> — gratuito, sem cadastro,
        tudo fica no seu navegador.
      </p>

      <h2>O que uma Fatura Profissional Deve Incluir</h2>
      <p>
        Uma fatura que omite informações obrigatórias pode atrasar o pagamento, causar problemas
        contábeis para o seu cliente ou deixar de atender aos requisitos legais de determinadas
        jurisdições. No mínimo, toda fatura profissional precisa conter:
      </p>
      <ul>
        <li>
          <strong>Número da fatura</strong> — Um identificador sequencial único. É essencial para
          rastreamento, para o sistema de contas a pagar do cliente e para seus próprios registros.
          Depois de usar um número, nunca o reutilize.
        </li>
        <li>
          <strong>Data da fatura</strong> — A data em que a fatura foi emitida. É o ponto de
          referência a partir do qual os prazos de pagamento são calculados.
        </li>
        <li>
          <strong>Data de vencimento</strong> — A data até a qual o pagamento deve ser recebido.
          Declarar isso explicitamente elimina ambiguidades e dá a você base para cobrar após
          o prazo.
        </li>
        <li>
          <strong>Seus dados comerciais</strong> — Seu nome legal ou nome comercial, endereço,
          e-mail e quaisquer números de registro fiscal aplicáveis (CNPJ no Brasil, VAT number na
          UE/Reino Unido, ABN na Austrália, GST number no Canadá).
        </li>
        <li>
          <strong>Dados do cliente</strong> — O nome legal da empresa ou pessoa física que está
          sendo cobrada e o endereço de cobrança. Usar o nome de entidade errado é um erro comum
          que pode fazer as faturas serem rejeitadas pelos departamentos financeiros dos clientes.
        </li>
        <li>
          <strong>Serviços ou produtos discriminados</strong> — Um detalhamento linha por linha
          do que foi entregue, a quantidade ou horas, o preço unitário e o total da linha. Nunca
          envie uma fatura com uma única linha de valor redondo — parece informal e convida a
          contestações.
        </li>
        <li>
          <strong>Subtotal, impostos e total</strong> — Se você cobra impostos, mostre-os como
          uma linha separada para que os clientes possam reconciliá-los com suas obrigações
          tributárias.
        </li>
        <li>
          <strong>Instruções de pagamento</strong> — Dados bancários, endereço PayPal ou método
          de pagamento preferido. Os clientes não conseguem pagar se não souberem como.
        </li>
      </ul>

      <h2>Convenções de Numeração de Faturas</h2>
      <p>
        Os números de fatura devem ser sequenciais, únicos e nunca pulados ou reutilizados. Não
        há um formato único obrigatório, mas alguns padrões são de uso comum:
      </p>
      <ul>
        <li><strong>Sequencial simples:</strong> 001, 002, 003 — funciona bem quando você tem poucos clientes ou baixo volume de faturas</li>
        <li><strong>Com prefixo de data:</strong> 2026-001, 2026-002 — o prefixo do ano facilita localizar faturas cronologicamente e reiniciar a numeração a cada ano sem confusão</li>
        <li><strong>Com prefixo do cliente:</strong> ACME-001, ACME-002 — útil quando você tem um número pequeno de clientes de longo prazo e quer faturas organizadas por relacionamento</li>
      </ul>
      <p>
        Qualquer formato que você escolher, seja consistente. Lacunas nas sequências de faturas —
        quando você pula de INV-047 para INV-049 — podem levantar questões durante uma auditoria.
        Se uma fatura for cancelada ou anulada, registre isso nos seus arquivos mas mantenha o
        número aposentado em vez de reutilizá-lo.
      </p>

      <h2>Prazos de Pagamento Explicados: Net 30, Net 15, Vencimento no Recebimento</h2>
      <p>
        Os prazos de pagamento definem por quanto tempo o cliente tem para pagar após receber a
        fatura. Os termos mais comuns são:
      </p>
      <ul>
        <li>
          <strong>Vencimento no Recebimento</strong> — O pagamento é esperado imediatamente ao
          receber a fatura. Na prática, raramente é cumprido com rigor, mas sinaliza urgência e é
          adequado para trabalhos pequenos ou pontuais com novos clientes.
        </li>
        <li>
          <strong>Net 7</strong> — Pagamento devido em 7 dias. Padrão para projetos pequenos e
          de entrega rápida ou quando há pressão de fluxo de caixa.
        </li>
        <li>
          <strong>Net 15</strong> — Pagamento devido em 15 dias. Um padrão razoável para a
          maioria dos trabalhos freelance e faturamento de pequenas empresas.
        </li>
        <li>
          <strong>Net 30</strong> — Pagamento devido em 30 dias. O prazo mais comum em
          faturamento B2B. Grandes empresas frequentemente têm ciclos de pagamento padrão de
          Net 30, por isso usar esse prazo com clientes corporativos reduz o atrito.
        </li>
        <li>
          <strong>Net 60 ou Net 90</strong> — Padrão em alguns setores (manufatura, construção,
          certos contratos governamentais). Evite esses prazos a menos que sejam padrão do setor
          na sua área — eles destroem o fluxo de caixa de operações pequenas.
        </li>
      </ul>
      <p>
        Para freelancers, Net 15 é um bom padrão. Dá aos clientes tempo suficiente para processar
        a fatura em seus sistemas enquanto mantém seu ciclo de caixa enxuto. Sempre declare a data
        de vencimento exata explicitamente (por exemplo, "Vencimento: 15 de abril de 2026") em vez
        de depender apenas do prazo ("Net 15") — datas explícitas não deixam margem para
        mal-entendidos.
      </p>

      <h2>Multas por Atraso: Quando Cobrar e Como Declarar</h2>
      <p>
        Multas por atraso são um mecanismo legítimo e legal para incentivar o pagamento pontual.
        No entanto, elas só funcionam se forem declaradas antecipadamente — idealmente no contrato
        e na fatura. Surpreender um cliente com uma multa por atraso que nunca foi discutida
        prejudica o relacionamento e pode não ser executável.
      </p>
      <p>
        Uma estrutura padrão de multa por atraso é 1,5% ao mês (18% ao ano) sobre o saldo
        pendente. Alguns freelancers usam uma abordagem de taxa fixa: R$100–200 para faturas
        abaixo de R$5.000, com escalonamento para valores maiores. Ambas são razoáveis. Declare
        na fatura como: "Será aplicada uma multa por atraso de 1,5% ao mês sobre saldos
        pendentes além da data de vencimento."
      </p>
      <p>
        Na prática, aplicar multas por atraso a clientes de longo prazo requer bom senso. Cobrar
        uma multa de três dias de atraso de um bom cliente que pagou com confiabilidade por dois
        anos provavelmente custará mais em boa vontade do que a multa recupera. Use as multas
        como alavanca com pagadores habitualmente atrasados, e como um direito documentado a ter
        em reserva.
      </p>

      <h2>Como o Faturamento Difere por País</h2>
      <p>
        As obrigações fiscais nas faturas variam significativamente por jurisdição, e erros podem
        criar problemas de conformidade:
      </p>
      <ul>
        <li>
          <strong>Reino Unido e UE (IVA/VAT)</strong> — Se você é registrado para IVA, deve
          incluir seu número de IVA e mostrar o IVA como uma linha separada. A alíquota no Reino
          Unido é 20% padrão, com alíquotas reduzidas para alguns bens/serviços. As alíquotas da
          UE variam por país (Alemanha 19%, França 20%, Irlanda 23%). Faturas B2B dentro da UE
          exigem o número de IVA do cliente para tratamento de reversão de encargo.
        </li>
        <li>
          <strong>Austrália (GST)</strong> — O GST é 10% e deve ser mostrado separadamente em
          faturas emitidas por empresas registradas no GST. Você deve incluir seu ABN (Australian
          Business Number). Faturas acima de AUD$1.000 também devem incluir as palavras
          "Tax Invoice".
        </li>
        <li>
          <strong>Canadá (GST/HST)</strong> — Empresas registradas para GST/HST devem mostrar
          seu número de registro e o GST/HST cobrado. A alíquota combinada varia por província.
        </li>
        <li>
          <strong>Brasil (NF-e/NFS-e)</strong> — Empresas brasileiras devem emitir Nota Fiscal
          eletrônica (NF-e para produtos, NFS-e para serviços). Os impostos incidentes (ISS, PIS,
          COFINS, CSLL, IRPJ) variam conforme o regime tributário e o tipo de serviço.
        </li>
      </ul>

      <h2>Por que Faturas em PDF são Importantes</h2>
      <p>
        Enviar uma fatura em PDF em vez de um documento Word ou link da web importa por vários
        motivos. PDFs têm formato fixo — o cliente que recebe a fatura vê exatamente o que você
        pretendia, independentemente do sistema operacional ou software. Eles não podem ser
        editados acidentalmente. Podem ser impressos, arquivados e anexados a softwares de
        contabilidade sem quebrar a formatação.
      </p>
      <p>
        Muitos departamentos de contabilidade de empresas rejeitam faturas que não são PDF,
        exigindo reenvio. Gerar um PDF limpo desde o início elimina esse atrito.
      </p>

      <h2>Ferramentas de Faturamento Gratuitas vs. Pagas</h2>
      <p>
        FreshBooks cobra a partir de US$17/mês, QuickBooks a partir de US$30/mês, e Wave (que era
        gratuito) agora cobra pelo processamento de pagamentos. Para freelancers que enviam 5–20
        faturas por mês, nenhum desses recursos justifica o custo. O que você realmente precisa
        é: inserir itens de linha, adicionar seus dados comerciais, escolher os prazos de
        pagamento, gerar um PDF. Só isso.
      </p>
      <p>
        O{" "}
        <a href="/tools/invoice">BrowseryTools Invoice Generator</a> faz exatamente isso — sem
        conta, sem assinatura e nada armazenado em nenhum servidor. Preencha seus dados, adicione
        itens de linha, defina seus prazos de pagamento e baixe um PDF limpo. Os dados da sua
        fatura ficam no seu navegador.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Gerador de Faturas Gratuito — Saída em PDF, Sem Conta Necessária
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Crie faturas profissionais com itens detalhados, impostos e prazos de pagamento.
          Baixe em PDF instantaneamente. Nada armazenado em nossos servidores.
        </p>
        <a
          href="/tools/invoice"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Criar Fatura →
        </a>
      </div>
      <ToolCTA slug="invoice" variant="card" />
    </div>
  );
}
