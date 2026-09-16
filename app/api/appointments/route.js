// API Route: Book an Appointment
import { NextResponse } from 'next/server';
import { insertAppointment, initDatabase } from '@/lib/db';
import { sendBookingNotification } from '@/lib/emailService';

export async function POST(request) {
  try {
    await initDatabase();
    const body = await request.json();

    const { name, email, phone, company, meetingType, topic, preferredDate, preferredTime, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp Họ tên và Email liên hệ.' },
        { status: 400 }
      );
    }

    const newAppt = await insertAppointment({
      name,
      email,
      phone,
      company,
      meetingType: meetingType || 'online',
      topic: topic || 'Trao đổi cơ hội C-Level',
      preferredDate,
      preferredTime,
      notes,
    });

    // Send email notification to an.huynht@gmail.com
    sendBookingNotification({
      name,
      email,
      phone,
      company,
      meetingType,
      topic,
      preferredDate,
      preferredTime,
      notes,
    }).catch(err => console.error('[Email Notification Booking Error]', err));

    return NextResponse.json({
      success: true,
      appointment: newAppt,
      message: 'Đặt lịch hẹn thành công! Anh Huỳnh Thiên An sẽ nhận được thông báo và liên hệ lại với bạn sớm nhất.',
    });
  } catch (error) {
    console.error('[API appointments] Error:', error);
    return NextResponse.json(
      { error: 'Không thể ghi nhận lịch hẹn: ' + error.message },
      { status: 500 }
    );
  }
}
