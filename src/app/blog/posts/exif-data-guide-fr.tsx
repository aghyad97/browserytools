export default function Content() {
  return (
    <div>
      <p>
        Chaque photo prise avec un smartphone moderne ou un appareil photo numérique intègre un journal
        détaillé de métadonnées directement dans le fichier image. Ces métadonnées — appelées données
        EXIF — enregistrent où vous vous trouviez, exactement à quelle heure vous avez appuyé sur le
        déclencheur, quel appareil vous avez utilisé et des dizaines de paramètres techniques. La plupart
        des gens ignorent leur existence. Beaucoup ignorent leur précision. Ce guide explique ce que
        les données EXIF capturent, les implications en matière de vie privée, et comment les consulter
        ou les supprimer.
      </p>
      <p>
        Vous pouvez inspecter les métadonnées EXIF de n'importe quelle photo grâce au{" "}
        <a href="/tools/exif-viewer">Visionneuse EXIF BrowseryTools</a> — gratuit, sans inscription,
        et l'image ne quitte jamais votre navigateur.
      </p>

      <h2>Qu'est-ce que les données EXIF ?</h2>
      <p>
        EXIF signifie Exchangeable Image File Format. Ce format a été défini en 1995 par la Japan
        Electronic Industries Development Association (JEIDA) et ultérieurement standardisé par la JEITA.
        La spécification EXIF définit un ensemble de balises de métadonnées pouvant être intégrées dans
        les fichiers image JPEG, TIFF et HEIC. Chaque balise a une signification standardisée, rendant
        les données EXIF lisibles par machine et cohérentes entre les appareils et les logiciels.
      </p>
      <p>
        Les métadonnées sont stockées dans une section d'en-tête du fichier image, avant les données
        d'image elles-mêmes. Elles n'affectent pas l'apparence de l'image — elles sont invisibles pour
        quiconque se contente de visionner la photo. Mais elles sont trivialement lisibles par tout
        logiciel qui sait où chercher, et elles sont transmises intactes à chaque partage du fichier.
      </p>

      <h2>Ce qui est enregistré</h2>
      <p>
        L'étendue des informations stockées dans les données EXIF est plus large que la plupart des gens
        ne le pensent :
      </p>
      <ul>
        <li>
          <strong>Coordonnées GPS</strong> — Latitude et longitude, souvent avec l'altitude et des données
          de précision GPS. Lorsque les services de localisation sont activés sur votre téléphone, cela
          enregistre les coordonnées exactes où la photo a été prise — généralement précises à quelques
          mètres près. Certains appareils photo enregistrent également la direction vers laquelle l'appareil
          pointait.
        </li>
        <li>
          <strong>Marque et modèle de l'appareil</strong> — Le fabricant et le numéro de modèle de l'appareil
          photo (par exemple, « Apple iPhone 15 Pro Max » ou « Canon EOS R5 »). Pour les smartphones,
          cela identifie l'appareil précis.
        </li>
        <li>
          <strong>Numéro de série de l'appareil</strong> — De nombreux appareils photo enregistrent le
          numéro de série du boîtier dans les données EXIF. Il s'agit d'un identifiant unique pouvant
          servir à prouver qu'un appareil spécifique a pris une photo spécifique — utile dans certains
          contextes juridiques, préoccupant dans d'autres.
        </li>
        <li>
          <strong>Date et heure</strong> — L'horodatage précis de la prise de vue, généralement stocké
          en heure locale et parfois aussi en UTC. Inclut les secondes.
        </li>
        <li>
          <strong>Paramètres de l'appareil photo</strong> — Ouverture (f/), vitesse d'obturation,
          sensibilité ISO, longueur focale, si le flash a déclenché, compensation d'exposition, mode de
          mesure, balance des blancs et bien plus. Pour les smartphones, cela inclut la longueur focale
          équivalente et l'objectif spécifique utilisé (grand-angle, ultra grand-angle, téléobjectif).
        </li>
        <li>
          <strong>Informations sur l'objectif</strong> — Modèle et numéro de série de l'objectif sur les
          appareils photo à objectifs interchangeables.
        </li>
        <li>
          <strong>Version du logiciel</strong> — Le firmware de l'appareil ou, pour les photos de
          smartphone, la version d'iOS ou Android au moment de la prise de vue.
        </li>
        <li>
          <strong>Orientation de l'image</strong> — L'indicateur de rotation indiquant aux visionneuses
          comment orienter correctement l'image.
        </li>
        <li>
          <strong>Miniature</strong> — De nombreuses implémentations EXIF intègrent une petite miniature
          JPEG de l'image dans les données EXIF elles-mêmes.
        </li>
      </ul>

      <h2>Les risques réels pour la vie privée</h2>
      <p>
        Les coordonnées GPS dans les données EXIF représentent un risque réel et concret pour la vie
        privée. Lorsque vous partagez une photo prise à votre domicile, votre bureau, l'école de votre
        enfant ou tout lieu que vous fréquentez, quiconque reçoit le fichier peut l'ouvrir dans une
        visionneuse EXIF et voir exactement où la photo a été prise. Ce n'est pas théorique — c'est le
        comportement par défaut de tout appareil photo de smartphone quand les services de localisation
        sont activés.
      </p>
      <p>
        Le risque se cumule avec l'échelle. Si vous publiez de nombreuses photos de votre vie quotidienne
        avec les données EXIF intactes, les métadonnées révèlent collectivement votre adresse
        personnelle, votre lieu de travail, votre routine quotidienne, vos lieux fréquentés, vos
        habitudes de déplacement et les endroits que vous fréquentez régulièrement. Cette image agrégée
        est significativement plus invasive que n'importe quelle coordonnée isolée.
      </p>
      <p>
        Les numéros de série des appareils et les informations sur le modèle peuvent être utilisés pour
        prouver que deux photos proviennent du même appareil — une considération dans les procédures
        judiciaires, le journalisme d'investigation ou toute situation où l'anonymat compte. Si vous
        partagez des photos anonymement, l'identifiant d'appareil dans les données EXIF peut être le
        lien qui relie vos images anonymes à votre identité.
      </p>

      <h2>Cas célèbres où les données EXIF ont révélé une localisation</h2>
      <p>
        Les données EXIF ont exposé la localisation de personnes notoires dans plusieurs cas bien
        documentés :
      </p>
      <ul>
        <li>
          En 2012, le pionnier des antivirus John McAfee était en fuite au Belize. Lorsque des journalistes
          du magazine Vice se rendirent pour l'interviewer et publièrent une photo prise sur un iPhone avec
          les données GPS intactes, les coordonnées intégrées révélèrent sa position au Guatemala en
          quelques heures. Il fut appréhendé peu après.
        </li>
        <li>
          Du personnel militaire américain a été identifié et suivi grâce aux données EXIF de photos
          publiées sur les réseaux sociaux, ce qui a conduit l'armée américaine à émettre une directive
          formelle avertissant les soldats des photos géolocalisées. Des images partagées sur des blogs
          militaires ont révélé les emplacements de bases d'hélicoptères en Irak.
        </li>
        <li>
          Des lanceurs d'alerte et des journalistes opérant dans des contextes sensibles ont vu leur
          localisation révélée involontairement via les données EXIF de photos partagées publiquement,
          ce qui a conduit les organisations de sécurité numérique à inclure systématiquement la
          suppression des EXIF dans leurs listes de contrôle de sécurité opérationnelle.
        </li>
      </ul>

      <h2>Comment les plateformes de réseaux sociaux gèrent les EXIF</h2>
      <p>
        La plupart des grandes plateformes de réseaux sociaux suppriment les données EXIF des photos
        avant de les afficher, ce qui offre une certaine protection aux utilisateurs qui n'y pensent pas :
      </p>
      <ul>
        <li>
          <strong>Instagram, Facebook, Twitter/X</strong> — Suppriment les données EXIF des photos uploadées. Les coordonnées GPS ne sont pas visibles par les spectateurs.
        </li>
        <li>
          <strong>WhatsApp</strong> — Supprime les données EXIF lors de l'envoi de photos via la plateforme.
        </li>
        <li>
          <strong>Signal</strong> — Dispose d'une option pour supprimer les métadonnées des photos avant l'envoi, activée par défaut.
        </li>
        <li>
          <strong>E-mail et partage direct de fichiers</strong> — Aucune suppression n'a lieu. Lorsque vous envoyez une photo par e-mail ou la partagez via Dropbox, Google Drive, iMessage ou AirDrop en tant que fichier, les données EXIF sont conservées intégralement.
        </li>
        <li>
          <strong>Applications de rencontres</strong> — Les pratiques varient et sont souvent non divulguées. Certaines suppriment les métadonnées, d'autres non. Publier des photos avec des données de localisation sur des applications de rencontres visibles par des inconnus présente des risques évidents.
        </li>
      </ul>
      <p>
        L'approche la plus sûre est de ne pas compter sur les plateformes pour supprimer vos données —
        supprimez-les vous-même avant de partager.
      </p>

      <h2>Comment consulter les données EXIF</h2>
      <p>
        Vous pouvez inspecter les données EXIF de plusieurs façons :
      </p>
      <ul>
        <li>
          <strong>Dans votre navigateur</strong> — La{" "}
          <a href="/tools/exif-viewer">Visionneuse EXIF BrowseryTools</a> affiche toutes les balises
          EXIF dans un format lisible. Déposez votre photo et voyez immédiatement chaque champ,
          y compris les coordonnées GPS. Rien n'est uploadé.
        </li>
        <li>
          <strong>Sur macOS</strong> — Ouvrez la photo dans Aperçu, puis allez dans Outils → Afficher l'inspecteur → onglet GPS. Le Finder affiche également les métadonnées de base dans le panneau Informations (Cmd+I).
        </li>
        <li>
          <strong>Sur Windows</strong> — Faites un clic droit sur le fichier, choisissez Propriétés → onglet Détails. Les coordonnées GPS et les informations de l'appareil photo y apparaissent.
        </li>
        <li>
          <strong>Sur iOS</strong> — Ouvrez la photo dans l'application Photos et faites glisser vers le haut pour révéler la carte indiquant où la photo a été prise.
        </li>
      </ul>

      <h2>Comment supprimer les données EXIF</h2>
      <p>
        Supprimer les données EXIF avant de partager une photo est simple :
      </p>
      <ul>
        <li>
          <strong>Visionneuse EXIF BrowseryTools</strong> — La{" "}
          <a href="/tools/exif-viewer">Visionneuse EXIF</a> vous permet de consulter et de supprimer
          les données EXIF des photos entièrement dans votre navigateur. Pas d'upload, pas de compte
          requis.
        </li>
        <li>
          <strong>Sur Windows</strong> — Clic droit sur le fichier, Propriétés → onglet Détails → lien « Supprimer les propriétés et les informations personnelles » en bas. Crée une copie nettoyée.
        </li>
        <li>
          <strong>Sur macOS</strong> — Exportez depuis Aperçu en décochant la case des données de localisation, ou utilisez l'application Photos et choisissez de partager sans localisation.
        </li>
        <li>
          <strong>Sur iOS</strong> — Lors du partage d'une photo, appuyez sur « Options » en haut de la feuille de partage et désactivez « Localisation ».
        </li>
        <li>
          <strong>Préventivement</strong> — Désactivez complètement l'accès à la localisation pour votre application appareil photo. Sur iPhone : Réglages → Confidentialité → Service de localisation → Appareil photo → Jamais. Cela empêche les coordonnées GPS d'être enregistrées dès le départ.
        </li>
      </ul>

      <h2>Quand les données EXIF sont réellement utiles</h2>
      <p>
        Les données EXIF ne sont pas purement une responsabilité. Pour de nombreuses personnes, elles
        servent des objectifs légitimes et précieux :
      </p>
      <ul>
        <li>
          <strong>Photographes</strong> — Les données EXIF sont un outil d'apprentissage inestimable. Après une séance de prise de vue, vous pouvez revoir quelles combinaisons d'ouverture, de vitesse d'obturation et d'ISO ont produit les meilleurs résultats. Lightroom et Capture One affichent les données EXIF en bonne place précisément parce que les photographes les utilisent constamment.
        </li>
        <li>
          <strong>Photographie de voyage</strong> — Les photos géolocalisées s'organisent automatiquement en cartes et chronologies dans les logiciels de gestion de photos comme Apple Photos ou Google Photos, créant un journal de voyage sans effort.
        </li>
        <li>
          <strong>Archivistes et journalistes</strong> — Les horodatages et données de localisation EXIF peuvent vérifier quand et où une photo a été prise — important pour établir l'authenticité dans des contextes juridiques, éditoriaux et historiques.
        </li>
        <li>
          <strong>Assurance et documentation juridique</strong> — Une photo de dommages matériels avec les données EXIF intactes a plus de valeur probante car l'horodatage et la localisation font partie du dossier.
        </li>
      </ul>
      <p>
        L'essentiel est de prendre une décision consciente quant au moment de partager les données EXIF
        et au moment de les supprimer, plutôt que de les laisser par défaut et d'espérer que le
        destinataire ou la plateforme les gérera.
      </p>
    </div>
  );
}
