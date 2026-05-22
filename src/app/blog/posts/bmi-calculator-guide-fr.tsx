export default function Content() {
  return (
    <div>
      <p>
        L'indice de masse corporelle — IMC — est l'un des chiffres les plus largement utilisés en médecine préventive. Les médecins
        le mentionnent lors des bilans. Les formulaires d'assurance le demandent. Les applications de fitness le calculent automatiquement. Et pourtant,
        la plupart des gens qui connaissent leur chiffre d'IMC n'ont qu'une vague idée de ce qu'il mesure réellement, de la façon dont il
        est calculé et — point crucial — de ce qu'il ne peut pas vous dire. Ce guide couvre tout cela : la formule,
        les catégories, l'histoire, les véritables limites, et comment utiliser le{" "}
        <a href="/tools/bmi-calculator">Calculateur d'IMC de BrowseryTools</a> pour obtenir votre résultat instantanément et
        en toute confidentialité dans votre navigateur.
      </p>

      <h2>Qu'est-ce que l'IMC ?</h2>
      <p>
        L'IMC est un simple rapport entre le poids et le carré de la taille. Il a été conçu dans les années 1830 par le
        mathématicien et statisticien belge Adolphe Quetelet, qui étudiait les caractéristiques d'un
        « homme moyen » au sein de grandes populations. Quetelet n'était pas médecin et n'a jamais voulu que son indice
        soit utilisé comme outil de diagnostic de santé individuel — c'était un outil pour étudier les schémas au niveau des
        populations. La formule qu'il a développée a ensuite été adoptée par la communauté médicale au vingtième
        siècle parce qu'elle offrait quelque chose de rare en milieu clinique : un moyen rapide, gratuit et non invasif de
        dépister un grand nombre de personnes pour un risque de santé potentiel lié au poids.
      </p>
      <p>
        L'indice s'est ancré dans les années 1970 après que le physiologiste Ancel Keys a passé en revue plusieurs indices
        concurrents de poids par rapport à la taille et a conclu que la formule originale de Quetelet était la plus fortement corrélée
        au pourcentage de masse grasse dans les études de population. Keys a inventé le terme « indice de masse corporelle » à ce
        moment-là. Depuis, c'est la métrique de dépistage par défaut du surpoids et de l'obésité dans les contextes cliniques
        et de santé publique dans le monde entier.
      </p>

      <h2>La formule de l'IMC</h2>
      <p>
        La formule est simple. En unités métriques :
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = weight (kg) ÷ height² (m²)
      </pre>
      <p>
        En unités impériales, un facteur de conversion est nécessaire car les livres et les pouces ne partagent pas la même
        relation mathématique que les kilogrammes et les mètres :
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = 703 × weight (lbs) ÷ height² (inches²)
      </pre>
      <p>
        La constante 703 est dérivée de la conversion d'unités entre les systèmes métrique et impérial
        (plus précisément, 1 kg/m² ≈ 703 × lb/in²). Les deux formules produisent exactement le même
        nombre sans dimension pour une même personne.
      </p>

      <h2>Un exemple concret</h2>
      <p>
        Prenons une personne qui pèse 70 kg et mesure 1,75 m. Son IMC est :
      </p>
      <pre style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`BMI = 70 ÷ (1.75²)
    = 70 ÷ 3.0625
    = 22.9`}
      </pre>
      <p>
        Un résultat de 22,9 se situe pleinement dans la plage de poids normal (18,5–24,9). En unités impériales, une personne
        mesurant 5 pieds 9 pouces (69 pouces) et pesant 154 livres obtiendrait : 703 × 154 ÷ 69² = 108 262 ÷ 4 761 ≈
        22,7 — essentiellement le même nombre, comme attendu.
      </p>

      <h2>Catégories d'IMC</h2>
      <p>
        L'Organisation mondiale de la santé (OMS) définit les classifications d'IMC standard suivantes pour les adultes
        âgés de 18 ans et plus :
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Catégorie</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Plage d'IMC</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Risque de santé associé</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#2563eb"}}>Insuffisance pondérale</strong></td>
              <td style={{padding: "12px 16px"}}>Inférieur à 18,5</td>
              <td style={{padding: "12px 16px"}}>Malnutrition, ostéoporose, anémie, immunosuppression</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Poids normal</strong></td>
              <td style={{padding: "12px 16px"}}>18,5 – 24,9</td>
              <td style={{padding: "12px 16px"}}>Risque le plus faible dans le cadre basé sur l'IMC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Surpoids</strong></td>
              <td style={{padding: "12px 16px"}}>25 – 29,9</td>
              <td style={{padding: "12px 16px"}}>Risque élevé de diabète de type 2, d'hypertension, de maladies cardiovasculaires</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Obésité classe I</strong></td>
              <td style={{padding: "12px 16px"}}>30 – 34,9</td>
              <td style={{padding: "12px 16px"}}>Risque modéré ; syndrome métabolique, apnée du sommeil</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#b91c1c"}}>Obésité classe II</strong></td>
              <td style={{padding: "12px 16px"}}>35 – 39,9</td>
              <td style={{padding: "12px 16px"}}>Risque élevé ; risque chirurgical accru, maladies articulaires</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#7f1d1d"}}>Obésité classe III (sévère)</strong></td>
              <td style={{padding: "12px 16px"}}>40 et plus</td>
              <td style={{padding: "12px 16px"}}>Risque très élevé ; espérance de vie significativement réduite</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Ces seuils ne s'appliquent qu'aux adultes. Les enfants et les adolescents sont évalués par rapport à des courbes de croissance
        spécifiques à l'âge et au sexe, où c'est le percentile d'IMC — et non un nombre fixe — qui détermine la catégorie.
      </p>

      <h2>Ce que l'IMC ne mesure pas</h2>
      <p>
        C'est ici que l'IMC devient réellement compliqué. La formule est si simple qu'elle passe inévitablement
        à côté d'aspects importants de la composition corporelle. Comprendre ces limites n'est pas qu'académique
        — elles affectent directement la façon dont vous devriez interpréter votre propre chiffre.
      </p>

      <h3>La masse musculaire</h3>
      <p>
        L'IMC mesure le poids corporel total par rapport à la taille. Il ne peut pas distinguer le tissu musculaire
        maigre du tissu adipeux (graisse). Un athlète professionnel ou un culturiste de compétition qui porte
        une masse musculaire substantielle apparaîtra souvent en surpoids, voire en obésité, selon l'IMC, malgré un taux de masse grasse très
        faible. À l'inverse, une personne sédentaire avec une faible masse musculaire et un taux de masse grasse élevé —
        parfois qualifiée de « maigre mais grasse » ou présentant une obésité à poids normal — peut avoir un IMC parfaitement normal
        tout en portant des niveaux de graisse métaboliquement nocifs. C'est sans doute le défaut le plus important
        de l'usage courant de l'IMC.
      </p>

      <h3>L'âge</h3>
      <p>
        En vieillissant, la masse musculaire diminue généralement et est remplacée par du tissu adipeux même lorsque le poids
        corporel reste constant — un processus appelé obésité sarcopénique. Un adulte plus âgé avec un IMC normal
        de 23 peut en réalité porter une proportion de masse grasse plus élevée qu'une personne plus jeune avec le même
        chiffre. Certains chercheurs en gériatrie soutiennent que des plages d'IMC légèrement plus élevées (jusqu'à 27 voire 28)
        peuvent être protectrices chez les adultes plus âgés, car un faible poids corporel chez les personnes âgées est associé à la
        fragilité et à une mortalité accrue.
      </p>

      <h3>Le sexe</h3>
      <p>
        Les femmes portent naturellement un pourcentage de masse grasse plus élevé que les hommes à IMC égal. En moyenne,
        les femmes ont environ 10 à 12 points de pourcentage de masse grasse de plus que les hommes ayant un IMC identique.
        C'est physiologiquement normal — c'est lié à la fonction hormonale et à la biologie reproductive —
        mais cela signifie que le même chiffre d'IMC représente des compositions corporelles significativement différentes selon
        le sexe biologique.
      </p>

      <h3>L'origine ethnique</h3>
      <p>
        La recherche sur les populations a montré de façon constante que les personnes d'origine asiatique présentent un risque plus élevé d'
        affections cardiométaboliques (diabète de type 2, hypertension, maladies cardiovasculaires) à des valeurs d'IMC plus
        faibles que les populations d'origine européenne. La consultation d'experts de l'OMS sur l'IMC dans les populations
        asiatiques a recommandé d'abaisser les seuils d'action pour les adultes asiatiques — avec un surpoids
        commençant à un IMC de 23 et une obésité à un IMC de 27,5 — afin de mieux refléter le risque de santé réel dans ces
        populations. Les catégories standard de l'OMS ont été développées principalement à partir de données sur les populations européennes
        et ne se transposent pas proprement à tous les groupes ethniques.
      </p>

      <h3>La répartition des graisses</h3>
      <p>
        L'endroit où la graisse est stockée dans le corps importe énormément — sans doute plus que la masse grasse totale. La graisse
        viscérale, qui s'accumule autour des organes abdominaux (foie, pancréas, intestins), est métaboliquement
        active et fortement associée à la résistance à l'insuline, à l'inflammation et aux maladies cardiovasculaires.
        La graisse sous-cutanée, stockée sous la peau notamment au niveau des hanches et des cuisses, est moins nocive et
        peut même être quelque peu protectrice. L'IMC ne capture aucune de ces distinctions. Deux personnes ayant un
        IMC identique peuvent avoir des profils de santé radicalement différents selon l'endroit où leur graisse
        est stockée.
      </p>

      <h2>Pourquoi l'IMC est tout de même devenu la norme</h2>
      <p>
        Compte tenu de ces limites bien documentées, il est raisonnable de se demander pourquoi l'IMC est resté si dominant
        dans la pratique clinique. La réponse est pratique : il ne nécessite qu'une balance et un mètre ruban.
        Le calculer prend environ dix secondes. Il est gratuit, reproductible et universellement compris. Les méthodes
        plus sophistiquées d'analyse de la composition corporelle — scans DEXA, pesée hydrostatique, pléthysmographie
        par déplacement d'air (Bod Pod), quantification de la graisse par IRM — sont précises mais coûteuses,
        chronophages et indisponibles dans la plupart des contextes cliniques courants.
      </p>
      <p>
        L'IMC remplit bien un objectif spécifique : c'est un outil de dépistage bon marché au niveau des populations qui peut
        rapidement signaler les personnes qui méritent une investigation plus poussée. Il n'a jamais été conçu pour être un
        outil de diagnostic pour les individus, et la plupart des chercheurs et médecins qui l'utilisent comprennent
        cette distinction. Le problème survient lorsqu'il est utilisé comme s'il était plus définitif qu'il ne l'est.
      </p>

      <h2>Mesures complémentaires</h2>
      <p>
        Si vous voulez une image plus complète de votre composition corporelle et de votre risque de santé, envisagez ces
        mesures en complément de l'IMC :
      </p>
      <ul>
        <li>
          <strong>Le tour de taille :</strong> mesuré au point le plus étroit du torse (ou au niveau du
          nombril). Les seuils à haut risque sont généralement de 94 cm (37 po) pour les hommes et de 80 cm (31,5 po) pour les femmes,
          avec un risque très élevé au-dessus de 102 cm (40 po) pour les hommes et de 88 cm (34,5 po) pour les femmes. Cela capture directement
          l'adiposité centrale — la graisse abdominale — ce que l'IMC ne peut pas.
        </li>
        <li>
          <strong>Le rapport taille-hanches (RTH) :</strong> le tour de taille divisé par le tour de hanches.
          Un RTH supérieur à 0,90 pour les hommes ou à 0,85 pour les femmes indique une obésité abdominale selon les directives de l'OMS.
        </li>
        <li>
          <strong>Le rapport taille-taille (en hauteur) (RTT) :</strong> le tour de taille divisé par la taille. Un rapport
          inférieur à 0,5 est généralement considéré comme sain dans la plupart des populations et à tous les âges, ce qui en fait l'un des
          indicateurs à chiffre unique les plus simples de la graisse centrale.
        </li>
        <li>
          <strong>Le pourcentage de masse grasse :</strong> mesure directe de la fraction de votre poids qui est de la
          graisse. Les plages saines sont d'environ 10 à 20 % pour les hommes et 18 à 28 % pour les femmes, bien que les plages optimales
          varient avec l'âge. Le pourcentage de masse grasse nécessite des méthodes de mesure plus spécialisées.
        </li>
      </ul>

      <h2>Plage de poids santé pour votre taille</h2>
      <p>
        La formule de l'IMC peut être réarrangée pour calculer quels poids vous donneraient un IMC dans la plage
        normale (18,5–24,9). Pour trouver votre plage de poids santé, multipliez le carré de votre taille en mètres par
        18,5 et 24,9 :
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`Healthy weight range = 18.5 × height² to 24.9 × height²

For 1.75 m:
Lower bound = 18.5 × 3.0625 = 56.7 kg
Upper bound = 24.9 × 3.0625 = 76.3 kg`}
      </pre>
      <p>
        Ainsi, pour une personne mesurant 1,75 m, un IMC normal correspond à un poids corporel compris approximativement entre
        56,7 kg et 76,3 kg — une plage de près de 20 kg. Le <a href="/tools/bmi-calculator">Calculateur d'IMC
        de BrowseryTools</a> affiche automatiquement cette plage santé sous votre résultat, pour que vous puissiez voir
        exactement où vous vous situez par rapport à la catégorie normale pour votre taille spécifique.
      </p>

      <h2>Risques de santé associés à chaque catégorie</h2>
      <p>
        Bien que l'IMC soit imparfait, il est bel et bien corrélé à des résultats de santé significatifs au niveau des populations.
        Une insuffisance pondérale importante est associée à la malnutrition, à un affaiblissement de la fonction immunitaire, à une perte de
        densité osseuse et à des complications cardiovasculaires. À l'autre extrémité de l'échelle, un surpoids
        et une obésité durables augmentent le risque statistique de :
      </p>
      <ul>
        <li>Diabète de type 2 (le risque commence à augmenter au-dessus d'un IMC de 25 et s'accélère au-dessus de 30)</li>
        <li>Hypertension et maladies cardiovasculaires</li>
        <li>Certains cancers, dont le cancer colorectal, le cancer du sein, de l'endomètre et du rein</li>
        <li>Apnée obstructive du sommeil</li>
        <li>Stéatose hépatique non alcoolique (NAFLD)</li>
        <li>Arthrose des articulations portantes</li>
        <li>Risque chirurgical et anesthésique accru</li>
      </ul>
      <p>
        Ce sont des associations statistiques à l'échelle des populations, et non des prédictions individuelles. Un IMC de 28 ne
        signifie pas que vous développerez l'une de ces affections — cela signifie que dans de grandes populations d'étude,
        les personnes ayant cet IMC ont présenté des taux élevés de ces résultats par rapport aux personnes dans la plage
        normale.
      </p>

      <h2>Comment utiliser le Calculateur d'IMC de BrowseryTools</h2>
      <p>
        Le <a href="/tools/bmi-calculator">Calculateur d'IMC de BrowseryTools</a> est conçu pour vous donner
        un résultat instantané et clair avec un contexte utile :
      </p>
      <ul>
        <li>
          <strong>Métrique ou impérial :</strong> basculez entre kg/cm et livres/pouces. Le calculateur
          convertit automatiquement — vous n'avez jamais à vous soucier des conversions d'unités.
        </li>
        <li>
          <strong>Résultats instantanés :</strong> votre IMC s'affiche dès que vous saisissez votre taille et
          votre poids. Aucun bouton sur lequel cliquer, aucun chargement.
        </li>
        <li>
          <strong>Affichage de la catégorie :</strong> le résultat montre non seulement le chiffre mais aussi la catégorie de l'OMS dans laquelle
          il se situe — Insuffisance pondérale, Normal, Surpoids ou Obésité — avec un code couleur pour plus de clarté.
        </li>
        <li>
          <strong>Plage de poids santé :</strong> pour la taille que vous avez saisie, l'outil affiche la plage de
          poids corporels correspondant à un IMC normal (18,5–24,9) dans votre système d'unités sélectionné.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Vos données ne quittent jamais votre appareil.</strong> Le Calculateur d'IMC s'exécute entièrement dans votre
        navigateur. Les valeurs de taille et de poids que vous saisissez ne servent qu'au calcul à l'écran et
        ne sont jamais transmises aux serveurs de BrowseryTools, stockées dans une base de données ni partagées avec un
        tiers. Rien n'est journalisé. Fermer l'onglet efface tout.
      </div>

      <div style={{background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "8px", fontWeight: 700, fontSize: "1rem", color: "#92400e"}}>
          Avertissement médical
        </p>
        <p style={{marginTop: 0, marginBottom: 0, fontSize: "0.95rem"}}>
          Le Calculateur d'IMC de BrowseryTools est un outil purement informatif. L'IMC est une métrique de dépistage, et non
          une mesure diagnostique. Le résultat qu'il fournit n'est pas un avis médical et ne devrait pas être utilisé pour
          prendre des décisions concernant votre santé, votre alimentation ou votre traitement sans consulter un professionnel de
          santé qualifié. Si vous avez des préoccupations concernant votre poids, votre composition corporelle ou des affections
          de santé connexes, veuillez en parler à votre médecin ou à un diététicien diplômé.
        </p>
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculez votre IMC instantanément — métrique ou impérial
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Voyez votre catégorie, votre plage de poids santé et ce que le chiffre signifie réellement.
          Aucun compte nécessaire. Rien n'est téléversé ni stocké.
        </p>
        <a
          href="/tools/bmi-calculator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Ouvrir le Calculateur d'IMC →
        </a>
      </div>
    </div>
  );
}
