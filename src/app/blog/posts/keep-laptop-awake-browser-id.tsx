export default function Content() {
  return (
    <div>
      <p>
        Setiap laptop dan ponsel hadir dengan pengaturan sleep yang — secara umum — adalah hal yang baik.
        Pengaturan ini menghemat baterai, mengurangi panas, dan memperpanjang umur layar Anda. Namun ada
        momen-momen ketika pengaturan yang sama itu berubah menjadi siksaan kecil. Anda sedang di tengah unduhan
        dua jam, menonton video pelatihan yang panjang, menjalankan presentasi, memantau dasbor, atau membaca
        artikel yang menuntut perhatian Anda, dan tiba-tiba layar meredup dan laptop mulai bergerak menuju mode
        sleep.
      </p>
      <p>
        Solusi tradisionalnya merepotkan. Di macOS orang memasang Amphetamine atau Caffeine. Di Windows mereka
        mengutak-atik pengaturan daya atau menjalankan utilitas bernama PowerToys. Di Linux mereka berburu di
        antara flag systemd. Setiap solusi ini mengharuskan Anda memasang sesuatu, memercayainya, dan sering kali
        membayarnya atau menyusuri menu pengaturan yang ditulis oleh dan untuk administrator sistem.
      </p>
      <p>
        Ada opsi yang jauh lebih sederhana yang hampir tidak diketahui siapa pun: browser Anda sudah bisa
        melakukannya, di setiap sistem operasi, tanpa instalasi sama sekali. Itulah inti dari tool{" "}
        <a href="/tools/keep-awake">Keep Awake BrowseryTools</a> — satu tab yang Anda buka dan satu tombol yang
        Anda tekan untuk mencegah layar Anda masuk mode sleep, tanpa aplikasi, tanpa akun, dan tanpa pengaturan.
      </p>

      <h2>Cara Kerja Keep Awake — Screen Wake Lock API</h2>
      <p>
        Browser modern menyediakan standar web bernama{" "}
        <strong>Screen Wake Lock API</strong>. Ketika sebuah halaman memanggil{" "}
        <code>navigator.wakeLock.request("screen")</code>, browser dengan sopan meminta sistem operasi untuk
        menjaga layar tetap menyala selama tab tersebut terlihat. Sistem operasi pun menurutinya. Layar Anda
        tetap menyala, tanpa peredupan akibat timeout, tanpa sleep otomatis, sampai Anda melepaskan lock atau tab
        tersebut tersembunyi.
      </p>
      <p>
        Inilah mekanisme persis yang digunakan YouTube, Netflix, dan Google Maps ketika Anda sedang menonton
        video atau menavigasi belokan demi belokan. Ini adalah primitif tingkat sistem operasi yang didukung
        dengan baik dan hemat baterai. Ini bukan trik yang menggoyangkan mouse atau memutar audio sunyi — ini
        adalah permintaan formal kepada sistem untuk menjaga layar tetap hidup. Chrome, Edge, Safari (di iOS
        16.4+ dan macOS), serta Firefox semuanya mendukungnya saat ini.
      </p>

      <h2>Mengapa Tool Browser Mengalahkan Aplikasi Native</h2>
      <p>
        Begitu Anda melihat betapa mudahnya browser melakukan ini, alasan untuk memasang aplikasi khusus pun
        runtuh. Inilah mengapa pendekatan browser menang untuk tugas seperti ini:
      </p>
      <p>
        <strong>Lintas-platform secara default.</strong> Mac, Windows, Linux, Chromebook, iPad, iPhone, Android —
        tool yang sama, perilaku yang sama, URL yang sama. Anda tidak perlu build Mac dan build Windows dan build
        Android. Satu halaman web menangani semuanya.
      </p>
      <p>
        <strong>Tanpa perlu memberi kepercayaan.</strong> Aplikasi "stay awake" native butuh izin untuk mengubah
        pengaturan daya, dan banyak yang meminta akses lebih banyak daripada yang benar-benar mereka perlukan.
        Tool browser butuh tepat satu izin — izin yang sedang dimintanya — dan Anda bisa mencabutnya dengan
        menutup tab.
      </p>
      <p>
        <strong>Tanpa hambatan instalasi.</strong> Buka URL, klik tombol, selesai. Anda bisa mem-bookmark-nya
        atau menyematkannya di tab bar. Anda bisa membagikan tautannya kepada kolega yang punya masalah sama dan
        mereka bisa menggunakannya dalam sepuluh detik.
      </p>
      <p>
        <strong>Menghormati privasi.</strong> Tool{" "}
        <a href="/tools/keep-awake">Keep Awake BrowseryTools</a> berjalan 100% di browser Anda. Tidak ada
        analitik yang melacak apa yang Anda lakukan, tidak ada akun untuk didaftarkan, tidak ada server yang tahu
        kapan Anda mengaktifkannya. Ini adalah halaman statis yang berbicara langsung dengan Wake Lock API
        browser Anda.
      </p>

      <h2>Pilihan Durasi — Dari 15 Menit hingga Tak Terbatas</h2>
      <p>
        Tidak setiap skenario membutuhkan timeout yang sama. Tool Keep Awake memberi Anda berbagai preset
        sehingga Anda bisa menyesuaikan durasi dengan apa yang sebenarnya Anda lakukan:
      </p>
      <p>
        <strong>15 menit</strong> — cocok untuk bacaan singkat, unduhan cepat, atau satu panggilan dukungan.
        <br />
        <strong>30 menit</strong> — cukup untuk sesi deep work yang fokus atau tutorial berdurasi sedang.
        <br />
        <strong>1 jam</strong> — ideal untuk sebagian besar panggilan video, webinar, atau sesi kerja sepanjang
        film.
        <br />
        <strong>2 jam</strong> — presentasi panjang, sesi pairing yang lama, atau film layar lebar.
        <br />
        <strong>4 jam dan 8 jam</strong> — untuk unduhan semalaman, proses pelatihan yang panjang, acara bergaya
        konferensi, atau dasbor yang ingin Anda pantau sepanjang hari.
        <br />
        <strong>Durasi kustom</strong> — ketik jumlah menit atau jam yang persis Anda inginkan. 45 menit, 90
        menit, 3 jam, apa pun yang sesuai dengan tugas.
        <br />
        <strong>Tak terbatas</strong> — opsi nuklir. Layar tetap menyala sampai Anda menekan stop. Gunakan ini
        ketika Anda benar-benar tidak tahu berapa lama Anda butuh, atau ketika Anda ingin mengawasi proses yang
        panjang dan memutuskannya nanti.
      </p>
      <p>
        Hitung mundur ditampilkan secara langsung di judul halaman, sehingga Anda bisa beralih ke tab lain dan
        melirik tab bar untuk melihat berapa banyak waktu yang tersisa. Ketika timer habis, tool melepaskan wake
        lock secara otomatis dan laptop Anda kembali ke perilaku sleep normal — tanpa efek samping yang
        tersisa.
      </p>

      <h2>Skenario Praktis Saat Anda Benar-benar Membutuhkannya</h2>
      <p>
        <strong>Mengunduh file besar atau memasang OS.</strong> Beberapa operasi terhenti jika mesin masuk mode
        sleep. Mengaktifkan Keep Awake selama unduhan 40GB berjalan menjamin unduhan itu selesai tanpa
        gangguan.
      </p>
      <p>
        <strong>Presentasi atau berbagi layar.</strong> Tidak ada yang lebih memalukan daripada laptop Anda
        meredup di tengah slide saat pitch klien yang penting. Atur Keep Awake ke dua jam sebelum Anda mulai, dan
        monitor presenter tetap terang sepanjang waktu.
      </p>
      <p>
        <strong>Menonton video panjang atau livestream.</strong> Jika Anda menonton siaran konferensi, kebaktian,
        seminar pelatihan, atau acara keluarga, Wake Lock menjaga layar tetap menyala sehingga Anda tidak perlu
        menggerakkan mouse setiap beberapa menit.
      </p>
      <p>
        <strong>Memantau dasbor atau proses build.</strong> Developer yang memantau pipeline CI, dasbor insiden,
        log server, atau layar trading butuh layar tetap terlihat selama berjam-jam. Mode tak terbatas dibuat
        khusus untuk ini.
      </p>
      <p>
        <strong>Membaca dokumen panjang.</strong> Kontrak hukum, makalah penelitian, dan dokumentasi teknis layak
        mendapat perhatian tanpa layar memudar setiap sepuluh menit. Empat puluh lima menit Keep Awake memberi
        Anda waktu fokus yang Anda butuhkan.
      </p>
      <p>
        <strong>Menjalankan virtual machine atau build panjang.</strong> Jika Anda sedang meng-compile kode,
        menjalankan rangkaian pengujian, atau melatih model kecil, Anda tidak ingin sistem operasi menjeda
        pekerjaan karena laptop mengira Anda sudah pergi.
      </p>

      <h2>Hal yang Perlu Diketahui (dan Satu Hal yang Tidak Bisa Dilakukan)</h2>
      <p>
        Screen Wake Lock API adalah lock untuk <em>layar</em>. Ia mencegah layar meredup dan sistem operasi
        memicu sleep akibat ketidakaktifan. Pada sebagian besar laptop, menjaga layar tetap menyala juga mencegah
        mesin itu sendiri masuk mode sleep — karena sistem hanya tidur saat idle, dan layar yang aktif dihitung
        sebagai aktif.
      </p>
      <p>
        Namun, jika Anda secara fisik <strong>menutup penutup layar</strong>, sebagian besar sistem operasi
        dikonfigurasi untuk tidur tanpa peduli apa yang diminta aplikasi mana pun. Ini adalah perilaku tingkat
        perangkat keras dan tidak ada tool browser yang bisa menimpanya. Jika Anda butuh laptop tetap menyala
        dengan penutup tertutup (misalnya, menjalankan proses panjang sambil terhubung ke listrik), Anda perlu
        mengubah pengaturan daya OS secara terpisah. Keep Awake menangani segala hal lainnya.
      </p>
      <p>
        Kehalusan lainnya adalah wake lock dilepaskan otomatis ketika tab menjadi tersembunyi. Ini adalah
        pengaman privasi dan baterai yang terpasang di dalam API. Tool Keep Awake BrowseryTools mendengarkan
        ketika tab kembali terlihat dan memperoleh kembali lock secara otomatis — jadi jika Anda beralih tab atau
        aplikasi lalu kembali, keep-awake berlanjut dengan mulus. Satu-satunya cara untuk memutusnya adalah
        menutup atau meminimalkan seluruh browser sepenuhnya.
      </p>

      <h2>Mengapa Tanpa Unduhan, Tanpa Iklan, Tanpa Pelacakan</h2>
      <p>
        Setiap tool di BrowseryTools mengikuti filosofi yang sama: berjalan sepenuhnya di browser, tidak pernah
        mengunggah data, tidak pernah memerlukan akun, tidak pernah menampilkan iklan. Keep Awake adalah contoh
        yang sangat bersih. Benar-benar tidak ada yang perlu dikirim ke mana pun. Tool meminta izin kepada
        browser Anda, browser meminta sistem operasi Anda, dan itulah seluruh transaksinya. Tidak ada data yang
        mengidentifikasi pengguna, tidak ada peristiwa analitik, tidak ada telemetri. Anda membuka halaman, klik
        tombol, dan sesuatu yang berguna pun terjadi.
      </p>
      <p>
        Bandingkan ini dengan ekosistem aplikasi "pencegah sleep" pada umumnya: Anda mencari di App Store atau
        Play Store, menemukan puluhan aplikasi dengan iklan yang mengganggu, permintaan izin yang meminta jauh
        lebih banyak daripada yang mereka perlukan, dan paywall langganan untuk fitur yang bisa disediakan
        gratis oleh halaman web 20 baris.
      </p>

      <h2>Coba Sekarang</h2>
      <p>
        Buka <a href="/tools/keep-awake">tool Keep Awake</a>, pilih durasi — atau pilih Tak Terbatas jika Anda
        mau — dan tekan tombol hijau besar. Laptop Anda akan tetap menyala sampai timer berakhir atau sampai Anda
        menekan stop. Tanpa instalasi, tanpa akun, tanpa syarat tersembunyi. Jika Anda merasa berguna,
        bookmark-lah atau bagikan tautannya dengan teman yang punya keluhan yang sama.
      </p>
      <p>
        Dan selagi Anda di sini, lihat-lihatlah sekitar. BrowseryTools punya lusinan utilitas gratis lain yang
        menghormati privasi dan berjalan sepenuhnya di browser Anda — mulai dari{" "}
        <a href="/tools/pomodoro">timer Pomodoro</a> hingga <a href="/tools/json-formatter">JSON formatter</a>,
        sebuah <a href="/tools/password-generator">password generator</a>, sebuah{" "}
        <a href="/tools/world-clock">jam dunia</a>, dan masih banyak lagi. Semuanya gratis, semuanya lokal, dan
        tidak ada yang meminta Anda mendaftar.
      </p>
    </div>
  );
}
