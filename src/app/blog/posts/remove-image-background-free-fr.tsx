export default function Content() {
  return (
    <div>
      <p>
        Supprimer l'arrière-plan d'une image était autrefois une corvée réservée aux designers professionnels. Aujourd'hui, cela prend
        environ 5 secondes — et vous pouvez le faire entièrement dans votre navigateur, sans téléversement, sans compte, sans filigrane,
        et sans frais. Ce guide explique comment fonctionne la technologie, pourquoi les alternatives populaires présentent de réels
        inconvénients, et comment obtenir des résultats parfaits à chaque fois avec BrowseryTools.
      </p>

      <h2>L'ancienne méthode : Photoshop et GIMP</h2>
      <p>
        Pendant des décennies, supprimer l'arrière-plan d'une image signifiait l'une de deux choses : payer pour Adobe Photoshop (actuellement
        21,99 $/mois dans le cadre de Creative Cloud) et passer du temps à apprendre ses outils de sélection, ou utiliser le
        gratuit mais notoirement complexe GIMP avec sa courbe d'apprentissage abrupte.
      </p>
      <p>
        Même les utilisateurs expérimentés de Photoshop savent qu'une suppression d'arrière-plan propre sur un sujet détaillé — cheveux, fourrure,
        objets transparents — peut prendre de 10 à 30 minutes de masquage soigneux. L'outil « Sélectionner le sujet » a amélioré
        les choses, mais le travail de nettoyage manuel demeurait. Pour quiconque n'était pas déjà designer, ce n'était tout simplement
        pas une option viable pour des tâches rapides.
      </p>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Le vrai coût de Photoshop :</strong> 21,99 $/mois signifie que vous payez 264 $/an juste pour supprimer occasionnellement
        l'arrière-plan d'une photo de produit ou d'une photo de profil. Pour la plupart des gens, ce n'est pas un compromis
        raisonnable.
      </div>

      <h2>Les outils en ligne « faciles » — et leurs coûts cachés</h2>
      <p>
        Une vague d'outils de suppression d'arrière-plan en ligne a émergé pour combler le vide. Remove.bg a été lancé en 2018 et est devenu
        extrêmement populaire. Canva a ajouté la suppression d'arrière-plan comme fonctionnalité. Des dizaines de services similaires ont suivi.
        Ils résolvent le problème de la complexité — mais introduisent un autre ensemble de problèmes.
      </p>

      <h3>Remove.bg</h3>
      <p>
        Remove.bg est réellement impressionnant dans ce qu'il fait. Mais le palier gratuit ne vous donne que des aperçus en basse résolution
        uniquement — les téléchargements en pleine résolution nécessitent des crédits qui coûtent entre 0,20 $ et 1,99 $ par image selon le
        volume. Plus important encore, chaque image que vous traitez est téléversée sur leurs serveurs. Leur politique de confidentialité les autorise
        à conserver et traiter vos images. Pour des photos personnelles, des images de produits contenant des informations
        propriétaires, ou tout ce qui est sensible, c'est une préoccupation réelle.
      </p>

      <h3>Canva</h3>
      <p>
        La suppression d'arrière-plan de Canva est verrouillée derrière Canva Pro, qui coûte 12,99 $/mois ou 119,99 $/an. Le palier
        gratuit ne l'inclut pas. Comme Remove.bg, Canva traite vos images sur ses serveurs, ce qui signifie que vos fichiers
        sont téléversés, traités à distance et stockés dans leur infrastructure cloud.
      </p>

      <h3>Le schéma récurrent</h3>
      <p>
        Presque tous les outils de suppression d'arrière-plan en ligne populaires partagent le même modèle : téléverser votre image, la traiter
        à distance, payer pour des résultats de qualité. Même les versions « gratuites » s'accompagnent de limites de résolution, de filigranes,
        de limites de traitement, ou des trois. Et vos images voyagent vers les serveurs de quelqu'un d'autre à chaque fois.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Information clé :</strong> chaque fois que vous téléversez une image vers un service en ligne pour traitement, vous
        confiez vos données à ce service. Pour des photos personnelles, du travail client ou des images de produits propriétaires, c'est
        un risque significatif et souvent inutile.
      </div>

      <h2>L'approche BrowseryTools : une IA qui s'exécute sur votre appareil</h2>
      <p>
        La suppression d'arrière-plan de BrowseryTools fonctionne fondamentalement différemment de tous les services décrits ci-dessus. Le
        modèle d'IA s'exécute entièrement à l'intérieur de votre navigateur en utilisant la puissance de traitement de votre propre ordinateur. Vos images ne
        quittent jamais votre appareil.
      </p>
      <p>
        Cela est rendu possible par deux technologies qui travaillent ensemble :
      </p>
      <ul>
        <li>
          <strong>@imgly/background-removal :</strong> une bibliothèque JavaScript open source qui implémente un
          modèle de réseau de neurones spécifiquement entraîné pour la segmentation d'arrière-plan. Le modèle repose sur l'architecture RMBG,
          qui produit une détection de contours de haute qualité, en particulier autour des cheveux, de la fourrure et des formes
          complexes.
        </li>
        <li>
          <strong>ONNX Runtime Web :</strong> le runtime Open Neural Network Exchange permet aux modèles d'apprentissage automatique
          de s'exécuter efficacement dans le navigateur en utilisant WebAssembly et, optionnellement, WebGPU pour l'accélération
          matérielle. C'est ce qui rend pratique l'inférence d'IA réelle dans le navigateur — c'est la même technologie
          utilisée par des outils comme Whisper Web et les implémentations web de Stable Diffusion.
        </li>
      </ul>
      <p>
        Les poids du modèle sont téléchargés une seule fois dans le cache de votre navigateur lors de la première utilisation, puis utilisés localement pour chaque
        image suivante. Après ce téléchargement initial, l'outil fonctionne même hors ligne.
      </p>

      <h2>Avant et après : à quoi ressemble la suppression d'arrière-plan</h2>

      <div style={{display: "flex", gap: "16px", margin: "28px 0", flexWrap: "wrap" as const}}>
        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "8px", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"}}>
              🧑
            </div>
            <div style={{width: "100%", height: "60px", background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)", borderRadius: "0 0 12px 12px", position: "relative" as const, marginBottom: "-1px"}} />
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500}}>
            AVANT — Photo originale avec un arrière-plan chargé
          </p>
        </div>

        <div style={{display: "flex", alignItems: "center", fontSize: "2rem", fontWeight: 700, color: "#6366f1", padding: "0 8px"}}>
          →
        </div>

        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0 / 20px 20px", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"}}>
              🧑
            </div>
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#16a34a", fontWeight: 500}}>
            APRÈS — Arrière-plan transparent et net
          </p>
        </div>
      </div>

      <h2>Comment supprimer un arrière-plan avec BrowseryTools</h2>
      <p>
        L'<a href="/tools/bg-removal">outil de suppression d'arrière-plan de BrowseryTools</a> est conçu pour être aussi
        simple que possible. Voici le processus complet, étape par étape :
      </p>
      <ol>
        <li>
          <strong>Ouvrez l'outil.</strong> Rendez-vous sur <a href="/tools/bg-removal">/tools/bg-removal</a>. Lors de votre
          première visite, les poids du modèle d'IA se téléchargeront dans le cache de votre navigateur. Cela prend de 10 à 20 secondes selon
          votre connexion et ne se produit qu'une seule fois.
        </li>
        <li>
          <strong>Téléversez votre image.</strong> Cliquez sur la zone de téléversement ou glissez-déposez votre fichier image. Les
          formats pris en charge incluent JPEG, PNG, WebP et la plupart des types d'images courants. Le fichier reste sur votre appareil.
        </li>
        <li>
          <strong>Attendez le traitement.</strong> L'IA analyse votre image localement. Le traitement prend généralement
          de 2 à 8 secondes selon la résolution de l'image et la puissance de traitement de votre appareil. Un indicateur de progression vous montre
          où en sont les choses.
        </li>
        <li>
          <strong>Vérifiez et téléchargez.</strong> Le résultat apparaît à côté de votre original. Si vous êtes satisfait,
          téléchargez le PNG avec un arrière-plan transparent. Si vous souhaitez essayer une autre image, téléversez-en simplement une nouvelle.
        </li>
      </ol>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Aucun téléversement, aucun compte :</strong> BrowseryTools traite vos images entièrement sur votre propre
        appareil. Aucune donnée d'image n'est envoyée à un serveur à aucun moment. Vous n'avez pas besoin de créer un compte, de vérifier
        une adresse e-mail ni de fournir la moindre information personnelle. Ouvrez simplement l'outil et utilisez-le.
      </div>

      <h2>Quels types d'images fonctionnent le mieux</h2>
      <p>
        Le modèle d'IA est entraîné sur un large jeu de données, mais comme tout modèle, il est plus performant sur certains types d'images.
        Comprendre cela vous aide à obtenir des résultats constamment excellents.
      </p>

      <h3>Résultats excellents</h3>
      <ul>
        <li><strong>Personnes et portraits :</strong> le modèle est particulièrement bien entraîné sur les sujets humains. Les portraits, les photos de visage et les photos en pied avec une séparation claire du sujet produisent des résultats quasi parfaits.</li>
        <li><strong>Photographie de produits :</strong> les articles sur des arrière-plans simples — blanc, gris ou éclairé en studio — se traitent très proprement. Les images de produits e-commerce sont un cas d'usage idéal.</li>
        <li><strong>Animaux :</strong> les animaux de compagnie et les animaux fonctionnent généralement bien, bien qu'une fourrure très texturée sur un arrière-plan de teinte similaire puisse parfois poser des problèmes de contours.</li>
        <li><strong>Véhicules et objets :</strong> les voitures, les meubles et autres objets solides aux silhouettes nettes se traitent de façon fiable.</li>
      </ul>

      <h3>Scénarios difficiles</h3>
      <ul>
        <li><strong>Le verre et les objets transparents :</strong> les verres à vin, les bouteilles d'eau et autres objets transparents sont difficiles pour tout modèle de suppression d'arrière-plan, car l'arrière-plan transparaît à travers le sujet lui-même.</li>
        <li><strong>Les détails très fins :</strong> les tissus à mailles extrêmement fines, la dentelle ou les cheveux clairsemés sur un arrière-plan complexe peuvent présenter un léger effet de frange. Pour un travail critique, un rapide nettoyage manuel dans n'importe quel éditeur d'image gérera les contours.</li>
        <li><strong>Les sujets à faible contraste :</strong> une chemise blanche sur un mur blanc est réellement difficile à segmenter — même pour des humains. Offrez un certain contraste entre le sujet et l'arrière-plan lorsque c'est possible.</li>
        <li><strong>Les images en très basse résolution :</strong> les images inférieures à 200x200 pixels peuvent ne pas fournir assez de détails pour une segmentation précise.</li>
      </ul>

      <h2>Conseils pour obtenir les meilleurs résultats</h2>
      <ul>
        <li><strong>Partez de la version en plus haute résolution dont vous disposez.</strong> Plus de pixels donnent à l'IA plus d'informations pour travailler, surtout au niveau des contours. Vous pourrez toujours réduire la taille du résultat ensuite.</li>
        <li><strong>Assurez un bon éclairage du sujet.</strong> Un éclairage uniforme avec un minimum d'ombres facilite la tâche du modèle. Des ombres dures peuvent parfois être interprétées comme faisant partie de l'arrière-plan.</li>
        <li><strong>Utilisez un arrière-plan net lors de la prise de vue.</strong> Si vous maîtrisez l'environnement photo, un fond d'une seule couleur produira toujours des résultats plus nets qu'une scène complexe, même avec un traitement par IA.</li>
        <li><strong>Utilisez la sortie PNG pour la transparence.</strong> Le résultat téléchargé est toujours un PNG avec un arrière-plan transparent, que vous pouvez placer sur n'importe quel nouvel arrière-plan dans n'importe quel outil de design.</li>
      </ul>

      <h2>Cas d'usage : où les images sans arrière-plan comptent réellement</h2>

      <h3>Photos de produits e-commerce</h3>
      <p>
        Amazon, Shopify et la plupart des places de marché exigent ou recommandent fortement des images de produits sur fond blanc. Au lieu
        d'engager un photographe avec un studio ou de payer un service de retouche, vous pouvez photographier vos produits sur n'importe quelle
        surface neutre et supprimer l'arrière-plan en quelques secondes avec BrowseryTools. Traitez tout un catalogue de produits
        sans téléverser une seule image vers un service tiers.
      </p>

      <h3>Photos de profil et avatars</h3>
      <p>
        Les photos de profil LinkedIn, les avatars GitHub, les profils Slack et les biographies professionnelles bénéficient tous d'un arrière-plan
        net. Plutôt que de réserver une séance studio juste pour une photo de visage, prenez une bonne photo sous une lumière correcte
        et supprimez l'arrière-plan dans votre navigateur. Ajoutez ensuite un arrière-plan de couleur unie ou en dégradé dans n'importe quel éditeur.
      </p>

      <h3>Présentations et supports marketing</h3>
      <p>
        Les images détourées s'intègrent proprement aux arrière-plans de diapositives, aux mises en page d'infographies et aux conceptions de bannières. Au lieu de
        chercher des fichiers PNG qui ont déjà un arrière-plan transparent, créez les vôtres à partir de n'importe quelle photo dont vous disposez.
        C'est particulièrement utile pour les photos des membres de l'équipe dans les présentations d'entreprise.
      </p>

      <h3>Contenu pour les réseaux sociaux</h3>
      <p>
        Les publications Instagram, les miniatures YouTube, les bannières Twitter et les contenus similaires bénéficient souvent de sujets
        isolés placés sur des arrière-plans de marque ou thématiques. Une version sans arrière-plan d'un sujet vous offre une flexibilité
        totale pour des compositions créatives.
      </p>

      <h3>Travail client et confidentialité</h3>
      <p>
        Si vous travaillez avec des images de clients — photos de produits, portraits, supports propriétaires — la dernière chose que vous
        voulez est de téléverser ces fichiers sur un serveur tiers. Avec BrowseryTools, les images des clients restent sur votre
        machine. Point final.
      </p>

      <h2>Comparaison directe : BrowseryTools face aux alternatives</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Fonctionnalité</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Remove.bg</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Canva Pro</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Photoshop</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Coût</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Gratuit</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>À partir de 0,20 $/image</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>12,99 $/mois</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>21,99 $/mois</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Téléversements d'images</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Aucun — local uniquement</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Oui, vers leurs serveurs</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Oui, vers leurs serveurs</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Local (application de bureau)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Compte requis</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Non</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Pour les crédits, oui</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Oui</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Oui (Adobe ID)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Sortie en pleine résolution</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Oui</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Payant uniquement</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Oui</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Oui</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Filigranes</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Aucun</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Palier gratuit uniquement</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Aucun</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Aucun</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Fonctionne hors ligne</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Oui (après le premier chargement)</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Non</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Non</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Oui</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Suppression d'arrière-plan en lot</h2>
      <p>
        Si vous avez un lot d'images de produits à traiter, BrowseryTools prend également en charge la suppression d'arrière-plan en lot. Vous
        pouvez téléverser plusieurs images à la fois et les traiter successivement sans quitter l'outil ni configurer le moindre
        script de traitement par lot. Pour les vendeurs e-commerce ou les créateurs de contenu disposant de grandes bibliothèques, cela rend l'outil
        réellement pratique pour de vrais flux de travail — pas seulement pour des tâches ponctuelles.
      </p>

      <h2>Qu'advient-il de vos images ?</h2>
      <p>
        Rien ne quitte votre appareil. Lorsque vous téléversez une image vers l'outil de suppression d'arrière-plan de BrowseryTools, le
        JavaScript de la page lit le fichier à l'aide de l'API File du navigateur et le transmet directement au runtime ONNX
        s'exécutant dans un Web Worker. Le modèle de segmentation s'exécute localement, le PNG de sortie est généré en
        mémoire, et vous le téléchargez. À aucun moment des données d'image ne transitent par une connexion réseau.
      </p>
      <p>
        Vous pouvez le vérifier vous-même en ouvrant l'onglet Réseau de votre navigateur dans les outils de développement pendant l'utilisation de l'outil.
        Après le téléchargement initial du modèle, vous verrez zéro requête réseau lors du traitement d'une image.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>La transparence par conception :</strong> BrowseryTools est bâti sur le principe que vos données vous appartiennent.
        Le traitement par IA dans le navigateur n'est pas un contournement — c'est le bon choix architectural pour des outils qui
        manipulent du contenu personnel ou sensible.
      </div>

      <h2>Essayez-le dès maintenant</h2>
      <p>
        Pas de compte. Pas de carte bancaire. Pas de filigrane. Pas de limite de taille sur le palier gratuit — parce qu'il n'y a pas de palier payant.
        Ouvrez simplement l'outil, déposez-y une image, et téléchargez un PNG transparent et net en quelques secondes.
      </p>
      <div style={{background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Supprimez l'arrière-plan de vos images — gratuit, privé, instantané
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.9rem", color: "#64748b"}}>
          Propulsé par l'IA. S'exécute localement. Aucun téléversement. Aucun filigrane.
        </p>
        <a
          href="/tools/bg-removal"
          style={{background: "linear-gradient(135deg, #ec4899, #be185d)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Ouvrir l'outil de suppression d'arrière-plan →
        </a>
      </div>
    </div>
  );
}
