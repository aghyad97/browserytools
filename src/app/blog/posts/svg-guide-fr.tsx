import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        SVG est l'une de ces technologies qui semblent simples de l'extérieur — c'est juste un format
        graphique, non ? — mais qui récompensent un apprentissage approfondi plus que presque tout autre
        format dans la boîte à outils d'un développeur ou d'un designer. Les fichiers SVG s'adaptent
        infiniment sans aucune perte de qualité, pèsent presque rien pour les graphiques simples, peuvent
        être mis en style avec CSS, animés avec JavaScript ou les transitions CSS, et intégrés directement
        dans du HTML. Bien comprendre SVG change la façon dont vous pensez aux graphiques sur le web.
      </p>
      <ToolCTA slug="svg" variant="inline" />
      <p>
        Vous pouvez visualiser, inspecter et optimiser n'importe quel fichier SVG grâce à l'outil{" "}
        <a href="/tools/svg">SVG BrowseryTools</a> — gratuit, sans inscription, tout s'exécute dans
        votre navigateur.
      </p>

      <h2>Qu'est-ce que SVG ?</h2>
      <p>
        SVG signifie Scalable Vector Graphics (graphiques vectoriels évolutifs). Contrairement à JPEG,
        PNG ou WebP — qui stockent les images sous forme de grilles de pixels colorés (images matricielles)
        — SVG stocke les images sous forme de descriptions mathématiques de formes. Un cercle est décrit
        par un point central et un rayon. Un tracé est décrit par une séquence de commandes de dessin :
        aller à ce point, tracer une ligne jusqu'à ce point, tracer une courbe à travers ces points de
        contrôle, fermer le tracé.
      </p>
      <p>
        SVG est un format basé sur XML, ce qui signifie que chaque fichier SVG est du texte brut,
        lisible par un humain, et structuré comme un arbre d'éléments imbriqués. Ouvrez n'importe quel
        SVG dans un éditeur de texte et vous voyez du balisage lisible, pas un blob binaire. Cela a des
        conséquences pratiques significatives : les fichiers SVG peuvent être générés par programmation,
        modifiés avec des outils de traitement de texte, différenciés dans le contrôle de version, et
        intégrés directement dans HTML sans aucun traitement supplémentaire.
      </p>
      <p>
        Le format est un standard du W3C, maintenu aux côtés de HTML et CSS. Chaque navigateur moderne
        possède un moteur de rendu SVG complet intégré.
      </p>

      <h2>Pourquoi SVG surpasse le matriciel pour les icônes et illustrations</h2>
      <p>
        L'avantage décisif de SVG sur les formats matriciels pour les icônes, logos et illustrations
        est l'indépendance à la résolution. Une icône matricielle créée à 32×32 pixels sera floue sur
        un écran Retina, qui affiche à 2× ou 3× les pixels physiques par pixel CSS. Pour y remédier,
        vous devez soit exporter plusieurs variantes de résolution (@1x, @2x, @3x), augmenter la
        résolution source (fichiers plus volumineux, plus de mémoire), soit utiliser image-set en CSS
        pour servir la bonne résolution. Avec SVG, vous créez le graphique une fois et il est parfait
        à toutes les tailles, sur tous les écrans, pour toujours.
      </p>
      <p>
        La taille de fichier est l'autre avantage majeur pour les graphiques simples. Une icône simple —
        une coche, une flèche, un menu hamburger — peut être décrite dans un fichier SVG de 200 à 500
        octets. Le PNG équivalent en 2× Retina peut peser 2 à 5 Ko. En 3×, encore plus. Quand une
        interface compte 50 icônes, la différence entre 50 SVG optimisés (totalisant ~20 Ko) et 50
        ensembles PNG (totalisant ~300 Ko ou plus) est significative.
      </p>
      <p>
        Les images matricielles l'emportent pour les contenus photographiques et les illustrations très
        détaillées avec des dégradés lisses et des textures. Un SVG vectoriel d'une photographie serait
        énorme et semblerait stylisé plutôt que photographique. Le bon format dépend entièrement de la
        nature du contenu.
      </p>

      <h2>Anatomie SVG : les éléments fondamentaux</h2>
      <p>
        Un fichier SVG minimal a cette structure :
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
{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
  <path d="M8 12 L12 16 L16 8" stroke="white" stroke-width="2" fill="none" />
</svg>`}
      </pre>
      <p>
        Les éléments et attributs clés à comprendre :
      </p>
      <ul>
        <li>
          <strong>viewBox</strong> — Définit le système de coordonnées interne. <code>viewBox="0 0 24 24"</code>{" "}
          signifie que l'espace de dessin s'étend de (0,0) à (24,24). Le SVG peut ensuite être rendu
          à n'importe quelle taille réelle — 16×16, 32×32, 200×200 — et le navigateur adapte le système
          de coordonnées en conséquence. C'est le mécanisme derrière l'indépendance à la résolution.
        </li>
        <li>
          <strong>path</strong> — L'élément SVG le plus puissant. Un attribut <code>d</code> contient
          des commandes de dessin : <code>M</code> (déplacer vers), <code>L</code> (ligne vers),{" "}
          <code>C</code> (courbe de Bézier cubique), <code>A</code> (arc), <code>Z</code> (fermer le
          tracé). Presque toute forme peut être exprimée comme un tracé.
        </li>
        <li>
          <strong>circle, rect, ellipse, line, polygon</strong> — Éléments pratiques pour les formes
          courantes. Un <code>&lt;circle&gt;</code> prend <code>cx</code>, <code>cy</code> et{" "}
          <code>r</code>. Un <code>&lt;rect&gt;</code> prend <code>x</code>, <code>y</code>,{" "}
          <code>width</code> et <code>height</code>, plus <code>rx</code> optionnel pour les coins
          arrondis.
        </li>
        <li>
          <strong>text</strong> — SVG peut rendre du texte typographique qui s'adapte à l'image et reste
          sélectionnable et accessible, contrairement au texte intégré dans une image matricielle.
        </li>
        <li>
          <strong>g (groupe)</strong> — Regroupe les éléments enfants pour qu'on puisse appliquer des
          transformations, styles et opacités à l'ensemble du groupe d'un coup.
        </li>
        <li>
          <strong>defs et use</strong> — Définissez des éléments réutilisables une fois et référencez-les
          plusieurs fois avec <code>&lt;use&gt;</code>. Indispensable pour les systèmes d'icônes qui
          utilisent un seul sprite SVG.
        </li>
      </ul>

      <h2>Styliser SVG avec CSS et l'animer</h2>
      <p>
        Les éléments SVG font partie du DOM quand SVG est intégré dans HTML. Cela signifie que CSS peut
        les cibler directement en utilisant les mêmes sélecteurs que pour les éléments HTML. Vous pouvez
        modifier les couleurs de remplissage, les épaisseurs de contour et l'opacité au survol, en mode
        sombre ou en réponse à tout changement d'état :
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
{`/* Target SVG elements with CSS */
.icon-check circle {
  fill: #22c55e;
  transition: fill 0.2s ease;
}

.icon-check:hover circle {
  fill: #16a34a;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .icon-check circle { fill: #4ade80; }
}`}
      </pre>
      <p>
        Les animations et transitions CSS fonctionnent sur les propriétés SVG. L'astuce{" "}
        <code>stroke-dasharray</code> et{" "}
        <code>stroke-dashoffset</code> — animer un tracé de invisible à visible en manipulant la quantité
        de tirets affichée — crée l'effet de « dessin » visible sur de nombreux indicateurs de chargement
        et illustrations d'onboarding. SVG possède également ses propres éléments{" "}
        <code>&lt;animate&gt;</code> et{" "}
        <code>&lt;animateTransform&gt;</code> (animation SMIL), bien que l'animation CSS et JavaScript
        soit généralement préférée pour la maintenabilité.
      </p>
      <p>
        Utiliser <code>currentColor</code> comme valeur de remplissage fait hériter à une icône SVG la
        couleur du texte de son élément parent automatiquement, permettant à une seule icône de s'adapter
        à n'importe quel contexte de couleur sans modification.
      </p>

      <h2>Optimisation SVG avec SVGO</h2>
      <p>
        Les fichiers SVG exportés depuis des outils de design comme Figma ou Illustrator contiennent
        beaucoup de surplus inutile : métadonnées de l'éditeur, attributs redondants, groupes sans effet,
        coordonnées en virgule flottante avec huit décimales, attributs <code>id</code> générés par le
        système de nœuds interne de l'outil. Pour une icône simple, cette surcharge peut tripler ou
        quadrupler la taille du fichier par rapport à une version optimisée à la main.
      </p>
      <p>
        SVGO (SVG Optimizer) est l'outil standard pour supprimer ce surplus. Il applique un ensemble
        configurable de transformations : effondrement des groupes imbriqués, suppression des éléments
        invisibles, arrondi des coordonnées à une précision raisonnable, fusion des tracés redondants,
        suppression des métadonnées et commentaires, et plus encore. Une passe SVGO typique réduit la
        taille des fichiers SVG d'icônes de 30 à 60 % sans aucun changement visuel.
      </p>
      <p>
        L'outil{" "}
        <a href="/tools/svg">SVG BrowseryTools</a> applique l'optimisation SVG dans votre navigateur,
        vous donnant le résultat optimisé sans avoir à installer d'outils en ligne de commande.
      </p>

      <h2>SVG intégré vs fichier externe vs arrière-plan CSS</h2>
      <p>
        Il existe trois façons principales d'inclure un SVG dans une page web, chacune avec ses
        compromis :
      </p>
      <ul>
        <li>
          <strong>SVG intégré</strong> — Le balisage SVG est intégré directement dans le HTML. Donne un accès CSS et JavaScript complet à chaque élément à l'intérieur du SVG. Idéal pour les icônes nécessitant des effets de survol, des changements de couleur ou des animations. Ne peut pas être mis en cache séparément par le navigateur.
        </li>
        <li>
          <strong>Fichier SVG externe via <code>&lt;img&gt;</code></strong> — Le SVG est un fichier séparé référencé avec <code>&lt;img src="icon.svg"&gt;</code>. Le navigateur peut mettre le fichier en cache. Simple à utiliser. Mais CSS de la page parente ne peut pas accéder à l'intérieur du SVG, et JavaScript ne peut pas manipuler son contenu.
        </li>
        <li>
          <strong>background-image CSS</strong> — Le SVG est référencé comme arrière-plan CSS. Fonctionne pour les graphiques purement décoratifs. Le SVG peut également être intégré sous forme d'URI de données en CSS, utile pour les petites icônes dans les feuilles de style de composants. CSS ne peut pas restyliser les éléments à l'intérieur du SVG.
        </li>
      </ul>
      <p>
        Les feuilles de sprites SVG — un seul fichier SVG contenant toutes les icônes définies dans des
        blocs <code>&lt;defs&gt;</code>, référencées avec{" "}
        <code>&lt;use href="sprite.svg#icon-name"&gt;</code> — offrent un bon équilibre : une seule
        requête réseau mise en cache pour toutes les icônes, avec une manipulation DOM par icône possible
        dans la plupart des navigateurs modernes.
      </p>

      <h2>Pièges courants : XSS via SVG</h2>
      <p>
        SVG prend en charge les scripts intégrés, les gestionnaires d'événements et les références à
        des ressources externes, ce qui en fait un vecteur d'attaque viable pour le cross-site scripting
        (XSS) si des fichiers SVG téléversés par des utilisateurs sont affichés dans un contexte
        navigateur. Un fichier SVG contenant{" "}
        <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> exécutera ce script si le
        navigateur rend le SVG dans le cadre d'une page.
      </p>
      <p>
        Les règles pour gérer en toute sécurité les SVG téléversés par des utilisateurs :
      </p>
      <ul>
        <li>
          N'intégrez jamais directement dans votre HTML un SVG téléversé par un utilisateur. Intégrez uniquement les SVG que vous contrôlez.
        </li>
        <li>
          Si vous devez afficher des SVG téléversés par des utilisateurs, servez-les depuis une origine séparée et sandboxisée et affichez-les dans une balise <code>&lt;img&gt;</code> ou dans un <code>&lt;iframe&gt;</code> sandboxisé. La balise <code>&lt;img&gt;</code> n'exécute pas les scripts dans le SVG.
        </li>
        <li>
          Nettoyez les SVG téléversés par des utilisateurs en les passant par un outil de nettoyage (DOMPurify avec la configuration SVG) avant de les stocker ou de les afficher.
        </li>
        <li>
          Définissez l'en-tête Content Security Policy pour restreindre les sources de scripts sur les pages qui affichent des SVG.
        </li>
      </ul>

      <h2>Convertir SVG en PNG</h2>
      <p>
        Certains contextes ne prennent pas en charge SVG : les anciens clients de messagerie, certaines
        plateformes CMS, certains pipelines de traitement d'images, les exigences d'icônes d'applications
        pour iOS et Android, et les images de prévisualisation Open Graph. Dans ces cas, vous devez
        exporter le SVG sous forme de PNG rastérisé.
      </p>
      <p>
        Comme SVG se redimensionne sans perte, vous pouvez exporter en PNG à n'importe quelle taille.
        Pour les icônes d'applications, cela signifie exporter une source SVG unique à 1024×1024 et en
        dériver toutes les tailles plus petites. Pour l'usage web Retina, exportez à 2× ou 3× la taille
        d'affichage CSS.
      </p>
      <p>
        L'outil{" "}
        <a href="/tools/svg">SVG BrowseryTools</a> peut rendre un SVG en PNG à la résolution de votre
        choix, gérant la conversion dans le navigateur sans aucun upload vers un serveur. Utile quand
        vous avez un SVG depuis un outil de design et que vous avez besoin d'un PNG pour un contexte
        qui n'accepte pas SVG.
      </p>

      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Référence rapide :</strong> Utilisez SVG pour les icônes, logos, illustrations, éléments
        d'interface et tout ce qui doit s'adapter. Utilisez PNG (converti depuis SVG) pour les contextes
        qui nécessitent des images matricielles. Passez toujours les fichiers SVG par SVGO avant de les
        déployer. N'intégrez jamais directement dans votre HTML des SVG téléversés par des utilisateurs.
        Utilisez <code>currentColor</code> pour les icônes devant s'adapter à la couleur de texte de
        leur contexte.
      </div>
      <ToolCTA slug="svg" variant="card" />
    </div>
  );
}
