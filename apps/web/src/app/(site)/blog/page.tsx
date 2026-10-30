import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/blog/post-card";
import { siteName, siteUrl } from "@/config/site";
import { blogStrings } from "@/content/ui-strings";
import { getPublishedPosts } from "@/lib/blog/queries";

// Rebuilt on demand when the admin saves a post; this is only a fallback interval.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: blogStrings.title,
  description: blogStrings.description,
  alternates: { canonical: "/blog" },
  openGraph: { title: `${blogStrings.title} | ${siteName}`, description: blogStrings.description, url: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content">
          <h1 className="text-display font-bold">{blogStrings.title}</h1>
          <p className="mt-3 max-w-2xl text-lead">{blogStrings.description}</p>
        </div>
      </section>

      <section className="section-screen">
        <div className="container-content w-full">
        {posts.length === 0 ? (
          <p className="text-center text-title">{blogStrings.empty}</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${blogStrings.title} | ${siteName}`,
          url: `${siteUrl}/blog`,
          inLanguage: "he-IL",
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${siteUrl}/blog/${encodeURIComponent(p.slug)}`,
            datePublished: p.publishedAt,
          })),
        }}
      />
    </main>
  );
}
