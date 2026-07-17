import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Menjadwalkan rapat lintas zona waktu terdengar sederhana sampai kamu melakukannya beberapa
        kali. Orang yang berkata "ayo bertemu jam 9 pagi waktuku" tidak menyebutkan zona waktunya.
        Seseorang memindahkan rapat "satu jam lebih awal" seminggu sebelum transisi daylight saving,
        dan rapat itu jatuh pada waktu yang salah untuk separuh tim. Seorang developer menyimpan
        timestamp dalam waktu lokal dan sekarang database penuh dengan entri yang ambigu.
      </p>
      <ToolCTA slug="timezone-converter" variant="inline" />
      <p>
        Zona waktu adalah salah satu sistem yang tampak intuitif sampai ternyata tidak, dan kasus
        tepinya menyebabkan masalah nyata. Panduan ini membahas cara kerja sistem, di mana ia rusak,
        bagaimana tim jarak jauh dapat menghindari kesalahan penjadwalan yang paling umum, dan
        standar yang membuat bekerja lintas zona waktu menjadi dapat dikelola.
      </p>
      <p>
        Kamu bisa menggunakan{" "}
        <a href="/tools/timezone-converter">BrowseryTools Timezone Converter</a> — gratis, tanpa
        daftar, semua data tersimpan di browsermu.
      </p>

      <h2>Cara Kerja Zona Waktu: Penjelasan Offset UTC</h2>
      <p>
        Zona waktu didefinisikan sebagai offset dari Coordinated Universal Time (UTC) — penerus
        modern Greenwich Mean Time (GMT). UTC sendiri tidak memiliki offset: UTC+0. Setiap zona
        waktu lain didefinisikan sebagai UTC ditambah atau dikurangi sejumlah jam (dan terkadang
        menit).
      </p>
      <p>
        New York adalah UTC-5 di musim dingin (Eastern Standard Time) dan UTC-4 di musim panas
        (Eastern Daylight Time). London adalah UTC+0 di musim dingin dan UTC+1 di musim panas
        (British Summer Time). Tokyo adalah UTC+9 sepanjang tahun. Sydney berganti antara UTC+10
        dan UTC+11 tergantung pada apakah mengamati daylight saving time — yang berlangsung dari
        Oktober hingga April di Belahan Selatan, berlawanan dengan Belahan Utara.
      </p>
      <p>
        Mempersulit lebih lanjut: tidak semua offset zona waktu dalam jam penuh. India adalah
        UTC+5:30. Nepal adalah UTC+5:45. Iran adalah UTC+3:30. Central Standard Time Australia
        adalah UTC+9:30. Offset fraksional ini ada karena alasan historis, politik, atau geografis
        dan mengejutkan orang yang berasumsi semua zona berada pada jam bulat.
      </p>

      <h2>Daylight Saving Time: Mengapa Ini Mempersulit Segalanya</h2>
      <p>
        Daylight Saving Time (DST) adalah praktik memajukan jam satu jam di musim semi dan
        mundurkan satu jam di musim gugur untuk menggeser jam siang hari ke malam. Ini diamati oleh
        sekitar 70 negara, diabaikan oleh sisanya, dan transisi tidak terjadi pada tanggal yang
        sama di seluruh dunia.
      </p>
      <p>
        AS dan Kanada beralih pada Minggu kedua Maret dan Minggu pertama November. Sebagian besar
        Eropa beralih pada Minggu terakhir Maret dan Minggu terakhir Oktober. Ini menciptakan jendela
        tiga minggu di Maret dan jendela satu minggu di November ketika offset antara, misalnya,
        New York dan London berbeda dari yang terjadi sepanjang tahun. Panggilan mingguan yang
        terjadwal "jam 2 siang waktu New York" bisa jatuh pada jam 6 sore waktu London selama 48
        minggu dan jam 7 malam selama 4 minggu — mengejutkan orang setiap kali.
      </p>
      <p>
        Beberapa tempat tidak mengamati DST sama sekali: Arizona (kecuali Navajo Nation), Hawaii,
        sebagian besar Afrika, Jepang, China, India, dan sebagian besar Asia Tenggara. EU memilih
        untuk menghapus DST pada 2019 tetapi implementasinya telah ditunda tanpa batas. Sampai ada
        resolusi permanen, kompleksitas ini tidak akan hilang.
      </p>

      <h2>Mengapa Penjadwalan Lintas Zona Waktu Rawan Kesalahan</h2>
      <p>
        Mode kegagalannya sudah terdokumentasi dengan baik:
      </p>
      <ul>
        <li>
          <strong>Mengasumsikan offset UTC stabil sepanjang tahun</strong> — Transisi DST berarti
          offset berubah dua kali setahun di sebagian besar negara. Undangan kalender yang dibuat
          pada Januari dengan offset UTC yang dikodekan keras akan salah setelah transisi DST Maret.
        </li>
        <li>
          <strong>"Jam 9 pagi waktumu"</strong> — Frasa ini ambigu kecuali pembicara menentukan
          zona waktu secara eksplisit. Zona waktu mereka, atau zona waktumu? Tidak selalu jelas siapa
          yang berbicara.
        </li>
        <li>
          <strong>Inkonsistensi perangkat lunak kalender</strong> — Google Calendar, Outlook, dan
          Apple Calendar semuanya menangani tampilan zona waktu secara berbeda. Acara yang dibuat di
          satu aplikasi kalender dan dibagikan melalui email tidak selalu dikonversi dengan bersih di
          aplikasi penerima, terutama di berbagai format undangan rapat.
        </li>
        <li>
          <strong>Negara dengan offset non-standar</strong> — Mengundang seseorang di Kathmandu
          (UTC+5:45) atau Teheran (UTC+3:30) ke rapat yang ditentukan dalam UTC jam penuh akan
          menghasilkan offset fraksional yang tidak ditangani dengan benar oleh banyak alat sederhana.
        </li>
        <li>
          <strong>Penyeberangan garis tanggal</strong> — Rapat jam 9 malam UTC pada hari Selasa
          adalah hari Rabu di Tokyo (UTC+9). Salah tanggal saat menentukan rapat mendekati tengah
          malam UTC adalah kesalahan yang umum.
        </li>
      </ul>

      <h2>Praktik Terbaik untuk Penjadwalan Tim Jarak Jauh</h2>
      <p>
        Tim yang bekerja lintas zona waktu telah mengkonvergensi pada beberapa praktik yang secara
        dramatis mengurangi kesalahan penjadwalan:
      </p>
      <ul>
        <li>
          <strong>Selalu tentukan zona waktu secara eksplisit.</strong> Jangan pernah mengatakan
          "jam 3" tanpa zona waktu. "Jam 3 UTC" tidak ambigu. "Jam 3 ET" sebagian ambigu (EST atau
          EDT?). "Jam 3 Eastern" lebih baik tetapi masih ambigu selama minggu transisi. "15:00 UTC"
          sepenuhnya tidak ambigu bagi siapa pun yang mengetahui offset UTC mereka.
        </li>
        <li>
          <strong>Gunakan UTC sebagai waktu referensi tim untuk komunikasi internal.</strong> Saat
          membahas jadwal secara internal, jangkarkan segalanya ke UTC. "Deploy dilakukan pada
          14:00 UTC" adalah sesuatu yang setiap anggota tim dapat konversi ke waktu lokal mereka
          secara mandiri dan dengan benar.
        </li>
        <li>
          <strong>Gunakan alat yang menampilkan beberapa zona waktu secara bersamaan.</strong> Jam
          dunia yang menampilkan UTC, setiap waktu lokal anggota tim saat ini, dan offset memudahkan
          pengecekan sekilas tanpa aritmatika mental.{" "}
          <a href="/tools/timezone-converter">BrowseryTools Timezone Converter</a> memungkinkan kamu
          membandingkan beberapa kota sekaligus.
        </li>
        <li>
          <strong>Jadwalkan rapat "tidak nyaman" secara bergantian.</strong> Untuk tim yang
          terdistribusi secara global di mana tidak ada satu waktu pun yang nyaman untuk semua
          orang, rotasikan slot yang tidak nyaman daripada mengharuskan anggota tim yang sama untuk
          selalu bergabung pada jam 7 pagi atau 10 malam. Dokumentasikan rotasi agar transparan.
        </li>
        <li>
          <strong>Hindari penjadwalan mendekati tanggal transisi DST.</strong> Dalam dua minggu
          sekitar akhir Oktober dan akhir Maret, periksa ulang asumsi offset sebelum mengirim
          undangan kepada peserta internasional.
        </li>
      </ul>

      <h2>ISO 8601: Format Datetime yang Menghilangkan Ambiguitas</h2>
      <p>
        ISO 8601 adalah standar internasional untuk merepresentasikan tanggal dan waktu dengan cara
        yang tidak ambigu dan urut dengan benar sebagai teks. Formatnya adalah:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        YYYY-MM-DDTHH:MM:SSZ (atau +HH:MM untuk offset)
      </p>
      <ul>
        <li><code>2026-03-15T14:30:00Z</code> — 15 Maret 2026, pukul 14:30 UTC</li>
        <li><code>2026-03-15T14:30:00+05:30</code> — 15 Maret 2026, pukul 14:30 India Standard Time</li>
        <li><code>2026-03-15T14:30:00-07:00</code> — 15 Maret 2026, pukul 14:30 Mountain Daylight Time</li>
      </ul>
      <p>
        "T" memisahkan tanggal dari waktu. "Z" di akhir berarti UTC (Zulu time). Offset +/- menentukan
        waktu lokal dan seberapa jauh dari UTC.
      </p>
      <p>
        ISO 8601 digunakan di semua API modern, standar web (atribut datetime HTML, header HTTP),
        dan sebagian besar pustaka tanggal bahasa pemrograman. Untuk komunikasi manusia, format
        tanggal "YYYY-MM-DD" — bahkan tanpa komponen waktu — berguna karena urut dengan benar dan
        tidak ambigu secara internasional. "03/04/2026" adalah 3 April di AS dan 4 Maret di UK.
        "2026-03-04" tidak ambigu.
      </p>

      <h2>Penanganan Zona Waktu dalam Kode: Selalu Simpan UTC</h2>
      <p>
        Aturan paling penting untuk developer yang bekerja dengan timestamp:
        <strong> simpan semua timestamp dalam UTC di database-mu.</strong> Selalu. Tanpa pengecualian.
      </p>
      <p>
        Menyimpan timestamp dalam waktu lokal menciptakan kelas bug yang sulit direproduksi, sulit
        didiagnosis, dan mahal diperbaiki pada skala besar:
      </p>
      <ul>
        <li>Ketika server kamu berganti zona waktu (seperti yang terjadi dengan migrasi penyedia cloud), semua timestamp historis tiba-tiba salah</li>
        <li>Transisi DST menciptakan timestamp yang ambigu — pukul 1:30 pagi terjadi dua kali pada hari jam diputar mundur</li>
        <li>Pengurutan acara secara kronologis menjadi tidak andal ketika timestamp mencampur offset yang berbeda</li>
        <li>Query lintas zona waktu (cari semua acara antara tengah malam dan tengah malam) menjadi join yang kompleks daripada query range yang sederhana</li>
      </ul>
      <p>
        Pola yang benar: simpan UTC, tampilkan lokal. Terima input pengguna dalam waktu lokal mereka,
        konversi ke UTC segera, simpan UTC, konversi kembali ke waktu lokal pengguna untuk tampilan.
        Lapisan database tidak perlu mengetahui apa pun tentang zona waktu.
      </p>
      <p>
        Gunakan database zona waktu IANA (database "tz" atau database "Olson") untuk data zona waktu
        dalam kode daripada memelihara offset UTC secara manual. Database IANA diperbarui ketika
        negara mengubah aturan DST atau offset mereka — yang terjadi lebih sering dari yang kamu
        duga. Referensikan zona waktu berdasarkan pengenal IANA (misalnya, "America/New_York",
        "Asia/Jakarta") bukan berdasarkan offset (misalnya, "UTC-5"), karena pengenal menangani
        transisi DST dengan benar sementara offset tetap tidak.
      </p>

      <div style={{background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Konverter Zona Waktu Gratis — Bandingkan Kota, Temukan Overlap
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Konversi waktu di berbagai kota sekaligus, perhitungkan DST secara otomatis,
          dan temukan waktu rapat yang tepat untuk tim jarak jauhmu.
        </p>
        <a
          href="/tools/timezone-converter"
          style={{background: "rgba(139,92,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Konverter Zona Waktu →
        </a>
      </div>
      <ToolCTA slug="timezone-converter" variant="card" />
    </div>
  );
}
