export default function Content() {
  return (
    <div>
      <p>
        Setiap kali Anda mengunduh rilis perangkat lunak, memverifikasi keaslian file, menandatangani token
        JWT, atau menyimpan kata sandi pengguna, fungsi hash kriptografi bekerja di latar belakang. Fungsi
        hash adalah salah satu primitif fundamental dari keamanan komputasi modern — namun perbedaan antara
        MD5, SHA-1, SHA-256, dan SHA-512 banyak disalahpahami, yang menyebabkan kesalahan keamanan nyata
        dalam sistem produksi.
      </p>
      <p>
        Panduan ini menjelaskan apa itu fungsi hash, cara kerja setiap algoritma utama, kapan masing-masing
        sesuai (dan kapan berbahaya untuk digunakan), dan cara menggunakan{" "}
        <a href="/tools/hash-generator">Generator Hash BrowseryTools</a> untuk menghitung hash secara instan
        di browser Anda dengan privasi penuh.
      </p>

      <h2>Apa Itu Fungsi Hash Kriptografi?</h2>
      <p>
        Fungsi hash kriptografi mengambil input dengan panjang sembarang dan menghasilkan output panjang
        tetap yang disebut digest atau hash. Empat properti mendefinisikan fungsi hash kriptografi yang baik:
      </p>
      <ul>
        <li>
          <strong>Deterministik:</strong> Input yang sama selalu menghasilkan output yang sama persis. Fungsi
          hash tidak memiliki state internal — dengan byte yang sama, Anda selalu mendapatkan digest yang
          sama.
        </li>
        <li>
          <strong>Satu arah (preimage resistance):</strong> Diberikan output hash, secara komputasi tidak
          mungkin untuk memulihkan input asli. Fungsi hash dirancang untuk mudah dihitung dalam satu arah
          dan efektif tidak dapat dibalik.
        </li>
        <li>
          <strong>Panjang output tetap:</strong> Terlepas dari apakah inputnya satu byte atau satu gigabyte,
          outputnya selalu panjang yang sama. SHA-256 selalu menghasilkan digest 256-bit (32-byte).
        </li>
        <li>
          <strong>Efek avalanche:</strong> Perubahan satu bit dalam input mengubah output sepenuhnya. Hash
          dari <code>hello</code> tidak terlihat seperti hash dari <code>hello!</code> — mereka tidak berbagi
          struktur yang dapat diprediksi. Ini membuat hash berguna sebagai sidik jari.
        </li>
      </ul>
      <p>
        Properti kelima — collision resistance — memisahkan hash yang kuat secara kriptografi dari yang rusak:
        secara komputasi harus tidak mungkin menemukan dua input berbeda yang menghasilkan output yang sama.
        Di sinilah MD5 dan SHA-1 gagal.
      </p>

      <h2>MD5: Cepat, Ubiquitous, dan Rusak untuk Keamanan</h2>
      <p>
        MD5 (Message Digest 5) dirancang oleh Ron Rivest dan diterbitkan pada tahun 1991. Menghasilkan
        digest 128-bit (16-byte), biasanya direpresentasikan sebagai string heksadesimal 32 karakter seperti{" "}
        <code>5d41402abc4b2a76b9719d911017c592</code>. Selama lebih dari satu dekade, itu adalah algoritma
        hash dominan untuk segala hal mulai dari checksum file hingga penyimpanan kata sandi.
      </p>
      <p>
        Pada tahun 2004, kriptografer mendemonstrasikan serangan tabrakan praktis terhadap MD5. Pada tahun
        2008, peneliti menggunakan serangan tabrakan untuk memalsukan sertifikat otoritas yang dipercaya
        oleh semua browser utama. MD5 kini secara definitif rusak untuk tujuan keamanan di mana collision
        resistance penting.
      </p>
      <p>
        Di mana MD5 masih dapat diterima:
      </p>
      <ul>
        <li>Pemeriksaan integritas file non-keamanan di mana Anda mengontrol generasi dan verifikasi (mengonfirmasi file tidak rusak dalam transit, bukan bahwa ia tidak dimodifikasi).</li>
        <li>Checksum dalam sistem internal di mana aktor jahat bukan bagian dari model ancaman.</li>
        <li>Kompatibilitas sistem lama di mana Anda tidak punya pilihan selain mencocokkan implementasi yang ada.</li>
        <li>Kunci cache dan hash map di mana keamanan tidak relevan dan kecepatan penting.</li>
      </ul>
      <p>
        Di mana MD5 tidak boleh pernah digunakan: sertifikat TLS, tanda tangan digital, penandatanganan
        kode, atau apa pun di mana penyerang mungkin mendapat manfaat dari menemukan tabrakan.
      </p>

      <h2>SHA-1: 160-Bit, Tidak Direkomendasikan, Masih Ada di Mana-Mana</h2>
      <p>
        SHA-1 (Secure Hash Algorithm 1) diterbitkan oleh NIST pada tahun 1995 dan menghasilkan digest
        160-bit. Ini adalah standar untuk sertifikat TLS, tanda tangan digital, dan penandatanganan
        perangkat lunak sepanjang tahun 2000-an. Project Zero Google mendemonstrasikan tabrakan SHA-1
        praktis pada 2017 (serangan SHAttered), menghasilkan dua file PDF berbeda dengan hash SHA-1 yang
        identik. Ini mengakhiri penggunaan SHA-1 dalam TLS — semua vendor browser utama berhenti menerima
        sertifikat SHA-1 pada tahun yang sama.
      </p>
      <p>
        SHA-1 masih ditemukan di beberapa tempat yang perlu diperhatikan:
      </p>
      <ul>
        <li>
          <strong>Git:</strong> Git secara historis menggunakan SHA-1 untuk mengidentifikasi setiap objek
          dalam repositori — commit, blob, tree, dan tag. Git sedang aktif bermigrasi ke SHA-256 (lihat
          di bawah), tetapi repositori Git SHA-1 tetap sangat umum. Untuk kasus penggunaan ini, collision
          resistance kurang penting karena penyerang memerlukan akses filesystem untuk mengeksploitasi
          tabrakan.
        </li>
        <li>Sistem autentikasi lama dan implementasi HMAC yang lebih tua.</li>
        <li>Beberapa perangkat lunak enterprise lama yang belum diperbarui.</li>
      </ul>
      <p>
        Untuk pekerjaan baru: hindari SHA-1. Gunakan SHA-256 atau SHA-512.
      </p>

      <h2>SHA-256: Standar Saat Ini</h2>
      <p>
        SHA-256 adalah bagian dari keluarga SHA-2, diterbitkan oleh NIST pada tahun 2001. Menghasilkan
        digest 256-bit (32-byte) — dua kali lipat panjang output MD5 dan 60% lebih besar dari SHA-1.
        Tidak ada serangan tabrakan atau preimage praktis terhadap SHA-256 yang telah didemonstrasikan.
        Ini tetap menjadi standar untuk hashing yang sensitif terhadap keamanan pada tahun 2026.
      </p>
      <p>
        SHA-256 digunakan di mana-mana:
      </p>
      <ul>
        <li><strong>Sertifikat TLS:</strong> Forum CA/Browser mewajibkan SHA-256 sebagai minimum untuk tanda tangan sertifikat. Setiap koneksi HTTPS yang Anda buat dikaitkan dengan SHA-256.</li>
        <li><strong>Penandatanganan kode:</strong> macOS, Windows Authenticode, dan manajer paket Linux (APT, RPM) menggunakan SHA-256 untuk memverifikasi integritas perangkat lunak.</li>
        <li><strong>Token JWT:</strong> Algoritma <code>HS256</code> dalam JSON Web Token adalah HMAC-SHA-256. Ini adalah algoritma penandatanganan JWT paling umum dalam sistem yang di-deploy.</li>
        <li><strong>Bitcoin:</strong> Algoritma proof-of-work Bitcoin adalah double-SHA-256 (SHA-256 diterapkan dua kali).</li>
        <li><strong>Git (generasi berikutnya):</strong> Format objek SHA-256 Git (diaktifkan dengan <code>--object-format=sha256</code>) menggunakan SHA-256 untuk semua ID objek.</li>
        <li>Verifikasi integritas file yang diterbitkan bersama unduhan perangkat lunak.</li>
      </ul>
      <p>
        Jika Anda perlu memilih fungsi hash dan tidak memiliki batasan khusus, SHA-256 adalah pilihan
        default yang benar pada tahun 2026.
      </p>

      <h2>SHA-512: Output Lebih Besar, Terkadang Lebih Cepat</h2>
      <p>
        SHA-512 juga merupakan bagian dari keluarga SHA-2 dan menghasilkan digest 512-bit (64-byte).
        Memberikan margin keamanan yang lebih besar dari SHA-256 — 512 bit output berarti ruang serangan
        brute-force teoritis 2<sup>256</sup> kali lebih besar. Dalam praktiknya, margin tambahan ini
        tidak relevan untuk sebagian besar aplikasi karena SHA-256 sudah tidak mungkin dipecahkan secara
        komputasi.
      </p>
      <p>
        Karakteristik performa yang kontra-intuitif: SHA-512 <em>lebih cepat</em> dari SHA-256 pada CPU
        64-bit modern saat melakukan hashing data besar. SHA-512 memproses data dalam blok 1024-bit dengan
        operasi kata 64-bit, sementara SHA-256 menggunakan blok 512-bit dengan operasi 32-bit. Pada
        prosesor 64-bit, operasi 64-bit dipetakan lebih efisien ke hardware. Ini membuat SHA-512 menjadi
        pilihan yang lebih baik untuk aplikasi yang melakukan hashing file besar di server 64-bit.
      </p>
      <p>
        Gunakan SHA-512 ketika:
      </p>
      <ul>
        <li>Anda melakukan hashing sejumlah besar data di hardware 64-bit dan menginginkan throughput maksimum.</li>
        <li>Sistem Anda memerlukan margin keamanan tambahan untuk alasan regulasi atau kepatuhan.</li>
        <li>Anda mengimplementasikan HMAC-SHA-512 (digunakan dalam beberapa implementasi JWT dengan <code>HS512</code>).</li>
      </ul>

      <h2>Tabel Perbandingan Algoritma</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Algoritma</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Panjang Output</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kecepatan (relatif)</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Status Keamanan</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kasus Penggunaan Umum</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>MD5</strong></td>
              <td style={{padding: "12px 16px"}}>128-bit (32 karakter hex)</td>
              <td style={{padding: "12px 16px"}}>Paling cepat</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Rusak</strong> — tabrakan telah didemonstrasikan</td>
              <td style={{padding: "12px 16px"}}>Checksum non-keamanan, kunci cache, sistem lama</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-1</strong></td>
              <td style={{padding: "12px 16px"}}>160-bit (40 karakter hex)</td>
              <td style={{padding: "12px 16px"}}>Cepat</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Tidak Direkomendasikan</strong> — tabrakan praktis ada</td>
              <td style={{padding: "12px 16px"}}>Git lama, TLS lama (tidak direkomendasikan), beberapa auth lama</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-256</strong></td>
              <td style={{padding: "12px 16px"}}>256-bit (64 karakter hex)</td>
              <td style={{padding: "12px 16px"}}>Cepat</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aman</strong> — standar saat ini</td>
              <td style={{padding: "12px 16px"}}>Sertifikat TLS, JWT (HS256), penandatanganan kode, Bitcoin</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-512</strong></td>
              <td style={{padding: "12px 16px"}}>512-bit (128 karakter hex)</td>
              <td style={{padding: "12px 16px"}}>Paling cepat untuk data besar di 64-bit</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Aman</strong> — margin keamanan lebih besar</td>
              <td style={{padding: "12px 16px"}}>Hashing file besar, JWT (HS512), aplikasi keamanan tinggi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Verifikasi Integritas File: Contoh Praktis</h2>
      <p>
        Salah satu penggunaan paling umum dan sah dari hash kriptografi adalah memverifikasi bahwa file
        yang diunduh persis seperti yang dimaksudkan penerbit — tidak rusak dalam transit dan tidak
        dirusak oleh pihak ketiga. Sebagian besar proyek perangkat lunak utama menerbitkan checksum SHA-256
        bersama unduhan mereka.
      </p>
      <p>
        Alur kerja terlihat seperti ini:
      </p>
      <ul>
        <li>Unduh file dari sumber resmi.</li>
        <li>Unduh checksum yang diterbitkan dari sumber resmi yang sama (idealnya ditandatangani dengan PGP).</li>
        <li>Hitung hash SHA-256 dari file yang diunduh.</li>
        <li>Bandingkan hash yang Anda hitung dengan hash yang diterbitkan karakter per karakter. Perbedaan apa pun berarti file bukan yang didistribusikan penerbit.</li>
      </ul>
      <p>
        <a href="/tools/hash-generator">Generator Hash BrowseryTools</a> mendukung hashing file — seret
        file ke dalamnya dan akan menghitung hash secara lokal di browser Anda tanpa mengunggah apa pun.
        Bandingkan hasilnya langsung dengan checksum yang diterbitkan.
      </p>

      <h2>Penyimpanan Kata Sandi: Satu Hal yang Tidak Dapat Dilakukan Hash dengan Aman</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem", color: "#dc2626"}}>
          Peringatan Kritis: Jangan Pernah Menyimpan Kata Sandi Menggunakan Fungsi Hash Biasa
        </p>
        <p style={{marginTop: 0, marginBottom: "12px"}}>
          Menyimpan kata sandi sebagai hash MD5, SHA-256, atau SHA-512 — bahkan dengan salt — tidak aman
          dan merupakan kerentanan serius dalam sistem produksi apa pun. Inilah alasannya:
        </p>
        <ul style={{marginTop: 0, marginBottom: "12px"}}>
          <li>Fungsi hash serba guna dirancang untuk <em>cepat</em>. GPU modern dapat menghitung miliaran hash SHA-256 per detik. Jika database Anda dibobol, penyerang dapat melakukan brute-force setiap kata sandi umum dalam hitungan menit.</li>
          <li>Rainbow table — tabel lookup yang telah dihitung sebelumnya yang memetakan hash ke input — dapat memecahkan hash kata sandi umum yang tidak di-salt dalam milidetik.</li>
          <li>Bahkan dengan salt unik per pengguna, kecepatan mentah SHA-256 memudahkan serangan terhadap kata sandi yang lemah atau menengah dalam skala besar.</li>
        </ul>
        <p style={{marginTop: 0, marginBottom: 0}}>
          <strong>Gunakan fungsi hashing kata sandi sebagai gantinya:</strong> <code>bcrypt</code>,{" "}
          <code>scrypt</code>,
          atau <code>Argon2</code> (pemenang Password Hashing Competition). Ini dirancang untuk sengaja
          lambat dan intensif memori, membuat serangan brute-force jauh lebih mahal secara komputasi.
          Sebagian besar framework modern menyertakannya out of the box. Argon2id adalah rekomendasi
          saat ini untuk sistem baru.
        </p>
      </div>

      <h2>Bagaimana Git Menggunakan SHA-1 (dan Bermigrasi ke SHA-256)</h2>
      <p>
        Git menggunakan fungsi hash untuk mengidentifikasi setiap objek dalam repositori. Setiap commit,
        file (blob), daftar direktori (tree), dan tag disimpan dalam database objek di bawah hash SHA-1-nya.
        Ketika Anda menjalankan{" "}
        <code>git log</code>, string hex panjang yang Anda lihat — seperti{" "}
        <code>c206f4b3a9d72bc0e53a0e1a6e4bdf8c7f9d2e51</code> — adalah hash SHA-1 dari objek commit.
      </p>
      <p>
        Git memilih SHA-1 pada tahun 2005 karena kecepatan dan karena pada saat itu SHA-1 belum rusak.
        Peran hash dalam Git sedikit berbeda dari penggunaan keamanan tradisional: Git menggunakannya
        sebagai kunci penyimpanan content-addressable, bukan sebagai bukti autentikasi. Konten itu sendiri
        yang Anda percaya — hash hanyalah cara efisien untuk mencarinya dan mendeteksi korupsi yang tidak
        disengaja.
      </p>
      <p>
        Setelah tabrakan SHA-1 SHAttered pada 2017, proyek Git mulai bekerja pada transisi ke SHA-256.
        Format objek baru (<code>--object-format=sha256</code>) tersedia di Git 2.29+ dan digunakan
        secara default di beberapa host repositori baru. Repositori yang ada dapat dimigrasikan, meskipun
        transisinya kompleks karena setiap ID objek berubah.
      </p>

      <h2>HMAC: Autentikasi Pesan Berbasis Hash</h2>
      <p>
        Hash biasa memverifikasi integritas data (data tidak berubah) tetapi bukan keaslian (data berasal
        dari orang yang Anda pikir). Jika penyerang dapat mencegat pesan dan menghitung ulang hash setelah
        memodifikasinya, hash biasa tidak memberikan perlindungan.
      </p>
      <p>
        HMAC (Hash-based Message Authentication Code) memecahkan ini dengan memasukkan kunci rahasia ke
        dalam komputasi hash. Hasilnya hanya dapat diproduksi oleh seseorang yang mengetahui kunci.
        Memverifikasi HMAC membuktikan bahwa data utuh dan bahwa itu diproduksi oleh pihak dengan akses
        ke rahasia bersama.
      </p>
      <p>
        HMAC-SHA256 ada di mana-mana:
      </p>
      <ul>
        <li><strong>Token JWT (HS256):</strong> Server menandatangani header dan payload token dengan HMAC-SHA256 menggunakan kunci rahasia. Klien tidak dapat memalsukan token valid tanpa kunci.</li>
        <li><strong>Penandatanganan permintaan API:</strong> AWS Signature Version 4 menggunakan HMAC-SHA256 untuk mengautentikasi permintaan API. Detail permintaan dan kunci penandatanganan yang diturunkan di-hash bersama sehingga keduanya tidak dapat dimodifikasi tanpa membatalkan tanda tangan.</li>
        <li><strong>Integritas cookie:</strong> Banyak framework web menggunakan HMAC untuk menandatangani cookie sesi, mencegah pengguna merusak data sesi mereka sendiri.</li>
      </ul>

      <h2>Cara Menggunakan Generator Hash BrowseryTools</h2>
      <p>
        <a href="/tools/hash-generator">Generator Hash</a> mendukung hashing input teks dan upload file
        sepenuhnya di browser Anda. Berikut cara kerjanya:
      </p>
      <ul>
        <li>
          <strong>Hashing teks:</strong> Tempel teks apa pun ke kolom input. Alat ini segera menghitung
          dan menampilkan hash untuk setiap algoritma yang didukung secara bersamaan — MD5, SHA-1, SHA-256,
          dan SHA-512 — sehingga Anda dapat membandingkannya secara berdampingan dan memilih yang Anda
          butuhkan.
        </li>
        <li>
          <strong>Hashing file:</strong> Klik input file atau seret dan lepas file apa pun. File dibaca
          oleh File API browser Anda dan di-hash secara lokal. File besar diproses dalam potongan untuk
          menghindari tekanan memori. Tidak ada byte file Anda yang meninggalkan perangkat Anda.
        </li>
        <li>
          <strong>Pilih algoritma:</strong> Pilih algoritma spesifik untuk fokus pada kasus penggunaan
          Anda. Digest hex lengkap ditampilkan dan dapat disalin dengan satu klik.
        </li>
        <li>
          <strong>Unduh sebagai file:</strong> Untuk tujuan dokumentasi atau distribusi, ekspor digest
          hash sebagai file teks — berguna untuk menerbitkan checksum bersama rilis perangkat lunak Anda
          sendiri.
        </li>
      </ul>

      <h2>Privasi: Web Crypto API</h2>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Semuanya tetap di perangkat Anda.</strong> Generator Hash BrowseryTools menggunakan API
        bawaan browser <code>window.crypto.subtle</code> (Web Crypto API) untuk menghitung hash keluarga
        SHA. Ini adalah kriptografi native yang diimplementasikan oleh mesin C++ browser Anda — bukan
        matematika JavaScript. Untuk MD5, implementasi JavaScript murni berjalan secara lokal. Dalam
        kedua kasus, tidak ada data — tidak satu byte pun dari teks atau konten file Anda — yang pernah
        dikirimkan ke server BrowseryTools atau layanan pihak ketiga mana pun. Komputasi hash terjadi
        sepenuhnya dalam proses browser Anda.
      </div>

      <h2>Memilih Algoritma yang Tepat: Panduan Keputusan</h2>
      <ul>
        <li><strong>Integritas file / checksum (non-keamanan):</strong> MD5 atau SHA-256. SHA-256 lebih disukai untuk apa pun yang menghadap publik bahkan jika model ancamannya hanya korupsi yang tidak disengaja, karena menggunakan algoritma yang rusak secara sengaja sulit dibenarkan kepada auditor.</li>
        <li><strong>TLS, penandatanganan kode, operasi sertifikat:</strong> SHA-256 (wajib — SHA-1 ditolak).</li>
        <li><strong>Penandatanganan JWT:</strong> HMAC-SHA-256 (HS256) untuk simetris, atau RS256/ES256 untuk asimetris. Jangan pernah MD5 atau SHA-1.</li>
        <li><strong>Penyimpanan kata sandi:</strong> Argon2id, bcrypt, atau scrypt. Bukan SHA-apapun.</li>
        <li><strong>Hashing file besar di server 64-bit:</strong> SHA-512 untuk throughput terbaik.</li>
        <li><strong>Margin keamanan maksimum:</strong> SHA-512 atau SHA-3 (SHA3-256, SHA3-512).</li>
        <li><strong>Kompatibilitas warisan:</strong> Apa pun yang diperlukan sistem warisan — tetapi rencanakan migrasi dari MD5 dan SHA-1.</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Hasilkan hash MD5, SHA-1, SHA-256 dan SHA-512 secara instan
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Tempel teks atau lepas file. Semua hashing terjadi di browser Anda menggunakan Web Crypto API.
          Tidak ada yang diunggah. Tidak ada yang dicatat.
        </p>
        <a
          href="/tools/hash-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Buka Generator Hash →
        </a>
      </div>
    </div>
  );
}
