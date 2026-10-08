import Image, { type ImageProps } from "next/image";

// next/image refuses to optimize SVGs, so serve those as-is. Real JPG/PNG/WEBP
// photos dropped into /public/images get resized and optimized automatically.
export function Photo({ alt, ...props }: ImageProps & { src: string }) {
  return <Image alt={alt} {...props} unoptimized={props.src.endsWith(".svg")} />;
}
