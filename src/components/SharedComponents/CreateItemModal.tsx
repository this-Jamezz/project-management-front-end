import { useState } from "react";
import { X, CheckSquare, FolderGit2 } from "lucide-react";

type Member = {
  id: string;
  name: string;
};

type CreateItemModalProps = {
  workspaceMembers: Member[];
  onClose: () => void;
  onSubmitTask: (taskData: any) => void; // Replace 'any' with your actual Task type
  onSubmitProject: (projectData: any) => void; // Replace 'any' with your actual Project type
};

export default function CreateItemModal({
  workspaceMembers,
  onClose,
  onSubmitTask,
  onSubmitProject,
}: CreateItemModalProps) {
  const [creationType, setCreationType] = useState<"task" | "project">("task");

  // Task State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignTo, setAssignTo] = useState("");

  // Project State
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creationType === "task") {
      onSubmitTask({
        title: taskTitle,
        description: taskDesc,
        status,
        priority,
        dueDate,
        assigneeId: assignTo,
      });
    } else {
      onSubmitProject({
        name: projectName,
        description: projectDesc,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* 
        max-h-[90vh] and overflow-y-auto ensure the modal is scrollable 
        if the screen is too small to fit all the fields.
      */}
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        
        {/* Header & Close */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-dark">Create New...</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1.5 text-darkgray transition-colors hover:bg-lightgray hover:text-primary-dark"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toggle / Tabs */}
        <div className="mb-6 flex gap-2 rounded-xl bg-lightgray p-1.5">
          <button
            type="button"
            onClick={() => setCreationType("task")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
              creationType === "task"
                ? "bg-white text-primary shadow-sm"
                : "text-darkgray hover:text-primary-dark"
            }`}
          >
            <CheckSquare size={18} />
            Task
          </button>
          <button
            type="button"
            onClick={() => setCreationType("project")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
              creationType === "project"
                ? "bg-white text-primary shadow-sm"
                : "text-darkgray hover:text-primary-dark"
            }`}
          >
            <FolderGit2 size={18} />
            Project
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ===================== TASK FIELDS ===================== */}
          {creationType === "task" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                  Task Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Setup database schema"
                  className="w-full rounded-lg border border-darkgray px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Add details about this task..."
                  className="w-full rounded-lg border border-darkgray px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                />
              </div>

              {/* Responsive Grid: 1 col on mobile, 2 cols on small screens and up */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-darkgray bg-white px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-darkgray bg-white px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-darkgray px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                    Assign To
                  </label>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-darkgray bg-white px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
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

          {/* ===================== PROJECT FIELDS ===================== */}
          {creationType === "project" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                  Project Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., FoundNest V2 Mobile App"
                  className="w-full rounded-lg border border-darkgray px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary-dark">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="What is the goal of this project?"
                  className="w-full rounded-lg border border-darkgray px-4 py-2.5 text-base text-primary-dark outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-lightgray pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-lightgray"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-0"
            >
              Create {creationType === "task" ? "Task" : "Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}