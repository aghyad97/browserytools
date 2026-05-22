export default function Content() {
  return (
    <div>
      <p>
        A maioria das pessoas toma empréstimos significativos em algum momento da vida —
        financiamento imobiliário, financiamento de veículo, empréstimo estudantil, empréstimo
        pessoal para reformas. Ainda assim, a maioria tem apenas uma compreensão vaga de como
        esses empréstimos realmente funcionam. Sabem a prestação mensal e a taxa de juros
        aproximada, e é só. Os detalhes — quanto de cada pagamento está de fato amortizando o
        principal, quanto pagarão em juros no total, o que acontece com pagamentos extras —
        permanecem opacos.
      </p>
      <p>
        Este guia explica claramente a mecânica do pagamento de empréstimos, incluindo a
        matemática real por trás das prestações mensais, o que é amortização e por que ela
        importa, a diferença importante entre CET e taxa de juros, e como comparar propostas de
        crédito de forma inteligente.
      </p>
      <p>
        Você pode usar a{" "}
        <a href="/tools/loan-calculator">BrowseryTools Calculadora de Empréstimos</a> — gratuita,
        sem cadastro, tudo fica no seu navegador.
      </p>

      <h2>A Fórmula de Pagamento de Empréstimos</h2>
      <p>
        A prestação mensal de um empréstimo a taxa fixa é calculada usando uma fórmula que leva
        em conta o principal (o valor emprestado), a taxa de juros e o prazo do empréstimo:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>
      <p>
        Onde:
      </p>
      <ul>
        <li><strong>M</strong> é a prestação mensal</li>
        <li><strong>P</strong> é o principal (o valor do empréstimo)</li>
        <li><strong>r</strong> é a taxa de juros mensal (taxa anual dividida por 12)</li>
        <li><strong>n</strong> é o número de pagamentos (prazo do empréstimo em meses)</li>
      </ul>
      <p>
        Como exemplo concreto: um financiamento de R$50.000 a 12% ao ano em 48 meses tem uma
        taxa de juros mensal de 1% (12% / 12). Aplicando na fórmula: M = 50.000 × [0,01 ×
        (1,01)^48] / [(1,01)^48 - 1] = aproximadamente R$1.316 por mês. Em 48 meses, você paga
        cerca de R$63.168 no total, ou seja, R$13.168 em juros além dos R$50.000 do principal.
      </p>
      <p>
        Você não precisa calcular isso à mão. A{" "}
        <a href="/tools/loan-calculator">BrowseryTools Calculadora de Empréstimos</a> resolve a
        fórmula instantaneamente — mas entender o que a fórmula faz ajuda a interpretar os
        resultados de forma inteligente.
      </p>

      <h2>O que Principal, Taxa de Juros e Prazo Realmente Significam</h2>
      <p>
        Essas três variáveis são a descrição completa de qualquer empréstimo a taxa fixa, e elas
        interagem de formas que nem sempre são intuitivas:
      </p>
      <ul>
        <li>
          <strong>Principal</strong> é o valor que você toma emprestado. É o saldo inicial sobre
          o qual os juros incidem. Quanto maior o principal, mais juros você paga a qualquer taxa
          e prazo — de forma proporcional.
        </li>
        <li>
          <strong>Taxa de juros</strong> é o custo anual de tomar emprestado, expresso como
          percentual do principal em aberto. Uma diferença de 1% na taxa de juros parece pequena,
          mas se compõe significativamente ao longo de um prazo longo. Em um financiamento
          imobiliário de 30 anos de R$400.000, a diferença entre 8% e 9% ao ano representa
          aproximadamente R$150.000 em juros totais pagos.
        </li>
        <li>
          <strong>Prazo</strong> é o tempo que você tem para quitar o empréstimo, expresso em
          meses ou anos. Um prazo mais longo reduz a prestação mensal, mas aumenta dramaticamente
          o total de juros pagos. Um prazo mais curto aumenta a prestação mensal, mas elimina a
          dívida mais rápido e economiza uma quantia substancial em juros.
        </li>
      </ul>

      <h2>Amortização: Por que os Pagamentos Iniciais são Majoritariamente Juros</h2>
      <p>
        Amortização é o processo de quitar uma dívida por meio de pagamentos regulares
        programados. Em um empréstimo amortizável padrão, cada prestação mensal cobre duas
        coisas: os juros acumulados sobre o saldo em aberto e uma parcela do principal.
      </p>
      <p>
        O ponto fundamental — que surpreende a maioria das pessoas — é que nos primeiros anos de
        um empréstimo, a grande maioria de cada pagamento vai para juros, e não para a redução do
        principal. Isso ocorre porque os juros são calculados sobre o saldo em aberto, que está
        no seu nível mais alto no início do empréstimo.
      </p>
      <p>
        Considere um financiamento imobiliário de 30 anos de R$300.000 a 9% ao ano. A prestação
        mensal é de aproximadamente R$2.414. No primeiro mês, cerca de R$2.250 dessa prestação
        são juros e apenas R$164 são amortização do principal. Após um ano de pagamentos —
        R$28.968 pagos — seu saldo devedor diminuiu apenas cerca de R$2.000. Por volta do ano 15,
        a proporção se inverte: mais de cada pagamento vai para o principal do que para juros.
        Nos anos finais, quase toda a prestação é amortização do principal.
      </p>
      <p>
        É por isso que pagamentos extras feitos no início de um empréstimo são tão poderosos —
        cada real extra de principal pago reduz o saldo sobre o qual os juros futuros são
        calculados, criando um efeito composto que elimina meses ou anos de pagamentos.
      </p>

      <h2>CET vs. Taxa de Juros: A Diferença que Pode Custar Milhares</h2>
      <p>
        A taxa de juros e o Custo Efetivo Total (CET) estão relacionados, mas não são iguais, e
        confundi-los é um dos erros mais comuns que as pessoas cometem ao comparar empréstimos.
      </p>
      <ul>
        <li>
          <strong>Taxa de juros</strong> é o custo de tomar emprestado o principal apenas,
          expresso como percentual. Ela determina o valor da sua prestação mensal.
        </li>
        <li>
          <strong>CET (Custo Efetivo Total)</strong> inclui a taxa de juros mais todas as taxas
          associadas ao empréstimo — taxas de cadastro, tarifa de abertura de crédito (TAC),
          seguros obrigatórios e outros custos. O CET representa o custo total real de tomar
          emprestado ao longo da vida do empréstimo.
        </li>
      </ul>
      <p>
        Um empréstimo com taxa de juros de 1,5% ao mês e R$2.000 em taxas pode ter um CET de
        1,8% ao mês. Um empréstimo concorrente com taxa de juros de 1,7% ao mês e sem taxas pode
        ter um CET de 1,7% ao mês. O primeiro empréstimo tem taxa de juros menor, mas custo real
        maior — especialmente se você quitar ou refinanciar o empréstimo antes do prazo (o que
        muitas pessoas fazem). O CET é o que você deve comparar ao buscar crédito, não a taxa
        de juros divulgada.
      </p>
      <p>
        No Brasil, as instituições financeiras são obrigadas por lei a divulgar o CET. Quando um
        credor anuncia uma taxa de juros conspicuamente baixa, olhe imediatamente para o CET —
        a diferença entre os dois frequentemente revela onde as taxas estão escondidas.
      </p>

      <h2>Como Pagamentos Extras Afetam o Total de Juros</h2>
      <p>
        Fazer pagamentos extras — mesmo modestos — sobre o principal de um empréstimo tem um
        efeito desproporcional no total de juros pagos. Como cada pagamento extra reduz o
        principal, todos os cálculos futuros de juros são sobre um saldo menor. A economia se
        compõe ao longo do tempo.
      </p>
      <p>
        Em um financiamento de 30 anos de R$300.000 a 9% ao ano, fazer um pagamento extra de
        R$500 por mês reduz o prazo do empréstimo em aproximadamente 8 anos e economiza cerca de
        R$150.000 em juros. Esses R$500 por mês — R$6.000 por ano — retornam cerca de R$150.000
        em economias. Quase nenhum investimento retorna de forma confiável esse tipo de ganho
        garantido e sem risco.
      </p>
      <p>
        O ponto importante: antes de fazer pagamentos extras, certifique-se de que seu empréstimo
        não tem multa por quitação antecipada (a maioria dos empréstimos modernos não tem, mas
        alguns contratos mais antigos têm), e confirme que o pagamento extra está sendo aplicado
        ao principal em vez de às prestações futuras — alguns credores creditam pagamentos extras
        como antecipação de parcelas, o que não tem o mesmo efeito de economia de juros.
      </p>

      <h2>Comparando Propostas de Empréstimo: Não Olhe Só para a Prestação Mensal</h2>
      <p>
        As instituições financeiras sabem que a prestação mensal é o número em que a maioria dos
        tomadores se fixa, e estruturam suas propostas de acordo. Uma prestação mensal menor
        soa atraente, mas pode mascarar um custo total muito maior se for alcançada por meio de
        um prazo mais longo ou taxas mais altas.
      </p>
      <p>
        Ao comparar propostas de empréstimo, sempre calcule e compare:
      </p>
      <ul>
        <li><strong>Total de juros pagos</strong> ao longo de toda a vida do empréstimo</li>
        <li><strong>CET</strong> — o custo real total incluindo taxas</li>
        <li><strong>Valor total pago</strong> (principal + todos os juros + todas as taxas)</li>
        <li><strong>Multa por quitação antecipada</strong> — se há custo para quitar antes do prazo</li>
        <li><strong>Taxa fixa vs. variável</strong> — empréstimos com taxa variável podem começar mais baixos, mas carregam risco de alta nos juros</li>
      </ul>
      <p>
        Dois credores podem oferecer o mesmo principal à mesma taxa, mas com estruturas de taxas
        bem diferentes. Um empréstimo com R$3.000 em taxas de abertura versus outro sem taxas e
        com taxa ligeiramente mais alta — a escolha certa depende de quanto tempo você pretende
        manter o empréstimo. Para prazos curtos, taxas menores superam taxas mais baixas. Para
        prazos longos, taxas mais baixas vencem.
      </p>

      <h2>O Custo Oculto de Estender os Prazos do Empréstimo</h2>
      <p>
        Quando as prestações mensais ficam estressantes, a resposta comum é refinanciar para um
        prazo mais longo. Isso funciona para reduzir a prestação mensal, mas o custo é
        substancial.
      </p>
      <p>
        Estender um financiamento imobiliário com 20 anos restantes de volta a 30 anos para
        reduzir prestações mensais em R$500 pode custar dezenas de milhares de reais em juros
        adicionais, além de acrescentar uma década de dívida. Essa pode ser a escolha certa em
        uma dificuldade financeira genuína — mas deve ser feita com pleno conhecimento do custo
        total, não apenas do alívio mensal.
      </p>
      <p>
        Faça as contas antes de refinanciar. A{" "}
        <a href="/tools/loan-calculator">BrowseryTools Calculadora de Empréstimos</a> permite
        comparar cenários lado a lado — ajuste o prazo e veja o impacto exato no total de juros
        pagos antes de tomar qualquer decisão.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculadora de Empréstimos Gratuita — Amortização Instantânea, Sem Conta Necessária
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Calcule prestações mensais, juros totais e tabelas de amortização completas para
          qualquer empréstimo. Compare cenários e entenda sua dívida.
        </p>
        <a
          href="/tools/loan-calculator"
          style={{background: "rgba(59,130,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Calculadora de Empréstimos →
        </a>
      </div>
    </div>
  );
}
