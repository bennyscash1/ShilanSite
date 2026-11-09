import heroBg from "@/assets/images/hero-bg.png";
import { FixedBackdrop } from "@/components/layout/fixed-backdrop";

/** Homepage globe. Crop and quality stay as they were before this layer was shared. */
export function HeroBackdrop() {
  return <FixedBackdrop src={heroBg} imageClassName="object-cover object-[22%_30%]" quality={90} />;
}
