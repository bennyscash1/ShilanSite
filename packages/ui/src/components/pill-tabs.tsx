"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export const PillTabs = TabsPrimitive.Root;
export const PillTabsContent = TabsPrimitive.Content;

export function PillTabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        // Scrolls horizontally on narrow screens instead of wrapping.
        "scrollbar-none -mx-(--spacing-gutter) flex snap-x gap-3 overflow-x-auto px-(--spacing-gutter) py-1 sm:mx-0 sm:px-0",
        className,
      )}
      {...props}
    />
  );
}

export function PillTabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "min-h-11 shrink-0 cursor-pointer snap-start rounded-full border border-white px-4 text-caption whitespace-nowrap text-white transition-colors lg:min-h-9",
        "hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-green-900",
        className,
      )}
      {...props}
    />
  );
}
