import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Setiap file dan direktori di sistem Linux atau macOS membawa satu set izin yang mengontrol
        siapa yang dapat membaca, menulis, atau mengeksekusinya. Mengatur izin ini dengan benar
        adalah perbedaan antara server yang aman dan server yang bocor data atau dikompromikan.
        Namun notasinya — <code>chmod 755</code>,{" "}
        output <code>ls -la</code> yang menampilkan <code>-rwxr-xr--</code> — bisa terasa rumit
        sampai kamu memahami model di baliknya. Panduan ini menjelaskan izin file Unix dari
        prinsip pertama.
      </p>
      <ToolCTA slug="chmod" variant="inline" />
      <p>
        Kamu bisa menghitung nilai izin dan mengkonversi antara notasi oktal dan simbolik secara
        instan dengan{" "}
        <a href="/tools/chmod">BrowseryTools chmod Calculator</a> — gratis, tanpa daftar, semuanya
        berjalan di browsermu.
      </p>

      <h2>Model Izin Unix: Owner, Group, Other</h2>
      <p>
        Unix menetapkan setiap file dan direktori tiga set izin, masing-masing mencakup audiens
        yang berbeda:
      </p>
      <ul>
        <li><strong>Owner (user)</strong> — akun pengguna yang memiliki file. Biasanya pengguna yang membuatnya.</li>
        <li><strong>Group</strong> — sekelompok pengguna yang diberi nama. File termasuk dalam satu grup; semua anggota grup tersebut berbagi izin grup.</li>
        <li><strong>Other (world)</strong> — semua orang di sistem yang bukan owner maupun anggota grup.</li>
      </ul>
      <p>
        Dalam masing-masing tiga set tersebut, terdapat tiga bit izin: read (<code>r</code>),
        write (<code>w</code>), dan execute (<code>x</code>). Itu menghasilkan sembilan bit izin
        secara total, yang langsung dipetakan ke sembilan karakter yang kamu lihat setelah indikator
        tipe file dalam output <code>ls -la</code>.
      </p>

      <h2>Membaca Output ls -la</h2>
      <p>
        Ketika kamu menjalankan <code>ls -la</code>, setiap baris dimulai dengan string 10 karakter
        seperti{" "}
        <code>-rwxr-xr--</code>. Berikut cara membacanya:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`-  rwx  r-x  r--
^  ^^^  ^^^  ^^^
|  |    |    └── other:  read only
|  |    └─────── group:  read + execute
|  └──────────── owner:  read + write + execute
└─────────────── file type: - = file, d = directory, l = symlink`}
      </pre>
      <p>
        Tanda hubung <code>-</code> di posisi izin berarti izin tersebut tidak diberikan. Jadi{" "}
        <code>r-x</code>{" "}
        berarti read dan execute diizinkan, tetapi write tidak.
      </p>

      <h2>Arti Read, Write, Execute untuk File vs Direktori</h2>
      <p>
        Tiga bit izin memiliki arti yang berbeda tergantung apakah diterapkan ke file atau direktori:
      </p>
      <ul>
        <li><strong>File read (r)</strong> — dapat membaca isi file (<code>cat</code>, <code>less</code>, buka di editor).</li>
        <li><strong>File write (w)</strong> — dapat memodifikasi atau memotong file. Catatan: menghapus file dikontrol oleh izin write direktori induk, bukan bit write file itu sendiri.</li>
        <li><strong>File execute (x)</strong> — dapat menjalankan file sebagai program atau skrip. Tanpa bit ini, <code>./script.sh</code> mengembalikan "Permission denied" meskipun kamu bisa membacanya.</li>
        <li><strong>Directory read (r)</strong> — dapat melihat daftar isi direktori (<code>ls</code>). Tanpanya, kamu tahu direktori itu ada tapi tidak bisa melihat isinya.</li>
        <li><strong>Directory write (w)</strong> — dapat membuat, mengganti nama, atau menghapus file di dalam direktori. Inilah mengapa kamu bisa menghapus file yang bukan milikmu jika kamu memiliki akses write ke direktori induknya.</li>
        <li><strong>Directory execute (x)</strong> — dapat masuk ke direktori (<code>cd</code>) dan mengakses file di dalamnya jika kamu mengetahui namanya. Ini kadang disebut "search bit." Direktori dengan <code>r--</code> memungkinkan kamu melihat daftar nama file tetapi tidak mengaksesnya; direktori dengan <code>--x</code> memungkinkan kamu mengakses file berdasarkan nama tetapi tidak melihat daftarnya.</li>
      </ul>

      <h2>Notasi Oktal: 755, 644, 777</h2>
      <p>
        Setiap set izin (owner, group, other) adalah tiga bit. Tiga bit dapat merepresentasikan
        nilai 0 hingga 7 — tepat satu digit oktal. Itulah mengapa izin ditulis sebagai tiga digit
        oktal, satu per audiens:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Bit values:  r = 4,  w = 2,  x = 1

rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0+0+0 = 0

chmod 755 → owner: 7 (rwx), group: 5 (r-x), other: 5 (r-x)
chmod 644 → owner: 6 (rw-), group: 4 (r--), other: 4 (r--)
chmod 600 → owner: 6 (rw-), group: 0 (---), other: 0 (---)`}
      </pre>
      <p>
        Kamu tidak perlu menghafalkan setiap kombinasi — gunakan{" "}
        <a href="/tools/chmod">BrowseryTools chmod Calculator</a> untuk memeriksa arti nilai oktal
        apa pun atau untuk membangun nilai yang tepat untuk situasimu.
      </p>

      <h2>Notasi Simbolik: u+x, g-w, o=r</h2>
      <p>
        Mode simbolik memungkinkanmu memodifikasi izin relatif terhadap kondisi saat ini, tanpa
        menentukan ketiga set sekaligus. Formatnya adalah <code>[siapa][operator][izin]</code>:
      </p>
      <ul>
        <li><strong>Siapa</strong>: <code>u</code> (owner/user), <code>g</code> (group), <code>o</code> (other), <code>a</code> (ketiganya)</li>
        <li><strong>Operator</strong>: <code>+</code> (tambah), <code>-</code> (hapus), <code>=</code> (atur tepat)</li>
        <li><strong>Izin</strong>: <code>r</code>, <code>w</code>, <code>x</code></li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`chmod u+x script.sh       # add execute for owner only
chmod g-w config.txt      # remove write from group
chmod o=r public.html     # set other to read-only exactly
chmod a+r file.txt        # add read for everyone
chmod u=rwx,g=rx,o=       # equivalent to chmod 750`}
      </pre>

      <h2>Pola Izin Umum Dijelaskan</h2>
      <ul>
        <li><strong>755</strong> (<code>rwxr-xr-x</code>) — Standar untuk executable dan direktori. Owner bisa melakukan segalanya; semua orang lain bisa membaca dan mengeksekusi (atau masuk direktori) tetapi tidak menulis. Default untuk direktori document root web server dan skrip publik.</li>
        <li><strong>644</strong> (<code>rw-r--r--</code>) — Standar untuk file biasa. Owner bisa read/write; semua orang lain hanya bisa membaca. Baik untuk aset web, file konfigurasi yang tidak berisi rahasia, dan sebagian besar konten statis.</li>
        <li><strong>600</strong> (<code>rw-------</code>) — Owner bisa read/write; tidak ada orang lain yang bisa melakukan apa pun. Diperlukan untuk kunci privat SSH (<code>~/.ssh/id_rsa</code>). SSH akan menolak menggunakan file kunci yang memiliki izin lebih longgar.</li>
        <li><strong>700</strong> (<code>rwx------</code>) — Owner bisa melakukan segalanya; tidak ada orang lain yang memiliki akses. Baik untuk skrip privat dan direktori yang berisi data sensitif.</li>
        <li><strong>400</strong> (<code>r--------</code>) — Read-only untuk owner; sepenuhnya terkunci untuk semua orang. Digunakan untuk file konfigurasi dan sertifikat yang tidak boleh diubah di mana penulisan yang tidak disengaja akan berbahaya.</li>
      </ul>

      <h2>Mengapa 777 Berbahaya</h2>
      <p>
        <code>chmod 777</code> memberikan izin read, write, dan execute kepada setiap pengguna di
        sistem. Ini berarti proses apa pun yang berjalan sebagai pengguna mana pun — termasuk
        aplikasi web yang dikompromikan, skrip berbahaya di lingkungan shared hosting, atau
        pengguna lain di mesin — dapat memodifikasi atau mengeksekusi file. Dalam konteks web
        server, file PHP dengan izin 777 memungkinkan proses lain untuk menimpanya dengan kode
        berbahaya. Jangan pernah gunakan 777 di production. Jika kamu menggunakannya untuk
        "memperbaiki error izin," perbaikan sebenarnya adalah memberikan kepemilikan file kepada
        pengguna atau grup yang tepat.
      </p>

      <h2>Setuid, Setgid, dan Sticky Bit</h2>
      <p>
        Di luar sembilan bit standar, ada tiga bit khusus yang muncul sebagai digit keempat di
        depan dalam notasi oktal empat digit:
      </p>
      <ul>
        <li><strong>Setuid (4xxx)</strong> — ketika diset pada executable, program berjalan dengan hak istimewa owner file, bukan pemanggil. <code>/usr/bin/passwd</code> menggunakan ini untuk memungkinkan pengguna biasa menulis ke <code>/etc/shadow</code>, yang dimiliki oleh root.</li>
        <li><strong>Setgid (2xxx)</strong> — pada executable, berjalan dengan hak istimewa grup file. Pada direktori, file baru yang dibuat di dalamnya mewarisi grup direktori daripada grup utama pembuatnya — berguna untuk direktori proyek bersama.</li>
        <li><strong>Sticky bit (1xxx)</strong> — pada direktori, mencegah pengguna menghapus file yang bukan milik mereka, meskipun mereka memiliki akses write ke direktori. <code>/tmp</code> memiliki sticky bit (<code>chmod 1777</code>) sehingga pengguna dapat membuat file temp mereka sendiri tetapi tidak dapat menghapus milik orang lain.</li>
      </ul>

      <h2>chmod Rekursif (-R) dan Contoh Dunia Nyata</h2>
      <p>
        Flag <code>-R</code> menerapkan perubahan izin secara rekursif ke direktori dan semua
        isinya. Gunakan dengan hati-hati — menerapkan izin yang sama ke file dan direktori seringkali
        salah karena direktori membutuhkan bit execute agar bisa dimasuki, sementara file biasa
        biasanya tidak harus memiliki execute:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Web server: directories need 755, files need 644
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Fix SSH key permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/authorized_keys

# Make a deploy script executable
chmod +x deploy.sh`}
      </pre>
      <p>
        Ketika kamu tidak yakin nilai oktal mana yang harus digunakan,{" "}
        <a href="/tools/chmod">BrowseryTools chmod Calculator</a> memungkinkanmu mengklik checkbox
        untuk izin owner, group, dan other dan langsung melihat nilai oktal dan notasi simbolik
        yang dihasilkan.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          chmod Calculator Gratis — Oktal ↔ Simbolik ↔ Mudah Dibaca
        </p>
        <a
          href="/tools/chmod"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka chmod Calculator →
        </a>
      </div>
      <ToolCTA slug="chmod" variant="card" />
    </div>
  );
}
