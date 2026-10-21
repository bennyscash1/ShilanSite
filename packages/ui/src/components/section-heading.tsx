import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type SectionHeadingProps = ComponentProps<"h2"> & {
  /** `light` = white text on dark sections, `dark` = green text on light sections. */
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  tone = "dark",
  as: Tag = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "text-display font-bold text-balance",
        tone === "light" ? "text-white" : "text-green-900",
        className,
      )}
      {...props}
    />
  );
}
