import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Durante a maior parte da curta história da IA, conectar um modelo de linguagem a uma
        ferramenta externa significava escrever código de integração personalizado para cada
        ferramenta. Quer que o modelo leia um arquivo? Escreva uma função. Consulte um banco de
        dados? Escreva uma função diferente, em um formato diferente, para cada modelo que você
        quer suportar. O resultado foi um ecossistema fragmentado onde cada aplicação de IA
        reinventava a mesma infraestrutura do zero.
      </p>
      <ToolCTA slug="mcp-config" variant="inline" />
      <p>
        O Model Context Protocol (MCP) é a resposta da Anthropic a esse problema: um padrão aberto
        que dá aos modelos de IA uma interface única e consistente para ferramentas, arquivos,
        bancos de dados e serviços. Você pode usar o{" "}
        <a href="/tools/mcp-config">Gerador de Configuração MCP do BrowseryTools</a> — gratuito,
        sem cadastro, tudo fica no seu navegador — para construir e validar arquivos de
        configuração MCP sem escrever JSON manualmente.
      </p>

      <h2>O que É o MCP e Por que Ele Existe?</h2>
      <p>
        MCP significa Model Context Protocol. É um protocolo aberto — publicado pela Anthropic no
        final de 2024 e disponível em modelcontextprotocol.io — que padroniza como os modelos de
        IA se comunicam com fontes de dados externas e ferramentas. Pense nele como um adaptador
        universal: em vez de um modelo precisar de um plugin personalizado para o GitHub, um
        diferente para o seu sistema de arquivos e outro para o seu banco de dados, o MCP fornece
        uma única interface que qualquer cliente e servidor compatíveis podem usar.
      </p>
      <p>
        A analogia que a Anthropic usa é o USB-C: antes do USB-C, você precisava de um cabo
        diferente para cada dispositivo. O MCP tem como objetivo ser esse conector universal para
        o uso de ferramentas de IA. Uma ferramenta construída uma vez como um servidor MCP funciona
        com qualquer cliente compatível com MCP — Claude Desktop, Claude Code e qualquer outro
        host que implemente o protocolo.
      </p>

      <h2>Arquitetura MCP: Clientes, Hosts e Servidores</h2>
      <p>
        O MCP tem três componentes que trabalham juntos:
      </p>
      <ul>
        <li><strong>Host</strong> — A aplicação de IA rodando na máquina do usuário (por exemplo,
        Claude Desktop, uma extensão de IDE). O host gerencia conexões com um ou mais servidores
        MCP e injeta suas capacidades no contexto de IA.</li>
        <li><strong>Cliente</strong> — Um cliente de protocolo embutido no host que mantém uma
        conexão 1:1 com um único servidor MCP. O host cria um cliente por servidor.</li>
        <li><strong>Servidor</strong> — Um programa leve que expõe capacidades (ferramentas,
        recursos, prompts) através do protocolo MCP. Os servidores podem ser processos locais
        (rodando na sua máquina) ou serviços remotos acessíveis via HTTP.</li>
      </ul>
      <p>
        Quando você pede ao Claude para "ler o README no meu projeto", o cliente MCP do host
        envia uma requisição ao servidor MCP do sistema de arquivos, que lê o arquivo e retorna
        o conteúdo. O Claude nunca toca no seu sistema de arquivos diretamente — o servidor faz
        isso e reporta de volta pelo protocolo.
      </p>

      <h2>O que os Servidores MCP Podem Expor</h2>
      <p>
        Os servidores MCP podem expor três tipos de capacidades:
      </p>
      <ul>
        <li><strong>Ferramentas</strong> — Funções que o modelo pode chamar. Exemplos: pesquisar
        um banco de dados, criar um issue no GitHub, executar um comando de terminal, buscar uma URL.</li>
        <li><strong>Recursos</strong> — Dados que o modelo pode ler. Exemplos: arquivos, linhas de
        banco de dados, respostas de API, páginas de documentação. Os recursos são como fontes
        de contexto somente leitura.</li>
        <li><strong>Prompts</strong> — Templates de prompt pré-construídos que os usuários podem
        invocar por nome. Úteis para expor fluxos de trabalho padronizados.</li>
      </ul>

      <h2>Servidores MCP Comuns que Vale Conhecer</h2>
      <ul>
        <li><strong>filesystem</strong> — Lê e escreve arquivos na sua máquina local dentro de um
        diretório especificado. O servidor mais comumente usado. Necessário para o Claude Code
        ler sua base de código.</li>
        <li><strong>github</strong> — Pesquisa repositórios, lê arquivos, cria issues e pull
        requests, busca histórico de commits. Usa a API do GitHub com seu token de acesso pessoal.</li>
        <li><strong>postgres / sqlite</strong> — Executa queries SQL em um banco de dados. Somente
        leitura por padrão na maioria das implementações por segurança.</li>
        <li><strong>brave-search / fetch</strong> — Busca URLs ou executa pesquisas na web, dando
        ao modelo acesso a informações atuais além do seu corte de treinamento.</li>
        <li><strong>memory</strong> — Armazenamento de chave-valor persistente que sobrevive entre
        sessões. Dá ao modelo uma camada de memória para a qual pode escrever e da qual pode ler.</li>
        <li><strong>puppeteer / playwright</strong> — Controla um navegador headless. Permite que
        o modelo navegue em páginas da web, preencha formulários e extraia conteúdo de sites
        renderizados com JavaScript.</li>
      </ul>

      <h2>Escrevendo um JSON de Configuração MCP Básico</h2>
      <p>
        A configuração MCP fica em um arquivo JSON que a aplicação host lê na inicialização. Para
        o Claude Desktop no macOS, este arquivo fica em{" "}
        <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. A estrutura
        é consistente independentemente de quais servidores você adicionar:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}`}
      </pre>
      <p>
        Cada chave dentro de <code>mcpServers</code> é o nome que você dá ao servidor — esse é o
        rótulo que aparece na interface do Claude. Os campos <code>command</code> e <code>args</code>{" "}
        definem como iniciar o processo do servidor. A maioria dos servidores oficiais são pacotes
        npm, então <code>npx -y</code> os baixa e executa no primeiro uso sem uma etapa de
        instalação separada.
      </p>

      <h2>Adicionando Múltiplos Servidores</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}`}
      </pre>
      <p>
        O campo <code>env</code> passa variáveis de ambiente para o processo do servidor. Valores
        sensíveis como chaves de API e credenciais de banco de dados devem ir aqui, não
        hardcoded em <code>args</code>, para que você possa gerenciá-los separadamente e evitar
        acidentalmente submetê-los para o controle de versão.
      </p>

      <h2>Configurando MCP no Claude Code</h2>
      <p>
        O Claude Code (a ferramenta CLI) usa um mecanismo de configuração ligeiramente diferente.
        Você adiciona servidores MCP com o comando <code>claude mcp add</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Adicionar um servidor stdio local
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Adicionar um servidor HTTP remoto
claude mcp add my-server --transport http http://localhost:8080/mcp

# Adicionar com variáveis de ambiente
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github

# Listar todos os servidores configurados
claude mcp list`}
      </pre>
      <p>
        O Claude Code armazena as configurações de servidores em <code>~/.claude/</code> por padrão
        (escopo de usuário) ou em <code>.mcp.json</code> na raiz do projeto (escopo de projeto).
        As configurações com escopo de projeto são úteis para repositórios de equipe — faça o
        commit do <code>.mcp.json</code> e todos na equipe obtêm a mesma configuração de servidor
        automaticamente.
      </p>

      <h2>Erros Comuns de Configuração</h2>
      <ul>
        <li><strong>Separador de caminho errado</strong> — O Windows usa barras invertidas, mas
        strings JSON requerem barras para frente ou barras invertidas escapadas. Sempre use barras
        para frente em configurações MCP, mesmo no Windows.</li>
        <li><strong>Permissões de diretório ausentes</strong> — O servidor de sistema de arquivos
        só pode acessar diretórios que você lista explicitamente em seus args. Se o Claude diz que
        não consegue encontrar um arquivo, verifique se o diretório pai do arquivo está na lista
        permitida.</li>
        <li><strong>Processo de servidor obsoleto</strong> — Se um servidor travar, o host pode
        não reiniciá-lo automaticamente. Reinicie o Claude Desktop ou execute{" "}
        <code>claude mcp restart &lt;nome&gt;</code> no Claude Code para obter uma nova conexão.</li>
        <li><strong>Incompatibilidades de versão</strong> — O MCP está em desenvolvimento ativo.
        Se um servidor está se comportando de forma inesperada, verifique se você está rodando a
        versão mais recente com{" "}
        <code>npx -y @modelcontextprotocol/server-name@latest</code>.</li>
      </ul>

      <h2>Gere Sua Configuração com o BrowseryTools</h2>
      <p>
        Escrever JSON MCP manualmente é tedioso e fácil de errar — uma vírgula ausente ou um
        caminho mal citado faz toda a configuração falhar silenciosamente. O{" "}
        <a href="/tools/mcp-config">Gerador de Configuração MCP do BrowseryTools</a> permite
        selecionar seus servidores, preencher os parâmetros necessários e obter um JSON de
        configuração válido e formatado pronto para colar no seu arquivo de configuração do
        Claude Desktop ou <code>.mcp.json</code>. Tudo roda no seu navegador e nenhuma credencial
        é armazenada.
      </p>

      <h2>Resumo</h2>
      <p>
        O MCP é a camada de infraestrutura que transforma um modelo de chat autônomo em um agente
        conectado com acesso aos seus arquivos, código, bancos de dados e serviços reais. O
        protocolo é aberto, os servidores são modulares e o formato de configuração é JSON
        simples. Uma vez que sua configuração MCP esteja no lugar, você obtém um assistente de IA
        dramaticamente mais capaz sem mudar a forma como interage com ele — as ferramentas estão
        apenas lá, prontas para usar.
      </p>
      <ToolCTA slug="mcp-config" variant="card" />
    </div>
  );
}
