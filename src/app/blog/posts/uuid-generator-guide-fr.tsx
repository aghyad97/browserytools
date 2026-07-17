import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Chaque enregistrement de base de données, ressource d'API, événement distribué et jeton de session
        a besoin d'un identifiant unique. Le choix du format d'identifiant a plus d'importance qu'il n'y
        paraît — il influe sur la sécurité, les performances de la base de données, la lisibilité des URL
        et le comportement de votre système lorsque vous exploitez plusieurs serveurs ou fusionnez des
        données provenant de sources différentes. Ce guide couvre les principales options : les UUID (v1,
        v4, v7), les NanoID et les CUID, et quand utiliser chacun.
      </p>
      <ToolCTA slug="uuid-generator" variant="inline" />
      <p>
        Vous pouvez générer des UUID et d'autres identifiants uniques instantanément avec le{" "}
        <a href="/tools/uuid-generator">Générateur d'UUID BrowseryTools</a> — gratuit, sans inscription,
        tout est généré localement dans votre navigateur.
      </p>

      <h2>Pourquoi les ID auto-incrémentés sont insuffisants</h2>
      <p>
        Les identifiants entiers séquentiels (<code>1, 2, 3, ...</code>) sont la valeur par défaut dans
        la plupart des bases de données relationnelles, et ils fonctionnent bien pour les applications
        simples sur un seul serveur. Mais ils posent des problèmes à l'échelle ou dans les systèmes
        distribués :
      </p>
      <ul>
        <li><strong>Prévisibilité</strong> — quiconque connaît un identifiant peut en deviner d'autres. <code>/orders/1042</code> indique clairement que la commande 1041 existe et que votre activité n'est pas très étendue. Il s'agit d'une vulnérabilité IDOR (Insecure Direct Object Reference) si vous n'appliquez pas l'autorisation au niveau applicatif.</li>
        <li><strong>Conflits de fusion</strong> — lorsque vous devez combiner des données provenant de deux bases de données, deux séquences d'auto-incrémentation séparées auront des identifiants en collision. Les systèmes multi-locataires, les applications offline-first et les migrations se heurtent toutes à ce problème.</li>
        <li><strong>Génération distribuée</strong> — si plusieurs serveurs ou workers insèrent des enregistrements, vous avez besoin d'un mécanisme de coordination (une séquence unique ou une séquence au niveau de la base de données) pour éviter les identifiants en double. Cela crée un goulot d'étranglement.</li>
        <li><strong>Fuite de métriques commerciales</strong> — les identifiants séquentiels révèlent le volume des commandes, le nombre d'utilisateurs et le taux de croissance aux concurrents ou aux chercheurs qui surveillent les identifiants publics au fil du temps.</li>
      </ul>

      <h2>Qu'est-ce qu'un UUID ?</h2>
      <p>
        Un UUID (Universally Unique Identifier, également appelé GUID) est un nombre de 128 bits,
        conventionnellement affiché sous la forme de 32 chiffres hexadécimaux répartis en cinq groupes
        séparés par des tirets :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx

Example: 550e8400-e29b-41d4-a716-446655440000
          ^        ^    ^    ^    ^
          |        |    |    |    12 hex digits (48 bits)
          |        |    |    variant bits (N)
          |        |    version digit (M)
          |        4 hex digits
          8 hex digits`}
      </pre>
      <p>
        Le chiffre de version (M) indique quel algorithme de génération d'UUID a été utilisé. Les bits de
        variante (N) sont toujours <code>8</code>, <code>9</code>, <code>a</code> ou <code>b</code> dans
        les UUID standard. Les 122 bits restants sont disponibles pour les données d'identifiant réelles.
      </p>

      <h2>UUID v1 : adresse MAC + horodatage</h2>
      <p>
        L'UUID v1 combine l'horodatage actuel (en intervalles de 100 nanosecondes depuis le 15 octobre
        1582) avec l'adresse MAC de la machine génératrice et une séquence d'horloge pour gérer la
        génération rapide. Le résultat est théoriquement unique sur toutes les machines et dans le temps.
      </p>
      <p>
        Le problème est que les UUID v1 révèlent à la fois quand et où ils ont été générés — l'adresse
        MAC est intégrée en clair. C'est une préoccupation en matière de vie privée, et cela a été
        exploité par le ver Melissa (1999) pour retracer des documents infectés vers des machines
        spécifiques. Pour cette raison, la v1 est rarement utilisée dans les nouvelles applications.
        La plupart des développeurs qui souhaitent des identifiants ordonnés dans le temps se tournent
        vers la v7.
      </p>

      <h2>UUID v4 : aléatoire</h2>
      <p>
        L'UUID v4 est la variante la plus utilisée. Il s'agit de 122 bits de données aléatoires
        cryptographiquement sécurisées (les 6 bits restants encodent la version et la variante). Pas
        d'horodatage, pas d'adresse MAC, pas de composant séquentiel — juste de l'entropie.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Node.js 14.17+
const { randomUUID } = require('crypto');
randomUUID(); // → "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

// Browser
crypto.randomUUID(); // → "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"

// Python
import uuid
str(uuid.uuid4()) # → "3d6f4580-2b3e-44e4-9d40-2d0ab12b4e7e"`}
      </pre>

      <h2>Quelle est la probabilité de collision pour les UUID v4 ?</h2>
      <p>
        Avec 122 bits d'aléatoire, la probabilité d'une collision est extraordinairement faible. Pour
        avoir 50 % de chances d'au moins une collision, il faudrait générer environ
        2,7 × 10<sup>18</sup> UUID — soit 2,7 quintillions. Si vous génériez un milliard d'UUID par
        seconde, il faudrait environ 85 ans pour atteindre ce seuil. Pour toute application réelle, les
        collisions ne sont pas une préoccupation pratique. La source bien plus probable d'identifiants
        en double est un bug applicatif (erreurs de copier-coller, hits de cache renvoyant d'anciens
        identifiants, etc.), pas le générateur lui-même.
      </p>

      <h2>UUID v7 : aléatoire ordonné dans le temps</h2>
      <p>
        L'UUID v7 a été standardisé dans la RFC 9562 (2024) pour remédier au principal inconvénient
        pratique de la v4 : les UUID aléatoires font de mauvaises clés primaires de base de données car
        ils détruisent la localité d'index. Lorsque des enregistrements sont insérés avec des identifiants
        aléatoires, chaque insertion atterrit à une position aléatoire dans un index B-tree, provoquant
        des divisions de pages, des défauts de cache et une fragmentation à l'échelle.
      </p>
      <p>
        L'UUID v7 intègre un horodatage Unix à la précision de la milliseconde dans les bits les plus
        significatifs, suivi de données aléatoires. Cela signifie que les UUID v7 sont triables — les
        enregistrements insérés chronologiquement ont des identifiants lexicographiquement croissants —
        tout en restant globalement uniques et imprévisibles au-delà de la frontière de la milliseconde :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v7 structure:
[48 bits: Unix ms timestamp][4 bits: version=7][12 bits: random][2 bits: variant][62 bits: random]

Three v7 UUIDs generated in sequence:
  0192fe2c-4b3a-7000-8000-0a1b2c3d4e5f  ← earliest
  0192fe2c-4b3b-7001-8000-0a1b2c3d4e60  ← slightly later
  0192fe2c-4b3c-7002-8000-0a1b2c3d4e61  ← latest
  ^^^^^^^^^^ timestamp prefix increases monotonically`}
      </pre>
      <p>
        Si vous construisez une nouvelle application qui utilise des UUID comme clés primaires dans une
        base de données relationnelle, la v7 est le bon choix par défaut en 2024 et au-delà.
      </p>

      <h2>NanoID : plus court, compatible URL</h2>
      <p>
        NanoID n'est pas un UUID — c'est un format d'identifiant différent, mais qui résout le même
        problème. Par défaut, il génère une chaîne de 21 caractères utilisant un alphabet de caractères
        sûrs pour les URL (<code>A-Za-z0-9_-</code>). Cela donne 126 bits d'entropie — comparable à
        l'UUID v4 — dans une chaîne de 21 caractères au lieu de 36. Les chaînes NanoID sont compatibles
        URL sans encodage et semblent plus propres dans les logs et les URL visibles par l'utilisateur :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v4:  9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d  (36 chars)
NanoID:   V1StGXR8_Z5jdHi6B-myT                  (21 chars)

import { nanoid } from 'nanoid';
nanoid();      // → "V1StGXR8_Z5jdHi6B-myT"
nanoid(10);    // → "IRFa-VaY2b"  (custom length)`}
      </pre>
      <p>
        NanoID est populaire pour les identifiants de liens courts, les jetons de session, les codes
        d'invitation et tout cas d'usage où l'identifiant apparaît dans une URL et doit être compact.
      </p>

      <h2>CUID2 : triable, sans empreinte</h2>
      <p>
        CUID2 (le successeur de CUID) est conçu spécifiquement pour être utilisé comme clé primaire de
        base de données. Il génère une chaîne de 24 caractères triable par date de création, n'utilise
        ni adresse MAC ni empreinte, et est plus difficile à prédire que les identifiants basés sur le
        temps. CUID2 utilise SHA-3 en interne pour mélanger l'horodatage avec des données aléatoires,
        rendant le résultat imprévisible même lorsqu'il est généré à la même milliseconde.
      </p>
      <p>
        CUID2 est un bon choix lorsque vous souhaitez des identifiants triables, souhaitez éviter
        complètement le format UUID et tenez à ce que l'identifiant soit opaque (ne révélant pas
        directement l'horodatage).
      </p>

      <h2>Choisir le bon format</h2>
      <ul>
        <li><strong>Clé primaire de base de données, nouveau projet</strong> — UUID v7 ou CUID2. Les deux sont triables, ce qui maintient de bonnes performances d'index à mesure que les données augmentent.</li>
        <li><strong>Identifiant unique générique, interopérabilité</strong> — UUID v4. Tous les langages et frameworks comprennent nativement le format UUID.</li>
        <li><strong>Liens courts, codes d'invitation, jetons URL</strong> — NanoID. Compact, compatible URL, longueur configurable.</li>
        <li><strong>Systèmes distribués où les identifiants sont générés côté client</strong> — UUID v4 ou v7. Aucune coordination nécessaire ; les clients génèrent leurs propres identifiants avant de les soumettre au serveur.</li>
        <li><strong>Évitez la v1</strong> — elle révèle votre adresse MAC. Aucun nouveau projet ne devrait l'utiliser.</li>
      </ul>

      <h2>Performances des UUID comme clé primaire</h2>
      <p>
        L'avertissement classique « n'utilisez pas les UUID comme clés primaires » concerne spécifiquement
        les UUID aléatoires (v4) dans MySQL avec InnoDB ou dans toute base de données qui regroupe les
        données par clé primaire. L'ordre d'insertion aléatoire fragmente l'index clustérisé. Dans
        PostgreSQL avec un index UUID non clustérisé, la pénalité est moins sévère mais reste réelle à
        grande échelle. La solution pratique : utilisez UUID v7 ou CUID2 (qui sont monotoniquement
        croissants) et le problème de fragmentation disparaît largement. Utilisez le{" "}
        <a href="/tools/uuid-generator">Générateur d'UUID BrowseryTools</a> pour générer des UUID v7 afin
        de tester votre schéma avant de vous engager dans un format.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Générateur d'UUID gratuit — v1, v4, v7, NanoID, CUID2
        </p>
        <a
          href="/tools/uuid-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le générateur d'UUID →
        </a>
      </div>
      <ToolCTA slug="uuid-generator" variant="card" />
    </div>
  );
}
