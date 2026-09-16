// API Route: Upload JD & Perform AI Candidate Matching
import { NextResponse } from 'next/server';
import { parseDocument } from '@/lib/docParser';
import { matchCandidateWithJD } from '@/lib/aiMatcher';
import { insertMatchLog, initDatabase } from '@/lib/db';
import { sendJDMatchNotification } from '@/lib/emailService';

export async function POST(request) {
  try {
    await initDatabase();

    const formData = await request.formData();
    const userName = formData.get('userName') || '';
    const userEmail = formData.get('userEmail') || '';
    const companyName = formData.get('companyName') || '';
    const jobTitle = formData.get('jobTitle') || '';
    const directText = formData.get('jdText') || '';
    const file = formData.get('jdFile');

    if (!userName.trim() || !userEmail.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp Họ Tên và Email để tiến hành so sánh hồ sơ.' },
        { status: 400 }
      );
    }

    let extractedJDText = directText.trim();
    let filename = 'Direct Input';
    let fileBase64 = null;
    let fileType = null;

    if (file && typeof file === 'object' && file.name) {
      filename = file.name;
      fileType = file.type || 'application/octet-stream';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fileBase64 = buffer.toString('base64');
      const parsedText = await parseDocument(buffer, file.type, file.name);
      if (parsedText && parsedText.trim().length >= 20) {
        extractedJDText = parsedText.trim();
      } else if (!extractedJDText) {
        extractedJDText = parsedText ? parsedText.trim() : '';
      }
    }

    if (!extractedJDText || extractedJDText.length < 20) {
      const msg = filename && filename !== 'Direct Input'
        ? `Không thể trích xuất nội dung văn bản từ tệp "${filename}" (có thể do tệp là bản scan dạng hình ảnh hoặc có bảo vệ mã hóa). Vui lòng thử tải file Word (.docx) hoặc dán trực tiếp nội dung JD vào ô bên dưới.`
        : 'Nội dung Job Description quá ngắn hoặc không thể đọc được. Vui lòng dán trực tiếp nội dung JD hoặc tải tệp PDF/Word hợp lệ.';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Run AI Matching
    const aiResult = await matchCandidateWithJD({
      jdText: extractedJDText,
      recruiterName: userName,
      recruiterEmail: userEmail,
      companyName,
      jobTitle,
    });

    const matchScore = aiResult.matchScore || 88;
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Store in PostgreSQL / Database
    const savedLog = await insertMatchLog({
      userName,
      userEmail,
      companyName,
      jobTitle,
      jdFilename: filename,
      jdText: extractedJDText,
      matchScore,
      aiResult,
      ipAddress,
      fileData: fileBase64,
      fileType,
    });

    // Notify via email to an.huynht@gmail.com asynchronously
    sendJDMatchNotification({
      recruiterName: userName,
      recruiterEmail: userEmail,
      companyName,
      jobTitle,
      matchScore,
      summary: aiResult.summary,
      jdFilename: filename,
    }).catch(err => console.error('[Email Notification Error]', err));

    return NextResponse.json({
      success: true,
      logId: savedLog.id,
      analysis: aiResult,
    });
  } catch (error) {
    console.error('[API match-jd] Error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại: ' + error.message },
      { status: 500 }
    );
  }
}
