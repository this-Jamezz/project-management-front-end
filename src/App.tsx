import PrivateRoute from "./components/Auth/PrivateRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import Layout from "./layout/Layout";
import NotFoundPage from "./pages/NotFoundPage";

import InboxPage from "./pages/UserPage/InboxPage";
import LandingPage from "./pages/UserPage/LandingPage";
import AuthPage from "./pages/UserPage/AuthPage";
import SettingsPage from "./pages/UserPage/SettingsPage";
import { Routes, Route, useLocation } from "react-router-dom";
import TaskPage from "./pages/UserPage/TaskPage";
import BoardPage from "./pages/UserPage/BoardPage";
import ResetPasswordPage from "./pages/UserPage/ResetPasswordPage";
import { useEffect, useRef, useState } from "react";
import { getUserWorkspaces } from "./api/workspaceApi";
import type { Workspace } from "./interface/workspaceInteface";
import type { Project } from "./interface/projectInterface";
import toast from "react-hot-toast";

/** Routes that render inside Layout and depend on workspace context. */
const PRIVATE_PATHS = ["/board", "/inbox", "/task", "/settings"];

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    const [activeWorkspace, setActiveWorkspace] =
        useState<Workspace | null>(null);

    const [activeProject, setActiveProject] =
        useState<Project | null>(null);

    const [workspaceRefreshKey, setWorkspaceRefreshKey] = useState(0);

    async function getWorkspace() {
        // A visitor without a session (landing page, /login, /register) would
        // otherwise fire a workspace request that can only fail with 401 and
        // toast an error. PrivateRoute sends them to login anyway.
        if (!localStorage.getItem("token")) {
            setActiveWorkspace(null);
            setActiveProject(null);
            return;
        }

        try {
            setIsLoading(true);
            const response = await getUserWorkspaces();

            setWorkspaces(response);

            if (response.length === 0) {
                setActiveWorkspace(null);
                setActiveProject(null);
                return;
            }

            const workspace =
                response.find(
                    (item) => item.id === activeWorkspace?.id
                ) ?? response[0];

            setActiveWorkspace(workspace);

            const project =
                workspace.projects.find(
                    (item) => item.id === activeProject?.id
                ) ?? workspace.projects[0] ?? null;

            setActiveProject(project);
            setWorkspaceRefreshKey((current) => current + 1);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load workspaces"
            );
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Fetch when the user ENTERS the app shell, not once per mount.
     *
     * The previous effect ran only on mount, which is always while the user
     * is still logged out — so after Login navigated to /board nothing ever
     * loaded and the app sat on the "+ Create workspace" empty state until a
     * manual refresh. This version detects the public → private transition,
     * which is exactly the login moment, plus a first load that is already
     * logged in.
     *
     * Moving between /board and /task does NOT refetch — each page loads its
     * own data, and this state is only invalidated by the mutators that call
     * getWorkspace directly (create workspace, invite accepted, logout...).
     */
    const location = useLocation();
    const lastPathRef = useRef("");

    useEffect(() => {
        const isPrivate = PRIVATE_PATHS.some((p) =>
            location.pathname.startsWith(p)
        );
        const wasPrivate = PRIVATE_PATHS.some((p) =>
            lastPathRef.current.startsWith(p)
        );

        if (
            isPrivate &&
            !wasPrivate &&
            localStorage.getItem("token")
        ) {
            getWorkspace();
        }

        lastPathRef.current = location.pathname;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
                {/* Marketing landing page */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth. The path decides which tab opens first. */}
                <Route
                    path="/login"
                    element={<AuthPage initialMode="login" />}
                />
                <Route
                    path="/register"
                    element={<AuthPage initialMode="signup" />}
                />

                {/* Reached from a "reset password" email link. */}
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
                <Route
                    element={
                        <Layout
                            getWorkspace={getWorkspace}
                            workspaceRefreshKey={workspaceRefreshKey}
                            isLoading={isLoading}
                            workspaces={workspaces}
                            activeWorkspace={activeWorkspace}
                            setActiveWorkspace={setActiveWorkspace}
                            activeProject={activeProject}
                            setActiveProject={setActiveProject}
                        />
                    }
                >
                    <Route path="/board" element={<BoardPage />} />
                    <Route path="/inbox" element={<InboxPage />} />
                    <Route path="/task" element={<TaskPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
