import type { Metadata } from "next";
import Link from "next/link";
import { DocumentList, type DocumentListItem } from "@/components/documents/document-list";
import { DocumentUploader } from "@/components/documents/uploader";
import { authStrings as t } from "@/content/auth";
import { documentsCopy as docs } from "@/content/documents";
import { customerTypes } from "@/content/onboarding";
import { requireUser } from "@/lib/auth/session";
import { isStorageBucketReady, listDocuments } from "@/lib/documents/store";

export const metadata: Metadata = { title: t.myArea, robots: { index: false } };

export default async function AccountPage() {
  const user = await requireUser("/account");

  let documents: DocumentListItem[] = [];
  let listError = false;
  try {
    documents = await listDocuments(user.uid);
  } catch (error) {
    console.error("[documents] list failed", error);
    listError = true;
  }

  let storageUnavailable = false;
  try {
    storageUnavailable = !(await isStorageBucketReady());
  } catch (error) {
    console.error("[documents] storage probe", error);
    storageUnavailable = true;
  }

  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content">
          <h1 className="text-display font-bold">{t.accountTitle(user.displayName)}</h1>
          <p className="mt-3 text-lead">{t.accountSubtitle}</p>
        </div>
      </section>

      <section className="section-screen bg-white" aria-labelledby="my-documents">
        <div className="container-content w-full">
          <h2 id="my-documents" className="text-h2 font-bold text-green-900">
            {docs.myDocuments}
          </h2>
          <div className="mt-6">
            <DocumentUploader unavailable={storageUnavailable} />
          </div>
          {listError ? (
            <p role="alert" className="mt-6 rounded-control bg-red-50 p-3 text-body text-red-800">
              {docs.listFailed}
            </p>
          ) : (
            <DocumentList documents={documents} />
          )}
        </div>
      </section>

      <section className="section-screen">
        <div className="container-content w-full">
          <ul className="grid gap-4 md:grid-cols-3">
            {customerTypes.map((customer) => (
              <li key={customer.slug}>
                <Link
                  href={`/signup/${customer.slug}`}
                  className="flex h-full flex-col rounded-card border border-gold-500 bg-white p-6 shadow-card transition-shadow hover:shadow-[0_6px_28px_rgb(0_0_0/0.16)]"
                >
                  <span className="text-title font-bold text-gold-700">{customer.navLabel}</span>
                  <span className="mt-2 text-body">{customer.summary}</span>
                  <span className="mt-4 text-body font-bold underline underline-offset-4">
                    {customer.title} ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
