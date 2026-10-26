import Image from "next/image";
import { ILLUSTRATIONS } from "@/lib/illustrations";
import type { IllustrationKey } from "@/lib/illustrations";
import "./Illustration.css";

export function Illustration({
  name,
  alt = "",
  className,
  priority,
}: {
  name: IllustrationKey;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const art = ILLUSTRATIONS[name];
  return (
    <Image
      src={art.src}
      width={art.width}
      height={art.height}
      alt={alt}
      priority={priority}
      className={className ? `illustration ${className}` : "illustration"}
    />
  );
}
