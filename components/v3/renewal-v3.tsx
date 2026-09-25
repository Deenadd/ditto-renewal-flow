"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  CheckMarkIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseCircleIcon,
  PlusIcon,
} from "@/components/icons";
import { SelectField, TextField } from "@/components/ui/field";
import { CoverDecision } from "@/components/v3/cover-decision";
import { MobileBar, Receipt } from "@/components/v3/receipt";
import { relationshipOptions } from "@/lib/renewal-data";
import {
  initialV3State,
  keptAddOns,
  moreAddOns,
  nextStepsFor,
  priceV3,
  rupees,
  suggestedAddOns,
  termSaving,
  termTotal,
  terms,
  v3Changes,
  v3Intro,
  v3Members,
  type Address,
  type V3AddOn,
  type V3Member,
  type V3State,
} from "@/lib/v3-data";

/* ---------------------------------------------------------------------------
   Shared pieces
   --------------------------------------------------------------------------- */

const list = new Intl.ListFormat("en-IN", { style: "long", type: "conjunction" });

const quietButton =
  "flex h-9 touch-manipulation items-center rounded-lg px-3 text-[14px] leading-none font-medium text-primary-strong transition-[background-color,transform] duration-150 select-none hover:bg-blue-light active:scale-[0.96]";

const solidButton =
  "flex h-10 touch-manipulation items-center justify-center rounded-lg bg-primary-strong px-4 text-[15px] leading-none font-medium text-white transition-[background-color,transform] duration-150 select-none hover:bg-primary-strong-hover active:scale-[0.96] disabled:cursor-not-allowed disabled:bg-disabled disabled:active:scale-100";

const outlineButton =
  "flex h-10 touch-manipulation items-center justify-center rounded-lg border border-grey-200 bg-white px-4 text-[15px] leading-none font-medium text-ink transition-[background-color,transform] duration-150 select-none hover:bg-grey-50 active:scale-[0.96]";

function SectionHeading({
  id,
  title,
  lead,
}: {
  id: string;
  title: string;
  lead: string;
}) {
  return (
    <div className="mb-4">
      <h2
        id={id}
        className="text-[18px] leading-[1.3] font-semibold tracking-[-0.2px] text-balance text-ink"
      >
        {title}
      </h2>
      <p className="mt-1.5 max-w-[560px] text-[15px] leading-[1.5] text-pretty text-ink-secondary">
        {lead}
      </p>
    </div>
  );
}

/** A line flagged under an edited row, saying what the edit sets in motion. */
function Consequence({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-[13px] leading-[1.45] text-pretty text-attention">
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------------------
   What you're renewing
   --------------------------------------------------------------------------- */

function Row({
  label,
  changed,
  children,
}: {
  label: string;
  changed?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-x-6 gap-y-1.5 px-5 py-4 sm:grid-cols-[136px_minmax(0,1fr)]">
      <dt className="flex items-center gap-2 pt-px text-[13px] leading-[1.5] font-medium text-ink-secondary">
        {label}
        {changed ? (
          <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[11px] leading-none font-medium text-attention">
            Changed
          </span>
        ) : null}
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function AddressRow({
  value,
  changed,
  onChange,
}: {
  value: Address;
  changed: boolean;
  onChange: (next: Address) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <Row label="Where you live" changed={changed}>
      {editing ? (
        <div className="flex flex-col gap-4 pt-1 motion-safe:animate-reveal">
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
              onChange={(pinCode) =>
                setDraft((d) => ({ ...d, pinCode: pinCode.replace(/\D/g, "") }))
              }
            />
            <TextField
              label="City"
              value={draft.city}
              onChange={(city) => setDraft((d) => ({ ...d, city }))}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={solidButton}
              onClick={() => {
                onChange(draft);
                setEditing(false);
              }}
            >
              Save address
            </button>
            <button
              type="button"
              className={outlineButton}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[15px] leading-[1.5] text-pretty text-ink">
              {value.street}, {value.city} {value.pinCode}
            </p>
            {changed ? (
              <Consequence>
                We&rsquo;ll confirm the price for your new address before you pay.
              </Consequence>
            ) : null}
          </div>
          <button
            type="button"
            className={`${quietButton} -my-1.5 -mr-3 shrink-0`}
            aria-label="Edit where you live"
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </Row>
  );
}

const emptyPerson = { name: "", age: "", relation: "" };

function PeopleRow({
  members,
  changed,
  onAdd,
  onRemove,
}: {
  members: V3Member[];
  changed: boolean;
  onAdd: (member: V3Member) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(emptyPerson);
  const ready =
    draft.name.trim() !== "" && draft.age !== "" && draft.relation !== "";

  const summary = list.format(
    members.map((member) => `${member.name.split(" ")[0]} (${member.age})`),
  );

  return (
    <Row label="Who's covered" changed={changed}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[15px] leading-[1.5] text-pretty text-ink">{summary}</p>
          {changed ? (
            <Consequence>
              Adding or removing someone changes the price. You&rsquo;ll see it
              before you pay.
            </Consequence>
          ) : null}
        </div>
        <button
          type="button"
          className={`${quietButton} -my-1.5 -mr-3 shrink-0`}
          aria-expanded={editing}
          aria-label={editing ? "Done editing who's covered" : "Edit who's covered"}
          onClick={() => setEditing((open) => !open)}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="mt-4 flex flex-col gap-4 motion-safe:animate-reveal">
          <ul className="flex flex-wrap gap-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex h-9 items-center gap-1 rounded-full border border-grey-200 bg-white pr-1 pl-3 text-[14px] leading-none text-ink"
              >
                {member.name} ({member.age})
                {member.proposer ? (
                  <span className="px-2 text-[12px] text-ink-secondary">you</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRemove(member.id)}
                    aria-label={`Remove ${member.name}`}
                    className="grid size-7 touch-manipulation place-items-center rounded-full text-ink-secondary transition-[background-color,color] duration-150 select-none hover:bg-grey-100 hover:text-error-text"
                  >
                    <CloseCircleIcon size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-grey-100 p-4">
            <p className="text-[14px] leading-none font-semibold text-ink">
              Add someone
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <TextField
                label="Full name"
                value={draft.name}
                onChange={(name) => setDraft((d) => ({ ...d, name }))}
              />
              <TextField
                label="Age"
                value={draft.age}
                inputMode="numeric"
                maxLength={3}
                onChange={(age) =>
                  setDraft((d) => ({ ...d, age: age.replace(/\D/g, "") }))
                }
              />
              <SelectField
                label="Relationship"
                value={draft.relation}
                options={relationshipOptions}
                placeholder="Choose one"
                onChange={(relation) => setDraft((d) => ({ ...d, relation }))}
              />
            </div>
            <button
              type="button"
              disabled={!ready}
              className={`${solidButton} mt-4`}
              onClick={() => {
                onAdd({
                  id: `added-${Date.now()}`,
                  name: draft.name.trim(),
                  age: Number(draft.age),
                  relation: draft.relation,
                });
                setDraft(emptyPerson);
              }}
            >
              Add to the policy
            </button>
          </div>
        </div>
      ) : null}
    </Row>
  );
}

/* ---------------------------------------------------------------------------
   Worth adding
   --------------------------------------------------------------------------- */

/**
 * Add toggle. The label and icon both change, so the state never rests on
 * colour; the icons cross-fade in place with the scale-and-blur recipe rather
 * than one popping out for the other.
 */
function AddToggle({
  added,
  addOn,
  onToggle,
}: {
  added: boolean;
  addOn: V3AddOn;
  onToggle: () => void;
}) {
  const icon =
    "grid place-items-center transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
  return (
    <button
      type="button"
      aria-pressed={added}
      aria-label={`${added ? "Added" : "Add"} ${addOn.name}, ${rupees(addOn.price)} a year`}
      onClick={onToggle}
      className={`flex h-10 min-w-[104px] touch-manipulation items-center justify-center gap-1.5 rounded-lg border px-3.5 text-[14px] leading-none font-medium transition-[background-color,border-color,color,transform] duration-150 select-none active:scale-[0.96] ${
        added
          ? "border-transparent bg-green-100 text-success-strong"
          : "border-grey-200 bg-white text-ink hover:bg-grey-50"
      }`}
    >
      <span aria-hidden="true" className="relative grid size-4 place-items-center">
        <span
          className={`${icon} absolute inset-0 ${
            added ? "blur-0 scale-100 opacity-100" : "blur-[4px] scale-[0.25] opacity-0"
          }`}
        >
          <CheckMarkIcon size={14} />
        </span>
        <span
          className={`${icon} ${
            added ? "blur-[4px] scale-[0.25] opacity-0" : "blur-0 scale-100 opacity-100"
          }`}
        >
          <PlusIcon size={14} />
        </span>
      </span>
      {added ? "Added" : "Add"}
    </button>
  );
}

function AddOnRow({
  addOn,
  added,
  onToggle,
}: {
  addOn: V3AddOn;
  added: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:gap-6">
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] leading-[1.4] font-semibold text-ink">
          {addOn.name}
        </h3>
        <p className="mt-1 max-w-[460px] text-[14px] leading-[1.5] text-pretty text-ink-secondary">
          {addOn.does}
        </p>
        {addOn.why ? (
          <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-[1.45] font-medium text-success-strong">
            <CheckMarkIcon size={12} className="mt-[3px] shrink-0" />
            {addOn.why}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start sm:gap-2.5">
        <p className="text-[15px] leading-none font-semibold whitespace-nowrap text-ink tabular-nums">
          {rupees(addOn.price)}
          <span className="font-normal text-ink-secondary">/yr</span>
          {addOn.wasPrice ? (
            <s className="ml-2 text-[13px] font-normal text-ink-secondary">
              {rupees(addOn.wasPrice)}
            </s>
          ) : null}
        </p>
        <AddToggle added={added} addOn={addOn} onToggle={onToggle} />
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------------------
   The screen
   --------------------------------------------------------------------------- */

/**
 * V3: the renewal as a pre-filled order you review, not a form you fill in.
 *
 * Renewing exactly as is takes one click. The page asks for one decision (the
 * cover), offers a couple of optional extras, and keeps the price, itemised,
 * next to everything that changes it.
 */
export function RenewalV3({
  value,
  onChange,
  onConfirm,
}: {
  value: V3State;
  onChange: (next: V3State) => void;
  onConfirm: () => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const set = (patch: Partial<V3State>) => onChange({ ...value, ...patch });

  const changed = v3Changes(value);
  const anyChange = Object.values(changed).some(Boolean);
  const priced = useMemo(() => priceV3(value), [value]);
  const members = useMemo(
    () => [...v3Members.filter((m) => !value.removed.includes(m.id)), ...value.added],
    [value.added, value.removed],
  );

  const toggleAddOn = (id: string) =>
    set({
      addOns: value.addOns.includes(id)
        ? value.addOns.filter((item) => item !== id)
        : [...value.addOns, id],
    });

  return (
    <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-36 [-webkit-tap-highlight-color:transparent] lg:pt-[72px] lg:pb-24 xl:px-0">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
        <div className="min-w-0">
          <p className="flex w-fit items-center gap-1.5 rounded-full bg-orange-50 py-1 pr-3 pl-2 text-[13px] leading-[1.4] font-medium text-attention">
            <ClockIcon size={15} className="shrink-0" />
            Renew by {v3Intro.deadline} · {v3Intro.daysLeft} days left
          </p>
          <h1 className="mt-4 text-[32px] leading-[1.15] font-semibold tracking-[-0.5px] text-balance text-ink">
            {v3Intro.title}
          </h1>
          <p className="mt-3 max-w-[560px] text-[16px] leading-[1.55] text-pretty text-ink-secondary">
            {v3Intro.lead}
          </p>

          {/* What carries over. Glanceable, because for most people nothing
              here has changed. */}
          <section aria-labelledby="renewing-title" className="mt-10">
            <SectionHeading
              id="renewing-title"
              title="What you're renewing"
              lead="Moved, or someone new to cover? Edit it here — both can change the price."
            />
            <dl className="divide-y divide-grey-150 rounded-2xl border border-grey-150 bg-white shadow-card">
              <AddressRow
                value={value.address}
                changed={changed.address}
                onChange={(address) => set({ address })}
              />
              <PeopleRow
                members={members}
                changed={changed.members}
                onAdd={(member) => set({ added: [...value.added, member] })}
                onRemove={(id) =>
                  value.added.some((m) => m.id === id)
                    ? set({ added: value.added.filter((m) => m.id !== id) })
                    : set({ removed: [...value.removed, id] })
                }
              />
              <Row label="Add-ons you keep">
                <p className="text-[15px] leading-[1.5] text-pretty text-ink">
                  {list.format(keptAddOns.map((addOn) => addOn.name))}
                </p>
              </Row>
            </dl>
          </section>

          <div className="mt-10">
            <CoverDecision
              lakhs={value.lakhs}
              decided={value.coverDecided}
              onDecide={(lakhs) => set({ lakhs, coverDecided: true })}
              onReopen={() => set({ coverDecided: false })}
            />
          </div>

          <section aria-labelledby="extras-title" className="mt-10">
            <SectionHeading
              id="extras-title"
              title="Worth adding"
              lead="Optional. Nothing is added unless you add it."
            />
            <div className="rounded-2xl border border-grey-150 bg-white shadow-card">
              <ul className="divide-y divide-grey-150">
                {suggestedAddOns.map((addOn) => (
                  <AddOnRow
                    key={addOn.id}
                    addOn={addOn}
                    added={value.addOns.includes(addOn.id)}
                    onToggle={() => toggleAddOn(addOn.id)}
                  />
                ))}
                {showMore
                  ? moreAddOns.map((addOn) => (
                      <AddOnRow
                        key={addOn.id}
                        addOn={addOn}
                        added={value.addOns.includes(addOn.id)}
                        onToggle={() => toggleAddOn(addOn.id)}
                      />
                    ))
                  : null}
              </ul>
              <button
                type="button"
                aria-expanded={showMore}
                onClick={() => setShowMore((open) => !open)}
                className="flex w-full touch-manipulation items-center justify-between gap-3 rounded-b-2xl border-t border-grey-150 px-5 py-3.5 text-left text-[14px] leading-none font-medium text-ink transition-colors duration-150 select-none hover:bg-grey-50"
              >
                {showMore ? "Fewer add-ons" : `${moreAddOns.length} more add-ons`}
                <ChevronDownIcon
                  size={18}
                  className={`shrink-0 text-ink-secondary transition-transform duration-200 ease-strong ${
                    showMore ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </section>

          <section aria-labelledby="term-title" className="mt-10">
            <SectionHeading
              id="term-title"
              title="Renew for longer, pay less"
              lead="Pay for more than one year now and today's price holds for all of them."
            />
            <fieldset className="grid gap-3 sm:grid-cols-3">
              <legend className="sr-only">How long to renew for</legend>
              {terms.map((term) => {
                const chosen = value.years === term.years;
                const total = termTotal(priced.annual, term.years);
                const saving = termSaving(priced.annual, term.years);
                return (
                  <label
                    key={term.years}
                    className={`flex cursor-pointer touch-manipulation flex-col gap-2 rounded-xl border-2 p-4 transition-[border-color,background-color,transform] duration-150 select-none active:scale-[0.98] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus-ring has-[:focus-visible]:ring-offset-2 ${
                      chosen
                        ? "border-primary-strong bg-blue-light"
                        : "border-grey-150 bg-white hover:border-grey-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="term"
                      checked={chosen}
                      onChange={() => set({ years: term.years })}
                      aria-label={`${term.label}, ${rupees(total)}${
                        saving ? `, saves ${rupees(saving)}` : ""
                      }`}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[15px] leading-none font-semibold text-ink">
                        {term.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors duration-150 ${
                          chosen
                            ? "border-primary-strong bg-primary-strong"
                            : "border-grey-200 bg-white"
                        }`}
                      >
                        <span
                          className={`block size-1.5 rounded-full bg-white transition-opacity duration-150 ${
                            chosen ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </span>
                    </span>
                    <span className="text-[14px] leading-[1.4] text-ink tabular-nums">
                      {rupees(Math.round(total / term.years))} a year
                    </span>
                    <span
                      className={`text-[13px] leading-[1.4] tabular-nums ${
                        saving ? "font-medium text-success-strong" : "text-ink-secondary"
                      }`}
                    >
                      {saving ? `Save ${rupees(saving)}` : "Renews each year"}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </section>
        </div>

        <aside className="mt-12 lg:mt-0" aria-label="Your renewal price">
          <div className="lg:sticky lg:top-[88px]">
            <Receipt
              priced={priced}
              next={nextStepsFor(value)}
              changed={anyChange}
              onUndo={() => onChange(initialV3State)}
              onConfirm={onConfirm}
            />
          </div>
        </aside>
      </div>

      <MobileBar priced={priced} onConfirm={onConfirm} />

      {/* One stable region, so each new total is announced once. */}
      <p role="status" className="sr-only">
        You pay {rupees(priced.total)} for{" "}
        {priced.years === 1 ? "1 year" : `${priced.years} years`}.
      </p>
    </main>
  );
}

