import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Ketika developer pertama kali mulai bekerja dengan API large language model, satu pertanyaan
        hampir selalu muncul segera: "Seberapa panjang yang terlalu panjang?" Mereka berpikir dalam
        kata, paragraf, atau karakter — tetapi model berpikir dalam token. Memahami apa itu token,
        bagaimana dihitung, dan mengapa hitungan itu penting adalah salah satu hal yang paling berguna
        secara praktis yang bisa Anda pelajari sebelum membangun sesuatu yang serius di atas LLM.
      </p>
      <ToolCTA slug="token-counter" variant="inline" />
      <p>
        Anda dapat menggunakan{" "}
        <a href="/tools/token-counter">BrowseryTools Token Counter</a> — gratis, tanpa pendaftaran,
        semuanya tetap di browser Anda — untuk menghitung token untuk teks apa pun sebelum Anda
        mengirimnya ke API.
      </p>

      <h2>Apa Itu Token? (Bukan Kata, Bukan Karakter)</h2>
      <p>
        Token adalah unit dasar teks yang diproses oleh language model. Ini bukan kata. Ini bukan
        karakter. Ini adalah potongan teks yang tokenizer model telah belajar untuk diperlakukan
        sebagai satu unit — dan potongan itu bisa berupa satu karakter hingga fragmen kata multi-karakter
        atau seluruh kata yang umum.
      </p>
      <p>
        Berikut beberapa contoh cara kalimat mungkin dipecah menjadi token oleh tokenizer keluarga GPT:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`"Hello, world!"
→ ["Hello", ",", " world", "!"]  — 4 token

"unbelievable"
→ ["un", "believ", "able"]  — 3 token

"ChatGPT"
→ ["Chat", "G", "PT"]  — 3 token

"2026-03-22"
→ ["2026", "-", "03", "-", "22"]  — 5 token`}
</pre>
      <p>
        Perhatikan bagaimana kata-kata pendek umum seperti "Hello" dipetakan ke satu token, sementara
        kata-kata yang lebih panjang atau tidak umum dipecah menjadi beberapa token. Tanda baca, angka,
        dan karakter khusus sering kali merupakan token tersendiri. Tokenizer tidak hanya memisahkan
        pada spasi atau tanda baca — ia menggunakan kosakata yang dipelajari dari unit sub-kata untuk
        mencapai keseimbangan terbaik antara ukuran kosakata dan efisiensi representasi.
      </p>

      <h2>Cara Kerja Tokenizer: Byte-Pair Encoding</h2>
      <p>
        Sebagian besar LLM modern — GPT-4, Claude, Gemini, Llama — menggunakan varian dari{" "}
        <strong>Byte-Pair Encoding (BPE)</strong> atau algoritma terkait erat yang disebut SentencePiece.
        BPE awalnya dikembangkan untuk kompresi data; diadaptasi untuk NLP karena secara elegan
        memecahkan masalah open-vocabulary.
      </p>
      <p>
        Proses pelatihan BPE dimulai dengan karakter individual (atau byte) sebagai kosakata dasar.
        Kemudian berulang kali menemukan pasangan simbol yang paling sering muncul bersamaan dalam
        corpus pelatihan dan menggabungkannya menjadi simbol tunggal baru. Setelah ribuan penggabungan
        seperti itu, kosakata yang dihasilkan berisi kata-kata umum sebagai token tunggal, awalan dan
        akhiran umum sebagai token, dan kata-kata langka sebagai urutan token yang lebih kecil. Ukuran
        kosakata akhir biasanya 32.000 hingga 100.000 token.
      </p>
      <p>
        Ini berarti tokenisasi teks apa pun sepenuhnya bergantung pada kosakata spesifik yang dilatih
        model tersebut. <strong>GPT-4, Claude, dan Gemini semuanya menggunakan tokenizer yang berbeda</strong>{" "}
        — teks yang sama dapat ter-tokenisasi menjadi jumlah yang berbeda di setiap model. Jangan pernah
        mengasumsikan jumlah token yang Anda ukur untuk satu model berlaku untuk model lain.
      </p>

      <h2>Aturan Praktis "750 Kata per 1.000 Token"</h2>
      <p>
        Anda sering akan melihat perkiraan "1.000 token ≈ 750 kata" dikutip untuk teks bahasa Inggris.
        Ini adalah heuristik yang masuk akal untuk prosa biasa — posting blog, artikel, dokumentasi.
        Ini berasal dari pengamatan bahwa dalam corpus bahasa Inggris yang seimbang, panjang token
        rata-rata sekitar 4–5 karakter, dan kata bahasa Inggris rata-rata sekitar 5 karakter ditambah
        spasi. Jadi satu kata dipetakan ke sekitar 1,3 token rata-rata.
      </p>
      <p>
        Namun "aturan praktis" adalah framing yang tepat — ini cepat rusak dalam praktik:
      </p>
      <ul>
        <li>
          <strong>Kode ter-tokenisasi lebih padat</strong> — Bahasa pemrograman menggunakan banyak
          kata kunci pendek, operator, dan identifier yang sering berupa token tunggal. Blok Python
          mungkin ter-tokenisasi ke lebih sedikit token per karakter daripada prosa bahasa Inggris.
        </li>
        <li>
          <strong>URL dan string teknis mahal</strong> — URL panjang seperti{" "}
          <code>https://api.example.com/v2/users/84219/preferences?include=notifications</code> mungkin
          ter-tokenisasi menjadi 20+ token meskipun terlihat pendek di layar.
        </li>
        <li>
          <strong>Angka mengejutkan mahalnya</strong> — Setiap digit dalam angka panjang sering kali
          merupakan token terpisah. Angka "1738371600" bisa menjadi 5–7 token.
        </li>
        <li>
          <strong>Spasi putih berulang dan pemformatan</strong> — JSON dengan indentasi pretty-print,
          tabel Markdown, dan kode dengan sarang yang dalam semuanya menambahkan token dari spasi putih.
        </li>
      </ul>

      <h2>Bahasa Non-Inggris: Arab, Cina, dan Perbedaan Biaya Token</h2>
      <p>
        Heuristik 750-kata-per-1.000-token adalah heuristik <em>bahasa Inggris</em>. Untuk bahasa lain,
        rasionya bisa sangat berbeda — dan ini memiliki implikasi biaya nyata untuk aplikasi multibahasa.
      </p>
      <p>
        <strong>Arab dan Ibrani</strong> menggunakan morfologi akar-dan-pola, di mana satu akar
        menghasilkan lusinan bentuk turunan melalui prefiks, akhiran, dan perubahan vokal internal.
        Kata-kata seperti "وسيستخدمونها" (mereka akan menggunakannya) adalah kata ortografis tunggal
        tetapi mungkin ter-tokenisasi menjadi 5–8 token karena kosakata BPE dilatih terutama pada
        data bahasa Inggris dan tidak memiliki bentuk Arab ini sebagai token tunggal.
      </p>
      <p>
        <strong>Cina dan Jepang</strong> memiliki tantangan yang berbeda. Karakter bersifat logografis —
        setiap karakter adalah unit bermakna — tetapi kosakata token mencakup karakter tunggal umum
        dan beberapa kata multi-karakter umum. Teks Cina biasanya berjalan 1,5–2x lebih banyak token
        per "setara kata" daripada bahasa Inggris. Jepang, dengan campuran hiragana, katakana, dan
        kanji, bahkan bisa lebih tinggi.
      </p>
      <p>
        Implikasi praktis: jika Anda membangun aplikasi untuk Arab, Cina, atau bahasa skrip non-Latin
        lainnya, estimasi biaya Anda yang berasal dari pengujian bahasa Inggris akan secara signifikan
        memperkirakan terlalu rendah biaya API aktual. Selalu ukur jumlah token dengan konten aktual
        Anda menggunakan{" "}
        <a href="/tools/token-counter">BrowseryTools Token Counter</a> atau pustaka tokenizer sebelum
        membuat proyeksi anggaran.
      </p>

      <h2>Batas Jendela Konteks: Mengapa Melampaui Batas Merusak Segalanya</h2>
      <p>
        Setiap LLM memiliki <strong>jendela konteks</strong> — jumlah token maksimum yang dapat
        diproses dalam satu permintaan, menghitung baik input maupun output model Anda. Pada awal 2026:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — 128.000 token</li>
        <li><strong>Claude 3.5 Sonnet</strong> — 200.000 token</li>
        <li><strong>Gemini 1.5 Pro</strong> — 1.000.000 token</li>
        <li><strong>Llama 3.1 70B</strong> — 128.000 token</li>
      </ul>
      <p>
        Jika input Anda melebihi batas jendela konteks, API akan mengembalikan error — permintaan
        tersebut hanya gagal. Tidak ada degradasi yang anggun secara default; Anda perlu menangani
        ini dalam logika aplikasi Anda. Lebih halus lagi, bahkan dalam jendela konteks, ada fenomena
        yang disebut masalah "lost in the middle": model cenderung mengingat informasi di awal dan
        akhir konteks mereka lebih baik daripada informasi yang terkubur di tengah. Jendela konteks
        200K tidak berarti setiap token di dalamnya diperhatikan secara setara.
      </p>
      <p>
        Untuk aplikasi chat, jendela konteks terisi seiring percakapan berkembang. Setelah cukup banyak
        putaran, Anda harus memotong pesan lama, merangkumnya, atau mencapai batas dan gagal. Mengetahui
        jumlah token Anda di setiap langkah adalah yang memungkinkan Anda membuat keputusan tersebut
        secara proaktif.
      </p>

      <h2>Implikasi Desain Prompt</h2>
      <p>
        Kesadaran token mengubah cara Anda menulis prompt. Beberapa implikasi konkret:
      </p>
      <ul>
        <li>
          <strong>System prompt berlipat ganda di setiap permintaan</strong> — System prompt 500 token
          berharga 500 × permintaan Anda × harga input Anda. Pada 10.000 permintaan harian, memangkas
          system prompt dari 500 ke 300 token menghemat uang nyata setiap bulan.
        </li>
        <li>
          <strong>Contoh few-shot mahal tetapi efektif</strong> — Menyertakan 3 contoh dalam prompt
          Anda mungkin menambahkan 300–500 token. Ukur apakah peningkatan kualitas itu sepadan dengan
          biaya versus fine-tuning model sekali.
        </li>
        <li>
          <strong>Panjang output dapat dikendalikan</strong> — Gunakan <code>max_tokens</code> untuk
          membatasi output model. Tambahkan instruksi eksplisit dalam prompt Anda: "Balas dalam kurang
          dari 100 kata." Model umumnya mengikuti instruksi panjang output dengan baik, yang secara
          langsung mengurangi biaya token output.
        </li>
        <li>
          <strong>Pemformatan JSON menambahkan overhead</strong> — Jika Anda menggunakan output
          terstruktur (mode JSON), tanda kutip, kurung, dan nama kunci menambahkan token di atas nilai
          data aktual Anda. Respons dengan 5 kolom pendek bisa dengan mudah memiliki overhead 40%
          dalam token pemformatan.
        </li>
      </ul>

      <h2>Hitung Token Sebelum Anda Mengirim</h2>
      <p>
        Kebiasaan terbaik yang perlu dibangun saat bekerja dengan API LLM adalah menghitung token
        sebelum berkomitmen pada arsitektur atau masuk ke produksi. Tempel system prompt Anda, pesan
        pengguna representatif, dan konteks apa pun yang Anda rencanakan untuk disertakan ke dalam{" "}
        <a href="/tools/token-counter">BrowseryTools Token Counter</a>. Anda akan langsung melihat
        apakah desain Anda jauh dalam jendela konteks atau berbahaya mendekati batasnya — dan Anda
        akan memiliki angka yang diperlukan untuk memperkirakan biaya secara akurat.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Token Counter Gratis — Bekerja di Browser Anda, Tanpa Pendaftaran
        </p>
        <a
          href="/tools/token-counter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Token Counter →
        </a>
      </div>
      <ToolCTA slug="token-counter" variant="card" />
    </div>
  );
}
