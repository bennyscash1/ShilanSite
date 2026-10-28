"use client";

import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { useActionState } from "react";
import { AuthField, FormAlert } from "@/components/auth/auth-ui";
import { authStrings as t } from "@/content/auth";
import { registerAction, type RegisterState } from "../actions";

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerAction, {});
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <AuthField
        id="displayName"
        label={t.displayName}
        autoComplete="name"
        required
        defaultValue={values.displayName}
        error={errors.displayName}
      />
      <AuthField
        id="username"
        label={t.username}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        defaultValue={values.username}
        error={errors.username}
        hint={t.usernameHint}
      />
      <AuthField
        id="email"
        label={t.email}
        type="email"
        autoComplete="email"
        dir="ltr"
        required
        defaultValue={values.email}
        error={errors.email}
        hint={t.emailHint}
      />
      <AuthField
        id="password"
        label={t.newPassword}
        type="password"
        autoComplete="new-password"
        required
        error={errors.password}
        hint={t.passwordHint}
      />
      <AuthField
        id="confirmPassword"
        label={t.confirmPassword}
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword}
      />
      <div>
        <label className="flex items-start gap-2 text-body">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 size-5 shrink-0 accent-green-900"
            aria-invalid={Boolean(errors.consent) || undefined}
          />
          <span>
            {t.consentPrefix}
            <Link href="/privacy" target="_blank" className="text-gold-700 underline underline-offset-4">
              {t.consentLink}
            </Link>
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-caption font-bold text-red-700">{errors.consent}</p>}
      </div>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t.registering : t.register}
      </Button>
    </form>
  );
}
