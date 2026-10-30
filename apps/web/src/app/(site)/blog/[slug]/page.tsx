import { Button } from "@shilan/ui/components/button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogImage } from "@/components/blog/blog-image";
import { PostCard } from "@/components/blog/post-card";
import { PostContent } from "@/components/blog/post-content";
import { JsonLd } from "@/components/json-ld";
import { siteName, siteUrl } from "@/config/site";
import { headerCta } from "@/content/site";
import { blogStrings } from "@/content/ui-strings";
import { formatPostDate, postDescription, postReadingMinutes } from "@/lib/blog/format";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog/queries";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPostBySlug((await params).slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = postDescription(post);
  const url = `/blog/${encodeURIComponent(post.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage ? [{ url: post.coverImage.url, alt: post.coverImage.alt }] : undefined,
    },
    twitter: { card: post.coverImage ? "summary_large_image" : "summary", title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPublishedPostBySlug((await params).slug);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
  const others = (await getPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main id="main">
      <article>
        <header className="section-screen bg-brand-radial text-white">
          <div className="container-content max-w-4xl!">
            <nav aria-label="breadcrumb" className="text-caption">
              <ol className="flex flex-wrap gap-2 opacity-90">
                <li>
                  <Link href="/" className="hover:underline">
                    {blogStrings.home}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="hover:underline">
                    {blogStrings.title}
                  </Link>
                </li>
              </ol>
            </nav>
            <h1 className="mt-4 text-display font-bold text-balance">{post.title}</h1>
            <p className="mt-4 text-body opacity-90">
              <time dateTime={post.publishedAt}>{post.publishedAt && formatPostDate(post.publishedAt)}</time>
              {" · "}
              {blogStrings.readingTime(postReadingMinutes(post))}
            </p>
          </div>
        </header>

        <div className="container-content max-w-4xl! py-16 md:py-28">
          {post.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-card">
              <BlogImage
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                fill
                priority
                sizes="(min-width: 960px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <PostContent source={post.content} />

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-card bg-green-900 p-6 text-white sm:p-8">
            <p className="text-title font-bold">{siteName}</p>
            <Button asChild>
              <Link href={headerCta.href}>{headerCta.label}</Link>
            </Button>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="section-screen bg-cream-50">
          <div className="container-content">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-h3 font-bold">{blogStrings.latest}</h2>
              <Link href="/blog" className="text-body text-gold-700 underline underline-offset-4">
                {blogStrings.backToBlog}
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: postDescription(post),
          image: post.coverImage ? [post.coverImage.url] : undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          inLanguage: "he-IL",
          mainEntityOfPage: url,
          url,
          author: { "@type": "Organization", name: siteName, url: siteUrl },
          publisher: { "@type": "Organization", name: siteName, url: siteUrl },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: blogStrings.home, item: siteUrl },
            { "@type": "ListItem", position: 2, name: blogStrings.title, item: `${siteUrl}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        }}
      />
    </main>
  );
}
