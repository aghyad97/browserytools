import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Perangkat lunak perekam layar secara historis adalah salah satu alat di mana Anda membayar harga
        premium untuk sesuatu yang rasanya seharusnya menjadi utilitas dasar. Camtasia berharga sekitar
        $300 sebagai pembelian satu kali, atau $170/tahun berlangganan. ScreenFlow untuk Mac berharga
        $150. Loom — yang memposisikan dirinya sebagai opsi ringan — membatasi pengguna gratis hingga
        rekaman 5 menit dan mendorong semua orang ke paket berbayar. Dan setiap alat ini memerlukan
        instalasi, pembuatan akun, dan mempercayai aplikasi pihak ketiga dengan akses ke seluruh layar Anda.
      </p>
      <p>
        Inilah yang kebanyakan orang tidak sadari: browser Anda sudah tahu cara merekam layar Anda.
        <strong>Screen Capture API</strong> (<code>getDisplayMedia</code>) adalah standar W3C yang telah
        dikirimkan di setiap browser utama selama bertahun-tahun.{" "}
        <Link href="/tools/screen-recorder">Perekam Layar BrowseryTools</Link> menempatkan antarmuka yang
        bersih dan praktis di atasnya — sehingga Anda dapat merekam layar, jendela tertentu, atau tab
        browser tunggal tanpa menginstal apa pun, membuat akun, atau mengeluarkan uang sepeser pun.
      </p>

      <h2>Kompatibilitas Browser: Ini Bekerja untuk 98%+ Pengguna Anda</h2>
      <p>
        Screen Capture API memiliki dukungan luas di semua browser modern. Anda tidak perlu khawatir
        tentang kompatibilitas untuk audiens yang realistis:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Browser</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Versi Minimum</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Tahun Rilis</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Chrome", "72+", "2019", "Dukungan penuh termasuk tab capture"],
              ["Edge", "79+", "2020", "Berbasis Chromium; dukungan sama seperti Chrome"],
              ["Firefox", "66+", "2019", "Dukungan penuh; audio capture yang bagus"],
              ["Safari", "13+", "2019", "Didukung; tab capture ditambahkan di Safari 15.4"],
            ].map(([browser, version, year, notes], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{browser}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace"}}>{version}</td>
                <td style={{padding: "11px 16px"}}>{year}</td>
                <td style={{padding: "11px 16px", opacity: 0.8}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Gabungan pangsa pasar browser untuk versi ini mencakup lebih dari 98% pengguna desktop di seluruh
        dunia. Untuk tujuan praktis, jika audiens Anda menggunakan browser modern — yang hampir pasti mereka
        lakukan — Screen Capture API hanya berfungsi.
      </p>

      <h2>Apa yang Dapat Anda Rekam</h2>
      <p>
        Ketika Anda mengklik "Mulai Merekam," browser menampilkan pemilih layar native-nya. Anda diberikan
        tiga mode capture, dan pilihannya penting tergantung kasus penggunaan Anda:
      </p>
      <ul>
        <li>
          <strong>Seluruh layar:</strong> Merekam semua yang terlihat di salah satu monitor Anda. Terbaik
          untuk demo di mana Anda berpindah antara beberapa aplikasi, atau ketika Anda ingin menampilkan
          perilaku tingkat sistem. Perhatikan bahwa ini menampilkan segalanya — termasuk notifikasi, taskbar,
          dan jendela lainnya — jadi tutup konten sensitif sebelum merekam.
        </li>
        <li>
          <strong>Jendela aplikasi tertentu:</strong> Merekam hanya satu jendela, bahkan jika jendela lain
          tumpang tindih. Rekaman tetap fokus pada aplikasi tersebut. Bagus untuk demo perangkat lunak di
          mana Anda ingin tetap berada dalam satu aplikasi tanpa mengungkapkan jendela terbuka lainnya.
        </li>
        <li>
          <strong>Tab browser tunggal:</strong> Ini adalah opsi yang paling menjaga privasi. Hanya konten
          satu tab browser yang direkam — tab lain, address bar, aplikasi lain, dan desktop Anda sepenuhnya
          dikecualikan dari rekaman. Ideal untuk merekam walkthrough aplikasi web atau demo berbasis browser
          tanpa menampilkan hal lain.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Tab capture untuk privasi maksimum:</strong> Jika Anda merekam demo aplikasi web dan tidak
        ingin menampilkan tab browser lain, aplikasi lain, atau UI sistem apa pun, gunakan opsi "Tab Browser"
        dalam pemilih layar. Hanya konten piksel dari satu tab tersebut yang direkam. Tidak ada yang lain
        di mesin Anda yang terlihat dalam rekaman.
      </div>

      <h2>Langkah demi Langkah: Cara Menggunakan Perekam Layar BrowseryTools</h2>
      <p>
        Seluruh proses membutuhkan kurang dari satu menit untuk rekaman pertama Anda. Berikut cara
        kerjanya secara tepat:
      </p>
      <ol>
        <li>
          <strong>Buka alatnya:</strong> Pergi ke <Link href="/tools/screen-recorder">/tools/screen-recorder</Link>.
          Tidak perlu login, tidak perlu setup, tidak ada yang perlu diinstal. Alat siap begitu halaman dimuat.
        </li>
        <li>
          <strong>Klik "Mulai Merekam":</strong> Browser segera menampilkan dialog pemilih layar native-nya.
          Ini adalah UI tingkat browser — situs web tidak dapat melihat atau memengaruhi apa yang ditampilkan
          dalam dialog ini, dan tidak dapat mulai merekam sampai Anda secara eksplisit mengonfirmasi pilihan
          Anda.
        </li>
        <li>
          <strong>Pilih apa yang akan direkam:</strong> Pilih "Seluruh Layar," "Jendela," atau "Tab Browser"
          dari tab pemilih. Klik thumbnail layar/jendela/tab yang ingin Anda rekam, lalu klik tombol "Bagikan"
          untuk memulai.
        </li>
        <li>
          <strong>Rekam:</strong> Alat ini menampilkan penghitung waktu yang telah berlalu secara langsung
          sehingga Anda selalu tahu berapa lama Anda telah merekam. Beralih ke aplikasi atau konten apa pun
          yang Anda demo — tab browser yang menjalankan perekam tetap aktif di latar belakang. Anda dapat
          memeriksa timer dengan melirik ke tab.
        </li>
        <li>
          <strong>Klik "Hentikan Merekam":</strong> Selesai, klik Stop. Rekaman segera tersedia sebagai
          pratinjau video di dalam alat. Tidak ada pemrosesan, tidak ada penantian — muncul segera karena
          semuanya direkam secara lokal dalam memori.
        </li>
        <li>
          <strong>Pratinjau dan unduh:</strong> Tonton pratinjau untuk mengonfirmasi rekaman menangkap apa
          yang Anda maksudkan. Klik "Unduh" untuk menyimpan file sebagai video <code>.webm</code> ke mesin
          lokal Anda. Rekaman tidak pernah diunggah ke mana pun.
        </li>
      </ol>

      <h2>Format Output: WebM</h2>
      <p>
        Screen Capture API menghasilkan video dalam format <strong>WebM</strong> menggunakan codec VP8 atau
        VP9 (tergantung mana yang dipilih browser Anda). WebM adalah format terbuka dan bebas royalti yang
        dikembangkan oleh Google dan distandarisasi untuk penggunaan web. Untuk screencast khususnya,
        memiliki beberapa keunggulan dibandingkan MP4:
      </p>
      <ul>
        <li>
          <strong>Ukuran file lebih kecil:</strong> Kompresi VP9 sangat efisien untuk konten layar dengan
          area warna datar yang besar, teks, dan elemen UI — persis yang dikandung screencast. Screencast
          5 menit dalam WebM biasanya 30–50% lebih kecil dari rekaman yang sama dalam H.264 MP4.
        </li>
        <li>
          <strong>Standar terbuka:</strong> Tidak ada biaya lisensi, tidak ada pembayaran royalti, tidak ada
          paten. WebM adalah format video native untuk web.
        </li>
        <li>
          <strong>Pemutaran browser langsung:</strong> WebM diputar secara native di Chrome, Firefox, dan
          Edge tanpa plugin apa pun. Anda dapat berbagi file WebM dan siapa pun di browser tersebut dapat
          menontonnya langsung.
        </li>
      </ul>
      <p>
        <strong>Mengonversi WebM ke MP4:</strong> Jika Anda perlu berbagi rekaman dengan seseorang yang
        menggunakan QuickTime di macOS atau Windows Media Player — atau mengunggahnya ke platform yang tidak
        menerima WebM — Anda dapat mengonversinya secara gratis menggunakan alat lokal seperti{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer">HandBrake</a> (open
        source, pemrosesan lokal) atau menggunakan command line FFmpeg. Konversi membutuhkan beberapa detik
        dan MP4 yang dihasilkan kompatibel secara universal.
      </p>

      <div style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6", margin: "16px 0"}}>
        <pre style={{margin: 0}}><code>{`# Satu baris FFmpeg untuk mengonversi WebM ke MP4 (gratis, lokal, tidak perlu upload):
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4`}</code></pre>
      </div>

      <h2>Kasus Penggunaan: Kapan Perekam Browser Tepat untuk Anda</h2>

      <h3>Laporan Bug</h3>
      <p>
        Mendeskripsikan bug dalam teks adalah salah satu pengalaman paling frustasi dalam pengembangan
        perangkat lunak. "Tidak berfungsi ketika saya mengklik tombol" hampir tidak berguna. Rekaman layar
        30 detik dari langkah-langkah tepat untuk mereproduksi — menampilkan apa yang Anda klik, apa yang
        terjadi, apa yang seharusnya terjadi — memberi insinyur semua yang mereka butuhkan untuk segera
        mendiagnosis masalah. Rekam bug saat terjadi, unduh WebM, dan lampirkan ke tiket. Tidak ada upload
        ke layanan pihak ketiga, tidak ada batasan ukuran di Jira atau Linear, dan tidak ada kekhawatiran
        privasi tentang apa yang terlihat di layar Anda selama rekaman.
      </p>

      <h3>Pembuatan Tutorial Tanpa Perangkat Lunak Berat</h3>
      <p>
        Tidak setiap tutorial membutuhkan produksi profesional. Jika Anda mendokumentasikan proses untuk
        tim Anda — cara mengonfigurasi alat, cara menavigasi alur kerja yang kompleks, cara menyiapkan
        lingkungan — rekaman layar dengan narasi menangkapnya dalam hitungan menit. Perekam BrowseryTools
        memungkinkan Anda menyertakan audio mikrofon (berikan izin browser saat diminta), sehingga Anda
        dapat bernarasi sambil bekerja. Hasilnya adalah tutorial lengkap yang berdiri sendiri dalam satu
        file yang dapat diunduh.
      </p>

      <h3>Tinjauan Kode</h3>
      <p>
        Komentar teks dalam pull request sering tidak cukup untuk umpan balik yang bernuansa. Rekaman layar
        di mana Anda menelusuri diff secara verbal — "di sini di baris 42, saya khawatir tentang ini
        karena..." — jauh lebih efisien daripada menulis komentar lima paragraf. Rekam walkthrough 3 menit
        PR, unduh, dan posting sebagai lampiran atau bagikan file. Peninjau Anda mendapatkan konteks
        penuh dari pemikiran Anda tanpa pertemuan.
      </p>

      <h3>Demo Remote dan Komunikasi Asinkron</h3>
      <p>
        Daripada menjadwalkan pertemuan untuk mendem fitur, rekam saja. Rekaman 2 menit yang menampilkan
        fitur yang berfungsi sering lebih persuasif dan efisien daripada demo langsung, karena dapat
        ditonton kapan saja, diputar ulang sesuai kebutuhan, dan dibagikan kepada siapa pun dalam organisasi.
        Rekam demo Anda sebelumnya, tinjau, dan kirimkan ketika sudah siap. Tidak ada penjadwalan, tidak
        ada konflik zona waktu, tidak ada hambatan "bisakah Anda berbagi layar".
      </p>

      <h3>Tiket Dukungan</h3>
      <p>
        Untuk tim dukungan atau help desk internal, rekaman layar yang diajukan bersama tiket dukungan
        mengurangi bolak-balik secara dramatis. Alih-alih mengajukan sepuluh pertanyaan klarifikasi kepada
        pengguna tentang apa yang mereka lakukan saat masalah terjadi, mereka merekam persis apa yang
        terjadi. Agen dukungan melihat masalah secara langsung, sering langsung menyelesaikannya, dan
        pengguna mendapatkan jawaban yang lebih cepat.
      </p>

      <h2>Audio: Menyertakan Mikrofon dalam Rekaman Anda</h2>
      <p>
        Saat Anda mulai merekam, browser akan menanyakan apakah akan menyertakan audio. Jika Anda ingin
        mengomentari rekaman, izinkan akses mikrofon saat diminta. Suara Anda akan direkam bersama screen
        capture dalam file WebM yang sama — tidak ada trek audio terpisah untuk disinkronkan, tidak ada
        perangkat lunak tambahan yang diperlukan.
      </p>
      <p>
        Jika Anda ingin merekam audio sistem (suara yang keluar dari komputer Anda — musik, suara notifikasi,
        audio aplikasi), ini ditangani secara berbeda di berbagai browser. Chrome di Windows mengizinkan
        capture audio sistem saat merekam tab browser. Di macOS, capture audio sistem memerlukan perangkat
        audio virtual seperti BlackHole atau Loopback, karena OS tidak mengekspos Screen Capture API audio
        sistem. Untuk sebagian besar kasus penggunaan screencast — di mana narasi adalah audio utama —
        perekaman mikrofon sudah cukup dan berfungsi konsisten di semua platform.
      </p>

      <h2>Privasi: Rekaman Tidak Pernah Meninggalkan Browser Anda</h2>
      <p>
        Ini bukan detail kecil. Rekaman disimpan dalam memori sebagai objek <code>Blob</code> di dalam
        tab browser Anda. Ketika Anda mengklik "Unduh," browser menulis blob tersebut ke sistem file lokal
        Anda. Tidak ada yang diunggah ke server mana pun — tidak server BrowseryTools, tidak layanan cloud
        apa pun. Rekaman tidak transit jaringan pada titik mana pun.
      </p>
      <p>
        Ini paling penting ketika Anda merekam konten sensitif: alur kerja perusahaan internal, data
        pelanggan, fitur produk yang belum dirilis, atau apa pun yang seharusnya tidak meninggalkan mesin
        Anda. Dengan perekam layar berbasis cloud, Anda harus mempercayai bahwa infrastruktur upload,
        penyimpanan, dan kontrol akses penyedia aman. Dengan perekam lokal berbasis browser, tidak ada
        upload yang perlu dikhawatirkan.
      </p>

      <h2>Batasan: Apa yang Tidak Dapat Dilakukan Perekam Browser</h2>
      <p>
        Pendekatan berbasis browser ideal untuk kasus penggunaan yang dijelaskan di atas, tetapi memiliki
        keterbatasan nyata yang harus Anda ketahui sebelum menggunakannya dalam konteks yang tidak sesuai:
      </p>
      <ul>
        <li>
          <strong>Tidak ada editor video bawaan:</strong> Perekam menangkap dan mengunduh video mentah.
          Jika Anda perlu memangkas awal dan akhir, memotong bagian, menambahkan callout, memperbesar, atau
          menumpuk teks, Anda memerlukan editor video terpisah. Untuk pengeditan cepat,{" "}
          <a href="https://www.veed.io" target="_blank" rel="noopener noreferrer">VEED.io</a> atau
          versi gratis DaVinci Resolve keduanya menangani pemangkasan dasar dengan baik.
        </li>
        <li>
          <strong>Tidak ada overlay webcam:</strong> Tidak ada feed webcam picture-in-picture. Jika Anda
          memerlukan overlay "talking head" di sudut rekaman, Anda memerlukan perangkat lunak desktop
          seperti OBS atau Camtasia.
        </li>
        <li>
          <strong>Batasan memori untuk rekaman sangat panjang:</strong> Karena rekaman disimpan dalam
          memori browser sampai diunduh, rekaman yang sangat panjang (45+ menit) dapat mengonsumsi RAM
          yang signifikan. Untuk rekaman jangka panjang, perangkat lunak desktop yang langsung menulis
          ke disk saat merekam lebih sesuai.
        </li>
        <li>
          <strong>Tidak ada berbagi cloud otomatis:</strong> Unduhan adalah file lokal. Jika alur kerja
          Anda memerlukan hosting cloud langsung dan tautan yang dapat dibagikan, Anda perlu mengunggah
          file secara manual setelahnya, atau menggunakan layanan seperti Loom yang menangani hosting
          secara otomatis.
        </li>
      </ul>

      <h2>Kapan Anda Harus Menggunakan Perangkat Lunak Desktop Sebagai Gantinya</h2>
      <p>
        Perekam browser adalah alat yang tepat untuk rekaman pendek hingga menengah di mana kesederhanaan
        dan privasi penting. Tetapi perangkat lunak desktop benar-benar lebih baik ketika:
      </p>
      <ul>
        <li>Anda perlu merekam lebih dari 30 menit secara terus-menerus</li>
        <li>Anda memerlukan overlay webcam atau komposisi multi-sumber</li>
        <li>Anda perlu mengedit, menambahkan caption, efek zoom, atau anotasi</li>
        <li>Anda perlu merekam rekaman game atau konten frame rate tinggi</li>
        <li>Anda memerlukan upload cloud otomatis dan tautan yang dapat dibagikan segera setelah merekam</li>
      </ul>
      <p>
        Untuk kasus tersebut, OBS Studio (gratis, open source) adalah opsi paling capable. Untuk
        pengeditan, DaVinci Resolve memiliki paket gratis yang murah hati. Keduanya memerlukan instalasi
        tetapi menawarkan kemampuan yang jauh melampaui apa yang dapat dilakukan alat berbasis browser.
      </p>

      <h2>Perbandingan: BrowseryTools vs. Opsi Perekaman Layar Umum</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Fitur</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Loom (Gratis)</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>OBS Studio</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Camtasia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Biaya", "Gratis", "Gratis / $12,50/bln", "Gratis", "~$300 satu kali"],
              ["Instalasi diperlukan", "Tidak", "Ekstensi diperlukan", "Ya", "Ya"],
              ["Akun diperlukan", "Tidak", "Ya", "Tidak", "Ya"],
              ["Video diunggah ke cloud", "Tidak pernah", "Selalu", "Tidak", "Tidak"],
              ["Batas durasi rekaman", "Tidak ada*", "5 menit (gratis)", "Tidak ada", "Tidak ada"],
              ["Editor video bawaan", "Tidak", "Pemangkasan dasar", "Tidak", "Ya (canggih)"],
              ["Overlay webcam", "Tidak", "Ya", "Ya", "Ya"],
              ["Tab-only capture", "Ya", "Ya", "Tidak", "Tidak"],
              ["Format output", "WebM", "MP4 (cloud)", "MP4/MKV", "MP4"],
            ].map(([feature, bt, loom, obs, cam], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{loom}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{obs}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{cam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize: "13px", opacity: 0.7}}>
        * Rekaman yang sangat panjang (&gt;45 mnt) mungkin dibatasi oleh memori browser yang tersedia.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Catatan privasi:</strong> Saat Anda menggunakan Loom, setiap rekaman diunggah ke server
        Loom dan disimpan di sana secara default. Konten layar Anda — yang mungkin mencakup alat internal,
        data pelanggan sensitif, atau fitur yang belum dirilis — berada di server pihak ketiga. Rekaman
        BrowseryTools tidak pernah diunggah. File pergi langsung dari browser Anda ke hard drive Anda.
      </div>

      <h2>Mulai Merekam Sekarang</h2>
      <p>
        Untuk sebagian besar tugas perekaman layar — laporan bug cepat, tutorial tim, demo fitur, walkthrough
        tinjauan kode — browser adalah semua yang Anda butuhkan. Tidak ada instalasi, tidak ada langganan,
        tidak ada tradeoff privasi.
      </p>
      <p>
        Buka <Link href="/tools/screen-recorder">Perekam Layar BrowseryTools</Link>, klik Mulai, rekam apa
        yang Anda butuhkan, dan unduh. Seluruh proses dari membuka alat hingga memiliki file WebM di desktop
        Anda membutuhkan kurang dari dua menit.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎬</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Rekam Layar Anda Sekarang — Gratis, Tanpa Instalasi</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Rekam layar, jendela, atau tab browser Anda. Unduh sebagai WebM. Tidak ada yang diunggah ke mana
          pun. Tanpa akun, tanpa ekstensi, tanpa biaya.
        </p>
        <Link
          href="/tools/screen-recorder"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(239,68,68)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Buka Perekam Layar →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Alat terkait:{" "}
        <Link href="/tools/image-compression">Kompresi Gambar</Link> ·{" "}
        <Link href="/tools/bg-removal">Penghapusan Latar Belakang</Link> ·{" "}
        <Link href="/tools/image-converter">Konverter Gambar</Link> ·{" "}
        <Link href="/">Semua BrowseryTools</Link>
      </p>
    </div>
  );
}
