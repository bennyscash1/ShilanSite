import Image, { type ImageProps } from "next/image";

type FixedBackdropProps = {
  src: ImageProps["src"];
  imageClassName?: string;
  quality?: number;
  /** Darken the still image. Stays fixed with it, so scrolling content does not move the tint. */
  overlayClassName?: string;
};

/**
 * Viewport-fixed photo. iOS Safari ignores background-attachment: fixed, so this is a
 * real fixed layer. Opaque sections painted later cover it; transparent ones show it.
 */
export function FixedBackdrop({
  src,
  imageClassName = "object-cover",
  quality,
  overlayClassName,
}: FixedBackdropProps) {
  return (
    <div aria-hidden className="pointer-events-none fixed top-0 start-0 -z-10 h-dvh w-full">
      <Image
        src={src}
        alt=""
        fill
        preload
        placeholder={typeof src === "object" ? "blur" : undefined}
        quality={quality}
        sizes="100vw"
        className={imageClassName}
      />
      {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
    </div>
  );
}
