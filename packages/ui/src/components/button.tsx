import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control font-normal whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Gold CTA. Slightly deeper than #A17510 so white text meets AA. */
        primary: "bg-gold-650 text-white hover:bg-gold-800",
        /** White outline on dark surfaces. */
        "outline-light": "border border-white text-white hover:bg-white/10",
        /** Gold text link. */
        "link-gold": "min-h-0 px-0 text-gold-700 underline-offset-4 hover:underline",
        ghost: "hover:bg-black/5",
      },
      size: {
        sm: "min-h-11 px-4 text-caption",
        /** Figma CTA: 183x47, 20px text. */
        md: "min-h-[47px] min-w-[183px] px-6 text-body",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a Next.js Link) with button styles. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
