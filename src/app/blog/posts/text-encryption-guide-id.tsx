export default function Content() {
  return (
    <div>
      <p>
        Ketika kamu mengetik pesan ke dalam aplikasi catatan atau formulir web, ke mana perginya?
        Dalam kebanyakan kasus, teks tersebut bepergian ke server, disimpan dalam database, dan
        berpotensi dibaca oleh siapa saja yang memiliki akses database — karyawan perusahaan,
        penyerang pelanggaran data, atau subpoena pemerintah. Enkripsi sisi klien adalah pendekatan
        teknis yang mengubah persamaan ini: datamu dienkripsi sebelum meninggalkan perangkatmu,
        sehingga bahkan server yang menyimpannya pun tidak dapat membacanya.
      </p>
      <p>
        Kamu bisa mengenkripsi dan mendekripsi teks apa pun langsung di browsermu menggunakan{" "}
        <a href="/tools/text-encryption">BrowseryTools Text Encryption tool</a> — gratis, tanpa
        daftar, datamu tidak pernah meninggalkan perangkatmu.
      </p>

      <h2>Apa Arti Enkripsi Sisi Klien Sebenarnya</h2>
      <p>
        Enkripsi sisi klien berarti operasi kriptografi (mengenkripsi dan mendekripsi data) terjadi
        di perangkat pengguna — di browser, di aplikasi mobile, atau di aplikasi desktop — sebelum
        data apa pun dikirimkan atau disimpan. Server hanya menerima ciphertext: urutan byte yang
        tidak dapat dibaca dan diacak yang secara matematis tidak berguna tanpa kunci dekripsi.
      </p>
      <p>
        Ini secara bermakna berbeda dari enkripsi sisi server (juga disebut "encryption at rest"),
        di mana server menerima data plaintextmu dan kemudian mengenkripsinya untuk penyimpanan
        menggunakan kunci yang dikontrol server itu sendiri. Dalam model itu, penyedia layanan
        selalu dapat mendekripsi datamu. Dengan enkripsi sisi klien, hanya seseorang yang memegang
        kunci — yang tidak pernah meninggalkan perangkatmu — yang dapat membaca data.
      </p>
      <p>
        Implikasi praktisnya: jika seseorang meretas server dan mencuri data yang dienkripsi,
        mereka tidak mendapatkan apa pun yang berguna. Ciphertext memerlukan kunci untuk didekripsi,
        dan kunci tersebut tidak pernah ada di server.
      </p>

      <h2>Enkripsi Simetris vs Asimetris</h2>
      <p>
        Ada dua pendekatan fundamental untuk enkripsi, dan keduanya melayani tujuan yang berbeda.
      </p>
      <ul>
        <li>
          <strong>Enkripsi simetris (AES)</strong> — satu kunci mengenkripsi data, dan kunci yang
          sama mendekripsinya. Cepat, efisien, dan cocok untuk mengenkripsi data dalam jumlah
          besar. Tantangannya adalah distribusi kunci: bagaimana cara berbagi kunci secara aman
          dengan siapa pun yang perlu mendekripsi data? Untuk penggunaan pribadi (mengenkripsi
          catatan sendiri), enkripsi simetris sangat ideal — kamu memegang satu-satunya kunci.
          AES (Advanced Encryption Standard) adalah algoritma simetris yang dominan.
        </li>
        <li>
          <strong>Enkripsi asimetris (RSA, ECDH)</strong> — dua kunci yang terhubung secara
          matematis: kunci publik yang dapat digunakan siapa saja untuk mengenkripsi data, dan
          kunci privat yang hanya dipegang pemilik, digunakan untuk dekripsi. Memecahkan masalah
          distribusi kunci — kamu dapat berbagi kunci publik secara terbuka. Jauh lebih lambat
          dari enkripsi simetris untuk data besar. Sebagian besar sistem dunia nyata menggunakan
          enkripsi asimetris hanya untuk bertukar kunci simetris, kemudian beralih ke AES untuk
          data massal. Beginilah cara kerja TLS (HTTPS).
        </li>
      </ul>

      <h2>Mengapa AES-256 Adalah Standar</h2>
      <p>
        AES-256 berarti AES dengan kunci 256-bit. Ukuran kunci 256-bit berarti ada 2<sup>256</sup>{" "}
        kemungkinan kunci — angka yang sangat besar sehingga brute-force tidak mungkin dilakukan
        secara komputasi dengan teknologi apa pun yang ada atau secara teoritis mungkin dengan
        komputer klasik. Untuk perspektif: jika setiap atom di alam semesta yang dapat diamati
        adalah komputer, memeriksa satu miliar kunci per detik, itu masih membutuhkan waktu lebih
        lama dari usia alam semesta untuk menghabiskan semua 2<sup>256</sup> kunci.
      </p>
      <p>
        AES juga merupakan standar NIST (US National Institute of Standards and Technology), telah
        dianalisis secara kriptografis secara ekstensif selama beberapa dekade tanpa kelemahan
        praktis yang ditemukan dalam algoritma itu sendiri, dan memiliki akselerasi perangkat keras
        (instruksi AES-NI) di hampir setiap CPU modern — menjadikannya opsi yang paling aman
        sekaligus tercepat yang tersedia. AES-GCM (Galois/Counter Mode) adalah varian yang
        direkomendasikan karena menyediakan enkripsi dan autentikasi sekaligus (mendeteksi apakah
        ciphertext telah dirusak).
      </p>

      <h2>Derivasi Kunci dari Password</h2>
      <p>
        AES-256 memerlukan kunci 256-bit (32-byte). Password yang dipilih manusia bukan 32 byte
        acak — mereka adalah string pendek dengan pola dan set karakter yang terbatas. Menggunakan
        password langsung sebagai kunci AES akan menjadi sangat tidak aman. Key derivation
        function (KDF) menjembatani kesenjangan ini.
      </p>
      <p>
        KDF mengambil password dan menghasilkan kunci kriptografi yang kuat dengan panjang berapa
        pun yang diinginkan. Tiga KDF yang paling penting adalah:
      </p>
      <ul>
        <li>
          <strong>PBKDF2 (Password-Based Key Derivation Function 2)</strong> — menerapkan fungsi
          HMAC ribuan atau ratusan ribu kali (iterasi) ke password. Lebih banyak iterasi berarti
          lebih banyak pekerjaan komputasi bagi penyerang yang mencoba brute-force password.
          PBKDF2 adalah KDF yang paling banyak didukung dan digunakan dalam keamanan Wi-Fi WPA2,
          enkripsi perangkat iOS, dan banyak sistem autentikasi web.
        </li>
        <li>
          <strong>bcrypt</strong> — dirancang khusus untuk hashing password dengan komputasi yang
          sengaja lambat. Memiliki "cost factor" yang mengontrol seberapa lambatnya. Banyak
          digunakan untuk menyimpan password pengguna di database tetapi biasanya tidak digunakan
          untuk menurunkan kunci AES.
        </li>
        <li>
          <strong>scrypt</strong> — menambahkan memory hardness di atas biaya komputasi. Penyerang
          yang menggunakan perangkat keras khusus (ASIC atau GPU) dapat menjalankan PBKDF2 dengan
          murah secara paralel; scrypt memerlukan memori yang sangat banyak per komputasi sehingga
          serangan paralel menjadi mahal. Digunakan dalam beberapa sistem cryptocurrency dan
          aplikasi keamanan yang lebih baru.
        </li>
      </ul>
      <p>
        Semua sistem enkripsi yang baik juga menggunakan <strong>salt</strong> — nilai acak yang
        digabungkan dengan password sebelum derivasi kunci, sehingga dua pengguna dengan password
        yang sama menghasilkan kunci yang berbeda, dan serangan "rainbow table" yang telah dihitung
        sebelumnya digagalkan.
      </p>

      <h2>Apa Arti "Server Tidak Melihat Datamu" Sebenarnya</h2>
      <p>
        Ketika alat mengklaim "server tidak melihat datamu," ini berarti plaintext tidak pernah
        meninggalkan browsermu. JavaScript yang berjalan di browsermu melakukan enkripsi secara
        lokal, dan hanya ciphertext (output yang dienkripsi) yang akan pernah dikirimkan — dan
        hanya jika kamu memilih untuk mengirimkannya.
      </p>
      <p>
        <a href="/tools/text-encryption">BrowseryTools Text Encryption tool</a> lebih jauh lagi:
        tidak ada yang dikirimkan sama sekali. Seluruh operasi bersifat lokal. Kamu dapat
        memverifikasi ini dengan membuka Developer Tools browser, beralih ke tab Network, dan
        mengamati bahwa tidak ada request yang dibuat saat kamu mengenkripsi atau mendekripsi.
        Alat ini menggunakan Web Crypto API — perpustakaan kriptografi bawaan browser yang ada
        di setiap browser modern — yang berarti kriptografinya bukan kode JavaScript kustom;
        itu adalah implementasi tepercaya yang sama yang digunakan browsermu untuk koneksi HTTPS.
      </p>

      <h2>Kesalahpahaman Umum tentang Enkripsi Browser</h2>
      <ul>
        <li>
          <strong>"HTTPS sudah mengenkripsi semuanya"</strong> — HTTPS mengenkripsi data dalam
          transit antara browser dan server. Setelah data mencapai server, data didekripsi dan
          disimpan dalam plaintext (atau dienkripsi ulang dengan kunci yang dikontrol server).
          Enkripsi sisi klien melindungi data dari server itu sendiri, bukan hanya dari
          intersepsi jaringan.
        </li>
        <li>
          <strong>"JavaScript bisa diubah untuk mencuri dataku"</strong> — benar untuk aplikasi
          web apa pun. Inilah mengapa alat sumber terbuka yang telah diaudit lebih disukai
          daripada yang tidak transparan untuk kasus penggunaan sensitif. Untuk keamanan maksimum,
          unduh alat tersebut dan jalankan secara offline.
        </li>
        <li>
          <strong>"Enkripsi browser itu lemah"</strong> — enkripsi browser menggunakan Web Crypto
          API dan AES-256-GCM adalah algoritma yang sama yang digunakan oleh software keamanan
          enterprise dan enkripsi full-disk sistem operasi. Algoritmanya tidak lebih lemah karena
          berjalan di browser.
        </li>
        <li>
          <strong>"Jika saya lupa password, data dapat dipulihkan"</strong> — tidak bisa. Enkripsi
          sisi klien tidak menyediakan mekanisme pemulihan. Data secara matematis tidak dapat
          dipulihkan tanpa kunci. Ini adalah fitur, bukan bug — tetapi memerlukan manajemen kunci
          yang hati-hati.
        </li>
      </ul>

      <h2>Kasus Penggunaan Praktis</h2>
      <ul>
        <li><strong>Mengenkripsi catatan sensitif</strong> — informasi medis, detail akun keuangan, atau entri jurnal pribadi yang ingin kamu simpan di aplikasi catatan cloud tanpa mempercayai penyedia</li>
        <li><strong>Melindungi teks sensitif dalam dokumen</strong> — menyematkan kredensial atau rahasia yang dienkripsi dalam dokumen yang akan dibagikan, di mana hanya penerima yang mengetahui password yang dapat membacanya</li>
        <li><strong>Mengirim pesan pribadi melalui saluran publik</strong> — enkripsi pesan, bagikan ciphertext di saluran publik, dan bagikan password melalui saluran privat terpisah</li>
        <li><strong>Backup aman</strong> — mengenkripsi data yang diekspor sebelum menyimpannya di layanan backup yang tidak dipercaya</li>
      </ul>

      <h2>Keterbatasan Enkripsi Sisi Klien</h2>
      <p>
        Enkripsi sisi klien powerful tetapi bukan solusi keamanan yang lengkap:
      </p>
      <ul>
        <li><strong>Password yang lemah mengalahkan enkripsi yang kuat</strong> — AES-256 dengan password "hello123" memberikan hampir tidak ada perlindungan terhadap penyerang yang bertekad yang dapat menjalankan dictionary attack</li>
        <li><strong>Kompromi perangkat</strong> — jika penyerang mengendalikan perangkatmu (malware, keylogger), mereka dapat menangkap data sebelum dienkripsi atau mengintersepsi kunci</li>
        <li><strong>Tidak ada berbagi tanpa pertukaran kunci</strong> — berbagi data yang dienkripsi dengan orang lain memerlukan berbagi kunci secara aman, yang merupakan masalah tersendiri</li>
        <li><strong>Tidak ada pencarian atau pengindeksan</strong> — data yang dienkripsi tidak dapat dicari, diurutkan, atau diproses tanpa mendekripsinya terlebih dahulu</li>
      </ul>
    </div>
  );
}
