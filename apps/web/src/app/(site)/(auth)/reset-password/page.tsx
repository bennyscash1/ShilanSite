import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, FormAlert } from "@/components/auth/auth-ui";
import { authStrings as t } from "@/content/auth";
import { verifyResetCode } from "@/lib/auth/identity";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: t.resetTitle, robots: { index: false } };

type Props = { searchParams: Promise<{ oobCode?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { oobCode } = await searchParams;
  const email = oobCode ? await verifyResetCode(oobCode).catch(() => null) : null;

  return (
    <AuthCard title={t.resetTitle} subtitle={email ? <span dir="ltr">{t.resetFor(email)}</span> : undefined}>
      {email && oobCode ? (
        <ResetForm oobCode={oobCode} />
      ) : (
        <div className="flex flex-col gap-4">
          <FormAlert>{t.resetInvalid}</FormAlert>
          <Link href="/forgot-password" className="text-body text-gold-700 underline underline-offset-4">
            {t.requestNewLink}
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
