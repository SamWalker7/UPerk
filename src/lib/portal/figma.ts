// Turn a Figma share link into something that renders inside an <iframe>.
//
// Figma blocks its normal file/proto/design URLs from being framed. The
// supported ways to embed are:
//   1. the iframe URL Figma's "Embed" dialog gives you:
//        https://www.figma.com/embed?embed_host=share&url=<encoded figma url>
//   2. the newer host-prefixed form:
//        https://www.figma.com/embed/<file|proto|design>/<key>/...
// Both are accepted here. A plain share URL is wrapped into form (1); an
// already-embeddable URL is passed through untouched.

const FIGMA_HOSTS = /^https?:\/\/([\w-]+\.)?figma\.com\//i;

/** A URL Figma will actually let us frame. Returns null if it isn't Figma. */
export function toFigmaEmbedUrl(raw: string | undefined | null): string | null {
  const url = (raw || "").trim();
  if (!url || !FIGMA_HOSTS.test(url)) return null;

  // Already an embed URL — use as-is.
  if (/\/embed(\?|\/|$)/i.test(url)) return url;

  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
}

/** True when the string looks like a Figma link of any kind. */
export function isFigmaUrl(raw: string | undefined | null): boolean {
  return FIGMA_HOSTS.test((raw || "").trim());
}
