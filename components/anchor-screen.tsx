"use client";

import { PolicySummary } from "@/components/policy-summary";
import { ArrowLeftIcon, MailIcon, PhoneIcon } from "@/components/icons";
import {
  issuanceSteps,
  resumeBanner,
  supportPanel,
  type IssuanceStep,
} from "@/lib/renewal-data";

function StepBadge({ index, active }: { index: number; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[21px] shrink-0 items-center justify-center rounded-full text-[12px] leading-none font-semibold ${
        active ? "bg-primary text-white" : "bg-grey-150 text-ink-secondary"
      }`}
    >
      {index}
    </span>
  );
}

function Step({
  step,
  index,
  onStart,
}: {
  step: IssuanceStep;
  index: number;
  onStart: () => void;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="pt-[3px]">
        <StepBadge index={index} active={index === 1} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-4 pt-0.5">
        <div className="flex flex-col gap-2">
          <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
            {step.title}
          </h2>
          <p className="text-[14px] leading-[1.5] text-ink-secondary">
            {step.description}
          </p>
        </div>

        {step.action ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-[15px] leading-[1.15] font-medium text-ink-inverted shadow-[0_1.5px_4px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-primary-hover"
            >
              {step.action.label}
            </button>
            <span className="text-[13px] leading-none tracking-[0.195px] text-ink-secondary">
              {step.action.note}
            </span>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function SupportPanel() {
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

/**
 * Anchor screen (node 79:7114). What is left to do once the policy is bought,
 * with the steps laid out and only the first one open.
 */
export function AnchorScreen({
  selectedAddOns,
  addedMember,
  pinCode,
  cover,
  onBack,
  onStart,
}: {
  selectedAddOns: string[];
  addedMember?: string;
  pinCode?: string;
  cover?: string;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 xl:px-0">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-[14px] leading-none font-medium text-ink-secondary transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="shrink-0" />
            Back
          </button>

          <h1 className="text-[32px] leading-[1.2] font-semibold text-ink">
            You&rsquo;re almost done!
          </h1>
          <p className="mt-3 max-w-[588px] text-[16px] leading-none text-ink-secondary">
            Before you get your policy, we will need to wrap up a few things
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-blue-light p-4">
            <div className="flex w-[400px] max-w-full shrink-0 flex-col gap-2">
              <p className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
                {resumeBanner.title}
              </p>
              <p className="max-w-[383px] text-[13px] leading-[1.5] text-ink-secondary">
                {resumeBanner.description}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/anchor/banner-art.png"
              alt=""
              width={523}
              height={210}
              className="pointer-events-none -my-4 -mr-4 hidden h-[105px] w-auto shrink-0 select-none sm:block"
            />
          </div>

          <ol className="mt-6 flex max-w-[513px] flex-col gap-5">
            {issuanceSteps.map((step, index) => (
              <Step
                key={step.title}
                step={step}
                index={index + 1}
                onStart={onStart}
              />
            ))}
          </ol>
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
            <PolicySummary
              variant="anchor"
              selectedAddOns={selectedAddOns}
              addedMember={addedMember}
              pinCode={pinCode}
              cover={cover}
            />
            <SupportPanel />
          </div>
        </aside>
      </div>
    </main>
  );
}
