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

/* ---------------------------------------------------------------------------
   Follow-up content, revealed when a question is answered "No".
   Source: the "No" variant of the frame (node 70:3126).
   --------------------------------------------------------------------------- */

/** Relations offered under "Who's changed?" (nodes 70:3345 - 70:3376). */
export type HouseholdOption = {
  id: string;
  label: string;
  /** Already on the policy today. */
  onPolicy: boolean;
  /** Relations that can appear more than once carry a stepper. */
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

export const accountTypeOptions = ["Savings account", "Current account", "Salary account"];

/** Nominee candidates (nodes 70:3450 - 70:3463). */
export type NomineeCandidate = {
  id: string;
  name: string;
  relation: string;
  /** The nominee on the policy today. */
  current: boolean;
};

export const nomineeCandidates: NomineeCandidate[] = [
  { id: "sneha", name: "Sneha Naveen", relation: "spouse", current: true },
  { id: "eren", name: "Eren Yeager", relation: "son", current: false },
  { id: "uma", name: "Uma Kumari", relation: "mother", current: false },
];
