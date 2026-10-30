import { SectionHeading } from "@shilan/ui/components/section-heading";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  CheckDiscountingIcon,
  FxCreditIcon,
  FxExchangeIcon,
  InternationalTransfersIcon,
  PrepaidCardIcon,
} from "@/components/icons/figma-icons";
import { services, servicesSection, type ServiceSlug } from "@/content/home";

const icons: Record<ServiceSlug, ComponentType<SVGProps<SVGSVGElement>>> = {
  "fx-exchange": FxExchangeIcon,
  "international-transfers": InternationalTransfersIcon,
  "fx-credit": FxCreditIcon,
  "prepaid-card": PrepaidCardIcon,
  "check-discounting": CheckDiscountingIcon,
};

export function Services() {
  return (
    <section id="services" className="section-screen bg-white">
      <div className="container-content">
        <SectionHeading>{servicesSection.title}</SectionHeading>
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-5 lg:gap-8">
          {services.map((service) => {
            const Icon = icons[service.slug];
            return (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex h-full min-h-64 flex-col items-center rounded-card border border-gold-500 bg-white px-4 pt-10 pb-8 text-center shadow-card transition-shadow hover:shadow-[0_6px_28px_rgb(0_0_0/0.16)] md:min-h-80 md:px-5 md:pt-12 md:pb-10"
                >
                  <span className="flex h-16 items-center text-green-900 md:h-20 [&_svg]:h-14 [&_svg]:w-auto md:[&_svg]:h-16">
                    <Icon />
                  </span>
                  <h3 className="mt-4 text-title font-bold text-gold-500 md:mt-6 md:text-lead">{service.title}</h3>
                  <p className="mt-2 text-body leading-snug whitespace-pre-line md:text-title">{service.summary}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
