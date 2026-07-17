import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Pendant la majeure partie de la courte histoire de l'IA, connecter un modèle de langage à un
        outil externe signifiait écrire du code d'intégration personnalisé pour chaque outil. Vous voulez
        que le modèle lise un fichier ? Écrivez une fonction. Interrogez une base de données ? Écrivez une
        fonction différente, dans un format différent, pour chaque modèle que vous souhaitez prendre en
        charge. Le résultat était un écosystème fragmenté où chaque application IA réinventait la même
        plomberie de zéro.
      </p>
      <ToolCTA slug="mcp-config" variant="inline" />
      <p>
        Model Context Protocol (MCP) est la réponse d'Anthropic à ce problème : un standard ouvert qui
        donne aux modèles d'IA une interface unique et cohérente pour les outils, fichiers, bases de
        données et services. Vous pouvez utiliser le{" "}
        <a href="/tools/mcp-config">Générateur de configuration MCP BrowseryTools</a> — gratuit, sans
        inscription, tout reste dans votre navigateur — pour construire et valider des fichiers de
        configuration MCP sans écrire de JSON à la main.
      </p>

      <h2>Qu'est-ce que MCP et pourquoi existe-t-il ?</h2>
      <p>
        MCP signifie Model Context Protocol. C'est un protocole ouvert — publié par Anthropic fin 2024
        et disponible sur modelcontextprotocol.io — qui standardise la façon dont les modèles d'IA
        communiquent avec des sources de données et des outils externes. Pensez-y comme un adaptateur
        universel : au lieu qu'un modèle ait besoin d'un plugin personnalisé pour GitHub, un autre pour
        votre système de fichiers et un autre pour votre base de données, MCP fournit une interface
        unique que n'importe quel client et serveur conformes peuvent utiliser.
      </p>
      <p>
        L'analogie qu'utilise Anthropic est l'USB-C : avant l'USB-C, il fallait un câble différent pour
        chaque appareil. MCP vise à être ce connecteur universel pour l'utilisation d'outils par l'IA.
        Un outil construit une fois comme serveur MCP fonctionne avec n'importe quel client compatible
        MCP — Claude Desktop, Claude Code, et tout autre hôte qui implémente le protocole.
      </p>

      <h2>Architecture MCP : clients, hôtes et serveurs</h2>
      <p>
        MCP comporte trois composants qui fonctionnent ensemble :
      </p>
      <ul>
        <li><strong>Hôte</strong> — L'application IA fonctionnant sur la machine de l'utilisateur (ex. Claude Desktop, une extension IDE). L'hôte gère les connexions à un ou plusieurs serveurs MCP et injecte leurs capacités dans le contexte IA.</li>
        <li><strong>Client</strong> — Un client de protocole intégré dans l'hôte qui maintient une connexion 1:1 avec un seul serveur MCP. L'hôte crée un client par serveur.</li>
        <li><strong>Serveur</strong> — Un programme léger qui expose des capacités (outils, ressources, prompts) via le protocole MCP. Les serveurs peuvent être des processus locaux (fonctionnant sur votre machine) ou des services distants accessibles via HTTP.</li>
      </ul>
      <p>
        Quand vous demandez à Claude de « lire le README de mon projet », le client MCP de l'hôte envoie
        une requête au serveur MCP du système de fichiers, qui lit le fichier et retourne le contenu.
        Claude ne touche jamais directement votre système de fichiers — c'est le serveur qui le fait, et
        il rapporte via le protocole.
      </p>

      <h2>Ce que les serveurs MCP peuvent exposer</h2>
      <p>
        Les serveurs MCP peuvent exposer trois types de capacités :
      </p>
      <ul>
        <li><strong>Outils</strong> — Fonctions que le modèle peut appeler. Exemples : rechercher dans une base de données, créer une issue GitHub, exécuter une commande terminal, récupérer une URL.</li>
        <li><strong>Ressources</strong> — Données que le modèle peut lire. Exemples : fichiers, lignes de base de données, réponses d'API, pages de documentation. Les ressources sont comme des sources de contexte en lecture seule.</li>
        <li><strong>Prompts</strong> — Modèles de prompts préconstruits que les utilisateurs peuvent invoquer par nom. Utile pour exposer des workflows standardisés.</li>
      </ul>

      <h2>Serveurs MCP courants à connaître</h2>
      <ul>
        <li><strong>filesystem</strong> — Lit et écrit des fichiers sur votre machine locale dans un répertoire spécifié. Le serveur le plus couramment utilisé. Requis pour que Claude Code lise votre base de code.</li>
        <li><strong>github</strong> — Recherche dans les dépôts, lit des fichiers, crée des issues et des pull requests, récupère l'historique des commits. Utilise l'API GitHub avec votre token d'accès personnel.</li>
        <li><strong>postgres / sqlite</strong> — Exécute des requêtes SQL sur une base de données. En lecture seule par défaut dans la plupart des implémentations pour des raisons de sécurité.</li>
        <li><strong>brave-search / fetch</strong> — Récupère des URL ou lance des recherches web, donnant au modèle accès aux informations actuelles au-delà de sa date de coupure d'entraînement.</li>
        <li><strong>memory</strong> — Stockage clé-valeur persistant qui survit entre les sessions. Donne au modèle une couche mémoire dans laquelle il peut écrire et lire.</li>
        <li><strong>puppeteer / playwright</strong> — Contrôle un navigateur sans tête. Permet au modèle de naviguer sur des pages web, remplir des formulaires et extraire du contenu de sites rendu par JavaScript.</li>
      </ul>

      <h2>Rédiger un JSON de configuration MCP de base</h2>
      <p>
        La configuration MCP réside dans un fichier JSON que l'application hôte lit au démarrage. Pour
        Claude Desktop sur macOS, ce fichier se trouve à{" "}
        <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. La structure est
        cohérente quel que soit le serveur que vous ajoutez :
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
        Chaque clé dans <code>mcpServers</code> est le nom que vous donnez au serveur — c'est le label
        qui apparaît dans l'interface Claude. Les champs <code>command</code> et <code>args</code>
        définissent comment démarrer le processus serveur. La plupart des serveurs officiels sont des
        packages npm, donc <code>npx -y</code> les télécharge et les exécute à la première utilisation
        sans étape d'installation séparée.
      </p>

      <h2>Ajouter plusieurs serveurs</h2>
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
        Le champ <code>env</code> passe des variables d'environnement au processus serveur. Les valeurs
        sensibles comme les clés API et les identifiants de base de données doivent aller ici, pas dans
        <code>args</code> en dur, pour que vous puissiez les gérer séparément et éviter de les committer
        accidentellement dans le contrôle de version.
      </p>

      <h2>Configurer MCP dans Claude Code</h2>
      <p>
        Claude Code (l'outil CLI) utilise un mécanisme de configuration légèrement différent. Vous ajoutez
        des serveurs MCP avec la commande <code>claude mcp add</code> :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Ajouter un serveur stdio local
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Ajouter un serveur HTTP distant
claude mcp add my-server --transport http http://localhost:8080/mcp

# Ajouter avec des variables d'environnement
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github

# Lister tous les serveurs configurés
claude mcp list`}
      </pre>
      <p>
        Claude Code stocke les configurations de serveurs dans <code>~/.claude/</code> par défaut (portée
        utilisateur) ou dans <code>.mcp.json</code> à la racine du projet (portée projet). Les
        configurations à portée projet sont utiles pour les dépôts d'équipe — committez le{" "}
        <code>.mcp.json</code> et toute l'équipe obtient automatiquement la même configuration de serveur.
      </p>

      <h2>Erreurs de configuration courantes</h2>
      <ul>
        <li><strong>Mauvais séparateur de chemin</strong> — Windows utilise des barres obliques inverses mais les chaînes JSON nécessitent des barres obliques directes ou des barres obliques inverses échappées. Utilisez toujours des barres obliques directes dans les configurations MCP, même sous Windows.</li>
        <li><strong>Permissions de répertoire manquantes</strong> — Le serveur du système de fichiers ne peut accéder qu'aux répertoires explicitement listés dans ses args. Si Claude dit qu'il ne peut pas trouver un fichier, vérifiez que le répertoire parent du fichier est dans la liste autorisée.</li>
        <li><strong>Processus serveur bloqué</strong> — Si un serveur plante, l'hôte peut ne pas le redémarrer automatiquement. Redémarrez Claude Desktop ou exécutez <code>claude mcp restart &lt;nom&gt;</code> dans Claude Code pour obtenir une nouvelle connexion.</li>
        <li><strong>Incompatibilités de version</strong> — MCP est activement développé. Si un serveur se comporte de façon inattendue, vérifiez que vous exécutez la dernière version avec{" "}
        <code>npx -y @modelcontextprotocol/server-name@latest</code>.</li>
      </ul>

      <h2>Générez votre configuration avec BrowseryTools</h2>
      <p>
        Écrire du JSON MCP à la main est fastidieux et facile à se tromper — une virgule manquante ou un
        chemin mal mis entre guillemets fait échouer toute la configuration silencieusement. Le{" "}
        <a href="/tools/mcp-config">Générateur de configuration MCP BrowseryTools</a> vous permet de
        sélectionner vos serveurs, de renseigner les paramètres requis et d'obtenir une configuration
        JSON valide et formatée, prête à coller dans votre fichier de configuration Claude Desktop ou
        votre <code>.mcp.json</code>. Tout s'exécute dans votre navigateur et aucune information
        d'identification n'est stockée.
      </p>

      <h2>Résumé</h2>
      <p>
        MCP est la couche d'infrastructure qui transforme un modèle de chat autonome en un agent connecté
        avec accès à vos fichiers réels, votre code, vos bases de données et vos services. Le protocole
        est ouvert, les serveurs sont modulaires, et le format de configuration est du JSON simple. Une
        fois votre configuration MCP en place, vous obtenez un assistant IA considérablement plus capable
        sans changer la façon dont vous interagissez avec lui — les outils sont simplement là, prêts à
        être utilisés.
      </p>
      <ToolCTA slug="mcp-config" variant="card" />
    </div>
  );
}
