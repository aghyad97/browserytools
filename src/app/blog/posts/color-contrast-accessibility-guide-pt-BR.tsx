export default function Content() {
  return (
    <div>
      <p>
        Toda vez que você precisa franzir os olhos para ler um texto muito claro num site, ou tem
        dificuldade para ler o rótulo de um botão porque ele se confunde com o fundo, você está
        vivenciando uma falha de contraste. Para a maioria das pessoas, isso é uma inconveniência
        menor. Para uma parcela significativa da população — aquelas com deficiências na visão de
        cores, baixa visão, olhos envelhecidos ou qualquer pessoa usando uma tela sob luz solar
        intensa — isso torna o conteúdo genuinamente inacessível. O contraste de cores é um dos
        aspectos mais impactantes e mais frequentemente violados da acessibilidade na web, e também
        um dos mais fáceis de corrigir quando você entende as regras. Este guia explica o padrão,
        a matemática, os erros comuns e como usar o{" "}
        <a href="/tools/contrast-checker">Verificador de Contraste de Cores do BrowseryTools</a>{" "}
        para verificar qualquer par de cores instantaneamente no seu navegador.
      </p>

      <h2>Por que o Contraste Importa</h2>
      <p>
        A escala da população afetada é maior do que a maioria dos designers imagina. De acordo com
        a Organização Mundial da Saúde, aproximadamente 2,2 bilhões de pessoas no mundo têm alguma
        forma de deficiência visual de perto ou de longe. A deficiência na visão de cores —
        comumente chamada de daltonismo — afeta cerca de 8% dos homens e 0,5% das mulheres de
        descendência do norte europeu, o que significa que cerca de 300 milhões de pessoas no mundo
        têm alguma dificuldade para distinguir certas cores.
      </p>
      <p>
        Além das condições permanentes, o contraste afeta todos situacionalmente:
      </p>
      <ul>
        <li>Ler um celular sob luz solar intensa apaga completamente textos de baixo contraste.</li>
        <li>Monitores velhos ou de orçamento limitado têm brilho reduzido e pior precisão de cores.</li>
        <li>Pessoas com enxaqueca e sensibilidade à luz frequentemente usam telas com brilho reduzido.</li>
        <li>O reflexo da tela por janelas ou luzes de teto efetivamente reduz o contraste percebido.</li>
        <li>Usuários com pressa — essencialmente todos — processam conteúdo de alto contraste mais rapidamente.</li>
      </ul>
      <p>
        Bom contraste não é uma acomodação de nicho. Melhora a experiência de todos os usuários, em
        todos os dispositivos, em todas as condições de iluminação.
      </p>

      <h2>O que é Razão de Contraste?</h2>
      <p>
        A razão de contraste é um número padronizado que expressa o quão diferentes duas cores são
        em termos de seu brilho relativo (luminância). É sempre expressa como uma proporção: a cor
        mais clara dividida pela mais escura, com 0,05 adicionado a cada uma para evitar divisão por
        zero e para levar em conta a luz ambiente em displays reais.
      </p>
      <p>
        O intervalo vai de <strong>1:1</strong> (duas cores idênticas — zero contraste, completamente
        ilegível) a <strong>21:1</strong> (preto puro sobre branco puro — o contraste máximo possível).
        Quanto maior a proporção, mais distinguíveis são as duas cores.
      </p>

      <h2>Como a Razão de Contraste é Calculada</h2>
      <p>
        A fórmula usada pelo WCAG (e por todo o ecossistema de padrões da web) baseia-se no conceito
        de luminância relativa — uma medida de quanta luz uma cor parece emitir, ajustada para a
        percepção visual humana. O cálculo acontece em duas etapas.
      </p>
      <p>
        <strong>Etapa 1: Calcular a luminância relativa (L) para cada cor.</strong>
      </p>
      <p>
        Primeiro, converta cada canal RGB do intervalo 0–255 para uma escala linear de 0–1, depois
        aplique uma fórmula de expansão de gama para levar em conta como os displays codificam o
        brilho:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`// Para cada valor de canal c em [0, 1]:
if c <= 0.04045:
    c_linear = c / 12.92
else:
    c_linear = ((c + 0.055) / 1.055) ^ 2.4

L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}
      </pre>
      <p>
        Os coeficientes 0.2126, 0.7152 e 0.0722 refletem a sensibilidade humana às cores: nossos
        olhos são mais sensíveis ao verde, moderadamente sensíveis ao vermelho e menos sensíveis ao
        azul.
      </p>
      <p>
        <strong>Etapa 2: Calcular a razão de contraste.</strong>
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`Razão de Contraste = (L_mais_clara + 0.05) / (L_mais_escura + 0.05)`}
      </pre>
      <p>
        Onde <code>L_mais_clara</code> é a luminância relativa da cor mais clara e{" "}
        <code>L_mais_escura</code> é a luminância relativa da cor mais escura.
      </p>

      <h3>Exemplos de Cálculo</h3>
      <ul>
        <li>
          <strong>Preto (#000000) sobre branco (#FFFFFF):</strong> L(branco) = 1,0, L(preto) = 0,0.
          Proporção = (1,0 + 0,05) / (0,0 + 0,05) = 1,05 / 0,05 = <strong>21:1</strong>. Contraste máximo possível.
        </li>
        <li>
          <strong>Cinza #767676 sobre branco (#FFFFFF):</strong> L(#767676) ≈ 0,216.
          Proporção = (1,0 + 0,05) / (0,216 + 0,05) ≈ 1,05 / 0,266 ≈ <strong>4,54:1</strong>.
          Isso mal passa no WCAG AA para texto normal.
        </li>
        <li>
          <strong>Cinza #999999 sobre branco (#FFFFFF):</strong> L(#999999) ≈ 0,319.
          Proporção = (1,0 + 0,05) / (0,319 + 0,05) ≈ 1,05 / 0,369 ≈ <strong>2,85:1</strong>.
          Isso não passa no WCAG AA para texto de nenhum tamanho.
        </li>
      </ul>

      <h2>WCAG: O Padrão que Define os Requisitos de Acessibilidade</h2>
      <p>
        As Diretrizes de Acessibilidade para Conteúdo Web (WCAG) são publicadas pelo World Wide Web
        Consortium (W3C) e definem o padrão internacionalmente reconhecido para acessibilidade na
        web. A versão atual em uso regulatório generalizado é o WCAG 2.1, publicado em 2018. O WCAG
        3.0 está em desenvolvimento e eventualmente o substituirá com um sistema de medição mais
        refinado, mas o WCAG 2.1 continua sendo o padrão operativo para fins de conformidade.
      </p>
      <p>
        O WCAG organiza os requisitos em três níveis de conformidade: A (mínimo), AA (padrão) e AAA
        (aprimorado). O nível AA é o que a maioria dos frameworks legais exige. O nível AAA é
        aspiracional e não é obrigatório para sites inteiros, apenas para contextos específicos.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1rem", color: "#1d4ed8"}}>
          Requisitos de Contraste do WCAG 2.1 em Resumo
        </p>
        <ul style={{marginTop: 0, marginBottom: 0}}>
          <li>
            <strong>Nível AA — Texto normal:</strong> razão de contraste mínima de <strong>4,5:1</strong>
          </li>
          <li>
            <strong>Nível AA — Texto grande:</strong> razão de contraste mínima de <strong>3:1</strong>
            (texto grande = 18pt / 24px peso regular, ou 14pt / ~18,67px em negrito)
          </li>
          <li>
            <strong>Nível AA — Componentes de interface e objetos gráficos:</strong> razão de contraste mínima de <strong>3:1</strong>
            (aplica-se a bordas de botões, contornos de campos de entrada, ícones que transmitem significado)
          </li>
          <li>
            <strong>Nível AAA — Texto normal:</strong> razão de contraste mínima de <strong>7:1</strong>
          </li>
          <li>
            <strong>Nível AAA — Texto grande:</strong> razão de contraste mínima de <strong>4,5:1</strong>
          </li>
        </ul>
      </div>

      <p>
        É importante notar ao que os requisitos de contraste <em>não</em> se aplicam: imagens
        decorativas sem conteúdo informacional, logotipos e marcas nominais e texto que faz parte
        de um componente de interface inativo (um botão desabilitado, por exemplo) estão todos
        isentos dos requisitos de contraste no WCAG 2.1. A intenção é proteger o conteúdo
        informacional, não elementos puramente decorativos.
      </p>

      <h2>Pares de Cores: Exemplos de Aprovação e Reprovação</h2>
      <p>
        A razão de contraste de um par de cores depende inteiramente da luminância relativa das duas
        cores — não de qual cor é "mais bonita" ou de quais parecem similares para você. Aqui estão
        exemplos representativos ao longo do espectro de aprovação/reprovação:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Cor do Texto</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Cor do Fundo</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Razão de Contraste</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AA Normal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AAA Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#000000</code> (preto)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><strong>21:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#1a1a2e</code> (azul-marinho escuro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><strong>18,1:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#595959</code> (cinza escuro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><strong>7,0:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#767676</code> (cinza médio)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><strong>4,54:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><code>#4f46e5</code> (índigo)</td>
              <td style={{padding: "12px 16px"}}><strong>5,9:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#999999</code> (cinza claro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><strong>2,85:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (branco)</td>
              <td style={{padding: "12px 16px"}}><code>#ffdd00</code> (amarelo)</td>
              <td style={{padding: "12px 16px"}}><strong>1,29:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#0000ee</code> (link azul)</td>
              <td style={{padding: "12px 16px"}}><code>#6b21a8</code> (roxo)</td>
              <td style={{padding: "12px 16px"}}><strong>1,7:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprovado</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Erros Comuns de Contraste</h2>
      <p>
        Os mesmos erros aparecem repetidamente em auditorias de acessibilidade na web. Conhecê-los
        pelo nome facilita identificá-los no seu próprio trabalho.
      </p>

      <h3>Texto Cinza Claro sobre Branco</h3>
      <p>
        Esta é de longe a falha de contraste mais comum na web moderna. As tendências de design
        minimalista produziram uma geração de interfaces onde o texto do corpo, legendas, metadados e
        textos de placeholder são renderizados em tons como <code>#aaaaaa</code>, <code>#bbbbbb</code>{" "}
        ou <code>#cccccc</code> sobre fundos brancos. Essas combinações tipicamente produzem razões
        de contraste entre 1,5:1 e 2,5:1 — bem abaixo do mínimo de 4,5:1. O designer consegue
        ler num monitor calibrado de estúdio em sala escura; o usuário final num smartphone sob
        luz solar da tarde não consegue.
      </p>

      <h3>Texto Branco em Botões Coloridos</h3>
      <p>
        Texto branco sobre amarelo (<code>#ffdd00</code>), verde-limão (<code>#84cc16</code>) ou
        laranja claro (<code>#fb923c</code>) não passa no WCAG AA em nenhum tamanho de texto. Essas
        combinações de cores são visualmente marcantes, mas o contraste é muito baixo. Texto escuro
        (preto ou cinza muito escuro) sobre esses fundos claros é a solução acessível — geralmente
        alcança razões acima de 10:1.
      </p>

      <h3>Texto Placeholder em Campos de Formulário</h3>
      <p>
        O texto de placeholder padrão dos navegadores — o texto de dica que aparece em campos de
        entrada vazios antes do usuário digitar — é tipicamente renderizado com cerca de 40% de
        opacidade da cor do texto, ou como um cinza médio como <code>#aaaaaa</code>. Isso
        universalmente não passa no WCAG AA. O texto placeholder está sujeito ao mesmo requisito
        de contraste de 4,5:1 que o texto regular, porque transmite informação sobre o que digitar.
      </p>

      <h3>Links Azuis em Fundos Coloridos ou Escuros</h3>
      <p>
        A cor tradicional de hiperlink azul (<code>#0000ee</code>) tem excelente contraste sobre
        branco (8,6:1), mas falha em fundos coloridos. Em um fundo roxo médio, o mesmo link azul
        alcança apenas cerca de 1,7:1. As cores dos links precisam ser verificadas não apenas contra
        o fundo da página, mas contra qualquer seção colorida ou card em que apareçam.
      </p>

      <h3>Estados Desabilitados e Indicadores de Foco</h3>
      <p>
        Embora o WCAG 2.1 isente componentes de interface desabilitados dos requisitos de contraste,
        os indicadores de foco — o anel ou contorno visível que aparece quando um usuário navega
        por tabulação para um elemento focável — devem atender a 3:1 de contraste contra as cores
        adjacentes sob o WCAG 2.2. Muitos sites suprimem o anel de foco padrão do navegador com{" "}
        <code>outline: none</code> sem fornecer substituto, o que é uma falha de acessibilidade
        para usuários que usam apenas o teclado.
      </p>

      <h2>Técnicas para Escolher Cores Acessíveis</h2>

      <h3>Comece Escuro sobre Claro</h3>
      <p>
        O padrão mais simples para texto é texto quase preto sobre fundo branco ou cinza muito
        claro. Razões acima de 10:1 são fáceis de alcançar e oferecem enorme flexibilidade com
        tamanho e peso da fonte. Reserve esquemas de cores claras sobre escuras (modo escuro) para
        superfícies secundárias e certifique-se de verificar o contraste em ambos os temas.
      </p>

      <h3>Verifique Todos os Estados Interativos</h3>
      <p>
        O estado padrão de um botão pode passar no AA enquanto seu estado de hover — que clareia
        o fundo — fica abaixo de 4,5:1. Verifique os estados padrão, hover, foco, ativo e
        desabilitado separadamente. O estado desabilitado está isento do requisito, mas todos os
        outros devem passar.
      </p>

      <h3>A Regra 60-30-10 Aplicada com Acessibilidade</h3>
      <p>
        A regra de cores 60-30-10 (60% cor dominante, 30% cor secundária, 10% cor de destaque) é
        útil para hierarquia visual. Aplicá-la de forma acessível significa: verificar que o texto
        que aparece em cada uma dessas três zonas de cor atende ao limiar de contraste para aquela
        zona individualmente. A cor de destaque em 10% é frequentemente a mais problemática —
        cores de destaque vivas combinadas com texto branco ou escuro podem falhar em certas
        combinações de matiz e saturação.
      </p>

      <h3>Use o Verificador de Contraste Antes de Confirmar</h3>
      <p>
        O momento mais barato para corrigir um problema de contraste é antes de você codificar
        qualquer coisa. Ao selecionar cores em uma ferramenta de design, verifique imediatamente
        os pares texto/fundo pretendidos. Ajustar a luminosidade de uma cor em 10–15% frequentemente
        coloca uma combinação reprovada em conformidade sem alterar significativamente o caráter
        visual do design.
      </p>

      <h2>Requisitos Legais</h2>
      <p>
        A conformidade com o WCAG não é puramente voluntária em muitas jurisdições. Frameworks
        legais que referenciam o WCAG AA incluem:
      </p>
      <ul>
        <li>
          <strong>Estados Unidos — Americans with Disabilities Act (ADA):</strong> A ADA proíbe
          discriminação por deficiência em locais de acomodação pública. Tribunais federais e o
          Departamento de Justiça interpretaram isso como cobrindo sites comerciais. Milhares de
          ações judiciais de acessibilidade ADA são ajuizadas em tribunais federais dos EUA
          anualmente, com violações de contraste de cores frequentemente citadas em cartas de
          notificação.
        </li>
        <li>
          <strong>União Europeia — EN 301 549:</strong> A Diretiva de Acessibilidade Web da UE
          exige conformidade WCAG 2.1 Nível AA para sites e aplicativos móveis do setor público.
          A EN 301 549 é o padrão técnico usado para aquisições. Organizações do setor privado em
          setores regulamentados enfrentam requisitos crescentes também.
        </li>
        <li>
          <strong>Canadá — AODA (Lei de Acessibilidade para Ontarianos com Deficiências):</strong>{" "}
          Ontario exige conformidade WCAG 2.0 Nível AA para organizações do setor privado com 50
          ou mais funcionários e para todas as organizações do setor público.
        </li>
        <li>
          <strong>Reino Unido — Lei da Igualdade de 2010:</strong> Os prestadores de serviços têm
          o dever de fazer ajustes razoáveis para pessoas com deficiência, o que o governo do Reino
          Unido interpreta como incluindo acessibilidade de sites.
        </li>
      </ul>
      <p>
        Além do risco legal, muitos clientes corporativos e processos de compras governamentais
        agora exigem conformidade WCAG AA em contratos com fornecedores. A conformidade com
        acessibilidade é cada vez mais um requisito comercial, não apenas ético.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "10px", fontWeight: 700, fontSize: "1rem", color: "#dc2626"}}>
          Requisito Essencial para Lembrar
        </p>
        <p style={{marginTop: 0, marginBottom: 0}}>
          O WCAG 2.1 Nível AA exige uma <strong>razão de contraste de 4,5:1 para texto normal</strong> e{" "}
          <strong>3:1 para texto grande</strong> (18pt+ ou 14pt+ em negrito). Contornos de componentes
          de interface e ícones significativos também exigem 3:1. Não atingir esses limiares significa
          não passar no padrão de acessibilidade mais amplamente exigido na web.
        </p>
      </div>

      <h2>Quem se Beneficia Além das Pessoas com Deficiência</h2>
      <p>
        Contraste acessível é um bom design para todos. Pesquisas em experiência do usuário
        consistentemente mostram que texto de alto contraste é lido mais rapidamente e com menos
        erros em todos os grupos de usuários. As populações que mais se beneficiam demonstravelmente
        incluem:
      </p>
      <ul>
        <li>Pessoas com deficiência na visão de cores (vermelho-verde, azul-amarelo ou monocromacia)</li>
        <li>Adultos mais velhos, para quem a sensibilidade ao contraste diminui naturalmente com a idade</li>
        <li>Pessoas com baixa visão que não usam ampliação de tela</li>
        <li>Usuários em ambientes com alta luz ambiente (ao ar livre, perto de janelas)</li>
        <li>Usuários com displays de baixa qualidade, envelhecidos ou de orçamento limitado</li>
        <li>Qualquer pessoa sob carga cognitiva — quando cansado ou distraído, alto contraste reduz erros de leitura</li>
      </ul>

      <h2>Como Usar o Verificador de Contraste de Cores do BrowseryTools</h2>
      <p>
        O{" "}
        <a href="/tools/contrast-checker">Verificador de Contraste de Cores do BrowseryTools</a>{" "}
        torna trivial verificar qualquer combinação de cores em relação aos padrões WCAG:
      </p>
      <ul>
        <li>
          <strong>Insira códigos hex:</strong> Digite ou cole qualquer código de cor hex válido
          (3 ou 6 dígitos, com ou sem o prefixo <code>#</code>) nos campos de primeiro plano e
          fundo.
        </li>
        <li>
          <strong>Veja a proporção imediatamente:</strong> A razão de contraste é calculada e
          exibida em tempo real enquanto você digita — sem botão para clicar.
        </li>
        <li>
          <strong>Selos AA e AAA:</strong> Selos claros de aprovação/reprovação são mostrados para
          texto AA normal, texto AA grande, texto AAA normal e texto AAA grande — para que você
          possa ver exatamente quais limiares seu par atende.
        </li>
        <li>
          <strong>Visualização ao vivo:</strong> A ferramenta renderiza uma amostra de texto no
          fundo escolhido para que você possa ver a combinação como ela apareceria para um usuário.
        </li>
        <li>
          <strong>Use o seletor de cores:</strong> Se você não tem um valor hex específico em mente,
          o seletor de cores integrado permite selecionar cores visualmente e ver instantaneamente
          como a proporção muda ao navegar pelo espaço de cores.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Tudo é executado localmente no seu navegador.</strong> O Verificador de Contraste
        de Cores realiza todos os cálculos de luminância usando JavaScript na aba do seu navegador.
        Nenhum valor de cor é transmitido para qualquer servidor. Não há contas, logs de histórico
        nem análises de terceiros envolvidos no cálculo. Feche a aba e tudo desaparece.
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Verifique qualquer combinação de cores em relação ao WCAG AA e AAA instantaneamente
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Insira dois códigos hex e veja a razão de contraste, o status de aprovação/reprovação e
          uma prévia de texto ao vivo. Sem cadastro. Nada é enviado.
        </p>
        <a
          href="/tools/contrast-checker"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Verificador de Contraste de Cores →
        </a>
      </div>
    </div>
  );
}
