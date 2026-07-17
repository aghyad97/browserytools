import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Buka file log apa pun. Periksa klaim kedaluwarsa token JWT. Cek kolom{" "}
        <code>created_at</code>{" "}
        dalam respons API. Kemungkinan besar, kamu akan menemukan angka seperti{" "}
        <code>1711065600</code> atau <code>1711065600000</code>. Itulah Unix timestamp — sebuah
        bilangan bulat sederhana yang merepresentasikan suatu titik waktu. Memahami cara kerja Unix
        time, asal-usulnya, dan cara menangani jebakan umum yang ada di dalamnya akan
        menyelamatkanmu dari sekelompok bug yang halus, sulit direproduksi, dan kadang memalukan
        di production.
      </p>
      <ToolCTA slug="unix-timestamp" variant="inline" />
      <p>
        Kamu bisa mengkonversi Unix timestamp apa pun ke tanggal yang mudah dibaca (dan sebaliknya)
        menggunakan{" "}
        <a href="/tools/unix-timestamp">BrowseryTools Unix Timestamp Converter</a> — gratis,
        tanpa daftar, semua proses berjalan di browser.
      </p>

      <h2>Apa Itu Unix Timestamp?</h2>
      <p>
        Unix timestamp adalah jumlah detik yang telah berlalu sejak Unix Epoch: tengah malam pada
        1 Januari 1970, Coordinated Universal Time (UTC). Momen ini — 00:00:00 UTC pada
        1970-01-01 — dipilih sebagai titik referensi ketika sistem operasi Unix sedang
        dikembangkan pada awal 1970-an. Ini adalah tanggal yang bulat dan baru-baru ini, yang
        membuat kalkulasi mudah dilakukan pada perangkat keras era itu.
      </p>
      <p>
        Keanggunan Unix time adalah bahwa setiap momen dalam waktu direpresentasikan sebagai satu
        bilangan bulat. Membandingkan dua timestamp hanyalah pengurangan. Memeriksa apakah sesuatu
        sudah kedaluwarsa hanyalah perbandingan. Menambahkan interval hanyalah penjumlahan. Tidak
        ada timezone, tidak ada kalkulasi kalender, tidak ada daylight saving time — hanya sebuah
        angka.
      </p>
      <p>
        Per 2026, Unix timestamp saat ini kira-kira <code>1.774.000.000</code>.
        Setiap detik, angka itu bertambah 1.
      </p>

      <h2>Masalah Y2K38</h2>
      <p>
        Jika Unix time disimpan sebagai bilangan bulat bertanda 32-bit — yang memang demikian di
        banyak implementasi awal — nilai maksimumnya adalah <code>2.147.483.647</code>. Angka itu
        berhubungan dengan 03:14:07 UTC pada 19 Januari 2038. Setelah momen itu, bilangan bulat
        32-bit bertanda akan overflow kembali ke angka negatif besar, dan sistem yang belum
        diperbarui akan menafsirkan timestamp secara keliru.
      </p>
      <p>
        Inilah masalah Year 2038 (Y2K38), setara dengan bug Y2K di era Unix. Sistem modern
        menggunakan bilangan bulat 64-bit untuk timestamp, yang memperpanjang rentang yang dapat
        direpresentasikan hingga sekitar 292 miliar tahun ke segala arah — secara efektif selamanya
        untuk tujuan praktis apa pun. Namun embedded system, database lama dengan kolom timestamp
        32-bit, dan kode C lama yang menggunakan <code>time_t</code> sebagai tipe 32-bit masih
        berisiko.
      </p>

      <h2>Mendapatkan Timestamp Saat Ini</h2>
      <p>
        Berikut cara mendapatkan Unix timestamp saat ini dalam bahasa pemrograman yang paling umum:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — returns milliseconds, divide by 1000 for seconds
const nowMs = Date.now();           // e.g. 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // e.g. 1711065600

// Python
import time
now = int(time.time())  # seconds since epoch

# Using datetime module
from datetime import datetime, timezone
now = int(datetime.now(timezone.utc).timestamp())

// Go
import "time"
now := time.Now().Unix()         // seconds
nowNano := time.Now().UnixNano() // nanoseconds

-- SQL (PostgreSQL)
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- SQL (MySQL)
SELECT UNIX_TIMESTAMP();`}
      </pre>

      <h2>Mengkonversi Timestamp ke Tanggal yang Mudah Dibaca</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — from seconds
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiply by 1000 for ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // locale-formatted date

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: timestamp from integer
SELECT to_timestamp(1711065600);
-- Result: 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Result: 2024-03-22 00:00:00`}
      </pre>

      <h2>Bug Timestamp #1: Milidetik vs Detik</h2>
      <p>
        <code>Date.now()</code> milik JavaScript mengembalikan milidetik. Standar Unix — dan
        hampir setiap bahasa, database, dan API lainnya — menggunakan detik. Ketidakcocokan ini
        adalah sumber bug timestamp yang paling umum.
      </p>
      <p>
        Gejalanya tidak bisa salah: tanggal muncul sebagai 1970 (timestamp dibagi 1000 secara tidak
        sengaja, atau diperlakukan sebagai detik padahal sebenarnya milidetik), atau tanggal muncul
        di tahun 56.000+ (detik diperlakukan sebagai milidetik lalu dibagi lagi). Nilai sekitar{" "}
        <code>1.700.000.000</code> hampir pasti merupakan detik. Nilai sekitar{" "}
        <code>1.700.000.000.000</code> hampir pasti merupakan milidetik.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug: treating seconds as milliseconds — lands in 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct: multiply seconds by 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Defensive helper — handles both seconds and milliseconds
function toDate(ts) {
  // If it's under 10^12, it's seconds; multiply
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Masalah Timezone dengan Timestamp</h2>
      <p>
        Unix timestamp selalu dalam UTC — mereka merepresentasikan satu momen absolut dalam waktu,
        tanpa timezone yang melekat. Pertanyaan timezone hanya muncul di lapisan tampilan, ketika
        kamu mengkonversi timestamp ke format yang mudah dibaca manusia.
      </p>
      <p>
        Kesalahan yang paling umum adalah menggunakan metode timezone lokal tanpa menyadarinya.
        <code>new Date(ts).toLocaleDateString()</code> di JavaScript mengembalikan tanggal dalam
        timezone lokal browser. Jika servermu menghasilkan timestamp pada pukul 23:00 UTC dan
        pengguna di UTC+0 serta pengguna di UTC+1 keduanya menampilkannya, mereka akan melihat
        tanggal kalender yang berbeda. Apakah itu benar tergantung pada kebutuhan produk — tetapi
        itu harus menjadi pilihan yang disengaja, bukan yang tidak disengaja.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Always explicit about timezone — use toISOString() for UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← always UTC

// Or use Intl.DateTimeFormat for locale/timezone display
new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
}).format(date);  // "Friday, March 22, 2024"`}
      </pre>

      <h2>Timestamp di Database</h2>
      <p>
        Database menawarkan dua opsi utama untuk menyimpan tanggal: tipe kolom{" "}
        <code>TIMESTAMP</code> (yang menyimpan momen absolut dalam waktu) dan tipe kolom{" "}
        <code>DATE</code> atau <code>DATETIME</code>{" "}
        (yang menyimpan representasi kalender tanpa timezone bawaan).
      </p>
      <p>
        Untuk kolom seperti <code>created_at</code>, <code>updated_at</code>, dan timestamp event,
        selalu gunakan kolom <code>TIMESTAMP WITH TIME ZONE</code> (atau padanannya di database
        yang kamu gunakan) daripada bilangan bulat biasa. Ini memungkinkan database menangani
        konversi dan perbandingan timezone dengan benar, dan membuat query seperti "event dalam
        24 jam terakhir" akurat terlepas dari pengaturan timezone server.
      </p>
      <p>
        Ketika kamu perlu menyimpan Unix timestamp sebagai bilangan bulat mentah (untuk kompatibilitas
        dengan sistem eksternal atau portabilitas maksimum), dokumentasikan dengan jelas apakah itu
        detik atau milidetik, dan konsistenlah di seluruh skema.
      </p>

      <h2>Timestamp di JWT dan API</h2>
      <p>
        JSON Web Token (JWT) menggunakan Unix timestamp (dalam detik) untuk klaim waktu mereka:
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — issued at: waktu token dibuat</li>
        <li><strong><code>exp</code></strong> — expiry: waktu setelah token tidak boleh diterima</li>
        <li><strong><code>nbf</code></strong> — not before: token tidak boleh digunakan sebelum waktu ini</li>
      </ul>
      <p>
        Memeriksa kedaluwarsa JWT adalah perbandingan sederhana:{" "}
        <code>exp &gt; Math.floor(Date.now() / 1000)</code>.
        Jika waktu saat ini dalam detik lebih besar dari <code>exp</code>, token telah kedaluwarsa.
        Selalu validasi <code>exp</code> di sisi server — jangan hanya mengandalkan pemeriksaan
        kedaluwarsa di sisi klien.
      </p>

      <h2>Referensi Cepat: Konversi Timestamp</h2>
      <p>
        Untuk konversi cepat dan akurat antara Unix timestamp dan tanggal yang mudah dibaca,
        gunakan{" "}
        <a href="/tools/unix-timestamp">BrowseryTools Unix Timestamp Converter</a>. Tempel
        timestamp untuk melihat tanggal UTC dan lokal yang sesuai, atau masukkan tanggal untuk
        mendapatkan timestampnya. Semuanya berjalan di browser — tanpa server, tanpa pelacakan.
      </p>

      <h2>Ringkasan</h2>
      <p>
        Unix timestamp adalah cara universal dan tidak ambigu untuk merepresentasikan momen dalam
        waktu. Aturan utamanya: selalu dalam UTC, selalu dalam detik (kecuali jika kamu berada di
        JavaScript, di mana <code>Date.now()</code> menggunakan milidetik), dan selalu merupakan
        bilangan bulat positif untuk tanggal apa pun setelah 1970. Tangani perbedaan
        milidetik/detik secara eksplisit, gunakan UTC untuk penyimpanan dan transmisi, dan
        konversikan ke waktu lokal hanya di lapisan tampilan.
      </p>
      <ToolCTA slug="unix-timestamp" variant="card" />
    </div>
  );
}
