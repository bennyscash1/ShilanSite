import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, FormAlert, GoogleButton, OrDivider } from "@/components/auth/auth-ui";
import { isGoogleConfigured } from "@/config/auth";
import { authStrings as t } from "@/content/auth";
import { getCurrentUser, isAuthConfigured, safeNext } from "@/lib/auth/session";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: t.registerTitle, robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next);

  return (
    <AuthCard title={t.registerTitle} subtitle={t.registerSubtitle}>
      {!isAuthConfigured() ? (
        <FormAlert>{t.notConfigured}</FormAlert>
      ) : (
        <>
          {isGoogleConfigured() && (
            <>
              <GoogleButton next={next} label={t.google} />
              <OrDivider />
            </>
          )}
          <RegisterForm next={next} />
          <p className="mt-6 text-center text-body">
            {t.haveAccount}{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-gold-700 underline underline-offset-4">
              {t.toLogin}
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
