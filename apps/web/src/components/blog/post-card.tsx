import type { BlogPost } from "@shilan/core";
import Link from "next/link";
import { blogStrings } from "@/content/ui-strings";
import { formatPostDate, postDescription, postReadingMinutes } from "@/lib/blog/format";
import { BlogImage } from "./blog-image";

export function PostCard({ post, headingLevel = "h2" }: { post: BlogPost; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-gold-500 bg-white shadow-card transition-shadow hover:shadow-[0_6px_28px_rgb(0_0_0/0.16)]">
      <div className="relative aspect-[16/9] bg-cream-50">
        {post.coverImage && (
          <BlogImage
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-caption opacity-75">
          <time dateTime={post.publishedAt}>{post.publishedAt && formatPostDate(post.publishedAt)}</time>
          {" · "}
          {blogStrings.readingTime(postReadingMinutes(post))}
        </p>
        <Heading className="mt-2 text-title font-bold text-gold-500">
          {/* The stretched link makes the whole card clickable. */}
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-body">{postDescription(post)}</p>
      </div>
    </article>
  );
}
