import { existsSync } from "node:fs";
import path from "node:path";
import { isValidSlug, parseMarkdown } from "@shilan/core";
import { describe, expect, it } from "vitest";
import { postFormSchema } from "../lib/blog/schema";
import { seedPosts } from "./blog-seed";

describe("blog seed posts", () => {
  it("has three posts with unique, valid slugs", () => {
    expect(seedPosts).toHaveLength(3);
    expect(new Set(seedPosts.map((p) => p.slug)).size).toBe(3);
    for (const p of seedPosts) expect(isValidSlug(p.slug), p.slug).toBe(true);
  });

  it.each(seedPosts)("$slug passes the editor validation", (p) => {
    const result = postFormSchema.safeParse({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverUrl: p.coverImage.url,
      coverAlt: p.coverImage.alt,
      status: "published",
      seoTitle: p.seoTitle ?? "",
      seoDescription: "",
    });
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it.each(seedPosts)("$slug has a cover file and structured content", (p) => {
    expect(existsSync(path.join(process.cwd(), "public", p.coverImage.url))).toBe(true);
    const blocks = parseMarkdown(p.content);
    expect(blocks.filter((b) => b.type === "heading").length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(blocks)).toContain('"href":"/#contact"');
  });
});
