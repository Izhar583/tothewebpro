"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Spinner } from "@/components/ui/Spinner";
import { TOOL_BY_SLUG } from "@/lib/tools-data";
import { MetaCheckerFallback } from "@/components/tools/MetaCheckerFallback";
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
  {
    loading: () => <MetaCheckerFallback />,
  },
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
const TextToHtml = dynamic(
  () => import("@/components/tools/TextToHtml").then((m) => m.TextToHtml),
  { loading: () => <Spinner label="Loading tool…" /> },
);

const BackgroundRemover = dynamic(
  () => import("@/components/tools/BackgroundRemover").then((m) => m.BackgroundRemover),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const SeoChecker = dynamic(
  () => import("@/components/tools/SeoChecker").then((m) => m.SeoChecker),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const HeadingAnalyzer = dynamic(
  () => import("@/components/tools/HeadingAnalyzer").then((m) => m.HeadingAnalyzer),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const SchemaValidator = dynamic(
  () => import("@/components/tools/SchemaValidator").then((m) => m.SchemaValidator),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const SchemaGenerator = dynamic(
  () => import("@/components/tools/SchemaGenerator").then((m) => m.SchemaGenerator),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const PerformanceAudit = dynamic(
  () => import("@/components/tools/PerformanceAudit").then((m) => m.PerformanceAudit),
  { loading: () => <Spinner label="Loading tool…" /> },
);
const ImageAltChecker = dynamic(
  () => import("@/components/tools/ImageAltChecker").then((m) => m.ImageAltChecker),
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
    case "seo-checker":
      return wrap(<SeoChecker />);
    case "heading-analyzer":
      return wrap(<HeadingAnalyzer />);
    case "schema-validator":
      return wrap(<SchemaValidator />);
    case "schema-generator":
      return wrap(<SchemaGenerator />);
    case "performance-audit":
      return wrap(<PerformanceAudit />);
    case "image-alt-checker":
      return wrap(<ImageAltChecker />);
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
    case "text-to-html":
      return wrap(<TextToHtml />);
    case "background-remover":
      return wrap(<BackgroundRemover />);
    default:
      return null;
  }
}
