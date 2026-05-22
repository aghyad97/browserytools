export default function Content() {
  return (
    <div>
      <p>
        Perbedaan antara respons AI yang biasa-biasa saja dan yang benar-benar berguna jarang tentang
        kemampuan model — hampir selalu tentang bagaimana prompt ditulis. Struktur, kejelasan, dan
        tanda pemformatan yang tepat dapat mengubah output yang samar dan bertele-tele menjadi jawaban
        yang tepat dan dapat ditindaklanjuti. Jika Anda pernah merasa alat AI tidak memenuhi potensinya,
        format prompt Anda adalah hal pertama yang layak diperiksa.
      </p>
      <p>
        Anda dapat menggunakan{" "}
        <a href="/tools/prompt-formatter">BrowseryTools Prompt Formatter</a> — gratis, tanpa pendaftaran,
        semuanya tetap di browser Anda — untuk membersihkan, merestrukturisasi, dan menyempurnakan
        prompt Anda sebelum mengirimnya ke model AI mana pun.
      </p>

      <h2>Mengapa Pemformatan Lebih Penting dari yang Anda Kira</h2>
      <p>
        Language model tidak membaca prompt seperti manusia memindai pesan. Mereka memproses token
        secara berurutan dan peka terhadap cara instruksi dirumuskan, diurutkan, dan dipisahkan. Prompt
        yang ditulis sebagai paragraf panjang dan tidak terputus mengubur instruksi terpenting di tengah —
        tepat di mana kemungkinan terkecil untuk mempengaruhi output. Prompt yang diformat dengan baik
        menempatkan batasan dan tujuan di depan, menggunakan pembatas yang jelas antar bagian, dan
        memberi sinyal format output yang diharapkan secara eksplisit.
      </p>
      <p>
        Bayangkan pemformatan prompt seperti menulis brief untuk kontraktor. Semakin tepat Anda
        menentukan deliverable, batasan, dan konteks, semakin dekat draf pertama dengan apa yang
        sebenarnya Anda butuhkan.
      </p>

      <h2>Teknik 1: Penugasan Peran</h2>
      <p>
        Salah satu teknik pemformatan yang paling efektif adalah memberi model peran sebelum tugas
        sebenarnya. Ini mengaktifkan register dan sekumpulan konvensi spesifik yang diasosiasikan model
        dengan peran tersebut, menghasilkan output yang lebih konsisten.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Tanpa peran:
"Jelaskan cara menulis README yang baik."

✅ Dengan peran:
"Anda adalah senior maintainer open-source yang meninjau ratusan repositori.
Jelaskan cara menulis README yang mengkomunikasikan nilai proyek dengan jelas
kepada pembaca teknis maupun non-teknis."`}
      </pre>
      <p>
        Pembingkaian peran tidak membatasi model — melainkan memfokuskannya. Anda mendapatkan tulisan
        yang cocok dengan standar dan kosakata persona tersebut, bukan gambaran umum yang generik.
      </p>

      <h2>Teknik 2: Blok Instruksi yang Jelas</h2>
      <p>
        Pisahkan deskripsi tugas, konteks, dan batasan Anda menjadi bagian-bagian yang berbeda. Header
        Markdown dan pembatas triple-backtick bekerja dengan baik di sini. Banyak model telah dilatih
        pada dokumen dengan struktur ini dan merespons dengan baik terhadapnya.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Tugas
Rangkum umpan balik pelanggan berikut menjadi tiga prioritas produk yang dapat ditindaklanjuti.

## Konteks
Ini adalah umpan balik dari pengguna B2B SaaS yang dikumpulkan selama Q4 2025. Audiens untuk
ringkasan ini adalah manajer produk yang mempersiapkan sesi perencanaan sprint.

## Batasan
- Maksimal 150 kata total
- Gunakan poin-poin bullet
- Jangan sertakan kutipan langsung

## Input
"""
[umpan balik pelanggan di sini]
"""`}
      </pre>
      <p>
        Bagian-bagian berlabel membuatnya langsung jelas apa yang ada di mana. Anda dapat menyesuaikan
        konteks atau batasan secara independen tanpa menulis ulang seluruh prompt.
      </p>

      <h2>Teknik 3: Contoh Few-Shot</h2>
      <p>
        Jika Anda membutuhkan output dalam gaya atau format tertentu, teknik paling andal adalah
        menyertakan satu atau dua contoh dari apa yang Anda inginkan. Ini disebut few-shot prompting
        dan secara konsisten mengungguli deskripsi verbal panjang dari format yang diinginkan.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Ubah permintaan fitur mentah menjadi user story menggunakan format berikut.

Contoh input: "Pengguna ingin mengekspor data ke CSV"
Contoh output: "Sebagai analis data, saya ingin mengekspor data dashboard saya ke CSV
agar saya dapat melakukan analisis kustom di alat spreadsheet."

Sekarang ubah: "Pengguna ingin diberi tahu ketika laporan sudah siap"`}
      </pre>
      <p>
        Perhatikan bahwa contoh mendefinisikan baik struktur ("Sebagai... saya ingin... agar...") maupun
        tingkat spesifisitas yang diharapkan. Anda tidak perlu menjelaskan format dalam prosa — contoh
        menunjukkannya.
      </p>

      <h2>Teknik 4: Chain-of-Thought Prompting</h2>
      <p>
        Untuk tugas penalaran — debugging, analisis, perhitungan, pengambilan keputusan — secara eksplisit
        meminta model untuk berpikir langkah demi langkah sebelum memberikan jawaban akhir secara dramatis
        meningkatkan akurasi. Ini bukan trik: ini mengubah cara model mengalokasikan komputasi internalnya
        selama pembuatan.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Tanpa chain-of-thought:
"Apa database terbaik untuk game multiplayer real-time?"

✅ Dengan chain-of-thought:
"Apa database terbaik untuk game multiplayer real-time?
Pikirkan persyaratannya langkah demi langkah — latensi, model konkurensi,
struktur data, jaminan konsistensi — sebelum memberikan rekomendasi Anda."`}
      </pre>
      <p>
        Instruksi langkah-demi-langkah memunculkan penalaran perantara yang dapat Anda evaluasi. Anda
        juga jauh lebih mungkin menangkap kesalahan ketika Anda dapat melihat rantai penalaran daripada
        hanya kesimpulan.
      </p>

      <h2>Teknik 5: Prompt Terstruktur XML dan JSON</h2>
      <p>
        Ketika Anda membutuhkan output itu sendiri terstruktur — objek JSON, tabel, skema tertentu —
        jadikan format output eksplisit dan gunakan struktur yang cocok dalam prompt. Claude dan GPT-4
        merespons dengan sangat baik terhadap bagian berlabel XML.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Ekstrak kolom-kolom berikut dari deskripsi pekerjaan di bawah ini.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[teks deskripsi pekerjaan di sini]
</input>`}
      </pre>
      <p>
        Tag XML bertindak sebagai pembatas yang tidak ambigu. Model mengetahui dengan tepat di mana
        instruksinya berakhir dan di mana data input dimulai, mengurangi risiko model memperlakukan
        instruksi Anda sebagai bagian dari konten yang akan diproses.
      </p>

      <h2>Kesalahan Umum Pemformatan Prompt</h2>
      <ul>
        <li><strong>Mengubur instruksi utama</strong> — Letakkan apa yang Anda inginkan model lakukan di awal, bukan setelah tiga paragraf konteks. Model memberi bobot lebih pada token yang lebih awal.</li>
        <li><strong>Batasan yang bertentangan</strong> — "Jadilah ringkas tapi bahas setiap detail" memaksa model membuat pertimbangan yang sewenang-wenang. Tentukan mana yang lebih penting.</li>
        <li><strong>Mengasumsikan konteks bersama</strong> — Model tidak memiliki memori sesi sebelumnya Anda. Sertakan semua konteks yang relevan dalam prompt itu sendiri.</li>
        <li><strong>Tidak ada format output yang ditentukan</strong> — Jika Anda membutuhkan daftar, katakan daftar. Jika Anda membutuhkan JSON, katakan JSON. Jika Anda membutuhkan respons di bawah 200 kata, katakan itu. Format yang tidak ditentukan = output yang tidak dapat diprediksi.</li>
        <li><strong>Aturan gaya yang terlalu ditentukan</strong> — Daftar panjang instruksi negatif ("jangan lakukan X, jangan pernah katakan Y") menghabiskan konteks dan sering menghasilkan output yang kaku dan canggung. Satu atau dua batasan kuat mengungguli sepuluh yang lemah.</li>
      </ul>

      <h2>Sebelum dan Sesudah: Permintaan yang Sama, Diformat Ulang</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sebelum:
"Bisakah Anda membantu saya menulis email ke bos saya tentang keterlambatan proyek?
Kami seharusnya meluncurkan integrasi pembayaran baru hari Jumat lalu tapi
API pihak ketiga mengalami beberapa masalah dan sekarang kami melihat mungkin
Rabu atau Kamis depan, bisakah Anda membuatnya profesional?"

✅ Sesudah:
Anda adalah komunikator bisnis berpengalaman.

## Tugas
Tulis email notifikasi keterlambatan profesional dari seorang developer kepada manajer mereka.

## Konteks
- Proyek: integrasi payment gateway
- Tenggat asli: hari Jumat lalu
- Perkiraan baru: Rabu atau Kamis minggu ini
- Penyebab: masalah dengan API pihak ketiga (bukan kesalahan tim kami)

## Nada
Profesional, langsung, dan berfokus pada solusi — tidak defensif atau meminta maaf berlebihan

## Output
Baris subjek + isi email, di bawah 150 kata`}
      </pre>
      <p>
        Versi yang diformat ulang membutuhkan 20 detik ekstra untuk ditulis dan menghasilkan output
        yang langsung dapat digunakan, daripada memerlukan dua atau tiga koreksi lanjutan.
      </p>

      <h2>Menggunakan Prompt Formatter</h2>
      <p>
        <a href="/tools/prompt-formatter">BrowseryTools Prompt Formatter</a> membantu Anda menerapkan
        teknik-teknik ini tanpa harus mengingat setiap aturan. Tempel prompt mentah Anda, pilih
        struktur yang sesuai dengan kasus penggunaan Anda, dan dapatkan versi yang bersih dan
        terorganisir dengan baik yang siap dikirim ke ChatGPT, Claude, Gemini, atau model apa pun.
        Tidak diperlukan akun, dan prompt Anda tidak pernah meninggalkan browser Anda.
      </p>

      <h2>Ringkasan</h2>
      <p>
        Pemformatan prompt adalah keterampilan yang dapat dipelajari dengan hasil yang terukur. Penugasan
        peran memfokuskan model, jeda bagian yang jelas menghilangkan ambiguitas, contoh few-shot
        mendefinisikan format yang Anda harapkan, dan batasan output eksplisit menghilangkan dugaan.
        Prompt terbaik bukan yang paling rumit — melainkan yang paling sedikit meninggalkan pertanyaan
        yang tidak terjawab sebelum pembuatan dimulai.
      </p>
    </div>
  );
}
