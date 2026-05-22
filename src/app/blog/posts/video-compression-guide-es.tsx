export default function Content() {
  return (
    <div>
      <p>
        Los archivos de video son enormes por naturaleza. Un minuto de grabación 1080p sin comprimir a
        30 fotogramas por segundo consume aproximadamente 1,5 GB de almacenamiento. La compresión no es
        un lujo — es la única razón por la que el video en internet es viable. Pero no toda compresión
        es igual, y una configuración incorrecta puede producir un archivo que sigue siendo demasiado
        grande, tiene una degradación notable, o ambas cosas.
      </p>
      <p>
        Puedes comprimir cualquier archivo de video ahora mismo con el{" "}
        <a href="/tools/compress-video">Compresor de Video de BrowseryTools</a> — gratuito, sin registro,
        y todo el proceso se ejecuta localmente en tu navegador. Tu material nunca sale de tu dispositivo.
      </p>

      <h2>¿Por qué los archivos de video sin comprimir son tan grandes?</h2>
      <p>
        Para entender qué hace la compresión, hay que entender con qué se empieza. El video digital es
        una secuencia de fotogramas individuales — imágenes fijas que se muestran en rápida sucesión
        para crear la ilusión de movimiento. A resolución 1080p, cada fotograma contiene
        1.920 × 1.080 = 2.073.600 píxeles. Si cada píxel almacena el color como tres canales de
        8 bits (rojo, verde, azul), eso son aproximadamente 6 MB por fotograma. A 30 fps, un segundo
        de video sin comprimir ocupa unos 180 MB. Un minuto supera los 10 GB.
      </p>
      <p>
        Los formatos RAW, como BRAW o Apple ProRes, capturan el video cerca de este estado sin comprimir
        para preservar la máxima calidad en la edición en postproducción. Los formatos de consumo, las
        subidas a redes sociales y las plataformas de streaming usan formatos comprimidos donde la mayor
        parte de esos datos ha sido descartada o reconstruida — de maneras que el ojo humano apenas nota,
        si se hace correctamente.
      </p>

      <h2>Cómo funcionan los códecs de video</h2>
      <p>
        Un códec (codificador-decodificador) es un algoritmo que comprime y descomprime datos de video.
        La mayoría de los códecs modernos usan dos técnicas complementarias: compresión espacial dentro
        de cada fotograma y compresión temporal entre fotogramas.
      </p>
      <p>
        La <strong>compresión espacial</strong> funciona como la compresión JPEG para imágenes fijas.
        Analiza cada fotograma y descarta información visual que al ojo humano le cuesta detectar —
        gradaciones de color sutiles, texturas finas en áreas uniformes, detalles de alta frecuencia en
        zonas periféricas. Esto reduce drásticamente el tamaño de cada fotograma individual.
      </p>
      <p>
        La <strong>compresión temporal</strong> aprovecha el hecho de que los fotogramas consecutivos
        de un video suelen ser muy similares. En lugar de almacenar cada píxel de cada fotograma, el
        códec almacena un fotograma de referencia completo (llamado fotograma I o keyframe) a intervalos
        regulares, y luego solo las diferencias — vectores de movimiento y regiones cambiadas — para los
        fotogramas intermedios (fotogramas P y B). Un clip de alguien hablando sobre un fondo estático
        apenas cambia de fotograma en fotograma, por lo que la representación comprimida de esos
        fotogramas intermedios es mínima.
      </p>

      <h2>Comparación de los principales códecs</h2>
      <ul>
        <li>
          <strong>H.264 (AVC)</strong> — El caballo de batalla de internet. Introducido en 2003, ahora
          compatible de forma universal con navegadores, dispositivos y plataformas. Ofrece buena calidad
          a tamaños de archivo razonables y se reproduce en prácticamente cualquier dispositivo fabricado
          en los últimos 15 años. Si necesitas máxima compatibilidad, H.264 es la opción segura por defecto.
        </li>
        <li>
          <strong>H.265 (HEVC)</strong> — El sucesor de H.264, con una calidad visual equivalente al
          doble de eficiencia en el tamaño del archivo. El problema son las tasas de licencia, que han
          frenado su adopción. Compatible de forma nativa con dispositivos Apple y hardware Windows
          reciente, pero el soporte en navegadores es irregular. Excelente para archivado o flujos de
          trabajo centrados en Apple.
        </li>
        <li>
          <strong>VP9</strong> — La respuesta de Google a H.265 y el códec detrás de YouTube. Libre de
          derechos y compatible con Chrome y Firefox. La eficiencia de compresión es comparable a H.265.
          Se usa habitualmente para entrega web junto con contenedores WebM.
        </li>
        <li>
          <strong>AV1</strong> — El códec de nueva generación, desarrollado por la Alliance for Open
          Media (Google, Netflix, Apple y otros). AV1 logra una compresión un 30–50 % mejor que H.264
          con la misma calidad. Libre de derechos, cada vez más compatible con navegadores y dispositivos
          modernos. El inconveniente es la codificación muy lenta — AV1 puede tardar 10–20 veces más en
          codificar que H.264. Bueno para la entrega final de contenido que se verá muchas veces;
          innecesario para compartir rápidamente.
        </li>
      </ul>

      <h2>Tasa de bits, resolución y frecuencia de fotogramas: qué controla realmente el tamaño</h2>
      <p>
        Tres variables determinan el tamaño de un archivo de video comprimido:
      </p>
      <ul>
        <li>
          <strong>Tasa de bits</strong> — el número de bits de datos almacenados por segundo de video.
          Una tasa mayor significa más datos, mejor calidad y archivos más grandes. Una subida de 4K a
          YouTube podría usar 35–68 Mbps; un clip web comprimido podría usar 2–5 Mbps. La tasa de bits
          es la palanca más directa para controlar el tamaño del archivo.
        </li>
        <li>
          <strong>Resolución</strong> — las dimensiones en píxeles del fotograma. Bajar de 4K
          (3840×2160) a 1080p (1920×1080) reduce el recuento de píxeles en un 75 %, lo que permite un
          archivo mucho más pequeño a la misma tasa de bits o una calidad similar a una tasa de bits
          dramáticamente menor. Para la mayoría del contenido web, 1080p es indistinguible de 4K a las
          distancias de visualización y tamaños de pantalla típicos.
        </li>
        <li>
          <strong>Frecuencia de fotogramas</strong> — el contenido estándar se reproduce a 24, 25 o
          30 fps. Las frecuencias más altas (60 fps, 120 fps) requieren proporcionalmente más datos para
          mantener la calidad. Bajar de 60 fps a 30 fps reduce aproximadamente a la mitad la tasa de
          bits requerida para una calidad equivalente — un ahorro significativo para videos donde el
          movimiento fluido no es el principal atractivo.
        </li>
      </ul>

      <h2>Compresión sin pérdida vs. compresión con pérdida</h2>
      <p>
        La compresión sin pérdida reduce el tamaño del archivo sin descartar ningún dato. El original
        puede reconstruirse perfectamente a partir del archivo comprimido. Formatos como Apple ProRes
        4444, FFV1 o Huffyuv usan compresión sin pérdida. Son dramáticamente más pequeños que los
        formatos RAW pero siguen siendo muy grandes comparados con los formatos de distribución.
        La compresión sin pérdida es la opción correcta para masters de archivo y flujos de trabajo
        de edición — no para compartir o transmitir.
      </p>
      <p>
        La compresión con pérdida logra ratios de compresión mucho más altos descartando permanentemente
        datos que el codificador considera imperceptibles. H.264, H.265, VP9 y AV1 son todos con
        pérdida. Una vez que comprimes a un formato con pérdida, la información descartada desaparece.
        Esto es aceptable para la distribución — el espectador nunca sabe qué se eliminó — pero importa
        enormemente para los flujos de trabajo, como se explica a continuación.
      </p>

      <h2>Pérdida de generación: por qué recomprimir degrada la calidad</h2>
      <p>
        Cada vez que transcodificas (recomprimes) un video con pérdida ya comprimido, la calidad se
        degrada. La primera pasada de compresión descarta cierta información. La segunda pasada trabaja
        sobre la versión ya degradada y descarta más. A la quinta o sexta transcodificación, los
        artefactos de compresión visibles — pixelación, bandas, borrosidad — se acumulan notablemente.
        Esto se llama pérdida de generación, por analogía con la degradación de calidad que se veía al
        copiar cintas VHS.
      </p>
      <p>
        La implicación práctica: comprime siempre desde la fuente original. Edita en un formato sin
        pérdida o de alta tasa de bits, luego comprime la exportación final una sola vez para la
        distribución. Nunca vuelvas a descargar un video de las redes sociales y lo recomprimas — estás
        empezando desde una copia ya degradada y empeorándola.
      </p>

      <h2>Objetivos de compresión para casos de uso habituales</h2>
      <ul>
        <li>
          <strong>Adjunto de correo electrónico</strong> — mantén el archivo por debajo de 25 MB (la
          mayoría de los clientes de correo imponen este límite). Usa H.264 a 720p, 1–2 Mbps. Para
          cualquier cosa de más de 2–3 minutos, sube a un servicio de compartición de archivos y envía
          un enlace.
        </li>
        <li>
          <strong>Incrustación en web</strong> — apunta a menos de 5 MB para clips cortos, 10–20 Mbps
          para clips más largos. H.264 a 1080p es una opción segura y universal. AV1 o VP9 en WebM
          serán más pequeños para los navegadores que los admitan.
        </li>
        <li>
          <strong>Redes sociales</strong> — las plataformas recomprimen todo de su parte, así que sube
          con la mayor calidad que soporte tu flujo de trabajo dentro de sus límites de tamaño. El límite
          de Instagram es 4 GB; el de TikTok es 287 MB para la mayoría de los formatos. Dado que la
          plataforma añade su propia pasada de compresión, partir de un archivo más limpio y con mayor
          tasa de bits produce un resultado notablemente mejor tras su transcodificación.
        </li>
        <li>
          <strong>Master de archivo</strong> — usa sin pérdida (ProRes 4444, FFV1) o casi sin pérdida
          (ProRes 422 HQ) a resolución completa. El almacenamiento es barato; recrear el material
          original es imposible.
        </li>
      </ul>

      <h2>Consejos prácticos para elegir la configuración de compresión</h2>
      <p>
        Algunas reglas generales que producen consistentemente buenos resultados:
      </p>
      <ul>
        <li>
          <strong>Usa el modo CRF cuando el tamaño del archivo es flexible.</strong> El Factor de Tasa
          Constante permite al codificador variar la tasa de bits dinámicamente, gastando más bits en
          escenas complejas y menos en las simples. Esto produce mejor calidad por tamaño de archivo
          que una tasa de bits fija. Para H.264, CRF 18–23 cubre el rango de casi sin pérdida a
          suficientemente bueno para web.
        </li>
        <li>
          <strong>Ajusta la resolución de salida a la plataforma de distribución.</strong> Escalar una
          fuente 4K a 1080p antes de aplicar la compresión le da menos trabajo al codificador y produce
          una salida más limpia que comprimir a 4K y dejar que la plataforma lo escale.
        </li>
        <li>
          <strong>El audio también importa.</strong> AAC a 128–192 kbps cubre la mayoría del contenido
          estéreo. Rara vez hay una diferencia perceptible entre 192 kbps y 320 kbps para diálogos y
          música a los volúmenes de escucha típicos, pero la diferencia de tamaño de archivo es real.
        </li>
        <li>
          <strong>Prueba antes de comprometerte.</strong> Codifica un clip de 30 segundos con tu
          configuración objetivo y compruébalo en el mismo tipo de pantalla y conexión que usará tu
          audiencia. Un archivo que se ve bien en tu monitor de edición a resolución completa puede
          mostrar artefactos en la pantalla de un teléfono o sufrir buffering en una conexión lenta.
        </li>
      </ul>
      <p>
        Para una compresión rápida sin configurar un entorno de edición completo, el{" "}
        <a href="/tools/compress-video">Compresor de Video de BrowseryTools</a> gestiona la
        configuración por ti y procesa todo en tu navegador — sin subidas, sin esperas, sin acceso
        de terceros a tu material.
      </p>

      <div
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Conclusión clave:</strong> el mejor flujo de trabajo de compresión es editar en un
        formato de alta calidad, comprimir una sola vez al formato objetivo y nunca recomprimir la
        salida. Elige el códec adecuado para tu plataforma de distribución, ajusta la resolución al
        tamaño de pantalla previsto y usa el modo CRF para la compresión orientada a calidad en lugar
        de perseguir una tasa de bits arbitraria.
      </div>
    </div>
  );
}
