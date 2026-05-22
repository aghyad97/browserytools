export default function Content() {
  return (
    <div>
      <p>
        Todo texto é uma impressão digital. As palavras que um autor mais usa, os termos que se agrupam
        em um documento, as frases que se repetem sem que o escritor perceba — esses padrões revelam
        estrutura, ênfase e hábito de maneiras que uma simples leitura passa completamente. A análise
        de frequência de palavras é a técnica que torna esses padrões visíveis, e é útil em uma
        variedade surpreendentemente ampla de campos: escrita criativa, SEO, pesquisa acadêmica e até
        forense.
      </p>
      <p>
        Você pode analisar a frequência de palavras de qualquer texto instantaneamente usando o{" "}
        <a href="/tools/word-frequency">Analisador de Frequência de Palavras do BrowseryTools</a> —
        gratuito, sem cadastro, tudo fica no seu navegador.
      </p>

      <h2>O que a Análise de Frequência de Palavras Revela</h2>
      <p>
        Em sua forma mais simples, a análise de frequência de palavras conta quantas vezes cada palavra
        aparece em um texto e classifica os resultados. Mas os insights que isso produz são mais ricos
        do que essa descrição sugere:
      </p>
      <ul>
        <li><strong>Identificação de tópico</strong> — as palavras de conteúdo mais frequentes (após remover as palavras funcionais comuns) dizem sobre o que um documento trata principalmente</li>
        <li><strong>Padrões de escrita</strong> — a análise de frequência expõe palavras que um escritor habitualmente usa demais, frequentemente de forma inconsciente</li>
        <li><strong>Densidade de palavras-chave</strong> — em SEO, a frequência de palavras-chave alvo em relação à contagem total de palavras é um sinal significativo</li>
        <li><strong>Riqueza de vocabulário</strong> — a proporção de palavras únicas para o total de palavras (relação type-token) é uma medida aproximada de diversidade lexical</li>
        <li><strong>Sinais de autoria</strong> — as frequências de palavras funcionais (com que frequência um autor usa "o" vs "um", ou "entretanto" vs "mas") são surpreendentemente individuais e consistentes</li>
      </ul>

      <h2>Stop Words e Por que São Filtradas</h2>
      <p>
        Se você executar uma análise bruta de frequência de palavras em quase qualquer texto em
        português, os resultados principais serão quase idênticos: "o", "a", "de", "para", "em", "que".
        Essas são stop words — palavras funcionais de alta frequência que carregam estrutura gramatical
        mas pouco significado semântico. Contá-las não diz quase nada sobre o que um documento trata.
      </p>
      <p>
        A filtragem de stop words remove esses termos antes da análise, deixando apenas as palavras de
        conteúdo que realmente transmitem significado. A lista de stop words para o português
        tipicamente inclui:
      </p>
      <ul>
        <li>Artigos: o, a, os, as, um, uma, uns, umas</li>
        <li>Preposições: de, em, para, com, por, sobre, entre, contra</li>
        <li>Conjunções: e, mas, ou, nem, então, portanto, porém</li>
        <li>Pronomes: eu, você, ele, ela, nós, eles, elas, me, te, se</li>
        <li>Verbos auxiliares: é, são, foi, eram, ser, sido, ter, tem, tinha, fazer, faz, fez</li>
      </ul>
      <p>
        Diferentes aplicações precisam de diferentes listas de stop words. Para análise de SEO, você
        pode querer incluir "como", "que", "melhor" e "top" como stop words, pois aparecem em quase
        todos os artigos. Para análise de autoria, você especificamente quer palavras funcionais —
        as stop words convencionais — porque são as impressões digitais de estilo estáveis.
      </p>

      <h2>TF-IDF: Quando a Frequência Bruta Não É Suficiente</h2>
      <p>
        A frequência bruta de termos tem um problema: algumas palavras aparecem frequentemente em um
        documento simplesmente porque aparecem frequentemente em todos os documentos desse tipo. Se
        você está analisando artigos de tecnologia, palavras como "software", "dados" e "sistema"
        aparecerão com alta frequência em todos os artigos — não são úteis para distinguir o que torna
        qualquer artigo específico único.
      </p>
      <p>
        TF-IDF (Frequência do Termo — Frequência Inversa do Documento) aborda isso ponderando a
        frequência de cada termo em relação à frequência com que aparece em uma coleção de documentos.
        A fórmula é:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`TF-IDF(term, document) = TF(term, document) × IDF(term, corpus)

TF = count(term in document) / total words in document
IDF = log(total documents / documents containing term)`}
      </pre>
      <p>
        Um termo que aparece frequentemente em um documento mas raramente em outros recebe uma pontuação
        TF-IDF alta — é um termo distintivo para esse documento. Um termo que aparece frequentemente
        em todo lugar recebe uma pontuação TF-IDF baixa. É por isso que os mecanismos de busca usam
        TF-IDF como um sinal de relevância central: uma página que usa "fungos micorrízicos" com
        frequência é genuinamente sobre fungos micorrízicos, enquanto uma página que usa "o"
        frequentemente não é especificamente sobre nada.
      </p>

      <h2>Casos de Uso para Escritores</h2>
      <p>
        A análise de frequência de palavras é uma das ferramentas de auto-edição mais práticas
        disponíveis para escritores. Ela externaliza padrões que são quase invisíveis durante o processo
        de escrita:
      </p>
      <ul>
        <li>
          <strong>Detectar palavras usadas em excesso</strong> — a maioria dos escritores tem palavras favoritas inconscientes. Executar análise de frequência em um primeiro rascunho frequentemente revela que uma palavra como "significativo", "claramente" ou "importante" aparece um número desproporcional de vezes. Ver o número é um estímulo mais forte para variar o vocabulário do que qualquer conselho geral sobre repetição de palavras.
        </li>
        <li>
          <strong>Encontrar tiques verbais</strong> — frases de transição como "em outras palavras", "como podemos ver" ou "vale a pena notar" frequentemente aparecem muito mais do que o escritor percebe. A análise de frequência as identifica para revisão direcionada.
        </li>
        <li>
          <strong>Verificar o foco</strong> — se as palavras que aparecem com mais frequência no seu artigo não correspondem ao tópico que você pretendia escrever, o rascunho pode ter se desviado.
        </li>
        <li>
          <strong>Avaliar o nível de vocabulário</strong> — comparar a distribuição de frequência de palavras simples vs complexas fornece um sinal aproximado sobre o nível de leitura.
        </li>
      </ul>
      <p>
        Tente colar um rascunho da sua própria escrita no{" "}
        <a href="/tools/word-frequency">Analisador de Frequência de Palavras do BrowseryTools</a>. As
        20 palavras de conteúdo mais frequentes, após a filtragem de stop words, devem refletir
        proximamente os conceitos centrais do texto. Se não refletirem, o rascunho provavelmente precisa
        de trabalho estrutural.
      </p>

      <h2>Aplicações de SEO</h2>
      <p>
        Para profissionais de marketing de conteúdo e SEO, a análise de frequência de palavras serve
        a várias funções:
      </p>
      <ul>
        <li>
          <strong>Análise de densidade de palavras-chave</strong> — verificar se as palavras-chave alvo aparecem em uma frequência significativa mas natural. Não há uma porcentagem mágica, mas o excesso de palavras-chave extremo (usando a mesma frase 50 vezes em um artigo de 1.000 palavras) é tanto ilegível quanto penalizado pelos mecanismos de busca, enquanto uma palavra-chave alvo que nunca aparece é um sinal perdido.
        </li>
        <li>
          <strong>Análise de conteúdo dos concorrentes</strong> — analisar a frequência de palavras das páginas com melhor posicionamento para uma determinada palavra-chave revela quais termos e conceitos relacionados consistentemente aparecem no conteúdo bem posicionado. Essa é a base da modelagem de tópicos para SEO.
        </li>
        <li>
          <strong>Identificação de lacunas de conteúdo</strong> — comparar a frequência de palavras da sua página com a de um concorrente mostra quais áreas semânticas eles cobrem que você não cobre.
        </li>
        <li>
          <strong>Otimização de títulos e cabeçalhos</strong> — analisar quais palavras aparecem nos cabeçalhos (H1, H2, H3) das páginas melhor posicionadas fornece insight direto sobre como os mecanismos de busca interpretam a estrutura do documento.
        </li>
      </ul>

      <h2>Usos Acadêmicos e de Pesquisa</h2>
      <p>
        A análise de frequência de palavras tem uma longa história na pesquisa acadêmica, particularmente
        em linguística, estudos literários e humanidades digitais:
      </p>
      <ul>
        <li>
          <strong>Atribuição de autoria</strong> — as frequências de palavras funcionais são tão estáveis e individuais que podem identificar de forma confiável o estilo de escrita de um autor em diferentes obras. Essa técnica foi usada para atribuir textos históricos disputados e em processos legais envolvendo documentos anônimos.
        </li>
        <li>
          <strong>Detecção de plágio</strong> — a análise de frequência de escolhas incomuns de palavras e frases raras pode identificar trechos que compartilham uma fonte mesmo quando o texto superficial foi parafraseado.
        </li>
        <li>
          <strong>Linguística de corpus</strong> — analisar a frequência de palavras em milhões de documentos revela como a linguagem muda ao longo do tempo, quais termos estão aumentando ou diminuindo em uso e como diferentes comunidades usam a linguagem de forma diferente. O Ngram Viewer do Google aplica essa técnica a milhões de livros digitalizados.
        </li>
        <li>
          <strong>Análise de sentimento e modelagem de tópicos</strong> — a análise de frequência de palavras com valência emocional (léxicos de sentimento positivo/negativo) fornece um proxy simples mas útil para o sentimento em grandes volumes de texto, como avaliações de clientes ou postagens em redes sociais.
        </li>
      </ul>

      <h2>Como Agir com os Dados de Frequência</h2>
      <p>
        Os dados de frequência só são úteis se gerarem ação. Um fluxo de trabalho prático:
      </p>
      <ul>
        <li><strong>Para escrita</strong> — identifique as cinco palavras mais usadas em excesso, depois use Localizar e Substituir para encontrar cada instância e decida conscientemente se deve manter, variar ou remover</li>
        <li><strong>Para SEO</strong> — compare as 20 palavras de conteúdo mais frequentes da sua página com as 20 dos três concorrentes melhor posicionados; adicione cobertura para conceitos que aparecem nos deles mas não nos seus</li>
        <li><strong>Para pesquisa</strong> — exporte dados de frequência para uma planilha e classifique por frequência para encontrar tanto os termos mais comuns (os temas centrais do documento) quanto os termos únicos menos comuns (o vocabulário distintivo do documento)</li>
        <li><strong>Para edição</strong> — preste atenção especial à linguagem de hesitação ("um tanto", "bastante", "razoavelmente", "relativamente") e intensificadores vazios ("muito", "realmente", "extremamente") — alta frequência desses é um sinal confiável de que a prosa precisa ser enxugada</li>
      </ul>
    </div>
  );
}
