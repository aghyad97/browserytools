export default function Content() {
  return (
    <div>
      <p>
        Gradient CSS adalah salah satu alat paling powerful dan kurang dimanfaatkan dalam toolkit pengembang
        frontend. Mereka memungkinkan Anda membuat transisi warna yang mulus, latar belakang yang dramatis,
        poles UI yang halus, dan bahkan pola visual kompleks — semua tanpa satu file gambar pun. Sebelum
        gradient CSS didukung secara universal, desainer harus mengekspor latar belakang gradient sebagai
        PNG dari Photoshop, menghasilkan permintaan HTTP tambahan, aset statis yang tidak fleksibel, dan
        tata letak yang rusak begitu seseorang mengubah warna merek. Sekarang, satu baris CSS menggantikan
        semua itu.
      </p>
      <p>
        Panduan ini mencakup semua yang perlu Anda ketahui tentang gradient CSS — tiga jenisnya, sistem
        sudut, kasus penggunaan dunia nyata dengan kode siap salin, kesalahan umum, dan cara menggunakan{" "}
        <a href="/tools/css-gradient">Generator Gradient CSS BrowseryTools</a> untuk membangun apa yang
        Anda butuhkan tanpa menulis satu baris pun dari awal.
      </p>

      <h2>Mengapa Gradient CSS Menggantikan Latar Belakang Berbasis Gambar</h2>
      <p>
        Pendekatan lama — mengekspor PNG gradient 1×1000px dan mengulanginya secara horizontal — memiliki
        biaya nyata. Setiap gradient adalah round-trip ke server, biaya byte-over-the-wire, dan beban
        pemeliharaan ketika warna berubah. Yang lebih penting, gradient PNG tidak dapat merespons secara
        dinamis terhadap ukuran layar, pergantian tema, atau status hover.
      </p>
      <p>
        Gradient CSS memecahkan semua ini. Mereka dirender oleh GPU secara real time, merespons perubahan
        state JavaScript secara instan, menskalakan sempurna di resolusi mana pun, bekerja dengan transisi
        dan animasi CSS, dan menambahkan nol byte ke bundle aset Anda. Dukungan browser kini 100% di semua
        browser modern dan telah demikian sejak 2014. Tidak ada alasan untuk menggunakan gradient berbasis
        gambar untuk transisi warna solid dalam proyek baru.
      </p>

      <h2>Tiga Jenis Gradient CSS</h2>

      <h3>1. Linear Gradient</h3>
      <p>
        Linear gradient mentransisikan warna sepanjang garis lurus. Arahnya bisa sudut berapa pun, atau
        diekspresikan sebagai kata kunci seperti <code>to right</code> atau <code>to bottom right</code>.
        Ini adalah jenis gradient yang paling sering digunakan dan mencakup sebagian besar kebutuhan desain.
      </p>
      <pre><code>{`/* Gradient ungu diagonal klasik */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Atas ke bawah (arah default) */
background: linear-gradient(#f8fafc, #e2e8f0);

/* Kiri ke kanan dengan tiga color stop */
background: linear-gradient(to right, #f97316, #ec4899, #8b5cf6);`}</code></pre>

      <h3>2. Radial Gradient</h3>
      <p>
        Radial gradient memancar keluar dari titik pusat. Secara default membentuk elips yang muat dalam
        bounding box elemen, tetapi Anda dapat mengontrol bentuk, ukuran, dan posisi. Radial gradient
        ideal untuk efek spotlight, tombol bercahaya, dan simulasi cahaya ambien.
      </p>
      <pre><code>{`/* Cahaya lingkaran dari tengah */
background: radial-gradient(circle, #6366f1 0%, #1e1b4b 100%);

/* Cahaya elips di sudut kiri atas */
background: radial-gradient(ellipse at top left, #fbbf24 0%, transparent 60%);

/* Spotlight berposisi */
background: radial-gradient(circle at 30% 40%, #e0f2fe, #0284c7);`}</code></pre>

      <h3>3. Conic Gradient</h3>
      <p>
        Conic gradient menyapu warna di sekitar titik pusat, seperti jarum jam. Ini membuatnya sangat cocok
        untuk pie chart, roda warna, dan animasi loading spinner. Ini adalah yang terakhir dari tiga jenis
        gradient yang mendapatkan dukungan universal, hadir di semua browser utama pada 2021.
      </p>
      <pre><code>{`/* Pie chart dengan tiga segmen */
background: conic-gradient(
  #6366f1 0deg 120deg,
  #ec4899 120deg 240deg,
  #f97316 240deg 360deg
);

/* Roda warna */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);`}</code></pre>

      <h2>Memahami Sistem Sudut untuk Linear Gradient</h2>
      <p>
        Parameter sudut dalam <code>linear-gradient</code> mengikuti konvensi yang mengejutkan banyak
        pengembang karena berbeda dari sudut matematika standar. Berikut pemetaannya:
      </p>
      <ul>
        <li><strong>0deg</strong> — bawah ke atas (gradient mengalir ke atas)</li>
        <li><strong>90deg</strong> — kiri ke kanan (gradient horizontal paling umum)</li>
        <li><strong>135deg</strong> — diagonal, kiri atas ke kanan bawah</li>
        <li><strong>180deg</strong> — atas ke bawah (sama dengan default tanpa sudut yang ditentukan)</li>
        <li><strong>225deg</strong> — diagonal, kanan bawah ke kiri atas</li>
        <li><strong>270deg</strong> — kanan ke kiri</li>
      </ul>
      <p>
        Padanan kata kunci — <code>to top</code>, <code>to right</code>, <code>to bottom left</code> —
        sering lebih mudah dibaca daripada sudut numerik untuk arah umum. Untuk efek diagonal yang presisi,
        derajat numerik memberi Anda kontrol tepat. Gradient diagonal ungu-ke-indigo populer menggunakan{" "}
        <code>135deg</code>:
      </p>
      <pre><code>{`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`}</code></pre>

      <h2>Bentuk Radial Gradient: Circle vs Ellipse</h2>
      <p>
        Secara default, <code>radial-gradient</code> menghasilkan elips yang berukuran sesuai elemen. Anda
        dapat menggantinya dengan dua kata kunci bentuk:
      </p>
      <ul>
        <li>
          <strong>circle</strong> — memaksa lingkaran sempurna terlepas dari rasio aspek elemen. Gunakan ini
          untuk efek glow dan latar belakang spotlight di mana Anda ingin penurunan radial yang merata ke
          semua arah.
        </li>
        <li>
          <strong>ellipse</strong> — default, meregang untuk muat kontainer. Gunakan ini untuk isian latar
          belakang yang halus yang perlu beradaptasi secara alami dengan bentuk elemen apa pun.
        </li>
      </ul>
      <p>
        Kata kunci <code>at</code> memungkinkan Anda memposisikan ulang pusat gradient di mana saja dalam
        elemen menggunakan panjang atau persentase CSS apa pun. <code>at center</code>,{" "}
        <code>at top left</code>, <code>at 20% 80%</code> — semuanya valid. Positioning sangat powerful
        untuk menciptakan efek cahaya ambien yang tidak terpusat:
      </p>
      <pre><code>{`/* Cahaya dari sudut kanan atas */
background: radial-gradient(ellipse at top right, rgba(251,191,36,0.4), transparent 60%);

/* Beberapa radial gradient yang berlapis */
background:
  radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%),
  #0f172a;`}</code></pre>

      <h2>Conic Gradient untuk Pie Chart dan Loading Spinner</h2>
      <p>
        Kemampuan conic gradient untuk menyapu dalam lingkaran menjadikannya solusi CSS native untuk dua
        komponen UI klasik yang sebelumnya memerlukan SVG atau JavaScript:
      </p>
      <p>
        Untuk <strong>progress ring</strong>, gabungkan conic gradient dengan masker melingkar. Untuk pie
        chart, segmen conic gradient bersesuaian langsung dengan persentase data. Segmen yang mencakup dari
        <code>0deg</code> hingga <code>72deg</code> merepresentasikan tepat 20% dari lingkaran penuh. Ini
        membuat translasi data ke CSS menjadi mudah — kalikan persentase dengan 3,6 untuk mendapatkan nilai
        derajat.
      </p>

      <h2>Multi-Stop Gradient dan Hard Stop untuk Pola Stripe</h2>
      <p>
        Color stop tidak harus bercampur dengan mulus. Ketika dua stop yang berdekatan berbagi posisi yang
        sama, transisi di antara mereka menjadi instan — hard stop. Teknik ini adalah cara Anda membuat
        pola bergaris, papan catur, dan latar belakang bergaris seluruhnya dalam CSS:
      </p>
      <pre><code>{`/* Pola candy stripe menggunakan hard stop */
background: linear-gradient(
  45deg,
  #6366f1 25%,
  transparent 25%,
  transparent 50%,
  #6366f1 50%,
  #6366f1 75%,
  transparent 75%
);
background-size: 40px 40px;

/* Stripe peringatan — hard stop warna bergantian */
background: repeating-linear-gradient(
  -45deg,
  #fbbf24,
  #fbbf24 10px,
  #1e293b 10px,
  #1e293b 20px
);`}</code></pre>

      <h2>Kasus Penggunaan Dunia Nyata dengan Contoh Kode</h2>

      <h3>Latar Belakang Bagian Hero</h3>
      <p>
        Linear gradient multi-stop dengan jalinan dua sorotan radial memberi bagian hero kedalaman ilustrasi
        kustom tanpa file gambar apa pun:
      </p>
      <pre><code>{`.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15), transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
}`}</code></pre>

      <h3>Efek Hover Tombol</h3>
      <p>
        Gradient dapat dianimasikan saat hover menggunakan trik <code>background-position</code> — ukurkan
        gradient ke 200% dan geser posisinya saat hover:
      </p>
      <pre><code>{`.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.4s ease;
}
.btn:hover {
  background-position: 100% 50%;
}`}</code></pre>

      <h3>Border Kartu dengan border-image</h3>
      <p>
        Properti <code>border-image</code> menerima gradient, memungkinkan border gradient tanpa elemen
        pembungkus atau hack pseudo-element (untuk latar belakang solid):
      </p>
      <pre><code>{`.card-gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #6366f1, #ec4899) border-box;
}`}</code></pre>

      <h3>Progress Bar</h3>
      <p>
        Progress bar dengan gradient mengkomunikasikan nilai dan energi visual sekaligus. Pasangkan dengan
        transisi <code>width</code> untuk animasi yang mulus:
      </p>
      <pre><code>{`.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  width: 73%; /* Dikontrol oleh JS atau custom property CSS */
  transition: width 0.6s ease;
}`}</code></pre>

      <h2>Perbandingan Jenis Gradient</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Jenis Gradient</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Fungsi CSS</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kasus Penggunaan Terbaik</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Contoh</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Latar belakang hero, tombol, banner</td>
              <td style={{padding: "12px 16px"}}><code>135deg, #667eea, #764ba2</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Radial</strong></td>
              <td style={{padding: "12px 16px"}}><code>radial-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Glow, spotlight, cahaya ambien</td>
              <td style={{padding: "12px 16px"}}><code>circle at center, #6366f1, #1e1b4b</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Conic</strong></td>
              <td style={{padding: "12px 16px"}}><code>conic-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Pie chart, roda warna, spinner</td>
              <td style={{padding: "12px 16px"}}><code>#6366f1 0deg 120deg, #ec4899 120deg 240deg</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Repeating Linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>repeating-linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Pola stripe, garis</td>
              <td style={{padding: "12px 16px"}}><code>-45deg, #fbbf24 0 10px, #1e293b 10px 20px</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Tips Memilih Warna Gradient yang Baik</h2>
      <p>
        Kesalahan paling umum saat memilih warna gradient adalah langsung melompat melintasi roda warna —
        misalnya, memadukan langsung dari merah ke hijau. Karena titik tengah transisi tersebut melewati
        warna coklat keabu-abuan yang kusam, hasilnya terlihat tidak menarik meskipun warna titik akhirnya
        menarik secara individual.
      </p>
      <p>
        Solusinya adalah melewati rona perantara yang lebih jenuh. Alih-alih merah-ke-hijau secara langsung,
        coba merah → oranye → hijau-kuning untuk transisi yang hidup. Atau, tetap dalam rentang rona yang
        berdekatan — keluarga ungu-ke-pink, keluarga indigo-ke-sian — yang selalu menghasilkan hasil bersih
        karena titik tengah tetap jenuh.
      </p>
      <p>
        Beberapa panduan praktis:
      </p>
      <ul>
        <li>Jaga saturasi tinggi di kedua ujung jika Anda ingin gradient yang hidup. Memadukan warna jenuh ke warna tidak jenuh menciptakan zona mati yang canggung di tengah.</li>
        <li>Memadukan nilai kecerahan yang berbeda (terang ke gelap) dalam keluarga rona yang sama hampir selalu terlihat profesional dan berfungsi dengan baik sebagai latar belakang UI.</li>
        <li>Tambahkan color stop perantara di 50% untuk mengarahkan rona titik tengah — ini adalah koreksi tunggal paling powerful untuk gradient yang kusam.</li>
        <li>Batasi gradient ke dua atau tiga stop untuk sebagian besar pekerjaan UI. Lebih dari tiga stop biasanya terlihat kacau kecuali Anda sengaja membuat pelangi atau visualisasi data.</li>
      </ul>

      <h2>Aksesibilitas: Teks di Atas Gradient</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Peringatan aksesibilitas:</strong> Jangan pernah menempatkan teks di atas latar belakang
        gradient tanpa memeriksa kontras di setiap titik sepanjang gradient. Gradient yang memberikan
        kontras 7:1 di ujung gelap mungkin turun ke 1,5:1 di ujung terang, membuat teks tidak terbaca
        bagi pengguna dengan penglihatan rendah. WCAG AA memerlukan rasio kontras minimum 4,5:1 untuk
        teks normal. Gunakan overlay gelap, batasi teks ke bagian kontras tinggi dari gradient, atau pilih
        rentang gradient yang mempertahankan kontras yang cukup di seluruh rentangnya.
      </div>

      <h2>Menggunakan Generator Gradient CSS BrowseryTools</h2>
      <p>
        <a href="/tools/css-gradient">Generator Gradient CSS</a> memberi Anda pratinjau visual langsung
        saat Anda mengonfigurasi setiap parameter. Berikut cara menggunakannya secara efektif:
      </p>
      <ul>
        <li><strong>Pilih jenis gradient:</strong> Beralih antara Linear, Radial, dan Conic di bagian atas alat.</li>
        <li><strong>Tambahkan color stop:</strong> Klik bilah gradient untuk menambahkan stop baru. Seret stop ke kiri dan kanan untuk menyesuaikan posisinya. Klik stop untuk membuka color picker dan mengubah warna serta opasitasnya.</li>
        <li><strong>Sesuaikan arah atau sudut:</strong> Untuk gradient linear, seret roda sudut atau ketikkan nilai derajat yang tepat. Untuk gradient radial, atur bentuk dan posisi.</li>
        <li><strong>Pratinjau dalam konteks:</strong> Pratinjau langsung diperbarui secara instan. Anda dapat melihat persis bagaimana gradient Anda akan terlihat sebelum menyalin satu baris pun.</li>
        <li><strong>Salin CSS:</strong> Tekan tombol Salin CSS untuk mendapatkan CSS siap produksi untuk properti <code>background</code>, siap ditempel ke stylesheet atau framework apa pun.</li>
      </ul>
      <p>
        Semuanya berjalan di browser Anda. Tidak ada definisi gradient yang dikirim ke mana pun — ini
        adalah alat sisi klien murni. Anda dapat menggunakannya secara offline setelah halaman dimuat.
      </p>

      <h2>Dukungan Browser</h2>
      <p>
        Gradient CSS telah didukung di semua browser utama sejak 2014, membuatnya aman digunakan tanpa
        polyfill atau fallback apa pun di hampir setiap lingkungan produksi. Conic gradient hadir
        belakangan tetapi kini didukung penuh di Chrome 69+, Firefox 83+, Safari 12.1+, dan Edge 79+ —
        mencakup lebih dari 97% penggunaan browser global pada 2026. Satu-satunya skenario di mana Anda
        mungkin memerlukan fallback adalah mendukung versi WebView Android yang sangat lama dalam aplikasi
        mobile enterprise.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Bangun gradient apa pun secara visual — tanpa perlu kode
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Pratinjau langsung, CSS siap salin, dan kontrol penuh atas stop, sudut, dan posisi.
          Berjalan sepenuhnya di browser Anda tanpa data yang dikirim ke server mana pun.
        </p>
        <a
          href="/tools/css-gradient"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Buka Generator Gradient CSS →
        </a>
      </div>
    </div>
  );
}
