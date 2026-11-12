import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { branches, contact, footer, socialLinks, type Branch, type NavLink } from "@/content/site";
import { uiStrings } from "@/content/ui-strings";
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

function FooterWhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <g transform="translate(16 16) scale(0.72) translate(-12 -12)">
        <path
          fill="currentColor"
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
        />
      </g>
    </svg>
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
        {/* RTL grid: the info column is on the right, the contact card on the left. */}
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_394px] lg:items-stretch lg:gap-x-10">
          <div className="flex min-w-0 flex-col">
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
                  <li className="flex flex-wrap items-center gap-2">
                    <ExternalLink
                      href={contact.whatsapp.href}
                      className="inline-block py-0.5 hover:underline"
                    >
                      {contact.whatsapp.label} <span dir="ltr">{contact.whatsapp.display}</span>
                    </ExternalLink>
                    <a
                      href={contact.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={uiStrings.whatsappButton}
                      className="inline-flex shrink-0 text-white transition hover:opacity-80 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#f3d27a]"
                    >
                      <FooterWhatsAppIcon />
                    </a>
                  </li>
                </ul>
                <SocialPair />
              </div>
            </div>

            <section className="mt-12" aria-labelledby="branches-heading">
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
              <ul className="flex flex-wrap gap-3 text-title">
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

          <div className="min-w-0 lg:h-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
