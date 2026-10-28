import type { Metadata } from "next";
import { AboutView } from "@/components/about/about-view";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
};

export default function AboutPage() {
  return <AboutView />;
}
