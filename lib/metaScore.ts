export type LengthBand = "perfect" | "warn" | "bad";

export interface FieldScore {
  score: number;
  band: LengthBand;
  message: string;
}

function titleBand(length: number): LengthBand {
  if (length >= 50 && length <= 60) return "perfect";
  if ((length >= 40 && length <= 49) || (length >= 61 && length <= 70))
    return "warn";
  return "bad";
}

function descriptionBand(length: number): LengthBand {
  if (length >= 120 && length <= 160) return "perfect";
  if ((length >= 100 && length <= 119) || (length >= 161 && length <= 180))
    return "warn";
  return "bad";
}

function scoreFromTitleLength(length: number): number {
  const band = titleBand(length);
  if (band === "perfect") return 100;
  if (band === "warn") return 72;
  if (length === 0) return 0;
  const dist =
    length < 40
      ? 40 - length
      : length > 70
        ? length - 70
        : length < 50
          ? 50 - length
          : length - 60;
  return Math.max(0, Math.round(55 - dist * 2));
}

function scoreFromDescriptionLength(length: number): number {
  const band = descriptionBand(length);
  if (band === "perfect") return 100;
  if (band === "warn") return 72;
  if (length === 0) return 0;
  const dist =
    length < 100
      ? 100 - length
      : length > 180
        ? length - 180
        : length < 120
          ? 120 - length
          : length - 160;
  return Math.max(0, Math.round(55 - dist * 1.2));
}

function titleMessage(length: number): string {
  const band = titleBand(length);
  if (band === "perfect") return "Perfect length ✓";
  if (length < 40) return "Too short — add more keywords";
  if (length < 50) return "Too short — aim for 50–60 characters";
  if (length > 70) return "Too long — Google will truncate";
  if (length > 60) return "Too long — Google will truncate";
  return "Slightly off — aim for 50–60 characters";
}

function descriptionMessage(length: number): string {
  const band = descriptionBand(length);
  if (band === "perfect") return "Perfect length ✓";
  if (length < 100) return "Too short — add more keywords";
  if (length < 120) return "Too short — aim for 120–160 characters";
  if (length > 180) return "Too long — Google will truncate";
  if (length > 160) return "Too long — Google will truncate";
  return "Slightly off — aim for 120–160 characters";
}

export function scoreTitle(length: number): FieldScore {
  return {
    score: scoreFromTitleLength(length),
    band: titleBand(length),
    message: titleMessage(length),
  };
}

export function scoreDescription(length: number): FieldScore {
  return {
    score: scoreFromDescriptionLength(length),
    band: descriptionBand(length),
    message: descriptionMessage(length),
  };
}

export function titleCharClass(length: number): string {
  const band = titleBand(length);
  if (band === "perfect") return "text-success";
  if (band === "warn") return "text-warning";
  return "text-error";
}

export function descriptionCharClass(length: number): string {
  const band = descriptionBand(length);
  if (band === "perfect") return "text-success";
  if (band === "warn") return "text-warning";
  return "text-error";
}
