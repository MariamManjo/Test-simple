export const TASK_OPTIONS = [
  { value: "explain", label: "Explain simply" },
  { value: "steps", label: "Step by step" },
  { value: "examples", label: "Give examples" },
  { value: "summarize", label: "Summarize" },
  { value: "quiz", label: "Quiz me" },
  { value: "outline", label: "Outline essay" },
  { value: "compare", label: "Compare ideas" },
  { value: "feedback", label: "Feedback on draft" },
  { value: "study", label: "Study guide" },
  { value: "other", label: "Something else…", wide: true },
] as const;

export const LEVEL_OPTIONS = [
  { value: "elementary", label: "Elementary (K–5)" },
  { value: "middle", label: "Middle school (6–8)" },
  { value: "high", label: "High school (9–12)" },
  { value: "college", label: "College" },
  { value: "beginner", label: "New to this topic" },
  { value: "review", label: "Know basics — go deeper" },
] as const;

export const FORMAT_OPTIONS = [
  { value: "bullets", label: "Bullet points" },
  { value: "numbered", label: "Numbered steps" },
  { value: "short", label: "Short paragraph" },
  { value: "detailed", label: "Detailed" },
  { value: "table", label: "Table or chart" },
  { value: "analogy", label: "Analogies & examples" },
  { value: "qa", label: "Q&A style" },
] as const;

export const TASK_LABELS: Record<string, string> = {
  explain: "Explain this in simple terms",
  steps: "Walk me through step by step",
  examples: "Give me examples",
  summarize: "Summarize the key points",
  quiz: "Quiz me to check my understanding",
  outline: "Help me outline an essay or project",
  compare: "Compare two ideas or concepts",
  feedback: "Give feedback on my draft",
  study: "Create a study guide",
};

export const LEVEL_LABELS: Record<string, string> = {
  elementary: "elementary school student",
  middle: "middle school student",
  high: "high school student",
  college: "college student",
  beginner: "someone completely new to this topic",
  review: "someone who knows the basics and wants to go deeper",
};

export const FORMAT_LABELS: Record<string, string> = {
  bullets: "bullet points",
  numbered: "numbered steps",
  short: "a short paragraph (under 200 words)",
  detailed: "a detailed explanation",
  table: "a table or chart",
  analogy: "analogies and real-life examples",
  qa: "Q&A style",
};

export type PromptFormState = {
  topic: string;
  task: string;
  taskOther: string;
  level: string;
  format: string;
  extra: string;
};

export function getTaskDescription(task: string, taskOther: string): string | null {
  if (task === "other") return taskOther.trim() || null;
  return task ? TASK_LABELS[task] ?? null : null;
}

export function buildPromptContent(state: PromptFormState): string {
  const topic = state.topic.trim();
  const task = getTaskDescription(state.task, state.taskOther);
  const level = state.level ? LEVEL_LABELS[state.level] : null;
  const format = state.format ? FORMAT_LABELS[state.format] : null;
  const extra = state.extra.trim();
  const parts: string[] = [];

  if (topic || task) {
    let intro = "I am a student";
    if (level) intro += ` (${level})`;
    intro += ". ";
    if (topic) intro += `I am working on: ${topic}. `;
    if (task) intro += `Please ${task.charAt(0).toLowerCase() + task.slice(1)}.`;
    parts.push(intro.trim());
  }

  if (format) parts.push(`Format your answer as ${format}.`);
  if (extra) parts.push(`Additional context: ${extra}`);
  parts.push(
    "If anything is unclear, ask me one short clarifying question before answering."
  );

  return parts.filter(Boolean).join("\n\n");
}

export function isReadyToSave(state: PromptFormState): boolean {
  return !!(
    state.topic.trim() &&
    getTaskDescription(state.task, state.taskOther) &&
    state.level &&
    state.format
  );
}

export function formatPromptDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}
