export default function Content() {
  return (
    <div>
      <p>
        Les codes de statut HTTP sont le langage que les serveurs utilisent pour indiquer aux clients ce
        qui s'est passé avec une requête. Tout développeur les rencontre constamment — dans les DevTools,
        les réponses d'API, les journaux d'erreurs, les alertes Slack à 3h du matin. Savoir ce que chaque
        code signifie réellement, quand utiliser quel code dans vos propres API, et ce que les plus
        courants signalent quant à un bug vous rend nettement plus rapide pour déboguer et construire de
        meilleurs services.
      </p>
      <p>
        Vous pouvez consulter n'importe quel code de statut HTTP avec la{" "}
        <a href="/tools/http-status">Référence des codes de statut HTTP BrowseryTools</a> — gratuit,
        sans inscription, tout s'exécute dans votre navigateur.
      </p>

      <h2>Les cinq catégories</h2>
      <p>
        Les codes de statut sont des nombres à trois chiffres. Le premier chiffre définit la catégorie :
      </p>
      <ul>
        <li><strong>1xx — Informationnel</strong> : La requête a été reçue ; le traitement continue. Ces codes sont rares dans la plupart des applications.</li>
        <li><strong>2xx — Succès</strong> : La requête a été reçue, comprise et acceptée.</li>
        <li><strong>3xx — Redirection</strong> : Une action supplémentaire est nécessaire pour compléter la requête. Le client doit suivre une redirection.</li>
        <li><strong>4xx — Erreur client</strong> : La requête était malformée ou non autorisée. C'est le client qui a fait une erreur.</li>
        <li><strong>5xx — Erreur serveur</strong> : Le serveur n'a pas pu répondre à une requête valide. C'est le serveur qui a fait une erreur.</li>
      </ul>
      <p>
        Cette règle du premier chiffre est importante : si vous voyez un code de statut que vous ne
        connaissez pas (comme <code>429</code>{" "}
        ou <code>451</code>), vous savez au moins si le problème vient du client ou du serveur, et si
        la requête a finalement abouti.
      </p>

      <h2>2xx : codes de succès</h2>
      <p>
        Ces codes indiquent au client que la requête a fonctionné. Le code spécifique précise comment :
      </p>
      <ul>
        <li>
          <strong>200 OK</strong> — le succès universel. Le corps de la réponse contient les données demandées. Utilisé pour les requêtes GET et la plupart des réponses renvoyant du contenu.
        </li>
        <li>
          <strong>201 Created</strong> — une nouvelle ressource a été créée. Doit inclure un en-tête <code>Location</code> pointant vers l'URL de la nouvelle ressource. À utiliser pour les requêtes POST qui créent des enregistrements, pas 200.
        </li>
        <li>
          <strong>204 No Content</strong> — la requête a réussi mais il n'y a pas de corps à retourner. Courant pour les requêtes DELETE et les opérations PATCH/PUT où le client n'a pas besoin de recevoir les données mises à jour. La réponse ne doit pas inclure de corps.
        </li>
        <li>
          <strong>206 Partial Content</strong> — utilisé avec les requêtes de plage (l'en-tête <code>Range</code>). Les lecteurs vidéo l'utilisent pour demander des plages d'octets spécifiques d'un fichier média sans télécharger le tout.
        </li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# REST API design pattern
POST   /api/users        → 201 Created  (body: new user object, Location: /api/users/123)
GET    /api/users/123    → 200 OK       (body: user object)
PATCH  /api/users/123    → 200 OK       (body: updated user) or 204 No Content
DELETE /api/users/123    → 204 No Content`}
      </pre>

      <h2>3xx : codes de redirection</h2>
      <p>
        Les redirections indiquent au client de chercher ailleurs. L'en-tête <code>Location</code>{" "}
        contient la nouvelle URL. La distinction clé est entre les redirections permanentes et
        temporaires, et entre les redirections qui conservent la méthode HTTP et celles qui la changent.
      </p>
      <ul>
        <li>
          <strong>301 Moved Permanently</strong> — la ressource a une nouvelle URL permanente. Les navigateurs et les moteurs de recherche mettent cela en cache. Le navigateur utilisera GET pour la redirection quelle que soit la méthode d'origine (une bizarrerie historique). À utiliser pour renommer définitivement une URL ou rediriger HTTP vers HTTPS dans une configuration ancienne.
        </li>
        <li>
          <strong>302 Found</strong> — redirection temporaire. Comme le 301, les navigateurs changent POST en GET lors de la redirection (selon la spec, bien que la spec était « incorrecte » — voir 307). À utiliser uniquement quand la redirection est vraiment temporaire.
        </li>
        <li>
          <strong>304 Not Modified</strong> — la version en cache est encore fraîche ; il n'y a pas de corps. Le serveur envoie cela en réponse à un GET conditionnel (avec <code>If-None-Match</code> ou <code>If-Modified-Since</code>). Le navigateur utilise sa copie en cache. Important pour l'efficacité des CDN et la réduction de la bande passante.
        </li>
        <li>
          <strong>307 Temporary Redirect</strong> — comme le 302, mais la spec garantit que la méthode HTTP d'origine est préservée. Si un POST résulte en un 307, le navigateur fera un POST vers la nouvelle URL. Utilisez 307 à la place du 302 pour les redirections temporaires non-GET.
        </li>
        <li>
          <strong>308 Permanent Redirect</strong> — comme le 301, mais garantit également la préservation de la méthode. Le standard moderne pour les redirections permanentes.
        </li>
      </ul>

      <h2>Idée reçue : 301 vs 302 pour le SEO</h2>
      <p>
        Les moteurs de recherche traitent le 301 comme un signal pour transférer le « capital de liens »
        (PageRank) de l'ancienne URL vers la nouvelle et mettre à jour leur index. Un 302 indique au
        robot d'indexation que la redirection est temporaire, il continue donc à indexer l'URL d'origine.
        Utiliser 302 quand vous voulez dire 301 peut supprimer le bénéfice SEO des redirections. À
        l'inverse, utiliser 301 quand la redirection est temporaire amène les moteurs de recherche à
        mettre la redirection en cache, rendant plus difficile son annulation.
      </p>

      <h2>4xx : codes d'erreur client</h2>
      <p>
        Ces codes indiquent que le client a envoyé une mauvaise requête. Ne retournez pas 5xx pour des
        erreurs client — cela induit en erreur la supervision et rend plus difficile l'identification
        d'un problème serveur vs une mauvaise entrée client.
      </p>
      <ul>
        <li>
          <strong>400 Bad Request</strong> — la requête est malformée. Champs obligatoires manquants, JSON invalide, types de données incorrects. Le 4xx le plus générique ; utilisez des codes plus spécifiques quand ils existent.
        </li>
        <li>
          <strong>401 Unauthorized</strong> — malgré son nom, cela signifie « non authentifié ». Le client n'a fourni aucune accréditation, ou les accréditations étaient invalides. La réponse doit inclure un en-tête <code>WWW-Authenticate</code> indiquant comment s'authentifier. Le nom est une erreur historique — « non authentifié » serait plus précis.
        </li>
        <li>
          <strong>403 Forbidden</strong> — authentifié mais non autorisé. Le serveur sait qui vous êtes (ou peu importe qui vous êtes) et vous n'avez pas la permission. Contrairement au 401, se réauthentifier n'aidera pas. Utilisez 403 quand un utilisateur tente d'accéder à une ressource qu'il n'est pas autorisé à voir.
        </li>
        <li>
          <strong>404 Not Found</strong> — la ressource n'existe pas à cette URL. Également retourné quand un serveur veut masquer l'existence d'une ressource aux utilisateurs non autorisés (retourner 403 confirmerait que la ressource existe ; retourner 404 masque ce fait).
        </li>
        <li>
          <strong>409 Conflict</strong> — la requête est en conflit avec l'état actuel de la ressource. Exemple classique : essayer de créer un utilisateur avec une adresse e-mail qui existe déjà, ou essayer de mettre à jour une ressource avec une version obsolète (conflit de verrouillage optimiste).
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> — la requête est syntaxiquement correcte (JSON valide, bon Content-Type) mais sémantiquement invalide (un champ obligatoire est présent mais contient une valeur invalide, violation d'une règle métier). Rails a popularisé l'utilisation du 422 pour les erreurs de validation. Plus spécifique que le 400.
        </li>
        <li>
          <strong>429 Too Many Requests</strong> — limite de débit dépassée. Doit inclure un en-tête <code>Retry-After</code> indiquant au client combien de temps attendre. Indispensable pour toute API publique.
        </li>
      </ul>

      <h2>401 vs 403 : la distinction qui compte</h2>
      <p>
        C'est l'une des paires les plus souvent confondues :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`GET /api/admin/users
Authorization: (none)
→ 401 Unauthorized
   "You haven't told me who you are. Log in first."

GET /api/admin/users
Authorization: Bearer <valid-regular-user-token>
→ 403 Forbidden
   "I know who you are. You're not an admin. Access denied."`}
      </pre>

      <h2>5xx : codes d'erreur serveur</h2>
      <ul>
        <li>
          <strong>500 Internal Server Error</strong> — un fourre-tout générique pour les défaillances inattendues côté serveur. Une exception non gérée, une référence nulle, une requête de base de données qui a levé une erreur. N'exposez pas les traces de pile aux clients ; journalisez-les côté serveur.
        </li>
        <li>
          <strong>502 Bad Gateway</strong> — le serveur agissant comme proxy ou passerelle a reçu une réponse invalide d'un serveur en amont. Courant quand votre répartiteur de charge ou proxy inverse ne peut pas atteindre les serveurs applicatifs derrière lui — l'application a planté ou n'écoute pas sur le bon port.
        </li>
        <li>
          <strong>503 Service Unavailable</strong> — le serveur est temporairement incapable de traiter les requêtes. Il peut être surchargé, en cours de déploiement ou en maintenance. Doit inclure un en-tête <code>Retry-After</code> quand la durée de l'indisponibilité est connue.
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> — le proxy ou la passerelle n'a pas reçu de réponse dans les délais de la part du serveur en amont. L'upstream est actif mais répond trop lentement. Symptôme courant de requêtes de base de données qui prennent trop de temps ou d'appels à des API externes qui se bloquent.
        </li>
      </ul>

      <h2>Codes de statut dans la conception d'API REST</h2>
      <p>
        Utiliser les bons codes de statut rend votre API auto-documentée et plus facile à intégrer.
        Quelques recommandations :
      </p>
      <ul>
        <li>Ne renvoyez jamais 200 avec un objet d'erreur dans le corps. Si une requête a échoué, le code de statut doit le refléter. Les clients doivent pouvoir vérifier le code de statut seul pour savoir s'ils ont besoin de gérer une erreur.</li>
        <li>Utilisez 201 et un en-tête <code>Location</code> lors de la création de ressources via POST. Cela permet aux clients de découvrir l'URL de la nouvelle ressource sans analyser le corps.</li>
        <li>Retournez 422 (pas 400) pour les erreurs de validation, et incluez un corps d'erreur structuré qui identifie quels champs ont échoué et pourquoi.</li>
        <li>Utilisez 409 pour les conflits qui nécessitent une résolution au niveau applicatif, pas seulement une mauvaise entrée.</li>
        <li>Implémentez le 429 avec la limitation de débit dès le début sur tout endpoint public — il est bien plus difficile de l'ajouter après coup.</li>
      </ul>

      <h2>Déboguer les codes de statut dans les DevTools</h2>
      <p>
        Ouvrez l'onglet Réseau dans les DevTools du navigateur et cherchez les requêtes en rouge — ce sont
        des réponses 4xx ou 5xx. Cliquez sur une requête pour voir le code de statut exact, les en-têtes
        de réponse (utiles pour{" "}
        <code>WWW-Authenticate</code>, <code>Location</code>, <code>Retry-After</code>), et le corps de
        la réponse (qui contient souvent un message d'erreur du serveur). Pour les redirections, cochez
        « Conserver le journal » afin que le panneau DevTools ne s'efface pas lors de la navigation — sinon
        vous ratez la chaîne de redirections.
      </p>
      <p>
        Lorsque vous rencontrez un code de statut inconnu, la{" "}
        <a href="/tools/http-status">Référence des codes de statut HTTP BrowseryTools</a> vous donne
        la description officielle, la RFC dont il provient et des notes sur l'usage courant — sans
        avoir à quitter votre onglet navigateur.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Référence gratuite des codes de statut HTTP — Tous les codes, sources RFC, notes d'usage
        </p>
        <a
          href="/tools/http-status"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir la référence HTTP →
        </a>
      </div>
    </div>
  );
}
