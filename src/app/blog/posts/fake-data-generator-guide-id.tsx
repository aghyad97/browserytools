import Link from 'next/link';
import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Setiap pengembang pada akhirnya menghadapi tembok yang sama: Anda membutuhkan data untuk diuji,
        tetapi menggunakan data pengguna nyata adalah kewajiban, Lorem Ipsum tidak berguna untuk apa pun
        selain pengisi paragraf, dan membuat 500 rekaman uji secara manual dalam JSON adalah cara yang
        pasti untuk merusak sore hari. Generator data palsu ada untuk memecahkan masalah ini —{" "}
        dan{" "}
        <Link href="/tools/fake-data">Generator Data Palsu BrowseryTools</Link> melakukannya secara gratis,
        secara lokal, tanpa akun, tanpa batasan baris, dan tanpa langganan.
      </p>
      <ToolCTA slug="fake-data" variant="inline" />
      <p>
        Panduan ini mencakup mengapa data palsu yang realistis penting, apa yang dihasilkan generator,
        cara menggunakannya secara efektif di berbagai alur kerja, dan cara mengimpor output ke setiap
        database dan toolchain yang umum.
      </p>

      <h2>Mengapa Anda Tidak Dapat Menggunakan Data Pengguna Nyata untuk Pengujian</h2>
      <p>
        Menggunakan data produksi dalam lingkungan pengembangan atau pengujian adalah risiko kepatuhan dan
        hukum di bawah beberapa kerangka regulasi:
      </p>
      <ul>
        <li>
          <strong>GDPR (Eropa):</strong> Pasal 25 mengharuskan minimasi data by design. Menyalin rekaman
          pengguna nyata — nama, email, alamat — ke database staging melanggar prinsip ini kecuali data
          telah dianonimkan dengan benar. Pelanggaran lingkungan staging tersebut mengekspos data orang
          nyata.
        </li>
        <li>
          <strong>HIPAA (layanan kesehatan AS):</strong> Protected Health Information (PHI) tidak dapat
          digunakan dalam lingkungan pengujian tanpa Business Associate Agreement atau de-identifikasi
          yang tepat sesuai metode Safe Harbor atau Expert Determination. Menggunakan rekaman pasien nyata
          dalam database dev adalah pelanggaran HIPAA langsung.
        </li>
        <li>
          <strong>CCPA (California):</strong> Informasi pribadi warga California membawa hak dan pembatasan
          khusus. Menggunakan rekaman pelanggan nyata dalam konteks non-produksi apa pun tanpa kontrol yang
          tepat menciptakan eksposur risiko yang tidak perlu.
        </li>
      </ul>
      <p>
        Di luar kepatuhan, ada alasan rekayasa praktis untuk menghindari data nyata dalam pengujian: data
        nyata berantakan dengan cara yang tidak dapat diprediksi (memiliki kolom null, karakter khusus, dan
        Unicode yang mungkin tidak ditulis untuk ditangani), berubah seiring waktu (membuat pengujian tidak
        deterministik), dan berisi nilai yang mungkin secara tidak sengaja memicu efek samping nyata
        (mengirim email ke alamat nyata, membebankan metode pembayaran nyata).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Default yang lebih aman:</strong> Hasilkan data palsu yang realistis untuk setiap
        lingkungan non-produksi. Ini secara struktural valid, tidak pernah dapat diidentifikasi, aman
        untuk di-commit ke version control, dan dapat direproduksi. Data nyata dalam lingkungan dev/test
        adalah kewajiban secara default.
      </div>

      <h2>Mengapa Lorem Ipsum Adalah Alat yang Salah untuk Data</h2>
      <p>
        Lorem ipsum bagus untuk mengisi blok teks dalam mockup tata letak. Ini sepenuhnya salah untuk
        menguji UI dan API yang didorong data karena:
      </p>
      <ul>
        <li>
          Ini tidak menguji panjang kolom yang sebenarnya. Alamat email, nomor telepon, dan kode pos
          semuanya memiliki format dan panjang maksimum tertentu. "Lorem ipsum dolor sit amet" dalam
          kolom email tidak akan mengungkapkan bahwa validasi input Anda salah, tetapi{" "}
          <code>very.long.name.that.pushes.limits@subdomain.example.com</code> akan.
        </li>
        <li>
          Ini tidak mengungkapkan kasus edge dalam UI Anda. Nama seperti "José García-López" menguji
          encoding karakter Anda. Nama perusahaan seperti "O'Brien &amp; Associates, LLC" menguji
          escaping SQL Anda. "Lorem ipsum" tidak menguji keduanya.
        </li>
        <li>
          Ini membuat mockup dan prototipe Anda terlihat palsu dengan cara yang penting. Pemangku
          kepentingan yang meninjau prototipe dengan nama yang realistis, kota yang realistis, dan alamat
          email yang realistis dapat mengevaluasi desain dengan benar. Teks placeholder memecahkan ilusi
          dan mempersulit untuk menemukan masalah kegunaan yang sebenarnya.
        </li>
      </ul>

      <h2>Apa yang Dihasilkan Generator Data Palsu BrowseryTools</h2>
      <p>
        Generator mendukung berbagai jenis kolom di berbagai kategori. Anda memilih kolom mana yang akan
        disertakan, dan setiap rekaman yang dihasilkan berisi nilai yang realistis dan diformat dengan
        benar untuk setiap kolom yang dipilih:
      </p>

      <h3>Informasi Pribadi</h3>
      <ul>
        <li><strong>Nama lengkap</strong> — kombinasi nama depan + nama belakang yang realistis secara budaya</li>
        <li><strong>Nama depan</strong> dan <strong>nama belakang</strong> secara terpisah (berguna ketika skema Anda menyimpannya dalam kolom yang berbeda)</li>
        <li><strong>Alamat email</strong> — diformat dengan benar, menggunakan nama yang dihasilkan sebagai bagian lokal</li>
        <li><strong>Nomor telepon</strong> — format AS dengan kode area</li>
        <li><strong>Tanggal lahir</strong> — menghasilkan orang dewasa berusia antara 18 dan 80 tahun</li>
        <li><strong>Jenis kelamin</strong> — pria / wanita / non-biner</li>
      </ul>

      <h3>Alamat</h3>
      <ul>
        <li><strong>Alamat jalan</strong> — nomor rumah dan nama jalan yang realistis</li>
        <li><strong>Kota</strong> — nama kota AS dan internasional yang nyata</li>
        <li><strong>Negara bagian</strong> — negara bagian AS dan padanannya secara internasional</li>
        <li><strong>Negara</strong></li>
        <li><strong>Kode pos / kode pos</strong> — format sesuai negara yang dipilih</li>
      </ul>

      <h3>Internet &amp; Identitas</h3>
      <ul>
        <li><strong>Nama pengguna</strong> — dibuat dari nama dengan angka yang ditambahkan untuk realisme</li>
        <li><strong>URL</strong> — URL situs web pribadi atau perusahaan yang realistis</li>
        <li><strong>Alamat IP</strong> — alamat IPv4 yang valid dalam rentang publik</li>
        <li><strong>User agent</strong> — string user-agent browser nyata dari browser umum</li>
      </ul>

      <h3>Keuangan</h3>
      <ul>
        <li>
          <strong>Nomor kartu kredit</strong> — lulus validasi algoritma Luhn, sehingga tidak akan ditolak
          oleh validator format; menggunakan awalan nomor kartu yang realistis (Visa 4xxx, Mastercard 5xxx)
          tetapi bukan nomor kartu nyata
        </li>
        <li><strong>IBAN</strong> — format valid untuk nomor rekening bank Eropa</li>
      </ul>

      <h3>Pengenal &amp; Kolom Sistem</h3>
      <ul>
        <li><strong>UUID</strong> — UUID v4 untuk kunci primer database dan ID korelasi</li>
        <li><strong>SSN</strong> — format Social Security Number AS (XXX-XX-XXXX)</li>
        <li><strong>Tanggal</strong> dan <strong>angka acak</strong> dalam rentang yang dapat dikonfigurasi</li>
      </ul>

      <h2>Cara Menggunakan Generator</h2>
      <p>
        Buka <Link href="/tools/fake-data">/tools/fake-data</Link>. Antarmuka memberi Anda tiga kontrol:
      </p>
      <ol>
        <li>
          <strong>Pilih kolom Anda:</strong> Centang kotak untuk setiap jenis kolom yang Anda inginkan dalam
          output. Anda dapat memilih sesedikit satu kolom (hanya alamat email, misalnya) atau set lengkap
          untuk rekaman pengguna yang komprehensif.
        </li>
        <li>
          <strong>Atur jumlah rekaman:</strong> Masukkan angka antara 1 dan 1.000. Untuk seed data load
          testing, gunakan 1.000. Untuk cerita Storybook atau mockup desain, 5–10 rekaman biasanya cukup.
        </li>
        <li>
          <strong>Pilih format output:</strong> Pilih JSON atau CSV. JSON lebih baik untuk pengujian API
          dan toolchain JavaScript. CSV lebih baik untuk impor database, tinjauan spreadsheet, atau alat
          seperti Postman.
        </li>
      </ol>
      <p>
        Klik "Hasilkan." Output muncul di area teks di bawah. Gunakan tombol "Salin" untuk menyalinnya ke
        clipboard, atau "Unduh" untuk menyimpan file secara lokal. Generasi instan untuk hingga 1.000
        rekaman — semua komputasi terjadi di browser Anda.
      </p>

      <h2>Contoh Output JSON</h2>
      <p>
        Berikut cuplikan representatif 3 rekaman dari output JSON dengan kolom pribadi, alamat, dan internet
        yang dipilih:
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

      <h2>Contoh Output CSV</h2>
      <p>
        Data yang sama dalam format CSV, siap diimpor ke spreadsheet, database, atau alat apa pun yang
        menerima file yang dibatasi:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Contoh Dunia Nyata 1: Seeding Database Pengguna untuk Load Testing</h2>
      <p>
        Load testing API yang menghadap pengguna memerlukan database yang diisi. Anda membutuhkan cukup
        rekaman untuk mensimulasikan performa query yang realistis, perilaku paginasi, dan pengindeksan
        pencarian — tetapi Anda tidak dapat menggunakan data pengguna nyata, dan membuat ribuan INSERT SQL
        secara manual tidak praktis.
      </p>
      <p>
        Dengan generator data palsu, hasilkan 1.000 rekaman dengan semua kolom yang relevan untuk pengguna
        yang dipilih, unduh sebagai CSV, lalu impor langsung ke database Anda:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`-- PostgreSQL: impor CSV langsung ke tabel users
COPY users (id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code)
FROM '/path/to/fake_users.csv'
DELIMITER ','
CSV HEADER;

-- Padanan MySQL:
LOAD DATA LOCAL INFILE '/path/to/fake_users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;

-- MongoDB (menggunakan mongoimport):
mongoimport --db myapp --collection users --type csv --headerline --file fake_users.csv`}</code></pre>

      <h2>Contoh Dunia Nyata 2: Mengisi Cerita Storybook atau Mockup Desain</h2>
      <p>
        Saat membangun komponen UI — tabel pengguna, kartu kontak, daftar hasil pencarian — data yang Anda
        uji membentuk apakah Anda menemukan masalah nyata. Tabel 10 pengguna di mana satu memiliki nama
        yang sangat panjang, satu memiliki karakter internasional dalam email mereka, dan satu memiliki
        kota yang terbungkus ke dua baris akan mengungkapkan bug tata letak yang tidak pernah terlihat
        dalam tabel baris placeholder yang identik.
      </p>
      <p>
        Hasilkan 10–20 rekaman sebagai JSON, tempel output langsung ke cerita Storybook atau file fixture
        komponen Anda:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// UserTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from './UserTable';

// Tempel JSON yang dihasilkan langsung dari BrowseryTools:
const fakeUsers = [
  { id: "a3f7c2e1...", firstName: "Meredith", lastName: "Okafor", email: "meredith.okafor47@mailbox.net", city: "Columbus" },
  { id: "b8e2d5f1...", firstName: "Derek", lastName: "Nascimento", email: "d.nascimento@webfrontier.io", city: "Portland" },
  // ... rekaman lainnya
];

const meta: Meta<typeof UserTable> = { component: UserTable };
export default meta;

export const WithData: StoryObj<typeof UserTable> = {
  args: { users: fakeUsers },
};`}</code></pre>

      <h2>Contoh Dunia Nyata 3: Fixture Tes Integrasi API</h2>
      <p>
        Tes integrasi untuk endpoint API yang membuat atau memperbarui rekaman pengguna memerlukan set
        data input yang andal dan deterministik. Daripada menulis objek fixture secara manual, hasilkan
        sekumpulan rekaman sekali, simpan file JSON ke direktori fixture pengujian Anda, dan impor dalam
        pengujian Anda:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// tests/fixtures/users.json — dihasilkan oleh BrowseryTools, di-commit ke version control
// tests/api/users.test.ts

import users from '../fixtures/users.json';
import { createUser } from '../../src/api/users';

describe('POST /api/users', () => {
  it.each(users.slice(0, 10))('membuat pengguna dengan data valid (%s)', async (user) => {
    const response = await createUser(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
  });
});`}</code></pre>

      <h2>Mengimpor ke Koleksi Postman</h2>
      <p>
        Untuk pengujian API dengan Postman, hasilkan rekaman uji Anda sebagai JSON dan gunakan fitur file
        data Postman untuk menjalankan permintaan sekali per rekaman. Simpan output JSON sebagai file,
        lalu di Postman: buka collection runner, pilih permintaan, dan lampirkan file JSON sebagai sumber
        "Data". Postman akan mengiterasi setiap rekaman, mengganti nilai ke dalam badan permintaan Anda
        menggunakan sintaks variabel{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code>, dan sejenisnya.
      </p>
      <p>
        Ini mengubah permintaan POST yang ditulis secara manual menjadi tes otomatis yang berjalan terhadap
        100 rekaman pengguna yang realistis berbeda dalam hitungan detik — tanpa memerlukan setup test
        framework apa pun.
      </p>

      <h2>BrowseryTools vs. Mockaroo</h2>
      <p>
        Mockaroo adalah generator data palsu online yang paling dikenal. Ini adalah alat yang solid, tetapi
        memiliki hambatan yang dihilangkan BrowseryTools sepenuhnya:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Dimensi</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (Gratis)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Akun diperlukan", "Tidak", "Ya"],
              ["Batas baris (gratis)", "1.000 per generasi", "1.000/hari total"],
              ["Langganan diperlukan untuk lebih", "Tidak", "Ya ($50/tahun)"],
              ["Data diunggah ke server", "Tidak pernah", "Ya (skema + data)"],
              ["Akses API", "N/A", "Hanya paket berbayar"],
              ["Bekerja offline", "Ya (setelah pemuatan halaman)", "Tidak"],
              ["Format output", "JSON, CSV", "JSON, CSV, SQL, Excel, dan lainnya"],
              ["Variasi jenis kolom", "Jenis umum tercakup", "Sangat luas"],
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
        Jika Anda memerlukan jenis kolom yang sangat terspesialisasi atau output SQL, Mockaroo tetap
        berharga. Untuk kasus umum — menghasilkan JSON atau CSV yang realistis untuk rekaman pengguna —
        BrowseryTools tidak memerlukan setup akun, tidak ada manajemen batas harian, dan tidak ada
        kekhawatiran tentang skema data Anda yang dikirim ke server pihak ketiga.
      </p>

      <h2>Privasi: Semua Generasi Terjadi Secara Lokal</h2>
      <p>
        Setiap nama, email, alamat, dan UUID yang dihasilkan generator dibuat oleh JavaScript yang berjalan
        di tab browser Anda. Jenis kolom yang Anda pilih, jumlah rekaman yang Anda minta, dan data output
        itu sendiri tidak pernah dikirimkan ke server mana pun. BrowseryTools tidak memiliki komponen
        backend yang terlibat dalam generasi data.
      </p>
      <p>
        Ini kurang penting ketika menghasilkan data palsu secara khusus (karena semuanya fiktif berdasarkan
        definisi), tetapi penting untuk skema yang Anda gunakan untuk diuji. Jika pilihan kolom Anda
        mengungkapkan struktur sistem internal yang sensitif, informasi tersebut juga tetap lokal.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Data palsu vs. anonimisasi data:</strong> Ini adalah alat terpisah untuk tujuan terpisah.
        Generator data palsu membuat rekaman fiktif dari awal — tidak ada yang didasarkan pada individu
        nyata. Alat anonimisasi data mengambil rekaman nyata dan mengubahnya untuk menghapus informasi
        pengidentifikasi sambil mempertahankan properti statistik. Jika Anda memiliki data pengguna nyata
        yang perlu digunakan dalam lingkungan pengujian, anonimisasi adalah alat yang tepat (lihat alat
        seperti ARX, Amnesia, atau pg_anonymizer PostgreSQL). Jika Anda membutuhkan data pengujian dari
        awal dan tidak memiliki data nyata untuk dijadikan dasar, generator data palsu seperti ini
        adalah pilihan yang tepat.
      </div>

      <h2>Hasilkan Dataset Pertama Anda Sekarang</h2>
      <p>
        Baik Anda melakukan seeding database load test, mengisi cerita Storybook, menulis fixture tes API,
        atau hanya mendemonstrasikan fitur dengan sesuatu yang terlihat nyata — data palsu yang realistis
        adalah fondasi yang tepat, dan menghasilkannya seharusnya hanya membutuhkan 30 detik.
      </p>
      <p>
        Buka <Link href="/tools/fake-data">Generator Data Palsu BrowseryTools</Link>, pilih kolom Anda,
        atur jumlah rekaman, pilih JSON atau CSV, dan klik Hasilkan. Tanpa akun, tanpa batas baris, tanpa
        biaya, tidak ada yang diunggah ke mana pun.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Hasilkan Data Uji yang Realistis dalam Hitungan Detik</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Hingga 1.000 rekaman. JSON atau CSV. Nama, email, alamat, UUID, kartu kredit, dan lainnya.
          Gratis, lokal, tidak perlu akun.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Buka Generator Data Palsu →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Alat terkait:{" "}
        <Link href="/tools/json-formatter">JSON Formatter</Link> ·{" "}
        <Link href="/tools/uuid-generator">Generator UUID</Link> ·{" "}
        <Link href="/tools/regex-tester">Penguji Regex</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV ke JSON</Link> ·{" "}
        <Link href="/">Semua BrowseryTools</Link>
      </p>
      <ToolCTA slug="fake-data" variant="card" />
    </div>
  );
}
