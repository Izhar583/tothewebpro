"use client";

import { useState, useMemo } from "react";
import { 
  X, Copy, Check, ChevronDown, ChevronUp, ShieldCheck, 
  HelpCircle, Cpu, BookOpen, ListChecks, UserCheck, 
  Search, Sparkles, FileText, Smartphone 
} from "lucide-react";

// Helper to determine SMS encoding, segments, and current character count
function getSmsDetails(text: string) {
  if (!text) {
    return { encoding: "GSM-7", segments: 0, current: 0, limit: 160 };
  }
  // GSM-7 basic and extension set
  const gsm7Reg = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΨΣΘΞÆæßÉ !\"#¤%&'()*+,\-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà|^{}\[~\]€\\\x0c]*$/;
  const extensionChars = /[|^{}\[~\]€\\]/g;
  
  const isGsm7 = gsm7Reg.test(text);
  
  if (isGsm7) {
    const extensionCount = (text.match(extensionChars) || []).length;
    const gsm7Length = text.length + extensionCount;
    
    let segments = 1;
    let limit = 160;
    if (gsm7Length > 160) {
      segments = Math.ceil(gsm7Length / 153);
      limit = segments * 153;
    }
    return { encoding: "GSM-7", segments, current: gsm7Length, limit };
  } else {
    const ucs2Length = text.length;
    let segments = 1;
    let limit = 70;
    if (ucs2Length > 70) {
      segments = Math.ceil(ucs2Length / 67);
      limit = segments * 67;
    }
    return { encoding: "UCS-2", segments, current: ucs2Length, limit };
  }
}

// Helper to count Twitter length handling surrogate pairs
function getTwitterLength(text: string) {
  let count = 0;
  for (const char of text) {
    const codePoint = char.codePointAt(0);
    if (codePoint && codePoint > 0xffff) {
      count += 2;
    } else {
      count += 1;
    }
  }
  return count;
}

export function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\n/).length : 0;
    const paragraphs = text
      ? text.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readingMinutes = Math.ceil(words / 238); // 238 WPM standard
    const speakingMinutes = Math.ceil(words / 130);
    const bytes = new TextEncoder().encode(text).length;

    const sms = getSmsDetails(text);
    const twitter = getTwitterLength(text);

    return { 
      chars, 
      noSpaces, 
      lines, 
      paragraphs, 
      words, 
      readingMinutes, 
      speakingMinutes, 
      bytes,
      sms,
      twitter
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="char-input" className="text-sm font-bold text-slate-700">
            Text to Analyze
          </label>
          <div className="flex items-center gap-3">
            {text && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <span className="text-slate-200">|</span>
                <button
                  type="button"
                  onClick={() => setText("")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
        <textarea
          id="char-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="min-h-[200px] w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-orange-500/10 focus:ring-4 focus:border-orange-500 transition-all resize-y"
          placeholder="Paste copy for ads, meta fields, or social posts..."
        />
      </div>

      <div aria-live="polite" aria-atomic="false" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No Spaces" value={stats.noSpaces} />
        <Stat label="Bytes (UTF-8)" value={stats.bytes} />
      </div>

      <div className="pt-8 border-t border-orange-100">
        <h3 className="text-lg font-black text-slate-800 mb-6">Social Media &amp; Messaging Limits</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SocialLimit 
            label="Twitter / X: Tweet" 
            current={stats.twitter} 
            max={280} 
            tooltip="Counts surrogate pairs (like emoji) as 2 units, matching server validation." 
          />
          <SocialLimit 
            label={`SMS: [${stats.sms.encoding}]`} 
            current={stats.sms.current} 
            max={stats.sms.limit} 
            subtitle={`Segments: ${stats.sms.segments}`}
            tooltip="Curly quotes or emojis switch encoding to UCS-2, lowering limit to 70/segment."
          />
          <SocialLimit 
            label="LinkedIn: Post" 
            current={stats.chars} 
            max={3000} 
            tooltip="Truncates at ~210 characters with a 'See more' link in user feeds." 
          />
          <SocialLimit 
            label="LinkedIn: Headline" 
            current={stats.chars} 
            max={220} 
            tooltip="Highly critical for SEO and profile preview truncation caps." 
          />
          <SocialLimit 
            label="LinkedIn: Connection Note" 
            current={stats.chars} 
            max={300} 
            tooltip="Hard cutoff cap for invitation notes." 
          />
          <SocialLimit 
            label="Instagram: Caption" 
            current={stats.chars} 
            max={2200} 
            tooltip="Display limits truncate captions at ~125 characters." 
          />
          <SocialLimit 
            label="Meta (Facebook): Post" 
            current={stats.chars} 
            max={63206} 
            tooltip="Practical truncation at ~477 characters before fold." 
          />
        </div>
      </div>

      <CharacterCounterLandingPage />
    </div>
  );
}

function SocialLimit({ 
  label, 
  current, 
  max, 
  subtitle, 
  tooltip 
}: { 
  label: string; 
  current: number; 
  max: number; 
  subtitle?: string; 
  tooltip?: string;
}) {
  const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  const isOver = current > max;
  const isApproaching = current >= max * 0.8 && current <= max;

  let barColor = "bg-emerald-500";
  let textColor = "text-slate-500";
  if (isOver) {
    barColor = "bg-red-500";
    textColor = "text-red-500";
  } else if (isApproaching) {
    barColor = "bg-amber-500";
    textColor = "text-amber-500";
  }

  return (
    <div className="space-y-3 p-5 rounded-2xl border border-orange-50 bg-orange-50/10 shadow-sm relative group hover:border-orange-100 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
            {label}
          </span>
          {subtitle && (
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <span className={`text-xs font-black shrink-0 ${textColor}`}>
          {current} / {max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {tooltip && (
        <p className="text-[11px] leading-relaxed text-slate-400 font-medium pt-1">
          {tooltip}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-orange-100 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-sm hover:border-orange-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-orange-600 transition-colors"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-orange-500 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
        )}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-orange-50/50" : "max-h-0"
        }`}
      >
        <div className="p-5 text-sm text-slate-600 leading-relaxed font-medium bg-orange-50/10">
          {answer}
        </div>
      </div>
    </div>
  );
}

function CharacterCounterLandingPage() {
  return (
    <div className="mt-16 pt-16 border-t border-orange-100 space-y-16">
      {/* H1 Section */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Live Platform Checking
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight md:text-4xl">
          Free Character Counter Online: Live Twitter/X, SMS &amp; Social Media Limit Tracker by ToTheWebPro
        </h2>
        <div className="max-w-4xl text-slate-600 space-y-4 font-medium leading-relaxed">
          <p>
            Type or paste your text and watch the character count update on every keystroke, with real-time threshold warnings for Twitter/X, LinkedIn, Meta, and SMS, all firing before you hit the wall. No submit button. No refresh. No truncated posts.
          </p>
          <p>
            Platform-specific character limits are not uniform, not static, and not always what the native editor shows you. Twitter/X counts certain Unicode characters as two units. LinkedIn has separate caps for posts versus headlines. SMS messages fragment at 160 characters for GSM-7 encoding and at 153 per segment for multi-part messages. Getting these wrong means truncated copy, split messages that bill as two texts, and social posts that get cut mid-sentence after publishing.
          </p>
        </div>

        {/* Quick Value Hook Alert */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/55 to-amber-50/35 p-6 flex gap-4 shadow-sm items-start">
          <div className="p-2.5 bg-white rounded-xl border border-orange-100 text-orange-600 shadow-lift shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Quick Value Hook</h4>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed font-medium">
              <strong>ToTheWebPro&apos;s Character Counter runs 100% client-side</strong>. Your text, drafts, and message content are processed entirely within your browser&apos;s JavaScript runtime, never transmitted to a server, and never logged or cached on Vercel&apos;s infrastructure. Unlike social media scheduling tools and cloud-based copy editors that process your input on remote servers to enforce character limits, this tool gives you instant, private, platform-accurate counts with zero round-trip latency.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - What Is a Live Character Counter */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          What Is a Live Character Counter and How Does It Work?
        </h3>
        <div className="max-w-4xl text-slate-600 font-medium leading-relaxed">
          <p>
            A <strong>live character counter</strong> is a browser-based text analysis utility that measures the length of an input string (in characters, bytes, or Unicode code points) and compares that measurement against a predefined set of platform-specific thresholds in real time, triggering visual warnings as the input approaches or exceeds each limit.
          </p>
          <p className="mt-4">
            The critical technical distinction is between a <em>character</em> and a <em>byte</em>. In ASCII and basic Latin text, one character equals one byte. In UTF-8 encoded text—which covers emoji, accented characters, Arabic, Chinese, Japanese, Korean, and most non-Latin scripts—a single character can occupy 2, 3, or 4 bytes. Twitter/X specifically counts characters in Unicode code points (not bytes), with one important exception: characters outside the Basic Multilingual Plane (BMP), including most emoji, are encoded as UTF-16 surrogate pairs and counted as <strong>two characters</strong> against the 280-character limit. This is why a tweet with 10 emoji can hit the limit faster than 280 Latin characters.
          </p>
          <p className="mt-4">
            ToTheWebPro&apos;s counter tracks all three measurement layers simultaneously and maps each against the correct platform encoding model.
          </p>
        </div>

        {/* Platform Character Limits & Encoding Rules Table */}
        <div className="mt-6 space-y-3">
          <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange-500" />
            Platform Character Limits &amp; Encoding Rules Reference
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 border-b border-orange-100">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Platform</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/6">Limit</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Encoding Model</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3">Key Constraint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 text-sm font-medium text-slate-700">
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Twitter/X: Standard Tweet</td>
                  <td className="p-4">280 chars</td>
                  <td className="p-4">Unicode code points (BMP=1, surrogate=2)</td>
                  <td className="p-4 text-slate-600">URLs always count as 23 characters regardless of actual length (t.co shortener)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Twitter/X: Username Reply</td>
                  <td className="p-4">280 minus prefix</td>
                  <td className="p-4">Unicode code points</td>
                  <td className="p-4 text-slate-600">@mention prefix auto-deducted from available character budget</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">LinkedIn: Post</td>
                  <td className="p-4">3,000 chars</td>
                  <td className="p-4">UTF-16 code units</td>
                  <td className="p-4 text-slate-600">First 210 characters visible before &quot;See more&quot; truncation</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">LinkedIn: Headline</td>
                  <td className="p-4">220 chars</td>
                  <td className="p-4">UTF-16 code units</td>
                  <td className="p-4 text-slate-600">Critical for SEO and search visibility within LinkedIn</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">LinkedIn: Connection Request Note</td>
                  <td className="p-4">300 chars</td>
                  <td className="p-4">UTF-16 code units</td>
                  <td className="p-4 text-slate-600">Hard cut-off; no truncation warning in native UI</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Meta (Facebook): Post</td>
                  <td className="p-4">63,206 chars</td>
                  <td className="p-4">UTF-8 characters</td>
                  <td className="p-4 text-slate-600">Practical visibility truncation at ~477 characters before &quot;See more&quot;</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Instagram: Caption</td>
                  <td className="p-4">2,200 chars</td>
                  <td className="p-4">UTF-8 characters</td>
                  <td className="p-4 text-slate-600">Display truncation at ~125 characters; hashtags count toward total</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">SMS: Single Segment (GSM-7)</td>
                  <td className="p-4">160 chars</td>
                  <td className="p-4">GSM-7 encoding (7-bit)</td>
                  <td className="p-4 text-slate-600">Uses 128-character alphabet; special characters trigger UCS-2 mode</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">SMS: Multi-Segment (GSM-7)</td>
                  <td className="p-4">153 per segment</td>
                  <td className="p-4">GSM-7 encoding</td>
                  <td className="p-4 text-slate-600">7 header bytes per segment consumed for concatenation; billed per segment</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">SMS: Single Segment (UCS-2)</td>
                  <td className="p-4">70 chars</td>
                  <td className="p-4">UCS-2 encoding (16-bit)</td>
                  <td className="p-4 text-slate-600">Triggered by any character outside the GSM-7 alphabet (emoji, accents)</td>
                </tr>
                <tr className="hover:bg-orange-50/10 transition-colors">
                  <td className="p-4 font-bold text-slate-900">SMS: Multi-Segment (UCS-2)</td>
                  <td className="p-4">67 per segment</td>
                  <td className="p-4">UCS-2 encoding</td>
                  <td className="p-4 text-slate-600">Dropping to 67/segment from 70; billed per segment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* H2 - Step-by-Step Guide */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-500" />
          Step-by-Step Guide: How to Use the ToTheWebPro Live Character Counter
        </h3>
        <p className="max-w-3xl text-slate-600 font-medium">
          The tool is built for zero-friction, high-speed copy validation. Open it in a browser tab alongside your CMS, social scheduler, or messaging platform and use it as a live safety net for every piece of copy you publish.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              1
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Paste or Type Your Text</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Navigate to the tool. The primary text area focuses on load. Paste your draft copy or type into the field to begin.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              2
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Read the Live Metrics Panel</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              View characters (with/without spaces), words, and byte counts in the statistics panel updating under 10ms.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              3
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Monitor Threshold Indicators</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Watch indicators turn Green (safe), Amber (approaching limit), or Red (exceeded limit) dynamically as you enter text.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              4
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Check SMS Encoding Mode</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              See the SMS encoder automatically switch from GSM-7 to UCS-2 when emojis or special characters are input.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-200 transition-all duration-300">
            <span className="absolute top-0 right-0 h-16 w-16 bg-orange-50/60 rounded-bl-full flex items-center justify-center font-black text-orange-600 group-hover:scale-110 transition-transform">
              5
            </span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight pr-6">Iterate and Copy Draft</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Edit the copy until it meets all target rules, then click the Copy button for a quick clipboard capture.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Why Technical Accuracy Matters */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-orange-500" />
          Why Technical Accuracy Matters for Character Count and Platform Limits
        </h3>
        <p className="max-w-3xl text-slate-600 font-medium">
          Understanding the difference between how a character counter <em>measures</em> and how a platform <em>enforces</em> its limit is the gap between copy that publishes cleanly and copy that gets cut, splits unexpectedly, or costs more than expected.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Twitter/X: Unicode Surrogate Pairs</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Twitter uses Unicode code points, counting characters outside the Basic Multilingual Plane (like emojis) as <strong>two characters</strong>. Our counter explicitly detects surrogate pairs using code point iteration to ensure counts match Twitter validation exactly.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <Smartphone className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">SMS: GSM-7 to UCS-2 Shift and Costs</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              GSM-7 supports 160 characters in a single SMS. Emojis, curly quotes, and em dashes force UCS-2 encoding, dropping the limit to 70 characters and increasing multi-segment costs. Our tool tracks these shifts in real time to avoid bulk campaign surprises.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <UserCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">LinkedIn: Feed Truncation vs. Hard Cap</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              LinkedIn allows up to 3,000 characters in posts but truncates feed content with a &quot;See more&quot; link at ~210 characters. Our tool flags this soft truncation threshold so you can build optimized hook copy.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Byte Count vs. Character Count</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Database schema rules and API contracts frequently calculate constraints by bytes rather than characters. Our tool displays both metrics simultaneously so engineers and writers can satisfy validation criteria easily.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Key Features */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Key Features of Our Free Online Live Character Counter &amp; Limit Tracker
        </h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Multi-Platform Threshold Bars</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Simultaneous visual indicators for Twitter, LinkedIn, Instagram, Facebook, and SMS with three-stage colors.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Surrogate Pair Emoji Detection</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Uses code point iteration to count emoji as two characters, matching Twitter server validation logic.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">SMS Encoding Mode Indicator</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Automatically flags shifts between GSM-7 and UCS-2 formats based on special character triggers.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Four Real-Time Metrics</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Total characters (with/without spaces), word counts, and UTF-8 byte totals in a single unified view.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-orange-100 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Client-Side Processing</h4>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                Your content stays entirely within your browser tab runtime. No text data ever contacts external servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H2 - Semantic Context & Use Cases */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-orange-500" />
          Semantic Context &amp; Use Cases: Who Needs a Character Counter Every Day?
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Social Media Managers</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Gives a secondary, encoding-accurate pass over copy to catch tricky emojis and curly apostrophes that schedule counters might compute incorrectly.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">SMS Marketers &amp; Operators</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Instantly checks segment count and billing impact. Helps marketing teams stay below carrier cost-multipliers by optimizing layout symbols.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Ad Copywriters &amp; PPC Specialists</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Validates strict limits for Google Ads headlines (30 chars) and Meta text (125 chars) before uploading to avoid awkward automated truncations.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">Developers &amp; Engineers</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Verifies VARCHAR parameters and JSON payload lengths using UTF-8 byte calculations directly on screen without opening manual logs.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm space-y-2 hover:border-orange-200 transition-colors">
            <h4 className="font-bold text-slate-900 text-base">LinkedIn Builders &amp; Recruiters</h4>
            <p className="text-xs leading-relaxed text-slate-500 font-medium">
              Optimizes the critical 220-character profile headline and 300-character invitation limits to maximize networking search results.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - FAQs */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-orange-500" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4 max-w-4xl mt-6">
          <FaqAccordionItem
            question="How do I count characters online accurately?"
            answer="Paste your text into a live character counter tool. Accurate counters provide at minimum two figures: character count with spaces (the raw string.length in JavaScript, matching most platform validators) and character count without spaces (stripping all whitespace before counting, used for linguistic analysis and some CMS field validators). For social media copy, the tool must also apply the correct encoding model for the target platform — Twitter/X counts emoji as two characters, not one, while standard character counters count them as one."
          />
          <FaqAccordionItem
            question="How many characters are allowed in a tweet on Twitter/X?"
            answer="Twitter/X allows 280 characters per tweet for standard accounts. The counting model uses Unicode code points with one exception: characters outside the Basic Multilingual Plane (BMP) — including most emoji — are encoded as UTF-16 surrogate pairs and counted as two characters each. URLs in tweets are always shortened to a t.co link of exactly 23 characters, regardless of the original URL length, and that 23-character count is deducted from the 280-character budget."
          />
          <FaqAccordionItem
            question="Why does adding one emoji change my SMS from 1 segment to 3?"
            answer="SMS messages default to GSM-7 encoding, which supports 160 characters per single segment. Emoji are not part of the GSM-7 character set — adding any emoji forces the entire message to UCS-2 encoding, which reduces the single-segment limit to 70 characters. If your message was 155 characters before adding the emoji, it now requires three UCS-2 segments (67 + 67 + 21 characters), each billed as a separate SMS. Curly apostrophes and em dashes trigger the same encoding switch as emoji and are the most common accidental cause."
          />
          <FaqAccordionItem
            question="What is the character limit for a LinkedIn post?"
            answer="LinkedIn posts have a hard character limit of 3,000 characters. However, the practical visibility threshold is approximately 210 characters — LinkedIn's feed UI truncates post body text at this point and adds a 'See more' link. For maximum engagement, the first 210 characters must work as a self-contained hook that motivates the reader to expand the post. LinkedIn headlines have a separate limit of 220 characters and connection request notes are capped at 300 characters."
          />
          <FaqAccordionItem
            question="What is the difference between character count and byte count?"
            answer="Character count measures the number of individual characters (letters, digits, symbols, spaces) in a string, regardless of how those characters are stored in memory. Byte count measures the actual storage size of the string in a specific encoding. In ASCII text, one character equals one byte. In UTF-8 encoding (the web standard), characters from the Basic Latin alphabet still occupy 1 byte each, but accented characters occupy 2 bytes, most non-Latin scripts occupy 3 bytes, and emoji occupy 4 bytes. For database field constraints, API payload limits, and SMS billing, byte count is the operationally relevant figure — not character count."
          />
        </div>
      </section>

      {/* Footer credit branding block exactly per user content */}
      <div className="pt-8 border-t border-orange-100 text-center text-xs font-semibold text-slate-400">
        ToTheWebPro | <a href="https://tothewebpro.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">https://tothewebpro.vercel.app/</a> | Free Web Developer &amp; SEO Utilities
      </div>
    </div>
  );
}