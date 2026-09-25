"use client";

import { useEffect, useRef } from "react";
import { CheckMarkIcon } from "@/components/icons";
import { AutoHeight } from "@/components/ui/auto-height";
import { deltaFor } from "@/lib/v2-data";
import {
  CURRENT_LAKHS,
  RECOMMENDED_LAKHS,
  coverPitch,
  otherCovers,
} from "@/lib/v3-data";

const perMonth = (lakhs: number) =>
  `+₹${deltaFor(lakhs).month.toLocaleString("en-IN")} a month`;

/**
 * The one decision V3 asks for up front.
 *
 * V2 put a picker in front of this question and the argument for it below.
 * Here the argument comes first and the answer is two buttons, because the
 * question really is "take the recommendation or not". Once answered, the card
 * closes down to a line, so the page gets shorter as you work through it.
 */
export function CoverDecision({
  lakhs,
  decided,
  onDecide,
  onReopen,
}: {
  lakhs: number;
  decided: boolean;
  onDecide: (lakhs: number) => void;
  onReopen: () => void;
}) {
  const changeRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  /* Focus only moves in answer to the reviewer, never on first paint. */
  const acted = useRef(false);

  /* The button that was pressed is gone after the swap, so focus goes to the
     control that replaces it instead of falling back to the page. */
  useEffect(() => {
    if (!acted.current) return;
    (decided ? changeRef.current : titleRef.current)?.focus();
  }, [decided]);

  function decide(next: number) {
    acted.current = true;
    onDecide(next);
  }

  const raised = lakhs > CURRENT_LAKHS;

  return (
    <section
      aria-labelledby="cover-title"
      className="rounded-2xl border border-grey-150 bg-white shadow-card"
    >
      <AutoHeight>
        {decided ? (
          <div
            key="decided"
            className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 motion-safe:animate-swap"
          >
            <span
              aria-hidden="true"
              className={`grid size-8 shrink-0 place-items-center rounded-full ${
                raised
                  ? "bg-green-100 text-success-strong"
                  : "bg-grey-100 text-ink-secondary"
              }`}
            >
              <CheckMarkIcon size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="cover-title"
                className="text-[16px] leading-[1.35] font-semibold text-ink"
              >
                {raised
                  ? `Cover raised to ₹${lakhs} lakh`
                  : `Cover stays at ₹${lakhs} lakh`}
              </h2>
              <p className="mt-1 text-[14px] leading-[1.45] text-pretty text-ink-secondary">
                {raised
                  ? `${perMonth(lakhs)}. The extra ₹${lakhs - CURRENT_LAKHS} lakh can be used from 30 days after renewal.`
                  : "The same as today."}
              </p>
            </div>
            <button
              ref={changeRef}
              type="button"
              onClick={() => {
                acted.current = true;
                onReopen();
              }}
              className="flex h-9 touch-manipulation items-center rounded-lg px-3 text-[14px] leading-none font-medium text-primary-strong transition-[background-color,transform] duration-150 select-none hover:bg-blue-light active:scale-[0.96]"
            >
              Change
            </button>
          </div>
        ) : (
          <div key="pitch" className="px-5 pt-5 pb-5 motion-safe:animate-swap">
            <p className="ff-case w-fit rounded-md bg-green-100 px-2 py-1 text-[11px] leading-none font-semibold tracking-[0.55px] text-success-strong uppercase">
              {coverPitch.eyebrow}
            </p>
            <h2
              id="cover-title"
              ref={titleRef}
              tabIndex={-1}
              className="mt-3 text-[22px] leading-[1.25] font-semibold tracking-[-0.3px] text-balance text-ink focus:outline-none"
            >
              {coverPitch.title}
            </h2>
            <p className="mt-2 max-w-[520px] text-[15px] leading-[1.5] text-pretty text-ink-secondary">
              {coverPitch.lead}
            </p>

            <ul className="mt-4 flex max-w-[560px] flex-col gap-2.5">
              {coverPitch.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[14px] leading-[1.5] text-pretty text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[9px] block size-1.5 shrink-0 rounded-full bg-grey-300"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => decide(RECOMMENDED_LAKHS)}
                className="flex h-11 touch-manipulation items-center justify-center gap-2 rounded-lg bg-primary-strong px-4 text-[15px] leading-none font-medium text-white transition-[background-color,transform] duration-150 select-none hover:bg-primary-strong-hover active:scale-[0.96]"
              >
                {lakhs === RECOMMENDED_LAKHS ? <CheckMarkIcon size={13} /> : null}
                Raise to ₹{RECOMMENDED_LAKHS} lakh{" "}
                <span className="font-normal opacity-85">
                  · {perMonth(RECOMMENDED_LAKHS)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => decide(CURRENT_LAKHS)}
                className="flex h-11 touch-manipulation items-center justify-center gap-2 rounded-lg border border-grey-200 bg-white px-4 text-[15px] leading-none font-medium text-ink transition-[background-color,transform] duration-150 select-none hover:bg-grey-50 active:scale-[0.96]"
              >
                Keep ₹{CURRENT_LAKHS} lakh
              </button>
            </div>

            {/* Each option wraps as one unit, so a narrow screen never
                strands a separator at the end of a line. */}
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] leading-[1.45] text-ink-secondary">
              <span>Need more?</span>
              {otherCovers.map((amount) => (
                <span key={amount} className="flex items-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => decide(amount)}
                    className="-ml-1 touch-manipulation rounded px-1 font-medium text-primary-strong underline decoration-from-font underline-offset-4 select-none"
                  >
                    ₹{amount} lakh
                  </button>
                  <span className="tabular-nums">({perMonth(amount)})</span>
                </span>
              ))}
            </p>
          </div>
        )}
      </AutoHeight>
    </section>
  );
}
