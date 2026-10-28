import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-ui";
import { authStrings as t } from "@/content/auth";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: t.forgotTitle, robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title={t.forgotTitle} subtitle={t.forgotSubtitle}>
      <ForgotForm />
    </AuthCard>
  );
}
