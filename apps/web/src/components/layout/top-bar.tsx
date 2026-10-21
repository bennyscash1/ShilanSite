import Link from "next/link";
import { Fragment } from "react";
import { topBarLinks } from "@/content/site";

/** Dark-green strip above the header (desktop only; on mobile these links live in the menu). */
export function TopBar() {
  return (
    <div className="hidden h-[50px] bg-green-900 text-white lg:block">
      <nav className="flex h-full items-center justify-end gap-4 pe-[82px] text-body">
        {topBarLinks.map((link, i) => (
          <Fragment key={link.href}>
            {i > 0 && <span aria-hidden>|</span>}
            <Link href={link.href} className="hover:underline">
              {link.label}
            </Link>
          </Fragment>
        ))}
      </nav>
    </div>
  );
}
