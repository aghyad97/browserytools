export default function Content() {
  return (
    <div>
      <p>
        Cada vez que entornas los ojos ante una página porque el texto es demasiado claro, o te cuesta
        leer el texto de un botón porque se confunde con el fondo, estás experimentando un fallo de
        contraste. Para la mayoría de las personas esto es una molestia menor. Para una parte
        significativa de la población —quienes tienen deficiencias en la visión del color, visión
        reducida, ojos envejecidos, o cualquiera que use una pantalla bajo la luz solar directa—
        hace que el contenido sea genuinamente inaccesible. El contraste de color es uno de los
        aspectos más importantes y más frecuentemente vulnerados de la accesibilidad web, y también
        es uno de los más fáciles de corregir una vez que se entienden las reglas. Esta guía explica
        el estándar, la matemática, los errores comunes y cómo usar el{" "}
        <a href="/tools/contrast-checker">Verificador de Contraste de Color de BrowseryTools</a> para
        verificar cualquier par de colores al instante en tu navegador.
      </p>

      <h2>Por Qué Importa el Contraste</h2>
      <p>
        La escala de la población afectada es mayor de lo que la mayoría de los diseñadores supone.
        Según la Organización Mundial de la Salud, aproximadamente 2200 millones de personas a nivel
        mundial tienen alguna forma de deterioro visual de cerca o de lejos. La deficiencia en la
        visión del color —comúnmente llamada daltonismo— afecta a aproximadamente el 8% de los hombres
        y el 0,5% de las mujeres de ascendencia noreuropea, lo que significa que unos 300 millones de
        personas en todo el mundo tienen cierta dificultad para distinguir determinados colores.
      </p>
      <p>
        Más allá de las condiciones permanentes, el contraste afecta a todos de forma situacional:
      </p>
      <ul>
        <li>Leer el teléfono bajo la luz solar exterior intensa hace que el texto de bajo contraste sea completamente ilegible.</li>
        <li>Los monitores viejos o de bajo presupuesto tienen menor brillo y peor precisión de color.</li>
        <li>Las personas con migraña y fotosensibilidad suelen usar pantallas con brillo reducido.</li>
        <li>El reflejo de luz de ventanas o focos reduce efectivamente el contraste percibido.</li>
        <li>Los usuarios con prisa —básicamente todos— procesan el contenido de alto contraste más rápido.</li>
      </ul>
      <p>
        Un buen contraste no es una adaptación de nicho. Mejora la experiencia para todos los usuarios,
        en todos los dispositivos y en cualquier condición de iluminación.
      </p>

      <h2>¿Qué Es la Relación de Contraste?</h2>
      <p>
        La relación de contraste es un número estandarizado que expresa cuán diferentes son dos colores
        en términos de su brillo relativo (luminancia). Siempre se expresa como una proporción: el color
        más claro dividido por el más oscuro, añadiendo 0,05 a cada uno para evitar la división por cero
        y tener en cuenta la luz ambiental en pantallas reales.
      </p>
      <p>
        El rango va de <strong>1:1</strong> (dos colores idénticos — cero contraste, completamente
        ilegible) a <strong>21:1</strong> (negro puro sobre blanco puro — el máximo contraste posible).
        Cuanto mayor es la proporción, más distinguibles son los dos colores.
      </p>

      <h2>Cómo Se Calcula la Relación de Contraste</h2>
      <p>
        La fórmula utilizada por WCAG (y todo el ecosistema de estándares web) se basa en el concepto
        de luminancia relativa: una medida de cuánta luz parece emitir un color, ajustada para la
        percepción visual humana. El cálculo ocurre en dos pasos.
      </p>
      <p>
        <strong>Paso 1: Calcular la luminancia relativa (L) para cada color.</strong>
      </p>
      <p>
        Primero, convierte cada canal RGB del rango 0–255 a una escala lineal de 0–1 y aplica una
        fórmula de expansión gamma para tener en cuenta la forma en que las pantallas codifican el
        brillo:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`// Para cada valor de canal c en [0, 1]:
if c <= 0.04045:
    c_linear = c / 12.92
else:
    c_linear = ((c + 0.055) / 1.055) ^ 2.4

L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}
      </pre>
      <p>
        Los coeficientes 0,2126, 0,7152 y 0,0722 reflejan la sensibilidad al color humana: nuestros ojos
        son más sensibles al verde, moderadamente al rojo y menos al azul.
      </p>
      <p>
        <strong>Paso 2: Calcular la relación de contraste.</strong>
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`Relación de contraste = (L_más_claro + 0.05) / (L_más_oscuro + 0.05)`}
      </pre>
      <p>
        Donde <code>L_más_claro</code> es la luminancia relativa del color más brillante y{" "}
        <code>L_más_oscuro</code> es la luminancia relativa del color más oscuro.
      </p>

      <h3>Ejemplos de Cálculo</h3>
      <ul>
        <li>
          <strong>Negro (#000000) sobre blanco (#FFFFFF):</strong> L(blanco) = 1,0, L(negro) = 0,0.
          Proporción = (1,0 + 0,05) / (0,0 + 0,05) = 1,05 / 0,05 = <strong>21:1</strong>. Contraste máximo posible.
        </li>
        <li>
          <strong>Gris #767676 sobre blanco (#FFFFFF):</strong> L(#767676) ≈ 0,216.
          Proporción = (1,0 + 0,05) / (0,216 + 0,05) ≈ 1,05 / 0,266 ≈ <strong>4,54:1</strong>.
          Apenas supera el nivel AA de WCAG para texto normal.
        </li>
        <li>
          <strong>Gris #999999 sobre blanco (#FFFFFF):</strong> L(#999999) ≈ 0,319.
          Proporción = (1,0 + 0,05) / (0,319 + 0,05) ≈ 1,05 / 0,369 ≈ <strong>2,85:1</strong>.
          No supera el nivel AA de WCAG para texto de ningún tamaño.
        </li>
      </ul>

      <h2>WCAG: El Estándar que Define los Requisitos de Accesibilidad</h2>
      <p>
        Las Pautas de Accesibilidad para el Contenido Web (WCAG) son publicadas por el World Wide Web
        Consortium (W3C) y definen el estándar de accesibilidad web reconocido internacionalmente. La
        versión actual de uso regulatorio generalizado es WCAG 2.1, publicada en 2018. WCAG 3.0 está en
        desarrollo y eventualmente la reemplazará con un sistema de medición más matizado, pero WCAG 2.1
        sigue siendo el estándar vigente a efectos de cumplimiento.
      </p>
      <p>
        WCAG organiza los requisitos en tres niveles de conformidad: A (mínimo), AA (estándar) y AAA
        (mejorado). El nivel AA es lo que exige la mayoría de los marcos legales. El nivel AAA es
        aspiracional y no se exige para sitios completos, solo para contextos específicos.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1rem", color: "#1d4ed8"}}>
          Requisitos de Contraste de WCAG 2.1 de un Vistazo
        </p>
        <ul style={{marginTop: 0, marginBottom: 0}}>
          <li>
            <strong>Nivel AA — Texto normal:</strong> relación de contraste mínima de <strong>4,5:1</strong>
          </li>
          <li>
            <strong>Nivel AA — Texto grande:</strong> relación de contraste mínima de <strong>3:1</strong>
            (texto grande = 18pt / 24px peso regular, o 14pt / ~18,67px negrita)
          </li>
          <li>
            <strong>Nivel AA — Componentes de interfaz y objetos gráficos:</strong> relación de contraste mínima de <strong>3:1</strong>
            (se aplica a bordes de botones, contornos de campos, iconos que transmiten significado)
          </li>
          <li>
            <strong>Nivel AAA — Texto normal:</strong> relación de contraste mínima de <strong>7:1</strong>
          </li>
          <li>
            <strong>Nivel AAA — Texto grande:</strong> relación de contraste mínima de <strong>4,5:1</strong>
          </li>
        </ul>
      </div>

      <p>
        Es importante notar a qué <em>no</em> se aplican los requisitos de contraste: las imágenes
        decorativas sin contenido informativo, los logotipos y las marcas de palabra, y el texto que
        forma parte de un componente de interfaz inactivo (un botón deshabilitado, por ejemplo) están
        todos exentos de los requisitos de contraste bajo WCAG 2.1. La intención es proteger el
        contenido informativo, no los elementos puramente decorativos.
      </p>

      <h2>Pares de Color: Ejemplos de Aprobado y Reprobado</h2>
      <p>
        La relación de contraste de un par de colores depende enteramente de la luminancia relativa de
        los dos colores, no de cuál sea "más bonito" ni de los que parezcan similares. Aquí tienes
        ejemplos representativos en todo el espectro de aprobado/reprobado:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Color del texto</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Color de fondo</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Relación de contraste</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AA Normal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AAA Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#000000</code> (negro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><strong>21:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#1a1a2e</code> (azul marino oscuro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><strong>18,1:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#595959</code> (gris oscuro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><strong>7,0:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#767676</code> (gris medio)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><strong>4,54:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><code>#4f46e5</code> (índigo)</td>
              <td style={{padding: "12px 16px"}}><strong>5,9:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#999999</code> (gris claro)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><strong>2,85:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanco)</td>
              <td style={{padding: "12px 16px"}}><code>#ffdd00</code> (amarillo)</td>
              <td style={{padding: "12px 16px"}}><strong>1,29:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#0000ee</code> (enlace azul)</td>
              <td style={{padding: "12px 16px"}}><code>#6b21a8</code> (morado)</td>
              <td style={{padding: "12px 16px"}}><strong>1,7:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Reprobado</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Errores de Contraste Comunes</h2>
      <p>
        Los mismos errores aparecen repetidamente en las auditorías de accesibilidad en toda la web.
        Conocerlos por su nombre los hace más fáciles de identificar en tu propio trabajo.
      </p>

      <h3>Texto Gris Claro sobre Blanco</h3>
      <p>
        Este es el fallo de contraste más común en la web moderna. Las tendencias de diseño hacia el
        minimalismo han producido una generación de interfaces donde el cuerpo del texto, los pies de
        foto, los metadatos y el texto de marcador de posición se representan en tonos como{" "}
        <code>#aaaaaa</code>, <code>#bbbbbb</code> o <code>#cccccc</code> sobre fondos blancos. Estas
        combinaciones típicamente producen relaciones de contraste entre 1,5:1 y 2,5:1 —muy por debajo
        del mínimo de 4,5:1. El diseñador puede leerlo en un monitor calibrado de estudio en una
        habitación oscura; el usuario final en un smartphone bajo la luz solar de la tarde no.
      </p>

      <h3>Texto Blanco sobre Botones de Color</h3>
      <p>
        El texto blanco sobre amarillo (<code>#ffdd00</code>), verde lima (<code>#84cc16</code>) o
        naranja claro (<code>#fb923c</code>) no supera el nivel AA de WCAG para ningún tamaño de texto.
        Estas combinaciones de color son visualmente llamativas pero el contraste es demasiado bajo. El
        texto oscuro (negro o gris muy oscuro) sobre estos fondos brillantes es la solución accesible —
        suele alcanzar proporciones superiores a 10:1.
      </p>

      <h3>Texto de Marcador de Posición en Campos de Formulario</h3>
      <p>
        El texto de marcador de posición predeterminado del navegador —el texto de sugerencia que
        aparece en los campos de entrada vacíos antes de que el usuario escriba— se representa
        típicamente con una opacidad de alrededor del 40% del color del texto, o como un gris medio
        como <code>#aaaaaa</code>. Esto casi siempre no supera el nivel AA de WCAG. El texto de
        marcador de posición está sujeto al mismo requisito de contraste de 4,5:1 que el texto regular
        porque transmite información sobre qué escribir.
      </p>

      <h3>Texto de Enlace Azul sobre Fondos de Color u Oscuros</h3>
      <p>
        El color tradicional del hipervínculo azul (<code>#0000ee</code>) tiene un excelente contraste
        sobre blanco (8,6:1) pero falla sobre fondos de color. Sobre un fondo morado medio, el mismo
        enlace azul alcanza solo alrededor de 1,7:1. Los colores de los enlaces deben verificarse no
        solo contra el fondo de la página sino también contra cualquier sección o tarjeta de color en
        la que aparezcan.
      </p>

      <h3>Estados Deshabilitados e Indicadores de Foco</h3>
      <p>
        Si bien WCAG 2.1 exime a los componentes de interfaz deshabilitados de los requisitos de
        contraste, los indicadores de foco —el anillo o contorno visible que aparece cuando un usuario
        navega hasta un elemento enfocable con el teclado— deben cumplir un contraste de 3:1 contra los
        colores adyacentes bajo WCAG 2.2. Muchos sitios suprimen el anillo de foco predeterminado del
        navegador con <code>outline: none</code> y no proporcionan ningún reemplazo, lo cual es un
        fallo de accesibilidad para los usuarios que solo usan teclado.
      </p>

      <h2>Técnicas para Elegir Colores Accesibles</h2>

      <h3>Empieza con Oscuro sobre Claro</h3>
      <p>
        El valor predeterminado más sencillo para el texto es texto casi negro sobre un fondo blanco o
        gris muy claro. Las relaciones superiores a 10:1 son fáciles de lograr y te dan enorme
        flexibilidad con el tamaño y el peso de la fuente. Reserva los esquemas de color claro sobre
        oscuro (modo oscuro) para superficies secundarias y verifica el contraste en ambos temas.
      </p>

      <h3>Verifica Todos los Estados Interactivos</h3>
      <p>
        El estado predeterminado de un botón puede superar AA mientras que su estado de hover —que aclara
        el fondo— cae por debajo de 4,5:1. Verifica los estados predeterminado, hover, foco, activo y
        deshabilitado por separado. El estado deshabilitado está exento del requisito, pero todos los
        demás deben aprobarlo.
      </p>

      <h3>La Regla 60-30-10 Aplicada con Accesibilidad</h3>
      <p>
        La regla de color 60-30-10 (60% color dominante, 30% color secundario, 10% acento) es útil para
        la jerarquía visual. Aplicarla con accesibilidad significa: verifica que el texto que aparece en
        cada una de esas tres zonas de color cumpla el umbral de contraste para esa zona individualmente.
        El color de acento al 10% es a menudo el más problemático: los colores de acento brillantes
        combinados con texto blanco u oscuro pueden fallar en ciertas combinaciones de matiz y saturación.
      </p>

      <h3>Usa el Verificador de Contraste de Color Antes de Comprometerte</h3>
      <p>
        El momento más barato para corregir un problema de contraste es antes de escribir código. Al
        seleccionar colores en una herramienta de diseño, verifica inmediatamente los pares de
        texto/fondo previstos. Ajustar la luminosidad de un color en un 10–15% a menudo lleva una
        combinación fallida al cumplimiento sin cambiar significativamente el carácter visual del diseño.
      </p>

      <h2>Requisitos Legales</h2>
      <p>
        El cumplimiento de WCAG no es puramente voluntario en muchas jurisdicciones. Los marcos legales
        que hacen referencia al nivel AA de WCAG incluyen:
      </p>
      <ul>
        <li>
          <strong>Estados Unidos — Ley de Estadounidenses con Discapacidades (ADA):</strong> La ADA
          prohíbe la discriminación por discapacidad en lugares de acomodación pública. Los tribunales
          federales y el Departamento de Justicia han interpretado que esto cubre los sitios web
          comerciales. Miles de demandas de accesibilidad por la ADA se presentan anualmente en los
          tribunales federales de EE. UU., con violaciones de contraste de color frecuentemente citadas
          en cartas de demanda.
        </li>
        <li>
          <strong>Unión Europea — EN 301 549:</strong> La Directiva de Accesibilidad Web de la UE exige
          el cumplimiento del nivel AA de WCAG 2.1 para sitios web y aplicaciones móviles del sector
          público. EN 301 549 es el estándar técnico usado para la contratación pública. Las
          organizaciones del sector privado en industrias reguladas también enfrentan requisitos
          crecientes.
        </li>
        <li>
          <strong>Canadá — AODA (Ley de Accesibilidad para Personas con Discapacidades de Ontario):</strong>{" "}
          Ontario exige el cumplimiento del nivel AA de WCAG 2.0 para organizaciones del sector privado
          con 50 o más empleados y para todas las organizaciones del sector público.
        </li>
        <li>
          <strong>Reino Unido — Ley de Igualdad de 2010:</strong> Los proveedores de servicios tienen el
          deber de hacer ajustes razonables para las personas con discapacidad, lo que el gobierno del
          Reino Unido interpreta que incluye la accesibilidad de los sitios web.
        </li>
      </ul>
      <p>
        Más allá del riesgo legal, muchos clientes empresariales y procesos de contratación pública
        ahora exigen la conformidad con WCAG AA en los contratos de proveedores. El cumplimiento de la
        accesibilidad es cada vez más un requisito comercial, no solo uno ético.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "10px", fontWeight: 700, fontSize: "1rem", color: "#dc2626"}}>
          Requisito Clave a Recordar
        </p>
        <p style={{marginTop: 0, marginBottom: 0}}>
          El nivel AA de WCAG 2.1 exige una <strong>relación de contraste de 4,5:1 para texto normal</strong> y{" "}
          <strong>3:1 para texto grande</strong> (18pt o superior, o 14pt o superior en negrita). Los
          contornos de componentes de interfaz e iconos significativos también requieren 3:1. No superar
          estos umbrales significa no cumplir el estándar de accesibilidad más ampliamente exigido en
          la web.
        </p>
      </div>

      <h2>Quiénes Se Benefician Más Allá de los Usuarios con Discapacidad</h2>
      <p>
        El contraste accesible es buen diseño para todos. La investigación en experiencia de usuario
        muestra sistemáticamente que el texto de alto contraste se lee más rápido y con menos errores en
        todos los grupos de usuarios. Las poblaciones que se benefician de manera más demostrable incluyen:
      </p>
      <ul>
        <li>Personas con deficiencia en la visión del color (rojo-verde, azul-amarillo o monocromatismo)</li>
        <li>Adultos mayores, para quienes la sensibilidad al contraste disminuye naturalmente con la edad</li>
        <li>Personas con baja visión que no usan ampliación de pantalla</li>
        <li>Usuarios en entornos de alta luz ambiental (al aire libre, cerca de ventanas)</li>
        <li>Usuarios con pantallas de baja calidad, antiguas o de bajo presupuesto</li>
        <li>Cualquiera bajo carga cognitiva: cuando se está cansado o distraído, el alto contraste reduce los errores de lectura</li>
      </ul>

      <h2>Cómo Usar el Verificador de Contraste de Color de BrowseryTools</h2>
      <p>
        El{" "}
        <a href="/tools/contrast-checker">Verificador de Contraste de Color de BrowseryTools</a> hace
        que sea trivial verificar cualquier combinación de colores contra los estándares WCAG:
      </p>
      <ul>
        <li>
          <strong>Introduce códigos hex:</strong> Escribe o pega cualquier código de color hex válido
          (3 o 6 dígitos, con o sin el prefijo <code>#</code>) en los campos de primer plano y fondo.
        </li>
        <li>
          <strong>Ve la relación al instante:</strong> La relación de contraste se calcula y muestra en
          tiempo real mientras escribes, sin necesidad de hacer clic en ningún botón.
        </li>
        <li>
          <strong>Insignias AA y AAA:</strong> Se muestran insignias claras de aprobado/reprobado para
          texto normal de nivel AA, texto grande de nivel AA, texto normal de nivel AAA y texto grande de
          nivel AAA, para que puedas ver exactamente qué umbrales cumple tu par.
        </li>
        <li>
          <strong>Vista previa en directo:</strong> La herramienta muestra una muestra de texto sobre el
          fondo elegido para que puedas ver la combinación tal como la vería un usuario.
        </li>
        <li>
          <strong>Usa el selector de color:</strong> Si no tienes un valor hex específico en mente, el
          selector de color integrado te permite elegir colores visualmente y ver al instante cómo cambia
          la relación al moverte por el espacio de color.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Todo se ejecuta localmente en tu navegador.</strong> El Verificador de Contraste de Color
        realiza todos los cálculos de luminancia mediante JavaScript en tu pestaña del navegador. No se
        transmiten valores de color a ningún servidor. No hay cuentas, ni registros de historial, ni
        analíticas de terceros implicadas en el cálculo. Cierra la pestaña y todo desaparece.
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Verifica cualquier combinación de colores contra WCAG AA y AAA al instante
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Introduce dos códigos hex y obtén la relación de contraste, el estado de aprobado/reprobado y
          una vista previa del texto en directo. Sin registro. Nada se sube.
        </p>
        <a
          href="/tools/contrast-checker"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Abrir Verificador de Contraste de Color →
        </a>
      </div>
    </div>
  );
}
