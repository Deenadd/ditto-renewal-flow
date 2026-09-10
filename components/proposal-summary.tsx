"use client";

import { useState } from "react";
import { ArrowLeftIcon, CheckMarkIcon, ChevronDownIcon } from "@/components/icons";
import type { ProposalState, TreatmentDetail } from "@/components/proposal-form";
import type { ProposalMember } from "@/components/proposal-form";
import {
  declarations,
  insuredMembers,
  lifestyleQuestions,
  medicalQuestions,
} from "@/lib/proposal-data";

function Card({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-grey-150 bg-white shadow-card">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <h2 className="text-[18px] leading-[1.4] font-semibold text-ink">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {onEdit ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="flex h-8 items-center rounded-lg border border-grey-200 bg-white px-3 text-[14px] leading-none font-medium text-ink transition-colors hover:bg-grey-50"
              >
                Edit
              </button>
              <span aria-hidden="true" className="h-5 w-px bg-grey-150" />
            </>
          ) : null}
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
            onClick={() => setOpen((value) => !value)}
            className="rounded text-ink"
          >
            <ChevronDownIcon
              size={20}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-grey-150 px-5 py-4">{children}</div>
      ) : null}
    </div>
  );
}

function Pair({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <dt className="text-[14px] leading-none text-ink-muted">{label}</dt>
      <dd className="text-[14px] leading-[1.5] text-ink">{children}</dd>
    </div>
  );
}

const detailLabels: [keyof TreatmentDetail, string][] = [
  ["diagnosis", "Exact diagnosis"],
  ["consultation", "Consultation date"],
  ["diagnosisDate", "Diagnosis date"],
  ["treatment", "Treatment details"],
  ["type", "Treatment type"],
  ["status", "Current status"],
];

function AnswerRow({
  question,
  answer,
  detail,
}: {
  question: string;
  answer: "yes" | "no";
  detail?: TreatmentDetail;
}) {
  const filled = detail
    ? detailLabels.filter(([key]) => detail[key]?.trim())
    : [];

  return (
    <li className="border-t border-grey-150 py-3 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[14px] leading-[1.5] text-ink">{question}</p>
        <p
          className={`shrink-0 text-[14px] leading-[1.5] font-medium ${
            answer === "yes" ? "text-success" : "text-error-text"
          }`}
        >
          {answer === "yes" ? "Yes" : "No"}
        </p>
      </div>

      {filled.length > 0 ? (
        <dl className="mt-3 grid gap-4 sm:grid-cols-3">
          {filled.map(([key, label]) => (
            <Pair key={key} label={`${label}:`}>
              {detail?.[key]}
            </Pair>
          ))}
        </dl>
      ) : null}
    </li>
  );
}

export function ProposalSummaryScreen({
  value,
  members,
  onBack,
  onEdit,
  onSubmit,
}: {
  value: ProposalState;
  /** Who the health questions were asked about. */
  members: ProposalMember[];
  onBack: () => void;
  onEdit: () => void;
  onSubmit: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [openMember, setOpenMember] = useState<Record<string, boolean>>({});

  const savedUpTo =
    Object.keys(value.lifestyle).length > 0
      ? "Lifestyle"
      : Object.keys(value.additional).length > 0
        ? "Medical History 2"
        : Object.keys(value.basic).length > 0
          ? "Medical History 1"
          : "Communication Address";

  return (
    <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 xl:px-0">
      <div>
        <div className="min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-[14px] leading-none font-medium text-ink-secondary transition-colors hover:text-ink"
            >
              <ArrowLeftIcon className="shrink-0" />
              Back
            </button>

            <h1 className="text-[32px] leading-[1.1] font-semibold text-ink">
              Summary
            </h1>
            <p className="mt-3 text-[16px] leading-[1.4] text-ink-secondary">
              Please check the information you provided
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Card title="Communication address" onEdit={onEdit}>
                <dl className="grid gap-6 sm:grid-cols-3">
                  <Pair label="Address line 1:">
                    {value.address.line1 || "Not provided"}
                  </Pair>
                  <Pair label="Address line 2:">
                    {value.address.line2 || "Not provided"}
                  </Pair>
                  <Pair label="Pincode:">
                    {[value.address.pin, value.address.state]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </Pair>
                </dl>
              </Card>

              <Card title="Insured members" onEdit={onEdit}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr>
                        {["Full name", "DOB", "Height & Inches (ft/in)", "Weight (kg)"].map(
                          (heading) => (
                            <th
                              key={heading}
                              scope="col"
                              className="pb-3 text-[14px] leading-none font-normal text-ink-muted"
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {insuredMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="py-1 text-[14px] leading-[1.5] text-ink">
                            {member.name}{" "}
                            <span className="text-ink-muted">
                              ({member.relation})
                            </span>
                          </td>
                          <td className="ff-figures py-1 text-[14px] leading-[1.5] text-ink">
                            {member.dob}
                          </td>
                          <td className="ff-figures py-1 text-[14px] leading-[1.5] text-ink">
                            {member.height}
                          </td>
                          <td className="ff-figures py-1 text-[14px] leading-[1.5] text-ink">
                            {member.weight}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {members.map((member) => {
                const basic = value.basic[member.id] ?? {};
                const additional = value.additional[member.id] ?? {};
                const details = value.details[member.id] ?? {};
                const answered =
                  Object.keys(basic).length + Object.keys(additional).length;
                if (answered === 0) return null;

                const open = openMember[member.id] ?? true;

                return (
                  <div
                    key={member.id}
                    className="rounded-xl bg-grey-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-4 px-1 pb-4">
                      <h2 className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
                        {member.name}{" "}
                        <span className="text-[14px] font-normal text-ink-muted">
                          ({member.relation})
                        </span>
                      </h2>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-label={`${open ? "Collapse" : "Expand"} answers for ${member.name}`}
                        onClick={() =>
                          setOpenMember((previous) => ({
                            ...previous,
                            [member.id]: !open,
                          }))
                        }
                        className="rounded text-ink"
                      >
                        <ChevronDownIcon
                          size={20}
                          className={`transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {open ? (
                      <div className="flex flex-col gap-4">
                        {Object.keys(basic).length > 0 ? (
                          <Card title="Basic medical details" onEdit={onEdit}>
                            <ul className="flex flex-col">
                              {medicalQuestions.map((question, index) =>
                                basic[index] ? (
                                  <AnswerRow
                                    key={question}
                                    question={question}
                                    answer={basic[index]}
                                  />
                                ) : null,
                              )}
                            </ul>
                          </Card>
                        ) : null}

                        {Object.keys(additional).length > 0 ? (
                          <Card title="Additional medical details" onEdit={onEdit}>
                            <ul className="flex flex-col">
                              {medicalQuestions.map((question, index) =>
                                additional[index] ? (
                                  <AnswerRow
                                    key={question}
                                    question={question}
                                    answer={additional[index]}
                                    detail={
                                      additional[index] === "yes"
                                        ? details[index]
                                        : undefined
                                    }
                                  />
                                ) : null,
                              )}
                            </ul>
                          </Card>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {members.some((member) => value.lifestyle[member.id]) ? (
                <Card title="Lifestyle" onEdit={onEdit}>
                  <div className="flex flex-col gap-5">
                    {members.map((member) => {
                      const life = value.lifestyle[member.id];
                      if (!life) return null;

                      return (
                        <div key={member.id}>
                          <p className="ff-figures mb-2 text-[14px] leading-none font-semibold text-ink">
                            {member.name}{" "}
                            <span className="font-normal text-ink-muted">
                              ({member.relation})
                            </span>
                          </p>
                          <ul className="flex flex-col">
                            {lifestyleQuestions.map((question) => {
                              const key =
                                question.id === "other-drugs"
                                  ? "otherDrugs"
                                  : (question.id as "smoking" | "alcohol");
                              const answer = life[key];
                              if (!answer) return null;

                              return (
                                <li
                                  key={question.id}
                                  className="flex items-start justify-between gap-4 border-t border-grey-150 py-3 first:border-t-0 first:pt-0"
                                >
                                  <p className="text-[14px] leading-[1.5] text-ink">
                                    {question.title}
                                    {question.id === "smoking" &&
                                    answer === "yes" &&
                                    life.smokingCount ? (
                                      <span className="block text-ink-secondary">
                                        {question.detail}: {life.smokingCount}
                                      </span>
                                    ) : null}
                                  </p>
                                  <p
                                    className={`shrink-0 text-[14px] leading-[1.5] font-medium ${
                                      answer === "yes"
                                        ? "text-success"
                                        : "text-error-text"
                                    }`}
                                  >
                                    {answer === "yes" ? "Yes" : "No"}
                                  </p>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ) : null}

              {/* Declarations */}
              <div className="rounded-xl bg-grey-100 p-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex size-5 shrink-0 items-center justify-center rounded p-0.5 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                      agreed
                        ? "bg-ink text-white"
                        : "border-[1.5px] border-grey-200 bg-white"
                    }`}
                  >
                    {agreed ? <CheckMarkIcon /> : null}
                  </span>
                  <span className="text-[18px] leading-[1.4] font-semibold text-ink">
                    Declarations
                  </span>
                </label>

                <div className="mt-4 flex flex-col gap-3">
                  {declarations.map((text) => (
                    <p
                      key={text.slice(0, 24)}
                      className="text-[14px] leading-[1.5] text-ink-secondary"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-[14px] leading-none text-ink-secondary">
                Saved up to <span className="font-semibold text-ink">{savedUpTo}</span>
              </p>
              <button
                type="button"
                disabled={!agreed}
                onClick={onSubmit}
                className={`ff-case flex h-10 items-center justify-center rounded-lg px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors ${
                  agreed
                    ? "cursor-pointer bg-primary hover:bg-primary-hover"
                    : "cursor-not-allowed bg-disabled"
                }`}
              >
                Confirm and Submit
              </button>
            </div>
        </div>
      </div>
    </main>
  );
}
