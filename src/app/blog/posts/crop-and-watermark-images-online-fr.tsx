import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Deux des opérations les plus courantes sur une image n'ont rien à voir avec une retouche
        sophistiquée : <strong>recadrer</strong> une image à la bonne forme et taille, et ajouter un{" "}
        <strong>filigrane</strong> pour qu'elle ne puisse pas être réutilisée sans attribution.
        Le recadrage adapte une photo à une miniature, une bannière, un avatar carré ou un rapport
        d'aspect précis. Un filigrane protège votre travail et identifie vos captures d'écran.
        Vous ne devriez avoir besoin ni de Photoshop ni d'un abonnement pour cela — et vous ne
        devriez certainement pas uploader l'image sur le serveur d'un inconnu.
      </p>
      <ToolCTA slug="image-resizer" variant="inline" />
      <p>
        Le <a href="/tools/image-resizer">redimensionneur d'images BrowseryTools</a> gère le
        recadrage, le redimensionnement et l'ajout de filigrane entièrement dans votre navigateur.
        Sans envoi, sans compte, sans filigrane imposé par l'outil lui-même. Ce guide explique
        comment recadrer à un rapport d'aspect précis, redimensionner sans distorsion, et ajouter
        un filigrane qui dissuade vraiment la réutilisation.
      </p>

      <h2>Comment recadrer et redimensionner une image (étape par étape)</h2>
      <p>
        <strong>1. Ouvrir l'outil.</strong> Accédez au <a href="/tools/image-resizer">redimensionneur d'images</a>{" "}
        et ajoutez votre image. Elle est lue localement — jamais uploadée.
        <br />
        <strong>2. Choisir un rapport d'aspect ou un recadrage libre.</strong> Sélectionnez un préréglage
        comme 1:1 (carré), 16:9 (bannière) ou 4:5 (portrait), ou faites glisser librement.
        Les préréglages maintiennent les bonnes proportions pour la destination.
        <br />
        <strong>3. Redimensionner aux pixels exacts voulus.</strong> Définissez la largeur et la
        hauteur. Gardez le rapport d'aspect verrouillé sauf si vous voulez que l'image soit étirée.
        <br />
        <strong>4. Ajouter un filigrane (optionnel).</strong> Superposez votre nom, logo ou URL,
        et définissez sa position et son opacité.
        <br />
        <strong>5. Exporter.</strong> Téléchargez le résultat. L'original sur votre disque est inchangé.
      </p>

      <h2>Recadrer selon le bon rapport d'aspect</h2>
      <p>
        L'erreur qui gâche le plus d'images est de changer le rapport d'aspect négligemment, ce
        qui étire ou écrase la photo. Les visages s'élargissent, les cercles deviennent des ovales.
        Pour l'éviter, décidez d'abord de la <em>forme</em> et recadrez en conséquence, plutôt que
        de forcer l'image existante dans une nouvelle largeur et hauteur. Cibles courantes :
      </p>
      <p>
        <strong>Carré 1:1</strong> — photos de profil, miniatures produit, publications sur la grille Instagram.
        <br />
        <strong>Écran large 16:9</strong> — miniatures de vidéos, diapositives de présentation, bannières hero.
        <br />
        <strong>Portrait 4:5</strong> — le rapport le plus grand qu'Instagram autorise dans le fil,
        idéal pour maximiser l'espace à l'écran sur mobile.
        <br />
        <strong>3:2 / 4:3</strong> — rapports photo classiques pour les tirages et les galeries.
      </p>
      <p>
        Recadrez au rapport d'aspect, <em>puis</em> redimensionnez aux dimensions en pixels voulues
        par la plateforme. Cet ordre maintient tout en proportion.
      </p>

      <h2>Redimensionner sans perdre en netteté</h2>
      <p>
        Réduire une image est sûr et améliore même la netteté du résultat. L'agrandir ne l'est
        pas — vous ne pouvez pas inventer des détails qui n'ont jamais été capturés, donc une image
        agrandie paraît floue ou pixélisée. Partez toujours de l'original en plus haute résolution
        disponible et réduisez à partir de là. Si vous avez seulement besoin d'un fichier plus
        petit (pas de dimensions plus petites), c'est de la compression, pas du redimensionnement —
        consultez notre <a href="/blog/free-image-tools-guide">guide des outils d'image gratuits</a>
        pour la différence.
      </p>

      <h2>Ajouter un filigrane qui fonctionne vraiment</h2>
      <p>
        Un bon filigrane équilibre visibilité et absence d'altération de l'image. Quelques principes :
      </p>
      <p>
        <strong>Placez-le là où il ne peut pas être recadré.</strong> Un petit logo dans un coin
        se recadre facilement. Une marque semi-transparente au centre, ou répétée sur l'image,
        est bien plus difficile à supprimer.
        <br />
        <strong>Utilisez une opacité modérée.</strong> Environ 30 à 50 % laisse l'image transparaître
        tout en gardant la marque lisible. Complètement opaque paraît lourd ; à peine visible
        n'offre aucune protection.
        <br />
        <strong>Gardez-le simple.</strong> Votre nom, pseudo ou domaine suffit. L'objectif est
        l'attribution et la dissuasion, pas la décoration.
      </p>
      <p>
        N'oubliez pas qu'aucun filigrane visible n'est indestructible — une personne déterminée
        peut le cloner. Le but est de rendre la réutilisation ordinaire peu pratique et de s'assurer
        que lorsque votre image se propage, votre nom l'accompagne.
      </p>

      <h2>Pourquoi modifier dans le navigateur ?</h2>
      <p>
        Le recadrage et l'ajout de filigrane portent sur le contrôle de vos propres images —
        pourtant la plupart des éditeurs en ligne uploadent d'abord l'original sur leurs serveurs.
        L'édition dans le navigateur garde le fichier sur votre appareil en permanence : il est
        lu dans la page, édité par votre propre navigateur, et exporté localement. Rien n'est
        uploadé, l'outil n'ajoute pas de filigrane lui-même, et il n'y a pas de limite de taille
        derrière un payant. C'est le même modèle local d'abord derrière chaque outil BrowseryTools,
        comme expliqué dans{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          pourquoi les outils basés sur le navigateur protègent vos données
        </a>
        .
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Pourquoi mon image paraît-elle étirée après redimensionnement ?</strong> Le rapport
        d'aspect a changé. Verrouillez le ratio, ou recadrez à la forme cible avant de redimensionner.
      </p>
      <p>
        <strong>Puis-je agrandir une petite image sans perdre en qualité ?</strong> Pas vraiment.
        L'agrandissement ne peut pas ajouter des détails qui n'y étaient pas. Partez du plus
        grand original.
      </p>
      <p>
        <strong>L'outil ajoutera-t-il son propre filigrane ?</strong> Non. Seul le filigrane que
        vous ajoutez apparaît.
      </p>
      <p>
        <strong>Mon image est-elle uploadée ?</strong> Non. Tout est traité localement dans votre
        navigateur.
      </p>
      <p>
        <strong>Est-ce gratuit ?</strong> Oui — sans compte, sans limite, sans filigrane forcé.
      </p>

      <h2>Essayez maintenant</h2>
      <p>
        Ouvrez le <a href="/tools/image-resizer">redimensionneur d'images</a> pour recadrer,
        redimensionner et ajouter un filigrane en un seul endroit — sans uploader. Si vous avez
        aussi besoin de masquer des détails sensibles dans la photo, consultez notre guide sur le{" "}
        <a href="/blog/redact-image-online">masquage d'images en ligne</a>, et pour réduire la
        taille finale du fichier lisez notre{" "}
        <a href="/blog/free-image-tools-guide">guide des outils d'image gratuits</a>.
      </p>
      <ToolCTA slug="image-resizer" variant="card" />
    </div>
  );
}
