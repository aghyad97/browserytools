export default function Content() {
  return (
    <div>
      <p>
        Setiap kali Anda mengerutkan mata melihat sebuah situs web karena teksnya terlalu terang, atau
        kesulitan membaca label tombol karena menyatu dengan latar belakang, Anda sedang mengalami
        kegagalan kontras. Bagi kebanyakan orang, ini hanya sedikit menjengkelkan. Namun bagi sebagian
        besar populasi — mereka yang memiliki gangguan penglihatan warna, penglihatan rendah, mata yang
        mulai menua, atau siapa saja yang menggunakan layar di bawah sinar matahari terik — hal ini
        membuat konten benar-benar tidak dapat diakses. Kontras warna adalah salah satu aspek aksesibilitas
        web yang paling berdampak dan paling sering dilanggar, namun juga salah satu yang paling mudah
        diperbaiki begitu Anda memahami aturannya. Panduan ini menjelaskan standar, matematika, kesalahan
        umum, dan cara menggunakan{" "}
        <a href="/tools/contrast-checker">BrowseryTools Color Contrast Checker</a> untuk memverifikasi
        pasangan warna apa pun secara instan di browser Anda.
      </p>

      <h2>Mengapa Kontras Itu Penting</h2>
      <p>
        Skala populasi yang terdampak jauh lebih besar dari yang diperkirakan kebanyakan desainer. Menurut
        Organisasi Kesehatan Dunia, sekitar 2,2 miliar orang di seluruh dunia memiliki suatu bentuk
        gangguan penglihatan jarak dekat atau jarak jauh. Defisiensi penglihatan warna — yang umumnya
        disebut buta warna — mempengaruhi sekitar 8% pria dan 0,5% wanita keturunan Eropa Utara, artinya
        sekitar 300 juta orang di seluruh dunia mengalami kesulitan membedakan warna tertentu.
      </p>
      <p>
        Di luar kondisi permanen, kontras mempengaruhi semua orang secara situasional:
      </p>
      <ul>
        <li>Membaca ponsel di bawah sinar matahari terik di luar ruangan akan menghapus teks berkon­tras rendah sepenuhnya.</li>
        <li>Monitor lama atau murah memiliki kecerahan yang berkurang dan akurasi warna yang lebih buruk.</li>
        <li>Penderita migrain dan orang dengan fotosensitivitas sering menggunakan layar dengan kecerahan rendah.</li>
        <li>Silau layar dari jendela atau lampu di atas kepala secara efektif mengurangi kontras yang dirasakan.</li>
        <li>Pengguna yang terburu-buru — pada dasarnya semua orang — memproses konten berkontras tinggi lebih cepat.</li>
      </ul>
      <p>
        Kontras yang baik bukan akomodasi khusus. Kontras yang baik meningkatkan pengalaman setiap
        pengguna, di setiap perangkat, dalam setiap kondisi pencahayaan.
      </p>

      <h2>Apa Itu Rasio Kontras?</h2>
      <p>
        Rasio kontras adalah angka standar yang mengungkapkan seberapa berbeda dua warna dalam hal
        kecerahan relatifnya (luminansi). Rasio ini selalu dinyatakan sebagai perbandingan: warna yang
        lebih terang dibagi warna yang lebih gelap, dengan 0,05 ditambahkan ke masing-masing untuk
        menghindari pembagian dengan nol dan untuk memperhitungkan cahaya sekitar pada layar nyata.
      </p>
      <p>
        Rentangnya dari <strong>1:1</strong> (dua warna identik — nol kontras, sama sekali tidak dapat
        dibaca) hingga <strong>21:1</strong> (hitam murni di atas putih murni — kontras maksimum yang
        mungkin). Semakin tinggi rasionya, semakin mudah dibedakan kedua warna tersebut.
      </p>

      <h2>Cara Menghitung Rasio Kontras</h2>
      <p>
        Formula yang digunakan oleh WCAG (dan seluruh ekosistem standar web) mengandalkan konsep
        luminansi relatif — ukuran seberapa banyak cahaya yang tampak dipancarkan suatu warna, disesuaikan
        dengan persepsi visual manusia. Perhitungan dilakukan dalam dua langkah.
      </p>
      <p>
        <strong>Langkah 1: Hitung luminansi relatif (L) untuk setiap warna.</strong>
      </p>
      <p>
        Pertama, konversi setiap saluran RGB dari rentang 0–255 ke skala linier 0–1, lalu terapkan
        formula ekspansi gamma untuk memperhitungkan cara layar mengkodekan kecerahan:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`// Untuk setiap nilai saluran c dalam [0, 1]:
if c <= 0.04045:
    c_linear = c / 12.92
else:
    c_linear = ((c + 0.055) / 1.055) ^ 2.4

L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}
      </pre>
      <p>
        Koefisien 0,2126, 0,7152, dan 0,0722 mencerminkan sensitivitas warna manusia: mata kita paling
        sensitif terhadap hijau, cukup sensitif terhadap merah, dan paling tidak sensitif terhadap biru.
      </p>
      <p>
        <strong>Langkah 2: Hitung rasio kontras.</strong>
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`Rasio Kontras = (L_lebih_terang + 0.05) / (L_lebih_gelap + 0.05)`}
      </pre>
      <p>
        Di mana <code>L_lebih_terang</code> adalah luminansi relatif warna yang lebih terang dan{" "}
        <code>L_lebih_gelap</code> adalah luminansi relatif warna yang lebih gelap.
      </p>

      <h3>Contoh Perhitungan</h3>
      <ul>
        <li>
          <strong>Hitam (#000000) di atas putih (#FFFFFF):</strong> L(putih) = 1,0, L(hitam) = 0,0.
          Rasio = (1,0 + 0,05) / (0,0 + 0,05) = 1,05 / 0,05 = <strong>21:1</strong>. Kontras maksimum yang mungkin.
        </li>
        <li>
          <strong>Abu-abu #767676 di atas putih (#FFFFFF):</strong> L(#767676) ≈ 0,216.
          Rasio = (1,0 + 0,05) / (0,216 + 0,05) ≈ 1,05 / 0,266 ≈ <strong>4,54:1</strong>.
          Ini hampir lolos WCAG AA untuk teks normal.
        </li>
        <li>
          <strong>Abu-abu #999999 di atas putih (#FFFFFF):</strong> L(#999999) ≈ 0,319.
          Rasio = (1,0 + 0,05) / (0,319 + 0,05) ≈ 1,05 / 0,369 ≈ <strong>2,85:1</strong>.
          Ini gagal WCAG AA untuk teks ukuran apa pun.
        </li>
      </ul>

      <h2>WCAG: Standar yang Mendefinisikan Persyaratan Aksesibilitas</h2>
      <p>
        Web Content Accessibility Guidelines (WCAG) diterbitkan oleh World Wide Web Consortium (W3C)
        dan mendefinisikan standar yang diakui secara internasional untuk aksesibilitas web. Versi yang
        saat ini digunakan secara luas dalam regulasi adalah WCAG 2.1, yang diterbitkan pada 2018. WCAG
        3.0 sedang dalam pengembangan dan pada akhirnya akan menggantikannya dengan sistem pengukuran
        yang lebih bernuansa, namun WCAG 2.1 tetap menjadi standar operatif untuk tujuan kepatuhan.
      </p>
      <p>
        WCAG mengorganisasikan persyaratan ke dalam tiga tingkat kesesuaian: A (minimum), AA (standar),
        dan AAA (ditingkatkan). Level AA adalah yang paling banyak diwajibkan oleh kerangka hukum.
        Level AAA bersifat aspirasional dan tidak diwajibkan untuk seluruh situs, hanya untuk konteks
        tertentu.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1rem", color: "#1d4ed8"}}>
          Persyaratan Kontras WCAG 2.1 Sekilas
        </p>
        <ul style={{marginTop: 0, marginBottom: 0}}>
          <li>
            <strong>Level AA — Teks normal:</strong> rasio kontras minimum <strong>4,5:1</strong>
          </li>
          <li>
            <strong>Level AA — Teks besar:</strong> rasio kontras minimum <strong>3:1</strong>
            (teks besar = 18pt / 24px bobot reguler, atau 14pt / ~18,67px bobot tebal)
          </li>
          <li>
            <strong>Level AA — Komponen UI dan objek grafis:</strong> rasio kontras minimum <strong>3:1</strong>
            (berlaku untuk tepi tombol, garis tepi kolom input, ikon yang menyampaikan makna)
          </li>
          <li>
            <strong>Level AAA — Teks normal:</strong> rasio kontras minimum <strong>7:1</strong>
          </li>
          <li>
            <strong>Level AAA — Teks besar:</strong> rasio kontras minimum <strong>4,5:1</strong>
          </li>
        </ul>
      </div>

      <p>
        Penting untuk dicatat apa yang <em>tidak</em> berlaku untuk persyaratan kontras: gambar dekoratif
        tanpa konten informasi, logo dan wordmark merek, serta teks yang merupakan bagian dari komponen
        UI yang tidak aktif (tombol nonaktif, misalnya) semuanya dikecualikan dari persyaratan kontras
        di bawah WCAG 2.1. Tujuannya adalah melindungi konten informasional, bukan elemen dekoratif semata.
      </p>

      <h2>Pasangan Warna: Contoh Lulus dan Gagal</h2>
      <p>
        Rasio kontras suatu pasangan warna sepenuhnya bergantung pada luminansi relatif kedua warna —
        bukan pada warna mana yang "lebih indah" atau mana yang tampak serupa bagi Anda. Berikut adalah
        contoh representatif di sepanjang spektrum lulus/gagal:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Warna Teks</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Warna Latar</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Rasio Kontras</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AA Normal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AAA Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#000000</code> (hitam)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><strong>21:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#1a1a2e</code> (biru tua gelap)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><strong>18,1:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#595959</code> (abu-abu gelap)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><strong>7,0:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#767676</code> (abu-abu sedang)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><strong>4,54:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><code>#4f46e5</code> (indigo)</td>
              <td style={{padding: "12px 16px"}}><strong>5,9:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Lulus</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#999999</code> (abu-abu terang)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><strong>2,85:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (putih)</td>
              <td style={{padding: "12px 16px"}}><code>#ffdd00</code> (kuning)</td>
              <td style={{padding: "12px 16px"}}><strong>1,29:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#0000ee</code> (tautan biru)</td>
              <td style={{padding: "12px 16px"}}><code>#6b21a8</code> (ungu)</td>
              <td style={{padding: "12px 16px"}}><strong>1,7:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gagal</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Kesalahan Kontras Umum</h2>
      <p>
        Kesalahan yang sama berulang kali muncul dalam audit aksesibilitas di seluruh web. Mengetahui
        nama-namanya memudahkan Anda menemukan kesalahan tersebut dalam pekerjaan Anda sendiri.
      </p>

      <h3>Teks Abu-Abu Terang di Atas Putih</h3>
      <p>
        Ini adalah kegagalan kontras yang paling umum di web modern. Tren desain menuju minimalisme
        telah menghasilkan generasi antarmuka di mana teks isi, teks keterangan, metadata, dan teks
        placeholder dirender dalam warna seperti <code>#aaaaaa</code>, <code>#bbbbbb</code>, atau{" "}
        <code>#cccccc</code> di atas latar putih. Kombinasi ini biasanya menghasilkan rasio kontras
        antara 1,5:1 dan 2,5:1 — jauh di bawah minimum 4,5:1. Desainer bisa membacanya di monitor
        studio yang terkalibrasi di ruangan redup; pengguna akhir di smartphone di bawah sinar matahari
        siang tidak bisa.
      </p>

      <h3>Teks Putih di Atas Tombol Berwarna</h3>
      <p>
        Teks putih di atas kuning (<code>#ffdd00</code>), hijau limau (<code>#84cc16</code>), atau latar
        oranye muda (<code>#fb923c</code>) gagal WCAG AA untuk teks ukuran apa pun. Kombinasi warna ini
        mencolok secara visual tetapi kontrasnya terlalu rendah. Teks gelap (hitam atau abu-abu sangat
        gelap) di latar yang cerah ini adalah solusi yang aksesibel — biasanya mencapai rasio di atas 10:1.
      </p>

      <h3>Teks Placeholder di Kolom Formulir</h3>
      <p>
        Teks placeholder bawaan browser — teks petunjuk yang muncul di kolom input kosong sebelum
        pengguna mengetik — biasanya dirender pada sekitar 40% opacity dari warna teks, atau sebagai
        abu-abu sedang seperti <code>#aaaaaa</code>. Ini hampir selalu gagal WCAG AA. Teks placeholder
        tunduk pada persyaratan kontras 4,5:1 yang sama seperti teks biasa karena ia menyampaikan
        informasi tentang apa yang harus diketik.
      </p>

      <h3>Tautan Biru di Atas Latar Berwarna atau Gelap</h3>
      <p>
        Warna hyperlink biru tradisional (<code>#0000ee</code>) memiliki kontras yang sangat baik di atas
        putih (8,6:1) namun gagal di atas latar berwarna. Di atas latar ungu sedang, tautan biru yang
        sama hanya mencapai sekitar 1,7:1. Warna tautan perlu diperiksa tidak hanya terhadap latar
        halaman, tetapi juga terhadap bagian atau kartu berwarna apa pun yang ada di dalamnya.
      </p>

      <h3>Status Dinonaktifkan dan Indikator Fokus</h3>
      <p>
        Meskipun WCAG 2.1 mengecualikan komponen UI yang dinonaktifkan dari persyaratan kontras, indikator
        fokus — cincin atau garis yang terlihat saat pengguna tab ke elemen yang dapat difokuskan —
        harus memenuhi kontras 3:1 terhadap warna yang berdekatan di bawah WCAG 2.2. Banyak situs
        menekan cincin fokus bawaan browser dengan <code>outline: none</code> dan tidak menyediakan
        pengganti, yang merupakan kegagalan aksesibilitas bagi pengguna yang hanya menggunakan keyboard.
      </p>

      <h2>Teknik Memilih Warna yang Aksesibel</h2>

      <h3>Mulai dengan Gelap di Atas Terang</h3>
      <p>
        Default paling sederhana untuk teks adalah teks hampir-hitam di atas latar putih atau abu-abu
        sangat terang. Rasio di atas 10:1 mudah dicapai dan memberikan fleksibilitas besar dalam ukuran
        dan bobot font. Cadangkan skema warna terang-di-gelap (dark mode) untuk permukaan sekunder dan
        pastikan Anda memverifikasi kontras di kedua tema.
      </p>

      <h3>Periksa Semua Status Interaktif</h3>
      <p>
        Status default tombol mungkin lulus AA sementara status hover-nya — yang mencerahkan latar —
        jatuh di bawah 4,5:1. Periksa status default, hover, fokus, aktif, dan nonaktif secara terpisah.
        Status nonaktif dikecualikan dari persyaratan, namun semua status lainnya harus lulus.
      </p>

      <h3>Aturan 60-30-10 Diterapkan Secara Aksesibel</h3>
      <p>
        Aturan warna 60-30-10 (60% warna dominan, 30% warna sekunder, 10% aksen) berguna untuk
        hierarki visual. Menerapkannya secara aksesibel berarti: verifikasi bahwa teks yang muncul
        di masing-masing tiga zona warna tersebut memenuhi ambang batas kontras untuk zona tersebut
        secara individual. Warna aksen di 10% seringkali yang paling bermasalah — warna aksen cerah
        yang dipasangkan dengan teks putih atau gelap dapat gagal pada kombinasi hue dan saturasi
        tertentu.
      </p>

      <h3>Gunakan Color Contrast Checker Sebelum Berkomitmen</h3>
      <p>
        Waktu paling murah untuk memperbaiki masalah kontras adalah sebelum Anda menulis kode apa pun.
        Saat memilih warna di alat desain, periksa pasangan teks/latar yang dimaksud segera.
        Menyesuaikan kecerahan warna sebesar 10–15% sering kali membawa kombinasi yang gagal menjadi
        sesuai tanpa mengubah karakter visual desain secara signifikan.
      </p>

      <h2>Persyaratan Hukum</h2>
      <p>
        Kepatuhan WCAG tidak sepenuhnya bersifat sukarela di banyak yurisdiksi. Kerangka hukum yang
        merujuk WCAG AA meliputi:
      </p>
      <ul>
        <li>
          <strong>Amerika Serikat — Americans with Disabilities Act (ADA):</strong> ADA melarang
          diskriminasi disabilitas di tempat akomodasi publik. Pengadilan federal dan Departemen
          Kehakiman telah menafsirkan ini untuk mencakup situs web komersial. Ribuan gugatan
          aksesibilitas ADA diajukan di pengadilan federal AS setiap tahun, dengan pelanggaran
          kontras warna yang sering dikutip dalam surat tuntutan.
        </li>
        <li>
          <strong>Uni Eropa — EN 301 549:</strong> Direktif Aksesibilitas Web UE mewajibkan
          kepatuhan WCAG 2.1 Level AA untuk situs web dan aplikasi seluler sektor publik.
          EN 301 549 adalah standar teknis yang digunakan untuk pengadaan. Organisasi sektor
          swasta di industri yang diatur juga menghadapi persyaratan yang semakin meningkat.
        </li>
        <li>
          <strong>Kanada — AODA (Accessibility for Ontarians with Disabilities Act):</strong>{" "}
          Ontario mewajibkan kepatuhan WCAG 2.0 Level AA untuk organisasi sektor swasta dengan
          50 karyawan atau lebih dan untuk semua organisasi sektor publik.
        </li>
        <li>
          <strong>Inggris — Equality Act 2010:</strong> Penyedia layanan memiliki kewajiban untuk
          membuat penyesuaian yang wajar bagi penyandang disabilitas, yang pemerintah Inggris
          tafsirkan untuk mencakup aksesibilitas situs web.
        </li>
      </ul>
      <p>
        Di luar risiko hukum, banyak klien enterprise dan proses pengadaan pemerintah kini mensyaratkan
        kesesuaian WCAG AA dalam kontrak vendor. Kepatuhan aksesibilitas semakin merupakan persyaratan
        komersial, bukan hanya etis.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "10px", fontWeight: 700, fontSize: "1rem", color: "#dc2626"}}>
          Persyaratan Utama yang Perlu Diingat
        </p>
        <p style={{marginTop: 0, marginBottom: 0}}>
          WCAG 2.1 Level AA mensyaratkan <strong>rasio kontras 4,5:1 untuk teks normal</strong> dan{" "}
          <strong>3:1 untuk teks besar</strong> (18pt+ atau 14pt+ tebal). Garis luar komponen UI dan
          ikon bermakna juga memerlukan 3:1. Gagal memenuhi ambang batas ini berarti gagal memenuhi
          standar aksesibilitas yang paling banyak diwajibkan di web.
        </p>
      </div>

      <h2>Siapa yang Mendapat Manfaat di Luar Pengguna Penyandang Disabilitas</h2>
      <p>
        Kontras yang aksesibel adalah desain yang baik untuk semua orang. Penelitian dalam pengalaman
        pengguna secara konsisten menunjukkan bahwa teks berkontras tinggi dibaca lebih cepat dan
        dengan lebih sedikit kesalahan di semua kelompok pengguna. Populasi yang paling jelas mendapat
        manfaat antara lain:
      </p>
      <ul>
        <li>Orang dengan defisiensi penglihatan warna (merah-hijau, biru-kuning, atau monokromasi)</li>
        <li>Orang dewasa yang lebih tua, karena sensitivitas kontras menurun secara alami seiring usia</li>
        <li>Orang dengan penglihatan rendah yang tidak menggunakan pembesaran layar</li>
        <li>Pengguna di lingkungan dengan cahaya sekitar tinggi (di luar ruangan, dekat jendela)</li>
        <li>Pengguna pada layar murah, lama, atau berkualitas rendah</li>
        <li>Siapa pun dalam kondisi kognitif yang terbebani — saat lelah atau terganggu, kontras tinggi mengurangi kesalahan membaca</li>
      </ul>

      <h2>Cara Menggunakan BrowseryTools Color Contrast Checker</h2>
      <p>
        <a href="/tools/contrast-checker">BrowseryTools Color Contrast Checker</a> memudahkan
        verifikasi kombinasi warna apa pun terhadap standar WCAG:
      </p>
      <ul>
        <li>
          <strong>Masukkan kode hex:</strong> Ketik atau tempel kode warna hex yang valid (3 atau 6
          digit, dengan atau tanpa awalan <code>#</code>) ke kolom foreground dan background.
        </li>
        <li>
          <strong>Lihat rasio secara instan:</strong> Rasio kontras dihitung dan ditampilkan secara
          real time saat Anda mengetik — tidak perlu mengklik tombol.
        </li>
        <li>
          <strong>Badge AA dan AAA:</strong> Badge lulus/gagal yang jelas ditampilkan untuk Level AA
          teks normal, Level AA teks besar, Level AAA teks normal, dan Level AAA teks besar — sehingga
          Anda dapat melihat persis ambang batas mana yang dipenuhi pasangan Anda.
        </li>
        <li>
          <strong>Pratinjau langsung:</strong> Alat ini merender contoh teks di atas latar yang Anda
          pilih sehingga Anda dapat melihat kombinasi tersebut sebagaimana yang akan dilihat pengguna.
        </li>
        <li>
          <strong>Gunakan color picker:</strong> Jika Anda tidak memiliki nilai hex tertentu, color
          picker terintegrasi memungkinkan Anda memilih warna secara visual dan langsung melihat
          perubahan rasio saat Anda bergerak melalui ruang warna.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Semuanya berjalan secara lokal di browser Anda.</strong> Color Contrast Checker
        melakukan semua perhitungan luminansi menggunakan JavaScript di tab browser Anda. Tidak ada
        nilai warna yang dikirimkan ke server mana pun. Tidak ada akun, tidak ada log riwayat, dan
        tidak ada analitik pihak ketiga yang terlibat dalam perhitungan. Tutup tab dan semuanya hilang.
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Periksa kombinasi warna apa pun terhadap WCAG AA dan AAA secara instan
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Masukkan dua kode hex dan lihat rasio kontras, status lulus/gagal, dan pratinjau teks langsung.
          Tidak perlu mendaftar. Tidak ada yang diunggah.
        </p>
        <a
          href="/tools/contrast-checker"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Buka Color Contrast Checker →
        </a>
      </div>
    </div>
  );
}
