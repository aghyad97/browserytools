export default function Content() {
  return (
    <div>
      <p>
        Les dégradés CSS sont l'un des outils les plus puissants et les plus sous-utilisés de la boîte à outils du développeur front-end. Ils
        vous permettent de créer des transitions de couleurs fluides, des arrière-plans spectaculaires, une finition d'interface subtile et même des motifs
        visuels complexes — le tout sans le moindre fichier image. Avant que les dégradés CSS ne soient universellement pris en charge, les designers
        devaient exporter des arrière-plans en dégradé sous forme de PNG depuis Photoshop, ce qui entraînait des requêtes HTTP supplémentaires, des ressources
        statiques rigides et des mises en page qui se cassaient dès que quelqu'un changeait les couleurs de la marque. Aujourd'hui, une seule ligne
        de CSS remplace tout cela.
      </p>
      <p>
        Ce guide couvre tout ce que vous devez savoir sur les dégradés CSS — les trois types, le système d'angles,
        des cas d'usage concrets avec du code prêt à copier, les erreurs courantes et comment utiliser le{" "}
        <a href="/tools/css-gradient">Générateur de dégradés CSS de BrowseryTools</a> pour construire exactement ce dont vous avez besoin
        sans écrire une seule ligne à partir de zéro.
      </p>

      <h2>Pourquoi les dégradés CSS ont remplacé les arrière-plans basés sur des images</h2>
      <p>
        L'ancienne approche — exporter un PNG de dégradé de 1×1000 px et le répéter horizontalement — avait de réels coûts.
        Chaque dégradé était un aller-retour vers le serveur, un coût d'octets transmis et une charge de maintenance lorsque les
        couleurs changeaient. Plus important encore, les dégradés PNG ne pouvaient pas répondre dynamiquement aux tailles d'écran, aux changements
        de thème ou aux états de survol.
      </p>
      <p>
        Les dégradés CSS résolvent tout cela. Ils sont rendus par le GPU en temps réel, répondent instantanément aux
        changements d'état JavaScript, s'adaptent parfaitement à n'importe quelle résolution, fonctionnent avec les transitions et animations CSS,
        et n'ajoutent aucun octet à votre ensemble de ressources. La prise en charge par les navigateurs est désormais de 100 % sur tous les navigateurs modernes et
        ce, depuis 2014. Il n'y a aucune raison d'utiliser des dégradés basés sur des images pour des transitions de couleurs unies
        dans les nouveaux projets.
      </p>

      <h2>Les trois types de dégradés CSS</h2>

      <h3>1. Le dégradé linéaire</h3>
      <p>
        Un dégradé linéaire fait transitionner les couleurs le long d'une ligne droite. La direction peut être n'importe quel angle, ou
        exprimée par un mot-clé comme <code>to right</code> ou <code>to bottom right</code>. C'est le type de dégradé le plus
        couramment utilisé et il couvre la grande majorité des besoins de design.
      </p>
      <pre><code>{`/* Classic diagonal purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Top to bottom (default direction) */
background: linear-gradient(#f8fafc, #e2e8f0);

/* Left to right with three color stops */
background: linear-gradient(to right, #f97316, #ec4899, #8b5cf6);`}</code></pre>

      <h3>2. Le dégradé radial</h3>
      <p>
        Un dégradé radial rayonne vers l'extérieur depuis un point central. Par défaut, il forme une ellipse qui s'adapte
        à la zone de délimitation de l'élément, mais vous pouvez contrôler la forme, la taille et la position. Les dégradés radiaux
        sont idéaux pour les effets de projecteur, les boutons lumineux et les simulations de lumière d'ambiance.
      </p>
      <pre><code>{`/* Circular glow from center */
background: radial-gradient(circle, #6366f1 0%, #1e1b4b 100%);

/* Ellipse glow at top-left corner */
background: radial-gradient(ellipse at top left, #fbbf24 0%, transparent 60%);

/* Positioned spotlight */
background: radial-gradient(circle at 30% 40%, #e0f2fe, #0284c7);`}</code></pre>

      <h3>3. Le dégradé conique</h3>
      <p>
        Un dégradé conique balaie les couleurs autour d'un point central, comme les aiguilles d'une horloge. Cela le rend
        particulièrement adapté aux camemberts, aux roues chromatiques et aux animations d'indicateurs de chargement. C'était le dernier des
        trois types de dégradés à obtenir une prise en charge universelle, arrivant dans tous les principaux navigateurs en 2021.
      </p>
      <pre><code>{`/* Pie chart with three segments */
background: conic-gradient(
  #6366f1 0deg 120deg,
  #ec4899 120deg 240deg,
  #f97316 240deg 360deg
);

/* Color wheel */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);`}</code></pre>

      <h2>Comprendre le système d'angles pour les dégradés linéaires</h2>
      <p>
        Le paramètre d'angle dans <code>linear-gradient</code> suit une convention qui surprend de nombreux développeurs
        car elle diffère des angles mathématiques standard. Voici la correspondance :
      </p>
      <ul>
        <li><strong>0deg</strong> — du bas vers le haut (le dégradé monte vers le haut)</li>
        <li><strong>90deg</strong> — de gauche à droite (le dégradé horizontal le plus courant)</li>
        <li><strong>135deg</strong> — diagonale, du coin supérieur gauche au coin inférieur droit</li>
        <li><strong>180deg</strong> — de haut en bas (identique à la valeur par défaut sans angle spécifié)</li>
        <li><strong>225deg</strong> — diagonale, du coin inférieur droit au coin supérieur gauche</li>
        <li><strong>270deg</strong> — de droite à gauche</li>
      </ul>
      <p>
        Les équivalents en mots-clés — <code>to top</code>, <code>to right</code>, <code>to bottom left</code> — sont
        souvent plus lisibles que les angles numériques pour les directions courantes. Pour des effets diagonaux précis, les degrés
        numériques vous donnent un contrôle exact. Le populaire dégradé diagonal violet-vers-indigo utilise{" "}
        <code>135deg</code> :
      </p>
      <pre><code>{`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`}</code></pre>

      <h2>Formes des dégradés radiaux : cercle ou ellipse</h2>
      <p>
        Par défaut, <code>radial-gradient</code> produit une ellipse dimensionnée pour s'adapter à l'élément. Vous pouvez la remplacer
        par deux mots-clés de forme :
      </p>
      <ul>
        <li>
          <strong>circle</strong> — force un cercle parfait quel que soit le rapport d'aspect de l'élément. Utilisez ceci
          pour les effets lumineux et les arrière-plans en projecteur où vous voulez une atténuation radiale uniforme dans toutes les directions.
        </li>
        <li>
          <strong>ellipse</strong> — la valeur par défaut, s'étire pour s'adapter au conteneur. Utilisez ceci pour des remplissages
          d'arrière-plan subtils qui doivent s'adapter naturellement à n'importe quelle forme d'élément.
        </li>
      </ul>
      <p>
        Le mot-clé <code>at</code> vous permet de repositionner le centre du dégradé n'importe où dans l'élément en utilisant n'importe quelle
        longueur ou pourcentage CSS. <code>at center</code>, <code>at top left</code>, <code>at 20% 80%</code> — tous
        sont valides. Le positionnement est particulièrement puissant pour créer des effets de lumière d'ambiance décentrés :
      </p>
      <pre><code>{`/* Glow coming from upper-right corner */
background: radial-gradient(ellipse at top right, rgba(251,191,36,0.4), transparent 60%);

/* Multiple radial gradients layered */
background:
  radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%),
  #0f172a;`}</code></pre>

      <h2>Les dégradés coniques pour les camemberts et les indicateurs de chargement</h2>
      <p>
        La capacité du dégradé conique à balayer en cercle en fait la solution CSS native pour deux composants d'interface
        classiques qui nécessitaient auparavant du SVG ou du JavaScript :
      </p>
      <p>
        Pour un <strong>anneau de progression</strong>, combinez un dégradé conique avec un masque circulaire. Pour un camembert,
        les segments du dégradé conique correspondent directement aux pourcentages de données. Un segment s'étendant de
        <code>0deg</code> à <code>72deg</code> représente exactement 20 % d'un cercle complet. Cela rend la traduction
        des données en CSS simple — multipliez le pourcentage par 3,6 pour obtenir la valeur en degrés.
      </p>

      <h2>Dégradés à plusieurs arrêts et arrêts nets pour les motifs à rayures</h2>
      <p>
        Les arrêts de couleur n'ont pas à se fondre en douceur. Lorsque deux arrêts adjacents partagent la même position, la
        transition entre eux devient instantanée — un arrêt net. Cette technique est la façon de créer des motifs à rayures,
        des damiers et des arrière-plans à lignes réglées entièrement en CSS :
      </p>
      <pre><code>{`/* Candy stripe pattern using hard stops */
background: linear-gradient(
  45deg,
  #6366f1 25%,
  transparent 25%,
  transparent 50%,
  #6366f1 50%,
  #6366f1 75%,
  transparent 75%
);
background-size: 40px 40px;

/* Warning stripe — alternating color hard stops */
background: repeating-linear-gradient(
  -45deg,
  #fbbf24,
  #fbbf24 10px,
  #1e293b 10px,
  #1e293b 20px
);`}</code></pre>

      <h2>Cas d'usage concrets avec exemples de code</h2>

      <h3>Arrière-plans de sections héros</h3>
      <p>
        Un dégradé linéaire à plusieurs arrêts avec un maillage de deux reflets radiaux donne aux sections héros la profondeur d'une
        illustration personnalisée sans aucun fichier image :
      </p>
      <pre><code>{`.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15), transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
}`}</code></pre>

      <h3>Effets de survol des boutons</h3>
      <p>
        Les dégradés peuvent être animés au survol à l'aide de l'astuce de <code>background-position</code> — dimensionnez le dégradé
        à 200 % et décalez sa position au survol :
      </p>
      <pre><code>{`.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.4s ease;
}
.btn:hover {
  background-position: 100% 50%;
}`}</code></pre>

      <h3>Bordures de cartes avec border-image</h3>
      <p>
        La propriété <code>border-image</code> accepte un dégradé, ce qui permet des bordures en dégradé sans éléments
        d'enveloppe ni astuces de pseudo-éléments (pour les arrière-plans unis) :
      </p>
      <pre><code>{`.card-gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #6366f1, #ec4899) border-box;
}`}</code></pre>

      <h3>Barres de progression</h3>
      <p>
        Une barre de progression en dégradé communique à la fois la valeur et l'énergie visuelle. Associez-la à une
        transition de <code>width</code> pour une animation fluide :
      </p>
      <pre><code>{`.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  width: 73%; /* Controlled by JS or CSS custom property */
  transition: width 0.6s ease;
}`}</code></pre>

      <h2>Comparaison des types de dégradés</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Type de dégradé</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Fonction CSS</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Meilleur cas d'usage</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Exemple</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linéaire</strong></td>
              <td style={{padding: "12px 16px"}}><code>linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Arrière-plans de héros, boutons, bannières</td>
              <td style={{padding: "12px 16px"}}><code>135deg, #667eea, #764ba2</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Radial</strong></td>
              <td style={{padding: "12px 16px"}}><code>radial-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Lueurs, projecteurs, lumière d'ambiance</td>
              <td style={{padding: "12px 16px"}}><code>circle at center, #6366f1, #1e1b4b</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Conique</strong></td>
              <td style={{padding: "12px 16px"}}><code>conic-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Camemberts, roues chromatiques, indicateurs de chargement</td>
              <td style={{padding: "12px 16px"}}><code>#6366f1 0deg 120deg, #ec4899 120deg 240deg</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linéaire répété</strong></td>
              <td style={{padding: "12px 16px"}}><code>repeating-linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Motifs à rayures, lignes réglées</td>
              <td style={{padding: "12px 16px"}}><code>-45deg, #fbbf24 0 10px, #1e293b 10px 20px</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Conseils pour choisir de bonnes couleurs de dégradé</h2>
      <p>
        L'erreur la plus courante lors du choix des couleurs de dégradé est de traverser directement la roue chromatique — par
        exemple, fondre directement du rouge au vert. Comme le point médian de cette transition passe par
        un gris-brun boueux, le résultat semble peu attrayant même si les couleurs aux extrémités sont attrayantes
        individuellement.
      </p>
      <p>
        La solution est de passer par une teinte intermédiaire plus saturée. Au lieu du rouge-vers-vert directement,
        essayez rouge → orange → jaune-vert pour une transition vibrante. Vous pouvez aussi rester dans une plage adjacente
        de teintes — la famille violet-vers-rose, la famille indigo-vers-cyan — qui produisent toujours des résultats
        nets car le point médian reste saturé.
      </p>
      <p>
        Quelques recommandations pratiques :
      </p>
      <ul>
        <li>Maintenez une saturation élevée aux deux extrémités si vous voulez un dégradé vif. Fondre une couleur saturée dans une couleur désaturée crée une zone morte gênante au milieu.</li>
        <li>Fondre différentes valeurs de luminosité (clair vers foncé) au sein de la même famille de teintes paraît presque toujours professionnel et fonctionne bien dans les arrière-plans d'interface.</li>
        <li>Ajoutez un arrêt de couleur intermédiaire à 50 % pour orienter la teinte du point médian — c'est la correction la plus puissante pour les dégradés boueux.</li>
        <li>Limitez les dégradés à deux ou trois arrêts pour la plupart des travaux d'interface. Plus de trois arrêts paraît généralement chaotique, sauf si vous créez intentionnellement un arc-en-ciel ou une visualisation de données.</li>
      </ul>

      <h2>Accessibilité : du texte sur des dégradés</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Avertissement sur l'accessibilité :</strong> ne placez jamais de texte sur un arrière-plan en dégradé sans vérifier
        le contraste en chaque point du dégradé. Un dégradé qui offre un contraste de 7:1 à l'extrémité sombre
        peut tomber à 1,5:1 à l'extrémité claire, rendant le texte illisible pour les utilisateurs malvoyants. Le WCAG AA
        exige un rapport de contraste minimal de 4,5:1 pour le texte normal. Utilisez soit une superposition sombre, soit limitez
        le texte à la portion à fort contraste du dégradé, soit choisissez une plage de dégradé qui maintient un
        contraste suffisant sur toute son étendue.
      </div>

      <h2>Utiliser le Générateur de dégradés CSS de BrowseryTools</h2>
      <p>
        Le <a href="/tools/css-gradient">Générateur de dégradés CSS</a> vous donne un aperçu visuel en direct à mesure que vous
        configurez chaque paramètre. Voici comment l'utiliser efficacement :
      </p>
      <ul>
        <li><strong>Choisissez le type de dégradé :</strong> basculez entre Linéaire, Radial et Conique en haut de l'outil.</li>
        <li><strong>Ajoutez des arrêts de couleur :</strong> cliquez sur la barre de dégradé pour ajouter de nouveaux arrêts. Faites glisser les arrêts vers la gauche et la droite pour ajuster leurs positions. Cliquez sur un arrêt pour ouvrir le sélecteur de couleur et changer sa couleur et son opacité.</li>
        <li><strong>Ajustez la direction ou l'angle :</strong> pour les dégradés linéaires, faites glisser la roue d'angle ou tapez une valeur précise en degrés. Pour les dégradés radiaux, définissez la forme et la position.</li>
        <li><strong>Prévisualisez en contexte :</strong> l'aperçu en direct se met à jour instantanément. Vous pouvez voir exactement à quoi ressemblera votre dégradé avant de copier la moindre ligne.</li>
        <li><strong>Copiez le CSS :</strong> cliquez sur le bouton Copier le CSS pour obtenir du CSS prêt pour la production pour la propriété <code>background</code>, prêt à être collé dans n'importe quelle feuille de style ou framework.</li>
      </ul>
      <p>
        Tout s'exécute dans votre navigateur. Aucune définition de dégradé n'est envoyée où que ce soit — c'est un outil purement
        côté client. Vous pouvez l'utiliser hors ligne une fois la page chargée.
      </p>

      <h2>Prise en charge par les navigateurs</h2>
      <p>
        Les dégradés CSS sont pris en charge par tous les principaux navigateurs depuis 2014, ce qui les rend sûrs à utiliser sans
        aucun polyfill ni solution de repli dans pratiquement tous les environnements de production. Les dégradés coniques sont arrivés plus tard
        mais sont désormais entièrement pris en charge dans Chrome 69+, Firefox 83+, Safari 12.1+ et Edge 79+ — couvrant bien
        plus de 97 % de l'utilisation mondiale des navigateurs en 2026. Le seul scénario où vous pourriez avoir besoin d'une solution de repli est
        la prise en charge de très anciennes versions d'Android WebView dans les applications mobiles d'entreprise.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Construisez n'importe quel dégradé visuellement — sans code
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Aperçu en direct, CSS prêt à copier et contrôle total sur les arrêts, les angles et les positions.
          S'exécute entièrement dans votre navigateur, sans aucune donnée envoyée à un serveur.
        </p>
        <a
          href="/tools/css-gradient"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Ouvrir le Générateur de dégradés CSS →
        </a>
      </div>
    </div>
  );
}
