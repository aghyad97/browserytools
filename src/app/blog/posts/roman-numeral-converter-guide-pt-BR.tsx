export default function Content() {
  return (
    <div>
      <p>
        Algarismos romanos estão em todo lugar quando você começa a prestar atenção: o ano de
        copyright no final de um filme, os números de capítulo de um livro, títulos do Super Bowl,
        faces de relógios, o &ldquo;MMXXVI&rdquo; em uma pedra fundamental. São elegantes, mas
        lê-los e escrevê-los não é intuitivo — rápido, quanto é <strong>MCMXCIV</strong>? Este
        guia explica exatamente como os algarismos romanos funcionam, as regras que pegam as
        pessoas de surpresa e como converter qualquer número em ambas as direções instantaneamente.
      </p>
      <p>
        Se você só precisa da resposta, o{" "}
        <a href="/tools/roman-numeral">BrowseryTools Conversor de Algarismos Romanos</a> converte
        números em algarismos romanos e vice-versa no seu navegador — gratuito, sem cadastro, nada
        enviado. Continue lendo para entender como o sistema realmente funciona e verificar qualquer
        resultado você mesmo.
      </p>

      <h2>Os Sete Símbolos</h2>
      <p>
        Todo o sistema é construído com apenas sete letras, cada uma com um valor fixo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000`}
      </pre>
      <p>
        Todo algarismo romano é alguma combinação desses sete símbolos. Não há zero e não há
        símbolo para números negativos — o sistema foi criado para contar e rotular, não para
        aritmética.
      </p>

      <h2>As Duas Regras que Governam Tudo</h2>
      <p>
        <strong>Regra 1 — Some quando os símbolos descendem.</strong> Quando um símbolo de valor
        igual ou menor segue um maior, você os soma. Então <code>VI</code> é 5 + 1 = 6,{" "}
        <code>XV</code> é 10 + 5 = 15 e <code>MDC</code> é 1000 + 500 + 100 = 1600. Leia da
        esquerda para a direita e mantenha um total acumulado.
      </p>
      <p>
        <strong>Regra 2 — Subtraia quando um símbolo menor precede um maior.</strong> Colocar um
        valor menor <em>antes</em> de um maior significa subtrair. <code>IV</code> é 5 &minus; 1 =
        4, <code>IX</code> é 10 &minus; 1 = 9, <code>XL</code> é 50 &minus; 10 = 40 e{" "}
        <code>CM</code> é 1000 &minus; 100 = 900. Essa notação subtrativa é a razão pela qual os
        algarismos romanos evitam a repetição de quatro seguidas, como IIII.
      </p>
      <p>
        Apenas seis pares subtrativos são válidos: <code>IV</code> (4), <code>IX</code> (9),{" "}
        <code>XL</code> (40), <code>XC</code> (90), <code>CD</code> (400) e <code>CM</code> (900).
        Você subtrai apenas potências de dez (I, X, C) e apenas do próximo um ou dois passos acima.
      </p>

      <h2>Como Ler MCMXCIV (o Difícil)</h2>
      <p>
        Divida em partes subtrativas e aditivas da esquerda para a direita:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`M    = 1000
CM   =  900   (1000 - 100)
XC   =   90   (100 - 10)
IV   =    4   (5 - 1)
-----------
       1994`}
      </pre>
      <p>
        Então <strong>MCMXCIV = 1994</strong>. Quando você consegue identificar as quatro partes
        subtrativas, até os numerais longos se decodificam rapidamente.
      </p>

      <h2>Como Escrever um Número como Algarismo Romano</h2>
      <p>
        Trabalhe uma casa decimal de cada vez, dos milhares para as unidades, e escreva cada
        casa usando seus símbolos:
      </p>
      <p>
        Tome <strong>2026</strong>. Milhares: 2 &rarr; <code>MM</code>. Centenas: 0 &rarr; nada.
        Dezenas: 2 &rarr; <code>XX</code>. Unidades: 6 &rarr; <code>VI</code>. Junte tudo:{" "}
        <strong>MMXXVI</strong>. Tome <strong>49</strong>: dezenas 4 &rarr; <code>XL</code>,
        unidades 9 &rarr; <code>IX</code>, resultando em <strong>XLIX</strong> — um bom lembrete
        de que 49 <em>não</em> é IL, porque você só pode subtrair do próximo um ou dois passos
        acima.
      </p>

      <h2>Erros Comuns</h2>
      <p>
        <strong>Repetir um símbolo quatro vezes.</strong> 4 é <code>IV</code>, não <code>IIII</code>;
        40 é <code>XL</code>, não <code>XXXX</code>. (Faces de relógio são uma exceção curiosa
        que frequentemente usa IIII para o 4 por equilíbrio visual.)
      </p>
      <p>
        <strong>Subtrações inválidas.</strong> 99 é <code>XCIX</code> (90 + 9), não <code>IC</code>.
        Você não pode subtrair I de C. Mantenha-se nos seis pares válidos.
      </p>
      <p>
        <strong>Números acima de 3999.</strong> Os algarismos romanos padrão chegam no máximo a
        3999 (MMMCMXCIX). Valores maiores historicamente usavam uma barra sobre a letra para
        multiplicar por 1000, mas isso raramente é necessário hoje.
      </p>

      <h2>Onde Ainda se Veem Algarismos Romanos</h2>
      <p>
        Anos de copyright em filmes e séries de TV, capítulos e prefixos de página em livros,
        nomes de monarcas e papas (Elizabeth II, Bento XVI), o Super Bowl, os Jogos Olímpicos,
        faces de relógios, pedras fundamentais de edifícios e numeração de tópicos. Conhecer as
        regras transforma tudo isso de um enigma em uma leitura instantânea.
      </p>

      <h2>Perguntas Frequentes</h2>
      <p>
        <strong>Como se escreve 0 em algarismos romanos?</strong> Não se escreve — o sistema não
        tem símbolo para zero. Estudiosos medievais às vezes usavam a palavra <em>nulla</em> no lugar.
      </p>
      <p>
        <strong>Qual é o maior algarismo romano padrão?</strong> 3999, escrito MMMCMXCIX.
      </p>
      <p>
        <strong>Por que relógios usam IIII em vez de IV?</strong> Tradição e simetria visual;
        equilibra o VIII no lado oposto. É uma exceção estilística, não a regra padrão.
      </p>
      <p>
        <strong>Posso converter nas duas direções?</strong> Sim — o{" "}
        <a href="/tools/roman-numeral">conversor</a> vai de números para algarismos e de
        algarismos de volta para números.
      </p>

      <h2>Converta Instantaneamente</h2>
      <p>
        Abra o <a href="/tools/roman-numeral">Conversor de Algarismos Romanos</a> para traduzir
        qualquer número em ambas as direções — prático para decodificar um ano de copyright ou
        escrever uma tatuagem, um título ou uma pedra fundamental. Enquanto estiver aqui, o
        BrowseryTools também tem uma{" "}
        <a href="/tools/calculator">calculadora científica</a> e uma{" "}
        <a href="/tools/percentage-calculator">calculadora de porcentagem</a> para a matemática
        que os romanos nunca chegaram a desenvolver.
      </p>
    </div>
  );
}
