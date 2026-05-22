export default function Content() {
  return (
    <div>
      <p>
        Todo notebook e celular vem com configurações de suspensão que são — no geral — algo positivo. Elas
        economizam bateria, reduzem o aquecimento e prolongam a vida útil da tela. Mas há momentos em que essas
        mesmas configurações se tornam uma pequena forma de tortura. Você está no meio de um download de duas
        horas, assistindo a um longo vídeo de treinamento, conduzindo uma apresentação, monitorando um painel ou
        lendo um artigo que exige sua atenção, e de repente a tela escurece e o notebook começa a deslizar rumo à
        suspensão.
      </p>
      <p>
        A solução tradicional é desajeitada. No macOS, as pessoas instalam o Amphetamine ou o Caffeine. No Windows,
        ajustam as configurações de energia ou usam um utilitário chamado PowerToys. No Linux, vasculham as flags do
        systemd. Cada uma dessas soluções exige instalar algo, confiar nele e, muitas vezes, pagar por ele ou
        navegar por menus de configurações escritos por e para administradores de sistemas.
      </p>
      <p>
        Existe uma opção muito mais simples que quase ninguém conhece: o seu navegador já consegue fazer isso, em
        qualquer sistema operacional, sem nenhuma instalação. Essa é toda a ideia por trás da ferramenta{" "}
        <a href="/tools/keep-awake">Keep Awake do BrowseryTools</a> — uma única aba que você abre e um único
        botão que você pressiona para impedir que sua tela entre em suspensão, sem aplicativo, sem conta e sem
        configuração.
      </p>

      <h2>Como o Keep Awake funciona — a Screen Wake Lock API</h2>
      <p>
        Os navegadores modernos expõem um padrão web chamado{" "}
        <strong>Screen Wake Lock API</strong>. Quando uma página chama{" "}
        <code>navigator.wakeLock.request("screen")</code>, o navegador pede educadamente ao sistema operacional
        para manter a tela ligada enquanto a aba estiver visível. O sistema atende. Sua tela permanece acesa, sem
        escurecimento por tempo limite, sem suspensão automática, até você liberar o bloqueio ou a aba ser ocultada.
      </p>
      <p>
        Esse é exatamente o mecanismo que o YouTube, a Netflix e o Google Maps usam quando você está assistindo a
        um vídeo ou navegando com instruções passo a passo. É uma primitiva em nível de sistema operacional, bem
        suportada e consciente da bateria. Não é um truque que mexe o mouse ou toca áudio silencioso — é uma
        solicitação formal ao sistema para manter a tela viva. Chrome, Edge, Safari (no iOS 16.4+ e no macOS) e
        Firefox todos a suportam hoje.
      </p>

      <h2>Por que uma ferramenta de navegador vence um aplicativo nativo</h2>
      <p>
        Assim que você vê como o navegador faz isso facilmente, o argumento para instalar um aplicativo dedicado
        desmorona. Veja por que a abordagem do navegador vence em uma tarefa como essa:
      </p>
      <p>
        <strong>Multiplataforma por padrão.</strong> Mac, Windows, Linux, Chromebook, iPad, iPhone, Android —
        a mesma ferramenta, o mesmo comportamento, a mesma URL. Você não precisa de uma versão para Mac, uma para
        Windows e uma para Android. Uma única página web faz tudo.
      </p>
      <p>
        <strong>Nenhuma confiança necessária.</strong> Aplicativos nativos de "manter ativo" precisam de permissão
        para alterar as configurações de energia, e muitos solicitam mais acesso do que realmente precisam. A
        ferramenta de navegador precisa de exatamente uma permissão — a que ela está pedindo — e você pode
        revogá-la fechando a aba.
      </p>
      <p>
        <strong>Sem atrito de instalação.</strong> Abra a URL, clique no botão, pronto. Você pode adicioná-la aos
        favoritos ou fixá-la na barra de abas. Você pode compartilhar o link com um colega que tem o mesmo problema
        e ele pode usá-la em dez segundos.
      </p>
      <p>
        <strong>Respeita a privacidade.</strong> A ferramenta{" "}
        <a href="/tools/keep-awake">Keep Awake do BrowseryTools</a> roda 100% no seu navegador. Não há
        rastreamento de análise do que você faz, nenhuma conta para cadastrar, nenhum servidor que saiba quando você
        a ativou. É uma página estática que conversa diretamente com a Wake Lock API do seu navegador.
      </p>

      <h2>Opções de duração — de 15 minutos ao infinito</h2>
      <p>
        Nem todo cenário precisa do mesmo tempo limite. A ferramenta Keep Awake oferece uma variedade de
        predefinições para que você possa ajustar a duração ao que está realmente fazendo:
      </p>
      <p>
        <strong>15 minutos</strong> — bom para leituras curtas, um download rápido ou uma única ligação de suporte.
        <br />
        <strong>30 minutos</strong> — suficiente para uma sessão focada de trabalho profundo ou um tutorial de
        duração média.
        <br />
        <strong>1 hora</strong> — ideal para a maioria das videochamadas, webinars ou uma sessão de trabalho de
        duração de um filme.
        <br />
        <strong>2 horas</strong> — apresentações longas, sessões de programação em par estendidas ou longas-metragens.
        <br />
        <strong>4 horas e 8 horas</strong> — para downloads noturnos, longas rodadas de treinamento, eventos no
        estilo de conferência ou painéis que você quer acompanhar o dia todo.
        <br />
        <strong>Duração personalizada</strong> — digite o número exato de minutos ou horas que você quer. 45
        minutos, 90 minutos, 3 horas, o que se encaixar na tarefa.
        <br />
        <strong>Infinito</strong> — a opção nuclear. A tela permanece ligada até você pressionar parar. Use isso
        quando você realmente não sabe de quanto tempo precisa, ou quando quer cuidar de um processo longo e decidir
        depois.
      </p>
      <p>
        A contagem regressiva é exibida ao vivo no título da página, então você pode mudar para outra aba e dar uma
        olhada na barra de abas para ver quanto tempo resta. Quando o cronômetro expira, a ferramenta libera o
        bloqueio de tela automaticamente e seu notebook volta ao comportamento normal de suspensão — sem efeitos
        colaterais persistentes.
      </p>

      <h2>Cenários práticos em que você realmente precisa disso</h2>
      <p>
        <strong>Baixando um arquivo grande ou instalando um sistema operacional.</strong> Algumas operações falham
        se a máquina entra em suspensão. Ativar o Keep Awake enquanto um download de 40 GB roda garante que ele
        termine sem interrupção.
      </p>
      <p>
        <strong>Apresentando ou compartilhando a tela.</strong> Nada é mais constrangedor do que seu notebook
        escurecer no meio de um slide durante uma apresentação importante para um cliente. Defina o Keep Awake para
        duas horas antes de começar, e o monitor do apresentador permanece brilhante o tempo todo.
      </p>
      <p>
        <strong>Assistindo a um vídeo ou transmissão ao vivo longa.</strong> Se você está assistindo a uma
        transmissão de conferência, culto, seminário de treinamento ou evento familiar, o Wake Lock mantém a tela
        ligada para que você não precise mexer no mouse a cada poucos minutos.
      </p>
      <p>
        <strong>Monitorando um painel ou processo de build.</strong> Desenvolvedores que acompanham pipelines de
        CI, painéis de incidentes, logs de servidor ou telas de trading precisam que a tela permaneça visível por
        horas. O modo infinito foi feito sob medida para isso.
      </p>
      <p>
        <strong>Lendo um documento longo.</strong> Contratos jurídicos, artigos de pesquisa e documentação técnica
        merecem atenção sem a tela apagando a cada dez minutos. Quarenta e cinco minutos de Keep Awake compram o
        tempo de foco que você precisa.
      </p>
      <p>
        <strong>Rodando uma máquina virtual ou um build longo.</strong> Se você está compilando código, rodando uma
        suíte de testes ou treinando um modelo pequeno, você não quer que o sistema operacional pause o trabalho
        porque o notebook achou que você foi embora.
      </p>

      <h2>Coisas para saber (e uma coisa que ele não consegue fazer)</h2>
      <p>
        A Screen Wake Lock API é um bloqueio de <em>tela</em>. Ela impede que a tela escureça e que o sistema
        operacional acione a suspensão por inatividade. Na maioria dos notebooks, manter a tela ligada também
        impede que a própria máquina entre em suspensão — porque o sistema só suspende quando está ocioso, e uma
        tela ativa conta como atividade.
      </p>
      <p>
        No entanto, se você fisicamente <strong>fechar a tampa</strong>, a maioria dos sistemas operacionais está
        configurada para suspender independentemente do que qualquer aplicativo tenha solicitado. Esse é um
        comportamento em nível de hardware e nenhuma ferramenta de navegador pode anulá-lo. Se você precisa que o
        notebook permaneça ativo com a tampa fechada (por exemplo, rodando um processo longo enquanto conectado à
        tomada), você precisará alterar as configurações de energia do seu sistema operacional separadamente. O
        Keep Awake cuida de todo o resto.
      </p>
      <p>
        A outra sutileza é que o bloqueio de tela é liberado automaticamente quando a aba é ocultada. Essa é uma
        proteção de privacidade e bateria embutida na API. A ferramenta Keep Awake do BrowseryTools fica atenta à
        aba voltar a ficar visível e readquire o bloqueio automaticamente — então, se você trocar de aba ou
        aplicativo e voltar, o keep-awake retoma de forma transparente. A única maneira de interrompê-lo é fechar
        totalmente ou minimizar o navegador inteiro.
      </p>

      <h2>Por que sem downloads, sem anúncios, sem rastreamento</h2>
      <p>
        Toda ferramenta do BrowseryTools segue a mesma filosofia: rodar inteiramente no navegador, nunca enviar
        dados, nunca exigir uma conta, nunca exibir anúncios. O Keep Awake é um exemplo particularmente limpo.
        Literalmente não há nada para enviar a lugar nenhum. A ferramenta pede uma permissão ao seu navegador, o
        navegador pede ao seu sistema operacional, e essa é toda a transação. Não há dados de identificação do
        usuário, nenhum evento de análise, nenhuma telemetria. Você abre a página, clica em um botão e algo útil
        acontece.
      </p>
      <p>
        Compare isso com o ecossistema típico de aplicativos de "prevenção de suspensão": você pesquisa na App
        Store ou na Play Store, encontra dezenas de aplicativos com anúncios intrusivos, solicitações de permissão
        que pedem muito mais do que precisam e paywalls de assinatura para recursos que uma página web de 20 linhas
        pode oferecer de graça.
      </p>

      <h2>Experimente agora</h2>
      <p>
        Abra a <a href="/tools/keep-awake">ferramenta Keep Awake</a>, escolha uma duração — ou escolha Infinito se
        preferir — e pressione o grande botão verde. Seu notebook permanecerá ativo até o cronômetro terminar ou
        até você pressionar parar. Sem instalação, sem conta, sem letras miúdas. Se achar útil, adicione aos
        favoritos ou compartilhe o link com um amigo que tem a mesma frustração.
      </p>
      <p>
        E, já que está por aqui, dê uma olhada ao redor. O BrowseryTools tem dezenas de outros utilitários
        gratuitos e que respeitam a privacidade, rodando inteiramente no seu navegador — de um{" "}
        <a href="/tools/pomodoro">cronômetro Pomodoro</a> a um <a href="/tools/json-formatter">formatador de JSON</a>,
        um <a href="/tools/password-generator">gerador de senhas</a>, um{" "}
        <a href="/tools/world-clock">relógio mundial</a> e muito mais. Tudo é gratuito, tudo é local, e nada pede
        que você se cadastre.
      </p>
    </div>
  );
}
