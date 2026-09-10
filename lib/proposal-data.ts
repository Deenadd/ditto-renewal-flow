/**
 * Proposal form and its summary (nodes 122:8241, 122:8373, 122:8914, 122:9096).
 *
 * The frames show a single member, "Uma Kumari", with placeholder dates. The
 * build runs the form over the people already on this policy and gives them
 * dates and measurements consistent with the ages used elsewhere.
 */

export type InsuredMember = {
  id: string;
  name: string;
  relation: string;
  dob: string;
  height: string;
  weight: string;
};

export const insuredMembers: InsuredMember[] = [
  {
    id: "deena",
    name: "Deena Dhayalan",
    relation: "self",
    dob: "12/03/1981",
    height: "5ft, 9inch",
    weight: "78 kg",
  },
  {
    id: "priya",
    name: "Priya",
    relation: "spouse",
    dob: "22/07/1984",
    height: "5ft, 4inch",
    weight: "61 kg",
  },
  {
    id: "eren",
    name: "Eren Yeager",
    relation: "son",
    dob: "05/09/2014",
    height: "4ft, 6inch",
    weight: "34 kg",
  },
  {
    id: "mikasa",
    name: "Mikasa",
    relation: "daughter",
    dob: "18/11/2016",
    height: "4ft, 2inch",
    weight: "28 kg",
  },
];

/** The same set runs through both medical history sections. */
export const medicalQuestions = [
  "Undergone any tests or medical investigation?",
  "Is there any hospitalisation history",
  "Any regular medication?",
  "Any surgery had happened to you?",
  "Have you had any surgical procedures?",
  "Do you have any allergies?",
  "Have you experienced any serious illness?",
  "Is there a family history of chronic diseases?",
  "Have you ever been diagnosed with a mental health condition?",
  "Do you use any recreational drugs?",
  "Have you received vaccinations in the past year?",
  "Do you have any mobility issues?",
  "Have you ever been treated for substance abuse?",
  "Have you had any recent health screenings?",
  "Do you have a primary care physician?",
];

export const medicalIntro =
  "Does any person(s) to be insured currently or in past Diagnosed, Suffered, Treated, Taken Medication for any medical condition?";

/** Fields that open under a "Yes" in Medical History 2 (node 122:8373). */
export const treatmentTypes = [
  "Medication",
  "Surgery",
  "Therapy",
  "Lifestyle change",
  "Other",
];

export const treatmentStatuses = ["Cured", "Ongoing", "Completed", "Under review"];

export const stateOptions = [
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Telangana",
  "Delhi",
];

export const lifestyleQuestions = [
  {
    id: "smoking",
    title: "Do you have Smoking habit?",
    detail: "No. of cigarettes/bidi sticks per week",
  },
  { id: "alcohol", title: "Do you consume alcohol?" },
  { id: "other-drugs", title: "Any type of other drugs like ghutka, paan, tobacco, etc..." },
];

/** Declarations on the summary (node 122:8914). */
export const declarations = [
  "I hereby declare, on my behalf and on behalf of all persons proposed to be insured, that the above statements, answers and/or particulars given by me are true and complete in all respects to the best of my knowledge and that I am authorised to propose on behalf of these other persons.",
  "I understand that the information provided by me will form the basis of the insurance policy, is subject to the Board approved underwriting policy of the insurer and that the policy will come into force only after full payment of the premium chargeable.",
  "I authorise the company to share information pertaining to my proposal including the medical records of the insured/proposer for the sole purpose of underwriting the proposal and/or claims settlement and with any Governmental and/or Regulatory Authority.",
];

/* ---------------------------------------------------------------------------
   The panel beside each step of the anchor screen.
   --------------------------------------------------------------------------- */

export type StepPanel = {
  title: string;
  lead: string;
  items: { label: string; note?: string }[];
  /** Numbered steps get a connector; a plain list does not. */
  connected?: boolean;
};

export const stepPanels: Partial<Record<string, StepPanel>> = {
  proposal: {
    title: "Proposal form steps",
    lead: "These steps to ensure the seamless completion of your proposal.",
    connected: true,
    items: [
      { label: "Communication address" },
      { label: "Medical history 1" },
      { label: "Medical History 2" },
      { label: "Life Style" },
    ],
  },
  payment: {
    title: "Payment modes",
    lead: "Kindly confirm that the following payment options are available for this policy.",
    items: [
      { label: "Autopay", note: "Credit cards and debit cards" },
      { label: "Digital wallets", note: "PayTM, PhonePe, MobiKwik" },
      { label: "Bank transfers", note: "NEFT, RTGS, or IMPS" },
      { label: "UPI transactions" },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Which proposal steps apply (nodes 123:11849 - 123:12025).

   The form only asks what the review answers made necessary: the address step
   when the pin code changed, and the three health steps when someone was added.
   With neither, there is no proposal form to fill and the journey goes straight
   to payment.
   --------------------------------------------------------------------------- */

export type ProposalStepId = "address" | "basic" | "additional" | "lifestyle";

export const proposalStepMeta: Record<
  ProposalStepId,
  { tab: string; panel: string; title: string; lead: string }
> = {
  address: {
    tab: "Address",
    panel: "Communication address",
    title: "Communication Address",
    lead: "The Physical copies of your policy documents will be sent to this address",
  },
  basic: {
    tab: "Medical 1",
    panel: "Medical history 1",
    title: "Medical History 1 - Basic Details",
    lead: medicalIntro,
  },
  additional: {
    tab: "Medical 2",
    panel: "Medical History 2",
    title: "Medical History 2 - Additional Details",
    lead: medicalIntro,
  },
  lifestyle: {
    tab: "Life Style",
    panel: "Life Style",
    title: "Lifestyle",
    lead: "Does the applicant smoke, consume alcohol, or chew tobacco, ghutka or paan or use any recreational drugs?",
  },
};

/** The note that sits beside the step in play in the v2 sidebar. */
export const proposalStepNotes: Record<
  ProposalStepId,
  { title: string; body: string; points?: string[]; art?: string }
> = {
  address: {
    title: "Communication Address",
    body: "The Physical copies of your policy documents will be sent to this address",
  },
  basic: {
    title: "Basic medical details",
    body: "Your premiums might change depending on your past medical history.",
    points: [
      "It's not advisable to lie here because insurers generally find out when you do.",
      "In which case, they can even deny paying out a claim if they have reason to believe you deliberately misled them.",
    ],
  },
  additional: {
    title: "Additional medical details",
    body: "Your premiums might change depending on your past medical history.",
    points: [
      "It's not advisable to lie here because insurers generally find out when you do.",
      "In which case, they can even deny paying out a claim if they have reason to believe you deliberately misled them.",
    ],
  },
  lifestyle: {
    title: "Understanding your lifestyle",
    body: "These questions help the insurer gauge the kind of risk associated with insuring you as an individual.",
  },
};

export function proposalStepsFor(changed: {
  location: boolean;
  members: boolean;
}): ProposalStepId[] {
  const steps: ProposalStepId[] = [];
  if (changed.location) steps.push("address");
  if (changed.members) steps.push("basic", "additional", "lifestyle");
  return steps;
}
