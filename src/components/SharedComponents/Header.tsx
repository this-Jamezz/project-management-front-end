import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WorkspaceProjectDropdown from "../Header/WorkSpaceProjectDropdown";
import ProfileDropdown from "../Header/ProfileDropdown";

import WorkspaceSkeleton from "../Skeleton/WorkspaceSkeleton";
import CreateWorkspace from "./CreateWorkSpace";

import type { Project } from "../../interface/projectInterface";
import type { Workspace } from "../../interface/workspaceInteface";

type HeaderProps = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  getWorkspace: () => void;
  isLoading: boolean;
};

export default function Header({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  activeProject,
  setActiveProject,
  getWorkspace,
  isLoading,
}: HeaderProps) {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const photoUrl = localStorage.getItem("photoUrl");
  const [openCreateWorkSpace, setOpenCreateWorkSpace] = useState(false);

  /**
   * Single owner of the "workspace changed, what project is selected?" rule.
   *
   * The previous version only reassigned the project when the new workspace
   * had at least one, so switching to an empty workspace left the previous
   * workspace's project selected and the board kept rendering it. Two copies
   * of this rule existed and they disagreed. It lives here only now.
   */
  function handleSwitchWorkspace(workspace: Workspace) {
    setActiveWorkspace(workspace);
    setActiveProject(workspace.projects[0] ?? null);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* z-[60] sits above the Docker rail (z-50) on purpose.

          `.glass` sets `backdrop-filter`, which creates a stacking context on
          this element. Everything inside — the workspace dropdown, the
          profile menu, and the two modals it opens — is painted within that
          context, so raising the header is the only way to get them above the
          rail. At z-30 the dropdown opened underneath Docker and was hidden.

          Both resolve against `.aurora-bg` in Layout, which sets
          `isolation: isolate`. Modals at z-[100] still win, because 100 > 60. */}
      <header className="glass z-[60] flex h-16 shrink-0 items-center gap-3 border-x-0 border-t-0 px-4 md:px-6">
        {/* Brand. The logo is decorative because the name sits beside it, so an
            empty alt avoids announcing the same word twice. */}
        <Link
          to="/board"
          aria-label="iManage home"
          className="flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-1 transition-opacity hover:opacity-80"
        >
          <img
            src="/iManageLogo.png"
            alt=""
            className="h-8 w-8 rounded-lg"
          />
          <span className="hidden text-lg font-semibold tracking-tight sm:block">
            iManage
          </span>
        </Link>

        {/* Divider, hidden on mobile where the name is too */}
        <span
          aria-hidden="true"
          className="glass-divider hidden h-6 w-px shrink-0 sm:block"
        />

        {/* Workspace context */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <WorkspaceSkeleton />
          ) : activeWorkspace ? (
            <WorkspaceProjectDropdown
              workspaces={workspaces}
              activeWorkspace={activeWorkspace}
              activeProject={activeProject}
              onWorkspaceChange={handleSwitchWorkspace}
              onProjectChange={setActiveProject}
              onUpdate={getWorkspace}
            />
          ) : (
            <button
              type="button"
              className="glass-button-ghost w-full cursor-pointer rounded-xl px-4 py-2 text-left text-sm"
              onClick={() => setOpenCreateWorkSpace(true)}
            >
              + Create workspace
            </button>
          )}
        </div>

        <ProfileDropdown
          name={name}
          photoUrl={photoUrl}
          onLogout={handleLogout}
        />
      </header>

      {openCreateWorkSpace && (
        <CreateWorkspace
          onUpdate={getWorkspace}
          onCancel={() => setOpenCreateWorkSpace(false)}
        />
      )}
    </>
  );
}
