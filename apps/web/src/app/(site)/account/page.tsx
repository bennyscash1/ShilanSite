import type { Metadata } from "next";
import Link from "next/link";
import { authStrings as t } from "@/content/auth";
import { customerTypes } from "@/content/onboarding";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: t.myArea, robots: { index: false } };

export default async function AccountPage() {
  const user = await requireUser("/account");

  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content">
          <h1 className="text-display font-bold">{t.accountTitle(user.displayName)}</h1>
          <p className="mt-3 text-lead">{t.accountSubtitle}</p>
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
                <span className="mt-4 text-body font-bold underline underline-offset-4">{customer.title} ←</span>
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </section>
    </main>
  );
}
