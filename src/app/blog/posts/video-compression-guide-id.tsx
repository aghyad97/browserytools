export default function Content() {
  return (
    <div>
      <p>
        File video secara alami berukuran besar. Satu menit rekaman 1080p yang tidak terkompresi
        pada 30 frame per detik membutuhkan sekitar 1,5 GB penyimpanan. Kompresi bukan sekadar
        fitur tambahan — kompresi adalah satu-satunya alasan video di internet bisa berjalan sama
        sekali. Namun tidak semua kompresi setara, dan pengaturan yang salah dapat menghasilkan file
        yang masih terlalu besar, terlihat jelas terdegradasi, atau keduanya.
      </p>
      <p>
        Kamu bisa mengompresi file video apa pun sekarang menggunakan{" "}
        <a href="/tools/compress-video">BrowseryTools Video Compressor</a> — gratis, tanpa daftar,
        dan seluruh prosesnya berjalan secara lokal di browsermu. Rekaman videomu tidak pernah
        meninggalkan perangkatmu.
      </p>

      <h2>Mengapa File Video Mentah Begitu Besar?</h2>
      <p>
        Untuk memahami apa yang dilakukan kompresi, kamu perlu memahami titik awalnya. Video digital
        adalah rangkaian frame individual — gambar diam yang ditampilkan secara cepat berturut-turut
        untuk menciptakan ilusi gerak. Pada resolusi 1080p, setiap frame mengandung
        1.920 × 1.080 = 2.073.600 piksel. Jika setiap piksel menyimpan warna sebagai tiga channel
        8-bit (merah, hijau, biru), itu kira-kira 6 MB per frame. Pada 30 fps, satu detik video
        yang tidak terkompresi membutuhkan sekitar 180 MB. Satu menit lebih dari 10 GB.
      </p>
      <p>
        Format mentah seperti RAW, BRAW, atau Apple ProRes merekam video mendekati kondisi tidak
        terkompresi ini untuk mempertahankan kualitas maksimum untuk pengeditan post-produksi.
        Format konsumen, unggahan media sosial, dan platform streaming menggunakan format yang
        sudah dikompresi di mana sebagian besar data tersebut telah dibuang atau direkonstruksi —
        dengan cara yang hampir tidak disadari mata manusia, jika dilakukan dengan benar.
      </p>

      <h2>Cara Kerja Codec Video</h2>
      <p>
        Codec (coder-decoder) adalah algoritma yang mengompresi dan mendekompresi data video.
        Sebagian besar codec modern menggunakan dua teknik komplementer: kompresi spasial dalam
        setiap frame, dan kompresi temporal antar frame.
      </p>
      <p>
        <strong>Kompresi spasial</strong> bekerja seperti kompresi JPEG untuk gambar diam. Ia
        menganalisis setiap frame dan membuang informasi visual yang sulit dideteksi mata manusia —
        gradasi warna halus, tekstur halus di area seragam, detail frekuensi tinggi di zona
        perifer. Ini secara dramatis mengurangi ukuran setiap frame individual.
      </p>
      <p>
        <strong>Kompresi temporal</strong> memanfaatkan fakta bahwa frame video berturut-turut
        biasanya sangat mirip. Alih-alih menyimpan setiap piksel di setiap frame, codec menyimpan
        frame referensi lengkap (disebut I-frame atau keyframe) pada interval teratur, kemudian
        hanya menyimpan perbedaannya — vektor gerak dan area yang berubah — untuk frame-frame di
        antaranya (P-frame dan B-frame). Klip seseorang berbicara di depan latar belakang statis
        hampir tidak berubah dari frame ke frame, sehingga representasi yang dikompresi dari
        frame-frame itu sangat kecil.
      </p>

      <h2>Perbandingan Codec Utama</h2>
      <ul>
        <li>
          <strong>H.264 (AVC)</strong> — Tulang punggung internet. Diperkenalkan pada 2003 dan kini didukung secara universal di semua browser, perangkat, dan platform. Menghasilkan kualitas baik dengan ukuran file yang wajar dan dapat diputar di hampir setiap perangkat yang diproduksi dalam 15 tahun terakhir. Jika kamu membutuhkan kompatibilitas maksimum, H.264 adalah pilihan default yang aman.
        </li>
        <li>
          <strong>H.265 (HEVC)</strong> — Penerus H.264, menghasilkan kualitas visual yang setara dengan ukuran file setengahnya. Kendalanya adalah biaya lisensi, yang memperlambat adopsi. Didukung secara native di perangkat Apple dan perangkat keras Windows terbaru, tetapi dukungan browser masih kurang merata. Pilihan yang sangat baik untuk pengarsipan atau alur kerja berbasis Apple.
        </li>
        <li>
          <strong>VP9</strong> — Jawaban Google terhadap H.265 dan codec di balik YouTube. Bebas royalti dan didukung di Chrome serta Firefox. Efisiensi kompresi sebanding dengan H.265. Umumnya digunakan untuk pengiriman web bersama dengan container WebM.
        </li>
        <li>
          <strong>AV1</strong> — Codec generasi terbaru, dikembangkan oleh Alliance for Open Media (Google, Netflix, Apple, dan lainnya). AV1 mencapai kompresi 30–50% lebih baik dari H.264 pada kualitas yang sama. Bebas royalti, semakin didukung di browser dan perangkat modern. Trade-off-nya adalah encoding yang sangat lambat — AV1 bisa memakan waktu 10–20x lebih lama dari H.264 untuk di-encode. Bagus untuk pengiriman final konten yang akan ditonton berkali-kali; berlebihan untuk berbagi cepat.
        </li>
      </ul>

      <h2>Bitrate, Resolusi, dan Frame Rate: Yang Sebenarnya Mengontrol Ukuran File</h2>
      <p>
        Tiga variabel menentukan seberapa besar file video yang terkompresi:
      </p>
      <ul>
        <li>
          <strong>Bitrate</strong> — Jumlah bit data yang disimpan per detik video. Bitrate yang lebih tinggi berarti lebih banyak data, kualitas lebih baik, file lebih besar. Upload YouTube 4K mungkin menggunakan 35–68 Mbps; klip web yang dikompresi mungkin menggunakan 2–5 Mbps. Bitrate adalah pengungkit paling langsung untuk mengontrol ukuran file.
        </li>
        <li>
          <strong>Resolusi</strong> — Dimensi piksel frame. Menurunkan dari 4K (3840×2160) ke 1080p (1920×1080) mengurangi jumlah piksel sebesar 75%, yang memungkinkan file jauh lebih kecil pada bitrate yang sama atau kualitas serupa pada bitrate yang jauh lebih rendah. Untuk sebagian besar konten web, 1080p tidak dapat dibedakan dari 4K pada jarak tampil dan ukuran layar tipikal.
        </li>
        <li>
          <strong>Frame rate</strong> — Konten standar berjalan pada 24, 25, atau 30 fps. Frame rate yang lebih tinggi (60 fps, 120 fps) membutuhkan lebih banyak data secara proporsional untuk mempertahankan kualitas. Menurunkan dari 60 fps ke 30 fps kira-kira mengurangi bitrate yang diperlukan hingga setengahnya untuk kualitas setara — penghematan yang signifikan untuk video di mana gerakan lancar bukan daya tarik utama.
        </li>
      </ul>

      <h2>Kompresi Lossless vs Lossy</h2>
      <p>
        Kompresi lossless mengurangi ukuran file tanpa membuang data apa pun. Aslinya dapat
        direkonstruksi dengan sempurna dari file yang terkompresi. Format seperti Apple ProRes 4444,
        FFV1, atau Huffyuv menggunakan kompresi lossless. Ukurannya jauh lebih kecil dari format
        mentah tetapi masih sangat besar dibandingkan format distribusi. Kompresi lossless adalah
        pilihan tepat untuk master arsip dan alur kerja pengeditan — bukan untuk berbagi atau
        streaming.
      </p>
      <p>
        Kompresi lossy mencapai rasio kompresi yang jauh lebih tinggi dengan secara permanen membuang
        data yang dianggap encoder tidak dapat dipersepsi. H.264, H.265, VP9, dan AV1 semuanya
        bersifat lossy. Setelah kamu mengompresi ke format lossy, informasi yang dibuang hilang.
        Ini baik untuk distribusi — penonton tidak pernah tahu apa yang dihapus — tetapi sangat
        penting untuk alur kerja, seperti yang dibahas berikutnya.
      </p>

      <h2>Generation Loss: Mengapa Re-Kompresi Menurunkan Kualitas</h2>
      <p>
        Setiap kali kamu melakukan transcode (re-kompresi) video lossy yang sudah terkompresi,
        kualitas menurun. Kompresi pass pertama membuang sebagian informasi. Pass kedua bekerja
        pada versi yang sudah terdegradasi dan membuang lebih banyak. Pada transcode kelima atau
        keenam, artefak kompresi yang terlihat — blockiness, banding, smearing — terakumulasi
        secara nyata. Ini disebut generation loss, beranalogi dengan degradasi kualitas yang terlihat
        saat menyalin kaset VHS.
      </p>
      <p>
        Implikasi praktisnya: selalu kompres dari sumber asli. Edit dalam format lossless atau
        high-bitrate, lalu kompres ekspor final sekali untuk pengiriman. Jangan pernah mengunduh
        ulang video dari media sosial dan melakukan re-kompresi — kamu memulai dari salinan yang
        sudah terdegradasi dan memperburuknya.
      </p>

      <h2>Target Kompresi untuk Kasus Penggunaan Umum</h2>
      <ul>
        <li>
          <strong>Lampiran email</strong> — Jaga di bawah 25 MB (sebagian besar klien email memberlakukan batas ini). Gunakan H.264 pada 720p, 1–2 Mbps. Untuk konten yang lebih panjang dari 2–3 menit, unggah ke layanan berbagi file dan kirim link.
        </li>
        <li>
          <strong>Penyematan web</strong> — Targetkan di bawah 5 MB untuk klip pendek, 10–20 Mbps untuk yang lebih panjang. H.264 pada 1080p adalah pilihan universal yang aman. AV1 atau VP9 dalam WebM akan lebih kecil untuk browser yang mendukungnya.
        </li>
        <li>
          <strong>Media sosial</strong> — Platform melakukan re-kompresi semua konten dari ujung mereka, jadi unggah dengan kualitas tertinggi yang didukung alur kerjamu dalam batas ukuran mereka. Batas Instagram adalah 4 GB; TikTok adalah 287 MB untuk sebagian besar format. Karena platform menambahkan kompresi pass-nya sendiri, memulai dari file yang lebih bersih dan lebih high-bitrate menghasilkan hasil yang jauh lebih baik setelah transcode mereka.
        </li>
        <li>
          <strong>Master arsip</strong> — Gunakan lossless (ProRes 4444, FFV1) atau near-lossless (ProRes 422 HQ) pada resolusi penuh. Penyimpanan itu murah; merekonstruksi rekaman asli adalah hal yang tidak mungkin.
        </li>
      </ul>

      <h2>Tips Praktis Memilih Pengaturan Kompresi</h2>
      <p>
        Beberapa aturan praktis yang konsisten menghasilkan hasil yang baik:
      </p>
      <ul>
        <li>
          <strong>Gunakan mode CRF jika ukuran file fleksibel.</strong> Constant Rate Factor memungkinkan encoder memvariasikan bitrate secara dinamis, menghabiskan lebih banyak bit pada adegan kompleks dan lebih sedikit pada adegan sederhana. Ini menghasilkan kualitas yang lebih baik per ukuran file daripada bitrate tetap. Untuk H.264, CRF 18–23 mencakup rentang dari near-lossless hingga cukup baik untuk web.
        </li>
        <li>
          <strong>Sesuaikan resolusi output dengan platform pengiriman.</strong> Menurunkan skala sumber 4K ke 1080p sebelum menerapkan kompresi memberikan encoder lebih sedikit pekerjaan dan menghasilkan output yang lebih bersih daripada mengompresi pada 4K dan membiarkan platform menurunkan skalanya.
        </li>
        <li>
          <strong>Audio juga penting.</strong> AAC pada 128–192 kbps mencakup sebagian besar konten stereo. Jarang ada perbedaan yang dapat dipersepsi antara 192 kbps dan 320 kbps untuk dialog dan musik pada volume mendengarkan tipikal, tetapi perbedaan ukuran filenya nyata.
        </li>
        <li>
          <strong>Uji sebelum berkomitmen.</strong> Encode klip 30 detik dengan pengaturan targetmu dan periksa di jenis layar dan koneksi yang sama yang akan digunakan audiensmu. File yang terlihat bagus di monitor pengeditan pada resolusi penuh mungkin menampilkan artefak di layar ponsel atau buffer pada koneksi lambat.
        </li>
      </ul>
      <p>
        Untuk kompresi cepat tanpa mengkonfigurasi lingkungan pengeditan lengkap,{" "}
        <a href="/tools/compress-video">BrowseryTools Video Compressor</a> menangani pengaturan
        untukmu dan memproses semuanya di browsermu — tanpa upload, tanpa menunggu, tanpa akses
        pihak ketiga ke rekamanmu.
      </p>

      <div
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Takeaway utama:</strong> Alur kerja kompresi terbaik adalah mengedit dalam format
        berkualitas tinggi, mengompresi sekali ke format target, dan tidak pernah melakukan
        re-kompresi output. Pilih codec yang tepat untuk platform pengirimanmu, sesuaikan resolusi
        dengan ukuran layar yang dimaksud, dan gunakan mode CRF untuk kompresi berbasis kualitas
        daripada mengejar target bitrate yang arbitrer.
      </div>
    </div>
  );
}
