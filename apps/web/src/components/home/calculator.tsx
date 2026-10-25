import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { calculatorSection } from "@/content/home";
import { getRatesSnapshot } from "@/lib/rates";
import { CalculatorWidget } from "./calculator-widget";

export async function Calculator() {
  const snapshot = await getRatesSnapshot();

  return (
    <section id="calculator" className="bg-brand-radial py-12 text-white lg:py-16">
      <div className="container-content grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_676px] lg:gap-14">
        <div>
          <h2 className="text-display font-bold">{calculatorSection.title}</h2>
          <Button asChild className="mt-5">
            <Link href={calculatorSection.cta.href}>{calculatorSection.cta.label}</Link>
          </Button>
        </div>
        <CalculatorWidget snapshot={snapshot} disclaimer={calculatorSection.disclaimer} />
      </div>
    </section>
  );
}
