interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD script block.
 * `</script>` sequences are escaped to prevent tag injection when field
 * values contain user-supplied or third-party content.
 */
export function JsonLd({ data }: JsonLdProps) {
  // Escape closing script tags so a value like "</script><script>xss"
  // cannot break out of the JSON-LD block.
  const safe = JSON.stringify(data, null, 2).replace(
    /<\/script>/gi,
    "<\\/script>",
  );
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
