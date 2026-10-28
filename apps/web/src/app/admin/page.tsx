import { Button } from "@shilan/ui/components/button";
import type { BlogPost } from "@shilan/core";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { formatPostDate } from "@/lib/blog/format";
import { fetchAllPosts, storageKind } from "@/lib/blog/store";
import { seedPostsAction } from "./actions";
import { DeletePostButton } from "./delete-post-button";

export const metadata: Metadata = { title: "פוסטים" };

type Props = { searchParams: Promise<{ deleted?: string; seeded?: string }> };

export default async function AdminHomePage({ searchParams }: Props) {
  await requireAdmin();
  const { deleted, seeded } = await searchParams;
  const kind = storageKind();

  let posts: BlogPost[] = [];
  let loadError = false;
  try {
    posts = (await fetchAllPosts()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (error) {
    console.error("[admin] Could not list posts", error);
    loadError = true;
  }

  return (
    <main id="main" className="container-content py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h3 font-bold">פוסטים בבלוג</h1>
        {kind && (
          <Button asChild>
            <Link href="/admin/posts/new">+ פוסט חדש</Link>
          </Button>
        )}
      </div>

      {kind === "local-dev" && (
        <p className="mt-6 rounded-control bg-gold-500/10 p-4 text-body">
          מצב פיתוח: Vercel Blob לא מחובר, ולכן הפוסטים נשמרים בתיקייה מקומית (apps/web/.data) ולא יופיעו באתר
          החי.
        </p>
      )}
      {!kind && (
        <p role="alert" className="mt-6 rounded-control bg-red-50 p-4 text-body text-red-800">
          האחסון לא מחובר. יש לחבר את ה-Blob Store לפרויקט ב-Vercel (Storage › Connect).
        </p>
      )}
      {loadError && (
        <p role="alert" className="mt-6 rounded-control bg-red-50 p-4 text-body text-red-800">
          טעינת הפוסטים נכשלה. רעננו את העמוד או בדקו את חיבור האחסון.
        </p>
      )}
      {deleted && (
        <p role="status" className="mt-6 rounded-control bg-green-900/10 p-4 text-body">
          הפוסט נמחק.
        </p>
      )}

      {seeded !== undefined && (
        <p role="status" className="mt-6 rounded-control bg-green-900/10 p-4 text-body">
          {seeded === "0" ? "הפוסטים לדוגמה כבר קיימים." : `נוספו ${seeded} פוסטים לדוגמה ופורסמו באתר.`}
        </p>
      )}

      {kind && !loadError && posts.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-title">עדיין אין פוסטים. לחצו על &quot;פוסט חדש&quot; כדי להתחיל,</p>
          <p className="text-body">או הוסיפו 3 מאמרים מוכנים (עם תמונות) שאפשר לערוך אחר כך:</p>
          <form action={seedPostsAction}>
            <Button type="submit" variant="ghost" className="border border-green-900/30 bg-white">
              הוספת 3 פוסטים לדוגמה
            </Button>
          </form>
        </div>
      )}

      {posts.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-card border border-green-900/10 bg-white p-5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-title font-bold">{post.title}</p>
                <p className="mt-1 text-caption opacity-75">
                  <span
                    className={
                      post.status === "published"
                        ? "rounded-full bg-green-900 px-2 py-0.5 text-white"
                        : "rounded-full bg-gold-500/20 px-2 py-0.5"
                    }
                  >
                    {post.status === "published" ? "מפורסם" : "טיוטה"}
                  </span>{" "}
                  · עודכן {formatPostDate(post.updatedAt)}
                  {" · "}
                  <span dir="ltr">/blog/{post.slug}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {post.status === "published" && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      צפייה
                    </Link>
                  </Button>
                )}
                <Button asChild variant="ghost" size="sm" className="border border-green-900/25">
                  <Link href={`/admin/posts/${post.id}`}>עריכה</Link>
                </Button>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
