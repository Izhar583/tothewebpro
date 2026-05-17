import React from "react";
import {
  MetaCheckerIcon,
  WordCounterIcon,
  CaseConverterIcon,
  ImageCompressorIcon,
  ImageResizerIcon,
  ImageConverterIcon,
  CharacterCounterIcon,
  PasswordGeneratorIcon,
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
};

const FALLBACK: ToolCardIconConfig = {
  Icon: WordCounterIcon,
  iconContainerClass: "bg-orange-50/60 dark:bg-orange-950/20",
};

export function getToolCardIcon(slug: string): ToolCardIconConfig {
  return TOOL_CARD_ICONS[slug] ?? FALLBACK;
}

export const TOOL_ICON_STROKE_COLOR = ICON_STROKE;
