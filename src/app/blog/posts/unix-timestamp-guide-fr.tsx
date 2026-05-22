export default function Content() {
  return (
    <div>
      <p>
        Ouvrez n'importe quel fichier de logs. Regardez le champ d'expiration dans un jeton JWT. Consultez le
        champ <code>created_at</code>{" "}
        d'une réponse d'API. Il y a de fortes chances que vous tombiez sur un nombre comme{" "}
        <code>1711065600</code> ou <code>1711065600000</code>. C'est un timestamp Unix — un simple entier
        représentant un instant précis dans le temps. Comprendre comment fonctionne l'heure Unix, d'où elle
        vient et comment éviter ses pièges habituels vous épargnera toute une catégorie de bugs subtils,
        difficiles à reproduire et parfois embarrassants en production.
      </p>
      <p>
        Vous pouvez convertir n'importe quel timestamp Unix en date lisible (et inversement) grâce au{" "}
        <a href="/tools/unix-timestamp">Convertisseur de timestamp Unix BrowseryTools</a> — gratuit,
        sans inscription, tout reste dans votre navigateur.
      </p>

      <h2>Qu'est-ce qu'un timestamp Unix ?</h2>
      <p>
        Un timestamp Unix est le nombre de secondes écoulées depuis l'époque Unix : minuit le
        1er janvier 1970, temps universel coordonné (UTC). Cet instant — 00:00:00 UTC le 01/01/1970 —
        a été choisi comme référence lors du développement du système d'exploitation Unix au début des
        années 1970. C'était une date récente et arrondie qui facilitait les calculs sur le matériel
        de l'époque.
      </p>
      <p>
        L'élégance de l'heure Unix est que tout instant est représenté par un unique entier.
        Comparer deux timestamps revient à une soustraction. Vérifier si quelque chose a expiré
        revient à une comparaison. Ajouter un intervalle revient à une addition. Pas de fuseaux
        horaires, pas de calculs calendaires, pas de changements d'heure — juste un nombre.
      </p>
      <p>
        En 2026, le timestamp Unix actuel est d'environ <code>1 774 000 000</code>.
        Il augmente de 1 chaque seconde.
      </p>

      <h2>Le problème Y2K38</h2>
      <p>
        Si l'heure Unix est stockée sous la forme d'un entier signé 32 bits — ce qui était le cas dans
        de nombreuses implémentations anciennes —, la valeur maximale est <code>2 147 483 647</code>. Ce
        nombre correspond au 19 janvier 2038 à 03:14:07 UTC. Après cet instant, un entier signé 32 bits
        déborde vers un grand nombre négatif, et les systèmes non mis à jour interpréteront les timestamps
        de manière incorrecte.
      </p>
      <p>
        C'est le problème de l'an 2038 (Y2K38), l'équivalent Unix du bug Y2K. Les systèmes modernes
        utilisent des entiers 64 bits pour les timestamps, ce qui étend la plage représentable à environ
        292 milliards d'années dans les deux sens — pratiquement pour l'éternité à des fins concrètes.
        Mais les systèmes embarqués, les bases de données héritées avec des colonnes timestamp 32 bits et
        l'ancien code C qui utilise <code>time_t</code> comme type 32 bits sont encore vulnérables.
      </p>

      <h2>Obtenir le timestamp actuel</h2>
      <p>
        Voici comment obtenir le timestamp Unix actuel dans les langages les plus courants :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — returns milliseconds, divide by 1000 for seconds
const nowMs = Date.now();           // e.g. 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // e.g. 1711065600

// Python
import time
now = int(time.time())  # seconds since epoch

# Using datetime module
from datetime import datetime, timezone
now = int(datetime.now(timezone.utc).timestamp())

// Go
import "time"
now := time.Now().Unix()         // seconds
nowNano := time.Now().UnixNano() // nanoseconds

-- SQL (PostgreSQL)
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- SQL (MySQL)
SELECT UNIX_TIMESTAMP();`}
      </pre>

      <h2>Convertir des timestamps en dates lisibles</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — from seconds
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiply by 1000 for ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // locale-formatted date

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: timestamp from integer
SELECT to_timestamp(1711065600);
-- Result: 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Result: 2024-03-22 00:00:00`}
      </pre>

      <h2>Le bug n°1 des timestamps : millisecondes vs secondes</h2>
      <p>
        <code>Date.now()</code> en JavaScript retourne des millisecondes. Le standard Unix — ainsi que
        pratiquement tous les autres langages, bases de données et API — utilise des secondes. Cette
        incompatibilité est la source la plus courante de bugs liés aux timestamps.
      </p>
      <p>
        Les symptômes sont immanquables : des dates s'affichent en 1970 (timestamp divisé par 1000 par
        erreur, ou traité en secondes alors qu'il s'agit de millisecondes), ou des dates s'affichent en
        l'an 56 000+ (des secondes traitées comme des millisecondes puis redivisées). Une valeur autour
        de <code>1 700 000 000</code> est presque certainement en secondes. Une valeur autour de{" "}
        <code>1 700 000 000 000</code> est presque certainement en millisecondes.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug: treating seconds as milliseconds — lands in 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct: multiply seconds by 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Defensive helper — handles both seconds and milliseconds
function toDate(ts) {
  // If it's under 10^12, it's seconds; multiply
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Problèmes de fuseau horaire avec les timestamps</h2>
      <p>
        Les timestamps Unix sont toujours en UTC — ils représentent un instant absolu dans le temps,
        sans fuseau horaire associé. La question du fuseau horaire ne se pose qu'à la couche d'affichage,
        lorsqu'on convertit un timestamp en format lisible.
      </p>
      <p>
        L'erreur la plus courante est d'utiliser des méthodes de fuseau horaire local sans s'en rendre
        compte. <code>new Date(ts).toLocaleDateString()</code> en JavaScript renvoie la date dans le
        fuseau horaire local du navigateur. Si votre serveur génère un timestamp à 23:00 UTC et qu'un
        utilisateur en UTC+0 et un utilisateur en UTC+1 l'affichent tous les deux, ils verront des dates
        calendaires différentes. Que ce soit correct dépend du besoin produit — mais cela doit être un
        choix délibéré, pas accidentel.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Always explicit about timezone — use toISOString() for UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← always UTC

// Or use Intl.DateTimeFormat for locale/timezone display
new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
}).format(date);  // "Friday, March 22, 2024"`}
      </pre>

      <h2>Les timestamps dans les bases de données</h2>
      <p>
        Les bases de données proposent deux options principales pour stocker les dates : un type de colonne{" "}
        <code>TIMESTAMP</code> (qui stocke un instant absolu dans le temps) et un type <code>DATE</code>{" "}
        ou <code>DATETIME</code>{" "}
        (qui stocke une représentation calendaire sans fuseau horaire inhérent).
      </p>
      <p>
        Pour les champs comme <code>created_at</code>, <code>updated_at</code> et les timestamps
        d'événements, utilisez toujours une colonne <code>TIMESTAMP WITH TIME ZONE</code> (ou l'équivalent
        dans votre base de données) plutôt qu'un entier brut. Cela permet à la base de données de gérer
        correctement la conversion de fuseau horaire et les comparaisons, et rend les requêtes comme
        « événements des 24 dernières heures » précises quel que soit le fuseau horaire du serveur.
      </p>
      <p>
        Lorsque vous devez stocker un timestamp Unix sous forme d'entier brut (pour la compatibilité avec
        des systèmes externes ou pour une portabilité maximale), documentez clairement s'il s'agit de
        secondes ou de millisecondes, et soyez cohérent dans tout le schéma.
      </p>

      <h2>Les timestamps dans les JWT et les API</h2>
      <p>
        Les jetons JSON Web Tokens (JWT) utilisent des timestamps Unix (en secondes) pour leurs
        revendications temporelles :
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — issued at (émis à) : le moment où le jeton a été créé</li>
        <li><strong><code>exp</code></strong> — expiry (expiration) : le moment après lequel le jeton ne doit plus être accepté</li>
        <li><strong><code>nbf</code></strong> — not before (pas avant) : le jeton ne doit pas être utilisé avant cet instant</li>
      </ul>
      <p>
        Vérifier l'expiration d'un JWT est une simple comparaison :{" "}
        <code>exp &gt; Math.floor(Date.now() / 1000)</code>.
        Si l'heure actuelle en secondes est supérieure à <code>exp</code>, le jeton a expiré.
        Validez toujours <code>exp</code> côté serveur — ne vous fiez jamais uniquement aux vérifications
        d'expiration côté client.
      </p>

      <h2>Référence rapide : conversions de timestamps</h2>
      <p>
        Pour des conversions rapides et précises entre timestamps Unix et dates lisibles, utilisez le{" "}
        <a href="/tools/unix-timestamp">Convertisseur de timestamp Unix BrowseryTools</a>. Collez un
        timestamp pour voir la date UTC et locale correspondante, ou saisissez une date pour obtenir son
        timestamp. Tout s'exécute dans le navigateur — pas de serveur, pas de traçage.
      </p>

      <h2>Résumé</h2>
      <p>
        Les timestamps Unix sont un moyen universel et non ambigu de représenter des instants dans le
        temps. Les règles essentielles : ils sont toujours en UTC, toujours en secondes (sauf en
        JavaScript où <code>Date.now()</code> utilise des millisecondes), et toujours un entier positif
        pour toute date postérieure à 1970. Gérez explicitement la distinction millisecondes/secondes,
        utilisez UTC pour le stockage et la transmission, et ne convertissez en heure locale qu'à la
        couche d'affichage.
      </p>
    </div>
  );
}
