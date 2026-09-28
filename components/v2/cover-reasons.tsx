"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useCoverBaseline } from "@/components/v2/cover-baseline";
import {
  coverStops,
  protectionFor,
  valueCaptionFor,
  verdictFor,
  zoneFor,
  type CoverZone,
} from "@/lib/v2-data";

/** The top of the chart's scale, so amounts compare across scenarios. */
const MOST = coverStops[coverStops.length - 1].lakhs;

const surface: Record<CoverZone, string> = {
  low: "bg-orange-50",
  good: "bg-green-100",
  high: "bg-extra-bg",
};

/** Column fills as drawn in node 146:4524: orange, green, violet. */
const fill: Record<CoverZone, string> = {
  low: "bg-wait-orange",
  good: "bg-success-solid-strong",
  high: "bg-extra shadow-[0_6px_14px_-4px_rgb(130_80_223_/_0.45)]",
};

const lakhsLabel = (lakhs: number) => `₹${lakhs} lakh`;

/**
 * The frames' chart version keeps two of the three points and lets the chart
 * make the third: below the recommendation it drops "It's easiest to add now",
 * at it the chart already shows "Same protection as 2024", above it the start
 * date goes.
 */
function pointsShownWithChart(zone: CoverZone, count: number) {
  const all = Array.from({ length: count }, (_, index) => index);
  return zone === "good" ? all.slice(1, 3) : all.slice(0, 2);
}

/* ---------------------------------------------------------------------------
   The chart (Version 2)
   --------------------------------------------------------------------------- */

/** Pixels for the tallest column; the 2024 line sits at 100% of the scale. */
const PLOT = 116;

/**
 * "Hospital bills went up", drawn. Each column is how much a cover protects at
 * today's prices, as a share of what ₹15 lakh bought in 2024, against a dotted
 * line at that 2024 level. ₹15 lakh falls short of its own old self; ₹20 lakh
 * is the first to clear it. Every amount is always drawn; only the highlight
 * behind the chosen one moves.
 */
function ValueChart({ lakhs }: { lakhs: number }) {
  const { current, reachable: offered } = useCoverBaseline();
  const caption = valueCaptionFor(current);
  const most = protectionFor(MOST);
  const px = (share: number) => (share / most) * PLOT;
  const line = px(1);

  const summary = [
    `${caption}.`,
    ...offered.map(
      (stop) =>
        `${lakhsLabel(stop.lakhs)}${stop.lakhs === current ? ", today" : ""}: ${Math.round(
          protectionFor(stop.lakhs) * 100,
        )}%.`,
    ),
    `Chosen: ${lakhsLabel(lakhs)}.`,
  ].join(" ");

  return (
    <figure className="mt-4 rounded-xl bg-white px-3 pt-3 pb-4">
      <figcaption className="text-[13px] leading-[1.4] font-semibold text-balance text-ink">
        {caption}
      </figcaption>

      <div role="img" aria-label={summary} className="mt-3">
        {/* One box for the plot and its gutter, so the line and its label
            are placed from the same baseline and can't drift apart. */}
        <div aria-hidden="true" className="relative" style={{ height: PLOT + 12 }}>
          <span
            className="absolute left-0 w-12 translate-y-1/2 text-center"
            style={{ bottom: line }}
          >
            <span className="block text-[12px] leading-none font-semibold text-error-text">
              2024
            </span>
            <span className="ff-case mt-1 block text-[9px] leading-none font-medium tracking-[0.5px] text-ink-secondary uppercase">
              Level
            </span>
          </span>

          <div className="absolute inset-y-0 right-0 left-14 flex items-end justify-around border-b border-grey-200">
            {offered.map((stop) => {
              const zone = zoneFor(stop.lakhs);
              const chosen = stop.lakhs === lakhs;
              const share = protectionFor(stop.lakhs);
              return (
                <div
                  key={stop.lakhs}
                  className="relative flex h-full w-12 flex-col items-center justify-end"
                >
                  {chosen ? (
                    <span
                      className={`absolute inset-x-1.5 bottom-0 rounded-t-md transition-colors duration-200 ${surface[zone]}`}
                      style={{ height: Math.max(px(share), line) + 12 }}
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex w-6 justify-center rounded-t-[5px] pt-1.5 ${fill[zone]}`}
                    style={{ height: px(share) }}
                  >
                    <span className="text-[9px] leading-none font-semibold text-white tabular-nums">
                      {Math.round(share * 100)}%
                    </span>
                  </span>
                </div>
              );
            })}

            {/* Above the highlight, beneath the columns: a column that clears
                the 2024 level covers the line. */}
            <span
              className="pointer-events-none absolute inset-x-0 z-[5] border-t border-dotted border-ink-secondary/70"
              style={{ bottom: line }}
            />
          </div>
        </div>

        <div aria-hidden="true" className="mt-2 flex justify-around pl-14">
          {offered.map((stop) => (
            <span key={stop.lakhs} className="w-12 text-center">
              <span
                className={`block text-[12px] leading-[1.3] tabular-nums ${
                  stop.lakhs === lakhs ? "font-semibold text-ink" : "font-medium text-ink-secondary"
                }`}
              >
                {stop.label}
              </span>
              {stop.lakhs === current ? (
                <span className="ff-case block text-[9px] leading-[1.4] font-medium tracking-[0.5px] text-ink-secondary uppercase">
                  Today
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ---------------------------------------------------------------------------
   The points
   --------------------------------------------------------------------------- */

function Points({
  points,
  className = "",
}: {
  points: { title: string; body: string }[];
  className?: string;
}) {
  return (
    <ol className={`flex flex-col gap-4 ${className}`}>
      {points.map((point, position) => (
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
            <p className="mt-2 text-[14px] leading-5 text-pretty text-ink-secondary">
              {point.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------------------
   Versions 1 and 2: the card under the slider
   --------------------------------------------------------------------------- */

/**
 * Why this cover. Version 1 gives the three points; version 2 puts the value
 * chart first and keeps the two points it doesn't draw. The card's content
 * changes wholly with the amount, so it is keyed and blurs through the swap.
 */
export function CoverReasons({
  lakhs,
  mode,
}: {
  lakhs: number;
  mode: "text" | "chart";
}) {
  const { current } = useCoverBaseline();
  const verdict = verdictFor(lakhs, current);
  const points =
    mode === "chart"
      ? pointsShownWithChart(verdict.zone, verdict.points.length).map(
          (index) => verdict.points[index],
        )
      : verdict.points;

  return (
    <div
      className={`mt-4 rounded-2xl px-4 pt-3.5 pb-5 transition-colors duration-200 ${surface[verdict.zone]}`}
    >
      <div key={`${lakhs}-${mode}`} className="motion-safe:animate-swap">
        <h3 className="text-[18px] leading-[1.4] font-semibold tracking-[-0.2px] text-balance text-ink">
          {verdict.title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-5 text-ink-secondary">
          Here&rsquo;s why, in three points.
        </p>
        {mode === "chart" ? <ValueChart lakhs={lakhs} /> : null}
        <Points points={points} className="mt-5" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Version 3: the question under the list
   --------------------------------------------------------------------------- */

/**
 * The list already says what each amount is, so the argument waits behind a
 * question, tinted by the amount chosen, until someone wants it.
 */
export function WhyDrawer({ lakhs }: { lakhs: number }) {
  const { current } = useCoverBaseline();
  const verdict = verdictFor(lakhs, current);
  const [open, setOpen] = useState(false);
  const question =
    verdict.zone === "low" ? `Why ${verdict.title}?` : verdict.title;

  return (
    <div
      className={`mt-4 rounded-xl transition-colors duration-200 ${surface[verdict.zone]}`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-[15px] leading-[1.35] font-semibold text-ink"
      >
        <span key={lakhs} className="motion-safe:animate-swap">
          {question}
        </span>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 text-ink transition-transform duration-200 ease-strong ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <div key={lakhs} className="px-4 pb-5 motion-safe:animate-reveal">
          <Points points={verdict.points} className="mt-1" />
        </div>
      ) : null}
    </div>
  );
}
