import { Button } from "@shilan/ui/components/button";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import type { Metadata } from "next";
import Link from "next/link";
import { uiStrings } from "@/content/ui-strings";

export const notFoundMetadata: Metadata = {
  title: uiStrings.notFound.title,
};

export function NotFoundView() {
  const copy = uiStrings.notFound;
  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content">
          <SectionHeading as="h1" tone="light">
            {copy.title}
          </SectionHeading>
          <p className="mt-4 max-w-3xl text-body leading-relaxed text-white/95">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild>
              <Link href="/">{copy.home}</Link>
            </Button>
            <Link
              href="/#contact"
              className="text-body underline underline-offset-4 hover:no-underline"
            >
              {copy.contact}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
