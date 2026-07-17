import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Pergunte à maioria das pessoas onde foi parar o dinheiro do mês passado e você receberá
        uma estimativa vaga, um encolher de ombros ou uma expressão levemente ansiosa. A realidade
        é que a maioria não faz a menor ideia. Sabem mais ou menos o que ganham, sabem o valor do
        aluguel e que gastaram alguma coisa com comida. Todo o resto é uma névoa de transações de
        cartão que nunca vão revisar. Isso não é um defeito de caráter — é um problema de design.
        O dinheiro sai das contas em silêncio e de forma invisível, e nada na vida financeira
        típica nos incentiva a prestar atenção.
      </p>
      <ToolCTA slug="expense-tracker" variant="inline" />
      <p>
        A solução não é complicada, mas exige uma coisa: olhar de fato para os números. Este guia
        aborda por que a maioria das pessoas perde o controle dos gastos, os frameworks mais
        práticos para organizar despesas e como fazer uma revisão mensal simples sem baixar um app,
        criar uma conta ou pagar uma assinatura.
      </p>
      <p>
        Você pode usar o{" "}
        <a href="/tools/expense-tracker">BrowseryTools Expense Tracker</a> — gratuito, sem
        cadastro, tudo fica no seu navegador.
      </p>

      <h2>Por que a Maioria das Pessoas Não Sabe para Onde Vai o Dinheiro</h2>
      <p>
        O consumo moderno foi projetado para ser sem atrito. Pagamentos por aproximação,
        renovações automáticas e compras com um clique eliminaram quase todos os pequenos momentos
        de hesitação que costumavam acompanhar os gastos. Houve uma época em que pagar em dinheiro
        significava entregar fisicamente as cédulas — o que, curiosamente, era uma forma
        surpreendentemente eficaz de sentir o custo de algo. Os pagamentos digitais eliminaram
        esse atrito de propósito. Quanto mais fácil gastar, mais se gasta.
      </p>
      <p>
        Agravando isso está a economia de assinaturas. Uma cobrança de R$49,90 por um serviço de
        streaming, R$24,90 por armazenamento em nuvem, R$39,90 por um app de música, R$29,90 por
        um site de notícias — nenhuma delas parece significativa individualmente. Mas juntas podem
        facilmente somar R$300–600 por mês sem que você jamais tenha decidido conscientemente
        gastar tanto. Cobranças de assinatura são particularmente insidiosas porque acontecem
        automaticamente, são fáceis de esquecer e cancelá-las exige esforço ativo.
      </p>
      <p>
        O primeiro passo para recuperar o controle das finanças é simplesmente tornar o invisível
        visível. Cada despesa, anotada em um só lugar, em categorias claras.
      </p>

      <h2>A Regra 50/30/20: Um Framework Simples que Realmente Funciona</h2>
      <p>
        Existem dezenas de frameworks de orçamento, mas a regra 50/30/20 — popularizada pela
        senadora Elizabeth Warren em seu livro de 2005 <em>All Your Worth</em> — é a mais
        amplamente útil porque é simples o suficiente para ser aplicada de verdade e flexível o
        bastante para se adaptar a diferentes níveis de renda.
      </p>
      <ul>
        <li>
          <strong>50% em necessidades</strong> — Moradia, serviços públicos, alimentação,
          transporte, seguro, pagamentos mínimos de dívidas. São coisas que você não consegue
          cortar razoavelmente sem uma grande mudança de vida. Se suas necessidades ultrapassam
          50% da sua renda líquida, esse é o sinal financeiro mais importante que você tem:
          sua estrutura de custos fixos é alta demais em relação à sua renda.
        </li>
        <li>
          <strong>30% em desejos</strong> — Restaurantes, entretenimento, assinaturas, viagens,
          compras, hobbies. São coisas que melhoram sua qualidade de vida, mas são discricionárias.
          É nessa categoria que vive a maior parte dos gastos não examinados.
        </li>
        <li>
          <strong>20% em poupança e dívidas</strong> — Reserva de emergência, previdência,
          investimentos, pagamento acima do mínimo em dívidas. Essa categoria é o motor do
          progresso financeiro. Se você nunca chega a ela porque necessidades e desejos consumiram
          tudo, você permanecerá exatamente onde está financeiramente, indefinidamente.
        </li>
      </ul>
      <p>
        A regra 50/30/20 não é um framework perfeito para todos — quem está quitando dívidas com
        juros altos pode alocar mais agressivamente para o pagamento, e quem mora em uma cidade
        cara pode achar a meta de 50% para necessidades impossível. Mas é um diagnóstico
        extremamente útil. Categorize as despesas do mês passado nesses três grupos e você
        imediatamente verá qual área está fora de equilíbrio.
      </p>

      <h2>Despesas Fixas vs. Variáveis: A Distinção que Muda Como Você Orça</h2>
      <p>
        Uma das formas mais práticas de analisar seus gastos é separar as despesas fixas das
        variáveis. Despesas fixas são o mesmo valor todo mês: aluguel ou prestação, prestação do
        carro, prêmios de seguro, parcelas de empréstimos, a maioria das assinaturas. Despesas
        variáveis mudam todo mês: alimentação, restaurantes, combustível, entretenimento, roupas,
        viagens.
      </p>
      <p>
        Essa distinção importa porque você as aborda de maneiras diferentes. Despesas fixas só
        podem ser reduzidas por meio de renegociação (refinanciar um empréstimo, encontrar um
        seguro mais barato, mudar para uma moradia menos cara) ou eliminação (cancelar uma
        assinatura, quitar uma dívida). Essas são decisões grandes e pouco frequentes. Despesas
        variáveis podem ser ajustadas todo mês por meio de escolhas cotidianas — elas respondem
        diretamente à atenção e à intenção.
      </p>
      <p>
        A maioria das pessoas que controla despesas pela primeira vez se surpreende não com os
        custos fixos (esses são conhecidos), mas com os variáveis. Restaurantes, delivery e
        compras por impulso são as categorias que consistentemente excedem as estimativas das
        pessoas pela margem mais ampla.
      </p>

      <h2>Por que Apps de Controle de Despesas São Exagero para a Maioria</h2>
      <p>
        Apps como YNAB (You Need A Budget) cobram cerca de US$100 por ano e têm uma curva de
        aprendizado tão acentuada que publicam cursos inteiros sobre como usá-los. O Mint era
        gratuito, mas foi descontinuado em 2024. A maioria dos apps de orçamento exige conexão
        com a conta bancária, o que significa conceder acesso de leitura aos seus dados
        financeiros a terceiros — uma concessão de privacidade nada desprezível.
      </p>
      <p>
        O argumento é que a importação automática de transações elimina o atrito do lançamento
        manual. É verdade. Mas também elimina o único momento de atrito que faz o controle de
        despesas realmente funcionar: o momento em que você deliberadamente digita uma compra e
        a atribui a uma categoria. Esse momento de revisão consciente é onde a mudança
        comportamental acontece. A importação automática o remove.
      </p>
      <p>
        Para a maioria das pessoas, um registro simples do que foi gasto, organizado por
        categoria, é tudo o que precisam. Você não precisa de orçamentos de base zero rotativos,
        sincronização automática com o banco ou um painel de relatórios. Você precisa saber para
        onde foi o dinheiro, uma vez por mês, para fazer um ou dois ajustes deliberados. Essa é
        uma tarefa que requer uma lista e um pouco de aritmética — não uma assinatura SaaS de
        R$500/ano.
      </p>

      <h2>Categorias que Mais Importam</h2>
      <p>
        Ao configurar categorias de despesas, menos é mais. Categorias demais criam sobrecarga e
        ambiguidade. Um conjunto prático para a maioria dos lares:
      </p>
      <ul>
        <li><strong>Moradia</strong> — Aluguel ou prestação, contas, internet, manutenção do lar</li>
        <li><strong>Alimentação</strong> — Supermercado, restaurantes, delivery, café</li>
        <li><strong>Transporte</strong> — Combustível, prestação do carro, transporte público, estacionamento, aplicativos de mobilidade</li>
        <li><strong>Saúde</strong> — Plano de saúde, academia, remédios, consultas médicas</li>
        <li><strong>Assinaturas</strong> — Streaming, software, notícias, apps</li>
        <li><strong>Compras</strong> — Roupas, eletrônicos, itens domésticos</li>
        <li><strong>Lazer</strong> — Eventos, hobbies, viagens</li>
        <li><strong>Poupança/Investimentos</strong> — Qualquer transferência para fora das contas de gastos</li>
      </ul>
      <p>
        Oito categorias são suficientes para contar uma história clara sobre seus gastos. Adicione
        mais apenas se uma parte significativa dos seus gastos não se encaixar claramente em
        nenhuma delas.
      </p>

      <h2>Como Fazer uma Revisão Mensal de Despesas</h2>
      <p>
        Escolha um dia no final de cada mês — o último domingo, o primeiro do mês seguinte, quando
        for mais consistente — e passe 20 minutos revisando os extratos bancários e de cartão.
        Registre cada transação em uma categoria. O objetivo não é julgamento; é informação.
      </p>
      <p>
        Depois de ter os números:
      </p>
      <ul>
        <li>Compare com a divisão 50/30/20 para ver qual grupo está ultrapassando o limite</li>
        <li>Procure assinaturas esquecidas ou que você não usa mais</li>
        <li>Identifique uma ou duas categorias variáveis onde os gastos superaram sua estimativa mental</li>
        <li>Defina uma intenção concreta para o próximo mês — não uma reformulação completa, apenas uma mudança</li>
      </ul>
      <p>
        O poder de uma revisão mensal não está na revisão em si — está na consciência que ela cria
        para o mês seguinte. Pessoas que controlam despesas consistentemente gastam menos em itens
        discricionários não porque estabelecem limites rígidos, mas porque a consciência de para
        onde vai o dinheiro muda o comportamento automaticamente.
      </p>

      <h2>O que Fazer com os Dados Depois de Tê-los</h2>
      <p>
        Três meses de dados de despesas são suficientes para estabelecer uma linha de base. Você
        verá padrões: os meses em que viagens ou eventos elevaram os gastos, as categorias que são
        consistentemente altas, as assinaturas que se acumularam silenciosamente. Com uma linha de
        base, você pode definir metas realistas em vez de arbitrárias.
      </p>
      <p>
        A ação de maior alavancagem que a maioria das pessoas pode tomar após a primeira revisão
        de despesas é cancelar assinaturas esquecidas. Uma única auditoria de cobranças recorrentes
        tipicamente recupera R$100–300 por mês para o domicílio médio. Isso equivale a
        R$1.200–3.600 por ano recuperados em 30 minutos de trabalho.
      </p>
      <p>
        Depois disso, a próxima maior alavancagem costuma ser a categoria de alimentação —
        especialmente a relação entre supermercado e restaurantes. Cozinhar uma ou duas refeições
        a mais em casa por semana é consistentemente a otimização de orçamento com melhor
        relação custo-benefício.
      </p>

      <div style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Controle de Despesas Gratuito — Sem Conta, Sem Sincronização, Totalmente Privado
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Registre despesas por categoria, gere resumos mensais e mantenha todos os seus dados
          no navegador. Sem assinatura, sem conexão bancária necessária.
        </p>
        <a
          href="/tools/expense-tracker"
          style={{background: "rgba(16,185,129,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Expense Tracker →
        </a>
      </div>
      <ToolCTA slug="expense-tracker" variant="card" />
    </div>
  );
}
