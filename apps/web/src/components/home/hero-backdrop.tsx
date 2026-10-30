import Image from "next/image";
import type { ReactNode } from "react";
import heroBg from "@/assets/images/hero-bg.png";

/**
 * Hero and "מט"ח לעסקים" share one background in the design. On desktop the image is
 * scaled and offset exactly as in the Figma frame (2441px wide at 1440, globe on the left).
 */
export function HeroBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden bg-green-950">
      <Image
        src={heroBg}
        alt=""
        preload
        placeholder="blur"
        sizes="(min-width: 1024px) 170vw, 100vw"
        className="absolute inset-0 -z-10 size-full object-cover object-[22%_30%] lg:inset-auto lg:end-[-22.57%] lg:top-[-15.75rem] lg:aspect-[1695/1347] lg:h-auto lg:w-[169.5%] lg:max-w-none lg:object-fill"
      />
      {/* Mobile only: text sits over the globe, so darken for legibility. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-green-950/45 lg:hidden" />
      {children}
    </div>
  );
}
