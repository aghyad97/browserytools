import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Menghapus latar belakang gambar dulu hanya bisa dilakukan oleh desainer profesional. Sekarang, prosesnya
        hanya membutuhkan sekitar 5 detik — dan Anda bisa melakukannya langsung di browser, tanpa upload,
        tanpa akun, tanpa watermark, dan tanpa biaya. Panduan ini menjelaskan cara kerja teknologinya,
        mengapa alternatif populer memiliki kelemahan nyata, dan bagaimana mendapatkan hasil sempurna setiap
        saat menggunakan BrowseryTools.
      </p>

      <ToolCTA slug="bg-removal" variant="inline" />
      <h2>Cara Lama: Photoshop dan GIMP</h2>
      <p>
        Selama beberapa dekade, menghapus latar belakang gambar berarti salah satu dari dua hal: membayar
        Adobe Photoshop (saat ini $21,99/bulan sebagai bagian dari Creative Cloud) dan meluangkan waktu
        untuk mempelajari alat seleksinya, atau menggunakan GIMP yang gratis namun terkenal kompleks dengan
        kurva pembelajaran yang curam.
      </p>
      <p>
        Bahkan pengguna Photoshop berpengalaman pun tahu bahwa penghapusan latar belakang yang bersih pada
        subjek yang detail — rambut, bulu, objek transparan — bisa memakan waktu 10 hingga 30 menit untuk
        masking yang teliti. Alat "Select Subject" sudah ada perbaikan, namun pekerjaan pembersihan manual
        tetap diperlukan. Bagi siapa pun yang bukan desainer, ini jelas bukan pilihan yang layak untuk
        pekerjaan cepat.
      </p>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Biaya nyata Photoshop:</strong> $21,99/bulan artinya Anda membayar $264/tahun hanya untuk
        sesekali menghapus latar belakang foto produk atau foto profil. Bagi kebanyakan orang, itu bukan
        nilai tukar yang masuk akal.
      </div>

      <h2>Alat Online "Mudah" — Dan Biaya Tersembunyinya</h2>
      <p>
        Sejumlah alat penghapus latar belakang online muncul untuk mengisi kekosongan ini. Remove.bg
        diluncurkan pada 2018 dan menjadi sangat populer. Canva menambahkan fitur penghapusan latar belakang.
        Puluhan layanan serupa bermunculan. Mereka memecahkan masalah kompleksitas — tetapi mendatangkan
        masalah baru yang berbeda.
      </p>

      <h3>Remove.bg</h3>
      <p>
        Remove.bg memang benar-benar mengesankan dalam hal yang dilakukannya. Namun paket gratisnya hanya
        memberikan pratinjau resolusi rendah — unduhan resolusi penuh memerlukan kredit yang berharga antara
        $0,20 hingga $1,99 per gambar tergantung volume. Yang lebih penting, setiap gambar yang Anda proses
        diunggah ke server mereka. Kebijakan privasi mereka mengizinkan mereka untuk menyimpan dan memproses
        gambar Anda. Untuk foto pribadi, gambar produk yang mengandung informasi proprietary, atau hal apa
        pun yang sensitif, ini adalah perhatian yang nyata.
      </p>

      <h3>Canva</h3>
      <p>
        Fitur penghapusan latar belakang Canva terkunci di balik Canva Pro, yang berharga $12,99/bulan atau
        $119,99/tahun. Paket gratis tidak menyertakannya. Seperti Remove.bg, Canva memproses gambar Anda di
        server mereka, artinya file Anda diunggah, diproses dari jarak jauh, dan disimpan di infrastruktur
        cloud mereka.
      </p>

      <h3>Polanya</h3>
      <p>
        Hampir setiap alat penghapus latar belakang online populer menggunakan model yang sama: unggah gambar
        Anda, proses secara jarak jauh, bayar untuk hasil berkualitas. Bahkan versi "gratis" pun hadir dengan
        batasan resolusi, watermark, batas pemrosesan, atau ketiganya sekaligus. Dan gambar Anda berpindah ke
        server orang lain setiap kali.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Wawasan kunci:</strong> Setiap kali Anda mengunggah gambar ke layanan online untuk diproses,
        Anda mempercayakan data Anda kepada layanan tersebut. Untuk foto pribadi, pekerjaan klien, atau gambar
        produk proprietary, itu adalah risiko yang signifikan dan sering kali tidak perlu.
      </div>

      <h2>Pendekatan BrowseryTools: AI yang Berjalan di Perangkat Anda</h2>
      <p>
        BrowseryTools Background Removal bekerja secara fundamental berbeda dari setiap layanan yang
        dijelaskan di atas. Model AI berjalan sepenuhnya di dalam browser Anda menggunakan daya pemrosesan
        komputer Anda sendiri. Gambar Anda tidak pernah meninggalkan perangkat Anda.
      </p>
      <p>
        Ini dimungkinkan oleh dua teknologi yang bekerja bersama:
      </p>
      <ul>
        <li>
          <strong>@imgly/background-removal:</strong> Pustaka JavaScript open-source yang mengimplementasikan
          model jaringan saraf yang secara khusus dilatih untuk segmentasi latar belakang. Model ini didasarkan
          pada arsitektur RMBG, yang menghasilkan deteksi tepi berkualitas tinggi terutama di sekitar rambut,
          bulu, dan bentuk kompleks.
        </li>
        <li>
          <strong>ONNX Runtime Web:</strong> Runtime Open Neural Network Exchange memungkinkan model machine
          learning berjalan secara efisien di browser menggunakan WebAssembly dan opsional WebGPU untuk
          akselerasi hardware. Inilah yang membuat inferensi AI nyata di browser menjadi praktis — ini adalah
          teknologi yang sama yang digunakan oleh alat seperti Whisper Web dan implementasi web Stable
          Diffusion.
        </li>
      </ul>
      <p>
        Bobot model diunduh sekali ke cache browser Anda saat pertama kali digunakan, kemudian digunakan
        secara lokal untuk setiap gambar berikutnya. Setelah unduhan awal tersebut, alat ini bahkan bekerja
        secara offline.
      </p>

      <h2>Sebelum dan Sesudah: Tampilan Penghapusan Latar Belakang</h2>

      <div style={{display: "flex", gap: "16px", margin: "28px 0", flexWrap: "wrap" as const}}>
        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "8px", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"}}>
              🧑
            </div>
            <div style={{width: "100%", height: "60px", background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)", borderRadius: "0 0 12px 12px", position: "relative" as const, marginBottom: "-1px"}} />
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500}}>
            SEBELUM — Foto asli dengan latar belakang ramai
          </p>
        </div>

        <div style={{display: "flex", alignItems: "center", fontSize: "2rem", fontWeight: 700, color: "#6366f1", padding: "0 8px"}}>
          →
        </div>

        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0 / 20px 20px", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"}}>
              🧑
            </div>
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#16a34a", fontWeight: 500}}>
            SESUDAH — Latar belakang transparan yang bersih
          </p>
        </div>
      </div>

      <h2>Cara Menghapus Latar Belakang Menggunakan BrowseryTools</h2>
      <p>
        <a href="/tools/bg-removal">Alat Background Removal BrowseryTools</a> dirancang sesederhana mungkin.
        Berikut proses langkah demi langkah yang lengkap:
      </p>
      <ol>
        <li>
          <strong>Buka alatnya.</strong> Navigasi ke <a href="/tools/bg-removal">/tools/bg-removal</a>. Saat
          pertama kali berkunjung, bobot model AI akan diunduh ke cache browser Anda. Ini membutuhkan waktu
          10–20 detik tergantung koneksi Anda dan hanya terjadi sekali saja.
        </li>
        <li>
          <strong>Unggah gambar Anda.</strong> Klik area upload atau seret dan lepas file gambar Anda.
          Format yang didukung meliputi JPEG, PNG, WebP, dan sebagian besar jenis gambar umum. File tetap
          berada di perangkat Anda.
        </li>
        <li>
          <strong>Tunggu pemrosesan.</strong> AI menganalisis gambar Anda secara lokal. Pemrosesan biasanya
          membutuhkan 2–8 detik tergantung resolusi gambar dan daya pemrosesan perangkat Anda. Indikator
          kemajuan menunjukkan status prosesnya.
        </li>
        <li>
          <strong>Tinjau dan unduh.</strong> Hasilnya muncul di samping gambar asli Anda. Jika puas, unduh
          PNG dengan latar belakang transparan. Jika ingin mencoba gambar lain, cukup unggah kembali.
        </li>
      </ol>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Nol upload, nol akun:</strong> BrowseryTools memproses gambar Anda sepenuhnya di perangkat
        Anda sendiri. Tidak ada data gambar yang dikirim ke server mana pun. Anda tidak perlu membuat akun,
        memverifikasi alamat email, atau memberikan informasi pribadi apa pun. Cukup buka alatnya dan gunakan.
      </div>

      <h2>Jenis Gambar Apa yang Memberikan Hasil Terbaik</h2>
      <p>
        Model AI dilatih pada dataset yang luas, tetapi seperti model apa pun, ia bekerja terbaik pada
        jenis gambar tertentu. Memahami hal ini membantu Anda mendapatkan hasil yang konsisten dan sangat baik.
      </p>

      <h3>Hasil Sangat Baik</h3>
      <ul>
        <li><strong>Orang dan potret:</strong> Model ini dilatih secara khusus untuk subjek manusia. Potret, headshot, dan foto seluruh tubuh dengan pemisahan subjek yang jelas menghasilkan hasil yang hampir sempurna.</li>
        <li><strong>Fotografi produk:</strong> Produk dengan latar belakang sederhana — putih, abu-abu, atau pencahayaan studio — diproses dengan sangat bersih. Gambar produk e-commerce adalah kasus penggunaan yang ideal.</li>
        <li><strong>Hewan:</strong> Hewan peliharaan dan hewan pada umumnya bekerja dengan baik, meskipun bulu yang sangat bertekstur dengan latar belakang berwarna serupa kadang-kadang dapat menimbulkan masalah tepi.</li>
        <li><strong>Kendaraan dan objek:</strong> Mobil, furnitur, dan objek padat lainnya dengan siluet yang jelas diproses dengan andal.</li>
      </ul>

      <h3>Skenario yang Menantang</h3>
      <ul>
        <li><strong>Kaca dan objek transparan:</strong> Gelas anggur, botol air, dan benda transparan lainnya sulit bagi model penghapus latar belakang mana pun karena latar belakang terlihat melalui subjek itu sendiri.</li>
        <li><strong>Detail yang sangat halus:</strong> Kain jaring yang sangat halus, renda, atau rambut jarang di atas latar belakang yang kompleks mungkin memiliki beberapa fringing. Untuk pekerjaan kritis, pembersihan manual cepat di editor gambar apa pun akan menangani tepinya.</li>
        <li><strong>Subjek kontras rendah:</strong> Kemeja putih di atas dinding putih memang sulit untuk disegmentasi — bahkan bagi manusia sekalipun. Berikan kontras antara subjek dan latar belakang jika memungkinkan.</li>
        <li><strong>Gambar beresolusi sangat rendah:</strong> Gambar yang lebih kecil dari 200x200 piksel mungkin tidak memberikan cukup detail untuk segmentasi yang akurat.</li>
      </ul>

      <h2>Tips untuk Mendapatkan Hasil Terbaik</h2>
      <ul>
        <li><strong>Mulai dengan versi resolusi tertinggi yang Anda miliki.</strong> Lebih banyak piksel memberi AI lebih banyak informasi untuk diproses, terutama di tepi. Anda selalu bisa memperkecil hasilnya setelahnya.</li>
        <li><strong>Pastikan pencahayaan yang baik pada subjek.</strong> Pencahayaan merata dengan bayangan minimal memudahkan pekerjaan model. Bayangan keras terkadang dapat ditafsirkan sebagai bagian dari latar belakang.</li>
        <li><strong>Gunakan latar belakang yang bersih saat memotret.</strong> Jika Anda mengontrol lingkungan foto, backdrop warna tunggal selalu menghasilkan hasil yang lebih bersih daripada pemandangan yang kompleks, bahkan dengan pemrosesan AI.</li>
        <li><strong>Gunakan output PNG untuk transparansi.</strong> Hasil yang diunduh selalu berupa PNG dengan latar belakang transparan, yang dapat ditempatkan di atas latar belakang baru apa pun di alat desain mana pun.</li>
      </ul>

      <h2>Kasus Penggunaan: Di Mana Gambar Tanpa Latar Belakang Benar-Benar Penting</h2>

      <h3>Foto Produk E-Commerce</h3>
      <p>
        Amazon, Shopify, dan sebagian besar marketplace mengharuskan atau sangat merekomendasikan gambar
        produk berlatar belakang putih. Alih-alih menyewa fotografer dengan setup studio atau membayar
        layanan retouching, Anda bisa memotret produk di atas permukaan netral apa pun dan menghapus
        latar belakang dalam hitungan detik dengan BrowseryTools. Proses seluruh katalog produk tanpa
        mengunggah satu pun gambar ke layanan pihak ketiga.
      </p>

      <h3>Foto Profil dan Avatar</h3>
      <p>
        Headshot LinkedIn, avatar GitHub, profil Slack, dan bio profesional semuanya mendapat manfaat dari
        latar belakang yang bersih. Daripada memesan sesi studio hanya untuk headshot, ambil foto bagus
        dalam cahaya yang cukup dan hapus latar belakangnya di browser Anda. Tambahkan latar belakang warna
        solid atau gradien di editor mana pun setelahnya.
      </p>

      <h3>Presentasi dan Materi Pemasaran</h3>
      <p>
        Gambar cutout terintegrasi dengan bersih ke dalam latar belakang slide, tata letak infografis, dan
        desain banner. Alih-alih mencari file PNG yang sudah memiliki latar belakang transparan, buat sendiri
        dari foto apa pun yang Anda miliki. Ini sangat berguna untuk foto anggota tim dalam presentasi
        perusahaan.
      </p>

      <h3>Konten Media Sosial</h3>
      <p>
        Postingan Instagram, thumbnail YouTube, header Twitter, dan konten serupa sering mendapat manfaat
        dari subjek yang diisolasi dan ditempatkan di atas latar belakang bermerek atau bertema. Versi
        subjek tanpa latar belakang memberi Anda fleksibilitas total untuk komposisi kreatif.
      </p>

      <h3>Pekerjaan Klien dan Kerahasiaan</h3>
      <p>
        Jika Anda bekerja dengan gambar klien — foto produk, potret, materi proprietary — hal terakhir yang
        Anda inginkan adalah mengunggah file-file tersebut ke server pihak ketiga. Dengan BrowseryTools,
        gambar klien tetap berada di mesin Anda. Titik.
      </p>

      <h2>Perbandingan Langsung: BrowseryTools vs. Alternatif</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Fitur</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Remove.bg</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Canva Pro</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Photoshop</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Biaya</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Gratis</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>Mulai $0,20/gambar</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>$12,99/bulan</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>$21,99/bulan</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Upload gambar</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Tidak — hanya lokal</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ya, ke server mereka</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ya, ke server mereka</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Lokal (aplikasi desktop)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Akun diperlukan</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Tidak</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Untuk kredit, ya</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ya</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ya (Adobe ID)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Output resolusi penuh</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Ya</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Berbayar saja</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ya</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ya</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Watermark</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Tidak ada</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Hanya paket gratis</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Tidak ada</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Tidak ada</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Bekerja offline</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Ya (setelah pemuatan pertama)</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Tidak</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Tidak</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ya</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Penghapusan Latar Belakang Massal</h2>
      <p>
        Jika Anda memiliki sekumpulan gambar produk untuk diproses, BrowseryTools juga mendukung penghapusan
        latar belakang massal. Anda dapat mengunggah beberapa gambar sekaligus dan memprosesnya secara
        berurutan tanpa meninggalkan alat atau menyiapkan skrip batch apa pun. Bagi penjual e-commerce atau
        pembuat konten dengan perpustakaan besar, ini membuat alat ini benar-benar praktis untuk alur kerja
        nyata — bukan hanya tugas satu kali.
      </p>

      <h2>Apa yang Terjadi pada Gambar Anda?</h2>
      <p>
        Tidak ada yang meninggalkan perangkat Anda. Ketika Anda mengunggah gambar ke alat Background Removal
        BrowseryTools, JavaScript di halaman membaca file menggunakan File API browser dan meneruskannya
        langsung ke runtime ONNX yang berjalan di Web Worker. Model segmentasi berjalan secara lokal, output
        PNG dihasilkan dalam memori, dan Anda mengunduhnya. Tidak ada data gambar yang berpindah melalui
        koneksi jaringan pada titik mana pun.
      </p>
      <p>
        Anda dapat memverifikasi ini sendiri dengan membuka tab Jaringan di Developer Tools browser Anda
        saat menggunakan alat ini. Setelah unduhan model awal, Anda akan melihat nol permintaan jaringan
        saat memproses gambar.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Transparansi by design:</strong> BrowseryTools dibangun di atas prinsip bahwa data Anda
        adalah milik Anda. Pemrosesan AI berbasis browser bukan sebuah solusi sementara — ini adalah pilihan
        arsitektur yang tepat untuk alat yang menangani konten pribadi atau sensitif.
      </div>

      <h2>Coba Sekarang</h2>
      <p>
        Tanpa akun. Tanpa kartu kredit. Tanpa watermark. Tanpa batasan ukuran pada paket gratis — karena
        tidak ada paket berbayar. Cukup buka alatnya, masukkan gambar, dan unduh PNG transparan yang bersih
        dalam hitungan detik.
      </p>
      <div style={{background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Hapus Latar Belakang Gambar — Gratis, Privat, Instan
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.9rem", color: "#64748b"}}>
          Didukung AI. Berjalan secara lokal. Tanpa upload. Tanpa watermark.
        </p>
        <a
          href="/tools/bg-removal"
          style={{background: "linear-gradient(135deg, #ec4899, #be185d)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Buka Alat Penghapus Latar Belakang →
        </a>
      </div>
      <ToolCTA slug="bg-removal" variant="card" />
    </div>
  );
}
