import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ href = "/portal" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex flex-shrink-0 cursor-pointer items-center gap-2"
    >
      <Image
        src="/icons/logo.svg"
        width={20}
        height={20}
        alt="Universal Perk"
        /* Keep the brand gradient (same as the favicon); a touch more contrast
           and saturation so the cyan end doesn't wash out on the pale header. */
        className="h-5 w-5 rounded-[5px] [filter:saturate(1.15)_contrast(1.05)]"
      />
      <span className="hidden text-[15px] font-bold tracking-tight sm:inline">
        Universal Perk
      </span>
    </Link>
  );
}
