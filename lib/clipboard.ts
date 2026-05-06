/**
 * Robust copy-to-clipboard with fallback for non-HTTPS or legacy environments.
 * Safe for use in Next.js client components (SSR safe).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text || typeof window === "undefined") return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("navigator.clipboard failed, trying fallback", err);
  }

  // Fallback: create a temporary textarea
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    const selection = document.getSelection();
    const selected =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false;

    el.select();
    const success = document.execCommand("copy");
    document.body.removeChild(el);

    if (selected && selection) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }

    return success;
  } catch (err) {
    console.error("Clipboard fallback failed", err);
    return false;
  }
}
