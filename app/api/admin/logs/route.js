import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getMatchLogs, getMatchLogById, initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Không có quyền truy cập. Vui lòng đăng nhập.' }, { status: 401 });
    }

    await initDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const log = await getMatchLogById(id);
      return NextResponse.json({ success: true, log });
    }

    const limit = parseInt(searchParams.get('limit') || '100');
    const logs = await getMatchLogs(limit);

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('[Admin Logs Error]', error);
    return NextResponse.json({ error: 'Lỗi lấy dữ liệu: ' + error.message }, { status: 500 });
  }
}
