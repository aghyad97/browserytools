export default function Content() {
  return (
    <div>
      <p>
        JSON ada di mana-mana. Ia menggerakkan REST API, file konfigurasi, output database, payload
        webhook, dan agregator log. Anda menemuinya puluhan kali sehari baik Anda sedang membangun
        layanan backend, men-debug aplikasi frontend, atau membaca dokumentasi. Memahami JSON secara
        mendalam — bukan hanya cara menguraikannya, tetapi cara membacanya, memvalidasinya, dan
        memecahkan masalahnya — adalah salah satu keterampilan paling berdaya ungkit yang dapat dimiliki
        seorang developer.
      </p>
      <p>
        Panduan ini mencakup segalanya mulai dari dasar sintaks JSON hingga men-debug error parse umum,
        strategi pemformatan, dan bekerja dengan struktur yang sangat bersarang. Tempel JSON apa pun
        ke{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON Formatter</a> untuk memvalidasi dan
        mencetak cantik secara instan — gratis, tanpa pendaftaran, semuanya tetap di browser Anda.
      </p>

      <h2>Mengapa JSON Menang (dan XML Kalah)</h2>
      <p>
        Sebelum JSON menjadi format pertukaran data default, XML adalah standarnya. API SOAP, feed RSS,
        dan file konfigurasi semuanya menggunakan XML. JSON muncul sebagai alternatif yang lebih sederhana
        dan secara bertahap mengambil alih untuk sebagian besar kasus penggunaan. Alasannya lugas:
      </p>
      <ul>
        <li><strong>Lebih ringkas</strong> — JSON tidak memerlukan tag penutup. Data yang sama membutuhkan 30–50% lebih sedikit karakter untuk direpresentasikan.</li>
        <li><strong>Native JavaScript</strong> — JSON adalah singkatan dari JavaScript Object Notation. Ini memetakan langsung ke objek dan array JavaScript, membuatnya mudah untuk diurai dan diserialisasi di browser.</li>
        <li><strong>Mudah dibaca manusia</strong> — payload JSON yang diformat dengan baik lebih mudah dibaca daripada XML yang setara dengan tanda kurung sudut dan deklarasi namespace-nya.</li>
        <li><strong>Didukung luas</strong> — setiap bahasa utama memiliki parser JSON bawaan. Tidak perlu menginstal pustaka hanya untuk melakukan deserialisasi respons API.</li>
      </ul>
      <p>
        XML masih memiliki kasus penggunaan yang sah — format dokumen (DOCX, SVG), konfigurasi yang
        membutuhkan komentar (yang tidak didukung JSON), dan protokol seperti SOAP di mana diperlukan.
        Namun untuk komunikasi API dan penyimpanan data, JSON adalah pemenang yang tidak dipertanyakan.
      </p>

      <h2>Aturan Sintaks JSON</h2>
      <p>
        JSON memiliki sintaks yang kecil dan ketat. Berikut aturan yang paling sering mengejutkan
        developer:
      </p>
      <ul>
        <li><strong>Kunci harus berupa string yang dikutip ganda</strong> — <code>{"{"}"name": "Alice"{"}"}</code> valid; <code>{"{"}name: "Alice"{"}"}</code> tidak. Berbeda dengan literal objek JavaScript, JSON tidak mengizinkan kunci tanpa kutipan.</li>
        <li><strong>Tidak ada trailing comma</strong> — <code>[1, 2, 3,]</code> adalah JSON yang tidak valid. Trailing comma setelah elemen terakhir diterima oleh JavaScript dan banyak parser tetapi bukan bagian dari spesifikasi JSON.</li>
        <li><strong>Tidak ada komentar</strong> — JSON tidak memiliki sintaks komentar. Ini mengejutkan developer yang ingin memberi anotasi pada file konfigurasi. Jika Anda membutuhkan komentar dalam file konfigurasi, pertimbangkan JSONC (JSON with Comments) atau YAML.</li>
        <li><strong>String hanya menggunakan kutip ganda</strong> — string yang dikutip tunggal seperti <code>'hello'</code> tidak valid JSON.</li>
        <li><strong>Angka tidak boleh memiliki nol di depan</strong> — <code>007</code> tidak valid; gunakan <code>7</code> sebagai gantinya.</li>
        <li><strong>Hanya enam tipe nilai</strong> — string, angka, boolean (<code>true</code> / <code>false</code>), null, objek, dan array. Tidak ada tanggal, tidak ada fungsi, tidak ada undefined.</li>
      </ul>

      <h2>Error JSON Umum dan Artinya</h2>
      <p>
        Error parse JSON bisa membingungkan. Berikut yang paling umum dan cara memperbaikinya.
      </p>

      <h3>Unexpected token</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Kutip tunggal tidak valid dalam JSON. Ganti dengan kutip ganda:{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Unexpected token } / ]"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        Trailing comma sebelum kurung tutup. Hapus koma setelah elemen terakhir. Ini adalah error JSON
        yang paling umum bagi developer yang datang dari JavaScript, di mana trailing comma benar-benar
        valid.
      </p>

      <h3>Unexpected end of JSON input</h3>
      <p>
        Ini berarti JSON terpotong — string berakhir sebelum semua objek dan array yang dibuka ditutup.
        Hitung tanda kurung kurawal dan tanda kurung buka dan tutupnya. Mereka harus cocok.
      </p>

      <h3>Property names must be strings</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Tidak valid — kunci tanpa kutipan
{ name: "Alice" }

// Valid
{ "name": "Alice" }`}
      </pre>

      <h2>Pretty-Printing vs Minifikasi</h2>
      <p>
        JSON dapat direpresentasikan dalam dua cara: pretty-printed (dengan indentasi dan baris baru)
        atau diminimalkan (semua spasi putih dihilangkan). Pilihan bergantung pada konteks.
      </p>
      <p>
        <strong>Pretty-print</strong> saat Anda membaca, men-debug, meninjau, atau menyimpan JSON
        dalam version control. JSON yang diindentasi langsung mudah dibaca dan di-diff dengan bersih
        di Git karena setiap nilai ada di barisnya sendiri.
      </p>
      <p>
        <strong>Minify</strong> saat Anda mentransmisikan JSON melalui jaringan. Spasi putih adalah
        overhead murni dalam respons HTTP. Payload JSON 100KB yang dicetak cantik mungkin dipadatkan
        menjadi 60KB saat diminimalkan, lalu lebih jauh menjadi 15KB dengan gzip. Sebagian besar API
        menyajikan JSON yang diminimalkan melalui jaringan dan membiarkan klien mencetak cantik sesuai
        kebutuhan.
      </p>
      <p>
        Dalam JavaScript: <code>JSON.stringify(data, null, 2)</code> mencetak cantik dengan indentasi
        2-spasi. <code>JSON.stringify(data)</code> meminimalkan.{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON Formatter</a> melakukan keduanya — tempel
        JSON Anda dan beralih antara tampilan cantik dan yang diminimalkan secara instan.
      </p>

      <h2>Menavigasi JSON yang Sangat Bersarang</h2>
      <p>
        Respons API dunia nyata sering sangat bersarang. Payload webhook Stripe, respons API GitHub,
        atau konfigurasi Kubernetes dapat memiliki objek lima atau enam tingkat. Berikut strategi untuk
        mengerjakannya:
      </p>

      <h3>Gunakan optional chaining dalam JavaScript</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Tanpa optional chaining — crash jika ada tingkat yang undefined
const city = user.address.location.city;

// Dengan optional chaining — mengembalikan undefined daripada melempar
const city = user?.address?.location?.city;

// Dengan nullish coalescing untuk nilai default
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>Gunakan jq untuk query JSON dari command-line</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Pretty-print seluruh respons
curl https://api.example.com/users | jq .

# Ekstrak kolom tertentu
curl https://api.example.com/users | jq '.[0].email'

# Filter array
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON dalam API vs File Konfigurasi</h2>
      <p>
        JSON melayani dua peran yang sangat berbeda tergantung pada konteks, dan praktik terbaik
        berbeda di antara keduanya.
      </p>
      <p>
        Dalam <strong>respons API</strong>, JSON dibuat oleh kode dan dikonsumsi oleh kode. Anda
        jarang menulisnya secara manual. Prioritasnya adalah kebenaran dan konsistensi — gunakan
        pustaka serialisasi dan biarkan ia menangani escaping. Minimalkan untuk produksi, sertakan
        header Content-Type dari <code>application/json</code>, dan beri versi API Anda sehingga
        perubahan pada struktur JSON tidak merusak.
      </p>
      <p>
        Dalam <strong>file konfigurasi</strong> (package.json, tsconfig.json, .eslintrc.json), JSON
        ditulis oleh manusia. Di sini, keterbacaan lebih penting. Gunakan indentasi 2-spasi, pertahankan
        struktur sedangkal mungkin, dan tambahkan komentar menggunakan parser yang kompatibel JSONC
        jika tooling Anda mendukungnya. Jangan pernah meminimalkan file konfigurasi yang ada dalam
        version control.
      </p>

      <h2>Validasi JSON Schema</h2>
      <p>
        JSON Schema adalah spesifikasi untuk mendefinisikan struktur, tipe, dan batasan dokumen JSON.
        Ini memungkinkan Anda memvalidasi bahwa payload JSON sesuai dengan bentuk yang diharapkan
        sebelum Anda mencoba menggunakannya.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":    { "type": "integer" },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0, "maximum": 150 }
  },
  "additionalProperties": false
}`}
      </pre>
      <p>
        Pustaka seperti <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python), dan{" "}
        <code>JSON.NET Schema</code> (.NET) dapat memvalidasi dokumen JSON terhadap skema pada runtime —
        menangkap payload yang salah format di batas API sebelum menyebabkan error yang tidak terduga
        lebih dalam di aplikasi.
      </p>

      <h2>Ringkasan</h2>
      <p>
        Kesederhanaan JSON adalah kekuatan terbesarnya. Enam tipe nilai, aturan kutipan yang ketat,
        tidak ada komentar, tidak ada trailing comma — batasannya kecil dan formatnya tidak ambigu.
        Ketika ada yang salah, hampir selalu merupakan salah satu dari sejumlah kecil error sintaks
        yang dapat diprediksi. Tempel JSON rusak Anda ke{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON Formatter</a> dan error akan langsung
        terlihat dengan posisi tepat yang disorot.
      </p>
    </div>
  );
}
