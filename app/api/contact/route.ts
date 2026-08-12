import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL || user;

    if (!user || !pass || !to) {
      console.error("[contact] Missing SMTP env vars");
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"ToTheWebPro Contact" <${user}>`,
      to,
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:12px;margin-top:0;">New Contact Form Message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#374151;font-weight:bold;width:80px;">Name:</td><td style="padding:8px 0;color:#111827;">${name.trim()}</td></tr>
            <tr><td style="padding:8px 0;color:#374151;font-weight:bold;">Email:</td><td style="padding:8px 0;"><a href="mailto:${email.trim()}" style="color:#ea580c;">${email.trim()}</a></td></tr>
            <tr><td style="padding:8px 0;color:#374151;font-weight:bold;">Subject:</td><td style="padding:8px 0;color:#111827;">${subject.trim()}</td></tr>
          </table>
          <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;">
            <p style="margin:0;color:#374151;white-space:pre-wrap;line-height:1.6;">${message.trim()}</p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#9ca3af;">Sent via ToTheWebPro Contact Form</p>
        </div>
      `,
    });

    console.log(`[contact] Email sent — from: ${email}, subject: ${subject}`);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[contact] Error:", msg);
    return NextResponse.json({ error: "Failed to send email. Please try again or email us directly." }, { status: 500 });
  }
}
