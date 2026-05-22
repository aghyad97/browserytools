export default function Content() {
  return (
    <div>
      <p>
        Markdown está em todo lugar. É o formato de escrita padrão no GitHub, a espinha dorsal da maioria
        dos geradores de sites estáticos, a linguagem nativa de ferramentas como Obsidian e Notion, e o
        formato que os desenvolvedores usam para escrever READMEs, documentação e notas técnicas. Apesar
        de ser onipresente, muitos escritores e desenvolvedores aprendem apenas o básico — negrito,
        itálico e alguns níveis de cabeçalho — e perdem os recursos que tornam o Markdown genuinamente
        poderoso para escrita estruturada.
      </p>
      <p>
        Você pode escrever e pré-visualizar Markdown instantaneamente usando o{" "}
        <a href="/tools/markdown-editor">Editor de Markdown do BrowseryTools</a> — gratuito, sem
        cadastro, tudo fica no seu navegador.
      </p>

      <h2>Quem Criou o Markdown e Por quê</h2>
      <p>
        O Markdown foi criado por John Gruber, em colaboração com Aaron Swartz, e lançado em 2004. O
        objetivo declarado de Gruber era criar um formato de escrita em texto simples que fosse legível
        como está — antes de qualquer renderização — e que convertesse de forma limpa para HTML válido.
        O nome é uma brincadeira com "linguagem de marcação" (HTML é HyperText Markup Language),
        invertendo o conceito: em vez de adicionar sintaxe para controlar a formatação, o Markdown usa
        os hábitos naturais de pontuação que as pessoas já haviam desenvolvido em e-mails de texto simples.
      </p>
      <p>
        A motivação era prática. HTML é verboso e distrai ao escrever inline. Uma frase como{" "}
        <code> &lt;p&gt;Este é um texto &lt;strong&gt;importante&lt;/strong&gt;.&lt;/p&gt;</code>{" "}
        requer uma sobrecarga mental significativa em comparação com{" "}
        <code>Este é um texto **importante**.</code> Gruber queria que blogueiros e escritores se
        concentrassem nas palavras, não nas tags. A especificação original do Markdown era um script
        Perl que convertia arquivos Markdown em texto simples para HTML.
      </p>

      <h2>Sintaxe Básica</h2>
      <p>
        A sintaxe central do Markdown cobre tudo que a maioria dos escritores precisa para documentos
        estruturados.
      </p>

      <h3>Títulos</h3>
      <p>
        Use sinais de hash para criar títulos. Um hash para H1, dois para H2, até seis para H6. A
        maioria dos guias de estilo recomenda apenas um H1 por documento (tipicamente o título) e usar
        H2–H4 para hierarquia de conteúdo.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Título 1
## Título 2
### Título 3
#### Título 4`}
      </pre>

      <h3>Ênfase e Negrito</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`*itálico* ou _itálico_
**negrito** ou __negrito__
***negrito e itálico***
~~tachado~~`}
      </pre>

      <h3>Links e Imagens</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`[Texto do link](https://example.com)
[Link com título](https://example.com "Título da página")
![Texto alternativo](image.png)
![Texto alternativo](image.png "Título da imagem")`}
      </pre>

      <h3>Listas</h3>
      <p>
        Listas não ordenadas usam hífens, asteriscos ou sinais de mais. Listas ordenadas usam números
        seguidos de pontos. Itens recuados (2 ou 4 espaços) criam listas aninhadas.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- Item não ordenado
- Outro item
  - Item aninhado

1. Primeiro
2. Segundo
3. Terceiro`}
      </pre>

      <h3>Código</h3>
      <p>
        Código inline usa crases simples. Blocos de código delimitados usam três crases com um
        identificador opcional de linguagem para realce de sintaxe.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Use \`console.log()\` para depurar.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``}
      </pre>

      <h3>Citações em Bloco</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`> Isso é uma citação em bloco.
> Pode abranger múltiplas linhas.
>
> > Citações em bloco aninhadas também funcionam.`}
      </pre>

      <h3>Réguas Horizontais</h3>
      <p>
        Três ou mais hífens, asteriscos ou sublinhados em uma linha por si mesmos criam uma régua
        horizontal. <code>---</code> é a convenção mais comum.
      </p>

      <h2>Sintaxe Estendida</h2>
      <p>
        A especificação original do Markdown deixou de fora vários recursos que os escritores comumente
        precisam. A sintaxe estendida, suportada pela maioria dos processadores modernos, adiciona essas
        capacidades.
      </p>

      <h3>Tabelas</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`| Coluna 1  | Coluna 2  | Coluna 3  |
|-----------|:---------:|----------:|
| Esquerda  | Centro    | Direita   |
| alinhada  | alinhada  | alinhada  |`}
      </pre>
      <p>
        A posição dos dois-pontos na linha separadora controla o alinhamento: à esquerda (padrão),
        centralizado (dois-pontos nos dois lados) ou à direita (dois-pontos à direita).
      </p>

      <h3>Listas de Tarefas</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- [x] Escrever primeiro rascunho
- [x] Revisão por pares
- [ ] Edições finais
- [ ] Publicar`}
      </pre>

      <h3>Notas de Rodapé</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Aqui está uma afirmação que precisa de citação.[^1]

[^1]: A fonte de suporte ou explicação vai aqui.`}
      </pre>

      <h2>Variantes de Markdown: CommonMark, GFM e MDX</h2>
      <p>
        A especificação original do Markdown tinha ambiguidades — lugares onde os processadores tomavam
        decisões diferentes sobre casos extremos. Isso levou a implementações incompatíveis entre
        diferentes ferramentas. Vários esforços de padronização surgiram para resolver isso.
      </p>
      <ul>
        <li>
          <strong>CommonMark</strong> — uma especificação rigorosa que resolve toda ambiguidade na especificação original do Markdown com um conjunto formal de testes. Adotado pelo Discourse, Reddit, Stack Overflow e muitos outros. A variante mais interoperável.
        </li>
        <li>
          <strong>GitHub Flavored Markdown (GFM)</strong> — a extensão do CommonMark pelo GitHub que adiciona tabelas, listas de tarefas, tachado, autolinks e URLs literais. Se você escreve arquivos README ou comentários no GitHub, está usando GFM.
        </li>
        <li>
          <strong>MDX</strong> — Markdown estendido com suporte a componentes JSX, usado extensivamente em sites de documentação baseados em React (docs do Next.js, Docusaurus, Astro). Permite importar e incorporar componentes React diretamente em arquivos Markdown.
        </li>
        <li>
          <strong>MultiMarkdown / Pandoc Markdown</strong> — extensões ricas em recursos para escrita acadêmica, com suporte para citações, equações matemáticas (LaTeX) e formatação complexa de tabelas.
        </li>
      </ul>

      <h2>Onde o Markdown É Usado</h2>
      <ul>
        <li><strong>GitHub e GitLab</strong> — arquivos README, issues, pull requests, wikis e comentários todos renderizam Markdown</li>
        <li><strong>Notion</strong> — suporta importação/exportação de Markdown e um subconjunto de atalhos Markdown para formatação inline</li>
        <li><strong>Obsidian</strong> — um aplicativo de gerenciamento de conhecimento construído inteiramente em arquivos Markdown com extensões de wikilink</li>
        <li><strong>Geradores de sites estáticos</strong> — Jekyll, Hugo, Gatsby, Astro e Next.js todos usam Markdown ou MDX como formato de conteúdo padrão</li>
        <li><strong>Plataformas de documentação</strong> — ReadTheDocs, GitBook e Docusaurus são construídos em torno de Markdown</li>
        <li><strong>Plataformas de chat</strong> — Slack, Discord e Teams suportam subconjuntos de Markdown para formatação de mensagens</li>
        <li><strong>Clientes de e-mail</strong> — alguns clientes (Superhuman, HEY) suportam entrada em Markdown</li>
      </ul>

      <h2>Markdown vs Editores de Texto Rico</h2>
      <p>
        Editores de texto rico (WYSIWYG — O que você vê é o que você obtém) como Google Docs, Microsoft
        Word ou o editor embutido do Contentful mostram a saída formatada enquanto você digita. O Markdown
        mostra o código-fonte bruto. Os trade-offs são reais.
      </p>
      <ul>
        <li><strong>Vantagens do Markdown</strong> — arquivos de texto simples, funciona em qualquer editor, controlável com git, sem dependência de fornecedor, fluxo de trabalho rápido apenas com teclado</li>
        <li><strong>Vantagens do texto rico</strong> — imediatamente visual, sem sintaxe para aprender, mais fácil para colaboradores não técnicos, melhor para formatação complexa (notas de rodapé, comentários, rastreamento de alterações)</li>
      </ul>
      <p>
        Para escrita técnica, documentação de desenvolvedores e gerenciamento pessoal de conhecimento,
        a portabilidade do Markdown e a compatibilidade com controle de versão o tornam a melhor escolha.
        Para documentos de negócios colaborativos ou conteúdo com requisitos de formatação complexos,
        um editor de texto rico frequentemente é mais prático.
      </p>

      <h2>Erros Comuns no Markdown</h2>
      <ul>
        <li><strong>Linhas em branco ausentes</strong> — a maioria dos elementos de bloco (títulos, listas, blocos de código) requer uma linha em branco antes e depois para renderizar corretamente</li>
        <li><strong>Espaços após sinais de hash</strong> — <code>##Título</code> sem espaço após os hashes não é um título na maioria dos processadores</li>
        <li><strong>Marcadores de lista inconsistentes</strong> — misturar <code>-</code> e <code>*</code> na mesma lista pode produzir resultados inesperados em alguns processadores</li>
        <li><strong>Esquecer de escapar caracteres especiais</strong> — asteriscos, sublinhados e crases dentro do texto precisam de um escape com barra invertida se devem ser renderizados literalmente</li>
        <li><strong>Assumir que a sintaxe estendida é universal</strong> — tabelas e listas de tarefas são recursos do GFM não suportados por todos os processadores; verifique seu ambiente alvo</li>
      </ul>
      <p>
        O <a href="/tools/markdown-editor">Editor de Markdown do BrowseryTools</a> fornece uma
        pré-visualização ao vivo para que você possa detectar problemas de renderização imediatamente
        enquanto escreve, sem copiar o texto para outra ferramenta. Cole seu Markdown e veja a saída
        HTML renderizada lado a lado.
      </p>
    </div>
  );
}
