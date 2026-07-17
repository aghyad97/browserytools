import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Si vous avez déjà déployé une application web, configuré un pipeline CI/CD ou administré un serveur Linux, vous avez
        presque certainement rencontré une expression cron. Cinq astérisques vous fixant depuis un fichier de configuration.
        Une chaîne cryptique comme <code>0 2 * * 0</code> enfouie dans un workflow GitHub Actions. Une planification AWS EventBridge
        que plus personne dans l'équipe ne comprend totalement. Les expressions cron sont partout — et elles sont réellement
        déroutantes si vous n'avez pas pris le temps d'apprendre le système qui les sous-tend.
      </p>
      <ToolCTA slug="cron-parser" variant="inline" />
      <p>
        Ce guide est la référence que vous devriez mettre en favori. Il couvre tout, de l'histoire de cron et de l'endroit où il
        apparaît dans l'infrastructure moderne, à chaque caractère spécial, 10 exemples concrets annotés, les erreurs courantes
        et un tableau de référence complet. À la fin, vous serez capable de lire n'importe quelle expression cron d'un coup d'œil
        et d'en écrire de nouvelles avec confiance.
      </p>

      <h2>Qu'est-ce que cron ?</h2>
      <p>
        Cron est un planificateur de tâches basé sur Unix qui exécute des commandes ou des scripts automatiquement à des heures et
        intervalles spécifiés. Le nom vient de <strong>Chronos</strong>, la personnification grecque du temps — un choix judicieux
        pour un outil dont le but entier est l'automatisation basée sur le temps. Le cron d'origine a été introduit dans{" "}
        <strong>Unix Version 7 en 1979</strong>, écrit par Ken Thompson chez Bell Labs, et il est depuis un pilier des
        systèmes d'exploitation de type Unix.
      </p>
      <p>
        Le planificateur fonctionne en lisant des fichiers de configuration appelés <strong>crontabs</strong> (tables cron) — de simples
        fichiers texte où chaque ligne définit une tâche planifiée. Un processus démon en arrière-plan (<code>crond</code>) se réveille
        chaque minute, vérifie tous les crontabs actifs et exécute toute tâche dont la planification correspond à l'heure actuelle.
        C'est une conception magnifiquement simple qui est restée fondamentalement inchangée depuis plus de quatre décennies.
      </p>

      <h2>Où vous rencontrez cron aujourd'hui</h2>
      <p>
        Cron n'est pas qu'une relique du passé d'Unix. La syntaxe des expressions cron est la norme de facto pour
        exprimer des planifications récurrentes à travers la pile logicielle moderne :
      </p>
      <ul>
        <li><strong>crontab Linux et macOS :</strong> le cas d'usage d'origine. Exécutez <code>crontab -e</code> sur n'importe quelle
        machine Linux ou macOS pour modifier votre planification cron personnelle.</li>
        <li><strong>GitHub Actions :</strong> les fichiers de workflow utilisent la syntaxe cron sous le déclencheur <code>schedule:</code>
        pour exécuter des pipelines CI/CD de façon récurrente.</li>
        <li><strong>AWS EventBridge (anciennement CloudWatch Events) :</strong> déclenche des fonctions Lambda, des tâches ECS et
        d'autres services AWS sur une planification en utilisant une variante cron à 6 champs.</li>
        <li><strong>CronJobs Kubernetes :</strong> la ressource <code>CronJob</code> exécute des charges de travail par lots à l'intérieur d'un
        cluster sur une planification cron.</li>
        <li><strong>Pipelines CI/CD :</strong> GitLab CI, CircleCI, Jenkins et Bitbucket Pipelines prennent tous en charge
        les exécutions planifiées à l'aide d'expressions cron.</li>
        <li><strong>Vercel et Netlify :</strong> les deux plateformes prennent en charge les fonctions serverless déclenchées par cron pour
        des tâches comme l'invalidation de cache, la récupération de données et les builds nocturnes.</li>
        <li><strong>Maintenance de base de données :</strong> l'extension <code>pg_cron</code> de PostgreSQL, le planificateur d'événements MySQL,
        et les services de bases de données managées utilisent la syntaxe cron pour les tâches de nettoyage, d'indexation et de sauvegarde.</li>
        <li><strong>Planificateurs au niveau applicatif :</strong> des bibliothèques comme node-cron, APScheduler (Python), Quartz
        (Java) et Sidekiq (Ruby) utilisent toutes des expressions cron pour définir des tâches d'arrière-plan récurrentes.</li>
      </ul>
      <p>
        En bref : si vous travaillez dans un domaine du développement logiciel ou de l'administration système, les expressions cron sont
        quelque chose que vous rencontrerez régulièrement. Les apprendre une fois rapporte des dividendes partout.
      </p>

      <h2>La structure à cinq champs</h2>
      <p>
        Une expression cron standard se compose d'exactement cinq champs séparés par des espaces, chacun représentant une unité
        de temps. Ensemble, ils définissent quand une tâche doit s'exécuter. Voici la représentation visuelle canonique :
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "20px 24px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7", margin: "24px 0"}}>{`┌───────────── minute (0–59)
│ ┌─────────── heure (0–23)
│ │ ┌───────── jour du mois (1–31)
│ │ │ ┌─────── mois (1–12)
│ │ │ │ ┌───── jour de la semaine (0–7)
│ │ │ │ │
* * * * *`}</pre>
      <p>
        En lisant de gauche à droite : minute, heure, jour du mois, mois, jour de la semaine. Un astérisque (<code>*</code>) dans n'importe quel
        champ signifie « toute valeur possible pour ce champ ». Ainsi <code>* * * * *</code> signifie « chaque minute de chaque
        heure de chaque jour » — la planification la plus permissive possible.
      </p>

      <h3>Champ 1 : minute (0–59)</h3>
      <p>
        Le champ minute contrôle à quelle(s) minute(s) au sein d'une heure une tâche se déclenche. Une valeur de <code>0</code> signifie
        à l'heure pile, <code>30</code> signifie à la demi-heure, et <code>*</code> signifie chaque minute. C'est le
        champ le plus granulaire du cron standard — la plus petite unité de planification est une minute.
      </p>

      <h3>Champ 2 : heure (0–23)</h3>
      <p>
        Le champ heure utilise le format 24 heures. <code>0</code> est minuit, <code>9</code> est 9 h, <code>17</code> est
        17 h, et <code>23</code> est 23 h. Il n'y a pas d'AM/PM — tout est au format 24 heures. Rappelez-vous que cron
        s'exécute toujours dans le fuseau horaire du serveur sauf configuration explicite contraire.
      </p>

      <h3>Champ 3 : jour du mois (1–31)</h3>
      <p>
        Contrôle quel(s) jour(s) du mois une tâche s'exécute. <code>1</code> est le premier, <code>15</code> est le
        quinzième, <code>31</code> est le trente et unième. Soyez prudent avec des valeurs comme <code>31</code> — dans les mois
        comptant moins de jours (février, avril, juin, etc.), une tâche planifiée pour le 31 ne s'exécutera tout simplement pas ce mois-là.
        Certaines implémentations prennent en charge le caractère spécial <code>L</code> pour signifier « dernier jour du mois »
        quel que soit le nombre de jours du mois.
      </p>

      <h3>Champ 4 : mois (1–12)</h3>
      <p>
        Le champ mois utilise des valeurs numériques (1 pour janvier jusqu'à 12 pour décembre) ou des abréviations de trois lettres
        (<code>JAN</code>, <code>FEB</code>, <code>MAR</code>, <code>APR</code>, <code>MAY</code>, <code>JUN</code>,
        <code>JUL</code>, <code>AUG</code>, <code>SEP</code>, <code>OCT</code>, <code>NOV</code>, <code>DEC</code>)
        dans la plupart des implémentations. Un astérisque signifie « chaque mois ».
      </p>

      <h3>Champ 5 : jour de la semaine (0–7)</h3>
      <p>
        Ce champ spécifie quel(s) jour(s) de la semaine la tâche doit s'exécuter. La numérotation ici est une source courante de
        confusion : <strong>0 et 7 représentent tous deux le dimanche</strong> dans la plupart des implémentations cron (une bizarrerie héritée de
        la conception Unix d'origine). Lundi est 1, mardi est 2, et samedi est 6. Les abréviations de trois lettres
        (<code>SUN</code>, <code>MON</code>, <code>TUE</code>, <code>WED</code>, <code>THU</code>, <code>FRI</code>,
        <code>SAT</code>) sont prises en charge dans la plupart des outils cron modernes.
      </p>
      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Important :</strong> lorsque le jour du mois et le jour de la semaine sont tous deux spécifiés (pas <code>*</code>),
        la plupart des implémentations cron les traitent comme une condition OU — la tâche s'exécute si l'une ou l'autre condition correspond. C'est
        un comportement subtil mais critique qui prend de nombreux développeurs au dépourvu.
      </div>

      <h2>Caractères spéciaux</h2>
      <p>
        La véritable puissance des expressions cron vient de six caractères spéciaux qui vous permettent d'exprimer des planifications complexes
        de façon concise. Les comprendre est la clé de la maîtrise.
      </p>

      <h3>* — Joker (toute valeur)</h3>
      <p>
        Un astérisque signifie « correspondre à toute valeur possible dans ce champ ». Dans le champ minute, <code>*</code> signifie
        chaque minute (0 à 59). Dans le champ mois, il signifie chaque mois. C'est la valeur par défaut « je me fiche
        de ce champ ».
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`* * * * *    # Runs every single minute, all day, every day`}</pre>

      <h3>, — Liste (plusieurs valeurs)</h3>
      <p>
        Une virgule sépare une liste de valeurs spécifiques. Le champ correspond si l'heure actuelle correspond à n'importe quelle valeur de
        la liste. C'est ainsi que vous planifiez une tâche pour qu'elle s'exécute à plusieurs heures discrètes sans utiliser de plage.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9,13,17 * * *    # Runs at 9:00 AM, 1:00 PM, and 5:00 PM every day
0 0 1,15 * *       # Runs at midnight on the 1st and 15th of every month`}</pre>

      <h3>- — Plage (de … à)</h3>
      <p>
        Un trait d'union définit une plage inclusive de valeurs. Le champ correspond à chaque valeur entre le début et la fin,
        inclus. C'est idéal pour exprimer des choses comme « pendant les heures de bureau » ou « en semaine ».
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9-17 * * *      # Runs at the top of every hour from 9 AM through 5 PM
0 0 * * 1-5       # Runs at midnight every Monday through Friday`}</pre>

      <h3>/ — Pas (toutes les N unités)</h3>
      <p>
        Une barre oblique définit une valeur de pas. <code>*/5</code> signifie « toutes les 5 unités à partir du minimum ».
        Vous pouvez aussi la combiner avec une plage : <code>0-30/10</code> signifie « toutes les 10 unités entre 0 et 30 »
        (c'est-à-dire 0, 10, 20, 30). Les pas font partie des caractères spéciaux les plus couramment utilisés.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 * * * *       # Every 5 minutes (0, 5, 10, 15, ... 55)
*/15 * * * *      # Every 15 minutes (0, 15, 30, 45)
0 */6 * * *       # Every 6 hours (0:00, 6:00, 12:00, 18:00)
0/15 * * * *      # Same as */15 — starts from 0, every 15 minutes`}</pre>

      <h3>L — Dernier (certaines implémentations uniquement)</h3>
      <p>
        Le caractère <code>L</code> est pris en charge dans certaines implémentations cron (notamment Quartz Scheduler en Java
        et certaines variantes de cron Linux) pour signifier « dernier ». Dans le champ jour du mois, <code>L</code> signifie le dernier
        jour du mois en cours — qu'il s'agisse du 28, 29, 30 ou 31. Il résout le problème de
        la planification de tâches de « fin de mois » sans connaître à l'avance la durée du mois.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 L * *         # Midnight on the last day of every month (Quartz/some crons)`}</pre>

      <h3>? — Aucune valeur spécifique (cron Quartz/Java)</h3>
      <p>
        Le point d'interrogation est utilisé dans Quartz Scheduler (Java) et certains autres outils lorsque vous voulez spécifier un
        jour de la semaine sans aussi spécifier un jour du mois, ou vice versa. Comme il n'a pas de sens logique
        de spécifier les deux (par exemple « le 15 ET un mercredi »), l'un d'eux doit être réglé sur <code>?</code> pour indiquer
        « je m'en fiche ». Le cron Unix standard n'utilise pas ce caractère — vous utilisez <code>*</code> à la place.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 15 * ?        # Quartz: 9 AM on the 15th, day-of-week unspecified
0 9 ? * MON       # Quartz: 9 AM every Monday, day-of-month unspecified`}</pre>

      <h2>10 exemples concrets de cron</h2>
      <p>
        La meilleure façon de consolider votre compréhension est d'étudier de vrais exemples avec le contexte expliquant pourquoi chaque planification
        a été choisie. Voici dix schémas que vous rencontrerez (et utiliserez) régulièrement.
      </p>

      <h3>1. Tous les jours ouvrés à 9 h 00</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 * * 1-5`}</pre>
      <p>
        La minute est <code>0</code> (heure pile), l'heure est <code>9</code> (9 h), le jour du mois et le mois
        sont des jokers, et le jour de la semaine est <code>1-5</code> (du lundi au vendredi). Utilisé pour les rappels de
        stand-up quotidiens, les e-mails de rapport envoyés au début de la journée de travail, et les tâches de synchronisation de données matinales qui ne devraient
        pas s'exécuter le week-end.
      </p>

      <h3>2. Toutes les 15 minutes</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/15 * * * *`}</pre>
      <p>
        La syntaxe de pas <code>*/15</code> dans le champ minute vous donne des exécutions à 0, 15, 30 et 45 minutes après
        chaque heure, 24 h/24. Courant pour les pings de vérification d'état, le préchauffage de cache, les nouvelles tentatives de webhooks, et toute
        tâche de scrutation quasi en temps réel où vous avez besoin de fraîcheur mais où le vrai temps réel est excessif ou indisponible.
      </p>

      <h3>3. Tous les jours à minuit</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 * * *`}</pre>
      <p>
        Minute 0, heure 0, tout le reste en joker. C'est l'un des schémas cron les plus courants qui existent.
        Utilisé pour la génération de rapports quotidiens, la rotation des journaux, l'archivage de base de données, le nettoyage des fichiers temporaires, l'envoi
        d'e-mails de synthèse quotidiens, et toute tâche « une fois par jour » qui devrait s'exécuter en dehors des heures de bureau.
      </p>

      <h3>4. Le premier jour de chaque mois à minuit</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 * *`}</pre>
      <p>
        Le jour du mois est <code>1</code>, tout le reste est en joker (sauf la minute/l'heure fixes). Cela s'exécute le
        1er janvier, le 1er février, le 1er mars, et ainsi de suite. La planification de prédilection pour la génération de factures mensuelles,
        les déclencheurs de cycle de facturation, les renouvellements d'abonnements SaaS et les bilans analytiques mensuels.
      </p>

      <h3>5. Chaque dimanche à 2 h 00</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 2 * * 0`}</pre>
      <p>
        Le jour de la semaine <code>0</code> est le dimanche, et l'heure <code>2</code> est 2 h — un moment où le trafic est généralement
        au plus bas. Utilisé pour les sauvegardes complètes hebdomadaires de base de données, la régénération de sitemap, la réindexation de contenu pour la recherche,
        et les lourdes tâches de traitement par lots qui impacteraient les performances en semaine.
      </p>

      <h3>6. En semaine à 8 h 30, 12 h 30 et 17 h 30</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`30 8,12,17 * * 1-5`}</pre>
      <p>
        Ceci combine une liste dans le champ heure avec une plage dans le champ jour de la semaine. La minute <code>30</code>
        signifie qu'elle se déclenche à la demi-heure. Utilisé pour les lots de notifications planifiées (notifications push, synthèses
        par e-mail), les tâches de synchronisation de données trois fois par jour, et tout flux de travail où vous voulez des points de contact réguliers
        tout au long de la journée de travail sans solliciter chaque heure.
      </p>

      <h3>7. Le 1er janvier à minuit</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 1 *`}</pre>
      <p>
        Le jour du mois <code>1</code> et le mois <code>1</code> (janvier) fixent ensemble cela au jour de l'An.
        Utilisé pour les tâches annuelles comme les renouvellements d'abonnements annuels, l'archivage des données de l'année précédente, la génération
        de rapports de conformité annuels, et la réinitialisation des quotas ou compteurs annuels dans les applications.
      </p>

      <h3>8. Toutes les 5 minutes pendant les heures de bureau en semaine</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 9-17 * * 1-5`}</pre>
      <p>
        Une expression composée combinant un pas (<code>*/5</code>), une plage d'heures (<code>9-17</code>) et une
        plage de jours de la semaine (<code>1-5</code>). Cela vous donne une surveillance ou une scrutation agressive — toutes les 5 minutes
        de 9 h à 17 h du lundi au vendredi — tout en restant silencieux la nuit et le week-end pour économiser des ressources
        et éviter la fatigue d'alerte.
      </p>

      <h3>9. Toutes les 6 heures</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 */6 * * *`}</pre>
      <p>
        Le pas dans le champ heure (<code>*/6</code>) donne quatre exécutions régulièrement espacées par jour : minuit, 6 h,
        midi et 18 h. Utilisé pour la synchronisation de données entre systèmes, le rafraîchissement de jetons d'API à longue durée de vie ou
        d'identifiants OAuth avant leur expiration, et l'invalidation périodique de cache pour du contenu qui change quelques
        fois par jour mais qui n'a pas besoin d'une fraîcheur à la minute près.
      </p>

      <h3>10. Le 15 et le dernier jour de chaque mois</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 15,L * *`}</pre>
      <p>
        Une liste à virgule dans le champ jour du mois combinant une date fixe (<code>15</code>) et le raccourci du
        dernier jour (<code>L</code>). C'est la planification classique de paie bimensuelle — des périodes de paie qui se terminent
        le 15 et le dernier jour du mois. Notez que <code>L</code> nécessite une implémentation qui
        le prend en charge (Quartz, certains crons Linux) ; le crontab standard ne prend pas en charge <code>L</code>.
      </p>

      <h2>Erreurs courantes et pièges</h2>
      <p>
        Les expressions cron présentent plusieurs pièges bien connus qui provoquent des incidents en production. Les comprendre
        à l'avance vous épargnera une douloureuse session de débogage à 2 h du matin.
      </p>

      <h3>La numérotation des jours de la semaine n'est pas universelle</h3>
      <p>
        La plupart des implémentations cron Unix traitent à la fois <code>0</code> et <code>7</code> comme dimanche. Mais certains outils
        (dont certaines bibliothèques au niveau applicatif) commencent la semaine le lundi, faisant de <code>1</code> = lundi
        et <code>7</code> = dimanche. Vérifiez toujours la convention de numérotation de l'outil spécifique que vous utilisez,
        et préférez utiliser des abréviations de trois lettres (<code>MON</code>, <code>TUE</code>, etc.) lorsque
        l'implémentation les prend en charge afin d'éliminer toute ambiguïté.
      </p>

      <h3>Cron s'exécute dans le fuseau horaire du serveur</h3>
      <p>
        C'est probablement la source la plus courante de bogues cron en production. <code>0 9 * * *</code> signifie 9 h
        dans <em>le fuseau horaire de la machine exécutant la tâche</em> — qui peut être UTC, US/Eastern, ou tout autre.
        Documentez toujours l'hypothèse de fuseau horaire dans un commentaire à côté de l'expression cron. Pour les planificateurs basés sur le cloud,
        configurez explicitement le fuseau horaire si la plateforme le prend en charge.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# Good practice: always document the timezone
# Runs at 9 AM US/Eastern (UTC-5 or UTC-4 during DST)
0 14 * * 1-5   # 9 AM ET expressed in UTC`}</pre>

      <h3>Le cron de GitHub Actions s'exécute toujours en UTC</h3>
      <p>
        GitHub Actions utilise la syntaxe cron standard à 5 champs sous la clé <code>on: schedule:</code>, mais le
        planificateur fonctionne toujours en UTC — il n'y a aucune option de configuration de fuseau horaire. Si vous voulez qu'une tâche s'exécute
        à 9 h heure de l'Est, vous devez la planifier à <code>0 14 * * *</code> (UTC). Notez également que les workflows planifiés
        de GitHub Actions peuvent s'exécuter jusqu'à 15 minutes en retard pendant les périodes de forte demande.
      </p>

      <h3>La syntaxe de pas s'applique à son champ, pas aux minutes</h3>
      <p>
        Une mauvaise lecture courante : <code>*/5</code> dans le champ <em>heure</em> signifie toutes les 5 heures — pas toutes les 5
        minutes. Le pas s'applique toujours à l'unité du champ dans lequel il se trouve. <code>*/5</code> dans le champ minute
        est toutes les 5 minutes ; dans le champ heure, toutes les 5 heures ; dans le champ mois, tous les 5 mois.
      </p>

      <h3>Les tâches qui durent plus longtemps que leur intervalle peuvent se chevaucher</h3>
      <p>
        Cron est un planificateur « lance et oublie ». Si vous planifiez une tâche toutes les 5 minutes et qu'une instance de la tâche prend
        7 minutes à se terminer, une deuxième instance démarrera pendant que la première est encore en cours d'exécution. Cela peut provoquer des
        conditions de concurrence, des traitements en double et de la corruption de données. Utilisez un verrou de fichier ou un verrou consultatif dans
        votre base de données pour empêcher l'exécution concurrente de la même tâche.
      </p>

      <h3>Les champs manquants et les jokers ne sont pas toujours équivalents</h3>
      <p>
        Dans certaines implémentations cron étendues (en particulier Quartz), omettre un champ et utiliser <code>*</code>
        sont traités différemment. Utilisez toujours tous les champs requis de façon explicite et ne comptez jamais sur les valeurs par défaut pour les
        planifications de production critiques.
      </p>

      <h2>Extensions non standard : le cron à 6 champs</h2>
      <p>
        Le cron Unix standard a cinq champs, avec la minute comme granularité la plus fine. Plusieurs systèmes étendent
        cela avec des champs supplémentaires :
      </p>

      <h3>Champ secondes (ajouté au début)</h3>
      <p>
        De nombreux planificateurs au niveau applicatif (node-cron, Quartz, Spring Scheduler) ajoutent un <strong>champ secondes
        au début</strong>, donnant 6 champs. Cela permet une planification infra-minute jusqu'à la seconde.
        Les champs sont : <code>seconde minute heure jour-du-mois mois jour-de-la-semaine</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# 6-field cron with seconds prepended (Quartz / node-cron)
0 */5 * * * *    # Every 5 minutes (second=0, minute=*/5, ...)
30 0 9 * * 1-5   # Weekdays at 9:00:30 AM`}</pre>

      <h3>AWS EventBridge (6 champs avec année)</h3>
      <p>
        AWS EventBridge utilise un format à 6 champs où un <strong>champ année est ajouté à la fin</strong> :
        <code>minute heure jour-du-mois mois jour-de-la-semaine année</code>. Il exige également l'utilisation de <code>?</code>
        pour le jour du mois ou le jour de la semaine (jamais les deux en jokers en même temps). AWS EventBridge
        ne prend pas en charge la syntaxe de pas <code>*/</code> de la même manière que le cron Unix.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# AWS EventBridge cron format (6 fields, year at end)
cron(0 9 ? * MON-FRI *)    # Weekdays at 9 AM UTC, any year
cron(0 0 1 * ? *)           # First day of every month at midnight`}</pre>
      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Astuce rapide :</strong> lorsque vous copiez une expression cron entre plateformes, vérifiez toujours le nombre
        de champs et les éventuelles différences de syntaxe propres à la plateforme. Une expression cron Unix valide peut être invalide (ou
        signifier quelque chose de différent) dans AWS EventBridge, Quartz, ou un contexte node-cron.
      </div>

      <h2>Comment utiliser l'Analyseur cron de BrowseryTools</h2>
      <p>
        Écrire une expression cron de toutes pièces est une compétence — vérifier que vous l'avez écrite correctement en est une autre.
        L'<a href="/tools/cron-parser">Analyseur cron de BrowseryTools</a> rend trivial de vérifier n'importe quelle expression
        avant qu'elle n'approche de la production.
      </p>
      <p>Collez n'importe quelle expression cron à 5 champs (ou 6 champs) dans l'outil et obtenez instantanément :</p>
      <ul>
        <li>Une <strong>description lisible par un humain</strong> de la planification (« Tous les jours ouvrés à 9 h 00 ») pour que vous puissiez
        vérifier d'un coup d'œil que votre intention correspond à votre expression.</li>
        <li>Les <strong>5 à 10 prochaines heures d'exécution planifiées</strong> listées explicitement, pour que vous puissiez voir exactement quand
        la tâche se déclenchera et confirmer qu'il n'y a aucune surprise.</li>
        <li>Un retour instantané sur une <strong>syntaxe invalide</strong> — utile si vous avez une faute de frappe ou si vous travaillez avec
        une expression écrite par quelqu'un d'autre.</li>
      </ul>
      <p>
        Tout s'exécute entièrement dans votre navigateur — aucune expression n'est envoyée à un serveur. C'est le moyen le plus rapide de
        vérifier la cohérence d'une planification avant de la déployer sur GitHub Actions, Kubernetes ou toute autre plateforme.
      </p>

      <h2>Tableau de référence des expressions cron</h2>
      <p>
        Utilisez ce tableau comme référence rapide. Mettez cette page en favori et revenez-y chaque fois que vous devez rechercher
        un schéma ou vérifier ce que signifie une expression.
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap"}}>Expression</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Signification lisible par un humain</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Cas d'usage typique</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>* * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Chaque minute</td>
              <td style={{padding: "12px 16px"}}>Scrutation à haute fréquence, tests</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Toutes les 5 minutes</td>
              <td style={{padding: "12px 16px"}}>Vérifications d'état, préchauffage de cache</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/15 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Toutes les 15 minutes</td>
              <td style={{padding: "12px 16px"}}>Synchronisation de données, nouvelles tentatives de webhooks</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Chaque heure, à l'heure pile</td>
              <td style={{padding: "12px 16px"}}>Agrégations horaires, appels d'API</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 */6 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Toutes les 6 heures</td>
              <td style={{padding: "12px 16px"}}>Rafraîchissement de jetons, synchronisation de données</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Tous les jours à minuit</td>
              <td style={{padding: "12px 16px"}}>Rapports quotidiens, rotation des journaux</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 9 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>En semaine à 9 h 00</td>
              <td style={{padding: "12px 16px"}}>Tâches en heures de bureau, rappels</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 2 * * 0</code></td>
              <td style={{padding: "12px 16px"}}>Chaque dimanche à 2 h 00</td>
              <td style={{padding: "12px 16px"}}>Sauvegardes hebdomadaires, maintenance</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 * *</code></td>
              <td style={{padding: "12px 16px"}}>Le 1er de chaque mois à minuit</td>
              <td style={{padding: "12px 16px"}}>Factures mensuelles, facturation</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1,15 * *</code></td>
              <td style={{padding: "12px 16px"}}>Le 1er et le 15 de chaque mois</td>
              <td style={{padding: "12px 16px"}}>Paie bimensuelle</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 1 *</code></td>
              <td style={{padding: "12px 16px"}}>Le 1er janvier à minuit</td>
              <td style={{padding: "12px 16px"}}>Tâches annuelles, réinitialisation annuelle</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>30 8,12,17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>En semaine à 8 h 30, 12 h 30, 17 h 30</td>
              <td style={{padding: "12px 16px"}}>Lots de notifications</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 9-17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Toutes les 5 min en heures de bureau (jours ouvrés)</td>
              <td style={{padding: "12px 16px"}}>Surveillance active, scrutation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Validez vos expressions cron avant de déployer</h2>
      <p>
        Les expressions cron sont compactes et puissantes, mais leur concision signifie qu'une seule faute de frappe peut produire silencieusement
        une planification complètement différente. Une tâche que vous vouliez exécuter mensuellement pourrait s'exécuter quotidiennement. Une sauvegarde que vous comptiez
        déclencher chaque dimanche pourrait ne jamais s'exécuter du tout. Le coût d'une mauvaise planification en production peut aller
        d'un rapport manqué à une tâche de facturation qui se déclenche des centaines de fois.
      </p>
      <p>
        L'habitude de deux minutes consistant à coller votre expression dans un validateur et à examiner les prochaines heures d'exécution
        planifiées avant de déployer est l'une des pratiques à plus forte valeur en DevOps et en ingénierie backend. Elle
        attrape les erreurs avant qu'elles ne deviennent des incidents.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Validez n'importe quelle expression cron instantanément — gratuit, privé, dans le navigateur
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Collez votre expression, obtenez une description lisible par un humain, et voyez les prochaines heures d'exécution planifiées.
          Rien ne quitte votre navigateur.
        </p>
        <a
          href="/tools/cron-parser"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Ouvrir l'Analyseur cron →
        </a>
      </div>
      <ToolCTA slug="cron-parser" variant="card" />
    </div>
  );
}
