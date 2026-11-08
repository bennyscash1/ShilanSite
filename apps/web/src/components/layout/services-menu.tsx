"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shilan/ui/components/dropdown-menu";
import { cn } from "@shilan/ui/lib/cn";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/content/site";

const triggerClass =
  "group inline-flex cursor-pointer items-center gap-1 py-2 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

export function ServicesMenu({ label, items }: { label: string; items: NavLink[] }) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClass}>
        {label}
        <ChevronDownIcon
          className="size-4 transition-transform group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-52">
        {items.map((item) => {
          const current = pathname === item.href;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} aria-current={current ? "page" : undefined} className={cn(current && "font-bold")}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
