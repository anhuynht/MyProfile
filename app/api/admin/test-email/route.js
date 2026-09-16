// API Route: Send Test Notification Email
import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { sendTestNotificationEmail } from '@/lib/emailService';
import { initDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
    }

    await initDatabase();
    const { testEmail } = await request.json();

    const result = await sendTestNotificationEmail(testEmail || 'an.huynht@gmail.com');
    return NextResponse.json({ success: true, message: 'Đã gửi email thử nghiệm thành công!', result });
  } catch (error) {
    console.error('[Admin Test Email Error]', error);
    return NextResponse.json({ error: error.message || 'Lỗi gửi email' }, { status: 500 });
  }
}
