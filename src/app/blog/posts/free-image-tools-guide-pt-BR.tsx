export default function Content() {
  return (
    <div>
      <p>
        Toda semana, milhões de pessoas pagam assinaturas de softwares de edição de imagem ou enviam fotos
        sensíveis para ferramentas baseadas na nuvem — não porque precisam de recursos avançados, mas porque não
        conseguiram encontrar uma alternativa rápida e gratuita. O BrowseryTools existe para mudar isso. Toda ferramenta de imagem do conjunto
        roda inteiramente dentro do seu navegador, usando o poder de processamento do seu próprio dispositivo. Suas fotos nunca saem
        da sua máquina. Sem uploads, sem marcas d'água, sem assinaturas e sem limites de tamanho impostos por um servidor
        que precisa proteger sua conta de banda.
      </p>
      <p>
        Este guia cobre todas as ferramentas de imagem disponíveis no BrowseryTools, explica como cada uma funciona e
        percorre os casos de uso reais em que elas se destacam.
      </p>

      <h2>Por que você deveria parar de enviar imagens para ferramentas na nuvem</h2>
      <p>
        Antes de mergulhar nas ferramentas em si, vale a pena abordar por que o aspecto "sem upload" importa
        por mais do que apenas velocidade.
      </p>
      <ul>
        <li>
          <strong>Privacidade:</strong> Quando você envia uma imagem para um serviço na nuvem, está confiando o conteúdo dela
          a esse serviço. Fotos de perfil, documentos de identidade, mockups de produtos com marcas não lançadas,
          imagens de clientes e fotografias médicas são coisas que as pessoas rotineiramente enviam para ferramentas online
          gratuitas sem pensar no que acontece com esses arquivos no servidor.
        </li>
        <li>
          <strong>Marcas d'água:</strong> Muitas ferramentas gratuitas na nuvem aplicam marcas d'água a menos que você faça upgrade. O processamento baseado no navegador
          não tem essa limitação — a saída é a sua imagem, limpa e inalterada, exceto pelas
          mudanças que você solicitou.
        </li>
        <li>
          <strong>Limites de tamanho de arquivo:</strong> Ferramentas na nuvem frequentemente limitam os uploads a 5 MB, 10 MB ou 25 MB.
          Fotos de câmeras modernas e fotografias de produtos muitas vezes excedem esses limites. O processamento baseado no navegador
          trabalha com seu arquivo como ele é, limitado apenas pela memória do seu dispositivo.
        </li>
        <li>
          <strong>Velocidade:</strong> Enviar uma imagem grande, esperar o processamento no servidor e baixar
          o resultado leva tempo. O processamento local pula tudo isso — os resultados aparecem em segundos.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Como funciona o processamento de imagem baseado no navegador?</strong> Os navegadores modernos expõem um poderoso conjunto
        de APIs — incluindo a Canvas API — que permite ao JavaScript ler os dados de pixel de uma imagem, realizar
        transformações matemáticas sobre esses pixels (ajustando brilho, compressão, canais de cor,
        dimensões) e gerar um novo arquivo de imagem. Todo esse processamento acontece na sua CPU ou GPU, dentro
        da aba do navegador, sem necessidade de nenhuma requisição de rede.
      </div>

      <h2>Compressão de Imagem — Reduza arquivos sem sacrificar a qualidade</h2>
      <p>
        Arquivos de imagem grandes deixam os sites lentos, entopem anexos de e-mail e consomem armazenamento. A ferramenta de{" "}
        <a href="/tools/image-compression">Compressão de Imagem do BrowseryTools</a> reduz o tamanho do arquivo
        de imagens JPEG, PNG e WebP aplicando algoritmos de compressão inteligentes diretamente no navegador.
      </p>
      <p>
        Você controla o controle deslizante de qualidade, então pode encontrar o equilíbrio exato entre o tamanho do arquivo e a fidelidade
        visual para o seu caso de uso específico. Uma miniatura de blog tolera mais compressão do que uma foto de produto
        para um anúncio de e-commerce. A ferramenta mostra o tamanho original, o tamanho comprimido e a
        redução percentual para que você possa tomar uma decisão bem informada antes de baixar.
      </p>
      <h3>Casos de uso comuns para compressão de imagem</h3>
      <ul>
        <li>Otimizar imagens antes de enviá-las para um site ou CMS (imagens menores significam carregamentos de página mais rápidos e melhores pontuações de Core Web Vitals)</li>
        <li>Reduzir o tamanho das fotos antes de anexá-las a e-mails</li>
        <li>Comprimir imagens para armazenamento em dispositivos ou drives de capacidade limitada</li>
        <li>Preparar imagens para plataformas de redes sociais que impõem sua própria recompressão (muitas vezes agressiva)</li>
      </ul>

      <h2>Conversor de Imagem — Alterne entre PNG, JPEG, WebP e BMP</h2>
      <p>
        Plataformas e aplicativos diferentes exigem formatos de imagem diferentes. Desenvolvedores que trabalham com
        assets da web muitas vezes precisam de WebP para desempenho. Fluxos de trabalho de impressão podem exigir o tratamento de um espaço de cor específico.
        Alguns sistemas legados aceitam apenas BMP. O{" "}
        <a href="/tools/image-converter">Conversor de Imagem do BrowseryTools</a> permite converter entre PNG,
        JPEG, WebP e BMP em segundos.
      </p>
      <p>
        A conversão acontece inteiramente no navegador usando a Canvas API para decodificar o formato de origem e
        recodificar no formato de destino. Solte seu arquivo, selecione o formato de saída e baixe. Não há
        degradação de qualidade além do que é inerente ao próprio formato de destino (por exemplo, o JPEG não
        suporta transparência, então um PNG transparente convertido em JPEG ganhará um fundo branco).
      </p>
      <h3>Quando usar cada formato</h3>
      <ul>
        <li><strong>WebP:</strong> Melhor para uso na web — excelente compressão com suporte a transparência; suportado por todos os navegadores modernos</li>
        <li><strong>JPEG:</strong> Melhor para fotografias e imagens complexas em que o tamanho do arquivo importa; sem suporte a transparência</li>
        <li><strong>PNG:</strong> Melhor para gráficos, logotipos e imagens com transparência ou texto; sem perdas, mas com arquivos maiores</li>
        <li><strong>BMP:</strong> Formato não comprimido; use apenas quando exigido por um aplicativo específico ou sistema legado</li>
      </ul>

      <h2>Redimensionador de Imagem — Defina dimensões exatas em pixels</h2>
      <p>
        Seja preparando imagens para um formato específico de rede social, redimensionando uma foto de produto para se ajustar a
        um modelo ou reduzindo uma imagem grande para as dimensões de exibição na web, o{" "}
        <a href="/tools/image-resizer">Redimensionador de Imagem do BrowseryTools</a> oferece controle preciso sobre as dimensões
        de saída.
      </p>
      <p>
        Informe a largura e a altura desejadas em pixels. A ferramenta, opcionalmente, mantém a proporção original
        para evitar distorções. A imagem redimensionada é gerada usando a Canvas API do navegador e fica disponível
        para download imediato. Sem ida e volta ao servidor, sem espera, sem restrição de tamanho de arquivo.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Dimensões alvo comuns:</strong> Posts quadrados do Instagram (1080×1080), cabeçalho do Twitter/X
        (1500×500), foto de capa do LinkedIn (1584×396), miniatura do YouTube (1280×720), banner de e-mail padrão
        (600px de largura). Mantenha uma referência como esta nos favoritos e o Redimensionador de Imagem aberto em uma aba fixada para
        atender a qualquer solicitação de redimensionamento em menos de um minuto.
      </div>

      <h2>Correção de Cor — Ajuste brilho, contraste e saturação</h2>
      <p>
        Uma foto tirada em condições de iluminação imperfeitas muitas vezes precisa de uma correção de cor básica antes de estar
        pronta para uso. A ferramenta de <a href="/tools/color-correction">Correção de Cor do BrowseryTools</a> oferece
        controles deslizantes para brilho, contraste, saturação e matiz — os quatro ajustes essenciais que cobrem a
        maioria das necessidades de correção de fotos do dia a dia.
      </p>
      <p>
        Fotos subexpostas podem ser clareadas sem um editor de desktop. Imagens chapadas e desbotadas podem ganhar
        contraste e saturação para se destacarem. Os ajustes são aplicados em tempo real, então você pode ver
        o efeito enquanto arrasta os controles deslizantes, e o resultado é baixado como um arquivo de imagem padrão no momento em que você
        estiver satisfeito.
      </p>
      <h3>Casos de uso para correção de cor</h3>
      <ul>
        <li>Corrigir fotos de produtos feitas com iluminação inconsistente antes de adicioná-las a uma loja de e-commerce</li>
        <li>Preparar fotos de perfil ou da equipe para um site quando um retocador não está disponível</li>
        <li>Corrigir fotografias de eventos em que a iluminação interna criou dominantes de cor</li>
        <li>Aprimorar imagens de posts de blog para torná-las mais atraentes visualmente</li>
      </ul>

      <h2>Remoção de Fundo com IA — Sem necessidade de Photoshop</h2>
      <p>
        A remoção de fundo costumava exigir habilidades profissionais com Photoshop ou enviar sua imagem para
        um serviço que a processaria em seus servidores (e reteria uma cópia). A ferramenta de{" "}
        <a href="/tools/bg-removal">Remoção de Fundo do BrowseryTools</a> usa um modelo de aprendizado de máquina
        que roda diretamente no navegador para identificar o objeto principal de uma foto e remover o fundo.
      </p>
      <p>
        O resultado é um PNG com fundo transparente, pronto para uso sobre qualquer cor de fundo ou imagem.
        Isso é particularmente útil para fotografia de produtos de e-commerce, em que fundos brancos limpos ou transparentes
        são padrão; para criar fotos de perfil ou retratos com fundos personalizados; e para
        conteúdo de redes sociais em que você quer isolar um objeto e colocá-lo em um layout projetado.
      </p>
      <p>
        Como o modelo de IA roda localmente no navegador, suas fotos nunca saem do seu dispositivo — uma vantagem
        significativa de privacidade sobre os serviços de remoção de fundo na nuvem, que necessariamente retêm cópias das imagens
        enviadas em sua infraestrutura.
      </p>

      <h2>Um exemplo de fluxo de trabalho completo: preparar imagens de produtos para e-commerce</h2>
      <p>
        Veja como um fotógrafo de produtos ou um vendedor de e-commerce poderia usar o BrowseryTools para levar uma foto
        bruta de produto da câmera até estar pronta para a loja em poucos minutos:
      </p>
      <ol>
        <li>
          <strong>Correção de cor:</strong> Abra a foto na <a href="/tools/color-correction">Correção de Cor</a> e ajuste o brilho e o contraste para compensar inconsistências da iluminação de estúdio.
        </li>
        <li>
          <strong>Remoção de fundo:</strong> Envie a imagem corrigida para a <a href="/tools/bg-removal">Remoção de Fundo</a> para isolar o produto contra um fundo transparente.
        </li>
        <li>
          <strong>Redimensionar:</strong> Use o <a href="/tools/image-resizer">Redimensionador de Imagem</a> para deixar a imagem nas dimensões exigidas pela plataforma da sua loja (por exemplo, 2000×2000 para o Shopify).
        </li>
        <li>
          <strong>Comprimir:</strong> Passe a imagem redimensionada pela <a href="/tools/image-compression">Compressão de Imagem</a> para reduzir o tamanho do arquivo e ter carregamentos de página mais rápidos sem perda visível de qualidade.
        </li>
        <li>
          <strong>Converter:</strong> Use o <a href="/tools/image-converter">Conversor de Imagem</a> para gerar o arquivo em WebP para navegadores modernos ou JPEG para máxima compatibilidade.
        </li>
      </ol>
      <p>
        Todo esse fluxo de trabalho — que antes exigiria o Photoshop, um plano pago do Canva ou vários
        uploads diferentes para a web — agora pode ser concluído no BrowseryTools de graça, com cada etapa acontecendo
        localmente no seu dispositivo.
      </p>

      <h2>Sem instalações, sem contas, sem espera</h2>
      <p>
        Toda ferramenta de imagem do BrowseryTools está disponível imediatamente no seu navegador. Não há nada para
        baixar, nenhuma conta para criar, nenhum período de teste e nenhuma marca d'água na saída. Adicione aos favoritos as ferramentas
        que você usa com mais frequência e elas estarão prontas sempre que você precisar.
      </p>
      <p>
        Para equipes que lidam com imagens regularmente — designers, criadores de conteúdo, operadores de e-commerce, blogueiros,
        equipes de marketing — ter essas ferramentas nos favoritos e prontas elimina o atrito constante de
        recorrer a um aplicativo de desktop pesado para tarefas que levam menos de um minuto.
      </p>
      <p>
        Comece com a ferramenta que atende à sua necessidade mais imediata e explore o restante do conjunto de imagens
        no BrowseryTools conforme seu fluxo de trabalho exigir.
      </p>
    </div>
  );
}
