import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Regular expression adalah salah satu alat yang developer entah mencintai atau sepenuhnya
        menghindari. Tampilannya mengintimidasi — serangkaian karakter khusus yang padat yang tampaknya
        menantang semua keterbacaan — tetapi model dasarnya sederhana. Begitu Anda memahami cara
        kerjanya, regex yang dibuat dengan baik menjadi salah satu alat satu baris yang paling kuat
        dalam seluruh toolkit Anda.
      </p>
      <ToolCTA slug="regex-tester" variant="inline" />
      <p>
        Panduan ini memotong kebisingan. Daripada mengkatalog setiap fitur regex, ini berfokus pada
        20% sintaks yang menangani 80% kasus penggunaan dunia nyata: karakter class, quantifier, anchor,
        grup, dan flag. Sepanjang jalan, Anda dapat menguji setiap contoh dalam{" "}
        <a href="/tools/regex-tester">BrowseryTools Regex Tester</a> — gratis, tanpa pendaftaran,
        semuanya tetap di browser Anda.
      </p>

      <h2>Apa Itu Regular Expression?</h2>
      <p>
        Regular expression adalah pola yang mendeskripsikan sekumpulan string. Ketika Anda menerapkan
        regex ke sepotong teks, Anda bertanya: "apakah string ini cocok dengan pola saya?" — atau secara
        lebih praktis: "temukan semua substring yang cocok dengan pola saya." Pola itu sendiri ditulis
        dalam mini-bahasa kompak yang didukung secara native oleh sebagian besar bahasa pemrograman.
      </p>
      <p>
        Regular expression berguna kapan pun Anda perlu memvalidasi input (apakah ini alamat email yang
        valid?), mengekstrak data (tarik semua URL dari blok teks), mengubah teks (ganti semua kemunculan
        pola), atau memisahkan string pada pembatas yang kompleks. Mereka berjalan di browser, di server,
        di terminal — di mana saja.
      </p>

      <h2>Sintaks Inti: 20% yang Mencakup 80% Kasus</h2>

      <h3>Karakter Literal dan Titik</h3>
      <p>
        Sebagian besar karakter dalam regex cocok dengan dirinya sendiri. Pola <code>hello</code>
        cocok dengan string "hello" secara literal. Titik <code>.</code> adalah wildcard universal —
        cocok dengan karakter tunggal apa pun kecuali baris baru. Jadi <code>h.llo</code> cocok dengan
        "hello", "hallo", "hxllo", dan seterusnya.
      </p>

      <h3>Karakter Class</h3>
      <p>
        Tanda kurung siku mendefinisikan karakter class — kumpulan karakter di mana salah satunya dapat
        cocok di posisi tersebut.
      </p>
      <ul>
        <li><strong><code>[aeiou]</code></strong> — cocok dengan vokal tunggal apa pun</li>
        <li><strong><code>[a-z]</code></strong> — cocok dengan huruf kecil apa pun (sintaks rentang)</li>
        <li><strong><code>[A-Za-z0-9]</code></strong> — cocok dengan karakter alfanumerik apa pun</li>
        <li><strong><code>[^0-9]</code></strong> — <code>^</code> di dalam tanda kurung menegasikan class; cocok dengan apa pun yang BUKAN digit</li>
      </ul>
      <p>
        Class singkatan mencakup kasus yang paling umum: <code>\d</code> cocok dengan digit apa pun
        (sama dengan <code>[0-9]</code>), <code>\w</code> cocok dengan karakter kata apa pun (huruf,
        digit, underscore), dan <code>\s</code> cocok dengan spasi putih apa pun. Inversi huruf besar
        mereka —{" "}
        <code>\D</code>, <code>\W</code>, <code>\S</code> — cocok dengan yang berlawanan.
      </p>

      <h3>Quantifier</h3>
      <p>
        Quantifier mengontrol berapa kali elemen sebelumnya harus muncul.
      </p>
      <ul>
        <li><strong><code>*</code></strong> — nol kali atau lebih</li>
        <li><strong><code>+</code></strong> — satu kali atau lebih</li>
        <li><strong><code>?</code></strong> — nol atau satu kali (membuat sesuatu opsional)</li>
        <li><strong><code>{"{3}"}</code></strong> — tepat 3 kali</li>
        <li><strong><code>{"{2,5}"}</code></strong> — antara 2 dan 5 kali (inklusif)</li>
        <li><strong><code>{"{3,}"}</code></strong> — 3 kali atau lebih</li>
      </ul>
      <p>
        Secara default, quantifier bersifat greedy — mereka mencocokkan sebanyak mungkin. Menambahkan{" "}
        <code>?</code> setelah quantifier membuatnya lazy: <code>.*?</code> mencocokkan sesedikit
        mungkin. Perbedaan ini sangat penting saat mengekstrak konten antara pembatas.
      </p>

      <h3>Anchor</h3>
      <p>
        Anchor tidak mencocokkan karakter; mereka mencocokkan posisi dalam string.
      </p>
      <ul>
        <li><strong><code>^</code></strong> — awal string (atau awal baris dalam mode multiline)</li>
        <li><strong><code>$</code></strong> — akhir string (atau akhir baris dalam mode multiline)</li>
        <li><strong><code>\b</code></strong> — batas kata — posisi antara karakter kata dan karakter non-kata</li>
      </ul>
      <p>
        Anchor sangat penting untuk validasi. Tanpa anchor, pola <code>\d+</code> akan cocok dengan
        digit dalam "abc123xyz". Dengan anchor — <code>^\d+$</code> — pola hanya cocok dengan string
        yang seluruhnya terdiri dari digit.
      </p>

      <h3>Grup dan Alternasi</h3>
      <p>
        Tanda kurung membuat grup penangkap. Mereka melayani dua tujuan: mengelompokkan sub-ekspresi
        sehingga quantifier berlaku untuk seluruh grup, dan menangkap substring yang cocok untuk
        ekstraksi.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Grup dengan quantifier: cocok dengan satu atau lebih pengulangan "ab"
/(ab)+/   →  cocok dengan "ab", "abab", "ababab"

// Alternasi dengan |: cocok dengan "cat" atau "dog"
/(cat|dog)/  →  cocok dengan "I have a cat" dan "I have a dog"

// Grup penangkap bernama
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`}
      </pre>
      <p>
        Grup non-penangkap — <code>(?:...)</code> — mengelompokkan tanpa menangkap, yang lebih bersih
        ketika Anda hanya membutuhkan perilaku pengelompokan dan tidak perlu mengekstrak teks yang cocok.
      </p>

      <h2>Contoh Praktis</h2>

      <h3>Validasi Email</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}
      </pre>
      <p>
        Pemecahannya: <code>^</code> mengangkur ke awal. <code>[a-zA-Z0-9._%+-]+</code>{" "}
        cocok dengan bagian lokal (satu atau lebih karakter yang diizinkan). <code>@</code> adalah
        tanda at literal. <code>[a-zA-Z0-9.-]+</code> cocok dengan nama domain. <code>\.</code>
        adalah titik literal (di-escape, karena <code>.</code> tanpa escape berarti "karakter apa pun").{" "}
        <code>[a-zA-Z]{"{2,}"}</code>{" "}
        cocok dengan TLD dengan setidaknya 2 huruf. <code>$</code> mengangkur ke akhir.
      </p>

      <h3>Nomor Telepon (Format AS)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^\+?1?\s?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})$/`}
      </pre>
      <p>
        Ini cocok dengan format seperti <code>555-867-5309</code>, <code>(555) 867-5309</code>,{" "}
        <code>+1 555 867 5309</code>, dan <code>5558675309</code>. Trik utamanya adalah menggunakan{" "}
        <code>?</code> untuk membuat pemisah opsional dan mengelompokkan kode area dengan tanda kurung
        opsional.
      </p>

      <h3>Mengekstrak URL dari Teks</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/https?:\/\/[^\s"'<>]+/g`}
      </pre>
      <p>
        <code>https?</code> cocok dengan "http" dan "https" (<code>s</code> bersifat opsional).{" "}
        <code>:\/\/</code> cocok dengan "//" literal dengan slash yang di-escape. <code>[^\s"'&lt;&gt;]+</code>{" "}
        cocok dengan semua yang bukan spasi putih atau karakter yang biasanya mengakhiri URL. Flag{" "}
        <code>g</code> menemukan semua kecocokan, bukan hanya yang pertama.
      </p>

      <h2>Flag Regex</h2>
      <p>
        Flag mengubah cara seluruh pola diterapkan.
      </p>
      <ul>
        <li><strong><code>g</code> (global)</strong> — temukan semua kecocokan, bukan hanya yang pertama</li>
        <li><strong><code>i</code> (case-insensitive)</strong> — perlakukan huruf besar dan kecil sebagai setara; <code>/hello/i</code> cocok dengan "Hello", "HELLO", dan "hello"</li>
        <li><strong><code>m</code> (multiline)</strong> — membuat <code>^</code> dan <code>$</code> cocok dengan awal/akhir setiap baris daripada seluruh string</li>
        <li><strong><code>s</code> (dotAll)</strong> — membuat <code>.</code> juga cocok dengan baris baru, berguna untuk pencocokan antar jeda baris</li>
      </ul>
      <p>
        Dalam JavaScript, flag ditempatkan setelah slash penutup: <code>/pattern/gi</code>. Dalam
        Python, mereka diteruskan sebagai argumen kedua:{" "}
        <code>re.findall(pattern, text, re.IGNORECASE)</code>.
      </p>

      <h2>JavaScript vs Python: Perbedaan Utama</h2>
      <p>
        Sintaks regex sebagian besar sama antara JavaScript dan Python, tetapi ada beberapa perbedaan
        penting.
      </p>
      <ul>
        <li><strong>Grup bernama</strong>: JavaScript menggunakan <code>(?&lt;name&gt;...)</code>, Python menggunakan yang sama. Keduanya mengembalikan grup bernama tetapi mengaksesnya secara berbeda — <code>match.groups.name</code> dalam JS, <code>match.group('name')</code> dalam Python.</li>
        <li><strong>Lookahead / lookbehind</strong>: Keduanya mendukung <code>(?=...)</code> (positive lookahead) dan <code>(?!...)</code> (negative lookahead). Python juga mendukung lookbehind dengan panjang variabel; engine JavaScript yang lebih lama tidak.</li>
        <li><strong>Unicode</strong>: JavaScript memerlukan flag <code>u</code> untuk menangani properti escape Unicode seperti <code>\p{"{Letter}"}</code>. Modul <code>re</code> Python menangani Unicode secara default.</li>
        <li><strong>Raw string</strong>: Dalam Python, selalu gunakan raw string (<code>r"\d+"</code>) untuk menghindari double-escaping backslash. Dalam JavaScript, Anda menggunakan sintaks literal <code>/\d+/</code> atau string <code>"\\d+"</code> saat membuat dengan <code>new RegExp()</code>.</li>
      </ul>

      <h2>Kesalahan Regex Umum</h2>
      <ul>
        <li><strong>Backtracking katastrofik</strong> — pola seperti <code>(a+)+</code> pada string yang tidak cocok dapat menyebabkan backtracking eksponensial, mengunci engine. Hindari quantifier bersarang pada pola yang tumpang tindih.</li>
        <li><strong>Lupa meng-escape titik</strong> — <code>3.14</code> sebagai pola cocok dengan "3X14" karena <code>.</code> adalah wildcard. Gunakan <code>3\.14</code> untuk mencocokkan titik literal.</li>
        <li><strong>Tidak mengangkur pola validasi</strong> — tanpa <code>^</code> dan <code>$</code>, pola yang dimaksudkan untuk memvalidasi seluruh string akan cocok dengan string mana pun yang mengandung pola sebagai substring.</li>
        <li><strong>Menggunakan regex untuk parsing HTML</strong> — regex tidak dapat menangani struktur yang bersarang secara arbitrer. Gunakan parser HTML yang tepat (DOMParser di browser, BeautifulSoup di Python) untuk HTML.</li>
      </ul>

      <h2>Uji Pola Anda Dengan Aman di Browser</h2>
      <p>
        Menulis regex dalam editor tanpa loop umpan balik itu menyakitkan. Anda menulis pola, menjalankan
        kode, melihatnya gagal, menyesuaikan pola, menjalankan lagi. Tester regex langsung mempersingkat
        loop ini — Anda melihat kecocokan yang disorot secara real-time saat Anda mengetik.
      </p>
      <p>
        <a href="/tools/regex-tester">BrowseryTools Regex Tester</a> memungkinkan Anda menulis pola,
        menempel string test, dan melihat semua kecocokan yang disorot secara instan. Ia berjalan
        sepenuhnya di browser Anda, sehingga Anda dapat menguji terhadap data nyata — log, input
        pengguna, string produksi — tanpa mengirim apa pun ke server.
      </p>

      <h2>Ringkasan</h2>
      <p>
        Regular expression memberikan manfaat atas waktu yang Anda investasikan untuk mempelajarinya.
        Kosakata inti — karakter class, quantifier, anchor, grup, dan flag — itu kecil. Pola yang
        dapat Anda bangun darinya itu luas. Mulailah dengan contoh-contoh dalam panduan ini, uji
        terhadap string Anda sendiri, dan sintaksnya akan menjadi intuitif lebih cepat dari yang Anda
        harapkan.
      </p>
      <ToolCTA slug="regex-tester" variant="card" />
    </div>
  );
}
