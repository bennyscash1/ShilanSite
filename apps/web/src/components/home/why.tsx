import { GlassCard } from "@shilan/ui/components/card";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import Image from "next/image";
import whyBg from "@/assets/images/why-bg.png";
import { whySection } from "@/content/home";

export function Why() {
  return (
    <section id="why" className="section-screen relative isolate overflow-hidden bg-green-950">
      <Image
        src={whyBg}
        alt=""
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-10 size-full object-cover object-top"
      />
      <div className="container-narrow">
        <SectionHeading tone="light">{whySection.title}</SectionHeading>
        <ul className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {whySection.cards.map((card) => (
            <li key={card.title}>
              <GlassCard className="flex h-full min-h-32 flex-col justify-center px-6 py-6 md:min-h-44 md:px-10 md:py-8">
                <h3 className="text-body font-bold text-gold-300">{card.title}</h3>
                <p className="text-body">{card.text}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
