export default function Content() {
  return (
    <div>
      <p>
        Il arrive parfois d'avoir besoin d'un arbitre impartial. Qui paie le déjeuner ? Quel nom
        remporte le concours ? Dans quel ordre l'équipe doit-elle présenter ? Qui commence au jeu
        de société ? Chercher un dé physique, une pièce dans sa poche, ou gribouiller des noms sur
        du papier déchiré fonctionne — mais c'est lent, facile à manipuler, et bien souvent vous
        n'avez pas de pièce sur vous. Un{" "}
        <a href="/tools/random-picker">sélecteur aléatoire</a> dans votre navigateur résout tout cela
        en un seul onglet.
      </p>
      <p>
        Le <strong>Sélecteur Aléatoire</strong> BrowseryTools regroupe quatre outils d'aléatoire
        classiques en une seule page : un <strong>générateur de nombres aléatoires</strong>, un{" "}
        <strong>lanceur de dés</strong>, un <strong>tirage à pile ou face</strong>, et un{" "}
        <strong>sélecteur de noms aléatoire</strong> (style roue) pour les tirages et les concours.
        Tout fonctionne localement dans votre navigateur — aucun serveur ne décide du résultat,
        pas de compte, et pas de publicités. Ce guide présente chaque mode et les petits détails
        qui rendent un sélecteur aléatoire vraiment équitable.
      </p>

      <h2>Le générateur de nombres aléatoires</h2>
      <p>
        La demande la plus courante est aussi la plus simple : donnez-moi un nombre entre X et Y.
        Le générateur de nombres aléatoires vous permet de définir un <strong>minimum</strong>
        et un <strong>maximum</strong>, de choisir <strong>combien</strong> de nombres vous voulez
        en même temps, et de décider si les doublons sont autorisés. Cette dernière option compte
        plus qu'on ne le pense. Si vous tirez trois tickets de tombola parmi cent, vous voulez
        presque certainement des numéros uniques — vous ne voulez pas que le ticket 47 gagne deux
        fois. Si vous simulez des dés ou générez des données de test, les doublons sont normaux
        et attendus.
      </p>
      <p>
        En coulisse, l'outil utilise la primitive <code>crypto.getRandomValues</code> du navigateur
        avec un échantillonnage par rejet, ce qui évite le biais modulo subtil que le code naïf{" "}
        <code>Math.random() * plage</code> introduit. En termes simples : chaque nombre dans
        votre plage a une chance strictement égale d'apparaître, pas une chance légèrement biaisée.
        Pour un tirage au sort ordinaire, cette distinction est invisible, mais pour tout ce où
        l'équité est questionnée — un concours public, un tirage payant — c'est la différence
        entre défendable et douteux.
      </p>

      <h2>Le lanceur de dés</h2>
      <p>
        Les jeux de plateau et de rôle vivent et meurent par les dés, et les dés physiques ont
        la fâcheuse habitude de tomber de la table ou de se perdre juste au moment où vous en
        avez besoin. Le lanceur de dés prend en charge l'ensemble polyédrique complet — d4, d6,
        d8, d10, d12 et d20 — et vous permet d'en lancer plusieurs à la fois, avec la notation
        classique <em>2d6</em> ou <em>4d6</em>. Chaque dé est affiché individuellement pour voir
        la distribution, et le total est calculé automatiquement. Plus de calcul mental, plus
        de dispute pour savoir si ce dé est tombé sur 5 ou 6.
      </p>
      <p>
        Parce que les lancers utilisent la même aléatoire de qualité cryptographique que le
        générateur de nombres, un d20 numérique est aussi équitable qu'un dé physique — sans
        doute plus équitable, puisque les vrais dés sont rarement parfaitement équilibrés. Lancez
        pour l'initiative, lancez pour les dégâts, faites un test de pourcentage d100 rapide,
        tout depuis le même onglet.
      </p>

      <h2>Le pile ou face</h2>
      <p>
        Parfois vous avez juste besoin d'un oui ou d'un non, et rien ne règle un choix binaire
        plus vite qu'une pièce. Le mode pile ou face montre une courte animation de rotation et
        atterrit sur pile ou face, puis tient un <strong>décompte continu</strong> des deux.
        Le décompte est la fonctionnalité sous-estimée ici : si vous jouez un meilleur des sept,
        ou que vous voulez observer la loi des grands nombres tirer lentement une distribution
        50/50 vers l'équilibre, le compteur est là. Réinitialisez-le à chaque nouveau concours.
      </p>

      <h2>Le sélecteur de noms aléatoire (roue)</h2>
      <p>
        C'est le mode que les gens partagent le plus. Collez une liste de noms — un par ligne —
        et le sélecteur choisit un gagnant aléatoire avec un bref tour de roue pour le suspense.
        Il est conçu pour les <strong>concours, les questions en classe, les stand-ups d'équipe
        et les tirages au sort</strong>. Entrez vos commentateurs Instagram, vos élèves, vos
        participants au tirage, et laissez l'outil faire le choix pour que personne ne puisse
        vous accuser de favoritisme.
      </p>
      <p>
        L'option clé pour les tirages est <strong>&quot;retirer le gagnant après le tirage.&quot;</strong>
        Activez-la et chaque nom choisi est retiré de la liste, pour que vous puissiez organiser
        un tirage à plusieurs lots — première place, deuxième place, troisième place — sans que
        la même personne gagne deux fois. Désactivez-la et la liste complète reste intacte pour
        des tirages individuels répétés. Un compteur indique combien de participants restent après
        chaque tirage.
      </p>

      <h2>Pourquoi un outil navigateur est mieux qu'une application</h2>
      <p>
        Des applications dédiées de tirage aléatoire et des sites web à roue existent, mais la
        plupart sont noyés sous des publicités, demandent une inscription, ou effectuent le tirage
        sur un serveur que vous ne pouvez pas inspecter. Le sélecteur aléatoire BrowseryTools
        est le contraire : une simple page statique qui fait tout son travail sur votre appareil.
        Rien de ce que vous tapez — ni vos participants au concours, ni les noms de vos élèves —
        ne quitte jamais votre navigateur. Vous pouvez copier n'importe quel résultat dans le
        presse-papiers, mettre la page en favori, ou partager l'URL avec un collègue qui a besoin
        du même tirage équitable.
      </p>

      <h2>Essayez maintenant</h2>
      <p>
        Que vous ayez besoin d'un nombre aléatoire rapide, d'un d20 équitable, d'un pile ou face
        pour trancher un désaccord, ou d'un sélecteur de noms pour votre prochain concours, le{" "}
        <a href="/tools/random-picker">Sélecteur Aléatoire</a> a tout en un seul endroit — gratuit,
        privé et instantané. Sans installation, sans compte, sans piège.
      </p>
    </div>
  );
}
