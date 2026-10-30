import { ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { documentsCopy as t } from "@/content/documents";
import { requireAdmin } from "@/lib/admin/session";
import {
  customerKindLabel,
  documentStatusLabel,
  formatDocumentDate,
  formatDocumentSize,
} from "@/lib/documents/files";
import { isUserId } from "@/lib/documents/http";
import { getCustomer } from "@/lib/documents/store";

export const metadata: Metadata = { title: t.customersTitle };

type Props = { params: Promise<{ uid: string }> };

export default async function AdminCustomerPage({ params }: Props) {
  await requireAdmin();
  const { uid } = await params;
  if (!isUserId(uid)) notFound();

  let customer: Awaited<ReturnType<typeof getCustomer>> = null;
  let loadError = false;
  try {
    customer = await getCustomer(uid);
  } catch (error) {
    console.error("[admin] could not load customer", error);
    loadError = true;
  }
  if (loadError) {
    return (
      <main id="main" className="container-content py-16 md:py-24">
        <p role="alert" className="rounded-control bg-red-50 p-4 text-body text-red-800">
          {t.customersFailed}
        </p>
      </main>
    );
  }
  if (!customer) notFound();

  const { profile, documents } = customer;

  return (
    <main id="main" className="container-content py-16 md:py-24">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-body text-gold-700 hover:underline"
      >
        <ChevronRightIcon className="size-5" aria-hidden />
        {t.backToCustomers}
      </Link>
      <h1 className="mt-4 text-h3 font-bold">{profile.displayName || profile.email}</h1>

      <dl className="mt-6 grid gap-4 rounded-card border border-green-900/10 bg-white p-6 sm:grid-cols-2">
        <div>
          <dt className="text-caption opacity-70">אימייל</dt>
          <dd className="text-body" dir="ltr">
            {profile.email}
          </dd>
        </div>
        <div>
          <dt className="text-caption opacity-70">טלפון</dt>
          <dd className="text-body">
            {profile.phone?.trim() ? <span dir="ltr">{profile.phone}</span> : t.noPhone}
          </dd>
        </div>
        <div>
          <dt className="text-caption opacity-70">סוג לקוח</dt>
          <dd className="text-body">
            {profile.customerType ? customerKindLabel[profile.customerType] : t.noType}
          </dd>
        </div>
        <div>
          <dt className="text-caption opacity-70">{t.registered}</dt>
          <dd className="text-body">
            {profile.createdAt ? formatDocumentDate(profile.createdAt) : t.noPhone}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 text-title font-bold">
        {t.files} ({documents.length})
      </h2>
      {documents.length === 0 ? (
        <p className="mt-4 text-body">{t.none}</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {documents.map((document) => (
            <li key={document.id} className="rounded-card border border-green-900/10 bg-white p-5">
              <p className="text-body font-bold">{document.name}</p>
              <p className="mt-1 text-caption opacity-75">
                {documentStatusLabel[document.status]}
                {" · "}
                {formatDocumentSize(document.size)}
                {document.uploadedAt ? ` · ${formatDocumentDate(document.uploadedAt)}` : ""}
                {document.docType ? ` · ${document.docType}` : ""}
              </p>
              <p className="mt-3 flex flex-wrap gap-4 text-caption font-bold">
                <a
                  href={`/api/admin/customers/${uid}/documents/${document.id}/open`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  {t.view}
                </a>
                <a
                  href={`/api/admin/customers/${uid}/documents/${document.id}/open?download=1`}
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  {t.download}
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
