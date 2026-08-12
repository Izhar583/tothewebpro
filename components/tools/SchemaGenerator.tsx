"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, Code, FileText, HelpCircle, Building, ShoppingCart } from "lucide-react";

type SchemaType = "Article" | "FAQPage" | "Organization" | "LocalBusiness" | "Product" | "SoftwareApplication";

export function SchemaGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [copied, setCopied] = useState(false);

  // Article Form State
  const [articleTitle, setArticleTitle] = useState("How to Optimize Website SEO in 2026");
  const [articleAuthor, setArticleAuthor] = useState("ToTheWebPro Team");
  const [articleUrl, setArticleUrl] = useState("https://tothewebpro.com/blog/seo-guide");
  const [articleImage, setArticleImage] = useState("https://tothewebpro.com/og-default.png");

  // FAQPage Form State
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    { question: "Is this Schema Generator tool free?", answer: "Yes, it is 100% free with no registration required." },
    { question: "How do I add schema to my site?", answer: "Copy the output JSON-LD script and paste it inside your page head." },
  ]);

  // Organization Form State
  const [orgName, setOrgName] = useState("ToTheWebPro");
  const [orgUrl, setOrgUrl] = useState("https://tothewebpro.com");
  const [orgLogo, setOrgLogo] = useState("https://tothewebpro.com/logo.png");

  // Product Form State
  const [productName, setProductName] = useState("SEO Audit Pro Software");
  const [productPrice, setProductPrice] = useState("49.99");
  const [productCurrency, setProductCurrency] = useState("USD");

  function generateJsonLd(): string {
    let obj: Record<string, unknown> = {};

    if (schemaType === "Article") {
      obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articleTitle,
        image: articleImage,
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        publisher: {
          "@type": "Organization",
          name: orgName,
          logo: {
            "@type": "ImageObject",
            url: orgLogo,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      };
    } else if (schemaType === "FAQPage") {
      obj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      };
    } else if (schemaType === "Organization") {
      obj = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: orgName,
        url: orgUrl,
        logo: orgLogo,
      };
    } else if (schemaType === "Product") {
      obj = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productName,
        offers: {
          "@type": "Offer",
          price: productPrice,
          priceCurrency: productCurrency,
          availability: "https://schema.org/InStock",
        },
      };
    } else if (schemaType === "LocalBusiness" || schemaType === "SoftwareApplication") {
      obj = {
        "@context": "https://schema.org",
        "@type": schemaType,
        name: orgName,
        url: orgUrl,
      };
    }

    return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateJsonLd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Schema Type Switcher */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-2 border border-slate-200">
        {(["Article", "FAQPage", "Organization", "Product"] as SchemaType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSchemaType(type)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              schemaType === type
                ? "bg-orange-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            {type === "Article" && <FileText className="h-4 w-4" />}
            {type === "FAQPage" && <HelpCircle className="h-4 w-4" />}
            {type === "Organization" && <Building className="h-4 w-4" />}
            {type === "Product" && <ShoppingCart className="h-4 w-4" />}
            {type}
          </button>
        ))}
      </div>

      {/* Main Form & Code Split View */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Controls */}
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="h-5 w-5 text-orange-600" /> Configure {schemaType} Fields
          </h3>

          {schemaType === "Article" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Headline</label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                <input
                  type="text"
                  value={articleAuthor}
                  onChange={(e) => setArticleAuthor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article URL</label>
                <input
                  type="url"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={articleImage}
                  onChange={(e) => setArticleImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {schemaType === "FAQPage" && (
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Question #{idx + 1}</span>
                    {faqs.length > 1 && (
                      <button
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Question text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].question = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-orange-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer text"
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-orange-500"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="w-full rounded-xl border border-dashed border-orange-300 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 transition"
              >
                + Add FAQ Question
              </button>
            </div>
          )}

          {schemaType === "Organization" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={orgUrl}
                  onChange={(e) => setOrgUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={orgLogo}
                  onChange={(e) => setOrgLogo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {schemaType === "Product" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={productCurrency}
                    onChange={(e) => setProductCurrency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Code Preview & Copy Panel */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Code className="h-4 w-4" /> JSON-LD Script Output
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700 transition"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied to Clipboard!" : "Copy Code"}
              </button>
            </div>

            <pre className="max-h-[400px] overflow-auto font-mono text-xs text-emerald-400 leading-relaxed">
              {generateJsonLd()}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-400">
            💡 Copy and paste this script directly into the <code>&lt;head&gt;</code> section of your HTML page.
          </div>
        </div>
      </div>
    </div>
  );
}
