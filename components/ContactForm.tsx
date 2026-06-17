"use client";

import { FormEvent, useState } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.email.trim()) {
      next.email = "Email is required.";
    } else if (!emailPattern.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!values.subject.trim()) next.subject = "Subject is required.";
    if (!values.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      let data: { ok?: true; error?: string; errors?: FieldErrors };
      try {
        data = await res.json();
      } catch {
        setServerError("Server returned an unexpected response. Please try again.");
        return;
      }

      if (res.ok) {
        setSubmitted(true);
        return;
      }

      if (data.errors) {
        setErrors(data.errors);
        return;
      }

      if (data.error) {
        setServerError(data.error);
        return;
      }

      setServerError("Something went wrong. Please try again.");
    } catch (err) {
      console.error("Contact form error:", err);
      setServerError(
        "Could not reach the server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-card border border-success/30 bg-green-50 p-6 text-body"
      >
        <p className="font-semibold text-navy">Message sent — thank you!</p>
        <p className="mt-2 text-sm">
          We read every message and usually reply within one business day. If
          it&apos;s urgent, email us directly at{" "}
          <a
            className="text-primary hover:underline"
            href="mailto:tothewebpro@gmail.com"
          >
            tothewebpro@gmail.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} method="post" action="#" className="space-y-4" noValidate>
      {serverError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-card border border-error/30 bg-red-50 p-4 text-sm text-error"
        >
          {serverError}
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-navy">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          disabled={submitting}
        />
        {errors.name ? (
          <p id="contact-name-error" role="alert" className="mt-1 text-sm text-error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          disabled={submitting}
        />
        {errors.email ? (
          <p id="contact-email-error" role="alert" className="mt-1 text-sm text-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium text-navy">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          value={values.subject}
          onChange={(e) =>
            setValues((v) => ({ ...v, subject: e.target.value }))
          }
          className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          disabled={submitting}
        />
        {errors.subject ? (
          <p id="contact-subject-error" role="alert" className="mt-1 text-sm text-error">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-navy">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) =>
            setValues((v) => ({ ...v, message: e.target.value }))
          }
          className="mt-1 w-full rounded-input border border-slate-200 px-3 py-2 text-sm text-navy outline-none ring-primary/30 focus:ring-2"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          disabled={submitting}
        />
        {errors.message ? (
          <p id="contact-message-error" role="alert" className="mt-1 text-sm text-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="rounded-input bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Send contact message"
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
