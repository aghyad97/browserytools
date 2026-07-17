import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Todo arquivo e diretório em um sistema Linux ou macOS carrega um conjunto de permissões que
        controla quem pode lê-lo, gravá-lo ou executá-lo. Definir essas permissões corretamente é a
        diferença entre um servidor seguro e um que vaza dados ou é comprometido. No entanto, a
        notação — <code>chmod 755</code>,{" "}
        saída do <code>ls -la</code> mostrando <code>-rwxr-xr--</code> — pode parecer opaca até você
        entender o modelo por baixo. Este guia explica as permissões de arquivos Unix desde os
        primeiros princípios.
      </p>
      <ToolCTA slug="chmod" variant="inline" />
      <p>
        Você pode calcular valores de permissão e converter entre notação octal e simbólica instantaneamente
        com a{" "}
        <a href="/tools/chmod">Calculadora chmod do BrowseryTools</a> — gratuita, sem cadastro, tudo
        roda no seu navegador.
      </p>

      <h2>O Modelo de Permissões Unix: Proprietário, Grupo, Outros</h2>
      <p>
        O Unix atribui a cada arquivo e diretório três conjuntos de permissões, cada um cobrindo um
        público diferente:
      </p>
      <ul>
        <li><strong>Proprietário (user)</strong> — a conta de usuário dona do arquivo. Tipicamente o usuário que o criou.</li>
        <li><strong>Grupo</strong> — um grupo nomeado de usuários. O arquivo pertence a um grupo; todos os membros desse grupo compartilham as permissões de grupo.</li>
        <li><strong>Outros (world)</strong> — todos os demais no sistema que não são o proprietário nem estão no grupo.</li>
      </ul>
      <p>
        Dentro de cada um desses três conjuntos, há três bits de permissão: leitura (<code>r</code>),
        escrita (<code>w</code>) e execução (<code>x</code>). Isso dá nove bits de permissão no total,
        que mapeiam diretamente para os nove caracteres que você vê após o indicador de tipo de arquivo
        na saída do <code>ls -la</code>.
      </p>

      <h2>Lendo a Saída do ls -la</h2>
      <p>
        Ao executar <code>ls -la</code>, cada linha começa com uma string de 10 caracteres como{" "}
        <code>-rwxr-xr--</code>. Veja como lê-la:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`-  rwx  r-x  r--
^  ^^^  ^^^  ^^^
|  |    |    └── outros:  somente leitura
|  |    └─────── grupo:   leitura + execução
|  └──────────── proprietário: leitura + escrita + execução
└─────────────── tipo: - = arquivo, d = diretório, l = symlink`}
      </pre>
      <p>
        Um traço <code>-</code> em uma posição de permissão significa que aquela permissão não foi
        concedida. Assim, <code>r-x</code> significa que leitura e execução são permitidas, mas escrita não.
      </p>

      <h2>O que Leitura, Escrita e Execução Significam para Arquivos vs Diretórios</h2>
      <p>
        Os três bits de permissão têm significados diferentes dependendo se se aplicam a um arquivo ou
        a um diretório:
      </p>
      <ul>
        <li><strong>Leitura de arquivo (r)</strong> — pode ler o conteúdo do arquivo (<code>cat</code>, <code>less</code>, abrir em um editor).</li>
        <li><strong>Escrita de arquivo (w)</strong> — pode modificar ou truncar o arquivo. Obs.: excluir um arquivo é controlado pela permissão de escrita do diretório pai, não pelo bit de escrita do próprio arquivo.</li>
        <li><strong>Execução de arquivo (x)</strong> — pode executar o arquivo como programa ou script. Sem esse bit, <code>./script.sh</code> retorna "Permissão negada" mesmo que você possa lê-lo.</li>
        <li><strong>Leitura de diretório (r)</strong> — pode listar o conteúdo do diretório (<code>ls</code>). Sem isso, você sabe que o diretório existe mas não pode ver o que há dentro.</li>
        <li><strong>Escrita de diretório (w)</strong> — pode criar, renomear ou excluir arquivos dentro do diretório. É por isso que você pode excluir um arquivo que não é seu se tiver acesso de escrita ao diretório pai.</li>
        <li><strong>Execução de diretório (x)</strong> — pode entrar no diretório (<code>cd</code>) e acessar arquivos dentro dele se souber os nomes. Às vezes chamado de "bit de busca". Um diretório com <code>r--</code> permite listar nomes de arquivos mas não acessá-los; um diretório com <code>--x</code> permite acessar arquivos pelo nome mas não listá-los.</li>
      </ul>

      <h2>Notação Octal: 755, 644, 777</h2>
      <p>
        Cada conjunto de permissões (proprietário, grupo, outros) tem três bits. Três bits podem representar
        valores de 0 a 7 — exatamente um dígito octal. É por isso que as permissões são escritas como
        três dígitos octais, um por público:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Valores dos bits:  r = 4,  w = 2,  x = 1

rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0+0+0 = 0

chmod 755 → proprietário: 7 (rwx), grupo: 5 (r-x), outros: 5 (r-x)
chmod 644 → proprietário: 6 (rw-), grupo: 4 (r--), outros: 4 (r--)
chmod 600 → proprietário: 6 (rw-), grupo: 0 (---), outros: 0 (---)`}
      </pre>
      <p>
        Você nunca precisa memorizar cada combinação — use a{" "}
        <a href="/tools/chmod">Calculadora chmod do BrowseryTools</a> para verificar o que qualquer
        valor octal significa ou para construir o valor certo para sua situação.
      </p>

      <h2>Notação Simbólica: u+x, g-w, o=r</h2>
      <p>
        O modo simbólico permite modificar permissões em relação ao estado atual, sem especificar todos
        os três conjuntos de uma vez. O formato é <code>[quem][operador][permissões]</code>:
      </p>
      <ul>
        <li><strong>Quem</strong>: <code>u</code> (proprietário/user), <code>g</code> (grupo), <code>o</code> (outros), <code>a</code> (todos os três)</li>
        <li><strong>Operador</strong>: <code>+</code> (adicionar), <code>-</code> (remover), <code>=</code> (definir exatamente)</li>
        <li><strong>Permissões</strong>: <code>r</code>, <code>w</code>, <code>x</code></li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`chmod u+x script.sh       # adiciona execução apenas para o proprietário
chmod g-w config.txt      # remove escrita do grupo
chmod o=r public.html     # define outros como somente leitura exatamente
chmod a+r file.txt        # adiciona leitura para todos
chmod u=rwx,g=rx,o=       # equivalente a chmod 750`}
      </pre>

      <h2>Padrões Comuns de Permissão Explicados</h2>
      <ul>
        <li><strong>755</strong> (<code>rwxr-xr-x</code>) — Padrão para executáveis e diretórios. O proprietário pode fazer tudo; todos os demais podem ler e executar (ou entrar em um diretório) mas não gravar. O padrão para diretórios raiz de servidores web e scripts públicos.</li>
        <li><strong>644</strong> (<code>rw-r--r--</code>) — Padrão para arquivos comuns. O proprietário pode ler/gravar; todos os demais só podem ler. Bom para assets web, arquivos de configuração sem segredos e a maioria do conteúdo estático.</li>
        <li><strong>600</strong> (<code>rw-------</code>) — O proprietário pode ler/gravar; ninguém mais pode fazer nada. Obrigatório para chaves privadas SSH (<code>~/.ssh/id_rsa</code>). O SSH recusará usar um arquivo de chave com permissões mais permissivas.</li>
        <li><strong>700</strong> (<code>rwx------</code>) — O proprietário pode fazer tudo; ninguém mais tem qualquer acesso. Bom para scripts privados e diretórios contendo dados sensíveis.</li>
        <li><strong>400</strong> (<code>r--------</code>) — Somente leitura para o proprietário; completamente bloqueado para todos os demais. Usado para arquivos de configuração e certificados imutáveis onde gravações acidentais seriam prejudiciais.</li>
      </ul>

      <h2>Por que 777 é Perigoso</h2>
      <p>
        <code>chmod 777</code> dá permissões de leitura, escrita e execução para todos os usuários do
        sistema. Isso significa que qualquer processo executando como qualquer usuário — incluindo uma
        aplicação web comprometida, um script malicioso em um ambiente de hospedagem compartilhada, ou
        qualquer outro usuário na máquina — pode modificar ou executar o arquivo. Em um contexto de
        servidor web, um arquivo PHP com permissões 777 permite que qualquer outro processo o sobrescreva
        com código malicioso. Nunca use 777 em produção. Se você está usando-o para "corrigir um erro
        de permissão," a correção real é dar ao usuário ou grupo certo a propriedade do arquivo.
      </p>

      <h2>Setuid, Setgid e Sticky Bit</h2>
      <p>
        Além dos nove bits padrão, há três bits especiais que aparecem como um quarto dígito inicial na
        notação octal de quatro dígitos:
      </p>
      <ul>
        <li><strong>Setuid (4xxx)</strong> — quando definido em um executável, o programa roda com os privilégios do proprietário do arquivo, não do chamador. <code>/usr/bin/passwd</code> usa isso para permitir que usuários comuns gravem em <code>/etc/shadow</code>, que pertence ao root.</li>
        <li><strong>Setgid (2xxx)</strong> — em um executável, roda com os privilégios de grupo do arquivo. Em um diretório, novos arquivos criados dentro herdam o grupo do diretório em vez do grupo primário do criador — útil para diretórios de projetos compartilhados.</li>
        <li><strong>Sticky bit (1xxx)</strong> — em um diretório, impede que usuários excluam arquivos que não são seus, mesmo que tenham acesso de escrita ao diretório. <code>/tmp</code> tem o sticky bit definido (<code>chmod 1777</code>) para que usuários possam criar seus próprios arquivos temporários mas não excluir os dos outros.</li>
      </ul>

      <h2>chmod Recursivo (-R) e Exemplos Práticos</h2>
      <p>
        O flag <code>-R</code> aplica uma alteração de permissão recursivamente a um diretório e todo
        seu conteúdo. Use-o com cuidado — aplicar as mesmas permissões tanto a arquivos quanto a
        diretórios frequentemente está errado porque os diretórios precisam do bit de execução para
        poder ser acessados, enquanto arquivos comuns normalmente não devem ter execução:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Servidor web: diretórios precisam de 755, arquivos precisam de 644
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Corrigir permissões de chave SSH
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/authorized_keys

# Tornar um script de deploy executável
chmod +x deploy.sh`}
      </pre>
      <p>
        Quando não tiver certeza de qual valor octal usar, a{" "}
        <a href="/tools/chmod">Calculadora chmod do BrowseryTools</a> permite clicar em checkboxes para
        as permissões de proprietário, grupo e outros e imediatamente ver o valor octal e a notação
        simbólica resultantes.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculadora chmod Gratuita — Octal ↔ Simbólico ↔ Legível por Humanos
        </p>
        <a
          href="/tools/chmod"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Calculadora chmod →
        </a>
      </div>
      <ToolCTA slug="chmod" variant="card" />
    </div>
  );
}
