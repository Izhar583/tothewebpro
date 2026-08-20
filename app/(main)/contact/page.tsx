import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact ToTheWebPro | Get in Touch With Our Team",
  description:
    "Have a question or feedback? Contact the ToTheWebPro team. We are happy to help with tool requests, partnerships, or general inquiries.",
  alternates: { canonical: "https://tothewebpro.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden py-16 lg:py-24">
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 opacity-30 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl leading-tight">
                Let&apos;s build something <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">great</span> together.
              </h1>
              
              <p className="mt-6 text-lg text-slate-600 font-medium leading-relaxed">
                Have a question about our tools? Found a bug? Or just want to propose a new feature?
                We read every single message and usually reply within one business day.
              </p>
            </div>

            {/* Support Options Cards */}
            <div className="space-y-6">
              
              {/* Email Card */}
              <div className="group flex gap-5 p-6 rounded-2xl border border-orange-100/80 bg-white/60 shadow-sm hover:border-orange-200 transition-all duration-300 backdrop-blur-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Email Us</h3>
                  <p className="text-sm text-slate-500 font-medium">For general inquiries and support</p>
                  <a href="mailto:tothewebpro@gmail.com" className="mt-2 inline-flex items-center font-bold text-orange-600 hover:text-orange-700 hover:underline">
                    tothewebpro@gmail.com
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Help Center Card */}
              <div className="group flex gap-5 p-6 rounded-2xl border border-orange-100/80 bg-white/60 shadow-sm hover:border-orange-200 transition-all duration-300 backdrop-blur-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50/80 text-amber-600 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Help Center</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Check our Frequently Asked Questions (FAQ) section on any tool page for instant support.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form Side - Right 7 Columns */}
          <div className="lg:col-span-7 relative">
            {/* Glowing accent border effect */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-10 blur-lg transition duration-1000 group-hover:opacity-20" aria-hidden="true" />
            
            {/* Main Form Container */}
            <div className="relative rounded-3xl border border-orange-100 bg-white/70 p-8 shadow-xl shadow-orange-100/30 backdrop-blur-xl sm:p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Send a message</h2>
              <ContactForm />
            </div>

            <div 
              className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 opacity-30 hidden sm:block" 
              style={{ 
                backgroundImage: 'radial-gradient(#f97316 1.5px, transparent 1.5px)', 
                backgroundSize: '16px 16px' 
              }} 
              aria-hidden="true"
            />
          </div>

        </div>
      </div>
    </div>
  );
}