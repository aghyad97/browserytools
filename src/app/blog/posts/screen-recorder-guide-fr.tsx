import Link from 'next/link';
import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Les logiciels d'enregistrement d'écran ont historiquement été l'un de ces outils où vous payez un supplément pour
        quelque chose qui devrait être un utilitaire de base. Camtasia coûte environ 300 $ en achat
        unique, ou 170 $/an en abonnement. ScreenFlow pour Mac est à 150 $. Loom — qui se positionne
        comme l'option légère — limite les utilisateurs gratuits à des enregistrements de 5 minutes et pousse tout le monde
        vers un abonnement payant. Et chacun de ces outils nécessite une installation, la création d'un compte
        et de faire confiance à une application tierce ayant accès à tout votre écran.
      </p>
      <ToolCTA slug="screen-recorder" variant="inline" />
      <p>
        Voici ce que la plupart des gens ne réalisent pas : votre navigateur sait déjà comment enregistrer votre écran.
        L'<strong>API Screen Capture</strong> (<code>getDisplayMedia</code>) est une norme du W3C qui
        est livrée dans tous les principaux navigateurs depuis des années. L'{" "}
        <Link href="/tools/screen-recorder">Enregistreur d'écran de BrowseryTools</Link> y ajoute une interface
        nette et pratique — pour que vous puissiez enregistrer votre écran, une fenêtre spécifique ou un seul onglet de
        navigateur sans rien installer, sans créer de compte ni payer un centime.
      </p>

      <h2>Compatibilité des navigateurs : cela fonctionne pour plus de 98 % de vos utilisateurs</h2>
      <p>
        L'API Screen Capture bénéficie d'une large prise en charge sur tous les navigateurs modernes. Vous n'avez pas à vous soucier
        de la compatibilité pour aucun public réaliste :
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Navigateur</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Version minimale</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Année de sortie</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Remarques</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Chrome", "72+", "2019", "Prise en charge complète, y compris la capture d'onglet"],
              ["Edge", "79+", "2020", "Basé sur Chromium ; même prise en charge que Chrome"],
              ["Firefox", "66+", "2019", "Prise en charge complète ; excellente capture audio"],
              ["Safari", "13+", "2019", "Pris en charge ; capture d'onglet ajoutée dans Safari 15.4"],
            ].map(([browser, version, year, notes], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{browser}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace"}}>{version}</td>
                <td style={{padding: "11px 16px"}}>{year}</td>
                <td style={{padding: "11px 16px", opacity: 0.8}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        La part de marché combinée des navigateurs pour ces versions couvre bien plus de 98 % des utilisateurs de bureau dans le monde.
        En pratique, si votre public utilise un navigateur moderne — ce qui est presque certainement le cas
        — l'API Screen Capture fonctionne tout simplement.
      </p>

      <h2>Ce que vous pouvez capturer</h2>
      <p>
        Lorsque vous cliquez sur « Démarrer l'enregistrement », le navigateur affiche son sélecteur d'écran natif. Trois modes
        de capture vous sont proposés, et le choix importe selon votre cas d'usage :
      </p>
      <ul>
        <li>
          <strong>Tout l'écran :</strong> capture tout ce qui est visible sur l'un de vos moniteurs. Idéal pour
          les démonstrations où vous passez d'une application à l'autre, ou lorsque vous voulez montrer un comportement
          au niveau du système. Notez que cela montre tout — y compris les notifications, la barre des tâches et toutes les autres
          fenêtres — alors fermez le contenu sensible avant d'enregistrer.
        </li>
        <li>
          <strong>Une fenêtre d'application spécifique :</strong> capture une seule fenêtre, même si d'autres
          fenêtres la chevauchent. L'enregistrement reste concentré sur cette application. Bien pour les démonstrations de logiciels
          où vous voulez rester dans une seule application sans révéler vos autres fenêtres ouvertes.
        </li>
        <li>
          <strong>Un seul onglet de navigateur :</strong> c'est l'option la plus respectueuse de la confidentialité. Seul le
          contenu d'un onglet de navigateur est capturé — les autres onglets, votre barre d'adresse, les autres applications et
          votre bureau sont complètement exclus de l'enregistrement. Idéal pour enregistrer des présentations d'applications web
          ou des démonstrations basées sur le navigateur sans rien montrer d'autre.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>La capture d'onglet pour une confidentialité maximale :</strong> si vous enregistrez une démonstration d'une application web
        et ne voulez pas montrer d'autres onglets de navigateur, d'autres applications ni aucune interface système, utilisez l'option
        « Onglet du navigateur » dans le sélecteur d'écran. Seul le contenu en pixels de cet unique onglet est capturé.
        Rien d'autre sur votre machine n'est visible dans l'enregistrement.
      </div>

      <h2>Étape par étape : comment utiliser l'Enregistreur d'écran de BrowseryTools</h2>
      <p>
        L'ensemble du processus prend moins d'une minute pour obtenir votre premier enregistrement. Voici exactement comment cela
        fonctionne :
      </p>
      <ol>
        <li>
          <strong>Ouvrez l'outil :</strong> rendez-vous sur <Link href="/tools/screen-recorder">/tools/screen-recorder</Link>.
          Aucune connexion, aucune configuration, rien à installer. L'outil est prêt dès le chargement de la page.
        </li>
        <li>
          <strong>Cliquez sur « Démarrer l'enregistrement » :</strong> le navigateur affiche immédiatement sa boîte de dialogue native de
          sélection d'écran. C'est une interface de niveau navigateur — le site web ne peut pas voir ni influencer ce qui est affiché
          dans cette boîte de dialogue, et il ne peut pas commencer à capturer tant que vous n'avez pas explicitement confirmé votre sélection.
        </li>
        <li>
          <strong>Choisissez ce qu'il faut capturer :</strong> sélectionnez « Tout l'écran », « Fenêtre » ou « Onglet du navigateur »
          dans les onglets du sélecteur. Cliquez sur la vignette de l'écran/fenêtre/onglet que vous voulez enregistrer, puis
          cliquez sur le bouton « Partager » pour commencer.
        </li>
        <li>
          <strong>Enregistrez :</strong> l'outil affiche un compteur de temps écoulé en direct pour que vous sachiez toujours depuis
          combien de temps vous enregistrez. Passez à n'importe quelle application ou contenu que vous présentez — l'onglet du
          navigateur exécutant l'enregistreur reste actif en arrière-plan. Vous pouvez vérifier le minuteur en
          jetant un œil à l'onglet.
        </li>
        <li>
          <strong>Cliquez sur « Arrêter l'enregistrement » :</strong> lorsque vous avez terminé, cliquez sur Arrêter. L'enregistrement est
          instantanément disponible sous forme d'aperçu vidéo dans l'outil. Aucun traitement, aucune attente — il apparaît
          immédiatement car tout a été capturé localement en mémoire.
        </li>
        <li>
          <strong>Prévisualisez et téléchargez :</strong> visionnez l'aperçu pour confirmer que l'enregistrement a bien capturé
          ce que vous vouliez. Cliquez sur « Télécharger » pour enregistrer le fichier sous forme de vidéo <code>.webm</code> sur votre
          machine locale. L'enregistrement n'est jamais téléversé nulle part.
        </li>
      </ol>

      <h2>Le format de sortie : WebM</h2>
      <p>
        L'API Screen Capture produit une vidéo au format <strong>WebM</strong> en utilisant le codec VP8 ou VP9
        (selon celui que votre navigateur sélectionne). WebM est un format ouvert et libre de droits
        développé par Google et normalisé pour un usage web. Pour les captures d'écran vidéo en particulier, il a plusieurs
        avantages par rapport au MP4 :
      </p>
      <ul>
        <li>
          <strong>Taille de fichier plus petite :</strong> la compression VP9 est très efficace pour le contenu d'écran
          comportant de grandes zones plates de couleur, du texte et des éléments d'interface — exactement ce que contiennent les captures d'écran vidéo.
          Une capture d'écran vidéo de 5 minutes en WebM est généralement de 30 à 50 % plus petite que le même enregistrement en H.264 MP4.
        </li>
        <li>
          <strong>Norme ouverte :</strong> aucuns frais de licence, aucun paiement de redevance, aucune entrave de brevet.
          WebM est le format vidéo natif du web.
        </li>
        <li>
          <strong>Lecture directe dans le navigateur :</strong> WebM se lit nativement dans Chrome, Firefox et Edge
          sans aucun plugin. Vous pouvez partager un fichier WebM et n'importe qui sur ces navigateurs peut le regarder directement.
        </li>
      </ul>
      <p>
        <strong>Convertir le WebM en MP4 :</strong> si vous devez partager l'enregistrement avec quelqu'un utilisant
        QuickTime sur macOS ou Windows Media Player — ou le téléverser sur une plateforme qui n'accepte pas le WebM
        — vous pouvez le convertir gratuitement à l'aide d'un outil local comme{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer">HandBrake</a> (open
        source, traitement local) ou en utilisant la ligne de commande FFmpeg. La conversion prend quelques secondes
        et le MP4 résultant est universellement compatible.
      </p>

      <div style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6", margin: "16px 0"}}>
        <pre style={{margin: 0}}><code>{`# FFmpeg one-liner to convert WebM to MP4 (free, local, no upload needed):
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4`}</code></pre>
      </div>

      <h2>Cas d'usage : quand un enregistreur de navigateur est exactement ce dont vous avez besoin</h2>

      <h3>Rapports de bogues</h3>
      <p>
        Décrire un bogue par écrit est l'une des expériences les plus frustrantes du développement logiciel.
        « Ça ne marche pas quand je clique sur le bouton » est presque inutile. Un enregistrement d'écran de 30 secondes des
        étapes exactes pour reproduire — montrant ce sur quoi vous avez cliqué, ce qui s'est passé, ce qui aurait dû se passer
        — donne à un ingénieur tout ce dont il a besoin pour diagnostiquer le problème immédiatement. Enregistrez le bogue au
        moment où il se produit, téléchargez le WebM et attachez-le au ticket. Aucun téléversement vers un service tiers,
        aucune limite de taille sur Jira ou Linear, et aucune préoccupation de confidentialité quant à ce qui était visible à l'écran
        pendant l'enregistrement.
      </p>

      <h3>Création de tutoriels sans logiciel lourd</h3>
      <p>
        Tous les tutoriels n'ont pas besoin d'une production professionnelle. Si vous documentez un processus pour votre équipe
        — comment configurer un outil, comment naviguer dans un flux de travail complexe, comment mettre en place un environnement —
        un enregistrement d'écran avec narration le capture en quelques minutes. L'enregistreur de BrowseryTools vous permet
        d'inclure l'audio du microphone (accordez l'autorisation au navigateur lorsqu'il vous y invite), pour que vous puissiez narrer pendant que
        vous travaillez. Le résultat est un tutoriel complet et autonome qui tient dans un seul fichier téléchargeable.
      </p>

      <h3>Revues de code</h3>
      <p>
        Les commentaires écrits sur une pull request sont souvent insuffisants pour un retour nuancé. Un enregistrement d'écran
        où vous parcourez un diff oralement — « ici, à la ligne 42, ceci me préoccupe parce que… » —
        est nettement plus efficace que d'écrire un commentaire de cinq paragraphes. Enregistrez une présentation de 3 minutes
        de la PR, téléchargez-la et publiez-la en pièce jointe ou partagez le fichier. Votre relecteur obtient le
        contexte complet de votre raisonnement sans réunion.
      </p>

      <h3>Démonstrations à distance et communication asynchrone</h3>
      <p>
        Plutôt que de planifier une réunion pour démontrer une fonctionnalité, enregistrez-la. Un enregistrement de 2 minutes montrant la
        fonctionnalité en action est souvent plus persuasif et efficace qu'une démonstration en direct, car il peut être
        regardé à tout moment, rejoué au besoin et partagé avec n'importe qui dans l'organisation. Enregistrez votre
        démonstration à l'avance, vérifiez-la et envoyez-la quand elle est prête. Aucune planification, aucun conflit de fuseaux horaires,
        aucune friction de « pouvez-vous partager votre écran ».
      </p>

      <h3>Tickets de support</h3>
      <p>
        Pour les équipes de support ou les services d'assistance internes, un enregistrement d'écran soumis avec un ticket de support
        réduit considérablement les allers-retours. Au lieu de poser dix questions de clarification à l'utilisateur sur
        ce qu'il faisait au moment où le problème est survenu, il enregistre exactement ce qui s'est passé. L'agent de
        support voit le problème de première main, le résout souvent immédiatement, et l'utilisateur obtient une réponse plus rapide.
      </p>

      <h2>Audio : inclure le microphone dans votre enregistrement</h2>
      <p>
        Lorsque vous démarrez l'enregistrement, le navigateur vous demande s'il faut inclure l'audio. Si vous voulez narrer
        votre enregistrement, autorisez l'accès au microphone lorsqu'il vous y invite. Votre voix sera enregistrée aux côtés de la
        capture d'écran dans le même fichier WebM — aucune piste audio distincte à synchroniser, aucun logiciel
        supplémentaire nécessaire.
      </p>
      <p>
        Si vous voulez enregistrer l'audio du système (les sons provenant de votre ordinateur — musique, sons de
        notification, audio des applications), cela est géré différemment selon les navigateurs. Chrome sous Windows
        autorise la capture de l'audio système lors de l'enregistrement d'un onglet de navigateur. Sous macOS, la capture de l'audio système
        nécessite un périphérique audio virtuel comme BlackHole ou Loopback, car le système d'exploitation n'expose pas d'
        API de capture de l'audio système. Pour la plupart des cas d'usage de capture d'écran vidéo — où la narration est l'audio principal —
        l'enregistrement du microphone est suffisant et fonctionne de façon cohérente sur toutes les plateformes.
      </p>

      <h2>Confidentialité : l'enregistrement ne quitte jamais votre navigateur</h2>
      <p>
        Ce n'est pas un détail mineur. L'enregistrement est stocké en mémoire sous forme d'objet <code>Blob</code>
        à l'intérieur de votre onglet de navigateur. Lorsque vous cliquez sur « Télécharger », le navigateur écrit ce blob dans votre
        système de fichiers local. Rien n'est téléversé vers un serveur — ni les serveurs de BrowseryTools, ni aucun service
        cloud. L'enregistrement ne transite par le réseau à aucun moment.
      </p>
      <p>
        Cela importe le plus lorsque vous enregistrez du contenu sensible : flux de travail internes d'entreprise, données
        clients, fonctionnalités de produits non encore dévoilées, ou tout ce qui ne devrait pas quitter votre machine. Avec
        les enregistreurs d'écran basés sur le cloud, vous devez faire confiance au fait que l'infrastructure de téléversement, de stockage et de
        contrôle d'accès du fournisseur est sécurisée. Avec un enregistreur local basé sur le navigateur, il n'y a aucun
        téléversement à craindre.
      </p>

      <h2>Limitations : ce que l'enregistreur de navigateur ne peut pas faire</h2>
      <p>
        L'approche basée sur le navigateur est idéale pour les cas d'usage décrits ci-dessus, mais elle a de réelles
        limitations que vous devriez connaître avant d'y avoir recours dans des contextes où elle sera insuffisante :
      </p>
      <ul>
        <li>
          <strong>Pas d'éditeur vidéo intégré :</strong> l'enregistreur capture et télécharge la vidéo brute.
          Si vous devez rogner le début et la fin, couper des sections, ajouter des annotations, zoomer ou superposer du texte,
          vous aurez besoin d'un éditeur vidéo séparé. Pour des modifications rapides,{" "}
          <a href="https://www.veed.io" target="_blank" rel="noopener noreferrer">VEED.io</a> ou
          la version gratuite de DaVinci Resolve gèrent tous deux bien le rognage de base.
        </li>
        <li>
          <strong>Pas de superposition webcam :</strong> il n'y a pas de flux webcam en incrustation d'image. Si vous avez besoin
          d'une superposition « tête parlante » dans le coin de l'enregistrement, il vous faut un logiciel de bureau comme OBS
          ou Camtasia.
        </li>
        <li>
          <strong>Contraintes de mémoire pour les très longs enregistrements :</strong> comme l'enregistrement est
          conservé dans la mémoire du navigateur jusqu'au téléchargement, les très longs enregistrements (45 min et plus) peuvent consommer
          une RAM importante. Pour les enregistrements de longue durée, un logiciel de bureau qui écrit directement sur le disque
          au fur et à mesure de l'enregistrement est plus approprié.
        </li>
        <li>
          <strong>Pas de partage cloud automatique :</strong> le téléchargement est un fichier local. Si votre flux de travail
          nécessite un hébergement cloud immédiat et un lien partageable, vous devrez téléverser le fichier
          manuellement par la suite, ou utiliser un service comme Loom qui gère l'hébergement automatiquement.
        </li>
      </ul>

      <h2>Quand vous devriez plutôt utiliser un logiciel de bureau</h2>
      <p>
        L'enregistreur de navigateur est le bon outil pour les enregistrements de courte à moyenne durée où la simplicité et
        la confidentialité importent. Mais un logiciel de bureau est réellement meilleur lorsque :
      </p>
      <ul>
        <li>Vous devez enregistrer pendant plus de 30 minutes en continu</li>
        <li>Vous avez besoin d'une superposition webcam ou d'une composition multi-sources</li>
        <li>Vous devez monter, ajouter des sous-titres, des effets de zoom ou des annotations</li>
        <li>Vous devez enregistrer des séquences de jeu ou du contenu à fréquence d'images élevée</li>
        <li>Vous avez besoin d'un téléversement cloud automatique et de liens partageables immédiatement après l'enregistrement</li>
      </ul>
      <p>
        Pour ces cas, OBS Studio (gratuit, open source) est l'option la plus complète. Pour le montage,
        DaVinci Resolve dispose d'un palier gratuit généreux. Les deux nécessitent une installation mais offrent des capacités
        qui vont bien au-delà de ce que tout outil basé sur le navigateur peut égaler.
      </p>

      <h2>Comparaison : BrowseryTools face aux options d'enregistrement d'écran courantes</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Fonctionnalité</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Loom (gratuit)</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>OBS Studio</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Camtasia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Coût", "Gratuit", "Gratuit / 12,50 $/mois", "Gratuit", "~300 $ en une fois"],
              ["Installation requise", "Non", "Extension requise", "Oui", "Oui"],
              ["Compte requis", "Non", "Oui", "Non", "Oui"],
              ["Vidéo téléversée vers le cloud", "Jamais", "Toujours", "Non", "Non"],
              ["Limite de durée d'enregistrement", "Aucune*", "5 min (gratuit)", "Aucune", "Aucune"],
              ["Éditeur vidéo intégré", "Non", "Rognage de base", "Non", "Oui (avancé)"],
              ["Superposition webcam", "Non", "Oui", "Oui", "Oui"],
              ["Capture d'onglet uniquement", "Oui", "Oui", "Non", "Non"],
              ["Format de sortie", "WebM", "MP4 (cloud)", "MP4/MKV", "MP4"],
            ].map(([feature, bt, loom, obs, cam], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{loom}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{obs}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{cam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize: "13px", opacity: 0.7}}>
        * Les très longs enregistrements (&gt;45 min) peuvent être limités par la mémoire disponible du navigateur.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Note sur la confidentialité :</strong> lorsque vous utilisez Loom, chaque enregistrement est téléversé vers les serveurs de Loom
        et y est stocké par défaut. Le contenu de votre écran — qui peut inclure des outils internes, des données clients
        sensibles ou des fonctionnalités non dévoilées — vit sur un serveur tiers. Les enregistrements de BrowseryTools
        ne sont jamais téléversés. Le fichier passe de votre navigateur directement à votre disque dur.
      </div>

      <h2>Commencez à enregistrer maintenant</h2>
      <p>
        Pour la grande majorité des tâches d'enregistrement d'écran — un rapide rapport de bogue, un tutoriel d'équipe, une
        démonstration de fonctionnalité, une présentation de revue de code — le navigateur est tout ce dont vous avez besoin. Aucune installation, aucun
        abonnement, aucun compromis sur la confidentialité.
      </p>
      <p>
        Ouvrez l'<Link href="/tools/screen-recorder">Enregistreur d'écran de BrowseryTools</Link>, cliquez sur Démarrer,
        capturez ce dont vous avez besoin et téléchargez-le. L'ensemble du processus, de l'ouverture de l'outil à l'obtention d'un
        fichier WebM sur votre bureau, prend moins de deux minutes.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎬</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Enregistrez votre écran maintenant — gratuit, sans installation</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Capturez votre écran, une fenêtre ou un onglet de navigateur. Téléchargez en WebM. Rien n'est téléversé nulle part.
          Aucun compte, aucune extension, aucun coût.
        </p>
        <Link
          href="/tools/screen-recorder"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(239,68,68)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Ouvrir l'Enregistreur d'écran →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Outils associés :{" "}
        <Link href="/tools/image-compression">Compression d'image</Link> ·{" "}
        <Link href="/tools/bg-removal">Suppression d'arrière-plan</Link> ·{" "}
        <Link href="/tools/image-converter">Convertisseur d'image</Link> ·{" "}
        <Link href="/">Tous les BrowseryTools</Link>
      </p>
      <ToolCTA slug="screen-recorder" variant="card" />
    </div>
  );
}
