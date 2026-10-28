"use client";

import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { useActionState } from "react";
import { AuthField, FormAlert } from "@/components/auth/auth-ui";
import { authStrings as t } from "@/content/auth";
import { forgotPasswordAction, type ForgotState } from "../actions";

export function ForgotForm() {
  const [state, action, pending] = useActionState<ForgotState, FormData>(forgotPasswordAction, {});

  if (state.sent) {
    return (
      <div className="flex flex-col gap-4">
        <FormAlert tone="success">{t.forgotSent}</FormAlert>
        <Link href="/login" className="text-body text-gold-700 underline underline-offset-4">
          {t.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <AuthField id="identifier" label={t.identifier} autoComplete="username" required defaultValue={state.identifier} />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t.sending : t.sendLink}
      </Button>
      <Link href="/login" className="text-center text-body text-gold-700 underline underline-offset-4">
        {t.backToLogin}
      </Link>
    </form>
  );
}
