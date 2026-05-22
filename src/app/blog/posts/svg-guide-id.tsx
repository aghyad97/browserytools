export default function Content() {
  return (
    <div>
      <p>
        SVG adalah salah satu teknologi yang terlihat sederhana dari luar — hanya format gambar,
        kan? — tetapi memberikan manfaat lebih dari mempelajarinya lebih dalam dibandingkan hampir
        format lain dalam toolkit developer atau desainer. File SVG dapat diskalakan tanpa batas
        tanpa kehilangan kualitas, hampir tidak ada bobotnya untuk grafis sederhana, dapat di-style
        dengan CSS, dianimasikan dengan JavaScript atau transisi CSS, dan disematkan langsung ke
        dalam HTML. Memahami SVG dengan benar mengubah cara kamu berpikir tentang grafis di web.
      </p>
      <p>
        Kamu bisa melihat, memeriksa, dan mengoptimalkan file SVG apa pun menggunakan{" "}
        <a href="/tools/svg">BrowseryTools SVG Tool</a> — gratis, tanpa daftar, semuanya berjalan
        di browsermu.
      </p>

      <h2>Apa Itu SVG?</h2>
      <p>
        SVG singkatan dari Scalable Vector Graphics. Tidak seperti JPEG, PNG, atau WebP — yang
        menyimpan gambar sebagai grid piksel berwarna (gambar raster) — SVG menyimpan gambar
        sebagai deskripsi matematis dari bentuk. Lingkaran dideskripsikan sebagai titik pusat dan
        radius. Path dideskripsikan sebagai urutan perintah menggambar: pindah ke titik ini, gambar
        garis ke titik itu, gambar kurva melalui titik kontrol ini, tutup path.
      </p>
      <p>
        SVG adalah format berbasis XML, artinya setiap file SVG adalah teks biasa, dapat dibaca
        manusia, dan terstruktur sebagai pohon elemen bersarang. Buka SVG apa pun di editor teks
        dan kamu melihat markup yang terbaca, bukan blob biner. Ini memiliki konsekuensi praktis
        yang signifikan: file SVG dapat dibuat secara programatik, dimodifikasi dengan alat
        pemrosesan teks, di-diff dalam version control, dan disematkan langsung ke HTML tanpa
        pemrosesan tambahan.
      </p>
      <p>
        Format ini adalah standar W3C, dikelola bersama HTML dan CSS. Setiap browser modern
        memiliki mesin rendering SVG lengkap bawaan.
      </p>

      <h2>Mengapa SVG Mengungguli Raster untuk Ikon dan Ilustrasi</h2>
      <p>
        Keunggulan SVG yang menentukan atas format raster untuk ikon, logo, dan ilustrasi adalah
        independensi resolusi. Ikon raster yang dibuat pada 32×32 piksel akan terlihat buram di
        layar Retina, yang merender pada 2× atau 3× piksel fisik per piksel CSS. Untuk
        memperbaikinya, kamu perlu mengekspor beberapa varian resolusi (@1x, @2x, @3x), meningkatkan
        resolusi sumber (file lebih besar, lebih banyak memori), atau menggunakan image-set dalam
        CSS untuk menyajikan resolusi yang tepat. Dengan SVG, kamu membuat grafis sekali dan
        terlihat sempurna di setiap ukuran, di setiap layar, selamanya.
      </p>
      <p>
        Ukuran file adalah keunggulan utama lainnya untuk grafis sederhana. Ikon sederhana —
        tanda centang, panah, menu hamburger — mungkin dideskripsikan dalam file SVG menggunakan
        200–500 byte. PNG yang setara pada resolusi Retina 2× mungkin 2–5 KB. Pada 3×, lebih besar
        lagi. Ketika antarmuka memiliki 50 ikon, perbedaan antara 50 SVG yang dioptimalkan
        (total ~20 KB) dan 50 set PNG (total ~300+ KB) itu bermakna.
      </p>
      <p>
        Gambar raster menang untuk konten fotografi dan ilustrasi yang sangat detail dengan gradien
        dan tekstur halus. SVG vektor dari foto akan sangat besar dan terlihat bergaya bukan
        fotografi. Format yang tepat sepenuhnya tergantung pada sifat kontennya.
      </p>

      <h2>Anatomi SVG: Elemen Inti</h2>
      <p>
        File SVG minimal memiliki struktur ini:
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
{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
  <path d="M8 12 L12 16 L16 8" stroke="white" stroke-width="2" fill="none" />
</svg>`}
      </pre>
      <p>
        Elemen dan atribut utama yang perlu dipahami:
      </p>
      <ul>
        <li>
          <strong>viewBox</strong> — Mendefinisikan sistem koordinat internal. <code>viewBox="0 0 24 24"</code>{" "}
          berarti ruang gambar membentang dari (0,0) hingga (24,24). SVG kemudian dapat dirender
          pada ukuran sebenarnya mana pun — 16×16, 32×32, 200×200 — dan browser menskalakan sistem
          koordinat agar sesuai. Inilah mekanisme di balik independensi resolusi.
        </li>
        <li>
          <strong>path</strong> — Elemen SVG yang paling kuat. Atribut <code>d</code> berisi
          perintah menggambar: <code>M</code> (pindah ke), <code>L</code> (garis ke), <code>C</code>{" "}
          (kurva bezier kubik), <code>A</code> (busur), <code>Z</code> (tutup path). Hampir setiap
          bentuk dapat diekspresikan sebagai path.
        </li>
        <li>
          <strong>circle, rect, ellipse, line, polygon</strong> — Elemen kenyamanan untuk bentuk
          umum. <code>&lt;circle&gt;</code> mengambil <code>cx</code>, <code>cy</code>, dan{" "}
          <code>r</code>. <code>&lt;rect&gt;</code> mengambil <code>x</code>, <code>y</code>,{" "}
          <code>width</code>, dan{" "}
          <code>height</code>, ditambah <code>rx</code> opsional untuk sudut membulat.
        </li>
        <li>
          <strong>text</strong> — SVG dapat merender teks tipografi yang diskalakan bersama gambar
          dan tetap dapat dipilih dan diakses, tidak seperti teks yang dirender ke dalam gambar
          raster.
        </li>
        <li>
          <strong>g (group)</strong> — Mengelompokkan elemen anak bersama sehingga transform,
          style, dan opacity dapat diterapkan ke seluruh grup sekaligus.
        </li>
        <li>
          <strong>defs dan use</strong> — Mendefinisikan elemen yang dapat digunakan kembali
          sekali dan mereferensikannya beberapa kali dengan <code>&lt;use&gt;</code>. Penting
          untuk sistem ikon yang menggunakan sprite SVG tunggal.
        </li>
      </ul>

      <h2>Styling SVG dengan CSS dan Menganimasikannya</h2>
      <p>
        Elemen SVG adalah bagian dari DOM ketika SVG di-inline dalam HTML. Ini berarti CSS dapat
        menargetkannya secara langsung menggunakan semua selektor yang sama yang digunakan untuk
        elemen HTML. Kamu bisa mengubah warna fill, lebar stroke, dan opacity saat hover, dalam
        dark mode, atau sebagai respons terhadap perubahan state apa pun:
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
{`/* Target SVG elements with CSS */
.icon-check circle {
  fill: #22c55e;
  transition: fill 0.2s ease;
}

.icon-check:hover circle {
  fill: #16a34a;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .icon-check circle { fill: #4ade80; }
}`}
      </pre>
      <p>
        Animasi dan transisi CSS bekerja pada properti SVG. Trik <code>stroke-dasharray</code> dan{" "}
        <code>stroke-dashoffset</code> — menganimasikan path dari tak terlihat menjadi terlihat
        dengan memanipulasi seberapa banyak stroke putus-putus yang ditampilkan — menciptakan efek
        "menggambar" yang terlihat pada banyak indikator loading dan ilustrasi onboarding. SVG juga
        memiliki elemen <code>&lt;animate&gt;</code> dan{" "}
        <code>&lt;animateTransform&gt;</code> sendiri (animasi SMIL), meskipun animasi CSS dan
        JavaScript umumnya lebih disukai untuk kemudahan pemeliharaan.
      </p>
      <p>
        Menggunakan <code>currentColor</code> sebagai nilai fill membuat ikon SVG mewarisi warna
        teks elemen induknya secara otomatis, memungkinkan satu ikon beradaptasi ke konteks warna
        apa pun tanpa modifikasi.
      </p>

      <h2>Optimasi SVG dengan SVGO</h2>
      <p>
        File SVG yang diekspor dari alat desain seperti Figma atau Illustrator mengandung banyak
        bloat yang tidak perlu: metadata editor, atribut yang redundan, wrapper grup tanpa efek,
        koordinat floating-point dengan delapan tempat desimal, atribut <code>id</code> yang
        dibuat oleh sistem node internal alat desain. Untuk ikon sederhana, overhead ini dapat
        melipattigakan atau melipatempat ukuran file dibandingkan versi yang dioptimalkan secara
        manual.
      </p>
      <p>
        SVGO (SVG Optimizer) adalah alat standar untuk menghapus overhead ini. Ia menerapkan
        sekumpulan transformasi yang dapat dikonfigurasi: menciutkan grup bersarang, menghapus
        elemen tak terlihat, membulatkan koordinat ke presisi yang wajar, menggabungkan path yang
        redundan, menghapus metadata dan komentar, dan lainnya. Pass SVGO yang khas mengurangi
        ukuran file SVG ikon sebesar 30–60% tanpa perubahan visual.
      </p>
      <p>
        {" "}
        <a href="/tools/svg">BrowseryTools SVG Tool</a> menerapkan optimasi SVG di browsermu,
        memberikan output yang dioptimalkan tanpa menginstal alat command-line apa pun.
      </p>

      <h2>Inline SVG vs File Eksternal vs CSS Background</h2>
      <p>
        Ada tiga cara utama untuk menyertakan SVG di halaman web, masing-masing dengan trade-off
        yang berbeda:
      </p>
      <ul>
        <li>
          <strong>Inline SVG</strong> — Markup SVG disematkan langsung dalam HTML. Memberikan
          akses CSS dan JavaScript penuh ke setiap elemen di dalam SVG. Terbaik untuk ikon yang
          membutuhkan efek hover, perubahan warna, atau animasi. Tidak dapat di-cache secara
          terpisah oleh browser.
        </li>
        <li>
          <strong>File SVG eksternal melalui <code>&lt;img&gt;</code></strong> — SVG adalah file
          terpisah yang direferensikan dengan <code>&lt;img src="icon.svg"&gt;</code>. Browser
          dapat men-cache file tersebut. Mudah digunakan. Namun CSS dari halaman induk tidak dapat
          menjangkau ke dalam SVG, dan JavaScript tidak dapat memanipulasi isinya.
        </li>
        <li>
          <strong>CSS background-image</strong> — SVG direferensikan sebagai CSS background.
          Cocok untuk grafis dekoratif semata. SVG juga dapat di-inline sebagai data URI dalam
          CSS, berguna untuk ikon kecil dalam stylesheet komponen. CSS tidak dapat me-restyle
          elemen di dalam SVG.
        </li>
      </ul>
      <p>
        SVG sprite sheet — satu file SVG yang berisi semua ikon yang didefinisikan dalam blok{" "}
        <code>&lt;defs&gt;</code>,
        direferensikan dengan <code>&lt;use href="sprite.svg#icon-name"&gt;</code> — menawarkan
        keseimbangan yang baik: satu request jaringan yang dapat di-cache untuk semua ikon, dengan
        manipulasi DOM per-ikon yang memungkinkan di sebagian besar browser modern.
      </p>

      <h2>Jebakan SVG Umum: XSS melalui SVG</h2>
      <p>
        SVG mendukung skrip tertanam, handler event, dan referensi sumber eksternal, yang
        menjadikannya vektor serangan yang layak untuk cross-site scripting (XSS) jika file SVG
        yang diunggah pengguna ditampilkan dalam konteks browser. File SVG yang berisi{" "}
        <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> akan mengeksekusi skrip
        tersebut jika browser merender SVG sebagai bagian dari halaman.
      </p>
      <p>
        Aturan untuk menangani SVG yang diunggah pengguna dengan aman:
      </p>
      <ul>
        <li>
          Jangan pernah meng-inline SVG yang diunggah pengguna dalam HTML-mu. Hanya inline SVG
          yang kamu kendalikan.
        </li>
        <li>
          Jika kamu harus menampilkan SVG yang diunggah pengguna, sajikan dari origin yang terpisah
          dan di-sandbox dan tampilkan dalam tag <code>&lt;img&gt;</code> atau{" "}
          <code>&lt;iframe&gt;</code> yang di-sandbox. Tag{" "}
          <code>&lt;img&gt;</code> tidak mengeksekusi skrip dalam SVG.
        </li>
        <li>
          Sanitasi SVG yang diunggah pengguna dengan menjalankannya melalui sanitizer (DOMPurify
          dengan konfigurasi SVG) sebelum menyimpan atau menampilkannya.
        </li>
        <li>
          Tetapkan header Content Security Policy untuk membatasi sumber skrip pada halaman yang
          menampilkan SVG.
        </li>
      </ul>

      <h2>Mengkonversi SVG ke PNG</h2>
      <p>
        Beberapa konteks tidak mendukung SVG: klien email lama, platform CMS tertentu, beberapa
        pipeline pemrosesan gambar, persyaratan ikon aplikasi untuk iOS dan Android, dan gambar
        pratinjau Open Graph. Dalam kasus ini, kamu perlu mengekspor SVG sebagai PNG yang
        dirasterisasi.
      </p>
      <p>
        Karena SVG dapat diskalakan tanpa rugi, kamu bisa mengekspor ke PNG dalam ukuran berapa
        pun. Untuk ikon aplikasi, ini berarti mengekspor satu sumber SVG pada 1024×1024 dan
        menurunkan semua ukuran yang lebih kecil darinya. Untuk penggunaan web Retina, ekspor
        pada 2× atau 3× ukuran tampil CSS.
      </p>
      <p>
        {" "}
        <a href="/tools/svg">BrowseryTools SVG Tool</a> dapat merender SVG ke PNG pada resolusi
        yang kamu pilih, menangani konversi di dalam browser tanpa upload server apa pun. Berguna
        ketika kamu memiliki SVG dari alat desain dan membutuhkan PNG untuk konteks yang tidak
        menerima SVG.
      </p>

      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Referensi cepat:</strong> Gunakan SVG untuk ikon, logo, ilustrasi, elemen UI,
        dan apa pun yang perlu diskalakan. Gunakan PNG (dikonversi dari SVG) untuk konteks yang
        memerlukan gambar raster. Selalu jalankan file SVG melalui SVGO sebelum dikirim. Jangan
        pernah meng-inline SVG yang diunggah pengguna langsung dalam HTML-mu. Gunakan{" "}
        <code>currentColor</code> untuk ikon yang perlu beradaptasi dengan konteks warna teks mereka.
      </div>
    </div>
  );
}
