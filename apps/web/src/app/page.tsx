import { Business } from "@/components/home/business";
import { Calculator } from "@/components/home/calculator";
import { CrossRates } from "@/components/home/cross-rates";
import { Hero } from "@/components/home/hero";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { Why } from "@/components/home/why";

export default function HomePage() {
  return (
    <main id="main">
      <HeroBackdrop>
        <Hero />
        <Business />
      </HeroBackdrop>
      <Services />
      <Calculator />
      <Why />
      <CrossRates />
      <Testimonials />
    </main>
  );
}
