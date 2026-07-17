import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Setiap API memiliki dokumentasi. Hampir secara universal, dokumentasi tersebut menyertakan
        contoh kode dalam cURL — klien HTTP command-line yang ada di setiap sistem Unix-like dan
        telah menjadi lingua franca dokumentasi API selama beberapa dekade. Masalahnya adalah Anda
        tidak menulis shell script. Anda menulis JavaScript, Python, Go, atau Ruby, dan Anda perlu
        menerjemahkan perintah cURL tersebut menjadi kode yang berfungsi sebelum dapat menggunakannya.
      </p>
      <ToolCTA slug="curl-converter" variant="inline" />
      <p>
        Terjemahan tersebut membosankan dan rawan kesalahan. Header, skema autentikasi, request body,
        dan URL encoding semuanya harus dipetakan ke pemanggilan method yang tepat dalam bahasa yang
        tepat.{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> melakukan ini secara otomatis —
        tempel perintah cURL dan dapatkan kode yang setara dalam JavaScript fetch, Python requests,
        Node.js axios, dan lainnya. Gratis, tanpa pendaftaran, semuanya tetap di browser Anda.
      </p>

      <h2>Apa Itu cURL?</h2>
      <p>
        cURL (Client URL) adalah alat command-line untuk mentransfer data menggunakan URL. Ia mendukung
        HTTP, HTTPS, FTP, WebSocket, dan lusinan protokol lainnya. Bagi developer, paling umum
        digunakan sebagai cara membuat permintaan HTTP dari terminal — menguji endpoint API, mengunduh
        file, atau men-debug autentikasi.
      </p>
      <p>
        cURL diinstal secara default di macOS dan sebagian besar distribusi Linux. Di Windows, ia telah
        dibundel dengan OS sejak Windows 10. Ubikuitas ini adalah persis mengapa tim dokumentasi API
        secara default menggunakan cURL untuk contoh — mereka dapat yakin bahwa developer mana pun
        yang membaca dokumen dapat langsung menjalankan contoh tersebut, tanpa menginstal apa pun.
      </p>

      <h2>Anatomi Perintah cURL</h2>
      <p>
        Perintah cURL dibangun dari URL dasar dan sekumpulan flag. Berikut contoh lengkap yang mencakup
        flag-flag terpenting:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Penjelasan setiap flag:
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> — menetapkan metode HTTP. Nilai valid adalah GET, POST, PUT, PATCH, DELETE, dll. Jika dihilangkan dan <code>-d</code> ada, cURL secara default menggunakan POST.</li>
        <li><strong><code>-H "Header: Value"</code></strong> — menambahkan request header. Dapat diulang beberapa kali untuk beberapa header.</li>
        <li><strong><code>-d '...'</code></strong> — request body. Untuk JSON, kombinasikan dengan <code>-H "Content-Type: application/json"</code>. cURL mengkodekan URL body secara default kecuali Anda menggunakan <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> — mengirim body persis apa adanya tanpa encoding URL apa pun. Diperlukan ketika body berisi karakter seperti <code>@</code> yang akan diinterpretasi secara khusus oleh <code>-d</code>.</li>
        <li><strong><code>-u username:password</code></strong> — singkatan autentikasi dasar. cURL mengkodekannya sebagai header Authorization Base64 untuk Anda.</li>
        <li><strong><code>-s</code></strong> — mode silent; menekan progress bar. Hampir selalu digunakan dalam script.</li>
        <li><strong><code>-v</code></strong> — mode verbose; mencetak header permintaan dan respons. Sangat berharga untuk men-debug kegagalan autentikasi.</li>
        <li><strong><code>-o filename</code></strong> — tulis output ke file daripada stdout.</li>
      </ul>

      <h2>Pola cURL Umum untuk REST API</h2>

      <h3>Permintaan GET dengan Parameter Query</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Parameter query langsung ada dalam URL. Kutip seluruh URL untuk mencegah shell
        menginterpretasikan <code>&</code> sebagai operator proses latar belakang.
      </p>

      <h3>POST dengan JSON Body</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>Upload File (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        Flag <code>-F</code> mengirim multipart/form-data. Awalan <code>@</code> berarti "baca dari
        file". Ini adalah format yang digunakan untuk upload gambar, API pemrosesan dokumen, dan
        endpoint apa pun yang menerima data biner.
      </p>

      <h2>Mengonversi cURL ke JavaScript fetch</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// cURL asli:
// curl -X POST https://api.example.com/v1/users \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"name": "Alice", "email": "alice@example.com"}'

const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN",
  },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
  }),
});

const data = await response.json();`}
      </pre>

      <h2>Mengonversi cURL ke Python requests</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`import requests

response = requests.post(
    "https://api.example.com/v1/users",
    headers={
        "Authorization": "Bearer TOKEN",
    },
    json={
        "name": "Alice",
        "email": "alice@example.com",
    },
)

data = response.json()`}
      </pre>
      <p>
        Parameter <code>json=</code> dari pustaka <code>requests</code> menangani serialisasi dan
        pengaturan header <code>Content-Type: application/json</code> secara otomatis —
        tidak perlu mengaturnya secara manual.
      </p>

      <h2>Mengonversi cURL ke Node.js dengan axios</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`const axios = require("axios");

const response = await axios.post(
  "https://api.example.com/v1/users",
  {
    name: "Alice",
    email: "alice@example.com",
  },
  {
    headers: {
      Authorization: "Bearer TOKEN",
    },
  }
);

const data = response.data;`}
      </pre>

      <h2>Cara Kerja "Copy as cURL" di Browser DevTools</h2>
      <p>
        Salah satu fitur paling berguna di browser DevTools adalah "Copy as cURL." Di Chrome, Firefox,
        atau Safari: buka DevTools, buka tab Network, buat permintaan (masuk, klik tombol, muat halaman),
        klik kanan permintaan dalam daftar jaringan, dan pilih "Copy as cURL."
      </p>
      <p>
        Browser menghasilkan perintah cURL lengkap yang menyertakan setiap header yang dikirim browser —
        termasuk cookie, token sesi, token CSRF, dan materi autentikasi lainnya. Ini berarti Anda dapat
        memutar ulang permintaan persis yang dibuat browser, termasuk seluruh konteks autentikasinya,
        dari terminal atau dari kode.
      </p>
      <p>
        Ini sangat berharga untuk debugging: jika permintaan browser berhasil tetapi permintaan kode
        Anda gagal, tempel keduanya ke diff dan temukan perbedaan header atau body-nya. Anda juga
        dapat menempel cURL yang disalin langsung ke{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> untuk mendapatkan kode
        setara dalam bahasa pilihan Anda — konverter menangani semua escaping, kutipan, dan terjemahan
        flag secara otomatis.
      </p>

      <h2>Ringkasan</h2>
      <p>
        cURL adalah bahasa universal HTTP. Dokumentasi API menggunakannya karena semua orang bisa
        menjalankannya. DevTools menyalinnya karena menangkap setiap detail permintaan. Belajar membaca
        cURL dengan lancar — dan menerjemahkannya secara akurat ke bahasa apa pun yang Anda kerjakan —
        adalah keterampilan praktis yang memberikan manfaat setiap kali Anda mengintegrasikan API baru.
        Lewati terjemahan manual yang membosankan dan gunakan{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> untuk mendapatkan kode yang
        bersih dan dapat dijalankan dalam hitungan detik.
      </p>
      <ToolCTA slug="curl-converter" variant="card" />
    </div>
  );
}
