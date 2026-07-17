import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jika Anda menggunakan kata sandi seperti <code>password123</code>, <code>qwerty</code>, atau nama hewan
        peliharaan Anda diikuti tahun lahir, Anda tidak sendirian — tetapi Anda berada dalam risiko serius. Sebuah studi
        tahun 2023 oleh NordPass menemukan bahwa kata sandi paling umum di dunia masih <strong>"123456"</strong>,
        digunakan oleh lebih dari 4,5 juta orang. Menurut Google, 65% orang menggunakan kembali kata sandi yang sama di
        beberapa situs. Ini adalah kesalahan keamanan terbesar yang bisa Anda lakukan secara online.
      </p>
      <ToolCTA slug="password-strength" variant="inline" />
      <p>
        Panduan ini menjelaskan secara tepat apa yang membuat kata sandi lemah atau kuat, bagaimana penyerang
        membobolnya, dan bagaimana Anda dapat melindungi diri — menggunakan alat gratis yang berjalan sepenuhnya di
        browser Anda tanpa data apa pun yang pernah dikirim ke server.
      </p>

      <h2>Kata Sandi Paling Umum — Apakah Milik Anda Ada di Daftar Ini?</h2>
      <p>
        Setiap tahun, peneliti keamanan menganalisis miliaran kredensial yang bocor dari pelanggaran data. Hasilnya
        secara konsisten mengkhawatirkan. Berikut adalah pelanggar terbesar yang muncul di hampir setiap basis data
        pelanggaran:
      </p>
      <ul>
        <li>123456 / 12345678 / 123456789</li>
        <li>password / password1 / Password123</li>
        <li>qwerty / qwerty123 / qwertyuiop</li>
        <li>iloveyou / letmein / welcome</li>
        <li>admin / root / user / login</li>
        <li>abc123 / 111111 / 000000</li>
        <li>monkey / dragon / master / sunshine</li>
      </ul>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Peringatan:</strong> Jika ada kata sandi Anda yang muncul di daftar ini atau mirip dengannya, segera
        ganti. Kata sandi ini adalah yang pertama dicoba oleh setiap penyerang, dan alat otomatis dapat menguji semuanya
        dalam waktu kurang dari satu detik.
      </div>
      <p>
        Yang sangat berbahaya adalah banyak orang percaya mereka pintar dengan mengganti huruf dengan angka — menulis{" "}
        <code>p@ssw0rd</code> alih-alih <code>password</code>. Penyerang juga tahu trik ini. Alat pembobolan modern
        menyertakan "aturan mangling" yang secara otomatis menerapkan substitusi ini ke setiap kata dalam kamus mereka.
      </p>

      <h2>Apa yang Membuat Kata Sandi Lemah?</h2>
      <p>Kelemahan kata sandi berasal dari keterdugaan. Sebuah kata sandi lemah ketika penyerang dapat menebaknya lebih
        cepat daripada mencoba setiap kemungkinan kombinasi. Penyebab utamanya adalah:</p>

      <h3>1. Panjang yang Pendek</h3>
      <p>
        Panjang adalah faktor terpenting tunggal dalam kekuatan kata sandi. Kata sandi 6 karakter yang hanya menggunakan
        huruf kecil hanya memiliki 308 juta kemungkinan kombinasi — GPU modern dapat menghabiskannya dalam waktu kurang
        dari satu detik. Kata sandi 8 karakter dengan campuran huruf besar/kecil dan angka memiliki 218 triliun
        kombinasi, yang terdengar mengesankan, tetapi perangkat pembobolan modern yang berjalan pada miliaran tebakan per
        detik masih dapat membobolnya dalam hitungan menit.
      </p>

      <h3>2. Kata-kata Kamus</h3>
      <p>
        Kata nyata apa pun dalam bahasa apa pun langsung rentan terhadap serangan kamus. Ini termasuk kata-kata dengan
        substitusi yang jelas (<code>3</code> untuk <code>e</code>, <code>0</code> untuk <code>o</code>, <code>@</code>
        untuk <code>a</code>) dan kata-kata dengan angka yang ditambahkan di akhir (<code>monkey1</code>,{" "}
        <code>dragon99</code>). Penyerang memiliki kamus dengan ratusan juta variasi ini yang sudah dihitung sebelumnya.
      </p>

      <h3>3. Informasi Pribadi</h3>
      <p>
        Nama, tanggal lahir, hari jadi, nama hewan peliharaan, dan tim olahraga favorit adalah bahan kata sandi yang
        sangat umum. Jika penyerang tahu apa pun tentang Anda — hanya dari profil media sosial Anda — mereka dapat
        membuat daftar kata yang ditargetkan dan secara dramatis mengurangi waktu yang dibutuhkan untuk membobol kata
        sandi Anda.
      </p>

      <h3>4. Pola dan Keyboard Walk</h3>
      <p>
        Urutan seperti <code>qwerty</code>, <code>asdfgh</code>, <code>1qaz2wsx</code>, atau <code>zxcvbn</code> adalah
        pola keyboard yang diuji oleh pembobol dalam beberapa detik pertama. Mereka tidak memerlukan kecerdasan tambahan
        untuk ditebak — hanya pengetahuan tentang tata letak keyboard.
      </p>

      <h2>Bagaimana Pembobolan Kata Sandi Sebenarnya Bekerja</h2>
      <p>
        Memahami bagaimana penyerang membobol kata sandi membantu Anda memahami mengapa praktik tertentu benar-benar
        melindungi Anda dan mengapa yang lain hanya terasa aman.
      </p>

      <h3>Serangan Brute Force</h3>
      <p>
        Serangan brute force mencoba setiap kemungkinan kombinasi karakter sampai menemukan yang benar. Untuk kata sandi
        pendek, ini sangat cepat. Untuk yang lebih panjang, waktunya tumbuh secara eksponensial. Kata sandi 12 karakter
        yang menggunakan huruf besar, huruf kecil, angka, dan simbol memiliki sekitar 19 septiliun kemungkinan kombinasi
        — pada satu miliar tebakan per detik, itu akan memakan waktu lebih dari 600 tahun untuk benar-benar menghabiskan
        semuanya. Inilah kekuatan panjang.
      </p>

      <h3>Serangan Kamus</h3>
      <p>
        Alih-alih mencoba setiap kombinasi, serangan kamus menggunakan daftar kata sandi yang diketahui, kata umum, dan
        kredensial yang bocor dari pelanggaran sebelumnya yang sudah dibangun sebelumnya. Daftar kata RockYou saja —
        bocor pada tahun 2009 — berisi 14 juta kata sandi dan masih menjadi titik awal untuk sebagian besar sesi
        pembobolan hari ini. Jika kata sandi Anda pernah digunakan oleh siapa pun sebelumnya dan muncul dalam
        pelanggaran, kata sandi itu ada di suatu kamus.
      </p>

      <h3>Rainbow Table</h3>
      <p>
        Ketika situs web menyimpan kata sandi, mereka seharusnya menyimpannya sebagai hash kriptografis — bukan kata
        sandi yang sebenarnya. Rainbow table adalah tabel pencarian yang sudah dihitung sebelumnya yang memetakan nilai
        hash kembali ke kata sandi asli. Jika sebuah situs menyimpan kata sandi tanpa "salting" pada hash-nya
        (menambahkan nilai acak sebelum hashing), serangan rainbow table dapat memulihkan jutaan kata sandi dalam
        hitungan detik. Inilah mengapa pelanggaran data begitu menghancurkan.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Wawasan utama:</strong> Pembobolan kata sandi telah menjadi komoditas. Ada layanan online tempat Anda
        dapat membayar untuk membobol hash. Perangkat keras yang berharga beberapa ratus dolar dapat menguji miliaran
        kata sandi per detik. Satu-satunya pertahanan nyata adalah kata sandi yang panjang sekaligus benar-benar acak.
      </div>

      <h2>Entropi Kata Sandi: Mengapa Panjang Selalu Menang</h2>
      <p>
        Entropi adalah ukuran ketidakterdugaan, dinyatakan dalam bit. Semakin tinggi entropi, semakin lama waktu yang
        dibutuhkan untuk membobol kata sandi dengan brute force. Berikut cara kerjanya dalam praktik:
      </p>
      <ul>
        <li>Kata sandi yang hanya menggunakan huruf kecil (26 karakter) menambah sekitar 4,7 bit entropi per karakter.</li>
        <li>Menambahkan huruf besar menggandakan set menjadi 52 karakter — 5,7 bit per karakter.</li>
        <li>Menambahkan angka (62 karakter) — 5,95 bit per karakter.</li>
        <li>Menambahkan simbol (95 karakter ASCII yang dapat dicetak) — 6,57 bit per karakter.</li>
      </ul>
      <p>
        Tetapi efek pengganda dari panjang jauh lebih kuat daripada penambahan jenis karakter tunggal apa pun. Kata sandi
        12 karakter yang sepenuhnya acak dari set ASCII yang dapat dicetak penuh memiliki sekitar 79 bit entropi. Pada 16
        karakter, itu menjadi 105 bit — secara efektif tak bisa ditembus dengan teknologi mana pun yang dapat
        diperkirakan.
      </p>

      <h2>Tiga Jenis Kata Sandi yang Digunakan Orang</h2>
      <p>Sebagian besar strategi kata sandi orang termasuk dalam salah satu dari tiga kategori — masing-masing dengan
        kelebihan dan kekurangannya sendiri:</p>

      <h3>Jenis 1: Mudah Diingat, Mudah Dibobol</h3>
      <p>
        Ini adalah kategori <code>fluffy2009!</code> — nama hewan peliharaan, tahun, dan tanda baca. Anda dapat
        mengingatnya tanpa usaha. Penyerang dapat membobolnya dalam waktu kurang dari satu jam dengan daftar kata yang
        layak dan aturan mangling. Kata sandi ini hampir tidak menawarkan perlindungan nyata.
      </p>

      <h3>Jenis 2: Kompleks Tetapi Mustahil Diingat</h3>
      <p>
        Beberapa orang mencoba membuat kata sandi yang benar-benar kompleks dengan menekan keyboard secara acak —{" "}
        <code>xK3#mQ9!pL</code> — tetapi kemudian mereka tidak dapat mengingatnya. Ini mengarah pada menuliskannya di
        catatan tempel, menyimpannya dalam file teks yang tidak terenkripsi, atau hanya mereset-nya terus-menerus.
        Keuntungan keamanan hilang karena penyimpanan yang buruk.
      </p>

      <h3>Jenis 3: Kuat dan Disimpan dengan Benar</h3>
      <p>
        Ini adalah satu-satunya pendekatan yang benar-benar bekerja dalam skala besar. Buat kata sandi yang panjang dan
        sepenuhnya acak dan simpan dalam pengelola kata sandi. Anda hanya perlu mengingat satu kata sandi master yang
        kuat. Sisanya dibuat, disimpan, dan diisikan untuk Anda secara otomatis. Beginilah profesional keamanan
        mengelola ratusan akun.
      </p>

      <h2>Perbandingan Kekuatan Secara Visual</h2>
      <p>Berikut adalah tampilan berdampingan tentang betapa dramatisnya kekuatan kata sandi bervariasi:</p>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kata Sandi</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Panjang</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Set Karakter</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Entropi</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Waktu Pembobolan</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(239,68,68,0.1)", color: "#dc2626", padding: "2px 6px", borderRadius: "4px"}}>password123</code></td>
              <td style={{padding: "12px 16px"}}>11</td>
              <td style={{padding: "12px 16px"}}>Huruf kecil + angka</td>
              <td style={{padding: "12px 16px"}}>~18 bit (kamus)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Seketika</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(245,158,11,0.1)", color: "#d97706", padding: "2px 6px", borderRadius: "4px"}}>P@$$w0rd</code></td>
              <td style={{padding: "12px 16px"}}>8</td>
              <td style={{padding: "12px 16px"}}>Campuran + simbol</td>
              <td style={{padding: "12px 16px"}}>~24 bit (pola)</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Menit hingga jam</strong></td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "2px 6px", borderRadius: "4px"}}>v8K#mX2qLn&amp;4jR7</code></td>
              <td style={{padding: "12px 16px"}}>16</td>
              <td style={{padding: "12px 16px"}}>ASCII penuh acak</td>
              <td style={{padding: "12px 16px"}}>~105 bit</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Miliaran tahun</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Perbedaan antara kata sandi pertama dan ketiga bukan hanya bertahap — ini adalah perbedaan antara tidak ada
        perlindungan dan keamanan yang hampir tak bisa ditembus. Dan Anda tidak perlu mengingat{" "}
        <code>v8K#mX2qLn&amp;4jR7</code> — pengelola kata sandi Anda melakukannya untuk Anda.
      </p>

      <h2>Periksa Kekuatan Kata Sandi Anda Saat Ini Secara Instan</h2>
      <p>
        Sebelum Anda mengubah apa pun, ada baiknya memahami secara tepat seberapa kuat kata sandi Anda saat ini.
        BrowseryTools menawarkan pemeriksa kekuatan kata sandi gratis dan privat yang menganalisis kata sandi Anda secara
        lokal — karakter yang Anda ketik tidak pernah meninggalkan browser Anda.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Coba sekarang:</strong> Buka{" "}
        <a href="/tools/password-strength">Pemeriksa Kekuatan Kata Sandi BrowseryTools</a> untuk melihat secara tepat
        skor kata sandi Anda. Alat ini memeriksa panjang, keragaman karakter, pola umum, dan kecocokan kamus — dan
        memberi tahu Anda berapa lama realistisnya untuk membobolnya.
      </div>
      <p>
        Pemeriksa ini memberi Anda skor yang jelas dengan penjelasan tentang apa yang lemah dan apa yang perlu
        diperbaiki. Ini adalah cara tercepat untuk mendapatkan audit jujur atas kata sandi yang sudah Anda gunakan.
      </p>

      <h2>Buat Kata Sandi Kuat dengan Satu Klik</h2>
      <p>
        Mengetahui seperti apa kata sandi yang kuat dan benar-benar membuatnya adalah dua masalah yang berbeda. Otak
        manusia terkenal buruk dalam menghasilkan keacakan — kita selalu kembali ke pola, kata-kata yang familier, dan
        struktur yang dapat diduga. Solusinya adalah membiarkan mesin menghasilkan keacakan untuk Anda.
      </p>
      <p>
        <a href="/tools/password-generator">Generator Kata Sandi BrowseryTools</a> membuat kata sandi acak secara
        kriptografis menggunakan generator nomor acak aman bawaan browser Anda. Anda dapat menyesuaikan:
      </p>
      <ul>
        <li>Panjang kata sandi (hingga 128 karakter)</li>
        <li>Set karakter yang disertakan: huruf besar, huruf kecil, angka, simbol</li>
        <li>Pengecualian karakter yang ambigu (seperti <code>0</code>, <code>O</code>, <code>l</code>, <code>1</code>) agar lebih mudah disalin secara manual</li>
        <li>Jumlah kata sandi yang dibuat sekaligus</li>
      </ul>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Jaminan privasi:</strong> Generator kata sandi BrowseryTools berjalan sepenuhnya di browser Anda
        menggunakan Web Crypto API. Tidak ada kata sandi yang pernah dikirim ke server mana pun. Pembuatan terjadi di
        perangkat Anda, hanya untuk mata Anda.
      </div>

      <h2>Mengapa Anda Membutuhkan Pengelola Kata Sandi</h2>
      <p>
        Keberatan nomor satu terhadap penggunaan kata sandi yang kuat adalah daya ingat. "Saya tidak bisa mengingat 30
        string acak 20 karakter yang berbeda." Anda benar — dan Anda seharusnya tidak perlu. Itulah tepatnya untuk apa
        pengelola kata sandi ada.
      </p>
      <p>
        Pengelola kata sandi adalah brankas terenkripsi yang menyimpan semua kata sandi Anda. Anda membukanya dengan satu
        kata sandi master yang kuat (satu-satunya yang perlu Anda hafal), dan ia menangani segalanya:
      </p>
      <ul>
        <li>Menyimpan kata sandi tak terbatas secara aman dengan enkripsi end-to-end</li>
        <li>Mengisi otomatis formulir login di browser Anda</li>
        <li>Membuat kata sandi kuat baru saat Anda membuat akun</li>
        <li>Memberi tahu Anda saat kata sandi telah terungkap dalam pelanggaran yang diketahui</li>
        <li>Menyinkronkan di semua perangkat Anda secara aman</li>
      </ul>
      <p>
        Opsi populer termasuk Bitwarden (sumber terbuka dan gratis), 1Password, dan KeePass (sepenuhnya lokal). Yang
        penting adalah menggunakan salah satunya — peningkatan keamanan dibandingkan tanpa pengelola sangat besar.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Wawasan utama:</strong> Dengan pengelola kata sandi, Anda dapat menggunakan kata sandi 20 karakter yang
        berbeda dan sepenuhnya acak di setiap situs. Jika satu situs dibobol, hanya satu akun itu yang terkompromikan —
        bukan setiap akun yang Anda miliki.
      </div>

      <h2>Autentikasi Dua Faktor: Mengapa Kata Sandi Saja Tidak Cukup</h2>
      <p>
        Bahkan kata sandi terkuat pun memiliki satu kerentanan mendasar: kata sandi itu dapat dicuri tanpa dibobol.
        Serangan phishing, keylogger, serangan man-in-the-middle, dan pelanggaran data dapat mengungkap kata sandi Anda
        tanpa brute force apa pun. Begitu penyerang memiliki kata sandi Anda, panjang dan kompleksitas menjadi tidak
        relevan.
      </p>
      <p>
        Autentikasi dua faktor (2FA) menambahkan lapisan kedua yang melindungi Anda bahkan jika kata sandi Anda
        terkompromikan. Bentuk umum meliputi:
      </p>
      <ul>
        <li><strong>Aplikasi TOTP</strong> (Google Authenticator, Authy): Membuat kode 6 digit yang berubah setiap 30 detik. Bahkan dengan kata sandi Anda, penyerang tidak dapat masuk tanpa kode saat ini.</li>
        <li><strong>Kunci perangkat keras</strong> (YubiKey): Perangkat fisik yang Anda colokkan atau tempelkan. Tahan phishing karena kunci memverifikasi domain situs sebelum melakukan autentikasi.</li>
        <li><strong>Kode SMS</strong>: Lebih baik daripada tidak ada, tetapi rentan terhadap serangan SIM-swapping. Gunakan aplikasi autentikator sebagai gantinya bila memungkinkan.</li>
      </ul>
      <p>
        Aktifkan 2FA di setiap akun yang mendukungnya — terutama email, perbankan, penyimpanan cloud, dan media sosial.
        Kata sandi yang kuat ditambah 2FA membuat akses tidak sah sangat sulit bahkan untuk penyerang dengan sumber daya
        besar.
      </p>

      <h2>Daftar Periksa Keamanan Kata Sandi yang Lengkap</h2>
      <ul>
        <li>Gunakan minimal 16 karakter untuk setiap kata sandi</li>
        <li>Gunakan kata sandi yang berbeda di setiap situs dan layanan</li>
        <li>Jangan pernah menggunakan kata kamus, nama, atau informasi pribadi</li>
        <li>Gunakan pengelola kata sandi untuk membuat dan menyimpan semua kata sandi</li>
        <li>Aktifkan autentikasi dua faktor di mana pun tersedia</li>
        <li>Periksa kata sandi Anda yang ada dengan pemeriksa kekuatan hari ini</li>
        <li>Periksa apakah email Anda telah muncul dalam pelanggaran yang diketahui (haveibeenpwned.com)</li>
        <li>Jangan pernah membagikan kata sandi melalui email, teks, atau aplikasi pesan</li>
      </ul>

      <h2>Mulai Sekarang Juga — Hanya Butuh 2 Menit</h2>
      <p>
        Anda tidak perlu merombak semuanya sekaligus. Mulailah dengan akun paling penting Anda: email, perbankan, dan
        media sosial utama Anda. Ganti kata sandi tersebut terlebih dahulu menggunakan Generator Kata Sandi
        BrowseryTools, lalu periksa kekuatan apa yang sudah Anda miliki menggunakan Pemeriksa Kekuatan Kata Sandi.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Alat Kata Sandi Gratis — Tanpa Pendaftaran, Tanpa Berbagi Data
        </p>
        <div style={{display: "flex", gap: "12px", flexWrap: "wrap" as const, justifyContent: "center"}}>
          <a
            href="/tools/password-strength"
            style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Periksa Kekuatan Kata Sandi →
          </a>
          <a
            href="/tools/password-generator"
            style={{background: "rgba(34,197,94,0.9)", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
          >
            Buat Kata Sandi Kuat →
          </a>
        </div>
      </div>
      <p>
        Kedua alat berjalan sepenuhnya di browser Anda. Kata sandi Anda tidak pernah dikirim, dicatat, atau disimpan di
        mana pun di luar perangkat Anda sendiri. Itulah janji BrowseryTools — alat canggih yang benar-benar menghormati
        privasi Anda.
      </p>
      <ToolCTA slug="password-strength" variant="card" />
    </div>
  );
}
