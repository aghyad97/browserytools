import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Se você usa uma senha como <code>password123</code>, <code>qwerty</code> ou o nome do seu pet seguido de um
        ano de nascimento, você não está sozinho — mas está correndo um risco sério. Um estudo de 2023 da NordPass descobriu que a senha mais
        comum do mundo ainda é <strong>"123456"</strong>, usada por mais de 4,5 milhões de pessoas. De acordo
        com o Google, 65% das pessoas reutilizam a mesma senha em vários sites. Esse é o maior erro de segurança
        que você pode cometer na internet.
      </p>
      <ToolCTA slug="password-strength" variant="inline" />
      <p>
        Este guia detalha exatamente o que torna uma senha fraca ou forte, como os atacantes a quebram e como você
        pode se proteger — usando ferramentas gratuitas que rodam inteiramente no seu navegador, sem que nenhum dado seja enviado a um servidor.
      </p>

      <h2>As senhas mais comuns — a sua está nesta lista?</h2>
      <p>
        Todo ano, pesquisadores de segurança analisam bilhões de credenciais vazadas de violações de dados. Os resultados são
        consistentemente alarmantes. Aqui estão os piores ofensores que aparecem em praticamente todo banco de dados de violações:
      </p>
      <ul>
        <li>123456 / 12345678 / 123456789</li>
        <li>password / password1 / Password123</li>
        <li>qwerty / qwerty123 / qwertyuiop</li>
        <li>iloveyou / letmein / welcome</li>
        <li>admin / root / user / login</li>
        <li>abc123 / 111111 / 000000</li>
        <li>monkey / dragon / master / sunshine</li>
      </ul>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Atenção:</strong> Se qualquer uma das suas senhas aparecer nesta lista ou se parecer muito com elas, troque-as
        imediatamente. Essas senhas são as primeiríssimas que qualquer atacante vai tentar, e ferramentas automatizadas conseguem testar todas
        elas em menos de um segundo.
      </div>
      <p>
        O que é especialmente perigoso é que muitas pessoas acreditam estar sendo espertas ao substituir letras por
        números — escrevendo <code>p@ssw0rd</code> em vez de <code>password</code>. Os atacantes também conhecem esse truque.
        As ferramentas modernas de quebra incluem "regras de mutação" que aplicam automaticamente essas substituições a cada palavra
        do seu dicionário.
      </p>

      <h2>O que torna uma senha fraca?</h2>
      <p>A fraqueza de uma senha vem da previsibilidade. Uma senha é fraca quando um atacante consegue adivinhá-la mais rápido do que
        tentar todas as combinações possíveis. Os principais culpados são:</p>

      <h3>1. Comprimento curto</h3>
      <p>
        O comprimento é o fator isolado mais importante na força de uma senha. Uma senha de 6 caracteres usando apenas letras
        minúsculas tem apenas 308 milhões de combinações possíveis — uma GPU moderna consegue esgotar isso em menos de um segundo. Uma
        senha de 8 caracteres com letras maiúsculas e minúsculas e números tem 218 trilhões de combinações, o que parece impressionante, mas
        plataformas modernas de quebra rodando a bilhões de tentativas por segundo ainda conseguem quebrá-la em minutos.
      </p>

      <h3>2. Palavras de dicionário</h3>
      <p>
        Qualquer palavra real em qualquer idioma é imediatamente vulnerável a um ataque de dicionário. Isso inclui palavras com
        substituições óbvias (<code>3</code> por <code>e</code>, <code>0</code> por <code>o</code>, <code>@</code>
        por <code>a</code>) e palavras com números acrescentados ao final (<code>monkey1</code>, <code>dragon99</code>).
        Os atacantes têm dicionários com centenas de milhões dessas variações pré-computadas.
      </p>

      <h3>3. Informações pessoais</h3>
      <p>
        Nomes, datas de nascimento, aniversários, nomes de pets e times de esporte favoritos são ingredientes de senha extremamente
        comuns. Se um atacante souber qualquer coisa sobre você — apenas a partir dos seus perfis de redes sociais —, ele pode
        criar uma lista de palavras direcionada e reduzir drasticamente o tempo necessário para quebrar sua senha.
      </p>

      <h3>4. Padrões e sequências de teclado</h3>
      <p>
        Sequências como <code>qwerty</code>, <code>asdfgh</code>, <code>1qaz2wsx</code> ou <code>zxcvbn</code> são
        padrões de teclado que os crackers testam nos primeiros segundos. Elas não exigem nenhuma inteligência adicional para serem
        adivinhadas — apenas o conhecimento do layout de um teclado.
      </p>

      <h2>Como a quebra de senhas realmente funciona</h2>
      <p>
        Entender como os atacantes quebram senhas ajuda você a compreender por que certas práticas realmente o protegem
        e por que outras só parecem seguras.
      </p>

      <h3>Ataques de força bruta</h3>
      <p>
        Um ataque de força bruta tenta cada combinação possível de caracteres até encontrar a correta. Para
        senhas curtas, isso é trivialmente rápido. Para senhas mais longas, o tempo cresce exponencialmente. Uma senha de 12
        caracteres usando maiúsculas, minúsculas, números e símbolos tem cerca de 19 setilhões de combinações possíveis —
        a um bilhão de tentativas por segundo, isso levaria mais de 600 anos para ser totalmente esgotada. Esse é o poder do
        comprimento.
      </p>

      <h3>Ataques de dicionário</h3>
      <p>
        Em vez de tentar todas as combinações, os ataques de dicionário usam listas pré-construídas de senhas conhecidas, palavras
        comuns e credenciais vazadas em violações anteriores. Só a lista de palavras RockYou — vazada em 2009 — contém
        14 milhões de senhas e ainda é o ponto de partida da maioria das sessões de quebra hoje. Se sua senha já
        foi usada por alguém antes e apareceu em uma violação, ela está em algum dicionário em algum lugar.
      </p>

      <h3>Rainbow tables</h3>
      <p>
        Quando os sites armazenam senhas, eles deveriam armazená-las como hashes criptográficos — não a senha real.
        As rainbow tables são tabelas de consulta pré-computadas que mapeiam os valores de hash de volta às senhas originais. Se um site
        armazena senhas sem "salgar" os hashes (adicionar um valor aleatório antes de gerar o hash), um ataque de rainbow table
        pode recuperar milhões de senhas em segundos. É por isso que as violações de dados são tão devastadoras.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Insight essencial:</strong> A quebra de senhas se tornou uma commodity. Existem serviços online onde você pode
        pagar para ter hashes quebrados. Hardware que custa algumas centenas de dólares consegue testar bilhões de senhas por
        segundo. A única defesa real é uma senha que seja ao mesmo tempo longa e verdadeiramente aleatória.
      </div>

      <h2>Entropia de senha: por que o comprimento vence sempre</h2>
      <p>
        A entropia é uma medida de imprevisibilidade, expressa em bits. Quanto maior a entropia, mais tempo leva
        para quebrar uma senha por força bruta. Veja como isso funciona na prática:
      </p>
      <ul>
        <li>Uma senha usando apenas letras minúsculas (26 caracteres) adiciona cerca de 4,7 bits de entropia por caractere.</li>
        <li>Adicionar maiúsculas dobra o conjunto para 52 caracteres — 5,7 bits por caractere.</li>
        <li>Adicionar dígitos (62 caracteres) — 5,95 bits por caractere.</li>
        <li>Adicionar símbolos (95 caracteres ASCII imprimíveis) — 6,57 bits por caractere.</li>
      </ul>
      <p>
        Mas o efeito multiplicador do comprimento é muito mais poderoso do que a adição de qualquer tipo isolado de caractere. Uma
        senha totalmente aleatória de 12 caracteres do conjunto completo de ASCII imprimível tem cerca de 79 bits de entropia. Com 16
        caracteres, isso passa para 105 bits — efetivamente impossível de quebrar com qualquer tecnologia previsível.
      </p>

      <h2>Os três tipos de senha que as pessoas usam</h2>
      <p>As estratégias de senha da maioria das pessoas se enquadram em uma de três categorias — cada uma com seus próprios prós e contras:</p>

      <h3>Tipo 1: Fácil de lembrar, fácil de quebrar</h3>
      <p>
        Esta é a categoria <code>fluffy2009!</code> — um nome de pet, um ano e um sinal de pontuação. Você consegue lembrá-la
        sem esforço. Um atacante consegue quebrá-la em menos de uma hora com uma lista de palavras decente e regras de mutação. Essas
        senhas oferecem quase nenhuma proteção real.
      </p>

      <h3>Tipo 2: Complexa, mas impossível de lembrar</h3>
      <p>
        Algumas pessoas tentam criar senhas verdadeiramente complexas socando o teclado — <code>xK3#mQ9!pL</code> — mas
        depois descobrem que não conseguem lembrá-la. Isso leva a anotá-la em um post-it, armazená-la em um arquivo de
        texto não criptografado ou simplesmente redefini-la constantemente. O ganho de segurança se perde devido ao armazenamento inadequado.
      </p>

      <h3>Tipo 3: Forte e armazenada corretamente</h3>
      <p>
        Esta é a única abordagem que realmente funciona em escala. Gere uma senha longa e totalmente aleatória e armazene-a
        em um gerenciador de senhas. Você só precisa lembrar de uma senha mestra forte. As demais são geradas,
        armazenadas e preenchidas para você automaticamente. É assim que os profissionais de segurança gerenciam centenas de contas.
      </p>

      <h2>Comparação visual de força</h2>
      <p>Veja uma comparação lado a lado de como a força das senhas varia drasticamente:</p>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Senha</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Comprimento</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Conjunto de caracteres</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Entropia</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Tempo para quebrar</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(239,68,68,0.1)", color: "#dc2626", padding: "2px 6px", borderRadius: "4px"}}>password123</code></td>
              <td style={{padding: "12px 16px"}}>11</td>
              <td style={{padding: "12px 16px"}}>Minúsculas + dígitos</td>
              <td style={{padding: "12px 16px"}}>~18 bits (dicionário)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Instantaneamente</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(245,158,11,0.1)", color: "#d97706", padding: "2px 6px", borderRadius: "4px"}}>P@$$w0rd</code></td>
              <td style={{padding: "12px 16px"}}>8</td>
              <td style={{padding: "12px 16px"}}>Mista + símbolos</td>
              <td style={{padding: "12px 16px"}}>~24 bits (padrão)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>De minutos a horas</strong></td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "2px 6px", borderRadius: "4px"}}>v8K#mX2qLn&amp;4jR7</code></td>
              <td style={{padding: "12px 16px"}}>16</td>
              <td style={{padding: "12px 16px"}}>ASCII completo aleatório</td>
              <td style={{padding: "12px 16px"}}>~105 bits</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bilhões de anos</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        A diferença entre a primeira e a terceira senha não é apenas incremental — é a diferença entre
        nenhuma proteção e uma segurança praticamente inquebrável. E você não precisa lembrar de <code>v8K#mX2qLn&amp;4jR7</code>
        — seu gerenciador de senhas faz isso por você.
      </p>

      <h2>Verifique a força da sua senha atual instantaneamente</h2>
      <p>
        Antes de mudar qualquer coisa, vale a pena entender exatamente o quão fortes são suas senhas atuais.
        O BrowseryTools oferece um verificador de força de senha gratuito e privado que analisa sua senha localmente — os
        caracteres que você digita nunca saem do seu navegador.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Experimente agora:</strong> Acesse o{" "}
        <a href="/tools/password-strength">Verificador de Força de Senha do BrowseryTools</a> para ver exatamente como suas
        senhas pontuam. A ferramenta verifica o comprimento, a diversidade de caracteres, padrões comuns e correspondências de dicionário — e
        informa quanto tempo levaria, de forma realista, para quebrá-la.
      </div>
      <p>
        O verificador dá a você uma pontuação clara com uma explicação do que está fraco e do que melhorar. É a
        forma mais rápida de obter uma auditoria honesta das senhas que você já usa.
      </p>

      <h2>Gere senhas fortes com um clique</h2>
      <p>
        Saber como é uma senha forte e realmente criar uma são dois problemas diferentes. O cérebro
        humano é notoriamente ruim em gerar aleatoriedade — sempre recorremos a padrões, palavras familiares e
        estruturas previsíveis. A solução é deixar que uma máquina gere a aleatoriedade para você.
      </p>
      <p>
        O <a href="/tools/password-generator">Gerador de Senhas do BrowseryTools</a> cria senhas criptograficamente
        aleatórias usando o gerador de números aleatórios seguro embutido no seu navegador. Você pode personalizar:
      </p>
      <ul>
        <li>O comprimento da senha (até 128 caracteres)</li>
        <li>Os conjuntos de caracteres a incluir: maiúsculas, minúsculas, dígitos, símbolos</li>
        <li>A exclusão de caracteres ambíguos (como <code>0</code>, <code>O</code>, <code>l</code>, <code>1</code>) para facilitar a transcrição manual</li>
        <li>A quantidade de senhas a gerar de uma vez</li>
      </ul>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Garantia de privacidade:</strong> O gerador de senhas do BrowseryTools roda inteiramente no seu navegador usando
        a Web Crypto API. Nenhuma senha jamais é transmitida a qualquer servidor. A geração acontece no seu dispositivo,
        apenas para os seus olhos.
      </div>

      <h2>Por que você precisa de um gerenciador de senhas</h2>
      <p>
        A objeção número um ao uso de senhas fortes é a memorabilidade. "Não consigo lembrar de 30 strings aleatórias
        diferentes de 20 caracteres." Você tem razão — e não deveria precisar. É exatamente para isso que servem os gerenciadores
        de senhas.
      </p>
      <p>
        Um gerenciador de senhas é um cofre criptografado que armazena todas as suas senhas. Você o desbloqueia com uma única senha mestra
        forte (a única que você precisa memorizar), e ele cuida de todo o resto:
      </p>
      <ul>
        <li>Armazena senhas ilimitadas com segurança, com criptografia de ponta a ponta</li>
        <li>Preenche automaticamente os formulários de login no seu navegador</li>
        <li>Gera novas senhas fortes quando você cria contas</li>
        <li>Alerta você quando uma senha foi exposta em uma violação conhecida</li>
        <li>Sincroniza com segurança entre todos os seus dispositivos</li>
      </ul>
      <p>
        Opções populares incluem o Bitwarden (de código aberto e gratuito), o 1Password e o KeePass (totalmente local). O
        importante é usar qualquer um deles — a melhoria de segurança em relação a não ter gerenciador é enorme.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Insight essencial:</strong> Com um gerenciador de senhas, você pode usar uma senha diferente, totalmente aleatória e de 20
        caracteres em cada site. Se um site sofrer uma violação, apenas aquela conta é comprometida — não
        todas as contas que você possui.
      </div>

      <h2>Autenticação de dois fatores: por que apenas senhas não bastam</h2>
      <p>
        Até a senha mais forte tem uma vulnerabilidade fundamental: ela pode ser roubada sem ser quebrada.
        Ataques de phishing, keyloggers, ataques man-in-the-middle e violações de dados podem expor sua senha sem
        nenhuma força bruta envolvida. Uma vez que um atacante tenha sua senha, o comprimento e a complexidade são irrelevantes.
      </p>
      <p>
        A autenticação de dois fatores (2FA) adiciona uma segunda camada que protege você mesmo que sua senha seja comprometida.
        As formas comuns incluem:
      </p>
      <ul>
        <li><strong>Aplicativos TOTP</strong> (Google Authenticator, Authy): Geram um código de 6 dígitos que muda a cada 30 segundos. Mesmo com sua senha, um atacante não consegue fazer login sem o código atual.</li>
        <li><strong>Chaves de hardware</strong> (YubiKey): Um dispositivo físico que você conecta ou aproxima. Resistente a phishing porque a chave verifica o domínio do site antes de autenticar.</li>
        <li><strong>Códigos por SMS</strong>: Melhor do que nada, mas vulnerável a ataques de troca de SIM. Use um aplicativo autenticador sempre que possível.</li>
      </ul>
      <p>
        Ative a 2FA em todas as contas que a suportem — especialmente e-mail, banco, armazenamento na nuvem e redes sociais.
        Uma senha forte mais 2FA tornam o acesso não autorizado extremamente difícil até para atacantes com muitos recursos.
      </p>

      <h2>Uma lista de verificação completa de segurança de senhas</h2>
      <ul>
        <li>Use no mínimo 16 caracteres em cada senha</li>
        <li>Use uma senha diferente em cada site e serviço</li>
        <li>Nunca use palavras de dicionário, nomes ou informações pessoais</li>
        <li>Use um gerenciador de senhas para gerar e armazenar todas as senhas</li>
        <li>Ative a autenticação de dois fatores em todos os lugares onde estiver disponível</li>
        <li>Verifique suas senhas atuais com um verificador de força hoje</li>
        <li>Verifique se o seu e-mail apareceu em violações conhecidas (haveibeenpwned.com)</li>
        <li>Nunca compartilhe senhas por e-mail, mensagem de texto ou aplicativos de mensagens</li>
      </ul>

      <h2>Comece agora mesmo — leva 2 minutos</h2>
      <p>
        Você não precisa reformular tudo de uma vez. Comece pelas suas contas mais críticas: e-mail, banco
        e sua principal rede social. Substitua essas senhas primeiro usando o Gerador de Senhas do BrowseryTools,
        depois verifique a força do que você já tem usando o Verificador de Força de Senha.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Ferramentas de senha gratuitas — sem cadastro, sem compartilhamento de dados
        </p>
        <div style={{display: "flex", gap: "12px", flexWrap: "wrap" as const, justifyContent: "center"}}>
          <a
            href="/tools/password-strength"
            style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Verificar força da senha →
          </a>
          <a
            href="/tools/password-generator"
            style={{background: "rgba(34,197,94,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Gerar senha forte →
          </a>
        </div>
      </div>
      <p>
        Ambas as ferramentas rodam inteiramente no seu navegador. Suas senhas nunca são transmitidas, registradas ou armazenadas em qualquer lugar
        fora do seu próprio dispositivo. Essa é a promessa do BrowseryTools — ferramentas poderosas que genuinamente respeitam sua
        privacidade.
      </p>
      <ToolCTA slug="password-strength" variant="card" />
    </div>
  );
}
