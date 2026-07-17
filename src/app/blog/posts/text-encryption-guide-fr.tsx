import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Lorsque vous saisissez un message dans une application de notes ou un formulaire web, où va-t-il ?
        Dans la plupart des cas, le texte est transmis à un serveur, stocké dans une base de données et
        potentiellement lu par quiconque ayant accès à cette base — les employés de l'entreprise, un
        attaquant lors d'une violation de données ou une réquisition judiciaire. Le chiffrement côté
        client est l'approche technique qui change cette équation : vos données sont chiffrées avant
        même de quitter votre appareil, de sorte que même le serveur qui les stocke ne peut pas les lire.
      </p>
      <ToolCTA slug="text-encryption" variant="inline" />
      <p>
        Vous pouvez chiffrer et déchiffrer n'importe quel texte directement dans votre navigateur grâce
        à l'outil{" "}
        <a href="/tools/text-encryption">Chiffrement de texte BrowseryTools</a> — gratuit, sans
        inscription, vos données ne quittent jamais votre appareil.
      </p>

      <h2>Ce que signifie réellement le chiffrement côté client</h2>
      <p>
        Le chiffrement côté client signifie que les opérations cryptographiques (chiffrement et
        déchiffrement des données) s'effectuent sur l'appareil de l'utilisateur — dans le navigateur,
        dans une application mobile ou dans une application de bureau — avant que toute donnée ne soit
        transmise ou stockée. Le serveur ne reçoit que du texte chiffré : une séquence illisible et
        mélangée d'octets mathématiquement inutile sans la clé de déchiffrement.
      </p>
      <p>
        C'est fondamentalement différent du chiffrement côté serveur (également appelé « chiffrement au
        repos »), où le serveur reçoit vos données en clair puis les chiffre pour le stockage en
        utilisant des clés que le serveur lui-même contrôle. Dans ce modèle, le fournisseur de service
        peut toujours déchiffrer vos données. Avec le chiffrement côté client, seule la personne qui
        détient la clé — qui ne quitte jamais votre appareil — peut lire les données.
      </p>
      <p>
        L'implication pratique : si quelqu'un pénètre dans le serveur et vole les données chiffrées, il
        n'a rien d'utile. Le texte chiffré nécessite la clé pour être déchiffré, et la clé n'a jamais
        été sur le serveur.
      </p>

      <h2>Chiffrement symétrique vs asymétrique</h2>
      <p>
        Il existe deux approches fondamentales du chiffrement, et elles servent des objectifs différents.
      </p>
      <ul>
        <li>
          <strong>Chiffrement symétrique (AES)</strong> — une clé chiffre les données, et la même clé les déchiffre. Rapide, efficace et adapté au chiffrement de grandes quantités de données. Le défi est la distribution des clés : comment partager la clé de manière sécurisée avec quiconque a besoin de déchiffrer les données ? Pour un usage personnel (chiffrement de ses propres notes), le chiffrement symétrique est idéal — vous détenez la seule clé. AES (Advanced Encryption Standard) est l'algorithme symétrique dominant.
        </li>
        <li>
          <strong>Chiffrement asymétrique (RSA, ECDH)</strong> — deux clés mathématiquement liées : une clé publique que n'importe qui peut utiliser pour chiffrer des données, et une clé privée que seul le propriétaire détient, utilisée pour le déchiffrement. Résout le problème de distribution des clés — vous pouvez partager votre clé publique ouvertement. Beaucoup plus lent que le chiffrement symétrique pour les grandes données. La plupart des systèmes réels utilisent le chiffrement asymétrique uniquement pour échanger une clé symétrique, puis passent à AES pour les données en volume. C'est ainsi que fonctionne TLS (HTTPS).
        </li>
      </ul>

      <h2>Pourquoi AES-256 est le standard</h2>
      <p>
        AES-256 signifie AES avec une clé de 256 bits. La taille de clé 256 bits signifie qu'il y a
        2<sup>256</sup> clés possibles — un nombre si grand que le forçage brut n'est pas faisable
        computationnellement avec toute technologie qui existe ou est théoriquement possible avec des
        ordinateurs classiques. Pour mettre les choses en perspective : si chaque atome de l'univers
        observable était un ordinateur vérifiant un milliard de clés par seconde, il faudrait encore
        plus longtemps que l'âge de l'univers pour épuiser toutes les 2<sup>256</sup> clés.
      </p>
      <p>
        AES est également un standard NIST (Institut national américain des standards et de la
        technologie), a été cryptanalysé de manière extensive pendant des décennies sans aucune faiblesse
        pratique trouvée dans l'algorithme lui-même, et bénéficie d'une accélération matérielle
        (instructions AES-NI) dans pratiquement tous les CPU modernes — ce qui en fait à la fois l'option
        la plus sûre et la plus rapide disponible. AES-GCM (mode Galois/Counter) est la variante
        recommandée car elle fournit à la fois le chiffrement et l'authentification (détection si le
        texte chiffré a été falsifié).
      </p>

      <h2>Dérivation de clé à partir de mots de passe</h2>
      <p>
        AES-256 nécessite une clé de 256 bits (32 octets). Les mots de passe choisis par les humains ne
        sont pas 32 octets aléatoires — ce sont des chaînes courtes avec des patterns et des jeux de
        caractères limités. Utiliser directement un mot de passe comme clé AES serait catastrophiquement
        peu sûr. Les fonctions de dérivation de clé (KDF) comblent cet écart.
      </p>
      <p>
        Une KDF prend un mot de passe et produit une clé cryptographiquement robuste de n'importe
        quelle longueur désirée. Les trois KDF les plus importantes sont :
      </p>
      <ul>
        <li>
          <strong>PBKDF2 (Password-Based Key Derivation Function 2)</strong> — applique une fonction HMAC des milliers ou centaines de milliers de fois (itérations) au mot de passe. Plus d'itérations signifie plus de travail computationnel pour un attaquant essayant de forcer le mot de passe. PBKDF2 est la KDF la plus largement supportée et est utilisée dans la sécurité Wi-Fi WPA2, le chiffrement des appareils iOS et de nombreux systèmes d'authentification web.
        </li>
        <li>
          <strong>bcrypt</strong> — conçu spécifiquement pour le hachage de mots de passe avec un calcul délibérément lent. Dispose d'un « facteur de coût » qui contrôle sa lenteur. Largement utilisé pour stocker les mots de passe utilisateurs dans les bases de données mais pas typiquement utilisé pour dériver des clés AES.
        </li>
        <li>
          <strong>scrypt</strong> — ajoute une résistance mémoire en plus du coût computationnel. Un attaquant utilisant du matériel spécialisé (ASICs ou GPU) peut exécuter PBKDF2 en parallèle à moindre coût ; scrypt nécessite tellement de mémoire par calcul que les attaques parallèles deviennent coûteuses. Utilisé dans certains systèmes de cryptomonnaies et nouvelles applications de sécurité.
        </li>
      </ul>
      <p>
        Tous les bons systèmes de chiffrement utilisent également un <strong>sel</strong> — une valeur
        aléatoire combinée au mot de passe avant la dérivation de clé, de sorte que deux utilisateurs
        avec le même mot de passe produisent des clés différentes, et que les attaques par tables
        arc-en-ciel précalculées sont déjouées.
      </p>

      <h2>Ce que « aucun serveur ne voit vos données » signifie réellement</h2>
      <p>
        Quand un outil affirme « aucun serveur ne voit vos données », cela signifie que le texte en clair
        ne quitte jamais votre navigateur. Le JavaScript s'exécutant dans votre navigateur effectue le
        chiffrement localement, et seul le texte chiffré (la sortie chiffrée) serait jamais transmis —
        et seulement si vous choisissez de le transmettre.
      </p>
      <p>
        L'outil <a href="/tools/text-encryption">Chiffrement de texte BrowseryTools</a> va encore plus
        loin : rien n'est transmis du tout. L'opération entière est locale. Vous pouvez le vérifier en
        ouvrant les Outils pour développeurs de votre navigateur, en passant à l'onglet Réseau et en
        observant qu'aucune requête n'est effectuée lorsque vous chiffrez ou déchiffrez. L'outil utilise
        l'API Web Crypto — une bibliothèque cryptographique native du navigateur intégrée dans chaque
        navigateur moderne — ce qui signifie que la cryptographie n'est pas du code JavaScript personnalisé ;
        c'est la même implémentation de confiance que votre navigateur utilise pour les connexions HTTPS.
      </p>

      <h2>Idées reçues courantes sur le chiffrement dans le navigateur</h2>
      <ul>
        <li>
          <strong>« HTTPS chiffre déjà tout »</strong> — HTTPS chiffre les données en transit entre votre navigateur et le serveur. Une fois les données arrivées sur le serveur, elles sont déchiffrées et stockées en texte clair (ou re-chiffrées avec des clés contrôlées par le serveur). Le chiffrement côté client protège les données du serveur lui-même, pas seulement de l'interception réseau.
        </li>
        <li>
          <strong>« Le JavaScript pourrait être modifié pour voler mes données »</strong> — vrai pour toute application web. C'est pourquoi les outils open source et audités sont préférables aux outils opaques pour les cas d'usage sensibles. Pour une sécurité maximale, téléchargez l'outil et exécutez-le hors ligne.
        </li>
        <li>
          <strong>« Le chiffrement dans le navigateur est faible »</strong> — le chiffrement dans le navigateur utilisant l'API Web Crypto et AES-256-GCM est le même algorithme que celui utilisé par les logiciels de sécurité d'entreprise et le chiffrement intégral du disque des systèmes d'exploitation. L'algorithme n'est pas plus faible parce qu'il s'exécute dans un navigateur.
        </li>
        <li>
          <strong>« Si j'oublie le mot de passe, les données sont récupérables »</strong> — elles ne le sont pas. Le chiffrement côté client ne fournit aucun mécanisme de récupération. Les données sont mathématiquement irrecouvrables sans la clé. C'est une fonctionnalité, pas un bug — mais cela requiert une gestion soigneuse des clés.
        </li>
      </ul>

      <h2>Cas d'usage pratiques</h2>
      <ul>
        <li><strong>Chiffrement de notes sensibles</strong> — informations médicales, détails de comptes financiers ou entrées de journal personnel que vous souhaitez stocker dans une application de notes cloud sans faire confiance au fournisseur</li>
        <li><strong>Protection de texte sensible dans des documents</strong> — intégrer des identifiants ou secrets chiffrés dans un document qui sera partagé, où seul le destinataire qui connaît le mot de passe peut les lire</li>
        <li><strong>Envoyer des messages privés via des canaux publics</strong> — chiffrez un message, partagez le texte chiffré dans un canal public, et partagez le mot de passe via un canal privé séparé</li>
        <li><strong>Sauvegardes sécurisées</strong> — chiffrement des données exportées avant de les stocker sur un service de sauvegarde non fiable</li>
      </ul>

      <h2>Limites du chiffrement côté client</h2>
      <p>
        Le chiffrement côté client est puissant mais n'est pas une solution de sécurité complète :
      </p>
      <ul>
        <li><strong>Des mots de passe faibles annulent un chiffrement fort</strong> — AES-256 avec le mot de passe « hello123 » offre pratiquement aucune protection contre un attaquant déterminé capable de lancer des attaques par dictionnaire</li>
        <li><strong>Compromission de l'appareil</strong> — si un attaquant contrôle votre appareil (malware, keylogger), il peut capturer les données avant qu'elles ne soient chiffrées ou intercepter la clé</li>
        <li><strong>Pas de partage sans échange de clé</strong> — partager des données chiffrées avec quelqu'un d'autre nécessite de partager la clé de manière sécurisée, ce qui est un problème distinct</li>
        <li><strong>Pas de recherche ni d'indexation</strong> — les données chiffrées ne peuvent pas être cherchées, triées ou traitées sans être préalablement déchiffrées</li>
      </ul>
      <ToolCTA slug="text-encryption" variant="card" />
    </div>
  );
}
