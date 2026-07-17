import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Todo desenvolvedor já enfrentou essa situação: duas versões de um arquivo que deveriam ser
        idênticas, mas algo mudou. Talvez seja um arquivo de configuração que foi editado manualmente
        em um servidor. Talvez seja um contrato que voltou de um advogado com alterações não declaradas.
        Talvez seja um arquivo de tradução que um fornecedor devolveu e você precisa verificar se nada
        foi acidentalmente excluído. Em todos esses casos, a resposta é a mesma: execute um diff.
      </p>
      <ToolCTA slug="text-diff" variant="inline" />
      <p>
        Você pode comparar quaisquer dois blocos de texto instantaneamente usando a{" "}
        <a href="/tools/text-diff">Ferramenta de Diff de Texto do BrowseryTools</a> — gratuita, sem
        cadastro, tudo fica no seu navegador.
      </p>

      <h2>Por que o Diff de Texto Importa</h2>
      <p>
        O diff de texto não é apenas uma ferramenta para desenvolvedores. Qualquer situação em que
        existem duas versões de um documento e as diferenças precisam ser identificadas é um problema
        de diff:
      </p>
      <ul>
        <li><strong>Revisão de código</strong> — entender o que mudou entre duas versões do código-fonte antes de aprovar um merge</li>
        <li><strong>Comparação de contratos e documentos jurídicos</strong> — identificar exatamente quais cláusulas foram adicionadas, removidas ou modificadas entre rascunhos</li>
        <li><strong>Gerenciamento de configuração</strong> — confirmar que um arquivo de configuração implantado corresponde à versão no controle de origem</li>
        <li><strong>Verificação de conteúdo traduzido</strong> — verificar que um documento traduzido cobre todas as mesmas seções do original</li>
        <li><strong>Validação de dados</strong> — comparar exportações CSV de dois sistemas para encontrar discrepâncias</li>
        <li><strong>Revisão de texto</strong> — detectar alterações não intencionais entre um rascunho de documento e sua versão publicada</li>
      </ul>

      <h2>Como os Algoritmos de Diff Funcionam</h2>
      <p>
        O problema central que um algoritmo de diff resolve é: dadas duas sequências A e B, encontrar
        o conjunto mínimo de edições (inserções e exclusões) necessárias para transformar A em B. Isso
        é formalmente o problema da Subsequência Comum Mais Longa (LCS). O diff então reporta o que
        não estava no LCS — as linhas únicas em A (exclusões) e as linhas únicas em B (inserções).
      </p>
      <p>
        Dois algoritmos dominam as implementações práticas:
      </p>
      <ul>
        <li>
          <strong>Diff de Myers (1986)</strong> — o algoritmo por trás do comando <code>diff</code>{" "}
          Unix original e do Git. Eugene Myers o projetou para encontrar o script de edição mais curto
          (o diff com o menor número total de inserções e exclusões) em tempo O(ND), onde N é o tamanho
          total de ambas as entradas e D é o número de diferenças. É rápido e produz diffs mínimos, mas
          pode produzir saída contraintuitiva quando grandes blocos de código são movidos.
        </li>
        <li>
          <strong>Diff de Patience</strong> — desenvolvido por Bram Cohen (criador do BitTorrent) e usado pelo Bazaar, depois popularizado pelo Kaleidoscope. Em vez de trabalhar linha por linha, o diff de patience primeiro combina linhas únicas que aparecem exatamente uma vez em ambos os arquivos. Isso produz saída que preserva muito melhor os limites de funções e blocos do que o diff de Myers para código-fonte. O Git o suporta via <code>git diff --patience</code>.
        </li>
      </ul>

      <h2>Lendo a Saída de Diff Unificado</h2>
      <p>
        O formato de diff unificado é a saída padrão do <code>git diff</code> e da maioria das
        ferramentas de diff. Uma vez que você entende a notação, ela se torna imediatamente legível.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`--- a/config.yml       (arquivo original)
+++ b/config.yml       (arquivo modificado)
@@ -10,7 +10,8 @@     (cabeçalho do hunk)
 server:
   host: localhost
-  port: 3000
+  port: 8080
+  timeout: 30
   debug: false`}
      </pre>
      <p>
        Os elementos principais para ler:
      </p>
      <ul>
        <li><strong>Linhas começando com <code>-</code></strong> — presentes no original, removidas na nova versão (mostradas em vermelho)</li>
        <li><strong>Linhas começando com <code>+</code></strong> — não estavam no original, adicionadas na nova versão (mostradas em verde)</li>
        <li><strong>Linhas sem prefixo (espaço)</strong> — linhas de contexto inalteradas, mostradas para orientação</li>
        <li>
          <strong>O cabeçalho de hunk <code>@@</code></strong> — lê-se como "começando na linha 10, mostrando 7 linhas do original; começando na linha 10, mostrando 8 linhas da nova versão." O formato é <code>@@ -início,contagem +início,contagem @@</code>.
        </li>
      </ul>

      <h2>Diff em Nível de Palavra vs Linha vs Caractere</h2>
      <p>
        A granularidade de um diff determina o quanto é útil para uma determinada tarefa.
      </p>
      <ul>
        <li>
          <strong>Diff em nível de linha</strong> — o padrão para código-fonte. Cada linha é tratada como uma unidade atômica. Rápido e adequado para código onde as linhas são curtas e significativas. Se uma única palavra mudar em um parágrafo longo, a linha inteira é mostrada como alterada.
        </li>
        <li>
          <strong>Diff em nível de palavra</strong> — adequado para prosa e documentação. Palavras alteradas dentro de uma linha são destacadas individualmente, fornecendo um sinal muito mais claro em documentos com muito texto. A maioria das ferramentas de comparação de documentos (Controle de Alterações do Microsoft Word, histórico de versões do Google Docs) opera no nível de palavra.
        </li>
        <li>
          <strong>Diff em nível de caractere</strong> — destaca mudanças de caracteres individuais dentro das palavras. Mais útil para detectar erros de digitação sutis, mudanças de espaços em branco, caracteres invisíveis (espaços de largura zero, espaços não quebráveis) ou diferenças de codificação. Essencial para comparar dados que parecem visualmente idênticos mas diferem no nível de byte.
        </li>
      </ul>
      <p>
        A <a href="/tools/text-diff">Ferramenta de Diff de Texto do BrowseryTools</a> destaca as
        diferenças inline, facilitando a identificação de mudanças num relance sem ler o formato de
        diff unificado manualmente.
      </p>

      <h2>Git Diff por Baixo dos Panos</h2>
      <p>
        Quando você executa <code>git diff</code>, o Git calcula o diff de Myers entre as versões de
        objetos armazenadas em seu banco de dados de objetos. Alguns flags úteis alteram o comportamento:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`git diff                      # unstaged changes vs last commit
git diff --staged             # staged changes vs last commit
git diff HEAD~3               # current state vs 3 commits ago
git diff main...feature       # what feature branch adds to main
git diff --word-diff          # word-level highlighting
git diff --patience           # use patience algorithm (better for code)
git diff --stat               # summary: files changed, insertions, deletions`}
      </pre>
      <p>
        Entendendo <code>git diff main...feature</code> especificamente: a notação de três pontos mostra
        o que o branch de feature adicionou desde que divergiu do main, excluindo quaisquer mudanças
        que tenham ocorrido no main desde o ponto de ramificação. Isso é quase sempre o que você quer
        para revisão de pull request, em vez dos dois pontos <code>main..feature</code> que comparam
        diretamente as pontas atuais de ambos os branches.
      </p>

      <h2>Casos de Uso Práticos</h2>

      <h3>Comparando Arquivos de Configuração</h3>
      <p>
        Arquivos de configuração (YAML, TOML, JSON, .env) são fontes frequentes de bugs em produção
        quando as versões implantadas divergem das versões controladas por origem. Antes de depurar
        um misterioso problema de produção, fazer diff da configuração ao vivo com a configuração
        esperada frequentemente revela a causa imediatamente.
      </p>

      <h3>Comparação de Contratos e Documentos</h3>
      <p>
        Quando um rascunho de contrato volta da outra parte, nunca confie em um resumo do que mudou.
        Exporte ambas as versões para texto simples e execute um diff. Advogados são conhecidos por
        alterar termos definidos, adicionar limites de responsabilidade ou modificar prazos de aviso
        de formas que uma leitura rápida não percebe. Um diff em nível de palavra torna cada mudança
        visível.
      </p>

      <h3>Verificação de Documento Traduzido</h3>
      <p>
        Ao trabalhar com conteúdo traduzido, compare a estrutura do documento traduzido com a do
        original. Um diff estrutural de títulos de seção e contagens de parágrafos revela se alguma
        seção foi acidentalmente omitida ou mesclada durante a tradução.
      </p>

      <h2>Ferramentas de Diff Comparadas</h2>
      <ul>
        <li><strong>git diff</strong> — embutido, nível de linha, formato diff unificado, sem GUI. A linha de base para todo trabalho de código.</li>
        <li><strong>vimdiff</strong> — diff lado a lado baseado em terminal dentro do Vim. Poderoso para comparações rápidas sem sair do terminal; curva de aprendizado íngreme.</li>
        <li><strong>Beyond Compare</strong> — ferramenta de desktop comercial com sincronização de pastas, diff binário e merge de três vias. O padrão ouro para comparação de documentos não-desenvolvedor.</li>
        <li><strong>Meld</strong> — ferramenta de diff GUI gratuita e multiplataforma com suporte a merge de três vias. A melhor alternativa gratuita ao Beyond Compare.</li>
        <li><strong>BrowseryTools Text Diff</strong> — instantâneo, baseado em navegador, sem instalação. Melhor para comparações únicas rápidas, especialmente para texto que você não gostaria de colar em um serviço online.</li>
      </ul>
      <ToolCTA slug="text-diff" variant="card" />
    </div>
  );
}
