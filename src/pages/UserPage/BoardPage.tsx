import Kanban from "../../components/HomeComponents/Kanban/Kanban";
import { useOutletContext } from "react-router-dom";
import type { Workspace } from "../../interface/workspaceInteface";
import type { Project } from "../../interface/projectInterface";

type BoardContext = {
  activeWorkspace: Workspace | null;
  activeProject: Project | null;
  getWorkspace: () => void;
  isLoading: boolean;
  workspaceRefreshKey: number;
};

export default function BoardPage() {
  const { activeWorkspace, activeProject, isLoading, workspaceRefreshKey } =
    useOutletContext<BoardContext>();

  return (
    <div className="w-full">
      <Kanban
        activeWorkspace={activeWorkspace}
        activeProject={activeProject}
        refreshKey={workspaceRefreshKey}
        isWorkspaceLoading={isLoading}
      />
    </div>
  );
}
