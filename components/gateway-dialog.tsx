"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { kycGateway, policy } from "@/lib/renewal-data";

/** Redirect notice (node 121:7699). */
export function GatewayDialog({
  onClose,
  onContinue,
}: {
  onClose: () => void;
  onContinue: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/40"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gateway-title"
        tabIndex={-1}
        className="motion-safe:animate-reveal relative z-10 w-[420px] max-w-full rounded-2xl bg-white p-8 text-center shadow-[0_24px_64px_-12px_rgba(30,37,75,0.25)] outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-ink-muted transition-colors hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Image
          src="/brand/hdfc-ergo.png"
          alt={policy.insurer}
          width={320}
          height={320}
          className="mx-auto size-[88px] rounded-[10px] object-cover"
        />

        <h2
          id="gateway-title"
          className="mt-6 text-[24px] leading-[1.3] font-semibold text-ink"
        >
          {kycGateway.title}
        </h2>
        <p className="mx-auto mt-2 max-w-[320px] text-[16px] leading-[1.5] text-ink-secondary">
          {kycGateway.body}
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="ff-case mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-primary text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors hover:bg-primary-hover"
        >
          Continue
        </button>
        <p className="mt-3 text-[12px] leading-none text-ink-muted">
          {kycGateway.url}
        </p>
      </div>
    </div>
  );
}

