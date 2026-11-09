import Image from "next/image";
import heroBg from "@/assets/images/hero-bg.png";

/**
 * One viewport-fixed homepage background. Transparent sections scroll over it.
 * A real fixed layer (not background-attachment) so iOS Safari keeps it still.
 * z-index -1 sits behind in-flow content; the body background is the canvas, so
 * the layer stays visible through transparent sections and under opaque ones.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed top-0 start-0 -z-10 h-dvh w-full">
      <Image
        src={heroBg}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[22%_30%]"
      />
    </div>
  );
}
