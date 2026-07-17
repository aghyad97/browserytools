import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Abra qualquer arquivo de log. Observe a claim de expiração de um token JWT. Verifique o campo{" "}
        <code>created_at</code>{" "}
        em uma resposta de API. Há grandes chances de você encontrar um número como{" "}
        <code>1711065600</code> ou <code>1711065600000</code>. Isso é um Unix timestamp — um
        inteiro simples que representa um momento no tempo. Entender como o tempo Unix funciona, de onde
        vem e como lidar com suas armadilhas comuns vai te poupar de uma classe de bugs sutis, difíceis
        de reproduzir e ocasionalmente embaraçosos em produção.
      </p>
      <ToolCTA slug="unix-timestamp" variant="inline" />
      <p>
        Você pode converter qualquer Unix timestamp para uma data legível (e vice-versa) usando o{" "}
        <a href="/tools/unix-timestamp">Conversor de Unix Timestamp do BrowseryTools</a> — gratuito,
        sem cadastro, tudo fica no seu navegador.
      </p>

      <h2>O que é um Unix Timestamp?</h2>
      <p>
        Um Unix timestamp é o número de segundos decorridos desde a Época Unix: meia-noite do dia
        1º de janeiro de 1970, no Tempo Universal Coordenado (UTC). Esse momento — 00:00:00 UTC em
        1970-01-01 — foi escolhido como ponto de referência quando o sistema operacional Unix estava
        sendo desenvolvido no início dos anos 1970. Era uma data recente e redonda que facilitava
        cálculos no hardware da época.
      </p>
      <p>
        A elegância do tempo Unix está no fato de que qualquer momento no tempo é representado como
        um único inteiro. Comparar dois timestamps é uma subtração. Verificar se algo expirou é uma
        comparação. Adicionar um intervalo é uma adição. Sem fusos horários, sem cálculos de calendário,
        sem horário de verão — apenas um número.
      </p>
      <p>
        A partir de 2026, o Unix timestamp atual é aproximadamente <code>1.774.000.000</code>.
        A cada segundo, esse número aumenta em 1.
      </p>

      <h2>O Problema Y2K38</h2>
      <p>
        Se o tempo Unix é armazenado como um inteiro com sinal de 32 bits — o que ocorria em muitas
        implementações antigas — o valor máximo é <code>2.147.483.647</code>. Esse número corresponde
        a 03:14:07 UTC de 19 de janeiro de 2038. Após esse momento, um inteiro com sinal de 32 bits
        sofre overflow para um número negativo grande, e sistemas não atualizados interpretarão os
        timestamps incorretamente.
      </p>
      <p>
        Esse é o problema do Ano 2038 (Y2K38), o equivalente moderno do bug Y2K. Sistemas modernos
        usam inteiros de 64 bits para timestamps, o que estende o intervalo representável para
        aproximadamente 292 bilhões de anos em qualquer direção — efetivamente para sempre para qualquer
        finalidade prática. Mas sistemas embarcados, bancos de dados legados com colunas de timestamp
        de 32 bits e código C antigo que usa <code>time_t</code> como tipo de 32 bits ainda correm risco.
      </p>

      <h2>Obtendo o Timestamp Atual</h2>
      <p>
        Veja como obter o Unix timestamp atual nas linguagens mais comuns:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — retorna milissegundos, divida por 1000 para obter segundos
const nowMs = Date.now();           // ex.: 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // ex.: 1711065600

// Python
import time
now = int(time.time())  # seconds since epoch

# Using datetime module
from datetime import datetime, timezone
now = int(datetime.now(timezone.utc).timestamp())

// Go
import "time"
now := time.Now().Unix()         // seconds
nowNano := time.Now().UnixNano() // nanoseconds

-- SQL (PostgreSQL)
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- SQL (MySQL)
SELECT UNIX_TIMESTAMP();`}
      </pre>

      <h2>Convertendo Timestamps para Datas Legíveis</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — a partir de segundos
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiply by 1000 for ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // locale-formatted date

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: timestamp from integer
SELECT to_timestamp(1711065600);
-- Result: 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Result: 2024-03-22 00:00:00`}
      </pre>

      <h2>O Bug #1 de Timestamp: Milissegundos vs Segundos</h2>
      <p>
        O <code>Date.now()</code> do JavaScript retorna milissegundos. O padrão Unix — e praticamente
        todas as outras linguagens, bancos de dados e APIs — usa segundos. Essa incompatibilidade é a
        fonte mais comum de bugs com timestamps.
      </p>
      <p>
        Os sintomas são inconfundíveis: datas aparecem em 1970 (timestamp dividido por 1000
        acidentalmente, ou tratado como segundos quando na verdade são milissegundos), ou datas aparecem
        no ano 56.000+ (segundos tratados como milissegundos). Um valor em torno de{" "}
        <code>1.700.000.000</code> quase certamente são segundos. Um valor em torno de{" "}
        <code>1.700.000.000.000</code> quase certamente são milissegundos.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25mm", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug: treating seconds as milliseconds — lands in 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct: multiply seconds by 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Defensive helper — handles both seconds and milliseconds
function toDate(ts) {
  // If it's under 10^12, it's seconds; multiply
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Problemas de Fuso Horário com Timestamps</h2>
      <p>
        Unix timestamps são sempre em UTC — representam um único momento absoluto no tempo, sem fuso
        horário associado. A questão de fuso horário só surge na camada de exibição, ao converter um
        timestamp para um formato legível por humanos.
      </p>
      <p>
        O erro mais comum é usar métodos de fuso horário local sem perceber.
        <code>new Date(ts).toLocaleDateString()</code> em JavaScript retorna a data no fuso horário
        local do navegador. Se o servidor gera um timestamp às 23:00 UTC e um usuário em UTC+0 e outro
        em UTC+1 exibem ao mesmo tempo, eles verão datas de calendário diferentes. Se isso é correto
        depende do requisito do produto — mas deve ser uma escolha deliberada, não acidental.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Always explicit about timezone — use toISOString() for UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← always UTC

// Or use Intl.DateTimeFormat for locale/timezone display
new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "full",
}).format(date);  // "sexta-feira, 22 de março de 2024"`}
      </pre>

      <h2>Timestamps em Bancos de Dados</h2>
      <p>
        Os bancos de dados oferecem duas opções principais para armazenar datas: o tipo de coluna{" "}
        <code>TIMESTAMP</code> (que armazena um momento absoluto no tempo) e o tipo <code>DATE</code>{" "}
        ou <code>DATETIME</code>{" "}
        (que armazena uma representação de calendário sem fuso horário inerente).
      </p>
      <p>
        Para campos como <code>created_at</code>, <code>updated_at</code> e timestamps de eventos,
        use sempre uma coluna <code>TIMESTAMP WITH TIME ZONE</code> (ou equivalente do banco de dados)
        em vez de um inteiro simples. Isso permite que o banco de dados lide corretamente com conversão
        e comparação de fusos horários, tornando queries como "eventos nas últimas 24 horas" precisas
        independentemente das configurações de fuso horário do servidor.
      </p>
      <p>
        Quando for necessário armazenar um Unix timestamp como inteiro bruto (para compatibilidade com
        sistemas externos ou máxima portabilidade), documente claramente se são segundos ou milissegundos,
        e seja consistente em todo o esquema.
      </p>

      <h2>Timestamps em JWTs e APIs</h2>
      <p>
        JSON Web Tokens (JWTs) usam Unix timestamps (em segundos) para suas claims de tempo:
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — emitido em: o momento em que o token foi criado</li>
        <li><strong><code>exp</code></strong> — expiração: o momento após o qual o token não deve ser aceito</li>
        <li><strong><code>nbf</code></strong> — não antes de: o token não deve ser usado antes desse momento</li>
      </ul>
      <p>
        Verificar a expiração de um JWT é uma comparação simples:{" "}
        <code>exp &gt; Math.floor(Date.now() / 1000)</code>.
        Se o tempo atual em segundos for maior que <code>exp</code>, o token expirou.
        Sempre valide <code>exp</code> no servidor — nunca confie apenas em verificações de expiração
        no lado do cliente.
      </p>

      <h2>Referência Rápida: Conversões de Timestamp</h2>
      <p>
        Para conversões rápidas e precisas entre Unix timestamps e datas legíveis, use o{" "}
        <a href="/tools/unix-timestamp">Conversor de Unix Timestamp do BrowseryTools</a>. Cole um
        timestamp para ver a data UTC e local correspondente, ou insira uma data para obter seu timestamp.
        Tudo roda no navegador — sem servidor, sem rastreamento.
      </p>

      <h2>Resumo</h2>
      <p>
        Unix timestamps são uma forma universal e inequívoca de representar momentos no tempo. As regras
        principais: estão sempre em UTC, sempre em segundos (a menos que você esteja em JavaScript, onde{" "}
        <code>Date.now()</code> usa milissegundos), e sempre um inteiro positivo para qualquer data após
        1970. Trate a distinção milissegundos/segundos explicitamente, use UTC para armazenamento e
        transmissão, e converta para hora local apenas na camada de exibição.
      </p>
      <ToolCTA slug="unix-timestamp" variant="card" />
    </div>
  );
}
