export default function Content() {
  return (
    <div>
      <p>
        Freelancer dan pemilik usaha kecil kehilangan uang dengan dua cara: melakukan pekerjaan yang
        tidak pernah dibayar, dan menagih dengan buruk sehingga pembayaran terlambat atau tidak
        masuk sama sekali. Invoice profesional bukan sekadar permintaan pembayaran — ini adalah dokumen
        hukum yang menetapkan apa yang telah disepakati, kapan pembayaran jatuh tempo, dan apa
        konsekuensi dari keterlambatan pembayaran. Melakukannya dengan benar lebih penting dari yang
        disadari kebanyakan orang sampai mereka harus mengejar invoice yang sudah melewati jatuh tempo
        dari klien yang tidak merespons.
      </p>
      <p>
        Panduan ini mencakup semua yang harus ada dalam invoice profesional, konvensi tentang penomoran
        dan syarat pembayaran, bagaimana persyaratan invoicing berbeda antar negara, dan mengapa
        alat yang tepat untuk kebanyakan freelancer adalah sesuatu yang sederhana, gratis, dan privat
        daripada langganan lain.
      </p>
      <p>
        Kamu bisa menggunakan{" "}
        <a href="/tools/invoice">BrowseryTools Invoice Generator</a> — gratis, tanpa daftar, semua
        data tersimpan di browsermu.
      </p>

      <h2>Apa yang Harus Ada dalam Invoice Profesional</h2>
      <p>
        Invoice yang menghilangkan informasi yang diperlukan dapat menunda pembayaran, menyebabkan
        masalah akuntansi bagi klienmu, atau gagal memenuhi persyaratan hukum di yurisdiksi tertentu.
        Minimal, setiap invoice profesional memerlukan:
      </p>
      <ul>
        <li>
          <strong>Nomor invoice</strong> — Pengenal urutan yang unik. Ini penting untuk pelacakan,
          untuk sistem piutang klienmu, dan untuk catatanmu sendiri. Setelah kamu menggunakan nomor,
          jangan pernah menggunakannya kembali.
        </li>
        <li>
          <strong>Tanggal invoice</strong> — Tanggal invoice diterbitkan. Ini adalah titik referensi
          dari mana syarat pembayaran dihitung.
        </li>
        <li>
          <strong>Tanggal jatuh tempo</strong> — Tanggal pembayaran harus diterima. Menyatakannya
          secara eksplisit menghilangkan ambiguitas dan memberimu dasar untuk menindaklanjuti setelah
          tanggal tersebut berlalu.
        </li>
        <li>
          <strong>Detail bisnismu</strong> — Nama legal atau nama bisnis, alamat, email, dan nomor
          registrasi pajak yang berlaku (nomor VAT di EU/UK, ABN di Australia, nomor GST di Kanada).
        </li>
        <li>
          <strong>Detail klien</strong> — Nama legal perusahaan atau individu yang kamu tagih dan
          alamat penagihan mereka. Menggunakan nama entitas yang salah adalah kesalahan umum yang
          dapat menyebabkan invoice ditolak oleh departemen keuangan klien.
        </li>
        <li>
          <strong>Layanan atau produk yang dirinci</strong> — Rincian baris per baris tentang apa
          yang telah diserahkan, kuantitas atau jam, harga satuan, dan total baris. Jangan pernah
          mengirim invoice satu baris untuk jumlah bulat — terlihat informal dan mengundang
          perselisihan.
        </li>
        <li>
          <strong>Subtotal, pajak, dan total</strong> — Jika kamu membebankan pajak, tampilkan sebagai
          baris terpisah sehingga klien dapat merekonsiliasi dengan kewajiban pajak mereka.
        </li>
        <li>
          <strong>Instruksi pembayaran</strong> — Detail rekening bank, alamat PayPal, atau metode
          pembayaran yang disukai. Klien tidak bisa membayarmu jika mereka tidak tahu caranya.
        </li>
      </ul>

      <h2>Konvensi Penomoran Invoice</h2>
      <p>
        Nomor invoice harus berurutan, unik, dan tidak pernah dilewati atau digunakan kembali. Tidak
        ada format tunggal yang diwajibkan, tetapi beberapa pola umum digunakan:
      </p>
      <ul>
        <li><strong>Urutan sederhana:</strong> 001, 002, 003 — cocok ketika kamu hanya punya satu klien atau volume invoice rendah</li>
        <li><strong>Awalan tanggal:</strong> 2026-001, 2026-002 — awalan tahun memudahkan pencarian invoice secara kronologis dan memulai ulang penomoran setiap tahun tanpa kebingungan</li>
        <li><strong>Awalan klien:</strong> ACME-001, ACME-002 — berguna ketika kamu memiliki sejumlah kecil klien jangka panjang dan ingin invoice diorganisir berdasarkan hubungan</li>
      </ul>
      <p>
        Format apa pun yang kamu pilih, konsistenlah. Celah dalam urutan invoice — di mana kamu
        melompat dari INV-047 ke INV-049 — dapat menimbulkan pertanyaan saat audit. Jika invoice
        dibatalkan atau dibatalkan nilainya, catat dalam catatanmu tetapi simpan nomor tersebut
        sebagai pensiun daripada menggunakannya kembali.
      </p>

      <h2>Syarat Pembayaran: Net 30, Net 15, Due on Receipt</h2>
      <p>
        Syarat pembayaran menentukan berapa lama klien harus membayar setelah menerima invoice.
        Syarat yang paling umum adalah:
      </p>
      <ul>
        <li>
          <strong>Due on Receipt</strong> — Pembayaran diharapkan segera setelah menerima invoice.
          Dalam praktiknya ini jarang diterapkan secara ketat, tetapi menandakan urgensi dan sesuai
          untuk pekerjaan kecil atau satu kali dengan klien baru.
        </li>
        <li>
          <strong>Net 7</strong> — Pembayaran jatuh tempo dalam 7 hari. Standar untuk proyek kecil
          yang cepat selesai atau ketika kamu memiliki tekanan arus kas.
        </li>
        <li>
          <strong>Net 15</strong> — Pembayaran jatuh tempo dalam 15 hari. Default yang wajar untuk
          sebagian besar pekerjaan freelance dan invoicing bisnis kecil.
        </li>
        <li>
          <strong>Net 30</strong> — Pembayaran jatuh tempo dalam 30 hari. Syarat yang paling umum
          dalam invoicing bisnis-ke-bisnis. Perusahaan besar sering memiliki siklus pembayaran yang
          default ke Net 30, jadi menggunakan syarat ini dengan klien korporat mengurangi hambatan.
        </li>
        <li>
          <strong>Net 60 atau Net 90</strong> — Standar di beberapa industri (manufaktur, konstruksi,
          kontrak pemerintah tertentu). Hindari ini kecuali merupakan standar industri di bidangmu —
          mereka menghancurkan arus kas untuk operasi kecil.
        </li>
      </ul>
      <p>
        Sebagai freelancer, Net 15 adalah default yang solid. Ini memberikan klien cukup waktu untuk
        memproses invoice melalui sistem mereka sambil menjaga siklus kasmu tetap ketat. Selalu
        nyatakan tanggal jatuh tempo yang tepat secara eksplisit (misalnya, "Jatuh Tempo: 15 April
        2026") daripada hanya mengandalkan syarat ("Net 15") — tanggal eksplisit tidak memberi ruang
        untuk kesalahpahaman.
      </p>

      <h2>Biaya Keterlambatan: Kapan Menagihnya dan Cara Menyatakannya</h2>
      <p>
        Biaya keterlambatan pembayaran adalah mekanisme yang sah dan legal untuk mendorong pembayaran
        tepat waktu. Namun, mekanisme ini hanya berhasil jika dinyatakan terlebih dahulu — idealnya
        dalam kontrakmu dan di invoicemu. Mengejutkan klien dengan biaya keterlambatan yang tidak
        pernah dibahas merusak hubungan dan mungkin tidak dapat diberlakukan.
      </p>
      <p>
        Struktur biaya keterlambatan standar adalah 1,5% per bulan (18% per tahun) dari saldo yang
        terutang. Beberapa freelancer menggunakan pendekatan biaya tetap: $25–50 untuk invoice di
        bawah $1.000, meningkat untuk jumlah yang lebih besar. Keduanya wajar. Nyatakan di invoice
        sebagai: "Biaya keterlambatan pembayaran sebesar 1,5% per bulan akan dikenakan pada saldo
        yang terutang setelah tanggal jatuh tempo."
      </p>
      <p>
        Dalam praktiknya, memberlakukan biaya keterlambatan dengan klien jangka panjang membutuhkan
        penilaian. Menagih biaya keterlambatan tiga hari kepada klien yang baik yang telah membayar
        dengan andal selama dua tahun kemungkinan akan menelanmu lebih banyak dalam hal niat baik
        daripada biaya yang dipulihkan. Gunakan biaya sebagai pengungkit dengan pembayar yang
        terbiasa terlambat, dan sebagai hak terdokumentasi yang kamu miliki sebagai cadangan.
      </p>

      <h2>Bagaimana Invoicing Berbeda Antar Negara</h2>
      <p>
        Kewajiban pajak pada invoice sangat bervariasi antar yurisdiksi, dan kesalahan dapat
        menciptakan masalah kepatuhan:
      </p>
      <ul>
        <li>
          <strong>UK dan EU (VAT)</strong> — Jika kamu terdaftar VAT, kamu harus mencantumkan nomor
          VAT dan menampilkan VAT sebagai baris terpisah. Tarifnya di UK adalah 20% standar, dengan
          tarif yang dikurangi untuk beberapa barang/jasa. Tarif EU bervariasi per negara (Jerman
          19%, Prancis 20%, Irlandia 23%). Invoice B2B di dalam EU memerlukan nomor VAT klien untuk
          perlakuan reverse-charge.
        </li>
        <li>
          <strong>Australia (GST)</strong> — GST adalah 10% dan harus ditampilkan secara terpisah
          di invoice yang diterbitkan oleh bisnis yang terdaftar GST. Kamu harus mencantumkan ABN
          (Australian Business Number). Invoice di atas AUD $1.000 juga harus mencantumkan kata
          "Tax Invoice."
        </li>
        <li>
          <strong>Kanada (GST/HST)</strong> — Bisnis yang terdaftar untuk GST/HST harus menampilkan
          nomor registrasi dan GST/HST yang dibebankan. Tarif gabungan bervariasi berdasarkan
          provinsi.
        </li>
        <li>
          <strong>AS</strong> — Invoicing federal memiliki lebih sedikit elemen wajib daripada
          sistem berbasis VAT, tetapi pajak penjualan negara bagian mungkin berlaku untuk barang
          dan layanan tertentu. Periksa persyaratan negaramu jika kamu menjual barang berwujud.
        </li>
      </ul>

      <h2>Mengapa Invoice PDF Penting</h2>
      <p>
        Mengirim invoice sebagai PDF daripada dokumen Word atau tautan web penting karena beberapa
        alasan. PDF memiliki format tetap — klien yang menerima invoice melihat persis apa yang kamu
        maksudkan, terlepas dari sistem operasi atau perangkat lunak mereka. PDF tidak bisa diedit
        secara tidak sengaja. PDF dapat dicetak, diarsipkan, dan dilampirkan ke perangkat lunak
        akuntansi tanpa pemformatan yang rusak.
      </p>
      <p>
        Banyak departemen akuntansi perusahaan akan menolak invoice non-PDF, memerlukan pengiriman
        ulang. Menghasilkan PDF yang bersih dari awal menghilangkan hambatan ini.
      </p>

      <h2>Alat Invoicing Gratis vs. Berbayar</h2>
      <p>
        FreshBooks membebankan mulai $17/bulan, QuickBooks dari $30/bulan, dan Wave (yang gratis)
        sekarang membebankan untuk pemrosesan pembayaran. Untuk freelancer yang mengirim 5–20 invoice
        per bulan, tidak ada fitur ini yang membenarkan biayanya. Yang benar-benar kamu butuhkan
        adalah: masukkan item baris, tambahkan detail bisnismu, pilih syarat pembayaran, buat PDF.
        Itu saja.
      </p>
      <p>
        <a href="/tools/invoice">BrowseryTools Invoice Generator</a> melakukan persis itu — tanpa
        akun, tanpa langganan, dan tidak ada yang disimpan di server mana pun. Isi detailmu, tambahkan
        item baris, atur syarat pembayaran, dan unduh PDF yang bersih. Data invoicemu tetap di
        browsermu.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Generator Invoice Gratis — Output PDF, Tanpa Akun
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Buat invoice profesional dengan item baris terperinci, pajak, dan syarat pembayaran.
          Unduh sebagai PDF seketika. Tidak ada yang disimpan di server kami.
        </p>
        <a
          href="/tools/invoice"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buat Invoice →
        </a>
      </div>
    </div>
  );
}
