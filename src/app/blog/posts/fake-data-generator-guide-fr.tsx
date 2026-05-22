import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Chaque développeur finit par se heurter au même mur : vous avez besoin de données pour tester, mais utiliser de vraies
        données d'utilisateurs est un passif, le Lorem Ipsum est inutile pour autre chose que du remplissage de paragraphes, et
        rédiger à la main 500 enregistrements de test en JSON est un bon moyen de gâcher un après-midi. Les générateurs de fausses données
        existent pour résoudre exactement ce problème — et le{" "}
        <Link href="/tools/fake-data">Générateur de fausses données de BrowseryTools</Link> le fait gratuitement, localement,
        sans compte, sans limite de lignes et sans abonnement.
      </p>
      <p>
        Ce guide explique pourquoi de fausses données réalistes importent, ce que produit le générateur, comment l'utiliser
        efficacement dans différents flux de travail, et comment importer la sortie dans toutes les bases de données et
        chaînes d'outils courantes.
      </p>

      <h2>Pourquoi vous ne pouvez pas utiliser de vraies données d'utilisateurs pour les tests</h2>
      <p>
        Utiliser des données de production dans des environnements de développement ou de test est un risque de conformité et juridique au regard de
        plusieurs cadres réglementaires :
      </p>
      <ul>
        <li>
          <strong>RGPD (Europe) :</strong> l'article 25 exige une minimisation des données dès la conception. Copier
          de vrais enregistrements d'utilisateurs — noms, e-mails, adresses — dans une base de données de préproduction viole ce principe
          à moins que les données n'aient été correctement anonymisées. Une violation de cet environnement de préproduction expose
          les données de vraies personnes.
        </li>
        <li>
          <strong>HIPAA (santé aux États-Unis) :</strong> les informations de santé protégées (PHI) ne peuvent pas être utilisées dans des
          environnements de test sans un Business Associate Agreement ou une dé-identification appropriée
          selon les méthodes Safe Harbor ou Expert Determination. Utiliser de vrais dossiers de patients dans une base de données de
          développement est une violation directe de la HIPAA.
        </li>
        <li>
          <strong>CCPA (Californie) :</strong> les informations personnelles des résidents de Californie sont assorties de
          droits et restrictions spécifiques. Utiliser de vrais enregistrements de clients dans tout contexte hors production
          sans contrôles appropriés crée une exposition au risque inutile.
        </li>
      </ul>
      <p>
        Au-delà de la conformité, il existe des raisons d'ingénierie pratiques d'éviter les vraies données dans les tests : les vraies
        données sont désordonnées de façon imprévisible (elles comportent des champs nuls, des caractères spéciaux et de l'Unicode que
        les tests ne sont peut-être pas conçus pour gérer), elles changent au fil du temps (rendant les tests non déterministes),
        et elles contiennent des valeurs qui peuvent accidentellement déclencher de vrais effets de bord (envoi d'e-mails à de vraies
        adresses, débit de vrais moyens de paiement).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>L'option par défaut plus sûre :</strong> générez de fausses données réalistes pour chaque environnement hors
        production. Elles sont structurellement valides, jamais identifiables, sûres à valider dans le contrôle de version,
        et reproductibles. Les vraies données dans les environnements de développement/test sont un passif par défaut.
      </div>

      <h2>Pourquoi le Lorem Ipsum est le mauvais outil pour les données</h2>
      <p>
        Le Lorem ipsum convient pour remplir des blocs de texte dans une maquette de mise en page. Il est complètement inadapté pour
        tester des interfaces et des API pilotées par les données car :
      </p>
      <ul>
        <li>
          Il ne teste pas les longueurs de champ réelles. Les adresses e-mail, les numéros de téléphone et les codes postaux
          ont tous des formats et des longueurs maximales spécifiques. « Lorem ipsum dolor sit amet » dans un champ
          e-mail ne révélera pas que votre validation d'entrée est erronée, mais{" "}
          <code>very.long.name.that.pushes.limits@subdomain.example.com</code> le fera.
        </li>
        <li>
          Il ne révèle pas les cas limites de votre interface. Un nom comme « José García-López » teste votre
          encodage de caractères. Un nom d'entreprise comme « O'Brien & Associates, LLC » teste votre échappement
          SQL. « Lorem ipsum » ne teste ni l'un ni l'autre.
        </li>
        <li>
          Il fait paraître vos maquettes et prototypes faux d'une façon qui compte. Les parties prenantes examinant
          un prototype avec des noms réalistes, des villes réalistes et des adresses e-mail réalistes peuvent évaluer
          le design correctement. Le texte de remplacement brise l'illusion et rend plus difficile le repérage de
          véritables problèmes d'utilisabilité.
        </li>
      </ul>

      <h2>Ce que produit le Générateur de fausses données de BrowseryTools</h2>
      <p>
        Le générateur prend en charge un large éventail de types de champs sur plusieurs catégories. Vous sélectionnez
        les champs à inclure, et chaque enregistrement généré contient des valeurs réalistes et correctement formatées
        pour chaque champ sélectionné :
      </p>

      <h3>Informations personnelles</h3>
      <ul>
        <li><strong>Nom complet</strong> — combinaisons culturellement réalistes de prénom + nom</li>
        <li><strong>Prénom</strong> et <strong>nom</strong> séparément (utile lorsque votre schéma les stocke dans des colonnes différentes)</li>
        <li><strong>Adresse e-mail</strong> — correctement formatée, utilisant le nom généré comme partie locale</li>
        <li><strong>Numéro de téléphone</strong> — format américain avec indicatif régional</li>
        <li><strong>Date de naissance</strong> — génère des adultes âgés de 18 à 80 ans</li>
        <li><strong>Genre</strong> — masculin / féminin / non binaire</li>
      </ul>

      <h3>Adresse</h3>
      <ul>
        <li><strong>Adresse postale</strong> — numéro de maison et nom de rue réalistes</li>
        <li><strong>Ville</strong> — vrais noms de villes américaines et internationales</li>
        <li><strong>État / région</strong> — États américains et équivalents internationaux</li>
        <li><strong>Pays</strong></li>
        <li><strong>Code postal</strong> — le format correspond au pays sélectionné</li>
      </ul>

      <h3>Internet et identité</h3>
      <ul>
        <li><strong>Nom d'utilisateur</strong> — généré à partir du nom avec des chiffres ajoutés pour le réalisme</li>
        <li><strong>URL</strong> — URL réalistes de sites web personnels ou d'entreprise</li>
        <li><strong>Adresse IP</strong> — adresses IPv4 valides dans des plages publiques</li>
        <li><strong>User agent</strong> — vraies chaînes de user-agent de navigateurs courants</li>
      </ul>

      <h3>Finance</h3>
      <ul>
        <li>
          <strong>Numéro de carte de crédit</strong> — passe la validation de l'algorithme de Luhn, donc il ne sera pas
          rejeté par les validateurs de format ; utilise des préfixes de numéros de carte réalistes (Visa 4xxx, Mastercard 5xxx)
          mais n'est pas un vrai numéro de carte
        </li>
        <li><strong>IBAN</strong> — format valide pour les numéros de comptes bancaires européens</li>
      </ul>

      <h3>Identifiants et champs système</h3>
      <ul>
        <li><strong>UUID</strong> — UUID v4 pour les clés primaires de base de données et les identifiants de corrélation</li>
        <li><strong>SSN</strong> — format de numéro de sécurité sociale américain (XXX-XX-XXXX)</li>
        <li><strong>Dates</strong> et <strong>nombres aléatoires</strong> dans des plages configurables</li>
      </ul>

      <h2>Comment utiliser le générateur</h2>
      <p>
        Ouvrez <Link href="/tools/fake-data">/tools/fake-data</Link>. L'interface vous offre trois contrôles :
      </p>
      <ol>
        <li>
          <strong>Sélectionnez vos champs :</strong> cochez les cases pour chaque type de champ que vous voulez dans la
          sortie. Vous pouvez sélectionner aussi peu qu'un seul champ (juste des adresses e-mail, par exemple) ou l'ensemble
          complet pour des enregistrements d'utilisateurs exhaustifs.
        </li>
        <li>
          <strong>Définissez le nombre d'enregistrements :</strong> saisissez un nombre entre 1 et 1 000. Pour des données de
          départ de test de charge, utilisez 1 000. Pour une story Storybook ou une maquette de design, 5 à 10 enregistrements suffisent généralement.
        </li>
        <li>
          <strong>Choisissez le format de sortie :</strong> sélectionnez JSON ou CSV. Le JSON est préférable pour les tests d'API
          et les chaînes d'outils JavaScript. Le CSV est préférable pour les imports de bases de données, l'examen en tableur ou des outils
          comme Postman.
        </li>
      </ol>
      <p>
        Cliquez sur « Générer ». La sortie apparaît dans la zone de texte ci-dessous. Utilisez le bouton « Copier » pour la copier
        dans votre presse-papiers, ou « Télécharger » pour enregistrer le fichier localement. La génération est instantanée jusqu'à
        1 000 enregistrements — tout le calcul se fait dans votre navigateur.
      </p>

      <h2>Exemple de sortie JSON</h2>
      <p>
        Voici un extrait représentatif de 3 enregistrements de sortie JSON avec des champs personnels, d'adresse et
        d'Internet sélectionnés :
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`[
  {
    "id": "a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e",
    "firstName": "Meredith",
    "lastName": "Okafor",
    "email": "meredith.okafor47@mailbox.net",
    "phone": "(312) 554-8821",
    "dateOfBirth": "1988-03-14",
    "gender": "female",
    "street": "2841 Birchwood Drive",
    "city": "Columbus",
    "state": "OH",
    "zipCode": "43215",
    "country": "United States",
    "username": "meredith_okafor88",
    "ipAddress": "74.125.224.18"
  },
  {
    "id": "b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f",
    "firstName": "Derek",
    "lastName": "Nascimento",
    "email": "d.nascimento@webfrontier.io",
    "phone": "(415) 703-2294",
    "dateOfBirth": "1995-11-02",
    "gender": "male",
    "street": "509 Elmwood Court",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "country": "United States",
    "username": "derek_n95",
    "ipAddress": "192.0.2.147"
  },
  {
    "id": "c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a",
    "firstName": "Simone",
    "lastName": "Bertrand",
    "email": "simone.bertrand@alphamail.com",
    "phone": "(617) 889-4471",
    "dateOfBirth": "1979-07-28",
    "gender": "female",
    "street": "77 Harborview Terrace",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "United States",
    "username": "simone_b79",
    "ipAddress": "203.0.113.42"
  }
]`}</code></pre>

      <h2>Exemple de sortie CSV</h2>
      <p>
        Les mêmes données au format CSV, prêtes à être importées dans un tableur, une base de données ou tout outil qui
        accepte des fichiers délimités :
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Exemple concret 1 : alimenter une base de données d'utilisateurs pour un test de charge</h2>
      <p>
        Tester en charge une API destinée aux utilisateurs nécessite une base de données peuplée. Vous avez besoin d'assez d'enregistrements pour
        simuler des performances de requêtes, un comportement de pagination et une indexation de recherche réalistes — mais vous ne pouvez pas
        utiliser de vraies données d'utilisateurs, et rédiger à la main des milliers d'insertions SQL n'est pas pratique.
      </p>
      <p>
        Avec le générateur de fausses données, générez 1 000 enregistrements avec tous les champs pertinents pour l'utilisateur sélectionnés,
        téléchargez en CSV, puis importez directement dans votre base de données :
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`-- PostgreSQL: import CSV directly into users table
COPY users (id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code)
FROM '/path/to/fake_users.csv'
DELIMITER ','
CSV HEADER;

-- MySQL equivalent:
LOAD DATA LOCAL INFILE '/path/to/fake_users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;

-- MongoDB (using mongoimport):
mongoimport --db myapp --collection users --type csv --headerline --file fake_users.csv`}</code></pre>

      <h2>Exemple concret 2 : peupler une story Storybook ou une maquette de design</h2>
      <p>
        Lors de la construction d'un composant d'interface — une table d'utilisateurs, une carte de contact, une liste de résultats de recherche — les données
        que vous testez déterminent si vous repérez de vrais problèmes. Une table de 10 utilisateurs où l'un a un
        nom très long, l'un a un caractère international dans son e-mail, et l'un a une ville qui
        s'étend sur deux lignes révélera des bogues de mise en page qu'une table de lignes de remplacement identiques ne révélerait
        jamais.
      </p>
      <p>
        Générez 10 à 20 enregistrements en JSON, collez la sortie directement dans votre story Storybook ou votre
        fichier de fixture de composant :
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// UserTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from './UserTable';

// Paste generated JSON directly from BrowseryTools:
const fakeUsers = [
  { id: "a3f7c2e1...", firstName: "Meredith", lastName: "Okafor", email: "meredith.okafor47@mailbox.net", city: "Columbus" },
  { id: "b8e2d5f1...", firstName: "Derek", lastName: "Nascimento", email: "d.nascimento@webfrontier.io", city: "Portland" },
  // ... more records
];

const meta: Meta<typeof UserTable> = { component: UserTable };
export default meta;

export const WithData: StoryObj<typeof UserTable> = {
  args: { users: fakeUsers },
};`}</code></pre>

      <h2>Exemple concret 3 : fixtures de tests d'intégration d'API</h2>
      <p>
        Les tests d'intégration pour un point de terminaison d'API qui crée ou met à jour des enregistrements d'utilisateurs nécessitent un ensemble
        fiable et déterministe de données d'entrée. Plutôt que d'écrire des objets de fixture à la main, générez un ensemble
        d'enregistrements une fois, enregistrez le fichier JSON dans votre répertoire de fixtures de test et importez-le dans vos tests :
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// tests/fixtures/users.json — generated by BrowseryTools, committed to version control
// tests/api/users.test.ts

import users from '../fixtures/users.json';
import { createUser } from '../../src/api/users';

describe('POST /api/users', () => {
  it.each(users.slice(0, 10))('creates user with valid data (%s)', async (user) => {
    const response = await createUser(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
  });
});`}</code></pre>

      <h2>Importer dans des collections Postman</h2>
      <p>
        Pour les tests d'API avec Postman, générez vos enregistrements de test en JSON et utilisez la fonction de fichier de données
        de Postman pour exécuter une requête une fois par enregistrement. Enregistrez la sortie JSON sous forme de fichier, puis dans Postman :
        ouvrez votre exécuteur de collection, sélectionnez la requête et attachez le fichier JSON comme source « Data ».
        Postman parcourra chaque enregistrement, substituant les valeurs dans le corps de votre requête à l'aide de{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code> et d'une syntaxe de variable similaire.
      </p>
      <p>
        Cela transforme une requête POST écrite manuellement en un test automatisé qui s'exécute contre 100
        enregistrements d'utilisateurs réalistes différents en quelques secondes — sans nécessiter la configuration d'un framework de test.
      </p>

      <h2>BrowseryTools face à Mockaroo</h2>
      <p>
        Mockaroo est le générateur de fausses données en ligne le plus connu. C'est un outil solide, mais il a une
        friction que BrowseryTools élimine entièrement :
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Dimension</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (gratuit)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Compte requis", "Non", "Oui"],
              ["Limite de lignes (gratuit)", "1 000 par génération", "1 000/jour au total"],
              ["Abonnement nécessaire pour plus", "Non", "Oui (50 $/an)"],
              ["Données téléversées vers un serveur", "Jamais", "Oui (schéma + données)"],
              ["Accès API", "Sans objet", "Plans payants uniquement"],
              ["Fonctionne hors ligne", "Oui (après le chargement de la page)", "Non"],
              ["Formats de sortie", "JSON, CSV", "JSON, CSV, SQL, Excel et plus"],
              ["Variété des types de champs", "Types courants couverts", "Très étendue"],
            ].map(([dim, bt, moc], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{dim}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{moc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Si vous avez besoin de types de champs très spécialisés ou d'une sortie SQL, Mockaroo reste précieux. Pour le
        cas courant — générer du JSON ou du CSV réaliste pour des enregistrements d'utilisateurs — BrowseryTools ne nécessite aucune
        configuration de compte, aucune gestion de limite quotidienne, et aucune préoccupation quant à l'envoi de votre schéma de données à
        un serveur tiers.
      </p>

      <h2>Confidentialité : toute la génération se fait localement</h2>
      <p>
        Chaque nom, e-mail, adresse et UUID que le générateur produit est créé par du JavaScript s'exécutant
        dans votre onglet de navigateur. Les types de champs que vous sélectionnez, le nombre d'enregistrements que vous demandez et les
        données de sortie elles-mêmes ne sont jamais transmis à aucun serveur. BrowseryTools n'a aucun composant backend
        impliqué dans la génération de données.
      </p>
      <p>
        Cela importe moins lors de la génération de fausses données spécifiquement (puisque tout est fictif par
        définition), mais cela importe pour le schéma que vous l'utilisez pour tester. Si vos sélections de champs
        révèlent la structure d'un système interne sensible, cette information reste également locale.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Fausses données contre anonymisation de données :</strong> ce sont des outils distincts pour des objectifs
        distincts. Un générateur de fausses données crée des enregistrements fictifs de toutes pièces — rien n'est basé sur de
        vrais individus. Un outil d'anonymisation de données prend de vrais enregistrements et les transforme pour supprimer les
        informations identifiantes tout en préservant les propriétés statistiques. Si vous avez de vraies données d'utilisateurs
        que vous devez utiliser dans un environnement de test, l'anonymisation est l'outil approprié (regardez du côté
        d'outils comme ARX, Amnesia ou pg_anonymizer de PostgreSQL). Si vous avez besoin de données de test de toutes pièces
        et n'avez aucune donnée réelle sur laquelle vous baser, un générateur de fausses données comme celui-ci est exactement ce qu'il faut.
      </div>

      <h2>Générez votre premier jeu de données maintenant</h2>
      <p>
        Que vous alimentiez une base de données de test de charge, peupliez une story Storybook, écriviez des fixtures de tests
        d'API, ou démontriez simplement une fonctionnalité avec quelque chose qui a l'air réel — de fausses données réalistes sont la
        bonne base, et les générer devrait prendre 30 secondes.
      </p>
      <p>
        Ouvrez le <Link href="/tools/fake-data">Générateur de fausses données de BrowseryTools</Link>, sélectionnez vos champs,
        définissez votre nombre d'enregistrements, choisissez JSON ou CSV, et cliquez sur Générer. Aucun compte, aucune limite de lignes, aucun coût,
        rien de téléversé nulle part.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Générez des données de test réalistes en quelques secondes</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Jusqu'à 1 000 enregistrements. JSON ou CSV. Noms, e-mails, adresses, UUID, cartes de crédit et plus encore.
          Gratuit, local, sans compte requis.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Ouvrir le Générateur de fausses données →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Outils associés :{" "}
        <Link href="/tools/json-formatter">Formateur JSON</Link> ·{" "}
        <Link href="/tools/uuid-generator">Générateur d'UUID</Link> ·{" "}
        <Link href="/tools/regex-tester">Testeur de regex</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV vers JSON</Link> ·{" "}
        <Link href="/">Tous les BrowseryTools</Link>
      </p>
    </div>
  );
}
