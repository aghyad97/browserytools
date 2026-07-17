import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Chaque fichier et répertoire d'un système Linux ou macOS possède un ensemble de permissions qui
        contrôle qui peut le lire, le modifier ou l'exécuter. Bien configurer ces permissions fait la
        différence entre un serveur sécurisé et un serveur qui fuit des données ou se fait compromettre.
        Pourtant, la notation — <code>chmod 755</code>,{" "}
        la sortie de <code>ls -la</code> affichant <code>-rwxr-xr--</code> — peut sembler opaque jusqu'à
        ce que vous compreniez le modèle sous-jacent. Ce guide explique les permissions de fichiers Unix
        depuis les fondements.
      </p>
      <ToolCTA slug="chmod" variant="inline" />
      <p>
        Vous pouvez calculer des valeurs de permissions et convertir entre notation octale et symbolique
        instantanément avec le{" "}
        <a href="/tools/chmod">Calculateur chmod BrowseryTools</a> — gratuit, sans inscription, tout
        s'exécute dans votre navigateur.
      </p>

      <h2>Le modèle de permissions Unix : propriétaire, groupe, autres</h2>
      <p>
        Unix attribue à chaque fichier et répertoire trois ensembles de permissions, couvrant chacun
        un public différent :
      </p>
      <ul>
        <li><strong>Propriétaire (utilisateur)</strong> — le compte utilisateur qui possède le fichier. En général, l'utilisateur qui l'a créé.</li>
        <li><strong>Groupe</strong> — un groupe nommé d'utilisateurs. Le fichier appartient à un groupe ; tous les membres de ce groupe partagent les permissions du groupe.</li>
        <li><strong>Autres (monde)</strong> — tout le monde sur le système qui n'est ni le propriétaire ni dans le groupe.</li>
      </ul>
      <p>
        Au sein de chacun de ces trois ensembles, il y a trois bits de permission : lecture (<code>r</code>),
        écriture (<code>w</code>) et exécution (<code>x</code>). Cela donne neuf bits de permission au
        total, qui correspondent directement aux neuf caractères que vous voyez après l'indicateur de type
        de fichier dans la sortie de <code>ls -la</code>.
      </p>

      <h2>Lire la sortie de ls -la</h2>
      <p>
        Lorsque vous exécutez <code>ls -la</code>, chaque ligne commence par une chaîne de 10 caractères
        comme <code>-rwxr-xr--</code>. Voici comment la lire :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`-  rwx  r-x  r--
^  ^^^  ^^^  ^^^
|  |    |    └── other:  read only
|  |    └─────── group:  read + execute
|  └──────────── owner:  read + write + execute
└─────────────── file type: - = file, d = directory, l = symlink`}
      </pre>
      <p>
        Un tiret <code>-</code> dans une position de permission signifie que cette permission n'est pas
        accordée. Ainsi, <code>r-x</code>{" "}
        signifie que la lecture et l'exécution sont autorisées, mais pas l'écriture.
      </p>

      <h2>Ce que signifient lecture, écriture, exécution pour les fichiers vs les répertoires</h2>
      <p>
        Les trois bits de permission ont des significations différentes selon qu'ils s'appliquent à un
        fichier ou à un répertoire :
      </p>
      <ul>
        <li><strong>Lecture de fichier (r)</strong> — peut lire le contenu du fichier (<code>cat</code>, <code>less</code>, ouvrir dans un éditeur).</li>
        <li><strong>Écriture de fichier (w)</strong> — peut modifier ou tronquer le fichier. Remarque : la suppression d'un fichier est contrôlée par la permission d'écriture du répertoire parent, pas par le bit d'écriture propre au fichier.</li>
        <li><strong>Exécution de fichier (x)</strong> — peut exécuter le fichier comme programme ou script. Sans ce bit, <code>./script.sh</code> retourne « Permission denied » même si vous pouvez le lire.</li>
        <li><strong>Lecture de répertoire (r)</strong> — peut lister le contenu du répertoire (<code>ls</code>). Sans ce bit, vous savez que le répertoire existe mais ne pouvez pas voir ce qu'il contient.</li>
        <li><strong>Écriture de répertoire (w)</strong> — peut créer, renommer ou supprimer des fichiers dans le répertoire. C'est pourquoi vous pouvez supprimer un fichier que vous ne possédez pas si vous avez accès en écriture à son répertoire parent.</li>
        <li><strong>Exécution de répertoire (x)</strong> — peut entrer dans le répertoire (<code>cd</code>) et accéder aux fichiers qu'il contient si vous connaissez leurs noms. On appelle parfois cela le « bit de recherche ». Un répertoire avec <code>r--</code> permet de lister les noms de fichiers mais pas d'y accéder ; un répertoire avec <code>--x</code> permet d'accéder aux fichiers par nom mais pas de les lister.</li>
      </ul>

      <h2>Notation octale : 755, 644, 777</h2>
      <p>
        Chaque ensemble de permissions (propriétaire, groupe, autres) est composé de trois bits. Trois
        bits peuvent représenter des valeurs de 0 à 7 — exactement un chiffre octal. C'est pourquoi les
        permissions s'écrivent sous la forme de trois chiffres octaux, un par public :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Bit values:  r = 4,  w = 2,  x = 1

rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0+0+0 = 0

chmod 755 → owner: 7 (rwx), group: 5 (r-x), other: 5 (r-x)
chmod 644 → owner: 6 (rw-), group: 4 (r--), other: 4 (r--)
chmod 600 → owner: 6 (rw-), group: 0 (---), other: 0 (---)`}
      </pre>
      <p>
        Inutile de mémoriser chaque combinaison — utilisez le{" "}
        <a href="/tools/chmod">Calculateur chmod BrowseryTools</a> pour vérifier ce que signifie une
        valeur octale ou pour construire la bonne valeur pour votre situation.
      </p>

      <h2>Notation symbolique : u+x, g-w, o=r</h2>
      <p>
        Le mode symbolique permet de modifier les permissions par rapport à leur état actuel, sans
        spécifier les trois ensembles à la fois. Le format est{" "}
        <code>[qui][opérateur][permissions]</code> :
      </p>
      <ul>
        <li><strong>Qui</strong> : <code>u</code> (propriétaire/utilisateur), <code>g</code> (groupe), <code>o</code> (autres), <code>a</code> (les trois)</li>
        <li><strong>Opérateur</strong> : <code>+</code> (ajouter), <code>-</code> (supprimer), <code>=</code> (définir exactement)</li>
        <li><strong>Permissions</strong> : <code>r</code>, <code>w</code>, <code>x</code></li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`chmod u+x script.sh       # add execute for owner only
chmod g-w config.txt      # remove write from group
chmod o=r public.html     # set other to read-only exactly
chmod a+r file.txt        # add read for everyone
chmod u=rwx,g=rx,o=       # equivalent to chmod 750`}
      </pre>

      <h2>Patterns de permissions courants expliqués</h2>
      <ul>
        <li><strong>755</strong> (<code>rwxr-xr-x</code>) — Standard pour les exécutables et les répertoires. Le propriétaire peut tout faire ; tout le monde peut lire et exécuter (ou entrer dans un répertoire) mais pas écrire. C'est la valeur par défaut pour les répertoires racine des serveurs web et les scripts publics.</li>
        <li><strong>644</strong> (<code>rw-r--r--</code>) — Standard pour les fichiers ordinaires. Le propriétaire peut lire/écrire ; tout le monde peut seulement lire. Convient aux ressources web, aux fichiers de configuration ne contenant pas de secrets et à la plupart des contenus statiques.</li>
        <li><strong>600</strong> (<code>rw-------</code>) — Le propriétaire peut lire/écrire ; personne d'autre ne peut rien faire. Requis pour les clés privées SSH (<code>~/.ssh/id_rsa</code>). SSH refusera d'utiliser un fichier de clé avec des permissions plus laxistes.</li>
        <li><strong>700</strong> (<code>rwx------</code>) — Le propriétaire peut tout faire ; personne d'autre n'a accès. Convient aux scripts privés et aux répertoires contenant des données sensibles.</li>
        <li><strong>400</strong> (<code>r--------</code>) — Lecture seule pour le propriétaire ; complètement verrouillé pour tout le monde. Utilisé pour les fichiers de configuration et les certificats immuables où les écritures accidentelles seraient préjudiciables.</li>
      </ul>

      <h2>Pourquoi 777 est dangereux</h2>
      <p>
        <code>chmod 777</code> donne les permissions de lecture, d'écriture et d'exécution à chaque
        utilisateur du système. Cela signifie que tout processus s'exécutant en tant que n'importe quel
        utilisateur — y compris une application web compromise, un script malveillant dans un
        environnement d'hébergement partagé, ou n'importe quel autre utilisateur sur la machine — peut
        modifier ou exécuter le fichier. Dans un contexte de serveur web, un fichier PHP avec des
        permissions 777 permet à tout autre processus de l'écraser avec du code malveillant.
        N'utilisez jamais 777 en production. Si vous l'utilisez pour « corriger une erreur de
        permissions », la vraie correction consiste à donner la propriété du fichier au bon utilisateur
        ou groupe.
      </p>

      <h2>Setuid, setgid et sticky bit</h2>
      <p>
        Au-delà des neuf bits standard, il existe trois bits spéciaux qui apparaissent comme un quatrième
        chiffre de tête dans la notation octale à quatre chiffres :
      </p>
      <ul>
        <li><strong>Setuid (4xxx)</strong> — lorsqu'il est défini sur un exécutable, le programme s'exécute avec les privilèges du propriétaire du fichier, pas ceux de l'appelant. <code>/usr/bin/passwd</code> utilise cela pour permettre aux utilisateurs ordinaires d'écrire dans <code>/etc/shadow</code>, qui appartient à root.</li>
        <li><strong>Setgid (2xxx)</strong> — sur un exécutable, s'exécute avec les privilèges du groupe du fichier. Sur un répertoire, les nouveaux fichiers créés à l'intérieur héritent du groupe du répertoire plutôt que du groupe principal du créateur — utile pour les répertoires de projet partagés.</li>
        <li><strong>Sticky bit (1xxx)</strong> — sur un répertoire, empêche les utilisateurs de supprimer des fichiers dont ils ne sont pas propriétaires, même s'ils ont accès en écriture au répertoire. <code>/tmp</code> a le sticky bit défini (<code>chmod 1777</code>) pour que les utilisateurs puissent créer leurs propres fichiers temporaires mais ne puissent pas supprimer ceux des autres.</li>
      </ul>

      <h2>chmod récursif (-R) et exemples concrets</h2>
      <p>
        Le drapeau <code>-R</code> applique un changement de permission récursivement à un répertoire et
        tout son contenu. À utiliser avec précaution — appliquer les mêmes permissions aux fichiers et
        aux répertoires est souvent incorrect car les répertoires ont besoin du bit d'exécution pour être
        accessibles, tandis que les fichiers ordinaires ne devraient généralement pas être exécutables :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Web server: directories need 755, files need 644
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Fix SSH key permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/authorized_keys

# Make a deploy script executable
chmod +x deploy.sh`}
      </pre>
      <p>
        Lorsque vous n'êtes pas sûr de la valeur octale à utiliser, le{" "}
        <a href="/tools/chmod">Calculateur chmod BrowseryTools</a> vous permet de cocher des cases pour
        les permissions propriétaire, groupe et autres et de voir immédiatement la valeur octale et la
        notation symbolique résultantes.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculateur chmod gratuit — Octal ↔ Symbolique ↔ Lisible
        </p>
        <a
          href="/tools/chmod"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le calculateur chmod →
        </a>
      </div>
      <ToolCTA slug="chmod" variant="card" />
    </div>
  );
}
