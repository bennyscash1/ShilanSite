import { parseMarkdown, readingMinutes, toPlainText, truncate, type BlogPost } from "@shilan/core";

const dateFormat = new Intl.DateTimeFormat("he-IL", { dateStyle: "long", timeZone: "Asia/Jerusalem" });

export function formatPostDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Meta description: explicit SEO text, else the excerpt, else the start of the body. */
export function postDescription(post: BlogPost): string {
  return truncate(post.seoDescription || post.excerpt || toPlainText(parseMarkdown(post.content)), 160);
}

export function postReadingMinutes(post: BlogPost): number {
  return readingMinutes(toPlainText(parseMarkdown(post.content)));
}
