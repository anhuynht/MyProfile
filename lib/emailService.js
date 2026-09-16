// Email Notification Service using Nodemailer
import nodemailer from 'nodemailer';
import { getSystemSettings } from './db';

async function createTransporter() {
  const settings = await getSystemSettings();
  
  const host = settings.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(settings.smtp_port || process.env.SMTP_PORT || '465');
  const user = settings.smtp_user || process.env.SMTP_USER;
  const pass = settings.smtp_pass || process.env.SMTP_PASS;
  const secure = settings.smtp_secure ?? (port === 465);

  if (!user || !pass) {
    console.warn('[EmailService] SMTP credentials not set. Notification email logged to console instead.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// 1. Notify on new Appointment Booking
export async function sendBookingNotification(booking) {
  const settings = await getSystemSettings();
  if (settings.notify_on_booking === false) return;

  const recipient = settings.notification_email || 'an.huynht@gmail.com';
  const transporter = await createTransporter();

  const subject = `📅 [Portfolio] Lịch hẹn mới từ ${booking.name} (${booking.company || 'Cá nhân'})`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0B132B 0%, #1C2541 100%); padding: 24px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">THÔNG BÁO ĐẶT LỊCH HẸN MỚI</h2>
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">Có đối tác vừa đặt lịch trao đổi trên trang Executive Portfolio của anh.</p>
      </div>

      <div style="padding: 24px; color: #1e293b;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Người liên hệ:</td>
            <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email:</td>
            <td style="padding: 10px 0; font-weight: 600; color: #0284c7; border-bottom: 1px solid #f1f5f9;">
              <a href="mailto:${booking.email}" style="color: #0284c7; text-decoration: none;">${booking.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Số điện thoại:</td>
            <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${booking.phone || 'Chưa cung cấp'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Đơn vị / Công ty:</td>
            <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${booking.company || 'Chưa cung cấp'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Hình thức:</td>
            <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${booking.meetingType === 'online' ? '🌐 Trực tuyến (Google Meet / Teams)' : '☕ Gặp mặt trực tiếp (TP.HCM)'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Chủ đề trao đổi:</td>
            <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${booking.topic || 'Trao đổi chiến lược / Tuyển dụng'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Thời gian đề xuất:</td>
            <td style="padding: 10px 0; font-weight: 600; color: #d97706; border-bottom: 1px solid #f1f5f9;">${booking.preferredDate || 'Linh hoạt'} (${booking.preferredTime || 'Trong giờ hành chính'})</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; vertical-align: top;">Lời nhắn:</td>
            <td style="padding: 10px 0; font-style: italic; color: #334155;">"${booking.notes || 'Không có lời nhắn thêm'}"</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${booking.email}?subject=Phản hồi lịch hẹn trao đổi với Huỳnh Thiên An" style="background: #0284c7; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
            Phản Hồi Trực Tiếp Tới ${booking.name}
          </a>
        </div>
      </div>

      <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
        Hệ thống Executive Portfolio của Huỳnh Thiên An | Thông báo tự động
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Mock Log] TO: ${recipient} | SUBJECT: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${settings.smtp_user || 'Executive Portfolio'}" <${settings.smtp_user}>`,
      to: recipient,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] Error sending booking email:', err.message);
    return { success: false, error: err.message };
  }
}

// 2. Notify on new JD Match Analysis
export async function sendJDMatchNotification(data) {
  const settings = await getSystemSettings();
  if (settings.notify_on_matching === false) return;

  const recipient = settings.notification_email || 'an.huynht@gmail.com';
  const transporter = await createTransporter();

  const scoreBadgeColor = (data.matchScore || 0) >= 85 ? '#16a34a' : '#d97706';
  const subject = `🎯 [Portfolio] Nhà tuyển dụng vừa phân tích JD: ${data.recruiterName} (${data.companyName || 'Công ty'}) - Match: ${data.matchScore}%`;
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0B132B 0%, #1C2541 100%); padding: 24px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">PHÂN TÍCH MATCHING JD MỚI</h2>
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">Nhà tuyển dụng vừa tải lên JD và kiểm tra độ tương thích với hồ sơ của anh.</p>
      </div>

      <div style="padding: 24px; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">ĐIỂM TƯƠNG THÍCH AI (MATCH SCORE)</div>
          <div style="font-size: 36px; font-weight: 700; color: ${scoreBadgeColor};">${data.matchScore}%</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 35%; border-bottom: 1px solid #f1f5f9;">Nhà tuyển dụng:</td>
            <td style="padding: 8px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${data.recruiterName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email:</td>
            <td style="padding: 8px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">
              <a href="mailto:${data.recruiterEmail}" style="color: #0284c7; text-decoration: none;">${data.recruiterEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Công ty:</td>
            <td style="padding: 8px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${data.companyName || 'Chưa cung cấp'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Vị trí tuyển dụng:</td>
            <td style="padding: 8px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${data.jobTitle || 'Chưa cung cấp'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Tên file JD:</td>
            <td style="padding: 8px 0; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${data.jdFilename || 'Nhập trực tiếp'}</td>
          </tr>
        </table>

        <div style="margin-top: 18px; padding: 14px; background: #eff6ff; border-left: 4px solid #0284c7; border-radius: 4px;">
          <strong style="color: #1e40af; font-size: 13px; display: block; margin-bottom: 4px;">Tóm tắt đánh giá AI:</strong>
          <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;">${data.summary || 'Đã phân tích độ phù hợp với hồ sơ.'}</p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${data.recruiterEmail}?subject=Trao đổi cơ hội hợp tác cho vị trí ${data.jobTitle || 'C-Level'}" style="background: #0B132B; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
            Gửi Email Trao Đổi Ngay
          </a>
        </div>
      </div>

      <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
        Toàn bộ nội dung file JD và phân tích chi tiết đã được lưu trữ trong Dashboard Quản Trị (/admin).
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Mock Log] TO: ${recipient} | SUBJECT: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${settings.smtp_user || 'Executive Portfolio'}" <${settings.smtp_user}>`,
      to: recipient,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] Error sending JD match email:', err.message);
    return { success: false, error: err.message };
  }
}

// 3. Send test email to verify SMTP configuration
export async function sendTestNotificationEmail(testEmail) {
  const transporter = await createTransporter();
  const recipient = testEmail || 'an.huynht@gmail.com';

  if (!transporter) {
    throw new Error('Chưa cấu hình thông tin SMTP (Username/Password). Vui lòng điền thông tin và lưu lại trước khi gửi thử nghiệm.');
  }

  const info = await transporter.sendMail({
    from: `"Executive Portfolio" <${recipient}>`,
    to: recipient,
    subject: `✅ [Thử nghiệm] Kết nối Email Thông Báo thành công!`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px;">
        <h3 style="color: #16a34a; margin-top: 0;">Xin chào anh Huỳnh Thiên An!</h3>
        <p>Hệ thống email thông báo của trang Executive Portfolio đã được kết nối thành công.</p>
        <p>Từ bây giờ, mọi lịch hẹn mới hoặc yêu cầu phân tích JD sẽ được tự động gửi về hòm thư này.</p>
        <div style="margin-top: 15px; font-size: 12px; color: #64748b;">Thời gian kiểm tra: ${new Date().toLocaleString('vi-VN')}</div>
      </div>
    `,
  });

  return { success: true, messageId: info.messageId };
}
