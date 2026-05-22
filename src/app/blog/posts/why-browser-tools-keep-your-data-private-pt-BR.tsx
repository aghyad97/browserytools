import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Todos os dias, milhões de pessoas enviam arquivos sensíveis — declarações de impostos, fotos pessoais, relatórios confidenciais — para ferramentas online aleatórias que encontraram em uma busca no Google. A maioria nunca para para pensar no que acontece com esses dados depois de clicar em "Processar". A resposta, na maioria das vezes, é perturbadora.
      </p>

      <p>
        Ferramentas baseadas no navegador, como as do <strong>BrowseryTools</strong>, operam sob um princípio fundamentalmente diferente: <em>seus dados nunca saem do seu dispositivo</em>. Entender por que essa distinção importa pode proteger sua carreira, seu negócio e sua vida pessoal.
      </p>

      <h2>O custo oculto das ferramentas de nuvem "gratuitas"</h2>

      <p>
        Quando você visita uma ferramenta online típica — um compressor de imagens, um conversor de PDF, um gerador de senhas — e envia um arquivo, esse arquivo viaja do seu dispositivo até um servidor em algum lugar do mundo. Ele é processado naquele servidor, e o resultado é enviado de volta para você. À primeira vista, isso parece inofensivo. Por baixo da superfície, você não tem absolutamente nenhum controle sobre o que acontece em seguida.
      </p>

      <h3>Vazamentos de dados: seus arquivos são tão seguros quanto o servidor deles</h3>

      <p>
        Serviços de nuvem são alvos primários para hackers. Quando ocorre um vazamento, todo arquivo já enviado para aquele serviço fica potencialmente exposto — inclusive os seus. Incidentes de grande repercussão afetaram plataformas de compartilhamento de arquivos, conversores de documentos e até armazenamento corporativo em nuvem. O dano é agravado pelo fato de que você muitas vezes nem sabia que seus dados estavam armazenados.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Risco do mundo real:</strong> Um estudo de 2023 descobriu que mais de 80% dos serviços gratuitos de conversão de arquivos online retêm os arquivos enviados por períodos que variam de 24 horas a indefinidamente. Alguns armazenam arquivos permanentemente e os indexam para análises internas.
      </div>

      <h3>Políticas de retenção de dados escritas nas letras miúdas</h3>

      <p>
        A maioria das ferramentas de nuvem tem Termos de Serviço que lhes concedem uma <em>licença para usar seu conteúdo</em> a fim de melhorar seus serviços. Esse é um texto jurídico padrão que a maioria dos usuários ignora — mas significa que o PDF que você converteu ou a imagem que você editou pode ser usado para treinar modelos de machine learning, melhorar seus algoritmos de compressão ou ser compartilhado com parceiros de publicidade.
      </p>

      <ul>
        <li>Os arquivos costumam ser retidos por 30 a 90 dias "para fins de suporte ao cliente"</li>
        <li>O conteúdo enviado pode ser usado para treinamento de modelos sem consentimento explícito</li>
        <li>Ferramentas de análise de terceiros incorporadas ao site também podem receber metadados sobre seus envios</li>
        <li>A exclusão da conta raramente garante a exclusão dos dados na prática</li>
      </ul>

      <h3>Solicitações governamentais e intimações judiciais</h3>

      <p>
        Dados armazenados em um servidor em uma jurisdição estrangeira podem estar sujeitos às leis daquele país. Serviços de nuvem dos EUA podem receber Cartas de Segurança Nacional que os obrigam a entregar dados de usuários sem notificá-los. Serviços sediados na UE enfrentam suas próprias pressões governamentais. A conclusão: se os seus dados existem no servidor de outra pessoa, outra pessoa tem as chaves.
      </p>

      <h3>Monetização dos seus dados</h3>

      <p>
        Ferramentas "gratuitas" precisam ganhar dinheiro de alguma forma. Quando o produto é gratuito, muitas vezes você é o produto. Os dados do usuário — incluindo metadados sobre os arquivos que você envia, a frequência das suas visitas e até o conteúdo dos seus documentos — podem ser vendidos a corretores de dados, usados para publicidade direcionada ou licenciados a empresas de pesquisa.
      </p>

      <h2>Como o BrowseryTools é diferente: tudo roda no seu navegador</h2>

      <p>
        O BrowseryTools é construído em torno de um único princípio arquitetural: <strong>zero processamento no servidor</strong>. Cada cálculo acontece dentro do seu navegador usando JavaScript, Web APIs e WebAssembly. Quando você usa uma ferramenta do BrowseryTools, o único servidor envolvido é aquele que inicialmente entrega o código da página web — depois disso, o seu navegador faz todo o trabalho.
      </p>

      {/* Visual comparison */}
      <div style={{margin: "32px 0"}}>
        <h3>Ferramenta de nuvem vs. BrowseryTools: o que realmente acontece</h3>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
          {/* Cloud Tool column */}
          <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "20px"}}>
            <div style={{fontWeight: "700", color: "#ef4444", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              Ferramenta de nuvem típica
            </div>
            <ol style={{margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: "1.8"}}>
              <li>Você envia o seu arquivo</li>
              <li>O arquivo viaja pela internet até um servidor remoto</li>
              <li>O servidor processa o arquivo</li>
              <li>O resultado é enviado de volta para você</li>
              <li>O arquivo pode ser armazenado por dias, meses ou indefinidamente</li>
              <li>O arquivo fica sujeito a políticas de retenção, vazamentos e solicitações judiciais</li>
              <li>Os dados podem ser monetizados ou compartilhados</li>
            </ol>
          </div>

          {/* BrowseryTools column */}
          <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px"}}>
            <div style={{fontWeight: "700", color: "#16a34a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              BrowseryTools
            </div>
            <ol style={{margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: "1.8"}}>
              <li>Você abre uma ferramenta no seu navegador</li>
              <li>O código JavaScript carrega no seu dispositivo</li>
              <li>Você fornece o seu arquivo ou dados localmente</li>
              <li>O seu navegador processa tudo na sua CPU/GPU</li>
              <li>O resultado aparece instantaneamente no seu navegador</li>
              <li>Nada é enviado ou armazenado remotamente em momento algum</li>
              <li>Feche a aba — nenhum vestígio permanece em lugar nenhum</li>
            </ol>
          </div>
        </div>
      </div>

      <h2>A tecnologia por trás do processamento local</h2>

      <p>
        Ferramentas de navegador com privacidade em primeiro lugar só são possíveis graças aos avanços significativos nos recursos dos navegadores web ao longo da última década. Veja como o BrowseryTools aproveita essas tecnologias:
      </p>

      <h3>Remoção de fundo: modelo de machine learning ONNX rodando localmente</h3>

      <p>
        Remover o fundo de uma foto tradicionalmente exigia enviar sua imagem para um serviço de IA na nuvem, como o Remove.bg. A <Link href="/tools/bg-removal">ferramenta de remoção de fundo</Link> do BrowseryTools roda um modelo ONNX (Open Neural Network Exchange) comprimido diretamente dentro do seu navegador usando o ONNX Runtime for Web. Sua foto é processada por uma rede neural rodando na sua própria máquina — nenhum pixel é transmitido a lugar nenhum.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Como funciona:</strong> O arquivo do modelo ONNX é baixado uma vez e roda via WebAssembly em uma thread de worker em segundo plano. Os dados da sua imagem são passados ao modelo como um tensor, o modelo prevê uma máscara de segmentação pixel por pixel, e o resultado é composto novamente no seu navegador — tudo sem uma única requisição de rede contendo a sua imagem.
      </div>

      <h3>Geração de senhas: Web Crypto API</h3>

      <p>
        Quando você usa o <Link href="/tools/password-generator">gerador de senhas</Link>, o BrowseryTools chama <code>crypto.getRandomValues()</code> — uma API nativa do navegador respaldada pelo gerador de números pseudoaleatórios criptograficamente seguro (CSPRNG) do sistema operacional. Essa é a mesma fonte de entropia usada pelos sistemas operacionais para chaves criptográficas. A senha gerada é computada inteiramente na memória e exibida para você. Ela nunca é enviada a lugar nenhum.
      </p>

      <h3>Hashing: SubtleCrypto da Web Crypto API</h3>

      <p>
        O <Link href="/tools/hash-generator">gerador de hash</Link> usa a função <code>crypto.subtle.digest()</code> integrada ao navegador para computar hashes MD5, SHA-1, SHA-256 e SHA-512. Essa API é implementada nativamente pelo motor do navegador (V8, SpiderMonkey, etc.) e opera sobre os seus dados locais sem qualquer envolvimento de servidor.
      </p>

      <h3>Decodificação de JWT e processamento de texto</h3>

      <p>
        O <Link href="/tools/jwt-decoder">decodificador de JWT</Link> usa decodificação Base64 padrão — uma operação puramente de strings — para analisar os cabeçalhos e payloads dos tokens. Nenhum JWT que você cola é jamais enviado a um servidor. Isso importa enormemente em contextos profissionais, em que tokens JWT costumam conter declarações de identidade de usuário e informações de sessão.
      </p>

      {/* Comparison table */}
      <h2>Comparação de recursos: ferramentas de nuvem vs. ferramentas locais no navegador</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700"}}>Recurso</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700", color: "#ef4444"}}>Ferramenta de nuvem</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700", color: "#16a34a"}}>BrowseryTools</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Os dados ficam no seu dispositivo", "✗ Não", "✓ Sim"],
              ["Funciona offline após carregar", "✗ Não", "✓ Sim"],
              ["Não exige conta", "Às vezes", "✓ Sempre"],
              ["Sem risco de retenção de arquivos", "✗ Não", "✓ Sim"],
              ["Imune a vazamentos de servidor", "✗ Não", "✓ Sim"],
              ["Sem monetização de dados", "Raramente", "✓ Sim"],
              ["Compatível com a LGPD por design", "Complexo", "✓ Sim"],
              ["Sem limites de requisições de API", "Frequentemente limitado", "✓ Ilimitado"],
              ["Processa documentos sensíveis com segurança", "Arriscado", "✓ Sim"],
            ].map(([feature, cloud, browser], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "500"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: cloud.startsWith("✗") ? "#ef4444" : cloud === "✓ Sim" ? "#16a34a" : "#d97706"}}>{cloud}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "#16a34a", fontWeight: "600"}}>{browser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Por que isso importa para a LGPD, a HIPAA e as leis de privacidade</h2>

      <p>
        Se você trabalha em um setor regulamentado — saúde, jurídico, finanças, educação — as ferramentas que você usa para lidar com dados precisam estar em conformidade com as leis aplicáveis. Sob o <strong>GDPR</strong> (Regulamento Geral de Proteção de Dados), transmitir dados pessoais a um processador terceirizado exige um Acordo de Processamento de Dados e pode exigir informar os titulares dos dados. Sob a <strong>HIPAA</strong>, qualquer ferramenta que processe Informações de Saúde Protegidas precisa estar coberta por um Acordo de Parceiro Comercial.
      </p>

      <p>
        Quando o processamento acontece inteiramente no navegador, nenhuma dessas obrigações é acionada pela própria ferramenta — porque nenhum dado pessoal jamais chega a um terceiro. A exposição jurídica simplesmente não existe. Essa é uma vantagem significativa para:
      </p>

      <ul>
        <li>Freelancers e prestadores de serviço que lidam com dados de clientes</li>
        <li>Profissionais do direito que trabalham com documentos confidenciais</li>
        <li>Profissionais da saúde que precisam de utilitários rápidos de texto ou arquivo</li>
        <li>Jornalistas que protegem fontes sensíveis</li>
        <li>Desenvolvedores que depuram tokens e payloads de API em ambientes de produção</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Insight-chave:</strong> O processamento local no navegador não é apenas uma preferência de privacidade — muitas vezes é a única opção legalmente compatível para profissionais que trabalham com dados regulamentados e precisam de ferramentas utilitárias rápidas sem firmar acordos formais de processamento de dados com fornecedores.
      </div>

      <h2>Objeções comuns respondidas</h2>

      <h3>"Meu navegador não vai ser mais lento que um servidor?"</h3>

      <p>
        Os navegadores modernos executam JavaScript em motores V8 ou SpiderMonkey altamente otimizados com compilação JIT, e o WebAssembly roda em velocidade quase nativa. Para a grande maioria das tarefas utilitárias — hashing, codificação, conversão de formato, processamento de imagens — o seu dispositivo é mais do que capaz. Em muitos casos, o processamento local é <em>mais rápido</em> porque elimina inteiramente a latência da ida e volta pela rede.
      </p>

      <h3>"Essa abordagem realmente funciona para tarefas de IA como remoção de fundo?"</h3>

      <p>
        Sim. O ONNX Runtime for Web e o TensorFlow.js tornaram possível rodar redes neurais sofisticadas localmente. A aceleração por WebGPU (disponível em versões recentes do Chrome e do Firefox) pode acelerar drasticamente a inferência dos modelos. A qualidade da remoção de fundo local do BrowseryTools iguala a de muitos serviços de nuvem justamente porque o modelo subjacente é o mesmo — apenas o ambiente de execução difere.
      </p>

      <h3>"Como sei que os dados não estão sendo enviados secretamente?"</h3>

      <p>
        Você mesmo pode verificar isso. Abra as Ferramentas de Desenvolvedor do seu navegador (F12), vá até a aba Network e observe as requisições enquanto usa qualquer ferramenta do BrowseryTools. Você não verá nenhuma requisição de saída contendo os seus dados. Essa transparência é algo que nenhum serviço de nuvem de código fechado pode oferecer.
      </p>

      <h2>Uma observação sobre as próprias práticas de dados do BrowseryTools</h2>

      <p>
        O BrowseryTools não usa contas de usuário, não usa cookies para rastreamento e não usa análises de terceiros que recebam os dados dos seus arquivos. O site usa logs de acesso padrão do servidor web (como qualquer site) e pode usar análises que respeitam a privacidade para entender o tráfego agregado — mas o conteúdo do seu trabalho, arquivos, senhas e documentos nunca toca um servidor do BrowseryTools. Nunca.
      </p>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🔒</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Experimente o BrowseryTools — Seus dados ficam com você</h2>
        <p style={{margin: "0 0 20px", color: "inherit", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Mais de 70 ferramentas gratuitas — editores de imagem, utilitários para desenvolvedores, ferramentas de texto, conversores e muito mais — todas rodando 100% no seu navegador. Sem cadastro. Sem envios. Sem anúncios.
        </p>
        <Link
          href="/"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(99,102,241)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
        >
          Explorar todas as ferramentas gratuitas →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Ferramentas relacionadas: <Link href="/tools/password-generator">Gerador de Senhas</Link> · <Link href="/tools/hash-generator">Gerador de Hash</Link> · <Link href="/tools/bg-removal">Remoção de Fundo</Link> · <Link href="/tools/jwt-decoder">Decodificador de JWT</Link> · <Link href="/tools/text-encryption">Criptografia de Texto</Link>
      </p>

    </div>
  );
}
