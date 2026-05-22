import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Todo desenvolvedor cedo ou tarde esbarra na mesma parede: você precisa de dados para testar, mas usar
        dados reais de usuários é um risco, o Lorem Ipsum é inútil para qualquer coisa além de preencher parágrafos e
        criar 500 registros de teste em JSON à mão é uma forma de arruinar uma tarde. Os geradores de dados falsos
        existem para resolver exatamente esse problema — e o{" "}
        <Link href="/tools/fake-data">Gerador de Dados Falsos do BrowseryTools</Link> faz isso de graça, localmente,
        sem conta, sem limites de linhas e sem assinatura.
      </p>
      <p>
        Este guia cobre por que dados falsos realistas importam, o que o gerador produz, como usá-lo
        de forma eficaz em diferentes fluxos de trabalho e como importar a saída para todos os bancos de dados
        e cadeias de ferramentas comuns.
      </p>

      <h2>Por que você não pode usar dados reais de usuários para testes</h2>
      <p>
        Usar dados de produção em ambientes de desenvolvimento ou teste é um risco de conformidade e legal sob
        múltiplos marcos regulatórios:
      </p>
      <ul>
        <li>
          <strong>GDPR (Europa):</strong> O Artigo 25 exige a minimização de dados desde a concepção. Copiar
          registros reais de usuários — nomes, e-mails, endereços — para um banco de dados de homologação viola esse princípio
          a menos que os dados tenham sido devidamente anonimizados. Uma violação desse ambiente de homologação expõe
          os dados de pessoas reais.
        </li>
        <li>
          <strong>HIPAA (saúde nos EUA):</strong> As Informações de Saúde Protegidas (PHI) não podem ser usadas em
          ambientes de teste sem um Business Associate Agreement ou uma desidentificação adequada
          pelos métodos Safe Harbor ou Expert Determination. Usar registros reais de pacientes em um banco de dados de
          desenvolvimento é uma violação direta da HIPAA.
        </li>
        <li>
          <strong>CCPA (Califórnia):</strong> As informações pessoais de residentes da Califórnia têm
          direitos e restrições específicos. Usar registros reais de clientes em qualquer contexto fora de produção
          sem controles apropriados cria uma exposição a risco desnecessária.
        </li>
      </ul>
      <p>
        Além da conformidade, há razões práticas de engenharia para evitar dados reais em testes: os dados
        reais são bagunçados de formas imprevisíveis (têm campos nulos, caracteres especiais e Unicode que
        os testes podem não ter sido escritos para tratar), mudam ao longo do tempo (tornando os testes não determinísticos)
        e contêm valores que podem acionar acidentalmente efeitos colaterais reais (enviar e-mails para endereços
        reais, cobrar métodos de pagamento reais).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>O padrão mais seguro:</strong> Gere dados falsos realistas para todo ambiente fora de
        produção. Eles são estruturalmente válidos, nunca identificáveis, seguros para versionar no controle de versão
        e reproduzíveis. Dados reais em ambientes de desenvolvimento/teste são um risco por padrão.
      </div>

      <h2>Por que o Lorem Ipsum é a ferramenta errada para dados</h2>
      <p>
        O Lorem Ipsum serve bem para preencher blocos de texto em um mockup de layout. Ele é completamente errado para
        testar interfaces e APIs orientadas a dados porque:
      </p>
      <ul>
        <li>
          Ele não estressa os comprimentos reais dos campos. Endereços de e-mail, números de telefone e CEPs
          têm formatos e comprimentos máximos específicos. "Lorem ipsum dolor sit amet" em um campo de
          e-mail não vai revelar que a sua validação de entrada está errada, mas{" "}
          <code>very.long.name.that.pushes.limits@subdomain.example.com</code> vai.
        </li>
        <li>
          Ele não revela casos extremos na sua interface. Um nome como "José García-López" testa sua
          codificação de caracteres. Um nome de empresa como "O'Brien & Associates, LLC" testa seu escape de
          SQL. "Lorem ipsum" não testa nenhum dos dois.
        </li>
        <li>
          Ele faz seus mockups e protótipos parecerem falsos de uma forma que importa. Stakeholders que revisam
          um protótipo com nomes realistas, cidades realistas e endereços de e-mail realistas conseguem avaliar
          o design adequadamente. Texto provisório quebra a ilusão e dificulta detectar
          problemas reais de usabilidade.
        </li>
      </ul>

      <h2>O que o Gerador de Dados Falsos do BrowseryTools produz</h2>
      <p>
        O gerador suporta uma ampla gama de tipos de campo em várias categorias. Você seleciona
        quais campos incluir, e cada registro gerado contém valores realistas e devidamente formatados
        para cada campo selecionado:
      </p>

      <h3>Informações pessoais</h3>
      <ul>
        <li><strong>Nome completo</strong> — combinações culturalmente realistas de nome + sobrenome</li>
        <li><strong>Nome</strong> e <strong>sobrenome</strong> separadamente (útil quando seu esquema os armazena em colunas diferentes)</li>
        <li><strong>Endereço de e-mail</strong> — devidamente formatado, usando o nome gerado como a parte local</li>
        <li><strong>Número de telefone</strong> — formato dos EUA com código de área</li>
        <li><strong>Data de nascimento</strong> — gera adultos entre 18 e 80 anos</li>
        <li><strong>Gênero</strong> — masculino / feminino / não binário</li>
      </ul>

      <h3>Endereço</h3>
      <ul>
        <li><strong>Endereço (logradouro)</strong> — número da casa e nome da rua realistas</li>
        <li><strong>Cidade</strong> — nomes reais de cidades dos EUA e internacionais</li>
        <li><strong>Estado</strong> — estados dos EUA e equivalentes internacionais</li>
        <li><strong>País</strong></li>
        <li><strong>CEP / código postal</strong> — o formato corresponde ao país selecionado</li>
      </ul>

      <h3>Internet e identidade</h3>
      <ul>
        <li><strong>Nome de usuário</strong> — gerado a partir do nome com números anexados para dar realismo</li>
        <li><strong>URL</strong> — URLs realistas de sites pessoais ou de empresas</li>
        <li><strong>Endereço IP</strong> — endereços IPv4 válidos em faixas públicas</li>
        <li><strong>User agent</strong> — strings reais de user-agent de navegadores comuns</li>
      </ul>

      <h3>Finanças</h3>
      <ul>
        <li>
          <strong>Número de cartão de crédito</strong> — passa na validação do algoritmo de Luhn, então não será
          rejeitado por validadores de formato; usa prefixos realistas de número de cartão (Visa 4xxx, Mastercard 5xxx),
          mas não é um número de cartão real
        </li>
        <li><strong>IBAN</strong> — formato válido para números de conta bancária europeus</li>
      </ul>

      <h3>Identificadores e campos de sistema</h3>
      <ul>
        <li><strong>UUID</strong> — UUID v4 para chaves primárias de banco de dados e IDs de correlação</li>
        <li><strong>SSN</strong> — formato do número de Seguro Social dos EUA (XXX-XX-XXXX)</li>
        <li><strong>Datas</strong> e <strong>números aleatórios</strong> dentro de faixas configuráveis</li>
      </ul>

      <h2>Como usar o gerador</h2>
      <p>
        Abra <Link href="/tools/fake-data">/tools/fake-data</Link>. A interface oferece três controles:
      </p>
      <ol>
        <li>
          <strong>Selecione seus campos:</strong> Marque as caixas de cada tipo de campo que você quer na
          saída. Você pode selecionar apenas um campo (somente endereços de e-mail, por exemplo) ou o conjunto
          completo para registros de usuário abrangentes.
        </li>
        <li>
          <strong>Defina a quantidade de registros:</strong> Insira um número entre 1 e 1.000. Para dados de seed
          de teste de carga, use 1.000. Para uma story do Storybook ou um mockup de design, de 5 a 10 registros costuma ser suficiente.
        </li>
        <li>
          <strong>Escolha o formato de saída:</strong> Selecione JSON ou CSV. O JSON é melhor para testes de API
          e cadeias de ferramentas JavaScript. O CSV é melhor para importações em banco de dados, revisão em planilha ou ferramentas
          como o Postman.
        </li>
      </ol>
      <p>
        Clique em "Gerar". A saída aparece na área de texto abaixo. Use o botão "Copiar" para copiá-la
        para a área de transferência ou "Baixar" para salvar o arquivo localmente. A geração é instantânea para até
        1.000 registros — todo o processamento acontece no seu navegador.
      </p>

      <h2>Exemplo de saída em JSON</h2>
      <p>
        Aqui está um trecho representativo de 3 registros de saída em JSON com campos pessoais, de endereço e de
        internet selecionados:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`[
  {
    "id": "a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e",
    "firstName": "Meredith",
    "lastName": "Okafor",
    "email": "meredith.okafor47@mailbox.net",
    "phone": "(312) 554-8821",
    "dateOfBirth": "1988-03-14",
    "gender": "female",
    "street": "2841 Birchwood Drive",
    "city": "Columbus",
    "state": "OH",
    "zipCode": "43215",
    "country": "United States",
    "username": "meredith_okafor88",
    "ipAddress": "74.125.224.18"
  },
  {
    "id": "b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f",
    "firstName": "Derek",
    "lastName": "Nascimento",
    "email": "d.nascimento@webfrontier.io",
    "phone": "(415) 703-2294",
    "dateOfBirth": "1995-11-02",
    "gender": "male",
    "street": "509 Elmwood Court",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "country": "United States",
    "username": "derek_n95",
    "ipAddress": "192.0.2.147"
  },
  {
    "id": "c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a",
    "firstName": "Simone",
    "lastName": "Bertrand",
    "email": "simone.bertrand@alphamail.com",
    "phone": "(617) 889-4471",
    "dateOfBirth": "1979-07-28",
    "gender": "female",
    "street": "77 Harborview Terrace",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "United States",
    "username": "simone_b79",
    "ipAddress": "203.0.113.42"
  }
]`}</code></pre>

      <h2>Exemplo de saída em CSV</h2>
      <p>
        Os mesmos dados em formato CSV, prontos para importar em uma planilha, um banco de dados ou qualquer ferramenta que
        aceite arquivos delimitados:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Exemplo do mundo real 1: alimentar um banco de dados de usuários para teste de carga</h2>
      <p>
        Fazer teste de carga em uma API voltada ao usuário exige um banco de dados populado. Você precisa de registros suficientes para
        simular o desempenho realista de consultas, o comportamento de paginação e a indexação de busca — mas não pode
        usar dados reais de usuários, e criar milhares de inserts SQL à mão não é prático.
      </p>
      <p>
        Com o gerador de dados falsos, gere 1.000 registros com todos os campos relevantes de usuário selecionados,
        baixe como CSV e, então, importe diretamente para o seu banco de dados:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`-- PostgreSQL: import CSV directly into users table
COPY users (id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code)
FROM '/path/to/fake_users.csv'
DELIMITER ','
CSV HEADER;

-- MySQL equivalent:
LOAD DATA LOCAL INFILE '/path/to/fake_users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;

-- MongoDB (using mongoimport):
mongoimport --db myapp --collection users --type csv --headerline --file fake_users.csv`}</code></pre>

      <h2>Exemplo do mundo real 2: popular uma story do Storybook ou um mockup de design</h2>
      <p>
        Ao construir um componente de interface — uma tabela de usuários, um cartão de contato, uma lista de resultados de busca — os dados
        contra os quais você testa moldam se você detecta problemas reais. Uma tabela de 10 usuários em que um tem um
        nome muito longo, um tem um caractere internacional no e-mail e um tem uma cidade que
        quebra em duas linhas vai revelar bugs de layout que uma tabela de linhas provisórias idênticas nunca
        revelaria.
      </p>
      <p>
        Gere de 10 a 20 registros em JSON e cole a saída diretamente na sua story do Storybook ou
        no arquivo de fixture do componente:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// UserTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from './UserTable';

// Paste generated JSON directly from BrowseryTools:
const fakeUsers = [
  { id: "a3f7c2e1...", firstName: "Meredith", lastName: "Okafor", email: "meredith.okafor47@mailbox.net", city: "Columbus" },
  { id: "b8e2d5f1...", firstName: "Derek", lastName: "Nascimento", email: "d.nascimento@webfrontier.io", city: "Portland" },
  // ... more records
];

const meta: Meta<typeof UserTable> = { component: UserTable };
export default meta;

export const WithData: StoryObj<typeof UserTable> = {
  args: { users: fakeUsers },
};`}</code></pre>

      <h2>Exemplo do mundo real 3: fixtures de testes de integração de API</h2>
      <p>
        Testes de integração para um endpoint de API que cria ou atualiza registros de usuário precisam de um conjunto confiável e
        determinístico de dados de entrada. Em vez de escrever objetos de fixture à mão, gere um conjunto de
        registros uma vez, salve o arquivo JSON no diretório de fixtures de teste e importe-o nos seus testes:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// tests/fixtures/users.json — generated by BrowseryTools, committed to version control
// tests/api/users.test.ts

import users from '../fixtures/users.json';
import { createUser } from '../../src/api/users';

describe('POST /api/users', () => {
  it.each(users.slice(0, 10))('creates user with valid data (%s)', async (user) => {
    const response = await createUser(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
  });
});`}</code></pre>

      <h2>Importando em coleções do Postman</h2>
      <p>
        Para testes de API com o Postman, gere seus registros de teste em JSON e use o recurso de arquivo de dados
        do Postman para executar uma requisição uma vez por registro. Salve a saída JSON como um arquivo e, então, no Postman:
        abra o runner da sua coleção, selecione a requisição e anexe o arquivo JSON como a fonte "Data".
        O Postman vai iterar por cada registro, substituindo os valores no corpo da sua requisição usando{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code> e sintaxe de variável semelhante.
      </p>
      <p>
        Isso transforma uma requisição POST escrita manualmente em um teste automatizado que roda contra 100
        registros de usuário realistas diferentes em segundos — sem exigir nenhuma configuração de framework de teste.
      </p>

      <h2>BrowseryTools vs. Mockaroo</h2>
      <p>
        O Mockaroo é o gerador de dados falsos online mais conhecido. É uma ferramenta sólida, mas tem
        atritos que o BrowseryTools remove inteiramente:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Dimensão</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (Gratuito)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Conta necessária", "Não", "Sim"],
              ["Limite de linhas (gratuito)", "1.000 por geração", "1.000/dia no total"],
              ["Assinatura necessária para mais", "Não", "Sim (US$ 50/ano)"],
              ["Dados enviados a um servidor", "Nunca", "Sim (esquema + dados)"],
              ["Acesso por API", "N/D", "Apenas planos pagos"],
              ["Funciona offline", "Sim (após o carregamento da página)", "Não"],
              ["Formatos de saída", "JSON, CSV", "JSON, CSV, SQL, Excel e mais"],
              ["Variedade de tipos de campo", "Tipos comuns cobertos", "Muito extensa"],
            ].map(([dim, bt, moc], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{dim}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{moc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Se você precisa de tipos de campo altamente especializados ou de saída em SQL, o Mockaroo continua valioso. Para o
        caso comum — gerar JSON ou CSV realista para registros de usuário — o BrowseryTools não exige
        configuração de conta, gerenciamento de limite diário nem preocupação com o seu esquema de dados sendo enviado a
        um servidor de terceiros.
      </p>

      <h2>Privacidade: toda a geração acontece localmente</h2>
      <p>
        Cada nome, e-mail, endereço e UUID que o gerador produz é criado por JavaScript rodando
        na aba do seu navegador. Os tipos de campo que você seleciona, a quantidade de registros que você solicita e os
        próprios dados de saída nunca são transmitidos a qualquer servidor. O BrowseryTools não tem nenhum componente de backend
        envolvido na geração de dados.
      </p>
      <p>
        Isso importa menos ao gerar dados falsos especificamente (já que tudo é fictício por
        definição), mas importa para o esquema contra o qual você está usando os dados para testar. Se as suas
        seleções de campo revelam a estrutura de um sistema interno sensível, essa informação também permanece local.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Dados falsos vs. anonimização de dados:</strong> São ferramentas separadas para propósitos
        separados. Um gerador de dados falsos cria registros fictícios do zero — nada é baseado em
        indivíduos reais. Uma ferramenta de anonimização de dados pega registros reais e os transforma para remover
        informações identificadoras preservando propriedades estatísticas. Se você tem dados reais de usuários
        que precisa usar em um ambiente de teste, a anonimização é a ferramenta apropriada (veja
        ferramentas como ARX, Amnesia ou o pg_anonymizer do PostgreSQL). Se você precisa de dados de teste do zero
        e não tem dados reais para se basear, um gerador de dados falsos como este é exatamente o que você precisa.
      </div>

      <h2>Gere seu primeiro conjunto de dados agora</h2>
      <p>
        Seja alimentando um banco de dados de teste de carga, populando uma story do Storybook, escrevendo fixtures de
        teste de API ou apenas demonstrando um recurso com algo que pareça real — dados falsos realistas são a
        base certa, e gerá-los deveria levar 30 segundos.
      </p>
      <p>
        Abra o <Link href="/tools/fake-data">Gerador de Dados Falsos do BrowseryTools</Link>, selecione seus campos,
        defina a quantidade de registros, escolha JSON ou CSV e clique em Gerar. Sem conta, sem limite de linhas, sem custo,
        nada enviado para lugar nenhum.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Gere dados de teste realistas em segundos</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Até 1.000 registros. JSON ou CSV. Nomes, e-mails, endereços, UUIDs, cartões de crédito e mais.
          Grátis, local, sem necessidade de conta.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Abrir Gerador de Dados Falsos →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Ferramentas relacionadas:{" "}
        <Link href="/tools/json-formatter">Formatador de JSON</Link> ·{" "}
        <Link href="/tools/uuid-generator">Gerador de UUID</Link> ·{" "}
        <Link href="/tools/regex-tester">Testador de Regex</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV para JSON</Link> ·{" "}
        <Link href="/">Todas as BrowseryTools</Link>
      </p>
    </div>
  );
}
