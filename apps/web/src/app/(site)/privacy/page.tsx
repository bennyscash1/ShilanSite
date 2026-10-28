import type { Metadata } from "next";
import { PrivacyView } from "@/components/legal/legal-view";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
