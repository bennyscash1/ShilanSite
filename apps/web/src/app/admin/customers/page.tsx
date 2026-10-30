import { Button } from "@shilan/ui/components/button";
import type { Metadata } from "next";
import Link from "next/link";
import { documentsCopy as t } from "@/content/documents";
import { requireAdmin } from "@/lib/admin/session";
import { customerKindLabel, formatDocumentDate, isCustomerKind } from "@/lib/documents/files";
import { listCustomers, type CustomerRow } from "@/lib/documents/store";
import { adminInput } from "../admin-styles";

export const metadata: Metadata = { title: t.customersTitle };

type Props = { searchParams: Promise<{ q?: string; type?: string }> };

function matches(row: CustomerRow, query: string, type: string): boolean {
  if (type === "unset" && row.customerType) return false;
  if (type && type !== "unset" && row.customerType !== type) return false;
  if (!query) return true;
  const haystack =
    `${row.displayName} ${row.email} ${row.phone ?? ""} ${row.username ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  await requireAdmin();
  const { q = "", type = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const typeFilter = type === "unset" || isCustomerKind(type) ? type : "";

  let rows: CustomerRow[] = [];
  let loadError = false;
  try {
    rows = await listCustomers();
  } catch (error) {
    console.error("[admin] could not list customers", error);
    loadError = true;
  }
  const visible = rows.filter((row) => matches(row, query, typeFilter));

  return (
    <main id="main" className="container-content py-16 md:py-24">
      <h1 className="text-h3 font-bold">{t.customersTitle}</h1>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end" method="get">
        <label className="block min-w-0 flex-1">
          <span className="sr-only">{t.searchPlaceholder}</span>
          <input
            name="q"
            defaultValue={q}
            placeholder={t.searchPlaceholder}
            className={adminInput}
          />
        </label>
        <label className="block sm:w-48">
          <span className="sr-only">{t.filterAll}</span>
          <select name="type" defaultValue={typeFilter} className={adminInput}>
            <option value="">{t.filterAll}</option>
            <option value="private">{customerKindLabel.private}</option>
            <option value="osek">{customerKindLabel.osek}</option>
            <option value="corporation">{customerKindLabel.corporation}</option>
            <option value="unset">{t.filterUnset}</option>
          </select>
        </label>
        <Button type="submit">{t.applyFilter}</Button>
      </form>

      {loadError && (
        <p role="alert" className="mt-6 rounded-control bg-red-50 p-4 text-body text-red-800">
          {t.customersFailed}
        </p>
      )}

      {!loadError && visible.length === 0 && <p className="mt-10 text-title">{t.customersEmpty}</p>}

      {visible.length > 0 && (
        <ul className="mt-8 flex flex-col gap-3">
          {visible.map((row) => (
            <li key={row.uid} className="rounded-card border border-green-900/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-title font-bold">{row.displayName || row.email}</p>
                  <p className="mt-1 text-caption opacity-75" dir="ltr">
                    {row.email}
                  </p>
                  <p className="mt-2 text-caption">
                    {row.customerType ? customerKindLabel[row.customerType] : t.noType}
                    {" · "}
                    {t.fileCount} {row.fileCount}
                    {row.createdAt ? ` · ${t.registered} ${formatDocumentDate(row.createdAt)}` : ""}
                  </p>
                  <p className="mt-1 text-caption">
                    {row.phone ? <span dir="ltr">{row.phone}</span> : t.noPhone}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="border border-green-900/25">
                  <Link href={`/admin/customers/${row.uid}`}>{t.details}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
