/** Renders one JSON-LD @graph. `<` is escaped so user content can't close the tag. */
export function JsonLd({ graph }: { graph: object[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
