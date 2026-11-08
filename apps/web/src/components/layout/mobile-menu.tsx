"use client";

import { Button } from "@shilan/ui/components/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@shilan/ui/components/sheet";
import { cn } from "@shilan/ui/lib/cn";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/site";
import { uiStrings } from "@/content/ui-strings";
import { useState } from "react";
import { MobileAccount } from "./account-link";

/** Below 1024px: hamburger opening a sheet from the right (RTL start) with nav + account section. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(() => pathname.startsWith("/services/"));
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={uiStrings.openMenu}>
          <MenuIcon className="size-7!" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent closeLabel={uiStrings.closeMenu} className="px-6 pt-16 pb-8">
        <SheetTitle className="sr-only">{uiStrings.menuTitle}</SheetTitle>
        <nav aria-label={uiStrings.mainNav}>
          <ul className="flex flex-col">
            {mainNav.map((link) =>
              link.children?.length ? (
                <li key={link.label}>
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-center justify-between border-b border-green-900/10 text-title"
                    aria-expanded={servicesOpen}
                    aria-controls="mobile-service-links"
                    onClick={() => setServicesOpen((value) => !value)}
                  >
                    {link.label}
                    <ChevronDownIcon
                      className={cn("size-5 transition-transform", servicesOpen && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                  <ul id="mobile-service-links" hidden={!servicesOpen}>
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <SheetClose asChild>
                          <Link
                            href={child.href}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className={cn(
                              "flex min-h-11 items-center border-b border-green-900/10 ps-4 text-body",
                              pathname === child.href && "font-bold",
                            )}
                          >
                            {child.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.label}>
                  <SheetClose asChild>
                    <Link
                      href={link.href ?? "/"}
                      className="flex min-h-12 items-center border-b border-green-900/10 text-title"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="mt-auto rounded-control bg-green-900 p-3 text-white">
          <MobileAccount onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
