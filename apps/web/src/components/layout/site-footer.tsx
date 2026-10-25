import Link from "next/link";
import { Fragment } from "react";
import {
  branches,
  contact,
  footer,
  socialLinks,
  type BranchHours,
  type NavLink,
} from "@/content/site";
import { ContactForm } from "./contact-form";

function HoursLine({ hours }: { hours: BranchHours[] }) {
  return (
    <p>
      {hours.map((part, i) => (
        <Fragment key={part.label}>
          {i > 0 ? " " : null}
          {part.label} <span dir="ltr">{part.value}</span>
        </Fragment>
      ))}
    </p>
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
      <div className="container-content flex flex-col gap-12 py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:pt-[178px] lg:pb-[167px]">
        <div className="order-last lg:order-first">
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
                  <a
                    href={contact.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-0.5 hover:underline"
                  >
                    {contact.whatsapp.label} <span dir="ltr">{contact.whatsapp.display}</span>
                  </a>
                </li>
              </ul>
              <h3 className="mt-5 text-title font-bold">{footer.socialTitle}</h3>
              <ul className="mt-1 text-link">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-0.5 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="mt-9 text-h2 font-bold">{footer.branchesTitle}</h2>
          <p className="mt-3 max-w-3xl text-link">{footer.branchesIntro}</p>
          <ul className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[254px_268px_minmax(0,1fr)] lg:gap-0">
            {branches.map((branch) => (
              <li key={branch.name} className="min-w-0 text-link leading-[1.1]">
                <p className="font-bold">{branch.name}</p>
                {branch.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <div className="mt-2">
                  <HoursLine hours={branch.hours} />
                  <p>
                    {footer.phoneLabel}{" "}
                    <a href={`tel:${branch.phone}`} className="hover:underline" dir="ltr">
                      {branch.phone}
                    </a>{" "}
                    ({branch.extension})
                  </p>
                  <p>
                    {footer.faxLabel} <span dir="ltr">{branch.fax}</span>
                  </p>
                  <p>
                    {footer.emailLabel}{" "}
                    <a href={`mailto:${branch.email}`} className="hover:underline">
                      {branch.email}
                    </a>
                  </p>
                </div>
                <iframe
                  src={branch.map.src}
                  title={branch.map.title}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="mt-3 h-48 w-full rounded-control border-0 sm:h-44 sm:max-w-[268px]"
                />
              </li>
            ))}
          </ul>

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

        <div className="order-first w-full lg:order-last lg:w-[394px] lg:shrink-0">
          <ContactForm />
        </div>
      </div>
    </footer>
  );
}
