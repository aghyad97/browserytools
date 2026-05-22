import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Setiap hari, jutaan orang mengunggah file sensitif — dokumen pajak, foto pribadi, laporan rahasia — ke tool online acak yang mereka temukan lewat pencarian Google. Sebagian besar tidak pernah berpikir dua kali tentang apa yang terjadi pada data itu setelah mereka mengklik "Process". Jawabannya, lebih sering daripada tidak, mengkhawatirkan.
      </p>

      <p>
        Tool berbasis browser seperti yang ada di <strong>BrowseryTools</strong> beroperasi dengan prinsip yang secara fundamental berbeda: <em>data Anda tidak pernah meninggalkan perangkat Anda</em>. Memahami mengapa perbedaan itu penting bisa melindungi karier, bisnis, dan kehidupan pribadi Anda.
      </p>

      <h2>Biaya Tersembunyi dari Tool Cloud "Gratis"</h2>

      <p>
        Ketika Anda mengunjungi tool online biasa — kompresor gambar, konverter PDF, password generator — dan mengunggah sebuah file, file itu berpindah dari perangkat Anda ke server di suatu tempat di dunia. File diproses di server itu, dan hasilnya dikirim kembali kepada Anda. Di permukaan ini terdengar tidak berbahaya. Di balik permukaan, Anda sama sekali tidak punya kendali atas apa yang terjadi selanjutnya.
      </p>

      <h3>Kebocoran Data: File Anda Hanya Seaman Server-nya</h3>

      <p>
        Layanan cloud adalah target utama bagi hacker. Ketika kebocoran terjadi, setiap file yang pernah diunggah ke layanan itu berpotensi terekspos — termasuk milik Anda. Insiden-insiden besar telah memengaruhi platform berbagi file, konverter dokumen, dan bahkan penyimpanan cloud perusahaan. Kerusakannya diperparah oleh fakta bahwa Anda sering kali tidak tahu sama sekali bahwa data Anda disimpan.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Risiko di dunia nyata:</strong> Sebuah studi tahun 2023 menemukan bahwa lebih dari 80% layanan konversi file online gratis menyimpan file yang diunggah untuk periode mulai dari 24 jam hingga tanpa batas waktu. Beberapa menyimpan file secara permanen dan mengindeksnya untuk analitik internal.
      </div>

      <h3>Kebijakan Retensi Data yang Ditulis dalam Huruf Kecil</h3>

      <p>
        Sebagian besar tool cloud memiliki Ketentuan Layanan yang memberi mereka <em>lisensi untuk menggunakan konten Anda</em> demi meningkatkan layanan mereka. Ini adalah teks hukum standar yang biasanya dilewati pengguna — tetapi artinya PDF yang Anda konversi atau gambar yang Anda edit bisa digunakan untuk melatih model machine learning, meningkatkan algoritma kompresi mereka, atau dibagikan dengan mitra periklanan.
      </p>

      <ul>
        <li>File sering kali disimpan selama 30–90 hari "untuk keperluan dukungan pelanggan"</li>
        <li>Konten yang diunggah bisa digunakan untuk pelatihan model tanpa persetujuan eksplisit</li>
        <li>Tool analitik pihak ketiga yang tertanam di situs juga bisa menerima metadata tentang unggahan Anda</li>
        <li>Penghapusan akun jarang menjamin penghapusan data dalam praktiknya</li>
      </ul>

      <h3>Permintaan Pemerintah dan Panggilan Hukum</h3>

      <p>
        Data yang disimpan di server dalam yurisdiksi asing bisa tunduk pada hukum negara tersebut. Layanan cloud AS bisa menerima National Security Letter yang mewajibkan mereka menyerahkan data pengguna tanpa memberi tahu pengguna. Layanan yang berbasis di UE menghadapi tekanan pemerintah mereka sendiri. Intinya: jika data Anda berada di server orang lain, orang lain memegang kuncinya.
      </p>

      <h3>Monetisasi Data Anda</h3>

      <p>
        Tool "gratis" harus menghasilkan uang dengan suatu cara. Ketika produknya gratis, sering kali Anda-lah produknya. Data pengguna — termasuk metadata tentang file yang Anda unggah, frekuensi kunjungan Anda, dan bahkan isi dokumen Anda — bisa dijual ke pialang data, digunakan untuk iklan bertarget, atau dilisensikan ke perusahaan riset.
      </p>

      <h2>Bagaimana BrowseryTools Berbeda: Semuanya Berjalan di Browser Anda</h2>

      <p>
        BrowseryTools dibangun di sekitar satu prinsip arsitektur: <strong>nol pemrosesan di server</strong>. Setiap komputasi terjadi di dalam browser Anda menggunakan JavaScript, Web API, dan WebAssembly. Ketika Anda menggunakan tool BrowseryTools, satu-satunya server yang terlibat adalah server yang awalnya mengirimkan kode halaman web — setelah itu, browser Anda yang melakukan semua pekerjaan.
      </p>

      {/* Visual comparison */}
      <div style={{margin: "32px 0"}}>
        <h3>Tool Cloud vs. BrowseryTools: Apa yang Sebenarnya Terjadi</h3>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
          {/* Cloud Tool column */}
          <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "20px"}}>
            <div style={{fontWeight: "700", color: "#ef4444", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              Tool Cloud Biasa
            </div>
            <ol style={{margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: "1.8"}}>
              <li>Anda mengunggah file Anda</li>
              <li>File berpindah melalui internet ke server jauh</li>
              <li>Server memproses file</li>
              <li>Hasil dikirim kembali kepada Anda</li>
              <li>File bisa disimpan selama berhari-hari, berbulan-bulan, atau tanpa batas</li>
              <li>File tunduk pada kebijakan retensi, kebocoran, dan permintaan hukum</li>
              <li>Data berpotensi dimonetisasi atau dibagikan</li>
            </ol>
          </div>

          {/* BrowseryTools column */}
          <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px"}}>
            <div style={{fontWeight: "700", color: "#16a34a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              BrowseryTools
            </div>
            <ol style={{margin: 0, paddingLeft: "18px", fontSize: "14px", lineHeight: "1.8"}}>
              <li>Anda membuka tool di browser Anda</li>
              <li>Kode JavaScript dimuat ke perangkat Anda</li>
              <li>Anda menyediakan file atau data Anda secara lokal</li>
              <li>Browser Anda memproses semuanya di CPU/GPU Anda</li>
              <li>Hasil muncul secara instan di browser Anda</li>
              <li>Tidak ada yang pernah diunggah atau disimpan dari jarak jauh</li>
              <li>Tutup tab — nol jejak tersisa di mana pun</li>
            </ol>
          </div>
        </div>
      </div>

      <h2>Teknologi di Balik Pemrosesan Lokal</h2>

      <p>
        Tool browser yang mengutamakan privasi hanya mungkin ada berkat kemajuan signifikan dalam kemampuan browser web selama satu dekade terakhir. Berikut cara BrowseryTools memanfaatkan teknologi ini:
      </p>

      <h3>Penghapusan Latar Belakang: Model Machine Learning ONNX Berjalan Secara Lokal</h3>

      <p>
        Menghapus latar belakang dari sebuah foto secara tradisional mengharuskan pengiriman gambar Anda ke layanan AI cloud seperti Remove.bg. <Link href="/tools/bg-removal">Tool penghapus latar belakang</Link> BrowseryTools menjalankan model ONNX (Open Neural Network Exchange) terkompresi langsung di dalam browser Anda menggunakan ONNX Runtime for Web. Foto Anda diproses oleh jaringan saraf yang berjalan di mesin Anda sendiri — tidak ada satu piksel pun yang pernah dikirim ke mana pun.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Cara kerjanya:</strong> File model ONNX diunduh sekali dan berjalan melalui WebAssembly di thread worker latar belakang. Data gambar Anda diteruskan ke model sebagai tensor, model memprediksi mask segmentasi piksel demi piksel, dan hasilnya disusun kembali di browser Anda — semuanya tanpa satu pun permintaan jaringan yang berisi gambar Anda.
      </div>

      <h3>Pembuatan Password: Web Crypto API</h3>

      <p>
        Ketika Anda menggunakan <Link href="/tools/password-generator">password generator</Link>, BrowseryTools memanggil <code>crypto.getRandomValues()</code> — API bawaan browser yang didukung oleh pseudorandom number generator yang aman secara kriptografis (CSPRNG) milik sistem operasi. Ini adalah sumber entropi yang sama yang digunakan sistem operasi untuk kunci kriptografi. Password yang dihasilkan dihitung sepenuhnya di memori dan ditampilkan kepada Anda. Ia tidak pernah dikirim ke mana pun.
      </p>

      <h3>Hashing: SubtleCrypto dari Web Crypto API</h3>

      <p>
        <Link href="/tools/hash-generator">Hash generator</Link> menggunakan fungsi bawaan browser <code>crypto.subtle.digest()</code> untuk menghitung hash MD5, SHA-1, SHA-256, dan SHA-512. API ini diimplementasikan secara native oleh mesin browser (V8, SpiderMonkey, dll.) dan beroperasi pada data lokal Anda tanpa keterlibatan server apa pun.
      </p>

      <h3>Decoding JWT dan Pemrosesan Teks</h3>

      <p>
        <Link href="/tools/jwt-decoder">JWT decoder</Link> menggunakan decoding Base64 standar — operasi string murni — untuk mem-parsing header dan payload token. Tidak ada JWT yang Anda tempel yang pernah dikirim ke server. Hal ini sangat penting dalam konteks profesional di mana token JWT sering kali berisi klaim identitas pengguna dan informasi sesi.
      </p>

      {/* Comparison table */}
      <h2>Perbandingan Fitur: Tool Cloud vs. Tool Lokal di Browser</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700"}}>Fitur</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700", color: "#ef4444"}}>Tool Cloud</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)", fontWeight: "700", color: "#16a34a"}}>BrowseryTools</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Data tetap di perangkat Anda", "✗ Tidak", "✓ Ya"],
              ["Berfungsi offline setelah dimuat", "✗ Tidak", "✓ Ya"],
              ["Tidak perlu akun", "Kadang-kadang", "✓ Selalu"],
              ["Tanpa risiko retensi file", "✗ Tidak", "✓ Ya"],
              ["Kebal terhadap kebocoran server", "✗ Tidak", "✓ Ya"],
              ["Tanpa monetisasi data", "Jarang", "✓ Ya"],
              ["Patuh GDPR secara desain", "Rumit", "✓ Ya"],
              ["Tanpa batas laju API", "Sering dibatasi", "✓ Tak terbatas"],
              ["Memproses dokumen sensitif dengan aman", "Berisiko", "✓ Ya"],
            ].map(([feature, cloud, browser], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "500"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: cloud.startsWith("✗") ? "#ef4444" : cloud === "✓ Ya" ? "#16a34a" : "#d97706"}}>{cloud}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "#16a34a", fontWeight: "600"}}>{browser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Mengapa Ini Penting untuk GDPR, HIPAA, dan Hukum Privasi</h2>

      <p>
        Jika Anda bekerja di industri yang teregulasi — kesehatan, hukum, keuangan, pendidikan — tool yang Anda gunakan untuk menangani data harus mematuhi hukum yang berlaku. Berdasarkan <strong>GDPR</strong> (General Data Protection Regulation), mengirimkan data pribadi ke pemroses pihak ketiga memerlukan Perjanjian Pemrosesan Data dan mungkin mengharuskan pemberitahuan kepada subjek data. Berdasarkan <strong>HIPAA</strong>, setiap tool yang memproses Protected Health Information harus dicakup oleh Business Associate Agreement.
      </p>

      <p>
        Ketika pemrosesan terjadi sepenuhnya di browser, tidak satu pun dari kewajiban ini terpicu oleh tool itu sendiri — karena tidak ada data pribadi yang pernah mencapai pihak ketiga. Paparan hukumnya tidak ada sama sekali. Ini adalah keuntungan yang berarti bagi:
      </p>

      <ul>
        <li>Pekerja lepas dan kontraktor yang menangani data klien</li>
        <li>Profesional hukum yang bekerja dengan dokumen rahasia</li>
        <li>Pekerja kesehatan yang membutuhkan utilitas teks atau file dengan cepat</li>
        <li>Jurnalis yang melindungi sumber sensitif</li>
        <li>Developer yang men-debug token dan payload API di lingkungan produksi</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Wawasan utama:</strong> Pemrosesan lokal di browser bukan sekadar preferensi privasi — sering kali ini adalah satu-satunya opsi yang patuh secara hukum bagi profesional yang bekerja dengan data teregulasi dan membutuhkan utilitas cepat tanpa harus membuat perjanjian pemrosesan data formal dengan vendor.
      </div>

      <h2>Menjawab Keberatan Umum</h2>

      <h3>"Bukankah browser saya akan lebih lambat daripada server?"</h3>

      <p>
        Browser modern menjalankan JavaScript pada mesin V8 atau SpiderMonkey yang sangat dioptimalkan dengan kompilasi JIT, dan WebAssembly berjalan dengan kecepatan mendekati native. Untuk sebagian besar tugas utilitas — hashing, encoding, konversi format, pemrosesan gambar — perangkat Anda lebih dari mampu. Dalam banyak kasus, pemrosesan lokal justru <em>lebih cepat</em> karena menghilangkan latensi perjalanan bolak-balik jaringan sepenuhnya.
      </p>

      <h3>"Apakah pendekatan ini benar-benar terbukti untuk tugas AI seperti penghapusan latar belakang?"</h3>

      <p>
        Ya. ONNX Runtime for Web dan TensorFlow.js telah memungkinkan untuk menjalankan jaringan saraf canggih secara lokal. Akselerasi WebGPU (tersedia di versi Chrome dan Firefox terbaru) bisa mempercepat inferensi model secara dramatis. Kualitas penghapusan latar belakang lokal BrowseryTools menandingi banyak layanan cloud justru karena model yang mendasarinya sama — hanya lingkungan eksekusinya yang berbeda.
      </p>

      <h3>"Bagaimana saya tahu data tidak dikirim secara diam-diam?"</h3>

      <p>
        Anda bisa memverifikasinya sendiri. Buka Developer Tools browser Anda (F12), buka tab Network, dan amati permintaan saat menggunakan tool BrowseryTools mana pun. Anda tidak akan melihat permintaan keluar yang berisi data Anda. Transparansi ini adalah sesuatu yang tidak bisa ditawarkan oleh layanan cloud sumber tertutup mana pun.
      </p>

      <h2>Catatan tentang Praktik Data BrowseryTools Sendiri</h2>

      <p>
        BrowseryTools tidak menggunakan akun pengguna, tidak menggunakan cookie untuk pelacakan, dan tidak menggunakan analitik pihak ketiga yang menerima data file Anda. Situs menggunakan log akses server web standar (seperti situs web mana pun) dan mungkin menggunakan analitik yang menghormati privasi untuk memahami lalu lintas agregat — tetapi isi pekerjaan, file, password, dan dokumen Anda tidak pernah menyentuh server BrowseryTools. Tidak pernah.
      </p>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🔒</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Coba BrowseryTools — Data Anda Tetap Bersama Anda</h2>
        <p style={{margin: "0 0 20px", color: "inherit", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Lebih dari 70 tool gratis — editor gambar, utilitas developer, tool teks, konverter, dan banyak lagi — semuanya berjalan 100% di browser Anda. Tanpa pendaftaran. Tanpa unggahan. Tanpa iklan.
        </p>
        <Link
          href="/"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(99,102,241)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
        >
          Jelajahi Semua Tool Gratis →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Tool terkait: <Link href="/tools/password-generator">Password Generator</Link> · <Link href="/tools/hash-generator">Hash Generator</Link> · <Link href="/tools/bg-removal">Penghapus Latar Belakang</Link> · <Link href="/tools/jwt-decoder">JWT Decoder</Link> · <Link href="/tools/text-encryption">Enkripsi Teks</Link>
      </p>

    </div>
  );
}
