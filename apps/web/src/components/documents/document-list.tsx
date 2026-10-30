"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { documentsCopy as t } from "@/content/documents";
import { documentStatusLabel, formatDocumentDate, formatDocumentSize } from "@/lib/documents/files";
import type { DocumentStatus } from "@shilan/firebase/collections";

export type DocumentListItem = {
  id: string;
  name: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  status: DocumentStatus;
  docType?: string;
};

export function DocumentList({ documents }: { documents: DocumentListItem[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState<string | null>(null);

  async function remove(id: string) {
    if (!window.confirm(t.confirmRemove)) return;
    setPending(id);
    setError(null);
    setRemoved(null);
    const response = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setPending(null);
    if (response.status === 401) {
      router.push(`/login?next=${encodeURIComponent("/account")}`);
      return;
    }
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || t.removeFailed);
      return;
    }
    setRemoved(t.removed);
    router.refresh();
  }

  if (documents.length === 0) {
    return <p className="mt-6 text-body text-green-900/80">{t.none}</p>;
  }

  return (
    <div className="mt-6">
      {error && (
        <p role="alert" className="mb-4 rounded-control bg-red-50 p-3 text-body text-red-800">
          {error}
        </p>
      )}
      {removed && (
        <p role="status" className="mb-4 rounded-control bg-green-900/10 p-3 text-body">
          {removed}
        </p>
      )}
      <ul className="overflow-hidden rounded-card border border-gold-500 bg-white shadow-card">
        {documents.map((document) => (
          <li key={document.id} className="border-b border-gold-500/20 px-5 py-4 last:border-b-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-body font-bold text-green-900">{document.name}</p>
              <p className="text-caption text-green-900/70">
                {documentStatusLabel[document.status]}
                {" · "}
                {formatDocumentSize(document.size)}
                {document.uploadedAt ? ` · ${formatDocumentDate(document.uploadedAt)}` : ""}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-caption font-bold">
              <a
                href={`/api/documents/${document.id}/open`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 underline-offset-4 hover:underline"
              >
                {t.view}
              </a>
              <a
                href={`/api/documents/${document.id}/open?download=1`}
                className="text-gold-700 underline-offset-4 hover:underline"
              >
                {t.download}
              </a>
              <button
                type="button"
                className="cursor-pointer text-green-900 underline-offset-4 hover:underline disabled:opacity-60"
                disabled={pending === document.id}
                onClick={() => void remove(document.id)}
              >
                {t.remove}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
