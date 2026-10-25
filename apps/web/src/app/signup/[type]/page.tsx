import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingTypePage } from "@/components/onboarding/onboarding-view";
import { customerTypes, getCustomerType } from "@/content/onboarding";

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
  };
}

export default async function CustomerOnboardingPage({ params }: PageProps) {
  const { type } = await params;
  const customer = getCustomerType(type);
  if (!customer) notFound();
  return <OnboardingTypePage customer={customer} />;
}
