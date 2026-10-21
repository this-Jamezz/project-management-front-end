import { useState } from "react";
import {
  LayoutGrid,
  UserCheck,
  Inbox,
  Plus,
  Settings as SettingsIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateItemModal from "./CreateItemModal";
import type { Workspace } from "../../interface/workspaceInteface";
import { createProject } from "../../api/projectApi";
import { createTask } from "../../api/taskApi";
import toast from "react-hot-toast";

type DockerProps = {
  activeWorkspace: Workspace | null;
  getWorkspace: () => void;
};

const TABS = [
  { id: "board", name: "Board", icon: LayoutGrid },
  { id: "inbox", name: "Inbox", icon: Inbox },
  { id: "task", name: "My Task", icon: UserCheck },
  { id: "settings", name: "Settings", icon: SettingsIcon },
];

export default function Docker({ activeWorkspace, getWorkspace }: DockerProps) {
  const [openCreate, setOpenCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Derive the active tab from the URL instead of local state. The previous
  // `useState("home")` matched no tab, so nothing was highlighted on first paint.
  const activeTab = location.pathname.replace(/^\//, "") || "board";

  const projects = activeWorkspace?.projects ?? [];
  const hasProjects = projects.length > 0;

  const workspaceMembers =
    activeWorkspace?.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
    })) ?? [];

  async function handleSubmitProject(projectData: {
    name: string;
    description?: string;
  }) {
    if (!activeWorkspace) {
      toast.error("Select a workspace before creating a project");
      return;
    }

    try {
      setIsSubmitting(true);
      await createProject({
        workspaceId: activeWorkspace.id,
        name: projectData.name.trim(),
        description: projectData.description?.trim(),
      });
      await getWorkspace();
      setOpenCreate(false);
      toast.success("Project created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitTask(taskData: {
    projectId: number;
    title: string;
    description?: string;
    status?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: string;
    assignedToId?: number | string | null;
  }) {
    try {
      setIsSubmitting(true);
      await createTask({
        ...taskData,
        title: taskData.title.trim(),
        description: taskData.description?.trim(),
        assignedToId: taskData.assignedToId || null,
      });
      await getWorkspace();
      setOpenCreate(false);
      toast.success("Task created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCreateClick() {
    if (!activeWorkspace) {
      toast.error("Create or select a workspace first");
      return;
    }
    setOpenCreate(true);
  }

  return (
    <>
      <div
        className="
          fixed
          z-50

          bottom-6
          left-1/2
          -translate-x-1/2
          w-full
          px-5
          max-w-100

          md:top-2
          md:bottom-2
          md:left-2
          md:translate-x-0
          md:w-16
          md:pt-16
          md:px-0
        "
      >
        <div
          className="
            glass

            flex
            items-center
            justify-center

            rounded-2xl

            p-2

            w-full

            md:h-full
            md:flex-col
            md:w-auto
            md:justify-start
          "
        >
          {/* Navigation */}
          <div
            className="
              flex
              items-center
              gap-3

              md:w-full
              md:flex-col
              md:gap-2
            "
          >
            {TABS.map(({ id, name, icon: Icon }, index) => {
              const isActive = activeTab === id;
              // While a create is in flight, absorb every click so a second
              // mutation cannot be queued behind the first.
              const blocked = isSubmitting;

              return (
                <div key={id} className="w-full">
                  {/* Divider */}
                  {index === 1 && (
                    <div
                      className="
                        mx-2
                        mb-2
                        hidden
                        h-px
                        glass-divider
                        md:block
                      "
                    />
                  )}

                  <button
                    type="button"
                    disabled={blocked}
                    // The visible label is `hidden md:block`, so below 768px
                    // these buttons had no accessible name at all. This is the
                    // primary navigation on exactly that viewport.
                    aria-label={name}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => navigate(`/${id}`)}
                    className={`
                      group
                      flex
                      w-full
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      rounded-xl
                      py-2
                      transition-all
                      duration-200
                      disabled:pointer-events-none
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        transition-all

                        ${
                          isActive
                            ? "bg-white/25 text-white shadow-sm"
                            : "text-white/70 hover:bg-white/12 hover:text-white"
                        }
                      `}
                    >
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </div>

                    {/* Title */}
                    <span
                      className={`
                        hidden
                        md:block
                        text-center
                        text-[11px]
                        font-medium
                        leading-none
                        whitespace-nowrap

                        ${isActive ? "text-white" : "text-white/60"}
                      `}
                    >
                      {name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Create */}
          <button
            type="button"
            onClick={handleCreateClick}
            disabled={isSubmitting}
            aria-label="Create a project or task"
            className="
              md:mt-auto
              md:mr-0
              ml-auto
              mr-2

              flex
              w-fit
              md:w-full
              cursor-pointer
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              py-2
              text-white/70
              transition-all
              hover:bg-white/12
              hover:text-white
              active:scale-95
              disabled:pointer-events-none
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <Plus size={24} strokeWidth={2} />
            </div>

            <span className="hidden md:block text-[11px] font-medium leading-none">
              Create
            </span>
          </button>
        </div>
      </div>

      {openCreate && (
        <CreateItemModal
          workspaceMembers={workspaceMembers}
          projects={projects}
          // A task needs a project, so when the workspace has none the
          // modal opens on Project instead of offering an unusable Task tab.
          defaultCreationType={hasProjects ? "task" : "project"}
          isSubmitting={isSubmitting}
          onClose={() => setOpenCreate(false)}
          onSubmitProject={handleSubmitProject}
          onSubmitTask={handleSubmitTask}
        />
      )}
    </>
  );
}
