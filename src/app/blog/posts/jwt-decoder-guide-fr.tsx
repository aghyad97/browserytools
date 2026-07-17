import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Si vous avez travaillé avec un système d'authentification web moderne — OAuth 2.0, OpenID Connect ou une
        API personnalisée — vous avez presque certainement rencontré des jetons JWT. Ils apparaissent dans les en-têtes Authorization,
        dans les cookies, dans le stockage local, et dans les sessions de débogage à 2 h du matin lorsqu'un flux de connexion échoue
        mystérieusement. Comprendre ce que contient réellement un JWT, comment le lire et comment repérer les problèmes courants
        rend le débogage de l'authentification considérablement plus rapide.
      </p>
      <ToolCTA slug="jwt-decoder" variant="inline" />
      <p>
        Le <a href="/tools/jwt-decoder">Décodeur JWT de BrowseryTools</a> vous permet de coller n'importe quel jeton JWT et de
        voir instantanément son en-tête décodé, sa charge utile et son statut d'expiration — le tout dans votre navigateur, le jeton
        ne quittant jamais votre appareil.
      </p>

      <h2>Qu'est-ce qu'un JWT ?</h2>
      <p>
        JWT signifie JSON Web Token (jeton web JSON), défini dans la RFC 7519. Un JWT est un jeton compact et compatible avec les URL qui encode
        un ensemble de revendications — des assertions à propos d'un sujet, généralement un utilisateur — dans un format qui peut être vérifié
        et auquel on peut faire confiance. La propriété clé d'un JWT est qu'il est <em>autonome</em> : le jeton lui-même
        transporte toutes les informations dont un serveur a besoin pour authentifier une requête, sans consultation de base de données.
      </p>
      <p>
        Un JWT ressemble à ceci :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfODQyMTkiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImVkaXRvciJdLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImlhdCI6MTczODM2ODAwMCwiZXhwIjoxNzM4MzcxNjAwLCJqdGkiOiI3ZjNhOWI0Yy0xZDJlLTQ1NmYtYWJjZC04OTAxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </pre>
      <p>
        À première vue, cela ressemble à du charabia. Mais cela a une structure très précise : trois sections encodées en Base64URL
        séparées par des points. Chaque section a un but spécifique.
      </p>

      <h2>La structure en trois parties : En-tête.Charge utile.Signature</h2>

      <h3>Partie 1 : l'en-tête</h3>
      <p>
        Le premier segment, avant le premier point, est l'<strong>en-tête</strong>. C'est un objet JSON encodé en Base64URL
        décrivant le type du jeton et l'algorithme de signature. Décodé, l'en-tête de l'exemple
        ci-dessus ressemble à :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </pre>
      <p>
        Le champ <code>alg</code> spécifie l'algorithme de signature. Les valeurs courantes que vous rencontrerez sont :
      </p>
      <ul>
        <li>
          <strong>HS256</strong> — HMAC avec SHA-256. Utilise une clé secrète partagée. L'émetteur et le vérificateur
          doivent tous deux avoir le même secret. Courant dans les applications monolithiques.
        </li>
        <li>
          <strong>RS256</strong> — signature RSA avec SHA-256. Utilise une paire de clés publique/privée. L'émetteur
          signe avec la clé privée ; les vérificateurs contrôlent avec la clé publique. Courant dans les systèmes distribués
          et les fournisseurs OAuth.
        </li>
        <li>
          <strong>ES256</strong> — ECDSA avec P-256 et SHA-256. Comme RS256 mais en utilisant des courbes elliptiques —
          clés plus courtes, même niveau de sécurité. Privilégié dans les systèmes modernes à haute performance.
        </li>
        <li>
          <strong>none</strong> — aucune signature. N'acceptez jamais cela en production. Une faille de sécurité
          notoire survient lorsque des serveurs acceptent des jetons non signés parce que le client a changé <code>alg</code>{" "}
          en <code>"none"</code>.
        </li>
      </ul>

      <h3>Partie 2 : la charge utile</h3>
      <p>
        Le deuxième segment est la <strong>charge utile</strong> — les données réelles que le jeton transporte. C'est également
        un objet JSON encodé en Base64URL. La charge utile décodée de notre exemple :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "sub": "usr_84219",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "roles": ["user", "editor"],
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "iat": 1738368000,
  "exp": 1738371600,
  "jti": "7f3a9b4c-1d2e-456f-abcd-890123456789"
}`}
      </pre>
      <p>
        La charge utile contient deux types de revendications : les <strong>revendications enregistrées</strong> définies par la
        spécification JWT, et les <strong>revendications privées/personnalisées</strong> ajoutées par votre application (comme
        <code>name</code>, <code>email</code> et <code>roles</code> ci-dessus).
      </p>

      <h3>Partie 3 : la signature</h3>
      <p>
        Le troisième segment est la <strong>signature</strong>. Elle est calculée en prenant l'en-tête encodé en Base64URL,
        un point, la charge utile encodée en Base64URL, et en signant le résultat avec l'algorithme et la clé
        spécifiés dans l'en-tête. Pour HS256 :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}
      </pre>
      <p>
        La signature garantit l'intégrité : si quiconque modifie ne serait-ce qu'un seul caractère dans l'en-tête ou la charge utile
        après l'émission du jeton, la signature devient invalide et la vérification échoue. Sans connaître le
        secret de signature (ou la clé privée de l'émetteur pour RS256/ES256), un attaquant ne peut pas forger un jeton valide.
      </p>

      <h2>Référence des revendications JWT standard</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Revendication</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Nom complet</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iss</code></td>
              <td style={{padding: "10px 16px"}}>Émetteur</td>
              <td style={{padding: "10px 16px"}}>Qui a émis le jeton (par exemple, l'URL de votre serveur d'authentification)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>sub</code></td>
              <td style={{padding: "10px 16px"}}>Sujet</td>
              <td style={{padding: "10px 16px"}}>Sur qui porte le jeton — généralement l'identifiant unique de l'utilisateur</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>aud</code></td>
              <td style={{padding: "10px 16px"}}>Audience</td>
              <td style={{padding: "10px 16px"}}>À quel(s) service(s) le jeton est destiné</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>exp</code></td>
              <td style={{padding: "10px 16px"}}>Heure d'expiration</td>
              <td style={{padding: "10px 16px"}}>Horodatage Unix après lequel le jeton doit être rejeté</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iat</code></td>
              <td style={{padding: "10px 16px"}}>Émis le</td>
              <td style={{padding: "10px 16px"}}>Horodatage Unix de la création du jeton</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>nbf</code></td>
              <td style={{padding: "10px 16px"}}>Pas avant</td>
              <td style={{padding: "10px 16px"}}>Le jeton n'est pas valide avant cet horodatage Unix</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>jti</code></td>
              <td style={{padding: "10px 16px"}}>Identifiant JWT</td>
              <td style={{padding: "10px 16px"}}>Identifiant unique du jeton — utilisé pour prévenir les attaques par rejeu</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Pourquoi la revendication exp est essentielle</h2>
      <p>
        La revendication <code>exp</code> est un horodatage Unix — le nombre de secondes écoulées depuis le 1<sup>er</sup> janvier 1970 (UTC).
        Dans notre exemple, <code>"exp": 1738371600</code>. Pour convertir cela en une date lisible par un humain, vous pouvez utiliser
        JavaScript :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`new Date(1738371600 * 1000).toUTCString()
// → "Sat, 01 Feb 2026 01:00:00 GMT"`}
      </pre>
      <p>
        L'expiration du JWT est la première chose à vérifier lorsqu'un jeton est rejeté. Un jeton qui était valide hier
        échouera aujourd'hui si son <code>exp</code> est dans le passé — c'est voulu. Les jetons à courte durée de vie (15
        minutes à 1 heure) limitent la fenêtre de dommages si un jeton est volé. Les jetons à plus longue durée de vie (jours ou
        semaines) sont plus pratiques mais plus dangereux en cas de compromission.
      </p>
      <p>
        Le <a href="/tools/jwt-decoder">Décodeur JWT de BrowseryTools</a> lit automatiquement les revendications <code>exp</code>{" "}
        et <code>iat</code> et les affiche sous forme de dates lisibles par un humain à côté des horodatages Unix bruts,
        de sorte que vous n'avez jamais à faire le calcul mental manuellement.
      </p>

      <h2>Scénarios courants de débogage JWT</h2>

      <h3>Jeton expiré (401 Unauthorized)</h3>
      <p>
        L'erreur JWT la plus courante. Le serveur a rejeté le jeton parce que l'heure actuelle dépasse la
        valeur <code>exp</code>. Solution : implémentez un flux de rafraîchissement de jeton à l'aide d'un jeton de rafraîchissement à plus longue durée de vie,
        ou ré-authentifiez-vous simplement. Collez le jeton dans le décodeur pour confirmer exactement quand il a expiré.
      </p>

      <h3>Mauvaise audience</h3>
      <p>
        Si votre API valide la revendication <code>aud</code> et que le jeton a été émis pour une audience différente
        (par exemple, un jeton émis pour <code>https://api-staging.example.com</code> envoyé à{" "}
        <code>https://api.example.com</code>), le serveur le rejettera. Décodez le jeton et inspectez le
        champ <code>aud</code> pour confirmer qu'il correspond à ce qu'attend le service récepteur.
      </p>

      <h3>Incompatibilité d'algorithme</h3>
      <p>
        Si votre serveur attend RS256 mais reçoit un jeton signé avec HS256 (ou vice versa), la validation
        échoue. Cela peut se produire lors d'une rotation de clés ou lors d'un changement de fournisseur d'authentification. Comparez le champ <code>alg</code>{" "}
        de l'en-tête décodé à ce que votre serveur est configuré pour accepter.
      </p>

      <h3>Signature invalide</h3>
      <p>
        Si la charge utile a été altérée — ne serait-ce qu'un seul caractère modifié — la signature ne
        correspondra pas. Cela se produit aussi si vous utilisez le mauvais secret ou la mauvaise clé publique pour vérifier.
        Décoder l'en-tête et la charge utile (ce qui ne nécessite aucun secret) vous permet au moins d'inspecter ce que le jeton
        revendique, même si vous ne pouvez pas en vérifier l'authenticité côté client.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Avertissement de sécurité — la charge utile n'est pas chiffrée :</strong> la charge utile du JWT est encodée en Base64URL,
        pas chiffrée. Quiconque possède la chaîne du jeton peut décoder l'en-tête et la charge utile sans aucune clé
        ni secret. Ne stockez jamais d'informations sensibles dans une charge utile JWT — pas de mots de passe, de données de cartes de paiement,
        de numéros de sécurité sociale ni de clés privées. Traitez la charge utile comme des données lisibles publiquement qui sont simplement
        infalsifiables, et non confidentielles.
      </div>

      <h2>JWT contre jetons de session : quand utiliser chacun</h2>
      <p>
        Les JWT et les jetons de session traditionnels résolvent le même problème — identifier un utilisateur authentifié à travers
        plusieurs requêtes — mais ils le font différemment, et aucun n'est universellement meilleur.
      </p>
      <p>
        Les <strong>jetons de session traditionnels</strong> sont des chaînes aléatoires opaques (par exemple, un UUID) stockées côté serveur
        dans un magasin de sessions (Redis, base de données). À chaque requête, le serveur recherche le jeton dans le magasin et
        récupère les données de l'utilisateur. Le serveur a un contrôle total : invalider une session révoque immédiatement l'accès.
      </p>
      <p>
        Les <strong>JWT</strong> sont sans état. Le serveur émet un jeton signé et n'en garde aucune trace.
        À chaque requête, le serveur vérifie la signature et fait confiance aux revendications sans aucune consultation de base de données.
        Cela permet une mise à l'échelle horizontale sans état partagé — n'importe quel serveur disposant de la clé de vérification peut authentifier
        la requête. Le compromis : vous ne pouvez pas révoquer immédiatement un JWT avant son expiration (à moins d'implémenter
        une liste de blocage de jetons, ce qui réintroduit de l'état).
      </p>
      <ul>
        <li>Utilisez les <strong>JWT</strong> pour les microservices sans état, les systèmes distribués, les API mobiles et
        l'authentification inter-domaines (flux OAuth/OIDC). Maintenez des durées d'expiration courtes.</li>
        <li>Utilisez les <strong>jetons de session</strong> lorsque vous avez besoin d'une capacité de révocation immédiate (déconnexion,
        suspension de compte, incidents de sécurité), ou lorsque tous vos services partagent un magasin de sessions rapide.</li>
      </ul>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Règle de sécurité critique :</strong> vérifiez toujours les signatures JWT côté serveur à l'aide d'une clé
        de confiance. Ne vous fiez jamais à la seule vérification côté client. Un client peut décoder la charge utile de n'importe quel JWT sans
        secret — mais seul le serveur, détenant la bonne clé, peut déterminer si la signature est
        authentique et si le jeton peut être digne de confiance. Le décodage côté client n'est utile que pour <em>lire</em>{" "}
        des revendications (comme afficher le nom de l'utilisateur dans une interface), jamais pour prendre des décisions d'autorisation.
      </div>

      <h2>Comment utiliser le Décodeur JWT de BrowseryTools</h2>
      <p>
        Ouvrez le <a href="/tools/jwt-decoder">Décodeur JWT</a> et collez votre jeton dans le champ de saisie.
        L'outil sépare immédiatement le jeton au niveau des deux points et affiche :
      </p>
      <ul>
        <li>
          <strong>Le panneau En-tête :</strong> le JSON décodé montrant <code>alg</code>, <code>typ</code> et
          tous les autres champs d'en-tête. Utile pour identifier l'algorithme de signature d'un coup d'œil.
        </li>
        <li>
          <strong>Le panneau Charge utile :</strong> le JSON décodé complet avec toutes les revendications. Les horodatages sont affichés
          à la fois au format Unix brut et en dates UTC lisibles par un humain, de sorte que vous pouvez immédiatement voir l'expiration sans
          conversion mentale.
        </li>
        <li>
          <strong>Le statut d'expiration :</strong> un indicateur clair montrant si le jeton est actuellement valide,
          déjà expiré ou pas encore actif (selon <code>nbf</code>). S'il est expiré, vous voyez exactement depuis combien
          de temps il a expiré.
        </li>
        <li>
          <strong>Le segment Signature :</strong> la signature brute encodée en Base64URL, affichée à titre de référence.
          L'outil ne vérifie pas la signature (cela nécessite le secret ou la clé publique), mais il décode
          et affiche toutes les informations dont vous avez besoin pour le débogage.
        </li>
      </ul>
      <p>
        Il n'y a aucune soumission de formulaire, aucune requête serveur, aucun accès au presse-papiers au-delà de ce que vous collez explicitement.
        L'analyse du jeton se fait entièrement en JavaScript s'exécutant dans l'onglet de votre navigateur.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Vos jetons restent privés :</strong> les jetons JWT contiennent fréquemment des identifiants d'utilisateurs, des adresses e-mail,
        des rôles et d'autres données personnelles. Le Décodeur JWT de BrowseryTools traite votre jeton entièrement dans votre
        navigateur — il n'est jamais envoyé à aucun serveur, jamais journalisé et jamais stocké. Vous pouvez coller en toute sécurité
        des jetons de production pour les inspecter sans vous soucier d'une exposition. Une fois l'onglet fermé, il a disparu.
      </div>

      <h2>Décodez votre jeton JWT maintenant</h2>
      <p>
        Que vous déboguiez un jeton expiré, inspectiez les revendications d'un fournisseur OAuth, vérifiiez quels
        rôles ont été accordés à un utilisateur, ou essayiez simplement de comprendre ce que votre système d'authentification émet
        réellement — le <a href="/tools/jwt-decoder">Décodeur JWT de BrowseryTools</a> vous donne les
        réponses instantanément. Pas d'inscription, pas d'extension à installer, aucune donnée envoyée où que ce soit.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Décodeur JWT gratuit — instantané, privé, sans inscription
        </p>
        <a
          href="/tools/jwt-decoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le Décodeur JWT →
        </a>
      </div>
      <ToolCTA slug="jwt-decoder" variant="card" />
    </div>
  );
}
