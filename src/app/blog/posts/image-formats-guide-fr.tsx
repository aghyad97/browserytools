import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Choisir le mauvais format d'image est l'une des erreurs les plus courantes et les plus coûteuses
        en termes de performances web. Un JPEG là où un WebP ferait l'affaire, un PNG là où un JPEG
        suffit, ou un format non pris en charge par votre navigateur — chacun de ces choix alourdit
        inutilement chaque chargement de page, nuisant directement à vos scores Core Web Vitals et à
        l'expérience utilisateur. Ce guide explique comment JPEG, PNG, WebP et AVIF fonctionnent
        chacun sous le capot, quand utiliser chacun, et comment faire un choix éclairé selon votre
        contexte.
      </p>
      <ToolCTA slug="image-converter" variant="inline" />
      <p>
        Vous pouvez convertir entre tous ces formats grâce au{" "}
        <a href="/tools/image-converter">Convertisseur d'images BrowseryTools</a> — gratuit, sans
        inscription, tout s'exécute localement dans votre navigateur.
      </p>

      <h2>JPEG : le standard de la photographie</h2>
      <p>
        Le JPEG (Joint Photographic Experts Group) a été introduit en 1992 et reste le format dominant
        pour les photographies. Son algorithme de compression est basé sur la Transformée en cosinus
        discrète (DCT) : chaque image est divisée en blocs de 8×8 pixels, et chaque bloc est transformé
        du domaine spatial (couleurs des pixels) vers le domaine fréquentiel (la rapidité avec laquelle
        les couleurs changent dans le bloc). L'encodeur quantifie ensuite ces données fréquentielles —
        conservant les composantes basses fréquences qui décrivent les grandes régions de couleur, et
        supprimant ou grossissant les composantes hautes fréquences qui décrivent les détails fins et
        les contours nets.
      </p>
      <p>
        C'est pourquoi la compression JPEG produit des artefacts caractéristiques à des paramètres
        agressifs : des blocs 8×8 (appelés macroblocks), du flou autour des contours nets et des
        bandes de couleur dans les dégradés. Ces artefacts apparaissent dans les zones à fort détail
        et à fort contraste — exactement là où les composantes hautes fréquences supprimées auraient
        le plus d'importance.
      </p>
      <p>
        JPEG est avec perte — chaque enregistrement supprime des informations définitivement. À la
        qualité 85 à 90 (sur une échelle de 0 à 100), les photographies semblent généralement
        indiscernables de l'original aux tailles d'affichage web, tout en étant 5 à 20 fois plus petites
        qu'un PNG de la même image. JPEG ne prend pas en charge la transparence (canal alpha) ni
        l'animation.
      </p>

      <h2>PNG : précision sans perte</h2>
      <p>
        Le PNG (Portable Network Graphics) utilise une compression sans perte basée sur l'algorithme
        DEFLATE, qui combine la compression par dictionnaire LZ77 (trouver et remplacer des séquences
        répétées d'octets) avec le codage de Huffman (attribuer des codes binaires plus courts aux
        valeurs plus fréquentes). Aucune donnée d'image n'est jamais supprimée. Chaque pixel est stocké
        exactement.
      </p>
      <p>
        Cela rend PNG excellent pour les images qui doivent être reproduites pixel par pixel :
        captures d'écran, logos, icônes, illustrations aux contours nets, texte superposé sur des images
        et tout ce qui inclut de la transparence. PNG prend en charge les canaux alpha 8 bits complets,
        permettant des dégradés semi-transparents fluides.
      </p>
      <p>
        Le compromis est la taille du fichier. Pour les contenus photographiques avec des dégradés de
        couleurs continues, les fichiers PNG sont énormes comparés au JPEG à qualité perçue similaire.
        Une photographie sauvegardée en PNG peut être 10 à 20 fois plus grande que la même image en
        JPEG bien compressé. PNG excelle quand le contenu présente de grandes zones uniformes, des
        contours nets ou relativement peu de couleurs distinctes — les patterns que LZ77 compresse
        efficacement. La photographie, avec ses millions de valeurs de couleurs subtilement différentes,
        est le pire cas pour PNG.
      </p>

      <h2>WebP : le format web moderne</h2>
      <p>
        WebP a été introduit par Google en 2010, dérivé du codec vidéo VP8. Il prend en charge les modes
        de compression avec et sans perte, ainsi que l'animation et la transparence dans les deux modes.
        Le mode avec perte utilise une approche par blocs DCT similaire à JPEG, mais avec des techniques
        de prédiction et un codage entropique plus sophistiqués, atteignant généralement des fichiers
        25 à 35 % plus petits que JPEG à qualité visuelle équivalente. Le mode sans perte est 15 à 25 %
        plus efficace que PNG pour la plupart des contenus.
      </p>
      <p>
        La prise en charge par les navigateurs est maintenant essentiellement universelle — tous les
        navigateurs majeurs supportent WebP depuis 2020. La principale lacune restante concerne les
        logiciels anciens : certains éditeurs d'images plus anciens et visionneuses d'images du système
        d'exploitation ne gèrent pas WebP nativement. Pour la livraison web, WebP est la valeur par
        défaut moderne évidente qui remplace à la fois JPEG et PNG dans la plupart des cas.
      </p>

      <h2>AVIF : la nouvelle génération</h2>
      <p>
        AVIF (AV1 Image File Format) est basé sur des images clés du codec vidéo AV1, développé par
        l'Alliance for Open Media et publié en 2018. Les techniques de compression d'AV1 sont
        significativement plus sophistiquées que celles sous-jacentes à JPEG ou WebP : blocs de
        prédiction plus larges et de taille variable, prédiction intra-frame plus sophistiquée,
        meilleure gestion du grain filmique et du bruit, et un codage entropique supérieur. Le résultat
        est typiquement des fichiers 40 à 50 % plus petits que JPEG à qualité équivalente — battant
        souvent WebP de 20 à 30 % également.
      </p>
      <p>
        AVIF prend en charge la pleine gamme HDR, les espaces colorimétriques élargis, la transparence,
        l'animation, et les profondeurs de couleur 8 et 10 bits. La prise en charge par les navigateurs
        a rapidement rattrapé son retard : Chrome (85+), Firefox (93+) et Safari (16+) supportent tous
        AVIF. Le principal inconvénient est la vitesse d'encodage — AVIF est nettement plus lent à
        encoder que JPEG ou WebP, ce qui importe pour les pipelines de traitement d'images en temps réel
        mais est sans importance pour les ressources statiques pré-compressées.
      </p>

      <h2>Comparaison de tailles de fichier pour la même image</h2>
      <p>
        Pour rendre les différences concrètes, voici une comparaison représentative pour une photographie
        1920×1080 à qualité visuelle perçue comparable :
      </p>
      <ul>
        <li>
          <strong>PNG (sans perte)</strong> — 4,2 Mo. Reproduction parfaite, sans artefacts. Approprié pour un master source ou quand la précision pixel est requise.
        </li>
        <li>
          <strong>JPEG (qualité 85)</strong> — 380 Ko. Artefacts minimaux à la taille d'écran. Le standard pour la livraison photographique web depuis trente ans.
        </li>
        <li>
          <strong>WebP (avec perte, qualité équivalente)</strong> — 270 Ko. Environ 30 % plus petit que JPEG, visuellement comparable. Une mise à niveau évidente pour la plupart des projets web.
        </li>
        <li>
          <strong>AVIF (qualité équivalente)</strong> — 180 Ko. Environ 50 % plus petit que JPEG, visuellement comparable voire meilleur. La meilleure taille de fichier disponible aujourd'hui pour les contenus photographiques.
        </li>
      </ul>
      <p>
        Ce sont des chiffres représentatifs ; les ratios réels varient selon le contenu de l'image.
        Les photographies à fort détail et fort bruit bénéficient moins des nouveaux codecs que les
        images lisses et peu bruyantes.
      </p>

      <h2>Quand utiliser chaque format</h2>
      <ul>
        <li>
          <strong>Photographies sur le web</strong> — Utilisez WebP avec un fallback JPEG via l'élément HTML{" "}
          <code>&lt;picture&gt;</code>. Si votre pipeline de build prend en charge l'encodage AVIF,
          servez AVIF avec des fallbacks WebP et JPEG.
        </li>
        <li>
          <strong>Logos, icônes, éléments UI avec transparence</strong> — WebP (sans perte) ou PNG.
          JPEG ne peut pas représenter la transparence du tout.
        </li>
        <li>
          <strong>Captures d'écran et enregistrements d'écran</strong> — PNG pour tout ce qui nécessite
          une reproduction pixel parfaite. WebP sans perte comme alternative plus légère quand la
          fidélité exacte n'est pas critique.
        </li>
        <li>
          <strong>Illustrations aux aplats et contours nets</strong> — PNG ou WebP sans perte. JPEG
          introduira des artefacts de sonnerie visibles autour des contours durs même à des paramètres
          de qualité élevés.
        </li>
        <li>
          <strong>Impression et archivage</strong> — PNG (sans perte) ou TIFF. Les formats avec perte
          sont inappropriés pour les ressources sources qui seront re-éditées.
        </li>
        <li>
          <strong>E-mail</strong> — JPEG ou PNG. Les clients de messagerie ont une prise en charge
          inégale de WebP et pratiquement nulle pour AVIF. Privilégiez la compatibilité à
          l'optimisation ici.
        </li>
      </ul>

      <h2>Impact sur les Core Web Vitals et les performances de page</h2>
      <p>
        Le Largest Contentful Paint (LCP) — l'un des Core Web Vitals de Google — mesure le temps
        nécessaire au plus grand élément de contenu visible (souvent une image hero) pour se charger.
        Le choix du format d'image affecte directement le LCP : une image hero AVIF se charge plus
        rapidement que le JPEG équivalent, et un LCP plus rapide améliore à la fois l'expérience
        utilisateur et le classement dans les moteurs de recherche.
      </p>
      <p>
        L'effet cumulatif compte aussi. Une page avec 20 images de produits, chacune inutilement
        sauvegardée en PNG au lieu de WebP, peut être 5 à 10 Mo plus lourde que nécessaire. Sur les
        connexions mobiles, c'est la différence entre une page qui se charge en 2 secondes et une
        qui se charge en 8 secondes.
      </p>

      <h2>Servir différents formats à différents navigateurs</h2>
      <p>
        L'élément HTML <code>&lt;picture&gt;</code> et ses enfants <code>&lt;source&gt;</code> vous
        permettent de servir le meilleur format pris en charge par chaque navigateur sans JavaScript :
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero image" />
</picture>`}
      </pre>
      <p>
        Le navigateur choisit le premier <code>&lt;source&gt;</code> qu'il prend en charge. Les navigateurs
        avec support AVIF téléchargent le fichier le plus petit ; ceux sans AVIF passent à WebP ou JPEG.
        La balise <code>&lt;img&gt;</code>{" "}
        en bas sert de fallback universel et est le seul élément qui requiert l'attribut{" "}
        <code>alt</code>.
      </p>
      <p>
        Pour convertir vos images existantes en WebP ou AVIF pour ce type de configuration multi-format,
        le{" "}
        <a href="/tools/image-converter">Convertisseur d'images BrowseryTools</a> gère les conversions
        par lots sans uploader quoi que ce soit vers un serveur — vos fichiers sources restent sur votre
        appareil.
      </p>

      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Guide de décision rapide :</strong> Si vous avez besoin d'une compatibilité maximale,
        utilisez JPEG pour les photos et PNG pour les graphiques. Si vous optimisez pour les performances
        web, utilisez WebP comme base et ajoutez AVIF comme amélioration. Si vous construisez un nouveau
        projet avec une stack moderne, servez AVIF avec un fallback WebP et ne vous préoccupez plus du
        JPEG.
      </div>
      <ToolCTA slug="image-converter" variant="card" />
    </div>
  );
}
