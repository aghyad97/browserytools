import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Setiap teks adalah sidik jari. Kata-kata yang paling sering dijangkau penulis, istilah
        yang mengelompok dalam sebuah dokumen, frasa yang berulang tanpa disadari penulis — pola
        ini mengungkapkan struktur, penekanan, dan kebiasaan dengan cara yang terlewatkan
        sepenuhnya oleh sekadar membaca. Analisis frekuensi kata adalah teknik yang membuat pola
        ini terlihat, dan berguna di berbagai bidang yang mengejutkan: kerajinan menulis, SEO,
        penelitian akademis, dan bahkan forensik.
      </p>
      <ToolCTA slug="word-frequency" variant="inline" />
      <p>
        Kamu bisa menganalisis frekuensi kata teks apa pun secara instan menggunakan{" "}
        <a href="/tools/word-frequency">BrowseryTools Word Frequency Analyzer</a> — gratis, tanpa
        daftar, semuanya tetap di browsermu.
      </p>

      <h2>Apa yang Diungkapkan Analisis Frekuensi Kata</h2>
      <p>
        Pada dasarnya, analisis frekuensi kata menghitung berapa kali setiap kata muncul dalam
        teks dan mengurutkan hasilnya. Namun wawasan yang dihasilkannya lebih kaya dari deskripsi
        itu:
      </p>
      <ul>
        <li><strong>Identifikasi topik</strong> — kata konten yang paling sering muncul (setelah menghapus kata fungsi umum) memberitahumu tentang apa yang terutama dibicarakan dokumen</li>
        <li><strong>Pola penulisan</strong> — analisis frekuensi mengungkap kata-kata yang secara kebiasaan digunakan berlebihan oleh penulis, sering kali tanpa disadari</li>
        <li><strong>Kepadatan kata kunci</strong> — dalam SEO, frekuensi kata kunci target relatif terhadap total jumlah kata adalah sinyal yang bermakna</li>
        <li><strong>Kekayaan kosakata</strong> — rasio kata unik terhadap total kata (type-token ratio) adalah ukuran kasar keragaman leksikal</li>
        <li><strong>Sinyal kepengarangan</strong> — frekuensi kata fungsi (seberapa sering penulis menggunakan "the" vs "a," atau "however" vs "but") sangat individual dan konsisten</li>
      </ul>

      <h2>Stop Word dan Mengapa Difilter</h2>
      <p>
        Jika kamu menjalankan analisis frekuensi kata mentah pada hampir semua teks Inggris, hasil
        teratasnya akan hampir identik: "the," "a," "and," "of," "to," "in," "is," "that." Ini
        adalah stop word — kata fungsi berfrekuensi tinggi yang membawa struktur gramatikal tetapi
        sedikit makna semantik. Menghitungnya hampir tidak memberi tahu apa pun tentang topik
        sebuah dokumen.
      </p>
      <p>
        Pemfilteran stop word menghapus istilah-istilah ini sebelum analisis, hanya menyisakan
        kata konten yang benar-benar menyampaikan makna. Daftar stop word untuk bahasa Inggris
        biasanya mencakup:
      </p>
      <ul>
        <li>Artikel: a, an, the</li>
        <li>Preposisi: of, in, at, by, for, with, about, against, between, through</li>
        <li>Konjungsi: and, but, or, nor, so, yet, for</li>
        <li>Kata ganti: I, you, he, she, it, we, they, them, their</li>
        <li>Kata kerja bantu: is, are, was, were, be, been, have, has, had, do, does, did, will, would, can, could</li>
      </ul>
      <p>
        Aplikasi yang berbeda membutuhkan daftar stop word yang berbeda. Untuk analisis SEO kamu
        mungkin ingin menyertakan "how," "what," "best," dan "top" sebagai stop word karena muncul
        di hampir setiap artikel. Untuk analisis kepengarangan, kamu secara khusus menginginkan
        kata fungsi — stop word konvensional — karena itulah sidik jari stilistik yang stabil.
      </p>

      <h2>TF-IDF: Ketika Frekuensi Mentah Tidak Cukup</h2>
      <p>
        Frekuensi istilah mentah memiliki masalah: beberapa kata muncul sering dalam sebuah
        dokumen hanya karena mereka muncul sering di semua dokumen jenis tersebut. Jika kamu
        menganalisis artikel teknologi, kata-kata seperti "software," "data," dan "system" akan
        muncul dengan frekuensi tinggi di setiap artikel — mereka tidak berguna untuk membedakan
        apa yang membuat artikel tertentu menjadi unik.
      </p>
      <p>
        TF-IDF (Term Frequency — Inverse Document Frequency) mengatasi ini dengan memberi bobot
        frekuensi setiap istilah terhadap seberapa sering muncul di seluruh kumpulan dokumen.
        Rumusnya adalah:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`TF-IDF(term, document) = TF(term, document) × IDF(term, corpus)

TF = count(term in document) / total words in document
IDF = log(total documents / documents containing term)`}
      </pre>
      <p>
        Istilah yang sering muncul dalam satu dokumen tetapi jarang di dokumen lain mendapatkan
        skor TF-IDF tinggi — itu adalah istilah yang khas untuk dokumen tersebut. Istilah yang
        sering muncul di mana-mana mendapatkan skor TF-IDF rendah. Inilah mengapa search engine
        menggunakan TF-IDF sebagai sinyal relevansi inti: halaman yang sering menggunakan
        "mycorrhizal fungi" benar-benar tentang mycorrhizal fungi, sementara halaman yang sering
        menggunakan "the" tidak secara khusus tentang apa pun.
      </p>

      <h2>Kasus Penggunaan untuk Penulis</h2>
      <p>
        Analisis frekuensi kata adalah salah satu alat self-editing yang paling praktis yang
        tersedia untuk penulis. Ia mengeksternalisasi pola yang hampir tidak terlihat selama
        proses penulisan:
      </p>
      <ul>
        <li>
          <strong>Mendeteksi kata yang digunakan berlebihan</strong> — sebagian besar penulis
          memiliki kata favorit yang tidak disadari. Menjalankan analisis frekuensi pada draf
          pertama sering mengungkapkan bahwa kata seperti "significant," "clearly," atau
          "important" muncul dengan jumlah yang tidak proporsional. Melihat angkanya adalah
          dorongan yang lebih kuat untuk memvariasikan kosakata daripada saran umum tentang
          pengulangan kata.
        </li>
        <li>
          <strong>Menemukan verbal tic</strong> — frasa transisional seperti "in other words,"
          "as we can see," atau "it is worth noting" sering muncul jauh lebih banyak dari yang
          disadari penulis. Analisis frekuensi memunculkannya untuk revisi yang ditargetkan.
        </li>
        <li>
          <strong>Memeriksa fokus</strong> — jika kata-kata yang paling sering muncul dalam
          artikelmu tidak sesuai dengan topik yang ingin kamu tulis, draf tersebut mungkin
          telah menyimpang.
        </li>
        <li>
          <strong>Mengevaluasi level kosakata</strong> — membandingkan distribusi frekuensi
          kata sederhana vs kompleks memberikan sinyal kasar tentang level keterbacaan.
        </li>
      </ul>
      <p>
        Coba tempel draf tulisanmu sendiri ke{" "}
        <a href="/tools/word-frequency">BrowseryTools Word Frequency Analyzer</a>. 20 kata konten
        teratas, setelah pemfilteran stop word, seharusnya erat mencerminkan konsep inti tulisan.
        Jika tidak, draf tersebut mungkin membutuhkan pekerjaan struktural.
      </p>

      <h2>Aplikasi SEO</h2>
      <p>
        Untuk content marketer dan profesional SEO, analisis frekuensi kata melayani beberapa
        fungsi:
      </p>
      <ul>
        <li>
          <strong>Analisis kepadatan kata kunci</strong> — memeriksa bahwa kata kunci target
          muncul dengan frekuensi yang bermakna tetapi alami. Tidak ada persentase ajaib, tetapi
          keyword stuffing ekstrem (menggunakan frasa yang sama 50 kali dalam artikel 1.000 kata)
          tidak dapat dibaca dan dihukum oleh search engine, sementara kata kunci target yang
          tidak pernah muncul adalah sinyal yang terlewat.
        </li>
        <li>
          <strong>Analisis konten pesaing</strong> — menganalisis frekuensi kata halaman yang
          mendapat peringkat teratas untuk kata kunci tertentu mengungkapkan istilah dan konsep
          terkait mana yang secara konsisten muncul dalam konten berperingkat tinggi. Inilah
          dasar pemodelan topik untuk SEO.
        </li>
        <li>
          <strong>Identifikasi content gap</strong> — membandingkan 20 kata konten teratas
          halamanmu dengan 20 kata teratas tiga pesaing dengan peringkat tertinggi menunjukkan
          area semantik mana yang mereka cakup tetapi tidak kamu cakup.
        </li>
        <li>
          <strong>Optimasi judul dan heading</strong> — menganalisis kata-kata yang muncul dalam
          heading (H1, H2, H3) halaman berperingkat teratas memberikan wawasan langsung tentang
          cara search engine menginterpretasikan struktur dokumen.
        </li>
      </ul>

      <h2>Penggunaan Akademis dan Penelitian</h2>
      <p>
        Analisis frekuensi kata memiliki sejarah panjang dalam penelitian akademis, khususnya dalam
        linguistik, studi sastra, dan humaniora digital:
      </p>
      <ul>
        <li>
          <strong>Atribusi kepengarangan</strong> — frekuensi kata fungsi sangat stabil dan
          individual sehingga dapat secara andal mengidentifikasi gaya penulisan penulis di
          berbagai karya. Teknik ini telah digunakan untuk mengaitkan teks historis yang
          diperdebatkan dan dalam proses hukum yang melibatkan dokumen anonim.
        </li>
        <li>
          <strong>Deteksi plagiarisme</strong> — analisis frekuensi pilihan kata yang tidak biasa
          dan frasa langka dapat mengidentifikasi bagian yang berbagi sumber bahkan ketika teks
          tingkat permukaan telah diparafrase.
        </li>
        <li>
          <strong>Linguistik korpus</strong> — menganalisis frekuensi kata di jutaan dokumen
          mengungkapkan bagaimana bahasa berubah seiring waktu, istilah mana yang naik atau turun
          penggunaannya, dan bagaimana komunitas yang berbeda menggunakan bahasa secara berbeda.
          Google Ngram Viewer menerapkan teknik ini ke jutaan buku yang didigitalisasi.
        </li>
        <li>
          <strong>Analisis sentimen dan pemodelan topik</strong> — analisis frekuensi kata
          bermuatan emosional (leksikon sentimen positif/negatif) memberikan proksi sederhana
          tetapi berguna untuk sentimen dalam volume besar teks seperti ulasan pelanggan atau
          postingan media sosial.
        </li>
      </ul>

      <h2>Cara Bertindak berdasarkan Data Frekuensi</h2>
      <p>
        Data frekuensi hanya berguna jika mendorong tindakan. Alur kerja yang praktis:
      </p>
      <ul>
        <li><strong>Untuk penulisan</strong> — identifikasi lima kata yang paling banyak digunakan, lalu gunakan Find and Replace untuk menemukan setiap contoh dan secara sadar memutuskan apakah akan menyimpan, memvariasikan, atau menghapusnya</li>
        <li><strong>Untuk SEO</strong> — bandingkan 20 kata konten teratas halamanmu dengan 20 kata teratas tiga pesaing berperingkat tertinggi; tambahkan cakupan untuk konsep yang muncul di milik mereka tetapi tidak di milikmu</li>
        <li><strong>Untuk penelitian</strong> — ekspor data frekuensi ke spreadsheet dan urutkan berdasarkan frekuensi untuk menemukan istilah yang paling umum (tema inti dokumen) dan istilah unik yang paling jarang (kosakata khas dokumen)</li>
        <li><strong>Untuk pengeditan</strong> — perhatikan secara khusus bahasa yang melemahkan ("somewhat," "rather," "fairly," "quite") dan intensifier kosong ("very," "really," "extremely") — frekuensi tinggi ini adalah sinyal andal bahwa prosa perlu diperketat</li>
      </ul>
      <ToolCTA slug="word-frequency" variant="card" />
    </div>
  );
}
