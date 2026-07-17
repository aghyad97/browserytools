import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Chaque fois que vous téléchargez une version d'un logiciel, vérifiez l'authenticité d'un fichier, signez un jeton JWT ou stockez le
        mot de passe d'un utilisateur, une fonction de hachage cryptographique travaille en arrière-plan. Les fonctions de hachage sont l'une
        des primitives fondamentales de la sécurité informatique moderne — et pourtant les différences entre MD5, SHA-1,
        SHA-256 et SHA-512 sont largement mal comprises, entraînant de véritables erreurs de sécurité dans les systèmes de production.
      </p>
      <ToolCTA slug="hash-generator" variant="inline" />
      <p>
        Ce guide explique ce que sont les fonctions de hachage, comment fonctionne chaque algorithme majeur, quand chacun est approprié
        (et quand il est dangereusement inapproprié), et comment utiliser le{" "}
        <a href="/tools/hash-generator">Générateur de hachage de BrowseryTools</a> pour calculer des empreintes instantanément dans votre
        navigateur en toute confidentialité.
      </p>

      <h2>Qu'est-ce qu'une fonction de hachage cryptographique ?</h2>
      <p>
        Une fonction de hachage cryptographique prend une entrée de longueur arbitraire et produit une sortie de longueur fixe
        appelée empreinte ou hachage. Quatre propriétés définissent une bonne fonction de hachage cryptographique :
      </p>
      <ul>
        <li>
          <strong>Déterministe :</strong> la même entrée produit toujours exactement la même sortie. Les fonctions de hachage
          n'ont aucun état interne — avec les mêmes octets, vous obtenez toujours la même empreinte.
        </li>
        <li>
          <strong>À sens unique (résistance à la préimage) :</strong> à partir d'une sortie de hachage, il devrait être calculatoirement
          impossible de récupérer l'entrée d'origine. Les fonctions de hachage sont conçues pour être faciles à calculer dans un
          sens et effectivement impossibles à inverser.
        </li>
        <li>
          <strong>Longueur de sortie fixe :</strong> que l'entrée fasse un octet ou un gigaoctet,
          la sortie a toujours la même longueur. SHA-256 produit toujours une empreinte de 256 bits (32 octets).
        </li>
        <li>
          <strong>Effet d'avalanche :</strong> un changement d'un seul bit dans l'entrée transforme complètement la sortie.
          Le hachage de <code>hello</code> ne ressemble en rien au hachage de <code>hello!</code> — ils ne partagent aucune
          structure prévisible. Cela rend les empreintes utiles comme empreintes digitales.
        </li>
      </ul>
      <p>
        Une cinquième propriété — la résistance aux collisions — sépare les hachages cryptographiquement solides de ceux qui sont cassés :
        il devrait être calculatoirement impossible de trouver deux entrées différentes qui produisent la même sortie.
        C'est là que MD5 et SHA-1 ont échoué.
      </p>

      <h2>MD5 : rapide, omniprésent et cassé pour la sécurité</h2>
      <p>
        MD5 (Message Digest 5) a été conçu par Ron Rivest et publié en 1991. Il produit une empreinte de 128 bits (16 octets),
        généralement représentée sous forme de chaîne hexadécimale de 32 caractères comme{" "}
        <code>5d41402abc4b2a76b9719d911017c592</code>. Pendant plus d'une décennie, ce fut l'algorithme de hachage dominant
        pour tout, des sommes de contrôle de fichiers au stockage de mots de passe.
      </p>
      <p>
        En 2004, des cryptographes ont démontré des attaques par collision pratiques contre MD5. En 2008, des chercheurs avaient
        utilisé des attaques par collision pour forger un certificat d'autorité de certification frauduleux approuvé par tous les principaux navigateurs.
        MD5 est désormais définitivement cassé pour tout usage de sécurité où la résistance aux collisions importe.
      </p>
      <p>
        Là où MD5 est encore acceptable :
      </p>
      <ul>
        <li>Les contrôles d'intégrité de fichiers hors sécurité où vous contrôlez à la fois la génération et la vérification (confirmer qu'un fichier n'a pas été corrompu en transit, et non qu'il n'a pas été altéré).</li>
        <li>Les sommes de contrôle dans les systèmes internes où un acteur malveillant ne fait pas partie du modèle de menace.</li>
        <li>La compatibilité avec des systèmes hérités où vous n'avez d'autre choix que de correspondre à une implémentation existante.</li>
        <li>Les clés de cache et les tables de hachage où la sécurité est sans importance et la vitesse compte.</li>
      </ul>
      <p>
        Là où MD5 ne doit jamais être utilisé : les certificats TLS, les signatures numériques, la signature de code, ou tout ce où
        un attaquant pourrait tirer profit de la découverte d'une collision.
      </p>

      <h2>SHA-1 : 160 bits, déprécié, toujours partout</h2>
      <p>
        SHA-1 (Secure Hash Algorithm 1) a été publié par le NIST en 1995 et produit une empreinte de 160 bits. C'était
        la norme pour les certificats TLS, les signatures numériques et la signature de logiciels tout au long des années 2000.
        Le Project Zero de Google a démontré une collision SHA-1 pratique en 2017 (l'attaque SHAttered), produisant
        deux fichiers PDF différents avec des empreintes SHA-1 identiques. Cela a mis fin à l'utilisation de SHA-1 dans TLS — tous les principaux éditeurs
        de navigateurs ont cessé d'accepter les certificats SHA-1 cette même année.
      </p>
      <p>
        SHA-1 se trouve encore dans quelques endroits notables :
      </p>
      <ul>
        <li>
          <strong>Git :</strong> Git a historiquement utilisé SHA-1 pour identifier chaque objet d'un dépôt —
          commits, blobs, arbres et tags. Git migre activement vers SHA-256 (voir ci-dessous), mais les dépôts Git
          en SHA-1 restent extrêmement courants. Pour ce cas d'usage, la résistance aux collisions importe moins car
          un attaquant aurait besoin d'un accès au système de fichiers pour exploiter une collision.
        </li>
        <li>Les systèmes d'authentification hérités et les anciennes implémentations HMAC.</li>
        <li>Certains anciens logiciels d'entreprise qui n'ont pas été mis à jour.</li>
      </ul>
      <p>
        Pour tout nouveau travail : évitez SHA-1. Utilisez SHA-256 ou SHA-512.
      </p>

      <h2>SHA-256 : la norme actuelle</h2>
      <p>
        SHA-256 fait partie de la famille SHA-2, publiée par le NIST en 2001. Il produit une empreinte de 256 bits (32 octets)
        — deux fois la longueur de sortie de MD5 et 60 % plus grande que SHA-1. Aucune attaque pratique par collision ou par préimage
        contre SHA-256 n'a été démontrée. Il reste la norme pour le hachage sensible à la sécurité en 2026.
      </p>
      <p>
        SHA-256 est utilisé partout :
      </p>
      <ul>
        <li><strong>Les certificats TLS :</strong> le CA/Browser Forum a imposé SHA-256 comme minimum pour les signatures de certificats. Chaque connexion HTTPS que vous établissez est ancrée par SHA-256.</li>
        <li><strong>La signature de code :</strong> macOS, Windows Authenticode et les gestionnaires de paquets Linux (APT, RPM) utilisent SHA-256 pour vérifier l'intégrité des logiciels.</li>
        <li><strong>Les jetons JWT :</strong> l'algorithme <code>HS256</code> dans les jetons web JSON est HMAC-SHA-256. C'est de loin l'algorithme de signature JWT le plus courant dans les systèmes déployés.</li>
        <li><strong>Bitcoin :</strong> l'algorithme de preuve de travail de Bitcoin est le double-SHA-256 (SHA-256 appliqué deux fois).</li>
        <li><strong>Git (nouvelle génération) :</strong> le format d'objet SHA-256 de Git (activé avec <code>--object-format=sha256</code>) utilise SHA-256 pour tous les identifiants d'objets.</li>
        <li>La vérification d'intégrité des fichiers publiée aux côtés des téléchargements de logiciels.</li>
      </ul>
      <p>
        Si vous devez choisir une fonction de hachage et que vous n'avez aucune contrainte spécifique, SHA-256 est le choix par défaut
        correct en 2026.
      </p>

      <h2>SHA-512 : sortie plus grande, parfois plus rapide</h2>
      <p>
        SHA-512 fait également partie de la famille SHA-2 et produit une empreinte de 512 bits (64 octets). Il offre une
        marge de sécurité plus grande que SHA-256 — 512 bits de sortie signifient que l'espace théorique d'attaque par force brute
        est 2<sup>256</sup> fois plus grand. En pratique, cette marge supplémentaire est sans importance pour la plupart des
        applications puisque SHA-256 est déjà calculatoirement impossible à casser.
      </p>
      <p>
        La caractéristique de performance contre-intuitive : SHA-512 est <em>plus rapide</em> que SHA-256 sur les CPU
        64 bits modernes lors du hachage de données volumineuses. SHA-512 traite les données en blocs de 1024 bits avec des opérations
        sur mots de 64 bits, tandis que SHA-256 utilise des blocs de 512 bits avec des opérations sur 32 bits. Sur un processeur 64 bits, les
        opérations 64 bits se mappent plus efficacement au matériel. Cela fait de SHA-512 le choix privilégié pour les
        applications qui hachent de gros fichiers sur des serveurs 64 bits.
      </p>
      <p>
        Utilisez SHA-512 lorsque :
      </p>
      <ul>
        <li>Vous hachez de grandes quantités de données sur du matériel 64 bits et voulez un débit maximal.</li>
        <li>Votre système exige la marge de sécurité supplémentaire pour des raisons réglementaires ou de conformité.</li>
        <li>Vous implémentez HMAC-SHA-512 (utilisé dans certaines implémentations JWT avec <code>HS512</code>).</li>
      </ul>

      <h2>Tableau comparatif des algorithmes</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Algorithme</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Longueur de sortie</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Vitesse (relative)</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Statut de sécurité</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Cas d'usage courants</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>MD5</strong></td>
              <td style={{padding: "12px 16px"}}>128 bits (32 caractères hex)</td>
              <td style={{padding: "12px 16px"}}>Le plus rapide</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Cassé</strong> — collisions démontrées</td>
              <td style={{padding: "12px 16px"}}>Sommes de contrôle hors sécurité, clés de cache, systèmes hérités</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-1</strong></td>
              <td style={{padding: "12px 16px"}}>160 bits (40 caractères hex)</td>
              <td style={{padding: "12px 16px"}}>Rapide</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Déprécié</strong> — des collisions pratiques existent</td>
              <td style={{padding: "12px 16px"}}>Git hérité, ancien TLS (déprécié), certaines authentifications héritées</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-256</strong></td>
              <td style={{padding: "12px 16px"}}>256 bits (64 caractères hex)</td>
              <td style={{padding: "12px 16px"}}>Rapide</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Sûr</strong> — norme actuelle</td>
              <td style={{padding: "12px 16px"}}>Certificats TLS, JWT (HS256), signature de code, Bitcoin</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-512</strong></td>
              <td style={{padding: "12px 16px"}}>512 bits (128 caractères hex)</td>
              <td style={{padding: "12px 16px"}}>Le plus rapide en 64 bits pour les données volumineuses</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Sûr</strong> — marge de sécurité plus grande</td>
              <td style={{padding: "12px 16px"}}>Hachage de gros fichiers, JWT (HS512), applications à haute sécurité</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Vérification de l'intégrité des fichiers : un exemple pratique</h2>
      <p>
        L'un des usages les plus courants et les plus légitimes des empreintes cryptographiques est de vérifier qu'un fichier téléchargé
        est exactement ce que l'éditeur a prévu — non corrompu en transit et non altéré par un tiers.
        La plupart des grands projets logiciels publient des sommes de contrôle SHA-256 aux côtés de leurs téléchargements.
      </p>
      <p>
        Le flux de travail ressemble à ceci :
      </p>
      <ul>
        <li>Téléchargez le fichier depuis la source officielle.</li>
        <li>Téléchargez la somme de contrôle publiée depuis la même source officielle (idéalement signée avec PGP).</li>
        <li>Calculez le hachage SHA-256 du fichier téléchargé.</li>
        <li>Comparez votre hachage calculé au hachage publié caractère par caractère. Toute différence signifie que le fichier n'est pas ce que l'éditeur a distribué.</li>
      </ul>
      <p>
        Le <a href="/tools/hash-generator">Générateur de hachage de BrowseryTools</a> prend en charge le hachage de fichiers — glissez-y
        un fichier et il calculera le hachage localement dans votre navigateur sans rien téléverser. Comparez le
        résultat directement à la somme de contrôle publiée.
      </p>

      <h2>Stockage des mots de passe : la seule chose que les hachages ne peuvent pas faire en toute sécurité</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem", color: "#dc2626"}}>
          Avertissement critique : ne stockez jamais de mots de passe à l'aide de simples fonctions de hachage
        </p>
        <p style={{marginTop: 0, marginBottom: "12px"}}>
          Stocker des mots de passe sous forme d'empreintes MD5, SHA-256 ou SHA-512 — même avec un sel — est non sécurisé et une
          faille grave dans tout système de production. Voici pourquoi :
        </p>
        <ul style={{marginTop: 0, marginBottom: "12px"}}>
          <li>Les fonctions de hachage à usage général sont conçues pour être <em>rapides</em>. Un GPU moderne peut calculer des milliards d'empreintes SHA-256 par seconde. Si votre base de données est compromise, un attaquant peut casser par force brute tous les mots de passe courants en quelques minutes.</li>
          <li>Les tables arc-en-ciel — des tables de correspondance précalculées associant des empreintes à des entrées — peuvent casser des empreintes non salées de mots de passe courants en quelques millisecondes.</li>
          <li>Même avec un sel unique par utilisateur, la vitesse brute de SHA-256 facilite l'attaque à grande échelle de mots de passe faibles ou de force moyenne.</li>
        </ul>
        <p style={{marginTop: 0, marginBottom: 0}}>
          <strong>Utilisez plutôt une fonction de hachage de mots de passe :</strong> <code>bcrypt</code>, <code>scrypt</code>,
          ou <code>Argon2</code> (le vainqueur du Password Hashing Competition). Celles-ci sont délibérément lentes
          et gourmandes en mémoire, rendant les attaques par force brute plus coûteuses de plusieurs ordres de grandeur. La plupart des
          frameworks modernes les incluent d'emblée. Argon2id est la recommandation actuelle pour les nouveaux systèmes.
        </p>
      </div>

      <h2>Comment Git utilise SHA-1 (et migre vers SHA-256)</h2>
      <p>
        Git utilise une fonction de hachage pour identifier chaque objet d'un dépôt. Chaque commit, fichier (blob), liste de
        répertoire (arbre) et tag est stocké dans la base de données d'objets sous son empreinte SHA-1. Lorsque vous exécutez{" "}
        <code>git log</code>, les longues chaînes hexadécimales que vous voyez — comme{" "}
        <code>c206f4b3a9d72bc0e53a0e1a6e4bdf8c7f9d2e51</code> — sont des empreintes SHA-1 d'objets de commit.
      </p>
      <p>
        Git a choisi SHA-1 en 2005 pour la vitesse et parce qu'à l'époque SHA-1 n'était pas cassé. Le rôle des empreintes
        dans Git diffère légèrement de l'usage de sécurité traditionnel : Git les utilise comme clés de stockage adressables
        par le contenu, et non comme preuves d'authentification. Le contenu lui-même est ce à quoi vous faites confiance — l'empreinte n'est qu'un
        moyen efficace de le rechercher et de détecter une corruption accidentelle.
      </p>
      <p>
        Après la collision SHA-1 SHAttered en 2017, le projet Git a commencé à travailler sur la transition vers SHA-256.
        Le nouveau format d'objet (<code>--object-format=sha256</code>) est disponible dans Git 2.29+ et est utilisé par
        défaut sur certains nouveaux hébergeurs de dépôts. Les dépôts existants peuvent être migrés, bien que la transition soit
        complexe car chaque identifiant d'objet change.
      </p>

      <h2>HMAC : authentification de messages basée sur le hachage</h2>
      <p>
        Un simple hachage vérifie l'intégrité des données (les données n'ont pas changé) mais pas l'authenticité (les données proviennent
        de qui vous pensez qu'elles proviennent). Si un attaquant peut intercepter un message et recalculer l'empreinte après
        l'avoir modifié, un simple hachage n'offre aucune protection.
      </p>
      <p>
        HMAC (Hash-based Message Authentication Code) résout cela en incorporant une clé secrète dans le
        calcul du hachage. Le résultat ne peut être produit que par quelqu'un qui connaît la clé. Vérifier un HMAC
        prouve à la fois que les données sont intactes et qu'elles ont été produites par une partie ayant accès au
        secret partagé.
      </p>
      <p>
        HMAC-SHA256 est partout :
      </p>
      <ul>
        <li><strong>Les jetons JWT (HS256) :</strong> le serveur signe l'en-tête et la charge utile du jeton avec HMAC-SHA256 à l'aide d'une clé secrète. Les clients ne peuvent pas forger de jetons valides sans la clé.</li>
        <li><strong>La signature des requêtes d'API :</strong> AWS Signature Version 4 utilise HMAC-SHA256 pour authentifier les requêtes d'API. Les détails de la requête et une clé de signature dérivée sont hachés ensemble afin que ni l'un ni l'autre ne puisse être modifié sans invalider la signature.</li>
        <li><strong>L'intégrité des cookies :</strong> de nombreux frameworks web utilisent HMAC pour signer les cookies de session, empêchant les utilisateurs d'altérer leurs propres données de session.</li>
      </ul>

      <h2>Comment utiliser le Générateur de hachage de BrowseryTools</h2>
      <p>
        Le <a href="/tools/hash-generator">Générateur de hachage</a> prend en charge le hachage à la fois de texte saisi et de fichiers
        téléversés, entièrement dans votre navigateur. Voici comment cela fonctionne :
      </p>
      <ul>
        <li>
          <strong>Hachage de texte :</strong> collez n'importe quel texte dans le champ de saisie. L'outil calcule immédiatement
          et affiche le hachage pour chaque algorithme pris en charge simultanément — MD5, SHA-1, SHA-256 et
          SHA-512 — afin que vous puissiez les comparer côte à côte et choisir celui dont vous avez besoin.
        </li>
        <li>
          <strong>Hachage de fichiers :</strong> cliquez sur le champ de fichier ou glissez-déposez n'importe quel fichier. Le fichier est lu
          par l'API File de votre navigateur et haché localement. Les gros fichiers sont traités par morceaux pour éviter la pression
          sur la mémoire. Aucun octet de votre fichier ne quitte votre appareil.
        </li>
        <li>
          <strong>Choisissez l'algorithme :</strong> sélectionnez l'algorithme spécifique sur lequel vous concentrer pour votre cas d'usage.
          L'empreinte hexadécimale complète est affichée et peut être copiée en un clic.
        </li>
        <li>
          <strong>Téléchargez sous forme de fichier :</strong> à des fins de documentation ou de distribution, exportez l'empreinte de
          hachage sous forme de fichier texte — utile pour publier des sommes de contrôle aux côtés de vos propres versions de logiciels.
        </li>
      </ul>

      <h2>Confidentialité : l'API Web Crypto</h2>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tout reste sur votre appareil.</strong> Le Générateur de hachage de BrowseryTools utilise l'API
        intégrée <code>window.crypto.subtle</code> du navigateur (l'API Web Crypto) pour calculer les empreintes de la famille SHA.
        C'est de la cryptographie native implémentée par le moteur C++ de votre navigateur — pas du calcul JavaScript. Pour MD5,
        une implémentation purement JavaScript s'exécute localement. Dans les deux cas, aucune donnée — pas un seul octet de votre
        texte ou du contenu de votre fichier — n'est jamais transmise aux serveurs de BrowseryTools ni à aucun service tiers.
        Le calcul du hachage se fait entièrement au sein du processus de votre navigateur.
      </div>

      <h2>Choisir le bon algorithme : un guide de décision</h2>
      <ul>
        <li><strong>Intégrité de fichiers / sommes de contrôle (hors sécurité) :</strong> MD5 ou SHA-256. SHA-256 est privilégié pour tout ce qui est public même si le modèle de menace ne concerne que la corruption accidentelle, car utiliser un algorithme cassé par choix est difficile à justifier auprès des auditeurs.</li>
        <li><strong>TLS, signature de code, opérations sur certificats :</strong> SHA-256 (obligatoire — SHA-1 est rejeté).</li>
        <li><strong>Signature JWT :</strong> HMAC-SHA-256 (HS256) pour le symétrique, ou RS256/ES256 pour l'asymétrique. Jamais MD5 ni SHA-1.</li>
        <li><strong>Stockage des mots de passe :</strong> Argon2id, bcrypt ou scrypt. Aucun SHA quel qu'il soit.</li>
        <li><strong>Hachage de gros fichiers sur des serveurs 64 bits :</strong> SHA-512 pour le meilleur débit.</li>
        <li><strong>Marge de sécurité maximale :</strong> SHA-512 ou SHA-3 (SHA3-256, SHA3-512).</li>
        <li><strong>Compatibilité héritée :</strong> ce que le système hérité exige — mais planifiez la migration hors de MD5 et SHA-1.</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Générez des empreintes MD5, SHA-1, SHA-256 et SHA-512 instantanément
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Collez du texte ou déposez un fichier. Tout le hachage se fait dans votre navigateur à l'aide de l'API Web Crypto.
          Rien n'est téléversé. Rien n'est journalisé.
        </p>
        <a
          href="/tools/hash-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Ouvrir le Générateur de hachage →
        </a>
      </div>
      <ToolCTA slug="hash-generator" variant="card" />
    </div>
  );
}
