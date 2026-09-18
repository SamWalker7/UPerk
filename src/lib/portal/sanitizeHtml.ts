/** Shared allowlist for the "basic" rich text the next-call agenda editor
 *  produces (see AgendaDialog.tsx) — kept in one place so the editor's own
 *  save-time cleanup and the client-portal's render-time cleanup can't
 *  drift apart. Browser-only (DOMParser); on the server it returns the
 *  input untouched; both call sites live behind a "use client" boundary
 *  and only ever run this in the browser. */
const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "UL", "OL", "LI", "A", "BR", "DIV", "P"]);

export function sanitizeAgendaHtml(html: string): string {
  if (typeof window === "undefined" || !html) return html;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!ALLOWED_TAGS.has(el.tagName)) {
          while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
          el.remove();
          continue;
        }
        for (const attr of Array.from(el.attributes)) {
          if (el.tagName === "A" && attr.name === "href") continue;
          el.removeAttribute(attr.name);
        }
        if (el.tagName === "A") {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noreferrer");
        }
        walk(el);
      } else if (child.nodeType !== Node.TEXT_NODE) {
        child.remove();
      }
    }
  };
  walk(doc.body);
  return doc.body.innerHTML;
}
