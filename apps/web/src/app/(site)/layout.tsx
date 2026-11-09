import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
