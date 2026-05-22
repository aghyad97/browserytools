export default function Content() {
  return (
    <div>
      <p>
        Chaque ordinateur portable et chaque téléphone est livré avec des réglages de mise en veille qui
        sont — globalement — une bonne chose. Ils économisent la batterie, réduisent la chaleur et prolongent
        la durée de vie de l&apos;écran. Mais il y a des moments où ces mêmes réglages deviennent une petite
        torture. Vous êtes au milieu d&apos;un téléchargement de deux heures, en train de regarder une longue
        vidéo de formation, de présenter un diaporama, de surveiller un tableau de bord, ou de lire un article
        qui exige votre attention, et soudain l&apos;écran s&apos;assombrit et l&apos;ordinateur commence à
        glisser vers la veille.
      </p>
      <p>
        La solution traditionnelle est laborieuse. Sur macOS, les gens installent Amphetamine ou Caffeine.
        Sur Windows, ils ajustent les paramètres d&apos;alimentation ou lancent un utilitaire appelé
        PowerToys. Sur Linux, ils fouillent dans les options systemd. Chacune de ces solutions exige
        d&apos;installer quelque chose, de lui faire confiance, et souvent de payer ou de naviguer dans des
        menus de réglages écrits par et pour des administrateurs système.
      </p>
      <p>
        Il existe une option bien plus simple que presque personne ne connaît : votre navigateur peut déjà le
        faire, sur tous les systèmes d&apos;exploitation, sans aucune installation. C&apos;est toute
        l&apos;idée derrière l&apos;outil{" "}
        <a href="/tools/keep-awake">Keep Awake de BrowseryTools</a> — un seul onglet à ouvrir et un seul
        bouton à presser pour empêcher votre écran de se mettre en veille, sans application, sans compte et
        sans configuration.
      </p>

      <h2>Comment fonctionne Keep Awake — l&apos;API Screen Wake Lock</h2>
      <p>
        Les navigateurs modernes exposent un standard web appelé{" "}
        <strong>Screen Wake Lock API</strong>. Lorsqu&apos;une page appelle{" "}
        <code>navigator.wakeLock.request("screen")</code>, le navigateur demande poliment au système
        d&apos;exploitation de garder l&apos;écran allumé tant que l&apos;onglet est visible. Le système
        s&apos;exécute. Votre écran reste allumé, sans assombrissement par expiration de délai, sans mise en
        veille automatique, jusqu&apos;à ce que vous libériez le verrou ou que l&apos;onglet soit masqué.
      </p>
      <p>
        C&apos;est exactement le mécanisme que YouTube, Netflix et Google Maps utilisent lorsque vous regardez
        une vidéo ou suivez un itinéraire pas à pas. C&apos;est une primitive bien prise en charge, attentive
        à la batterie, au niveau du système d&apos;exploitation. Ce n&apos;est pas une astuce qui agite la
        souris ou joue un son silencieux — c&apos;est une demande formelle au système de garder l&apos;écran
        actif. Chrome, Edge, Safari (sur iOS 16.4+ et macOS) et Firefox la prennent tous en charge
        aujourd&apos;hui.
      </p>

      <h2>Pourquoi un outil de navigateur surpasse une application native</h2>
      <p>
        Une fois que vous voyez à quel point le navigateur peut le faire facilement, l&apos;intérêt
        d&apos;installer une application dédiée s&apos;effondre. Voici pourquoi l&apos;approche navigateur
        l&apos;emporte pour une tâche comme celle-ci :
      </p>
      <p>
        <strong>Multiplateforme par défaut.</strong> Mac, Windows, Linux, Chromebook, iPad, iPhone, Android —
        le même outil, le même comportement, la même URL. Vous n&apos;avez pas besoin d&apos;une version Mac,
        d&apos;une version Windows et d&apos;une version Android. Une seule page web fait tout.
      </p>
      <p>
        <strong>Aucune confiance requise.</strong> Les applications natives «&nbsp;rester éveillé&nbsp;» ont
        besoin d&apos;une autorisation pour modifier les paramètres d&apos;alimentation, et beaucoup demandent
        plus d&apos;accès qu&apos;elles n&apos;en ont strictement besoin. L&apos;outil de navigateur a besoin
        d&apos;exactement une autorisation — celle qu&apos;il demande — et vous pouvez la révoquer en fermant
        l&apos;onglet.
      </p>
      <p>
        <strong>Aucune friction d&apos;installation.</strong> Ouvrez l&apos;URL, cliquez sur le bouton,
        terminé. Vous pouvez l&apos;ajouter aux favoris ou l&apos;épingler à votre barre d&apos;onglets. Vous
        pouvez partager le lien avec un collègue qui a le même problème et il peut l&apos;utiliser en dix
        secondes.
      </p>
      <p>
        <strong>Respectueux de la vie privée.</strong> L&apos;outil{" "}
        <a href="/tools/keep-awake">Keep Awake de BrowseryTools</a> s&apos;exécute à 100&nbsp;% dans votre
        navigateur. Il n&apos;y a aucun suivi analytique de ce que vous faites, aucun compte à créer, aucun
        serveur qui sache quand vous l&apos;avez activé. C&apos;est une page statique qui dialogue
        directement avec l&apos;API Wake Lock de votre navigateur.
      </p>

      <h2>Options de durée — de 15 minutes à l&apos;infini</h2>
      <p>
        Tous les scénarios n&apos;exigent pas le même délai. L&apos;outil Keep Awake vous offre un éventail de
        préréglages pour que vous puissiez adapter la durée à ce que vous faites réellement :
      </p>
      <p>
        <strong>15 minutes</strong> — idéal pour de courtes lectures, un téléchargement rapide ou un seul
        appel d&apos;assistance.
        <br />
        <strong>30 minutes</strong> — assez pour une session de travail concentré ou un tutoriel de longueur
        moyenne.
        <br />
        <strong>1 heure</strong> — parfait pour la plupart des appels vidéo, des webinaires ou une session de
        travail de la durée d&apos;un long métrage.
        <br />
        <strong>2 heures</strong> — longues présentations, sessions de programmation en binôme prolongées ou
        longs métrages.
        <br />
        <strong>4 heures et 8 heures</strong> — pour les téléchargements nocturnes, les longs entraînements,
        les événements façon conférence ou les tableaux de bord que vous voulez surveiller toute la journée.
        <br />
        <strong>Durée personnalisée</strong> — saisissez le nombre exact de minutes ou d&apos;heures que vous
        voulez. 45 minutes, 90 minutes, 3 heures, tout ce qui convient à la tâche.
        <br />
        <strong>Infini</strong> — l&apos;option nucléaire. L&apos;écran reste allumé jusqu&apos;à ce que vous
        appuyiez sur stop. Utilisez-la quand vous ne savez vraiment pas combien de temps il vous faut, ou
        quand vous voulez surveiller un long processus et décider plus tard.
      </p>
      <p>
        Le compte à rebours s&apos;affiche en direct dans le titre de la page, ce qui vous permet de basculer
        vers un autre onglet et de jeter un œil à votre barre d&apos;onglets pour voir combien de temps il
        reste. Lorsque le minuteur expire, l&apos;outil libère automatiquement le verrou d&apos;éveil et votre
        ordinateur retrouve son comportement de veille normal — sans effet secondaire persistant.
      </p>

      <h2>Scénarios concrets où vous en avez vraiment besoin</h2>
      <p>
        <strong>Télécharger un gros fichier ou installer un système d&apos;exploitation.</strong> Certaines
        opérations s&apos;interrompent si la machine se met en veille. Activer Keep Awake pendant qu&apos;un
        téléchargement de 40 Go s&apos;exécute garantit qu&apos;il se termine sans interruption.
      </p>
      <p>
        <strong>Présenter ou partager son écran.</strong> Rien n&apos;est plus gênant que votre ordinateur qui
        s&apos;assombrit au milieu d&apos;une diapositive lors d&apos;un argumentaire client important. Réglez
        Keep Awake sur deux heures avant de commencer, et l&apos;écran du présentateur reste lumineux du
        début à la fin.
      </p>
      <p>
        <strong>Regarder une longue vidéo ou un direct.</strong> Si vous regardez la diffusion d&apos;une
        conférence, un office religieux, un séminaire de formation ou un événement familial, le Wake Lock
        garde l&apos;écran allumé pour que vous n&apos;ayez pas à bouger la souris toutes les quelques
        minutes.
      </p>
      <p>
        <strong>Surveiller un tableau de bord ou un processus de build.</strong> Les développeurs qui
        surveillent des pipelines CI, des tableaux de bord d&apos;incidents, des journaux de serveur ou des
        écrans de trading ont besoin que l&apos;écran reste visible pendant des heures. Le mode Infini est
        conçu spécialement pour cela.
      </p>
      <p>
        <strong>Lire un long document.</strong> Les contrats juridiques, les articles de recherche et la
        documentation technique méritent de l&apos;attention sans que l&apos;écran ne s&apos;éteigne toutes
        les dix minutes. Quarante-cinq minutes de Keep Awake vous offrent le temps de concentration dont
        vous avez besoin.
      </p>
      <p>
        <strong>Exécuter une machine virtuelle ou un long build.</strong> Si vous compilez du code, exécutez
        une suite de tests ou entraînez un petit modèle, vous ne voulez pas que le système d&apos;exploitation
        suspende le travail parce que l&apos;ordinateur a cru que vous étiez parti.
      </p>

      <h2>Ce qu&apos;il faut savoir (et la seule chose qu&apos;il ne peut pas faire)</h2>
      <p>
        L&apos;API Screen Wake Lock est un verrou d&apos;<em>écran</em>. Elle empêche l&apos;écran de
        s&apos;assombrir et le système d&apos;exploitation de déclencher la veille due à l&apos;inactivité.
        Sur la plupart des ordinateurs portables, garder l&apos;écran allumé empêche aussi la machine
        elle-même de se mettre en veille — car le système ne se met en veille que lorsqu&apos;il est inactif,
        et un écran actif compte comme une activité.
      </p>
      <p>
        Cependant, si vous <strong>fermez physiquement le capot</strong>, la plupart des systèmes
        d&apos;exploitation sont configurés pour se mettre en veille quelle que soit la demande d&apos;une
        application. C&apos;est un comportement au niveau matériel et aucun outil de navigateur ne peut le
        contourner. Si vous avez besoin que l&apos;ordinateur reste éveillé capot fermé (par exemple, pour
        exécuter un long processus tout en étant branché), vous devrez modifier séparément les paramètres
        d&apos;alimentation de votre système d&apos;exploitation. Keep Awake gère tout le reste.
      </p>
      <p>
        L&apos;autre subtilité est que le verrou d&apos;éveil est libéré automatiquement lorsque l&apos;onglet
        est masqué. C&apos;est une protection de confidentialité et de batterie intégrée à l&apos;API.
        L&apos;outil Keep Awake de BrowseryTools écoute le retour à la visibilité de l&apos;onglet et
        réacquiert le verrou automatiquement — ainsi, si vous changez d&apos;onglet ou d&apos;application et
        revenez, le maintien en éveil reprend de manière transparente. Le seul moyen de l&apos;interrompre
        est de fermer ou de réduire complètement l&apos;ensemble du navigateur.
      </p>

      <h2>Pourquoi aucun téléchargement, aucune publicité, aucun suivi</h2>
      <p>
        Chaque outil de BrowseryTools suit la même philosophie : s&apos;exécuter entièrement dans le
        navigateur, ne jamais téléverser de données, ne jamais exiger de compte, ne jamais afficher de
        publicité. Keep Awake en est un exemple particulièrement épuré. Il n&apos;y a littéralement rien à
        envoyer où que ce soit. L&apos;outil demande une autorisation à votre navigateur, le navigateur la
        demande à votre système d&apos;exploitation, et c&apos;est toute la transaction. Il n&apos;y a aucune
        donnée identifiant l&apos;utilisateur, aucun événement analytique, aucune télémétrie. Vous ouvrez la
        page, cliquez sur un bouton, et quelque chose d&apos;utile se produit.
      </p>
      <p>
        Comparez cela à l&apos;écosystème typique des applications «&nbsp;anti-veille&nbsp;» : vous cherchez
        dans l&apos;App Store ou le Play Store, vous trouvez des dizaines d&apos;applications avec des
        publicités intrusives, des demandes d&apos;autorisation qui réclament bien plus que nécessaire, et des
        paywalls par abonnement pour des fonctionnalités qu&apos;une page web de 20 lignes peut fournir
        gratuitement.
      </p>

      <h2>Essayez-le maintenant</h2>
      <p>
        Ouvrez l&apos;<a href="/tools/keep-awake">outil Keep Awake</a>, choisissez une durée — ou choisissez
        Infini si vous préférez — et appuyez sur le gros bouton vert. Votre ordinateur portable restera
        éveillé jusqu&apos;à la fin du minuteur ou jusqu&apos;à ce que vous appuyiez sur stop. Aucune
        installation, aucun compte, aucune clause en petits caractères. Si vous le trouvez utile,
        ajoutez-le aux favoris ou partagez le lien avec un ami qui a la même frustration.
      </p>
      <p>
        Et tant que vous y êtes, jetez un œil autour de vous. BrowseryTools propose des dizaines
        d&apos;autres utilitaires gratuits et respectueux de la vie privée qui s&apos;exécutent entièrement
        dans votre navigateur — d&apos;un{" "}
        <a href="/tools/pomodoro">minuteur Pomodoro</a> à un <a href="/tools/json-formatter">formateur JSON</a>,
        un <a href="/tools/password-generator">générateur de mots de passe</a>, une{" "}
        <a href="/tools/world-clock">horloge mondiale</a>, et plus encore. Tout est gratuit, tout est local,
        et rien ne vous demande de vous inscrire.
      </p>
    </div>
  );
}
