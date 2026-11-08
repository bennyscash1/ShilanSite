import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { branches, contact, footer, socialLinks, type Branch, type NavLink } from "@/content/site";
import { ContactForm } from "./contact-form";

function BranchColumn({ branch }: { branch: Branch }) {
  return (
    <li>
      <h3 className="text-title font-bold">{branch.name}</h3>
      {branch.lines.map((line) => (
        <p key={line} className="text-[1.375rem] leading-normal">
          {line}
        </p>
      ))}
    </li>
  );
}

function SocialIcon({ href, label, offset }: { href: string; label: string; offset: number }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative block h-8 w-8 overflow-hidden"
    >
      <Image
        src="/icons/social-pair.svg"
        alt=""
        width={67}
        height={32}
        unoptimized
        className="absolute top-0 h-8 max-w-none"
        style={{ width: 67, left: offset }}
      />
      <span className="sr-only"> נפתח בחלון חדש</span>
    </a>
  );
}

function SocialPair() {
  const instagram = socialLinks.find((link) => link.label === "Instagram");
  const facebook = socialLinks.find((link) => link.label === "Facebook");
  if (!instagram || !facebook) return null;
  return (
    <div className="mt-4 flex w-[67px]" dir="ltr">
      <SocialIcon href={instagram.href} label={instagram.label} offset={0} />
      <SocialIcon href={facebook.href} label={facebook.label} offset={-35} />
    </div>
  );
}

function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> נפתח בחלון חדש</span>
    </a>
  );
}

function LinkColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h3 className="text-title font-bold">{title}</h3>
      <ul className="mt-1 text-link">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="inline-block py-0.5 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-green-900 text-white">
      <div className="container-content py-16 md:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="order-last min-w-0 lg:order-first">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-[254px_212px_minmax(0,1fr)] lg:gap-0">
              <LinkColumn title={footer.servicesTitle} links={footer.services} />
              <LinkColumn title={footer.companyTitle} links={footer.company} />
              <div className="col-span-2 min-w-0 lg:col-span-1">
                <h3 className="text-title font-bold">{footer.contactTitle}</h3>
                <ul className="mt-1 text-link">
                  <li>
                    {footer.phoneLabel}{" "}
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-block py-0.5 hover:underline"
                      dir="ltr"
                    >
                      {contact.phone}
                    </a>
                  </li>
                  <li>
                    {footer.faxLabel} <span dir="ltr">{contact.fax}</span>
                  </li>
                  <li>
                    {footer.emailLabel}{" "}
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-block py-0.5 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </li>
                  <li>
                    <ExternalLink
                      href={contact.whatsapp.href}
                      className="inline-block py-0.5 hover:underline"
                    >
                      {contact.whatsapp.label} <span dir="ltr">{contact.whatsapp.display}</span>
                    </ExternalLink>
                  </li>
                </ul>
                <SocialPair />
              </div>
            </div>
          </div>

          <div className="order-first w-full lg:order-last lg:w-[394px] lg:shrink-0">
            <ContactForm />
          </div>
        </div>

        <section className="mt-16 md:mt-24" aria-labelledby="branches-heading">
          <h2 id="branches-heading" className="text-h2 font-bold">
            {footer.branchesTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {branches.map((branch) => (
              <BranchColumn key={branch.name} branch={branch} />
            ))}
          </ul>
        </section>

        <div className="mt-8 border-t border-white pt-3 sm:w-[390px]">
          <ul className="flex gap-3 text-title">
            {footer.legal.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && (
                  <li aria-hidden className="select-none">
                    |
                  </li>
                )}
                <li>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
