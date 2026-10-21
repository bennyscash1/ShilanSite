import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { uiStrings } from "@/content/ui-strings";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={uiStrings.homeLink} className={className}>
      <Image src={logo} alt="" priority className="h-full w-auto" sizes="120px" />
    </Link>
  );
}
