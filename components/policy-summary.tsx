"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckMarkIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseCircleIcon,
  UserIcon,
  VerifiedDiscountIcon,
} from "@/components/icons";
import {
  benefits,
  exclusions,
  formatRupees,
  otherAddOnsCount,
  policy,
  recommendedAddOns,
  waitingPeriods,
  type BenefitTone,
  type WaitTone,
} from "@/lib/renewal-data";

function AddOnRow({ name, price }: { name: string; price: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
        {name}
      </dt>
      <dd className="ff-figures text-right text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
        {price}
      </dd>
    </div>
  );
}

/** Renewal deadline banner (node 75:5213). */
export function RenewalDeadlineBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-14 items-center justify-between gap-4 rounded-2xl bg-orange-50 px-4 ${className}`}
    >
      <h2 className="flex items-center gap-2 text-[16px] leading-none font-semibold text-ink">
        <ClockIcon className="shrink-0 text-ink" />
        Policy Coverage
      </h2>
      <p className="text-[14px] leading-none tracking-[0.035px] text-ink">
        Ends in{" "}
        <span className="font-medium text-attention">{policy.daysLeft} Days</span>
      </p>
    </div>
  );
}


type BreakdownRow = {
  key: string;
  name: string;
  price: string;
  checked: boolean;
  /** Rows the reviewer picked this session read in the success tone. */
  highlight?: boolean;
  tone?: "ink" | "success";
};

/**
 * One collapsible block of the premium breakdown on the summary screen
 * (node 78:6792). Rows carry the same checkbox as the add-ons card.
 */
function BreakdownSection({
  title,
  count,
  rows,
}: {
  title: string;
  count: string;
  rows: BreakdownRow[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col gap-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 text-[14px] leading-none font-medium tracking-[-0.14px] text-ink"
      >
        <ChevronDownIcon
          className={`shrink-0 text-ink transition-transform ${open ? "rotate-180" : ""}`}
        />
        {title} <span className="text-link">({count})</span>
      </button>

      {open ? (
        <dl className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2.5 text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                <span
                  aria-hidden="true"
                  className={`flex size-4 shrink-0 items-center justify-center rounded p-0.5 ${
                    row.checked
                      ? row.tone === "success"
                        ? "bg-success-solid-strong text-white"
                        : "bg-ink text-white"
                      : "border-[1.5px] border-grey-200 bg-white"
                  }`}
                >
                  {row.checked ? <CheckMarkIcon /> : null}
                </span>
                {row.name}
              </dt>
              <dd
                className={`ff-figures text-right text-[14px] leading-none font-medium tracking-[-0.14px] ${
                  row.highlight ? "text-success" : "text-ink"
                }`}
              >
                {row.price}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}

/**
 * Policy coverage summary (nodes 76:5867 - 76:5928).
 *
 * `detailed` switches to the variant used on the summary screen
 * (node 78:6748): the plan row with its Switch link, a green cover and
 * premium because they were re-checked, and an add-ons breakdown whose
 * sections collapse and whose rows carry checkboxes.
 */
export function PolicySummary({
  detailed = false,
  selectedAddOns = [],
  addedMember,
}: {
  detailed?: boolean;
  selectedAddOns?: string[];
  /** Relationship of a member added this session, shown as a success badge. */
  addedMember?: string;
} = {}) {
  return (
    <div className="flex flex-col gap-4">
      <RenewalDeadlineBanner className="hidden lg:flex" />

      {/* Coverage details */}
      <div className="overflow-hidden rounded-2xl border border-grey-150 bg-white shadow-card">
        <div className="p-2">
          <div className="flex flex-col gap-5 rounded-[10px] bg-grey-100 pt-3 pr-[11px] pb-4 pl-3">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/hdfc-ergo.png"
                alt={policy.insurer}
                width={320}
                height={320}
                className="size-16 shrink-0 rounded-[2px] object-cover"
              />
              <div className="flex flex-col gap-3">
                <h3 className="text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-ink">
                  {policy.name}
                </h3>
                <p className="ff-figures text-[14px] leading-none tracking-[-0.07px] text-ink">
                  {policy.uin}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                Members to be included
              </h4>
              <ul className="flex flex-wrap items-center gap-2">
                {policy.members.map((member) => (
                  <li
                    key={member}
                    className="ff-case flex items-center justify-center gap-1 rounded-md bg-grey-150 px-2 py-[5px] text-[11px] font-medium text-ink uppercase"
                  >
                    <UserIcon className="shrink-0 text-grey-300" />
                    {member}
                  </li>
                ))}
                {addedMember ? (
                  <li className="ff-case flex items-center justify-center gap-1 rounded-md bg-green-100 px-2 py-[5px] text-[11px] font-medium text-success uppercase">
                    <UserIcon className="shrink-0 text-success" />
                    {addedMember}
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                Pin code
              </h4>
              <p className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
                {policy.pinCode}
              </p>
            </div>

            <dl className="flex w-[304px] max-w-full justify-between gap-4">
              <div className="flex flex-col gap-2">
                <dt className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                  Cover
                </dt>
                <dd
                  className={`ff-figures text-[18px] leading-[1.4] font-semibold ${
                    detailed ? "text-success" : "text-ink"
                  }`}
                >
                  {policy.cover}
                </dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                  Premium
                </dt>
                <dd
                  className={`ff-figures text-[18px] leading-[1.4] font-semibold ${
                    detailed ? "text-success" : "text-ink"
                  }`}
                >
                  {policy.premium} /{" "}
                  <span className="text-[16px] leading-none font-normal tracking-[0.16px] text-ink-faint">
                    {policy.premiumPeriod}
                  </span>
                </dd>
              </div>
            </dl>

            {detailed ? (
              <div className="border-t border-grey-200 pt-4">
                <p className="flex items-center justify-between gap-4 text-[14px] leading-none text-ink">
                  {policy.planName}
                  <a
                    href="#plans"
                    className="font-medium text-link underline-offset-4 hover:underline"
                  >
                    Switch
                  </a>
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Premium breakdown */}
        <div className="px-5 pt-2 pb-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] leading-none tracking-[-0.07px] text-ink">
                {policy.basePremium.label}
              </p>
              <p className="ff-figures text-right text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                {policy.basePremium.value}
              </p>
            </div>

            <hr className="border-grey-150" />

            {detailed ? (
              <BreakdownSection
                title="Previously Selected Add-ons"
                count={`${policy.previousAddOns.length}`}
                rows={policy.previousAddOns.map((addOn, index) => ({
                  key: addOn.name,
                  name: addOn.name,
                  price: addOn.price,
                  checked: true,
                  highlight: index === 0,
                }))}
              />
            ) : (
              <section className="flex flex-col gap-4">
                <h4 className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                  Previously Selected Add-ons{" "}
                  <span className="text-info">({policy.previousAddOns.length})</span>
                </h4>
                <dl className="flex flex-col gap-4">
                  {policy.previousAddOns.map((addOn) => (
                    <AddOnRow key={addOn.name} {...addOn} />
                  ))}
                </dl>
              </section>
            )}

            {detailed ? (
              <>
                <hr className="border-grey-150" />
                <BreakdownSection
                  title="Recommended Add-ons"
                  count={`${selectedAddOns.length}/${recommendedAddOns.length}`}
                  rows={recommendedAddOns.map((addOn) => ({
                    key: addOn.id,
                    name: addOn.name,
                    price: addOn.priceLabel,
                    checked: selectedAddOns.includes(addOn.id),
                    highlight: selectedAddOns.includes(addOn.id),
                    tone: "success" as const,
                  }))}
                />
                <hr className="border-grey-150" />
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-2 text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                    <ChevronDownIcon className="shrink-0 text-ink" />
                    Other Add-ons <span className="text-link">(0/{otherAddOnsCount})</span>
                  </p>
                  <p className="text-[14px] leading-none text-ink-muted">--</p>
                </div>
              </>
            ) : null}

            <hr className="border-grey-150" />

            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                Total Premium{" "}
                <span className="text-[13px] font-normal tracking-[0.195px]">
                  (Incl. of 18% GST)
                </span>
              </p>
              <p className="ff-figures text-right text-[14px] leading-5 font-medium text-ink">
                {formatRupees(policy.totalPremium)}
              </p>
            </div>

            <p className="flex h-8 items-center justify-between gap-2 rounded-lg bg-green-100 px-2.5 text-[14px] text-success">
              <span className="flex items-center gap-2">
                <VerifiedDiscountIcon className="shrink-0" />
                <span className="leading-none tracking-[-0.07px]">
                  80D tax savings
                </span>
              </span>
              <span className="ff-figures leading-none font-medium">
                {policy.taxSaving}
              </span>
            </p>
          </div>
        </div>
      </div>

      {detailed ? null : <PolicyDetailsCard />}
    </div>
  );
}

const tile: Record<BenefitTone, string> = {
  green: "bg-tile-green",
  orange: "bg-tile-orange",
  cyan: "bg-tile-cyan",
};

/** Wrapper geometry per exported benefit mark, taken from the Figma node. */
const art: Record<string, { box: string; inset: string }> = {
  "/policy/hospital.svg": {
    box: "left-[6px] top-[6px] size-[20px]",
    inset: "inset-[-185.39%_-395.42%_-605.44%_-395.41%]",
  },
  "/policy/bed1.svg": {
    box: "left-[6px] top-[6px] size-[20px]",
    inset: "inset-[-174.38%_-393.75%_-594.38%_-393.75%]",
  },
  "/policy/bed2.svg": {
    box: "left-[7px] top-[8px] h-[15px] w-[18.75px]",
    inset: "inset-[-247.08%_-426.67%_-807.08%_-426.67%]",
  },
};

const waitColor: Record<WaitTone, string> = {
  green: "text-wait-green",
  orange: "text-wait-orange",
  purple: "text-wait-purple",
};

/** Policy summary (node 75:5273): benefits, waiting periods and exclusions. */
function PolicyDetailsCard() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      <section className="flex flex-col gap-4">
        <h3 className="text-[16px] leading-[1.4] font-semibold text-ink">
          Main Benefits
        </h3>
        <ul className="flex flex-col gap-6">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className={`flex gap-3 ${benefit.multiline ? "items-start" : "items-center"}`}
            >
              <span
                className={`relative block size-8 shrink-0 overflow-hidden rounded-md ${tile[benefit.tone]}`}
              >
                <span className={`absolute block ${art[benefit.icon].box}`}>
                  <span className={`absolute block ${art[benefit.icon].inset}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={benefit.icon}
                      alt=""
                      className="block size-full max-w-none"
                    />
                  </span>
                </span>
              </span>
              <span className="flex min-w-0 flex-col gap-1.5 text-[13px]">
                <span className="leading-none font-semibold tracking-[0.0325px] text-ink">
                  {benefit.title}
                </span>
                <span
                  className={`text-ink-secondary ${
                    benefit.multiline
                      ? "leading-[1.5]"
                      : "leading-none tracking-[0.195px]"
                  }`}
                >
                  {benefit.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-grey-150" />

      <section className="flex flex-col gap-4">
        <h3 className="text-[16px] leading-[1.4] font-semibold text-ink">
          Waiting Periods
        </h3>
        <ul className="grid grid-cols-[1.18fr_1fr_1fr] gap-[18px]">
          {waitingPeriods.map((period) => (
            <li key={period.duration} className="flex flex-col">
              <CalendarIcon className={`shrink-0 ${waitColor[period.tone]}`} />
              <span className="mt-3.5 text-[13px] leading-none font-semibold tracking-[0.0325px] text-ink">
                {period.duration}
              </span>
              <span className="mt-1.5 text-[13px] leading-[1.5] text-ink-secondary">
                {period.description}
                {period.link ? (
                  <>
                    {" "}
                    <a
                      href="#waiting-periods"
                      className="inline-flex items-center gap-0.5 font-medium text-link underline-offset-4 hover:underline"
                    >
                      {period.link}
                      <ArrowRightIcon className="shrink-0" size={12} />
                    </a>
                  </>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-grey-150" />

      <section className="flex flex-col gap-4">
        <h3 className="text-[16px] leading-[1.4] font-semibold text-ink">
          What&rsquo;s not covered?
        </h3>
        <ul className="flex flex-col gap-3">
          {exclusions.map((exclusion) => (
            <li key={exclusion} className="flex items-center gap-2">
              <CloseCircleIcon className="shrink-0 text-ink-secondary" />
              <span className="text-[13px] leading-[1.5] text-grey-700">
                {exclusion}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-grey-150" />

      <p className="text-[14px] leading-none text-ink-secondary">
        <span className="tracking-[-0.07px]">Know your policy</span>
        <span> ・ </span>
        <a
          href="#policy-wording"
          className="inline-flex items-center gap-1 font-medium tracking-[-0.14px] text-link underline-offset-4 hover:underline"
        >
          View
          <ArrowRightIcon className="shrink-0" size={12} />
        </a>
      </p>
    </div>
  );
}
