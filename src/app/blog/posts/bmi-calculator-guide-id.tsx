export default function Content() {
  return (
    <div>
      <p>
        Body Mass Index — BMI — adalah salah satu angka yang paling banyak digunakan dalam kedokteran
        preventif. Dokter menyebutnya saat pemeriksaan. Formulir asuransi menanyakannya. Aplikasi
        kebugaran menghitungnya secara otomatis. Namun sebagian besar orang yang mengetahui angka BMI
        mereka hanya memiliki gambaran samar tentang apa yang sebenarnya diukurnya, bagaimana cara
        menghitungnya, dan — yang terpenting — apa yang tidak dapat diceritakannya. Panduan ini mencakup
        semuanya: rumus, kategori, sejarah, keterbatasan nyata, dan cara menggunakan{" "}
        <a href="/tools/bmi-calculator">Kalkulator BMI BrowseryTools</a> untuk mendapatkan hasil Anda
        secara instan dan privat di browser.
      </p>

      <h2>Apa Itu BMI?</h2>
      <p>
        BMI adalah rasio sederhana antara berat badan dan tinggi badan kuadrat. Indeks ini dirancang pada
        tahun 1830-an oleh matematikawan dan statistikawan Belgia Adolphe Quetelet, yang sedang mempelajari
        karakteristik "manusia rata-rata" pada populasi besar. Quetelet bukan dokter dan tidak pernah
        berniat indeksnya digunakan sebagai diagnostik kesehatan individu — ini adalah alat untuk
        mempelajari pola tingkat populasi. Rumus yang dikembangkannya kemudian diadopsi oleh komunitas
        medis pada abad kedua puluh karena menawarkan sesuatu yang langka dalam pengaturan klinis: cara
        cepat, gratis, dan non-invasif untuk menyaring sejumlah besar orang terhadap potensi risiko
        kesehatan terkait berat badan.
      </p>
      <p>
        Indeks ini menjadi mapan pada tahun 1970-an setelah ahli fisiologi Ancel Keys meninjau beberapa
        indeks berat-untuk-tinggi yang bersaing dan menyimpulkan bahwa rumus asli Quetelet paling andal
        berkorelasi dengan persentase lemak tubuh dalam studi populasi. Keys menciptakan istilah "Body
        Mass Index" saat itu. Sejak saat itu, indeks ini telah menjadi metrik skrining default untuk
        kelebihan berat badan dan obesitas dalam konteks klinis dan kesehatan masyarakat di seluruh dunia.
      </p>

      <h2>Rumus BMI</h2>
      <p>
        Rumusnya cukup sederhana. Dalam satuan metrik:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = weight (kg) ÷ height² (m²)
      </pre>
      <p>
        Dalam satuan imperial, diperlukan faktor konversi karena pound dan inci tidak memiliki hubungan
        matematis yang sama seperti kilogram dan meter:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = 703 × weight (lbs) ÷ height² (inches²)
      </pre>
      <p>
        Konstanta 703 berasal dari konversi satuan antara sistem metrik dan imperial (secara khusus,
        1 kg/m² ≈ 703 × lb/in²). Kedua rumus menghasilkan angka tak berdimensi yang persis sama untuk
        orang yang sama.
      </p>

      <h2>Contoh Konkret</h2>
      <p>
        Bayangkan seseorang yang memiliki berat 70 kg dan tinggi 1,75 m. BMI mereka adalah:
      </p>
      <pre style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`BMI = 70 ÷ (1.75²)
    = 70 ÷ 3.0625
    = 22.9`}
      </pre>
      <p>
        Hasil 22,9 berada tepat dalam kisaran Berat Normal (18,5–24,9). Dalam satuan imperial, seseorang
        yang tingginya 5 kaki 9 inci (69 inci) dan beratnya 154 lbs akan mendapatkan: 703 × 154 ÷ 69² =
        108.262 ÷ 4.761 ≈ 22,7 — angka yang pada dasarnya sama, seperti yang diharapkan.
      </p>

      <h2>Kategori BMI</h2>
      <p>
        Organisasi Kesehatan Dunia (WHO) menetapkan klasifikasi BMI standar berikut untuk orang dewasa
        berusia 18 tahun ke atas:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kategori</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kisaran BMI</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Risiko Kesehatan Terkait</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#2563eb"}}>Kekurangan Berat</strong></td>
              <td style={{padding: "12px 16px"}}>Di bawah 18,5</td>
              <td style={{padding: "12px 16px"}}>Malnutrisi, osteoporosis, anemia, penekanan imun</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Berat Normal</strong></td>
              <td style={{padding: "12px 16px"}}>18,5 – 24,9</td>
              <td style={{padding: "12px 16px"}}>Risiko terendah dalam kerangka berbasis BMI</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Kelebihan Berat</strong></td>
              <td style={{padding: "12px 16px"}}>25 – 29,9</td>
              <td style={{padding: "12px 16px"}}>Risiko meningkat untuk diabetes tipe 2, hipertensi, penyakit kardiovaskular</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Obesitas Kelas I</strong></td>
              <td style={{padding: "12px 16px"}}>30 – 34,9</td>
              <td style={{padding: "12px 16px"}}>Risiko sedang; sindrom metabolik, sleep apnea</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#b91c1c"}}>Obesitas Kelas II</strong></td>
              <td style={{padding: "12px 16px"}}>35 – 39,9</td>
              <td style={{padding: "12px 16px"}}>Risiko tinggi; peningkatan risiko operasi, penyakit sendi</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#7f1d1d"}}>Obesitas Kelas III (Berat)</strong></td>
              <td style={{padding: "12px 16px"}}>40 ke atas</td>
              <td style={{padding: "12px 16px"}}>Risiko sangat tinggi; harapan hidup berkurang signifikan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Ambang batas ini hanya berlaku untuk orang dewasa. Anak-anak dan remaja dinilai menggunakan grafik
        pertumbuhan spesifik usia dan jenis kelamin, di mana persentil BMI — bukan angka tetap —
        menentukan kategorinya.
      </p>

      <h2>Apa yang Tidak Diukur BMI</h2>
      <p>
        Di sinilah BMI menjadi benar-benar rumit. Rumusnya sangat sederhana sehingga tidak dapat tidak
        melewatkan aspek penting dari komposisi tubuh. Memahami keterbatasan ini bukan sekadar akademis —
        ini secara langsung memengaruhi cara Anda menafsirkan angka Anda sendiri.
      </p>

      <h3>Massa Otot</h3>
      <p>
        BMI mengukur total berat badan relatif terhadap tinggi badan. Ia tidak dapat membedakan antara
        jaringan otot dan jaringan adiposa (lemak). Seorang atlet profesional atau binaragawan kompetitif
        yang memiliki otot besar sering kali terdaftar sebagai Kelebihan Berat atau bahkan Obesitas
        berdasarkan BMI, meskipun memiliki lemak tubuh yang sangat rendah. Sebaliknya, seseorang yang
        tidak aktif dengan massa otot rendah dan lemak tubuh tinggi — kadang disebut "skinny fat" atau
        memiliki obesitas berat normal — dapat memiliki BMI Normal yang sempurna sambil membawa tingkat
        lemak yang berbahaya secara metabolis. Ini bisa dibilang kelemahan paling signifikan dalam
        penggunaan BMI secara rutin.
      </p>

      <h3>Usia</h3>
      <p>
        Seiring bertambahnya usia, massa otot biasanya berkurang dan digantikan oleh jaringan lemak
        bahkan ketika berat badan tetap konstan — proses yang disebut obesitas sarkopenik. Orang dewasa
        yang lebih tua dengan BMI Normal 23 mungkin sebenarnya membawa proporsi lemak tubuh yang lebih
        tinggi daripada orang yang lebih muda dengan angka yang sama. Beberapa peneliti geriatri
        berpendapat bahwa kisaran BMI yang sedikit lebih tinggi (hingga 27 atau bahkan 28) mungkin
        bersifat protektif pada orang dewasa yang lebih tua, karena berat badan rendah pada lansia
        dikaitkan dengan kerapuhan dan peningkatan mortalitas.
      </p>

      <h3>Jenis Kelamin</h3>
      <p>
        Perempuan secara alami membawa persentase lemak tubuh yang lebih tinggi daripada laki-laki pada
        BMI yang sama. Rata-rata, perempuan memiliki sekitar 10–12 poin persentase lebih banyak lemak
        tubuh daripada laki-laki dengan skor BMI yang identik. Ini secara fisiologis normal — berkaitan
        dengan fungsi hormonal dan biologi reproduksi — tetapi berarti angka BMI yang sama mewakili
        komposisi tubuh yang berbeda secara bermakna tergantung pada jenis kelamin biologis.
      </p>

      <h3>Etnis</h3>
      <p>
        Penelitian populasi telah secara konsisten menunjukkan bahwa orang keturunan Asia memiliki risiko
        kondisi kardiometabolik yang lebih tinggi (diabetes tipe 2, hipertensi, penyakit kardiovaskular)
        pada nilai BMI yang lebih rendah dibandingkan dengan populasi keturunan Eropa. Konsultasi Ahli WHO
        tentang BMI pada populasi Asia merekomendasikan agar ambang batas tindakan untuk orang dewasa
        Asia diturunkan — dengan kelebihan berat dimulai pada BMI 23 dan obesitas pada BMI 27,5 — untuk
        lebih mencerminkan risiko kesehatan aktual pada populasi ini. Kategori WHO standar dikembangkan
        terutama dari data populasi Eropa dan tidak bisa diterapkan secara langsung ke semua kelompok etnis.
      </p>

      <h3>Distribusi Lemak</h3>
      <p>
        Tempat lemak disimpan di tubuh sangat penting — bisa dibilang lebih penting daripada total massa
        lemak. Lemak visceral, yang menumpuk di sekitar organ perut (hati, pankreas, usus), aktif secara
        metabolis dan sangat terkait dengan resistensi insulin, peradangan, dan penyakit kardiovaskular.
        Lemak subkutan, yang tersimpan di bawah kulit terutama di pinggul dan paha, kurang berbahaya dan
        bahkan mungkin sedikit bersifat protektif. BMI tidak dapat menangkap perbedaan ini. Dua orang
        dengan skor BMI yang identik dapat memiliki profil kesehatan yang sangat berbeda tergantung
        di mana lemak mereka disimpan.
      </p>

      <h2>Mengapa BMI Menjadi Standar</h2>
      <p>
        Mengingat keterbatasan yang terdokumentasi dengan baik ini, wajar untuk bertanya mengapa BMI
        tetap begitu dominan dalam praktik klinis. Jawabannya praktis: hanya memerlukan timbangan dan
        meteran. Menghitungnya membutuhkan waktu sekitar sepuluh detik. Gratis, dapat direproduksi, dan
        dipahami secara universal. Metode analisis komposisi tubuh yang lebih canggih — pemindaian DEXA,
        penimbangan hidrostatik, plethysmography perpindahan udara (Bod Pod), kuantifikasi lemak berbasis
        MRI — akurat tetapi mahal, memakan waktu, dan tidak tersedia di sebagian besar pengaturan klinis
        rutin.
      </p>
      <p>
        BMI melayani tujuan tertentu dengan baik: ini adalah alat skrining tingkat populasi yang murah
        yang dapat dengan cepat menandai orang yang mungkin perlu penyelidikan lebih lanjut. Ini tidak
        dirancang untuk menjadi alat diagnostik bagi individu, dan sebagian besar peneliti dan dokter yang
        bekerja dengannya memahami perbedaan ini. Masalah muncul ketika digunakan seolah-olah lebih
        definitif daripada yang sebenarnya.
      </p>

      <h2>Pengukuran Pelengkap</h2>
      <p>
        Jika Anda menginginkan gambaran yang lebih lengkap tentang komposisi tubuh dan risiko kesehatan
        Anda, pertimbangkan pengukuran ini bersama BMI:
      </p>
      <ul>
        <li>
          <strong>Lingkar pinggang:</strong> Diukur di titik tersempit batang tubuh (atau di pusar).
          Ambang batas risiko tinggi umumnya 94 cm (37 inci) untuk pria dan 80 cm (31,5 inci) untuk
          wanita, dengan risiko sangat tinggi di atas 102 cm (40 inci) untuk pria dan 88 cm (34,5 inci)
          untuk wanita. Ini langsung menangkap adipositas sentral — lemak perut — yang tidak bisa
          dilakukan BMI.
        </li>
        <li>
          <strong>Rasio pinggang-pinggul (WHR):</strong> Lingkar pinggang dibagi lingkar pinggul.
          WHR di atas 0,90 untuk pria atau 0,85 untuk wanita menunjukkan obesitas abdominal menurut
          pedoman WHO.
        </li>
        <li>
          <strong>Rasio pinggang-tinggi (WHtR):</strong> Lingkar pinggang dibagi tinggi badan. Rasio
          di bawah 0,5 umumnya dianggap sehat di sebagian besar populasi dan usia, menjadikannya salah
          satu indikator angka tunggal paling sederhana untuk lemak sentral.
        </li>
        <li>
          <strong>Persentase lemak tubuh:</strong> Pengukuran langsung dari fraksi berat Anda yang
          berupa lemak. Kisaran sehat kira-kira 10–20% untuk pria dan 18–28% untuk wanita, meski
          kisaran optimal bervariasi berdasarkan usia. Persentase lemak tubuh memerlukan metode
          pengukuran yang lebih khusus.
        </li>
      </ul>

      <h2>Kisaran Berat Sehat untuk Tinggi Badan Anda</h2>
      <p>
        Rumus BMI dapat diatur ulang untuk menghitung berat yang akan memberikan Anda BMI dalam kisaran
        Normal (18,5–24,9). Untuk menemukan kisaran berat sehat Anda, kalikan kuadrat tinggi badan dalam
        meter dengan 18,5 dan 24,9:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`Healthy weight range = 18.5 × height² to 24.9 × height²

For 1.75 m:
Lower bound = 18.5 × 3.0625 = 56.7 kg
Upper bound = 24.9 × 3.0625 = 76.3 kg`}
      </pre>
      <p>
        Jadi untuk seseorang yang tingginya 1,75 m, BMI Normal sesuai dengan berat badan antara sekitar
        56,7 kg dan 76,3 kg — kisaran hampir 20 kg. <a href="/tools/bmi-calculator">Kalkulator BMI
        BrowseryTools</a> menampilkan kisaran sehat ini secara otomatis di bawah hasil Anda, sehingga
        Anda dapat melihat dengan tepat di mana Anda berdiri relatif terhadap kategori Normal untuk
        tinggi badan spesifik Anda.
      </p>

      <h2>Risiko Kesehatan Terkait Setiap Kategori</h2>
      <p>
        Meskipun BMI tidak sempurna, indeks ini berkorelasi dengan hasil kesehatan yang bermakna di
        tingkat populasi. Kekurangan berat badan yang signifikan dikaitkan dengan malnutrisi, melemahnya
        fungsi imun, kehilangan kepadatan tulang, dan komplikasi kardiovaskular. Di ujung lain skala,
        kelebihan berat badan dan obesitas yang berkelanjutan meningkatkan risiko statistik dari:
      </p>
      <ul>
        <li>Diabetes tipe 2 (risiko mulai meningkat di atas BMI 25 dan mempercepat di atas 30)</li>
        <li>Hipertensi dan penyakit kardiovaskular</li>
        <li>Kanker tertentu, termasuk kolorektal, payudara, endometrium, dan kanker ginjal</li>
        <li>Sleep apnea obstruktif</li>
        <li>Penyakit hati berlemak non-alkohol (NAFLD)</li>
        <li>Osteoarthritis pada sendi penopang berat</li>
        <li>Peningkatan risiko bedah dan anestesi</li>
      </ul>
      <p>
        Ini adalah asosiasi statistik di seluruh populasi, bukan prediksi individual. BMI 28 tidak berarti
        Anda akan mengembangkan kondisi ini — ini berarti bahwa dalam populasi studi yang besar, orang
        dengan BMI tersebut memiliki tingkat hasil ini yang lebih tinggi dibandingkan orang dalam
        kisaran Normal.
      </p>

      <h2>Cara Menggunakan Kalkulator BMI BrowseryTools</h2>
      <p>
        <a href="/tools/bmi-calculator">Kalkulator BMI BrowseryTools</a> dirancang untuk memberikan
        hasil instan yang jelas dengan konteks yang berguna:
      </p>
      <ul>
        <li>
          <strong>Metrik atau imperial:</strong> Beralih antara kg/cm dan lbs/inci. Kalkulator
          mengonversi secara otomatis — Anda tidak perlu memikirkan konversi satuan.
        </li>
        <li>
          <strong>Hasil instan:</strong> BMI Anda ditampilkan begitu Anda memasukkan tinggi dan berat
          badan. Tidak perlu mengklik tombol, tidak ada loading.
        </li>
        <li>
          <strong>Tampilan kategori:</strong> Hasil menampilkan bukan hanya angka tetapi juga kategori
          WHO yang sesuai — Kekurangan Berat, Normal, Kelebihan Berat, atau Obesitas — dengan kode
          warna untuk kejelasan.
        </li>
        <li>
          <strong>Kisaran berat sehat:</strong> Untuk tinggi badan yang Anda masukkan, alat menampilkan
          kisaran berat badan yang sesuai dengan BMI Normal (18,5–24,9) dalam sistem satuan yang dipilih.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Data Anda tidak pernah meninggalkan perangkat Anda.</strong> Kalkulator BMI berjalan
        sepenuhnya di browser Anda. Nilai tinggi dan berat badan yang Anda masukkan hanya digunakan untuk
        perhitungan di layar dan tidak pernah dikirimkan ke server BrowseryTools, disimpan di database
        mana pun, atau dibagikan kepada pihak ketiga mana pun. Tidak ada yang dicatat. Menutup tab
        membuang semuanya.
      </div>

      <div style={{background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "8px", fontWeight: 700, fontSize: "1rem", color: "#92400e"}}>
          Penafian Medis
        </p>
        <p style={{marginTop: 0, marginBottom: 0, fontSize: "0.95rem"}}>
          Kalkulator BMI BrowseryTools adalah alat informasi saja. BMI adalah metrik skrining, bukan
          ukuran diagnostik. Hasil yang diberikannya bukan saran medis dan tidak boleh digunakan untuk
          membuat keputusan tentang kesehatan, diet, atau pengobatan Anda tanpa berkonsultasi dengan
          profesional kesehatan yang berkualifikasi. Jika Anda memiliki kekhawatiran tentang berat badan,
          komposisi tubuh, atau kondisi kesehatan terkait, silakan berkonsultasi dengan dokter atau ahli
          gizi terdaftar Anda.
        </p>
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Hitung BMI Anda secara instan — metrik atau imperial
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Lihat kategori Anda, kisaran berat sehat Anda, dan apa arti angka tersebut sebenarnya.
          Tidak perlu akun. Tidak ada yang diunggah atau disimpan.
        </p>
        <a
          href="/tools/bmi-calculator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Buka Kalkulator BMI →
        </a>
      </div>
    </div>
  );
}
