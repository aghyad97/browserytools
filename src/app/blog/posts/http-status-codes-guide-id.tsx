export default function Content() {
  return (
    <div>
      <p>
        Kode status HTTP adalah bahasa yang digunakan server untuk memberitahu klien apa yang terjadi
        dengan suatu request. Setiap developer selalu menemuinya — di DevTools, dalam respons API,
        di log error, di notifikasi Slack pukul 3 pagi. Mengetahui arti sebenarnya setiap kode,
        kapan menggunakan kode mana di API-mu sendiri, dan apa yang ditandakan oleh kode umum tentang
        sebuah bug akan membuatmu jauh lebih cepat dalam debugging dan membangun layanan yang lebih baik.
      </p>
      <p>
        Kamu bisa mencari kode status HTTP apa pun dengan{" "}
        <a href="/tools/http-status">BrowseryTools HTTP Status Code Reference</a> — gratis, tanpa
        daftar, semuanya berjalan di browsermu.
      </p>

      <h2>Lima Kategori</h2>
      <p>
        Kode status adalah angka tiga digit. Digit pertama mendefinisikan kategorinya:
      </p>
      <ul>
        <li><strong>1xx — Informasional</strong>: Request diterima; pemrosesan berlanjut. Ini jarang ditemukan di sebagian besar aplikasi.</li>
        <li><strong>2xx — Sukses</strong>: Request diterima, dipahami, dan diterima.</li>
        <li><strong>3xx — Redirection</strong>: Tindakan lebih lanjut diperlukan untuk menyelesaikan request. Klien harus mengikuti redirect.</li>
        <li><strong>4xx — Client Error</strong>: Request tidak valid atau tidak diotorisasi. Klien melakukan kesalahan.</li>
        <li><strong>5xx — Server Error</strong>: Server gagal memenuhi request yang valid. Server melakukan kesalahan.</li>
      </ul>
      <p>
        Aturan digit pertama ini penting: jika kamu melihat kode status yang tidak dikenali (seperti{" "}
        <code>429</code>{" "}
        atau <code>451</code>), setidaknya kamu tahu apakah masalahnya ada di sisi klien atau server,
        dan apakah request akhirnya berhasil.
      </p>

      <h2>2xx: Kode Sukses</h2>
      <p>
        Kode ini memberitahu klien bahwa request berhasil. Kode spesifik mengkomunikasikan caranya:
      </p>
      <ul>
        <li>
          <strong>200 OK</strong> — sukses universal. Body respons berisi data yang diminta. Digunakan untuk request GET dan sebagian besar respons yang mengembalikan konten.
        </li>
        <li>
          <strong>201 Created</strong> — resource baru telah dibuat. Harus menyertakan header <code>Location</code> yang menunjuk ke URL resource baru. Gunakan ini untuk request POST yang membuat record, bukan 200.
        </li>
        <li>
          <strong>204 No Content</strong> — request berhasil tetapi tidak ada body untuk dikembalikan. Umum untuk request DELETE dan operasi PATCH/PUT di mana klien tidak membutuhkan data yang diperbarui. Respons tidak boleh menyertakan body.
        </li>
        <li>
          <strong>206 Partial Content</strong> — digunakan dengan range request (header <code>Range</code>). Video player menggunakan ini untuk meminta byte range tertentu dari file media tanpa mengunduh semuanya.
        </li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# REST API design pattern
POST   /api/users        → 201 Created  (body: new user object, Location: /api/users/123)
GET    /api/users/123    → 200 OK       (body: user object)
PATCH  /api/users/123    → 200 OK       (body: updated user) or 204 No Content
DELETE /api/users/123    → 204 No Content`}
      </pre>

      <h2>3xx: Kode Redirect</h2>
      <p>
        Redirect memberitahu klien untuk mencari di tempat lain. Header <code>Location</code> berisi
        URL baru. Perbedaan utama adalah antara redirect permanen dan sementara, serta antara redirect
        yang mempertahankan metode HTTP dan yang mengubahnya.
      </p>
      <ul>
        <li>
          <strong>301 Moved Permanently</strong> — resource memiliki URL permanen baru. Browser dan search engine menyimpannya dalam cache. Browser akan menggunakan GET untuk redirect terlepas dari metode aslinya (keanehan historis). Gunakan ini saat secara permanen mengganti nama URL atau mengalihkan HTTP ke HTTPS.
        </li>
        <li>
          <strong>302 Found</strong> — redirect sementara. Seperti 301, browser mengubah POST menjadi GET pada redirect. Gunakan 302 hanya ketika redirectnya benar-benar sementara.
        </li>
        <li>
          <strong>304 Not Modified</strong> — versi cache masih segar; tidak ada body. Server mengirim ini sebagai respons atas conditional GET (dengan <code>If-None-Match</code> atau <code>If-Modified-Since</code>). Browser menggunakan salinan cache-nya. Penting untuk efisiensi CDN dan pengurangan bandwidth.
        </li>
        <li>
          <strong>307 Temporary Redirect</strong> — seperti 302, tetapi spesifikasi menjamin metode HTTP asli dipertahankan. Jika POST menghasilkan 307, browser akan POST ke URL baru. Gunakan 307 daripada 302 untuk redirect sementara non-GET.
        </li>
        <li>
          <strong>308 Permanent Redirect</strong> — seperti 301, tetapi juga menjamin preservasi metode. Standar modern untuk redirect permanen.
        </li>
      </ul>

      <h2>Kesalahpahaman Umum: 301 vs 302 untuk SEO</h2>
      <p>
        Search engine memperlakukan 301 sebagai sinyal untuk mentransfer "ekuitas tautan" (PageRank)
        dari URL lama ke yang baru dan memperbarui indeks mereka. 302 memberitahu crawler bahwa
        redirect bersifat sementara, sehingga crawler terus mengindeks URL asli. Menggunakan 302
        saat kamu bermaksud 301 dapat menekan manfaat SEO dari redirect. Sebaliknya, menggunakan 301
        saat redirect bersifat sementara menyebabkan search engine menyimpan redirect dalam cache,
        sehingga lebih sulit untuk dibatalkan.
      </p>

      <h2>4xx: Kode Client Error</h2>
      <p>
        Kode ini menunjukkan klien mengirim request yang buruk. Jangan kembalikan 5xx untuk kesalahan
        klien — itu menyesatkan monitoring dan mempersulit identifikasi apakah masalahnya adalah bug
        di servermu atau input buruk dari klien.
      </p>
      <ul>
        <li>
          <strong>400 Bad Request</strong> — request tidak valid. Field yang diperlukan hilang, JSON tidak valid, tipe data salah. Yang paling generik di 4xx; gunakan kode yang lebih spesifik jika tersedia.
        </li>
        <li>
          <strong>401 Unauthorized</strong> — meski namanya demikian, ini berarti "tidak diautentikasi." Klien tidak memberikan kredensial, atau kredensialnya tidak valid. Respons harus menyertakan header <code>WWW-Authenticate</code> yang menunjukkan cara autentikasi. Namanya adalah kesalahan historis — "unauthenticated" akan lebih akurat.
        </li>
        <li>
          <strong>403 Forbidden</strong> — terautentikasi tetapi tidak diotorisasi. Server mengetahui siapa kamu (atau tidak penting siapa kamu) dan kamu tidak memiliki izin. Tidak seperti 401, autentikasi ulang tidak akan membantu. Gunakan 403 ketika pengguna mencoba mengakses resource yang tidak boleh mereka lihat.
        </li>
        <li>
          <strong>404 Not Found</strong> — resource tidak ada di URL ini. Juga dikembalikan ketika server ingin menyembunyikan keberadaan resource dari pengguna yang tidak diotorisasi (mengembalikan 403 akan mengkonfirmasi resource ada; mengembalikan 404 menyembunyikan fakta itu).
        </li>
        <li>
          <strong>409 Conflict</strong> — request bertentangan dengan kondisi resource saat ini. Contoh klasik: mencoba membuat pengguna dengan email yang sudah ada, atau mencoba memperbarui resource menggunakan versi yang sudah usang (konflik optimistic locking).
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> — request secara sintaksis benar (JSON valid, Content-Type benar) tetapi secara semantik tidak valid (field yang diperlukan ada tetapi berisi nilai yang tidak valid, pelanggaran aturan bisnis). Rails mempopulerkan penggunaan 422 untuk error validasi. Lebih spesifik dari 400.
        </li>
        <li>
          <strong>429 Too Many Requests</strong> — batas rate terlampaui. Harus menyertakan header <code>Retry-After</code> yang memberitahu klien berapa lama harus menunggu. Penting untuk API publik mana pun.
        </li>
      </ul>

      <h2>401 vs 403: Perbedaan yang Penting</h2>
      <p>
        Ini adalah salah satu pasangan yang paling sering membingungkan:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`GET /api/admin/users
Authorization: (none)
→ 401 Unauthorized
   "You haven't told me who you are. Log in first."

GET /api/admin/users
Authorization: Bearer <valid-regular-user-token>
→ 403 Forbidden
   "I know who you are. You're not an admin. Access denied."`}
      </pre>

      <h2>5xx: Kode Server Error</h2>
      <ul>
        <li>
          <strong>500 Internal Server Error</strong> — catch-all generik untuk kegagalan server yang tidak terduga. Exception yang tidak tertangani, null reference, query database yang melempar error. Jangan ekspos stack trace ke klien; log di sisi server.
        </li>
        <li>
          <strong>502 Bad Gateway</strong> — server yang bertindak sebagai proxy atau gateway menerima respons tidak valid dari server upstream. Umum ketika load balancer atau reverse proxy tidak dapat menjangkau server aplikasi di belakangnya — aplikasi crash atau tidak mendengarkan di port yang benar.
        </li>
        <li>
          <strong>503 Service Unavailable</strong> — server sementara tidak dapat menangani request. Bisa kelebihan beban, sedang dalam proses deployment, atau sedang maintenance. Harus menyertakan header <code>Retry-After</code> ketika durasi pemadaman diketahui.
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> — proxy atau gateway tidak menerima respons tepat waktu dari server upstream. Upstream berjalan dan merespons, tetapi terlalu lambat. Gejala umum dari query database yang terlalu lama atau panggilan API eksternal yang hang.
        </li>
      </ul>

      <h2>Kode Status dalam Desain REST API</h2>
      <p>
        Menggunakan kode status yang tepat membuat API-mu mendokumentasikan diri sendiri dan lebih
        mudah diintegrasikan. Beberapa panduan:
      </p>
      <ul>
        <li>Jangan pernah mengembalikan 200 dengan objek error di body. Jika request gagal, kode status harus mencerminkan itu. Klien harus bisa memeriksa kode status saja untuk mengetahui apakah mereka perlu menangani error.</li>
        <li>Gunakan 201 dan header <code>Location</code> saat membuat resource melalui POST. Ini memungkinkan klien menemukan URL resource baru tanpa mem-parsing body.</li>
        <li>Kembalikan 422 (bukan 400) untuk error validasi, dan sertakan body error terstruktur yang mengidentifikasi field mana yang gagal dan mengapa.</li>
        <li>Gunakan 409 untuk konflik yang membutuhkan resolusi di level aplikasi, bukan sekadar input buruk.</li>
        <li>Implementasikan 429 dengan rate limiting sejak awal di endpoint apa pun yang menghadap publik — jauh lebih sulit ditambahkan secara retroaktif.</li>
      </ul>

      <h2>Debugging Kode Status di DevTools</h2>
      <p>
        Buka tab Network di DevTools browser dan cari request berwarna merah — itu adalah respons
        4xx atau 5xx. Klik request untuk melihat kode status tepatnya, header respons (berguna untuk{" "}
        <code>WWW-Authenticate</code>, <code>Location</code>, <code>Retry-After</code>), dan body
        respons (yang sering berisi pesan error dari server). Untuk redirect, centang "Preserve log"
        agar panel DevTools tidak terhapus saat halaman navigasi — jika tidak, kamu akan melewatkan
        rantai redirect.
      </p>
      <p>
        Ketika kamu menemukan kode status yang tidak dikenal,{" "}
        <a href="/tools/http-status">BrowseryTools HTTP Status Code Reference</a> memberikan
        deskripsi resmi, RFC asalnya, dan catatan tentang penggunaan umum — tanpa harus meninggalkan
        tab browsermu.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Referensi Kode Status HTTP Gratis — Semua Kode, Sumber RFC, Catatan Penggunaan
        </p>
        <a
          href="/tools/http-status"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Buka Referensi HTTP Status →
        </a>
      </div>
    </div>
  );
}
