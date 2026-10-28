"use client";

import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { useActionState } from "react";
import { AuthField, FormAlert } from "@/components/auth/auth-ui";
import { authStrings as t } from "@/content/auth";
import { resetPasswordAction, type ResetState } from "../actions";

export function ResetForm({ oobCode }: { oobCode: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(resetPasswordAction, {});

  if (state.done) {
    return (
      <div className="flex flex-col gap-4">
        <FormAlert tone="success">{t.resetDone}</FormAlert>
        <Link href="/login" className="text-body text-gold-700 underline underline-offset-4">
          {t.toLogin}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="oobCode" value={oobCode} />
      <AuthField id="password" label={t.newPassword} type="password" autoComplete="new-password" required hint={t.passwordHint} />
      <AuthField id="confirmPassword" label={t.confirmPassword} type="password" autoComplete="new-password" required />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t.saving : t.savePassword}
      </Button>
    </form>
  );
}
