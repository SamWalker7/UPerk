import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ href = "/portal" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex flex-shrink-0 cursor-pointer items-center gap-2.5"
    >
      <Image src="/icons/logo.svg" width={30} height={30} alt="Universal Perk" />
      <span className="text-[10px] font-extrabold uppercase leading-tight tracking-widest">
        Universal Perk
        <br />
        Portal
      </span>
    </Link>
  );
}
