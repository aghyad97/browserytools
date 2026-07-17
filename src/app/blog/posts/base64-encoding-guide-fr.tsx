import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Ouvrez n'importe quelle application web moderne, inspectez une requête HTTP, jetez un œil à un manifeste Kubernetes ou regardez
        à l'intérieur d'un jeton JWT — le Base64 est partout. C'est l'un de ces schémas d'encodage fondamentaux que les
        développeurs rencontrent constamment sans jamais s'arrêter pour le comprendre pleinement. Ce guide explique ce qu'est le Base64,
        comment il fonctionne au niveau des octets, où il est utilisé dans les systèmes du monde réel, et quand vous devriez
        (et ne devriez pas) y avoir recours.
      </p>
      <ToolCTA slug="base64" variant="inline" />
      <p>
        Vous pouvez encoder et décoder n'importe quelle chaîne Base64 instantanément à l'aide de l'{" "}
        <a href="/tools/base64">Encodeur/Décodeur Base64 de BrowseryTools</a> — gratuit, sans inscription, et rien
        ne quitte jamais votre navigateur.
      </p>

      <h2>Pourquoi le Base64 existe-t-il ?</h2>
      <p>
        Pour comprendre le Base64, vous devez comprendre le problème qu'il résout. Aux débuts d'Internet,
        de nombreux protocoles de communication — en particulier la messagerie — étaient conçus autour du texte ASCII 7 bits. L'ASCII définit
        128 caractères en utilisant 7 bits par caractère. Les données binaires (images, documents, exécutables) utilisent les 8 bits
        par octet, produisant des valeurs d'octets qui n'avaient aucune représentation ASCII et que les systèmes plus anciens auraient écartées,
        altérées ou interprétées comme des commandes de contrôle.
      </p>
      <p>
        La norme MIME (Multipurpose Internet Mail Extensions), introduite en 1991 pour permettre à la messagerie de transporter
        des pièces jointes, avait besoin d'un moyen de transmettre des données binaires arbitraires à travers ces canaux propres à 7 bits. La
        solution consistait à ré-encoder les données binaires en utilisant uniquement un sous-ensemble sûr de caractères ASCII imprimables — un sur lequel
        chaque système était d'accord et qu'il transmettrait fidèlement. Le Base64 est devenu l'encodage standard à cette
        fin, et le nom décrit l'approche : utiliser un ensemble de 64 caractères sûrs pour représenter n'importe quelle
        donnée binaire.
      </p>

      <h2>L'alphabet de 64 caractères</h2>
      <p>
        Le Base64 utilise exactement 64 caractères, c'est pourquoi 6 bits d'entrée peuvent toujours être représentés par un
        caractère Base64 (2<sup>6</sup> = 64). L'alphabet standard défini dans la RFC 4648 est :
      </p>
      <ul>
        <li>Les lettres majuscules <code>A</code> à <code>Z</code> — valeurs de 0 à 25</li>
        <li>Les lettres minuscules <code>a</code> à <code>z</code> — valeurs de 26 à 51</li>
        <li>Les chiffres <code>0</code> à <code>9</code> — valeurs de 52 à 61</li>
        <li><code>+</code> — valeur 62</li>
        <li><code>/</code> — valeur 63</li>
      </ul>
      <p>
        Un 65<sup>e</sup> caractère — le signe égal <code>=</code> — est utilisé comme remplissage mais ne représente pas de données.
        Le remplissage garantit que la longueur de la sortie encodée est toujours un multiple de 4 caractères, ce qui simplifie
        le décodage.
      </p>

      <h2>Comment fonctionne l'encodage Base64 : 3 octets → 4 caractères</h2>
      <p>
        Le Base64 fonctionne en prenant 3 octets d'entrée (24 bits) et en les divisant en quatre groupes de 6 bits. Chaque
        groupe de 6 bits correspond à un caractère de l'alphabet Base64. Comme 3 octets deviennent 4 caractères, l'encodage Base64
        augmente la taille des données d'exactement un tiers (33 %).
      </p>
      <p>
        Parcourons un exemple concret : l'encodage de la chaîne ASCII <code>"Man"</code>.
      </p>
      <p>
        Étape 1 — Convertir chaque caractère en sa valeur d'octet ASCII puis en binaire :
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Étape 2 — Concaténer les 24 bits en un seul flux :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (concatenate all 24 bits)
010011 010110 000101 101110`}
      </pre>
      <p>
        Étape 3 — Faire correspondre chaque groupe de 6 bits à l'alphabet Base64 :
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Groupe de 6 bits</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Valeur décimale</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Caractère Base64</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        L'encodage Base64 de <code>"Man"</code> est <code>TWFu</code>. Vous pouvez le vérifier à l'aide de l'{" "}
        <a href="/tools/base64">outil Base64 de BrowseryTools</a>. Lorsque la longueur de l'entrée n'est pas un multiple de 3,
        des caractères de remplissage (<code>=</code> ou <code>==</code>) sont ajoutés pour amener la sortie à un multiple
        de 4 caractères. Par exemple, <code>"Ma"</code> s'encode en <code>TWE=</code> et <code>"M"</code>{" "}
        s'encode en <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Idée reçue courante :</strong> le Base64 est un encodage, pas un chiffrement. Le processus est complètement
        réversible par quiconque, sans aucune clé ni mot de passe. Voir des données encodées en Base64 dans une URL, un en-tête ou un
        fichier ne signifie pas que ces données sont protégées de quelque façon que ce soit — c'est simplement une représentation différente des
        mêmes octets. Quiconque peut copier la chaîne peut la décoder instantanément.
      </div>

      <h2>Cas d'usage courants</h2>

      <h3>Intégrer des images dans le HTML et le CSS</h3>
      <p>
        Plutôt que de faire une requête HTTP distincte pour une petite image ou une icône, vous pouvez l'intégrer directement
        dans votre HTML ou votre CSS sous forme de data URI. Le navigateur décode la chaîne Base64 et affiche l'image
        sans aller-retour réseau. C'est utile pour de petites ressources comme les favicons, les indicateurs de chargement,
        ou les icônes en ligne dans les modèles d'e-mails où le chargement d'URL externes peut être bloqué.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* CSS example — embedding a small PNG icon */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Données binaires dans les API JSON</h3>
      <p>
        JSON est un format texte. Si une API doit transmettre des données binaires — un fichier, une clé cryptographique, une
        signature, une image — à l'intérieur d'une charge utile JSON, elle ne peut pas inclure d'octets bruts. Encoder les données binaires
        en Base64 les transforme en une chaîne de texte que JSON peut transporter sans problème. De nombreuses API qui renvoient du contenu de fichier,
        des échantillons audio ou des images dans des réponses JSON utilisent cette approche.
      </p>

      <h3>Authentification HTTP Basic</h3>
      <p>
        Le schéma HTTP Basic Auth envoie les identifiants dans l'en-tête <code>Authorization</code> sous forme d'encodage Base64
        de <code>username:password</code>. Par exemple, les identifiants <code>admin:secret</code>{" "}
        deviennent la chaîne <code>YWRtaW46c2VjcmV0</code>, et l'en-tête complet ressemble à :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        Ce n'est pas chiffré — c'est juste encodé. Basic Auth doit toujours être utilisé sur HTTPS, jamais sur
        du HTTP en clair, car les identifiants peuvent être décodés trivialement par quiconque intercepte la requête.
      </p>

      <h3>Charges utiles JWT</h3>
      <p>
        Les jetons web JSON encodent leur en-tête et leur charge utile à l'aide de Base64URL (une variante adaptée aux URL décrite ci-dessous).
        Les revendications du jeton — identifiant d'utilisateur, heure d'expiration, rôles — sont stockées dans la charge utile sous forme d'objet
        JSON encodé en Base64URL. Là encore, ce n'est pas du chiffrement : la charge utile est entièrement lisible par quiconque possède le jeton.
      </p>

      <h3>Secrets Kubernetes</h3>
      <p>
        Kubernetes stocke les valeurs de Secret sous forme de chaînes encodées en Base64 dans les manifestes YAML. Voici un exemple réel
        d'un Secret Kubernetes :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        Pour savoir ce que sont réellement ces valeurs, collez <code>YWRtaW4=</code> dans le{" "}
        <a href="/tools/base64">Décodeur Base64 de BrowseryTools</a>. Le résultat est <code>admin</code>. Collez{" "}
        <code>cGFzc3dvcmQxMjM=</code> et vous obtenez <code>password123</code>. Kubernetes encode en Base64 les valeurs de
        secret pour un formatage YAML sûr, et non pour la sécurité — la sécurité réelle provient du RBAC de Kubernetes
        et du chiffrement au repos, pas de l'encodage lui-même.
      </p>

      <h2>La variante Base64URL</h2>
      <p>
        Le Base64 standard utilise deux caractères qui sont spéciaux dans les URL : <code>+</code> (qui signifie espace dans
        l'encodage de formulaire) et <code>/</code> (qui est un séparateur de chemin). Lorsque des données encodées en Base64 doivent
        apparaître dans une URL, un paramètre de requête ou un nom de fichier, ces caractères posent problème.
      </p>
      <p>
        Le Base64URL résout cela en substituant :
      </p>
      <ul>
        <li><code>+</code> est remplacé par <code>-</code> (trait d'union)</li>
        <li><code>/</code> est remplacé par <code>_</code> (tiret bas)</li>
        <li>Le remplissage <code>=</code> de fin est souvent omis</li>
      </ul>
      <p>
        Le Base64URL est utilisé dans les JWT, les jetons OAuth et tout contexte où la chaîne encodée doit survivre à une
        transmission par URL sans encodage pour cent. L'{" "}
        <a href="/tools/base64">outil Base64 de BrowseryTools</a> prend en charge à la fois les variantes standard et adaptées aux URL.
      </p>

      <h2>Quand NE PAS utiliser le Base64</h2>
      <p>
        Le Base64 est le bon outil dans des situations spécifiques, mais il est fréquemment mal utilisé. Voici quand vous devriez
        l'éviter :
      </p>
      <ul>
        <li>
          <strong>Les fichiers volumineux :</strong> le Base64 augmente la taille des données d'environ 33 %. Une image de 10 Mo devient environ
          13,3 Mo une fois encodée en Base64. Intégrer de gros fichiers sous forme de data URI ou de chaînes Base64 dans du JSON ralentit
          l'analyse, augmente l'utilisation de la mémoire et gaspille de la bande passante. Utilisez des transferts de fichiers directs ou des
          URL de stockage d'objets pour tout ce qui a une taille non négligeable.
        </li>
        <li>
          <strong>La sécurité :</strong> n'utilisez jamais le Base64 comme mesure de sécurité. Il n'offre aucune confidentialité.
          Si des données sont sensibles, utilisez un véritable chiffrement (AES-GCM, RSA, etc.).
        </li>
        <li>
          <strong>Le stockage :</strong> stocker des données binaires en Base64 dans une colonne de base de données gaspille 33 % d'
          espace de plus que de stocker les octets bruts dans une colonne binaire. Utilisez des types binaires natifs de la base de données
          (BYTEA dans PostgreSQL, BLOB dans MySQL) lors du stockage de données binaires à grande échelle.
        </li>
      </ul>

      <h2>Base64 contre encodage hexadécimal : une comparaison</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Propriété</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hexadécimal (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Jeu de caractères</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 caractères)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 caractères)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Surcoût de taille</strong></td>
              <td style={{padding: "12px 16px"}}>~33 % plus grand</td>
              <td style={{padding: "12px 16px"}}>~100 % plus grand (2 caractères par octet)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Lisibilité humaine</strong></td>
              <td style={{padding: "12px 16px"}}>Faible — non reconnaissable</td>
              <td style={{padding: "12px 16px"}}>Modérée — lisible au niveau de l'octet</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Cas d'usage courants</strong></td>
              <td style={{padding: "12px 16px"}}>Pièces jointes d'e-mails, JWT, data URI, charges utiles d'API</td>
              <td style={{padding: "12px 16px"}}>Empreintes cryptographiques, sommes de contrôle, codes couleur, adresses MAC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Compatible avec les URL ?</strong></td>
              <td style={{padding: "12px 16px"}}>Uniquement avec la variante Base64URL</td>
              <td style={{padding: "12px 16px"}}>Oui — tous les caractères sont compatibles avec les URL</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Bits par caractère</strong></td>
              <td style={{padding: "12px 16px"}}>6 bits</td>
              <td style={{padding: "12px 16px"}}>4 bits</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Utilisez le Base64 lorsque vous avez besoin d'un encodage binaire-vers-texte compact et que la largeur du jeu de caractères ne crée pas de
        problèmes. Utilisez l'hexadécimal lorsque l'inspection humaine des valeurs d'octets individuelles importe — les empreintes de hachage, les sommes de contrôle
        et les sorties cryptographiques sont traditionnellement affichées en hexadécimal précisément parce que chaque caractère hexadécimal correspond
        directement à 4 bits, rendant les limites des octets trivialement visibles.
      </p>

      <h2>Encoder et décoder du Base64 en code</h2>
      <p>
        La plupart des langages fournissent une prise en charge intégrée du Base64. Voici de rapides instructions en une ligne pour des environnements courants :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser or Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        Pour un encodage ou un décodage rapide et ponctuel sans écrire de code, l'{" "}
        <a href="/tools/base64">outil Base64 de BrowseryTools</a> est l'option la plus rapide — collez votre chaîne,
        choisissez encoder ou décoder, et le résultat apparaît instantanément. Rien n'est envoyé à un serveur.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Garantie de confidentialité :</strong> l'encodeur et le décodeur Base64 de BrowseryTools traite tout
        localement dans votre navigateur en utilisant JavaScript. Si vous encodez des données sensibles — clés d'API, secrets,
        configuration privée — elles ne touchent jamais un serveur. Vos données restent sur votre appareil.
      </div>

      <h2>Encodez et décodez du Base64 instantanément</h2>
      <p>
        Que vous décodiez un secret Kubernetes, inspectiez une charge utile JWT, créiez un data URI pour une
        image en ligne, ou soyez simplement curieux de savoir ce que contient une chaîne Base64 — l'{" "}
        <a href="/tools/base64">Encodeur/Décodeur Base64 de BrowseryTools</a> gère cela en un seul clic.
        Collez votre entrée, obtenez votre sortie. Pas de publicités, pas d'inscription, aucune donnée ne quitte votre appareil.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Encodeur / Décodeur Base64 gratuit — s'exécute à 100 % dans votre navigateur
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir l'outil Base64 →
        </a>
      </div>
      <ToolCTA slug="base64" variant="card" />
    </div>
  );
}
