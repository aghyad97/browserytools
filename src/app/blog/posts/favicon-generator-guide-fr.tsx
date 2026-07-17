import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Un favicon est la minuscule icône qui apparaît dans votre onglet de navigateur, votre barre de
        favoris, l&apos;écran d&apos;accueil de votre téléphone quand quelqu&apos;un enregistre votre site, et
        de plus en plus dans les résultats de recherche à côté de votre domaine. C&apos;est l&apos;un des plus
        petits éléments d&apos;un site web et l&apos;un des plus disproportionnellement importants : un site
        sans favicon paraît inachevé, tandis qu&apos;un favicon net et reconnaissable donne à une marque une
        impression de soin dès le tout premier pixel. Le problème, c&apos;est qu&apos;obtenir de bons favicons
        était autrefois inutilement pénible — et c&apos;est exactement ce qu&apos;un bon{" "}
        <a href="/tools/favicon-generator">générateur de favicon en ligne</a> corrige.
      </p>

      <ToolCTA slug="favicon-generator" variant="inline" />
      <h2>Pourquoi un seul favicon ne suffit jamais</h2>
      <p>
        Aux débuts du web, vous déposiez un unique <code>favicon.ico</code> dans votre répertoire racine et
        c&apos;était terminé. Aujourd&apos;hui, les navigateurs, les systèmes d&apos;exploitation et les
        lanceurs d&apos;applications veulent tous des tailles différentes pour des contextes différents. Une
        icône 16×16 s&apos;affiche dans l&apos;onglet du navigateur. Une 32×32 sert aux écrans à haute densité
        et à la barre des tâches Windows. Les appareils Apple veulent un{" "}
        <code>apple-touch-icon.png</code> de 180×180 pour l&apos;écran d&apos;accueil. Android et les
        applications web progressives référencent des PNG 192×192 et 512×512 depuis un manifeste web.
        Oubliez-en un et votre icône paraît floue, pixelisée ou simplement absente dans ce contexte.
      </p>
      <p>
        Produire toutes ces tailles à la main dans un éditeur d&apos;images est fastidieux et source
        d&apos;erreurs. Vous devez redimensionner chacune, l&apos;exporter aux bonnes dimensions en pixels,
        nommer les fichiers exactement comme il faut, puis écrire le HTML qui les relie tous. Notre outil fait
        l&apos;ensemble en un clic, entièrement dans votre navigateur.
      </p>

      <h2>Créer un favicon à partir d&apos;une image</h2>
      <p>
        Le flux le plus courant consiste à <strong>créer un favicon à partir d&apos;une image</strong> —
        généralement un logo ou une icône d&apos;application. Glissez un PNG, JPG, WebP, SVG ou GIF dans la
        zone de téléversement. L&apos;outil dessine votre image sur un canevas carré en utilisant un
        ajustement par recouvrement (de sorte que les images non carrées sont centrées et recadrées plutôt
        qu&apos;écrasées), puis la redimensionne à chaque taille de l&apos;ensemble standard. Comme les
        favicons s&apos;affichent très petits, une image source propre, à fort contraste et idéalement carrée
        donne les meilleurs résultats. Les détails fins et le petit texte ont tendance à disparaître en
        16×16, donc les marques plus simples se lisent bien mieux.
      </p>

      <h2>Ou générer un favicon à partir d&apos;une lettre ou d&apos;un emoji</h2>
      <p>
        Tout le monde n&apos;a pas un logo prêt — et vous n&apos;en avez pas besoin. Passez en mode
        lettre/emoji, tapez un seul caractère (une initiale de marque comme «&nbsp;B&nbsp;», ou un emoji comme
        🚀), choisissez une couleur d&apos;arrière-plan et une couleur de texte, et l&apos;outil rend un
        glyphe propre et centré à chaque taille. C&apos;est parfait pour les projets personnels, les outils
        internes, les sites de documentation et les prototypes rapides. Vous obtenez un favicon distinctif et
        conforme à la marque sans jamais ouvrir une application de conception.
      </p>

      <h2>Ce que vous téléchargez réellement</h2>
      <p>
        Lorsque vous cliquez sur télécharger, l&apos;outil regroupe un paquet complet et prêt pour la
        production dans un seul fichier ZIP :
      </p>
      <p>
        <strong>Icônes PNG</strong> en 16×16, 32×32, 48×48, 180×180 (l&apos;icône tactile Apple), 192×192 et
        512×512.
        <br />
        <strong>favicon.ico</strong> — un véritable fichier ICO multi-résolution contenant à la fois les
        images 16×16 et 32×32, encodé directement dans votre navigateur pour que les navigateurs anciens et
        Windows obtiennent toujours une icône correcte.
        <br />
        <strong>site.webmanifest</strong> — un manifeste d&apos;application web prêt à modifier qui référence
        les PNG 192 et 512 pour les installations Android et PWA.
        <br />
        <strong>L&apos;extrait HTML</strong> — les balises <code>&lt;link&gt;</code> exactes que vous collez dans
        votre <code>&lt;head&gt;</code>, également copiables directement depuis l&apos;outil en un clic.
      </p>

      <h2>Comment ajouter des favicons à votre site</h2>
      <p>
        L&apos;ajout de favicons se fait en deux étapes. D&apos;abord, décompressez les fichiers téléchargés
        dans le répertoire racine ou public de votre site (le même endroit où se trouve votre{" "}
        <code>index.html</code> ou le dossier public de votre framework). Ensuite, collez les balises de lien
        générées dans le <code>&lt;head&gt;</code> de votre HTML :
      </p>
      <pre dir="ltr">
        <code>{`<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`}</code>
      </pre>
      <p>
        Si vous êtes sur Next.js, placez les fichiers dans le répertoire <code>public/</code> et ajoutez soit
        les balises à votre layout racine, soit appuyez-vous sur l&apos;API de métadonnées du framework. Sur
        WordPress, la plupart des thèmes disposent d&apos;un réglage d&apos;icône de site qui accepte un seul
        PNG carré — téléversez-y le 512×512. Pour les sites statiques et les frameworks comme Astro, Vite ou
        le HTML pur, l&apos;extrait ci-dessus fonctionne tel quel.
      </p>

      <h2>Tout s&apos;exécute dans votre navigateur</h2>
      <p>
        De nombreux générateurs de favicons téléversent votre logo sur un serveur, le traitent à distance,
        puis vous l&apos;envoient par e-mail ou vous redirigent vers un téléchargement. Le nôtre ne le fait
        jamais. L&apos;ensemble du pipeline — décoder votre image, la dessiner sur des canevas, la
        redimensionner, encoder l&apos;ICO et les PNG, et compresser le résultat — se déroule localement à
        l&apos;aide du canevas HTML et de la bibliothèque <code>jszip</code> exécutée dans votre onglet. Votre
        logo ne quitte jamais votre appareil, il n&apos;y a aucun compte à créer, aucun filigrane et aucune
        limite de téléversement. C&apos;est véritablement gratuit et véritablement privé.
      </p>

      <h2>Conseils pour des favicons nets</h2>
      <p>
        Commencez avec une source carrée pour que rien ne soit recadré de façon inattendue. Utilisez des
        formes franches et un fort contraste pour que l&apos;icône reste lisible à 16 pixels. Évitez les
        lignes fines et le petit texte — ils s&apos;évanouissent aux petites tailles. Si vous utilisez le mode
        lettre, une couleur d&apos;arrière-plan soutenue avec du texte blanc se lit clairement dans les
        thèmes de navigateur clairs comme sombres. Et vérifiez toujours votre favicon dans un véritable onglet
        de navigateur après le déploiement, car rien ne vaut le fait de le voir à sa taille réelle.
      </p>

      <h2>Essayez-le maintenant</h2>
      <p>
        Ouvrez le <a href="/tools/favicon-generator">générateur de favicon</a>, téléversez un logo ou tapez
        une lettre, et téléchargez votre jeu de favicons complet en quelques secondes. Tant que vous êtes là,
        vous aimerez peut-être aussi le{" "}
        <a href="/tools/image-resizer">redimensionneur d&apos;images</a>, le{" "}
        <a href="/tools/image-converter">convertisseur de format d&apos;image</a>, et le{" "}
        <a href="/tools/meta-tags">générateur de balises Meta</a> — tous gratuits, tous privés, tous
        s&apos;exécutant entièrement dans votre navigateur.
      </p>
      <ToolCTA slug="favicon-generator" variant="card" />
    </div>
  );
}
