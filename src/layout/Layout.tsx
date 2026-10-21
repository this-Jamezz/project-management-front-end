import { Outlet } from "react-router-dom";
import Header from "../components/SharedComponents/Header";
import Docker from "../components/SharedComponents/Docker";
import type { Workspace } from "../interface/workspaceInteface";
import type { Project } from "../interface/projectInterface";

type LayoutProps = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  getWorkspace: () => void;
  isLoading: boolean;
  workspaceRefreshKey: number;
};

export default function Layout({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  activeProject,
  setActiveProject,
  getWorkspace,
  isLoading,
  workspaceRefreshKey,
}: LayoutProps) {
  return (
    // h-dvh, not h-screen. On mobile the dynamic toolbar makes 100vh taller
    // than the visible viewport, which pushed the fixed Docker rail under the
    // URL bar and made the bottom of main unreachable.
    <div className="aurora-bg h-dvh text-white">
      <div className="flex h-dvh w-full">
        <Docker activeWorkspace={activeWorkspace} getWorkspace={getWorkspace} />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <Header
            getWorkspace={getWorkspace}
            isLoading={isLoading}
            workspaces={workspaces}
            activeWorkspace={activeWorkspace}
            setActiveWorkspace={setActiveWorkspace}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
          />

          {/* Page content. pb-28 clears the fixed bottom nav on mobile; the
              pages no longer carry their own bottom padding. */}
          <main className="flex-1 overflow-y-auto p-6 pb-28 md:pl-25 md:pb-6">
            <Outlet
              context={{
                activeWorkspace,
                activeProject,
                getWorkspace,
                isLoading,
                workspaceRefreshKey,
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
