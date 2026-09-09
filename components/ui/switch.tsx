"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

/**
 * switch (node 70:3453). 34x20 track, 16px knob, ink fill when on and
 * grey-150 when off.
 */
export function Switch({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex h-5 w-[34px] shrink-0 items-center rounded-full p-0.5 transition-colors ${
        checked ? "bg-ink" : "bg-grey-150"
      }`}
    >
      <span
        className={`size-4 rounded-full bg-white shadow-[0_0_0_0.5px_white,0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-transform ${
          checked ? "translate-x-3.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
