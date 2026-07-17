import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Toda API tem documentação. Quase universalmente, essa documentação inclui exemplos de código
        em cURL — o cliente HTTP de linha de comando que vem instalado em todo sistema Unix-like e
        tem sido a língua franca da documentação de API por décadas. O problema é que você não está
        escrevendo scripts shell. Você está escrevendo JavaScript, Python, Go ou Ruby, e precisa
        traduzir esse comando cURL em código funcional antes de poder usá-lo.
      </p>
      <ToolCTA slug="curl-converter" variant="inline" />
      <p>
        Essa tradução é tediosa e propensa a erros. Cabeçalhos, esquemas de autenticação, corpos
        de requisição e codificação de URL precisam ser mapeados para as chamadas de método
        corretas na linguagem certa. O{" "}
        <a href="/tools/curl-converter">Conversor de cURL do BrowseryTools</a> faz isso
        automaticamente — cole um comando cURL e obtenha o código equivalente em JavaScript fetch,
        Python requests, Node.js axios e mais. Gratuito, sem cadastro, tudo fica no seu navegador.
      </p>

      <h2>O que É o cURL?</h2>
      <p>
        cURL (Client URL) é uma ferramenta de linha de comando para transferir dados usando URLs.
        Suporta HTTP, HTTPS, FTP, WebSockets e dezenas de outros protocolos. Para desenvolvedores,
        é mais comumente usado como forma de fazer requisições HTTP pelo terminal — testar um
        endpoint de API, baixar um arquivo ou depurar autenticação.
      </p>
      <p>
        O cURL está instalado por padrão no macOS e na maioria das distribuições Linux. No Windows,
        ele vem incluído com o sistema operacional desde o Windows 10. Essa ubiquidade é exatamente
        por que as equipes de documentação de API usam cURL para exemplos — podem ter certeza de
        que qualquer desenvolvedor lendo a documentação pode executar o exemplo imediatamente, sem
        instalar nada.
      </p>

      <h2>Anatomia de um Comando cURL</h2>
      <p>
        Um comando cURL é construído a partir de uma URL base e um conjunto de flags. Aqui está
        um exemplo completo que cobre as flags mais importantes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Detalhando cada flag:
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> — define o método HTTP. Os valores válidos são GET, POST, PUT, PATCH, DELETE, etc. Se omitido e <code>-d</code> estiver presente, o cURL usa POST por padrão.</li>
        <li><strong><code>-H "Cabeçalho: Valor"</code></strong> — adiciona um cabeçalho de requisição. Pode ser repetido várias vezes para múltiplos cabeçalhos.</li>
        <li><strong><code>-d '...'</code></strong> — o corpo da requisição. Para JSON, combine com <code>-H "Content-Type: application/json"</code>. O cURL codifica o corpo via URL por padrão, a menos que você use <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> — envia o corpo exatamente como está, sem nenhuma codificação URL. Necessário quando o corpo contém caracteres como <code>@</code> que o <code>-d</code> interpretaria de forma especial.</li>
        <li><strong><code>-u usuario:senha</code></strong> — atalho de autenticação básica. O cURL codifica como um cabeçalho Authorization em Base64 para você.</li>
        <li><strong><code>-s</code></strong> — modo silencioso; suprime a barra de progresso. Quase sempre usado em scripts.</li>
        <li><strong><code>-v</code></strong> — modo verboso; exibe cabeçalhos de requisição e resposta. Inestimável para depurar falhas de autenticação.</li>
        <li><strong><code>-o nome_arquivo</code></strong> — escreve a saída em um arquivo em vez do stdout.</li>
      </ul>

      <h2>Padrões Comuns de cURL para APIs REST</h2>

      <h3>Requisição GET com Parâmetros de Query</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Os parâmetros de query vão diretamente na URL. Coloque aspas em toda a URL para evitar que
        o shell interprete o <code>&</code> como um operador de processo em segundo plano.
      </p>

      <h3>POST com Corpo JSON</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>Upload de Arquivo (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        A flag <code>-F</code> envia multipart/form-data. O prefixo <code>@</code> significa "ler
        do arquivo". Esse é o formato usado para uploads de imagens, APIs de processamento de
        documentos e qualquer endpoint que aceite dados binários.
      </p>

      <h2>Convertendo cURL para JavaScript fetch</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// cURL original:
// curl -X POST https://api.example.com/v1/users \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"name": "Alice", "email": "alice@example.com"}'

const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN",
  },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
  }),
});

const data = await response.json();`}
      </pre>

      <h2>Convertendo cURL para Python requests</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`import requests

response = requests.post(
    "https://api.example.com/v1/users",
    headers={
        "Authorization": "Bearer TOKEN",
    },
    json={
        "name": "Alice",
        "email": "alice@example.com",
    },
)

data = response.json()`}
      </pre>
      <p>
        O parâmetro <code>json=</code> da biblioteca <code>requests</code> lida tanto com a
        serialização quanto com a definição automática do cabeçalho{" "}
        <code>Content-Type: application/json</code> — sem necessidade de definir manualmente.
      </p>

      <h2>Convertendo cURL para Node.js com axios</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`const axios = require("axios");

const response = await axios.post(
  "https://api.example.com/v1/users",
  {
    name: "Alice",
    email: "alice@example.com",
  },
  {
    headers: {
      Authorization: "Bearer TOKEN",
    },
  }
);

const data = response.data;`}
      </pre>

      <h2>Como "Copiar como cURL" Funciona nas DevTools do Navegador</h2>
      <p>
        Um dos recursos mais úteis nas DevTools do navegador é "Copiar como cURL". No Chrome,
        Firefox ou Safari: abra as DevTools, vá para a aba Rede, faça uma requisição (entre na
        conta, clique em um botão, carregue uma página), clique com o botão direito na requisição
        na lista de rede e selecione "Copiar como cURL".
      </p>
      <p>
        O navegador gera um comando cURL completo que inclui cada cabeçalho que o navegador enviou
        — incluindo cookies, tokens de sessão, tokens CSRF e qualquer outro material de
        autenticação. Isso significa que você pode reproduzir exatamente a requisição que o
        navegador fez, incluindo todo o seu contexto de autenticação, do terminal ou do código.
      </p>
      <p>
        Isso é inestimável para depuração: se a requisição do navegador funciona, mas a requisição
        do seu código falha, cole ambas em um diff e encontre a diferença no cabeçalho ou no corpo.
        Você também pode colar o cURL copiado diretamente no{" "}
        <a href="/tools/curl-converter">Conversor de cURL do BrowseryTools</a> para obter o código
        equivalente na sua linguagem preferida — o conversor lida com todo o escape, citação e
        tradução de flags automaticamente.
      </p>

      <h2>Resumo</h2>
      <p>
        O cURL é a linguagem universal do HTTP. A documentação de APIs o usa porque todos podem
        executá-lo. As DevTools o copiam porque captura todos os detalhes de uma requisição.
        Aprender a ler cURL fluentemente — e a traduzi-lo com precisão para qualquer linguagem
        em que você está trabalhando — é uma habilidade prática que rende dividendos toda vez
        que você integra uma nova API. Pule a tradução manual tediosa e use o{" "}
        <a href="/tools/curl-converter">Conversor de cURL do BrowseryTools</a> para obter código
        limpo e executável em segundos.
      </p>
      <ToolCTA slug="curl-converter" variant="card" />
    </div>
  );
}
