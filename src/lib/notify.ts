import nodemailer from "nodemailer";

const ADMIN_EMAIL = "hayhome.arm@gmail.com";

/**
 * SMTP transporter — uses Gmail SMTP credentials from .env.local.
 * If GMAIL_APP_PASSWORD is not set, returns null (email disabled).
 */
function getTransporter() {
  if (!process.env.GMAIL_APP_PASSWORD || !process.env.GMAIL_USER) {
    console.warn("[Notify] GMAIL credentials not set — email notifications disabled");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send an email notification to a host (property owner / family).
 *
 * Usage:
 *   await sendHostNotification("family@example.com", "New booking!", "<h1>Hello</h1>");
 *
 * Wrapped in try/catch — never throws (logs to console only).
 */
export async function sendHostNotification(
  hostEmail: string,
  subject: string,
  htmlBody: string
): Promise<boolean> {
  try {
    if (!hostEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hostEmail)) {
      console.warn(`[Notify] Invalid host email: "${hostEmail}" — skipping`);
      return false;
    }

    const transporter = getTransporter();
    if (!transporter) {
      console.log(`[Notify] SMTP not configured — would send to ${hostEmail}: ${subject}`);
      return false;
    }

    await transporter.sendMail({
      from: `"HayHome 🇦🇲" <${process.env.GMAIL_USER || ADMIN_EMAIL}>`,
      to: hostEmail,
      subject,
      html: htmlBody,
    });

    console.log(`[Notify] ✅ Email sent to ${hostEmail}: ${subject}`);
    return true;
  } catch (err) {
    console.error(`[Notify] Failed to send to ${hostEmail}:`, err);
    return false;
  }
}

// ── Templates ──

/**
 * Build a booking notification email for the host.
 */
export function buildBookingEmailHtml(data: {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  message?: string;
}): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#D4001A,#F2A900);padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">🏡 Новое бронирование!</h1>
        <p style="color:rgba(255,255,255,.85);margin:8px 0 0">У вас новый гость</p>
      </div>
      <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:40%">Гость:</td><td style="padding:8px 0;font-weight:bold;color:#111">${data.guestName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email:</td><td style="padding:8px 0;color:#111"><a href="mailto:${data.guestEmail}">${data.guestEmail}</a></td></tr>
          ${data.guestPhone ? `<tr><td style="padding:8px 0;color:#666">Телефон:</td><td style="padding:8px 0;color:#111">${data.guestPhone}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666">Даты:</td><td style="padding:8px 0;color:#111">📅 ${data.checkIn} → ${data.checkOut}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Гостей:</td><td style="padding:8px 0;color:#111">👥 ${data.guests}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Сумма:</td><td style="padding:8px 0;font-weight:bold;color:#D4001A;font-size:18px">💵 $${data.totalPrice}</td></tr>
          ${data.message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Сообщение:</td><td style="padding:8px 0;color:#111;font-style:italic">"${data.message}"</td></tr>` : ""}
        </table>
        <div style="margin-top:20px;padding:16px;background:#fff3cd;border-radius:8px;border-left:4px solid #F2A900">
          <p style="margin:0;color:#856404;font-size:14px">Свяжитесь с гостем для подтверждения: <a href="mailto:${data.guestEmail}" style="color:#D4001A">ответить</a></p>
        </div>
      </div>
    </div>`;
}

/**
 * Build a service booking notification email for the host.
 */
export function buildServiceEmailHtml(data: {
  guestName: string;
  serviceTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice?: number;
  guestPhone?: string;
}): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#D4001A,#F2A900);padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">🔔 Новый заказ услуги</h1>
      </div>
      <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:40%">Гость:</td><td style="padding:8px 0;font-weight:bold;color:#111">${data.guestName}</td></tr>
          ${data.guestPhone ? `<tr><td style="padding:8px 0;color:#666">Телефон:</td><td style="padding:8px 0;color:#111">${data.guestPhone}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666">Услуга:</td><td style="padding:8px 0;font-weight:bold;color:#111">${data.serviceTitle}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Дата:</td><td style="padding:8px 0;color:#111">📅 ${data.date}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Время:</td><td style="padding:8px 0;color:#111">⏰ ${data.startTime} — ${data.endTime}</td></tr>
          ${data.totalPrice ? `<tr><td style="padding:8px 0;color:#666">Сумма:</td><td style="padding:8px 0;font-weight:bold;color:#D4001A">💵 $${data.totalPrice}</td></tr>` : ""}
        </table>
        <div style="margin-top:20px;text-align:center">
          <a href="https://hay-home.com/dashboard" style="background:linear-gradient(135deg,#D4001A,#F2A900);color:#fff;padding:12px 24px;border-radius:20px;text-decoration:none;font-weight:bold">Открыть dashboard</a>
        </div>
      </div>
    </div>`;
}

export async function sendContractEmail(data: { hostId: string; familyName: string; name: string; email: string; lang: string; }) {
  const transporter = getTransporter();
  if (!transporter) return;
  const contractUrl = `https://hay-home.com/contract/print?hostId=${data.hostId}&lang=${data.lang}`;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#D4001A,#F2A900);padding:30px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">📄 Договор о сотрудничестве</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">HayHome</p>
      </div>
      <div style="padding:30px">
        <p>Здравствуйте, <strong>${data.name}</strong>!</p>
        <p style="color:#666;line-height:1.6;margin-top:16px">Ваша заявка принята. <a href="${contractUrl}" style="color:#D4001A;font-weight:bold">Откройте договор о сотрудничестве</a>, распечатайте или отправьте через мессенджер.</p>
      </div>
      <div style="background:#f9f9f9;padding:20px;text-align:center;color:#999;font-size:12px">© 2026 HayHome</div>
    </div>`;
  await transporter.sendMail({ from: process.env.GMAIL_USER, to: data.email, subject: `HayHome — Договор о сотрудничестве`, html });
}
