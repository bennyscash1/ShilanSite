import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { getPublishedPosts } from "@/lib/blog/queries";

export const revalidate = 3600;

// Only routes that exist today. Add inner pages here as they are built.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts[0]?.updatedAt;
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(p.slug)}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
