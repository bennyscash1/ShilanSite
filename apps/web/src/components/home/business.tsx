import { GlassCard } from "@shilan/ui/components/card";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import Link from "next/link";
import { business } from "@/content/home";

export function Business() {
  return (
    <section id="business" className="section-screen relative">
      <div className="container-content">
        <SectionHeading tone="light">{business.title}</SectionHeading>
        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-2 md:gap-10">
          {business.cards.map((card) => (
            <GlassCard
              key={card.id}
              className="flex min-h-48 flex-col justify-center px-6 py-8 md:min-h-64 md:px-10 md:py-12"
            >
              <h3 className="text-display font-bold">{card.title}</h3>
              <p className="mt-1 text-body">{card.text}</p>
              <Link
                href={card.link.href}
                className="mt-2 self-start text-body text-gold-300 hover:underline"
              >
                {card.link.label}
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
