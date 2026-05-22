export default function Content() {
  return (
    <div>
      <p>
        De vez em quando você precisa de um tomador de decisão imparcial. Quem paga o almoço?
        Qual nome vence o sorteio? Em que ordem a equipe vai apresentar? Quem vai primeiro no
        jogo de tabuleiro? Pegar um dado físico, uma moeda do bolso ou rabiscar nomes em
        pedaços de papel funciona — mas é lento, fácil de manipular e na metade das vezes você
        não tem uma moeda no bolso de qualquer forma. Um{" "}
        <a href="/tools/random-picker">sorteador aleatório</a> no seu navegador resolve tudo isso
        em uma aba.
      </p>
      <p>
        O BrowseryTools <strong>Random Picker</strong> reúne quatro ferramentas aleatórias
        clássicas em uma única página: um <strong>gerador de números aleatórios</strong>, um{" "}
        <strong>lançador de dados</strong>, um <strong>cara ou coroa</strong> e um{" "}
        <strong>sorteador de nomes aleatórios</strong> (estilo roleta) para sorteios e
        giveaways. Tudo roda localmente no seu navegador — não há nenhum servidor decidindo o
        resultado, sem conta e sem anúncios. Este guia percorre cada modo e os pequenos detalhes
        que tornam um sorteador aleatório de fato justo.
      </p>

      <h2>O Gerador de Números Aleatórios</h2>
      <p>
        A solicitação mais comum também é a mais simples: me dê um número entre X e Y. O gerador
        de números aleatórios permite definir um <strong>mínimo</strong> e um{" "}
        <strong>máximo</strong>, escolher <strong>quantos</strong> números você quer de uma vez
        e decidir se duplicatas são permitidas. Esse último toggle importa mais do que as pessoas
        esperam. Se você está escolhendo três bilhetes de rifa de cem, quase certamente quer
        números únicos — você não quer que o bilhete 47 vença duas vezes. Se estiver simulando
        dados ou gerando dados de teste, duplicatas são aceitáveis e esperadas.
      </p>
      <p>
        Por baixo dos panos, a ferramenta usa a primitiva <code>crypto.getRandomValues</code> do
        navegador com amostragem por rejeição, que evita o viés de módulo sutil que o código
        ingênuo <code>Math.random() * range</code> introduz. Em termos simples: cada número no
        seu intervalo tem uma chance genuinamente igual de aparecer, não uma ligeiramente
        distorcida. Para uma escolha casual essa distinção é invisível, mas para qualquer coisa
        onde a imparcialidade é questionada — um giveaway público, um sorteio pago — é a
        diferença entre defensável e duvidoso.
      </p>

      <h2>O Lançador de Dados</h2>
      <p>
        Jogos de mesa e RPGs dependem de dados, e dados físicos têm o hábito de rolar para
        fora da mesa ou sumir exatamente quando você precisa deles. O lançador de dados suporta
        o conjunto completo de dados poliédricos — d4, d6, d8, d10, d12 e d20 — e permite lançar
        vários de uma vez, com a notação clássica <em>2d6</em> ou <em>4d6</em>. Cada dado é
        mostrado individualmente para que você possa ver a distribuição, e o total é somado
        automaticamente. Sem aritmética mental, sem discussão se aquele dado caiu em 5 ou 6.
      </p>
      <p>
        Como os lançamentos usam a mesma aleatoriedade criptograficamente adequada que o gerador
        de números, um d20 digital é tão justo quanto um físico — discutivelmente mais justo, já
        que dados reais raramente são perfeitamente equilibrados. Role para iniciativa, role para
        dano, role uma verificação de percentil d100 rápida, tudo na mesma aba.
      </p>

      <h2>O Cara ou Coroa</h2>
      <p>
        Às vezes você só precisa de um sim ou não, e nada resolve uma escolha binária mais
        rápido do que uma moeda. O modo cara ou coroa mostra uma animação rápida de giro e
        pousa em cara ou coroa, mantendo uma <strong>contagem acumulada</strong> de ambos. A
        contagem é o recurso subestimado aqui: se você está decidindo em melhor de sete, ou
        apenas quer observar a lei dos grandes números puxando lentamente uma divisão 50/50 para
        o equilíbrio, a contagem está ali. Redefina sempre que iniciar um novo contest.
      </p>

      <h2>O Sorteador de Nomes Aleatórios (Roleta)</h2>
      <p>
        Esse é o modo que as pessoas mais compartilham. Cole uma lista de nomes — um por linha —
        e o sorteador escolhe um vencedor aleatório com um giro rápido para suspense. É feito
        para <strong>giveaways, chamadas frias em sala de aula, standups de equipe e sorteios
        de prêmios</strong>. Insira seus comentaristas do Instagram, seus alunos, seus
        participantes da rifa e deixe a ferramenta escolher para que ninguém possa acusá-lo de
        favoritismo.
      </p>
      <p>
        A opção principal para sorteios é <strong>&quot;remover o vencedor após sortear.&quot;</strong>{" "}
        Ative-a e cada nome escolhido é retirado da lista, para que você possa fazer um sorteio
        com vários prêmios — primeiro lugar, segundo lugar, terceiro lugar — sem a mesma pessoa
        vencer duas vezes. Desative-a e a lista completa permanece para escolhas únicas repetidas.
        Um contador mostra quantas entradas restam após cada sorteio.
      </p>

      <h2>Por que uma Ferramenta no Navegador Supera um App</h2>
      <p>
        Existem apps dedicados de sorteio e sites de roleta, mas a maioria está enterrada sob
        anúncios, pede cadastro ou executa a aleatorização em um servidor que você não consegue
        inspecionar. O sorteador aleatório BrowseryTools é o oposto: uma única página estática
        que faz seu trabalho inteiramente no seu dispositivo. Nada do que você digita — nem os
        participantes do seu giveaway, nem os nomes dos seus alunos — sai do seu navegador. Você
        pode copiar qualquer resultado para a área de transferência, favoritar a página ou
        compartilhar a URL com um colega que precise do mesmo cara ou coroa justo.
      </p>

      <h2>Experimente Agora</h2>
      <p>
        Seja para um número aleatório rápido, um d20 justo, uma moeda para resolver uma
        discussão ou um sorteador de nomes para seu próximo giveaway, o{" "}
        <a href="/tools/random-picker">Random Picker</a> tem tudo em um lugar — gratuito,
        privado e instantâneo. Sem instalações, sem contas, sem pegadinha.
      </p>
    </div>
  );
}
