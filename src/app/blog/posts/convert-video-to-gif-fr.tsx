import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Un GIF est le moyen le plus rapide de montrer quelque chose plutôt que de le décrire :
        un bug qui se reproduit en trois secondes, une animation d'interface, un clip de réaction,
        une étape de tutoriel. Les GIFs se lancent automatiquement, bouclent, et s'intègrent
        partout — gestionnaires de tickets, applications de messagerie, documentation, fichiers
        README — sans lecteur ni clic. Le hic, c'est qu'on commence généralement avec un MP4 ou
        un MOV, et qu'il faut d'abord <strong>convertir cette vidéo en GIF</strong>.
      </p>
      <ToolCTA slug="video" variant="inline" />
      <p>
        L'<a href="/tools/video">outil vidéo BrowseryTools</a> vous permet de transformer un clip
        en GIF directement dans votre navigateur — sans envoi, sans compte, sans filigrane. Ce guide
        explique comment procéder, comment garder le fichier léger (les GIFs grossissent vite), et
        quand un GIF n'est pas le bon choix.
      </p>

      <h2>Comment convertir une vidéo en GIF (étape par étape)</h2>
      <p>
        <strong>1. Ouvrir l'outil.</strong> Accédez à l'<a href="/tools/video">outil vidéo</a> et
        ajoutez votre clip en le faisant glisser ou en parcourant. Il est lu localement.
        <br />
        <strong>2. Couper la partie qui compte.</strong> Un GIF doit être court — généralement quelques
        secondes. Coupez exactement le moment que vous voulez montrer ; c'est le facteur le plus
        important pour la taille du fichier.
        <br />
        <strong>3. Définir les dimensions.</strong> Réduisez à la taille à laquelle il sera réellement
        affiché. Un GIF intégré dans un README n'a rarement besoin d'être plus large que 600 à
        800 pixels.
        <br />
        <strong>4. Choisir la cadence.</strong> 10 à 15 images par seconde suffit pour la plupart
        des enregistrements d'écran et des réactions. Une cadence plus basse signifie des fichiers
        plus petits.
        <br />
        <strong>5. Exporter et télécharger.</strong> Sauvegardez le GIF. La vidéo originale est
        intacte.
      </p>

      <h2>Pourquoi les GIFs grossissent — et comment les garder petits</h2>
      <p>
        Le GIF est un format ancien avec une limite stricte : seulement 256 couleurs par image,
        et une compression faible comparée aux codecs vidéo modernes. Cela rend les GIFs
        étonnamment lourds. Un clip de dix secondes peut facilement peser plusieurs mégaoctets,
        tandis que le même clip en MP4 serait une fraction de cette taille. Trois leviers permettent
        de garder un GIF raisonnable :
      </p>
      <p>
        <strong>La durée.</strong> C'est ce qui domine tout. Deux secondes valent bien mieux que dix.
        Coupez sans pitié.
        <br />
        <strong>Les dimensions.</strong> Diviser par deux la largeur et la hauteur réduit
        approximativement le nombre de pixels par quatre. Affichez-le petit.
        <br />
        <strong>La cadence.</strong> Passer de 30 à 12 images/seconde réduit le nombre d'images de
        plus de moitié avec peu de différence visible pour la plupart des contenus.
      </p>

      <h2>Quand NE PAS utiliser un GIF</h2>
      <p>
        Pour tout ce qui est long, coloré ou plein de mouvement — dégradés, séquences vidéo, contenu
        photoréaliste — un GIF aura un aspect en bandes (à cause de la limite de 256 couleurs) et
        sera énorme. Dans ces cas, un court MP4 ou WebM est considérablement plus petit et bien
        meilleur visuellement. Les plateformes modernes lisent automatiquement les vidéos silencieuses
        presque aussi facilement que des GIFs. Réservez les GIFs aux animations courtes, simples
        et à couleurs plates comme les démos d'interface, les captures d'écran et les réactions ;
        pour tout le reste, compressez plutôt la vidéo et lisez notre guide sur la{" "}
        <a href="/blog/compress-video-online-free">compression vidéo en ligne gratuite</a>.
      </p>

      <h2>Pourquoi convertir dans le navigateur ?</h2>
      <p>
        Les sites habituels de &ldquo;vidéo vers GIF&rdquo; uploadent votre clip sur leurs serveurs.
        Si vos séquences montrent un visage, un écran privé, un produit non publié, ou tout contexte
        sensible, c'est une vraie exposition — et beaucoup de ces sites ajoutent un filigrane ou
        limitent la durée. La conversion dans le navigateur traite le clip sur votre propre
        matériel. Rien n'est uploadé, rien n'est stocké, et il n'y a pas de filigrane. C'est le
        même principe local d'abord derrière chaque outil BrowseryTools, expliqué dans{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          pourquoi les outils basés sur le navigateur protègent vos données
        </a>
        .
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Pourquoi mon GIF est-il si lourd ?</strong> Généralement, il est trop long, trop
        grand en dimensions, ou à une cadence trop élevée. Raccourcissez-le, réduisez sa taille,
        et passez à 10 à 15 images/seconde.
      </p>
      <p>
        <strong>Quelle durée devrait avoir un GIF ?</strong> Quelques secondes. Les GIFs sont faits
        pour les moments courts en boucle ; tout ce qui est plus long appartient à une vidéo.
      </p>
      <p>
        <strong>La qualité sera-t-elle aussi bonne que la vidéo ?</strong> Non — le GIF est limité
        à 256 couleurs, donc les dégradés et les séquences détaillées perdent en qualité. Pour une
        lecture haute fidélité, conservez le format vidéo.
      </p>
      <p>
        <strong>Ma vidéo est-elle uploadée ?</strong> Non. Elle est traitée localement dans votre
        navigateur.
      </p>
      <p>
        <strong>Est-ce gratuit ?</strong> Oui — sans compte, sans filigrane, sans limite.
      </p>

      <h2>Essayez maintenant</h2>
      <p>
        Ouvrez l'<a href="/tools/video">outil vidéo</a>, coupez votre clip, et exportez un GIF
        en boucle net — entièrement dans votre navigateur. Si votre fichier source est déjà
        volumineux, compressez-le d'abord en suivant notre guide sur la{" "}
        <a href="/blog/compress-video-online-free">compression vidéo en ligne gratuite</a>, et
        pour les détails techniques sur les codecs lisez{" "}
        <a href="/blog/video-compression-guide">comment compresser des fichiers vidéo sans perdre en qualité</a>
        .
      </p>
      <ToolCTA slug="video" variant="card" />
    </div>
  );
}
