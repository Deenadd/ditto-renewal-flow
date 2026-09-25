"use client";

import Image from "next/image";
import { VerifiedDiscountIcon } from "@/components/icons";
import { policy } from "@/lib/renewal-data";
import {
  rupees,
  taxSaving,
  termDiscount,
  v3Intro,
  yearsLabel,
  type Priced,
} from "@/lib/v3-data";

/**
 * A figure that changes in place. Tabular digits so the column never shifts,
 * and keyed on its value so a new amount blurs in rather than snapping, which
 * is the cue that something you did just changed it.
 */
function Figure({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span
      key={value}
      className={`inline-block tabular-nums motion-safe:animate-swap ${className}`}
    >
      {rupees(value)}
    </span>
  );
}

/** How the choices so far compare with renewing exactly as is. */
function DeltaNote({ delta }: { delta: number }) {
  if (delta === 0) {
    return <>The same as renewing as is.</>;
  }
  return (
    <>
      <span className="font-medium text-ink tabular-nums">
        {rupees(Math.abs(delta))}
      </span>{" "}
      a year {delta > 0 ? "more" : "less"} than renewing as is.
    </>
  );
}

const primaryButton =
  "flex h-12 w-full touch-manipulation items-center justify-center rounded-lg bg-primary-strong px-4 text-[16px] leading-none font-medium text-white transition-[background-color,transform] duration-150 select-none hover:bg-primary-strong-hover active:scale-[0.96]";

/**
 * The price, itemised, beside everything that changes it.
 *
 * V2's sidebar repeated the Figma card, whose lines did not add up to its own
 * total and which never moved when the cover did. Every line here sums to the
 * figure under it, and the action sits under the price it commits to.
 */
export function Receipt({
  priced,
  next,
  changed,
  onUndo,
  onConfirm,
}: {
  priced: Priced;
  next: string;
  changed: boolean;
  onUndo: () => void;
  onConfirm: () => void;
}) {
  const discountPct = Math.round(termDiscount[priced.years] * 1000) / 10;

  return (
    <section
      id="receipt"
      aria-labelledby="receipt-title"
      className="scroll-mt-24 rounded-2xl border border-grey-150 bg-white shadow-float"
    >
      <div className="flex items-center gap-3 border-b border-grey-150 px-5 py-4">
        <Image
          src="/brand/hdfc-ergo.png"
          alt=""
          width={320}
          height={320}
          className="size-10 shrink-0 rounded-md object-cover outline outline-1 -outline-offset-1 outline-black/10"
        />
        <div className="min-w-0">
          <h2
            id="receipt-title"
            className="text-[16px] leading-[1.3] font-semibold text-ink"
          >
            {policy.name}
          </h2>
          <p className="mt-0.5 text-[13px] leading-[1.4] text-ink-secondary">
            {policy.insurer} · renews {v3Intro.deadline}
          </p>
        </div>
      </div>

      <div className="px-5 pt-4">
        <dl className="flex flex-col gap-3">
          {priced.lines.map((line) => (
            <div
              key={line.label}
              className="flex items-baseline justify-between gap-4 motion-safe:animate-reveal"
            >
              <dt className="text-[14px] leading-[1.4] text-ink-secondary">
                {line.added ? (
                  <span aria-hidden="true" className="mr-1 font-medium text-success-strong">
                    +
                  </span>
                ) : null}
                {line.label}
                {line.added ? <span className="sr-only"> (added)</span> : null}
              </dt>
              <dd className="shrink-0 text-[14px] leading-[1.4] font-medium text-ink tabular-nums">
                {rupees(line.value)}
              </dd>
            </div>
          ))}
        </dl>

        {priced.years > 1 ? (
          <dl className="mt-3 flex flex-col gap-3 border-t border-grey-150 pt-3">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[14px] leading-[1.4] text-ink-secondary">
                A year
              </dt>
              <dd className="text-[14px] leading-[1.4] font-medium text-ink tabular-nums">
                {rupees(priced.annual)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[14px] leading-[1.4] text-ink-secondary">
                {yearsLabel(priced.years)}, {discountPct}% off
              </dt>
              <dd className="text-[14px] leading-[1.4] font-medium text-success-strong tabular-nums">
                −{rupees(priced.saving)}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>

      <div className="mx-5 mt-4 border-t border-grey-150 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[15px] leading-none font-semibold text-ink">You pay</p>
          <p className="text-[28px] leading-none font-semibold tracking-[-0.4px] text-ink">
            <Figure value={priced.total} />
          </p>
        </div>
        <p className="mt-2 text-right text-[13px] leading-[1.4] text-ink-secondary">
          for {yearsLabel(priced.years)}, including 18% GST
        </p>
        <p className="mt-3 text-[13px] leading-[1.45] text-pretty text-ink-secondary">
          <DeltaNote delta={priced.delta} />
        </p>
      </div>

      <p className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-[13px] leading-[1.4] text-pretty text-success-strong">
        <VerifiedDiscountIcon className="shrink-0" />
        Save up to {taxSaving} in tax under 80D
      </p>

      <div className="px-5 pt-5 pb-5">
        {/* On a phone the bar pinned to the bottom carries the action, so the
            view never has two primary buttons in it. */}
        <div className="hidden lg:block">
          <button type="button" onClick={onConfirm} className={primaryButton}>
            Continue
          </button>
          <p className="mt-2.5 text-center text-[13px] leading-[1.45] text-pretty text-ink-secondary">
            {next} Nothing is charged yet.
          </p>
        </div>
        {changed ? (
          <button
            type="button"
            onClick={onUndo}
            className="mx-auto block touch-manipulation rounded px-1 text-[13px] leading-[1.45] font-medium text-ink-secondary underline decoration-from-font underline-offset-4 select-none hover:text-ink lg:mt-3"
          >
            Undo all changes
          </button>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The price and the action, pinned to the bottom of a phone screen.
 *
 * In V2 the price sat in a sidebar that a phone drops to the very end of a
 * three-thousand-pixel page, so nobody choosing a cover could see what it cost.
 */
export function MobileBar({
  priced,
  onConfirm,
}: {
  priced: Priced;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-grey-150 bg-white/90 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-12px_28px_-16px_rgb(30_37_75_/_0.22)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[1112px] items-center gap-4 px-6 py-3">
        <a
          href="#receipt"
          className="min-w-0 flex-1 touch-manipulation rounded-md select-none"
        >
          <span className="block text-[20px] leading-[1.2] font-semibold text-ink">
            <Figure value={priced.total} />
          </span>
          <span className="block text-[13px] leading-[1.4] text-ink-secondary">
            for {yearsLabel(priced.years)} ·{" "}
            <span className="font-medium text-primary-strong">See breakdown</span>
          </span>
        </a>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-12 shrink-0 touch-manipulation items-center justify-center rounded-lg bg-primary-strong px-6 text-[16px] leading-none font-medium text-white transition-[background-color,transform] duration-150 select-none active:scale-[0.96]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
