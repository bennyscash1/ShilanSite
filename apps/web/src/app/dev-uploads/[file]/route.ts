import { readFile } from "node:fs/promises";
import path from "node:path";
import { localImagesDir } from "@/lib/blog/store";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

/** Development only: serves images uploaded to the local blog storage. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  const { file } = await params;
  if (!/^[a-f0-9-]+\.[a-z0-9]+$/.test(file)) return new Response(null, { status: 404 });
  const data = await readFile(path.join(localImagesDir, file)).catch(() => null);
  if (!data) return new Response(null, { status: 404 });
  const ext = file.split(".").pop() ?? "";
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "no-store" },
  });
}
