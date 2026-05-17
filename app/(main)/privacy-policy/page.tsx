import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ToTheWebPro handles personal data, cookies, analytics, and advertising partners including Google AdSense.",
  alternates: { canonical: "https://tothewebpro.com/privacy-policy" },
};

const EFFECTIVE = "4 May 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: {EFFECTIVE}</p>
      <div className="prose prose-inverse prose-slate mt-8 max-w-none text-slate-300">
        <h2 className="text-xl font-semibold text-white">Who we are</h2>
        <p>
          ToTheWebPro (&quot;we&quot;, &quot;us&quot;) operates the website{" "}
          <span className="font-medium text-white">https://tothewebpro.com</span>{" "}
          and related online tools. This policy explains how we collect, use, and
          safeguard information when you visit or interact with our services.
        </p>

        <h2 className="text-xl font-semibold text-white">Data we collect</h2>
        <p>
          <strong className="text-white">Usage and technical data.</strong> We
          collect standard server and analytics information such as approximate
          location derived from IP address, device type, browser version,
          referring URL, pages viewed, and timestamps. This helps us understand
          performance, detect abuse, and improve reliability.
        </p>
        <p>
          <strong className="text-white">Information you submit.</strong> If you
          use the contact form, we process the name, email address, subject, and
          message you provide so we can respond. Please do not send sensitive
          personal data or confidential business secrets through the form.
        </p>
        <p>
          <strong className="text-white">Tool inputs.</strong> Most text and
          image utilities execute locally in your browser. When a feature
          requires a server round-trip—such as fetching meta tags from a public
          URL—we process the request transiently to return results and do not use
          the content to train third-party models.
        </p>

        <h2 className="text-xl font-semibold text-white">Cookies and similar technologies</h2>
        <p>
          We use cookies and local storage where necessary for core
          functionality, preferences, fraud prevention, and aggregated analytics.
          You can control cookies through your browser settings; disabling
          certain cookies may limit parts of the experience.
        </p>

        <h2 className="text-xl font-semibold text-white">Google AdSense</h2>
        <p>
          ToTheWebPro is ad-supported. Google AdSense and related Google
          advertising partners may use cookies, mobile advertising IDs, or
          similar technologies to serve and measure ads, personalise content
          where permitted, and limit how often you see a campaign. Google&apos;s use of
          advertising cookies enables it and its partners to show ads based on
          your visits to this site and others on the open web.
        </p>
        <p>
          You can learn how Google uses data when you use our partners&apos; sites or
          apps by reviewing Google&apos;s Privacy &amp; Terms resources. Where
          required, we will surface consent tools to manage advertising storage
          and personalised versus non-personalised ads.
        </p>

        <h2 className="text-xl font-semibold text-white">Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, rectify,
          erase, restrict, or port personal data, and to object to processing.
          You may also lodge a complaint with your local supervisory authority.
          To exercise rights, email{" "}
          <a
            className="text-cyan-400 hover:underline"
            href="mailto:contact@tothewebpro.com"
          >
            contact@tothewebpro.com
          </a>
          {" "}with sufficient detail for us to verify and fulfil your request.
        </p>

        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          Questions about privacy:{" "}
          <a
            className="text-cyan-400 hover:underline"
            href="mailto:contact@tothewebpro.com"
          >
            contact@tothewebpro.com
          </a>
        </p>
      </div>
    </div>
  );
}