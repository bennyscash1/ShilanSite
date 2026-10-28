import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingTypePage } from "@/components/onboarding/onboarding-view";
import { customerTypes, getCustomerType } from "@/content/onboarding";
import { requireUser } from "@/lib/auth/session";

type PageProps = {
  params: Promise<{ type: string }>;
};

export function generateStaticParams() {
  return customerTypes.map((customer) => ({ type: customer.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const customer = getCustomerType(type);
  if (!customer) return {};
  return {
    title: customer.title,
    description: customer.intro,
    robots: { index: false },
  };
}

// Customer onboarding is for registered users only.
export default async function CustomerOnboardingPage({ params }: PageProps) {
  const { type } = await params;
  const customer = getCustomerType(type);
  if (!customer) notFound();
  await requireUser(`/signup/${customer.slug}`);
  return <OnboardingTypePage customer={customer} />;
}
