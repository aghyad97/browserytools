import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Todo registro de banco de dados, recurso de API, evento distribuído e token de sessão precisa
        de um identificador único. A escolha do formato de ID importa mais do que parece — ela afeta
        a segurança, o desempenho do banco de dados, a legibilidade de URLs e o comportamento do sistema
        quando você eventualmente rodar múltiplos servidores ou mesclar dados de fontes diferentes. Este
        guia cobre as principais opções: UUIDs (v1, v4, v7), NanoIDs e CUIDs, e quando usar cada um.
      </p>
      <ToolCTA slug="uuid-generator" variant="inline" />
      <p>
        Você pode gerar UUIDs e outros IDs únicos instantaneamente com o{" "}
        <a href="/tools/uuid-generator">Gerador de UUID do BrowseryTools</a> — gratuito, sem cadastro,
        tudo gerado localmente no seu navegador.
      </p>

      <h2>Por que IDs Auto-incrementais São Insuficientes</h2>
      <p>
        IDs inteiros sequenciais (<code>1, 2, 3, ...</code>) são o padrão na maioria dos bancos de dados
        relacionais e funcionam bem para aplicações simples com servidor único. Mas criam problemas em
        escala ou em sistemas distribuídos:
      </p>
      <ul>
        <li><strong>Previsibilidade</strong> — quem conhece um ID pode adivinhar outros. <code>/orders/1042</code> deixa óbvio que o pedido 1041 existe e que seu negócio não é grande. Isso é uma vulnerabilidade IDOR (Referência Direta a Objetos Insegura) se você não impuser autorização na camada de aplicação.</li>
        <li><strong>Conflitos de mesclagem</strong> — ao combinar dados de dois bancos, duas sequências de auto-incremento separadas terão IDs colidentes. Sistemas multi-tenant, apps offline-first e migrações enfrentam esse problema.</li>
        <li><strong>Geração distribuída</strong> — se múltiplos servidores ou workers estão inserindo registros, você precisa de um mecanismo de coordenação para evitar IDs duplicados. Isso cria um gargalo.</li>
        <li><strong>Vazamento de métricas de negócio</strong> — IDs sequenciais revelam volume de pedidos, contagem de usuários e taxa de crescimento a concorrentes ou pesquisadores que monitoram IDs públicos ao longo do tempo.</li>
      </ul>

      <h2>O que é um UUID?</h2>
      <p>
        Um UUID (Identificador Universalmente Único, também chamado de GUID) é um número de 128 bits,
        convencionalmente exibido como 32 dígitos hexadecimais em cinco grupos separados por hífens:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx

Exemplo: 550e8400-e29b-41d4-a716-446655440000
          ^        ^    ^    ^    ^
          |        |    |    |    12 dígitos hex (48 bits)
          |        |    |    bits de variante (N)
          |        |    dígito de versão (M)
          |        4 dígitos hex
          8 dígitos hex`}
      </pre>
      <p>
        O dígito de versão (M) indica qual algoritmo de geração de UUID foi usado. Os bits de variante
        (N) são sempre <code>8</code>, <code>9</code>, <code>a</code> ou <code>b</code> em UUIDs
        padrão. Os 122 bits restantes estão disponíveis para os dados do identificador.
      </p>

      <h2>UUID v1: Endereço MAC + Timestamp</h2>
      <p>
        O UUID v1 combina o timestamp atual (em intervalos de 100 nanossegundos desde 15 de outubro de
        1582) com o endereço MAC da máquina geradora e uma sequência de relógio para lidar com gerações
        rápidas. O resultado é teoricamente único entre todas as máquinas e momentos.
      </p>
      <p>
        O problema é que os UUIDs v1 revelam quando e onde foram gerados — o endereço MAC está embutido
        às claras. Isso é uma preocupação de privacidade e foi explorado no worm Melissa (1999) para
        rastrear documentos infectados de volta a máquinas específicas. Por essa razão, o v1 raramente
        é usado em novas aplicações. A maioria dos desenvolvedores que quer IDs ordenados por tempo
        usa v7.
      </p>

      <h2>UUID v4: Aleatório</h2>
      <p>
        O UUID v4 é a variante mais amplamente usada. São 122 bits de dados criptograficamente aleatórios
        (os 6 bits restantes codificam versão e variante). Sem timestamp, sem endereço MAC, sem componente
        sequencial — apenas entropia.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Node.js 14.17+
const { randomUUID } = require('crypto');
randomUUID(); // → "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

// Navegador
crypto.randomUUID(); // → "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"

// Python
import uuid
str(uuid.uuid4()) # → "3d6f4580-2b3e-44e4-9d40-2d0ab12b4e7e"`}
      </pre>

      <h2>Qual a Probabilidade de Colisão do UUID v4?</h2>
      <p>
        Com 122 bits de aleatoriedade, a probabilidade de colisão é extraordinariamente pequena. Para
        ter 50% de probabilidade de pelo menos uma colisão, seria preciso gerar aproximadamente
        2,7 × 10<sup>18</sup> UUIDs — 2,7 quintilhões. Se você gerasse um bilhão de UUIDs por segundo,
        levaria cerca de 85 anos para atingir esse limiar. Para qualquer aplicação real, colisões não
        são uma preocupação prática. A fonte muito mais provável de IDs duplicados são bugs de aplicação
        (erros de copiar e colar, cache retornando IDs antigos, etc.), não o próprio gerador.
      </p>

      <h2>UUID v7: Aleatório Ordenado por Tempo</h2>
      <p>
        O UUID v7 foi padronizado na RFC 9562 (2024) para resolver a principal desvantagem prática do v4:
        UUIDs aleatórios são péssimas chaves primárias de banco de dados porque destroem a localidade de
        índice. Quando registros são inseridos com IDs aleatórios, cada inserção cai em uma posição
        aleatória em um índice B-tree, causando divisões de página, falhas de cache e fragmentação em
        escala.
      </p>
      <p>
        O UUID v7 embute um timestamp Unix com precisão de milissegundos nos bits mais significativos,
        seguido de dados aleatórios. Isso significa que os UUIDs v7 são ordenáveis — registros inseridos
        cronologicamente têm IDs lexicograficamente crescentes — mas ainda globalmente únicos e
        imprevisíveis além do limite do milissegundo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Estrutura UUID v7:
[48 bits: timestamp Unix em ms][4 bits: versão=7][12 bits: aleatório][2 bits: variante][62 bits: aleatório]

Três UUIDs v7 gerados em sequência:
  0192fe2c-4b3a-7000-8000-0a1b2c3d4e5f  ← mais antigo
  0192fe2c-4b3b-7001-8000-0a1b2c3d4e60  ← um pouco depois
  0192fe2c-4b3c-7002-8000-0a1b2c3d4e61  ← mais recente
  ^^^^^^^^^^ prefixo de timestamp aumenta monotonicamente`}
      </pre>
      <p>
        Se você está construindo uma nova aplicação que usa UUIDs como chaves primárias em um banco de
        dados relacional, o v7 é o padrão correto a partir de 2024.
      </p>

      <h2>NanoID: Mais Curto e Seguro para URLs</h2>
      <p>
        NanoID não é um UUID — é um formato de ID diferente, mas resolve o mesmo problema. Por padrão,
        gera uma string de 21 caracteres usando um alfabeto de caracteres seguros para URL
        (<code>A-Za-z0-9_-</code>). Isso fornece 126 bits de entropia — comparável ao UUID v4 — em uma
        string de 21 caracteres em vez de 36. Strings NanoID são amigáveis para URLs sem codificação
        e ficam mais limpas em logs e URLs voltadas ao usuário:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v4:  9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d  (36 chars)
NanoID:   V1StGXR8_Z5jdHi6B-myT                  (21 chars)

import { nanoid } from 'nanoid';
nanoid();      // → "V1StGXR8_Z5jdHi6B-myT"
nanoid(10);    // → "IRFa-VaY2b"  (comprimento personalizado)`}
      </pre>
      <p>
        NanoID é popular para IDs de links curtos, tokens de sessão, códigos de convite e qualquer
        caso de uso onde o ID aparece em uma URL e você quer que seja compacto.
      </p>

      <h2>CUID2: Ordenável, Sem Impressão Digital</h2>
      <p>
        CUID2 (o sucessor do CUID) foi projetado especificamente para uso como chaves primárias de banco
        de dados. Gera uma string de 24 caracteres que é ordenável por tempo de criação, não usa endereço
        MAC ou impressão digital, e é mais difícil de prever do que IDs baseados em timestamp. CUID2
        usa SHA-3 internamente para misturar o timestamp com dados aleatórios, tornando a saída
        imprevisível mesmo quando gerado no mesmo milissegundo.
      </p>
      <p>
        CUID2 é uma boa escolha quando você quer IDs ordenáveis, quer evitar o formato UUID completamente
        e se preocupa com o ID ser opaco (não vazando informações de timestamp diretamente).
      </p>

      <h2>Escolhendo o Formato Certo</h2>
      <ul>
        <li><strong>Chave primária de banco de dados, novo projeto</strong> — UUID v7 ou CUID2. Ambos são ordenáveis, o que mantém o desempenho do índice saudável conforme os dados crescem.</li>
        <li><strong>ID único de uso geral, interoperabilidade</strong> — UUID v4. Toda linguagem e framework entende o formato UUID nativamente.</li>
        <li><strong>Links curtos, códigos de convite, tokens de URL</strong> — NanoID. Compacto, seguro para URL, comprimento configurável.</li>
        <li><strong>Sistemas distribuídos onde IDs são gerados no lado do cliente</strong> — UUID v4 ou v7. Sem coordenação necessária; clientes geram seus próprios IDs antes de confirmar no servidor.</li>
        <li><strong>Evite o v1</strong> — ele vaza seu endereço MAC. Nenhum projeto novo deveria usá-lo.</li>
      </ul>

      <h2>Desempenho do UUID como Chave Primária</h2>
      <p>
        O aviso clássico "não use UUIDs como chaves primárias" é específico para UUIDs aleatórios (v4)
        no MySQL com InnoDB ou em qualquer banco de dados que agrupa dados por chave primária. A ordem
        de inserção aleatória fragmenta o índice clusterizado. No PostgreSQL com um índice UUID não
        clusterizado, a penalidade é menos severa mas ainda real em grande escala. A solução prática:
        use UUID v7 ou CUID2 (que são monotonicamente crescentes) e o problema de fragmentação
        desaparece em grande parte. Use o{" "}
        <a href="/tools/uuid-generator">Gerador de UUID do BrowseryTools</a> para gerar UUIDs v7 para
        testar seu esquema antes de se comprometer com um formato.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Gerador de UUID Gratuito — v1, v4, v7, NanoID, CUID2
        </p>
        <a
          href="/tools/uuid-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir Gerador de UUID →
        </a>
      </div>
      <ToolCTA slug="uuid-generator" variant="card" />
    </div>
  );
}
