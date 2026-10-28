import type { Metadata } from "next";
import { AccessibilityView } from "@/components/legal/legal-view";
import { accessibilityStatement } from "@/content/legal";

export const metadata: Metadata = {
  title: accessibilityStatement.title,
  description: accessibilityStatement.description,
};

export default function AccessibilityPage() {
  return <AccessibilityView />;
}
