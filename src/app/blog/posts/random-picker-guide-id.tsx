import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Sesekali kamu membutuhkan pengambil keputusan yang tidak memihak. Siapa yang membayar makan
        siang? Nama mana yang menang dalam giveaway? Urutan apa yang harus digunakan tim saat
        presentasi? Siapa yang jalan duluan dalam permainan papan? Meraih dadu fisik, koin dari saku,
        atau menulis nama di kertas yang disobek memang berhasil — tapi lambat, mudah dimanipulasi,
        dan seringkali kamu tidak punya koin. Sebuah{" "}
        <a href="/tools/random-picker">random picker</a> di browsermu menyelesaikan semua itu dalam
        satu tab.
      </p>
      <ToolCTA slug="random-picker" variant="inline" />
      <p>
        BrowseryTools <strong>Random Picker</strong> menggabungkan empat pengacak klasik dalam satu
        halaman: <strong>generator angka acak</strong>, <strong>pelemparan dadu</strong>, <strong>
        pelemparan koin</strong>, dan <strong>pemilih nama acak</strong> (bergaya roda) untuk undian
        dan giveaway. Semuanya berjalan secara lokal di browsermu — tidak ada server yang memutuskan
        hasilnya, tanpa akun, dan tanpa iklan. Panduan ini memandu setiap mode dan detail kecil yang
        membuat random picker benar-benar adil.
      </p>

      <h2>Generator Angka Acak</h2>
      <p>
        Permintaan paling umum juga yang paling sederhana: berikan angka antara X dan Y. Generator
        angka acak memungkinkan kamu mengatur <strong>minimum</strong> dan <strong>maksimum</strong>,
        memilih <strong>berapa banyak</strong> angka yang diinginkan sekaligus, dan memutuskan apakah
        duplikat diizinkan. Toggle terakhir itu lebih penting dari yang diperkirakan orang. Jika kamu
        memilih tiga tiket raffle dari seratus, kamu hampir pasti ingin angka yang unik — kamu tidak
        ingin tiket 47 menang dua kali. Jika kamu mensimulasikan dadu atau menghasilkan data pengujian,
        duplikat tidak masalah dan diharapkan.
      </p>
      <p>
        Di balik layar, alat ini menggunakan primitif <code>crypto.getRandomValues</code> browser
        dengan rejection sampling, yang menghindari bias modulo halus yang dihasilkan kode{" "}
        <code>Math.random() * range</code> naif. Dalam bahasa yang mudah dipahami: setiap angka
        dalam rentangmu memiliki peluang yang benar-benar sama untuk muncul, bukan yang sedikit
        condong. Untuk pengambilan kasual perbedaan itu tidak terlihat, tetapi untuk hal yang
        dipertanyakan keadilannya — giveaway publik, undian berbayar — itu adalah perbedaan antara
        yang dapat dipertahankan dan yang meragukan.
      </p>

      <h2>Pelemparan Dadu</h2>
      <p>
        Game tabletop dan role-playing hidup dan mati oleh dadu, dan dadu fisik memiliki kebiasaan
        menggelinding dari meja atau hilang tepat saat kamu membutuhkannya. Pelemparan dadu mendukung
        set polihedra lengkap — d4, d6, d8, d10, d12, dan d20 — dan memungkinkan kamu melempar
        banyak sekaligus, notasi <em>2d6</em> atau <em>4d6</em> yang klasik. Setiap dadu ditampilkan
        secara individual sehingga kamu bisa melihat sebarannya, dan total dijumlahkan secara otomatis.
        Tidak perlu aritmatika mental, tidak perlu berdebat apakah dadu itu mendarat di angka 5 atau 6.
      </p>
      <p>
        Karena lemparan menggunakan keacakan berkualitas kriptografi yang sama dengan generator angka,
        d20 digital sama adilnya dengan yang fisik — bisa dibilang lebih adil, karena dadu nyata
        jarang seimbang sempurna. Lempar untuk inisiatif, lempar untuk kerusakan, lempar pemeriksaan
        persentil d100 cepat, semuanya dari tab yang sama.
      </p>

      <h2>Pelemparan Koin</h2>
      <p>
        Terkadang kamu hanya butuh ya atau tidak, dan tidak ada yang menyelesaikan pilihan biner
        lebih cepat dari koin. Mode pelemparan koin menampilkan animasi putaran singkat dan mendarat
        di kepala atau ekor, lalu menyimpan <strong>tally yang terus berjalan</strong> untuk keduanya.
        Tally adalah fitur yang kurang dihargai di sini: jika kamu menyelesaikan best-of-seven, atau
        kamu hanya ingin melihat hukum bilangan besar perlahan menarik split 50/50 menuju genap,
        hitungannya langsung di sana. Reset kapan pun kamu memulai kompetisi baru.
      </p>

      <h2>Pemilih Nama Acak (Roda)</h2>
      <p>
        Ini adalah mode yang paling banyak dibagikan. Tempel daftar nama — satu per baris — dan
        picker memilih pemenang acak dengan putaran singkat untuk ketegangan. Dibuat untuk{" "}
        <strong>giveaway, cold-calling di kelas, standup tim, dan undian hadiah</strong>. Masukkan
        komentar Instagram, murid, peserta raffle, dan biarkan alat melakukan pemilihan sehingga
        tidak ada yang bisa menuduhmu pilih kasih.
      </p>
      <p>
        Opsi utama untuk undian adalah <strong>&quot;hapus pemenang setelah dipilih.&quot;</strong>{" "}
        Aktifkan dan setiap nama yang dipilih dikeluarkan dari daftar, sehingga kamu bisa menjalankan
        undian multi-hadiah — juara pertama, kedua, ketiga — tanpa orang yang sama menang dua kali.
        Matikan dan daftar penuh tetap ada untuk pengambilan tunggal yang berulang. Penghitung
        menampilkan berapa banyak entri yang tersisa setelah setiap pengambilan.
      </p>

      <h2>Mengapa Alat Browser Mengalahkan Aplikasi</h2>
      <p>
        Aplikasi randomizer dan situs roda memang ada, tetapi kebanyakan terkubur di bawah iklan,
        meminta kamu mendaftar, atau menjalankan pengacakan di server yang tidak bisa kamu periksa.
        Random picker BrowseryTools adalah kebalikannya: halaman statis tunggal yang melakukan
        pekerjaannya sepenuhnya di perangkatmu. Tidak ada yang kamu ketik — bukan peserta giveaway,
        bukan nama murid — yang pernah meninggalkan browsermu. Kamu bisa menyalin hasil apa pun ke
        clipboard, membookmark halaman, atau berbagi URL dengan rekan yang membutuhkan lemparan koin
        yang adil.
      </p>

      <h2>Coba Sekarang</h2>
      <p>
        Baik kamu membutuhkan angka acak cepat, d20 yang adil, koin untuk menyelesaikan perselisihan,
        atau pemilih nama untuk giveaway berikutnya, <a href="/tools/random-picker">Random Picker</a>{" "}
        memilikinya dalam satu tempat — gratis, privat, dan instan. Tanpa instalasi, tanpa akun,
        tanpa embel-embel.
      </p>
      <ToolCTA slug="random-picker" variant="card" />
    </div>
  );
}
