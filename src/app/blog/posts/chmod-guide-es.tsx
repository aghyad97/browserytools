import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Cada archivo y directorio en un sistema Linux o macOS lleva un conjunto de permisos que controla
        quién puede leerlo, escribir en él o ejecutarlo. Configurar correctamente estos permisos marca la
        diferencia entre un servidor seguro y uno que filtra datos o queda comprometido. Sin embargo, la
        notación — <code>chmod 755</code>, la salida de <code>ls -la</code> mostrando{" "}
        <code>-rwxr-xr--</code> — puede parecer opaca hasta que se entiende el modelo subyacente. Esta
        guía explica los permisos de archivos Unix desde los principios fundamentales.
      </p>
      <ToolCTA slug="chmod" variant="inline" />
      <p>
        Puedes calcular valores de permisos y convertir entre notación octal y simbólica al instante con la{" "}
        <a href="/tools/chmod">Calculadora chmod de BrowseryTools</a> — gratuita, sin registro, todo se
        ejecuta en tu navegador.
      </p>

      <h2>El modelo de permisos Unix: propietario, grupo y otros</h2>
      <p>
        Unix asigna a cada archivo y directorio tres conjuntos de permisos, cada uno cubriendo un
        público diferente:
      </p>
      <ul>
        <li><strong>Propietario (usuario)</strong> — la cuenta de usuario que posee el archivo. Típicamente, el usuario que lo creó.</li>
        <li><strong>Grupo</strong> — un grupo de usuarios con nombre. El archivo pertenece a un grupo; todos los miembros de ese grupo comparten los permisos de grupo.</li>
        <li><strong>Otros (mundo)</strong> — todos los demás en el sistema que no son el propietario ni miembros del grupo.</li>
      </ul>
      <p>
        Dentro de cada uno de estos tres conjuntos hay tres bits de permisos: lectura (<code>r</code>),
        escritura (<code>w</code>) y ejecución (<code>x</code>). Esto da nueve bits de permisos en total,
        que se corresponden directamente con los nueve caracteres que ves tras el indicador de tipo de
        archivo en la salida de <code>ls -la</code>.
      </p>

      <h2>Leer la salida de ls -la</h2>
      <p>
        Cuando ejecutas <code>ls -la</code>, cada línea comienza con una cadena de 10 caracteres como{" "}
        <code>-rwxr-xr--</code>. Así se lee:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`-  rwx  r-x  r--
^  ^^^  ^^^  ^^^
|  |    |    └── otros:       solo lectura
|  |    └─────── grupo:       lectura + ejecución
|  └──────────── propietario: lectura + escritura + ejecución
└─────────────── tipo de archivo: - = archivo, d = directorio, l = enlace simbólico`}
      </pre>
      <p>
        Un guion <code>-</code> en una posición de permiso indica que ese permiso no está concedido.
        Por lo tanto, <code>r-x</code> significa que se permiten lectura y ejecución, pero no escritura.
      </p>

      <h2>Qué significan lectura, escritura y ejecución para archivos y directorios</h2>
      <p>
        Los tres bits de permisos tienen significados distintos según si se aplican a un archivo o a
        un directorio:
      </p>
      <ul>
        <li><strong>Lectura de archivo (r)</strong> — puede leer el contenido del archivo (<code>cat</code>, <code>less</code>, abrir en un editor).</li>
        <li><strong>Escritura de archivo (w)</strong> — puede modificar o truncar el archivo. Nota: eliminar un archivo lo controla el permiso de escritura del directorio padre, no el bit de escritura del propio archivo.</li>
        <li><strong>Ejecución de archivo (x)</strong> — puede ejecutar el archivo como programa o script. Sin este bit, <code>./script.sh</code> devuelve "Permiso denegado" aunque puedas leerlo.</li>
        <li><strong>Lectura de directorio (r)</strong> — puede listar el contenido del directorio (<code>ls</code>). Sin él, sabes que el directorio existe pero no puedes ver qué hay dentro.</li>
        <li><strong>Escritura de directorio (w)</strong> — puede crear, renombrar o eliminar archivos dentro del directorio. Por eso puedes eliminar un archivo que no te pertenece si tienes acceso de escritura en su directorio padre.</li>
        <li><strong>Ejecución de directorio (x)</strong> — puede entrar al directorio (<code>cd</code>) y acceder a los archivos dentro si conoces sus nombres. A veces se llama el "bit de búsqueda". Un directorio con <code>r--</code> te permite listar nombres de archivo pero no acceder a ellos; un directorio con <code>--x</code> te permite acceder a archivos por nombre pero no listarlos.</li>
      </ul>

      <h2>Notación octal: 755, 644, 777</h2>
      <p>
        Cada conjunto de permisos (propietario, grupo, otros) son tres bits. Tres bits pueden representar
        valores del 0 al 7 — exactamente un dígito octal. Por eso los permisos se escriben como tres
        dígitos octales, uno por audiencia:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Valores de bits:  r = 4,  w = 2,  x = 1

rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0+0+0 = 0

chmod 755 → propietario: 7 (rwx), grupo: 5 (r-x), otros: 5 (r-x)
chmod 644 → propietario: 6 (rw-), grupo: 4 (r--), otros: 4 (r--)
chmod 600 → propietario: 6 (rw-), grupo: 0 (---), otros: 0 (---)`}
      </pre>
      <p>
        No necesitas memorizar cada combinación — usa la{" "}
        <a href="/tools/chmod">Calculadora chmod de BrowseryTools</a> para comprobar qué significa
        cualquier valor octal o para construir el valor correcto para tu situación.
      </p>

      <h2>Notación simbólica: u+x, g-w, o=r</h2>
      <p>
        El modo simbólico te permite modificar los permisos de forma relativa a su estado actual, sin
        especificar los tres conjuntos a la vez. El formato es <code>[quién][operador][permisos]</code>:
      </p>
      <ul>
        <li><strong>Quién</strong>: <code>u</code> (propietario/usuario), <code>g</code> (grupo), <code>o</code> (otros), <code>a</code> (los tres)</li>
        <li><strong>Operador</strong>: <code>+</code> (añadir), <code>-</code> (eliminar), <code>=</code> (establecer exactamente)</li>
        <li><strong>Permisos</strong>: <code>r</code>, <code>w</code>, <code>x</code></li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`chmod u+x script.sh       # añadir ejecución solo para el propietario
chmod g-w config.txt      # eliminar escritura del grupo
chmod o=r public.html     # establecer otros como solo lectura exactamente
chmod a+r file.txt        # añadir lectura para todos
chmod u=rwx,g=rx,o=       # equivalente a chmod 750`}
      </pre>

      <h2>Patrones de permisos comunes explicados</h2>
      <ul>
        <li><strong>755</strong> (<code>rwxr-xr-x</code>) — Estándar para ejecutables y directorios. El propietario puede hacer todo; los demás pueden leer y ejecutar (o entrar a un directorio) pero no escribir. El valor por defecto para el directorio raíz de documentos del servidor web y los scripts públicos.</li>
        <li><strong>644</strong> (<code>rw-r--r--</code>) — Estándar para archivos normales. El propietario puede leer/escribir; los demás solo pueden leer. Adecuado para recursos web, archivos de configuración que no contienen secretos y la mayoría del contenido estático.</li>
        <li><strong>600</strong> (<code>rw-------</code>) — El propietario puede leer/escribir; nadie más puede hacer nada. Requerido para claves privadas SSH (<code>~/.ssh/id_rsa</code>). SSH se negará a usar un archivo de clave con permisos más permisivos.</li>
        <li><strong>700</strong> (<code>rwx------</code>) — El propietario puede hacer todo; nadie más tiene acceso. Adecuado para scripts privados y directorios que contienen datos sensibles.</li>
        <li><strong>400</strong> (<code>r--------</code>) — Solo lectura para el propietario; completamente bloqueado para los demás. Se usa para archivos de configuración e certificados inmutables donde las escrituras accidentales serían perjudiciales.</li>
      </ul>

      <h2>Por qué 777 es peligroso</h2>
      <p>
        <code>chmod 777</code> otorga permisos de lectura, escritura y ejecución a todos los usuarios
        del sistema. Esto significa que cualquier proceso ejecutándose como cualquier usuario — incluyendo
        una aplicación web comprometida, un script malicioso en un entorno de hosting compartido, o
        cualquier otro usuario de la máquina — puede modificar o ejecutar el archivo. En un contexto de
        servidor web, un archivo PHP con permisos 777 permite que cualquier otro proceso lo sobrescriba
        con código malicioso. Nunca uses 777 en producción. Si lo estás usando para "corregir un error de
        permisos", la solución real es darle la propiedad del archivo al usuario o grupo correcto.
      </p>

      <h2>Setuid, setgid y sticky bit</h2>
      <p>
        Más allá de los nueve bits estándar, hay tres bits especiales que aparecen como un cuarto dígito
        inicial en la notación octal de cuatro dígitos:
      </p>
      <ul>
        <li><strong>Setuid (4xxx)</strong> — cuando se establece en un ejecutable, el programa se ejecuta con los privilegios del propietario del archivo, no del ejecutor. <code>/usr/bin/passwd</code> lo usa para permitir que usuarios normales escriban en <code>/etc/shadow</code>, que pertenece a root.</li>
        <li><strong>Setgid (2xxx)</strong> — en un ejecutable, se ejecuta con los privilegios de grupo del archivo. En un directorio, los nuevos archivos creados dentro heredan el grupo del directorio en lugar del grupo primario del creador — útil para directorios de proyectos compartidos.</li>
        <li><strong>Sticky bit (1xxx)</strong> — en un directorio, evita que los usuarios eliminen archivos que no les pertenecen, incluso si tienen acceso de escritura al directorio. <code>/tmp</code> tiene el sticky bit activado (<code>chmod 1777</code>) para que los usuarios puedan crear sus propios archivos temporales pero no eliminar los de otros.</li>
      </ul>

      <h2>chmod recursivo (-R) y ejemplos del mundo real</h2>
      <p>
        El indicador <code>-R</code> aplica un cambio de permisos de forma recursiva a un directorio y
        todo su contenido. Úsalo con cuidado — aplicar los mismos permisos tanto a archivos como a
        directorios suele ser incorrecto, porque los directorios necesitan el bit de ejecución para poder
        acceder a ellos, mientras que los archivos normales generalmente no deberían tener ejecución:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Servidor web: los directorios necesitan 755, los archivos necesitan 644
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Corregir permisos de clave SSH
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/authorized_keys

# Hacer ejecutable un script de despliegue
chmod +x deploy.sh`}
      </pre>
      <p>
        Cuando no estés seguro de qué valor octal usar, la{" "}
        <a href="/tools/chmod">Calculadora chmod de BrowseryTools</a> te permite marcar casillas para
        los permisos de propietario, grupo y otros, y ver al instante el valor octal resultante y la
        notación simbólica.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculadora chmod gratuita — Octal ↔ Simbólico ↔ Legible por humanos
        </p>
        <a
          href="/tools/chmod"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Abrir la Calculadora chmod →
        </a>
      </div>
      <ToolCTA slug="chmod" variant="card" />
    </div>
  );
}
