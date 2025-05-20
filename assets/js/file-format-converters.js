(function () {
  const container = document.querySelector(
    ".file-format-converters .container"
  );

  function createCard(title) {
    const card = document.createElement("div");
    card.className = "tool-card";
    const heading = document.createElement("h2");
    heading.textContent = title;
    card.appendChild(heading);
    return card;
  }

  // 1. Image to Base64
  (function () {
    const card = createCard("Image to Base64");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    const output = document.createElement("textarea");
    output.rows = 6;
    output.placeholder = "Base64 output will appear here...";

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        output.value = reader.result;
      };
      reader.readAsDataURL(file);
    });

    card.append(fileInput, output);
    container.appendChild(card);
  })();

  // 2. Base64 to Image
  (function () {
    const card = createCard("Base64 to Image");

    const input = document.createElement("textarea");
    input.rows = 6;
    input.placeholder = "Paste Base64 string here...";

    const img = document.createElement("img");
    img.style.maxWidth = "100%";
    img.style.marginTop = "10px";
    img.alt = "Preview";

    const btn = document.createElement("button");
    btn.textContent = "Convert";

    btn.addEventListener("click", () => {
      const base64 = input.value.trim();
      if (!base64.startsWith("data:image")) {
        alert(
          "Please provide a valid base64 image string starting with data:image"
        );
        return;
      }
      img.src = base64;
    });

    card.append(input, btn, img);
    container.appendChild(card);
  })();

  // 3. Text to PDF (using jsPDF CDN loaded dynamically)
  (function () {
    const card = createCard("Text to PDF");

    const textarea = document.createElement("textarea");
    textarea.rows = 8;
    textarea.placeholder = "Enter text to convert to PDF";

    const btn = document.createElement("button");
    btn.textContent = "Download PDF";

    // Load jsPDF script dynamically
    let jsPDFLoaded = false;
    function loadJsPDF(callback) {
      if (jsPDFLoaded) return callback();
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => {
        jsPDFLoaded = true;
        callback();
      };
      script.onerror = () => alert("Failed to load jsPDF library.");
      document.head.appendChild(script);
    }

    btn.addEventListener("click", () => {
      loadJsPDF(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const text = textarea.value || "No content";
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, 10, 10);
        doc.save("converted-text.pdf");
      });
    });

    card.append(textarea, btn);
    container.appendChild(card);
  })();

  // CSV to JSON and JSON to CSV
  (function () {
    const card = createCard("CSV ⇄ JSON");

    const textarea = document.createElement("textarea");
    textarea.rows = 10;
    textarea.placeholder = "Paste CSV or JSON here";

    const toJsonBtn = document.createElement("button");
    toJsonBtn.textContent = "CSV → JSON";

    const toCsvBtn = document.createElement("button");
    toCsvBtn.textContent = "JSON → CSV";

    const output = document.createElement("textarea");
    output.rows = 10;
    output.readOnly = true;
    output.placeholder = "Output";

    function csvToJson(csv) {
      const lines = csv.trim().split("\n");
      const headers = lines[0].split(",");
      const result = lines.slice(1).map((line) => {
        const values = line.split(",");
        return headers.reduce((obj, header, i) => {
          obj[header.trim()] = values[i].trim();
          return obj;
        }, {});
      });
      return JSON.stringify(result, null, 2);
    }

    function jsonToCsv(json) {
      try {
        const arr = JSON.parse(json);
        if (!Array.isArray(arr)) throw new Error("JSON must be an array");
        if (arr.length === 0) return "";
        const headers = Object.keys(arr[0]);
        const csvLines = [
          headers.join(","),
          ...arr.map((obj) =>
            headers
              .map((h) => `"${(obj[h] ?? "").toString().replace(/"/g, '""')}"`)
              .join(",")
          ),
        ];
        return csvLines.join("\n");
      } catch {
        return "Invalid JSON array input";
      }
    }

    toJsonBtn.onclick = () => {
      try {
        output.value = csvToJson(textarea.value);
      } catch {
        output.value = "Invalid CSV input";
      }
    };

    toCsvBtn.onclick = () => {
      output.value = jsonToCsv(textarea.value);
    };

    card.append(textarea, toJsonBtn, toCsvBtn, output);
    container.appendChild(card);
  })();

  // Markdown to HTML and HTML to Markdown (simple conversion)
  (function () {
    const card = createCard("Markdown ⇄ HTML");

    const textarea = document.createElement("textarea");
    textarea.rows = 10;
    textarea.placeholder = "Paste Markdown or HTML here";

    const toHtmlBtn = document.createElement("button");
    toHtmlBtn.textContent = "Markdown → HTML";

    const toMdBtn = document.createElement("button");
    toMdBtn.textContent = "HTML → Markdown";

    const output = document.createElement("textarea");
    output.rows = 10;
    output.readOnly = true;
    output.placeholder = "Output";

    // Basic markdown to html (handles headings, bold, italics, links, and line breaks)
    function markdownToHtml(md) {
      let html = md
        .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
        .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
        .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/gim, "<br>");
      return html.trim();
    }

    // Very simple html to markdown (only handles headings, bold, italics, and links)
    function htmlToMarkdown(html) {
      let md = html
        .replace(/<h6>(.*?)<\/h6>/gim, "###### $1\n")
        .replace(/<h5>(.*?)<\/h5>/gim, "##### $1\n")
        .replace(/<h4>(.*?)<\/h4>/gim, "#### $1\n")
        .replace(/<h3>(.*?)<\/h3>/gim, "### $1\n")
        .replace(/<h2>(.*?)<\/h2>/gim, "## $1\n")
        .replace(/<h1>(.*?)<\/h1>/gim, "# $1\n")
        .replace(/<strong>(.*?)<\/strong>/gim, "**$1**")
        .replace(/<b>(.*?)<\/b>/gim, "**$1**")
        .replace(/<em>(.*?)<\/em>/gim, "*$1*")
        .replace(/<i>(.*?)<\/i>/gim, "*$1*")
        .replace(/<a href="(.*?)".*?>(.*?)<\/a>/gim, "[$2]($1)")
        .replace(/<br\s*\/?>/gim, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "") // remove other tags
        .trim();
      return md;
    }

    toHtmlBtn.onclick = () => {
      output.value = markdownToHtml(textarea.value);
    };

    toMdBtn.onclick = () => {
      output.value = htmlToMarkdown(textarea.value);
    };

    card.append(textarea, toHtmlBtn, toMdBtn, output);
    container.appendChild(card);
  })();

  // Text ↔ Base64
  (function () {
    const card = createCard("Text ⇄ Base64");

    const textarea = document.createElement("textarea");
    textarea.rows = 8;
    textarea.placeholder = "Enter text here";

    const toBase64Btn = document.createElement("button");
    toBase64Btn.textContent = "Text → Base64";

    const fromBase64Btn = document.createElement("button");
    fromBase64Btn.textContent = "Base64 → Text";

    const output = document.createElement("textarea");
    output.rows = 8;
    output.readOnly = true;
    output.placeholder = "Output";

    toBase64Btn.onclick = () => {
      output.value = btoa(unescape(encodeURIComponent(textarea.value)));
    };

    fromBase64Btn.onclick = () => {
      try {
        output.value = decodeURIComponent(escape(atob(textarea.value)));
      } catch {
        output.value = "Invalid Base64 input";
      }
    };

    card.append(textarea, toBase64Btn, fromBase64Btn, output);
    container.appendChild(card);
  })();

  // Image converter (PNG ↔ JPG)
  (function () {
    const card = createCard("Image Converter (PNG ↔ JPG)");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg";

    const canvas = document.createElement("canvas");
    canvas.style.display = "none";

    const imgPreview = document.createElement("img");
    imgPreview.style.maxWidth = "100%";
    imgPreview.style.marginTop = "10px";
    imgPreview.alt = "Converted Image Preview";

    const convertBtn = document.createElement("button");
    convertBtn.textContent = "Convert";

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";

    let selectedFile = null;

    fileInput.addEventListener("change", () => {
      selectedFile = fileInput.files[0];
      if (!selectedFile) return;
      const url = URL.createObjectURL(selectedFile);
      imgPreview.src = url;
      downloadLink.style.display = "none";
    });

    convertBtn.addEventListener("click", () => {
      if (!selectedFile) {
        alert("Please select an image file first.");
        return;
      }
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let outputFormat =
          selectedFile.type === "image/png" ? "image/jpeg" : "image/png";
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            imgPreview.src = url;
            downloadLink.href = url;
            downloadLink.download = selectedFile.name.replace(
              /\.(png|jpe?g)$/i,
              outputFormat === "image/png" ? ".png" : ".jpg"
            );
            downloadLink.style.display = "inline-block";
            downloadLink.textContent = "Download Converted Image";
          },
          outputFormat,
          0.92
        );
      };
      img.onerror = () => alert("Failed to load the image.");
      img.src = imgPreview.src;
    });

    card.append(fileInput, convertBtn, imgPreview, downloadLink);
    container.appendChild(card);
  })();
})();
