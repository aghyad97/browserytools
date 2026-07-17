import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Todo desenvolvedor já passou por isso. Você tira uma query lenta dos logs da aplicação,
        copia para o editor e se depara com uma muralha de 300 caracteres em letras minúsculas,
        sem espaços, sem quebras de linha e sem piedade. Ou você encontra uma resposta no Stack
        Overflow com exatamente a query que precisa, mas ela está escrita em uma única linha. Ou
        seu ORM gentilmente registra o SQL que está gerando — como uma única string concatenada.
        Em todos esses casos, a query bruta está tecnicamente correta, mas é praticamente ilegível.
      </p>
      <ToolCTA slug="sql-formatter" variant="inline" />
      <p>
        Formatar SQL não é questão de estética. É sobre conseguir entender o que uma query faz
        de relance — quais tabelas ela lê, quais condições ela filtra e quais colunas ela retorna.
        Uma query bem formatada pode ser revisada, depurada e otimizada em minutos. Uma não
        formatada pode desperdiçar horas.
      </p>
      <p>
        O <a href="/tools/sql-formatter">Formatador de SQL do BrowseryTools</a> permite colar
        qualquer query SQL e formatá-la instantaneamente com indentação adequada, palavras-chave
        em maiúsculas e separação de cláusulas — tudo processado localmente no seu navegador,
        sem que nenhuma query seja enviada a um servidor.
      </p>

      <h2>Por que SQL Não Formatado é Tão Doloroso</h2>
      <p>
        SQL é uma das poucas linguagens em que os desenvolvedores rotineiramente trabalham com código
        que não escreveram e não podem reformatar na fonte. Considere as três fontes mais comuns
        de SQL feio:
      </p>
      <ul>
        <li>
          <strong>Queries geradas por ORM.</strong> Hibernate, SQLAlchemy, ActiveRecord e seus
          similares geram SQL dinamicamente. Quando você ativa o log de queries para depurar um
          problema de desempenho, você obtém o SQL bruto gerado — geralmente uma única linha com
          valores de parâmetros dinâmicos, apelidos como <code>t0_</code> e condições de junção
          que exigem algumas leituras para interpretar.
        </li>
        <li>
          <strong>Logs de queries de bancos de dados em produção.</strong> O slow query log do
          MySQL e o <code>pg_stat_statements</code> do PostgreSQL armazenam queries como foram
          submetidas — sem formatação aplicada. Esses são inestimáveis para análise de desempenho,
          mas quase impossíveis de ler sem reformatar primeiro.
        </li>
        <li>
          <strong>Respostas em uma linha do Stack Overflow e de documentação.</strong> Código
          compartilhado em respostas e documentos muitas vezes é comprimido em uma única linha
          para economizar espaço vertical. A lógica é sólida, mas o layout dificulta a adaptação
          ao seu próprio esquema.
        </li>
      </ul>

      <h2>Antes e Depois: A Mesma Query, Formatada</h2>
      <p>
        Aqui está uma query realista como pode aparecer em um slow query log ou saída de ORM —
        tudo em uma linha com palavras-chave em minúsculas:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        Após a formatação com convenções SQL consistentes, a mesma query torna-se imediatamente
        legível:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id)  AS order_count,
    SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
    ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY
    u.id,
    u.name,
    u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 20;`}
      </pre>
      <p>
        A estrutura agora é imediatamente visível: você pode ver que este é um relatório de usuários
        que puxa contagens de pedidos e totais de gastos, filtrado para usuários ativos a partir de
        2024, agrupado por usuário e limitado aos 20 maiores gastadores. Isso levou cinco segundos
        para entender — em vez de cinco minutos.
      </p>

      <h2>Convenções de Formatação de SQL</h2>
      <p>
        Não existe um guia de estilo SQL oficial único, mas um conjunto de convenções amplamente
        aceitas emergiu no setor. Seguir essas convenções torna seu SQL legível para qualquer
        desenvolvedor que conheça a linguagem.
      </p>

      <h3>Palavras-Chave em Maiúsculas</h3>
      <p>
        Palavras-chave SQL — <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code> — devem estar em maiúsculas. Nomes de tabelas, colunas, apelidos e
        literais de string permanecem em sua capitalização natural. Esse contraste visual entre
        PALAVRAS-CHAVE e identificadores torna as queries digitalizáveis de relance.
      </p>

      <h3>Cada Cláusula Principal em Sua Própria Linha</h3>
      <p>
        Cada cláusula de nível superior começa em uma nova linha:{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. Isso dá à query um
        esqueleto visual claro. Quando você abre uma query formatada, seu olho encontra imediatamente
        cada cláusula porque todas começam na margem esquerda (ou em um nível de indentação
        consistente).
      </p>

      <h3>Listas de Colunas e Condições Indentadas</h3>
      <p>
        Nomes de colunas na lista <code>SELECT</code> e condições em <code>WHERE</code> são
        indentados por quatro espaços (ou uma tabulação). Cada <code>AND</code> e <code>OR</code>{" "}
        em uma cláusula <code>WHERE</code> começa em sua própria linha no mesmo nível de indentação
        que a primeira condição, tornando trivial adicionar, remover ou comentar condições
        individuais:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Posicionamento de Vírgula: Duas Escolas de Pensamento</h3>
      <p>
        O debate sobre posicionamento de vírgula em SQL é similar ao debate sobre vírgula final
        em JavaScript. Existem dois estilos legítimos:
      </p>
      <ul>
        <li>
          <strong>Vírgulas ao final</strong> (vírgula no final de cada linha): o estilo mais
          comum, compatível com como a maioria dos desenvolvedores escreve listas em outras
          linguagens. A desvantagem é que comentar o último item requer também remover sua vírgula
          final do item acima.
        </li>
        <li>
          <strong>Vírgula no início</strong> (vírgula no início de cada linha após a primeira):
          facilita comentar qualquer linha individual sem tocar nas linhas adjacentes. Preferido
          por equipes que frequentemente modificam listas de colunas durante o desenvolvimento.
        </li>
      </ul>
      <p>
        Ambos são válidos. Escolha um e use-o consistentemente dentro de um projeto. O Formatador
        de SQL do BrowseryTools usa vírgulas ao final por padrão, o que se alinha com a maioria
        dos guias de estilo e é a convenção que a maioria dos leitores espera.
      </p>

      <h3>Apelidos Alinhados com AS</h3>
      <p>
        Sempre use <code>AS</code> explícito para apelidos — nunca o estilo de nome nu implícito
        que alguns dialetos permitem (<code>COUNT(o.id) order_count</code>). Quando vários apelidos
        aparecem em uma lista <code>SELECT</code>, alinhar a palavra-chave <code>AS</code> na mesma
        coluna torna a lista de apelidos digitalizável:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>Como Ler uma Query Complexa com Múltiplos JOINs</h2>
      <p>
        Quando você encontra uma query com três, quatro ou cinco JOINs, não comece do topo. Comece
        pela cláusula <code>FROM</code>. Isso diz qual é a tabela primária — a âncora da query.
        Cada <code>JOIN</code> subsequente adiciona outra tabela ao conjunto de resultados, e a
        condição <code>ON</code> diz como as linhas daquela tabela se relacionam com as linhas já
        acumuladas. Somente após entender o modelo de dados de <code>FROM</code> e{" "}
        <code>JOIN</code> você deve voltar a <code>SELECT</code> para ver quais colunas são
        retornadas, depois <code>WHERE</code> para filtragem e depois <code>GROUP BY</code> para
        agregação.
      </p>
      <p>
        Ordem de leitura para qualquer query SELECT:{" "}
        <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        Isso corresponde à ordem em que o mecanismo de banco de dados processa as cláusulas, e
        mapeia como você deve raciocinar sobre os dados fluindo por cada etapa.
      </p>

      <h2>Formatação de Subqueries</h2>
      <p>
        Subqueries — queries aninhadas dentro de outra query — merecem seu próprio nível de
        indentação. Cada nível de aninhamento adiciona um nível de indentação, para que a estrutura
        permaneça clara mesmo com dois ou três níveis de profundidade:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email
FROM users AS u
WHERE u.id IN (
    SELECT DISTINCT o.user_id
    FROM orders AS o
    WHERE o.total > 500
      AND o.created_at >= '2024-01-01'
)
ORDER BY u.name;`}
      </pre>
      <p>
        A query interna é claramente subordinada à externa. O parêntese de fechamento está alinhado
        com a palavra-chave (<code>WHERE</code>) que introduziu a subquery. Para subqueries
        profundamente aninhadas ou complexas, CTEs (Expressões de Tabela Comuns) são quase sempre
        preferíveis porque podem ser nomeadas e colocadas no topo da query onde são fáceis de ler.
      </p>

      <h2>Padrões Comuns de Query e Suas Formas Formatadas</h2>

      <h3>INSERT INTO ... SELECT</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`INSERT INTO order_archive (
    id,
    user_id,
    total,
    created_at
)
SELECT
    id,
    user_id,
    total,
    created_at
FROM orders
WHERE created_at < '2023-01-01';`}
      </pre>

      <h3>UPDATE com JOIN (sintaxe MySQL / SQL Server)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>Query com WITH (CTE)</h3>
      <p>
        Expressões de Tabela Comuns são a ferramenta de formatação mais poderosa em SQL. Elas
        permitem dar nomes a conjuntos de resultados intermediários, transformando uma query
        profundamente aninhada em uma série de etapas claramente nomeadas:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
      AND created_at >= '2024-01-01'
),
user_orders AS (
    SELECT
        user_id,
        COUNT(id)  AS order_count,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
)
SELECT
    au.id,
    au.name,
    au.email,
    uo.order_count,
    uo.total_spent
FROM active_users AS au
LEFT JOIN user_orders AS uo
    ON au.id = uo.user_id
ORDER BY uo.total_spent DESC
LIMIT 20;`}
      </pre>

      <h2>Por que a Formatação Importa para a Revisão de Desempenho</h2>
      <p>
        A formatação não é apenas sobre legibilidade para humanos — ela também torna os problemas
        de desempenho visíveis. Quando uma query está devidamente estruturada, várias classes de
        problemas se tornam fáceis de identificar:
      </p>
      <ul>
        <li>
          <strong>Índices ausentes.</strong> Uma cláusula <code>WHERE</code> formatada com todas as
          condições em suas próprias linhas facilita verificar que cada coluna de condição tem um
          índice. Sem formatação, condições enterradas em uma linha são fáceis de ignorar.
        </li>
        <li>
          <strong>Produtos cartesianos.</strong> Um <code>JOIN</code> sem uma condição <code>ON</code>{" "}
          (ou com uma condição sempre verdadeira) produz um cross join que multiplica contagens de
          linhas. Quando cada <code>JOIN</code> está em sua própria linha com sua condição{" "}
          <code>ON</code> indentada abaixo, uma condição ausente é imediatamente óbvia.
        </li>
        <li>
          <strong>Padrões N+1 em queries.</strong> Ver uma query selecionar uma lista de IDs em
          uma subquery e depois fazer join de volta à mesma tabela é um sinal de que a query
          poderia ser reescrita com um join direto — eliminando o N+1 no nível SQL em vez de no
          código da aplicação.
        </li>
        <li>
          <strong>Funções em colunas indexadas.</strong>{" "}
          <code>WHERE DATE(created_at) = '2024-01-01'</code> impede o banco de dados de usar um
          índice em <code>created_at</code>. Em uma query formatada, esse padrão se destaca; em
          uma linha minificada, é invisível.
        </li>
      </ul>

      <h2>Dialetos SQL: Diferenças de Sintaxe para Conhecer</h2>
      <p>
        SQL é um padrão (ISO/IEC 9075), mas todo grande banco de dados o estende com sintaxe
        específica de dialeto. Aqui está o que importa para a formatação:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Banco de Dados</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Citação de identificador</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Diferenças notáveis</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"aspas_duplas"</code></td>
              <td style={{padding: "10px 16px"}}>Identificadores sensíveis a maiúsculas quando entre aspas duplas; <code>ILIKE</code> para correspondência sem distinção de maiúsculas; cláusula <code>RETURNING</code> em INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`crases`</code></td>
              <td style={{padding: "10px 16px"}}>Insensível a maiúsculas por padrão; sintaxe <code>LIMIT offset, count</code>; <code>GROUP BY</code> historicamente permitia colunas não agregadas</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"aspas_duplas"</code> ou <code>[colchetes]</code></td>
              <td style={{padding: "10px 16px"}}>Sistema de tipos permissivo; sem <code>RIGHT JOIN</code> ou <code>FULL OUTER JOIN</code> em versões mais antigas; instruções <code>PRAGMA</code> para informações de esquema</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[colchetes_quadrados]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> em vez de <code>LIMIT</code>; hints <code>NOLOCK</code>; <code>GETDATE()</code> em vez de <code>NOW()</code>; <code>ISNULL()</code> em vez de <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL: Aspas Duplas e Sensibilidade a Maiúsculas</h3>
      <p>
        No PostgreSQL, identificadores sem aspas são convertidos para minúsculas. Se você criou uma
        tabela como <code>CREATE TABLE "UserProfiles"</code> (com aspas duplas), você deve sempre
        referenciá-la como <code>"UserProfiles"</code> com aspas. Sem aspas, o PostgreSQL procura{" "}
        <code>userprofiles</code> e falha. Isso é uma fonte comum de confusão ao migrar do MySQL
        ou quando ORMs geram esquemas com nomes mistos.
      </p>

      <h3>MySQL: Citação com Crases</h3>
      <p>
        MySQL usa crases para citar identificadores, não aspas duplas (embora o MySQL no modo{" "}
        <code>ANSI_QUOTES</code> aceite aspas duplas). Você verá crases no DDL gerado pelo MySQL e
        em queries exportadas por ferramentas como phpMyAdmin. O Formatador de SQL lida com
        identificadores entre crases e os preserva para que a saída permaneça válida para o seu
        banco de dados específico.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Dica — sempre especifique seu dialeto:</strong> Ao colar uma query em um formatador,
        selecione o dialeto SQL correto. MySQL e PostgreSQL têm sintaxe sutilmente diferente que
        afeta como o formatador lida com certas construções, especialmente em torno de{" "}
        <code>GROUP BY</code>, funções de janela e funções de string.
      </div>

      <h2>Como Usar o Formatador de SQL do BrowseryTools</h2>
      <p>
        Usar o formatador leva três passos:
      </p>
      <ul>
        <li>
          <strong>Cole sua query.</strong> Copie o SQL bruto do arquivo de log, saída do ORM ou
          editor e cole na área de entrada. O formatador aceita qualquer quantidade de SQL —
          instruções únicas, múltiplas instruções ou scripts completos.
        </li>
        <li>
          <strong>Clique em Formatar.</strong> O formatador aplica palavras-chave em maiúsculas,
          separação de cláusulas, indentação e espaçamento consistente. O resultado aparece no
          painel de saída instantaneamente — sem requisição de rede e sem demora.
        </li>
        <li>
          <strong>Copie o resultado.</strong> Use o botão Copiar para colocar o SQL formatado
          na área de transferência, pronto para colar no seu editor, cliente de banco de dados
          ou PR.
        </li>
      </ul>
      <p>
        Como o formatador funciona inteiramente no seu navegador, você pode colar com segurança
        queries contendo dados sensíveis — nomes de tabelas de produção, IDs de clientes, detalhes
        internos de esquema — sem que nada saia do seu computador. Não há backend para registrar
        suas queries.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Suas queries ficam privadas:</strong> Queries SQL frequentemente contêm detalhes
        de esquema, lógica de negócios e dados que não devem sair do seu ambiente. O Formatador
        de SQL do BrowseryTools funciona 100% no seu navegador — suas queries nunca são enviadas
        a qualquer servidor, nunca são registradas e nunca são armazenadas. Cole queries de
        produção com confiança.
      </div>

      <h2>Formate Suas Queries SQL Agora</h2>
      <p>
        Seja desembaraçando um monstro gerado por ORM, revisando o pull request de um colega,
        depurando uma query lenta ou apenas tentando entender o que uma resposta do Stack Overflow
        está realmente fazendo — SQL formatado torna cada uma dessas tarefas mais rápida e menos
        propensa a erros. Boa formatação é a otimização de desempenho mais barata que você pode
        fazer antes de recorrer ao EXPLAIN.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Formatador de SQL Gratuito — Instantâneo, Privado, Sem Cadastro
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Cole qualquer query SQL e formate-a com indentação adequada e palavras-chave em maiúsculas
          com um clique. Nada sai do seu navegador.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Formatador de SQL →
        </a>
      </div>
      <ToolCTA slug="sql-formatter" variant="card" />
    </div>
  );
}
