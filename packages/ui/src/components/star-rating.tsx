import { cn } from "../lib/cn";

type StarRatingProps = {
  value: number;
  max?: number;
  /** Accessible text, e.g. "דירוג 5 מתוך 5". The stars themselves are decorative. */
  label: string;
  /** Star size follows the font size (`text-*` on className). */
  className?: string;
};

export function StarRating({ value, max = 5, label, className }: StarRatingProps) {
  return (
    <div role="img" aria-label={label} className={cn("flex gap-[0.15em] text-gold-600", className)}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn("size-[1em]", i >= value && "opacity-25")}
          aria-hidden
          fill="currentColor"
        >
          <path d="M10 1l2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L10 15l-5.6 3.2 1.3-6.3L1 7.6l6.3-.7L10 1z" />
        </svg>
      ))}
    </div>
  );
}
