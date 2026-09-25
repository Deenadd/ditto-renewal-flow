"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LifeBuoyIcon } from "@/components/icons";
import { VersionMenu } from "@/components/ui/version-menu";

/** The renewal screens, and where each one lives. */
const versions = [
  {
    value: "v1",
    label: "Version 1",
    hint: "Eight quick yes-or-no questions.",
    href: "/",
  },
  {
    value: "v2",
    label: "Version 2",
    hint: "Five checks you edit in place.",
    href: "/v2",
  },
  {
    value: "v3",
    label: "Version 3",
    hint: "Ready to renew as is, one recommendation, price alongside.",
    href: "/v3",
  },
];

/**
 * Nav-Bar (node 63:2307). 64px tall, hairline bottom rule in Slate/Light/4,
 * brand mark and support action aligned to the page content gutters.
 *
 * The brand mark steps back through the journey when there is somewhere to go,
 * and is inert on the first screen. Beside it, a menu swaps between the three
 * renewal screens; all of them lead into the same issuance journey.
 */
export function SiteHeader({
  onBack,
  version = "v1",
}: {
  onBack?: () => void;
  version?: "v1" | "v2" | "v3";
}) {
  const router = useRouter();

  /* The other version is one click away, so have it ready before the click. */
  useEffect(() => {
    for (const entry of versions) {
      if (entry.value !== version) router.prefetch(entry.href);
    }
  }, [router, version]);

  const logo = (
    <Image
      src="/brand/ditto-logo.png"
      alt="Ditto"
      width={663}
      height={307}
      priority
      className="h-9 w-[77.4px] object-contain"
    />
  );

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-4 bg-white">
      <div className="mx-auto flex h-full max-w-[1112px] items-center justify-between gap-4 px-6 xl:px-0">
        <div className="flex min-w-0 items-center gap-4">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back a step"
              className="flex shrink-0 items-center rounded"
            >
              {logo}
            </button>
          ) : (
            <span className="flex shrink-0 items-center">{logo}</span>
          )}

          <VersionMenu
            label="Renewal screen version"
            value={version}
            options={versions}
            onChange={(next) => {
              const entry = versions.find((option) => option.value === next);
              if (entry) router.push(entry.href);
            }}
          />
        </div>

        <a
          href="mailto:support@example.com"
          className="ff-case flex h-8 shrink-0 items-center gap-2 rounded-md py-1.5 pr-3 pl-2.5 text-[15px] font-medium tracking-[-0.2px] text-ink transition-colors hover:bg-grey-100"
        >
          <LifeBuoyIcon className="shrink-0 text-ink" />
          <span className="hidden sm:inline">Help Support</span>
        </a>
      </div>
    </header>
  );
}
