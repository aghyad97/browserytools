import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Setiap developer pernah mengalaminya. Anda menarik query lambat dari log aplikasi, menyalinnya
        ke editor Anda, dan menatap dinding 300 karakter teks huruf kecil tanpa spasi, tanpa jeda
        baris, dan tanpa ampun. Atau Anda menemukan jawaban Stack Overflow dengan query yang persis
        Anda butuhkan, namun ditulis sebagai satu baris. Atau ORM Anda dengan bermanfaatnya mencatat
        SQL yang dihasilkan — sebagai satu string yang digabungkan. Dalam semua kasus ini, query
        mentahnya secara teknis benar namun secara praktis tidak terbaca.
      </p>
      <ToolCTA slug="sql-formatter" variant="inline" />
      <p>
        Memformat SQL bukan soal estetika. Ini tentang kemampuan memahami apa yang dilakukan suatu
        query secara sekilas — tabel mana yang dibacanya, kondisi mana yang difilternya, dan kolom
        mana yang dikembalikannya. Query yang diformat dengan baik dapat ditinjau, di-debug, dan
        dioptimalkan dalam hitungan menit. Yang tidak diformat bisa membuang waktu berjam-jam.
      </p>
      <p>
        <a href="/tools/sql-formatter">BrowseryTools SQL Formatter</a> memungkinkan Anda menempel
        query SQL apa pun dan langsung memformatnya dengan indentasi yang tepat, kata kunci huruf
        besar, dan pemisahan klausa — semua diproses secara lokal di browser Anda, tanpa query
        yang pernah dikirim ke server.
      </p>

      <h2>Mengapa SQL yang Tidak Diformat Sangat Menyakitkan</h2>
      <p>
        SQL adalah salah satu dari sedikit bahasa di mana developer secara rutin bekerja dengan kode
        yang tidak mereka tulis dan tidak dapat diformat ulang di sumbernya. Pertimbangkan tiga sumber
        SQL yang paling umum jelek:
      </p>
      <ul>
        <li>
          <strong>Query yang dihasilkan ORM.</strong> Hibernate, SQLAlchemy, ActiveRecord, dan
          sejawatnya menghasilkan SQL secara dinamis. Saat Anda mengaktifkan logging query untuk
          men-debug masalah performa, Anda mendapatkan SQL mentah yang dihasilkan — biasanya satu
          baris dengan nilai parameter dinamis, alias seperti <code>t0_</code>, dan kondisi join
          yang butuh beberapa kali baca untuk dipahami.
        </li>
        <li>
          <strong>Log query dari database produksi.</strong> Log query lambat MySQL dan{" "}
          <code>pg_stat_statements</code> PostgreSQL menyimpan query sebagaimana dikirimkan —
          tidak ada pemformatan yang diterapkan. Ini sangat berharga untuk analisis performa namun
          hampir tidak mungkin dibaca tanpa diformat ulang terlebih dahulu.
        </li>
        <li>
          <strong>Satu baris dari Stack Overflow dan dokumentasi.</strong> Kode yang dibagikan
          dalam jawaban dan dokumen sering dipadatkan menjadi satu baris untuk menghemat ruang
          vertikal. Logikanya benar namun tata letaknya mempersulit adaptasi ke skema Anda sendiri.
        </li>
      </ul>

      <h2>Sebelum dan Sesudah: Query yang Sama, Setelah Diformat</h2>
      <p>
        Berikut query realistis sebagaimana mungkin muncul di log query lambat atau output ORM —
        semuanya dalam satu baris dengan kata kunci huruf kecil:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        Setelah diformat dengan konvensi SQL yang konsisten, query yang sama menjadi langsung
        dapat dibaca:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id)  AS order_count,
    SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
    ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY
    u.id,
    u.name,
    u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 20;`}
      </pre>
      <p>
        Strukturnya kini langsung terlihat: Anda bisa melihat bahwa ini adalah laporan pengguna yang
        menarik jumlah pesanan dan total pengeluaran, difilter ke pengguna aktif sejak 2024,
        dikelompokkan berdasarkan pengguna, dan dibatasi hingga 20 pemintas teratas. Itu butuh
        lima detik untuk dipahami — bukan lima menit.
      </p>

      <h2>Konvensi Pemformatan SQL</h2>
      <p>
        Tidak ada satu panduan gaya SQL resmi, namun sekumpulan konvensi yang diterima secara luas
        telah muncul di industri. Mengikutinya membuat SQL Anda dapat dibaca oleh developer mana pun
        yang mengenal bahasa tersebut.
      </p>

      <h3>Kata Kunci Huruf Besar</h3>
      <p>
        Kata kunci SQL — <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code> — harus huruf besar. Nama tabel, nama kolom, alias, dan literal string
        tetap dalam huruf alaminya. Kontras visual antara KATA_KUNCI dan identifier membuat query
        dapat dipindai sekilas.
      </p>

      <h3>Setiap Klausa Utama di Barisnya Sendiri</h3>
      <p>
        Setiap klausa tingkat atas dimulai di baris baru:{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. Ini memberi query kerangka
        visual yang jelas. Saat Anda membuka query yang diformat, mata Anda langsung menemukan setiap
        klausa karena semuanya dimulai di margin kiri (atau di tingkat indentasi yang konsisten).
      </p>

      <h3>Daftar Kolom dan Kondisi yang Diindentasi</h3>
      <p>
        Nama kolom dalam daftar <code>SELECT</code> dan kondisi dalam <code>WHERE</code> diindentasi
        empat spasi (atau satu tab). Setiap <code>AND</code> dan <code>OR</code> dalam klausa{" "}
        <code>WHERE</code> dimulai di barisnya sendiri pada tingkat indentasi yang sama dengan kondisi
        pertama, sehingga mudah untuk menambahkan, menghapus, atau mengkomentari kondisi individual:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Penempatan Koma: Dua Mazhab Pemikiran</h3>
      <p>
        Perdebatan penempatan koma dalam SQL mirip dengan perdebatan trailing-comma dalam JavaScript.
        Ada dua gaya yang sah:
      </p>
      <ul>
        <li>
          <strong>Koma di belakang</strong> (koma di akhir setiap baris): gaya yang paling umum,
          cocok dengan cara kebanyakan developer menulis daftar dalam bahasa lain. Kekurangannya
          adalah mengkomentari item terakhir memerlukan juga penghapusan koma di belakangnya dari
          item di atasnya.
        </li>
        <li>
          <strong>Koma di depan</strong> (koma di awal setiap baris setelah yang pertama):
          memudahkan mengkomentari baris individual mana pun tanpa menyentuh baris yang berdekatan.
          Disukai oleh tim yang sering memodifikasi daftar kolom selama pengembangan.
        </li>
      </ul>
      <p>
        Keduanya valid. Pilih satu dan gunakan secara konsisten dalam proyek. BrowseryTools SQL
        Formatter menggunakan koma di belakang secara default, yang sesuai dengan mayoritas panduan
        gaya dan merupakan konvensi yang paling diharapkan pembaca.
      </p>

      <h3>Alias yang Disejajarkan dengan AS</h3>
      <p>
        Selalu gunakan <code>AS</code> eksplisit untuk alias — jangan pernah menggunakan gaya nama
        telanjang implisit yang diizinkan beberapa dialek (<code>COUNT(o.id) order_count</code>).
        Saat beberapa alias muncul dalam daftar <code>SELECT</code>, menyelaraskan kata kunci{" "}
        <code>AS</code> ke kolom yang sama membuat daftar alias dapat dipindai:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>Cara Membaca Query Kompleks dengan Beberapa JOIN</h2>
      <p>
        Saat Anda menemukan query dengan tiga, empat, atau lima JOIN, jangan mulai dari atas.
        Mulailah dari klausa <code>FROM</code>. Itu memberi tahu Anda tabel utama — jangkar query.
        Setiap <code>JOIN</code> berikutnya menambahkan tabel lain ke set hasil, dan kondisi{" "}
        <code>ON</code> memberi tahu Anda bagaimana baris tabel tersebut berhubungan dengan baris
        yang sudah terakumulasi. Hanya setelah memahami model data dari <code>FROM</code> dan{" "}
        <code>JOIN</code> barulah Anda kembali ke <code>SELECT</code> untuk melihat kolom yang
        dikembalikan, lalu <code>WHERE</code> untuk pemfilteran, lalu <code>GROUP BY</code>
        untuk agregasi.
      </p>
      <p>
        Urutan membaca untuk query SELECT apa pun:{" "}
        <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        Ini cocok dengan urutan pemrosesan klausa yang sebenarnya oleh mesin database, dan memetakan
        cara Anda harus memikirkan data yang mengalir melalui setiap langkah.
      </p>

      <h2>Pemformatan Subquery</h2>
      <p>
        Subquery — query yang bersarang di dalam query lain — layak mendapatkan tingkat indentasinya
        sendiri. Setiap tingkat sarang menambahkan satu tingkat indentasi, sehingga strukturnya tetap
        jelas bahkan dengan dua atau tiga tingkat kedalaman:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email
FROM users AS u
WHERE u.id IN (
    SELECT DISTINCT o.user_id
    FROM orders AS o
    WHERE o.total > 500
      AND o.created_at >= '2024-01-01'
)
ORDER BY u.name;`}
      </pre>
      <p>
        Query dalam jelas subordinat terhadap query luar. Kurung tutup disejajarkan dengan kata kunci
        (<code>WHERE</code>) yang memperkenalkan subquery. Untuk subquery yang sangat bersarang atau
        kompleks, CTE (Common Table Expressions) hampir selalu lebih disukai karena dapat diberi nama
        dan ditempatkan di bagian atas query di mana mudah dibaca.
      </p>

      <h2>Pola Query Umum dan Bentuk yang Diformat</h2>

      <h3>INSERT INTO ... SELECT</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`INSERT INTO order_archive (
    id,
    user_id,
    total,
    created_at
)
SELECT
    id,
    user_id,
    total,
    created_at
FROM orders
WHERE created_at < '2023-01-01';`}
      </pre>

      <h3>UPDATE dengan JOIN (sintaks MySQL / SQL Server)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>Query WITH (CTE)</h3>
      <p>
        Common Table Expressions adalah alat pemformatan yang paling kuat dalam SQL. Mereka memungkinkan
        Anda memberi nama pada set hasil antara, mengubah query yang sangat bersarang menjadi serangkaian
        langkah yang diberi nama dengan jelas:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
      AND created_at >= '2024-01-01'
),
user_orders AS (
    SELECT
        user_id,
        COUNT(id)  AS order_count,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
)
SELECT
    au.id,
    au.name,
    au.email,
    uo.order_count,
    uo.total_spent
FROM active_users AS au
LEFT JOIN user_orders AS uo
    ON au.id = uo.user_id
ORDER BY uo.total_spent DESC
LIMIT 20;`}
      </pre>

      <h2>Mengapa Pemformatan Penting untuk Tinjauan Performa</h2>
      <p>
        Pemformatan bukan hanya soal keterbacaan bagi manusia — ini juga membuat masalah performa
        terlihat. Setelah query ditata dengan benar, beberapa kelas masalah menjadi mudah ditemukan:
      </p>
      <ul>
        <li>
          <strong>Indeks yang hilang.</strong> Klausa <code>WHERE</code> yang diformat dengan semua
          kondisi di barisnya masing-masing memudahkan pemeriksaan bahwa setiap kolom kondisi
          memiliki indeks. Tanpa format, kondisi yang terkubur dalam satu baris mudah terlewat.
        </li>
        <li>
          <strong>Produk Cartesian.</strong> Sebuah <code>JOIN</code> tanpa klausa <code>ON</code>{" "}
          (atau dengan kondisi yang selalu benar) menghasilkan cross-join yang mengalikan jumlah
          baris. Ketika setiap <code>JOIN</code> berada di barisnya sendiri dengan kondisi{" "}
          <code>ON</code> yang diindentasi di bawahnya, kondisi yang hilang langsung terlihat.
        </li>
        <li>
          <strong>Pola query N+1.</strong> Melihat query yang memilih daftar ID dalam subquery
          kemudian join kembali ke tabel yang sama adalah sinyal bahwa query dapat ditulis ulang
          dengan join langsung — menghilangkan N+1 di level SQL daripada dalam kode aplikasi.
        </li>
        <li>
          <strong>Fungsi pada kolom terindeks.</strong>{" "}
          <code>WHERE DATE(created_at) = '2024-01-01'</code>{" "}
          mencegah database menggunakan indeks pada <code>created_at</code>. Dalam query yang
          diformat pola ini terlihat jelas; dalam satu baris yang dipadatkan tidak terlihat sama sekali.
        </li>
      </ul>

      <h2>Dialek SQL: Perbedaan Sintaks yang Perlu Diketahui</h2>
      <p>
        SQL adalah standar (ISO/IEC 9075), namun setiap database utama memperluasnya dengan sintaks
        khusus dialek. Berikut yang penting untuk pemformatan:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Database</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kutipan identifier</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Perbedaan penting</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"double_quotes"</code></td>
              <td style={{padding: "10px 16px"}}>Identifier sensitif huruf saat dikutip ganda; <code>ILIKE</code> untuk pencocokan tidak sensitif huruf; klausa <code>RETURNING</code> pada INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`backtick`</code></td>
              <td style={{padding: "10px 16px"}}>Tidak sensitif huruf secara default; sintaks <code>LIMIT offset, count</code>; <code>GROUP BY</code> secara historis mengizinkan kolom non-agregat</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"double_quotes"</code> atau <code>[brackets]</code></td>
              <td style={{padding: "10px 16px"}}>Sistem tipe permisif; tidak ada <code>RIGHT JOIN</code> atau <code>FULL OUTER JOIN</code> di versi lama; pernyataan <code>PRAGMA</code> untuk info skema</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[square_brackets]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> sebagai ganti <code>LIMIT</code>; petunjuk <code>NOLOCK</code>; <code>GETDATE()</code> sebagai ganti <code>NOW()</code>; <code>ISNULL()</code> sebagai ganti <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL: Kutip Ganda dan Sensitivitas Huruf</h3>
      <p>
        Di PostgreSQL, identifier tanpa kutipan dilipat ke huruf kecil. Jika Anda membuat tabel sebagai{" "}
        <code>CREATE TABLE "UserProfiles"</code> (dengan kutip ganda), Anda selalu harus merujuknya
        sebagai <code>"UserProfiles"</code> dengan kutipan. Tanpa kutipan, PostgreSQL mencari{" "}
        <code>userprofiles</code> dan gagal. Ini adalah sumber kebingungan umum saat bermigrasi dari
        MySQL atau saat ORM menghasilkan skema dengan nama campuran huruf besar-kecil.
      </p>

      <h3>MySQL: Kutipan Backtick</h3>
      <p>
        MySQL menggunakan backtick untuk mengutip identifier, bukan kutip ganda (meskipun MySQL dalam
        mode <code>ANSI_QUOTES</code> menerima kutip ganda). Anda akan melihat backtick dalam DDL
        yang dihasilkan MySQL dan dalam query yang diekspor oleh alat seperti phpMyAdmin. SQL Formatter
        menangani identifier yang dikutip backtick dan mempertahankannya sehingga output tetap valid
        untuk database spesifik Anda.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Tip — selalu tentukan dialek Anda:</strong> Saat menempel query ke dalam formatter,
        pilih dialek SQL yang benar. MySQL dan PostgreSQL memiliki sintaks yang sedikit berbeda yang
        mempengaruhi cara formatter menangani konstruksi tertentu, terutama seputar <code>GROUP BY</code>,
        window function, dan fungsi string.
      </div>

      <h2>Cara Menggunakan BrowseryTools SQL Formatter</h2>
      <p>
        Menggunakan formatter hanya tiga langkah:
      </p>
      <ul>
        <li>
          <strong>Tempel query Anda.</strong> Salin SQL mentah dari file log, output ORM, atau editor
          Anda dan tempelkan ke area input. Formatter menerima SQL dalam jumlah berapa pun —
          pernyataan tunggal, beberapa pernyataan, atau skrip penuh.
        </li>
        <li>
          <strong>Klik Format.</strong> Formatter menerapkan kata kunci huruf besar, pemisahan klausa,
          indentasi, dan spasi yang konsisten. Hasilnya muncul di panel output secara instan —
          tidak ada permintaan jaringan dan tidak ada penundaan.
        </li>
        <li>
          <strong>Salin hasilnya.</strong> Gunakan tombol Salin untuk menaruh SQL yang telah diformat
          di clipboard Anda, siap untuk ditempel ke editor, klien database, atau PR Anda.
        </li>
      </ul>
      <p>
        Karena formatter berjalan sepenuhnya di browser Anda, Anda dapat dengan aman menempel query
        yang berisi data sensitif — nama tabel produksi, ID pelanggan, detail skema internal —
        tanpa ada yang meninggalkan mesin Anda. Tidak ada backend yang mencatat query Anda.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Query Anda tetap privat:</strong> Query SQL sering mengandung detail skema, logika
        bisnis, dan data yang tidak boleh meninggalkan lingkungan Anda. BrowseryTools SQL Formatter
        berjalan 100% di browser Anda — query Anda tidak pernah dikirim ke server mana pun, tidak
        pernah dicatat, dan tidak pernah disimpan. Tempel query produksi dengan percaya diri.
      </div>

      <h2>Format Query SQL Anda Sekarang</h2>
      <p>
        Baik Anda sedang mengurai query monster yang dihasilkan ORM, meninjau pull request rekan kerja,
        men-debug query lambat, atau sekadar mencoba memahami apa yang sebenarnya dilakukan jawaban
        Stack Overflow — SQL yang diformat membuat setiap tugas ini lebih cepat dan lebih sedikit
        rawan kesalahan. Pemformatan yang baik adalah optimisasi performa paling murah yang bisa
        Anda lakukan sebelum menggunakan EXPLAIN.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          SQL Formatter Gratis — Instan, Privat, Tanpa Pendaftaran
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Tempel query SQL apa pun dan format dengan indentasi yang tepat serta kata kunci huruf besar
          dalam satu klik. Tidak ada yang meninggalkan browser Anda.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka SQL Formatter →
        </a>
      </div>
      <ToolCTA slug="sql-formatter" variant="card" />
    </div>
  );
}
