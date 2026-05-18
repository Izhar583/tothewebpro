export type LengthState = "too-short" | "short" | "good" | "acceptable" | "too-long";

export interface FieldScore {
  score: number;
  state: LengthState;
  color: "red" | "amber" | "green";
  label: string;
  message: string;
}

export function getTitleState(length: number): LengthState {
  if (length <= 10) return "too-short";
  if (length <= 49) return "short";
  if (length <= 55) return "good";
  if (length <= 60) return "acceptable";
  return "too-long";
}

export function getDescriptionState(length: number): LengthState {
  if (length <= 50) return "too-short";
  if (length <= 104) return "short";
  if (length <= 155) return "good";
  if (length <= 160) return "acceptable";
  return "too-long";
}

export function scoreTitle(length: number): FieldScore {
  const state = getTitleState(length);
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
      score = Math.max(0, Math.min(19, length * 1.8));
      color = "red";
      label = "Too short";
      message = "Add more detail — short titles miss keyword opportunities.";
      break;
    case "short":
      score = Math.max(40, Math.min(69, 40 + (length - 11) * 2));
      if (length >= 45) score = Math.max(70, Math.min(89, 70 + (length - 45) * 4));
      color = "amber";
      label = "Could be longer";
      message = "Consider expanding to 50–55 characters for best visibility.";
      break;
    case "good":
      score = Math.max(90, Math.min(100, 95 + (length - 50)));
      color = "green";
      label = "Good";
      message = "Great length. Fits Google desktop and mobile without truncation.";
      break;
    case "acceptable":
      score = Math.max(70, Math.min(89, 89 - (length - 56) * 4));
      color = "amber";
      label = "Slightly long";
      message = "Close to the limit. Check the pixel width — may truncate on some screens.";
      break;
    case "too-long":
      score = Math.max(20, Math.min(39, 39 - (length - 61) * 0.8));
      color = "red";
      label = "Too long — may truncate";
      message = "Too long. Google will cut this in search results — trim to under 60 characters.";
      break;
  }

  return { score: Math.round(score), state, color, label, message };
}

export function scoreDescription(length: number): FieldScore {
  const state = getDescriptionState(length);
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
      message: "Too brief. Expand to 120–150 characters for better CTR."
    };
  }

  switch (state) {
    case "too-short":
      score = Math.max(0, Math.min(14, length * 0.28));
      color = "red";
      label = "Too short";
      message = "Too brief. Expand to 120–150 characters for better CTR.";
      break;
    case "short":
      score = Math.max(40, Math.min(59, 40 + (length - 51) * 0.36));
      if (length >= 105) score = Math.max(75, Math.min(89, 75 + (length - 105) * 1));
      color = "amber";
      label = "Could be longer";
      message = "A bit short. Aim for 120–150 characters to fill the Google snippet.";
      break;
    case "good":
      score = Math.max(90, Math.min(100, 90 + (length - 105) * 0.2));
      if (length >= 120 && length <= 155) {
        score = Math.max(95, Math.min(100, 95 + (length - 120) * 0.14));
      }
      color = "green";
      label = "Good";
      message = "Good length for desktop and mobile Google results.";
      break;
    case "acceptable":
      score = Math.max(60, Math.min(74, 74 - (length - 156) * 3));
      color = "amber";
      label = "May truncate on mobile";
      message = "Fine for desktop but may be trimmed on mobile. Consider keeping under 150 chars.";
      break;
    case "too-long":
      score = Math.max(15, Math.min(39, 39 - (length - 161) * 0.4));
      color = "red";
      label = "Too long — will truncate";
      message = "Too long. Google will truncate this on desktop. Cut to under 155 characters.";
      break;
  }

  return { score: Math.round(score), state, color, label, message };
}

export function titleCharClass(length: number): string {
  const score = scoreTitle(length);
  if (score.color === "green") return "text-emerald-600";
  if (score.color === "amber") return "text-amber-500";
  return "text-red-500";
}

export function descriptionCharClass(length: number): string {
  const score = scoreDescription(length);
  if (score.color === "green") return "text-emerald-600";
  if (score.color === "amber") return "text-amber-500";
  return "text-red-500";
}
