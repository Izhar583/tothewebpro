import {
  MetaCheckerIcon,
  WordCounterIcon,
  CaseConverterIcon,
  ImageCompressorIcon,
  ImageResizerIcon,
  ImageConverterIcon,
  CharacterCounterIcon,
  PasswordGeneratorIcon,
  TextToHtmlIcon,
  BackgroundRemoverIcon,
  WebsiteSeoCheckerIcon,
  HeadingTagAnalyzerIcon,
  SchemaValidatorIcon,
  SchemaGeneratorIcon,
  PerformanceAuditIcon,
  ImageAltCheckerIcon,
} from "@/components/ui/PremiumIcons";

const ICON_STROKE = "#7c2d12"; // Deep Orange (Orange 900) for better theme matching

export interface ToolCardIconConfig {
  Icon: React.ComponentType<{ className?: string }>;
  /** Soft rounded container background (Tailwind classes) */
  iconContainerClass: string;
}

export const TOOL_CARD_ICONS: Record<string, ToolCardIconConfig> = {
  "meta-title-description-checker": {
    Icon: MetaCheckerIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "website-seo-speed-checker": {
    Icon: WebsiteSeoCheckerIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "website-seo-checker": {
    Icon: WebsiteSeoCheckerIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "seo-checker": {
    Icon: WebsiteSeoCheckerIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "heading-tag-analyzer": {
    Icon: HeadingTagAnalyzerIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "heading-analyzer": {
    Icon: HeadingTagAnalyzerIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "schema-markup-validator": {
    Icon: SchemaValidatorIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "schema-validator": {
    Icon: SchemaValidatorIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "schema-markup-generator": {
    Icon: SchemaGeneratorIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "schema-generator": {
    Icon: SchemaGeneratorIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "pagespeed-performance-audit": {
    Icon: PerformanceAuditIcon,
    iconContainerClass: "bg-red-50/60 dark:bg-red-950/20",
  },
  "performance-audit": {
    Icon: PerformanceAuditIcon,
    iconContainerClass: "bg-red-50/60 dark:bg-red-950/20",
  },
  "image-alt-text-checker": {
    Icon: ImageAltCheckerIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "image-alt-checker": {
    Icon: ImageAltCheckerIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "word-counter": {
    Icon: WordCounterIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "case-converter": {
    Icon: CaseConverterIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "image-compressor": {
    Icon: ImageCompressorIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "image-resizer": {
    Icon: ImageResizerIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "image-converter": {
    Icon: ImageConverterIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "character-counter": {
    Icon: CharacterCounterIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "password-generator": {
    Icon: PasswordGeneratorIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
  "text-to-html": {
    Icon: TextToHtmlIcon,
    iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  "background-remover": {
    Icon: BackgroundRemoverIcon,
    iconContainerClass: "bg-amber-50/60 dark:bg-amber-950/20",
  },
};

const FALLBACK: ToolCardIconConfig = {
  Icon: WordCounterIcon,
  iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
};

export function getToolCardIcon(slug: string): ToolCardIconConfig {
  return TOOL_CARD_ICONS[slug] ?? FALLBACK;
}

export const TOOL_ICON_STROKE_COLOR = ICON_STROKE;
