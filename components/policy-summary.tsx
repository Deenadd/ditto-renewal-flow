import Image from "next/image";
import { ClockIcon, UserIcon, VerifiedDiscountIcon } from "@/components/icons";
import { policy } from "@/lib/renewal-data";

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

/** Renewal deadline banner (node 63:2319). */
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

/**
 * Policy coverage summary (nodes 63:2317 - 63:2391).
 * Renewal banner, insurer header block and the premium breakdown.
 */
export function PolicySummary() {
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
                <dd className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
                  {policy.cover}
                </dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="text-[14px] leading-none tracking-[-0.07px] text-ink-secondary">
                  Premium
                </dt>
                <dd className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
                  {policy.premium} /{" "}
                  <span className="text-[16px] leading-none font-normal tracking-[0.16px] text-ink-faint">
                    {policy.premiumPeriod}
                  </span>
                </dd>
              </div>
            </dl>
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

            <section className="flex flex-col gap-4">
              <h4 className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                Mandatory Add-ons{" "}
                <span className="text-info">
                  ({policy.mandatoryAddOns.length})
                </span>
              </h4>
              <dl className="flex flex-col gap-4">
                {policy.mandatoryAddOns.map((addOn) => (
                  <AddOnRow key={addOn.name} {...addOn} />
                ))}
              </dl>
            </section>

            <hr className="border-grey-150" />

            <section className="flex flex-col gap-4">
              <h4 className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                Selected Add-ons{" "}
                <span className="text-link">
                  ({policy.selectedAddOnsCount}/{policy.selectedAddOnsAvailable})
                </span>
              </h4>
              <dl className="flex flex-col gap-4">
                {policy.selectedAddOns.map((addOn) => (
                  <AddOnRow key={addOn.name} {...addOn} />
                ))}
              </dl>
            </section>

            <hr className="border-grey-150" />

            <div className="flex items-center justify-between gap-4">
              <p className="text-[14px] leading-none font-medium tracking-[-0.14px] text-ink">
                Total Premium{" "}
                <span className="text-[13px] font-normal tracking-[0.195px]">
                  (Incl. of 18% GST)
                </span>
              </p>
              <p className="ff-figures text-right text-[14px] leading-5 font-medium text-ink">
                {policy.totalPremium}
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
    </div>
  );
}
