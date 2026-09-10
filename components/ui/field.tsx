"use client";

import { useId, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";

const control =
  "flex w-full items-center gap-2 rounded-lg border border-grey-200 bg-white px-3 text-[14px] leading-[1.15] font-semibold text-ink transition-shadow focus-within:border-2 focus-within:border-focus focus-within:px-[11px] focus-within:shadow-[0_0_0_2px_var(--color-focus-ring)]";

function Label({
  htmlFor,
  size,
  required,
  optional,
  children,
}: {
  htmlFor: string;
  size: "sm" | "md";
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}) {
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
      {required ? <span className="ml-1 text-error-text">*</span> : null}
      {optional ? <span className="ml-1 text-ink-muted">(optional)</span> : null}
    </label>
  );
}

function Hints({ left, right }: { left?: string; right?: string }) {
  if (!left && !right) return null;
  return (
    <p className="flex items-center justify-between gap-4 text-[13px] leading-none text-ink-secondary">
      <span>{left}</span>
      <span className="ff-figures">{right}</span>
    </p>
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
  placeholder?: string;
  type?: "text" | "date";
  /** Fixed leading text, such as the +91 on a phone number. */
  prefix?: string;
  required?: boolean;
  optional?: boolean;
  /** Renders a textarea rather than a single line. */
  multiline?: boolean;
  hint?: string;
  hintRight?: string;
};

/** input (nodes 70:3336, 70:3426, 122:8373). */
export function TextField({
  label,
  value,
  onChange,
  suffix,
  inputMode = "text",
  maxLength,
  labelSize = "sm",
  gap = "sm",
  placeholder,
  type = "text",
  prefix,
  required,
  optional,
  multiline,
  hint,
  hintRight,
}: TextFieldProps) {
  const id = useId();

  return (
    <div className={`flex flex-col ${gap === "md" ? "gap-4" : "gap-3"}`}>
      <Label htmlFor={id} size={labelSize} required={required} optional={optional}>
        {label}
      </Label>

      {multiline ? (
        <span className={`${control} h-auto py-3`}>
          <textarea
            id={id}
            value={value}
            rows={3}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="ff-case min-w-0 flex-1 resize-y bg-transparent font-medium outline-none placeholder:font-normal placeholder:text-ink-muted"
          />
        </span>
      ) : (
        <span className={`${control} h-10`}>
          {prefix ? (
            <span className="-my-3 flex h-10 shrink-0 items-center border-r border-grey-200 pr-3 text-ink-secondary">
              {prefix}
            </span>
          ) : null}
          <input
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            inputMode={inputMode}
            maxLength={maxLength}
            onChange={(event) => onChange(event.target.value)}
            className="ff-case min-w-0 flex-1 bg-transparent font-medium outline-none placeholder:font-normal placeholder:text-ink-muted"
          />
          {suffix ? <span className="flex shrink-0 items-center">{suffix}</span> : null}
        </span>
      )}

      <Hints left={hint} right={hintRight} />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

/** select (nodes 70:3434, 122:8373). */
export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
}: SelectFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} size="sm" required={required}>
        {label}
      </Label>
      <span className={`${control} relative h-10`}>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`ff-case min-w-0 flex-1 appearance-none bg-transparent pr-5 outline-none ${
            value === "" ? "text-ink-muted" : ""
          }`}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
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
