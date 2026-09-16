// API Route: Request or Track Resume Download
import { NextResponse } from 'next/server';
import { insertResumeRequest, initDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    await initDatabase();
    const body = await request.json();
    const { name, email, company, role, purpose } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp Họ tên và Email để nhận hồ sơ.' },
        { status: 400 }
      );
    }

    const saved = await insertResumeRequest({
      name,
      email,
      company,
      role,
      purpose,
    });

    return NextResponse.json({
      success: true,
      message: 'Yêu cầu hồ sơ đã được ghi nhận thành công.',
      data: saved,
    });
  } catch (error) {
    console.error('[API resume-request] Error:', error);
    return NextResponse.json(
      { error: 'Lỗi ghi nhận yêu cầu: ' + error.message },
      { status: 500 }
    );
  }
}
