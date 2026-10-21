import { GlassCard } from "@shilan/ui/components/card";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import Link from "next/link";
import { business } from "@/content/home";

export function Business() {
  return (
    <section id="business" className="relative pt-4 pb-16 lg:pt-[229px] lg:pb-[262px]">
      <div className="container-content">
        <SectionHeading tone="light">{business.title}</SectionHeading>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-[34px] lg:gap-12">
          {business.cards.map((card) => (
            <GlassCard
              key={card.id}
              className="flex min-h-[220px] flex-col justify-center px-6 py-10 lg:h-[309px] lg:ps-[44px] lg:pe-8"
            >
              <h3 className="text-display font-bold">{card.title}</h3>
              <p className="mt-1 text-body">{card.text}</p>
              <Link href={card.link.href} className="mt-2 self-start text-body text-gold-500 hover:underline">
                {card.link.label}
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
