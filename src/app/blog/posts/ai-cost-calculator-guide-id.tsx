import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        API AI telah memudahkan integrasi large language model ke dalam aplikasi — tetapi juga telah
        memudahkan penggunaan anggaran tanpa disadari. Penetapan harga berbasis token tidak langsung
        dipahami pada awalnya, dan perbedaan antara biaya input dan output, tingkatan model, serta
        volume permintaan dapat menciptakan tagihan yang jauh lebih besar dari yang diperkirakan.
        Beberapa menit estimasi di awal dapat menghemat banyak tagihan mengejutkan di kemudian hari.
      </p>
      <ToolCTA slug="ai-cost-calculator" variant="inline" />
      <p>
        Anda dapat menggunakan{" "}
        <a href="/tools/ai-cost-calculator">BrowseryTools AI Cost Calculator</a> — gratis, tanpa
        pendaftaran, semuanya tetap di browser Anda — untuk memodelkan biaya Anda di seluruh GPT-4,
        Claude, Gemini, dan model utama lainnya sebelum Anda menulis satu baris kode pun.
      </p>

      <h2>Cara Kerja Penetapan Harga Berbasis Token</h2>
      <p>
        Setiap API AI utama — OpenAI, Anthropic, Google — mengenakan biaya per token, bukan per
        permintaan atau per detik. Satu token kira-kira 3–4 karakter teks bahasa Inggris, atau sekitar
        0,75 kata. Saat Anda mengirim prompt ke API, penyedia menghitung token dalam input Anda,
        menghasilkan respons, menghitung token output tersebut, dan mengenakan biaya untuk keduanya —
        dengan tarif yang berbeda.
      </p>
      <p>
        Harga dikutip per 1.000 token (kadang per 1 juta token untuk tingkatan harga volume yang lebih
        baru). Pada awal 2026, patokan kasarnya terlihat seperti ini:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — ~$2,50 per 1 juta token input, ~$10,00 per 1 juta token output</li>
        <li><strong>Claude 3.5 Sonnet</strong> — ~$3,00 per 1 juta token input, ~$15,00 per 1 juta token output</li>
        <li><strong>Gemini 1.5 Pro</strong> — ~$1,25 per 1 juta token input, ~$5,00 per 1 juta token output</li>
        <li><strong>GPT-4o mini</strong> — ~$0,15 per 1 juta token input, ~$0,60 per 1 juta token output</li>
        <li><strong>Claude 3 Haiku</strong> — ~$0,25 per 1 juta token input, ~$1,25 per 1 juta token output</li>
      </ul>
      <p>
        Angka-angka ini berubah seiring model diperbarui, jadi selalu verifikasi dengan halaman harga
        penyedia saat ini. Poin utama adalah kesenjangan antara harga input dan output: token output
        biasanya berharga 3–5x lebih mahal daripada token input untuk model yang sama.
      </p>

      <h2>Mengapa Token Output Lebih Mahal</h2>
      <p>
        Asimetri antara harga input dan output mencerminkan perbedaan komputasi nyata. Memproses token
        input (selama tahap "prefill") melibatkan satu forward pass melalui lapisan attention model.
        Menghasilkan setiap token output (selama "decoding") memerlukan forward pass terpisah — secara
        serial, satu token sekaligus — yang jauh lebih intensif secara komputasi pada skala besar.
      </p>
      <p>
        Ini memiliki implikasi langsung untuk estimasi biaya: jumlah token output Anda lebih penting
        daripada jumlah token input Anda. System prompt 500 token yang menghasilkan respons 1.500 token
        biayanya lebih besar dalam output daripada keseluruhan input. Jika Anda merancang fitur yang
        menghasilkan dokumen panjang, laporan, atau file kode, modelkan panjang output dengan cermat —
        itulah yang mendominasi tagihan.
      </p>

      <h2>Memperkirakan Biaya Bulanan: Sebuah Kerangka</h2>
      <p>
        Untuk memperkirakan pengeluaran API AI bulanan Anda, Anda membutuhkan empat angka:
      </p>
      <ul>
        <li><strong>Rata-rata token input per permintaan</strong> — system prompt + pesan pengguna + konteks apa pun</li>
        <li><strong>Rata-rata token output per permintaan</strong> — panjang khas respons model</li>
        <li><strong>Permintaan per hari</strong> — volume panggilan harian yang diharapkan pada skala</li>
        <li><strong>Harga model</strong> — biaya input dan output per 1 juta token untuk model yang Anda rencanakan</li>
      </ul>
      <p>
        Rumusnya: <code>(avg_token_input × harga_input + avg_token_output × harga_output) × permintaan_per_hari × 30</code>.
        Terdengar sederhana, tetapi memperkirakan jumlah token sebelum Anda memiliki data nyata adalah
        tempat kebanyakan orang salah. System prompt "pendek" yang terdengar seperti 50 kata dapat
        dengan mudah menjadi 80–100 token. Pertanyaan pengguna ditambah riwayat percakapan dalam
        aplikasi chat dapat tumbuh menjadi ribuan token per permintaan tanpa manajemen yang cermat.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Contoh: bot dukungan pelanggan
avg_input_tokens  = 800   // system prompt + pesan pengguna + riwayat
avg_output_tokens = 300   // balasan dukungan tipikal
requests_per_day  = 5000  // volume produksi sedang
model             = Claude 3.5 Sonnet

daily_cost = (800 × $0.003 + 300 × $0.015) per 1K tokens × 5000
           = ($2.40 + $4.50) × 5
           = ~$34.50/hari → ~$1,035/bulan`}
      </pre>
      <p>
        Beban kerja yang sama pada GPT-4o mini dengan $0,15/$0,60 per 1 juta token akan berharga
        sekitar $15/bulan. Pilihan model saja adalah perbedaan biaya 70x untuk beban kerja ini.
      </p>

      <h2>Strategi Praktis untuk Mengurangi Biaya API AI</h2>
      <p>
        Setelah memiliki estimasi biaya, langkah selanjutnya adalah mengidentifikasi tempat untuk
        memangkas. Berikut teknik dengan leverage paling tinggi:
      </p>
      <ul>
        <li>
          <strong>Pilih tingkatan model yang tepat</strong> — Gunakan model kuat (GPT-4, Claude Sonnet,
          Gemini Pro) hanya untuk tugas yang memerlukan penalaran mendalam. Untuk klasifikasi,
          ekstraksi sederhana, atau Q&A singkat, model yang lebih kecil seperti GPT-4o mini atau
          Claude Haiku memberikan hasil yang sebanding dengan biaya 10–50x lebih rendah.
        </li>
        <li>
          <strong>Cache input yang berulang</strong> — Jika system prompt Anda sama di ribuan
          permintaan, prompt caching (didukung oleh Anthropic dan OpenAI) memungkinkan Anda
          menghindari tokenisasi ulang setiap saat. Pada aplikasi volume tinggi ini saja dapat
          memotong biaya 30–50%.
        </li>
        <li>
          <strong>Pangkas konteks secara agresif</strong> — Setiap token dalam jendela konteks
          berharga uang. Dalam aplikasi chat, jangan sertakan seluruh riwayat percakapan — pertahankan
          jendela bergulir dari 5–10 putaran terakhir, atau rangkum putaran yang lebih lama. Dalam
          pipeline RAG, ambil hanya potongan yang paling relevan daripada memasukkan dokumen secara
          massal.
        </li>
        <li>
          <strong>Batasi max_tokens output</strong> — Tetapkan <code>max_tokens</code> yang sesuai
          dengan tugas. Jika Anda menghasilkan judul produk, batasi di 30 token. Jika model tidak
          dapat menjawab dalam batas Anda, Anda akan menangkap kasus tepi itu daripada secara diam-diam
          membayar untuk ucapan panjang 2.000 token.
        </li>
        <li>
          <strong>Batch di mana memungkinkan</strong> — Baik OpenAI maupun Anthropic menawarkan API
          batch dengan diskon 50% untuk beban kerja yang tidak memerlukan respons real-time. Pekerjaan
          pemrosesan malam, klasifikasi dokumen, dan pipeline pembuatan konten adalah kandidat yang baik.
        </li>
        <li>
          <strong>Pantau dan beri peringatan</strong> — Tetapkan batas pengeluaran dan peringatan
          penggunaan di dasbor penyedia Anda sebelum masuk ke produksi. Bug dalam logika retry atau
          infinite loop dapat mengubah estimasi $50/bulan menjadi kejutan $5.000 sebelum Anda menyadarinya.
        </li>
      </ul>

      <h2>Perencanaan Anggaran untuk Berbagai Kasus Penggunaan</h2>
      <p>
        Berbagai jenis aplikasi memiliki profil biaya yang sangat berbeda. Model mental cepat:
      </p>
      <ul>
        <li>
          <strong>Prototipe dan proyek pribadi</strong> — $5–20/bulan. Gunakan model mini/haiku,
          jaga konteks tetap pendek, bangun di tingkatan gratis di mana memungkinkan.
        </li>
        <li>
          <strong>Alat bisnis internal (volume rendah)</strong> — $50–300/bulan. Beberapa ratus
          karyawan menggunakan alat pencarian atau dokumen berbantuan AI beberapa kali sehari.
        </li>
        <li>
          <strong>Aplikasi konsumen dengan fitur AI (skala sedang)</strong> — $500–5.000/bulan.
          Puluhan ribu pengguna aktif berinteraksi dengan fitur AI setiap hari. Pilihan model
          sangat penting di sini.
        </li>
        <li>
          <strong>Produk AI inti (volume tinggi)</strong> — $10.000+/bulan. AI adalah proposisi nilai
          utama, digunakan terus-menerus. Pada skala ini, negosiasikan harga enterprise dan investasikan
          dalam infrastruktur caching dan manajemen konteks.
        </li>
      </ul>

      <h2>Mulai dengan Estimasi Biaya</h2>
      <p>
        Sebelum Anda berkomitmen pada model, arsitektur, atau tingkatan harga, modelkan biaya Anda
        dengan angka nyata. {" "}
        <a href="/tools/ai-cost-calculator">BrowseryTools AI Cost Calculator</a> memungkinkan Anda
        memasukkan jumlah token, volume permintaan, dan pilihan model untuk melihat perkiraan
        pengeluaran bulanan berdampingan di seluruh penyedia. Hanya butuh dua menit dan dapat
        menghemat berbulan-bulan kejutan tagihan yang menyakitkan.
      </p>

      <div style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          AI Cost Calculator Gratis — Bandingkan GPT-4, Claude, Gemini
        </p>
        <a
          href="/tools/ai-cost-calculator"
          style={{background: "rgba(16,185,129,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka AI Cost Calculator →
        </a>
      </div>
      <ToolCTA slug="ai-cost-calculator" variant="card" />
    </div>
  );
}
