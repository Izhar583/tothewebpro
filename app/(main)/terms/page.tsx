import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of ToTheWebPro tools, acceptable use, disclaimers, and intellectual property.",
  alternates: { canonical: "https://tothewebpro.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-navy">Terms of Service</h1>
      <div className="prose prose-slate mt-8 max-w-none text-body">
        <p>
          These Terms of Service (“Terms”) govern your access to and use of
          ToTheWebPro’s website, applications, and related services (collectively,
          the “Services”). By using the Services, you agree to these Terms. If
          you disagree, do not use the Services.
        </p>

        <h2 className="text-xl font-semibold text-navy">Acceptable use</h2>
        <p>
          You agree not to misuse the Services. Prohibited behaviour includes
          attempting to probe, scan, or test the vulnerability of any system;
          interfering with or circumventing security or access controls;
          submitting unlawful, infringing, or harmful content; using automated
          means in a way that imposes an unreasonable load on our
          infrastructure; or attempting to access data that does not belong to
          you. We may suspend or terminate access for violations.
        </p>

        <h2 className="text-xl font-semibold text-navy">No warranty</h2>
        <p>
          THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
          SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
          COMPONENTS, OR THAT RESULTS FROM TOOLS WILL BE ACCURATE OR SUITABLE
          FOR YOUR REGULATORY OR COMPLIANCE NEEDS.
        </p>

        <h2 className="text-xl font-semibold text-navy">Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOTHEWEBPRO AND ITS TEAM WILL
          NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          OR EXEMPLARY DAMAGES, OR ANY LOSS OF PROFITS, GOODWILL, DATA, OR
          OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF THE
          SERVICES. OUR AGGREGATE LIABILITY FOR ANY CLAIM ARISING FROM THE
          SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US FOR
          THE SERVICES IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (B) ONE
          HUNDRED US DOLLARS.
        </p>

        <h2 className="text-xl font-semibold text-navy">Intellectual property</h2>
        <p>
          The Services, including branding, design, text, visual assets, and
          underlying software, are owned by ToTheWebPro or its licensors and are
          protected by intellectual property laws. Subject to these Terms, we
          grant you a limited, revocable, non-exclusive, non-transferable
          licence to access and use the Services for personal or internal
          business purposes. You may not copy, modify, distribute, sell, or
          lease any part of the Services without our prior written consent.
        </p>

        <h2 className="text-xl font-semibold text-navy">Third-party services</h2>
        <p>
          The Services may integrate or link to third-party tools, including
          advertising and analytics providers. Those services are governed by
          their own terms and privacy policies, and we are not responsible for
          their practices.
        </p>

        <h2 className="text-xl font-semibold text-navy">Changes</h2>
        <p>
          We may modify the Services or these Terms at any time. We will post
          updates on this page and, where appropriate, provide additional
          notice. Continued use after changes constitutes acceptance.
        </p>

        <h2 className="text-xl font-semibold text-navy">Contact</h2>
        <p>
          Legal enquiries:{" "}
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
