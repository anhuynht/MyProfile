// API Route: Admin Login
import { NextResponse } from 'next/server';
import { verifyAdminCredentials, generateToken } from '@/lib/auth';
import { initDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    await initDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    const token = generateToken({ id: admin.id, email: admin.email, name: admin.name });

    const response = NextResponse.json({
      success: true,
      token,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });

    // Set secure HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Admin Login Error]', error);
    return NextResponse.json({ error: 'Lỗi đăng nhập: ' + error.message }, { status: 500 });
  }
}
