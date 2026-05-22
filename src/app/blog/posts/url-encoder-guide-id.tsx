export default function Content() {
  return (
    <div>
      <p>
        URL terlihat sederhana dari luar — serangkaian teks yang menunjuk ke suatu resource. Namun
        di baliknya, URL mengikuti tata bahasa ketat yang hanya mengizinkan sekumpulan karakter
        tertentu. Begitu kamu mencoba memasukkan spasi, ampersand, atau karakter non-ASCII dalam URL
        tanpa mengkodenya, semuanya akan rusak dengan cara yang sulit di-debug. Percent-encoding
        (yang umum disebut URL encoding) adalah mekanisme yang membuat data arbitrer aman untuk
        disematkan dalam URL.
      </p>
      <p>
        Kamu bisa mengkode dan mendekode URL secara instan dengan{" "}
        <a href="/tools/url-encoder">BrowseryTools URL Encoder/Decoder</a> — gratis, tanpa daftar,
        semuanya tetap di browser.
      </p>

      <h2>Mengapa Karakter Khusus Merusak URL</h2>
      <p>
        Spesifikasi URL (RFC 3986) mereservasi karakter-karakter tertentu untuk tujuan struktural.
        Tanda <code>?</code>{" "}
        memisahkan path dari query string. Tanda <code>&amp;</code> memisahkan parameter query satu
        sama lain. Tanda <code>#</code> menandai fragment identifier. Tanda <code>/</code>
        memisahkan segmen path. Jika datamu mengandung karakter-karakter ini, parser URL tidak dapat
        membedakan antara datamu dan struktur URL itu sendiri.
      </p>
      <p>
        Pertimbangkan query penelusuran untuk <code>rock &amp; roll</code>. Konstruksi URL secara
        naif menghasilkan:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/search?q=rock & roll
          ^     ^
          |     └── looks like a new parameter begins here
          └── this & splits q from a phantom second parameter`}
      </pre>
      <p>
        Parser membaca <code>q=rock </code> (dengan spasi di belakang) sebagai parameter pertama,
        lalu menemukan apa yang terlihat seperti awal parameter kedua bernama <code> roll</code>.
        Kedua nilai tersebut salah. URL yang benar adalah{" "}
        <code>/search?q=rock%20%26%20roll</code> — spasi menjadi <code>%20</code> dan ampersand
        menjadi <code>%26</code>.
      </p>

      <h2>Apa yang Sebenarnya Dilakukan Percent-Encoding</h2>
      <p>
        Percent-encoding mengkonversi satu byte menjadi urutan tiga karakter: tanda persen literal
        diikuti oleh dua digit heksadesimal huruf besar yang merepresentasikan nilai byte tersebut.
        Karakter spasi (byte ASCII 32, hex <code>0x20</code>) menjadi <code>%20</code>. Tanda at
        (<code>@</code>, ASCII 64, hex{" "}
        <code>0x40</code>) menjadi <code>%40</code>. Aturannya adalah:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`percent-encode(byte) = "%" + byte.toString(16).toUpperCase().padStart(2, "0")

Examples:
  space  (0x20) → %20
  @      (0x40) → %40
  [      (0x5B) → %5B
  €      (UTF-8: 0xE2 0x82 0xAC) → %E2%82%AC`}
      </pre>
      <p>
        Untuk karakter Unicode multi-byte (apa pun di luar ASCII), karakter tersebut pertama-tama
        dikodekan ke byte UTF-8, lalu setiap byte di-percent-encode. Simbol euro <code>€</code>
        adalah tiga byte UTF-8, sehingga menjadi tiga urutan percent-encoded:{" "}
        <code>%E2%82%AC</code>.
      </p>

      <h2>Karakter Aman vs Karakter Tereservasi</h2>
      <p>
        Tidak setiap karakter perlu dikodekan. RFC 3986 mendefinisikan dua set yang aman digunakan
        apa adanya:
      </p>
      <ul>
        <li><strong>Karakter unreserved</strong> — A–Z, a–z, 0–9, tanda hubung, garis bawah, titik, tilde. Ini tidak memiliki arti khusus dan tidak pernah perlu dikodekan.</li>
        <li><strong>Karakter reserved</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>. Ini AMAN di posisi strukturalnya, tetapi harus dikodekan ketika muncul sebagai nilai data.</li>
      </ul>
      <p>
        Semua karakter lainnya — spasi, Unicode, karakter kontrol, sebagian besar tanda baca —
        harus selalu dikodekan.
      </p>

      <h2>encodeURI vs encodeURIComponent: Perbedaan yang Krusial</h2>
      <p>
        JavaScript memiliki dua fungsi enkoding bawaan, dan mengacaukannya adalah salah satu bug
        URL-encoding yang paling umum di aplikasi web.
      </p>
      <p>
        <code>encodeURI()</code> dirancang untuk mengkodekan URL lengkap. Ia membiarkan semua
        karakter reserved tetap karena secara struktural bermakna dalam URL penuh. Kamu akan
        menggunakannya jika memiliki URL lengkap yang mungkin mengandung spasi atau Unicode
        tetapi memiliki struktur yang valid:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURI("https://example.com/search?q=hello world&lang=en")
// → "https://example.com/search?q=hello%20world&lang=en"
//   ✓ space encoded, but & and ? left intact`}
      </pre>
      <p>
        <code>encodeURIComponent()</code> dirancang untuk mengkodekan satu nilai — nilai parameter
        query, segmen path, apa pun yang perlu diperlakukan sebagai data murni. Ia juga mengkodekan
        karakter reserved, termasuk <code>&amp;</code>, <code>=</code>, <code>?</code>, dan{" "}
        <code>/</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURIComponent("rock & roll")
// → "rock%20%26%20roll"
//   ✓ & encoded — safe to use as a query parameter value

encodeURIComponent("https://example.com/page")
// → "https%3A%2F%2Fexample.com%2Fpage"
//   ✓ colons and slashes encoded — safe as a redirect_uri value`}
      </pre>
      <p>
        Aturan praktisnya: saat membangun URL, gunakan <code>encodeURIComponent()</code> pada setiap
        nilai parameter individu, jangan pernah pada URL lengkap. Gunakan <code>encodeURI()</code>
        hanya pada URL lengkap yang ingin kamu normalisasi. Dalam kode modern, lebih baik gunakan
        API <code>URL</code> dan <code>URLSearchParams</code> daripada enkoding manual — keduanya
        menangani enkoding secara otomatis dan benar.
      </p>

      <h2>Jebakan Enkoding Query String</h2>
      <p>
        Beberapa bug halus muncul berulang kali saat mengkodekan query string. Tanda <code>+</code>
        layak disebut secara khusus: dalam format{" "}
        <code>application/x-www-form-urlencoded</code> (format yang digunakan form HTML saat submit),
        spasi dikodekan sebagai <code>+</code> bukan <code>%20</code>. Ini adalah konvensi lama
        yang mendahului RFC 3986. Jika backend URL-decoding menggunakan aturan form-encoding dan
        frontend mengirim <code>%20</code>, itu berfungsi. Tetapi jika frontend mengirim{" "}
        <code>+</code> dan backend mendekode dengan aturan RFC 3986, <code>+</code> dibiarkan
        sebagai tanda plus literal — bukan spasi.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// URLSearchParams uses application/x-www-form-urlencoded (+ for spaces)
new URLSearchParams({ q: "rock & roll" }).toString()
// → "q=rock+%26+roll"

// encodeURIComponent uses RFC 3986 (%20 for spaces)
"q=" + encodeURIComponent("rock & roll")
// → "q=rock%20%26%20roll"

// Both are valid — just be consistent on both ends`}
      </pre>

      <h2>Cara Data Form Di-URL-Encode</h2>
      <p>
        Ketika form HTML submit dengan <code>method="GET"</code>, browser menserialisasi field form
        menjadi query string menggunakan <code>application/x-www-form-urlencoded</code>. Setiap
        nama dan nilai field dikodekan (spasi sebagai <code>+</code>, karakter khusus sebagai{" "}
        <code>%XX</code>), dan field digabungkan dengan <code>&amp;</code>. Untuk form{" "}
        <code>method="POST"</code> tanpa atribut <code>enctype</code>, enkoding yang sama digunakan
        tetapi data masuk ke body request, bukan URL.
      </p>
      <p>
        Ini juga format yang digunakan <code>fetch()</code> saat kamu memasukkan objek{" "}
        <code>URLSearchParams</code> sebagai body, dan itulah yang paling banyak framework
        server-side dekode secara otomatis saat membaca form submission.
      </p>

      <h2>Base64 dalam URL</h2>
      <p>
        Base64 standar menggunakan <code>+</code> dan <code>/</code> — keduanya memiliki makna
        khusus dalam URL. Ketika data yang dikodekan Base64 perlu muncul dalam URL (pola umum
        untuk token, data gambar, atau tanda tangan kriptografis), gunakan varian Base64URL
        sebagai gantinya. Ia menggantikan <code>+</code> dengan{" "}
        <code>-</code> dan <code>/</code> dengan <code>_</code>, menghasilkan string yang aman
        di posisi URL mana pun tanpa enkoding lebih lanjut. JWT menggunakan format ini untuk
        segmen header dan payload mereka.
      </p>

      <h2>Bug Enkoding di Dunia Nyata</h2>
      <p>
        Beberapa pola bug yang muncul di aplikasi production:
      </p>
      <ul>
        <li><strong>Double-encoding</strong> — mengkodekan URL yang sudah dikodekan. <code>%20</code> menjadi <code>%2520</code> karena <code>%</code> itu sendiri dikodekan menjadi <code>%25</code>. Selalu periksa apakah nilai sudah dikodekan sebelum mengkodekannya lagi.</li>
        <li><strong>Lupa encodeURIComponent pada redirect_uri</strong> — alur OAuth memasukkan <code>redirect_uri</code> sebagai parameter query. Jika mengandung <code>?</code> atau <code>&amp;</code> dan tidak dikodekan, server auth akan memparsing karakter tersebut sebagai bagian dari struktur URL luar, merusak redirect.</li>
        <li><strong>Enkoding non-UTF-8</strong> — sistem lama atau server yang salah konfigurasi terkadang melakukan percent-encode string menggunakan ISO-8859-1 alih-alih UTF-8. Urutan byte untuk <code>é</code> berbeda di antara keduanya. Selalu terapkan UTF-8 secara konsisten di kedua sisi.</li>
        <li><strong>Mencatat URL mentah</strong> — mencatat URL yang mengandung data pengguna yang dikodekan dapat menghasilkan log yang menyesatkan jika log viewer mendekode urutan percent secara otomatis, menyembunyikan apa yang sebenarnya dikirim.</li>
      </ul>

      <h2>Enkode dan Dekode URL Secara Instan</h2>
      <p>
        Apakah kamu sedang men-debug redirect OAuth, membangun query string secara manual,
        memeriksa request API yang salah format, atau hanya ingin memahami apa yang sebenarnya
        ada di dalam URL yang di-percent-encode —{" "}
        <a href="/tools/url-encoder">BrowseryTools URL Encoder/Decoder</a> menanganinya secara
        instan. Tempel stringmu, pilih enkode atau dekode, dan lihat hasilnya langsung. Tanpa
        panggilan server, tanpa daftar.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          URL Encoder / Decoder Gratis — Berjalan 100% di Browser
        </p>
        <a
          href="/tools/url-encoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka URL Encoder →
        </a>
      </div>
    </div>
  );
}
