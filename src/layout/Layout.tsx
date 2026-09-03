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
};

export default function Layout( {workspaces, activeWorkspace, setActiveWorkspace, activeProject, setActiveProject, getWorkspace} : LayoutProps) {
 
  return (
    <div className="flex h-screen ">
      <div className="flex h-screen w-full">
        <Docker />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <Header getWorkspace={getWorkspace} workspaces={workspaces} activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} activeProject={activeProject} setActiveProject={setActiveProject}/>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 bg-primary-light/40 md:pl-25">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  )
}