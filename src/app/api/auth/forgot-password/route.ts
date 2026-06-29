import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";
import nodemailer from "nodemailer";
import { SignJWT } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new TextEncoder().encode("dev-only-not-for-production");
  return new TextEncoder().encode(secret);
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const { email } = await req.json();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const user = await getUserByEmail(email);

  // Не раскрываем существует ли email
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Генерируем reset-токен (15 минут)
  const token = await new SignJWT({ id: user.id, email: user.email, purpose: "reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(getSecret());

  const resetLink = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase.co", "") || ""}https://hay-home.com/reset-password?token=${token}`;
  const correctLink = `https://hay-home.com/reset-password?token=${token}`;

  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("[Email] GMAIL_APP_PASSWORD not set");
    return NextResponse.json({ ok: true });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "hayhome.arm@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"HayHome 🇦🇲" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🔐 Восстановление пароля — HayHome",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4001A, #F2A900); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🔐 Восстановление пароля</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <p style="color: #333; font-size: 16px;">Привет, <strong>${user.name}</strong>!</p>
          <p style="color: #555;">Вы запросили восстановление пароля для аккаунта <strong>${email}</strong>.</p>
          <p style="color: #555;">Ссылка действительна <strong>15 минут</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${correctLink}" style="background: linear-gradient(135deg, #D4001A, #F2A900); color: white; padding: 14px 32px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p style="color: #999; font-size: 13px;">Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
