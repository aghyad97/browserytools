import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Markdown ada di mana-mana. Ini adalah format penulisan default di GitHub, tulang punggung
        sebagian besar static site generator, bahasa native alat seperti Obsidian dan Notion, dan
        format yang dijangkau developer saat menulis README, dokumentasi, dan catatan teknis.
        Meskipun ada di mana-mana, banyak penulis dan developer hanya mempelajari dasar-dasarnya —
        tebal, miring, dan beberapa level heading — dan melewatkan fitur yang membuat Markdown
        benar-benar kuat untuk penulisan terstruktur.
      </p>
      <ToolCTA slug="markdown-editor" variant="inline" />
      <p>
        Kamu bisa menulis dan mempratinjau Markdown secara instan menggunakan{" "}
        <a href="/tools/markdown-editor">BrowseryTools Markdown Editor</a> — gratis, tanpa daftar,
        semuanya tetap di browsermu.
      </p>

      <h2>Siapa yang Membuat Markdown dan Mengapa</h2>
      <p>
        Markdown dibuat oleh John Gruber, bekerja sama dengan Aaron Swartz, dan dirilis pada 2004.
        Tujuan yang dinyatakan Gruber adalah membuat format penulisan plain-text yang dapat dibaca
        apa adanya — sebelum rendering apa pun — dan yang dikonversi dengan bersih ke HTML yang
        valid. Namanya adalah permainan kata dari "markup language" (HTML adalah HyperText Markup
        Language), membalik konsepnya: alih-alih menambahkan sintaksis untuk mengontrol pemformatan,
        Markdown menggunakan kebiasaan tanda baca alami yang sudah dikembangkan orang dalam email
        plain-text.
      </p>
      <p>
        Motivasinya bersifat praktis. HTML bertele-tele dan mengganggu untuk ditulis secara inline.
        Kalimat seperti{" "}
        <code> &lt;p&gt;This is &lt;strong&gt;important&lt;/strong&gt; text.&lt;/p&gt;</code>{" "}
        membutuhkan overhead mental yang signifikan dibandingkan{" "}
        <code>This is **important** text.</code> Gruber ingin blogger dan penulis fokus pada kata,
        bukan tag. Spesifikasi Markdown asli adalah skrip Perl yang mengkonversi file Markdown
        plain-text ke HTML.
      </p>

      <h2>Sintaksis Dasar</h2>
      <p>
        Sintaksis Markdown inti mencakup semua yang dibutuhkan sebagian besar penulis untuk
        dokumen terstruktur.
      </p>

      <h3>Heading</h3>
      <p>
        Gunakan tanda pagar untuk membuat heading. Satu tanda pagar untuk H1, dua untuk H2, hingga
        enam untuk H6. Sebagian besar panduan gaya merekomendasikan hanya satu H1 per dokumen
        (biasanya judul) dan menggunakan H2–H4 untuk hierarki konten.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Heading 1
## Heading 2
### Heading 3
#### Heading 4`}
      </pre>

      <h3>Penekanan dan Tebal</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`*italic* or _italic_
**bold** or __bold__
***bold and italic***
~~strikethrough~~`}
      </pre>

      <h3>Tautan dan Gambar</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`[Link text](https://example.com)
[Link with title](https://example.com "Page title")
![Alt text](image.png)
![Alt text](image.png "Image title")`}
      </pre>

      <h3>Daftar</h3>
      <p>
        Daftar tak berurut menggunakan tanda hubung, asterisk, atau tanda tambah. Daftar berurut
        menggunakan angka diikuti titik. Item yang diindentasi (2 atau 4 spasi) membuat daftar
        bersarang.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- Unordered item
- Another item
  - Nested item

1. First
2. Second
3. Third`}
      </pre>

      <h3>Kode</h3>
      <p>
        Kode inline menggunakan backtick tunggal. Blok kode berpagar menggunakan backtick tiga
        kali lipat dengan identifier bahasa opsional untuk syntax highlighting.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Use \`console.log()\` for debugging.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``}
      </pre>

      <h3>Blockquote</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes work too.`}
      </pre>

      <h3>Garis Horizontal</h3>
      <p>
        Tiga atau lebih tanda hubung, asterisk, atau garis bawah pada satu baris sendiri membuat
        garis horizontal.{" "}
        <code>---</code> adalah konvensi yang paling umum.
      </p>

      <h2>Sintaksis yang Diperluas</h2>
      <p>
        Spesifikasi Markdown asli melewatkan beberapa fitur yang sering dibutuhkan penulis.
        Sintaksis yang diperluas, didukung oleh sebagian besar prosesor modern, menambahkan
        kemampuan ini.
      </p>

      <h3>Tabel</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`| Column 1  | Column 2  | Column 3  |
|-----------|:---------:|----------:|
| Left      | Center    | Right     |
| aligned   | aligned   | aligned   |`}
      </pre>
      <p>
        Posisi titik dua di baris pemisah mengontrol perataan: kiri (default), tengah (titik dua
        di kedua sisi), atau kanan (titik dua di kanan).
      </p>

      <h3>Daftar Tugas</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- [x] Write first draft
- [x] Peer review
- [ ] Final edits
- [ ] Publish`}
      </pre>

      <h3>Catatan Kaki</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Here is a claim that needs a citation.[^1]

[^1]: The supporting source or explanation goes here.`}
      </pre>

      <h2>Varian Markdown: CommonMark, GFM, dan MDX</h2>
      <p>
        Spesifikasi Markdown asli memiliki ambiguitas — tempat di mana prosesor membuat keputusan
        berbeda tentang kasus tepi. Ini menghasilkan implementasi yang tidak kompatibel di berbagai
        alat. Beberapa upaya standardisasi muncul untuk menyelesaikan ini.
      </p>
      <ul>
        <li>
          <strong>CommonMark</strong> — spesifikasi ketat yang menyelesaikan setiap ambiguitas
          dalam spesifikasi Markdown asli dengan suite pengujian formal. Diadopsi oleh Discourse,
          Reddit, Stack Overflow, dan banyak lainnya. Varian yang paling dapat dioperasikan.
        </li>
        <li>
          <strong>GitHub Flavored Markdown (GFM)</strong> — ekstensi GitHub dari CommonMark yang
          menambahkan tabel, daftar tugas, strikethrough, autolink, dan URL literal. Jika kamu
          menulis file README atau komentar GitHub, kamu menggunakan GFM.
        </li>
        <li>
          <strong>MDX</strong> — Markdown yang diperluas dengan dukungan komponen JSX, digunakan
          secara luas di situs dokumentasi berbasis React (docs Next.js, Docusaurus, Astro).
          Memungkinkan mengimport dan menyematkan komponen React langsung di file Markdown.
        </li>
        <li>
          <strong>MultiMarkdown / Pandoc Markdown</strong> — ekstensi kaya fitur untuk penulisan
          akademis, dengan dukungan untuk kutipan, persamaan matematika (LaTeX), dan pemformatan
          tabel yang kompleks.
        </li>
      </ul>

      <h2>Di Mana Markdown Digunakan</h2>
      <ul>
        <li><strong>GitHub dan GitLab</strong> — file README, issues, pull request, wiki, dan komentar semuanya merender Markdown</li>
        <li><strong>Notion</strong> — mendukung impor/ekspor Markdown dan subset pintasan Markdown untuk pemformatan inline</li>
        <li><strong>Obsidian</strong> — aplikasi manajemen pengetahuan yang sepenuhnya dibangun di atas file Markdown dengan ekstensi wikilink</li>
        <li><strong>Static site generator</strong> — Jekyll, Hugo, Gatsby, Astro, dan Next.js semuanya menggunakan Markdown atau MDX sebagai format konten default</li>
        <li><strong>Platform dokumentasi</strong> — ReadTheDocs, GitBook, dan Docusaurus dibangun di sekitar Markdown</li>
        <li><strong>Platform chat</strong> — Slack, Discord, dan Teams mendukung subset Markdown untuk pemformatan pesan</li>
        <li><strong>Klien email</strong> — beberapa klien (Superhuman, HEY) mendukung input Markdown</li>
      </ul>

      <h2>Markdown vs Editor Rich Text</h2>
      <p>
        Editor rich text (WYSIWYG — What You See Is What You Get) seperti Google Docs, Microsoft
        Word, atau editor bawaan Contentful menampilkan output yang diformat saat kamu mengetik.
        Markdown menampilkan sumber mentah. Trade-off-nya nyata.
      </p>
      <ul>
        <li><strong>Keunggulan Markdown</strong> — file plain-text, bekerja di editor mana pun, dapat dikontrol versi dengan git, tidak ada vendor lock-in, alur kerja cepat hanya dengan keyboard</li>
        <li><strong>Keunggulan rich text</strong> — langsung visual, tidak ada sintaksis yang perlu dipelajari, lebih mudah bagi kontributor non-teknis, lebih baik untuk pemformatan kompleks (catatan kaki, komentar, perubahan yang dilacak)</li>
      </ul>
      <p>
        Untuk penulisan teknis, dokumentasi developer, dan manajemen pengetahuan pribadi,
        portabilitas dan kompatibilitas version-control Markdown menjadikannya pilihan yang lebih
        baik. Untuk dokumen bisnis kolaboratif atau konten dengan persyaratan pemformatan kompleks,
        editor rich text seringkali lebih praktis.
      </p>

      <h2>Kesalahan Markdown yang Umum</h2>
      <ul>
        <li><strong>Baris kosong yang hilang</strong> — sebagian besar elemen blok (heading, daftar, blok kode) memerlukan baris kosong sebelum dan sesudahnya untuk dirender dengan benar</li>
        <li><strong>Spasi setelah tanda pagar</strong> — <code>##Heading</code> tanpa spasi setelah tanda pagar bukan heading di sebagian besar prosesor</li>
        <li><strong>Penanda daftar yang tidak konsisten</strong> — mencampur <code>-</code> dan <code>*</code> dalam daftar yang sama dapat menghasilkan hasil yang tidak terduga di beberapa prosesor</li>
        <li><strong>Lupa escape karakter khusus</strong> — asterisk, garis bawah, dan backtick di dalam teks memerlukan escape backslash jika harus dirender secara literal</li>
        <li><strong>Mengasumsikan sintaksis yang diperluas bersifat universal</strong> — tabel dan daftar tugas adalah fitur GFM yang tidak didukung semua prosesor; periksa lingkungan targetmu</li>
      </ul>
      <p>
        <a href="/tools/markdown-editor">BrowseryTools Markdown Editor</a> menyediakan pratinjau
        langsung sehingga kamu dapat menemukan masalah rendering segera saat menulis, tanpa menyalin
        teks ke alat lain. Tempel Markdown-mu dan lihat output HTML yang dirender berdampingan.
      </p>
      <ToolCTA slug="markdown-editor" variant="card" />
    </div>
  );
}
