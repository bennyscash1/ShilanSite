export type PostStatus = "draft" | "published";

export interface PostImage {
  url: string;
  alt: string;
}

/** A blog post as stored (one JSON document per post). Dates are ISO-8601 strings. */
export interface BlogPost {
  id: string;
  /** URL segment: /blog/{slug}. Hebrew letters, latin letters, digits and hyphens. */
  slug: string;
  title: string;
  /** Short summary shown on cards; also the default meta description. */
  excerpt: string;
  /** Body in the site's markdown subset (see ./markdown.ts). */
  content: string;
  coverImage?: PostImage;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  /** Set the first time the post is published. */
  publishedAt?: string;
  /** Optional overrides for search results. */
  seoTitle?: string;
  seoDescription?: string;
}

const SLUG_RE = /^[a-z0-9א-ת]+(?:-[a-z0-9א-ת]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 120 && SLUG_RE.test(slug);
}

/** Builds a URL slug from a (Hebrew or English) title: "מט"ח לעסקים 2026" -> "מטח-לעסקים-2026". */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFC")
    .replace(/[֑-ׇ]/g, "") // Hebrew niqqud and cantillation marks
    .replace(/["'״׳`’”]/g, "")
    .replace(/[^a-z0-9א-ת]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

export function isPublished(post: BlogPost): boolean {
  return post.status === "published" && Boolean(post.publishedAt);
}

/** Newest first, by publish date (falls back to last update for drafts). */
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  const key = (p: BlogPost) => p.publishedAt ?? p.updatedAt;
  return [...posts].sort((a, b) => key(b).localeCompare(key(a)));
}
