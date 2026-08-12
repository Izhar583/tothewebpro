import type { Metadata } from "next";
import { Users, Zap, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About ToTheWebPro | Free Web Tools Built for Everyone",
  description:
    "Learn about ToTheWebPro and our mission to provide free, easy to use web tools for marketers, developers, and content creators worldwide.",
  alternates: { canonical: "https://tothewebpro.com/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Our Story</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
          Tools built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Speed</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Efficiency</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          We build fast, free, and reliable utilities for SEO professionals, developers, and content creators who need results in seconds, not minutes.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Built out of frustration</h3>
          <p className="text-slate-600 leading-relaxed">
            ToTheWebPro started because too many tools are buried behind paywalls, cluttered with popups, or simply too slow. We wanted utilities you can open, use, and close without creating an account.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">For the professionals</h3>
          <p className="text-slate-600 leading-relaxed">
            Whether you&apos;re an SEO checking snippets, a writer counting words, or a developer compressing images before committing—our workflows are tailored for people who value their time.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Privacy by design</h3>
          <p className="text-slate-600 leading-relaxed">
            Most of our tools run entirely in your browser. When you compress an image or convert text, nothing leaves your device. We respect your data by not collecting it in the first place.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Community driven</h3>
          <p className="text-slate-600 leading-relaxed">
            We deliberately keep our tool list short to ensure quality over quantity. New tools are added based on actual user requests. If you have an idea that can save people time, let us know!
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How free stays free</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            We keep ads on the site to maintain our infrastructure, but our rules are simple: ads sit outside the workspace, never auto-play audio, and never cover content. The user experience always comes first.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-slate-900 bg-white rounded-xl hover:bg-orange-50 transition-colors">
            Get in touch with us
          </a>
        </div>
      </div>
    </div>
  );
}