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
 * radio pair (node 63:2399 and siblings). Native inputs keep arrow-key
 * navigation and screen-reader semantics; the visible control is drawn to the
 * Figma spec: 1.5px ring, 6px dot, 13px medium label.
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
              className={`flex size-[15px] shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                selected
                  ? "border-ink"
                  : "border-grey-200 group-hover:border-ink-secondary"
              }`}
            >
              <span
                className={`size-1.5 rounded-full transition-colors ${
                  selected ? "bg-ink" : "bg-transparent"
                }`}
              />
            </span>
            <span
              className={`ff-case text-[13px] leading-[1.15] font-medium transition-colors ${
                selected ? "text-ink" : "text-ink-muted group-hover:text-ink-secondary"
              }`}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
