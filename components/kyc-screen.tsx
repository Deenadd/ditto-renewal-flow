"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeftIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { PolicyBar } from "@/components/policy-bar";
import { TextField } from "@/components/ui/field";
import {
  kycGateway,
  kycHelp,
  kycRecord,
  kycSteps,
  kycUploadBanner,
  policy,
} from "@/lib/renewal-data";

type KycForm = { pan: string; dateOfBirth: string; phone: string };

const emptyForm: KycForm = { pan: "", dateOfBirth: "", phone: "" };

function HelpCards() {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kyc/sparkles.png"
          alt=""
          width={360}
          height={157}
          className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
        />
        <div className="relative z-10">
          <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
            {kycHelp.proposer.title}
          </h2>
          <p className="mt-2 max-w-[212px] text-[13px] leading-[1.5] text-ink-secondary">
            {kycHelp.proposer.body}
          </p>

          <hr className="my-5 border-grey-150" />

          <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
            {kycHelp.proposer.stepsTitle}
          </h2>
          <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-secondary">
            {kycHelp.proposer.stepsLead}
          </p>
          <ol className="mt-4 flex flex-col gap-4">
            {kycSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center rounded-full bg-grey-150 text-[11px] leading-none font-semibold text-ink-secondary"
                >
                  {index + 1}
                </span>
                <span className="text-[13px] leading-none text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
        <div className="relative z-10 flex flex-col gap-2">
          <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
            {kycHelp.delay.title}
          </h2>
          <p className="max-w-[273px] text-[13px] leading-[1.5] text-ink-secondary">
            {kycHelp.delay.body}
          </p>
          <a
            href={`mailto:${kycHelp.delay.email}`}
            className="mt-2 flex w-fit items-center gap-2 text-[14px] leading-none font-medium text-focus underline-offset-4 hover:underline"
          >
            <MailIcon className="shrink-0" />
            {kycHelp.delay.email}
          </a>
        </div>

        <hr className="relative z-10 my-5 border-grey-150" />

        <div className="relative z-10 flex flex-col gap-2">
          <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
            {kycHelp.failed.title}
          </h2>
          <p className="text-[13px] leading-[1.5] text-ink-secondary">
            {kycHelp.failed.body}
          </p>
          <p className="mt-3 text-[14px] leading-[1.4] text-ink-secondary">
            {kycHelp.failed.label}
          </p>
          <a
            href={`tel:${kycHelp.failed.phone.replace(/\s|-/g, "")}`}
            className="flex w-fit items-center gap-2 text-[14px] leading-none font-medium text-focus underline-offset-4 hover:underline"
          >
            <PhoneIcon className="shrink-0" />
            {kycHelp.failed.phone}
          </a>
          <a
            href={`mailto:${kycHelp.failed.email}`}
            className="flex w-fit items-center gap-2 text-[14px] leading-none font-medium text-focus underline-offset-4 hover:underline"
          >
            <MailIcon className="shrink-0" />
            {kycHelp.failed.email}
          </a>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/anchor/mascot.png"
          alt=""
          width={329}
          height={298}
          className="pointer-events-none absolute right-1 bottom-0 z-0 w-[162px] select-none"
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-[14px] leading-none text-ink-secondary">{label}</dt>
      <dd className="ff-figures text-[16px] leading-[1.5] font-medium text-ink">
        {children}
      </dd>
    </div>
  );
}

/** Redirect notice (node 121:7699). */
function GatewayDialog({
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

/**
 * Proposer KYC (nodes 121:7357, 121:7520, 121:7699).
 * Look up the CKYC record from a PAN and date of birth, check what comes back,
 * then hand off to the insurer's gateway.
 */
export function KycScreen({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState<KycForm>(emptyForm);
  const [fetched, setFetched] = useState(false);
  const [gateway, setGateway] = useState(false);

  /* The values are placeholders in this prototype, so the button only checks
     that the three fields have been filled in, not that they are well formed. */
  const ready =
    form.pan.trim().length > 0 &&
    form.dateOfBirth.length > 0 &&
    form.phone.trim().length > 0;

  return (
    <>
      <div className="mx-auto max-w-[1112px] px-6 xl:px-0">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
          <div />
          <div className="hidden lg:block">
            <PolicyBar />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 xl:px-0">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
          <div className="min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-[14px] leading-none font-medium text-ink-secondary transition-colors hover:text-ink"
            >
              <ArrowLeftIcon className="shrink-0" />
              Back
            </button>

            <h1 className="text-[32px] leading-[1.1] font-semibold text-ink">
              Complete proposer KYC
            </h1>
            <p className="mt-3 text-[16px] leading-[1.4] text-ink-secondary">
              IRDAI mandated KYC of proposer to purchase health insurance policy.
            </p>

            {/* Upload route for people without the cards to hand */}
            <div className="mt-5 flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-blue-light p-4">
              <div className="flex w-[412px] max-w-full shrink-0 flex-col gap-2">
                <p className="text-[18px] leading-[1.4] font-semibold text-ink">
                  {kycUploadBanner.title}
                </p>
                <p className="text-[14px] leading-[1.4] text-ink-secondary">
                  {kycUploadBanner.body}{" "}
                  <a
                    href="#upload"
                    className="font-semibold text-focus underline-offset-4 hover:underline"
                  >
                    {kycUploadBanner.link}
                  </a>
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kyc/documents.png"
                alt=""
                width={252}
                height={120}
                className="pointer-events-none -my-4 -mr-4 hidden h-[120px] w-auto shrink-0 select-none sm:block"
              />
            </div>

            {/* Look-up form */}
            <div className="mt-4 rounded-xl border border-grey-150 bg-white p-5 shadow-card">
              <h2 className="text-[18px] leading-[1.4] font-semibold text-ink">
                PAN KYC (CKYC)
              </h2>
              <p className="mt-2 max-w-[324px] text-[14px] leading-[1.4] text-ink-secondary">
                Please provide the proposer&rsquo;s PAN and Date of Birth to
                verify if a KYC has been already done.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <TextField
                  label="PAN card number"
                  value={form.pan}
                  placeholder="PAN number"
                  maxLength={10}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      pan: value.toUpperCase(),
                    }))
                  }
                />
                <TextField
                  label="Date of birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, dateOfBirth: value }))
                  }
                />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Phone number"
                  value={form.phone}
                  placeholder="Mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  prefix="+91"
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      phone: value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
            </div>

            {/* What the lookup returned */}
            {fetched ? (
              <div className="motion-safe:animate-reveal-blur mt-4 rounded-xl border border-grey-150 bg-white p-5 shadow-card">
                <h2 className="text-[18px] leading-[1.4] font-semibold text-ink">
                  Verify KYC Details
                </h2>
                <dl className="mt-5 grid gap-6 sm:grid-cols-2">
                  <Field label="User Info">{kycRecord.name}</Field>
                  <Field label="PAN Details">
                    {kycRecord.pan}
                    <br />
                    {kycRecord.dateOfBirth}
                  </Field>
                  <Field label="Permanent Address">
                    {kycRecord.permanentAddress.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </Field>
                  <Field label="Current Address">
                    {kycRecord.currentAddress.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </Field>
                </dl>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-grey-150 pt-6">
              {fetched ? (
                <>
                  {/* A mismatch is what sends the proposer to the insurer's
                      own gateway to finish KYC there. */}
                  <button
                    type="button"
                    onClick={() => setGateway(true)}
                    className="ff-case flex h-10 items-center justify-center rounded-lg border border-grey-200 bg-white px-3 text-[15px] leading-[1.15] font-medium text-ink shadow-card transition-colors hover:bg-grey-50"
                  >
                    Details don&rsquo;t match
                  </button>
                  <button
                    type="button"
                    onClick={onDone}
                    className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors hover:bg-primary-hover"
                  >
                    Verify &amp; Continue
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={!ready}
                  onClick={() => setFetched(true)}
                  className={`ff-case flex h-10 min-w-[158px] items-center justify-center rounded-lg px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors ${
                    ready
                      ? "cursor-pointer bg-primary hover:bg-primary-hover"
                      : "cursor-not-allowed bg-disabled"
                  }`}
                >
                  Fetch KYC details
                </button>
              )}
            </div>
          </div>

          <aside className="mt-12 lg:mt-0">
            <div className="lg:sticky lg:top-[88px]">
              <HelpCards />
            </div>
          </aside>
        </div>
      </main>

      {gateway ? (
        <GatewayDialog onClose={() => setGateway(false)} onContinue={onDone} />
      ) : null}
    </>
  );
}
