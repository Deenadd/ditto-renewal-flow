"use client";

import { CheckMarkIcon, MinusIcon, PlusIcon } from "@/components/icons";
import {
  CURRENT_LAKHS,
  RECOMMENDED_LAKHS,
  coverLegend,
  coverStops,
  deltaFor,
  premiumFor,
  verdictFor,
  zoneFor,
  zoneLabels,
  type CoverLayout,
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

const zoneDot: Record<CoverZone, string> = {
  low: "bg-track-low",
  good: "bg-success-solid-strong",
  high: "bg-extra",
};

const zoneFill: Record<CoverZone, string> = {
  low: "bg-track-low",
  good: "bg-success-solid-strong",
  high: "bg-extra",
};

/**
 * Same family as the band, dark enough to carry a white tick. The band's own
 * amber is too light for a glyph to sit on.
 */
const zoneTick: Record<CoverZone, string> = {
  low: "bg-attention",
  good: "bg-success-solid-strong",
  high: "bg-extra",
};

const zoneChip: Record<CoverZone, string> = {
  low: "bg-orange-50 text-attention",
  good: "bg-green-100 text-success",
  high: "bg-extra-bg text-extra",
};

const zoneSurface: Record<CoverZone, string> = {
  low: "border-track-low bg-orange-50/60",
  good: "border-success-solid-strong bg-green-100/70",
  high: "border-extra bg-extra-bg/70",
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
  const zone = zoneFor(lakhs);
  const index = reachable.findIndex((stop) => stop.lakhs === lakhs);
  const premium = premiumFor(lakhs);
  const onRecommended = lakhs === RECOMMENDED_LAKHS;

  return (
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
  );
}

/**
 * Why this cover, said in three points. Shared by all three pickers, because
 * it is the argument rather than the control.
 *
 * Its whole content changes with the stop, so it is keyed and blurs through
 * the swap rather than crossfading two readable copies of different text.
 */
function VerdictCard({ lakhs }: { lakhs: number }) {
  const verdict = verdictFor(lakhs);

  return (
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
  );
}

/** Round step control either side of the amount in version 3. */
function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-9 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-150 ${
        disabled
          ? "cursor-not-allowed border-grey-150 text-grey-200"
          : "border-grey-200 text-ink hover:border-grey-300 hover:bg-grey-50 active:scale-[0.96]"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Version 2. Every amount priced up front, so the choice is a comparison
 * rather than a search: the slider makes you move the handle to find out what
 * ₹25 lakh costs, and these four cards just say it.
 */
function CardsControl({ lakhs, onChange }: ControlProps) {
  return (
    <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <legend className="sr-only">Cover amount</legend>
      {reachable.map((stop) => {
        const zone = zoneFor(stop.lakhs);
        const chosen = stop.lakhs === lakhs;
        const delta = deltaFor(stop.lakhs);

        return (
          <label
            key={stop.lakhs}
            className={`flex cursor-pointer flex-col gap-3.5 rounded-xl border-2 p-3.5 shadow-card transition-[border-color,background-color,transform] duration-150 active:scale-[0.98] ${
              chosen ? zoneSurface[zone] : "border-grey-150 bg-white hover:border-grey-200"
            }`}
          >
            <input
              type="radio"
              name="cover-amount"
              checked={chosen}
              onChange={() => onChange(stop.lakhs)}
              aria-label={`₹${stop.lakhs} lakh, ${rupees(premiumFor(stop.lakhs))} a year`}
              className="sr-only"
            />

            <span className="flex items-start justify-between gap-2">
              <span className="ff-figures text-[20px] leading-none font-semibold tracking-[-0.3px] text-ink">
                {stop.label}
              </span>
              <span
                aria-hidden="true"
                className={`grid size-[18px] shrink-0 place-items-center rounded-full transition-colors duration-150 ${
                  chosen
                    ? `${zoneTick[zone]} text-white`
                    : "border-[1.5px] border-grey-200"
                }`}
              >
                {chosen ? <CheckMarkIcon size={11} /> : null}
              </span>
            </span>

            <span className="block">
              <span className="ff-figures block text-[15px] leading-none font-medium text-ink">
                {rupees(premiumFor(stop.lakhs))}
                <span className="font-normal text-ink-muted">/yr</span>
              </span>
              <span className="ff-figures mt-2 block text-[13px] leading-none text-ink-secondary">
                {delta.year === 0
                  ? "You have now"
                  : `+${rupees(delta.year)} a year`}
              </span>
            </span>

            <span
              className={`ff-case flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] leading-none font-medium tracking-[0.4px] uppercase ${zoneChip[zone]}`}
            >
              <span
                aria-hidden="true"
                className={`block size-1.5 shrink-0 rounded-full ${zoneDot[zone]}`}
              />
              {stop.lakhs === RECOMMENDED_LAKHS ? "Recommended" : zoneLabels[zone]}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

/**
 * Version 3. One amount at a time, priced by the month, which is the unit
 * people budget in. The meter keeps the sense of position the slider gives
 * without asking anyone to drag anything.
 */
function StepperControl({ lakhs, onChange }: ControlProps) {
  const zone = zoneFor(lakhs);
  const index = reachable.findIndex((stop) => stop.lakhs === lakhs);
  const delta = deltaFor(lakhs);
  const step = (by: number) => onChange(reachable[index + by].lakhs);

  return (
    <div className="rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-5">
        <div className="flex flex-col gap-4">
          <p className="ff-case text-[11px] leading-none font-medium tracking-[0.55px] text-ink-muted uppercase">
            Cover amount
          </p>
          <div className="flex h-9 items-center gap-3">
            <StepButton
              label="Lower the cover"
              disabled={index === 0}
              onClick={() => step(-1)}
            >
              <MinusIcon />
            </StepButton>
            <p className="ff-figures min-w-[142px] text-center text-[26px] leading-none font-semibold tracking-[-0.4px] text-ink tabular-nums">
              ₹{lakhs} Lakhs
            </p>
            <StepButton
              label="Raise the cover"
              disabled={index === reachable.length - 1}
              onClick={() => step(1)}
            >
              <PlusIcon />
            </StepButton>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <p className="ff-case text-[11px] leading-none font-medium tracking-[0.55px] text-ink-muted uppercase">
            Premium
          </p>
          <p
            className={`ff-figures flex h-9 items-center text-[26px] leading-none font-semibold tracking-[-0.4px] transition-colors duration-200 ${
              lakhs === CURRENT_LAKHS ? "text-ink" : zoneText[zone]
            }`}
          >
            {rupees(premiumFor(lakhs))}/yr
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="mt-6 flex items-center gap-1.5">
        {reachable.map((stop, position) => (
          <span
            key={stop.lakhs}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              position <= index ? zoneFill[zone] : "bg-grey-150"
            }`}
          />
        ))}
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`ff-case flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] leading-none font-medium tracking-[0.4px] uppercase ${zoneChip[zone]}`}
        >
          <span
            aria-hidden="true"
            className={`block size-1.5 shrink-0 rounded-full ${zoneDot[zone]}`}
          />
          {lakhs === RECOMMENDED_LAKHS ? "Recommended" : zoneLabels[zone]}
        </span>
        <span className="text-[14px] leading-5 text-ink-secondary">
          {delta.year === 0
            ? "Exactly what you pay today."
            : `About ₹${delta.month.toLocaleString("en-IN")} more a month than you pay now.`}
        </span>
      </p>
    </div>
  );
}

const controls: Record<CoverLayout, (props: ControlProps) => React.ReactElement> = {
  slider: SliderControl,
  cards: CardsControl,
  stepper: StepperControl,
};

/**
 * The cover check. Three ways to pick the same five stops, sharing the verdict
 * beneath them, so the layouts can be compared on the control alone.
 */
export function CoverPicker({
  layout,
  lakhs,
  onChange,
}: ControlProps & { layout: CoverLayout }) {
  const Control = controls[layout];

  return (
    <div>
      {/* Keyed on the layout so swapping versions blurs through rather than
          snapping one control out and another in. */}
      <div key={layout} className="motion-safe:animate-swap">
        <Control lakhs={lakhs} onChange={onChange} />
      </div>

      <VerdictCard lakhs={lakhs} />

      <p aria-live="polite" className="sr-only">
        Cover set to ₹{lakhs} lakh. {verdictFor(lakhs).title}
      </p>
    </div>
  );
}
