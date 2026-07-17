import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Os gradientes CSS são uma das ferramentas mais poderosas e subutilizadas no kit do desenvolvedor front-end. Eles
        permitem criar transições suaves de cor, fundos marcantes, polimento sutil de interface e até padrões visuais
        complexos — tudo sem um único arquivo de imagem. Antes de os gradientes CSS terem suporte universal, os designers
        precisavam exportar fundos de gradiente como PNGs do Photoshop, resultando em requisições HTTP extras, assets estáticos
        inflexíveis e layouts que quebravam no momento em que alguém mudava as cores da marca. Hoje, uma única linha
        de CSS substitui tudo isso.
      </p>
      <ToolCTA slug="css-gradient" variant="inline" />
      <p>
        Este guia cobre tudo o que você precisa saber sobre gradientes CSS — os três tipos, o sistema de ângulos,
        casos de uso reais com código pronto para copiar, erros comuns e como usar o{" "}
        <a href="/tools/css-gradient">Gerador de Gradiente CSS do BrowseryTools</a> para construir exatamente o que você precisa
        sem escrever uma única linha do zero.
      </p>

      <h2>Por que os gradientes CSS substituíram os fundos baseados em imagem</h2>
      <p>
        A abordagem antiga — exportar um PNG de gradiente de 1×1000px e repeti-lo horizontalmente — tinha custos reais.
        Cada gradiente era uma ida e volta ao servidor, um custo de bytes na rede e um ônus de manutenção quando as
        cores mudavam. Mais importante, os gradientes em PNG não conseguiam responder dinamicamente a tamanhos de tela, trocas
        de tema ou estados de hover.
      </p>
      <p>
        Os gradientes CSS resolvem tudo isso. Eles são renderizados pela GPU em tempo real, respondem instantaneamente a
        mudanças de estado no JavaScript, escalam perfeitamente em qualquer resolução, funcionam com transições e animações CSS
        e adicionam zero byte ao seu pacote de assets. O suporte dos navegadores agora é de 100% em todos os navegadores modernos e
        assim é desde 2014. Não há razão para usar gradientes baseados em imagem para transições de cor sólida
        em novos projetos.
      </p>

      <h2>Os três tipos de gradientes CSS</h2>

      <h3>1. Gradiente linear</h3>
      <p>
        Um gradiente linear faz a transição de cores ao longo de uma linha reta. A direção pode ser qualquer ângulo ou
        expressa por uma palavra-chave como <code>to right</code> ou <code>to bottom right</code>. Este é o tipo de gradiente
        mais usado e atende à grande maioria das necessidades de design.
      </p>
      <pre><code>{`/* Classic diagonal purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Top to bottom (default direction) */
background: linear-gradient(#f8fafc, #e2e8f0);

/* Left to right with three color stops */
background: linear-gradient(to right, #f97316, #ec4899, #8b5cf6);`}</code></pre>

      <h3>2. Gradiente radial</h3>
      <p>
        Um gradiente radial irradia para fora a partir de um ponto central. Por padrão, ele forma uma elipse que se ajusta
        à caixa delimitadora do elemento, mas você pode controlar a forma, o tamanho e a posição. Os gradientes radiais
        são ideais para efeitos de holofote, botões brilhantes e simulações de luz ambiente.
      </p>
      <pre><code>{`/* Circular glow from center */
background: radial-gradient(circle, #6366f1 0%, #1e1b4b 100%);

/* Ellipse glow at top-left corner */
background: radial-gradient(ellipse at top left, #fbbf24 0%, transparent 60%);

/* Positioned spotlight */
background: radial-gradient(circle at 30% 40%, #e0f2fe, #0284c7);`}</code></pre>

      <h3>3. Gradiente cônico</h3>
      <p>
        Um gradiente cônico varre as cores ao redor de um ponto central, como os ponteiros de um relógio. Isso o torna
        especialmente adequado para gráficos de pizza, rodas de cores e animações de indicadores de carregamento. Foi o último dos
        três tipos de gradiente a obter suporte universal, chegando a todos os principais navegadores em 2021.
      </p>
      <pre><code>{`/* Pie chart with three segments */
background: conic-gradient(
  #6366f1 0deg 120deg,
  #ec4899 120deg 240deg,
  #f97316 240deg 360deg
);

/* Color wheel */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);`}</code></pre>

      <h2>Entendendo o sistema de ângulos para gradientes lineares</h2>
      <p>
        O parâmetro de ângulo em <code>linear-gradient</code> segue uma convenção que surpreende muitos desenvolvedores
        porque difere dos ângulos matemáticos padrão. Veja o mapeamento:
      </p>
      <ul>
        <li><strong>0deg</strong> — de baixo para cima (o gradiente flui para cima)</li>
        <li><strong>90deg</strong> — da esquerda para a direita (o gradiente horizontal mais comum)</li>
        <li><strong>135deg</strong> — diagonal, do canto superior esquerdo ao inferior direito</li>
        <li><strong>180deg</strong> — de cima para baixo (igual ao padrão sem ângulo especificado)</li>
        <li><strong>225deg</strong> — diagonal, do canto inferior direito ao superior esquerdo</li>
        <li><strong>270deg</strong> — da direita para a esquerda</li>
      </ul>
      <p>
        Os equivalentes em palavra-chave — <code>to top</code>, <code>to right</code>, <code>to bottom left</code> — são
        muitas vezes mais legíveis do que os ângulos numéricos para direções comuns. Para efeitos diagonais precisos, os graus
        numéricos dão a você controle exato. O popular gradiente diagonal roxo para índigo usa{" "}
        <code>135deg</code>:
      </p>
      <pre><code>{`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`}</code></pre>

      <h2>Formas do gradiente radial: círculo vs elipse</h2>
      <p>
        Por padrão, o <code>radial-gradient</code> produz uma elipse dimensionada para se ajustar ao elemento. Você pode sobrescrever
        isso com duas palavras-chave de forma:
      </p>
      <ul>
        <li>
          <strong>circle</strong> — força um círculo perfeito independentemente da proporção do elemento. Use isto
          para efeitos de brilho e fundos de holofote em que você quer um esmaecimento radial uniforme em todas as direções.
        </li>
        <li>
          <strong>ellipse</strong> — o padrão, que se estica para se ajustar ao contêiner. Use isto para preenchimentos
          de fundo sutis que precisam se adaptar naturalmente a qualquer forma de elemento.
        </li>
      </ul>
      <p>
        A palavra-chave <code>at</code> permite reposicionar o centro do gradiente em qualquer lugar do elemento usando qualquer
        comprimento ou porcentagem CSS. <code>at center</code>, <code>at top left</code>, <code>at 20% 80%</code> — todos
        são válidos. O posicionamento é especialmente poderoso para criar efeitos de luz ambiente descentralizados:
      </p>
      <pre><code>{`/* Glow coming from upper-right corner */
background: radial-gradient(ellipse at top right, rgba(251,191,36,0.4), transparent 60%);

/* Multiple radial gradients layered */
background:
  radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%),
  #0f172a;`}</code></pre>

      <h2>Gradientes cônicos para gráficos de pizza e indicadores de carregamento</h2>
      <p>
        A capacidade do gradiente cônico de varrer em círculo o torna a solução CSS nativa para dois componentes
        clássicos de interface que antes exigiam SVG ou JavaScript:
      </p>
      <p>
        Para um <strong>anel de progresso</strong>, combine um gradiente cônico com uma máscara circular. Para um gráfico de pizza,
        os segmentos do gradiente cônico correspondem diretamente às porcentagens dos dados. Um segmento que vai de
        <code>0deg</code> a <code>72deg</code> representa exatamente 20% de um círculo completo. Isso torna a tradução
        de dados para CSS direta — multiplique a porcentagem por 3,6 para obter o valor em graus.
      </p>

      <h2>Gradientes de múltiplas paradas e paradas abruptas para padrões de listras</h2>
      <p>
        As paradas de cor não precisam se misturar suavemente. Quando duas paradas adjacentes compartilham a mesma posição, a
        transição entre elas se torna instantânea — uma parada abrupta. Essa técnica é como você cria padrões
        de listras, tabuleiros de xadrez e fundos de linhas pautadas inteiramente em CSS:
      </p>
      <pre><code>{`/* Candy stripe pattern using hard stops */
background: linear-gradient(
  45deg,
  #6366f1 25%,
  transparent 25%,
  transparent 50%,
  #6366f1 50%,
  #6366f1 75%,
  transparent 75%
);
background-size: 40px 40px;

/* Warning stripe — alternating color hard stops */
background: repeating-linear-gradient(
  -45deg,
  #fbbf24,
  #fbbf24 10px,
  #1e293b 10px,
  #1e293b 20px
);`}</code></pre>

      <h2>Casos de uso reais com código de exemplo</h2>

      <h3>Fundos de seção hero</h3>
      <p>
        Um gradiente linear de múltiplas paradas com uma malha de dois destaques radiais dá às seções hero a profundidade de uma
        ilustração personalizada sem nenhum arquivo de imagem:
      </p>
      <pre><code>{`.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15), transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
}`}</code></pre>

      <h3>Efeitos de hover em botões</h3>
      <p>
        Os gradientes podem ser animados no hover usando o truque do <code>background-position</code> — dimensione o gradiente
        para 200% e desloque sua posição no hover:
      </p>
      <pre><code>{`.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.4s ease;
}
.btn:hover {
  background-position: 100% 50%;
}`}</code></pre>

      <h3>Bordas de card com border-image</h3>
      <p>
        A propriedade <code>border-image</code> aceita um gradiente, permitindo bordas em gradiente sem elementos
        invólucros nem gambiarras com pseudoelementos (para fundos sólidos):
      </p>
      <pre><code>{`.card-gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #6366f1, #ec4899) border-box;
}`}</code></pre>

      <h3>Barras de progresso</h3>
      <p>
        Uma barra de progresso em gradiente comunica ao mesmo tempo valor e energia visual. Combine-a com uma
        transição de <code>width</code> para uma animação suave:
      </p>
      <pre><code>{`.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  width: 73%; /* Controlled by JS or CSS custom property */
  transition: width 0.6s ease;
}`}</code></pre>

      <h2>Comparação dos tipos de gradiente</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Tipo de gradiente</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Função CSS</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Melhor caso de uso</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Exemplo</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Fundos hero, botões, banners</td>
              <td style={{padding: "12px 16px"}}><code>135deg, #667eea, #764ba2</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Radial</strong></td>
              <td style={{padding: "12px 16px"}}><code>radial-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Brilhos, holofotes, luz ambiente</td>
              <td style={{padding: "12px 16px"}}><code>circle at center, #6366f1, #1e1b4b</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Cônico</strong></td>
              <td style={{padding: "12px 16px"}}><code>conic-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Gráficos de pizza, rodas de cores, indicadores de carregamento</td>
              <td style={{padding: "12px 16px"}}><code>#6366f1 0deg 120deg, #ec4899 120deg 240deg</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linear repetido</strong></td>
              <td style={{padding: "12px 16px"}}><code>repeating-linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Padrões de listras, linhas pautadas</td>
              <td style={{padding: "12px 16px"}}><code>-45deg, #fbbf24 0 10px, #1e293b 10px 20px</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Dicas para escolher boas cores de gradiente</h2>
      <p>
        O erro mais comum ao escolher cores de gradiente é saltar diretamente pela roda de cores — por
        exemplo, mesclar diretamente de vermelho para verde. Como o ponto médio dessa transição passa por
        um cinza-amarronzado e barrento, o resultado parece pouco atraente mesmo que as cores das extremidades sejam atraentes
        individualmente.
      </p>
      <p>
        A solução é passar por um matiz intermediário mais saturado. Em vez de vermelho para verde diretamente,
        tente vermelho → laranja → verde-amarelado para uma transição vibrante. Como alternativa, fique dentro de uma
        faixa adjacente de matizes — a família roxo-rosa, a família índigo-ciano — que sempre produz resultados
        limpos porque o ponto médio permanece saturado.
      </p>
      <p>
        Algumas diretrizes práticas:
      </p>
      <ul>
        <li>Mantenha a saturação alta nas duas extremidades se quiser um gradiente vívido. Mesclar uma cor saturada com uma não saturada cria uma zona morta desagradável no meio.</li>
        <li>Mesclar diferentes valores de luminosidade (claro para escuro) dentro da mesma família de matiz quase sempre parece profissional e funciona bem em fundos de interface.</li>
        <li>Adicione uma parada de cor intermediária em 50% para direcionar o matiz do ponto médio — esta é a correção mais poderosa para gradientes barrentos.</li>
        <li>Limite os gradientes a duas ou três paradas para a maioria dos trabalhos de interface. Mais de três paradas geralmente parecem caóticas, a menos que você esteja criando intencionalmente um arco-íris ou uma visualização de dados.</li>
      </ul>

      <h2>Acessibilidade: texto sobre gradientes</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Aviso de acessibilidade:</strong> Nunca coloque texto sobre um fundo em gradiente sem verificar o
        contraste em cada ponto ao longo do gradiente. Um gradiente que oferece contraste de 7:1 na extremidade escura
        pode cair para 1,5:1 na extremidade clara, tornando o texto ilegível para usuários com baixa visão. O WCAG AA
        exige uma relação de contraste mínima de 4,5:1 para texto normal. Use uma sobreposição escura, restrinja
        o texto à parte de alto contraste do gradiente ou escolha uma faixa de gradiente que mantenha
        contraste suficiente em toda a sua extensão.
      </div>

      <h2>Usando o Gerador de Gradiente CSS do BrowseryTools</h2>
      <p>
        O <a href="/tools/css-gradient">Gerador de Gradiente CSS</a> oferece uma pré-visualização visual ao vivo enquanto você
        configura cada parâmetro. Veja como usá-lo de forma eficaz:
      </p>
      <ul>
        <li><strong>Escolha o tipo de gradiente:</strong> Alterne entre Linear, Radial e Cônico no topo da ferramenta.</li>
        <li><strong>Adicione paradas de cor:</strong> Clique na barra de gradiente para adicionar novas paradas. Arraste as paradas para a esquerda e para a direita para ajustar suas posições. Clique em uma parada para abrir o seletor de cor e alterar sua cor e opacidade.</li>
        <li><strong>Ajuste a direção ou o ângulo:</strong> Para gradientes lineares, arraste a roda de ângulo ou digite um valor preciso em graus. Para gradientes radiais, defina a forma e a posição.</li>
        <li><strong>Pré-visualize no contexto:</strong> A pré-visualização ao vivo é atualizada instantaneamente. Você pode ver exatamente como seu gradiente vai ficar antes de copiar uma única linha.</li>
        <li><strong>Copie o CSS:</strong> Clique no botão Copiar CSS para obter o CSS pronto para produção da propriedade <code>background</code>, pronto para colar em qualquer folha de estilo ou framework.</li>
      </ul>
      <p>
        Tudo roda no seu navegador. Nenhuma definição de gradiente é enviada para lugar nenhum — é uma ferramenta puramente
        do lado do cliente. Você pode usá-la offline depois que a página tiver carregado.
      </p>

      <h2>Suporte dos navegadores</h2>
      <p>
        Os gradientes CSS têm suporte em todos os principais navegadores desde 2014, o que os torna seguros para uso sem
        nenhum polyfill ou fallback em praticamente todo ambiente de produção. Os gradientes cônicos chegaram mais tarde,
        mas agora têm suporte completo no Chrome 69+, Firefox 83+, Safari 12.1+ e Edge 79+ — cobrindo bem
        mais de 97% do uso global de navegadores em 2026. O único cenário em que você pode precisar de um fallback é o
        suporte a versões muito antigas do Android WebView em aplicações móveis corporativas.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Construa qualquer gradiente visualmente — sem precisar de código
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Pré-visualização ao vivo, CSS pronto para copiar e controle total sobre paradas, ângulos e posições.
          Roda inteiramente no seu navegador, sem dados enviados a qualquer servidor.
        </p>
        <a
          href="/tools/css-gradient"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Gerador de Gradiente CSS →
        </a>
      </div>
      <ToolCTA slug="css-gradient" variant="card" />
    </div>
  );
}
