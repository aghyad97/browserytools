export default function Content() {
  return (
    <div>
      <p>
        El texto es la materia prima de casi todo lo que se crea en un ordenador — código, contenido, documentación,
        correo, especificaciones de diseño, textos de marketing, redacción técnica y todo lo demás. Sin embargo, la
        mayoría de la gente improvisa su flujo de trabajo con texto a partir de una mezcla de pesados editores de
        escritorio, lentas aplicaciones web y procesos manuales que fácilmente podrían automatizarse. BrowseryTools
        ofrece un conjunto completo de herramientas de texto gratuitas y basadas en el navegador que cubren todas las
        tareas de texto comunes a las que se enfrentan a diario los escritores, los desarrolladores y los creadores de
        contenido.
      </p>
      <p>
        Ninguna de estas herramientas requiere cuenta. Ninguna muestra anuncios. Todas procesan el texto localmente en
        tu navegador — nada de lo que escribes se envía a un servidor. Esta guía repasa cada herramienta, qué hace y
        exactamente cuándo recurrir a ella.
      </p>

      <h2>Conversor de mayúsculas y minúsculas — deja de reformatear a mano</h2>
      <p>
        El formato de mayúsculas y minúsculas es una de esas pequeñas tareas que aparece constantemente en contextos de
        desarrollo y escritura pero que no tiene un atajo de teclado satisfactorio en la mayoría de los editores. El{" "}
        <a href="/tools/text-case">Conversor de mayúsculas y minúsculas de BrowseryTools</a> maneja todas las
        transformaciones comunes en un único lugar:
      </p>
      <ul>
        <li><strong>camelCase</strong> — para variables de JavaScript y propiedades de objetos: <code>myVariableName</code></li>
        <li><strong>PascalCase</strong> — para nombres de clases y componentes de React: <code>MyComponentName</code></li>
        <li><strong>snake_case</strong> — para variables de Python y nombres de columnas de bases de datos: <code>my_variable_name</code></li>
        <li><strong>SCREAMING_SNAKE_CASE</strong> — para constantes y variables de entorno: <code>MY_ENV_VARIABLE</code></li>
        <li><strong>kebab-case</strong> — para slugs de URL y nombres de clases CSS: <code>my-class-name</code></li>
        <li><strong>Title Case</strong> — para títulos, encabezados y nombres propios: <code>My Article Title</code></li>
        <li><strong>UPPERCASE</strong> y <strong>lowercase</strong> — para todos los casos evidentes</li>
        <li><strong>Sentence case</strong> — pone en mayúscula solo la primera letra de cada oración</li>
      </ul>
      <p>
        Pega cualquier texto, selecciona el formato de destino y copia el resultado. Esto elimina las operaciones
        manuales de buscar y reemplazar que usan los desarrolladores para renombrar variables entre formatos, y la
        edición manual cuidadosa que hacen los escritores al reformatear títulos o encabezados.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Caso de uso para desarrolladores:</strong> recibes un esquema de base de datos con columnas en
        snake_case, pero tu código JavaScript usa camelCase. Pega todos los nombres de columnas en el Conversor de
        mayúsculas y minúsculas, cambia a camelCase y copia la lista convertida. Lo que llevaría varios minutos de
        edición manual lleva segundos.
      </div>

      <h2>Editor de Markdown — escribe y previsualiza simultáneamente</h2>
      <p>
        Markdown se ha convertido en la lengua franca de la documentación técnica, los archivos README, las entradas de
        blog, las notas y cualquier lugar donde el texto necesite un formato ligero sin la sobrecarga de un procesador
        de texto completo. El <a href="/tools/markdown-editor">Editor de Markdown de BrowseryTools</a> proporciona una
        interfaz de panel dividido: escribe Markdown sin formato a la izquierda y ve la vista previa del HTML formateado
        a la derecha, en tiempo real.
      </p>
      <p>
        Esto es de un valor incalculable al redactar contenido para plataformas que aceptan Markdown — GitHub, GitLab,
        Notion, Obsidian, Ghost, Dev.to y muchas otras. También es la forma más rápida de comprobar que tu jerarquía de
        encabezados es correcta, que tus enlaces se resuelven visualmente y que tus bloques de código se representan con
        la sintaxis adecuada antes de hacer commit o publicar.
      </p>
      <h3>Para quién es esta herramienta</h3>
      <ul>
        <li>Desarrolladores que escriben archivos README y documentación</li>
        <li>Redactores técnicos que preparan contenido para plataformas CMS basadas en Markdown</li>
        <li>Estudiantes e investigadores que toman notas estructuradas</li>
        <li>Cualquiera que necesite dar formato a texto para issues de GitHub, descripciones de pull requests o páginas wiki</li>
      </ul>

      <h2>Generador de Lorem Ipsum — rellena espacios con texto de relleno profesional</h2>
      <p>
        Todo diseñador y desarrollador que trabaja en un diseño antes de que el texto final esté listo necesita texto de
        relleno. El estándar ha sido el Lorem Ipsum desde el siglo XVI, y por una buena razón — tiene el ritmo visual de
        un texto latino real sin ningún significado real, lo que evita que los lectores se distraigan con el contenido en
        lugar de evaluar el diseño.
      </p>
      <p>
        El <a href="/tools/lorem-ipsum">Generador de Lorem Ipsum de BrowseryTools</a> te permite especificar exactamente
        cuánto texto de relleno necesitas — por párrafos, oraciones o palabras — y lo genera al instante. Cópialo
        directamente en tu herramienta de diseño, maqueta o plantilla de desarrollo.
      </p>
      <p>
        Esta es una de esas herramientas que lleva treinta segundos usar pero que te ahorra la incómoda experiencia de
        escribir "texto de relleno texto de relleno" repetidamente o de copiar de un artículo de Wikipedia solo para
        llenar un bloque de contenido.
      </p>

      <h2>Contador de texto — conoce tus conteos de caracteres, palabras y párrafos</h2>
      <p>
        Distintos contextos imponen distintas restricciones de longitud de texto. Las plataformas de redes sociales
        tienen límites de caracteres. Las mejores prácticas de SEO especifican longitudes óptimas para las
        metadescripciones (alrededor de 155 caracteres) y para las etiquetas de título (menos de 60 caracteres). Los
        envíos académicos requieren conteos de palabras. Los SMS tienen un límite de 160 caracteres. Los capítulos de
        libros se evalúan por estimaciones de palabras y páginas.
      </p>
      <p>
        El <a href="/tools/text-counter">Contador de texto de BrowseryTools</a> te da conteos en vivo de todas las
        dimensiones simultáneamente: caracteres (con y sin espacios), palabras, oraciones y párrafos. Pega tu texto y
        todos los conteos se actualizan al instante — sin enviar nada, sin recargar, sin esperas.
      </p>
      <p>
        Los escritores pueden usarlo para comprobar la longitud de los artículos. Los desarrolladores pueden verificar
        que un campo de base de datos no desbordará su límite de caracteres. Los creadores de contenido pueden confirmar
        que sus metadescripciones no se truncarán en los resultados de búsqueda.
      </p>

      <h2>Comparador de texto — ve exactamente qué cambió entre dos versiones</h2>
      <p>
        Comparar dos versiones de un documento, un archivo de configuración, una cláusula legal o cualquier bloque de
        texto es una tarea que surge constantemente en la edición, la revisión de código y la gestión de contenido. El{" "}
        <a href="/tools/text-diff">Comparador de texto de BrowseryTools</a> toma dos entradas de texto, las compara línea
        por línea y resalta las adiciones, las eliminaciones y los cambios con un código de colores claro.
      </p>
      <p>
        Es el mismo tipo de vista de diferencias que ves en los pull requests de Git, pero disponible al instante para
        cualquier par de bloques de texto — sin necesidad de un repositorio, sin línea de comandos, sin configuración de
        herramientas.
      </p>
      <h3>Cuándo usar el Comparador de texto</h3>
      <ul>
        <li>Comparar una cláusula contractual revisada con la original para descubrir qué cambió el abogado</li>
        <li>Comprobar qué cambió entre dos versiones de un archivo de configuración que recibiste</li>
        <li>Revisar las ediciones que hizo un colaborador en un documento cuando el control de cambios no estaba activado</li>
        <li>Verificar que un fragmento de código se copió correctamente de una fuente de referencia</li>
        <li>Comparar la salida de dos respuestas de API para encontrar diferencias en la estructura o los valores</li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Recordatorio de privacidad:</strong> el Comparador de texto, como todas las herramientas de
        BrowseryTools, procesa todo localmente en tu navegador. El texto legal confidencial, los archivos de
        configuración propietarios y los documentos empresariales sensibles pueden compararse sin que ningún dato salga
        de tu equipo. Esta es una ventaja importante frente a las herramientas de comparación en la nube que procesan tu
        texto en sus servidores.
      </div>

      <h2>Formateador de HTML — haz que el HTML sea legible (o diminuto)</h2>
      <p>
        El HTML servido desde aplicaciones web de producción suele estar minificado — con todo el espacio en blanco
        eliminado para reducir el tamaño de archivo. Esto lo hace completamente ilegible cuando necesitas inspeccionarlo.
        Por el contrario, el HTML escrito a mano o exportado desde una herramienta puede tener una sangría inconsistente
        y ser difícil de interpretar.
      </p>
      <p>
        El <a href="/tools/html-formatter">Formateador de HTML de BrowseryTools</a> funciona en ambas direcciones:
      </p>
      <ul>
        <li><strong>Formatear/Embellecer:</strong> toma HTML minificado o desordenado y lo genera con una sangría y unos saltos de línea consistentes, haciendo que la estructura sea inmediatamente legible</li>
        <li><strong>Minificar:</strong> toma HTML legible y elimina todo el espacio en blanco innecesario, produciendo la salida más pequeña posible para uso en producción</li>
      </ul>
      <p>
        Los desarrolladores frontend lo usan constantemente al inspeccionar HTML de terceros, depurar plantillas de
        correo o limpiar el HTML generado por editores WYSIWYG (que a menudo producen un marcado verboso y mal
        estructurado).
      </p>

      <h2>Bloc de notas — el cuaderno de borrador siempre listo</h2>
      <p>
        A veces no necesitas un documento con formato ni una herramienta estructurada — solo necesitas un lugar donde
        poner texto ahora mismo. El <a href="/tools/notepad">Bloc de notas de BrowseryTools</a> es un área de texto
        plano que guarda automáticamente todo lo que escribes en localStorage. Cierra el navegador, vuelve a abrirlo y tu
        texto sigue ahí.
      </p>
      <p>
        Es ideal para notas temporales durante una reunión, fragmentos de código que estás a punto de pegar en algún
        sitio, borradores de texto que estás iterando o cualquier texto que necesite vivir en algún lugar durante las
        próximas horas o días. Sin nombre de archivo que elegir, sin diálogo de guardado que cerrar, sin sincronización
        en la nube que esperar. Solo escribe.
      </p>

      <h2>Test de mecanografía — mide y mejora tus PPM</h2>
      <p>
        La velocidad de escritura importa más de lo que la mayoría de la gente reconoce. Un desarrollador que escribe a
        100 PPM frente a otro a 60 PPM gana aproximadamente un 40% más de productividad en todo el trabajo intensivo de
        teclado — no solo escribir código, sino también escribir documentación, correos, mensajes de Slack y mensajes de
        commit. Lo mismo se aplica a escritores, analistas, personal de soporte y cualquier otra persona que pase mucho
        tiempo frente a un teclado.
      </p>
      <p>
        El <a href="/tools/typing-test">Test de mecanografía de BrowseryTools</a> mide tus palabras por minuto y tu
        precisión frente a un pasaje estándar. Te da una referencia honesta de en qué punto estás y, si te pruebas con
        regularidad, una visión clara de si la práctica está mejorando tu velocidad y tu precisión.
      </p>
      <p>
        La mayoría de los adultos escribe entre 40 y 60 PPM. Los mecanógrafos al tacto que han practicado
        deliberadamente suelen alcanzar entre 80 y 100 PPM. Los transcriptores profesionales y los mecanógrafos de
        competición pueden superar las 120-140 PPM. Estés donde estés en ese espectro, el test de mecanografía te da
        datos con los que trabajar.
      </p>

      <h2>Editor de texto enriquecido — edición WYSIWYG en el navegador</h2>
      <p>
        No todo el mundo se siente cómodo con Markdown o HTML, y no todos los contextos requieren un formato técnico. El{" "}
        <a href="/tools/rich-editor">Editor de texto enriquecido de BrowseryTools</a> proporciona una interfaz familiar
        de estilo procesador de texto — negrita, cursiva, subrayado, encabezados, listas, enlaces — donde ves el
        resultado formateado mientras escribes, sin necesidad de conocer ninguna sintaxis de marcado.
      </p>
      <p>
        Esto es útil para redactar contenido con formato que se pegará en un cliente de correo, un campo de texto
        enriquecido de un CMS, una herramienta de presentaciones o cualquier contexto que acepte texto con formato.
        También es una forma limpia de dar formato a texto cuando colaboras con miembros del equipo no técnicos que no
        se sienten cómodos con Markdown.
      </p>

      <h2>Por qué un solo conjunto en lugar de nueve sitios web distintos</h2>
      <p>
        La alternativa habitual a BrowseryTools es buscar cada herramienta de forma individual cuando la necesitas —
        "comparador de texto online", "generador de lorem ipsum", "formateador de HTML" — y aterrizar en un sitio web
        diferente cada vez. Esos sitios web suelen llevar anuncios, pueden imponer límites de conteo de palabras, a
        menudo requieren crear una cuenta para ciertas funciones y varían mucho en calidad y fiabilidad.
      </p>
      <p>
        Tener todas estas herramientas en un solo lugar significa que sabes exactamente a dónde ir y qué esperar. La
        interfaz es consistente. No hay anuncios. No hay límites en la longitud del texto. Y como todo se procesa
        localmente, no hay riesgo para la privacidad sin importar qué texto pegues.
      </p>
      <p>
        Guarda BrowseryTools en marcadores, o fija algunas pestañas, y estas herramientas estarán listas en el momento
        en que las necesites — lo que, si escribes código o contenido para ganarte la vida, es probablemente varias
        veces hoy.
      </p>
    </div>
  );
}
