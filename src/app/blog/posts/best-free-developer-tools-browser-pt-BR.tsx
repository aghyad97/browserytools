import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Todo desenvolvedor acumula uma lista mental de sites de referência para tarefas rápidas: decodificar aquela string Base64, validar este bloco de JSON, conferir o que aquele JWT realmente contém. O problema é que essa lista geralmente inclui uma dúzia de sites diferentes — cada um com seus próprios banners de cookies, solicitações de cadastro e questões de privacidade.
      </p>

      <p>
        O <strong>BrowseryTools</strong> consolida os utilitários para desenvolvedores mais essenciais em uma única suíte rápida e com privacidade em primeiro lugar. Tudo roda localmente no seu navegador. Sem envios. Sem chaves de API. Sem limites de requisições. Este guia percorre cada ferramenta e mostra exatamente quando e por que você recorreria a ela.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Por que ferramentas de navegador superam pacotes npm e APIs de nuvem:</strong> Instalar um pacote npm leva tempo, aumenta sua árvore de dependências, exige que o Node.js esteja disponível e pode ter vulnerabilidades de segurança em sua cadeia de dependências. APIs de nuvem exigem autenticação, têm limites de requisições e introduzem latência. Uma ferramenta de navegador é instantânea, sem dependências, e funciona da mesma forma em todas as máquinas.
      </div>

      <h2>Formatador e validador de JSON</h2>

      <p>
        O JSON é a língua franca das APIs modernas. Quando você está encarando um bloco minificado de 3 KB retornado por um endpoint, o <Link href="/tools/json-formatter">Formatador de JSON</Link> o torna instantaneamente legível.
      </p>

      <h3>O que ele faz</h3>
      <ul>
        <li><strong>Formatar e indentar:</strong> Pega JSON compacto e adiciona indentação e quebras de linha</li>
        <li><strong>Validar:</strong> Sinaliza erros de sintaxe com a linha e a posição exata do caractere</li>
        <li><strong>Minificar:</strong> Remove todo o espaço em branco para produzir JSON compacto para payloads</li>
        <li><strong>Visualização em árvore:</strong> Explore objetos e arrays aninhados em uma árvore recolhível</li>
      </ul>

      <h3>Cenários comuns</h3>
      <p>Cole uma resposta de API do seu terminal para entender sua estrutura:</p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Raw curl output
curl -s https://api.example.com/user/42

# Minified response that's hard to read:
{"id":42,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}

# Paste into BrowseryTools JSON Formatter → instantly readable:
{
  "id": 42,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "meta": {
    "created": "2024-01-01",
    "active": true
  }
}`}</code></pre>

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Formatador de JSON →</Link>

      <h2>Codificador / decodificador Base64</h2>

      <p>
        A codificação Base64 aparece em todo lugar: anexos de e-mail (MIME), incorporação de imagens em CSS, codificação de dados binários para APIs e armazenamento de credenciais em arquivos de configuração. A <Link href="/tools/base64">ferramenta Base64</Link> lida tanto com a codificação quanto com a decodificação, com suporte para Base64 padrão e variantes Base64 seguras para URL.
      </p>

      <h3>Quando você precisa dela</h3>
      <ul>
        <li>Decodificar um cabeçalho <code>Authorization: Basic ...</code> para ver o usuário:senha</li>
        <li>Codificar uma imagem para incorporá-la diretamente em uma <code>url()</code> de CSS ou em um atributo <code>src</code> de HTML</li>
        <li>Inspecionar valores de configuração codificados em Base64 em segredos do Kubernetes</li>
        <li>Codificar payloads binários para APIs REST que não aceitam bytes brutos</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Codificador/Decodificador Base64 →</Link>

      <h2>Decodificador de JWT</h2>

      <p>
        Os JSON Web Tokens são usados para autenticação em praticamente toda aplicação web moderna. Quando algo dá errado com a autenticação — um token expirado, uma claim ausente, uma audiência inesperada — você precisa inspecionar o token <em>agora mesmo</em>, não escrever um script para fazer isso.
      </p>

      <p>
        O <Link href="/tools/jwt-decoder">Decodificador de JWT</Link> aceita uma string JWT e exibe imediatamente o cabeçalho decodificado, o payload e o status de verificação da assinatura. Ele destaca o horário de expiração (claim <code>exp</code>), o horário de emissão (<code>iat</code>) e informa se o token está atualmente válido, expirado ou ainda não válido.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Nota de segurança:</strong> Nunca cole tokens JWT de produção em um decodificador de terceiros desconhecido — esses tokens representam sessões ativas de usuários. O BrowseryTools decodifica JWTs inteiramente no seu navegador usando operações de strings Base64. O token nunca sai do seu dispositivo, tornando-o a única escolha segura para inspecionar tokens de ambientes ao vivo.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Decodificador de JWT →</Link>

      <h2>Gerador de UUID</h2>

      <p>
        Os Identificadores Universalmente Únicos (UUIDs) são essenciais para chaves primárias de banco de dados, chaves de idempotência, IDs de correlação e o design de sistemas distribuídos. O <Link href="/tools/uuid-generator">Gerador de UUID</Link> produz UUIDs v4 criptograficamente aleatórios usando <code>crypto.randomUUID()</code> — a API nativa do navegador que produz identificadores adequadamente aleatórios, não pseudoaleatórios.
      </p>

      <h3>Casos de uso</h3>
      <ul>
        <li>Gerar IDs de banco de dados de teste durante o desenvolvimento sem acessar seu banco</li>
        <li>Criar chaves de idempotência para requisições de APIs de pagamento</li>
        <li>Gerar UUIDs em massa para dados de seed ou arquivos de fixtures</li>
        <li>Criar IDs de correlação para rastreamento distribuído durante a depuração</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Gerador de UUID →</Link>

      <h2>Gerador de hash</h2>

      <p>
        O hashing criptográfico é usado para checksums, armazenamento de senhas (nunca em texto puro!), armazenamento endereçável por conteúdo e verificação de integridade de dados. O <Link href="/tools/hash-generator">Gerador de Hash</Link> computa hashes MD5, SHA-1, SHA-256 e SHA-512 usando a API nativa <code>crypto.subtle.digest()</code> do navegador — a mesma implementação subjacente que o seu sistema operacional usa.
      </p>

      <h3>Quando os desenvolvedores recorrem a isso</h3>
      <ul>
        <li>Verificar o checksum de um arquivo baixado em relação ao hash publicado</li>
        <li>Computar o SHA-256 do corpo de uma requisição de API para o AWS Signature Version 4</li>
        <li>Gerar um valor de ETag para um recurso estático</li>
        <li>Criar um hash de conteúdo para invalidação de cache em pipelines de build</li>
        <li>Verificar se dois grandes blocos de texto são idênticos sem compará-los caractere por caractere</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Gerador de Hash →</Link>

      <h2>Testador de regex</h2>

      <p>
        As expressões regulares são poderosas e notoriamente difíceis de escrever corretamente sob pressão. O <Link href="/tools/regex-tester">Testador de Regex</Link> oferece um ambiente em tempo real: enquanto você digita seu padrão e sua string de teste, as correspondências são destacadas instantaneamente. Ele suporta todas as flags de regex do JavaScript (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>, <code>u</code>) e mostra os grupos capturados em uma visualização estruturada.
      </p>

      <h3>Exemplos práticos</h3>
      <ul>
        <li>Validar endereços de e-mail, números de telefone ou códigos postais para sanitização de entrada de formulários</li>
        <li>Escrever padrões de análise de logs para extração estruturada de logs</li>
        <li>Testar padrões de roteamento de URL antes de incorporá-los à configuração do Express ou do Next.js</li>
        <li>Elaborar padrões compatíveis com sed/awk sem um terminal</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Testador de Regex →</Link>

      <h2>Codificador / decodificador de URL</h2>

      <p>
        As URLs só podem conter um conjunto limitado de caracteres ASCII. Caracteres especiais — espaços, e comerciais, sinais de igual, texto não ASCII — precisam ser codificados por percentual. O <Link href="/tools/url-encoder">Codificador/Decodificador de URL</Link> lida com ambas as direções e distingue entre <code>encodeURI</code> (codifica uma URL completa, preservando os caracteres estruturais) e <code>encodeURIComponent</code> (codifica o valor de um parâmetro de URL, codificando tudo).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Codificador/Decodificador de URL →</Link>

      <h2>Conversor YAML ↔ JSON</h2>

      <p>
        Arquivos de configuração frequentemente vêm em YAML (manifests do Kubernetes, workflows do GitHub Actions, charts do Helm, Docker Compose), enquanto APIs e código trabalham com JSON. O <Link href="/tools/yaml-json">Conversor YAML ↔ JSON</Link> traduz entre os dois formatos instantaneamente, preservando tipos, estruturas aninhadas e a ordem dos arrays.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# YAML input (Kubernetes deployment snippet):
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api

// JSON output:
{
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "api" } },
    "template": { "metadata": { "labels": { "app": "api" } } }
  }
}`}</code></pre>

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Conversor YAML ↔ JSON →</Link>

      <h2>Analisador de expressões cron</h2>

      <p>
        As expressões cron são concisas, mas crípticas. Um único erro em um agendamento cron pode significar que uma tarefa roda a cada minuto em vez de uma vez por mês. O <Link href="/tools/cron-parser">Analisador de Cron</Link> traduz qualquer expressão cron para linguagem simples, mostra os próximos 10 horários de execução agendados e valida a expressão em relação aos formatos cron padrão e estendido.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Analisador de Cron →</Link>

      <h2>Conversor de bases numéricas</h2>

      <p>
        Programadores de sistemas, desenvolvedores embarcados e qualquer pessoa que trabalhe perto do hardware precisam regularmente converter entre binário, octal, decimal e hexadecimal. O <Link href="/tools/number-base-converter">Conversor de Bases Numéricas</Link> converte entre todas as quatro bases simultaneamente e lida tanto com entradas inteiras quanto com números grandes.
      </p>

      <h3>Cenários comuns</h3>
      <ul>
        <li>Converter endereços de memória de hex para decimal para comparação</li>
        <li>Entender valores de bitmask vendo-os em binário</li>
        <li>Decodificar permissões de arquivo Unix escritas em octal (<code>chmod 755</code> → binário <code>111 101 101</code>)</li>
        <li>Trabalhar com valores de cor: hex de HTML <code>#FF6B35</code> → componentes RGB em decimal</li>
        <li>Depurar sequências de bytes de protocolo em redes ou firmware embarcado</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Abrir Conversor de Bases Numéricas →</Link>

      {/* Summary table */}
      <h2>Referência rápida: todas as ferramentas para desenvolvedores em um relance</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Ferramenta</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Caso de uso principal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Tecnologia-chave</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Formatador de JSON", "Formatar, validar, minificar JSON", "JSON.parse / JSON.stringify"],
              ["Codificador/Decodificador Base64", "Codificar/decodificar strings Base64", "btoa() / atob()"],
              ["Decodificador de JWT", "Inspecionar cabeçalho, payload e expiração do JWT", "Análise de strings Base64"],
              ["Gerador de UUID", "Gerar UUIDs v4", "crypto.randomUUID()"],
              ["Gerador de Hash", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Testador de Regex", "Testar e depurar padrões de regex", "Motor RegExp do JavaScript"],
              ["Codificador/Decodificador de URL", "Codificar/decodificar componentes de URL", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Converter entre YAML e JSON", "biblioteca js-yaml (local)"],
              ["Analisador de Cron", "Explicar e validar expressões cron", "cron-parser (local)"],
              ["Conversor de Bases Numéricas", "Binário, octal, decimal, hex", "parseInt() / toString()"],
            ].map(([tool, use, tech], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{tool}</td>
                <td style={{padding: "11px 16px"}}>{use}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", opacity: 0.75}}>{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Por que o BrowseryTools em vez de pacotes npm ou APIs de nuvem?</h2>

      <p>
        A comparação honesta: quando você deve usar o BrowseryTools em vez de instalar um pacote ou chamar uma API?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Pacote npm</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Exige Node.js instalado</li>
            <li>Aumenta a árvore de dependências</li>
            <li>Possível risco na cadeia de suprimentos</li>
            <li>Melhor para: código de produção</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>API de nuvem</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Exige configuração de chave de API</li>
            <li>Limites de requisições se aplicam</li>
            <li>Os dados saem do seu dispositivo</li>
            <li>Melhor para: pipelines automatizados</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Zero configuração, funciona instantaneamente</li>
            <li>Sem dependências</li>
            <li>Os dados ficam locais</li>
            <li>Melhor para: tarefas manuais de desenvolvimento</li>
          </ul>
        </div>
      </div>

      <p>
        A resposta é: use o BrowseryTools para as <em>tarefas manuais, exploratórias e pontuais</em> que seriam exageradas para scriptar. Decodificar um JWT para depurar um problema de autenticação, formatar uma resposta de API para entender seu formato, gerar um UUID para um teste único — esses são exatamente os momentos em que uma ferramenta de navegador rápida e sem atrito economiza 10 minutos de configuração para um trabalho de 10 segundos.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Dica para desenvolvedores:</strong> Adicione <code>browserytools.com</code> aos favoritos junto com as ferramentas de desenvolvedor do seu navegador. Quando você está no meio de uma depuração e precisa decodificar, gerar hash, formatar ou converter algo rapidamente, ter essas ferramentas a uma aba de distância significa que você pode permanecer no fluxo em vez de mudar de contexto para escrever um script descartável.
      </div>

      <h2>Além das ferramentas para desenvolvedores: mais utilitários do BrowseryTools</h2>

      <p>
        O BrowseryTools cobre muito mais do que utilitários para desenvolvedores. A mesma abordagem com privacidade em primeiro lugar e sem envios se aplica a:
      </p>

      <ul>
        <li><strong>Ferramentas de imagem:</strong> <Link href="/tools/image-compression">Compressão de imagens</Link>, <Link href="/tools/bg-removal">remoção de fundo por IA</Link>, <Link href="/tools/image-resizer">redimensionamento</Link>, <Link href="/tools/image-converter">conversão de formato</Link></li>
        <li><strong>Ferramentas de texto:</strong> <Link href="/tools/markdown-editor">Editor de Markdown</Link>, <Link href="/tools/text-diff">comparação de texto</Link>, <Link href="/tools/text-case">conversor de maiúsculas/minúsculas</Link>, <Link href="/tools/lorem-ipsum">gerador de Lorem ipsum</Link></li>
        <li><strong>Ferramentas de segurança:</strong> <Link href="/tools/password-generator">Gerador de senhas</Link>, <Link href="/tools/password-strength">verificador de força de senha</Link>, <Link href="/tools/text-encryption">criptografia de texto</Link></li>
        <li><strong>Produtividade:</strong> <Link href="/tools/pomodoro">Cronômetro Pomodoro</Link>, <Link href="/tools/todo">lista de tarefas</Link>, <Link href="/tools/notepad">bloco de notas</Link>, <Link href="/tools/world-clock">relógio mundial</Link></li>
      </ul>

      {/* Inline SVG illustration */}
      <div style={{margin: "32px 0", textAlign: "center"}}>
        <svg width="320" height="80" viewBox="0 0 320 80" style={{maxWidth: "100%"}}>
          <rect x="0" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="30" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JSON</text>
          <rect x="65" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="95" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JWT</text>
          <rect x="130" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="160" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Regex</text>
          <rect x="195" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="225" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Hash</text>
          <rect x="260" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="290" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">UUID</text>
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">Tudo rodando localmente no seu navegador</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Comece a usar o BrowseryTools — Sem configuração necessária</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          Todas as 10 ferramentas para desenvolvedores acima — além de dezenas de outras — são gratuitas, instantâneas e não exigem conta, instalação nem configuração. Abra uma ferramenta e comece a trabalhar em menos de 3 segundos.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Abrir Formatador de JSON →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Explorar todas as ferramentas
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Ferramentas relacionadas: <Link href="/tools/json-formatter">Formatador de JSON</Link> · <Link href="/tools/jwt-decoder">Decodificador de JWT</Link> · <Link href="/tools/hash-generator">Gerador de Hash</Link> · <Link href="/tools/regex-tester">Testador de Regex</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">Gerador de UUID</Link> · <Link href="/tools/cron-parser">Analisador de Cron</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
