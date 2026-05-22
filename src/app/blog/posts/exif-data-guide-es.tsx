export default function Content() {
  return (
    <div>
      <p>
        Cada foto que tomas con un smartphone moderno o una cámara digital incrusta un registro detallado
        de metadatos directamente dentro del archivo de imagen. Estos metadatos — llamados datos EXIF —
        registran dónde estabas, exactamente a qué hora presionaste el obturador, qué dispositivo
        usaste y decenas de ajustes técnicos. La mayoría de las personas no sabe que existen. Muchos
        no saben lo específicos que son. Esta guía explica qué captura EXIF, cuáles son las
        implicaciones para la privacidad y cómo verlo o eliminarlo.
      </p>
      <p>
        Puedes inspeccionar los metadatos EXIF de cualquier foto con el{" "}
        <a href="/tools/exif-viewer">Visor EXIF de BrowseryTools</a> — gratuito, sin registro, y la
        imagen nunca sale de tu navegador.
      </p>

      <h2>¿Qué son los datos EXIF?</h2>
      <p>
        EXIF significa Exchangeable Image File Format (Formato de Archivo de Imagen Intercambiable).
        Fue definido en 1995 por la Japan Electronic Industries Development Association (JEIDA) y
        posteriormente estandarizado por JEITA. La especificación EXIF define un conjunto de etiquetas
        de metadatos que pueden incrustarse en archivos de imagen JPEG, TIFF y HEIC. Cada etiqueta
        tiene un significado estandarizado, lo que hace que los datos EXIF sean legibles por máquinas
        y coherentes entre dispositivos y programas.
      </p>
      <p>
        Los metadatos se almacenan en una sección de cabecera del archivo de imagen, antes de los propios
        datos de imagen. No afectan al aspecto de la imagen — son invisibles para cualquiera que
        simplemente la vea. Pero cualquier software que sepa dónde buscar puede leerlos trivialmente,
        y se transmiten intactos cada vez que compartes el archivo.
      </p>

      <h2>Qué se registra</h2>
      <p>
        El rango de información almacenada en los datos EXIF es más amplio de lo que la mayoría de la
        gente imagina:
      </p>
      <ul>
        <li>
          <strong>Coordenadas GPS</strong> — latitud y longitud, a menudo con datos de altitud y
          precisión GPS. Cuando los servicios de ubicación están activados en tu teléfono, esto registra
          las coordenadas exactas donde se tomó la foto — típicamente con una precisión de pocos metros.
          Algunas cámaras también registran la dirección en la que apuntaba la cámara.
        </li>
        <li>
          <strong>Marca y modelo del dispositivo</strong> — el fabricante y número de modelo de la
          cámara (p. ej., "Apple iPhone 15 Pro Max" o "Canon EOS R5"). Para smartphones, esto identifica
          el dispositivo exacto.
        </li>
        <li>
          <strong>Número de serie del dispositivo</strong> — muchas cámaras registran el número de serie
          del cuerpo en los datos EXIF. Es un identificador único que puede usarse para demostrar que un
          dispositivo específico tomó una foto concreta — útil en contextos legales, y preocupante en otros.
        </li>
        <li>
          <strong>Fecha y hora</strong> — la marca de tiempo precisa de cuando se tomó la foto,
          generalmente almacenada en hora local y a veces también en UTC. Incluye los segundos.
        </li>
        <li>
          <strong>Ajustes de cámara</strong> — apertura (f-stop), velocidad de obturación, sensibilidad
          ISO, distancia focal, si se disparó el flash, compensación de exposición, modo de medición,
          balance de blancos y más. Para smartphones, esto incluye la distancia focal equivalente y el
          objetivo específico usado (gran angular, ultra gran angular, teleobjetivo).
        </li>
        <li>
          <strong>Información del objetivo</strong> — modelo y número de serie del objetivo en cámaras
          dedicadas con objetivos intercambiables.
        </li>
        <li>
          <strong>Versión del software</strong> — el firmware de la cámara o, para fotos de smartphones,
          la versión de iOS o Android en el momento en que se tomó la foto.
        </li>
        <li>
          <strong>Orientación de la imagen</strong> — el indicador de rotación que le dice a los
          visores cómo orientar la imagen correctamente.
        </li>
        <li>
          <strong>Miniatura</strong> — muchas implementaciones EXIF incrustan una pequeña miniatura JPEG
          de la imagen dentro de los propios datos EXIF.
        </li>
      </ul>

      <h2>Riesgos reales para la privacidad</h2>
      <p>
        Las coordenadas GPS en los datos EXIF representan un riesgo de privacidad genuino y concreto.
        Cuando compartes una foto tomada en tu casa, tu oficina, el colegio de tu hijo o cualquier lugar
        que frecuentas, cualquier persona que reciba el archivo puede abrirlo en un visor EXIF y ver
        exactamente dónde se tomó. Esto no es teórico — es el comportamiento predeterminado de cada
        cámara de smartphone cuando los servicios de ubicación están activados.
      </p>
      <p>
        El riesgo se multiplica con la escala. Si publicas muchas fotos de tu vida cotidiana con los
        datos EXIF intactos, los metadatos revelan colectivamente tu dirección de casa, lugar de trabajo,
        rutina diaria, lugares visitados con frecuencia, patrones de viaje y los lugares con los que te
        asocias regularmente. Esta imagen agregada es significativamente más invasiva que cualquier
        coordenada aislada.
      </p>
      <p>
        Los números de serie y la información del modelo de cámara pueden usarse para demostrar que dos
        fotos provienen del mismo dispositivo — algo a tener en cuenta en procedimientos legales,
        periodismo de investigación o cualquier situación donde importe el anonimato. Si compartes fotos
        de forma anónima, el identificador del dispositivo en los datos EXIF puede ser el vínculo que
        conecte tus imágenes anónimas con tu identidad.
      </p>

      <h2>Casos famosos en los que EXIF reveló la ubicación</h2>
      <p>
        Los datos EXIF han expuesto la ubicación de personas notables en varios casos bien documentados:
      </p>
      <ul>
        <li>
          En 2012, el pionero del software antivirus John McAfee era un fugitivo de Belice. Cuando
          periodistas de Vice viajaron a entrevistarlo y publicaron una foto tomada con un iPhone con
          los datos GPS intactos, las coordenadas incrustadas revelaron su ubicación en Guatemala en
          pocas horas. Fue detenido poco después.
        </li>
        <li>
          Personal militar de EE. UU. ha sido identificado y rastreado a través de datos EXIF en
          fotos publicadas en redes sociales, lo que llevó al Ejército de los EE. UU. a emitir
          directrices formales advirtiendo a los soldados sobre las fotos geoetiquetadas. Las imágenes
          compartidas en blogs militares revelaron las ubicaciones de bases de helicópteros en Irak.
        </li>
        <li>
          Denunciantes y periodistas que operan en contextos sensibles han visto reveladas
          inadvertidamente sus ubicaciones a través de datos EXIF en fotos compartidas públicamente,
          lo que ha llevado a organizaciones de seguridad digital a incluir rutinariamente la
          eliminación de EXIF en sus listas de seguridad operacional.
        </li>
      </ul>

      <h2>Cómo gestionan EXIF las redes sociales</h2>
      <p>
        La mayoría de las principales plataformas de redes sociales eliminan los datos EXIF de las
        fotos antes de mostrarlas, lo que brinda cierta protección a los usuarios que no piensan en esto:
      </p>
      <ul>
        <li>
          <strong>Instagram, Facebook, Twitter/X</strong> — eliminan los datos EXIF de las fotos
          subidas. Las coordenadas GPS no son visibles para los espectadores.
        </li>
        <li>
          <strong>WhatsApp</strong> — elimina los datos EXIF cuando se envían fotos a través de
          la plataforma.
        </li>
        <li>
          <strong>Signal</strong> — tiene una opción para eliminar los metadatos de las fotos antes
          de enviarlas, que está activada por defecto.
        </li>
        <li>
          <strong>Correo electrónico y compartición directa de archivos</strong> — no se produce
          ninguna eliminación. Cuando envías una foto por correo electrónico o la compartes mediante
          Dropbox, Google Drive, iMessage o AirDrop como archivo, los datos EXIF se conservan en
          su totalidad.
        </li>
        <li>
          <strong>Aplicaciones de citas</strong> — las prácticas varían y a menudo no se divulgan.
          Algunas eliminan los metadatos, otras no. Publicar fotos con datos de ubicación en aplicaciones
          de citas donde tu perfil es visible para extraños conlleva riesgos obvios.
        </li>
      </ul>
      <p>
        El enfoque más seguro es no depender de que las plataformas eliminen tus datos — hazlo tú
        mismo antes de compartir.
      </p>

      <h2>Cómo ver los datos EXIF</h2>
      <p>
        Puedes inspeccionar los datos EXIF de varias maneras:
      </p>
      <ul>
        <li>
          <strong>En tu navegador</strong> — el{" "}
          <a href="/tools/exif-viewer">Visor EXIF de BrowseryTools</a> muestra todas las etiquetas
          EXIF en un formato legible. Arrastra tu foto y verás de inmediato todos los campos,
          incluidas las coordenadas GPS. Nada se sube.
        </li>
        <li>
          <strong>En macOS</strong> — abre la foto en Vista Previa, luego ve a Herramientas → Mostrar
          inspector → pestaña GPS. Finder también muestra los metadatos básicos en el panel
          Obtener información (Cmd+I).
        </li>
        <li>
          <strong>En Windows</strong> — haz clic derecho en el archivo, elige Propiedades → pestaña
          Detalles. Las coordenadas GPS y la información de la cámara aparecen allí.
        </li>
        <li>
          <strong>En iOS</strong> — abre la foto en la app Fotos y desliza hacia arriba para revelar
          el mapa que muestra dónde se tomó.
        </li>
      </ul>

      <h2>Cómo eliminar los datos EXIF</h2>
      <p>
        Eliminar los datos EXIF antes de compartir una foto es sencillo:
      </p>
      <ul>
        <li>
          <strong>Visor EXIF de BrowseryTools</strong> — el{" "}
          <a href="/tools/exif-viewer">Visor EXIF</a> te permite ver y eliminar los datos EXIF de
          fotos completamente en tu navegador. Sin subidas, sin cuenta requerida.
        </li>
        <li>
          <strong>En Windows</strong> — haz clic derecho en el archivo, Propiedades → pestaña Detalles
          → enlace "Quitar propiedades e información personal" en la parte inferior. Crea una copia limpia.
        </li>
        <li>
          <strong>En macOS</strong> — exporta desde Vista Previa con la casilla de datos de ubicación
          desmarcada, o usa la app Fotos y elige compartir sin ubicación.
        </li>
        <li>
          <strong>En iOS</strong> — al compartir una foto, toca "Opciones" en la parte superior del
          menú compartir y desactiva "Ubicación".
        </li>
        <li>
          <strong>De forma preventiva</strong> — desactiva completamente el acceso a la ubicación para
          la app de cámara. En iPhone: Ajustes → Privacidad → Localización → Cámara → Nunca. Esto
          evita que las coordenadas GPS se registren desde el principio.
        </li>
      </ul>

      <h2>Cuándo los datos EXIF son realmente útiles</h2>
      <p>
        Los datos EXIF no son puramente un riesgo. Para muchas personas, cumplen funciones legítimas
        y valiosas:
      </p>
      <ul>
        <li>
          <strong>Fotógrafos</strong> — los datos EXIF son una herramienta de aprendizaje invaluable.
          Después de una sesión, puedes revisar qué combinaciones de apertura, velocidad de obturación
          e ISO produjeron los mejores resultados. Lightroom y Capture One muestran los datos EXIF
          de forma destacada precisamente porque los fotógrafos los usan constantemente.
        </li>
        <li>
          <strong>Fotografía de viajes</strong> — las fotos etiquetadas con GPS se organizan
          automáticamente en mapas y líneas de tiempo en software de gestión de fotos como Apple
          Photos o Google Photos, creando un diario de viaje sin esfuerzo.
        </li>
        <li>
          <strong>Archivistas y periodistas</strong> — las marcas de tiempo y los datos de ubicación
          de EXIF pueden verificar cuándo y dónde se tomó una foto, algo importante para establecer
          la autenticidad en contextos legales, editoriales e históricos.
        </li>
        <li>
          <strong>Seguros y documentación legal</strong> — una foto de daños a la propiedad con datos
          EXIF intactos tiene más peso probatorio porque la marca de tiempo y la ubicación forman
          parte del registro.
        </li>
      </ul>
      <p>
        La clave es tomar una decisión consciente sobre cuándo compartir los datos EXIF y cuándo
        eliminarlos, en lugar de dejarlos por defecto y esperar que el destinatario o la plataforma
        lo gestionen.
      </p>
    </div>
  );
}
