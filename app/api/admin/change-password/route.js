import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminFromRequest, verifyAdminCredentials } from '@/lib/auth';
import { updateAdminPassword, initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập.' }, { status: 401 });
    }

    await initDatabase();
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' }, { status: 400 });
    }

    // Verify current password
    const verified = await verifyAdminCredentials(admin.email, currentPassword);
    if (!verified) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác.' }, { status: 400 });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);
    await updateAdminPassword(admin.email, newHash);

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu quản trị đã được cập nhật thành công!'
    });
  } catch (error) {
    console.error('[Admin Change Password Error]', error);
    return NextResponse.json({ error: 'Lỗi cập nhật mật khẩu: ' + error.message }, { status: 500 });
  }
}
