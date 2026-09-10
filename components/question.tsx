"use client";

import type { ReactNode } from "react";
import { YesNoGroup, type Answer } from "@/components/yes-no-group";

type Props = {
  id: string;
  index: number;
  title: string;
  description: string;
  value: Answer | null;
  onChange: (value: Answer) => void;
  children?: ReactNode;
};

/**
 * One numbered question row (nodes 63:2392, 63:2403, ...).
 * Badge and title sit on the baseline row with the Yes/No pair pushed to the
 * right edge of the column; the description and any attached card are indented
 * to line up under the title.
 */
export function Question({
  id,
  index,
  title,
  description,
  value,
  onChange,
  children,
}: Props) {
  const titleId = `${id}-title`;

  return (
    <li className="list-none">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-[15px]">
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-grey-150 text-[12px] leading-none font-semibold text-ink-secondary"
          >
            {index}
          </span>
          <h2
            id={titleId}
            className="text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-ink"
          >
            {title}
          </h2>
        </div>

        <YesNoGroup
          name={id}
          value={value}
          onChange={onChange}
          labelledBy={titleId}
        />
      </div>

      <p className="mt-2 max-w-[546px] pl-[39px] text-[16px] leading-[1.5] whitespace-pre-line text-ink-secondary">
        {description}
      </p>

      {children}
    </li>
  );
}
