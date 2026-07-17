import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        URLs parecem simples por fora — uma string de texto apontando para um recurso. Mas por baixo dos
        panos, elas seguem uma gramática rígida que permite apenas um conjunto específico de caracteres.
        No momento em que você tenta passar um espaço, um ampersand ou um caractere não-ASCII em uma URL
        sem codificá-lo, as coisas quebram de formas difíceis de depurar. A codificação por porcentagem
        (comumente chamada de URL encoding) é o mecanismo que torna dados arbitrários seguros para
        embutir em uma URL.
      </p>
      <ToolCTA slug="url-encoder" variant="inline" />
      <p>
        Você pode codificar e decodificar URLs instantaneamente com o{" "}
        <a href="/tools/url-encoder">Codificador/Decodificador de URL do BrowseryTools</a> — gratuito,
        sem cadastro, tudo fica no seu navegador.
      </p>

      <h2>Por que Caracteres Especiais Quebram URLs</h2>
      <p>
        A especificação de URL (RFC 3986) reserva certos caracteres para fins estruturais. O{" "}
        <code>?</code>{" "}
        separa o caminho da query string. O <code>&amp;</code> separa parâmetros de query entre si.
        O <code>#</code> marca um identificador de fragmento. O <code>/</code> separa segmentos de caminho.
        Se seus dados contiverem qualquer um desses caracteres, um analisador de URL não conseguirá
        distinguir entre seus dados e a estrutura da URL em si.
      </p>
      <p>
        Considere uma busca por <code>rock &amp; roll</code>. Construir a URL ingenuamente resulta em:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/search?q=rock & roll
          ^     ^
          |     └── parece que um novo parâmetro começa aqui
          └── esse & divide q de um segundo parâmetro fantasma`}
      </pre>
      <p>
        O analisador lê <code>q=rock </code> (com espaço no final) como o primeiro parâmetro, depois
        encontra o que parece ser o início de um segundo parâmetro chamado <code> roll</code>. Ambos os
        valores estão errados. A URL correta é <code>/search?q=rock%20%26%20roll</code> — o espaço
        vira <code>%20</code> e o ampersand vira <code>%26</code>.
      </p>

      <h2>O que a Codificação por Porcentagem Faz na Prática</h2>
      <p>
        A codificação por porcentagem converte um byte em uma sequência de três caracteres: um sinal de
        porcentagem literal seguido de dois dígitos hexadecimais maiúsculos representando o valor do byte.
        O caractere de espaço (byte ASCII 32, hex <code>0x20</code>) vira <code>%20</code>. O arroba
        (<code>@</code>, ASCII 64, hex{" "}
        <code>0x40</code>) vira <code>%40</code>. A regra é:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`percent-encode(byte) = "%" + byte.toString(16).toUpperCase().padStart(2, "0")

Examples:
  space  (0x20) → %20
  @      (0x40) → %40
  [      (0x5B) → %5B
  €      (UTF-8: 0xE2 0x82 0xAC) → %E2%82%AC`}
      </pre>
      <p>
        Para caracteres Unicode de múltiplos bytes (qualquer coisa fora do ASCII), o caractere é primeiro
        codificado em bytes UTF-8, e então cada byte é codificado por porcentagem. O símbolo do euro{" "}
        <code>€</code> tem três bytes UTF-8, então vira três sequências codificadas:{" "}
        <code>%E2%82%AC</code>.
      </p>

      <h2>Caracteres Seguros vs Caracteres Reservados</h2>
      <p>
        Nem todo caractere precisa ser codificado. A RFC 3986 define dois conjuntos que podem ser usados
        como estão:
      </p>
      <ul>
        <li><strong>Caracteres não reservados</strong> — A–Z, a–z, 0–9, hífen, sublinhado, ponto, til. Não têm significado especial e nunca precisam de codificação.</li>
        <li><strong>Caracteres reservados</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>. São seguros em suas posições estruturais, mas devem ser codificados quando aparecem como valores de dados.</li>
      </ul>
      <p>
        Todo o resto — espaços, Unicode, caracteres de controle, a maioria da pontuação — deve sempre
        ser codificado.
      </p>

      <h2>encodeURI vs encodeURIComponent: A Diferença Crítica</h2>
      <p>
        O JavaScript possui duas funções de codificação embutidas, e confundi-las é um dos bugs de
        codificação de URL mais comuns em aplicações web.
      </p>
      <p>
        <code>encodeURI()</code> é projetado para codificar uma URL completa. Ele deixa todos os
        caracteres reservados intactos porque eles são estruturalmente significativos em uma URL completa.
        Use-o se você tiver uma URL completa que pode conter espaços ou Unicode mas tem uma estrutura válida:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURI("https://example.com/search?q=hello world&lang=en")
// → "https://example.com/search?q=hello%20world&lang=en"
//   ✓ space encoded, but & and ? left intact`}
      </pre>
      <p>
        <code>encodeURIComponent()</code> é projetado para codificar um único valor — um valor de
        parâmetro de query, um segmento de caminho, qualquer coisa que deva ser tratada como dado puro.
        Ele codifica caracteres reservados também, incluindo <code>&amp;</code>, <code>=</code>,{" "}
        <code>?</code> e <code>/</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURIComponent("rock & roll")
// → "rock%20%26%20roll"
//   ✓ & encoded — safe to use as a query parameter value

encodeURIComponent("https://example.com/page")
// → "https%3A%2F%2Fexample.com%2Fpage"
//   ✓ colons and slashes encoded — safe as a redirect_uri value`}
      </pre>
      <p>
        A regra prática: ao construir uma URL, use <code>encodeURIComponent()</code> em cada valor de
        parâmetro individualmente, nunca na URL completa. Use <code>encodeURI()</code> apenas em uma URL
        completa que você deseja normalizar. No código moderno, prefira as APIs <code>URL</code> e{" "}
        <code>URLSearchParams</code> à codificação manual — elas lidam com a codificação automaticamente
        e corretamente.
      </p>

      <h2>Armadilhas na Codificação de Query String</h2>
      <p>
        Vários bugs sutis aparecem repetidamente ao codificar query strings. O sinal <code>+</code> merece
        atenção especial: no formato <code>application/x-www-form-urlencoded</code> (o formato que
        formulários HTML enviam), um espaço é codificado como <code>+</code> em vez de <code>%20</code>.
        Essa é uma convenção legada que antecede a RFC 3986. Se o seu backend decodifica por URL usando
        regras de codificação de formulário e o frontend envia <code>%20</code>, funciona bem. Mas se o
        frontend envia <code>+</code> e seu backend decodifica com as regras da RFC 3986, o{" "}
        <code>+</code> é mantido como um sinal de mais literal — não como espaço.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// URLSearchParams uses application/x-www-form-urlencoded (+ for spaces)
new URLSearchParams({ q: "rock & roll" }).toString()
// → "q=rock+%26+roll"

// encodeURIComponent uses RFC 3986 (%20 for spaces)
"q=" + encodeURIComponent("rock & roll")
// → "q=rock%20%26%20roll"

// Both are valid — just be consistent on both ends`}
      </pre>

      <h2>Como Dados de Formulário São Codificados por URL</h2>
      <p>
        Quando um formulário HTML envia com <code>method="GET"</code>, o navegador serializa os campos
        do formulário em uma query string usando <code>application/x-www-form-urlencoded</code>. Cada
        nome e valor de campo é codificado (espaços como <code>+</code>, caracteres especiais como{" "}
        <code>%XX</code>), e os campos são unidos com <code>&amp;</code>. Para formulários{" "}
        <code>method="POST"</code> sem atributo <code>enctype</code>, a mesma codificação é usada mas
        os dados vão no corpo da requisição em vez da URL.
      </p>
      <p>
        Esse também é o formato que o <code>fetch()</code> usa quando você passa um objeto{" "}
        <code>URLSearchParams</code> como corpo, e é o que a maioria dos frameworks server-side
        decodifica automaticamente ao ler envios de formulário.
      </p>

      <h2>Base64 em URLs</h2>
      <p>
        O Base64 padrão usa <code>+</code> e <code>/</code> — ambos com significados especiais em URLs.
        Quando dados codificados em Base64 precisam aparecer em uma URL (um padrão comum para tokens,
        dados de imagens ou assinaturas criptográficas), use a variante Base64URL. Ela substitui{" "}
        <code>+</code> por{" "}
        <code>-</code> e <code>/</code> por <code>_</code>, produzindo uma string segura em qualquer
        posição de URL sem codificação adicional. JWTs usam esse formato para seus segmentos de cabeçalho
        e payload.
      </p>

      <h2>Bugs Reais de Codificação</h2>
      <p>
        Alguns padrões de bug que aparecem em aplicações de produção:
      </p>
      <ul>
        <li><strong>Codificação dupla</strong> — codificar uma URL já codificada. <code>%20</code> vira <code>%2520</code> porque o próprio <code>%</code> é codificado para <code>%25</code>. Sempre verifique se um valor já está codificado antes de codificá-lo novamente.</li>
        <li><strong>encodeURIComponent ausente no redirect_uri</strong> — fluxos OAuth passam um <code>redirect_uri</code> como parâmetro de query. Se ele contém <code>?</code> ou <code>&amp;</code> e não está codificado, o servidor de autenticação interpreta esses caracteres como parte da estrutura da URL externa, quebrando o redirecionamento.</li>
        <li><strong>Codificação não-UTF-8</strong> — sistemas mais antigos ou servidores mal configurados às vezes codificam strings por porcentagem usando ISO-8859-1 em vez de UTF-8. A sequência de bytes para <code>é</code> difere entre os dois. Sempre imponha UTF-8 consistentemente nos dois lados.</li>
        <li><strong>Registro de URLs brutas em logs</strong> — registrar uma URL que contém dados de usuário codificados pode produzir logs enganosos se o visualizador de logs decodificar sequências de porcentagem automaticamente, ocultando o que foi realmente enviado.</li>
      </ul>

      <h2>Codifique e Decodifique URLs Instantaneamente</h2>
      <p>
        Seja depurando um redirecionamento OAuth, construindo uma query string manualmente, inspecionando
        uma requisição de API malformada ou apenas tentando entender o que uma URL codificada por
        porcentagem realmente contém —{" "}
        <a href="/tools/url-encoder">o Codificador/Decodificador de URL do BrowseryTools</a> resolve na
        hora. Cole sua string, escolha codificar ou decodificar e veja o resultado imediatamente. Sem
        chamadas ao servidor, sem cadastro.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Codificador / Decodificador de URL Gratuito — Roda 100% no Seu Navegador
        </p>
        <a
          href="/tools/url-encoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Codificador de URL →
        </a>
      </div>
      <ToolCTA slug="url-encoder" variant="card" />
    </div>
  );
}
