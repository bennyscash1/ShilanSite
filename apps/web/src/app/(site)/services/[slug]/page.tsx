import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { FxCreditView, FxExchangeView, PrepaidView, TransfersView } from "@/components/services/service-views";
import { servicePages, type ServiceSlug } from "@/content/service-pages";

const views: Record<ServiceSlug, ComponentType> = {
  "fx-exchange": FxExchangeView,
  "international-transfers": TransfersView,
  "fx-credit": FxCreditView,
  "prepaid-card": PrepaidView,
};

export function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages[slug as ServiceSlug];
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const View = views[slug as ServiceSlug];
  if (!View) notFound();
  return <View />;
}
