// Document Parser for PDF, DOCX, and TXT files
import mammoth from 'mammoth';

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
      console.error('[DocParser] pdf-parse error:', err.message);
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
