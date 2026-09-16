// Polyfill DOMMatrix for Node.js / Vercel Serverless environment
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(init) {
      if (Array.isArray(init)) {
        this.a = init[0] ?? 1; this.b = init[1] ?? 0;
        this.c = init[2] ?? 0; this.d = init[3] ?? 1;
        this.e = init[4] ?? 0; this.f = init[5] ?? 0;
      } else {
        this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      }
    }
    translate(x = 0, y = 0) { return this; }
    scale(x = 1, y = 1) { return this; }
    multiply(other) { return this; }
    multiplySelf(other) { return this; }
    preMultiplySelf(other) { return this; }
    invertSelf() { return this; }
    transformPoint(point) { return point; }
  };
}

export async function parseDocument(fileBuffer, mimeType, filename = '') {
  const ext = filename.toLowerCase().split('.').pop();

  // 1. Plain Text / Markdown
  if (mimeType.includes('text') || ext === 'txt' || ext === 'md') {
    return fileBuffer.toString('utf-8');
  }

  // 2. Word Document (.docx)
  if (mimeType.includes('wordprocessingml') || ext === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const clean = (result.value || '').replace(/\0/g, '').trim();
      if (clean.length > 20) {
        return clean;
      }
    } catch (err) {
      console.error('[DocParser] Mammoth docx error:', err.message);
    }
    return '';
  }

  // 3. PDF Document (.pdf)
  if (mimeType.includes('pdf') || ext === 'pdf') {
    // Strategy A: pdf-parse v2 with DOMMatrix polyfill
    try {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: fileBuffer });
      const data = await parser.getText();
      await parser.destroy();
      const cleanText = (data.text || '')
        .replace(/-- \d+ of \d+ --/g, '')
        .replace(/\0/g, '')
        .trim();
      if (cleanText.length > 20) {
        return cleanText;
      }
    } catch (err) {
      console.error('[DocParser] Strategy A (pdf-parse) error:', err.message);
    }

    // Strategy B: Direct pdfjs-dist legacy loader
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const doc = await pdfjs.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
      let fullText = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items.map(item => item.str).join(' ');
        fullText += pageStr + '\n';
      }
      const cleanText = fullText.replace(/\0/g, '').trim();
      if (cleanText.length > 20) {
        return cleanText;
      }
    } catch (err) {
      console.error('[DocParser] Strategy B (pdfjs-dist) error:', err.message);
    }

    // Strategy C: Extract literal text strings from PDF streams
    try {
      const raw = fileBuffer.toString('latin1');
      const matches = raw.match(/\(([^)]+)\)\s*T[jJ]/g) || [];
      const extracted = matches
        .map(m => m.replace(/\)\s*T[jJ]$/, '').replace(/^\(/, ''))
        .filter(s => s.length > 1)
        .join(' ')
        .replace(/\0/g, '')
        .trim();
      if (extracted.length > 30) {
        return extracted;
      }
    } catch (err) {
      console.error('[DocParser] Strategy C (stream regex) error:', err.message);
    }

    return '';
  }

  // Default fallback
  try {
    const text = fileBuffer.toString('utf-8').replace(/\0/g, '').trim();
    const sample = text.slice(0, 500);
    const nonPrintable = sample.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g);
    if (!nonPrintable || nonPrintable.length < 5) {
      return text;
    }
  } catch {}

  return '';
}
