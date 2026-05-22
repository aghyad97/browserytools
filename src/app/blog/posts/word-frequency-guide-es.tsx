export default function Content() {
  return (
    <div>
      <p>
        Todo texto es una huella dactilar. Las palabras a las que un autor recurre con más frecuencia,
        los términos que se agrupan en un documento, las frases que se repiten sin que el escritor lo
        note — estos patrones revelan estructura, énfasis y hábito de formas que una simple lectura
        pasa por alto completamente. El análisis de frecuencia de palabras es la técnica que hace
        visibles estos patrones, y es útil en un rango de campos sorprendentemente amplio: artesanía
        de la escritura, SEO, investigación académica e incluso forenses.
      </p>
      <p>
        Puedes analizar la frecuencia de palabras de cualquier texto al instante con el{" "}
        <a href="/tools/word-frequency">Analizador de Frecuencia de Palabras de BrowseryTools</a> —
        gratuito, sin registro, todo se ejecuta en tu navegador.
      </p>

      <h2>Qué revela el análisis de frecuencia de palabras</h2>
      <p>
        En su forma más simple, el análisis de frecuencia de palabras cuenta cuántas veces aparece
        cada palabra en un texto y clasifica los resultados. Pero los conocimientos que produce son
        más ricos de lo que esa descripción sugiere:
      </p>
      <ul>
        <li><strong>Identificación de temas</strong> — las palabras de contenido más frecuentes (tras eliminar las palabras función comunes) te dicen de qué trata principalmente un documento</li>
        <li><strong>Patrones de escritura</strong> — el análisis de frecuencia expone las palabras que un escritor usa habitualmente en exceso, a menudo de forma inconsciente</li>
        <li><strong>Densidad de palabras clave</strong> — en SEO, la frecuencia de las palabras clave objetivo relativa al recuento total de palabras es una señal significativa</li>
        <li><strong>Riqueza del vocabulario</strong> — el ratio de palabras únicas respecto al total de palabras (relación tipo-token) es una medida aproximada de la diversidad léxica</li>
        <li><strong>Señales de autoría</strong> — las frecuencias de palabras función (con qué frecuencia un autor usa "el" frente a "un", o "sin embargo" frente a "pero") son sorprendentemente individuales y consistentes</li>
      </ul>

      <h2>Las palabras vacías y por qué se filtran</h2>
      <p>
        Si ejecutas un análisis de frecuencia de palabras sin procesar en casi cualquier texto en
        español, los resultados más altos serán casi idénticos: "el", "de", "que", "y", "en", "a",
        "los", "es". Estas son las palabras vacías — palabras función de alta frecuencia que transportan
        estructura gramatical pero poco significado semántico. Contarlas no te dice casi nada sobre
        de qué trata un documento.
      </p>
      <p>
        El filtrado de palabras vacías elimina estos términos antes del análisis, dejando solo las
        palabras de contenido que realmente transmiten significado. La lista de palabras vacías para
        el español incluye típicamente:
      </p>
      <ul>
        <li>Artículos: el, la, los, las, un, una, unos, unas</li>
        <li>Preposiciones: de, en, a, por, para, con, sin, sobre, entre, hacia</li>
        <li>Conjunciones: y, o, pero, ni, sino, aunque, porque, que</li>
        <li>Pronombres: yo, tú, él, ella, nosotros, ellos, me, te, se, le, lo, la</li>
        <li>Verbos auxiliares: es, son, está, están, fue, ser, estar, haber, tener, hacer, poder</li>
      </ul>
      <p>
        Diferentes aplicaciones necesitan diferentes listas de palabras vacías. Para el análisis SEO
        podrías querer incluir "cómo", "qué", "mejor" y "top" como palabras vacías porque aparecen
        en casi todos los artículos. Para el análisis de autoría, específicamente quieres las palabras
        función — las palabras vacías convencionales — porque son las huellas estilísticas estables.
      </p>

      <h2>TF-IDF: cuando la frecuencia bruta no es suficiente</h2>
      <p>
        La frecuencia de términos bruta tiene un problema: algunas palabras aparecen con frecuencia en
        un documento simplemente porque aparecen con frecuencia en todos los documentos de ese tipo.
        Si estás analizando artículos de tecnología, palabras como "software", "datos" y "sistema"
        aparecerán con alta frecuencia en todos los artículos — no son útiles para distinguir qué hace
        único a cualquier artículo en particular.
      </p>
      <p>
        TF-IDF (Frecuencia de Término — Frecuencia Inversa de Documento) aborda esto ponderando la
        frecuencia de cada término respecto a su aparición en una colección de documentos. La fórmula es:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`TF-IDF(término, documento) = TF(término, documento) × IDF(término, corpus)

TF = recuento(término en documento) / total de palabras en documento
IDF = log(total de documentos / documentos que contienen el término)`}
      </pre>
      <p>
        Un término que aparece frecuentemente en un documento pero raramente en otros obtiene una
        puntuación TF-IDF alta — es un término distintivo para ese documento. Un término que aparece
        frecuentemente en todas partes obtiene una puntuación TF-IDF baja. Por eso los motores de
        búsqueda usan TF-IDF como señal de relevancia principal: una página que usa "hongos
        micorrícicos" frecuentemente trata genuinamente sobre hongos micorrícicos, mientras que una
        página que usa frecuentemente "el" no trata específicamente de nada.
      </p>

      <h2>Casos de uso para escritores</h2>
      <p>
        El análisis de frecuencia de palabras es una de las herramientas de autoedición más prácticas
        disponibles para escritores. Externaliza patrones que son casi invisibles durante el proceso
        de escritura:
      </p>
      <ul>
        <li>
          <strong>Detectar palabras sobreusadas</strong> — la mayoría de los escritores tienen palabras
          favoritas inconscientes. Ejecutar el análisis de frecuencia en un primer borrador a menudo
          revela que una palabra como "significativo", "claramente" o "importante" aparece un número
          desproporcionado de veces. Ver el número es un estímulo más fuerte para variar el vocabulario
          que cualquier consejo general sobre la repetición de palabras.
        </li>
        <li>
          <strong>Encontrar tics verbales</strong> — las frases de transición como "en otras palabras",
          "como podemos ver" o "vale la pena señalar" a menudo aparecen mucho más de lo que el escritor
          se da cuenta. El análisis de frecuencia las saca a la luz para una revisión específica.
        </li>
        <li>
          <strong>Comprobar el enfoque</strong> — si las palabras que aparecen con más frecuencia en
          tu artículo no coinciden con el tema que pretendías escribir, el borrador puede haberse
          desviado.
        </li>
        <li>
          <strong>Evaluar el nivel de vocabulario</strong> — comparar la distribución de frecuencia
          de palabras simples frente a complejas da una señal aproximada del nivel de lectura.
        </li>
      </ul>
      <p>
        Intenta pegar un borrador de tu propia escritura en el{" "}
        <a href="/tools/word-frequency">Analizador de Frecuencia de Palabras de BrowseryTools</a>. Las
        20 palabras de contenido más frecuentes, tras el filtrado de palabras vacías, deberían reflejar
        de cerca los conceptos centrales del texto. Si no lo hacen, el borrador probablemente necesita
        trabajo estructural.
      </p>

      <h2>Aplicaciones SEO</h2>
      <p>
        Para los profesionales del marketing de contenidos y del SEO, el análisis de frecuencia de
        palabras cumple varias funciones:
      </p>
      <ul>
        <li>
          <strong>Análisis de densidad de palabras clave</strong> — verificar que las palabras clave
          objetivo aparecen con una frecuencia significativa pero natural. No existe un porcentaje
          mágico, pero el relleno excesivo de palabras clave (usar la misma frase 50 veces en un
          artículo de 1.000 palabras) es tanto ilegible como penalizado por los motores de búsqueda,
          mientras que una palabra clave objetivo que nunca aparece es una señal perdida.
        </li>
        <li>
          <strong>Análisis del contenido de la competencia</strong> — analizar la frecuencia de
          palabras de las páginas mejor posicionadas para una palabra clave dada revela qué términos
          y conceptos relacionados aparecen sistemáticamente en el contenido bien posicionado. Esta
          es la base del modelado de temas para SEO.
        </li>
        <li>
          <strong>Identificación de brechas de contenido</strong> — comparar la frecuencia de palabras
          de tu página con la de un competidor muestra qué áreas semánticas cubren ellos que tú no.
        </li>
        <li>
          <strong>Optimización de títulos y encabezados</strong> — analizar qué palabras aparecen en
          los encabezados (H1, H2, H3) de las páginas mejor posicionadas da información directa sobre
          cómo los motores de búsqueda interpretan la estructura del documento.
        </li>
      </ul>

      <h2>Usos académicos y de investigación</h2>
      <p>
        El análisis de frecuencia de palabras tiene una larga historia en la investigación académica,
        especialmente en lingüística, estudios literarios y humanidades digitales:
      </p>
      <ul>
        <li>
          <strong>Atribución de autoría</strong> — las frecuencias de palabras función son tan estables
          e individuales que pueden identificar de forma fiable el estilo de escritura de un autor en
          diferentes obras. Esta técnica se ha usado para atribuir textos históricos en disputa y en
          procedimientos legales que involucran documentos anónimos.
        </li>
        <li>
          <strong>Detección de plagio</strong> — el análisis de frecuencia de elecciones de palabras
          inusuales y frases raras puede identificar pasajes que comparten una fuente incluso cuando
          el texto superficial ha sido parafraseado.
        </li>
        <li>
          <strong>Lingüística de corpus</strong> — analizar la frecuencia de palabras en millones de
          documentos revela cómo cambia el lenguaje con el tiempo, qué términos están aumentando o
          disminuyendo en uso y cómo diferentes comunidades usan el lenguaje de forma diferente. El
          Visor de Ngrams de Google aplica esta técnica a millones de libros digitalizados.
        </li>
        <li>
          <strong>Análisis de sentimiento y modelado de temas</strong> — el análisis de frecuencia de
          palabras con carga emocional (léxicos de sentimiento positivo/negativo) proporciona un proxy
          simple pero útil para el sentimiento en grandes volúmenes de texto como reseñas de clientes
          o publicaciones en redes sociales.
        </li>
      </ul>

      <h2>Cómo actuar sobre los datos de frecuencia</h2>
      <p>
        Los datos de frecuencia solo son útiles si impulsan una acción. Un flujo de trabajo práctico:
      </p>
      <ul>
        <li><strong>Para la escritura</strong> — identifica las cinco palabras más sobreusadas, luego usa Buscar y Reemplazar para localizar cada instancia y decidir conscientemente si conservarla, variarla o eliminarla</li>
        <li><strong>Para SEO</strong> — compara las 20 palabras de contenido más frecuentes de tu página con las 20 de los tres competidores mejor posicionados; añade cobertura para los conceptos que aparecen en los suyos pero no en los tuyos</li>
        <li><strong>Para investigación</strong> — exporta los datos de frecuencia a una hoja de cálculo y ordena por frecuencia para encontrar tanto los términos más comunes (los temas centrales del documento) como los términos únicos menos comunes (el vocabulario distintivo del documento)</li>
        <li><strong>Para la edición</strong> — presta especial atención al lenguaje de cobertura ("algo", "bastante", "relativamente", "un tanto") y a los intensificadores vacíos ("muy", "realmente", "extremadamente") — una alta frecuencia de estos es una señal fiable de que la prosa necesita ajustarse</li>
      </ul>
    </div>
  );
}
