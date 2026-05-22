export default function Content() {
  return (
    <div>
      <p>
        Setiap developer pernah menghadapi situasi ini: dua versi file yang seharusnya identik,
        tetapi ada sesuatu yang berubah. Mungkin itu file konfigurasi yang diedit secara manual
        di server. Mungkin itu kontrak yang dikembalikan dari pengacara dengan perubahan yang
        tidak diungkapkan. Mungkin itu file terjemahan yang dikembalikan vendor dan perlu kamu
        verifikasi tidak ada yang terhapus secara tidak sengaja. Dalam semua kasus ini, jawabannya
        sama: jalankan diff.
      </p>
      <p>
        Kamu bisa membandingkan dua blok teks apa pun secara instan menggunakan{" "}
        <a href="/tools/text-diff">BrowseryTools Text Diff tool</a> — gratis, tanpa daftar,
        semuanya tetap di browsermu.
      </p>

      <h2>Mengapa Text Diffing Penting</h2>
      <p>
        Text diffing bukan hanya alat developer. Situasi apa pun di mana dua versi dokumen ada
        dan perbedaannya perlu ditampilkan adalah masalah diff:
      </p>
      <ul>
        <li><strong>Code review</strong> — memahami apa yang berubah antara dua versi kode sumber sebelum menyetujui merge</li>
        <li><strong>Perbandingan kontrak dan dokumen hukum</strong> — mengidentifikasi dengan tepat klausul mana yang ditambahkan, dihapus, atau dimodifikasi antara draf</li>
        <li><strong>Manajemen konfigurasi</strong> — memastikan file konfigurasi yang di-deploy sesuai dengan versi di source control</li>
        <li><strong>Verifikasi konten terjemahan</strong> — memeriksa bahwa dokumen yang diterjemahkan mencakup semua bagian yang sama dengan yang asli</li>
        <li><strong>Validasi data</strong> — membandingkan ekspor CSV dari dua sistem untuk menemukan perbedaan</li>
        <li><strong>Proofreading</strong> — menangkap perubahan yang tidak disengaja antara draf dokumen dan versi yang diterbitkan</li>
      </ul>

      <h2>Cara Kerja Algoritma Diff</h2>
      <p>
        Masalah inti yang dipecahkan algoritma diff adalah: diberikan dua urutan A dan B, temukan
        kumpulan edit minimum (penyisipan dan penghapusan) yang diperlukan untuk mengubah A menjadi
        B. Ini secara formal adalah masalah Longest Common Subsequence (LCS). Diff kemudian
        melaporkan apa yang tidak ada dalam LCS — baris yang unik untuk A (penghapusan) dan baris
        yang unik untuk B (penyisipan).
      </p>
      <p>
        Dua algoritma mendominasi implementasi praktis:
      </p>
      <ul>
        <li>
          <strong>Myers diff (1986)</strong> — algoritma di balik perintah Unix <code>diff</code>
          asli dan Git. Eugene Myers merancangnya untuk menemukan skrip edit terpendek (diff dengan
          total penyisipan dan penghapusan paling sedikit) dalam waktu O(ND), di mana N adalah
          total ukuran kedua input dan D adalah jumlah perbedaan. Cepat dan menghasilkan diff
          minimal, tetapi dapat menghasilkan output yang tidak intuitif saat blok kode besar
          dipindahkan.
        </li>
        <li>
          <strong>Patience diff</strong> — dikembangkan oleh Bram Cohen (pencipta BitTorrent) dan
          digunakan oleh Bazaar, kemudian dipopulerkan oleh Kaleidoscope. Alih-alih bekerja baris
          per baris, patience diff pertama-tama mencocokkan baris unik yang muncul tepat sekali di
          kedua file. Ini menghasilkan output yang mempertahankan batas fungsi dan blok jauh lebih
          baik dari Myers diff untuk kode sumber. Git mendukungnya melalui{" "}
          <code>git diff --patience</code>.
        </li>
      </ul>

      <h2>Membaca Output Unified Diff</h2>
      <p>
        Format unified diff adalah output standar dari <code>git diff</code> dan sebagian besar
        alat diff. Setelah kamu memahami notasinya, ia menjadi langsung terbaca.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`--- a/config.yml       (original file)
+++ b/config.yml       (modified file)
@@ -10,7 +10,8 @@     (hunk header)
 server:
   host: localhost
-  port: 3000
+  port: 8080
+  timeout: 30
   debug: false`}
      </pre>
      <p>
        Elemen utama yang perlu dibaca:
      </p>
      <ul>
        <li><strong>Baris yang dimulai dengan <code>-</code></strong> — ada di file asli, dihapus di versi baru (ditampilkan merah)</li>
        <li><strong>Baris yang dimulai dengan <code>+</code></strong> — tidak ada di aslinya, ditambahkan di versi baru (ditampilkan hijau)</li>
        <li><strong>Baris tanpa awalan (spasi)</strong> — baris konteks yang tidak berubah, ditampilkan untuk orientasi</li>
        <li>
          <strong>Header hunk <code>@@</code></strong> — dibaca sebagai "mulai dari baris 10, menampilkan 7 baris dari aslinya; mulai dari baris 10, menampilkan 8 baris dari versi baru." Formatnya adalah{" "}
          <code>@@ -start,count +start,count @@</code>.
        </li>
      </ul>

      <h2>Diff Level Kata vs Baris vs Karakter</h2>
      <p>
        Granularitas diff menentukan seberapa berguna untuk tugas tertentu.
      </p>
      <ul>
        <li>
          <strong>Diff level baris</strong> — default untuk kode sumber. Setiap baris diperlakukan
          sebagai unit atomik. Cepat dan tepat untuk kode di mana baris pendek dan bermakna. Jika
          satu kata berubah dalam paragraf panjang, seluruh baris ditampilkan sebagai berubah.
        </li>
        <li>
          <strong>Diff level kata</strong> — tepat untuk prosa dan dokumentasi. Kata-kata yang
          berubah dalam satu baris disorot secara individual, memberikan sinyal yang jauh lebih
          jelas dalam dokumen yang banyak teks. Sebagian besar alat perbandingan dokumen
          (Microsoft Word Track Changes, riwayat versi Google Docs) beroperasi di level kata.
        </li>
        <li>
          <strong>Diff level karakter</strong> — menyoroti perubahan karakter individual dalam
          kata-kata. Paling berguna untuk mendeteksi typo halus, perubahan whitespace, karakter
          tak terlihat (zero-width space, non-breaking space), atau perbedaan encoding. Penting
          untuk membandingkan data yang terlihat identik secara visual tetapi berbeda di level byte.
        </li>
      </ul>
      <p>
        <a href="/tools/text-diff">BrowseryTools Text Diff tool</a> menyoroti perbedaan secara
        inline, sehingga mudah melihat perubahan sekilas tanpa membaca format unified diff secara
        manual.
      </p>

      <h2>Git Diff di Baliknya</h2>
      <p>
        Ketika kamu menjalankan <code>git diff</code>, Git menghitung Myers diff antara versi objek
        yang disimpan dalam database objeknya. Beberapa flag berguna mengubah perilaku:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`git diff                      # unstaged changes vs last commit
git diff --staged             # staged changes vs last commit
git diff HEAD~3               # current state vs 3 commits ago
git diff main...feature       # what feature branch adds to main
git diff --word-diff          # word-level highlighting
git diff --patience           # use patience algorithm (better for code)
git diff --stat               # summary: files changed, insertions, deletions`}
      </pre>
      <p>
        Memahami <code>git diff main...feature</code> secara spesifik: notasi tiga titik menampilkan
        apa yang ditambahkan branch feature sejak bercabang dari main, tidak termasuk perubahan
        apa pun yang telah terjadi di main sejak titik percabangan. Ini hampir selalu yang kamu
        inginkan untuk review pull request, bukan notasi dua titik <code>main..feature</code> yang
        membandingkan ujung terkini kedua branch secara langsung.
      </p>

      <h2>Kasus Penggunaan Praktis</h2>

      <h3>Membandingkan File Konfigurasi</h3>
      <p>
        File konfigurasi (YAML, TOML, JSON, .env) adalah sumber bug production yang sering terjadi
        ketika versi yang di-deploy menyimpang dari versi yang dikontrol sumber. Sebelum men-debug
        masalah production yang misterius, melakukan diff konfigurasi live terhadap konfigurasi
        yang diharapkan sering kali langsung mengungkapkan penyebabnya.
      </p>

      <h3>Perbandingan Kontrak dan Dokumen</h3>
      <p>
        Ketika draf kontrak kembali dari pihak lain, jangan pernah percaya ringkasan tentang apa
        yang berubah. Ekspor kedua versi ke plain text dan jalankan diff. Pengacara diketahui
        mengubah istilah yang didefinisikan, menambahkan batas kewajiban, atau mengubah periode
        pemberitahuan dengan cara yang terlewat dalam pembacaan cepat. Diff level kata membuat
        setiap perubahan terlihat.
      </p>

      <h3>Verifikasi Dokumen yang Diterjemahkan</h3>
      <p>
        Saat bekerja dengan konten yang diterjemahkan, bandingkan struktur dokumen yang diterjemahkan
        dengan sumber. Diff struktural dari heading bagian dan jumlah paragraf mengungkapkan apakah
        ada bagian yang tidak sengaja dihilangkan atau digabungkan selama terjemahan.
      </p>

      <h2>Perbandingan Alat Diff</h2>
      <ul>
        <li><strong>git diff</strong> — bawaan, level baris, format unified diff, tanpa GUI. Dasar untuk semua pekerjaan kode.</li>
        <li><strong>vimdiff</strong> — diff berdampingan berbasis terminal di dalam Vim. Kuat untuk perbandingan cepat tanpa meninggalkan terminal; kurva belajar yang curam.</li>
        <li><strong>Beyond Compare</strong> — alat desktop komersial dengan sinkronisasi folder, diff biner, dan three-way merge. Standar emas untuk perbandingan dokumen non-developer.</li>
        <li><strong>Meld</strong> — alat diff GUI gratis, lintas platform dengan dukungan three-way merge. Alternatif gratis terbaik untuk Beyond Compare.</li>
        <li><strong>BrowseryTools Text Diff</strong> — instan, berbasis browser, tanpa instalasi. Terbaik untuk perbandingan satu kali yang cepat, terutama untuk teks yang tidak ingin kamu tempel ke layanan online.</li>
      </ul>
    </div>
  );
}
