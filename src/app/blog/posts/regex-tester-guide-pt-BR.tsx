import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Expressões regulares são uma daquelas ferramentas que os desenvolvedores ou adoram ou evitam
        completamente. Elas parecem intimidadoras — uma string densa de caracteres especiais que
        parece desafiar toda legibilidade — mas o modelo subjacente é simples. Uma vez que você
        entende como funcionam, uma regex bem elaborada se torna uma das ferramentas de linha única
        mais poderosas em todo o seu conjunto de ferramentas.
      </p>
      <ToolCTA slug="regex-tester" variant="inline" />
      <p>
        Este guia corta o ruído. Em vez de catalogar cada recurso de regex, ele se concentra nos
        20% da sintaxe que cobre 80% dos casos de uso do mundo real: classes de caracteres,
        quantificadores, âncoras, grupos e flags. Ao longo do caminho, você pode testar cada
        exemplo no{" "}
        <a href="/tools/regex-tester">Testador de Regex do BrowseryTools</a> — gratuito, sem
        cadastro, tudo fica no seu navegador.
      </p>

      <h2>O que É uma Expressão Regular?</h2>
      <p>
        Uma expressão regular é um padrão que descreve um conjunto de strings. Quando você aplica
        uma regex a um texto, está perguntando: "esta string corresponde ao meu padrão?" — ou mais
        praticamente: "encontre todas as substrings que correspondam ao meu padrão." O próprio
        padrão é escrito em uma mini-linguagem compacta que a maioria das linguagens de programação
        suporta nativamente.
      </p>
      <p>
        As expressões regulares são úteis sempre que você precisar validar entrada (este é um
        endereço de e-mail válido?), extrair dados (puxar todas as URLs de um bloco de texto),
        transformar texto (substituir todas as ocorrências de um padrão) ou dividir uma string em
        um delimitador complexo. Elas rodam no navegador, no servidor, no terminal — em todo lugar.
      </p>

      <h2>A Sintaxe Principal: 20% que Cobre 80% dos Casos</h2>

      <h3>Caracteres Literais e o Ponto</h3>
      <p>
        A maioria dos caracteres em uma regex corresponde a si mesmos. O padrão <code>hello</code>{" "}
        corresponde literalmente à string "hello". O ponto <code>.</code> é o curinga universal —
        corresponde a qualquer caractere único exceto uma nova linha. Portanto{" "}
        <code>h.llo</code> corresponde a "hello", "hallo", "hxllo" e assim por diante.
      </p>

      <h3>Classes de Caracteres</h3>
      <p>
        Colchetes definem uma classe de caracteres — um conjunto de caracteres onde qualquer um
        deles pode corresponder nessa posição.
      </p>
      <ul>
        <li><strong><code>[aeiou]</code></strong> — corresponde a qualquer vogal única</li>
        <li><strong><code>[a-z]</code></strong> — corresponde a qualquer letra minúscula (sintaxe de intervalo)</li>
        <li><strong><code>[A-Za-z0-9]</code></strong> — corresponde a qualquer caractere alfanumérico</li>
        <li><strong><code>[^0-9]</code></strong> — o <code>^</code> dentro dos colchetes nega a classe; corresponde a qualquer coisa que NÃO seja um dígito</li>
      </ul>
      <p>
        Classes de atalho cobrem os casos mais comuns: <code>\d</code> corresponde a qualquer
        dígito (mesmo que <code>[0-9]</code>), <code>\w</code> corresponde a qualquer caractere
        de palavra (letras, dígitos, sublinhado), e <code>\s</code> corresponde a qualquer espaço
        em branco. Seus inversos maiúsculos — <code>\D</code>, <code>\W</code>, <code>\S</code>
        — correspondem ao oposto.
      </p>

      <h3>Quantificadores</h3>
      <p>
        Os quantificadores controlam quantas vezes o elemento precedente deve aparecer.
      </p>
      <ul>
        <li><strong><code>*</code></strong> — zero ou mais vezes</li>
        <li><strong><code>+</code></strong> — uma ou mais vezes</li>
        <li><strong><code>?</code></strong> — zero ou uma vez (torna algo opcional)</li>
        <li><strong><code>{"{3}"}</code></strong> — exatamente 3 vezes</li>
        <li><strong><code>{"{2,5}"}</code></strong> — entre 2 e 5 vezes (inclusive)</li>
        <li><strong><code>{"{3,}"}</code></strong> — 3 ou mais vezes</li>
      </ul>
      <p>
        Por padrão, os quantificadores são gananciosos — correspondem ao máximo possível.
        Adicionar um <code>?</code> após o quantificador o torna preguiçoso: <code>.*?</code>{" "}
        corresponde o mínimo possível. Essa distinção importa muito ao extrair conteúdo entre
        delimitadores.
      </p>

      <h3>Âncoras</h3>
      <p>
        Âncoras não correspondem a caracteres; correspondem a posições na string.
      </p>
      <ul>
        <li><strong><code>^</code></strong> — o início da string (ou início de uma linha no modo multilinha)</li>
        <li><strong><code>$</code></strong> — o fim da string (ou fim de uma linha no modo multilinha)</li>
        <li><strong><code>\b</code></strong> — um limite de palavra — a posição entre um caractere de palavra e um caractere que não é de palavra</li>
      </ul>
      <p>
        Âncoras são essenciais para validação. Sem elas, o padrão <code>\d+</code> corresponderia
        aos dígitos dentro de "abc123xyz". Com âncoras — <code>^\d+$</code> — só corresponde a
        strings que consistem inteiramente de dígitos.
      </p>

      <h3>Grupos e Alternância</h3>
      <p>
        Parênteses criam grupos de captura. Eles servem a dois propósitos: agrupar uma
        subexpressão para que um quantificador se aplique ao grupo inteiro, e capturar a substring
        correspondente para extração.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Grupo com quantificador: corresponde a uma ou mais repetições de "ab"
/(ab)+/   →  corresponde a "ab", "abab", "ababab"

// Alternância com |: corresponde a "cat" ou "dog"
/(cat|dog)/  →  corresponde a "I have a cat" e "I have a dog"

// Grupo de captura nomeado
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`}
      </pre>
      <p>
        Grupos não capturadores — <code>(?:...)</code> — agrupam sem capturar, o que é mais limpo
        quando você só precisa do comportamento de agrupamento e não precisa extrair o texto
        correspondido.
      </p>

      <h2>Exemplos Práticos</h2>

      <h3>Validação de E-mail</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}
      </pre>
      <p>
        Detalhando: <code>^</code> ancora ao início. <code>[a-zA-Z0-9._%+-]+</code> corresponde
        à parte local (um ou mais caracteres permitidos). <code>@</code> é um arroba literal.{" "}
        <code>[a-zA-Z0-9.-]+</code> corresponde ao nome do domínio. <code>\.</code> é um ponto
        literal (escapado, já que <code>.</code> sem escape significa "qualquer caractere").{" "}
        <code>[a-zA-Z]{"{2,}"}</code> corresponde ao TLD com pelo menos 2 letras. <code>$</code>{" "}
        ancora ao final.
      </p>

      <h3>Número de Telefone (Formato EUA)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^\+?1?\s?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})$/`}
      </pre>
      <p>
        Isso corresponde a formatos como <code>555-867-5309</code>, <code>(555) 867-5309</code>,{" "}
        <code>+1 555 867 5309</code> e <code>5558675309</code>. O truque principal é usar{" "}
        <code>?</code> para tornar os separadores opcionais e agrupar o código de área com
        parênteses opcionais.
      </p>

      <h3>Extraindo URLs de Texto</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/https?:\/\/[^\s"'<>]+/g`}
      </pre>
      <p>
        <code>https?</code> corresponde tanto a "http" quanto a "https" (o <code>s</code> é
        opcional). <code>:\/\/</code> corresponde ao literal "://" com barras escapadas.{" "}
        <code>[^\s"'&lt;&gt;]+</code> corresponde a tudo que não é espaço em branco ou caracteres
        comuns de encerramento de URL. A flag <code>g</code> encontra todas as correspondências,
        não apenas a primeira.
      </p>

      <h2>Flags de Regex</h2>
      <p>
        As flags modificam como o padrão inteiro é aplicado.
      </p>
      <ul>
        <li><strong><code>g</code> (global)</strong> — encontra todas as correspondências, não apenas a primeira</li>
        <li><strong><code>i</code> (insensível a maiúsculas)</strong> — trata maiúsculas e minúsculas como equivalentes; <code>/hello/i</code> corresponde a "Hello", "HELLO" e "hello"</li>
        <li><strong><code>m</code> (multilinha)</strong> — faz <code>^</code> e <code>$</code> corresponderem ao início/fim de cada linha em vez da string inteira</li>
        <li><strong><code>s</code> (dotAll)</strong> — faz <code>.</code> também corresponder a novas linhas, útil para correspondência em quebras de linha</li>
      </ul>
      <p>
        Em JavaScript, as flags vão após a barra de fechamento: <code>/padrão/gi</code>. Em Python,
        são passadas como segundo argumento: <code>re.findall(padrão, texto, re.IGNORECASE)</code>.
      </p>

      <h2>JavaScript vs Python: Diferenças Principais</h2>
      <p>
        A sintaxe de regex é amplamente a mesma entre JavaScript e Python, mas há algumas
        diferenças importantes.
      </p>
      <ul>
        <li><strong>Grupos nomeados</strong>: JavaScript usa <code>(?&lt;nome&gt;...)</code>, Python usa o mesmo. Ambos retornam grupos nomeados, mas os acessam de forma diferente — <code>match.groups.nome</code> em JS, <code>match.group('nome')</code> em Python.</li>
        <li><strong>Lookahead / lookbehind</strong>: Ambos suportam <code>(?=...)</code> (lookahead positivo) e <code>(?!...)</code> (lookahead negativo). Python também suporta lookbehinds de comprimento variável; motores JavaScript mais antigos não.</li>
        <li><strong>Unicode</strong>: JavaScript requer a flag <code>u</code> para lidar com escapes de propriedades Unicode como <code>\p{"{Letter}"}</code>. O módulo <code>re</code> do Python lida com Unicode por padrão.</li>
        <li><strong>Strings brutas</strong>: Em Python, sempre use strings brutas (<code>r"\d+"</code>) para evitar escape duplo de barras invertidas. Em JavaScript, você usa a sintaxe literal <code>/\d+/</code> ou a string <code>"\\d+"</code> ao construir com <code>new RegExp()</code>.</li>
      </ul>

      <h2>Erros Comuns de Regex</h2>
      <ul>
        <li><strong>Retrocesso catastrófico</strong> — padrões como <code>(a+)+</code> em uma string que não corresponde podem causar retrocesso exponencial, travando o motor. Evite quantificadores aninhados em padrões sobrepostos.</li>
        <li><strong>Esquecer de escapar o ponto</strong> — <code>3.14</code> como padrão corresponde a "3X14" porque <code>.</code> é um curinga. Use <code>3\.14</code> para corresponder ao ponto literal.</li>
        <li><strong>Não ancorar padrões de validação</strong> — sem <code>^</code> e <code>$</code>, um padrão destinado a validar a string inteira corresponderá a qualquer string que contenha o padrão como substring.</li>
        <li><strong>Usar regex para análise de HTML</strong> — regex não consegue lidar com estruturas arbitrariamente aninhadas. Use um parser HTML adequado (DOMParser no navegador, BeautifulSoup em Python) para HTML.</li>
      </ul>

      <h2>Teste Seus Padrões com Segurança no Navegador</h2>
      <p>
        Escrever regex em um editor sem ciclo de feedback é doloroso. Você escreve um padrão,
        executa seu código, vê falhar, ajusta o padrão, executa novamente. Um testador de regex
        ao vivo encurta esse ciclo — você vê as correspondências destacadas em tempo real enquanto
        digita.
      </p>
      <p>
        O{" "}
        <a href="/tools/regex-tester">Testador de Regex do BrowseryTools</a> permite que você
        escreva um padrão, cole strings de teste e veja todas as correspondências destacadas
        instantaneamente. Roda inteiramente no seu navegador, para que você possa testar com
        dados reais — logs, entrada do usuário, strings de produção — sem enviar nada a um servidor.
      </p>

      <h2>Resumo</h2>
      <p>
        As expressões regulares recompensam o tempo que você investe em aprendê-las. O vocabulário
        principal — classes de caracteres, quantificadores, âncoras, grupos e flags — é pequeno.
        Os padrões que você pode construir a partir dele são vastos. Comece com os exemplos deste
        guia, teste-os com suas próprias strings e a sintaxe se tornará intuitiva mais rapidamente
        do que você espera.
      </p>
      <ToolCTA slug="regex-tester" variant="card" />
    </div>
  );
}
