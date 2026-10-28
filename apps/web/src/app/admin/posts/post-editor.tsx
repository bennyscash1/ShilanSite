"use client";

import { Button } from "@shilan/ui/components/button";
import { slugify, type BlogPost } from "@shilan/core";
import { useActionState, useRef, useState, useTransition, type ReactNode } from "react";
import { PostContent } from "@/components/blog/post-content";
import { savePostAction, uploadImageAction, type SavePostState } from "../actions";
import { adminError, adminHint, adminInput, adminLabel, adminPanel } from "../admin-styles";
import { DeletePostButton } from "../delete-post-button";

type Props = { post?: BlogPost; siteUrl: string; justSaved?: boolean };

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={adminLabel}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={adminError}>
          {error}
        </p>
      ) : (
        hint && <p className={adminHint}>{hint}</p>
      )}
    </div>
  );
}

const counter = (value: string, max: number) => `${value.length}/${max} תווים`;

/** Formatting buttons. `line` items start a new block; the others wrap the selection. */
type ToolbarItem = { label: string; title: string; before: string; after?: string; placeholder: string; line?: boolean };

const TOOLBAR: ToolbarItem[] = [
  { label: "כותרת", title: "כותרת משנה (##)", before: "## ", placeholder: "כותרת", line: true },
  { label: "כותרת קטנה", title: "כותרת קטנה (###)", before: "### ", placeholder: "כותרת", line: true },
  { label: "B", title: "מודגש (**טקסט**)", before: "**", after: "**", placeholder: "טקסט מודגש" },
  { label: "I", title: "נטוי (*טקסט*)", before: "*", after: "*", placeholder: "טקסט נטוי" },
  { label: "• רשימה", title: "רשימה (- פריט)", before: "- ", placeholder: "פריט", line: true },
  { label: "1. רשימה", title: "רשימה ממוספרת (1. פריט)", before: "1. ", placeholder: "פריט", line: true },
  { label: "ציטוט", title: "ציטוט (> טקסט)", before: "> ", placeholder: "ציטוט", line: true },
  { label: "קישור", title: "קישור ([טקסט](כתובת))", before: "[", after: "](https://)", placeholder: "טקסט הקישור" },
];

export function PostEditor({ post, siteUrl, justSaved }: Props) {
  const [state, formAction, saving] = useActionState<SavePostState, FormData>(
    savePostAction,
    justSaved ? { ok: true, message: post?.status === "published" ? "נשמר ופורסם באתר." : "נשמר כטיוטה." } : {},
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.coverImage?.url ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.coverImage?.alt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  // Every field is controlled: React resets uncontrolled fields after a form action.
  const [status, setStatus] = useState<BlogPost["status"]>(post?.status ?? "draft");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploadError, setUploadError] = useState<string>();
  const [uploading, startUpload] = useTransition();
  const [, startSave] = useTransition();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);

  const errors = state.errors ?? {};
  const effectiveSlug = slugEdited ? slug : slugify(title);

  const upload = (file: File | undefined, onDone: (url: string) => void) => {
    if (!file) return;
    setUploadError(undefined);
    startUpload(async () => {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadImageAction(fd);
      if (result.url) onDone(result.url);
      else setUploadError(result.error);
    });
  };

  /** Wraps the selection (or inserts at the cursor) in the content textarea. */
  const insert = (before: string, after = "", placeholder = "") => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  /** Starts a block (heading, list...) on its own line. */
  const insertLine = (prefix: string, placeholder: string) => {
    const el = contentRef.current;
    const start = el?.selectionStart ?? content.length;
    const needsNewline = start > 0 && content[start - 1] !== "\n";
    insert(`${needsNewline ? "\n\n" : ""}${prefix}`, "", placeholder);
  };

  const applyTool = (tool: ToolbarItem) =>
    tool.line ? insertLine(tool.before, tool.placeholder) : insert(tool.before, tool.after, tool.placeholder);

  const googleTitle = seoTitle || title || "כותרת הפוסט";
  const googleDescription = seoDescription || excerpt || "תיאור הפוסט יופיע כאן.";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <form
        id="post-form"
        className="flex flex-col gap-6"
        noValidate
        // Dispatched manually: a plain `action={...}` makes React reset the form after saving,
        // which snaps <select> back to its initial option.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startSave(() => formAction(data));
        }}
      >
        {post && <input type="hidden" name="id" value={post.id} />}
        <input type="hidden" name="coverUrl" value={coverUrl} />

        <div className={`${adminPanel} flex flex-col gap-5`}>
          <Field id="title" label="כותרת הפוסט" error={errors.title}>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(errors.title)}
              className={`${adminInput} text-title font-bold`}
              required
            />
          </Field>

          <Field
            id="slug"
            label="כתובת הפוסט (URL)"
            error={errors.slug}
            hint={
              <span dir="ltr" className="inline-block">
                {siteUrl}/blog/{effectiveSlug || "..."}
              </span>
            }
          >
            <input
              id="slug"
              name="slug"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
              onBlur={() => setSlug(slugify(effectiveSlug))}
              aria-invalid={Boolean(errors.slug)}
              className={adminInput}
            />
          </Field>

          <Field
            id="excerpt"
            label="תקציר"
            error={errors.excerpt}
            hint={`מוצג בכרטיס הפוסט ובתוצאות גוגל. מומלץ 120–160 תווים · ${counter(excerpt, 300)}`}
          >
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              aria-invalid={Boolean(errors.excerpt)}
              className={adminInput}
            />
          </Field>
        </div>

        <div className={adminPanel}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={adminLabel}>תוכן הפוסט</p>
            <div role="tablist" className="flex rounded-control border border-green-900/25 p-0.5">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className="min-h-9 cursor-pointer rounded-[4px] px-4 text-caption aria-selected:bg-green-900 aria-selected:text-white"
                >
                  {t === "write" ? "כתיבה" : "תצוגה מקדימה"}
                </button>
              ))}
            </div>
          </div>

          <div hidden={tab !== "write"}>
            <div className="mt-3 flex flex-wrap gap-1.5" role="toolbar" aria-label="עיצוב טקסט">
              {TOOLBAR.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  title={b.title}
                  onClick={() => applyTool(b)}
                  className="min-h-9 cursor-pointer rounded-control border border-green-900/20 bg-white px-3 text-caption hover:bg-green-900/5"
                >
                  {b.label}
                </button>
              ))}
              <button
                type="button"
                disabled={uploading}
                onClick={() => inlineImageRef.current?.click()}
                className="min-h-9 cursor-pointer rounded-control border border-green-900/20 bg-white px-3 text-caption hover:bg-green-900/5 disabled:opacity-50"
              >
                {uploading ? "מעלה..." : "+ תמונה"}
              </button>
              <input
                ref={inlineImageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  upload(e.target.files?.[0], (url) => insertLine(`![תיאור התמונה](${url})`, ""));
                  e.target.value = "";
                }}
              />
            </div>
            <textarea
              ref={contentRef}
              id="content"
              name="content"
              aria-label="תוכן הפוסט"
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-invalid={Boolean(errors.content)}
              className={`${adminInput} mt-3 font-mono text-[0.95rem] leading-relaxed`}
            />
            {errors.content ? (
              <p className={adminError}>{errors.content}</p>
            ) : (
              <p className={adminHint}>
                שורה ריקה = פסקה חדשה · ## כותרת · **מודגש** · - רשימה · [קישור](כתובת)
              </p>
            )}
          </div>

          {tab === "preview" && (
            <div className="mt-4 min-h-60 rounded-control border border-dashed border-green-900/20 p-5">
              {content.trim() ? <PostContent source={content} /> : <p className="opacity-60">אין עדיין תוכן.</p>}
            </div>
          )}
        </div>

        <div className={`${adminPanel} flex flex-col gap-5`}>
          <p className="text-title font-bold">קידום בגוגל (SEO) · אופציונלי</p>
          <Field
            id="seoTitle"
            label="כותרת לגוגל"
            error={errors.seoTitle}
            hint={`אם ריק, תשמש כותרת הפוסט. עד 60 תווים מוצגים בגוגל · ${counter(seoTitle, 70)}`}
          >
            <input
              id="seoTitle"
              name="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              aria-invalid={Boolean(errors.seoTitle)}
              className={adminInput}
            />
          </Field>
          <Field
            id="seoDescription"
            label="תיאור לגוגל"
            error={errors.seoDescription}
            hint={`אם ריק, ישמש התקציר · ${counter(seoDescription, 170)}`}
          >
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              aria-invalid={Boolean(errors.seoDescription)}
              className={adminInput}
            />
          </Field>
          <div aria-label="תצוגה מקדימה בגוגל" className="rounded-control border border-green-900/10 bg-white p-4">
            <p className="text-caption text-[#4d5156]" dir="ltr">
              {siteUrl.replace(/^https?:\/\//, "")} › blog
            </p>
            <p className="mt-1 truncate text-[1.15rem] text-[#1a0dab]">{googleTitle}</p>
            <p className="mt-1 line-clamp-2 text-caption text-[#4d5156]">{googleDescription}</p>
          </div>
        </div>
      </form>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <div className={`${adminPanel} flex flex-col gap-4`}>
          <Field id="status" label="סטטוס">
            <select
              id="status"
              name="status"
              form="post-form"
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogPost["status"])}
              className={adminInput}
            >
              <option value="draft">טיוטה (לא מוצג באתר)</option>
              <option value="published">מפורסם (מוצג באתר)</option>
            </select>
          </Field>
          <Button type="submit" form="post-form" disabled={saving || uploading} className="w-full">
            {saving ? "שומר..." : "שמירה"}
          </Button>
          {state.message && (
            <p
              role={state.ok ? "status" : "alert"}
              className={`rounded-control p-3 text-body ${state.ok ? "bg-green-900/10" : "bg-red-50 text-red-800"}`}
            >
              {state.message}
            </p>
          )}
          {post?.status === "published" && (
            <a href={`/blog/${post.slug}`} target="_blank" className="text-body text-gold-700 underline">
              צפייה בפוסט באתר ↗
            </a>
          )}
        </div>

        <div className={`${adminPanel} flex flex-col gap-3`}>
          <p className={adminLabel}>תמונה ראשית</p>
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="aspect-[16/9] w-full rounded-control object-cover" />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-control border border-dashed border-green-900/25 text-caption opacity-60">
              אין תמונה
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploading}
              onClick={() => coverInputRef.current?.click()}
              className="flex-1 border border-green-900/25"
            >
              {uploading ? "מעלה..." : coverUrl ? "החלפת תמונה" : "העלאת תמונה"}
            </Button>
            {coverUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setCoverUrl("")} className="text-red-700">
                הסרה
              </Button>
            )}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              upload(e.target.files?.[0], setCoverUrl);
              e.target.value = "";
            }}
          />
          <Field id="coverAlt" label="תיאור התמונה (לנגישות ולגוגל)" error={errors.coverAlt}>
            <input
              id="coverAlt"
              name="coverAlt"
              form="post-form"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className={adminInput}
            />
          </Field>
          {(uploadError || errors.coverUrl) && (
            <p role="alert" className={adminError}>
              {uploadError || errors.coverUrl}
            </p>
          )}
          <p className={adminHint}>JPG / PNG / WEBP עד 4MB. מומלץ 1200×675.</p>
        </div>

        {post && (
          <div className={`${adminPanel} flex items-center justify-between`}>
            <p className="text-body">מחיקת הפוסט</p>
            <DeletePostButton id={post.id} title={post.title} />
          </div>
        )}
      </aside>
    </div>
  );
}
