"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Spinner } from "@/components/ui/Spinner";
import { TOOL_BY_SLUG } from "@/lib/tools-data";

// Each tool is loaded dynamically so only the active tool's bundle is fetched.
// This significantly reduces TTI on tool pages and the homepage.
const CaseConverter = dynamic(
  () => import("@/components/tools/CaseConverter").then((m) => m.CaseConverter),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const CharacterCounter = dynamic(
  () =>
    import("@/components/tools/CharacterCounter").then(
      (m) => m.CharacterCounter,
    ),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const ImageCompressor = dynamic(
  () =>
    import("@/components/tools/ImageCompressor").then((m) => m.ImageCompressor),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const ImageConverter = dynamic(
  () =>
    import("@/components/tools/ImageConverter").then((m) => m.ImageConverter),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const ImageResizer = dynamic(
  () => import("@/components/tools/ImageResizer").then((m) => m.ImageResizer),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const MetaChecker = dynamic(
  () => import("@/components/tools/MetaChecker").then((m) => m.MetaChecker),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const PasswordGenerator = dynamic(
  () =>
    import("@/components/tools/PasswordGenerator").then(
      (m) => m.PasswordGenerator,
    ),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const WordCounter = dynamic(
  () => import("@/components/tools/WordCounter").then((m) => m.WordCounter),
  { loading: () => <Spinner label="Loading tool…" /> },
);

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  const tool = TOOL_BY_SLUG[slug];
  if (!tool) return null;

  const wrap = (node: ReactNode) => (
    <ErrorBoundary toolName={tool.name}>{node}</ErrorBoundary>
  );

  switch (slug) {
    case "meta-title-description-checker":
      return wrap(<MetaChecker />);
    case "word-counter":
      return wrap(<WordCounter />);
    case "case-converter":
      return wrap(<CaseConverter />);
    case "image-compressor":
      return wrap(<ImageCompressor />);
    case "image-resizer":
      return wrap(<ImageResizer />);
    case "image-converter":
      return wrap(<ImageConverter />);
    case "character-counter":
      return wrap(<CharacterCounter />);
    case "password-generator":
      return wrap(<PasswordGenerator />);
    default:
      return null;
  }
}
