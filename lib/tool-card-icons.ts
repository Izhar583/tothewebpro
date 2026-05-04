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

const ICON_STROKE = "#1e3a8a"; // Deep Blue (Blue 900) for better theme matching

export interface ToolCardIconConfig {
  Icon: LucideIcon;
  /** Soft rounded container background (Tailwind classes) */
  iconContainerClass: string;
}

export const TOOL_CARD_ICONS: Record<string, ToolCardIconConfig> = {
  "meta-title-description-checker": {
    Icon: Search,
    iconContainerClass: "bg-blue-50",
  },
  "word-counter": {
    Icon: FileText,
    iconContainerClass: "bg-sky-50",
  },
  "case-converter": {
    Icon: CaseSensitive,
    iconContainerClass: "bg-indigo-50",
  },
  "image-compressor": {
    Icon: ImageDown,
    iconContainerClass: "bg-blue-50",
  },
  "image-resizer": {
    Icon: Scaling,
    iconContainerClass: "bg-sky-50",
  },
  "image-converter": {
    Icon: RefreshCw,
    iconContainerClass: "bg-indigo-50",
  },
  "character-counter": {
    Icon: Type,
    iconContainerClass: "bg-blue-50",
  },
  "password-generator": {
    Icon: KeyRound,
    iconContainerClass: "bg-sky-50",
  },
};

const FALLBACK: ToolCardIconConfig = {
  Icon: FileText,
  iconContainerClass: "bg-blue-50",
};

export function getToolCardIcon(slug: string): ToolCardIconConfig {
  return TOOL_CARD_ICONS[slug] ?? FALLBACK;
}

export const TOOL_ICON_STROKE_COLOR = ICON_STROKE;
