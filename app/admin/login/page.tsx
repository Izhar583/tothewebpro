"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }

      // Successful login -> Redirect
      router.push(returnUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to log in. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070f1e] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main 2-Column Container: Left side logo, Right side admin panel */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Logo & Brand Showcase */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <Link href="/" className="group inline-block">
            <div className="relative h-20 w-64 sm:h-24 sm:w-72 drop-shadow-[0_10px_25px_rgba(234,88,12,0.2)]">
              <Image
                src="/logo-silver.png"
                alt="ToTheWebPro"
                fill
                sizes="(max-width: 768px) 256px, 288px"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-orange-400" />
              <span>Enterprise Content &amp; SEO Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Manage Your Digital Presence with Speed &amp; Precision.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-lg leading-relaxed">
              Create, edit, and publish blog articles, optimize SEO metadata, and monitor performance in one unified portal.
            </p>
          </div>

          {/* Key Feature Highlights */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-xs font-semibold text-slate-300">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Full Blog Publishing Suite</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-xs font-semibold text-slate-300">
              <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
              <span>Live SEO &amp; Meta Tools</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-xs font-semibold text-slate-300">
              <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
              <span>Markdown &amp; Rich Editor</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-xs font-semibold text-slate-300">
              <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
              <span>Secure Session Protection</span>
            </div>
          </div>

          {/* Return to website link */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors"
            >
              <Globe size={14} />
              <span>Visit Live Website</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Side: Admin Panel Login Box */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative">
            {/* Header / Badge */}
            <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Admin Panel
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in to access your administration dashboard
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-wider shrink-0">
                <ShieldCheck size={14} />
                <span>Protected</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:bg-slate-950 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 focus:border-orange-500 focus:bg-slate-950 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-all disabled:opacity-50 text-sm cursor-pointer"
              >
                {loading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Log In to Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Restricted System Area</span>
              <span className="font-semibold text-slate-400">Authorized Access Only</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
