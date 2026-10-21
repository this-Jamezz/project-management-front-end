export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string | null;
  projectId?: number | null;
  createdById: number;
  assignedToId?: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * The four Kanban columns.
 *
 * These literals were previously duplicated across Kanban.tsx,
 * CreateItemModal.tsx and Docker.tsx. They live here now so there is one
 * place to change. Note `Task.status` is still free-text in the Prisma
 * schema, so a bad value can still reach the database.
 */
export const TASK_STATUSES = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "REVIEW", label: "Review" },
  { id: "DONE", label: "Done" },
] as const;

export const TASK_PRIORITIES = [
  { id: "LOW", label: "Low" },
  { id: "MEDIUM", label: "Medium" },
  { id: "HIGH", label: "High" },
  { id: "URGENT", label: "Urgent" },
] as const;

/** Display label for a status id, falling back to the raw value. */
export function statusLabel(status: string): string {
  return TASK_STATUSES.find((s) => s.id === status)?.label ?? status;
}

/**
 * Accent colour per column.
 *
 * These MUST stay as complete literal class strings. Tailwind scans source
 * text for class names, so anything built at runtime — e.g.
 * `accent.replace("bg-", "text-")` — is never generated and silently renders
 * with no colour. Separate maps for background and text, both literal.
 *
 * Mid-tone values so they read on the Midnight and Daylight backdrops alike.
 */
export const STATUS_ACCENT_BG: Record<string, string> = {
  TODO: "bg-slate-400",
  IN_PROGRESS: "bg-sky-400",
  REVIEW: "bg-amber-400",
  DONE: "bg-emerald-400",
};

export const STATUS_ACCENT_TEXT: Record<string, string> = {
  TODO: "text-slate-400",
  IN_PROGRESS: "text-sky-400",
  REVIEW: "text-amber-400",
  DONE: "text-emerald-400",
};

export function statusAccentBg(status: string): string {
  return STATUS_ACCENT_BG[status] ?? "bg-white/50";
}

export function statusAccentText(status: string): string {
  return STATUS_ACCENT_TEXT[status] ?? "text-white/60";
}

/** Left-edge stripe colour per priority. Literal strings, same reason. */
export const PRIORITY_STRIPE: Record<string, string> = {
  LOW: "bg-cyan-400",
  MEDIUM: "bg-violet-400",
  HIGH: "bg-orange-400",
  URGENT: "bg-rose-400",
};

export function priorityStripe(priority: string): string {
  return PRIORITY_STRIPE[priority] ?? PRIORITY_STRIPE.MEDIUM;
}
