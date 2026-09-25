/**
 * V2 renewal screen (file kalCtplJimHm1xtOJGC60d, node 142:3114) and the
 * cover-slider states beside it (node 142:3692).
 *
 * V2 drops the Yes/No question list entirely. Every section shows what is on
 * the policy today and lets the reviewer change it in place, so the screen
 * reads as five checks rather than eight questions.
 */

import { policy, recommendedAddOns } from "@/lib/renewal-data";

export const v2Intro = {
  title: "Let's get your renewal sorted, Deena",
  description:
    "Five quick checks and you're covered for another year. Anything you don't change stays exactly as it is.",
};

/** Progress tabs (node 142:3513). Only the first step is built. */
export const v2JourneyTabs = [
  { id: "renewal", label: "Renewal" },
  { id: "review", label: "Review & Pay" },
  { id: "done", label: "Done" },
] as const;

/** Expiry banner (node 142:3181). */
export const v2ExpiryBanner = {
  lead: `Your policy expires on 30 September, ${policy.daysLeft} days from today.`,
  rest: "Renew before then and your waiting periods and no-claim bonus carry over untouched.",
};

export const v2Sections = {
  address: {
    title: "Where you live",
    description:
      "Health premiums depend on your city. Moved recently? Let us know and we'll re-check your price. Sometimes it even goes down.",
  },
  members: {
    title: "Need to add or remove anyone?",
    description:
      "New baby or spouse? Add them now for immediate protection. Missing family members often delay claims.",
  },
  cover: {
    title: "Your cover amount, is ₹15 lakh still enough?",
    description:
      "Hospital costs have changed since you bought this policy. Here's our honest take on what your family needs today.",
  },
  addOns: {
    title: "Your add-ons, make your cover work harder",
    description: "Keep what's working, and see what's worth adding this year.",
  },
  period: {
    title: "Policy period, lock in today's price",
    description:
      "Premiums usually rise every year as you get older. Pay for a longer term now and you freeze today's rate, plus get a discount for sticking with us.",
  },
};

export const v2Address = {
  label: "Your address on the policy",
  street: "14/3 Rajiv Gandhi Salai, Perungudi",
  city: "Chennai",
  pinCode: "600096",
};

export function formatAddress(a: {
  street: string;
  city: string;
  pinCode: string;
}) {
  return `${a.street}, ${a.city} ${a.pinCode}`;
}

export type V2Member = {
  id: string;
  name: string;
  age: number;
  relation: string;
  /** The policyholder, badged and not removable. */
  proposer?: boolean;
};

/**
 * The frame labels Priya "42 · Son" and Aarav "45 · self", which repeats the
 * proposer's own age and relationship. The ages and relationships here are the
 * ones the sidebar card carries: you 45, spouse 42, son 12, daughter 10.
 */
export const v2Members: V2Member[] = [
  { id: "deena", name: "Deena Dhayalan", age: 45, relation: "Self", proposer: true },
  { id: "priya", name: "Priya Dhayalan", age: 42, relation: "Spouse" },
  { id: "aarav", name: "Aarav", age: 12, relation: "Son" },
  { id: "sara", name: "Sara", age: 10, relation: "Daughter" },
];

/* ---------------------------------------------------------------------------
   Cover slider (node 142:3692)
   --------------------------------------------------------------------------- */

/** The cover the policy carries today. The slider cannot go below it. */
export const CURRENT_LAKHS = 15;
/** Where the green band starts, and where the "recommended" marker sits. */
export const RECOMMENDED_LAKHS = 20;

/**
 * The frame quotes "+₹450 / month" for the step from ₹15L to ₹20L, so each
 * ₹5L step is ₹5,430 a year on top of the ₹34,999 the policy costs today.
 * The frame's own point 2 prints ₹31,043 → ₹36,473, which does not agree with
 * the ₹34,999 on the card above it or in the sidebar; the figures are derived
 * here so the whole screen tells one story.
 */
const PREMIUM_AT_CURRENT = policy.totalPremium;
const PREMIUM_PER_STEP = 5430;

export function premiumFor(lakhs: number) {
  return PREMIUM_AT_CURRENT + ((lakhs - CURRENT_LAKHS) / 5) * PREMIUM_PER_STEP;
}

export type CoverStop = {
  lakhs: number;
  /** Tick label under the track. */
  label: string;
  /** Caption under the tick, present on three of the five stops. */
  note?: string;
};

export const coverStops: CoverStop[] = [
  { lakhs: 10, label: "₹10L" },
  { lakhs: 15, label: "₹15L", note: "you have now" },
  { lakhs: 20, label: "₹20L", note: "+₹450 / month" },
  { lakhs: 25, label: "₹25L", note: "extra coverage" },
  { lakhs: 30, label: "₹30L" },
];

export const coverLegend = [
  { id: "low", label: "Not enough" },
  { id: "good", label: "Right for your family" },
] as const;

/** How each cover picker presents the same five stops. */
export type CoverLayout =
  | "slider"
  | "cards"
  | "stepper"
  | "compare"
  | "list"
  | "table";

export const coverLayoutOptions: {
  value: CoverLayout;
  label: string;
  hint: string;
}[] = [
  {
    value: "slider",
    label: "Version 1 · Slider",
    hint: "The band you land in carries the advice.",
  },
  {
    value: "cards",
    label: "Version 2 · Cards",
    hint: "Every amount priced up front, one click to pick.",
  },
  {
    value: "stepper",
    label: "Version 3 · Stepper",
    hint: "One amount at a time, with what it costs a month.",
  },
  {
    value: "compare",
    label: "Version 4 · Compare",
    hint: "Keep what you have, or move up. Two panels, one decision.",
  },
  {
    value: "list",
    label: "Version 5 · List",
    hint: "A row per amount, with a line on what it buys you.",
  },
  {
    value: "table",
    label: "Version 6 · Table",
    hint: "All four side by side, figures aligned to compare.",
  },
];

/**
 * One line on what each amount buys, for the pickers with room to say it.
 * Only the amounts at or above the current cover, since the rest are closed.
 */
export const coverReasons: Record<number, string> = {
  15: "What you carry today. One big claim uses up nearly half of it.",
  20: "Back to what ₹15 lakh bought you in 2024.",
  25: "Room for a second big claim in the same year.",
  30: "Comfortable for four people in a metro, with room to spare.",
};

/** Which of the three treatments the chosen cover falls into. */
export type CoverZone = "low" | "good" | "high";

/** What each band means, said the same way wherever a picker names it. */
export const zoneLabels: Record<CoverZone, string> = {
  low: "Not enough",
  good: "Right for your family",
  high: "Extra room",
};

export function zoneFor(lakhs: number): CoverZone {
  if (lakhs < RECOMMENDED_LAKHS) return "low";
  if (lakhs === RECOMMENDED_LAKHS) return "good";
  return "high";
}

/** What this cover costs over the one on the policy today, a year and a month. */
export function deltaFor(lakhs: number) {
  const year = premiumFor(lakhs) - PREMIUM_AT_CURRENT;
  return { year, month: Math.round(year / 12 / 10) * 10 };
}

export type CoverVerdict = {
  zone: CoverZone;
  title: string;
  points: { title: string; body: string }[];
};

const inr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * The card under the slider, worded for the cover in play. The frame draws it
 * three times — ₹15L, ₹20L, ₹25L — and the ₹25L copy still names ₹20 lakh
 * throughout, so the figures are filled in from the stop instead.
 */
export function verdictFor(lakhs: number): CoverVerdict {
  const zone = zoneFor(lakhs);
  const extra = lakhs - CURRENT_LAKHS;
  const monthly = Math.round(((premiumFor(lakhs) - PREMIUM_AT_CURRENT) / 12) / 10) * 10;

  if (zone === "low") {
    return {
      zone,
      title: `₹${lakhs} lakh is not enough anymore`,
      points: [
        {
          title: "Hospital bills went up",
          body: "Treatment that cost ₹12 lakh in 2024 costs about ₹15 lakh now. So your ₹15 lakh covers less than it used to.",
        },
        {
          title: `Four of you share the same ₹${lakhs} lakh`,
          body: "One heart treatment (about ₹6 lakh) uses up nearly half of it, for the whole year.",
        },
        {
          title: "It's easiest to add now",
          body: "At 45 it's a simple form. At 50 you may need medical tests.",
        },
      ],
    };
  }

  const points = [
    {
      title: "Same protection as 2024",
      body: `₹${lakhs} lakh today does what your ₹${CURRENT_LAKHS} lakh did when you bought it.`,
    },
    {
      title: `About ₹${monthly.toLocaleString("en-IN")} more a month`,
      body: `Your yearly price goes from ${inr(PREMIUM_AT_CURRENT)} to ${inr(premiumFor(lakhs))}.`,
    },
    {
      title: `The extra ₹${extra} lakh starts soon`,
      body: "You can use it 30 days after renewal and for illnesses you already have, after 3 years.",
    },
  ];

  return zone === "good"
    ? { zone, title: `Good choice, ₹${lakhs} lakh covers your family again`, points }
    : { zone, title: `₹${lakhs} lakh gives you extra room`, points };
}

/* ---------------------------------------------------------------------------
   Add-ons (node 142:3114, the "Your add-ons" card)
   --------------------------------------------------------------------------- */

export type V2AddOn = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  wasPriceLabel?: string;
  highlight?: { before?: string; strong?: string; after?: string };
};

/**
 * Already on the policy, so they carry the blue lock tick rather than a
 * checkbox. The frame prints ₹2,419 against all three; the distinct prices
 * from the sidebar breakdown are used so the two agree.
 */
export const v2LockedAddOns: V2AddOn[] = [
  {
    id: "cumulative-bonus-super",
    name: "Cumulative Bonus Super",
    description:
      "In the event that the primary insured individual is younger than 46 years old or falls within the age range of 76 to 99 years, certain conditions may apply.",
    priceLabel: policy.previousAddOns[0].price,
  },
  {
    id: "annual-health-checkup",
    name: "Annual Health Checkup",
    description:
      "If the eldest insured is under 46, it may affect eligibility for benefits. Review policy details to understand age impacts. Discuss with an advisor to explore options for younger insured individuals.",
    priceLabel: policy.previousAddOns[1].price,
  },
  {
    id: "claim-shield",
    name: "Claim Shield",
    description:
      "This policy encompasses a range of non-payable items, including essential medical supplies such as syringes, gloves, and kits.",
    priceLabel: policy.previousAddOns[2].price,
  },
];

const byId = (id: string) => recommendedAddOns.find((addOn) => addOn.id === id)!;

/** The two the frame puts under "Picked for your family". */
export const v2PickedAddOns: V2AddOn[] = [
  byId("instant-cover"),
  byId("unlimited-restoration"),
];

/**
 * The frame draws "More options" as a heading with nothing under it. It opens
 * onto the rest of the catalogue here rather than staying a dead label.
 */
export const v2MoreAddOns: V2AddOn[] = recommendedAddOns.filter(
  (addOn) => !v2PickedAddOns.some((picked) => picked.id === addOn.id),
);

export const v2AddOnGroups = {
  locked: `Already on your policy (${v2LockedAddOns.length})`,
  picked: "Picked for your family",
  more: "More options",
};

/** Add-ons selected when the screen opens: the one the frame draws ticked. */
export const v2DefaultAddOns = v2PickedAddOns
  .filter((addOn) => recommendedAddOns.find((r) => r.id === addOn.id)?.defaultSelected)
  .map((addOn) => addOn.id);

export const v2Footer = {
  clear: "Clear all changes",
  confirm: "Confirm & continue",
};
