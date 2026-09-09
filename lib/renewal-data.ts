/**
 * Content for the renewal review screen.
 * Every string, figure and ordering is taken from the Figma frame
 * "Health purchase journey / policy for who - v1" (node 63:2306).
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
    title: "Still in Chennai, 600096?",
    description:
      "Premiums shift by city. If you've moved, we'll re-check the price before you renew sometimes it drops.",
  },
  {
    id: "members",
    title: "Still covering these four?",
    description:
      "A new baby or spouse left off the policy is the most common reason a claim gets rejected.",
  },
  {
    id: "conditions",
    title: "Check if current members share the same conditions.",
    description:
      "Tell us about anything new, even if it's minor. Undeclared conditions can void a claim later.",
  },
  {
    id: "cover",
    title: "Is ₹15 Lakhs still enough?",
    description:
      "In 2027, hospital costs rose, highlighting challenges. As expenses rise, individuals face strain on affordability.",
  },
  {
    id: "refund-account",
    title: "Same bank account can we use for refund?",
    description: "Used for auto-debit and claim payouts.",
  },
  {
    id: "nominee",
    title: "Sneha still your nominee? is that fine?",
    description: "The nominee is who gets paid.",
  },
  {
    id: "add-ons",
    title: "Happy with your current add-ons?",
    description:
      "Premiums shift by city. If you've moved, we'll re-check the price before you renew sometimes it drops.",
  },
];

/** Toggleable member chips under question 2. */
export type CoveredMember = {
  id: string;
  label: string;
};

export const coveredMembers: CoveredMember[] = [
  { id: "you", label: "You (45)" },
  { id: "priya", label: "Priya (42)" },
  { id: "eren", label: "Eren Yeager (12)" },
  { id: "mikasa", label: "Mikasa (10)" },
];

/** Pre-existing disease table under question 3. */
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
  { member: "Eren Yeager (12)", relationship: "Son", conditions: [] },
  { member: "Mikasa (10)", relationship: "Daughter", conditions: [] },
];

/** Refund account card under question 5. */
export const bankAccount = [
  { label: "Account name:", value: "Deena's Saving Account" },
  { label: "IFSC code:", value: "SBIN0000800" },
  { label: "Bank name:", value: "State Bank of India" },
  { label: "Account type:", value: "Savings account" },
];

/** Nominee card under question 6. */
export const nominee = [
  { label: "Full name:", value: "Sneha Kumari" },
  { label: "Date of birth:", value: "19/02/2001, 24 years" },
  { label: "Relationship:", value: "Spouse" },
];

/** Right-hand policy summary. */
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
  mandatoryAddOns: [
    { name: "Cumulative Bonus Super", price: "₹5,056" },
    { name: "Annual Health Checkup", price: "₹7,730" },
    { name: "Claim Shield", price: "₹7,730" },
  ],
  selectedAddOns: [
    { name: "Instant Cover", price: "₹5,056" },
    { name: "Unlimited Restoration", price: "₹7,730" },
  ],
  /** Figma shows "Selected Add-ons (1/5)" above a two-row list; both
      figures are reproduced as designed rather than derived from the list. */
  selectedAddOnsCount: 1,
  selectedAddOnsAvailable: 5,
  totalPremium: "₹34,999",
  taxSaving: "₹7,500",
};
