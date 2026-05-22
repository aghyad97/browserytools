export default function Content() {
  return (
    <div>
      <p>
        Si vous utilisez un mot de passe comme <code>password123</code>, <code>qwerty</code>, ou le nom de votre animal suivi
        d'une année de naissance, vous n'êtes pas seul — mais vous courez un risque sérieux. Une étude de 2023 menée par NordPass a révélé que le mot de passe
        le plus courant au monde reste <strong>« 123456 »</strong>, utilisé par plus de 4,5 millions de personnes. Selon
        Google, 65 % des gens réutilisent le même mot de passe sur plusieurs sites. C'est la plus grande erreur de sécurité
        que vous puissiez commettre en ligne.
      </p>
      <p>
        Ce guide décompose précisément ce qui rend un mot de passe faible ou solide, comment les attaquants les cassent, et comment
        vous pouvez vous protéger — à l'aide d'outils gratuits qui s'exécutent entièrement dans votre navigateur, sans qu'aucune donnée ne soit envoyée à un serveur.
      </p>

      <h2>Les mots de passe les plus courants — le vôtre figure-t-il sur cette liste ?</h2>
      <p>
        Chaque année, les chercheurs en sécurité analysent des milliards d'identifiants divulgués lors de fuites de données. Les résultats sont
        constamment alarmants. Voici les pires contrevenants qui apparaissent dans pratiquement toutes les bases de données de fuites :
      </p>
      <ul>
        <li>123456 / 12345678 / 123456789</li>
        <li>password / password1 / Password123</li>
        <li>qwerty / qwerty123 / qwertyuiop</li>
        <li>iloveyou / letmein / welcome</li>
        <li>admin / root / user / login</li>
        <li>abc123 / 111111 / 000000</li>
        <li>monkey / dragon / master / sunshine</li>
      </ul>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Avertissement :</strong> si l'un de vos mots de passe figure sur cette liste ou y ressemble de près, changez-le
        immédiatement. Ces mots de passe sont les tout premiers que tout attaquant essaiera, et des outils automatisés peuvent tous les tester
        en moins d'une seconde.
      </div>
      <p>
        Ce qui est particulièrement dangereux, c'est que beaucoup de gens croient être malins en remplaçant des lettres par
        des chiffres — en écrivant <code>p@ssw0rd</code> au lieu de <code>password</code>. Les attaquants connaissent aussi cette astuce.
        Les outils de craquage modernes incluent des « règles de transformation » qui appliquent automatiquement ces substitutions à chaque mot de
        leur dictionnaire.
      </p>

      <h2>Qu'est-ce qui rend un mot de passe faible ?</h2>
      <p>La faiblesse d'un mot de passe vient de sa prévisibilité. Un mot de passe est faible lorsqu'un attaquant peut le deviner plus vite qu'en
        essayant toutes les combinaisons possibles. Les principaux coupables sont :</p>

      <h3>1. Une longueur trop courte</h3>
      <p>
        La longueur est le facteur le plus important de la robustesse d'un mot de passe. Un mot de passe de 6 caractères utilisant uniquement des lettres
        minuscules n'a que 308 millions de combinaisons possibles — un GPU moderne peut les épuiser en moins d'une seconde. Un
        mot de passe de 8 caractères avec une casse mixte et des chiffres a 218 billions de combinaisons, ce qui semble impressionnant, mais
        les machines de craquage modernes fonctionnant à des milliards d'essais par seconde peuvent encore le casser en quelques minutes.
      </p>

      <h3>2. Les mots du dictionnaire</h3>
      <p>
        Tout mot réel, dans n'importe quelle langue, est immédiatement vulnérable à une attaque par dictionnaire. Cela inclut les mots avec des
        substitutions évidentes (<code>3</code> pour <code>e</code>, <code>0</code> pour <code>o</code>, <code>@</code>
        pour <code>a</code>) et les mots avec des chiffres ajoutés à la fin (<code>monkey1</code>, <code>dragon99</code>).
        Les attaquants disposent de dictionnaires contenant des centaines de millions de ces variations pré-calculées.
      </p>

      <h3>3. Les informations personnelles</h3>
      <p>
        Les noms, dates d'anniversaire, anniversaires de mariage, noms d'animaux et équipes sportives préférées sont des ingrédients
        de mot de passe extrêmement courants. Si un attaquant sait quoi que ce soit sur vous — rien qu'à partir de vos profils de réseaux sociaux — il peut
        créer une liste de mots ciblée et réduire considérablement le temps nécessaire pour casser votre mot de passe.
      </p>

      <h3>4. Les motifs et les suites de touches</h3>
      <p>
        Les séquences comme <code>qwerty</code>, <code>asdfgh</code>, <code>1qaz2wsx</code> ou <code>zxcvbn</code> sont des
        motifs de clavier que les craqueurs testent dans les premières secondes. Elles ne nécessitent aucune intelligence supplémentaire pour être
        devinées — juste la connaissance d'une disposition de clavier.
      </p>

      <h2>Comment fonctionne réellement le craquage de mots de passe</h2>
      <p>
        Comprendre comment les attaquants cassent les mots de passe vous aide à comprendre pourquoi certaines pratiques vous protègent réellement
        et pourquoi d'autres ne font que donner un sentiment de sécurité.
      </p>

      <h3>Les attaques par force brute</h3>
      <p>
        Une attaque par force brute essaie chaque combinaison de caractères possible jusqu'à trouver la bonne. Pour les
        mots de passe courts, c'est trivialement rapide. Pour les plus longs, le temps croît de façon exponentielle. Un mot de passe de 12 caractères
        utilisant majuscules, minuscules, chiffres et symboles a environ 19 quadrillions de combinaisons possibles —
        à un milliard d'essais par seconde, il faudrait plus de 600 ans pour les épuiser entièrement. C'est toute la puissance de
        la longueur.
      </p>

      <h3>Les attaques par dictionnaire</h3>
      <p>
        Plutôt que d'essayer chaque combinaison, les attaques par dictionnaire utilisent des listes préétablies de mots de passe connus, de mots
        courants et d'identifiants divulgués lors de fuites précédentes. La seule liste de mots RockYou — divulguée en 2009 — contient
        14 millions de mots de passe et reste aujourd'hui le point de départ de la plupart des sessions de craquage. Si votre mot de passe
        a déjà été utilisé par quelqu'un et est apparu dans une fuite, il se trouve quelque part dans un dictionnaire.
      </p>

      <h3>Les tables arc-en-ciel</h3>
      <p>
        Lorsque les sites web stockent des mots de passe, ils devraient les stocker sous forme d'empreintes cryptographiques — et non le mot de passe réel.
        Les tables arc-en-ciel sont des tables de correspondance pré-calculées qui font correspondre des valeurs de hachage aux mots de passe d'origine. Si un site
        stocke des mots de passe sans « saler » les empreintes (en ajoutant une valeur aléatoire avant le hachage), une attaque par table arc-en-ciel
        peut récupérer des millions de mots de passe en quelques secondes. C'est pour cela que les fuites de données sont si dévastatrices.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Information clé :</strong> le craquage de mots de passe est devenu une marchandise. Il existe des services en ligne où vous pouvez
        payer pour faire casser des empreintes. Du matériel coûtant quelques centaines de dollars peut tester des milliards de mots de passe par
        seconde. La seule véritable défense est un mot de passe à la fois long et réellement aléatoire.
      </div>

      <h2>L'entropie des mots de passe : pourquoi la longueur gagne à tous les coups</h2>
      <p>
        L'entropie est une mesure de l'imprévisibilité, exprimée en bits. Plus l'entropie est élevée, plus il faut de temps pour
        casser un mot de passe par force brute. Voici comment cela fonctionne en pratique :
      </p>
      <ul>
        <li>Un mot de passe utilisant uniquement des lettres minuscules (26 caractères) ajoute environ 4,7 bits d'entropie par caractère.</li>
        <li>L'ajout des majuscules double l'ensemble à 52 caractères — 5,7 bits par caractère.</li>
        <li>L'ajout des chiffres (62 caractères) — 5,95 bits par caractère.</li>
        <li>L'ajout des symboles (95 caractères ASCII imprimables) — 6,57 bits par caractère.</li>
      </ul>
      <p>
        Mais l'effet multiplicateur de la longueur est bien plus puissant que l'ajout de n'importe quel type de caractère. Un
        mot de passe de 12 caractères entièrement aléatoire issu de l'ensemble ASCII imprimable complet a environ 79 bits d'entropie. À 16
        caractères, cela devient 105 bits — pratiquement impossible à casser avec toute technologie prévisible.
      </p>

      <h2>Les trois types de mots de passe que les gens utilisent</h2>
      <p>Les stratégies de mots de passe de la plupart des gens entrent dans l'une de trois catégories — chacune avec ses propres compromis :</p>

      <h3>Type 1 : facile à retenir, facile à casser</h3>
      <p>
        C'est la catégorie <code>fluffy2009!</code> — un nom d'animal, une année et un signe de ponctuation. Vous pouvez le retenir
        sans effort. Un attaquant peut le casser en moins d'une heure avec une liste de mots correcte et des règles de transformation. Ces
        mots de passe n'offrent presque aucune protection réelle.
      </p>

      <h3>Type 2 : complexe mais impossible à retenir</h3>
      <p>
        Certaines personnes tentent de créer des mots de passe vraiment complexes en pianotant sur leur clavier — <code>xK3#mQ9!pL</code> — mais
        découvrent ensuite qu'elles ne peuvent pas le retenir. Cela les amène à l'écrire sur un post-it, à le stocker dans un fichier
        texte non chiffré, ou simplement à le réinitialiser sans arrêt. Le gain de sécurité est perdu à cause d'un mauvais stockage.
      </p>

      <h3>Type 3 : solide et correctement stocké</h3>
      <p>
        C'est la seule approche qui fonctionne réellement à grande échelle. Générez un mot de passe long et entièrement aléatoire et stockez-le
        dans un gestionnaire de mots de passe. Vous n'avez besoin de retenir qu'un seul mot de passe maître solide. Les autres sont générés,
        stockés et remplis automatiquement pour vous. C'est ainsi que les professionnels de la sécurité gèrent des centaines de comptes.
      </p>

      <h2>Comparaison visuelle de la robustesse</h2>
      <p>Voici un aperçu côte à côte de la variation spectaculaire de la robustesse des mots de passe :</p>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Mot de passe</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Longueur</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Jeu de caractères</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Entropie</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Temps de craquage</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(239,68,68,0.1)", color: "#dc2626", padding: "2px 6px", borderRadius: "4px"}}>password123</code></td>
              <td style={{padding: "12px 16px"}}>11</td>
              <td style={{padding: "12px 16px"}}>Minuscules + chiffres</td>
              <td style={{padding: "12px 16px"}}>~18 bits (dictionnaire)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Instantané</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(245,158,11,0.1)", color: "#d97706", padding: "2px 6px", borderRadius: "4px"}}>P@$$w0rd</code></td>
              <td style={{padding: "12px 16px"}}>8</td>
              <td style={{padding: "12px 16px"}}>Mixte + symboles</td>
              <td style={{padding: "12px 16px"}}>~24 bits (motif)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>De quelques minutes à quelques heures</strong></td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "2px 6px", borderRadius: "4px"}}>v8K#mX2qLn&amp;4jR7</code></td>
              <td style={{padding: "12px 16px"}}>16</td>
              <td style={{padding: "12px 16px"}}>ASCII complet aléatoire</td>
              <td style={{padding: "12px 16px"}}>~105 bits</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Des milliards d'années</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        La différence entre le premier et le troisième mot de passe n'est pas seulement progressive — c'est la différence entre
        aucune protection et une sécurité pratiquement inviolable. Et vous n'avez pas besoin de retenir <code>v8K#mX2qLn&amp;4jR7</code>
        — votre gestionnaire de mots de passe le fait pour vous.
      </p>

      <h2>Vérifiez instantanément la robustesse de votre mot de passe actuel</h2>
      <p>
        Avant de changer quoi que ce soit, il vaut la peine de comprendre exactement à quel point vos mots de passe actuels sont solides.
        BrowseryTools propose un vérificateur de robustesse de mot de passe gratuit et privé qui analyse votre mot de passe localement — les
        caractères que vous saisissez ne quittent jamais votre navigateur.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Essayez-le maintenant :</strong> rendez-vous sur le{" "}
        <a href="/tools/password-strength">Vérificateur de robustesse de mot de passe BrowseryTools</a> pour voir exactement comment vos
        mots de passe se classent. L'outil vérifie la longueur, la diversité des caractères, les motifs courants et les correspondances de dictionnaire — et
        vous indique combien de temps il faudrait réellement pour le casser.
      </div>
      <p>
        Le vérificateur vous donne un score clair avec une explication de ce qui est faible et de ce qu'il faut améliorer. C'est le
        moyen le plus rapide d'obtenir un audit honnête des mots de passe que vous utilisez déjà.
      </p>

      <h2>Générez des mots de passe solides en un clic</h2>
      <p>
        Savoir à quoi ressemble un mot de passe solide et en créer un réellement sont deux problèmes différents. Le cerveau
        humain est notoirement mauvais pour générer du hasard — nous retombons toujours sur des motifs, des mots familiers et des
        structures prévisibles. La solution est de laisser une machine générer le hasard pour vous.
      </p>
      <p>
        Le <a href="/tools/password-generator">Générateur de mots de passe BrowseryTools</a> crée des mots de passe
        cryptographiquement aléatoires en utilisant le générateur de nombres aléatoires sécurisé intégré à votre navigateur. Vous pouvez personnaliser :
      </p>
      <ul>
        <li>La longueur du mot de passe (jusqu'à 128 caractères)</li>
        <li>Les jeux de caractères à inclure : majuscules, minuscules, chiffres, symboles</li>
        <li>L'exclusion des caractères ambigus (comme <code>0</code>, <code>O</code>, <code>l</code>, <code>1</code>) pour une transcription manuelle plus facile</li>
        <li>Le nombre de mots de passe à générer en une fois</li>
      </ul>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Garantie de confidentialité :</strong> le générateur de mots de passe BrowseryTools s'exécute entièrement dans votre navigateur en utilisant
        l'API Web Crypto. Aucun mot de passe n'est jamais transmis à un serveur. La génération se fait sur votre appareil,
        pour vos yeux uniquement.
      </div>

      <h2>Pourquoi vous avez besoin d'un gestionnaire de mots de passe</h2>
      <p>
        La principale objection à l'utilisation de mots de passe solides est la mémorisation. « Je ne peux pas retenir 30 chaînes
        aléatoires différentes de 20 caractères. » Vous avez raison — et vous ne devriez pas avoir à le faire. C'est exactement à cela que servent les gestionnaires
        de mots de passe.
      </p>
      <p>
        Un gestionnaire de mots de passe est un coffre-fort chiffré qui stocke tous vos mots de passe. Vous le déverrouillez avec un seul mot de passe
        maître solide (le seul que vous avez besoin de mémoriser), et il gère tout le reste :
      </p>
      <ul>
        <li>Stocke un nombre illimité de mots de passe en toute sécurité avec un chiffrement de bout en bout</li>
        <li>Remplit automatiquement les formulaires de connexion dans votre navigateur</li>
        <li>Génère de nouveaux mots de passe solides lorsque vous créez des comptes</li>
        <li>Vous alerte lorsqu'un mot de passe a été exposé dans une fuite connue</li>
        <li>Se synchronise en toute sécurité sur tous vos appareils</li>
      </ul>
      <p>
        Les options populaires incluent Bitwarden (open source et gratuit), 1Password et KeePass (entièrement local). L'important
        est d'en utiliser un — l'amélioration de la sécurité par rapport à l'absence de gestionnaire est énorme.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Information clé :</strong> avec un gestionnaire de mots de passe, vous pouvez utiliser un mot de passe différent, entièrement aléatoire et de
        20 caractères sur chaque site. Si un site est victime d'une fuite, seul ce compte est compromis — pas
        tous les comptes que vous possédez.
      </div>

      <h2>L'authentification à deux facteurs : pourquoi les mots de passe seuls ne suffisent pas</h2>
      <p>
        Même le mot de passe le plus solide présente une vulnérabilité fondamentale : il peut être volé sans être cassé.
        Les attaques par hameçonnage, les enregistreurs de frappe, les attaques de l'homme du milieu et les fuites de données peuvent exposer votre mot de passe sans
        aucune force brute. Une fois qu'un attaquant a votre mot de passe, la longueur et la complexité n'ont plus d'importance.
      </p>
      <p>
        L'authentification à deux facteurs (2FA) ajoute une seconde couche qui vous protège même si votre mot de passe est compromis.
        Les formes courantes incluent :
      </p>
      <ul>
        <li><strong>Les applications TOTP</strong> (Google Authenticator, Authy) : génèrent un code à 6 chiffres qui change toutes les 30 secondes. Même avec votre mot de passe, un attaquant ne peut pas se connecter sans le code actuel.</li>
        <li><strong>Les clés matérielles</strong> (YubiKey) : un dispositif physique que vous branchez ou approchez. Résistant à l'hameçonnage car la clé vérifie le domaine du site avant l'authentification.</li>
        <li><strong>Les codes SMS</strong> : mieux que rien, mais vulnérables aux attaques par échange de carte SIM. Utilisez une application d'authentification à la place lorsque c'est possible.</li>
      </ul>
      <p>
        Activez la 2FA sur chaque compte qui la prend en charge — en particulier la messagerie, la banque, le stockage cloud et les réseaux sociaux.
        Un mot de passe solide associé à la 2FA rend l'accès non autorisé extrêmement difficile, même pour des attaquants disposant de ressources importantes.
      </p>

      <h2>Une liste de contrôle complète de la sécurité des mots de passe</h2>
      <ul>
        <li>Utilisez un minimum de 16 caractères pour chaque mot de passe</li>
        <li>Utilisez un mot de passe différent sur chaque site et service</li>
        <li>N'utilisez jamais de mots du dictionnaire, de noms ou d'informations personnelles</li>
        <li>Utilisez un gestionnaire de mots de passe pour générer et stocker tous vos mots de passe</li>
        <li>Activez l'authentification à deux facteurs partout où elle est disponible</li>
        <li>Vérifiez vos mots de passe existants avec un vérificateur de robustesse dès aujourd'hui</li>
        <li>Vérifiez si votre adresse e-mail est apparue dans des fuites connues (haveibeenpwned.com)</li>
        <li>Ne partagez jamais de mots de passe par e-mail, SMS ou applications de messagerie</li>
      </ul>

      <h2>Commencez dès maintenant — cela prend 2 minutes</h2>
      <p>
        Vous n'avez pas besoin de tout revoir d'un coup. Commencez par vos comptes les plus critiques : la messagerie, la banque
        et votre principal réseau social. Remplacez d'abord ces mots de passe à l'aide du Générateur de mots de passe BrowseryTools,
        puis vérifiez la robustesse de ce que vous avez déjà avec le Vérificateur de robustesse de mot de passe.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Outils de mots de passe gratuits — sans inscription, sans partage de données
        </p>
        <div style={{display: "flex", gap: "12px", flexWrap: "wrap" as const, justifyContent: "center"}}>
          <a
            href="/tools/password-strength"
            style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Vérifier la robustesse du mot de passe →
          </a>
          <a
            href="/tools/password-generator"
            style={{background: "rgba(34,197,94,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Générer un mot de passe solide →
          </a>
        </div>
      </div>
      <p>
        Les deux outils s'exécutent entièrement dans votre navigateur. Vos mots de passe ne sont jamais transmis, journalisés ni stockés où que ce soit
        en dehors de votre propre appareil. C'est la promesse de BrowseryTools — des outils puissants qui respectent réellement votre
        confidentialité.
      </p>
    </div>
  );
}
