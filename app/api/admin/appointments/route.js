import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getAppointments, updateAppointmentStatus, getResumeRequests, initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
    }

    await initDatabase();

    const appointments = await getAppointments(100);
    const resumeRequests = await getResumeRequests(100);

    return NextResponse.json({ success: true, appointments, resumeRequests });
  } catch (error) {
    console.error('[Admin Appointments Error]', error);
    return NextResponse.json({ error: 'Lỗi máy chủ: ' + error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
    }

    await initDatabase();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu ID hoặc trạng thái mới.' }, { status: 400 });
    }

    const updated = await updateAppointmentStatus(id, status);
    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error('[Admin Update Appointment Error]', error);
    return NextResponse.json({ error: 'Lỗi cập nhật: ' + error.message }, { status: 500 });
  }
}
