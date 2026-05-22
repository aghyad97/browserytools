export default function Content() {
  return (
    <div>
      <p>
        Salah satu sumber frustrasi paling umum bagi developer yang membangun dengan LLM adalah
        menabrak dinding tak terlihat — permintaan yang gagal tanpa penjelasan, percakapan yang
        tiba-tiba kehilangan konteks, atau dokumen yang diproses secara tidak lengkap. Dalam hampir
        setiap kasus, penyebabnya adalah jendela konteks. Memahami apa itu jendela konteks, apa arti
        batasnya dalam praktik, dan cara bekerja di dalamnya dengan terampil adalah fondasi untuk
        membangun aplikasi bertenaga AI yang andal.
      </p>
      <p>
        Anda dapat menggunakan{" "}
        <a href="/tools/context-window">BrowseryTools Context Window tool</a> — gratis, tanpa
        pendaftaran, semuanya tetap di browser Anda — untuk memvisualisasikan berapa banyak jendela
        konteks model yang ditempati konten Anda sebelum mengirimnya ke API.
      </p>

      <h2>Apa Itu Jendela Konteks?</h2>
      <p>
        Jendela konteks adalah jumlah teks maksimum — diukur dalam token — yang dapat "dilihat" dan
        dipikirkan oleh language model dalam satu permintaan. Ini adalah memori kerja model. Semua
        yang relevan untuk menghasilkan token berikutnya harus muat dalam jendela ini: system prompt
        Anda, seluruh riwayat percakapan, dokumen apa pun yang Anda sertakan, dan token yang sedang
        dihasilkan model saat ini.
      </p>
      <p>
        Berbeda dengan memori kerja manusia yang menurun secara bertahap saat kelebihan beban, jendela
        konteks memiliki batas yang tegas. Saat Anda melampaui batasnya, API mengembalikan error. Tidak
        ada keberhasilan sebagian — permintaan tersebut hanya gagal, dan aplikasi Anda harus menangani
        hal itu dengan anggun.
      </p>
      <p>
        Jendela konteks adalah satu kumpulan yang dibagi oleh input dan output. Jika model memiliki
        jendela konteks 128K token dan input Anda adalah 120K token, Anda hanya memiliki 8K token
        tersisa untuk respons model. Ini adalah batasan penting saat merancang tugas yang memerlukan
        output panjang.
      </p>

      <h2>Batas Jendela Konteks Saat Ini Berdasarkan Model</h2>
      <p>
        Jendela konteks telah tumbuh secara dramatis dalam beberapa tahun terakhir, dan angkanya terus
        berkembang seiring model meningkat:
      </p>
      <ul>
        <li>
          <strong>GPT-4o</strong> — 128.000 token (~96.000 kata). Cukup untuk novel penuh atau
          codebase besar.
        </li>
        <li>
          <strong>Claude 3.5 Sonnet / Claude 3 Opus</strong> — 200.000 token (~150.000 kata).
          Anthropic secara konsisten mendorong batas ini lebih jauh dari OpenAI.
        </li>
        <li>
          <strong>Gemini 1.5 Pro</strong> — 1.000.000 token (~750.000 kata). Jendela konteks yang
          benar-benar belum pernah ada sebelumnya yang dapat menampung seluruh codebase atau berjam-jam
          transkrip rapat.
        </li>
        <li>
          <strong>Gemini 1.5 Flash</strong> — 1.000.000 token, dioptimalkan untuk kecepatan dan
          biaya lebih rendah.
        </li>
        <li>
          <strong>Llama 3.1 (70B / 405B)</strong> — 128.000 token, tersedia melalui berbagai penyedia
          termasuk together.ai dan Groq.
        </li>
        <li>
          <strong>Mistral Large</strong> — 128.000 token.
        </li>
      </ul>
      <p>
        Sebagai perbandingan, seluruh posting blog ini sekitar 1.200 token. Bahkan jendela "kecil" 128K
        dari GPT-4o cukup besar untuk memproses keseluruhan sebagian besar dokumen praktis. Pertanyaannya
        bukan hanya apakah konten Anda muat — tetapi bagaimana model menangani konten di posisi yang
        berbeda dalam jendela tersebut.
      </p>

      <h2>Apa yang Terjadi Saat Anda Melampaui Jendela Konteks</h2>
      <p>
        Ketika input Anda melebihi panjang konteks maksimum model, API mengembalikan error. Pesan error
        umum meliputi:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// OpenAI
{
  "error": {
    "type": "invalid_request_error",
    "code": "context_length_exceeded",
    "message": "This model's maximum context length is 128000 tokens. However, your messages resulted in 134291 tokens."
  }
}

// Anthropic
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "prompt is too long: 201483 tokens > 200000 maximum"
  }
}`}
      </pre>
      <p>
        Dalam aplikasi chat, ini umumnya terjadi setelah cukup banyak putaran dalam percakapan panjang.
        Seiring setiap pesan pengguna dan balasan asisten ditambahkan ke riwayat, total jumlah token
        tumbuh hingga mencapai batas. Tanpa manajemen proaktif, aplikasi crash pada putaran berikutnya.
        Pengguna mengalami ini sebagai AI yang tiba-tiba menolak untuk merespons atau melempar error
        di tengah percakapan — pengalaman yang sangat membuat frustrasi.
      </p>

      <h2>Masalah "Lost in the Middle"</h2>
      <p>
        Memiliki jendela konteks besar tidak berarti model memperhatikan semua jendela itu secara setara.
        Penelitian secara konsisten menunjukkan bahwa model berbasis transformer bekerja lebih baik
        pada informasi yang ditempatkan di awal atau akhir konteks — fenomena yang dikenal sebagai
        masalah <strong>lost in the middle</strong>.
      </p>
      <p>
        Dalam praktiknya, ini berarti jika Anda melakukan retrieval-augmented generation (RAG) dan
        Anda menyuntikkan 20 potongan dokumen yang diambil ke tengah konteks panjang, model mungkin
        gagal mereferensikan potongan di posisi 8–14 meskipun mereka paling relevan. Informasi
        terpenting untuk tugas Anda harus ditempatkan baik di awal (dekat system prompt) atau di akhir
        (tepat sebelum pertanyaan pengguna) konteks.
      </p>
      <p>
        Ini juga berarti bahwa memberikan model jendela konteks 1 juta token dan membuang semua yang
        Anda miliki ke dalamnya tidak selalu merupakan strategi yang tepat. Konteks 10K yang terfokus
        dengan informasi yang tepat seringkali mengungguli konteks 500K yang diisi dengan materi yang
        kurang relevan.
      </p>

      <h2>Strategi untuk Bekerja dalam Batas Konteks</h2>

      <h3>Chunking</h3>
      <p>
        Untuk dokumen yang melebihi jendela konteks, pecah menjadi potongan yang saling tumpang tindih
        dan proses setiap potongan secara independen. Gunakan tumpang tindih kecil (misalnya 20% dari
        ukuran potongan) untuk mempertahankan kontinuitas di seluruh batas potongan. Ini bekerja dengan
        baik untuk tugas seperti peringkasan, ekstraksi, dan klasifikasi di mana setiap potongan relatif
        mandiri.
      </p>

      <h3>Peringkasan / Kompresi</h3>
      <p>
        Untuk percakapan panjang atau riwayat dokumen, secara berkala rangkum konten yang lebih lama
        dan gantikan dengan ringkasan tersebut. Percakapan 50 putaran sering kali dapat dipadatkan
        menjadi ringkasan 300 token yang mempertahankan konteks kunci tanpa menghabiskan seluruh riwayat.
        Ini sangat efektif dalam aplikasi chat di mana putaran awal percakapan menjadi kurang relevan
        seiring berlangsungnya percakapan.
      </p>

      <h3>Retrieval-Augmented Generation (RAG)</h3>
      <p>
        Alih-alih menempatkan seluruh dokumen dalam konteks, embed ke database vektor dan ambil hanya
        bagian yang paling relevan pada saat query. Sistem RAG yang dirancang dengan baik dapat membuat
        model dengan jendela konteks 128K secara efektif "mengetahui" tentang jutaan token dokumentasi —
        ia hanya mengambil apa yang diperlukan per query. Ini juga secara signifikan mengurangi biaya
        dibandingkan menggunakan model konteks penuh panjang pada setiap permintaan.
      </p>

      <h3>Pemilihan Konteks yang Selektif</h3>
      <p>
        Bersikaplah disengaja tentang apa yang Anda sertakan. Dalam asisten coding, Anda tidak perlu
        menyertakan setiap file dalam proyek — hanya file yang relevan dengan tugas saat ini. Dalam
        sistem tanya jawab dokumen, jangan sertakan seluruh dokumen kecuali pertanyaannya tentang
        sesuatu yang mencakup seluruh dokumen. Bangun logika yang memilih konteks secara cerdas daripada
        menyertakan semuanya secara default.
      </p>

      <h2>Cara Memantau Penggunaan Konteks Anda</h2>
      <p>
        Sebagian besar API penyedia AI mengembalikan penggunaan token dalam respons mereka. Objek respons
        OpenAI menyertakan kolom <code>usage</code> dengan <code>prompt_tokens</code>,{" "}
        <code>completion_tokens</code>, dan <code>total_tokens</code>. Anthropic mengembalikan{" "}
        <code>input_tokens</code> dan <code>output_tokens</code>. Mencatat hitungan ini untuk setiap
        permintaan memberi Anda visibilitas tren pertumbuhan sebelum Anda mencapai batas.
      </p>
      <p>
        Untuk pemeriksaan pra-penerbangan sebelum mengirim permintaan, gunakan{" "}
        <a href="/tools/context-window">BrowseryTools Context Window tool</a> untuk menempel prompt
        Anda dan melihat dengan tepat berapa banyak token yang ditempatinya dan berapa persentase dari
        jendela konteks setiap model yang diwakilinya. Ini sangat berguna saat membangun system prompt
        atau merancang strategi pengambilan RAG — Anda dapat melihat dampak pilihan Anda sebelum
        melakukan satu panggilan API pun.
      </p>

      <h2>Lebih Besar Tidak Selalu Lebih Baik</h2>
      <p>
        Perluasan jendela konteks adalah pencapaian rekayasa yang nyata, dan konteks satu juta token
        membuka kasus penggunaan yang benar-benar baru. Namun untuk sebagian besar aplikasi, strategi
        yang menang bukan mengisi jendela konteks sebanyak mungkin — melainkan menempatkan informasi
        yang tepat di posisi yang tepat dalam konteks yang terscope dengan baik. Kombinasikan itu
        dengan pemahaman tentang berapa banyak konteks yang Anda gunakan pada saat tertentu, dan Anda
        akan membangun aplikasi yang lebih cepat, lebih murah, dan lebih andal daripada yang
        memperlakukan jendela konteks sebagai tempat pembuangan.
      </p>

      <div style={{background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Context Window Tool Gratis — Visualisasikan Ukuran Prompt Anda Secara Instan
        </p>
        <a
          href="/tools/context-window"
          style={{background: "rgba(168,85,247,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Context Window Tool →
        </a>
      </div>
    </div>
  );
}
