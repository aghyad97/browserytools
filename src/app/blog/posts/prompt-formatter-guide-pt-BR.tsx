import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        A diferença entre uma resposta de IA medíocre e uma genuinamente útil raramente é sobre as
        capacidades do modelo — é quase sempre sobre como o prompt foi escrito. Estrutura, clareza
        e as sinalizações de formatação certas podem transformar uma saída vaga e confusa em uma
        resposta precisa e acionável. Se você já sentiu que uma ferramenta de IA não está à altura
        do seu potencial, o formato do seu prompt é a primeira coisa que vale examinar.
      </p>
      <ToolCTA slug="prompt-formatter" variant="inline" />
      <p>
        Você pode usar o{" "}
        <a href="/tools/prompt-formatter">Formatador de Prompts do BrowseryTools</a> — gratuito,
        sem cadastro, tudo fica no seu navegador — para limpar, reestruturar e refinar seus prompts
        antes de enviá-los a qualquer modelo de IA.
      </p>

      <h2>Por que a Formatação Importa Mais do que Você Pensa</h2>
      <p>
        Os modelos de linguagem não leem prompts da forma como um humano lê rapidamente uma
        mensagem. Eles processam tokens sequencialmente e são sensíveis a como as instruções são
        formuladas, ordenadas e separadas. Um prompt escrito como um longo parágrafo contínuo
        enterra as instruções mais importantes no meio — exatamente onde é menos provável que
        influenciem a saída. Um prompt bem formatado coloca restrições e objetivos no início, usa
        delimitadores claros entre seções e sinaliza explicitamente o formato de saída esperado.
      </p>
      <p>
        Pense na formatação de prompts como escrever um briefing para um prestador de serviços.
        Quanto mais precisamente você especifica o produto, as restrições e o contexto, mais perto
        o primeiro rascunho estará do que você realmente precisa.
      </p>

      <h2>Técnica 1: Atribuição de Papel</h2>
      <p>
        Uma das técnicas de formatação mais eficazes é dar ao modelo um papel antes da tarefa
        real. Isso ativa um registro específico e um conjunto de convenções que o modelo associa
        a esse papel, produzindo saída mais consistente.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sem papel:
"Explique como escrever um bom README."

✅ Com papel:
"Você é um mantenedor sênior de código aberto que revisa centenas de repositórios.
Explique como escrever um README que comunique o valor de um projeto de forma clara
tanto para leitores técnicos quanto não técnicos."`}
      </pre>
      <p>
        O enquadramento de papel não restringe o modelo — ele o foca. Você obtém uma escrita que
        corresponde aos padrões e vocabulário da persona, em vez de uma visão geral genérica.
      </p>

      <h2>Técnica 2: Blocos de Instrução Claros</h2>
      <p>
        Separe sua descrição de tarefa, contexto e restrições em seções distintas. Cabeçalhos
        Markdown e delimitadores de triplas crases funcionam bem aqui. Muitos modelos foram
        treinados em documentos com essa estrutura e respondem bem a ela.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Tarefa
Resuma o feedback de clientes a seguir em três prioridades de produto acionáveis.

## Contexto
Este é o feedback de usuários de SaaS B2B coletado no 4º trimestre de 2025. O público
para este resumo é um gerente de produto se preparando para uma sessão de planejamento
de sprint.

## Restrições
- Máximo de 150 palavras no total
- Use marcadores
- Não inclua citações diretas

## Entrada
"""
[feedback de clientes vai aqui]
"""`}
      </pre>
      <p>
        As seções rotuladas deixam imediatamente claro o que pertence a cada uma. Você pode ajustar
        o contexto ou as restrições de forma independente sem reescrever o prompt inteiro.
      </p>

      <h2>Técnica 3: Exemplos Few-Shot</h2>
      <p>
        Se você precisa de saída em um estilo ou formato específico, a técnica mais confiável é
        incluir um ou dois exemplos do que você quer. Isso é chamado de few-shot prompting e
        consistentemente supera longas descrições verbais do formato desejado.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Converta uma solicitação de feature bruta em uma história de usuário usando o formato a seguir.

Entrada de exemplo: "Usuários querem exportar dados para CSV"
Saída de exemplo: "Como analista de dados, quero exportar meus dados do painel para CSV
para poder realizar análises personalizadas em ferramentas de planilha."

Agora converta: "Usuários querem ser notificados quando um relatório estiver pronto"`}
      </pre>
      <p>
        Observe que o exemplo define tanto a estrutura ("Como... quero... para que...") quanto o
        nível de especificidade esperado. Você não precisa explicar o formato em prosa — o exemplo
        o mostra.
      </p>

      <h2>Técnica 4: Prompting em Cadeia de Pensamento</h2>
      <p>
        Para tarefas de raciocínio — depuração, análise, cálculos, tomada de decisão — pedir
        explicitamente ao modelo que pense passo a passo antes de dar uma resposta final melhora
        dramaticamente a precisão. Isso não é um truque: muda como o modelo aloca sua computação
        interna durante a geração.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sem cadeia de pensamento:
"Qual é o melhor banco de dados para um jogo multiplayer em tempo real?"

✅ Com cadeia de pensamento:
"Qual é o melhor banco de dados para um jogo multiplayer em tempo real?
Pense nos requisitos passo a passo — latência, modelo de concorrência, estrutura
de dados, garantias de consistência — antes de dar sua recomendação."`}
      </pre>
      <p>
        A instrução passo a passo revela o raciocínio intermediário que você pode avaliar. Você
        também tem muito mais probabilidade de detectar erros quando pode ver a cadeia de
        raciocínio em vez de apenas uma conclusão.
      </p>

      <h2>Técnica 5: Prompts Estruturados com XML e JSON</h2>
      <p>
        Quando você precisa que a própria saída seja estruturada — um objeto JSON, uma tabela, um
        esquema específico — torne o formato de saída explícito e use uma estrutura correspondente
        no prompt. Claude e GPT-4 respondem especialmente bem a seções marcadas com XML.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Extraia os campos a seguir da descrição de vaga abaixo.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[texto da descrição de vaga aqui]
</input>`}
      </pre>
      <p>
        As tags XML atuam como delimitadores inequívocos. O modelo sabe exatamente onde suas
        instruções terminam e onde os dados de entrada começam, reduzindo o risco de o modelo
        tratar suas instruções como parte do conteúdo a processar.
      </p>

      <h2>Erros Comuns de Formatação de Prompts</h2>
      <ul>
        <li><strong>Enterrar a instrução principal</strong> — Coloque o que você quer que o modelo
        faça no início, não após três parágrafos de contexto. Os modelos pesam mais os tokens
        iniciais.</li>
        <li><strong>Restrições contraditórias</strong> — "Seja conciso, mas cubra todos os detalhes"
        força o modelo a fazer uma troca arbitrária. Especifique qual importa mais.</li>
        <li><strong>Assumir contexto compartilhado</strong> — O modelo não tem memória das suas
        sessões anteriores. Inclua todo o contexto relevante no próprio prompt.</li>
        <li><strong>Nenhum formato de saída especificado</strong> — Se você precisa de uma lista,
        diga lista. Se você precisa de JSON, diga JSON. Se você precisa de uma resposta com menos
        de 200 palavras, diga isso. Formato não especificado = saída imprevisível.</li>
        <li><strong>Regras de estilo excessivamente especificadas</strong> — Longas listas de
        instruções negativas ("não faça X, nunca diga Y") consomem contexto e frequentemente
        produzem saída afetada e estranha. Uma ou duas restrições fortes superam dez fracas.</li>
      </ul>

      <h2>Antes e Depois: A Mesma Solicitação, Reformatada</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Antes:
"Você pode me ajudar a escrever um e-mail para meu chefe sobre um atraso em projeto?
Devíamos lançar a nova integração de pagamento na sexta-feira passada, mas a API de
terceiros teve alguns problemas e agora estamos pensando em quarta ou quinta-feira,
pode deixar profissional?"

✅ Depois:
Você é um comunicador empresarial experiente.

## Tarefa
Escreva um e-mail profissional de notificação de atraso de um desenvolvedor para seu gerente.

## Contexto
- Projeto: integração de gateway de pagamento
- Prazo original: sexta-feira passada
- Nova estimativa: quarta ou quinta-feira desta semana
- Causa: problemas com uma API de terceiros (não foi culpa da nossa equipe)

## Tom
Profissional, direto e focado em soluções — não defensivo nem muito apologético

## Saída
Linha de assunto + corpo do e-mail, menos de 150 palavras`}
      </pre>
      <p>
        A versão reformatada leva 20 segundos extras para escrever e produz uma saída que é
        imediatamente utilizável, em vez de exigir duas ou três correções de acompanhamento.
      </p>

      <h2>Usando o Formatador de Prompts</h2>
      <p>
        O{" "}
        <a href="/tools/prompt-formatter">Formatador de Prompts do BrowseryTools</a> ajuda você
        a aplicar essas técnicas sem memorizar cada regra. Cole seu prompt bruto, escolha a
        estrutura que se encaixa no seu caso de uso e obtenha uma versão limpa e bem organizada
        pronta para enviar ao ChatGPT, Claude, Gemini ou qualquer outro modelo. Sem conta
        necessária, e seus prompts nunca saem do seu navegador.
      </p>

      <h2>Resumo</h2>
      <p>
        A formatação de prompts é uma habilidade aprendível com um retorno mensurável. A atribuição
        de papel foca o modelo, quebras de seção claras eliminam ambiguidade, exemplos few-shot
        definem seu formato esperado e restrições explícitas de saída removem as suposições. O
        melhor prompt não é o mais elaborado — é aquele que deixa menos perguntas sem resposta
        antes que a geração comece.
      </p>
      <ToolCTA slug="prompt-formatter" variant="card" />
    </div>
  );
}
