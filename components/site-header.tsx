import Image from "next/image";
import Link from "next/link";
import { LifeBuoyIcon } from "@/components/icons";

/**
 * Nav-Bar (node 63:2307). 64px tall, hairline bottom rule in Slate/Light/4,
 * brand mark and support action aligned to the page content gutters.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-4 bg-white">
      <div className="mx-auto flex h-full max-w-[1112px] items-center justify-between px-6 xl:px-0">
        <Link href="/" className="flex items-center" aria-label="Ditto home">
          <Image
            src="/brand/ditto-logo.png"
            alt="Ditto"
            width={663}
            height={307}
            priority
            className="h-9 w-[77.4px] object-contain"
          />
        </Link>

        <a
          href="mailto:support@example.com"
          className="ff-case flex h-8 items-center gap-2 rounded-md py-1.5 pr-3 pl-2.5 text-[15px] font-medium tracking-[-0.2px] text-ink transition-colors hover:bg-grey-100"
        >
          <LifeBuoyIcon className="shrink-0 text-ink" />
          Help Support
        </a>
      </div>
    </header>
  );
}
