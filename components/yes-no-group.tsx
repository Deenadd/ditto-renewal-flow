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
 * radio pair (nodes 63:2399, 70:3219, 75:5355). Unselected is a 1.5px grey
 * ring; selected fills the ring and drops a white knob into it.
 *
 * The earlier frame tinted a selected "No" with the error tokens, because back
 * then "No" was the answer that opened a follow-up. The questions have since
 * been reworded so "Yes" carries that meaning, and colouring "Yes, I want more
 * cover" as an error would read wrong, so both selected states use the neutral
 * ink fill.
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

        const ring = selected
          ? "border-ink bg-ink"
          : "border-grey-200 bg-white group-hover:border-ink-secondary";

        const text = selected
          ? "text-ink"
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
