import type { LucideIcon } from "lucide-react";
import {
  CaseSensitive,
  FileText,
  ImageDown,
  KeyRound,
  RefreshCw,
  Scaling,
  Search,
  Type,
} from "lucide-react";

const ICON_STROKE = "#7c2d12"; // Deep Orange (Orange 900) for better theme matching

export interface ToolCardIconConfig {
  Icon: LucideIcon;
  /** Soft rounded container background (Tailwind classes) */
  iconContainerClass: string;
}

export const TOOL_CARD_ICONS: Record<string, ToolCardIconConfig> = {
  "meta-title-description-checker": {
    Icon: Search,
    iconContainerClass: "bg-orange-50",
  },
  "word-counter": {
    Icon: FileText,
    iconContainerClass: "bg-amber-50",
  },
  "case-converter": {
    Icon: CaseSensitive,
    iconContainerClass: "bg-orange-50",
  },
  "image-compressor": {
    Icon: ImageDown,
    iconContainerClass: "bg-amber-50",
  },
  "image-resizer": {
    Icon: Scaling,
    iconContainerClass: "bg-orange-50",
  },
  "image-converter": {
    Icon: RefreshCw,
    iconContainerClass: "bg-amber-50",
  },
  "character-counter": {
    Icon: Type,
    iconContainerClass: "bg-orange-50",
  },
  "password-generator": {
    Icon: KeyRound,
    iconContainerClass: "bg-amber-50",
  },
};

const FALLBACK: ToolCardIconConfig = {
  Icon: FileText,
  iconContainerClass: "bg-orange-50",
};

export function getToolCardIcon(slug: string): ToolCardIconConfig {
  return TOOL_CARD_ICONS[slug] ?? FALLBACK;
}

export const TOOL_ICON_STROKE_COLOR = ICON_STROKE;
