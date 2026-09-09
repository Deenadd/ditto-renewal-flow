"use client";

import { Chip, type ChipState } from "@/components/chip";
import { FollowUp, FollowUpHeading } from "@/components/follow-up";
import { SelectField, TextField } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  CircleCheckIcon,
  MarkerPinIcon,
  ShieldCheckIcon,
  ShieldSparkIcon,
} from "@/components/icons";
import {
  accountTypeOptions,
  bankNameOptions,
  coverOptions,
  householdOptions,
  nomineeCandidates,
  type CoverOption,
} from "@/lib/renewal-data";

/* -------------------------------------------------------------------------
   1. Where do you live? (node 70:3333)
   ------------------------------------------------------------------------- */

export function LocationFollowUp({
  pinCode,
  onPinCodeChange,
}: {
  pinCode: string;
  onPinCodeChange: (value: string) => void;
}) {
  return (
    <FollowUp>
      <div className="max-w-[332px]">
        <TextField
          label="Where do you live?"
          labelSize="md"
          gap="md"
          value={pinCode}
          inputMode="numeric"
          maxLength={6}
          onChange={(value) => onPinCodeChange(value.replace(/\D/g, ""))}
          suffix={<MarkerPinIcon className="text-icon-muted" />}
        />
      </div>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   2. Who's changed? (nodes 70:3252, 70:3337, 70:3343)
   ------------------------------------------------------------------------- */

export type Household = {
  selected: string[];
  counts: Record<string, number>;
};

export function HouseholdFollowUp({
  household,
  onToggle,
  onCountChange,
}: {
  household: Household;
  onToggle: (id: string) => void;
  onCountChange: (id: string, next: number) => void;
}) {
  return (
    <FollowUp labelledBy="household-heading">
      <hr className="mb-6 border-grey-150" />
      <FollowUpHeading
        id="household-heading"
        title="Who's changed?"
        description="Remove those who don't need cover or add new family members."
      />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {householdOptions.map((option) => {
          const selected = household.selected.includes(option.id);
          const state: ChipState = !selected
            ? "off"
            : option.onPolicy
              ? "on"
              : "added";

          return (
            <Chip
              key={option.id}
              label={option.label}
              state={state}
              onToggle={() => onToggle(option.id)}
              counter={
                option.counted && selected
                  ? {
                      value: household.counts[option.id] ?? 1,
                      min: 1,
                      max: 9,
                      label: option.label,
                      onChange: (next) => onCountChange(option.id, next),
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   3. Anything come up this year? (node 70:3377)
   ------------------------------------------------------------------------- */

export function ConditionsFollowUp() {
  return (
    <FollowUp indent="card">
      <p className="text-[16px] leading-normal tracking-[0.16px] text-ink-secondary">
        Tell us if anything has come up in the last year,{" "}
        <a
          href="mailto:support@example.com"
          className="text-link underline-offset-4 hover:underline"
        >
          Contact advisor
        </a>
      </p>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   4. Pick a cover amount (node 70:3379)
   ------------------------------------------------------------------------- */

const tierMark = {
  blue: CircleCheckIcon,
  green: ShieldCheckIcon,
  purple: ShieldSparkIcon,
};

const tierColor: Record<CoverOption["tone"], string> = {
  blue: "text-tier-blue",
  green: "text-tier-green",
  purple: "text-tier-purple",
};

const tierBadge: Record<CoverOption["tone"], string> = {
  blue: "bg-tier-blue-bg text-tier-blue",
  green: "bg-tier-green-bg text-tier-green",
  purple: "bg-tier-purple-bg text-tier-purple",
};

export function CoverFollowUp({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <FollowUp indent="card" labelledBy="cover-heading">
      <h3 id="cover-heading" className="sr-only">
        Choose a new cover amount
      </h3>
      <div
        role="radiogroup"
        aria-labelledby="cover-heading"
        className="grid gap-3 sm:grid-cols-3"
      >
        {coverOptions.map((option) => {
          const Mark = tierMark[option.tone];
          const isSelected = selected === option.id;

          return (
            <label
              key={option.id}
              className={`relative flex min-h-[173px] cursor-pointer flex-col overflow-hidden bg-white p-[15px] transition-colors ${
                isSelected
                  ? "rounded-[10px] border-[1.5px] border-tier-blue"
                  : "rounded-xl border border-grey-150 shadow-card hover:border-grey-200"
              }`}
            >
              <input
                type="radio"
                name="cover-amount"
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="peer sr-only"
              />
              <span className="pointer-events-none absolute inset-0 rounded-xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />

              <Mark className={`shrink-0 ${tierColor[option.tone]}`} />

              {isSelected || option.badge ? (
                <span
                  className={`ff-case absolute top-[5px] right-[7px] rounded-3xl px-1.5 py-0.5 text-[8px] leading-none font-medium tracking-[0.2px] uppercase ${
                    isSelected ? tierBadge.blue : tierBadge[option.tone]
                  }`}
                >
                  {isSelected ? "Selected" : option.badge}
                </span>
              ) : null}

              <span className="ff-figures mt-5 text-[24px] leading-[1.3] font-semibold text-cover-ink">
                {option.amount}
              </span>
              <span className="mt-2 text-[14px] leading-none font-medium tracking-[-0.14px] text-cover-title">
                {option.title}
              </span>
              <span className="mt-1.5 text-[12px] leading-[1.6] text-cover-body">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   5. Bank details (nodes 70:3340, 70:3421)
   ------------------------------------------------------------------------- */

export type BankForm = {
  accountNumber: string;
  ifsc: string;
  bankName: string;
  accountType: string;
};

export function BankFollowUp({
  form,
  onChange,
}: {
  form: BankForm;
  onChange: (patch: Partial<BankForm>) => void;
}) {
  return (
    <FollowUp labelledBy="bank-heading">
      <FollowUpHeading
        id="bank-heading"
        title="Bank Details"
        description="Tell us which account should receive refunds and claim payouts."
      />
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Account number"
            value={form.accountNumber}
            onChange={(value) => onChange({ accountNumber: value })}
          />
          <TextField
            label="IFSC code"
            value={form.ifsc}
            onChange={(value) => onChange({ ifsc: value.toUpperCase() })}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Bank name"
            value={form.bankName}
            options={bankNameOptions}
            onChange={(value) => onChange({ bankName: value })}
          />
          <SelectField
            label="Account type"
            value={form.accountType}
            options={accountTypeOptions}
            onChange={(value) => onChange({ accountType: value })}
          />
        </div>
      </div>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   6. Choose a nominee (node 70:3448)
   ------------------------------------------------------------------------- */

export function NomineeFollowUp({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <FollowUp labelledBy="nominee-heading">
      <h3 id="nominee-heading" className="sr-only">
        Choose who should be your nominee
      </h3>
      <ul className="flex flex-col">
        {nomineeCandidates.map((candidate, index) => (
          <li
            key={candidate.id}
            className={
              index > 0 ? "mt-4 border-t border-grey-150 pt-4" : undefined
            }
          >
            <div className="flex items-center justify-between gap-4">
              <p className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
                {candidate.name}{" "}
                <span className="text-[14px] leading-none font-normal tracking-[-0.07px] text-ink-muted">
                  ({candidate.relation})
                </span>
              </p>
              <Switch
                checked={selected.includes(candidate.id)}
                onChange={() => onToggle(candidate.id)}
                label={`${candidate.name}, ${candidate.relation}, as nominee`}
              />
            </div>
          </li>
        ))}
      </ul>
    </FollowUp>
  );
}
