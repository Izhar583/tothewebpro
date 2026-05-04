import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ToTheWebPro",
  description:
    "Learn about ToTheWebPro's mission, audience, and how we build fast, free tools for SEO and content teams.",
  alternates: { canonical: "https://tothewebpro.com/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-navy">About ToTheWebPro</h1>
      <div className="prose prose-slate mt-8 max-w-none text-body">
        <p>
          ToTheWebPro started as a personal frustration. Too many SEO and
          content tools are either buried behind paywalls, cluttered with
          dark-pattern popups, or slow enough that running an audit feels like
          a task in itself. We wanted something faster — tools you open, use,
          and close without creating an account or sitting through a loading
          screen.
        </p>
        <p>
          The site is used by SEO professionals checking meta snippets before
          publishing, writers making sure their article hits the right word
          count, developers resizing images before committing them to a repo,
          and marketers grabbing a quick character count for an ad headline.
          Those workflows share one thing: they need a result in seconds, not
          minutes.
        </p>
        <p>
          Most of the tools run entirely in your browser. When you compress an
          image or convert a case format, nothing leaves your device. The one
          exception is the meta tag checker, which fetches a public URL on the
          server to work around browser CORS restrictions — and even then we
          only return the meta data, not the full page.
        </p>
        <p>
          We keep ads on the site because that&apos;s how free stays free. The
          placement rules are simple: ads sit outside the tool workspace, they
          never auto-play audio, and they don&apos;t cover content. If you ever
          see an ad that breaks those rules, email us and we&apos;ll pull it.
        </p>
        <p>
          The tool list is short right now and deliberately so. We&apos;d
          rather ship eight tools that work well than forty that half-work.
          When a new tool makes it onto the list, it&apos;s because someone
          actually asked for it — usually via the contact page — and the use
          case was clear enough to justify building it properly.
        </p>
        <p>
          If you spot a bug, have a suggestion, or just want to say the word
          counter saved you ten minutes, the contact page is the right place.
          We read everything and reply to most of it.
        </p>
      </div>
    </div>
  );
}
