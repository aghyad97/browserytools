export default function Content() {
  return (
    <div>
      <p>
        Você encontrou a chamada de API que precisa — mas está escrita em cURL, e você está
        trabalhando em JavaScript ou Python. Ou abriu o DevTools do navegador, clicou com o
        botão direito em uma requisição e escolheu &ldquo;Copiar como cURL&rdquo;, e agora tem
        uma parede de flags que precisa transformar em código real. Traduzir cURL manualmente é
        tedioso: cada <code>-H</code>, <code>-d</code>, <code>-u</code> e <code>-X</code> tem
        que mapear para o argumento certo na sua linguagem, e um único cabeçalho ausente quebra
        a requisição.
      </p>
      <p>
        O <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> faz isso
        instantaneamente — cole um comando cURL e obtenha código limpo em JavaScript{" "}
        <code>fetch</code>, Python <code>requests</code>, Node.js e mais, tudo no seu navegador
        sem nada ser enviado. Este guia mostra o mapeamento de flag para código para que você
        possa ler e confiar na saída.
      </p>

      <h2>O Fluxo de Trabalho &ldquo;Copiar como cURL&rdquo;</h2>
      <p>
        A forma mais rápida de obter uma requisição funcional é deixar o navegador escrevê-la
        para você. Abra o DevTools (F12), vá para a aba <strong>Network</strong>, execute a ação
        que deseja replicar, clique com o botão direito na requisição e escolha{" "}
        <strong>Copiar &rarr; Copiar como cURL</strong>. Agora você tem um comando cURL com os
        cabeçalhos, cookies e corpo exatos que o site real enviou. Cole no{" "}
        <a href="/tools/curl-converter">conversor</a> e você obtém a mesma requisição como código
        que pode inserir no seu projeto.
      </p>

      <h2>Como as Flags do cURL Mapeiam para Código</h2>
      <p>
        Quando você conhece as poucas flags que importam, consegue ler qualquer comando cURL de
        relance:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.8}}>
{`-X POST          ->  o método HTTP
-H "Key: Value"  ->  um cabeçalho da requisição
-d '{...}'       ->  o corpo da requisição (implica POST)
-u user:pass     ->  autenticação HTTP Basic
-F field=value   ->  upload multipart/form-data
-b "name=value"  ->  um cookie
-L               ->  seguir redirecionamentos`}
      </pre>
      <p>
        Um cabeçalho como <code>-H &quot;Authorization: Bearer abc123&quot;</code> se torna uma
        entrada no objeto <code>headers</code>. Um corpo passado com <code>-d</code> se torna o
        corpo da requisição, e se o tipo de conteúdo for JSON ele é serializado adequadamente.{" "}
        <code>-u user:pass</code> se torna um cabeçalho de auth Basic. Conhecer esse mapeamento
        é o que permite verificar o código gerado em vez de confiar cegamente nele.
      </p>

      <h2>A Mesma Requisição em Três Linguagens</h2>
      <p>
        Tome um POST autenticado simples. Em cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>Como JavaScript <code>fetch</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Ada" }),
});`}
      </pre>
      <p>Como Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Note como o argumento <code>json=</code> do Python define o corpo <em>e</em> o cabeçalho
        Content-Type automaticamente — uma pequena diferença idiomática que o conversor trata
        para você.
      </p>

      <h2>Armadilhas Comuns</h2>
      <p>
        <strong>Aspas e escaping.</strong> Corpos cURL são envoltos em aspas simples no shell;
        quando contêm JSON com aspas duplas, a tradução manual é onde os bugs surgem. Deixar
        um conversor fazer o parsing elimina esse risco.
      </p>
      <p>
        <strong>POST implícito.</strong> Usar <code>-d</code> torna uma requisição POST mesmo
        sem <code>-X POST</code>. Se você traduzir apenas as flags visíveis, pode produzir
        erroneamente um GET.
      </p>
      <p>
        <strong>Segredos no comando.</strong> Uma requisição cURL copiada frequentemente contém
        tokens e cookies ativos. Como o conversor roda inteiramente no seu navegador, esses
        segredos nunca são enviados a um servidor — mas você ainda deve removê-los antes de
        colar código em um repositório compartilhado ou ticket.
      </p>

      <h2>Perguntas Frequentes</h2>
      <p>
        <strong>Para quais linguagens posso converter?</strong> JavaScript fetch, Python requests,
        Node.js e outros alvos comuns.
      </p>
      <p>
        <strong>O conversor envia meu comando para algum lugar?</strong> Não. O parsing e a
        conversão acontecem localmente no seu navegador, então quaisquer tokens no comando ficam
        no seu dispositivo.
      </p>
      <p>
        <strong>Posso colar um &ldquo;Copiar como cURL&rdquo; do DevTools?</strong> Sim — esse
        é um dos melhores usos. Ele captura os cabeçalhos e o corpo exatos de uma requisição real.
      </p>
      <p>
        <strong>É gratuito?</strong> Sim — sem conta, sem limites.
      </p>

      <h2>Converta Agora</h2>
      <p>
        Abra o <a href="/tools/curl-converter">cURL Converter</a>, cole seu comando e copie o
        código equivalente. Para uma análise mais profunda da sintaxe cURL e padrões REST, leia
        nosso{" "}
        <a href="/blog/curl-converter-guide">guia para converter requisições de API entre linguagens</a>,
        e para entender as respostas que você recebe de volta veja o{" "}
        <a href="/blog/http-status-codes-guide">guia de códigos de status HTTP</a>.
      </p>
    </div>
  );
}
