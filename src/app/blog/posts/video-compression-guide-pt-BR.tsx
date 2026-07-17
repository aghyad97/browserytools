import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Arquivos de vídeo são enormes por natureza. Um único minuto de filmagem 1080p não comprimida a
        30 quadros por segundo ocupa aproximadamente 1,5 GB de armazenamento. A compressão não é um
        extra — é o único motivo pelo qual o vídeo na internet é viável. Mas nem toda compressão é igual,
        e as configurações erradas podem produzir um arquivo que ainda é grande demais, parece
        visivelmente degradado, ou ambos.
      </p>
      <ToolCTA slug="compress-video" variant="inline" />
      <p>
        Você pode comprimir qualquer arquivo de vídeo agora mesmo usando o{" "}
        <a href="/tools/compress-video">Compressor de Vídeo do BrowseryTools</a> — gratuito, sem
        cadastro, e todo o processo roda localmente no seu navegador. Sua filmagem nunca sai do seu
        dispositivo.
      </p>

      <h2>Por que Arquivos de Vídeo Brutos São Tão Grandes?</h2>
      <p>
        Para entender o que a compressão faz, é preciso compreender com o que você começa. O vídeo
        digital é uma sequência de quadros individuais — imagens estáticas exibidas em rápida sucessão
        para criar a ilusão de movimento. Na resolução 1080p, cada quadro contém 1.920 × 1.080 =
        2.073.600 pixels. Se cada pixel armazena a cor como três canais de 8 bits (vermelho, verde,
        azul), isso dá aproximadamente 6 MB por quadro. A 30 fps, um segundo de vídeo não comprimido
        ocupa cerca de 180 MB. Um minuto são mais de 10 GB.
      </p>
      <p>
        Formatos brutos como RAW, BRAW ou Apple ProRes capturam vídeo próximo a esse estado não
        comprimido para preservar a qualidade máxima na edição de pós-produção. Formatos para consumidores,
        uploads em redes sociais e plataformas de streaming usam formatos comprimidos onde a maior parte
        desses dados foi descartada ou reconstruída — de maneiras que o olho humano mal percebe, se feito
        corretamente.
      </p>

      <h2>Como os Codecs de Vídeo Funcionam</h2>
      <p>
        Um codec (codificador-decodificador) é um algoritmo que comprime e descomprime dados de vídeo.
        A maioria dos codecs modernos usa duas técnicas complementares: compressão espacial dentro de
        cada quadro e compressão temporal entre quadros.
      </p>
      <p>
        A <strong>compressão espacial</strong> funciona como a compressão JPEG para imagens estáticas.
        Ela analisa cada quadro e descarta informações visuais difíceis de detectar pelo olho humano —
        gradações sutis de cor, texturas finas em áreas uniformes, detalhes de alta frequência em zonas
        periféricas. Isso reduz drasticamente o tamanho de cada quadro individual.
      </p>
      <p>
        A <strong>compressão temporal</strong> explora o fato de que quadros de vídeo consecutivos
        geralmente são muito semelhantes. Em vez de armazenar todos os pixels em todos os quadros, o
        codec armazena um quadro de referência completo (chamado de I-frame ou keyframe) em intervalos
        regulares, depois armazena apenas as diferenças — vetores de movimento e regiões alteradas —
        para os quadros intermediários (P-frames e B-frames). Um clipe de alguém falando contra um fundo
        estático mal muda de quadro a quadro, então a representação comprimida desses quadros intermediários
        é minúscula.
      </p>

      <h2>Os Principais Codecs Comparados</h2>
      <ul>
        <li>
          <strong>H.264 (AVC)</strong> — O carro-chefe da internet. Introduzido em 2003 e agora com suporte universal em navegadores, dispositivos e plataformas. Entrega boa qualidade com tamanhos de arquivo razoáveis e reproduz em praticamente qualquer dispositivo fabricado nos últimos 15 anos. Se você precisa de compatibilidade máxima, H.264 é o padrão seguro.
        </li>
        <li>
          <strong>H.265 (HEVC)</strong> — O sucessor do H.264, entregando qualidade visual equivalente com aproximadamente metade do tamanho de arquivo. O problema são as taxas de licenciamento, que retardaram a adoção. Com suporte nativo em dispositivos Apple e hardware Windows recente, mas o suporte em navegadores é irregular. Excelente opção para arquivamento ou fluxos de trabalho centrados em Apple.
        </li>
        <li>
          <strong>VP9</strong> — A resposta do Google ao H.265 e o codec por trás do YouTube. Livre de royalties e suportado no Chrome e Firefox. A eficiência de compressão é comparável ao H.265. Comumente usado para entrega web junto com contêineres WebM.
        </li>
        <li>
          <strong>AV1</strong> — O codec de última geração, desenvolvido pela Alliance for Open Media (Google, Netflix, Apple e outros). O AV1 alcança 30–50% melhor compressão que o H.264 na mesma qualidade. Livre de royalties, com suporte crescente em navegadores e dispositivos modernos. A desvantagem é a codificação muito lenta — o AV1 pode levar 10–20x mais tempo para codificar que o H.264. Bom para entrega final de conteúdo que será assistido muitas vezes; excessivo para compartilhamento rápido.
        </li>
      </ul>

      <h2>Taxa de Bits, Resolução e Taxa de Quadros: O que Realmente Controla o Tamanho do Arquivo</h2>
      <p>
        Três variáveis determinam o tamanho de um arquivo de vídeo comprimido:
      </p>
      <ul>
        <li>
          <strong>Taxa de bits</strong> — o número de bits de dados armazenados por segundo de vídeo. Taxa de bits mais alta significa mais dados, melhor qualidade e arquivo maior. Um upload 4K no YouTube pode usar 35–68 Mbps; um clipe web comprimido pode usar 2–5 Mbps. A taxa de bits é o controle mais direto do tamanho do arquivo.
        </li>
        <li>
          <strong>Resolução</strong> — as dimensões em pixels do quadro. Reduzir de 4K (3840×2160) para 1080p (1920×1080) reduz a contagem de pixels em 75%, o que permite um arquivo muito menor na mesma taxa de bits ou qualidade similar com taxa de bits dramaticamente menor. Para a maioria do conteúdo web, 1080p é indistinguível de 4K em distâncias e tamanhos de tela típicos.
        </li>
        <li>
          <strong>Taxa de quadros</strong> — o conteúdo padrão roda a 24, 25 ou 30 fps. Taxas de quadros mais altas (60 fps, 120 fps) requerem proporcionalmente mais dados para manter a qualidade. Reduzir de 60 fps para 30 fps aproximadamente dobra a taxa de bits necessária para qualidade equivalente — uma economia significativa para vídeos onde o movimento fluido não é a principal atração.
        </li>
      </ul>

      <h2>Compressão sem Perdas vs. com Perdas</h2>
      <p>
        A compressão sem perdas reduz o tamanho do arquivo sem descartar nenhum dado. O original pode
        ser perfeitamente reconstruído a partir do arquivo comprimido. Formatos como Apple ProRes 4444,
        FFV1 ou Huffyuv usam compressão sem perdas. São dramaticamente menores que os formatos brutos
        mas ainda muito grandes em comparação com formatos de distribuição. A compressão sem perdas é
        a escolha certa para masters de arquivo e fluxos de trabalho de edição — não para compartilhamento
        ou streaming.
      </p>
      <p>
        A compressão com perdas alcança taxas de compressão muito mais altas descartando permanentemente
        dados que o codificador considera imperceptíveis. H.264, H.265, VP9 e AV1 são todos com perdas.
        Uma vez que você comprime para um formato com perdas, as informações descartadas se foram. Isso
        é aceitável para distribuição — o espectador nunca sabe o que foi removido — mas importa
        enormemente para fluxos de trabalho, como discutido a seguir.
      </p>

      <h2>Perda de Geração: Por que Re-comprimir Degrada a Qualidade</h2>
      <p>
        Toda vez que você transcodifica (recomprime) um vídeo com perdas já comprimido, a qualidade
        degrada. O primeiro passo de compressão descarta algumas informações. O segundo passo trabalha
        sobre a versão já degradada e descarta mais. Na quinta ou sexta transcodificação, artefatos de
        compressão visíveis — blocagem, faixas, borrão — se acumulam de forma perceptível. Isso se chama
        perda de geração, por analogia com a degradação de qualidade vista ao copiar fitas VHS.
      </p>
      <p>
        A implicação prática: sempre comprima a partir da fonte original. Edite em um formato sem perdas
        ou de alta taxa de bits, depois comprima a exportação final uma vez para entrega. Nunca baixe
        novamente um vídeo de redes sociais e recomprima — você está começando de uma cópia já degradada
        e piorando ainda mais.
      </p>

      <h2>Alvos de Compressão para Casos de Uso Comuns</h2>
      <ul>
        <li>
          <strong>Anexo de e-mail</strong> — mantenha abaixo de 25 MB (a maioria dos clientes de e-mail impõe esse limite). Use H.264 em 720p, 1–2 Mbps. Para qualquer coisa com mais de 2–3 minutos, faça upload em um serviço de compartilhamento de arquivos e envie um link.
        </li>
        <li>
          <strong>Incorporação web</strong> — mire em menos de 5 MB para clipes curtos, 10–20 Mbps para os mais longos. H.264 em 1080p é uma escolha universal segura. AV1 ou VP9 em WebM serão menores para navegadores que suportam.
        </li>
        <li>
          <strong>Redes sociais</strong> — as plataformas recomprimem tudo, então faça upload na mais alta qualidade que seu fluxo de trabalho suporta dentro dos limites de tamanho delas. O limite do Instagram é 4 GB; o do TikTok é 287 MB para a maioria dos formatos. Como a plataforma adiciona sua própria passagem de compressão, começar de um arquivo de maior taxa de bits produz um resultado notavelmente melhor após a transcodificação deles.
        </li>
        <li>
          <strong>Master de arquivo</strong> — use sem perdas (ProRes 4444, FFV1) ou quase sem perdas (ProRes 422 HQ) em resolução total. O armazenamento é barato; recriar filmagem original é impossível.
        </li>
      </ul>

      <h2>Dicas Práticas para Escolher Configurações de Compressão</h2>
      <p>
        Algumas regras práticas que consistentemente produzem bons resultados:
      </p>
      <ul>
        <li>
          <strong>Use o modo CRF quando o tamanho do arquivo for flexível.</strong> O Fator de Taxa Constante permite que o codificador varie a taxa de bits dinamicamente, gastando mais bits em cenas complexas e menos em cenas simples. Isso produz melhor qualidade por tamanho de arquivo do que uma taxa de bits fixa. Para H.264, CRF 18–23 cobre o intervalo de quase sem perdas a bom o suficiente para web.
        </li>
        <li>
          <strong>Combine a resolução de saída com a plataforma de entrega.</strong> Reduzir uma fonte 4K para 1080p antes de aplicar a compressão dá ao codificador menos trabalho e produz uma saída mais limpa do que comprimir em 4K e deixar a plataforma reduzir o escalonamento.
        </li>
        <li>
          <strong>O áudio também importa.</strong> AAC a 128–192 kbps cobre a maioria do conteúdo estéreo. Raramente há uma diferença perceptível entre 192 kbps e 320 kbps para diálogos e música em volumes de audição típicos, mas a diferença no tamanho do arquivo é real.
        </li>
        <li>
          <strong>Teste antes de confirmar.</strong> Codifique um clipe de 30 segundos com suas configurações alvo e verifique-o no mesmo tipo de tela e conexão que seu público usará. Um arquivo que parece ótimo no seu monitor de edição em resolução total pode mostrar artefatos em uma tela de celular ou travar numa conexão lenta.
        </li>
      </ul>
      <p>
        Para compressão rápida sem configurar um ambiente de edição completo, o{" "}
        <a href="/tools/compress-video">Compressor de Vídeo do BrowseryTools</a> cuida das configurações
        para você e processa tudo no seu navegador — sem uploads, sem espera, sem acesso de terceiros
        à sua filmagem.
      </p>

      <div
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Conclusão principal:</strong> O melhor fluxo de compressão é editar em um formato de
        alta qualidade, comprimir uma vez para seu formato alvo e nunca recomprimir a saída. Escolha o
        codec certo para sua plataforma de entrega, combine a resolução com o tamanho de tela pretendido
        e use o modo CRF para compressão orientada à qualidade em vez de perseguir uma meta de taxa de
        bits arbitrária.
      </div>
      <ToolCTA slug="compress-video" variant="card" />
    </div>
  );
}
