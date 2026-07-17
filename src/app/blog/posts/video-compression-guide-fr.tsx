import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Les fichiers vidéo sont énormes par nature. Une seule minute de séquence 1080p non compressée à
        30 images par seconde occupe environ 1,5 Go de stockage. La compression n'est pas un luxe — c'est
        la seule raison pour laquelle la vidéo sur Internet est viable. Mais toutes les compressions ne
        se valent pas, et de mauvais paramètres peuvent produire un fichier encore trop volumineux, à
        qualité visiblement dégradée, ou les deux.
      </p>
      <ToolCTA slug="compress-video" variant="inline" />
      <p>
        Vous pouvez compresser n'importe quel fichier vidéo dès maintenant grâce au{" "}
        <a href="/tools/compress-video">Compresseur vidéo BrowseryTools</a> — gratuit, sans inscription,
        et l'intégralité du traitement s'exécute localement dans votre navigateur. Vos séquences ne
        quittent jamais votre appareil.
      </p>

      <h2>Pourquoi les fichiers vidéo bruts sont-ils si volumineux ?</h2>
      <p>
        Pour apprécier ce que fait la compression, il faut comprendre le point de départ. La vidéo
        numérique est une séquence d'images individuelles affichées rapidement en succession pour créer
        l'illusion du mouvement. À une résolution 1080p, chaque image contient 1 920 × 1 080 = 2 073 600
        pixels. Si chaque pixel stocke sa couleur sous forme de trois canaux 8 bits (rouge, vert, bleu),
        cela représente environ 6 Mo par image. À 30 ips, une seconde de vidéo non compressée occupe
        environ 180 Mo. Une minute, c'est plus de 10 Go.
      </p>
      <p>
        Les formats bruts comme RAW, BRAW ou Apple ProRes capturent la vidéo proche de cet état non
        compressé afin de préserver la qualité maximale pour le montage en post-production. Les formats
        grand public, les uploads sur les réseaux sociaux et les plateformes de streaming utilisent des
        formats compressés où la majeure partie de ces données a été supprimée ou reconstruite — d'une
        façon que l'œil humain peine à détecter si c'est fait correctement.
      </p>

      <h2>Comment fonctionnent les codecs vidéo</h2>
      <p>
        Un codec (codeur-décodeur) est un algorithme qui compresse et décompresse les données vidéo. La
        plupart des codecs modernes utilisent deux techniques complémentaires : la compression spatiale
        au sein de chaque image, et la compression temporelle entre les images.
      </p>
      <p>
        <strong>La compression spatiale</strong> fonctionne comme la compression JPEG pour les images
        fixes. Elle analyse chaque image et supprime les informations visuelles difficiles à détecter par
        l'œil humain — nuances de couleurs subtiles, texture fine dans les zones uniformes, détails
        haute fréquence dans les zones périphériques. Cela réduit considérablement la taille de chaque
        image individuelle.
      </p>
      <p>
        <strong>La compression temporelle</strong> exploite le fait que les images vidéo consécutives
        sont généralement très similaires. Plutôt que de stocker chaque pixel dans chaque image, le
        codec stocke une image de référence complète (appelée I-frame ou image clé) à intervalles
        réguliers, puis stocke uniquement les différences — vecteurs de mouvement et régions modifiées —
        pour les images intermédiaires (P-frames et B-frames). Un plan d'une personne qui parle devant
        un fond statique change à peine d'une image à l'autre, si bien que la représentation compressée
        de ces images intermédiaires est minuscule.
      </p>

      <h2>Les principaux codecs comparés</h2>
      <ul>
        <li>
          <strong>H.264 (AVC)</strong> — Le cheval de bataille d'Internet. Introduit en 2003, maintenant universellement pris en charge par les navigateurs, appareils et plateformes. Il offre une bonne qualité pour des tailles de fichiers raisonnables et fonctionne sur pratiquement tous les appareils fabriqués au cours des 15 dernières années. Si vous avez besoin d'une compatibilité maximale, H.264 est le choix sûr par défaut.
        </li>
        <li>
          <strong>H.265 (HEVC)</strong> — Le successeur de H.264, offrant une qualité visuelle équivalente pour un fichier deux fois plus petit. L'inconvénient est les redevances de licence, ce qui a ralenti l'adoption. Pris en charge nativement sur les appareils Apple et le matériel Windows récent, mais la prise en charge par les navigateurs est inégale. Un excellent choix pour l'archivage ou les workflows centrés sur Apple.
        </li>
        <li>
          <strong>VP9</strong> — La réponse de Google à H.265 et le codec derrière YouTube. Libre de droits et pris en charge dans Chrome et Firefox. L'efficacité de compression est comparable à H.265. Couramment utilisé pour la diffusion web aux côtés des conteneurs WebM.
        </li>
        <li>
          <strong>AV1</strong> — Le codec de nouvelle génération, développé par l'Alliance for Open Media (Google, Netflix, Apple et d'autres). AV1 atteint une compression 30 à 50 % meilleure que H.264 à qualité égale. Libre de droits, de plus en plus pris en charge dans les navigateurs et appareils modernes. Le compromis : un encodage très lent — AV1 peut prendre 10 à 20 fois plus longtemps que H.264. Idéal pour la livraison finale de contenu regardé de nombreuses fois ; excessif pour le partage rapide.
        </li>
      </ul>

      <h2>Débit, résolution et fréquence d'images : ce qui contrôle vraiment la taille du fichier</h2>
      <p>
        Trois variables déterminent la taille d'un fichier vidéo compressé :
      </p>
      <ul>
        <li>
          <strong>Débit binaire</strong> — Le nombre de bits de données stockés par seconde de vidéo. Un débit plus élevé signifie plus de données, meilleure qualité, fichier plus volumineux. Un upload YouTube 4K peut utiliser 35 à 68 Mbps ; un clip web compressé peut utiliser 2 à 5 Mbps. Le débit est le levier le plus direct pour contrôler la taille du fichier.
        </li>
        <li>
          <strong>Résolution</strong> — Les dimensions en pixels de l'image. Passer de 4K (3840×2160) à 1080p (1920×1080) réduit le nombre de pixels de 75 %, ce qui permet soit un fichier beaucoup plus petit au même débit, soit une qualité similaire à un débit considérablement plus faible. Pour la plupart des contenus web, la 1080p est indiscernable de la 4K aux distances de visionnage et aux tailles d'écran habituelles.
        </li>
        <li>
          <strong>Fréquence d'images</strong> — Le contenu standard fonctionne à 24, 25 ou 30 ips. Les fréquences plus élevées (60 ips, 120 ips) nécessitent proportionnellement plus de données pour maintenir la qualité. Passer de 60 à 30 ips réduit environ de moitié le débit nécessaire pour une qualité équivalente — une économie significative pour les vidéos où le mouvement fluide n'est pas l'attraction principale.
        </li>
      </ul>

      <h2>Compression sans perte vs avec perte</h2>
      <p>
        La compression sans perte réduit la taille du fichier sans supprimer de données. L'original peut
        être parfaitement reconstruit à partir du fichier compressé. Des formats comme Apple ProRes 4444,
        FFV1 ou Huffyuv utilisent la compression sans perte. Ils sont nettement plus petits que les
        formats bruts mais encore très volumineux par rapport aux formats de distribution. La compression
        sans perte est le bon choix pour les masters d'archivage et les workflows de montage — pas pour
        le partage ou la diffusion.
      </p>
      <p>
        La compression avec perte atteint des taux de compression bien plus élevés en supprimant
        définitivement des données que l'encodeur juge imperceptibles. H.264, H.265, VP9 et AV1 sont
        tous avec perte. Une fois que vous compressez vers un format avec perte, les informations
        supprimées sont perdues à jamais. C'est acceptable pour la distribution — le spectateur ne sait
        pas ce qui a été supprimé — mais cela importe énormément pour les workflows, comme discuté
        ci-après.
      </p>

      <h2>La dégradation par génération : pourquoi la recompression dégrade la qualité</h2>
      <p>
        Chaque fois que vous transcodez (recompressez) une vidéo avec perte déjà compressée, la qualité
        se dégrade. La première passe de compression supprime certaines informations. La deuxième passe
        travaille sur la version déjà dégradée et en supprime davantage. À la cinquième ou sixième
        passe, des artefacts de compression visibles — blocs, bandes, flou — s'accumulent de manière
        perceptible. On appelle cela la dégradation par génération, par analogie avec la perte de
        qualité lors de la copie de cassettes VHS.
      </p>
      <p>
        L'implication pratique : compressez toujours depuis la source originale. Montez dans un format
        sans perte ou à haut débit, puis compressez l'export final une seule fois pour la livraison. Ne
        retéléchargez jamais une vidéo depuis un réseau social et ne la recompressez pas — vous partez
        d'une copie déjà dégradée et l'empirez encore.
      </p>

      <h2>Objectifs de compression pour les cas d'usage courants</h2>
      <ul>
        <li>
          <strong>Pièce jointe e-mail</strong> — Restez sous 25 Mo (la plupart des clients de messagerie imposent cette limite). Utilisez H.264 en 720p, 1 à 2 Mbps. Pour tout ce qui dépasse 2 à 3 minutes, uploadez plutôt sur un service de partage de fichiers et envoyez un lien.
        </li>
        <li>
          <strong>Intégration web</strong> — Visez moins de 5 Mo pour les clips courts, 10 à 20 Mbps pour les plus longs. H.264 en 1080p est un choix universel sûr. AV1 ou VP9 en WebM sera plus petit pour les navigateurs qui les prennent en charge.
        </li>
        <li>
          <strong>Réseaux sociaux</strong> — Les plateformes recompressent tout de leur côté, donc uploadez à la qualité la plus élevée que votre workflow prend en charge dans leurs limites de taille. La limite d'Instagram est de 4 Go ; celle de TikTok est de 287 Mo pour la plupart des formats. Puisque la plateforme ajoute sa propre passe de compression, partir d'un fichier plus propre et à débit plus élevé produit un résultat nettement meilleur après leur transcodage.
        </li>
        <li>
          <strong>Master d'archivage</strong> — Utilisez sans perte (ProRes 4444, FFV1) ou quasi sans perte (ProRes 422 HQ) à pleine résolution. Le stockage est bon marché ; recréer les séquences originales est impossible.
        </li>
      </ul>

      <h2>Conseils pratiques pour choisir les paramètres de compression</h2>
      <p>
        Quelques règles empiriques qui produisent régulièrement de bons résultats :
      </p>
      <ul>
        <li>
          <strong>Utilisez le mode CRF quand la taille du fichier est flexible.</strong> Le Facteur de Taux Constant laisse l'encodeur faire varier le débit dynamiquement, dépensant plus de bits sur les scènes complexes et moins sur les scènes simples. Cela produit une meilleure qualité par taille de fichier qu'un débit fixe. Pour H.264, CRF 18 à 23 couvre la plage de quasi sans perte à suffisant pour le web.
        </li>
        <li>
          <strong>Adaptez la résolution de sortie à la plateforme de livraison.</strong> Réduire une source 4K à 1080p avant d'appliquer la compression donne moins de travail à l'encodeur et produit une sortie plus propre que compresser en 4K et laisser la plateforme le réduire.
        </li>
        <li>
          <strong>L'audio compte aussi.</strong> L'AAC à 128 à 192 kbps couvre la plupart des contenus stéréo. Il y a rarement une différence perceptible entre 192 kbps et 320 kbps pour les dialogues et la musique aux volumes d'écoute habituels, mais la différence de taille de fichier est réelle.
        </li>
        <li>
          <strong>Testez avant de vous engager.</strong> Encodez un clip de 30 secondes avec vos paramètres cibles et vérifiez-le sur le même type d'écran et de connexion qu'utilisera votre audience. Un fichier qui semble parfait sur votre moniteur de montage en pleine résolution peut montrer des artefacts sur l'écran d'un téléphone ou mettre en mémoire tampon sur une connexion lente.
        </li>
      </ul>
      <p>
        Pour une compression rapide sans configurer un environnement de montage complet, le{" "}
        <a href="/tools/compress-video">Compresseur vidéo BrowseryTools</a> gère les paramètres pour
        vous et traite tout dans votre navigateur — pas d'uploads, pas d'attente, pas d'accès tiers à
        vos séquences.
      </p>

      <div
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>À retenir :</strong> Le meilleur workflow de compression consiste à monter dans un format
        de haute qualité, à compresser une seule fois vers votre format cible, et à ne jamais recompresser
        le résultat. Choisissez le bon codec pour votre plateforme de livraison, adaptez la résolution à
        la taille d'écran prévue, et utilisez le mode CRF pour une compression axée sur la qualité plutôt
        que de viser un débit arbitraire.
      </div>
      <ToolCTA slug="compress-video" variant="card" />
    </div>
  );
}
