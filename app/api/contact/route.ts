import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = body;

  // Server-side validation
  const errors: Record<string, string> = {};
  if (!name?.trim()) errors.name = "Name is required.";
  if (!email?.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!subject?.trim()) errors.subject = "Subject is required.";
  if (!message?.trim()) errors.message = "Message is required.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // -------------------------------------------------------------------------
  // EMAIL DELIVERY
  // To go live, replace this block with your preferred provider:
  //
  // Option A — Resend (recommended, 100 free emails/day):
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({ from: "noreply@yourdomain.com", to: "izharjoiya0@gmail.com", subject, html: `<p>${message}</p>` });
  //
  // Option B — SendGrid:
  //   Use @sendgrid/mail with process.env.SENDGRID_API_KEY
  //
  // Option C — Nodemailer (SMTP):
  //   Use process.env.SMTP_HOST / SMTP_USER / SMTP_PASS
  // -------------------------------------------------------------------------

  // Development / demo: log to console so you can verify the route works
  // before wiring a real email provider.
  if (process.env.NODE_ENV === "development") {
    console.info("[contact form]", { name, email, subject, message });
  }

  // In production without an email provider configured, return 501 so the
  // form shows an actionable error rather than silently eating the message.
  const hasEmailProvider = Boolean(
    process.env.RESEND_API_KEY ||
      process.env.SENDGRID_API_KEY ||
      process.env.SMTP_HOST,
  );

  if (!hasEmailProvider && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Email delivery is not yet configured. Please email us directly at izharjoiya0@gmail.com.",
      },
      { status: 501 },
    );
  }

  // If an email provider is configured, send the email via SMTP
  if (hasEmailProvider) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `[Contact] ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    });
  }

  // Return success response
  return NextResponse.json({ ok: true }, { status: 200 });
}
