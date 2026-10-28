import Image, { type ImageProps } from "next/image";

/**
 * Cover images live in Vercel Blob (optimized by next/image) or, in local development,
 * under /dev-uploads (served as-is).
 */
export function BlogImage(props: ImageProps) {
  const local = typeof props.src === "string" && props.src.startsWith("/dev-uploads/");
  return <Image {...props} unoptimized={local || props.unoptimized} alt={props.alt} />;
}
