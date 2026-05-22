export default function Content() {
  return (
    <div>
      <p>
        Sepanjang sejarah AI yang singkat, menghubungkan language model ke alat eksternal berarti
        menulis kode integrasi kustom untuk setiap alat. Ingin model membaca file? Tulis fungsinya.
        Query database? Tulis fungsi berbeda, dalam format berbeda, untuk setiap model yang ingin
        Anda dukung. Hasilnya adalah ekosistem yang terfragmentasi di mana setiap aplikasi AI
        menciptakan ulang pipa yang sama dari awal.
      </p>
      <p>
        Model Context Protocol (MCP) adalah jawaban Anthropic atas masalah ini: standar terbuka yang
        memberi model AI antarmuka tunggal yang konsisten ke alat, file, database, dan layanan. Anda
        dapat menggunakan{" "}
        <a href="/tools/mcp-config">BrowseryTools MCP Config Generator</a> — gratis, tanpa pendaftaran,
        semuanya tetap di browser Anda — untuk membangun dan memvalidasi file konfigurasi MCP tanpa
        menulis JSON secara manual.
      </p>

      <h2>Apa Itu MCP dan Mengapa Ia Ada?</h2>
      <p>
        MCP adalah singkatan dari Model Context Protocol. Ini adalah protokol terbuka — diterbitkan
        oleh Anthropic pada akhir 2024 dan tersedia di modelcontextprotocol.io — yang menstandarisasi
        cara model AI berkomunikasi dengan sumber data dan alat eksternal. Bayangkan sebagai adaptor
        universal: alih-alih model membutuhkan plugin kustom untuk GitHub, plugin berbeda untuk
        filesystem, dan plugin lain untuk database, MCP menyediakan antarmuka tunggal yang dapat
        digunakan oleh klien dan server yang kompatibel.
      </p>
      <p>
        Analogi yang digunakan Anthropic adalah USB-C: sebelum USB-C, Anda membutuhkan kabel berbeda
        untuk setiap perangkat. MCP bertujuan menjadi konektor universal tersebut untuk penggunaan
        alat AI. Alat yang dibangun sekali sebagai server MCP bekerja dengan klien yang kompatibel
        MCP mana pun — Claude Desktop, Claude Code, dan host lain mana pun yang mengimplementasikan
        protokol.
      </p>

      <h2>Arsitektur MCP: Klien, Host, dan Server</h2>
      <p>
        MCP memiliki tiga komponen yang bekerja bersama:
      </p>
      <ul>
        <li><strong>Host</strong> — Aplikasi AI yang berjalan di mesin pengguna (misalnya Claude Desktop,
        ekstensi IDE). Host mengelola koneksi ke satu atau lebih server MCP dan menyuntikkan kemampuannya
        ke dalam konteks AI.</li>
        <li><strong>Client</strong> — Klien protokol yang tertanam dalam host yang mempertahankan koneksi
        1:1 dengan satu server MCP. Host menelurkan satu klien per server.</li>
        <li><strong>Server</strong> — Program ringan yang mengekspos kemampuan (alat, sumber daya, prompt)
        melalui protokol MCP. Server dapat berupa proses lokal (berjalan di mesin Anda) atau layanan
        jarak jauh yang dapat dijangkau melalui HTTP.</li>
      </ul>
      <p>
        Ketika Anda meminta Claude untuk "baca README di proyek saya," klien MCP host mengirim
        permintaan ke server MCP filesystem, yang membaca file dan mengembalikan konten. Claude tidak
        pernah menyentuh filesystem Anda secara langsung — server yang melakukannya, dan melaporkan
        kembali melalui protokol.
      </p>

      <h2>Apa yang Dapat Diekspos Server MCP</h2>
      <p>
        Server MCP dapat mengekspos tiga jenis kemampuan:
      </p>
      <ul>
        <li><strong>Alat (Tools)</strong> — Fungsi yang dapat dipanggil model. Contoh: cari database,
        buat GitHub issue, jalankan perintah terminal, ambil URL.</li>
        <li><strong>Sumber Daya (Resources)</strong> — Data yang dapat dibaca model. Contoh: file, baris
        database, respons API, halaman dokumentasi. Sumber daya seperti sumber konteks hanya-baca.</li>
        <li><strong>Prompt</strong> — Template prompt bawaan yang dapat dipanggil pengguna berdasarkan
        nama. Berguna untuk mengekspos alur kerja terstandarisasi.</li>
      </ul>

      <h2>Server MCP Umum yang Perlu Diketahui</h2>
      <ul>
        <li><strong>filesystem</strong> — Membaca dan menulis file di mesin lokal Anda dalam direktori
        yang ditentukan. Server yang paling sering digunakan. Diperlukan agar Claude Code dapat membaca
        codebase Anda.</li>
        <li><strong>github</strong> — Mencari repositori, membaca file, membuat issue dan pull request,
        mengambil riwayat commit. Menggunakan GitHub API dengan personal access token Anda.</li>
        <li><strong>postgres / sqlite</strong> — Menjalankan query SQL terhadap database. Hanya-baca
        secara default di sebagian besar implementasi untuk keamanan.</li>
        <li><strong>brave-search / fetch</strong> — Mengambil URL atau menjalankan pencarian web, memberi
        model akses ke informasi terkini di luar batas pelatihan.</li>
        <li><strong>memory</strong> — Penyimpanan key-value persisten yang bertahan antar sesi. Memberi
        model lapisan memori yang dapat ditulis dan dibaca.</li>
        <li><strong>puppeteer / playwright</strong> — Mengontrol browser headless. Memungkinkan model
        menavigasi halaman web, mengisi formulir, dan mengekstrak konten dari situs yang dirender JavaScript.</li>
      </ul>

      <h2>Menulis JSON Konfigurasi MCP Dasar</h2>
      <p>
        Konfigurasi MCP ada dalam file JSON yang dibaca aplikasi host saat startup. Untuk Claude Desktop
        di macOS, file ini berada di{" "}
        <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. Strukturnya
        konsisten terlepas dari server mana yang Anda tambahkan:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}`}
      </pre>
      <p>
        Setiap kunci di dalam <code>mcpServers</code> adalah nama yang Anda berikan pada server — ini
        adalah label yang muncul di UI Claude. Kolom <code>command</code> dan <code>args</code>
        mendefinisikan cara memulai proses server. Sebagian besar server resmi adalah paket npm, jadi{" "}
        <code>npx -y</code> mengunduh dan menjalankannya saat pertama kali digunakan tanpa langkah
        instalasi terpisah.
      </p>

      <h2>Menambahkan Beberapa Server</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}`}
      </pre>
      <p>
        Kolom <code>env</code> meneruskan variabel lingkungan ke proses server. Nilai sensitif seperti
        API key dan kredensial database harus ada di sini, bukan dikodekan keras dalam <code>args</code>,
        sehingga Anda dapat mengelolanya secara terpisah dan menghindari tidak sengaja melakukan commit
        ke version control.
      </p>

      <h2>Mengonfigurasi MCP di Claude Code</h2>
      <p>
        Claude Code (alat CLI) menggunakan mekanisme konfigurasi yang sedikit berbeda. Anda menambahkan
        server MCP dengan perintah <code>claude mcp add</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Tambahkan server stdio lokal
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Tambahkan server HTTP jarak jauh
claude mcp add my-server --transport http http://localhost:8080/mcp

# Tambahkan dengan variabel lingkungan
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github

# Daftarkan semua server yang dikonfigurasi
claude mcp list`}
      </pre>
      <p>
        Claude Code menyimpan konfigurasi server di <code>~/.claude/</code> secara default (lingkup
        pengguna) atau di <code>.mcp.json</code> di root proyek (lingkup proyek). Konfigurasi lingkup
        proyek berguna untuk repositori tim — commit <code>.mcp.json</code> dan semua orang di tim
        mendapatkan konfigurasi server yang sama secara otomatis.
      </p>

      <h2>Kesalahan Konfigurasi Umum</h2>
      <ul>
        <li><strong>Pemisah path yang salah</strong> — Windows menggunakan backslash tetapi string JSON
        memerlukan forward slash atau backslash yang di-escape. Selalu gunakan forward slash dalam
        konfigurasi MCP, bahkan di Windows.</li>
        <li><strong>Izin direktori yang hilang</strong> — Server filesystem hanya dapat mengakses direktori
        yang secara eksplisit Anda daftarkan dalam args-nya. Jika Claude mengatakan tidak dapat menemukan
        file, periksa apakah direktori induk file ada dalam daftar yang diizinkan.</li>
        <li><strong>Proses server yang basi</strong> — Jika server crash, host mungkin tidak memulai
        ulang secara otomatis. Restart Claude Desktop atau jalankan{" "}
        <code>claude mcp restart &lt;name&gt;</code> di Claude Code untuk mendapatkan koneksi baru.</li>
        <li><strong>Ketidakcocokan versi</strong> — MCP sedang dikembangkan secara aktif. Jika server
        berperilaku tidak terduga, periksa apakah Anda menjalankan versi terbaru dengan{" "}
        <code>npx -y @modelcontextprotocol/server-name@latest</code>.</li>
      </ul>

      <h2>Buat Konfigurasi Anda dengan BrowseryTools</h2>
      <p>
        Menulis JSON MCP secara manual membosankan dan mudah salah — koma yang hilang atau path yang
        salah dikutip membuat seluruh konfigurasi gagal secara diam-diam.{" "}
        <a href="/tools/mcp-config">BrowseryTools MCP Config Generator</a> memungkinkan Anda memilih
        server, mengisi parameter yang diperlukan, dan mendapatkan konfigurasi JSON yang valid dan
        diformat siap ditempel ke file konfigurasi Claude Desktop atau <code>.mcp.json</code> Anda.
        Semuanya berjalan di browser Anda dan tidak ada kredensial yang disimpan.
      </p>

      <h2>Ringkasan</h2>
      <p>
        MCP adalah lapisan infrastruktur yang mengubah model chat mandiri menjadi agen yang terhubung
        dengan akses ke file, kode, database, dan layanan aktual Anda. Protokol ini terbuka, server
        bersifat modular, dan format konfigurasi adalah JSON yang lugas. Setelah konfigurasi MCP Anda
        ada, Anda mendapatkan asisten AI yang jauh lebih capable tanpa mengubah cara Anda berinteraksi
        dengannya — alatnya sudah ada, siap digunakan.
      </p>
    </div>
  );
}
