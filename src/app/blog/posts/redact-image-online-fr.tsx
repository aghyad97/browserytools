import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Avant de publier une capture d'écran, partager la photo d'un document, ou uploader une
        image sur un forum public, il y a presque toujours quelque chose dans le cadre qui ne
        devrait pas être public : un visage, une plaque d'immatriculation, une adresse personnelle,
        un numéro de compte, un e-mail, un nom sur un badge. Le recadrage aide, mais l'élément
        sensible se trouve souvent au milieu de l'image. Ce dont vous avez besoin, c'est de{" "}
        <strong>masquer ou censurer l'image</strong> — la flouter, la pixéliser, ou la noircir —
        sans confier l'original à un site web.
      </p>
      <ToolCTA slug="photo-censor" variant="inline" />
      <p>
        L'outil <a href="/tools/photo-censor">BrowseryTools Photo Censor</a> fait exactement cela,
        entièrement dans votre navigateur. Vous peignez sur les zones à masquer, choisissez flou,
        pixélisation ou bloc opaque, et exportez une copie propre. Rien n'est uploadé. Ce guide
        explique comment masquer correctement une image — et l'erreur qui fait discrètement fuiter
        les données que vous pensiez avoir cachées.
      </p>

      <h2>Comment masquer ou flouter une image (étape par étape)</h2>
      <p>
        <strong>1. Ouvrir l'outil.</strong> Accédez à la page{" "}
        <a href="/tools/photo-censor">Photo Censor</a> et ajoutez votre image en la faisant glisser
        ou en cliquant pour parcourir. Le fichier est lu localement.
        <br />
        <strong>2. Choisir un style de censure.</strong> Le flou adoucit une zone, la pixélisation
        la transforme en gros carrés, et le bloc opaque la peint complètement.
        <br />
        <strong>3. Peindre sur les zones sensibles.</strong> Passez le pinceau sur chaque visage,
        plaque, nom ou numéro à masquer. Vous pouvez couvrir plusieurs zones en un seul passage.
        <br />
        <strong>4. Ajuster l'intensité.</strong> Pour une vraie censure, allez fort — un flou léger
        peut être inversé. Une forte pixélisation ou un bloc opaque est plus sûr.
        <br />
        <strong>5. Exporter.</strong> Téléchargez l'image censurée. L'original sur votre disque
        n'est jamais modifié.
      </p>

      <h2>Flou, pixélisation ou bloc opaque — lequel utiliser</h2>
      <p>
        <strong>Le bloc opaque</strong> est la seule option véritablement irréversible. Les pixels
        en dessous sont remplacés par une couleur unie, il ne reste donc rien à récupérer. Utilisez-le
        pour tout ce qui ne doit jamais être lisible : pièces d'identité officielles, informations
        financières, mots de passe, données médicales.
      </p>
      <p>
        <strong>La forte pixélisation</strong> est le bon équilibre pour la plupart des situations —
        elle masque le contenu tout en montrant qu'il y avait quelque chose (un visage, un écran,
        un panneau). Gardez une grande taille de bloc ; une pixélisation fine d'un texte peut
        parfois être partiellement reconstruite.
      </p>
      <p>
        <strong>Le flou</strong> est le plus propre visuellement et convient pour atténuer un visage
        en arrière-plan ou un logo, mais un flou <em>léger</em> est la forme de censure la plus
        faible. Des visages et des textes courts sous un léger flou gaussien ont, dans des cas
        documentés, été récupérés. Si la donnée est importante, ne comptez pas sur un flou doux —
        allez fort, ou utilisez un bloc opaque.
      </p>

      <h2>L'erreur qui fait fuiter les données masquées</h2>
      <p>
        L'échec de censure le plus courant n'a rien à voir avec la force de votre flou. C'est les
        <strong> métadonnées</strong>. Une photo peut contenir des données EXIF — coordonnées GPS,
        appareil qui l'a prise, horodatage d'origine — intégrées dans le fichier lui-même. Vous
        pouvez noircir l'adresse sur l'image et quand même transmettre la localisation GPS exacte
        dans les métadonnées. Après avoir masqué, pensez à supprimer ces données ; notre{" "}
        <a href="/tools/image-converter">convertisseur d'images</a> et le{" "}
        <a href="/blog/exif-data-guide">guide sur les métadonnées EXIF</a> expliquent ce qui est
        caché dans vos photos et comment le supprimer.
      </p>
      <p>
        La deuxième erreur classique est de masquer d'une façon qui peut être annulée : en dessinant
        un rectangle noir comme calque séparé dans un PDF ou un éditeur vectoriel, où le texte
        en dessous existe toujours et peut être sélectionné ou déplacé. Puisque l'outil Photo
        Censor exporte une image matricielle aplatie, les pixels censurés sont véritablement
        supprimés — il n'y a pas de calque caché à retirer.
      </p>

      <h2>Pourquoi masquer dans le navigateur, pas sur un site web</h2>
      <p>
        C'est une ironie frappante : les gens masquent une image précisément parce qu'elle contient
        quelque chose de sensible, puis uploadent cet original non masqué sur les serveurs d'un
        éditeur en ligne pour effectuer la censure. Tout l'enjeu est la confidentialité, et le
        processus la compromet.
      </p>
      <p>
        La censure dans le navigateur garde l'original sur votre appareil tout le temps. L'image
        est lue dans la page, éditée par votre propre navigateur, et exportée localement. La version
        non censurée ne voyage jamais sur internet, n'atterrit jamais dans un journal de serveur, et
        ne réside jamais dans le stockage de quelqu'un d'autre. Pour une explication plus complète
        de l'importance de ce modèle, consultez{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          pourquoi les outils basés sur le navigateur protègent vos données
        </a>
        .
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Flouter un visage est-il vraiment sûr ?</strong> Seulement si le flou est fort.
        Un flou léger peut parfois être inversé. Pour un vrai anonymat, utilisez une forte
        pixélisation ou un bloc opaque.
      </p>
      <p>
        <strong>Une image censurée peut-elle être décensurée ?</strong> Pas si vous avez utilisé
        un bloc opaque ou une forte pixélisation et exporté une image aplatie — les pixels sous-jacents
        sont remplacés. Le risque n'existe qu'avec des flous faibles ou avec des éditeurs qui
        conservent l'original sur un calque caché.
      </p>
      <p>
        <strong>L'outil uploade-t-il ma photo ?</strong> Non. Tout se passe dans votre navigateur.
        L'image n'est jamais envoyée à un serveur.
      </p>
      <p>
        <strong>Qu'en est-il des données de localisation dans la photo ?</strong> Masquer l'image
        visible ne supprime pas les données GPS EXIF. Supprimez les métadonnées séparément avant
        de partager.
      </p>
      <p>
        <strong>Est-ce gratuit ?</strong> Oui — sans compte, sans filigrane, sans limite.
      </p>

      <h2>Essayez maintenant</h2>
      <p>
        Ouvrez l'<a href="/tools/photo-censor">outil Photo Censor</a>, peignez sur tout ce qui est
        sensible, et exportez une copie propre qui n'a jamais quitté votre appareil. Pour terminer
        le travail, supprimez les métadonnées de localisation avec le{" "}
        <a href="/tools/image-converter">convertisseur d'images</a>, et si vous avez aussi besoin
        de recadrer ou d'ajouter un filigrane, lisez notre guide sur le{" "}
        <a href="/blog/crop-and-watermark-images-online">recadrage et l'ajout de filigrane en ligne</a>.
      </p>
      <ToolCTA slug="photo-censor" variant="card" />
    </div>
  );
}
