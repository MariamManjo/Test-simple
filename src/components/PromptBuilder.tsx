"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/ChipGroup";
import {
  FORMAT_OPTIONS,
  LEVEL_OPTIONS,
  TASK_OPTIONS,
  buildPromptContent,
  isReadyToSave,
  type PromptFormState,
} from "@/lib/prompt";

const emptyState: PromptFormState = {
  topic: "",
  task: "",
  taskOther: "",
  level: "",
  format: "",
  extra: "",
};

type PromptBuilderProps = {
  initialState?: Partial<PromptFormState>;
  onSave: (state: PromptFormState) => Promise<void>;
  saving: boolean;
};

export function PromptBuilder({ initialState, onSave, saving }: PromptBuilderProps) {
  const [form, setForm] = useState<PromptFormState>({
    ...emptyState,
    ...initialState,
  });
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => buildPromptContent(form), [form]);
  const ready = isReadyToSave(form);
  const empty =
    !form.topic &&
    !form.task &&
    !form.level &&
    !form.format &&
    !form.extra &&
    !form.taskOther;

  const set = useCallback(
    <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = () => {
    setForm(emptyState);
    setCopied(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const copyAndSave = async () => {
    if (!ready) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      await onSave(form);
      showToast("Copied and saved to your history!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Could not copy — try again.");
    }
  };

  const steps = [
    !!form.topic.trim(),
    !!(form.task && (form.task !== "other" || form.taskOther.trim())),
    !!form.level,
    !!form.format,
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 flex gap-1" aria-hidden>
        {steps.map((done, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${done ? "bg-[#2d6a4f]" : "bg-[#e8e4dc]"}`}
          />
        ))}
      </div>

      <div className="mb-5 rounded-xl bg-[#d8f3dc] p-4 text-sm text-[#1b4332]">
        <strong className="block font-semibold">You’ve got this!</strong>
        Fill in all four steps, then copy — we’ll save it to your history.
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) copyAndSave();
        }}
      >
        <Field id="topic" label="1. What topic are you working on?" hint="Be specific — e.g. photosynthesis, not just science.">
          <input
            id="topic"
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
            placeholder="e.g. World War I causes, quadratic equations"
            className={inputClass}
          />
        </Field>

        <Field id="task" label="2. What do you want the AI to do?" hint="Tap one option.">
          <ChipGroup
            options={TASK_OPTIONS}
            value={form.task}
            onChange={(v) => set("task", v)}
            columns="task"
            ariaLabel="Task type"
          />
          {form.task === "other" && (
            <textarea
              value={form.taskOther}
              onChange={(e) => set("taskOther", e.target.value)}
              placeholder="Describe what you need…"
              className={`${inputClass} mt-3 min-h-[88px]`}
              aria-label="Custom task"
            />
          )}
        </Field>

        <Field id="level" label="3. What’s your level?" hint="Tap your grade or experience.">
          <ChipGroup
            options={LEVEL_OPTIONS}
            value={form.level}
            onChange={(v) => set("level", v)}
            columns="level"
            ariaLabel="Student level"
          />
        </Field>

        <Field id="format" label="4. How should the answer look?" hint="Tap your preferred format.">
          <ChipGroup
            options={FORMAT_OPTIONS}
            value={form.format}
            onChange={(v) => set("format", v)}
            columns="format"
            ariaLabel="Output format"
          />
        </Field>

        <Field
          id="extra"
          label="Anything else? (optional)"
          hint="Deadline, chapter, or what you’ve already tried."
        >
          <textarea
            id="extra"
            value={form.extra}
            onChange={(e) => set("extra", e.target.value)}
            placeholder="e.g. Test on Friday. I read chapter 4 but don’t get problem 7."
            className={`${inputClass} min-h-[88px]`}
          />
        </Field>

        <section aria-live="polite">
          <h2 className="mb-2 text-sm font-semibold">Your prompt</h2>
          <div
            onClick={() => ready && copyAndSave()}
            className={[
              "min-h-[140px] rounded-xl border-2 p-4 text-sm whitespace-pre-wrap break-words",
              empty && "border-dashed border-[#e8e4dc] text-[#5c5c5c] italic",
              !empty && !ready && "border-dashed border-[#e8e4dc] bg-white",
              ready &&
                "cursor-pointer border-solid border-[#2d6a4f] bg-white hover:shadow-md",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {empty
              ? "Start above — your prompt will appear here."
              : content}
          </div>
          <p
            className={`mt-2 text-xs ${ready ? "font-medium text-[#2d6a4f]" : "text-[#5c5c5c]"}`}
          >
            {empty
              ? "Fill all 4 steps to enable copy."
              : ready
                ? "Tap the prompt or button to copy and save."
                : "Complete all four steps above."}
          </p>
        </section>

        <div className="flex flex-col gap-2 pb-4 sm:flex-row">
          <button
            type="submit"
            disabled={!ready || saving}
            className="min-h-12 flex-1 rounded-[10px] bg-[#2d6a4f] px-4 py-3 font-semibold text-white hover:bg-[#1b4332] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saving ? "Saving…" : copied ? "Copied!" : "Copy & save prompt"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="min-h-12 rounded-[10px] border border-[#e8e4dc] bg-white px-4 py-3 font-semibold text-[#1a1a1a] hover:bg-[#f7f5f0]"
          >
            Start over
          </button>
        </div>
      </form>

      {toast && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-[10px] bg-[#1b4332] px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div id={`field-${id}`} className="rounded-xl border border-[#e8e4dc] bg-white p-4 shadow-sm">
      <label htmlFor={id === "task" || id === "level" || id === "format" ? undefined : id} className="block text-sm font-semibold">
        {label}
      </label>
      <p className="mt-1 mb-3 text-xs text-[#5c5c5c]">{hint}</p>
      {children}
    </div>
  );
}

const inputClass =
  "w-full min-h-12 rounded-[10px] border border-[#e8e4dc] bg-[#f7f5f0] px-4 py-3 text-base text-[#1a1a1a] focus:border-[#2d6a4f] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#2d6a4f]";
