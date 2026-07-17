import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        JSON está em todo lugar. Alimenta APIs REST, arquivos de configuração, saídas de bancos de
        dados, payloads de webhook e agregadores de logs. Você o encontra dezenas de vezes por dia,
        seja construindo um serviço backend, depurando um aplicativo frontend ou lendo documentação.
        Entender JSON profundamente — não apenas como analisá-lo, mas como lê-lo, validá-lo e
        depurá-lo — é uma das habilidades de maior alavancagem que um desenvolvedor pode ter.
      </p>
      <ToolCTA slug="json-formatter" variant="inline" />
      <p>
        Este guia cobre tudo, desde os fundamentos da sintaxe JSON até a depuração de erros comuns
        de análise, estratégias de formatação e como trabalhar com estruturas profundamente
        aninhadas. Cole qualquer JSON no{" "}
        <a href="/tools/json-formatter">Formatador de JSON do BrowseryTools</a> para validá-lo e
        formatá-lo instantaneamente — gratuito, sem cadastro, tudo fica no seu navegador.
      </p>

      <h2>Por que JSON Venceu (e o XML Perdeu)</h2>
      <p>
        Antes de JSON se tornar o formato padrão de intercâmbio de dados, o XML era o padrão.
        APIs SOAP, feeds RSS e arquivos de configuração usavam XML. O JSON surgiu como uma
        alternativa mais simples e gradualmente assumiu a maioria dos casos de uso. Os motivos são
        diretos:
      </p>
      <ul>
        <li><strong>Menos verboso</strong> — JSON não requer tags de fechamento. Os mesmos dados levam 30–50% menos caracteres para representar.</li>
        <li><strong>Nativo do JavaScript</strong> — JSON significa JavaScript Object Notation. Mapeia diretamente para objetos e arrays JavaScript, tornando trivial analisar e serializar no navegador.</li>
        <li><strong>Legível por humanos</strong> — um payload JSON formatado adequadamente é mais fácil de ler do que o XML equivalente com seus colchetes angulares e declarações de namespace.</li>
        <li><strong>Amplamente suportado</strong> — toda linguagem principal tem um parser JSON embutido. Não é necessário instalar uma biblioteca apenas para desserializar uma resposta de API.</li>
      </ul>
      <p>
        O XML ainda tem casos de uso legítimos — formatos de documentos (DOCX, SVG), configurações
        que precisam de comentários (que o JSON não suporta) e protocolos como SOAP onde é
        necessário. Mas para comunicação de API e armazenamento de dados, JSON é o vencedor
        inequívoco.
      </p>

      <h2>Regras de Sintaxe JSON</h2>
      <p>
        O JSON tem uma sintaxe pequena e rigorosa. Estas são as regras que pegam a maioria dos
        desenvolvedores de surpresa:
      </p>
      <ul>
        <li><strong>As chaves devem ser strings entre aspas duplas</strong> — <code>{"{"}"name": "Alice"{"}"}</code> é válido; <code>{"{"}name: "Alice"{"}"}</code> não é. Ao contrário dos literais de objeto JavaScript, o JSON não permite chaves sem aspas.</li>
        <li><strong>Sem vírgulas finais</strong> — <code>[1, 2, 3,]</code> é JSON inválido. A vírgula final após o último elemento é aceita pelo JavaScript e por muitos parsers, mas não faz parte da especificação JSON.</li>
        <li><strong>Sem comentários</strong> — o JSON não tem sintaxe de comentários. Isso surpreende desenvolvedores que querem anotar arquivos de configuração. Se você precisar de comentários em um arquivo de configuração, considere JSONC (JSON com Comentários) ou YAML.</li>
        <li><strong>Strings usam apenas aspas duplas</strong> — strings entre aspas simples como <code>'hello'</code> não são JSON válido.</li>
        <li><strong>Números não podem ter zeros à esquerda</strong> — <code>007</code> é inválido; use <code>7</code>.</li>
        <li><strong>Apenas seis tipos de valor</strong> — strings, números, booleanos (<code>true</code> / <code>false</code>), null, objetos e arrays. Sem datas, sem funções, sem undefined.</li>
      </ul>

      <h2>Erros Comuns de JSON e o que Significam</h2>
      <p>
        Erros de análise JSON podem ser crípticos. Aqui estão os mais comuns e como corrigi-los.
      </p>

      <h3>Token inesperado</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Erro: Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Aspas simples não são válidas em JSON. Substitua-as por aspas duplas:{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Token inesperado } / ]"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Erro: Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        Uma vírgula final antes do colchete de fechamento. Remova a vírgula após o último elemento.
        Este é o erro JSON mais comum para desenvolvedores vindos do JavaScript, onde vírgulas
        finais são perfeitamente válidas.
      </p>

      <h3>Fim inesperado da entrada JSON</h3>
      <p>
        Isso significa que o JSON está truncado — a string termina antes que todos os objetos e
        arrays abertos sejam fechados. Conte suas chaves e colchetes de abertura e fechamento.
        Eles devem corresponder.
      </p>

      <h3>Nomes de propriedade devem ser strings</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Inválido — chave sem aspas
{ name: "Alice" }

// Válido
{ "name": "Alice" }`}
      </pre>

      <h2>Pretty-Print vs Minificação</h2>
      <p>
        O JSON pode ser representado de duas formas: formatado (com indentação e novas linhas) ou
        minificado (todo espaço em branco removido). A escolha depende do contexto.
      </p>
      <p>
        <strong>Formate</strong> quando estiver lendo, depurando, revisando ou armazenando JSON
        no controle de versão. O JSON indentado é imediatamente legível e tem diffs limpos no Git
        porque cada valor está em sua própria linha.
      </p>
      <p>
        <strong>Minifique</strong> quando estiver transmitindo JSON pela rede. O espaço em branco
        é puro overhead nas respostas HTTP. Um payload JSON de 100KB com formatação pode comprimir
        para 60KB quando minificado, e ainda mais para 15KB com gzip. A maioria das APIs serve
        JSON minificado pela rede e deixa o cliente formatá-lo conforme necessário.
      </p>
      <p>
        Em JavaScript: <code>JSON.stringify(data, null, 2)</code> formata com indentação de 2
        espaços. <code>JSON.stringify(data)</code> minifica. O{" "}
        <a href="/tools/json-formatter">Formatador de JSON do BrowseryTools</a> faz ambos — cole
        seu JSON e alterne entre visualizações formatadas e minificadas instantaneamente.
      </p>

      <h2>Navegando em JSON Profundamente Aninhado</h2>
      <p>
        As respostas de API do mundo real são frequentemente profundamente aninhadas. Um payload de
        webhook do Stripe, uma resposta da API do GitHub ou uma configuração do Kubernetes podem
        ter objetos com cinco ou seis níveis de profundidade. Aqui estão estratégias para trabalhar
        com eles:
      </p>

      <h3>Use encadeamento opcional em JavaScript</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Sem encadeamento opcional — trava se qualquer nível for undefined
const city = user.address.location.city;

// Com encadeamento opcional — retorna undefined em vez de lançar erro
const city = user?.address?.location?.city;

// Com coalescência nula para um valor padrão
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>Use jq para consulta JSON na linha de comando</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Formatar toda a resposta
curl https://api.example.com/users | jq .

# Extrair um campo específico
curl https://api.example.com/users | jq '.[0].email'

# Filtrar um array
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON em APIs vs Arquivos de Configuração</h2>
      <p>
        O JSON serve dois papéis muito diferentes dependendo do contexto, e as melhores práticas
        diferem entre eles.
      </p>
      <p>
        Em <strong>respostas de API</strong>, o JSON é gerado por código e consumido por código.
        Você raramente o escreve manualmente. A prioridade é correção e consistência — use uma
        biblioteca de serialização e deixe ela lidar com o escape. Minifique para produção, inclua
        um cabeçalho Content-Type de <code>application/json</code> e versione sua API para que
        mudanças na estrutura JSON não sejam quebras.
      </p>
      <p>
        Em <strong>arquivos de configuração</strong> (package.json, tsconfig.json, .eslintrc.json),
        o JSON é escrito por humanos. Aqui, a legibilidade importa mais. Use indentação de 2
        espaços, mantenha a estrutura rasa sempre que possível e adicione comentários usando um
        parser compatível com JSONC se suas ferramentas suportarem. Nunca minifique arquivos de
        configuração que ficam no controle de versão.
      </p>

      <h2>Validação de JSON Schema</h2>
      <p>
        JSON Schema é uma especificação para definir a estrutura, tipos e restrições de um
        documento JSON. Ela permite validar que um payload JSON está em conformidade com uma forma
        esperada antes de tentar usá-lo.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":    { "type": "integer" },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0, "maximum": 150 }
  },
  "additionalProperties": false
}`}
      </pre>
      <p>
        Bibliotecas como <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python) e{" "}
        <code>JSON.NET Schema</code> (.NET) podem validar um documento JSON em relação a um
        esquema em tempo de execução — detectando payloads malformados na fronteira da API antes
        que causem erros inesperados mais profundamente na aplicação.
      </p>

      <h2>Resumo</h2>
      <p>
        A simplicidade do JSON é seu maior ponto forte. Seis tipos de valor, regras rigorosas de
        aspas, sem comentários, sem vírgulas finais — as restrições são pequenas e o formato é
        inequívoco. Quando algo dá errado, quase sempre é um dos poucos erros de sintaxe
        previsíveis. Cole seu JSON quebrado no{" "}
        <a href="/tools/json-formatter">Formatador de JSON do BrowseryTools</a> e o erro ficará
        imediatamente visível com a posição exata destacada.
      </p>
      <ToolCTA slug="json-formatter" variant="card" />
    </div>
  );
}
