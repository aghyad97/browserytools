export default function Content() {
  return (
    <div>
      <p>
        As APIs de IA tornaram incrivelmente fácil integrar grandes modelos de linguagem em
        aplicações — mas também tornaram incrivelmente fácil queimar o orçamento sem perceber.
        O preço baseado em tokens não é óbvio à primeira vista, e a diferença entre custos de
        entrada e saída, camadas de modelos e volume de requisições pode gerar faturas ordens
        de magnitude maiores do que o esperado. Alguns minutos de estimativa antecipada podem
        evitar muitas surpresas desagradáveis nas cobranças futuras.
      </p>
      <p>
        Você pode usar a{" "}
        <a href="/tools/ai-cost-calculator">Calculadora de Custos de IA do BrowseryTools</a> —
        gratuita, sem cadastro, tudo fica no seu navegador — para modelar seus custos com GPT-4,
        Claude, Gemini e outros modelos principais antes de escrever uma única linha de código.
      </p>

      <h2>Como Funciona o Preço Baseado em Tokens</h2>
      <p>
        Toda API de IA principal — OpenAI, Anthropic, Google — cobra por token, não por requisição
        ou por segundo. Um token equivale a aproximadamente 3–4 caracteres de texto em inglês, ou
        cerca de 0,75 palavras. Quando você envia um prompt para uma API, o provedor conta os
        tokens na sua entrada, gera uma resposta, conta esses tokens de saída e cobra por ambos —
        a taxas diferentes.
      </p>
      <p>
        Os preços são cotados por 1.000 tokens (às vezes por 1 milhão de tokens nas novas camadas
        de preços de alto volume). No início de 2026, valores de referência aproximados são:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — ~US$2,50 por 1M tokens de entrada, ~US$10,00 por 1M tokens de saída</li>
        <li><strong>Claude 3.5 Sonnet</strong> — ~US$3,00 por 1M tokens de entrada, ~US$15,00 por 1M tokens de saída</li>
        <li><strong>Gemini 1.5 Pro</strong> — ~US$1,25 por 1M tokens de entrada, ~US$5,00 por 1M tokens de saída</li>
        <li><strong>GPT-4o mini</strong> — ~US$0,15 por 1M tokens de entrada, ~US$0,60 por 1M tokens de saída</li>
        <li><strong>Claude 3 Haiku</strong> — ~US$0,25 por 1M tokens de entrada, ~US$1,25 por 1M tokens de saída</li>
      </ul>
      <p>
        Esses números mudam conforme os modelos são atualizados, portanto sempre verifique na
        página de preços atual do provedor. O ponto principal é a diferença entre preços de entrada
        e saída: os tokens de saída tipicamente custam 3–5x mais do que os de entrada para o
        mesmo modelo.
      </p>

      <h2>Por que os Tokens de Saída Custam Mais</h2>
      <p>
        A assimetria entre preços de entrada e saída reflete diferenças computacionais reais.
        Processar um token de entrada (durante a fase de "pré-preenchimento") envolve uma única
        passagem pela frente pelas camadas de atenção do modelo. Gerar cada token de saída
        (durante a "decodificação") requer uma passagem separada — serialmente, um token de cada
        vez — o que é muito mais intensivo computacionalmente em escala.
      </p>
      <p>
        Isso tem uma implicação direta para a estimativa de custos: sua contagem de tokens de
        saída importa mais do que a contagem de tokens de entrada. Um prompt de sistema de 500
        tokens que produz uma resposta de 1.500 tokens custa mais na saída do que toda a entrada
        custou. Se você está projetando um recurso que gera documentos longos, relatórios ou
        arquivos de código, modele cuidadosamente o tamanho da saída — ele domina a fatura.
      </p>

      <h2>Estimando Custos Mensais: Um Framework</h2>
      <p>
        Para estimar seus gastos mensais com API de IA, você precisa de quatro números:
      </p>
      <ul>
        <li><strong>Tokens de entrada médios por requisição</strong> — seu prompt de sistema + mensagem do usuário + qualquer contexto</li>
        <li><strong>Tokens de saída médios por requisição</strong> — o comprimento típico da resposta do modelo</li>
        <li><strong>Requisições por dia</strong> — seu volume de chamadas diário esperado em escala</li>
        <li><strong>Preços do modelo</strong> — custo de entrada e saída por 1M tokens para o modelo que você planeja usar</li>
      </ul>
      <p>
        A fórmula:{" "}
        <code>(tokens_entrada_médios × preço_entrada + tokens_saída_médios × preço_saída) × requisições_por_dia × 30</code>.
        Parece simples, mas estimar contagens de tokens antes de ter dados reais é onde a maioria
        das pessoas erra. Um prompt de sistema "curto" que parece ter 50 palavras pode facilmente
        ter 80–100 tokens. Uma pergunta do usuário mais o histórico da conversa em um aplicativo
        de chat pode crescer para milhares de tokens por requisição sem um gerenciamento cuidadoso.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Exemplo: bot de suporte ao cliente
avg_input_tokens  = 800   // system prompt + mensagem do usuário + histórico
avg_output_tokens = 300   // resposta típica de suporte
requests_per_day  = 5000  // volume moderado de produção
model             = Claude 3.5 Sonnet

daily_cost = (800 × $0.003 + 300 × $0.015) por 1K tokens × 5000
           = ($2.40 + $4.50) × 5
           = ~$34.50/dia → ~$1,035/mês`}
      </pre>
      <p>
        A mesma carga de trabalho no GPT-4o mini a US$0,15/US$0,60 por 1M tokens custaria cerca
        de US$15/mês. A escolha do modelo sozinha é uma diferença de custo de 70x para essa carga
        de trabalho.
      </p>

      <h2>Estratégias Práticas para Reduzir Custos de API de IA</h2>
      <p>
        Depois de ter uma estimativa de custo, o próximo passo é identificar onde cortar. Estas
        são as técnicas de maior alavancagem:
      </p>
      <ul>
        <li>
          <strong>Escolha a camada de modelo certa</strong> — Use modelos poderosos (GPT-4,
          Claude Sonnet, Gemini Pro) apenas para tarefas que exigem raciocínio profundo. Para
          classificação, extração simples ou perguntas e respostas curtas, modelos menores como
          GPT-4o mini ou Claude Haiku entregam resultados comparáveis a 10–50x menor custo.
        </li>
        <li>
          <strong>Faça cache de entradas repetidas</strong> — Se seu prompt de sistema é o mesmo
          em milhares de requisições, o cache de prompts (suportado pela Anthropic e OpenAI)
          permite evitar tokenizá-lo novamente a cada vez. Em aplicações de alto volume, isso
          por si só pode cortar custos em 30–50%.
        </li>
        <li>
          <strong>Reduza o contexto agressivamente</strong> — Cada token na janela de contexto
          custa dinheiro. Em aplicações de chat, não inclua todo o histórico da conversa — mantenha
          uma janela deslizante das últimas 5–10 trocas, ou resuma as trocas mais antigas. Em
          pipelines de RAG, recupere apenas os trechos mais relevantes em vez de inserir documentos
          em massa.
        </li>
        <li>
          <strong>Limite os tokens máximos de saída</strong> — Defina <code>max_tokens</code>{" "}
          adequado para a tarefa. Se você está gerando um título de produto, limite a 30 tokens.
          Se o modelo não conseguir responder dentro do seu limite, você detectará esse caso extremo
          em vez de pagar silenciosamente por um texto de 2.000 tokens.
        </li>
        <li>
          <strong>Use processamento em lote quando possível</strong> — Tanto a OpenAI quanto a
          Anthropic oferecem APIs em lote com 50% de desconto para cargas de trabalho que não
          exigem respostas em tempo real. Trabalhos de processamento noturno, classificação de
          documentos e pipelines de geração de conteúdo são bons candidatos.
        </li>
        <li>
          <strong>Monitore e configure alertas</strong> — Defina limites de gastos e alertas de
          uso no painel do seu provedor antes de ir para produção. Bugs na lógica de repetição ou
          loops infinitos podem transformar uma estimativa de US$50/mês em uma surpresa de
          US$5.000 antes que você perceba.
        </li>
      </ul>

      <h2>Planejamento de Orçamento para Diferentes Casos de Uso</h2>
      <p>
        Diferentes tipos de aplicação têm perfis de custo muito diferentes. Um modelo mental rápido:
      </p>
      <ul>
        <li>
          <strong>Protótipos e projetos pessoais</strong> — US$5–20/mês. Use modelos mini/haiku,
          mantenha o contexto curto, construa no nível gratuito quando possível.
        </li>
        <li>
          <strong>Ferramentas empresariais internas (baixo volume)</strong> — US$50–300/mês.
          Algumas centenas de funcionários usando uma pesquisa assistida por IA ou ferramenta de
          documentos algumas vezes por dia.
        </li>
        <li>
          <strong>Aplicativos para consumidores com recursos de IA (escala moderada)</strong> —
          US$500–5.000/mês. Dezenas de milhares de usuários ativos interagindo com recursos de
          IA diariamente. A escolha do modelo é crítica aqui.
        </li>
        <li>
          <strong>Produto principal de IA (alto volume)</strong> — US$10.000+/mês. A IA é a
          proposta de valor principal, usada constantemente. Nessa escala, negocie preços
          empresariais e invista em infraestrutura de cache e gerenciamento de contexto.
        </li>
      </ul>

      <h2>Comece com uma Estimativa de Custos</h2>
      <p>
        Antes de se comprometer com um modelo, uma arquitetura ou uma camada de preços, modele
        seus custos com números reais. A{" "}
        <a href="/tools/ai-cost-calculator">Calculadora de Custos de IA do BrowseryTools</a>{" "}
        permite inserir contagens de tokens, volumes de requisições e escolhas de modelos para
        ver os gastos mensais projetados lado a lado entre os provedores. Leva dois minutos e
        pode economizar meses de surpresas dolorosas com faturas.
      </p>

      <div style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculadora de Custos de IA Gratuita — Compare GPT-4, Claude, Gemini
        </p>
        <a
          href="/tools/ai-cost-calculator"
          style={{background: "rgba(16,185,129,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Calculadora de Custos de IA →
        </a>
      </div>
    </div>
  );
}
