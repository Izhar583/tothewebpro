"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg("Please fill in all fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-900">Message Sent!</h3>
        <p className="mb-6 text-sm text-slate-600">
          We&apos;ve received your message and will reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="rounded-xl bg-orange-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-95"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {status === "error" && errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={status === "loading"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            disabled={status === "loading"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Subject
        </label>
        <input
          id="cf-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help you?"
          disabled={status === "loading"}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Message
        </label>
        <textarea
          id="cf-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us more about your project..."
          disabled={status === "loading"}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Sending...</span>
          </>
        ) : (
          "Send Message →"
        )}
      </button>
    </form>
  );
}
