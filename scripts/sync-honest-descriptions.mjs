import { readFileSync, writeFileSync } from "node:fs";

/**
 * Task 10 (audit §4.1) — sync honest tool descriptions across all 9 locales.
 *
 * Updates `ToolsConfig.tools.<slug>.{name,description}` for the six tools whose
 * copy overclaimed features the code does not have, and adds the new
 * `Tools.AudioEditor.downloadOriginal` button label (the Audio Editor now only
 * plays/downloads the original file — no editing).
 *
 * Only file-converter changes its `name` ("File Converter" -> "Data Format
 * Converter"); the other five keep their existing localized names.
 *
 * NOTE: the Arabic (ar) strings must be reviewed by a native speaker before
 * merge — flag this in the PR description.
 */

const BY_LOCALE = {
  en: {
    tools: {
      pdf: {
        description:
          "Merge PDFs, split or extract pages, and turn images into a PDF — all in your browser with no file size limits.",
      },
      zip: {
        description:
          "Create ZIP archives from your files and extract existing ones, right in your browser.",
      },
      spreadsheet: {
        description:
          "View CSV and Excel files in your browser: sort, search, chart a column, and export the filtered view to CSV.",
      },
      "file-converter": {
        name: "Data Format Converter",
        description:
          "Convert data between CSV, TSV, JSON, XML, and YAML. Paste text, pick a target format, copy the result.",
      },
      audio: {
        description:
          "Play audio files with adjustable volume and speed, view the waveform, and download your file.",
      },
      video: {
        description:
          "Trim video clips and turn them into animated GIFs, right in your browser.",
      },
    },
    downloadOriginal: "Download original",
  },

  ar: {
    tools: {
      pdf: {
        description:
          "ادمج ملفات PDF، وقسّم الصفحات أو استخرجها، وحوّل الصور إلى PDF — كل ذلك في متصفحك دون حدود لحجم الملف.",
      },
      zip: {
        description:
          "أنشئ أرشيفات ZIP من ملفاتك واستخرج الأرشيفات الموجودة، مباشرةً في متصفحك.",
      },
      spreadsheet: {
        description:
          "اعرض ملفات CSV وExcel في متصفحك: رتّب وابحث وارسم عمودًا كرسم بياني وصدّر العرض المُصفّى إلى CSV.",
      },
      "file-converter": {
        name: "محوّل صيغ البيانات",
        description:
          "حوّل البيانات بين CSV وTSV وJSON وXML وYAML. الصق النص، واختر الصيغة المطلوبة، وانسخ النتيجة.",
      },
      audio: {
        description:
          "شغّل الملفات الصوتية مع التحكم في مستوى الصوت والسرعة، واعرض الموجة الصوتية، ونزّل ملفك.",
      },
      video: {
        description:
          "قصّ مقاطع الفيديو وحوّلها إلى صور GIF متحركة، مباشرةً في متصفحك.",
      },
    },
    downloadOriginal: "تنزيل الملف الأصلي",
  },

  es: {
    tools: {
      pdf: {
        description:
          "Combina PDF, divide o extrae páginas y convierte imágenes en un PDF, todo en tu navegador y sin límites de tamaño.",
      },
      zip: {
        description:
          "Crea archivos ZIP a partir de tus archivos y extrae los existentes, directamente en tu navegador.",
      },
      spreadsheet: {
        description:
          "Visualiza archivos CSV y Excel en tu navegador: ordena, busca, grafica una columna y exporta la vista filtrada a CSV.",
      },
      "file-converter": {
        name: "Conversor de formatos de datos",
        description:
          "Convierte datos entre CSV, TSV, JSON, XML y YAML. Pega el texto, elige el formato de destino y copia el resultado.",
      },
      audio: {
        description:
          "Reproduce archivos de audio con volumen y velocidad ajustables, visualiza la forma de onda y descarga tu archivo.",
      },
      video: {
        description:
          "Recorta clips de video y conviértelos en GIF animados, directamente en tu navegador.",
      },
    },
    downloadOriginal: "Descargar original",
  },

  "pt-BR": {
    tools: {
      pdf: {
        description:
          "Junte PDFs, divida ou extraia páginas e transforme imagens em PDF — tudo no seu navegador e sem limites de tamanho.",
      },
      zip: {
        description:
          "Crie arquivos ZIP a partir dos seus arquivos e extraia os existentes, direto no seu navegador.",
      },
      spreadsheet: {
        description:
          "Visualize arquivos CSV e Excel no seu navegador: ordene, pesquise, crie um gráfico de uma coluna e exporte a visualização filtrada para CSV.",
      },
      "file-converter": {
        name: "Conversor de Formatos de Dados",
        description:
          "Converta dados entre CSV, TSV, JSON, XML e YAML. Cole o texto, escolha o formato de destino e copie o resultado.",
      },
      audio: {
        description:
          "Reproduza arquivos de áudio com volume e velocidade ajustáveis, veja a forma de onda e baixe o seu arquivo.",
      },
      video: {
        description:
          "Corte clipes de vídeo e transforme-os em GIFs animados, direto no seu navegador.",
      },
    },
    downloadOriginal: "Baixar original",
  },

  fr: {
    tools: {
      pdf: {
        description:
          "Fusionnez des PDF, divisez ou extrayez des pages et transformez des images en PDF — le tout dans votre navigateur, sans limite de taille.",
      },
      zip: {
        description:
          "Créez des archives ZIP à partir de vos fichiers et extrayez les archives existantes, directement dans votre navigateur.",
      },
      spreadsheet: {
        description:
          "Consultez des fichiers CSV et Excel dans votre navigateur : triez, recherchez, tracez une colonne et exportez la vue filtrée en CSV.",
      },
      "file-converter": {
        name: "Convertisseur de formats de données",
        description:
          "Convertissez des données entre CSV, TSV, JSON, XML et YAML. Collez le texte, choisissez le format cible et copiez le résultat.",
      },
      audio: {
        description:
          "Lisez des fichiers audio avec volume et vitesse réglables, visualisez la forme d'onde et téléchargez votre fichier.",
      },
      video: {
        description:
          "Coupez des clips vidéo et transformez-les en GIF animés, directement dans votre navigateur.",
      },
    },
    downloadOriginal: "Télécharger l'original",
  },

  de: {
    tools: {
      pdf: {
        description:
          "PDFs zusammenführen, Seiten teilen oder extrahieren und Bilder in ein PDF umwandeln – alles im Browser, ohne Größenbeschränkung.",
      },
      zip: {
        description:
          "Erstelle ZIP-Archive aus deinen Dateien und entpacke vorhandene Archive – direkt im Browser.",
      },
      spreadsheet: {
        description:
          "CSV- und Excel-Dateien im Browser ansehen: sortieren, suchen, eine Spalte als Diagramm darstellen und die gefilterte Ansicht als CSV exportieren.",
      },
      "file-converter": {
        name: "Datenformat-Konverter",
        description:
          "Konvertiere Daten zwischen CSV, TSV, JSON, XML und YAML. Text einfügen, Zielformat wählen, Ergebnis kopieren.",
      },
      audio: {
        description:
          "Audiodateien mit einstellbarer Lautstärke und Geschwindigkeit abspielen, die Wellenform ansehen und deine Datei herunterladen.",
      },
      video: {
        description:
          "Videoclips zuschneiden und in animierte GIFs umwandeln – direkt im Browser.",
      },
    },
    downloadOriginal: "Original herunterladen",
  },

  ru: {
    tools: {
      pdf: {
        description:
          "Объединяйте PDF, разделяйте или извлекайте страницы и превращайте изображения в PDF — прямо в браузере и без ограничений по размеру.",
      },
      zip: {
        description:
          "Создавайте ZIP-архивы из своих файлов и распаковывайте существующие — прямо в браузере.",
      },
      spreadsheet: {
        description:
          "Просматривайте файлы CSV и Excel в браузере: сортируйте, ищите, стройте график по столбцу и экспортируйте отфильтрованное представление в CSV.",
      },
      "file-converter": {
        name: "Конвертер форматов данных",
        description:
          "Преобразуйте данные между CSV, TSV, JSON, XML и YAML. Вставьте текст, выберите нужный формат и скопируйте результат.",
      },
      audio: {
        description:
          "Воспроизводите аудиофайлы с регулируемой громкостью и скоростью, смотрите форму волны и скачивайте свой файл.",
      },
      video: {
        description:
          "Обрезайте видеоклипы и превращайте их в анимированные GIF — прямо в браузере.",
      },
    },
    downloadOriginal: "Скачать оригинал",
  },

  id: {
    tools: {
      pdf: {
        description:
          "Gabungkan PDF, pisah atau ekstrak halaman, dan ubah gambar menjadi PDF — semuanya di browser tanpa batas ukuran file.",
      },
      zip: {
        description:
          "Buat arsip ZIP dari file Anda dan ekstrak arsip yang sudah ada, langsung di browser.",
      },
      spreadsheet: {
        description:
          "Lihat file CSV dan Excel di browser: urutkan, cari, buat grafik satu kolom, dan ekspor tampilan terfilter ke CSV.",
      },
      "file-converter": {
        name: "Konverter Format Data",
        description:
          "Konversi data antara CSV, TSV, JSON, XML, dan YAML. Tempel teks, pilih format tujuan, salin hasilnya.",
      },
      audio: {
        description:
          "Putar file audio dengan volume dan kecepatan yang dapat diatur, lihat bentuk gelombang, dan unduh file Anda.",
      },
      video: {
        description:
          "Pangkas klip video dan ubah menjadi GIF animasi, langsung di browser.",
      },
    },
    downloadOriginal: "Unduh file asli",
  },

  "zh-CN": {
    tools: {
      pdf: {
        description:
          "合并 PDF、拆分或提取页面，并将图片转换为 PDF——全部在浏览器中完成，且无文件大小限制。",
      },
      zip: {
        description: "在浏览器中直接用你的文件创建 ZIP 压缩包，并解压已有的压缩包。",
      },
      spreadsheet: {
        description:
          "在浏览器中查看 CSV 和 Excel 文件：排序、搜索、为某一列生成图表，并将筛选后的视图导出为 CSV。",
      },
      "file-converter": {
        name: "数据格式转换器",
        description:
          "在 CSV、TSV、JSON、XML 和 YAML 之间转换数据。粘贴文本，选择目标格式，复制结果。",
      },
      audio: {
        description: "播放音频文件，可调节音量和速度，查看波形，并下载你的文件。",
      },
      video: {
        description: "在浏览器中直接裁剪视频片段并将其转换为动态 GIF。",
      },
    },
    downloadOriginal: "下载原始文件",
  },
};

for (const [locale, { tools, downloadOriginal }] of Object.entries(BY_LOCALE)) {
  const path = `messages/${locale}.json`;
  const json = JSON.parse(readFileSync(path, "utf8"));

  for (const [slug, patch] of Object.entries(tools)) {
    Object.assign(json.ToolsConfig.tools[slug], patch);
  }

  json.Tools.AudioEditor.downloadOriginal = downloadOriginal;

  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
}

console.log("synced", Object.keys(BY_LOCALE).length, "locales");
