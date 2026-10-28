import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { getSession } from "@/lib/admin/session";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: { default: "ניהול האתר", template: "%s | ניהול האתר" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-dvh bg-cream-50">
      <header className="border-b border-green-900/10 bg-white">
        <div className="container-content flex h-16 items-center gap-4">
          <Logo className="block h-10 shrink-0" />
          <p className="text-title font-bold">ניהול האתר</p>
          {session && (
            <nav className="ms-auto flex items-center gap-1 text-body">
              <Link href="/admin" className="rounded-control px-3 py-2 hover:bg-green-900/5">
                פוסטים
              </Link>
              <Link href="/blog" target="_blank" className="rounded-control px-3 py-2 hover:bg-green-900/5">
                לבלוג באתר
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="cursor-pointer rounded-control px-3 py-2 hover:bg-green-900/5">
                  יציאה
                </button>
              </form>
            </nav>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
