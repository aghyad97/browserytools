export default function Content() {
  return (
    <div>
      <p>
        Se você já implantou uma aplicação web, configurou um pipeline de CI/CD ou gerenciou um servidor Linux, você
        quase certamente já encontrou uma expressão cron. Cinco asteriscos encarando você a partir de um arquivo de configuração.
        Uma string enigmática como <code>0 2 * * 0</code> enterrada em um workflow do GitHub Actions. Um agendamento do AWS EventBridge
        que ninguém na equipe entende mais por completo. As expressões cron estão em toda parte — e elas são genuinamente
        confusas se você não tirou um tempo para aprender o sistema por trás delas.
      </p>
      <p>
        Este guia é a referência que você deveria adicionar aos favoritos. Ele cobre tudo, desde a história do cron e onde ele
        aparece na infraestrutura moderna, até cada caractere especial, 10 exemplos reais comentados, erros
        comuns e uma tabela de referência completa. Ao final, você será capaz de ler qualquer expressão cron rapidamente
        e escrever novas com confiança.
      </p>

      <h2>O que é o cron?</h2>
      <p>
        O cron é um agendador de tarefas baseado em Unix que executa comandos ou scripts automaticamente em horários e
        intervalos especificados. O nome vem de <strong>Chronos</strong>, a personificação grega do tempo — uma escolha apropriada
        para uma ferramenta cujo propósito inteiro é a automação baseada em tempo. O cron original foi introduzido no{" "}
        <strong>Unix Versão 7 em 1979</strong>, escrito por Ken Thompson na Bell Labs, e tem sido um pilar dos
        sistemas operacionais do tipo Unix desde então.
      </p>
      <p>
        O agendador funciona lendo arquivos de configuração chamados <strong>crontabs</strong> (tabelas de cron) — arquivos de
        texto simples em que cada linha define uma tarefa agendada. Um processo daemon em segundo plano (<code>crond</code>) acorda
        a cada minuto, verifica todos os crontabs ativos e executa quaisquer tarefas cujo agendamento corresponda ao horário atual.
        É um design lindamente simples que permaneceu fundamentalmente inalterado por mais de quatro décadas.
      </p>

      <h2>Onde você encontra o cron hoje</h2>
      <p>
        O cron não é apenas uma relíquia do passado Unix. A sintaxe de expressão cron é o padrão de fato para
        expressar agendamentos recorrentes em toda a stack de software moderna:
      </p>
      <ul>
        <li><strong>crontab do Linux e do macOS:</strong> O caso de uso original. Execute <code>crontab -e</code> em qualquer
        máquina Linux ou macOS para editar seu agendamento cron pessoal.</li>
        <li><strong>GitHub Actions:</strong> Os arquivos de workflow usam a sintaxe cron sob o gatilho <code>schedule:</code>
        para executar pipelines de CI/CD de forma recorrente.</li>
        <li><strong>AWS EventBridge (antigo CloudWatch Events):</strong> Aciona funções Lambda, tarefas ECS e
        outros serviços da AWS em um agendamento usando uma variante cron de 6 campos.</li>
        <li><strong>CronJobs do Kubernetes:</strong> O recurso <code>CronJob</code> executa cargas de trabalho em lote dentro de um
        cluster em um agendamento cron.</li>
        <li><strong>Pipelines de CI/CD:</strong> GitLab CI, CircleCI, Jenkins e Bitbucket Pipelines, todos suportam
        execuções agendadas usando expressões cron.</li>
        <li><strong>Vercel e Netlify:</strong> Ambas as plataformas suportam funções serverless acionadas por cron para
        tarefas como invalidação de cache, busca de dados e builds noturnos.</li>
        <li><strong>Manutenção de banco de dados:</strong> A extensão <code>pg_cron</code> do PostgreSQL, o Event Scheduler do MySQL
        e os serviços de banco de dados gerenciados usam a sintaxe cron para tarefas de vacuum, indexação e backup.</li>
        <li><strong>Agendadores em nível de aplicação:</strong> Bibliotecas como node-cron, APScheduler (Python), Quartz
        (Java) e Sidekiq (Ruby), todas usam expressões cron para definir tarefas recorrentes em segundo plano.</li>
      </ul>
      <p>
        Em resumo: se você trabalha em qualquer área de desenvolvimento de software ou administração de sistemas, as expressões cron são
        algo que você encontrará regularmente. Aprendê-las uma vez gera dividendos em toda parte.
      </p>

      <h2>A estrutura de cinco campos</h2>
      <p>
        Uma expressão cron padrão consiste em exatamente cinco campos separados por espaços, cada um representando uma unidade
        de tempo. Juntos, eles definem quando uma tarefa deve ser executada. Aqui está a representação visual canônica:
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "20px 24px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7", margin: "24px 0"}}>{`┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12)
│ │ │ │ ┌───── day of week (0–7)
│ │ │ │ │
* * * * *`}</pre>
      <p>
        Lendo da esquerda para a direita: minuto, hora, dia do mês, mês, dia da semana. Um asterisco (<code>*</code>) em qualquer
        campo significa "todo valor possível para este campo". Então <code>* * * * *</code> significa "a cada minuto de cada
        hora de cada dia" — o agendamento mais permissivo possível.
      </p>

      <h3>Campo 1: Minuto (0–59)</h3>
      <p>
        O campo de minuto controla em qual(is) minuto(s) dentro de uma hora uma tarefa dispara. Um valor de <code>0</code> significa
        na virada da hora, <code>30</code> significa na meia hora e <code>*</code> significa a cada minuto. Este é o
        campo mais granular do cron padrão — a menor unidade de agendamento é um minuto.
      </p>

      <h3>Campo 2: Hora (0–23)</h3>
      <p>
        O campo de hora usa o formato de 24 horas. <code>0</code> é meia-noite, <code>9</code> é 9h, <code>17</code> é
        17h e <code>23</code> é 23h. Não há AM/PM — tudo está no formato de 24 horas. Lembre-se de que o cron
        sempre roda no fuso horário do servidor, a menos que configurado explicitamente de outra forma.
      </p>

      <h3>Campo 3: Dia do mês (1–31)</h3>
      <p>
        Controla em qual(is) dia(s) do mês uma tarefa é executada. <code>1</code> é o dia primeiro, <code>15</code> é o
        dia quinze, <code>31</code> é o dia trinta e um. Cuidado com valores como <code>31</code> — em meses
        com menos dias (fevereiro, abril, junho, etc.), uma tarefa agendada para o dia 31 simplesmente não será executada naquele mês.
        Algumas implementações suportam o caractere especial <code>L</code> para significar "último dia do mês"
        independentemente de quantos dias o mês tenha.
      </p>

      <h3>Campo 4: Mês (1–12)</h3>
      <p>
        O campo de mês usa valores numéricos (1 para janeiro até 12 para dezembro) ou abreviações de três letras
        (<code>JAN</code>, <code>FEB</code>, <code>MAR</code>, <code>APR</code>, <code>MAY</code>, <code>JUN</code>,
        <code>JUL</code>, <code>AUG</code>, <code>SEP</code>, <code>OCT</code>, <code>NOV</code>, <code>DEC</code>)
        na maioria das implementações. Um asterisco significa "todo mês".
      </p>

      <h3>Campo 5: Dia da semana (0–7)</h3>
      <p>
        Este campo especifica em qual(is) dia(s) da semana a tarefa deve ser executada. A numeração aqui é uma fonte comum de
        confusão: <strong>tanto 0 quanto 7 representam domingo</strong> na maioria das implementações de cron (uma peculiaridade herdada do
        design Unix original). Segunda-feira é 1, terça-feira é 2 e sábado é 6. As abreviações de três letras
        (<code>SUN</code>, <code>MON</code>, <code>TUE</code>, <code>WED</code>, <code>THU</code>, <code>FRI</code>,
        <code>SAT</code>) são suportadas na maioria das ferramentas de cron modernas.
      </p>
      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Importante:</strong> Quando tanto o dia do mês quanto o dia da semana são especificados (não <code>*</code>),
        a maioria das implementações de cron os trata como uma condição OU — a tarefa é executada se qualquer uma das condições corresponder. Esse
        é um comportamento sutil, porém crítico, que pega muitos desenvolvedores de surpresa.
      </div>

      <h2>Caracteres especiais</h2>
      <p>
        O verdadeiro poder das expressões cron vem de seis caracteres especiais que permitem expressar agendamentos complexos
        de forma concisa. Entendê-los é a chave para a fluência.
      </p>

      <h3>* — Curinga (todo valor)</h3>
      <p>
        Um asterisco significa "corresponder a todo valor possível neste campo". No campo de minuto, <code>*</code> significa
        a cada minuto (0 a 59). No campo de mês, significa todo mês. É o valor padrão de "não me importo
        com este campo".
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`* * * * *    # Runs every single minute, all day, every day`}</pre>

      <h3>, — Lista (múltiplos valores)</h3>
      <p>
        Uma vírgula separa uma lista de valores específicos. O campo corresponde se o horário atual coincidir com qualquer valor da
        lista. É assim que você agenda uma tarefa para ser executada em vários horários discretos sem usar um intervalo.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9,13,17 * * *    # Runs at 9:00 AM, 1:00 PM, and 5:00 PM every day
0 0 1,15 * *       # Runs at midnight on the 1st and 15th of every month`}</pre>

      <h3>- — Intervalo (de até)</h3>
      <p>
        Um hífen define um intervalo inclusivo de valores. O campo corresponde a todo valor entre o início e o fim,
        inclusive. É ideal para expressar coisas como "durante o horário comercial" ou "nos dias úteis".
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9-17 * * *      # Runs at the top of every hour from 9 AM through 5 PM
0 0 * * 1-5       # Runs at midnight every Monday through Friday`}</pre>

      <h3>/ — Passo (a cada N unidades)</h3>
      <p>
        Uma barra define um valor de passo. <code>*/5</code> significa "a cada 5 unidades a partir do mínimo".
        Você também pode combiná-lo com um intervalo: <code>0-30/10</code> significa "a cada 10 unidades entre 0 e 30"
        (ou seja, 0, 10, 20, 30). Os passos são um dos caracteres especiais mais usados.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 * * * *       # Every 5 minutes (0, 5, 10, 15, ... 55)
*/15 * * * *      # Every 15 minutes (0, 15, 30, 45)
0 */6 * * *       # Every 6 hours (0:00, 6:00, 12:00, 18:00)
0/15 * * * *      # Same as */15 — starts from 0, every 15 minutes`}</pre>

      <h3>L — Último (apenas algumas implementações)</h3>
      <p>
        O caractere <code>L</code> é suportado em algumas implementações de cron (notavelmente o Quartz Scheduler em Java
        e algumas variantes de cron do Linux) para significar "último". No campo de dia do mês, <code>L</code> significa o último
        dia do mês atual — seja ele o dia 28, 29, 30 ou 31. Ele resolve o problema de
        agendar tarefas de "fim de mês" sem saber a duração do mês de antemão.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 L * *         # Midnight on the last day of every month (Quartz/some crons)`}</pre>

      <h3>? — Nenhum valor específico (cron do Quartz/Java)</h3>
      <p>
        O ponto de interrogação é usado no Quartz Scheduler (Java) e em algumas outras ferramentas quando você quer especificar um
        dia da semana sem também especificar um dia do mês, ou vice-versa. Como não faz sentido lógico
        especificar ambos (digamos "o dia 15 E uma quarta-feira"), um deles deve ser definido como <code>?</code> para indicar
        "não me importo". O cron Unix padrão não usa esse caractere — você usa <code>*</code> em vez disso.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 15 * ?        # Quartz: 9 AM on the 15th, day-of-week unspecified
0 9 ? * MON       # Quartz: 9 AM every Monday, day-of-month unspecified`}</pre>

      <h2>10 exemplos reais de cron</h2>
      <p>
        A melhor forma de consolidar seu entendimento é estudar exemplos reais com o contexto de por que cada agendamento
        foi escolhido. Aqui estão dez padrões que você encontrará (e usará) regularmente.
      </p>

      <h3>1. Todo dia útil às 9h</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 * * 1-5`}</pre>
      <p>
        O minuto é <code>0</code> (virada da hora), a hora é <code>9</code> (9h), o dia do mês e o mês
        são curingas, e o dia da semana é <code>1-5</code> (de segunda a sexta-feira). Usado para lembretes de daily standup,
        e-mails de relatório enviados no início do dia comercial e tarefas de sincronização matinal de dados que não devem
        rodar no fim de semana.
      </p>

      <h3>2. A cada 15 minutos</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/15 * * * *`}</pre>
      <p>
        A sintaxe de passo <code>*/15</code> no campo de minuto dá a você execuções nos minutos 0, 15, 30 e 45 após
        cada hora, o dia inteiro. Comum para pings de health check, aquecimento de cache, novas tentativas de webhook e qualquer
        tarefa de polling quase em tempo real em que você precisa de atualização, mas o tempo real de fato é exagerado ou não está disponível.
      </p>

      <h3>3. Todo dia à meia-noite</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 * * *`}</pre>
      <p>
        Minuto 0, hora 0, todo o resto curinga. Este é um dos padrões de cron mais comuns que existem.
        Usado para geração de relatórios diários, rotação de logs, arquivamento de banco de dados, limpeza de arquivos temporários, envio de
        e-mails de resumo diário e qualquer tarefa "uma vez por dia" que deva rodar fora do horário comercial.
      </p>

      <h3>4. Primeiro dia de cada mês à meia-noite</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 * *`}</pre>
      <p>
        O dia do mês é <code>1</code>, todo o resto é curinga (exceto o minuto/hora fixos). Isso roda no
        dia 1º de janeiro, 1º de fevereiro, 1º de março, e assim por diante. O agendamento padrão para geração de faturas mensais,
        gatilhos de ciclo de cobrança, renovações de assinaturas SaaS e consolidações mensais de análise de dados.
      </p>

      <h3>5. Todo domingo às 2h</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 2 * * 0`}</pre>
      <p>
        O dia da semana <code>0</code> é domingo, e a hora <code>2</code> é 2h — um horário em que o tráfego costuma estar
        no nível mais baixo. Usado para backups completos semanais do banco de dados, regeneração de sitemap, reindexação de conteúdo para busca
        e tarefas pesadas de processamento em lote que impactariam o desempenho durante a semana.
      </p>

      <h3>6. Dias úteis às 8h30, 12h30 e 17h30</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`30 8,12,17 * * 1-5`}</pre>
      <p>
        Isso combina uma lista no campo de hora com um intervalo no campo de dia da semana. O minuto <code>30</code>
        significa que dispara na marca da meia hora. Usado para lotes de notificações agendadas (notificações push, resumos
        por e-mail), tarefas de sincronização de dados três vezes ao dia e qualquer fluxo de trabalho em que você queira pontos de contato regulares
        ao longo do dia comercial sem martelar a cada hora.
      </p>

      <h3>7. 1º de janeiro à meia-noite</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 1 *`}</pre>
      <p>
        O dia do mês <code>1</code> e o mês <code>1</code> (janeiro) juntos fixam isto no Dia de Ano Novo.
        Usado para tarefas anuais como renovações de assinaturas anuais, arquivamento dos dados do ano anterior, geração de
        relatórios anuais de conformidade e redefinição de cotas ou contadores anuais em aplicações.
      </p>

      <h3>8. A cada 5 minutos durante o horário comercial nos dias úteis</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 9-17 * * 1-5`}</pre>
      <p>
        Uma expressão composta combinando um passo (<code>*/5</code>), um intervalo nas horas (<code>9-17</code>) e um
        intervalo no dia da semana (<code>1-5</code>). Isso dá a você monitoramento ou polling agressivo — a cada 5 minutos
        das 9h às 17h, de segunda a sexta-feira — ficando em silêncio durante a noite e nos fins de semana para economizar recursos
        e evitar fadiga de alertas.
      </p>

      <h3>9. A cada 6 horas</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 */6 * * *`}</pre>
      <p>
        O passo no campo de hora (<code>*/6</code>) dá quatro execuções uniformemente espaçadas por dia: meia-noite, 6h,
        meio-dia e 18h. Usado para sincronização de dados entre sistemas, atualização de tokens de API de longa duração ou
        credenciais OAuth antes que expirem, e invalidação periódica de cache para conteúdo que muda algumas
        vezes ao dia, mas não precisa de atualização em nível de minuto.
      </p>

      <h3>10. Dia 15 e último dia de cada mês</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 15,L * *`}</pre>
      <p>
        Uma lista com vírgula no campo de dia do mês combinando uma data fixa (<code>15</code>) e a forma abreviada
        do último dia (<code>L</code>). Este é o clássico agendamento de folha de pagamento quinzenal — períodos de pagamento que terminam
        no dia 15 e no último dia do mês. Observe que <code>L</code> exige uma implementação que
        o suporte (Quartz, alguns crons do Linux); o crontab padrão não suporta <code>L</code>.
      </p>

      <h2>Erros comuns e armadilhas</h2>
      <p>
        As expressões cron têm várias armadilhas bem conhecidas que causam incidentes em produção. Entendê-las
        de antemão vai poupar você de uma dolorosa sessão de depuração às 2 da manhã.
      </p>

      <h3>A numeração do dia da semana não é universal</h3>
      <p>
        A maioria das implementações de cron Unix trata tanto <code>0</code> quanto <code>7</code> como domingo. Mas algumas ferramentas
        (incluindo certas bibliotecas em nível de aplicação) começam a semana na segunda-feira, fazendo <code>1</code> = segunda-feira
        e <code>7</code> = domingo. Sempre verifique a convenção de numeração da ferramenta específica que você está usando
        e prefira usar abreviações de três letras (<code>MON</code>, <code>TUE</code>, etc.) quando a
        implementação as suportar, para eliminar a ambiguidade.
      </p>

      <h3>O cron roda no fuso horário do servidor</h3>
      <p>
        Esta é provavelmente a fonte mais comum de bugs de cron em produção. <code>0 9 * * *</code> significa 9h
        no <em>fuso horário da máquina que executa a tarefa</em> — que pode ser UTC, US/Eastern ou qualquer outro.
        Sempre documente a suposição de fuso horário em um comentário ao lado da expressão cron. Para agendadores baseados na nuvem,
        configure explicitamente o fuso horário se a plataforma o suportar.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# Good practice: always document the timezone
# Runs at 9 AM US/Eastern (UTC-5 or UTC-4 during DST)
0 14 * * 1-5   # 9 AM ET expressed in UTC`}</pre>

      <h3>O cron do GitHub Actions sempre roda em UTC</h3>
      <p>
        O GitHub Actions usa a sintaxe cron padrão de 5 campos sob a chave <code>on: schedule:</code>, mas o
        agendador sempre opera em UTC — não há opção de configuração de fuso horário. Se você quer que uma tarefa rode
        às 9h no horário do leste, precisa agendá-la para <code>0 14 * * *</code> (UTC). Observe também que os workflows
        agendados do GitHub Actions podem rodar com até 15 minutos de atraso em períodos de alta demanda.
      </p>

      <h3>A sintaxe de passo se aplica ao seu campo, não a minutos</h3>
      <p>
        Uma leitura equivocada comum: <code>*/5</code> no campo de <em>hora</em> significa a cada 5 horas — não a cada 5
        minutos. O passo sempre se aplica à unidade do campo em que está. <code>*/5</code> no campo de minuto
        é a cada 5 minutos; no campo de hora, a cada 5 horas; no campo de mês, a cada 5 meses.
      </p>

      <h3>Tarefas que rodam por mais tempo que seu intervalo podem se sobrepor</h3>
      <p>
        O cron é um agendador do tipo dispare e esqueça. Se você agendar uma tarefa a cada 5 minutos e uma instância da tarefa levar
        7 minutos para concluir, uma segunda instância começará enquanto a primeira ainda estiver rodando. Isso pode causar
        condições de corrida, processamento duplicado e corrupção de dados. Use um lock de arquivo ou um advisory lock no
        seu banco de dados para evitar a execução simultânea da mesma tarefa.
      </p>

      <h3>Campos ausentes vs. curingas nem sempre são equivalentes</h3>
      <p>
        Em algumas implementações estendidas de cron (particularmente o Quartz), omitir um campo e usar <code>*</code>
        são tratados de forma diferente. Sempre use todos os campos obrigatórios explicitamente e nunca confie em padrões para
        agendamentos críticos de produção.
      </p>

      <h2>Extensões não padronizadas: cron de 6 campos</h2>
      <p>
        O cron Unix padrão tem cinco campos, com o minuto como a granularidade mais fina. Vários sistemas estendem
        isso com campos adicionais:
      </p>

      <h3>Campo de segundos (antes dos demais)</h3>
      <p>
        Muitos agendadores em nível de aplicação (node-cron, Quartz, Spring Scheduler) adicionam um <strong>campo de segundos
        no início</strong>, dando a você 6 campos. Isso permite agendamento abaixo do minuto, até o segundo.
        Os campos são: <code>second minute hour day-of-month month day-of-week</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# 6-field cron with seconds prepended (Quartz / node-cron)
0 */5 * * * *    # Every 5 minutes (second=0, minute=*/5, ...)
30 0 9 * * 1-5   # Weekdays at 9:00:30 AM`}</pre>

      <h3>AWS EventBridge (6 campos com ano)</h3>
      <p>
        O AWS EventBridge usa um formato de 6 campos em que um <strong>campo de ano é acrescentado ao final</strong>:
        <code>minute hour day-of-month month day-of-week year</code>. Ele também exige o uso de <code>?</code>
        para o dia do mês ou o dia da semana (nunca ambos como curingas ao mesmo tempo). O AWS EventBridge
        não suporta a sintaxe de passo <code>*/</code> da mesma forma que o cron Unix.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# AWS EventBridge cron format (6 fields, year at end)
cron(0 9 ? * MON-FRI *)    # Weekdays at 9 AM UTC, any year
cron(0 0 1 * ? *)           # First day of every month at midnight`}</pre>
      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Dica rápida:</strong> Ao copiar uma expressão cron entre plataformas, sempre verifique a contagem de
        campos e quaisquer diferenças de sintaxe específicas da plataforma. Uma expressão cron Unix válida pode ser inválida (ou
        significar algo diferente) no AWS EventBridge, no Quartz ou em um contexto node-cron.
      </div>

      <h2>Como usar o Parser de Cron do BrowseryTools</h2>
      <p>
        Escrever uma expressão cron do zero é uma habilidade — validar que você a escreveu corretamente é outra.
        O <a href="/tools/cron-parser">Parser de Cron do BrowseryTools</a> torna trivial verificar qualquer expressão
        antes que ela chegue perto da produção.
      </p>
      <p>Cole qualquer expressão cron de 5 campos (ou de 6 campos) na ferramenta e obtenha instantaneamente:</p>
      <ul>
        <li>Uma <strong>descrição legível por humanos</strong> do agendamento ("Todo dia útil às 9h"), para que você possa
        verificar rapidamente se sua intenção corresponde à sua expressão.</li>
        <li>Os <strong>próximos 5 a 10 horários de execução agendados</strong> listados explicitamente, para que você veja exatamente quando
        a tarefa vai disparar e confirme que não há surpresas.</li>
        <li>Feedback instantâneo sobre <strong>sintaxe inválida</strong> — útil se você tem um erro de digitação ou está trabalhando com
        uma expressão que outra pessoa escreveu.</li>
      </ul>
      <p>
        Tudo roda inteiramente no seu navegador — nenhuma expressão é enviada a qualquer servidor. É a forma mais rápida de
        conferir a sanidade de um agendamento antes de implantar no GitHub Actions, no Kubernetes ou em qualquer outra plataforma.
      </p>

      <h2>Tabela de referência de expressões cron</h2>
      <p>
        Use esta tabela como referência rápida. Adicione esta página aos favoritos e volte a ela sempre que precisar consultar
        um padrão ou verificar o que uma expressão significa.
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap"}}>Expressão</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Significado legível por humanos</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Caso de uso típico</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>* * * * *</code></td>
              <td style={{padding: "12px 16px"}}>A cada minuto</td>
              <td style={{padding: "12px 16px"}}>Polling de alta frequência, testes</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>A cada 5 minutos</td>
              <td style={{padding: "12px 16px"}}>Health checks, aquecimento de cache</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/15 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>A cada 15 minutos</td>
              <td style={{padding: "12px 16px"}}>Sincronização de dados, novas tentativas de webhook</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>A cada hora, na virada da hora</td>
              <td style={{padding: "12px 16px"}}>Agregações horárias, chamadas de API</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 */6 * * *</code></td>
              <td style={{padding: "12px 16px"}}>A cada 6 horas</td>
              <td style={{padding: "12px 16px"}}>Atualização de token, sincronização de dados</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Todo dia à meia-noite</td>
              <td style={{padding: "12px 16px"}}>Relatórios diários, rotação de logs</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 9 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Dias úteis às 9h</td>
              <td style={{padding: "12px 16px"}}>Tarefas em horário comercial, lembretes</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 2 * * 0</code></td>
              <td style={{padding: "12px 16px"}}>Todo domingo às 2h</td>
              <td style={{padding: "12px 16px"}}>Backups semanais, manutenção</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 * *</code></td>
              <td style={{padding: "12px 16px"}}>Dia 1º de cada mês à meia-noite</td>
              <td style={{padding: "12px 16px"}}>Faturas mensais, cobrança</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1,15 * *</code></td>
              <td style={{padding: "12px 16px"}}>Dias 1º e 15 de cada mês</td>
              <td style={{padding: "12px 16px"}}>Folha de pagamento quinzenal</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 1 *</code></td>
              <td style={{padding: "12px 16px"}}>1º de janeiro à meia-noite</td>
              <td style={{padding: "12px 16px"}}>Tarefas anuais, reset anual</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>30 8,12,17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Dias úteis às 8h30, 12h30 e 17h30</td>
              <td style={{padding: "12px 16px"}}>Lotes de notificações</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 9-17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>A cada 5 min durante o horário comercial (dias úteis)</td>
              <td style={{padding: "12px 16px"}}>Monitoramento ativo, polling</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Valide suas expressões cron antes de implantar</h2>
      <p>
        As expressões cron são compactas e poderosas, mas sua concisão significa que um único erro de digitação pode silenciosamente produzir
        um agendamento completamente diferente. Uma tarefa que você pretendia rodar mensalmente pode rodar diariamente. Um backup que você queria
        acionar todo domingo pode nunca rodar. O custo de um agendamento errado em produção pode variar
        de um relatório perdido a uma tarefa de cobrança que dispara centenas de vezes.
      </p>
      <p>
        O hábito de dois minutos de colar sua expressão em um validador e revisar os próximos horários de execução
        agendados antes de implantar é uma das práticas de maior valor em DevOps e engenharia de backend. Ele
        captura erros antes que eles se tornem incidentes.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Valide qualquer expressão cron instantaneamente — grátis, privado, no navegador
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Cole sua expressão, obtenha uma descrição legível por humanos e veja os próximos horários de execução agendados.
          Nada sai do seu navegador.
        </p>
        <a
          href="/tools/cron-parser"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Abrir o Parser de Cron →
        </a>
      </div>
    </div>
  );
}
