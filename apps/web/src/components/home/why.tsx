import { GlassCard } from "@shilan/ui/components/card";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import Image from "next/image";
import whyBg from "@/assets/images/why-bg.png";
import { whySection } from "@/content/home";

export function Why() {
  return (
    <section id="why" className="relative isolate overflow-hidden bg-green-950 py-12 lg:py-16">
      <Image
        src={whyBg}
        alt=""
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-10 size-full object-cover object-top"
      />
      <div className="container-narrow">
        <SectionHeading tone="light">{whySection.title}</SectionHeading>
        <ul className="mt-6 grid gap-3 lg:mt-8 lg:grid-cols-2 lg:gap-x-7">
          {whySection.cards.map((card) => (
            <li key={card.title}>
              <GlassCard className="flex h-full min-h-[110px] flex-col justify-center px-6 py-5 lg:h-[127px] lg:ps-[55px]">
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
