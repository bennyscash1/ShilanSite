"use server";

import type { BlogPost } from "@shilan/core";
import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { seedPosts } from "@/content/blog-seed";
import {
  clearFailures,
  createSession,
  credentialsMatch,
  deleteSession,
  isLockedOut,
  recordFailure,
  requireAdmin,
} from "@/lib/admin/session";
import { BLOG_CACHE_TAG } from "@/lib/blog/queries";
import { postFormSchema } from "@/lib/blog/schema";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  fetchAllPosts,
  fetchPost,
  newPostId,
  removePost,
  uploadImage,
  writePost,
} from "@/lib/blog/store";

/* ---------------- Auth ---------------- */

/** `email` is echoed back so the field survives React's automatic form reset after an action. */
export type LoginState = { error?: string; email?: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (isLockedOut(ip)) return { error: "יותר מדי ניסיונות כושלים. נסו שוב בעוד 15 דקות.", email };

  if (!credentialsMatch(email, password)) {
    recordFailure(ip);
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "אימייל או סיסמה שגויים.", email };
  }

  clearFailures(ip);
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}

/* ---------------- Posts ---------------- */

export type SavePostState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
};

function revalidateBlog(slugs: string[]) {
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/blog");
  for (const slug of slugs) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function savePostAction(_prev: SavePostState, formData: FormData): Promise<SavePostState> {
  await requireAdmin();

  const parsed = postFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { errors, message: "יש לתקן את השדות המסומנים." };
  }
  const values = parsed.data;

  let saved: BlogPost;
  let previousSlug: string | undefined;
  try {
    const all = await fetchAllPosts();
    if (all.some((p) => p.slug === values.slug && p.id !== values.id)) {
      return { errors: { slug: "כתובת זו כבר בשימוש בפוסט אחר." }, message: "יש לתקן את השדות המסומנים." };
    }

    const existing = values.id ? await fetchPost(values.id) : null;
    if (values.id && !existing) return { message: "הפוסט לא נמצא (ייתכן שנמחק)." };
    previousSlug = existing?.slug;

    const now = new Date().toISOString();
    saved = {
      id: existing?.id ?? newPostId(),
      slug: values.slug,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      coverImage: values.coverUrl ? { url: values.coverUrl, alt: values.coverAlt || values.title } : undefined,
      status: values.status,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt: existing?.publishedAt ?? (values.status === "published" ? now : undefined),
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
    };
    await writePost(saved);
  } catch (error) {
    console.error("[admin] Save failed", error);
    return { message: "השמירה נכשלה. בדקו את חיבור האחסון ונסו שוב." };
  }

  revalidateBlog([saved.slug, ...(previousSlug && previousSlug !== saved.slug ? [previousSlug] : [])]);

  if (!values.id) redirect(`/admin/posts/${saved.id}?saved=1`);
  return { ok: true, message: saved.status === "published" ? "נשמר ופורסם באתר." : "נשמר כטיוטה." };
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const post = await fetchPost(id);
  if (post) {
    await removePost(id);
    revalidateBlog([post.slug]);
  }
  redirect("/admin?deleted=1");
}

/** Publishes the starter posts from content/blog-seed.ts, skipping any slug that already exists. */
export async function seedPostsAction(): Promise<void> {
  await requireAdmin();
  const existing = new Set((await fetchAllPosts()).map((p) => p.slug));
  const now = Date.now();
  let added = 0;
  for (const [i, seed] of seedPosts.entries()) {
    if (existing.has(seed.slug)) continue;
    // Stagger the dates a few days apart so the list has a natural order (first post newest).
    const date = new Date(now - i * 3 * 24 * 60 * 60 * 1000).toISOString();
    await writePost({
      id: newPostId(),
      slug: seed.slug,
      title: seed.title,
      excerpt: seed.excerpt,
      content: seed.content,
      coverImage: seed.coverImage,
      status: "published",
      createdAt: date,
      updatedAt: date,
      publishedAt: date,
      seoTitle: seed.seoTitle,
    });
    added++;
  }
  revalidateBlog(seedPosts.map((s) => s.slug));
  redirect(`/admin?seeded=${added}`);
}

/* ---------------- Images ---------------- */

export type UploadState = { url?: string; error?: string };

const uploadSchema = z.instanceof(File).refine((f) => f.size > 0, "לא נבחר קובץ");

export async function uploadImageAction(formData: FormData): Promise<UploadState> {
  await requireAdmin();
  const parsed = uploadSchema.safeParse(formData.get("file"));
  if (!parsed.success) return { error: "לא נבחר קובץ." };
  const file = parsed.data;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: "ניתן להעלות JPG, PNG, WEBP, AVIF או GIF בלבד." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "התמונה גדולה מדי (עד 4MB)." };
  try {
    return { url: await uploadImage(file) };
  } catch (error) {
    console.error("[admin] Upload failed", error);
    return { error: "ההעלאה נכשלה. נסו שוב." };
  }
}
