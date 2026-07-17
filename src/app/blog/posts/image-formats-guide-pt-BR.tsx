import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Escolher o formato de imagem errado é um dos erros mais comuns e mais custosos em desempenho web.
        Um JPEG onde um WebP seria suficiente, um PNG onde um JPEG é adequado, ou um formato que seu
        navegador não suporta — cada um desses adiciona peso desnecessário a cada carregamento de página,
        prejudicando diretamente suas pontuações de Core Web Vitals e a experiência do usuário. Este guia
        explica como JPEG, PNG, WebP e AVIF funcionam internamente, quando usar cada um e como fazer uma
        escolha informada para seu contexto específico.
      </p>
      <ToolCTA slug="image-converter" variant="inline" />
      <p>
        Você pode converter entre qualquer um desses formatos usando o{" "}
        <a href="/tools/image-converter">Conversor de Imagens do BrowseryTools</a> — gratuito, sem
        cadastro, e tudo roda localmente no seu navegador.
      </p>

      <h2>JPEG: O Padrão para Fotografias</h2>
      <p>
        JPEG (Joint Photographic Experts Group) foi introduzido em 1992 e continua sendo o formato
        dominante para fotografias. Seu algoritmo de compressão é baseado na Transformada Discreta de
        Cosseno (DCT): cada imagem é dividida em blocos de 8×8 pixels, e cada bloco é transformado do
        domínio espacial (cores dos pixels) para o domínio de frequência (com que rapidez as cores mudam
        pelo bloco). O codificador então quantiza esses dados de frequência — mantendo os componentes de
        baixa frequência que descrevem regiões de cores amplas, e descartando ou grosserizando os
        componentes de alta frequência que descrevem detalhes finos e bordas nítidas.
      </p>
      <p>
        É por isso que a compressão JPEG produz artefatos característicos em configurações agressivas:
        manchas em blocos de 8×8 (chamadas de macroblocos), borrão em torno de bordas nítidas e faixas
        de cor em gradientes. Esses artefatos aparecem em regiões de detalhes finos e alto contraste —
        exatamente as áreas onde os componentes de alta frequência que o codificador descartou teriam
        importado mais.
      </p>
      <p>
        JPEG é com perdas — cada salvamento descarta informações permanentemente. Na qualidade 85–90
        (em uma escala de 0 a 100), fotografias geralmente parecem indistinguíveis do original em
        tamanhos de visualização web, sendo 5–20× menores que um PNG da mesma imagem. JPEG não suporta
        transparência (canal alfa) ou animação.
      </p>

      <h2>PNG: Precisão sem Perdas</h2>
      <p>
        PNG (Portable Network Graphics) usa compressão sem perdas baseada no algoritmo DEFLATE, que
        combina a compressão de dicionário LZ77 (encontrando e substituindo sequências repetidas de bytes)
        com codificação Huffman (atribuindo códigos de bits mais curtos para valores mais frequentes).
        Nenhum dado de imagem é descartado. Cada pixel é armazenado exatamente.
      </p>
      <p>
        Isso torna o PNG excelente para imagens que devem ser reproduzidas pixel a pixel: capturas de
        tela, logotipos, ícones, ilustrações com bordas nítidas, texto sobreposto em imagens e qualquer
        coisa com transparência. PNG suporta canais alfa completos de 8 bits, permitindo gradientes
        semi-transparentes suaves.
      </p>
      <p>
        A desvantagem é o tamanho do arquivo. Para conteúdo fotográfico com gradientes de cor contínuos,
        os arquivos PNG são enormes em comparação com JPEG em qualidade percebida similar. Uma fotografia
        salva como PNG pode ser 10–20× maior do que a mesma imagem como JPEG bem comprimido. O PNG
        se destaca quando o conteúdo tem grandes regiões uniformes, bordas duras ou relativamente poucas
        cores distintas — os padrões que o LZ77 comprime eficientemente. A fotografia, com seus milhões
        de valores de cor sutilmente diferentes, é o pior caso para PNG.
      </p>

      <h2>WebP: O Formato Web Moderno</h2>
      <p>
        WebP foi introduzido pelo Google em 2010, derivado do codec de vídeo VP8. Ele suporta modos de
        compressão com perdas e sem perdas, além de animação e transparência em ambos os modos. O modo
        com perdas usa uma abordagem de bloco baseada em DCT similar ao JPEG, mas com técnicas de
        predição mais sofisticadas e codificação de entropia, tipicamente alcançando arquivos 25–35%
        menores que JPEG em qualidade visual equivalente. O modo sem perdas é 15–25% mais eficiente
        que PNG para a maioria dos conteúdos.
      </p>
      <p>
        O suporte dos navegadores agora é essencialmente universal — todos os principais navegadores
        suportam WebP desde 2020. A principal lacuna restante é em softwares legados: alguns aplicativos
        de edição de imagens mais antigos e visualizadores de imagens do sistema operacional não tratam
        WebP nativamente. Para entrega web, WebP é o padrão moderno direto que substitui tanto JPEG
        quanto PNG na maioria dos casos.
      </p>

      <h2>AVIF: A Próxima Geração</h2>
      <p>
        AVIF (AV1 Image File Format) é baseado em keyframes do codec de vídeo AV1, desenvolvido pela
        Alliance for Open Media e lançado em 2018. As técnicas de compressão do AV1 são significativamente
        mais sofisticadas do que as que sustentam JPEG ou WebP: blocos de predição maiores e de tamanho
        variável, predição intra-frame mais sofisticada, melhor tratamento de grão de filme e ruído,
        e codificação de entropia superior. O resultado são tipicamente arquivos 40–50% menores que JPEG
        em qualidade equivalente — frequentemente superando WebP em 20–30% também.
      </p>
      <p>
        AVIF suporta HDR completo, ampla gama de cores, transparência, animação e profundidade de cor
        de 8 e 10 bits. O suporte dos navegadores se acelerou: Chrome (85+), Firefox (93+) e Safari
        (16+) todos suportam AVIF. A principal desvantagem é a velocidade de codificação — AVIF é
        significativamente mais lento para codificar do que JPEG ou WebP, o que importa para pipelines
        de processamento de imagem em tempo real, mas é irrelevante para assets estáticos pré-comprimidos.
      </p>

      <h2>Comparação de Tamanho de Arquivo para a Mesma Imagem</h2>
      <p>
        Para tornar as diferenças concretas, aqui está uma comparação representativa para uma fotografia
        de 1920×1080 em qualidade visual percebida comparável:
      </p>
      <ul>
        <li>
          <strong>PNG (sem perdas)</strong> — 4,2 MB. Reprodução perfeita, sem artefatos. Adequado para um master de origem ou quando precisão de pixel é necessária.
        </li>
        <li>
          <strong>JPEG (qualidade 85)</strong> — 380 KB. Artefatos mínimos visíveis em tamanho de tela. O padrão para entrega fotográfica na web por três décadas.
        </li>
        <li>
          <strong>WebP (com perdas, qualidade equivalente)</strong> — 270 KB. Cerca de 30% menor que JPEG, visualmente comparável. Uma atualização direta para a maioria dos projetos web.
        </li>
        <li>
          <strong>AVIF (qualidade equivalente)</strong> — 180 KB. Cerca de 50% menor que JPEG, visualmente comparável ou melhor. O melhor tamanho de arquivo disponível hoje para conteúdo fotográfico.
        </li>
      </ul>
      <p>
        Esses são valores representativos; as proporções reais variam pelo conteúdo da imagem. Fotografias
        com muitos detalhes e ruído se beneficiam menos dos codecs mais novos do que imagens suaves e
        com pouco ruído.
      </p>

      <h2>Quando Usar Cada Formato</h2>
      <ul>
        <li>
          <strong>Fotografias na web</strong> — Use WebP com fallback JPEG via o elemento HTML{" "}
          <code>&lt;picture&gt;</code>. Se seu pipeline de build suporta codificação AVIF, sirva AVIF
          com fallbacks WebP e JPEG.
        </li>
        <li>
          <strong>Logotipos, ícones, elementos de UI com transparência</strong> — WebP (sem perdas) ou PNG. JPEG não pode representar transparência de forma alguma.
        </li>
        <li>
          <strong>Capturas de tela e gravações de tela</strong> — PNG para qualquer coisa que exija reprodução exata de pixel. WebP sem perdas para uma alternativa menor quando fidelidade exata não é crítica.
        </li>
        <li>
          <strong>Ilustrações com cores planas e bordas nítidas</strong> — PNG ou WebP sem perdas. JPEG introduzirá artefatos de halo visíveis em torno de bordas duras mesmo em configurações de alta qualidade.
        </li>
        <li>
          <strong>Impressão e arquivo</strong> — PNG (sem perdas) ou TIFF. Formatos com perdas são inadequados para assets de origem que serão reeditados.
        </li>
        <li>
          <strong>E-mail</strong> — JPEG ou PNG. Clientes de e-mail têm suporte inconsistente para WebP e essencialmente nenhum para AVIF. Compatibilidade acima de otimização aqui.
        </li>
      </ul>

      <h2>Impacto nos Core Web Vitals e Desempenho da Página</h2>
      <p>
        O Largest Contentful Paint (LCP) — um dos Core Web Vitals do Google — mede quanto tempo leva
        para o maior elemento de conteúdo visível (frequentemente uma imagem hero) carregar. A escolha
        do formato de imagem afeta diretamente o LCP: uma imagem hero AVIF carrega mais rápido que o
        JPEG equivalente, e um LCP mais rápido melhora tanto a experiência do usuário quanto o
        posicionamento nos resultados de busca.
      </p>
      <p>
        O efeito composto também importa. Uma página com 20 imagens de produtos, cada uma desnecessariamente
        salva como PNG em vez de WebP, pode ser 5–10 MB mais pesada do que o necessário. Em conexões
        móveis, essa é a diferença entre uma página que carrega em 2 segundos e outra que carrega em
        8 segundos.
      </p>

      <h2>Servindo Formatos Diferentes para Diferentes Navegadores</h2>
      <p>
        O elemento HTML <code>&lt;picture&gt;</code> e seus filhos <code>&lt;source&gt;</code> permitem
        servir o melhor formato que cada navegador suporta sem JavaScript:
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
{`<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero image" />
</picture>`}
      </pre>
      <p>
        O navegador escolhe o primeiro <code>&lt;source&gt;</code> que suporta. Navegadores com suporte
        a AVIF baixam o arquivo menor; navegadores sem suporte recaem para WebP ou JPEG. A tag{" "}
        <code>&lt;img&gt;</code>{" "}
        no final serve como fallback universal e é o único elemento que requer o atributo{" "}
        <code>alt</code>.
      </p>
      <p>
        Para converter suas imagens existentes para WebP ou AVIF para esse tipo de configuração
        multi-formato, o{" "}
        <a href="/tools/image-converter">Conversor de Imagens do BrowseryTools</a> lida com conversões
        em lote sem fazer upload de nada para um servidor — seus arquivos de origem permanecem no seu
        dispositivo.
      </p>

      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Guia de decisão rápida:</strong> Se você precisa de compatibilidade máxima, use JPEG
        para fotos e PNG para gráficos. Se está otimizando para desempenho web, use WebP como linha de
        base e adicione AVIF como aprimoramento. Se está construindo um novo projeto do zero com uma
        stack moderna, sirva AVIF com fallback WebP e pare de se preocupar com JPEG completamente.
      </div>
      <ToolCTA slug="image-converter" variant="card" />
    </div>
  );
}
