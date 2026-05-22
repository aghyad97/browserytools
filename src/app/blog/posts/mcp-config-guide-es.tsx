export default function Content() {
  return (
    <div>
      <p>
        Durante la mayor parte de la breve historia de la IA, conectar un modelo de lenguaje a una
        herramienta externa significaba escribir código de integración personalizado para cada
        herramienta. ¿Quieres que el modelo lea un archivo? Escribe una función. ¿Consultar una base
        de datos? Escribe una función diferente, en un formato diferente, para cada modelo que quieras
        soportar. El resultado fue un ecosistema fragmentado donde cada aplicación de IA reinventaba
        la misma plomería desde cero.
      </p>
      <p>
        Model Context Protocol (MCP) es la respuesta de Anthropic a este problema: un estándar abierto
        que da a los modelos de IA una interfaz única y consistente para herramientas, archivos, bases
        de datos y servicios. Puedes usar el{" "}
        <a href="/tools/mcp-config">Generador de Configuración MCP de BrowseryTools</a> —gratis, sin
        registro, todo se queda en tu navegador— para construir y validar archivos de configuración MCP
        sin escribir JSON a mano.
      </p>

      <h2>¿Qué Es MCP y Por Qué Existe?</h2>
      <p>
        MCP son las siglas de Model Context Protocol. Es un protocolo abierto —publicado por Anthropic
        a finales de 2024 y disponible en modelcontextprotocol.io— que estandariza cómo se comunican
        los modelos de IA con fuentes de datos y herramientas externas. Piensa en él como un adaptador
        universal: en lugar de que un modelo necesite un plugin personalizado para GitHub, uno diferente
        para tu sistema de archivos y otro para tu base de datos, MCP proporciona una única interfaz
        que cualquier cliente y servidor compatible pueden hablar.
      </p>
      <p>
        La analogía que usa Anthropic es el USB-C: antes del USB-C, necesitabas un cable diferente para
        cada dispositivo. MCP aspira a ser ese conector universal para el uso de herramientas de IA.
        Una herramienta construida una vez como servidor MCP funciona con cualquier cliente compatible
        con MCP —Claude Desktop, Claude Code y cualquier otro host que implemente el protocolo.
      </p>

      <h2>Arquitectura MCP: Clientes, Hosts y Servidores</h2>
      <p>
        MCP tiene tres componentes que trabajan juntos:
      </p>
      <ul>
        <li><strong>Host</strong> — La aplicación de IA que se ejecuta en la máquina del usuario (por ejemplo,
        Claude Desktop, una extensión de IDE). El host gestiona las conexiones con uno o más servidores MCP
        e inyecta sus capacidades en el contexto de IA.</li>
        <li><strong>Cliente</strong> — Un cliente de protocolo integrado en el host que mantiene una conexión
        1:1 con un único servidor MCP. El host genera un cliente por servidor.</li>
        <li><strong>Servidor</strong> — Un programa ligero que expone capacidades (herramientas, recursos,
        prompts) a través del protocolo MCP. Los servidores pueden ser procesos locales (que se ejecutan en
        tu máquina) o servicios remotos accesibles a través de HTTP.</li>
      </ul>
      <p>
        Cuando le pides a Claude que «lea el README de mi proyecto», el cliente MCP del host envía una
        solicitud al servidor MCP del sistema de archivos, que lee el archivo y devuelve el contenido.
        Claude nunca toca directamente tu sistema de archivos —lo hace el servidor, que informa a través
        del protocolo.
      </p>

      <h2>Qué Pueden Exponer los Servidores MCP</h2>
      <p>
        Los servidores MCP pueden exponer tres tipos de capacidades:
      </p>
      <ul>
        <li><strong>Herramientas</strong> — Funciones que el modelo puede llamar. Ejemplos: buscar en una base
        de datos, crear un issue en GitHub, ejecutar un comando de terminal, obtener una URL.</li>
        <li><strong>Recursos</strong> — Datos que el modelo puede leer. Ejemplos: archivos, filas de base de
        datos, respuestas de API, páginas de documentación. Los recursos son como fuentes de contexto de
        solo lectura.</li>
        <li><strong>Prompts</strong> — Plantillas de prompts preconstruidas que los usuarios pueden invocar
        por nombre. Útiles para exponer flujos de trabajo estandarizados.</li>
      </ul>

      <h2>Servidores MCP Comunes que Vale la Pena Conocer</h2>
      <ul>
        <li><strong>filesystem</strong> — Lee y escribe archivos en tu máquina local dentro de un directorio
        especificado. El servidor más comúnmente usado. Necesario para que Claude Code lea tu base de código.</li>
        <li><strong>github</strong> — Busca repositorios, lee archivos, crea issues y pull requests, obtiene
        el historial de commits. Usa la API de GitHub con tu token de acceso personal.</li>
        <li><strong>postgres / sqlite</strong> — Ejecuta consultas SQL contra una base de datos. Solo lectura
        por defecto en la mayoría de las implementaciones por seguridad.</li>
        <li><strong>brave-search / fetch</strong> — Obtiene URLs o realiza búsquedas web, dando al modelo
        acceso a información actual más allá de su fecha de corte de entrenamiento.</li>
        <li><strong>memory</strong> — Almacenamiento de clave-valor persistente que sobrevive entre sesiones.
        Da al modelo una capa de memoria en la que puede escribir y leer.</li>
        <li><strong>puppeteer / playwright</strong> — Controla un navegador sin cabeza. Permite al modelo
        navegar por páginas web, rellenar formularios y extraer contenido de sitios renderizados con
        JavaScript.</li>
      </ul>

      <h2>Escribir un JSON de Configuración MCP Básico</h2>
      <p>
        La configuración MCP vive en un archivo JSON que la aplicación host lee al arrancar. Para Claude
        Desktop en macOS, este archivo está en{" "}
        <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. La estructura es
        consistente independientemente de los servidores que añadas:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}`}
      </pre>
      <p>
        Cada clave dentro de <code>mcpServers</code> es el nombre que le das al servidor —esta es la
        etiqueta que aparece en la interfaz de Claude. Los campos <code>command</code> y <code>args</code>{" "}
        definen cómo iniciar el proceso del servidor. La mayoría de los servidores oficiales son paquetes
        npm, por lo que <code>npx -y</code> los descarga y ejecuta en el primer uso sin un paso de
        instalación separado.
      </p>

      <h2>Añadir Múltiples Servidores</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}`}
      </pre>
      <p>
        El campo <code>env</code> pasa variables de entorno al proceso del servidor. Los valores
        sensibles como las claves de API y las credenciales de base de datos deben ir aquí, no
        codificados en <code>args</code>, para que puedas gestionarlos por separado y evitar
        confirmarlos accidentalmente en el control de versiones.
      </p>

      <h2>Configurar MCP en Claude Code</h2>
      <p>
        Claude Code (la herramienta CLI) usa un mecanismo de configuración ligeramente diferente.
        Añades servidores MCP con el comando <code>claude mcp add</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Add a local stdio server
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Add a remote HTTP server
claude mcp add my-server --transport http http://localhost:8080/mcp

# Add with environment variables
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github

# List all configured servers
claude mcp list`}
      </pre>
      <p>
        Claude Code almacena las configuraciones de servidores en <code>~/.claude/</code> por defecto
        (ámbito de usuario) o en <code>.mcp.json</code> en la raíz del proyecto (ámbito de proyecto).
        Las configuraciones de ámbito de proyecto son útiles para los repositorios de equipos —confirma
        el <code>.mcp.json</code> y todos en el equipo obtendrán automáticamente la misma configuración
        de servidores.
      </p>

      <h2>Errores de Configuración Comunes</h2>
      <ul>
        <li><strong>Separador de ruta incorrecto</strong> — Windows usa barras invertidas pero las cadenas JSON
        requieren barras hacia adelante o barras invertidas escapadas. Usa siempre barras hacia adelante en
        las configuraciones MCP, incluso en Windows.</li>
        <li><strong>Permisos de directorio faltantes</strong> — El servidor de sistema de archivos solo puede
        acceder a los directorios que enumeras explícitamente en sus argumentos. Si Claude dice que no puede
        encontrar un archivo, verifica que el directorio padre del archivo esté en la lista permitida.</li>
        <li><strong>Proceso de servidor obsoleto</strong> — Si un servidor se cuelga, el host puede no
        reiniciarlo automáticamente. Reinicia Claude Desktop o ejecuta{" "}
        <code>claude mcp restart &lt;name&gt;</code> en Claude Code para obtener una conexión nueva.</li>
        <li><strong>Incompatibilidades de versiones</strong> — MCP se desarrolla activamente. Si un servidor
        se está comportando de forma inesperada, verifica si estás ejecutando la última versión con{" "}
        <code>npx -y @modelcontextprotocol/server-name@latest</code>.</li>
      </ul>

      <h2>Genera Tu Configuración con BrowseryTools</h2>
      <p>
        Escribir JSON de MCP a mano es tedioso y fácil de equivocar —una coma que falta o una ruta
        entre comillas incorrectas hace que toda la configuración falle silenciosamente. El{" "}
        <a href="/tools/mcp-config">Generador de Configuración MCP de BrowseryTools</a> te permite
        seleccionar tus servidores, rellenar los parámetros necesarios y obtener un JSON válido y
        formateado listo para pegar en tu archivo de configuración de Claude Desktop o{" "}
        <code>.mcp.json</code>. Todo se ejecuta en tu navegador y no se almacenan credenciales.
      </p>

      <h2>Resumen</h2>
      <p>
        MCP es la capa de infraestructura que transforma un modelo de chat independiente en un agente
        conectado con acceso a tus archivos, código, bases de datos y servicios reales. El protocolo es
        abierto, los servidores son modulares y el formato de configuración es JSON sencillo. Una vez
        que tu configuración MCP está en su lugar, obtienes un asistente de IA dramáticamente más capaz
        sin cambiar la forma en que interactúas con él —las herramientas simplemente están ahí, listas
        para usar.
      </p>
    </div>
  );
}
