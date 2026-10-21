"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
  /** Logical side: `start` is the right edge in RTL. */
  side?: "start" | "end";
  closeLabel: string;
};

export function SheetContent({
  side = "start",
  closeLabel,
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-50 flex w-[min(20rem,85vw)] flex-col gap-4 bg-white shadow-card transition ease-out-soft",
          "data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:duration-200",
          side === "start"
            ? "start-0 data-[state=closed]:slide-out-to-start data-[state=open]:slide-in-from-start"
            : "end-0 data-[state=closed]:slide-out-to-end data-[state=open]:slide-in-from-end",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute end-3 top-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-control hover:bg-black/5">
          <XIcon className="size-6" aria-hidden />
          <span className="sr-only">{closeLabel}</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
