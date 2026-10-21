import Link from "next/link";
import { Fragment } from "react";
import { branches, contact, footer, type NavLink } from "@/content/site";
import { ContactForm } from "./contact-form";

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
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-[254px_212px_auto] sm:gap-0">
            <LinkColumn title={footer.servicesTitle} links={footer.services} />
            <LinkColumn title={footer.companyTitle} links={footer.company} />
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-title font-bold">{footer.contactTitle}</h3>
              <ul className="mt-1 text-link">
                <li>
                  {footer.phoneLabel}{" "}
                  <a href={`tel:${contact.phone}`} className="inline-block py-0.5 hover:underline" dir="ltr">
                    {contact.phone}
                  </a>
                </li>
                <li>
                  {footer.faxLabel} <span dir="ltr">{contact.fax}</span>
                </li>
                <li>
                  {footer.emailLabel}{" "}
                  <a href={`mailto:${contact.email}`} className="inline-block py-0.5 hover:underline">
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <h2 className="mt-9 text-h2 font-bold">{footer.branchesTitle}</h2>
          <ul className="mt-5 grid gap-6 sm:grid-cols-[254px_268px_auto] sm:gap-0">
            {branches.map((branch) => (
              <li key={branch.name} className="text-link leading-[1.1]">
                <p className="font-bold">{branch.name}</p>
                {branch.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
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
