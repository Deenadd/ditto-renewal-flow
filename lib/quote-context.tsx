"use client";

import { createContext, useContext } from "react";

/**
 * The policy as priced on the first screen, handed to every screen after it.
 *
 * V2 works out a price as the reviewer changes their cover. Without this, the
 * summary card and the policy bar further down the journey fall back to the
 * figures drawn in the frames, so a reviewer who raised their cover would see
 * one price on the first screen and another at payment.
 */
export type Quote = {
  /** "₹20 Lakhs" */
  cover?: string;
  /** "₹40,429" */
  premium?: string;
};

export const QuoteContext = createContext<Quote | null>(null);

export function useQuote() {
  return useContext(QuoteContext);
}
