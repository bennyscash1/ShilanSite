import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/** Frosted card for dark/photographic sections ("מט"ח לעסקים", "למה לעבוד עם שילן?"). */
export function GlassCard({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("glass rounded-card text-white", className)} {...props} />;
}

/** White card with a thin gold border (services). */
export function OutlineCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card border border-gold-500 bg-white shadow-card", className)}
      {...props}
    />
  );
}
