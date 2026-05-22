export default function Content() {
  return (
    <div>
      <p>
        Chaque fois que vous plissez les yeux devant un site web parce que le texte est trop clair, ou
        que vous peinez à lire un libellé de bouton parce qu'il se fond dans l'arrière-plan, vous êtes
        confronté à un problème de contraste. Pour la plupart des gens, c'est une légère gêne. Pour
        une part non négligeable de la population — personnes souffrant de déficiences de la vision des
        couleurs, de malvoyance, de presbytie, ou simplement exposées à un écran en plein soleil — cela
        rend le contenu véritablement inaccessible. Le contraste des couleurs est l'un des aspects de
        l'accessibilité web les plus impactants et les plus souvent enfreints, et c'est aussi l'un des
        plus faciles à corriger une fois les règles comprises. Ce guide explique la norme, la formule
        mathématique, les erreurs courantes et comment utiliser le{" "}
        <a href="/tools/contrast-checker">Vérificateur de contraste des couleurs BrowseryTools</a> pour
        vérifier instantanément n'importe quelle paire de couleurs dans votre navigateur.
      </p>

      <h2>Pourquoi le contraste est important</h2>
      <p>
        L'ampleur de la population concernée est bien plus grande que la plupart des designers ne
        l'imaginent. Selon l'Organisation mondiale de la santé, environ 2,2 milliards de personnes dans
        le monde souffrent d'une forme ou d'une autre de déficience visuelle. La dyschromatopsie —
        communément appelée daltonisme — touche environ 8 % des hommes et 0,5 % des femmes d'ascendance
        nord-européenne, ce qui représente quelque 300 millions de personnes dans le monde ayant des
        difficultés à distinguer certaines couleurs.
      </p>
      <p>
        Au-delà des conditions permanentes, le contraste affecte tout le monde de manière situationnelle :
      </p>
      <ul>
        <li>Lire un téléphone en plein soleil efface entièrement un texte à faible contraste.</li>
        <li>Les anciens moniteurs ou ceux d'entrée de gamme ont une luminosité réduite et une précision des couleurs moins bonne.</li>
        <li>Les personnes souffrant de migraine ou de photosensibilité utilisent souvent des affichages à luminosité réduite.</li>
        <li>Les reflets de fenêtres ou de lumières au plafond réduisent effectivement le contraste perçu.</li>
        <li>Les utilisateurs pressés — c'est-à-dire à peu près tout le monde — traitent les contenus à fort contraste plus rapidement.</li>
      </ul>
      <p>
        Un bon contraste n'est pas une adaptation de niche. Il améliore l'expérience de chaque utilisateur,
        sur chaque appareil, dans chaque condition d'éclairage.
      </p>

      <h2>Qu'est-ce que le rapport de contraste ?</h2>
      <p>
        Le rapport de contraste est un nombre normalisé qui exprime à quel point deux couleurs diffèrent en
        termes de luminosité relative (luminance). Il est toujours exprimé sous forme de rapport : la couleur
        la plus claire divisée par la plus sombre, en ajoutant 0,05 à chacune pour éviter la division par zéro
        et tenir compte de la lumière ambiante dans les affichages réels.
      </p>
      <p>
        La plage va de <strong>1:1</strong> (deux couleurs identiques — zéro contraste, totalement illisible)
        à <strong>21:1</strong> (noir pur sur blanc pur — le contraste maximal possible). Plus le rapport est
        élevé, plus les deux couleurs sont distinctes.
      </p>

      <h2>Comment le rapport de contraste est calculé</h2>
      <p>
        La formule utilisée par les WCAG (et l'ensemble de l'écosystème des standards web) repose sur le
        concept de luminance relative — une mesure de la quantité de lumière qu'une couleur semble émettre,
        ajustée à la perception visuelle humaine. Le calcul s'effectue en deux étapes.
      </p>
      <p>
        <strong>Étape 1 : calculer la luminance relative (L) pour chaque couleur.</strong>
      </p>
      <p>
        Tout d'abord, convertissez chaque canal RVB de la plage 0–255 vers une échelle linéaire 0–1, puis
        appliquez une formule d'expansion gamma pour tenir compte de la façon dont les affichages encodent
        la luminosité :
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`// Pour chaque valeur de canal c dans [0, 1] :
if c <= 0.04045:
    c_linear = c / 12.92
else:
    c_linear = ((c + 0.055) / 1.055) ^ 2.4

L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}
      </pre>
      <p>
        Les coefficients 0,2126, 0,7152 et 0,0722 reflètent la sensibilité aux couleurs de l'être humain :
        nos yeux sont les plus sensibles au vert, modérément sensibles au rouge, et les moins sensibles au bleu.
      </p>
      <p>
        <strong>Étape 2 : calculer le rapport de contraste.</strong>
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`Rapport de contraste = (L_clair + 0.05) / (L_sombre + 0.05)`}
      </pre>
      <p>
        Où <code>L_clair</code> est la luminance relative de la couleur la plus claire et{" "}
        <code>L_sombre</code> est la luminance relative de la couleur la plus sombre.
      </p>

      <h3>Exemples de calculs</h3>
      <ul>
        <li>
          <strong>Noir (#000000) sur blanc (#FFFFFF) :</strong> L(blanc) = 1,0, L(noir) = 0,0.
          Rapport = (1,0 + 0,05) / (0,0 + 0,05) = 1,05 / 0,05 = <strong>21:1</strong>. Contraste maximal possible.
        </li>
        <li>
          <strong>#767676 gris sur blanc (#FFFFFF) :</strong> L(#767676) ≈ 0,216.
          Rapport = (1,0 + 0,05) / (0,216 + 0,05) ≈ 1,05 / 0,266 ≈ <strong>4,54:1</strong>.
          Tout juste conforme à WCAG AA pour le texte normal.
        </li>
        <li>
          <strong>#999999 gris sur blanc (#FFFFFF) :</strong> L(#999999) ≈ 0,319.
          Rapport = (1,0 + 0,05) / (0,319 + 0,05) ≈ 1,05 / 0,369 ≈ <strong>2,85:1</strong>.
          Non conforme à WCAG AA pour du texte de toute taille.
        </li>
      </ul>

      <h2>WCAG : la norme qui définit les exigences d'accessibilité</h2>
      <p>
        Les Règles pour l'accessibilité des contenus Web (WCAG) sont publiées par le World Wide Web Consortium
        (W3C) et définissent la norme internationalement reconnue pour l'accessibilité web. La version
        actuellement en vigueur dans la réglementation est WCAG 2.1, publiée en 2018. WCAG 3.0 est en cours
        d'élaboration et finira par la remplacer avec un système de mesure plus nuancé, mais WCAG 2.1 reste la
        norme opérationnelle pour la conformité.
      </p>
      <p>
        Les WCAG organisent les exigences en trois niveaux de conformité : A (minimum), AA (standard) et AAA
        (renforcé). Le niveau AA est ce que la plupart des cadres juridiques exigent. Le niveau AAA est
        aspirationnel et n'est pas imposé pour des sites entiers, uniquement pour des contextes spécifiques.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1rem", color: "#1d4ed8"}}>
          Exigences de contraste WCAG 2.1 en un coup d'œil
        </p>
        <ul style={{marginTop: 0, marginBottom: 0}}>
          <li>
            <strong>Niveau AA — Texte normal :</strong> rapport de contraste minimum de <strong>4,5:1</strong>
          </li>
          <li>
            <strong>Niveau AA — Grand texte :</strong> rapport de contraste minimum de <strong>3:1</strong>
            (grand texte = 18 pt / 24 px en graissse normale, ou 14 pt / ≈18,67 px en gras)
          </li>
          <li>
            <strong>Niveau AA — Composants d'interface et objets graphiques :</strong> rapport de contraste minimum de <strong>3:1</strong>
            (s'applique aux bordures de boutons, contours de champs de saisie, icônes porteuses de sens)
          </li>
          <li>
            <strong>Niveau AAA — Texte normal :</strong> rapport de contraste minimum de <strong>7:1</strong>
          </li>
          <li>
            <strong>Niveau AAA — Grand texte :</strong> rapport de contraste minimum de <strong>4,5:1</strong>
          </li>
        </ul>
      </div>

      <p>
        Il est important de noter ce à quoi les exigences de contraste ne s'appliquent <em>pas</em> : les
        images décoratives sans contenu informatif, les logos et marques visuelles, et le texte faisant
        partie d'un composant d'interface inactif (un bouton désactivé, par exemple) sont tous exemptés
        des exigences de contraste au titre de WCAG 2.1. L'intention est de protéger le contenu informatif,
        pas les éléments purement décoratifs.
      </p>

      <h2>Paires de couleurs : exemples conformes et non conformes</h2>
      <p>
        Le rapport de contraste d'une paire de couleurs dépend entièrement de la luminance relative des deux
        couleurs — pas de celle qui est « plus jolie » ni de celles qui vous semblent similaires. Voici des
        exemples représentatifs sur l'ensemble du spectre conforme/non conforme :
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Couleur du texte</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Couleur d'arrière-plan</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Rapport de contraste</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AA Normal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AAA Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#000000</code> (noir)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><strong>21:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#1a1a2e</code> (bleu marine foncé)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><strong>18,1:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#595959</code> (gris foncé)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><strong>7,0:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#767676</code> (gris moyen)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><strong>4,54:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><code>#4f46e5</code> (indigo)</td>
              <td style={{padding: "12px 16px"}}><strong>5,9:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#999999</code> (gris clair)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><strong>2,85:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (blanc)</td>
              <td style={{padding: "12px 16px"}}><code>#ffdd00</code> (jaune)</td>
              <td style={{padding: "12px 16px"}}><strong>1,29:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#0000ee</code> (lien bleu)</td>
              <td style={{padding: "12px 16px"}}><code>#6b21a8</code> (violet)</td>
              <td style={{padding: "12px 16px"}}><strong>1,7:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Non conforme</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Erreurs de contraste courantes</h2>
      <p>
        Les mêmes erreurs reviennent régulièrement dans les audits d'accessibilité sur le web. Les connaître
        par leur nom facilite leur détection dans votre propre travail.
      </p>

      <h3>Texte gris clair sur blanc</h3>
      <p>
        C'est le problème de contraste le plus fréquent sur le web moderne. Les tendances au minimalisme
        ont produit une génération d'interfaces où le corps de texte, les légendes, les métadonnées et le
        texte de substitution sont rendus dans des nuances comme <code>#aaaaaa</code>, <code>#bbbbbb</code>
        ou <code>#cccccc</code> sur fond blanc. Ces combinaisons produisent généralement des rapports de
        contraste compris entre 1,5:1 et 2,5:1 — bien en dessous du minimum de 4,5:1. Le designer peut le
        lire sur un moniteur étalonné dans une pièce sombre ; l'utilisateur final sur un smartphone en
        plein après-midi de soleil, non.
      </p>

      <h3>Texte blanc sur boutons colorés</h3>
      <p>
        Le texte blanc sur fond jaune (<code>#ffdd00</code>), vert citron (<code>#84cc16</code>) ou orange
        clair (<code>#fb923c</code>) ne passe pas WCAG AA quelle que soit la taille du texte. Ces
        combinaisons de couleurs sont visuellement frappantes, mais le contraste est insuffisant. Le texte
        sombre (noir ou gris très foncé) sur ces fonds lumineux est la solution accessible — il atteint
        généralement des rapports supérieurs à 10:1.
      </p>

      <h3>Texte de substitution dans les champs de formulaire</h3>
      <p>
        Le texte de substitution par défaut des navigateurs — le texte indicatif qui apparaît dans les
        champs vides avant que l'utilisateur ne tape — est généralement rendu à environ 40 % d'opacité de
        la couleur du texte, ou sous forme d'un gris moyen comme <code>#aaaaaa</code>. Cela ne passe
        presque jamais WCAG AA. Le texte de substitution est soumis à la même exigence de contraste 4,5:1
        que le texte normal car il communique des informations sur ce qu'il faut saisir.
      </p>

      <h3>Liens bleus sur fonds colorés ou sombres</h3>
      <p>
        La couleur traditionnelle des hyperliens (<code>#0000ee</code>) offre un excellent contraste sur
        fond blanc (8,6:1) mais s'effondre sur les fonds colorés. Sur un fond violet moyen, ce même lien
        bleu n'atteint qu'environ 1,7:1. Les couleurs de lien doivent être vérifiées non seulement par
        rapport au fond de la page, mais aussi par rapport aux sections colorées ou aux cartes dans
        lesquelles elles apparaissent.
      </p>

      <h3>États désactivés et indicateurs de focus</h3>
      <p>
        Bien que WCAG 2.1 exempte les composants d'interface désactivés des exigences de contraste, les
        indicateurs de focus — le contour visible qui apparaît lorsqu'un utilisateur navigue au clavier
        vers un élément focalisable — doivent respecter un rapport de 3:1 par rapport aux couleurs
        adjacentes sous WCAG 2.2. De nombreux sites suppriment le contour de focus par défaut du
        navigateur avec <code>outline: none</code> sans en fournir un de remplacement, ce qui constitue
        une défaillance d'accessibilité pour les utilisateurs ne se servant que du clavier.
      </p>

      <h2>Techniques pour choisir des couleurs accessibles</h2>

      <h3>Privilégier le foncé sur le clair</h3>
      <p>
        La valeur par défaut la plus simple pour le texte est le texte quasi-noir sur fond blanc ou gris
        très clair. Des rapports supérieurs à 10:1 sont faciles à atteindre et offrent une grande
        flexibilité sur la taille et la graisse de la police. Réservez les palettes claires sur fond
        sombre (mode sombre) pour les surfaces secondaires et vérifiez le contraste dans les deux thèmes.
      </p>

      <h3>Vérifier tous les états interactifs</h3>
      <p>
        L'état par défaut d'un bouton peut satisfaire AA tandis que son état survolé — qui éclaircit
        l'arrière-plan — tombe en dessous de 4,5:1. Vérifiez séparément les états par défaut, survolé,
        focus, actif et désactivé. L'état désactivé est exempté de l'exigence, mais tous les autres
        doivent être conformes.
      </p>

      <h3>La règle 60-30-10 appliquée de façon accessible</h3>
      <p>
        La règle des 60-30-10 (60 % couleur dominante, 30 % couleur secondaire, 10 % couleur d'accent)
        est utile pour la hiérarchie visuelle. L'appliquer de façon accessible signifie : vérifier que le
        texte apparaissant sur chacune de ces trois zones de couleur respecte le seuil de contraste pour
        cette zone individuellement. La couleur d'accent à 10 % est souvent la plus problématique — les
        couleurs d'accent vives associées à du texte blanc ou sombre peuvent ne pas être conformes à
        certaines combinaisons de teinte et de saturation.
      </p>

      <h3>Utiliser le vérificateur de contraste avant de valider</h3>
      <p>
        Le moment le moins coûteux pour corriger un problème de contraste est avant de coder quoi que ce
        soit. Lorsque vous sélectionnez des couleurs dans un outil de design, vérifiez immédiatement les
        paires texte/arrière-plan prévues. Ajuster la luminosité d'une couleur de 10 à 15 % permet souvent
        de rendre une combinaison non conforme conforme sans modifier significativement le caractère visuel
        du design.
      </p>

      <h2>Exigences légales</h2>
      <p>
        La conformité aux WCAG n'est pas purement volontaire dans de nombreuses juridictions. Les cadres
        juridiques qui font référence à WCAG AA comprennent :
      </p>
      <ul>
        <li>
          <strong>États-Unis — Americans with Disabilities Act (ADA) :</strong> L'ADA interdit la
          discrimination fondée sur le handicap dans les lieux ouverts au public. Les tribunaux fédéraux et
          le Département de la justice ont interprété cette loi comme couvrant les sites web commerciaux.
          Des milliers de poursuites judiciaires pour accessibilité sont déposées chaque année devant les
          tribunaux fédéraux américains, les violations de contraste des couleurs étant fréquemment citées
          dans les mises en demeure.
        </li>
        <li>
          <strong>Union européenne — EN 301 549 :</strong> La directive européenne sur l'accessibilité web
          impose la conformité WCAG 2.1 niveau AA pour les sites web et applications mobiles du secteur
          public. EN 301 549 est la norme technique utilisée pour les marchés publics. Les organisations du
          secteur privé dans les secteurs réglementés font également face à des exigences croissantes.
        </li>
        <li>
          <strong>Canada — LAPHO (Loi sur l'accessibilité pour les personnes handicapées de l'Ontario) :</strong>{" "}
          L'Ontario impose la conformité WCAG 2.0 niveau AA pour les organisations du secteur privé comptant
          50 employés ou plus, et pour toutes les organisations du secteur public.
        </li>
        <li>
          <strong>Royaume-Uni — Equality Act 2010 :</strong> Les prestataires de services ont l'obligation
          de prendre des mesures raisonnables pour les personnes handicapées, ce que le gouvernement
          britannique interprète comme incluant l'accessibilité des sites web.
        </li>
      </ul>
      <p>
        Au-delà du risque juridique, de nombreux clients entreprises et processus d'appels d'offres
        gouvernementaux exigent désormais la conformité WCAG AA dans les contrats de prestataires.
        L'accessibilité est de plus en plus une exigence commerciale, pas seulement éthique.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "10px", fontWeight: 700, fontSize: "1rem", color: "#dc2626"}}>
          Exigence clé à retenir
        </p>
        <p style={{marginTop: 0, marginBottom: 0}}>
          WCAG 2.1 niveau AA exige un <strong>rapport de contraste de 4,5:1 pour le texte normal</strong> et{" "}
          <strong>3:1 pour le grand texte</strong> (18 pt et plus, ou 14 pt et plus en gras). Les contours
          de composants d'interface et les icônes porteuses de sens exigent également 3:1. Ne pas respecter
          ces seuils signifie ne pas satisfaire la norme d'accessibilité la plus largement imposée sur le web.
        </p>
      </div>

      <h2>Qui bénéficie au-delà des personnes handicapées</h2>
      <p>
        Un contraste accessible est une bonne conception pour tous. La recherche en expérience utilisateur
        montre systématiquement que le texte à fort contraste est lu plus rapidement et avec moins d'erreurs
        dans tous les groupes d'utilisateurs. Les populations qui en bénéficient le plus manifestement
        comprennent :
      </p>
      <ul>
        <li>Les personnes atteintes de déficience de la vision des couleurs (rouge-vert, bleu-jaune ou monochromie)</li>
        <li>Les personnes âgées, dont la sensibilité au contraste diminue naturellement avec l'âge</li>
        <li>Les personnes malvoyantes qui n'utilisent pas de loupe d'écran</li>
        <li>Les utilisateurs en environnements à forte luminosité ambiante (en extérieur, près de fenêtres)</li>
        <li>Les utilisateurs sur des affichages de mauvaise qualité, anciens ou d'entrée de gamme</li>
        <li>Toute personne sous charge cognitive — fatiguée ou distraite, un fort contraste réduit les erreurs de lecture</li>
      </ul>

      <h2>Comment utiliser le Vérificateur de contraste des couleurs BrowseryTools</h2>
      <p>
        Le <a href="/tools/contrast-checker">Vérificateur de contraste des couleurs BrowseryTools</a> rend
        triviale la vérification de toute combinaison de couleurs par rapport aux normes WCAG :
      </p>
      <ul>
        <li>
          <strong>Entrez les codes hexadécimaux :</strong> Tapez ou collez n'importe quel code couleur
          hexadécimal valide (3 ou 6 chiffres, avec ou sans le préfixe <code>#</code>) dans les champs
          de premier plan et d'arrière-plan.
        </li>
        <li>
          <strong>Voir le rapport immédiatement :</strong> Le rapport de contraste est calculé et affiché
          en temps réel pendant la saisie — aucun bouton à cliquer.
        </li>
        <li>
          <strong>Badges AA et AAA :</strong> Des badges conformes/non conformes clairs sont affichés pour
          le niveau AA texte normal, le niveau AA grand texte, le niveau AAA texte normal et le niveau AAA
          grand texte — vous voyez exactement quels seuils votre paire satisfait.
        </li>
        <li>
          <strong>Aperçu en direct :</strong> L'outil affiche un exemple de texte sur votre arrière-plan
          choisi pour que vous puissiez voir la combinaison telle qu'elle apparaîtrait à un utilisateur.
        </li>
        <li>
          <strong>Utiliser le sélecteur de couleur :</strong> Si vous n'avez pas de valeur hexadécimale
          spécifique en tête, le sélecteur de couleur intégré vous permet de choisir les couleurs
          visuellement et de voir instantanément comment le rapport évolue au fil de l'espace colorimétrique.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Tout s'exécute localement dans votre navigateur.</strong> Le Vérificateur de contraste des
        couleurs effectue tous les calculs de luminance en JavaScript dans votre onglet de navigateur. Aucune
        valeur de couleur n'est transmise à un quelconque serveur. Il n'y a aucun compte, aucun journal
        d'historique et aucune analyse tierce impliquée dans le calcul. Fermez l'onglet et tout disparaît.
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Vérifiez toute combinaison de couleurs par rapport à WCAG AA et AAA instantanément
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Entrez deux codes hexadécimaux et voyez le rapport de contraste, l'état de conformité et un
          aperçu de texte en direct. Aucune inscription requise. Rien n'est envoyé.
        </p>
        <a
          href="/tools/contrast-checker"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Ouvrir le Vérificateur de contraste →
        </a>
      </div>
    </div>
  );
}
