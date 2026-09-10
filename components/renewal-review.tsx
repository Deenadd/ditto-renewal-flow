"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalculatingPremium } from "@/components/calculating-premium";
import { AnchorScreen } from "@/components/anchor-screen";
import { GatewayDialog } from "@/components/gateway-dialog";
import { KycScreen } from "@/components/kyc-screen";
import {
  ProposalFormScreen,
  emptyProposal,
  type ProposalMember,
  type ProposalState,
} from "@/components/proposal-form";
import { ProposalSummaryScreen } from "@/components/proposal-summary";
import { RenewalSummary, type SummaryLine } from "@/components/renewal-summary";
import { Question } from "@/components/question";
import { ConditionsTable } from "@/components/conditions-table";
import {
  PolicySummary,
  RenewalDeadlineBanner,
} from "@/components/policy-summary";
import {
  AddOnsFollowUp,
  BankFollowUp,
  ContactFollowUp,
  ConditionsFollowUp,
  CoverFollowUp,
  LocationFollowUp,
  MemberFollowUp,
  NomineeFollowUp,
  type AddOnState,
  type BankForm,
  type ContactForm,
  type NewMember,
} from "@/components/follow-ups";
import type { Answer } from "@/components/yes-no-group";
import {
  bankFormDefaults,
  contactDetails,
  coverOptions,
  coveredMembers,
  nomineeCandidates,
  defaultCoverId,
  recommendedAddOns,
  questions,
  type IssuanceStepId,
  type QuestionId,
} from "@/lib/renewal-data";
import { proposalStepsFor } from "@/lib/proposal-data";

type Answers = Partial<Record<QuestionId, Answer>>;

/** How long the premium calculation screen is held before the result shows. */
const CALCULATING_MS = 3200;

type Status =
  | "review"
  | "calculating"
  | "summary"
  | "anchor"
  | "kyc"
  | "proposal"
  | "proposal-summary"
  | "payment-gateway";

const defaultMember: NewMember = {
  fullName: "",
  relationship: "",
  dateOfBirth: "",
  hasConditions: null,
};

const defaultAddOns: AddOnState = {
  selected: recommendedAddOns
    .filter((addOn) => addOn.defaultSelected)
    .map((addOn) => addOn.id),
  terms: {},
};
const defaultNominees = nomineeCandidates
  .filter((candidate) => candidate.current)
  .map((candidate) => candidate.id);

export function RenewalReview() {
  const [answers, setAnswers] = useState<Answers>({});
  const [pinCode, setPinCode] = useState("");
  const [member, setMember] = useState<NewMember>(defaultMember);
  const [cover, setCover] = useState<string>(defaultCoverId);
  const [bankForm, setBankForm] = useState<BankForm>({ ...bankFormDefaults });
  const [contact, setContact] = useState<ContactForm>({ ...contactDetails });
  const [nominees, setNominees] = useState<string[]>(defaultNominees);
  const [addOns, setAddOns] = useState<AddOnState>(defaultAddOns);
  const [status, setStatus] = useState<Status>("review");
  /** Which issuance step is in play. */
  const [journeyStep, setJourneyStep] = useState<IssuanceStepId>("kyc");
  /** v2 runs the proposal one step at a time. */
  const [steppedForm, setSteppedForm] = useState(false);
  const [proposal, setProposal] = useState<ProposalState>(emptyProposal);

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question.id]).length,
    [answers],
  );
  const remaining = questions.length - answeredCount;
  const complete = remaining === 0;
  const hasChanges = useMemo(
    () => questions.some((question) => answers[question.id] === "yes"),
    [answers],
  );

  /* Hold the calculating screen briefly, then show the result. */
  useEffect(() => {
    if (status !== "calculating") return;
    const timer = window.setTimeout(() => setStatus("summary"), CALCULATING_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  /** One confirmation line per question, worded from the answer given. */
  const summaryLines: SummaryLine[] = useMemo(() => {
    const changed = (id: QuestionId) => answers[id] === "yes";
    const coverLabel =
      coverOptions.find((option) => option.id === cover)?.amount ?? "₹15L";

    return [
      {
        id: "location" as QuestionId,
        changed: changed("location"),
        text: changed("location")
          ? `Newly moved address, ${pinCode || "600095"}, Chennai`
          : "Same address, 600096, Chennai",
      },
      {
        id: "contact" as QuestionId,
        changed: changed("contact"),
        text: changed("contact")
          ? `New contact details, ${contact.phone}`
          : "Same contact details, no change",
      },
      {
        id: "members" as QuestionId,
        changed: changed("members"),
        text: changed("members")
          ? `Now covering ${coveredMembers.length + 1} people, ${
              member.fullName || "one more member"
            } added`
          : `Same ${coveredMembers.length} people covered`,
      },
      {
        id: "cover" as QuestionId,
        changed: changed("cover"),
        text: changed("cover")
          ? `Cover set to ${coverLabel}`
          : "Same ₹15 Lakhs cover",
      },
      {
        id: "add-ons" as QuestionId,
        changed: changed("add-ons"),
        text: changed("add-ons")
          ? `${addOns.selected.length} add-ons selected`
          : "No changes in current add-ons.",
      },
      {
        id: "conditions" as QuestionId,
        changed: changed("conditions"),
        text: changed("conditions")
          ? "New medical conditions to review with an advisor"
          : "You have same medical conditions",
      },
      {
        id: "refund-account" as QuestionId,
        changed: changed("refund-account"),
        text: changed("refund-account")
          ? `New account, ${bankForm.bankName}`
          : "Same, Deena's Saving Account xxxx5677 (SBI)",
      },
      {
        id: "nominee" as QuestionId,
        changed: changed("nominee"),
        text: changed("nominee")
          ? `Nominee updated, ${nominees.length} named`
          : "Same nominee, Sneha Kumari, spouse",
      },
    ];
  }, [answers, pinCode, contact.phone, member.fullName, cover, bankForm.bankName, nominees, addOns]);

  function answer(id: QuestionId, value: Answer) {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  }

  function toggleAddOn(id: string) {
    setAddOns((previous) => ({
      ...previous,
      selected: previous.selected.includes(id)
        ? previous.selected.filter((addOn) => addOn !== id)
        : [...previous.selected, id],
    }));
  }

  function setAddOnTerm(id: string, term: string) {
    setAddOns((previous) => ({
      ...previous,
      terms: { ...previous.terms, [id]: term },
    }));
  }

  function toggleNominee(id: string) {
    setNominees((previous) =>
      previous.includes(id)
        ? previous.filter((nominee) => nominee !== id)
        : [...previous, id],
    );
  }

  function clearAllChanges() {
    setAnswers({});
    setPinCode("");
    setMember(defaultMember);
    setCover(defaultCoverId);
    setBankForm({ ...bankFormDefaults });
    setContact({ ...contactDetails });
    setNominees(defaultNominees);
    setAddOns(defaultAddOns);
  }

  /**
   * The editable block behind each question. The review page opens it under the
   * question; the summary opens the same block under its confirmation line.
   */
  function followUp(id: QuestionId, context: "review" | "summary"): ReactNode {
    switch (id) {
      case "location":
        return (
          <LocationFollowUp pinCode={pinCode} onPinCodeChange={setPinCode} />
        );
      case "members":
        return (
          <MemberFollowUp
            member={member}
            showDivider={context === "review"}
            onChange={(patch) =>
              setMember((previous) => ({ ...previous, ...patch }))
            }
          />
        );
      case "contact":
        return (
          <ContactFollowUp
            form={contact}
            onChange={(patch) =>
              setContact((previous) => ({ ...previous, ...patch }))
            }
          />
        );
      case "conditions":
        return <ConditionsFollowUp />;
      case "cover":
        return <CoverFollowUp selected={cover} onSelect={setCover} />;
      case "refund-account":
        return (
          <BankFollowUp
            form={bankForm}
            onChange={(patch) =>
              setBankForm((previous) => ({ ...previous, ...patch }))
            }
          />
        );
      case "nominee":
        return <NomineeFollowUp selected={nominees} onToggle={toggleNominee} />;
      case "add-ons":
        return (
          <AddOnsFollowUp
            state={addOns}
            onToggle={toggleAddOn}
            onTermChange={setAddOnTerm}
          />
        );
      default:
        return null;
    }
  }

  /** The blocks the summary can open in place, one per changed answer. */
  const summaryEditors = useMemo(() => {
    const open: Partial<Record<QuestionId, ReactNode>> = {};
    for (const question of questions) {
      if (answers[question.id] === "yes") {
        open[question.id] = followUp(question.id, "summary");
      }
    }
    return open;
    // followUp reads every piece of follow-up state, all listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, pinCode, member, cover, bankForm, contact, nominees, addOns]);

  /* Values the reviewer changed, so the sidebar shows the policy being bought. */
  /* Which proposal steps this journey needs, and therefore whether the
     proposal step belongs on the anchor screen at all. */
  const proposalSteps = useMemo(
    () =>
      proposalStepsFor({
        location: answers.location === "yes",
        members: answers.members === "yes",
      }),
    [answers.location, answers.members],
  );

  /* The health questions are asked about whoever was just added, which is who
     the insurer has no history for. */
  const proposalMembers: ProposalMember[] = useMemo(
    () =>
      answers.members === "yes"
        ? [
            {
              id: "new-member",
              name: member.fullName || "New member",
              relation: member.relationship || "member",
            },
          ]
        : [],
    [answers.members, member.fullName, member.relationship],
  );

  const journeySteps = useMemo(() => {
    const list: IssuanceStepId[] = [];
    if (hasChanges) list.push("kyc");
    if (proposalSteps.length > 0) list.push("proposal");
    list.push("payment", "issuance");
    return list;
  }, [hasChanges, proposalSteps.length]);

  const pinCodeLabel =
    answers.location === "yes" && pinCode.length === 6
      ? `${pinCode}, Chennai`
      : undefined;
  const coverLabel =
    answers.cover === "yes"
      ? coverOptions.find((option) => option.id === cover)?.sidebarLabel
      : undefined;

  /**
   * What hangs off each question. Some blocks are always on the page, others
   * only open once the answer is "Yes".
   */
  function attachment(id: QuestionId) {
    const changed = answers[id] === "yes";

    if (id === "members") {
      return (
        <>
          {/* Who is on the policy today (node 75:5367), shown for reference. */}
          <ul className="mt-5 flex flex-wrap items-center gap-2 pl-0 sm:pl-[39px]">
            {coveredMembers.map((member) => (
              <li
                key={member.id}
                className="flex h-8 items-center rounded-full border border-ink-secondary bg-grey-50 px-3 text-[14px] leading-none font-medium tracking-[-0.14px] text-ink"
              >
                {member.label}
              </li>
            ))}
          </ul>
          {changed ? followUp(id, "review") : null}
        </>
      );
    }

    if (id === "conditions") {
      return (
        <>
          <div className="mt-4 sm:ml-[31px]">
            <ConditionsTable />
          </div>
          {changed ? followUp(id, "review") : null}
        </>
      );
    }

    /* Everything else is just its follow-up, so a new question needs no
       wiring here beyond having one. */
    return changed ? followUp(id, "review") : null;
  }

  if (status === "calculating") {
    return <CalculatingPremium />;
  }

  if (status === "summary") {
    return (
      <RenewalSummary
        lines={summaryLines}
        editors={summaryEditors}
        pinCode={pinCodeLabel}
        cover={coverLabel}
        selectedAddOns={addOns.selected}
        addedMember={
          answers.members === "yes" && member.relationship
            ? member.relationship
            : undefined
        }
        onBack={() => setStatus("review")}
        onBuy={() => {
          setJourneyStep(hasChanges ? "kyc" : "payment");
          setStatus("anchor");
        }}
      />
    );
  }

  if (status === "kyc") {
    return (
      <KycScreen
        onBack={() => setStatus("anchor")}
        onDone={() => {
          setJourneyStep(proposalSteps.length > 0 ? "proposal" : "payment");
          setStatus("anchor");
        }}
      />
    );
  }

  if (status === "proposal") {
    return (
      <ProposalFormScreen
        value={proposal}
        onChange={setProposal}
        steps={proposalSteps}
        members={proposalMembers}
        stepped={steppedForm}
        onToggleStepped={() => setSteppedForm((on) => !on)}
        onBack={() => setStatus("anchor")}
        onClear={() => setProposal(emptyProposal)}
        onSubmit={() => setStatus("proposal-summary")}
      />
    );
  }

  if (status === "proposal-summary") {
    return (
      <ProposalSummaryScreen
        value={proposal}
        members={proposalMembers}
        onBack={() => setStatus("proposal")}
        onEdit={() => setStatus("proposal")}
        onSubmit={() => {
          setJourneyStep("payment");
          setStatus("anchor");
        }}
      />
    );
  }

  if (status === "anchor" || status === "payment-gateway") {
    return (
      <>
      <AnchorScreen
        steps={journeySteps}
        current={journeyStep}
        pinCode={pinCodeLabel}
        cover={coverLabel}
        selectedAddOns={addOns.selected}
        addedMember={
          answers.members === "yes" && member.relationship
            ? member.relationship
            : undefined
        }
        onBack={() => setStatus("summary")}
        onStart={() => {
          if (journeyStep === "kyc") setStatus("kyc");
          else if (journeyStep === "proposal") setStatus("proposal");
          else setStatus("payment-gateway");
        }}
      />
      {status === "payment-gateway" ? (
        <GatewayDialog
          onClose={() => setStatus("anchor")}
          onContinue={() => setStatus("anchor")}
        />
      ) : null}
      </>
    );
  }

  return (
    <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 lg:pt-[82px] xl:px-0">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
        <div className="min-w-0">
          <RenewalDeadlineBanner className="mb-8 lg:hidden" />

          <h1 className="text-[32px] leading-[1.2] font-semibold text-ink">
            Quick answers before renewals
          </h1>
          <p className="mt-3 max-w-[583px] text-[16px] leading-[1.5] text-ink-secondary">
            Premiums shift by city. If you&rsquo;ve moved, we&rsquo;ll re-check
            the price before you renew sometimes it drops.
          </p>

          <ol className="question-list mt-8">
            {questions.map((question, index) => (
              <Question
                key={question.id}
                id={question.id}
                index={index + 1}
                title={question.title}
                description={question.description}
                value={answers[question.id] ?? null}
                onChange={(value) => answer(question.id, value)}
              >
                {attachment(question.id)}
              </Question>
            ))}
          </ol>

          <div className="mt-6 border-t border-grey-150 pt-6">
              <div className="flex items-center justify-end gap-3">
                <p id="confirm-hint" className="sr-only">
                  {complete
                    ? "All questions answered. You can continue."
                    : `${remaining} of ${questions.length} questions still need an answer before you can continue.`}
                </p>
                {hasChanges ? (
                  <button
                    type="button"
                    onClick={clearAllChanges}
                    className="ff-case flex h-10 items-center justify-center rounded-lg border border-grey-200 bg-white px-3 text-[15px] leading-[1.15] font-medium text-ink shadow-card transition-colors hover:bg-grey-50"
                  >
                    Clear all changes
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={!complete}
                  aria-describedby="confirm-hint"
                  onClick={() => setStatus("calculating")}
                  className={`ff-case flex h-10 min-w-[162px] items-center justify-center rounded-lg px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors ${
                    complete
                      ? "cursor-pointer bg-primary hover:bg-primary-hover"
                      : "cursor-not-allowed bg-disabled"
                  }`}
                >
                  Confirm &amp; continue
                </button>
              </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {answeredCount} of {questions.length} questions answered.
          </p>
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-[88px]">
            <PolicySummary />
          </div>
        </aside>
      </div>
    </main>
  );
}
