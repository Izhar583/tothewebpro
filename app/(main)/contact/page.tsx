import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact ToTheWebPro",
  description:
    "Reach the ToTheWebPro team for partnerships, press, or product feedback. We usually reply within 24 hours.",
  alternates: { canonical: "https://tothewebpro.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden pt-16 pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 opacity-20 [mask-image:radial-gradient(closest-side,white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Connect</span>
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Let&apos;s build something <span className="text-cyan-400">great</span> together.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Have a question about our tools? Found a bug? Or just want to propose a new feature?
                We read every single message and usually reply within one business day.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Email Us</h3>
                  <p className="text-slate-400">For general inquiries and support</p>
                  <a href="mailto:contact@tothewebpro.com" className="mt-1 block font-semibold text-cyan-400 hover:underline">
                    contact@tothewebpro.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Help Center</h3>
                  <p className="text-slate-400">Check our FAQ section on tool pages for instant answers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-xl sm:p-10">
              <h2 className="text-2xl font-bold text-white mb-8">Send a message</h2>
              <ContactForm />
            </div>

            {/* Decorative dot grid */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 opacity-20" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}