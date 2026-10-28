import { describe, expect, it } from "vitest";
import { parseInline, parseMarkdown, readingMinutes, safeUrl, toPlainText, truncate } from "./markdown";
import { isValidSlug, slugify, sortPosts, type BlogPost } from "./post";

describe("slugify", () => {
  it("keeps Hebrew words and joins them with hyphens", () => {
    expect(slugify('מט"ח לעסקים 2026')).toBe("מטח-לעסקים-2026");
  });

  it("lowercases latin text and strips punctuation and niqqud", () => {
    expect(slugify("  Hello, World!  ")).toBe("hello-world");
    expect(slugify("שָׁלוֹם")).toBe("שלום");
  });

  it("validates slugs", () => {
    expect(isValidSlug("מטח-לעסקים-2026")).toBe(true);
    expect(isValidSlug("bad slug")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("sortPosts", () => {
  const base = { slug: "s", title: "t", excerpt: "", content: "", status: "published" as const, createdAt: "" };
  it("orders newest first by publish date", () => {
    const posts: BlogPost[] = [
      { ...base, id: "a", updatedAt: "2026-01-01", publishedAt: "2026-01-01" },
      { ...base, id: "b", updatedAt: "2026-03-01", publishedAt: "2026-03-01" },
      { ...base, id: "c", updatedAt: "2026-02-01" },
    ];
    expect(sortPosts(posts).map((p) => p.id)).toEqual(["b", "c", "a"]);
  });
});

describe("markdown", () => {
  it("parses headings, paragraphs, lists, quotes, images and dividers", () => {
    const blocks = parseMarkdown(
      [
        "# כותרת",
        "### תת כותרת",
        "",
        "שורה ראשונה",
        "שורה שנייה",
        "",
        "- אחד",
        "- שניים",
        "1. ראשון",
        "> ציטוט",
        "![תמונה](https://example.com/a.png)",
        "---",
      ].join("\n"),
    );
    expect(blocks.map((b) => b.type)).toEqual([
      "heading",
      "heading",
      "paragraph",
      "list",
      "list",
      "quote",
      "image",
      "divider",
    ]);
    expect(blocks[0]).toMatchObject({ level: 2 });
    expect(blocks[1]).toMatchObject({ level: 3 });
    expect(blocks[2]).toMatchObject({ lines: [[{ value: "שורה ראשונה" }], [{ value: "שורה שנייה" }]] });
    expect(blocks[3]).toMatchObject({ ordered: false });
    expect(blocks[4]).toMatchObject({ ordered: true });
  });

  it("parses inline bold, italic and links", () => {
    expect(parseInline("a **b** *c* [d](https://x.co)")).toEqual([
      { type: "text", value: "a " },
      { type: "strong", children: [{ type: "text", value: "b" }] },
      { type: "text", value: " " },
      { type: "em", children: [{ type: "text", value: "c" }] },
      { type: "text", value: " " },
      { type: "link", href: "https://x.co", children: [{ type: "text", value: "d" }] },
    ]);
  });

  it("drops unsafe URLs", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("//evil.com")).toBeNull();
    expect(safeUrl("/contact")).toBe("/contact");
    expect(parseInline("[x](javascript:alert(1))")[0]).toMatchObject({ type: "text" });
    expect(parseMarkdown("![x](javascript:void)")).toEqual([]);
    // Unparseable image syntax degrades to plain text, never to an image or link.
    expect(JSON.stringify(parseMarkdown("![x](javascript:alert(1))"))).not.toMatch(/"type":"(image|link)"/);
  });

  it("never produces HTML from raw tags", () => {
    expect(toPlainText(parseMarkdown("<script>alert(1)</script>"))).toBe("<script>alert(1)</script>");
  });

  it("extracts plain text, truncates and estimates reading time", () => {
    const text = toPlainText(parseMarkdown("## כותרת\n\nטקסט **מודגש** עם [קישור](/a)"));
    expect(text).toBe("כותרת טקסט מודגש עם קישור");
    expect(truncate("one two three four", 10)).toBe("one two…");
    expect(readingMinutes("word ".repeat(450))).toBe(2);
  });
});
