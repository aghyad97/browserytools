export default function Content() {
  return (
    <div>
      <p>
        La plupart des gens empruntent des sommes importantes à un moment ou un autre de leur vie —
        un crédit immobilier, un prêt auto, un prêt étudiant, un crédit personnel pour des travaux.
        Pourtant, la plupart n'ont qu'une vague idée du fonctionnement réel de ces prêts. Ils
        connaissent leur mensualité et le taux d'intérêt approximatif, et c'est généralement tout.
        Les détails — quelle part de chaque mensualité rembourse réellement le capital, combien
        d'intérêts ils paieront au total, ce qui se passe s'ils effectuent des remboursements
        supplémentaires — restent opaques.
      </p>
      <p>
        Ce guide explique clairement la mécanique du remboursement d'un prêt, incluant le calcul
        mathématique des mensualités, ce que signifie l'amortissement et pourquoi cela compte,
        la différence importante entre le TAEG et le taux d'intérêt, et comment comparer les offres
        de prêt intelligemment.
      </p>
      <p>
        Vous pouvez utiliser le{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> — gratuit, sans inscription,
        tout reste dans votre navigateur.
      </p>

      <h2>La formule de calcul des mensualités</h2>
      <p>
        La mensualité d'un prêt à taux fixe est calculée à l'aide d'une formule tenant compte du
        capital (le montant emprunté), du taux d'intérêt et de la durée du prêt :
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>
      <p>
        Où :
      </p>
      <ul>
        <li><strong>M</strong> est la mensualité</li>
        <li><strong>P</strong> est le capital (le montant du prêt)</li>
        <li><strong>r</strong> est le taux d'intérêt mensuel (taux annuel divisé par 12)</li>
        <li><strong>n</strong> est le nombre de mensualités (durée du prêt en mois)</li>
      </ul>
      <p>
        Exemple concret : un prêt auto de 20 000 € à 6 % d'intérêt annuel sur 48 mois a un taux
        mensuel de 0,5 % (6 % / 12). En appliquant la formule : M = 20 000 × [0,005 × (1,005)^48]
        / [(1,005)^48 - 1] ≈ 470 € par mois. Sur 48 mois, vous payez 22 560 € au total, soit
        2 560 € d'intérêts en plus du capital de 20 000 €.
      </p>
      <p>
        Vous n'avez pas besoin de calculer cela à la main. Le{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> effectue le calcul
        instantanément — mais comprendre ce que fait la formule vous aide à interpréter les
        résultats intelligemment.
      </p>

      <h2>Capital, taux d'intérêt et durée : ce que ces termes signifient vraiment</h2>
      <p>
        Ces trois variables décrivent complètement tout prêt à taux fixe, et elles interagissent
        de façons pas toujours intuitives :
      </p>
      <ul>
        <li>
          <strong>Le capital</strong> est le montant emprunté. C'est le solde initial sur lequel
          les intérêts s'accumulent. Plus le capital est élevé, plus vous payez d'intérêts à taux
          et durée donnés — proportionnellement.
        </li>
        <li>
          <strong>Le taux d'intérêt</strong> est le coût annuel de l'emprunt, exprimé en pourcentage
          du capital restant dû. Une différence de 1 % de taux d'intérêt semble faible mais se
          cumule significativement sur le long terme. Sur un crédit immobilier de 400 000 € sur
          30 ans, la différence entre 3 % et 4 % représente environ 85 000 € d'intérêts totaux.
        </li>
        <li>
          <strong>La durée</strong> est le temps dont vous disposez pour rembourser le prêt,
          exprimé en mois ou en années. Une durée plus longue réduit la mensualité mais augmente
          considérablement les intérêts totaux payés. Une durée plus courte augmente la mensualité
          mais vous sort de l'endettement plus vite et économise un montant substantiel d'intérêts.
        </li>
      </ul>

      <h2>L'amortissement : pourquoi les premières mensualités sont surtout des intérêts</h2>
      <p>
        L'amortissement est le processus de remboursement d'une dette par des versements périodiques
        réguliers. Sur un prêt amortissable standard, chaque mensualité couvre deux choses : les
        intérêts courus sur le solde restant, et une part du capital.
      </p>
      <p>
        L'observation clé — qui surprend la plupart des gens — est que dans les premières années
        d'un prêt, la grande majorité de chaque mensualité va aux intérêts plutôt qu'au
        remboursement du capital. C'est parce que les intérêts sont calculés sur le solde restant,
        qui est à son maximum au début du prêt.
      </p>
      <p>
        Considérons un crédit immobilier de 300 000 € sur 30 ans à 3,5 %. La mensualité est
        d'environ 1 347 €. Au tout premier mois, environ 875 € de cette mensualité sont des
        intérêts et seulement 472 € sont du capital. Après un an de versements — 16 164 € payés —
        le solde de votre prêt n'a diminué que d'environ 5 700 €. Vers l'année 15, le ratio
        s'inverse : une plus grande part de chaque mensualité va au capital qu'aux intérêts.
        Dans les dernières années, presque toute la mensualité est du capital.
      </p>
      <p>
        C'est pourquoi les remboursements supplémentaires effectués tôt dans un prêt sont si
        puissants — chaque euro supplémentaire de capital remboursé réduit le solde sur lequel
        les intérêts futurs sont calculés, créant un effet cumulatif qui élimine des mois ou
        des années de paiements.
      </p>

      <h2>TAEG vs. taux d'intérêt : la différence qui peut coûter des milliers d'euros</h2>
      <p>
        Le taux d'intérêt et le Taux Annuel Effectif Global (TAEG) sont liés mais pas identiques,
        et les confondre est l'une des erreurs les plus courantes lors de la comparaison de prêts.
      </p>
      <ul>
        <li>
          <strong>Le taux d'intérêt</strong> est le coût d'emprunt du seul capital, exprimé en
          pourcentage. Il détermine le montant de votre mensualité.
        </li>
        <li>
          <strong>Le TAEG</strong> inclut le taux d'intérêt plus tous les frais associés au prêt —
          frais de dossier, honoraires de courtage, points de remise, assurance emprunteur et
          autres coûts. Le TAEG représente le vrai coût total de l'emprunt sur la durée du prêt.
        </li>
      </ul>
      <p>
        Un prêt à 2,5 % d'intérêt avec 3 000 € de frais peut avoir un TAEG de 2,9 %. Un prêt
        concurrent à 2,75 % d'intérêt sans frais peut avoir un TAEG de 2,75 %. Le premier prêt a
        un taux d'intérêt plus bas mais un coût réel plus élevé — surtout si vous remboursez ou
        refinancez le prêt avant son terme (ce que font beaucoup de gens). C'est le TAEG que vous
        devriez comparer en cherchant un prêt, pas le taux d'intérêt affiché.
      </p>
      <p>
        En France, les prêteurs sont légalement tenus de communiquer le TAEG. Lorsqu'un prêteur
        affiche un taux d'intérêt particulièrement bas, regardez immédiatement le TAEG — l'écart
        entre les deux révèle souvent où se cachent les frais.
      </p>

      <h2>Comment les remboursements supplémentaires affectent les intérêts totaux</h2>
      <p>
        Effectuer des remboursements supplémentaires — même modestes — sur le capital d'un prêt
        a un effet disproportionné sur les intérêts totaux payés. Comme chaque versement
        supplémentaire réduit le capital, tous les calculs d'intérêts futurs portent sur un solde
        plus bas. Les économies se cumulent dans le temps.
      </p>
      <p>
        Sur un crédit immobilier de 300 000 € sur 30 ans à 3,5 %, effectuer un remboursement
        supplémentaire de 200 € par mois réduit la durée du prêt d'environ 5 ans et économise
        environ 30 000 € d'intérêts. Ces 200 € par mois — 2 400 € par an — rapportent
        approximativement 30 000 € d'économies. Peu d'investissements offrent un rendement
        garanti et sans risque de cette ampleur.
      </p>
      <p>
        Nuance importante : avant d'effectuer des remboursements supplémentaires, vérifiez que
        votre prêt ne comporte pas d'indemnités de remboursement anticipé (la plupart des prêts
        modernes n'en ont pas, mais certains anciens prêts en ont), et confirmez que le versement
        supplémentaire est bien imputé au capital et non en avance sur la prochaine échéance —
        certains prêteurs créditent par défaut les versements supplémentaires comme avances sur
        les prochaines mensualités, ce qui n'a pas le même effet d'économie d'intérêts.
      </p>

      <h2>Comparer les offres de prêt : ne regardez pas seulement la mensualité</h2>
      <p>
        Les prêteurs savent que la mensualité est le chiffre sur lequel la plupart des emprunteurs
        se focalisent, et ils structurent leurs offres en conséquence. Une mensualité plus basse
        semble attrayante mais peut masquer un coût total beaucoup plus élevé si elle est obtenue
        par une durée plus longue ou des frais plus élevés.
      </p>
      <p>
        Lorsque vous comparez des offres de prêt, calculez et comparez toujours :
      </p>
      <ul>
        <li><strong>Les intérêts totaux payés</strong> sur la durée totale du prêt</li>
        <li><strong>Le TAEG</strong> — le vrai coût tout compris avec les frais</li>
        <li><strong>Le montant total remboursé</strong> (capital + tous les intérêts + tous les frais)</li>
        <li><strong>L'indemnité de remboursement anticipé</strong> — s'il y a un coût pour rembourser par anticipation</li>
        <li><strong>Taux fixe vs. taux variable</strong> — les prêts à taux variable peuvent commencer plus bas mais comportent un risque de taux</li>
      </ul>
      <p>
        Deux prêteurs peuvent proposer le même capital au même taux d'intérêt mais avec des
        structures de frais très différentes. Un prêt avec 3 000 € de frais de dossier vs. un
        autre sans frais et un taux légèrement plus élevé — le bon choix dépend de la durée
        pendant laquelle vous comptez conserver le prêt. Pour les courtes durées, des frais
        moins élevés battent des taux plus bas. Pour les longues durées, des taux plus bas l'emportent.
      </p>

      <h2>Le coût caché de l'allongement de la durée</h2>
      <p>
        Quand les mensualités deviennent trop lourdes, la réaction courante est de refinancer sur
        une durée plus longue. Cela réduit effectivement la mensualité, mais le coût est substantiel.
      </p>
      <p>
        Allonger un crédit immobilier restant sur 20 ans à 30 ans pour réduire les mensualités de
        200 € peut coûter des dizaines de milliers d'euros d'intérêts supplémentaires tout en
        ajoutant une décennie de dette. C'est parfois le bon choix en cas de difficultés financières
        réelles — mais cela doit se décider en ayant une vision claire du coût total, pas seulement
        du soulagement mensuel.
      </p>
      <p>
        Faites les calculs avant de refinancer. Le{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> vous permet de comparer
        des scénarios côte à côte — ajustez la durée et voyez l'impact exact sur les intérêts
        totaux avant toute décision.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculateur de prêt gratuit — Amortissement instantané, sans compte requis
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Calculez les mensualités, les intérêts totaux et les tableaux d'amortissement complets
          pour tout prêt. Comparez les scénarios et comprenez votre dette.
        </p>
        <a
          href="/tools/loan-calculator"
          style={{background: "rgba(59,130,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le calculateur de prêt →
        </a>
      </div>
    </div>
  );
}
