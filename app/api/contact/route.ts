import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
  // SMTP Configuration
  // -------------------------------------------------------------------------
  const requiredEnv = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "CONTACT_EMAIL",
  ];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    console.error("Missing SMTP environment variables:", missingEnv);
    
    // In development, show error. In production, return 501.
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { error: `Missing configuration: ${missingEnv.join(", ")}` },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Email delivery is not yet configured. Please email us directly at izharjoiya0@gmail.com.",
      },
      { status: 501 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST?.trim(),
      port: Number(process.env.SMTP_PORT?.trim()),
      secure: process.env.SMTP_SECURE?.trim().toLowerCase() === "true", // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER?.trim(),
        pass: process.env.SMTP_PASS?.trim(),
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // From user (authenticated)
      to: process.env.CONTACT_EMAIL, // To owner
      replyTo: email, // Reply to the person who sent the form
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Sent from ToTheWebPro Contact Form</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("SMTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }
}
