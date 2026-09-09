"use client";

export type Answer = "yes" | "no";

const options: { value: Answer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

type Props = {
  name: string;
  value: Answer | null;
  onChange: (value: Answer) => void;
  labelledBy: string;
};

/**
 * radio pair (nodes 63:2399 and 70:3219). Unselected is a 1.5px grey ring;
 * selected fills the ring and drops a white knob into it. Choosing "No" uses
 * the error tokens, because "No" is what opens the follow-up questions.
 */
export function YesNoGroup({ name, value, onChange, labelledBy }: Props) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="flex items-center gap-3"
    >
      {options.map((option) => {
        const selected = value === option.value;
        const isNo = option.value === "no";

        const ring = selected
          ? isNo
            ? "border-error bg-error"
            : "border-ink bg-ink"
          : "border-grey-200 bg-white group-hover:border-ink-secondary";

        const text = selected
          ? isNo
            ? "text-error-text"
            : "text-ink"
          : "text-ink-muted group-hover:text-ink-secondary";

        return (
          <label
            key={option.value}
            className="group -my-1.5 flex cursor-pointer items-center gap-1.5 py-1.5"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={`flex size-[15px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${ring}`}
            >
              <span
                className={`size-1.5 rounded-full transition-colors ${
                  selected ? "bg-white" : "bg-transparent"
                }`}
              />
            </span>
            <span
              className={`ff-case text-[13px] leading-[1.15] font-medium transition-colors ${text}`}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
