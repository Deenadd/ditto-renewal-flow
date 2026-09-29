"use client";

import { useCoverBaseline } from "@/components/v2/cover-baseline";
import { CoverReasons, WhyDrawer } from "@/components/v2/cover-reasons";
import {
  RECOMMENDED_LAKHS,
  coverReasonFor,
  deltaFor,
  zoneLabels,
  type CoverLayout,
  coverStops,
  noteFor,
  premiumFor,
  verdictFor,
  zoneFor,
  type CoverZone,
} from "@/lib/v2-data";

const MIN = coverStops[0].lakhs;
const MAX = coverStops[coverStops.length - 1].lakhs;

/** Where a cover amount sits along the track, 0 at ₹10L and 100 at ₹30L. */
function pct(lakhs: number) {
  return ((lakhs - MIN) / (MAX - MIN)) * 100;
}

const RECO_PCT = pct(RECOMMENDED_LAKHS);

/**
 * Node 147:5537 settles on two colours: orange below the recommendation,
 * green at or above it. Text takes the darker attention orange, which holds
 * 5:1 on white where the fill orange would not.
 */
const zoneText: Record<CoverZone, string> = {
  low: "text-attention",
  good: "text-success",
  high: "text-success",
};

const zoneBorder: Record<CoverZone, string> = {
  low: "border-wait-orange",
  good: "border-success-solid-strong",
  high: "border-success-solid-strong",
};

const zoneFillBar: Record<CoverZone, string> = {
  low: "bg-wait-orange",
  good: "bg-success-solid-strong",
  high: "bg-success-solid-strong",
};

const zoneDot: Record<CoverZone, string> = {
  low: "bg-track-low",
  good: "bg-success-solid-strong",
  high: "bg-extra",
};

const zoneChip: Record<CoverZone, string> = {
  low: "bg-orange-50 text-attention",
  good: "bg-green-100 text-success",
  high: "bg-extra-bg text-extra",
};


/** Two bars, the grab affordance inside the handle below the recommendation. */
function GripMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
    >
      <rect y="0" width="10" height="1.6" rx="0.8" fill="currentColor" />
      <rect y="5.4" width="10" height="1.6" rx="0.8" fill="currentColor" />
    </svg>
  );
}

/** Solid shield (node 142:3806), the handle mark once the cover is enough. */
function ShieldMark({ size = 10 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={(size * 11) / 10}
      viewBox="0 0 10 11"
      fill="none"
    >
      <path
        d="M5.00507 0L0 0.787736V5.30463C0.000472325 5.84113 0.0906008 6.37306 0.26597 6.87452C0.588053 7.79205 1.18145 8.56713 1.95288 9.0779L4.7391 10.9205C4.81818 10.9725 4.90882 11 5.00124 11C5.09366 11 5.18435 10.9725 5.26343 10.9205L8.04966 9.0779C8.82039 8.56699 9.41294 7.79185 9.73403 6.87452C9.9094 6.37306 9.99953 5.84113 10 5.30463V0.787736L5.00507 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const rupees = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

type ControlProps = {
  lakhs: number;
  onChange: (lakhs: number) => void;
};

/**
 * Version 1, the slider drawn in the frames (nodes 142:3693, 142:3789,
 * 142:3883).
 *
 * The track carries the advice: it is yellow up to the recommendation and
 * green past it, and the blue fill covers whichever of those the chosen amount
 * has already reached. The handle and the tick under it take the colour of the
 * band they land in, so the same message arrives three ways.
 */
function SliderControl({ lakhs, onChange }: ControlProps) {
  const { current, reachable } = useCoverBaseline();
  const zone = zoneFor(lakhs);
  const index = reachable.findIndex((stop) => stop.lakhs === lakhs);
  const premium = premiumFor(lakhs);
  const onRecommended = lakhs === RECOMMENDED_LAKHS;

  return (
    <div className="rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          {/* "Current" only while it is: a pre-selected or moved amount is a
              new cover, not the one on the policy. */}
          <p className="ff-case text-[11px] leading-none font-medium tracking-[0.55px] text-ink-muted uppercase">
            {lakhs === current ? "Current cover" : "New cover"}
          </p>
          <p className="ff-figures text-[24px] leading-[1.3] font-semibold tracking-[-0.3px] text-ink">
            ₹{lakhs} Lakhs
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="ff-case text-[11px] leading-none font-medium tracking-[0.55px] text-ink-muted uppercase">
            Premium
          </p>
          <p
            className={`ff-figures text-[24px] leading-[1.3] font-semibold tracking-[-0.3px] tabular-nums transition-colors duration-200 ${
              lakhs === current ? "text-ink" : zoneText[zone]
            }`}
          >
            {rupees(premium)}/yr
          </p>
        </div>
      </div>

      {/* Rail. Everything inside is placed as a percentage of this box, and
          the handle reads that percentage as container units so it moves on
          the compositor rather than through layout. */}
      <div className="relative mt-4 @container">
        <span
          aria-hidden="true"
          style={{ left: `${RECO_PCT}%` }}
          className="ff-case absolute top-0 block -translate-x-1/2 text-[11px] leading-none font-medium tracking-[0.55px] whitespace-nowrap text-success uppercase"
        >
          Recommended
        </span>

        <div className="relative mt-[24px] h-2 rounded-full bg-grey-150">
          <span
            aria-hidden="true"
            style={{ transform: `scaleX(${pct(lakhs) / 100})` }}
            className={`absolute inset-y-0 left-0 w-full origin-left rounded-full transition-[transform,background-color] duration-200 ease-strong ${zoneFillBar[zone]}`}
          />

          {/* The recommendation, marked with the shield the handle wears once
              it arrives there. */}
          <span
            aria-hidden="true"
            style={{ left: `${RECO_PCT}%` }}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-success-solid-strong transition-opacity duration-200 ${
              onRecommended ? "opacity-0" : "opacity-100"
            }`}
          >
            <ShieldMark size={14} />
          </span>

          <input
            type="range"
            min={0}
            max={reachable.length - 1}
            step={1}
            value={index}
            onChange={(event) =>
              onChange(reachable[Number(event.target.value)].lakhs)
            }
            aria-label="Cover amount"
            aria-valuetext={`₹${lakhs} lakh, ${rupees(premium)} a year${
              onRecommended ? ", recommended for your family" : ""
            }`}
            style={{ left: `${pct(current)}%` }}
            className="peer absolute top-1/2 right-0 h-10 -translate-y-1/2 cursor-pointer appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:appearance-none"
          />

          <span
            aria-hidden="true"
            style={{ transform: `translate(calc(${pct(lakhs)}cqw - 50%), -50%)` }}
            className={`pointer-events-none absolute top-1/2 left-0 grid size-6 place-items-center rounded-full border-2 bg-white shadow-thumb transition-[transform,border-color] duration-200 ease-strong peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 ${zoneBorder[zone]} ${zoneText[zone]}`}
          >
            {zone === "low" ? <GripMark /> : <ShieldMark />}
          </span>
        </div>

        {/* Ticks, each centred on its own stop so the handle always lands on
            the label it names. */}
        <div className="relative mt-[21px] h-4">
          {coverStops.map((stop) => {
            const active = stop.lakhs === lakhs;
            const locked = stop.lakhs < current;

            return (
              <span
                key={stop.lakhs}
                style={{ left: `${pct(stop.lakhs)}%` }}
                className={`ff-figures absolute top-0 -translate-x-1/2 text-[16px] leading-4 whitespace-nowrap transition-colors duration-200 ${
                  locked
                    ? "text-grey-200"
                    : active
                      ? `font-semibold ${zoneText[zone]}`
                      : "text-ink"
                }`}
              >
                {stop.label}
              </span>
            );
          })}
        </div>

        {/* Captions sit directly under their tick, so they are dropped on
            narrow screens where they would collide instead of being
            shrunk past reading size. */}
        <div className="relative mt-[7px] hidden h-5 sm:block">
          {coverStops.map((stop) => {
            const note = noteFor(stop.lakhs, current);
            return note ? (
              <span
                key={stop.lakhs}
                style={{ left: `${pct(stop.lakhs)}%` }}
                className={`absolute top-0 -translate-x-1/2 text-[14px] leading-5 whitespace-nowrap ${
                  stop.lakhs === current
                    ? "text-ink-secondary"
                    : stop.lakhs > RECOMMENDED_LAKHS
                      ? "text-extra"
                      : "text-success"
                }`}
              >
                {note}
              </span>
            ) : null;
          })}
        </div>
      </div>

    </div>
  );
}













/** What band this amount falls in, said in words as well as colour. */
function ZoneChip({ lakhs }: { lakhs: number }) {
  const zone = zoneFor(lakhs);
  return (
    <span
      className={`ff-case flex w-fit shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] leading-none font-medium tracking-[0.4px] uppercase ${zoneChip[zone]}`}
    >
      <span
        aria-hidden="true"
        className={`block size-1.5 shrink-0 rounded-full ${zoneDot[zone]}`}
      />
      {lakhs === RECOMMENDED_LAKHS ? "Recommended" : zoneLabels[zone]}
    </span>
  );
}

/**
 * Version 3 (node 146:4524). A card per amount, stacked: the amount and its
 * band, one line on what it buys, and the yearly price with what it adds. The
 * reasons wait in a drawer below, so the list stays a list.
 */
function FinalListControl({ lakhs, onChange }: ControlProps) {
  const { current, reachable } = useCoverBaseline();
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="sr-only">Cover amount</legend>
      {reachable.map((stop) => {
        const zone = zoneFor(stop.lakhs);
        const chosen = stop.lakhs === lakhs;
        const delta = deltaFor(stop.lakhs, current);
        return (
          <label
            key={stop.lakhs}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-grey-150 bg-white px-4 py-3.5 shadow-card transition-colors duration-150 hover:border-grey-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus-ring has-[:focus-visible]:ring-offset-2"
          >
            <input
              type="radio"
              name="cover-amount"
              checked={chosen}
              onChange={() => onChange(stop.lakhs)}
              aria-label={`₹${stop.lakhs} lakh, ${rupees(premiumFor(stop.lakhs))} a year`}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors duration-150 ${
                chosen ? "border-primary bg-primary" : "border-grey-200 bg-white"
              }`}
            >
              <span
                className={`block size-1.5 rounded-full bg-white transition-opacity duration-150 ${
                  chosen ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <span className="ff-figures text-[15px] leading-[1.3] font-semibold text-ink">
                  ₹{stop.lakhs} Lakhs
                </span>
                <ZoneChip lakhs={stop.lakhs} />
              </span>
              <span className="mt-1.5 block text-[13px] leading-[1.45] text-pretty text-ink-secondary">
                {coverReasonFor(stop.lakhs, current)}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="ff-figures block text-[15px] leading-none font-semibold text-ink tabular-nums">
                {rupees(premiumFor(stop.lakhs))}/yr
              </span>
              <span
                className={`ff-figures mt-1.5 block text-[12px] leading-none tabular-nums ${
                  delta.year === 0 ? "text-ink-secondary" : zoneText[zone]
                }`}
              >
                {delta.year === 0
                  ? "no change"
                  : `+₹${delta.month.toLocaleString("en-IN")}/month`}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

/**
 * The cover check. Three versions, from the final frames: the slider with the
 * reasons as three points (the main screen, node 148:6509), the slider with
 * the chart leading the reasons (node 147:5537), and the list with the reasons
 * behind a question (node 146:4524).
 */
export function CoverPicker({
  layout,
  lakhs,
  onChange,
}: ControlProps & { layout: CoverLayout }) {
  const { current } = useCoverBaseline();

  return (
    <div>
      <div key={layout} className="motion-safe:animate-swap">
        {layout === "list" ? (
          <FinalListControl lakhs={lakhs} onChange={onChange} />
        ) : (
          <SliderControl lakhs={lakhs} onChange={onChange} />
        )}
      </div>
      {layout === "list" ? (
        <WhyDrawer lakhs={lakhs} />
      ) : (
        <CoverReasons lakhs={lakhs} mode={layout === "chart" ? "chart" : "text"} />
      )}

      <p aria-live="polite" className="sr-only">
        Cover set to ₹{lakhs} lakh. {verdictFor(lakhs, current).title}
      </p>
    </div>
  );
}
