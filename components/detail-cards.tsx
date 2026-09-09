import { bankAccount, nominee } from "@/lib/renewal-data";

type Field = { label: string; value: string };

function FieldPair({ label, value }: Field) {
  return (
    <div>
      <dt className="text-[14px] leading-[1.6] tracking-[0.035px] text-ink-secondary">
        {label}
      </dt>
      <dd className="ff-figures text-[14px] leading-[1.6] font-medium tracking-[0.035px] text-ink">
        {value}
      </dd>
    </div>
  );
}

const shell =
  "rounded-xl border border-grey-150 bg-white px-[19px] py-[15px] shadow-card";

/** Refund account card (node 63:2521) attached to question 5. */
export function BankAccountCard() {
  return (
    <div className={shell}>
      <dl className="flex flex-wrap gap-x-10 gap-y-4 sm:flex-nowrap sm:justify-between">
        {bankAccount.map((field: Field) => (
          <FieldPair key={field.label} {...field} />
        ))}
      </dl>
    </div>
  );
}

/** Nominee card (node 63:2530) attached to question 6. */
export function NomineeCard() {
  return (
    <div className={shell}>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[166px_223px_1fr] lg:gap-0">
        {nominee.map((field: Field) => (
          <FieldPair key={field.label} {...field} />
        ))}
      </dl>
    </div>
  );
}
