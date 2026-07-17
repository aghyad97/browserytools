import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Duas das coisas mais comuns que as pessoas precisam fazer com uma imagem não têm nada a
        ver com edição sofisticada: <strong>recortá-la</strong> para o formato e tamanho certos
        e adicionar uma <strong>marca d'água</strong> para que não possa ser reutilizada sem
        crédito. Recortar ajusta uma foto a uma miniatura, um banner, um avatar quadrado ou uma
        proporção específica. Uma marca d'água protege seu trabalho e identifica suas capturas
        de tela. Você não precisa do Photoshop nem de uma assinatura para nenhum dos dois — e
        definitivamente não deveria fazer upload da imagem para o servidor de um desconhecido.
      </p>
      <ToolCTA slug="image-resizer" variant="inline" />
      <p>
        O <a href="/tools/image-resizer">redimensionador de imagens BrowseryTools</a> cuida de
        recorte, redimensionamento e marca d'água inteiramente no seu navegador. Sem upload, sem
        conta, sem marca d'água forçada pelo próprio tool. Este guia cobre como recortar com uma
        proporção precisa, redimensionar sem distorção e adicionar uma marca d'água que realmente
        inibe o reuso.
      </p>

      <h2>Como Recortar e Redimensionar uma Imagem (Passo a Passo)</h2>
      <p>
        <strong>1. Abra a ferramenta.</strong> Vá para o <a href="/tools/image-resizer">redimensionador de imagens</a>{" "}
        e adicione sua imagem. Ela é lida localmente — nunca enviada.
        <br />
        <strong>2. Escolha uma proporção ou recorte livre.</strong> Selecione uma predefinição
        como 1:1 (quadrado), 16:9 (banner) ou 4:5 (retrato), ou arraste livremente. As
        predefinições mantêm as proporções corretas para o destino.
        <br />
        <strong>3. Redimensione para os pixels exatos que você precisa.</strong> Defina largura e
        altura. Mantenha a proporção travada a menos que queira a imagem esticada.
        <br />
        <strong>4. Adicione uma marca d'água (opcional).</strong> Sobreponha seu nome, logotipo
        ou uma URL e defina sua posição e opacidade.
        <br />
        <strong>5. Exporte.</strong> Baixe o resultado. O original no seu disco permanece
        inalterado.
      </p>

      <h2>Recorte na Proporção Certa</h2>
      <p>
        O erro que arruína mais imagens do que qualquer outro é alterar a proporção
        descuidadamente, o que estica ou achata a foto. Rostos ficam largos, círculos viram
        ovais. Para evitar isso, decida o <em>formato</em> primeiro e recorte para ele, em vez
        de forçar a imagem existente em uma nova largura e altura. Alvos comuns:
      </p>
      <p>
        <strong>Quadrado 1:1</strong> — fotos de perfil, miniaturas de produtos, posts do grid do Instagram.
        <br />
        <strong>Widescreen 16:9</strong> — miniaturas de vídeo, slides de apresentação, banners hero.
        <br />
        <strong>Retrato 4:5</strong> — a proporção mais alta que o Instagram permite no feed,
        ótima para maximizar espaço na tela em mobile.
        <br />
        <strong>3:2 / 4:3</strong> — proporções clássicas de foto para impressões e galerias.
      </p>
      <p>
        Recorte para a proporção, <em>depois</em> redimensione para as dimensões em pixels que
        a plataforma quer. Essa ordem mantém tudo em proporção.
      </p>

      <h2>Redimensione sem Perder Nitidez</h2>
      <p>
        Reduzir uma imagem é seguro e até melhora o resultado. Ampliar <em>não</em> é — você não
        pode inventar detalhes que nunca foram capturados, então uma imagem ampliada parece
        desfocada ou pixelada. Sempre comece do original de maior resolução que você tiver e
        reduza a partir dele. Se você só precisa de um arquivo menor (não dimensões menores),
        isso é compressão, não redimensionamento — veja nosso{" "}
        <a href="/blog/free-image-tools-guide">guia de ferramentas de imagem gratuitas</a> para
        a diferença.
      </p>

      <h2>Adicione uma Marca D'água que Realmente Funcione</h2>
      <p>
        Uma boa marca d'água equilibra visibilidade e não arruinar a imagem. Alguns princípios:
      </p>
      <p>
        <strong>Coloque onde não pode ser recortada.</strong> Um logotipo minúsculo em um canto
        é fácil de recortar. Uma marca semitransparente no centro ou repetida pela imagem é muito
        mais difícil de remover.
        <br />
        <strong>Use opacidade moderada.</strong> Em torno de 30&ndash;50% deixa a imagem aparecer
        enquanto a marca permanece legível. Totalmente opaca parece pesada; quase invisível não
        oferece proteção.
        <br />
        <strong>Mantenha simples.</strong> Seu nome, handle ou domínio é suficiente. O objetivo
        é atribuição e dissuasão, não decoração.
      </p>
      <p>
        Lembre-se de que nenhuma marca d'água visível é inquebrantável — uma pessoa determinada
        pode cloná-la. O objetivo é tornar o reuso casual inconveniente e garantir que quando
        sua imagem se espalhar, seu nome viaje com ela.
      </p>

      <h2>Por que Editar no Navegador?</h2>
      <p>
        Recortar e adicionar marca d'água tratam do controle sobre suas próprias imagens — ainda
        assim, a maioria dos editores online faz upload do original para seus servidores primeiro.
        A edição no navegador mantém o arquivo no seu dispositivo o tempo todo: ele é carregado
        na página, editado pelo seu próprio navegador e exportado localmente. Nada é enviado, a
        ferramenta não adiciona nenhuma marca d'água própria e não há limite de tamanho atrás de
        paywall. É o mesmo modelo local primeiro por trás de cada utilitário do BrowseryTools,
        conforme explicado em{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          por que ferramentas baseadas no navegador mantêm seus dados privados
        </a>
        .
      </p>

      <h2>Perguntas Frequentes</h2>
      <p>
        <strong>Por que minha imagem parece esticada após o redimensionamento?</strong> A
        proporção mudou. Trave a proporção ou recorte para o formato alvo antes de redimensionar.
      </p>
      <p>
        <strong>Posso ampliar uma imagem pequena sem perder qualidade?</strong> Não realmente.
        O upscaling não consegue adicionar detalhes que nunca existiram. Comece do original maior.
      </p>
      <p>
        <strong>A ferramenta adicionará sua própria marca d'água?</strong> Não. Apenas a marca
        d'água que você adicionar aparecerá.
      </p>
      <p>
        <strong>Minha imagem é enviada?</strong> Não. Tudo é processado localmente no seu
        navegador.
      </p>
      <p>
        <strong>É gratuito?</strong> Sim — sem conta, sem limites, sem marca d'água forçada.
      </p>

      <h2>Experimente Agora</h2>
      <p>
        Abra o <a href="/tools/image-resizer">redimensionador de imagens</a> para recortar,
        redimensionar e adicionar marca d'água em um só lugar — tudo sem fazer upload. Se você
        também precisa ocultar detalhes sensíveis na foto, veja nosso guia sobre{" "}
        <a href="/blog/redact-image-online">redação de imagens online</a>, e para reduzir o
        tamanho final do arquivo leia nosso{" "}
        <a href="/blog/free-image-tools-guide">guia de ferramentas de imagem gratuitas</a>.
      </p>
      <ToolCTA slug="image-resizer" variant="card" />
    </div>
  );
}
