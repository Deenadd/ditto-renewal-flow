"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ChevronDownIcon } from "@/components/icons";
import { PolicyBar } from "@/components/policy-bar";
import { SupportPanel } from "@/components/support-panel";
import { SelectField, TextField } from "@/components/ui/field";
import { YesNoGroup, type Answer } from "@/components/yes-no-group";
import {
  insuredMembers,
  lifestyleQuestions,
  medicalIntro,
  medicalQuestions,
  stateOptions,
  treatmentStatuses,
  treatmentTypes,
} from "@/lib/proposal-data";

/* -------------------------------------------------------------------------
   State
   ------------------------------------------------------------------------- */

export type TreatmentDetail = {
  diagnosis: string;
  consultation: string;
  diagnosisDate: string;
  treatment: string;
  type: string;
  status: string;
};

const emptyDetail: TreatmentDetail = {
  diagnosis: "",
  consultation: "",
  diagnosisDate: "",
  treatment: "",
  type: "",
  status: "",
};

type Section = "basic" | "additional";

export type ProposalState = {
  address: { pin: string; state: string; line1: string; line2: string };
  basic: Record<string, Record<number, Answer>>;
  additional: Record<string, Record<number, Answer>>;
  details: Record<string, Record<number, TreatmentDetail>>;
  lifestyle: {
    smoking: Answer | null;
    smokingCount: string;
    alcohol: Answer | null;
    otherDrugs: Answer | null;
  };
};

export const emptyProposal: ProposalState = {
  address: { pin: "", state: "", line1: "", line2: "" },
  basic: {},
  additional: {},
  details: {},
  lifestyle: {
    smoking: null,
    smokingCount: "",
    alcohol: null,
    otherDrugs: null,
  },
};

const ADDRESS_LIMIT = 60;

/* -------------------------------------------------------------------------
   Pieces
   ------------------------------------------------------------------------- */

function SectionHeading({
  title,
  lead,
}: {
  title: string;
  lead: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[20px] leading-[1.3] font-semibold tracking-[-0.3px] text-ink">
        {title}
      </h2>
      <p className="mt-2 max-w-[546px] text-[16px] leading-[1.5] text-ink-secondary">
        {lead}
      </p>
    </div>
  );
}

function PendingPill({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[13px] leading-none font-medium text-success">
        All answered
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[13px] leading-none font-medium text-attention">
      {count} pending
    </span>
  );
}

function DetailFields({
  value,
  onChange,
}: {
  value: TreatmentDetail;
  onChange: (patch: Partial<TreatmentDetail>) => void;
}) {
  return (
    <div className="mt-4 grid gap-5 sm:grid-cols-2">
      <TextField
        label="Exact diagnosis"
        required
        value={value.diagnosis}
        placeholder="What was diagnosed"
        onChange={(next) => onChange({ diagnosis: next })}
      />
      <TextField
        label="Consultation date"
        required
        type="date"
        value={value.consultation}
        onChange={(next) => onChange({ consultation: next })}
      />
      <TextField
        label="Diagnosis date"
        required
        type="date"
        value={value.diagnosisDate}
        onChange={(next) => onChange({ diagnosisDate: next })}
      />
      <TextField
        label="Treatment details"
        required
        value={value.treatment}
        placeholder="What was prescribed"
        onChange={(next) => onChange({ treatment: next })}
      />
      <SelectField
        label="Select treatment type"
        required
        value={value.type}
        options={treatmentTypes}
        placeholder="Select"
        onChange={(next) => onChange({ type: next })}
      />
      <SelectField
        label="Current status"
        required
        value={value.status}
        options={treatmentStatuses}
        placeholder="Select"
        onChange={(next) => onChange({ status: next })}
      />
    </div>
  );
}

/** One member's block inside a medical history section. */
function MemberBlock({
  memberId,
  name,
  relation,
  section,
  answers,
  details,
  open,
  onToggleOpen,
  onAnswer,
  onDetail,
}: {
  memberId: string;
  name: string;
  relation: string;
  section: Section;
  answers: Record<number, Answer>;
  details: Record<number, TreatmentDetail>;
  open: boolean;
  onToggleOpen: () => void;
  onAnswer: (index: number, value: Answer) => void;
  onDetail: (index: number, patch: Partial<TreatmentDetail>) => void;
}) {
  const pending = medicalQuestions.length - Object.keys(answers).length;

  return (
    <div className="border-t border-grey-150 first:border-t-0">
      <div className="flex items-center justify-between gap-4 py-5">
        <h3 className="ff-figures text-[18px] leading-[1.4] font-semibold text-ink">
          {name}{" "}
          <span className="text-[14px] font-normal tracking-[-0.07px] text-ink-muted">
            ({relation})
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <PendingPill count={pending} />
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} questions for ${name}`}
            onClick={onToggleOpen}
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
        <ul className="flex flex-col pb-2">
          {medicalQuestions.map((question, index) => {
            const answer = answers[index] ?? null;
            const expanded = section === "additional" && answer === "yes";
            const labelId = `${section}-${memberId}-${index}`;

            return (
              <li
                key={question}
                className={
                  expanded
                    ? "motion-safe:animate-reveal my-2 rounded-xl border border-grey-150 bg-white p-4 shadow-card"
                    : "border-b border-grey-150 py-3 last:border-b-0"
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <p
                    id={labelId}
                    className={`text-[16px] leading-[1.4] ${
                      expanded ? "font-medium text-ink" : "text-ink-secondary"
                    }`}
                  >
                    {question}
                  </p>
                  <YesNoGroup
                    name={labelId}
                    value={answer}
                    onChange={(value) => onAnswer(index, value)}
                    labelledBy={labelId}
                  />
                </div>

                {expanded ? (
                  <DetailFields
                    value={details[index] ?? emptyDetail}
                    onChange={(patch) => onDetail(index, patch)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Screen
   ------------------------------------------------------------------------- */

const panelSteps = [
  { id: "address", label: "Communication address" },
  { id: "basic", label: "Medical history 1" },
  { id: "additional", label: "Medical History 2" },
  { id: "lifestyle", label: "Life Style" },
];

const panelNotes: Record<string, { title: string; body: string }> = {
  address: {
    title: "Communication Address",
    body: "The Physical copies of your policy documents will be sent to this address",
  },
  basic: { title: "Medical History 1 - Basic Details", body: medicalIntro },
  additional: {
    title: "Medical History 2 - Additional Details",
    body: medicalIntro,
  },
  lifestyle: { title: "Lifestyle", body: medicalIntro },
};

/** Sidebar tracker that follows the section in view (node 122:8373). */
function StepsPanel({ active }: { active: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kyc/sparkles.png"
        alt=""
        width={360}
        height={157}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none"
      />
      <div className="relative z-10">
        <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
          Proposal form steps
        </h2>
        <p className="mt-2 max-w-[280px] text-[13px] leading-[1.5] text-ink-secondary">
          These steps to ensure the seamless completion of your proposal.
        </p>

        <ol className="mt-4 flex flex-col gap-4">
          {panelSteps.map((step, index) => {
            const isActive = step.id === active;
            const note = panelNotes[step.id];

            return (
              <li key={step.id} className="relative flex items-start gap-3">
                {index < panelSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute top-5 left-[9.5px] h-[calc(100%+4px)] w-px ${
                      isActive ? "bg-focus" : "bg-grey-150"
                    }`}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={`relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] leading-none font-semibold ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-grey-150 text-ink-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span
                    className={`text-[14px] leading-[1.4] ${
                      isActive ? "font-semibold text-ink" : "text-ink-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && note ? (
                    <span className="motion-safe:animate-reveal rounded-lg bg-grey-100 p-3">
                      <span className="block text-[13px] leading-[1.4] font-medium text-ink">
                        {note.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.5] text-ink-secondary">
                        {note.body}
                      </span>
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function ProposalFormScreen({
  value,
  onChange,
  onBack,
  onSubmit,
  onClear,
}: {
  value: ProposalState;
  onChange: (next: ProposalState) => void;
  onBack: () => void;
  onSubmit: () => void;
  onClear: () => void;
}) {
  const [openMember, setOpenMember] = useState<Record<string, boolean>>({
    [`basic-${insuredMembers[0].id}`]: true,
    [`additional-${insuredMembers[0].id}`]: true,
  });
  const [active, setActive] = useState("address");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* Follow the section the reader is in so the sidebar tracker keeps up. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );

    for (const node of Object.values(sectionRefs.current)) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  function setAddress(patch: Partial<ProposalState["address"]>) {
    onChange({ ...value, address: { ...value.address, ...patch } });
  }

  function setAnswer(section: Section, memberId: string, index: number, answer: Answer) {
    onChange({
      ...value,
      [section]: {
        ...value[section],
        [memberId]: { ...(value[section][memberId] ?? {}), [index]: answer },
      },
    });
  }

  function setDetail(
    memberId: string,
    index: number,
    patch: Partial<TreatmentDetail>,
  ) {
    const forMember = value.details[memberId] ?? {};
    onChange({
      ...value,
      details: {
        ...value.details,
        [memberId]: {
          ...forMember,
          [index]: { ...(forMember[index] ?? emptyDetail), ...patch },
        },
      },
    });
  }

  function toggleMember(key: string) {
    setOpenMember((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  const line1Left = ADDRESS_LIMIT - value.address.line1.length;

  return (
    <>
      <div className="mx-auto max-w-[1112px] px-6 xl:px-0">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
          <div />
          <div className="hidden lg:block">
            <PolicyBar />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1112px] px-6 pt-10 pb-24 xl:px-0">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-[63px]">
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
              Proposal form
            </h1>
            <p className="mt-3 text-[16px] leading-[1.4] text-ink-secondary">
              We need to know few details to get you started on your customised
              plan
            </p>

            {/* 1. Communication address */}
            <section
              id="address"
              ref={(node) => {
                sectionRefs.current.address = node;
              }}
              className="mt-10"
            >
              <SectionHeading
                title="Communication Address"
                lead="The Physical copies of your policy documents will be sent to this address"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Pin-code"
                  required
                  value={value.address.pin}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit PIN code"
                  onChange={(next) =>
                    setAddress({ pin: next.replace(/\D/g, "") })
                  }
                />
                <SelectField
                  label="State"
                  required
                  value={value.address.state}
                  options={stateOptions}
                  placeholder="Select state"
                  onChange={(next) => setAddress({ state: next })}
                />
                <TextField
                  label="Address line 1"
                  required
                  multiline
                  maxLength={ADDRESS_LIMIT}
                  value={value.address.line1}
                  placeholder="Enter your address"
                  hint="Characters limit"
                  hintRight={`${line1Left}`}
                  onChange={(next) => setAddress({ line1: next })}
                />
                <TextField
                  label="Address line 2"
                  optional
                  multiline
                  maxLength={ADDRESS_LIMIT}
                  value={value.address.line2}
                  placeholder="Enter your secondary address"
                  hintRight={`${ADDRESS_LIMIT - value.address.line2.length}/${ADDRESS_LIMIT}`}
                  onChange={(next) => setAddress({ line2: next })}
                />
              </div>
            </section>

            {/* 2 and 3. Medical history */}
            {(["basic", "additional"] as Section[]).map((section) => (
              <section
                key={section}
                id={section}
                ref={(node) => {
                  sectionRefs.current[section] = node;
                }}
                className="mt-10 border-t border-grey-150 pt-10"
              >
                <SectionHeading
                  title={
                    section === "basic"
                      ? "Medical History 1 - Basic Details"
                      : "Medical History 2 - Additional Details"
                  }
                  lead={medicalIntro}
                />
                <div>
                  {insuredMembers.map((member) => (
                    <MemberBlock
                      key={member.id}
                      memberId={member.id}
                      name={member.name}
                      relation={member.relation}
                      section={section}
                      answers={value[section][member.id] ?? {}}
                      details={value.details[member.id] ?? {}}
                      open={openMember[`${section}-${member.id}`] ?? false}
                      onToggleOpen={() => toggleMember(`${section}-${member.id}`)}
                      onAnswer={(index, answer) =>
                        setAnswer(section, member.id, index, answer)
                      }
                      onDetail={(index, patch) =>
                        setDetail(member.id, index, patch)
                      }
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* 4. Lifestyle */}
            <section
              id="lifestyle"
              ref={(node) => {
                sectionRefs.current.lifestyle = node;
              }}
              className="mt-10 border-t border-grey-150 pt-10"
            >
              <SectionHeading title="Lifestyle" lead={medicalIntro} />

              <ul className="flex flex-col gap-5">
                {lifestyleQuestions.map((question) => {
                  const answer = value.lifestyle[
                    question.id === "other-drugs"
                      ? "otherDrugs"
                      : (question.id as "smoking" | "alcohol")
                  ];

                  return (
                    <li key={question.id}>
                      <div className="flex items-center justify-between gap-4">
                        <p
                          id={`lifestyle-${question.id}`}
                          className="text-[16px] leading-[1.4] font-medium text-ink"
                        >
                          {question.title}
                        </p>
                        <YesNoGroup
                          name={`lifestyle-${question.id}`}
                          value={answer}
                          onChange={(next) =>
                            onChange({
                              ...value,
                              lifestyle: {
                                ...value.lifestyle,
                                [question.id === "other-drugs"
                                  ? "otherDrugs"
                                  : question.id]: next,
                              },
                            })
                          }
                          labelledBy={`lifestyle-${question.id}`}
                        />
                      </div>

                      {question.detail && answer === "yes" ? (
                        <div className="motion-safe:animate-reveal mt-4 max-w-[314px]">
                          <TextField
                            label={question.detail}
                            required
                            inputMode="numeric"
                            value={value.lifestyle.smokingCount}
                            placeholder="10"
                            onChange={(next) =>
                              onChange({
                                ...value,
                                lifestyle: {
                                  ...value.lifestyle,
                                  smokingCount: next.replace(/\D/g, ""),
                                },
                              })
                            }
                          />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="mt-10 flex items-center justify-end gap-3 border-t border-grey-150 pt-6">
              <button
                type="button"
                onClick={onClear}
                className="ff-case flex h-10 items-center justify-center rounded-lg border border-grey-200 bg-white px-3 text-[15px] leading-[1.15] font-medium text-ink shadow-card transition-colors hover:bg-grey-50"
              >
                Clear all changes
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors hover:bg-primary-hover"
              >
                Confirm and submit
              </button>
            </div>
          </div>

          <aside className="mt-12 lg:mt-0">
            <div className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
              <StepsPanel active={active} />
              <SupportPanel />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
