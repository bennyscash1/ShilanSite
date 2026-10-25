import type { Metadata } from "next";
import { OnboardingHub } from "@/components/onboarding/onboarding-view";
import { onboarding } from "@/content/onboarding";

export const metadata: Metadata = {
  title: onboarding.title,
  description: onboarding.description,
};

export default function SignupPage() {
  return <OnboardingHub />;
}
