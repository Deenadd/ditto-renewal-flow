"use client";

import { PolicyBar } from "@/components/policy-bar";
import { SupportPanel } from "@/components/support-panel";
import { PolicySummary } from "@/components/policy-summary";
import { ArrowLeftIcon, SummaryCheckIcon } from "@/components/icons";
import {
  issuanceSteps,
  resumeBanner,
  type IssuanceStep,
} from "@/lib/renewal-data";
import { stepPanels } from "@/lib/proposal-data";

function StepBadge({
  index,
  state,
}: {
  index: number;
  state: "done" | "active" | "waiting";
}) {
  if (state === "done") {
    return <SummaryCheckIcon className="shrink-0 text-success" size={21} />;
  }

  return (
    <span
      aria-hidden="true"
      className={`flex size-[21px] shrink-0 items-center justify-center rounded-full text-[12px] leading-none font-semibold ${
        state === "active" ? "bg-primary text-white" : "bg-grey-150 text-ink-secondary"
      }`}
    >
      {index}
    </span>
  );
}

/** The panel that changes with the step in play (nodes 122:8241, 122:9096). */
function StepPanelCard({ step }: { step: number }) {
  const panel = stepPanels[step];
  if (!panel) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kyc/sparkles.png"
        alt=""
        width={360}
        height={157}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
      />
      <div className="relative z-10">
        <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
          {panel.title}
        </h2>
        <p className="mt-2 max-w-[280px] text-[13px] leading-[1.5] text-ink-secondary">
          {panel.lead}
        </p>
        <ol className="mt-4 flex flex-col gap-4">
          {panel.items.map((item, index) => (
            <li key={item.label} className="relative flex items-start gap-3">
              {panel.connected ? (
                <>
                  {index < panel.items.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-5 left-[9.5px] h-[calc(100%+4px)] w-px bg-grey-150"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-grey-150 text-[11px] leading-none font-semibold text-ink-muted"
                  >
                    {index + 1}
                  </span>
                </>
              ) : (
                <span
                  aria-hidden="true"
                  className="ff-figures w-4 shrink-0 text-[13px] leading-none text-ink"
                >
                  {index + 1}.
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-1.5">
                <span
                  className={`text-[13px] leading-none ${
                    panel.connected
                      ? "text-ink-muted"
                      : "font-medium text-ink"
                  }`}
                >
                  {item.label}
                </span>
                {item.note ? (
                  <span className="text-[13px] leading-[1.5] text-ink-secondary">
                    {item.note}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Step({
  step,
  index,
  state,
  onStart,
}: {
  step: IssuanceStep;
  index: number;
  state: "done" | "active" | "waiting";
  onStart: () => void;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="pt-[3px]">
        <StepBadge index={index} state={state} />
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

        {step.action && state === "active" ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-[15px] leading-[1.15] font-medium text-ink-inverted shadow-[0_1.5px_4px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-primary-hover"
            >
              {step.action.label}
            </button>
            {step.action.note ? (
              <span className="text-[13px] leading-none tracking-[0.195px] text-ink-secondary">
                {step.action.note}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

/**
 * Anchor screen (node 79:7114). What is left to do once the policy is bought,
 * with the steps laid out and only the first one open.
 */
export function AnchorScreen({
  step = 1,
  selectedAddOns,
  addedMember,
  pinCode,
  cover,
  onBack,
  onStart,
}: {
  /** Which of the four steps is in play; everything before it is done. */
  step?: number;
  selectedAddOns: string[];
  addedMember?: string;
  pinCode?: string;
  cover?: string;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <>
      {step > 1 ? (
        <div className="mx-auto max-w-[1112px] px-6 xl:px-0">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
            <div />
            <div className="hidden lg:block">
              <PolicyBar cover={cover} />
            </div>
          </div>
        </div>
      ) : null}

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

          {step < 3 ? (
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
          ) : null}

          <ol className="mt-6 flex max-w-[513px] flex-col gap-5">
            {issuanceSteps.map((item, index) => (
              <Step
                key={item.title}
                step={item}
                index={index + 1}
                state={
                  index + 1 < step
                    ? "done"
                    : index + 1 === step
                      ? "active"
                      : "waiting"
                }
                onStart={onStart}
              />
            ))}
          </ol>
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
            <StepPanelCard step={step} />
            {step === 1 ? (
              <PolicySummary
                variant="anchor"
                selectedAddOns={selectedAddOns}
                addedMember={addedMember}
                pinCode={pinCode}
                cover={cover}
              />
            ) : null}
            <SupportPanel />
          </div>
        </aside>
      </div>
      </main>
    </>
  );
}
