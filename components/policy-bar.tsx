import Image from "next/image";
import { ChevronDownIcon } from "@/components/icons";
import { policy } from "@/lib/renewal-data";

/**
 * Collapsed policy summary tucked under the nav (node 121:7482). Used once the
 * journey moves past the review, where the full card would only be noise.
 */
export function PolicyBar({ cover }: { cover?: string }) {
  const amount = (cover ?? policy.cover).replace("Lakhs", "L");

  return (
    <div className="flex items-center gap-4 rounded-b-xl border-r border-b border-l border-[#e8eaeb] bg-white px-4 py-3 shadow-card">
      <Image
        src="/brand/hdfc-ergo.png"
        alt={policy.insurer}
        width={320}
        height={320}
        className="size-8 shrink-0 rounded-[2px] object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[14px] leading-none font-semibold tracking-[-0.035px] text-ink">
          {policy.name}
        </p>
        <p className="ff-figures text-[12px] leading-none tracking-[0.06px] text-ink-secondary">
          Cover: {amount} <span className="text-grey-200">•</span> Premium:{" "}
          {policy.premium} / {policy.premiumPeriod}
        </p>
      </div>
      <ChevronDownIcon className="shrink-0 text-ink-secondary" size={20} />
    </div>
  );
}
