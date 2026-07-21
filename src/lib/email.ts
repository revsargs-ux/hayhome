import nodemailer from "nodemailer";

const ADMIN_EMAIL = "hayhome.arm@gmail.com";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || ADMIN_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// ── Уведомление о новой заявке на бронирование ──
export async function sendBookingNotification(data: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  message?: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("[Email] GMAIL_APP_PASSWORD not set, skipping email");
    return;
  }

  const transporter = getTransporter();

  // Письмо администратору
  await transporter.sendMail({
    from: `"HayHome" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🏡 Новое бронирование — ${data.hostName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4001A, #F2A900); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🏡 Новое бронирование</h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 40%;">Семья:</td><td style="padding: 8px 0; font-weight: bold; color: #111;">${data.hostName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Гость:</td><td style="padding: 8px 0; font-weight: bold; color: #111;">${data.guestName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Страна:</td><td style="padding: 8px 0; color: #111;">${data.guestCountry}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0; color: #111;"><a href="mailto:${data.guestEmail}">${data.guestEmail}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Телефон:</td><td style="padding: 8px 0; color: #111;">${data.guestPhone || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Даты:</td><td style="padding: 8px 0; color: #111;">📅 ${data.checkIn} → ${data.checkOut}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Гостей:</td><td style="padding: 8px 0; color: #111;">👥 ${data.guests}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Сумма:</td><td style="padding: 8px 0; font-weight: bold; color: #D4001A; font-size: 18px;">🆓 Бесплатно</td></tr>
            ${data.message ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Сообщение:</td><td style="padding: 8px 0; color: #111; font-style: italic;">"${data.message}"</td></tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #F2A900;">
            <p style="margin: 0; color: #856404; font-size: 14px;">⚡ Перейдите в <a href="https://hay-home.com/admin" style="color: #D4001A;">Админ-панель</a> чтобы подтвердить или отклонить заявку.</p>
          </div>
        </div>
      </div>
    `,
  });

  // Письмо гостю — подтверждение
  await transporter.sendMail({
    from: `"HayHome 🇦🇲" <${ADMIN_EMAIL}>`,
    to: data.guestEmail,
    subject: `✅ Bari Ekeq! Ваша заявка получена — ${data.hostName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4001A, #F2A900); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Bari Ekeq! 🇦🇲</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Добро пожаловать в Армению!</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <p style="color: #333; font-size: 16px;">Привет, <strong>${data.guestName}</strong>!</p>
          <p style="color: #555;">Ваша заявка на визит к семье <strong>${data.hostName}</strong> успешно получена. Семья свяжется с вами в течение <strong>24 часов</strong>.</p>
          <div style="background: #fdf6ec; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #333; margin: 0 0 16px; font-size: 16px;">📋 Детали вашего визита:</h3>
            <p style="margin: 6px 0; color: #555;">🏡 <strong>${data.hostName}</strong></p>
            <p style="margin: 6px 0; color: #555;">📅 ${data.checkIn} → ${data.checkOut}</p>
            <p style="margin: 6px 0; color: #555;">👥 Гостей: ${data.guests}</p>
            <p style="margin: 6px 0; color: #D4001A; font-weight: bold; font-size: 18px;">🆓 Проживание бесплатное</p>
          </div>
          <p style="color: #777; font-size: 14px;">Если у вас есть вопросы — напишите нам: <a href="mailto:${ADMIN_EMAIL}" style="color: #D4001A;">${ADMIN_EMAIL}</a></p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://hay-home.com/hosts" style="background: linear-gradient(135deg, #D4001A, #F2A900); color: white; padding: 14px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
              Посмотреть другие семьи
            </a>
          </div>
        </div>
        <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 16px;">
          🇦🇲 HayHome — Армения через сердце семьи · <a href="https://hay-home.com" style="color: #aaa;">hay-home.com</a>
        </p>
      </div>
    `,
  });
}

// ── Уведомление о новой заявке хозяина ──
export async function sendHostApplicationNotification(data: {
  familyName: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  pricePerNight: number;
  description: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("[Email] GMAIL_APP_PASSWORD not set, skipping email");
    return;
  }

  const transporter = getTransporter();

  // Письмо администратору
  await transporter.sendMail({
    from: `"HayHome" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🏠 Новая заявка хозяина — ${data.familyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0033A0, #D4001A); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🏠 Новая заявка хозяина</h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 40%;">Семья:</td><td style="padding: 8px 0; font-weight: bold; color: #111;">${data.familyName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Контактное лицо:</td><td style="padding: 8px 0; color: #111;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0; color: #111;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Телефон:</td><td style="padding: 8px 0; color: #111;">${data.phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Город:</td><td style="padding: 8px 0; color: #111;">${data.city}, ${data.region}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Стоимость:</td><td style="padding:8px 0;font-weight:bold;color:#16a34a;">🆓 Бесплатно</td></tr>
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Описание:</td><td style="padding: 8px 0; color: #111; font-style: italic;">"${data.description}"</td></tr>
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://hay-home.com/admin" style="background: linear-gradient(135deg, #D4001A, #F2A900); color: white; padding: 12px 24px; border-radius: 20px; text-decoration: none; font-weight: bold; display: inline-block;">
              Открыть в Админ-панели
            </a>
          </div>
        </div>
      </div>
    `,
  });

  // Письмо заявителю
  await transporter.sendMail({
    from: `"HayHome 🇦🇲" <${ADMIN_EMAIL}>`,
    to: data.email,
    subject: "✅ Ваша заявка на HayHome получена!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4001A, #F2A900); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Bari Ekeq! 🇦🇲</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <p style="color: #333; font-size: 16px;">Здравствуйте, <strong>${data.name}</strong>!</p>
          <p style="color: #555;">Заявка семьи <strong>${data.familyName}</strong> успешно получена. Наш менеджер свяжется с вами в течение <strong>24–48 часов</strong> для верификации.</p>
          <div style="background: #fdf6ec; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #333; margin: 0 0 12px;">Следующие шаги:</h3>
            <p style="margin: 6px 0; color: #555;">✅ Ожидайте звонка от нашего менеджера</p>
            <p style="margin: 6px 0; color: #555;">✅ Подготовьте документы (паспорт)</p>
            <p style="margin: 6px 0; color: #555;">✅ Наш инспектор посетит ваш дом</p>
            <p style="margin: 6px 0; color: #555;">✅ После верификации — вы в системе!</p>
          </div>
          <p style="color: #777; font-size: 14px;">По вопросам: <a href="mailto:${ADMIN_EMAIL}" style="color: #D4001A;">${ADMIN_EMAIL}</a></p>
        </div>
      </div>
    `,
  });
}

export async function sendPayoutRequestNotification(data: {
  partnerName: string;
  partnerEmail: string;
  amount: number;
  method: string;
  details: string;
  partnerCode: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  const transporter = getTransporter();
  const methodLabels: Record<string, string> = { idram: "Idram", bank_transfer: "Банк", crypto: "Крипта" };

  await transporter.sendMail({
    from: `"HayHome" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `💰 Запрос вывода $${data.amount} — ${data.partnerName} (${data.partnerCode})`,
    html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#0033A0,#F2A900);padding:24px;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0">💰 Запрос вывода средств</h1></div>
      <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Партнёр:</td><td style="padding:8px 0;font-weight:bold">${data.partnerName} (${data.partnerCode})</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email:</td><td style="padding:8px 0">${data.partnerEmail}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Сумма:</td><td style="padding:8px 0;font-weight:bold;color:#D4001A">$${data.amount}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Способ:</td><td style="padding:8px 0">${methodLabels[data.method]||data.method}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Реквизиты:</td><td style="padding:8px 0"><code>${data.details}</code></td></tr>
        </table>
        <div style="margin-top:20px;text-align:center">
          <a href="https://hay-home.com/admin" style="background:linear-gradient(135deg,#D4001A,#F2A900);color:white;padding:12px 24px;border-radius:20px;text-decoration:none;font-weight:bold">Открыть админку</a></div>
      </div></div>`,
  });

  await transporter.sendMail({
    from: `"HayHome 🇦🇲" <${ADMIN_EMAIL}>`,
    to: data.partnerEmail,
    subject: `✅ Запрос на вывод $${data.amount} получен`,
    html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#D4001A,#F2A900);padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0">Bari Ekeq! 🇦🇲</h1></div>
      <div style="background:white;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
        <p style="color:#333">Запрос на вывод <strong>$${data.amount}</strong> через <strong>${methodLabels[data.method]||data.method}</strong> отправлен.</p>
        <div style="background:#fdf6ec;border-radius:12px;padding:20px;margin:24px 0">
          <p style="margin:6px 0;color:#555">⏳ Админ проверит в течение <strong>24–48 часов</strong></p>
          <p style="margin:6px 0;color:#555">✅ После подтверждения — деньги будут отправлены</p>
          <p style="margin:6px 0;color:#555">📧 Уведомление придёт на этот email</p></div>
        <p style="color:#777;font-size:14px">По вопросам: <a href="mailto:${ADMIN_EMAIL}" style="color:#D4001A">${ADMIN_EMAIL}</a></p>
      </div></div>`,
  });
}

export async function sendPayoutDecisionNotification(data: {
  partnerEmail: string;
  partnerName: string;
  amount: number;
  decision: "confirmed" | "rejected";
  reason?: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  const transporter = getTransporter();
  const ok = data.decision === "confirmed";
  await transporter.sendMail({
    from: `"HayHome 🇦🇲" <${ADMIN_EMAIL}>`,
    to: data.partnerEmail,
    subject: `${ok?"✅":"❌"} Вывод $${data.amount} — ${ok?"Подтверждён":"Отклонён"}`,
    html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
      <div style="background:${ok?"linear-gradient(135deg,#16a34a,#22c55e)":"linear-gradient(135deg,#dc2626,#ef4444)"};padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0">${ok?"💰 Деньги в пути!":"❌ Вывод отклонён"}</h1></div>
      <div style="background:white;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
        <p style="color:#333">${ok
          ?`Вывод <strong>$${data.amount}</strong> подтверждён. Деньги зачислятся в течение 1–3 рабочих дней.`
          :`Запрос на вывод <strong>$${data.amount}</strong> отклонён.${data.reason?" Причина: <em>"+data.reason+"</em>":""}`
        }</p>
        ${!ok?"<p style=\"color:#555\">Баланс возвращён на ваш счёт.</p>":""}
        <p style="color:#777;font-size:14px;margin-top:20px">По вопросам: <a href=\"mailto:${ADMIN_EMAIL}\" style=\"color:#D4001A\">${ADMIN_EMAIL}</a></p>
      </div></div>`,
  });
}

export async function sendServiceBookingNotification(data: {
  providerName: string;
  providerEmail: string;
  serviceTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  guestName: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"HayHome 🇦🇲" <${ADMIN_EMAIL}>`,
    to: data.providerEmail,
    subject: `🔔 Новый заказ: ${data.serviceTitle} — ${data.date}`,
    html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#D4001A,#F2A900);padding:24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0">🔔 Новый заказ услуги</h1></div>
      <div style="background:white;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5">
        <p style="color:#333;font-size:16px"><strong>${data.guestName}</strong> заказал(а) вашу услугу:</p>
        <table style="width:100%;color:#555;font-size:15px;margin:16px 0">
          <tr><td style="padding:4px 0;color:#999">Услуга:</td><td style="padding:4px 0;font-weight:bold">${data.serviceTitle}</td></tr>
          <tr><td style="padding:4px 0;color:#999">Дата:</td><td style="padding:4px 0;font-weight:bold">${data.date}</td></tr>
          <tr><td style="padding:4px 0;color:#999">Время:</td><td style="padding:4px 0;font-weight:bold">${data.startTime} — ${data.endTime}</td></tr>
        </table>
        <p style="color:#555">Откройте чат на платформе, чтобы подтвердить или обсудить детали.</p>
        <div style="text-align:center;margin:24px 0">
          <a href="https://hay-home.com/provider/dashboard" style="background:linear-gradient(135deg,#D4001A,#F2A900);color:white;padding:14px 32px;border-radius:24px;text-decoration:none;font-weight:bold">Открыть dashboard</a>
        </div>
      </div></div>`,
  });
}
