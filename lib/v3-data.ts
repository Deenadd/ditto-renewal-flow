/**
 * V3 — the renewal screen as a pre-filled order you review, rather than a form
 * you fill in. Not drawn in Figma; designed from a critique of V2, and the
 * reasons are in the README under "V3".
 *
 * Everything here is priced so the receipt adds up: every line on it sums to
 * the total, and the total is the one the rest of the journey shows.
 */

import { policy, recommendedAddOns } from "@/lib/renewal-data";
import {
  CURRENT_LAKHS,
  RECOMMENDED_LAKHS,
  premiumFor,
  v2Address,
  v2Members,
  type V2Member,
} from "@/lib/v2-data";

export type { V2Member as V3Member };
export { CURRENT_LAKHS, RECOMMENDED_LAKHS, v2Members as v3Members };

/* ---------------------------------------------------------------------------
   Pricing. All figures include 18% GST, because that is what gets paid.
   --------------------------------------------------------------------------- */

/** The add-ons already on the policy. They carry over and cannot be removed. */
export const keptAddOns = policy.previousAddOns.map((addOn) => ({
  name: addOn.name,
  price: Number(addOn.price.replace(/[^\d]/g, "")),
}));

export const keptAddOnsTotal = keptAddOns.reduce((sum, a) => sum + a.price, 0);

/**
 * The cover line on the receipt: whatever of the renewal price the kept
 * add-ons don't account for, stepping by the frame's own "+₹450 a month" per
 * ₹5 lakh. At ₹15 lakh the receipt therefore totals exactly ₹34,999.
 */
export function coverPrice(lakhs: number) {
  return premiumFor(lakhs) - keptAddOnsTotal;
}

/** Renewing exactly as the policy is today, for one year. */
export const RENEWAL_AS_IS = policy.totalPremium;

export type TermYears = 1 | 2 | 3;

/**
 * Multi-year discounts. The frames quote savings that do not follow from any
 * price on the page ("8 months free" on a ₹73,410 three-year term alongside a
 * ₹34,999 annual premium), so V3 applies a flat rate to whatever the year
 * costs, which keeps the saving honest as cover and add-ons change.
 */
export const termDiscount: Record<TermYears, number> = { 1: 0, 2: 0.075, 3: 0.1 };

export const terms: { years: TermYears; label: string }[] = [
  { years: 1, label: "1 year" },
  { years: 2, label: "2 years" },
  { years: 3, label: "3 years" },
];

export function termTotal(annual: number, years: TermYears) {
  return Math.round(annual * years * (1 - termDiscount[years]));
}

export function termSaving(annual: number, years: TermYears) {
  return annual * years - termTotal(annual, years);
}

export const taxSaving = policy.taxSaving;

/* ---------------------------------------------------------------------------
   Add-ons worth adding.
   --------------------------------------------------------------------------- */

export type V3AddOn = {
  id: string;
  name: string;
  price: number;
  wasPrice?: number;
  /** What it does, in one line. */
  does: string;
  /** Why this family in particular. Only where there is a real reason. */
  why?: string;
};

const priceOf = (id: string) =>
  Number(
    recommendedAddOns
      .find((addOn) => addOn.id === id)!
      .priceLabel.replace(/[^\d]/g, ""),
  );

/**
 * The frame's descriptions are rewritten to say what each add-on does.
 * Two were swapped in the source: "Reduction in PED" carried Claim Shield's
 * line about syringes and gloves, and "Unlimited Restoration" carried a line
 * about waiting periods, which is what PED reduction does.
 */
export const suggestedAddOns: V3AddOn[] = [
  {
    id: "instant-cover",
    name: "Instant Cover",
    price: priceOf("instant-cover"),
    wasPrice: 5056,
    does: "Cuts the wait on diabetes, blood pressure, cholesterol and asthma claims to 30 days.",
    why: "Deena and Priya have declared conditions this covers.",
  },
  {
    id: "unlimited-restoration",
    name: "Unlimited Restoration",
    price: priceOf("unlimited-restoration"),
    does: "If a big claim uses up your cover, it refills — as many times as you need in a year.",
    why: "Four of you share one cover.",
  },
];

export const moreAddOns: V3AddOn[] = [
  {
    id: "reduction-in-ped",
    name: "Reduction in PED",
    price: priceOf("reduction-in-ped"),
    does: "Shortens the waiting period on conditions you already have.",
  },
  {
    id: "opd-care",
    name: "OPD Care",
    price: priceOf("opd-care"),
    does: "Eight doctor visits a year for each person, up to ₹500 a visit.",
  },
  {
    id: "be-fit-benefit",
    name: "Be-Fit Benefit",
    price: priceOf("be-fit-benefit"),
    does: "Gym access for everyone aged 12 and over.",
  },
];

export const allAddOns = [...suggestedAddOns, ...moreAddOns];

/* ---------------------------------------------------------------------------
   The cover recommendation.
   --------------------------------------------------------------------------- */

export const coverPitch = {
  eyebrow: "Our one recommendation",
  title: `Raise your cover to ₹${RECOMMENDED_LAKHS} lakh`,
  lead: `₹${CURRENT_LAKHS} lakh doesn't stretch as far as it did when you bought it.`,
  points: [
    "A treatment that cost ₹12 lakh in 2024 costs about ₹15 lakh now.",
    "Four of you share it — one heart treatment would use up nearly half.",
    "At 45 it's a simple form. At 50 you may need medical tests.",
  ],
};

/** Amounts above the recommendation, offered quietly once it's been seen. */
export const otherCovers = [25, 30];

/* ---------------------------------------------------------------------------
   Copy.
   --------------------------------------------------------------------------- */

export const v3Intro = {
  title: "Your renewal is ready, Deena",
  lead: "Everything carries over as it is today. We'd change one thing, and there are a couple of optional extras — the price updates as you go.",
  deadline: "30 September",
  daysLeft: policy.daysLeft,
};

/* ---------------------------------------------------------------------------
   State, what changed, and what it all costs.
   --------------------------------------------------------------------------- */

export type Address = { street: string; city: string; pinCode: string };

export const addressOnPolicy: Address = {
  street: v2Address.street,
  city: v2Address.city,
  pinCode: v2Address.pinCode,
};

export type V3State = {
  address: Address;
  /** People added this session. */
  added: V2Member[];
  /** Ids of people on the policy who were taken off. */
  removed: string[];
  lakhs: number;
  /** Whether the cover recommendation has been answered, either way. */
  coverDecided: boolean;
  /** Add-ons chosen here, on top of the ones kept. */
  addOns: string[];
  years: TermYears;
};

export const initialV3State: V3State = {
  address: addressOnPolicy,
  added: [],
  removed: [],
  lakhs: CURRENT_LAKHS,
  coverDecided: false,
  addOns: [],
  years: 1,
};

export function v3Changes(state: V3State) {
  return {
    address:
      state.address.street !== addressOnPolicy.street ||
      state.address.city !== addressOnPolicy.city ||
      state.address.pinCode !== addressOnPolicy.pinCode,
    members: state.added.length > 0 || state.removed.length > 0,
    cover: state.lakhs !== CURRENT_LAKHS,
    addOns: state.addOns.length > 0,
    term: state.years !== 1,
  };
}

export type ReceiptLine = { label: string; value: number; added?: boolean };

export type Priced = {
  lines: ReceiptLine[];
  /** What one year costs with everything chosen. */
  annual: number;
  /** How much more a year than renewing exactly as is. */
  delta: number;
  years: TermYears;
  /** What gets paid, for the whole term. */
  total: number;
  /** What the longer term knocks off. */
  saving: number;
  perYear: number;
};

export function priceV3(state: V3State): Priced {
  const extras = allAddOns.filter((addOn) => state.addOns.includes(addOn.id));
  const lines: ReceiptLine[] = [
    {
      label: `Cover, ₹${state.lakhs} lakh`,
      value: coverPrice(state.lakhs),
      added: state.lakhs !== CURRENT_LAKHS,
    },
    { label: `Add-ons you keep (${keptAddOns.length})`, value: keptAddOnsTotal },
    ...extras.map((addOn) => ({ label: addOn.name, value: addOn.price, added: true })),
  ];
  const annual = lines.reduce((sum, line) => sum + line.value, 0);
  const total = termTotal(annual, state.years);

  return {
    lines,
    annual,
    delta: annual - RENEWAL_AS_IS,
    years: state.years,
    total,
    saving: termSaving(annual, state.years),
    perYear: Math.round(total / state.years),
  };
}

/** What happens after Continue, so it is never a surprise. */
export function nextStepsFor(state: V3State) {
  const changed = v3Changes(state);
  if (changed.address || changed.members) {
    return "Next, a quick ID check and a short form, then payment.";
  }
  if (changed.cover || changed.addOns) {
    return "Next, a quick ID check, then payment.";
  }
  return "Next, payment.";
}

export const rupees = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export const yearsLabel = (years: TermYears) =>
  years === 1 ? "1 year" : `${years} years`;
