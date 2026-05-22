export default function Content() {
  return (
    <div>
      <p>
        Ouvrez n'importe quel fichier journal. Examinez le champ <code>exp</code> d'un token JWT.
        Consultez le champ <code>created_at</code>{" "}
        d'une réponse d'API. Il y a de bonnes chances que vous tombiez sur un nombre comme{" "}
        <code>1711065600</code> ou <code>1711065600000</code>. Il s'agit d'un horodatage Unix —
        un entier simple qui représente un moment dans le temps. Comprendre comment fonctionne
        le temps Unix, d'où il vient et comment éviter ses pièges courants vous évitera toute
        une catégorie de bugs subtils, difficiles à reproduire et parfois embarrassants en production.
      </p>
      <p>
        Vous pouvez convertir n'importe quel horodatage Unix en date lisible (et vice versa) avec le{" "}
        <a href="/tools/unix-timestamp">Convertisseur d'horodatage Unix BrowseryTools</a> — gratuit,
        sans inscription, tout reste dans votre navigateur.
      </p>

      <h2>Qu'est-ce qu'un horodatage Unix ?</h2>
      <p>
        Un horodatage Unix est le nombre de secondes écoulées depuis l'époque Unix : minuit
        le 1er janvier 1970, en Temps Universel Coordonné (UTC). Ce moment — 00:00:00 UTC le
        1970-01-01 — a été choisi comme référence lors du développement du système d'exploitation
        Unix au début des années 1970. C'était une date récente et ronde qui simplifiait les
        calculs sur le matériel de l'époque.
      </p>
      <p>
        L'élégance du temps Unix réside dans le fait que n'importe quel moment est représenté
        par un seul entier. Comparer deux horodatages revient à une soustraction. Vérifier
        qu'un élément a expiré revient à une comparaison. Ajouter un intervalle revient à une
        addition. Pas de fuseaux horaires, pas de calculs de calendrier, pas d'heure d'été —
        juste un nombre.
      </p>
      <p>
        En 2026, l'horodatage Unix actuel est d'environ <code>1 774 000 000</code>.
        Chaque seconde, ce nombre augmente de 1.
      </p>

      <h2>Le problème Y2K38</h2>
      <p>
        Si le temps Unix est stocké sous forme d'entier signé sur 32 bits — ce qui était le cas
        dans de nombreuses implémentations anciennes — la valeur maximale est <code>2 147 483 647</code>.
        Ce nombre correspond au 19 janvier 2038 à 03:14:07 UTC. Après ce moment, un entier signé
        sur 32 bits déborde vers une grande valeur négative, et les systèmes non mis à jour
        interpréteront les horodatages incorrectement.
      </p>
      <p>
        C'est le problème de l'an 2038 (Y2K38), l'équivalent Unix du bug Y2K. Les systèmes
        modernes utilisent des entiers 64 bits pour les horodatages, ce qui étend la plage
        représentable à environ 292 milliards d'années dans les deux sens — pratiquement pour
        toujours à toute fin utile. Mais les systèmes embarqués, les bases de données héritées
        avec des colonnes d'horodatage sur 32 bits et le code C ancien qui utilise{" "}
        <code>time_t</code> comme type 32 bits restent exposés.
      </p>

      <h2>Obtenir l'horodatage courant</h2>
      <p>
        Voici comment obtenir l'horodatage Unix courant dans les langages les plus répandus :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — retourne des millisecondes, diviser par 1000 pour des secondes
const nowMs = Date.now();           // ex. 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // ex. 1711065600

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

      <h2>Convertir des horodatages en dates lisibles</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — depuis des secondes
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiplier par 1000 pour les ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // date formatée selon la locale

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: horodatage depuis un entier
SELECT to_timestamp(1711065600);
-- Résultat : 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Résultat : 2024-03-22 00:00:00`}
      </pre>

      <h2>Le bug n° 1 des horodatages : millisecondes vs secondes</h2>
      <p>
        <code>Date.now()</code> en JavaScript retourne des millisecondes. Le standard Unix — et
        pratiquement tous les autres langages, bases de données et API — utilise des secondes.
        Cette incompatibilité est la source la plus courante de bugs liés aux horodatages.
      </p>
      <p>
        Les symptômes sont reconnaissables : des dates affichées en 1970 (horodatage divisé par
        1000 par accident, ou traité en secondes alors qu'il est en millisecondes), ou des dates
        affichées après l'an 56 000 (secondes traitées comme des millisecondes puis divisées à
        nouveau). Une valeur autour de <code>1 700 000 000</code> est quasi certaienement en
        secondes. Une valeur autour de{" "}
        <code>1 700 000 000 000</code> est quasi certainement en millisecondes.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug : traiter des secondes comme des millisecondes — atterrit en 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct : multiplier les secondes par 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Fonction défensive — gère secondes et millisecondes
function toDate(ts) {
  // Si inférieur à 10^12, c'est des secondes ; multiplier
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Problèmes de fuseaux horaires avec les horodatages</h2>
      <p>
        Les horodatages Unix sont toujours en UTC — ils représentent un moment absolu unique
        dans le temps, sans fuseau horaire associé. La question du fuseau horaire ne se pose
        qu'à la couche d'affichage, lors de la conversion en format lisible.
      </p>
      <p>
        L'erreur la plus courante consiste à utiliser les méthodes de fuseau horaire local sans
        s'en rendre compte.
        <code>new Date(ts).toLocaleDateString()</code> en JavaScript renvoie la date dans le
        fuseau horaire local du navigateur. Si votre serveur génère un horodatage à 23h00 UTC
        et qu'un utilisateur en UTC+0 et un autre en UTC+1 l'affichent tous les deux, ils verront
        des dates calendaires différentes. Que ce soit correct dépend des exigences du produit —
        mais cela doit être un choix délibéré, pas accidentel.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Toujours explicite sur le fuseau horaire — utiliser toISOString() pour UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← toujours UTC

// Ou utiliser Intl.DateTimeFormat pour l'affichage locale/fuseau
new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  dateStyle: "full",
}).format(date);  // "vendredi 22 mars 2024"`}
      </pre>

      <h2>Horodatages dans les bases de données</h2>
      <p>
        Les bases de données offrent deux options principales pour stocker les dates : le type
        de colonne <code>TIMESTAMP</code> (qui stocke un moment absolu dans le temps) et le type
        <code>DATE</code> ou <code>DATETIME</code>{" "}
        (qui stocke une représentation calendaire sans fuseau horaire inhérent).
      </p>
      <p>
        Pour les champs comme <code>created_at</code>, <code>updated_at</code> et les horodatages
        d'événements, utilisez toujours une colonne <code>TIMESTAMP WITH TIME ZONE</code> (ou
        l'équivalent dans votre base de données) plutôt qu'un entier brut. Cela permet à la
        base de données de gérer correctement la conversion et la comparaison des fuseaux horaires,
        et rend précises les requêtes du type « événements des dernières 24 heures » quel que
        soit le fuseau horaire du serveur.
      </p>
      <p>
        Lorsque vous devez stocker un horodatage Unix sous forme d'entier brut (pour la
        compatibilité avec des systèmes externes ou pour une portabilité maximale), documentez
        clairement s'il s'agit de secondes ou de millisecondes, et soyez cohérent sur l'ensemble
        du schéma.
      </p>

      <h2>Horodatages dans les JWT et les API</h2>
      <p>
        Les JSON Web Tokens (JWT) utilisent des horodatages Unix (en secondes) pour leurs
        revendications temporelles :
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — issued at (émis à) : l'heure à laquelle le token a été créé</li>
        <li><strong><code>exp</code></strong> — expiry (expiration) : l'heure après laquelle le token ne doit plus être accepté</li>
        <li><strong><code>nbf</code></strong> — not before (pas avant) : le token ne doit pas être utilisé avant cette heure</li>
      </ul>
      <p>
        Vérifier l'expiration d'un JWT revient à une simple comparaison : <code>exp &gt; Math.floor(Date.now() / 1000)</code>.
        Si l'heure courante en secondes est supérieure à <code>exp</code>, le token a expiré.
        Validez toujours <code>exp</code> côté serveur — ne faites jamais confiance uniquement
        aux vérifications d'expiration côté client.
      </p>

      <h2>Référence rapide : conversions d'horodatages</h2>
      <p>
        Pour des conversions rapides et précises entre horodatages Unix et dates lisibles, utilisez le{" "}
        <a href="/tools/unix-timestamp">Convertisseur d'horodatage Unix BrowseryTools</a>. Collez
        un horodatage pour voir la date UTC et locale correspondante, ou saisissez une date pour
        obtenir son horodatage. Tout s'exécute dans le navigateur — sans serveur, sans suivi.
      </p>

      <h2>Résumé</h2>
      <p>
        Les horodatages Unix sont un moyen universel et non ambigu de représenter des moments
        dans le temps. Les règles essentielles : ils sont toujours en UTC, toujours en secondes
        (sauf en JavaScript où{" "}
        <code>Date.now()</code> utilise des millisecondes), et toujours un entier positif pour
        toute date après 1970. Gérez explicitement la distinction millisecondes/secondes, utilisez
        UTC pour le stockage et la transmission, et convertissez en heure locale uniquement à la
        couche d'affichage.
      </p>
    </div>
  );
}
