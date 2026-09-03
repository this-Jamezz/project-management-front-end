import { useState } from "react";

import WorkspaceProjectDropdown from "../Header/WorkSpaceProjectDropdown";
import ProfileDropdown from "../Header/ProfileDropdown";

import WorkspaceSkeleton from "../Skeleton/WorkspaceSkeleton";
import { useNavigate } from "react-router-dom";
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
};

export default function Header({workspaces, activeWorkspace, setActiveWorkspace, activeProject, setActiveProject, getWorkspace} : HeaderProps) {
  const navigate = useNavigate()
  const name = localStorage.getItem("name") || "User";
  const [isLoading, setIsloading] = useState(false)
  const [openCreateWorkSpace, setOpenCreateWorkSpace] = useState(false);


  function handleSwitchWorkspace  (workspace: Workspace) {
    setActiveWorkspace(workspace);

    if (workspace.projects.length > 0) {
      setActiveProject(workspace.projects[0]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/")
  };



  return (
   <>
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {isLoading? 
        (
          <>
            <WorkspaceSkeleton />
          </>
        )
        :
        (
          <>
           {activeWorkspace?
        (
          <WorkspaceProjectDropdown
            workspaces={workspaces}
            activeWorkspace={activeWorkspace}
            activeProject={activeProject}
            onWorkspaceChange={handleSwitchWorkspace}
            onProjectChange={setActiveProject}
            onUpdate={getWorkspace}
          />
        )
        :
        (
          <>
            <div className="p-2 pt-0">
            <button className="w-full rounded-lg border border-dashed border-primary py-2 text-sm text-darkgray transition-colors hover:bg-gray-50 hover:text-gray-900 px-2"
              onClick={()=>setOpenCreateWorkSpace(true)}>
              + Create Workspace
            </button>
          </div>
          </>
        )

      }
          </>
        )

      }
     
      <ProfileDropdown
        name={name}
        onLogout={handleLogout}
      />
    </header>
    {openCreateWorkSpace &&
          <CreateWorkspace onUpdate={getWorkspace} onCancel={()=>setOpenCreateWorkSpace(false)}/>
          }
   </>
  );
}
