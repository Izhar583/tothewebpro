import type { Metadata } from "next";
import { CheckCircle2, AlertTriangle, ShieldAlert, Copyright, ExternalLink, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | ToTheWebPro",
  description:
    "Read the Terms of Service for ToTheWebPro. By using our free online tools, you agree to the conditions outlined in this page.",
  alternates: { canonical: "https://tothewebpro.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">Terms of Service</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Terms governing use of ToTheWebPro tools, acceptable use, disclaimers, and intellectual property.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200 shadow-sm">
        <p className="text-slate-600 text-lg leading-relaxed text-center">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of ToTheWebPro&apos;s website, applications, and related services (collectively, the &quot;Services&quot;). <span className="font-semibold text-slate-900">By using the Services, you agree to these Terms. If you disagree, do not use the Services.</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Acceptable use</h2>
          </div>
          <p className="text-slate-600 leading-relaxed pl-14">
            You agree not to misuse the Services. Prohibited behaviour includes
            attempting to probe, scan, or test the vulnerability of any system;
            interfering with or circumventing security or access controls;
            submitting unlawful, infringing, or harmful content; using automated
            means in a way that imposes an unreasonable load on our
            infrastructure; or attempting to access data that does not belong to
            you. We reflect respect for our infrastructure and users. We may suspend or terminate access for violations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-red-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No warranty</h2>
          </div>
          <div className="pl-14">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 uppercase text-xs font-bold text-slate-500 tracking-wider leading-relaxed">
              The Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties
              of any kind, whether express, implied, or statutory, including
              implied warranties of merchantability, fitness for a particular
              purpose, title, and non-infringement. We do not warrant that the
              services will be uninterrupted, error-free, or free of harmful
              components, or that results from tools will be accurate or suitable
              for your regulatory or compliance needs.
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-orange-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Limitation of liability</h2>
          </div>
          <div className="pl-14">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 uppercase text-xs font-bold text-slate-500 tracking-wider leading-relaxed">
              To the maximum extent permitted by law, ToTheWebPro and its team will
              not be liable for any indirect, incidental, special, consequential,
              or exemplary damages, or any loss of profits, goodwill, data, or
              other intangible losses, arising out of or related to your use of the
              services. Our aggregate liability for any claim arising from the
              services will not exceed the greater of (a) the amounts you paid us for
              the services in the twelve months preceding the claim or (b) one
              hundred us dollars.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Copyright className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Intellectual property</h2>
          </div>
          <p className="text-slate-600 leading-relaxed pl-14">
            The Services, including branding, design, text, visual assets, and
            underlying software, are owned by ToTheWebPro or its licensors and are
            protected by intellectual property laws. Subject to these Terms, we
            grant you a limited, revocable, non-exclusive, non-transferable
            licence to access and use the Services for personal or internal
            business purposes. You may not copy, modify, distribute, sell, or
            lease any part of the Services without our prior written consent.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Section 5 */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-teal-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Third-party services</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              The Services may integrate or link to third-party tools, including
              advertising and analytics providers. Those services are governed by
              their own terms and privacy policies, and we are not responsible for
              their practices.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Changes</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              We may modify the Services or these Terms at any time. We will post
              updates on this page and, where appropriate, provide additional
              notice. Continued use after changes constitutes acceptance.
            </p>
          </section>
        </div>

        {/* Section 7 */}
        <section className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center relative overflow-hidden mt-6">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Legal Enquiries</h2>
            <p className="text-slate-400 mb-6">If you have any questions regarding these terms, please contact us.</p>
            <a href="mailto:izharjoiya0@gmail.com" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-900 font-bold transition-colors">
              izharjoiya0@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}