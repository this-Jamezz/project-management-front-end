import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronUp,
  Folder,
  Check,
  Settings,
  UserPlus,
} from "lucide-react";

import CreateWorkspace from "../SharedComponents/CreateWorkSpace";
import InviteMemberModal from "../SharedComponents/InviteMemberModal";
import Avatar from "../SharedComponents/Avatar";
import { resolveMediaUrl } from "../../utils/media";
import type { Workspace } from "../../interface/workspaceInteface";
import type { Project } from "../../interface/projectInterface";

type WorkspaceProjectDropdownProps = {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  activeProject: Project | null;
  onWorkspaceChange: (workspace: Workspace) => void;
  onProjectChange: (project: Project) => void;
  onUpdate: () => void;
};

export default function WorkspaceProjectDropdown({
  workspaces,
  activeWorkspace,
  activeProject,
  onWorkspaceChange,
  onProjectChange,
  onUpdate,
}: WorkspaceProjectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [openCreateWorkSpace, setOpenCreateWorkSpace] = useState(false);
  const [openInviteMember, setOpenInviteMember] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Switching workspaces is Header's job, not ours.
   *
   * This used to also pick the first project, duplicating the rule in Header
   * with an `if (projects.length > 0)` guard that left a stale project
   * selected when the target workspace was empty. Header now owns it.
   */
  const handleWorkspaceChange = (workspace: Workspace) => {
    onWorkspaceChange(workspace);
    setOpen(false);
  };

  const otherWorkspaces = workspaces.filter(
    (workspace) => workspace.id !== activeWorkspace.id
  );

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/12"
        >
          <Avatar
            name={activeWorkspace.name}
            src={resolveMediaUrl(activeWorkspace.photoUrl)}
            size="sm"
          />

          <span className="text-sm font-semibold">
            {activeProject?.name || "No project"}
          </span>

          <ChevronUp
            size={18}
            className={`text-white/60 transition-transform duration-200 ${
              open ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            role="menu"
            className="glass-strong animate-pop-in absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-2xl"
          >
            {/* Workspace Info */}
            <div className="p-4 pb-3">
              <div className="mb-4 flex items-center gap-3">
                <Avatar
                  name={activeWorkspace.name}
                  src={resolveMediaUrl(activeWorkspace.photoUrl)}
                  size="md"
                />

                <div className="min-w-0">
                  <h3 className="truncate font-semibold">
                    {activeWorkspace.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/55">
                    {activeWorkspace.members.length}{" "}
                    {activeWorkspace.members.length === 1
                      ? "member"
                      : "members"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                  className="glass-button-ghost flex flex-1 cursor-pointer whitespace-nowrap items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm"
                >
                  <Settings size={15} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={() => setOpenInviteMember(true)}
                  className="glass-button flex flex-1 cursor-pointer whitespace-nowrap items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm"
                >
                  <UserPlus size={15} />
                  Invite
                </button>
              </div>
            </div>

            <div className="glass-divider h-px" />

            {/* Projects */}
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-white/50 uppercase">
                Projects
              </p>

              <div className="mt-1 space-y-0.5">
                {activeWorkspace.projects.length === 0 && (
                  <p className="px-2 py-2 text-xs text-white/45">
                    No projects yet. Use Create to add one.
                  </p>
                )}

                {activeWorkspace.projects.map((project) => {
                  const isActive = activeProject?.id === project.id;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => {
                        onProjectChange(project);
                        setOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white/20 font-medium"
                          : "text-white/75 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Folder
                          size={15}
                          className={
                            isActive ? "text-accent-cyan" : "text-white/45"
                          }
                        />
                        <span className="truncate">{project.name}</span>
                      </div>

                      {isActive && (
                        <Check size={15} className="text-accent-cyan" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other Workspaces */}
            {otherWorkspaces.length > 0 && (
              <>
                <div className="glass-divider h-px" />

                <div className="p-2">
                  <p className="px-2 py-1 text-xs font-semibold tracking-wide text-white/50 uppercase">
                    Switch workspace
                  </p>

                  <div className="mt-1 space-y-0.5">
                    {otherWorkspaces.map((workspace) => (
                      <button
                        key={workspace.id}
                        type="button"
                        onClick={() => handleWorkspaceChange(workspace)}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/75 transition-colors hover:bg-white/10"
                      >
                        <div className="glass-subtle flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold">
                          {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{workspace.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Create Workspace */}
            <div className="p-2 pt-0">
              <button
                type="button"
                onClick={() => setOpenCreateWorkSpace(true)}
                className="glass-button-ghost w-full cursor-pointer rounded-xl border border-dashed border-white/25 px-2 py-2 text-sm"
              >
                + Create workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {openCreateWorkSpace && (
        <CreateWorkspace
          onUpdate={onUpdate}
          onCancel={() => setOpenCreateWorkSpace(false)}
        />
      )}

      {openInviteMember && (
        <InviteMemberModal
          onClose={() => setOpenInviteMember(false)}
          workspaceId={activeWorkspace.id}
        />
      )}
    </>
  );
}
