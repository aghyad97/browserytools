import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jika Anda pernah men-deploy aplikasi web, mengonfigurasi pipeline CI/CD, atau mengelola server Linux, Anda
        hampir pasti pernah menjumpai ekspresi cron. Lima tanda bintang yang menatap Anda dari file konfigurasi.
        String misterius seperti <code>0 2 * * 0</code> yang tersembunyi di dalam workflow GitHub Actions.
        Jadwal AWS EventBridge yang sudah tidak dipahami siapa pun di tim. Ekspresi cron ada di mana-mana — dan
        memang membingungkan jika Anda belum meluangkan waktu untuk mempelajari sistemnya.
      </p>
      <ToolCTA slug="cron-parser" variant="inline" />
      <p>
        Panduan ini adalah referensi yang wajib Anda tandai. Mulai dari sejarah cron dan di mana ia muncul
        dalam infrastruktur modern, hingga setiap karakter khusus, 10 contoh dunia nyata dengan anotasi,
        kesalahan umum, dan tabel referensi lengkap. Di akhir panduan, Anda akan bisa membaca ekspresi cron
        apa pun sekilas dan menulis yang baru dengan percaya diri.
      </p>

      <h2>Apa Itu Cron?</h2>
      <p>
        Cron adalah penjadwal tugas berbasis Unix yang menjalankan perintah atau skrip secara otomatis pada
        waktu dan interval yang ditentukan. Namanya berasal dari <strong>Chronos</strong>, personifikasi waktu
        dalam mitologi Yunani — pilihan yang tepat untuk alat yang seluruh tujuannya adalah otomasi berbasis
        waktu. Cron asli diperkenalkan pada{" "}
        <strong>Unix Version 7 tahun 1979</strong>, ditulis oleh Ken Thompson di Bell Labs, dan telah menjadi
        fitur utama sistem operasi mirip Unix sejak saat itu.
      </p>
      <p>
        Penjadwal ini bekerja dengan membaca file konfigurasi yang disebut <strong>crontab</strong> (cron
        table) — file teks biasa di mana setiap baris mendefinisikan tugas terjadwal. Proses daemon latar
        belakang (<code>crond</code>) bangun setiap menit, memeriksa semua crontab aktif, dan menjalankan
        tugas yang jadwalnya cocok dengan waktu saat ini. Ini adalah desain yang sangat sederhana dan
        tetap tidak berubah secara fundamental selama lebih dari empat dekade.
      </p>

      <h2>Di Mana Cron Dijumpai Saat Ini</h2>
      <p>
        Cron bukan sekadar peninggalan masa lalu Unix. Sintaks ekspresi cron adalah standar de facto untuk
        mengekspresikan jadwal berulang di seluruh tumpukan perangkat lunak modern:
      </p>
      <ul>
        <li><strong>Crontab Linux dan macOS:</strong> Kasus penggunaan asli. Jalankan <code>crontab -e</code> di
        mesin Linux atau macOS mana pun untuk mengedit jadwal cron pribadi Anda.</li>
        <li><strong>GitHub Actions:</strong> File workflow menggunakan sintaks cron di bawah trigger <code>schedule:</code>{" "}
        untuk menjalankan pipeline CI/CD secara berulang.</li>
        <li><strong>AWS EventBridge (sebelumnya CloudWatch Events):</strong> Memicu fungsi Lambda, task ECS, dan
        layanan AWS lainnya sesuai jadwal menggunakan varian cron 6-field.</li>
        <li><strong>Kubernetes CronJobs:</strong> Resource <code>CronJob</code> menjalankan workload batch di
        dalam cluster sesuai jadwal cron.</li>
        <li><strong>Pipeline CI/CD:</strong> GitLab CI, CircleCI, Jenkins, dan Bitbucket Pipelines semuanya
        mendukung eksekusi terjadwal menggunakan ekspresi cron.</li>
        <li><strong>Vercel dan Netlify:</strong> Kedua platform mendukung fungsi serverless yang dipicu cron
        untuk tugas seperti invalidasi cache, pengambilan data, dan build malam hari.</li>
        <li><strong>Pemeliharaan database:</strong> Ekstensi <code>pg_cron</code> PostgreSQL, MySQL Event
        Scheduler, dan layanan database terkelola menggunakan sintaks cron untuk vacuum, indexing, dan
        pekerjaan backup.</li>
        <li><strong>Penjadwal tingkat aplikasi:</strong> Library seperti node-cron, APScheduler (Python),
        Quartz (Java), dan Sidekiq (Ruby) semuanya menggunakan ekspresi cron untuk mendefinisikan
        background job berulang.</li>
      </ul>
      <p>
        Singkatnya: jika Anda bekerja di bidang pengembangan perangkat lunak atau administrasi sistem,
        ekspresi cron adalah sesuatu yang akan Anda temui secara rutin. Mempelajarinya sekali akan memberikan
        manfaat di mana-mana.
      </p>

      <h2>Struktur Lima Field</h2>
      <p>
        Ekspresi cron standar terdiri dari tepat lima field yang dipisahkan spasi, masing-masing mewakili
        satuan waktu. Bersama-sama, keduanya mendefinisikan kapan suatu tugas harus dijalankan. Berikut
        adalah representasi visual kanoniknya:
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "20px 24px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7", margin: "24px 0"}}>{`┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12)
│ │ │ │ ┌───── day of week (0–7)
│ │ │ │ │
* * * * *`}</pre>
      <p>
        Dibaca dari kiri ke kanan: menit, jam, hari dalam bulan, bulan, hari dalam seminggu. Tanda bintang
        (<code>*</code>) di field mana pun berarti "setiap nilai yang mungkin untuk field ini." Jadi{" "}
        <code>* * * * *</code> berarti "setiap menit, setiap jam, setiap hari" — jadwal paling permisif
        yang mungkin.
      </p>

      <h3>Field 1: Menit (0–59)</h3>
      <p>
        Field menit mengontrol menit mana dalam satu jam tugas dieksekusi. Nilai <code>0</code> berarti
        tepat di awal jam, <code>30</code> berarti setengah jam, dan <code>*</code> berarti setiap menit.
        Ini adalah field paling granular dalam cron standar — unit penjadwalan terkecil adalah satu menit.
      </p>

      <h3>Field 2: Jam (0–23)</h3>
      <p>
        Field jam menggunakan format 24 jam. <code>0</code> adalah tengah malam, <code>9</code> adalah
        pukul 9 pagi, <code>17</code> adalah pukul 5 sore, dan <code>23</code> adalah pukul 11 malam.
        Tidak ada AM/PM — semuanya dalam format 24 jam. Perlu diingat bahwa cron selalu berjalan dalam
        zona waktu server kecuali dikonfigurasi secara eksplisit.
      </p>

      <h3>Field 3: Hari dalam Bulan (1–31)</h3>
      <p>
        Mengontrol hari mana dalam bulan tugas dijalankan. <code>1</code> adalah tanggal pertama,{" "}
        <code>15</code> adalah tanggal kelima belas, <code>31</code> adalah tanggal tiga puluh satu.
        Berhati-hatilah dengan nilai seperti <code>31</code> — pada bulan dengan jumlah hari lebih sedikit
        (Februari, April, Juni, dll.), tugas yang dijadwalkan pada tanggal 31 tidak akan berjalan bulan
        itu. Beberapa implementasi mendukung karakter khusus <code>L</code> yang berarti "hari terakhir
        bulan" terlepas dari berapa banyak hari yang dimiliki bulan tersebut.
      </p>

      <h3>Field 4: Bulan (1–12)</h3>
      <p>
        Field bulan menggunakan nilai numerik (1 untuk Januari hingga 12 untuk Desember) atau singkatan
        tiga huruf (<code>JAN</code>, <code>FEB</code>, <code>MAR</code>, <code>APR</code>, <code>MAY</code>,
        {" "}<code>JUN</code>, <code>JUL</code>, <code>AUG</code>, <code>SEP</code>, <code>OCT</code>,{" "}
        <code>NOV</code>, <code>DEC</code>) di sebagian besar implementasi. Tanda bintang berarti
        "setiap bulan."
      </p>

      <h3>Field 5: Hari dalam Seminggu (0–7)</h3>
      <p>
        Field ini menentukan hari dalam seminggu tugas harus berjalan. Penomoran di sini adalah sumber
        kebingungan yang umum: <strong>baik 0 maupun 7 mewakili Minggu</strong> di sebagian besar
        implementasi cron (keanehan warisan dari desain Unix asli). Senin adalah 1, Selasa adalah 2, dan
        Sabtu adalah 6. Singkatan tiga huruf (<code>SUN</code>, <code>MON</code>, <code>TUE</code>,{" "}
        <code>WED</code>, <code>THU</code>, <code>FRI</code>, <code>SAT</code>) didukung di sebagian
        besar alat cron modern.
      </p>
      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Penting:</strong> Ketika day-of-month dan day-of-week keduanya ditentukan (bukan{" "}
        <code>*</code>), sebagian besar implementasi cron memperlakukannya sebagai kondisi OR — tugas
        berjalan jika salah satu kondisi terpenuhi. Ini adalah perilaku halus namun kritis yang
        mengejutkan banyak developer.
      </div>

      <h2>Karakter Khusus</h2>
      <p>
        Kekuatan nyata ekspresi cron berasal dari enam karakter khusus yang memungkinkan Anda
        mengekspresikan jadwal kompleks secara ringkas. Memahami ini adalah kunci kefasihan.
      </p>

      <h3>* — Wildcard (Setiap Nilai)</h3>
      <p>
        Tanda bintang berarti "cocokkan setiap nilai yang mungkin di field ini." Di field menit,{" "}
        <code>*</code> berarti setiap menit (0 hingga 59). Di field bulan, berarti setiap bulan. Ini
        adalah nilai default "saya tidak peduli field ini."
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`* * * * *    # Runs every single minute, all day, every day`}</pre>

      <h3>, — Daftar (Beberapa Nilai)</h3>
      <p>
        Koma memisahkan daftar nilai tertentu. Field cocok jika waktu saat ini cocok dengan nilai mana pun
        dalam daftar. Ini adalah cara menjadwalkan tugas untuk berjalan pada beberapa waktu berbeda tanpa
        menggunakan rentang.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9,13,17 * * *    # Runs at 9:00 AM, 1:00 PM, and 5:00 PM every day
0 0 1,15 * *       # Runs at midnight on the 1st and 15th of every month`}</pre>

      <h3>- — Rentang (Dari Sampai)</h3>
      <p>
        Tanda hubung mendefinisikan rentang nilai inklusif. Field cocok dengan setiap nilai antara awal
        dan akhir, inklusif. Ini ideal untuk mengekspresikan hal-hal seperti "selama jam kerja" atau
        "pada hari kerja."
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9-17 * * *      # Runs at the top of every hour from 9 AM through 5 PM
0 0 * * 1-5       # Runs at midnight every Monday through Friday`}</pre>

      <h3>/ — Step (Setiap N Unit)</h3>
      <p>
        Garis miring ke depan mendefinisikan nilai langkah. <code>*/5</code> berarti "setiap 5 unit
        mulai dari minimum." Anda juga dapat menggabungkannya dengan rentang: <code>0-30/10</code> berarti
        "setiap 10 unit antara 0 dan 30" (yaitu 0, 10, 20, 30). Step adalah salah satu karakter khusus
        yang paling sering digunakan.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 * * * *       # Every 5 minutes (0, 5, 10, 15, ... 55)
*/15 * * * *      # Every 15 minutes (0, 15, 30, 45)
0 */6 * * *       # Every 6 hours (0:00, 6:00, 12:00, 18:00)
0/15 * * * *      # Same as */15 — starts from 0, every 15 minutes`}</pre>

      <h3>L — Terakhir (Hanya Beberapa Implementasi)</h3>
      <p>
        Karakter <code>L</code> didukung di beberapa implementasi cron (terutama Quartz Scheduler di Java
        dan beberapa varian cron Linux) yang berarti "terakhir." Di field day-of-month, <code>L</code>{" "}
        berarti hari terakhir bulan berjalan — baik itu tanggal 28, 29, 30, atau 31. Ini memecahkan masalah
        penjadwalan tugas "akhir bulan" tanpa mengetahui panjang bulan terlebih dahulu.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 L * *         # Midnight on the last day of every month (Quartz/some crons)`}</pre>

      <h3>? — Tidak Ada Nilai Spesifik (Quartz/Java Cron)</h3>
      <p>
        Tanda tanya digunakan di Quartz Scheduler (Java) dan beberapa alat lainnya ketika Anda ingin
        menentukan day-of-week tanpa juga menentukan day-of-month, atau sebaliknya. Karena tidak masuk
        akal secara logis untuk menentukan keduanya (misalnya "tanggal 15 DAN hari Rabu"), salah satunya
        harus diset ke <code>?</code> untuk menandakan "tidak peduli." Cron Unix standar tidak menggunakan
        karakter ini — Anda menggunakan <code>*</code> sebagai gantinya.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 15 * ?        # Quartz: 9 AM on the 15th, day-of-week unspecified
0 9 ? * MON       # Quartz: 9 AM every Monday, day-of-month unspecified`}</pre>

      <h2>10 Contoh Cron Dunia Nyata</h2>
      <p>
        Cara terbaik untuk memantapkan pemahaman Anda adalah mempelajari contoh nyata dengan konteks mengapa
        setiap jadwal dipilih. Berikut adalah sepuluh pola yang akan Anda temui (dan gunakan) secara rutin.
      </p>

      <h3>1. Setiap Hari Kerja Pukul 9:00 Pagi</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 * * 1-5`}</pre>
      <p>
        Menit adalah <code>0</code> (tepat di awal jam), jam adalah <code>9</code> (pukul 9 pagi),
        day-of-month dan month adalah wildcard, dan day-of-week adalah <code>1-5</code> (Senin hingga
        Jumat). Digunakan untuk pengingat standup harian, email laporan yang dikirim di awal hari kerja,
        dan tugas sinkronisasi data pagi yang tidak boleh berjalan di akhir pekan.
      </p>

      <h3>2. Setiap 15 Menit</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/15 * * * *`}</pre>
      <p>
        Sintaks step <code>*/15</code> di field menit memberikan eksekusi pada menit 0, 15, 30, dan 45
        setiap jam, sepanjang waktu. Umum untuk ping health check, pemanasan cache, percobaan ulang
        webhook, dan tugas polling hampir real-time di mana Anda membutuhkan data segar namun real-time
        sejati berlebihan atau tidak tersedia.
      </p>

      <h3>3. Setiap Hari Tengah Malam</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 * * *`}</pre>
      <p>
        Menit 0, jam 0, semua lainnya wildcard. Ini adalah salah satu pola cron paling umum yang ada.
        Digunakan untuk pembuatan laporan harian, rotasi log, pengarsipan database, pembersihan file
        sementara, pengiriman email digest harian, dan tugas "sekali sehari" yang harus berjalan di
        luar jam kerja.
      </p>

      <h3>4. Tanggal 1 Setiap Bulan Tengah Malam</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 * *`}</pre>
      <p>
        Day-of-month adalah <code>1</code>, semua lainnya wildcard (kecuali menit/jam yang tetap). Ini
        berjalan pada 1 Januari, 1 Februari, 1 Maret, dan seterusnya. Jadwal utama untuk pembuatan
        faktur bulanan, pemicu siklus penagihan, pembaruan langganan SaaS, dan roll-up analitik bulanan.
      </p>

      <h3>5. Setiap Minggu Pukul 2:00 Dini Hari</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 2 * * 0`}</pre>
      <p>
        Day-of-week <code>0</code> adalah Minggu, dan jam <code>2</code> adalah pukul 2 dini hari —
        waktu ketika traffic biasanya paling rendah. Digunakan untuk backup database penuh mingguan,
        regenerasi sitemap, re-indexing konten untuk pencarian, dan tugas pemrosesan batch berat yang
        akan memengaruhi performa selama minggu kerja.
      </p>

      <h3>6. Hari Kerja Pukul 8:30, 12:30, dan 17:30</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`30 8,12,17 * * 1-5`}</pre>
      <p>
        Ini menggabungkan daftar di field jam dengan rentang di field day-of-week. Menit <code>30</code>{" "}
        berarti dieksekusi di menit ke-30. Digunakan untuk batch notifikasi terjadwal (push notification,
        email digest), tugas sinkronisasi data tiga kali sehari, dan alur kerja di mana Anda ingin
        titik kontak rutin sepanjang hari kerja tanpa memukul setiap jam.
      </p>

      <h3>7. 1 Januari Tengah Malam</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 1 *`}</pre>
      <p>
        Day-of-month <code>1</code> dan month <code>1</code> (Januari) bersama-sama menentukan Tahun Baru.
        Digunakan untuk tugas tahunan seperti pembaruan langganan tahunan, pengarsipan data tahun
        sebelumnya, pembuatan laporan kepatuhan tahunan, dan reset kuota atau penghitung tahunan
        di aplikasi.
      </p>

      <h3>8. Setiap 5 Menit Selama Jam Kerja di Hari Kerja</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 9-17 * * 1-5`}</pre>
      <p>
        Ekspresi gabungan yang menggabungkan step (<code>*/5</code>), rentang di jam (<code>9-17</code>),
        dan rentang di day-of-week (<code>1-5</code>). Ini memberikan monitoring atau polling agresif —
        setiap 5 menit dari pukul 9 pagi hingga 5 sore Senin hingga Jumat — sementara diam semalaman
        dan di akhir pekan untuk menghemat sumber daya dan menghindari alert fatigue.
      </p>

      <h3>9. Setiap 6 Jam</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 */6 * * *`}</pre>
      <p>
        Step di field jam (<code>*/6</code>) memberikan empat eksekusi yang merata per hari: tengah
        malam, pukul 6 pagi, siang, dan pukul 6 sore. Digunakan untuk sinkronisasi data antar sistem,
        pembaruan token API atau kredensial OAuth jangka panjang sebelum kedaluwarsa, dan invalidasi
        cache berkala untuk konten yang berubah beberapa kali sehari namun tidak memerlukan kesegaran
        tingkat menit.
      </p>

      <h3>10. Tanggal 15 dan Hari Terakhir Setiap Bulan</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 15,L * *`}</pre>
      <p>
        Daftar koma di field day-of-month yang menggabungkan tanggal tetap (<code>15</code>) dan
        singkatan hari terakhir (<code>L</code>). Ini adalah jadwal penggajian semi-bulanan klasik —
        periode gaji yang berakhir pada tanggal 15 dan hari terakhir bulan. Perlu dicatat bahwa{" "}
        <code>L</code> memerlukan implementasi yang mendukungnya (Quartz, beberapa cron Linux); crontab
        standar tidak mendukung <code>L</code>.
      </p>

      <h2>Kesalahan Umum dan Jebakan</h2>
      <p>
        Ekspresi cron memiliki beberapa jebakan yang sudah dikenal yang menyebabkan insiden produksi.
        Memahaminya sejak awal akan menghemat sesi debugging yang menyakitkan di tengah malam.
      </p>

      <h3>Penomoran Hari dalam Seminggu Tidak Universal</h3>
      <p>
        Sebagian besar implementasi cron Unix memperlakukan baik <code>0</code> maupun <code>7</code>{" "}
        sebagai Minggu. Namun beberapa alat (termasuk library tingkat aplikasi tertentu) memulai minggu
        pada Senin, sehingga <code>1</code> = Senin dan <code>7</code> = Minggu. Selalu verifikasi
        konvensi penomoran untuk alat spesifik yang Anda gunakan, dan lebih baik menggunakan singkatan
        tiga huruf (<code>MON</code>, <code>TUE</code>, dll.) ketika implementasi mendukungnya untuk
        menghilangkan ambiguitas.
      </p>

      <h3>Cron Berjalan dalam Zona Waktu Server</h3>
      <p>
        Ini mungkin sumber bug cron paling umum di produksi. <code>0 9 * * *</code> berarti pukul 9
        pagi dalam <em>zona waktu mesin yang menjalankan tugas</em> — yang mungkin UTC, US/Eastern, atau
        lainnya. Selalu dokumentasikan asumsi zona waktu dalam komentar di samping ekspresi cron. Untuk
        penjadwal berbasis cloud, konfigurasikan zona waktu secara eksplisit jika platform mendukungnya.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# Good practice: always document the timezone
# Runs at 9 AM US/Eastern (UTC-5 or UTC-4 during DST)
0 14 * * 1-5   # 9 AM ET expressed in UTC`}</pre>

      <h3>Cron GitHub Actions Selalu Berjalan dalam UTC</h3>
      <p>
        GitHub Actions menggunakan sintaks cron 5-field standar di bawah kunci <code>on: schedule:</code>,
        tetapi penjadwal selalu beroperasi dalam UTC — tidak ada opsi konfigurasi zona waktu. Jika Anda
        ingin tugas berjalan pukul 9 pagi Waktu Timur, Anda perlu menjadwalkannya pada{" "}
        <code>0 14 * * *</code> (UTC). Perlu juga dicatat bahwa workflow terjadwal GitHub Actions mungkin
        terlambat hingga 15 menit selama periode permintaan tinggi.
      </p>

      <h3>Sintaks Step Berlaku untuk Fieldnya, Bukan Menit</h3>
      <p>
        Kesalahan baca yang umum: <code>*/5</code> di field <em>jam</em> berarti setiap 5 jam — bukan
        setiap 5 menit. Step selalu berlaku untuk unit field tempat ia berada. <code>*/5</code> di field
        menit adalah setiap 5 menit; di field jam, setiap 5 jam; di field bulan, setiap 5 bulan.
      </p>

      <h3>Tugas yang Berjalan Lebih Lama dari Intervalnya Dapat Tumpang Tindih</h3>
      <p>
        Cron adalah penjadwal fire-and-forget. Jika Anda menjadwalkan tugas setiap 5 menit dan satu
        instance tugas membutuhkan waktu 7 menit untuk selesai, instance kedua akan dimulai sementara
        yang pertama masih berjalan. Ini dapat menyebabkan race condition, pemrosesan duplikat, dan
        korupsi data. Gunakan file lock atau advisory lock di database Anda untuk mencegah eksekusi
        bersamaan dari tugas yang sama.
      </p>

      <h3>Field yang Dihilangkan vs Wildcard Tidak Selalu Setara</h3>
      <p>
        Di beberapa implementasi cron yang diperluas (terutama Quartz), menghilangkan field dan menggunakan
        <code>*</code> diperlakukan berbeda. Selalu gunakan semua field yang diperlukan secara eksplisit
        dan jangan pernah mengandalkan nilai default untuk jadwal produksi kritis.
      </p>

      <h2>Ekstensi Non-Standar: Cron 6-Field</h2>
      <p>
        Cron Unix standar memiliki lima field, dengan menit sebagai granularitas terkecil. Beberapa sistem
        memperluas ini dengan field tambahan:
      </p>

      <h3>Field Detik (Ditempatkan di Depan)</h3>
      <p>
        Banyak penjadwal tingkat aplikasi (node-cron, Quartz, Spring Scheduler) menambahkan{" "}
        <strong>field detik di awal</strong>, memberikan 6 field. Ini memungkinkan penjadwalan sub-menit
        hingga detik. Field-nya adalah: <code>detik menit jam hari-dalam-bulan bulan hari-dalam-seminggu</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# 6-field cron with seconds prepended (Quartz / node-cron)
0 */5 * * * *    # Every 5 minutes (second=0, minute=*/5, ...)
30 0 9 * * 1-5   # Weekdays at 9:00:30 AM`}</pre>

      <h3>AWS EventBridge (6 Field dengan Tahun)</h3>
      <p>
        AWS EventBridge menggunakan format 6-field di mana <strong>field tahun ditambahkan di akhir</strong>:
        <code>menit jam hari-dalam-bulan bulan hari-dalam-seminggu tahun</code>. Juga memerlukan penggunaan{" "}
        <code>?</code> untuk day-of-month atau day-of-week (tidak boleh keduanya sebagai wildcard secara
        bersamaan). AWS EventBridge tidak mendukung sintaks step <code>*/</code> dengan cara yang sama
        seperti cron Unix.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# AWS EventBridge cron format (6 fields, year at end)
cron(0 9 ? * MON-FRI *)    # Weekdays at 9 AM UTC, any year
cron(0 0 1 * ? *)           # First day of every month at midnight`}</pre>
      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tips cepat:</strong> Saat menyalin ekspresi cron antar platform, selalu verifikasi
        jumlah field dan perbedaan sintaks khusus platform. Ekspresi cron Unix yang valid mungkin tidak
        valid (atau berarti sesuatu yang berbeda) di AWS EventBridge, Quartz, atau konteks node-cron.
      </div>

      <h2>Cara Menggunakan Cron Parser BrowseryTools</h2>
      <p>
        Menulis ekspresi cron dari awal adalah satu keahlian — memvalidasi bahwa Anda menulisnya dengan
        benar adalah keahlian lain. <a href="/tools/cron-parser">Cron Parser BrowseryTools</a> memudahkan
        verifikasi ekspresi apa pun sebelum masuk ke produksi.
      </p>
      <p>Tempelkan ekspresi cron 5-field (atau 6-field) apa pun ke dalam alat dan dapatkan secara instan:</p>
      <ul>
        <li><strong>Deskripsi yang mudah dibaca manusia</strong> dari jadwal ("Setiap hari kerja pukul 9:00
        Pagi") sehingga Anda dapat memverifikasi maksud Anda sesuai ekspresi sekilas.</li>
        <li><strong>5–10 waktu eksekusi terjadwal berikutnya</strong> yang tercantum secara eksplisit,
        sehingga Anda dapat melihat kapan tepatnya tugas akan dieksekusi dan memastikan tidak ada
        kejutan.</li>
        <li>Umpan balik instan tentang <strong>sintaks tidak valid</strong> — berguna jika Anda memiliki
        typo atau sedang mengerjakan ekspresi yang ditulis orang lain.</li>
      </ul>
      <p>
        Semuanya berjalan sepenuhnya di browser Anda — tidak ada ekspresi yang dikirim ke server mana pun.
        Ini adalah cara tercepat untuk memeriksa jadwal sebelum deploy ke GitHub Actions, Kubernetes,
        atau platform lainnya.
      </p>

      <h2>Tabel Referensi Ekspresi Cron</h2>
      <p>
        Gunakan tabel ini sebagai referensi cepat. Tandai halaman ini dan kembali kapan pun Anda perlu
        mencari pola atau memverifikasi arti suatu ekspresi.
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap"}}>Ekspresi</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Arti dalam Bahasa Manusia</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kasus Penggunaan Umum</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>* * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Setiap menit</td>
              <td style={{padding: "12px 16px"}}>Polling frekuensi tinggi, pengujian</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Setiap 5 menit</td>
              <td style={{padding: "12px 16px"}}>Health check, pemanasan cache</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/15 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Setiap 15 menit</td>
              <td style={{padding: "12px 16px"}}>Sinkronisasi data, percobaan ulang webhook</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Setiap jam tepat</td>
              <td style={{padding: "12px 16px"}}>Agregasi per jam, panggilan API</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 */6 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Setiap 6 jam</td>
              <td style={{padding: "12px 16px"}}>Pembaruan token, sinkronisasi data</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Setiap hari tengah malam</td>
              <td style={{padding: "12px 16px"}}>Laporan harian, rotasi log</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 9 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Hari kerja pukul 9:00 Pagi</td>
              <td style={{padding: "12px 16px"}}>Tugas jam kerja, pengingat</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 2 * * 0</code></td>
              <td style={{padding: "12px 16px"}}>Setiap Minggu pukul 2:00 Dini Hari</td>
              <td style={{padding: "12px 16px"}}>Backup mingguan, pemeliharaan</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 * *</code></td>
              <td style={{padding: "12px 16px"}}>Tanggal 1 setiap bulan tengah malam</td>
              <td style={{padding: "12px 16px"}}>Faktur bulanan, penagihan</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1,15 * *</code></td>
              <td style={{padding: "12px 16px"}}>Tanggal 1 dan 15 setiap bulan</td>
              <td style={{padding: "12px 16px"}}>Penggajian semi-bulanan</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 1 *</code></td>
              <td style={{padding: "12px 16px"}}>1 Januari tengah malam</td>
              <td style={{padding: "12px 16px"}}>Tugas tahunan, reset tahunan</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>30 8,12,17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Hari kerja pukul 8:30, 12:30, 17:30</td>
              <td style={{padding: "12px 16px"}}>Batch notifikasi</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 9-17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Setiap 5 menit selama jam kerja (hari kerja)</td>
              <td style={{padding: "12px 16px"}}>Monitoring aktif, polling</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Validasi Ekspresi Cron Sebelum Deploy</h2>
      <p>
        Ekspresi cron ringkas dan powerful, namun kekompaktannya berarti satu typo dapat secara diam-diam
        menghasilkan jadwal yang sama sekali berbeda. Tugas yang Anda maksudkan berjalan bulanan mungkin
        berjalan harian. Backup yang Anda maksudkan dipicu setiap Minggu mungkin tidak pernah berjalan
        sama sekali. Biaya jadwal yang salah di produksi bisa berkisar dari laporan yang terlewat hingga
        tugas penagihan yang dieksekusi ratusan kali.
      </p>
      <p>
        Kebiasaan dua menit untuk menempelkan ekspresi Anda ke dalam validator dan meninjau beberapa
        waktu eksekusi terjadwal berikutnya sebelum deploy adalah salah satu praktik bernilai tertinggi
        dalam DevOps dan rekayasa backend. Ini menangkap kesalahan sebelum menjadi insiden.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Validasi Ekspresi Cron Apa Pun Secara Instan — Gratis, Privat, Langsung di Browser
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Tempelkan ekspresi Anda, dapatkan deskripsi yang mudah dibaca, dan lihat waktu eksekusi
          terjadwal berikutnya. Tidak ada yang keluar dari browser Anda.
        </p>
        <a
          href="/tools/cron-parser"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Buka Cron Parser →
        </a>
      </div>
      <ToolCTA slug="cron-parser" variant="card" />
    </div>
  );
}
