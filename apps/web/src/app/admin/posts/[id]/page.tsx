import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/config/site";
import { requireAdmin } from "@/lib/admin/session";
import { fetchPost } from "@/lib/blog/store";
import { PostEditor } from "../post-editor";

export const metadata: Metadata = { title: "עריכת פוסט" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditPostPage({ params, searchParams }: Props) {
  await requireAdmin();
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const post = await fetchPost(id);
  if (!post) notFound();

  return (
    <main id="main" className="container-content py-10">
      <h1 className="mb-6 text-h3 font-bold">עריכת פוסט</h1>
      <PostEditor post={post} siteUrl={siteUrl} justSaved={saved === "1"} />
    </main>
  );
}
