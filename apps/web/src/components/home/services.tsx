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
    <section id="services" className="bg-white py-12 lg:py-16">
      <div className="container-content">
        <SectionHeading>{servicesSection.title}</SectionHeading>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-5">
          {services.map((service) => {
            const Icon = icons[service.slug];
            return (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex h-full min-h-[200px] flex-col items-center rounded-card border border-gold-500 bg-white px-3 pt-9 pb-6 text-center shadow-card transition-shadow hover:shadow-[0_6px_28px_rgb(0_0_0/0.16)] lg:h-[220px] lg:pb-0"
                >
                  <span className="flex h-12 items-center text-green-900">
                    <Icon />
                  </span>
                  <h3 className="mt-3 text-title font-bold text-gold-500">{service.title}</h3>
                  <p className="text-body leading-[1.1] whitespace-pre-line">{service.summary}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
