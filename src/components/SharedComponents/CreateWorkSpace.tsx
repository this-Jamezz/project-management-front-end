import { useState } from "react";
import { Building2, X } from "lucide-react";
import { createWorkspace } from "../../api/workspaceApi";
import toast from "react-hot-toast";
import Loading from "./Loading";

type CreateWorkspaceProps = {
  onCancel?: () => void;
  onUpdate?: () => void;
};

export default function CreateWorkspace({  onUpdate ,onCancel }: CreateWorkspaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

async function handleCreateWorkspace (
  e: React.FormEvent<HTMLFormElement>
)  {
  e.preventDefault();

  try {
    setIsLoading(true);

    await createWorkspace({
      name,
      description,
    });

     onUpdate?.();

    toast.success("Workspace created successfully");



    onCancel?.();
    

    setName("");
    setDescription("");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to create workspace"
    );
  } finally {
    setIsLoading(false);
  }
};



  return (
    /* Full-screen wrapper to center the modal */
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      
      {/* Main Card Component */}
      <div className="w-full max-w-md rounded-xl border border-lightgray bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-dark">Create Workspace</h2>
              <p className="text-sm text-darkgray">Set up a new space for your projects.</p>
            </div>
          </div>
          
          {/* Optional Close Button */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="cursor-pointer rounded-md p-1 text-darkgray transition-colors hover:bg-lightgray hover:text-primary-dark"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleCreateWorkspace} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-primary-dark">
              Workspace Name <span className="text-primary">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., FoundNest Dev Team"
              className="input-default"
              required
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-primary-dark">
              Description
            </label>
            {/* Note: Replicated the input-default styles but adapted for a textarea (height and padding) */}
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this workspace is for..."
              rows={4}
              className="w-full rounded-lg border border-darkgray px-4 py-3 text-base outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                disabled={isLoading}
                onClick={onCancel}
                className="cursor-pointer h-12 flex-1 rounded-lg border border-lightgray font-medium text-primary-dark transition-colors hover:bg-lightgray"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="button-positive flex-1"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
      {isLoading &&
      <Loading message="Creating Worksapce"/>

      }
    </div>
  );
}