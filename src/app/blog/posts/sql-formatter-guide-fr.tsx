import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Tout développeur s'est retrouvé dans cette situation. Vous extrayez une requête lente des journaux
        de l'application, vous la copiez dans votre éditeur et vous vous retrouvez face à un mur de 300
        caractères en minuscules, sans espaces, sans sauts de ligne et sans pitié. Ou bien vous trouvez une
        réponse sur Stack Overflow avec exactement la requête dont vous avez besoin, mais elle est écrite
        en une seule ligne. Ou encore votre ORM journalise aimablement le SQL qu'il génère — sous la forme
        d'une chaîne concaténée unique. Dans tous ces cas, la requête brute est techniquement correcte mais
        pratiquement illisible.
      </p>
      <ToolCTA slug="sql-formatter" variant="inline" />
      <p>
        Formater du SQL n'est pas une question d'esthétique. C'est une question de pouvoir comprendre ce
        que fait une requête en un coup d'œil — quelles tables elle lit, quelles conditions elle filtre et
        quelles colonnes elle retourne. Une requête bien formatée peut être révisée, déboguée et optimisée
        en quelques minutes. Une requête non formatée peut faire perdre des heures.
      </p>
      <p>
        Le <a href="/tools/sql-formatter">Formateur SQL BrowseryTools</a> vous permet de coller n'importe
        quelle requête SQL et de la formater instantanément avec une indentation appropriée, des mots-clés
        en majuscules et une séparation des clauses — le tout traité localement dans votre navigateur,
        sans qu'aucune requête ne soit jamais envoyée à un serveur.
      </p>

      <h2>Pourquoi le SQL non formaté est si pénible</h2>
      <p>
        SQL est l'un des rares langages où les développeurs travaillent régulièrement avec du code qu'ils
        n'ont pas écrit et qu'ils ne peuvent pas reformater à la source. Considérez les trois sources les
        plus courantes de SQL indigeste :
      </p>
      <ul>
        <li>
          <strong>Requêtes générées par des ORM.</strong> Hibernate, SQLAlchemy, ActiveRecord et leurs
          cousins génèrent du SQL dynamiquement. Lorsque vous activez la journalisation des requêtes pour
          déboguer un problème de performance, vous obtenez le SQL brut généré — généralement une seule
          ligne avec des valeurs de paramètres dynamiques, des alias comme <code>t0_</code> et des
          conditions de jointure qui demandent plusieurs lectures pour être comprises.
        </li>
        <li>
          <strong>Journaux de requêtes issus de bases de données en production.</strong> Le slow query log
          de MySQL et <code>pg_stat_statements</code> de PostgreSQL stockent les requêtes telles qu'elles
          ont été soumises — aucun formatage appliqué. Elles sont précieuses pour l'analyse des
          performances, mais quasiment impossibles à lire sans reformatage préalable.
        </li>
        <li>
          <strong>One-liners de Stack Overflow et de la documentation.</strong> Le code partagé dans les
          réponses et la documentation est souvent compressé en une seule ligne pour économiser de l'espace
          vertical. La logique est juste, mais la mise en page rend difficile l'adaptation à votre propre
          schéma.
        </li>
      </ul>

      <h2>Avant et après : la même requête, formatée</h2>
      <p>
        Voici une requête réaliste telle qu'elle pourrait apparaître dans un slow query log ou la sortie
        d'un ORM — tout sur une ligne avec des mots-clés en minuscules :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        Après formatage avec des conventions SQL cohérentes, la même requête devient immédiatement lisible :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id)  AS order_count,
    SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
    ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY
    u.id,
    u.name,
    u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 20;`}
      </pre>
      <p>
        La structure est maintenant immédiatement visible : vous pouvez voir qu'il s'agit d'un rapport
        utilisateur affichant le nombre de commandes et le total dépensé, filtré sur les utilisateurs
        actifs depuis 2024, groupé par utilisateur et limité aux 20 plus gros acheteurs. Cela vous a
        pris cinq secondes à comprendre — au lieu de cinq minutes.
      </p>

      <h2>Conventions de formatage SQL</h2>
      <p>
        Il n'existe pas de guide de style SQL officiel unique, mais un ensemble de conventions largement
        acceptées s'est imposé dans l'industrie. Les respecter rend votre SQL lisible par tout développeur
        connaissant le langage.
      </p>

      <h3>Mots-clés en majuscules</h3>
      <p>
        Les mots-clés SQL — <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code> — doivent être en majuscules. Les noms de tables, de colonnes, les alias
        et les littéraux de chaîne conservent leur casse naturelle. Ce contraste visuel entre MOTS-CLÉS
        et identifiants rend les requêtes lisibles d'un coup d'œil.
      </p>

      <h3>Chaque clause principale sur sa propre ligne</h3>
      <p>
        Chaque clause de niveau supérieur commence sur une nouvelle ligne :{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. Cela donne à la requête un
        squelette visuel clair. Lorsque vous ouvrez une requête formatée, votre œil trouve
        immédiatement chaque clause car elles commencent toutes à la marge gauche (ou à un niveau
        d'indentation cohérent).
      </p>

      <h3>Listes de colonnes et conditions indentées</h3>
      <p>
        Les noms de colonnes dans la liste <code>SELECT</code> et les conditions dans <code>WHERE</code>
        sont indentés de quatre espaces (ou d'une tabulation). Chaque <code>AND</code> et <code>OR</code>
        dans une clause <code>WHERE</code> commence sur sa propre ligne au même niveau d'indentation que
        la première condition, ce qui permet d'ajouter, de supprimer ou de commenter facilement des
        conditions individuelles :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Placement des virgules : deux écoles de pensée</h3>
      <p>
        Le débat sur le placement des virgules en SQL est similaire au débat sur les virgules finales en
        JavaScript. Il existe deux styles légitimes :
      </p>
      <ul>
        <li>
          <strong>Virgules finales</strong> (virgule en fin de ligne) : le style le plus courant, qui
          correspond à la façon dont la plupart des développeurs écrivent les listes dans d'autres
          langages. L'inconvénient est que commenter la dernière ligne oblige aussi à supprimer sa
          virgule finale sur la ligne précédente.
        </li>
        <li>
          <strong>Virgules en tête</strong> (virgule en début de ligne après la première) : permet de
          commenter n'importe quelle ligne individuelle sans toucher aux lignes adjacentes. Prisé par les
          équipes qui modifient fréquemment les listes de colonnes en développement.
        </li>
      </ul>
      <p>
        Les deux sont valides. Choisissez-en un et utilisez-le de façon cohérente dans un projet. Le
        Formateur SQL BrowseryTools utilise les virgules finales par défaut, ce qui est conforme à la
        majorité des guides de style et à la convention que la plupart des lecteurs attendent.
      </p>

      <h3>Alias alignés avec AS</h3>
      <p>
        Utilisez toujours <code>AS</code> explicitement pour les alias — jamais le style implicite sans
        mot-clé que certains dialectes autorisent (<code>COUNT(o.id) order_count</code>). Lorsque
        plusieurs alias apparaissent dans une liste <code>SELECT</code>, aligner le mot-clé{" "}
        <code>AS</code> sur la même colonne rend la liste lisible d'un coup d'œil :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>Comment lire une requête complexe avec plusieurs JOIN</h2>
      <p>
        Lorsque vous rencontrez une requête avec trois, quatre ou cinq JOIN, ne commencez pas par le haut.
        Commencez par la clause <code>FROM</code>. Elle vous indique la table principale — l'ancre de la
        requête. Chaque <code>JOIN</code> suivant ajoute une autre table au jeu de résultats, et la
        condition <code>ON</code> vous indique comment les lignes de cette table se rattachent aux lignes
        déjà accumulées. C'est seulement après avoir compris le modèle de données via <code>FROM</code>{" "}
        et <code>JOIN</code> que vous revenez au <code>SELECT</code> pour voir quelles colonnes sont
        retournées, puis au <code>WHERE</code> pour le filtrage, puis au <code>GROUP BY</code> pour
        l'agrégation.
      </p>
      <p>
        Ordre de lecture pour toute requête SELECT : <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        Cela correspond à l'ordre dans lequel le moteur de base de données traite réellement les clauses,
        et cela correspond à la façon dont vous devriez raisonner sur les données qui transitent par chaque
        étape.
      </p>

      <h2>Formatage des sous-requêtes</h2>
      <p>
        Les sous-requêtes — requêtes imbriquées dans une autre requête — méritent leur propre niveau
        d'indentation. Chaque niveau d'imbrication ajoute un niveau d'indentation, de sorte que la
        structure reste claire même avec deux ou trois niveaux de profondeur :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email
FROM users AS u
WHERE u.id IN (
    SELECT DISTINCT o.user_id
    FROM orders AS o
    WHERE o.total > 500
      AND o.created_at >= '2024-01-01'
)
ORDER BY u.name;`}
      </pre>
      <p>
        La requête interne est clairement subordonnée à la requête externe. La parenthèse fermante est
        alignée avec le mot-clé (<code>WHERE</code>) qui a introduit la sous-requête. Pour les
        sous-requêtes profondément imbriquées ou complexes, les CTE (Common Table Expressions) sont
        presque toujours préférables car ils peuvent être nommés et placés en tête de la requête où
        ils sont faciles à lire.
      </p>

      <h2>Modèles de requêtes courants et leurs formes formatées</h2>

      <h3>INSERT INTO ... SELECT</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`INSERT INTO order_archive (
    id,
    user_id,
    total,
    created_at
)
SELECT
    id,
    user_id,
    total,
    created_at
FROM orders
WHERE created_at < '2023-01-01';`}
      </pre>

      <h3>UPDATE avec JOIN (syntaxe MySQL / SQL Server)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>Requête WITH (CTE)</h3>
      <p>
        Les Common Table Expressions sont l'outil de formatage le plus puissant en SQL. Ils vous
        permettent de nommer des ensembles de résultats intermédiaires, transformant une requête
        profondément imbriquée en une série d'étapes clairement nommées :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
      AND created_at >= '2024-01-01'
),
user_orders AS (
    SELECT
        user_id,
        COUNT(id)  AS order_count,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
)
SELECT
    au.id,
    au.name,
    au.email,
    uo.order_count,
    uo.total_spent
FROM active_users AS au
LEFT JOIN user_orders AS uo
    ON au.id = uo.user_id
ORDER BY uo.total_spent DESC
LIMIT 20;`}
      </pre>

      <h2>Pourquoi le formatage compte pour l'analyse des performances</h2>
      <p>
        Le formatage n'est pas seulement une question de lisibilité pour les humains — il rend aussi les
        problèmes de performance visibles. Une fois la requête correctement mise en page, plusieurs classes
        de problèmes deviennent faciles à repérer :
      </p>
      <ul>
        <li>
          <strong>Index manquants.</strong> Une clause <code>WHERE</code> formatée avec toutes les
          conditions sur leurs propres lignes permet de vérifier aisément que chaque colonne de condition
          possède un index. Non formatées, les conditions enfouies dans un one-liner sont faciles à
          négliger.
        </li>
        <li>
          <strong>Produits cartésiens.</strong> Un <code>JOIN</code> sans clause <code>ON</code>{" "}
          (ou avec une condition toujours vraie) produit une jointure croisée qui multiplie le nombre
          de lignes. Lorsque chaque <code>JOIN</code> est sur sa propre ligne avec sa condition{" "}
          <code>ON</code> indentée en dessous, une condition manquante est immédiatement évidente.
        </li>
        <li>
          <strong>Modèles de requêtes N+1.</strong> Voir une requête sélectionner une liste d'ID dans
          une sous-requête puis effectuer une jointure vers la même table est le signe que la requête
          pourrait être réécrite avec une jointure directe — éliminant le problème N+1 au niveau SQL
          plutôt que dans le code applicatif.
        </li>
        <li>
          <strong>Fonctions sur des colonnes indexées.</strong>{" "}
          <code>WHERE DATE(created_at) = '2024-01-01'</code>{" "}
          empêche la base de données d'utiliser un index sur <code>created_at</code>. Dans une requête
          formatée ce modèle ressort clairement ; dans un one-liner minifié il est invisible.
        </li>
      </ul>

      <h2>Dialectes SQL : différences syntaxiques à connaître</h2>
      <p>
        SQL est un standard (ISO/IEC 9075), mais chaque grande base de données l'étend avec une syntaxe
        propre à son dialecte. Voici ce qui compte pour le formatage :
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base de données</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Délimitation des identifiants</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Différences notables</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"guillemets_doubles"</code></td>
              <td style={{padding: "10px 16px"}}>Identifiants sensibles à la casse quand ils sont entre guillemets ; <code>ILIKE</code> pour la correspondance insensible à la casse ; clause <code>RETURNING</code> sur INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`backticks`</code></td>
              <td style={{padding: "10px 16px"}}>Insensible à la casse par défaut ; syntaxe <code>LIMIT offset, count</code> ; <code>GROUP BY</code> autorisait historiquement les colonnes non agrégées</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"guillemets_doubles"</code> ou <code>[crochets]</code></td>
              <td style={{padding: "10px 16px"}}>Système de types permissif ; pas de <code>RIGHT JOIN</code> ni de <code>FULL OUTER JOIN</code> dans les anciennes versions ; instructions <code>PRAGMA</code> pour les informations de schéma</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[crochets]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> au lieu de <code>LIMIT</code> ; conseils <code>NOLOCK</code> ; <code>GETDATE()</code> au lieu de <code>NOW()</code> ; <code>ISNULL()</code> au lieu de <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL : guillemets doubles et sensibilité à la casse</h3>
      <p>
        Dans PostgreSQL, les identifiants non entre guillemets sont convertis en minuscules. Si vous avez
        créé une table avec <code>CREATE TABLE "UserProfiles"</code> (entre guillemets doubles), vous devez
        toujours y faire référence sous la forme <code>"UserProfiles"</code> avec guillemets. Sans
        guillemets, PostgreSQL cherche <code>userprofiles</code> et échoue. C'est une source fréquente de
        confusion lors de la migration depuis MySQL ou lorsque les ORM génèrent des schémas avec des noms
        en casse mixte.
      </p>

      <h3>MySQL : délimitation par backticks</h3>
      <p>
        MySQL utilise des backticks pour délimiter les identifiants, pas des guillemets doubles (bien que
        MySQL en mode <code>ANSI_QUOTES</code> accepte les guillemets doubles). Vous verrez des backticks
        dans le DDL généré par MySQL et dans les requêtes exportées par des outils comme phpMyAdmin. Le
        Formateur SQL gère les identifiants délimités par des backticks et les préserve pour que la sortie
        reste valide pour votre base de données spécifique.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Conseil — spécifiez toujours votre dialecte :</strong> Lorsque vous collez une requête dans
        un formateur, sélectionnez le bon dialecte SQL. MySQL et PostgreSQL ont une syntaxe subtilement
        différente qui affecte la façon dont le formateur gère certaines constructions, notamment autour
        de <code>GROUP BY</code>, des fonctions de fenêtrage et des fonctions de chaîne.
      </div>

      <h2>Comment utiliser le Formateur SQL BrowseryTools</h2>
      <p>
        L'utilisation du formateur se fait en trois étapes :
      </p>
      <ul>
        <li>
          <strong>Collez votre requête.</strong> Copiez le SQL brut depuis votre fichier de log, la
          sortie de votre ORM ou votre éditeur, et collez-le dans la zone de saisie. Le formateur
          accepte n'importe quelle quantité de SQL — instructions uniques, instructions multiples
          ou scripts complets.
        </li>
        <li>
          <strong>Cliquez sur Formater.</strong> Le formateur applique les mots-clés en majuscules,
          la séparation des clauses, l'indentation et un espacement cohérent. Le résultat apparaît
          dans le panneau de sortie instantanément — aucune requête réseau, aucun délai.
        </li>
        <li>
          <strong>Copiez le résultat.</strong> Utilisez le bouton Copier pour mettre le SQL formaté
          dans votre presse-papiers, prêt à être collé dans votre éditeur, votre client de base de
          données ou votre PR.
        </li>
      </ul>
      <p>
        Le formateur s'exécutant entièrement dans votre navigateur, vous pouvez coller en toute sécurité
        des requêtes contenant des données sensibles — noms de tables de production, identifiants clients,
        détails de schémas internes — sans qu'aucune de ces informations ne quitte votre machine. Il n'y a
        pas de serveur back-end pour journaliser vos requêtes.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Vos requêtes restent privées :</strong> Les requêtes SQL contiennent fréquemment des détails
        de schéma, de la logique métier et des données qui ne devraient pas quitter votre environnement. Le
        Formateur SQL BrowseryTools s'exécute à 100 % dans votre navigateur — vos requêtes ne sont jamais
        envoyées à un quelconque serveur, jamais journalisées, jamais stockées. Collez des requêtes de
        production en toute confiance.
      </div>

      <h2>Formatez vos requêtes SQL dès maintenant</h2>
      <p>
        Que vous démêliez un monstre généré par un ORM, révisiez la pull request d'un collègue, déboguiez
        une requête lente, ou essayiez simplement de comprendre ce que fait réellement une réponse de Stack
        Overflow — le SQL formaté rend chacune de ces tâches plus rapide et moins sujette aux erreurs.
        Un bon formatage est l'optimisation des performances la moins coûteuse que vous puissiez faire
        avant de recourir à EXPLAIN.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Formateur SQL gratuit — Instantané, Privé, Sans inscription
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Collez n'importe quelle requête SQL et formatez-la avec une indentation appropriée et des
          mots-clés en majuscules en un clic. Rien ne quitte votre navigateur.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le Formateur SQL →
        </a>
      </div>
      <ToolCTA slug="sql-formatter" variant="card" />
    </div>
  );
}
