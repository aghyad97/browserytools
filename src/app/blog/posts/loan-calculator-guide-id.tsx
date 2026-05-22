export default function Content() {
  return (
    <div>
      <p>
        Kebanyakan orang meminjam sejumlah besar uang pada suatu titik dalam hidup mereka — KPR,
        kredit kendaraan, pinjaman mahasiswa, pinjaman pribadi untuk renovasi rumah. Namun kebanyakan
        orang hanya memiliki pemahaman samar tentang cara pinjaman tersebut benar-benar bekerja.
        Mereka tahu cicilan bulanan dan perkiraan suku bunga, dan itu biasanya sudah cukup. Detail
        lainnya — berapa banyak dari setiap pembayaran yang benar-benar melunasi pokok, berapa total
        bunga yang akan dibayar, apa yang terjadi jika mereka membuat pembayaran ekstra — tetap
        tidak jelas.
      </p>
      <p>
        Panduan ini menjelaskan mekanisme pelunasan pinjaman dengan jelas, termasuk matematika
        sebenarnya di balik cicilan bulanan, apa arti amortisasi dan mengapa itu penting, perbedaan
        penting antara APR dan suku bunga, dan cara membandingkan penawaran pinjaman dengan cerdas.
      </p>
      <p>
        Kamu bisa menggunakan{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> — gratis, tanpa daftar,
        semua data tersimpan di browsermu.
      </p>

      <h2>Rumus Pembayaran Pinjaman</h2>
      <p>
        Cicilan bulanan untuk pinjaman suku bunga tetap dihitung menggunakan rumus yang
        memperhitungkan pokok (jumlah yang dipinjam), suku bunga, dan jangka waktu pinjaman:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>
      <p>
        Di mana:
      </p>
      <ul>
        <li><strong>M</strong> adalah cicilan bulanan</li>
        <li><strong>P</strong> adalah pokok (jumlah pinjaman)</li>
        <li><strong>r</strong> adalah suku bunga bulanan (suku bunga tahunan dibagi 12)</li>
        <li><strong>n</strong> adalah jumlah pembayaran (jangka waktu pinjaman dalam bulan)</li>
      </ul>
      <p>
        Sebagai contoh konkret: pinjaman mobil $20.000 dengan bunga tahunan 6% selama 48 bulan
        memiliki suku bunga bulanan 0,5% (6% / 12). Dengan mengisi rumus: M = 20.000 × [0,005 ×
        (1,005)^48] / [(1,005)^48 - 1] = sekitar $470 per bulan. Selama 48 bulan, kamu membayar
        $22.560 total, artinya $2.560 bunga di atas $20.000 pokok.
      </p>
      <p>
        Kamu tidak perlu menghitung ini secara manual.{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> menangani rumus
        tersebut secara instan — tetapi memahami apa yang dilakukan rumus membantu kamu
        menginterpretasikan hasilnya dengan cerdas.
      </p>

      <h2>Apa Arti Pokok, Suku Bunga, dan Jangka Waktu Sebenarnya</h2>
      <p>
        Ketiga variabel ini adalah deskripsi lengkap dari pinjaman suku bunga tetap mana pun, dan
        mereka berinteraksi dengan cara yang tidak selalu intuitif:
      </p>
      <ul>
        <li>
          <strong>Pokok</strong> adalah jumlah yang kamu pinjam. Ini adalah saldo awal dari mana
          bunga dihitung. Semakin besar pokok, semakin banyak bunga yang kamu bayar pada suku bunga
          dan jangka waktu tertentu — secara proporsional.
        </li>
        <li>
          <strong>Suku bunga</strong> adalah biaya tahunan peminjaman, dinyatakan sebagai persentase
          dari pokok yang masih terutang. Perbedaan suku bunga 1% terdengar kecil tetapi terakumulasi
          secara signifikan dalam jangka panjang. Pada KPR 30 tahun $400.000, perbedaan antara 6%
          dan 7% adalah sekitar $85.000 dalam total bunga yang dibayar.
        </li>
        <li>
          <strong>Jangka waktu</strong> adalah berapa lama kamu harus melunasi pinjaman, dinyatakan
          dalam bulan atau tahun. Jangka waktu yang lebih lama menurunkan cicilan bulanan tetapi
          secara dramatis meningkatkan total bunga yang dibayar. Jangka waktu yang lebih pendek
          meningkatkan cicilan bulanan tetapi membuatmu keluar dari utang lebih cepat dan menghemat
          jumlah bunga yang substansial.
        </li>
      </ul>

      <h2>Amortisasi: Mengapa Pembayaran Awal Sebagian Besar Adalah Bunga</h2>
      <p>
        Amortisasi adalah proses melunasi utang melalui pembayaran terjadwal secara berkala. Pada
        pinjaman yang diamortisasi secara standar, setiap cicilan bulanan mencakup dua hal: bunga
        yang telah diakumulasikan pada saldo yang masih terutang, dan sebagian pokok.
      </p>
      <p>
        Wawasan kunci — yang mengejutkan kebanyakan orang — adalah bahwa pada tahun-tahun awal
        pinjaman, sebagian besar dari setiap pembayaran masuk ke bunga daripada pengurangan pokok.
        Ini karena bunga dihitung dari saldo yang masih terutang, yang berada pada titik tertinggi
        di awal pinjaman.
      </p>
      <p>
        Pertimbangkan KPR 30 tahun $300.000 dengan bunga 7%. Cicilan bulanan adalah sekitar $1.996.
        Pada bulan pertama, sekitar $1.750 dari pembayaran tersebut adalah bunga dan hanya $246
        adalah pokok. Setelah satu tahun pembayaran — $23.952 dibayarkan — saldo pinjaman hanya
        berkurang sekitar $3.000. Pada tahun ke-15, pembagian berbalik: lebih banyak dari setiap
        pembayaran masuk ke pokok daripada ke bunga. Pada tahun-tahun terakhir, hampir seluruh
        pembayaran adalah pokok.
      </p>
      <p>
        Inilah mengapa pembayaran ekstra yang dilakukan di awal pinjaman sangat kuat — setiap dolar
        ekstra dari pokok yang dibayarkan mengurangi saldo yang menjadi dasar perhitungan bunga di
        masa depan, menciptakan efek berganda yang menghilangkan berbulan-bulan atau bertahun-tahun
        pembayaran.
      </p>

      <h2>APR vs. Suku Bunga: Perbedaan yang Menelanmu Ribuan Dolar</h2>
      <p>
        Suku bunga dan Annual Percentage Rate (APR) saling terkait tetapi tidak sama, dan
        mencampuradukkan keduanya adalah salah satu kesalahan paling umum yang dilakukan orang
        saat membandingkan pinjaman.
      </p>
      <ul>
        <li>
          <strong>Suku bunga</strong> adalah biaya peminjaman pokok saja, dinyatakan sebagai
          persentase. Ini menentukan jumlah cicilan bulananmu.
        </li>
        <li>
          <strong>APR</strong> mencakup suku bunga ditambah semua biaya yang terkait dengan pinjaman —
          biaya originasi, biaya broker, poin diskon, asuransi hipotek, dan biaya lainnya. APR
          mewakili total biaya peminjaman yang sebenarnya selama masa pinjaman.
        </li>
      </ul>
      <p>
        Pinjaman dengan suku bunga 6,5% dan biaya $5.000 mungkin memiliki APR 6,9%. Pinjaman
        pesaing dengan suku bunga 6,75% dan tanpa biaya mungkin memiliki APR 6,75%. Pinjaman
        pertama memiliki suku bunga lebih rendah tetapi biaya sebenarnya lebih tinggi — terutama
        jika kamu melunasi atau refinansiasi pinjaman sebelum jatuh tempo (yang dilakukan banyak
        orang). APR adalah yang harus kamu bandingkan saat mencari pinjaman, bukan suku bunga
        yang diiklankan.
      </p>
      <p>
        Di AS, pemberi pinjaman diwajibkan secara hukum untuk mengungkapkan APR. Di UK, APR
        representatif adalah metrik perbandingan standar. Ketika pemberi pinjaman mengiklankan
        suku bunga yang sangat rendah, segera lihat APR — celah antara keduanya sering kali
        mengungkapkan di mana biaya tersembunyi.
      </p>

      <h2>Bagaimana Pembayaran Ekstra Mempengaruhi Total Bunga</h2>
      <p>
        Melakukan pembayaran ekstra — bahkan yang sederhana — terhadap pokok pinjaman memiliki
        efek yang tidak proporsional pada total bunga yang dibayar. Karena setiap pembayaran ekstra
        mengurangi pokok, semua perhitungan bunga di masa depan adalah terhadap saldo yang lebih
        rendah. Penghematan terakumulasi dari waktu ke waktu.
      </p>
      <p>
        Pada KPR 30 tahun $300.000 dengan bunga 7%, melakukan satu pembayaran ekstra $200 per bulan
        mengurangi jangka waktu pinjaman sekitar 5 tahun dan menghemat sekitar $80.000 dalam bunga.
        $200 per bulan itu — $2.400 per tahun — menghasilkan sekitar $80.000 dalam penghematan.
        Hampir tidak ada investasi yang secara andal menghasilkan keuntungan yang terjamin dan bebas
        risiko semacam itu.
      </p>
      <p>
        Nuansa penting: sebelum melakukan pembayaran ekstra, pastikan pinjamanmu tidak memiliki
        penalti pelunasan awal (sebagian besar pinjaman modern tidak memilikinya, tetapi beberapa
        pinjaman lama memilikinya), dan konfirmasi bahwa pembayaran ekstra diterapkan ke pokok
        daripada pembayaran mendatang — beberapa pemberi pinjaman secara default mengkredit pembayaran
        ekstra sebagai angsuran mendatang awal, yang tidak memiliki efek penghematan bunga yang sama.
      </p>

      <h2>Membandingkan Penawaran Pinjaman: Jangan Hanya Lihat Cicilan Bulanan</h2>
      <p>
        Pemberi pinjaman tahu bahwa cicilan bulanan adalah angka yang paling dipedulikan oleh
        peminjam, dan mereka menyusun penawaran mereka sesuai. Cicilan bulanan yang lebih rendah
        terdengar menarik tetapi dapat menutupi total biaya yang jauh lebih tinggi jika dicapai
        melalui jangka waktu yang lebih panjang atau biaya yang lebih tinggi.
      </p>
      <p>
        Saat membandingkan penawaran pinjaman, selalu hitung dan bandingkan:
      </p>
      <ul>
        <li><strong>Total bunga yang dibayar</strong> selama masa pinjaman penuh</li>
        <li><strong>APR</strong> — total biaya nyata termasuk biaya</li>
        <li><strong>Total jumlah yang dilunasi</strong> (pokok + semua bunga + semua biaya)</li>
        <li><strong>Penalti pelunasan awal</strong> — apakah ada biaya untuk membayar lunas lebih awal</li>
        <li><strong>Suku bunga tetap vs. variabel</strong> — pinjaman suku bunga variabel mungkin mulai lebih rendah tetapi membawa risiko suku bunga</li>
      </ul>
      <p>
        Dua pemberi pinjaman mungkin menawarkan pokok yang sama dengan suku bunga yang sama tetapi
        dengan struktur biaya yang sangat berbeda. Pinjaman dengan biaya originasi $3.000 versus
        yang tanpa biaya dengan suku bunga sedikit lebih tinggi — pilihan yang tepat tergantung
        pada berapa lama kamu berencana menyimpan pinjaman tersebut. Untuk jangka waktu penyimpanan
        pendek, biaya lebih rendah mengalahkan suku bunga lebih rendah. Untuk jangka waktu panjang,
        suku bunga lebih rendah menang.
      </p>

      <h2>Biaya Tersembunyi dari Memperpanjang Jangka Waktu Pinjaman</h2>
      <p>
        Ketika cicilan bulanan menjadi berat, respons umum adalah refinansiasi ke jangka waktu yang
        lebih panjang. Ini berhasil mengurangi cicilan bulanan, tetapi biayanya substansial.
      </p>
      <p>
        Memperpanjang KPR 20 tahun yang tersisa kembali ke 30 tahun untuk menurunkan cicilan bulanan
        sebesar $200 dapat menelanmu puluhan ribu dolar dalam bunga tambahan sambil menambahkan
        satu dekade utang. Ini bisa menjadi pilihan yang tepat dalam kesulitan keuangan yang nyata —
        tetapi harus dibuat dengan mata terbuka terhadap total biaya, bukan hanya keringanan bulanan.
      </p>
      <p>
        Hitung angka-angkanya sebelum refinansiasi.{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> memungkinkan kamu
        membandingkan skenario secara berdampingan — sesuaikan jangka waktu dan lihat dampak
        tepat pada total bunga yang dibayar sebelum membuat keputusan apa pun.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kalkulator Pinjaman Gratis — Amortisasi Instan, Tanpa Akun
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Hitung cicilan bulanan, total bunga, dan jadwal amortisasi lengkap untuk pinjaman apa pun.
          Bandingkan skenario dan pahami utangmu.
        </p>
        <a
          href="/tools/loan-calculator"
          style={{background: "rgba(59,130,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Kalkulator Pinjaman →
        </a>
      </div>
    </div>
  );
}
