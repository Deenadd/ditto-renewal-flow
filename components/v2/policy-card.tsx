"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  CheckMarkIcon,
  ChevronDownIcon,
  InformationIcon,
  VerifiedDiscountIcon,
} from "@/components/icons";
import { digitalDiscountNote, formatRupees, policy } from "@/lib/renewal-data";
import {
  v2LockedAddOns,
  v2MoreAddOns,
  v2PickedAddOns,
  type V2AddOn,
} from "@/lib/v2-data";

const price = (addOn: V2AddOn) => Number(addOn.priceLabel.replace(/[^\d]/g, ""));

function Tick({ on, tone }: { on: boolean; tone: "blue" | "green" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-4 shrink-0 place-items-center rounded-[4px] text-white transition-colors duration-150 ${
        on
          ? tone === "blue"
            ? "bg-primary"
            : "bg-success-solid-strong"
          : "border-[1.5px] border-grey-200 bg-white"
      }`}
    >
      {on ? <CheckMarkIcon size={11} /> : null}
    </span>
  );
}

/** A collapsible block of the breakdown, open by default as drawn. */
function Group({
  title,
  count,
  empty,
  defaultOpen = true,
  plainCount,
  children,
}: {
  title: string;
  count: string;
  /** The drawn "(3)" on add-ons already held is ink, not link blue. */
  plainCount?: boolean;
  /** What the right-hand column shows while closed with nothing chosen. */
  empty?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="flex flex-col gap-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-between gap-4 text-left"
      >
        <span className="flex items-center gap-2 text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
          <ChevronDownIcon
            size={16}
            className={`shrink-0 text-ink transition-transform duration-200 ease-strong ${
              open ? "rotate-180" : ""
            }`}
          />
          {title} <span className={plainCount ? "" : "text-link"}>({count})</span>
        </span>
        {!open && empty ? (
          <span className="text-[14px] leading-none text-ink-muted">--</span>
        ) : null}
      </button>
      {open ? <dl className="flex flex-col gap-4 pl-6 motion-safe:animate-reveal">{children}</dl> : null}
    </section>
  );
}

function Row({
  name,
  value,
  on,
  tone,
  highlight,
}: {
  name: string;
  value: string;
  on: boolean;
  tone: "blue" | "green";
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2.5 text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
        <Tick on={on} tone={tone} />
        {name}
      </dt>
      <dd
        className={`ff-figures text-right text-[14px] leading-none font-medium tracking-[-0.14px] tabular-nums ${
          highlight ? "text-success" : "text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The policy card beside V2 (node 148:6509): who and where, the cover in play,
 * a breakdown whose add-on groups fold, the total, and the action itself, so
 * the button sits under the price it commits to.
 */
export function PolicyCard({
  cover,
  pinCode,
  pinChanged,
  selectedAddOns,
  total,
  onConfirm,
}: {
  cover: string;
  pinCode: string;
  pinChanged: boolean;
  selectedAddOns: string[];
  total: number;
  onConfirm: () => void;
}) {
  const picked = v2PickedAddOns.filter((a) => selectedAddOns.includes(a.id));
  const more = v2MoreAddOns.filter((a) => selectedAddOns.includes(a.id));

  return (
    <div className="flex flex-col gap-4">
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

            <div className="flex flex-col gap-2">
              <p className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                Pin code
              </p>
              <p
                className={`ff-figures text-[18px] leading-[1.4] font-semibold ${
                  pinChanged ? "text-success" : "text-ink"
                }`}
              >
                {pinCode}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                Cover
              </p>
              <p className="ff-figures text-[18px] leading-[1.4] font-semibold text-success">
                {cover}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 pt-2 pb-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] leading-none tracking-[-0.07px] text-ink">
              {policy.basePremium.label}
            </p>
            <p className="ff-figures text-right text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
              {policy.basePremium.value}
            </p>
          </div>

          <hr className="border-grey-150" />
          <Group title="Already on your policy" count={`${v2LockedAddOns.length}`} plainCount>
            {v2LockedAddOns.map((addOn) => (
              <Row key={addOn.id} name={addOn.name} value={addOn.priceLabel} on tone="blue" />
            ))}
          </Group>

          <hr className="border-grey-150" />
          <Group
            title="Recommended Add-ons"
            count={`${picked.length}/${v2PickedAddOns.length}`}
          >
            {v2PickedAddOns.map((addOn) => {
              const on = selectedAddOns.includes(addOn.id);
              return (
                <Row
                  key={addOn.id}
                  name={addOn.name}
                  value={addOn.priceLabel}
                  on={on}
                  tone="green"
                  highlight={on}
                />
              );
            })}
          </Group>

          <hr className="border-grey-150" />
          <Group
            title="Other Add-ons"
            count={`${more.length}/${v2MoreAddOns.length}`}
            empty={more.length === 0}
            defaultOpen={false}
          >
            {more.length === 0 ? (
              <p className="text-[14px] leading-[1.4] text-ink-muted">None added</p>
            ) : (
              more.map((addOn) => (
                <Row
                  key={addOn.id}
                  name={addOn.name}
                  value={addOn.priceLabel}
                  on
                  tone="green"
                  highlight
                />
              ))
            )}
          </Group>

          <hr className="border-grey-150" />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
              Total Premium{" "}
              <span className="text-[13px] font-normal tracking-[0.195px]">
                (Incl. of 18% GST)
              </span>
            </p>
            <p
              key={total}
              className="ff-figures text-right text-[14px] leading-5 font-medium text-ink tabular-nums motion-safe:animate-swap"
            >
              {formatRupees(total)}
            </p>
          </div>

          <p className="flex h-8 items-center justify-between gap-2 rounded-lg bg-green-100 px-2.5 text-[14px] text-success">
            <span className="flex items-center gap-2">
              <VerifiedDiscountIcon className="shrink-0" />
              <span className="leading-none tracking-[-0.07px]">80D tax savings</span>
            </span>
            <span className="ff-figures leading-none font-medium">{policy.taxSaving}</span>
          </p>

          <button
            type="button"
            onClick={onConfirm}
            className="ff-case flex h-11 w-full items-center justify-center rounded-lg bg-primary text-[15px] leading-none font-medium text-ink-inverted transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
          >
            Confirm &amp; continue
          </button>
        </div>
      </div>

      <p className="mx-5 flex h-8 items-center gap-2 rounded-lg bg-grey-100 px-2.5 text-[13px] leading-none text-ink-secondary">
        <InformationIcon className="shrink-0 text-ink-muted" size={16} />
        {digitalDiscountNote}
      </p>
    </div>
  );
}

export { price as addOnPrice };
