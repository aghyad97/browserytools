export default function Content() {
  return (
    <div>
      <p>
        Cada registro de base de datos, recurso de API, evento distribuido y token de sesión necesita
        un identificador único. La elección del formato de ID importa más de lo que parece — afecta a
        la seguridad, el rendimiento de la base de datos, la legibilidad de las URLs y el comportamiento
        del sistema cuando eventualmente corres múltiples servidores o fusionas datos de distintas
        fuentes. Esta guía cubre las principales opciones: UUID (v1, v4, v7), NanoID y CUID, y cuándo
        usar cada uno.
      </p>
      <p>
        Puedes generar UUIDs y otros IDs únicos al instante con el{" "}
        <a href="/tools/uuid-generator">Generador de UUID de BrowseryTools</a> — gratuito, sin
        registro, todo se genera localmente en tu navegador.
      </p>

      <h2>Por qué los IDs autoincremental se quedan cortos</h2>
      <p>
        Los IDs enteros secuenciales (<code>1, 2, 3, ...</code>) son el valor por defecto en la mayoría
        de las bases de datos relacionales y funcionan bien en aplicaciones simples de un solo servidor.
        Pero crean problemas a escala o en sistemas distribuidos:
      </p>
      <ul>
        <li><strong>Predictibilidad</strong> — cualquiera que conozca un ID puede adivinar los demás. <code>/orders/1042</code> deja claro que el pedido 1041 existe y que tu negocio no es grande. Esto es una vulnerabilidad IDOR (Referencia Directa a Objeto Insegura) si no aplicas autorización en la capa de aplicación.</li>
        <li><strong>Conflictos al fusionar</strong> — cuando necesitas combinar datos de dos bases de datos, dos secuencias autoincremental independientes tendrán IDs que colisionan. Los sistemas multitenant, las aplicaciones offline-first y las migraciones topan siempre con este problema.</li>
        <li><strong>Generación distribuida</strong> — si múltiples servidores o trabajadores insertan registros, necesitas un mecanismo de coordinación (una secuencia única o una secuencia a nivel de base de datos) para evitar IDs duplicados. Esto crea un cuello de botella.</li>
        <li><strong>Filtración de métricas del negocio</strong> — los IDs secuenciales revelan el volumen de pedidos, el número de usuarios y la tasa de crecimiento a competidores o investigadores que observan los IDs públicos con el tiempo.</li>
      </ul>

      <h2>¿Qué es un UUID?</h2>
      <p>
        Un UUID (Identificador Universalmente Único, también llamado GUID) es un número de 128 bits que
        se muestra convencionalmente como 32 dígitos hexadecimales en cinco grupos separados por guiones:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx

Ejemplo: 550e8400-e29b-41d4-a716-446655440000
          ^        ^    ^    ^    ^
          |        |    |    |    12 dígitos hex (48 bits)
          |        |    |    bits de variante (N)
          |        |    dígito de versión (M)
          |        4 dígitos hex
          8 dígitos hex`}
      </pre>
      <p>
        El dígito de versión (M) indica qué algoritmo de generación de UUID se utilizó. Los bits de
        variante (N) son siempre <code>8</code>, <code>9</code>, <code>a</code> o <code>b</code> en los
        UUIDs estándar. Los 122 bits restantes están disponibles para los datos identificadores.
      </p>

      <h2>UUID v1: dirección MAC + timestamp</h2>
      <p>
        El UUID v1 combina el timestamp actual (en intervalos de 100 nanosegundos desde el 15 de octubre
        de 1582) con la dirección MAC de la máquina generadora y una secuencia de reloj para gestionar
        la generación rápida. El resultado es teóricamente único en todas las máquinas y en el tiempo.
      </p>
      <p>
        El problema es que los UUID v1 revelan tanto cuándo como dónde se generaron — la dirección MAC
        está incrustada a la vista. Esto es una preocupación de privacidad, y fue explotado en el gusano
        Melissa (1999) para rastrear documentos infectados hasta máquinas específicas. Por esta razón,
        v1 rara vez se usa en aplicaciones nuevas. La mayoría de los desarrolladores que quieren IDs
        ordenados por tiempo recurren a v7.
      </p>

      <h2>UUID v4: aleatorio</h2>
      <p>
        El UUID v4 es la variante más utilizada. Son 122 bits de datos criptográficamente aleatorios
        (los 6 bits restantes codifican la versión y la variante). No hay timestamp, ni dirección MAC,
        ni componente secuencial — solo entropía.
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

      <h2>¿Qué tan improbables son las colisiones en UUID v4?</h2>
      <p>
        Con 122 bits de aleatoriedad, la probabilidad de colisión es extraordinariamente pequeña. Para
        tener un 50 % de probabilidad de al menos una colisión, habría que generar aproximadamente
        2,7 × 10<sup>18</sup> UUIDs — es decir, 2,7 trillones. Si generaras mil millones de UUIDs por
        segundo, tardarías unos 85 años en alcanzar ese umbral. Para cualquier aplicación real, las
        colisiones no son una preocupación práctica. La fuente más probable de IDs duplicados son los
        errores de aplicación (errores de copiar y pegar, aciertos de caché que devuelven IDs antiguos,
        etc.), no el generador en sí.
      </p>

      <h2>UUID v7: aleatorio ordenado por tiempo</h2>
      <p>
        El UUID v7 fue estandarizado en RFC 9562 (2024) para resolver el principal inconveniente práctico
        de v4: los UUIDs aleatorios son malas claves primarias de base de datos porque destruyen la
        localidad del índice. Cuando se insertan registros con IDs aleatorios, cada inserción aterriza
        en una posición aleatoria de un índice B-tree, provocando divisiones de página, fallos de caché
        y fragmentación a escala.
      </p>
      <p>
        El UUID v7 incrusta un timestamp Unix con precisión de milisegundos en los bits más significativos,
        seguido de datos aleatorios. Esto significa que los UUID v7 son ordenables — los registros
        insertados cronológicamente tienen IDs lexicográficamente crecientes — y al mismo tiempo son
        globalmente únicos e impredecibles más allá del límite del milisegundo:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Estructura de UUID v7:
[48 bits: timestamp Unix en ms][4 bits: versión=7][12 bits: aleatorio][2 bits: variante][62 bits: aleatorio]

Tres UUID v7 generados en secuencia:
  0192fe2c-4b3a-7000-8000-0a1b2c3d4e5f  ← el más antiguo
  0192fe2c-4b3b-7001-8000-0a1b2c3d4e60  ← ligeramente posterior
  0192fe2c-4b3c-7002-8000-0a1b2c3d4e61  ← el más reciente
  ^^^^^^^^^^ el prefijo de timestamp aumenta de forma monótona`}
      </pre>
      <p>
        Si estás construyendo una nueva aplicación que usa UUIDs como claves primarias en una base de
        datos relacional, v7 es el valor por defecto correcto a partir de 2024.
      </p>

      <h2>NanoID: más corto y seguro para URLs</h2>
      <p>
        NanoID no es un UUID — es un formato de ID completamente diferente, pero resuelve el mismo
        problema. Por defecto genera una cadena de 21 caracteres usando un alfabeto de caracteres
        seguros para URLs (<code>A-Za-z0-9_-</code>). Esto proporciona 126 bits de entropía —
        comparable al UUID v4 — en una cadena de 21 caracteres en lugar de 36. Las cadenas NanoID son
        compatibles con URLs sin codificación y se ven más limpias en registros y URLs orientadas
        al usuario:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v4:  9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d  (36 caracteres)
NanoID:   V1StGXR8_Z5jdHi6B-myT                  (21 caracteres)

import { nanoid } from 'nanoid';
nanoid();      // → "V1StGXR8_Z5jdHi6B-myT"
nanoid(10);    // → "IRFa-VaY2b"  (longitud personalizada)`}
      </pre>
      <p>
        NanoID es popular para IDs de enlaces cortos, tokens de sesión, códigos de invitación y
        cualquier caso de uso donde el ID aparezca en una URL y se quiera que sea compacto.
      </p>

      <h2>CUID2: ordenable y sin huella digital</h2>
      <p>
        CUID2 (el sucesor de CUID) está diseñado específicamente para usarse como clave primaria en
        bases de datos. Genera una cadena de 24 caracteres que es ordenable por tiempo de creación,
        no usa dirección MAC ni huella digital, y es más difícil de predecir que los IDs basados en
        timestamps. CUID2 usa SHA-3 internamente para mezclar el timestamp con datos aleatorios,
        haciendo que la salida sea impredecible incluso cuando se genera en el mismo milisegundo.
      </p>
      <p>
        CUID2 es una buena elección cuando quieres IDs ordenables, quieres evitar completamente el
        formato UUID y te importa que el ID sea opaco (sin filtrar información del timestamp directamente).
      </p>

      <h2>Elegir el formato correcto</h2>
      <ul>
        <li><strong>Clave primaria de base de datos en proyecto nuevo</strong> — UUID v7 o CUID2. Ambos son ordenables, lo que mantiene el rendimiento del índice a medida que crecen los datos.</li>
        <li><strong>ID único de propósito general con interoperabilidad</strong> — UUID v4. Todos los lenguajes y frameworks entienden el formato UUID de forma nativa.</li>
        <li><strong>Enlaces cortos, códigos de invitación, tokens en URLs</strong> — NanoID. Compacto, seguro para URLs, longitud configurable.</li>
        <li><strong>Sistemas distribuidos donde los IDs se generan del lado del cliente</strong> — UUID v4 o v7. No se necesita coordinación; los clientes generan sus propios IDs antes de confirmar en el servidor.</li>
        <li><strong>Evita v1</strong> — filtra tu dirección MAC. Ningún proyecto nuevo debería usarlo.</li>
      </ul>

      <h2>Rendimiento de UUID como clave primaria</h2>
      <p>
        La advertencia clásica de "no uses UUIDs como claves primarias" se refiere específicamente a
        los UUIDs aleatorios (v4) en MySQL con InnoDB o en cualquier base de datos que agrupe datos
        por clave primaria. El orden de inserción aleatorio fragmenta el índice agrupado. En PostgreSQL
        con un índice UUID no agrupado, la penalización es menos severa pero sigue siendo real a gran
        escala. La solución práctica: usa UUID v7 o CUID2 (que son monótonamente crecientes) y el
        problema de fragmentación desaparece en gran medida. Usa el{" "}
        <a href="/tools/uuid-generator">Generador de UUID de BrowseryTools</a> para generar UUID v7 y
        probar tu esquema antes de comprometerte con un formato.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Generador de UUID gratuito — v1, v4, v7, NanoID, CUID2
        </p>
        <a
          href="/tools/uuid-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir el Generador de UUID →
        </a>
      </div>
    </div>
  );
}
