"use client";

import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { useActionState } from "react";
import { AuthField, FormAlert } from "@/components/auth/auth-ui";
import { authStrings as t } from "@/content/auth";
import { loginAction, type LoginState } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <AuthField
        id="identifier"
        label={t.identifier}
        autoComplete="username"
        required
        defaultValue={state.identifier}
      />
      <AuthField id="password" label={t.password} type="password" autoComplete="current-password" required />
      <Link href="/forgot-password" className="-mt-2 self-start text-caption text-gold-700 underline underline-offset-4">
        {t.forgot}
      </Link>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t.loggingIn : t.login}
      </Button>
    </form>
  );
}
