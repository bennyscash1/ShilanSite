/**
 * A small, safe markdown subset for blog posts. It parses to a plain AST that the site renders
 * as React elements, so author content can never inject HTML or scripts.
 *
 * Supported:
 *   ## Heading / ### Sub-heading      (a single "#" is treated as "##"; the post title is the h1)
 *   - item / * item                   unordered list
 *   1. item                           ordered list
 *   > quote                           blockquote
 *   ![alt](https://...)               image on its own line
 *   ---                               divider
 *   **bold**, *italic*, [text](url)   inline
 * Paragraphs are separated by a blank line; a single newline is a line break.
 */

export type Inline =
  | { type: "text"; value: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "heading"; level: 2 | 3; children: Inline[] }
  | { type: "paragraph"; lines: Inline[][] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "quote"; lines: Inline[][] }
  | { type: "image"; src: string; alt: string }
  | { type: "divider" };

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

/** Only http(s), mailto, tel, site-relative and anchor links are kept. */
export function safeUrl(url: string): string | null {
  const trimmed = url.trim();
  return SAFE_URL.test(trimmed) ? trimmed : null;
}

const INLINE_RE = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const index = m.index ?? 0;
    if (index > last) out.push({ type: "text", value: text.slice(last, index) });
    const [whole, strong, em, linkText, linkUrl] = m;
    if (strong !== undefined) out.push({ type: "strong", children: parseInline(strong) });
    else if (em !== undefined) out.push({ type: "em", children: parseInline(em) });
    else if (linkText !== undefined && linkUrl !== undefined) {
      const href = safeUrl(linkUrl);
      out.push(
        href
          ? { type: "link", href, children: parseInline(linkText) }
          : { type: "text", value: whole },
      );
    }
    last = index + whole.length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}

const HEADING_RE = /^(#{1,3})\s+(.*)$/;
const UL_RE = /^[-*]\s+(.*)$/;
const OL_RE = /^\d+[.)]\s+(.*)$/;
const QUOTE_RE = /^>\s?(.*)$/;
const IMAGE_RE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const DIVIDER_RE = /^(-{3,}|\*{3,})$/;

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = (lines[i] ?? "").trim();
    if (line === "") {
      i++;
      continue;
    }

    const heading = HEADING_RE.exec(line);
    if (heading) {
      const level = (heading[1] ?? "").length === 3 ? 3 : 2;
      blocks.push({ type: "heading", level, children: parseInline(heading[2] ?? "") });
      i++;
      continue;
    }

    if (DIVIDER_RE.test(line)) {
      blocks.push({ type: "divider" });
      i++;
      continue;
    }

    const image = IMAGE_RE.exec(line);
    if (image) {
      const src = safeUrl(image[2] ?? "");
      if (src) blocks.push({ type: "image", src, alt: image[1] ?? "" });
      i++;
      continue;
    }

    if (UL_RE.test(line) || OL_RE.test(line)) {
      const ordered = OL_RE.test(line);
      const re = ordered ? OL_RE : UL_RE;
      const items: Inline[][] = [];
      while (i < lines.length) {
        const m = re.exec((lines[i] ?? "").trim());
        if (!m) break;
        items.push(parseInline(m[1] ?? ""));
        i++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    if (QUOTE_RE.test(line)) {
      const quoteLines: Inline[][] = [];
      while (i < lines.length) {
        const m = QUOTE_RE.exec((lines[i] ?? "").trim());
        if (!m) break;
        quoteLines.push(parseInline(m[1] ?? ""));
        i++;
      }
      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }

    // Paragraph: consecutive lines until a blank line or another block starts.
    const paragraph: Inline[][] = [];
    while (i < lines.length) {
      const current = (lines[i] ?? "").trim();
      if (
        current === "" ||
        HEADING_RE.test(current) ||
        UL_RE.test(current) ||
        OL_RE.test(current) ||
        QUOTE_RE.test(current) ||
        IMAGE_RE.test(current) ||
        DIVIDER_RE.test(current)
      ) {
        break;
      }
      paragraph.push(parseInline(current));
      i++;
    }
    blocks.push({ type: "paragraph", lines: paragraph });
  }

  return blocks;
}

function inlineText(nodes: Inline[]): string {
  return nodes.map((n) => (n.type === "text" ? n.value : inlineText(n.children))).join("");
}

/** Plain text of a document (for meta descriptions and reading time). */
export function toPlainText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
          return inlineText(b.children);
        case "paragraph":
        case "quote":
          return b.lines.map(inlineText).join(" ");
        case "list":
          return b.items.map(inlineText).join(" ");
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cuts text at a word boundary, adding an ellipsis when shortened. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/** Minutes to read, at ~200 words per minute (minimum 1). */
export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
