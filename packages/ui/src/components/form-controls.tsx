"use client";

import { CheckIcon } from "lucide-react";
import {
  Checkbox as CheckboxPrimitive,
  Label as LabelPrimitive,
  RadioGroup as RadioGroupPrimitive,
} from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

const fieldBase =
  "w-full rounded-control bg-field-bg px-3 text-field text-green-900 shadow-control placeholder:text-green-900 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 aria-invalid:outline-2 aria-invalid:outline-red-400";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldBase, "min-h-11 lg:min-h-[34px]", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBase, "min-h-14 resize-y py-2", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("text-field", className)} {...props} />;
}

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        // 16px box with a 44px invisible hit area for touch.
        "relative size-3 shrink-0 cursor-pointer rounded-[2px] bg-white/80 text-green-900",
        "after:absolute after:-inset-3.5 after:content-[''] data-[state=checked]:bg-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="size-3" strokeWidth={3} aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/** Single-select chip group (radio semantics: one choice, arrow keys move between chips). */
export function ChipGroup({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root className={cn("grid grid-cols-4 gap-1.5", className)} {...props} />
  );
}

export function Chip({
  className,
  children,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "min-h-11 cursor-pointer rounded-control bg-white px-1 text-caption text-green-900 shadow-control transition-colors lg:min-h-7",
        "hover:bg-white/90 data-[state=checked]:bg-gold-650 data-[state=checked]:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
}
