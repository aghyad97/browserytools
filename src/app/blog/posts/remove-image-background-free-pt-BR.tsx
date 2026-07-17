import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Remover o fundo de uma imagem costumava ser uma tarefa reservada a designers profissionais. Hoje, leva
        cerca de 5 segundos — e você pode fazê-lo inteiramente no seu navegador, sem uploads, sem conta, sem marcas d'água
        e sem custo. Este guia explica como a tecnologia funciona, por que as alternativas populares têm desvantagens
        significativas e como obter resultados perfeitos sempre usando o BrowseryTools.
      </p>

      <ToolCTA slug="bg-removal" variant="inline" />
      <h2>O jeito antigo: Photoshop e GIMP</h2>
      <p>
        Por décadas, remover o fundo de imagens significava uma de duas coisas: pagar pelo Adobe Photoshop (atualmente
        US$ 21,99/mês como parte do Creative Cloud) e gastar tempo aprendendo suas ferramentas de seleção, ou usar o
        gratuito, porém notoriamente complexo, GIMP, com sua curva de aprendizado íngreme.
      </p>
      <p>
        Até usuários experientes do Photoshop sabem que uma remoção de fundo limpa em um objeto detalhado — cabelo, pelo,
        objetos transparentes — pode levar de 10 a 30 minutos de mascaramento cuidadoso. A ferramenta "Selecionar objeto" melhorou
        as coisas, mas o trabalho de limpeza manual permaneceu. Para quem ainda não era designer, isso simplesmente
        não era uma opção viável para tarefas rápidas.
      </p>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>O custo real do Photoshop:</strong> US$ 21,99/mês significa que você paga US$ 264/ano só para ocasionalmente
        remover o fundo de uma foto de produto ou foto de perfil. Para a maioria das pessoas, essa não é uma troca
        razoável.
      </div>

      <h2>As ferramentas online "fáceis" — e seus custos ocultos</h2>
      <p>
        Uma onda de ferramentas online de remoção de fundo surgiu para preencher essa lacuna. O Remove.bg foi lançado em 2018 e tornou-se
        extremamente popular. O Canva adicionou a remoção de fundo como recurso. Dezenas de serviços semelhantes vieram em seguida.
        Eles resolvem o problema da complexidade — mas introduzem um conjunto diferente de problemas.
      </p>

      <h3>Remove.bg</h3>
      <p>
        O Remove.bg é genuinamente impressionante naquilo que faz. Mas o plano gratuito oferece apenas pré-visualizações em baixa resolução —
        os downloads em resolução completa exigem créditos que custam entre US$ 0,20 e US$ 1,99 por imagem dependendo do
        volume. Mais importante ainda, cada imagem que você processa é enviada aos servidores deles. A política de privacidade deles permite
        que retenham e processem suas imagens. Para fotos pessoais, imagens de produtos com informações
        proprietárias ou qualquer coisa sensível, isso é uma preocupação relevante.
      </p>

      <h3>Canva</h3>
      <p>
        A remoção de fundo do Canva está restrita ao Canva Pro, que custa US$ 12,99/mês ou US$ 119,99/ano. O plano
        gratuito não a inclui. Como o Remove.bg, o Canva processa suas imagens em seus servidores, ou seja, seus arquivos
        são enviados, processados remotamente e armazenados na infraestrutura de nuvem deles.
      </p>

      <h3>O padrão</h3>
      <p>
        Quase toda ferramenta online popular de remoção de fundo segue o mesmo modelo: envie sua imagem, processe-a
        remotamente, pague por resultados de qualidade. Até as versões "gratuitas" vêm com limites de resolução, marcas d'água,
        limites de processamento ou as três coisas. E suas imagens vão para os servidores de outra pessoa toda vez.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Insight essencial:</strong> Toda vez que você envia uma imagem para um serviço online processar, você está
        confiando seus dados a esse serviço. Para fotos pessoais, trabalhos de clientes ou imagens de produtos proprietários, isso
        é um risco significativo e, muitas vezes, desnecessário.
      </div>

      <h2>A abordagem do BrowseryTools: IA que roda no seu dispositivo</h2>
      <p>
        A Remoção de Fundo do BrowseryTools funciona de forma fundamentalmente diferente de todos os serviços descritos acima. O
        modelo de IA roda inteiramente dentro do seu navegador, usando o poder de processamento do seu próprio computador. Suas imagens nunca
        saem do seu dispositivo.
      </p>
      <p>
        Isso é possível graças a duas tecnologias trabalhando em conjunto:
      </p>
      <ul>
        <li>
          <strong>@imgly/background-removal:</strong> Uma biblioteca JavaScript de código aberto que implementa um
          modelo de rede neural treinado especificamente para segmentação de fundo. O modelo é baseado na arquitetura
          RMBG, que produz detecção de bordas de alta qualidade, particularmente em torno de cabelo, pelo e formas
          complexas.
        </li>
        <li>
          <strong>ONNX Runtime Web:</strong> O runtime do Open Neural Network Exchange permite que modelos de aprendizado
          de máquina rodem com eficiência no navegador usando WebAssembly e, opcionalmente, WebGPU para aceleração por
          hardware. É isso que torna a inferência de IA real no navegador prática — é a mesma tecnologia
          usada por ferramentas como o Whisper Web e as implementações web do Stable Diffusion.
        </li>
      </ul>
      <p>
        Os pesos do modelo são baixados uma vez para o cache do seu navegador no primeiro uso e, então, usados localmente para cada
        imagem subsequente. Após esse download inicial, a ferramenta funciona até offline.
      </p>

      <h2>Antes e depois: como é a remoção de fundo</h2>

      <div style={{display: "flex", gap: "16px", margin: "28px 0", flexWrap: "wrap" as const}}>
        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "8px", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"}}>
              🧑
            </div>
            <div style={{width: "100%", height: "60px", background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)", borderRadius: "0 0 12px 12px", position: "relative" as const, marginBottom: "-1px"}} />
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500}}>
            ANTES — Foto original com fundo carregado
          </p>
        </div>

        <div style={{display: "flex", alignItems: "center", fontSize: "2rem", fontWeight: 700, color: "#6366f1", padding: "0 8px"}}>
          →
        </div>

        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0 / 20px 20px", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"}}>
              🧑
            </div>
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#16a34a", fontWeight: 500}}>
            DEPOIS — Fundo transparente e limpo
          </p>
        </div>
      </div>

      <h2>Como remover um fundo usando o BrowseryTools</h2>
      <p>
        A <a href="/tools/bg-removal">ferramenta de Remoção de Fundo do BrowseryTools</a> foi projetada para ser o mais
        direta possível. Veja o processo completo, passo a passo:
      </p>
      <ol>
        <li>
          <strong>Abra a ferramenta.</strong> Navegue até <a href="/tools/bg-removal">/tools/bg-removal</a>. Na sua
          primeira visita, os pesos do modelo de IA serão baixados para o cache do seu navegador. Isso leva de 10 a 20 segundos dependendo
          da sua conexão e só acontece uma vez.
        </li>
        <li>
          <strong>Envie sua imagem.</strong> Clique na área de upload ou arraste e solte o arquivo de imagem. Os formatos
          suportados incluem JPEG, PNG, WebP e a maioria dos tipos de imagem comuns. O arquivo permanece no seu dispositivo.
        </li>
        <li>
          <strong>Aguarde o processamento.</strong> A IA analisa sua imagem localmente. O processamento normalmente leva
          de 2 a 8 segundos dependendo da resolução da imagem e do poder de processamento do seu dispositivo. Um indicador de progresso mostra
          a você em que ponto as coisas estão.
        </li>
        <li>
          <strong>Revise e baixe.</strong> O resultado aparece ao lado do seu original. Se você estiver satisfeito,
          baixe o PNG com fundo transparente. Se quiser testar outra imagem, basta enviar novamente.
        </li>
      </ol>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Zero uploads, zero contas:</strong> O BrowseryTools processa suas imagens inteiramente no seu próprio
        dispositivo. Nenhum dado de imagem é enviado a qualquer servidor em momento algum. Você não precisa criar uma conta, verificar
        um endereço de e-mail nem fornecer qualquer informação pessoal. Basta abrir a ferramenta e usá-la.
      </div>

      <h2>Quais tipos de imagem funcionam melhor</h2>
      <p>
        O modelo de IA é treinado em um conjunto de dados amplo, mas, como qualquer modelo, ele tem o melhor desempenho com certos tipos de imagens.
        Entender isso ajuda você a obter resultados excelentes de forma consistente.
      </p>

      <h3>Resultados excelentes</h3>
      <ul>
        <li><strong>Pessoas e retratos:</strong> O modelo é particularmente bem treinado em sujeitos humanos. Retratos, fotos do rosto e fotos de corpo inteiro com clara separação do sujeito produzem resultados quase perfeitos.</li>
        <li><strong>Fotografia de produtos:</strong> Itens sobre fundos simples — branco, cinza ou com iluminação de estúdio — são processados de forma muito limpa. As imagens de produtos de e-commerce são um caso de uso ideal.</li>
        <li><strong>Animais:</strong> Pets e animais geralmente funcionam bem, embora pelagens muito texturizadas com um fundo de tonalidade semelhante possam, às vezes, causar problemas nas bordas.</li>
        <li><strong>Veículos e objetos:</strong> Carros, móveis e outros objetos sólidos com silhuetas nítidas são processados de forma confiável.</li>
      </ul>

      <h3>Cenários desafiadores</h3>
      <ul>
        <li><strong>Vidro e objetos transparentes:</strong> Taças de vinho, garrafas de água e outros itens transparentes são difíceis para qualquer modelo de remoção de fundo, porque o fundo aparece através do próprio sujeito.</li>
        <li><strong>Detalhes muito finos:</strong> Tecidos de malha extremamente fina, renda ou cabelo esparso contra um fundo complexo podem apresentar alguma franja. Para trabalhos críticos, uma rápida limpeza manual em qualquer editor de imagem resolve as bordas.</li>
        <li><strong>Sujeitos de baixo contraste:</strong> Uma camisa branca contra uma parede branca é genuinamente difícil de segmentar — até para humanos. Forneça algum contraste entre o sujeito e o fundo sempre que possível.</li>
        <li><strong>Imagens de resolução muito baixa:</strong> Imagens menores que 200x200 pixels podem não fornecer detalhes suficientes para uma segmentação precisa.</li>
      </ul>

      <h2>Dicas para obter os melhores resultados</h2>
      <ul>
        <li><strong>Comece com a versão de maior resolução que você tiver.</strong> Mais pixels dão à IA mais informações para trabalhar, especialmente nas bordas. Você sempre pode reduzir a escala do resultado depois.</li>
        <li><strong>Garanta uma boa iluminação no sujeito.</strong> Iluminação uniforme com sombras mínimas facilita o trabalho do modelo. Sombras fortes podem, às vezes, ser interpretadas como parte do fundo.</li>
        <li><strong>Use um fundo limpo ao fotografar.</strong> Se você controla o ambiente da foto, um fundo de cor única sempre produzirá resultados mais limpos do que uma cena complexa, mesmo com processamento de IA.</li>
        <li><strong>Use a saída em PNG para transparência.</strong> O resultado baixado é sempre um PNG com fundo transparente, que pode ser colocado sobre qualquer novo fundo em qualquer ferramenta de design.</li>
      </ul>

      <h2>Casos de uso: onde imagens sem fundo realmente importam</h2>

      <h3>Fotos de produtos para e-commerce</h3>
      <p>
        A Amazon, o Shopify e a maioria dos marketplaces exigem ou recomendam fortemente imagens de produtos com fundo branco. Em vez
        de contratar um fotógrafo com estrutura de estúdio ou pagar por um serviço de retoque, você pode fotografar produtos sobre qualquer
        superfície neutra e remover o fundo em segundos com o BrowseryTools. Processe um catálogo de produtos inteiro
        sem enviar uma única imagem a um serviço de terceiros.
      </p>

      <h3>Fotos de perfil e avatares</h3>
      <p>
        Fotos profissionais para o LinkedIn, avatares do GitHub, perfis do Slack e biografias profissionais se beneficiam de um fundo
        limpo. Em vez de agendar uma sessão de estúdio só para uma foto, tire uma boa foto com luz decente
        e remova o fundo no seu navegador. Adicione um fundo de cor sólida ou gradiente em qualquer editor depois.
      </p>

      <h3>Apresentações e materiais de marketing</h3>
      <p>
        Imagens recortadas se integram de forma limpa a fundos de slides, layouts de infográficos e designs de banners. Em vez de
        procurar arquivos PNG que já tenham fundos transparentes, crie os seus a partir de qualquer foto que você tenha.
        Isso é especialmente útil para fotos de membros da equipe em apresentações corporativas.
      </p>

      <h3>Conteúdo para redes sociais</h3>
      <p>
        Posts do Instagram, miniaturas do YouTube, cabeçalhos do Twitter e conteúdos semelhantes muitas vezes se beneficiam de sujeitos
        isolados colocados sobre fundos temáticos ou com a sua marca. Uma versão sem fundo de um sujeito dá a você total
        flexibilidade para composições criativas.
      </p>

      <h3>Trabalho com clientes e confidencialidade</h3>
      <p>
        Se você trabalha com imagens de clientes — fotos de produtos, retratos, materiais proprietários — a última coisa que você
        quer é enviar esses arquivos a um servidor de terceiros. Com o BrowseryTools, as imagens dos clientes ficam na sua
        máquina. Ponto final.
      </p>

      <h2>Comparação direta: BrowseryTools vs. as alternativas</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Recurso</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Remove.bg</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Canva Pro</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Photoshop</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Custo</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Grátis</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>A partir de US$ 0,20/imagem</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>US$ 12,99/mês</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>US$ 21,99/mês</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Uploads de imagens</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Nenhum — apenas local</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sim, para os servidores deles</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sim, para os servidores deles</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Local (aplicativo de desktop)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Conta obrigatória</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Não</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Para créditos, sim</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sim</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Sim (Adobe ID)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Saída em resolução completa</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Sim</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Apenas pago</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Sim</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Sim</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Marcas d'água</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Nenhuma</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Apenas no plano gratuito</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Nenhuma</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Nenhuma</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Funciona offline</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Sim (após o primeiro carregamento)</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Não</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Não</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Sim</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Remoção de fundo em lote</h2>
      <p>
        Se você tem um lote de imagens de produtos para processar, o BrowseryTools também suporta a remoção de fundo em lote. Você
        pode enviar várias imagens de uma vez e processá-las sequencialmente sem sair da ferramenta nem configurar nenhum
        script de lote. Para vendedores de e-commerce ou criadores de conteúdo com grandes bibliotecas, isso torna a ferramenta
        genuinamente prática para fluxos de trabalho reais — não apenas para tarefas pontuais.
      </p>

      <h2>O que acontece com as suas imagens?</h2>
      <p>
        Nada sai do seu dispositivo. Quando você envia uma imagem para a ferramenta de Remoção de Fundo do BrowseryTools, o
        JavaScript da página lê o arquivo usando a File API do navegador e o passa diretamente para o runtime do ONNX
        rodando em um Web Worker. O modelo de segmentação roda localmente, o PNG de saída é gerado na
        memória e você o baixa. Em nenhum momento qualquer dado de imagem trafega por uma conexão de rede.
      </p>
      <p>
        Você pode verificar isso por conta própria abrindo a aba Rede (Network) das Ferramentas de Desenvolvedor do seu navegador enquanto usa a ferramenta.
        Após o download inicial do modelo, você verá zero requisições de rede ao processar uma imagem.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Transparência por design:</strong> O BrowseryTools é construído sobre o princípio de que seus dados pertencem a
        você. O processamento de IA baseado no navegador não é uma gambiarra — é a escolha arquitetural correta para ferramentas que
        lidam com conteúdo pessoal ou sensível.
      </div>

      <h2>Experimente agora mesmo</h2>
      <p>
        Sem conta. Sem cartão de crédito. Sem marcas d'água. Sem limites de tamanho no plano gratuito — porque não há plano pago.
        Basta abrir a ferramenta, soltar uma imagem e baixar um PNG transparente e limpo em segundos.
      </p>
      <div style={{background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Remova fundos de imagens — grátis, privado, instantâneo
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.9rem", color: "#64748b"}}>
          Com IA. Roda localmente. Sem uploads. Sem marcas d'água.
        </p>
        <a
          href="/tools/bg-removal"
          style={{background: "linear-gradient(135deg, #ec4899, #be185d)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Abrir ferramenta de Remoção de Fundo →
        </a>
      </div>
      <ToolCTA slug="bg-removal" variant="card" />
    </div>
  );
}
