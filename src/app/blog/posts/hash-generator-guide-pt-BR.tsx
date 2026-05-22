export default function Content() {
  return (
    <div>
      <p>
        Toda vez que você baixa uma versão de software, verifica a autenticidade de um arquivo, assina um token JWT ou armazena a
        senha de um usuário, uma função de hash criptográfico está trabalhando nos bastidores. As funções de hash são uma das
        primitivas fundamentais da segurança computacional moderna — e, ainda assim, as diferenças entre MD5, SHA-1,
        SHA-256 e SHA-512 são amplamente mal compreendidas, levando a erros de segurança reais em sistemas de produção.
      </p>
      <p>
        Este guia explica o que são as funções de hash, como cada algoritmo principal funciona, quando cada um é apropriado
        (e quando é perigosamente inapropriado) e como usar o{" "}
        <a href="/tools/hash-generator">Gerador de Hash do BrowseryTools</a> para calcular hashes instantaneamente no seu
        navegador com total privacidade.
      </p>

      <h2>O que é uma função de hash criptográfico?</h2>
      <p>
        Uma função de hash criptográfico recebe uma entrada de comprimento arbitrário e produz uma saída de comprimento fixo
        chamada de digest ou hash. Quatro propriedades definem uma boa função de hash criptográfico:
      </p>
      <ul>
        <li>
          <strong>Determinística:</strong> A mesma entrada sempre produz exatamente a mesma saída. As funções de hash
          não têm estado interno — dados os mesmos bytes, você sempre obtém o mesmo digest.
        </li>
        <li>
          <strong>De mão única (resistência à pré-imagem):</strong> Dada uma saída de hash, deve ser computacionalmente
          inviável recuperar a entrada original. As funções de hash são projetadas para serem fáceis de calcular em uma
          direção e efetivamente impossíveis de reverter.
        </li>
        <li>
          <strong>Comprimento de saída fixo:</strong> Independentemente de a entrada ter um byte ou um gigabyte,
          a saída tem sempre o mesmo comprimento. O SHA-256 sempre produz um digest de 256 bits (32 bytes).
        </li>
        <li>
          <strong>Efeito avalanche:</strong> Uma mudança de um único bit na entrada transforma completamente a saída.
          O hash de <code>hello</code> não se parece em nada com o hash de <code>hello!</code> — eles compartilham zero
          estrutura previsível. Isso torna os hashes úteis como impressões digitais.
        </li>
      </ul>
      <p>
        Uma quinta propriedade — a resistência a colisões — separa os hashes criptograficamente fortes dos quebrados:
        deve ser computacionalmente inviável encontrar duas entradas diferentes que produzam a mesma saída.
        É aqui que o MD5 e o SHA-1 falharam.
      </p>

      <h2>MD5: rápido, onipresente e quebrado para segurança</h2>
      <p>
        O MD5 (Message Digest 5) foi projetado por Ron Rivest e publicado em 1991. Ele produz um digest de 128 bits (16 bytes),
        tipicamente representado como uma string hexadecimal de 32 caracteres, como{" "}
        <code>5d41402abc4b2a76b9719d911017c592</code>. Por mais de uma década, foi o algoritmo de hash dominante
        para tudo, de checksums de arquivos a armazenamento de senhas.
      </p>
      <p>
        Em 2004, criptógrafos demonstraram ataques de colisão práticos contra o MD5. Em 2008, pesquisadores haviam
        usado ataques de colisão para forjar um certificado de autoridade certificadora falso, confiável por todos os principais navegadores.
        O MD5 está agora definitivamente quebrado para qualquer propósito de segurança em que a resistência a colisões importe.
      </p>
      <p>
        Onde o MD5 ainda é aceitável:
      </p>
      <ul>
        <li>Verificações de integridade de arquivos sem fins de segurança, em que você controla tanto a geração quanto a verificação (confirmar que um arquivo não foi corrompido em trânsito, não que ele não foi adulterado).</li>
        <li>Checksums em sistemas internos em que um agente mal-intencionado não está no modelo de ameaças.</li>
        <li>Compatibilidade com sistemas legados, onde você não tem escolha a não ser corresponder a uma implementação existente.</li>
        <li>Chaves de cache e mapas de hash, em que a segurança é irrelevante e a velocidade importa.</li>
      </ul>
      <p>
        Onde o MD5 nunca deve ser usado: certificados TLS, assinaturas digitais, assinatura de código ou qualquer coisa em que
        um atacante possa se beneficiar de encontrar uma colisão.
      </p>

      <h2>SHA-1: 160 bits, descontinuado, ainda em toda parte</h2>
      <p>
        O SHA-1 (Secure Hash Algorithm 1) foi publicado pelo NIST em 1995 e produz um digest de 160 bits. Foi
        o padrão para certificados TLS, assinaturas digitais e assinatura de software ao longo dos anos 2000.
        O Project Zero do Google demonstrou uma colisão prática de SHA-1 em 2017 (o ataque SHAttered), produzindo
        dois arquivos PDF diferentes com hashes SHA-1 idênticos. Isso encerrou o uso do SHA-1 em TLS — todos os principais
        fornecedores de navegadores pararam de aceitar certificados SHA-1 naquele mesmo ano.
      </p>
      <p>
        O SHA-1 ainda é encontrado em alguns lugares notáveis:
      </p>
      <ul>
        <li>
          <strong>Git:</strong> O Git historicamente usou o SHA-1 para identificar cada objeto em um repositório —
          commits, blobs, trees e tags. O Git está migrando ativamente para o SHA-256 (veja abaixo), mas repositórios
          Git em SHA-1 continuam extremamente comuns. Para esse caso de uso, a resistência a colisões importa menos porque
          um atacante precisaria de acesso ao sistema de arquivos para explorar uma colisão.
        </li>
        <li>Sistemas de autenticação legados e implementações de HMAC mais antigas.</li>
        <li>Alguns softwares corporativos mais antigos que não foram atualizados.</li>
      </ul>
      <p>
        Para qualquer trabalho novo: evite o SHA-1. Use SHA-256 ou SHA-512.
      </p>

      <h2>SHA-256: o padrão atual</h2>
      <p>
        O SHA-256 faz parte da família SHA-2, publicada pelo NIST em 2001. Ele produz um digest de 256 bits (32 bytes)
        — o dobro do comprimento de saída do MD5 e 60% maior que o SHA-1. Nenhum ataque prático de colisão ou de pré-imagem
        contra o SHA-256 foi demonstrado. Ele continua sendo o padrão para hashing sensível à segurança em 2026.
      </p>
      <p>
        O SHA-256 é usado em toda parte:
      </p>
      <ul>
        <li><strong>Certificados TLS:</strong> O CA/Browser Forum determinou o SHA-256 como o mínimo para assinaturas de certificados. Toda conexão HTTPS que você faz é ancorada pelo SHA-256.</li>
        <li><strong>Assinatura de código:</strong> O macOS, o Windows Authenticode e os gerenciadores de pacotes do Linux (APT, RPM) usam SHA-256 para verificar a integridade do software.</li>
        <li><strong>Tokens JWT:</strong> O algoritmo <code>HS256</code> nos JSON Web Tokens é HMAC-SHA-256. É de longe o algoritmo de assinatura de JWT mais comum em sistemas implantados.</li>
        <li><strong>Bitcoin:</strong> O algoritmo de prova de trabalho do Bitcoin é o SHA-256 duplo (SHA-256 aplicado duas vezes).</li>
        <li><strong>Git (próxima geração):</strong> O formato de objeto SHA-256 do Git (ativado com <code>--object-format=sha256</code>) usa SHA-256 para todos os IDs de objeto.</li>
        <li>Verificação de integridade de arquivos publicada junto aos downloads de software.</li>
      </ul>
      <p>
        Se você precisa escolher uma função de hash e não tem restrições específicas, o SHA-256 é a escolha padrão
        correta em 2026.
      </p>

      <h2>SHA-512: saída maior, às vezes mais rápida</h2>
      <p>
        O SHA-512 também faz parte da família SHA-2 e produz um digest de 512 bits (64 bytes). Ele oferece uma
        margem de segurança maior do que o SHA-256 — 512 bits de saída significam que o espaço teórico do ataque de força bruta
        é 2<sup>256</sup> vezes maior. Na prática, essa margem adicional é irrelevante para a maioria das
        aplicações, já que o SHA-256 já é computacionalmente inviável de quebrar.
      </p>
      <p>
        A característica de desempenho contraintuitiva: o SHA-512 é <em>mais rápido</em> do que o SHA-256 em CPUs
        modernas de 64 bits ao gerar hash de grandes volumes de dados. O SHA-512 processa dados em blocos de 1024 bits com operações
        de palavra de 64 bits, enquanto o SHA-256 usa blocos de 512 bits com operações de 32 bits. Em um processador de 64 bits, as
        operações de 64 bits mapeiam de forma mais eficiente para o hardware. Isso torna o SHA-512 a escolha preferida para
        aplicações que geram hash de arquivos grandes em servidores de 64 bits.
      </p>
      <p>
        Use o SHA-512 quando:
      </p>
      <ul>
        <li>Você está gerando hash de grandes volumes de dados em hardware de 64 bits e quer máxima taxa de transferência.</li>
        <li>Seu sistema exige a margem de segurança adicional por motivos regulatórios ou de conformidade.</li>
        <li>Você está implementando HMAC-SHA-512 (usado em algumas implementações de JWT com <code>HS512</code>).</li>
      </ul>

      <h2>Tabela de comparação de algoritmos</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Algoritmo</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Comprimento da saída</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Velocidade (relativa)</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Status de segurança</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Casos de uso comuns</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>MD5</strong></td>
              <td style={{padding: "12px 16px"}}>128 bits (32 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>O mais rápido</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Quebrado</strong> — colisões demonstradas</td>
              <td style={{padding: "12px 16px"}}>Checksums sem fins de segurança, chaves de cache, sistemas legados</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-1</strong></td>
              <td style={{padding: "12px 16px"}}>160 bits (40 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>Rápido</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Descontinuado</strong> — existem colisões práticas</td>
              <td style={{padding: "12px 16px"}}>Git legado, TLS antigo (descontinuado), alguma autenticação legada</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-256</strong></td>
              <td style={{padding: "12px 16px"}}>256 bits (64 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>Rápido</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Seguro</strong> — padrão atual</td>
              <td style={{padding: "12px 16px"}}>Certificados TLS, JWT (HS256), assinatura de código, Bitcoin</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-512</strong></td>
              <td style={{padding: "12px 16px"}}>512 bits (128 caracteres hex)</td>
              <td style={{padding: "12px 16px"}}>O mais rápido em 64 bits para grandes volumes de dados</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Seguro</strong> — margem de segurança maior</td>
              <td style={{padding: "12px 16px"}}>Hash de arquivos grandes, JWT (HS512), aplicações de alta segurança</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Verificação de integridade de arquivos: um exemplo prático</h2>
      <p>
        Um dos usos mais comuns e legítimos dos hashes criptográficos é verificar que um arquivo baixado
        é exatamente o que o publicador pretendia — não corrompido em trânsito e não adulterado por terceiros.
        A maioria dos grandes projetos de software publica checksums SHA-256 junto aos seus downloads.
      </p>
      <p>
        O fluxo de trabalho se parece com isto:
      </p>
      <ul>
        <li>Baixe o arquivo da fonte oficial.</li>
        <li>Baixe o checksum publicado da mesma fonte oficial (idealmente assinado com PGP).</li>
        <li>Calcule o hash SHA-256 do arquivo baixado.</li>
        <li>Compare o hash que você calculou com o hash publicado, caractere por caractere. Qualquer diferença significa que o arquivo não é o que o publicador distribuiu.</li>
      </ul>
      <p>
        O <a href="/tools/hash-generator">Gerador de Hash do BrowseryTools</a> suporta hash de arquivos — arraste
        um arquivo e ele calculará o hash localmente no seu navegador sem enviar nada. Compare o
        resultado diretamente com o checksum publicado.
      </p>

      <h2>Armazenamento de senhas: a única coisa que os hashes não conseguem fazer com segurança</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem", color: "#dc2626"}}>
          Aviso crítico: nunca armazene senhas usando funções de hash comuns
        </p>
        <p style={{marginTop: 0, marginBottom: "12px"}}>
          Armazenar senhas como hashes MD5, SHA-256 ou SHA-512 — mesmo com um salt — é inseguro e uma
          vulnerabilidade séria em qualquer sistema de produção. Veja por quê:
        </p>
        <ul style={{marginTop: 0, marginBottom: "12px"}}>
          <li>As funções de hash de propósito geral são projetadas para serem <em>rápidas</em>. Uma GPU moderna consegue calcular bilhões de hashes SHA-256 por segundo. Se o seu banco de dados for violado, um atacante pode quebrar por força bruta todas as senhas comuns em minutos.</li>
          <li>As rainbow tables — tabelas de consulta pré-computadas que mapeiam hashes para entradas — conseguem quebrar hashes sem salt de senhas comuns em milissegundos.</li>
          <li>Mesmo com um salt único por usuário, a pura velocidade do SHA-256 facilita o ataque a senhas fracas ou de força média em escala.</li>
        </ul>
        <p style={{marginTop: 0, marginBottom: 0}}>
          <strong>Use uma função de hash de senhas em vez disso:</strong> <code>bcrypt</code>, <code>scrypt</code>
          ou <code>Argon2</code> (o vencedor da Password Hashing Competition). Estas são deliberadamente lentas
          e intensivas em memória, tornando os ataques de força bruta ordens de magnitude mais caros. A maioria dos frameworks
          modernos os inclui por padrão. O Argon2id é a recomendação atual para novos sistemas.
        </p>
      </div>

      <h2>Como o Git usa o SHA-1 (e está migrando para o SHA-256)</h2>
      <p>
        O Git usa uma função de hash para identificar cada objeto em um repositório. Cada commit, arquivo (blob), listagem
        de diretório (tree) e tag é armazenado no banco de dados de objetos sob seu hash SHA-1. Quando você executa{" "}
        <code>git log</code>, as longas strings hexadecimais que você vê — como{" "}
        <code>c206f4b3a9d72bc0e53a0e1a6e4bdf8c7f9d2e51</code> — são hashes SHA-1 dos objetos de commit.
      </p>
      <p>
        O Git escolheu o SHA-1 em 2005 por velocidade e porque, na época, o SHA-1 não estava quebrado. O papel dos hashes
        no Git é ligeiramente diferente do uso tradicional de segurança: o Git os usa como chaves de armazenamento
        endereçáveis por conteúdo, não como provas de autenticação. O conteúdo em si é o que você confia — o hash é apenas uma
        forma eficiente de localizá-lo e detectar corrupção acidental.
      </p>
      <p>
        Após a colisão SHAttered de SHA-1 em 2017, o projeto Git começou a trabalhar na transição para o SHA-256.
        O novo formato de objeto (<code>--object-format=sha256</code>) está disponível no Git 2.29+ e é usado por
        padrão em alguns novos provedores de hospedagem de repositórios. Repositórios existentes podem ser migrados, embora a transição seja
        complexa porque cada ID de objeto muda.
      </p>

      <h2>HMAC: autenticação de mensagens baseada em hash</h2>
      <p>
        Um hash simples verifica a integridade dos dados (os dados não mudaram), mas não a autenticidade (os dados vieram
        de quem você acha que vieram). Se um atacante puder interceptar uma mensagem e recalcular o hash após
        modificá-la, um hash simples não oferece proteção alguma.
      </p>
      <p>
        O HMAC (Hash-based Message Authentication Code) resolve isso incorporando uma chave secreta ao
        cálculo do hash. O resultado só pode ser produzido por alguém que conheça a chave. Verificar um HMAC
        prova tanto que os dados estão intactos quanto que foram produzidos por uma parte com acesso ao
        segredo compartilhado.
      </p>
      <p>
        O HMAC-SHA256 está em toda parte:
      </p>
      <ul>
        <li><strong>Tokens JWT (HS256):</strong> O servidor assina o cabeçalho e o payload do token com HMAC-SHA256 usando uma chave secreta. Os clientes não conseguem forjar tokens válidos sem a chave.</li>
        <li><strong>Assinatura de requisições de API:</strong> O AWS Signature Version 4 usa HMAC-SHA256 para autenticar requisições de API. Os detalhes da requisição e uma chave de assinatura derivada são processados em hash juntos, de modo que nenhum deles pode ser modificado sem invalidar a assinatura.</li>
        <li><strong>Integridade de cookies:</strong> Muitos frameworks web usam HMAC para assinar cookies de sessão, impedindo que os usuários adulterem seus próprios dados de sessão.</li>
      </ul>

      <h2>Como usar o Gerador de Hash do BrowseryTools</h2>
      <p>
        O <a href="/tools/hash-generator">Gerador de Hash</a> suporta a geração de hash tanto de entrada de texto quanto de uploads
        de arquivos inteiramente no seu navegador. Veja como funciona:
      </p>
      <ul>
        <li>
          <strong>Hash de texto:</strong> Cole qualquer texto no campo de entrada. A ferramenta calcula imediatamente
          e exibe o hash para cada algoritmo suportado simultaneamente — MD5, SHA-1, SHA-256 e
          SHA-512 — para que você possa compará-los lado a lado e escolher o que precisa.
        </li>
        <li>
          <strong>Hash de arquivos:</strong> Clique na entrada de arquivo ou arraste e solte qualquer arquivo. O arquivo é lido
          pela File API do seu navegador e tem o hash calculado localmente. Arquivos grandes são processados em pedaços para evitar pressão
          de memória. Nenhum byte do seu arquivo sai do seu dispositivo.
        </li>
        <li>
          <strong>Escolha o algoritmo:</strong> Selecione o algoritmo específico em que se concentrar para o seu caso de uso.
          O digest hexadecimal completo é exibido e pode ser copiado com um clique.
        </li>
        <li>
          <strong>Baixar como arquivo:</strong> Para fins de documentação ou distribuição, exporte o digest do hash
          como um arquivo de texto — útil para publicar checksums junto às suas próprias versões de software.
        </li>
      </ul>

      <h2>Privacidade: a Web Crypto API</h2>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tudo permanece no seu dispositivo.</strong> O Gerador de Hash do BrowseryTools usa a API
        embutida do navegador <code>window.crypto.subtle</code> (a Web Crypto API) para calcular hashes da família SHA.
        Essa é a criptografia nativa implementada pelo motor C++ do seu navegador — não matemática em JavaScript. Para o MD5,
        uma implementação em JavaScript puro roda localmente. Em ambos os casos, nenhum dado — nem um único byte do seu
        texto ou do conteúdo do seu arquivo — é jamais transmitido aos servidores do BrowseryTools nem a qualquer serviço de terceiros.
        O cálculo do hash acontece inteiramente dentro do processo do seu navegador.
      </div>

      <h2>Escolhendo o algoritmo certo: um guia de decisão</h2>
      <ul>
        <li><strong>Integridade de arquivos / checksums (sem fins de segurança):</strong> MD5 ou SHA-256. O SHA-256 é preferido para qualquer coisa voltada ao público, mesmo que o modelo de ameaças seja apenas a corrupção acidental, já que usar um algoritmo quebrado por escolha é difícil de justificar a auditores.</li>
        <li><strong>TLS, assinatura de código, operações com certificados:</strong> SHA-256 (obrigatório — o SHA-1 é rejeitado).</li>
        <li><strong>Assinatura de JWT:</strong> HMAC-SHA-256 (HS256) para simétrico, ou RS256/ES256 para assimétrico. Nunca MD5 ou SHA-1.</li>
        <li><strong>Armazenamento de senhas:</strong> Argon2id, bcrypt ou scrypt. Nenhuma variante de SHA.</li>
        <li><strong>Hash de arquivos grandes em servidores de 64 bits:</strong> SHA-512 para a melhor taxa de transferência.</li>
        <li><strong>Margem máxima de segurança:</strong> SHA-512 ou SHA-3 (SHA3-256, SHA3-512).</li>
        <li><strong>Compatibilidade com sistemas legados:</strong> O que o sistema legado exigir — mas planeje a migração para longe do MD5 e do SHA-1.</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Gere hashes MD5, SHA-1, SHA-256 e SHA-512 instantaneamente
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Cole texto ou solte um arquivo. Todo o cálculo de hash acontece no seu navegador usando a Web Crypto API.
          Nada é enviado. Nada é registrado.
        </p>
        <a
          href="/tools/hash-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Gerador de Hash →
        </a>
      </div>
    </div>
  );
}
