export default function Content() {
  return (
    <div>
      <p>
        Angka Romawi ada di mana-mana setelah kamu mulai memperhatikannya: tahun hak cipta di akhir
        film, nomor bab dalam buku, judul Super Bowl, wajah jam, &ldquo;MMXXVI&rdquo; di batu fondasi
        gedung. Angka-angka ini elegan, tetapi membaca dan menulisnya tidak intuitif — cepat, berapa
        nilai <strong>MCMXCIV</strong>? Panduan ini menjelaskan persis cara kerja angka Romawi, aturan
        yang sering membingungkan, dan cara mengkonversi angka apa pun dalam kedua arah secara instan.
      </p>
      <p>
        Jika kamu hanya membutuhkan jawabannya, gunakan{" "}
        <a href="/tools/roman-numeral">BrowseryTools Roman Numeral Converter</a> yang mengkonversi
        angka ke angka Romawi dan sebaliknya di browsermu — gratis, tanpa daftar, tidak ada yang
        diunggah. Baca terus untuk memahami cara kerja sistem sehingga kamu bisa memverifikasi
        hasil apa pun sendiri.
      </p>

      <h2>Tujuh Simbol</h2>
      <p>
        Seluruh sistem dibangun hanya dari tujuh huruf, masing-masing dengan nilai tetap:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000`}
      </pre>
      <p>
        Setiap angka Romawi adalah susunan dari ketujuh simbol ini. Tidak ada nol, dan tidak ada
        simbol untuk angka negatif — sistem ini dibangun untuk menghitung dan memberi label, bukan
        untuk aritmatika.
      </p>

      <h2>Dua Aturan yang Mengatur Segalanya</h2>
      <p>
        <strong>Aturan 1 — Jumlahkan ketika simbol menurun.</strong> Ketika simbol bernilai sama
        atau lebih kecil mengikuti yang lebih besar, kamu menjumlahkan keduanya. Jadi <code>VI</code>{" "}
        adalah 5 + 1 = 6, <code>XV</code> adalah 10 + 5 = 15, dan <code>MDC</code> adalah
        1000 + 500 + 100 = 1600. Kamu membaca dari kiri ke kanan dan mempertahankan total yang terus berjalan.
      </p>
      <p>
        <strong>Aturan 2 — Kurangkan ketika simbol yang lebih kecil mendahului yang lebih besar.</strong>{" "}
        Menempatkan nilai yang lebih kecil <em>sebelum</em> yang lebih besar berarti kurangkan.{" "}
        <code>IV</code> adalah 5 &minus; 1 = 4, <code>IX</code> adalah 10 &minus; 1 = 9,{" "}
        <code>XL</code> adalah 50 &minus; 10 = 40, dan{" "}
        <code>CM</code> adalah 1000 &minus; 100 = 900. Notasi subtraktif ini adalah alasan angka
        Romawi menghindari pengulangan empat kali berturut-turut seperti IIII.
      </p>
      <p>
        Hanya enam pasang subtraktif yang valid: <code>IV</code> (4), <code>IX</code> (9),{" "}
        <code>XL</code> (40), <code>XC</code> (90), <code>CD</code> (400), dan <code>CM</code>{" "}
        (900). Kamu hanya mengurangkan pangkat sepuluh (I, X, C), dan hanya dari satu atau dua
        langkah di atasnya.
      </p>

      <h2>Cara Membaca MCMXCIV (yang Paling Rumit)</h2>
      <p>
        Pecah menjadi bagian subtraktif dan aditif dari kiri ke kanan:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`M    = 1000
CM   =  900   (1000 - 100)
XC   =   90   (100 - 10)
IV   =    4   (5 - 1)
-----------
       1994`}
      </pre>
      <p>
        Jadi <strong>MCMXCIV = 1994</strong>. Begitu kamu bisa mengenali empat bagian subtraktif,
        bahkan angka yang panjang pun bisa diuraikan dengan cepat.
      </p>

      <h2>Cara Menulis Angka sebagai Angka Romawi</h2>
      <p>
        Kerjakan satu tempat digit pada satu waktu, dari ribuan turun ke satuan, dan tulis setiap
        tempat menggunakan simbolnya:
      </p>
      <p>
        Ambil <strong>2026</strong>. Ribuan: 2 &rarr; <code>MM</code>. Ratusan: 0 &rarr; tidak ada.
        Puluhan: 2 &rarr; <code>XX</code>. Satuan: 6 &rarr; <code>VI</code>. Satukan:{" "}
        <strong>MMXXVI</strong>. Ambil <strong>49</strong>: puluhan 4 &rarr; <code>XL</code>, satuan 9 &rarr;{" "}
        <code>IX</code>, menghasilkan <strong>XLIX</strong> — pengingat yang bagus bahwa 49 <em>bukan</em>{" "}
        IL, karena kamu hanya bisa mengurangkan dari satu atau dua langkah di atas.
      </p>

      <h2>Kesalahan Umum</h2>
      <p>
        <strong>Mengulang simbol empat kali.</strong> 4 adalah <code>IV</code>, bukan <code>IIII</code>;
        40 adalah <code>XL</code>, bukan <code>XXXX</code>. (Wajah jam adalah pengecualian unik yang
        sering menggunakan IIII untuk 4 demi keseimbangan visual.)
      </p>
      <p>
        <strong>Pengurangan yang tidak valid.</strong> 99 adalah <code>XCIX</code> (90 + 9), bukan{" "}
        <code>IC</code>. Kamu tidak bisa mengurangkan I dari C. Tetap gunakan enam pasang yang valid.
      </p>
      <p>
        <strong>Angka di atas 3999.</strong> Angka Romawi standar memiliki batas atas 3999
        (MMMCMXCIX). Nilai yang lebih besar secara historis menggunakan garis di atas huruf untuk
        mengalikan dengan 1000, tetapi itu jarang diperlukan hari ini.
      </p>

      <h2>Di Mana Kamu Masih Melihat Angka Romawi</h2>
      <p>
        Tahun hak cipta film dan TV, bab buku dan awalan halaman, nama raja dan paus (Elizabeth II,
        Benediktus XVI), Super Bowl, Olimpiade, wajah jam dan arloji, batu fondasi gedung, dan
        penomoran garis besar. Mengetahui aturannya mengubah semua ini dari teka-teki menjadi bacaan
        instan.
      </p>

      <h2>Pertanyaan yang Sering Diajukan</h2>
      <p>
        <strong>Bagaimana cara menulis 0 dalam angka Romawi?</strong> Kamu tidak bisa — sistem ini
        tidak memiliki simbol untuk nol. Para cendekiawan abad pertengahan terkadang menggunakan
        kata <em>nulla</em> sebagai gantinya.
      </p>
      <p>
        <strong>Berapa angka Romawi standar terbesar?</strong> 3999, ditulis MMMCMXCIX.
      </p>
      <p>
        <strong>Mengapa jam menggunakan IIII bukan IV?</strong> Tradisi dan simetri visual; ini
        menyeimbangkan VIII di sisi yang berlawanan. Ini adalah pengecualian stilistika, bukan
        aturan standar.
      </p>
      <p>
        <strong>Bisakah saya mengkonversi dalam kedua arah?</strong> Ya —{" "}
        <a href="/tools/roman-numeral">konverter</a> berjalan dari angka ke angka Romawi dan dari
        angka Romawi kembali ke angka.
      </p>

      <h2>Konversi Sekarang</h2>
      <p>
        Buka <a href="/tools/roman-numeral">Roman Numeral Converter</a> untuk menerjemahkan angka
        apa pun dalam kedua arah — berguna untuk mendekode tahun hak cipta atau menulis tato, judul,
        atau prasasti. Selagi di sini, BrowseryTools juga memiliki{" "}
        <a href="/tools/calculator">kalkulator ilmiah</a> dan{" "}
        <a href="/tools/percentage-calculator">kalkulator persentase</a> untuk matematika yang tidak
        pernah diselesaikan oleh orang Romawi.
      </p>
    </div>
  );
}
