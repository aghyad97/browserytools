export default function Content() {
  return (
    <div>
      <p>
        Les freelances et les petites entreprises perdent de l'argent de deux façons : en effectuant
        un travail qui n'est jamais payé, et en facturant mal d'une manière qui ralentit ou empêche
        le paiement. Une facture professionnelle n'est pas seulement une demande de paiement — c'est
        un document légal qui établit ce qui a été convenu, quand le paiement est dû, et quelles
        sont les conséquences d'un retard. Bien faire les choses compte plus que la plupart des
        gens ne le réalisent, jusqu'au jour où ils courent après une facture en souffrance d'un
        client qui ne répond plus.
      </p>
      <p>
        Ce guide couvre tout ce qu'une facture professionnelle doit inclure, les conventions de
        numérotation et les conditions de paiement, les différences d'obligations légales selon
        les pays, et pourquoi le bon outil pour la plupart des freelances est quelque chose de
        simple, gratuit et confidentiel plutôt qu'un autre abonnement.
      </p>
      <p>
        Vous pouvez utiliser le{" "}
        <a href="/tools/invoice">BrowseryTools Invoice Generator</a> — gratuit, sans inscription,
        tout reste dans votre navigateur.
      </p>

      <h2>Ce qu'une facture professionnelle doit obligatoirement inclure</h2>
      <p>
        Une facture qui omet des informations requises peut retarder le paiement, causer des
        problèmes comptables à votre client, ou ne pas satisfaire aux exigences légales de
        certaines juridictions. Au minimum, toute facture professionnelle doit comporter :
      </p>
      <ul>
        <li>
          <strong>Numéro de facture</strong> — Un identifiant séquentiel unique. Il est essentiel
          pour le suivi, pour le système de comptabilité fournisseur de votre client, et pour
          vos propres archives. Une fois un numéro utilisé, ne le réutilisez jamais.
        </li>
        <li>
          <strong>Date de facture</strong> — La date d'émission. C'est le point de référence à
          partir duquel les conditions de paiement sont calculées.
        </li>
        <li>
          <strong>Date d'échéance</strong> — La date à laquelle le paiement doit être reçu.
          L'indiquer explicitement supprime toute ambiguïté et vous donne le droit de relancer
          passé cette date.
        </li>
        <li>
          <strong>Vos coordonnées</strong> — Votre nom légal ou raison sociale, adresse, e-mail,
          et tout numéro d'immatriculation fiscale applicable (numéro de TVA en UE/Royaume-Uni,
          ABN en Australie, numéro TPS au Canada).
        </li>
        <li>
          <strong>Coordonnées du client</strong> — Le nom légal de la société ou de la personne
          facturée et son adresse de facturation. Utiliser le mauvais nom d'entité est une erreur
          courante qui peut entraîner le rejet de la facture par les services comptables du client.
        </li>
        <li>
          <strong>Services ou produits détaillés</strong> — Un détail ligne par ligne de ce qui
          a été livré, la quantité ou les heures, le prix unitaire et le total de la ligne.
          N'envoyez jamais une facture d'une seule ligne pour un montant rond — cela paraît
          informel et invite aux contestations.
        </li>
        <li>
          <strong>Sous-total, taxes et total</strong> — Si vous facturez des taxes, affichez-les
          sur une ligne séparée afin que les clients puissent les rapprocher de leurs obligations
          fiscales.
        </li>
        <li>
          <strong>Instructions de paiement</strong> — Coordonnées bancaires, adresse PayPal ou
          mode de paiement préféré. Les clients ne peuvent pas vous payer s'ils ne savent pas comment.
        </li>
      </ul>

      <h2>Conventions de numérotation des factures</h2>
      <p>
        Les numéros de facture doivent être séquentiels, uniques, et jamais sautés ni réutilisés.
        Il n'y a pas de format unique requis, mais quelques formats sont d'usage courant :
      </p>
      <ul>
        <li><strong>Séquentiel simple :</strong> 001, 002, 003 — fonctionne bien avec un seul client ou un faible volume de factures</li>
        <li><strong>Préfixé par la date :</strong> 2026-001, 2026-002 — le préfixe annuel facilite la localisation chronologique et permet de repartir à zéro chaque année sans confusion</li>
        <li><strong>Préfixé par le client :</strong> DUPONT-001, DUPONT-002 — utile si vous avez un petit nombre de clients long terme et souhaitez organiser les factures par relation</li>
      </ul>
      <p>
        Quel que soit le format choisi, soyez cohérent. Les écarts dans les séquences — passer
        de FAC-047 à FAC-049 — peuvent soulever des questions lors d'un contrôle. Si une facture
        est annulée ou invalidée, notez-le dans vos archives mais conservez le numéro retiré plutôt
        que de le réutiliser.
      </p>

      <h2>Conditions de paiement : Net 30, Net 15, À réception</h2>
      <p>
        Les conditions de paiement définissent le délai dont dispose un client pour régler après
        réception de la facture. Les conditions les plus courantes sont :
      </p>
      <ul>
        <li>
          <strong>À réception</strong> — Le paiement est attendu immédiatement à réception de la
          facture. En pratique, cela est rarement appliqué strictement, mais cela signale
          l'urgence et convient aux petits travaux ponctuels avec de nouveaux clients.
        </li>
        <li>
          <strong>Net 7</strong> — Paiement dû dans les 7 jours. Adapté aux petits projets à
          livraison rapide ou en cas de tension de trésorerie.
        </li>
        <li>
          <strong>Net 15</strong> — Paiement dû dans les 15 jours. Une valeur par défaut
          raisonnable pour la plupart des travaux freelance et des factures de petites entreprises.
        </li>
        <li>
          <strong>Net 30</strong> — Paiement dû dans les 30 jours. La condition la plus courante
          dans la facturation B2B. Les grandes entreprises ont souvent des cycles de paiement
          à 30 jours, donc utiliser cette condition avec les clients corporate réduit les frictions.
        </li>
        <li>
          <strong>Net 60 ou Net 90</strong> — Standard dans certains secteurs (industrie,
          construction, certains contrats publics). Évitez-les sauf si c'est la norme dans votre
          domaine — ils détruisent la trésorerie des petites structures.
        </li>
      </ul>
      <p>
        En tant que freelance, Net 15 est une bonne valeur par défaut. Cela laisse aux clients
        suffisamment de temps pour traiter la facture tout en resserrant votre cycle de trésorerie.
        Indiquez toujours la date d'échéance exacte explicitement (ex. : « Échéance : 15 avril 2026 »)
        plutôt que de s'appuyer uniquement sur la condition (« Net 15 ») — les dates explicites
        ne laissent aucune place à l'interprétation.
      </p>

      <h2>Pénalités de retard : quand les appliquer et comment les formuler</h2>
      <p>
        Les pénalités de retard sont un mécanisme légitime et légal pour inciter au paiement dans
        les délais. Cependant, elles ne fonctionnent que si elles sont annoncées à l'avance —
        idéalement dans votre contrat et sur votre facture. Surprendre un client avec une pénalité
        jamais discutée nuit à la relation et peut ne pas être applicable.
      </p>
      <p>
        Une structure standard de pénalité de retard est de 1,5 % par mois (18 % annuels) sur le
        solde impayé. Certains freelances utilisent une approche à forfait : 25 à 50 € pour les
        factures inférieures à 1 000 €, en augmentant pour les montants plus importants. Les deux
        sont raisonnables. Formulez-le sur la facture ainsi :
        « Des pénalités de retard de 1,5 % par mois seront appliquées aux soldes impayés au-delà
        de l'échéance. »
      </p>
      <p>
        En pratique, appliquer des pénalités de retard à des clients long terme demande du discernement.
        Facturer trois jours de retard à un bon client qui a payé régulièrement pendant deux ans vous
        coûtera probablement plus en bonne volonté que la pénalité ne rapporte. Utilisez les pénalités
        comme levier avec les mauvais payeurs habituels, et comme droit documenté à avoir en réserve.
      </p>

      <h2>Les différences de facturation selon les pays</h2>
      <p>
        Les obligations fiscales sur les factures varient significativement selon les juridictions,
        et les erreurs peuvent créer des problèmes de conformité :
      </p>
      <ul>
        <li>
          <strong>Royaume-Uni et UE (TVA)</strong> — Si vous êtes assujetti à la TVA, vous devez
          inclure votre numéro de TVA et afficher la TVA comme poste distinct. Le taux au
          Royaume-Uni est de 20 % standard. Les taux de l'UE varient selon les pays (Allemagne
          19 %, France 20 %, Irlande 23 %). Les factures B2B au sein de l'UE nécessitent le
          numéro de TVA du client pour l'auto-liquidation.
        </li>
        <li>
          <strong>Australie (TPS)</strong> — La TPS est de 10 % et doit être affichée séparément
          sur les factures émises par les entreprises immatriculées à la TPS. Vous devez inclure
          votre ABN (Australian Business Number). Les factures supérieures à 1 000 AUD doivent
          également porter la mention « Tax Invoice ».
        </li>
        <li>
          <strong>Canada (TPS/TVH)</strong> — Les entreprises immatriculées à la TPS/TVH doivent
          afficher leur numéro d'immatriculation et la TPS/TVH facturée. Le taux combiné varie
          selon la province.
        </li>
        <li>
          <strong>États-Unis</strong> — La facturation fédérale comporte moins d'éléments
          obligatoires que les systèmes à TVA, mais la taxe de vente de l'État peut s'appliquer
          à certains biens et services. Vérifiez les exigences de votre État si vous vendez
          des biens tangibles.
        </li>
      </ul>

      <h2>Pourquoi les factures PDF sont importantes</h2>
      <p>
        Envoyer une facture en PDF plutôt qu'en document Word ou en lien web est important pour
        plusieurs raisons. Les PDF ont un format fixe — un client qui reçoit la facture voit
        exactement ce que vous aviez prévu, quel que soit son système d'exploitation ou son
        logiciel. Ils ne peuvent pas être modifiés accidentellement. Ils peuvent être imprimés,
        archivés et joints à un logiciel de comptabilité sans problème de mise en page.
      </p>
      <p>
        Beaucoup de services comptables d'entreprises rejettent purement et simplement les factures
        non-PDF, exigeant une nouvelle soumission. Générer directement un PDF propre élimine
        cette friction.
      </p>

      <h2>Outils de facturation gratuits vs. payants</h2>
      <p>
        FreshBooks facture à partir de 17 €/mois, QuickBooks à partir de 30 €/mois, et Wave
        (qui était gratuit) facture désormais le traitement des paiements. Pour les freelances
        envoyant 5 à 20 factures par mois, aucune de ces fonctionnalités ne justifie le coût.
        Ce dont vous avez réellement besoin : saisir des lignes, ajouter vos coordonnées, choisir
        les conditions de paiement, générer un PDF. C'est tout.
      </p>
      <p>
        Le{" "}
        <a href="/tools/invoice">BrowseryTools Invoice Generator</a> fait exactement cela — sans compte,
        sans abonnement, et rien n'est stocké sur aucun serveur. Renseignez vos coordonnées,
        ajoutez les lignes, définissez vos conditions de paiement, et téléchargez un PDF propre.
        Vos données de facturation restent dans votre navigateur.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Générateur de factures gratuit — PDF instantané, sans compte requis
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Créez des factures professionnelles avec des lignes détaillées, la taxe et les conditions
          de paiement. Téléchargez en PDF instantanément. Rien n'est stocké sur nos serveurs.
        </p>
        <a
          href="/tools/invoice"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Créer une facture →
        </a>
      </div>
    </div>
  );
}
