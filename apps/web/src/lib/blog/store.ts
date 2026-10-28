// Server-only: blog storage. Vercel Blob in production; a local folder in development when
// Blob credentials are not configured, so the admin works on a fresh checkout.
import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BlogPost } from "@shilan/core";
import { del, list, put } from "@vercel/blob";
import { storedPostSchema } from "./schema";

const POSTS_PREFIX = "blog/posts/";
const IMAGES_PREFIX = "blog/images/";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

interface BlogStorage {
  kind: "vercel-blob" | "local-dev";
  listPosts(): Promise<BlogPost[]>;
  getPost(id: string): Promise<BlogPost | null>;
  savePost(post: BlogPost): Promise<void>;
  deletePost(id: string): Promise<void>;
  saveImage(file: File): Promise<string>;
}

function parsePost(json: unknown, source: string): BlogPost | null {
  const parsed = storedPostSchema.safeParse(json);
  if (!parsed.success) {
    console.error(`[blog] Invalid post document at ${source}`, parsed.error.issues);
    return null;
  }
  return parsed.data;
}

const imageExt = (file: File) =>
  file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";

/* ---------------- Vercel Blob ---------------- */

/**
 * Credentials: a read-write token, or (on Vercel) a connected store id, which the SDK
 * combines with the deployment's OIDC token.
 */
const hasBlobCredentials = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const blobPostPath = (id: string) => `${POSTS_PREFIX}${id}.json`;

/** The version query defeats the Blob CDN cache after an overwrite. */
async function readBlobPost(url: string, version: Date): Promise<BlogPost | null> {
  const res = await fetch(`${url}?v=${version.getTime()}`, { cache: "no-store" });
  return res.ok ? parsePost(await res.json(), url) : null;
}

const vercelBlob: BlogStorage = {
  kind: "vercel-blob",
  async listPosts() {
    const blobs = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: POSTS_PREFIX, cursor, limit: 1000 });
      blobs.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    const posts = await Promise.all(blobs.map((b) => readBlobPost(b.url, b.uploadedAt)));
    return posts.filter((p): p is BlogPost => p !== null);
  },
  async getPost(id) {
    const { blobs } = await list({ prefix: blobPostPath(id), limit: 1 });
    const blob = blobs.find((b) => b.pathname === blobPostPath(id));
    return blob ? readBlobPost(blob.url, blob.uploadedAt) : null;
  },
  async savePost(post) {
    await put(blobPostPath(post.id), JSON.stringify(post), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
    });
  },
  async deletePost(id) {
    await del(blobPostPath(id));
  },
  async saveImage(file) {
    const { url } = await put(`${IMAGES_PREFIX}image.${imageExt(file)}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return url;
  },
};

/* ---------------- Local folder (development only) ---------------- */

export const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "blog");
/** Served by app/dev-uploads/[file]/route.ts in development. */
export const LOCAL_UPLOADS_URL = "/dev-uploads";

const localPostsDir = path.join(LOCAL_DATA_DIR, "posts");
export const localImagesDir = path.join(LOCAL_DATA_DIR, "images");

const localDev: BlogStorage = {
  kind: "local-dev",
  async listPosts() {
    const files = await readdir(localPostsDir).catch(() => [] as string[]);
    const posts = await Promise.all(
      files.filter((f) => f.endsWith(".json")).map(async (f) => {
        const file = path.join(localPostsDir, f);
        return parsePost(JSON.parse(await readFile(file, "utf8")), file);
      }),
    );
    return posts.filter((p): p is BlogPost => p !== null);
  },
  async getPost(id) {
    const file = path.join(localPostsDir, `${id}.json`);
    const raw = await readFile(file, "utf8").catch(() => null);
    return raw ? parsePost(JSON.parse(raw), file) : null;
  },
  async savePost(post) {
    await mkdir(localPostsDir, { recursive: true });
    await writeFile(path.join(localPostsDir, `${post.id}.json`), JSON.stringify(post, null, 2));
  },
  async deletePost(id) {
    await rm(path.join(localPostsDir, `${id}.json`), { force: true });
  },
  async saveImage(file) {
    await mkdir(localImagesDir, { recursive: true });
    const name = `${randomUUID()}.${imageExt(file)}`;
    await writeFile(path.join(localImagesDir, name), Buffer.from(await file.arrayBuffer()));
    return `${LOCAL_UPLOADS_URL}/${name}`;
  },
};

/* ---------------- Public API ---------------- */

function storage(): BlogStorage | null {
  if (hasBlobCredentials()) return vercelBlob;
  if (process.env.NODE_ENV !== "production") return localDev;
  return null;
}

export function storageKind(): BlogStorage["kind"] | null {
  return storage()?.kind ?? null;
}

function requireStorage(): BlogStorage {
  const s = storage();
  if (!s) throw new Error("Blog storage is not configured (connect a Vercel Blob store).");
  return s;
}

const isPostId = (id: string) => /^[a-z0-9]+$/.test(id);

export function newPostId(): string {
  return `${Date.now().toString(36)}${randomUUID().replace(/-/g, "").slice(0, 10)}`;
}

/** Every post, drafts included. Uncached: callers decide how to cache. */
export async function fetchAllPosts(): Promise<BlogPost[]> {
  const s = storage();
  return s ? s.listPosts() : [];
}

export async function fetchPost(id: string): Promise<BlogPost | null> {
  return isPostId(id) ? requireStorage().getPost(id) : null;
}

export async function writePost(post: BlogPost): Promise<void> {
  await requireStorage().savePost(post);
}

export async function removePost(id: string): Promise<void> {
  if (isPostId(id)) await requireStorage().deletePost(id);
}

export async function uploadImage(file: File): Promise<string> {
  return requireStorage().saveImage(file);
}
