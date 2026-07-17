import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Uma das fontes mais comuns de frustração para desenvolvedores que constroem com LLMs é
        bater em uma parede invisível — uma requisição que falha sem explicação, uma conversa que
        de repente perde o contexto ou um documento que é processado de forma incompleta. Em quase
        todos os casos, o culpado é a janela de contexto. Entender o que é uma janela de contexto,
        o que seus limites significam na prática e como trabalhar dentro deles com habilidade é
        fundamental para construir aplicações alimentadas por IA confiáveis.
      </p>
      <ToolCTA slug="context-window" variant="inline" />
      <p>
        Você pode usar a{" "}
        <a href="/tools/context-window">ferramenta de Janela de Contexto do BrowseryTools</a> —
        gratuita, sem cadastro, tudo fica no seu navegador — para visualizar quanto da janela de
        contexto de um modelo seu conteúdo ocupa antes de enviá-lo a uma API.
      </p>

      <h2>O que É uma Janela de Contexto?</h2>
      <p>
        Uma janela de contexto é a quantidade máxima de texto — medida em tokens — que um modelo
        de linguagem pode "ver" e raciocinar em uma única requisição. É a memória de trabalho do
        modelo. Tudo que é relevante para gerar o próximo token deve caber nessa janela: seu
        prompt de sistema, o histórico completo da conversa, quaisquer documentos que você incluiu
        e os tokens que o modelo está gerando agora.
      </p>
      <p>
        Ao contrário da memória de trabalho humana, que se degrada gradualmente conforme fica
        sobrecarregada, as janelas de contexto têm um limite rígido. Quando você o excede, a API
        retorna um erro. Não há sucesso parcial — a requisição simplesmente falha, e sua aplicação
        deve lidar com isso graciosamente.
      </p>
      <p>
        A janela de contexto é um único pool compartilhado por entrada e saída. Se um modelo tem
        uma janela de contexto de 128K tokens e sua entrada tem 120K tokens, você tem apenas 8K
        tokens restantes para a resposta do modelo. Essa é uma restrição importante ao projetar
        tarefas que exigem saídas longas.
      </p>

      <h2>Limites Atuais da Janela de Contexto por Modelo</h2>
      <p>
        As janelas de contexto cresceram dramaticamente nos últimos anos, e os números continuam
        a se expandir conforme os modelos melhoram:
      </p>
      <ul>
        <li>
          <strong>GPT-4o</strong> — 128.000 tokens (~96.000 palavras). O suficiente para um
          romance completo ou uma grande base de código.
        </li>
        <li>
          <strong>Claude 3.5 Sonnet / Claude 3 Opus</strong> — 200.000 tokens (~150.000 palavras).
          A Anthropic tem consistentemente empurrado esse limite mais longe do que a OpenAI.
        </li>
        <li>
          <strong>Gemini 1.5 Pro</strong> — 1.000.000 tokens (~750.000 palavras). Uma janela de
          contexto genuinamente sem precedentes que pode conter bases de código inteiras ou horas
          de transcrições de reuniões.
        </li>
        <li>
          <strong>Gemini 1.5 Flash</strong> — 1.000.000 tokens, otimizado para velocidade e
          menor custo.
        </li>
        <li>
          <strong>Llama 3.1 (70B / 405B)</strong> — 128.000 tokens, disponível via vários
          provedores, incluindo together.ai e Groq.
        </li>
        <li>
          <strong>Mistral Large</strong> — 128.000 tokens.
        </li>
      </ul>
      <p>
        Para comparação, este post de blog inteiro tem cerca de 1.200 tokens. Mesmo a janela
        "pequena" de 128K do GPT-4o é grande o suficiente para processar a totalidade da maioria
        dos documentos práticos. A questão não é apenas se seu conteúdo cabe — é como o modelo
        lida com o conteúdo em diferentes posições dentro dessa janela.
      </p>

      <h2>O que Acontece Quando Você Excede a Janela de Contexto</h2>
      <p>
        Quando sua entrada excede o comprimento máximo de contexto do modelo, a API retorna um
        erro. Mensagens de erro comuns incluem:
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
        Em uma aplicação de chat, isso comumente acontece após turnos suficientes em uma conversa
        longa. Conforme cada mensagem do usuário e resposta do assistente é adicionada ao histórico,
        a contagem total de tokens cresce até atingir o limite. Sem gerenciamento proativo, a
        aplicação trava no próximo turno. Os usuários experimentam isso como a IA de repente se
        recusando a responder ou lançando um erro no meio de uma conversa — uma experiência
        profundamente frustrante.
      </p>

      <h2>O Problema do "Perdido no Meio"</h2>
      <p>
        Ter uma grande janela de contexto não significa que o modelo atende igualmente a tudo nela.
        Pesquisas têm mostrado consistentemente que modelos baseados em transformadores têm melhor
        desempenho com informações colocadas no início ou no final do contexto — um fenômeno
        conhecido como o problema do <strong>perdido no meio</strong>.
      </p>
      <p>
        Na prática, isso significa que se você está fazendo geração aumentada por recuperação (RAG)
        e injeta 20 trechos de documentos recuperados no meio de um contexto longo, o modelo pode
        falhar em referenciar os trechos nas posições 8–14 mesmo que sejam os mais relevantes. As
        informações mais importantes para sua tarefa devem ser colocadas no início (perto do prompt
        de sistema) ou no final (logo antes da pergunta do usuário) do contexto.
      </p>
      <p>
        Isso também significa que simplesmente dar ao modelo uma janela de contexto de 1M de tokens
        e despejar tudo que você tem nela nem sempre é a estratégia certa. Um contexto focado de
        10K com precisamente as informações certas frequentemente superará um contexto de 500K
        preenchido com material vagamente relevante.
      </p>

      <h2>Estratégias para Trabalhar Dentro dos Limites de Contexto</h2>

      <h3>Fragmentação</h3>
      <p>
        Para documentos que excedem a janela de contexto, divida-os em fragmentos sobrepostos e
        processe cada fragmento independentemente. Use uma pequena sobreposição (por exemplo, 20%
        do tamanho do fragmento) para preservar a continuidade nas fronteiras dos fragmentos. Isso
        funciona bem para tarefas como sumarização, extração e classificação, onde cada fragmento
        é relativamente autossuficiente.
      </p>

      <h3>Sumarização / Compressão</h3>
      <p>
        Para longas conversas ou históricos de documentos, periodicamente resuma o conteúdo mais
        antigo e substitua-o pelo resumo. Uma conversa de 50 turnos pode frequentemente ser
        comprimida em um resumo de 300 tokens que preserva o contexto-chave sem consumir todo o
        histórico. Isso é particularmente eficaz em aplicações de chat onde os turnos iniciais
        da conversa se tornam menos relevantes à medida que ela progride.
      </p>

      <h3>Geração Aumentada por Recuperação (RAG)</h3>
      <p>
        Em vez de colocar documentos inteiros no contexto, incorpore-os em um banco de dados
        vetorial e recupere apenas as passagens mais relevantes no momento da consulta. Um sistema
        RAG bem projetado pode fazer um modelo com uma janela de contexto de 128K efetivamente
        "conhecer" milhões de tokens de documentação — apenas recupera o que é necessário por
        consulta. Isso também reduz significativamente os custos em comparação com usar um modelo
        de contexto longo completo em cada requisição.
      </p>

      <h3>Inclusão Seletiva de Contexto</h3>
      <p>
        Seja deliberado sobre o que você inclui. Em um assistente de codificação, você não precisa
        incluir todos os arquivos do projeto — apenas os arquivos relevantes para a tarefa atual.
        Em um sistema de perguntas e respostas de documentos, não inclua o documento inteiro, a
        menos que a pergunta seja sobre algo que abrange todo o documento. Construa lógica que
        selecione o contexto de forma inteligente, em vez de incluir tudo por padrão.
      </p>

      <h2>Como Monitorar o Uso do Contexto</h2>
      <p>
        A maioria das APIs de provedores de IA retorna o uso de tokens em suas respostas. O objeto
        de resposta da OpenAI inclui um campo <code>usage</code> com <code>prompt_tokens</code>,{" "}
        <code>completion_tokens</code> e <code>total_tokens</code>. A Anthropic retorna{" "}
        <code>input_tokens</code> e <code>output_tokens</code>. Registrar essas contagens para
        cada requisição dá visibilidade sobre tendências de crescimento antes de você atingir
        o limite.
      </p>
      <p>
        Para verificações antes de enviar uma requisição, use a{" "}
        <a href="/tools/context-window">ferramenta de Janela de Contexto do BrowseryTools</a>{" "}
        para colar seu prompt e ver exatamente quantos tokens ele ocupa e qual porcentagem da
        janela de contexto de cada modelo isso representa. Isso é especialmente útil ao construir
        prompts de sistema ou projetar estratégias de recuperação RAG — você pode ver o impacto
        das suas escolhas antes de fazer uma única chamada de API.
      </p>

      <h2>Maior Nem Sempre é Melhor</h2>
      <p>
        A expansão das janelas de contexto é uma conquista de engenharia genuína, e contextos de
        um milhão de tokens abrem casos de uso genuinamente novos. Mas para a maioria das
        aplicações, a estratégia vencedora não é preencher a janela de contexto o máximo possível
        — é colocar as informações certas na posição certa dentro de um contexto bem definido.
        Combine isso com um entendimento de quanto contexto você está usando a qualquer momento,
        e você construirá aplicações mais rápidas, mais baratas e mais confiáveis do que aquelas
        que tratam a janela de contexto como um depósito.
      </p>

      <div style={{background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Ferramenta de Janela de Contexto Gratuita — Visualize o Tamanho do Seu Prompt Instantaneamente
        </p>
        <a
          href="/tools/context-window"
          style={{background: "rgba(168,85,247,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Ferramenta de Janela de Contexto →
        </a>
      </div>
      <ToolCTA slug="context-window" variant="card" />
    </div>
  );
}
