export default function Content() {
  return (
    <div>
      <p>
        Memilih format gambar yang salah adalah salah satu kesalahan paling umum dan paling mahal
        dalam performa web. JPEG di mana WebP sudah cukup, PNG di mana JPEG sudah memadai, atau
        format yang tidak didukung browser — masing-masing menambahkan beban yang tidak perlu pada
        setiap pemuatan halaman, secara langsung membahayakan skor Core Web Vitals dan pengalaman
        pengguna. Panduan ini menjelaskan cara kerja JPEG, PNG, WebP, dan AVIF di baliknya, kapan
        menggunakan masing-masing, dan cara membuat pilihan yang tepat untuk konteksmu.
      </p>
      <p>
        Kamu bisa mengkonversi antara format apa pun menggunakan{" "}
        <a href="/tools/image-converter">BrowseryTools Image Converter</a> — gratis, tanpa daftar,
        dan semuanya berjalan secara lokal di browsermu.
      </p>

      <h2>JPEG: Standar Fotografi</h2>
      <p>
        JPEG (Joint Photographic Experts Group) diperkenalkan pada 1992 dan tetap menjadi format
        dominan untuk foto. Algoritma kompresinya didasarkan pada Discrete Cosine Transform (DCT):
        setiap gambar dibagi menjadi blok piksel 8×8, dan setiap blok ditransformasi dari domain
        spasial (warna piksel) ke domain frekuensi (seberapa cepat warna berubah di seluruh blok).
        Encoder kemudian melakukan kuantisasi data frekuensi ini — mempertahankan komponen
        frekuensi rendah yang mendeskripsikan area warna luas, dan membuang atau mengkasar komponen
        frekuensi tinggi yang mendeskripsikan detail halus dan tepi tajam.
      </p>
      <p>
        Inilah mengapa kompresi JPEG menghasilkan artefak khas pada pengaturan agresif: patch 8×8
        blok (disebut macroblocking), smearing di sekitar tepi tajam, dan color banding pada
        gradien. Artefak ini muncul di area detail halus dan kontras tinggi — tepatnya area di
        mana komponen frekuensi tinggi yang dibuang encoder akan paling berpengaruh.
      </p>
      <p>
        JPEG bersifat lossy — setiap penyimpanan membuang informasi secara permanen. Pada kualitas
        85–90 (dalam skala 0–100), foto biasanya terlihat tidak dapat dibedakan dari aslinya pada
        ukuran tampil web sambil 5–20× lebih kecil dari PNG dari gambar yang sama. JPEG tidak
        mendukung transparansi (alpha channel) atau animasi.
      </p>

      <h2>PNG: Presisi Lossless</h2>
      <p>
        PNG (Portable Network Graphics) menggunakan kompresi lossless berdasarkan algoritma
        DEFLATE, yang menggabungkan kompresi kamus LZ77 (menemukan dan mengganti urutan byte yang
        berulang) dengan Huffman coding (menetapkan kode bit lebih pendek untuk nilai yang lebih
        sering muncul). Tidak ada data gambar yang pernah dibuang. Setiap piksel disimpan dengan
        tepat.
      </p>
      <p>
        Ini membuat PNG sangat baik untuk gambar yang harus direproduksi secara piksel-sempurna:
        screenshot, logo, ikon, ilustrasi dengan tepi tajam, teks yang ditumpangkan pada gambar,
        dan apa pun yang memiliki transparansi. PNG mendukung alpha channel 8-bit penuh, memungkinkan
        gradien semi-transparan yang mulus.
      </p>
      <p>
        Trade-off-nya adalah ukuran file. Untuk konten fotografi dengan gradien warna yang
        berkelanjutan, file PNG sangat besar dibandingkan JPEG pada kualitas yang sama. Foto yang
        disimpan sebagai PNG mungkin 10–20× lebih besar dari gambar yang sama sebagai JPEG yang
        terkompresi dengan baik. PNG unggul ketika konten memiliki area seragam yang besar, tepi
        keras, atau relatif sedikit warna berbeda — pola yang dikompresi LZ77 secara efisien.
        Fotografi, dengan jutaan nilai warna yang sedikit berbeda, adalah kasus terburuk untuk PNG.
      </p>

      <h2>WebP: Format Web Modern</h2>
      <p>
        WebP diperkenalkan oleh Google pada 2010, diturunkan dari codec video VP8. Ia mendukung
        mode kompresi lossy dan lossless, plus animasi dan transparansi di kedua mode. Mode lossy
        menggunakan pendekatan blok berbasis DCT yang mirip dengan JPEG tetapi dengan teknik
        prediksi yang lebih canggih dan entropy coding yang lebih baik, biasanya mencapai file
        25–35% lebih kecil dari JPEG pada kualitas visual yang setara. Mode lossless 15–25% lebih
        efisien dari PNG untuk sebagian besar konten.
      </p>
      <p>
        Dukungan browser kini hampir universal — semua browser utama telah mendukung WebP sejak
        2020. Kesenjangan yang tersisa adalah software lama: beberapa aplikasi pengedit gambar lama
        dan penampil gambar sistem operasi tidak menangani WebP secara native. Untuk pengiriman
        web, WebP adalah default modern yang langsung menggantikan JPEG dan PNG di sebagian besar
        kasus.
      </p>

      <h2>AVIF: Generasi Berikutnya</h2>
      <p>
        AVIF (AV1 Image File Format) didasarkan pada keyframe dari codec video AV1, yang
        dikembangkan oleh Alliance for Open Media dan dirilis pada 2018. Teknik kompresi AV1
        jauh lebih canggih dari yang mendasari JPEG atau WebP: blok prediksi berukuran besar dan
        variabel, prediksi intra-frame yang lebih canggih, penanganan film grain dan noise yang
        lebih baik, dan entropy coding yang superior. Hasilnya biasanya file 40–50% lebih kecil
        dari JPEG pada kualitas yang setara — sering mengalahkan WebP sebesar 20–30% juga.
      </p>
      <p>
        AVIF mendukung HDR penuh, gamut warna luas, transparansi, animasi, dan kedalaman warna
        8-bit dan 10-bit. Dukungan browser telah mengejar dengan cepat: Chrome (85+), Firefox (93+),
        dan Safari (16+) semuanya mendukung AVIF. Kelemahan utama adalah kecepatan encoding —
        AVIF jauh lebih lambat untuk di-encode dari JPEG atau WebP, yang penting untuk pipeline
        pemrosesan gambar real-time tetapi tidak relevan untuk aset statis yang sudah dikompresi
        sebelumnya.
      </p>

      <h2>Perbandingan Ukuran File untuk Gambar yang Sama</h2>
      <p>
        Untuk membuat perbedaannya lebih konkret, berikut perbandingan representatif untuk foto
        1920×1080 pada kualitas visual yang sebanding:
      </p>
      <ul>
        <li>
          <strong>PNG (lossless)</strong> — 4,2 MB. Reproduksi sempurna, tanpa artefak. Tepat
          untuk master sumber atau ketika akurasi piksel diperlukan.
        </li>
        <li>
          <strong>JPEG (kualitas 85)</strong> — 380 KB. Artefak yang terlihat minimal pada ukuran
          layar. Standar untuk pengiriman web fotografi selama tiga dekade.
        </li>
        <li>
          <strong>WebP (lossy, kualitas setara)</strong> — 270 KB. Sekitar 30% lebih kecil dari
          JPEG, secara visual sebanding. Upgrade langsung untuk sebagian besar proyek web.
        </li>
        <li>
          <strong>AVIF (kualitas setara)</strong> — 180 KB. Sekitar 50% lebih kecil dari JPEG,
          secara visual sebanding atau lebih baik. Ukuran file terbaik yang tersedia saat ini untuk
          konten fotografi.
        </li>
      </ul>
      <p>
        Ini adalah angka representatif; rasio aktualnya bervariasi berdasarkan konten gambar.
        Fotografi dengan detail tinggi dan noise tinggi mendapat manfaat lebih sedikit dari codec
        lebih baru dibandingkan gambar yang halus dan noise rendah.
      </p>

      <h2>Kapan Menggunakan Setiap Format</h2>
      <ul>
        <li>
          <strong>Foto di web</strong> — Gunakan WebP dengan fallback JPEG melalui elemen HTML{" "}
          <code>&lt;picture&gt;</code>. Jika pipeline build-mu mendukung encoding AVIF, sajikan
          AVIF dengan fallback WebP dan JPEG.
        </li>
        <li>
          <strong>Logo, ikon, elemen UI dengan transparansi</strong> — WebP (lossless) atau PNG.
          JPEG tidak dapat merepresentasikan transparansi sama sekali.
        </li>
        <li>
          <strong>Screenshot dan rekaman layar</strong> — PNG untuk apa pun yang memerlukan
          reproduksi piksel tepat. WebP lossless sebagai alternatif lebih kecil ketika fidelitas
          tepat tidak kritis.
        </li>
        <li>
          <strong>Ilustrasi dengan warna datar dan tepi tajam</strong> — PNG atau WebP lossless.
          JPEG akan menimbulkan artefak ringing yang terlihat di sekitar tepi keras bahkan pada
          pengaturan kualitas tinggi.
        </li>
        <li>
          <strong>Cetak dan arsip</strong> — PNG (lossless) atau TIFF. Format lossy tidak tepat
          untuk aset sumber yang akan diedit ulang.
        </li>
        <li>
          <strong>Email</strong> — JPEG atau PNG. Klien email memiliki dukungan tidak konsisten
          untuk WebP dan hampir tidak ada untuk AVIF. Utamakan kompatibilitas daripada optimasi.
        </li>
      </ul>

      <h2>Dampak pada Core Web Vitals dan Performa Halaman</h2>
      <p>
        Largest Contentful Paint (LCP) — salah satu Core Web Vitals Google — mengukur berapa lama
        waktu yang dibutuhkan elemen konten terbesar yang terlihat (sering kali gambar hero) untuk
        dimuat. Pilihan format gambar secara langsung mempengaruhi LCP: gambar hero AVIF dimuat
        lebih cepat dari JPEG yang setara, dan LCP yang lebih cepat meningkatkan pengalaman
        pengguna sekaligus peringkat pencarian.
      </p>
      <p>
        Efek kumulatifnya juga penting. Halaman dengan 20 gambar produk, masing-masing disimpan
        sebagai PNG alih-alih WebP secara tidak perlu, mungkin 5–10 MB lebih berat dari yang
        dibutuhkan. Pada koneksi mobile, itu adalah perbedaan antara halaman yang dimuat dalam
        2 detik dan yang dimuat dalam 8 detik.
      </p>

      <h2>Menyajikan Format Berbeda ke Browser yang Berbeda</h2>
      <p>
        Elemen HTML <code>&lt;picture&gt;</code> dan <code>&lt;source&gt;</code> anaknya
        memungkinkanmu menyajikan format terbaik yang didukung setiap browser tanpa JavaScript:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero image" />
</picture>`}
      </pre>
      <p>
        Browser memilih <code>&lt;source&gt;</code> pertama yang didukungnya. Browser dengan
        dukungan AVIF mengunduh file terkecil; browser tanpa dukungan akan jatuh ke WebP atau JPEG.
        Tag <code>&lt;img&gt;</code>{" "}
        di bagian akhir berfungsi sebagai fallback universal dan satu-satunya elemen yang memerlukan
        atribut{" "}
        <code>alt</code>.
      </p>
      <p>
        Untuk mengkonversi gambar yang ada ke WebP atau AVIF untuk pengaturan multi-format seperti
        ini,{" "}
        <a href="/tools/image-converter">BrowseryTools Image Converter</a> menangani konversi batch
        tanpa mengupload apa pun ke server — file sumbermu tetap di perangkatmu.
      </p>

      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Panduan keputusan cepat:</strong> Jika kamu membutuhkan kompatibilitas maksimum,
        gunakan JPEG untuk foto dan PNG untuk grafis. Jika kamu mengoptimalkan performa web, gunakan
        WebP sebagai baseline dan tambahkan AVIF sebagai peningkatan. Jika kamu membangun proyek
        baru dari awal dengan stack modern, sajikan AVIF dengan fallback WebP dan berhenti
        memikirkan JPEG sama sekali.
      </div>
    </div>
  );
}
