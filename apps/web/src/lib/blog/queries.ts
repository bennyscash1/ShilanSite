// Server-only: cached reads for the public blog pages.
import { isPublished, sortPosts, type BlogPost } from "@shilan/core";
import { unstable_cache } from "next/cache";
import { fetchAllPosts, storageKind } from "./store";

/** Cache tag cleared by every admin save/delete (see app/admin/actions.ts). */
export const BLOG_CACHE_TAG = "blog";

// Throws on storage errors so a failure is never cached; callers fall back below.
const cachedPublishedPosts = unstable_cache(
  async () => sortPosts((await fetchAllPosts()).filter(isPublished)),
  ["blog-published-posts"],
  { tags: [BLOG_CACHE_TAG], revalidate: 3600 },
);

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!storageKind()) return [];
  try {
    return await cachedPublishedPosts();
  } catch (error) {
    console.error("[blog] Could not load posts", error);
    return [];
  }
}

/** Route params may arrive percent-encoded (Hebrew slugs); compare decoded. */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // Keep the raw value.
  }
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === decoded) ?? null;
}
