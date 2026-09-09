"use client";

import { useState } from "react";

import { FollowUp } from "@/components/follow-up";
import { SelectField, TextField } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { YesNoGroup, type Answer } from "@/components/yes-no-group";
import {
  AttentionIcon,
  CheckCircleSolidIcon,
  CheckMarkIcon,
  ChevronDownIcon,
  InformationIcon,
  MarkerPinIcon,
} from "@/components/icons";
import {
  accountTypeOptions,
  bankNameOptions,
  coverOptions,
  lockedAddOns,
  nomineeCandidates,
  otherAddOnsCount,
  recommendedAddOns,
  relationshipOptions,
  type Highlight,
} from "@/lib/renewal-data";

/* -------------------------------------------------------------------------
   1. Where do you live? (node 76:6121)
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
          placeholder="6-digit PIN code"
          onChange={(value) => onPinCodeChange(value.replace(/\D/g, ""))}
          suffix={<MarkerPinIcon className="text-icon-muted" />}
        />
      </div>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   2. Add a member (nodes 76:6175, 76:6254)
   ------------------------------------------------------------------------- */

export type NewMember = {
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  hasConditions: Answer | null;
};

export function MemberFollowUp({
  member,
  onChange,
}: {
  member: NewMember;
  onChange: (patch: Partial<NewMember>) => void;
}) {
  return (
    <FollowUp labelledBy="member-heading">
      <hr className="mb-6 border-grey-150" />
      <h3 id="member-heading" className="sr-only">
        Add a family member to the policy
      </h3>

      <div className="flex flex-col gap-6">
        <TextField
          label="Full name (as on PAN or Aadhaar)"
          value={member.fullName}
          placeholder="Full name"
          onChange={(value) => onChange({ fullName: value })}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Relationship"
            value={member.relationship}
            options={relationshipOptions}
            placeholder="Select relationship"
            onChange={(value) => onChange({ relationship: value })}
          />
          <TextField
            label="Date of birth"
            type="date"
            value={member.dateOfBirth}
            onChange={(value) => onChange({ dateOfBirth: value })}
          />
        </div>

        <div className="flex items-center justify-between gap-6">
          <p
            id="member-conditions-label"
            className="text-[14px] leading-[1.15] text-ink-secondary"
          >
            Does this member have any existing medical conditions?
          </p>
          <YesNoGroup
            name="member-conditions"
            value={member.hasConditions}
            onChange={(value) => onChange({ hasConditions: value })}
            labelledBy="member-conditions-label"
          />
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-grey-100 p-2.5 text-[14px] leading-[1.4] tracking-[0.035px] text-ink">
          <InformationIcon className="mt-0.5 shrink-0 text-ink" />
          <span>
            Removing someone is still being confirmed with HDFC ERGO, so an
            advisor handles it for now -{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold text-link underline-offset-4 hover:underline"
            >
              request a callback.
            </a>
          </span>
        </p>
      </div>
    </FollowUp>
  );
}

/* -------------------------------------------------------------------------
   3. Anything come up this year? (node 76:6125)
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
   4. Pick a cover amount (node 76:6127)
   ------------------------------------------------------------------------- */

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
          const isSelected = selected === option.id;

          return (
            <label
              key={option.id}
              className={`relative flex min-h-[129px] cursor-pointer flex-col bg-white p-[15px] transition-colors ${
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

              {isSelected ? (
                <CheckCircleSolidIcon className="absolute top-1.5 right-2.5 text-focus" />
              ) : null}

              <span className="ff-figures text-[24px] leading-[1.3] font-semibold text-cover-ink">
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
   5. Bank details (node 76:6158)
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
      <h3 id="bank-heading" className="sr-only">
        Update the account that receives refunds
      </h3>
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
   6. Choose a nominee (node 76:6205)
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
            className={index > 0 ? "mt-4 border-t border-grey-150 pt-4" : undefined}
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

/* -------------------------------------------------------------------------
   7. Add-ons (nodes 76:6225, 76:6246)
   ------------------------------------------------------------------------- */

function CountBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ff-case flex h-[15px] items-center rounded bg-badge-blue px-[3px] text-[10px] leading-[0.9] font-semibold tracking-[0.5px] text-white">
      {children}
    </span>
  );
}

function HighlightNote({ highlight }: { highlight: Highlight }) {
  return (
    <span className="block w-fit max-w-full self-start rounded-md bg-green-100 p-2 text-[13px] leading-[1.4] tracking-[0.0325px] text-green-11">
      {highlight.before}
      {highlight.strong ? (
        <span className="font-semibold">{highlight.strong}</span>
      ) : null}
      {highlight.after}
    </span>
  );
}

function Checkbox({ state }: { state: "locked" | "on" | "off" }) {
  if (state === "off") {
    return (
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-[1.5px] border-grey-200 bg-white"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded p-0.5 text-white ${
        state === "locked" ? "bg-ink" : "bg-success-solid-strong"
      }`}
    >
      <CheckMarkIcon />
    </span>
  );
}

function PremiumColumn({
  price,
  was,
}: {
  price: string;
  was?: string;
}) {
  return (
    <span className="ff-figures flex w-[78px] shrink-0 flex-col gap-1 text-right">
      <span className="text-[12px] leading-none font-medium tracking-[0.18px] text-ink-muted">
        Premium
      </span>
      <span
        className={`text-[16px] leading-none font-medium tracking-[0.16px] ${
          was ? "text-green-9" : "text-ink"
        }`}
      >
        {price}
      </span>
      {was ? (
        <span className="text-[12px] leading-none font-medium tracking-[0.18px] text-ink-muted line-through">
          {was}
        </span>
      ) : null}
    </span>
  );
}

export type AddOnState = {
  selected: string[];
  terms: Record<string, string>;
};

export function AddOnsFollowUp({
  state,
  onToggle,
  onTermChange,
}: {
  state: AddOnState;
  onToggle: (id: string) => void;
  onTermChange: (id: string, term: string) => void;
}) {
  const [showOther, setShowOther] = useState(false);

  return (
    <FollowUp indent="card" labelledBy="add-ons-heading">
      <h3 id="add-ons-heading" className="sr-only">
        Add-ons on your policy
      </h3>

      <div className="rounded-xl border border-grey-150 bg-white p-5 shadow-card">
        {/* Already on the policy */}
        <h4 className="text-[13px] leading-none font-semibold tracking-[0.0325px] text-ink">
          Previously Selected Add ons ({lockedAddOns.length})
        </h4>
        <ul className="mt-5 flex flex-col gap-5">
          {lockedAddOns.map((addOn) => (
            <li
              key={addOn.name}
              className="flex items-start justify-between gap-4"
            >
              <span className="flex min-w-0 items-start gap-3">
                <Checkbox state="locked" />
                <span className="flex items-center gap-1.5 text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                  {addOn.name}
                  <AttentionIcon className="shrink-0 text-ink-muted" />
                </span>
              </span>
              <span className="ff-figures w-[78px] shrink-0 text-right text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                {addOn.price}
              </span>
            </li>
          ))}
        </ul>

        <hr className="my-6 border-grey-150" />

        {/* Recommended */}
        <div className="flex items-center gap-3">
          <h4 className="text-[13px] leading-none font-semibold tracking-[0.0325px] text-ink">
            Recommended Add ons
          </h4>
          <CountBadge>
            {state.selected.length}/{recommendedAddOns.length}
          </CountBadge>
        </div>

        <ul className="mt-5 flex flex-col gap-5">
          {recommendedAddOns.map((addOn) => {
            const isSelected = state.selected.includes(addOn.id);

            return (
              <li key={addOn.id} className="flex items-start justify-between gap-4">
                <span className="flex min-w-0 flex-1 items-start gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => onToggle(addOn.id)}
                    className="rounded"
                  >
                    <Checkbox state={isSelected ? "on" : "off"} />
                    <span className="sr-only">{addOn.name}</span>
                  </button>

                  <span className="flex min-w-0 flex-1 flex-col gap-3">
                    <span className="flex flex-col gap-2">
                      <span className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                        {addOn.name}
                      </span>
                      <span className="max-w-[411px] text-[13px] leading-[1.5] text-ink-secondary">
                        {addOn.description}
                      </span>

                      {addOn.terms ? (
                        <span
                          role="radiogroup"
                          aria-label={`${addOn.name} term`}
                          className="flex items-center gap-3"
                        >
                          {addOn.terms.map((term) => {
                            const active =
                              (state.terms[addOn.id] ?? addOn.terms?.[0]) === term;

                            return (
                              <label
                                key={term}
                                className="flex cursor-pointer items-center gap-2"
                              >
                                <input
                                  type="radio"
                                  name={`${addOn.id}-term`}
                                  checked={active}
                                  onChange={() => onTermChange(addOn.id, term)}
                                  className="peer sr-only"
                                />
                                <span
                                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                                    active
                                      ? "border-focus bg-focus"
                                      : "border-grey-200 bg-white"
                                  }`}
                                >
                                  <span
                                    className={`size-1.5 rounded-full ${active ? "bg-white" : "bg-transparent"}`}
                                  />
                                </span>
                                <span className="text-[14px] leading-none font-medium text-ink">
                                  {term}
                                </span>
                              </label>
                            );
                          })}
                        </span>
                      ) : null}
                    </span>

                    <HighlightNote highlight={addOn.highlight} />
                  </span>
                </span>

                <PremiumColumn price={addOn.priceLabel} was={addOn.wasPriceLabel} />
              </li>
            );
          })}
        </ul>
      </div>

      {/* The rest of the catalogue */}
      <div className="mt-4 rounded-xl border border-slate-6 bg-white shadow-card">
        <button
          type="button"
          aria-expanded={showOther}
          onClick={() => setShowOther((open) => !open)}
          className="flex w-full items-center justify-between gap-4 p-[19px]"
        >
          <span className="flex items-center gap-2">
            <span className="text-[14px] leading-none font-semibold tracking-[-0.035px] text-ink">
              Other Add-ons
            </span>
            <CountBadge>0/{otherAddOnsCount}</CountBadge>
          </span>
          <ChevronDownIcon
            className={`shrink-0 text-ink transition-transform ${showOther ? "rotate-180" : ""}`}
          />
        </button>
        {showOther ? (
          <p className="px-[19px] pb-[19px] text-[13px] leading-[1.5] text-ink-secondary">
            {otherAddOnsCount} more add-ons are available on this plan. An
            advisor can walk you through them,{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold text-link underline-offset-4 hover:underline"
            >
              request a callback.
            </a>
          </p>
        ) : null}
      </div>
    </FollowUp>
  );
}
