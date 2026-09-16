import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getSystemSettings, updateSystemSettings, initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
    }

    await initDatabase();
    const settings = await getSystemSettings();

    // Mask sensitive keys for frontend display
    const maskedSettings = {
      ...settings,
      gemini_api_key_masked: settings.gemini_api_key ? `${settings.gemini_api_key.slice(0, 6)}...${settings.gemini_api_key.slice(-4)}` : '',
      smtp_pass_masked: settings.smtp_pass ? '••••••••' : '',
    };

    return NextResponse.json({ success: true, settings: maskedSettings });
  } catch (error) {
    console.error('[Admin Settings Error]', error);
    return NextResponse.json({ error: 'Lỗi lấy cài đặt: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
    }

    await initDatabase();
    const body = await request.json();

    // If masked placeholder was sent back, preserve original
    const current = await getSystemSettings();
    if (body.gemini_api_key && body.gemini_api_key.includes('...')) {
      body.gemini_api_key = current.gemini_api_key;
    }
    if (body.smtp_pass && body.smtp_pass === '••••••••') {
      body.smtp_pass = current.smtp_pass;
    }

    const updated = await updateSystemSettings(body);
    return NextResponse.json({ success: true, message: 'Đã lưu cấu hình thành công!', settings: updated });
  } catch (error) {
    console.error('[Admin Save Settings Error]', error);
    return NextResponse.json({ error: 'Lỗi lưu cấu hình: ' + error.message }, { status: 500 });
  }
}
