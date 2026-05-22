export default function Content() {
  return (
    <div>
      <p>
        SVG é o melhor formato na web para logotipos, ícones e ilustrações — é um vetor, então
        escala para qualquer tamanho sem ficar borrado, e os arquivos são minúsculos. Mas no
        momento em que você sai do navegador, o SVG começa a falhar. Você não consegue inserir
        um em apresentações de slides, fazer upload como avatar de redes sociais, anexar a um
        documento que espera uma imagem raster ou usá-lo em apps que simplesmente não entendem
        vetores. A solução é{" "}
        <strong>converter SVG para PNG</strong>: um formato raster universal que funciona em
        qualquer lugar.
      </p>
      <p>
        O <a href="/tools/svg-png">conversor BrowseryTools SVG para PNG</a> faz isso no seu
        navegador — cole ou faça upload de um SVG, escolha uma resolução e baixe um PNG nítido.
        Sem upload, sem conta, sem marca d'água. Este guia explica quando converter, como
        escolher a resolução certa e como manter um fundo transparente.
      </p>

      <h2>Como Converter SVG para PNG (Passo a Passo)</h2>
      <p>
        <strong>1. Abra o conversor.</strong> Vá para a página{" "}
        <a href="/tools/svg-png">SVG para PNG</a>.
        <br />
        <strong>2. Adicione seu SVG.</strong> Faça upload do arquivo ou cole o código SVG bruto.
        É lido localmente no seu navegador.
        <br />
        <strong>3. Escolha um tamanho.</strong> Defina a largura e altura de saída em pixels ou
        um multiplicador de escala. Como o SVG é um vetor, você pode renderizá-lo em qualquer
        resolução que quiser — essa é a vantagem principal.
        <br />
        <strong>4. Mantenha a transparência se necessário.</strong> PNG suporta fundo transparente,
        então um logotipo sem fundo permanece transparente na exportação.
        <br />
        <strong>5. Baixe.</strong> Salve o PNG. O original vetorial permanece intacto.
      </p>

      <h2>A Única Coisa a Acertar: Resolução</h2>
      <p>
        É aqui que a maioria das conversões SVG para PNG dá errado. Um vetor não tem tamanho
        inerente em pixels — é matemática. Quando você o rasteriza, <em>você</em> decide quantos
        pixels ele se torna, e uma vez que é um PNG esses pixels são fixos. Exporte muito pequeno
        e ele parecerá pixelado quando exibido maior; você não consegue ampliar um PNG sem
        borrar.
      </p>
      <p>
        A regra: <strong>renderize no maior tamanho em que você jamais exibirá, ou maior.</strong>{" "}
        Para um logotipo que pode aparecer em uma tela retina, exporte em 2&times; ou 3&times; o
        tamanho de exibição. Um ícone de 200&times;200 exibido em uma tela de alta resolução deve
        ser exportado em 400&times;400 ou 600&times;600 para permanecer nítido. Armazenamento é
        barato; um logotipo borrado não é.
      </p>

      <h2>Quando Converter SVG para PNG (e Quando Não Converter)</h2>
      <p>
        <strong>Converta para PNG quando:</strong> você precisa de um avatar ou banner para redes
        sociais, está adicionando uma imagem a uma apresentação ou documento, está enviando um
        gráfico por e-mail, precisa de um ícone de app em tamanho fixo ou o destino simplesmente
        não suporta SVG.
      </p>
      <p>
        <strong>Mantenha o SVG quando:</strong> você está usando-o em um site ou app que renderiza
        vetores. Na web, o SVG permanece perfeitamente nítido em qualquer nível de zoom e densidade
        de tela, o arquivo geralmente é menor e você pode estilizá-lo ou animá-lo com CSS.
        Converter um logotipo web para PNG joga fora todas essas vantagens. Para o quadro completo
        do que o SVG pode fazer, veja nosso{" "}
        <a href="/blog/svg-guide">guia completo de arquivos SVG</a>.
      </p>

      <h2>Fundo Transparente vs. Sólido</h2>
      <p>
        SVGs frequentemente não têm fundo — a tela é transparente. O PNG preserva essa
        transparência, então um logotipo flutuará limpo sobre qualquer cor. Se você precisar de
        um fundo sólido (por exemplo, um quadrado branco para uma foto de perfil que não permite
        transparência), achate-o em uma cor de fundo durante a conversão. O outro formato raster
        universal, o JPG, <em>não</em> suporta transparência, o que é mais uma razão pela qual
        o PNG é o alvo certo para gráficos com áreas transparentes.
      </p>

      <h2>Por que Converter no Navegador?</h2>
      <p>
        SVG é texto simples — pode conter scripts embutidos, e é por isso que fazer upload de um
        SVG para um servidor pode ser uma preocupação de segurança. Converter localmente no seu
        navegador significa que o arquivo é renderizado pela sua própria máquina e nunca enviado
        a lugar nenhum. Seu logotipo, seus ativos de marca e quaisquer dados embutidos ficam no
        seu dispositivo. É mais rápido também: sem espera de upload, sem fila de download, sem
        ida e volta ao servidor. Essa abordagem local primeiro é a mesma por trás de todos os
        utilitários do BrowseryTools — mais sobre isso em{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          por que ferramentas baseadas no navegador mantêm seus dados privados
        </a>
        .
      </p>

      <h2>Perguntas Frequentes</h2>
      <p>
        <strong>O PNG ficará borrado?</strong> Não se você exportar em resolução suficientemente
        alta. Renderize no maior tamanho que você exibirá, idealmente 2&times; para telas de alta
        resolução.
      </p>
      <p>
        <strong>O PNG mantém o fundo transparente?</strong> Sim. PNG suporta transparência, então
        um logotipo sem fundo permanece transparente.
      </p>
      <p>
        <strong>Posso converter PNG de volta para SVG?</strong> Não fielmente. Ir de raster para
        vetor requer rastreamento e só funciona bem para formas simples. Mantenha seu SVG original.
      </p>
      <p>
        <strong>A conversão é gratuita?</strong> Sim — sem conta, sem marca d'água, sem limites
        de tamanho.
      </p>
      <p>
        <strong>Meu arquivo é enviado?</strong> Não. O SVG é renderizado localmente no seu
        navegador.
      </p>

      <h2>Converta Agora</h2>
      <p>
        Abra o <a href="/tools/svg-png">conversor SVG para PNG</a>, defina o tamanho de saída e
        baixe uma cópia raster nítida do seu vetor. Se você precisar redimensionar, recortar ou
        adicionar marca d'água na imagem resultante, veja nosso guia sobre{" "}
        <a href="/blog/crop-and-watermark-images-online">recortar e adicionar marca d'água em imagens online</a>,
        e para entender o formato vetorial em si leia o{" "}
        <a href="/blog/svg-guide">guia completo de SVG</a>.
      </p>
    </div>
  );
}
