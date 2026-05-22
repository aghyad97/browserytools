export default function Content() {
  return (
    <div>
      <p>
        O texto é a matéria-prima de quase tudo o que se cria em um computador — código, conteúdo, documentação,
        e-mail, especificações de design, textos de marketing, redação técnica e tudo o que está entre essas coisas. Ainda assim, a maioria das pessoas
        improvisa seu fluxo de trabalho com texto a partir de uma mistura de editores de desktop pesados, aplicativos web lentos e
        processos manuais que poderiam ser facilmente automatizados. O BrowseryTools oferece um conjunto completo de ferramentas de texto
        gratuitas e baseadas no navegador, cobrindo todas as tarefas comuns de texto que escritores, desenvolvedores e criadores
        de conteúdo enfrentam diariamente.
      </p>
      <p>
        Nenhuma dessas ferramentas exige conta. Nenhuma exibe anúncios. Todas processam o texto localmente no seu
        navegador — nada do que você digita é enviado para um servidor. Este guia percorre cada ferramenta, o que ela faz
        e exatamente quando recorrer a ela.
      </p>

      <h2>Conversor de Caixa de Texto — Pare de reformatar manualmente</h2>
      <p>
        A formatação de caixa (maiúsculas e minúsculas) é uma daquelas pequenas tarefas que aparecem constantemente em contextos de
        desenvolvimento e escrita, mas não tem um atalho de teclado satisfatório na maioria dos editores. O{" "}
        <a href="/tools/text-case">Conversor de Caixa de Texto do BrowseryTools</a> lida com todas as transformações de caixa
        comuns em um só lugar:
      </p>
      <ul>
        <li><strong>camelCase</strong> — para variáveis e propriedades de objetos em JavaScript: <code>myVariableName</code></li>
        <li><strong>PascalCase</strong> — para nomes de classes e componentes React: <code>MyComponentName</code></li>
        <li><strong>snake_case</strong> — para variáveis em Python e nomes de colunas de banco de dados: <code>my_variable_name</code></li>
        <li><strong>SCREAMING_SNAKE_CASE</strong> — para constantes e variáveis de ambiente: <code>MY_ENV_VARIABLE</code></li>
        <li><strong>kebab-case</strong> — para slugs de URL e nomes de classes CSS: <code>my-class-name</code></li>
        <li><strong>Title Case</strong> — para títulos, cabeçalhos e nomes próprios: <code>My Article Title</code></li>
        <li><strong>UPPERCASE</strong> e <strong>lowercase</strong> — para todos os casos óbvios</li>
        <li><strong>Sentence case</strong> — coloca em maiúscula apenas a primeira letra de cada frase</li>
      </ul>
      <p>
        Cole qualquer texto, selecione a caixa de destino e copie o resultado. Isso elimina as operações manuais de
        localizar e substituir que os desenvolvedores usam para renomear variáveis entre formatos e a cuidadosa edição manual que os
        escritores fazem ao reformatar títulos ou cabeçalhos.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Caso de uso para desenvolvedores:</strong> Você recebe um esquema de banco de dados com colunas em snake_case, mas
        sua base de código JavaScript usa camelCase. Cole todos os nomes das colunas no Conversor de Caixa de Texto,
        mude para camelCase e copie a lista convertida. O que levaria vários minutos de edição manual
        leva segundos.
      </div>

      <h2>Editor Markdown — Escreva e pré-visualize simultaneamente</h2>
      <p>
        O Markdown se tornou a língua franca da documentação técnica, arquivos README, posts de blog, anotações
        e qualquer lugar em que o texto precise de formatação leve sem o peso de um processador de texto completo.
        O <a href="/tools/markdown-editor">Editor Markdown do BrowseryTools</a> oferece uma interface
        de painel dividido: escreva Markdown bruto à esquerda e veja a pré-visualização do HTML formatado à direita, em tempo real.
      </p>
      <p>
        Isso é inestimável ao redigir conteúdo para plataformas que aceitam Markdown — GitHub, GitLab, Notion,
        Obsidian, Ghost, Dev.to e muitas outras. É também a forma mais rápida de verificar se a hierarquia de
        cabeçalhos está correta, se seus links resolvem visualmente e se seus blocos de código são renderizados com a
        sintaxe certa antes de você fazer commit ou publicar.
      </p>
      <h3>Para quem é esta ferramenta</h3>
      <ul>
        <li>Desenvolvedores que escrevem arquivos README e documentação</li>
        <li>Redatores técnicos que produzem conteúdo para plataformas de CMS baseadas em Markdown</li>
        <li>Estudantes e pesquisadores que fazem anotações estruturadas</li>
        <li>Qualquer pessoa que precise formatar texto para Issues do GitHub, descrições de pull requests ou páginas de wiki</li>
      </ul>

      <h2>Gerador de Lorem Ipsum — Preencha espaço com texto provisório profissional</h2>
      <p>
        Todo designer e desenvolvedor que trabalha em um layout antes de o texto final estar pronto precisa de texto
        provisório. O padrão tem sido o Lorem Ipsum desde os anos 1500, e por um bom motivo — ele tem o ritmo
        visual de um texto real em latim sem nenhum significado de fato, o que evita que os leitores se distraiam
        com o conteúdo em vez de avaliar o layout.
      </p>
      <p>
        O <a href="/tools/lorem-ipsum">Gerador de Lorem Ipsum do BrowseryTools</a> permite especificar exatamente
        quanto texto provisório você precisa — por parágrafos, frases ou palavras — e gera o texto
        instantaneamente. Copie-o diretamente para sua ferramenta de design, mockup ou modelo de desenvolvimento.
      </p>
      <p>
        Esta é uma daquelas ferramentas que levam trinta segundos para serem usadas, mas evitam a experiência constrangedora de
        digitar "texto provisório texto provisório" repetidamente ou copiar de um artigo da Wikipédia só
        para preencher um bloco de conteúdo.
      </p>

      <h2>Contador de Texto — Saiba a contagem de caracteres, palavras e parágrafos</h2>
      <p>
        Contextos diferentes impõem restrições diferentes de tamanho de texto. Plataformas de redes sociais têm limites de
        caracteres. As melhores práticas de SEO especificam tamanhos ideais de meta descrição (cerca de 155 caracteres) e
        de tags de título (menos de 60 caracteres). Submissões acadêmicas exigem contagem de palavras. O SMS tem um limite de 160
        caracteres. Capítulos de livros são avaliados por estimativas de palavras e páginas.
      </p>
      <p>
        O <a href="/tools/text-counter">Contador de Texto do BrowseryTools</a> oferece contagens em tempo real em
        todas as dimensões simultaneamente: caracteres (com e sem espaços), palavras, frases e
        parágrafos. Cole seu texto e todas as contagens são atualizadas instantaneamente — sem envio, sem recarregar, sem espera.
      </p>
      <p>
        Escritores podem usá-lo para verificar o tamanho dos artigos. Desenvolvedores podem confirmar que um campo de banco de dados não
        vai ultrapassar seu limite de caracteres. Criadores de conteúdo podem confirmar que suas meta descrições não serão
        truncadas nos resultados de busca.
      </p>

      <h2>Visualizador de Diferenças de Texto — Veja exatamente o que mudou entre duas versões</h2>
      <p>
        Comparar duas versões de um documento, um arquivo de configuração, uma cláusula jurídica ou qualquer bloco de texto
        é uma tarefa que surge constantemente na edição, na revisão de código e na gestão de conteúdo. O{" "}
        <a href="/tools/text-diff">Visualizador de Diferenças de Texto do BrowseryTools</a> recebe duas entradas de texto, compara-as
        linha por linha e destaca adições, exclusões e alterações com uma codificação de cores clara.
      </p>
      <p>
        Esse é o mesmo tipo de visualização de diferenças que você vê em pull requests do Git, mas disponível instantaneamente para quaisquer
        dois blocos de texto — sem necessidade de repositório, sem linha de comando, sem configuração de ferramentas.
      </p>
      <h3>Quando usar o Diff de Texto</h3>
      <ul>
        <li>Comparar uma cláusula contratual revisada com a original para descobrir o que o advogado alterou</li>
        <li>Verificar o que mudou entre duas versões de um arquivo de configuração que você recebeu</li>
        <li>Revisar as edições que um colaborador fez em um documento quando o controle de alterações não estava ativado</li>
        <li>Verificar se um trecho de código foi copiado corretamente de uma fonte de referência</li>
        <li>Comparar a saída de duas respostas de API para encontrar diferenças na estrutura ou nos valores</li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Lembrete de privacidade:</strong> A ferramenta de Diff de Texto, como todas as ferramentas do BrowseryTools, processa
        tudo localmente no seu navegador. Textos jurídicos confidenciais, arquivos de configuração proprietários e
        documentos empresariais sensíveis podem ser comparados sem que nenhum dado saia da sua máquina. Esta é uma
        vantagem significativa sobre as ferramentas de diff baseadas na nuvem, que processam seu texto em seus servidores.
      </div>

      <h2>Formatador de HTML — Torne o HTML legível (ou minúsculo)</h2>
      <p>
        O HTML servido por aplicações web em produção é frequentemente minificado — todo o espaço em branco removido para
        reduzir o tamanho do arquivo. Isso o torna completamente ilegível quando você precisa inspecioná-lo. Por outro lado,
        o HTML escrito à mão ou exportado de uma ferramenta pode ter indentação inconsistente e ser difícil de interpretar.
      </p>
      <p>
        O <a href="/tools/html-formatter">Formatador de HTML do BrowseryTools</a> funciona nas duas direções:
      </p>
      <ul>
        <li><strong>Formatar/Embelezar:</strong> Pega um HTML minificado ou bagunçado e o gera com indentação e quebras de linha consistentes, tornando a estrutura imediatamente legível</li>
        <li><strong>Minificar:</strong> Pega um HTML legível e remove todo o espaço em branco desnecessário, produzindo a menor saída possível para uso em produção</li>
      </ul>
      <p>
        Desenvolvedores front-end usam isso constantemente ao inspecionar HTML de terceiros, depurar modelos de e-mail
        ou limpar HTML gerado por editores WYSIWYG (que muitas vezes produzem uma marcação verbosa e mal
        estruturada).
      </p>

      <h2>Bloco de Notas — O rascunho sempre pronto</h2>
      <p>
        Às vezes você não precisa de um documento formatado nem de uma ferramenta estruturada — você só precisa de algum lugar para
        colocar texto agora mesmo. O <a href="/tools/notepad">Bloco de Notas do BrowseryTools</a> é uma área de texto simples
        que salva automaticamente tudo o que você digita no localStorage. Feche o navegador, reabra-o e seu texto
        continuará lá.
      </p>
      <p>
        Isso é ideal para anotações temporárias durante uma reunião, trechos de código que você está prestes a colar em algum lugar,
        rascunhos de texto nos quais você está iterando ou qualquer texto que precise existir em algum lugar pelas próximas horas
        ou dias. Sem nome de arquivo para escolher, sem caixa de diálogo de salvamento para fechar, sem sincronização na nuvem para esperar. Apenas digite.
      </p>

      <h2>Teste de Digitação — Meça e melhore suas PPM</h2>
      <p>
        A velocidade de digitação importa mais do que a maioria das pessoas reconhece. Um desenvolvedor que digita a 100 PPM em vez de
        60 PPM ganha cerca de 40% mais de produtividade em todo o trabalho intensivo em teclado — não apenas escrevendo código,
        mas também escrevendo documentação, e-mails, mensagens no Slack e mensagens de commit. O mesmo se aplica a
        escritores, analistas, equipe de suporte e qualquer outra pessoa que passe um tempo significativo no teclado.
      </p>
      <p>
        O <a href="/tools/typing-test">Teste de Digitação do BrowseryTools</a> mede suas palavras por minuto
        e sua precisão em relação a um trecho padrão. Ele dá a você um parâmetro honesto de onde você está e,
        se você testar regularmente, uma visão clara de se a prática está melhorando sua velocidade e precisão.
      </p>
      <p>
        A maioria dos adultos digita entre 40 e 60 PPM. Os datilógrafos que praticaram deliberadamente costumam alcançar
        80 a 100 PPM. Transcritores profissionais e digitadores competitivos podem ultrapassar 120 a 140 PPM. Onde quer que
        você esteja nesse espectro, o teste de digitação fornece dados para trabalhar.
      </p>

      <h2>Editor de Texto Rico — Edição WYSIWYG no navegador</h2>
      <p>
        Nem todo mundo se sente confortável com Markdown ou HTML, e nem todo contexto exige formatação
        técnica. O <a href="/tools/rich-editor">Editor de Texto Rico do BrowseryTools</a> oferece uma
        interface familiar no estilo de processador de texto — negrito, itálico, sublinhado, cabeçalhos, listas, links — onde
        você vê o resultado formatado conforme digita, sem precisar conhecer nenhuma sintaxe de marcação.
      </p>
      <p>
        Isso é útil para redigir conteúdo formatado que será colado em um cliente de e-mail, em um campo de texto
        rico de um CMS, em uma ferramenta de apresentação ou em qualquer contexto que aceite texto formatado. É também uma
        forma limpa de formatar texto ao colaborar com membros não técnicos da equipe que não se sentem confortáveis
        com Markdown.
      </p>

      <h2>Por que um único conjunto em vez de nove sites diferentes</h2>
      <p>
        A alternativa comum ao BrowseryTools é pesquisar cada ferramenta individualmente quando você precisa dela —
        "ferramenta de diff de texto online", "gerador de lorem ipsum", "formatador de HTML" — e cair em um site
        diferente a cada vez. Esses sites normalmente exibem anúncios, podem impor limites de contagem de palavras, muitas vezes exigem
        criação de conta para certos recursos e variam muito em qualidade e confiabilidade.
      </p>
      <p>
        Ter todas essas ferramentas em um só lugar significa que você sabe exatamente aonde ir e o que esperar. A
        interface é consistente. Não há anúncios. Não há limites no tamanho do texto. E como
        tudo é processado localmente, não há risco de privacidade independentemente do texto que você cole.
      </p>
      <p>
        Adicione o BrowseryTools aos favoritos, ou fixe algumas abas, e essas ferramentas estarão prontas no momento em que você precisar
        delas — o que, se você escreve código ou conteúdo para viver, provavelmente é várias vezes hoje.
      </p>
    </div>
  );
}
