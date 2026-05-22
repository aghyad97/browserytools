export default function Content() {
  return (
    <div>
      <p>
        Kamu menemukan pemanggilan API yang kamu butuhkan — tapi ditulis dalam cURL, dan kamu bekerja
        di JavaScript atau Python. Atau kamu membuka DevTools browser, klik kanan pada sebuah request,
        dan memilih &ldquo;Copy as cURL,&rdquo; dan sekarang kamu memiliki tembok flag yang perlu
        diubah menjadi kode nyata. Menerjemahkan cURL secara manual itu ribet: setiap <code>-H</code>,{" "}
        <code>-d</code>, <code>-u</code>, dan <code>-X</code> harus dipetakan ke argumen yang tepat
        dalam bahasamu, dan satu header yang terlewat akan merusak request.
      </p>
      <p>
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> melakukannya secara instan —
        tempel perintah cURL dan dapatkan kode bersih dalam JavaScript <code>fetch</code>, Python{" "}
        <code>requests</code>, Node.js, dan lainnya, semuanya di browsermu tanpa ada yang diunggah.
        Panduan ini menunjukkan pemetaan flag-ke-kode sehingga kamu bisa membaca dan mempercayai
        outputnya.
      </p>

      <h2>Alur Kerja &ldquo;Copy as cURL&rdquo;</h2>
      <p>
        Cara tercepat untuk mendapatkan request yang berfungsi adalah membiarkan browser menuliskannya
        untukmu. Buka DevTools (F12), pergi ke tab <strong>Network</strong>, lakukan aksi yang ingin
        kamu replikasi, lalu klik kanan pada request dan pilih <strong>Copy &rarr; Copy as cURL</strong>.
        Sekarang kamu memiliki perintah cURL dengan header, cookie, dan body yang tepat yang dikirim
        situs nyata. Tempel ke{" "}
        <a href="/tools/curl-converter">konverter</a> dan kamu mendapatkan request yang sama sebagai
        kode yang bisa langsung dimasukkan ke proyekmu.
      </p>

      <h2>Cara Flag cURL Dipetakan ke Kode</h2>
      <p>
        Begitu kamu mengetahui segelintir flag yang penting, kamu bisa membaca perintah cURL apa pun
        dengan sekali lihat:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.8}}>
{`-X POST          ->  the HTTP method
-H "Key: Value"  ->  a request header
-d '{...}'       ->  the request body (implies POST)
-u user:pass     ->  HTTP Basic auth
-F field=value   ->  multipart/form-data upload
-b "name=value"  ->  a cookie
-L               ->  follow redirects`}
      </pre>
      <p>
        Header seperti <code>-H &quot;Authorization: Bearer abc123&quot;</code> menjadi entri dalam
        objek <code>headers</code>. Body yang diteruskan dengan <code>-d</code> menjadi body request,
        dan jika content type-nya JSON akan diserialisasi sesuai. <code>-u user:pass</code> menjadi
        header Basic auth. Mengetahui pemetaan ini adalah yang memungkinkan kamu memeriksa kode yang
        dihasilkan daripada mempercayainya secara buta.
      </p>

      <h2>Request yang Sama dalam Tiga Bahasa</h2>
      <p>
        Ambil contoh POST yang terautentikasi sederhana. Dalam cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>Sebagai JavaScript <code>fetch</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Ada" }),
});`}
      </pre>
      <p>Sebagai Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Perhatikan bagaimana argumen <code>json=</code> Python menetapkan body <em>dan</em> header
        Content-Type secara otomatis — perbedaan idiomatik kecil yang ditangani oleh konverter
        untukmu.
      </p>

      <h2>Kesalahan Umum</h2>
      <p>
        <strong>Quoting dan escaping.</strong> Body cURL dibungkus dalam tanda kutip tunggal di
        shell; ketika berisi JSON dengan tanda kutip ganda, terjemahan manual adalah tempat bug
        masuk. Membiarkan konverter mem-parse-nya menghilangkan risiko tersebut.
      </p>
      <p>
        <strong>POST implisit.</strong> Menggunakan <code>-d</code> membuat request menjadi POST
        bahkan tanpa <code>-X POST</code>. Jika kamu hanya menerjemahkan flag yang terlihat, kamu
        mungkin salah menghasilkan GET.
      </p>
      <p>
        <strong>Rahasia dalam perintah.</strong> Perintah cURL yang disalin sering berisi token
        dan cookie yang aktif. Karena konverter berjalan sepenuhnya di browsermu, rahasia tersebut
        tidak pernah dikirim ke server — tetapi kamu tetap harus membersihkannya sebelum menempelkan
        kode ke repo atau tiket yang dibagikan.
      </p>

      <h2>Pertanyaan yang Sering Diajukan</h2>
      <p>
        <strong>Ke bahasa apa saja saya bisa mengkonversi?</strong> JavaScript fetch, Python requests,
        Node.js, dan target umum lainnya.
      </p>
      <p>
        <strong>Apakah konverter mengirim perintah saya ke mana pun?</strong> Tidak. Parsing dan
        konversi terjadi secara lokal di browsermu, sehingga token apa pun dalam perintah tetap di
        perangkatmu.
      </p>
      <p>
        <strong>Bisakah saya menempelkan &ldquo;Copy as cURL&rdquo; dari DevTools?</strong> Ya —
        itulah salah satu penggunaan terbaik. Ini menangkap header dan body yang tepat dari request nyata.
      </p>
      <p>
        <strong>Apakah gratis?</strong> Ya — tanpa akun, tanpa batas.
      </p>

      <h2>Konversi Sekarang</h2>
      <p>
        Buka <a href="/tools/curl-converter">cURL Converter</a>, tempel perintahmu, dan salin
        kode yang setara. Untuk pandangan lebih dalam tentang sintaks cURL dan pola REST, baca{" "}
        <a href="/blog/curl-converter-guide">panduan konversi request API antar bahasa</a>, dan
        untuk memahami respons yang kamu dapatkan kembali lihat{" "}
        <a href="/blog/http-status-codes-guide">panduan kode status HTTP</a>.
      </p>
    </div>
  );
}
