"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatingPremium } from "@/components/calculating-premium";
import { Question } from "@/components/question";
import { ConditionsTable } from "@/components/conditions-table";
import {
  PolicySummary,
  RenewalDeadlineBanner,
} from "@/components/policy-summary";
import {
  AddOnsFollowUp,
  BankFollowUp,
  ConditionsFollowUp,
  CoverFollowUp,
  HouseholdFollowUp,
  LocationFollowUp,
  NomineeFollowUp,
  type BankForm,
  type Household,
} from "@/components/follow-ups";
import type { Answer } from "@/components/yes-no-group";
import {
  bankFormDefaults,
  coveredMembers,
  householdOptions,
  nomineeCandidates,
  optionalAddOns,
  questions,
  type QuestionId,
} from "@/lib/renewal-data";

type Answers = Partial<Record<QuestionId, Answer>>;

/** How long the premium calculation screen is held before the result shows. */
const CALCULATING_MS = 3200;

type Status = "review" | "calculating" | "done";

const defaultHousehold: Household = {
  selected: householdOptions
    .filter((option) => option.onPolicy)
    .map((option) => option.id),
  counts: { sons: 1, daughters: 1 },
};
const defaultNominees = nomineeCandidates
  .filter((candidate) => candidate.current)
  .map((candidate) => candidate.id);

export function RenewalReview() {
  const [answers, setAnswers] = useState<Answers>({});
  const [pinCode, setPinCode] = useState("");
  const [household, setHousehold] = useState<Household>(defaultHousehold);
  const [cover, setCover] = useState<string | null>(null);
  const [bankForm, setBankForm] = useState<BankForm>({ ...bankFormDefaults });
  const [nominees, setNominees] = useState<string[]>(defaultNominees);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("review");
  const resultRef = useRef<HTMLDivElement>(null);

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

  const addedAddOns = useMemo(
    () => optionalAddOns.filter((addOn) => addOns.includes(addOn.id)),
    [addOns],
  );

  /* Hold the calculating screen briefly, then show the result. */
  useEffect(() => {
    if (status !== "calculating") return;
    const timer = window.setTimeout(() => setStatus("done"), CALCULATING_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "done") return;
    resultRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [status]);

  function answer(id: QuestionId, value: Answer) {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  }

  function toggleHousehold(id: string) {
    setHousehold((previous) => ({
      ...previous,
      selected: previous.selected.includes(id)
        ? previous.selected.filter((member) => member !== id)
        : [...previous.selected, id],
    }));
  }

  function setHouseholdCount(id: string, next: number) {
    setHousehold((previous) => ({
      ...previous,
      counts: { ...previous.counts, [id]: next },
    }));
  }

  function toggleAddOn(id: string) {
    setAddOns((previous) =>
      previous.includes(id)
        ? previous.filter((addOn) => addOn !== id)
        : [...previous, id],
    );
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
    setHousehold(defaultHousehold);
    setCover(null);
    setBankForm({ ...bankFormDefaults });
    setNominees(defaultNominees);
    setAddOns([]);
  }

  /**
   * What hangs off each question. Some blocks are always on the page, others
   * only open once the answer is "No".
   */
  function attachment(id: QuestionId) {
    const changed = answers[id] === "yes";

    if (id === "location") {
      return changed ? (
        <LocationFollowUp pinCode={pinCode} onPinCodeChange={setPinCode} />
      ) : null;
    }

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
          {changed ? (
            <HouseholdFollowUp
              household={household}
              onToggle={toggleHousehold}
              onCountChange={setHouseholdCount}
            />
          ) : null}
        </>
      );
    }

    if (id === "conditions") {
      return (
        <>
          <div className="mt-4 sm:ml-[31px]">
            <ConditionsTable />
          </div>
          {changed ? <ConditionsFollowUp /> : null}
        </>
      );
    }

    if (id === "cover") {
      return changed ? (
        <CoverFollowUp selected={cover} onSelect={setCover} />
      ) : null;
    }

    if (id === "refund-account") {
      return changed ? (
        <BankFollowUp
          form={bankForm}
          onChange={(patch) =>
            setBankForm((previous) => ({ ...previous, ...patch }))
          }
        />
      ) : null;
    }

    if (id === "nominee") {
      return changed ? (
        <NomineeFollowUp selected={nominees} onToggle={toggleNominee} />
      ) : null;
    }

    if (id === "add-ons") {
      return changed ? (
        <AddOnsFollowUp selected={addOns} onToggle={toggleAddOn} />
      ) : null;
    }

    return null;
  }

  if (status === "calculating") {
    return <CalculatingPremium />;
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
            {status === "done" ? (
              <div
                ref={resultRef}
                role="status"
                className="flex flex-col gap-3 rounded-xl border border-grey-150 bg-grey-50 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-[16px] leading-[1.5] text-ink">
                  Thanks. We&rsquo;ll re-check your premium and send the updated
                  renewal quote to you.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("review")}
                  className="shrink-0 self-start text-[15px] font-medium text-link underline-offset-4 hover:underline sm:self-auto"
                >
                  Review answers
                </button>
              </div>
            ) : (
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
            )}
          </div>

          <p aria-live="polite" className="sr-only">
            {answeredCount} of {questions.length} questions answered.
          </p>
        </div>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-[88px]">
            <PolicySummary addedAddOns={addedAddOns} />
          </div>
        </aside>
      </div>
    </main>
  );
}
