import Link from 'next/link';
import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Todo desarrollador acaba topándose con el mismo muro: necesitas datos contra los que probar, pero usar datos
        reales de usuarios es un riesgo, el Lorem Ipsum es inútil para cualquier cosa que vaya más allá de rellenar
        párrafos, y crear a mano 500 registros de prueba en JSON es una forma de arruinar una tarde. Los generadores de
        datos falsos existen para resolver exactamente este problema — y el{" "}
        <Link href="/tools/fake-data">Generador de datos falsos de BrowseryTools</Link> lo hace gratis, en local, sin
        cuenta, sin límites de filas y sin suscripción.
      </p>
      <ToolCTA slug="fake-data" variant="inline" />
      <p>
        Esta guía cubre por qué importan los datos falsos realistas, qué produce el generador, cómo usarlo de forma
        eficaz en distintos flujos de trabajo y cómo importar la salida a cada base de datos y cadena de herramientas
        comunes.
      </p>

      <h2>Por qué no puedes usar datos reales de usuarios para pruebas</h2>
      <p>
        Usar datos de producción en entornos de desarrollo o pruebas es un riesgo legal y de cumplimiento bajo
        múltiples marcos normativos:
      </p>
      <ul>
        <li>
          <strong>RGPD (Europa):</strong> el artículo 25 exige la minimización de datos por diseño. Copiar registros
          reales de usuarios — nombres, correos, direcciones — a una base de datos de staging viola este principio a
          menos que los datos se hayan anonimizado correctamente. Una brecha de ese entorno de staging expone los datos
          de personas reales.
        </li>
        <li>
          <strong>HIPAA (sanidad de EE. UU.):</strong> la Información Sanitaria Protegida (PHI) no puede usarse en
          entornos de prueba sin un Acuerdo de Asociación de Negocios o una desidentificación adecuada según los métodos
          de Safe Harbor o de Determinación por Experto. Usar registros reales de pacientes en una base de datos de
          desarrollo es una violación directa de HIPAA.
        </li>
        <li>
          <strong>CCPA (California):</strong> la información personal de los residentes de California conlleva derechos
          y restricciones específicos. Usar registros reales de clientes en cualquier contexto no productivo sin los
          controles adecuados crea una exposición al riesgo innecesaria.
        </li>
      </ul>
      <p>
        Más allá del cumplimiento, hay razones prácticas de ingeniería para evitar los datos reales en las pruebas: los
        datos reales son desordenados de formas impredecibles (tienen campos nulos, caracteres especiales y Unicode que
        las pruebas podrían no estar escritas para manejar), cambian con el tiempo (haciendo las pruebas no
        deterministas) y contienen valores que pueden desencadenar accidentalmente efectos secundarios reales (enviar
        correos a direcciones reales, cobrar a métodos de pago reales).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>La opción predeterminada más segura:</strong> genera datos falsos realistas para cada entorno no
        productivo. Son estructuralmente válidos, nunca identificables, seguros para confirmar en el control de
        versiones y reproducibles. Los datos reales en entornos de desarrollo/prueba son un riesgo por defecto.
      </div>

      <h2>Por qué el Lorem Ipsum es la herramienta equivocada para los datos</h2>
      <p>
        El Lorem Ipsum está bien para rellenar bloques de texto en una maqueta de diseño. Es completamente inadecuado
        para probar interfaces y APIs basadas en datos porque:
      </p>
      <ul>
        <li>
          No pone a prueba las longitudes reales de los campos. Las direcciones de correo, los números de teléfono y los
          códigos postales tienen formatos específicos y longitudes máximas. "Lorem ipsum dolor sit amet" en un campo de
          correo no revelará que tu validación de entrada es incorrecta, pero{" "}
          <code>very.long.name.that.pushes.limits@subdomain.example.com</code> sí lo hará.
        </li>
        <li>
          No revela los casos límite de tu interfaz. Un nombre como "José García-López" pone a prueba tu codificación de
          caracteres. Un nombre de empresa como "O'Brien & Associates, LLC" pone a prueba tu escape de SQL. "Lorem
          ipsum" no prueba ninguno de los dos.
        </li>
        <li>
          Hace que tus maquetas y prototipos parezcan falsos de una forma que importa. Las personas interesadas que
          revisan un prototipo con nombres realistas, ciudades realistas y direcciones de correo realistas pueden
          evaluar el diseño correctamente. El texto de relleno rompe la ilusión y dificulta detectar problemas reales de
          usabilidad.
        </li>
      </ul>

      <h2>Qué produce el Generador de datos falsos de BrowseryTools</h2>
      <p>
        El generador admite una amplia gama de tipos de campo en múltiples categorías. Seleccionas qué campos incluir, y
        cada registro generado contiene valores realistas y con el formato adecuado para cada campo seleccionado:
      </p>

      <h3>Información personal</h3>
      <ul>
        <li><strong>Nombre completo</strong> — combinaciones de nombre + apellido culturalmente realistas</li>
        <li><strong>Nombre</strong> y <strong>apellido</strong> por separado (útil cuando tu esquema los almacena en columnas distintas)</li>
        <li><strong>Dirección de correo electrónico</strong> — con el formato adecuado, usando el nombre generado como la parte local</li>
        <li><strong>Número de teléfono</strong> — formato estadounidense con código de área</li>
        <li><strong>Fecha de nacimiento</strong> — genera adultos de entre 18 y 80 años</li>
        <li><strong>Género</strong> — masculino / femenino / no binario</li>
      </ul>

      <h3>Dirección</h3>
      <ul>
        <li><strong>Dirección postal</strong> — número de casa y nombre de calle realistas</li>
        <li><strong>Ciudad</strong> — nombres reales de ciudades de EE. UU. e internacionales</li>
        <li><strong>Estado</strong> — estados de EE. UU. y equivalentes internacionales</li>
        <li><strong>País</strong></li>
        <li><strong>Código postal</strong> — el formato coincide con el país seleccionado</li>
      </ul>

      <h3>Internet e identidad</h3>
      <ul>
        <li><strong>Nombre de usuario</strong> — generado a partir del nombre con números añadidos para mayor realismo</li>
        <li><strong>URL</strong> — URLs realistas de sitios web personales o de empresa</li>
        <li><strong>Dirección IP</strong> — direcciones IPv4 válidas en rangos públicos</li>
        <li><strong>User agent</strong> — cadenas de user-agent reales de navegadores comunes</li>
      </ul>

      <h3>Finanzas</h3>
      <ul>
        <li>
          <strong>Número de tarjeta de crédito</strong> — pasa la validación del algoritmo de Luhn, así que no será
          rechazado por los validadores de formato; usa prefijos de número de tarjeta realistas (Visa 4xxx, Mastercard
          5xxx) pero no es un número de tarjeta real
        </li>
        <li><strong>IBAN</strong> — formato válido para números de cuenta bancaria europeos</li>
      </ul>

      <h3>Identificadores y campos de sistema</h3>
      <ul>
        <li><strong>UUID</strong> — UUID v4 para claves primarias de bases de datos e IDs de correlación</li>
        <li><strong>SSN</strong> — formato de número de la Seguridad Social de EE. UU. (XXX-XX-XXXX)</li>
        <li><strong>Fechas</strong> y <strong>números aleatorios</strong> dentro de rangos configurables</li>
      </ul>

      <h2>Cómo usar el generador</h2>
      <p>
        Abre <Link href="/tools/fake-data">/tools/fake-data</Link>. La interfaz te ofrece tres controles:
      </p>
      <ol>
        <li>
          <strong>Selecciona tus campos:</strong> marca las casillas de cada tipo de campo que quieras en la salida.
          Puedes seleccionar tan solo un campo (solo direcciones de correo, por ejemplo) o el conjunto completo para
          registros de usuario exhaustivos.
        </li>
        <li>
          <strong>Establece el número de registros:</strong> introduce un número entre 1 y 1000. Para datos semilla de
          pruebas de carga, usa 1000. Para una historia de Storybook o una maqueta de diseño, de 5 a 10 registros suele
          ser suficiente.
        </li>
        <li>
          <strong>Elige el formato de salida:</strong> selecciona JSON o CSV. JSON es mejor para pruebas de API y
          cadenas de herramientas de JavaScript. CSV es mejor para importaciones a bases de datos, revisión en hojas de
          cálculo o herramientas como Postman.
        </li>
      </ol>
      <p>
        Haz clic en "Generar". La salida aparece en el área de texto de abajo. Usa el botón "Copiar" para copiarla a tu
        portapapeles, o "Descargar" para guardar el archivo en local. La generación es instantánea para hasta 1000
        registros — todo el cálculo ocurre en tu navegador.
      </p>

      <h2>Ejemplo de salida JSON</h2>
      <p>
        Aquí tienes un fragmento representativo de 3 registros de salida JSON con campos personales, de dirección y de
        internet seleccionados:
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

      <h2>Ejemplo de salida CSV</h2>
      <p>
        Los mismos datos en formato CSV, listos para importarse a una hoja de cálculo, una base de datos o cualquier
        herramienta que acepte archivos delimitados:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Ejemplo real 1: poblar una base de datos de usuarios para pruebas de carga</h2>
      <p>
        Hacer pruebas de carga de una API de cara al usuario requiere una base de datos poblada. Necesitas suficientes
        registros para simular un rendimiento de consultas, un comportamiento de paginación y una indexación de
        búsqueda realistas — pero no puedes usar datos reales de usuarios, y crear a mano miles de inserts SQL no es
        práctico.
      </p>
      <p>
        Con el generador de datos falsos, genera 1000 registros con todos los campos relevantes del usuario
        seleccionados, descárgalos como CSV y luego impórtalos directamente en tu base de datos:
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

      <h2>Ejemplo real 2: poblar una historia de Storybook o una maqueta de diseño</h2>
      <p>
        Al construir un componente de interfaz — una tabla de usuarios, una tarjeta de contacto, una lista de
        resultados de búsqueda — los datos contra los que pruebas determinan si detectas problemas reales. Una tabla de
        10 usuarios donde uno tiene un nombre muy largo, uno tiene un carácter internacional en su correo y uno tiene
        una ciudad que se ajusta a dos líneas revelará errores de diseño que una tabla de filas de relleno idénticas
        nunca revelaría.
      </p>
      <p>
        Genera de 10 a 20 registros como JSON y pega la salida directamente en tu historia de Storybook o en el archivo
        de fixtures del componente:
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

      <h2>Ejemplo real 3: fixtures de pruebas de integración de API</h2>
      <p>
        Las pruebas de integración para un endpoint de API que crea o actualiza registros de usuario necesitan un
        conjunto de datos de entrada fiable y determinista. En lugar de escribir objetos de fixture a mano, genera un
        conjunto de registros una vez, guarda el archivo JSON en tu directorio de fixtures de pruebas e impórtalo en
        tus pruebas:
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

      <h2>Importar a colecciones de Postman</h2>
      <p>
        Para las pruebas de API con Postman, genera tus registros de prueba como JSON y usa la función de archivo de
        datos de Postman para ejecutar una petición una vez por registro. Guarda la salida JSON como un archivo y luego,
        en Postman: abre el ejecutor de colecciones, selecciona la petición y adjunta el archivo JSON como la fuente de
        "Datos". Postman iterará por cada registro, sustituyendo los valores en el cuerpo de tu petición usando{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code> y una sintaxis de variables similar.
      </p>
      <p>
        Esto convierte una petición POST escrita a mano en una prueba automatizada que se ejecuta contra 100 registros
        de usuario realistas y distintos en segundos — sin requerir la configuración de ningún framework de pruebas.
      </p>

      <h2>BrowseryTools frente a Mockaroo</h2>
      <p>
        Mockaroo es el generador de datos falsos online más conocido. Es una herramienta sólida, pero tiene fricciones
        que BrowseryTools elimina por completo:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Dimensión</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (gratis)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Cuenta requerida", "No", "Sí"],
              ["Límite de filas (gratis)", "1000 por generación", "1000/día en total"],
              ["Suscripción necesaria para más", "No", "Sí (50 $/año)"],
              ["Datos subidos a un servidor", "Nunca", "Sí (esquema + datos)"],
              ["Acceso a API", "N/D", "Solo planes de pago"],
              ["Funciona sin conexión", "Sí (tras cargar la página)", "No"],
              ["Formatos de salida", "JSON, CSV", "JSON, CSV, SQL, Excel y más"],
              ["Variedad de tipos de campo", "Tipos comunes cubiertos", "Muy extensa"],
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
        Si necesitas tipos de campo muy especializados o salida SQL, Mockaroo sigue siendo valioso. Para el caso común —
        generar JSON o CSV realista para registros de usuario — BrowseryTools no requiere configuración de cuenta, ni
        gestión de límites diarios, ni preocupación por que el esquema de tus datos se envíe a un servidor externo.
      </p>

      <h2>Privacidad: toda la generación ocurre en local</h2>
      <p>
        Cada nombre, correo, dirección y UUID que produce el generador lo crea el JavaScript que se ejecuta en la
        pestaña de tu navegador. Los tipos de campo que seleccionas, el número de registros que solicitas y los propios
        datos de salida nunca se transmiten a ningún servidor. BrowseryTools no tiene ningún componente de backend
        involucrado en la generación de datos.
      </p>
      <p>
        Esto importa menos al generar datos falsos específicamente (ya que todo es ficticio por definición), pero
        importa para el esquema contra el que lo estás usando para probar. Si tus selecciones de campos revelan la
        estructura de un sistema interno sensible, esa información también se queda en local.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Datos falsos frente a anonimización de datos:</strong> son herramientas separadas para propósitos
        separados. Un generador de datos falsos crea registros ficticios desde cero — nada se basa en individuos reales.
        Una herramienta de anonimización de datos toma registros reales y los transforma para eliminar la información
        identificable mientras conserva las propiedades estadísticas. Si tienes datos reales de usuarios que necesitas
        usar en un entorno de prueba, la anonimización es la herramienta adecuada (fíjate en herramientas como ARX,
        Amnesia o pg_anonymizer de PostgreSQL). Si necesitas datos de prueba desde cero y no tienes datos reales en los
        que basarte, un generador de datos falsos como este es exactamente lo correcto.
      </div>

      <h2>Genera tu primer conjunto de datos ahora</h2>
      <p>
        Tanto si estás poblando una base de datos para pruebas de carga, llenando una historia de Storybook, escribiendo
        fixtures de pruebas de API o simplemente mostrando una función con algo que parezca real — los datos falsos
        realistas son la base adecuada, y generarlos debería llevar 30 segundos.
      </p>
      <p>
        Abre el <Link href="/tools/fake-data">Generador de datos falsos de BrowseryTools</Link>, selecciona tus campos,
        establece tu número de registros, elige JSON o CSV y pulsa Generar. Sin cuenta, sin límite de filas, sin coste,
        sin que se suba nada a ningún sitio.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Genera datos de prueba realistas en segundos</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Hasta 1000 registros. JSON o CSV. Nombres, correos, direcciones, UUIDs, tarjetas de crédito y más. Gratis, en
          local, sin necesidad de cuenta.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Abrir Generador de datos falsos →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Herramientas relacionadas:{" "}
        <Link href="/tools/json-formatter">Formateador de JSON</Link> ·{" "}
        <Link href="/tools/uuid-generator">Generador de UUID</Link> ·{" "}
        <Link href="/tools/regex-tester">Probador de expresiones regulares</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV a JSON</Link> ·{" "}
        <Link href="/">Todas las BrowseryTools</Link>
      </p>
      <ToolCTA slug="fake-data" variant="card" />
    </div>
  );
}
