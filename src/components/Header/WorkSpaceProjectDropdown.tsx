import { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  Folder,
  Check,
  Settings,
  UserPlus,
} from "lucide-react";


import CreateWorkspace from "../SharedComponents/CreateWorkSpace";
import InviteMemberModal from "../SharedComponents/InviteMemberModal";
import type { Workspace } from "../../interface/workspaceInteface";
import type { Project } from "../../interface/projectInterface";

type WorkspaceProjectDropdownProps = {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  activeProject: Project | null;
  onWorkspaceChange: (workspace: Workspace) => void;
  onProjectChange: (project: Project) => void;
  onUpdate: ()=> void;
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

  const handleWorkspaceChange = (workspace: Workspace) => {
    onWorkspaceChange(workspace);

    // Select the first project of the new workspace
    if (workspace.projects.length > 0) {
      onProjectChange(workspace.projects[0]);
    }
  };

  return (<>
  
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-lightgray"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-white">
          {activeWorkspace.name.charAt(0).toUpperCase()}
        </div>

        <span className="text-sm font-semibold text-primary-dark">
          {activeProject?.name || "No Project"}
        </span>

        <ChevronUp
          size={20}
          className={!open ? "rotate-180" : ""}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border bg-white shadow-xl">
          {/* Workspace Info */}
          <div className="p-4 pb-3">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
                {activeWorkspace.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold leading-tight text-primary-dark">
                  {activeWorkspace.name}
                </h3>

                <p className="mt-0.5 text-xs text-darkgray">
                  {activeWorkspace.members.length} members
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-lightgray px-3 py-1.5 text-sm font-medium text-primary-dark transition-colors hover:bg-lightgray">
                <Settings size={15} />
                Settings
              </button>

              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-lightgray px-3 py-1.5 text-sm font-medium text-primary-dark transition-colors hover:bg-lightgray"
                onClick={()=>setOpenInviteMember(true)}>
                <UserPlus size={15} />
                Invite
              </button>
            </div>
          </div>

          <div className="h-px bg-lightgray" />

          {/* Projects */}
          <div className="p-2">
            <p className="px-2 py-1 text-xs font-semibold text-darkgray">
              Workspace Projects
            </p>

            <div className="mt-1 space-y-0.5">
              {activeWorkspace.projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectChange(project);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                    activeProject?.id === project.id
                      ? "bg-primary-light font-medium text-primary-dark"
                      : "text-primary-dark hover:bg-lightgray"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder
                      size={15}
                      className="text-darkgray"
                    />

                    {project.name}
                  </div>

                  {activeProject?.id === project.id && (
                    <Check
                      size={16}
                      className="text-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-lightgray" />

          {/* Other Workspaces */}
          <div className="p-2">
            <p className="px-2 py-1 text-xs font-semibold text-darkgray">
              Switch Workspaces
            </p>

            <div className="mt-1 space-y-0.5">
              {workspaces
                .filter(
                  (workspace) =>
                    workspace.id !== activeWorkspace.id
                )
                .map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() =>
                      handleWorkspaceChange(workspace)
                    }
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary-dark transition-colors hover:bg-lightgray"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-lightgray text-[10px] font-bold text-darkgray">
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="truncate">
                      {workspace.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Create Workspace */}
          <div className="p-2 pt-0">
            <button className="w-full rounded-lg border border-dashed border-primary py-2 text-sm text-darkgray transition-colors hover:bg-gray-50 hover:text-gray-900 px-2"
              onClick={()=>setOpenCreateWorkSpace(true)}
              >
              + Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
      {openCreateWorkSpace &&
      <CreateWorkspace onUpdate={onUpdate} onCancel={()=>setOpenCreateWorkSpace(false)}/>
      }
      {openInviteMember &&
      <InviteMemberModal onClose={()=>setOpenInviteMember(false)} workspaceId={activeWorkspace.id}/>
      }
      
  </>);
}