export default function Content() {
  return (
    <div>
      <p>
        La calculatrice intégrée à votre système d'exploitation est parfaite pour partager une
        addition, mais dès que vous avez besoin d'un sinus, d'un logarithme, d'une puissance ou
        d'une racine carrée, elle est insuffisante. Acheter une calculatrice graphique pour un
        seul problème de devoirs ou une vérification en ingénierie, c'est exagéré. Ce dont vous
        avez vraiment besoin, c'est d'une <strong>calculatrice scientifique en ligne</strong> —
        trigonométrie complète, logarithmes, exposants et constantes — qui s'ouvre instantanément
        dans un onglet de navigateur et fonctionne sur n'importe quel appareil.
      </p>
      <p>
        La <a href="/tools/calculator">calculatrice scientifique BrowseryTools</a> vous donne
        exactement cela : une calculatrice gratuite, dans le navigateur, avec les fonctions
        avancées dont vous avez besoin, sans installation ni inscription. Ce guide explique ce
        qu'une calculatrice scientifique apporte en plus d'une calculatrice basique, les boutons
        de fonctions qui trébuchent les utilisateurs, et comment éviter les erreurs classiques
        qui produisent de mauvaises réponses.
      </p>

      <h2>Ce qu'une calculatrice scientifique apporte de plus</h2>
      <p>
        Une calculatrice basique effectue les quatre opérations. Une calculatrice scientifique
        ajoute les fonctions que l'on retrouve en mathématiques, sciences et ingénierie :
      </p>
      <p>
        <strong>Trigonométrie</strong> — sin, cos, tan et leurs inverses, pour les angles, les
        ondes et la géométrie.
        <br />
        <strong>Logarithmes et exponentielles</strong> — log (base 10), ln (logarithme naturel)
        et e<sup>x</sup>, pour la croissance, la décroissance, les décibels et le pH.
        <br />
        <strong>Puissances et racines</strong> — x<sup>2</sup>, x<sup>y</sup>, racine carrée et
        racine n-ième.
        <br />
        <strong>Constantes</strong> — &pi; et e, saisies avec précision plutôt que tapées
        approximativement.
        <br />
        <strong>Ordre des opérations et parenthèses</strong> — pour qu'une longue expression
        s'évalue correctement en une seule fois.
      </p>

      <h2>L'erreur que presque tout le monde fait : degrés vs. radians</h2>
      <p>
        La source la plus fréquente de mauvaises réponses trigonométriques est le mode d'angle.{" "}
        <code>sin(90)</code> vaut <strong>1</strong> si la calculatrice est en <em>degrés</em>,
        mais environ <strong>0,894</strong> si elle est en <em>radians</em>. Ni l'un ni l'autre
        n'est un bug — ce sont des unités différentes. Avant de calculer n'importe quelle
        trigonométrie, vérifiez que le mode correspond à votre problème : la géométrie et les
        angles du quotidien sont généralement en degrés ; les formules de calcul différentiel et
        de physique attendent généralement des radians. La moitié de toutes les plaintes &ldquo;la
        calculatrice est fausse&rdquo; sont en réalité un problème de degrés/radians.
      </p>

      <h2>Ordre des opérations et parenthèses</h2>
      <p>
        Les calculatrices scientifiques suivent l'ordre standard des opérations (PEMDAS/BODMAS) :
        parenthèses, exposants, puis multiplication et division, puis addition et soustraction.
        Cela signifie que{" "}
        <code>2 + 3 &times; 4</code> vaut <strong>14</strong>, pas 20. En cas de doute,
        ajoutez des parenthèses — elles ne coûtent rien et suppriment toute ambiguïté. Une
        erreur fréquente est d'oublier qu'une fonction comme <code>sin</code> ne s'applique
        qu'à ce qui suit immédiatement ; si vous voulez le sinus d'une expression entière,
        entourez-la : <code>sin(a + b)</code>, pas <code>sin a + b</code>.
      </p>

      <h2>Exemples résolus</h2>
      <p>
        <strong>Facteur d'intérêts composés.</strong> Pour savoir combien vaut 1 € après une
        croissance à 5 % sur 10 ans, calculez <code>1,05<sup>10</sup></code> à l'aide de la
        touche x<sup>y</sup> — environ 1,629, donc l'argent croît d'environ 63 %. Pour les
        calculs de prêts et d'épargne, associez cela à notre{" "}
        <a href="/tools/loan-calculator">calculatrice de prêt</a>.
      </p>
      <p>
        <strong>Côté d'un triangle rectangle.</strong> Avec une hypoténuse de 13 et un côté de 5,
        l'autre côté est <code>&radic;(13<sup>2</sup> &minus; 5<sup>2</sup>)</code> = &radic;144 = 12.
        Les touches carré et racine carrée font cela directement.
      </p>
      <p>
        <strong>pH à partir de la concentration.</strong> Le pH est <code>&minus;log(H+)</code>.
        Pour une concentration en ions hydrogène de 0,0001, c'est{" "}
        <code>&minus;log(0,0001)</code> = 4. La touche log en base 10 le donne en une étape.
      </p>

      <h2>Pourquoi une calculatrice en ligne est mieux qu'une application ou un appareil</h2>
      <p>
        Une calculatrice web s'ouvre le temps de charger un onglet — pas d'application à installer,
        pas de piles, pas de recherche de l'appareil physique dans un tiroir. Elle fonctionne
        de manière identique sur votre ordinateur portable, votre téléphone et un ordinateur
        emprunté. Et comme tout s'exécute dans votre navigateur, rien de ce que vous tapez
        n'est envoyé à un serveur. La même approche locale sous-tend chaque outil BrowseryTools ;
        pour un aperçu complet, consultez notre{" "}
        <a href="/blog/best-free-developer-tools-browser">guide des outils gratuits basés sur le navigateur</a>.
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Pourquoi sin donne-t-il une étrange réponse ?</strong> Presque toujours un problème
        de degrés/radians. Vérifiez le mode d'angle avant de calculer une trigonométrie.
      </p>
      <p>
        <strong>Quelle est la différence entre log et ln ?</strong> <code>log</code> est en base 10 ;{" "}
        <code>ln</code> est le logarithme naturel, en base e. Ils ne sont pas interchangeables.
      </p>
      <p>
        <strong>Comment élever un nombre à une puissance ?</strong> Utilisez la touche x<sup>y</sup> —
        par exemple 2 x<sup>y</sup> 10 donne 1024.
      </p>
      <p>
        <strong>Est-ce gratuit ?</strong> Oui — sans compte, sans installation, sans limite.
      </p>
      <p>
        <strong>Fonctionne-t-il hors ligne ou de façon privée ?</strong> Il s'exécute entièrement
        dans votre navigateur ; rien de ce que vous tapez n'est envoyé nulle part.
      </p>

      <h2>Commencer à calculer</h2>
      <p>
        Ouvrez la <a href="/tools/calculator">calculatrice scientifique</a> pour la trigonométrie,
        les logarithmes, les puissances et les constantes dans n'importe quel navigateur. Pour
        les calculs du quotidien, BrowseryTools dispose également d'une{" "}
        <a href="/tools/percentage-calculator">calculatrice de pourcentages</a> et d'une{" "}
        <a href="/tools/loan-calculator">calculatrice de prêt</a> — et si vous avez besoin de
        décoder un chiffre romain, le{" "}
        <a href="/blog/roman-numeral-converter-guide">guide des chiffres romains</a> est là pour vous.
      </p>
    </div>
  );
}
