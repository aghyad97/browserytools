export default function Content() {
  return (
    <div>
      <p>
        Abra qualquer aplicação web moderna, inspecione uma requisição HTTP, dê uma olhada em um manifesto do Kubernetes ou espie
        dentro de um token JWT — o Base64 está em toda parte. É um daqueles esquemas de codificação fundamentais que os
        desenvolvedores encontram constantemente, mas raramente param para entender por completo. Este guia explica o que é o Base64,
        como ele funciona no nível dos bytes, onde é usado em sistemas do mundo real e quando você deve
        (e não deve) recorrer a ele.
      </p>
      <p>
        Você pode codificar e decodificar qualquer string Base64 instantaneamente usando o{" "}
        <a href="/tools/base64">Codificador/Decodificador Base64 do BrowseryTools</a> — gratuito, sem cadastro e sem que nada
        jamais saia do seu navegador.
      </p>

      <h2>Por que o Base64 existe?</h2>
      <p>
        Para entender o Base64, você precisa entender o problema que ele resolve. Nos primórdios da internet,
        muitos protocolos de comunicação — particularmente o e-mail — foram projetados em torno de texto ASCII de 7 bits. O ASCII define
        128 caracteres usando 7 bits por caractere. Dados binários (imagens, documentos, executáveis) usam todos os 8 bits
        por byte, produzindo valores de byte que não tinham representação em ASCII e que os sistemas mais antigos descartavam,
        corrompiam ou interpretavam como comandos de controle.
      </p>
      <p>
        O padrão MIME (Multipurpose Internet Mail Extensions), introduzido em 1991 para permitir que o e-mail transportasse
        anexos, precisava de uma maneira de transmitir dados binários arbitrários por esses canais limpos de 7 bits. A
        solução foi recodificar os dados binários usando apenas um subconjunto seguro de caracteres ASCII imprimíveis — um que
        todo sistema reconhecesse e transmitisse fielmente. O Base64 tornou-se a codificação padrão para esse
        propósito, e o nome descreve a abordagem: usar um conjunto de 64 caracteres seguros para representar quaisquer dados
        binários.
      </p>

      <h2>O alfabeto de 64 caracteres</h2>
      <p>
        O Base64 usa exatamente 64 caracteres, e é por isso que 6 bits de entrada podem sempre ser representados por um
        caractere Base64 (2<sup>6</sup> = 64). O alfabeto padrão definido na RFC 4648 é:
      </p>
      <ul>
        <li>Letras maiúsculas de <code>A</code> a <code>Z</code> — valores de 0 a 25</li>
        <li>Letras minúsculas de <code>a</code> a <code>z</code> — valores de 26 a 51</li>
        <li>Dígitos de <code>0</code> a <code>9</code> — valores de 52 a 61</li>
        <li><code>+</code> — valor 62</li>
        <li><code>/</code> — valor 63</li>
      </ul>
      <p>
        Um 65º caractere — o sinal de igual <code>=</code> — é usado como preenchimento (padding), mas não representa dados.
        O preenchimento garante que o comprimento da saída codificada seja sempre um múltiplo de 4 caracteres, o que simplifica
        a decodificação.
      </p>

      <h2>Como funciona a codificação Base64: 3 bytes → 4 caracteres</h2>
      <p>
        O Base64 funciona pegando 3 bytes de entrada (24 bits) e dividindo-os em quatro grupos de 6 bits. Cada
        grupo de 6 bits é mapeado para um caractere do alfabeto Base64. Como 3 bytes se tornam 4 caracteres, a codificação
        Base64 aumenta o tamanho dos dados em exatamente um terço (33%).
      </p>
      <p>
        Vamos percorrer um exemplo concreto: codificar a string ASCII <code>"Man"</code>.
      </p>
      <p>
        Passo 1 — Converta cada caractere para seu valor de byte ASCII e, então, para binário:
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Passo 2 — Concatene os 24 bits em um único fluxo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (concatenate all 24 bits)
010011 010110 000101 101110`}
      </pre>
      <p>
        Passo 3 — Mapeie cada grupo de 6 bits para o alfabeto Base64:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Grupo de 6 bits</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Valor decimal</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Caractere Base64</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A codificação Base64 de <code>"Man"</code> é <code>TWFu</code>. Você pode verificar isso usando a{" "}
        <a href="/tools/base64">ferramenta Base64 do BrowseryTools</a>. Quando o comprimento da entrada não é um múltiplo de 3,
        caracteres de preenchimento (<code>=</code> ou <code>==</code>) são acrescentados para levar a saída a um múltiplo
        de 4 caracteres. Por exemplo, <code>"Ma"</code> codifica para <code>TWE=</code> e <code>"M"</code>{" "}
        codifica para <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Equívoco comum:</strong> O Base64 é codificação, não criptografia. O processo é completamente
        reversível por qualquer pessoa, sem nenhuma chave ou senha. Ver dados codificados em Base64 em uma URL, cabeçalho ou
        arquivo não significa que esses dados estejam protegidos de forma alguma — é simplesmente uma representação diferente dos
        mesmos bytes. Qualquer pessoa que consiga copiar a string pode decodificá-la instantaneamente.
      </div>

      <h2>Casos de uso comuns</h2>

      <h3>Incorporar imagens em HTML e CSS</h3>
      <p>
        Em vez de fazer uma requisição HTTP separada para uma imagem ou ícone pequeno, você pode incorporá-lo diretamente
        no seu HTML ou CSS como uma data URI. O navegador decodifica a string Base64 e renderiza a imagem
        sem uma ida e volta à rede. Isso é útil para assets pequenos como favicons, indicadores de carregamento
        ou ícones embutidos em modelos de e-mail, onde o carregamento de URLs externas pode estar bloqueado.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* CSS example — embedding a small PNG icon */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Dados binários em APIs JSON</h3>
      <p>
        O JSON é um formato de texto. Se uma API precisa transmitir dados binários — um arquivo, uma chave criptográfica, uma
        assinatura, uma imagem — dentro de um payload JSON, ela não pode incluir bytes brutos. Codificar os dados binários em
        Base64 os transforma em uma string simples que o JSON pode carregar sem problemas. Muitas APIs que retornam conteúdo de
        arquivos, amostras de áudio ou imagens em respostas JSON usam essa abordagem.
      </p>

      <h3>Autenticação HTTP Basic</h3>
      <p>
        O esquema HTTP Basic Auth envia as credenciais no cabeçalho <code>Authorization</code> como uma codificação Base64
        de <code>username:password</code>. Por exemplo, as credenciais <code>admin:secret</code>{" "}
        tornam-se a string <code>YWRtaW46c2VjcmV0</code>, e o cabeçalho completo fica assim:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        Isso não é criptografado — é apenas codificado. O Basic Auth deve sempre ser usado sobre HTTPS, nunca sobre
        HTTP simples, porque as credenciais podem ser decodificadas trivialmente por qualquer pessoa que intercepte a requisição.
      </p>

      <h3>Payloads de JWT</h3>
      <p>
        Os JSON Web Tokens codificam seu cabeçalho e payload usando Base64URL (uma variante segura para URLs descrita abaixo).
        As claims do token — ID do usuário, tempo de expiração, papéis — são armazenadas no payload como um objeto JSON
        codificado em Base64URL. Novamente, isso não é criptografia: o payload é totalmente legível por qualquer pessoa que tenha o token.
      </p>

      <h3>Secrets do Kubernetes</h3>
      <p>
        O Kubernetes armazena os valores de Secret como strings codificadas em Base64 em manifestos YAML. Aqui está um exemplo real
        de um Secret do Kubernetes:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        Para descobrir o que esses valores realmente são, cole <code>YWRtaW4=</code> no{" "}
        <a href="/tools/base64">Decodificador Base64 do BrowseryTools</a>. O resultado é <code>admin</code>. Cole{" "}
        <code>cGFzc3dvcmQxMjM=</code> e você obtém <code>password123</code>. O Kubernetes codifica em Base64 os valores
        de secret para uma formatação YAML segura, não por segurança — a segurança de fato vem do RBAC do Kubernetes
        e da criptografia em repouso, não da codificação em si.
      </p>

      <h2>A variante Base64URL</h2>
      <p>
        O Base64 padrão usa dois caracteres que são especiais em URLs: <code>+</code> (que significa espaço na
        codificação de formulários) e <code>/</code> (que é um separador de caminho). Quando dados codificados em Base64 precisam
        aparecer em uma URL, parâmetro de consulta ou nome de arquivo, esses caracteres causam problemas.
      </p>
      <p>
        O Base64URL resolve isso substituindo:
      </p>
      <ul>
        <li><code>+</code> é substituído por <code>-</code> (hífen)</li>
        <li><code>/</code> é substituído por <code>_</code> (sublinhado)</li>
        <li>O preenchimento <code>=</code> ao final é frequentemente omitido</li>
      </ul>
      <p>
        O Base64URL é usado em JWTs, tokens OAuth e em qualquer contexto em que a string codificada deva sobreviver à
        transmissão por URL sem percent-encoding. A{" "}
        <a href="/tools/base64">ferramenta Base64 do BrowseryTools</a> suporta tanto a variante padrão quanto a segura para URLs.
      </p>

      <h2>Quando NÃO usar o Base64</h2>
      <p>
        O Base64 é a ferramenta certa em situações específicas, mas é frequentemente mal utilizado. Veja quando você deve
        evitá-lo:
      </p>
      <ul>
        <li>
          <strong>Arquivos grandes:</strong> O Base64 aumenta o tamanho dos dados em cerca de 33%. Uma imagem de 10 MB torna-se cerca de
          13,3 MB quando codificada em Base64. Incorporar arquivos grandes como data URIs ou strings Base64 em JSON deixa
          a análise mais lenta, aumenta o uso de memória e desperdiça banda. Use transferências diretas de arquivos ou URLs de
          armazenamento de objetos para qualquer coisa de tamanho não trivial.
        </li>
        <li>
          <strong>Segurança:</strong> Nunca use o Base64 como uma medida de segurança. Ele oferece zero confidencialidade.
          Se os dados forem sensíveis, use criptografia de verdade (AES-GCM, RSA, etc.).
        </li>
        <li>
          <strong>Armazenamento:</strong> Armazenar dados binários como Base64 em uma coluna de banco de dados desperdiça 33% mais
          espaço em comparação com armazenar os bytes brutos em uma coluna binária. Use tipos binários nativos do banco de dados
          (BYTEA no PostgreSQL, BLOB no MySQL) ao armazenar dados binários em escala.
        </li>
      </ul>

      <h2>Base64 vs codificação Hex: uma comparação</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Propriedade</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hex (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Conjunto de caracteres</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 caracteres)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 caracteres)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Acréscimo de tamanho</strong></td>
              <td style={{padding: "12px 16px"}}>~33% maior</td>
              <td style={{padding: "12px 16px"}}>~100% maior (2 caracteres por byte)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Legibilidade humana</strong></td>
              <td style={{padding: "12px 16px"}}>Baixa — não reconhecível</td>
              <td style={{padding: "12px 16px"}}>Moderada — legível no nível dos bytes</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Casos de uso comuns</strong></td>
              <td style={{padding: "12px 16px"}}>Anexos de e-mail, JWT, data URIs, payloads de API</td>
              <td style={{padding: "12px 16px"}}>Hashes criptográficos, checksums, códigos de cor, endereços MAC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Seguro para URLs?</strong></td>
              <td style={{padding: "12px 16px"}}>Apenas com a variante Base64URL</td>
              <td style={{padding: "12px 16px"}}>Sim — todos os caracteres são seguros para URLs</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Bits por caractere</strong></td>
              <td style={{padding: "12px 16px"}}>6 bits</td>
              <td style={{padding: "12px 16px"}}>4 bits</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Use o Base64 quando precisar de uma codificação compacta de binário para texto e a amplitude do conjunto de caracteres não criar
        problemas. Use hex quando a inspeção humana de valores individuais de byte importar — digests de hash, checksums
        e saídas criptográficas são tradicionalmente exibidos em hex precisamente porque cada caractere hex mapeia
        diretamente para 4 bits, tornando os limites entre bytes trivialmente visíveis.
      </p>

      <h2>Codificando e decodificando Base64 em código</h2>
      <p>
        A maioria das linguagens fornece suporte embutido a Base64. Aqui estão one-liners rápidos para ambientes comuns:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser or Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        Para uma codificação ou decodificação rápida e pontual sem escrever nenhum código, a{" "}
        <a href="/tools/base64">ferramenta Base64 do BrowseryTools</a> é a opção mais rápida — cole sua string,
        escolha codificar ou decodificar e o resultado aparece instantaneamente. Nada é enviado a um servidor.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Garantia de privacidade:</strong> O codificador e decodificador Base64 do BrowseryTools processa tudo
        localmente no seu navegador usando JavaScript. Se você estiver codificando dados sensíveis — chaves de API, secrets,
        configurações privadas — eles nunca tocam um servidor. Seus dados permanecem no seu dispositivo.
      </div>

      <h2>Codifique e decodifique Base64 instantaneamente</h2>
      <p>
        Seja decodificando um secret do Kubernetes, inspecionando um payload de JWT, criando uma data URI para uma
        imagem embutida ou apenas curioso sobre o que uma string Base64 contém — o{" "}
        <a href="/tools/base64">Codificador/Decodificador Base64 do BrowseryTools</a> resolve isso em um único clique.
        Cole sua entrada, obtenha sua saída. Sem anúncios, sem cadastro, sem que dados saiam do seu dispositivo.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Codificador / Decodificador Base64 gratuito — roda 100% no seu navegador
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir ferramenta Base64 →
        </a>
      </div>
    </div>
  );
}
