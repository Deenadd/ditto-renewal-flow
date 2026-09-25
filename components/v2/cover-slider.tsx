"use client";

import {
  CURRENT_LAKHS,
  RECOMMENDED_LAKHS,
  coverLegend,
  coverStops,
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
/** The stops the reviewer can reach. Cover never drops at renewal. */
const reachable = coverStops.filter((stop) => stop.lakhs >= CURRENT_LAKHS);

const zoneText: Record<CoverZone, string> = {
  low: "text-primary",
  good: "text-success",
  high: "text-extra",
};

const zoneBorder: Record<CoverZone, string> = {
  low: "border-primary",
  good: "border-success-solid-strong",
  high: "border-extra",
};

const verdictSurface: Record<CoverZone, string> = {
  low: "bg-orange-50",
  good: "bg-green-100",
  high: "bg-extra-bg",
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
function ShieldMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="10"
      height="11"
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

/**
 * Cover amount card and its slider (nodes 142:3693, 142:3789, 142:3883).
 *
 * The track carries the advice: it is yellow up to the recommendation and
 * green past it, and the blue fill covers whichever of those the chosen amount
 * has already reached. The handle and the tick under it take the colour of the
 * band they land in, so the same message arrives three ways.
 */
export function CoverSlider({
  lakhs,
  onChange,
}: {
  lakhs: number;
  onChange: (lakhs: number) => void;
}) {
  const zone = zoneFor(lakhs);
  const index = reachable.findIndex((stop) => stop.lakhs === lakhs);
  const verdict = verdictFor(lakhs);
  const premium = premiumFor(lakhs);
  const onRecommended = lakhs === RECOMMENDED_LAKHS;

  return (
    <div>
      <div className="rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-4">
            <p className="ff-case text-[11px] leading-none font-medium tracking-[0.55px] text-ink-muted uppercase">
              Current cover
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
              className={`ff-figures text-[24px] leading-[1.3] font-semibold tracking-[-0.3px] transition-colors duration-200 ${
                lakhs === CURRENT_LAKHS ? "text-ink" : zoneText[zone]
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

          <div className="relative mt-[24px] h-2 rounded-full bg-track-base">
            <span
              aria-hidden="true"
              style={{ width: `${RECO_PCT}%` }}
              className="absolute inset-y-0 left-0 rounded-l-full bg-track-low"
            />
            <span
              aria-hidden="true"
              style={{ left: `${RECO_PCT}%` }}
              className="absolute inset-y-0 right-0 rounded-r-full bg-success-solid-strong"
            />
            <span
              aria-hidden="true"
              style={{ transform: `scaleX(${pct(lakhs) / 100})` }}
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-linear-to-r from-track-fill-from to-track-fill-to transition-transform duration-200 ease-strong"
            />

            {/* The recommendation marker, which the handle stands in for once
                it arrives. */}
            <span
              aria-hidden="true"
              style={{ left: `${RECO_PCT}%` }}
              className={`absolute top-1/2 grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-reco-halo transition-opacity duration-200 ${
                onRecommended ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="block size-[6.4px] rounded-full bg-success-solid-strong" />
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
              style={{ left: `${pct(CURRENT_LAKHS)}%` }}
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
              const reached =
                stop.lakhs === RECOMMENDED_LAKHS && lakhs >= RECOMMENDED_LAKHS;
              const locked = stop.lakhs < CURRENT_LAKHS;

              return (
                <span
                  key={stop.lakhs}
                  style={{ left: `${pct(stop.lakhs)}%` }}
                  className={`ff-figures absolute top-0 -translate-x-1/2 text-[16px] leading-4 whitespace-nowrap transition-colors duration-200 ${
                    locked
                      ? "text-grey-200"
                      : active
                        ? `font-semibold ${zoneText[zone]}`
                        : reached
                          ? "font-semibold text-success"
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
            {coverStops.map((stop) =>
              stop.note ? (
                <span
                  key={stop.lakhs}
                  style={{ left: `${pct(stop.lakhs)}%` }}
                  className={`absolute top-0 -translate-x-1/2 text-[14px] leading-5 whitespace-nowrap ${
                    stop.lakhs === RECOMMENDED_LAKHS
                      ? "text-success"
                      : stop.lakhs > RECOMMENDED_LAKHS
                        ? "text-extra"
                        : "text-ink-secondary"
                  }`}
                >
                  {stop.note}
                </span>
              ) : null,
            )}
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          {coverLegend.map((entry) => (
            <li
              key={entry.id}
              className="ff-case flex items-center gap-2 text-[11px] leading-none font-medium tracking-[0.55px] text-ink uppercase"
            >
              <span
                aria-hidden="true"
                className={`block size-2 shrink-0 rounded-full ${
                  entry.id === "low" ? "bg-track-low" : "bg-success-solid-strong"
                }`}
              />
              {entry.label}
            </li>
          ))}
        </ul>
      </div>

      {/* The verdict. Its whole content changes with the stop, so it is keyed
          and blurs through the swap rather than crossfading two readable
          copies of different text. */}
      <div
        className={`mt-5 rounded-2xl px-4 pt-3.5 pb-5 transition-colors duration-200 ${verdictSurface[verdict.zone]}`}
      >
        <div key={lakhs} className="motion-safe:animate-swap">
          <h3 className="text-[18px] leading-[1.4] font-semibold tracking-[-0.2px] text-ink">
            {verdict.title}
          </h3>
          <p className="mt-1.5 text-[14px] leading-5 text-ink-secondary">
            Here&rsquo;s why, in three points.
          </p>

          <ol className="mt-5 flex flex-col gap-4">
            {verdict.points.map((point, position) => (
              <li key={point.title} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="ff-figures mt-[1px] grid size-5 shrink-0 place-items-center rounded-full bg-white text-[11px] leading-none font-medium text-ink-secondary"
                >
                  {position + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-[14px] font-semibold tracking-[-0.07px] text-ink">
                    {point.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-5 text-ink-secondary">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Cover set to ₹{lakhs} lakh. {verdict.title}
      </p>
    </div>
  );
}
