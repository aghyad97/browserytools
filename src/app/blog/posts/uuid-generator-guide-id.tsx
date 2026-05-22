export default function Content() {
  return (
    <div>
      <p>
        Setiap record database, resource API, event terdistribusi, dan session token membutuhkan
        identifier yang unik. Pilihan format ID lebih penting dari yang mungkin terlihat — ini
        mempengaruhi keamanan, performa database, keterbacaan URL, dan seberapa baik sistemmu
        berperilaku ketika kamu akhirnya menjalankan beberapa server atau menggabungkan data dari
        sumber yang berbeda. Panduan ini membahas opsi utama: UUID (v1, v4, v7), NanoID, dan
        CUID, serta kapan harus menggunakan masing-masing.
      </p>
      <p>
        Kamu bisa menghasilkan UUID dan ID unik lainnya secara instan dengan{" "}
        <a href="/tools/uuid-generator">BrowseryTools UUID Generator</a> — gratis, tanpa daftar,
        semuanya dibuat secara lokal di browsermu.
      </p>

      <h2>Mengapa ID Auto-Increment Tidak Selalu Cukup</h2>
      <p>
        ID bilangan bulat berurutan (<code>1, 2, 3, ...</code>) adalah default di sebagian besar
        database relasional, dan bekerja dengan baik untuk aplikasi single-server yang sederhana.
        Namun keduanya menciptakan masalah pada skala besar atau di sistem terdistribusi:
      </p>
      <ul>
        <li><strong>Mudah ditebak</strong> — siapa pun yang mengetahui satu ID dapat menebak ID lainnya. <code>/orders/1042</code> membuat jelas bahwa order 1041 ada dan bisnismu tidak besar. Ini adalah kerentanan IDOR (Insecure Direct Object Reference) jika kamu tidak menerapkan otorisasi di lapisan aplikasi.</li>
        <li><strong>Konflik merge</strong> — ketika kamu perlu menggabungkan data dari dua database, dua urutan auto-increment terpisah akan memiliki ID yang bertabrakan. Sistem multi-tenant, aplikasi offline-first, dan migrasi semuanya mengalami masalah ini.</li>
        <li><strong>Pembuatan terdistribusi</strong> — jika beberapa server atau worker menyisipkan record, kamu membutuhkan mekanisme koordinasi untuk menghindari ID duplikat. Ini menciptakan bottleneck.</li>
        <li><strong>Membocorkan metrik bisnis</strong> — ID berurutan membocorkan volume order, jumlah pengguna, dan laju pertumbuhan kepada pesaing atau peneliti yang mengamati ID publik dari waktu ke waktu.</li>
      </ul>

      <h2>Apa Itu UUID?</h2>
      <p>
        UUID (Universally Unique Identifier, juga disebut GUID) adalah angka 128-bit, secara
        konvensional ditampilkan sebagai 32 digit heksadesimal dalam lima kelompok yang dipisahkan
        tanda hubung:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx

Example: 550e8400-e29b-41d4-a716-446655440000
          ^        ^    ^    ^    ^
          |        |    |    |    12 hex digits (48 bits)
          |        |    |    variant bits (N)
          |        |    version digit (M)
          |        4 hex digits
          8 hex digits`}
      </pre>
      <p>
        Digit versi (M) memberitahumu algoritma pembuatan UUID mana yang digunakan. Bit varian (N)
        selalu <code>8</code>, <code>9</code>, <code>a</code>, atau <code>b</code> dalam UUID
        standar. 122 bit yang tersisa tersedia untuk data identifier sebenarnya.
      </p>

      <h2>UUID v1: MAC Address + Timestamp</h2>
      <p>
        UUID v1 menggabungkan timestamp saat ini (dalam interval 100 nanodetik sejak 15 Oktober
        1582) dengan alamat MAC mesin yang menghasilkan dan urutan clock untuk menangani pembuatan
        cepat. Hasilnya secara teoritis unik di semua mesin dan waktu.
      </p>
      <p>
        Masalahnya adalah UUID v1 mengungkapkan kapan dan di mana mereka dibuat — alamat MAC
        tertanam secara jelas. Ini adalah masalah privasi, dan dieksploitasi oleh worm Melissa
        (1999) untuk melacak dokumen yang terinfeksi kembali ke mesin tertentu. Untuk alasan ini,
        v1 jarang digunakan di aplikasi baru. Sebagian besar developer yang menginginkan ID
        berurutan berdasarkan waktu beralih ke v7.
      </p>

      <h2>UUID v4: Acak</h2>
      <p>
        UUID v4 adalah varian yang paling banyak digunakan. Ini adalah 122 bit data acak
        kriptografis (6 bit tersisa mengkodekan versi dan varian). Tidak ada timestamp, tidak ada
        MAC address, tidak ada komponen berurutan — hanya entropi.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Node.js 14.17+
const { randomUUID } = require('crypto');
randomUUID(); // → "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

// Browser
crypto.randomUUID(); // → "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"

// Python
import uuid
str(uuid.uuid4()) # → "3d6f4580-2b3e-44e4-9d40-2d0ab12b4e7e"`}
      </pre>

      <h2>Seberapa Kecil Kemungkinan Tabrakan UUID v4?</h2>
      <p>
        Dengan 122 bit keacakan, probabilitas tabrakan sangat kecil. Untuk memiliki probabilitas
        50% setidaknya satu tabrakan, kamu perlu menghasilkan sekitar
        2,7 × 10<sup>18</sup> UUID — yaitu 2,7 kuintilion. Jika kamu menghasilkan satu miliar UUID
        per detik, butuh sekitar 85 tahun untuk mencapai ambang itu. Untuk aplikasi nyata apa pun,
        tabrakan bukan masalah praktis. Sumber yang jauh lebih mungkin untuk ID duplikat adalah bug
        aplikasi (kesalahan copy-paste, cache hit yang mengembalikan ID lama, dll.), bukan generator
        itu sendiri.
      </p>

      <h2>UUID v7: Acak Berurutan Berdasarkan Waktu</h2>
      <p>
        UUID v7 distandarisasi dalam RFC 9562 (2024) untuk mengatasi kelemahan praktis utama v4:
        UUID acak menjadi primary key database yang buruk karena menghancurkan lokalitas indeks.
        Ketika record disisipkan dengan ID acak, setiap penyisipan mendarat di posisi acak dalam
        indeks B-tree, menyebabkan page split, cache miss, dan fragmentasi pada skala besar.
      </p>
      <p>
        UUID v7 menyematkan Unix timestamp dengan presisi milidetik di bit paling signifikan,
        diikuti data acak. Ini berarti UUID v7 dapat diurutkan — record yang disisipkan secara
        kronologis memiliki ID yang meningkat secara leksikografis — sembari tetap unik secara
        global dan tidak dapat diprediksi di luar batas milidetik:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v7 structure:
[48 bits: Unix ms timestamp][4 bits: version=7][12 bits: random][2 bits: variant][62 bits: random]

Three v7 UUIDs generated in sequence:
  0192fe2c-4b3a-7000-8000-0a1b2c3d4e5f  ← earliest
  0192fe2c-4b3b-7001-8000-0a1b2c3d4e60  ← slightly later
  0192fe2c-4b3c-7002-8000-0a1b2c3d4e61  ← latest
  ^^^^^^^^^^ timestamp prefix increases monotonically`}
      </pre>
      <p>
        Jika kamu membangun aplikasi baru yang menggunakan UUID sebagai primary key di database
        relasional, v7 adalah default yang tepat di tahun 2024 dan seterusnya.
      </p>

      <h2>NanoID: Lebih Pendek, Aman untuk URL</h2>
      <p>
        NanoID bukan UUID — ini adalah format ID yang berbeda sepenuhnya, tetapi memecahkan masalah
        yang sama. Secara default, NanoID menghasilkan string 21 karakter menggunakan alfabet
        karakter yang aman untuk URL (<code>A-Za-z0-9_-</code>). Ini memberikan 126 bit entropi —
        sebanding dengan UUID v4 — dalam string yang panjangnya 21 karakter, bukan 36. String
        NanoID ramah URL tanpa enkoding dan terlihat lebih bersih di log dan URL yang menghadap
        pengguna:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v4:  9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d  (36 chars)
NanoID:   V1StGXR8_Z5jdHi6B-myT                  (21 chars)

import { nanoid } from 'nanoid';
nanoid();      // → "V1StGXR8_Z5jdHi6B-myT"
nanoid(10);    // → "IRFa-VaY2b"  (custom length)`}
      </pre>
      <p>
        NanoID populer untuk ID short link, session token, kode undangan, dan kasus penggunaan
        apa pun di mana ID muncul dalam URL dan kamu ingin ID tersebut kompak.
      </p>

      <h2>CUID2: Dapat Diurutkan, Bebas Fingerprint</h2>
      <p>
        CUID2 (penerus CUID) dirancang khusus untuk digunakan sebagai primary key database. Ia
        menghasilkan string 24 karakter yang dapat diurutkan berdasarkan waktu pembuatan, tidak
        menggunakan MAC address atau fingerprint, dan lebih sulit diprediksi daripada ID berbasis
        timestamp. CUID2 menggunakan SHA-3 secara internal untuk mencampur timestamp dengan data
        acak, membuat output tidak dapat diprediksi bahkan ketika dibuat pada milidetik yang sama.
      </p>
      <p>
        CUID2 adalah pilihan yang baik ketika kamu menginginkan ID yang dapat diurutkan, ingin
        menghindari format UUID sepenuhnya, dan peduli agar ID bersifat opaque (tidak membocorkan
        informasi timestamp secara langsung).
      </p>

      <h2>Memilih Format yang Tepat</h2>
      <ul>
        <li><strong>Primary key database, proyek baru</strong> — UUID v7 atau CUID2. Keduanya dapat diurutkan, yang menjaga performa indeks tetap sehat seiring pertumbuhan data.</li>
        <li><strong>ID unik serba guna, interoperabilitas</strong> — UUID v4. Setiap bahasa dan framework memahami format UUID secara native.</li>
        <li><strong>Short link, kode undangan, token URL</strong> — NanoID. Kompak, aman untuk URL, panjang yang dapat dikonfigurasi.</li>
        <li><strong>Sistem terdistribusi di mana ID dibuat di sisi klien</strong> — UUID v4 atau v7. Tidak perlu koordinasi; klien menghasilkan ID mereka sendiri sebelum commit ke server.</li>
        <li><strong>Hindari v1</strong> — ia membocorkan MAC address-mu. Tidak ada proyek baru yang seharusnya menggunakannya.</li>
      </ul>

      <h2>Performa UUID sebagai Primary Key</h2>
      <p>
        Peringatan klasik "jangan gunakan UUID sebagai primary key" secara khusus tentang UUID acak
        (v4) di MySQL dengan InnoDB atau di database apa pun yang mengelompokkan data berdasarkan
        primary key. Urutan penyisipan acak memfragmentasi indeks berkluster. Di PostgreSQL dengan
        indeks UUID non-berkluster, penaltinya tidak terlalu parah tetapi tetap nyata pada skala
        besar. Solusi praktisnya: gunakan UUID v7 atau CUID2 (yang meningkat secara monoton) dan
        masalah fragmentasi sebagian besar akan hilang. Gunakan{" "}
        <a href="/tools/uuid-generator">BrowseryTools UUID Generator</a> untuk menghasilkan UUID
        v7 guna menguji skemamu sebelum berkomitmen pada suatu format.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          UUID Generator Gratis — v1, v4, v7, NanoID, CUID2
        </p>
        <a
          href="/tools/uuid-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka UUID Generator →
        </a>
      </div>
    </div>
  );
}
