import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Se você já trabalhou com qualquer sistema de autenticação web moderno — OAuth 2.0, OpenID Connect ou uma
        API personalizada — você quase certamente já encontrou tokens JWT. Eles aparecem em cabeçalhos Authorization,
        em cookies, no local storage e em sessões de depuração às 2 da manhã, quando um fluxo de login está misteriosamente
        falhando. Entender o que um JWT realmente contém, como lê-lo e como identificar problemas comuns
        torna a depuração de autenticação drasticamente mais rápida.
      </p>
      <ToolCTA slug="jwt-decoder" variant="inline" />
      <p>
        O <a href="/tools/jwt-decoder">Decodificador de JWT do BrowseryTools</a> permite que você cole qualquer token JWT e
        veja instantaneamente seu cabeçalho, payload e status de expiração decodificados — tudo no seu navegador, com o token
        nunca saindo do seu dispositivo.
      </p>

      <h2>O que é um JWT?</h2>
      <p>
        JWT significa JSON Web Token, definido na RFC 7519. Um JWT é um token compacto e seguro para URLs que codifica
        um conjunto de claims — afirmações sobre um sujeito, tipicamente um usuário — em um formato que pode ser verificado
        e confiável. A propriedade-chave de um JWT é que ele é <em>autocontido</em>: o próprio token
        carrega todas as informações de que um servidor precisa para autenticar uma requisição, sem uma consulta ao banco de dados.
      </p>
      <p>
        Um JWT se parece com isto:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfODQyMTkiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImVkaXRvciJdLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImlhdCI6MTczODM2ODAwMCwiZXhwIjoxNzM4MzcxNjAwLCJqdGkiOiI3ZjNhOWI0Yy0xZDJlLTQ1NmYtYWJjZC04OTAxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </pre>
      <p>
        À primeira vista, parece algo sem sentido. Mas tem uma estrutura muito precisa: três seções codificadas
        em Base64URL separadas por pontos. Cada seção tem um propósito específico.
      </p>

      <h2>A estrutura de três partes: Cabeçalho.Payload.Assinatura</h2>

      <h3>Parte 1: O cabeçalho</h3>
      <p>
        O primeiro segmento, antes do primeiro ponto, é o <strong>cabeçalho</strong>. É um objeto JSON codificado em Base64URL
        que descreve o tipo do token e o algoritmo de assinatura. Decodificado, o cabeçalho do
        exemplo acima fica assim:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </pre>
      <p>
        O campo <code>alg</code> especifica o algoritmo de assinatura. Valores comuns que você encontrará são:
      </p>
      <ul>
        <li>
          <strong>HS256</strong> — HMAC com SHA-256. Usa uma chave secreta compartilhada. Tanto o emissor quanto o verificador
          devem ter o mesmo segredo. Comum em aplicações monolíticas.
        </li>
        <li>
          <strong>RS256</strong> — Assinatura RSA com SHA-256. Usa um par de chaves pública/privada. O emissor
          assina com a chave privada; os verificadores conferem com a chave pública. Comum em sistemas distribuídos
          e provedores OAuth.
        </li>
        <li>
          <strong>ES256</strong> — ECDSA com P-256 e SHA-256. Como o RS256, mas usando curvas elípticas —
          chaves mais curtas, mesmo nível de segurança. Preferido em sistemas modernos de alto desempenho.
        </li>
        <li>
          <strong>none</strong> — Sem assinatura. Nunca aceite isto em produção. Uma vulnerabilidade de segurança
          notória surge quando os servidores aceitam tokens não assinados porque o cliente alterou o <code>alg</code>{" "}
          para <code>"none"</code>.
        </li>
      </ul>

      <h3>Parte 2: O payload</h3>
      <p>
        O segundo segmento é o <strong>payload</strong> — os dados de fato que o token carrega. Ele também é
        um objeto JSON codificado em Base64URL. O payload decodificado do nosso exemplo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "sub": "usr_84219",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "roles": ["user", "editor"],
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "iat": 1738368000,
  "exp": 1738371600,
  "jti": "7f3a9b4c-1d2e-456f-abcd-890123456789"
}`}
      </pre>
      <p>
        O payload contém dois tipos de claims: as <strong>claims registradas</strong> definidas pela especificação
        do JWT e as <strong>claims privadas/personalizadas</strong> adicionadas pela sua aplicação (como
        <code>name</code>, <code>email</code> e <code>roles</code> acima).
      </p>

      <h3>Parte 3: A assinatura</h3>
      <p>
        O terceiro segmento é a <strong>assinatura</strong>. Ela é calculada pegando o cabeçalho codificado em
        Base64URL, um ponto, o payload codificado em Base64URL e assinando o resultado com o algoritmo e a chave
        especificados no cabeçalho. Para o HS256:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}
      </pre>
      <p>
        A assinatura garante a integridade: se alguém modificar até um único caractere no cabeçalho ou no payload
        depois que o token é emitido, a assinatura se torna inválida e a verificação falha. Sem conhecer o
        segredo de assinatura (ou a chave privada do emissor para RS256/ES256), um atacante não consegue forjar um token válido.
      </p>

      <h2>Referência de claims padrão do JWT</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Claim</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Nome completo</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iss</code></td>
              <td style={{padding: "10px 16px"}}>Issuer (Emissor)</td>
              <td style={{padding: "10px 16px"}}>Quem emitiu o token (por exemplo, a URL do seu servidor de autenticação)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>sub</code></td>
              <td style={{padding: "10px 16px"}}>Subject (Sujeito)</td>
              <td style={{padding: "10px 16px"}}>Sobre quem é o token — tipicamente o ID único do usuário</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>aud</code></td>
              <td style={{padding: "10px 16px"}}>Audience (Audiência)</td>
              <td style={{padding: "10px 16px"}}>Para qual(is) serviço(s) o token se destina</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>exp</code></td>
              <td style={{padding: "10px 16px"}}>Expiration Time (Tempo de expiração)</td>
              <td style={{padding: "10px 16px"}}>Timestamp Unix após o qual o token deve ser rejeitado</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iat</code></td>
              <td style={{padding: "10px 16px"}}>Issued At (Emitido em)</td>
              <td style={{padding: "10px 16px"}}>Timestamp Unix de quando o token foi criado</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>nbf</code></td>
              <td style={{padding: "10px 16px"}}>Not Before (Não antes de)</td>
              <td style={{padding: "10px 16px"}}>O token não é válido antes deste timestamp Unix</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>jti</code></td>
              <td style={{padding: "10px 16px"}}>JWT ID</td>
              <td style={{padding: "10px 16px"}}>Identificador único do token — usado para evitar ataques de repetição</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Por que a claim exp é fundamental</h2>
      <p>
        A claim <code>exp</code> é um timestamp Unix — o número de segundos desde 1º de janeiro de 1970 (UTC).
        No nosso exemplo, <code>"exp": 1738371600</code>. Para converter isso em uma data legível por humanos, você pode usar
        JavaScript:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`new Date(1738371600 * 1000).toUTCString()
// → "Sat, 01 Feb 2026 01:00:00 GMT"`}
      </pre>
      <p>
        A expiração do JWT é a primeira coisa a verificar quando um token está sendo rejeitado. Um token que era válido ontem
        falhará hoje se seu <code>exp</code> estiver no passado — isso é por design. Tokens de vida curta (de 15
        minutos a 1 hora) limitam a janela de dano caso um token seja roubado. Tokens de vida mais longa (dias ou
        semanas) são mais convenientes, mas mais perigosos se comprometidos.
      </p>
      <p>
        O <a href="/tools/jwt-decoder">Decodificador de JWT do BrowseryTools</a> lê automaticamente as claims <code>exp</code>{" "}
        e <code>iat</code> e as exibe como datas legíveis por humanos junto com os timestamps Unix brutos,
        para que você nunca precise fazer a conta de cabeça manualmente.
      </p>

      <h2>Cenários comuns de depuração de JWT</h2>

      <h3>Token expirado (401 Unauthorized)</h3>
      <p>
        O erro de JWT mais comum. O servidor rejeitou o token porque o horário atual passou do
        valor de <code>exp</code>. Solução: implemente um fluxo de renovação de token usando um refresh token de vida mais longa
        ou simplesmente reautentique. Cole o token no decodificador para confirmar exatamente quando ele expirou.
      </p>

      <h3>Audiência errada</h3>
      <p>
        Se a sua API valida a claim <code>aud</code> e o token foi emitido para uma audiência diferente
        (por exemplo, um token emitido para <code>https://api-staging.example.com</code> sendo enviado para{" "}
        <code>https://api.example.com</code>), o servidor o rejeitará. Decodifique o token e inspecione o campo
        <code>aud</code> para confirmar que ele corresponde ao que o serviço receptor espera.
      </p>

      <h3>Incompatibilidade de algoritmo</h3>
      <p>
        Se o seu servidor espera RS256 mas recebe um token assinado com HS256 (ou vice-versa), a validação
        falha. Isso pode acontecer durante a rotação de chaves ou ao trocar de provedor de autenticação. Verifique o campo <code>alg</code>{" "}
        no cabeçalho decodificado em relação ao que o seu servidor está configurado para aceitar.
      </p>

      <h3>Assinatura inválida</h3>
      <p>
        Se o payload foi adulterado — mesmo que um único caractere tenha sido alterado — a assinatura não vai
        corresponder. Isso também acontece se você estiver usando o segredo errado ou a chave pública errada para verificar.
        Decodificar o cabeçalho e o payload (o que não requer segredo) permite que você pelo menos inspecione o que o token
        afirma, mesmo que não consiga verificar sua autenticidade no lado do cliente.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Aviso de segurança — o payload não é criptografado:</strong> O payload do JWT é codificado em Base64URL,
        não criptografado. Qualquer pessoa que tenha a string do token pode decodificar o cabeçalho e o payload sem nenhuma chave
        ou segredo. Nunca armazene informações sensíveis em um payload de JWT — sem senhas, dados de cartões de pagamento,
        números de identidade ou chaves privadas. Trate o payload como dados de leitura pública que são apenas
        à prova de adulteração, não confidenciais.
      </div>

      <h2>JWT vs tokens de sessão: quando usar cada um</h2>
      <p>
        Os JWTs e os tokens de sessão tradicionais resolvem o mesmo problema — identificar um usuário autenticado ao longo de
        várias requisições — mas fazem isso de forma diferente, e nenhum é universalmente melhor.
      </p>
      <p>
        Os <strong>tokens de sessão tradicionais</strong> são strings aleatórias opacas (por exemplo, um UUID) armazenadas no lado do servidor
        em um repositório de sessões (Redis, banco de dados). A cada requisição, o servidor consulta o token no repositório e
        recupera os dados do usuário. O servidor tem total controle: invalidar uma sessão revoga o acesso imediatamente.
      </p>
      <p>
        Os <strong>JWTs</strong> são stateless (sem estado). O servidor emite um token assinado e não mantém registro dele.
        A cada requisição, o servidor verifica a assinatura e confia nas claims sem nenhuma consulta ao banco de dados.
        Isso escala horizontalmente sem estado compartilhado — qualquer servidor com a chave de verificação pode autenticar
        a requisição. A contrapartida: você não consegue revogar um JWT imediatamente antes de ele expirar (a menos que implemente
        uma lista de bloqueio de tokens, o que reintroduz estado).
      </p>
      <ul>
        <li>Use <strong>JWTs</strong> para microsserviços stateless, sistemas distribuídos, APIs móveis e
        autenticação entre domínios (fluxos OAuth/OIDC). Mantenha os tempos de expiração curtos.</li>
        <li>Use <strong>tokens de sessão</strong> quando você precisar de capacidade de revogação imediata (logout,
        suspensão de conta, incidentes de segurança) ou quando todos os seus serviços compartilharem um repositório de sessões rápido.</li>
      </ul>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Regra de segurança crítica:</strong> Sempre verifique as assinaturas de JWT no lado do servidor usando uma chave
        confiável. Nunca dependa apenas da verificação no lado do cliente. Um cliente pode decodificar o payload de qualquer JWT sem
        um segredo — mas só o servidor, que detém a chave correta, pode determinar se a assinatura é
        genuína e o token pode ser confiável. A decodificação no lado do cliente só é útil para <em>ler</em>{" "}
        claims (como mostrar o nome do usuário em uma interface), nunca para tomar decisões de autorização.
      </div>

      <h2>Como usar o Decodificador de JWT do BrowseryTools</h2>
      <p>
        Abra o <a href="/tools/jwt-decoder">Decodificador de JWT</a> e cole seu token no campo de entrada.
        A ferramenta divide o token imediatamente nos dois pontos e exibe:
      </p>
      <ul>
        <li>
          <strong>Painel do cabeçalho:</strong> O JSON decodificado mostrando <code>alg</code>, <code>typ</code> e
          quaisquer outros campos do cabeçalho. Útil para identificar o algoritmo de assinatura rapidamente.
        </li>
        <li>
          <strong>Painel do payload:</strong> O JSON decodificado completo com todas as claims. Os timestamps são exibidos
          tanto no formato Unix bruto quanto em datas UTC legíveis por humanos, para que você veja a expiração imediatamente sem
          conversão mental.
        </li>
        <li>
          <strong>Status de expiração:</strong> Um indicador claro mostrando se o token está atualmente válido,
          já expirado ou ainda não ativo (com base em <code>nbf</code>). Se expirado, você vê exatamente há quanto
          tempo ele expirou.
        </li>
        <li>
          <strong>Segmento da assinatura:</strong> A assinatura bruta codificada em Base64URL, exibida para referência.
          A ferramenta não verifica a assinatura (isso requer o segredo ou a chave pública), mas decodifica
          e exibe todas as informações de que você precisa para a depuração.
        </li>
      </ul>
      <p>
        Não há envio de formulário, nenhuma requisição ao servidor, nenhum acesso à área de transferência além do que você cola explicitamente.
        A análise do token acontece inteiramente em JavaScript rodando na aba do seu navegador.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Seus tokens permanecem privados:</strong> Os tokens JWT frequentemente contêm IDs de usuário, endereços de e-mail,
        papéis e outros dados pessoais. O Decodificador de JWT do BrowseryTools processa seu token inteiramente no seu
        navegador — ele nunca é enviado a qualquer servidor, nunca é registrado e nunca é armazenado. Você pode colar com segurança
        tokens de produção para inspecioná-los sem se preocupar com exposição. Quando você fecha a aba, ele desaparece.
      </div>

      <h2>Decodifique seu token JWT agora</h2>
      <p>
        Seja depurando um token expirado, inspecionando claims de um provedor OAuth, verificando quais
        papéis foram concedidos a um usuário ou simplesmente tentando entender o que o seu sistema de autenticação está
        de fato emitindo — o <a href="/tools/jwt-decoder">Decodificador de JWT do BrowseryTools</a> dá a você as
        respostas instantaneamente. Sem registro, sem extensões para instalar, sem dados enviados para lugar nenhum.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Decodificador de JWT gratuito — instantâneo, privado, sem cadastro
        </p>
        <a
          href="/tools/jwt-decoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Decodificador de JWT →
        </a>
      </div>
      <ToolCTA slug="jwt-decoder" variant="card" />
    </div>
  );
}
