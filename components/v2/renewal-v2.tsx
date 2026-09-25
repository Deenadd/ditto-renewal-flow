"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CoverPicker } from "@/components/v2/cover-picker";
import { PolicySummary } from "@/components/policy-summary";
import { SelectField, TextField } from "@/components/ui/field";
import { VersionMenu } from "@/components/ui/version-menu";
import {
  AttentionIcon,
  CheckMarkIcon,
  ChevronDownIcon,
  CloseCircleIcon,
  InformationIcon,
  MarkerPinIcon,
  PlusIcon,
} from "@/components/icons";
import {
  formatRupees,
  policyPeriods,
  relationshipOptions,
} from "@/lib/renewal-data";
import {
  CURRENT_LAKHS,
  coverLayoutOptions,

  formatAddress,
  premiumFor,
  v2AddOnGroups,
  v2Address,
  v2DefaultAddOns,
  v2ExpiryBanner,
  v2Footer,
  v2Intro,
  v2JourneyTabs,
  v2LockedAddOns,
  v2Members,
  v2MoreAddOns,
  v2PickedAddOns,
  v2Sections,
  type CoverLayout,
  type V2AddOn,
  type V2Member,
} from "@/lib/v2-data";

/* ---------------------------------------------------------------------------
   Shared pieces
   --------------------------------------------------------------------------- */

/**
 * One numbered check. The heading and its copy sit in a column beside the
 * numeral; whatever the check is about sits below at the frame's own 32px
 * indent, a little left of the text.
 */
function Section({
  index,
  title,
  description,
  action,
  children,
}: {
  index: number;
  title: string;
  description: string;
  /** Sits at the trailing edge of the heading, level with its first line. */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-start gap-[15px]">
        <span
          aria-hidden="true"
          className="ff-figures mt-px grid size-6 shrink-0 place-items-center rounded-full bg-grey-100 text-[12px] leading-none font-medium text-ink-secondary"
        >
          {index}
        </span>
        {/* One grid so the control can follow the description in the DOM, and
            still sit beside the heading once the row is wide enough. */}
        <div className="grid min-w-0 flex-1 gap-x-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <h2 className="text-[20px] leading-[1.3] font-semibold tracking-[-0.2px] text-ink lg:col-start-1 lg:row-start-1">
            {title}
          </h2>
          <p className="mt-2 max-w-[560px] text-[16px] leading-[1.5] text-ink-secondary lg:col-span-2 lg:col-start-1 lg:row-start-2">
            {description}
          </p>
          {action ? (
            /* Nudged up 3px so a 32px control reads level with a 26px line. */
            <div className="mt-3 w-fit lg:col-start-2 lg:row-start-1 lg:-mt-[3px] lg:justify-self-end lg:self-start">
              {action}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-3.5 sm:ml-8">{children}</div>
    </section>
  );
}

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-grey-150 bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <p className="ff-case text-[11px] leading-none font-medium tracking-[0.55px] text-ink-muted uppercase">
      {children}
    </p>
  );
}

/** A tick that reads as locked, chosen, or open (nodes in the add-ons card). */
function Tick({ state }: { state: "locked" | "on" | "off" }) {
  if (state === "off") {
    return (
      <span
        aria-hidden="true"
        className="block size-[18px] shrink-0 rounded-[5px] border-[1.5px] border-grey-200 bg-white transition-colors duration-150"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] text-white transition-colors duration-150 ${
        state === "locked" ? "bg-primary" : "bg-success-solid-strong"
      }`}
    >
      <CheckMarkIcon size={12} />
    </span>
  );
}

/* ---------------------------------------------------------------------------
   1. Where you live
   --------------------------------------------------------------------------- */

type Address = { street: string; city: string; pinCode: string };

function AddressCheck({
  value,
  onChange,
}: {
  value: Address;
  onChange: (next: Address) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function open() {
    setDraft(value);
    setEditing(true);
  }

  return (
    <Card className="px-4 py-3.5">
      <div className="flex items-start justify-between gap-4">
        <MicroLabel>{v2Address.label}</MicroLabel>
        {editing ? null : (
          <button
            type="button"
            onClick={open}
            className="-my-1 -mr-1 rounded p-1 text-[14px] leading-none font-medium text-link underline-offset-4 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-4 flex flex-col gap-4 motion-safe:animate-reveal">
          <TextField
            label="Address"
            value={draft.street}
            onChange={(street) => setDraft((d) => ({ ...d, street }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Pin code"
              value={draft.pinCode}
              inputMode="numeric"
              maxLength={6}
              onChange={(pinCode) => setDraft((d) => ({ ...d, pinCode }))}
            />
            <TextField
              label="City"
              value={draft.city}
              onChange={(city) => setDraft((d) => ({ ...d, city }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onChange(draft);
                setEditing(false);
              }}
              className="ff-case flex h-9 items-center rounded-lg bg-primary px-3 text-[14px] leading-none font-medium text-ink-inverted transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.96]"
            >
              Save address
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="ff-case flex h-9 items-center rounded-lg border border-grey-200 px-3 text-[14px] leading-none font-medium text-ink transition-[background-color,transform] duration-150 hover:bg-grey-50 active:scale-[0.96]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-[15px] leading-[1.4] text-ink">
          <MarkerPinIcon className="shrink-0 text-ink-secondary" size={16} />
          {formatAddress(value)}
        </p>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------------------
   2. Who is covered
   --------------------------------------------------------------------------- */

const emptyDraft = { name: "", age: "", relation: "" };

function MemberCheck({
  members,
  onAdd,
  onRemove,
}: {
  members: V2Member[];
  onAdd: (member: V2Member) => void;
  onRemove: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const ready = draft.name.trim() !== "" && draft.age !== "" && draft.relation !== "";

  function submit() {
    if (!ready) return;
    onAdd({
      id: `added-${Date.now()}`,
      name: draft.name.trim(),
      age: Number(draft.age),
      relation: draft.relation,
    });
    setDraft(emptyDraft);
    setAdding(false);
  }

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <li key={member.id}>
            <Card className="group relative h-full px-4 py-3.5">
              <p className="flex items-center gap-1.5 text-[14px] leading-[1.4] font-medium text-ink">
                <span className="truncate">{member.name}</span>
                {member.proposer ? (
                  <span className="shrink-0 rounded-full bg-green-100 px-[7px] py-[3px] text-[11px] leading-none font-medium text-success">
                    Proposer
                  </span>
                ) : null}
              </p>
              <p className="ff-figures mt-1.5 text-[13px] leading-none text-ink-secondary">
                {member.age} &middot; {member.relation}
              </p>
              {member.proposer ? null : (
                <button
                  type="button"
                  onClick={() => onRemove(member.id)}
                  aria-label={`Remove ${member.name}`}
                  className="absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-lg text-ink-muted opacity-0 transition-[opacity,color] duration-150 hover:text-error-text focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <CloseCircleIcon size={16} />
                </button>
              )}
            </Card>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={() => setAdding((open) => !open)}
            aria-expanded={adding}
            className="flex h-full min-h-[67px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-grey-200 bg-grey-50 px-4 py-3.5 text-[15px] leading-none font-medium text-link transition-[background-color,transform] duration-150 hover:bg-grey-100 active:scale-[0.96]"
          >
            <PlusIcon className="shrink-0" size={16} />
            Add Person
          </button>
        </li>
      </ul>

      {adding ? (
        <Card className="mt-3 p-4 motion-safe:animate-reveal">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Full name"
              value={draft.name}
              placeholder="As on their ID"
              onChange={(name) => setDraft((d) => ({ ...d, name }))}
            />
            <TextField
              label="Age"
              value={draft.age}
              inputMode="numeric"
              maxLength={3}
              placeholder="In years"
              onChange={(age) =>
                setDraft((d) => ({ ...d, age: age.replace(/\D/g, "") }))
              }
            />
            <SelectField
              label="Relationship"
              value={draft.relation}
              options={relationshipOptions}
              placeholder="Select"
              onChange={(relation) => setDraft((d) => ({ ...d, relation }))}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={!ready}
              className={`ff-case flex h-9 items-center rounded-lg px-3 text-[14px] leading-none font-medium text-ink-inverted transition-[background-color,transform] duration-150 ${
                ready
                  ? "bg-primary hover:bg-primary-hover active:scale-[0.96]"
                  : "cursor-not-allowed bg-disabled"
              }`}
            >
              Add to policy
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="ff-case flex h-9 items-center rounded-lg border border-grey-200 px-3 text-[14px] leading-none font-medium text-ink transition-[background-color,transform] duration-150 hover:bg-grey-50 active:scale-[0.96]"
            >
              Cancel
            </button>
          </div>
        </Card>
      ) : null}
    </>
  );
}

/* ---------------------------------------------------------------------------
   4. Add-ons
   --------------------------------------------------------------------------- */

function AddOnRow({
  addOn,
  state,
  onToggle,
}: {
  addOn: V2AddOn;
  state: "locked" | "on" | "off";
  onToggle?: () => void;
}) {
  const body = (
    <>
      <Tick state={state} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[15px] leading-[1.4] font-semibold text-ink">
          {addOn.name}
          {state === "locked" ? (
            <InformationIcon className="shrink-0 text-grey-300" size={14} />
          ) : null}
        </span>
        <span className="mt-1.5 block max-w-[500px] text-[14px] leading-[1.45] text-ink-secondary">
          {addOn.description}
        </span>
        {addOn.highlight ? (
          <span className="mt-2.5 block w-fit max-w-full rounded-lg bg-green-100 px-2.5 py-1.5 text-[14px] leading-5 text-green-11">
            {addOn.highlight.before}
            {addOn.highlight.strong ? (
              <strong className="font-semibold">{addOn.highlight.strong}</strong>
            ) : null}
            {addOn.highlight.after}
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[13px] leading-none text-ink-muted">Premium</span>
        <span
          className={`ff-figures text-[17px] leading-none font-semibold ${
            state === "on" && addOn.wasPriceLabel ? "text-green-9" : "text-ink"
          }`}
        >
          {addOn.priceLabel}
        </span>
        {addOn.wasPriceLabel ? (
          <span className="ff-figures text-[14px] leading-none text-ink-muted line-through">
            {addOn.wasPriceLabel}
          </span>
        ) : null}
      </span>
    </>
  );

  if (!onToggle) {
    return <div className="flex items-start gap-3">{body}</div>;
  }

  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={state === "on"}
        onChange={onToggle}
        aria-label={`${addOn.name}, premium ${addOn.priceLabel}`}
        className="sr-only"
      />
      {body}
    </label>
  );
}

function AddOnGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-[15px] leading-none font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function AddOnCheck({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <Card className="flex flex-col gap-5 p-5">
      <AddOnGroup title={v2AddOnGroups.locked}>
        {v2LockedAddOns.map((addOn) => (
          <AddOnRow key={addOn.id} addOn={addOn} state="locked" />
        ))}
      </AddOnGroup>

      <hr className="border-grey-150" />

      <AddOnGroup title={v2AddOnGroups.picked}>
        {v2PickedAddOns.map((addOn) => (
          <AddOnRow
            key={addOn.id}
            addOn={addOn}
            state={selected.includes(addOn.id) ? "on" : "off"}
            onToggle={() => onToggle(addOn.id)}
          />
        ))}
      </AddOnGroup>

      <hr className="border-grey-150" />

      <section className="flex flex-col gap-5">
        <button
          type="button"
          aria-expanded={showMore}
          onClick={() => setShowMore((open) => !open)}
          className="flex items-center gap-2 text-[15px] leading-none font-semibold text-ink"
        >
          {v2AddOnGroups.more}
          <ChevronDownIcon
            className={`shrink-0 text-ink-secondary transition-transform duration-200 ease-strong ${
              showMore ? "rotate-180" : ""
            }`}
            size={18}
          />
          <span className="text-[14px] font-normal text-ink-muted">
            ({v2MoreAddOns.length})
          </span>
        </button>

        {showMore
          ? v2MoreAddOns.map((addOn) => (
              <div key={addOn.id} className="motion-safe:animate-reveal">
                <AddOnRow
                  addOn={addOn}
                  state={selected.includes(addOn.id) ? "on" : "off"}
                  onToggle={() => onToggle(addOn.id)}
                />
              </div>
            ))
          : null}
      </section>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
   5. Policy period
   --------------------------------------------------------------------------- */

function PeriodCheck({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Policy period</legend>
      {policyPeriods.map((period) => {
        const on = period.id === selected;
        return (
          <label
            key={period.id}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-card transition-colors duration-150 ${
              on ? "border-primary" : "border-grey-150 hover:border-grey-200"
            }`}
          >
            <input
              type="radio"
              name="policy-period"
              value={period.id}
              checked={on}
              onChange={() => onSelect(period.id)}
              aria-label={`${period.name}, premium ${period.priceLabel}`}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors duration-150 ${
                on ? "border-primary bg-primary" : "border-grey-200 bg-white"
              }`}
            >
              <span
                className={`block size-1.5 rounded-full bg-white transition-opacity duration-150 ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-[1.4] font-semibold text-ink">
                {period.name}
              </span>
              <span className="mt-1.5 block max-w-[560px] text-[14px] leading-[1.45] text-ink-secondary">
                {period.description}
              </span>
              {period.saving ? (
                <span className="mt-2.5 block w-fit max-w-full rounded-lg bg-green-100 px-2.5 py-1.5 text-[14px] leading-5 text-green-11">
                  Big Savings {period.saving.amount}! That&rsquo;s like getting{" "}
                  {period.saving.months} FREE.
                </span>
              ) : null}
            </span>

            <span className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-[13px] leading-none text-ink-muted">Premium</span>
              <span
                className={`ff-figures text-[17px] leading-none font-semibold ${
                  period.wasPriceLabel ? "text-green-9" : "text-ink"
                }`}
              >
                {period.priceLabel}
              </span>
              {period.wasPriceLabel ? (
                <span className="ff-figures text-[14px] leading-none text-ink-muted line-through">
                  {period.wasPriceLabel}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

/* ---------------------------------------------------------------------------
   The screen
   --------------------------------------------------------------------------- */

export type V2State = {
  address: Address;
  /** Members added this session, in the order they were added. */
  added: V2Member[];
  /** Ids from the policy the reviewer took off. */
  removed: string[];
  lakhs: number;
  addOns: string[];
  periodId: string;
  /** Which cover picker is on screen. A display choice, not an edit. */
  coverLayout: CoverLayout;
};

export const initialV2State: V2State = {
  address: {
    street: v2Address.street,
    city: v2Address.city,
    pinCode: v2Address.pinCode,
  },
  added: [],
  removed: [],
  lakhs: CURRENT_LAKHS,
  addOns: v2DefaultAddOns,
  periodId: policyPeriods[0].id,
  coverLayout: "slider",
};

/** What the reviewer touched, read the same way here and by the journey. */
export function v2Changes(state: V2State) {
  return {
    address:
      state.address.street !== v2Address.street ||
      state.address.city !== v2Address.city ||
      state.address.pinCode !== v2Address.pinCode,
    members: state.added.length > 0 || state.removed.length > 0,
    cover: state.lakhs !== CURRENT_LAKHS,
    addOns: state.addOns.join() !== v2DefaultAddOns.join(),
    period: state.periodId !== policyPeriods[0].id,
  };
}

/**
 * The V2 renewal screen (node 142:3114). State is held by the journey
 * controller so stepping back to this screen finds it as it was left.
 */
export function RenewalV2({
  value,
  onChange,
  onConfirm,
}: {
  value: V2State;
  onChange: (next: V2State) => void;
  onConfirm: () => void;
}) {
  const { address, added, removed, lakhs, addOns, periodId, coverLayout } = value;
  const set = (patch: Partial<V2State>) => onChange({ ...value, ...patch });

  const members = useMemo(
    () => [...v2Members.filter((m) => !removed.includes(m.id)), ...added],
    [added, removed],
  );

  const touched = v2Changes(value);
  const changed = Object.values(touched).some(Boolean);

  function clearAll() {
    /* Which picker is on screen is not one of the reviewer's changes. */
    onChange({ ...initialV2State, coverLayout });
  }

  const coverLabel =
    lakhs === CURRENT_LAKHS
      ? undefined
      : `₹${lakhs} Lakhs`;

  return (
    <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 lg:pt-[82px] xl:px-0">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
        <div className="min-w-0">
          <h1 className="text-[32px] leading-[1.2] font-semibold tracking-[-0.4px] text-ink">
            {v2Intro.title}
          </h1>
          <p className="mt-3 max-w-[600px] text-[16px] leading-[1.5] text-ink-secondary">
            {v2Intro.description}
          </p>

          {/* Where this screen sits in the renewal. Steps 2 and 3 are the
              existing summary and issuance flow, so they read as still to
              come rather than as tabs you can pick. */}
          <ol className="mt-8 grid grid-cols-3 gap-4">
            {v2JourneyTabs.map((tab, position) => {
              const current = position === 0;
              return (
                <li
                  key={tab.id}
                  aria-current={current ? "step" : undefined}
                  className={`flex items-center gap-2 border-b-2 pb-5 ${
                    current ? "border-primary" : "border-grey-150"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`ff-figures grid size-5 shrink-0 place-items-center rounded-full text-[11px] leading-none font-medium ${
                      current
                        ? "bg-primary text-ink-inverted"
                        : "bg-grey-150 text-ink-muted"
                    }`}
                  >
                    {position + 1}
                  </span>
                  <span
                    className={`truncate text-[15px] leading-none font-medium ${
                      current ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    {tab.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-orange-50 px-4 py-3.5 text-[15px] leading-[1.45] text-attention">
            <AttentionIcon className="mt-0.5 shrink-0" size={18} />
            <span>
              <strong className="font-semibold">{v2ExpiryBanner.lead}</strong>{" "}
              {v2ExpiryBanner.rest}
            </span>
          </p>

          <div className="mt-8">
            <Section index={1} {...v2Sections.address}>
              <AddressCheck value={address} onChange={(next) => set({ address: next })} />
            </Section>

            <Section index={2} {...v2Sections.members}>
              <MemberCheck
                members={members}
                onAdd={(member) => set({ added: [...added, member] })}
                onRemove={(id) =>
                  added.some((m) => m.id === id)
                    ? set({ added: added.filter((m) => m.id !== id) })
                    : set({ removed: [...removed, id] })
                }
              />
            </Section>

            <Section
              index={3}
              {...v2Sections.cover}
              action={
                <VersionMenu
                  label="Cover picker version"
                  value={coverLayout}
                  options={coverLayoutOptions}
                  onChange={(next) => set({ coverLayout: next as CoverLayout })}
                  align="end"
                />
              }
            >
              <CoverPicker
                layout={coverLayout}
                lakhs={lakhs}
                onChange={(next) => set({ lakhs: next })}
              />
            </Section>

            <Section index={4} {...v2Sections.addOns}>
              <AddOnCheck
                selected={addOns}
                onToggle={(id) =>
                  set({
                    addOns: addOns.includes(id)
                      ? addOns.filter((item) => item !== id)
                      : [...addOns, id],
                  })
                }
              />
            </Section>

            <Section index={5} {...v2Sections.period}>
              <PeriodCheck selected={periodId} onSelect={(next) => set({ periodId: next })} />
            </Section>
          </div>

          <div className="mt-8 border-t border-grey-150 pt-6">
            <div className="flex items-center justify-end gap-3">
              {changed ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="ff-case flex h-10 items-center justify-center rounded-lg border border-grey-200 bg-white px-3 text-[15px] leading-[1.15] font-medium text-ink shadow-card transition-[background-color,transform] duration-150 hover:bg-grey-50 active:scale-[0.96]"
                >
                  {v2Footer.clear}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onConfirm}
                className="ff-case flex h-10 min-w-[162px] items-center justify-center rounded-lg bg-primary px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.96]"
              >
                {v2Footer.confirm}
              </button>
            </div>
          </div>
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-[88px]">
            <PolicySummary
              variant="compact"
              pinCode={
                touched.address ? `${address.pinCode}, ${address.city}` : undefined
              }
              cover={coverLabel}
              premium={formatRupees(premiumFor(lakhs))}
              addedMember={added[0]?.relation}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

