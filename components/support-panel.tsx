"use client";

import { MailIcon, PhoneIcon } from "@/components/icons";
import { supportPanel } from "@/lib/renewal-data";

/** Help card carried down the issuance journey (node 79:7197). */
export function SupportPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      <div className="relative z-10 flex flex-col gap-2">
        <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
          {supportPanel.platform.title}
        </h2>
        <p className="max-w-[273px] text-[13px] leading-[1.5] text-ink-secondary">
          {supportPanel.platform.description}
        </p>
        <a
          href={`mailto:${supportPanel.platform.email}`}
          className="mt-2 flex w-fit items-center gap-2 text-[14px] leading-none font-medium text-focus underline-offset-4 hover:underline"
        >
          <MailIcon className="shrink-0" />
          {supportPanel.platform.email}
        </a>
      </div>

      <hr className="relative z-10 my-5 border-grey-150" />

      <div className="relative z-10 flex flex-col gap-2">
        <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
          {supportPanel.advisor.title}
        </h2>
        <p className="max-w-[294px] text-[13px] leading-[1.5] text-ink-secondary">
          {supportPanel.advisor.description}
        </p>
        <p className="mt-3 text-[14px] leading-[1.4] text-ink-secondary">
          {supportPanel.advisor.label}
        </p>
        <a
          href={`tel:${supportPanel.advisor.phone.replace(/\s|-/g, "")}`}
          className="flex w-fit items-center gap-2 text-[14px] leading-none font-medium text-focus underline-offset-4 hover:underline"
        >
          <PhoneIcon className="shrink-0" />
          {supportPanel.advisor.phone}
        </a>
        <a
          href={`mailto:${supportPanel.advisor.email}`}
          className="flex w-fit items-center gap-2 text-[14px] leading-none font-medium text-focus underline-offset-4 hover:underline"
        >
          <MailIcon className="shrink-0" />
          {supportPanel.advisor.email}
        </a>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/anchor/mascot.png"
        alt=""
        width={329}
        height={298}
        className="pointer-events-none absolute right-1 bottom-0 z-0 w-[162px] select-none"
      />
    </div>
  );
}

