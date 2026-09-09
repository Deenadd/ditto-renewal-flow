"use client";

import { useMemo, useState } from "react";
import { Question } from "@/components/question";
import { MemberTag } from "@/components/member-tag";
import { ConditionsTable } from "@/components/conditions-table";
import { BankAccountCard, NomineeCard } from "@/components/detail-cards";
import {
  PolicySummary,
  RenewalDeadlineBanner,
} from "@/components/policy-summary";
import type { Answer } from "@/components/yes-no-group";
import { coveredMembers, questions, type QuestionId } from "@/lib/renewal-data";

type Answers = Partial<Record<QuestionId, Answer>>;

export function RenewalReview() {
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedMembers, setSelectedMembers] = useState<string[]>(() =>
    coveredMembers.map((member) => member.id),
  );
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question.id]).length,
    [answers],
  );
  const remaining = questions.length - answeredCount;
  const complete = remaining === 0;

  function answer(id: QuestionId, value: Answer) {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  }

  function toggleMember(id: string) {
    setSelectedMembers((previous) =>
      previous.includes(id)
        ? previous.filter((member) => member !== id)
        : [...previous, id],
    );
  }

  /** Extra content that hangs off a specific question in the design. */
  function attachment(id: QuestionId) {
    if (id === "members") {
      return (
        <div className="mt-5 flex flex-wrap items-center gap-2 pl-[39px]">
          {coveredMembers.map((member) => (
            <MemberTag
              key={member.id}
              label={member.label}
              selected={selectedMembers.includes(member.id)}
              onToggle={() => toggleMember(member.id)}
            />
          ))}
        </div>
      );
    }

    if (id === "conditions") {
      return (
        <div className="mt-4 sm:ml-[31px]">
          <ConditionsTable />
        </div>
      );
    }

    if (id === "refund-account") {
      return (
        <div className="mt-4 sm:ml-[31px]">
          <BankAccountCard />
        </div>
      );
    }

    if (id === "nominee") {
      return (
        <div className="mt-4 sm:ml-[31px]">
          <NomineeCard />
        </div>
      );
    }

    return null;
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
            {submitted ? (
              <div
                role="status"
                className="flex flex-col gap-3 rounded-xl border border-grey-150 bg-grey-50 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-[16px] leading-[1.5] text-ink">
                  Thanks. We&rsquo;ll re-check your premium and send the updated
                  renewal quote to you.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="shrink-0 self-start text-[15px] font-medium text-link underline-offset-4 hover:underline sm:self-auto"
                >
                  Review answers
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <p id="confirm-hint" className="sr-only">
                  {complete
                    ? "All questions answered. You can continue."
                    : `${remaining} of ${questions.length} questions still need an answer before you can continue.`}
                </p>
                <button
                  type="button"
                  disabled={!complete}
                  aria-describedby="confirm-hint"
                  onClick={() => setSubmitted(true)}
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
            <PolicySummary />
          </div>
        </aside>
      </div>
    </main>
  );
}
