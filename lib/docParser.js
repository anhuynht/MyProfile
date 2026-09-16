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
      return result.value.trim();
    } catch (err) {
      console.error('[DocParser] Mammoth docx error:', err.message);
      // Fallback: try raw utf8 or simple strip
      return fileBuffer.toString('latin1').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    }
  }

  // 3. PDF Document (.pdf)
  if (mimeType.includes('pdf') || ext === 'pdf') {
    try {
      // Dynamic import for pdf-parse in Next.js environment
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(fileBuffer);
      return data.text.trim();
    } catch (err) {
      console.error('[DocParser] pdf-parse error:', err.message);
      return fileBuffer.toString('utf-8');
    }
  }

  // Default fallback
  return fileBuffer.toString('utf-8');
}
