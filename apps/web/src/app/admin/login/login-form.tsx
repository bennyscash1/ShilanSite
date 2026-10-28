"use client";

import { Button } from "@shilan/ui/components/button";
import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";
import { adminInput, adminLabel } from "../admin-styles";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={adminLabel}>
          אימייל
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          dir="ltr"
          defaultValue={state.email}
          className={adminInput}
        />
      </div>
      <div>
        <label htmlFor="password" className={adminLabel}>
          סיסמה
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          dir="ltr"
          className={adminInput}
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-control bg-red-50 p-3 text-body text-red-800">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "מתחבר..." : "כניסה"}
      </Button>
    </form>
  );
}
