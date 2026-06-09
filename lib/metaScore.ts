export type LengthState = "too-short" | "short" | "good" | "acceptable" | "too-long";

export interface FieldScore {
  score: number;
  state: LengthState;
  color: "red" | "amber" | "green";
  label: string;
  message: string;
}

export function getTextWidth(text: string, font: string): number {
  if (typeof window === "undefined" || !text) return 0;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    ctx.font = font;
    return Math.round(ctx.measureText(text).width);
  } catch {
    return 0;
  }
}

export function getTitleState(length: number, pixelWidth?: number): LengthState {
  const w = pixelWidth !== undefined ? pixelWidth : Math.round(length * 10.5);
  if (w < 250) return "too-short";
  if (w <= 580) return "good";
  return "too-long";
}

export function getDescriptionState(length: number, pixelWidth?: number): LengthState {
  const w = pixelWidth !== undefined ? pixelWidth : Math.round(length * 6.0);
  if (w < 400) return "too-short";
  if (w <= 920) return "good";
  return "too-long";
}

export function scoreTitle(length: number, pixelWidth?: number): FieldScore {
  const state = getTitleState(length, pixelWidth);
  const w = pixelWidth !== undefined ? pixelWidth : Math.round(length * 10.5);
  let score = 0;
  let color: "red" | "amber" | "green" = "green";
  let label = "";
  let message = "";

  if (length === 0) {
    return {
      score: 0,
      state: "too-short",
      color: "red",
      label: "Too short",
      message: "Add more detail — short titles miss keyword opportunities."
    };
  }

  switch (state) {
    case "too-short":
      score = Math.max(10, Math.min(59, Math.round((w / 250) * 60)));
      color = "red";
      label = "Too short";
      message = "Your page title is too short. Try to expand it to at least 250 pixels (approx. 30 characters).";
      break;
    case "good":
      score = Math.round(90 + ((w - 250) / 330) * 10);
      color = "green";
      label = "Acceptable length";
      message = "Your page title is an acceptable length. It fits Google desktop and mobile search results.";
      break;
    case "too-long":
      score = Math.max(10, Math.round(60 - ((w - 580) / 200) * 40));
      color = "red";
      label = "Too long — will truncate";
      message = "Page titles should be around 580 pixels in length. Google will truncate this in search results.";
      break;
    default:
      score = 50;
      color = "amber";
      label = "Review length";
      message = "Check the pixel width to ensure optimal display.";
  }

  return { score: Math.round(score), state, color, label, message };
}

export function scoreDescription(length: number, pixelWidth?: number): FieldScore {
  const state = getDescriptionState(length, pixelWidth);
  const w = pixelWidth !== undefined ? pixelWidth : Math.round(length * 6.0);
  let score = 0;
  let color: "red" | "amber" | "green" = "green";
  let label = "";
  let message = "";

  if (length === 0) {
    return {
      score: 0,
      state: "too-short",
      color: "red",
      label: "Too short",
      message: "Too brief. Expand to 400–920 pixels (approx. 120–160 characters) for better CTR."
    };
  }

  switch (state) {
    case "too-short":
      score = Math.max(10, Math.min(59, Math.round((w / 400) * 60)));
      color = "red";
      label = "Too short";
      message = "Your meta description is too short. Try to expand it to at least 400 pixels to optimize SERP visibility.";
      break;
    case "good":
      score = Math.round(90 + ((w - 400) / 520) * 10);
      color = "green";
      label = "Acceptable length";
      message = "Your meta description is an acceptable length. It fits desktop Google search results.";
      break;
    case "too-long":
      score = Math.max(10, Math.round(60 - ((w - 920) / 300) * 40));
      color = "red";
      label = "Too long — will truncate";
      message = "Meta descriptions should be around 920 pixels in length. Google will truncate this on desktop results.";
      break;
    default:
      score = 50;
      color = "amber";
      label = "Review length";
      message = "Check the pixel width to ensure optimal display.";
  }

  return { score: Math.round(score), state, color, label, message };
}

export function titleCharClass(length: number, pixelWidth?: number): string {
  const score = scoreTitle(length, pixelWidth);
  if (score.color === "green") return "text-emerald-600";
  if (score.color === "amber") return "text-amber-500";
  return "text-red-500";
}

export function descriptionCharClass(length: number, pixelWidth?: number): string {
  const score = scoreDescription(length, pixelWidth);
  if (score.color === "green") return "text-emerald-600";
  if (score.color === "amber") return "text-amber-500";
  return "text-red-500";
}

