"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  SummaryCheckIcon,
} from "@/components/icons";
import { PolicyBar } from "@/components/policy-bar";
import { SupportPanel } from "@/components/support-panel";
import { SelectField, TextField } from "@/components/ui/field";
import { YesNoGroup, type Answer } from "@/components/yes-no-group";
import {
  lifestyleQuestions,
  medicalQuestions,
  proposalStepMeta,
  proposalStepNotes,
  stateOptions,
  treatmentStatuses,
  treatmentTypes,
  type ProposalStepId,
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

export type Lifestyle = {
  smoking: Answer | null;
  smokingCount: string;
  alcohol: Answer | null;
  otherDrugs: Answer | null;
};

const emptyLifestyle: Lifestyle = {
  smoking: null,
  smokingCount: "",
  alcohol: null,
  otherDrugs: null,
};

type Section = "basic" | "additional";

export type ProposalMember = { id: string; name: string; relation: string };

export type ProposalState = {
  address: { pin: string; state: string; line1: string; line2: string };
  basic: Record<string, Record<number, Answer>>;
  additional: Record<string, Record<number, Answer>>;
  details: Record<string, Record<number, TreatmentDetail>>;
  lifestyle: Record<string, Lifestyle>;
};

export const emptyProposal: ProposalState = {
  address: { pin: "", state: "", line1: "", line2: "" },
  basic: {},
  additional: {},
  details: {},
  lifestyle: {},
};

const ADDRESS_LIMIT = 60;

/* -------------------------------------------------------------------------
   Pieces
   ------------------------------------------------------------------------- */

function SectionHeading({ title, lead }: { title: string; lead: string }) {
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
      <span className="flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[13px] leading-none font-medium text-success">
        All answered
      </span>
    );
  }
  return (
    <span className="flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[13px] leading-none font-medium text-attention">
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
      <TextField label="Exact diagnosis" required value={value.diagnosis} placeholder="What was diagnosed" onChange={(n) => onChange({ diagnosis: n })} />
      <TextField label="Consultation date" required type="date" value={value.consultation} onChange={(n) => onChange({ consultation: n })} />
      <TextField label="Diagnosis date" required type="date" value={value.diagnosisDate} onChange={(n) => onChange({ diagnosisDate: n })} />
      <TextField label="Treatment details" required value={value.treatment} placeholder="What was prescribed" onChange={(n) => onChange({ treatment: n })} />
      <SelectField label="Select treatment type" required value={value.type} options={treatmentTypes} placeholder="Select" onChange={(n) => onChange({ type: n })} />
      <SelectField label="Current status" required value={value.status} options={treatmentStatuses} placeholder="Select" onChange={(n) => onChange({ status: n })} />
    </div>
  );
}

function MemberShell({
  name,
  relation,
  pending,
  open,
  onToggle,
  children,
}: {
  name: string;
  relation: string;
  pending: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
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
            onClick={onToggle}
            className="rounded text-ink"
          >
            <ChevronDownIcon size={20} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open ? children : null}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Sidebar
   ------------------------------------------------------------------------- */

function StepsPanel({
  steps,
  active,
  done,
}: {
  steps: ProposalStepId[];
  active: ProposalStepId;
  done: Set<ProposalStepId>;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey-150 bg-white p-5 shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kyc/sparkles.png" alt="" width={360} height={157} className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full select-none" />
      <div className="relative z-10">
        <h2 className="text-[16px] leading-[1.4] font-semibold text-ink">
          Proposal form steps
        </h2>
        <p className="mt-2 max-w-[280px] text-[13px] leading-[1.5] text-ink-secondary">
          These steps to ensure the seamless completion of your proposal.
        </p>

        <ol className="mt-4 flex flex-col gap-4">
          {steps.map((id, index) => {
            const isActive = id === active;
            const isDone = done.has(id);
            const note = proposalStepNotes[id];

            return (
              <li key={id} className="relative flex items-start gap-3">
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute top-5 left-[9.5px] h-[calc(100%+4px)] w-px ${
                      isDone || isActive ? "bg-focus" : "bg-grey-150"
                    }`}
                  />
                ) : null}
                {isDone ? (
                  <SummaryCheckIcon size={20} className="relative z-10 shrink-0 text-success" />
                ) : (
                  <span
                    aria-hidden="true"
                    className={`relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] leading-none font-semibold ${
                      isActive ? "bg-primary text-white" : "bg-grey-150 text-ink-muted"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span
                    className={`text-[14px] leading-[1.4] ${
                      isActive ? "font-semibold text-ink" : isDone ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    {proposalStepMeta[id].panel}
                  </span>
                  {isActive ? (
                    <span className="motion-safe:animate-reveal rounded-lg bg-grey-100 p-3">
                      <span className="block text-[13px] leading-[1.4] font-medium text-ink">
                        {note.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.5] text-ink-secondary">
                        {note.body}
                      </span>
                      {note.points ? (
                        <span className="mt-2 block">
                          {note.points.map((point, i) => (
                            <span key={point} className="mt-1 flex gap-2 text-[13px] leading-[1.5] text-ink-secondary">
                              <span className="shrink-0">{i + 1}.</span>
                              <span>{point}</span>
                            </span>
                          ))}
                        </span>
                      ) : null}
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

function VersionToggle({
  stepped,
  onToggle,
}: {
  stepped: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={stepped}
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-grey-150 bg-white px-5 py-4 text-left shadow-card transition-colors hover:border-grey-200"
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-[14px] leading-none font-semibold text-ink">
          {stepped ? "Turn off v2 version" : "Turn on v2 version"}
        </span>
        <span className="text-[13px] leading-[1.5] text-ink-secondary">
          {stepped
            ? "Back to the whole form on one page."
            : "Take the form one step at a time."}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`flex h-5 w-[34px] shrink-0 items-center rounded-full p-0.5 transition-colors ${
          stepped ? "bg-primary" : "bg-grey-150"
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${
            stepped ? "translate-x-3.5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------
   Screen
   ------------------------------------------------------------------------- */

export function ProposalFormScreen({
  value,
  onChange,
  steps,
  members,
  stepped,
  onToggleStepped,
  onBack,
  onSubmit,
  onClear,
}: {
  value: ProposalState;
  onChange: (next: ProposalState) => void;
  /** Only the steps the review answers made necessary. */
  steps: ProposalStepId[];
  /** Who the health questions are being asked about. */
  members: ProposalMember[];
  stepped: boolean;
  onToggleStepped: () => void;
  onBack: () => void;
  onSubmit: () => void;
  onClear: () => void;
}) {
  const [openMember, setOpenMember] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);
  const [scrolled, setScrolled] = useState<ProposalStepId>(steps[0] ?? "address");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const current = steps[Math.min(index, steps.length - 1)] ?? steps[0];
  const shown = stepped ? [current] : steps;
  const active = stepped ? current : scrolled;
  const done = new Set(stepped ? steps.slice(0, index) : []);

  /* In the single-page mode the sidebar follows whatever is on screen. */
  useEffect(() => {
    if (stepped) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id as ProposalStepId | undefined;
        if (id) setScrolled(id);
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );
    for (const node of Object.values(sectionRefs.current)) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [stepped, steps.length]);

  function setAddress(patch: Partial<ProposalState["address"]>) {
    onChange({ ...value, address: { ...value.address, ...patch } });
  }

  function setAnswer(section: Section, memberId: string, q: number, answer: Answer) {
    onChange({
      ...value,
      [section]: {
        ...value[section],
        [memberId]: { ...(value[section][memberId] ?? {}), [q]: answer },
      },
    });
  }

  function setDetail(memberId: string, q: number, patch: Partial<TreatmentDetail>) {
    const forMember = value.details[memberId] ?? {};
    onChange({
      ...value,
      details: {
        ...value.details,
        [memberId]: { ...forMember, [q]: { ...(forMember[q] ?? emptyDetail), ...patch } },
      },
    });
  }

  function setLifestyle(memberId: string, patch: Partial<Lifestyle>) {
    onChange({
      ...value,
      lifestyle: {
        ...value.lifestyle,
        [memberId]: { ...(value.lifestyle[memberId] ?? emptyLifestyle), ...patch },
      },
    });
  }

  function isOpen(key: string, fallbackFirst: boolean) {
    return openMember[key] ?? fallbackFirst;
  }

  const last = index >= steps.length - 1;

  function renderStep(id: ProposalStepId) {
    const meta = proposalStepMeta[id];

    if (id === "address") {
      return (
        <>
          <SectionHeading title={meta.title} lead={meta.lead} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Pin-code" required value={value.address.pin} inputMode="numeric" maxLength={6} placeholder="6-digit PIN code" onChange={(n) => setAddress({ pin: n.replace(/\D/g, "") })} />
            <SelectField label="State" required value={value.address.state} options={stateOptions} placeholder="Select state" onChange={(n) => setAddress({ state: n })} />
            <TextField label="Address line 1" required multiline maxLength={ADDRESS_LIMIT} value={value.address.line1} placeholder="Enter your address" hint="Characters limit" hintRight={`${ADDRESS_LIMIT - value.address.line1.length}`} onChange={(n) => setAddress({ line1: n })} />
            <TextField label="Address line 2" optional multiline maxLength={ADDRESS_LIMIT} value={value.address.line2} placeholder="Enter your secondary address" hintRight={`${ADDRESS_LIMIT - value.address.line2.length}/${ADDRESS_LIMIT}`} onChange={(n) => setAddress({ line2: n })} />
          </div>
        </>
      );
    }

    if (id === "lifestyle") {
      return (
        <>
          <SectionHeading title={meta.title} lead={meta.lead} />
          <div>
            {members.map((member, i) => {
              const life = value.lifestyle[member.id] ?? emptyLifestyle;
              const pending = lifestyleQuestions.filter((q) => {
                const key = q.id === "other-drugs" ? "otherDrugs" : (q.id as "smoking" | "alcohol");
                return !life[key];
              }).length;

              return (
                <MemberShell
                  key={member.id}
                  name={member.name}
                  relation={member.relation}
                  pending={pending}
                  open={isOpen(`lifestyle-${member.id}`, i === 0)}
                  onToggle={() =>
                    setOpenMember((p) => ({
                      ...p,
                      [`lifestyle-${member.id}`]: !isOpen(`lifestyle-${member.id}`, i === 0),
                    }))
                  }
                >
                  <ul className="flex flex-col pb-2">
                    {lifestyleQuestions.map((question) => {
                      const key = question.id === "other-drugs" ? "otherDrugs" : (question.id as "smoking" | "alcohol");
                      const answer = life[key];
                      const expanded = Boolean(question.detail) && answer === "yes";
                      const labelId = `lifestyle-${member.id}-${question.id}`;

                      return (
                        <li
                          key={question.id}
                          className={
                            expanded
                              ? "motion-safe:animate-reveal my-2 rounded-xl border border-grey-150 bg-white p-4 shadow-card"
                              : "border-b border-grey-150 py-3 last:border-b-0"
                          }
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p id={labelId} className={`text-[16px] leading-[1.4] ${expanded ? "font-medium text-ink" : "text-ink-secondary"}`}>
                              {question.title}
                            </p>
                            <YesNoGroup name={labelId} value={answer} onChange={(n) => setLifestyle(member.id, { [key]: n })} labelledBy={labelId} />
                          </div>
                          {expanded ? (
                            <div className="mt-4 max-w-[314px]">
                              <TextField label={question.detail as string} required inputMode="numeric" value={life.smokingCount} placeholder="10" onChange={(n) => setLifestyle(member.id, { smokingCount: n.replace(/\D/g, "") })} />
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </MemberShell>
              );
            })}
          </div>
        </>
      );
    }

    const section = id as Section;
    return (
      <>
        <SectionHeading title={meta.title} lead={meta.lead} />
        <div>
          {members.map((member, i) => {
            const answers = value[section][member.id] ?? {};
            const details = value.details[member.id] ?? {};
            const open = isOpen(`${section}-${member.id}`, i === 0);

            return (
              <MemberShell
                key={member.id}
                name={member.name}
                relation={member.relation}
                pending={medicalQuestions.length - Object.keys(answers).length}
                open={open}
                onToggle={() =>
                  setOpenMember((p) => ({ ...p, [`${section}-${member.id}`]: !open }))
                }
              >
                <ul className="flex flex-col pb-2">
                  {medicalQuestions.map((question, q) => {
                    const answer = answers[q] ?? null;
                    const expanded = section === "additional" && answer === "yes";
                    const labelId = `${section}-${member.id}-${q}`;

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
                          <p id={labelId} className={`text-[16px] leading-[1.4] ${expanded ? "font-medium text-ink" : "text-ink-secondary"}`}>
                            {question}
                          </p>
                          <YesNoGroup name={labelId} value={answer} onChange={(v) => setAnswer(section, member.id, q, v)} labelledBy={labelId} />
                        </div>
                        {expanded ? (
                          <DetailFields value={details[q] ?? emptyDetail} onChange={(patch) => setDetail(member.id, q, patch)} />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </MemberShell>
            );
          })}
        </div>
      </>
    );
  }

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
            <button type="button" onClick={onBack} className="mb-4 flex items-center gap-2 text-[14px] leading-none font-medium text-ink-secondary transition-colors hover:text-ink">
              <ArrowLeftIcon className="shrink-0" />
              Back
            </button>

            <h1 className="text-[32px] leading-[1.1] font-semibold text-ink">
              Proposal form
            </h1>
            <p className="mt-3 text-[16px] leading-[1.4] text-ink-secondary">
              We need to know few details to get you started on your customised plan
            </p>

            {/* v2 tab bar */}
            {stepped ? (
              <ol className="mt-6 flex gap-4">
                {steps.map((id, i) => {
                  const isDone = i < index;
                  const isActive = i === index;
                  return (
                    <li key={id} className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-current={isActive ? "step" : undefined}
                        className="flex w-full items-center gap-2 pb-2 text-left"
                      >
                        {isDone ? (
                          <SummaryCheckIcon size={18} className="shrink-0 text-success" />
                        ) : (
                          <span aria-hidden="true" className={`flex size-[18px] shrink-0 items-center justify-center rounded-full text-[10px] leading-none font-semibold ${isActive ? "bg-primary text-white" : "bg-grey-150 text-ink-muted"}`}>
                            {i + 1}
                          </span>
                        )}
                        <span className={`truncate text-[14px] leading-none ${isActive ? "font-semibold text-ink" : isDone ? "text-ink" : "text-ink-muted"}`}>
                          {proposalStepMeta[id].tab}
                        </span>
                      </button>
                      <span aria-hidden="true" className={`block h-0.5 rounded-full ${isDone ? "bg-success" : isActive ? "bg-primary" : "bg-grey-150"}`} />
                    </li>
                  );
                })}
              </ol>
            ) : null}

            {shown.map((id, i) => (
              <section
                key={id}
                id={id}
                ref={(node) => {
                  sectionRefs.current[id] = node;
                }}
                className={
                  stepped
                    ? "mt-8"
                    : i === 0
                      ? "mt-10"
                      : "mt-10 border-t border-grey-150 pt-10"
                }
              >
                {renderStep(id)}
              </section>
            ))}

            <div className="mt-10 flex items-center justify-end gap-3 border-t border-grey-150 pt-6">
              {stepped && !last ? (
                <button type="button" onClick={() => setIndex((i) => i + 1)} className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors hover:bg-primary-hover">
                  Next step
                </button>
              ) : (
                <>
                  <button type="button" onClick={onClear} className="ff-case flex h-10 items-center justify-center rounded-lg border border-grey-200 bg-white px-3 text-[15px] leading-[1.15] font-medium text-ink shadow-card transition-colors hover:bg-grey-50">
                    Clear all changes
                  </button>
                  <button type="button" onClick={onSubmit} className="ff-case flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-[15px] leading-[1.15] font-medium text-ink-inverted transition-colors hover:bg-primary-hover">
                    Confirm and submit
                  </button>
                </>
              )}
            </div>
          </div>

          <aside className="mt-12 lg:mt-0">
            <div className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
              <StepsPanel steps={steps} active={active} done={done} />
              <SupportPanel />
              <VersionToggle stepped={stepped} onToggle={onToggleStepped} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
