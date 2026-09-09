"use client";

import { CheckCircleIcon } from "@/components/icons";

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

/**
 * tag (node 63:2412 and siblings) under question 2.
 * Selected is the state drawn in Figma: grey-50 fill, secondary-text hairline
 * and a solid check. Deselecting drops the check and mutes the chip.
 */
export function MemberTag({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`flex h-9 items-center gap-1.5 rounded-full border px-3 py-[9px] text-[16px] leading-[1.15] font-medium transition-colors ${
        selected
          ? "border-ink-secondary bg-grey-50 text-ink"
          : "border-grey-200 bg-white text-ink-muted hover:border-ink-muted hover:text-ink-secondary"
      }`}
    >
      {selected ? (
        <CheckCircleIcon className="shrink-0 text-ink-secondary" />
      ) : (
        <span aria-hidden="true" className="size-4 shrink-0 rounded-full border-[1.5px] border-current" />
      )}
      <span className="ff-case">{label}</span>
    </button>
  );
}
