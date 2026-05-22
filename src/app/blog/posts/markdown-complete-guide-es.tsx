export default function Content() {
  return (
    <div>
      <p>
        Markdown está en todas partes. Es el formato de escritura predeterminado en GitHub, la columna
        vertebral de la mayoría de los generadores de sitios estáticos, el lenguaje nativo de
        herramientas como Obsidian y Notion, y el formato al que recurren los desarrolladores para
        escribir READMEs, documentación y notas técnicas. A pesar de ser ubicuo, muchos escritores y
        desarrolladores solo aprenden lo básico — negrita, cursiva y algunos niveles de encabezado —
        y se pierden las características que hacen a Markdown genuinamente potente para la escritura
        estructurada.
      </p>
      <p>
        Puedes escribir y previsualizar Markdown al instante con el{" "}
        <a href="/tools/markdown-editor">Editor Markdown de BrowseryTools</a> — gratuito, sin registro,
        todo se ejecuta en tu navegador.
      </p>

      <h2>Quién creó Markdown y por qué</h2>
      <p>
        Markdown fue creado por John Gruber, en colaboración con Aaron Swartz, y publicado en 2004. El
        objetivo declarado de Gruber era crear un formato de escritura en texto plano que sea legible
        tal cual — antes de cualquier renderizado — y que se convierta limpiamente a HTML válido. El
        nombre es un juego de palabras con "markup language" (lenguaje de marcado — HTML es HyperText
        Markup Language), invirtiendo el concepto: en lugar de añadir sintaxis para controlar el
        formato, Markdown usa los hábitos de puntuación natural que la gente ya había desarrollado
        en el correo electrónico en texto plano.
      </p>
      <p>
        La motivación era práctica. HTML es verboso y distrae al escribirlo en línea. Una oración como{" "}
        <code>&lt;p&gt;Esto es un texto &lt;strong&gt;importante&lt;/strong&gt;.&lt;/p&gt;</code>{" "}
        requiere una carga mental significativa comparada con{" "}
        <code>Esto es un texto **importante**.</code> Gruber quería que los blogueros y escritores se
        centraran en las palabras, no en las etiquetas. La especificación original de Markdown era un
        script Perl que convertía archivos Markdown en texto plano a HTML.
      </p>

      <h2>Sintaxis básica</h2>
      <p>
        La sintaxis principal de Markdown cubre todo lo que la mayoría de los escritores necesitan
        para documentos estructurados.
      </p>

      <h3>Encabezados</h3>
      <p>
        Usa almohadillas para crear encabezados. Una almohadilla para H1, dos para H2, hasta seis para
        H6. La mayoría de las guías de estilo recomiendan un solo H1 por documento (típicamente el
        título) y usar H2–H4 para la jerarquía del contenido.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Encabezado 1
## Encabezado 2
### Encabezado 3
#### Encabezado 4`}
      </pre>

      <h3>Énfasis y negrita</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`*cursiva* o _cursiva_
**negrita** o __negrita__
***negrita y cursiva***
~~tachado~~`}
      </pre>

      <h3>Enlaces e imágenes</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`[Texto del enlace](https://example.com)
[Enlace con título](https://example.com "Título de la página")
![Texto alternativo](image.png)
![Texto alternativo](image.png "Título de la imagen")`}
      </pre>

      <h3>Listas</h3>
      <p>
        Las listas desordenadas usan guiones, asteriscos o signos más. Las listas ordenadas usan números
        seguidos de puntos. Los elementos sangrados (2 o 4 espacios) crean listas anidadas.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- Elemento desordenado
- Otro elemento
  - Elemento anidado

1. Primero
2. Segundo
3. Tercero`}
      </pre>

      <h3>Código</h3>
      <p>
        El código en línea usa tildes graves simples. Los bloques de código delimitados usan tres
        tildes graves con un identificador de lenguaje opcional para el resaltado de sintaxis.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Usa \`console.log()\` para depurar.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``}
      </pre>

      <h3>Citas en bloque</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`> Esto es una cita en bloque.
> Puede abarcar varias líneas.
>
> > Las citas en bloque anidadas también funcionan.`}
      </pre>

      <h3>Reglas horizontales</h3>
      <p>
        Tres o más guiones, asteriscos o subrayados solos en una línea crean una regla horizontal.
        <code>---</code> es la convención más habitual.
      </p>

      <h2>Sintaxis extendida</h2>
      <p>
        La especificación original de Markdown omitió varias características que los escritores
        necesitan habitualmente. La sintaxis extendida, compatible con la mayoría de los procesadores
        modernos, añade estas capacidades.
      </p>

      <h3>Tablas</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`| Columna 1 | Columna 2 | Columna 3 |
|-----------|:---------:|----------:|
| Izquierda | Centro    | Derecha   |
| alineada  | alineado  | alineada  |`}
      </pre>
      <p>
        La posición de los dos puntos en la fila separadora controla la alineación: izquierda
        (predeterminada), centro (dos puntos en ambos lados) o derecha (dos puntos a la derecha).
      </p>

      <h3>Listas de tareas</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- [x] Escribir el primer borrador
- [x] Revisión por pares
- [ ] Ediciones finales
- [ ] Publicar`}
      </pre>

      <h3>Notas al pie</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Aquí hay una afirmación que necesita una cita.[^1]

[^1]: La fuente de apoyo o explicación va aquí.`}
      </pre>

      <h2>Variantes de Markdown: CommonMark, GFM y MDX</h2>
      <p>
        La especificación original de Markdown tenía ambigüedades — lugares donde los procesadores
        tomaban decisiones diferentes sobre casos extremos. Esto llevó a implementaciones incompatibles
        entre diferentes herramientas. Varios esfuerzos de estandarización surgieron para resolverlo.
      </p>
      <ul>
        <li>
          <strong>CommonMark</strong> — una especificación rigurosa que resuelve cada ambigüedad en
          la especificación original de Markdown con una suite de pruebas formal. Adoptada por Discourse,
          Reddit, Stack Overflow y muchos otros. La variante más interoperable.
        </li>
        <li>
          <strong>GitHub Flavored Markdown (GFM)</strong> — la extensión de CommonMark de GitHub que
          añade tablas, listas de tareas, tachado, autoenlaces y URLs literales. Si escribes archivos
          README o comentarios en GitHub, estás usando GFM.
        </li>
        <li>
          <strong>MDX</strong> — Markdown extendido con soporte de componentes JSX, usado ampliamente
          en sitios de documentación basados en React (docs de Next.js, Docusaurus, Astro). Permite
          importar e incrustar componentes React directamente en archivos Markdown.
        </li>
        <li>
          <strong>MultiMarkdown / Pandoc Markdown</strong> — extensiones con muchas funciones para
          escritura académica, con soporte para citas, ecuaciones matemáticas (LaTeX) y formatos de
          tabla complejos.
        </li>
      </ul>

      <h2>Dónde se usa Markdown</h2>
      <ul>
        <li><strong>GitHub y GitLab</strong> — los archivos README, issues, pull requests, wikis y comentarios se renderizan con Markdown</li>
        <li><strong>Notion</strong> — admite importación/exportación de Markdown y un subconjunto de atajos de Markdown para el formato en línea</li>
        <li><strong>Obsidian</strong> — una aplicación de gestión del conocimiento construida completamente sobre archivos Markdown con extensiones de wikienlaces</li>
        <li><strong>Generadores de sitios estáticos</strong> — Jekyll, Hugo, Gatsby, Astro y Next.js usan todos Markdown o MDX como formato de contenido predeterminado</li>
        <li><strong>Plataformas de documentación</strong> — ReadTheDocs, GitBook y Docusaurus están construidos alrededor de Markdown</li>
        <li><strong>Plataformas de chat</strong> — Slack, Discord y Teams admiten subconjuntos de Markdown para el formato de mensajes</li>
        <li><strong>Clientes de correo electrónico</strong> — algunos clientes (Superhuman, HEY) admiten la entrada en Markdown</li>
      </ul>

      <h2>Markdown frente a editores de texto enriquecido</h2>
      <p>
        Los editores de texto enriquecido (WYSIWYG — What You See Is What You Get / Lo que ves es lo
        que obtienes) como Google Docs, Microsoft Word o el editor integrado de Contentful muestran el
        resultado formateado mientras escribes. Markdown muestra el código fuente sin procesar. Los
        compromisos son reales.
      </p>
      <ul>
        <li><strong>Ventajas de Markdown</strong> — archivos de texto plano, funciona en cualquier editor, controlable con git, sin dependencia de proveedores, flujo de trabajo rápido solo con teclado</li>
        <li><strong>Ventajas del texto enriquecido</strong> — inmediatamente visual, sin sintaxis que aprender, más fácil para colaboradores no técnicos, mejor para formatos complejos (notas al pie, comentarios, control de cambios)</li>
      </ul>
      <p>
        Para escritura técnica, documentación de desarrolladores y gestión personal del conocimiento,
        la portabilidad y la compatibilidad con el control de versiones de Markdown lo convierten en
        la mejor opción. Para documentos empresariales colaborativos o contenido con requisitos de
        formato complejos, un editor de texto enriquecido suele ser más práctico.
      </p>

      <h2>Errores habituales en Markdown</h2>
      <ul>
        <li><strong>Líneas en blanco faltantes</strong> — la mayoría de los elementos de bloque (encabezados, listas, bloques de código) requieren una línea en blanco antes y después para renderizarse correctamente</li>
        <li><strong>Espacios después de las almohadillas</strong> — <code>##Encabezado</code> sin espacio después de las almohadillas no es un encabezado en la mayoría de los procesadores</li>
        <li><strong>Marcadores de lista inconsistentes</strong> — mezclar <code>-</code> y <code>*</code> en la misma lista puede producir resultados inesperados en algunos procesadores</li>
        <li><strong>Olvidar escapar caracteres especiales</strong> — los asteriscos, subrayados y tildes graves dentro del texto necesitan un escape de barra invertida si deben renderizarse literalmente</li>
        <li><strong>Asumir que la sintaxis extendida es universal</strong> — las tablas y las listas de tareas son características de GFM no compatibles con todos los procesadores; comprueba tu entorno objetivo</li>
      </ul>
      <p>
        El <a href="/tools/markdown-editor">Editor Markdown de BrowseryTools</a> proporciona una
        vista previa en vivo para que puedas detectar problemas de renderizado inmediatamente mientras
        escribes, sin necesidad de copiar el texto en otra herramienta. Pega tu Markdown y ve el
        resultado HTML renderizado en paralelo.
      </p>
    </div>
  );
}
