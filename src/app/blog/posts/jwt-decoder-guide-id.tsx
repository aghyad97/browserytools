export default function Content() {
  return (
    <div>
      <p>
        Jika Anda pernah bekerja dengan sistem autentikasi web modern — OAuth 2.0, OpenID Connect, atau API
        kustom — Anda hampir pasti pernah menemukan token JWT. Mereka muncul di header Authorization, dalam
        cookie, di local storage, dan dalam sesi debugging pukul 2 dini hari ketika alur login misterius
        gagal. Memahami apa yang sebenarnya dikandung JWT, cara membacanya, dan cara mendeteksi masalah umum
        membuat debugging autentikasi jauh lebih cepat.
      </p>
      <p>
        <a href="/tools/jwt-decoder">Decoder JWT BrowseryTools</a> memungkinkan Anda menempel token JWT apa
        pun dan langsung melihat header, payload, dan status kedaluwarsa yang telah didekode — semua di
        browser Anda, dengan token tidak pernah meninggalkan perangkat Anda.
      </p>

      <h2>Apa Itu JWT?</h2>
      <p>
        JWT singkatan dari JSON Web Token, yang didefinisikan dalam RFC 7519. JWT adalah token yang kompak
        dan aman untuk URL yang mengenkode sekumpulan klaim — pernyataan tentang subjek, biasanya pengguna —
        dalam format yang dapat diverifikasi dan dipercaya. Properti kunci JWT adalah bahwa ia
        <em>self-contained</em>: token itu sendiri membawa semua informasi yang dibutuhkan server untuk
        mengautentikasi permintaan, tanpa pencarian database.
      </p>
      <p>
        JWT terlihat seperti ini:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfODQyMTkiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImVkaXRvciJdLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImlhdCI6MTczODM2ODAwMCwiZXhwIjoxNzM4MzcxNjAwLCJqdGkiOiI3ZjNhOWI0Yy0xZDJlLTQ1NmYtYWJjZC04OTAxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </pre>
      <p>
        Pada pandangan pertama terlihat seperti omong kosong. Namun ia memiliki struktur yang sangat tepat:
        tiga bagian yang dienkode Base64URL dipisahkan oleh titik. Setiap bagian memiliki tujuan khusus.
      </p>

      <h2>Struktur Tiga Bagian: Header.Payload.Signature</h2>

      <h3>Bagian 1: Header</h3>
      <p>
        Segmen pertama, sebelum titik pertama, adalah <strong>header</strong>. Ini adalah objek JSON yang
        dienkode Base64URL yang mendeskripsikan jenis token dan algoritma penandatanganan. Didekode, header
        dari contoh di atas terlihat seperti:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </pre>
      <p>
        Kolom <code>alg</code> menentukan algoritma penandatanganan. Nilai umum yang akan Anda temui adalah:
      </p>
      <ul>
        <li>
          <strong>HS256</strong> — HMAC dengan SHA-256. Menggunakan kunci rahasia bersama. Baik penerbit
          maupun verifikator harus memiliki rahasia yang sama. Umum dalam aplikasi monolitik.
        </li>
        <li>
          <strong>RS256</strong> — Tanda tangan RSA dengan SHA-256. Menggunakan pasangan kunci publik/privat.
          Penerbit menandatangani dengan kunci privat; verifikator memeriksa dengan kunci publik. Umum dalam
          sistem terdistribusi dan penyedia OAuth.
        </li>
        <li>
          <strong>ES256</strong> — ECDSA dengan P-256 dan SHA-256. Seperti RS256 tetapi menggunakan kurva
          eliptik — kunci lebih pendek, tingkat keamanan sama. Lebih disukai dalam sistem berkinerja tinggi
          modern.
        </li>
        <li>
          <strong>none</strong> — Tanpa tanda tangan. Jangan pernah terima ini dalam produksi. Kerentanan
          keamanan terkenal muncul ketika server menerima token tanpa tanda tangan karena klien mengubah{" "}
          <code>alg</code>{" "}
          menjadi <code>"none"</code>.
        </li>
      </ul>

      <h3>Bagian 2: Payload</h3>
      <p>
        Segmen kedua adalah <strong>payload</strong> — data aktual yang dibawa token. Ini juga merupakan
        objek JSON yang dienkode Base64URL. Payload yang didekode dari contoh kita:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "sub": "usr_84219",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "roles": ["user", "editor"],
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "iat": 1738368000,
  "exp": 1738371600,
  "jti": "7f3a9b4c-1d2e-456f-abcd-890123456789"
}`}
      </pre>
      <p>
        Payload berisi dua jenis klaim: <strong>klaim terdaftar</strong> yang didefinisikan oleh spesifikasi
        JWT, dan <strong>klaim privat/kustom</strong> yang ditambahkan oleh aplikasi Anda (seperti{" "}
        <code>name</code>, <code>email</code>, dan <code>roles</code> di atas).
      </p>

      <h3>Bagian 3: Signature</h3>
      <p>
        Segmen ketiga adalah <strong>signature</strong>. Dihitung dengan mengambil header yang dienkode
        Base64URL, sebuah titik, payload yang dienkode Base64URL, dan menandatangani hasilnya dengan
        algoritma dan kunci yang ditentukan dalam header. Untuk HS256:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}
      </pre>
      <p>
        Signature memastikan integritas: jika siapa pun memodifikasi bahkan satu karakter dalam header atau
        payload setelah token diterbitkan, signature menjadi tidak valid dan verifikasi gagal. Tanpa
        mengetahui rahasia penandatanganan (atau kunci privat penerbit untuk RS256/ES256), penyerang tidak
        dapat memalsukan token yang valid.
      </p>

      <h2>Referensi Klaim JWT Standar</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Klaim</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Nama lengkap</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iss</code></td>
              <td style={{padding: "10px 16px"}}>Penerbit</td>
              <td style={{padding: "10px 16px"}}>Siapa yang menerbitkan token (misalnya, URL server auth Anda)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>sub</code></td>
              <td style={{padding: "10px 16px"}}>Subjek</td>
              <td style={{padding: "10px 16px"}}>Siapa yang dimaksud token — biasanya ID unik pengguna</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>aud</code></td>
              <td style={{padding: "10px 16px"}}>Audiens</td>
              <td style={{padding: "10px 16px"}}>Layanan mana yang dimaksudkan token ini</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>exp</code></td>
              <td style={{padding: "10px 16px"}}>Waktu Kedaluwarsa</td>
              <td style={{padding: "10px 16px"}}>Timestamp Unix setelah mana token harus ditolak</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iat</code></td>
              <td style={{padding: "10px 16px"}}>Diterbitkan Pada</td>
              <td style={{padding: "10px 16px"}}>Timestamp Unix saat token dibuat</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>nbf</code></td>
              <td style={{padding: "10px 16px"}}>Tidak Sebelum</td>
              <td style={{padding: "10px 16px"}}>Token tidak valid sebelum timestamp Unix ini</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>jti</code></td>
              <td style={{padding: "10px 16px"}}>ID JWT</td>
              <td style={{padding: "10px 16px"}}>Pengenal unik untuk token — digunakan untuk mencegah serangan replay</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Mengapa Klaim exp Sangat Kritis</h2>
      <p>
        Klaim <code>exp</code> adalah timestamp Unix — jumlah detik sejak 1 Januari 1970 (UTC). Dalam
        contoh kita, <code>"exp": 1738371600</code>. Untuk mengonversi ini ke tanggal yang dapat dibaca
        manusia, Anda dapat menggunakan JavaScript:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`new Date(1738371600 * 1000).toUTCString()
// → "Sat, 01 Feb 2026 01:00:00 GMT"`}
      </pre>
      <p>
        Kedaluwarsa JWT adalah hal pertama yang harus diperiksa ketika token ditolak. Token yang valid kemarin
        akan gagal hari ini jika <code>exp</code>-nya di masa lalu — ini by design. Token berumur pendek
        (15 menit hingga 1 jam) membatasi jendela kerusakan jika token dicuri. Token berumur lebih lama
        (hari atau minggu) lebih nyaman tetapi lebih berbahaya jika dikompromikan.
      </p>
      <p>
        <a href="/tools/jwt-decoder">Decoder JWT BrowseryTools</a> secara otomatis membaca klaim{" "}
        <code>exp</code>{" "}
        dan <code>iat</code> dan menampilkannya sebagai tanggal yang dapat dibaca manusia di samping
        timestamp Unix mentah, sehingga Anda tidak perlu melakukan matematika mental secara manual.
      </p>

      <h2>Skenario Debugging JWT Umum</h2>

      <h3>Token Kedaluwarsa (401 Unauthorized)</h3>
      <p>
        Kesalahan JWT yang paling umum. Server menolak token karena waktu saat ini melewati nilai{" "}
        <code>exp</code>. Perbaikan: implementasikan alur refresh token menggunakan refresh token berumur
        lebih panjang, atau cukup autentikasi ulang. Tempel token ke decoder untuk mengonfirmasi kapan
        tepatnya token kedaluwarsa.
      </p>

      <h3>Audiens Salah</h3>
      <p>
        Jika API Anda memvalidasi klaim <code>aud</code> dan token diterbitkan untuk audiens yang berbeda
        (misalnya, token yang diterbitkan untuk <code>https://api-staging.example.com</code> yang dikirim
        ke{" "}
        <code>https://api.example.com</code>), server akan menolaknya. Dekode token dan periksa kolom
        <code>aud</code> untuk mengonfirmasi cocok dengan apa yang diharapkan layanan penerima.
      </p>

      <h3>Ketidakcocokan Algoritma</h3>
      <p>
        Jika server Anda mengharapkan RS256 tetapi menerima token yang ditandatangani dengan HS256 (atau
        sebaliknya), validasi gagal. Ini bisa terjadi selama rotasi kunci atau ketika beralih penyedia
        auth. Periksa kolom <code>alg</code>{" "}
        di header yang didekode terhadap apa yang dikonfigurasi server Anda untuk diterima.
      </p>

      <h3>Signature Tidak Valid</h3>
      <p>
        Jika payload telah dirusak — bahkan satu karakter yang diubah — signature tidak akan cocok. Ini
        juga terjadi jika Anda menggunakan rahasia yang salah atau kunci publik yang salah untuk
        memverifikasi. Mendekode header dan payload (yang tidak memerlukan rahasia) memungkinkan Anda
        setidaknya memeriksa apa yang diklaim token, bahkan jika Anda tidak dapat memverifikasi
        keasliannya di sisi klien.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Peringatan keamanan — payload tidak dienkripsi:</strong> Payload JWT dienkode Base64URL,
        bukan dienkripsi. Siapa pun yang memiliki string token dapat mendekode header dan payload tanpa
        kunci atau rahasia apa pun. Jangan pernah menyimpan informasi sensitif dalam payload JWT — tidak
        ada kata sandi, data kartu pembayaran, nomor jaminan sosial, atau kunci privat. Perlakukan
        payload sebagai data yang dapat dibaca publik yang hanya terlindungi dari gangguan, bukan
        bersifat rahasia.
      </div>

      <h2>JWT vs Token Sesi: Kapan Menggunakan Masing-Masing</h2>
      <p>
        JWT dan token sesi tradisional memecahkan masalah yang sama — mengidentifikasi pengguna yang
        terautentikasi di berbagai permintaan — tetapi mereka melakukannya secara berbeda, dan tidak ada
        yang secara universal lebih baik.
      </p>
      <p>
        <strong>Token sesi tradisional</strong> adalah string acak yang buram (misalnya, UUID) yang
        disimpan sisi server dalam penyimpanan sesi (Redis, database). Pada setiap permintaan server
        mencari token dalam penyimpanan dan mengambil data pengguna. Server memiliki kontrol penuh:
        membatalkan sesi segera mencabut akses.
      </p>
      <p>
        <strong>JWT</strong> bersifat stateless. Server menerbitkan token yang ditandatangani dan tidak
        menyimpan catatan tentangnya. Pada setiap permintaan server memverifikasi signature dan
        mempercayai klaim tanpa pencarian database apa pun. Ini skalabel secara horizontal tanpa status
        bersama — server mana pun dengan kunci verifikasi dapat mengautentikasi permintaan. Tradeoff:
        Anda tidak dapat segera mencabut JWT sebelum kedaluwarsa (kecuali Anda mengimplementasikan
        daftar blokir token, yang memperkenalkan kembali state).
      </p>
      <ul>
        <li>Gunakan <strong>JWT</strong> untuk layanan mikro stateless, sistem terdistribusi, API mobile,
        dan autentikasi lintas domain (alur OAuth/OIDC). Jaga waktu kedaluwarsa tetap singkat.</li>
        <li>Gunakan <strong>token sesi</strong> ketika Anda membutuhkan kemampuan pencabutan segera (logout,
        penangguhan akun, insiden keamanan), atau ketika semua layanan Anda berbagi penyimpanan sesi yang
        cepat.</li>
      </ul>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Aturan keamanan kritis:</strong> Selalu verifikasi signature JWT di sisi server menggunakan
        kunci yang tepercaya. Jangan pernah mengandalkan verifikasi sisi klien saja. Klien dapat mendekode
        payload JWT mana pun tanpa rahasia — tetapi hanya server, yang memegang kunci yang benar, yang
        dapat menentukan apakah signature asli dan token dapat dipercaya. Decoding sisi klien hanya berguna
        untuk <em>membaca</em>{" "}
        klaim (seperti menampilkan nama pengguna di UI), tidak pernah untuk membuat keputusan otorisasi.
      </div>

      <h2>Cara Menggunakan Decoder JWT BrowseryTools</h2>
      <p>
        Buka <a href="/tools/jwt-decoder">Decoder JWT</a> dan tempel token Anda ke kolom input. Alat ini
        segera memisahkan token pada dua titik dan menampilkan:
      </p>
      <ul>
        <li>
          <strong>Panel header:</strong> JSON yang didekode menampilkan <code>alg</code>, <code>typ</code>,
          dan kolom header lainnya. Berguna untuk mengidentifikasi algoritma penandatanganan sekilas.
        </li>
        <li>
          <strong>Panel payload:</strong> JSON yang didekode secara lengkap dengan semua klaim. Timestamp
          ditampilkan dalam format Unix mentah maupun tanggal UTC yang dapat dibaca manusia sehingga Anda
          dapat segera melihat kedaluwarsa tanpa konversi mental.
        </li>
        <li>
          <strong>Status kedaluwarsa:</strong> Indikator yang jelas menunjukkan apakah token saat ini valid,
          sudah kedaluwarsa, atau belum aktif (berdasarkan <code>nbf</code>). Jika kedaluwarsa, Anda melihat
          berapa lama yang lalu token kedaluwarsa.
        </li>
        <li>
          <strong>Segmen signature:</strong> Signature yang dienkode Base64URL mentah, ditampilkan untuk
          referensi. Alat ini tidak memverifikasi signature (itu memerlukan rahasia atau kunci publik),
          tetapi mendekode dan menampilkan semua informasi yang Anda butuhkan untuk debugging.
        </li>
      </ul>
      <p>
        Tidak ada pengiriman formulir, tidak ada permintaan server, tidak ada akses clipboard di luar apa
        yang Anda tempel secara eksplisit. Parsing token terjadi sepenuhnya dalam JavaScript yang berjalan
        di tab browser Anda.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Token Anda tetap privat:</strong> Token JWT sering mengandung ID pengguna, alamat email,
        peran, dan data pribadi lainnya. Decoder JWT BrowseryTools memproses token Anda sepenuhnya di
        browser Anda — tidak pernah dikirim ke server mana pun, tidak pernah dicatat, dan tidak pernah
        disimpan. Anda dapat dengan aman menempel token produksi untuk memeriksanya tanpa khawatir tentang
        eksposur. Setelah Anda menutup tab, semuanya hilang.
      </div>

      <h2>Dekode Token JWT Anda Sekarang</h2>
      <p>
        Baik Anda men-debug token yang kedaluwarsa, memeriksa klaim dari penyedia OAuth, memeriksa peran
        apa yang telah diberikan kepada pengguna, atau sekadar mencoba memahami apa yang sebenarnya
        diterbitkan sistem autentikasi Anda —{" "}
        <a href="/tools/jwt-decoder">Decoder JWT BrowseryTools</a> memberi Anda jawabannya secara instan.
        Tanpa registrasi, tanpa ekstensi yang perlu dipasang, tanpa data yang dikirim ke mana pun.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Decoder JWT Gratis — Instan, Privat, Tanpa Pendaftaran
        </p>
        <a
          href="/tools/jwt-decoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Decoder JWT →
        </a>
      </div>
    </div>
  );
}
