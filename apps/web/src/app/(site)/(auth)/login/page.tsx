import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, FormAlert, GoogleButton, OrDivider } from "@/components/auth/auth-ui";
import { isGoogleConfigured } from "@/config/auth";
import { authStrings as t } from "@/content/auth";
import { getCurrentUser, isAuthConfigured, safeNext } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: t.loginTitle, robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);
  if (await getCurrentUser()) redirect(next);

  return (
    <AuthCard title={t.loginTitle} subtitle={t.loginSubtitle}>
      {!isAuthConfigured() ? (
        <FormAlert>{t.notConfigured}</FormAlert>
      ) : (
        <>
          {error === "google" && <FormAlert>{t.googleError}</FormAlert>}
          {error === "google-cancelled" && <FormAlert>{t.googleCancelled}</FormAlert>}
          <LoginForm next={next} />
          {isGoogleConfigured() && (
            <>
              <OrDivider />
              <GoogleButton next={next} label={t.google} />
            </>
          )}
          <p className="mt-6 text-center text-body">
            {t.noAccount}{" "}
            <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-bold text-gold-700 underline underline-offset-4">
              {t.toRegister}
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
