export default function Content() {
  return (
    <div>
      <p>
        Um favicon é o ícone minúsculo que fica na aba do seu navegador, na sua barra de favoritos, na tela inicial
        do celular de quem salva o seu site e, cada vez mais, nos resultados de busca ao lado do seu domínio. É um
        dos menores recursos de um site e um dos mais desproporcionalmente importantes: um site sem favicon parece
        inacabado, enquanto um favicon nítido e reconhecível faz uma marca parecer caprichada já no primeiro pixel.
        O problema é que acertar os favicons costumava ser desnecessariamente penoso — e é exatamente isso que um
        bom <a href="/tools/favicon-generator">gerador de favicons online</a> resolve.
      </p>

      <h2>Por que um favicon nunca é suficiente</h2>
      <p>
        No início da web, você colocava um único <code>favicon.ico</code> no seu diretório raiz e estava feito.
        Hoje, navegadores, sistemas operacionais e lançadores de aplicativos querem todos tamanhos diferentes para
        contextos diferentes. Um ícone 16×16 é renderizado na aba do navegador. Um 32×32 é usado para telas de
        maior densidade e para a barra de tarefas do Windows. Dispositivos Apple querem um{" "}
        <code>apple-touch-icon.png</code> de 180×180 para a tela inicial. Android e aplicativos web progressivos
        referenciam PNGs de 192×192 e 512×512 a partir de um manifesto web. Esqueça um e seu ícone fica borrado,
        pixelado ou simplesmente ausente naquele contexto.
      </p>
      <p>
        Produzir todos esses à mão em um editor de imagens é tedioso e propenso a erros. Você precisa redimensionar
        cada um, exportá-lo nas dimensões de pixel certas, nomear os arquivos exatamente certo e então escrever o
        HTML que conecta tudo. Nossa ferramenta faz tudo isso em um clique, inteiramente no seu navegador.
      </p>

      <h2>Criar um favicon a partir de uma imagem</h2>
      <p>
        O fluxo de trabalho mais comum é <strong>criar um favicon a partir de uma imagem</strong> — geralmente um
        logo ou ícone de aplicativo. Arraste um PNG, JPG, WebP, SVG ou GIF para a área de upload. A ferramenta
        desenha sua imagem em um canvas quadrado usando um ajuste de cobertura (de modo que imagens não quadradas
        sejam centralizadas e recortadas em vez de esmagadas) e então a redimensiona para cada tamanho do conjunto
        padrão. Como os favicons são exibidos em tamanho tão pequeno, uma imagem de origem limpa, de alto contraste
        e idealmente quadrada gera os melhores resultados. Detalhes finos e textos pequenos tendem a desaparecer em
        16×16, então marcas mais simples ficam muito mais legíveis.
      </p>

      <h2>Ou gere um favicon a partir de uma letra ou emoji</h2>
      <p>
        Nem todo mundo tem um logo pronto — e você não precisa de um. Mude para o modo letra/emoji, digite um único
        caractere (uma inicial de marca como &quot;B&quot;, ou um emoji como 🚀), escolha uma cor de fundo e uma cor
        de texto, e a ferramenta renderiza um glifo limpo e centralizado em cada tamanho. Isso é perfeito para
        projetos paralelos, ferramentas internas, sites de documentação e protótipos rápidos. Você obtém um favicon
        distinto e alinhado à marca sem nem abrir um aplicativo de design.
      </p>

      <h2>O que você realmente baixa</h2>
      <p>
        Quando você clica em baixar, a ferramenta agrupa um pacote completo e pronto para produção em um único
        arquivo ZIP:
      </p>
      <p>
        <strong>Ícones PNG</strong> em 16×16, 32×32, 48×48, 180×180 (o Apple touch icon), 192×192 e 512×512.
        <br />
        <strong>favicon.ico</strong> — um arquivo ICO multirresolução de verdade contendo as imagens 16×16 e
        32×32, codificado diretamente no seu navegador para que navegadores legados e o Windows ainda recebam um
        ícone adequado.
        <br />
        <strong>site.webmanifest</strong> — um manifesto de aplicativo web pronto para editar que referencia os
        PNGs de 192 e 512 para instalações no Android e em PWAs.
        <br />
        <strong>O trecho de HTML</strong> — as tags <code>&lt;link&gt;</code> exatas que você cola no seu{" "}
        <code>&lt;head&gt;</code>, também copiáveis diretamente da ferramenta com um clique.
      </p>

      <h2>Como adicionar favicons ao seu site</h2>
      <p>
        Adicionar favicons é um processo de dois passos. Primeiro, descompacte os arquivos baixados no diretório
        raiz ou público do seu site (o mesmo lugar onde fica o seu <code>index.html</code> ou a pasta pública do
        framework). Segundo, cole as tags de link geradas no <code>&lt;head&gt;</code> do seu HTML:
      </p>
      <pre dir="ltr">
        <code>{`<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`}</code>
      </pre>
      <p>
        Se você usa Next.js, coloque os arquivos no diretório <code>public/</code> e adicione as tags ao seu layout
        raiz ou conte com a metadata API do framework. No WordPress, a maioria dos temas tem uma configuração de
        ícone do site que aceita um único PNG quadrado — envie o 512×512 ali. Para sites estáticos e frameworks como
        Astro, Vite ou HTML puro, o trecho acima funciona como está.
      </p>

      <h2>Tudo roda no seu navegador</h2>
      <p>
        Muitos geradores de favicons enviam seu logo para um servidor, o processam remotamente e o enviam por
        e-mail ou redirecionam você para um download. O nosso nunca faz isso. Todo o pipeline — decodificar sua
        imagem, desenhá-la em canvases, redimensionar, codificar o ICO e os PNGs e compactar o resultado — acontece
        localmente usando o canvas do HTML e a biblioteca <code>jszip</code> rodando na sua aba. Seu logo nunca sai
        do seu dispositivo, não há conta para criar, sem marca-d'água e sem limite de upload. É genuinamente
        gratuito e genuinamente privado.
      </p>

      <h2>Dicas para favicons nítidos</h2>
      <p>
        Comece com uma origem quadrada para que nada seja recortado inesperadamente. Use formas marcantes e alto
        contraste para que o ícone permaneça legível em 16 pixels. Evite linhas finas e textos pequenos — eles
        somem em tamanhos pequenos. Se você estiver usando o modo de letra, uma cor de fundo forte com texto branco
        é legível tanto em temas de navegador claros quanto escuros. E sempre confira seu favicon em uma aba real do
        navegador após publicar, porque nada supera vê-lo em tamanho real.
      </p>

      <h2>Experimente agora</h2>
      <p>
        Abra o <a href="/tools/favicon-generator">Gerador de Favicons</a>, envie um logo ou digite uma letra e
        baixe seu conjunto completo de favicons em segundos. Já que está por aqui, você também pode gostar do{" "}
        <a href="/tools/image-resizer">Redimensionador de Imagens</a>, do{" "}
        <a href="/tools/image-converter">Conversor de Formato de Imagem</a> e do{" "}
        <a href="/tools/meta-tags">Gerador de Meta Tags</a> — tudo gratuito, tudo privado, tudo rodando
        inteiramente no seu navegador.
      </p>
    </div>
  );
}
