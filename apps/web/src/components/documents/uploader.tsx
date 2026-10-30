"use client";

import { buttonVariants } from "@shilan/ui/components/button";
import { cn } from "@shilan/ui/lib/cn";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { documentsCopy as t } from "@/content/documents";
import { isAllowedContentType, isAllowedSize, MAX_FILES_PER_BATCH } from "@/lib/documents/files";
import type { CustomerKind } from "@shilan/firebase/collections";

type Item = {
  key: string;
  name: string;
  progress: number;
  state: "uploading" | "done" | "error";
  message?: string;
};

type Prepared = {
  uploadUrl: string;
  token: string;
  contentType: string;
  lengthRange: string;
};

async function readError(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as { message?: string } | null;
  return body?.message || fallback;
}

function putFile(
  url: string,
  file: File,
  contentType: string,
  lengthRange: string,
  onProgress: (value: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-goog-content-length-range", lengthRange);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(t.failed));
    };
    xhr.onerror = () => reject(new Error(t.failed));
    xhr.send(file);
  });
}

export function DocumentUploader({
  customerType,
  unavailable = false,
  tone = "light",
}: {
  customerType?: CustomerKind;
  unavailable?: boolean;
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const inputId = useId();
  const [items, setItems] = useState<Item[]>([]);
  const [notice, setNotice] = useState<string | null>(unavailable ? t.unavailable : null);
  const [busy, setBusy] = useState(false);
  const onDark = tone === "dark";

  function patch(key: string, next: Partial<Item>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...next } : item)));
  }

  async function uploadOne(file: File, key: string) {
    if (!file.type || !isAllowedContentType(file.type)) {
      patch(key, { state: "error", message: t.badType, progress: 0 });
      return;
    }
    if (file.size <= 0) {
      patch(key, { state: "error", message: t.emptyFile, progress: 0 });
      return;
    }
    if (!isAllowedSize(file.size)) {
      patch(key, { state: "error", message: t.tooBig, progress: 0 });
      return;
    }

    const response = await fetch("/api/documents/upload-url", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        contentType: file.type,
        size: file.size,
        ...(customerType ? { customerType } : {}),
      }),
    });
    if (response.status === 401) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!response.ok) {
      const message = await readError(response, t.failed);
      patch(key, { state: "error", message, progress: 0 });
      if (message === t.unavailable) setNotice(message);
      return;
    }
    const prepared = (await response.json()) as Prepared;
    await putFile(
      prepared.uploadUrl,
      file,
      prepared.contentType,
      prepared.lengthRange,
      (progress) => {
        patch(key, { progress });
      },
    );
    const done = await fetch("/api/documents/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: prepared.token }),
    });
    if (done.status === 401) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!done.ok) {
      const message = await readError(done, t.failed);
      patch(key, { state: "error", message });
      if (message === t.unavailable) setNotice(message);
      return;
    }
    patch(key, { state: "done", progress: 100, message: t.uploaded });
  }

  async function onPick(files: File[]) {
    if (files.length === 0) return;
    if (files.length > MAX_FILES_PER_BATCH) {
      setNotice(t.tooMany);
      return;
    }
    setNotice(null);
    setBusy(true);
    const batch: Item[] = files.map((file, index) => ({
      key: `${file.name}-${file.size}-${index}-${Date.now()}`,
      name: file.name,
      progress: 0,
      state: "uploading",
    }));
    setItems(batch);
    await Promise.all(
      files.map(async (file, index) => {
        const key = batch[index]?.key;
        if (!key) return;
        try {
          await uploadOne(file, key);
        } catch (error) {
          patch(key, {
            state: "error",
            message: error instanceof Error ? error.message : t.failed,
          });
        }
      }),
    );
    setBusy(false);
    router.refresh();
  }

  const finished = items.length > 0 && items.every((item) => item.state === "done");

  return (
    <div>
      <label
        htmlFor={inputId}
        className={cn(
          buttonVariants(),
          "w-full sm:w-auto",
          (unavailable || busy) && "pointer-events-none opacity-60",
        )}
      >
        {busy ? t.uploading : t.upload}
        <input
          id={inputId}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="sr-only"
          disabled={unavailable || busy}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            void onPick(files);
          }}
        />
      </label>
      <p
        className={cn(
          "mt-3 text-caption leading-relaxed",
          onDark ? "text-white/80" : "text-green-900/80",
        )}
      >
        {t.hint}
      </p>
      {notice && (
        <p
          role="alert"
          className={cn(
            "mt-4 rounded-control p-3 text-body",
            onDark ? "bg-white/15" : "bg-red-50 text-red-800",
          )}
        >
          {notice}
        </p>
      )}
      {finished && !notice && (
        <p
          role="status"
          className={cn("mt-4 text-body", onDark ? "text-gold-300" : "text-green-900")}
        >
          {t.allUploaded}{" "}
          {tone === "dark" && (
            <a href="/account" className="font-bold underline underline-offset-4">
              {t.toAccount}
            </a>
          )}
        </p>
      )}
      {items.length > 0 && (
        <ul className="mt-4 space-y-3" aria-live="polite">
          {items.map((item) => (
            <li key={item.key}>
              <div className="flex items-baseline justify-between gap-3 text-caption">
                <span className="truncate">{item.name}</span>
                <span>{item.state === "uploading" ? `${item.progress}%` : item.message}</span>
              </div>
              <div
                className={cn(
                  "mt-1 h-1.5 overflow-hidden rounded-full",
                  onDark ? "bg-white/20" : "bg-green-900/10",
                )}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress}
                aria-label={item.name}
              >
                <div
                  className={cn("h-full", item.state === "error" ? "bg-red-400" : "bg-gold-500")}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
