export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

export function toAlternatingCase(text: string): string {
  return text
    .split("")
    .map((ch, i) =>
      i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase(),
    )
    .join("");
}

export function toCamelCase(text: string): string {
  const words = text.match(/[A-Za-z0-9]+/g) ?? [];
  if (words.length === 0) return "";
  const head = words[0];
  if (!head) return "";
  return (
    head.toLowerCase() +
    words
      .slice(1)
      .map(
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
      )
      .join("")
  );
}

export function toSnakeCase(text: string): string {
  const words = text.match(/[A-Za-z0-9]+/g) ?? [];
  return words.map((w) => w.toLowerCase()).join("_");
}

export function toKebabCase(text: string): string {
  const words = text.match(/[A-Za-z0-9]+/g) ?? [];
  return words.map((w) => w.toLowerCase()).join("-");
}
