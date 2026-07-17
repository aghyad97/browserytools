import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        O Índice de Massa Corporal — IMC — é um dos números mais utilizados na medicina preventiva. Os médicos
        o mencionam em consultas de rotina. Formulários de seguro o pedem. Aplicativos de fitness o calculam automaticamente. E, ainda assim,
        a maioria das pessoas que conhece seu número de IMC tem apenas uma noção vaga do que ele realmente mede, como
        é calculado e — fundamentalmente — o que ele não consegue dizer. Este guia cobre tudo isso: a fórmula,
        as categorias, a história, as limitações genuínas e como usar a{" "}
        <a href="/tools/bmi-calculator">Calculadora de IMC do BrowseryTools</a> para obter seu resultado instantaneamente e
        de forma privada no seu navegador.
      </p>

      <ToolCTA slug="bmi-calculator" variant="inline" />
      <h2>O que é o IMC?</h2>
      <p>
        O IMC é uma razão simples entre o peso e a altura ao quadrado. Foi concebido na década de 1830 pelo
        matemático e estatístico belga Adolphe Quetelet, que estudava as características de um
        "homem médio" em grandes populações. Quetelet não era médico e nunca pretendeu que seu índice
        fosse usado como um diagnóstico de saúde individual — era uma ferramenta para estudar padrões em nível
        populacional. A fórmula que ele desenvolveu foi depois adotada pela comunidade médica no século
        vinte porque oferecia algo raro em ambientes clínicos: uma forma rápida, gratuita e não invasiva de
        rastrear um grande número de pessoas em busca de potencial risco de saúde relacionado ao peso.
      </p>
      <p>
        O índice se consolidou na década de 1970, depois que o fisiologista Ancel Keys revisou vários índices
        concorrentes de peso por altura e concluiu que a fórmula original de Quetelet se correlacionava de forma mais confiável
        com o percentual de gordura corporal em estudos populacionais. Foi então que Keys cunhou o termo "Índice de Massa Corporal".
        Desde então, ele tem sido a métrica de rastreamento padrão para sobrepeso e obesidade em contextos clínicos
        e de saúde pública no mundo todo.
      </p>

      <h2>A fórmula do IMC</h2>
      <p>
        A fórmula é direta. Em unidades métricas:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        IMC = peso (kg) ÷ altura² (m²)
      </pre>
      <p>
        Em unidades imperiais, é necessário um fator de conversão porque libras e polegadas não compartilham a mesma
        relação matemática que quilogramas e metros:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        IMC = 703 × peso (lb) ÷ altura² (pol²)
      </pre>
      <p>
        A constante 703 deriva da conversão de unidades entre os sistemas métrico e imperial
        (especificamente, 1 kg/m² ≈ 703 × lb/pol²). Ambas as fórmulas produzem exatamente o mesmo número
        adimensional para a mesma pessoa.
      </p>

      <h2>Um exemplo concreto</h2>
      <p>
        Considere uma pessoa que pesa 70 kg e tem 1,75 m de altura. Seu IMC é:
      </p>
      <pre style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`IMC = 70 ÷ (1,75²)
    = 70 ÷ 3,0625
    = 22,9`}
      </pre>
      <p>
        Um resultado de 22,9 cai exatamente na faixa de peso Normal (18,5–24,9). Em termos imperiais, uma pessoa
        com 5 pés e 9 polegadas (69 polegadas) e peso de 154 lb obteria: 703 × 154 ÷ 69² = 108.262 ÷ 4.761 ≈
        22,7 — essencialmente o mesmo número, como esperado.
      </p>

      <h2>Categorias do IMC</h2>
      <p>
        A Organização Mundial da Saúde (OMS) define as seguintes classificações padrão de IMC para adultos
        com 18 anos ou mais:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Categoria</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Faixa de IMC</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Risco de saúde associado</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#2563eb"}}>Abaixo do peso</strong></td>
              <td style={{padding: "12px 16px"}}>Abaixo de 18,5</td>
              <td style={{padding: "12px 16px"}}>Desnutrição, osteoporose, anemia, supressão imunológica</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Peso normal</strong></td>
              <td style={{padding: "12px 16px"}}>18,5 – 24,9</td>
              <td style={{padding: "12px 16px"}}>Menor risco dentro do referencial baseado no IMC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Sobrepeso</strong></td>
              <td style={{padding: "12px 16px"}}>25 – 29,9</td>
              <td style={{padding: "12px 16px"}}>Risco elevado de diabetes tipo 2, hipertensão, doença cardiovascular</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Obesidade Grau I</strong></td>
              <td style={{padding: "12px 16px"}}>30 – 34,9</td>
              <td style={{padding: "12px 16px"}}>Risco moderado; síndrome metabólica, apneia do sono</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#b91c1c"}}>Obesidade Grau II</strong></td>
              <td style={{padding: "12px 16px"}}>35 – 39,9</td>
              <td style={{padding: "12px 16px"}}>Risco alto; risco cirúrgico aumentado, doença articular</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#7f1d1d"}}>Obesidade Grau III (Grave)</strong></td>
              <td style={{padding: "12px 16px"}}>40 ou mais</td>
              <td style={{padding: "12px 16px"}}>Risco muito alto; expectativa de vida significativamente reduzida</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Esses limites são usados apenas para adultos. Crianças e adolescentes são avaliados em relação a curvas de crescimento
        específicas por idade e sexo, em que o percentil de IMC — e não um número fixo — determina a categoria.
      </p>

      <h2>O que o IMC não mede</h2>
      <p>
        É aqui que o IMC se torna genuinamente complicado. A fórmula é tão simples que inevitavelmente
        deixa escapar aspectos importantes da composição corporal. Entender essas limitações não é apenas acadêmico
        — elas afetam diretamente como você deve interpretar o seu próprio número.
      </p>

      <h3>Massa muscular</h3>
      <p>
        O IMC mede o peso corporal total em relação à altura. Ele não consegue distinguir entre tecido muscular
        magro e tecido adiposo (gordura). Um atleta profissional ou fisiculturista competitivo que carrega
        bastante músculo muitas vezes será classificado como Sobrepeso ou até Obeso pelo IMC, apesar de ter
        gordura corporal muito baixa. Por outro lado, uma pessoa sedentária com pouca massa muscular e alta gordura corporal —
        às vezes chamada de "magra por fora, gorda por dentro" ou de obesidade com peso normal — pode ter um IMC perfeitamente Normal
        enquanto carrega níveis de gordura metabolicamente nocivos. Esta é, sem dúvida, a falha
        mais significativa no uso rotineiro do IMC.
      </p>

      <h3>Idade</h3>
      <p>
        À medida que as pessoas envelhecem, a massa muscular tipicamente diminui e é substituída por tecido gorduroso, mesmo quando o
        peso corporal permanece constante — um processo chamado de obesidade sarcopênica. Um adulto mais velho com um IMC Normal
        de 23 pode, na verdade, carregar uma proporção maior de gordura corporal do que uma pessoa mais jovem com o mesmo
        número. Alguns pesquisadores em geriatria argumentam que faixas de IMC ligeiramente mais altas (até 27 ou mesmo 28)
        podem ser protetoras em adultos mais velhos, já que o baixo peso corporal em idosos está associado a
        fragilidade e mortalidade aumentada.
      </p>

      <h3>Sexo</h3>
      <p>
        As mulheres naturalmente carregam um percentual mais alto de gordura corporal do que os homens com o mesmo IMC. Em média,
        as mulheres têm cerca de 10 a 12 pontos percentuais a mais de gordura corporal do que os homens com pontuações de IMC idênticas.
        Isso é fisiologicamente normal — está relacionado à função hormonal e à biologia reprodutiva —
        mas significa que o mesmo número de IMC representa composições corporais significativamente diferentes dependendo
        do sexo biológico.
      </p>

      <h3>Etnia</h3>
      <p>
        Pesquisas populacionais mostraram consistentemente que pessoas de ascendência asiática têm maior risco de
        condições cardiometabólicas (diabetes tipo 2, hipertensão, doença cardiovascular) em valores de IMC
        mais baixos em comparação com populações de ascendência europeia. A Consulta de Especialistas da OMS sobre o IMC em
        populações asiáticas recomendou que os limiares de ação para adultos asiáticos fossem reduzidos — com o sobrepeso
        começando em IMC 23 e a obesidade em IMC 27,5 — para refletir melhor o risco de saúde real nessas
        populações. As categorias padrão da OMS foram desenvolvidas principalmente a partir de dados de populações europeias
        e não se traduzem de forma limpa para todos os grupos étnicos.
      </p>

      <h3>Distribuição de gordura</h3>
      <p>
        Onde a gordura é armazenada no corpo importa enormemente — sem dúvida mais do que a massa de gordura total. A gordura
        visceral, que se acumula em torno dos órgãos abdominais (fígado, pâncreas, intestinos), é metabolicamente
        ativa e fortemente associada à resistência à insulina, à inflamação e à doença cardiovascular.
        A gordura subcutânea, armazenada sob a pele, especialmente nos quadris e nas coxas, é menos nociva e
        pode até ser de certa forma protetora. O IMC não capta nenhuma dessas distinções. Duas pessoas com
        pontuações de IMC idênticas podem ter perfis de saúde radicalmente diferentes dependendo de onde sua gordura
        está armazenada.
      </p>

      <h2>Por que o IMC se tornou o padrão mesmo assim</h2>
      <p>
        Diante dessas limitações bem documentadas, é razoável perguntar por que o IMC permaneceu tão dominante
        na prática clínica. A resposta é prática: ele exige apenas uma balança e uma fita métrica.
        Calculá-lo leva cerca de dez segundos. É gratuito, reproduzível e universalmente compreendido. Métodos
        mais sofisticados de análise da composição corporal — exames DEXA, pesagem hidrostática, pletismografia
        por deslocamento de ar (Bod Pod), quantificação de gordura por ressonância magnética — são precisos, mas caros,
        demorados e indisponíveis na maioria dos ambientes clínicos de rotina.
      </p>
      <p>
        O IMC cumpre bem um propósito específico: é uma ferramenta de rastreamento barata em nível populacional que pode
        sinalizar rapidamente pessoas que talvez mereçam investigação adicional. Ele nunca foi projetado para ser uma
        ferramenta de diagnóstico para indivíduos, e a maioria dos pesquisadores e médicos que trabalham com ele entende
        essa distinção. O problema surge quando ele é usado como se fosse mais definitivo do que é.
      </p>

      <h2>Medidas complementares</h2>
      <p>
        Se você quer um quadro mais completo da sua composição corporal e do seu risco de saúde, considere estas
        medidas junto com o IMC:
      </p>
      <ul>
        <li>
          <strong>Circunferência da cintura:</strong> Medida no ponto mais estreito do tronco (ou na altura do
          umbigo). Os limiares de alto risco são geralmente de 94 cm (37 pol) para homens e 80 cm (31,5 pol) para mulheres,
          com risco muito alto acima de 102 cm (40 pol) para homens e 88 cm (34,5 pol) para mulheres. Isso capta diretamente
          a adiposidade central — gordura abdominal — que o IMC não capta.
        </li>
        <li>
          <strong>Relação cintura-quadril (RCQ):</strong> A circunferência da cintura dividida pela circunferência do quadril.
          Uma RCQ acima de 0,90 para homens ou 0,85 para mulheres indica obesidade abdominal segundo as diretrizes da OMS.
        </li>
        <li>
          <strong>Relação cintura-altura (RCA):</strong> A circunferência da cintura dividida pela altura. Uma relação
          abaixo de 0,5 é geralmente considerada saudável na maioria das populações e idades, tornando-a um dos
          indicadores de número único mais simples de gordura central.
        </li>
        <li>
          <strong>Percentual de gordura corporal:</strong> A medição direta da fração do seu peso que é
          gordura. As faixas saudáveis são de aproximadamente 10–20% para homens e 18–28% para mulheres, embora as faixas ideais
          variem por idade. O percentual de gordura corporal exige métodos de medição mais especializados.
        </li>
      </ul>

      <h2>Faixa de peso saudável para a sua altura</h2>
      <p>
        A fórmula do IMC pode ser rearranjada para calcular quais pesos lhe dariam um IMC na faixa Normal
        (18,5–24,9). Para encontrar sua faixa de peso saudável, multiplique sua altura em metros ao quadrado por
        18,5 e por 24,9:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`Faixa de peso saudável = 18,5 × altura² a 24,9 × altura²

Para 1,75 m:
Limite inferior = 18,5 × 3,0625 = 56,7 kg
Limite superior = 24,9 × 3,0625 = 76,3 kg`}
      </pre>
      <p>
        Assim, para uma pessoa de 1,75 m de altura, um IMC Normal corresponde a um peso corporal entre aproximadamente
        56,7 kg e 76,3 kg — uma faixa de quase 20 kg. A <a href="/tools/bmi-calculator">Calculadora de IMC
        do BrowseryTools</a> exibe essa faixa saudável automaticamente abaixo do seu resultado, para que você veja
        exatamente onde está em relação à categoria Normal para a sua altura específica.
      </p>

      <h2>Riscos de saúde associados a cada categoria</h2>
      <p>
        Embora o IMC seja imperfeito, ele de fato se correlaciona com desfechos de saúde relevantes em nível populacional.
        Estar significativamente abaixo do peso está associado a desnutrição, função imunológica enfraquecida, perda de
        densidade óssea e complicações cardiovasculares. No outro extremo da escala, o sobrepeso e a obesidade
        sustentados aumentam o risco estatístico de:
      </p>
      <ul>
        <li>Diabetes tipo 2 (o risco começa a subir acima do IMC 25 e acelera acima de 30)</li>
        <li>Hipertensão e doença cardiovascular</li>
        <li>Certos tipos de câncer, incluindo câncer colorretal, de mama, de endométrio e de rim</li>
        <li>Apneia obstrutiva do sono</li>
        <li>Doença hepática gordurosa não alcoólica (DHGNA)</li>
        <li>Osteoartrite das articulações que sustentam peso</li>
        <li>Risco cirúrgico e anestésico aumentado</li>
      </ul>
      <p>
        Essas são associações estatísticas em populações, não previsões individuais. Um IMC de 28 não
        significa que você desenvolverá qualquer uma dessas condições — significa que, em grandes populações de estudo,
        pessoas com esse IMC apresentaram taxas elevadas desses desfechos em comparação com pessoas na faixa
        Normal.
      </p>

      <h2>Como usar a Calculadora de IMC do BrowseryTools</h2>
      <p>
        A <a href="/tools/bmi-calculator">Calculadora de IMC do BrowseryTools</a> foi projetada para lhe dar
        um resultado instantâneo e claro com contexto útil:
      </p>
      <ul>
        <li>
          <strong>Métrico ou imperial:</strong> Alterne entre kg/cm e lb/polegadas. A calculadora
          converte automaticamente — você nunca precisa pensar em conversões de unidades.
        </li>
        <li>
          <strong>Resultados instantâneos:</strong> Seu IMC é exibido no momento em que você insere sua altura e
          seu peso. Sem botão para clicar, sem carregamento.
        </li>
        <li>
          <strong>Exibição da categoria:</strong> O resultado mostra não apenas o número, mas a categoria da OMS em que ele
          se enquadra — Abaixo do peso, Normal, Sobrepeso ou Obesidade — com codificação por cores para maior clareza.
        </li>
        <li>
          <strong>Faixa de peso saudável:</strong> Para a altura que você inseriu, a ferramenta exibe a faixa de
          pesos corporais que correspondem a um IMC Normal (18,5–24,9) no sistema de unidades que você selecionou.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Seus dados nunca saem do seu dispositivo.</strong> A Calculadora de IMC roda inteiramente no seu
        navegador. Os valores de altura e peso que você insere são usados apenas para o cálculo na tela e
        nunca são transmitidos aos servidores do BrowseryTools, armazenados em qualquer banco de dados ou compartilhados com qualquer
        terceiro. Nada é registrado. Fechar a aba descarta tudo.
      </div>

      <div style={{background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "8px", fontWeight: 700, fontSize: "1rem", color: "#92400e"}}>
          Aviso médico
        </p>
        <p style={{marginTop: 0, marginBottom: 0, fontSize: "0.95rem"}}>
          A Calculadora de IMC do BrowseryTools é apenas uma ferramenta informativa. O IMC é uma métrica de rastreamento, não
          uma medida de diagnóstico. O resultado que ela fornece não é orientação médica e não deve ser usado para
          tomar decisões sobre sua saúde, dieta ou tratamento sem consultar um profissional de saúde
          qualificado. Se você tem preocupações sobre seu peso, sua composição corporal ou condições de saúde
          relacionadas, converse com seu médico ou com um nutricionista registrado.
        </p>
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calcule seu IMC instantaneamente — métrico ou imperial
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Veja sua categoria, sua faixa de peso saudável e o que o número de fato significa.
          Sem necessidade de conta. Nada é enviado nem armazenado.
        </p>
        <a
          href="/tools/bmi-calculator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Calculadora de IMC →
        </a>
      </div>
      <ToolCTA slug="bmi-calculator" variant="card" />
    </div>
  );
}
