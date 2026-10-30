import { Button, buttonVariants } from "@shilan/ui/components/button";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import { cn } from "@shilan/ui/lib/cn";
import {
  BriefcaseIcon,
  Building2Icon,
  CheckIcon,
  ChevronRightIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { customerTypes, onboarding, type CustomerType } from "@/content/onboarding";

const typeIcons: Record<CustomerType["slug"], LucideIcon> = {
  private: UserIcon,
  osek: BriefcaseIcon,
  corporation: Building2Icon,
};

const newTabLabel = "נפתח בחלון חדש";

function ExternalAnchor({ children, ...props }: ComponentProps<"a">) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}

function Steps() {
  return (
    <section className="section-screen bg-cream-50" aria-labelledby="onboarding-steps">
      <div className="container-content w-full">
        <h2 id="onboarding-steps" className="text-h2 font-bold text-green-900">
          {onboarding.stepsTitle}
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-3 md:gap-8">
          {onboarding.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-card border border-gold-500 bg-white p-6 shadow-card md:p-8"
            >
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full bg-green-900 text-title font-bold text-white"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-title font-bold text-green-900">{step.title}</h3>
              <p className="mt-2 text-body leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function OnboardingHub() {
  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content w-full">
          <SectionHeading as="h1" tone="light">
            {onboarding.title}
          </SectionHeading>
          <div className="mt-5 max-w-4xl space-y-4 text-body leading-relaxed text-white/95">
            {onboarding.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <Steps />

      <section className="section-screen bg-white" aria-labelledby="onboarding-types">
        <div className="container-content w-full">
          <h2 id="onboarding-types" className="text-h2 font-bold text-green-900">
            {onboarding.chooseTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-3 md:gap-8">
            {customerTypes.map((customer) => {
              const Icon = typeIcons[customer.slug];
              return (
                <li key={customer.slug}>
                  <Link
                    href={`/signup/${customer.slug}`}
                    className="flex h-full flex-col rounded-card border border-gold-500 bg-white p-6 shadow-card transition-shadow hover:shadow-[0_6px_28px_rgb(0_0_0/0.16)] md:p-8"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-cream-50 text-green-900">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-4 text-title font-bold text-gold-500">{customer.navLabel}</h3>
                    <p className="mt-2 flex-1 text-body leading-relaxed">{customer.summary}</p>
                    <span className={cn(buttonVariants({ size: "md" }), "mt-6 w-full")}>
                      למילוי ולמסמכים
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}

export function OnboardingTypePage({ customer }: { customer: CustomerType }) {
  const kycForm = customer.documents[0];
  if (!kycForm) return null;

  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 text-body text-gold-300 hover:underline"
          >
            <ChevronRightIcon className="size-5" aria-hidden />
            חזרה להקמת לקוח
          </Link>
          <SectionHeading as="h1" tone="light" className="mt-4">
            {customer.title}
          </SectionHeading>
          <p className="mt-5 max-w-4xl text-body leading-relaxed text-white/95">{customer.intro}</p>
        </div>
      </section>

      <section className="section-screen bg-white" aria-labelledby="onboarding-start">
        <div className="container-content">
          <div className="rounded-card bg-brand-radial px-6 py-8 text-white lg:px-10 lg:py-10">
            <h2 id="onboarding-start" className="text-h3 font-bold">
              מתחילים
            </h2>
            <p className="mt-3 max-w-3xl text-body leading-relaxed text-white/95">
              קודם ממלאים את {kycForm.label} מתוך רשימת המסמכים למטה. אחר כך מעלים את המסמכים. אחרי
              השליחה אנחנו בודקים את החומר וחוזרים אליכם. אם חסר משהו, ניצור קשר.
            </p>
            <div className="mt-6">
              <Button asChild className="w-full whitespace-normal sm:w-auto">
                <ExternalAnchor href={customer.uploadHref}>{customer.uploadLabel}</ExternalAnchor>
              </Button>
            </div>
            <p className="mt-4 text-caption leading-relaxed text-white/80">
              הכפתור נפתח בחלון חדש. את הטפסים ממלאים מתוך הרשימה למטה, ואת המסמכים מעלים בטופס
              שבאתר שילן.
            </p>
          </div>
        </div>
      </section>

      <Steps />

      <section className="section-screen bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2 className="text-h3 font-bold text-green-900">מה תצטרכו</h2>
              <ul className="mt-4 space-y-3">
                {customer.needs.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body leading-relaxed">
                    <CheckIcon className="mt-0.5 size-5 shrink-0 text-gold-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-h3 font-bold text-green-900">מסמכים למילוי וחתימה</h2>
              <ul className="mt-4 overflow-hidden rounded-card border border-gold-500 bg-white shadow-card">
                {customer.documents.map((document) => (
                  <li key={document.label} className="border-b border-gold-500/20 last:border-b-0">
                    <ExternalAnchor
                      href={document.href}
                      className="flex items-center justify-between gap-4 px-5 py-4 text-body leading-snug hover:bg-cream-50"
                    >
                      <span>{document.label}</span>
                      <span className="shrink-0 text-caption font-bold text-gold-700">למילוי</span>
                    </ExternalAnchor>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-body leading-relaxed">{customer.documentsNote}</p>
            </div>
          </div>

          <p className="mt-10 text-body leading-relaxed">
            אפשר גם לכתוב לנו{" "}
            <Link href="/#contact" className="text-gold-700 underline-offset-4 hover:underline">
              בטופס שבתחתית העמוד
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
