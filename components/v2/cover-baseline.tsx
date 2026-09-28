"use client";

import { createContext, useContext } from "react";
import { CURRENT_LAKHS, coverStops } from "@/lib/v2-data";

/**
 * The cover the policy carries today, for the pickers and charts beneath it.
 *
 * It is ₹15 lakh in the frames, but a scenario can start the reviewer on the
 * recommended ₹20 lakh instead, and every control below — which stops can be
 * reached, what "you have now" labels, what a change costs — follows from it.
 */
export const CoverBaseline = createContext<{ current: number }>({
  current: CURRENT_LAKHS,
});

export function useCoverBaseline() {
  const { current } = useContext(CoverBaseline);
  return {
    current,
    /** Cover never drops at renewal, so nothing below today's amount. */
    reachable: coverStops.filter((stop) => stop.lakhs >= current),
  };
}
