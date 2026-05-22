import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Setiap developer mengumpulkan daftar situs andalan untuk tugas-tugas cepat: decode string Base64 itu, validasi blob JSON ini, periksa apa isi JWT itu sebenarnya. Masalahnya, daftar itu biasanya mencakup selusin situs berbeda — masing-masing dengan banner cookie, ajakan mendaftar, dan pertanyaan privasi sendiri.
      </p>

      <p>
        <strong>BrowseryTools</strong> menyatukan utilitas developer paling esensial ke dalam satu suite yang cepat dan mengutamakan privasi. Semuanya berjalan secara lokal di browser Anda. Tanpa unggahan. Tanpa API key. Tanpa batas laju. Panduan ini membahas setiap tool dan menunjukkan kepada Anda persis kapan dan mengapa Anda akan menggunakannya.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Mengapa tool browser mengalahkan paket npm dan API cloud:</strong> Memasang paket npm butuh waktu, menambah pohon dependensi Anda, memerlukan Node.js tersedia, dan bisa memiliki kerentanan keamanan dalam rantai dependensinya. API cloud memerlukan autentikasi, memiliki batas laju, dan memperkenalkan latensi. Tool browser bersifat instan, nol dependensi, dan bekerja sama di setiap mesin.
      </div>

      <h2>JSON Formatter &amp; Validator</h2>

      <p>
        JSON adalah bahasa universal API modern. Ketika Anda menatap blob 3KB yang sudah di-minify yang dikembalikan oleh sebuah endpoint, <Link href="/tools/json-formatter">JSON Formatter</Link> membuatnya langsung mudah dibaca.
      </p>

      <h3>Apa yang dilakukannya</h3>
      <ul>
        <li><strong>Format &amp; pretty-print:</strong> Mengambil JSON yang padat dan menambahkan indentasi serta jeda baris</li>
        <li><strong>Validasi:</strong> Menandai kesalahan sintaks dengan posisi baris dan karakter yang persis</li>
        <li><strong>Minify:</strong> Menghapus semua spasi kosong untuk menghasilkan JSON padat bagi payload</li>
        <li><strong>Tampilan pohon:</strong> Jelajahi objek dan array bersarang dalam pohon yang bisa diciutkan</li>
      </ul>

      <h3>Skenario umum</h3>
      <p>Tempel respons API dari terminal Anda untuk memahami strukturnya:</p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Raw curl output
curl -s https://api.example.com/user/42

# Minified response that's hard to read:
{"id":42,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}

# Paste into BrowseryTools JSON Formatter → instantly readable:
{
  "id": 42,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "meta": {
    "created": "2024-01-01",
    "active": true
  }
}`}</code></pre>

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka JSON Formatter →</Link>

      <h2>Base64 Encoder / Decoder</h2>

      <p>
        Encoding Base64 muncul di mana-mana: lampiran email (MIME), menyematkan gambar di CSS, meng-encode data biner untuk API, dan menyimpan kredensial di file konfigurasi. <Link href="/tools/base64">Tool Base64</Link> menangani encoding dan decoding dengan dukungan untuk Base64 standar maupun varian Base64 yang aman untuk URL.
      </p>

      <h3>Kapan Anda membutuhkannya</h3>
      <ul>
        <li>Men-decode header <code>Authorization: Basic ...</code> untuk melihat username:password</li>
        <li>Meng-encode gambar untuk disematkan langsung di atribut CSS <code>url()</code> atau HTML <code>src</code></li>
        <li>Memeriksa nilai konfigurasi berenkode Base64 di secret Kubernetes</li>
        <li>Meng-encode payload biner untuk REST API yang tidak menerima byte mentah</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka Base64 Encoder/Decoder →</Link>

      <h2>JWT Decoder</h2>

      <p>
        JSON Web Token digunakan untuk autentikasi di hampir setiap aplikasi web modern. Ketika terjadi masalah dengan auth — token kedaluwarsa, klaim yang hilang, audience yang tidak terduga — Anda perlu memeriksa token itu <em>sekarang juga</em>, bukan menulis skrip untuk melakukannya.
      </p>

      <p>
        <Link href="/tools/jwt-decoder">JWT Decoder</Link> menerima string JWT dan langsung menampilkan header, payload, dan status verifikasi tanda tangan yang telah di-decode. Ia menyorot waktu kedaluwarsa (klaim <code>exp</code>), waktu diterbitkan (<code>iat</code>), dan memberi tahu Anda apakah token saat ini valid, kedaluwarsa, atau belum berlaku.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Catatan keamanan:</strong> Jangan pernah menempelkan token JWT produksi ke decoder pihak ketiga yang tidak dikenal — token itu mewakili sesi pengguna yang aktif. BrowseryTools men-decode JWT sepenuhnya di browser Anda menggunakan operasi string Base64. Token tidak pernah meninggalkan perangkat Anda, menjadikannya satu-satunya pilihan aman untuk memeriksa token dari lingkungan langsung.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka JWT Decoder →</Link>

      <h2>UUID Generator</h2>

      <p>
        Universally Unique Identifier (UUID) sangat penting untuk primary key database, idempotency key, correlation ID, dan desain sistem terdistribusi. <Link href="/tools/uuid-generator">UUID Generator</Link> menghasilkan UUID v4 yang acak secara kriptografis menggunakan <code>crypto.randomUUID()</code> — API bawaan browser yang menghasilkan identifier yang benar-benar acak, bukan pseudo-acak.
      </p>

      <h3>Kasus penggunaan</h3>
      <ul>
        <li>Menghasilkan ID database uji selama pengembangan tanpa mengakses database Anda</li>
        <li>Membuat idempotency key untuk permintaan API pembayaran</li>
        <li>Menghasilkan UUID secara massal untuk data seed atau file fixture</li>
        <li>Membuat correlation ID untuk distributed tracing saat debugging</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka UUID Generator →</Link>

      <h2>Hash Generator</h2>

      <p>
        Hashing kriptografis digunakan untuk checksum, penyimpanan password (jangan pernah mentah!), penyimpanan content-addressable, dan verifikasi integritas data. <Link href="/tools/hash-generator">Hash Generator</Link> menghitung hash MD5, SHA-1, SHA-256, dan SHA-512 menggunakan API bawaan browser <code>crypto.subtle.digest()</code> — implementasi mendasar yang sama dengan yang digunakan OS Anda.
      </p>

      <h3>Kapan developer menggunakan ini</h3>
      <ul>
        <li>Memverifikasi checksum file yang diunduh terhadap hash yang dipublikasikan</li>
        <li>Menghitung SHA-256 dari body permintaan API untuk AWS Signature Version 4</li>
        <li>Menghasilkan nilai ETag untuk resource statis</li>
        <li>Membuat content hash untuk cache-busting dalam pipeline build</li>
        <li>Memeriksa apakah dua blob teks besar identik tanpa membandingkannya karakter demi karakter</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka Hash Generator →</Link>

      <h2>Regex Tester</h2>

      <p>
        Regular expression sangat ampuh dan terkenal sulit ditulis dengan benar di bawah tekanan. <Link href="/tools/regex-tester">Regex Tester</Link> memberi Anda lingkungan real-time: saat Anda mengetik pola dan string uji, kecocokan disorot secara instan. Ia mendukung semua flag regex JavaScript (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>, <code>u</code>) dan menampilkan grup tertangkap dalam tampilan terstruktur.
      </p>

      <h3>Contoh praktis</h3>
      <ul>
        <li>Memvalidasi alamat email, nomor telepon, atau kode pos untuk sanitasi input formulir</li>
        <li>Menulis pola pem-parsing log untuk ekstraksi log terstruktur</li>
        <li>Menguji pola routing URL sebelum memasukkannya ke konfigurasi Express atau Next.js</li>
        <li>Menyusun pola yang kompatibel dengan sed/awk tanpa terminal</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka Regex Tester →</Link>

      <h2>URL Encoder / Decoder</h2>

      <p>
        URL hanya boleh berisi sekumpulan karakter ASCII yang terbatas. Karakter khusus — spasi, ampersand, tanda sama dengan, teks non-ASCII — harus di-percent-encode. <Link href="/tools/url-encoder">URL Encoder/Decoder</Link> menangani kedua arah dan membedakan antara <code>encodeURI</code> (meng-encode URL lengkap, mempertahankan karakter struktur) dan <code>encodeURIComponent</code> (meng-encode nilai parameter URL, meng-encode segala sesuatu).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka URL Encoder/Decoder →</Link>

      <h2>Konverter YAML ↔ JSON</h2>

      <p>
        File konfigurasi sering kali datang dalam YAML (manifes Kubernetes, alur kerja GitHub Actions, Helm chart, Docker Compose), sementara API dan kode bekerja dengan JSON. <Link href="/tools/yaml-json">Konverter YAML ↔ JSON</Link> menerjemahkan antara kedua format secara instan, mempertahankan tipe, struktur bersarang, dan urutan array.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# YAML input (Kubernetes deployment snippet):
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api

// JSON output:
{
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "api" } },
    "template": { "metadata": { "labels": { "app": "api" } } }
  }
}`}</code></pre>

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka Konverter YAML ↔ JSON →</Link>

      <h2>Cron Expression Parser</h2>

      <p>
        Cron expression itu ringkas tetapi membingungkan. Satu kesalahan dalam jadwal cron bisa berarti sebuah job berjalan setiap menit alih-alih sekali sebulan. <Link href="/tools/cron-parser">Cron Parser</Link> menerjemahkan cron expression apa pun ke dalam bahasa yang jelas, menunjukkan 10 waktu jalan terjadwal berikutnya, dan memvalidasi ekspresi terhadap format cron standar maupun yang diperluas.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka Cron Parser →</Link>

      <h2>Konverter Basis Angka</h2>

      <p>
        Pemrogram sistem, developer embedded, dan siapa saja yang bekerja dekat dengan perangkat keras secara rutin perlu mengonversi antara biner, oktal, desimal, dan heksadesimal. <Link href="/tools/number-base-converter">Konverter Basis Angka</Link> mengonversi antara keempat basis sekaligus dan menangani input bilangan bulat maupun bilangan besar.
      </p>

      <h3>Skenario umum</h3>
      <ul>
        <li>Mengonversi alamat memori dari heksa ke desimal untuk perbandingan</li>
        <li>Memahami nilai bitmask dengan melihatnya dalam biner</li>
        <li>Men-decode izin file Unix yang ditulis dalam oktal (<code>chmod 755</code> → biner <code>111 101 101</code>)</li>
        <li>Bekerja dengan nilai warna: heksa HTML <code>#FF6B35</code> → komponen desimal RGB</li>
        <li>Men-debug urutan byte protokol dalam jaringan atau firmware embedded</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Buka Konverter Basis Angka →</Link>

      {/* Summary table */}
      <h2>Referensi Cepat: Semua Tool Developer Sekilas</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Tool</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Kasus Penggunaan Utama</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Teknologi Utama</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["JSON Formatter", "Format, validasi, minify JSON", "JSON.parse / JSON.stringify"],
              ["Base64 Encoder/Decoder", "Encode/decode string Base64", "btoa() / atob()"],
              ["JWT Decoder", "Periksa header, payload, kedaluwarsa JWT", "Parsing string Base64"],
              ["UUID Generator", "Menghasilkan UUID v4", "crypto.randomUUID()"],
              ["Hash Generator", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Regex Tester", "Menguji dan men-debug pola regex", "Mesin RegExp JavaScript"],
              ["URL Encoder/Decoder", "Encode/decode komponen URL", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Konversi antara YAML dan JSON", "Pustaka js-yaml (lokal)"],
              ["Cron Parser", "Menjelaskan dan memvalidasi cron expression", "cron-parser (lokal)"],
              ["Konverter Basis Angka", "Biner, oktal, desimal, heksa", "parseInt() / toString()"],
            ].map(([tool, use, tech], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{tool}</td>
                <td style={{padding: "11px 16px"}}>{use}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", opacity: 0.75}}>{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Mengapa BrowseryTools Alih-alih Paket npm atau API Cloud?</h2>

      <p>
        Perbandingan yang jujur: kapan Anda sebaiknya menggunakan BrowseryTools vs. memasang paket atau memanggil API?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Paket npm</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Memerlukan Node.js terpasang</li>
            <li>Menambah pohon dependensi</li>
            <li>Potensi risiko supply chain</li>
            <li>Terbaik untuk: kode produksi</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>API Cloud</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Memerlukan penyiapan API key</li>
            <li>Berlaku batas laju</li>
            <li>Data meninggalkan perangkat Anda</li>
            <li>Terbaik untuk: pipeline otomatis</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Nol penyiapan, bekerja instan</li>
            <li>Tanpa dependensi</li>
            <li>Data tetap lokal</li>
            <li>Terbaik untuk: tugas dev manual</li>
          </ul>
        </div>
      </div>

      <p>
        Jawabannya adalah: gunakan BrowseryTools untuk <em>tugas manual, eksploratif, sekali pakai</em> yang akan berlebihan jika harus di-skrip. Men-decode JWT untuk men-debug masalah auth, memformat respons API untuk memahami bentuknya, menghasilkan UUID untuk uji sekali pakai — inilah persis momen di mana tool browser yang cepat dan tanpa hambatan menghemat 10 menit penyiapan untuk pekerjaan 10 detik.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tips untuk developer:</strong> Bookmark <code>browserytools.com</code> di samping dev tools browser Anda. Ketika Anda sedang di tengah debugging dan perlu cepat men-decode, hash, format, atau mengonversi sesuatu, memiliki tool-tool ini sejauh satu tab berarti Anda bisa tetap dalam alur alih-alih beralih konteks untuk menulis skrip sekali pakai.
      </div>

      <h2>Lebih dari Tool Developer: Utilitas BrowseryTools Lainnya</h2>

      <p>
        BrowseryTools mencakup jauh lebih dari sekadar utilitas developer. Pendekatan yang sama — mengutamakan privasi, tanpa unggahan — berlaku untuk:
      </p>

      <ul>
        <li><strong>Tool gambar:</strong> <Link href="/tools/image-compression">Kompresi gambar</Link>, <Link href="/tools/bg-removal">penghapusan latar belakang dengan AI</Link>, <Link href="/tools/image-resizer">pengubahan ukuran</Link>, <Link href="/tools/image-converter">konversi format</Link></li>
        <li><strong>Tool teks:</strong> <Link href="/tools/markdown-editor">Editor Markdown</Link>, <Link href="/tools/text-diff">text diff</Link>, <Link href="/tools/text-case">konverter huruf</Link>, <Link href="/tools/lorem-ipsum">generator Lorem ipsum</Link></li>
        <li><strong>Tool keamanan:</strong> <Link href="/tools/password-generator">Password generator</Link>, <Link href="/tools/password-strength">pemeriksa kekuatan password</Link>, <Link href="/tools/text-encryption">enkripsi teks</Link></li>
        <li><strong>Produktivitas:</strong> <Link href="/tools/pomodoro">Timer Pomodoro</Link>, <Link href="/tools/todo">daftar tugas</Link>, <Link href="/tools/notepad">notepad</Link>, <Link href="/tools/world-clock">jam dunia</Link></li>
      </ul>

      {/* Inline SVG illustration */}
      <div style={{margin: "32px 0", textAlign: "center"}}>
        <svg width="320" height="80" viewBox="0 0 320 80" style={{maxWidth: "100%"}}>
          <rect x="0" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="30" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JSON</text>
          <rect x="65" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="95" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JWT</text>
          <rect x="130" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="160" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Regex</text>
          <rect x="195" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="225" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Hash</text>
          <rect x="260" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="290" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">UUID</text>
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">Semua berjalan secara lokal di browser Anda</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Mulai Gunakan BrowseryTools — Tanpa Penyiapan</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          Semua 10 tool developer di atas — ditambah lusinan lainnya — gratis, instan, dan tidak memerlukan akun, instalasi, maupun konfigurasi. Buka sebuah tool dan mulai bekerja dalam waktu kurang dari 3 detik.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Buka JSON Formatter →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Jelajahi Semua Tool
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Tool terkait: <Link href="/tools/json-formatter">JSON Formatter</Link> · <Link href="/tools/jwt-decoder">JWT Decoder</Link> · <Link href="/tools/hash-generator">Hash Generator</Link> · <Link href="/tools/regex-tester">Regex Tester</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">UUID Generator</Link> · <Link href="/tools/cron-parser">Cron Parser</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
