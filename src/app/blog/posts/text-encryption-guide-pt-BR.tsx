export default function Content() {
  return (
    <div>
      <p>
        Quando você digita uma mensagem em um aplicativo de notas ou um formulário web, para onde ela
        vai? Na maioria dos casos, o texto viaja para um servidor, é armazenado em um banco de dados
        e potencialmente lido por qualquer pessoa com acesso ao banco de dados — os funcionários da
        empresa, um invasor de violação de dados ou uma intimação do governo. A criptografia no lado
        do cliente é a abordagem técnica que muda essa equação: seus dados são criptografados antes
        de saírem do seu dispositivo, de modo que até o servidor que os armazena não possa lê-los.
      </p>
      <p>
        Você pode criptografar e descriptografar qualquer texto diretamente no seu navegador usando a{" "}
        <a href="/tools/text-encryption">Ferramenta de Criptografia de Texto do BrowseryTools</a> —
        gratuita, sem cadastro, seus dados nunca saem do seu dispositivo.
      </p>

      <h2>O que a Criptografia no Lado do Cliente Realmente Significa</h2>
      <p>
        Criptografia no lado do cliente significa que as operações criptográficas (criptografar e
        descriptografar dados) acontecem no dispositivo do usuário — no navegador, em um aplicativo
        móvel ou em um aplicativo de desktop — antes de qualquer dado ser transmitido ou armazenado.
        O servidor recebe apenas texto cifrado: uma sequência ilegível e embaralhada de bytes que é
        matematicamente inútil sem a chave de descriptografia.
      </p>
      <p>
        Isso é significativamente diferente da criptografia no lado do servidor (também chamada de
        "criptografia em repouso"), onde o servidor recebe seus dados em texto simples e os criptografa
        para armazenamento usando chaves que o próprio servidor controla. Nesse modelo, o provedor de
        serviço pode sempre descriptografar seus dados. Com a criptografia no lado do cliente, apenas
        alguém que detém a chave — que nunca sai do seu dispositivo — pode ler os dados.
      </p>
      <p>
        A implicação prática: se alguém invadir o servidor e roubar os dados criptografados, não terá
        nada útil. O texto cifrado requer a chave para ser descriptografado, e a chave nunca estava
        no servidor.
      </p>

      <h2>Criptografia Simétrica vs Assimétrica</h2>
      <p>
        Há duas abordagens fundamentais à criptografia, e cada uma serve a propósitos diferentes.
      </p>
      <ul>
        <li>
          <strong>Criptografia simétrica (AES)</strong> — uma chave criptografa os dados, e a mesma chave os descriptografa. Rápida, eficiente e adequada para criptografar grandes quantidades de dados. O desafio é a distribuição de chaves: como você compartilha a chave com segurança com quem precisa descriptografar os dados? Para uso pessoal (criptografar suas próprias notas), a criptografia simétrica é ideal — você detém a única chave. AES (Advanced Encryption Standard) é o algoritmo simétrico dominante.
        </li>
        <li>
          <strong>Criptografia assimétrica (RSA, ECDH)</strong> — duas chaves matematicamente ligadas: uma chave pública que qualquer pessoa pode usar para criptografar dados, e uma chave privada que apenas o proprietário detém, usada para descriptografia. Resolve o problema de distribuição de chaves — você pode compartilhar sua chave pública abertamente. Muito mais lenta que a criptografia simétrica para grandes dados. A maioria dos sistemas do mundo real usa criptografia assimétrica apenas para trocar uma chave simétrica, depois muda para AES para os dados em massa. É assim que o TLS (HTTPS) funciona.
        </li>
      </ul>

      <h2>Por que AES-256 É o Padrão</h2>
      <p>
        AES-256 significa AES com uma chave de 256 bits. O tamanho de chave de 256 bits significa que
        há 2<sup>256</sup> chaves possíveis — um número tão grande que forçá-lo por brute force não é
        computacionalmente viável com qualquer tecnologia que exista ou seja teoricamente possível com
        computadores clássicos. Para colocar em perspectiva: se cada átomo no universo observável fosse
        um computador verificando um bilhão de chaves por segundo, ainda levaria mais tempo do que a
        idade do universo para esgotar todas as 2<sup>256</sup> chaves.
      </p>
      <p>
        AES também é um padrão NIST (Instituto Nacional de Padrões e Tecnologia dos EUA), foi
        criptoanalisado extensivamente por décadas sem que fraquezas práticas fossem encontradas no
        próprio algoritmo, e tem aceleração de hardware (instruções AES-NI) em praticamente toda CPU
        moderna — tornando-o ao mesmo tempo a opção mais segura e mais rápida disponível. AES-GCM
        (Modo Galois/Contador) é a variante recomendada porque fornece tanto criptografia quanto
        autenticação (detectando se o texto cifrado foi adulterado).
      </p>

      <h2>Derivação de Chave a Partir de Senhas</h2>
      <p>
        AES-256 requer uma chave de 256 bits (32 bytes). Senhas escolhidas por humanos não são 32 bytes
        aleatórios — são strings curtas com padrões e conjuntos de caracteres limitados. Usar uma senha
        diretamente como chave AES seria catastroficamente inseguro. Funções de derivação de chave (KDFs)
        preenchem essa lacuna.
      </p>
      <p>
        Uma KDF pega uma senha e produz uma chave criptograficamente forte de qualquer comprimento
        desejado. As três KDFs mais importantes são:
      </p>
      <ul>
        <li>
          <strong>PBKDF2 (Função de Derivação de Chave Baseada em Senha 2)</strong> — aplica uma função HMAC milhares ou centenas de milhares de vezes (iterações) à senha. Mais iterações significa mais trabalho computacional para um invasor tentando forçar a senha. PBKDF2 é a KDF com suporte mais amplo e é usada na segurança Wi-Fi WPA2, na criptografia de dispositivos iOS e em muitos sistemas de autenticação web.
        </li>
        <li>
          <strong>bcrypt</strong> — projetado especificamente para hash de senhas com uma computação deliberadamente lenta. Tem um "fator de custo" que controla o quão lento é. Amplamente usado para armazenar senhas de usuários em bancos de dados, mas tipicamente não usado para derivar chaves AES.
        </li>
        <li>
          <strong>scrypt</strong> — adiciona dureza de memória sobre o custo computacional. Um invasor usando hardware especializado (ASICs ou GPUs) pode executar PBKDF2 barato em paralelo; o scrypt requer tanta memória por computação que ataques paralelos se tornam caros. Usado em alguns sistemas de criptomoeda e aplicações de segurança mais recentes.
        </li>
      </ul>
      <p>
        Todos os bons sistemas de criptografia também usam um <strong>salt</strong> — um valor aleatório
        combinado com a senha antes da derivação de chave, de modo que dois usuários com a mesma senha
        produzam chaves diferentes, e ataques de "rainbow table" pré-computados são derrotados.
      </p>

      <h2>O que "Nenhum Servidor Vê Seus Dados" Realmente Significa</h2>
      <p>
        Quando uma ferramenta afirma "nenhum servidor vê seus dados", significa que o texto simples nunca
        sai do seu navegador. O JavaScript rodando no seu navegador executa a criptografia localmente,
        e apenas o texto cifrado (a saída criptografada) seria transmitido — e apenas se você optar por
        transmiti-lo.
      </p>
      <p>
        A <a href="/tools/text-encryption">Ferramenta de Criptografia de Texto do BrowseryTools</a> vai
        além: nada é transmitido. A operação inteira é local. Você pode verificar isso abrindo as
        Ferramentas do Desenvolvedor do seu navegador, mudando para a aba Network e observando que
        nenhuma requisição é feita ao criptografar ou descriptografar. A ferramenta usa a Web Crypto API
        — uma biblioteca criptográfica nativa do navegador embutida em todo navegador moderno — o que
        significa que a criptografia não é código JavaScript personalizado; é a mesma implementação
        confiável que seu navegador usa para conexões HTTPS.
      </p>

      <h2>Equívocos Comuns sobre Criptografia no Navegador</h2>
      <ul>
        <li>
          <strong>"HTTPS já criptografa tudo"</strong> — HTTPS criptografa os dados em trânsito entre seu navegador e o servidor. Uma vez que os dados chegam ao servidor, são descriptografados e armazenados em texto simples (ou recriptografados com chaves controladas pelo servidor). A criptografia no lado do cliente protege os dados do próprio servidor, não apenas da interceptação de rede.
        </li>
        <li>
          <strong>"O JavaScript poderia ser alterado para roubar meus dados"</strong> — verdadeiro para qualquer aplicação web. É por isso que ferramentas de código aberto e auditadas são preferíveis a ferramentas opacas para casos de uso sensíveis. Para máxima segurança, baixe a ferramenta e execute-a offline.
        </li>
        <li>
          <strong>"A criptografia do navegador é fraca"</strong> — a criptografia do navegador usando a Web Crypto API e AES-256-GCM é o mesmo algoritmo usado por software de segurança empresarial e criptografia de disco completo de sistemas operacionais. O algoritmo não é mais fraco porque roda em um navegador.
        </li>
        <li>
          <strong>"Se eu esquecer a senha, os dados são recuperáveis"</strong> — não são. A criptografia no lado do cliente não fornece mecanismo de recuperação. Os dados são matematicamente irrecuperáveis sem a chave. Isso é uma funcionalidade, não um bug — mas requer gerenciamento cuidadoso de chaves.
        </li>
      </ul>

      <h2>Casos de Uso Práticos</h2>
      <ul>
        <li><strong>Criptografar notas sensíveis</strong> — informações médicas, detalhes de contas financeiras ou entradas de diário pessoal que você quer armazenar em um aplicativo de notas na nuvem sem confiar no provedor</li>
        <li><strong>Proteger texto sensível em documentos</strong> — incorporar credenciais ou segredos criptografados em um documento que será compartilhado, onde apenas o destinatário que conhece a senha pode lê-los</li>
        <li><strong>Enviar mensagens privadas por canais públicos</strong> — criptografe uma mensagem, compartilhe o texto cifrado em um canal público e compartilhe a senha por um canal privado separado</li>
        <li><strong>Backups seguros</strong> — criptografar dados exportados antes de armazená-los em um serviço de backup não confiável</li>
      </ul>

      <h2>Limitações da Criptografia no Lado do Cliente</h2>
      <p>
        A criptografia no lado do cliente é poderosa, mas não é uma solução completa de segurança:
      </p>
      <ul>
        <li><strong>Senhas fracas anulam a criptografia forte</strong> — AES-256 com a senha "hello123" oferece quase nenhuma proteção contra um invasor determinado que pode executar ataques de dicionário</li>
        <li><strong>Comprometimento do dispositivo</strong> — se um invasor controla seu dispositivo (malware, keylogger), pode capturar dados antes de serem criptografados ou interceptar a chave</li>
        <li><strong>Sem compartilhamento sem troca de chaves</strong> — compartilhar dados criptografados com outra pessoa requer compartilhar com segurança a chave, o que é um problema separado</li>
        <li><strong>Sem pesquisa ou indexação</strong> — dados criptografados não podem ser pesquisados, classificados ou processados sem descriptografá-los primeiro</li>
      </ul>
    </div>
  );
}
