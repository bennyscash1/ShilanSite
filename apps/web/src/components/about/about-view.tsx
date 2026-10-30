import { SectionHeading } from "@shilan/ui/components/section-heading";
import Image from "next/image";
import { about } from "@/content/about";
import { branches } from "@/content/site";
import dunsSeal from "@/assets/images/duns-seal.png";

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold-700 underline underline-offset-4"
    >
      {children}
      <span className="sr-only"> נפתח בחלון חדש</span>
    </a>
  );
}

export function AboutView() {
  return (
    <main id="main">
      <section className="section-screen bg-brand-radial text-white">
        <div className="container-content">
          <SectionHeading as="h1" tone="light">
            {about.title}
          </SectionHeading>
          <p className="mt-5 max-w-4xl text-body leading-relaxed text-white/95">{about.lead}</p>
        </div>
      </section>

      <section className="section-screen bg-cream-50" aria-label={about.values.join(", ")}>
        <div className="container-content w-full">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {about.values.map((value) => (
              <li
                key={value}
                className="rounded-card border border-gold-500 bg-white px-6 py-10 text-center shadow-card md:px-8 md:py-14"
              >
                <p className="text-h3 font-bold text-green-900">{value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-screen bg-white">
        <div className="container-content grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)] lg:items-center lg:gap-16">
          <div className="max-w-3xl space-y-4 text-body leading-relaxed">
            <p>{about.currencies}</p>
            <p>
              {about.creditBefore} (
              <ExternalLink href={about.creditech.href}>{about.creditech.label}</ExternalLink>
              ).
            </p>
            <p>{about.transfers}</p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {about.partners.map((name) => (
                <li
                  key={name}
                  className="flex min-h-16 items-center justify-center rounded-card border border-gold-500 px-3 py-4 text-center text-title font-bold text-green-900"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p>
              {about.checksBefore}{" "}
              {about.checksLinks.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? ", " : null}
                  <ExternalLink href={link.href}>{link.label}</ExternalLink>
                </span>
              ))}{" "}
              {about.checksAfter}
            </p>
            <p>{about.bills}</p>
          </div>

          <div className="flex flex-col gap-6">
            <a
              href={about.duns.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto block w-fit rounded-card border border-gold-500 bg-white p-4 shadow-card"
            >
              <Image src={dunsSeal} alt={about.duns.alt} className="h-auto w-48" />
              <span className="sr-only"> נפתח בחלון חדש</span>
            </a>
            <iframe
              src={about.video.src}
              title={about.video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="aspect-video w-full rounded-card border-0"
            />
          </div>
        </div>
      </section>

      <section className="section-screen bg-cream-50">
        <div className="container-content space-y-4">
          <p className="max-w-4xl rounded-card border border-gold-500 bg-white p-6 text-body leading-relaxed shadow-card">
            {about.license}
          </p>
          <p className="max-w-4xl text-body leading-relaxed">{about.service}</p>
        </div>
      </section>

      <section className="section-screen bg-white" aria-labelledby="about-branches">
        <div className="container-content w-full">
          <h2 id="about-branches" className="text-h2 font-bold text-green-900">
            {about.branchesTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-3 md:gap-8">
            {branches.map((branch) => (
              <li
                key={branch.name}
                className="rounded-card border border-gold-500 bg-white p-6 shadow-card md:p-8"
              >
                <h3 className="text-title font-bold text-gold-700">{branch.name}</h3>
                <div className="mt-3 space-y-1 text-body leading-relaxed">
                  {branch.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {branch.hours.map((part) => (
                    <p key={part.label}>
                      {part.label} <span dir="ltr">{part.value}</span>
                    </p>
                  ))}
                  <p>
                    <a href={`tel:${branch.phone}`} className="hover:underline" dir="ltr">
                      {branch.phone}
                    </a>{" "}
                    ({branch.extension})
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
