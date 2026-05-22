export default function Content() {
  return (
    <div>
      <p>
        Antes de publicar uma captura de tela, compartilhar a foto de um documento ou fazer upload
        de uma imagem em um fórum público, quase sempre há algo no quadro que não deveria ser
        público: um rosto, uma placa de carro, um endereço residencial, um número de conta, um
        e-mail, um nome em um crachá. Recortar ajuda, mas a informação sensível frequentemente
        está no meio da foto. O que você realmente precisa é{" "}
        <strong>redigir ou censurar a imagem</strong> — desfocá-la, pixelizá-la ou apagá-la em
        preto — sem entregar o original a um site.
      </p>
      <p>
        A ferramenta <a href="/tools/photo-censor">BrowseryTools Photo Censor</a> faz exatamente
        isso, inteiramente no seu navegador. Você pinta sobre as regiões que deseja ocultar,
        escolhe desfoque, pixelização ou bloco sólido e exporta uma cópia limpa. Nada é enviado.
        Este guia explica como redigir uma imagem corretamente — e o erro que vaza silenciosamente
        os dados que você pensava ter ocultado.
      </p>

      <h2>Como Redigir ou Desfocar uma Imagem (Passo a Passo)</h2>
      <p>
        <strong>1. Abra a ferramenta.</strong> Vá para a página{" "}
        <a href="/tools/photo-censor">Photo Censor</a> e adicione sua imagem arrastando-a ou
        clicando para procurar. O arquivo é lido localmente.
        <br />
        <strong>2. Escolha um estilo de censura.</strong> O desfoque suaviza uma área, a
        pixelização a transforma em quadrados grandes, e o bloco sólido pinta completamente.
        <br />
        <strong>3. Pinte sobre as áreas sensíveis.</strong> Passe o pincel sobre cada rosto,
        placa, nome ou número que deseja ocultar. Você pode cobrir várias regiões em uma
        passagem.
        <br />
        <strong>4. Ajuste a intensidade.</strong> Para redação verdadeira, vá pesado — um
        desfoque suave pode ser revertido. Uma pixelização forte ou um bloco sólido é mais seguro.
        <br />
        <strong>5. Exporte.</strong> Baixe a imagem censurada. O original no seu disco nunca é
        modificado.
      </p>

      <h2>Desfoque vs. Pixelização vs. Bloco Sólido — Qual Usar</h2>
      <p>
        <strong>Bloco sólido</strong> é a única opção verdadeiramente irreversível. Os pixels
        abaixo são substituídos por uma cor plana, então não há nada para recuperar. Use para
        qualquer coisa que genuinamente nunca deve ser legível: documentos de identidade,
        detalhes financeiros, senhas, informações médicas.
      </p>
      <p>
        <strong>Pixelização pesada</strong> é o equilíbrio certo para a maioria das situações —
        oculta o conteúdo enquanto ainda mostra que havia algo ali (um rosto, uma tela, uma
        placa). Mantenha o tamanho do bloco grande; uma pixelização fina de texto às vezes pode
        ser parcialmente reconstruída.
      </p>
      <p>
        <strong>Desfoque</strong> parece mais limpo e funciona para desenfatizar um rosto em
        segundo plano ou um logotipo, mas um desfoque <em>leve</em> é a forma mais fraca de
        censura. Rostos e textos curtos sob um desfoque Gaussiano suave foram, em casos
        documentados, recuperados. Se os dados importam, não confie em um desfoque suave — vá
        forte ou use um bloco sólido.
      </p>

      <h2>O Erro que Vaza Dados Redigidos</h2>
      <p>
        A falha de redação mais comum não tem nada a ver com a intensidade do desfoque. É a
        <strong> metadados</strong>. Uma foto pode carregar dados EXIF — coordenadas GPS, o
        dispositivo que a capturou, o timestamp original — incorporados no próprio arquivo.
        Você pode apagar o endereço na imagem e ainda assim enviar a localização GPS exata nos
        metadados. Após redigir, considere remover esses dados; nosso{" "}
        <a href="/tools/image-converter">conversor de imagens</a> e o{" "}
        <a href="/blog/exif-data-guide">guia de metadados EXIF</a> explicam o que está oculto
        nas suas fotos e como removê-los.
      </p>
      <p>
        O segundo erro clássico é redigir de uma forma que pode ser desfeita: desenhando uma
        caixa preta como uma camada separada em um PDF ou editor vetorial, onde o texto abaixo
        ainda existe e pode ser selecionado ou movido. Como a ferramenta Photo Censor exporta
        uma imagem raster achatada, os pixels censurados estão genuinamente apagados — não há
        camada oculta para descascar.
      </p>

      <h2>Por que Redigir no Navegador, Não em um Site</h2>
      <p>
        É uma ironia marcante: as pessoas redigem uma imagem precisamente porque ela contém algo
        sensível, depois fazem upload desse original não redigido para os servidores de um editor
        online para fazer a redação. O objetivo é privacidade, e o fluxo de trabalho a derrota.
      </p>
      <p>
        A redação no navegador mantém o original no seu dispositivo o tempo todo. A imagem é
        carregada na página, editada pelo seu próprio navegador e exportada localmente. A versão
        não redigida nunca viaja pela internet, nunca aparece em um log e nunca fica no bucket de
        armazenamento de outra pessoa. Para uma explicação mais completa de por que esse modelo
        importa, veja{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          por que ferramentas baseadas no navegador mantêm seus dados privados
        </a>
        .
      </p>

      <h2>Perguntas Frequentes</h2>
      <p>
        <strong>Desfocar um rosto é realmente seguro?</strong> Só se o desfoque for forte. Um
        desfoque leve às vezes pode ser revertido. Para anonimato real, use pixelização pesada
        ou um bloco sólido.
      </p>
      <p>
        <strong>Uma imagem redigida pode ser des-redigida?</strong> Não se você usou um bloco
        sólido ou pixelização forte e exportou uma imagem achatada — os pixels subjacentes são
        substituídos. O risco só existe com desfoques fracos ou com editores que mantêm o
        original em uma camada oculta.
      </p>
      <p>
        <strong>A ferramenta faz upload da minha foto?</strong> Não. Tudo acontece no seu
        navegador. A imagem nunca é enviada a um servidor.
      </p>
      <p>
        <strong>E os dados de localização na foto?</strong> Redigir a imagem visível não remove
        os dados GPS do EXIF. Remova os metadados separadamente antes de compartilhar.
      </p>
      <p>
        <strong>É gratuito?</strong> Sim — sem conta, sem marca d'água, sem limites.
      </p>

      <h2>Experimente Agora</h2>
      <p>
        Abra a <a href="/tools/photo-censor">ferramenta Photo Censor</a>, pinte sobre qualquer
        coisa sensível e exporte uma cópia limpa que nunca saiu do seu dispositivo. Para terminar
        o trabalho, remova os metadados de localização com o{" "}
        <a href="/tools/image-converter">conversor de imagens</a>, e se você também precisa
        recortar ou adicionar marca d'água ao resultado, leia nosso guia sobre{" "}
        <a href="/blog/crop-and-watermark-images-online">recortar e adicionar marca d'água em imagens online</a>.
      </p>
    </div>
  );
}
