/**
 * Content for the renewal review screen.
 *
 * Question copy, policy figures and the sidebar summary come from the current
 * frame (node 75:5200). Follow-up content comes from the expanded variant
 * (node 70:3126). Every question is now phrased so that "Yes" means something
 * has changed, which is what opens the follow-up beneath it.
 */

export type QuestionId =
  | "location"
  | "members"
  | "conditions"
  | "cover"
  | "refund-account"
  | "nominee"
  | "add-ons";

export type Question = {
  id: QuestionId;
  title: string;
  description: string;
};

export const questions: Question[] = [
  {
    id: "location",
    title: "Moved from Chennai, 600096 since last year?",
    description:
      "Premiums shift by city. If you've moved, we'll re-check the price before you renew sometimes it drops.",
  },
  {
    id: "members",
    title: "Need to add or remove anyone?",
    description:
      "A new baby or spouse left off the policy is the most common reason a claim gets rejected.",
  },
  {
    id: "conditions",
    title: "Any new health conditions to declare?",
    description:
      "Tell us about anything new, even if it's minor. Undeclared conditions can void a claim later.",
  },
  {
    id: "cover",
    title: "Want to increase your cover?",
    description:
      "In 2027, hospital costs rose, highlighting challenges. As expenses rise, individuals face strain on affordability.",
  },
  {
    id: "refund-account",
    title: "Change, Deena's Saving Account xxxx5677 (SBI)?",
    description: "Used for auto-debit and claim payouts.",
  },
  {
    id: "nominee",
    title: "Change nominee from Sneha Kumari, spouse?",
    description: "The nominee is who gets paid.",
  },
  {
    id: "add-ons",
    title: "Like to add new add-ons to increase more coverage?",
    description:
      "Add-ons sit on top of your base cover. Pick the ones that fit how your family uses the policy.",
  },
];

/** Read-only chips under question 2 showing who is on the policy today. */
export const coveredMembers = [
  { id: "you", label: "You (45)" },
  { id: "priya", label: "Priya (42)" },
  { id: "eren", label: "Eren Yeager (12)" },
  { id: "mikasa", label: "Mikasa (10)" },
];

/** Declared conditions under question 3. Only members with a declaration show. */
export type ConditionRow = {
  member: string;
  relationship: string;
  conditions: string[];
};

export const conditionRows: ConditionRow[] = [
  {
    member: "Deena Dhayalan (45)",
    relationship: "Husband",
    conditions: ["High cholesterol", "Hypertension", "Diabetes"],
  },
  {
    member: "Priya (42)",
    relationship: "Spouse",
    conditions: ["High cholesterol", "Hypertension"],
  },
];

/* ---------------------------------------------------------------------------
   Right-hand summary
   --------------------------------------------------------------------------- */

export const policy = {
  daysLeft: 13,
  name: "Optima Secure",
  uin: "UIN NO - CHIHLIP23128V012223",
  insurer: "HDFC ERGO",
  members: ["You (45)", "Spouse (42)", "Son (12)", "Daughter (10)"],
  pinCode: "600096, Chennai",
  cover: "₹15 Lakhs",
  premium: "₹34,999",
  premiumPeriod: "1 year",
  basePremium: {
    label: "Base Premium (Aspire Titanium+)",
    value: "₹24,750",
  },
  /**
   * Frame 75:5200 lists "Cumulative Bonus Super" twice; the second row keeps
   * its price but takes the third add-on name used in the earlier frames.
   */
  previousAddOns: [
    { name: "Cumulative Bonus Super", price: "₹2,419" },
    { name: "Annual Health Checkup", price: "₹2,726" },
    { name: "Claim Shield", price: "₹1,455" },
  ],
  totalPremium: 34999,
  taxSaving: "₹7,500",
};

export type BenefitTone = "green" | "orange" | "cyan";

export const benefits: {
  icon: string;
  tone: BenefitTone;
  title: string;
  description: string;
  /** Descriptions that run to two lines get the looser leading. */
  multiline?: boolean;
}[] = [
  {
    icon: "/policy/hospital.svg",
    tone: "green",
    title: "Hospitalization",
    description: "Covered upto ₹10 Lakh",
  },
  {
    icon: "/policy/bed1.svg",
    tone: "orange",
    title: "Room Category",
    description: "Can take Single Private A/C room",
  },
  {
    icon: "/policy/bed2.svg",
    tone: "cyan",
    title: "Pre-Hospitalization",
    description:
      "All expenses incurred in 60 days leading to hospitalization are covered",
    multiline: true,
  },
];

export type WaitTone = "green" | "orange" | "purple";

export const waitingPeriods: {
  duration: string;
  description: string;
  tone: WaitTone;
  link?: string;
}[] = [
  { duration: "30 Days", description: "All claims except accidents", tone: "green" },
  {
    duration: "2 Years",
    description: "For listed diseases",
    tone: "orange",
    link: "full list",
  },
  {
    duration: "3 Years",
    description: "For diseases like Cataract",
    tone: "purple",
  },
];

export const exclusions = [
  "Domiciliary Treatment only taken at home",
  "Ayush treatments",
  "Out Patient Consultations (OPD)",
];

/* ---------------------------------------------------------------------------
   Follow-up content, revealed when a question is answered "Yes".
   --------------------------------------------------------------------------- */

/** Relations offered under "Who's changed?" (nodes 70:3345 - 70:3376). */
export type HouseholdOption = {
  id: string;
  label: string;
  onPolicy: boolean;
  counted?: boolean;
};

export const householdOptions: HouseholdOption[] = [
  { id: "you", label: "You", onPolicy: true },
  { id: "spouse", label: "Spouse", onPolicy: true },
  { id: "sons", label: "Son(s)", onPolicy: true, counted: true },
  { id: "daughters", label: "Daughter(s)", onPolicy: true, counted: true },
  { id: "father", label: "Father", onPolicy: false },
  { id: "mother", label: "Mother", onPolicy: false },
  { id: "father-in-law", label: "Father in law", onPolicy: false },
  { id: "mother-in-law", label: "Mother in law", onPolicy: false },
];

/** Cover options (nodes 70:3380, 70:3394, 70:3407). */
export type CoverOption = {
  id: string;
  amount: string;
  title: string;
  description: string;
  badge?: string;
  tone: "blue" | "green" | "purple";
};

export const coverOptions: CoverOption[] = [
  {
    id: "5l",
    amount: "₹5L",
    title: "Essential Cover",
    description: "Covers the majority of hospital stays for a family of four.",
    tone: "blue",
  },
  {
    id: "10l",
    amount: "₹10L",
    title: "Balanced for your family",
    description: "Big-illness ready. Restoration + bonus stretch it further.",
    badge: "Recommended",
    tone: "green",
  },
  {
    id: "15l",
    amount: "₹15L",
    title: "Maximum cover",
    description: "Highest available across all three shortlisted insurers.",
    badge: "Max cover",
    tone: "purple",
  },
];

/** Refund account form (nodes 70:3426 - 70:3437). */
export const bankFormDefaults = {
  accountNumber: "Deena's Saving Account",
  ifsc: "SBIN0000800",
  bankName: "State Bank of India",
  accountType: "Savings account",
};

export const bankNameOptions = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

export const accountTypeOptions = [
  "Savings account",
  "Current account",
  "Salary account",
];

/** Nominee candidates (nodes 70:3450 - 70:3463). */
export type NomineeCandidate = {
  id: string;
  name: string;
  relation: string;
  current: boolean;
};

export const nomineeCandidates: NomineeCandidate[] = [
  { id: "sneha", name: "Sneha Naveen", relation: "spouse", current: true },
  { id: "eren", name: "Eren Yeager", relation: "son", current: false },
  { id: "uma", name: "Uma Kumari", relation: "mother", current: false },
];

/**
 * Add-ons offered under question 7. Names and prices are the optional add-ons
 * listed in frame 63:2306; the picker itself is not in any supplied frame.
 */
export type AddOnOption = {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
};

export const optionalAddOns: AddOnOption[] = [
  { id: "instant-cover", name: "Instant Cover", price: 5056, priceLabel: "₹5,056" },
  {
    id: "unlimited-restoration",
    name: "Unlimited Restoration",
    price: 7730,
    priceLabel: "₹7,730",
  },
];

/** ₹ formatting that matches the figures already on the page. */
export function formatRupees(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
