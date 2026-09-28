"use client";

import { VersionMenu } from "@/components/ui/version-menu";
import {
  BIG_CLAIM_LAKHS,
  CURRENT_LAKHS,
  coverStops,
  protectionFor,
  reasonLayoutOptions,
  reasonStatsFor,
  verdictFor,
  zoneFor,
  type CoverZone,
  type ReasonLayout,
  type ReasonStat,
} from "@/lib/v2-data";

/** The amounts on offer at renewal; the drawn ₹10L stop is out of reach. */
const offered = coverStops.filter((stop) => stop.lakhs >= CURRENT_LAKHS);
const MOST = offered[offered.length - 1].lakhs;

const surface: Record<CoverZone, string> = {
  low: "bg-orange-50",
  good: "bg-green-100",
  high: "bg-extra-bg",
};

/** Bar fills, each measured on white for the 3:1 graphics minimum. */
const fill: Record<CoverZone, string> = {
  low: "bg-chart-low",
  good: "bg-success-solid-strong",
  high: "bg-extra",
};

const figureText: Record<CoverZone, string> = {
  low: "text-attention",
  good: "text-success",
  high: "text-extra",
};

const lakhsLabel = (lakhs: number) => `₹${lakhs} lakh`;

/** "today" under the amount the policy carries now. */
function TodayTag({ lakhs }: { lakhs: number }) {
  if (lakhs !== CURRENT_LAKHS) return null;
  return (
    <span className="block text-[11px] leading-[1.3] font-medium text-ink-secondary">
      today
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Version 1 · Claim chart
   --------------------------------------------------------------------------- */

/**
 * "Four of you share the same ₹15 lakh" drawn instead of said. Every cover is
 * a bar on the same ₹30 lakh scale, one heart treatment is carved out of each,
 * and what's left for the rest of the year is the part that changes. The claim
 * is the same size in every row, so the eye goes straight to the difference.
 */
function ClaimChart({ lakhs }: { lakhs: number }) {
  const claimWidth = (BIG_CLAIM_LAKHS / MOST) * 100;

  const summary = [
    `One heart treatment of about ₹${BIG_CLAIM_LAKHS} lakh, against each cover.`,
    ...offered.map((stop) => {
      const left = stop.lakhs - BIG_CLAIM_LAKHS;
      const used = Math.round((BIG_CLAIM_LAKHS / stop.lakhs) * 100);
      return `${lakhsLabel(stop.lakhs)}${
        stop.lakhs === CURRENT_LAKHS ? ", today" : ""
      }: ${used}% used, ₹${left} lakh left.`;
    }),
    `Chosen: ${lakhsLabel(lakhs)}.`,
  ].join(" ");

  return (
    <figure className="rounded-xl bg-white p-4">
      <figcaption className="text-[14px] leading-[1.4] font-semibold text-balance text-ink">
        If one of you needs heart treatment, about ₹{BIG_CLAIM_LAKHS} lakh
      </figcaption>

      <div role="img" aria-label={summary} className="mt-3 flex flex-col gap-0.5">
        {offered.map((stop) => {
          const zone = zoneFor(stop.lakhs);
          const chosen = stop.lakhs === lakhs;
          const left = stop.lakhs - BIG_CLAIM_LAKHS;
          const used = Math.round((BIG_CLAIM_LAKHS / stop.lakhs) * 100);

          return (
            <div
              key={stop.lakhs}
              className={`grid grid-cols-[48px_minmax(0,1fr)_76px] items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-200 sm:grid-cols-[52px_minmax(0,1fr)_92px] ${
                chosen ? surface[zone] : ""
              }`}
            >
              <span>
                <span
                  className={`block text-[14px] leading-[1.3] tabular-nums ${
                    chosen ? "font-semibold text-ink" : "font-medium text-ink-secondary"
                  }`}
                >
                  {stop.label}
                </span>
                <TodayTag lakhs={stop.lakhs} />
              </span>

              {/* The track runs to ₹30 lakh, so every bar shares one scale. */}
              <span className="relative block h-4 rounded-full bg-grey-100">
                <span
                  className="bg-hatch-used absolute inset-y-0 left-0 rounded-l-full"
                  style={{ width: `${claimWidth}%` }}
                />
                <span
                  className={`absolute inset-y-0 rounded-r-full ${fill[zone]}`}
                  style={{
                    left: `calc(${claimWidth}% + 2px)`,
                    width: `calc(${(left / MOST) * 100}% - 2px)`,
                  }}
                />
              </span>

              <span className="text-right">
                <span
                  className={`block text-[13px] leading-[1.3] tabular-nums ${
                    chosen ? "font-semibold text-ink" : "font-medium text-ink"
                  }`}
                >
                  ₹{left}L left
                </span>
                <span className="block text-[12px] leading-[1.3] text-ink-secondary tabular-nums">
                  {used}% used
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <ul
        aria-hidden="true"
        className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-grey-150 pt-3 text-[12px] leading-none text-ink-secondary"
      >
        <li className="flex items-center gap-2">
          <span className="bg-hatch-used block h-2.5 w-4 rounded-sm" />
          Used by the treatment
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-2.5 w-6 overflow-hidden rounded-sm">
            <span className="bg-chart-low block flex-1" />
            <span className="block flex-1 bg-success-solid-strong" />
            <span className="block flex-1 bg-extra" />
          </span>
          Left for the rest of the year
        </li>
      </ul>
    </figure>
  );
}

/* ---------------------------------------------------------------------------
   Version 2 · Value chart
   --------------------------------------------------------------------------- */

/** Pixels for the tallest column; the 2024 line sits at 100% of the scale. */
const PLOT = 160;

/**
 * "Hospital bills went up" drawn instead of said. Each column is how much a
 * cover protects at today's prices, as a share of what ₹15 lakh bought in
 * 2024, against a dashed line at that 2024 level. ₹15 lakh falls short of its
 * own old self; ₹20 lakh is the first to clear it.
 */
function ValueChart({ lakhs }: { lakhs: number }) {
  const most = protectionFor(MOST);
  const px = (share: number) => (share / most) * PLOT;
  const line = px(1);

  const summary = [
    `How much each cover protects today, compared with what ₹${CURRENT_LAKHS} lakh bought in 2024.`,
    ...offered.map(
      (stop) =>
        `${lakhsLabel(stop.lakhs)}${stop.lakhs === CURRENT_LAKHS ? ", today" : ""}: ${Math.round(
          protectionFor(stop.lakhs) * 100,
        )}%.`,
    ),
    `Chosen: ${lakhsLabel(lakhs)}.`,
  ].join(" ");

  return (
    <figure className="rounded-xl bg-white p-4">
      <figcaption className="text-[14px] leading-[1.4] font-semibold text-balance text-ink">
        What each cover protects, against what ₹{CURRENT_LAKHS} lakh bought in 2024
      </figcaption>

      <div role="img" aria-label={summary} className="mt-4">
        {/* One box for the plot and its gutter, so the line and its label
            are placed from the same baseline and can't drift apart. */}
        <div aria-hidden="true" className="relative" style={{ height: PLOT + 22 }}>
          <span
            className="absolute left-0 w-11 translate-y-1/2 text-right text-[11px] leading-[1.2] font-medium text-ink"
            style={{ bottom: line }}
          >
            2024
            <br />
            level
          </span>

          <div className="absolute inset-y-0 right-0 left-14 flex items-end justify-around gap-1.5 border-b border-grey-200">
            {offered.map((stop) => {
              const zone = zoneFor(stop.lakhs);
              const chosen = stop.lakhs === lakhs;
              const share = protectionFor(stop.lakhs);
              return (
                <div
                  key={stop.lakhs}
                  className="relative flex h-full w-full max-w-[76px] flex-col items-center justify-end"
                >
                  {chosen ? (
                    <span
                      className={`absolute inset-x-0 top-0 bottom-0 rounded-t-lg transition-colors duration-200 ${surface[zone]}`}
                    />
                  ) : null}
                  <span
                    className={`relative z-10 mb-1 text-[13px] leading-none tabular-nums ${
                      chosen ? "font-semibold text-ink" : "font-medium text-ink-secondary"
                    }`}
                  >
                    {Math.round(share * 100)}%
                  </span>
                  <span
                    className={`relative z-10 block w-[52%] min-w-[20px] rounded-t-md ${fill[zone]}`}
                    style={{ height: px(share) }}
                  />
                </div>
              );
            })}

            {/* Above the highlight band, beneath the columns: a column that
                clears the 2024 level covers the line. */}
            <span
              className="pointer-events-none absolute inset-x-0 z-[5] border-t-2 border-dashed border-ink/55"
              style={{ bottom: line }}
            />
          </div>
        </div>

        <div aria-hidden="true" className="mt-2 flex justify-around gap-1.5 pl-14">
          {offered.map((stop) => (
            <span key={stop.lakhs} className="w-full max-w-[76px] text-center">
              <span
                className={`block text-[14px] leading-[1.3] tabular-nums ${
                  stop.lakhs === lakhs
                    ? "font-semibold text-ink"
                    : "font-medium text-ink-secondary"
                }`}
              >
                {stop.label}
              </span>
              <TodayTag lakhs={stop.lakhs} />
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ---------------------------------------------------------------------------
   Figures beside a chart
   --------------------------------------------------------------------------- */

/**
 * The reasons a chart doesn't draw, as figures rather than sentences. The
 * figure leads visually; the label comes first in the markup, so a screen
 * reader hears what the number is before the number.
 */
function StatTiles({
  lakhs,
  drawn,
}: {
  lakhs: number;
  drawn: ReasonStat["topic"];
}) {
  const zone = zoneFor(lakhs);
  const stats = reasonStatsFor(lakhs)
    .filter((stat) => stat.topic !== drawn)
    .slice(0, 2);

  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.topic}
          className="flex flex-col-reverse justify-end gap-1.5 rounded-xl bg-white px-4 py-3.5"
        >
          <dt className="text-[13px] leading-[1.45] text-pretty text-ink-secondary">
            {stat.label}
          </dt>
          <dd
            className={`text-[22px] leading-none font-semibold tracking-[-0.3px] tabular-nums ${figureText[zone]}`}
          >
            {stat.figure}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------------------------------------------------------------------
   Original · Text
   --------------------------------------------------------------------------- */

function TextReasons({ lakhs }: { lakhs: number }) {
  const verdict = verdictFor(lakhs);
  return (
    <ol key={lakhs} className="mt-5 flex flex-col gap-4 motion-safe:animate-swap">
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
  );
}

/* ---------------------------------------------------------------------------
   The card
   --------------------------------------------------------------------------- */

/**
 * Why this cover. Shared by every picker, because it is the argument rather
 * than the control, and offered three ways: two charts and the frame's text.
 *
 * The title changes its whole content with the stop, so it is keyed and blurs
 * through the swap. The charts are not keyed on the stop: they draw every
 * amount at once and only the highlight moves, so there is nothing to swap.
 */
export function CoverReasons({
  lakhs,
  layout,
  onLayoutChange,
}: {
  lakhs: number;
  layout: ReasonLayout;
  onLayoutChange: (layout: ReasonLayout) => void;
}) {
  const verdict = verdictFor(lakhs);

  return (
    <div
      className={`mt-5 rounded-2xl px-4 pt-3.5 pb-4 transition-colors duration-200 ${surface[verdict.zone]}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        {/* Full width on a phone, so the menu drops below the title instead
            of squeezing it onto three lines. */}
        <div
          key={lakhs}
          className="min-w-0 basis-full motion-safe:animate-swap sm:grow sm:basis-0"
        >
          <h3 className="text-[18px] leading-[1.4] font-semibold tracking-[-0.2px] text-balance text-ink">
            {verdict.title}
          </h3>
          <p className="mt-1.5 text-[14px] leading-5 text-ink-secondary">
            {layout === "text"
              ? "Here’s why, in three points."
              : "Here’s why, at a glance."}
          </p>
        </div>
        <VersionMenu
          label="Reason version"
          value={layout}
          options={reasonLayoutOptions}
          onChange={(next) => onLayoutChange(next as ReasonLayout)}
          align="end"
        />
      </div>

      {/* Keyed on the version, so switching blurs through rather than
          snapping one chart out and another in. */}
      <div key={layout} className="motion-safe:animate-swap">
        {layout === "claim" ? (
          <div className="mt-4">
            <ClaimChart lakhs={lakhs} />
            <StatTiles lakhs={lakhs} drawn="claim" />
          </div>
        ) : layout === "value" ? (
          <div className="mt-4">
            <ValueChart lakhs={lakhs} />
            <StatTiles lakhs={lakhs} drawn="cost" />
          </div>
        ) : (
          <TextReasons lakhs={lakhs} />
        )}
      </div>
    </div>
  );
}
