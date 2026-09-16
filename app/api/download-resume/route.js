// API Route: Download Resume Document
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'My Profile', 'Huynh_Thien_An_Executive_CV_2026_Updated.docx');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File CV không tìm thấy' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="Huynh_Thien_An_Executive_CV_2026.docx"',
      },
    });
  } catch (error) {
    console.error('[Download Resume Error]', error);
    return NextResponse.json({ error: 'Lỗi tải file: ' + error.message }, { status: 500 });
  }
}
