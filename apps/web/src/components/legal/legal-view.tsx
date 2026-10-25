import { SectionHeading } from "@shilan/ui/components/section-heading";
import type { ReactNode } from "react";
import { contact } from "@/content/site";
import { accessibilityStatement, privacyPolicy } from "@/content/legal";

function PageHero({ title, note }: { title: string; note: string }) {
  return (
    <section className="bg-brand-radial py-12 text-white lg:py-16">
      <div className="container-content">
        <SectionHeading as="h1" tone="light">
          {title}
        </SectionHeading>
        <p className="mt-4 max-w-3xl text-body leading-relaxed text-white/95">{note}</p>
      </div>
    </section>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="container-content">
        <article className="max-w-3xl space-y-8 text-body leading-relaxed">{children}</article>
      </div>
    </div>
  );
}

export function PrivacyView() {
  return (
    <main id="main">
      <PageHero title={privacyPolicy.title} note={privacyPolicy.updated} />
      <Prose>
        <p>{privacyPolicy.intro}</p>
        {privacyPolicy.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-h3 font-bold text-green-900">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <p>
          אפשר גם להתקשר אל{" "}
          <a
            href={`tel:${contact.phone}`}
            className="text-gold-700 underline underline-offset-4"
            dir="ltr"
          >
            {contact.phone}
          </a>{" "}
          או לכתוב אל{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-gold-700 underline underline-offset-4"
          >
            {contact.email}
          </a>
          .
        </p>
      </Prose>
    </main>
  );
}

export function AccessibilityView() {
  const statement = accessibilityStatement;
  return (
    <main id="main">
      <PageHero title={statement.title} note={statement.updated} />
      <Prose>
        <section className="space-y-3">
          <h2 className="text-h3 font-bold text-green-900">מחויבותנו לנגישות</h2>
          {statement.commitment.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 font-bold text-green-900">נגישות באתר</h2>
          <p>{statement.siteIntro}</p>
          <ul className="list-disc space-y-2 ps-5">
            {statement.siteItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{statement.siteNote}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 font-bold text-green-900">{statement.physicalTitle}</h2>
          <p>{statement.physicalIntro}</p>
          <ul className="list-disc space-y-2 ps-5">
            {statement.physicalItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 font-bold text-green-900">{statement.contactTitle}</h2>
          <p>{statement.contactIntro}</p>
          <p>
            דוא״ל:{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-gold-700 underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>
          </p>
          <p>
            טלפון:{" "}
            <a
              href={`tel:${contact.phone}`}
              className="text-gold-700 underline-offset-4 hover:underline"
              dir="ltr"
            >
              {contact.phone}
            </a>
          </p>
          <p>
            וואטסאפ:{" "}
            <a
              href={contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-700 underline-offset-4 hover:underline"
              dir="ltr"
            >
              {contact.whatsapp.display}
              <span className="sr-only"> נפתח בחלון חדש</span>
            </a>
          </p>
          <dl className="space-y-3 rounded-card border border-gold-500 bg-cream-50 p-5">
            <div>
              <dt className="font-bold text-green-900">{statement.coordinatorLabel}</dt>
              <dd>{statement.coordinatorValue}</dd>
            </div>
            <div>
              <dt className="font-bold text-green-900">{statement.auditLabel}</dt>
              <dd>{statement.auditValue}</dd>
            </div>
          </dl>
        </section>

        <p>{statement.closing}</p>
      </Prose>
    </main>
  );
}
