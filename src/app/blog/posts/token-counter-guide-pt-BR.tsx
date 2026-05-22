export default function Content() {
  return (
    <div>
      <p>
        Quando desenvolvedores começam a trabalhar com APIs de grandes modelos de linguagem, uma
        pergunta surge quase imediatamente: "Qual é o limite máximo?" Eles pensam em palavras,
        parágrafos ou caracteres — mas o modelo pensa em tokens. Entender o que são tokens, como
        são contados e por que a contagem importa é uma das coisas mais praticamente úteis que você
        pode aprender antes de construir algo sério sobre um LLM.
      </p>
      <p>
        Você pode usar o{" "}
        <a href="/tools/token-counter">Contador de Tokens do BrowseryTools</a> — gratuito, sem
        cadastro, tudo fica no seu navegador — para contar tokens de qualquer texto antes de
        enviá-lo a uma API.
      </p>

      <h2>O que É um Token? (Não é uma Palavra, Não é um Caractere)</h2>
      <p>
        Um token é a unidade fundamental de texto que um modelo de linguagem processa. Não é uma
        palavra. Não é um caractere. É um pedaço de texto que o tokenizador do modelo aprendeu
        a tratar como uma única unidade — e esse pedaço pode ser desde um único caractere até um
        fragmento de palavra com vários caracteres ou uma palavra comum inteira.
      </p>
      <p>
        Aqui estão alguns exemplos de como uma frase pode ser dividida em tokens por um tokenizador
        da família GPT:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`"Hello, world!"
→ ["Hello", ",", " world", "!"]  — 4 tokens

"unbelievable"
→ ["un", "believ", "able"]  — 3 tokens

"ChatGPT"
→ ["Chat", "G", "PT"]  — 3 tokens

"2026-03-22"
→ ["2026", "-", "03", "-", "22"]  — 5 tokens`}
</pre>
      <p>
        Observe como palavras curtas comuns como "Hello" mapeiam para um único token, enquanto
        palavras mais longas ou incomuns são divididas em vários tokens. Pontuação, números e
        caracteres especiais frequentemente são seus próprios tokens. O tokenizador não simplesmente
        divide nos espaços ou na pontuação — usa um vocabulário aprendido de unidades de sub-palavras
        para alcançar o melhor equilíbrio entre tamanho do vocabulário e eficiência de representação.
      </p>

      <h2>Como os Tokenizadores Funcionam: Codificação por Par de Bytes</h2>
      <p>
        A maioria dos LLMs modernos — GPT-4, Claude, Gemini, Llama — usa uma variante da{" "}
        <strong>Codificação por Par de Bytes (BPE)</strong> ou um algoritmo intimamente relacionado
        chamado SentencePiece. O BPE foi originalmente desenvolvido para compressão de dados; foi
        adaptado para o processamento de linguagem natural porque resolve elegantemente o problema
        do vocabulário aberto.
      </p>
      <p>
        O processo de treinamento do BPE começa com caracteres individuais (ou bytes) como
        vocabulário base. Ele então encontra repetidamente o par de símbolos que co-ocorre com
        mais frequência no corpus de treinamento e os mescla em um único novo símbolo. Após
        milhares dessas mesclagens, o vocabulário resultante contém palavras comuns como tokens
        únicos, prefixos e sufixos comuns como tokens, e palavras raras como sequências de tokens
        menores. O tamanho final do vocabulário é tipicamente de 32.000 a 100.000 tokens.
      </p>
      <p>
        Isso significa que a tokenização de qualquer texto depende inteiramente do vocabulário
        específico com o qual o modelo foi treinado. <strong>GPT-4, Claude e Gemini usam
        tokenizadores diferentes</strong> — o mesmo texto pode se tokenizar em contagens
        diferentes em cada modelo. Nunca assuma que uma contagem de tokens que você mediu para
        um modelo se aplica a outro.
      </p>

      <h2>A Regra Prática de "750 Palavras por 1.000 Tokens"</h2>
      <p>
        Você frequentemente verá a aproximação "1.000 tokens ≈ 750 palavras" citada para texto
        em inglês. Esta é uma heurística razoável para prosa típica — posts de blog, artigos,
        documentação. Ela vem da observação de que em um corpus de inglês balanceado, o
        comprimento médio do token é de cerca de 4–5 caracteres, e a palavra média em inglês tem
        cerca de 5 caracteres mais um espaço. Portanto, uma palavra mapeia para aproximadamente
        1,3 tokens em média.
      </p>
      <p>
        Mas "regra prática" é o enquadramento certo — ela quebra rapidamente na prática:
      </p>
      <ul>
        <li>
          <strong>Código tokeniza mais densamente</strong> — Linguagens de programação usam muitas
          palavras-chave curtas, operadores e identificadores que são frequentemente tokens únicos.
          Um bloco de Python pode tokenizar com menos tokens por caractere do que prosa em inglês.
        </li>
        <li>
          <strong>URLs e strings técnicas são caras</strong> — Uma URL longa como{" "}
          <code>https://api.example.com/v2/users/84219/preferences?include=notifications</code>{" "}
          pode tokenizar em mais de 20 tokens, apesar de parecer curta na tela.
        </li>
        <li>
          <strong>Números são surpreendentemente custosos</strong> — Cada dígito em um número
          longo é frequentemente um token separado. O número "1738371600" pode se tornar 5–7 tokens.
        </li>
        <li>
          <strong>Espaços em branco repetidos e formatação</strong> — JSON com indentação
          pretty-print, tabelas Markdown e código com aninhamento profundo adicionam tokens de
          espaços em branco.
        </li>
      </ul>

      <h2>Idiomas Não Ingleses: Árabe, Chinês e a Diferença no Custo de Tokens</h2>
      <p>
        A heurística de 750 palavras por 1.000 tokens é uma heurística do <em>inglês</em>. Para
        outros idiomas, a proporção pode ser dramaticamente diferente — e isso tem implicações
        reais de custo para aplicações multilíngues.
      </p>
      <p>
        O <strong>árabe e o hebraico</strong> usam morfologia de raiz e padrão, onde uma única
        raiz gera dezenas de formas derivadas através de prefixos, sufixos e mudanças de vogais
        internas. Palavras como "وسيستخدمونها" (eles vão usá-la) são palavras ortográficas únicas,
        mas podem tokenizar em 5–8 tokens porque o vocabulário BPE foi treinado predominantemente
        em dados em inglês e não tem essas formas árabes como tokens únicos.
      </p>
      <p>
        O <strong>chinês e o japonês</strong> têm um desafio diferente. Os caracteres são
        logográficos — cada caractere é uma unidade significativa — mas o vocabulário de tokens
        cobre caracteres únicos comuns e algumas palavras multi-caracteres comuns. O texto chinês
        tipicamente gera 1,5–2x mais tokens por "equivalente de palavra" do que o inglês. O
        japonês, com sua mistura de hiragana, katakana e kanji, pode gerar ainda mais.
      </p>
      <p>
        Uma implicação prática: se você está construindo uma aplicação para árabe, chinês ou outras
        línguas com escrita não-latina, suas estimativas de custo derivadas de testes em inglês
        vão subestimar significativamente os custos reais da API. Sempre meça as contagens de
        tokens com seu conteúdo real usando o{" "}
        <a href="/tools/token-counter">Contador de Tokens do BrowseryTools</a> ou uma biblioteca
        de tokenização antes de fazer projeções de orçamento.
      </p>

      <h2>Limites da Janela de Contexto: Por que Ultrapassá-los Quebra Tudo</h2>
      <p>
        Todo LLM tem uma <strong>janela de contexto</strong> — o número máximo de tokens que ele
        pode processar em uma única requisição, contando tanto sua entrada quanto a saída do modelo.
        No início de 2026:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — 128.000 tokens</li>
        <li><strong>Claude 3.5 Sonnet</strong> — 200.000 tokens</li>
        <li><strong>Gemini 1.5 Pro</strong> — 1.000.000 tokens</li>
        <li><strong>Llama 3.1 70B</strong> — 128.000 tokens</li>
      </ul>
      <p>
        Se sua entrada exceder o limite da janela de contexto, a API retornará um erro — a
        requisição simplesmente falha. Não há degradação graciosa por padrão; você precisa lidar
        com isso na lógica da sua aplicação. Mais sutilmente, mesmo dentro da janela de contexto,
        há um fenômeno chamado problema do "perdido no meio": modelos tendem a recordar informações
        no início e no final do contexto melhor do que informações enterradas no meio. Uma janela
        de contexto de 200K não significa que cada token nela é igualmente bem atendido.
      </p>
      <p>
        Para aplicações de chat, a janela de contexto se preenche conforme as conversas crescem.
        Após turnos suficientes, você deve truncar mensagens antigas, resumi-las ou atingir o
        limite e falhar. Saber sua contagem de tokens em cada etapa é o que permite tomar essa
        decisão proativamente.
      </p>

      <h2>Implicações para o Design de Prompts</h2>
      <p>
        A consciência de tokens muda como você escreve prompts. Algumas implicações concretas:
      </p>
      <ul>
        <li>
          <strong>Prompts de sistema se acumulam em cada requisição</strong> — Um prompt de sistema
          de 500 tokens custa 500 × suas requisições × seu preço de entrada. Em 10.000 requisições
          diárias, reduzir seu prompt de sistema de 500 para 300 tokens economiza dinheiro real
          todo mês.
        </li>
        <li>
          <strong>Exemplos few-shot são caros, mas eficazes</strong> — Incluir 3 exemplos no seu
          prompt pode adicionar 300–500 tokens. Meça se essa melhoria de qualidade vale o custo
          versus fazer ajuste fino do modelo uma vez.
        </li>
        <li>
          <strong>O comprimento da saída é controlável</strong> — Use <code>max_tokens</code> para
          limitar a saída do modelo. Adicione instruções explícitas no seu prompt: "Responda em
          menos de 100 palavras." Os modelos geralmente seguem bem as instruções de comprimento de
          saída, o que reduz diretamente os custos de tokens de saída.
        </li>
        <li>
          <strong>Formatação JSON adiciona overhead</strong> — Se você está usando saída estruturada
          (modo JSON), as aspas, colchetes e nomes de chaves adicionam tokens além dos seus valores
          de dados reais. Uma resposta com 5 campos curtos pode facilmente ter 40% de overhead em
          tokens de formatação.
        </li>
      </ul>

      <h2>Conte Tokens Antes de Enviar</h2>
      <p>
        O melhor hábito a construir ao trabalhar com APIs de LLM é contar seus tokens antes de
        se comprometer com uma arquitetura ou ir para produção. Cole seu prompt de sistema, uma
        mensagem de usuário representativa e qualquer contexto que você planeja incluir no{" "}
        <a href="/tools/token-counter">Contador de Tokens do BrowseryTools</a>. Você verá
        imediatamente se seu design está bem dentro da janela de contexto ou perigosamente perto
        do limite — e terá os números necessários para estimar custos com precisão.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Contador de Tokens Gratuito — Funciona no Seu Navegador, Sem Cadastro
        </p>
        <a
          href="/tools/token-counter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Contador de Tokens →
        </a>
      </div>
    </div>
  );
}
