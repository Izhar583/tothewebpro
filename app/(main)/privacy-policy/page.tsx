import type { Metadata } from "next";
import { ShieldCheck, Database, Cookie, Megaphone, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ToTheWebPro handles personal data, cookies, analytics, and advertising partners including Google AdSense.",
  alternates: { canonical: "https://tothewebpro.com/privacy-policy" },
};

const EFFECTIVE = "4 May 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 border border-cyan-200 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-slate-500 font-medium">Last updated: {EFFECTIVE}</p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-cyan-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Who we are</h2>
          </div>
          <p className="text-slate-600 leading-relaxed pl-14">
            ToTheWebPro (&quot;we&quot;, &quot;us&quot;) operates the website{" "}
            <span className="font-semibold text-slate-900">https://tothewebpro.com</span>{" "}
            and related online tools. This policy explains how we collect, use, and
            safeguard information when you visit or interact with our services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Data we collect</h2>
          </div>
          <div className="pl-14 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 mb-1">Usage and technical data</strong>
              <p className="text-slate-600 text-sm leading-relaxed">
                We collect standard server and analytics information such as approximate
                location derived from IP address, device type, browser version,
                referring URL, pages viewed, and timestamps. This helps us understand
                performance, detect abuse, and improve reliability.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 mb-1">Information you submit</strong>
              <p className="text-slate-600 text-sm leading-relaxed">
                If you use the contact form, we process the name, email address, subject, and
                message you provide so we can respond. Please do not send sensitive
                personal data or confidential business secrets through the form.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <strong className="block text-slate-900 mb-1">Tool inputs</strong>
              <p className="text-slate-600 text-sm leading-relaxed">
                Most text and image utilities execute locally in your browser. When a feature
                requires a server round-trip—such as fetching meta tags from a public
                URL—we process the request transiently to return results and do not use
                the content to train third-party models.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-amber-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cookie className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Cookies and similar technologies</h2>
          </div>
          <p className="text-slate-600 leading-relaxed pl-14">
            We use cookies and local storage where necessary for core
            functionality, preferences, fraud prevention, and aggregated analytics.
            You can control cookies through your browser settings; disabling
            certain cookies may limit parts of the experience.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Google AdSense</h2>
          </div>
          <div className="pl-14 space-y-3">
            <p className="text-slate-600 leading-relaxed">
              ToTheWebPro is ad-supported. Google AdSense and related Google
              advertising partners may use cookies, mobile advertising IDs, or
              similar technologies to serve and measure ads, personalise content
              where permitted, and limit how often you see a campaign. Google&apos;s use of
              advertising cookies enables it and its partners to show ads based on
              your visits to this site and others on the open web.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You can learn how Google uses data when you use our partners&apos; sites or
              apps by reviewing Google&apos;s Privacy &amp; Terms resources. Where
              required, we will surface consent tools to manage advertising storage
              and personalised versus non-personalised ads.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Your rights</h2>
          </div>
          <p className="text-slate-600 leading-relaxed pl-14">
            Depending on your location, you may have rights to access, rectify,
            erase, restrict, or port personal data, and to object to processing.
            You may also lodge a complaint with your local supervisory authority.
            To exercise rights, email{" "}
            <a href="mailto:izharjoiya0@gmail.com" className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
              izharjoiya0@gmail.com
            </a>
            {" "}with sufficient detail for us to verify and fulfil your request.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Questions about privacy?</h2>
            <p className="text-slate-400 mb-6">Reach out to us directly and we&apos;ll get back to you.</p>
            <a href="mailto:izharjoiya0@gmail.com" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-colors">
              izharjoiya0@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}