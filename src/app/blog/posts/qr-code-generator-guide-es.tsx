export default function Content() {
  return (
    <div>
      <p>
        Los códigos QR se han convertido discretamente en una de las interfaces más universales entre el mundo físico y
        el digital. Los escaneas en las mesas de los restaurantes para abrir los menús, en los envases de los productos
        para verificar su autenticidad, en los carteles de eventos para comprar entradas, en las tarjetas de visita para
        guardar datos de contacto y en las acreditaciones de congresos para conectar en LinkedIn. En 2026, la
        expectativa de que un código QR "simplemente funcione" es tan normal como esperar que un número de teléfono se
        pueda marcar.
      </p>
      <p>
        Sin embargo, para la mayoría de la gente, generar un código QR sigue implicando encontrar un sitio web, lidiar
        con anuncios o muros de pago, preguntarse si el servicio almacena el código o la URL que codifica y, a menudo,
        descubrir que la personalización requiere un plan de pago. BrowseryTools resuelve todo eso. El{" "}
        <a href="/tools/qr-generator">Generador de códigos QR</a> es gratuito, se ejecuta en tu navegador, no requiere
        cuenta y genera códigos que nunca se envían ni se almacenan en ningún servidor.
      </p>
      <p>
        Esta guía cubre qué son los códigos QR, cómo generarlos de forma eficaz, toda la gama de casos de uso, las
        mejores prácticas para su despliegue y cómo leer los códigos que recibes usando el complementario{" "}
        <a href="/tools/qr-scanner">Escáner de QR</a>.
      </p>

      <h2>¿Qué es un código QR y cómo funciona?</h2>
      <p>
        QR significa Quick Response (respuesta rápida). Un código QR es un código de barras matricial bidimensional —
        una cuadrícula de cuadrados blancos y negros — que codifica datos en un formato que las cámaras y los lectores
        especializados pueden decodificar en milisegundos. A diferencia de un código de barras unidimensional estándar,
        que solo puede almacenar unos 20 caracteres numéricos, un código QR puede almacenar hasta 4296 caracteres
        alfanuméricos, suficiente para una URL completa, un bloque de texto plano, credenciales WiFi o una vCard de
        contacto.
      </p>
      <p>
        Los códigos QR fueron inventados por Denso Wave en Japón en 1994 para rastrear piezas de automóviles durante la
        fabricación. Se volvieron omnipresentes a nivel mundial cuando las cámaras de los smartphones adquirieron la
        capacidad nativa de escanear QR — lo que significa que ya no necesitas una app aparte para escanear uno, solo la
        app de cámara predeterminada de tu teléfono. Esta experiencia de escaneo sin fricción es lo que convirtió a los
        códigos QR en el puente universal de lo físico a lo digital que son hoy.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Nota sobre privacidad:</strong> algunos generadores de QR online actúan como acortadores de URL — el
        código QR apunta a su servidor, que luego redirige a tu URL real. Esto significa que el generador puede
        rastrear cada escaneo. BrowseryTools genera códigos QR estáticos que codifican tu contenido directamente, sin
        redirección y sin seguimiento. Lo que codificas es lo que ven los escáneres.
      </div>

      <h2>Casos de uso: cuándo y por qué generar un código QR</h2>

      <h3>Menús de restaurantes y hostelería</h3>
      <p>
        Los menús impresos son caros de reimprimir cada vez que cambian los precios o los platos. Un código QR que
        apunta a la URL de un menú online significa que puedes actualizar el menú sin reimprimir nada. Genera un código
        QR para la URL de tu menú, imprímelo en una tarjeta de mesa y, la próxima vez que cambien los precios,
        simplemente actualiza la página web. El código QR sigue siendo el mismo — solo cambia el contenido de destino.
      </p>

      <h3>Tarjetas de visita</h3>
      <p>
        Un código QR en una tarjeta de visita que codifica una vCard (tarjeta de contacto virtual) permite a cualquiera
        guardar tu nombre, número de teléfono, correo, puesto, empresa y sitio web en los contactos de su teléfono con
        un solo escaneo, sin necesidad de escribir nada. La persona a la que le entregas la tarjeta guardará realmente
        tus datos de contacto — en lugar de meter la tarjeta en un cajón y no introducirla nunca a mano.
      </p>

      <h3>Compartir WiFi</h3>
      <p>
        Decirles a los invitados tu contraseña de WiFi — sobre todo una que incluye caracteres especiales — es una
        experiencia menor pero realmente molesta. Un código QR que codifica tus credenciales WiFi (nombre de la red,
        contraseña y tipo de seguridad) permite a cualquiera escanearlo para conectarse automáticamente, sin escribir
        nada a mano. Imprímelo, enmárcalo y déjalo sobre la mesa para los invitados. Regenera uno nuevo si alguna vez
        cambias la contraseña.
      </p>

      <h3>Envases de productos</h3>
      <p>
        Los códigos QR en los envases de productos pueden enlazar a instrucciones de configuración, registro de
        garantía, videotutoriales, manuales de usuario, información sobre el origen de los ingredientes o atención al
        cliente. Convierten un envase estático en un punto de contacto interactivo que puede actualizarse a medida que
        los productos evolucionan.
      </p>

      <h3>Invitaciones a eventos y entradas</h3>
      <p>
        Una invitación con un código QR que enlaza a un formulario de confirmación de asistencia, un mapa o una página
        de aterrizaje del evento es más limpia que imprimir una URL larga. Para las entradas de eventos, un código QR
        que codifica un identificador único permite un escaneo de acceso rápido en la puerta. Incluso para pequeños
        eventos personales — una fiesta de cumpleaños, una reunión vecinal — un código QR en un folleto hace que los
        detalles del evento sean accesibles al instante.
      </p>

      <h3>Materiales de marketing y anuncios impresos</h3>
      <p>
        La publicidad impresa ha sufrido históricamente la incapacidad de medir la interacción. Un código QR con una URL
        etiquetada con UTM tiende un puente entre la analítica impresa y la digital — puedes ver exactamente cuántas
        personas escanearon un código de un folleto o anuncio de revista concreto consultando tu analítica web.
      </p>

      <h2>Cómo usar el Generador de códigos QR de BrowseryTools</h2>
      <p>
        Abre el <a href="/tools/qr-generator">Generador de códigos QR</a> y verás un campo de entrada limpio. Introduce
        cualquier contenido que quieras codificar:
      </p>
      <ul>
        <li>Una URL completa (por ejemplo, <code>https://yourdomain.com/menu</code>)</li>
        <li>Texto plano (un mensaje corto, un número de teléfono, una dirección)</li>
        <li>Credenciales WiFi en el formato estándar</li>
        <li>Una cadena de vCard de contacto</li>
        <li>Una dirección de correo o un número de teléfono en formato URI</li>
      </ul>
      <p>
        El código QR se representa en tiempo real a medida que escribes. Puedes ajustar:
      </p>
      <ul>
        <li>
          <strong>Tamaño:</strong> los códigos más grandes son más fáciles de escanear a distancia; los más pequeños
          encajan mejor en tarjetas de visita o etiquetas de producto. Establece las dimensiones en píxeles para que
          coincidan con el tamaño de impresión o visualización previsto.
        </li>
        <li>
          <strong>Nivel de corrección de errores:</strong> los códigos QR tienen una redundancia integrada que les
          permite escanearse incluso si parte del código está dañada u oculta. Una corrección de errores más alta
          (nivel H) permite que hasta el 30% del código esté dañado y aun así se escanee correctamente — útil si
          colocas un logotipo o un elemento de diseño sobre parte del código.
        </li>
        <li>
          <strong>Colores:</strong> el valor predeterminado es negro sobre blanco, que tiene la mejor fiabilidad de
          escaneo. Puedes ajustar los colores de primer plano y de fondo para materiales de marca, pero mantén siempre
          un fuerte contraste entre ambos.
        </li>
      </ul>
      <p>
        Una vez que estés satisfecho con la vista previa, descarga el código QR como un archivo PNG, listo para usarse
        en cualquier herramienta de diseño o diseño de impresión.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Todo se queda en local:</strong> el código QR lo genera por completo el JavaScript que se ejecuta en tu
        navegador. El contenido que codificas — ya sea una URL, una contraseña de WiFi o una vCard — nunca se transmite
        a los servidores de BrowseryTools ni a ningún servicio externo. No se registra ni almacena ningún código en
        ningún lugar fuera de tu dispositivo.
      </div>

      <h2>Mejores prácticas para los códigos QR</h2>

      <h3>Tamaño mínimo de impresión</h3>
      <p>
        El tamaño mínimo de impresión fiable para un código QR es de aproximadamente 2 cm × 2 cm (alrededor de 0,75
        pulgadas de lado). Por debajo de esto, las cámaras de los smartphones de consumo pueden tener dificultades para
        enfocar el código de forma fiable. Para señalización o carteles de gran formato, dimensiona el código
        proporcionalmente más grande — un código en una valla publicitaria debe ser legible desde varios metros.
      </p>

      <h3>El contraste es crucial</h3>
      <p>
        Los códigos QR funcionan detectando el contraste entre las zonas oscuras y claras. Nunca uses combinaciones de
        colores de bajo contraste — gris claro sobre blanco, azul oscuro sobre negro o cualquier combinación donde el
        primer plano y el fondo tengan una luminosidad parecida. Si usas un esquema de color para la marca, comprueba
        que la relación de contraste sea suficientemente alta antes de imprimir. En caso de duda, quédate con negro
        sobre blanco.
      </p>

      <h3>Prueba siempre antes de imprimir</h3>
      <p>
        Antes de comprometerte con una tirada de impresión, escanea tu código QR generado con al menos dos dispositivos
        distintos (idealmente un iPhone y un teléfono Android). Confirma que se resuelve al destino correcto y que la
        página de destino carga correctamente. Un código QR en 5000 folletos impresos que apunta a una URL rota es un
        error caro que las pruebas habrían detectado.
      </p>

      <h3>Mantén despejada la zona de silencio</h3>
      <p>
        Los códigos QR requieren una "zona de silencio" — un margen blanco despejado alrededor del código — para
        escanearse de forma fiable. Al colocar un código QR en un diseño, asegúrate de que haya suficiente espacio en
        blanco alrededor de los cuatro lados antes de imprimirlo o mostrarlo. Recortar dentro de la zona de silencio es
        una causa común de fallos de escaneo.
      </p>

      <h3>Haz la URL memorable o significativa</h3>
      <p>
        Como los códigos QR son opacos para el ojo humano, considera usar una URL legible en el destino — bien una URL
        corta y significativa o un enlace corto personalizado — para que cualquiera que escriba la URL a mano (porque su
        app de cámara falló o porque quiere compartirla de viva voz) pueda hacerlo sin confusión.
      </p>

      <h2>Escanear códigos QR: el Escáner de QR de BrowseryTools</h2>
      <p>
        Cuando recibes un código QR y quieres decodificar su contenido sin apuntar un teléfono hacia él — quizá
        recibiste una imagen de código QR por correo o encontraste uno en una página web — el{" "}
        <a href="/tools/qr-scanner">Escáner de QR de BrowseryTools</a> te permite subir una imagen del código y
        decodificarla al instante en el navegador.
      </p>
      <p>
        Esto es especialmente útil para desarrolladores que prueban códigos generados, para verificar qué codifica un
        código impreso antes de enviar materiales por correo y para cualquiera que reciba un código QR y quiera
        inspeccionar su contenido en un ordenador sin recurrir a un teléfono.
      </p>

      <h2>Empieza a generar códigos QR ahora</h2>
      <p>
        Los códigos QR son una de las piezas de infraestructura más prácticas que conectan los espacios físicos y
        digitales en 2026, y generar uno debería llevar menos de un minuto. El{" "}
        <a href="/tools/qr-generator">Generador de códigos QR de BrowseryTools</a> lo hace rápido, gratuito, privado y
        totalmente personalizable.
      </p>
      <p>
        Sin cuenta, sin suscripción, sin seguimiento, sin marcas de agua. Abre la herramienta, codifica tu contenido y
        descarga tu código. Está listo para usarse en el momento en que llegas a la página.
      </p>
    </div>
  );
}
