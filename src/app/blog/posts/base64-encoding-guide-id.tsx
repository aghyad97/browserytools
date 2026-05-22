export default function Content() {
  return (
    <div>
      <p>
        Buka aplikasi web modern apa pun, periksa permintaan HTTP, lihat manifest Kubernetes, atau intip
        ke dalam token JWT — Base64 ada di mana-mana. Ini adalah salah satu skema encoding fundamental yang
        sering ditemui pengembang namun jarang dipahami sepenuhnya. Panduan ini menjelaskan apa itu Base64,
        cara kerjanya di level byte, di mana ia digunakan dalam sistem dunia nyata, dan kapan Anda
        sebaiknya (dan sebaiknya tidak) menggunakannya.
      </p>
      <p>
        Anda dapat meng-encode dan men-decode string Base64 apa pun secara instan menggunakan{" "}
        <a href="/tools/base64">Encoder/Decoder Base64 BrowseryTools</a> — gratis, tanpa pendaftaran,
        dan tidak ada yang pernah meninggalkan browser Anda.
      </p>

      <h2>Mengapa Base64 Ada?</h2>
      <p>
        Untuk memahami Base64, Anda perlu memahami masalah yang dipecahkannya. Pada awal internet, banyak
        protokol komunikasi — terutama email — dirancang untuk teks ASCII 7-bit. ASCII mendefinisikan 128
        karakter menggunakan 7 bit per karakter. Data biner (gambar, dokumen, file eksekusi) menggunakan
        semua 8 bit per byte, menghasilkan nilai byte yang tidak memiliki representasi ASCII dan yang akan
        dibuang, dirusak, atau ditafsirkan sebagai perintah kontrol oleh sistem lama.
      </p>
      <p>
        Standar MIME (Multipurpose Internet Mail Extensions), yang diperkenalkan pada tahun 1991 untuk
        memungkinkan email membawa lampiran, membutuhkan cara untuk mengirimkan data biner sembarang melalui
        saluran 7-bit bersih ini. Solusinya adalah mengenkode ulang data biner hanya menggunakan subset
        karakter ASCII yang dapat dicetak yang aman — yang setiap sistem sepakati dan akan dikirimkan
        dengan setia. Base64 menjadi encoding standar untuk tujuan ini, dan namanya menggambarkan
        pendekatannya: gunakan satu set 64 karakter aman untuk merepresentasikan data biner apa pun.
      </p>

      <h2>Alfabet 64 Karakter</h2>
      <p>
        Base64 menggunakan tepat 64 karakter, itulah mengapa 6 bit input selalu dapat direpresentasikan
        oleh satu karakter Base64 (2<sup>6</sup> = 64). Alfabet standar yang didefinisikan dalam RFC 4648
        adalah:
      </p>
      <ul>
        <li>Huruf besar <code>A</code> hingga <code>Z</code> — nilai 0 hingga 25</li>
        <li>Huruf kecil <code>a</code> hingga <code>z</code> — nilai 26 hingga 51</li>
        <li>Digit <code>0</code> hingga <code>9</code> — nilai 52 hingga 61</li>
        <li><code>+</code> — nilai 62</li>
        <li><code>/</code> — nilai 63</li>
      </ul>
      <p>
        Karakter ke-65 — tanda sama dengan <code>=</code> — digunakan sebagai padding tetapi tidak
        merepresentasikan data. Padding memastikan panjang output yang dienkode selalu merupakan kelipatan
        4 karakter, yang menyederhanakan decoding.
      </p>

      <h2>Cara Kerja Encoding Base64: 3 Byte → 4 Karakter</h2>
      <p>
        Base64 bekerja dengan mengambil 3 byte input (24 bit) dan membaginya menjadi empat kelompok 6-bit.
        Setiap kelompok 6-bit dipetakan ke satu karakter dalam alfabet Base64. Karena 3 byte menjadi 4
        karakter, encoding Base64 meningkatkan ukuran data tepat sepertiga (33%).
      </p>
      <p>
        Mari kita bahas contoh konkret: mengenkode string ASCII <code>"Man"</code>.
      </p>
      <p>
        Langkah 1 — Konversi setiap karakter ke nilai byte ASCII-nya lalu ke biner:
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Langkah 2 — Gabungkan 24 bit menjadi satu stream:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (gabungkan semua 24 bit)
010011 010110 000101 101110`}
      </pre>
      <p>
        Langkah 3 — Petakan setiap kelompok 6-bit ke alfabet Base64:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kelompok 6-bit</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Nilai desimal</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Karakter Base64</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Encoding Base64 dari <code>"Man"</code> adalah <code>TWFu</code>. Anda dapat memverifikasi ini
        menggunakan <a href="/tools/base64">alat Base64 BrowseryTools</a>. Ketika panjang input bukan
        kelipatan 3, karakter padding (<code>=</code> atau <code>==</code>) ditambahkan untuk membawa
        output ke kelipatan 4 karakter. Misalnya, <code>"Ma"</code> menghasilkan <code>TWE=</code> dan{" "}
        <code>"M"</code>{" "}
        menghasilkan <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Kesalahpahaman umum:</strong> Base64 adalah encoding, bukan enkripsi. Prosesnya sepenuhnya
        dapat dibalik oleh siapa saja tanpa kunci atau kata sandi apa pun. Melihat data yang dienkode
        Base64 dalam URL, header, atau file tidak berarti data tersebut dilindungi dengan cara apa pun —
        itu hanyalah representasi berbeda dari byte yang sama. Siapa pun yang dapat menyalin string dapat
        mendekodenya secara instan.
      </div>

      <h2>Kasus Penggunaan Umum</h2>

      <h3>Menyematkan Gambar dalam HTML dan CSS</h3>
      <p>
        Daripada membuat permintaan HTTP terpisah untuk gambar atau ikon kecil, Anda dapat menyematkannya
        langsung di HTML atau CSS Anda sebagai data URI. Browser mendekode string Base64 dan merender
        gambar tanpa round-trip jaringan. Ini berguna untuk aset kecil seperti favicon, spinner loading,
        atau ikon inline dalam template email di mana pemuatan URL eksternal mungkin diblokir.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* Contoh CSS — menyematkan ikon PNG kecil */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Data Biner dalam API JSON</h3>
      <p>
        JSON adalah format teks. Jika API perlu mengirimkan data biner — file, kunci kriptografi, tanda
        tangan, gambar — di dalam payload JSON, ia tidak dapat menyertakan byte mentah. Meng-encode data
        biner dengan Base64 mengubahnya menjadi string biasa yang dapat dibawa JSON tanpa masalah. Banyak
        API yang mengembalikan konten file, sampel audio, atau gambar dalam respons JSON menggunakan
        pendekatan ini.
      </p>

      <h3>HTTP Basic Authentication</h3>
      <p>
        Skema HTTP Basic Auth mengirimkan kredensial di header <code>Authorization</code> sebagai encoding
        Base64 dari <code>username:password</code>. Misalnya, kredensial <code>admin:secret</code>{" "}
        menjadi string <code>YWRtaW46c2VjcmV0</code>, dan header lengkapnya terlihat seperti:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        Ini tidak dienkripsi — hanya dienkode. Basic Auth harus selalu digunakan melalui HTTPS, tidak
        pernah melalui HTTP biasa, karena kredensial dapat didekode dengan mudah oleh siapa pun yang
        mencegat permintaan tersebut.
      </p>

      <h3>Payload JWT</h3>
      <p>
        JSON Web Token mengenkode header dan payload-nya menggunakan Base64URL (varian yang aman untuk URL
        yang dijelaskan di bawah). Klaim token — ID pengguna, waktu kedaluwarsa, peran — disimpan dalam
        payload sebagai objek JSON yang dienkode Base64URL. Sekali lagi, ini bukan enkripsi: payload
        sepenuhnya dapat dibaca oleh siapa pun yang memiliki token.
      </p>

      <h3>Secret Kubernetes</h3>
      <p>
        Kubernetes menyimpan nilai Secret sebagai string yang dienkode Base64 dalam manifest YAML. Berikut
        contoh nyata Kubernetes Secret:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        Untuk mengetahui nilai-nilai tersebut sebenarnya, tempel <code>YWRtaW4=</code> ke dalam{" "}
        <a href="/tools/base64">Decoder Base64 BrowseryTools</a>. Hasilnya adalah <code>admin</code>. Tempel{" "}
        <code>cGFzc3dvcmQxMjM=</code> dan Anda mendapatkan <code>password123</code>. Kubernetes meng-encode
        Base64 nilai secret untuk pemformatan YAML yang aman, bukan untuk keamanan — keamanan sebenarnya
        berasal dari Kubernetes RBAC dan enkripsi at-rest, bukan dari encoding itu sendiri.
      </p>

      <h2>Varian Base64URL</h2>
      <p>
        Base64 standar menggunakan dua karakter yang bersifat khusus dalam URL: <code>+</code> (yang
        berarti spasi dalam encoding form) dan <code>/</code> (yang merupakan pemisah path). Ketika data
        yang dienkode Base64 perlu muncul dalam URL, parameter query, atau nama file, karakter-karakter ini
        menimbulkan masalah.
      </p>
      <p>
        Base64URL memecahkan ini dengan mengganti:
      </p>
      <ul>
        <li><code>+</code> diganti dengan <code>-</code> (tanda hubung)</li>
        <li><code>/</code> diganti dengan <code>_</code> (garis bawah)</li>
        <li>Padding <code>=</code> di akhir sering dihilangkan</li>
      </ul>
      <p>
        Base64URL digunakan dalam JWT, token OAuth, dan konteks apa pun di mana string yang dienkode harus
        bertahan transmisi URL tanpa percent-encoding.{" "}
        <a href="/tools/base64">Alat Base64 BrowseryTools</a> mendukung varian standar maupun URL-safe.
      </p>

      <h2>Kapan TIDAK Menggunakan Base64</h2>
      <p>
        Base64 adalah alat yang tepat dalam situasi tertentu, tetapi sering disalahgunakan. Berikut kapan
        Anda harus menghindarinya:
      </p>
      <ul>
        <li>
          <strong>File besar:</strong> Base64 meningkatkan ukuran data ~33%. Gambar 10 MB menjadi sekitar
          13,3 MB ketika dienkode Base64. Menyematkan file besar sebagai data URI atau string Base64 dalam
          JSON memperlambat parsing, meningkatkan penggunaan memori, dan membuang bandwidth. Gunakan transfer
          file langsung atau URL penyimpanan objek untuk ukuran non-trivial.
        </li>
        <li>
          <strong>Keamanan:</strong> Jangan pernah menggunakan Base64 sebagai ukuran keamanan. Ini tidak
          memberikan kerahasiaan sama sekali. Jika data sensitif, gunakan enkripsi nyata (AES-GCM, RSA, dll.).
        </li>
        <li>
          <strong>Penyimpanan:</strong> Menyimpan data biner sebagai Base64 dalam kolom database membuang
          33% lebih banyak ruang dibandingkan menyimpan byte mentah dalam kolom biner. Gunakan tipe biner
          database-native (BYTEA di PostgreSQL, BLOB di MySQL) saat menyimpan data biner dalam skala besar.
        </li>
      </ul>

      <h2>Base64 vs Encoding Hex: Perbandingan</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Properti</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hex (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Set karakter</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 karakter)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 karakter)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Overhead ukuran</strong></td>
              <td style={{padding: "12px 16px"}}>~33% lebih besar</td>
              <td style={{padding: "12px 16px"}}>~100% lebih besar (2 karakter per byte)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Keterbacaan manusia</strong></td>
              <td style={{padding: "12px 16px"}}>Rendah — tidak dapat dikenali</td>
              <td style={{padding: "12px 16px"}}>Sedang — dapat dibaca di level byte</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Kasus penggunaan umum</strong></td>
              <td style={{padding: "12px 16px"}}>Lampiran email, JWT, data URI, payload API</td>
              <td style={{padding: "12px 16px"}}>Hash kriptografi, checksum, kode warna, alamat MAC</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Aman untuk URL?</strong></td>
              <td style={{padding: "12px 16px"}}>Hanya dengan varian Base64URL</td>
              <td style={{padding: "12px 16px"}}>Ya — semua karakter aman untuk URL</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Bit per karakter</strong></td>
              <td style={{padding: "12px 16px"}}>6 bit</td>
              <td style={{padding: "12px 16px"}}>4 bit</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Gunakan Base64 ketika Anda membutuhkan encoding biner-ke-teks yang kompak dan luasnya set karakter
        tidak menimbulkan masalah. Gunakan hex ketika inspeksi manusia terhadap nilai byte individual penting
        — digest hash, checksum, dan output kriptografi secara tradisional ditampilkan dalam hex tepat karena
        setiap karakter hex dipetakan langsung ke 4 bit, membuat batas byte terlihat dengan mudah.
      </p>

      <h2>Encoding dan Decoding Base64 dalam Kode</h2>
      <p>
        Sebagian besar bahasa menyediakan dukungan Base64 bawaan. Berikut satu baris cepat untuk lingkungan
        umum:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser atau Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        Untuk encoding atau decoding ad-hoc yang cepat tanpa menulis kode apa pun,{" "}
        <a href="/tools/base64">alat Base64 BrowseryTools</a> adalah opsi tercepat — tempel string Anda,
        pilih encode atau decode, dan hasilnya muncul secara instan. Tidak ada yang dikirim ke server.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Jaminan privasi:</strong> Encoder dan decoder Base64 BrowseryTools memproses semuanya
        secara lokal di browser Anda menggunakan JavaScript. Jika Anda meng-encode data sensitif — kunci
        API, secret, konfigurasi privat — data tersebut tidak pernah menyentuh server. Data Anda tetap
        di perangkat Anda.
      </div>

      <h2>Encode dan Decode Base64 Secara Instan</h2>
      <p>
        Baik Anda mendekode Kubernetes secret, memeriksa payload JWT, membuat data URI untuk gambar inline,
        atau hanya penasaran apa yang dikandung string Base64 —{" "}
        <a href="/tools/base64">Encoder/Decoder Base64 BrowseryTools</a> menanganinya dalam satu klik.
        Tempel input Anda, dapatkan output Anda. Tanpa iklan, tanpa pendaftaran, tanpa data yang meninggalkan
        perangkat Anda.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Encoder / Decoder Base64 Gratis — Berjalan 100% di Browser Anda
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Alat Base64 →
        </a>
      </div>
    </div>
  );
}
