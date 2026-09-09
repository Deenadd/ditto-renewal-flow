import { conditionRows } from "@/lib/renewal-data";

/**
 * Pre-existing-condition table (node 63:2490) attached to question 3.
 * Built as a real table so the column headers are announced with each cell;
 * the 46px row pitch, hairline rules and 20px condition chips follow Figma.
 */
export function ConditionsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-grey-150 bg-white shadow-card">
      <div
        role="region"
        aria-label="Members and declared conditions"
        tabIndex={0}
        className="overflow-x-auto"
      >
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="sr-only">
            Members with pre-existing conditions already declared on the policy
          </caption>
          <colgroup>
            <col className="w-[203px]" />
            <col className="w-[150px]" />
            <col />
          </colgroup>
          <thead>
            <tr className="h-[46px]">
              <th
                scope="col"
                className="pl-[19px] text-[11px] font-medium tracking-[0.55px] text-ink-muted uppercase"
              >
                Members
              </th>
              <th
                scope="col"
                className="text-[11px] font-medium tracking-[0.55px] text-ink-muted uppercase"
              >
                Relationship
              </th>
              <th
                scope="col"
                className="pr-[19px] text-[11px] font-medium tracking-[0.55px] text-ink-muted uppercase"
              >
                PED Conditions
              </th>
            </tr>
          </thead>
          <tbody>
            {conditionRows.map((row) => (
              <tr key={row.member} className="h-[46px] border-t border-grey-150">
                <th
                  scope="row"
                  className="ff-figures pl-[19px] text-[13px] font-medium tracking-[0.195px] text-ink"
                >
                  {row.member}
                </th>
                <td className="ff-figures text-[13px] font-medium tracking-[0.195px] text-ink">
                  {row.relationship}
                </td>
                <td className="py-2 pr-[19px]">
                  {row.conditions.length > 0 ? (
                    <ul className="flex flex-wrap items-center gap-2">
                      {row.conditions.map((condition) => (
                        <li
                          key={condition}
                          className="ff-case flex h-5 items-center rounded-full border border-grey-200 bg-white px-1.5 text-[11px] leading-none font-medium text-ink"
                        >
                          {condition}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-[13px] tracking-[0.195px] text-ink-muted">
                      No PED conditions
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
