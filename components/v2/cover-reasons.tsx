"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useCoverBaseline } from "@/components/v2/cover-baseline";
import {
  COST_GROWTH_SINCE_2024,
  coverStops,
  valueCaptionFor,
  verdictFor,
  zoneFor,
  type CoverZone,
} from "@/lib/v2-data";

/** The top of the chart's scale, so amounts compare across scenarios. */
const MOST = coverStops[coverStops.length - 1].lakhs;

/** Two colours, as in node 147:5537: orange below the recommendation, green from it up. */
const surface: Record<CoverZone, string> = {
  low: "bg-orange-50",
  good: "bg-green-100",
  high: "bg-green-100",
};

const fill: Record<CoverZone, string> = {
  low: "bg-wait-orange",
  good: "bg-success-solid-strong",
  high: "bg-success-solid-strong",
};

/** What ₹15 lakh bought in 2024, in today's prices: the family's need now. */
const NEED_NOW_LAKHS = 15 * COST_GROWTH_SINCE_2024;

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

/** Pixels for the tallest column. */
const PLOT = 116;

/**
 * "Hospital bills went up", drawn. Each column is a cover amount on one
 * scale. Two dotted lines mark what the family needed: ₹15 lakh in 2024, and
 * the same care at today's prices in 2026. ₹15 lakh reaches the 2024 line and
 * stops short of today's; ₹20 lakh is the first to clear it. Each column is
 * labelled with its share of today's need. Only the chosen column is coloured.
 */
function ValueChart({ lakhs }: { lakhs: number }) {
  const { current, reachable: offered } = useCoverBaseline();
  const caption = valueCaptionFor(current);
  const px = (value: number) => (value / MOST) * PLOT;
  const share = (value: number) => Math.round((value / NEED_NOW_LAKHS) * 100);
  const lines = [
    { year: "2026", at: px(NEED_NOW_LAKHS), label: "text-error-text", rule: "border-error-text/60" },
    { year: "2024", at: px(15), label: "text-ink-muted", rule: "border-ink-muted" },
  ];

  const summary = [
    `${caption}.`,
    `What your family needs today is about ₹${NEED_NOW_LAKHS.toFixed(2).replace(/\.?0+$/, "")} lakh.`,
    ...offered.map(
      (stop) =>
        `${lakhsLabel(stop.lakhs)}${stop.lakhs === current ? ", today" : ""}: ${share(stop.lakhs)}% of that.`,
    ),
    `Chosen: ${lakhsLabel(lakhs)}.`,
  ].join(" ");

  return (
    <figure className="mt-4 rounded-xl bg-white px-3 pt-3 pb-4">
      <figcaption className="text-[13px] leading-[1.4] font-semibold text-balance text-ink">
        {caption}
      </figcaption>

      <div role="img" aria-label={summary} className="mt-3">
        <div aria-hidden="true" className="relative" style={{ height: PLOT + 8 }}>
          {lines.map((line) => (
            <span
              key={line.year}
              className={`absolute left-0 w-12 translate-y-1/2 text-center text-[11px] leading-none font-semibold tabular-nums ${line.label}`}
              style={{ bottom: line.at }}
            >
              {line.year}
            </span>
          ))}

          <div className="absolute inset-y-0 right-0 left-14 flex items-end justify-around border-b border-grey-200">
            {offered.map((stop) => {
              const zone = zoneFor(stop.lakhs);
              const chosen = stop.lakhs === lakhs;
              return (
                <div
                  key={stop.lakhs}
                  className="relative flex h-full w-12 flex-col items-center justify-end"
                >
                  {chosen ? (
                    <span
                      className={`absolute inset-x-0 bottom-0 rounded-t-md transition-colors duration-200 ${surface[zone]}`}
                      style={{ height: px(stop.lakhs) + 10 }}
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex w-8 justify-center rounded-t-[5px] pt-1.5 transition-colors duration-200 ${
                      chosen ? fill[zone] : "bg-[#8e9095]"
                    }`}
                    style={{ height: px(stop.lakhs) }}
                  >
                    <span className="text-[9px] leading-none font-semibold text-white tabular-nums">
                      {share(stop.lakhs)}%
                    </span>
                  </span>
                </div>
              );
            })}

            {lines.map((line) => (
              <span
                key={line.year}
                className={`pointer-events-none absolute inset-x-0 z-[5] border-t border-dotted ${line.rule}`}
                style={{ bottom: line.at }}
              />
            ))}
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
 * Why this cover. Version 1 gives the three points; version 2 leads with the
 * chart and keeps the two points it doesn't draw. The card's content changes
 * wholly with the amount, so it is keyed and blurs through the swap.
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
