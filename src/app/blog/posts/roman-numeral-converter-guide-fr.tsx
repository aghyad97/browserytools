import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Les chiffres romains sont partout dès qu'on commence à les chercher : l'année de copyright
        en fin de film, les numéros de chapitres dans un livre, les titres du Super Bowl, les
        cadrans d'horloge, le &ldquo;MMXXVI&rdquo; sur une pierre angulaire. Ils sont élégants,
        mais les lire et les écrire n'est pas intuitif — vite, qu'est-ce que <strong>MCMXCIV</strong> ?
        Ce guide explique exactement comment fonctionnent les chiffres romains, les règles qui
        piègent les gens, et comment convertir n'importe quel nombre dans les deux sens instantanément.
      </p>
      <ToolCTA slug="roman-numeral" variant="inline" />
      <p>
        Si vous avez juste besoin de la réponse, le{" "}
        <a href="/tools/roman-numeral">BrowseryTools Roman Numeral Converter</a> convertit des
        chiffres en chiffres romains et inversement dans votre navigateur — gratuit, sans
        inscription, rien n'est uploadé. Lisez la suite pour comprendre comment le système
        fonctionne réellement et pouvoir vérifier n'importe quel résultat vous-même.
      </p>

      <h2>Les sept symboles</h2>
      <p>
        Tout le système est construit à partir de seulement sept lettres, chacune ayant une valeur fixe :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000`}
      </pre>
      <p>
        Tout chiffre romain est un agencement de ces sept symboles. Il n'y a pas de zéro, et il
        n'y a pas de symbole pour les nombres négatifs — le système a été conçu pour compter et
        étiqueter, pas pour faire de l'arithmétique.
      </p>

      <h2>Les deux règles qui gouvernent tout</h2>
      <p>
        <strong>Règle 1 — Additionner quand les symboles sont décroissants.</strong> Quand un
        symbole de valeur égale ou inférieure suit un symbole plus grand, on les additionne. Ainsi
        <code>VI</code> est 5 + 1 = 6, <code>XV</code> est 10 + 5 = 15, et <code>MDC</code>
        est 1000 + 500 + 100 = 1600. On lit de gauche à droite en maintenant un total courant.
      </p>
      <p>
        <strong>Règle 2 — Soustraire quand un symbole plus petit précède un plus grand.</strong>
        Placer une valeur plus petite <em>avant</em> une plus grande signifie soustraire.
        <code>IV</code> est 5 &minus; 1 = 4, <code>IX</code> est 10 &minus; 1 = 9,
        <code>XL</code> est 50 &minus; 10 = 40, et{" "}
        <code>CM</code> est 1000 &minus; 100 = 900. Cette notation soustractive est la raison
        pour laquelle les chiffres romains évitent les répétitions de quatre en ligne comme IIII.
      </p>
      <p>
        Seules six paires soustractives sont valides : <code>IV</code> (4), <code>IX</code> (9),{" "}
        <code>XL</code> (40), <code>XC</code> (90), <code>CD</code> (400) et <code>CM</code> (900).
        On ne soustrait que les puissances de dix (I, X, C), et seulement des une ou deux valeurs
        suivantes dans l'échelle.
      </p>

      <h2>Comment lire MCMXCIV (le difficile)</h2>
      <p>
        Décomposez-le en blocs soustractifs et additifs de gauche à droite :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`M    = 1000
CM   =  900   (1000 - 100)
XC   =   90   (100 - 10)
IV   =    4   (5 - 1)
-----------
       1994`}
      </pre>
      <p>
        Donc <strong>MCMXCIV = 1994</strong>. Une fois que vous repérez les quatre blocs soustractifs,
        même les longs chiffres se décodent rapidement.
      </p>

      <h2>Comment écrire un nombre en chiffres romains</h2>
      <p>
        Traitez un chiffre à la fois, des milliers aux unités, et écrivez chaque ordre avec ses symboles :
      </p>
      <p>
        Prenons <strong>2026</strong>. Milliers : 2 &rarr; <code>MM</code>. Centaines : 0 &rarr; rien.
        Dizaines : 2 &rarr; <code>XX</code>. Unités : 6 &rarr; <code>VI</code>. Assemblés :{" "}
        <strong>MMXXVI</strong>. Prenons <strong>49</strong> : dizaines 4 &rarr; <code>XL</code>,
        unités 9 &rarr;{" "}
        <code>IX</code>, ce qui donne <strong>XLIX</strong> — un bon rappel que 49 n'est <em>pas</em>
        IL, car on ne peut soustraire que des une ou deux valeurs suivantes dans l'échelle.
      </p>

      <h2>Erreurs courantes</h2>
      <p>
        <strong>Répéter un symbole quatre fois.</strong> 4 s'écrit <code>IV</code>, pas <code>IIII</code> ;
        40 s'écrit <code>XL</code>, pas <code>XXXX</code>. (Les cadrans d'horloge sont une exception
        particulière qui utilise souvent IIII pour 4 par symétrie visuelle.)
      </p>
      <p>
        <strong>Soustractions invalides.</strong> 99 s'écrit <code>XCIX</code> (90 + 9), pas <code>IC</code>.
        On ne peut pas soustraire I de C. Restez sur les six paires valides.
      </p>
      <p>
        <strong>Nombres supérieurs à 3999.</strong> Les chiffres romains standard s'arrêtent à 3999
        (MMMCMXCIX). Les valeurs plus grandes utilisaient historiquement une barre sur une lettre
        pour multiplier par 1000, mais c'est rarement nécessaire aujourd'hui.
      </p>

      <h2>Où voit-on encore les chiffres romains</h2>
      <p>
        Les années de copyright dans les films et séries télévisées, les chapitres et préfaces
        de livres, les noms de monarques et de papes (Élisabeth II, Benoît XVI), le Super Bowl,
        les Jeux Olympiques, les cadrans d'horloges et de montres, les pierres angulaires de
        bâtiments, et la numérotation des plans. Connaître les règles transforme tout cela
        d'une énigme en une lecture instantanée.
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Comment écrire 0 en chiffres romains ?</strong> C'est impossible — le système n'a
        pas de symbole pour le zéro. Les érudits médiévaux utilisaient parfois le mot <em>nulla</em>
        à la place.
      </p>
      <p>
        <strong>Quel est le plus grand chiffre romain standard ?</strong> 3999, écrit MMMCMXCIX.
      </p>
      <p>
        <strong>Pourquoi les horloges utilisent-elles IIII au lieu de IV ?</strong> Par tradition
        et symétrie visuelle ; cela équilibre le VIII du côté opposé. C'est une exception
        stylistique, pas la règle standard.
      </p>
      <p>
        <strong>Puis-je convertir dans les deux sens ?</strong> Oui — le{" "}
        <a href="/tools/roman-numeral">convertisseur</a> va des chiffres aux chiffres romains et
        des chiffres romains aux chiffres.
      </p>

      <h2>Convertir instantanément</h2>
      <p>
        Ouvrez le <a href="/tools/roman-numeral">convertisseur de chiffres romains</a> pour
        traduire n'importe quel nombre dans un sens ou dans l'autre — pratique pour décoder
        une année de copyright ou écrire un tatouage, un titre ou une inscription. BrowseryTools
        dispose également d'une{" "}
        <a href="/tools/calculator">calculatrice scientifique</a> et d'une{" "}
        <a href="/tools/percentage-calculator">calculatrice de pourcentages</a> pour les
        calculs que les Romains n'ont jamais eu l'occasion de faire.
      </p>
      <ToolCTA slug="roman-numeral" variant="card" />
    </div>
  );
}
