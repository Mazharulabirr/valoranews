"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80";

// Wraps next/image with an onError fallback. News API images come from
// external CDNs that often expire or block hotlinking — when that happens
// we swap in a placeholder instead of showing a broken image.
export default function SafeImage({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
