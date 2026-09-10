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
    title: "Change, Deena's Saving Account x5677 (SBI)?",
    description: "Used for auto-debit and claim payouts.",
  },
  {
    id: "nominee",
    title: "Change nominee from Sneha Kumari (spouse)?",
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
  planName: "Aspire Titanium+",
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

/** Relationship choices in the add-a-member form (node 76:6185). */
export const relationshipOptions = [
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Father in law",
  "Mother in law",
];

/** Cover options (node 76:6127). */
export type CoverOption = {
  id: string;
  amount: string;
  /** How the same amount reads in the sidebar. */
  sidebarLabel: string;
  title: string;
  description: string;
  /** The amount already on the policy, selected when the block opens. */
  current?: boolean;
};

export const coverOptions: CoverOption[] = [
  {
    id: "15l",
    amount: "₹15L",
    sidebarLabel: "₹15 Lakhs",
    title: "Essential Cover",
    description: "Covers the majority of hospital stays for a family of four.",
    current: true,
  },
  {
    id: "20l",
    amount: "₹20L",
    sidebarLabel: "₹20 Lakhs",
    title: "Balanced for your family",
    description: "Big-illness ready. Restoration + bonus stretch it further.",
  },
  {
    id: "25l",
    amount: "₹25L",
    sidebarLabel: "₹25 Lakhs",
    title: "Maximum cover",
    description: "Highest available across all three shortlisted insurers.",
  },
];

export const defaultCoverId =
  coverOptions.find((option) => option.current)?.id ?? coverOptions[0].id;

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
 * Add-ons card under question 7 (node 76:6225).
 *
 * The card lists the add-ons already on the policy, five recommended ones the
 * reviewer can pick, and a collapsed group holding the rest of the catalogue.
 */
export type Highlight = {
  before?: string;
  strong?: string;
  after?: string;
};

export type RecommendedAddOn = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  /** Struck-through original, shown when the premium is discounted. */
  wasPriceLabel?: string;
  highlight: Highlight;
  /** Term choices rendered as radios inside the card. */
  terms?: string[];
  defaultSelected?: boolean;
};

export const recommendedAddOns: RecommendedAddOn[] = [
  {
    id: "instant-cover",
    name: "Instant Cover",
    description:
      "This add on will cut waiting periods to a mere 30 days for Hypertension/Diabetes/Hyperlipidaemia/Asthma",
    priceLabel: "₹1,264",
    wasPriceLabel: "₹5,056",
    highlight: {
      before: "This month, we've seen a ",
      strong: "75% significant decrease",
      after: " in premium prices!",
    },
    defaultSelected: true,
  },
  {
    id: "unlimited-restoration",
    name: "Unlimited Restoration",
    description:
      "This optional cover reduces the applicable waiting period from 48 months to 12 months.",
    priceLabel: "₹7,730",
    highlight: { before: "Restore your safety net anytime stay covered, always!" },
  },
  {
    id: "reduction-in-ped",
    name: "Reduction in PED",
    description: "Covers non-payable items like syringes, gloves & PPE kits.",
    priceLabel: "₹3,650",
    terms: ["1 Year", "2 Year"],
    highlight: {
      strong: "Only ₹10 a day,",
      after: " which can save you over a lakh.",
    },
  },
  {
    id: "opd-care",
    name: "OPD Care",
    description:
      "With this addon, each insured member can avail up to 4 in-person consultations with a General Physician and 4 with a Specified Specialist annually, with a maximum reimbursement of Rs. 500 per visit.",
    priceLabel: "₹2,726",
    highlight: {
      strong: "8 consults a year,",
      after: " ₹500 back each time care made effortless!",
    },
  },
  {
    id: "be-fit-benefit",
    name: "Be-Fit Benefit",
    description:
      "This add-on provides insured members aged 12 and above with unlimited access to gyms listed by the service provider.",
    priceLabel: "₹1,455",
    highlight: {
      strong: "Unlimited gym access",
      after: " in your location because your health is your wealth!",
    },
  },
];

/**
 * Add-ons already on the policy. The card draws all three at ₹2,419; the
 * distinct prices from the sidebar breakdown are used instead.
 */
export const lockedAddOns = policy.previousAddOns;

/** The collapsed group at the foot of the card (node 76:6246). */
export const otherAddOnsCount = 6;

/** ₹ formatting that matches the figures already on the page. */
export function formatRupees(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/* ---------------------------------------------------------------------------
   Policy periods (node 78:6932), shown once the premium has been worked out.
   --------------------------------------------------------------------------- */

export type PolicyPeriod = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  /**
   * Struck-through original. The frame prints ₹5,056 against a ₹55,972
   * premium; the figure here is the premium plus the saving the same card
   * quotes, so the discount reads correctly.
   */
  wasPriceLabel?: string;
  saving?: { amount: string; months: string };
};

export const policyPeriods: PolicyPeriod[] = [
  {
    id: "1-year",
    name: "1 Year Periods",
    description:
      "Renew every year. The premium is re-checked at each renewal.",
    priceLabel: "₹7,730",
  },
  {
    id: "2-year",
    name: "2 Year Periods",
    description:
      "Pay for two years up front and hold this year's rate for both.",
    priceLabel: "₹55,972",
    wasPriceLabel: "₹62,401",
    saving: { amount: "₹6,429", months: "2 months" },
  },
  {
    id: "3-year",
    name: "3 Year Periods",
    description:
      "Pay for three years up front and hold this year's rate for all three.",
    priceLabel: "₹73,410",
    saving: { amount: "₹18,599", months: "8 months" },
  },
];

export const inflationOffer = {
  title: "Save 18% on medical inflation",
  description: "Secure savings with a fixed premium rate despite 20% inflation.",
};

/** Footnote under the sidebar on the summary screen (node 78:6867). */
export const digitalDiscountNote = "Total premium included 5% digital discount";

/* ---------------------------------------------------------------------------
   Anchor screen (node 79:7114), reached once the policy is bought.
   --------------------------------------------------------------------------- */

export const resumeBanner = {
  title: "Resume anytime! We autosave your progress.",
  description:
    "Check your saved points on all screens. A link to the wizard has been sent to your phone to resume using your OTP.",
};

export type IssuanceStep = {
  title: string;
  description: string;
  action?: { label: string; note: string };
};

export const issuanceSteps: IssuanceStep[] = [
  {
    title: "Complete your KYC",
    description:
      "As per IRDAI, Customer needs to completes KYC before buying a policy!",
    action: { label: "Start", note: "Takes 5 mins" },
  },
  {
    title: "Proposal form",
    description: "Answer a set of questions to fill out your online application",
  },
  {
    title: "Make payment",
    description: "Make payment of your first premium",
  },
  {
    title: "Policy issuance",
    description:
      "If everything checks out, You will receive a copy of the policy as soon as the insurer accepts the proposal.",
  },
];

export const supportPanel = {
  platform: {
    title: "Issues with the platform",
    description: "Please check reach out to us and we will help you out.",
    email: "help@joinditto.in",
  },
  advisor: {
    title: "What should you do if you're unsure?",
    description:
      "Rather than filling something which you are not sure about, talk to your advisor and ensure if you are not missing out on anything.",
    label: "Contact us at:",
    phone: "080 - 48816818",
    email: "help@joinditto.in",
  },
};

/* ---------------------------------------------------------------------------
   Proposer KYC (nodes 121:7357, 121:7520, 121:7699).
   --------------------------------------------------------------------------- */

export const kycUploadBanner = {
  title: "Don't have PAN and Aadhaar card handy?",
  body: "You can upload documents (Pan card, Voter Id, Driving License, Passport). The insurance team will verify and complete your KYC before policy issuance.",
  link: "Click here to upload.",
};

export const kycSteps = [
  "Enter PAN card number",
  "Add date of birth in DD/MM/YYYY",
  "Click fetch KYC details",
];

export const kycHelp = {
  proposer: {
    title: "Who is a Proposer?",
    body: "Who is paying for the policy has to be the proposer.",
    stepsTitle: "Steps to complete PAN KYC",
    stepsLead: "Follow these steps for PAN KYC",
  },
  delay: {
    title: "Delay in verification",
    body: "Please check reach out to your advisor or send a email to us.",
    email: "support@joinditto.in",
  },
  failed: {
    title: "Failed without reason?",
    body: "Talk to us for instant response",
    label: "Contact us at:",
    phone: "080 - 48816818",
    email: "claims@joinditto.in",
  },
};

/** What the CKYC lookup returns (node 121:7520). */
export const kycRecord = {
  name: "BAAINI MAHESH",
  pan: "EUAPM5376K",
  dateOfBirth: "05-Oct-1998",
  permanentAddress: ["Sangareddy,", "Sangareddy - 502001"],
  currentAddress: ["Sangareddy,", "Sangareddy - 502001"],
};

export const kycGateway = {
  title: "Redirecting to HDFC ERGO",
  body: "Kindly proceed with the KYC through the HDFC ERGO Insurance KYC gateway.",
  url: "hdfcergoinsurance.kycgateway.com",
};
