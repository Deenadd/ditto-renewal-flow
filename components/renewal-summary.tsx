"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PolicySummary, RenewalDeadlineBanner } from "@/components/policy-summary";
import {
  InformationIcon,
  SummaryCheckIcon,
  SummaryPlusIcon,
} from "@/components/icons";
import {
  digitalDiscountNote,
  inflationOffer,
  policyPeriods,
  type PolicyPeriod,
  type QuestionId,
} from "@/lib/renewal-data";

/** One line of the change summary (node 78:6868). */
export type SummaryLine = {
  id: QuestionId;
  /** Changed lines get the blue plus and a Change link; the rest get a check. */
  changed: boolean;
  text: string;
};

/** How long between one summary line appearing and the next. */
const STEP_MS = 1000;

function PeriodCard({
  period,
  selected,
  onSelect,
}: {
  period: PolicyPeriod;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-grey-150 bg-white p-5 shadow-card transition-colors hover:border-grey-200">
      <span className="flex min-w-0 flex-1 items-start gap-3">
        <input
          type="radio"
          name="policy-period"
          value={period.id}
          checked={selected}
          onChange={onSelect}
          className="peer sr-only"
        />
        <span
          className={`flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
            selected ? "border-focus bg-focus" : "border-grey-200 bg-white"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${selected ? "bg-white" : "bg-transparent"}`}
          />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-3">
          <span className="flex flex-col gap-2">
            <span className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
              {period.name}
            </span>
            <span className="max-w-[462px] text-[13px] leading-[1.5] text-ink-secondary">
              {period.description}
            </span>
          </span>

          {period.saving ? (
            <span className="block w-fit max-w-full rounded-md bg-green-100 px-2 py-1 text-[13px] leading-[1.4] tracking-[0.0325px] text-green-11">
              <span className="font-semibold">
                Big Savings {period.saving.amount}!
              </span>{" "}
              That&rsquo;s like getting{" "}
              <span className="font-semibold">{period.saving.months} FREE.</span>
            </span>
          ) : null}
        </span>
      </span>

      <span className="ff-figures flex w-[78px] shrink-0 flex-col gap-1 text-right">
        <span className="text-[12px] leading-none font-medium tracking-[0.18px] text-ink-muted">
          Premium
        </span>
        <span
          className={`text-[16px] leading-none font-medium tracking-[0.16px] ${
            period.wasPriceLabel ? "text-green-9" : "text-ink"
          }`}
        >
          {period.priceLabel}
        </span>
        {period.wasPriceLabel ? (
          <span className="text-[12px] leading-none font-medium tracking-[0.18px] text-ink-muted line-through">
            {period.wasPriceLabel}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/**
 * Renewal summary (node 78:6737).
 *
 * The change lines land one at a time, then the policy periods follow. Anyone
 * who prefers reduced motion gets the whole screen at once.
 */
export function RenewalSummary({
  lines,
  editors,
  selectedAddOns,
  addedMember,
  pinCode,
  cover,
  onBack,
  onBuy,
}: {
  lines: SummaryLine[];
  /** The same follow-up block the review page uses, opened in place here. */
  editors: Partial<Record<QuestionId, ReactNode>>;
  selectedAddOns: string[];
  addedMember?: string;
  pinCode?: string;
  cover?: string;
  onBack: () => void;
  onBuy: () => void;
}) {
  const [revealed, setRevealed] = useState(0);
  const [period, setPeriod] = useState(policyPeriods[0].id);
  const [editing, setEditing] = useState<QuestionId | null>(null);

  useEffect(() => {
    /* Reduced motion collapses the stagger to nothing, so the whole screen
       lands at once instead of stepping through. */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let step = 0;

    const timer = window.setInterval(
      () => {
        step += 1;
        setRevealed(step);
        if (step > lines.length) window.clearInterval(timer);
      },
      reduce ? 0 : STEP_MS,
    );

    return () => window.clearInterval(timer);
  }, [lines.length]);

  const periodsVisible = revealed > lines.length;

  return (
    <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 lg:pt-[82px] xl:px-0">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
        <div className="min-w-0">
          <RenewalDeadlineBanner className="mb-8 lg:hidden" />

          <h1 className="text-[32px] leading-[1.2] font-semibold text-ink">
            Quick answers before renewals
          </h1>
          <p className="mt-3 max-w-[583px] text-[16px] leading-[1.5] text-ink-secondary">
            Premiums shift by city. If you&rsquo;ve moved, we&rsquo;ll re-check
            the price before you renew sometimes it drops.
          </p>

          {/* What changed */}
          <ul aria-live="polite" className="mt-8 flex flex-col">
            {lines.map((line, index) => (
              <li
                key={line.id}
                hidden={revealed <= index}
                className="motion-safe:animate-reveal-blur border-b border-dashed border-grey-150 py-5 first:pt-0 last:border-solid"
              >
                <div className="flex items-center gap-[15px]">
                  {line.changed ? (
                    <SummaryPlusIcon className="shrink-0 text-focus" />
                  ) : (
                    <SummaryCheckIcon className="shrink-0 text-success" />
                  )}
                  <p className="flex min-w-0 flex-1 items-center justify-between gap-4 text-[16px] leading-[1.3] font-medium text-ink">
                    <span className="min-w-0">{line.text}</span>
                    {line.changed && editors[line.id] ? (
                      <button
                        type="button"
                        aria-expanded={editing === line.id}
                        onClick={() =>
                          setEditing(editing === line.id ? null : line.id)
                        }
                        className="shrink-0 text-[14px] leading-[1.3] font-medium text-link underline-offset-4 hover:underline"
                      >
                        {editing === line.id ? "Done" : "Change"}
                      </button>
                    ) : null}
                  </p>
                </div>

                {editing === line.id ? editors[line.id] : null}
              </li>
            ))}
          </ul>

          {/* Policy periods */}
          <section hidden={!periodsVisible} className="motion-safe:animate-reveal-blur mt-6">
            <h2 className="text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-ink">
              Choose your policy periods
            </h2>
            <p className="mt-2 max-w-[546px] text-[16px] leading-[1.5] text-ink-secondary">
              Premiums shift by city. If you&rsquo;ve moved, we&rsquo;ll re-check
              the price before you renew sometimes it drops.
            </p>

            <div
              role="radiogroup"
              aria-label="Policy period"
              className="mt-6 flex flex-col gap-4"
            >
              <PeriodCard
                period={policyPeriods[0]}
                selected={period === policyPeriods[0].id}
                onSelect={() => setPeriod(policyPeriods[0].id)}
              />

              <div className="rounded-xl bg-blue-light p-2">
                <div className="px-2 pt-2">
                  <p className="text-[16px] leading-none font-semibold text-link">
                    {inflationOffer.title}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-none text-link">
                    {inflationOffer.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {policyPeriods.slice(1).map((option) => (
                    <PeriodCard
                      key={option.id}
                      period={option}
                      selected={period === option.id}
                      onSelect={() => setPeriod(option.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-grey-150 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="ff-case flex h-10 items-center justify-center rounded-lg border border-grey-200 bg-white px-3 text-[15px] leading-[1.15] font-medium text-ink shadow-card transition-colors hover:bg-grey-50"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={onBuy}
                className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors hover:bg-primary-hover"
              >
                Buy this policy
              </button>
            </div>
          </section>
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-[88px]">
            <PolicySummary
              variant="summary"
              selectedAddOns={selectedAddOns}
              addedMember={addedMember}
              pinCode={pinCode}
              cover={cover}
            />
            <p className="mx-5 mt-4 flex h-8 items-center gap-2 rounded-lg bg-grey-100 px-2.5 text-[13px] leading-none text-ink-secondary">
              <InformationIcon className="shrink-0 text-ink-muted" />
              {digitalDiscountNote}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
