import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Le SVG est le meilleur format web pour les logos, icônes et illustrations — c'est un vecteur,
        il s'adapte donc à n'importe quelle taille sans devenir flou, et les fichiers sont légers.
        Mais dès que vous sortez du navigateur, le SVG commence à vous laisser tomber. Vous ne
        pouvez pas l'insérer dans la plupart des présentations, l'uploader comme avatar sur les
        réseaux sociaux, le joindre à un document qui attend une image matricielle, ou l'utiliser
        dans des applications qui ne comprennent tout simplement pas les vecteurs. La solution est
        de{" "}
        <strong>convertir le SVG en PNG</strong> : un format matriciel universel qui fonctionne partout.
      </p>
      <ToolCTA slug="svg-png" variant="inline" />
      <p>
        Le <a href="/tools/svg-png">convertisseur SVG vers PNG de BrowseryTools</a> le fait dans
        votre navigateur — collez ou uploadez un SVG, choisissez une résolution, et téléchargez
        un PNG net. Sans envoi, sans compte, sans filigrane. Ce guide explique quand convertir,
        comment choisir la bonne résolution, et comment conserver un fond transparent.
      </p>

      <h2>Comment convertir un SVG en PNG (étape par étape)</h2>
      <p>
        <strong>1. Ouvrir le convertisseur.</strong> Accédez à la page{" "}
        <a href="/tools/svg-png">SVG vers PNG</a>.
        <br />
        <strong>2. Ajouter votre SVG.</strong> Uploadez le fichier ou collez le code SVG brut.
        Il est lu localement dans votre navigateur.
        <br />
        <strong>3. Choisir une taille.</strong> Définissez la largeur et la hauteur de sortie en
        pixels, ou un multiplicateur d'échelle. Comme le SVG est un vecteur, vous pouvez le
        rendre à n'importe quelle résolution — c'est l'avantage clé.
        <br />
        <strong>4. Conserver la transparence si nécessaire.</strong> Le PNG prend en charge un fond
        transparent, donc un logo sans fond reste transparent à l'export.
        <br />
        <strong>5. Télécharger.</strong> Sauvegardez le PNG. L'original vectoriel est inchangé.
      </p>

      <h2>Le seul point à bien maîtriser : la résolution</h2>
      <p>
        C'est là que la plupart des conversions SVG vers PNG échouent. Un vecteur n'a pas de
        taille en pixels inhérente — c'est une formule mathématique. Quand vous le rastérisez,
        <em>vous</em> décidez du nombre de pixels qu'il deviendra, et une fois en PNG ces pixels
        sont figés. Exportez trop petit et il paraîtra grossier quand affiché plus grand ; vous
        ne pouvez pas agrandir un PNG sans flou.
      </p>
      <p>
        La règle : <strong>rastérisez à la plus grande taille à laquelle vous l'afficherez, ou plus.</strong>{" "}
        Pour un logo pouvant apparaître sur un écran Retina, exportez à 2× ou 3× la taille
        d'affichage. Une icône de 200×200 affichée sur un écran haute densité devrait être exportée
        à 400×400 ou 600×600 pour rester nette. Le stockage est bon marché ; un logo flou ne l'est pas.
      </p>

      <h2>Quand convertir un SVG en PNG (et quand ne pas le faire)</h2>
      <p>
        <strong>Convertissez en PNG quand :</strong> vous avez besoin d'un avatar ou d'une bannière
        pour les réseaux sociaux, vous ajoutez une image à une présentation ou un document, vous
        envoyez un graphique par e-mail, vous avez besoin d'une icône d'application à taille fixe,
        ou la destination ne prend tout simplement pas en charge le SVG.
      </p>
      <p>
        <strong>Conservez le SVG quand :</strong> vous l'utilisez sur un site web ou dans une
        application qui affiche les vecteurs. Sur le web, le SVG reste parfaitement net à chaque
        niveau de zoom et densité d'écran, le fichier est généralement plus petit, et vous pouvez
        le styliser ou l'animer avec CSS. Convertir un logo web en PNG sacrifie tout cela. Pour
        tout ce que le SVG peut faire, consultez notre{" "}
        <a href="/blog/svg-guide">guide complet des fichiers SVG</a>.
      </p>

      <h2>Fond transparent vs. fond uni</h2>
      <p>
        Les SVG n'ont souvent pas de fond — le canevas est transparent. Le PNG préserve cette
        transparence, donc un logo flottera proprement sur n'importe quelle couleur. Si vous avez
        plutôt besoin d'un fond uni (par exemple, un carré blanc pour une photo de profil qui
        n'autorise pas la transparence), aplatissez-le sur une couleur de fond lors de la conversion.
        L'autre format matriciel universel, JPG, ne <em>prend pas du tout</em> en charge la
        transparence, ce qui est une raison de plus pour laquelle le PNG est la bonne cible pour
        les graphiques avec des zones transparentes.
      </p>

      <h2>Pourquoi convertir dans le navigateur ?</h2>
      <p>
        Le SVG est du texte brut — il peut contenir des scripts intégrés, ce qui explique pourquoi
        uploader un SVG sur un serveur peut être une problème de sécurité. Convertir localement dans
        votre navigateur signifie que le fichier est rendu par votre propre machine et n'est jamais
        uploadé nulle part. Votre logo, vos ressources de marque et toutes les données intégrées
        restent sur votre appareil. C'est aussi plus rapide : pas d'attente d'upload, pas de file
        d'attente, pas d'aller-retour serveur. Cette approche locale est la même qui sous-tend
        chaque outil BrowseryTools — plus d'informations dans{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          pourquoi les outils basés sur le navigateur protègent vos données
        </a>
        .
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Le PNG sera-t-il flou ?</strong> Pas si vous exportez à une résolution suffisamment
        élevée. Rastérisez à la plus grande taille d'affichage, idéalement 2× pour les écrans
        haute densité.
      </p>
      <p>
        <strong>Le PNG conserve-t-il le fond transparent ?</strong> Oui. Le PNG prend en charge la
        transparence, donc un logo sans fond reste transparent.
      </p>
      <p>
        <strong>Puis-je reconvertir un PNG en SVG ?</strong> Pas fidèlement. Passer du matriciel
        au vectoriel nécessite un tracé et ne fonctionne bien que pour les formes simples. Conservez
        votre SVG original.
      </p>
      <p>
        <strong>La conversion est-elle gratuite ?</strong> Oui — sans compte, sans filigrane, sans
        limite de taille.
      </p>
      <p>
        <strong>Mon fichier est-il uploadé ?</strong> Non. Le SVG est rendu localement dans votre
        navigateur.
      </p>

      <h2>Convertir maintenant</h2>
      <p>
        Ouvrez le <a href="/tools/svg-png">convertisseur SVG vers PNG</a>, définissez la taille
        de sortie, et téléchargez une copie matricielle nette de votre vecteur. Si vous avez besoin
        de redimensionner, recadrer ou ajouter un filigrane à l'image résultante, consultez notre
        guide sur le{" "}
        <a href="/blog/crop-and-watermark-images-online">recadrage et l'ajout de filigrane en ligne</a>,
        et pour comprendre le format vectoriel lui-même lisez le{" "}
        <a href="/blog/svg-guide">guide complet SVG</a>.
      </p>
      <ToolCTA slug="svg-png" variant="card" />
    </div>
  );
}
