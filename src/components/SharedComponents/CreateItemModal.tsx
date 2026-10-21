import { useEffect, useState } from "react";
import {
  X,
  CheckSquare,
  FolderGit2,
  Loader,
  AlertCircle,
  Sparkles,
  ListTree,
} from "lucide-react";
import type { Project } from "../../interface/projectInterface";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../interface/taskInterface";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { getAiStatus, generateDescription, generateSubtasks } from "../../api/aiApi";

type Member = {
  id: number;
  name: string;
};

type CreateItemModalProps = {
  workspaceMembers: Member[];
  projects: Project[];
  /** Which tab opens first. Defaults to Task. */
  defaultCreationType?: "task" | "project";
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmitTask: (taskData: {
    projectId: number;
    title: string;
    description?: string;
    status: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: string;
    assignedToId?: number | string | null;
  }) => void;
  onSubmitProject: (projectData: {
    name: string;
    description?: string;
  }) => void;
};

export default function CreateItemModal({
  workspaceMembers,
  projects,
  defaultCreationType = "task",
  isSubmitting = false,
  onClose,
  onSubmitTask,
  onSubmitProject,
}: CreateItemModalProps) {
  // A task cannot exist without a project, so when the workspace has none
  // the Task tab is unavailable and we open on Project instead.
  const canCreateTask = projects.length > 0;

  const [creationType, setCreationType] =
    useState<"task" | "project">(
      defaultCreationType === "task" && canCreateTask ? "task" : "project"
    );

  // Task State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [projectId, setProjectId] = useState(
    projects[0]?.id.toString() ?? ""
  );

  // Project State
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  // AI State. `aiEnabled` comes from the server, so the buttons simply do not
  // render when no key is configured rather than failing on click.
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiBusy, setAiBusy] = useState<"description" | "subtasks" | null>(null);
  const [aiError, setAiError] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    getAiStatus().then((status) => {
      if (!cancelled) setAiEnabled(status.enabled);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const isAiBusy = aiBusy !== null;

  // A changed title invalidates anything generated from the old one.
  useEffect(() => {
    setSubtasks([]);
    setAiError("");
  }, [taskTitle]);

  async function handleGenerateDescription() {
    if (isAiBusy) return;

    setAiBusy("description");
    setAiError("");

    const result = await generateDescription(taskTitle, taskDesc || undefined);

    setAiBusy(null);

    if (!result.ok) {
      setAiError(result.message);
      return;
    }

    // Landed in an editable field. Never saved automatically.
    setTaskDesc(result.data);
    toast.success("Description generated. Edit it if you like.");
  }

  async function handleGenerateSubtasks() {
    if (isAiBusy) return;

    setAiBusy("subtasks");
    setAiError("");

    const result = await generateSubtasks(taskTitle, taskDesc || undefined);

    setAiBusy(null);

    if (!result.ok) {
      setAiError(result.message);
      return;
    }

    setSubtasks(result.data);
  }

  function addSubtasksToDescription() {
    const bullets = subtasks.map((subtask) => `- [ ] ${subtask}`).join("\n");

    setTaskDesc((current) => (current.trim() ? `${current.trim()}\n\n${bullets}` : bullets));
    setSubtasks([]);
    toast.success("Subtasks added to the description");
  }

  // If projects arrive after the modal opened (or the list changes),
  // fall back to the first one rather than leaving an invalid id.
  useEffect(() => {
    if (projectId && projects.some((p) => p.id.toString() === projectId)) {
      return;
    }
    setProjectId(projects[0]?.id.toString() ?? "");
  }, [projects, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Block a second submit while the first is still in flight.
    if (isSubmitting) return;

    if (creationType === "task") {
      if (!canCreateTask || !projectId) return;

      onSubmitTask({
        projectId: Number(projectId),
        title: taskTitle,
        description: taskDesc,
        status,
        priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        dueDate: dueDate || undefined,
        assignedToId: assignTo || null,
      });
    } else {
      onSubmitProject({
        name: projectName,
        description: projectDesc,
      });
    }
  };

  const canSubmit =
    !isSubmitting &&
    (creationType === "task"
      ? canCreateTask && projectId !== "" && taskTitle.trim() !== ""
      : projectName.trim() !== "");

  const inputClass =
    "glass-input w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <Modal
      onClose={onClose}
      label={`Create ${creationType === "task" ? "task" : "project"}`}
      isBusy={isSubmitting}
      panelClassName="glass-strong animate-modal-in max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-7"
    >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create new</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="glass-button-ghost cursor-pointer rounded-lg p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* No projects: explain why Task is unavailable */}
        {!canCreateTask && (
          <div className="alert-warning mb-4 flex items-start gap-3 rounded-xl border px-4 py-3">
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
            />
            <p className="text-sm">
              This workspace has no projects yet. Create one first — every
              task lives inside a project.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="glass-subtle mb-6 flex rounded-xl p-1">
          <button
            type="button"
            onClick={() => setCreationType("task")}
            disabled={!canCreateTask || isSubmitting}
            aria-pressed={creationType === "task"}
            title={
              canCreateTask
                ? "Create a task"
                : "Create a project before you can add tasks"
            }
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
              creationType === "task"
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/55 hover:text-white/90"
            }`}
          >
            <CheckSquare size={17} />
            Task
          </button>

          <button
            type="button"
            onClick={() => setCreationType("project")}
            disabled={isSubmitting}
            aria-pressed={creationType === "project"}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
              creationType === "project"
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/55 hover:text-white/90"
            }`}
          >
            <FolderGit2 size={17} />
            Project
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ---------------- TASK ---------------- */}
          {creationType === "task" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Project <span className="text-accent-pink">*</span>
                </label>
                <select
                  required
                  value={projectId}
                  disabled={isSubmitting}
                  onChange={(e) => setProjectId(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" disabled>
                    Select a project
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Task title <span className="text-accent-pink">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  disabled={isSubmitting}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Set up the database schema"
                  className={inputClass}
                />
              </div>

              <div>
              <label htmlFor="task-desc" className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="task-desc"
                rows={3}
                value={taskDesc}
                disabled={isSubmitting}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Add details about this task..."
                className={`${inputClass} resize-none`}
              />

              {/* AI actions. Only when Gemini is configured, and never
                  required: the description above is always editable by hand. */}
              {aiEnabled && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting || isAiBusy || taskTitle.trim().length < 3}
                    onClick={handleGenerateDescription}
                    className="glass-button-ghost flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {aiBusy === "description" ? (
                      <Loader size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    {aiBusy === "description"
                      ? "Writing..."
                      : "Generate description"}
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || isAiBusy || taskTitle.trim().length < 3}
                    onClick={handleGenerateSubtasks}
                    className="glass-button-ghost flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {aiBusy === "subtasks" ? (
                      <Loader size={12} className="animate-spin" />
                    ) : (
                      <ListTree size={12} />
                    )}
                    {aiBusy === "subtasks" ? "Splitting..." : "Break into subtasks"}
                  </button>
                </div>
              )}

              {/* Subtask preview, with an explicit hand-off. Never written to
                  the task automatically. */}
              {subtasks.length > 0 && (
                <div className="glass-subtle mt-3 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">
                      Suggested subtasks
                    </p>
                    <button
                      type="button"
                      onClick={addSubtasksToDescription}
                      className="glass-button-ghost cursor-pointer rounded-md px-2 py-1 text-[11px]"
                    >
                      Add all to description
                    </button>
                  </div>

                  <ul className="mt-2 flex flex-col gap-1.5">
                    {subtasks.map((subtask) => (
                      <li
                        key={subtask}
                        className="flex items-start gap-2 text-xs text-white/70"
                      >
                        <CheckSquare
                          size={12}
                          className="mt-0.5 shrink-0 text-accent-violet"
                        />
                        {subtask}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiError && (
                <p className="mt-2 text-xs status-warning" role="status">
                  {aiError}
                </p>
              )}
            </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Status
                  </label>
                  <select
                    value={status}
                    disabled={isSubmitting}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {TASK_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Priority
                  </label>
                  <select
                    value={priority}
                    disabled={isSubmitting}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {TASK_PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    disabled={isSubmitting}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Assign to
                  </label>
                  <select
                    value={assignTo}
                    disabled={isSubmitting}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">Unassigned</option>
                    {workspaceMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- PROJECT ---------------- */}
          {creationType === "project" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Project name <span className="text-accent-pink">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  disabled={isSubmitting}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. iManage v2"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={projectDesc}
                  disabled={isSubmitting}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="What is the goal of this project?"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="glass-divider mt-6 flex items-center justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="glass-button-ghost cursor-pointer rounded-xl px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="glass-button flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-sm disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <Loader size={15} className="animate-spin" />
              )}
              {isSubmitting
                ? "Creating..."
                : `Create ${creationType === "task" ? "task" : "project"}`}
            </button>
          </div>
        </form>
    </Modal>
  );
}
