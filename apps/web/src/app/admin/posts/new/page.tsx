import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { requireAdmin } from "@/lib/admin/session";
import { PostEditor } from "../post-editor";

export const metadata: Metadata = { title: "פוסט חדש" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <main id="main" className="container-content py-10">
      <h1 className="mb-6 text-h3 font-bold">פוסט חדש</h1>
      <PostEditor siteUrl={siteUrl} />
    </main>
  );
}
