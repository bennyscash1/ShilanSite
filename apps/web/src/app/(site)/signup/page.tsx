import type { Metadata } from "next";
import { OnboardingHub } from "@/components/onboarding/onboarding-view";
import { onboarding } from "@/content/onboarding";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: onboarding.title,
  description: onboarding.description,
  robots: { index: false },
};

// Customer onboarding is for registered users only.
export default async function SignupPage() {
  await requireUser("/signup");
  return <OnboardingHub />;
}
