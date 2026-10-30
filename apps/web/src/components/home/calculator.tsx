import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { calculatorSection } from "@/content/home";
import { getRatesSnapshot } from "@/lib/rates";
import { CalculatorWidget } from "./calculator-widget";

export async function Calculator() {
  const snapshot = await getRatesSnapshot();

  return (
    <section id="calculator" className="section-screen bg-brand-radial text-white">
      <div className="container-content grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,42rem)] lg:gap-16">
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
