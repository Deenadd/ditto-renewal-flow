"use client";

import { useId, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";

const control =
  "flex h-10 w-full items-center gap-2 rounded-lg border border-grey-200 bg-white px-3 text-[14px] leading-[1.15] font-semibold text-ink transition-shadow focus-within:border-2 focus-within:border-focus focus-within:px-[11px] focus-within:shadow-[0_0_0_2px_var(--color-focus-ring)]";

function Label({ htmlFor, size, children }: { htmlFor: string; size: "sm" | "md"; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        size === "md"
          ? "text-[16px] leading-none tracking-[0.04px] text-ink-secondary"
          : "text-[14px] leading-none tracking-[0.035px] text-ink-secondary"
      }
    >
      {children}
    </label>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: ReactNode;
  inputMode?: "text" | "numeric";
  maxLength?: number;
  labelSize?: "sm" | "md";
  gap?: "sm" | "md";
};

/** input (nodes 70:3336, 70:3426). */
export function TextField({
  label,
  value,
  onChange,
  suffix,
  inputMode = "text",
  maxLength,
  labelSize = "sm",
  gap = "sm",
}: TextFieldProps) {
  const id = useId();

  return (
    <div className={`flex flex-col ${gap === "md" ? "gap-4" : "gap-3"}`}>
      <Label htmlFor={id} size={labelSize}>
        {label}
      </Label>
      <span className={control}>
        <input
          id={id}
          value={value}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className="ff-case min-w-0 flex-1 bg-transparent outline-none"
        />
        {suffix ? <span className="flex shrink-0 items-center">{suffix}</span> : null}
      </span>
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

/** select (nodes 70:3434, 70:3437). */
export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} size="sm">
        {label}
      </Label>
      <span className={`${control} relative`}>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="ff-case min-w-0 flex-1 appearance-none bg-transparent pr-5 outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 shrink-0 text-ink" />
      </span>
    </div>
  );
}
