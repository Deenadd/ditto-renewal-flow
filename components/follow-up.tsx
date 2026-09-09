"use client";

import type { ReactNode } from "react";

/**
 * Shared shell for the blocks that open under a question answered "No".
 * Indented to line up with the question text and revealed with a short slide
 * so the new content is easy to notice without being distracting.
 */
export function FollowUp({
  labelledBy,
  indent = "text",
  children,
}: {
  labelledBy?: string;
  /** "text" lines up with the question copy, "card" with the attached cards. */
  indent?: "text" | "card";
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`motion-safe:animate-reveal mt-6 ${
        indent === "card" ? "sm:pl-[31px]" : "sm:pl-[39px]"
      }`}
    >
      {children}
    </section>
  );
}

/** Heading and lead-in used by the household and bank blocks. */
export function FollowUpHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h3
        id={id}
        className="text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-ink"
      >
        {title}
      </h3>
      <p className="mt-2 max-w-[548px] text-[16px] leading-[1.5] text-ink-secondary">
        {description}
      </p>
    </div>
  );
}
