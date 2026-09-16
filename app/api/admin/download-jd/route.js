import { NextResponse } from 'next/server';
import { getMatchLogFileById, initDatabase } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing log id' }, { status: 400 });
    }

    const log = await getMatchLogFileById(id);
    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    let fileBuffer;
    let contentType = log.file_type || 'application/pdf';
    let filename = log.jd_filename || `JD_${log.id}.pdf`;

    if (log.file_data) {
      fileBuffer = Buffer.from(log.file_data, 'base64');
    } else if (log.jd_text) {
      // Handle legacy records where raw PDF was stored in jd_text
      if (log.jd_text.startsWith('%PDF')) {
        fileBuffer = Buffer.from(log.jd_text, 'latin1');
        contentType = 'application/pdf';
        if (!filename.toLowerCase().endsWith('.pdf')) {
          filename += '.pdf';
        }
      } else {
        fileBuffer = Buffer.from(log.jd_text, 'utf-8');
        contentType = 'text/plain; charset=utf-8';
        if (!filename.toLowerCase().endsWith('.txt')) {
          filename += '.txt';
        }
      }
    } else {
      return NextResponse.json({ error: 'No JD document content found for this log' }, { status: 404 });
    }

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[API download-jd] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
