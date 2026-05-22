export default function Content() {
  return (
    <div>
      <p>
        SVG é uma daquelas tecnologias que parece simples por fora — é apenas um formato de desenho,
        certo? — mas recompensa um estudo mais aprofundado mais do que quase qualquer outro formato no
        kit de ferramentas de um desenvolvedor ou designer. Arquivos SVG escalam infinitamente sem perda
        de qualidade, pesam quase nada para gráficos simples, podem ser estilizados com CSS, animados
        com JavaScript ou transições CSS, e incorporados diretamente no HTML. Entender SVG corretamente
        muda como você pensa sobre gráficos na web.
      </p>
      <p>
        Você pode visualizar, inspecionar e otimizar qualquer arquivo SVG usando a{" "}
        <a href="/tools/svg">Ferramenta SVG do BrowseryTools</a> — gratuita, sem cadastro, tudo roda
        no seu navegador.
      </p>

      <h2>O que é SVG?</h2>
      <p>
        SVG significa Scalable Vector Graphics (Gráficos Vetoriais Escaláveis). Ao contrário de JPEG,
        PNG ou WebP — que armazenam imagens como grades de pixels coloridos (imagens raster) — o SVG
        armazena imagens como descrições matemáticas de formas. Um círculo é descrito como um ponto
        central e um raio. Um caminho é descrito como uma sequência de comandos de desenho: mover para
        este ponto, desenhar uma linha até aquele ponto, desenhar uma curva por esses pontos de controle,
        fechar o caminho.
      </p>
      <p>
        SVG é um formato baseado em XML, o que significa que todo arquivo SVG é texto simples, legível
        por humanos e estruturado como uma árvore de elementos aninhados. Abra qualquer SVG em um editor
        de texto e você verá marcação legível, não um blob binário. Isso tem consequências práticas
        significativas: arquivos SVG podem ser gerados programaticamente, modificados com ferramentas
        de processamento de texto, comparados (diff) em controle de versão e incorporados diretamente
        no HTML sem nenhum processamento adicional.
      </p>
      <p>
        O formato é um padrão W3C, mantido junto com HTML e CSS. Todo navegador moderno tem um motor
        de renderização SVG completo embutido.
      </p>

      <h2>Por que SVG Supera Formatos Raster para Ícones e Ilustrações</h2>
      <p>
        A vantagem decisiva do SVG sobre formatos raster para ícones, logotipos e ilustrações é a
        independência de resolução. Um ícone raster criado em 32×32 pixels ficará borrado em uma tela
        Retina, que renderiza em 2× ou 3× pixels físicos por pixel CSS. Para corrigir isso, você
        precisaria exportar múltiplas variantes de resolução (@1x, @2x, @3x), aumentar a resolução da
        fonte (arquivos maiores, mais memória) ou usar image-set no CSS para servir a resolução certa.
        Com SVG, você cria o gráfico uma vez e ele fica perfeito em qualquer tamanho, em qualquer
        display, para sempre.
      </p>
      <p>
        O tamanho do arquivo é a outra grande vantagem para gráficos simples. Um ícone simples —
        um checkmark, uma seta, um menu hambúrguer — pode ser descrito em um arquivo SVG usando
        200–500 bytes. O PNG equivalente em resolução 2× Retina pode ter 2–5 KB. Em 3×, ainda maior.
        Quando uma interface tem 50 ícones, a diferença entre 50 SVGs otimizados (totalizando ~20 KB)
        e 50 conjuntos PNG (totalizando ~300+ KB) é significativa.
      </p>
      <p>
        Imagens raster ganham para conteúdo fotográfico e ilustrações complexas com gradientes suaves
        e texturas. Um SVG vetorial de uma fotografia seria enorme e pareceria estilizado em vez de
        fotográfico. O formato certo depende inteiramente da natureza do conteúdo.
      </p>

      <h2>Anatomia do SVG: Os Elementos Principais</h2>
      <p>
        Um arquivo SVG mínimo tem esta estrutura:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
  <path d="M8 12 L12 16 L16 8" stroke="white" stroke-width="2" fill="none" />
</svg>`}
      </pre>
      <p>
        Os principais elementos e atributos para entender:
      </p>
      <ul>
        <li>
          <strong>viewBox</strong> — Define o sistema de coordenadas interno. <code>viewBox="0 0 24 24"</code>{" "}
          significa que o espaço de desenho vai de (0,0) a (24,24). O SVG pode então ser renderizado em
          qualquer tamanho real — 16×16, 32×32, 200×200 — e o navegador escala o sistema de coordenadas
          para caber. Esse é o mecanismo por trás da independência de resolução.
        </li>
        <li>
          <strong>path</strong> — O elemento SVG mais poderoso. Um atributo <code>d</code> contém
          comandos de desenho: <code>M</code> (mover para), <code>L</code> (linha para), <code>C</code>{" "}
          (curva bezier cúbica), <code>A</code> (arco), <code>Z</code> (fechar caminho). Quase qualquer
          forma pode ser expressa como um path.
        </li>
        <li>
          <strong>circle, rect, ellipse, line, polygon</strong> — Elementos de conveniência para formas comuns. Um <code>&lt;circle&gt;</code> recebe <code>cx</code>, <code>cy</code> e <code>r</code>. Um{" "}
          <code>&lt;rect&gt;</code> recebe <code>x</code>, <code>y</code>, <code>width</code> e{" "}
          <code>height</code>, além de <code>rx</code> opcional para cantos arredondados.
        </li>
        <li>
          <strong>text</strong> — SVG pode renderizar texto tipográfico que escala com a imagem e permanece selecionável e acessível, ao contrário de texto renderizado em uma imagem raster.
        </li>
        <li>
          <strong>g (grupo)</strong> — Agrupa elementos filhos para que transformações, estilos e opacidade possam ser aplicados ao grupo inteiro de uma vez.
        </li>
        <li>
          <strong>defs e use</strong> — Define elementos reutilizáveis uma vez e os referencia múltiplas vezes com <code>&lt;use&gt;</code>. Essencial para sistemas de ícones que usam um único sprite SVG.
        </li>
      </ul>

      <h2>Estilizando SVG com CSS e Animando-o</h2>
      <p>
        Elementos SVG fazem parte do DOM quando o SVG é incorporado inline no HTML. Isso significa que
        o CSS pode direcioná-los diretamente usando todos os mesmos seletores usados para elementos HTML.
        Você pode alterar cores de preenchimento, larguras de traço e opacidade no hover, no modo escuro
        ou em resposta a qualquer mudança de estado:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`/* Direcione elementos SVG com CSS */
.icon-check circle {
  fill: #22c55e;
  transition: fill 0.2s ease;
}

.icon-check:hover circle {
  fill: #16a34a;
}

/* Suporte a modo escuro */
@media (prefers-color-scheme: dark) {
  .icon-check circle { fill: #4ade80; }
}`}
      </pre>
      <p>
        Animações e transições CSS funcionam em propriedades SVG. O truque <code>stroke-dasharray</code>{" "}
        e <code>stroke-dashoffset</code> — animando um path de invisível para visível manipulando quanto
        de um traço tracejado é mostrado — cria o efeito de "desenho" visto em muitos indicadores de
        carregamento e ilustrações de onboarding. SVG também tem seus próprios elementos{" "}
        <code>&lt;animate&gt;</code> e <code>&lt;animateTransform&gt;</code> (animação SMIL), embora
        as animações CSS e JavaScript sejam geralmente preferidas por questões de manutenibilidade.
      </p>
      <p>
        Usar <code>currentColor</code> como valor de preenchimento faz um ícone SVG herdar automaticamente
        a cor do texto do elemento pai, permitindo que um único ícone se adapte a qualquer contexto de
        cor sem modificação.
      </p>

      <h2>Otimização de SVG com SVGO</h2>
      <p>
        Arquivos SVG exportados de ferramentas de design como Figma ou Illustrator contêm muito inchaço
        desnecessário: metadados do editor, atributos redundantes, wrappers de grupo sem efeito,
        coordenadas de ponto flutuante com oito casas decimais, atributos <code>id</code> gerados pelo
        sistema de nós interno da ferramenta de design. Para um ícone simples, essa sobrecarga pode
        triplicar ou quadruplicar o tamanho do arquivo em comparação com uma versão otimizada manualmente.
      </p>
      <p>
        SVGO (Otimizador de SVG) é a ferramenta padrão para remover essa sobrecarga. Aplica um conjunto
        configurável de transformações: colapsar grupos aninhados, remover elementos invisíveis, arredondar
        coordenadas para precisão razoável, mesclar paths redundantes, remover metadados e comentários,
        e mais. Uma passagem típica do SVGO reduz o tamanho de arquivos SVG de ícones em 30–60% sem
        nenhuma mudança visual.
      </p>
      <p>
        A{" "}
        <a href="/tools/svg">Ferramenta SVG do BrowseryTools</a> aplica otimização de SVG no seu
        navegador, fornecendo a saída otimizada sem instalar nenhuma ferramenta de linha de comando.
      </p>

      <h2>SVG Inline vs Arquivo Externo vs Fundo CSS</h2>
      <p>
        Há três formas principais de incluir um SVG em uma página web, cada uma com diferentes
        trade-offs:
      </p>
      <ul>
        <li>
          <strong>SVG inline</strong> — A marcação SVG é incorporada diretamente no HTML. Fornece acesso completo de CSS e JavaScript a cada elemento dentro do SVG. Melhor para ícones que precisam de efeitos de hover, mudanças de cor ou animação. Não pode ser cacheado separadamente pelo navegador.
        </li>
        <li>
          <strong>Arquivo SVG externo via <code>&lt;img&gt;</code></strong> — O SVG é um arquivo separado referenciado com <code>&lt;img src="icon.svg"&gt;</code>. O navegador pode fazer cache do arquivo. Simples de usar. Mas o CSS da página pai não pode acessar o interior do SVG, e o JavaScript não pode manipular seu conteúdo.
        </li>
        <li>
          <strong>background-image CSS</strong> — O SVG é referenciado como fundo CSS. Funciona para gráficos puramente decorativos. O SVG também pode ser incorporado como URI de dados no CSS, útil para ícones pequenos em folhas de estilo de componentes. CSS não pode reestilizar elementos dentro do SVG.
        </li>
      </ul>
      <p>
        Folhas de sprites SVG — um único arquivo SVG contendo todos os ícones definidos em blocos{" "}
        <code>&lt;defs&gt;</code>, referenciados com{" "}
        <code>&lt;use href="sprite.svg#icon-name"&gt;</code> — oferecem um bom equilíbrio: uma requisição
        de rede cacheável para todos os ícones, com manipulação DOM por ícone possível na maioria dos
        navegadores modernos.
      </p>

      <h2>Armadilhas Comuns do SVG: XSS via SVG</h2>
      <p>
        SVG suporta scripts incorporados, manipuladores de eventos e referências a recursos externos,
        o que o torna um vetor de ataque viável para cross-site scripting (XSS) se arquivos SVG
        enviados por usuários forem exibidos em um contexto de navegador. Um arquivo SVG contendo{" "}
        <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> executará esse script se o
        navegador renderizar o SVG como parte de uma página.
      </p>
      <p>
        As regras para lidar com segurança com SVGs enviados por usuários:
      </p>
      <ul>
        <li>
          Nunca incorpore inline SVGs enviados por usuários no seu HTML. Incorpore inline apenas SVGs que você controla.
        </li>
        <li>
          Se precisar exibir SVGs enviados por usuários, sirva-os de uma origem separada e isolada e exiba-os em uma tag <code>&lt;img&gt;</code> ou um <code>&lt;iframe&gt;</code> isolado. A tag <code>&lt;img&gt;</code> não executa scripts no SVG.
        </li>
        <li>
          Sanitize SVGs enviados por usuários executando-os por um sanitizador (DOMPurify com a configuração SVG) antes de armazenar ou exibi-los.
        </li>
        <li>
          Defina o cabeçalho Content Security Policy para restringir fontes de scripts em páginas que exibem SVGs.
        </li>
      </ul>

      <h2>Convertendo SVG para PNG</h2>
      <p>
        Alguns contextos não suportam SVG: clientes de e-mail mais antigos, certas plataformas CMS,
        alguns pipelines de processamento de imagem, requisitos de ícones de app para iOS e Android, e
        imagens de prévia Open Graph. Nesses casos, você precisa exportar o SVG como um PNG rasterizado.
      </p>
      <p>
        Como SVG escala sem perdas, você pode exportar para PNG em qualquer tamanho. Para ícones de app,
        isso significa exportar uma fonte SVG única em 1024×1024 e derivar todos os tamanhos menores
        dela. Para uso web Retina, exporte em 2× ou 3× o tamanho de exibição CSS.
      </p>
      <p>
        A{" "}
        <a href="/tools/svg">Ferramenta SVG do BrowseryTools</a> pode renderizar SVG para PNG na
        resolução que você escolher, processando a conversão no navegador sem nenhum upload para servidor.
        Útil quando você tem um SVG de uma ferramenta de design e precisa de um PNG para um contexto
        que não aceita SVG.
      </p>

      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Referência rápida:</strong> Use SVG para ícones, logotipos, ilustrações, elementos de
        UI e qualquer coisa que precise escalar. Use PNG (convertido de SVG) para contextos que requerem
        imagens raster. Sempre passe arquivos SVG pelo SVGO antes de publicar. Nunca incorpore inline
        SVGs enviados por usuários diretamente no seu HTML. Use <code>currentColor</code> para ícones
        que precisam se adaptar ao contexto de cor do texto.
      </div>
    </div>
  );
}
