import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Sebelum kamu memposting tangkapan layar, berbagi foto dokumen, atau mengunggah gambar ke
        forum publik, hampir selalu ada sesuatu dalam bingkai yang seharusnya tidak dipublikasikan:
        wajah, plat nomor, alamat rumah, nomor rekening, email, nama di lencana. Memotong membantu,
        tetapi hal sensitif sering kali berada di tengah gambar. Yang benar-benar kamu butuhkan
        adalah{" "}
        <strong>meredaksi atau menyensor gambar</strong> — mengaburkannya, mempikselkannya, atau
        memburamnya — tanpa menyerahkan aslinya ke situs web.
      </p>
      <ToolCTA slug="photo-censor" variant="inline" />
      <p>
        Alat <a href="/tools/photo-censor">BrowseryTools Photo Censor</a> melakukan persis itu,
        sepenuhnya di browsermu. Kamu melukis area yang ingin disembunyikan, memilih blur, pikselasi,
        atau blok solid, dan mengekspor salinan yang bersih. Tidak ada yang diunggah. Panduan ini
        menjelaskan cara meredaksi gambar dengan benar — dan satu kesalahan yang secara diam-diam
        membocorkan data yang kamu kira sudah disembunyikan.
      </p>

      <h2>Cara Meredaksi atau Mengaburkan Gambar (Langkah demi Langkah)</h2>
      <p>
        <strong>1. Buka alat.</strong> Buka halaman{" "}
        <a href="/tools/photo-censor">Photo Censor</a> dan tambahkan gambarmu dengan menyeretnya
        masuk atau mengklik untuk menelusuri. File dibaca secara lokal.
        <br />
        <strong>2. Pilih gaya sensor.</strong> Blur memperhalus area, pikselasi mengubahnya menjadi
        kotak-kotak besar, dan blok solid mengecat penuh.
        <br />
        <strong>3. Lukis area sensitif.</strong> Sapukan pada setiap wajah, plat, nama, atau angka
        yang ingin disembunyikan. Kamu bisa menutupi beberapa area dalam satu sapuan.
        <br />
        <strong>4. Sesuaikan kekuatannya.</strong> Untuk redaksi nyata, gunakan secara kuat — blur
        ringan dapat dibalik. Pikselasi kuat atau blok solid paling aman.
        <br />
        <strong>5. Ekspor.</strong> Unduh gambar yang telah disensor. File asli di diskmu tidak
        pernah dimodifikasi.
      </p>

      <h2>Blur vs. Pikselasi vs. Blok Solid — Mana yang Digunakan</h2>
      <p>
        <strong>Blok solid</strong> adalah satu-satunya opsi yang benar-benar tidak dapat dibalik.
        Piksel di bawahnya digantikan dengan warna rata, sehingga tidak ada yang tersisa untuk
        dipulihkan. Gunakan untuk apa pun yang benar-benar tidak boleh pernah dapat dibaca: ID
        pemerintah, detail keuangan, kata sandi, informasi medis.
      </p>
      <p>
        <strong>Pikselasi kuat</strong> adalah keseimbangan yang tepat untuk sebagian besar situasi —
        ini menyembunyikan konten sambil tetap menunjukkan bahwa ada sesuatu di sana (wajah, layar,
        tanda). Jaga ukuran blok tetap besar; pikselasi halus pada teks terkadang dapat sebagian
        direkonstruksi.
      </p>
      <p>
        <strong>Blur</strong> terlihat paling bersih dan cocok untuk mendeemphaskan wajah latar
        belakang atau logo, tetapi blur <em>ringan</em> adalah bentuk sensor yang paling lemah.
        Wajah dan teks pendek di bawah blur Gaussian ringan, dalam kasus yang terdokumentasi, telah
        berhasil dipulihkan. Jika data penting, jangan mengandalkan blur yang lembut — gunakan kuat,
        atau gunakan blok solid.
      </p>

      <h2>Kesalahan yang Membocorkan Data yang Telah Diredaksi</h2>
      <p>
        Kegagalan redaksi yang paling umum tidak ada hubungannya dengan seberapa kuat blurmu.
        Masalahnya adalah
        <strong> metadata</strong>. Foto dapat membawa data EXIF — koordinat GPS, perangkat yang
        mengambilnya, timestamp asli — yang tertanam dalam file itu sendiri. Kamu bisa memblokir
        alamat dalam gambar dan tetap mengirimkan lokasi GPS yang tepat dalam metadata. Setelah
        meredaksi, pertimbangkan untuk menghapus data itu; <a href="/tools/image-converter">konverter gambar</a>{" "}
        dan <a href="/blog/exif-data-guide">panduan metadata EXIF</a> kami menjelaskan apa yang
        tersembunyi dalam fotomu dan cara menghapusnya.
      </p>
      <p>
        Kesalahan klasik kedua adalah meredaksi dengan cara yang dapat dibatalkan: menggambar kotak
        hitam sebagai lapisan terpisah dalam PDF atau editor vektor, di mana teks di bawahnya masih
        ada dan dapat dipilih atau dipindahkan. Karena alat Photo Censor mengekspor gambar raster
        yang diratakan, piksel yang disensor benar-benar hilang — tidak ada lapisan tersembunyi
        yang bisa dikupas kembali.
      </p>

      <h2>Mengapa Meredaksi di Browser, Bukan di Situs Web</h2>
      <p>
        Ini adalah ironi yang mencolok: orang meredaksi gambar justru karena mengandung sesuatu yang
        sensitif, lalu mengunggah asli yang belum diredaksi ke server editor online untuk melakukan
        redaksinya. Intinya adalah privasi, dan alur kerja tersebut mengalahkannya.
      </p>
      <p>
        Redaksi berbasis browser menyimpan file asli di perangkatmu sepanjang waktu. Gambar dibaca
        ke halaman, diedit oleh browsermu sendiri, dan diekspor secara lokal. Versi yang belum
        diredaksi tidak pernah melintasi internet, tidak pernah masuk ke log, dan tidak pernah
        duduk di bucket penyimpanan orang lain. Untuk penjelasan lebih lengkap mengapa model ini
        penting, lihat{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          mengapa alat berbasis browser menjaga privasi datamu
        </a>
        .
      </p>

      <h2>Pertanyaan yang Sering Diajukan</h2>
      <p>
        <strong>Apakah mengaburkan wajah benar-benar aman?</strong> Hanya jika blurnya kuat. Blur
        ringan terkadang bisa dibalik. Untuk anonimitas nyata, gunakan pikselasi kuat atau blok
        solid.
      </p>
      <p>
        <strong>Bisakah gambar yang diredaksi di-unredact?</strong> Tidak jika kamu menggunakan blok
        solid atau pikselasi kuat dan mengekspor gambar yang diratakan — piksel yang mendasarinya
        digantikan. Risiko hanya ada dengan blur lemah atau dengan editor yang menyimpan asli di
        lapisan tersembunyi.
      </p>
      <p>
        <strong>Apakah alat ini mengunggah fotoku?</strong> Tidak. Semuanya terjadi di browsermu.
        Gambar tidak pernah dikirim ke server.
      </p>
      <p>
        <strong>Bagaimana dengan data lokasi dalam foto?</strong> Meredaksi gambar yang terlihat
        tidak menghapus data GPS EXIF. Hapus metadata secara terpisah sebelum berbagi.
      </p>
      <p>
        <strong>Apakah gratis?</strong> Ya — tanpa akun, tanpa watermark, tanpa batas.
      </p>

      <h2>Coba Sekarang</h2>
      <p>
        Buka alat <a href="/tools/photo-censor">Photo Censor</a>, lukis area sensitif, dan ekspor
        salinan bersih yang tidak pernah meninggalkan perangkatmu. Untuk menyelesaikan pekerjaan,
        hapus metadata lokasi dengan <a href="/tools/image-converter">konverter gambar</a>, dan
        jika kamu juga perlu memotong atau memberi watermark pada hasilnya, baca panduan kami
        tentang{" "}
        <a href="/blog/crop-and-watermark-images-online">memotong dan memberi watermark pada gambar secara online</a>.
      </p>
      <ToolCTA slug="photo-censor" variant="card" />
    </div>
  );
}
