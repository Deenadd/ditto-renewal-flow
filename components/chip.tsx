"use client";

import { CheckCircleIcon, MinusIcon, PlusIcon } from "@/components/icons";

/**
 * tag (nodes 63:2412, 70:3345 - 70:3376).
 *
 * - `on`    already on the policy: grey-50 fill, secondary hairline, solid check
 * - `off`   available but not chosen: white fill, default hairline, no mark
 * - `added` newly added in this session: green-50 fill, success hairline, green check
 *
 * A chip can also carry a counter, which appends a hairline and a stepper
 * inside the same pill.
 */
export type ChipState = "on" | "off" | "added";

type Counter = {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label: string;
};

type Props = {
  label: string;
  state: ChipState;
  onToggle: () => void;
  counter?: Counter;
};

const surface: Record<ChipState, string> = {
  on: "border-ink-secondary bg-grey-50",
  off: "border-grey-200 bg-white hover:border-ink-muted",
  added: "border-success-solid bg-green-50",
};

const pill = "flex h-9 items-center rounded-full border px-3 transition-colors";
const text = "ff-case text-[16px] leading-[1.15] font-medium text-ink";

function Mark({ state }: { state: ChipState }) {
  if (state === "off") return null;
  return (
    <CheckCircleIcon
      className={`shrink-0 ${
        state === "added" ? "text-success-solid" : "text-ink-secondary"
      }`}
    />
  );
}

export function Chip({ label, state, onToggle, counter }: Props) {
  if (!counter) {
    return (
      <button
        type="button"
        aria-pressed={state !== "off"}
        onClick={onToggle}
        className={`${pill} gap-1.5 ${text} ${surface[state]}`}
      >
        <Mark state={state} />
        {label}
      </button>
    );
  }

  return (
    <div className={`${pill} gap-2.5 ${surface[state]}`}>
      <button
        type="button"
        aria-pressed={state !== "off"}
        onClick={onToggle}
        className={`flex h-9 items-center gap-1.5 ${text}`}
      >
        <Mark state={state} />
        {label}
      </button>

      <span aria-hidden="true" className="h-[38px] w-px bg-ink-secondary/10" />

      <span className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => counter.onChange(counter.value - 1)}
          disabled={counter.value <= (counter.min ?? 0)}
          aria-label={`One fewer ${counter.label}`}
          className="rounded-full text-icon-muted transition-colors enabled:hover:text-ink-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MinusIcon />
        </button>
        <span
          aria-live="polite"
          className="min-w-[10px] text-center text-[14px] leading-none font-medium text-ink"
        >
          {counter.value}
        </span>
        <button
          type="button"
          onClick={() => counter.onChange(counter.value + 1)}
          disabled={counter.value >= (counter.max ?? 99)}
          aria-label={`One more ${counter.label}`}
          className="rounded-full text-focus transition-colors enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PlusIcon />
        </button>
      </span>
    </div>
  );
}
