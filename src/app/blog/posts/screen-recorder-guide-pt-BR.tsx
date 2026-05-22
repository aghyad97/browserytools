import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Os softwares de gravação de tela historicamente foram uma daquelas ferramentas em que você paga caro por
        algo que parece que deveria ser um utilitário básico. O Camtasia custa cerca de US$ 300 em compra
        única, ou US$ 170/ano por assinatura. O ScreenFlow para Mac sai por US$ 150. O Loom — que se posiciona
        como a opção leve — limita os usuários gratuitos a gravações de 5 minutos e empurra todo mundo
        para um plano pago. E cada uma dessas ferramentas exige instalação, criação de conta
        e confiar em um aplicativo de terceiros com acesso à sua tela inteira.
      </p>
      <p>
        Eis o que a maioria das pessoas não percebe: o seu navegador já sabe gravar a sua tela.
        A <strong>Screen Capture API</strong> (<code>getDisplayMedia</code>) é um padrão do W3C que
        está presente em todos os principais navegadores há anos. O{" "}
        <Link href="/tools/screen-recorder">Gravador de Tela do BrowseryTools</Link> coloca uma interface limpa e prática
        em cima disso — para que você possa gravar sua tela, uma janela específica ou uma única aba
        do navegador sem instalar nada, criar uma conta ou pagar um centavo.
      </p>

      <h2>Compatibilidade de navegadores: isso funciona para 98%+ dos seus usuários</h2>
      <p>
        A Screen Capture API tem amplo suporte em todos os navegadores modernos. Você não precisa se preocupar
        com a compatibilidade para nenhum público realista:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Navegador</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Versão mínima</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Ano de lançamento</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Observações</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Chrome", "72+", "2019", "Suporte completo, incluindo captura de aba"],
              ["Edge", "79+", "2020", "Baseado no Chromium; mesmo suporte do Chrome"],
              ["Firefox", "66+", "2019", "Suporte completo; ótima captura de áudio"],
              ["Safari", "13+", "2019", "Suportado; captura de aba adicionada no Safari 15.4"],
            ].map(([browser, version, year, notes], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{browser}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace"}}>{version}</td>
                <td style={{padding: "11px 16px"}}>{year}</td>
                <td style={{padding: "11px 16px", opacity: 0.8}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        A participação de mercado combinada dos navegadores nessas versões cobre bem mais de 98% dos usuários de desktop no mundo todo.
        Para fins práticos, se o seu público usa um navegador moderno — o que ele quase certamente faz
        — a Screen Capture API simplesmente funciona.
      </p>

      <h2>O que você pode capturar</h2>
      <p>
        Quando você clica em "Iniciar gravação", o navegador exibe seu seletor de tela nativo. Você recebe
        três modos de captura, e a escolha importa dependendo do seu caso de uso:
      </p>
      <ul>
        <li>
          <strong>Tela inteira:</strong> Captura tudo o que estiver visível em um dos seus monitores. Melhor para
          demonstrações em que você alterna entre vários aplicativos ou quando quer mostrar comportamento em nível
          de sistema. Observe que isso mostra tudo — incluindo notificações, barra de tarefas e quaisquer outras
          janelas — então feche conteúdo sensível antes de gravar.
        </li>
        <li>
          <strong>Uma janela de aplicativo específica:</strong> Captura apenas uma janela, mesmo que outras
          janelas a sobreponham. A gravação permanece focada nesse aplicativo. Boa para demonstrações de software
          em que você quer ficar em um único app sem revelar suas outras janelas abertas.
        </li>
        <li>
          <strong>Uma única aba do navegador:</strong> Esta é a opção mais consciente em relação à privacidade. Apenas o
          conteúdo de uma aba do navegador é capturado — outras abas, sua barra de endereços, outros aplicativos e
          sua área de trabalho ficam completamente excluídos da gravação. Ideal para gravar tutoriais de aplicações web
          ou demonstrações baseadas no navegador sem mostrar mais nada.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Captura de aba para máxima privacidade:</strong> Se você estiver gravando uma demonstração de uma aplicação web
        e não quiser mostrar outras abas do navegador, outros aplicativos ou qualquer interface do sistema, use a
        opção "Aba do navegador" no seletor de tela. Apenas o conteúdo em pixels daquela única aba é capturado.
        Mais nada na sua máquina fica visível na gravação.
      </div>

      <h2>Passo a passo: como usar o Gravador de Tela do BrowseryTools</h2>
      <p>
        O processo inteiro leva menos de um minuto para obter sua primeira gravação. Veja exatamente como ele
        funciona:
      </p>
      <ol>
        <li>
          <strong>Abra a ferramenta:</strong> Acesse <Link href="/tools/screen-recorder">/tools/screen-recorder</Link>.
          Sem login, sem configuração, nada para instalar. A ferramenta está pronta no momento em que a página carrega.
        </li>
        <li>
          <strong>Clique em "Iniciar gravação":</strong> O navegador imediatamente mostra sua caixa de diálogo nativa de
          seleção de tela. Essa é uma interface em nível de navegador — o site não consegue ver nem influenciar o que é mostrado
          nessa caixa de diálogo, e não consegue começar a capturar até você confirmar explicitamente a sua seleção.
        </li>
        <li>
          <strong>Escolha o que capturar:</strong> Selecione "Tela inteira", "Janela" ou "Aba do navegador"
          nas abas do seletor. Clique na miniatura da tela/janela/aba que você quer gravar e, então,
          clique no botão "Compartilhar" para começar.
        </li>
        <li>
          <strong>Grave:</strong> A ferramenta exibe um contador de tempo decorrido ao vivo para que você sempre saiba há
          quanto tempo está gravando. Alterne para o aplicativo ou conteúdo que estiver demonstrando — a
          aba do navegador que roda o gravador permanece ativa em segundo plano. Você pode conferir o cronômetro
          dando uma olhada na aba.
        </li>
        <li>
          <strong>Clique em "Parar gravação":</strong> Quando terminar, clique em Parar. A gravação fica
          instantaneamente disponível como uma pré-visualização de vídeo dentro da ferramenta. Sem processamento, sem espera — ela aparece
          imediatamente porque tudo foi capturado localmente na memória.
        </li>
        <li>
          <strong>Pré-visualize e baixe:</strong> Assista à pré-visualização para confirmar que a gravação capturou
          o que você pretendia. Clique em "Baixar" para salvar o arquivo como um vídeo <code>.webm</code> na sua
          máquina local. A gravação nunca é enviada para lugar nenhum.
        </li>
      </ol>

      <h2>O formato de saída: WebM</h2>
      <p>
        A Screen Capture API gera vídeo no formato <strong>WebM</strong> usando o codec VP8 ou VP9
        (dependendo de qual o seu navegador selecionar). O WebM é um formato aberto e isento de royalties
        desenvolvido pelo Google e padronizado para uso na web. Para screencasts especificamente, ele tem várias
        vantagens sobre o MP4:
      </p>
      <ul>
        <li>
          <strong>Tamanho de arquivo menor:</strong> A compressão VP9 é altamente eficiente para conteúdo de tela
          com grandes áreas chapadas de cor, texto e elementos de interface — exatamente o que os screencasts contêm.
          Um screencast de 5 minutos em WebM costuma ser de 30% a 50% menor do que a mesma gravação em H.264 MP4.
        </li>
        <li>
          <strong>Padrão aberto:</strong> Sem taxas de licenciamento, sem pagamentos de royalties, sem encargos de patentes.
          O WebM é o formato de vídeo nativo da web.
        </li>
        <li>
          <strong>Reprodução direta no navegador:</strong> O WebM é reproduzido nativamente no Chrome, no Firefox e no Edge
          sem nenhum plugin. Você pode compartilhar um arquivo WebM e qualquer pessoa nesses navegadores pode assisti-lo diretamente.
        </li>
      </ul>
      <p>
        <strong>Convertendo WebM para MP4:</strong> Se você precisar compartilhar a gravação com alguém que use
        o QuickTime no macOS ou o Windows Media Player — ou enviá-la para uma plataforma que não aceita WebM
        — você pode convertê-la gratuitamente usando uma ferramenta local como o{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer">HandBrake</a> (código
        aberto, processamento local) ou usando a linha de comando do FFmpeg. A conversão leva alguns segundos
        e o MP4 resultante é universalmente compatível.
      </p>

      <div style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6", margin: "16px 0"}}>
        <pre style={{margin: 0}}><code>{`# FFmpeg one-liner to convert WebM to MP4 (free, local, no upload needed):
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4`}</code></pre>
      </div>

      <h2>Casos de uso: quando um gravador no navegador é exatamente o que você precisa</h2>

      <h3>Relatórios de bug</h3>
      <p>
        Descrever um bug em texto é uma das experiências mais frustrantes no desenvolvimento de software.
        "Não funciona quando eu clico no botão" é quase inútil. Uma gravação de tela de 30 segundos dos
        passos exatos para reproduzir — mostrando no que você clicou, o que aconteceu, o que deveria ter acontecido
        — dá ao engenheiro tudo o que ele precisa para diagnosticar o problema imediatamente. Grave o bug
        enquanto ele acontece, baixe o WebM e anexe-o ao ticket. Sem upload para um serviço de terceiros,
        sem limites de tamanho no Jira ou no Linear e sem preocupações de privacidade sobre o que estava visível na sua tela
        durante a gravação.
      </p>

      <h3>Criação de tutoriais sem software pesado</h3>
      <p>
        Nem todo tutorial precisa de produção profissional. Se você está documentando um processo para a sua equipe
        — como configurar uma ferramenta, como navegar por um fluxo de trabalho complexo, como configurar um ambiente —
        uma gravação de tela com narração captura isso em minutos. O gravador do BrowseryTools permite que você
        inclua áudio do microfone (conceda a permissão ao navegador quando solicitado), para que você possa narrar enquanto
        trabalha. O resultado é um tutorial completo e autocontido que vive em um único arquivo para download.
      </p>

      <h3>Revisões de código</h3>
      <p>
        Comentários em texto em um pull request muitas vezes são insuficientes para um feedback cheio de nuances. Uma gravação de tela
        em que você percorre um diff verbalmente — "aqui na linha 42, estou preocupado com isso porque..." —
        é drasticamente mais eficiente do que escrever um comentário de cinco parágrafos. Grave um passo a passo de 3 minutos
        do PR, baixe-o e poste-o como anexo ou compartilhe o arquivo. Seu revisor recebe o
        contexto completo do seu raciocínio sem uma reunião.
      </p>

      <h3>Demonstrações remotas e comunicação assíncrona</h3>
      <p>
        Em vez de agendar uma reunião para demonstrar um recurso, grave-o. Uma gravação de 2 minutos mostrando o
        recurso funcionando muitas vezes é mais persuasiva e eficiente do que uma demonstração ao vivo, porque pode ser
        assistida a qualquer momento, repetida conforme necessário e compartilhada com qualquer pessoa na organização. Grave sua
        demonstração com antecedência, revise-a e envie-a quando estiver pronta. Sem agendamento, sem conflitos de fuso horário,
        sem o atrito do "você pode compartilhar a sua tela".
      </p>

      <h3>Tickets de suporte</h3>
      <p>
        Para equipes de suporte ou centrais de ajuda internas, uma gravação de tela enviada com um ticket de suporte
        reduz drasticamente as idas e vindas. Em vez de fazer ao usuário dez perguntas de esclarecimento sobre
        o que ele estava fazendo quando o problema ocorreu, ele grava exatamente o que aconteceu. O agente de
        suporte vê o problema em primeira mão, muitas vezes o resolve imediatamente, e o usuário obtém uma resposta mais rápida.
      </p>

      <h2>Áudio: incluindo o microfone na sua gravação</h2>
      <p>
        Quando você inicia a gravação, o navegador perguntará se deve incluir áudio. Se você quiser narrar
        sua gravação, permita o acesso ao microfone quando solicitado. Sua voz será gravada junto com a
        captura de tela no mesmo arquivo WebM — sem trilha de áudio separada para sincronizar, sem software
        adicional necessário.
      </p>
      <p>
        Se você quiser gravar o áudio do sistema (os sons vindos do seu computador — música, sons de
        notificação, áudio de aplicativos), isso é tratado de forma diferente nos navegadores. O Chrome no Windows
        permite a captura de áudio do sistema ao gravar uma aba do navegador. No macOS, a captura de áudio do sistema
        requer um dispositivo de áudio virtual como o BlackHole ou o Loopback, já que o SO não expõe uma
        API de captura de áudio do sistema. Para a maioria dos casos de uso de screencast — em que a narração é o áudio principal —
        a gravação do microfone é suficiente e funciona de forma consistente em todas as plataformas.
      </p>

      <h2>Privacidade: a gravação nunca sai do seu navegador</h2>
      <p>
        Esse não é um detalhe menor. A gravação é armazenada na memória como um objeto <code>Blob</code>
        dentro da aba do seu navegador. Quando você clica em "Baixar", o navegador grava esse blob no seu sistema
        de arquivos local. Nada é enviado a nenhum servidor — nem aos servidores do BrowseryTools, nem a nenhum serviço
        de nuvem. A gravação não trafega pela rede em momento algum.
      </p>
      <p>
        Isso importa mais quando você está gravando conteúdo sensível: fluxos de trabalho internos da empresa, dados de
        clientes, recursos de produtos não lançados ou qualquer coisa que não deva sair da sua máquina. Com
        gravadores de tela baseados na nuvem, você precisa confiar que a infraestrutura de upload, armazenamento e
        controle de acesso do provedor é segura. Com um gravador local baseado no navegador, não há
        upload com que se preocupar.
      </p>

      <h2>Limitações: o que o gravador do navegador não consegue fazer</h2>
      <p>
        A abordagem baseada no navegador é ideal para os casos de uso descritos acima, mas tem limitações
        genuínas que você deve conhecer antes de recorrer a ela em contextos em que ela ficará aquém:
      </p>
      <ul>
        <li>
          <strong>Sem editor de vídeo embutido:</strong> O gravador captura e baixa o vídeo bruto.
          Se você precisar cortar o início e o fim, recortar trechos, adicionar destaques, dar zoom ou sobrepor texto,
          precisará de um editor de vídeo separado. Para edições rápidas, o{" "}
          <a href="https://www.veed.io" target="_blank" rel="noopener noreferrer">VEED.io</a> ou
          a versão gratuita do DaVinci Resolve fazem bem o corte básico.
        </li>
        <li>
          <strong>Sem sobreposição de webcam:</strong> Não há feed de webcam em picture-in-picture. Se você precisar
          de uma sobreposição de "rosto falante" no canto da gravação, precisará de software de desktop como OBS
          ou Camtasia.
        </li>
        <li>
          <strong>Restrições de memória para gravações muito longas:</strong> Como a gravação fica
          mantida na memória do navegador até ser baixada, gravações muito longas (mais de 45 minutos) podem consumir
          uma quantidade significativa de RAM. Para gravações de formato longo, um software de desktop que grava diretamente no disco
          enquanto grava é mais apropriado.
        </li>
        <li>
          <strong>Sem compartilhamento automático na nuvem:</strong> O download é um arquivo local. Se o seu fluxo de trabalho
          exige hospedagem na nuvem imediata e um link compartilhável, você precisará enviar o arquivo
          manualmente depois ou usar um serviço como o Loom, que cuida da hospedagem automaticamente.
        </li>
      </ul>

      <h2>Quando você deve usar um software de desktop</h2>
      <p>
        O gravador no navegador é a ferramenta certa para gravações de curta a média duração em que a simplicidade e a
        privacidade importam. Mas o software de desktop é genuinamente melhor quando:
      </p>
      <ul>
        <li>Você precisa gravar por mais de 30 minutos continuamente</li>
        <li>Você precisa de uma sobreposição de webcam ou composição de várias fontes</li>
        <li>Você precisa editar, adicionar legendas, efeitos de zoom ou anotações</li>
        <li>Você precisa gravar gameplay ou conteúdo de alta taxa de quadros</li>
        <li>Você precisa de upload automático na nuvem e links compartilháveis imediatamente após a gravação</li>
      </ul>
      <p>
        Para esses casos, o OBS Studio (gratuito, código aberto) é a opção mais capaz. Para edição,
        o DaVinci Resolve tem um plano gratuito generoso. Ambos exigem instalação, mas oferecem recursos
        que vão muito além do que qualquer ferramenta baseada no navegador pode igualar.
      </p>

      <h2>Comparação: BrowseryTools vs. opções comuns de gravação de tela</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Recurso</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Loom (Gratuito)</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>OBS Studio</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Camtasia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Custo", "Grátis", "Grátis / US$ 12,50/mês", "Grátis", "~US$ 300 (única vez)"],
              ["Instalação necessária", "Não", "Extensão necessária", "Sim", "Sim"],
              ["Conta necessária", "Não", "Sim", "Não", "Sim"],
              ["Vídeo enviado para a nuvem", "Nunca", "Sempre", "Não", "Não"],
              ["Limite de duração da gravação", "Nenhum*", "5 min (gratuito)", "Nenhum", "Nenhum"],
              ["Editor de vídeo embutido", "Não", "Corte básico", "Não", "Sim (avançado)"],
              ["Sobreposição de webcam", "Não", "Sim", "Sim", "Sim"],
              ["Captura apenas da aba", "Sim", "Sim", "Não", "Não"],
              ["Formato de saída", "WebM", "MP4 (nuvem)", "MP4/MKV", "MP4"],
            ].map(([feature, bt, loom, obs, cam], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{loom}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{obs}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{cam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize: "13px", opacity: 0.7}}>
        * Gravações muito longas (&gt;45 min) podem ser limitadas pela memória disponível do navegador.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Nota de privacidade:</strong> Quando você usa o Loom, cada gravação é enviada para os servidores do Loom
        e armazenada lá por padrão. O conteúdo da sua tela — que pode incluir ferramentas internas, dados sensíveis
        de clientes ou recursos não lançados — fica em um servidor de terceiros. As gravações do BrowseryTools
        nunca são enviadas. O arquivo vai do seu navegador diretamente para o seu disco rígido.
      </div>

      <h2>Comece a gravar agora</h2>
      <p>
        Para a grande maioria das tarefas de gravação de tela — um relatório de bug rápido, um tutorial para a equipe, uma
        demonstração de recurso, um passo a passo de revisão de código — o navegador é tudo de que você precisa. Sem instalação, sem
        assinatura, sem comprometer a privacidade.
      </p>
      <p>
        Abra o <Link href="/tools/screen-recorder">Gravador de Tela do BrowseryTools</Link>, clique em Iniciar,
        capture o que você precisa e baixe. Todo o processo, desde abrir a ferramenta até ter um
        arquivo WebM na sua área de trabalho, leva menos de dois minutos.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎬</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Grave sua tela agora — grátis, sem instalação</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Capture sua tela, janela ou aba do navegador. Baixe como WebM. Nada é enviado para lugar nenhum.
          Sem conta, sem extensão, sem custo.
        </p>
        <Link
          href="/tools/screen-recorder"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(239,68,68)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Abrir Gravador de Tela →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Ferramentas relacionadas:{" "}
        <Link href="/tools/image-compression">Compressão de Imagem</Link> ·{" "}
        <Link href="/tools/bg-removal">Remoção de Fundo</Link> ·{" "}
        <Link href="/tools/image-converter">Conversor de Imagem</Link> ·{" "}
        <Link href="/">Todas as BrowseryTools</Link>
      </p>
    </div>
  );
}
