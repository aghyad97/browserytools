export default function Content() {
  return (
    <div>
      <p>
        Códigos de status HTTP são a linguagem que os servidores usam para dizer aos clientes o que
        aconteceu com uma requisição. Todo desenvolvedor os encontra constantemente — no DevTools, em
        respostas de API, em logs de erro, em alertas do Slack às 3 da manhã. Saber o que cada código
        realmente significa, quando usar qual código em suas próprias APIs e o que os mais comuns
        indicam sobre um bug torna você significativamente mais rápido na depuração e na construção
        de serviços melhores.
      </p>
      <p>
        Você pode consultar qualquer código de status HTTP com a{" "}
        <a href="/tools/http-status">Referência de Códigos de Status HTTP do BrowseryTools</a> — gratuita,
        sem cadastro, tudo roda no seu navegador.
      </p>

      <h2>As Cinco Categorias</h2>
      <p>
        Os códigos de status são números de três dígitos. O primeiro dígito define a categoria:
      </p>
      <ul>
        <li><strong>1xx — Informacional</strong>: A requisição foi recebida; o processamento continua. São raros na maioria das aplicações.</li>
        <li><strong>2xx — Sucesso</strong>: A requisição foi recebida, compreendida e aceita.</li>
        <li><strong>3xx — Redirecionamento</strong>: É necessária uma ação adicional para completar a requisição. O cliente deve seguir um redirecionamento.</li>
        <li><strong>4xx — Erro do Cliente</strong>: A requisição estava malformada ou não autorizada. O cliente cometeu um erro.</li>
        <li><strong>5xx — Erro do Servidor</strong>: O servidor falhou em atender a uma requisição válida. O servidor cometeu um erro.</li>
      </ul>
      <p>
        Essa regra do primeiro dígito é importante: se você vir um código de status que não conhece
        (como <code>429</code> ou <code>451</code>), pelo menos sabe se o problema está no lado do
        cliente ou do servidor, e se a requisição teve sucesso no final.
      </p>

      <h2>2xx: Códigos de Sucesso</h2>
      <p>
        Esses dizem ao cliente que a requisição funcionou. O código específico comunica como funcionou:
      </p>
      <ul>
        <li>
          <strong>200 OK</strong> — o sucesso universal. O corpo da resposta contém os dados solicitados. Usado para requisições GET e a maioria das respostas que retornam conteúdo.
        </li>
        <li>
          <strong>201 Created</strong> — um novo recurso foi criado. Deve incluir um cabeçalho <code>Location</code> apontando para a URL do novo recurso. Use isso para requisições POST que criam registros, não 200.
        </li>
        <li>
          <strong>204 No Content</strong> — a requisição teve sucesso mas não há corpo para retornar. Comum para requisições DELETE e operações PATCH/PUT onde o cliente não precisa dos dados atualizados de volta. A resposta não deve incluir um corpo.
        </li>
        <li>
          <strong>206 Partial Content</strong> — usado com requisições de intervalo (cabeçalho <code>Range</code>). Players de vídeo usam isso para solicitar intervalos de bytes específicos de um arquivo de mídia sem baixar o arquivo inteiro.
        </li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# REST API design pattern
POST   /api/users        → 201 Created  (body: new user object, Location: /api/users/123)
GET    /api/users/123    → 200 OK       (body: user object)
PATCH  /api/users/123    → 200 OK       (body: updated user) or 204 No Content
DELETE /api/users/123    → 204 No Content`}
      </pre>

      <h2>3xx: Códigos de Redirecionamento</h2>
      <p>
        Redirecionamentos dizem ao cliente para procurar em outro lugar. O cabeçalho <code>Location</code>{" "}
        contém a nova URL. A distinção principal é entre redirecionamentos permanentes e temporários, e
        entre redirecionamentos que preservam o método HTTP e os que o alteram.
      </p>
      <ul>
        <li>
          <strong>301 Moved Permanently</strong> — o recurso tem uma nova URL permanente. Navegadores e mecanismos de busca fazem cache disso. O navegador usará GET para o redirecionamento independentemente do método original (uma quirk histórica). Use quando renomear permanentemente uma URL ou redirecionar HTTP para HTTPS em uma configuração mais antiga.
        </li>
        <li>
          <strong>302 Found</strong> — redirecionamento temporário. Assim como o 301, os navegadores mudam POST para GET no redirecionamento (conforme a especificação, embora a especificação estivesse "errada" — veja 307). Use 302 apenas quando o redirecionamento for genuinamente temporário.
        </li>
        <li>
          <strong>304 Not Modified</strong> — a versão em cache ainda está atualizada; não há corpo. O servidor envia isso em resposta a um GET condicional (com <code>If-None-Match</code> ou <code>If-Modified-Since</code>). O navegador usa sua cópia em cache. Importante para eficiência de CDN e redução de largura de banda.
        </li>
        <li>
          <strong>307 Temporary Redirect</strong> — como o 302, mas a especificação garante que o método HTTP original seja preservado. Se um POST resultar em 307, o navegador fará POST para a nova URL. Use 307 em vez de 302 para redirecionamentos temporários não-GET.
        </li>
        <li>
          <strong>308 Permanent Redirect</strong> — como o 301, mas também garante a preservação do método. O padrão moderno para redirecionamentos permanentes.
        </li>
      </ul>

      <h2>Equívoco Comum: 301 vs 302 para SEO</h2>
      <p>
        Mecanismos de busca tratam o 301 como um sinal para transferir "autoridade de link" (PageRank)
        da URL antiga para a nova e atualizar seu índice. Um 302 diz ao rastreador que o redirecionamento
        é temporário, então ele continua indexando a URL original. Usar 302 quando você quer 301 pode
        suprimir o benefício de SEO dos redirecionamentos. Por outro lado, usar 301 quando o
        redirecionamento é temporário faz os mecanismos de busca fazerem cache do redirecionamento,
        dificultando desfazê-lo.
      </p>

      <h2>4xx: Códigos de Erro do Cliente</h2>
      <p>
        Esses códigos indicam que o cliente enviou uma requisição ruim. Não retorne 5xx para erros do
        cliente — isso engana o monitoramento e dificulta identificar se um problema é um bug no seu
        servidor ou entrada inválida de um cliente.
      </p>
      <ul>
        <li>
          <strong>400 Bad Request</strong> — a requisição está malformada. Campos obrigatórios faltando, JSON inválido, tipos de dados errados. O 4xx mais genérico; use códigos mais específicos quando disponíveis.
        </li>
        <li>
          <strong>401 Unauthorized</strong> — apesar do nome, significa "não autenticado." O cliente não forneceu credenciais, ou as credenciais eram inválidas. A resposta deve incluir um cabeçalho <code>WWW-Authenticate</code> indicando como autenticar. O nome é um erro histórico — "não autenticado" seria mais preciso.
        </li>
        <li>
          <strong>403 Forbidden</strong> — autenticado mas não autorizado. O servidor sabe quem você é (ou não importa quem você seja) e você não tem permissão. Ao contrário do 401, re-autenticar não vai ajudar. Use 403 quando um usuário tenta acessar um recurso que não tem permissão de ver.
        </li>
        <li>
          <strong>404 Not Found</strong> — o recurso não existe nessa URL. Também é retornado quando um servidor quer ocultar a existência de um recurso de usuários não autorizados (retornar 403 confirmaria que o recurso existe; retornar 404 oculta esse fato).
        </li>
        <li>
          <strong>409 Conflict</strong> — a requisição entra em conflito com o estado atual do recurso. Exemplo clássico: tentar criar um usuário com um e-mail que já existe, ou tentar atualizar um recurso usando uma versão desatualizada (conflito de bloqueio otimista).
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> — a requisição está sintaticamente correta (JSON válido, Content-Type correto) mas semanticamente inválida (um campo obrigatório está presente mas contém um valor inválido, violação de regra de negócio). O Rails popularizou o uso do 422 para erros de validação. Mais específico que o 400.
        </li>
        <li>
          <strong>429 Too Many Requests</strong> — limite de taxa excedido. Deve incluir um cabeçalho <code>Retry-After</code> dizendo ao cliente quanto tempo aguardar. Essencial para qualquer API pública.
        </li>
      </ul>

      <h2>401 vs 403: A Distinção que Importa</h2>
      <p>
        Esse é um dos pares mais comumente confundidos:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`GET /api/admin/users
Authorization: (none)
→ 401 Unauthorized
   "You haven't told me who you are. Log in first."

GET /api/admin/users
Authorization: Bearer <valid-regular-user-token>
→ 403 Forbidden
   "I know who you are. You're not an admin. Access denied."`}
      </pre>

      <h2>5xx: Códigos de Erro do Servidor</h2>
      <ul>
        <li>
          <strong>500 Internal Server Error</strong> — um catch-all genérico para falhas inesperadas no servidor. Uma exceção não tratada, uma referência nula, uma consulta ao banco de dados que lançou um erro. Não exponha stack traces para os clientes; registre-os no servidor.
        </li>
        <li>
          <strong>502 Bad Gateway</strong> — o servidor atuando como proxy ou gateway recebeu uma resposta inválida de um servidor upstream. Comum quando seu load balancer ou proxy reverso não consegue alcançar os servidores de aplicação por trás dele — o app travou ou não está ouvindo na porta certa.
        </li>
        <li>
          <strong>503 Service Unavailable</strong> — o servidor está temporariamente incapaz de lidar com requisições. Pode estar sobrecarregado, no meio de um deploy ou em manutenção. Deve incluir um cabeçalho <code>Retry-After</code> quando a duração da interrupção é conhecida.
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> — o proxy ou gateway não recebeu uma resposta tempestiva do servidor upstream. O upstream está ativo e respondendo, mas muito lentamente. Sintoma comum de consultas ao banco de dados que estão demorando demais ou chamadas a APIs externas que estão travadas.
        </li>
      </ul>

      <h2>Códigos de Status no Design de APIs REST</h2>
      <p>
        Usar os códigos de status corretos torna sua API autodocumentada e mais fácil de integrar.
        Algumas diretrizes:
      </p>
      <ul>
        <li>Nunca retorne 200 com um objeto de erro no corpo. Se uma requisição falhou, o código de status deve refletir isso. Os clientes devem conseguir verificar apenas o código de status para saber se precisam tratar um erro.</li>
        <li>Use 201 e um cabeçalho <code>Location</code> ao criar recursos via POST. Isso permite que os clientes descubram a URL do novo recurso sem analisar o corpo.</li>
        <li>Retorne 422 (não 400) para erros de validação, e inclua um corpo de erro estruturado que identifica quais campos falharam e por quê.</li>
        <li>Use 409 para conflitos que requerem resolução no nível da aplicação, não apenas entrada inválida.</li>
        <li>Implemente 429 com limitação de taxa desde o início em qualquer endpoint público — é muito mais difícil adicionar retroativamente.</li>
      </ul>

      <h2>Depurando Códigos de Status no DevTools</h2>
      <p>
        Abra a aba Network no DevTools do navegador e procure por requisições em vermelho — essas são
        respostas 4xx ou 5xx. Clique em uma requisição para ver o código de status exato, os cabeçalhos
        de resposta (úteis para <code>WWW-Authenticate</code>, <code>Location</code>,{" "}
        <code>Retry-After</code>) e o corpo da resposta (que frequentemente contém uma mensagem de erro
        do servidor). Para redirecionamentos, marque "Preserve log" para que o painel DevTools não seja
        limpo quando a página navegar — caso contrário você perde a cadeia de redirecionamentos.
      </p>
      <p>
        Quando encontrar um código de status desconhecido, a{" "}
        <a href="/tools/http-status">Referência de Códigos de Status HTTP do BrowseryTools</a> fornece
        a descrição oficial, a RFC de origem e notas sobre uso comum — sem precisar sair da sua aba
        do navegador.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Referência Gratuita de Códigos de Status HTTP — Todos os Códigos, Fontes RFC, Notas de Uso
        </p>
        <a
          href="/tools/http-status"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Referência de Status HTTP →
        </a>
      </div>
    </div>
  );
}
