import { useState } from "react";
import { Building2, X, Loader } from "lucide-react";
import { createWorkspace } from "../../api/workspaceApi";
import toast from "react-hot-toast";
import Modal from "./Modal";

type CreateWorkspaceProps = {
  onCancel?: () => void;
  onUpdate?: () => void;
};

export default function CreateWorkspace({
  onUpdate,
  onCancel,
}: CreateWorkspaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreateWorkspace(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Block a second submit while the first is in flight.
    if (isLoading) return;

    try {
      setIsLoading(true);

      await createWorkspace({
        name: name.trim(),
        description: description.trim(),
      });

      toast.success("Workspace created successfully");

      setName("");
      setDescription("");

      onUpdate?.();
      onCancel?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create workspace"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "glass-input w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <Modal
      onClose={() => onCancel?.()}
      label="Create workspace"
      isBusy={isLoading}
      panelClassName="glass-strong animate-modal-in max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl p-6"
    >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="glass-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-violet/25">
              <Building2 size={20} className="text-accent-violet" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create workspace</h2>
              <p className="text-sm text-white/55">
                A space for your projects and team.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              aria-label="Close"
              className="glass-button-ghost cursor-pointer rounded-lg p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleCreateWorkspace} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Workspace name <span className="text-accent-pink">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Product Team"
              className={inputClass}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              rows={4}
              disabled={isLoading}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            {onCancel && (
              <button
                type="button"
                disabled={isLoading}
                onClick={onCancel}
                className="glass-button-ghost h-12 flex-1 cursor-pointer whitespace-nowrap rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="glass-button flex h-12 flex-1 cursor-pointer whitespace-nowrap items-center justify-center gap-2 rounded-xl text-sm disabled:cursor-not-allowed"
            >
              {isLoading && <Loader size={15} className="animate-spin" />}
              {isLoading ? "Creating..." : "Create workspace"}
            </button>
          </div>
        </form>
    </Modal>
  );
}
