
import PrivateRoute from "./components/Auth/PrivateRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import Layout from "./layout/Layout";
import NotFoundPage from "./pages/NotFoundPage";

import InboxPage from "./pages/UserPage/InboxPage";
import LandingPage from "./pages/UserPage/LandingPage";
import { Routes, Route } from "react-router-dom";
import TaskPage from "./pages/UserPage/TaskPage";
import BoardPage from "./pages/UserPage/BoardPage";
import { useEffect, useState } from "react";
import { getUserWorkspaces } from "./components/Services/workSpaceServices";
import type { Workspace } from "./interface/workspaceInteface";
import type { Project } from "./interface/projectInterface";
import toast from "react-hot-toast";

function App() {
    
    const [isLoading, setIsloading] = useState(false)
      const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    
      const [activeWorkspace, setActiveWorkspace] =
        useState<Workspace | null>(null);
    
      const [activeProject, setActiveProject] =
        useState<Project | null>(null);

    async function getWorkspace() {
    try {
      setIsloading(true);
      const response = await getUserWorkspaces();

      setWorkspaces(response);



      if (response.length > 0) {
        const workspace = response[0];

        setActiveWorkspace(workspace);

        if (workspace.projects.length > 0) {
          setActiveProject(workspace.projects[0]);
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load workspaces"
      );
    }
    finally{
      setIsloading(false)
    }
  }

  useEffect(() => {
    getWorkspace();
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route >
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout  getWorkspace={getWorkspace} workspaces={workspaces} activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} activeProject={activeProject} setActiveProject={setActiveProject}/>}>
          <Route path="/board" element={<BoardPage/>} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/task" element={<TaskPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;