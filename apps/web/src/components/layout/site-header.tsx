import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { headerCta, mainNav } from "@/content/site";
import { uiStrings } from "@/content/ui-strings";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { TopBar } from "./top-bar";

export function SiteHeader() {
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgb(0_0_0/0.06)]">
        <div className="flex h-16 items-center gap-3 ps-4 pe-2 sm:ps-6 lg:grid lg:h-[118px] lg:grid-cols-[1fr_auto_1fr] lg:ps-[35px] lg:pe-[26px]">
          <Logo className="block h-11 shrink-0 lg:h-[84px]" />

          <nav aria-label={uiStrings.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-8 text-body">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="py-2 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1 lg:ms-0 lg:justify-self-end">
            <Button asChild className="max-lg:min-w-0 max-lg:px-3 max-lg:text-caption">
              <Link href={headerCta.href}>{headerCta.label}</Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
