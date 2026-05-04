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
      <h1 className="text-4xl font-bold text-navy">Privacy Policy</h1>
      <p className="mt-2 text-sm text-body">Last updated: {EFFECTIVE}</p>
      <div className="prose prose-slate mt-8 max-w-none text-body">
        <h2 className="text-xl font-semibold text-navy">Who we are</h2>
        <p>
          ToTheWebPro (“we”, “us”) operates the website{" "}
          <span className="font-medium text-navy">https://tothewebpro.com</span>{" "}
          and related online tools. This policy explains how we collect, use, and
          safeguard information when you visit or interact with our services.
        </p>

        <h2 className="text-xl font-semibold text-navy">Data we collect</h2>
        <p>
          <strong className="text-navy">Usage and technical data.</strong> We
          collect standard server and analytics information such as approximate
          location derived from IP address, device type, browser version,
          referring URL, pages viewed, and timestamps. This helps us understand
          performance, detect abuse, and improve reliability.
        </p>
        <p>
          <strong className="text-navy">Information you submit.</strong> If you
          use the contact form, we process the name, email address, subject, and
          message you provide so we can respond. Please do not send sensitive
          personal data or confidential business secrets through the form.
        </p>
        <p>
          <strong className="text-navy">Tool inputs.</strong> Most text and
          image utilities execute locally in your browser. When a feature
          requires a server round-trip—such as fetching meta tags from a public
          URL—we process the request transiently to return results and do not use
          the content to train third-party models.
        </p>

        <h2 className="text-xl font-semibold text-navy">Cookies and similar technologies</h2>
        <p>
          We use cookies and local storage where necessary for core
          functionality, preferences, fraud prevention, and aggregated analytics.
          You can control cookies through your browser settings; disabling
          certain cookies may limit parts of the experience.
        </p>

        <h2 className="text-xl font-semibold text-navy">Google AdSense</h2>
        <p>
          ToTheWebPro is ad-supported. Google AdSense and related Google
          advertising partners may use cookies, mobile advertising IDs, or
          similar technologies to serve and measure ads, personalise content
          where permitted, and limit how often you see a campaign. Google’s use of
          advertising cookies enables it and its partners to show ads based on
          your visits to this site and others on the open web.
        </p>
        <p>
          You can learn how Google uses data when you use our partners’ sites or
          apps by reviewing Google’s Privacy &amp; Terms resources. Where
          required, we will surface consent tools to manage advertising storage
          and personalised versus non-personalised ads.
        </p>

        <h2 className="text-xl font-semibold text-navy">Lawful bases (UK / EEA)</h2>
        <p>
          We rely on legitimate interests to operate, secure, and improve the
          site; on consent where required for non-essential cookies or
          marketing; and on contractual necessity when responding to your
          enquiries. You may object to certain processing or withdraw consent
          where applicable without affecting the lawfulness of earlier
          processing.
        </p>

        <h2 className="text-xl font-semibold text-navy">Retention</h2>
        <p>
          We retain contact submissions only as long as needed to complete the
          conversation or satisfy legal obligations. Aggregated analytics may
          be stored for longer in a non-identifying form.
        </p>

        <h2 className="text-xl font-semibold text-navy">Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, rectify,
          erase, restrict, or port personal data, and to object to processing.
          You may also lodge a complaint with your local supervisory authority.
          To exercise rights, email{" "}
          <a
            className="text-primary hover:underline"
            href="mailto:contact@tothewebpro.com"
          >
            contact@tothewebpro.com
          </a>{" "}
          with sufficient detail for us to verify and fulfil your request.
        </p>

        <h2 className="text-xl font-semibold text-navy">International transfers</h2>
        <p>
          If we transfer data outside the UK or EEA, we implement appropriate
          safeguards such as standard contractual clauses or equivalent
          mechanisms required by applicable law.
        </p>

        <h2 className="text-xl font-semibold text-navy">Children</h2>
        <p>
          Our services are not directed to children under 16, and we do not
          knowingly collect their personal information.
        </p>

        <h2 className="text-xl font-semibold text-navy">Updates</h2>
        <p>
          We may revise this policy to reflect product, legal, or regulatory
          changes. Material updates will be posted on this page with a revised
          effective date.
        </p>

        <h2 className="text-xl font-semibold text-navy">Contact</h2>
        <p>
          Questions about privacy:{" "}
          <a
            className="text-primary hover:underline"
            href="mailto:contact@tothewebpro.com"
          >
            contact@tothewebpro.com
          </a>
        </p>
      </div>
    </div>
  );
}
